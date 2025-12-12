/**
 * User Settings API
 *
 * LEARNING: What does this API do?
 * This endpoint manages user preferences, specifically email notification settings.
 *
 * GET /api/settings - Fetch current user's settings
 * POST /api/settings - Update user's settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/settings
 * Fetch the current user's settings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        emailNotificationsEnabled: true,
        notificationDelayMinutes: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      settings: {
        emailNotificationsEnabled: user.emailNotificationsEnabled,
        notificationDelayMinutes: user.notificationDelayMinutes,
      },
    })
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings
 * Update the current user's settings
 *
 * Body:
 * {
 *   emailNotificationsEnabled: boolean,
 *   notificationDelayMinutes: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { emailNotificationsEnabled, notificationDelayMinutes } = body

    /**
     * LEARNING: Validate input
     */
    if (typeof emailNotificationsEnabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'emailNotificationsEnabled must be a boolean' },
        { status: 400 }
      )
    }

    if (typeof notificationDelayMinutes !== 'number' || notificationDelayMinutes < 1 || notificationDelayMinutes > 120) {
      return NextResponse.json(
        { success: false, error: 'notificationDelayMinutes must be between 1 and 120' },
        { status: 400 }
      )
    }

    /**
     * LEARNING: Update user settings in database
     */
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailNotificationsEnabled,
        notificationDelayMinutes,
      },
      select: {
        emailNotificationsEnabled: true,
        notificationDelayMinutes: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: updatedUser,
    })
  } catch (error) {
    console.error('POST /api/settings error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
