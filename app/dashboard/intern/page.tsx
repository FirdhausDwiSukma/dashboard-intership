"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import {
    internDashboardService,
    InternDashboardStats,
    InternFeedback,
} from "@/app/services/internDashboardService";
import {
    GraduationCap,
    Star,
    Clock,
    TrendingUp,
    AlertTriangle,
    Grid3X3,
    User,
    Calendar,
    MessageSquare,
    BarChart3,
} from "lucide-react";

export default function InternDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<InternDashboardStats | null>(null);
    const [feedback, setFeedback] = useState<InternFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authHelper.isAuthenticated()) {
            router.push("/login");
            return;
        }

        const role = localStorage.getItem("role");
        if (role !== "intern") {
            router.push("/dashboard");
            return;
        }

        loadData();
    }, [router]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [dashStats, feedbackList] = await Promise.all([
                internDashboardService.getDashboard(),
                internDashboardService.getFeedback(),
            ]);
            setStats(dashStats);
            setFeedback(feedbackList);
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
                    <p className="text-sm text-gray-500">Loading your dashboard...</p>
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

    const username = localStorage.getItem("username") || "Intern";
    const progressPercent = Math.round((stats?.duration_progress || 0) * 100);

    const gridPositionLabel = (pos: string) => {
        if (pos === "not-evaluated") return "Not Evaluated";
        return pos
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" / ");
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome, {username}!
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Track your internship progress and performance
                </p>
            </div>

            {/* Internship Progress Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Internship Progress</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Mentor</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-primary-500" />
                            {stats?.mentor_name || "Not assigned"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Division</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {stats?.division || "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Days Remaining</p>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            {stats?.days_remaining || 0} of {stats?.total_days || 0} days
                        </p>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-emerald-200 dark:border-emerald-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Performance Score</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats?.performance_score?.toFixed(1) || "-"}
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
                            <p className="text-sm font-medium text-gray-500">Potential Score</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats?.potential_score?.toFixed(1) || "-"}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600">
                            <Star className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">9 Grid Position</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                                {gridPositionLabel(stats?.grid_position || "not-evaluated")}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                            <Grid3X3 className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Feedback */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mentor Feedback</h2>
                </div>

                {feedback.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p>No feedback received yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {feedback.map((fb) => (
                            <div
                                key={fb.id}
                                className="p-4 rounded-lg border border-gray-100 dark:border-gray-800"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Period: {fb.period}
                                    </span>
                                    <span className="flex items-center gap-1 text-sm">
                                        <Star className="w-4 h-4 text-amber-400" />
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {fb.overall_score.toFixed(1)}
                                        </span>
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-xs text-gray-500">Learning</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{fb.learning_ability}</p>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-xs text-gray-500">Initiative</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{fb.initiative}</p>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-xs text-gray-500">Communication</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{fb.communication}</p>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-xs text-gray-500">Problem Solving</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{fb.problem_solving}</p>
                                    </div>
                                </div>
                                {fb.notes && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                        &quot;{fb.notes}&quot;
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
