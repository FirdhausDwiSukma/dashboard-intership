"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import { mentorService, MentorReview } from "@/app/services/mentorService";
import {
    ArrowLeft,
    AlertTriangle,
    Star,
    Clock,
    FileText,
    Edit,
} from "lucide-react";

export default function ReviewHistoryPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState<MentorReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

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
        loadReviews();
    }, [router, page]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await mentorService.getReviewHistory(page, limit);
            // API might return { reviews: [], total: number } or just an array
            if (Array.isArray(data)) {
                setReviews(data);
                setTotal(data.length);
            } else {
                setReviews(data.reviews || data.data || []);
                setTotal(data.total || 0);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load review history");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 4) return "text-green-600 dark:text-green-400";
        if (score >= 3) return "text-amber-600 dark:text-amber-400";
        return "text-red-600 dark:text-red-400";
    };

    const getAvgScore = (review: MentorReview) => {
        return ((review.learning_ability + review.initiative + review.communication + review.problem_solving) / 4).toFixed(1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading review history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <p className="text-red-500">{error}</p>
                <button onClick={loadReviews} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Retry</button>
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
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review History</h1>
                        <p className="text-sm text-gray-500 mt-1">All reviews you have submitted</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/dashboard/mentor/reviews/submit")}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    New Review
                </button>
            </div>

            {/* Reviews */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No reviews yet</p>
                    <p className="text-sm mt-1">Start by submitting a review for one of your interns</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {review.intern?.full_name || `Intern #${review.intern_id}`}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(review.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium">
                                            {review.period}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1 text-lg font-bold ${getScoreColor(parseFloat(getAvgScore(review)))}`}>
                                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                        {getAvgScore(review)}
                                    </div>
                                </div>
                            </div>

                            {/* Score Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                {[
                                    { label: "Learning", value: review.learning_ability },
                                    { label: "Initiative", value: review.initiative },
                                    { label: "Communication", value: review.communication },
                                    { label: "Problem Solving", value: review.problem_solving },
                                ].map((item) => (
                                    <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                        <p className={`text-lg font-bold ${getScoreColor(item.value)}`}>{item.value}/5</p>
                                    </div>
                                ))}
                            </div>

                            {/* Notes */}
                            {review.notes && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1 font-medium">Notes</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {total > limit && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-500">Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={reviews.length < limit}
                        className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
