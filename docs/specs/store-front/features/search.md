# Search & Discovery Specification

**Status**: 📋 TODO  
**Priority**: High  
**Last Updated**: 2026-02-21

## Overview

สเปคระบบค้นหาและการค้นพบสินค้าแบบทันสมัยสำหรับ storefront

## Feature Checklist

- [ ] Advanced search ด้วย keyword
- [ ] Auto-complete suggestions
- [ ] Search history (optional)
- [ ] Multi-level categories navigation
- [ ] Filtering: ราคา, แบรนด์, สี, ไซส์, คะแนนรีวิว, สต็อก
- [ ] Sorting: ล่าสุด, ขายดี, ราคา (ต่ำไปสูง/สูงไปต่ำ)
- [ ] URL state sync เพื่อ share/search ต่อได้
- [ ] Related/Recommended products บนผลลัพธ์

## API Checklist

- [ ] `GET /api/storefront/products`
- [ ] query params สำหรับ search/filter/sort/pagination
- [ ] endpoint suggestions/autocomplete (ถ้ามี)

## UX Checklist

- [ ] Debounce search input
- [ ] Empty result state พร้อมแนะนำคำค้น
- [ ] Error state พร้อม retry
- [ ] Mobile filter drawer ใช้งานง่าย

## Acceptance Criteria

- [ ] AC-1 ค้นหาและกรองร่วมกันได้อย่างถูกต้อง
- [ ] AC-2 ผลลัพธ์เรียงลำดับได้ตามตัวเลือก
- [ ] AC-3 Auto-complete แสดงผลไวและสัมพันธ์คำค้น
- [ ] AC-4 รองรับ mobile/desktop อย่างสมบูรณ์
