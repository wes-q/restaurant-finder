import "server-only";
import { type Place, type StructuredQuery, PlaceSchema } from "@/types/place";
import { z } from "zod";
import { PLACE_FIELDS } from "@/types/place";
import { fuzzySearch } from "@/lib/fuzzy-search";
const DEFAULT_CATEGORY_ID = "63be6904847c3692a84b9bb5"; // Default umbrella category for all "Dining and Drinking"

export async function searchPlaces(structuredQuery: StructuredQuery): Promise<Place[]> {
    const API_KEY = process.env.FOURSQUARE_API;
    if (!API_KEY) {
        throw new Error("FOURSQUARE_API key is missing from .env");
    }

    const url = new URL("https://places-api.foursquare.com/places/search");
    const aiCategory = structuredQuery.category;

    url.searchParams.set("query", structuredQuery.query);
    url.searchParams.set("fields", PLACE_FIELDS);
    url.searchParams.set("sort", "RELEVANCE");
    url.searchParams.set("limit", "50");

    const categoryId = aiCategory ? fuzzySearch(aiCategory) : null;
    url.searchParams.set("fsq_category_ids", categoryId ?? DEFAULT_CATEGORY_ID);

    if (structuredQuery.openNow != null) {
        url.searchParams.set("open_now", structuredQuery.openNow.toString());
    }

    if (structuredQuery.near != null) {
        url.searchParams.set("near", structuredQuery.near);
    }

    console.log("FSQ QUERY URL:", url.href);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "X-Places-Api-Version": "2025-06-17",
            Accept: "application/json",
        },
    });

    const data = await response.json();

    const places = data.results.map((place: any) => ({
        fsq_place_id: place.fsq_place_id,
        name: place.name,
        website: place.website,
        categories: place.categories,
        distance: place.distance,
        tel: place.tel,
        email: place.email,
        // formatted_address: place.location?.formatted_address,
        location: place.location,
    }));

    return z.array(PlaceSchema).parse(places);
}
