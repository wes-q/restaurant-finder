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
    query: z.string().trim().min(1, "Query is required"),
    near: z.string().nullable(),
    openNow: z.boolean().nullable(),
});

export type StructuredQuery = z.infer<typeof StructuredQuerySchema>;
