# Frontend Implementation Task Checklist (Contract v1.1)

_Based on: `frontend-integration-contract-v1.md` — Effective 2026-02-22_

---

## Legend
- [ ] Not started
- [x] Done / stub page created
- [~] In progress / partial

---

## Dashboard

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `GET /api/orders/summary` | `/admin-dasboard` (dashboard overview) |
| [x] | `GET /api/reports/low-stock` | `/admin-dasboard` (dashboard overview) |
| [x] | `GET /api/reports/dashboard-summary` | `/admin-dasboard` (dashboard overview) |

---

## Auth / Session

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [~] | `POST /api/auth/login` | Login page _(API layer ready — `backoffice-auth.api.ts`)_ |
| [~] | `POST /api/auth/refresh` | Token refresh (middleware) _(API layer ready)_ |
| [~] | `POST /api/auth/logout` | Logout action _(API layer ready)_ |
| [~] | `GET /api/auth/me` | Current user context _(API layer ready)_ |
| [~] | `GET /api/auth/sessions` | Sessions management _(API layer ready)_ |

---

## Catalog

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `GET /api/catalog/products` | `/admin-dasboard/inventory/products` (live, connected) |
| [x] | `POST /api/catalog/products` | Create product form (`/admin-dasboard/inventory/products/new`) |
| [x] | `GET /api/catalog/products/:id` | Product detail page (`/admin-dasboard/inventory/products/[id]`) |
| [ ] | `PATCH /api/catalog/products/:id` | Edit product form |
| [ ] | `DELETE /api/catalog/products/:id` | Delete product action (SUPER_ADMIN) |
| [ ] | `POST /api/catalog/products/:productId/variants` | Create variant |
| [ ] | `GET /api/catalog/products/:productId/variants` | Variant list |
| [ ] | `GET /api/catalog/products/:productId/variants/:variantId` | Variant detail |
| [ ] | `PATCH /api/catalog/products/:productId/variants/:variantId` | Edit variant |
| [ ] | `DELETE /api/catalog/products/:productId/variants/:variantId` | Delete variant |
| [ ] | `POST /api/catalog/products/:productId/images` | Upload product image |
| [ ] | `GET /api/catalog/products/:productId/images` | Product image list |
| [ ] | `PATCH /api/catalog/products/:productId/images/:imageId` | Edit image |
| [ ] | `DELETE /api/catalog/products/:productId/images/:imageId` | Delete image |

---

## Inventory

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `POST /api/inventory/initialize` | `/admin-dasboard/inventory/initial-stock` |
| [x] | `POST /api/inventory/adjust` | `/admin-dasboard/inventory/adjustment` |
| [x] | `POST /api/inventory/receive` | `/admin-dasboard/inventory/receiving` |
| [ ] | `GET /api/inventory/balance/:variantId` | Balance lookup (inline / detail) |
| [ ] | `GET /api/inventory/balance/:variantId/by-location` | Balance by location |
| [x] | `GET /api/inventory/low-stock` | `/admin-dasboard/inventory/low-stock` |
| [ ] | `GET /api/inventory/reorder-suggestions` | Reorder suggestions view |
| [x] | `GET /api/inventory/transactions` | `/admin-dasboard/inventory/transactions` |
| [ ] | `GET /api/inventory/receiving/:grnId/discrepancies` | GRN discrepancies view |
| [ ] | `POST /api/inventory/putaway/:grnId` | Putaway action |
| [ ] | `GET /api/inventory/lots` | Lot management view |

---

## Suppliers + Purchase Orders

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `GET /api/suppliers` | `/admin-dasboard/purchasing/suppliers` (stub) |
| [ ] | `POST /api/suppliers` | Create supplier form |
| [ ] | `GET /api/suppliers/:id` | Supplier detail |
| [ ] | `PATCH /api/suppliers/:id` | Edit supplier |
| [ ] | `PATCH /api/suppliers/:id/status` | Toggle supplier status |
| [x] | `GET /api/purchase-orders` | `/admin-dasboard/purchasing/purchase-orders` (stub) |
| [ ] | `POST /api/purchase-orders` | Create PO form |
| [ ] | `GET /api/purchase-orders/:id` | PO detail |
| [ ] | `PATCH /api/purchase-orders/:id/approve` | Approve PO action |
| [ ] | `PATCH /api/purchase-orders/:id/send` | Send PO action |
| [ ] | `POST /api/purchase-orders/:id/receive` | Receive PO action |
| [ ] | `PATCH /api/purchase-orders/:id/cancel` | Cancel PO action |

---

## Orders

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `GET /api/orders` | `/admin-dasboard/orders` (stub) |
| [ ] | `POST /api/orders` | Create order form |
| [ ] | `GET /api/orders/:id` | Order detail |
| [ ] | `POST /api/orders/:id/reserve` | Reserve stock action |
| [ ] | `POST /api/orders/:id/release` | Release stock action |
| [ ] | `POST /api/orders/:id/commit` | Commit order action |
| [ ] | `PATCH /api/orders/:id/status` | Update order status |

---

## Reports

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `GET /api/reports/low-stock` | `/admin-dasboard/reports/low-stock` (stub) |
| [x] | `GET /api/reports/snapshot/:date` | `/admin-dasboard/reports/snapshot` (stub) |
| [x] | `GET /api/reports/turnover` | `/admin-dasboard/reports/turnover` (stub) |
| [x] | `GET /api/reports/aging` | `/admin-dasboard/reports/aging` (stub) |
| [x] | `GET /api/reports/dead-stock` | `/admin-dasboard/reports/dead-stock` (stub) |
| [x] | `GET /api/reports/profit-summary` | `/admin-dasboard/reports/profit` (stub) |
| [ ] | `GET /api/reports/profit-by-sku` | Profit by SKU view |
| [ ] | `GET /api/reports/profit-by-category` | Profit by category view |
| [ ] | `GET /api/reports/profit-by-order/:id` | Profit by order view |
| [x] | `GET /api/reports/dashboard-summary` | Dashboard overview |
| [x] | `GET /api/reports/price-cost-anomalies` | `/admin-dasboard/reports/price-cost-anomalies` (stub) |

---

## Promotions

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `GET /api/promotions` | `/admin-dasboard/promotions` (stub) |
| [ ] | `POST /api/promotions` | Create promotion form |
| [ ] | `GET /api/promotions/:id` | Promotion detail |
| [ ] | `PATCH /api/promotions/:id` | Edit promotion |
| [ ] | `POST /api/promotions/:id/toggle` | Toggle promotion active |
| [ ] | `POST /api/promotions/simulate` | Simulate discount |
| [x] | `POST /api/promotions/validate-coupon` | `/admin-dasboard/promotions/validate-coupon` (stub) |
| [ ] | `POST /api/promotions/calculate-discount` | Calculate discount tool |
| [ ] | `GET /api/promotions/:id/stacking-rules` | Stacking rules view |
| [ ] | `POST /api/promotions/:id/stacking-rules` | Create stacking rule |

---

## Admin + Security

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `GET /api/admin-users` | `/admin-dasboard/admin/users` (stub) |
| [ ] | `GET /api/admin-users/:id` | Admin user detail |
| [ ] | `GET /api/admin-users/permissions/matrix` | Permissions matrix view |
| [ ] | `POST /api/admin-users/:id/roles` | Assign role |
| [ ] | `DELETE /api/admin-users/:id/roles/:roleCode` | Remove role |
| [ ] | `PATCH /api/admin-users/:id/status` | Toggle admin user status |
| [x] | `GET /api/audit-logs` | `/admin-dasboard/admin/audit-logs` (stub) |
| [ ] | `GET /api/audit-logs/:id` | Audit log detail |
| [x] | `GET /api/approvals` | `/admin-dasboard/admin/approvals` (stub) |
| [ ] | `POST /api/approvals` | Create approval |
| [ ] | `GET /api/approvals/:id` | Approval detail |
| [ ] | `POST /api/approvals/:id/approve` | Approve action |
| [ ] | `POST /api/approvals/:id/reject` | Reject action |

---

## Stock Transfers + Cycle Count

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `GET /api/stock-transfers` | `/admin-dasboard/stock-control/transfers` (stub) |
| [ ] | `POST /api/stock-transfers` | Create transfer form |
| [ ] | `GET /api/stock-transfers/:id` | Transfer detail |
| [ ] | `POST /api/stock-transfers/:id/approve` | Approve transfer |
| [ ] | `POST /api/stock-transfers/:id/ship` | Ship transfer |
| [ ] | `POST /api/stock-transfers/:id/receive` | Receive transfer |
| [ ] | `POST /api/stock-transfers/:id/complete` | Complete transfer |
| [ ] | `POST /api/stock-transfers/:id/cancel` | Cancel transfer |
| [x] | `GET /api/cycle-count` | `/admin-dasboard/stock-control/cycle-count` (stub) |
| [ ] | `POST /api/cycle-count` | Create cycle count |
| [ ] | `GET /api/cycle-count/:id` | Cycle count detail |
| [ ] | `POST /api/cycle-count/:id/count` | Submit count |
| [ ] | `POST /api/cycle-count/:id/close` | Close cycle count |

---

## Pricing

| Status | Endpoint | Page / Feature |
|--------|----------|----------------|
| [x] | `GET /api/catalog/price-lists` | `/admin-dasboard/pricing/price-lists` (stub) |
| [ ] | `POST /api/catalog/price-lists` | Create price list |
| [ ] | `GET /api/catalog/price-lists/:id` | Price list detail |
| [ ] | `PATCH /api/catalog/price-lists/:id` | Edit price list |
| [ ] | `GET /api/catalog/price-lists/:id/items` | Price list items |
| [ ] | `POST /api/catalog/price-lists/:id/items` | Add item to price list |

---

## UI / Infrastructure

| Status | Task |
|--------|------|
| [x] | Language switcher visible in AdminNavbar |
| [x] | Shared `DatePicker` component (shadcn Calendar + Popover, Thai timezone `Asia/Bangkok`) |
| [x] | Date filters in Transactions page use `DatePicker` |
| [x] | Expiry date in Receiving page uses `DatePicker` |
| [x] | Sidebar expanded with all contract sections |
| [x] | API layer: feature hooks for all new sections |
| [ ] | Auth guard / role-based access per endpoint |
