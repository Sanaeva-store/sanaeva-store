"use client";

import { useState } from "react";
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
import type { Supplier } from "@/features/inventory/api/suppliers.api";
import type { ApiError } from "@/shared/lib/http/api-client";

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function SuppliersPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
    resolver: zodResolver(supplierSchema),
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
      setSuccessMsg(`Supplier "${payload.name}" updated.`);
    } else {
      await createMutation.mutateAsync(payload);
      setSuccessMsg(`Supplier "${payload.name}" created.`);
    }
    setDialogOpen(false);
    reset();
  };

  const handleToggle = async (supplier: Supplier) => {
    setTogglingId(supplier.id);
    setSuccessMsg(null);
    try {
      await toggleMutation.mutateAsync(supplier.id);
      setSuccessMsg(`${supplier.name} is now ${supplier.isActive ? "inactive" : "active"}.`);
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
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your supplier directory
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {successMsg && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {toggleMutation.isError && (
        <Alert variant="destructive">
          <AlertTitle>Toggle Failed</AlertTitle>
          <AlertDescription>{(toggleMutation.error as ApiError)?.message}</AlertDescription>
        </Alert>
      )}

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <CardTitle>All Suppliers</CardTitle>
              </div>
              <CardDescription className="mt-1">
                {isLoading ? "Loading..." : `${data?.total ?? 0} total suppliers`}
              </CardDescription>
            </div>
            {data && data.totalPages > 1 && (
              <Badge variant="secondary" className="text-xs">
                Page {page} of {totalPages}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={6} />}

          {isError && (
            <ErrorState
              title="Failed to load suppliers"
              message={(error as Error)?.message ?? "An error occurred"}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && data && data.data.length === 0 && (
            <EmptyState
              icon={Truck}
              title="No suppliers yet"
              description="Add your first supplier to get started."
              action={{ label: "Add Supplier", onClick: openCreate }}
            />
          )}

          {!isLoading && !isError && data && data.data.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {supplier.email ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {supplier.phone ?? "—"}
                        </TableCell>
                        <TableCell>
                          {supplier.isActive ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(supplier.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Edit"
                              onClick={() => openEdit(supplier)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${supplier.isActive ? "text-muted-foreground hover:text-destructive" : "text-muted-foreground hover:text-green-600"}`}
                              title={supplier.isActive ? "Deactivate" : "Activate"}
                              disabled={togglingId === supplier.id}
                              onClick={() => void handleToggle(supplier)}
                            >
                              {supplier.isActive ? (
                                <PowerOff className="h-4 w-4" />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
            <DialogDescription>
              {editingSupplier
                ? "Update supplier information below."
                : "Fill in the details to add a new supplier."}
            </DialogDescription>
          </DialogHeader>

          {dialogError && (
            <Alert variant="destructive">
              <AlertTitle>
                {dialogError.status === 422 ? "Validation Error" : dialogError.status === 409 ? "Conflict" : "Error"}
              </AlertTitle>
              <AlertDescription className="space-y-1">
                <p>{dialogError.message}</p>
                {dialogError.code && <p className="text-xs opacity-70">Code: {dialogError.code}</p>}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sup-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sup-name"
                placeholder="e.g. ABC Supplier Co."
                className="h-10"
                disabled={isPending}
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sup-email">Email (Optional)</Label>
              <Input
                id="sup-email"
                type="email"
                placeholder="supplier@example.com"
                className="h-10"
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sup-phone">Phone (Optional)</Label>
              <Input
                id="sup-phone"
                type="tel"
                placeholder="+66 81 234 5678"
                className="h-10"
                disabled={isPending}
                {...register("phone")}
              />
            </div>

            <Separator />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? editingSupplier ? "Saving..." : "Creating..."
                  : editingSupplier ? "Save Changes" : "Add Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
