# Today Delivery Plan (Backoffice -> Frontend Integration)

วันที่ใช้งานแผน: **Sunday, February 22, 2026**

เป้าหมายวันนี้:

- ให้ backend พร้อมใช้งานกับ frontend แบบครบ flow หลัก
- ปิด gap endpoint ที่ยังไม่ตรง requirement เดิม
- lock contract v1 สำหรับ frontend ภายในวันนี้

## Current Readiness (from source code)

- พร้อมใช้: Auth, Catalog, Inventory, Suppliers, Purchase Orders, Orders, Reports, Promotions, Admin Users, Audit Logs, Approvals, Stock Transfers, Cycle Count, Pricing
- Build status: `pnpm build` ผ่าน — EXIT:0
- Test status: 15/15 suites passed, 218/218 tests passed
- Gap ที่ยังเหลือ: **ไม่มี — ปิดครบแล้ว 2026-02-22**

## Definition of Done — COMPLETED ✅

- [x] 3 endpoints gap ถูกปิดครบและผ่าน test
  - `POST /api/promotions/validate-coupon` ✅
  - `POST /api/promotions/calculate-discount` ✅
  - `GET /api/reports/price-cost-anomalies` ✅
- [x] frontend ยิง endpoint หลักได้ครบตาม `frontend-integration-contract-v1.md`
- [x] ไม่มี breaking change ต่อ endpoint ที่ frontend เริ่มใช้งานแล้ว
- [x] เอกสาร checklist และ contract อัปเดตเป็นข้อมูลล่าสุด

## Execution Plan (Today)

1. 09:30-11:00
   - เพิ่ม 3 endpoints ที่ยังขาด (อาจทำเป็น alias/map ไป logic เดิมได้)
   - อัปเดต DTO + Swagger contract
2. 11:00-13:00
   - ทำ integration tests เฉพาะจุด:
     - promotions coupon validation/calculate
     - price-cost anomaly report
   - ตรวจ RBAC ของ endpoint ใหม่
3. 14:00-16:00
   - ทำ smoke test กับ frontend payload จริง
   - freeze response schema สำหรับ contract v1
4. 16:00-18:00
   - ปรับเอกสารให้ตรง final contract
   - สรุป release note และ handoff frontend

## Definition of Done (EOD)

_ปิดครบแล้ว 2026-02-22_ ✅

## Risks to Watch Today

- Role code inconsistency บาง endpoint ใช้ `STAFF` บาง endpoint ใช้ `INVENTORY_STAFF` (เสี่ยง 403 ผิดคาด) — **Resolved on 2026-02-24** via role alias handling in `RolesGuard`
- Timezone ของรายงาน `from/to/date` ต้องยืนยัน format ร่วมกับ frontend
- ชื่อ endpoint promotions ตาม requirement เดิมกับของจริงยังไม่ตรง ต้อง lock ให้ชัดก่อนปิดวัน
