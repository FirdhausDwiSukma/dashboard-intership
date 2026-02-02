"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, AlertCircle } from "lucide-react";

import { authHelper } from "@/app/utils/authHelper";

export default function DashboardPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Check for token
        if (!authHelper.isAuthenticated()) {
            router.push("/login"); // Redirect if not logged in
            return;
        }

        // Get username
        const storedUser = localStorage.getItem("username");
        setUsername(storedUser || "User");
    }, [router]);

    return (
        <div className="space-y-6">
            {/* Page Header Content */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome back, {username}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Here's what's happening with your projects today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Total Interns</h3>
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center gap-1">
                        <span>+2</span>
                        <span className="text-gray-400 dark:text-gray-500">month over month</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Active Projects</h3>
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">4</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm mt-2 flex items-center gap-1">
                        <span>On Track</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Pending Reviews</h3>
                        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">7</p>
                    <p className="text-orange-600 dark:text-orange-400 text-sm mt-2 flex items-center gap-1">
                        <span>Urgent</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
