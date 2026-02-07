"use client"

import { Package, ShoppingCart, Layers, DollarSign, Calendar } from "lucide-react"
import { ChartConfig } from "@/components/ui/chart"
import {
  StatCard,
  ProfitCard,
  TargetPredictionCard,
  StackedBarChart,
} from "@/components/components-design/admin-dashboard-ui"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardPage() {
  const profitData = [
    { value: 45 }, { value: 52 }, { value: 58 }, { value: 62 }, { value: 68 },
    { value: 72 }, { value: 75 }, { value: 78 }, { value: 80 }, { value: 82 },
    { value: 80 }, { value: 78 }, { value: 75 }, { value: 70 }, { value: 65 },
    { value: 58 }, { value: 52 }, { value: 48 }, { value: 45 }, { value: 42 },
    { value: 45 }, { value: 50 }, { value: 55 }, { value: 62 }, { value: 68 },
    { value: 75 }, { value: 80 }, { value: 85 }, { value: 88 }, { value: 90 },
  ]

  const productSaleData = [
    { month: "Jan", food: 2000, drink: 1500, snack: 1200, dessert: 800 },
    { month: "Feb", food: 1800, drink: 2000, snack: 1400, dessert: 900 },
    { month: "Mar", food: 2500, drink: 1800, snack: 1600, dessert: 1000 },
    { month: "Apr", food: 1500, drink: 1200, snack: 1000, dessert: 700 },
    { month: "May", food: 2200, drink: 1600, snack: 1300, dessert: 850 },
    { month: "Jun", food: 2000, drink: 1900, snack: 1500, dessert: 950 },
    { month: "Jul", food: 1700, drink: 1400, snack: 1100, dessert: 750 },
    { month: "Aug", food: 2300, drink: 1700, snack: 1400, dessert: 900 },
    { month: "Sep", food: 2600, drink: 2100, snack: 1700, dessert: 1100 },
    { month: "Okt", food: 2400, drink: 2000, snack: 1600, dessert: 1000 },
    { month: "Des", food: 1900, drink: 1500, snack: 1200, dessert: 800 },
  ]

  const productSaleConfig = {
    food: {
      label: "Food",
      color: "#3b82f6",
    },
    drink: {
      label: "Drink",
      color: "#60a5fa",
    },
    snack: {
      label: "Snack",
      color: "#fb923c",
    },
    dessert: {
      label: "Dessert",
      color: "#fbbf24",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProfitCard
          title="Profit amount"
          amount="$ 15.237.000"
          trend="+16%"
          trendLabel="From the previous week"
          data={profitData}
          className="lg:row-span-2"
        />

        <StatCard
          title="Total Products"
          value="25"
          icon={Package}
          trend="+15%"
          updateDate="20 July 2024"
        />

        <StatCard
          title="Product Category"
          value="4"
          icon={Layers}
          trend="+15%"
          updateDate="20 July 2024"
        />

        <StatCard
          title="Total Sold"
          value="11.967"
          icon={ShoppingCart}
          trend="+15%"
          updateDate="20 July 2024"
        />

        <StatCard
          title="Monthly income"
          value="$ 13.7600"
          icon={DollarSign}
          trend="+15%"
          updateDate="20 July 2024"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StackedBarChart
          title="Product Sale"
          data={productSaleData}
          config={productSaleConfig}
          categories={["food", "drink", "snack", "dessert"]}
          xAxisKey="month"
          className="lg:col-span-2"
          periodSelector={
            <Select defaultValue="monthly">
              <SelectTrigger className="w-[130px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          }
        />

        <TargetPredictionCard
          title="Target Prediction"
          targetAmount="$ 30.000.000"
          currentAmount="$ 15.237.000"
          percentage={52}
          description="Based on the MSME analysis that has been carried out, the development of this business shows a very positive trend."
        />
      </div>
    </div>
  )
}
