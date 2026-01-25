# Authentication with Better Auth

This document provides comprehensive documentation for the authentication system implemented using Better Auth, Prisma, and PostgreSQL in the Sanaeva Store application.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Setup & Configuration](#setup--configuration)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Middleware & Guards](#middleware--guards)
- [Database Schema](#database-schema)
- [Usage Examples](#usage-examples)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

### What is Better Auth?

Better Auth is a modern authentication library for TypeScript that provides:
- Type-safe authentication
- Built-in adapters for various databases (Prisma, Drizzle, etc.)
- Session management
- Security best practices out of the box
- Extensible plugin system

### Why Better Auth?

1. **Type Safety**: Full TypeScript support with excellent type inference
2. **Database Agnostic**: Works with multiple database adapters
3. **Modern**: Built for modern web applications
4. **Secure**: Implements industry-standard security practices
5. **Developer Experience**: Simple API and great documentation

### Features Implemented

- ✅ Email/Password authentication
- ✅ Session management with automatic expiration
- ✅ User profile management
- ✅ Role-based access control (RBAC)
- ✅ Permission-based access control
- ✅ Multiple session management
- ✅ Secure password hashing
- ✅ JWT token handling
- ✅ Middleware protection for routes

## Architecture

### Project Structure

```
server/
├── config/
│   └── auth.ts                 # Better Auth configuration
├── modules/
│   └── auth/
│       ├── controller.ts       # Elysia routes for authentication
│       ├── service.ts          # Business logic layer
│       ├── repository.ts       # Database operations
│       ├── model.ts            # Zod schemas & TypeScript types
│       └── middleware.ts       # Authentication middleware
└── db/
    └── client.ts               # Prisma client instance
```

### Layer Responsibilities

#### 1. **Configuration Layer** (`config/auth.ts`)
- Initializes Better Auth with Prisma adapter
- Configures authentication providers
- Sets session and security options

#### 2. **Controller Layer** (`auth/controller.ts`)
- Handles HTTP requests using Elysia
- Validates input using Zod schemas
- Returns standardized responses
- Manages error handling

#### 3. **Service Layer** (`auth/service.ts`)
- Implements business logic
- Calls Better Auth API methods
- Orchestrates repository operations
- Transforms data for responses

#### 4. **Repository Layer** (`auth/repository.ts`)
- Direct database operations using Prisma
- CRUD operations for users and sessions
- Role and permission queries
- Data access abstraction

#### 5. **Model Layer** (`auth/model.ts`)
- Zod validation schemas
- TypeScript type definitions
- Request/response interfaces

#### 6. **Middleware Layer** (`auth/middleware.ts`)
- Route protection
- Session validation
- Role/permission checking
- Context enrichment

## Setup & Configuration

### 1. Environment Variables

Add to your `.env` file:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET="your-secret-key-change-in-production"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_TRUST_HOST=true

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/sanaeva_store?schema=public"
```

**Important**: Generate a secure random string for `BETTER_AUTH_SECRET` in production:

```bash
# Using openssl
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using bun
bun -e "console.log(Bun.randomUUIDv7() + Bun.randomUUIDv7())"
```

### 2. Database Schema

The Prisma schema includes the required models for Better Auth:

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  emailVerified Boolean  @default(false)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  sessions      Session[]
  accounts      Account[]
  roles         UserRole[]
  auditLogs     AuditLog[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@index([userId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
}
```

### 3. Run Database Migrations

```bash
# Generate Prisma client
bun prisma generate

# Create and apply migrations
bun prisma migrate dev --name add_better_auth_models

# Or use the Prisma CLI directly
npx @better-auth/cli generate
```

### 4. Initialize Auth in Server

The auth routes are already integrated in `server/server.ts`:

```typescript
import { authController } from './modules/auth/controller'

export const api = new Elysia({ prefix: '/api' })
  .use(authController)
  // ... other routes
```

## API Endpoints

### Public Endpoints

#### POST `/api/auth/sign-up`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe" // optional
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cm...",
      "email": "user@example.com",
      "name": "John Doe",
      "image": null,
      "emailVerified": false,
      "isActive": true,
      "createdAt": "2026-01-25T..."
    },
    "session": {
      "token": "eyJhbGc...",
      "expiresAt": "2026-02-01T..."
    }
  }
}
```

**Validation Rules:**
- Email must be valid email format
- Password must be 8-128 characters
- Name is optional

---

#### POST `/api/auth/sign-in`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "session": {
      "token": "eyJhbGc...",
      "expiresAt": "2026-02-01T..."
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

#### POST `/api/auth/sign-out`

Sign out the current user.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

---

#### GET `/api/auth/session`

Get the current session information.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "session": {
      "token": "eyJhbGc...",
      "user": { /* user object */ },
      "expiresAt": "2026-02-01T..."
    }
  }
}
```

### Protected Endpoints

All endpoints below require authentication via the `Authorization: Bearer <token>` header.

#### GET `/api/auth/me`

Get the current authenticated user's profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://...",
    "emailVerified": false,
    "isActive": true,
    "createdAt": "2026-01-25T..."
  }
}
```

---

#### PUT `/api/auth/profile`

Update the current user's profile.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",  // optional
  "image": "https://..."         // optional
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated user object */ }
}
```

---

#### GET `/api/auth/sessions`

Get all active sessions for the current user.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cm...",
      "token": "eyJhbGc...",
      "expiresAt": "2026-02-01T...",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2026-01-25T..."
    }
  ]
}
```

---

#### POST `/api/auth/sessions/revoke-all`

Revoke all sessions except the current one.

**Response (200):**
```json
{
  "success": true,
  "message": "All sessions revoked successfully"
}
```

## Authentication Flow

### Sign Up Flow

```
┌─────────┐      ┌─────────────┐      ┌─────────────┐      ┌──────────┐
│ Client  │      │ Controller  │      │  Service    │      │ Database │
└────┬────┘      └──────┬──────┘      └──────┬──────┘      └────┬─────┘
     │                  │                     │                  │
     │ POST /sign-up    │                     │                  │
     ├─────────────────>│                     │                  │
     │                  │                     │                  │
     │                  │ 1. Validate input   │                  │
     │                  │    (Zod schema)     │                  │
     │                  │                     │                  │
     │                  │ 2. Call signUp()    │                  │
     │                  ├────────────────────>│                  │
     │                  │                     │                  │
     │                  │                     │ 3. Check email   │
     │                  │                     │    not exists    │
     │                  │                     ├─────────────────>│
     │                  │                     │                  │
     │                  │                     │ 4. Create user   │
     │                  │                     │    Hash password │
     │                  │                     ├─────────────────>│
     │                  │                     │                  │
     │                  │                     │ 5. Create session│
     │                  │                     ├─────────────────>│
     │                  │                     │<─────────────────┤
     │                  │                     │                  │
     │                  │<────────────────────┤                  │
     │<─────────────────┤                     │                  │
     │ Return user +    │                     │                  │
     │ session token    │                     │                  │
```

### Sign In Flow

```
┌─────────┐      ┌─────────────┐      ┌─────────────┐      ┌──────────┐
│ Client  │      │ Controller  │      │  Service    │      │ Database │
└────┬────┘      └──────┬──────┘      └──────┬──────┘      └────┬─────┘
     │                  │                     │                  │
     │ POST /sign-in    │                     │                  │
     ├─────────────────>│                     │                  │
     │                  │                     │                  │
     │                  │ 1. Validate input   │                  │
     │                  │                     │                  │
     │                  │ 2. Call signIn()    │                  │
     │                  ├────────────────────>│                  │
     │                  │                     │                  │
     │                  │                     │ 3. Find user     │
     │                  │                     ├─────────────────>│
     │                  │                     │<─────────────────┤
     │                  │                     │                  │
     │                  │                     │ 4. Verify password
     │                  │                     │                  │
     │                  │                     │ 5. Create session│
     │                  │                     ├─────────────────>│
     │                  │                     │<─────────────────┤
     │                  │                     │                  │
     │                  │<────────────────────┤                  │
     │<─────────────────┤                     │                  │
     │ Return session   │                     │                  │
     │ token            │                     │                  │
```

### Protected Route Access

```
┌─────────┐      ┌─────────────┐      ┌─────────────┐      ┌──────────┐
│ Client  │      │ Middleware  │      │  Service    │      │ Database │
└────┬────┘      └──────┬──────┘      └──────┬──────┘      └────┬─────┘
     │                  │                     │                  │
     │ GET /api/auth/me │                     │                  │
     │ Authorization:   │                     │                  │
     │ Bearer <token>   │                     │                  │
     ├─────────────────>│                     │                  │
     │                  │                     │                  │
     │                  │ 1. Extract token    │                  │
     │                  │                     │                  │
     │                  │ 2. Validate session │                  │
     │                  ├────────────────────>│                  │
     │                  │                     │                  │
     │                  │                     │ 3. Query session │
     │                  │                     ├─────────────────>│
     │                  │                     │<─────────────────┤
     │                  │                     │                  │
     │                  │<────────────────────┤                  │
     │                  │                     │                  │
     │                  │ 4. Add user to      │                  │
     │                  │    context          │                  │
     │                  │                     │                  │
     │                  │ 5. Continue to      │                  │
     │                  │    route handler    │                  │
     │<─────────────────┤                     │                  │
     │ Return user data │                     │                  │
```

## Middleware & Guards

### Basic Authentication Middleware

Protects routes by verifying the session token:

```typescript
import { authMiddleware } from '@/server/modules/auth/middleware'

// Apply to routes that require authentication
app.use(authMiddleware)
  .get('/protected', ({ user }) => {
    return { message: `Hello ${user.name}` }
  })
```

### Role-Based Access Control

Restrict access based on user roles:

```typescript
import { requireRole } from '@/server/modules/auth/middleware'

// Only users with 'admin' role can access
app.use(requireRole('admin'))
  .get('/admin/dashboard', ({ user }) => {
    return { message: 'Admin dashboard' }
  })

// Multiple roles (OR logic)
app.use(requireRole('admin', 'moderator'))
  .delete('/content/:id', async ({ params }) => {
    // Delete content
  })
```

### Permission-Based Access Control

Restrict access based on specific permissions:

```typescript
import { requirePermission } from '@/server/modules/auth/middleware'

// Only users with 'INVENTORY_ADJUST' permission
app.use(requirePermission('INVENTORY_ADJUST'))
  .post('/inventory/adjust', async ({ body }) => {
    // Adjust inventory
  })

// Multiple permissions (OR logic)
app.use(requirePermission('PO_APPROVE', 'PO_EDIT'))
  .put('/purchase-orders/:id/approve', async ({ params }) => {
    // Approve PO
  })
```

### Custom Middleware Example

Create custom middleware for specific business rules:

```typescript
import { Elysia } from 'elysia'
import { authMiddleware } from '@/server/modules/auth/middleware'

const requireEmailVerified = new Elysia({ name: 'email-verified' })
  .use(authMiddleware)
  .derive(({ user, set }) => {
    if (!user.emailVerified) {
      set.status = 403
      throw new Error('Email verification required')
    }
    return { user }
  })

// Use in routes
app.use(requireEmailVerified)
  .post('/sensitive-action', () => {
    // Only verified users can access
  })
```

## Database Schema

### Core Authentication Models

#### User Model

Stores user account information:

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  emailVerified Boolean  @default(false)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  sessions      Session[]
  accounts      Account[]
  roles         UserRole[]
  auditLogs     AuditLog[]
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `email`: User's email (unique)
- `name`: Display name (optional)
- `image`: Profile image URL (optional)
- `emailVerified`: Email verification status
- `isActive`: Account active status
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

#### Session Model

Manages user sessions:

```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

**Fields:**
- `token`: Session JWT token (unique)
- `expiresAt`: Session expiration time
- `ipAddress`: Client IP address
- `userAgent`: Client user agent string

#### Account Model

For OAuth and credential providers:

```prisma
model Account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?   // Hashed password for email/password auth
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@index([userId])
}
```

### RBAC Models

#### Role Model

```prisma
model Role {
  id          String           @id @default(cuid())
  code        String           @unique
  name        String
  permissions RolePermission[]
  users       UserRole[]
}
```

#### Permission Model

```prisma
model Permission {
  id    String           @id @default(cuid())
  code  String           @unique  // e.g. INVENTORY_ADJUST, PO_APPROVE
  name  String
  roles RolePermission[]
}
```

#### UserRole (Many-to-Many)

```prisma
model UserRole {
  userId String
  roleId String
  user   User   @relation(fields: [userId], references: [id])
  role   Role   @relation(fields: [roleId], references: [id])

  @@id([userId, roleId])
}
```

#### RolePermission (Many-to-Many)

```prisma
model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])

  @@id([roleId, permissionId])
}
```

## Usage Examples

### Frontend Integration with React

#### 1. Create Auth Context

```typescript
// app/contexts/auth-context.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
}

interface AuthContext {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContext | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const token = localStorage.getItem('session_token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth/session', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data.user)
      } else {
        localStorage.removeItem('session_token')
      }
    } catch (error) {
      console.error('Session check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }

    const data = await response.json()
    localStorage.setItem('session_token', data.data.session.token)
    setUser(data.data.user)
  }

  async function signUp(email: string, password: string, name?: string) {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }

    const data = await response.json()
    localStorage.setItem('session_token', data.data.session.token)
    setUser(data.data.user)
  }

  async function signOut() {
    const token = localStorage.getItem('session_token')
    if (token) {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
    localStorage.removeItem('session_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

#### 2. Sign In Form

```typescript
// app/components/sign-in-form.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/app/contexts/auth-context'
import { useRouter } from 'next/navigation'

export function SignInForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
```

#### 3. Protected Route Component

```typescript
// app/components/protected-route.tsx
'use client'

import { useAuth } from '@/app/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
```

### Backend Integration Examples

#### Protected API Route Example

```typescript
// server/modules/inventory/controller.ts
import { Elysia } from 'elysia'
import { authMiddleware, requirePermission } from '../auth/middleware'

export const inventoryController = new Elysia({ prefix: '/inventory' })
  // All routes require authentication
  .use(authMiddleware)

  // Public for authenticated users
  .get('/', async ({ user }) => {
    // Get inventory for user's warehouse
    return { items: [] }
  })

  // Requires specific permission
  .use(requirePermission('INVENTORY_ADJUST'))
  .post('/adjust', async ({ body, user }) => {
    // Adjust inventory
    // user is automatically available from middleware
    return { success: true }
  })
```

#### Service Layer with Audit Logging

```typescript
// server/modules/inventory/service.ts
import { prisma } from '@/server/db/client'

export async function adjustInventory(
  userId: string,
  variantId: string,
  qty: number,
  note?: string
) {
  // Perform inventory adjustment
  const txn = await prisma.inventoryTxn.create({
    data: {
      type: 'ADJUST',
      variantId,
      qty,
      note,
      createdById: userId,
    },
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId,
      action: 'INVENTORY_ADJUST_CREATED',
      entity: 'InventoryTxn',
      entityId: txn.id,
      meta: {
        variantId,
        qty,
        note,
      },
    },
  })

  return txn
}
```

## Security Best Practices

### 1. Environment Variables

**Never commit secrets to version control:**

```bash
# .gitignore
.env
.env.local
.env.production
```

**Use strong secrets in production:**

```bash
# Generate secure random strings
openssl rand -base64 32
```

### 2. Password Requirements

Enforce strong passwords:

```typescript
export const signUpSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
})
```

### 3. Rate Limiting

Implement rate limiting to prevent brute force attacks:

```typescript
import { Elysia } from 'elysia'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function rateLimit(maxRequests = 5, windowMs = 60000) {
  return new Elysia({ name: 'rate-limit' }).derive(({ request, set }) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (!record || now > record.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
      return {}
    }

    if (record.count >= maxRequests) {
      set.status = 429
      throw new Error('Too many requests')
    }

    record.count++
    return {}
  })
}

// Apply to auth routes
authController.use(rateLimit(5, 60000)) // 5 requests per minute
```

### 4. HTTPS Only in Production

```typescript
// server/server.ts
if (process.env.NODE_ENV === 'production') {
  app.onRequest(({ request, set }) => {
    if (!request.url.startsWith('https://')) {
      set.status = 301
      set.headers['Location'] = request.url.replace('http://', 'https://')
      return null
    }
  })
}
```

### 5. Secure Headers

```bash
bun add elysiajs-helmet
```

```typescript
import { helmet } from 'elysiajs-helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}))
```

### 6. Session Security

- **Rotate session tokens** after sensitive operations
- **Implement session timeout**
- **Track session metadata** (IP, user agent)
- **Allow users to revoke sessions**

### 7. Input Validation

Always validate input:

```typescript
import { z } from 'zod'

// Bad ❌
app.post('/user', ({ body }) => {
  // Direct use of body
  return createUser(body.email, body.name)
})

// Good ✅
app.post('/user', ({ body }) => {
  const validated = signUpSchema.parse(body)
  return createUser(validated.email, validated.name)
})
```

### 8. Error Handling

Don't leak sensitive information:

```typescript
// Bad ❌
catch (error) {
  return { error: error.message } // Might expose internal details
}

// Good ✅
catch (error) {
  console.error('Sign in error:', error) // Log for debugging
  return { error: 'Sign in failed. Please check your credentials.' }
}
```

### 9. CORS Configuration

```typescript
import { cors } from '@elysiajs/cors'

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}))
```

### 10. Audit Logging

Log security-relevant events:

```typescript
await prisma.auditLog.create({
  data: {
    userId: user.id,
    action: 'USER_LOGIN',
    entity: 'User',
    entityId: user.id,
    meta: {
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    },
  },
})
```

## Troubleshooting

### Common Issues

#### 1. "Session not found" or "Invalid token"

**Cause:** Token expired or invalid

**Solution:**
- Check if token is properly stored and sent
- Verify token hasn't expired
- Check if `BETTER_AUTH_SECRET` is consistent across restarts

```typescript
// Check token expiration
const session = await authService.getSession(token)
if (!session) {
  // Token expired or invalid - redirect to login
}
```

#### 2. "Unauthorized: No session token provided"

**Cause:** Missing Authorization header

**Solution:**
```typescript
// Correct way to send token
fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
```

#### 3. Database Connection Errors

**Cause:** Prisma client not generated or DATABASE_URL incorrect

**Solution:**
```bash
# Regenerate Prisma client
bun prisma generate

# Check DATABASE_URL
echo $DATABASE_URL

# Test database connection
bun prisma db pull
```

#### 4. "User already exists"

**Cause:** Attempting to create user with existing email

**Solution:**
```typescript
// Check before creating
const existing = await findUserByEmail(email)
if (existing) {
  throw new Error('Email already registered')
}
```

#### 5. CORS Errors

**Cause:** Frontend and backend on different origins without CORS setup

**Solution:**
```typescript
import { cors } from '@elysiajs/cors'

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
```

#### 6. "Better Auth configuration error"

**Cause:** Missing or invalid environment variables

**Solution:**
```bash
# Check required env vars are set
echo $BETTER_AUTH_SECRET
echo $BETTER_AUTH_URL
echo $DATABASE_URL

# Set them if missing
export BETTER_AUTH_SECRET="your-secret-key"
export BETTER_AUTH_URL="http://localhost:3000"
```

### Debugging Tips

#### Enable Better Auth Debug Mode

```typescript
// server/config/auth.ts
export const auth = betterAuth({
  // ... config
  advanced: {
    debug: process.env.NODE_ENV === 'development',
  },
})
```

#### Check Prisma Queries

```typescript
// server/db/client.ts
export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

#### Inspect Session Data

```typescript
// Add logging in service
export async function getSession(token: string) {
  console.log('Fetching session for token:', token.substring(0, 10) + '...')
  const result = await auth.api.getSession({
    headers: { authorization: `Bearer ${token}` },
  })
  console.log('Session result:', result ? 'found' : 'not found')
  return result
}
```

### Getting Help

1. **Check Better Auth Documentation**: https://www.better-auth.com/docs
2. **Prisma Documentation**: https://www.prisma.io/docs
3. **Review audit logs** in the database for security events
4. **Check server logs** for detailed error messages
5. **Use Prisma Studio** to inspect database state: `bun prisma studio`

---

**Generated by AI as directed by the Sanaeva Store development team on January 25, 2026**
