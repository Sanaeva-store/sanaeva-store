"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface ProfitCardProps {
  title: string
  amount: string
  trend: string
  trendLabel: string
  data: Array<{ value: number }>
  className?: string
}

export function ProfitCard({
  title,
  amount,
  trend,
  trendLabel,
  data,
  className,
}: Readonly<ProfitCardProps>) {
  const isPositiveTrend = trend.startsWith("+")

  return (
    <Card
      className={cn("relative overflow-hidden text-white", className)}
      style={{ background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)" }}
    >
      <CardContent className="p-6">
        <div className="relative z-10 space-y-4">
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <div className="space-y-2">
            <p className="text-4xl font-bold tracking-tight">{amount}</p>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  isPositiveTrend
                    ? "bg-white/20 text-white"
                    : "bg-semantic-error-bg text-semantic-error-text"
                )}
              >
                {trend}
              </span>
              <span className="text-xs opacity-90">{trendLabel}</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="white" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="white"
                strokeWidth={2}
                fill="url(#profitGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="absolute right-4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      </CardContent>
    </Card>
  )
}
