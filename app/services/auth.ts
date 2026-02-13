import apiClient from '../lib/axios';

// Define the shape of the login response data (inside the 'data' field)
interface LoginData {
    token: string;
    user: {
        id: number;
        full_name: string;
        username: string;
        email: string;
        role: string | { name: string };
        status: string;
        avatar_url?: string;
    };
}

// Standardized API response wrapper
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Define the shape of the error response from backend
interface ApiError {
    response?: {
        data?: {
            message?: string;
            error?: string;
        };
    };
    message: string;
}

export const authService = {
    // Login function
    login: async (username: string, password: string): Promise<LoginData> => {
        try {
            const response = await apiClient.post<ApiResponse<LoginData>>('/api/login', {
                username,
                password,
            });
            return response.data.data;
        } catch (error: any) {
            // Throw a clean error message
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.message;

            let message = 'Login failed. Please check your connection.';

            if (errorMessage) {
                // Map backend messages to user-friendly messages
                if (errorMessage.includes('not found') || errorMessage.includes('Not found')) {
                    message = 'Akun tidak ditemukan.';
                } else if (errorMessage.includes('Invalid password') || errorMessage.includes('invalid password')) {
                    message = 'Password salah.';
                } else if (errorMessage.includes('inactive') || errorMessage.includes('Inactive')) {
                    message = 'Akun anda tidak aktif. Silahkan hubungi administrator.';
                } else {
                    message = errorMessage;
                }
            }

            throw new Error(message);
        }
    }
};
