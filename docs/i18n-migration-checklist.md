# I18N Migration Checklist

## ✅ งานที่ทำเสร็จแล้ว

### Infrastructure
- [x] สร้าง locale routing structure (`app/[locale]/`)
- [x] ย้าย existing routes ไปอยู่ใน `[locale]` structure
- [x] อัปเดต middleware รองรับ locale detection
- [x] สร้าง locale config (`shared/lib/i18n/config.ts`)
- [x] สร้าง formatters (`formatCurrency`, `formatDate`, `formatNumber`, `formatRelativeTime`)
- [x] สร้าง dictionary loader (`getDictionary()`)
- [x] สร้าง client hook (`useLocale()`)

### Message Catalogs
- [x] สร้าง `messages/th/common.json` (ภาษาไทย)
- [x] สร้าง `messages/en/common.json` (ภาษาอังกฤษ)
- [x] เพิ่ม translation keys หลัก:
  - Navigation
  - Common actions
  - Cart
  - Product
  - Checkout
  - Account
  - Orders
  - Auth
  - Filter/Sort

### Components
- [x] สร้าง `LanguageSwitcher` component
- [x] อัปเดต root layout รองรับ locale
- [x] เพิ่ม localized metadata

### Documentation
- [x] สร้าง `docs/i18n-implementation-guide.md`
- [x] อัปเดต `docs/agent-requirements/storefront-frontend/phase-6-i18n-mapcn-adoption.md`

## 🔄 งานที่ต้องทำต่อ

### Migration Tasks
- [ ] อัปเดต existing components ให้ใช้ `getDictionary()` แทน hardcoded text
- [ ] แทนที่ hardcoded `฿` ด้วย `formatCurrency(amount, locale)`
- [ ] แทนที่ `toLocaleString()` ด้วย formatters
- [ ] เพิ่ม `LanguageSwitcher` ใน navigation components

### Component-Specific Migration

#### Cart Page (`app/[locale]/(storefront)/cart/page.tsx`)
- [ ] แทนที่ "Shopping Cart" ด้วย `dict.cart.title`
- [ ] แทนที่ "Your cart is empty" ด้วย `dict.cart.empty`
- [ ] แทนที่ hardcoded `฿` ด้วย `formatCurrency()`
- [ ] แทนที่ "Subtotal", "Shipping", "Total" ด้วย translation keys

#### Checkout Page (`app/[locale]/(storefront)/checkout/page.tsx`)
- [ ] แทนที่ hardcoded text ด้วย `dict.checkout.*`
- [ ] แทนที่ `toLocaleString("th-TH")` ด้วย `formatCurrency(amount, locale)`

#### Orders Page (`app/[locale]/(user)/orders/page.tsx`)
- [ ] แทนที่ "My Orders" ด้วย `dict.orders.title`
- [ ] แทนที่ `toLocaleDateString("th-TH")` ด้วย `formatDate(date, locale)`
- [ ] แทนที่ hardcoded `฿` ด้วย `formatCurrency()`

### Testing
- [ ] ทดสอบ locale switching ระหว่างหน้าต่างๆ
- [ ] ทดสอบ middleware locale detection
- [ ] ทดสอบ formatters กับทั้ง `th` และ `en`
- [ ] ทดสอบ fallback เมื่อ translation key ไม่มี
- [ ] ทดสอบ SEO metadata ต่าง locale

### Future Enhancements
- [ ] เพิ่ม locale selector ใน account settings
- [ ] แยก message catalogs ตาม feature (`cart.json`, `checkout.json`)
- [ ] เพิ่ม translation management workflow
- [ ] เพิ่ม locale อื่นๆ (ถ้าต้องการ)

## 📝 Notes

**Lint Warning ที่เหลือ:**
- `middleware.ts:69` - String.raw warning (ไม่กระทบการทำงาน, เป็น regex pattern ปกติ)

**การใช้งาน:**
1. Server Components: ใช้ `getDictionary(locale)`
2. Client Components: ใช้ `useLocale()` + formatters
3. Currency: ใช้ `formatCurrency(amount, locale)` แทน hardcoded `฿`
4. Date: ใช้ `formatDate(date, locale)` แทน `toLocaleDateString()`

**ดูเพิ่มเติม:**
- `docs/i18n-implementation-guide.md` - คู่มือการใช้งานแบบละเอียด
- `docs/agent-requirements/storefront-frontend/phase-6-i18n-mapcn-adoption.md` - Requirements และ status
