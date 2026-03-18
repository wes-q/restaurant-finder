import Fuse from "fuse.js";
import { restaurantCategories } from "@/data/restaurant-categories";

export function fuzzySearch(aiCategory: string): string {
    const fuse = new Fuse(restaurantCategories, {
        keys: ["category_name"],
        threshold: 0.3, // Lower is stricter, higher is "fuzzier"
        includeScore: true,
    });

    const results = fuse.search(aiCategory);
    const bestMatch = results[0].item;
    const bestMatchCategoryId = bestMatch.category_id;
    console.log("MOST RELEVANT CATEGORY ID", bestMatch.category_id); // Returns the single most relevant ID
    return bestMatchCategoryId;
}
