import apiClient from '../lib/axios';
import { authHelper } from '../utils/authHelper';

export interface InternDashboardStats {
    current_period: {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
        is_locked: boolean;
    } | null;
    performance_score: number;
    potential_score: number;
    grid_position: string;
    mentor_name: string;
    duration_progress: number;
    days_remaining: number;
    total_days: number;
    division: string;
    university: string;
}

export interface InternFeedback {
    id: number;
    period: string;
    learning_ability: number;
    initiative: number;
    communication: number;
    problem_solving: number;
    notes: string;
    overall_score: number;
    created_at: string;
}

const getHeaders = () => ({
    Authorization: `Bearer ${authHelper.getToken()}`,
});

export const internDashboardService = {
    getDashboard: async (): Promise<InternDashboardStats> => {
        const response = await apiClient.get<InternDashboardStats>('/api/intern/dashboard', {
            headers: getHeaders(),
        });
        return response.data;
    },

    getEvaluation: async () => {
        const response = await apiClient.get('/api/intern/evaluation', {
            headers: getHeaders(),
        });
        return response.data;
    },

    getFeedback: async (): Promise<InternFeedback[]> => {
        const response = await apiClient.get<{ data: InternFeedback[] }>('/api/intern/feedback', {
            headers: getHeaders(),
        });
        return response.data.data || [];
    },
};
