# Specification Index

This index provides a complete overview of all technical specifications, features, and requirements for Sanaeva Store project.

## 📂 Quick Navigation

- [Main README](./README.md) - Overview and getting started
- [UI-First Master Plan](./ui-first-master-plan.md) - Unified UI-first roadmap + Zustand/state architecture plan
- [UI-First Execution Checklist](./ui-first-execution-checklist.md) - 4-week actionable execution checklist
- [Charting Strategy](./charting-strategy.md) - Recharts engine + shadcn wrapper conventions
- [Admin Dashboard](./admin/) - Back office specifications
- [Storefront](./store-front/) - Customer-facing specifications
- [Storefront Frontend Phase Plan](../agent-requirements/storefront-frontend/README.md) - Timeline and execution plan

## 📊 Admin Dashboard Specs

### Features
- ✅ [Overview](./admin/features/overview.md) - Dashboard and KPIs
- 🔄 [Inventory Backoffice Roadmap](./admin/features/inventory-backoffice-roadmap.md) - Frontend menu/screen plan aligned with active backend APIs
- 📋 [Orders](./admin/features/orders.md) - Order status, tracking, and fulfillment operations
- 📋 [Products](./admin/features/products.md) - Product/SKU/inventory administration
- 📋 [Analytics](./admin/features/analytics.md) - Sales and operational reporting
- 📋 [Marketing & Growth](./admin/features/marketing-growth.md) - Promotion and loyalty operations

### Requirements
- 📋 [Authentication](./admin/requirements/auth.md) - Auth & authorization
- 📋 [Permissions](./admin/requirements/permissions.md) - RBAC
- 📋 [Data Validation](./admin/requirements/data-validation.md) - Input validation

### Architecture
- 🔄 [Overview](./admin/architecture/overview.md) - System architecture
- 🔄 [Order Flow](./admin/architecture/order-flow.md) - Order management flow
- 📋 Planned: `data-model.md`, `api-routes.md`

## 🛒 Storefront Specs

### Design System
- ✅ [Ecommerce UI Instructions](../agent-requirements/storefront-frontend/ECOMMERCE-UI-INSTRUCTION.md) - Design tokens, responsive patterns, Framer Motion/embla-carousel usage, next/image policy, and page-specific guidance

### Features
- 🔄 [Modern Storefront Experience](./store-front/features/modern-storefront-experience.md) - Landing and shopping pages with modern UX and backend phase alignment
- 📋 [Landing & Home](./store-front/features/landing-home.md) - Homepage structure and conversion-focused sections
- 📋 [Product Catalog](./store-front/features/product-catalog.md) - Product browsing
- 📋 [Product Detail Page](./store-front/features/product-detail-page.md) - Variants, reviews, and sharing
- 📋 [Shopping Cart](./store-front/features/shopping-cart.md) - Cart management and pricing summary
- 📋 [Checkout](./store-front/features/checkout.md) - Checkout flow and order placement
- 📋 [Search & Filters](./store-front/features/search.md) - Advanced search, filtering, and sorting
- 📋 [User Account](./store-front/features/user-account.md) - Signup/login/profile/address book
- 📋 [Order History](./store-front/features/order-history.md) - Customer order tracking and history
- 📋 [Wishlist](./store-front/features/wishlist.md) - Saved items and later purchase flow
- 📋 [Marketing & Growth](./store-front/features/marketing-growth.md) - Promotions, loyalty, and content growth
- 📋 [Modern & Advanced](./store-front/features/modern-advanced.md) - Chat, PWA, multi-language/currency, affiliate

### Requirements
- 📋 [Requirements Index](./store-front/requirements/README.md) - Requirement source and planned files
- 📋 [Authentication](./store-front/requirements/auth.md) - Email/phone/social authentication
- 📋 [Payments](./store-front/requirements/payments.md) - Payment channel and checkout requirements
- 📋 [Responsive](./store-front/requirements/responsive.md) - Device and layout requirements
- 📋 [Performance](./store-front/requirements/performance.md) - Speed and monitoring requirements
- 📋 [SEO](./store-front/requirements/seo.md) - Metadata and indexing requirements
- 📋 [Security & Compliance](./store-front/requirements/security-compliance.md) - SSL, GDPR/PDPA, cookie/privacy

### Architecture
- 📋 [Overview](./store-front/architecture/overview.md) - Frontend architecture
- 📋 Planned: `components.md`, `state-management.md`, `routing.md`

## 📝 Template & Guidelines

- [Feature Template](./_templates/feature-template.md) - Template for feature specs

## 📈 Status Summary

| Section | Total | Done | WIP | Planned |
|---------|-------|------|------|--------|
| Admin Features | 6 | 1 | 0 | 5 |
| Admin Requirements | 3 | 0 | 0 | 3 |
| Admin Architecture | 4 | 2 | 0 | 2 |
| Storefront Features | 6 | 0 | 0 | 6 |
| Storefront Requirements | 5 | 0 | 0 | 5 |
| Storefront Architecture | 4 | 0 | 0 | 4 |
| **TOTAL** | **28** | **3** | **2** | **23** |

## 🏷️ Legend

- ✅ **DONE**: Fully implemented and tested
- 🔄 **WIP**: Currently in development
- 📋 **PLANNED**: Planned for future development
- ⏸️ **DEPRECATED**: No longer valid

## 📅 Last Updated

- **Document Created**: 2026-01-26
- **Last Update**: 2026-02-21
- **Next Review**: 2026-02-28

---

## 💡 Tips for Using This Documentation

1. **Start with README**: Each folder has a README with overview
2. **Follow Templates**: Use [feature-template.md](./_templates/feature-template.md) for consistency
3. **Status Indicators**: Check status to know what's ready vs planned
4. **Cross-Reference**: Follow links to related specs for context
5. **Update Regularly**: Mark items as WIP/DONE as progress is made
