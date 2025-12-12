/**
 * Adherence Tracking API
 *
 * Tracks medication adherence - when doses are taken, missed, or late
 * This powers the Dashboard and Statistics pages with real data
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/adherence?days=7
 * Get adherence logs for the user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    // Get logs from the last N days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const logs = await prisma.adherenceLog.findMany({
      where: {
        userId: user.id,
        scheduledTime: {
          gte: startDate
        }
      },
      orderBy: {
        scheduledTime: 'desc'
      }
    })

    // Calculate statistics
    const totalDoses = logs.length
    const takenDoses = logs.filter(log => log.status !== 'missed').length
    const onTimeDoses = logs.filter(log => log.status === 'taken_on_time').length
    const lateDoses = logs.filter(log => log.status === 'taken_late').length
    const missedDoses = logs.filter(log => log.status === 'missed').length

    const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100

    // Calculate average delay
    const lateLogsWithDelay = logs.filter(log => log.delayMinutes !== null && log.delayMinutes > 0)
    const avgDelay = lateLogsWithDelay.length > 0
      ? Math.round(lateLogsWithDelay.reduce((sum, log) => sum + (log.delayMinutes || 0), 0) / lateLogsWithDelay.length)
      : 0

    // Calculate current streak (consecutive days without missing, counting backward from today)
    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Start from today and go backward
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const nextDay = new Date(checkDate)
      nextDay.setDate(nextDay.getDate() + 1)

      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.scheduledTime)
        return logDate >= checkDate && logDate < nextDay
      })

      // If no data for today (i=0), skip today and keep counting
      // If no data for past days, stop counting
      if (dayLogs.length === 0) {
        if (i === 0) continue // Skip today if no logs yet
        break // Stop if no data for past days
      }

      const allTaken = dayLogs.every(log => log.status !== 'missed')
      if (allTaken) {
        currentStreak++
      } else {
        break // Stop at first missed dose
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        adherenceRate,
        totalDoses,
        takenDoses,
        onTimeDoses,
        lateDoses,
        missedDoses,
        avgDelay,
        currentStreak
      },
      logs
    })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/adherence
 * Log a dose as taken, late, or missed
 *
 * Body: {
 *   alarmIndex: 0-2,
 *   status: "taken_on_time" | "taken_late" | "missed",
 *   delayMinutes?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { alarmIndex, status, delayMinutes, scheduledTime } = body

    // Validate alarmIndex
    if (typeof alarmIndex !== 'number' || alarmIndex < 0 || alarmIndex > 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid alarmIndex (must be 0, 1, or 2)' },
        { status: 400 }
      )
    }

    // Validate status
    if (!['taken_on_time', 'taken_late', 'missed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status (must be taken_on_time, taken_late, or missed)' },
        { status: 400 }
      )
    }

    // Validate delayMinutes (if provided)
    if (delayMinutes !== null && delayMinutes !== undefined) {
      if (typeof delayMinutes !== 'number' || delayMinutes < 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid delayMinutes (must be a positive number)' },
          { status: 400 }
        )
      }
    }

    // Validate scheduledTime (if provided)
    if (scheduledTime) {
      const scheduledDate = new Date(scheduledTime)
      if (isNaN(scheduledDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid scheduledTime format' },
          { status: 400 }
        )
      }

      // Prevent logging doses too far in the future
      const now = new Date()
      if (scheduledDate > now) {
        return NextResponse.json(
          { success: false, error: 'Cannot log doses scheduled in the future' },
          { status: 400 }
        )
      }

      // Prevent logging doses too far in the past (more than 7 days)
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      if (scheduledDate < sevenDaysAgo) {
        return NextResponse.json(
          { success: false, error: 'Cannot log doses older than 7 days' },
          { status: 400 }
        )
      }
    }

    // Get the alarm to find scheduled time
    const alarm = await prisma.alarm.findUnique({
      where: {
        userId_index: {
          userId: user.id,
          index: alarmIndex
        }
      }
    })

    if (!alarm) {
      return NextResponse.json(
        { success: false, error: 'Alarm not found' },
        { status: 404 }
      )
    }

    // Use provided scheduledTime or calculate from alarm time
    const scheduled = scheduledTime
      ? new Date(scheduledTime)
      : (() => {
          const now = new Date()
          const scheduled = new Date(now)
          scheduled.setHours(alarm.hour, alarm.minute, 0, 0)
          // If alarm time is in the future today, use yesterday
          if (scheduled > now) {
            scheduled.setDate(scheduled.getDate() - 1)
          }
          return scheduled
        })()

    // Check for duplicate logs (same alarm, same day)
    const startOfDay = new Date(scheduled)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(scheduled)
    endOfDay.setHours(23, 59, 59, 999)

    const existingLog = await prisma.adherenceLog.findFirst({
      where: {
        userId: user.id,
        alarmIndex,
        scheduledTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    if (existingLog) {
      return NextResponse.json(
        { success: false, error: 'Dose already logged for this time today' },
        { status: 409 }
      )
    }

    // Create adherence log
    const log = await prisma.adherenceLog.create({
      data: {
        userId: user.id,
        alarmIndex,
        scheduledTime: scheduled,
        takenAt: status !== 'missed' ? new Date() : null,
        status,
        delayMinutes: delayMinutes || null
      }
    })

    return NextResponse.json({
      success: true,
      message: `Dose logged as ${status}`,
      log
    })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
