"use client"

import { Package, Layers, ShoppingCart, DollarSign, TrendingUp, Users, BarChart2, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, LucideIcon> = {
  Package,
  Layers,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  BarChart2,
}

interface StatCardProps {
  title: string
  value: string | number
  icon: keyof typeof ICON_MAP
  trend?: string
  trendLabel?: string
  updateDate?: string
  className?: string
  iconClassName?: string
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  updateDate,
  className,
  iconClassName,
}: Readonly<StatCardProps>) {
  const Icon = ICON_MAP[icon] ?? Package
  const isPositiveTrend = trend?.startsWith("+")

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100",
                  iconClassName
                )}
              >
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {title}
              </h3>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{value}</p>
              {updateDate && (
                <p className="text-xs text-muted-foreground">
                  Update: {updateDate}
                </p>
              )}
            </div>
          </div>
          {trend && (
            <div className="flex flex-col items-end gap-1">
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  isPositiveTrend
                    ? "bg-semantic-success-bg text-semantic-success-text"
                    : "bg-semantic-error-bg text-semantic-error-text"
                )}
              >
                <span>{trend}</span>
              </div>
              {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
