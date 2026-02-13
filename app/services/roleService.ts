import apiClient from '../lib/axios';
import { authHelper } from '../utils/authHelper';

export interface RoleWithUserCount {
    id: number;
    name: string;
    description: string;
    user_count: number;
    is_default: boolean;
}

export interface Permission {
    id: number;
    name: string;
    module: string;
}

export interface PermissionGroup {
    module: string;
    permissions: Permission[];
}

export interface RolePermissionView {
    role_id: number;
    role_name: string;
    is_default: boolean;
    groups: PermissionGroup[];
    assigned_ids: number[];
}

const getHeaders = () => ({
    Authorization: `Bearer ${authHelper.getToken()}`,
});

export const roleService = {
    /** List all roles with user counts */
    getRoles: async (): Promise<RoleWithUserCount[]> => {
        const response = await apiClient.get('/api/admin/roles', { headers: getHeaders() });
        return response.data.data || [];
    },

    /** Get a role's permissions (grouped by module) with assignment info */
    getRolePermissions: async (roleId: number): Promise<RolePermissionView> => {
        const response = await apiClient.get(`/api/admin/roles/${roleId}/permissions`, { headers: getHeaders() });
        return response.data;
    },

    /** Sync a role's permissions (replace all) */
    updateRolePermissions: async (roleId: number, permissionIds: number[]): Promise<void> => {
        await apiClient.put(
            `/api/admin/roles/${roleId}/permissions`,
            { permission_ids: permissionIds },
            { headers: getHeaders() },
        );
    },

    /** List all available permissions grouped by module */
    getAllPermissions: async (): Promise<PermissionGroup[]> => {
        const response = await apiClient.get('/api/admin/permissions', { headers: getHeaders() });
        return response.data.data || [];
    },
};
