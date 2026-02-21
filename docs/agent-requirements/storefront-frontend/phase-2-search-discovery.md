# Phase 2 - Search & Discovery [TH]

## Scope

พัฒนาประสบการณ์ค้นหาและค้นพบสินค้าให้ใช้งานได้จริงและปรับขนาดได้

## Spec Links

- `docs/specs/store-front/features/product-catalog.md`
- `docs/specs/store-front/architecture/overview.md`

## Feature Tasks

- [ ] Search input พร้อม debounced query
- [ ] Filter facets (category, size, price range, availability)
- [ ] Sort options และ pagination/infinite strategy
- [ ] URL state synchronization สำหรับ shareable search state
- [ ] Analytics events พื้นฐานของ search interaction

## Dependency

- [ ] Search API รองรับ filter/sort/pagination อย่าง deterministic
- [ ] นิยาม taxonomy/category จาก backend ตรงกัน

## Acceptance Criteria

- ผู้ใช้ค้นหา/กรอง/เรียงสินค้าได้และผลลัพธ์ตรงตามเงื่อนไข
- refresh หน้าแล้วยังคง filter state ตาม URL
- มี fallback เมื่อไม่มีผลลัพธ์และเมื่อ API ผิดพลาด

