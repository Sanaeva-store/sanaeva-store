"use client";

import { useMemo, useState } from "react";
import { TicketPercent } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/shared/ui";
import { usePromotionsQuery, useTogglePromotionMutation } from "@/features/inventory/hooks/use-promotions";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export function PromotionsClient() {
  const { t } = useBackofficeTranslations("sidebar");
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState<"ALL" | "true" | "false">("ALL");

  const params = useMemo(
    () => ({
      page,
      limit: 20,
      isActive: isActive === "ALL" ? undefined : isActive === "true",
    }),
    [isActive, page],
  );

  const { data, isLoading, isError, error, refetch } = usePromotionsQuery(params);
  const toggle = useTogglePromotionMutation();

  const items = data?.data ?? [];
  const maxPage = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TicketPercent className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.promotionList")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.promotions")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.promotionList")}</CardTitle>
          <CardDescription>Connected to `GET /api/promotions` + `POST /api/promotions/:id/toggle`</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-[240px] space-y-2">
            <label htmlFor="promotion-active" className="text-sm font-medium">Status</label>
            <select
              id="promotion-active"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={isActive}
              onChange={(e) => {
                setPage(1);
                setIsActive(e.target.value as "ALL" | "true" | "false");
              }}
            >
              <option value="ALL">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {isLoading && <LoadingSkeleton variant="table" count={8} />}

          {isError && (
            <ErrorState
              title="Failed to load promotions"
              message={(error as Error)?.message}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No promotions" description="No records matched current filters." />
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((promotion) => (
                      <TableRow key={promotion.id}>
                        <TableCell className="font-medium">{promotion.name}</TableCell>
                        <TableCell>{promotion.type}</TableCell>
                        <TableCell>{promotion.code ?? "-"}</TableCell>
                        <TableCell className="text-right">{promotion.discountValue}</TableCell>
                        <TableCell>
                          <Badge variant={promotion.isActive ? "default" : "secondary"}>
                            {promotion.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={toggle.isPending}
                            onClick={() => toggle.mutate(promotion.id, { onError: (e) => toast.error((e as Error).message ?? "Toggle failed") })}
                          >
                            Toggle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {data?.page ?? 1} of {maxPage} ({data?.total ?? 0} promotions)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= maxPage}
                    onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
