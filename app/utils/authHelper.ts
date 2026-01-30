/**
 * Authentication Helper
 * Manages JWT token storage and retrieval
 */

const TOKEN_KEY = "auth_token";

export const authHelper = {
    // Save token to localStorage
    setToken(token: string): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    // Get token from localStorage
    getToken(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    // Remove token from localStorage
    clearToken(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem(TOKEN_KEY);
        }
    },

    // Get authorization header
    getAuthHeader(): HeadersInit {
        const token = this.getToken();
        if (token) {
            return {
                Authorization: `Bearer ${token}`,
            };
        }
        return {};
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return this.getToken() !== null;
    },
};

// Helper function to make authenticated API calls
export async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const headers = {
        "Content-Type": "application/json",
        ...authHelper.getAuthHeader(),
        ...(options.headers || {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // If unauthorized, clear token and redirect to login
    if (response.status === 401) {
        authHelper.clearToken();
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    }

    return response;
}
