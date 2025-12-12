"use client";

import { useState, useEffect } from "react";
import { PolarisButton } from "@/components/ui/polaris-button";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [deviceName, setDeviceName] = useState("Living Room Reminder");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [notificationDelayMinutes, setNotificationDelayMinutes] = useState(15);
  const [testingEmail, setTestingEmail] = useState(false);

  /**
   * LEARNING: Fetch user's notification settings on page load
   */
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success) {
        setEmailNotificationsEnabled(data.settings.emailNotificationsEnabled);
        setNotificationDelayMinutes(data.settings.notificationDelayMinutes);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert("Device synced successfully!");
  };

  /**
   * LEARNING: Save notification settings to database
   */
  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailNotificationsEnabled,
          notificationDelayMinutes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Notification settings saved successfully!');
      } else {
        alert('Failed to save settings: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /**
   * LEARNING: Test email notification
   */
  const handleTestEmail = async () => {
    try {
      setTestingEmail(true);
      const response = await fetch('/api/notifications/test');
      const data = await response.json();

      if (data.success) {
        alert(`Test email sent to ${data.recipient}! Check your inbox.`);
      } else {
        alert('Failed to send test email: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to send test email:', error);
      alert('Failed to send test email. Please try again.');
    } finally {
      setTestingEmail(false);
    }
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email Notifications</h2>
          <p className="text-sm text-gray-600 mb-4">
            Receive email alerts when you miss a scheduled medication dose.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#0BA6DF]" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Enable/Disable Toggle */}
              <label className="flex items-center p-4 bg-[#F0F9FF] border border-[#0BA6DF] rounded cursor-pointer hover:bg-[#E6F7FF] transition-colors">
                <input
                  type="checkbox"
                  checked={emailNotificationsEnabled}
                  onChange={(e) => setEmailNotificationsEnabled(e.target.checked)}
                  className="h-5 w-5 text-[#0BA6DF] focus:ring-[#0BA6DF] border-gray-300 rounded"
                />
                <div className="ml-3">
                  <span className="text-sm font-bold text-gray-900">
                    Enable email notifications
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    Get notified by email when you miss a dose
                  </p>
                </div>
              </label>

              {/* Delay Settings */}
              {emailNotificationsEnabled && (
                <div className="p-4 border-2 border-[#EBEBEB] rounded">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Notification Delay (minutes)
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    Wait this many minutes after a missed dose before sending an email
                  </p>
                  <select
                    value={notificationDelayMinutes}
                    onChange={(e) => setNotificationDelayMinutes(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-[#EBEBEB] rounded focus:outline-none focus:ring-2 focus:ring-[#0BA6DF] focus:border-transparent"
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes (recommended)</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <PolarisButton
                  primary
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  loading={saving}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </PolarisButton>

                <button
                  onClick={handleTestEmail}
                  disabled={testingEmail || !emailNotificationsEnabled}
                  className="px-4 py-2 text-sm font-bold text-[#0BA6DF] border-2 border-[#0BA6DF] rounded hover:bg-[#F0F9FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {testingEmail ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send Test Email'
                  )}
                </button>
              </div>

              {/* Info Box */}
              <div className="p-3 bg-[#FFF5ED] border-l-4 border-[#EF7722] rounded">
                <p className="text-xs text-gray-700">
                  <strong>Note:</strong> Make sure to add your Resend API key in the <code>.env</code> file for emails to work.
                  You can get a free API key at <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[#0BA6DF] underline">resend.com</a>.
                </p>
              </div>
            </div>
          )}
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
