# Checkout Specification

**Status**: 📋 TODO  
**Priority**: High  
**Last Updated**: 2026-02-21

## Overview

สเปค flow checkout ตั้งแต่กรอกที่อยู่จนยืนยันคำสั่งซื้อ โดยเน้นความถูกต้องของราคาและความเสถียรของการจ่ายเงิน

## Goals

- [ ] ผู้ใช้ checkout จบได้ลื่นไหลทั้ง guest/member
- [ ] ป้องกัน order ซ้ำจากการ submit ซ้ำ
- [ ] แสดงผลล้มเหลวและแนวทางแก้ไขได้ชัดเจน

## Functional Checklist

- [ ] Checkout steps: address -> shipping -> payment -> review
- [ ] รองรับ guest checkout ตามนโยบายระบบ
- [ ] รองรับ member autofill data (ถ้ามี session)
- [ ] Checkout preview ก่อนยืนยัน order
- [ ] Place order action พร้อม lock ปุ่มระหว่าง submit
- [ ] Order confirmation page พร้อมสรุปรายการ

## UI/UX Checklist

- [ ] Field-level validation messages ชัดเจน
- [ ] Recovery flow เมื่อ payment/network fail
- [ ] Summary panel ติดตามง่ายทั้ง mobile/desktop
- [ ] Legal/policy links ครบ (คืนสินค้า, ความเป็นส่วนตัว, เงื่อนไข)

## API Checklist (Phase 1)

- [ ] `POST /api/storefront/checkout/preview` เชื่อมแล้ว
- [ ] `POST /api/storefront/orders` เชื่อมแล้ว
- [ ] `GET /api/storefront/orders/:id` เชื่อมแล้ว

## Data Integrity Checklist

- [ ] ราคาใน checkout ต้องตรงกับ backend preview
- [ ] ไม่อนุญาตสั่งซื้อเกิน stock availability
- [ ] idempotent submit strategy เพื่อลด duplicate order

## Acceptance Criteria

- [ ] AC-1 ผู้ใช้ checkout จบได้ครบ flow โดยไม่เจอ blocker
- [ ] AC-2 order summary ตรงกับข้อมูล backend ทุกส่วน
- [ ] AC-3 กรณีจ่ายเงินล้มเหลว ผู้ใช้ retry หรือกลับมา flow ได้
- [ ] AC-4 order confirmation แสดงเลข order และสถานะได้ถูกต้อง

## Related Documentation

- [Modern Storefront Experience](./modern-storefront-experience.md)
- [Shopping Cart](./shopping-cart.md)
