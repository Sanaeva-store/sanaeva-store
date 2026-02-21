# Modern Storefront Experience Specification

**Status**: 🔄 WIP  
**Priority**: High  
**Last Updated**: 2026-02-21

## Overview

เอกสารนี้กำหนด feature ฝั่ง frontend สำหรับหน้าเว็บขายของ (storefront) ให้มีความทันสมัย ใช้งานลื่น และพร้อมรองรับ flow การขายจริง โดยจัดลำดับตามความพร้อมของ API backend

## Goals

- ให้ผู้ใช้ซื้อสินค้าได้ครบ flow `landing -> browse -> PDP -> cart -> checkout -> order confirmation`
- ทำ UX แบบ modern ที่เร็ว ชัดเจน และ mobile-first
- แยกขอบเขต `MVP` และ `Phase ถัดไป` ตาม backend readiness

## Feature Scope (Frontend)

### A) Landing & Discovery

1. `Landing/Home Page`
- Hero banner + primary CTA
- New arrivals / best sellers / promotions blocks
- Trust signals (rating, reviews count, shipping/return highlights)
- Personalized section (ถ้ามี session/member data)

2. `Global Search & Navigation`
- Header search with suggestions
- Category menu / mega-menu
- Sticky header (mobile + desktop)

3. `Marketing Blocks`
- Campaign banners
- Limited-time promotions
- Newsletter capture

### B) Shopping Core

1. `Product Listing Page (PLP)`
- Product grid
- Search/filter/sort/pagination or infinite strategy
- Price, compare-at-price, badge, stock label

2. `Product Detail Page (PDP)`
- Image gallery + zoom
- Variant selector (size/color)
- Availability per variant
- Related/similar products

3. `Cart`
- Add/update/remove item
- Coupon field and discount summary
- Shipping estimate (ถ้ามีข้อมูล)

4. `Checkout`
- Address + shipping + payment + order review
- Guest checkout (ตามนโยบาย)
- Duplicate submit protection

5. `Order Confirmation`
- Order summary
- Payment result state
- Next actions (track order / continue shopping)

### C) Account & Engagement

1. `Auth Pages`
- Sign in / Sign up / Forgot password

2. `Account Pages`
- Profile
- Addresses
- Order history and order detail

3. `Wishlist & Alerts` (phase ถัดไป)
- Wishlist page
- Back-in-stock alert
- Price-drop alert

## UI/UX Standards (Modern Baseline)

1. Performance-first rendering with skeleton/loading states
2. Full responsive behavior (mobile 320px+)
3. Clear empty/error states on all data pages
4. Accessibility baseline (keyboard navigation, proper labels, contrast)
5. Consistent feedback patterns (toast/inline validation/success states)

## API Alignment with Backend Phase Plan

### Phase 1 (Core Commerce) — Build First

Target APIs:
- `GET /api/storefront/home`
- `GET /api/storefront/products`
- `GET /api/storefront/products/:id`
- `GET /api/storefront/products/:id/variants/:variantId/availability`
- `GET /api/storefront/cart`
- `POST /api/storefront/cart/items`
- `PATCH /api/storefront/cart/items/:itemId`
- `DELETE /api/storefront/cart/items/:itemId`
- `POST /api/storefront/checkout/preview`
- `POST /api/storefront/orders`
- `GET /api/storefront/orders/:id`

Frontend deliverables:
- Landing/Home
- PLP + PDP
- Cart
- Checkout
- Order confirmation

### Phase 2 (Fashion Experience) — Build When API Ready

Target APIs:
- `GET /api/storefront/products/:id/size-guide`
- `POST /api/storefront/fit-profile`
- `GET /api/storefront/fit-profile`
- `GET /api/storefront/wishlist`
- `POST /api/storefront/wishlist/items`
- `DELETE /api/storefront/wishlist/items/:variantId`
- `POST /api/storefront/notifications/back-in-stock`
- `POST /api/storefront/notifications/price-drop`
- `GET /api/storefront/products/:id/reviews`
- `POST /api/storefront/products/:id/reviews`

Frontend deliverables:
- Size guide / fit profile UX
- Wishlist
- Alerts (stock/price)
- Reviews and social proof

## Implementation Priority

### P0 (Must Have)

1. Home (basic blocks)
2. PLP
3. PDP
4. Cart
5. Checkout
6. Order confirmation

### P1 (Should Have)

1. Account profile + order history
2. Better discovery modules (similar items / complete-the-look)
3. SEO and metadata hardening

### P2 (Nice to Have, API-dependent)

1. Wishlist
2. Size recommendation
3. Back-in-stock / price-drop notifications
4. Reviews with customer photos

## Acceptance Criteria

- [ ] User completes purchase flow end-to-end on desktop and mobile
- [ ] Product availability prevents purchasing out-of-stock variants
- [ ] Cart and checkout pricing are consistent with backend calculation
- [ ] Each critical page includes loading, empty, and error states
- [ ] Core storefront pages pass agreed performance budget

## Related Documentation

- [Storefront Overview](../README.md)
- [Landing & Home](./landing-home.md)
- [Product Catalog](./product-catalog.md)
- [Shopping Cart](./shopping-cart.md)
- [Checkout](./checkout.md)
- [Storefront Architecture Overview](../architecture/overview.md)
- [Storefront Frontend Phase Plan](../../../agent-requirements/storefront-frontend/README.md)
