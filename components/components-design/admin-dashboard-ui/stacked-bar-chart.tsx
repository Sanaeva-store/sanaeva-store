"use client"

import { ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { BarChartCard } from "./bar-chart-card"

interface StackedBarChartProps {
  title: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  categories: string[]
  xAxisKey: string
  className?: string
  showLegend?: boolean
  periodSelector?: React.ReactNode
}

export function StackedBarChart({
  title,
  data,
  config,
  categories,
  xAxisKey,
  className,
  showLegend = true,
  periodSelector,
}: Readonly<StackedBarChartProps>) {
  return (
    <BarChartCard
      title={title}
      data={data}
      config={config}
      xAxisKey={xAxisKey}
      className={cn("", className)}
      periodSelector={periodSelector}
      showLegend={showLegend}
      series={categories.map((category) => ({
        key: category,
        stackId: "a",
        radius: [0, 0, 0, 0],
      }))}
    />
  )
}
