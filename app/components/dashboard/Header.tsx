"use client";

import { Bell, Menu, Search, Sun, Moon } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useTheme } from "@/app/hooks/useTheme";

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-16 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors duration-200">
            {/* Left: Mobile Menu & Breadcrumbs/Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-gray-600 dark:text-gray-400 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Overview</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Search Mobile (Icon only) */}
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden text-gray-500 dark:text-gray-400">
                    <Search className="w-5 h-5" />
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                >
                    {theme === "dark" ? (
                        <Moon className="w-5 h-5" />
                    ) : (
                        <Sun className="w-5 h-5" />
                    )}
                </button>

                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 relative transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
                </button>

                {/* Profile - visible on mobile header since sidebar is hidden? 
             Actually Sidebar is drawer on mobile. 
             Let's keep header simple.
         */}
            </div>
        </header>
    );
}
