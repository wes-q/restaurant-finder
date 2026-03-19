import Fuse from "fuse.js";
import { restaurantCategories } from "@/data/restaurant-categories";

export function fuzzySearch(aiCategory: string): string | null {
    const fuse = new Fuse(restaurantCategories, {
        keys: ["category_name"],
        threshold: 0.4, // Lower is stricter, higher is "fuzzier"
        includeScore: true,
    });

    const results = fuse.search(aiCategory);
    if (results.length === 0) {
        console.log("No category match for:", aiCategory);
        return null;
    }

    const bestMatch = results[0].item;
    const bestMatchCategoryId = bestMatch.category_id;
    console.log("MOST RELEVANT CATEGORY ID", bestMatch.category_id); // Returns the single most relevant ID
    return bestMatchCategoryId;
}
