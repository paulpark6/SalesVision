// apps/web/src/lib/api-client.ts
import { supabase } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'; // Use proxy by default

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const token = (await supabase?.auth.getSession())?.data.session?.access_token;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

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
