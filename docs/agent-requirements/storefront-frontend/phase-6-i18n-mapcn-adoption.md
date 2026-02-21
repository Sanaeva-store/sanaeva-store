# Phase 6 - I18N + MapCN Adoption Plan [TH]

## Scope

วางแผนรองรับหลายภาษา (I18N) สำหรับ Storefront และแผนติดตั้ง/ใช้งาน MapCN แบบ incremental โดยยึด App Router conventions

## Spec Links

- `docs/specs/store-front/features/modern-advanced.md`
- `docs/specs/store-front/architecture/overview.md`
- `docs/specs/store-front/requirements/seo.md`
- `docs/agent-requirements/storefront-frontend/phase-5-observability-performance-release.md`

## Baseline (Current Gaps)

- [ ] ยังไม่มี locale routing ใน `app/`
- [ ] ยังไม่มี message catalog แยกตามภาษา
- [ ] มีการ hardcode สกุลเงิน/locale บางจุด (เช่น `฿` และ `toLocaleString`)
- [ ] สเปก Multi-language/Multi-currency ยังเป็น TODO

## I18N Plan

### Phase 6.1 - Foundation

- [ ] เลือกชุด locale เริ่มต้น: `th`, `en` (default: `th`)
- [ ] ออกแบบ URL strategy: `/{locale}/...` สำหรับ storefront routes
- [ ] เพิ่ม middleware สำหรับ locale detection จาก path/cookie/`Accept-Language`
- [ ] กำหนด fallback policy: key หายให้ fallback ไป default locale
- [ ] ตั้งชื่อ key convention กลาง: `namespace.section.item`

### Phase 6.2 - Message Catalog + Formatting

- [ ] สร้างโครงไฟล์ข้อความ เช่น `messages/th/*.json`, `messages/en/*.json`
- [ ] แยกข้อความ static ในหน้า critical: home, catalog, PDP, cart, checkout
- [ ] ทำ formatter กลางสำหรับ:
  - [ ] Currency (รองรับ THB/USD ตาม locale)
  - [ ] Date/Number (`Intl.DateTimeFormat`, `Intl.NumberFormat`)
- [ ] ย้าย string hardcoded ออกจาก component ไปที่ translation keys

### Phase 6.3 - UX + SEO

- [ ] เพิ่ม language switcher ใน navigation/account preference
- [ ] อัปเดต `<html lang>` และ metadata ให้ถูก locale
- [ ] เพิ่ม localized canonical/hreflang strategy
- [ ] ตรวจสอบ slug strategy: แปลเฉพาะ content title, คง stable product slug

### Phase 6.4 - QA + Rollout

- [ ] Unit test สำหรับ translation resolver และ formatter
- [ ] Integration test สำหรับ locale routing + fallback
- [ ] E2E smoke test: switch language แล้วข้อความ/ราคา/วันที่เปลี่ยนถูกต้อง
- [ ] Rollout แบบ gradual: 10% -> 50% -> 100% traffic

## MapCN Installation Plan

อ้างอิงหลัก: `https://www.mapcn.dev/docs/installation`

### Phase 6.M1 - Technical Readiness

- [ ] ยืนยันว่า `shadcn/ui` และ Tailwind พร้อมใช้งานในโปรเจกต์
- [ ] ระบุตำแหน่ง feature map แรก (เช่น store locator / shipping area preview)
- [ ] กำหนด owner boundary: map integration อยู่ที่ `features/<domain>/` และใช้ UI shared จาก `components/ui/`

### Phase 6.M2 - Install + Adapter Boundary

- [ ] ติดตั้งผ่าน shadcn registry:
  - `npx shadcn@latest add @mapcn/map`
- [ ] สร้าง adapter layer เช่น `shared/map/map-provider.ts` เพื่อไม่ให้ feature code ผูกกับ vendor โดยตรง
- [ ] ทำ wrapper component ระดับโดเมน (เช่น `features/store-locator/components/store-map.tsx`)

### Phase 6.M3 - Integration Rules

- [ ] ใช้ Map ใน client boundary เท่านั้น (ป้องกัน SSR mismatch)
- [ ] ตั้ง default tile/style แบบไม่ใช้ API key ก่อน (CARTO default)
- [ ] เพิ่ม config สำหรับเปลี่ยน tile provider ในอนาคต (MapTiler/OSM)
- [ ] วาง performance guardrail:
  - [ ] marker จำนวนมากให้พิจารณา GeoJSON layer แทน DOM marker
  - [ ] lazy load map เฉพาะ section ที่เห็นใน viewport

### Phase 6.M4 - Quality + Monitoring

- [ ] เพิ่ม test ขั้นต่ำสำหรับ map container render และ fallback UI
- [ ] จับ error telemetry เฉพาะ map init/tiles load
- [ ] วัดผลกระทบ performance (LCP/CLS/INP) ก่อนและหลังเปิดใช้ map

## Dependency

- [ ] ตกลงภาษาที่รองรับใน release แรก (`th`, `en`)
- [ ] Product/business content มี source สำหรับคำแปลขั้นต่ำ
- [ ] ยืนยัน use case ของแผนที่ (store locator หรือ shipping area)

## Acceptance Criteria

- [ ] AC-1 ผู้ใช้สลับภาษา `th/en` ได้และ state ไม่หลุดระหว่างหน้า
- [ ] AC-2 ข้อความหลักของ storefront ถูกแปลครบในหน้า critical
- [ ] AC-3 ราคา/วันที่แสดงตาม locale อย่างสม่ำเสมอ
- [ ] AC-4 map feature แรกใช้งานได้บน mobile/desktop และไม่ทำให้ KPI performance ต่ำกว่าเกณฑ์
- [ ] AC-5 มี fallback ที่ปลอดภัยเมื่อ translation key หรือ tile provider มีปัญหา

## Proposed Timeline (Suggested)

1. สัปดาห์ 1: I18N Foundation + locale routing
2. สัปดาห์ 2: Message migration หน้า critical + formatter กลาง
3. สัปดาห์ 3: ติดตั้ง MapCN + domain wrapper + feature แรก
4. สัปดาห์ 4: QA, observability, rollout
