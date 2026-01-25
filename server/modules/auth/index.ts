import { Elysia, t } from 'elysia'
import { betterAuthPlugin } from '@/server/plugins/auth'
import * as authService from './service'
import { signUpBackofficeSchema, signInFlexibleSchema } from './model'

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
 * - GET /api/auth/api/sign-in/google (OAuth - if configured)
 * - GET /api/auth/api/callback/google (OAuth callback)
 * - GET /api/auth/api/sign-in/facebook (OAuth - if configured)
 * - GET /api/auth/api/callback/facebook (OAuth callback)
 * 
 * Custom endpoints in this controller:
 * - POST /auth/backoffice/register: Register backoffice user with role
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
   * Sign in with email or username and password
   * Public route - no authentication required
   */
  .post(
    '/sign-in',
    async ({ body }) => {
      try {
        const validated = signInFlexibleSchema.parse(body)
        const result = await authService.signInFlexible(validated)

        return {
          success: true,
          data: result,
          message: 'Sign in successful',
        }
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            error: error.message,
          }
        }
        return {
          success: false,
          error: 'Sign in failed',
        }
      }
    },
    {
      body: t.Object({
        emailOrUsername: t.String({
          description: 'Email address or username',
        }),
        password: t.String(),
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'Sign in with email or username',
        description:
          'Sign in to the application using either email address or username along with password.',
      },
    }
  )

  /**
   * Register a backoffice user with role assignment
   * Public route - no authentication required
   */
  .post(
    '/backoffice/register',
    async ({ body }) => {
      try {
        const validated = signUpBackofficeSchema.parse(body)
        const result = await authService.signUpBackoffice(validated)

        return {
          success: true,
          data: result,
          message: 'Backoffice user registered successfully',
        }
      } catch (error) {
        if (error instanceof Error) {
          return {
            success: false,
            error: error.message,
          }
        }
        return {
          success: false,
          error: 'Registration failed',
        }
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8, maxLength: 128 }),
        name: t.Optional(t.String()),
        roleCode: t.Optional(
          t.Union([t.Literal('ADMIN'), t.Literal('MANAGER'), t.Literal('STAFF')])
        ),
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'Register backoffice user',
        description:
          'Register a new backoffice user with role assignment. Defaults to STAFF role if not specified.',
      },
    }
  )

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
