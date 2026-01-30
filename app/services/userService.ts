/**
 * Mock API Service for Users
 * Simulates server-side pagination
 * Easy to replace with real API endpoints later
 */

// User interface
export interface User {
    id: number;
    name: string;
    username: string;
    avatar?: string;
    role: string;
    status: "Active" | "Inactive";
    pic: string;
}

// API Response interface
export interface UsersResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Mock database - semua data user
const MOCK_USERS_DB: User[] = [
    { id: 1, name: "SuperAdmin", username: "@admin", role: "Admin", status: "Active", pic: "Admin" },
    { id: 2, name: "Jane Smith", username: "@jane", role: "Intership", status: "Active", pic: "Michael Brown" },
    { id: 3, name: "Bob Johnson", username: "@bob", role: "Intership", status: "Inactive", pic: "Sarah Johnson" },
    { id: 4, name: "Alice Williams", username: "@alice", role: "Intership", status: "Active", pic: "John Davis" },
    { id: 5, name: "Charlie Brown", username: "@charlie", role: "Intership", status: "Active", pic: "Sarah Johnson" },
    { id: 6, name: "Diana Prince", username: "@diana", role: "PIC", status: "Active", pic: "Michael Brown" },
    { id: 7, name: "Eve Miller", username: "@eve", role: "PIC", status: "Active", pic: "John Davis" },
    { id: 8, name: "Frank Castle", username: "@frank", role: "Moderator", status: "Inactive", pic: "Sarah Johnson" },
    { id: 9, name: "Grace Lee", username: "@grace", role: "User", status: "Active", pic: "Michael Brown" },
    { id: 10, name: "Henry Ford", username: "@henry", role: "Manager", status: "Active", pic: "John Davis" },
    { id: 11, name: "Asep Surasep", username: "@asep", role: "Intership", status: "Active", pic: "Sarah Johnson" },
    { id: 12, name: "Udin Sedunia", username: "@udin", role: "Intership", status: "Active", pic: "Michael Brown" },
    { id: 13, name: "Budi Santoso", username: "@budi", role: "Intership", status: "Inactive", pic: "Sarah Johnson" },
    { id: 14, name: "Siti Nurhaliza", username: "@siti", role: "PIC", status: "Active", pic: "John Davis" },
    { id: 15, name: "Rudi Tabuti", username: "@rudi", role: "Intership", status: "Active", pic: "Sarah Johnson" },
    { id: 16, name: "Dewi Persik", username: "@dewi", role: "PIC", status: "Active", pic: "Michael Brown" },
    { id: 17, name: "Joko Widodo", username: "@jokowi", role: "Admin", status: "Active", pic: "John Davis" },
    { id: 18, name: "Mega Wati", username: "@mega", role: "Manager", status: "Inactive", pic: "Sarah Johnson" },
    { id: 19, name: "Prabowo Subianto", username: "@prabowo", role: "Manager", status: "Active", pic: "Michael Brown" },
    { id: 20, name: "Anies Baswedan", username: "@anies", role: "PIC", status: "Active", pic: "John Davis" },
];

/**
 * Fetch users with pagination (Mock API)
 * Simulates server delay and pagination logic
 * 
 * @param page - Current page (1-indexed)
 * @param limit - Number of items per page
 * @returns Promise with paginated users data
 */
export async function fetchUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    // Simulate network delay (300-600ms)
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice data based on pagination
    const paginatedData = MOCK_USERS_DB.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(MOCK_USERS_DB.length / limit);

    return {
        data: paginatedData,
        total: MOCK_USERS_DB.length,
        page,
        limit,
        totalPages,
    };
}

/**
 * Get total users count (Mock API)
 * Used for displaying total count without loading all data
 */
export async function getTotalUsersCount(): Promise<number> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_USERS_DB.length;
}
