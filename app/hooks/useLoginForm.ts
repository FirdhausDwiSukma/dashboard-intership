/**
 * Custom hook for login form logic
 * Presentation layer - manages form state and business logic
 */

"use client";

import { useState } from "react";
import { LoginFormState, LoginFormHandlers } from "@/app/types/auth";
import { validateLoginForm } from "@/app/lib/validation";

export const useLoginForm = () => {
    const [formState, setFormState] = useState<LoginFormState>({
        username: "",
        password: "",
        isLoading: false,
        errors: {},
    });

    const handleUsernameChange = (value: string) => {
        setFormState((prev) => ({
            ...prev,
            username: value,
            errors: { ...prev.errors, username: undefined },
        }));
    };

    const handlePasswordChange = (value: string) => {
        setFormState((prev) => ({
            ...prev,
            password: value,
            errors: { ...prev.errors, password: undefined },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setFormState((prev) => ({ ...prev, errors: {} }));

        // Validate form
        const errors = validateLoginForm({
            username: formState.username,
            password: formState.password,
        });

        if (Object.keys(errors).length > 0) {
            setFormState((prev) => ({ ...prev, errors }));
            return;
        }

        // Set loading state
        setFormState((prev) => ({ ...prev, isLoading: true }));

        try {
            // TODO: Implement actual login API call here
            // For now, just simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log("Login successful:", {
                username: formState.username,
                password: "***hidden***",
            });

            // TODO: Handle successful login (redirect, store token, etc.)
            alert(`Login berhasil! Username: ${formState.username}`);
        } catch (error) {
            setFormState((prev) => ({
                ...prev,
                errors: {
                    general: "Terjadi kesalahan saat login. Silakan coba lagi.",
                },
            }));
        } finally {
            setFormState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const handlers: LoginFormHandlers = {
        handleUsernameChange,
        handlePasswordChange,
        handleSubmit,
    };

    return {
        formState,
        handlers,
    };
};
