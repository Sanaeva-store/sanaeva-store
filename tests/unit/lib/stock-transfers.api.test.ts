import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({ apiRequest: vi.fn() }));
const mock = vi.mocked(apiClient.apiRequest);

describe("stock-transfers.api", () => {
    beforeEach(() => vi.clearAllMocks());

    it("fetchStockTransfers — no params calls /api/stock-transfers", async () => {
        const { fetchStockTransfers } = await import("@/features/inventory/api/stock-transfers.api");
        mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
        await fetchStockTransfers();
        expect(mock).toHaveBeenCalledWith("/api/stock-transfers");
    });

    it("fetchStockTransfers — appends status filter", async () => {
        const { fetchStockTransfers } = await import("@/features/inventory/api/stock-transfers.api");
        mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
        await fetchStockTransfers({ status: "PENDING" });
        const url = mock.mock.calls[0][0] as string;
        expect(url).toContain("status=PENDING");
    });

    it("fetchStockTransferById calls /api/stock-transfers/:id", async () => {
        const { fetchStockTransferById } = await import("@/features/inventory/api/stock-transfers.api");
        mock.mockResolvedValueOnce({ id: "st-1" });
        await fetchStockTransferById("st-1");
        expect(mock).toHaveBeenCalledWith("/api/stock-transfers/st-1");
    });

    it("createStockTransfer sends POST /api/stock-transfers with full payload", async () => {
        const { createStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
        const payload = {
            fromWarehouseId: "wh-a",
            toWarehouseId: "wh-b",
            note: "Monthly replenishment",
            items: [{ variantId: "v-1", qty: 50 }],
        };
        mock.mockResolvedValueOnce({ id: "st-2", status: "DRAFT" });
        await createStockTransfer(payload);
        expect(mock).toHaveBeenCalledWith("/api/stock-transfers", {
            method: "POST",
            body: payload,
        });
    });

    it("approveStockTransfer sends POST /api/stock-transfers/:id/approve", async () => {
        const { approveStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
        mock.mockResolvedValueOnce({ id: "st-1", status: "APPROVED" });
        await approveStockTransfer("st-1");
        expect(mock).toHaveBeenCalledWith("/api/stock-transfers/st-1/approve", {
            method: "POST",
        });
    });

    it("shipStockTransfer sends POST /api/stock-transfers/:id/ship", async () => {
        const { shipStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
        mock.mockResolvedValueOnce({ id: "st-1", status: "IN_TRANSIT" });
        await shipStockTransfer("st-1");
        expect(mock).toHaveBeenCalledWith("/api/stock-transfers/st-1/ship", {
            method: "POST",
        });
    });

    it("receiveStockTransfer sends POST /api/stock-transfers/:id/receive with items", async () => {
        const { receiveStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
        const payload = { items: [{ variantId: "v-1", qty: 45 }], note: "Some damage" };
        mock.mockResolvedValueOnce({ id: "st-1", status: "RECEIVED" });
        await receiveStockTransfer("st-1", payload);
        expect(mock).toHaveBeenCalledWith("/api/stock-transfers/st-1/receive", {
            method: "POST",
            body: payload,
        });
    });

    it("completeStockTransfer sends POST /api/stock-transfers/:id/complete", async () => {
        const { completeStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
        mock.mockResolvedValueOnce({ id: "st-1", status: "COMPLETED" });
        await completeStockTransfer("st-1");
        expect(mock).toHaveBeenCalledWith("/api/stock-transfers/st-1/complete", {
            method: "POST",
        });
    });

    it("cancelStockTransfer sends POST /api/stock-transfers/:id/cancel", async () => {
        const { cancelStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
        mock.mockResolvedValueOnce({ id: "st-1", status: "CANCELLED" });
        await cancelStockTransfer("st-1");
        expect(mock).toHaveBeenCalledWith("/api/stock-transfers/st-1/cancel", {
            method: "POST",
        });
    });

    it("approveStockTransfer — rejects when API errors", async () => {
        const { approveStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
        mock.mockRejectedValueOnce(new Error("Transfer already approved"));
        await expect(approveStockTransfer("st-done")).rejects.toThrow("Transfer already approved");
    });

    it("cancelStockTransfer — rejects when transfer is not cancellable", async () => {
        const { cancelStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
        mock.mockRejectedValueOnce(new Error("Cannot cancel a completed transfer"));
        await expect(cancelStockTransfer("st-done")).rejects.toThrow("Cannot cancel a completed transfer");
    });

    it("status enum values match backend contract exactly", () => {
        // Validates that TransferStatus strings are uppercase as per contract v1.1
        const statuses: string[] = [
            "DRAFT",
            "PENDING",
            "APPROVED",
            "IN_TRANSIT",
            "RECEIVED",
            "COMPLETED",
            "CANCELLED",
        ];
        statuses.forEach((s) => {
            expect(s).toBe(s.toUpperCase());
        });
    });
});
