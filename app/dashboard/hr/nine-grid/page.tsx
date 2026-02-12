"use client";

import { useEffect, useState } from "react";
import {
    fetchNineGrid,
    fetchGridInterns,
    fetchPeriods,
    type GridCell,
    type GridIntern,
    type Period,
} from "@/app/services/hrService";
import { Grid3X3, X, Filter } from "lucide-react";

export default function HRNineGridPage() {
    const [grid, setGrid] = useState<GridCell[]>([]);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState("");
    const [modalInterns, setModalInterns] = useState<GridIntern[]>([]);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        loadPeriods();
    }, []);

    useEffect(() => {
        loadGrid();
    }, [selectedPeriod]);

    const loadPeriods = async () => {
        try {
            const data = await fetchPeriods();
            setPeriods(data);
        } catch { /* ignore */ }
    };

    const loadGrid = async () => {
        try {
            setLoading(true);
            const data = await fetchNineGrid(selectedPeriod);
            setGrid(data);
        } catch {
            setGrid([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCellClick = async (position: string) => {
        setModalPosition(position);
        setModalOpen(true);
        setModalLoading(true);
        try {
            const data = await fetchGridInterns(position, selectedPeriod);
            setModalInterns(data);
        } catch {
            setModalInterns([]);
        } finally {
            setModalLoading(false);
        }
    };

    const getCount = (position: string) => {
        const cell = grid.find((c) => c.position === position);
        return cell?.count || 0;
    };

    const getCellColor = (perf: string, pot: string) => {
        if (perf === "high" && pot === "high")
            return "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-200 dark:shadow-emerald-900/30";
        if (perf === "high" && pot === "medium")
            return "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-blue-200 dark:shadow-blue-900/30";
        if (perf === "high" && pot === "low")
            return "bg-gradient-to-br from-cyan-400 to-cyan-500 text-white shadow-cyan-200 dark:shadow-cyan-900/30";
        if (perf === "medium" && pot === "high")
            return "bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-purple-200 dark:shadow-purple-900/30";
        if (perf === "medium" && pot === "medium")
            return "bg-gradient-to-br from-indigo-300 to-indigo-400 text-white shadow-indigo-200 dark:shadow-indigo-900/30";
        if (perf === "medium" && pot === "low")
            return "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-slate-200 dark:shadow-slate-900/30";
        if (perf === "low" && pot === "high")
            return "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-200 dark:shadow-amber-900/30";
        if (perf === "low" && pot === "medium")
            return "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-orange-200 dark:shadow-orange-900/30";
        return "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-red-200 dark:shadow-red-900/30";
    };

    const getCellLabel = (perf: string, pot: string) => {
        const labels: Record<string, string> = {
            "high-high": "⭐ Star",
            "high-medium": "High Performer",
            "high-low": "Consistent",
            "medium-high": "High Potential",
            "medium-medium": "Core Player",
            "medium-low": "Effective",
            "low-high": "Enigma",
            "low-medium": "Dilemma",
            "low-low": "Risk",
        };
        return labels[`${perf}-${pot}`] || "";
    };

    // Grid layout: rows are performance (high→low), cols are potential (low→high)
    const rows = [
        { perf: "high", label: "High" },
        { perf: "medium", label: "Medium" },
        { perf: "low", label: "Low" },
    ];
    const cols = [
        { pot: "low", label: "Low" },
        { pot: "medium", label: "Medium" },
        { pot: "high", label: "High" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">9 Grid Overview</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Interactive 9 Grid Box — click a cell to view intern details
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 min-w-[140px]"
                    >
                        <option value="">All Periods</option>
                        {periods.map((p) => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Grid3X3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance × Potential Matrix</h2>
                    </div>

                    <div className="flex">
                        {/* Y-axis */}
                        <div className="flex flex-col items-center justify-between mr-4 py-2">
                            <span className="text-xs font-medium text-gray-400">High</span>
                            <span className="text-xs font-bold text-gray-500 -rotate-90 whitespace-nowrap my-4">Performance ↑</span>
                            <span className="text-xs font-medium text-gray-400">Low</span>
                        </div>

                        {/* Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-3 gap-3">
                                {rows.map((row) =>
                                    cols.map((col) => {
                                        const position = `${row.perf}-${col.pot}`;
                                        const count = getCount(position);
                                        return (
                                            <button
                                                key={position}
                                                onClick={() => handleCellClick(position)}
                                                className={`${getCellColor(row.perf, col.pot)} rounded-xl p-4 min-h-[110px] flex flex-col items-center justify-center shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer`}
                                            >
                                                <span className="text-3xl font-bold">{count}</span>
                                                <span className="text-xs mt-1.5 font-medium opacity-90">
                                                    {getCellLabel(row.perf, col.pot)}
                                                </span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            {/* X-axis */}
                            <div className="flex justify-between mt-3 px-2">
                                <span className="text-xs font-medium text-gray-400">Low</span>
                                <span className="text-xs font-bold text-gray-500">Potential →</span>
                                <span className="text-xs font-medium text-gray-400">High</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Interns — <span className="text-primary-600">{modalPosition}</span>
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-6">
                            {modalLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                                </div>
                            ) : modalInterns.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">No interns in this cell</p>
                            ) : (
                                <div className="space-y-3">
                                    {modalInterns.map((intern) => (
                                        <div
                                            key={intern.intern_id}
                                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{intern.full_name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {intern.department} · PIC: {intern.pic_name}
                                                </p>
                                            </div>
                                            <div className="text-right text-xs space-y-0.5">
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Perf: <span className="font-mono font-medium">{intern.performance_score.toFixed(1)}</span>
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Pot: <span className="font-mono font-medium">{intern.potential_score.toFixed(1)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
