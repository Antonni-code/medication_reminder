'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { PolarisButton } from '@/components/ui/polaris-button'

export default function SignInPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5ED] via-white to-[#F0F9FF]">
      <div className="w-full max-w-md px-6">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-[#EF7722] to-[#FAA533] rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-4xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MedReminder</h1>
          <p className="text-gray-600 text-sm">Never miss your medication again</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white border-2 border-[#EBEBEB] rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Sign in to access your personalized medication reminders
          </p>

          {/* Google Sign In Button */}
          <PolarisButton
            fullWidth
            size="large"
            onClick={handleGoogleSignIn}
            disabled={loading}
            loading={loading}
            className="flex items-center justify-center gap-3"
          >
            {!loading && (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </PolarisButton>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="h-12 w-12 bg-[#0BA6DF] rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-700">Smart Alerts</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 bg-[#EF7722] rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-700">Track Progress</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 bg-[#FAA533] rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-gray-700">Custom Schedule</p>
          </div>
        </div>
      </div>
    </div>
  )
}
