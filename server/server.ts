import { Elysia, t } from 'elysia'
import { authController } from './modules/auth'
import { openapi } from '@elysiajs/openapi'
import { opentelemetry } from '@elysiajs/opentelemetry'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'


/**
 * Main Elysia API Server
 * 
 * This server integrates Better Auth following the Elysia guide:
 * https://elysiajs.com/integrations/better-auth.html
 * 
 * Auth endpoints are available at:
 * - http://localhost:3000/api/auth/api/sign-up/email
 * - http://localhost:3000/api/auth/api/sign-in/email
 * - http://localhost:3000/api/auth/api/sign-out
 * - http://localhost:3000/api/auth/api/session
 * - And more...
 * 
 * Custom authenticated routes:
 * - GET /api/auth/me (requires authentication)
 * - PUT /api/auth/profile (requires authentication)
 * - GET /api/auth/sessions (requires authentication)
 */

// one reusable instance
export const api = new Elysia({
  prefix: '/api/v1',
  normalize: true
})
  .use(opentelemetry({}))
  .use(openapi())
  // Health check
  .get('/', () => ({ ok: true, message: 'Sanaeva Store API' }))

  // Example JSON body
  .post('/greet', ({ body }) => `👋 ${body.name}`, {
    body: t.Object({ name: t.String() })
  })

  // Custom authenticated routes (includes betterAuthPlugin via plugin deduplication)
  .use(authController)

// you can plug in more plugins here
// .use(somePlugin)