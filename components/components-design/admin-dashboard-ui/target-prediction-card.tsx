"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TargetPredictionCardProps {
  title: string
  targetAmount: string
  currentAmount: string
  percentage: number
  description: string
  className?: string
}

export function TargetPredictionCard({
  title,
  targetAmount,
  currentAmount,
  percentage,
  description,
  className,
}: Readonly<TargetPredictionCardProps>) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-center text-3xl font-bold">{targetAmount}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{percentage}%</span>
              <span>{currentAmount}</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-justify text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>

        <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          See More
        </Button>
      </CardContent>
    </Card>
  )
}
