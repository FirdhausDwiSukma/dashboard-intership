import apiClient from '../lib/axios';
import { authHelper } from '../utils/authHelper';

export interface MentorDashboardStats {
    total_assigned: number;
    not_yet_evaluated: number;
    eval_deadline: string | null;
    avg_performance: number;
    grid_distribution: Record<string, number>;
}

export interface MentorIntern {
    intern_profile_id: number;
    user_id: number;
    full_name: string;
    email: string;
    division: string;
    university: string;
    major: string;
    batch: string;
    start_date: string;
    end_date: string;
    has_review: boolean;
    performance_avg: number;
    potential_avg: number;
    grid_position: string;
}

export interface MentorReview {
    id: number;
    intern_id: number;
    pic_id: number;
    learning_ability: number;
    initiative: number;
    communication: number;
    problem_solving: number;
    notes: string;
    period: string;
    created_at: string;
    intern?: {
        full_name: string;
    };
}

export interface SubmitReviewData {
    intern_id: number;
    learning_ability: number;
    initiative: number;
    communication: number;
    problem_solving: number;
    notes: string;
    period: string;
}

export interface UpdateReviewData {
    learning_ability: number;
    initiative: number;
    communication: number;
    problem_solving: number;
    notes: string;
}

const getHeaders = () => ({
    Authorization: `Bearer ${authHelper.getToken()}`,
});

export const mentorService = {
    getDashboard: async (): Promise<MentorDashboardStats> => {
        const response = await apiClient.get<MentorDashboardStats>('/api/mentor/dashboard', {
            headers: getHeaders(),
        });
        return response.data;
    },

    getAssignedInterns: async (): Promise<MentorIntern[]> => {
        const response = await apiClient.get<{ data: MentorIntern[] }>('/api/mentor/interns', {
            headers: getHeaders(),
        });
        return response.data.data || [];
    },

    getInternDetail: async (id: number): Promise<MentorIntern> => {
        const response = await apiClient.get<MentorIntern>(`/api/mentor/interns/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },

    submitReview: async (data: SubmitReviewData): Promise<MentorReview> => {
        const response = await apiClient.post('/api/mentor/reviews', data, {
            headers: getHeaders(),
        });
        return response.data.review;
    },

    updateReview: async (id: number, data: UpdateReviewData): Promise<MentorReview> => {
        const response = await apiClient.put(`/api/mentor/reviews/${id}`, data, {
            headers: getHeaders(),
        });
        return response.data.review;
    },

    getReviewHistory: async (page: number = 1, limit: number = 10) => {
        const response = await apiClient.get('/api/mentor/reviews', {
            params: { page, limit },
            headers: getHeaders(),
        });
        return response.data;
    },

    getNineGrid: async () => {
        const response = await apiClient.get('/api/mentor/nine-grid', {
            headers: getHeaders(),
        });
        return response.data.data || [];
    },
};
