import "server-only";
import type { Place, StructuredQuery } from "@/types/place";

const API_KEY = process.env.FOURSQUARE_API;

export async function searchPlaces(structuredQuery: StructuredQuery): Promise<Place[]> {
    if (!API_KEY) {
        throw new Error("FOURSQUARE_API key is missing from .env");
    }

    const url = new URL("https://places-api.foursquare.com/places/search");

    url.searchParams.set("query", structuredQuery.query);

    if (structuredQuery.openNow != null) {
        url.searchParams.set("open_now", structuredQuery.openNow.toString());
    }

    if (structuredQuery.near != null) {
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
    return data.results;
}
