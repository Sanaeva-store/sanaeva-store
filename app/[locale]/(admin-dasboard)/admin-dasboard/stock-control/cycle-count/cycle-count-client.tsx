"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  useCycleCountsQuery,
  useCreateCycleCountMutation,
  useCloseCycleCountMutation,
} from "@/features/inventory/hooks/use-cycle-count";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

const schema = z.object({
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CycleCountClient() {
  const { t } = useBackofficeTranslations("sidebar");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useCycleCountsQuery({ page, limit: 20 });
  const createMutation = useCreateCycleCountMutation();
  const closeMutation = useCloseCycleCountMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { warehouseId: "", note: "" },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(
      {
        warehouseId: values.warehouseId.trim(),
        note: values.note?.trim() || undefined,
      },
      { onSuccess: () => reset(), onError: (e) => toast.error((e as Error).message ?? "Create failed") },
    );
  };

  const items = data?.data ?? [];
  const maxPage = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ScanLine className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.cycleCount")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.stockControl")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Cycle Count</CardTitle>
          <CardDescription>Connected to `POST /api/cycle-count`</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="warehouseId">Warehouse ID</Label>
              <Input id="warehouseId" {...register("warehouseId")} />
              {errors.warehouseId && (
                <p className="text-xs text-destructive">{errors.warehouseId.message}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note">Note</Label>
              <Input id="note" {...register("note")} />
            </div>
            <div>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.cycleCount")}</CardTitle>
          <CardDescription>Connected to `GET /api/cycle-count` + `POST /api/cycle-count/:id/close`</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={7} />}

          {isError && (
            <ErrorState
              title="Failed to load cycle counts"
              message={(error as Error)?.message}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No cycle count sessions" description="Create your first session." />
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.code}</TableCell>
                        <TableCell>{session.warehouseId}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{session.status}</Badge>
                        </TableCell>
                        <TableCell>{session.items.length}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={closeMutation.isPending || session.status === "CLOSED"}
                            onClick={() => closeMutation.mutate(session.id, { onError: (e) => toast.error((e as Error).message ?? "Close failed") })}
                          >
                            Close
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {data?.page ?? 1} of {maxPage} ({data?.total ?? 0} sessions)
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
