"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"

type RadiusTuple = [number, number, number, number]

export interface BarSeriesConfig {
  key: string
  stackId?: string
  radius?: RadiusTuple
}

interface BarChartCardProps {
  title: string
  data: Array<Record<string, string | number>>
  config: ChartConfig
  xAxisKey: string
  series: BarSeriesConfig[]
  className?: string
  chartClassName?: string
  periodSelector?: React.ReactNode
  showLegend?: boolean
}

export function BarChartCard({
  title,
  data,
  config,
  xAxisKey,
  series,
  className,
  chartClassName,
  periodSelector,
  showLegend = true,
}: Readonly<BarChartCardProps>) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {periodSelector}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className={cn("h-[300px] w-full", chartClassName)}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => {
                if (typeof value === "number" && value >= 1000) {
                  return `${value / 1000}k`
                }
                return value.toString()
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {showLegend ? (
              <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />
            ) : null}
            {series.map((item) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                stackId={item.stackId}
                fill={`var(--color-${item.key})`}
                radius={item.radius ?? [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
