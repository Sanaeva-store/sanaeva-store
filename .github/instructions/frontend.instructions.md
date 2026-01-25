---
applyTo: "**/*.tsx,**/*.ts"
---


---

## 0) Goals
- Produce clean, maintainable, and predictable code.
- Prefer correctness, accessibility, and performance over cleverness.
- Keep solutions consistent with existing patterns in the repo.
- Do not introduce new libraries unless explicitly requested.

---

## 1) Tech Stack Assumptions
- Next.js App Router (v16+ or newer)
- React (v19 or newer)
- TypeScript first (use `.ts/.tsx`), unless the file is already JavaScript.
- Prefer modern React patterns (hooks, server/client components in Next.js).
- Avoid a Server actions.

If existing repo conventions conflict with these assumptions, follow the repo.

---

## 2) Project Structure & File Naming
### Naming conventions
- Components: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- Hooks: `useXxx.ts` (e.g., `useDebounce.ts`)
- Utilities: `camelCase.ts` (e.g., `formatCurrency.ts`)
- Services/API: `*.service.ts` or `*.api.ts` (follow repo convention)
- Schemas: `*.schema.ts` (Zod preferred if already used)
- Types: `*.types.ts` (or `types.ts` inside a folder)
- Tests: `*.test.ts(x)` (or `*.spec.ts(x)`; follow existing)

### Recommended structure (domain/feature-first)
- `app/*` for Next.js routes, layouts, route handlers.
- `features/<domain>/*` for business logic.
- `components/ui/*` for components from shadcn/ui.
- `components/components-design/*` for design system primitives (no business logic).
- `components/layouts/*` for layout components and combinations of UI components (Header, Footer, etc.).
- `components/layouts/admin/*` for layout components and combinations of UI components for admin (Header, Footer, etc.).
- `components/common/*` for shared non-domain components.
- `lib/*` for shared infra helpers (fetcher, env, logger, utils).

Do not place business logic inside `components/ui`.

---

## 3) Next.js App Router Rules (Strict)
- Use `app/` router conventions:
  - Route pages: `page.tsx`
  - Layouts: `layout.tsx`
  - Loading: `loading.tsx`
  - Error boundaries: `error.tsx`
  - Not found: `not-found.tsx`
  - Route handlers: `route.ts`
- Prefer **Server Components** by default.
- Only use `"use client"` when necessary (state, effects, browser APIs, React Query, form libs).
- Keep `"use client"` components small: split container (server) vs interactive UI (client).

### Data fetching
- Prefer server-side fetching for initial page load (in Server Components).
- Use `fetch` with appropriate caching strategy:
  - `cache: "no-store"` for highly dynamic data (user-specific).
  - Use Next.js revalidation when appropriate.
- Client-side fetching is allowed for interactive pages; use existing repo approach (React Query with TanStack Query and use Axios as a fetcher).

### Security & correctness
- Never expose secrets to client components.
- Validate and sanitize all external input on the server (route handlers).
- Avoid using `dangerouslySetInnerHTML` unless explicitly required and sanitized.

---

## 4) React Rules
- Use functional components + hooks only.
- Keep components pure and predictable.
- Avoid prop drilling for deep trees: prefer composition, context (sparingly), or state management already used in repo.
- Always handle loading, empty, and error states.

### Component design
- Prefer small, reusable components.
- UI components should be presentational; domain logic should live in features/services/hooks.
- Keep props minimal and typed.

---

## 5) TypeScript Standards
- Avoid `any`. Use:
  - `unknown` + narrowing, or
  - proper types/interfaces
- Prefer `type` for unions and object shapes; `interface` is acceptable if repo uses it.
- Use discriminated unions for complex UI states.
- Do not export types that are not used outside the module.

---

## 6) State, Forms, and Validation
- Follow repo patterns:
  - If React Hook Form is present, use it for forms.
  - If Zod is present, define schemas in `schemas/*.schema.ts`.
- Validation:
  - Client validation for UX.
  - Server validation for security (always).
- Prefer controlled/uncontrolled approach consistent with existing code.

---

## 7) Styling & UI
- Follow existing styling approach (Tailwind, CSS Modules, or others).
- If Tailwind is used:
  - Keep class lists readable; extract to components when large.
- If shadcn/ui is used:
  - Prefer it for common primitives (Button, Dialog, Dropdown, etc.)
- Accessibility (required):
  - Use semantic HTML.
  - Ensure buttons/inputs have labels.
  - Ensure keyboard navigation for interactive components.
  - Provide `aria-*` attributes when needed.

---

## 8) Networking & API Layer
- Centralize API calls in `services/` (or repo equivalent).
- Return typed results; handle error mapping consistently.
- Do not call APIs directly inside low-level UI components.
- If using fetch wrappers (`lib/fetcher.ts`), use them consistently.

---

## 9) Error Handling & UX States
Every feature view must implement:
- Loading state (skeleton/spinner)
- Empty state (no data)
- Error state (friendly message + retry when feasible)

Error handling should:
- Avoid leaking raw server errors to users.
- Log errors in the appropriate place (server logs for server, console minimally for client).

---

## 10) Performance Rules
- Avoid unnecessary re-renders:
  - Use memoization only when it clearly matters (don’t overuse `useMemo/useCallback`).
- Prefer dynamic import for heavy client-only components when needed.
- Avoid large dependencies; do not add new packages without instruction.
- Optimize images with Next.js `<Image />` if in Next.js project and repo uses it.

---

## 11) Testing
Follow repo tooling (Vitest/Jest/React Testing Library/Playwright):
- Unit tests for utilities, hooks, and critical components.
- Integration tests for key user flows when appropriate.
- Name tests clearly and keep them deterministic (no flaky timers/network).

---

## 12) Linting, Formatting, and Clean Code
- Conform to ESLint/Prettier configs already in the repo.
- No dead code, no commented-out blocks.
- No console logs in production code (unless explicitly permitted).
- Prefer early returns and simple conditionals.
- Keep functions short; extract helpers when complexity grows.

---

## 13) Output Expectations (How to respond when generating code)
When you generate or modify code:
1. Provide minimal diff-oriented changes (don’t refactor unrelated areas).
2. Keep naming consistent with nearby code.
3. Include types, error handling, and UX states.
4. Include brief inline comments only where intent is non-obvious.
5. If you introduce a new pattern, add a short rationale in comments or PR notes (not long essays).

---

## 14) “Do Not” List (Hard constraints)
- Do not mix App Router with Pages Router.
- Do not put business logic in `components/ui`.
- Do not introduce a new library without explicit instruction.
- Do not use `any` as a shortcut.
- Do not skip loading/empty/error states.
- Do not use `dangerouslySetInnerHTML` without sanitization and explicit request.
- Do not leak secrets to the client.

---

## 15) Quick Reference Examples
### Client component boundary
- Server: `page.tsx` fetches data -> passes to client component
- Client: `SomeInteractivePanel.tsx` contains state/hooks and interactivity

### Feature module layout
- `features/orders/components/*`
- `features/orders/hooks/*`
- `features/orders/services/orders.service.ts`
- `features/orders/schemas/*`
- `features/orders/types/*`

---