"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authHelper } from "@/app/utils/authHelper";

/**
 * Dashboard root page - redirects to the appropriate role-specific dashboard.
 * This page acts as a router that checks the user's role and navigates accordingly.
 */
export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        // Check for token
        if (!authHelper.isAuthenticated()) {
            router.push("/login");
            return;
        }

        // Get role and redirect to appropriate dashboard
        const role = localStorage.getItem("role");

        switch (role) {
            case "super_admin":
                router.replace("/dashboard/admin");
                break;
            case "hr":
                router.replace("/dashboard/hr");
                break;
            case "pic":
                router.replace("/dashboard/mentor");
                break;
            case "intern":
                router.replace("/dashboard/intern");
                break;
            default:
                // If role is unknown, redirect to login
                router.replace("/login");
                break;
        }
    }, [router]);

    // Show loading while redirecting
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting...</p>
            </div>
        </div>
    );
}
