"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";
import { mentorService, MentorIntern, SubmitReviewData } from "@/app/services/mentorService";
import {
    ArrowLeft,
    AlertTriangle,
    CheckCircle,
    Star,
    Send,
} from "lucide-react";

export default function SubmitReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedInternId = searchParams.get("intern_id");
    const preselectedInternName = searchParams.get("intern_name");

    const [interns, setInterns] = useState<MentorIntern[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<SubmitReviewData>({
        intern_id: preselectedInternId ? parseInt(preselectedInternId) : 0,
        learning_ability: 3,
        initiative: 3,
        communication: 3,
        problem_solving: 3,
        notes: "",
        period: "",
    });

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

    const loadInterns = async () => {
        try {
            setLoading(true);
            const data = await mentorService.getAssignedInterns();
            setInterns(data);
        } catch (err: any) {
            setError(err.message || "Failed to load interns");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.intern_id || !formData.period) {
            setError("Please select an intern and enter the period");
            return;
        }
        try {
            setSubmitting(true);
            setError(null);
            await mentorService.submitReview(formData);
            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard/mentor/reviews/history");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const scoreLabels: Record<number, string> = {
        1: "Poor",
        2: "Below Average",
        3: "Average",
        4: "Good",
        5: "Excellent",
    };

    const ScoreSelector = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                    <button
                        key={score}
                        type="button"
                        onClick={() => onChange(score)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all flex-1 ${value === score
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                            }`}
                    >
                        <Star className={`w-5 h-5 ${value >= score ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                        <span className="text-xs font-medium">{score}</span>
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">{scoreLabels[value]}</p>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Submitted!</h2>
                <p className="text-sm text-gray-500">Redirecting to review history...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Review</h1>
                    <p className="text-sm text-gray-500 mt-1">Evaluate your intern's performance</p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                {/* Intern Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Intern</label>
                    <select
                        value={formData.intern_id}
                        onChange={(e) => setFormData({ ...formData, intern_id: parseInt(e.target.value) })}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        required
                    >
                        <option value={0}>-- Select an intern --</option>
                        {interns.map((intern) => (
                            <option key={intern.intern_profile_id} value={intern.intern_profile_id}>
                                {intern.full_name} ({intern.division})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Period */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Period</label>
                    <input
                        type="text"
                        placeholder="e.g. 2026-Q1"
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        required
                    />
                </div>

                {/* Scores */}
                <div className="space-y-5">
                    <ScoreSelector label="Learning Ability" value={formData.learning_ability} onChange={(v) => setFormData({ ...formData, learning_ability: v })} />
                    <ScoreSelector label="Initiative" value={formData.initiative} onChange={(v) => setFormData({ ...formData, initiative: v })} />
                    <ScoreSelector label="Communication" value={formData.communication} onChange={(v) => setFormData({ ...formData, communication: v })} />
                    <ScoreSelector label="Problem Solving" value={formData.problem_solving} onChange={(v) => setFormData({ ...formData, problem_solving: v })} />
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes / Feedback</label>
                    <textarea
                        rows={4}
                        placeholder="Write your feedback about this intern..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                    {submitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    {submitting ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </div>
    );
}
