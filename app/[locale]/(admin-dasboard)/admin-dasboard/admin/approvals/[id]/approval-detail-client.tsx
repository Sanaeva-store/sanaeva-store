"use client";

import { CheckSquare } from "lucide-react";
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
  useApprovalDetailQuery,
  useApproveApprovalMutation,
  useRejectApprovalMutation,
} from "@/features/inventory/hooks/use-admin-users";
import { formatDate, useBackofficeTranslations } from "@/shared/lib/i18n";
import { useLocale } from "@/shared/lib/i18n/use-locale";
import { BackButton } from "@/components/common/back-button";

const reasonSchema = z.object({ reason: z.string().optional() });
type ReasonFormValues = z.infer<typeof reasonSchema>;

interface Props {
  id: string;
}

export function ApprovalDetailClient({ id }: Props) {
  const currentLocale = useLocale();
  const { locale } = useBackofficeTranslations("sidebar");

  const { data: approval, isLoading, isError, error, refetch } = useApprovalDetailQuery(id);
  const approveMutation = useApproveApprovalMutation();
  const rejectMutation = useRejectApprovalMutation();

  const { register: regApprove, handleSubmit: handleApprove } = useForm<ReasonFormValues>({
    resolver: zodResolver(reasonSchema),
  });
  const { register: regReject, handleSubmit: handleReject } = useForm<ReasonFormValues>({
    resolver: zodResolver(reasonSchema),
  });

  const onApprove = (values: ReasonFormValues) => {
    approveMutation.mutate(
      { id, reason: values.reason },
      {
        onSuccess: () => { toast.success("Approved"); },
        onError: (e) => toast.error((e as Error).message ?? "Approve failed"),
      },
    );
  };

  const onReject = (values: ReasonFormValues) => {
    rejectMutation.mutate(
      { id, reason: values.reason },
      {
        onSuccess: () => { toast.success("Rejected"); },
        onError: (e) => toast.error((e as Error).message ?? "Reject failed"),
      },
    );
  };

  if (isLoading) return <LoadingSkeleton variant="card" count={2} />;
  if (isError || !approval)
    return (
      <ErrorState
        title="Failed to load approval"
        message={(error as Error)?.message ?? "Not found"}
        retry={() => void refetch()}
      />
    );

  const isPending = approval.status === "PENDING";
  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BackButton
          fallbackHref={`/${currentLocale}/admin-dasboard/admin/approvals`}
          label="Back"
        />
        <CheckSquare className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Approval Request</h1>
          <p className="text-sm text-muted-foreground">{approval.type}</p>
        </div>
        <Badge
          variant={
            approval.status === "PENDING" ? "secondary"
              : approval.status === "APPROVED" ? "default"
              : "destructive"
          }
          className="ml-auto"
        >
          {approval.status}
        </Badge>
      </div>

      {/* Details */}
      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <span className="font-medium text-muted-foreground">Type</span>
            <p>{approval.type}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Requested By</span>
            <p className="font-mono">{approval.requestedById}</p>
          </div>
          {approval.reviewedById && (
            <div>
              <span className="font-medium text-muted-foreground">Reviewed By</span>
              <p className="font-mono">{approval.reviewedById}</p>
            </div>
          )}
          {approval.reason && (
            <div className="md:col-span-2">
              <span className="font-medium text-muted-foreground">Reason</span>
              <p>{approval.reason}</p>
            </div>
          )}
          <div>
            <span className="font-medium text-muted-foreground">Created</span>
            <p>{formatDate(new Date(approval.createdAt), locale)}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Updated</span>
            <p>{formatDate(new Date(approval.updatedAt), locale)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payload */}
      {Object.keys(approval.payload).length > 0 && (
        <Card>
          <CardHeader><CardTitle>Payload</CardTitle></CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
              {JSON.stringify(approval.payload, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Approve/Reject */}
      {isPending && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Approve</CardTitle>
              <CardDescription>Connected to `POST /api/approvals/:id/approve`</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApprove(onApprove)} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="approveReason">Reason (optional)</Label>
                  <Input id="approveReason" {...regApprove("reason")} />
                </div>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isMutating}>
                  {approveMutation.isPending ? "Approving..." : "Approve"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Reject</CardTitle>
              <CardDescription>Connected to `POST /api/approvals/:id/reject`</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReject(onReject)} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rejectReason">Reason (optional)</Label>
                  <Input id="rejectReason" {...regReject("reason")} />
                </div>
                <Button type="submit" variant="destructive" disabled={isMutating}>
                  {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
