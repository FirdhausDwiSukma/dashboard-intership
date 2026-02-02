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
}

export interface EditUserFormState extends EditUserFormData {
    isLoading: boolean;
    errors: Partial<Record<keyof EditUserFormData | "general", string>>;
}

export interface EditUserFormHandlers {
    handleChange: (field: keyof EditUserFormData, value: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    resetForm: () => void;
}
