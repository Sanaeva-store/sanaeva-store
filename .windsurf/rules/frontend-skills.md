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
