# I18N Implementation Guide

## Overview

โปรเจกต์นี้รองรับหลายภาษา (i18n) โดยใช้ Next.js App Router และ middleware สำหรับ locale routing

## Supported Locales

- `th` (ไทย) - Default
- `en` (English)

## Architecture

### 1. Locale Routing Structure

```
app/
  [locale]/
    (storefront)/
    (user)/
    (admin-dasboard)/
    layout.tsx
    page.tsx
```

ทุก route จะมี locale prefix เช่น `/th/cart`, `/en/checkout`

### 2. Middleware

`middleware.ts` ทำหน้าที่:
- ตรวจจับ locale จาก cookie หรือ `Accept-Language` header
- Redirect ไปยัง URL ที่มี locale prefix
- รักษา auth protection logic เดิม

### 3. Message Catalogs

```
messages/
  th/
    common.json
  en/
    common.json
```

แต่ละไฟล์เก็บ translation keys ในรูปแบบ nested object:

```json
{
  "nav": {
    "home": "หน้าแรก",
    "cart": "ตรวจสอบตะกร้า"
  },
  "common": {
    "loading": "กำลังโหลด...",
    "error": "เกิดข้อผิดพลาด"
  }
}
```

### 4. Formatters

`shared/lib/i18n/formatters.ts` มี utility functions:

- `formatCurrency(amount, locale?)` - แสดงราคาตาม locale (THB/USD)
- `formatNumber(value, locale?)` - แสดงตัวเลขตาม locale
- `formatDate(date, locale?, options?)` - แสดงวันที่ตาม locale
- `formatRelativeTime(date, locale?)` - แสดงเวลาแบบ relative

## Usage Examples

### Server Components

```tsx
import { getDictionary, type Locale } from "@/shared/lib/i18n";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div>
      <h1>{dict.nav.home}</h1>
      <p>{dict.common.loading}</p>
    </div>
  );
}
```

### Client Components

```tsx
"use client";

import { useLocale } from "@/shared/lib/i18n";
import { formatCurrency } from "@/shared/lib/i18n";

export function ProductPrice({ amount }: { amount: number }) {
  const locale = useLocale();
  
  return <span>{formatCurrency(amount, locale)}</span>;
}
```

### Language Switcher

```tsx
import { LanguageSwitcher } from "@/components/common/language-switcher";

export function Header() {
  return (
    <header>
      <nav>
        {/* ... */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

### Using Formatters

```tsx
import { formatCurrency, formatDate, formatNumber } from "@/shared/lib/i18n";

// Currency
formatCurrency(1500, "th"); // "฿1,500"
formatCurrency(50, "en");   // "$50"

// Date
formatDate(new Date(), "th"); // "22 กุมภาพันธ์ 2026"
formatDate(new Date(), "en"); // "February 22, 2026"

// Number
formatNumber(1234567, "th"); // "1,234,567"
formatNumber(1234567, "en"); // "1,234,567"
```

## Migration Checklist

เมื่อเพิ่ม translation ใหม่:

1. ✅ เพิ่ม key ใน `messages/th/common.json`
2. ✅ เพิ่ม key เดียวกันใน `messages/en/common.json`
3. ✅ ใช้ `getDictionary()` ใน Server Component
4. ✅ ใช้ `useLocale()` + formatters ใน Client Component
5. ✅ อัปเดต type ใน `get-dictionary.ts` ถ้าจำเป็น

## Best Practices

### DO ✅

- ใช้ `formatCurrency()` แทนการ hardcode `฿` หรือ `$`
- ใช้ `formatDate()` แทน `toLocaleDateString()` โดยตรง
- เก็บ translation keys ใน message catalogs
- ใช้ `useLocale()` hook ใน client components
- ใช้ `getDictionary()` ใน server components

### DON'T ❌

- ❌ Hardcode ข้อความภาษาไทยหรืออังกฤษใน component
- ❌ Hardcode สกุลเงิน `฿` หรือ `$`
- ❌ ใช้ `toLocaleString()` โดยตรงโดยไม่ผ่าน formatters
- ❌ เข้าถึง `params.locale` โดยตรงใน client component (ใช้ `useLocale()` แทน)

## SEO Considerations

- `app/[locale]/layout.tsx` มี `generateMetadata()` ที่ตั้ง `alternates.languages`
- `<html lang={locale}>` ถูกตั้งค่าอัตโนมัติ
- Middleware จัดการ locale detection และ redirect

## Future Enhancements

- [ ] เพิ่ม locale อื่นๆ (เช่น `zh`, `ja`)
- [ ] แยก message catalogs ตาม feature (เช่น `messages/th/cart.json`)
- [ ] เพิ่ม translation management tool
- [ ] เพิ่ม RTL support สำหรับภาษาอาหรับ
