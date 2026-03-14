import { BACKEND_API_URL } from '@env';

export const vanillaJSFetch = {
  get: async <T>(endpoint: string): Promise<T> => {
    // In a real app, you'd add auth headers, error handling, etc.
    const response = await fetch(`${BACKEND_API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },
};