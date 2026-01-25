import { Elysia } from 'elysia'
import * as authService from './modules/auth/service'
import type { UserResponse, SessionResponse } from './modules/auth/model'

/**
 * Authentication Middleware
 *
 * Protects routes by verifying the user's session token.
 * Adds the authenticated user to the context for use in route handlers.
 * This is a legacy middleware - use betterAuthPlugin from @/server/plugins/auth instead.
 */

export const authMiddleware = new Elysia({ name: 'auth-middleware' }).derive(async ({ headers, set }) => {
  const token = extractToken(headers)

  if (!token) {
    set.status = 401
    throw new Error('Unauthorized: No session token provided')
  }

  const session = await authService.getSession(token)

  if (!session) {
    set.status = 401
    throw new Error('Unauthorized: Invalid or expired session')
  }

  // Check if user is active
  if (!session.user.isActive) {
    set.status = 403
    throw new Error('Forbidden: User account is inactive')
  }

  // Return user and session from Better Auth
  return {
    user: session.user,
    session: session.session,
  }
})

/**
 * Role-based access control middleware
 */
export function requireRole(...roles: string[]) {
  return new Elysia({ name: 'role-middleware' })
    .use(authMiddleware)
    .derive(async (context) => {
      // Type assertion since authMiddleware adds user to context
      const user = (context as typeof context & { user: UserResponse }).user
      const { set } = context

      const hasRole = await Promise.all(
        roles.map((role) => authService.checkUserRole(user.id, role))
      )

      if (!hasRole.some((has) => has)) {
        set.status = 403
        throw new Error(`Forbidden: Requires one of roles: ${roles.join(', ')}`)
      }

      return {}
    })
}

/**
 * Permission-based access control middleware
 */
export function requirePermission(...permissions: string[]) {
  return new Elysia({ name: 'permission-middleware' })
    .use(authMiddleware)
    .derive(async (context) => {
      // Type assertion since authMiddleware adds user to context
      const user = (context as typeof context & { user: UserResponse }).user
      const { set } = context

      const hasPermission = await Promise.all(
        permissions.map((permission) => authService.checkUserPermission(user.id, permission))
      )

      if (!hasPermission.some((has) => has)) {
        set.status = 403
        throw new Error(`Forbidden: Requires one of permissions: ${permissions.join(', ')}`)
      }

      return {}
    })
}

/**
 * Helper function to extract token from headers
 */
function extractToken(headers: Record<string, string | undefined>): string | null {
  const authHeader = headers.authorization || headers.Authorization
  if (!authHeader) return null

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return authHeader
}
