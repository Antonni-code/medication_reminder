# Testing Guide - Dynamic Alarm System

This guide shows you how to test the complete dynamic alarm system from start to finish.

---

## What We Built

You now have a complete system where:
1. **Arduino stores alarms in EEPROM** - Survives power loss
2. **Website can read alarms** - Shows current alarm times
3. **Website can change alarms** - Updates Arduino in real-time
4. **Changes persist forever** - Saved to EEPROM immediately

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER INTERACTION                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  WEBSITE (React/Next.js)                                         │
│  - Alarms Page UI                                                │
│  - Form inputs for hour/minute                                   │
│  - Enable/disable switches                                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP Request
                                 │ (fetch API)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  NEXT.JS API ENDPOINT (/api/arduino)                             │
│  - Receives HTTP requests from browser                           │
│  - Opens Serial connection to Arduino                            │
│  - Sends Serial commands                                         │
│  - Receives Arduino responses                                    │
│  - Returns JSON to browser                                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Serial Port (USB)
                                 │ 9600 baud
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  ARDUINO (main.cpp)                                              │
│  - handleSerialCommands() in loop()                              │
│  - Processes: GET_ALARMS, SET_ALARM, TOGGLE_ALARM                │
│  - Saves to EEPROM immediately                                   │
│  - Sends response back                                           │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  EEPROM STORAGE                                                  │
│  - 3 alarms × 3 bytes = 9 bytes total                           │
│  - Survives power loss                                           │
│  - Loaded on Arduino startup                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Testing

### Step 1: Upload Arduino Code

1. Open Arduino IDE or PlatformIO
2. Upload `src/main.cpp` to your Arduino
3. Wait for upload to complete
4. Arduino will restart automatically

**What happens:**
- Arduino loads alarms from EEPROM (default: 8:00, 13:00, 20:00)
- `handleSerialCommands()` starts running in `loop()`
- Arduino is now ready to receive commands

---

### Step 2: Test Serial Communication (Optional but Recommended)

Before testing the website, verify that Arduino's serial commands work:

1. Open Serial Monitor (Tools → Serial Monitor)
2. Set baud rate to **9600**
3. Set line ending to **Newline**
4. Type: `GET_ALARMS` and press Enter

**Expected response:**
```
ALARMS:8:0:1:13:0:1:20:0:1
```

**What this means:**
```
ALARMS:8:0:1:13:0:1:20:0:1
       │ │ │  │  │ │  │  │ └─ Alarm 2 enabled
       │ │ │  │  │ │  │  └─── Alarm 2 minute
       │ │ │  │  │ │  └────── Alarm 2 hour
       │ │ │  │  │ └───────── Alarm 1 enabled
       │ │ │  │  └─────────── Alarm 1 minute
       │ │ │  └────────────── Alarm 1 hour
       │ │ └─────────────────  Alarm 0 enabled
       │ └──────────────────── Alarm 0 minute
       └───────────────────── Alarm 0 hour
```

**Try changing an alarm:**
```
SET_ALARM:0:9:30
```

**Expected response:**
```
OK:0:9:30
```

Now type `GET_ALARMS` again and you should see the new time!

**Close Serial Monitor before proceeding** - The website can't connect if Serial Monitor is open!

---

### Step 3: Start the Next.js Development Server

1. Open terminal
2. Navigate to dashboard folder:
   ```bash
   cd C:\Arduino_bich\medication_reminder\dashboard
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Wait for:
   ```
   ✓ Ready in 2.3s
   ○ Local: http://localhost:3000
   ```

5. Open browser and go to: **http://localhost:3000**

---

### Step 4: Test the Website Connection

1. In the browser, click **"Alarms"** in the navigation menu
2. You should see a loading spinner that says "Loading alarms from Arduino..."

**What happens behind the scenes:**
```
Browser → GET /api/arduino?action=get_alarms → API opens Serial
API → "GET_ALARMS\n" → Arduino
Arduino → "ALARMS:8:0:1:13:0:1:20:0:1\n" → API
API → Parses response → JSON → Browser
Browser → Shows alarm cards
```

**If you see the alarm cards:**
- ✅ Serial connection works!
- ✅ Arduino is responding!
- ✅ API is parsing correctly!

**If you see an error:**
- ❌ "Arduino not found" - Make sure Arduino is plugged in via USB
- ❌ "Command timeout" - Close Serial Monitor if it's open
- ❌ "Port busy" - Another program is using the Serial port

---

### Step 5: Test Changing Alarm Time

1. Click on the **Morning** alarm card
2. Change the hour to `9`
3. Change the minute to `30`
4. Click **"Save Time"** button

**What happens:**
```
Browser → POST /api/arduino
         { action: "set_alarm", index: 0, hour: 9, minute: 30 }

API → Opens Serial → "SET_ALARM:0:9:30\n" → Arduino
Arduino → Updates alarms[0].hour = 9
Arduino → Updates alarms[0].minute = 30
Arduino → saveAlarms() → EEPROM
Arduino → "OK:0:9:30\n" → API
API → { success: true, message: "..." } → Browser
Browser → Shows green success message
```

**You should see:**
- ✅ Button shows "Saving..." with spinner
- ✅ Green message: "Morning alarm saved!"
- ✅ Card updates to show "Current: 9:30 AM"

---

### Step 6: Test Persistence (Power Loss)

This is the most important test! Let's prove that alarms survive Arduino restart:

1. **Before restart:** Note the current alarm times
2. **Restart Arduino:** Press the reset button on Arduino (or unplug USB)
3. **Refresh the website:** Click the "Refresh" button on the Alarms page

**Expected result:**
- ✅ Alarm times are STILL the same!
- ✅ Morning alarm is still 9:30 AM (not reset to 8:00)

**Why this works:**
- When you clicked "Save Time", Arduino called `saveAlarms()`
- This wrote to EEPROM at address 0
- When Arduino restarted, `setup()` called `loadAlarms()`
- EEPROM data persisted through power loss!

---

### Step 7: Test Enable/Disable Toggle

1. Click the **"Disable Alarm"** button on the Morning alarm
2. Watch the card become semi-transparent (opacity-60)

**What happens:**
```
Browser → POST /api/arduino { action: "toggle_alarm", index: 0 }
API → "TOGGLE_ALARM:0\n" → Arduino
Arduino → alarms[0].enabled = !alarms[0].enabled
Arduino → saveAlarms() → EEPROM
Arduino → "OK:0:0\n" → API (0 = disabled)
API → { success: true, enabled: false } → Browser
Browser → Updates badge to "Off", icon to BellOff
```

**You should see:**
- Badge changes from green "On" to gray "Off"
- Icon changes from Bell to BellOff
- Card becomes semi-transparent
- Button text changes to "Enable Alarm"

---

### Step 8: Test Multiple Alarms

Try editing all 3 alarms:

1. **Morning:** 9:30 AM, Enabled
2. **Afternoon:** 2:15 PM, Disabled
3. **Evening:** 9:45 PM, Enabled

**After saving all changes:**
1. Press Arduino's reset button
2. Refresh the website
3. All 3 alarms should still have your custom times!

---

## How the Data Flows

### Reading Alarms (GET)

```
1. User opens Alarms page
2. useEffect() calls fetchAlarms()
3. fetch('/api/arduino?action=get_alarms')
4. API: findArduinoPort() → Finds COM3 (or similar)
5. API: Opens Serial at 9600 baud
6. API: Waits 2 seconds (Arduino resets on Serial connect)
7. API: Writes "GET_ALARMS\n"
8. Arduino: handleSerialCommands() sees command
9. Arduino: Sends "ALARMS:8:0:1:13:0:1:20:0:1\n"
10. API: parseAlarms() converts to JSON
11. API: Closes Serial
12. API: Returns { success: true, alarms: [...] }
13. Browser: setAlarms(data.alarms)
14. Browser: Renders 3 alarm cards
```

### Writing Alarms (POST)

```
1. User changes Morning alarm to 9:30
2. User clicks "Save Time"
3. fetch('/api/arduino', { method: 'POST', body: {...} })
4. API: Opens Serial
5. API: Waits 2 seconds
6. API: Writes "SET_ALARM:0:9:30\n"
7. Arduino: Parses command → index=0, hour=9, minute=30
8. Arduino: Validates (0 < 3, 9 < 24, 30 < 60) ✓
9. Arduino: alarms[0].hour = 9
10. Arduino: alarms[0].minute = 30
11. Arduino: saveAlarms() → EEPROM.put(0, alarms[0])
12. Arduino: Sends "OK:0:9:30\n"
13. API: Closes Serial
14. API: Returns { success: true, message: "..." }
15. Browser: Shows green success message
```

---

## Common Issues and Solutions

### Issue 1: "Arduino not found"

**Cause:** No Arduino detected on USB ports

**Solutions:**
- Check USB cable is connected
- Open Device Manager (Windows) and look for "Ports (COM & LPT)"
- Try unplugging and replugging Arduino
- Make sure drivers are installed

---

### Issue 2: "Command timeout"

**Cause:** Arduino didn't respond within 5 seconds

**Solutions:**
1. **Close Serial Monitor** - It blocks the port!
2. Wait 2 seconds after opening Serial (Arduino resets)
3. Check if Arduino is running the correct code
4. Look at Arduino's Serial Monitor to see if it's receiving commands

---

### Issue 3: "Port busy" or "Access denied"

**Cause:** Another program is using the Serial port

**Solutions:**
- Close Arduino Serial Monitor
- Close any terminal emulators (PuTTY, screen, etc.)
- Restart the Next.js dev server
- Unplug and replug Arduino

---

### Issue 4: Alarms reset to default after power loss

**Cause:** EEPROM not saving properly

**Check:**
1. Open Serial Monitor
2. Type: `GET_ALARMS`
3. Note the times
4. Press Arduino reset button
5. Type: `GET_ALARMS` again
6. Times should be the same!

**If times reset to 8:00, 13:00, 20:00:**
- EEPROM might be corrupted
- Try changing an alarm via Serial Monitor: `SET_ALARM:0:9:30`
- Then reset and check again

---

## Understanding the Code

### Why does API wait 2 seconds?

```typescript
await new Promise(resolve => setTimeout(resolve, 2000));
```

**Reason:** Arduino Uno has a hardware feature called "auto-reset". When you open the Serial port, the DTR (Data Terminal Ready) line goes high, which triggers the Arduino's reset pin. This causes a full restart.

**What happens:**
1. API opens Serial → DTR high → Arduino resets
2. Arduino runs `setup()` → Takes ~1.5 seconds
3. After 2 seconds, Arduino is ready
4. API sends command

**Without the delay:**
- API would send command too early
- Arduino hasn't finished `setup()` yet
- Command is lost

---

### Why does each SET_ALARM save to EEPROM immediately?

```cpp
if (index < 3 && hour < 24 && minute < 60) {
  alarms[index].hour = hour;
  alarms[index].minute = minute;
  saveAlarms();  // ← Saves RIGHT AWAY!
}
```

**Reason:** Simplicity and safety!

**Alternative approach (batch saving):**
```cpp
// User changes 3 alarms
SET_ALARM:0:9:30    // Only updates RAM
SET_ALARM:1:14:15   // Only updates RAM
SET_ALARM:2:21:45   // Only updates RAM
SAVE_ALARMS         // ← Saves all at once
```

**Problem with batch saving:**
- If Arduino loses power before SAVE_ALARMS, changes are lost!
- User might forget to click "Save" button
- More complex code

**Our approach (immediate saving):**
- Every change is permanent immediately
- No "save" button needed (though we have one for UX)
- Safer - can't lose data

---

## Next Steps

Now that you have a working dynamic alarm system, you can:

1. **Add more alarms** - Increase array size from 3 to 5
2. **Add alarm labels** - Store custom names in EEPROM
3. **Add repeat patterns** - Store which days alarm should ring
4. **Add medication names** - Track which medication for each alarm
5. **Add history tracking** - Log when alarms were acknowledged
6. **Add statistics** - Adherence rate, missed doses, etc.

All of these features follow the same pattern:
1. Update Arduino code to store more data in EEPROM
2. Add Serial commands to read/write that data
3. Update API to handle new commands
4. Update UI to show/edit the data

---

## Congratulations!

You've built a complete IoT system with:
- ✅ Hardware (Arduino Uno + RTC + OLED + Buzzer)
- ✅ Firmware (C++ code with EEPROM persistence)
- ✅ Communication Protocol (Serial commands)
- ✅ Backend API (Next.js API routes)
- ✅ Frontend UI (React with shadcn components)
- ✅ Data Persistence (EEPROM storage)
- ✅ Real-time Sync (Website ↔ Arduino)

This is the foundation for building ANY connected device!

---

**Created by Antonni-code**
**Date:** December 4, 2025
**Project:** Smart Medication Reminder
