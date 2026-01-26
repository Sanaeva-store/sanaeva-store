"use client"

import { CreditCard, DollarSign, Package, Users } from "lucide-react"
import { Bar, BarChart, XAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function DashboardPage() {
  const chartData = [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 273, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 264, mobile: 170 },
  ].sort((a, b) => (b.desktop + b.mobile) - (a.desktop + a.mobile))

  const orderData = [
    { date: "2024-01-01", orders: 12, revenue: 1200 },
    { date: "2024-01-02", orders: 15, revenue: 1500 },
    { date: "2024-01-03", orders: 8, revenue: 800 },
    { date: "2024-01-04", orders: 20, revenue: 2000 },
    { date: "2024-01-05", orders: 18, revenue: 1800 },
    { date: "2024-01-06", orders: 25, revenue: 2500 },
    { date: "2024-01-07", orders: 22, revenue: 2200 },
  ].sort((a, b) => b.revenue - a.revenue)

  const categoryData = [
    { category: "Electronics", value: 35 },
    { category: "Clothing", value: 25 },
    { category: "Food", value: 20 },
    { category: "Others", value: 20 },
  ].sort((a, b) => b.value - a.value)

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--primary))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--primary-600))",
    },
  } satisfies ChartConfig

  const categoryConfig = {
    value: {
      label: "Sales",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="rounded-lg bg-primary/10 p-2">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-green-500">+20.1%</span>
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <div className="rounded-lg bg-primary/10 p-2">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-green-500">+180.1%</span>
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <div className="rounded-lg bg-primary/10 p-2">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-green-500">+19%</span>
              <span>from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <div className="rounded-lg bg-primary/10 p-2">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-green-500">+201</span>
              <span>since last hour</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total orders</div>
                  <div className="text-2xl font-bold">+2,350</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="text-sm text-muted-foreground">Growth rate</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">+12%</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="text-sm text-muted-foreground">Avg order value</div>
                  <div className="text-2xl font-bold">$1,234.56</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="text-sm text-muted-foreground">Fulfillment rate</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">98.5%</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={categoryConfig}>
            <BarChart data={categoryData}>
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="value" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
