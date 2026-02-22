# Phase Sync: Backend Tasks -> Frontend Features

## 1) Backoffice Phases

### Phase 1: Foundation (Auth + Dashboard Shell)

- Backend status
  - `POST /api/auth/login` -> Available in controller/service
  - `POST /api/auth/refresh` -> Available in controller/service
  - `POST /api/auth/logout` -> Available in controller/service
  - `GET /api/auth/me` -> Available
  - `GET /api/auth/sessions` -> Available
  - `GET /api/orders/summary` -> Planned
- Frontend ที่ต้องมี
  - Login form (`email`, `password`)
  - Token refresh flow (silent refresh)
  - Logout action (ต้องส่ง `refreshToken`)
  - Profile/session page (อ่านจาก `/api/auth/me`, `/api/auth/sessions`)
  - Dashboard KPI ควรแยกส่วนที่ยัง Planned ออกจากส่วนที่ Available

### Phase 2: Catalog + Inventory + Suppliers

- Backend status
  - Catalog CRUD + Variant CRUD -> Available
  - Inventory initialize/adjust/receive/balance/low-stock/transactions -> Available
  - Inventory additional: `reorder-suggestions`, `lots`, `balance/:variantId/by-location` -> Available
  - Suppliers create/list/detail/update -> Available
  - Supplier status toggle `PATCH /api/suppliers/:id/status` -> Available ใน controller
- Frontend ที่ต้องมี
  - Product form + variant form ตาม validation จริง
  - Initial stock, adjustment, receiving forms (payload key ต้องตรงชื่อ DTO)
  - Transactions filter form (query key ต้องใช้ชื่อ `from`/`to` ไม่ใช่ `fromDate`/`toDate`)
  - Suppliers list/create/edit/toggle status

### Phase 3: Orders + Procurement

- Backend status
  - Orders workflow (list/detail/reserve/release/commit/refund) -> Planned
  - Purchase orders: create/list/detail/approve/send/receive/cancel -> Available
- Frontend ที่ต้องมี
  - Procurement UI เชื่อม Purchase Orders ได้ก่อน Orders
  - Receiving against PO form ใช้ `POST /api/purchase-orders/:id/receive`
  - Orders menu แสดงเป็น planned state ชัดเจน (ไม่ผูก endpoint ที่ยังไม่มี)

### Phase 4: Reports/Admin/Audit

- Backend status
  - Reports: `low-stock` -> Available; อื่นๆ หลายตัว -> Planned
  - Admin users/permission matrix/audit logs -> บางส่วนยัง Planned
- Frontend ที่ต้องมี
  - Reports page แยก widget ที่พร้อมใช้กับ widget ที่ planned
  - Permission-aware rendering รองรับ endpoint matrix เมื่อ backend พร้อม

## 2) Storefront Phases (จาก backend requirement)

- ปัจจุบันชุด endpoint `/api/storefront/*` ใน checklist ยังเป็นงานตามแผนเป็นส่วนใหญ่
- Frontend storefront ใน repo นี้ควรถือเป็น `contract-pending`:
  - ทำ UI shell, loading/empty/error states ได้
  - แต่ห้าม lock payload จริงจนกว่าจะมี DTO/controller ฝั่ง backend storefront
  - เมื่อ backend เปิด endpoint จริง ให้ทำ sync รอบใหม่ในโฟลเดอร์นี้ทันที

## 3) Guardrails ที่ frontend ต้องยึด

- Backend เปิด `ValidationPipe` แบบ `whitelist + forbidNonWhitelisted`:
  - ส่ง field เกินจาก DTO จะ error ทันที
- ต้องส่ง enum ตามตัวพิมพ์ใหญ่ที่ backend กำหนด
- แยก `required` vs `optional` ตาม DTO จริง ไม่อิงชื่อ label บน UI
