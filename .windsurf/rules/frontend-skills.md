# Frontend Skills Rules (Repo-local)

Use this repository rule set for frontend work.

Primary policy document:

- `/docs/FRONTEND-SKILL-POLICY.md`

Execution order:

1. Next.js safety and architecture constraints (`next-best-practices`)
2. React performance rules (`vercel-react-best-practices`)
3. Existing repository conventions

Non-negotiable guardrails:

- Do not over-refactor unrelated modules.
- Do not add dependencies unless explicitly requested.
- Do not break App Router semantics or server/client boundaries.
- Keep existing project patterns for React Query + Axios fetcher, RHF, and Zod.

## Package Manager Policy (Strict)

- Use `bun` only for all package and script commands in this repository.
- Do not use `npm`, `npx`, `yarn`, or `pnpm` commands for dependency management or script execution.
- Preferred commands:
  - `bun install`
  - `bun add <pkg>`
  - `bun remove <pkg>`
  - `bun dev`
  - `bun run build`
  - `bun run lint`
  - `bun run typecheck`
  - `bun run test`
- If a third-party instruction suggests `npm`/`npx`/`pnpm`, convert it to an equivalent `bun` command.

## UI and Styling Stack Policy

- Tailwind CSS is the default styling system.
- shadcn/ui is the default UI primitive/component system.
- Reuse existing Radix/shadcn-based components before creating new primitives.
- Follow existing utility patterns (`clsx`, `class-variance-authority`, `tailwind-merge`).

## Existing Library Reuse Policy

- Prefer existing dependencies from `package.json` before introducing alternatives.
- Maintain current frontend data/form/state patterns:
  - `@tanstack/react-query` for async server state.
  - Axios-based fetcher flow already used in the project.
  - `react-hook-form` + `zod` for forms and validation.
- Do not replace existing libraries unless explicitly requested.
