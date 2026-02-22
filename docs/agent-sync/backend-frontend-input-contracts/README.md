# Backend-Frontend Input Contracts (Agent-Readable)

เอกสารชุดนี้สรุปจาก backend จริง (`../sanaeva-store-api`) เพื่อให้ frontend/agent ขึ้น UI และส่ง payload ได้ตรง contract โดยไม่เดา field เอง

Last synced: 2026-02-22

## ใช้เอกสารนี้เมื่อไร

- ต้องสร้าง/แก้ฟอร์มที่ยิง API ฝั่ง backoffice
- ต้องเช็กว่า enum/field/value ไหนต้องส่งแบบ exact match
- ต้องเช็กว่า endpoint ไหนพร้อมใช้แล้ว (`Available`) หรือยังเป็นแผน (`Planned`/`Stub`)

## โครงเอกสาร

1. `phase-sync.md`
   แมป phase backend task -> งาน frontend ที่ต้องทำให้สอดคล้อง
2. `input-contracts.md`
   สเปก input field, ชนิดข้อมูล, validation, enum, query params ราย endpoint
3. `frontend-gap-checklist.md`
   รายการจุดที่ frontend ปัจจุบันยังไม่ตรงกับ backend contract

## Source of truth (backend)

- `../sanaeva-store-api/src/**/dto/*.ts`
- `../sanaeva-store-api/src/**/**.controller.ts`
- `../sanaeva-store-api/prisma/schema.prisma`
- `../sanaeva-store-api/docs/agent-requirements/backoffice-dashboard/*.md`
- `../sanaeva-store-api/docs/agent-requirements/storefront/*.md`

## Status Legend

- `Available`: มี endpoint + contract ชัด ใช้งานเชื่อม UI ได้
- `Planned`: มี requirement/task แต่ endpoint ยังไม่พร้อมจริง
- `Stub`: มี endpoint แต่ logic ยังไม่ complete หรือเคยระบุเป็น placeholder
