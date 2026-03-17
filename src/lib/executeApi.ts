export async function executeApi(message: string) {
    const url = `/api/execute?message=${encodeURIComponent(message)}&code=${process.env.NEXT_PUBLIC_API_ACCESS_CODE}`;
    const response = await fetch(url);
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Request failed: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
