import apiClient from '../lib/axios';

// Define the shape of the login response
interface LoginResponse {
    message: string;
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
            const errorData = apiError.response?.data?.error;

            let message = 'Login failed. Please check your connection.';

            if (errorData === 'USER_NOT_FOUND') {
                message = 'Akun tidak ditemukan.';
            } else if (errorData === 'INVALID_PASSWORD') {
                message = 'Password salah.';
            } else if (errorData === 'ACCOUNT_INACTIVE') {
                message = 'Akun anda tidak aktif. Silahkan hubungi administrator.';
            } else if (errorData) {
                message = errorData;
            }

            throw new Error(message);
        }
    }
};
