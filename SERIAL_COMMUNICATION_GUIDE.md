# Serial Communication Guide

This guide explains how the Arduino and Website communicate to sync alarm data.

---

## How It Works - The Big Picture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Website   │ ◄─────► │  Next.js API │ ◄─────► │   Arduino   │
│  (Browser)  │  HTTP   │   (Server)   │ Serial  │  (Hardware) │
└─────────────┘         └──────────────┘         └─────────────┘
                                                         │
                                                         ▼
                                                   ┌──────────┐
                                                   │  EEPROM  │
                                                   │ (Storage)│
                                                   └──────────┘
```

### Data Flow Example:
1. User clicks "Change Morning Alarm to 9:00 AM" on website
2. Website sends HTTP request to Next.js API
3. API sends `SET_ALARM:0:9:0` to Arduino via Serial
4. Arduino updates alarm[0] and saves to EEPROM
5. Arduino responds `OK:0:9:0`
6. API sends success response to website
7. Website updates UI to show 9:00 AM

---

## Part 1: Arduino Serial Commands (What We Just Added)

### Function: `handleSerialCommands()`

This function runs in every `loop()` iteration and checks if there's a command from the computer.

```cpp
void handleSerialCommands() {
  if (Serial.available() > 0) {  // Is there data waiting?
    String command = Serial.readStringUntil('\n');  // Read until newline
    command.trim();  // Remove spaces

    // Process the command...
  }
}
```

---

## Available Commands

### 1. GET_ALARMS
**Purpose:** Read all alarm data from Arduino

**How to use:**
```
Send: GET_ALARMS
Receive: ALARMS:8:0:1:13:0:1:20:0:1
```

**What it means:**
```
ALARMS:8:0:1:13:0:1:20:0:1
       │ │ │  │  │ │  │  │ └─ Alarm 2 enabled (1=yes)
       │ │ │  │  │ │  │  └─── Alarm 2 minute (0)
       │ │ │  │  │ │  └────── Alarm 2 hour (20 = 8:00 PM)
       │ │ │  │  │ └───────── Alarm 1 enabled (1=yes)
       │ │ │  │  └─────────── Alarm 1 minute (0)
       │ │ │  └────────────── Alarm 1 hour (13 = 1:00 PM)
       │ │ └─────────────────  Alarm 0 enabled (1=yes)
       │ └──────────────────── Alarm 0 minute (0)
       └───────────────────── Alarm 0 hour (8 = 8:00 AM)
```

**Arduino Code:**
```cpp
if (command == "GET_ALARMS") {
  Serial.print(F("ALARMS:"));
  for (uint8_t i = 0; i < 3; i++) {
    Serial.print(alarms[i].hour);      // Hour
    Serial.print(':');
    Serial.print(alarms[i].minute);    // Minute
    Serial.print(':');
    Serial.print(alarms[i].enabled ? 1 : 0);  // Enabled (1 or 0)
    if (i < 2) Serial.print(':');  // Separator (not after last)
  }
  Serial.println();  // End with newline
}
```

---

### 2. SET_ALARM:index:hour:minute
**Purpose:** Update a specific alarm

**Examples:**
```
SET_ALARM:0:9:30   → Set Morning alarm to 9:30 AM
SET_ALARM:1:14:15  → Set Afternoon alarm to 2:15 PM
SET_ALARM:2:21:45  → Set Evening alarm to 9:45 PM
```

**Response:**
```
OK:0:9:30          → Success! Alarm 0 set to 9:30
ERROR:INVALID_PARAMS → Failed (bad hour/minute)
```

**Arduino Code:**
```cpp
else if (command.startsWith("SET_ALARM:")) {
  // Parse: SET_ALARM:0:9:30
  //        Position: 0123456789...

  int firstColon = command.indexOf(':', 10);  // Find : after "SET_ALARM:"
  int secondColon = command.indexOf(':', firstColon + 1);

  uint8_t index = command.substring(10, firstColon).toInt();  // "0"
  uint8_t hour = command.substring(firstColon + 1, secondColon).toInt();  // "9"
  uint8_t minute = command.substring(secondColon + 1).toInt();  // "30"

  // Validate (index 0-2, hour 0-23, minute 0-59)
  if (index < 3 && hour < 24 && minute < 60) {
    alarms[index].hour = hour;
    alarms[index].minute = minute;
    saveAlarms();  // Save to EEPROM immediately!

    Serial.print(F("OK:"));
    Serial.print(index);
    Serial.print(':');
    Serial.print(hour);
    Serial.print(':');
    Serial.println(minute);
  }
}
```

**Why `saveAlarms()` is important:**
When you change an alarm, it's saved to EEPROM immediately. This means:
- ✅ If Arduino loses power, alarm is still saved
- ✅ If you restart Arduino, it loads the new alarm
- ✅ Changes persist forever (until you change them again)

---

### 3. TOGGLE_ALARM:index
**Purpose:** Enable or disable an alarm

**Examples:**
```
TOGGLE_ALARM:0     → Turn Morning alarm ON/OFF
TOGGLE_ALARM:1     → Turn Afternoon alarm ON/OFF
TOGGLE_ALARM:2     → Turn Evening alarm ON/OFF
```

**Response:**
```
OK:0:1             → Alarm 0 is now ON (1=enabled)
OK:0:0             → Alarm 0 is now OFF (0=disabled)
```

**Arduino Code:**
```cpp
else if (command.startsWith("TOGGLE_ALARM:")) {
  uint8_t index = command.substring(13).toInt();

  if (index < 3) {
    alarms[index].enabled = !alarms[index].enabled;  // Flip the value
    saveAlarms();  // Save to EEPROM

    Serial.print(F("OK:"));
    Serial.print(index);
    Serial.print(':');
    Serial.println(alarms[index].enabled ? 1 : 0);
  }
}
```

---

### 4. GET_STATUS
**Purpose:** Get current system status

**How to use:**
```
Send: GET_STATUS
Receive: STATUS:1:14:35:3
```

**What it means:**
```
STATUS:1:14:35:3
       │ │  │  └─ Day of week (0=Sun, 1=Mon, ..., 6=Sat)
       │ │  └──── Current minute (35)
       │ └─────── Current hour (14 = 2:00 PM)
       └────────── System powered (1=ON, 0=OFF)
```

---

## How to Test (Without Website)

### Using Arduino Serial Monitor:

1. Upload the code to Arduino
2. Open Tools → Serial Monitor
3. Set baud rate to **9600**
4. Set line ending to **Newline**
5. Type commands and press Enter

**Test Sequence:**
```
1. GET_ALARMS
   → You should see: ALARMS:8:0:1:13:0:1:20:0:1

2. SET_ALARM:0:9:30
   → You should see: OK:0:9:30

3. GET_ALARMS
   → You should see: ALARMS:9:30:1:13:0:1:20:0:1
   (Notice Morning alarm changed to 9:30!)

4. TOGGLE_ALARM:0
   → You should see: OK:0:0
   (Morning alarm is now disabled)

5. GET_ALARMS
   → You should see: ALARMS:9:30:0:13:0:1:20:0:1
   (Notice the enabled flag changed to 0)

6. Restart Arduino (press reset button)

7. GET_ALARMS
   → You should STILL see: ALARMS:9:30:0:13:0:1:20:0:1
   (Alarms persisted in EEPROM!)
```

---

## Why This Design?

### Simple Protocol
- Uses colons `:` as separators (easy to parse)
- Human-readable (you can type it yourself!)
- No complex JSON or binary encoding

### Immediate Persistence
- Every change is saved to EEPROM right away
- No "save" button needed
- Power loss won't lose data

### Always Listening
- `handleSerialCommands()` runs in every loop
- Works even when system is "powered off"
- Website can always read/write alarms

### Validation
- Checks if hour is 0-23
- Checks if minute is 0-59
- Checks if index is 0-2
- Returns ERROR if invalid

---

## Next Steps

Now that Arduino can receive commands, we need to:

1. **Create Next.js API** - Server-side code to send Serial commands
2. **Build Alarms Page** - UI where you can edit alarms
3. **Connect them together** - Make the website talk to Arduino

Continue reading to learn how to build the Next.js API!

---

**Created by Antonni-code**
**Date:** December 4, 2025
**Project:** Smart Medication Reminder
