/**
 * Custom hook for login form logic
 * Presentation layer - manages form state and business logic
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/auth";
import { LoginFormState, LoginFormHandlers } from "@/app/types/auth";
import { validateLoginForm } from "@/app/lib/validation";

export const useLoginForm = () => {
    const router = useRouter();
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
            // Call API
            const response = await authService.login(
                formState.username,
                formState.password
            );

            // Store token
            localStorage.setItem("token", response.token);
            // Optional: Store username if needed
            localStorage.setItem("username", formState.username);

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (error: any) {
            setFormState((prev) => ({
                ...prev,
                errors: {
                    general: error.message || "Terjadi kesalahan saat login.",
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
