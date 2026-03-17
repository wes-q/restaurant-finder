"use client";

import { useState } from "react";
import { type SubmitEventHandler } from "react";
import { executeApi } from "@/lib/executeApi";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Place } from "@/types/place";

export default function QueryTraditionalReact() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (typeof query !== "string" || query.trim() === "") {
            setError("Message is required");
            return;
        }
        console.log("handleSubmit called");
        try {
            console.log("try block entered");
            setLoading(true);
            setError(null);
            const { places } = await executeApi(query);
            setPlaces(places);
        } catch (err) {
            console.log("ERR", err);
            if (err instanceof TypeError && err.message === "Failed to fetch") {
                setError("Network error. Please check your connection.");
            } else if (err instanceof Error && err.message) {
                setError(err.message);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Field className="p-2">
                    <FieldDescription>Enter your message below.</FieldDescription>
                    <Textarea name="message" placeholder="Find me a cheap sushi restaurant in downtown Los Angeles that's open now." value={query} onChange={(e) => setQuery(e.target.value)} />
                    <Button type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Send message"}
                    </Button>
                    {error && <p className="text-red-500">{error}</p>}
                </Field>
            </form>
            <div className="p-2">
                <h1 className="text-xl">Places</h1>
                <div className="bg-white text-black h-full min-h-36 rounded-lg p-2">
                    {places.map((place) => (
                        <div key={place.fsq_place_id}>{place.name}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
