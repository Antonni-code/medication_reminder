/**
 * Resend Email Service Configuration
 *
 * LEARNING: What is this file?
 * This creates a Resend client that we'll use throughout our app to send emails.
 * Similar to how lib/prisma.ts creates a Prisma client for database access.
 *
 * LEARNING: Why separate configuration?
 * - Reusability: Import this client anywhere you need to send emails
 * - Consistency: Same configuration used everywhere
 * - Easy to update: Change API key in one place
 */

import { Resend } from 'resend'

// Check if API key exists in environment variables
// LEARNING: The '!' tells TypeScript "I promise this exists"
// In production, you should handle this more gracefully
if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set. Email notifications will not work.')
}

/**
 * LEARNING: What is this doing?
 * Creates a Resend client with your API key
 * This is like logging into the Resend service
 *
 * The API key is stored in .env file (never commit it to git!)
 */
export const resend = new Resend(process.env.RESEND_API_KEY || '')

/**
 * LEARNING: Email Configuration
 * These constants define default email settings
 */
export const EMAIL_CONFIG = {
  // Who the email appears to be from
  // IMPORTANT: Must be a domain you verified with Resend
  // For testing, you can use onboarding@resend.dev
  from: 'Medication Reminder <onboarding@resend.dev>',

  // Email subject templates
  subjects: {
    missedDose: 'Medication Reminder - Missed Dose',
    upcomingDose: 'Medication Reminder - Upcoming Dose',
  },
}
