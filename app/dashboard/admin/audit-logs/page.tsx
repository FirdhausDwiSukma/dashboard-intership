"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import { adminService, AuditLogEntry, AuditLogResponse } from "@/app/services/adminService";
import {
    FileText,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    Search,
    ArrowLeft,
} from "lucide-react";

export default function AuditLogsPage() {
    const router = useRouter();
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const limit = 20;

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
        loadLogs();
    }, [router, page]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data: AuditLogResponse = await adminService.getAuditLogs(page, limit);
            setLogs(data.data || []);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.message || "Failed to load audit logs");
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = searchTerm
        ? logs.filter(
            (log) =>
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : logs;

    const actionColor = (action: string) => {
        if (action.includes("delete") || action.includes("hard_delete")) return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
        if (action.includes("create") || action.includes("register")) return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
        if (action.includes("update") || action.includes("edit")) return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
        if (action.includes("login")) return "text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400";
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/dashboard/admin")}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {total} total entries
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by user, action, entity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-6 h-6 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-3">
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">User</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Action</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Entity Type</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Entity ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No audit logs found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                                {log.created_at}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {log.full_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">@{log.username}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${actionColor(log.action)}`}
                                                >
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300 capitalize">
                                                {log.entity_type}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {log.entity_id || "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-500">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
