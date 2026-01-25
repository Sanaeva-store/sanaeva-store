import { auth } from '@/server/config/auth'
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
export async function checkUserRole(_userId: string, _roleCode: string): Promise<boolean> {
  // Implement custom RBAC logic
  throw new Error('Implement custom RBAC logic')
}

/**
 * Check if user has a specific permission
 */
export async function checkUserPermission(_userId: string, _permissionCode: string): Promise<boolean> {
  // Implement custom RBAC logic
  throw new Error('Implement custom RBAC logic')
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