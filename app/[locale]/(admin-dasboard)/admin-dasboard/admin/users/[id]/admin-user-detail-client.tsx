"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSkeleton, ErrorState } from "@/shared/ui";
import {
  useAdminUserDetailQuery,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  useToggleAdminUserStatusMutation,
} from "@/features/inventory/hooks/use-admin-users";
import type { AppRole } from "@/shared/types/api";
import { formatDate, useBackofficeTranslations } from "@/shared/lib/i18n";

const assignSchema = z.object({
  roles: z.string().min(1, "Enter at least one role"),
});

type AssignFormValues = z.infer<typeof assignSchema>;

interface Props {
  id: string;
}

export function AdminUserDetailClient({ id }: Props) {
  const router = useRouter();
  const { locale } = useBackofficeTranslations("sidebar");

  const { data: user, isLoading, isError, error, refetch } = useAdminUserDetailQuery(id);
  const assignRole = useAssignRoleMutation();
  const removeRole = useRemoveRoleMutation();
  const toggleStatus = useToggleAdminUserStatusMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssignFormValues>({ resolver: zodResolver(assignSchema) });

  const onAssign = (values: AssignFormValues) => {
    const roles = values.roles.split(",").map((r) => r.trim() as AppRole);
    assignRole.mutate(
      { id, roles },
      {
        onSuccess: () => { toast.success("Roles assigned"); reset(); },
        onError: (e) => toast.error((e as Error).message ?? "Assign failed"),
      },
    );
  };

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (isError || !user)
    return (
      <ErrorState
        title="Failed to load admin user"
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
        <Shield className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"} className="ml-auto">
          {user.status}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          disabled={toggleStatus.isPending}
          onClick={() =>
            toggleStatus.mutate(id, {
              onSuccess: () => toast.success("Status toggled"),
              onError: (e) => toast.error((e as Error).message ?? "Toggle failed"),
            })
          }
        >
          Toggle Status
        </Button>
      </div>

      {/* User details */}
      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm md:grid-cols-3">
          <div>
            <span className="font-medium text-muted-foreground">Created</span>
            <p>{formatDate(new Date(user.createdAt), locale)}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Updated</span>
            <p>{formatDate(new Date(user.updatedAt), locale)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>Connected to `POST /api/admin-users/:id/roles` and `DELETE /api/admin-users/:id/roles/:roleCode`</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {user.roles.length === 0 && (
              <p className="text-sm text-muted-foreground">No roles assigned.</p>
            )}
            {user.roles.map((role) => (
              <div key={role} className="flex items-center gap-1">
                <Badge variant="secondary">{role}</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                  disabled={removeRole.isPending}
                  onClick={() =>
                    removeRole.mutate(
                      { id, roleCode: role },
                      {
                        onSuccess: () => toast.success(`Role ${role} removed`),
                        onError: (e) => toast.error((e as Error).message ?? "Remove failed"),
                      },
                    )
                  }
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onAssign)} className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="roles">Assign Roles (comma-separated)</Label>
              <Input id="roles" placeholder="SUPER_ADMIN, INVENTORY_STAFF" {...register("roles")} />
              {errors.roles && <p className="text-xs text-destructive">{errors.roles.message}</p>}
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="outline" disabled={assignRole.isPending}>
                {assignRole.isPending ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
