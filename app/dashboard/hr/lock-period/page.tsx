"use client";

import { useEffect, useState } from "react";
import {
    fetchPeriods,
    createPeriod,
    lockPeriod,
    unlockPeriod,
    type Period,
} from "@/app/services/hrService";
import { Lock, Unlock, Plus, Calendar, AlertCircle, Check } from "lucide-react";

export default function HRLockPeriodPage() {
    const [periods, setPeriods] = useState<Period[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);
    const [lockingId, setLockingId] = useState<number | null>(null);

    const [form, setForm] = useState({
        name: "",
        start_date: "",
        end_date: "",
    });

    useEffect(() => {
        loadPeriods();
    }, []);

    const loadPeriods = async () => {
        try {
            setLoading(true);
            const data = await fetchPeriods();
            setPeriods(data);
        } catch {
            setError("Failed to load periods");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePeriod = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await createPeriod(form.name, form.start_date, form.end_date);
            setSuccess("Period created successfully!");
            setShowForm(false);
            setForm({ name: "", start_date: "", end_date: "" });
            loadPeriods();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create period");
        } finally {
            setSaving(false);
        }
    };

    const handleLock = async (id: number) => {
        if (!confirm("Are you sure you want to lock this period? HR cannot unlock it later — only Super Admin can.")) return;
        setLockingId(id);
        setError("");
        setSuccess("");
        try {
            await lockPeriod(id);
            setSuccess("Period locked successfully!");
            loadPeriods();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to lock period");
        } finally {
            setLockingId(null);
        }
    };

    const handleUnlock = async (id: number) => {
        setLockingId(id);
        setError("");
        setSuccess("");
        try {
            await unlockPeriod(id);
            setSuccess("Period unlocked successfully!");
            loadPeriods();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to unlock period");
        } finally {
            setLockingId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const inputClass =
        "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 dark:text-white";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lock Period</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage evaluation periods and lock them when completed
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Period
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" /> {success}
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <form
                    onSubmit={handleCreatePeriod}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4"
                >
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Create New Period
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className={inputClass}
                                placeholder="2026-Q1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                            <input
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date *</label>
                            <input
                                type="date"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            {saving ? "Creating..." : "Create Period"}
                        </button>
                    </div>
                </form>
            )}

            {/* Periods Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Period Name</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Start Date</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">End Date</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
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
                            ) : periods.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-400">
                                        No periods found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                periods.map((period) => (
                                    <tr key={period.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{period.name}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(period.start_date)}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(period.end_date)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {period.is_locked ? (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 inline-flex items-center gap-1">
                                                    <Lock className="w-3 h-3" /> Locked
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 inline-flex items-center gap-1">
                                                    <Unlock className="w-3 h-3" /> Open
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {period.is_locked ? (
                                                <button
                                                    onClick={() => handleUnlock(period.id)}
                                                    disabled={lockingId === period.id}
                                                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg text-xs font-medium disabled:opacity-40 inline-flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Unlock className="w-3.5 h-3.5" />
                                                    {lockingId === period.id ? "..." : "Unlock"}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleLock(period.id)}
                                                    disabled={lockingId === period.id}
                                                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-xs font-medium disabled:opacity-40 inline-flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Lock className="w-3.5 h-3.5" />
                                                    {lockingId === period.id ? "..." : "Lock"}
                                                </button>
                                            )}
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
