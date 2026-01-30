"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useBreadcrumb } from "@/app/hooks/useBreadcrumb";
import { cn } from "@/app/lib/utils";

/**
 * Breadcrumb Component
 * Displays navigation breadcrumbs based on current route
 * Positioned below the header in the dashboard layout
 */
export function Breadcrumb() {
    const breadcrumbs = useBreadcrumb();

    return (
        <nav
            className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 px-4 lg:px-8 py-3 transition-colors duration-200"
            aria-label="Breadcrumb"
        >
            <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    const isEllipsis = item.label === "...";
                    const Icon = item.icon;

                    return (
                        <li key={item.href + index} className="flex items-center">
                            {/* Separator (not shown before first item) */}
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-600" />
                            )}

                            {/* Breadcrumb Item */}
                            {isLast ? (
                                // Current page - not clickable, uses primary color
                                <span className="flex items-center gap-1.5 text-primary-500 dark:text-primary-500 font-medium">
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {item.label}
                                </span>
                            ) : isEllipsis ? (
                                // Ellipsis - clickable but styled differently
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                // Regular breadcrumb - clickable
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-1.5 transition-colors",
                                        "text-gray-500 dark:text-gray-400",
                                        "hover:text-gray-700 dark:hover:text-gray-300"
                                    )}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
