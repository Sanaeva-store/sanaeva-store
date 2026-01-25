import { Elysia } from 'elysia'
import { auth } from '@/server/config/auth'

/**
 * Better Auth Plugin for Elysia
 *
 * Following the official Elysia + Better Auth integration guide:
 * https://elysiajs.com/integrations/better-auth.html
 *
 * This plugin provides:
 * 1. Better Auth handler mounted at /auth
 * 2. Authentication macro for protected routes
 * 3. User and session injection via resolve
 *
 * Usage in routes:
 * ```ts
 * app.get('/protected', ({ user, session }) => {
 *   return { user, session }
 * }, {
 *   auth: true // Require authentication
 * })
 * ```
 *
 * Endpoints provided by Better Auth:
 * - POST /api/auth/api/sign-up/email
 * - POST /api/auth/api/sign-in/email
 * - POST /api/auth/api/sign-out
 * - GET /api/auth/api/session
 * - And more...
 */

/**
 * Better Auth Plugin with authentication macro
 *
 * This creates an Elysia plugin that:
 * 1. Mounts the Better Auth handler
 * 2. Adds an `auth` macro for route-level authentication
 */
export const betterAuthPlugin = new Elysia({ name: 'better-auth' })
  // Mount Better Auth handler at /auth
  .mount('/auth', auth.handler)

  // Add authentication macro using property shorthand
  .macro({
    auth: {
      resolve: async ({ request: { headers }, set }) => {
        // Convert Headers to a plain object for Better Auth
        const headersObj: Record<string, string> = {}
        headers.forEach((value, key) => {
          headersObj[key] = value
        })

        // Get session from Better Auth
        const session = await auth.api.getSession({
          headers: headersObj,
        })

        // If no session and auth is required, return 401
        if (!session) {
          set.status = 401
          throw new Error('Unauthorized')
        }

        // Inject user and session into context
        return {
          user: session.user,
          session: session.session,
        }
      },
    },
  })

/**
 * Export type-safe auth plugin for use in other files
 */
export type BetterAuthPlugin = typeof betterAuthPlugin
