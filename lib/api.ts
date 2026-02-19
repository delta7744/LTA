const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('API error response:', error);
    throw new Error(error.message || 'API Error');
  }

  return res.json();
}
