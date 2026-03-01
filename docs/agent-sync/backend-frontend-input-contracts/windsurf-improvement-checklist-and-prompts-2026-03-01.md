# Windsurf Improvement Checklist + Prompts (2026-03-01)

## Scope
Checklist and implementation prompts for admin/back-office improvements, with focus on UX consistency, error handling, responsive behavior, and bug fixes.

## Global Definition of Done
- [ ] Use `bun` only for scripts and package commands.
- [ ] `bun run lint` passes.
- [ ] `bun run typecheck` passes.
- [ ] `bun run test` passes (or explain if not applicable).
- [ ] All touched pages have proper loading, error, empty, and success states.
- [ ] Responsive behavior is verified on mobile/tablet/desktop.
- [ ] Thai/English i18n strings are complete (no hardcoded mixed language in UI).
- [ ] No silent errors; user-friendly error messages are shown.

---

## PR-0 Baseline Audit + Bug List
### Checklist
- [ ] Audit every admin menu route and identify broken/incomplete behavior.
- [ ] Create issue checklist by route: `UI`, `API wiring`, `State`, `Validation`, `Error display`, `Responsive`.
- [ ] Capture high-priority bugs for Product CRUD, Sign out, and key operational pages.
- [ ] Add quick smoke coverage for critical navigation and main actions.

### Prompt for Windsurf
```text
Audit all admin/back-office menu pages and produce a route-by-route checklist with status:
- UI completeness
- API connected/not connected
- loading/error/empty states
- responsive issues
- action issues (create/update/delete/sign out)
Then implement quick fixes for critical/high-impact bugs only in this PR.

Rules:
- Use bun only.
- Keep changes minimal and scoped.
- Do not broad-refactor.

Validation:
- bun run lint
- bun run typecheck

Output:
1) Audit checklist by route
2) Files changed
3) Bugs fixed in this PR
4) Remaining bugs backlog
```

---

## PR-1 Multiple Image Upload + Preview (Create Product)
### Checklist
- [ ] Support selecting multiple images.
- [ ] Show preview thumbnails before submit.
- [ ] Allow remove image from selected list.
- [ ] Validate file type and max file size.
- [ ] Show clear inline error per invalid file.
- [ ] Show uploading/progress/loading state.
- [ ] Ensure mobile responsive gallery layout.

### Prompt for Windsurf
```text
Implement multiple image upload with preview in Create Product page.

Requirements:
- Multiple file input for product images
- Preview thumbnails before submit
- Remove selected image
- Validate file type and size with friendly error messages
- Handle uploading/loading/progress state
- Keep responsive layout

Technical constraints:
- Reuse existing UI components and patterns
- Do not introduce new dependency unless required
- Keep App Router and client/server boundaries safe

Validation:
- bun run lint
- bun run typecheck

Output:
- Summary
- Changed files
- UX behavior notes
- Validation result
```

---

## PR-2 Improve Product Create / Update / Delete / Preview
### Checklist
- [ ] Ensure Create product flow is complete and robust.
- [ ] Ensure Update product flow handles loading/disabled state.
- [ ] Ensure Delete action handles confirmation and error fallback.
- [ ] Improve Product preview page consistency and data rendering.
- [ ] Ensure all actions show success/error feedback.
- [ ] Normalize API and validation error display.

### Prompt for Windsurf
```text
Improve Product pages: Create, Update, Delete, and Preview.

Requirements:
- Complete missing action wiring
- Disable action buttons while request is in-flight
- Show clear success and error messages
- Distinguish validation errors from API/server errors
- Ensure preview page shows complete and consistent product data

Validation:
- bun run lint
- bun run typecheck

Output:
- Summary
- Changed files
- Action scenario test matrix
- Validation result
```

---

## PR-3 Breadcrumb UI + Back Navigation
### Checklist
- [ ] Create/standardize shared breadcrumb style for all admin pages.
- [ ] Fix inconsistent/wired-looking `Back to ...` buttons.
- [ ] Back behavior uses safe fallback when browser history is absent.
- [ ] Verify consistency on product-related pages first, then all pages.

### Prompt for Windsurf
```text
Improve breadcrumb design and normalize Back navigation behavior across admin pages.

Requirements:
- Shared breadcrumb visual design and spacing
- Replace inconsistent back button behaviors
- Back action must have fallback route when history is unavailable
- Keep responsive and accessible

Validation:
- bun run lint
- bun run typecheck

Output:
- Summary
- Changed files
- Before/after navigation behavior
- Validation result
```

---

## PR-4 Language Selector Shared Component (Admin + Signin)
### Checklist
- [ ] Build one reusable language selector component.
- [ ] Add flag icon in language options.
- [ ] Use same component in admin navbar and signin page.
- [ ] Keep locale state and selected language consistent.
- [ ] Ensure Thai/English labels and accessibility.

### Prompt for Windsurf
```text
Implement a shared language selector component with flags and use it in:
1) Admin navbar
2) Signin page

Requirements:
- Reusable shared component
- Thai/English support with visual flag indicators
- Preserve locale switching behavior
- No visual regression on current navbar/signin layouts

Validation:
- bun run lint
- bun run typecheck

Output:
- Summary
- Changed files
- i18n behavior checks
- Validation result
```

---

## PR-5 Confirmation Modal for Update / Delete / Sign out
### Checklist
- [ ] Shared confirmation modal component exists.
- [ ] `Update` actions with side effects require confirmation (where applicable).
- [ ] `Delete` actions require confirmation.
- [ ] `Sign out` requires confirmation.
- [ ] Confirm/cancel paths are tested with correct outcomes.

### Prompt for Windsurf
```text
Add a shared confirmation modal and enforce it for risky actions.

Actions:
- Update (where meaningful and risky)
- Delete
- Sign out

Requirements:
- Shared reusable confirmation dialog
- Action-specific title/description in Thai/English
- Correct confirm/cancel behavior with loading/error handling

Validation:
- bun run lint
- bun run typecheck

Output:
- Summary
- Changed files
- Action coverage list
- Validation result
```

---

## PR-6 Mini Manual `?` Icon on Every Admin Menu Page (TH/EN)
### Checklist
- [ ] Add `?` help icon to each admin page header.
- [ ] Show concise page manual: purpose, key actions, cautions.
- [ ] Provide both Thai and English content.
- [ ] Use i18n dictionary/messages, avoid hardcoded strings in components.

### Prompt for Windsurf
```text
Add a mini manual help feature using a `?` icon on every admin page.

Requirements:
- Reusable help trigger component
- Per-page content: what this page does, key actions, cautions
- Thai and English content
- Follow existing i18n structure

Validation:
- bun run lint
- bun run typecheck

Output:
- Summary
- Changed files
- Page coverage checklist
- Validation result
```

---

## PR-7 Button Icons + Input Group & Button Alignment
### Checklist
- [ ] Add icons to important buttons (`Save`, `Delete`, `Back`, `Add`, `Confirm`).
- [ ] Standardize input/select/button heights.
- [ ] Standardize spacing and alignment in input groups.
- [ ] Fix misalignment in responsive breakpoints.

### Prompt for Windsurf
```text
Improve UI consistency for important buttons and form alignment.

Requirements:
- Add meaningful icons to important buttons
- Standardize control height (input/select/button)
- Fix input-group and button alignment issues
- Ensure responsive behavior and no clipping/wrapping issues

Validation:
- bun run lint
- bun run typecheck

Output:
- Summary
- Changed files
- UI consistency checklist
- Validation result
```

---

## PR-8 Page Transition + Loading Animation + Dynamic Page States
### Checklist
- [ ] Improve page transition with subtle motion.
- [ ] Unify loading animation/skeleton style.
- [ ] Ensure dynamic pages handle loading/error/empty/success states.
- [ ] Avoid layout shift during transitions/loading.

### Prompt for Windsurf
```text
Improve page transitions, loading animations, and dynamic state handling.

Requirements:
- Add subtle and consistent page transitions
- Unify loading animation/skeleton style
- Ensure dynamic pages robustly handle loading/error/empty/success
- Minimize layout shift and keep UX smooth

Validation:
- bun run lint
- bun run typecheck

Output:
- Summary
- Changed files
- Dynamic state coverage list
- Validation result
```

---

## PR-9 Empty Data Display + Error Handling Hardening
### Checklist
- [ ] Use a standardized empty state component where data is empty.
- [ ] Improve API error normalization to user-friendly messages.
- [ ] Add inline/form-level error display in critical forms.
- [ ] Ensure toast/modal error display is meaningful and actionable.
- [ ] Confirm no silent failure paths remain.

### Prompt for Windsurf
```text
Harden empty-data and error handling experience across admin pages.

Requirements:
- Standard empty state component and messaging
- Normalize API/server errors to user-friendly text
- Improve inline error display for forms and actions
- Remove silent failures and ensure clear fallback UX

Validation:
- bun run lint
- bun run typecheck
- bun run test

Output:
- Summary
- Changed files
- Fixed error scenarios list
- Remaining known issues
- Validation result
```

---

## Final QA Gate (After all PRs)
### Checklist
- [ ] Full regression of product CRUD + image flows.
- [ ] Full regression of sign out and delete confirmations.
- [ ] Verify breadcrumb/back consistency across admin routes.
- [ ] Verify language selector consistency in admin + signin.
- [ ] Verify every admin page has mini manual (`?`) TH/EN.
- [ ] Verify loading/error/empty states visually and functionally.
- [ ] Verify responsive layouts across common viewports.
- [ ] Run full validation command set.

### Prompt for Windsurf
```text
Run final QA and bug bash after implementing all PRs.

Tasks:
- Execute regression on product CRUD + upload/preview
- Validate risky action confirmations
- Validate breadcrumb/back/language/manual consistency
- Validate loading/error/empty states and responsiveness
- Fix high-priority regressions only

Validation:
- bun run lint
- bun run typecheck
- bun run test

Output:
- Final QA report
- Regressions fixed
- Remaining risks
- Ready-to-merge recommendation
```
