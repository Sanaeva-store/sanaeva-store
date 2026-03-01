"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/shared/ui";
import { usePriceCostAnomaliesQuery } from "@/features/inventory/hooks/use-reports";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

const ANOMALY_VARIANT: Record<string, "destructive" | "outline" | "secondary"> = {
  MISSING_COST: "destructive",
  COST_EXCEEDS_PRICE: "destructive",
  ZERO_MARGIN: "outline",
  BELOW_THRESHOLD: "secondary",
};

export default function ReportPriceCostPage() {
  const { t } = useBackofficeTranslations("sidebar");
  const [minMarginPct, setMinMarginPct] = useState("");

  const parsedMin = minMarginPct.trim() ? Number(minMarginPct.trim()) : undefined;

  const { data, isLoading, isError, error, refetch } = usePriceCostAnomaliesQuery(
    Number.isFinite(parsedMin) ? parsedMin : undefined,
  );

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.reportPriceCost")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.reports")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:w-64">
            <Label htmlFor="minMargin">Min Margin % (optional)</Label>
            <Input
              id="minMargin"
              type="number"
              placeholder="e.g. 10"
              value={minMarginPct}
              onChange={(e) => setMinMarginPct(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.reportPriceCost")}</CardTitle>
          <CardDescription>
            {data ? `${data.total} anomaly(ies) detected` : "Loading…"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={8} />}
          {isError && (
            <ErrorState
              title="Failed to load price-cost anomalies"
              message={(error as { message?: string })?.message ?? "An unexpected error occurred."}
              retry={() => void refetch()}
            />
          )}
          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No anomalies" description="No price/cost anomalies detected." />
          )}
          {!isLoading && !isError && items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Anomaly Type</TableHead>
                  <TableHead className="text-right">Margin %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.variantId}>
                    <TableCell className="font-mono">{item.sku}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.cost ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={ANOMALY_VARIANT[item.anomalyType] ?? "secondary"}>
                        {item.anomalyType.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.marginPct != null ? `${item.marginPct.toFixed(1)}%` : "—"}
                    </TableCell>
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
