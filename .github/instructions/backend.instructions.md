---
applyTo: "**/*.tsx,**/*.ts"
---

- Use Elysiajs for building API routes instead of Next.js Route Handlers.
- Use `async/await` for handling asynchronous operations instead of `.then()` and `.catch()` for better readability.


# Project structure
| src
  | modules
	| auth
	  | index.ts (Elysia controller)
	  | service.ts (service)
	  | model.ts (model)
	| user
	  | index.ts (Elysia controller)
	  | service.ts (service)
	  | model.ts (model)
  | utils
	| a
	  | index.ts
	| b
	  | index.ts
