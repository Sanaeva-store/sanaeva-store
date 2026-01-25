# Better Auth Quick Start Guide

This guide will help you quickly integrate Better Auth authentication into your Sanaeva Store application.

## Installation

Better Auth is already installed in the project. If you need to reinstall:

```bash
bun add better-auth
```

## Quick Setup (5 Minutes)

### Step 1: Environment Variables

Ensure these variables are set in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/sanaeva_store?schema=public"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-change-in-production"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_TRUST_HOST=true
```

### Step 2: Run Migrations

```bash
# Generate Prisma client
bun prisma generate

# Apply database migrations
bun prisma migrate dev
```

### Step 3: Start the Server

```bash
bun dev
```

The authentication endpoints are now available at `/api/auth/*`

## Testing the API

### 1. Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cm...",
      "email": "test@example.com",
      "name": "Test User",
      "emailVerified": false,
      "isActive": true
    },
    "session": {
      "token": "eyJhbGc...",
      "expiresAt": "2026-02-01T..."
    }
  }
}
```

Save the `session.token` for subsequent requests.

### 2. Sign In

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'
```

### 3. Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### 4. Update Profile

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

### 5. Sign Out

```bash
curl -X POST http://localhost:3000/api/auth/sign-out \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Frontend Integration

### React Hook Example

```typescript
// hooks/use-auth.ts
import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    const token = localStorage.getItem('session_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (res.ok) {
        const { data } = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    const res = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) throw new Error('Sign in failed')

    const { data } = await res.json()
    localStorage.setItem('session_token', data.session.token)
    setUser(data.user)
  }

  async function signOut() {
    const token = localStorage.getItem('session_token')
    await fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    localStorage.removeItem('session_token')
    setUser(null)
  }

  return { user, loading, signIn, signOut }
}
```

### Usage in Component

```typescript
'use client'

import { useAuth } from '@/hooks/use-auth'

export function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return <div>Welcome, {user.name}!</div>
}
```

## Protected Routes

### Middleware Example

```typescript
import { authMiddleware } from '@/server/modules/auth/middleware'

// Protect routes
app.use(authMiddleware)
  .get('/protected', ({ user }) => {
    return { message: `Hello ${user.name}` }
  })
```

### Role-Based Protection

```typescript
import { requireRole } from '@/server/modules/auth/middleware'

app.use(requireRole('admin'))
  .get('/admin/users', () => {
    // Only admins can access
  })
```

### Permission-Based Protection

```typescript
import { requirePermission } from '@/server/modules/auth/middleware'

app.use(requirePermission('INVENTORY_ADJUST'))
  .post('/inventory/adjust', ({ body, user }) => {
    // Only users with INVENTORY_ADJUST permission
  })
```

## Common Patterns

### API Call with Authentication

```typescript
async function fetchProtectedData() {
  const token = localStorage.getItem('session_token')
  
  const response = await fetch('/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (response.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/sign-in'
    return
  }

  return response.json()
}
```

### Axios Interceptor

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('session_token')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

export default api
```

### React Query Integration

```typescript
import { useQuery } from '@tanstack/react-query'

function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const token = localStorage.getItem('session_token')
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch user')
      const { data } = await res.json()
      return data
    },
    retry: false,
  })
}
```

## Next Steps

1. **Read the full documentation**: [Authentication README](./README.md)
2. **Implement role-based access control**: See RBAC section
3. **Add email verification**: Configure email service
4. **Set up OAuth providers**: Google, GitHub, etc.
5. **Implement password reset**: Add forgot password flow

## Troubleshooting

### Session not persisting

Check that you're storing the token correctly:

```typescript
// After sign in
const { data } = await response.json()
localStorage.setItem('session_token', data.session.token)
```

### CORS errors

Add CORS middleware:

```typescript
import { cors } from '@elysiajs/cors'

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
```

### "Unauthorized" errors

Verify the token is being sent:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,  // Must include "Bearer " prefix
}
```

---

**Generated by AI as directed by the Sanaeva Store development team on January 25, 2026**
