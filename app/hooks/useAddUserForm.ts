/**
 * Custom hook for Add User form logic
 * Business Logic Layer - Manages form state and API interaction
 */

"use client";

import { useState } from "react";
import { createUser } from "@/app/services/userService";
import {
    AddUserFormState,
    AddUserFormHandlers,
    AddUserFormData,
} from "@/app/types/addUser";

const INITIAL_FORM_STATE: AddUserFormData = {
    fullName: "",
    username: "",
    email: "",
    password: "",
    roleId: 0, // No default selection - user must choose
};

interface UseAddUserFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const useAddUserForm = ({ onSuccess, onError }: UseAddUserFormProps = {}) => {
    const [formState, setFormState] = useState<AddUserFormState>({
        ...INITIAL_FORM_STATE,
        isLoading: false,
        errors: {},
    });

    /**
     * Validate form data
     * Returns errors object if validation fails
     */
    const validateForm = (): Partial<Record<keyof AddUserFormData | "general", string>> => {
        const errors: Partial<Record<keyof AddUserFormData | "general", string>> = {};

        // Full name validation
        if (!formState.fullName.trim()) {
            errors.fullName = "Full name is required";
        } else if (formState.fullName.trim().length < 3) {
            errors.fullName = "Full name must be at least 3 characters";
        }

        // Username validation
        if (!formState.username.trim()) {
            errors.username = "Username is required";
        } else if (formState.username.trim().length < 3) {
            errors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formState.username)) {
            errors.username = "Username can only contain letters, numbers, and underscores";
        }

        // Email validation
        if (!formState.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            errors.email = "Please enter a valid email address";
        }

        // Password validation - Strong password requirements
        if (!formState.password) {
            errors.password = "Password is required";
        } else {
            const minLength = 8;
            const hasUppercase = /[A-Z]/.test(formState.password);
            const hasLowercase = /[a-z]/.test(formState.password);
            const hasNumber = /[0-9]/.test(formState.password);
            const hasSpecialChar = /[@#$%^&*!]/.test(formState.password);

            if (formState.password.length < minLength) {
                errors.password = `Password must be at least ${minLength} characters`;
            } else if (!hasUppercase) {
                errors.password = "Password must contain at least one uppercase letter";
            } else if (!hasLowercase) {
                errors.password = "Password must contain at least one lowercase letter";
            } else if (!hasNumber) {
                errors.password = "Password must contain at least one number";
            } else if (!hasSpecialChar) {
                errors.password = "Password must contain at least one special character (@#$%^&*!)";
            }
        }

        // Role validation
        if (!formState.roleId) {
            errors.roleId = "Please select a role";
        }

        return errors;
    };

    /**
     * Handle field change
     */
    const handleChange = (field: keyof AddUserFormData, value: string | number) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
            errors: { ...prev.errors, [field]: undefined }, // Clear field error
        }));
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setFormState((prev) => ({ ...prev, errors: {} }));

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormState((prev) => ({ ...prev, errors }));
            return;
        }

        // Set loading state
        setFormState((prev) => ({ ...prev, isLoading: true }));

        try {
            // Call API
            const success = await createUser(
                formState.fullName,
                formState.username,
                formState.email,
                formState.password,
                formState.roleId
            );

            if (success) {
                // Reset form on success
                resetForm();
                // Call success callback
                onSuccess?.();
            } else {
                throw new Error("Failed to create user");
            }
        } catch (error: any) {
            const errorMessage = error.message || "Failed to create user. Please try again.";
            setFormState((prev) => ({
                ...prev,
                errors: { general: errorMessage },
            }));
            onError?.(errorMessage);
        } finally {
            setFormState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    /**
     * Reset form to initial state
     */
    const resetForm = () => {
        setFormState({
            ...INITIAL_FORM_STATE,
            isLoading: false,
            errors: {},
        });
    };

    const handlers: AddUserFormHandlers = {
        handleChange,
        handleSubmit,
        resetForm,
    };

    return {
        formState,
        handlers,
    };
};
