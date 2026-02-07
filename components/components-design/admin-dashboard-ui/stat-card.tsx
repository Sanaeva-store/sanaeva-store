"use client"

import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendLabel?: string
  updateDate?: string
  className?: string
  iconClassName?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  updateDate,
  className,
  iconClassName,
}: Readonly<StatCardProps>) {
  const isPositiveTrend = trend?.startsWith("+")

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100",
                  iconClassName
                )}
              >
                <Icon className="h-5 w-5 text-orange-600" />
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
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                isPositiveTrend
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              )}
            >
              <span>{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
