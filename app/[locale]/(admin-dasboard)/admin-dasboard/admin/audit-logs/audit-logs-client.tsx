"use client";

import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { EmptyState, ErrorState, LoadingSkeleton } from "@/shared/ui";
import { useAuditLogsQuery } from "@/features/inventory/hooks/use-admin-users";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export function AuditLogsClient() {
  const { t } = useBackofficeTranslations("sidebar");
  const [entity, setEntity] = useState("");
  const [actorId, setActorId] = useState("");
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      page,
      limit: 20,
      entity: entity.trim() || undefined,
      actorId: actorId.trim() || undefined,
    }),
    [actorId, entity, page],
  );

  const { data, isLoading, isError, error, refetch } = useAuditLogsQuery(params);

  const items = data?.data ?? [];
  const maxPage = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ScrollText className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.auditLogs")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.adminSecurity")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.auditLogs")}</CardTitle>
          <CardDescription>Connected to `GET /api/audit-logs`</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="entity">Entity</Label>
              <Input
                id="entity"
                value={entity}
                onChange={(e) => {
                  setPage(1);
                  setEntity(e.target.value);
                }}
                placeholder="ORDER, INVENTORY, ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actorId">Actor ID</Label>
              <Input
                id="actorId"
                value={actorId}
                onChange={(e) => {
                  setPage(1);
                  setActorId(e.target.value);
                }}
                placeholder="optional"
              />
            </div>
          </div>

          {isLoading && <LoadingSkeleton variant="table" count={7} />}

          {isError && (
            <ErrorState
              title="Failed to load audit logs"
              message={(error as Error)?.message}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No audit logs" description="No records matched current filters." />
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.entity}</TableCell>
                        <TableCell>{log.entityId ?? "-"}</TableCell>
                        <TableCell>{log.actorId}</TableCell>
                        <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {data?.page ?? 1} of {maxPage} ({data?.total ?? 0} logs)
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
