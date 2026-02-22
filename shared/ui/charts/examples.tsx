"use client";

import { KpiTrendChart, InventoryBarChart, CategoryPieChart } from "./index";

export function ChartExamples() {
  const kpiData = [
    { label: "Jan", value: 12000 },
    { label: "Feb", value: 15000 },
    { label: "Mar", value: 13500 },
    { label: "Apr", value: 18000 },
    { label: "May", value: 16500 },
    { label: "Jun", value: 20000 },
  ];

  const inventoryData = [
    { label: "Week 1", inbound: 150, outbound: 120 },
    { label: "Week 2", inbound: 180, outbound: 140 },
    { label: "Week 3", inbound: 160, outbound: 130 },
    { label: "Week 4", inbound: 200, outbound: 170 },
  ];

  const categoryData = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Food & Beverage", value: 200 },
    { name: "Home & Garden", value: 150 },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Chart Component Examples</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <KpiTrendChart
          title="Revenue Trend"
          description="Monthly revenue for the past 6 months"
          data={kpiData}
          valueFormatter={(value) => `$${value.toLocaleString()}`}
        />

        <InventoryBarChart
          title="Inventory Movement"
          description="Weekly inbound vs outbound"
          data={inventoryData}
          valueFormatter={(value) => `${value} units`}
        />

        <CategoryPieChart
          title="Product Categories"
          description="Sales distribution by category"
          data={categoryData}
          valueFormatter={(value) => `${value} items`}
        />

        <CategoryPieChart
          title="Category Donut Chart"
          description="Same data as donut chart"
          data={categoryData}
          valueFormatter={(value) => `${value} items`}
          innerRadius={60}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">State Examples</h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <KpiTrendChart
            title="Loading State"
            description="Chart is loading"
            data={[]}
            loading={true}
          />

          <KpiTrendChart
            title="Error State"
            description="Failed to load data"
            data={[]}
            error="Failed to fetch chart data. Please try again."
          />

          <KpiTrendChart
            title="Empty State"
            description="No data available"
            data={[]}
          />
        </div>
      </div>
    </div>
  );
}
