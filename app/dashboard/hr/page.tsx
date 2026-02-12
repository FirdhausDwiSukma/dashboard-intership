"use client";

import { useEffect, useState } from "react";
import {
    fetchHRDashboard,
    type HRDashboardStats,
    type HRAlert,
} from "@/app/services/hrService";
import {
    Users,
    GraduationCap,
    Briefcase,
    AlertTriangle,
    TrendingDown,
    Calendar,
} from "lucide-react";

export default function HRDashboardPage() {
    const [stats, setStats] = useState<HRDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await fetchHRDashboard();
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case "not_evaluated":
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case "low_performance":
                return <TrendingDown className="w-5 h-5 text-red-500" />;
            default:
                return <AlertTriangle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getAlertBg = (type: string) => {
        switch (type) {
            case "not_evaluated":
                return "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800";
            case "low_performance":
                return "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800";
            default:
                return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
        }
    };

    // 9 Grid mini matrix positions
    const gridPositions = [
        { perf: "high", pot: "low", label: "High Perf\nLow Pot" },
        { perf: "high", pot: "medium", label: "High Perf\nMed Pot" },
        { perf: "high", pot: "high", label: "⭐ Star" },
        { perf: "medium", pot: "low", label: "Med Perf\nLow Pot" },
        { perf: "medium", pot: "medium", label: "Core\nPlayer" },
        { perf: "medium", pot: "high", label: "High\nPotential" },
        { perf: "low", pot: "low", label: "Risk" },
        { perf: "low", pot: "medium", label: "Low Perf\nMed Pot" },
        { perf: "low", pot: "high", label: "Low Perf\nHigh Pot" },
    ];

    const getGridColor = (perf: string, pot: string) => {
        if (perf === "high" && pot === "high") return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
        if (perf === "high" || pot === "high") return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300";
        if (perf === "medium" && pot === "medium") return "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300";
        if (perf === "low" && pot === "low") return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
        return "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-2">{error}</p>
                    <button onClick={loadStats} className="text-primary-500 hover:underline text-sm">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HR Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Internship Monitoring Overview — 9 Grid Box
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Interns</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats?.total_intern_active || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total PIC</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats?.total_pic || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Period</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {stats?.active_period?.name || "—"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts - Moved above 9 Grid Box as requested */}
            {stats?.alerts && stats.alerts.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification</h2>
                    {stats.alerts.map((alert: HRAlert, index: number) => (
                        <div
                            key={index}
                            className={`${getAlertBg(alert.type)} rounded-xl border p-4 flex items-center gap-3`}
                        >
                            <span className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                {getAlertIcon(alert.type)}
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                            </div>
                            <span className="text-xs font-bold text-white bg-red-500 rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                {alert.count}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* 9 Grid Mini Matrix */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">9 Grid Box Overview</h2>
                </div>

                <div className="flex">
                    {/* Y-axis label */}
                    <div className="flex flex-col justify-between items-center mr-2 py-1">
                        <span className="text-xs text-gray-400 writing-vertical">High</span>
                        <span className="text-xs font-medium text-gray-500 -rotate-90 whitespace-nowrap">Performance ↑</span>
                        <span className="text-xs text-gray-400 writing-vertical">Low</span>
                    </div>

                    <div className="flex-1">
                        <div className="grid grid-cols-3 gap-2">
                            {gridPositions.map((pos) => {
                                const key = `${pos.perf}-${pos.pot}`;
                                const count = stats?.grid_distribution?.[key] || 0;
                                return (
                                    <div
                                        key={key}
                                        className={`${getGridColor(pos.perf, pos.pot)} rounded-lg p-3 text-center min-h-[80px] flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer border border-transparent hover:border-gray-300 dark:hover:border-gray-600`}
                                    >
                                        <span className="text-2xl font-bold">{count}</span>
                                        <span className="text-xs mt-1 whitespace-pre-line leading-tight opacity-80">
                                            {pos.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* X-axis label */}
                        <div className="flex justify-between mt-2 px-1">
                            <span className="text-xs text-gray-400">Low</span>
                            <span className="text-xs font-medium text-gray-500">Potential →</span>
                            <span className="text-xs text-gray-400">High</span>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
