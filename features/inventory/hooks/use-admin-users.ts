import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminUsers,
  fetchAdminUserById,
  fetchPermissionsMatrix,
  assignRole,
  removeRole,
  toggleAdminUserStatus,
  fetchAuditLogs,
  fetchAuditLogById,
  fetchApprovals,
  fetchApprovalById,
  createApproval,
  approveApproval,
  rejectApproval,
  type AdminUserListParams,
  type AuditLogListParams,
  type CreateApprovalPayload,
} from "@/features/inventory/api/admin-users.api";
import type { AppRole } from "@/shared/types/api";

const adminKeys = {
  all: ["admin-users"] as const,
  list: (params: AdminUserListParams) =>
    ["admin-users", "list", params.page ?? 1, params.status ?? "all"] as const,
  detail: (id: string) => ["admin-users", "detail", id] as const,
  permissions: () => ["admin-users", "permissions"] as const,
};

const auditLogKeys = {
  all: ["audit-logs"] as const,
  list: (params: AuditLogListParams) =>
    ["audit-logs", "list", params.page ?? 1, params.entity ?? "all", params.actorId ?? "all"] as const,
  detail: (id: string) => ["audit-logs", "detail", id] as const,
};

const approvalKeys = {
  all: ["approvals"] as const,
  list: (page = 1) => ["approvals", "list", page] as const,
  detail: (id: string) => ["approvals", "detail", id] as const,
};

// ─── Admin Users ──────────────────────────────────────────────────────────────

export function useAdminUsersQuery(params: AdminUserListParams = {}) {
  return useQuery({
    queryKey: adminKeys.list(params),
    queryFn: () => fetchAdminUsers(params),
  });
}

export function useAdminUserDetailQuery(id: string) {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => fetchAdminUserById(id),
    enabled: Boolean(id),
  });
}

export function usePermissionsMatrixQuery() {
  return useQuery({
    queryKey: adminKeys.permissions(),
    queryFn: fetchPermissionsMatrix,
  });
}

export function useAssignRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roles }: { id: string; roles: AppRole[] }) =>
      assignRole(id, roles),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
    },
  });
}

export function useRemoveRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roleCode }: { id: string; roleCode: AppRole }) =>
      removeRole(id, roleCode),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
    },
  });
}

export function useToggleAdminUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleAdminUserStatus(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
    },
  });
}

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export function useAuditLogsQuery(params: AuditLogListParams = {}) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => fetchAuditLogs(params),
  });
}

export function useAuditLogDetailQuery(id: string) {
  return useQuery({
    queryKey: auditLogKeys.detail(id),
    queryFn: () => fetchAuditLogById(id),
    enabled: Boolean(id),
  });
}

// ─── Approvals ───────────────────────────────────────────────────────────────

export function useApprovalsQuery(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: approvalKeys.list(params?.page),
    queryFn: () => fetchApprovals(params),
  });
}

export function useApprovalDetailQuery(id: string) {
  return useQuery({
    queryKey: approvalKeys.detail(id),
    queryFn: () => fetchApprovalById(id),
    enabled: Boolean(id),
  });
}

export function useCreateApprovalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApprovalPayload) => createApproval(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: approvalKeys.all });
    },
  });
}

export function useApproveApprovalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      approveApproval(id, reason),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: approvalKeys.all });
      void queryClient.invalidateQueries({ queryKey: approvalKeys.detail(id) });
    },
  });
}

export function useRejectApprovalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectApproval(id, reason),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: approvalKeys.all });
      void queryClient.invalidateQueries({ queryKey: approvalKeys.detail(id) });
    },
  });
}
