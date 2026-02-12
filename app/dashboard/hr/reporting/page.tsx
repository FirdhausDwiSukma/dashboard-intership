"use client";

import { useEffect, useState } from "react";
import {
    fetchReport,
    fetchPeriods,
    type ReportSummary,
    type Period,
} from "@/app/services/hrService";
import { BarChart3, Filter } from "lucide-react";

export default function HRReportingPage() {
    const [report, setReport] = useState<ReportSummary | null>(null);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPeriods();
    }, []);

    useEffect(() => {
        loadReport();
    }, [selectedPeriod, selectedDepartment]);

    const loadPeriods = async () => {
        try {
            const data = await fetchPeriods();
            setPeriods(data);
        } catch { /* ignore */ }
    };

    const loadReport = async () => {
        try {
            setLoading(true);
            const data = await fetchReport(selectedPeriod, selectedDepartment);
            setReport(data);
        } catch {
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    const maxDeptCount = Math.max(...(report?.interns_by_department?.map((d) => d.count) || [1]));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reporting</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Summary reports and analytics for internship monitoring
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 min-w-[120px]"
                    >
                        <option value="">All Periods</option>
                        {periods.map((p) => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Interns by Department */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Interns by Department</h2>
                        </div>

                        {report?.interns_by_department?.length === 0 ? (
                            <p className="text-sm text-gray-400 py-6 text-center">No department data available</p>
                        ) : (
                            <div className="space-y-3">
                                {report?.interns_by_department?.map((dept) => (
                                    <div key={dept.department}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.department}</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{dept.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                                            <div
                                                className="bg-gradient-to-r from-primary-500 to-primary-400 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${(dept.count / maxDeptCount) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Avg Performance by Period */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Average Scores by Period</h2>

                        {report?.avg_performance_by_period?.length === 0 ? (
                            <p className="text-sm text-gray-400 py-6 text-center">No period data available</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">Period</th>
                                            <th className="text-center py-2 font-medium text-gray-500 dark:text-gray-400">Avg Performance</th>
                                            <th className="text-center py-2 font-medium text-gray-500 dark:text-gray-400">Avg Potential</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {report?.avg_performance_by_period?.map((p) => (
                                            <tr key={p.period} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="py-2 font-medium text-gray-900 dark:text-white">{p.period}</td>
                                                <td className="py-2 text-center font-mono text-gray-700 dark:text-gray-300">{p.avg_performance.toFixed(1)}</td>
                                                <td className="py-2 text-center font-mono text-gray-700 dark:text-gray-300">{p.avg_potential.toFixed(1)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Grid Distribution */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grid Distribution Summary</h2>
                        {report?.grid_distribution_list?.length === 0 ? (
                            <p className="text-sm text-gray-400 py-6 text-center">No grid data available</p>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {report?.grid_distribution_list?.map((cell) => (
                                    <div
                                        key={cell.position}
                                        className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 flex items-center gap-3 min-w-[180px]"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{cell.count}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                {cell.position.replace("-", " / ")}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                P: {cell.performance_level} · Pt: {cell.potential_level}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
