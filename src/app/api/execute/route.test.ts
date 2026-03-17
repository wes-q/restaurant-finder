import { vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("openai", () => {
    return {
        default: class {
            chat = { completions: { create: async () => ({}) } }; // mock whatever methods your code calls
        },
    };
});

import { describe, it, expect, beforeAll } from "vitest";
import { GET } from "@/app/api/execute/route";
import { NextRequest } from "next/server";

describe("API Access Code Validation", () => {
    const BASE_URL = "http://localhost/api/execute";

    beforeAll(() => {
        process.env.API_ACCESS_CODE = "pioneerdevai";
    });

    it("returns 400 if code is missing", async () => {
        const req = new NextRequest(`${BASE_URL}?message=hello`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(400);
        expect(body.error).toBe("Missing access code");
    });

    it("returns 401 if code is invalid", async () => {
        const req = new NextRequest(`${BASE_URL}?message=hello&code=wrongcode`);

        const res = await GET(req);
        const body = await res.json();

        expect(res.status).toBe(401);
        expect(body.error).toBe("Invalid access code");
    });

    it("passes if code is valid", async () => {
        const req = new NextRequest(`${BASE_URL}?message=hello&code=pioneerdevai`);

        // Mock downstream dependencies here if needed

        const res = await GET(req);

        expect(res.status).not.toBe(401);
    });
});
