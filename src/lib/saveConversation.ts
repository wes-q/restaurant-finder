import "server-only";
import { conversationsTable } from "@/db/schema";
import db from "@/lib/db";

export async function saveConversation(userInput: string, aiResponse: string) {
    try {
        await db.insert(conversationsTable).values({
            userInput,
            aiResponse,
        });

        return { success: true };
    } catch (error) {
        console.error("DB Save Error:", error);
        return { success: false, error: "Failed to save to file" };
    }
}
