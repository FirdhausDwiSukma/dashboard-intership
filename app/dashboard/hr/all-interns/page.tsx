"use client";

import { useEffect, useState } from "react";
import {
    fetchAllInternsWithGrid,
    fetchPeriods,
    type GridIntern,
    type Period,
} from "@/app/services/hrService";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";

export default function HRAllInternsPage() {
    const [interns, setInterns] = useState<GridIntern[]>([]);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedGrid, setSelectedGrid] = useState("");
    const limit = 10;

    useEffect(() => {
        loadPeriods();
    }, []);

    useEffect(() => {
        loadInterns();
    }, [page, selectedPeriod, selectedGrid]);

    const loadPeriods = async () => {
        try {
            const data = await fetchPeriods();
            setPeriods(data);
        } catch {
            /* ignore */
        }
    };

    const loadInterns = async () => {
        try {
            setLoading(true);
            const res = await fetchAllInternsWithGrid(page, limit, selectedPeriod, selectedGrid, search);
            setInterns(res.data || []);
            setTotal(res.total);
            setTotalPages(res.total_pages);
        } catch {
            setInterns([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadInterns();
    };

    const getGridBadgeColor = (position: string) => {
        if (position.includes("high-high")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
        if (position.includes("low-low")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
        if (position.includes("high") || position.includes("medium-medium")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Interns</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    View all interns with their 9 Grid evaluation data
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or department..."
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                    </form>

                    <div className="flex gap-2">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={selectedPeriod}
                                onChange={(e) => { setSelectedPeriod(e.target.value); setPage(1); }}
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none min-w-[140px]"
                            >
                                <option value="">All Periods</option>
                                {periods.map((p) => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={selectedGrid}
                            onChange={(e) => { setSelectedGrid(e.target.value); setPage(1); }}
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 min-w-[140px]"
                        >
                            <option value="">All Grid Pos</option>
                            <option value="high-high">High-High (Star)</option>
                            <option value="high-medium">High-Medium</option>
                            <option value="high-low">High-Low</option>
                            <option value="medium-high">Medium-High</option>
                            <option value="medium-medium">Medium-Medium</option>
                            <option value="medium-low">Medium-Low</option>
                            <option value="low-high">Low-High</option>
                            <option value="low-medium">Low-Medium</option>
                            <option value="low-low">Low-Low (Risk)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Department</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">PIC</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Performance</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Potential</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Grid Position</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : interns.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-400">
                                        No intern data found
                                    </td>
                                </tr>
                            ) : (
                                interns.map((intern) => (
                                    <tr key={intern.intern_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{intern.full_name}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intern.department || "—"}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intern.pic_name}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-mono text-gray-900 dark:text-white">{intern.performance_score.toFixed(1)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-mono text-gray-900 dark:text-white">{intern.potential_score.toFixed(1)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGridBadgeColor(intern.grid_position)}`}>
                                                {intern.grid_position === "N/A" ? "Not Evaluated" : intern.grid_position}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page <= 1}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-700 dark:text-gray-300 px-2">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page >= totalPages}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
