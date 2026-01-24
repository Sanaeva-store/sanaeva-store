// // src/modules/auth/service.ts
// import { findUserByEmail } from './repository'
// import { SignInBody } from './model'
// import { status } from 'elysia'          // throws HTTP errors
// import { Bun } from 'bun'                // Bun built‑ins for crypto

// export const AuthService = {
//   async signIn(payload: SignInBody) {
//     const user = await findUserByEmail(payload.email)
//     if (!user) throw status(400, 'Invalid credentials')

//     const ok = await Bun.password.verify(payload.password, user.password)
//     if (!ok) throw status(400, 'Invalid credentials')

//     const token = await Bun.jwt.sign({ uid: user.id }, { expiresIn: '1h' })
//     return { token }
//   }
// }