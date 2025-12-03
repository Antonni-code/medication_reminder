"use client";

import { useState } from "react";

interface Alarm {
  index: number;
  label: string;
  hour: number;
  minute: number;
  enabled: boolean;
}

export default function AlarmsPage() {
  const [alarms, setAlarms] = useState<Alarm[]>([
    { index: 0, label: "Morning", hour: 8, minute: 0, enabled: true },
    { index: 1, label: "Afternoon", hour: 13, minute: 0, enabled: true },
    { index: 2, label: "Evening", hour: 20, minute: 0, enabled: true },
  ]);

  const [saving, setSaving] = useState(false);

  const updateAlarm = (index: number, field: keyof Alarm, value: any) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.index === index ? { ...alarm, [field]: value } : alarm
      )
    );
  };

  const saveAlarms = async () => {
    setSaving(true);
    // TODO: API call to save alarms
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert("Alarms saved successfully!");
  };

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Alarm Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure your medication reminder alarms
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          {alarms.map((alarm) => (
            <div
              key={alarm.index}
              className="border-b pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {alarm.label} Dose
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatTime(alarm.hour, alarm.minute)}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alarm.enabled}
                    onChange={(e) =>
                      updateAlarm(alarm.index, "enabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hour (24h)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={alarm.hour}
                    onChange={(e) =>
                      updateAlarm(
                        alarm.index,
                        "hour",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minute
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={alarm.minute}
                    onChange={(e) =>
                      updateAlarm(
                        alarm.index,
                        "minute",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <button
            onClick={saveAlarms}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {saving ? "Saving..." : "Save Alarms to Device"}
          </button>
        </div>
      </div>
    </div>
  );
}
