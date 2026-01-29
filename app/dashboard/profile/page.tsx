"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [username, setUsername] = useState("Admin");

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        if (storedUser) {
            setUsername(storedUser);
        }
    }, []);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage your personal information
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                                {username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{username}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">admin@dashtern.com</p>
                        <button className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Change Photo
                        </button>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>

                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Admin"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="User"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    defaultValue="admin@dashtern.com"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
