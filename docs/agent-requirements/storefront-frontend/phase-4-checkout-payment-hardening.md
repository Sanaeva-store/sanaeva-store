# Phase 4 - Checkout & Payment Hardening [TH]

## Scope

เพิ่มความเสถียรของ cart/checkout flow เพื่อพร้อมใช้งานจริงใน production

## Spec Links

- `docs/specs/store-front/requirements/README.md`
- `docs/specs/store-front/architecture/overview.md`

## Feature Tasks

- [ ] Cart line-item validation และ price recheck UX
- [ ] Checkout step flow (address, shipping, payment, review)
- [ ] Payment intent status handling และ retry UX
- [ ] Order placement guard (prevent duplicate submit)
- [ ] Failure recovery path (network drop, session timeout)

## Dependency

- [ ] Checkout preview/place-order endpoints stable
- [ ] Payment provider callback/redirect contracts ชัดเจน

## Acceptance Criteria

- ผู้ใช้สามารถทำ cart -> checkout -> order confirmation ได้ต่อเนื่อง
- ระบบไม่สร้าง order ซ้ำจากการกด submit ซ้ำ
- ทุก failure path มีข้อความและ action แก้ไขที่ชัดเจน

