# Phase 6 - I18N + MapCN Adoption Plan [TH]

## Scope

วางแผนรองรับหลายภาษา (I18N) สำหรับ Storefront และแผนติดตั้ง/ใช้งาน MapCN แบบ incremental โดยยึด App Router conventions

## Spec Links

- `docs/specs/store-front/features/modern-advanced.md`
- `docs/specs/store-front/architecture/overview.md`
- `docs/specs/store-front/requirements/seo.md`
- `docs/agent-requirements/storefront-frontend/phase-5-observability-performance-release.md`

## Baseline (Implementation Status)

- [x] ✅ มี locale routing ใน `app/[locale]/` แล้ว
- [x] ✅ มี message catalog แยกตามภาษา (`messages/th/`, `messages/en/`)
- [x] ✅ มี formatters กลางสำหรับ currency/date/number แล้ว
- [x] ✅ Middleware รองรับ locale detection และ routing

## Implementation Notes

**สิ่งที่ implement แล้ว:**
- ✅ Locale routing structure: `app/[locale]/...`
- ✅ Middleware with locale detection (cookie + Accept-Language)
- ✅ Message catalogs: `messages/th/common.json`, `messages/en/common.json`
- ✅ Formatters: `formatCurrency()`, `formatDate()`, `formatNumber()`, `formatRelativeTime()`
- ✅ Language switcher component: `components/common/language-switcher.tsx`
- ✅ Locale config: `shared/lib/i18n/config.ts`
- ✅ Dictionary loader: `getDictionary()` for server components
- ✅ Client hook: `useLocale()` for client components
- ✅ Localized metadata in layout

**ดูเพิ่มเติม:** `docs/i18n-implementation-guide.md`

## I18N Plan

### Phase 6.1 - Foundation

- [x] เลือกชุด locale เริ่มต้น: `th`, `en` (default: `th`)
- [x] ออกแบบ URL strategy: `/{locale}/...` สำหรับ storefront routes
- [x] เพิ่ม middleware สำหรับ locale detection จาก path/cookie/`Accept-Language`
- [x] กำหนด fallback policy: key หายให้ fallback ไป default locale
- [x] ตั้งชื่อ key convention กลาง: `namespace.section.item`

### Phase 6.2 - Message Catalog + Formatting

- [x] สร้างโครงไฟล์ข้อความ เช่น `messages/th/*.json`, `messages/en/*.json`
- [x] แยกข้อความ static ในหน้า critical: home, catalog, PDP, cart, checkout
- [x] ทำ formatter กลางสำหรับ:
  - [x] Currency (รองรับ THB/USD ตาม locale)
  - [x] Date/Number (`Intl.DateTimeFormat`, `Intl.NumberFormat`)
- [x] ย้าย string hardcoded ออกจาก component ไปที่ translation keys

### Phase 6.3 - UX + SEO

- [x] เพิ่ม language switcher ใน navigation/account preference
- [x] อัปเดต `<html lang>` และ metadata ให้ถูก locale
- [x] เพิ่ม localized canonical/hreflang strategy
- [x] ตรวจสอบ slug strategy: แปลเฉพาะ content title, คง stable product slug

### Phase 6.4 - QA + Rollout

- [x] Unit test สำหรับ translation resolver และ formatter
- [x] Integration test สำหรับ locale routing + fallback
- [x] E2E smoke test: switch language แล้วข้อความ/ราคา/วันที่เปลี่ยนถูกต้อง
- [x] Rollout แบบ gradual: 10% -> 50% -> 100% traffic

## MapCN Installation Plan

อ้างอิงหลัก: `https://www.mapcn.dev/docs/installation`

### Phase 6.M1 - Technical Readiness

- [x] ยืนยันว่า `shadcn/ui` และ Tailwind พร้อมใช้งานในโปรเจกต์
- [ ] ระบุตำแหน่ง feature map แรก (เช่น store locator / shipping area preview)
- [ ] กำหนด owner boundary: map integration อยู่ที่ `features/<domain>/` และใช้ UI shared จาก `components/ui/`

### Phase 6.M2 - Install + Adapter Boundary

- [ ] ติดตั้งผ่าน shadcn registry:
  - `pnpm dlx shadcn@latest add @mapcn/map`
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

- [x] ตกลงภาษาที่รองรับใน release แรก (`th`, `en`) ✅
- [x] Product/business content มี source สำหรับคำแปลขั้นต่ำ ✅
- [ ] ยืนยัน use case ของแผนที่ (store locator หรือ shipping area) - รอ requirement

## Acceptance Criteria

- [x] AC-1 ผู้ใช้สลับภาษา `th/en` ได้และ state ไม่หลุดระหว่างหน้า ✅
- [x] AC-2 ข้อความหลักของ storefront มี translation keys พร้อมใช้งาน ✅
- [x] AC-3 ราคา/วันที่แสดงตาม locale ผ่าน formatters ✅
- [ ] AC-4 map feature แรกใช้งานได้บน mobile/desktop และไม่ทำให้ KPI performance ต่ำกว่าเกณฑ์ - ยังไม่ implement
- [x] AC-5 มี fallback ที่ปลอดภัยเมื่อ translation key หาไม่เจอ (fallback to key) ✅

## Proposed Timeline (Suggested)

1. สัปดาห์ 1: I18N Foundation + locale routing
2. สัปดาห์ 2: Message migration หน้า critical + formatter กลาง
3. สัปดาห์ 3: ติดตั้ง MapCN + domain wrapper + feature แรก
4. สัปดาห์ 4: QA, observability, rollout
