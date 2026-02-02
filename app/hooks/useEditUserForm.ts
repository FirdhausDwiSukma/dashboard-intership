/**
 * Custom hook for Edit User form logic
 * Business Logic Layer - Manages form state and API interaction for editing users
 */

"use client";

import { useState, useEffect } from "react";
import { updateUser, User } from "@/app/services/userService";
import {
    EditUserFormState,
    EditUserFormHandlers,
    EditUserFormData,
} from "@/app/types/editUser";

interface UseEditUserFormProps {
    user: User | null;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const useEditUserForm = ({ user, onSuccess, onError }: UseEditUserFormProps) => {
    const [formState, setFormState] = useState<EditUserFormState>({
        id: 0,
        fullName: "",
        username: "",
        email: "",
        role: "",
        status: "active",
        isLoading: false,
        errors: {},
    });

    // Initialize/Reset form when user changes
    useEffect(() => {
        if (user) {
            setFormState({
                id: user.id,
                fullName: user.full_name,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                isLoading: false,
                errors: {},
            });
        }
    }, [user]);

    /**
     * Validate form data
     */
    const validateForm = (): Partial<Record<keyof EditUserFormData | "general", string>> => {
        const errors: Partial<Record<keyof EditUserFormData | "general", string>> = {};

        // Full name validation
        if (!formState.fullName.trim()) {
            errors.fullName = "Full name is required";
        } else if (formState.fullName.trim().length < 3) {
            errors.fullName = "Full name must be at least 3 characters";
        }

        // Email validation
        if (!formState.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            errors.email = "Please enter a valid email address";
        }

        return errors;
    };

    /**
     * Handle field change
     */
    const handleChange = (field: keyof EditUserFormData, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
            errors: { ...prev.errors, [field]: undefined },
        }));
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formState.id) return;

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
            const success = await updateUser(
                formState.id,
                {
                    full_name: formState.fullName,
                    email: formState.email,
                    status: formState.status,
                }
            );

            if (success) {
                onSuccess?.();
            } else {
                throw new Error("Failed to update user");
            }
        } catch (error: any) {
            const errorMessage = error.message || "Failed to update user. Please try again.";
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
     * Reset form to initial state (based on current user prop)
     */
    const resetForm = () => {
        if (user) {
            setFormState({
                id: user.id,
                fullName: user.full_name,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                isLoading: false,
                errors: {},
            });
        }
    };

    const handlers: EditUserFormHandlers = {
        handleChange,
        handleSubmit,
        resetForm,
    };

    return {
        formState,
        handlers,
    };
};
