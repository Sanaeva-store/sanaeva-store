"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSkeleton, ErrorState } from "@/shared/ui";
import {
  useCycleCountDetailQuery,
  useSubmitCycleCountMutation,
  useCloseCycleCountMutation,
} from "@/features/inventory/hooks/use-cycle-count";
import { formatDate, useBackofficeTranslations } from "@/shared/lib/i18n";

const submitSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string(),
      countedQty: z.coerce.number().int().min(0, "Qty must be ≥ 0"),
    }),
  ),
});

type SubmitFormValues = {
  items: { variantId: string; countedQty: number }[];
};

interface Props {
  id: string;
}

export function CycleCountDetailClient({ id }: Props) {
  const router = useRouter();
  const { locale } = useBackofficeTranslations("sidebar");

  const { data: session, isLoading, isError, error, refetch } = useCycleCountDetailQuery(id);
  const submitMutation = useSubmitCycleCountMutation();
  const closeMutation = useCloseCycleCountMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubmitFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(submitSchema) as any,
    defaultValues: {
      items: session?.items.map((i) => ({ variantId: i.variantId, countedQty: 0 })) ?? [],
    },
  });

  const { fields } = useFieldArray({ control, name: "items" });

  const onSubmit = (values: SubmitFormValues) => {
    submitMutation.mutate(
      { id, payload: { items: values.items } },
      {
        onSuccess: () => toast.success("Count submitted"),
        onError: (e) => toast.error((e as Error).message ?? "Submit failed"),
      },
    );
  };

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (isError || !session)
    return (
      <ErrorState
        title="Failed to load cycle count"
        message={(error as Error)?.message ?? "Not found"}
        retry={() => void refetch()}
      />
    );

  const canSubmit = session.status === "OPEN" || session.status === "IN_PROGRESS";
  const canClose = session.status === "IN_PROGRESS";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <ScanLine className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Cycle Count: {session.code}</h1>
          <p className="text-sm text-muted-foreground">Warehouse: {session.warehouseId}</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {session.status}
        </Badge>
      </div>

      {/* Meta */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm md:grid-cols-3">
          <div>
            <span className="font-medium text-muted-foreground">Created</span>
            <p>{formatDate(new Date(session.createdAt), locale)}</p>
          </div>
          {session.note && (
            <div className="md:col-span-2">
              <span className="font-medium text-muted-foreground">Note</span>
              <p>{session.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Count */}
      {canSubmit && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Count</CardTitle>
            <CardDescription>Connected to `POST /api/cycle-count/:id/count`</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant ID</TableHead>
                    <TableHead className="w-32">Counted Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, idx) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Input {...register(`items.${idx}.variantId`)} readOnly className="bg-muted font-mono" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={0} {...register(`items.${idx}.countedQty`)} className="w-24" />
                        {errors.items?.[idx]?.countedQty && (
                          <p className="text-xs text-destructive">{errors.items[idx]?.countedQty?.message}</p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">No items to count.</p>
              )}
              <Button type="submit" disabled={submitMutation.isPending || fields.length === 0}>
                {submitMutation.isPending ? "Submitting..." : "Submit Count"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Close */}
      {canClose && (
        <Card>
          <CardHeader>
            <CardTitle>Close Session</CardTitle>
            <CardDescription>Connected to `POST /api/cycle-count/:id/close`</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="default"
              disabled={closeMutation.isPending}
              onClick={() =>
                closeMutation.mutate(id, {
                  onSuccess: () => { toast.success("Cycle count closed"); router.back(); },
                  onError: (e) => toast.error((e as Error).message ?? "Close failed"),
                })
              }
            >
              {closeMutation.isPending ? "Closing..." : "Close Cycle Count"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({session.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variant ID</TableHead>
                <TableHead className="text-right">System Qty</TableHead>
                <TableHead className="text-right">Counted Qty</TableHead>
                <TableHead className="text-right">Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.items.map((item) => {
                const variance =
                  item.countedQty !== null && item.countedQty !== undefined
                    ? item.countedQty - item.expectedQty
                    : null;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.variantId}</TableCell>
                    <TableCell className="text-right">{item.expectedQty}</TableCell>
                    <TableCell className="text-right">{item.countedQty ?? "—"}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        variance === null ? "" : variance === 0 ? "text-green-600" : "text-destructive"
                      }`}
                    >
                      {variance === null ? "—" : variance > 0 ? `+${variance}` : variance}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
