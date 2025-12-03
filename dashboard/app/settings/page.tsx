"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [deviceName, setDeviceName] = useState("Living Room Reminder");
  const [saving, setSaving] = useState(false);

  const handleSync = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert("Device synced successfully!");
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your device and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Device Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Name
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device ID
              </label>
              <input
                type="text"
                value="arduino_001"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Status
              </label>
              <div className="flex items-center">
                <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm font-medium text-green-700">Online</span>
                <span className="text-xs text-gray-500 ml-2">(Last seen: 2 min ago)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Synchronization</h2>
          <p className="text-sm text-gray-600 mb-4">
            Manually sync data between your device and the cloud.
          </p>
          <button
            onClick={handleSync}
            disabled={saving}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {saving ? "Syncing..." : "Sync Now"}
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Email notifications for missed doses
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Weekly adherence reports
              </span>
            </label>
          </div>
        </div>

        {/* About */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Dashboard Version: 1.0.0</p>
            <p>Arduino Firmware: 1.0.0</p>
            <p>Last Updated: December 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
