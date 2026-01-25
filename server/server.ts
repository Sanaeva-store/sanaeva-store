import { Elysia, t } from 'elysia'
import { betterAuthPlugin } from './plugins/auth'
import { authController } from './modules/auth'

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
export const api = new Elysia({ prefix: '/api' })
  // Health check
  .get('/', () => ({ ok: true, message: 'Sanaeva Store API' }))

  // Example JSON body
  .post('/greet', ({ body }) => `👋 ${body.name}`, {
    body: t.Object({ name: t.String() })
  })

  // Better Auth integration with macro-based auth middleware
  .use(betterAuthPlugin)
  
  // Custom authenticated routes
  .use(authController)

  // you can plug in more plugins here
  // .use(somePlugin)