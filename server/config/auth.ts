import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/server/db/client'
import { createId } from '@paralleldrive/cuid2'

/**
 * Better Auth Configuration for Elysia
 *
 * Configured following: https://elysiajs.com/integrations/better-auth.html
 *
 * API Structure:
 * - Mounted at: /api/auth (via server.ts)
 * - Base path: /api
 * - Full auth endpoint: http://localhost:3000/api/auth/api
 *
 * Features:
 * - Email/Password authentication
 * - Session management with JWT
 * - Prisma adapter for PostgreSQL
 *
 * @see https://www.better-auth.com/docs/adapters/prisma
 * @see https://elysiajs.com/integrations/better-auth.html
 */
export const auth = betterAuth({
  // Database configuration
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // Base path for Better Auth API
  // Combined with Elysia mount at '/api/auth', final path is /api/auth/api
  basePath: '/api',

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production with email service
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // User configuration
  user: {
    additionalFields: {
      isActive: {
        type: 'boolean',
        required: false,
        defaultValue: true,
      },
    },
  },

  // Security settings
  advanced: {
    // Using cuid2 for better security and performance
    generateId: createId,
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  // Experimental features for better performance
  experimental: {
    joins: true, // Enable database joins for better performance
  },

  // Trust proxy for production deployments
  trustedOrigins: process.env.NEXTAUTH_URL
    ? [process.env.NEXTAUTH_URL]
    : ['http://localhost:3000'],
})

/**
 * Export auth types for TypeScript
 */
export type Auth = typeof auth
