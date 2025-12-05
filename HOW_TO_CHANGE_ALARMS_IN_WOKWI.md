# How to Change Alarms in Wokwi Simulation

Since Wokwi runs in the browser and can't connect to the Next.js API directly, you need to change alarms using the Serial Monitor.

---

## Step 1: Open Serial Monitor in Wokwi

1. Start your simulation
2. Click the **Serial Monitor** icon at the bottom of Wokwi
3. You'll see a terminal window appear

---

## Step 2: Send Commands

Type these commands in the Serial Monitor:

### Change Morning Alarm to 9:30 AM
```
SET_ALARM:0:9:30
```
**Response:** `OK:0:9:30`

### Change Afternoon Alarm to 12:58 PM
```
SET_ALARM:1:12:58
```
**Response:** `OK:1:12:58`

### Change Evening Alarm to 9:45 PM (21:45 in 24h)
```
SET_ALARM:2:21:45
```
**Response:** `OK:2:21:45`

---

## Step 3: Verify Changes

Type:
```
GET_ALARMS
```

You should see:
```
ALARMS:9:30:1:12:58:1:21:45:1
```

This means:
- Morning: 9:30 enabled
- Afternoon: 12:58 enabled
- Evening: 21:45 enabled

---

## Step 4: Test Persistence

1. **Stop the simulation** (press Stop button)
2. **Start the simulation again** (press Start button)
3. Open Serial Monitor
4. Type: `GET_ALARMS`

You should **still see your custom times**! This proves EEPROM is working!

---

## Important Notes

### Time Format
- Use **24-hour format** (0-23 for hours)
- Examples:
  - 8:00 AM = `8:0`
  - 12:58 PM = `12:58`
  - 9:45 PM = `21:45`

### Command Format
```
SET_ALARM:index:hour:minute
           ↑      ↑    ↑
           |      |    └─ Minute (0-59)
           |      └────── Hour (0-23)
           └──────────── Alarm index (0=Morning, 1=Afternoon, 2=Evening)
```

### Toggle Alarm On/Off
```
TOGGLE_ALARM:0    → Turn Morning alarm on/off
TOGGLE_ALARM:1    → Turn Afternoon alarm on/off
TOGGLE_ALARM:2    → Turn Evening alarm on/off
```

---

## Why Can't the Website Control Wokwi?

**Wokwi runs in your browser** → Can't access computer's serial ports
**Next.js API runs on your computer** → Can access serial ports
**They can't talk to each other** → No bridge between them

### When Website WILL Work:

The website will work when you:
1. **Upload code to a real Arduino** (not Wokwi)
2. **Connect Arduino via USB** to your computer
3. **Set USE_MOCK = false** in the API code
4. **Install serialport library** (already done)

Then the flow will be:
```
Website → Next.js API → USB Serial → Arduino → EEPROM
```

---

## Quick Reference

| Command | What It Does | Example |
|---------|-------------|---------|
| `GET_ALARMS` | Read all alarms | Shows: `ALARMS:8:0:1:13:0:1:20:0:1` |
| `SET_ALARM:0:9:30` | Set Morning to 9:30 AM | Response: `OK:0:9:30` |
| `SET_ALARM:1:12:58` | Set Afternoon to 12:58 PM | Response: `OK:1:12:58` |
| `SET_ALARM:2:21:45` | Set Evening to 9:45 PM | Response: `OK:2:21:45` |
| `TOGGLE_ALARM:0` | Enable/disable Morning | Response: `OK:0:1` or `OK:0:0` |
| `GET_STATUS` | Show current time | Shows: `STATUS:1:13:47:4` |

---

**Created by Antonni-code**
**Project:** Smart Medication Reminder
