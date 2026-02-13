"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import { roleService, RoleWithUserCount } from "@/app/services/roleService";
import {
    Shield,
    Users,
    Settings,
    AlertTriangle,
    ArrowLeft,
    ChevronRight,
    Lock,
} from "lucide-react";

export default function RoleManagementPage() {
    const router = useRouter();
    const [roles, setRoles] = useState<RoleWithUserCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authHelper.isAuthenticated()) {
            router.push("/login");
            return;
        }
        const role = localStorage.getItem("role");
        if (role !== "super_admin") {
            router.push("/dashboard");
            return;
        }
        loadRoles();
    }, [router]);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const data = await roleService.getRoles();
            setRoles(data);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || "Failed to load roles");
        } finally {
            setLoading(false);
        }
    };

    const roleBadgeColor = (name: string) => {
        switch (name) {
            case "super_admin":
                return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
            case "hr":
                return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case "pic":
                return "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800";
            case "intern":
                return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
            default:
                return "bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.push("/dashboard/admin")}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage roles and permissions for RBAC
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-6 h-6 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-3">
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                        <p className="text-sm text-red-500">{error}</p>
                        <button onClick={loadRoles} className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-6 py-4 text-left font-medium text-gray-500">Role</th>
                                    <th className="px-6 py-4 text-left font-medium text-gray-500">Description</th>
                                    <th className="px-6 py-4 text-center font-medium text-gray-500">Total Users</th>
                                    <th className="px-6 py-4 text-center font-medium text-gray-500">Type</th>
                                    <th className="px-6 py-4 text-right font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${roleBadgeColor(role.name)}`}>
                                                    <Shield className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white capitalize">
                                                    {role.name.replace("_", " ")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {role.description || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
                                                <Users className="w-3.5 h-3.5" />
                                                {role.user_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {role.is_default ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                                    <Lock className="w-3.5 h-3.5" /> Protected
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500">Custom</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {role.name === "super_admin" ? (
                                                <span className="text-xs text-gray-400 italic">Immutable</span>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        router.push(`/dashboard/admin/roles/${role.id}/permissions`)
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Edit Permissions
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Info Banner */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-300">
                    <p className="font-medium mb-1">Security Notice</p>
                    <ul className="list-disc list-inside space-y-0.5 text-amber-700 dark:text-amber-400">
                        <li>Default roles (super_admin, hr, pic, intern) cannot be deleted</li>
                        <li>Super Admin permissions cannot be modified</li>
                        <li>You cannot grant permissions you don&apos;t have yourself</li>
                        <li>All changes are recorded in audit logs</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
