import { Elysia, t } from 'elysia'
import { betterAuthPlugin } from '@/server/plugins/auth'

/**
 * Authentication Controller (Example Custom Routes)
 * 
 * This demonstrates custom authenticated routes that use the auth macro
 * provided by betterAuthPlugin.
 * 
 * Better Auth provides all standard auth endpoints automatically.
 * Use this controller only for custom business logic beyond authentication.
 * 
 * Standard Better Auth endpoints are available at:
 * - POST /api/auth/api/sign-up/email
 * - POST /api/auth/api/sign-in/email
 * - POST /api/auth/api/sign-out
 * - GET /api/auth/api/session
 * 
 * Custom endpoints in this controller:
 * - GET /auth/me: Get current user profile
 * - PUT /auth/profile: Update user profile
 * - GET /auth/sessions: Get all user sessions
 * 
 * Note: Plugin deduplication ensures betterAuthPlugin is only loaded once
 * even if .use(betterAuthPlugin) appears in multiple places.
 */

export const authController = new Elysia({ prefix: '/auth' })
  .use(betterAuthPlugin)

  /**
   * Get current user profile
   * Protected route - requires authentication
   */
  .get(
    '/me',
    ({ user }) => {
      return {
        success: true,
        data: user,
      }
    },
    {
      auth: true,
      detail: {
        tags: ['Authentication'],
        summary: 'Get current user profile',
        description: 'Returns the authenticated user information',
      },
    }
  )

  /**
   * Update user profile
   * Protected route - requires authentication
   */
  .put(
    '/profile',
    async ({ user, body }) => {
      // Add your custom profile update logic here
      // This is just an example - implement with your service layer
      return {
        success: true,
        message: 'Profile update endpoint - implement with your service layer',
        user,
        body,
      }
    },
    {
      auth: true,
      body: t.Object({
        name: t.Optional(t.String()),
        image: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'Update user profile',
        description: 'Update the authenticated user profile information',
      },
    }
  )

  /**
   * Get all user sessions
   * Protected route - requires authentication
   */
  .get(
    '/sessions',
    ({ user, session }) => {
      return {
        success: true,
        message: 'User sessions endpoint - implement with your service layer',
        currentSession: session,
        user,
      }
    },
    {
      auth: true,
      detail: {
        tags: ['Authentication'],
        summary: 'Get user sessions',
        description: 'Get all active sessions for the authenticated user',
      },
    }
  )
