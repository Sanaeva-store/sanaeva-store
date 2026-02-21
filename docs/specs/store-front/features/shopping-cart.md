# Shopping Cart Specification

**Status**: 📋 TODO  
**Priority**: High  
**Last Updated**: 2026-02-21

## Overview

สเปคหน้าตะกร้าสินค้าสำหรับจัดการรายการก่อน checkout โดยเน้นความชัดเจนของราคาและการแก้ไขที่รวดเร็ว

## Goals

- [ ] ผู้ใช้เพิ่ม/แก้ไข/ลบสินค้าได้ง่าย
- [ ] ระบบแสดงยอดรวมและส่วนลดถูกต้อง
- [ ] ลดการ drop ก่อนเข้า checkout

## Functional Checklist

- [ ] Cart list แสดงรูป/ชื่อ/variant/ราคา/จำนวน
- [ ] Update quantity ต่อรายการ
- [ ] Remove item ต่อรายการ
- [ ] Coupon input + apply/remove coupon
- [ ] Order summary (subtotal/discount/shipping/total)
- [ ] CTA ไป checkout ชัดเจน
- [ ] Cross-sell block (optional)

## UI/UX Checklist

- [ ] Optimistic update หรือ loading state ตอนแก้จำนวน
- [ ] Empty cart state พร้อม CTA กลับไปช็อป
- [ ] Error state พร้อม retry และข้อความที่เข้าใจง่าย
- [ ] Mobile sticky summary/checkout button

## API Checklist (Phase 1)

- [ ] `GET /api/storefront/cart` เชื่อมแล้ว
- [ ] `POST /api/storefront/cart/items` เชื่อมแล้ว
- [ ] `PATCH /api/storefront/cart/items/:itemId` เชื่อมแล้ว
- [ ] `DELETE /api/storefront/cart/items/:itemId` เชื่อมแล้ว
- [ ] coupon API mapping (ถ้ามีใน phase ปัจจุบัน)

## Validation Checklist

- [ ] ไม่ให้ตั้งจำนวนเกิน stock availability
- [ ] ป้องกัน quantity ต่ำกว่า 1
- [ ] handle กรณีสินค้า inactive/out-of-stock ระหว่างอยู่ใน cart

## Acceptance Criteria

- [ ] AC-1 เพิ่ม/ลด/ลบสินค้าแล้วผลลัพธ์ตรงกับ backend
- [ ] AC-2 ยอดรวมและส่วนลดตรงกับ checkout preview
- [ ] AC-3 ผู้ใช้ไป checkout ได้โดยไม่มีข้อมูลค้างผิดพลาด
- [ ] AC-4 มี loading/empty/error state ครบ

## Related Documentation

- [Modern Storefront Experience](./modern-storefront-experience.md)
- [Checkout](./checkout.md)
