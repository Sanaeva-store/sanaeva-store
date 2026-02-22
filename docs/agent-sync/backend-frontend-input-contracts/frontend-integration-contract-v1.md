# Frontend Integration Contract (Backoffice API) [TH]

_Effective date: 2026-02-22_

## 1) Base Contract

- Base URL: `/api`
- Auth: `Authorization: Bearer <accessToken>`
- Global error shape: `{ code, message, requestId }`
- Swagger source of truth: `/api/docs`

## 2) Menu -> Endpoint Contract

## Dashboard

- `GET /api/orders/summary`
- `GET /api/reports/low-stock`
- `GET /api/reports/dashboard-summary`

## Auth / Session

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/sessions`

## Catalog

- `GET /api/catalog/products`
- `POST /api/catalog/products`
- `GET /api/catalog/products/:id`
- `PATCH /api/catalog/products/:id`
- `DELETE /api/catalog/products/:id`
- `POST /api/catalog/products/:productId/variants`
- `GET /api/catalog/products/:productId/variants`
- `GET /api/catalog/products/:productId/variants/:variantId`
- `PATCH /api/catalog/products/:productId/variants/:variantId`
- `DELETE /api/catalog/products/:productId/variants/:variantId`
- `POST /api/catalog/products/:productId/images`
- `GET /api/catalog/products/:productId/images`
- `PATCH /api/catalog/products/:productId/images/:imageId`
- `DELETE /api/catalog/products/:productId/images/:imageId`

## Inventory

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

## Suppliers + Purchase Orders

- Suppliers
  - `GET /api/suppliers`
  - `POST /api/suppliers`
  - `GET /api/suppliers/:id`
  - `PATCH /api/suppliers/:id`
  - `PATCH /api/suppliers/:id/status`
- Purchase Orders
  - `GET /api/purchase-orders`
  - `POST /api/purchase-orders`
  - `GET /api/purchase-orders/:id`
  - `PATCH /api/purchase-orders/:id/approve`
  - `PATCH /api/purchase-orders/:id/send`
  - `POST /api/purchase-orders/:id/receive`
  - `PATCH /api/purchase-orders/:id/cancel`

## Orders

- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/reserve`
- `POST /api/orders/:id/release`
- `POST /api/orders/:id/commit`
- `PATCH /api/orders/:id/status`

## Reports

- `GET /api/reports/low-stock`
- `GET /api/reports/snapshot/:date`
- `GET /api/reports/turnover`
- `GET /api/reports/aging`
- `GET /api/reports/dead-stock`
- `GET /api/reports/profit-summary`
- `GET /api/reports/profit-by-sku`
- `GET /api/reports/profit-by-category`
- `GET /api/reports/profit-by-order/:id`
- `GET /api/reports/dashboard-summary`
- `GET /api/reports/price-cost-anomalies`

## Promotions

- `GET /api/promotions`
- `POST /api/promotions`
- `GET /api/promotions/:id`
- `PATCH /api/promotions/:id`
- `POST /api/promotions/:id/toggle`
- `POST /api/promotions/simulate`
- `POST /api/promotions/validate-coupon`
- `POST /api/promotions/calculate-discount`
- `GET /api/promotions/:id/stacking-rules`
- `POST /api/promotions/:id/stacking-rules`

## Admin + Security

- Admin Users
  - `GET /api/admin-users`
  - `GET /api/admin-users/:id`
  - `GET /api/admin-users/permissions/matrix`
  - `POST /api/admin-users/:id/roles`
  - `DELETE /api/admin-users/:id/roles/:roleCode`
  - `PATCH /api/admin-users/:id/status`
- Audit Logs
  - `GET /api/audit-logs`
  - `GET /api/audit-logs/:id`
- Approvals
  - `GET /api/approvals`
  - `POST /api/approvals`
  - `GET /api/approvals/:id`
  - `POST /api/approvals/:id/approve`
  - `POST /api/approvals/:id/reject`

## Stock Transfers + Cycle Count

- Stock Transfers
  - `GET /api/stock-transfers`
  - `POST /api/stock-transfers`
  - `GET /api/stock-transfers/:id`
  - `POST /api/stock-transfers/:id/approve`
  - `POST /api/stock-transfers/:id/ship`
  - `POST /api/stock-transfers/:id/receive`
  - `POST /api/stock-transfers/:id/complete`
  - `POST /api/stock-transfers/:id/cancel`
- Cycle Count
  - `GET /api/cycle-count`
  - `POST /api/cycle-count`
  - `GET /api/cycle-count/:id`
  - `POST /api/cycle-count/:id/count`
  - `POST /api/cycle-count/:id/close`

## Pricing

- `GET /api/catalog/price-lists`
- `POST /api/catalog/price-lists`
- `GET /api/catalog/price-lists/:id`
- `PATCH /api/catalog/price-lists/:id`
- `GET /api/catalog/price-lists/:id/items`
- `POST /api/catalog/price-lists/:id/items`

## 3) Contract Status — v1.1 LOCKED ✅

All endpoints are implemented. Contract v1.1 is frozen as of **2026-02-22**.

### New endpoints added (2026-02-22)

| Method   | Path                                                   | Roles                                   | Description                                                                         |
| -------- | ------------------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------------------------- |
| `DELETE` | `/api/catalog/products/:id`                            | `SUPER_ADMIN`                           | Soft delete product (`status=INACTIVE`)                                             |
| `GET`    | `/api/catalog/products/:productId/variants/:variantId` | Authenticated backoffice roles          | Fetch a single SKU by ID (404 if not under product)                                 |
| `POST`   | `/api/catalog/products/:productId/images`              | `STORE_MANAGER`, `SUPER_ADMIN`          | Create product image (`url`, optional `sortOrder`)                                  |
| `GET`    | `/api/catalog/products/:productId/images`              | Authenticated backoffice roles          | List product images sorted by `sortOrder`                                           |
| `PATCH`  | `/api/catalog/products/:productId/images/:imageId`     | `STORE_MANAGER`, `SUPER_ADMIN`          | Update image URL or sort order                                                      |
| `DELETE` | `/api/catalog/products/:productId/images/:imageId`     | `STORE_MANAGER`, `SUPER_ADMIN`          | Delete product image (`204 No Content`)                                             |
| `POST`   | `/api/inventory/putaway/:grnId`                        | `SUPER_ADMIN`, `STORE_MANAGER`, `STAFF` | Mark GRN putaway as completed                                                       |
| `POST`   | `/api/promotions/validate-coupon`                      | STAFF+                                  | Validates a single coupon; returns `valid`, `reason`, `discount`, `finalTotal`      |
| `POST`   | `/api/promotions/calculate-discount`                   | STAFF+                                  | Calculates multi-coupon discount breakdown (contract-aligned alias of `/simulate`)  |
| `GET`    | `/api/reports/price-cost-anomalies`                    | STORE_MANAGER, SUPER_ADMIN              | Returns SKUs with MISSING_COST, COST_EXCEEDS_PRICE, ZERO_MARGIN, or BELOW_THRESHOLD |

### Inventory integration note (Frontend)

- Inventory is ledger-based (command/query), not editable transaction CRUD.
- Frontend must not expect update/delete transaction endpoints.
