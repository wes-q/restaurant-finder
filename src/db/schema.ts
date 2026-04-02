import { pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const conversationsTable = pgTable("conversations", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userInput: varchar("user_input", { length: 255 }).notNull(),
    aiResponse: varchar("ai_response").notNull(),
});
