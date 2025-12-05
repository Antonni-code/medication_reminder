// Prisma Client Instance
// This creates a singleton instance of Prisma Client to avoid connection issues
// Learn more: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// 1. Setup the adapter
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// 2. Setup the global object to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 3. Create the client (passing the adapter!)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // <--- This was missing in your second client!
    log: ['query', 'error', 'warn'],
  })

// 4. Save to global object
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 5. (Optional) Export 'db' as an alias if other files use it
export const db = prisma;
