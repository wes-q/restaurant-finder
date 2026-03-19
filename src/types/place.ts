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
    category: z
        .string()
        .nullable()
        .describe(
            "The type of food, cuisine, or dining concept the user is looking for. (e.g., 'Italian', 'Sushi', 'Dive Bar'). “Always extract the most relevant broad cuisine even if a specific dish is mentioned.”",
        ),
});

export type StructuredQuery = z.infer<typeof StructuredQuerySchema>;

// Optional. The type of food, cuisine, or dining concept the user is looking for.
// This can be:
// - A broad cuisine (e.g., "Japanese", "Italian", "Indian")
// - A specific dish or specialty (e.g., "ramen", "sushi", "curry", "fried chicken")
// - A regional or sub-cuisine (e.g., "Bavarian", "Andhra", "Creole")
// - A restaurant type or concept (e.g., "gastropub", "buffet", "food truck")
//
// If the exact category is unclear, prefer the closest relevant and commonly recognized term.
// For example:
// - "Japanese curry" → "Japanese" or "curry"
// - "katsu curry" → "Japanese"
// - "bbq" → "Korean BBQ" or "American BBQ" if context allows, otherwise "BBQ"
//
// Avoid overly obscure or rare category names unless clearly specified by the user.
