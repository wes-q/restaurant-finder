import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// --------------------------------------------------
// 🔥 1. Mock dependencies BEFORE import
// --------------------------------------------------

// mock server-only
vi.mock("server-only", () => ({}));

// mock parseMessage
vi.mock("@/services/ai/parse-message", () => ({
    parseMessage: vi.fn(),
}));

// mock searchPlaces
vi.mock("@/services/foursquare/search-places", () => ({
    searchPlaces: vi.fn(),
}));

// --------------------------------------------------
// 🔥 2. Import AFTER mocks
// --------------------------------------------------
import { GET } from "@/app/api/execute/route";
import { parseMessage } from "@/services/ai/parse-message";
import { searchPlaces } from "@/services/foursquare/search-places";

// --------------------------------------------------
// 🔥 3. Test suite
// --------------------------------------------------
describe("GET /api/execute (integration)", () => {
    const BASE_URL = "http://localhost/api/execute";

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.API_ACCESS_CODE = "pioneerdevai";
    });

    // ✅ 1. Full success flow
    it("returns places when everything is valid", async () => {
        (parseMessage as any).mockResolvedValue({
            query: "coffee",
            near: "Manila",
            openNow: true,
        });

        (searchPlaces as any).mockResolvedValue([{ name: "Coffee Shop" }]);

        const req = new NextRequest(`${BASE_URL}?message=coffee&code=pioneerdevai`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.places).toEqual([{ name: "Coffee Shop" }]);
    });

    // ❌ 2. AI fails to parse
    it("returns 400 when parseMessage returns null", async () => {
        (parseMessage as any).mockResolvedValue(null);

        const req = new NextRequest(`${BASE_URL}?message=coffee&code=pioneerdevai`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.error).toBe("Could not interpret query");
    });

    // ❌ 3. searchPlaces throws error
    it("returns 500 when searchPlaces fails", async () => {
        (parseMessage as any).mockResolvedValue({
            query: "coffee",
            near: null,
            openNow: null,
        });

        (searchPlaces as any).mockRejectedValue(new Error("Foursquare failed"));

        const req = new NextRequest(`${BASE_URL}?message=coffee&code=pioneerdevai`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).toBe("Foursquare failed");
    });

    // ❌ 4. AI returns invalid shape (defensive test)
    it("returns 500 if AI returns invalid structured query", async () => {
        (parseMessage as any).mockResolvedValue({
            wrong: "format",
        });

        const req = new NextRequest(`${BASE_URL}?message=coffee&code=pioneerdevai`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(500);
    });
});
