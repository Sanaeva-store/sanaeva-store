# Infrastructure Setup

This directory contains the Docker configuration for the Sanaeva Store application.

## Table of Contents

- [Services Overview](#services-overview)
- [Prerequisites](#prerequisites)
- [Starting Containers](#starting-containers)
- [PostgreSQL Database](#postgresql-database)
- [MinIO Object Storage](#minio-object-storage)
- [Redis Cache](#redis-cache)
- [Development Workflow](#development-workflow)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Services Overview

The development environment includes the following containerized services:

| Service | Port(s) | Purpose | Image |
|---------|---------|---------|-------|
| **App** | 3000 | Next.js application with Bun runtime | Custom (Dockerfile.dev) |
| **PostgreSQL** | 5432 | Primary relational database | postgres:15-alpine |
| **MinIO** | 9000, 9001 | S3-compatible object storage | minio/minio:latest |
| **Redis** | 6379 | In-memory cache and session storage | redis:7-alpine |

All services are connected through a custom Docker network (`sanaeva-network`) and include health checks for reliability.

## Prerequisites

Before starting, ensure you have installed:

- **Docker Desktop** (v20.10+) - [Download](https://www.docker.com/products/docker-desktop)
- **Docker Compose** (v2.0+) - Included with Docker Desktop
- **Bun** (v1.0+) - [Install](https://bun.sh/docs/installation) (optional, for local development)

Verify installation:
```bash
docker --version
docker-compose --version
```

## Starting Containers

### Initial Setup

1. **Navigate to project root:**
   ```bash
   cd /path/to/sanaeva-store
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure required environment variables:
   ```env
   # Database
   DATABASE_URL=postgresql://postgres:password@localhost:5432/sanaeva_store
   
   # MinIO
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_ROOT_USER=minioadmin
   MINIO_ROOT_PASSWORD=minioadmin
   MINIO_USE_SSL=false
   MINIO_BUCKET_NAME=sanaeva-uploads
   
   # Redis
   REDIS_URL=redis://localhost:6379
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   # Application
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

### Starting Services

**Start all services in detached mode:**
```bash
docker-compose -f infra/docker-compose.dev.yml up -d
```

**Start specific services:**
```bash
# Only database and cache
docker-compose -f infra/docker-compose.dev.yml up -d postgres redis

# Only storage services
docker-compose -f infra/docker-compose.dev.yml up -d minio
```

**Start with live logs:**
```bash
docker-compose -f infra/docker-compose.dev.yml up
```

### Monitoring Services

**View logs:**
```bash
# All services
docker-compose -f infra/docker-compose.dev.yml logs -f

# Specific service
docker-compose -f infra/docker-compose.dev.yml logs -f postgres
docker-compose -f infra/docker-compose.dev.yml logs -f minio
docker-compose -f infra/docker-compose.dev.yml logs -f redis
```

**Check service status:**
```bash
docker-compose -f infra/docker-compose.dev.yml ps
```

**Check service health:**
```bash
docker inspect sanaeva-postgres --format='{{.State.Health.Status}}'
docker inspect sanaeva-minio --format='{{.State.Health.Status}}'
docker inspect sanaeva-redis --format='{{.State.Health.Status}}'
```

### Stopping Services

**Stop all services (keeps data):**
```bash
docker-compose -f infra/docker-compose.dev.yml stop
```

**Stop and remove containers (keeps data):**
```bash
docker-compose -f infra/docker-compose.dev.yml down
```

**Stop and remove everything including volumes (⚠️ deletes all data):**
```bash
docker-compose -f infra/docker-compose.dev.yml down -v
```

### Restarting Services

**Restart all services:**
```bash
docker-compose -f infra/docker-compose.dev.yml restart
```

**Restart specific service:**
```bash
docker-compose -f infra/docker-compose.dev.yml restart postgres
```

**Rebuild and restart (after Dockerfile changes):**
```bash
docker-compose -f infra/docker-compose.dev.yml up -d --build
```

## PostgreSQL Database

### Connection Details

| Parameter | Value |
|-----------|-------|
| Host | `localhost` (from host machine)<br/>`postgres` (from other containers) |
| Port | `5432` |
| Database | `sanaeva_store` |
| Username | `postgres` |
| Password | `password` |
| Connection String | `postgresql://postgres:password@localhost:5432/sanaeva_store` |

### Connecting with DBeaver

DBeaver is a powerful open-source database management tool that supports PostgreSQL.

#### Step 1: Install DBeaver

Download from [dbeaver.io](https://dbeaver.io/download/) or install via package manager:

**macOS:**
```bash
brew install --cask dbeaver-community
```

**Ubuntu/Debian:**
```bash
sudo snap install dbeaver-ce
```

#### Step 2: Create New Connection

1. Launch DBeaver
2. Click **Database** → **New Database Connection** (or press `⌘N` / `Ctrl+N`)
3. Select **PostgreSQL** and click **Next**

#### Step 3: Configure Connection

Fill in the connection details:

```
Main Tab:
  Host: localhost
  Port: 5432
  Database: sanaeva_store
  Username: postgres
  Password: password
  
  ☑ Show all databases
  ☑ Save password locally
```

#### Step 4: Test and Connect

1. Click **Test Connection** button
   - If successful, you'll see "Connected" message
   - If DBeaver asks to download drivers, click **Download**
2. Click **Finish** to save the connection

#### Step 5: Advanced Configuration (Optional)

Go to **Connection settings** → **Connection details**:

```
SSH Tab: (if connecting to remote server)
  ☑ Use SSH Tunnel
  Host/IP: your-server-ip
  Port: 22
  Username: your-ssh-user
  Authentication Method: Public Key or Password

PostgreSQL Tab:
  ☑ Show template databases
  ☑ Show databases available for user
  
SSL Tab: (for production)
  SSL mode: require
  Root certificate: /path/to/ca.crt
```

### Using DBeaver with Sanaeva Store

**View Tables:**
1. Expand: `sanaeva_store` → `Schemas` → `public` → `Tables`
2. Double-click any table to browse data

**Execute Queries:**
1. Right-click database → **SQL Editor** → **New SQL Script**
2. Write your query:
   ```sql
   SELECT * FROM users LIMIT 10;
   ```
3. Press `⌘Enter` / `Ctrl+Enter` to execute

**Generate ER Diagram:**
1. Right-click `public` schema → **View Diagram**
2. DBeaver will generate a visual representation of your database structure

**Export Data:**
1. Right-click table → **Export Data**
2. Choose format (CSV, JSON, SQL, etc.)
3. Configure export settings and click **Start**

### Database Management via CLI

**Access PostgreSQL container:**
```bash
docker exec -it sanaeva-postgres psql -U postgres -d sanaeva_store
```

**Common PostgreSQL commands:**
```sql
-- List all databases
\l

-- List all tables in current database
\dt

-- Describe table structure
\d table_name

-- Show all schemas
\dn

-- List all users and roles
\du

-- Execute SQL file
\i /path/to/file.sql

-- Exit psql
\q
```

**Backup database:**
```bash
docker exec sanaeva-postgres pg_dump -U postgres sanaeva_store > backup.sql
```

**Restore database:**
```bash
docker exec -i sanaeva-postgres psql -U postgres sanaeva_store < backup.sql
```

**Reset database (⚠️ destructive):**
```bash
docker exec -it sanaeva-postgres psql -U postgres -c "DROP DATABASE IF EXISTS sanaeva_store;"
docker exec -it sanaeva-postgres psql -U postgres -c "CREATE DATABASE sanaeva_store;"
docker-compose -f infra/docker-compose.dev.yml restart postgres
```

### Prisma Integration

**Run migrations:**
```bash
bun prisma migrate dev
```

**Generate Prisma Client:**
```bash
bun prisma generate
```

**Open Prisma Studio:**
```bash
bun prisma studio
```

**Reset database (development only):**
```bash
bun prisma migrate reset
```

## MinIO Object Storage

MinIO is a high-performance, S3-compatible object storage system ideal for storing files, images, videos, and backups.

### MinIO Access Details

| Parameter | Value |
|-----------|-------|
| API Endpoint | `http://localhost:9000` |
| Console URL | `http://localhost:9001` |
| Access Key (Root User) | `minioadmin` |
| Secret Key (Root Password) | `minioadmin` |
| Default Bucket | `sanaeva-uploads` |

### Accessing MinIO Console

1. Open browser and navigate to: http://localhost:9001
2. Login with credentials:
   - **Username:** `minioadmin`
   - **Password:** `minioadmin`
3. You'll see the MinIO dashboard with buckets, users, and settings

### Creating Buckets

**Via Console:**
1. Click **Buckets** in left sidebar
2. Click **Create Bucket** button
3. Enter bucket name (e.g., `sanaeva-uploads`, `user-avatars`, `documents`)
4. Select **Versioning** if you want to keep file history
5. Click **Create Bucket**

**Via CLI (mc client):**
```bash
# Install MinIO client
brew install minio-mc  # macOS
# or
docker run --rm -it --entrypoint=/bin/sh minio/mc

# Configure alias
mc alias set local http://localhost:9000 minioadmin minioadmin

# Create bucket
mc mb local/sanaeva-uploads

# List buckets
mc ls local
```

### Setting Bucket Policies

**Make bucket publicly readable (for public assets):**
```bash
mc anonymous set download local/sanaeva-uploads
```

**Custom policy via Console:**
1. Go to **Buckets** → Select bucket → **Manage** → **Access Rules**
2. Click **Add Access Rule**
3. Define policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {"AWS": ["*"]},
         "Action": ["s3:GetObject"],
         "Resource": ["arn:aws:s3:::sanaeva-uploads/public/*"]
       }
     ]
   }
   ```

### Implementing MinIO in Your Application

#### Step 1: Install MinIO SDK

```bash
bun add minio
bun add -d @types/minio
```

#### Step 2: Create MinIO Client

Create `server/config/minio.ts`:

```typescript
import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
  secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
});

// Ensure bucket exists
const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'sanaeva-uploads';

export const initMinIO = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`Bucket ${BUCKET_NAME} created successfully`);
    }
  } catch (error) {
    console.error('MinIO initialization error:', error);
  }
};

export { minioClient, BUCKET_NAME };
```

#### Step 3: Upload File Service

Create `server/modules/storage/upload.service.ts`:

```typescript
import { minioClient, BUCKET_NAME } from '@/server/config/minio';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export class UploadService {
  /**
   * Upload file to MinIO
   */
  async uploadFile(
    file: File,
    folder: string = 'uploads'
  ): Promise<{ url: string; key: string }> {
    const fileName = `${folder}/${uuidv4()}${path.extname(file.name)}`;
    const buffer = await file.arrayBuffer();
    
    await minioClient.putObject(
      BUCKET_NAME,
      fileName,
      Buffer.from(buffer),
      buffer.byteLength,
      {
        'Content-Type': file.type,
        'x-amz-meta-original-name': file.name,
      }
    );

    const url = await this.getFileUrl(fileName);
    return { url, key: fileName };
  }

  /**
   * Get presigned URL for file
   */
  async getFileUrl(key: string, expirySeconds: number = 7 * 24 * 60 * 60): Promise<string> {
    return await minioClient.presignedGetObject(BUCKET_NAME, key, expirySeconds);
  }

  /**
   * Delete file from MinIO
   */
  async deleteFile(key: string): Promise<void> {
    await minioClient.removeObject(BUCKET_NAME, key);
  }

  /**
   * List files in folder
   */
  async listFiles(prefix: string = ''): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const files: string[] = [];
      const stream = minioClient.listObjects(BUCKET_NAME, prefix, true);
      
      stream.on('data', (obj) => files.push(obj.name));
      stream.on('error', reject);
      stream.on('end', () => resolve(files));
    });
  }
}
```

#### Step 4: Create Upload API Route

Create `app/api/upload/route.ts`:

```typescript
import { UploadService } from '@/server/modules/storage/upload.service';
import { NextResponse } from 'next/server';

const uploadService = new UploadService();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const result = await uploadService.uploadFile(file, 'user-uploads');
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

#### Step 5: Frontend Upload Component

```typescript
'use client';

import { useState } from 'react';

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string>('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setUrl(result.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {url && <img src={url} alt="Uploaded" />}
    </div>
  );
}
```

### MinIO CLI Operations

```bash
# Copy file to bucket
mc cp ./image.jpg local/sanaeva-uploads/

# Copy entire directory
mc cp --recursive ./uploads/ local/sanaeva-uploads/

# Mirror directory (sync)
mc mirror ./local-folder local/sanaeva-uploads/backup

# Download file
mc cp local/sanaeva-uploads/file.jpg ./downloads/

# Remove file
mc rm local/sanaeva-uploads/old-file.jpg

# Remove all files in prefix
mc rm --recursive --force local/sanaeva-uploads/temp/
```

## Redis Cache

Redis is an in-memory data store used for caching, session management, and real-time features.

### Redis Connection Details

| Parameter | Value |
|-----------|-------|
| Host | `localhost` (from host)<br/>`redis` (from containers) |
| Port | `6379` |
| Connection String | `redis://localhost:6379` |
| Password | None (development) |
| Database | `0` (default) |

### Using Redis CLI

**Access Redis container:**
```bash
docker exec -it sanaeva-redis redis-cli
```

**Common Redis commands:**
```bash
# Test connection
PING
# Response: PONG

# Set key-value
SET mykey "Hello World"

# Get value
GET mykey

# Set with expiry (seconds)
SETEX session:123 3600 "user_data"

# Check if key exists
EXISTS mykey

# Delete key
DEL mykey

# List all keys (⚠️ don't use in production with many keys)
KEYS *

# Get all keys matching pattern
KEYS user:*

# Set hash
HSET user:1 name "John" email "john@example.com"

# Get hash field
HGET user:1 name

# Get all hash fields
HGETALL user:1

# List operations
LPUSH mylist "item1"
RPUSH mylist "item2"
LRANGE mylist 0 -1

# Set operations
SADD myset "member1"
SMEMBERS myset

# Check memory usage
INFO memory

# Monitor all commands in real-time
MONITOR

# Exit
exit
```

### Implementing Redis in Your Application

#### Step 1: Install Redis Client

```bash
bun add ioredis
bun add -d @types/ioredis
```

#### Step 2: Create Redis Client

Create `server/config/redis.ts`:

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('✓ Redis connected');
});

redis.on('error', (error) => {
  console.error('✗ Redis connection error:', error);
});

export { redis };
```

#### Step 3: Create Cache Service

Create `server/modules/cache/cache.service.ts`:

```typescript
import { redis } from '@/server/config/redis';

export class CacheService {
  /**
   * Get cached value
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Set cache with optional TTL (Time To Live in seconds)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
  }

  /**
   * Delete cached value
   */
  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  /**
   * Delete multiple keys by pattern
   */
  async delPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  }

  /**
   * Get or set pattern (cache-aside)
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetchFn();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  /**
   * Increment counter
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    return await redis.incrby(key, amount);
  }

  /**
   * Set expiry on existing key
   */
  async expire(key: string, seconds: number): Promise<void> {
    await redis.expire(key, seconds);
  }
}

export const cacheService = new CacheService();
```

#### Step 4: Usage Examples

**API Response Caching:**

```typescript
// app/api/products/route.ts
import { cacheService } from '@/server/modules/cache/cache.service';
import { prisma } from '@/server/db/client';

export async function GET() {
  const products = await cacheService.getOrSet(
    'products:all',
    async () => {
      return await prisma.product.findMany();
    },
    300 // Cache for 5 minutes
  );

  return Response.json({ products });
}
```

**Session Management:**

```typescript
// server/modules/auth/session.service.ts
import { cacheService } from '../cache/cache.service';
import { v4 as uuidv4 } from 'uuid';

export class SessionService {
  private readonly SESSION_TTL = 7 * 24 * 60 * 60; // 7 days

  async createSession(userId: string): Promise<string> {
    const sessionId = uuidv4();
    const sessionKey = `session:${sessionId}`;
    
    await cacheService.set(
      sessionKey,
      { userId, createdAt: Date.now() },
      this.SESSION_TTL
    );
    
    return sessionId;
  }

  async getSession(sessionId: string) {
    return await cacheService.get(`session:${sessionId}`);
  }

  async destroySession(sessionId: string): Promise<void> {
    await cacheService.del(`session:${sessionId}`);
  }
}
```

**Rate Limiting:**

```typescript
// server/middleware/rate-limiter.ts
import { cacheService } from '../modules/cache/cache.service';

export async function rateLimit(
  identifier: string,
  limit: number = 100,
  window: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:${identifier}`;
  
  const current = await cacheService.increment(key);
  
  if (current === 1) {
    await cacheService.expire(key, window);
  }
  
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
  };
}
```

**Cache Invalidation:**

```typescript
// When product is updated
await cacheService.delPattern('products:*');

// When specific user data changes
await cacheService.del(`user:${userId}`);
```

### Redis Best Practices

1. **Use appropriate TTLs** - Don't cache forever, set reasonable expiry times
2. **Use key prefixes** - Organize keys with namespaces (e.g., `user:123`, `session:abc`)
3. **Avoid storing large objects** - Redis is optimized for small values
4. **Use pipelining** - Batch multiple commands for better performance
5. **Monitor memory usage** - Set `maxmemory` policy in production
6. **Use Redis for ephemeral data** - Don't treat it as primary data store

### Monitoring Redis

**Check memory usage:**
```bash
docker exec sanaeva-redis redis-cli INFO memory
```

**Monitor commands in real-time:**
```bash
docker exec sanaeva-redis redis-cli MONITOR
```

**View slow queries:**
```bash
docker exec sanaeva-redis redis-cli SLOWLOG GET 10
```

**Check connected clients:**
```bash
docker exec sanaeva-redis redis-cli CLIENT LIST
```

## Development Workflow

### Local Development Setup

1. **Start infrastructure services:**
   ```bash
   docker-compose -f infra/docker-compose.dev.yml up -d postgres redis minio
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Setup database:**
   ```bash
   bun prisma generate
   bun prisma migrate dev
   ```

4. **Start development server:**
   ```bash
   bun dev
   ```

5. **Access services:**
   - Application: http://localhost:3000
   - MinIO Console: http://localhost:9001
   - Prisma Studio: `bun prisma studio`

### Development with Docker (Full Stack)

```bash
# Start all services including the app
docker-compose -f infra/docker-compose.dev.yml up -d

# View application logs
docker-compose -f infra/docker-compose.dev.yml logs -f app
```

### Hot Reload

The development setup includes volume mounting for instant code changes:

```yaml
volumes:
  - ..:/app
  - /app/node_modules  # Prevents overwriting
  - /app/.next         # Prevents overwriting build files
```

Changes to TypeScript/React files will trigger automatic recompilation.

### Database Schema Changes

1. **Modify Prisma schema:**
   ```prisma
   // prisma/schema.prisma
   model Product {
     id        String   @id @default(uuid())
     name      String
     price     Decimal
     createdAt DateTime @default(now())
   }
   ```

2. **Create migration:**
   ```bash
   bun prisma migrate dev --name add_product_model
   ```

3. **Generate client:**
   ```bash
   bun prisma generate
   ```

### Debugging

**Debug application container:**
```bash
docker exec -it sanaeva-store-app-1 /bin/sh
```

**Check environment variables:**
```bash
docker exec sanaeva-store-app-1 env
```

**Inspect container:**
```bash
docker inspect sanaeva-store-app-1
```

**Check network connectivity:**
```bash
docker exec sanaeva-store-app-1 ping postgres
docker exec sanaeva-store-app-1 ping redis
docker exec sanaeva-store-app-1 ping minio
```

## Production Deployment

### Building Production Image

```bash
# Build production image
docker build -f infra/Dockerfile.prod -t sanaeva-store:latest .

# Test production build locally
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NODE_ENV="production" \
  sanaeva-store:latest
```

### Environment Variables for Production

Create `.env.production`:

```env
# Database
DATABASE_URL=postgresql://user:password@production-host:5432/sanaeva_store?ssl=true

# MinIO
MINIO_ENDPOINT=storage.yourdomain.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ROOT_USER=your-access-key
MINIO_ROOT_PASSWORD=your-secret-key
MINIO_BUCKET_NAME=production-uploads

# Redis
REDIS_URL=redis://production-redis:6379
REDIS_PASSWORD=your-redis-password

# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deployment Options

#### Option 1: Docker Compose (Simple VPS)

Create `infra/docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    image: sanaeva-store:latest
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: sanaeva_store
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: always

volumes:
  postgres_data:
  redis_data:
```

Deploy:
```bash
docker-compose -f infra/docker-compose.prod.yml up -d
```

#### Option 2: Kubernetes

Create deployment manifests in `infra/k8s/`:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sanaeva-store
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sanaeva-store
  template:
    metadata:
      labels:
        app: sanaeva-store
    spec:
      containers:
      - name: app
        image: your-registry/sanaeva-store:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

Deploy:
```bash
kubectl apply -f infra/k8s/
```

#### Option 3: Cloud Platforms

**Vercel (Recommended for Next.js):**
```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel --prod
```

**Railway:**
```bash
railway link
railway up
```

**Render:**
- Connect GitHub repository
- Configure environment variables
- Deploy automatically on push

### Database Migrations in Production

**Run migrations safely:**
```bash
# Backup first!
docker exec production-postgres pg_dump -U postgres sanaeva_store > backup-$(date +%Y%m%d).sql

# Run migrations
docker exec production-app bun prisma migrate deploy
```

### Monitoring Production

**Health checks:**
```bash
curl https://yourdomain.com/api/health
```

**View logs:**
```bash
docker logs -f production-app --tail 100
```

**Database backups:**
```bash
# Daily backup script
0 2 * * * docker exec postgres pg_dump -U postgres sanaeva_store | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

### SSL/TLS Configuration

Use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (runs twice daily)
sudo systemctl enable certbot.timer
```

### Performance Optimization

1. **Enable compression** in nginx
2. **Use CDN** for static assets
3. **Database connection pooling** with Prisma
4. **Redis caching** for frequently accessed data
5. **Horizontal scaling** with load balancer

## Troubleshooting

### Common Issues

**1. Port already in use**
```bash
# Find process using port
lsof -i :5432
lsof -i :3000

# Kill process
kill -9 <PID>
```

**2. Database connection refused**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs sanaeva-postgres

# Restart service
docker-compose -f infra/docker-compose.dev.yml restart postgres
```

**3. MinIO bucket not found**
```bash
# Create bucket manually
docker exec -it sanaeva-minio mc mb local/sanaeva-uploads
```

**4. Redis connection timeout**
```bash
# Check if Redis is running
docker ps | grep redis

# Test connection
docker exec sanaeva-redis redis-cli ping
```

**5. Docker disk space full**
```bash
# Clean up
docker system prune -a --volumes

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

**6. Slow database queries**
```bash
# Enable query logging in PostgreSQL
docker exec -it sanaeva-postgres psql -U postgres -c "ALTER SYSTEM SET log_statement = 'all';"
docker-compose -f infra/docker-compose.dev.yml restart postgres

# View logs
docker logs sanaeva-postgres | grep "duration:"
```

**7. Can't connect from DBeaver**
- Ensure PostgreSQL container is running
- Check firewall rules
- Verify credentials in `.env`
- Download JDBC driver in DBeaver

**8. Application container exits immediately**
```bash
# Check logs
docker-compose -f infra/docker-compose.dev.yml logs app

# Run interactively to debug
docker-compose -f infra/docker-compose.dev.yml run app /bin/sh
```

### Getting Help

- **Docker Logs:** `docker-compose logs -f [service]`
- **Container Shell:** `docker exec -it [container] /bin/sh`
- **Network Issues:** `docker network inspect sanaeva-network`
- **Resource Usage:** `docker stats`

### Health Check URLs

- PostgreSQL: `docker exec sanaeva-postgres pg_isready`
- Redis: `docker exec sanaeva-redis redis-cli ping`
- MinIO: `curl http://localhost:9000/minio/health/live`

---

**Generated by AI as directed by the Sanaeva Store team on January 25, 2026**