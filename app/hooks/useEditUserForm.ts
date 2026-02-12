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
        contacts: [],
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
                role: typeof user.role === 'string' ? user.role : user.role.name,
                status: user.status,
                contacts: user.contacts?.map(c => ({
                    type: c.contact_type,
                    value: c.contact_value,
                    is_primary: c.is_primary
                })) || [],
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

        // Contact validation
        if (formState.contacts && formState.contacts.length > 0) {
            for (let i = 0; i < formState.contacts.length; i++) {
                const contact = formState.contacts[i];
                if (!contact.value.trim()) {
                    errors.general = `Contact #${i + 1} is required`;
                    break;
                }
                const len = contact.value.trim().length;
                if (len < 10 || len > 13) {
                    errors.general = `Contact #${i + 1} number must be between 10 and 13 characters`;
                    break;
                }
                // Optional: Check for numeric only
                if (!/^\d+$/.test(contact.value.trim())) {
                    errors.general = `Contact #${i + 1} must contain only numbers`;
                    break;
                }
            }
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
                    contacts: formState.contacts,
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
                role: typeof user.role === 'string' ? user.role : user.role.name,
                status: user.status,
                contacts: user.contacts?.map(c => ({
                    type: c.contact_type,
                    value: c.contact_value,
                    is_primary: c.is_primary
                })) || [],
                isLoading: false,
                errors: {},
            });
        }
    };

    /**
     * Contact Handlers
     */
    const addContact = () => {
        setFormState(prev => ({
            ...prev,
            contacts: [...prev.contacts, { type: "phone", value: "", is_primary: false }]
        }));
    };

    const removeContact = (index: number) => {
        setFormState(prev => ({
            ...prev,
            contacts: prev.contacts.filter((_, i) => i !== index)
        }));
    };

    const updateContact = (index: number, field: "type" | "value" | "is_primary", value: string | boolean) => {
        setFormState(prev => {
            const newContacts = [...prev.contacts];
            if (field === "is_primary" && value === true) {
                // Ensure only one primary
                newContacts.forEach(c => c.is_primary = false);
            }
            newContacts[index] = { ...newContacts[index], [field]: value };
            return { ...prev, contacts: newContacts };
        });
    };

    const handlers: EditUserFormHandlers = {
        handleChange,
        handleSubmit,
        resetForm,
        addContact,
        removeContact,
        updateContact,
    };

    return {
        formState,
        handlers,
    };
};
