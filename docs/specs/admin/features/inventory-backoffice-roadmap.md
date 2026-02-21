# Backoffice Inventory Frontend Roadmap

**Status**: 🔄 WIP  
**Priority**: High  
**Last Updated**: 2026-02-21

## Overview

เอกสารนี้สรุปรายการเมนูและหน้าจอ Back Office Inventory ที่ฝั่ง frontend ต้องพัฒนาให้สอดคล้องกับ API ที่พร้อมใช้งานใน `sanaeva-store-api` ณ ปัจจุบัน

## Backend Alignment (Current)

อ้างอิงสถานะจาก:
- `sanaeva-store-api/docs/agent-requirements/backoffice-stock-management/README.md`
- `sanaeva-store-api/docs/agent-requirements/backoffice-stock-management/api-endpoint-checklist.md`
- `sanaeva-store-api/docs/api/inventory.md`
- `sanaeva-store-api/docs/api/catalog.md`
- `sanaeva-store-api/docs/api/suppliers.md`
- `sanaeva-store-api/docs/api/reports.md`

### API Readiness Summary

| Area | API Status | Frontend Status Target |
|------|------------|------------------------|
| Product + SKU Master | ✅ Ready | Build now |
| Initial Stock | ✅ Ready | Build now |
| Stock Adjustment | ✅ Ready | Build now |
| Goods Receiving | ✅ Ready | Build now |
| Low Stock (Inventory + Reports) | ✅ Ready | Build now |
| Inventory Transactions | ✅ Ready | Build now |
| Suppliers | 🔄 Partial (CRUD ready, no active/inactive) | Build now (with limited status flow) |
| Reservation/Commit via Orders | ⬜ Pending | Coming soon |
| Purchase Orders | ⬜ Pending | Coming soon |
| Advanced Inventory Reports | ⬜ Pending | Coming soon |

## Menu Structure (Proposed)

1. `Inventory Dashboard`
2. `Products & SKUs`
3. `Initial Stock`
4. `Stock Adjustment`
5. `Goods Receiving`
6. `Low Stock Alerts`
7. `Stock Transactions`
8. `Suppliers`
9. `Orders Allocation` (Coming Soon)
10. `Purchase Orders` (Coming Soon)
11. `Advanced Reports` (Coming Soon)

## Screen Specifications

### 1) Inventory Dashboard

- Goal: สรุปภาพรวมคลังและจุดเสี่ยง
- APIs:
  - `GET /api/inventory/low-stock`
  - `GET /api/reports/low-stock`
  - `GET /api/inventory/transactions` (latest activity)
- UI Blocks:
  - KPI cards (low-stock count, inbound today, adjustments today)
  - low-stock preview table
  - recent stock activity timeline

### 2) Products & SKUs

- Goal: จัดการ master data สินค้า/variant
- APIs:
  - `POST/GET/PATCH /api/catalog/products`
  - `POST/GET/PATCH/DELETE /api/catalog/products/:productId/variants`
- UI Blocks:
  - products list + search/filter/status
  - product detail + variants table
  - create/edit product modal or page
  - add/edit/deactivate variant flow

### 3) Initial Stock

- Goal: ตั้ง stock ตั้งต้นตาม warehouse/location
- APIs:
  - `POST /api/inventory/initialize`
  - `GET /api/inventory/balance/:variantId`
- UI Blocks:
  - initialize form (variant, warehouse, qty, note, idempotency key)
  - result/receipt panel
  - quick balance lookup

### 4) Stock Adjustment

- Goal: ปรับเพิ่ม/ลดสต๊อกแบบ traceable
- API:
  - `POST /api/inventory/adjust`
- UI Blocks:
  - adjustment form (qty, reason code, note, idempotency key)
  - validation/error state (e.g. insufficient available stock)

### 5) Goods Receiving

- Goal: รับสินค้าเข้าแบบ batch
- API:
  - `POST /api/inventory/receive`
- UI Blocks:
  - receiving header (warehouse, PO ref, invoice)
  - multi-row item editor
  - submit summary and receipt result

### 6) Low Stock Alerts

- Goal: ช่วยวางแผนเติมสินค้า
- APIs:
  - `GET /api/inventory/low-stock`
  - `GET /api/reports/low-stock`
- UI Blocks:
  - filter by warehouse
  - low-stock table (available, reorder point, shortage/deficit)
  - export action (phase ถัดไป)

### 7) Stock Transactions

- Goal: ตรวจสอบย้อนหลังทุก movement
- API:
  - `GET /api/inventory/transactions`
- UI Blocks:
  - transaction table (paginated)
  - filters: variant, warehouse, type, date range
  - detail drawer (before/after qty, reason, actor, reference)

### 8) Suppliers

- Goal: จัดการ supplier master ก่อนเข้า PO phase
- APIs:
  - `POST /api/suppliers`
  - `GET /api/suppliers`
  - `GET /api/suppliers/:id`
  - `PATCH /api/suppliers/:id`
- UI Blocks:
  - supplier list (pagination)
  - create/edit supplier form
  - supplier detail panel

## Coming Soon (Backend Pending)

1. `Orders Allocation`
- ต้องรอ:
  - `POST /api/orders/:id/reserve`
  - `POST /api/orders/:id/release`
  - `POST /api/orders/:id/commit`
  - `PATCH /api/orders/:id/status`

2. `Purchase Orders`
- ต้องรอ purchase order endpoints และ PO lifecycle

3. `Advanced Reports`
- ต้องรอ:
  - `/api/reports/snapshot/:date`
  - `/api/reports/turnover`
  - `/api/reports/aging`
  - `/api/reports/dead-stock`

## Delivery Plan (Frontend)

### Phase A (Build Now)

1. Inventory Dashboard
2. Products & SKUs
3. Initial Stock
4. Stock Adjustment
5. Goods Receiving

### Phase B (Build Now)

1. Low Stock Alerts
2. Stock Transactions
3. Suppliers

### Phase C (Backend Ready Then Build)

1. Orders Allocation
2. Purchase Orders
3. Advanced Reports

## Definition of Done (Frontend)

- ทุกหน้าใน Phase A/B มี loading, empty, error state
- ทุก mutation flow รองรับ idempotency key ในจุดที่ API ต้องการ
- role-based UI visibility สอดคล้อง role matrix (`SUPER_ADMIN`, `STORE_MANAGER`, `INVENTORY_STAFF`)
- query keys และ cache invalidation แยกตามโมดูลอย่างชัดเจน
- critical paths มี test coverage ตามความเหมาะสม (unit + integration)
