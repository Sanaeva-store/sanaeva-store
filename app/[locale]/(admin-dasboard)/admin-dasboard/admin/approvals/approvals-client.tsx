"use client";

import { useState } from "react";
import { CheckSquare } from "lucide-react";
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
import {
  useApprovalsQuery,
  useApproveApprovalMutation,
  useRejectApprovalMutation,
} from "@/features/inventory/hooks/use-admin-users";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export function ApprovalsClient() {
  const { t } = useBackofficeTranslations("sidebar");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useApprovalsQuery({ page, limit: 20 });
  const approve = useApproveApprovalMutation();
  const reject = useRejectApprovalMutation();

  const items = data?.data ?? [];
  const maxPage = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CheckSquare className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.approvals")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.adminSecurity")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.approvals")}</CardTitle>
          <CardDescription>Connected to `GET /api/approvals` + approve/reject actions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={7} />}

          {isError && (
            <ErrorState
              title="Failed to load approvals"
              message={(error as Error)?.message}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No approvals" description="No approval requests found." />
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">{approval.type}</TableCell>
                        <TableCell>
                          <Badge variant={approval.status === "PENDING" ? "secondary" : "default"}>
                            {approval.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{approval.requestedById}</TableCell>
                        <TableCell>{new Date(approval.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={approve.isPending || approval.status !== "PENDING"}
                              onClick={() => approve.mutate({ id: approval.id }, { onError: (e) => toast.error((e as Error).message ?? "Approval failed") })}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={reject.isPending || approval.status !== "PENDING"}
                              onClick={() => reject.mutate({ id: approval.id }, { onError: (e) => toast.error((e as Error).message ?? "Rejection failed") })}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {data?.page ?? 1} of {maxPage} ({data?.total ?? 0} approvals)
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
