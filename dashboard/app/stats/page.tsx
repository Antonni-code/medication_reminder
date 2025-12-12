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
}

interface WeeklyData {
  day: string
  doses: string
  percentage: string
  taken: number
  total: number
}

interface MonthlyData {
  month: string
  adherence: number
  color: string
}

interface TimeOfDayData {
  time: string
  label: string
  adherence: number
  color: string
}

const ALARM_LABELS = ['Morning', 'Afternoon', 'Evening']

interface Alarm {
  hour: number
  minute: number
  enabled: boolean
}

export default function StatsPage() {
  const [stats, setStats] = useState<AdherenceStats | null>(null)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [timeOfDayData, setTimeOfDayData] = useState<TimeOfDayData[]>([])
  const [loading, setLoading] = useState(true)
  const [longestStreak, setLongestStreak] = useState(0)
  const [totalDaysTracked, setTotalDaysTracked] = useState(0)
  const [alarms, setAlarms] = useState<Alarm[]>([
    { hour: 8, minute: 0, enabled: true },
    { hour: 13, minute: 0, enabled: true },
    { hour: 20, minute: 0, enabled: true }
  ])

  useEffect(() => {
    fetchAllStats()
  }, [])

  const fetchAllStats = async () => {
    try {
      setLoading(true)

      // Fetch alarms and adherence data
      const [alarmsRes, adherenceRes] = await Promise.all([
        fetch('/api/arduino?action=get_alarms'),
        fetch('/api/adherence?days=30')
      ])

      const alarmsData = await alarmsRes.json()
      const adherenceData = await adherenceRes.json()

      if (alarmsData.success && alarmsData.alarms) {
        setAlarms(alarmsData.alarms)
      }

      if (adherenceData.success) {
        setStats(adherenceData.stats)
        calculateWeeklyData(adherenceData.logs)
        calculateMonthlyData(adherenceData.logs)
        calculateTimeOfDayData(adherenceData.logs)
        calculateLongestStreak(adherenceData.logs)
        calculateTotalDays(adherenceData.logs)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateWeeklyData = (logs: AdherenceLog[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const weekly: WeeklyData[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)

      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.scheduledTime)
        return logDate >= date && logDate < nextDay
      })

      const taken = dayLogs.filter(l => l.status !== 'missed').length
      const total = dayLogs.length
      const percentage = total > 0 ? Math.round((taken / total) * 100) : 0

      weekly.push({
        day: days[date.getDay()],
        doses: total > 0 ? `${taken}/${total}` : '-',
        percentage: total > 0 ? `${percentage}%` : 'N/A',
        taken,
        total
      })
    }

    setWeeklyData(weekly)
  }

  const calculateMonthlyData = (logs: AdherenceLog[]) => {
    const monthlyStats: MonthlyData[] = []

    for (let i = 0; i < 4; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthLogs = logs.filter(log => {
        const logDate = new Date(log.scheduledTime)
        return logDate >= monthStart && logDate <= monthEnd
      })

      const taken = monthLogs.filter(l => l.status !== 'missed').length
      const total = monthLogs.length
      const adherence = total > 0 ? Math.round((taken / total) * 100) : 0

      let color = '#0BA6DF' // Default blue
      if (adherence >= 90) color = '#0BA6DF'
      else if (adherence >= 80) color = '#EF7722'
      else color = '#FAA533'

      monthlyStats.push({
        month: date.toLocaleDateString('en-US', { month: 'long' }),
        adherence,
        color
      })
    }

    setMonthlyData(monthlyStats)
  }

  const calculateTimeOfDayData = (logs: AdherenceLog[]) => {
    const timeStats: TimeOfDayData[] = []

    for (let alarmIndex = 0; alarmIndex < 3; alarmIndex++) {
      const alarmLogs = logs.filter(l => l.alarmIndex === alarmIndex)
      const taken = alarmLogs.filter(l => l.status !== 'missed').length
      const total = alarmLogs.length
      const adherence = total > 0 ? Math.round((taken / total) * 100) : 0

      let label = 'Good'
      let color = '#0BA6DF'
      if (adherence >= 95) {
        label = 'Excellent'
        color = '#EF7722'
      } else if (adherence >= 90) {
        label = 'Very good'
        color = '#0BA6DF'
      } else if (adherence >= 80) {
        label = 'Good'
        color = '#FAA533'
      } else {
        label = 'Needs improvement'
        color = '#EBEBEB'
      }

      // Format alarm time
      const alarm = alarms[alarmIndex]
      const hours = alarm.hour > 12 ? alarm.hour - 12 : alarm.hour === 0 ? 12 : alarm.hour
      const period = alarm.hour >= 12 ? 'PM' : 'AM'
      const timeStr = `${hours}:${alarm.minute.toString().padStart(2, '0')} ${period}`

      timeStats.push({
        time: `${ALARM_LABELS[alarmIndex]} (${timeStr})`,
        label,
        adherence,
        color
      })
    }

    setTimeOfDayData(timeStats)
  }

  const calculateLongestStreak = (logs: AdherenceLog[]) => {
    if (logs.length === 0) {
      setLongestStreak(0)
      return
    }

    let maxStreak = 0
    let currentStreak = 0
    const sortedLogs = [...logs].sort((a, b) =>
      new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
    )

    // Group by day
    const dayGroups = new Map<string, AdherenceLog[]>()
    sortedLogs.forEach(log => {
      const date = new Date(log.scheduledTime)
      const dateKey = date.toDateString()
      if (!dayGroups.has(dateKey)) {
        dayGroups.set(dateKey, [])
      }
      dayGroups.get(dateKey)!.push(log)
    })

    // Check each day
    const sortedDays = Array.from(dayGroups.keys()).sort()
    for (const day of sortedDays) {
      const dayLogs = dayGroups.get(day)!
      const allTaken = dayLogs.every(l => l.status !== 'missed')

      if (allTaken) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }

    setLongestStreak(maxStreak)
  }

  const calculateTotalDays = (logs: AdherenceLog[]) => {
    if (logs.length === 0) {
      setTotalDaysTracked(0)
      return
    }

    const daySet = new Set<string>()
    logs.forEach(log => {
      const date = new Date(log.scheduledTime)
      daySet.add(date.toDateString())
    })

    setTotalDaysTracked(daySet.size)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-[#0BA6DF]" />
          <p className="text-gray-600 font-semibold">Loading statistics...</p>
        </div>
      </div>
    )
  }

  const hasData = stats && stats.totalDoses > 0

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Statistics</h1>
        <p className="text-gray-600">Track your medication adherence over time</p>
      </div>

      {!hasData && (
        <div className="bg-[#FFF5ED] border-2 border-[#FAA533] rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-900 text-lg mb-2">No Data Yet</h3>
          <p className="text-gray-700 text-sm">
            Start tracking your medication doses to see statistics here. Your adherence data will appear once you log doses.
          </p>
        </div>
      )}

      {/* Weekly Overview */}
      <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5 mb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Overview</h2>

        <div className="grid grid-cols-7 gap-2 mb-5">
          {weeklyData.map((day, i) => {
            const getColor = () => {
              if (day.total === 0) return 'bg-white border-[#EBEBEB] text-gray-300'
              if (day.taken === day.total) return 'bg-[#0BA6DF] border-[#0BA6DF] text-white'
              if (day.taken > 0) return 'bg-[#FAA533] border-[#FAA533] text-white'
              return 'bg-red-100 border-red-300 text-red-700'
            }

            return (
              <div key={i} className="text-center">
                <div className="text-xs font-bold text-gray-500 mb-1">{day.day}</div>
                <div className={`h-16 rounded border-2 flex items-center justify-center text-lg font-bold ${getColor()}`}>
                  {day.doses}
                </div>
                <div className="text-xs text-gray-600 mt-1">{day.percentage}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-[#F0F9FF] border border-[#0BA6DF] rounded">
            <p className="text-xs font-bold text-gray-600">DOSES TAKEN</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.takenDoses || 0}/{stats?.totalDoses || 0}</p>
          </div>
          <div className="text-center p-3 bg-[#FFF5ED] border border-[#EF7722] rounded">
            <p className="text-xs font-bold text-gray-600">ADHERENCE</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.adherenceRate || 0}%</p>
          </div>
          <div className="text-center p-3 bg-[#F0F9FF] border border-[#0BA6DF] rounded">
            <p className="text-xs font-bold text-gray-600">AVG DELAY</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.avgDelay || 0}m</p>
          </div>
        </div>
      </div>

      {/* Monthly & Time of Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Adherence</h3>
          {monthlyData.length === 0 || monthlyData.every(m => m.adherence === 0) ? (
            <p className="text-gray-500 text-center py-8">No monthly data yet</p>
          ) : (
            <div className="space-y-3">
              {monthlyData.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">{item.month}</span>
                    <span className="text-sm font-bold text-gray-900">{item.adherence}%</span>
                  </div>
                  <div className="h-2 bg-[#EBEBEB] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.adherence}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Time of Day</h3>
          {timeOfDayData.length === 0 || timeOfDayData.every(t => t.adherence === 0) ? (
            <p className="text-gray-500 text-center py-8">No time-of-day data yet</p>
          ) : (
            <div className="space-y-3">
              {timeOfDayData.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded"
                  style={{
                    borderColor: item.color === '#EBEBEB' ? '#EBEBEB' : item.color,
                    backgroundColor: item.color === '#EBEBEB' ? 'white' : `${item.color}15`
                  }}
                >
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.time}</p>
                    <p className="text-xs text-gray-600">{item.label}</p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: item.color === '#EBEBEB' ? '#6B7280' : item.color }}>
                    {item.adherence}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Streak History */}
      <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Streak History</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-4 border-2 border-[#0BA6DF] rounded bg-[#F0F9FF]">
            <p className="text-xs font-bold text-gray-600 mb-1">CURRENT</p>
            <p className="text-3xl font-bold text-[#0BA6DF]">{stats?.currentStreak || 0}</p>
            <p className="text-xs text-gray-600 mt-1">days</p>
          </div>
          <div className="text-center p-4 border-2 border-[#EBEBEB] rounded">
            <p className="text-xs font-bold text-gray-600 mb-1">LONGEST</p>
            <p className="text-3xl font-bold text-gray-900">{longestStreak}</p>
            <p className="text-xs text-gray-600 mt-1">days</p>
          </div>
          <div className="text-center p-4 border-2 border-[#EBEBEB] rounded">
            <p className="text-xs font-bold text-gray-600 mb-1">TOTAL DAYS</p>
            <p className="text-3xl font-bold text-gray-900">{totalDaysTracked}</p>
            <p className="text-xs text-gray-600 mt-1">tracked</p>
          </div>
          <div className="text-center p-4 border-2 border-[#EBEBEB] rounded">
            <p className="text-xs font-bold text-gray-600 mb-1">MISSED</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.missedDoses || 0}</p>
            <p className="text-xs text-gray-600 mt-1">doses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
