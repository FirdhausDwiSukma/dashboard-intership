"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import { mentorService, MentorDashboardStats, MentorIntern } from "@/app/services/mentorService";
import {
    GraduationCap,
    ClipboardList,
    Clock,
    TrendingUp,
    AlertTriangle,
    Star,
    CheckCircle,
    XCircle,
    ArrowRight,
} from "lucide-react";

export default function MentorDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<MentorDashboardStats | null>(null);
    const [interns, setInterns] = useState<MentorIntern[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authHelper.isAuthenticated()) {
            router.push("/login");
            return;
        }

        const role = localStorage.getItem("role");
        if (role !== "pic") {
            router.push("/dashboard");
            return;
        }

        loadData();
    }, [router]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [dashStats, internList] = await Promise.all([
                mentorService.getDashboard(),
                mentorService.getAssignedInterns(),
            ]);
            setStats(dashStats);
            setInterns(internList);
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
                    <p className="text-sm text-gray-500">Loading mentor dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <p className="text-red-500">{error}</p>
                <button onClick={loadData} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Retry
                </button>
            </div>
        );
    }

    const username = localStorage.getItem("username") || "Mentor";

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {username}!
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Here's the overview of your assigned interns
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Interns</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats?.total_assigned || 0}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-amber-200 dark:border-amber-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Need Evaluation</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats?.not_yet_evaluated || 0}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-emerald-200 dark:border-emerald-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Avg Performance</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {(stats?.avg_performance || 0).toFixed(1)}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-violet-200 dark:border-violet-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Deadline</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                                {stats?.eval_deadline
                                    ? new Date(stats.eval_deadline).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Intern List */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Interns</h2>
                    <button
                        onClick={() => router.push("/dashboard/mentor/interns")}
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                        View all <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {interns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p>No interns assigned yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {interns.slice(0, 5).map((intern) => (
                            <div
                                key={intern.intern_profile_id}
                                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                onClick={() => router.push(`/dashboard/mentor/interns/${intern.intern_profile_id}`)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold">
                                        {intern.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {intern.full_name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {intern.division} • {intern.university}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {intern.has_review ? (
                                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                            <CheckCircle className="w-4 h-4" /> Evaluated
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                            <XCircle className="w-4 h-4" /> Pending
                                        </span>
                                    )}
                                    {intern.has_review && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Star className="w-3.5 h-3.5 text-amber-400" />
                                            {intern.performance_avg.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
