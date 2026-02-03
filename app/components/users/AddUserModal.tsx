/**
 * Add User Modal Component
 * Presentation Layer - UI for adding new users
 */

"use client";

import React, { useState } from "react";
import { X, UserPlus, Loader2, Eye, EyeOff, Plus, Trash2, CheckCircle } from "lucide-react";
import { useAddUserForm } from "@/app/hooks/useAddUserForm";
import { AVAILABLE_ROLES } from "@/app/types/addUser";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const { formState, handlers } = useAddUserForm({
        onSuccess: () => {
            onSuccess();
            onClose();
        },
    });

    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking the backdrop itself, not the modal content
        if (e.target === e.currentTarget && !formState.isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary-500" />
                        Add New User
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        disabled={formState.isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handlers.handleSubmit} noValidate className="p-6 space-y-6">
                    {/* General Error */}
                    {formState.errors.general && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-sm text-red-800">{formState.errors.general}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Account Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2 mb-4">Account Details</h3>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formState.fullName}
                                    onChange={(e) => handlers.handleChange("fullName", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formState.errors.fullName
                                        ? "border-red-500"
                                        : "border-gray-300 dark:border-gray-600"
                                        }`}
                                    placeholder="John Doe"
                                    disabled={formState.isLoading}
                                />
                                {formState.errors.fullName && (
                                    <p className="mt-1 text-sm text-red-600">{formState.errors.fullName}</p>
                                )}
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formState.username}
                                    onChange={(e) => handlers.handleChange("username", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formState.errors.username
                                        ? "border-red-500"
                                        : "border-gray-300 dark:border-gray-600"
                                        }`}
                                    placeholder="john_doe"
                                    disabled={formState.isLoading}
                                />
                                {formState.errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{formState.errors.username}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formState.email}
                                    onChange={(e) => handlers.handleChange("email", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formState.errors.email
                                        ? "border-red-500"
                                        : "border-gray-300 dark:border-gray-600"
                                        }`}
                                    placeholder="john@example.com"
                                    disabled={formState.isLoading}
                                />
                                {formState.errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{formState.errors.email}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formState.roleId}
                                    onChange={(e) => handlers.handleChange("roleId", parseInt(e.target.value))}
                                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formState.errors.roleId
                                        ? "border-red-500"
                                        : "border-gray-300 dark:border-gray-600"
                                        }`}
                                    disabled={formState.isLoading}
                                >
                                    <option value={0} disabled>Select a role</option>
                                    {AVAILABLE_ROLES.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.displayName}
                                        </option>
                                    ))}
                                </select>
                                {formState.errors.roleId && (
                                    <p className="mt-1 text-sm text-red-600">{formState.errors.roleId}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Security */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2 mb-4">Security</h3>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formState.password}
                                        onChange={(e) => handlers.handleChange("password", e.target.value)}
                                        className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formState.errors.password
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                            }`}
                                        placeholder="••••••••"
                                        disabled={formState.isLoading}
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {formState.errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{formState.errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formState.confirmPassword}
                                        onChange={(e) => handlers.handleChange("confirmPassword", e.target.value)}
                                        className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formState.errors.confirmPassword
                                            ? "border-red-500"
                                            : "border-gray-300 dark:border-gray-600"
                                            }`}
                                        placeholder="••••••••"
                                        disabled={formState.isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {formState.errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{formState.errors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                <p className="font-medium">Password Requirements:</p>
                                <ul className="list-disc list-inside space-y-0.5 ml-2">
                                    <li>At least 8 characters</li>
                                    <li>One uppercase letter (A-Z)</li>
                                    <li>One lowercase letter (a-z)</li>
                                    <li>One number (0-9)</li>
                                    <li>One special character (@#$%^&*!)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contacts Section - Full Width */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information</span>
                            <button
                                type="button"
                                onClick={handlers.addContact}
                                className="text-xs flex items-center gap-1 text-primary-500 hover:text-primary-600 transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Add Contact
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formState.contacts.map((contact, index) => (
                                <div key={index} className="flex gap-2 items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <select
                                        value={contact.type}
                                        onChange={(e) => handlers.updateContact(index, "type", e.target.value as any)}
                                        className="w-1/3 px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="phone">Phone</option>
                                        <option value="whatsapp">WhatsApp</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={contact.value}
                                        onChange={(e) => handlers.updateContact(index, "value", e.target.value)}
                                        placeholder="Phone Number"
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-0"
                                    />
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handlers.updateContact(index, "is_primary", true)}
                                            className={`p-2 rounded-lg transition-colors ${contact.is_primary ? "text-green-500 bg-green-100 dark:bg-green-900/30" : "text-gray-400 hover:text-gray-600"}`}
                                            title="Set as Primary"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlers.removeContact(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Remove Contact"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {formState.contacts.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4 italic">No contacts added yet.</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                            disabled={formState.isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                            disabled={formState.isLoading}
                        >
                            {formState.isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
