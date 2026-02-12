"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIntern } from "@/app/services/internService";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HRAddInternPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        batch: "",
        division: "",
        university: "",
        major: "",
        start_date: "",
        end_date: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Auto-generate password
    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setForm({ ...form, password: pass });
    };

    // Auto-generate username from full name
    const autoUsername = () => {
        const name = form.full_name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        setForm({ ...form, username: "intern_" + name });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await createIntern({
                full_name: form.full_name,
                username: form.username,
                email: form.email,
                password: form.password,
                batch: form.batch,
                division: form.division,
                university: form.university,
                major: form.major,
                start_date: form.start_date,
                end_date: form.end_date,
            });
            setSuccess("Intern created successfully!");
            setTimeout(() => router.push("/dashboard/hr/all-interns"), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create intern");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-900 dark:text-white";

    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard/hr/all-interns"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Intern</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Create a new intern account and profile
                    </p>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-lg px-4 py-3 text-sm">
                    {success}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Full Name *</label>
                        <input
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            onBlur={autoUsername}
                            required
                            className={inputClass}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Username *</label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className={inputClass}
                            placeholder="intern_john_doe"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Email *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className={inputClass}
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Password *</label>
                        <div className="flex gap-2">
                            <input
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className={inputClass}
                                placeholder="Min 6 characters"
                            />
                            <button
                                type="button"
                                onClick={generatePassword}
                                className="shrink-0 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                            >
                                Auto
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Internship Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Batch *</label>
                        <input name="batch" value={form.batch} onChange={handleChange} required className={inputClass} placeholder="2026-Q1" />
                    </div>
                    <div>
                        <label className={labelClass}>Division *</label>
                        <input name="division" value={form.division} onChange={handleChange} required className={inputClass} placeholder="Engineering" />
                    </div>
                    <div>
                        <label className={labelClass}>University *</label>
                        <input name="university" value={form.university} onChange={handleChange} required className={inputClass} placeholder="University of..." />
                    </div>
                    <div>
                        <label className={labelClass}>Major *</label>
                        <input name="major" value={form.major} onChange={handleChange} required className={inputClass} placeholder="Computer Science" />
                    </div>
                    <div>
                        <label className={labelClass}>Start Date *</label>
                        <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>End Date *</label>
                        <input name="end_date" type="date" value={form.end_date} onChange={handleChange} required className={inputClass} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        href="/dashboard/hr/all-interns"
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        {loading ? "Creating..." : "Create Intern"}
                    </button>
                </div>
            </form>
        </div>
    );
}
