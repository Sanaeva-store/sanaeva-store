"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, List } from "lucide-react";
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
import { LoadingSkeleton, ErrorState, EmptyState } from "@/shared/ui";
import {
  usePriceListDetailQuery,
  usePriceListItemsQuery,
  useUpdatePriceListMutation,
  useAddPriceListItemMutation,
} from "@/features/inventory/hooks/use-pricing";
import { formatDate, useBackofficeTranslations } from "@/shared/lib/i18n";

const editSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

const addItemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  price: z.coerce.number().positive("Price must be > 0"),
});

type AddItemFormValues = z.infer<typeof addItemSchema>;

interface Props {
  id: string;
}

export function PriceListDetailClient({ id }: Props) {
  const router = useRouter();
  const { locale } = useBackofficeTranslations("sidebar");

  const { data: priceList, isLoading, isError, error, refetch } = usePriceListDetailQuery(id);
  const { data: items, isLoading: itemsLoading } = usePriceListItemsQuery(id);
  const updateMutation = useUpdatePriceListMutation();
  const addItemMutation = useAddPriceListItemMutation();

  const {
    register: registerEdit,
    handleSubmit: handleEdit,
    formState: { errors: editErrors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    values: priceList
      ? {
          name: priceList.name,
          description: priceList.description ?? "",
          validFrom: priceList.validFrom ?? "",
          validTo: priceList.validTo ?? "",
        }
      : undefined,
  });

  const {
    register: registerItem,
    handleSubmit: handleItem,
    formState: { errors: itemErrors },
    reset: resetItem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<AddItemFormValues>({ resolver: zodResolver(addItemSchema) as any });

  const onEdit = (values: EditFormValues) => {
    updateMutation.mutate(
      {
        id,
        payload: {
          name: values.name,
          description: values.description || undefined,
          validFrom: values.validFrom || undefined,
          validTo: values.validTo || undefined,
        },
      },
      {
        onSuccess: () => toast.success("Price list updated"),
        onError: (e) => toast.error((e as Error).message ?? "Update failed"),
      },
    );
  };

  const onAddItem = (values: AddItemFormValues) => {
    addItemMutation.mutate(
      { priceListId: id, payload: { variantId: values.variantId, price: values.price } },
      {
        onSuccess: () => { toast.success("Item added"); resetItem(); },
        onError: (e) => toast.error((e as Error).message ?? "Add item failed"),
      },
    );
  };

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (isError || !priceList)
    return (
      <ErrorState
        title="Failed to load price list"
        message={(error as Error)?.message ?? "Not found"}
        retry={() => void refetch()}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <List className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{priceList.name}</h1>
          <p className="text-sm text-muted-foreground">{priceList.description ?? "No description"}</p>
        </div>
        {priceList.isDefault && (
          <Badge variant="default" className="ml-auto">Default</Badge>
        )}
      </div>

      {/* Edit */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Price List</CardTitle>
          <CardDescription>Connected to `PATCH /api/catalog/price-lists/:id`</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEdit(onEdit)} className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...registerEdit("name")} />
              {editErrors.name && <p className="text-xs text-destructive">{editErrors.name.message}</p>}
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...registerEdit("description")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="validFrom">Valid From</Label>
              <Input id="validFrom" type="date" {...registerEdit("validFrom")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="validTo">Valid To</Label>
              <Input id="validTo" type="date" {...registerEdit("validTo")} />
            </div>
            <div>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Price List Items</CardTitle>
          <CardDescription>Connected to `GET/POST /api/catalog/price-lists/:id/items`</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleItem(onAddItem as Parameters<typeof handleItem>[0])} className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="variantId">Variant ID *</Label>
              <Input id="variantId" {...registerItem("variantId")} />
              {itemErrors.variantId && <p className="text-xs text-destructive">{itemErrors.variantId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price *</Label>
              <Input id="price" type="number" step="0.01" {...registerItem("price")} />
              {itemErrors.price && <p className="text-xs text-destructive">{itemErrors.price.message}</p>}
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="outline" disabled={addItemMutation.isPending}>
                {addItemMutation.isPending ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>

          {itemsLoading && <LoadingSkeleton variant="table" count={5} />}
          {!itemsLoading && (!items || items.length === 0) && (
            <EmptyState title="No items" description="Add items to this price list." />
          )}
          {!itemsLoading && items && items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant ID</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.variantId}</TableCell>
                    <TableCell className="text-right font-medium">{item.price}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(new Date(item.updatedAt), locale)}
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
