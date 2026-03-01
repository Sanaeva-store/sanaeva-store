# Copilot Execution Plan (sanaeva-store frontend)

Updated: 2026-03-01  
Repository: `sanaeva-store` (frontend)

## Goal

ให้ Copilot พัฒนางานที่เหลือใน Admin integration ต่อจาก checklist ปัจจุบันจน "พร้อมใช้งานจริง" โดยไม่หลุด contract backend

Primary references:
- `docs/agent-sync/backend-frontend-input-contracts/admin-integration-checklist-2026-03-01.md`
- `docs/agent-sync/backend-frontend-input-contracts/backoffice-api-handoff/frontend-integration-contract-v1.md`

## Current Status Snapshot

Completed:
- API layer + hooks ครบตาม contract v1.1
- หน้า admin ส่วนใหญ่เชื่อม API แล้ว (orders, order-management, promotions, pricing, stock-control, admin/security, inventory, reports)
- Root cause `api/api` ถูกแก้แล้วใน HTTP client

Remaining:
- `/admin-dasboard` (dashboard root) ยังใช้ข้อมูล mock
- `/admin-dasboard/analytics` ยังไม่ผูก API
- `/admin-dasboard/customers` ยังไม่ผูก API
- `/admin-dasboard/settings/general` ยังไม่ผูก API
- `/admin-dasboard/settings/reports` ยังไม่ผูก API

## Execution Rules (for Copilot)

- ใช้ `bun` เท่านั้น (`bun run lint`, `bun run typecheck`, `bun run test`)
- ห้ามสร้าง business API route ใหม่ใน `app/api/*`
- เรียกผ่าน API layer/hook ที่มีอยู่ก่อนเสมอ
- ถ้า endpoint ยังไม่มีใน contract ให้บันทึกเป็น API Gap และไม่เดา endpoint
- ทุก PR ต้องผ่าน lint + typecheck เป็นขั้นต่ำ

## Work Packages

## WP-1: Dashboard Root Integration

### Scope
- เชื่อม `/admin-dasboard/page.tsx` จาก mock ไปใช้ข้อมูลจริง

### Required API / Hooks
- `GET /api/orders/summary` via `useOrderSummaryQuery`
- `GET /api/reports/dashboard-summary` via `useDashboardSummaryQuery`
- (ถ้าจำเป็น) `GET /api/reports/low-stock` via `useLowStockReportQuery`

### Files (expected)
- `app/[locale]/(admin-dasboard)/admin-dasboard/page.tsx`
- อาจเพิ่ม client wrapper เช่น `dashboard-client.tsx`

### DoD
- KPI card ใช้ data จริงทั้งหมด
- มี loading/empty/error state
- ไม่มี hardcoded KPI mock ค้าง
- `bun run typecheck` ผ่าน
- `bun run lint` ผ่าน

## WP-2: Analytics / Customers / Settings Contract Decision

### Scope
- ตรวจ contract ว่ามี endpoint สำหรับ:
  - analytics
  - customers
  - settings/general
  - settings/reports

### Action Rule
- ถ้ามี endpoint ชัดเจน: เชื่อม API จริง
- ถ้ายังไม่มี: ทำ API Gap doc และคง UI เป็น non-breaking placeholder

### Files (expected)
- `app/[locale]/(admin-dasboard)/admin-dasboard/analytics/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/customers/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/settings/general/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/settings/reports/page.tsx`
- `docs/agent-sync/backend-frontend-input-contracts/frontend-gap-checklist.md`

### DoD
- ทุกหน้าใน 4 หน้านี้ต้องเป็นอย่างใดอย่างหนึ่ง:
  - เชื่อม API จริงครบ หรือ
  - มี API gap ชัดเจนพร้อมเหตุผลและ field/endpoint ที่ต้องการ
- ไม่สร้าง endpoint สมมติ

## WP-3: Production Hardening for Newly Integrated Pages

### Scope
- หน้าใหม่ที่เพิ่งเชื่อม API: orders, order-management, promotions, validate-coupon, pricing, transfers, cycle-count, admin users/audit/approvals

### Checklist
- state mutation ระหว่าง submit ถูก disable ปุ่มที่เกี่ยวข้อง
- ข้อความ error จาก API แสดงชัด
- pagination/filter state ไม่ reset ผิดจังหวะ
- enum/status mapping ตรง backend แบบ exact string
- i18n key ไม่พัง (fallback text ใช้น้อยที่สุด)

### DoD
- ไม่มี regression จาก manual flow หลัก:
  - order reserve/release/commit
  - promotion toggle + validate coupon
  - transfer approve/ship/complete/cancel
  - cycle-count create/close
  - approvals approve/reject
- `bun run lint` และ `bun run typecheck` ผ่าน

## WP-4: Test Coverage for Critical API-UI Paths

### Scope
- เพิ่ม unit/integration tests สำหรับ logic สำคัญของหน้า admin ที่เพิ่งเชื่อม

### Minimum Tests
- form payload mapping ถูกต้อง (validate coupon, price list create, cycle count create)
- action mutation ถูก endpoint/method
- error state แสดงเมื่อ query fail

### Files (suggested)
- `tests/unit/**` ตาม feature เดิม

### DoD
- test ใหม่ผ่านทั้งหมด
- ไม่มี snapshot/flaky test

## Suggested Copilot Task Order

1. WP-1 (Dashboard root)
2. WP-2 (contract decision for remaining 4 pages)
3. WP-3 (hardening)
4. WP-4 (tests)

## Per-Task Commit Convention

- `feat(admin): integrate dashboard root with orders/report summary`
- `chore(admin): document api gaps for analytics/customers/settings`
- `refactor(admin): harden mutation/error states in integrated pages`
- `test(admin): add coverage for promotion/order/transfer flows`

## Validation Commands (must run each task)

```bash
bun run typecheck
bun run lint
bun run test
```

## Completion Criteria

ถือว่าเสร็จเมื่อ:
- checklist ใน `admin-integration-checklist-2026-03-01.md` ไม่เหลืองานเชิง implementation ค้าง
- หน้าที่ยังไม่เชื่อมมี API gap note ครบถ้วน
- lint/typecheck/test ผ่านบน branch เดียวกัน
