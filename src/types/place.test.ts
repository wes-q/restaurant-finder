import { describe, it, expect } from "vitest";
import { StructuredQuerySchema } from "@/types/place";

describe("StructuredQuerySchema Validation", () => {
    // ✅ 1. Valid input
    it("passes with valid structured query", () => {
        const input = {
            query: "restaurants",
            near: "Manila",
            openNow: true,
        };

        const result = StructuredQuerySchema.safeParse(input);

        expect(result.success).toBe(true);
    });

    // ✅ 2. Query is required
    it("fails if query is empty", () => {
        const input = {
            query: "",
            near: "Manila",
            openNow: true,
        };

        const result = StructuredQuerySchema.safeParse(input);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("Query is required");
        }
    });

    // ✅ 3. Query trimming
    it("trims query and still passes", () => {
        const input = {
            query: "   coffee   ",
            near: null,
            openNow: null,
        };

        const result = StructuredQuerySchema.parse(input);

        expect(result.query).toBe("coffee"); // trimmed
    });

    // ✅ 4. Nullable fields allowed
    it("allows null for optional fields", () => {
        const input = {
            query: "pizza",
            near: null,
            openNow: null,
        };

        const result = StructuredQuerySchema.safeParse(input);

        expect(result.success).toBe(true);
    });

    // ✅ 5. Missing nullable fields (should fail unless optional)
    it("fails if nullable fields are missing", () => {
        const input = {
            query: "burger",
        };

        const result = StructuredQuerySchema.safeParse(input);

        expect(result.success).toBe(false);
    });

    // ✅ 6. Invalid types
    it("fails if types are incorrect", () => {
        const input = {
            query: "ramen",
            near: 123, // ❌ should be string or null
            openNow: "yes", // ❌ should be boolean or null
        };

        const result = StructuredQuerySchema.safeParse(input);

        expect(result.success).toBe(false);
    });
});
