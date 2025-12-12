'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface AdherenceStats {
  adherenceRate: number
  totalDoses: number
  takenDoses: number
  onTimeDoses: number
  lateDoses: number
  missedDoses: number
  avgDelay: number
  currentStreak: number
}

interface AdherenceLog {
  id: string
  alarmIndex: number
  scheduledTime: string
  takenAt: string | null
  status: string
  delayMinutes: number | null
  createdAt: string
}

const ALARM_LABELS = ['Morning', 'Afternoon', 'Evening']

interface Alarm {
  hour: number
  minute: number
  enabled: boolean
}

export default function Home() {
  const [stats, setStats] = useState<AdherenceStats | null>(null)
  const [recentLogs, setRecentLogs] = useState<AdherenceLog[]>([])
  const [alarms, setAlarms] = useState<Alarm[]>([
    { hour: 8, minute: 0, enabled: true },
    { hour: 13, minute: 0, enabled: true },
    { hour: 20, minute: 0, enabled: true }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextDose, setNextDose] = useState<{ label: string; time: string; in: string } | null>(null)
  const [loggingDose, setLoggingDose] = useState<number | null>(null)

  useEffect(() => {
    fetchAlarms()
    fetchAdherence()
  }, [])

  useEffect(() => {
    if (alarms) {
      calculateNextDose()
    }
  }, [alarms])

  const fetchAlarms = async () => {
    try {
      const response = await fetch('/api/arduino?action=get_alarms')
      const data = await response.json()

      if (data.success && data.alarms) {
        setAlarms(data.alarms)
      }
    } catch (error) {
      console.error('Failed to fetch alarms:', error)
      setError('Failed to load alarm times')
    }
  }

  const fetchAdherence = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/adherence?days=7')
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
        setRecentLogs(data.logs.slice(0, 5)) // Get last 5 logs
      } else {
        setError(data.error || 'Failed to load statistics')
      }
    } catch (error) {
      console.error('Failed to fetch adherence:', error)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const calculateNextDose = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Use real alarm times from database
    const alarmData = [
      { index: 0, hour: alarms[0]?.hour || 8, minute: alarms[0]?.minute || 0, label: 'Morning', enabled: alarms[0]?.enabled !== false },
      { index: 1, hour: alarms[1]?.hour || 13, minute: alarms[1]?.minute || 0, label: 'Afternoon', enabled: alarms[1]?.enabled !== false },
      { index: 2, hour: alarms[2]?.hour || 20, minute: alarms[2]?.minute || 0, label: 'Evening', enabled: alarms[2]?.enabled !== false }
    ]

    // Find next enabled alarm
    for (const alarm of alarmData) {
      if (!alarm.enabled) continue // Skip disabled alarms

      if (alarm.hour > currentHour || (alarm.hour === currentHour && alarm.minute > currentMinute)) {
        const nextTime = new Date()
        nextTime.setHours(alarm.hour, alarm.minute, 0, 0)
        const diffMs = nextTime.getTime() - now.getTime()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

        const timeStr = `${alarm.hour > 12 ? alarm.hour - 12 : alarm.hour === 0 ? 12 : alarm.hour}:${alarm.minute.toString().padStart(2, '0')} ${alarm.hour >= 12 ? 'PM' : 'AM'}`
        const inStr = diffHours > 0 ? `In ${diffHours}h ${diffMinutes}m` : `In ${diffMinutes}m`

        setNextDose({
          label: `${alarm.label} Dose`,
          time: timeStr,
          in: inStr
        })
        return
      }
    }

    // If no alarm today, show tomorrow's first enabled alarm
    const firstEnabled = alarmData.find(a => a.enabled)
    if (firstEnabled) {
      const timeStr = `${firstEnabled.hour > 12 ? firstEnabled.hour - 12 : firstEnabled.hour === 0 ? 12 : firstEnabled.hour}:${firstEnabled.minute.toString().padStart(2, '0')} ${firstEnabled.hour >= 12 ? 'PM' : 'AM'}`
      setNextDose({
        label: `${firstEnabled.label} Dose`,
        time: timeStr,
        in: 'Tomorrow'
      })
    } else {
      setNextDose({
        label: 'No Alarms',
        time: '--:--',
        in: 'None set'
      })
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === now.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const handleMarkAsTaken = async (alarmIndex: number) => {
    try {
      setLoggingDose(alarmIndex)
      setError(null)

      const now = new Date()
      const alarm = alarms[alarmIndex]
      const scheduledTime = new Date()
      scheduledTime.setHours(alarm.hour, alarm.minute, 0, 0)

      // Calculate delay
      const delayMs = now.getTime() - scheduledTime.getTime()
      const delayMinutes = Math.round(delayMs / (1000 * 60))

      // Determine status
      let status = 'taken_on_time'
      if (delayMinutes > 15) {
        status = 'taken_late'
      } else if (delayMinutes < -60) {
        // If more than 1 hour early, might be for previous scheduled time
        scheduledTime.setDate(scheduledTime.getDate() - 1)
      }

      const response = await fetch('/api/adherence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alarmIndex,
          status,
          delayMinutes: delayMinutes > 0 ? delayMinutes : null,
          scheduledTime: scheduledTime.toISOString()
        })
      })

      const data = await response.json()

      if (data.success) {
        // Refresh adherence data
        await fetchAdherence()
      } else {
        setError(data.error || 'Failed to log dose')
      }
    } catch (error) {
      console.error('Failed to log dose:', error)
      setError('Failed to log dose. Please try again.')
    } finally {
      setLoggingDose(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-[#0BA6DF]" />
          <p className="text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">Monitor your medication adherence and schedule</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start gap-3">
          <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-red-900 font-semibold text-sm">{error}</p>
            <button
              onClick={() => { fetchAlarms(); fetchAdherence(); }}
              className="text-red-700 text-xs font-bold underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 hover:border-[#0BA6DF] transition-all">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ADHERENCE RATE</p>
          <p className="text-4xl font-bold text-gray-900 mb-1 tabular-nums">{stats?.adherenceRate || 0}%</p>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>

        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 hover:border-[#EF7722] transition-all">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CURRENT STREAK</p>
          <p className="text-4xl font-bold text-gray-900 mb-1 tabular-nums">{stats?.currentStreak || 0}</p>
          <p className="text-xs text-gray-500">Days</p>
        </div>

        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 hover:border-[#FAA533] transition-all">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AVG DELAY</p>
          <p className="text-4xl font-bold text-gray-900 mb-1 tabular-nums">{stats?.avgDelay || 0}m</p>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>

        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 hover:border-[#0BA6DF] transition-all">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">NEXT DOSE</p>
          <p className="text-4xl font-bold text-gray-900 mb-1 tabular-nums">{nextDose?.time?.split(' ')[0] || '--:--'}</p>
          <p className="text-xs text-gray-500">{nextDose?.in || 'N/A'}</p>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 mb-5">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Today's Schedule</h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="space-y-3">
          {alarms.map((alarm, index) => {
            const alarmLabel = ALARM_LABELS[index]
            const hours = alarm.hour > 12 ? alarm.hour - 12 : alarm.hour === 0 ? 12 : alarm.hour
            const period = alarm.hour >= 12 ? 'PM' : 'AM'
            const timeStr = `${hours}:${alarm.minute.toString().padStart(2, '0')} ${period}`
            const isNext = nextDose?.label === `${alarmLabel} Dose`
            const isLogging = loggingDose === index

            // Check if dose was already logged today
            const now = new Date()
            const todayLog = recentLogs.find(log => {
              const logDate = new Date(log.scheduledTime)
              return log.alarmIndex === index && logDate.toDateString() === now.toDateString()
            })

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  isNext
                    ? 'bg-gradient-to-r from-[#FFF5ED] to-white border-[#EF7722]'
                    : alarm.enabled
                    ? 'bg-white border-[#EBEBEB]'
                    : 'bg-gray-50 border-[#EBEBEB] opacity-60'
                }`}
              >
                <div>
                  <p className="font-bold text-gray-900 mb-1">{alarmLabel} Dose</p>
                  <p className="text-sm text-gray-600 font-semibold">{timeStr}</p>
                  {todayLog && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      ✓ Logged {todayLog.status === 'taken_on_time' ? 'on time' : todayLog.status === 'taken_late' ? `${todayLog.delayMinutes}m late` : 'as missed'}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {alarm.enabled && !todayLog && (
                    <button
                      onClick={() => handleMarkAsTaken(index)}
                      disabled={isLogging}
                      className="px-4 py-1.5 font-bold text-sm rounded bg-[#0BA6DF] text-white hover:bg-[#0995C8] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLogging ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Logging...
                        </span>
                      ) : (
                        'Mark as Taken'
                      )}
                    </button>
                  )}
                  <div className={`px-4 py-1.5 font-bold text-sm rounded ${
                    !alarm.enabled ? 'bg-gray-300 text-gray-600' :
                    todayLog ? 'bg-green-100 text-green-700 border border-green-300' :
                    isNext ? 'bg-[#0BA6DF] text-white' : 'bg-[#EBEBEB] text-gray-700'
                  }`}>
                    {!alarm.enabled ? 'Disabled' : todayLog ? 'Completed' : isNext ? 'Upcoming' : 'Scheduled'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

        {recentLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activity yet. Start tracking your medication!</p>
        ) : (
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 pb-4 border-b-2 border-[#EBEBEB] last:border-0">
                <div className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                  log.status === 'taken_on_time' ? 'bg-[#0BA6DF]' :
                  log.status === 'taken_late' ? 'bg-[#FAA533]' :
                  'bg-red-500'
                }`} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {log.status === 'taken_on_time' ? 'Dose taken on time' :
                     log.status === 'taken_late' ? `Dose taken (${log.delayMinutes} min delay)` :
                     'Dose missed'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(log.scheduledTime)} at {formatTime(log.scheduledTime)} - {ALARM_LABELS[log.alarmIndex]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
