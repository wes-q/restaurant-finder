import "server-only";
import { openai } from "./openai";
import { zodTextFormat } from "openai/helpers/zod";
import { StructuredQuerySchema } from "@/types/place";
import { StructuredQuery } from "@/types/place";
import { SYSTEM_PROMPT } from "./system-prompt";

export async function parseMessage(userQuery: string): Promise<StructuredQuery> {
    const response = await openai.responses.parse({
        model: "gpt-4o-mini",
        input: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: userQuery,
            },
        ],
        text: {
            format: zodTextFormat(StructuredQuerySchema, "query"),
        },
    });

    const structuredQuery = response.output_parsed;
    if (!structuredQuery) {
        throw new Error("Structured query cannot be null");
    }
    return structuredQuery;
}
