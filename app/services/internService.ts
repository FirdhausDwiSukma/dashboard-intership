/**
 * API Service for Interns
 * Connects to the backend API
 */

import { fetchWithAuth } from "@/app/utils/authHelper";
import { fetchUsers } from "./userService";

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Intern interface
export interface Intern {
    id: number;
    user_id: number;
    full_name: string;
    username: string;
    email: string;
    avatar_url?: string;
    pic_id: number;
    pic_name: string; // Backend might return nested PIC obj, need to verify.
    // Based on intern_repo.go: Preload("PIC") -> PIC User struct. 
    // JSON response will use `json:"pic"` which is a User object. 
    // So frontend interface needs to match or we map it.
    pic?: { full_name: string };
    batch: string;
    division: string;
    university: string;
    major: string;
    start_date: string;
    end_date: string;
    status: "active" | "inactive";
    // Performance metrics (will come from backend calculations or separate endpoint)
    // For now backend InternProfile doesn't have these.
    task_completion_rate?: number;
    attendance_rate?: number;
    performance_level?: "low" | "medium" | "high";
    potential_level?: "low" | "medium" | "high";
}

// API Response interface
export interface InternsResponse {
    data: Intern[];
    total: number;
    page: number;
    limit: number;
    totalPages: number; // Frontend expects camelCase
}

/**
 * Fetch interns with pagination
 */
export async function fetchInterns(page: number = 1, limit: number = 10): Promise<InternsResponse> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/interns?page=${page}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform data if necessary. Backend returns snake_case total_pages.
        // Also map pic object to pic_name for frontend compatibility if needed.
        const interns = (data.data || []).map((intern: any) => ({
            ...intern,
            full_name: intern.user?.full_name || "Unknown",
            email: intern.user?.email || "Unknown",
            username: intern.user?.username || "Unknown",
            status: intern.user?.status || "inactive",
            avatar_url: intern.user?.avatar_url || null,
            pic_name: intern.pic?.full_name || "Unknown",
            // Default mock metrics if missing
            task_completion_rate: intern.task_completion_rate || 0,
            attendance_rate: intern.attendance_rate || 0,
            performance_level: intern.performance_level || "medium",
            potential_level: intern.potential_level || "medium",
        }));

        return {
            data: interns,
            total: data.total,
            page: data.page,
            limit: data.limit,
            totalPages: data.total_pages, // Map backend total_pages to frontend totalPages
        };
    } catch (error) {
        console.error("Error fetching interns:", error);
        return {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0, // Ensure this matches interface
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
            return null;
        }
        const result = await response.json();
        const intern = result.data;
        // Transform
        return {
            ...intern,
            pic_name: intern.pic?.full_name || "Unknown",
        };
    } catch (error) {
        console.error(`Error fetching intern ${id}:`, error);
        return null;
    }
}

/**
 * Create a new intern
 */
export async function createIntern(data: {
    full_name: string;
    username: string;
    email: string;
    password: string;
    pic_id: number;
    batch: string;
    division: string;
    university: string;
    major: string;
    start_date: string;
    end_date: string;
}): Promise<boolean> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/interns`, {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error("Error creating intern:", error);
        throw error;
    }
}

/**
 * Update an existing intern
 */
export async function updateIntern(id: number, data: {
    full_name: string;
    email: string;
    status: string;
    pic_id: number;
    batch: string;
    division: string;
    university: string;
    major: string;
    start_date: string;
    end_date: string;
}): Promise<boolean> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/interns/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(`Error updating intern ${id}:`, error);
        throw error;
    }
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

export async function getTotalInternsCount(): Promise<number> {
    // Implement real count if needed or reuse fetchInterns
    const response = await fetchInterns(1, 1);
    return response.total;
}

export async function getActiveInternsCount(): Promise<number> {
    // Backend doesn't support filtering by status in count yet without fetching all?
    // For now we might need a dedicated endpoint or filter support. 
    // Return 0 or mock until backend supports it.
    // Or fetch all? Expense.
    // Let's return a placeholder or approximate if API doesn't support active count.
    return 0; // TODO: Implement backend endpoint for stats
}

export interface InternStats {
    total_interns: number;
    active_interns: number;
    current_batch: string;
    performance_avg: string;
}

export async function fetchInternStats(): Promise<InternStats> {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/interns/stats`);
        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error || `HTTP error! status: ${response.status}`);
            } catch (e) {
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        return {
            total_interns: 0,
            active_interns: 0,
            current_batch: "2024-Q1",
            performance_avg: "0%",
        };
    }
}


export async function fetchPICs(): Promise<{ id: number; name: string }[]> {
    try {
        const response = await fetchUsers(1, 100);
        console.log("fetchPICs raw response:", response); // DEBUG
        const allUsers = response.data || [];

        const pics = allUsers
            .filter((user: any) => {
                const roleName = typeof user.role === 'string' ? user.role : user.user_role?.role_name || user.role?.name;
                const roleId = user.role_id || (typeof user.role === 'object' ? user.role?.id : 0);

                const isMatch = roleId === 3 || (roleName && (roleName.includes("PIC") || roleName.includes("Mentor")));
                // console.log(`checking user ${user.username}: roleId=${roleId}, roleName=${roleName}, match=${isMatch}`); // Verbose log
                return isMatch;
            })
            .map((user: any) => ({
                id: user.id,
                name: user.full_name
            }));

        console.log("fetchPICs filtered result:", pics); // DEBUG
        return pics;
    } catch (error) {
        console.error("Error fetching PICs:", error);
        return [];
    }
}
