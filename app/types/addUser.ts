/**
 * Type definitions for Add User feature
 */

export interface AddUserFormData {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleId: number;
    contacts: { type: string; value: string; is_primary: boolean }[];
}

export interface AddUserFormState extends AddUserFormData {
    isLoading: boolean;
    errors: Partial<Record<keyof AddUserFormData | "general", string>>;
}

export interface AddUserFormHandlers {
    handleChange: (field: keyof AddUserFormData, value: string | number) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    resetForm: () => void;
    addContact: () => void;
    removeContact: (index: number) => void;
    updateContact: (index: number, field: "type" | "value" | "is_primary", value: string | boolean) => void;
}

export interface Role {
    id: number;
    name: string;
    displayName: string;
}

// Available roles for user creation
export const AVAILABLE_ROLES: Role[] = [
    { id: 2, name: "hr", displayName: "HR" },
    { id: 3, name: "pic", displayName: "PIC/Mentor" },
    { id: 4, name: "intern", displayName: "Intern" },
];
