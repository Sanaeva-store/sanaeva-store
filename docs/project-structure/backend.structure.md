# Backend Architecture Structure

> **Author:** Kritsana Prasit  
> **Last Updated:** January 24, 2026  
> **Purpose:** Comprehensive guide to the backend architecture using Elysia.js with Next.js

## Overview

This project uses **Elysia.js** as an alternative to Next.js API Route Handlers, providing a more performant and type-safe backend solution. The backend is integrated seamlessly with Next.js through a catch-all route handler.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Next.js App Router"
        A[app/api/[[...slugs]]/route.ts]
    end
    
    subgraph "Elysia Backend Server"
        B[server/server.ts]
        C[server/index.ts]
        
        subgraph "Modules"
            D[modules/auth/]
            D1[controller.ts]
            D2[service.ts]
            D3[repository.ts]
            D4[model.ts]
            
            D --> D1 --> D2 --> D3 --> D4
        end
        
        subgraph "Database Layer"
            E[db/client.ts]
            F[db/prisma/prisma.ts]
            G[(PostgreSQL)]
        end
        
        subgraph "Configuration"
            H[config/database.ts]
            I[config/index.ts]
        end
        
        subgraph "Plugins"
            J[plugins/cors.ts]
        end
        
        subgraph "Utils"
            K[utils/httpError.ts]
        end
    end
    
    subgraph "Frontend"
        L[eden/treaty.ts]
        M[React Components]
    end
    
    A -->|HTTP Requests| B
    B --> D
    B --> J
    D3 --> E
    E --> F --> G
    H --> E
    I --> H
    L -->|Type-safe API Calls| B
    M --> L
    
    style A fill:#0ea5e9
    style B fill:#8b5cf6
    style D fill:#ec4899
    style E fill:#10b981
    style L fill:#f59e0b
```

## Directory Structure

```
server/
├── index.ts              # Main entry point (currently empty)
├── server.ts             # Elysia app instance & route definitions
├── config/               # Configuration files
│   ├── database.ts       # Database configuration
│   └── index.ts          # Central config exports
├── db/                   # Database layer
│   ├── client.ts         # Prisma client singleton with PG adapter
│   └── prisma/
│       └── prisma.ts     # Prisma re-exports
├── modules/              # Feature modules (Domain-driven design)
│   └── auth/             # Authentication module example
│       ├── controller.ts # HTTP handlers & route definitions
│       ├── service.ts    # Business logic
│       ├── repository.ts # Data access layer
│       └── model.ts      # Zod schemas & TypeScript types
├── plugins/              # Elysia plugins
│   └── cors.ts           # CORS configuration
└── utils/                # Utility functions
    └── httpError.ts      # HTTP error helpers
```

## Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant NR as Next.js Route Handler
    participant ES as Elysia Server
    participant Ctrl as Controller
    participant Svc as Service
    participant Repo as Repository
    participant DB as Prisma Client
    participant PG as PostgreSQL

    C->>NR: HTTP Request (GET/POST/PUT/DELETE)
    NR->>ES: Forward to api.fetch
    ES->>Ctrl: Route to controller
    Ctrl->>Svc: Call service method
    Svc->>Repo: Data access request
    Repo->>DB: Prisma query
    DB->>PG: SQL query via PG adapter
    PG-->>DB: Result set
    DB-->>Repo: Typed data
    Repo-->>Svc: Domain object
    Svc-->>Ctrl: Processed result
    Ctrl-->>ES: JSON response
    ES-->>NR: HTTP response
    NR-->>C: Response to client
```

## Layer Responsibilities

### 1. **Route Handler Layer** (`app/api/[[...slugs]]/route.ts`)

The Next.js catch-all route that delegates all API requests to Elysia.

```typescript
// Current implementation
import { api } from '@/server/server'

export const GET = api.fetch
export const POST = api.fetch
export const PUT = api.fetch
export const DELETE = api.fetch
```

**Responsibilities:**
- Catch all API routes under `/api/*`
- Forward requests to Elysia server
- Maintain Next.js middleware compatibility

---

### 2. **Elysia Server Layer** (`server/server.ts`)

The main Elysia application instance with route definitions.

```typescript
import { Elysia, t } from 'elysia'

export const api = new Elysia({ prefix: '/api' })
  .get('/', () => ({ ok: true }))
  .post('/greet', ({ body }) => `👋 ${body.name}`, {
    body: t.Object({ name: t.String() })
  })
```

**Responsibilities:**
- Define API routes and their handlers
- Apply middleware and plugins
- Provide runtime validation with Elysia's type system
- Compose modules together

---

### 3. **Module Layer** (`server/modules/*`)

Each module follows a clean architecture pattern with 4 layers:

#### **Controller** (`controller.ts`)
```typescript
// Example structure
import { Elysia } from 'elysia'
import { authService } from './service'

export const authController = new Elysia({ prefix: '/auth' })
  .post('/login', async ({ body }) => {
    return await authService.login(body)
  })
  .post('/register', async ({ body }) => {
    return await authService.register(body)
  })
```

**Responsibilities:**
- Define HTTP routes for the module
- Parse request data
- Call service layer
- Format responses
- Handle HTTP-specific logic

#### **Service** (`service.ts`)
```typescript
// Example structure
import { authRepository } from './repository'
import { hashPassword, comparePassword } from '@/lib/crypto'

export const authService = {
  async login(credentials) {
    const user = await authRepository.findByEmail(credentials.email)
    // Business logic
    return { token, user }
  }
}
```

**Responsibilities:**
- Implement business logic
- Orchestrate data flow
- Handle validation
- Error handling
- Transaction management

#### **Repository** (`repository.ts`)
```typescript
// Example structure
import { prisma } from '@/server/db/client'

export const authRepository = {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    })
  },
  
  async create(data) {
    return await prisma.user.create({ data })
  }
}
```

**Responsibilities:**
- Data access abstraction
- Prisma query operations
- Data mapping
- Query optimization

#### **Model** (`model.ts`)
```typescript
// Example structure
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export type LoginInput = z.infer<typeof LoginSchema>
```

**Responsibilities:**
- Define Zod validation schemas
- Export TypeScript types
- Data transfer objects (DTOs)

---

### 4. **Database Layer** (`server/db/`)

#### **Client** (`db/client.ts`)
```typescript
import { PrismaClient } from '@/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  var __prisma: PrismaClient | undefined
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma =
  global.__prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma
}
```

**Features:**
- Singleton pattern for connection pooling
- Prisma 7.x adapter pattern with PostgreSQL
- Environment-based logging
- Hot-reload safe in development

---

### 5. **Configuration Layer** (`server/config/`)

Centralized configuration management.

```typescript
// config/database.ts
export const databaseConfig = {
  url: process.env.DATABASE_URL!,
  pool: {
    min: 2,
    max: 10
  }
}

// config/index.ts
export * from './database'
```

---

### 6. **Plugin Layer** (`server/plugins/`)

Elysia plugins for cross-cutting concerns.

```typescript
// plugins/cors.ts
import { cors } from '@elysiajs/cors'

export const corsPlugin = cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
})
```

---

### 7. **Utils Layer** (`server/utils/`)

Reusable utility functions.

```typescript
// utils/httpError.ts
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
  }
}

export const badRequest = (message: string) => new HttpError(400, message)
export const unauthorized = (message: string) => new HttpError(401, message)
export const notFound = (message: string) => new HttpError(404, message)
```

## Integration with Next.js

### 1. **Eden Treaty Client** (Type-safe API Client)

```typescript
// eden/treaty.ts
import { treaty } from '@elysiajs/eden'
import { api } from '@/server/server'

export const client = treaty(api)
```

**Usage in React Components:**
```typescript
import { client } from '@/eden/treaty'

// Type-safe API call with auto-completion
const result = await client.api.greet.post({
  name: 'John'
})
```

### 2. **Route Handler Bridge**

All API routes are handled by the catch-all route:
- `/api/*` → Next.js Route Handler → Elysia Server
- Maintains compatibility with Next.js middleware
- Zero configuration needed

## Best Practices

### Module Structure
1. **Keep modules focused** - One module per domain/feature
2. **Follow layered architecture** - Controller → Service → Repository
3. **Use dependency injection** - Pass dependencies explicitly
4. **Validate at boundaries** - Use Zod schemas in controllers

### Database Access
1. **Always use repository layer** - Never call Prisma directly from services
2. **Use transactions** - For multi-step operations
3. **Optimize queries** - Use Prisma's include/select carefully
4. **Handle errors** - Catch and wrap database errors

### Error Handling
```typescript
// In controller
try {
  return await service.doSomething()
} catch (error) {
  if (error instanceof HttpError) {
    return new Response(error.message, { status: error.statusCode })
  }
  throw error
}
```

### Type Safety
1. **Use Zod for validation** - Runtime type checking
2. **Infer types from schemas** - Single source of truth
3. **Use Prisma types** - Generated types from schema
4. **Eden Treaty for API calls** - End-to-end type safety

## Adding a New Module

1. Create module directory:
```bash
mkdir -p server/modules/products
```

2. Create the four layers:
```typescript
// controller.ts
export const productsController = new Elysia({ prefix: '/products' })
  .get('/', handler)

// service.ts
export const productsService = { ... }

// repository.ts
export const productsRepository = { ... }

// model.ts
export const ProductSchema = z.object({ ... })
```

3. Register in main server:
```typescript
// server/server.ts
import { productsController } from './modules/products/controller'

export const api = new Elysia({ prefix: '/api' })
  .use(productsController)
```

## Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/sanaeva_store"
NODE_ENV="development"
```

## Performance Considerations

1. **Prisma Connection Pool** - Configured via PG adapter
2. **Elysia Performance** - ~18x faster than Express.js
3. **Type Generation** - Zero runtime overhead
4. **Hot Reload** - Singleton pattern prevents connection leaks

## Monitoring & Debugging

### Development Logs
```typescript
// Prisma query logging
log: ['query', 'error', 'warn']
```

### Production Logs
```typescript
// Error-only logging
log: ['error']
```

## Migration from Next.js API Routes

If you have existing Next.js API routes, migrate them to Elysia:

**Before (Next.js):**
```typescript
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] })
}
```

**After (Elysia):**
```typescript
// server/modules/users/controller.ts
export const usersController = new Elysia({ prefix: '/users' })
  .get('/', () => ({ users: [] }))
```

## Conclusion

This backend architecture provides:
- ✅ **Type Safety** - End-to-end with Eden Treaty
- ✅ **Performance** - Elysia's bun-first design
- ✅ **Maintainability** - Clean layered architecture
- ✅ **Scalability** - Module-based structure
- ✅ **DX** - Hot reload, auto-completion, validation

---

*Generated by AI as directed by Kritsana Prasit on January 24, 2026*
