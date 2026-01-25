# Better Auth + Elysia Integration - Quick Start

This guide shows you how to use the Better Auth integration with Elysia in your Next.js project.

## 🎯 What's Implemented

✅ **Better Auth** with Prisma adapter
✅ **Elysia** macro-based authentication
✅ **PostgreSQL** database
✅ **Email/Password** authentication
✅ **Session management**  
✅ **Protected routes** with authentication guards

## 📋 Prerequisites

1. Docker containers running (PostgreSQL)
2. Environment variables configured
3. Database migrated

## 🚀 Quick Start

### Step 1: Start Docker Containers

```bash
cd infra
docker-compose -f docker-compose.dev.yml up -d
```

### Step 2: Run Database Migration

```bash
bun prisma generate
bun prisma migrate dev
```

### Step 3: Start Development Server

```bash
bun dev
```

The API will be available at `http://localhost:3000/api`

## 🔑 Authentication Endpoints

Better Auth provides these endpoints automatically:

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/api/sign-up/email \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/auth/api/sign-in/email \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Response includes:**
- `token`: Session token for subsequent requests
- `user`: User information

### Get Session
```bash
curl -X GET http://localhost:3000/api/auth/api/session \\
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Sign Out
```bash
curl -X POST http://localhost:3000/api/auth/api/sign-out \\
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🛡️ Protected Routes

### Custom Protected Endpoints

We've created examples of custom protected routes:

#### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \\
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Profile
```bash
curl -X PUT http://localhost:3000/api/auth/profile \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "image": "https://example.com/avatar.jpg"
  }'
```

#### Get All Sessions
```bash
curl -X GET http://localhost:3000/api/auth/sessions \\
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 💻 Code Examples

### Creating Protected Routes

```typescript
import { Elysia, t } from 'elysia'
import { betterAuthPlugin } from '@/server/modules/auth/plugin'

export const myController = new Elysia({ prefix: '/my-module' })
  .use(betterAuthPlugin)
  
  // Protected route
  .get('/protected', ({ user, session }) => {
    return {
      message: `Hello ${user.name}!`,
      userId: user.id,
      sessionExpires: session.expiresAt
    }
  }, {
    auth: true // This makes the route protected
  })
  
  // Public route
  .get('/public', () => {
    return { message: 'This is public' }
  })
```

### Frontend Integration (React)

```typescript
// lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000'
})

export const { signIn, signUp, signOut, useSession } = authClient
```

```typescript
// app/login/page.tsx
'use client'

import { signIn } from '@/lib/auth-client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { data, error } = await signIn.email({
      email,
      password,
    })

    if (error) {
      console.error('Login failed:', error)
      return
    }

    console.log('Logged in:', data)
    // Redirect to dashboard
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  )
}
```

```typescript
// app/dashboard/page.tsx
'use client'

import { useSession, signOut } from '@/lib/auth-client'

export default function DashboardPage() {
  const { data: session, isPending } = useSession()

  if (isPending) return <div>Loading...</div>
  
  if (!session) {
    // Redirect to login
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  )
}
```

## 🏗️ Architecture

### File Structure
```
server/
├── config/
│   └── auth.ts              # Better Auth configuration
├── modules/
│   └── auth/
│       ├── plugin.ts        # Elysia plugin with macro
│       ├── controller.ts    # Custom protected routes
│       ├── service.ts       # Business logic (optional)
│       ├── repository.ts    # Database queries (optional)
│       ├── model.ts         # Zod schemas (optional)
│       └── middleware.ts    # Legacy middleware (not used)
└── server.ts                # Main Elysia server
```

### How It Works

1. **Better Auth Handler**: Mounted at `/api/auth`, provides all standard auth endpoints
2. **Elysia Macro**: The `auth: true` option in route config triggers the macro
3. **Macro Resolve**: Calls `auth.api.getSession()` to validate the session
4. **Context Injection**: If valid, injects `user` and `session` into route handler context
5. **Protected Route**: Handler can access `user` and `session` directly from context

## ⚙️ Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sanaeva_store"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-at-least-32-characters"
BETTER_AUTH_URL="http://localhost:3000"
```

### Better Auth Config ([server/config/auth.ts](server/config/auth.ts))

```typescript
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  
  basePath: '/api', // Combined with mount at '/auth', final path is /api/auth/api
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
})
```

## 📦 Available Endpoints

All endpoints are automatically provided by Better Auth:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/api/sign-up/email` | Sign up new user | No |
| POST | `/api/auth/api/sign-in/email` | Sign in user | No |
| POST | `/api/auth/api/sign-out` | Sign out user | Yes |
| GET | `/api/auth/api/session` | Get current session | Yes |
| GET | `/api/auth/me` | Get user profile (custom) | Yes |
| PUT | `/api/auth/profile` | Update profile (custom) | Yes |
| GET | `/api/auth/sessions` | Get all sessions (custom) | Yes |

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check that you're sending the Authorization header with Bearer token
- Verify the token is valid and not expired
- Ensure session exists in database

### "Cannot find module './modules/auth/plugin'"
- Run `bun prisma generate` to regenerate Prisma client
- Restart TypeScript server in VS Code

### Database Connection Error
- Ensure Docker containers are running
- Check DATABASE_URL in `.env` file
- Verify PostgreSQL is accessible

## 🔗 References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Elysia Better Auth Integration](https://elysiajs.com/integrations/better-auth.html)
- [Elysia Macro Documentation](https://elysiajs.com/patterns/macro.html)
- [Prisma Documentation](https://www.prisma.io/docs)

## 📝 Notes

- The old custom repository/service layers are kept for reference but not used for basic auth
- Better Auth handles all authentication logic internally
- Custom routes in `controller.ts` are examples - implement your business logic there
- Service and repository layers are optional for custom features beyond authentication

---

**Last Updated:** January 25, 2026  
**Integration Guide:** Elysia + Better Auth + Prisma + PostgreSQL
