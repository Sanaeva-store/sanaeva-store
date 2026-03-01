# Admin API Audit + Integration Checklist (2026-03-01)

Source of truth:
- `docs/agent-sync/backend-frontend-input-contracts/backoffice-api-handoff/frontend-integration-contract-v1.md`
- Effective date: 2026-02-22 (Contract v1.1 LOCKED)

## 1) Root Cause ที่ทำให้ 404 เกือบทุกหน้า

- Error ที่พบ: `GET http://localhost:8888/api/api/reports/turnover 404`
- สาเหตุ: `NEXT_PUBLIC_API_BASE_URL` ถูกตั้งเป็น `http://localhost:8888/api` แต่ service เรียก path แบบ `/api/...` อยู่แล้ว จึงเกิด `/api/api/...`
- สถานะ: แก้แล้วใน client ให้รองรับทั้งสองแบบ (base เป็น host ปกติ หรือ host ที่มี `/api`)

## 2) Method/Route Audit Result (เทียบ contract v1.1)

ผลตรวจจาก API modules ฝั่ง frontend (`features/inventory/api/*` + `features/storefront/api/products.api.ts`):
- ✅ Route + HTTP Method ตรงกับ contract ทั้งหมดที่ระบุในรายงาน backoffice
- ✅ ไม่พบ endpoint ที่ใช้ method ผิด
- ✅ ไม่พบ endpoint path เพี้ยนจาก contract

### Auth / Session
- ✅ `POST /api/auth/login`
- ✅ `POST /api/auth/refresh`
- ✅ `POST /api/auth/logout`
- ✅ `GET /api/auth/me`
- ✅ `GET /api/auth/sessions`

### Dashboard
- ✅ `GET /api/orders/summary`
- ✅ `GET /api/reports/low-stock`
- ✅ `GET /api/reports/dashboard-summary`

### Catalog
- ✅ `GET /api/catalog/products`
- ✅ `POST /api/catalog/products`
- ✅ `GET /api/catalog/products/:id`
- ✅ `PATCH /api/catalog/products/:id`
- ✅ `DELETE /api/catalog/products/:id`
- ✅ `POST /api/catalog/products/:productId/variants`
- ✅ `GET /api/catalog/products/:productId/variants`
- ✅ `GET /api/catalog/products/:productId/variants/:variantId`
- ✅ `PATCH /api/catalog/products/:productId/variants/:variantId`
- ✅ `DELETE /api/catalog/products/:productId/variants/:variantId`
- ✅ `POST /api/catalog/products/:productId/images`
- ✅ `GET /api/catalog/products/:productId/images`
- ✅ `PATCH /api/catalog/products/:productId/images/:imageId`
- ✅ `DELETE /api/catalog/products/:productId/images/:imageId`

### Inventory
- ✅ `POST /api/inventory/initialize`
- ✅ `POST /api/inventory/adjust`
- ✅ `POST /api/inventory/receive`
- ✅ `GET /api/inventory/balance/:variantId`
- ✅ `GET /api/inventory/balance/:variantId/by-location`
- ✅ `GET /api/inventory/low-stock`
- ✅ `GET /api/inventory/reorder-suggestions`
- ✅ `GET /api/inventory/transactions`
- ✅ `GET /api/inventory/receiving/:grnId/discrepancies`
- ✅ `POST /api/inventory/putaway/:grnId`
- ✅ `GET /api/inventory/lots`

### Suppliers + Purchase Orders
- ✅ `GET /api/suppliers`
- ✅ `POST /api/suppliers`
- ✅ `GET /api/suppliers/:id`
- ✅ `PATCH /api/suppliers/:id`
- ✅ `PATCH /api/suppliers/:id/status`
- ✅ `GET /api/purchase-orders`
- ✅ `POST /api/purchase-orders`
- ✅ `GET /api/purchase-orders/:id`
- ✅ `PATCH /api/purchase-orders/:id/approve`
- ✅ `PATCH /api/purchase-orders/:id/send`
- ✅ `POST /api/purchase-orders/:id/receive`
- ✅ `PATCH /api/purchase-orders/:id/cancel`

### Orders
- ✅ `GET /api/orders`
- ✅ `POST /api/orders`
- ✅ `GET /api/orders/:id`
- ✅ `POST /api/orders/:id/reserve`
- ✅ `POST /api/orders/:id/release`
- ✅ `POST /api/orders/:id/commit`
- ✅ `PATCH /api/orders/:id/status`

### Reports
- ✅ `GET /api/reports/low-stock`
- ✅ `GET /api/reports/snapshot/:date`
- ✅ `GET /api/reports/turnover`
- ✅ `GET /api/reports/aging`
- ✅ `GET /api/reports/dead-stock`
- ✅ `GET /api/reports/profit-summary`
- ✅ `GET /api/reports/profit-by-sku`
- ✅ `GET /api/reports/profit-by-category`
- ✅ `GET /api/reports/profit-by-order/:id`
- ✅ `GET /api/reports/dashboard-summary`
- ✅ `GET /api/reports/price-cost-anomalies`

### Promotions
- ✅ `GET /api/promotions`
- ✅ `POST /api/promotions`
- ✅ `GET /api/promotions/:id`
- ✅ `PATCH /api/promotions/:id`
- ✅ `POST /api/promotions/:id/toggle`
- ✅ `POST /api/promotions/simulate`
- ✅ `POST /api/promotions/validate-coupon`
- ✅ `POST /api/promotions/calculate-discount`
- ✅ `GET /api/promotions/:id/stacking-rules`
- ✅ `POST /api/promotions/:id/stacking-rules`

### Admin + Security
- ✅ `GET /api/admin-users`
- ✅ `GET /api/admin-users/:id`
- ✅ `GET /api/admin-users/permissions/matrix`
- ✅ `POST /api/admin-users/:id/roles`
- ✅ `DELETE /api/admin-users/:id/roles/:roleCode`
- ✅ `PATCH /api/admin-users/:id/status`
- ✅ `GET /api/audit-logs`
- ✅ `GET /api/audit-logs/:id`
- ✅ `GET /api/approvals`
- ✅ `POST /api/approvals`
- ✅ `GET /api/approvals/:id`
- ✅ `POST /api/approvals/:id/approve`
- ✅ `POST /api/approvals/:id/reject`

### Stock Transfers + Cycle Count
- ✅ `GET /api/stock-transfers`
- ✅ `POST /api/stock-transfers`
- ✅ `GET /api/stock-transfers/:id`
- ✅ `POST /api/stock-transfers/:id/approve`
- ✅ `POST /api/stock-transfers/:id/ship`
- ✅ `POST /api/stock-transfers/:id/receive`
- ✅ `POST /api/stock-transfers/:id/complete`
- ✅ `POST /api/stock-transfers/:id/cancel`
- ✅ `GET /api/cycle-count`
- ✅ `POST /api/cycle-count`
- ✅ `GET /api/cycle-count/:id`
- ✅ `POST /api/cycle-count/:id/count`
- ✅ `POST /api/cycle-count/:id/close`

### Pricing
- ✅ `GET /api/catalog/price-lists`
- ✅ `POST /api/catalog/price-lists`
- ✅ `GET /api/catalog/price-lists/:id`
- ✅ `PATCH /api/catalog/price-lists/:id`
- ✅ `GET /api/catalog/price-lists/:id/items`
- ✅ `POST /api/catalog/price-lists/:id/items`

## 3) Integration Checklist (ทุกหน้าใน Admin)

Legend:
- `[x]` ต่อ API จริงแล้ว
- `[ ]` ยังเป็นหน้า placeholder/ยังไม่ผูก hook

### Core + Inventory + Reports
- [ ] `/admin-dasboard` (dashboard root): เปลี่ยนข้อมูล mock ให้ใช้ `useOrdersSummary` + `useDashboardSummaryQuery` + `useLowStockReportQuery`
- [x] `/admin-dasboard/inventory/dashboard`: ใช้ `useLowStockQuery`, `useTransactionsQuery`
- [x] `/admin-dasboard/inventory/initial-stock`: ใช้ `POST /api/inventory/initialize`
- [x] `/admin-dasboard/inventory/adjustment`: ใช้ `POST /api/inventory/adjust`
- [x] `/admin-dasboard/inventory/receiving`: ใช้ `POST /api/inventory/receive`
- [x] `/admin-dasboard/inventory/low-stock`: ใช้ `GET /api/inventory/low-stock`
- [x] `/admin-dasboard/inventory/transactions`: ใช้ `GET /api/inventory/transactions`
- [x] `/admin-dasboard/inventory/products`: ใช้ `GET /api/catalog/products`
- [x] `/admin-dasboard/inventory/products/new`: ใช้ `POST /api/catalog/products`
- [x] `/admin-dasboard/inventory/products/[id]`: ใช้ `GET /api/catalog/products/:id`
- [x] `/admin-dasboard/inventory/suppliers`: ใช้ `GET/POST/PATCH /api/suppliers` + `PATCH /api/suppliers/:id/status`
- [x] `/admin-dasboard/purchasing/suppliers`: reuse จาก inventory suppliers
- [x] `/admin-dasboard/purchasing/purchase-orders`: ใช้ `GET /api/purchase-orders`
- [x] `/admin-dasboard/reports/low-stock`: ใช้ `GET /api/reports/low-stock`
- [x] `/admin-dasboard/reports/snapshot`: ใช้ `GET /api/reports/snapshot/:date`
- [x] `/admin-dasboard/reports/turnover`: ใช้ `GET /api/reports/turnover`
- [x] `/admin-dasboard/reports/aging`: ใช้ `GET /api/reports/aging`
- [x] `/admin-dasboard/reports/dead-stock`: ใช้ `GET /api/reports/dead-stock`
- [x] `/admin-dasboard/reports/profit`: ใช้ `GET /api/reports/profit-summary`
- [x] `/admin-dasboard/reports/price-cost-anomalies`: ใช้ `GET /api/reports/price-cost-anomalies`

### ยังต้อง integrate เพิ่ม (เป็น placeholder)
- [x] `/admin-dasboard/orders`: ผูก `useOrdersQuery` + `useUpdateOrderStatusMutation`
- [x] `/admin-dasboard/order-management`: ผูก order workflow (`reserve/release/commit`)
- [x] `/admin-dasboard/promotions`: ผูก `usePromotionsQuery` + `useTogglePromotionMutation`
- [x] `/admin-dasboard/promotions/validate-coupon`: ผูก `useValidateCouponMutation`
- [x] `/admin-dasboard/pricing/price-lists`: ผูก `usePriceListsQuery` + `useCreatePriceListMutation`
- [x] `/admin-dasboard/stock-control/transfers`: ผูก `useStockTransfersQuery` + workflow mutations
- [x] `/admin-dasboard/stock-control/cycle-count`: ผูก `useCycleCountsQuery` + `useCreateCycleCountMutation` + `useCloseCycleCountMutation`
- [x] `/admin-dasboard/admin/users`: ผูก `useAdminUsersQuery` + `useToggleAdminUserStatusMutation`
- [x] `/admin-dasboard/admin/audit-logs`: ผูก `useAuditLogsQuery`
- [x] `/admin-dasboard/admin/approvals`: ผูก `useApprovalsQuery` + approve/reject
- [ ] `/admin-dasboard/analytics`: ต้องนิยาม API source (ยังไม่ผูก)
- [ ] `/admin-dasboard/customers`: ต้องนิยาม API source (ยังไม่ผูก)
- [ ] `/admin-dasboard/settings/general`: ต้องนิยาม settings API source
- [ ] `/admin-dasboard/settings/reports`: ต้องนิยาม report settings API source

## 4) Checklist รายการที่ต้องเช็กทุกหน้าตอน Integration

- [ ] ใช้ hook จาก `features/inventory/hooks/*` หรือ API service ที่มีอยู่แล้ว (ห้ามยิง fetch ตรงกระจัดกระจาย)
- [ ] query key ถูกต้องและ invalidate ครบหลัง mutation
- [ ] map request payload ตรง DTO backend (field name + enum exact)
- [ ] loading/empty/error state แสดงครบ
- [ ] filter/sort/page state sync กับ query params ที่ backend รองรับจริง
- [ ] ไม่ hardcode endpoint ซ้ำใน page (ใช้ API layer กลางเท่านั้น)
- [ ] จัดการ auth token/refresh ตาม backoffice auth flow
- [ ] ตรวจ role-based UI guard ให้สอดคล้องสิทธิ์ endpoint
- [ ] แจ้ง error จาก API (ไม่กลืน error)
- [ ] test ด้วย base URL 2 แบบ (`http://host` และ `http://host/api`) เพื่อกัน regression `/api/api`
