"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import { mentorService } from "@/app/services/mentorService";
import {
    ArrowLeft,
    AlertTriangle,
    Grid3X3,
    Users,
} from "lucide-react";

interface GridCell {
    performance_level: string;
    potential_level: string;
    position: string;
    count: number;
    interns?: { intern_id: number; full_name: string }[];
}

const gridLabels: Record<string, { label: string; color: string; bg: string }> = {
    "high-high": { label: "⭐ Star", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700" },
    "high-medium": { label: "High Performer", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700" },
    "high-low": { label: "Solid Pro", color: "text-sky-700 dark:text-sky-300", bg: "bg-sky-50 dark:bg-sky-900/20 border-sky-300 dark:border-sky-700" },
    "medium-high": { label: "Future Star", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700" },
    "medium-medium": { label: "Core Player", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700" },
    "medium-low": { label: "Inconsistent", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700" },
    "low-high": { label: "Enigma", color: "text-pink-700 dark:text-pink-300", bg: "bg-pink-50 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700" },
    "low-medium": { label: "Dilemma", color: "text-red-700 dark:text-red-300", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
    "low-low": { label: "⚠ At Risk", color: "text-red-800 dark:text-red-200", bg: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700" },
};

const gridOrder = [
    ["low-high", "medium-high", "high-high"],
    ["low-medium", "medium-medium", "high-medium"],
    ["low-low", "medium-low", "high-low"],
];

export default function MentorNineGridPage() {
    const router = useRouter();
    const [gridData, setGridData] = useState<GridCell[]>([]);
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
        loadGrid();
    }, [router]);

    const loadGrid = async () => {
        try {
            setLoading(true);
            const data = await mentorService.getNineGrid();
            setGridData(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || "Failed to load 9-Grid data");
        } finally {
            setLoading(false);
        }
    };

    const getCellData = (position: string) => {
        return gridData.find((c) => c.position === position) || { position, count: 0, performance_level: "", potential_level: "" };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading 9-Grid...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <p className="text-red-500">{error}</p>
                <button onClick={loadGrid} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => router.push("/dashboard/mentor")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">9-Grid Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Your intern performance & potential matrix</p>
                </div>
            </div>

            {/* Grid */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                {/* Y-axis label */}
                <div className="flex">
                    <div className="w-10 flex flex-col items-center justify-center mr-2">
                        <span className="text-xs font-semibold text-gray-500 [writing-mode:vertical-lr] rotate-180 tracking-wider">POTENTIAL →</span>
                    </div>
                    <div className="flex-1">
                        <div className="grid grid-cols-3 gap-3">
                            {gridOrder.map((row, rowIndex) =>
                                row.map((position) => {
                                    const cell = getCellData(position);
                                    const meta = gridLabels[position] || { label: position, color: "text-gray-600", bg: "bg-gray-50 border-gray-200" };
                                    return (
                                        <div
                                            key={position}
                                            className={`${meta.bg} border-2 rounded-xl p-4 min-h-[120px] flex flex-col items-center justify-center gap-2 transition-all hover:shadow-md`}
                                        >
                                            <p className={`text-xs font-bold ${meta.color} text-center`}>{meta.label}</p>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4 text-gray-500" />
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{cell.count}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">intern(s)</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        {/* X-axis label */}
                        <div className="mt-3 text-center">
                            <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">PERFORMANCE →</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4" /> Grid Reference
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(gridLabels).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                            <div className={`w-3 h-3 rounded-sm ${val.bg} border`} />
                            <span className="font-medium text-gray-700 dark:text-gray-300">{val.label}</span>
                            <span className="text-gray-400">— {key}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
