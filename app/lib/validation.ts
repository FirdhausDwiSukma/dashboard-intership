/**
 * Validation utilities
 * Domain layer - contains validation business logic
 */

import { LoginCredentials, ValidationErrors } from "@/app/types/auth";

export const validateUsername = (username: string): string | undefined => {
    if (!username || username.trim() === "") {
        return "Username tidak boleh kosong";
    }
    if (username.length < 3) {
        return "Username minimal 3 karakter";
    }
    return undefined;
};

export const validatePassword = (password: string): string | undefined => {
    if (!password || password.trim() === "") {
        return "Password tidak boleh kosong";
    }
    if (password.length < 6) {
        return "Password minimal 6 karakter";
    }
    return undefined;
};

export const validateLoginForm = (
    credentials: LoginCredentials
): ValidationErrors => {
    const errors: ValidationErrors = {};

    const usernameError = validateUsername(credentials.username);
    if (usernameError) {
        errors.username = usernameError;
    }

    const passwordError = validatePassword(credentials.password);
    if (passwordError) {
        errors.password = passwordError;
    }

    return errors;
};
