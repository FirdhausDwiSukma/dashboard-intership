/**
 * Edit User Modal Component
 * Presentation Layer - UI for editing existing users
 */

"use client";

import React from "react";
import { X, UserCog, Loader2, Plus, Trash2, CheckCircle } from "lucide-react";
import { useEditUserForm } from "@/app/hooks/useEditUserForm";
import { User } from "@/app/services/userService";

interface EditUserModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
    isOpen,
    user,
    onClose,
    onSuccess,
}) => {
    const { formState, handlers } = useEditUserForm({
        user,
        onSuccess: () => {
            onSuccess();
            onClose();
        },
    });

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking the backdrop itself, not the modal content
        if (e.target === e.currentTarget && !formState.isLoading) {
            onClose();
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <UserCog className="w-5 h-5 text-primary-500" />
                        Edit User
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
                <form onSubmit={handlers.handleSubmit} noValidate className="p-6 space-y-4">
                    {/* General Error */}
                    {formState.errors.general && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-sm text-red-800">{formState.errors.general}</p>
                        </div>
                    )}

                    {/* Metadata (Read-only) */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={formState.username}
                                disabled
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Role
                            </label>
                            <input
                                type="text"
                                value={formState.role}
                                disabled
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed capitalize"
                            />
                        </div>
                    </div>

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

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formState.status}
                            onChange={(e) => handlers.handleChange("status", e.target.value as "active" | "inactive")}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={formState.isLoading}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Contacts Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">Contact Information</span>
                            <button
                                type="button"
                                onClick={handlers.addContact}
                                className="text-xs flex items-center gap-1 text-primary-500 hover:text-primary-600 transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Add Contact
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formState.contacts.map((contact, index) => (
                                <div key={index} className="flex gap-2 items-start">
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
                                        placeholder="Contact value..."
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handlers.updateContact(index, "is_primary", true)}
                                        className={`p-2 rounded-lg transition-colors ${contact.is_primary ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-gray-400 hover:text-gray-600"}`}
                                        title="Set as Primary"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handlers.removeContact(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        // disabled={formState.contacts.length === 1} // Edit mode maybe allows empty? Requirement says "A user can have multiple". MVP allows 0?
                                        // I'll leave it simple.
                                        title="Remove Contact"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
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
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
