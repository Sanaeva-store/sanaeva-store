# Changelog

All notable changes to this project are documented in this file.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/) — not yet tagged; all changes are on `develop`.

---

## [Unreleased] — `develop` branch

### 2026-02-22

#### Fixed — Role Alias Compatibility (`STAFF` ↔ `INVENTORY_STAFF`)

To prevent frontend integration `403` caused by role naming inconsistency across endpoints, `RolesGuard` now normalizes role aliases:

- Required `STAFF` accepts users with `INVENTORY_STAFF`
- Required `INVENTORY_STAFF` accepts users with `STAFF`

Changes:

- `src/auth/guards/roles.guard.ts` — added alias expansion before role match
- `src/auth/guards/roles.guard.spec.ts` — added guard unit tests covering both alias directions and deny path

#### Added — Product/SKU/Image management (Tasks 1–3, 5, 7, 8)

Implemented the remaining catalog endpoints from the Product-SKU-Stock implementation plan.

**Product Soft Delete — `DELETE /api/catalog/products/:id`** (Roles: `SUPER_ADMIN`)

- Sets `Product.status = INACTIVE`; record is retained for audit
- Audit log action: `PRODUCT_DEACTIVATED` with `{ title }`
- Returns updated `ProductResponseDto`

**SKU Get-by-Id — `GET /api/catalog/products/:productId/variants/:variantId`** (Roles: All authenticated)

- Returns `VariantResponseDto`; 404 when not found or belongs to another product

**Product Image CRUD — URL mode** (Roles: `SUPER_ADMIN`, `STORE_MANAGER`)

- `POST   /api/catalog/products/:productId/images` — add image with URL + sortOrder
- `GET    /api/catalog/products/:productId/images` — list images ordered by `sortOrder asc, id asc`
- `PATCH  /api/catalog/products/:productId/images/:imageId` — update url or sortOrder
- `DELETE /api/catalog/products/:productId/images/:imageId` — hard-delete image record
- Audit logs: `PRODUCT_IMAGE_CREATED`, `PRODUCT_IMAGE_UPDATED`, `PRODUCT_IMAGE_DELETED`
- New DTOs: `CreateProductImageDto`, `UpdateProductImageDto`, `ProductImageResponseDto`

**ProductResponseDto updated**

- `images: ProductImageResponseDto[]` added (sorted by `sortOrder asc`)
- Backward-compatible; existing fields unchanged

**Authorization matrix aligned**

- `DELETE /catalog/products/:id` — `SUPER_ADMIN` only (was missing)
- `DELETE /catalog/products/:productId/variants/:variantId` — corrected to `SUPER_ADMIN` only
- Image mutations — `SUPER_ADMIN`, `STORE_MANAGER`

**Test coverage**

- 19 unit tests in `catalog.service.spec.ts` (all pass); all 228 suite tests pass
- New cases: `deactivateProduct` (success + 404), `getVariant` (success + wrong product), image CRUD (success + 404 paths)

---

#### Added — PBI-017/018 Gap Endpoints (contract v1 complete)

Implemented the final 3 backoffice endpoint gaps to lock contract v1 for frontend handoff.

**`POST /api/promotions/validate-coupon`** (Roles: STAFF+)

- New `ValidateCouponDto` (`code`, `subtotal`, `userId?`) with full class-validator decorators
- New `CouponValidationResultDto` response: `{ valid, code, reason, discount, finalTotal }`
- Service method `PromotionsService.validateCoupon()` — validates expiry, active status, usage limits; returns structured result instead of throwing exceptions
- No coupon is consumed; safe to call during cart preview

**`POST /api/promotions/calculate-discount`** (Roles: STAFF+)

- New `CalculateDiscountDto` (`codes[]`, `subtotal`, `userId?`)
- Service method `PromotionsService.calculateDiscount()` — contract-aligned alias delegates to `simulate()` with stacking validation
- Returns same `{ breakdown, totalDiscount, finalTotal }` shape as `/simulate`

**`GET /api/reports/price-cost-anomalies`** (Roles: STORE_MANAGER, SUPER_ADMIN)

- Query param: `minMarginPct` (optional float, default 0)
- New `PriceCostAnomalyItemDto` + `PriceCostAnomalyReportDto` response DTOs
- Service method `ReportsService.getPriceCostAnomalies()` — scans active `ProductVariant` records, categorises anomalies:
  - `MISSING_COST` — cost is null or ≤ 0
  - `COST_EXCEEDS_PRICE` — cost ≥ price
  - `ZERO_MARGIN` — exact zero margin
  - `BELOW_THRESHOLD` — margin < `minMarginPct`

#### Fixed — Unit test providers for injected EventsService

- `src/orders/orders.service.spec.ts` — added `{ provide: EventsService, useValue: mockEvents }` provider
- `src/inventory/inventory.service.spec.ts` — same fix; all 218 tests now pass

#### Validation

```
pnpm build     → EXIT:0 ✅
npx jest --forceExit → 15/15 suites, 218/218 tests ✅
```

#### Added — Backoffice Readiness + Frontend Integration Docs

- `docs/agent-requirements/backoffice-stock-management/api-endpoint-checklist.md` — อัปเดต checklist endpoint จากโค้ดจริงล่าสุด
- `docs/agent-requirements/backoffice-dashboard/frontend-integration-contract-v1.md` — สัญญา integration สำหรับ frontend (menu -> endpoint)
- `docs/agent-requirements/backoffice-dashboard/today-delivery-plan-2026-02-22.md` — แผนปิดงานภายในวันนี้ + DoD + risk
- `docs/agent-requirements/backoffice-dashboard/copilot-full-flow-integration-prompt.md` — prompt สำเร็จรูปสำหรับสั่ง Copilot ปิด gap endpoint + อัปเดตเอกสาร contract หลังทำงานครบ

#### Fixed — Prisma Client Type Resolution

**Root cause**: `prisma/schema.prisma` was missing the `output` directive in its `generator client` block. When `pnpm prisma generate` ran it wrote the client to the pnpm store (`node_modules/.pnpm/@prisma+client@7.3.0_.../node_modules/@prisma/client`) rather than to `lib/generated/prisma/`. The hoisted `node_modules/@prisma/client` is only a thin proxy that re-exports from `.prisma/client/` — a directory that pnpm never populates in this layout. VS Code TypeScript therefore resolved `@prisma/client` to an empty/stale set of types, causing all nine errors below.

**Errors resolved:**

| #   | Error                                                                       |
| --- | --------------------------------------------------------------------------- |
| 1   | `Property 'priceList' does not exist on type 'PrismaService'`               |
| 2   | `Property 'pendingApproval' does not exist on type 'PrismaService'`         |
| 3   | `Property 'priceListItem' does not exist on type 'PrismaService'`           |
| 4   | `Property 'cycleCountSession' does not exist on type 'PrismaService'`       |
| 5   | `Property 'goodsReceiptDiscrepancy' does not exist on type 'PrismaService'` |
| 6   | `Property 'stockSnapshot' does not exist on type 'PrismaService'`           |
| 7   | `Module '"@prisma/client"' has no exported member 'PromotionType'`          |
| 8   | `Property 'promotion' does not exist on type 'PrismaService'`               |
| 9   | `Module '"@prisma/client"' has no exported member 'TransferStatus'`         |

**Changes made:**

- `prisma/schema.prisma` — Added `output = "../lib/generated/prisma"` to the `generator client` block so `prisma generate` always writes the full client to `lib/generated/prisma/`.
- `tsconfig.json` — Added `paths` alias `"@prisma/client": ["./lib/generated/prisma"]` so TypeScript (and VS Code IntelliSense) resolves `@prisma/client` imports to the correctly generated client.
- `pnpm prisma generate` re-run — Regenerated `lib/generated/prisma/` from the up-to-date `prisma/schema.prisma` (642 lines, all GAP models present).

**Validation:**

```bash
pnpm prisma generate   # → Generated to ./lib/generated/prisma ✅
pnpm build             # → EXIT:0 ✅
npx eslint "src/**/*.ts" --ignore-pattern "src/generated/**"  # → 0 errors ✅
```

**Models now available via `@prisma/client`:**

| Model / Enum                                                              | Introduced by |
| ------------------------------------------------------------------------- | ------------- |
| `StockSnapshot`                                                           | GAP-002       |
| `PendingApproval` · `ApprovalStatus`                                      | GAP-004       |
| `CycleCountSession` · `CycleCountItem`                                    | GAP-006       |
| `GoodsReceiptDiscrepancy`                                                 | GAP-007       |
| `Promotion` · `PromotionUsage` · `DiscountStackingRule` · `PromotionType` | GAP-021/022   |
| `PriceList` · `PriceListItem`                                             | GAP-024       |
| `TransferStatus`                                                          | GAP-005       |

---

### 2026-02-20

#### Added — Backoffice Dashboard Agent Requirements

- `docs/agent-requirements/backoffice-dashboard/README.md` — แผนรวมสำหรับ dashboard/backoffice implementation แบ่งเป็น 4 phase
- `docs/agent-requirements/backoffice-dashboard/phase-1-foundation.md` — Phase 1: Auth + Dashboard shell + menu พื้นฐาน
- `docs/agent-requirements/backoffice-dashboard/phase-2-catalog-inventory.md` — Phase 2: Catalog/Inventory/Suppliers พร้อม mapping หน้าจอและ endpoint
- `docs/agent-requirements/backoffice-dashboard/phase-3-orders-procurement.md` — Phase 3: Orders + Purchase Orders + reserve/commit flows
- `docs/agent-requirements/backoffice-dashboard/phase-4-reporting-admin-hardening.md` — Phase 4: Reports ขั้นสูง + Admin/RBAC + Audit Logs UI + hardening
- `docs/agent-requirements/backoffice-dashboard/security-checklist.md` — Security checklist สำหรับ gate ก่อน merge ในทุก phase

#### Added — Common Infrastructure

- `src/common/filters/http-exception.filter.ts` — Global `HttpExceptionFilter` normalizing all errors to `{ code, message, requestId }` shape.
- `src/common/interceptors/request-id.interceptor.ts` — `RequestIdInterceptor` generating and propagating `X-Request-Id` UUID header on every response.
- `src/common/decorators/current-user.decorator.ts` — `@CurrentUser()` param decorator for extracting `JwtPayload` from `request.user`.
- `src/common/decorators/roles.decorator.ts` — `@Roles(...roles)` metadata decorator for RBAC.
- `src/common/decorators/public.decorator.ts` — `@Public()` decorator to bypass `JwtAuthGuard` on open routes.
- `src/main.ts` — Full bootstrap: global `ValidationPipe` (whitelist + transform), `SwaggerModule` at `/api/docs`, CORS from `CORS_ORIGIN` env, global filter + interceptor, prefix `api`.

#### Added — AuthModule (PBI-001 partial)

- `src/auth/strategies/jwt.strategy.ts` — `passport-jwt` strategy validating `Authorization: Bearer` tokens using `BETTER_AUTH_SECRET`.
- `src/auth/guards/jwt-auth.guard.ts` — `JwtAuthGuard` extending `AuthGuard('jwt')`; respects `@Public()`.
- `src/auth/guards/roles.guard.ts` — `RolesGuard` checking `req.user.roles` against `@Roles()` metadata; returns `403` on mismatch.
- `src/auth/auth.module.ts` — Exports `JwtAuthGuard`, `RolesGuard`, `JwtModule`.
- `src/auth/auth.service.ts` — **Stub** — `login()`, `refresh()`, `logout()` throw `NotImplementedException` (full PBI-001 pending).
- `src/auth/auth.controller.ts` — Stub controller wiring stub service.

#### Added — AuditLogsModule

- `src/audit-logs/audit-logs.service.ts` — Global `AuditLogsService.log(action, entity, entityId, actorId, meta?)` writing to `AuditLog` Prisma table; errors swallowed silently.
- `src/audit-logs/audit-logs.module.ts` — `@Global()` module; exports `AuditLogsService` to all other modules.

#### Added — CatalogModule (PBI-002 ✅ Completed)

- `src/catalog/dto/` — `CreateProductDto`, `UpdateProductDto`, `ProductQueryDto`, `CreateVariantDto`, `UpdateVariantDto`, `ProductResponseDto` (+ `VariantResponseDto`, `PaginatedProductResponseDto`).
- `src/catalog/repositories/catalog.repository.ts` — `CatalogRepository` with full Product + Variant CRUD; enforces SKU/barcode uniqueness; `deactivateVariant` sets `isActive = false`.
- `src/catalog/catalog.service.ts` — Wraps repository; writes audit logs; maps `Decimal` to string for price/cost fields.
- `src/catalog/catalog.controller.ts` — 8 routes under `/api/catalog/products`; class-level `JwtAuthGuard + RolesGuard`.
- `src/catalog/catalog.module.ts`.

#### Added — InventoryModule (PBI-003/004/005/007/008 ✅ Completed)

- `src/inventory/dto/initialize-stock.dto.ts` — `InitializeStockDto` with idempotency key support.
- `src/inventory/dto/adjust-stock.dto.ts` — `AdjustStockDto` + `AdjustmentReason` enum (`DAMAGE · LOST · FOUND · MANUAL_CORRECTION`). Quantity must be non-zero.
- `src/inventory/dto/receive-goods.dto.ts` — `ReceiveGoodsDto` with nested `ReceiveGoodsItemDto[]`.
- `src/inventory/dto/stock-query.dto.ts` — `StockTxnQueryDto` (paginated, filterable by type/date/variant/warehouse) + `StockLevelQueryDto`.
- `src/inventory/dto/inventory-response.dto.ts` — `StockBalanceDto`, `InventoryTxnResponseDto`, `GoodsReceiptResponseDto`, `LowStockItemDto`, `PaginatedTxnResponseDto`.
- `src/inventory/repositories/inventory.repository.ts` — Ledger-based balance computation; idempotent initialize/adjust; atomic goods receiving (Prisma transaction creating `GoodsReceipt` + per-item `InventoryTxn`).
- `src/inventory/inventory.service.ts` — Orchestration + audit logging for all operations.
- `src/inventory/inventory.controller.ts` — 6 routes: `POST /initialize`, `POST /adjust`, `POST /receive`, `GET /balance/:variantId`, `GET /low-stock`, `GET /transactions`.
- `src/inventory/inventory.module.ts` — Exports `InventoryService`.

#### Added — SuppliersModule (PBI-013 🔄 Partial)

- `src/suppliers/dto/create-supplier.dto.ts`, `update-supplier.dto.ts`, `supplier-response.dto.ts`.
- `src/suppliers/suppliers.service.ts` — `create` (email-unique guard), `findAll` (paginated, sorted by name), `findOne` (404 if absent), `update` (email-unique guard + 404); all writes audit logs.
- `src/suppliers/suppliers.controller.ts` — 4 routes: `POST/GET/GET :id/PATCH :id` under `/api/suppliers`.
- `src/suppliers/suppliers.module.ts` — Exports `SuppliersService`.

#### Added — ReportsModule (PBI-007/015 partial)

- `src/reports/dto/reports-response.dto.ts` — `LowStockReportItemDto`, `LowStockReportDto`.
- `src/reports/reports.service.ts` — Delegates to `InventoryService.getLowStockItems()`.
- `src/reports/reports.controller.ts` — `GET /api/reports/low-stock?warehouseId=`.
- `src/reports/reports.module.ts` — Imports `InventoryModule`.

#### Added — Stub Modules

- `src/orders/orders.module.ts` — Stub for PBI-006 (requires `Order`/`OrderItem` schema first).
- `src/stock-transfers/stock-transfers.module.ts` — Stub for PBI-010.

#### Changed — Prisma Schema

| Change                                                                           | Migration                                |
| -------------------------------------------------------------------------------- | ---------------------------------------- |
| Added `ProductStatus` enum (`DRAFT · ACTIVE · INACTIVE`)                         | `20260220133352_init_with_sku_support`   |
| `Product.status` changed from `String` to `ProductStatus @default(DRAFT)`        | `20260220133352_init_with_sku_support`   |
| `ProductVariant.barcode String? @unique`                                         | `20260220133352_init_with_sku_support`   |
| `ProductVariant.reorderPoint Int @default(0)`                                    | `20260220133352_init_with_sku_support`   |
| `InventoryTxn.beforeQty`, `.afterQty`, `.reasonCode`, `.idempotencyKey @unique`  | `20260220133352_init_with_sku_support`   |
| `Supplier.createdAt DateTime @default(now())` + `.updatedAt DateTime @updatedAt` | `20260220143122_add_supplier_timestamps` |

#### Changed — AppModule

- Registered: `ConfigModule` (global), `PrismaModule`, `AuditLogsModule`, `AuthModule`, `CatalogModule`, `InventoryModule`, `SuppliersModule`, `OrdersModule`, `ReportsModule`.

#### Fixed

- `src/suppliers/suppliers.service.ts` — Prisma `select` was missing `createdAt`/`updatedAt` fields; caused `TS2345` build errors after `Supplier` timestamps migration.

#### Dependencies Added

| Package             | Version | Purpose                       |
| ------------------- | ------- | ----------------------------- |
| `@nestjs/jwt`       | latest  | JWT module                    |
| `@nestjs/passport`  | latest  | Passport integration          |
| `passport`          | latest  | Auth middleware               |
| `passport-jwt`      | latest  | JWT strategy                  |
| `passport-local`    | latest  | Local strategy (future use)   |
| `@nestjs/swagger`   | latest  | OpenAPI/Swagger UI            |
| `class-validator`   | latest  | DTO validation decorators     |
| `class-transformer` | latest  | DTO transformation            |
| `@nestjs/config`    | latest  | Config / env module           |
| `@nestjs/throttler` | latest  | Rate limiting (future use)    |
| `bcrypt`            | latest  | Password hashing (future use) |

---

## Known Limitations / Pending Work

- **PBI-001** — `AuthService` is a stub; login/refresh/logout throw `501`. Requires Better Auth integration.
- **PBI-006** — `OrdersModule` is a stub; no `Order`/`OrderItem` schema. Stock reservation/commit flow not implemented.
- **PBI-013** — Supplier CRUD done; PO lifecycle (DRAFT→APPROVED→SENT→PARTIAL→CLOSED), PO-linked receiving, and partial receiving across multiple rounds are pending.
- **PBI-015** — Low-stock report live; EoD snapshots, turnover/aging/dead-stock, and query index tuning are pending.
- `productName` and `warehouseName` fields in `LowStockReportDto` return empty string — product/warehouse join enrichment is a planned enhancement.
