# Color Semantics Instruction (Global UI)

**Status**: ✅ Active  
**Last Updated**: 2026-02-22

## Purpose

กำหนดมาตรฐานสีเชิง semantic ให้ทุกหน้าในระบบใช้ตรงกัน เพื่อไม่ให้ UI ดูจืดหรือสื่อความหมายผิด โดยเฉพาะปุ่มและ notification.

## Core Rules

1. `Primary` = action หลักของหน้า (เช่น Save, Continue, Place Order)
2. `Cancel` = ไม่ใช่ destructive action ให้ใช้ `neutral` เท่านั้น
3. `Destructive` = เฉพาะ action ที่ลบ/ยกเลิกถาวร/ย้อนกลับไม่ได้ ให้ใช้โทนแดง
4. `Info` = ข้อมูลทั่วไป/สถานะอธิบาย ใช้โทนน้ำเงิน
5. `Warning` = ความเสี่ยงที่ยังแก้ไขได้ ใช้โทนเหลือง/amber
6. `Error` = ล้มเหลว/ไม่ผ่าน validation/ปัญหารุนแรง ใช้โทนแดง
7. `Success` = สำเร็จ ใช้โทนเขียว

## Explicit Decisions (ตอบคำถามทีม)

1. Notification ต้องเป็นสีแดงไหม?
   - ไม่เสมอ: แดงใช้เฉพาะ `error/destructive` เท่านั้น
2. ปุ่ม Cancel ต้องเป็นสีแดงไหม?
   - ไม่ควร: `Cancel` ปกติให้ใช้ `neutral/outline`
   - สีแดงใช้เฉพาะปุ่ม `Delete`, `Remove permanently`, `Cancel order` (เมื่อมีผล destructive)
3. Info / Warning / Error ควรแยกสีไหม?
   - ต้องแยกชัดเจนตาม semantic role

## UI Mapping

1. `Primary button`: พื้นหลังน้ำเงิน, ตัวอักษรขาว
2. `Secondary/Cancel button`: พื้นหลังขาว/โปร่ง, เส้นขอบเทา, hover อ่อน
3. `Info banner/toast`: พื้นฟ้าอ่อน + ข้อความน้ำเงินเข้ม
4. `Warning banner/toast`: พื้นเหลืองอ่อน + ข้อความน้ำตาล/amber เข้ม
5. `Error banner/toast`: พื้นแดงอ่อน + ข้อความแดงเข้ม
6. `Destructive button`: พื้นแดงเข้ม + ตัวอักษรขาว
7. `Success banner/toast`: พื้นเขียวอ่อน + ข้อความเขียวเข้ม

## Interaction Rules

1. ห้ามใช้สีแดงเป็นค่า default ของ notification
2. ห้ามใช้สีแดงกับปุ่มที่เป็นการปิด dialog หรือยกเลิกฟอร์มทั่วไป
3. ทุกสีต้องผ่าน contrast ขั้นต่ำ (WCAG AA) กับข้อความ
4. สีต้องสม่ำเสมอทั้ง Back Office, Storefront และ Core User

## Engineering Rule

1. ให้ใช้ semantic token จาก `shared/config/design-tokens.ts`
2. ห้าม hardcode สีเฉพาะหน้าถ้าไม่จำเป็น
3. หากต้องเพิ่มเฉดใหม่ ให้เพิ่มผ่าน token ก่อนใช้งานจริง
