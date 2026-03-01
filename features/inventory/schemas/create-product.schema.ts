import { z } from "zod";

/**
 * Zod schema for the Create Product form.
 * Mirrors `POST /api/catalog/products` input constraints.
 * Error messages are in English to allow direct unit testing.
 */
export const createProductSchema = z.object({
    title: z
        .string()
        .min(1, "Product name is required")
        .max(255, "Product name must be 255 characters or less"),
    description: z
        .string()
        .max(2000, "Description must be 2000 characters or less")
        .optional()
        .or(z.literal("")),
    brand: z
        .string()
        .max(100, "Brand must be 100 characters or less")
        .optional()
        .or(z.literal("")),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).optional(),
    /**
     * Raw comma-separated category IDs entered by the user.
     * Parsed into string[] before the API call.
     */
    categoryIds: z.string().optional(),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
