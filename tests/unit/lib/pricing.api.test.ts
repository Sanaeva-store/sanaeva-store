import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({ apiRequest: vi.fn() }));
const mock = vi.mocked(apiClient.apiRequest);

describe("pricing.api", () => {
    beforeEach(() => vi.clearAllMocks());

    it("fetchPriceLists — no params calls /api/catalog/price-lists", async () => {
        const { fetchPriceLists } = await import("@/features/inventory/api/pricing.api");
        mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
        await fetchPriceLists();
        expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists");
    });

    it("fetchPriceLists — appends page + limit query params", async () => {
        const { fetchPriceLists } = await import("@/features/inventory/api/pricing.api");
        mock.mockResolvedValueOnce({ data: [], total: 0, page: 2, limit: 10, totalPages: 0 });
        await fetchPriceLists({ page: 2, limit: 10 });
        const url = mock.mock.calls[0][0] as string;
        expect(url).toContain("page=2");
        expect(url).toContain("limit=10");
    });

    it("fetchPriceListById calls /api/catalog/price-lists/:id", async () => {
        const { fetchPriceListById } = await import("@/features/inventory/api/pricing.api");
        mock.mockResolvedValueOnce({ id: "pl-1", name: "Default" });
        await fetchPriceListById("pl-1");
        expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists/pl-1");
    });

    it("createPriceList sends POST /api/catalog/price-lists with correct payload", async () => {
        const { createPriceList } = await import("@/features/inventory/api/pricing.api");
        const payload = {
            name: "VIP Prices",
            description: "Special pricing for VIP customers",
            isDefault: false,
            validFrom: "2026-03-01",
            validTo: "2026-12-31",
        };
        mock.mockResolvedValueOnce({ id: "pl-2", ...payload });
        await createPriceList(payload);
        expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists", {
            method: "POST",
            body: payload,
        });
    });

    it("createPriceList — minimal payload (only name required)", async () => {
        const { createPriceList } = await import("@/features/inventory/api/pricing.api");
        const payload = { name: "Retail" };
        mock.mockResolvedValueOnce({ id: "pl-3", name: "Retail", isDefault: false });
        await createPriceList(payload);
        expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists", {
            method: "POST",
            body: payload,
        });
    });

    it("updatePriceList sends PATCH /api/catalog/price-lists/:id", async () => {
        const { updatePriceList } = await import("@/features/inventory/api/pricing.api");
        const payload = { name: "Updated Name", isDefault: true };
        mock.mockResolvedValueOnce({ id: "pl-1", ...payload });
        await updatePriceList("pl-1", payload);
        expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists/pl-1", {
            method: "PATCH",
            body: payload,
        });
    });

    it("fetchPriceListItems calls /api/catalog/price-lists/:id/items", async () => {
        const { fetchPriceListItems } = await import("@/features/inventory/api/pricing.api");
        mock.mockResolvedValueOnce([]);
        await fetchPriceListItems("pl-1");
        expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists/pl-1/items");
    });

    it("addPriceListItem sends POST /api/catalog/price-lists/:id/items with variantId + price", async () => {
        const { addPriceListItem } = await import("@/features/inventory/api/pricing.api");
        const payload = { variantId: "v-abc", price: 299.99 };
        mock.mockResolvedValueOnce({ id: "item-1", priceListId: "pl-1", ...payload });
        await addPriceListItem("pl-1", payload);
        expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists/pl-1/items", {
            method: "POST",
            body: payload,
        });
    });

    it("createPriceList — rejects when API errors", async () => {
        const { createPriceList } = await import("@/features/inventory/api/pricing.api");
        mock.mockRejectedValueOnce(new Error("Validation failed"));
        await expect(createPriceList({ name: "" })).rejects.toThrow("Validation failed");
    });
});
