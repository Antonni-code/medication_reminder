# Quick Start Guide - Dynamic Alarms

This is a quick reference for getting the dynamic alarm system running.

---

## 1. Upload Arduino Code

```bash
# Using PlatformIO
cd C:\Arduino_bich\medication_reminder
pio run --target upload
```

**Or** use Arduino IDE to upload `src/main.cpp`

---

## 2. Start the Website

```bash
cd C:\Arduino_bich\medication_reminder\dashboard
npm run dev
```

Open browser: **http://localhost:3000**

---

## 3. Edit Alarms

1. Click **"Alarms"** in navigation
2. Change time using hour/minute inputs
3. Click **"Save Time"**
4. Changes are saved to Arduino's EEPROM instantly!

---

## 4. Verify Persistence

1. Press Arduino's **reset button** (or unplug power)
2. Refresh the website
3. Your custom alarm times should still be there!

---

## How It Works (Simple Version)

```
Website → API → Serial → Arduino → EEPROM
   ↑                                   │
   └───────────────────────────────────┘
        Changes persist forever!
```

---

## Available Commands

You can also test directly via Serial Monitor (9600 baud):

```
GET_ALARMS              → Read all alarms
SET_ALARM:0:9:30       → Set alarm 0 to 9:30
TOGGLE_ALARM:0         → Enable/disable alarm 0
GET_STATUS             → Get current time and status
```

---

## File Structure

```
medication_reminder/
├── src/main.cpp                    ← Arduino firmware
├── dashboard/
│   ├── app/
│   │   ├── alarms/page.tsx        ← Alarms page UI
│   │   └── api/arduino/route.ts   ← API endpoint
│   └── components/ui/              ← UI components
├── SERIAL_COMMUNICATION_GUIDE.md   ← Detailed protocol docs
├── TESTING_GUIDE.md                ← Full testing walkthrough
└── QUICK_START.md                  ← This file
```

---

## Troubleshooting

### "Arduino not found"
- Check USB cable is connected
- Close Arduino Serial Monitor if open

### "Command timeout"
- Close Serial Monitor (it blocks the port!)
- Wait 2 seconds after opening Serial

### "Port busy"
- Close any programs using the Serial port
- Restart the Next.js dev server

---

## Key Concepts You Learned

1. **EEPROM Persistence** - Data survives power loss
2. **Serial Communication** - Computer ↔ Arduino via USB
3. **API Design** - Next.js backend routes
4. **React State Management** - useState, useEffect
5. **Async Programming** - fetch(), promises, async/await
6. **Protocol Design** - Simple text-based commands

---

## What's Next?

Now you can add:
- More alarms (change array size)
- Alarm labels (store names in EEPROM)
- Repeat patterns (which days to ring)
- Medication tracking (what to take)
- History logs (when alarms were acknowledged)

All follow the same pattern:
1. Update Arduino struct
2. Add Serial commands
3. Update API endpoint
4. Update UI

---

**Created by Antonni-code**
**Project:** Smart Medication Reminder
