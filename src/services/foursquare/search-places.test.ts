import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchPlaces } from "@/services/foursquare/search-places";

global.fetch = vi.fn();

describe("searchPlaces", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.FOURSQUARE_API = "test-api-key";
    });

    const validQuery = {
        query: "coffee",
        near: "Manila",
        openNow: true,
    };

    it("throws if API key is missing", async () => {
        delete process.env.FOURSQUARE_API;

        await expect(searchPlaces(validQuery)).rejects.toThrow("FOURSQUARE_API key is missing");
    });

    it("calls Foursquare API with correct params", async () => {
        (fetch as any).mockResolvedValue({
            json: async () => ({ results: [] }),
        });

        await searchPlaces(validQuery);

        expect(fetch).toHaveBeenCalledTimes(1);

        const calledUrl = (fetch as any).mock.calls[0][0];

        expect(calledUrl).toContain("query=coffee");
        expect(calledUrl).toContain("near=Manila");
        expect(calledUrl).toContain("open_now=true");
    });

    it("returns validated places on success", async () => {
        (fetch as any).mockResolvedValue({
            json: async () => ({
                results: [
                    {
                        fsq_place_id: "123",
                        name: "Coffee Shop",
                        categories: [],
                        location: {},
                    },
                ],
            }),
        });

        const result = await searchPlaces(validQuery);

        expect(result).toEqual([
            {
                fsq_place_id: "123",
                name: "Coffee Shop",
                categories: [],
                location: {},
            },
        ]);
    });

    it("throws if API returns invalid data (Zod validation)", async () => {
        (fetch as any).mockResolvedValue({
            json: async () => ({
                results: [
                    {
                        name: "Missing ID", // ❌ fsq_place_id missing
                    },
                ],
            }),
        });

        await expect(searchPlaces(validQuery)).rejects.toThrow();
    });
});
