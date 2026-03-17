import { z } from "zod";

export const PlaceSchema = z.object({
    fsq_place_id: z.string(),
    name: z.string(),
});

export type Place = z.infer<typeof PlaceSchema>;

export const StructuredQuerySchema = z.object({
    query: z.string().trim().min(1, "Query is required"),
    near: z.string().nullable(),
    openNow: z.boolean().nullable(),
});

export type StructuredQuery = z.infer<typeof StructuredQuerySchema>;
