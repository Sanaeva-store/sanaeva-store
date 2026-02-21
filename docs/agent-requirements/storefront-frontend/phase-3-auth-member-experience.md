# Phase 3 - Auth & Member Experience [TH]

## Scope

เชื่อมประสบการณ์หน้าร้านกับสถานะผู้ใช้ (guest/member) และการเข้าถึงฟีเจอร์ส่วนตัว

## Spec Links

- `docs/specs/store-front/requirements/README.md`
- `docs/specs/store-front/architecture/overview.md`

## Feature Tasks

- [ ] Auth-aware header/account menu
- [ ] Session bootstrap และ protected route strategy
- [ ] Member profile entry points (order history, account settings)
- [ ] Favorites/wishlist UI state (ถ้ามี API พร้อม)
- [ ] Permission-aware rendering สำหรับ member-only actions

## Dependency

- [ ] Auth/session endpoints พร้อมใช้งาน
- [ ] ข้อตกลง guest checkout กับ backend ชัดเจน

## Acceptance Criteria

- Guest และ member ได้ UX ที่ถูกต้องตามสิทธิ์
- เปลี่ยนสถานะ login/logout แล้ว UI อัปเดตทันที
- เส้นทาง member-only ถูกป้องกันครบ

