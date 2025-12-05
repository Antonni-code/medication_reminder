// Middleware to protect routes with authentication
// Redirects unauthenticated users to sign-in page

import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // This function runs after authentication check
    console.log('Middleware: User authenticated, allowing access')
  },
  {
    pages: {
      signIn: '/auth/signin',
    },
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if token exists
        return !!token
      },
    },
  }
)

export const config = {
  // Protect all routes except auth pages and public assets
  matcher: [
    '/',
    '/alarms',
    '/stats',
    '/settings',
  ]
}
