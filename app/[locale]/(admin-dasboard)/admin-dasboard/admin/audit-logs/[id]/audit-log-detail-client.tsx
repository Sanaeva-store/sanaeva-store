"use client";

import { ScrollText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, ErrorState } from "@/shared/ui";
import { useAuditLogDetailQuery } from "@/features/inventory/hooks/use-admin-users";
import { formatDate, useBackofficeTranslations } from "@/shared/lib/i18n";
import { useLocale } from "@/shared/lib/i18n/use-locale";
import { BackButton } from "@/components/common/back-button";

interface Props {
  id: string;
}

export function AuditLogDetailClient({ id }: Props) {
  const currentLocale = useLocale();
  const { locale } = useBackofficeTranslations("sidebar");

  const { data: log, isLoading, isError, error, refetch } = useAuditLogDetailQuery(id);

  if (isLoading) return <LoadingSkeleton variant="card" count={2} />;
  if (isError || !log)
    return (
      <ErrorState
        title="Failed to load audit log"
        message={(error as Error)?.message ?? "Not found"}
        retry={() => void refetch()}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BackButton
          fallbackHref={`/${currentLocale}/admin-dasboard/admin/audit-logs`}
          label="Back"
        />
        <ScrollText className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Audit Log</h1>
          <p className="font-mono text-sm text-muted-foreground">{log.id}</p>
        </div>
        <Badge variant="secondary" className="ml-auto">{log.action}</Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <span className="font-medium text-muted-foreground">Action</span>
            <p className="font-mono">{log.action}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Entity</span>
            <p className="font-mono">{log.entity}</p>
          </div>
          {log.entityId && (
            <div>
              <span className="font-medium text-muted-foreground">Entity ID</span>
              <p className="font-mono">{log.entityId}</p>
            </div>
          )}
          <div>
            <span className="font-medium text-muted-foreground">Actor ID</span>
            <p className="font-mono">{log.actorId}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Timestamp</span>
            <p>{formatDate(new Date(log.createdAt), locale)}</p>
          </div>
        </CardContent>
      </Card>

      {log.meta && Object.keys(log.meta).length > 0 && (
        <Card>
          <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
              {JSON.stringify(log.meta, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
