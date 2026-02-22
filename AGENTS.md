# AGENTS.md

This file defines repository-level best practices for AI agents working in this project.

## 1) Mission

- Make minimal, safe, high-signal changes.
- Preserve existing architecture and conventions.
- Prefer correctness, maintainability, and predictable behavior.

## 2) Project Context

- Framework: Next.js App Router + React + TypeScript.
- Styling/UI: Tailwind CSS + shadcn/ui (+ Radix primitives).
- Data/Form patterns:
  - `@tanstack/react-query` for async server state.
  - Axios-based fetcher flow for HTTP.
  - `react-hook-form` + `zod` for forms and validation.

## 3) Source of Truth

- Frontend policy: `/docs/FRONTEND-SKILL-POLICY.md`
- Windsurf frontend rules: `/.windsurf/rules/frontend-skills.md`
- Copilot instructions: `/.github/copilot-instructions.md`
- Frontend coding instructions: `/.github/instructions/frontend.instructions.md`

If guidance conflicts:
1. Next.js safety and architecture constraints
2. React performance best practices
3. Existing repository conventions

## 4) Package Manager and Commands (Strict)

- Use `pnpm` only.
- Do not use `npm`, `npx`, `yarn`, or `bun` for package/script commands.
- Common commands:
  - `pnpm install`
  - `pnpm dev`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`

## 5) Coding Best Practices

- Prefer Server Components by default; add `"use client"` only when necessary.
- Keep route conventions correct (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`).
- Keep business logic out of low-level UI primitives.
- Reuse existing components and utilities before creating new ones.
- Avoid introducing new dependencies unless explicitly required.
- Avoid broad refactors unless explicitly requested.

## 6) Change Strategy

- Read nearby code and follow local naming/structure.
- Make diff-oriented changes only in relevant files.
- Add or update tests for behavior changes.
- Maintain loading/empty/error states in user-facing features.
- Avoid silent error handling.

## 7) Safety Rules

- Do not expose secrets to client code.
- Do not bypass validation on server-side inputs.
- Do not break App Router semantics or server/client boundaries.
- Do not rewrite unrelated files for style-only reasons.

## 8) Output Expectations for Agents

When submitting work:
- State what changed and why.
- List touched files clearly.
- Report what was validated (`pnpm lint`, `pnpm typecheck`, tests) or why not run.
- Note assumptions and remaining risks if any.
