"use client";

import { useState } from "react";
import { TicketPercent } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSkeleton, ErrorState } from "@/shared/ui";
import {
  usePromotionDetailQuery,
  useUpdatePromotionMutation,
  useTogglePromotionMutation,
  useSimulateDiscountMutation,
  useStackingRulesQuery,
  useCreateStackingRuleMutation,
} from "@/features/inventory/hooks/use-promotions";
import type { PromotionType } from "@/features/inventory/api/promotions.api";
import { formatDate, useBackofficeTranslations } from "@/shared/lib/i18n";
import { useLocale } from "@/shared/lib/i18n/use-locale";
import { BackButton } from "@/components/common/back-button";

const PROMOTION_TYPES: PromotionType[] = ["PERCENTAGE", "FIXED_AMOUNT", "BUY_X_GET_Y", "FREE_SHIPPING"];

const editSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "BUY_X_GET_Y", "FREE_SHIPPING"]),
  discountValue: z.coerce.number().positive("Discount value must be > 0"),
  minOrderAmount: z.coerce.number().optional(),
  maxUsageCount: z.coerce.number().int().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

const simulateSchema = z.object({
  codes: z.string().min(1, "Enter at least one code"),
  subtotal: z.coerce.number().positive("Subtotal must be > 0"),
});

type SimulateFormValues = z.infer<typeof simulateSchema>;

const stackingSchema = z.object({
  allowedWithPromotionId: z.string().min(1, "Promotion ID is required"),
});

type StackingFormValues = z.infer<typeof stackingSchema>;

interface Props {
  id: string;
}

export function PromotionDetailClient({ id }: Props) {
  const currentLocale = useLocale();
  const { locale } = useBackofficeTranslations("sidebar");
  const [showEdit, setShowEdit] = useState(false);

  const { data: promotion, isLoading, isError, error, refetch } = usePromotionDetailQuery(id);
  const { data: stackingRules } = useStackingRulesQuery(id);
  const updateMutation = useUpdatePromotionMutation();
  const toggleMutation = useTogglePromotionMutation();
  const simulateMutation = useSimulateDiscountMutation();
  const createStackingRuleMutation = useCreateStackingRuleMutation();

  const {
    register: registerEdit,
    handleSubmit: handleEdit,
    formState: { errors: editErrors },
  } = useForm<EditFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editSchema) as any,
    values: promotion
      ? {
          name: promotion.name,
          code: promotion.code ?? "",
          type: promotion.type,
          discountValue: Number.parseFloat(promotion.discountValue),
          minOrderAmount: promotion.minOrderAmount ? Number.parseFloat(promotion.minOrderAmount) : undefined,
          maxUsageCount: promotion.maxUsageCount ?? undefined,
          startsAt: promotion.startsAt ?? "",
          expiresAt: promotion.expiresAt ?? "",
        }
      : undefined,
  });

  const {
    register: registerSimulate,
    handleSubmit: handleSimulate,
    formState: { errors: simulateErrors },
    reset: resetSimulate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<SimulateFormValues>({ resolver: zodResolver(simulateSchema) as any });

  const {
    register: registerStacking,
    handleSubmit: handleStacking,
    formState: { errors: stackingErrors },
    reset: resetStacking,
  } = useForm<StackingFormValues>({ resolver: zodResolver(stackingSchema) });

  const onEdit = (values: EditFormValues) => {
    updateMutation.mutate(
      { id, payload: values },
      {
        onSuccess: () => { toast.success("Promotion updated"); setShowEdit(false); },
        onError: (e) => toast.error((e as Error).message ?? "Update failed"),
      },
    );
  };

  const onSimulate = (values: SimulateFormValues) => {
    simulateMutation.mutate(
      { codes: values.codes.split(",").map((c) => c.trim()), subtotal: values.subtotal },
      {
        onSuccess: (result) =>
          toast.success(`Total discount: ${result.totalDiscount} → Final: ${result.finalTotal}`),
        onError: (e) => toast.error((e as Error).message ?? "Simulate failed"),
      },
    );
    resetSimulate();
  };

  const onCreateStackingRule = (values: StackingFormValues) => {
    createStackingRuleMutation.mutate(
      { promotionId: id, payload: { allowedWithPromotionId: values.allowedWithPromotionId } },
      {
        onSuccess: () => { toast.success("Stacking rule added"); resetStacking(); },
        onError: (e) => toast.error((e as Error).message ?? "Failed to add rule"),
      },
    );
  };

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (isError || !promotion)
    return (
      <ErrorState
        title="Failed to load promotion"
        message={(error as Error)?.message ?? "Not found"}
        retry={() => void refetch()}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BackButton
          fallbackHref={`/${currentLocale}/admin-dasboard/promotions`}
          label="Back"
        />
        <TicketPercent className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{promotion.name}</h1>
          <p className="text-sm text-muted-foreground font-mono">{promotion.code ?? "No code"}</p>
        </div>
        <Badge variant={promotion.isActive ? "default" : "secondary"} className="ml-auto">
          {promotion.isActive ? "Active" : "Inactive"}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          disabled={toggleMutation.isPending}
          onClick={() =>
            toggleMutation.mutate(id, {
              onSuccess: () => toast.success("Status toggled"),
              onError: (e) => toast.error((e as Error).message ?? "Toggle failed"),
            })
          }
        >
          {toggleMutation.isPending ? "Toggling..." : "Toggle Status"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowEdit((v) => !v)}>
          {showEdit ? "Cancel Edit" : "Edit"}
        </Button>
      </div>

      {/* Details */}
      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-3">
          <div><span className="font-medium text-muted-foreground">Type</span><p>{promotion.type}</p></div>
          <div><span className="font-medium text-muted-foreground">Discount</span><p>{promotion.discountValue}</p></div>
          <div><span className="font-medium text-muted-foreground">Min Order</span><p>{promotion.minOrderAmount ?? "—"}</p></div>
          <div><span className="font-medium text-muted-foreground">Max Usage</span><p>{promotion.maxUsageCount ?? "Unlimited"}</p></div>
          <div><span className="font-medium text-muted-foreground">Used</span><p>{promotion.usedCount}</p></div>
          <div><span className="font-medium text-muted-foreground">Starts At</span><p>{promotion.startsAt ? formatDate(new Date(promotion.startsAt), locale) : "—"}</p></div>
          <div><span className="font-medium text-muted-foreground">Expires At</span><p>{promotion.expiresAt ? formatDate(new Date(promotion.expiresAt), locale) : "—"}</p></div>
          <div><span className="font-medium text-muted-foreground">Created</span><p>{formatDate(new Date(promotion.createdAt), locale)}</p></div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {showEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Promotion</CardTitle>
            <CardDescription>Connected to `PATCH /api/promotions/:id`</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEdit(onEdit as Parameters<typeof handleEdit>[0])} className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...registerEdit("name")} />
                {editErrors.name && <p className="text-xs text-destructive">{editErrors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <Input id="code" {...registerEdit("code")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Type *</Label>
                <select id="type" {...registerEdit("type")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {PROMOTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <Input id="discountValue" type="number" step="0.01" {...registerEdit("discountValue")} />
                {editErrors.discountValue && <p className="text-xs text-destructive">{editErrors.discountValue.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minOrderAmount">Min Order Amount</Label>
                <Input id="minOrderAmount" type="number" step="0.01" {...registerEdit("minOrderAmount")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="maxUsageCount">Max Usage</Label>
                <Input id="maxUsageCount" type="number" {...registerEdit("maxUsageCount")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="startsAt">Starts At</Label>
                <Input id="startsAt" type="datetime-local" {...registerEdit("startsAt")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiresAt">Expires At</Label>
                <Input id="expiresAt" type="datetime-local" {...registerEdit("expiresAt")} />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Simulate */}
      <Card>
        <CardHeader>
          <CardTitle>Simulate Discount</CardTitle>
          <CardDescription>Connected to `POST /api/promotions/simulate`</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimulate(onSimulate as Parameters<typeof handleSimulate>[0])} className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="codes">Codes (comma-separated)</Label>
              <Input id="codes" placeholder="PROMO1, PROMO2" {...registerSimulate("codes")} />
              {simulateErrors.codes && <p className="text-xs text-destructive">{simulateErrors.codes.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subtotal">Subtotal</Label>
              <Input id="subtotal" type="number" step="0.01" {...registerSimulate("subtotal")} />
              {simulateErrors.subtotal && <p className="text-xs text-destructive">{simulateErrors.subtotal.message}</p>}
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="outline" disabled={simulateMutation.isPending}>
                {simulateMutation.isPending ? "Simulating..." : "Simulate"}
              </Button>
            </div>
          </form>
          {simulateMutation.data && (
            <div className="mt-3 rounded-md bg-muted p-3 text-sm">
              {simulateMutation.data.breakdown.map((b) => (
                <p key={b.code}><span className="font-medium">{b.code}</span>: −{b.discountAmount}</p>
              ))}
              <p className="mt-1 font-semibold">Total discount: {simulateMutation.data.totalDiscount} → Final: {simulateMutation.data.finalTotal}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stacking Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Stacking Rules</CardTitle>
          <CardDescription>Connected to `GET/POST /api/promotions/:id/stacking-rules`</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleStacking(onCreateStackingRule)} className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="allowedWithPromotionId">Allow stacking with Promotion ID</Label>
              <Input id="allowedWithPromotionId" placeholder="promotion-uuid" {...registerStacking("allowedWithPromotionId")} />
              {stackingErrors.allowedWithPromotionId && (
                <p className="text-xs text-destructive">{stackingErrors.allowedWithPromotionId.message}</p>
              )}
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="outline" disabled={createStackingRuleMutation.isPending}>
                Add Rule
              </Button>
            </div>
          </form>

          {stackingRules && stackingRules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Allowed With Promotion ID</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stackingRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-mono text-sm">{rule.allowedWithPromotionId}</TableCell>
                    <TableCell>{formatDate(new Date(rule.createdAt), locale)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No stacking rules defined.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
