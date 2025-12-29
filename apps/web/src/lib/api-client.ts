// apps/web/src/lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'; // Use proxy by default

// Key for storing auth in localStorage (must match use-auth.ts)
const AUTH_KEY = 'salesvision_auth';

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Real authentication headers go here (e.g., Authorization Bearer token)
    // For now we keep the request without mock headers.


    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const errorMessage = typeof error.detail === 'string'
            ? error.detail
            : JSON.stringify(error.detail) || `API request failed: ${response.statusText}`;
        throw new Error(errorMessage);
    }

    return response.json();
}
