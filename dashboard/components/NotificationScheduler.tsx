/**
 * Notification Scheduler Component
 *
 * LEARNING: What does this component do?
 * This is a "headless" component (renders nothing visible) that runs in the background.
 * It checks for missed doses every minute by calling the /api/notifications/check endpoint.
 *
 * HOW IT WORKS:
 * 1. Runs only when user is logged in
 * 2. Uses setInterval to check every 60 seconds
 * 3. Calls the notification check API
 * 4. Logs results to console (for debugging)
 *
 * LEARNING: Why check from the client?
 * For this local/personal app, client-side checking is simpler than setting up cron jobs.
 * In production, you'd use:
 * - Vercel Cron Jobs (if deployed to Vercel)
 * - GitHub Actions (scheduled workflows)
 * - External cron service (like cron-job.org)
 *
 * PROS of client-side:
 * - Simple setup
 * - Works locally without external services
 * - No server configuration needed
 *
 * CONS of client-side:
 * - Only works when app is open
 * - Multiple tabs = multiple checks
 * - Not reliable for mission-critical notifications
 */

'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function NotificationScheduler() {
  const { data: session } = useSession()

  useEffect(() => {
    /**
     * LEARNING: Only run scheduler when user is logged in
     * No point checking for notifications if nobody is logged in
     */
    if (!session?.user) {
      console.log('[NotificationScheduler] No user session, scheduler disabled')
      return
    }

    console.log('[NotificationScheduler] Starting notification scheduler...')

    /**
     * LEARNING: Call the check endpoint immediately on load
     * Then set up interval for subsequent checks
     */
    const checkForMissedDoses = async () => {
      try {
        console.log('[NotificationScheduler] Checking for missed doses...')

        const response = await fetch('/api/notifications/check')
        const data = await response.json()

        if (data.success) {
          console.log(
            `[NotificationScheduler] Check complete. Sent ${data.notificationsSent} notifications.`
          )
        } else {
          console.error('[NotificationScheduler] Check failed:', data.error)
        }
      } catch (error) {
        console.error('[NotificationScheduler] Error checking for missed doses:', error)
      }
    }

    // Run immediately on mount
    checkForMissedDoses()

    /**
     * LEARNING: setInterval for periodic checks
     * 60000 milliseconds = 60 seconds = 1 minute
     *
     * This will call checkForMissedDoses() every minute
     */
    const intervalId = setInterval(checkForMissedDoses, 60000)

    /**
     * LEARNING: Cleanup function
     * When component unmounts, clear the interval
     * This prevents memory leaks
     */
    return () => {
      console.log('[NotificationScheduler] Stopping notification scheduler...')
      clearInterval(intervalId)
    }
  }, [session])

  /**
   * LEARNING: This component renders nothing
   * It's purely for side effects (the background checking)
   */
  return null
}
