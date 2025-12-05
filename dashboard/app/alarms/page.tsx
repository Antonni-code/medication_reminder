'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { PolarisButton } from '@/components/ui/polaris-button'

interface Alarm {
  hour: number
  minute: number
  enabled: boolean
}

const ALARM_LABELS = ['Morning', 'Afternoon', 'Evening']

export default function AlarmsPage() {
  const [alarms, setAlarms] = useState<Alarm[]>([
    { hour: 8, minute: 0, enabled: true },
    { hour: 13, minute: 0, enabled: true },
    { hour: 20, minute: 0, enabled: true },
  ])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [toggling, setToggling] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchAlarms()
  }, [])

  const fetchAlarms = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/arduino?action=get_alarms')
      const data = await response.json()
      if (data.success) {
        setAlarms(data.alarms)
      } else {
        setError(data.error || 'Failed to load alarms')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect')
    } finally {
      setLoading(false)
    }
  }

  const updateTime = (index: number, field: 'hour' | 'minute', value: number) => {
    const newAlarms = [...alarms]
    newAlarms[index][field] = value
    setAlarms(newAlarms)
  }

  const saveAlarm = async (index: number) => {
    try {
      setSaving(index)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/arduino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_alarm',
          index,
          hour: alarms[index].hour,
          minute: alarms[index].minute,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess(`${ALARM_LABELS[index]} alarm saved`)
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.error || 'Failed to save')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(null)
    }
  }

  const toggleAlarm = async (index: number) => {
    try {
      setToggling(index)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/arduino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_alarm', index }),
      })

      const data = await response.json()
      if (data.success) {
        const newAlarms = [...alarms]
        newAlarms[index].enabled = data.enabled
        setAlarms(newAlarms)
        setSuccess(`${ALARM_LABELS[index]} ${data.enabled ? 'enabled' : 'disabled'}`)
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.error || 'Failed to toggle')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle')
    } finally {
      setToggling(null)
    }
  }

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM'
    const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const m = minute.toString().padStart(2, '0')
    return `${h}:${m} ${period}`
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-[#0BA6DF]" />
          <p className="text-gray-600 font-semibold">Loading alarms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Alarms</h1>
        <p className="text-gray-600">Configure your medication reminder times</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-5 bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-900 font-semibold text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-5 bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-900 font-semibold text-sm">{success}</p>
        </div>
      )}

      {/* Warning Banner */}
      <div className="mb-6 bg-[#FFF5ED] border-2 border-[#FAA533] rounded-lg p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-2">Demo Mode Active</h3>
        <p className="text-gray-700 text-sm mb-3">
          Changes here won't affect Wokwi simulation. To change alarms in Wokwi, use Serial Monitor:
        </p>
        <code className="block bg-white border-2 border-[#EBEBEB] rounded px-4 py-3 font-mono text-gray-900 text-sm">
          SET_ALARM:1:12:58
        </code>
      </div>

      {/* Alarms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {alarms.map((alarm, index) => (
          <div key={index} className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 hover:border-[#0BA6DF] transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{ALARM_LABELS[index]}</h3>
                <p className="text-gray-600 text-sm mt-1 font-semibold">{formatTime(alarm.hour, alarm.minute)}</p>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-bold ${
                alarm.enabled ? 'bg-[#0BA6DF] text-white' : 'bg-[#EBEBEB] text-gray-600'
              }`}>
                {alarm.enabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                  Hour (0-23)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={alarm.hour}
                  onChange={(e) => updateTime(index, 'hour', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-[#EBEBEB] rounded text-center text-lg font-bold text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-[#0BA6DF] focus:border-transparent"
                  disabled={saving === index}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                  Minute (0-59)
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={alarm.minute}
                  onChange={(e) => updateTime(index, 'minute', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-[#EBEBEB] rounded text-center text-lg font-bold text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-[#0BA6DF] focus:border-transparent"
                  disabled={saving === index}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <PolarisButton
                primary
                onClick={() => saveAlarm(index)}
                disabled={saving === index}
                fullWidth
                size="large"
              >
                {saving === index ? 'Saving...' : 'Save Time'}
              </PolarisButton>
              <PolarisButton
                outline
                onClick={() => toggleAlarm(index)}
                disabled={toggling === index}
                fullWidth
                size="large"
              >
                {toggling === index ? 'Toggling...' : alarm.enabled ? 'Disable' : 'Enable'}
              </PolarisButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
