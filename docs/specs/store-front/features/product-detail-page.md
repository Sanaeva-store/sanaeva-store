# Product Detail Page Specification

**Status**: 📋 TODO  
**Priority**: High  
**Last Updated**: 2026-02-21

## Overview

สเปคหน้ารายละเอียดสินค้าเพื่อเพิ่ม conversion และลดการคืนสินค้า

## Feature Checklist

- [ ] Product gallery หลายมุม + zoom
- [ ] รองรับวิดีโอสินค้า (optional)
- [ ] Product variants (สี/ไซส์/ความจุ)
- [ ] แสดง stock availability ต่อ variant แบบ near real-time
- [ ] Reviews & ratings จากผู้ซื้อจริง
- [ ] รองรับ review image upload (phase ต่อไป)
- [ ] Social share buttons
- [ ] Related/Recommended/Complete-the-look sections

## API Checklist

- [ ] `GET /api/storefront/products/:id`
- [ ] `GET /api/storefront/products/:id/variants/:variantId/availability`
- [ ] `GET /api/storefront/products/:id/reviews`
- [ ] `POST /api/storefront/products/:id/reviews`

## Acceptance Criteria

- [ ] AC-1 ลูกค้าเลือก variant และเห็นสถานะ stock ที่ถูกต้อง
- [ ] AC-2 แกลเลอรีโหลดไวและใช้งานดีบน mobile
- [ ] AC-3 รีวิวและคะแนนช่วยประกอบการตัดสินใจได้จริง
