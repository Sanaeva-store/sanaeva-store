# Frontend Task: Backoffice Inventory API Integration

เป้าหมาย: ให้ทีม frontend ใน `sanaeva-store` เชื่อม Inventory API ตาม contract ล่าสุดและใช้งานได้จริงทันที โดยลด validation error/mapping error

Source contract:
- `../../../../sanaeva-store-api/docs/api/inventory.md`
- `./input-contracts.md`
- `./frontend-gap-checklist.md`

## Scope

- Inventory dashboard
- Initial stock
- Stock adjustment
- Goods receiving
- Transactions
- Low stock
- Suppliers

## Task 1: Align API Types and Client Methods

ไฟล์หลัก:
- `features/inventory/api/inventory.api.ts`
- `features/inventory/api/suppliers.api.ts`

Checklist:
- [ ] ยืนยัน payload ตรง backend DTO 100% (`qty`, `reasonCode`, `poId`, `idempotencyKey`)
- [ ] ยืนยัน enum ใช้ uppercase ตาม contract (`AdjustmentReason`, `StockTxnType`)
- [ ] รองรับ endpoint เพิ่มเติม:
  - [ ] `GET /api/inventory/balance/:variantId/by-location`
  - [ ] `GET /api/inventory/reorder-suggestions`
  - [ ] `GET /api/inventory/receiving/:grnId/discrepancies`
  - [ ] `POST /api/inventory/putaway/:grnId`
  - [ ] `GET /api/inventory/lots`
- [ ] parse paginated response จาก `data` (ไม่ใช้ `items`)
- [ ] map `unitCost` response เป็น `string | null` (ไม่บังคับเป็น number)

## Task 2: Hook Layer for React Query

ไฟล์หลัก:
- `features/inventory/hooks/use-inventory.ts`
- `features/inventory/hooks/use-suppliers.ts`

Checklist:
- [ ] เพิ่ม hooks สำหรับ endpoint ใหม่ทั้งหมดใน Task 1
- [ ] ตั้ง query keys ให้ stable และรวม filter params ที่ใช้จริง
- [ ] invalidate cache หลัง mutation สำคัญ (`initialize`, `adjust`, `receive`, `putaway`, `toggleSupplierStatus`)
- [ ] รองรับ loading/error state ที่อ่าน error shape `{ code, message, requestId }` ได้

## Task 3: Wire Inventory Pages to Real API

ไฟล์หลัก:
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/dashboard/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/initial-stock/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/adjustment/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/receiving/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/transactions/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/low-stock/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/suppliers/page.tsx`

Checklist:
- [ ] แทน mock data ด้วย query จริง
- [ ] ฟอร์ม initial stock ยิง `POST /api/inventory/initialize`
- [ ] ฟอร์ม adjustment ยิง `POST /api/inventory/adjust`
  - [ ] แปลง increase/decrease -> signed `qty`
  - [ ] generate `idempotencyKey` ฝั่ง client ทุก submit
- [ ] ฟอร์ม receiving ยิง `POST /api/inventory/receive`
  - [ ] รองรับ line item: `variantId`, `qty`, `unitCost`, `lotNumber`, `expiryDate`
- [ ] หน้า transactions รองรับ filter/query ตาม contract (`from`, `to`, `type`, `createdById`, `page`, `limit`)
- [ ] หน้า low stock แสดง `shortage` จาก API
- [ ] หน้า suppliers รองรับ list/create/update/toggle status

## Task 4: Form Validation (react-hook-form + zod)

Checklist:
- [ ] `initialize.qty` ต้องเป็น integer > 0
- [ ] `adjust.qty` ห้าม 0
- [ ] `adjust.reasonCode` ต้องเป็น enum backend เท่านั้น
- [ ] `receive.items[].qty` ต้อง > 0
- [ ] `receive.items[].expiryDate` ต้องเป็น ISO date string เมื่อตั้งค่า
- [ ] reject unknown keys ก่อนส่ง API

## Task 5: Error Handling and UX Safety

Checklist:
- [ ] แสดงข้อความ error จาก backend `message` + `requestId` (สำหรับ support/debug)
- [ ] แยก handling กรณี `401`, `403`, `409`, `422`
- [ ] ปุ่ม submit ต้อง disable ระหว่าง pending mutation
- [ ] ป้องกัน double-submit (นอกจาก idempotency)

## Task 6: Integration Test / QA

ขั้นต่ำที่ต้องทดสอบ:
- [ ] Initialize stock สำเร็จ + refetch balance
- [ ] Adjust stock ลดจนติดลบ -> ต้องเห็น backend reject
- [ ] Receive goods หลายรายการ + lot/expiry
- [ ] Transaction filter by date/type ทำงาน
- [ ] Supplier toggle status อัปเดตหน้า list ทันที
- [ ] Putaway flow (`POST /putaway/:grnId`) และ discrepancy list

## Task 7: Form Field Standardization (Input Height/Spacing/States)

เป้าหมาย:
- ทำให้ input ทุกหน้า inventory มีขนาดและระยะห่างสม่ำเสมอ
- ลด layout jump จาก error/help text

ไฟล์หลัก:
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/initial-stock/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/adjustment/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/receiving/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/suppliers/page.tsx`
- `components/ui/input.tsx`
- `components/ui/select.tsx`
- `components/ui/textarea.tsx`

Checklist:
- [ ] กำหนด input size มาตรฐานทั้งโมดูล (default `h-10`, compact `h-9` เมื่อจำเป็น)
- [ ] ระยะ `label -> field` เท่ากันทุกฟอร์ม (`space-y-2`)
- [ ] ระยะ `field -> error/help` เท่ากันทุกฟอร์ม (`mt-1` และ text size เดียวกัน)
- [ ] ทุกฟอร์มมี pending/disabled state ที่ consistent ระหว่าง mutation
- [ ] ใช้ semantic token classes เท่านั้น (`border-input`, `ring-ring`, `text-muted-foreground`, `text-destructive`)
- [ ] ไม่มี hardcoded style (`style={{...}}`, hex/hsl/oklch) ในหน้า inventory forms

## Task 8: Width Symmetry and Responsive Grid Rules

เป้าหมาย:
- แก้ความกว้างของ field ที่ไม่สมมาตร
- ทำให้มองง่ายทั้ง mobile/tablet/desktop

ไฟล์หลัก:
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/initial-stock/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/adjustment/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/receiving/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/transactions/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/low-stock/page.tsx`
- `app/[locale]/(admin-dasboard)/admin-dasboard/inventory/suppliers/page.tsx`

Checklist:
- [ ] Mobile (`< md`): ฟอร์มเป็น single-column ทั้งหมด (`grid-cols-1`)
- [ ] Tablet (`md`): ฟิลด์ที่เป็นคู่ตรรกะเดียวกันจัด 2 คอลัมน์และกว้างเท่ากัน
- [ ] Desktop (`lg+`): จำกัด max width ของ form container (`max-w-2xl` หรือ `max-w-3xl`) ไม่ยืดเต็มจอ
- [ ] Search/filter toolbar ใช้ grid เดียวกับ form และมี gap สม่ำเสมอ
- [ ] ปุ่ม action ในฟอร์มมีสัดส่วนสมมาตร (mobile เต็มแถว, desktop auto width ตามกลุ่มปุ่ม)
- [ ] ตารางและ card list มี horizontal padding ซ้าย/ขวาเท่ากันใน breakpoint เดียวกัน

## Task 9: Field-Type Specific UX Improvements

เป้าหมาย:
- ให้การกรอกข้อมูลเร็วขึ้นและลดความผิดพลาดจากชนิดข้อมูล

Checklist:
- [ ] Number input (`qty`, `unitCost`) ใช้ `inputMode=\"numeric\"` หรือ `decimal` ให้เหมาะสม
- [ ] Date input (`expiryDate`, filters `from/to`) มี format/placeholder สอดคล้อง backend contract
- [ ] Enum fields (`reasonCode`, transaction type) ใช้ select ที่ label ชัดเจนและ map ค่าจริงตาม contract
- [ ] ตารางฟอร์ม receiving line items มีคอลัมน์ที่จัดแนวสอดคล้องกันทุก breakpoint
- [ ] Error message ต่อ field ระบุได้ว่า field ไหนผิด และมีข้อความที่ action ได้ทันที

## Task 10: Responsive Visual QA Matrix (Mobile/Tablet/Desktop)

เป้าหมาย:
- ปิดงานด้วยเกณฑ์ตรวจที่ทำซ้ำได้และรีวิวร่วมทีมได้ง่าย

Checklist:
- [ ] ตรวจที่ 360x800 (mobile), 768x1024 (tablet), 1366x768 (desktop)
- [ ] ทุกหน้าฟอร์ม inventory ไม่มี overflow/clip ของ input, select, button
- [ ] Baseline alignment ของ label/input ในแถวเดียวกันต้องตรง
- [ ] ความสูงของ input ในหน้าเดียวกันต้องเท่ากัน
- [ ] ระยะห่าง section และ card container เท่ากันตาม token spacing
- [ ] Capture before/after screenshots ต่อหน้าและต่อ breakpoint สำหรับรีวิว
- [ ] อัปเดตข้อค้นพบใน `frontend-gap-checklist.md` (เพิ่มหัวข้อ UI symmetry + responsive form)

## Definition of Done

- [ ] ทุกหน้าภายใต้ inventory menu ใช้ API จริง ไม่มี mock ค้าง
- [ ] payload/query/enum ตรง contract ล่าสุด 100%
- [ ] input field sizing/spacing ผ่านมาตรฐานเดียวกันทุกหน้า inventory
- [ ] width symmetry ผ่านเกณฑ์ mobile/tablet/desktop ตาม Task 8-10
- [ ] ผ่าน `bun run lint`
- [ ] ผ่าน `bun run typecheck`
- [ ] ผ่าน test ที่เกี่ยวข้อง (`bun run test`)
- [ ] อัปเดตไฟล์ `frontend-gap-checklist.md` ให้สะท้อนว่าจุด gap ไหนปิดแล้ว

## Quick Endpoint Map (สำหรับทีม FE)

- `POST /api/inventory/initialize`
- `POST /api/inventory/adjust`
- `POST /api/inventory/receive`
- `GET /api/inventory/balance/:variantId`
- `GET /api/inventory/balance/:variantId/by-location`
- `GET /api/inventory/low-stock`
- `GET /api/inventory/reorder-suggestions`
- `GET /api/inventory/transactions`
- `GET /api/inventory/receiving/:grnId/discrepancies`
- `POST /api/inventory/putaway/:grnId`
- `GET /api/inventory/lots`
- `GET /api/suppliers`
- `POST /api/suppliers`
- `GET /api/suppliers/:id`
- `PATCH /api/suppliers/:id`
- `PATCH /api/suppliers/:id/status`
