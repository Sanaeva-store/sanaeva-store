# User Account & Authentication Specification

**Status**: 📋 TODO  
**Priority**: High  
**Last Updated**: 2026-02-21

## Overview

สเปคระบบสมาชิกและบัญชีผู้ใช้สำหรับลูกค้า

## Authentication Checklist

- [ ] Sign up ด้วย Email
- [ ] Login ด้วย Email
- [ ] Login/OTP ด้วยเบอร์โทรศัพท์
- [ ] Social login: Google
- [ ] Social login: Facebook
- [ ] Social login: LINE
- [ ] Forgot password / reset password
- [ ] Session management (login/logout/refresh)

## Account Checklist

- [ ] แก้ไขข้อมูลโปรไฟล์
- [ ] อัปโหลด/เปลี่ยนรูปโปรไฟล์
- [ ] Address book หลายที่อยู่
- [ ] แยก Shipping address และ Tax invoice address
- [ ] ตั้งค่า default address

## Security Checklist

- [ ] Protected routes สำหรับ account pages
- [ ] Consent & privacy links บนหน้าสมาชิก
- [ ] Device/session revoke (optional)

## Acceptance Criteria

- [ ] AC-1 ลูกค้าสมัครและล็อกอินได้อย่างน้อย 2 วิธี (email/phone)
- [ ] AC-2 social login provider ที่เปิดใช้งานทำงานจริง
- [ ] AC-3 ลูกค้าแก้ไขโปรไฟล์และที่อยู่ได้สำเร็จ
- [ ] AC-4 ข้อมูลบัญชีถูกแสดงเฉพาะเจ้าของบัญชี
