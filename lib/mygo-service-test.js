import fetch from 'node-fetch';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const CREDENTIAL = {
    Login: process.env.NEXT_PUBLIC_API_POSTMAN_API_LOGIN || "",
    Password: process.env.NEXT_PUBLIC_API_POSTMAN_API_PASSWORD || "",
};

const BASE_URL = process.env.NEXT_PUBLIC_API_POSTMAN_API_URL || "";

export async function requestMyGoAPI(service, data = {}) {
    const url = `${BASE_URL.replace(/\/$/, "")}/${service}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                Credential: CREDENTIAL,
                ...data
            }),
        });

        if (!response.ok) {
            throw new Error(`MyGo API request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`MyGo API Request Error (${service}):`, error);
        throw error;
    }
}
