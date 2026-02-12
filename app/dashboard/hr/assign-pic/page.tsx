"use client";

import { useEffect, useState } from "react";
import { assignPIC } from "@/app/services/hrService";
import { fetchPICs, type PICOption } from "@/app/services/internService";
import { fetchWithAuth } from "@/app/utils/authHelper";
import { Users, Check, AlertCircle } from "lucide-react";

interface UnassignedIntern {
    id: number;
    user_id: number;
    user: { id: number; full_name: string; email: string };
    pic_id: number | null;
    batch: string;
    division: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function HRAssignPICPage() {
    const [interns, setInterns] = useState<UnassignedIntern[]>([]);
    const [pics, setPics] = useState<PICOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Record<number, number>>({});
    const [saving, setSaving] = useState<number | null>(null);
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [picsData] = await Promise.all([fetchPICs()]);
            setPics(picsData);

            // Fetch only unassigned interns (pic_id IS NULL)
            const res = await fetchWithAuth(`${API_BASE_URL}/api/hr/unassigned-interns`);
            if (res.ok) {
                const json = await res.json();
                setInterns(json.data || []);
            }
        } catch {
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (internProfileId: number) => {
        const picId = assignments[internProfileId];
        if (!picId) {
            setError("Please select a PIC first");
            return;
        }

        setSaving(internProfileId);
        setError("");
        setSuccess("");

        try {
            await assignPIC(internProfileId, picId);
            setSuccess(`PIC assigned successfully!`);
            // Remove from list immediately
            setInterns((prev) => prev.filter((i) => i.id !== internProfileId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to assign PIC");
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assign PIC</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Assign a Person in Charge (Mentor) to each intern
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    {success}
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Intern Name</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Division</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Batch</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Select PIC</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : interns.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-400">
                                        All interns have been assigned a PIC
                                    </td>
                                </tr>
                            ) : (
                                interns.map((intern) => (
                                    <tr key={intern.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                            {intern.user?.full_name || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intern.division}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{intern.batch}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={assignments[intern.id] || ""}
                                                onChange={(e) =>
                                                    setAssignments({ ...assignments, [intern.id]: Number(e.target.value) })
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                <option value="">— Select PIC —</option>
                                                {pics.map((pic) => (
                                                    <option key={pic.id} value={pic.id}>
                                                        {pic.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleAssign(intern.id)}
                                                disabled={!assignments[intern.id] || saving === intern.id}
                                                className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 mx-auto transition-colors"
                                            >
                                                <Users className="w-3.5 h-3.5" />
                                                {saving === intern.id ? "Saving..." : "Assign"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
