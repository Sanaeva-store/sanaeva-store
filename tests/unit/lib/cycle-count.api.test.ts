import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({ apiRequest: vi.fn() }));
const mock = vi.mocked(apiClient.apiRequest);

describe("cycle-count.api", () => {
    beforeEach(() => vi.clearAllMocks());

    it("fetchCycleCounts — no params calls /api/cycle-count", async () => {
        const { fetchCycleCounts } = await import("@/features/inventory/api/cycle-count.api");
        mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
        await fetchCycleCounts();
        expect(mock).toHaveBeenCalledWith("/api/cycle-count");
    });

    it("fetchCycleCounts — appends warehouseId + status filters", async () => {
        const { fetchCycleCounts } = await import("@/features/inventory/api/cycle-count.api");
        mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
        await fetchCycleCounts({ warehouseId: "wh-1", status: "OPEN" });
        const url = mock.mock.calls[0][0] as string;
        expect(url).toContain("warehouseId=wh-1");
        expect(url).toContain("status=OPEN");
    });

    it("fetchCycleCountById calls /api/cycle-count/:id", async () => {
        const { fetchCycleCountById } = await import("@/features/inventory/api/cycle-count.api");
        mock.mockResolvedValueOnce({ id: "cc-1" });
        await fetchCycleCountById("cc-1");
        expect(mock).toHaveBeenCalledWith("/api/cycle-count/cc-1");
    });

    it("createCycleCount sends POST /api/cycle-count with warehouseId + note", async () => {
        const { createCycleCount } = await import("@/features/inventory/api/cycle-count.api");
        const payload = { warehouseId: "wh-1", note: "Monthly count" };
        mock.mockResolvedValueOnce({ id: "cc-2", code: "CC-001", warehouseId: "wh-1", status: "OPEN" });
        await createCycleCount(payload);
        expect(mock).toHaveBeenCalledWith("/api/cycle-count", {
            method: "POST",
            body: payload,
        });
    });

    it("createCycleCount — payload maps variantIds correctly", async () => {
        const { createCycleCount } = await import("@/features/inventory/api/cycle-count.api");
        const payload = {
            warehouseId: "wh-1",
            variantIds: ["v-1", "v-2"],
            note: "Selective count",
        };
        mock.mockResolvedValueOnce({ id: "cc-3", warehouseId: "wh-1", status: "OPEN" });
        await createCycleCount(payload);
        expect(mock).toHaveBeenCalledWith("/api/cycle-count", {
            method: "POST",
            body: payload,
        });
    });

    it("submitCycleCount sends POST /api/cycle-count/:id/count with items payload", async () => {
        const { submitCycleCount } = await import("@/features/inventory/api/cycle-count.api");
        const payload = {
            items: [{ variantId: "v-1", countedQty: 50 }],
        };
        mock.mockResolvedValueOnce({ id: "cc-1", status: "IN_PROGRESS" });
        await submitCycleCount("cc-1", payload);
        expect(mock).toHaveBeenCalledWith("/api/cycle-count/cc-1/count", {
            method: "POST",
            body: payload,
        });
    });

    it("closeCycleCount sends POST /api/cycle-count/:id/close", async () => {
        const { closeCycleCount } = await import("@/features/inventory/api/cycle-count.api");
        mock.mockResolvedValueOnce({ id: "cc-1", status: "CLOSED" });
        await closeCycleCount("cc-1");
        expect(mock).toHaveBeenCalledWith("/api/cycle-count/cc-1/close", {
            method: "POST",
        });
    });

    it("createCycleCount — rejects when API errors", async () => {
        const { createCycleCount } = await import("@/features/inventory/api/cycle-count.api");
        mock.mockRejectedValueOnce(new Error("Warehouse not found"));
        await expect(createCycleCount({ warehouseId: "invalid" })).rejects.toThrow("Warehouse not found");
    });

    it("closeCycleCount — rejects when session already closed", async () => {
        const { closeCycleCount } = await import("@/features/inventory/api/cycle-count.api");
        mock.mockRejectedValueOnce(new Error("Session already closed"));
        await expect(closeCycleCount("cc-done")).rejects.toThrow("Session already closed");
    });
});
