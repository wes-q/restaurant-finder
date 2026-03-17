import { describe, it, expect, vi, beforeEach } from "vitest";

// 🔥 Mock OpenAI BEFORE import
vi.mock("./openai", () => ({
    openai: {
        responses: {
            parse: vi.fn(),
        },
    },
}));

import { parseMessage } from "./parse-message";
import { openai } from "./openai";

describe("parseMessage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ✅ 1. Successful parsing
    it("returns structured query when OpenAI responds correctly", async () => {
        const mockResponse = {
            output_parsed: {
                query: "coffee",
                near: "Manila",
                openNow: true,
            },
        };

        (openai.responses.parse as any).mockResolvedValue(mockResponse);

        const result = await parseMessage("Find coffee in Manila");

        expect(result).toEqual(mockResponse.output_parsed);
    });

    // ❌ 2. Null response should throw
    it("throws error when structuredQuery is null", async () => {
        (openai.responses.parse as any).mockResolvedValue({
            output_parsed: null,
        });

        await expect(parseMessage("invalid")).rejects.toThrow("Structured query cannot be null");
    });

    // ✅ 3. Ensure OpenAI is called correctly
    it("calls OpenAI with correct parameters", async () => {
        const mockResponse = {
            output_parsed: {
                query: "pizza",
                near: null,
                openNow: null,
            },
        };

        (openai.responses.parse as any).mockResolvedValue(mockResponse);

        await parseMessage("pizza");

        expect(openai.responses.parse).toHaveBeenCalledOnce();

        const callArgs = (openai.responses.parse as any).mock.calls[0][0];

        expect(callArgs.model).toBe("gpt-4o-mini");
        expect(callArgs.input[1].content).toBe("pizza");
    });
});
