/**
 * Email Notification Checker API
 *
 * LEARNING: What does this file do?
 * This endpoint checks for missed medication doses and sends email notifications.
 * It should be called periodically (every minute) by a cron job or scheduler.
 *
 * HOW IT WORKS:
 * 1. Get all users who have email notifications enabled
 * 2. For each user, check their alarms
 * 3. Find alarms that are overdue (past their scheduled time + delay threshold)
 * 4. Check if the dose was logged in AdherenceLog
 * 5. If missed, check if we already sent an email
 * 6. If not sent, send email and record it in EmailNotification table
 *
 * ENDPOINT: GET /api/notifications/check
 * PURPOSE: Check for missed doses and send notifications
 * CALLED BY: Cron job (every minute) or manual trigger
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, EMAIL_CONFIG } from '@/lib/resend'

/**
 * LEARNING: Alarm labels for user-friendly messages
 * Index 0 = Morning, Index 1 = Afternoon, Index 2 = Evening
 */
const ALARM_LABELS = ['Morning', 'Afternoon', 'Evening']

/**
 * GET /api/notifications/check
 * Check for missed doses and send email notifications
 *
 * LEARNING: Why GET and not POST?
 * - GET is idempotent (can be called multiple times safely)
 * - Cron jobs typically use GET requests
 * - No body data needed
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[Notification Check] Starting check for missed doses...')

    /**
     * STEP 1: Get all users with email notifications enabled
     *
     * LEARNING: Why filter by emailNotificationsEnabled?
     * - Respects user preferences
     * - Users can disable notifications in settings
     * - Reduces unnecessary processing
     */
    const users = await prisma.user.findMany({
      where: {
        emailNotificationsEnabled: true,
        email: { not: null }, // Must have an email address
      },
      include: {
        alarms: {
          where: { enabled: true }, // Only check enabled alarms
        },
      },
    })

    console.log(`[Notification Check] Found ${users.length} users with notifications enabled`)

    let totalNotificationsSent = 0
    const now = new Date()

    /**
     * STEP 2: Check each user's alarms for missed doses
     */
    for (const user of users) {
      console.log(`[Notification Check] Checking user: ${user.email}`)

      /**
       * STEP 3: Check each alarm for this user
       */
      for (const alarm of user.alarms) {
        /**
         * LEARNING: Calculate if this alarm is overdue
         *
         * Example:
         * - Alarm time: 8:00 AM (hour=8, minute=0)
         * - Current time: 8:16 AM
         * - Delay threshold: 15 minutes (user.notificationDelayMinutes)
         * - Is overdue? Yes! (16 minutes > 15 minutes)
         */

        // Create a Date object for today's scheduled alarm time
        const scheduledTime = new Date(now)
        scheduledTime.setHours(alarm.hour, alarm.minute, 0, 0)

        // Calculate how many minutes since the alarm
        const minutesSinceAlarm = Math.floor((now.getTime() - scheduledTime.getTime()) / (1000 * 60))

        console.log(
          `[Notification Check] ${ALARM_LABELS[alarm.index]} alarm (${alarm.hour}:${alarm.minute}): ` +
          `${minutesSinceAlarm} minutes ago`
        )

        /**
         * LEARNING: When to send notification?
         * - Alarm time has passed (minutesSinceAlarm > 0)
         * - Enough time has passed since alarm (minutesSinceAlarm >= threshold)
         * - Not too long ago (less than 2 hours, to avoid spam for old missed doses)
         */
        const isOverdue =
          minutesSinceAlarm >= user.notificationDelayMinutes &&
          minutesSinceAlarm < 120 // Don't notify for doses more than 2 hours late

        if (!isOverdue) {
          console.log(`[Notification Check] Not overdue yet, skipping`)
          continue
        }

        /**
         * STEP 4: Check if the dose was already logged
         *
         * LEARNING: Why check AdherenceLog?
         * - User might have taken the medication
         * - They might have manually marked it as taken
         * - No need to send notification if already logged
         */
        const startOfDay = new Date(now)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(now)
        endOfDay.setHours(23, 59, 59, 999)

        const existingLog = await prisma.adherenceLog.findFirst({
          where: {
            userId: user.id,
            alarmIndex: alarm.index,
            scheduledTime: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        })

        if (existingLog) {
          console.log(`[Notification Check] Dose already logged, skipping notification`)
          continue
        }

        /**
         * STEP 5: Check if we already sent a notification for this dose
         *
         * LEARNING: Why check EmailNotification?
         * - Prevents duplicate emails
         * - User already knows they missed it
         * - Don't spam the user
         */
        const existingNotification = await prisma.emailNotification.findFirst({
          where: {
            userId: user.id,
            alarmIndex: alarm.index,
            scheduledTime: {
              gte: startOfDay,
              lte: endOfDay,
            },
            emailType: 'missed_dose',
          },
        })

        if (existingNotification) {
          console.log(`[Notification Check] Notification already sent, skipping`)
          continue
        }

        /**
         * STEP 6: Send the email notification!
         *
         * LEARNING: This is where the magic happens!
         * We use Resend API to send a professional email
         */
        try {
          console.log(`[Notification Check] Sending email to ${user.email}...`)

          // Format the alarm time for display (e.g., "8:00 AM")
          const hours = alarm.hour > 12 ? alarm.hour - 12 : alarm.hour === 0 ? 12 : alarm.hour
          const period = alarm.hour >= 12 ? 'PM' : 'AM'
          const timeStr = `${hours}:${alarm.minute.toString().padStart(2, '0')} ${period}`

          /**
           * LEARNING: Resend API call
           * This sends the actual email
           */
          const emailResult = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: user.email!,
            subject: EMAIL_CONFIG.subjects.missedDose,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #EF7722;">Medication Reminder</h2>
                <p>Hi ${user.name || 'there'},</p>
                <p>You missed your <strong>${ALARM_LABELS[alarm.index]} dose</strong> scheduled for <strong>${timeStr}</strong>.</p>
                <p>It's been ${minutesSinceAlarm} minutes since your scheduled time.</p>
                <p style="background-color: #FFF5ED; border-left: 4px solid #EF7722; padding: 12px; margin: 20px 0;">
                  <strong>Please take your medication as soon as possible.</strong>
                </p>
                <p>If you've already taken it, you can log it in the dashboard to keep your records up to date.</p>
                <p>
                  <a href="${process.env.NEXTAUTH_URL}"
                     style="background-color: #0BA6DF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Open Dashboard
                  </a>
                </p>
                <hr style="border: none; border-top: 1px solid #EBEBEB; margin: 24px 0;">
                <p style="color: #6B7280; font-size: 12px;">
                  To disable email notifications, visit your Settings page.
                </p>
              </div>
            `,
          })

          console.log(`[Notification Check] Email sent successfully:`, emailResult)

          /**
           * STEP 7: Record that we sent this notification
           *
           * LEARNING: Why record this?
           * - Prevents sending duplicate emails
           * - Creates audit trail
           * - Can show user notification history
           */
          await prisma.emailNotification.create({
            data: {
              userId: user.id,
              alarmIndex: alarm.index,
              scheduledTime,
              emailType: 'missed_dose',
              success: true,
            },
          })

          totalNotificationsSent++
          console.log(`[Notification Check] Notification recorded in database`)
        } catch (emailError) {
          /**
           * LEARNING: Error handling for email sending
           * If email fails, we still record it (with success=false)
           * This prevents retry loops
           */
          console.error(`[Notification Check] Failed to send email:`, emailError)

          // Record the failed attempt
          await prisma.emailNotification.create({
            data: {
              userId: user.id,
              alarmIndex: alarm.index,
              scheduledTime,
              emailType: 'missed_dose',
              success: false,
            },
          })
        }
      }
    }

    console.log(`[Notification Check] Check complete. Sent ${totalNotificationsSent} notifications.`)

    return NextResponse.json({
      success: true,
      message: `Notification check complete`,
      notificationsSent: totalNotificationsSent,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('[Notification Check] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
