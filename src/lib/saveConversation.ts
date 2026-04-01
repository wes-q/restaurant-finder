"use server";

import fs from "node:fs/promises";
import path from "node:path";

export async function saveConversation(userInput: string, aiResponse: string) {
    try {
        // 1. Define the file path (saves to a 'logs' folder in your project root)
        const logDir = path.join(process.cwd(), "src/data");
        const filePath = path.join(logDir, "conversations.json");

        // 2. Ensure the directory exists
        await fs.mkdir(logDir, { recursive: true });

        // 3. Create the data object
        const newEntry = {
            timestamp: new Date().toISOString(),
            userInput,
            aiResponse,
        };

        // 4. Read existing data or start with an empty array
        let logs = [];
        try {
            const fileContent = await fs.readFile(filePath, "utf-8");
            logs = JSON.parse(fileContent);
        } catch (e) {
            // File doesn't exist yet, stick with empty array
        }

        // 5. Append and write back to the file
        logs.push(newEntry);
        await fs.writeFile(filePath, JSON.stringify(logs, null, 2));

        return { success: true };
    } catch (error) {
        console.error("File Save Error:", error);
        return { success: false, error: "Failed to save to file" };
    }
}
