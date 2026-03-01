# Windsurf Execution Pack (Back Office)

Updated: 2026-03-01  
Repository: `sanaeva-store` (frontend)

## Objective

ใช้กับ Windsurf เพื่อให้ implement งานค้างใน Back Office แบบเป็นรอบ PR เดียวกับแผน Copilot

Primary references:
- `docs/agent-sync/backend-frontend-input-contracts/copilot-execution-plan-2026-03-01.md`
- `docs/agent-sync/backend-frontend-input-contracts/TASK-CHECKLIST.md`
- `docs/agent-sync/backend-frontend-input-contracts/frontend-gap-checklist.md`

## Global Rules for Windsurf

- ใช้ `bun` เท่านั้น: `bun run typecheck`, `bun run lint`, `bun run test`
- ห้ามสร้าง business API route ใต้ `app/api/*`
- ใช้ hooks/API layer เดิมใน `features/inventory/hooks/*` และ `features/inventory/api/*`
- ถ้า endpoint ไม่อยู่ใน contract: บันทึกเป็น API gap แล้วหยุดที่ non-breaking UI
- ต้องมี loading/empty/error state ทุกหน้าที่แก้

## PR-1 Prompt (P0)

```text
Implement PR-1 (P0): remove skeleton/gap pages in back office.
Scope:
- /admin-dasboard/analytics
- /admin-dasboard/customers
- /admin-dasboard/settings/general
- /admin-dasboard/settings/reports
- dashboard root chart gap in /admin-dasboard

Rules:
- Use existing hooks only.
- If endpoint is missing, keep UI stable and document API gap in frontend-gap-checklist.md.
- No business route in app/api.

Deliver:
1) changed files
2) endpoint decision per page (implemented vs gap)
3) results of bun run typecheck, bun run lint, bun run test
```

## PR-2 Prompt (P1)

```text
Implement PR-2 (P1): complete Product/SKU + Pricing flows.
Scope:
- Product/SKU: edit/delete + variants/images management UI
- Pricing: detail/edit + list/add items

Requirements:
- react-hook-form + zod for forms
- clear loading/empty/error states
- keep App Router boundaries (no business logic in app route files)

Deliver:
1) changed files
2) completed user flows
3) results of bun run typecheck, bun run lint, bun run test
```

## PR-3 Prompt (P1)

```text
Implement PR-3 (P1): complete Purchasing + Stock Control flows.
Scope:
- Purchase Orders: create/detail/approve/send/receive/cancel
- Transfers: create/detail/receive
- Cycle Count: detail + submit count (:id/count)

Requirements:
- disable mutation buttons while pending
- show API errors explicitly
- keep pagination/filter state stable

Deliver:
1) changed files
2) completed actions and remaining gaps
3) results of bun run typecheck, bun run lint, bun run test
```

## PR-4 Prompt (P1)

```text
Implement PR-4 (P1): Promotions + Report profit expansion.
Scope:
- Promotions: create/edit/detail/simulate/calculate/stacking rules
- Reports: profit-by-sku, profit-by-category, profit-by-order views

Requirements:
- strict mapping to backend enums/status
- consistent error handling and empty states

Deliver:
1) changed files
2) implemented report/promotion endpoints
3) results of bun run typecheck, bun run lint, bun run test
```

## PR-5 Prompt (P1)

```text
Implement PR-5 (P1): Admin Security completion.
Scope:
- Admin users: detail/assign role/remove role
- Audit logs: detail view
- Approvals: create + detail

Requirements:
- preserve role-safe rendering patterns
- no silent failures for sensitive actions

Deliver:
1) changed files
2) completed admin workflows
3) results of bun run typecheck, bun run lint, bun run test
```

## PR-6 Prompt (P2)

```text
Implement PR-6 (P2): hardening + tests + i18n cleanup.
Scope:
- unify pending/disabled behavior for all mutations
- remove remaining hardcoded EN strings in back office pages
- add regression tests for critical workflows

Minimum regression flows:
- order reserve/release/commit
- promotion toggle/validate/simulate
- transfer lifecycle actions
- cycle-count create/count/close
- approvals approve/reject

Deliver:
1) changed files
2) added tests with coverage targets
3) results of bun run typecheck, bun run lint, bun run test
```

## Per-PR DoD

- ไม่มี dead button/action ใน scope
- มี loading/empty/error state ครบ
- docs/checklist อัปเดตสถานะตรงของจริง
- ผ่านคำสั่ง:

```bash
bun run typecheck
bun run lint
bun run test
```
