import apiClient from '../lib/axios';
import { authHelper } from '../utils/authHelper';

export interface AdminDashboardStats {
    total_users: number;
    total_interns: number;
    total_pics: number;
    active_period: {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
        is_locked: boolean;
    } | null;
    total_evaluations: number;
    audit_log_count: number;
    system_health: string;
}

export interface AuditLogEntry {
    id: number;
    user_id: number;
    username: string;
    full_name: string;
    action: string;
    entity_type: string;
    entity_id: number | null;
    created_at: string;
}

export interface AuditLogResponse {
    data: AuditLogEntry[];
    total: number;
    page: number;
    totalPages: number;
}

export const adminService = {
    getDashboard: async (): Promise<AdminDashboardStats> => {
        const token = authHelper.getToken();
        const response = await apiClient.get<AdminDashboardStats>('/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getAuditLogs: async (page: number = 1, limit: number = 20): Promise<AuditLogResponse> => {
        const token = authHelper.getToken();
        const response = await apiClient.get<AuditLogResponse>('/api/admin/audit-logs', {
            params: { page, limit },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};
