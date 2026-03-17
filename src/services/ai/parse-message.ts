import "server-only";
import { openai } from "./openai";
import { zodTextFormat } from "openai/helpers/zod";
import { StructuredQuerySchema } from "@/types/place";
import { StructuredQuery } from "@/types/place";

export async function parseMessage(userQuery: string): Promise<StructuredQuery> {
    const response = await openai.responses.parse({
        model: "gpt-4o-mini",
        input: [
            { role: "system", content: "Breakdown the user's query into a structured request" },
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
