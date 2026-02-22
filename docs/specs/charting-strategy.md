# Charting Strategy (Recharts + shadcn/ui)

**Status**: ✅ Approved  
**Last Updated**: 2026-02-21

## Decision

1. Use `Recharts` as the chart engine
2. Use `shadcn/ui chart` patterns as presentation wrapper
3. Expose project-level chart components via shared layer (no direct Recharts usage in feature pages)

## Why This Decision

1. Recharts provides flexible chart primitives and mature ecosystem for business dashboards
2. shadcn chart keeps visual consistency with design tokens and existing UI system
3. Wrapper approach prevents vendor lock-in and reduces refactor cost

## Implementation Rules

1. Build reusable chart components in `shared/ui/charts/*`
2. Feature modules must import from `shared/ui/charts/*`, not from `recharts` directly
3. Keep chart config strongly typed and colocated with chart component
4. Support loading, empty, and error state for every chart surface
5. Ensure accessibility basics: labels, legends, contrast, keyboard-friendly surrounding controls

## Initial Scope

1. KPI trend line chart
2. Inventory movement bar chart
3. Category mix pie/donut chart
4. Reusable tooltip + legend components

## Guardrails

1. No direct `recharts` imports inside `app/*` routes
2. No chart business logic inside presentation components
3. Large datasets must be aggregated server-side before rendering
