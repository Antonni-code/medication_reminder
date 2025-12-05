// Debug endpoint to check database connection and data
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Count users
    const userCount = await prisma.user.count()

    // Get all users (without sensitive data)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })

    // Count alarms
    const alarmCount = await prisma.alarm.count()

    // Get all alarms
    const alarms = await prisma.alarm.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      database: 'db_medrem',
      stats: {
        totalUsers: userCount,
        totalAlarms: alarmCount,
      },
      users,
      alarms,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
