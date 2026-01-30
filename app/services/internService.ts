/**
 * Mock API Service for Interns
 * This will be replaced with real API calls later
 */

// Intern interface
export interface Intern {
    id: number;
    user_id: number;
    full_name: string;
    username: string;
    email: string;
    avatar_url?: string;
    pic_id: number;
    pic_name: string;
    batch: string;
    division: string;
    university: string;
    major: string;
    start_date: string;
    end_date: string;
    status: "active" | "inactive";
    // Performance metrics (will come from backend calculations)
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
    totalPages: number;
}

// Mock database
const MOCK_INTERNS_DB: Intern[] = [
    {
        id: 1,
        user_id: 4,
        full_name: "Bob Johnson",
        username: "intern_bob",
        email: "bob@example.com",
        pic_id: 2,
        pic_name: "John Smith",
        batch: "2024-Q1",
        division: "Engineering",
        university: "Universitas Indonesia",
        major: "Computer Science",
        start_date: "2024-01-15",
        end_date: "2024-07-15",
        status: "active",
        task_completion_rate: 85,
        attendance_rate: 92,
        performance_level: "high",
        potential_level: "high",
    },
    {
        id: 2,
        user_id: 5,
        full_name: "Charlie Brown",
        username: "intern_charlie",
        email: "charlie@example.com",
        pic_id: 2,
        pic_name: "John Smith",
        batch: "2024-Q1",
        division: "Marketing",
        university: "Institut Teknologi Bandung",
        major: "Business Administration",
        start_date: "2024-01-15",
        end_date: "2024-07-15",
        status: "active",
        task_completion_rate: 78,
        attendance_rate: 88,
        performance_level: "medium",
        potential_level: "high",
    },
    {
        id: 3,
        user_id: 6,
        full_name: "Diana Prince",
        username: "intern_diana",
        email: "diana@example.com",
        pic_id: 3,
        pic_name: "Alice Williams",
        batch: "2024-Q1",
        division: "Design",
        university: "Universitas Gadjah Mada",
        major: "Visual Communication Design",
        start_date: "2024-01-15",
        end_date: "2024-07-15",
        status: "active",
        task_completion_rate: 92,
        attendance_rate: 95,
        performance_level: "high",
        potential_level: "medium",
    },
    {
        id: 4,
        user_id: 7,
        full_name: "Eva Martinez",
        username: "intern_eva",
        email: "eva@example.com",
        pic_id: 3,
        pic_name: "Alice Williams",
        batch: "2023-Q4",
        division: "Engineering",
        university: "Universitas Brawijaya",
        major: "Information Systems",
        start_date: "2023-10-01",
        end_date: "2024-04-01",
        status: "inactive",
        task_completion_rate: 65,
        attendance_rate: 70,
        performance_level: "low",
        potential_level: "medium",
    },
    {
        id: 5,
        user_id: 8,
        full_name: "Frank Zhang",
        username: "intern_frank",
        email: "frank@example.com",
        pic_id: 2,
        pic_name: "John Smith",
        batch: "2024-Q1",
        division: "Data Analytics",
        university: "Universitas Airlangga",
        major: "Statistics",
        start_date: "2024-01-15",
        end_date: "2024-07-15",
        status: "active",
        task_completion_rate: 88,
        attendance_rate: 90,
        performance_level: "high",
        potential_level: "high",
    },
];

/**
 * Fetch interns with pagination
 */
export async function fetchInterns(page: number = 1, limit: number = 10): Promise<InternsResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = MOCK_INTERNS_DB.slice(startIndex, endIndex);
    const totalPages = Math.ceil(MOCK_INTERNS_DB.length / limit);

    return {
        data: paginatedData,
        total: MOCK_INTERNS_DB.length,
        page,
        totalPages,
    };
}

/**
 * Get intern by ID
 */
export async function getInternById(id: number): Promise<Intern | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_INTERNS_DB.find(intern => intern.id === id) || null;
}

/**
 * Get interns by PIC
 */
export async function getInternsByPIC(picId: number): Promise<Intern[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_INTERNS_DB.filter(intern => intern.pic_id === picId);
}

/**
 * Get interns by batch
 */
export async function getInternsByBatch(batch: string): Promise<Intern[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_INTERNS_DB.filter(intern => intern.batch === batch);
}

/**
 * Get total interns count
 */
export async function getTotalInternsCount(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_INTERNS_DB.length;
}

/**
 * Get active interns count
 */
export async function getActiveInternsCount(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_INTERNS_DB.filter(intern => intern.status === "active").length;
}
