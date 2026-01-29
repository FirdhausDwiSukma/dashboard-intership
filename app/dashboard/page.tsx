"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Check for token
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // Redirect if not logged in
            return;
        }

        // Get username
        const storedUser = localStorage.getItem("username");
        setUsername(storedUser || "User");
    }, [router]);

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Navbar / Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    {/* Left: Brand/Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Dashtern</span>
                    </div>

                    {/* Right: Dashboard Label & User Actions */}
                    <div className="flex items-center gap-6">
                        <span className="text-gray-500 font-medium uppercase tracking-wider text-sm hidden md:block">
                            Dashboard
                        </span>
                        <div className="h-6 w-px bg-gray-300 hidden md:block"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">{username}</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("username");
                                    router.push("/login");
                                }}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium text-sm">Total Interns</h3>
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">12</p>
                        <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                            <span>+2</span>
                            <span className="text-gray-400">bulan ini</span>
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium text-sm">Active Projects</h3>
                            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">4</p>
                        <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                            <span>On Track</span>
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium text-sm">Pending Reviews</h3>
                            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">7</p>
                        <p className="text-orange-600 text-sm mt-2 flex items-center gap-1">
                            <span>Urgent</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
