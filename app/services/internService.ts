/**
 * API Service for Interns
 * Connects to the backend API for intern management
 */

import { fetchWithAuth } from "@/app/utils/authHelper";

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Backend User object (nested in InternProfile response)
export interface InternUser {
    id: number;
    full_name: string;
    username: string;
    email: string;
    role_id: number;
    role: { id: number; name: string };
    status: "active" | "inactive";
    avatar_url?: string | null;
    created_at: string;
    updated_at: string;
}

// Intern interface matching backend InternProfile response
export interface Intern {
    id: number;
    user_id: number;
    user: InternUser;
    pic_id: number | null;
    pic: InternUser | null;
    batch: string;
    division: string;
    university: string;
    major: string;
    start_date: string;
    end_date: string;
    created_at: string;
}

// API Response interface for paginated list
export interface InternsResponse {
    data: Intern[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

// Stats response from backend
export interface InternStats {
    total_interns: number;
    active_interns: number;
    current_batch: string;
    performance_avg: string;
}

// Create intern request payload
export interface CreateInternPayload {
    full_name: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    pic_id?: number;
    batch: string;
    division: string;
    university: string;
    major: string;
    start_date: string;
    end_date: string;
}

// PIC option for dropdown
export interface PICOption {
    id: number;
    full_name: string;
}

/**
 * Fetch interns with pagination from backend API
 */
export async function fetchInterns(page: number = 1, limit: number = 10): Promise<InternsResponse> {
    try {
        const response = await fetchWithAuth(
            `${API_BASE_URL}/api/interns?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        // Backend wraps response in { success, message, data: { data, total, page, limit, total_pages } }
        const payload = json.data || json;
        return {
            data: payload.data || [],
            total: payload.total || 0,
            page: payload.page || 1,
            limit: payload.limit || limit,
            total_pages: payload.total_pages || 0,
        };
    } catch (error) {
        console.error("Error fetching interns:", error);
        return {
            data: [],
            total: 0,
            page: 1,
            limit: limit,
            total_pages: 0,
        };
    }
}

/**
 * Fetch intern stats from backend
 */
export async function fetchInternStats(): Promise<InternStats> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/interns/stats`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data as InternStats;
    } catch (error) {
        console.error("Error fetching intern stats:", error);
        return {
            total_interns: 0,
            active_interns: 0,
            current_batch: "-",
            performance_avg: "-",
        };
    }
}

/**
 * Get intern by ID
 */
export async function getInternById(id: number): Promise<Intern | null> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/interns/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data as Intern;
    } catch (error) {
        console.error(`Error fetching intern ${id}:`, error);
        return null;
    }
}

/**
 * Create a new intern
 */
export async function createIntern(payload: CreateInternPayload): Promise<{ user: InternUser; profile: Intern }> {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/interns`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Delete an intern
 */
export async function deleteIntern(id: number): Promise<boolean> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/interns/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(`Error deleting intern ${id}:`, error);
        throw error;
    }
}

/**
 * Fetch available PICs (users with PIC/HR/Admin roles) for the dropdown
 */
export async function fetchPICs(): Promise<PICOption[]> {
    try {
        const response = await fetchWithAuth(
            `${API_BASE_URL}/api/users?page=1&limit=100`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        // Backend wraps response in { success, message, data: { data: [...users], ... } }
        const payload = json.data || json;
        const users = payload.data || [];
        // Filter users that can be PICs (role_id 1=super_admin, 2=hr, 3=pic)
        return users
            .filter((u: any) => {
                const roleId = u.role_id || (u.role && u.role.id);
                return roleId && [1, 2, 3].includes(roleId);
            })
            .map((u: any) => ({
                id: u.id,
                full_name: u.full_name,
            }));
    } catch (error) {
        console.error("Error fetching PICs:", error);
        return [];
    }
}
