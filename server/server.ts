import { Elysia, t } from 'elysia'

// one reusable instance
export const api = new Elysia({ prefix: '/api' })
  // health‑check
  .get('/', () => ({ ok: true }))

  // example JSON body
  .post('/greet', ({ body }) => `👋 ${body.name}`, {
    body: t.Object({ name: t.String() })
  })

  // you can plug in more plugins here
  // .use(somePlugin)