# Storefront Frontend Production Readiness Checklist [TH]

## Product Readiness

- [ ] Feature scope ตรงตาม spec ที่อนุมัติ
- [ ] UX review ผ่านสำหรับ critical flows (browse, PDP, cart, checkout)
- [ ] Copy/content state ครบ (loading, error, empty, success)

## Engineering Readiness

- [ ] API integration ครอบ failure scenarios หลัก
- [ ] Security headers/cookie/session behavior ถูกต้องตามนโยบาย
- [ ] Logging และ error boundaries ครบจุดเสี่ยง
- [ ] Test coverage ของ business-critical logic ผ่านเกณฑ์ทีม

## Performance Readiness

- [ ] Core Web Vitals ผ่าน baseline ที่กำหนด
- [ ] รูปภาพและ asset optimization เปิดใช้งานครบ
- [ ] Query caching strategy ผ่านการทดสอบภายใต้โหลดจริง

## Release Readiness

- [ ] Environment variables ตรวจครบทุก environment
- [ ] Rollout plan และ rollback plan พร้อมใช้งาน
- [ ] Monitoring dashboard/alert ถูกตั้งค่าและทดสอบแล้ว
- [ ] Release owner และ on-call responsibility ชัดเจน

