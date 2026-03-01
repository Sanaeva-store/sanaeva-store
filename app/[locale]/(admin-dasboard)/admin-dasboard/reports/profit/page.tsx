"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LoadingSkeleton, ErrorState } from "@/shared/ui";
import { useProfitSummaryQuery } from "@/features/inventory/hooks/use-reports";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export default function ReportProfitPage() {
  const { t } = useBackofficeTranslations("sidebar");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const params = {
    ...(from.trim() ? { from: from.trim() } : {}),
    ...(to.trim() ? { to: to.trim() } : {}),
  };

  const { data, isLoading, isError, error, refetch } = useProfitSummaryQuery(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.reportProfit")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.reports")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="profitFrom">From Date (optional)</Label>
              <Input id="profitFrom" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="profitTo">To Date (optional)</Label>
              <Input id="profitTo" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.reportProfit")}</CardTitle>
          <CardDescription>
            {data ? `Period: ${data.period}` : "Profit & loss summary"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="card" count={4} />}
          {isError && (
            <ErrorState
              title="Failed to load profit summary"
              message={(error as { message?: string })?.message ?? "An unexpected error occurred."}
              retry={() => void refetch()}
            />
          )}
          {!isLoading && !isError && data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="mt-1 text-2xl font-bold">{data.totalRevenue}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="mt-1 text-2xl font-bold">{data.totalCost}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Gross Profit</p>
                  <p className="mt-1 text-2xl font-bold text-semantic-success-text">{data.grossProfit}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Gross Margin</p>
                  <p className="mt-1 text-2xl font-bold">{data.grossMarginPct.toFixed(1)}%</p>
                </div>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">Period: {data.period}</p>
            </div>
          )}
          {!isLoading && !isError && !data && (
            <p className="text-sm text-muted-foreground">No profit data available for the selected range.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
