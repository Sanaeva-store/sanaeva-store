// src/middleware.ts
import { Elysia } from 'elysia'
import * as authService from '@/server/modules/auth/service'
import type {
  UserResponse,
  SessionResponse,
} from '@/server/modules/auth/model'

/* ------------------------------------------------- *
 * Helper – extracts Bearer token from request header *
 * ------------------------------------------------- */
function extractToken(
  headers: Record<string, string | undefined>
): string | null {
  const authHeader = headers.authorization ?? headers.Authorization
  if (!authHeader) return null

  // "Bearer abc123" → "abc123"
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7)

  // allow raw token without the "Bearer " prefix
  return authHeader
}

/* ------------------------------------------------- *
 * Authentication middleware (legacy)                *
 * ------------------------------------------------- */
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .state('user', {} as UserResponse)
  .state('session', {} as any)
  .onBeforeHandle(async ({ headers, set, store }) => {
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

    if (!session.user.isActive) {
      set.status = 403
      throw new Error('Forbidden: User account is inactive')
    }

    // Store user and session in Elysia store for handler access
    store.user = session.user
    store.session = session.session
  })

/* ------------------------------------------------- *
 * Role‑based access control middleware              *
 * ------------------------------------------------- */
export const requireRole = (...roles: string[]) =>
  new Elysia({ name: 'role-middleware' })
    .use(authMiddleware) // make sure user is already attached
    .onBeforeHandle(async ({ store, set }) => {
      const user = store.user as UserResponse

      const checks = await Promise.all(
        roles.map((role) => authService.checkUserRole(user.id, role))
      )
      const hasAny = checks.some(Boolean)

      if (!hasAny) {
        set.status = 403
        throw new Error(`Forbidden: Requires one of roles: ${roles.join(', ')}`)
      }
    })

/* ------------------------------------------------- *
 * Permission‑based access control middleware        *
 * ------------------------------------------------- */
export const requirePermission = (...permissions: string[]) =>
  new Elysia({ name: 'permission-middleware' })
    .use(authMiddleware)
    .onBeforeHandle(async ({ store, set }) => {
      const user = store.user as UserResponse

      const checks = await Promise.all(
        permissions.map((p) => authService.checkUserPermission(user.id, p))
      )
      const hasAny = checks.some(Boolean)

      if (!hasAny) {
        set.status = 403
        throw new Error(`Forbidden: Requires one of permissions: ${permissions.join(', ')}`)
      }
    })