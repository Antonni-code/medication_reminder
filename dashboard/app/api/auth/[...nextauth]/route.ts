// NextAuth API Route Handler
// This handles all authentication requests (signin, signout, callback, etc.)

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
