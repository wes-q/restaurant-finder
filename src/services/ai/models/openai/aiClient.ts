const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BASE_URL = "https://api.openai.com/v1/responses";

export async function aiClient(body: any) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`OpenAI API error: ${error}`);
    }

    return res.json();
}
