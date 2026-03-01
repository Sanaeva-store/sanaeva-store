"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Pencil, Plus, Power, PowerOff, Truck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/shared/ui";
import {
  useSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useToggleSupplierStatusMutation,
} from "@/features/inventory/hooks/use-suppliers";
import { INVENTORY_FORM_UI } from "@/features/inventory/constants/form-ui";
import type { Supplier } from "@/features/inventory/api/suppliers.api";
import type { ApiError } from "@/shared/lib/http/api-client";
import { formatDate, useBackofficeTranslations } from "@/shared/lib/i18n";

export default function SuppliersPage() {
  const { t, locale } = useBackofficeTranslations("inventory-suppliers");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("errors.nameRequired")),
        email: z.string().email(t("errors.invalidEmail")).optional().or(z.literal("")),
        phone: z.string().optional(),
      }),
    [t],
  );

  type SupplierFormValues = z.infer<typeof schema>;

  const { data, isLoading, isError, error, refetch } = useSuppliersQuery({ page, limit });
  const createMutation = useCreateSupplierMutation();
  const updateMutation = useUpdateSupplierMutation();
  const toggleMutation = useToggleSupplierStatusMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => {
    setEditingSupplier(null);
    reset({ name: "", email: "", phone: "" });
    createMutation.reset();
    updateMutation.reset();
    setDialogOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    reset({ name: supplier.name, email: supplier.email ?? "", phone: supplier.phone ?? "" });
    createMutation.reset();
    updateMutation.reset();
    setDialogOpen(true);
  };

  const onSubmit = async (values: SupplierFormValues) => {
    setSuccessMsg(null);
    const payload = {
      name: values.name.trim(),
      email: values.email?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
    };
    if (editingSupplier) {
      await updateMutation.mutateAsync({ id: editingSupplier.id, payload });
      setSuccessMsg(t("messages.updated", undefined, { name: payload.name }));
    } else {
      await createMutation.mutateAsync(payload);
      setSuccessMsg(t("messages.created", undefined, { name: payload.name }));
    }
    setDialogOpen(false);
    reset();
  };

  const handleToggle = async (supplier: Supplier) => {
    setTogglingId(supplier.id);
    setSuccessMsg(null);
    try {
      await toggleMutation.mutateAsync(supplier.id);
      setSuccessMsg(
        t("messages.statusNow", undefined, {
          name: supplier.name,
          status: supplier.isActive ? t("table.inactive") : t("table.active"),
        }),
      );
    } finally {
      setTogglingId(null);
    }
  };

  const dialogError = (editingSupplier ? updateMutation.error : createMutation.error) as ApiError | null;
  const isPending = isSubmitting || createMutation.isPending || updateMutation.isPending;

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addSupplier")}
        </Button>
      </div>

      {successMsg && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>{t("successTitle")}</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {toggleMutation.isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("toggleFailed")}</AlertTitle>
          <AlertDescription>{(toggleMutation.error as ApiError)?.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <CardTitle>{t("table.title")}</CardTitle>
              </div>
              <CardDescription className="mt-1">
                {isLoading ? t("table.loading") : `${data?.total ?? 0} ${t("table.totalSuppliers")}`}
              </CardDescription>
            </div>
            {data && data.totalPages > 1 && (
              <Badge variant="secondary" className="text-xs">
                {t("table.pageOf", undefined, { page, totalPages })}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={6} />}

          {isError && (
            <ErrorState
              title={t("table.loadFailed")}
              message={(error as Error)?.message ?? ""}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && data && data.data.length === 0 && (
            <EmptyState
              icon={Truck}
              title={t("table.emptyTitle")}
              description={t("table.emptyDescription")}
              action={{ label: t("addSupplier"), onClick: openCreate }}
            />
          )}

          {!isLoading && !isError && data && data.data.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("table.columns.name")}</TableHead>
                      <TableHead>{t("table.columns.email")}</TableHead>
                      <TableHead>{t("table.columns.phone")}</TableHead>
                      <TableHead>{t("table.columns.status")}</TableHead>
                      <TableHead>{t("table.columns.created")}</TableHead>
                      <TableHead className="text-right">{t("table.columns.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{supplier.email ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{supplier.phone ?? "—"}</TableCell>
                        <TableCell>
                          {supplier.isActive ? (
                            <Badge variant="success" className="text-xs">{t("table.active")}</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">{t("table.inactive")}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatDate(new Date(supplier.createdAt), locale)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title={t("table.edit")} onClick={() => openEdit(supplier)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${supplier.isActive ? "text-muted-foreground hover:text-destructive" : "text-muted-foreground hover:text-semantic-success-text"}`}
                              title={supplier.isActive ? t("table.deactivate") : t("table.activate")}
                              disabled={togglingId === supplier.id}
                              onClick={() => void handleToggle(supplier)}
                            >
                              {supplier.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{t("table.pageOf", undefined, { page, totalPages })}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                      {t("table.previous")}
                    </Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                      {t("table.next")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? t("dialog.editTitle") : t("dialog.addTitle")}</DialogTitle>
            <DialogDescription>
              {editingSupplier ? t("dialog.editDescription") : t("dialog.addDescription")}
            </DialogDescription>
          </DialogHeader>

          {dialogError && (
            <Alert variant="destructive">
              <AlertTitle>
                {dialogError.status === 422
                  ? t("errors.validation")
                  : dialogError.status === 409
                    ? t("errors.conflict")
                    : t("errors.generic")}
              </AlertTitle>
              <AlertDescription className="space-y-1">
                <p>{dialogError.message}</p>
                {dialogError.code && <p className="text-xs opacity-70">Code: {dialogError.code}</p>}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sup-name">{t("dialog.name")} <span className="text-destructive">*</span></Label>
              <Input id="sup-name" placeholder={t("dialog.namePlaceholder")} className={INVENTORY_FORM_UI.control} disabled={isPending} {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sup-email">{t("dialog.email")}</Label>
              <Input id="sup-email" type="email" placeholder={t("dialog.emailPlaceholder")} className={INVENTORY_FORM_UI.control} disabled={isPending} {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sup-phone">{t("dialog.phone")}</Label>
              <Input id="sup-phone" type="tel" placeholder={t("dialog.phonePlaceholder")} className={INVENTORY_FORM_UI.control} disabled={isPending} {...register("phone")} />
            </div>

            <Separator />

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" disabled={isPending} onClick={() => setDialogOpen(false)}>
                {t("dialog.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? editingSupplier ? t("dialog.saving") : t("dialog.creating")
                  : editingSupplier ? t("dialog.saveChanges") : t("dialog.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
