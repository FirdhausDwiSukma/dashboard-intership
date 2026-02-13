"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import { adminService, AdminDashboardStats } from "@/app/services/adminService";
import {
    Users,
    GraduationCap,
    Briefcase,
    FileText,
    Activity,
    Shield,
    BarChart3,
    Clock,
    AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
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

        loadDashboard();
    }, [router]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await adminService.getDashboard();
            setStats(data);
        } catch (err: any) {
            setError(err.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <p className="text-red-500">{error}</p>
                <button
                    onClick={loadDashboard}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Users",
            value: stats?.total_users || 0,
            icon: Users,
            color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
            borderColor: "border-blue-200 dark:border-blue-800",
        },
        {
            label: "Total Interns",
            value: stats?.total_interns || 0,
            icon: GraduationCap,
            color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
            borderColor: "border-emerald-200 dark:border-emerald-800",
        },
        {
            label: "Total PICs",
            value: stats?.total_pics || 0,
            icon: Briefcase,
            color: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
            borderColor: "border-violet-200 dark:border-violet-800",
        },
        {
            label: "Total Evaluations",
            value: stats?.total_evaluations || 0,
            icon: FileText,
            color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
            borderColor: "border-amber-200 dark:border-amber-800",
        },
        {
            label: "Audit Logs (30d)",
            value: stats?.audit_log_count || 0,
            icon: Activity,
            color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
            borderColor: "border-rose-200 dark:border-rose-800",
        },
        {
            label: "System Health",
            value: stats?.system_health || "N/A",
            icon: Shield,
            color: stats?.system_health === "healthy"
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
            borderColor: stats?.system_health === "healthy"
                ? "border-green-200 dark:border-green-800"
                : "border-red-200 dark:border-red-800",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Super Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    System overview and management console
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className={`bg-white dark:bg-gray-900 rounded-xl border ${card.borderColor} p-6 hover:shadow-lg transition-shadow duration-200`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {card.label}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 capitalize">
                                    {card.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${card.color}`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Period Card */}
            {stats?.active_period && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Period</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                            <p className="font-medium text-gray-900 dark:text-white">{stats.active_period.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Period</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {new Date(stats.active_period.start_date).toLocaleDateString()} –{" "}
                                {new Date(stats.active_period.end_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stats.active_period.is_locked
                                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                    : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                }`}>
                                {stats.active_period.is_locked ? "Locked" : "Open"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => router.push("/dashboard/users")}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Users className="w-6 h-6 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Users</span>
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/admin/audit-logs")}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <FileText className="w-6 h-6 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Audit Logs</span>
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/hr/lock-period")}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <BarChart3 className="w-6 h-6 text-violet-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period Mgmt</span>
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/hr/nine-grid")}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Activity className="w-6 h-6 text-emerald-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">9 Grid View</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
