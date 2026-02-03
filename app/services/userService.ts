/**
 * API Service for Users
 * Connects to the backend API
 */

import { fetchWithAuth } from "@/app/utils/authHelper";

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// User interface matching backend response
export interface User {
    id: number;
    full_name: string;
    username: string;
    email: string;
    role: string; // role.name from backend
    status: "active" | "inactive";
    avatar_url?: string;
    contacts?: UserContact[];
}

export interface UserContact {
    id: number;
    user_id: number;
    contact_type: "phone" | "whatsapp";
    contact_value: string;
    is_primary: boolean;
    verified_at?: string;
    created_at: string;
    updated_at: string;
}

// API Response interface
export interface UsersResponse {
    data: User[];
    total: number;
    page: number;
    totalPages: number;
}

/**
 * Fetch users with pagination from backend API
 * 
 * @param page - Current page (1-indexed)
 * @param limit - Number of items per page
 * @returns Promise with paginated users data
 */
export async function fetchUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/users?page=${page}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UsersResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        // Return empty data on error
        return {
            data: [],
            total: 0,
            page: 1,
            totalPages: 0,
        };
    }
}

/**
 * Get total users count from backend
 * Used for displaying total count without loading all data
 */
export async function getTotalUsersCount(): Promise<number> {
    try {
        // We can get this from the users endpoint
        const response = await fetchWithAuth(`${API_BASE_URL}/api/users?page=1&limit=1`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UsersResponse = await response.json();
        return data.total;
    } catch (error) {
        console.error("Error fetching user count:", error);
        return 0;
    }
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/users/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }
}

/**
 * Create a new user
 */
export async function createUser(
    fullName: string,
    username: string,
    email: string,
    password: string,
    roleId: number,
    contacts: { type: string; value: string; is_primary: boolean }[] = []
): Promise<boolean> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/users`, {
            method: "POST",
            body: JSON.stringify({
                full_name: fullName,
                username,
                email,
                password,
                role_id: roleId,
                contacts,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error; // Re-throw to let the caller handle it
    }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: number): Promise<boolean> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/users/${userId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

/**
 * Update an existing user
 */
export async function updateUser(
    id: number,
    userData: {
        full_name: string;
        email: string;
        status: "active" | "inactive";
        contacts: { type: string; value: string; is_primary: boolean }[];
    }
): Promise<boolean> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        throw error;
    }
}

/**
 * Deactivate a user
 */
export async function deactivateUser(id: number): Promise<boolean> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/users/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(`Error deactivating user ${id}:`, error);
        return false;
    }
}

/**
 * Hard delete a user (permanent deletion)
 * WARNING: This is destructive and cannot be undone
 * Only for super_admin role
 */
export async function hardDeleteUser(id: number): Promise<boolean> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/users/${id}/permanent`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(`Error permanently deleting user ${id}:`, error);
        return false;
    }
}

