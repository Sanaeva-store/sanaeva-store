# Input Contracts (Backend -> Frontend UI)

## Global Rules

- ทุก endpoint ใช้ prefix `/api/*`
- Endpoint ที่ไม่ `@Public()` ต้องส่ง `Authorization: Bearer <accessToken>`
- Backend เปิด `whitelist + forbidNonWhitelisted`: ห้ามส่ง key ที่ DTO ไม่ได้ประกาศ
- Pagination มาตรฐาน: `page`, `limit` (integer)
- วันที่ใช้ ISO 8601 (`YYYY-MM-DD` หรือ full datetime ตาม endpoint)

## Enum Values (ต้องส่งแบบ exact)

- `ProductStatus`: `DRAFT` | `ACTIVE` | `INACTIVE`
- `AdjustmentReason`: `DAMAGE` | `LOST` | `FOUND` | `MANUAL_CORRECTION`
- `StockTxnType`: `INBOUND` | `OUTBOUND` | `RESERVE` | `RELEASE` | `TRANSFER_OUT` | `TRANSFER_IN` | `ADJUST`
- `DocStatus`: `DRAFT` | `APPROVED` | `SENT` | `PARTIAL` | `CLOSED` | `CANCELLED` | `RECEIVED`

## Auth

### `POST /api/auth/login`

- Input fields
  - `email` (string, email, required)
  - `password` (string, min 8, required)
- Response key หลัก
  - `user`
  - `tokens.accessToken`, `tokens.refreshToken`, `tokens.tokenType`, `tokens.expiresIn`

### `POST /api/auth/refresh`

- Input fields
  - `refreshToken` (string, required)

### `POST /api/auth/logout`

- Input fields
  - `refreshToken` (string, required)

### `GET /api/auth/me`, `GET /api/auth/sessions`

- ไม่มี input body
- ต้อง login แล้ว

## Catalog

### Product Query: `GET /api/catalog/products`

- Query params
  - `search` (string, optional)
  - `status` (`ProductStatus`, optional)
  - `categoryId` (string, optional)
  - `brand` (string, optional)
  - `sortBy` (`title` | `createdAt` | `updatedAt`, optional, default `createdAt`)
  - `sortOrder` (`asc` | `desc`, optional, default `desc`)
  - `page` (int >= 1, optional)
  - `limit` (int 1..100, optional)

### `POST /api/catalog/products`

- Input fields
  - `title` (string, required, 1..255)
  - `description` (string, optional, <= 2000)
  - `brand` (string, optional, <= 100)
  - `status` (`ProductStatus`, optional)
  - `categoryIds` (string[], optional)

### `PATCH /api/catalog/products/:id`

- Input fields: same as create แต่ optional ทั้งหมด

### `POST /api/catalog/products/:productId/variants`

- Input fields
  - `sku` (string, required, regex `^[A-Za-z0-9\\-_]+$`, <= 100)
  - `barcode` (string, optional, <= 50, unique)
  - `color` (string, optional, <= 50)
  - `size` (string, optional, <= 20)
  - `price` (number, required, min 0, สูงสุด 2 ตำแหน่งทศนิยม)
  - `cost` (number, optional, min 0, สูงสุด 2 ตำแหน่งทศนิยม)
  - `reorderPoint` (int, optional, min 0)
  - `isActive` (boolean, optional)

### `PATCH /api/catalog/products/:productId/variants/:variantId`

- Input fields: same as create variant แต่ optional ทั้งหมด

### `DELETE /api/catalog/products/:productId/variants/:variantId`

- ไม่มี input body

## Inventory

### `POST /api/inventory/initialize`

- Input fields
  - `variantId` (string, required)
  - `warehouseId` (string, required)
  - `locationId` (string, optional)
  - `qty` (int, required, > 0)
  - `unitCost` (number, optional)
  - `note` (string, optional)
  - `idempotencyKey` (string, optional แต่แนะนำส่ง)

### `POST /api/inventory/adjust`

- Input fields
  - `variantId` (string, required)
  - `warehouseId` (string, required)
  - `locationId` (string, optional)
  - `qty` (int, required, ห้าม 0; บวก=เพิ่ม ลบ=ลด)
  - `reasonCode` (`AdjustmentReason`, required)
  - `note` (string, optional)
  - `idempotencyKey` (string, required)

### `POST /api/inventory/receive`

- Input fields
  - `warehouseId` (string, required)
  - `locationId` (string, optional)
  - `poId` (string, optional)
  - `invoiceNumber` (string, optional)
  - `note` (string, optional)
  - `items` (array, required, อย่างน้อย 1)
- `items[]`
  - `variantId` (string, required)
  - `qty` (int, required, > 0)
  - `unitCost` (number, optional)
  - `lotNumber` (string, optional; required เมื่อ variant ถูกตั้ง lot tracking)
  - `expiryDate` (ISO date string, optional)

### `GET /api/inventory/balance/:variantId`

- Query params
  - `warehouseId` (string, optional)
  - `locationId` (string, optional)

### `GET /api/inventory/balance/:variantId/by-location`

- Query params
  - `warehouseId` (string, required)

### `GET /api/inventory/low-stock`

- Query params
  - `warehouseId` (string, optional)

### `GET /api/inventory/reorder-suggestions`

- Query params
  - `warehouseId` (string, optional)

### `GET /api/inventory/transactions`

- Query params
  - `variantId` (string, optional)
  - `warehouseId` (string, optional)
  - `type` (`StockTxnType`, optional)
  - `createdById` (string, optional)
  - `from` (ISO date string, optional)
  - `to` (ISO date string, optional)
  - `page` (int >= 1, optional)
  - `limit` (int 1..200, optional)

### `GET /api/inventory/receiving/:grnId/discrepancies`

- ไม่มี input body

### `GET /api/inventory/lots`

- Query params
  - `variantId` (string, optional)
  - `warehouseId` (string, optional)
  - `activeOnly` (boolean-string, optional, default true)

## Suppliers

### `GET /api/suppliers`

- Query params
  - `page` (int >= 1, optional)
  - `limit` (int >= 1, optional)

### `POST /api/suppliers`

- Input fields
  - `name` (string, required, 1..255)
  - `email` (email string, optional)
  - `phone` (string, optional, <= 30)

### `PATCH /api/suppliers/:id`

- Input fields: `name`, `email`, `phone` (optional ทั้งหมด)

### `PATCH /api/suppliers/:id/status`

- ไม่มี input body
- เป็น toggle active/inactive

## Purchase Orders (Procurement)

### `GET /api/purchase-orders`

- Query params
  - `page` (int >= 1, optional)
  - `limit` (int >= 1, optional)
  - `supplierId` (string, optional)
  - `status` (`DocStatus`, optional)

### `POST /api/purchase-orders`

- Input fields
  - `supplierId` (string, required)
  - `expectedAt` (ISO date, optional)
  - `note` (string, optional)
  - `items` (array, required, อย่างน้อย 1)
- `items[]`
  - `variantId` (string, required)
  - `qty` (int, required, >= 1)
  - `unitCost` (decimal string, required เช่น `"150.00"`)

### `PATCH /api/purchase-orders/:id/approve`

- ไม่มี input body

### `PATCH /api/purchase-orders/:id/send`

- ไม่มี input body

### `POST /api/purchase-orders/:id/receive`

- Input fields
  - `warehouseId` (string, required)
  - `locationId` (string, optional)
  - `invoiceNumber` (string, optional)
  - `note` (string, optional)
  - `items` (array, required, อย่างน้อย 1)
- `items[]`
  - `variantId` (string, required)
  - `qty` (int, required, >= 1)
  - `unitCost` (decimal string, optional)

### `PATCH /api/purchase-orders/:id/cancel`

- ไม่มี input body

## Storefront (Current State)

- ใน backend checklist มี endpoint `/api/storefront/*` จำนวนมาก แต่ยังเป็นแผน
- ก่อนมี DTO/controller จริง ให้ frontend ทำเฉพาะ:
  - หน้า UI, loading/error/empty states
  - form state local + validation ระดับ UX
  - หลีกเลี่ยง hardcode enum/payload contract ถ้ายังไม่ยืนยันจาก backend code
