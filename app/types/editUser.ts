/**
 * Type definitions for Edit User feature
 */

export interface EditUserFormData {
    id: number;
    fullName: string;
    username: string; // Read-only
    email: string;
    role: string; // Read-only
    status: "active" | "inactive";
    contacts: { type: string; value: string; is_primary: boolean }[];
}

export interface EditUserFormState extends EditUserFormData {
    isLoading: boolean;
    errors: Partial<Record<keyof EditUserFormData | "general", string>>;
}

export interface EditUserFormHandlers {
    handleChange: (field: keyof EditUserFormData, value: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    resetForm: () => void;
    addContact: () => void;
    removeContact: (index: number) => void;
    updateContact: (index: number, field: "type" | "value" | "is_primary", value: string | boolean) => void;
}
