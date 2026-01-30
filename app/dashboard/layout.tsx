"use client";

import { useState } from "react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Header } from "@/app/components/dashboard/Header";
import { Breadcrumb } from "@/app/components/dashboard/Breadcrumb";
import { cn } from "@/app/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex bg-gray-50 dark:bg-black min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Main Content Wrapper */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                "lg:ml-0" // Sidebar is sticky/fixed? In Sidebar.tsx it is "fixed lg:static". So it takes space in flow.
                // If static, we don't need margin. Flex layout handles it.
            )}>
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <Breadcrumb />

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
