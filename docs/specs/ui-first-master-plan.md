# UI-First Master Plan (Back Office, Storefront, Core User)

**Status**: 🔄 WIP  
**Priority**: P0  
**Last Updated**: 2026-02-21

## Objective

วางแผนงานแบบ `UI-first` ก่อน feature implementation เพื่อให้ทั้ง 3 พื้นที่เดินด้วยมาตรฐานเดียว:
1. Back Office Inventory
2. Storefront
3. Core User (Auth/Account/Profile/Orders)

เป้าหมายคือคุณภาพระดับ production team แบบ FAANG-grade: architecture ชัด, scale ได้, ลด coupling, ป้องกัน prop drilling hell, และทำงานร่วมกันเป็นทีมได้โดยไม่ชนกัน.

## Non-Negotiable Standards (Global)

1. `App Router + TypeScript + ESLint + strict type-safe contracts`
2. `Server Components by default`, ใช้ `"use client"` เท่าที่จำเป็น
3. แยกชั้น `app -> features -> shared/core` ชัดเจน, ไม่ cross-feature deep import
4. UI state และ domain state แยกจาก server state
5. ทุกหน้าใน critical flow ต้องมี `loading / empty / error / success`
6. Accessibility baseline: keyboard, focus ring, contrast, semantic landmarks
7. Performance budget: LCP < 2.5s, CLS < 0.1, INP ดีบน mobile จริง
8. ห้ามสร้าง business API route handlers ใน Next.js; ใช้ NestJS API เท่านั้น

## Delivery Strategy (UI First, Then Feature Wiring)

### Phase 0: Foundations (Week 1)

1. Lock route map และ information architecture ของทั้ง 3 พื้นที่
2. วาง design tokens (color, spacing, radius, type scale, motion) ในจุดเดียว
3. กำหนด layout shells:
   - Back Office: `sidebar + topbar + content + command/search`
   - Storefront: `header + mega nav + content + sticky mobile actions + footer`
   - Core User: `account shell + sub-nav + contextual actions`
4. กำหนด UI states มาตรฐาน (`skeleton`, `empty`, `error`, `retry`, `toast`)
5. Define component taxonomy:
   - `shared/ui` (pure presentational)
   - `features/*/components` (feature-specific smart UI)

### Phase 1: Back Office Inventory UI (Week 2-3)

หน้า UI-only ก่อนเชื่อมข้อมูลจริง:
1. Inventory Dashboard
2. Products & SKUs
3. Initial Stock
4. Stock Adjustment
5. Goods Receiving
6. Low Stock Alerts
7. Stock Transactions
8. Suppliers

เกณฑ์จบ phase:
1. มี interaction state ครบทุก action
2. มี responsive layout (desktop/tablet/mobile)
3. มี component contract พร้อมต่อ API ภายหลัง

### Phase 2: Storefront UI (Week 3-4)

หน้า UI-only ก่อนเชื่อม backend:
1. Landing/Home
2. Search + Navigation + Category
3. Product Listing (PLP)
4. Product Detail (PDP)
5. Cart
6. Checkout
7. Order Confirmation

เกณฑ์จบ phase:
1. Mobile-first flow ซื้อสินค้าได้ครบแบบ mock data
2. มี conversion UX หลัก (CTA, trust, shipping/payment cues)
3. มี SEO slots พร้อม metadata wiring

### Phase 3: Core User UI (Week 4)

1. Sign in / Sign up / Forgot password
2. Profile & Address book
3. Order history + order detail
4. Security settings (password/session/logout all devices)

เกณฑ์จบ phase:
1. UX ของ guest vs member ชัด
2. Route guard spec พร้อม role/session behavior
3. Error handling pattern เป็นมาตรฐานเดียวทั้งระบบ

### Phase 4: Feature Wiring (After UI Approved)

1. เชื่อม API ตามโมดูลโดยยึด contract ที่นิยามไว้ใน UI phase
2. เพิ่ม optimistic update เฉพาะจุดที่ปลอดภัย
3. ปิดช่องว่างด้าน idempotency, retry, race condition

## Global State & Data Architecture Plan

## Decision

ใช้ `TanStack Query` เป็น server-state source of truth, และใช้ `Zustand` เฉพาะ client/global UI state ที่ต้องแชร์ข้ามหน้าหรือข้าม component tree.

## Backend Ownership Rule

1. Backend ownership อยู่ที่ NestJS
2. Frontend ห้ามสร้าง API ซ้ำใน `app/api/*` หรือ `route.ts` สำหรับ business logic
3. Frontend ต้องเรียกผ่าน shared API adapter ไปยัง NestJS
4. ถ้า endpoint ยังไม่มี ให้บันทึกเป็น API gap และหยุดที่ mock/UI contract

## What Goes to Zustand

1. Cart snapshot (client-first interaction + persistence)
2. UI shell state (sidebar open/close, command palette, view mode)
3. Session-adjacent lightweight state (selected store/warehouse, locale/currency)
4. Draft state ของ form ยาวหลาย step (checkout draft, filter presets)

## What Must NOT Go to Zustand

1. Remote entities ที่มาจาก API โดยตรง (products, orders, inventory lists)
2. Cache ของ API response
3. Sensitive auth token/raw credential

## Store Design (Senior-Level)

1. แยก store ตาม bounded context:
   - `features/cart/store/cart.store.ts`
   - `features/inventory/store/inventory-ui.store.ts`
   - `features/account/store/account-preference.store.ts`
2. ใช้ selector-based hooks เพื่อลด re-render:
   - `useCartStore((s) => s.items)`
3. ใช้ middleware เท่าที่จำเป็น:
   - `persist` สำหรับ cart/preferences
   - `devtools` เฉพาะ dev
4. ไม่ export store internals ตรงๆ ให้ export ผ่าน local API:
   - `useCartItems()`
   - `useCartActions()`

## Anti Prop Drilling Playbook

1. ย้าย cross-cutting state เข้า feature store
2. ใช้ composition + slot components ก่อน context ใหม่
3. ถ้าต้อง context ให้ทำ feature-scoped context เท่านั้น
4. ห้ามส่ง props ลึกเกิน 2-3 ชั้นใน critical paths โดยไม่มีเหตุผล

## Library Plan (Install and Adoption Order)

หมายเหตุ: โปรเจกต์นี้มี `zustand` และ `@tanstack/react-query` อยู่แล้ว จึงเน้นแผน adoption/migration ไม่ใช่แค่ติดตั้ง.

### Step 1: State/Data Core

1. `@tanstack/react-query` (already installed): define query key factory + API client adapter
2. `zustand` (already installed): implement bounded stores + selectors + persist policy

### Step 2: Validation & Form

1. `react-hook-form` + `zod` (already installed): schema-first forms
2. centralize validation schemas in shared path, not inline per component

### Step 3: UX Reliability

1. `sonner`: unified toast strategy
2. `framer-motion`: meaningful transitions only (avoid over-animation)
3. `next/font` + image optimization standards on every key page

### Step 4: Guardrails

1. Add `typecheck` script (`tsc --noEmit`) in package scripts
2. Add import boundary lint rules (app/features/shared/core)
3. Add minimal test matrix for critical journeys

## Proposed Target Structure (Incremental)

```text
app/
  (back-office)/
  (storefront)/
  (user)/
features/
  inventory/
  storefront/
  cart/
  checkout/
  account/
shared/
  ui/
  lib/
  config/
  types/
core/
  ports/
  adapters/
```

## UI Acceptance Gates (Before Feature Wiring)

1. Design review pass: spacing/type/interaction consistency
2. Accessibility review pass: keyboard + screen-reader smoke test
3. Performance smoke pass on mobile throttling
4. State review pass: ไม่มี prop drilling chain ที่ไม่จำเป็น
5. Architecture review pass: import boundaries ไม่แตก

## Execution Checklist

1. Approve route map + IA for 3 areas
2. Build shared layout shells and design tokens
3. Build Back Office Inventory screens (UI-only)
4. Build Storefront purchase journey screens (UI-only)
5. Build Core User account/auth screens (UI-only)
6. Finalize Zustand stores and Query boundaries
7. Start feature wiring by module with contracts

## References

1. `docs/specs/admin/features/inventory-backoffice-roadmap.md`
2. `docs/specs/store-front/features/modern-storefront-experience.md`
3. `docs/specs/admin/architecture/overview.md`
4. `docs/specs/store-front/architecture/overview.md`
