import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";
import type { AppRole } from "@/shared/types/api";

export type AdminUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
  status: AdminUserStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserListResponse = PaginatedResponse<AdminUser>;

export type AdminUserListParams = {
  page?: number;
  limit?: number;
  status?: AdminUserStatus;
};

export type PermissionsMatrix = {
  roles: AppRole[];
  permissions: {
    resource: string;
    actions: {
      action: string;
      allowedRoles: AppRole[];
    }[];
  }[];
};

export type AuditLog = {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  actorId: string;
  meta?: Record<string, unknown> | null;
  createdAt: string;
};

export type AuditLogListResponse = PaginatedResponse<AuditLog>;

export type AuditLogListParams = {
  page?: number;
  limit?: number;
  entity?: string;
  actorId?: string;
  from?: string;
  to?: string;
};

export type Approval = {
  id: string;
  type: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedById: string;
  reviewedById?: string | null;
  payload: Record<string, unknown>;
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApprovalListResponse = PaginatedResponse<Approval>;

export type CreateApprovalPayload = {
  type: string;
  payload: Record<string, unknown>;
};

export async function fetchAdminUsers(
  params: AdminUserListParams = {},
): Promise<AdminUserListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  const qs = searchParams.toString();
  return apiRequest<AdminUserListResponse>(`/api/admin-users${qs ? `?${qs}` : ""}`);
}

export async function fetchAdminUserById(id: string): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/api/admin-users/${id}`);
}

export async function fetchPermissionsMatrix(): Promise<PermissionsMatrix> {
  return apiRequest<PermissionsMatrix>("/api/admin-users/permissions/matrix");
}

export async function assignRole(
  id: string,
  roles: AppRole[],
): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/api/admin-users/${id}/roles`, {
    method: "POST",
    body: { roles },
  });
}

export async function removeRole(
  id: string,
  roleCode: AppRole,
): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/api/admin-users/${id}/roles/${roleCode}`, {
    method: "DELETE",
  });
}

export async function toggleAdminUserStatus(id: string): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/api/admin-users/${id}/status`, {
    method: "PATCH",
  });
}

export async function fetchAuditLogs(
  params: AuditLogListParams = {},
): Promise<AuditLogListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.entity) searchParams.set("entity", params.entity);
  if (params.actorId) searchParams.set("actorId", params.actorId);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  const qs = searchParams.toString();
  return apiRequest<AuditLogListResponse>(
    `/api/audit-logs${qs ? `?${qs}` : ""}`,
  );
}

export async function fetchAuditLogById(id: string): Promise<AuditLog> {
  return apiRequest<AuditLog>(`/api/audit-logs/${id}`);
}

export async function fetchApprovals(params?: {
  page?: number;
  limit?: number;
}): Promise<ApprovalListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiRequest<ApprovalListResponse>(
    `/api/approvals${qs ? `?${qs}` : ""}`,
  );
}

export async function fetchApprovalById(id: string): Promise<Approval> {
  return apiRequest<Approval>(`/api/approvals/${id}`);
}

export async function createApproval(
  payload: CreateApprovalPayload,
): Promise<Approval> {
  return apiRequest<Approval>("/api/approvals", {
    method: "POST",
    body: payload,
  });
}

export async function approveApproval(
  id: string,
  reason?: string,
): Promise<Approval> {
  return apiRequest<Approval>(`/api/approvals/${id}/approve`, {
    method: "POST",
    body: reason ? { reason } : undefined,
  });
}

export async function rejectApproval(
  id: string,
  reason?: string,
): Promise<Approval> {
  return apiRequest<Approval>(`/api/approvals/${id}/reject`, {
    method: "POST",
    body: reason ? { reason } : undefined,
  });
}
