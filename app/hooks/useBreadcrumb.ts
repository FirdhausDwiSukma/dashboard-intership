"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Home } from "lucide-react";
import { BreadcrumbItem } from "@/app/types/BreadcrumbItem";

/**
 * Custom route label mappings for better readability
 * Add custom labels here for specific routes
 */
const ROUTE_LABELS: Record<string, string> = {
    dashboard: "Dashboard",
    users: "Users",
    settings: "Settings",
    notifications: "Notifications",
    analytics: "Analytics",
    profile: "Profile",
    report: "Report",
    support: "Support",
};

/**
 * Converts a route segment to a readable label
 * @param segment - Route segment to convert
 * @returns Formatted label
 */
function formatLabel(segment: string): string {
    // Check if there's a custom mapping
    if (ROUTE_LABELS[segment]) {
        return ROUTE_LABELS[segment];
    }

    // Default: capitalize first letter and replace hyphens with spaces
    return segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Custom hook for managing breadcrumb navigation
 * Automatically generates breadcrumb items based on current pathname
 * 
 * @returns Array of breadcrumb items
 */
export function useBreadcrumb(): BreadcrumbItem[] {
    const pathname = usePathname();

    const breadcrumbs = useMemo(() => {
        // Split pathname into segments and filter out empty strings
        const segments = pathname.split("/").filter(Boolean);

        // Always start with home
        const items: BreadcrumbItem[] = [
            {
                label: "Home",
                href: "/dashboard",
                icon: Home,
            },
        ];

        // If we're on the home page, return just the home item
        if (segments.length === 0 || (segments.length === 1 && segments[0] === "dashboard")) {
            return items;
        }

        // Build breadcrumb path
        let currentPath = "";

        // Start from index 1 to skip 'dashboard' segment (already included as Home)
        const startIndex = segments[0] === "dashboard" ? 1 : 0;

        for (let i = startIndex; i < segments.length; i++) {
            const segment = segments[i];
            currentPath += `/${segment}`;

            // Add /dashboard prefix if not already there
            const fullPath = pathname.startsWith("/dashboard")
                ? `/dashboard${currentPath}`
                : currentPath;

            items.push({
                label: formatLabel(segment),
                href: fullPath,
            });
        }

        // Implement truncation for deep paths (more than 3 levels)
        // Show: Home > ... > Current
        if (items.length > 3) {
            const home = items[0];
            const current = items[items.length - 1];

            return [
                home,
                {
                    label: "...",
                    href: items[items.length - 2].href, // Link to parent
                },
                current,
            ];
        }

        return items;
    }, [pathname]);

    return breadcrumbs;
}
