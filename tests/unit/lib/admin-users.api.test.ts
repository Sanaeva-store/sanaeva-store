import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({ apiRequest: vi.fn() }));
const mock = vi.mocked(apiClient.apiRequest);

describe("admin-users.api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetchAdminUsers — no params calls /api/admin-users", async () => {
    const { fetchAdminUsers } = await import("@/features/inventory/api/admin-users.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchAdminUsers();
    expect(mock).toHaveBeenCalledWith("/api/admin-users");
  });

  it("fetchPermissionsMatrix calls /api/admin-users/permissions/matrix", async () => {
    const { fetchPermissionsMatrix } = await import("@/features/inventory/api/admin-users.api");
    mock.mockResolvedValueOnce({ roles: [], permissions: [] });
    await fetchPermissionsMatrix();
    expect(mock).toHaveBeenCalledWith("/api/admin-users/permissions/matrix");
  });

  it("assignRole sends POST /api/admin-users/:id/roles with roles array", async () => {
    const { assignRole } = await import("@/features/inventory/api/admin-users.api");
    mock.mockResolvedValueOnce({ id: "usr-1", roles: ["STAFF"] });
    await assignRole("usr-1", ["STAFF"]);
    expect(mock).toHaveBeenCalledWith("/api/admin-users/usr-1/roles", {
      method: "POST",
      body: { roles: ["STAFF"] },
    });
  });

  it("removeRole sends DELETE /api/admin-users/:id/roles/:roleCode", async () => {
    const { removeRole } = await import("@/features/inventory/api/admin-users.api");
    mock.mockResolvedValueOnce({ id: "usr-1", roles: [] });
    await removeRole("usr-1", "STAFF");
    expect(mock).toHaveBeenCalledWith("/api/admin-users/usr-1/roles/STAFF", {
      method: "DELETE",
    });
  });

  it("toggleAdminUserStatus sends PATCH status", async () => {
    const { toggleAdminUserStatus } = await import("@/features/inventory/api/admin-users.api");
    mock.mockResolvedValueOnce({ id: "usr-1", status: "INACTIVE" });
    await toggleAdminUserStatus("usr-1");
    expect(mock).toHaveBeenCalledWith("/api/admin-users/usr-1/status", {
      method: "PATCH",
    });
  });

  it("fetchAuditLogs — no params calls /api/audit-logs", async () => {
    const { fetchAuditLogs } = await import("@/features/inventory/api/admin-users.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchAuditLogs();
    expect(mock).toHaveBeenCalledWith("/api/audit-logs");
  });

  it("fetchAuditLogById calls /api/audit-logs/:id", async () => {
    const { fetchAuditLogById } = await import("@/features/inventory/api/admin-users.api");
    mock.mockResolvedValueOnce({ id: "log-1" });
    await fetchAuditLogById("log-1");
    expect(mock).toHaveBeenCalledWith("/api/audit-logs/log-1");
  });

  it("approveApproval sends POST /api/approvals/:id/approve", async () => {
    const { approveApproval } = await import("@/features/inventory/api/admin-users.api");
    mock.mockResolvedValueOnce({ id: "appr-1", status: "APPROVED" });
    await approveApproval("appr-1", "Looks good");
    expect(mock).toHaveBeenCalledWith("/api/approvals/appr-1/approve", {
      method: "POST",
      body: { reason: "Looks good" },
    });
  });

  it("rejectApproval sends POST /api/approvals/:id/reject", async () => {
    const { rejectApproval } = await import("@/features/inventory/api/admin-users.api");
    mock.mockResolvedValueOnce({ id: "appr-1", status: "REJECTED" });
    await rejectApproval("appr-1");
    expect(mock).toHaveBeenCalledWith("/api/approvals/appr-1/reject", {
      method: "POST",
      body: undefined,
    });
  });
});
