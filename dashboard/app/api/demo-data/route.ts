/**
 * Demo Data Generator
 * Creates sample adherence logs for testing the dashboard
 * DELETE THIS FILE in production!
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const { days = 14 } = body

    // Generate sample data for the last N days
    const logsToCreate = []
    const today = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Morning (8:00 AM)
      const morning = new Date(date)
      morning.setHours(8, 0, 0, 0)
      const morningStatus = Math.random() > 0.05 ? (Math.random() > 0.2 ? 'taken_on_time' : 'taken_late') : 'missed'
      const morningDelay = morningStatus === 'taken_late' ? Math.floor(Math.random() * 15) + 1 : null

      logsToCreate.push({
        userId: user.id,
        alarmIndex: 0,
        scheduledTime: morning,
        takenAt: morningStatus !== 'missed' ? new Date(morning.getTime() + (morningDelay || 0) * 60000) : null,
        status: morningStatus,
        delayMinutes: morningDelay
      })

      // Afternoon (1:00 PM)
      const afternoon = new Date(date)
      afternoon.setHours(13, 0, 0, 0)
      const afternoonStatus = Math.random() > 0.1 ? (Math.random() > 0.3 ? 'taken_on_time' : 'taken_late') : 'missed'
      const afternoonDelay = afternoonStatus === 'taken_late' ? Math.floor(Math.random() * 20) + 1 : null

      logsToCreate.push({
        userId: user.id,
        alarmIndex: 1,
        scheduledTime: afternoon,
        takenAt: afternoonStatus !== 'missed' ? new Date(afternoon.getTime() + (afternoonDelay || 0) * 60000) : null,
        status: afternoonStatus,
        delayMinutes: afternoonDelay
      })

      // Evening (8:00 PM)
      const evening = new Date(date)
      evening.setHours(20, 0, 0, 0)
      const eveningStatus = Math.random() > 0.15 ? (Math.random() > 0.4 ? 'taken_on_time' : 'taken_late') : 'missed'
      const eveningDelay = eveningStatus === 'taken_late' ? Math.floor(Math.random() * 25) + 1 : null

      logsToCreate.push({
        userId: user.id,
        alarmIndex: 2,
        scheduledTime: evening,
        takenAt: eveningStatus !== 'missed' ? new Date(evening.getTime() + (eveningDelay || 0) * 60000) : null,
        status: eveningStatus,
        delayMinutes: eveningDelay
      })
    }

    // Create all logs
    await prisma.adherenceLog.createMany({
      data: logsToCreate
    })

    return NextResponse.json({
      success: true,
      message: `Created ${logsToCreate.length} demo adherence logs for the last ${days} days`,
      count: logsToCreate.length
    })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/demo-data
 * Clear all adherence logs for the user (for testing)
 */
export async function DELETE(request: NextRequest) {
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

    const deleted = await prisma.adherenceLog.deleteMany({
      where: { userId: user.id }
    })

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleted.count} adherence logs`,
      count: deleted.count
    })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
