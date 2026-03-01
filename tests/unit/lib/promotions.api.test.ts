import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({ apiRequest: vi.fn() }));
const mock = vi.mocked(apiClient.apiRequest);

describe("promotions.api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetchPromotions — no params", async () => {
    const { fetchPromotions } = await import("@/features/inventory/api/promotions.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchPromotions();
    expect(mock).toHaveBeenCalledWith("/api/promotions");
  });

  it("fetchPromotions — isActive filter", async () => {
    const { fetchPromotions } = await import("@/features/inventory/api/promotions.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchPromotions({ isActive: true });
    expect(mock.mock.calls[0][0]).toContain("isActive=true");
  });

  it("fetchPromotionById calls /api/promotions/:id", async () => {
    const { fetchPromotionById } = await import("@/features/inventory/api/promotions.api");
    mock.mockResolvedValueOnce({ id: "promo-1" });
    await fetchPromotionById("promo-1");
    expect(mock).toHaveBeenCalledWith("/api/promotions/promo-1");
  });

  it("togglePromotion sends POST /api/promotions/:id/toggle", async () => {
    const { togglePromotion } = await import("@/features/inventory/api/promotions.api");
    mock.mockResolvedValueOnce({ id: "promo-1", isActive: false });
    await togglePromotion("promo-1");
    expect(mock).toHaveBeenCalledWith("/api/promotions/promo-1/toggle", {
      method: "POST",
    });
  });

  it("validateCoupon sends POST /api/promotions/validate-coupon", async () => {
    const { validateCoupon } = await import("@/features/inventory/api/promotions.api");
    const payload = { code: "SAVE10", subtotal: 500 };
    mock.mockResolvedValueOnce({ valid: true, code: "SAVE10", discount: "50", finalTotal: "450" });
    const result = await validateCoupon(payload);
    expect(mock).toHaveBeenCalledWith("/api/promotions/validate-coupon", {
      method: "POST",
      body: payload,
    });
    expect(result).toMatchObject({ valid: true, code: "SAVE10" });
  });

  it("calculateDiscount sends POST /api/promotions/calculate-discount", async () => {
    const { calculateDiscount } = await import("@/features/inventory/api/promotions.api");
    const payload = { codes: ["SAVE10"], subtotal: 500 };
    mock.mockResolvedValueOnce({ breakdown: [], totalDiscount: "50", finalTotal: "450" });
    await calculateDiscount(payload);
    expect(mock).toHaveBeenCalledWith("/api/promotions/calculate-discount", {
      method: "POST",
      body: payload,
    });
  });

  it("simulateDiscount sends POST /api/promotions/simulate", async () => {
    const { simulateDiscount } = await import("@/features/inventory/api/promotions.api");
    const payload = { codes: ["VIP20"], subtotal: 1000 };
    mock.mockResolvedValueOnce({ breakdown: [], totalDiscount: "200", finalTotal: "800" });
    await simulateDiscount(payload);
    expect(mock).toHaveBeenCalledWith("/api/promotions/simulate", {
      method: "POST",
      body: payload,
    });
  });

  it("fetchStackingRules calls /api/promotions/:id/stacking-rules", async () => {
    const { fetchStackingRules } = await import("@/features/inventory/api/promotions.api");
    mock.mockResolvedValueOnce([]);
    await fetchStackingRules("promo-1");
    expect(mock).toHaveBeenCalledWith("/api/promotions/promo-1/stacking-rules");
  });
});
