import { vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("openai", () => {
    return {
        default: class {
            chat = { completions: { create: async () => ({}) } }; // mock whatever methods your code calls
        },
    };
});

// /src/app/api/execute/route.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";

// ----------------------------------------------------
// 3️⃣ Mock parseMessage & searchPlaces
// ----------------------------------------------------
vi.mock("@/services/ai/parse-message", () => ({
    parseMessage: vi.fn().mockResolvedValue({ structured: "mocked" }),
}));

vi.mock("@/services/foursquare/search-places", () => ({
    searchPlaces: vi.fn().mockResolvedValue([{ name: "Mock Place" }]),
}));

// ----------------------------------------------------
// 4️⃣ Import the API route AFTER mocking everything
// ----------------------------------------------------
import { GET } from "@/app/api/execute/route";

// ----------------------------------------------------
// 5️⃣ Test suite
// ----------------------------------------------------
describe("API Access Code Validation", () => {
    const BASE_URL = "http://localhost/api/execute";

    beforeAll(() => {
        // Ensure environment variable exists
        process.env.API_ACCESS_CODE = "pioneerdevai";
        process.env.OPENAI_API_KEY = "test-key"; // won't actually be used because OpenAI is mocked
    });

    it("returns 400 if message parameter is missing", async () => {
        const req = new NextRequest(`${BASE_URL}?code=pioneerdevai`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.error).toBe("Missing message parameter");
    });

    it("returns 400 if code is missing", async () => {
        const req = new NextRequest(`${BASE_URL}?message=hello`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.error).toBe("Missing access code");
    });

    it("returns 401 if code is invalid", async () => {
        const req = new NextRequest(`${BASE_URL}?message=hello&code=wrong`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(401);
        expect(body.error).toBe("Invalid access code");
    });

    it("returns success if code and message are valid", async () => {
        const req = new NextRequest(`${BASE_URL}?message=hello&code=pioneerdevai`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.places).toEqual([{ name: "Mock Place" }]);
    });
});
