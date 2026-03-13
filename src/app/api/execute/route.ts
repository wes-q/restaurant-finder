import { NextRequest, NextResponse } from "next/server";
import nlp from "@/services/ai/nlp";

const API_KEY = process.env.FOURSQUARE_API;
const VALID_CODE = "pioneerdevai";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const message = searchParams.get("message");
        const code = searchParams.get("code");

        if (!message) {
            return NextResponse.json({ error: "Missing message parameter" }, { status: 400 });
        }

        if (code !== VALID_CODE) {
            return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
        }

        const structuredQuery = await nlp(message);

        if (!structuredQuery) {
            return NextResponse.json({ error: "Could not interpret query" }, { status: 400 });
        }

        const url = new URL("https://places-api.foursquare.com/places/search");

        url.searchParams.set("query", structuredQuery.query);
        url.searchParams.set("open_now", structuredQuery.openNow.toString());

        if (structuredQuery.near) {
            url.searchParams.set("near", structuredQuery.near);
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "X-Places-Api-Version": "2025-06-17",
                Accept: "application/json",
            },
        });

        const data = await response.json();

        return NextResponse.json({
            success: true,
            message,
            results: data,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Internal server error",
            },
            { status: 500 },
        );
    }
}
