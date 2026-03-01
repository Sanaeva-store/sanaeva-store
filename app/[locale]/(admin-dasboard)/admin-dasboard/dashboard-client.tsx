"use client";

import { Calendar } from "lucide-react";
import {
  StatCard,
  ProfitCard,
  TargetPredictionCard,
  StackedBarChart,
} from "@/components/components-design/admin-dashboard-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorState, LoadingSkeleton } from "@/shared/ui";
import { useBackofficeTranslations, formatCurrency } from "@/shared/lib/i18n";
import { useDashboardSummaryQuery } from "@/features/inventory/hooks/use-reports";
import { useOrderSummaryQuery } from "@/features/inventory/hooks/use-orders";
import type { ChartConfig } from "@/components/ui/chart";

// API Gap: product-sale chart data (sales by category/month) has no endpoint
// in frontend-integration-contract-v1.md. Chart remains as a placeholder
// until backend exposes an analytics endpoint.
const CHART_GAP_ACKNOWLEDGED = true as const;

export function DashboardClient() {
  const { t } = useBackofficeTranslations("dashboard-overview");

  const dashboardQuery = useDashboardSummaryQuery();
  const orderSummaryQuery = useOrderSummaryQuery();

  const isLoading = dashboardQuery.isLoading || orderSummaryQuery.isLoading;
  const isError = dashboardQuery.isError || orderSummaryQuery.isError;
  const error = dashboardQuery.error ?? orderSummaryQuery.error;

  const dashboard = dashboardQuery.data;
  const orderSummary = orderSummaryQuery.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <LoadingSkeleton variant="card" count={5} />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <LoadingSkeleton variant="card" count={2} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title={t("error.title")}
        message={
          error instanceof Error ? error.message : t("error.description")
        }
        retry={() => {
          void dashboardQuery.refetch();
          void orderSummaryQuery.refetch();
        }}
      />
    );
  }

  const totalRevenue = parseFloat(dashboard?.totalRevenue ?? "0");
  const totalOrders = dashboard?.totalOrders ?? 0;
  const pendingOrders = dashboard?.pendingOrders ?? 0;
  const lowStockCount = dashboard?.lowStockCount ?? 0;
  const completedOrders = orderSummary?.completedOrders ?? 0;
  const processingOrders = orderSummary?.processingOrders ?? 0;

  const completionPct =
    totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  const productSaleConfig = {
    food: { label: t("productSale.food"), color: "var(--primary-500)" },
    drink: { label: t("productSale.drink"), color: "var(--primary-300)" },
    snack: { label: t("productSale.snack"), color: "var(--secondary-300)" },
    dessert: {
      label: t("productSale.dessert"),
      color: "var(--lms-warning-500)",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProfitCard
          title={t("profitCard.title")}
          amount={formatCurrency(totalRevenue)}
          trend={t("profitCard.trend")}
          trendLabel={t("profitCard.trendLabel")}
          // API Gap: no historical sparkline endpoint in contract v1.1
          data={[]}
          className="lg:row-span-2"
        />

        <StatCard
          title={t("stats.totalOrders")}
          value={String(totalOrders)}
          icon="ShoppingCart"
          trend={t("stats.trend")}
          updateDate={t("stats.updateDate")}
        />

        <StatCard
          title={t("stats.pendingOrders")}
          value={String(pendingOrders)}
          icon="Package"
          trend={t("stats.trend")}
          updateDate={t("stats.updateDate")}
        />

        <StatCard
          title={t("stats.processingOrders")}
          value={String(processingOrders)}
          icon="Layers"
          trend={t("stats.trend")}
          updateDate={t("stats.updateDate")}
        />

        <StatCard
          title={t("stats.lowStockItems")}
          value={String(lowStockCount)}
          icon="TrendingUp"
          trend={t("stats.trend")}
          updateDate={t("stats.updateDate")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* API Gap: product-sale chart requires analytics endpoint not in contract v1.1 */}
        {CHART_GAP_ACKNOWLEDGED && (
          <StackedBarChart
            title={t("productSale.title")}
            data={[]}
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
                  <SelectItem value="daily">
                    {t("productSale.periodDaily")}
                  </SelectItem>
                  <SelectItem value="weekly">
                    {t("productSale.periodWeekly")}
                  </SelectItem>
                  <SelectItem value="monthly">
                    {t("productSale.periodMonthly")}
                  </SelectItem>
                  <SelectItem value="yearly">
                    {t("productSale.periodYearly")}
                  </SelectItem>
                </SelectContent>
              </Select>
            }
          />
        )}

        <TargetPredictionCard
          title={t("targetPrediction.title")}
          targetAmount={formatCurrency(totalRevenue)}
          currentAmount={formatCurrency(
            parseFloat(orderSummary?.totalRevenue ?? "0"),
          )}
          percentage={completionPct}
          description={t("targetPrediction.description")}
        />
      </div>
    </div>
  );
}
