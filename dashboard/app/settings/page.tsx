"use client";

import { useState } from "react";
import { PolarisButton } from "@/components/ui/polaris-button";

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
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-600">Manage your device and preferences</p>
      </div>

      <div className="space-y-5">
        {/* Device Info */}
        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Device Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Device Name
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#EBEBEB] rounded focus:outline-none focus:ring-2 focus:ring-[#0BA6DF] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Device ID
              </label>
              <input
                type="text"
                value="arduino_001"
                disabled
                className="w-full px-4 py-2 border-2 border-[#EBEBEB] rounded bg-[#FAFAFA] text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Connection Status
              </label>
              <div className="flex items-center p-3 bg-[#F0F9FF] border border-[#0BA6DF] rounded">
                <span className="h-2.5 w-2.5 bg-[#0BA6DF] rounded-full mr-2"></span>
                <span className="text-sm font-semibold text-gray-900">Online</span>
                <span className="text-xs text-gray-500 ml-2">(Demo mode)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Synchronization</h2>
          <p className="text-sm text-gray-600 mb-4">
            Manually sync data between your device and the server.
          </p>
          <PolarisButton
            secondary
            onClick={handleSync}
            disabled={saving}
            loading={saving}
          >
            {saving ? "Syncing..." : "Sync Now"}
          </PolarisButton>
        </div>

        {/* Notifications */}
        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center p-3 hover:bg-[#FAFAFA] rounded cursor-pointer transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-[#0BA6DF] focus:ring-[#0BA6DF] border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-semibold text-gray-700">
                Email notifications for missed doses
              </span>
            </label>
            <label className="flex items-center p-3 hover:bg-[#FAFAFA] rounded cursor-pointer transition-colors">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-[#0BA6DF] focus:ring-[#0BA6DF] border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-semibold text-gray-700">
                Weekly adherence reports
              </span>
            </label>
            <label className="flex items-center p-3 hover:bg-[#FAFAFA] rounded cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="h-4 w-4 text-[#0BA6DF] focus:ring-[#0BA6DF] border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-semibold text-gray-700">
                Push notifications
              </span>
            </label>
          </div>
        </div>

        {/* About */}
        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-[#FAFAFA] rounded">
              <p className="text-xs font-bold text-gray-500 mb-1">DASHBOARD VERSION</p>
              <p className="text-sm font-bold text-gray-900">1.0.0</p>
            </div>
            <div className="p-3 bg-[#FAFAFA] rounded">
              <p className="text-xs font-bold text-gray-500 mb-1">ARDUINO FIRMWARE</p>
              <p className="text-sm font-bold text-gray-900">1.0.0</p>
            </div>
            <div className="p-3 bg-[#FAFAFA] rounded">
              <p className="text-xs font-bold text-gray-500 mb-1">LAST UPDATED</p>
              <p className="text-sm font-bold text-gray-900">December 2025</p>
            </div>
            <div className="p-3 bg-[#FAFAFA] rounded">
              <p className="text-xs font-bold text-gray-500 mb-1">PLATFORM</p>
              <p className="text-sm font-bold text-gray-900">Arduino Uno + Next.js</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
