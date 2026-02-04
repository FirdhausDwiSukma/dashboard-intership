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
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("avatar_url");
            localStorage.removeItem("email");
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
    const isFormData = options.body instanceof FormData;

    // Merge headers: Auth header + user provided headers
    const headers: any = {
        ...authHelper.getAuthHeader(),
        ...(options.headers || {}),
    };

    // Only set Content-Type to application/json if it's NOT FormData and not already set
    if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // If unauthorized, clear token and redirect to login
    if (response.status === 401) {
        authHelper.clearToken();
        // Optional: Trigger full page reload or redirect
        // if (typeof window !== "undefined") window.location.href = "/login";
    }

    return response;
}
