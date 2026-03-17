"use client";

import { useState, type SubmitEventHandler } from "react";
import { executeApi } from "@/lib/executeApi";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Place } from "@/types/place";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Globe } from "lucide-react";

export default function QueryPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        if (!query.trim()) {
            setError("Message is required");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const { places } = await executeApi(query);
            setPlaces(places);
        } catch (err) {
            if (err instanceof TypeError && err.message === "Failed to fetch") {
                setError("Network error. Please check your connection.");
            } else if (err instanceof Error && err.message.includes("500")) {
                setError("Server error. Please try again later.");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* FORM */}
            <Card className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field>
                        <FieldDescription>Describe what you're looking for</FieldDescription>

                        <Textarea name="message" placeholder="Find me a cheap sushi restaurant nearby..." value={query} onChange={(e) => setQuery(e.target.value)} className="min-h-[100px]" />
                    </Field>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Searching..." : "Search Places"}
                    </Button>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
            </Card>

            {/* RESULTS */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Places</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Spinner />
                    </div>
                ) : places.length === 0 ? (
                    <Card className="p-6 text-center text-muted-foreground">No places found.</Card>
                ) : (
                    places.map((place) => (
                        <Card key={place.fsq_place_id} className="p-4">
                            <CardContent className="p-0 space-y-3">
                                {/* Name */}
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg">{place.name}</h3>
                                </div>

                                {(place.categories ?? []).length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(place.categories ?? []).map((cat) => (
                                            <Badge key={cat.fsq_category_id} variant="secondary">
                                                {cat.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Info */}
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    {place.location?.formatted_address && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{place.location.formatted_address}</span>
                                        </div>
                                    )}

                                    {place.tel && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <span>{place.tel}</span>
                                        </div>
                                    )}

                                    {place.website && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            <a href={place.website} target="_blank" className="underline">
                                                Visit website
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Distance */}
                                <div className="text-xs text-muted-foreground">Distance: {place.distance} meters</div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
