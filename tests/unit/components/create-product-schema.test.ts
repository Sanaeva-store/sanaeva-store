import { describe, expect, it } from "vitest";
import { createProductSchema } from "@/features/inventory/schemas/create-product.schema";

describe("createProductSchema", () => {
    // ─── Title validation ────────────────────────────────────────────────────

    it("rejects empty title", () => {
        const result = createProductSchema.safeParse({ title: "" });
        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes("title"));
            expect(issue?.message).toBe("Product name is required");
        }
    });

    it("rejects title longer than 255 chars", () => {
        const result = createProductSchema.safeParse({ title: "a".repeat(256) });
        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes("title"));
            expect(issue?.message).toBe("Product name must be 255 characters or less");
        }
    });

    it("accepts title at exactly 255 chars", () => {
        const result = createProductSchema.safeParse({ title: "a".repeat(255) });
        expect(result.success).toBe(true);
    });

    // ─── Description validation ──────────────────────────────────────────────

    it("rejects description longer than 2000 chars", () => {
        const result = createProductSchema.safeParse({
            title: "Test Product",
            description: "a".repeat(2001),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes("description"));
            expect(issue?.message).toBe("Description must be 2000 characters or less");
        }
    });

    it("accepts description at exactly 2000 chars", () => {
        const result = createProductSchema.safeParse({
            title: "Test",
            description: "a".repeat(2000),
        });
        expect(result.success).toBe(true);
    });

    // ─── Brand validation ────────────────────────────────────────────────────

    it("rejects brand longer than 100 chars", () => {
        const result = createProductSchema.safeParse({
            title: "Test",
            brand: "a".repeat(101),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes("brand"));
            expect(issue?.message).toBe("Brand must be 100 characters or less");
        }
    });

    it("accepts brand at exactly 100 chars", () => {
        const result = createProductSchema.safeParse({
            title: "Test",
            brand: "a".repeat(100),
        });
        expect(result.success).toBe(true);
    });

    // ─── Status validation ───────────────────────────────────────────────────

    it("accepts valid status DRAFT", () => {
        const result = createProductSchema.safeParse({ title: "Test", status: "DRAFT" });
        expect(result.success).toBe(true);
    });

    it("accepts valid status ACTIVE", () => {
        const result = createProductSchema.safeParse({ title: "Test", status: "ACTIVE" });
        expect(result.success).toBe(true);
    });

    it("accepts valid status INACTIVE", () => {
        const result = createProductSchema.safeParse({ title: "Test", status: "INACTIVE" });
        expect(result.success).toBe(true);
    });

    it("rejects invalid status value", () => {
        const result = createProductSchema.safeParse({ title: "Test", status: "PUBLISHED" });
        expect(result.success).toBe(false);
    });

    // ─── Optional fields ─────────────────────────────────────────────────────

    it("accepts payload with no optional fields", () => {
        const result = createProductSchema.safeParse({ title: "Premium Cotton T-Shirt" });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.title).toBe("Premium Cotton T-Shirt");
            expect(result.data.description).toBeUndefined();
            expect(result.data.brand).toBeUndefined();
            expect(result.data.status).toBeUndefined();
        }
    });

    it("accepts full valid payload", () => {
        const result = createProductSchema.safeParse({
            title: "Premium Cotton T-Shirt",
            description: "High quality organic cotton material",
            brand: "Sanaeva",
            status: "ACTIVE",
            categoryIds: "cat001, cat002",
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.title).toBe("Premium Cotton T-Shirt");
            expect(result.data.brand).toBe("Sanaeva");
            expect(result.data.status).toBe("ACTIVE");
            expect(result.data.categoryIds).toBe("cat001, cat002");
        }
    });

    it("accepts empty string for optional fields (treated as empty)", () => {
        const result = createProductSchema.safeParse({
            title: "Test",
            description: "",
            brand: "",
        });
        expect(result.success).toBe(true);
    });
});
