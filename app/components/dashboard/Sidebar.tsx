"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Home,
    Users,
    Settings,
    LogOut,
    LayoutDashboard,
    PieChart,
    Bell,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import Image from "next/image";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

const sidebarItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Users, label: "Users", href: "/dashboard/users" },
    { icon: PieChart, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar({ isOpen, setIsOpen, isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [username, setUsername] = useState<string>("Admin");

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        if (storedUser) {
            setUsername(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col",
                    // Mobile: controlled by isOpen (width 72). Desktop: controlled by isCollapsed (width 72 or 20)
                    isOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
                    isCollapsed ? "lg:w-20" : "lg:w-72"
                )}
            >
                {/* Logo Section */}
                <div className={cn(
                    "h-16 flex items-center border-b border-gray-100 dark:border-gray-800 relative transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : "px-6 justify-between"
                )}>
                    <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold shrink-0">
                            D
                        </div>
                        <span className={cn(
                            "text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent whitespace-nowrap transition-opacity duration-300",
                            isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                        )}>
                            Dashtern
                        </span>
                    </Link>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className={cn(
                            "hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-full items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 shadow-sm transition-colors z-50",
                            isCollapsed && "-right-3"
                        )}
                    >
                        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        {isCollapsed ? (
                            <button className="w-full flex justify-center p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                <Search className="w-5 h-5" />
                            </button>
                        ) : (
                            <>
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                />
                            </>
                        )}
                    </div>

                    {!isCollapsed && (
                        <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            Menu
                        </p>
                    )}

                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                                    isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 transition-colors shrink-0",
                                        isActive
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                                    )}
                                />
                                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {/* User Profile Section (Bottom) */}
                <div className={cn("p-4 border-t border-gray-200 dark:border-gray-800", isCollapsed && "p-2")}>
                    <div
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group",
                            isCollapsed && "justify-center"
                        )}
                        title="Logout"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative shrink-0">
                            {/* Placeholder Avatar */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {username}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        admin@dashtern.com
                                    </p>
                                </div>
                                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                            </>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
