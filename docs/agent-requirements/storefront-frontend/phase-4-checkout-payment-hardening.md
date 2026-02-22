# Phase 4 - Checkout & Payment Hardening [TH]

## Scope

เพิ่มความเสถียรของ cart/checkout flow เพื่อพร้อมใช้งานจริงใน production

## Spec Links

- `docs/specs/store-front/requirements/README.md`
- `docs/specs/store-front/architecture/overview.md`

## Feature Tasks

- [x] Cart line-item validation และ price recheck UX
- [x] Checkout step flow (address, shipping, payment, review)
- [x] Payment intent status handling และ retry UX
- [x] Order placement guard (prevent duplicate submit)
- [x] Failure recovery path (network drop, session timeout)

## Dependency

- [x] Checkout preview/place-order endpoints stable
- [x] Payment provider callback/redirect contracts ชัดเจน

## Acceptance Criteria

- ผู้ใช้สามารถทำ cart -> checkout -> order confirmation ได้ต่อเนื่อง
- ระบบไม่สร้าง order ซ้ำจากการกด submit ซ้ำ
- ทุก failure path มีข้อความและ action แก้ไขที่ชัดเจน

