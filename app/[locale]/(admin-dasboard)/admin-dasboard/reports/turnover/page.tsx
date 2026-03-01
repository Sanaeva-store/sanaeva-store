"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/shared/ui";
import { useTurnoverReportQuery } from "@/features/inventory/hooks/use-reports";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export default function ReportTurnoverPage() {
  const { t } = useBackofficeTranslations("sidebar");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const params = {
    ...(from.trim() ? { from: from.trim() } : {}),
    ...(to.trim() ? { to: to.trim() } : {}),
  };

  const { data, isLoading, isError, error, refetch } = useTurnoverReportQuery(params);

  const items = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.reportTurnover")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.reports")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="turnoverFrom">From Date (optional)</Label>
              <Input id="turnoverFrom" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="turnoverTo">To Date (optional)</Label>
              <Input id="turnoverTo" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.reportTurnover")}</CardTitle>
          <CardDescription>{items.length} SKU(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={8} />}
          {isError && (
            <ErrorState
              title="Failed to load turnover report"
              message={(error as { message?: string })?.message ?? "An unexpected error occurred."}
              retry={() => void refetch()}
            />
          )}
          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No data" description="No turnover data for the selected period." />
          )}
          {!isLoading && !isError && items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Sold Qty</TableHead>
                  <TableHead className="text-right">Sold Value</TableHead>
                  <TableHead className="text-right">Turnover Rate</TableHead>
                  <TableHead>Period</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.variantId}>
                    <TableCell className="font-mono">{item.sku}</TableCell>
                    <TableCell className="text-right">{item.soldQty}</TableCell>
                    <TableCell className="text-right">{item.soldValue}</TableCell>
                    <TableCell className="text-right">{item.turnoverRate.toFixed(2)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.period}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
