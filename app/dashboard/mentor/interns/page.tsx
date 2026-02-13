"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import { mentorService, MentorIntern } from "@/app/services/mentorService";
import {
    GraduationCap,
    Search,
    CheckCircle,
    XCircle,
    Star,
    AlertTriangle,
    ArrowLeft,
} from "lucide-react";

export default function MentorInternsPage() {
    const router = useRouter();
    const [interns, setInterns] = useState<MentorIntern[]>([]);
    const [filteredInterns, setFilteredInterns] = useState<MentorIntern[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

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
        loadInterns();
    }, [router]);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredInterns(interns);
        } else {
            const q = search.toLowerCase();
            setFilteredInterns(
                interns.filter(
                    (i) =>
                        i.full_name.toLowerCase().includes(q) ||
                        i.division.toLowerCase().includes(q) ||
                        i.university.toLowerCase().includes(q)
                )
            );
        }
    }, [search, interns]);

    const loadInterns = async () => {
        try {
            setLoading(true);
            const data = await mentorService.getAssignedInterns();
            setInterns(data);
            setFilteredInterns(data);
        } catch (err: any) {
            setError(err.message || "Failed to load interns");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading interns...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <p className="text-red-500">{error}</p>
                <button onClick={loadInterns} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/dashboard/mentor")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Interns</h1>
                        <p className="text-sm text-gray-500 mt-1">{interns.length} intern(s) assigned to you</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, division, or university..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
            </div>

            {/* Intern Cards */}
            {filteredInterns.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No interns found</p>
                    <p className="text-sm mt-1">Try adjusting your search criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInterns.map((intern) => (
                        <div
                            key={intern.intern_profile_id}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => router.push(`/dashboard/mentor/reviews/submit?intern_id=${intern.intern_profile_id}&intern_name=${encodeURIComponent(intern.full_name)}`)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold text-lg shrink-0">
                                    {intern.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                                        {intern.full_name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{intern.division}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{intern.university} — {intern.major}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Batch: {intern.batch}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                                {intern.has_review ? (
                                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                                        <CheckCircle className="w-3.5 h-3.5" /> Evaluated
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                        <XCircle className="w-3.5 h-3.5" /> Pending Review
                                    </span>
                                )}
                                {intern.has_review && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Star className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Perf: {intern.performance_avg.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
