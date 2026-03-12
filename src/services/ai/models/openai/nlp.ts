import { aiClient } from "./aiClient";

export default async function nlp() {
    const body = {
        model: "gpt-4o-mini",
        input: "Tell me a three sentence bedtime story about a unicorn.",
    };
    const aiResponse = await aiClient(body);
    console.log(JSON.stringify(aiResponse, null, 2));
}
