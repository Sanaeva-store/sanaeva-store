# Frontend Gap Checklist (Current Repo vs Backend Contract)

ไฟล์นี้สรุปช่องว่างที่ควรแก้ก่อนเชื่อม UI/ฟอร์มจริง เพื่อให้ยิง API ผ่าน validation ของ backend

## High Priority Gaps

1. `features/inventory/api/inventory.api.ts`
   - ใช้ชื่อ field payload ไม่ตรง DTO backend
   - ปัจจุบัน: `quantity`, `delta`, `reason`, `poReference`
   - ต้องเป็น: `qty`, `reasonCode`, `poId`

2. `features/inventory/api/inventory.api.ts`
   - enum transaction type ไม่ตรง backend
   - ปัจจุบัน: `initialize`, `adjust_increase`, `receive`, `commit` (lowercase/custom)
   - backend ต้องการ `StockTxnType` แบบ uppercase (`INBOUND`, `OUTBOUND`, `ADJUST`, ...)

3. `features/inventory/api/inventory.api.ts`
   - query param ชื่อวันที่ไม่ตรง
   - ปัจจุบันส่ง `fromDate`, `toDate`
   - backend รับ `from`, `to`

4. `features/inventory/api/inventory.api.ts`
   - response list key ไม่ตรง
   - ปัจจุบันคาดหวัง `items`
   - backend ส่ง `data` ใน paginated response

5. `features/inventory/api/inventory.api.ts`
   - รับผลลัพธ์ `receiveStock` เป็น `StockTransaction[]`
   - backend ส่ง `GoodsReceiptResponseDto` (มี `id`, `code`, `warehouseId`, `transactions[]`)

6. `features/inventory/api/inventory.api.ts`
   - `fetchStockBalance` คืนแค่ `{ available, reserved }`
   - backend คืน `StockBalanceDto` (`variantId`, `warehouseId`, `locationId`, `onHand`, `reserved`, `available`)

7. `features/inventory/api/suppliers.api.ts`
   - model supplier ยังอิง field ที่ backend ไม่มี (`code`, `contactName`, `address`, `note`)
   - backend มี `id`, `name`, `email`, `phone`, `isActive`, timestamps

8. `features/inventory/api/suppliers.api.ts`
   - list response key ไม่ตรง
   - ปัจจุบันคาดหวัง `items`
   - backend ส่ง `data`

9. `features/inventory/api/suppliers.api.ts`
   - query `search` ยังไม่ประกาศใน backend controller (`GET /api/suppliers`)
   - backend รองรับแค่ `page`, `limit` ณ ตอนนี้

10. `features/storefront/api/products.api.ts`
   - `ProductStatus` เป็น lowercase (`active`, `inactive`, `draft`)
   - backend ใช้ uppercase enum (`ACTIVE`, `INACTIVE`, `DRAFT`)

11. `features/storefront/api/products.api.ts`
   - endpoint `GET /api/catalog/products/slug/:slug` ยังไม่พบใน backend controller
   - frontend ควรใช้ `GET /api/catalog/products/:id` หรือทำ mapping ใหม่เมื่อ backend เพิ่ม endpoint slug

## Medium Priority Gaps

1. `app/(admin-dasboard)/inventory/adjustment/page.tsx`
   - UI reason code ใช้ค่าภายใน (`damage`, `loss`, `correction`) แต่ backend ต้อง uppercase enum

2. `app/(admin-dasboard)/inventory/initial-stock/page.tsx`
   - ฟอร์มยังไม่มี field `unitCost`, `locationId`, `idempotencyKey` (optional/recommended)

3. `app/(admin-dasboard)/inventory/receiving/page.tsx`
   - ยังไม่มี `locationId`, `note`, และ line-item field `lotNumber`, `expiryDate`

4. `app/(admin-dasboard)/inventory/transactions/page.tsx`
   - ตัวเลือก transaction type ใน UI ยังไม่ครบ `StockTxnType` จริง

5. `app/(admin-dasboard)/inventory/suppliers/page.tsx`
   - ช่องค้นหายังบอกค้นหา `code/contact` แต่ backend ปัจจุบันยังไม่มี field/query เหล่านี้

## Role String Risk (ต้องยืนยันร่วมกัน)

- controller บางจุดใช้ `@Roles('STAFF')` แต่เอกสารบางไฟล์ใช้ `INVENTORY_STAFF`
- แนะนำให้ backend และ frontend sync role code ชุดเดียว แล้วล็อกใน constants กลาง
