# Copilot Execution Plan (PR Task Pack)

Updated: 2026-03-01  
Repository: `sanaeva-store` (frontend)

## Goal

ทำงานค้างใน Back Office ให้ปิดเป็นรอบ PR ที่ชัดเจน เพื่อส่งต่อ Copilot แบบต่อเนื่องจนใช้งานจริงได้ครบเมนู

Primary references:
- `docs/agent-sync/backend-frontend-input-contracts/admin-integration-checklist-2026-03-01.md`
- `docs/agent-sync/backend-frontend-input-contracts/TASK-CHECKLIST.md`
- `docs/agent-sync/backend-frontend-input-contracts/backoffice-api-handoff/frontend-integration-contract-v1.md`
- `docs/agent-sync/backend-frontend-input-contracts/frontend-gap-checklist.md`

## Global Rules (must follow)

- ใช้ `bun` เท่านั้น (`bun run lint`, `bun run typecheck`, `bun run test`)
- ห้ามสร้าง business API route ใหม่ใน `app/api/*`
- ใช้ API layer/hook ที่มีอยู่ก่อน
- ถ้า endpoint ยังไม่มีใน contract: บันทึกเป็น API Gap และไม่เดา endpoint
- ทุก PR ต้องมี loading/empty/error state ในหน้าที่แก้

## PR-1 (P0): Kill Skeleton/Gap Pages

### Scope
- `/admin-dasboard/analytics`
- `/admin-dasboard/customers`
- `/admin-dasboard/settings/general`
- `/admin-dasboard/settings/reports`
- dashboard root chart gap in `/admin-dasboard`

### Target
- หน้า skeleton ทุกหน้าต้องกลายเป็นหน้าใช้งานได้จริง หรือมี API gap ที่ explicit ใน UI + docs
- dashboard root ต้องไม่เหลือ mock KPI

### Main files
- `app/[locale]/(admin-dasboard)/admin-dasboard/analytics/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/customers/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/settings/general/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/settings/reports/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/dashboard-client.tsx`
- `docs/agent-sync/backend-frontend-input-contracts/frontend-gap-checklist.md`

### Copilot prompt
```text
Implement PR-1 (P0) from copilot-execution-plan-2026-03-01.md.
Goal: remove skeleton/gap pages in analytics/customers/settings and finish dashboard root data wiring.
Rules:
- Use existing API hooks only.
- If endpoint missing, keep page non-breaking and document API gap in frontend-gap-checklist.md.
- No app/api business routes.
- Ensure loading/empty/error states.
Output:
1) changed files
2) gap decisions per page
3) bun run typecheck + bun run lint + bun run test results
```

## PR-2 (P1): Product/SKU + Pricing Full Flow

### Scope
- Product/SKU: edit/delete + variants/images management UI
- Pricing: detail/edit price list + list/add items

### Main files
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/products/**`
- `app/[locale]/(admin-dasboard)/admin-dasboard/pricing/price-lists/**`
- `features/inventory/hooks/use-catalog.ts`
- `features/inventory/hooks/use-pricing.ts`

### Copilot prompt
```text
Implement PR-2 (P1): complete Product/SKU and Pricing flows.
Add missing CRUD/action UI on top of existing API hooks.
Keep forms schema-first (react-hook-form + zod), and add robust loading/error states.
Run bun run typecheck, bun run lint, bun run test.
```

## PR-3 (P1): Purchasing + Stock Control Full Flow

### Scope
- Purchase Orders: create/detail/approve/send/receive/cancel
- Transfers: create/detail/receive
- Cycle Count: detail + submit count (`:id/count`)

### Main files
- `app/[locale]/(admin-dasboard)/admin-dasboard/purchasing/purchase-orders/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/stock-control/transfers/**`
- `app/[locale]/(admin-dasboard)/admin-dasboard/stock-control/cycle-count/**`
- `features/inventory/hooks/use-purchase-orders.ts`
- `features/inventory/hooks/use-stock-transfers.ts`
- `features/inventory/hooks/use-cycle-count.ts`

### Copilot prompt
```text
Implement PR-3 (P1): complete Purchasing and Stock Control workflows.
Focus on missing actions and detail pages using existing hooks.
Ensure action buttons are disabled while pending and show API errors clearly.
Run bun run typecheck, bun run lint, bun run test.
```

## PR-4 (P1): Promotions + Reports Expansion

### Scope
- Promotions: create/edit/detail/simulate/calculate/stacking-rules UI
- Reports: add profit-by-sku / profit-by-category / profit-by-order views

### Main files
- `app/[locale]/(admin-dasboard)/admin-dasboard/promotions/**`
- `app/[locale]/(admin-dasboard)/admin-dasboard/reports/profit/page.tsx`
- `features/inventory/hooks/use-promotions.ts`
- `features/inventory/hooks/use-reports.ts`

### Copilot prompt
```text
Implement PR-4 (P1): finish Promotions and expand Profit reports.
Use existing report/promotion hooks and keep response mapping strict to backend contracts.
Include loading/empty/error states and basic UX validation.
Run bun run typecheck, bun run lint, bun run test.
```

## PR-5 (P1): Admin Security Completion

### Scope
- Admin users: detail + assign role + remove role
- Audit logs: detail page
- Approvals: create + detail

### Main files
- `app/[locale]/(admin-dasboard)/admin-dasboard/admin/users/**`
- `app/[locale]/(admin-dasboard)/admin-dasboard/admin/audit-logs/**`
- `app/[locale]/(admin-dasboard)/admin-dasboard/admin/approvals/**`
- `features/inventory/hooks/use-admin-users.ts`

### Copilot prompt
```text
Implement PR-5 (P1): complete Admin Security pages.
Finish missing detail and mutation flows while preserving role-safe behavior.
Add clear error and permission handling for sensitive actions.
Run bun run typecheck, bun run lint, bun run test.
```

## PR-6 (P2): Hardening + Tests + i18n Cleanup

### Scope
- unify pending/disabled behavior on all mutations
- ensure enum/status mapping exact with backend
- remove remaining hardcoded EN strings in back office pages
- add regression tests for critical flows

### Minimum tests
- order reserve/release/commit actions
- promotion toggle/validate/simulate
- transfer lifecycle actions
- cycle-count create/count/close
- approvals approve/reject

### Copilot prompt
```text
Implement PR-6 (P2): hardening, test coverage, and i18n cleanup.
Do not add broad refactors. Focus on reliability and regressions.
Deliver tests for critical mutations and remove remaining hardcoded text in back-office pages.
Run bun run typecheck, bun run lint, bun run test.
```

## Per-PR Definition of Done

- หน้า/ปุ่มใน scope เรียก API ได้จริง ไม่มี dead action
- loading/empty/error state ครบ
- ไม่มี silent error handling
- checklist/docs สะท้อนสถานะใหม่
- commands ผ่าน:

```bash
bun run typecheck
bun run lint
bun run test
```

## Commit Convention

- `feat(admin): <scope>`
- `refactor(admin): <scope>`
- `test(admin): <scope>`
- `docs(admin): update checklist and gap notes`
