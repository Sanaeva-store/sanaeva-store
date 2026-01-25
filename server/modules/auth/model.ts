import { z } from 'zod'

/**
 * Authentication Models & Validation Schemas
 *
 * This file contains Zod schemas for request/response validation
 * and TypeScript types for authentication operations.
 * 
 * Following Elysia best practice: Single source of truth for types and validation
 */

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Sign Up Schema
 */
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),
  name: z.string().min(1, 'Name is required').optional(),
})

export type SignUpInput = z.infer<typeof signUpSchema>

/**
 * Backoffice Sign Up Schema
 */
export const signUpBackofficeSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),
  name: z.string().min(1, 'Name is required').optional(),
  roleCode: z
    .enum(['ADMIN', 'MANAGER', 'STAFF'])
    .default('STAFF')
    .optional()
    .describe('Role to assign to the user. Defaults to STAFF.'),
})

export type SignUpBackofficeInput = z.infer<typeof signUpBackofficeSchema>

/**
 * Sign In Schema (email only)
 */
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type SignInInput = z.infer<typeof signInSchema>

/**
 * Sign In with Email or Username Schema
 */
export const signInFlexibleSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'Email or username is required')
    .describe('Email address or username'),
  password: z.string().min(1, 'Password is required'),
})

export type SignInFlexibleInput = z.infer<typeof signInFlexibleSchema>

/**
 * Update Profile Schema
 */
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  image: z.string().url('Invalid image URL').optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// ============================================================================
// BETTER AUTH TYPES
// ============================================================================

/**
 * Better Auth User type from the database
 * Based on the Prisma schema with Better Auth conventions
 */
export interface BetterAuthUser {
  id: string
  email: string
  emailVerified: boolean
  name: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

/**
 * Better Auth Session response from sign-in
 * Based on actual Better Auth API responses
 */
export interface BetterAuthSignInResponse {
  user: BetterAuthUser
  token: string
  redirect: boolean
  url?: string
}

/**
 * Better Auth Session response from sign-up
 * Based on actual Better Auth API responses
 */
export interface BetterAuthSignUpResponse {
  user: BetterAuthUser
  token: string | null
}

/**
 * Better Auth Session object from getSession
 */
export interface BetterAuthSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Better Auth getSession response
 */
export interface BetterAuthGetSessionResponse {
  user: BetterAuthUser
  session: BetterAuthSession
}

// ============================================================================
// PUBLIC API RESPONSE TYPES
// ============================================================================

/**
 * User Response Type (public API response)
 */
export interface UserResponse {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: boolean
  isActive: boolean
  createdAt: Date
}

/**
 * Session Response Type (public API response)
 */
export interface SessionResponse {
  token: string
  user: UserResponse
  expiresAt: Date
}

/**
 * Sign Up Response Type
 */
export interface SignUpResponse {
  user: UserResponse
  token: string | null
}

/**
 * Sign In Response Type
 */
export interface SignInResponse {
  user: UserResponse
  token: string
}

/**
 * Auth Session Response Type (from getSession)
 */
export interface AuthSessionResponse {
  user: UserResponse
  session: BetterAuthSession
}