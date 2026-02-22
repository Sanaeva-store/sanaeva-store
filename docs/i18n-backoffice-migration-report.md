# Backoffice I18N Migration Report

## Summary

Implemented i18n architecture and migration for backoffice routes and shared admin navigation.

- Locale support: `th`, `en`
- Message split strategy: per-page backoffice files
- Dictionary access: typed namespace-based translator
- Validation messages: moved to i18n dictionaries for inventory forms
- Date formatting: migrated to shared i18n formatter in backoffice transaction/supplier pages

## New Message Files

Created in both locales:

- `messages/{locale}/backoffice/sidebar.json`
- `messages/{locale}/backoffice/navbar.json`
- `messages/{locale}/backoffice/dashboard-overview.json`
- `messages/{locale}/backoffice/analytics.json`
- `messages/{locale}/backoffice/customers.json`
- `messages/{locale}/backoffice/order-management.json`
- `messages/{locale}/backoffice/settings-general.json`
- `messages/{locale}/backoffice/settings-reports.json`
- `messages/{locale}/backoffice/inventory-dashboard.json`
- `messages/{locale}/backoffice/product-sku.json`
- `messages/{locale}/backoffice/inventory-low-stock.json`
- `messages/{locale}/backoffice/inventory-transactions.json`
- `messages/{locale}/backoffice/inventory-receiving.json`
- `messages/{locale}/backoffice/inventory-initial-stock.json`
- `messages/{locale}/backoffice/inventory-adjustment.json`
- `messages/{locale}/backoffice/inventory-suppliers.json`

## Common Dictionary Cleanup

`messages/en/common.json` and `messages/th/common.json` now keep only:

- `nav`
- `common`

Removed top-level groups from `common.json`:

- `account`
- `auth`
- `cart`
- `checkout`
- `filter`
- `orders`
- `product`
- `sort`

## Code Changes

I18n utilities:

- Added `shared/lib/i18n/backoffice-dictionary.ts`
- Added `shared/lib/i18n/use-backoffice-translations.ts`
- Updated `shared/lib/i18n/get-dictionary.ts` for namespace support
- Updated `shared/lib/i18n/formatters.ts` to accept full `Intl.DateTimeFormatOptions`
- Updated `shared/lib/i18n/index.ts` exports

Backoffice UI migration:

- Admin shared nav:
  - `components/components-design/admin-sidebar.tsx`
  - `components/components-design/admin-navbar.tsx`
- Backoffice pages under:
  - `app/[locale]/(admin-dasboard)/admin-dasboard/**`

## Validation

- `npm run typecheck`: passed
- `npm run lint`: passed with warnings only

Warnings currently unrelated to i18n correctness:

- React hook form compiler warning in inventory adjustment page
- Existing unused var warning in dashboard UI component
- Existing coverage lint warning
