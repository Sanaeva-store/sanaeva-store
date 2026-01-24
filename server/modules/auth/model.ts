import { t } from 'elysia'

export const SignInBody = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String().min(8)
})

export const SignUpBody = t.Object({
  name: t.String().min(2),
  email: t.String({ format: 'email' }),
  password: t.String().min(8)
})

export const AuthResponse = t.Object({
  token: t.String(),
  user: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String({ format: 'email' })
  })
})



export type SignInBody = typeof SignInBody.static