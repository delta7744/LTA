const CREDENTIAL = {
    Login: process.env.NEXT_PUBLIC_API_POSTMAN_API_LOGIN || "",
    Password: process.env.NEXT_PUBLIC_API_POSTMAN_API_PASSWORD || "",
};

const BASE_URL = process.env.NEXT_PUBLIC_API_POSTMAN_API_URL || "";

/**
 * Reusable function to request the MyGo Hotel API.
 * @param service The name of the service (e.g., 'ListHotel', 'ListCity', 'HotelDetail', 'HotelSearch')
 * @param data The payload data for the request
 * @returns The parsed JSON response
 */
export async function requestMyGoAPI(service: string, data: any = {}) {
    // The new REST endpoint format: https://admin.mygo.co/api/hotel/{nom de service}
    // We remove any trailing slashes and append the service name
    const url = `${BASE_URL.replace(/\/$/, "")}/${service}`;

    try {
        const response = await fetch(url, {
            method: "POST", // New API uses POST with body
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                Credential: CREDENTIAL,
                ...data
            }),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`MyGo API request failed with status ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`MyGo API Request Error (${service}):`, error);
        throw error;
    }
}
