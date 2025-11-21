Smart Medication Reminder Box - CONCEPTUAL FLOW
(With 4 Buttons & Multiple Daily Doses)

SIMPLE FLOW:
START
  ↓
[Default alarm times loaded: Morning 8AM, Afternoon 1PM, Evening 8PM]
  ↓
[Arduino checks time every second]
  ↓
Is SET button pressed? ──YES──> Go to MENU MODE
  ↓ NO                           (see below)
  ↓
Is it time for any dose? (Morning/Afternoon/Evening)
  ↓ NO → Display next dose time, keep checking
  ↓ YES
  ↓
[ALARM TRIGGERED!]
  ↓
[Today's LED blinks] (e.g., Wednesday = LED #3)
[Buzzer beeps]
[Screen shows: "TAKE AFTERNOON DOSE!"]
  ↓
Wait for CONFIRM button...
  ↓
CONFIRM pressed? ──YES──> Turn off alarm
  ↓ NO                     Log "taken"
  ↓                        Show next dose
Wait 15 minutes          Return to monitoring
  ↓
Still no button? ──YES──> Log "MISSED DOSE"
  ↓                        Turn off alarm
  ↓                        Return to monitoring
REPEAT DAILY

MENU MODE (Setting Alarm Times):
User presses SET button
  ↓
[Screen shows: "SET MORNING TIME"]
  ↓
UP button = increase hour
DOWN button = decrease hour
  ↓
Press SET to move to minutes
  ↓
UP button = increase minute
DOWN button = decrease minute
  ↓
Press SET to save
  ↓
[Back to main screen]
  ↓
(Repeat for Afternoon and Evening times)

DAILY OPERATION EXAMPLE:
MONDAY:

8:00 AM  → LED #1 (Monday) blinks → "MORNING DOSE"   → User presses CONFIRM
1:00 PM  → LED #1 (Monday) blinks → "AFTERNOON DOSE" → User presses CONFIRM
8:00 PM  → LED #1 (Monday) blinks → "EVENING DOSE"   → User presses CONFIRM

TUESDAY:

8:00 AM  → LED #2 (Tuesday) blinks → "MORNING DOSE"
1:00 PM  → LED #2 (Tuesday) blinks → "AFTERNOON DOSE"
8:00 PM  → LED #2 (Tuesday) blinks → "EVENING DOSE"

And so on for the whole week...

BUTTON FUNCTIONS:
ButtonPinFunctionUP10Navigate up / Increase valueDOWN11Navigate down / Decrease valueSET12Enter menu / Save / Next fieldCONFIRM13Confirm medication taken / Stop alarm

KEY FEATURES:
✓ 3 alarms per day (Morning, Afternoon, Evening)
✓ Each day gets all 3 alarms automatically
✓ Set times with buttons (no reprogramming)
✓ Permanently saved (even when powered off)
✓ Visual (LED) + Audio (Buzzer) + Display alerts
✓ Tracks taken or missed doses
