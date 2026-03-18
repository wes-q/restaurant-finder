import { z } from "zod";

export const PlaceSchema = z.object({
    fsq_place_id: z.string(),
    name: z.string(),
    website: z.string().optional(),
    categories: z
        .array(
            z.object({
                fsq_category_id: z.string(),
                name: z.string(),
            }),
        )
        .optional(),
    distance: z.number().optional(),
    tel: z.string().optional(),
    email: z.string().optional(),
    // formatted_address: z.string().optional(),
    location: z.object({
        formatted_address: z.string().optional(),
    }),
});

export type Place = z.infer<typeof PlaceSchema>;

export const PLACE_FIELDS = Object.keys(PlaceSchema.shape).join(",");

export const StructuredQuerySchema = z.object({
    query: z.string().trim().min(1, "Query is required").describe("The core search intent extracted from the user's message (e.g., 'best pizza', 'quiet coffee shop')."),
    near: z.string().nullable().describe("The specific geographical location, city, or neighborhood mentioned by the user (e.g., 'SoHo', 'London')."),
    openNow: z.boolean().nullable().describe("Set to true if the user explicitly mentions they want results for places currently open (e.g., 'open now', 'right now')."),
    minPrice: z.number().min(1).max(4).nullable().describe("The lower bound of the price range (1 for affordable, 4 for luxury) based on terms like 'cheap' or 'fine dining'."),
    maxPrice: z.number().min(1).max(4).nullable().describe("The upper bound of the price range (1 for affordable, 4 for luxury)."),
    category: z.string().nullable().describe("The specific cuisine or type of establishment (e.g., 'Italian', 'Sushi', 'Dive Bar')."),
});

export type StructuredQuery = z.infer<typeof StructuredQuerySchema>;
