"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Trash2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSkeleton, EmptyState } from "@/shared/ui";
import { useBackofficeTranslations } from "@/shared/lib/i18n";
import {
  useProductImagesQuery,
  useCreateProductImageMutation,
  useDeleteProductImageMutation,
} from "@/features/inventory/hooks/use-catalog";
import type { ApiError } from "@/shared/lib/http/api-client";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { INVENTORY_FORM_UI } from "@/features/inventory/constants/form-ui";

const addImageSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

type AddImageFormValues = z.infer<typeof addImageSchema>;

interface Props {
  productId: string;
}

export function ProductImagesSection({ productId }: Props) {
  const { t } = useBackofficeTranslations("product-sku");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: images, isLoading } = useProductImagesQuery(productId);
  const addMutation = useCreateProductImageMutation();
  const deleteMutation = useDeleteProductImageMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddImageFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addImageSchema) as any,
    defaultValues: { url: "", sortOrder: undefined },
  });

  const isPending = addMutation.isPending || isSubmitting;

  const onAdd = async (values: AddImageFormValues) => {
    await addMutation.mutateAsync(
      {
        productId,
        payload: {
          url: values.url.trim(),
          sortOrder: values.sortOrder,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("detail.images.addSuccess"));
          reset();
        },
        onError: (e) => toast.error((e as ApiError)?.message ?? t("detail.images.addError")),
      },
    );
  };

  const onDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(
      { productId, imageId: deleteTargetId },
      {
        onSuccess: () => {
          toast.success(t("detail.images.deleteSuccess"));
          setDeleteTargetId(null);
        },
        onError: (e) => {
          toast.error((e as ApiError)?.message ?? t("detail.images.deleteError"));
          setDeleteTargetId(null);
        },
      },
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("detail.images.title")}</CardTitle>
          <CardDescription>{t("detail.images.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add image form */}
          <form onSubmit={handleSubmit(onAdd)} className="space-y-3" noValidate>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <div className="space-y-1.5">
                <Label htmlFor="img-url">{t("detail.images.urlLabel")}</Label>
                <Input
                  id="img-url"
                  className={INVENTORY_FORM_UI.control}
                  placeholder={t("detail.images.urlPlaceholder")}
                  disabled={isPending}
                  {...register("url")}
                />
                {errors.url && (
                  <p className="text-xs text-destructive">{errors.url.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="img-sort">{t("detail.images.sortOrderLabel")}</Label>
                <Input
                  id="img-sort"
                  type="number"
                  min={0}
                  className={INVENTORY_FORM_UI.control}
                  style={{ width: "5rem" }}
                  disabled={isPending}
                  {...register("sortOrder")}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isPending}>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {isPending ? t("detail.images.adding") : t("detail.images.addImage")}
                </Button>
              </div>
            </div>
          </form>

          {/* Image grid */}
          {isLoading && <LoadingSkeleton variant="card" count={2} />}

          {!isLoading && (!images || images.length === 0) && (
            <EmptyState
              icon={X}
              title={t("detail.images.noImages")}
              description={t("detail.images.noImagesDescription")}
              className="min-h-[140px]"
            />
          )}

          {!isLoading && images && images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                  >
                    <Image
                      src={img.url}
                      alt={`Product image ${img.sortOrder}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => setDeleteTargetId(img.id)}
                        disabled={deleteMutation.isPending}
                        aria-label={t("detail.images.removeImage")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="absolute bottom-1 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                      #{img.sortOrder}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}
        title={t("detail.images.deleteConfirmTitle")}
        description={t("detail.images.deleteConfirmDescription")}
        confirmLabel={t("detail.images.removeImage")}
        cancelLabel={t("detail.images.cancel")}
        variant="destructive"
        onConfirm={onDelete}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
