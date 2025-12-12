/**
 * Test Email Notification Endpoint
 *
 * LEARNING: What is this for?
 * This is a test endpoint to manually trigger a test email notification.
 * Useful for:
 * - Testing if Resend API key works
 * - Previewing email templates
 * - Debugging email delivery issues
 *
 * ENDPOINT: GET /api/notifications/test
 * PURPOSE: Send a test email to the current user
 * CALLED BY: Manual testing only (not used in production)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { resend, EMAIL_CONFIG } from '@/lib/resend'

/**
 * GET /api/notifications/test
 * Send a test email notification to the current user
 */
export async function GET(request: NextRequest) {
  try {
    // Get the currently logged-in user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
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

    console.log(`[Test Email] Sending test email to ${user.email}`)

    /**
     * LEARNING: Send test email using Resend
     * This uses the same email format as the real notifications
     */
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: user.email!,
      subject: 'Test - Medication Reminder Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0BA6DF;">Test Email - Medication Reminder</h2>
          <p>Hi ${user.name || 'there'},</p>
          <p>This is a test email to verify that your email notifications are working correctly.</p>
          <p style="background-color: #F0F9FF; border-left: 4px solid #0BA6DF; padding: 12px; margin: 20px 0;">
            <strong>✓ Email notifications are configured correctly!</strong>
          </p>
          <p>When you miss a medication dose, you'll receive an email similar to this one.</p>
          <hr style="border: none; border-top: 1px solid #EBEBEB; margin: 24px 0;">
          <p style="color: #6B7280; font-size: 12px;">
            This is a test email. You can safely ignore it.
          </p>
        </div>
      `,
    })

    console.log(`[Test Email] Email sent successfully:`, result)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: result.data?.id,
      recipient: user.email,
    })
  } catch (error) {
    console.error('[Test Email] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
