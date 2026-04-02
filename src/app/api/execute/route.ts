import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { parseMessage } from "@/services/ai/parse-message";
import { searchPlaces } from "@/services/foursquare/search-places";
import type { StructuredQuery, Place } from "@/types/place";
import { saveConversation } from "@/lib/saveConversation";

// for vitest
function getValidCode(): string {
    if (!process.env.API_ACCESS_CODE) {
        throw new Error("API_ACCESS_CODE is not configured");
    }
    return process.env.API_ACCESS_CODE;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const message: string | null = searchParams.get("message");
        const code: string | null = searchParams.get("code");

        if (!message) {
            return NextResponse.json({ error: "Missing message parameter" }, { status: 400 });
        }

        if (!code) {
            return NextResponse.json({ error: "Missing access code" }, { status: 400 });
        }
        if (code !== getValidCode()) {
            return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
        }

        const structuredQuery: StructuredQuery = await parseMessage(message);
        if (!structuredQuery) {
            return NextResponse.json({ error: "Could not interpret query" }, { status: 400 });
        }
        console.log("Structured Query:", JSON.stringify(structuredQuery, null, 2));

        const dbResponse = await saveConversation(message, JSON.stringify(structuredQuery, null, 2));
        console.log("dbResponse", dbResponse);

        const places: Place[] = await searchPlaces(structuredQuery);
        // console.log("FSQ Response:", JSON.stringify(places, null, 2));

        return NextResponse.json({ success: true, message, places });
    } catch (error: unknown) {
        console.error("API route error:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
