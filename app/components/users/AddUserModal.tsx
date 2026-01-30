/**
 * Add User Modal Component
 * Presentation Layer - UI for adding new users
 */

"use client";

import React from "react";
import { X, UserPlus, Loader2 } from "lucide-react";
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
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
                <form onSubmit={handlers.handleSubmit} className="p-6 space-y-4">
                    {/* General Error */}
                    {formState.errors.general && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-sm text-red-800">{formState.errors.general}</p>
                        </div>
                    )}

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

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={formState.password}
                            onChange={(e) => handlers.handleChange("password", e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${formState.errors.password
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                            placeholder="••••••••"
                            disabled={formState.isLoading}
                            minLength={6}
                        />
                        {formState.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{formState.errors.password}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
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

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
                            disabled={formState.isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={formState.isLoading}
                        >
                            {formState.isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create User"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
