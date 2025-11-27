#include <Arduino.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>
#include <RTClib.h>
#include <EEPROM.h>

// Guide:
// Buttons: Blue=Up, Yellow=Down, Red=Set, Green=Confirm
// LEDs (LEFT to RIGHT): Pin2=RED(SUN), Pin3=GREEN(SAT), Pin4=BLUE(FRI), Pin5=YELLOW(THU), Pin6=ORANGE(WED), Pin7=PURPLE(TUE), Pin8=CYAN(MON)


// ==================== MEMORY OPTIMIZATION ====================
// LEARNING NOTE: Arduino Uno has only 2KB RAM!
// We use F() macro to store strings in Flash (32KB) instead of RAM
// This prevents memory overflow crashes

// OLED Display
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// RTC Module
RTC_DS1307 rtc;

// Pin definitions
const uint8_t upbtn = 10;
const uint8_t downbtn = 11;
const uint8_t setbtn = 12;
const uint8_t confirmbtn = 13;
const uint8_t buzzer = 9;
const uint8_t ledPins[] = {2, 3, 4, 5, 6, 7, 8};

// Alarm structure (compact to save RAM)
struct Alarm {
  uint8_t hour;    // 0-23
  uint8_t minute;  // 0-59
  bool enabled;
};

// 3 alarms: Morning, Afternoon, Evening
Alarm alarms[3] = {
  {8, 0, true},   // Morning 8:00 AM
  {13, 0, true},  // Afternoon 1:00 PM
  {20, 0, true}   // Evening 8:00 PM
};

// Menu state
enum MenuState { NORMAL, SELECT, EDIT_HR, EDIT_MIN };
MenuState menu = NORMAL;
uint8_t selectedDose = 0;
uint8_t tempHour = 0;
uint8_t tempMinute = 0;

// Debouncing
unsigned long lastBtn = 0;

// ==================== EEPROM FUNCTIONS ====================
void saveAlarms() {
  for (uint8_t i = 0; i < 3; i++) {
    EEPROM.write(i * 3, alarms[i].hour);
    EEPROM.write(i * 3 + 1, alarms[i].minute);
    EEPROM.write(i * 3 + 2, alarms[i].enabled);
  }
}

void loadAlarms() {
  if (EEPROM.read(0) <= 23) {
    for (uint8_t i = 0; i < 3; i++) {
      alarms[i].hour = EEPROM.read(i * 3);
      alarms[i].minute = EEPROM.read(i * 3 + 1);
      alarms[i].enabled = EEPROM.read(i * 3 + 2);
    }
  } else {
    saveAlarms();
  }
}

// ==================== BUTTON FUNCTIONS ====================
bool btnPressed(uint8_t pin) {
  if (digitalRead(pin) == LOW) {
    Serial.print(F("BUTTON PRESSED: Pin "));
    Serial.println(pin);
    unsigned long now = millis();
    if (now - lastBtn > 100) {  // Reduced from 200ms to 100ms for better responsiveness
      lastBtn = now;
      delay(20);  // Reduced from 50ms to 20ms
      if (digitalRead(pin) == LOW) {
        Serial.println(F("BUTTON CONFIRMED!"));
        // Wait for button release to avoid multiple triggers
        while (digitalRead(pin) == LOW) {
          delay(10);
        }
        return true;
      }
    }
  }
  return false;
}

// ==================== TIME FORMATTING ====================
void printTime(uint8_t h, uint8_t m) {
  bool pm = (h >= 12);
  uint8_t displayHr = h;

  if (h > 12) displayHr = h - 12;
  else if (h == 0) displayHr = 12;

  if (displayHr < 10) display.print(' ');
  display.print(displayHr);
  display.print(':');
  if (m < 10) display.print('0');
  display.print(m);
  display.print(pm ? F(" PM") : F(" AM"));
}

// ==================== ALARM CHECK ====================
bool checkAlarm(DateTime &now, uint8_t &idx) {
  for (uint8_t i = 0; i < 3; i++) {
    if (alarms[i].enabled &&
        now.hour() == alarms[i].hour &&
        now.minute() == alarms[i].minute &&
        now.second() == 0) {
      idx = i;
      return true;
    }
  }
  return false;
}

// ==================== DISPLAY FUNCTIONS ====================
void showReminder(uint8_t idx) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println(F("TAKE MEDICATION!"));

  display.setTextSize(2);
  display.setCursor(0, 20);
  if (idx == 0) display.println(F("MORNING"));
  else if (idx == 1) display.println(F("AFTERNOON"));
  else display.println(F("EVENING"));

  display.setTextSize(1);
  display.setCursor(0, 50);
  printTime(alarms[idx].hour, alarms[idx].minute);
  display.display();
}

// Blink only TODAY's LED (not all 7)
void blinkTodayLED(uint8_t dayIdx) {
  static unsigned long lastBlink = 0;
  static bool state = false;

  if (millis() - lastBlink > 500) {
    state = !state;
    // Turn off all LEDs first
    for (uint8_t i = 0; i < 7; i++) {
      digitalWrite(ledPins[i], LOW);
    }
    // Blink only today's LED
    digitalWrite(ledPins[dayIdx], state);
    lastBlink = millis();
  }
}

void triggerAlarm(uint8_t idx) {
  unsigned long start = millis();

  Serial.print(F("ALARM: "));
  if (idx == 0) Serial.println(F("MORNING"));
  else if (idx == 1) Serial.println(F("AFTERNOON"));
  else Serial.println(F("EVENING"));

  // Calculate today's day index for LED (REVERSED mapping)
  DateTime now = rtc.now();
  uint8_t rtcDay = now.dayOfTheWeek();
  uint8_t dayIdx = (7 - rtcDay) % 7;

  Serial.print(F("Alarm - RTC Day: "));
  Serial.print(rtcDay);
  Serial.print(F(" → Blinking LED Index: "));
  Serial.print(dayIdx);
  Serial.print(F(" → Pin "));
  Serial.println(ledPins[dayIdx]);

  // 1 minute urgent phase
  Serial.println(F(">>> BUZZER SHOULD BE BEEPING NOW! Check browser audio."));
  while (millis() - start < 60000) {
    digitalWrite(buzzer, HIGH);
    delay(200);
    digitalWrite(buzzer, LOW);
    delay(800);

    blinkTodayLED(dayIdx);  // Blink only today's LED
    showReminder(idx);

    if (btnPressed(confirmbtn)) {
      digitalWrite(buzzer, LOW);
      for (uint8_t i = 0; i < 7; i++) digitalWrite(ledPins[i], LOW);

      display.clearDisplay();
      display.setTextSize(2);
      display.setCursor(10, 20);
      display.println(F("DOSE"));
      display.println(F("TAKEN!"));
      display.display();
      delay(2000);

      Serial.println(F("STATUS: Dose Taken"));
      return;
    }
  }

  // 14 minute snooze
  digitalWrite(buzzer, LOW);
  while (millis() - start < 900000) {
    if ((millis() - start) % 120000 < 100) {
      digitalWrite(buzzer, HIGH);
      delay(100);
      digitalWrite(buzzer, LOW);
    }

    blinkTodayLED(dayIdx);  // Continue blinking today's LED
    showReminder(idx);

    if (btnPressed(confirmbtn)) {
      for (uint8_t i = 0; i < 7; i++) digitalWrite(ledPins[i], LOW);

      display.clearDisplay();
      display.setTextSize(2);
      display.setCursor(10, 20);
      display.println(F("DOSE"));
      display.println(F("TAKEN!"));
      display.display();
      delay(2000);

      Serial.println(F("STATUS: Dose Taken (Late)"));
      return;
    }
    delay(100);
  }

  // Timeout
  digitalWrite(buzzer, LOW);
  for (uint8_t i = 0; i < 7; i++) digitalWrite(ledPins[i], LOW);

  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(10, 10);
  display.println(F("MISSED"));
  display.println(F("DOSE!"));
  display.display();
  delay(3000);

  Serial.println(F("STATUS: MISSED DOSE"));
}

void showMenu() {
  display.clearDisplay();
  display.setTextSize(1);

  if (menu == SELECT) {
    display.setCursor(0, 0);
    display.println(F("SELECT DOSE:"));

    for (uint8_t i = 0; i < 3; i++) {
      display.print(i == selectedDose ? F("> ") : F("  "));
      if (i == 0) display.print(F("MORNING "));
      else if (i == 1) display.print(F("AFTERNOON "));
      else display.print(F("EVENING "));
      printTime(alarms[i].hour, alarms[i].minute);
      display.println();
    }
    display.println(F("\nUP/DOWN SET=Edit"));

  } else if (menu == EDIT_HR) {
    display.setCursor(0, 0);
    display.println(F("EDIT HOUR:"));
    display.setTextSize(3);
    display.setCursor(30, 25);
    if (tempHour < 10) display.print('0');
    display.print(tempHour);
    display.print(F(":--"));
    display.setTextSize(1);
    display.setCursor(0, 55);
    display.println(F("UP/DOWN SET=Next"));

  } else if (menu == EDIT_MIN) {
    display.setCursor(0, 0);
    display.println(F("EDIT MINUTE:"));
    display.setTextSize(3);
    display.setCursor(30, 25);
    if (tempHour < 10) display.print('0');
    display.print(tempHour);
    display.print(':');
    if (tempMinute < 10) display.print('0');
    display.print(tempMinute);
    display.setTextSize(1);
    display.setCursor(0, 55);
    display.println(F("UP/DOWN SET=Save"));
  }

  display.display();
}

void handleMenu() {
  if (btnPressed(upbtn)) {
    if (menu == SELECT) selectedDose = (selectedDose + 2) % 3;
    else if (menu == EDIT_HR) tempHour = (tempHour + 1) % 24;
    else if (menu == EDIT_MIN) tempMinute = (tempMinute + 1) % 60;
    showMenu();
  }

  if (btnPressed(downbtn)) {
    if (menu == SELECT) selectedDose = (selectedDose + 1) % 3;
    else if (menu == EDIT_HR) tempHour = (tempHour + 23) % 24;
    else if (menu == EDIT_MIN) tempMinute = (tempMinute + 59) % 60;
    showMenu();
  }

  if (btnPressed(setbtn)) {
    if (menu == SELECT) {
      menu = EDIT_HR;
      tempHour = alarms[selectedDose].hour;
      tempMinute = alarms[selectedDose].minute;
    } else if (menu == EDIT_HR) {
      menu = EDIT_MIN;
    } else if (menu == EDIT_MIN) {
      alarms[selectedDose].hour = tempHour;
      alarms[selectedDose].minute = tempMinute;
      saveAlarms();
      menu = NORMAL;

      display.clearDisplay();
      display.setCursor(20, 20);
      display.println(F("SAVED!"));
      display.display();
      delay(1000);
    }
    showMenu();
  }
}

void showNormal(DateTime &now) {
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(10, 0);

  if (now.hour() < 10) display.print('0');
  display.print(now.hour());
  display.print(':');
  if (now.minute() < 10) display.print('0');
  display.print(now.minute());
  display.print(':');
  if (now.second() < 10) display.print('0');
  display.println(now.second());

  const char* days[] = {"SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"};
  display.setTextSize(1);
  display.setCursor(10, 25);
  display.print(F("Day: "));
  display.println(days[now.dayOfTheWeek()]);

  display.setCursor(0, 40);
  display.println(F("Alarms:"));
  for (uint8_t i = 0; i < 3; i++) {
    if (alarms[i].enabled) {
      if (i == 0) display.print('M');
      else if (i == 1) display.print('A');
      else display.print('E');
      display.print(':');
      printTime(alarms[i].hour, alarms[i].minute);
      display.print(' ');
    }
  }

  display.display();
}

// ==================== SETUP ====================
void setup() {
  Serial.begin(9600);
  delay(500);
  Serial.println(F("Smart Medication Reminder"));

  // I2C
  delay(500);
  Wire.begin();
  delay(500);
  Serial.println(F("I2C OK"));

  // OLED
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println(F("Medication"));
  display.println(F("Reminder"));
  display.println(F("Starting..."));
  display.display();
  Serial.println(F("OLED OK"));
  delay(2000);

  // RTC
  if (rtc.begin()) {
    Serial.println(F("RTC OK"));
    if (!rtc.isrunning()) {
      rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    }
  }

  // LEDs
  for (uint8_t i = 0; i < 7; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], LOW);
  }

  // Buttons - Using INPUT mode (external 10kΩ pull-ups in diagram)
  pinMode(upbtn, INPUT);
  pinMode(downbtn, INPUT);
  pinMode(setbtn, INPUT);
  pinMode(confirmbtn, INPUT);
  Serial.println(F("Buttons initialized (using external pull-ups)"));

  // Buzzer
  pinMode(buzzer, OUTPUT);
  digitalWrite(buzzer, LOW);

  // Load alarms
  loadAlarms();

  Serial.println(F("Setup Complete!"));
}

// ==================== MAIN LOOP ====================
void loop() {
  DateTime now = rtc.now();

  // BUZZER TEST: Press CONFIRM button to test buzzer
  if (menu == NORMAL && btnPressed(confirmbtn)) {
    Serial.println(F("*** BUZZER TEST ***"));
    Serial.println(F("NOTE: VS Code Wokwi does NOT play buzzer audio!"));
    Serial.println(F("But the buzzer IS working - watch the LED flash!"));

    for (int i = 0; i < 3; i++) {
      digitalWrite(buzzer, HIGH);
      // Flash all LEDs to show buzzer is active
      for (uint8_t j = 0; j < 7; j++) digitalWrite(ledPins[j], HIGH);

      Serial.print(F("BEEP "));
      Serial.print(i + 1);
      Serial.println(F(" - Buzzer HIGH"));
      delay(300);

      digitalWrite(buzzer, LOW);
      for (uint8_t j = 0; j < 7; j++) digitalWrite(ledPins[j], LOW);

      Serial.println(F("  - Buzzer LOW"));
      delay(300);
    }
    Serial.println(F("*** Buzzer test complete! Buzzer IS working! ***"));
  }

  if (menu == NORMAL && btnPressed(setbtn)) {
    menu = SELECT;
    selectedDose = 0;
    showMenu();
  }

  if (menu != NORMAL) {
    handleMenu();
  } else {
    showNormal(now);

    // Light current day LED
    for (uint8_t i = 0; i < 7; i++) digitalWrite(ledPins[i], LOW);

    // REVERSED LED Mapping:
    // RTC: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    // LED: Pin2=RED(Sun), Pin3=GREEN(Sat), Pin4=BLUE(Fri), Pin5=YELLOW(Thu), Pin6=ORANGE(Wed), Pin7=PURPLE(Tue), Pin8=CYAN(Mon)
    uint8_t rtcDay = now.dayOfTheWeek();
    uint8_t dayIdx = (7 - rtcDay) % 7;

    digitalWrite(ledPins[dayIdx], HIGH);

    Serial.print(F("RTC Day: "));
    Serial.print(rtcDay);
    Serial.print(F(" → LED Index: "));
    Serial.print(dayIdx);
    Serial.print(F(" → Pin "));
    Serial.println(ledPins[dayIdx]);

    // Check alarms
    uint8_t alarmIdx;
    if (checkAlarm(now, alarmIdx)) {
      triggerAlarm(alarmIdx);
    }
  }

  delay(100);
}
