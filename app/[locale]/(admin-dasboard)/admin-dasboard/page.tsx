import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
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
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "dashboard-overview");

  return {
    title: `${t("meta.title")} - Sanaeva Store`,
    description: t("meta.description"),
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "dashboard-overview");

  const profitData = [
    { value: 45 }, { value: 52 }, { value: 58 }, { value: 62 }, { value: 68 },
    { value: 72 }, { value: 75 }, { value: 78 }, { value: 80 }, { value: 82 },
    { value: 80 }, { value: 78 }, { value: 75 }, { value: 70 }, { value: 65 },
    { value: 58 }, { value: 52 }, { value: 48 }, { value: 45 }, { value: 42 },
    { value: 45 }, { value: 50 }, { value: 55 }, { value: 62 }, { value: 68 },
    { value: 75 }, { value: 80 }, { value: 85 }, { value: 88 }, { value: 90 },
  ];

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
  ];

  const productSaleConfig = {
    food: { label: t("productSale.food"), color: "var(--primary-500)" },
    drink: { label: t("productSale.drink"), color: "var(--primary-300)" },
    snack: { label: t("productSale.snack"), color: "var(--secondary-300)" },
    dessert: { label: t("productSale.dessert"), color: "var(--lms-warning-500)" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProfitCard
          title={t("profitCard.title")}
          amount={t("profitCard.amount")}
          trend={t("profitCard.trend")}
          trendLabel={t("profitCard.trendLabel")}
          data={profitData}
          className="lg:row-span-2"
        />

        <StatCard
          title={t("stats.totalProducts")}
          value="25"
          icon="Package"
          trend={t("stats.trend")}
          updateDate={t("stats.updateDate")}
        />

        <StatCard
          title={t("stats.productCategory")}
          value="4"
          icon="Layers"
          trend={t("stats.trend")}
          updateDate={t("stats.updateDate")}
        />

        <StatCard
          title={t("stats.totalSold")}
          value="11.967"
          icon="ShoppingCart"
          trend={t("stats.trend")}
          updateDate={t("stats.updateDate")}
        />

        <StatCard
          title={t("stats.monthlyIncome")}
          value="฿ 13,760"
          icon="DollarSign"
          trend={t("stats.trend")}
          updateDate={t("stats.updateDate")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StackedBarChart
          title={t("productSale.title")}
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
                <SelectItem value="daily">{t("productSale.periodDaily")}</SelectItem>
                <SelectItem value="weekly">{t("productSale.periodWeekly")}</SelectItem>
                <SelectItem value="monthly">{t("productSale.periodMonthly")}</SelectItem>
                <SelectItem value="yearly">{t("productSale.periodYearly")}</SelectItem>
              </SelectContent>
            </Select>
          }
        />

        <TargetPredictionCard
          title={t("targetPrediction.title")}
          targetAmount={t("targetPrediction.targetAmount")}
          currentAmount={t("targetPrediction.currentAmount")}
          percentage={52}
          description={t("targetPrediction.description")}
        />
      </div>
    </div>
  );
}
