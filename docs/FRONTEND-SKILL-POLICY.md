# Frontend Skill Policy (Next + React)

This document is the canonical skill policy for AI-assisted frontend work in this repository.

## Purpose

- Keep Copilot, Windsurf, and agent workflows aligned on one shared standard.
- Use Vercel skills with a balanced approach that fits the current project.
- Preserve existing repository conventions and avoid disruptive rewrites.

## Active Skills

1. `next-best-practices` (primary for Next.js correctness and architecture)
2. `vercel-react-best-practices` (secondary for React performance and quality)

## Priority Order (Balanced)

Apply this order when rules overlap:

1. Next.js safety and architecture constraints
2. React performance optimization patterns
3. Existing repository conventions and local patterns

## Project Guardrails

- Do not add new dependencies unless explicitly required and justified.
- Respect existing folder boundaries and naming in `app/`, `components/*`, `lib/*`, and existing feature modules.
- Keep App Router semantics intact (Server Components by default, client boundaries only when needed).
- Keep existing data patterns unless there is a clear regression risk:
  - React Query + Axios-based fetcher flow
  - React Hook Form for forms
  - Zod for validation
- Prefer minimal, diff-oriented changes; avoid broad refactors unless requested.

## Next vs React Skill Mapping

Use `next-best-practices` first for:

- Route/file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`)
- RSC/client boundaries and serialization constraints
- Next runtime/caching/rendering constraints
- Metadata, image/font optimization, and route handler patterns

Use `vercel-react-best-practices` for:

- Eliminating async waterfalls
- Bundle size optimization and dynamic loading strategies
- Re-render and rendering performance patterns
- Client interaction and event-handling efficiency
- JavaScript performance improvements that do not conflict with Next architecture

## Do / Don't

Do:

- Choose the smallest valid change that respects existing patterns.
- Validate loading/empty/error states in user-facing features.
- Apply performance optimizations where they are measurable and low-risk.

Don't:

- Over-refactor working modules just to satisfy style preferences.
- Introduce new libraries without explicit instruction.
- Break App Router semantics, RSC boundaries, or server/client safety.
- Replace repository conventions with generic templates.

## Conflict Resolution Rule

If a React optimization conflicts with Next.js architecture or routing constraints, follow Next.js constraints first and use a safer React alternative.
