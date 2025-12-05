// Middleware to protect routes with authentication
// Redirects unauthenticated users to sign-in page

export { default } from "next-auth/middleware"

export const config = {
  // Protect all routes except auth pages and public assets
  matcher: [
    '/',
    '/alarms/:path*',
    '/stats/:path*',
    '/settings/:path*',
    '/api/arduino/:path*',
  ]
}
