import { auth } from '@/server/config/auth'
import { prisma } from '@/server/db/client'
import type {
  SignUpInput,
  SignInInput,
  UpdateProfileInput,
  UserResponse,
  BetterAuthUser,
  BetterAuthSignInResponse,
  BetterAuthSignUpResponse,
  BetterAuthGetSessionResponse,
  SignUpResponse,
  SignInResponse,
  AuthSessionResponse,
  SignUpBackofficeInput,
} from './model'

/**
 * Authentication Service
 *
 * Business logic layer for authentication operations.
 * Uses Better Auth for authentication and session management.
 */

/**
 * Sign up a new user
 */
export async function signUp(input: SignUpInput): Promise<SignUpResponse> {
  try {
    // Better Auth requires name for email/password signUp
    const result = (await auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name || '', // Provide empty string if no name
      },
    })) as BetterAuthSignUpResponse

    if (!result || !result.user) {
      throw new Error('Failed to create user')
    }

    return {
      user: mapUserToResponse(result.user),
      token: result.token,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign up failed: ${error.message}`)
    }
    throw new Error('Sign up failed')
  }
}

/**
 * Sign up a backoffice user with role assignment
 */
export async function signUpBackoffice(input: SignUpBackofficeInput): Promise<SignUpResponse> {
  try {
    // Create user with Better Auth
    const result = (await auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name || '',
      },
    })) as BetterAuthSignUpResponse

    if (!result || !result.user) {
      throw new Error('Failed to create user')
    }

    // Assign role to user
    const role = await prisma.role.findUnique({
      where: { code: input.roleCode || 'STAFF' },
    })

    if (!role) {
      throw new Error(`Role ${input.roleCode || 'STAFF'} not found`)
    }

    await prisma.userRole.create({
      data: {
        userId: result.user.id,
        roleId: role.id,
      },
    })

    // Log user creation
    await prisma.auditLog.create({
      data: {
        userId: result.user.id,
        action: 'USER_CREATED',
        entity: 'User',
        entityId: result.user.id,
        meta: JSON.stringify({ roleCode: input.roleCode || 'STAFF' }),
      },
    })

    return {
      user: mapUserToResponse(result.user),
      token: result.token,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Backoffice sign up failed: ${error.message}`)
    }
    throw new Error('Backoffice sign up failed')
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(input: SignInInput): Promise<SignInResponse> {
  try {
    const result = (await auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
      },
    })) as BetterAuthSignInResponse

    if (!result || !result.user) {
      throw new Error('Invalid credentials')
    }

    return {
      user: mapUserToResponse(result.user),
      token: result.token,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign in failed: ${error.message}`)
    }
    throw new Error('Sign in failed')
  }
}

/**
 * Sign out a user
 */
export async function signOut(sessionToken: string): Promise<void> {
  try {
    await auth.api.signOut({
      headers: {
        authorization: `Bearer ${sessionToken}`,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Sign out failed: ${error.message}`)
    }
    throw new Error('Sign out failed')
  }
}

/**
 * Get current session
 */
export async function getSession(sessionToken: string): Promise<AuthSessionResponse | null> {
  try {
    const result = (await auth.api.getSession({
      headers: {
        authorization: `Bearer ${sessionToken}`,
      },
    })) as BetterAuthGetSessionResponse | null

    if (!result) {
      return null
    }

    return {
      user: mapUserToResponse(result.user),
      session: result.session,
    }
  } catch (error) {
    return null
  }
}

/**
 * Update user profile
 */
export async function updateProfile(_userId: string, _input: UpdateProfileInput): Promise<UserResponse> {
  // Implement with Better Auth API when available
  throw new Error('Profile update not yet implemented - use Better Auth API')
}

/**
 * Get user by ID
 */
export async function getUserById(_userId: string): Promise<UserResponse | null> {
  // Use Better Auth session to get user info
  throw new Error('Use auth.api.getSession() instead')
}

/**
 * Get user by email
 */
export async function getUserByEmail(_email: string): Promise<UserResponse | null> {
  // Use Better Auth API
  throw new Error('Use Better Auth API methods instead')
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(_userId: string): Promise<never> {
  // Implement with Better Auth API when available
  throw new Error('Use Better Auth API methods instead')
}

/**
 * Revoke all sessions for a user
 */
export async function revokeAllSessions(_userId: string): Promise<never> {
  // Implement with Better Auth API when available
  throw new Error('Use Better Auth API methods instead')
}

/**
 * Check if user has a specific role
 */
export async function checkUserRole(userId: string, roleCode: string): Promise<boolean> {
  try {
    const userRole = await prisma.userRole.findFirst({
      where: {
        userId,
        role: {
          code: roleCode,
        },
      },
    })
    return userRole !== null
  } catch (error) {
    console.error('Check user role failed:', error)
    return false
  }
}

/**
 * Check if user has a specific permission
 */
export async function checkUserPermission(userId: string, permissionCode: string): Promise<boolean> {
  try {
    const userRoleWithPermission = await prisma.userRole.findFirst({
      where: {
        userId,
        role: {
          permissions: {
            some: {
              permission: {
                code: permissionCode,
              },
            },
          },
        },
      },
    })
    return userRoleWithPermission !== null
  } catch (error) {
    console.error('Check user permission failed:', error)
    return false
  }
}

/**
 * Handle social login post-authentication
 * Auto-assigns CUSTOMER role for social login users
 */
export async function handleSocialLogin(userId: string, provider: string): Promise<void> {
  try {
    // Check if user already has a role
    const existingRole = await prisma.userRole.findFirst({
      where: { userId },
    })

    if (!existingRole) {
      // Auto-assign CUSTOMER role for social logins
      const customerRole = await prisma.role.findUnique({
        where: { code: 'CUSTOMER' },
      })

      if (customerRole) {
        await prisma.userRole.create({
          data: {
            userId,
            roleId: customerRole.id,
          },
        })
      }
    }

    // Log social login
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'SOCIAL_LOGIN',
        entity: 'User',
        entityId: userId,
        meta: JSON.stringify({ provider }),
      },
    })
  } catch (error) {
    console.error('Handle social login failed:', error)
    // Don't throw - allow login to continue even if role assignment fails
  }
}

/**
 * Map Better Auth user entity to user response
 */
function mapUserToResponse(user: BetterAuthUser): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    emailVerified: user.emailVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
  }
}