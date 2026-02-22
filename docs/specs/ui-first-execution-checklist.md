# UI-First Execution Checklist (4 Weeks)

**Status**: 🔄 WIP  
**Last Updated**: 2026-02-21

## Progress Snapshot (2026-02-21)

### Completed

1. UI-first master plan created and linked from spec index
2. Global providers implemented (`Theme`, `React Query`, `Sonner`)
3. React Query baseline added (`query-client`, query key factory)
4. Shared API adapter baseline added (`api-client`, `public-env`, API response types)
5. Zustand bounded stores added:
   - Cart store + selectors
   - Inventory UI store
   - Account preference store
6. Added `typecheck` script and import boundary lint guardrails
7. Validation run complete:
   - `lint` passed with warnings only
   - `typecheck` passed
   - `test` passed

### In Progress

1. Foundation Week 1 route map lock for `(back-office)`, `(storefront)`, `(user)`
2. Foundation Week 1 design tokens/layout freeze

### Not Started

1. Week 2 Back Office Inventory UI-only screens
2. Week 3 Storefront UI-only screens
3. Week 4 Core User UI and integration readiness mapping

## Handoff Notes (for Windsurf)

1. Start from Foundation gaps before building new pages:
   - Route groups + layout shells: `(back-office)`, `(storefront)`, `(user)`
   - Freeze design tokens and shared UI state patterns
2. Reuse existing baselines instead of recreating:
   - `app/providers.tsx`
   - `shared/lib/query/query-client.tsx`
   - `shared/lib/query/query-keys.ts`
   - `shared/lib/http/api-client.ts`
   - `features/cart/store/*`
   - `features/inventory/store/*`
   - `features/account/store/*`
3. Keep architecture boundaries:
   - `app -> features -> shared/core`
   - Do not place domain logic inside route files under `app/*`
4. API boundary rule (strict):
   - Do not create Next.js API route handlers (`app/api/*`, `route.ts`) for business endpoints
   - Backend APIs are owned by NestJS only; frontend must call NestJS via shared API client
   - If an endpoint is missing, document contract gap and stop; do not implement API in frontend
5. Color semantics rule (strict):
   - Cancel button uses neutral/outline, not red
   - Red is reserved for destructive and error states only
   - Notification colors must map to semantic type: info (blue), success (green), warning (amber), error (red)
   - Follow `docs/specs/color-semantics-instruction.md` and token contract in `shared/config/design-tokens.ts`

## Week 1: Foundation + System UI

1. Confirm route map for `(back-office)`, `(storefront)`, `(user)`
2. Freeze design tokens and global layout rules
3. Implement app providers (theme, query, toast)
4. Set baseline global stores (cart, inventory UI, account preferences)
5. Define query key strategy and API client adapter
6. Add `typecheck` and run quality gates (`lint`, `typecheck`, `test`)

**Done when**
1. Team starts each feature without re-deciding state architecture
2. Shared patterns for loading/empty/error are agreed and reusable

## Week 2: Back Office Inventory UI-Only

1. Build route shells and page layouts for 8 inventory screens
2. Build reusable table/filter/form sections with realistic mock data
3. Wire interaction states (open/close drawer, filters, action confirms)
4. Add responsive behavior and accessibility checks per page

**Done when**
1. Inventory journey is demo-ready without backend dependency
2. All pages have loading/empty/error states

## Week 3: Storefront Commerce UI-Only

1. Build home, navigation, PLP, PDP
2. Build cart and checkout multi-step UI (draft state via store)
3. Add conversion surfaces (trust badges, pricing clarity, CTA hierarchy)
4. Add SEO placeholders (metadata contracts, structured data slots)

**Done when**
1. End-to-end mock purchase flow works on mobile and desktop
2. Core storefront pages follow performance-safe component patterns

## Week 4: Core User UI + Integration Readiness

1. Build auth/account/profile/order history interfaces
2. Finalize role/session behavior and guard requirements
3. Map each screen action to API contract and query key
4. Prepare implementation tickets for feature wiring phase

**Done when**
1. UI for all 3 domains is approved
2. Backend wiring can start without changing UI contracts

## Engineering Guardrails

1. Use React Query for server state, Zustand for client state only
2. Keep data/domain logic out of `app/*` route files
3. Avoid prop chains deeper than 2-3 levels in new code
4. Keep external dependencies behind local adapters
