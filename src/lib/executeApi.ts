export async function executeApi(message: string) {
    const url = `/api/execute?message=${encodeURIComponent(message)}&code=pioneerdevai`; // TODO
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();
    return data;
}
