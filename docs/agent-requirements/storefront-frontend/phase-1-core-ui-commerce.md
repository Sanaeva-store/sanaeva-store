# Phase 1 - Core UI Commerce [TH]

## Scope

วางโครง UI หลักที่จำเป็นต่อการขาย และวางมาตรฐานการ fetch ข้อมูลร่วมกันทั้งโปรเจกต์

## Spec Links

- `docs/specs/store-front/features/product-catalog.md`
- `docs/specs/store-front/architecture/overview.md`
- `docs/specs/store-front/requirements/README.md`

## Feature Tasks

- [x] Layout และ navigation สำหรับ storefront
- [x] Product listing page (loading/empty/error state)
- [x] Product detail page (gallery, variant selector, stock message)
- [x] Shared query key conventions และ query hooks พื้นฐาน
- [x] Generic HTTP client layer (TanStack Query + Axios/Fetch adapter)

## Dependency

- [x] Backend endpoints สำหรับ product list/detail พร้อมใช้งาน
- [x] Contract ของราคา/stock/variant ชัดเจน

## Acceptance Criteria

- ผู้ใช้เปิดหน้า listing และ PDP ได้ครบใน flow หลัก
- UI แสดงผลถูกต้องในสถานะ loading/error/empty
- โค้ด fetch data ใช้ pattern กลางเดียวกันทั้งโมดูล

