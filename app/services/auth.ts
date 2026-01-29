import apiClient from '../lib/axios';

// Define the shape of the login response
interface LoginResponse {
    message: string;
    token: string;
}

// Define the shape of the error response from backend
interface ApiError {
    response?: {
        data?: {
            error?: string;
        };
    };
    message: string;
}

export const authService = {
    // Login function
    login: async (username: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>('/login', {
                username,
                password,
            });
            return response.data;
        } catch (error: any) {
            // Throw a clean error message
            const apiError = error as ApiError;
            const message = apiError.response?.data?.error || 'Login failed. Please check your connection.';
            throw new Error(message);
        }
    }
};
