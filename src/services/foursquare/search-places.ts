import "server-only";
import { type Place, type StructuredQuery, PlaceSchema } from "@/types/place";
import { z } from "zod";

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

    const places = data.results.map((place: any) => ({
        fsq_place_id: place.fsq_place_id,
        name: place.name,
        website: place.website,
        categories: place.categories,
        distance: place.distance,
        tel: place.tel,
        email: place.email,
        formatted_address: place.location?.formatted_address,
    }));

    return z.array(PlaceSchema).parse(places);
}
