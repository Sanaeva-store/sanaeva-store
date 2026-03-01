# Frontend Gap Checklist (Current Repo vs Backend Contract)

ไฟล์นี้สรุปช่องว่างที่ควรแก้ก่อนเชื่อม UI/ฟอร์มจริง เพื่อให้ยิง API ผ่าน validation ของ backend

## High Priority Gaps

> **Status updated: 2026-02-24 — All 11 high-priority gaps resolved (API layer + types corrected)**

1. ~~`features/inventory/api/inventory.api.ts` — ใช้ชื่อ field payload ไม่ตรง DTO backend~~
   - **RESOLVED** ✅ — corrected to `qty`, `reasonCode`, `poId`

2. ~~`features/inventory/api/inventory.api.ts` — enum transaction type ไม่ตรง backend~~
   - **RESOLVED** ✅ — `StockTxnType` uppercase (`INBOUND`, `OUTBOUND`, `ADJUST`, ...)

3. ~~`features/inventory/api/inventory.api.ts` — query param ชื่อวันที่ไม่ตรง~~
   - **RESOLVED** ✅ — corrected to `from`, `to`

4. ~~`features/inventory/api/inventory.api.ts` — response list key ไม่ตรง~~
   - **RESOLVED** ✅ — uses `data` key per `PaginatedResponse<T>`

5. ~~`features/inventory/api/inventory.api.ts` — receiveStock คืน StockTransaction[]~~
   - **RESOLVED** ✅ — typed as `GoodsReceiptResponseDto` with `id`, `code`, `warehouseId`, `transactions[]`

6. ~~`features/inventory/api/inventory.api.ts` — fetchStockBalance คืนแค่ { available, reserved }~~
   - **RESOLVED** ✅ — now typed as `StockBalanceDto` with full field set

7. ~~`features/inventory/api/suppliers.api.ts` — อิง field ที่ backend ไม่มี~~
   - **RESOLVED** ✅ — model corrected to `id`, `name`, `email`, `phone`, `isActive`, timestamps

8. ~~`features/inventory/api/suppliers.api.ts` — list response key ไม่ตรง~~
   - **RESOLVED** ✅ — uses `data` key

9. ~~`features/inventory/api/suppliers.api.ts` — query `search` ไม่มีใน backend~~
   - **RESOLVED** ✅ — removed `search` param; standardized to `page`, `limit` only

10. ~~`features/storefront/api/products.api.ts` — ProductStatus lowercase~~
    - **RESOLVED** ✅ — `ProductStatus` is now uppercase (`ACTIVE`, `INACTIVE`, `DRAFT`)

11. ~~`features/storefront/api/products.api.ts` — endpoint slug ไม่มีใน backend~~
    - **RESOLVED** ✅ — slug-based calls removed; uses `GET /api/catalog/products/:id`

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
- **Status**: Frontend API layer uses role codes from `AppRole` enum in `shared/types/api.ts`; awaiting backend confirmation before locking constants.

---

## API Layer Completion (2026-02-24)

All API service functions and React Query hooks have been implemented for every backend section:

| Domain | API File | Hook File | Unit Tests |
|--------|----------|-----------|------------|
| Inventory | `features/inventory/api/inventory.api.ts` | `use-inventory.ts` | ✅ |
| Suppliers | `features/inventory/api/suppliers.api.ts` | `use-suppliers.ts` | ✅ |
| Catalog / Products | `features/storefront/api/products.api.ts` | `use-catalog.ts` | ✅ |
| Purchase Orders | `features/inventory/api/purchase-orders.api.ts` | `use-purchase-orders.ts` | ✅ |
| Orders | `features/inventory/api/orders.api.ts` | `use-orders.ts` | ✅ |
| Reports | `features/inventory/api/reports.api.ts` | `use-reports.ts` | ✅ |
| Promotions | `features/inventory/api/promotions.api.ts` | `use-promotions.ts` | ✅ |
| Admin Users + Audit + Approvals | `features/inventory/api/admin-users.api.ts` | `use-admin-users.ts` | ✅ |
| Stock Transfers | `features/inventory/api/stock-transfers.api.ts` | `use-stock-transfers.ts` | ✅ |
| Cycle Count | `features/inventory/api/cycle-count.api.ts` | `use-cycle-count.ts` | ✅ |
| Pricing | `features/inventory/api/pricing.api.ts` | `use-pricing.ts` | ✅ |
| Backoffice Auth | `features/inventory/api/backoffice-auth.api.ts` | `use-backoffice-auth.ts` | ✅ |

**Remaining work**: UI pages and forms for each endpoint (see TASK-CHECKLIST.md).

---

## UI-Level API Gaps (2026-03-01)

The following admin pages have **no corresponding backend endpoint** in contract v1.1.
They are kept as non-breaking placeholder UIs (`LoadingSkeleton`) until backend adds the endpoints.

### GAP-001 — `/admin-dasboard/analytics`

**Page:** `app/[locale]/(admin-dasboard)/admin-dasboard/analytics/page.tsx`

Required endpoints missing from contract:

| Endpoint | Purpose | Fields needed |
|---|---|---|
| `GET /api/analytics/revenue` | Revenue trend over time | `date`, `revenue`, `currency` |
| `GET /api/analytics/orders` | Order volume trend | `date`, `orderCount` |
| `GET /api/analytics/aov` | Average order value | `date`, `aov` |
| `GET /api/analytics/conversion` | Conversion rate | `date`, `conversionRate` |
| `GET /api/analytics/sales-by-category` | Sales by category/period | `categoryId`, `categoryName`, `revenue`, `period` |

**Decision:** Placeholder. Integrate when backend exposes analytics endpoints.

---

### GAP-002 — `/admin-dasboard/customers`

**Page:** `app/[locale]/(admin-dasboard)/admin-dasboard/customers/page.tsx`

Required endpoints missing from contract:

| Endpoint | Purpose | Fields needed |
|---|---|---|
| `GET /api/customers` | Paginated customer list | `id`, `name`, `email`, `phone`, `totalOrders`, `totalSpent`, `createdAt` |
| `GET /api/customers/:id` | Customer detail | Full customer profile |
| `PATCH /api/customers/:id/status` | Activate/suspend customer | `status: "ACTIVE" or "SUSPENDED"` |
| `GET /api/customers/:id/orders` | Orders by customer | Paginated order list |

**Decision:** Placeholder. `Order.customerId` exists but no `/api/customers` resource in contract.

---

### GAP-003 — `/admin-dasboard/settings/general`

**Page:** `app/[locale]/(admin-dasboard)/admin-dasboard/settings/general/page.tsx`

Required endpoints missing from contract:

| Endpoint | Purpose | Fields needed |
|---|---|---|
| `GET /api/settings/general` | Read general store settings | `storeName`, `storeEmail`, `currency`, `timezone`, `language` |
| `PATCH /api/settings/general` | Update general store settings | Same as GET |

**Decision:** Placeholder. Integrate when backend adds settings resource.

---

### GAP-004 — `/admin-dasboard/settings/reports`

**Page:** `app/[locale]/(admin-dasboard)/admin-dasboard/settings/reports/page.tsx`

Required endpoints missing from contract:

| Endpoint | Purpose | Fields needed |
|---|---|---|
| `GET /api/settings/reports` | Read report configuration | `lowStockThreshold`, `reorderLeadDays`, `defaultCurrency`, `reportSchedule` |
| `PATCH /api/settings/reports` | Update report configuration | Same as GET |

**Decision:** Placeholder. Integrate when backend adds settings/reports resource.

---

## Action Required (Backend Team)

To unblock UI integration for the above 4 pages, add these endpoint groups to the contract
and implement backend routes:

1. `GET/PATCH /api/analytics/*` — analytics time-series
2. `GET/PATCH /api/customers/*` — customer management
3. `GET/PATCH /api/settings/general` — general store settings
4. `GET/PATCH /api/settings/reports` — report configuration settings

Once confirmed in contract, remove the gap entry and implement integration per this file's
completion checklist.
