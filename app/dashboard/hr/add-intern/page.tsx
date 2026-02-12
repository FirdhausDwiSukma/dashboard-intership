"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIntern } from "@/app/services/internService";
import { UserPlus, ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import Link from "next/link";

export default function HRAddInternPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        batch: "",
        division: "",
        university: "",
        major: "",
        start_date: "",
        end_date: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Clear field error on change
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Auto-generate username from full name
    const autoUsername = () => {
        const name = form.full_name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        setForm({ ...form, username: "intern_" + name });
    };

    // Password validation checks
    const passwordChecks = {
        minLength: form.password.length >= 8,
        hasUppercase: /[A-Z]/.test(form.password),
        hasLowercase: /[a-z]/.test(form.password),
        hasNumber: /[0-9]/.test(form.password),
        hasSpecial: /[@#$%^&*!]/.test(form.password),
    };

    const allPasswordChecksPassed = Object.values(passwordChecks).every(Boolean);
    const passwordsMatch = form.password === form.confirm_password && form.confirm_password.length > 0;

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!form.full_name.trim()) errors.full_name = "Full name is required";
        if (!form.username.trim()) errors.username = "Username is required";
        if (!form.email.trim()) errors.email = "Email is required";

        // Password validation
        if (!form.password) {
            errors.password = "Password is required";
        } else if (form.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        } else if (!passwordChecks.hasUppercase) {
            errors.password = "Password must contain at least one uppercase letter";
        } else if (!passwordChecks.hasLowercase) {
            errors.password = "Password must contain at least one lowercase letter";
        } else if (!passwordChecks.hasNumber) {
            errors.password = "Password must contain at least one number";
        } else if (!passwordChecks.hasSpecial) {
            errors.password = "Password must contain at least one special character (@#$%^&*!)";
        }

        // Confirm password
        if (!form.confirm_password) {
            errors.confirm_password = "Please confirm the password";
        } else if (form.password !== form.confirm_password) {
            errors.confirm_password = "Passwords do not match";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) return;

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

    const inputErrorClass =
        "w-full bg-gray-50 dark:bg-gray-800 border border-red-400 dark:border-red-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-gray-900 dark:text-white";

    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    const PasswordCheckItem = ({ passed, label }: { passed: boolean; label: string }) => (
        <li className={`flex items-center gap-1.5 text-xs ${passed ? "text-emerald-500" : "text-gray-400 dark:text-gray-500"}`}>
            {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {label}
        </li>
    );

    return (
        <div className="space-y-6">
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
                            className={fieldErrors.full_name ? inputErrorClass : inputClass}
                            placeholder="John Doe"
                        />
                        {fieldErrors.full_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.full_name}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Username *</label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className={fieldErrors.username ? inputErrorClass : inputClass}
                            placeholder="intern_john_doe"
                        />
                        {fieldErrors.username && <p className="text-xs text-red-500 mt-1">{fieldErrors.username}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Email *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className={fieldErrors.email ? inputErrorClass : inputClass}
                            placeholder="john@example.com"
                        />
                        {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Password *</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                required
                                className={fieldErrors.password ? inputErrorClass + " pr-10" : inputClass + " pr-10"}
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Confirm Password *</label>
                        <div className="relative">
                            <input
                                name="confirm_password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={form.confirm_password}
                                onChange={handleChange}
                                required
                                className={fieldErrors.confirm_password ? inputErrorClass + " pr-10" : inputClass + " pr-10"}
                                placeholder="Re-enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {fieldErrors.confirm_password && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirm_password}</p>}
                        {!fieldErrors.confirm_password && form.confirm_password.length > 0 && (
                            <p className={`text-xs mt-1 ${passwordsMatch ? "text-emerald-500" : "text-red-500"}`}>
                                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Password Requirements Checklist */}
                {form.password.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Password Requirements:</p>
                        <ul className="grid grid-cols-2 gap-1">
                            <PasswordCheckItem passed={passwordChecks.minLength} label="Minimum 8 characters" />
                            <PasswordCheckItem passed={passwordChecks.hasUppercase} label="One uppercase letter (A-Z)" />
                            <PasswordCheckItem passed={passwordChecks.hasLowercase} label="One lowercase letter (a-z)" />
                            <PasswordCheckItem passed={passwordChecks.hasNumber} label="One number (0-9)" />
                            <PasswordCheckItem passed={passwordChecks.hasSpecial} label="One special character (@#$%^&*!)" />
                        </ul>
                    </div>
                )}

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
                        disabled={loading || !allPasswordChecksPassed || !passwordsMatch}
                        className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        {loading ? "Creating..." : "Create Intern"}
                    </button>
                </div>
            </form>
        </div>
    );
}
