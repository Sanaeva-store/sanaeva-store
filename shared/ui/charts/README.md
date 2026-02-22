# Chart Components

Reusable chart wrapper components built on Recharts + shadcn/ui chart patterns.

## Design Principles

1. **No direct Recharts imports in feature code** - Always import from `@/shared/ui/charts`
2. **Consistent error/loading/empty states** - All charts handle these states uniformly
3. **Type-safe configuration** - Strongly typed props and data structures
4. **Accessibility basics** - Labels, legends, keyboard-friendly controls

## Available Components

### KpiTrendChart

Line chart for KPI trends over time.

```tsx
import { KpiTrendChart } from "@/shared/ui/charts";

<KpiTrendChart
  title="Revenue Trend"
  description="Last 30 days"
  data={[
    { label: "Jan", value: 1000 },
    { label: "Feb", value: 1500 },
    { label: "Mar", value: 1200 },
  ]}
  valueFormatter={(value) => `$${value.toLocaleString()}`}
  loading={false}
  error={undefined}
/>
```

### InventoryBarChart

Bar chart for inventory movements (inbound/outbound).

```tsx
import { InventoryBarChart } from "@/shared/ui/charts";

<InventoryBarChart
  title="Inventory Movement"
  description="Weekly summary"
  data={[
    { label: "Week 1", inbound: 100, outbound: 80 },
    { label: "Week 2", inbound: 120, outbound: 90 },
  ]}
  valueFormatter={(value) => value.toLocaleString()}
  loading={false}
  error={undefined}
/>
```

### CategoryPieChart

Pie/Donut chart for category distribution.

```tsx
import { CategoryPieChart } from "@/shared/ui/charts";

<CategoryPieChart
  title="Product Categories"
  description="Sales distribution"
  data={[
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Food", value: 200 },
  ]}
  valueFormatter={(value) => `${value} units`}
  innerRadius={60} // Set to 0 for pie, >0 for donut
  loading={false}
  error={undefined}
/>
```

## Props Reference

All chart components support:

- `title: string` - Chart title
- `description?: string` - Optional subtitle
- `data: T[]` - Chart data (type varies by component)
- `valueFormatter?: (value: number) => string` - Custom value formatting
- `className?: string` - Additional CSS classes
- `loading?: boolean` - Show loading state
- `error?: string` - Show error message

## State Handling

All charts automatically handle:

1. **Loading state** - Shows "Loading chart data..." message
2. **Error state** - Shows error message in red
3. **Empty state** - Shows "No data available" when data is empty

## Extending

To add new chart types:

1. Create component in `shared/ui/charts/[name]-chart.tsx`
2. Follow existing patterns (loading/error/empty states)
3. Use shadcn/ui `ChartContainer` + `ChartTooltip`
4. Export from `shared/ui/charts/index.ts`
5. Add usage example to this README

## Guardrails

❌ **Don't do this:**
```tsx
// Direct recharts import in feature code
import { LineChart } from "recharts";
```

✅ **Do this instead:**
```tsx
// Import from shared layer
import { KpiTrendChart } from "@/shared/ui/charts";
```

## Related

- [Charting Strategy](../../../docs/specs/charting-strategy.md)
- [shadcn/ui Chart](https://ui.shadcn.com/docs/components/chart)
- [Recharts Documentation](https://recharts.org/)
