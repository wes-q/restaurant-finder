import { openai } from "./openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const StructuredQuery = z.object({
    query: z.string(),
    near: z.string().nullable(),
    openNow: z.boolean().nullable(),
});

export default async function nlp(userQuery: string) {
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
            format: zodTextFormat(StructuredQuery, "query"),
        },
    });

    const structuredQuery = response.output_parsed;
    return structuredQuery;
}
