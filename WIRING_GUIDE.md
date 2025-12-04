# Medication Reminder - Wiring Guide

This document provides complete wiring instructions for the Smart Medication Reminder project. All connections are routed through the breadboard for a realistic, beginner-friendly setup.

---

## Table of Contents
1. [Components List](#components-list)
2. [Power Connections](#power-connections)
3. [RTC Module (DS1307)](#rtc-module-ds1307)
4. [OLED Display (SSD1306)](#oled-display-ssd1306)
5. [Buzzer](#buzzer)
6. [Power Switch](#power-switch)
7. [Buttons with Pull-up Resistors](#buttons-with-pull-up-resistors)
8. [Day LEDs with Current-Limiting Resistors](#day-leds-with-current-limiting-resistors)
9. [Breadboard Layout Summary](#breadboard-layout-summary)
10. [Pin Assignment Summary](#pin-assignment-summary)

---

## Components List

### Main Components
- **Arduino Uno** (1x)
- **Breadboard** (1x full-size)
- **DS1307 RTC Module** (1x)
- **SSD1306 OLED Display (128x64, I2C)** (1x)
- **Buzzer** (1x)
- **Slide Switch** (1x) - Power ON/OFF

### Buttons
- **Pushbuttons** (5x):
  - Blue button (UP)
  - Yellow button (DOWN)
  - Red button (SET)
  - Green button (CONFIRM)
  - Black button (HOME)

### LEDs & Resistors
- **LEDs** (7x) - One for each day of the week:
  - Red LED (Sunday)
  - Green LED (Monday)
  - Blue LED (Tuesday)
  - Yellow LED (Wednesday)
  - Orange LED (Thursday)
  - Purple LED (Friday)
  - Cyan LED (Saturday)
- **220Ω Resistors** (7x) - For LEDs
- **10kΩ Resistors** (5x) - Pull-up resistors for buttons

---

## Power Connections

### Arduino to Breadboard Power Rails

| From          | To                      | Wire Color | Description                    |
|---------------|-------------------------|------------|--------------------------------|
| Arduino 5V    | Breadboard + rail       | Red        | Main power supply              |
| Arduino GND   | Breadboard - rail       | Black      | Common ground                  |

**Note:** All components draw power from these breadboard rails.

---

## RTC Module (DS1307)

The RTC (Real-Time Clock) keeps track of the current time and date.

### RTC Connections

| RTC Pin | Breadboard Connection    | Arduino Pin | Wire Color | Description           |
|---------|--------------------------|-------------|------------|-----------------------|
| 5V      | Breadboard + rail        | -           | Red        | Power                 |
| GND     | Breadboard - rail        | -           | Black      | Ground                |
| SDA     | Row 1t (hole A)          | -           | Cyan       | I2C Data line         |
| SCL     | Row 2t (hole A)          | -           | Magenta    | I2C Clock line        |

### I2C Bus to Arduino

| Breadboard        | Arduino Pin | Wire Color | Description           |
|-------------------|-------------|------------|-----------------------|
| Row 1t (hole B)   | A4          | Cyan       | I2C Data (SDA)        |
| Row 2t (hole B)   | A5          | Magenta    | I2C Clock (SCL)       |

**How It Works:**
- RTC SDA connects to breadboard row 1, hole A
- From the same row (hole B), wire goes to Arduino A4
- RTC SCL connects to breadboard row 2, hole A
- From the same row (hole B), wire goes to Arduino A5
- This allows OLED to share the same I2C bus

---

## OLED Display (SSD1306)

The OLED displays time, alarms, and messages to the user.

### OLED Connections

| OLED Pin | Breadboard Connection    | Description           | Wire Color |
|----------|--------------------------|-----------------------|------------|
| GND      | Breadboard - rail        | Ground                | Black      |
| VCC      | Breadboard + rail        | Power                 | Red        |
| SDA      | Row 1t (hole C)          | I2C Data (shared)     | Blue       |
| SCL      | Row 2t (hole C)          | I2C Clock (shared)    | Purple     |

**I2C Address:** 0x3C

**How It Works:**
- OLED shares the same I2C bus with RTC
- Row 1t has: RTC SDA (hole A), Arduino A4 wire (hole B), OLED SDA (hole C)
- Row 2t has: RTC SCL (hole A), Arduino A5 wire (hole B), OLED SCL (hole C)
- All holes in the same row are electrically connected

---

## Buzzer

The buzzer sounds alarms to remind users to take medication.

### Buzzer Connections

| Buzzer Pin | Connection               | Wire Color | Description           |
|------------|--------------------------|------------|-----------------------|
| Pin 2      | Arduino Pin 9            | Orange     | Signal (PWM)          |
| Pin 1      | Breadboard - rail        | Black      | Ground                |

**Note:** The buzzer is controlled by pin 9 with HIGH/LOW signals.

---

## Power Switch

Slide switch to turn the entire system ON/OFF.

### Switch Connections

| Switch Pin | Connection               | Wire Color | Description           |
|------------|--------------------------|------------|-----------------------|
| Pin 1      | Arduino Pin A1           | Red        | Signal                |
| Pin 2      | Breadboard - rail        | Black      | Ground                |

**How It Works:**
- When switch is RIGHT (HIGH): System ON
- When switch is LEFT (LOW): System OFF

---

## Buttons with Pull-up Resistors

Each button uses a pull-up resistor configuration for reliable button detection.

### Button Wiring Pattern

Each button follows this pattern:
1. Button signal pin → Breadboard row (hole A)
2. Same row (hole B) → Arduino digital pin
3. Same row (hole C) → Pull-up resistor (one end)
4. Pull-up resistor (other end) → Breadboard + rail
5. Button ground pin → Breadboard - rail

---

### Button 4 - BLUE (UP Button)

| Component        | From                | To                   | Wire Color | Notes                 |
|------------------|---------------------|----------------------|------------|-----------------------|
| Button Pin 2     | btn4:2.l            | Row 64t (hole A)     | Blue       | Signal pin            |
| Breadboard       | Row 64t (hole B)    | Arduino Pin 10       | Blue       | To microcontroller    |
| Pull-up R12      | Row 64t (hole C)    | R12 Pin 1            | Yellow     | 10kΩ resistor         |
| Pull-up R12      | R12 Pin 2           | Breadboard + rail    | Lime Green | To 5V                 |
| Button Pin 1     | btn4:1.l            | Breadboard - rail    | Black      | Ground                |

---

### Button 1 - YELLOW (DOWN Button)

| Component        | From                | To                   | Wire Color | Notes                 |
|------------------|---------------------|----------------------|------------|-----------------------|
| Button Pin 1     | btn1:1.l            | Row 65t (hole A)     | Blue       | Signal pin            |
| Breadboard       | Row 65t (hole B)    | Arduino Pin 11       | Blue       | To microcontroller    |
| Pull-up R8       | Row 65t (hole C)    | R8 Pin 1             | Yellow     | 10kΩ resistor         |
| Pull-up R8       | R8 Pin 2            | Breadboard + rail    | Lime Green | To 5V                 |
| Button Pin 2     | btn1:2.l            | Breadboard - rail    | Black      | Ground                |

---

### Button 3 - RED (SET Button)

| Component        | From                | To                   | Wire Color | Notes                 |
|------------------|---------------------|----------------------|------------|-----------------------|
| Button Pin 1     | btn3:1.l            | Row 66t (hole A)     | Blue       | Signal pin            |
| Breadboard       | Row 66t (hole B)    | Arduino Pin 12       | Blue       | To microcontroller    |
| Pull-up R9       | Row 66t (hole C)    | R9 Pin 1             | Yellow     | 10kΩ resistor         |
| Pull-up R9       | R9 Pin 2            | Breadboard + rail    | Lime Green | To 5V                 |
| Button Pin 2     | btn3:2.l            | Breadboard - rail    | Black      | Ground                |

---

### Button 2 - GREEN (CONFIRM Button)

| Component        | From                | To                   | Wire Color | Notes                 |
|------------------|---------------------|----------------------|------------|-----------------------|
| Button Pin 1     | btn2:1.l            | Row 67t (hole A)     | Blue       | Signal pin            |
| Breadboard       | Row 67t (hole B)    | Arduino Pin 13       | Blue       | To microcontroller    |
| Pull-up R11      | Row 67t (hole C)    | R11 Pin 1            | Yellow     | 10kΩ resistor         |
| Pull-up R11      | R11 Pin 2           | Breadboard + rail    | Lime Green | To 5V                 |
| Button Pin 2     | btn2:2.l            | Breadboard - rail    | Black      | Ground                |

---

### Button 5 - BLACK (HOME Button)

| Component        | From                | To                   | Wire Color | Notes                 |
|------------------|---------------------|----------------------|------------|-----------------------|
| Button Pin 1     | btn5:1.l            | Row 68t (hole A)     | Blue       | Signal pin            |
| Breadboard       | Row 68t (hole B)    | Arduino Pin A0       | Blue       | To microcontroller    |
| Pull-up R10      | Row 68t (hole C)    | R10 Pin 2            | Yellow     | 10kΩ resistor         |
| Pull-up R10      | R10 Pin 1           | Breadboard + rail    | Lime Green | To 5V                 |
| Button Pin 2     | btn5:2.l            | Breadboard - rail    | Black      | Ground                |

---

## Day LEDs with Current-Limiting Resistors

Each LED represents a day of the week and lights up to show the current day.

### LED Wiring Pattern

Each LED follows this pattern:
1. LED Anode (+) → Breadboard row (side A)
2. Same row → Arduino digital pin (provides current)
3. LED Cathode (-) → Breadboard row (side A, different row)
4. Same row → Current-limiting resistor (220Ω)
5. Resistor → Breadboard - rail (ground)

---

### LED7 - RED (Sunday)

| Component    | From              | To                   | Arduino Pin | Resistor |
|--------------|-------------------|----------------------|-------------|----------|
| LED Anode    | led7:A            | Row 3t (side A)      | -           | -        |
| LED Cathode  | led7:C            | Row 2t (side A)      | -           | -        |
| Resistor R6  | Row 3t (side B)   | Row 9t (side B)      | -           | 220Ω     |
| Signal       | Row 9t (side A)   | Arduino Pin 2        | Pin 2       | -        |
| Ground       | Row 11t (side B)  | Breadboard - rail    | -           | -        |

---

### LED6 - GREEN (Monday)

| Component    | From              | To                   | Arduino Pin | Resistor |
|--------------|-------------------|----------------------|-------------|----------|
| LED Anode    | led6:A            | Row 12t (side A)     | -           | -        |
| LED Cathode  | led6:C            | Row 11t (side A)     | -           | -        |
| Resistor R5  | Row 12t (side B)  | Row 18t (side B)     | -           | 220Ω     |
| Signal       | Row 18t (side A)  | Arduino Pin 3        | Pin 3       | -        |
| Ground       | Row 20t (side B)  | Breadboard - rail    | -           | -        |

---

### LED5 - BLUE (Tuesday)

| Component    | From              | To                   | Arduino Pin | Resistor |
|--------------|-------------------|----------------------|-------------|----------|
| LED Anode    | led5:A            | Row 21t (side A)     | -           | -        |
| LED Cathode  | led5:C            | Row 20t (side A)     | -           | -        |
| Resistor R4  | Row 21t (side B)  | Row 27t (side B)     | -           | 220Ω     |
| Signal       | Row 27t (side A)  | Arduino Pin 4        | Pin 4       | -        |
| Ground       | Row 29t (side B)  | Breadboard - rail    | -           | -        |

---

### LED4 - YELLOW (Wednesday)

| Component    | From              | To                   | Arduino Pin | Resistor |
|--------------|-------------------|----------------------|-------------|----------|
| LED Anode    | led4:A            | Row 30t (side A)     | -           | -        |
| LED Cathode  | led4:C            | Row 29t (side A)     | -           | -        |
| Resistor R3  | Row 30t (side B)  | Row 36t (side B)     | -           | 220Ω     |
| Signal       | Row 36t (side A)  | Arduino Pin 5        | Pin 5       | -        |
| Ground       | Row 38t (side B)  | Breadboard - rail    | -           | -        |

---

### LED3 - ORANGE (Thursday)

| Component    | From              | To                   | Arduino Pin | Resistor |
|--------------|-------------------|----------------------|-------------|----------|
| LED Anode    | led3:A            | Row 39t (side A)     | -           | -        |
| LED Cathode  | led3:C            | Row 38t (side A)     | -           | -        |
| Resistor R2  | Row 39t (side B)  | Row 45t (side B)     | -           | 220Ω     |
| Signal       | Row 45t (side A)  | Arduino Pin 6        | Pin 6       | -        |
| Ground       | Row 47t (side B)  | Breadboard - rail    | -           | -        |

---

### LED2 - PURPLE (Friday)

| Component    | From              | To                   | Arduino Pin | Resistor |
|--------------|-------------------|----------------------|-------------|----------|
| LED Anode    | led2:A            | Row 48t (side A)     | -           | -        |
| LED Cathode  | led2:C            | Row 47t (side A)     | -           | -        |
| Resistor R1  | Row 48t (side B)  | Row 54t (side B)     | -           | 220Ω     |
| Signal       | Row 54t (side A)  | Arduino Pin 7        | Pin 7       | -        |
| Ground       | Row 55t (side B)  | Breadboard - rail    | -           | -        |

---

### LED1 - CYAN (Saturday)

| Component    | From              | To                   | Arduino Pin | Resistor |
|--------------|-------------------|----------------------|-------------|----------|
| LED Anode    | led1:A            | Row 56t (side A)     | -           | -        |
| LED Cathode  | led1:C            | Row 55t (side A)     | -           | -        |
| Resistor R7  | Row 57t (side B)  | Row 63t (side B)     | -           | 220Ω     |
| Signal       | Row 63t (side A)  | Arduino Pin 8        | Pin 8       | -        |

---

## Breadboard Layout Summary

### I2C Bus (Shared by RTC and OLED)
```
Row 1t: RTC SDA (A) ← → Arduino A4 (B) ← → OLED SDA (C)
Row 2t: RTC SCL (A) ← → Arduino A5 (B) ← → OLED SCL (C)
```

### Button Rows (Signal + Pull-up Resistor)
```
Row 64t: Button4 signal (A) ← → Arduino Pin 10 (B) ← → R12 (C) → 5V
Row 65t: Button1 signal (A) ← → Arduino Pin 11 (B) ← → R8  (C) → 5V
Row 66t: Button3 signal (A) ← → Arduino Pin 12 (B) ← → R9  (C) → 5V
Row 67t: Button2 signal (A) ← → Arduino Pin 13 (B) ← → R11 (C) → 5V
Row 68t: Button5 signal (A) ← → Arduino Pin A0 (B) ← → R10 (C) → 5V
```

### LED Rows (Sequential, Pins 2-8)
```
Rows 2-11:   LED7 (Red/Sunday)      → Pin 2
Rows 11-20:  LED6 (Green/Monday)    → Pin 3
Rows 20-29:  LED5 (Blue/Tuesday)    → Pin 4
Rows 29-38:  LED4 (Yellow/Wed)      → Pin 5
Rows 38-47:  LED3 (Orange/Thu)      → Pin 6
Rows 47-56:  LED2 (Purple/Fri)      → Pin 7
Rows 55-63:  LED1 (Cyan/Saturday)   → Pin 8
```

---

## Pin Assignment Summary

### Digital Pins
| Pin | Component              | Type          | Description                    |
|-----|------------------------|---------------|--------------------------------|
| 2   | LED7 (Red)             | Output        | Sunday indicator               |
| 3   | LED6 (Green)           | Output        | Monday indicator               |
| 4   | LED5 (Blue)            | Output        | Tuesday indicator              |
| 5   | LED4 (Yellow)          | Output        | Wednesday indicator            |
| 6   | LED3 (Orange)          | Output        | Thursday indicator             |
| 7   | LED2 (Purple)          | Output        | Friday indicator               |
| 8   | LED1 (Cyan)            | Output        | Saturday indicator             |
| 9   | Buzzer                 | Output (PWM)  | Alarm sound                    |
| 10  | Button 4 (Blue)        | Input         | UP button                      |
| 11  | Button 1 (Yellow)      | Input         | DOWN button                    |
| 12  | Button 3 (Red)         | Input         | SET button                     |
| 13  | Button 2 (Green)       | Input         | CONFIRM button                 |

### Analog Pins
| Pin | Component              | Type          | Description                    |
|-----|------------------------|---------------|--------------------------------|
| A0  | Button 5 (Black)       | Input         | HOME button                    |
| A1  | Power Switch           | Input         | System ON/OFF                  |
| A4  | I2C SDA                | I2C Data      | RTC + OLED data line          |
| A5  | I2C SCL                | I2C Clock     | RTC + OLED clock line         |

### Power Pins
| Pin | Connection             | Description                    |
|-----|------------------------|--------------------------------|
| 5V  | Breadboard + rail      | Power supply for all components|
| GND | Breadboard - rail      | Common ground                  |

---

## Important Notes

### Pull-up Resistors
- All buttons use **external 10kΩ pull-up resistors**
- Buttons are read as LOW when pressed, HIGH when released
- Code uses `INPUT` mode (not `INPUT_PULLUP`)

### I2C Bus
- RTC and OLED share the same I2C bus (A4/SDA and A5/SCL)
- OLED I2C address: **0x3C**
- DS1307 RTC I2C address: **0x68** (standard)

### Breadboard Usage
- All connections route through the breadboard
- No direct component-to-Arduino connections (except power switch and buzzer)
- Power and ground rails distribute 5V and GND to all components
- Multiple components can share the same breadboard row (holes are electrically connected)

### Realistic Wiring
- No duplicate wires in the same hole
- Each breadboard hole has exactly ONE wire
- Multiple holes in the same row are used for branching connections
- This matches real-world breadboard wiring practices

---

## Troubleshooting

### LEDs not lighting
- Check LED polarity (Anode to positive, Cathode to negative)
- Verify resistor connections (220Ω for LEDs)
- Ensure Arduino pins 2-8 are working

### Buttons not responding
- Check pull-up resistor connections (10kΩ to 5V)
- Verify button ground connections
- Test with Serial monitor button press detection

### RTC not keeping time
- Check RTC battery (if removable)
- Verify I2C connections (A4/SDA, A5/SCL)
- Check RTC power (5V and GND)

### OLED not displaying
- Verify I2C address is 0x3C
- Check I2C bus connections (shared with RTC)
- Ensure OLED power connections are correct

### Buzzer not sounding
- Check buzzer polarity
- Verify pin 9 connection
- Note: VS Code Wokwi simulator does not play audio

---

## Version History

- **v1.0** (2025-12-03): Initial realistic wiring documentation
  - Reorganized all connections through breadboard
  - Eliminated duplicate connections
  - Added comprehensive component tables
  - Beginner-friendly layout

---

**Project:** Smart Medication Reminder
**Author:** Antonni-code
**Hardware:** Arduino Uno + DS1307 RTC + SSD1306 OLED
**Documentation Date:** December 3, 2025
