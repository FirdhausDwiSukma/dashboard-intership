/**
 * Authentication domain types
 * Domain layer - contains core business logic types
 */

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginFormState {
    username: string;
    password: string;
    isLoading: boolean;
    errors: ValidationErrors;
    showPassword?: boolean;
}

export interface ValidationErrors {
    username?: string;
    password?: string;
    general?: string;
}

export interface LoginFormHandlers {
    handleUsernameChange: (value: string) => void;
    handlePasswordChange: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    toggleShowPassword?: () => void;
}
