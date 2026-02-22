const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const headers: Record<string, string> = { ...(options.headers || {}) };

  // Don't set Content-Type for FormData, browser will set it with boundary
  if (!(options.body instanceof FormData)) {
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = "API Error";
    try {
      const errorData = await res.json();
      console.error("API JSON error:", errorData);
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      try {
        const text = await res.text();
        console.error("API Text error:", text);
        errorMessage = text.substring(0, 100) || errorMessage;
      } catch (e2) {
        console.error("API parse error:", e2);
      }
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
