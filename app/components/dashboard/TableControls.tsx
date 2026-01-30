"use client";

import { RefreshCw, Filter, Download } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useState, useRef, useEffect } from "react";

interface TableControlsProps {
    /** Total number of entries */
    totalEntries: number;
    /** Number of entries per page */
    entriesPerPage: number;
    /** Callback when entries per page changes */
    onEntriesPerPageChange: (entries: number) => void;
    /** Current page (1-indexed) */
    currentPage: number;
    /** Callback for refresh action */
    onRefresh?: () => void;
    /** Callback for filter action */
    onFilter?: () => void;
    /** Callback for export action */
    onExport?: () => void;
}

/**
 * TableControls Component
 * Displays table control buttons and showing entries information
 */
export function TableControls({
    totalEntries,
    entriesPerPage,
    onEntriesPerPageChange,
    currentPage,
    onRefresh,
    onFilter,
    onExport,
}: TableControlsProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const entriesOptions = [10, 20, 50, 100];

    // Calculate showing range
    const startIndex = (currentPage - 1) * entriesPerPage + 1;
    const endIndex = Math.min(currentPage * entriesPerPage, totalEntries);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            {/* Left Side: Refresh + Showing Text */}
            <div className="flex items-center gap-4">
                {/* Refresh Button */}
                <button
                    onClick={onRefresh}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                    aria-label="Refresh table"
                    title="Refresh"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>

                {/* Showing Entries Text */}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex} to {endIndex} of {totalEntries} entries
                </span>
            </div>

            {/* Right Side: Entries Selector + Filter + Export */}
            <div className="flex items-center gap-3">
                {/* Entries Per Page Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        {entriesPerPage} entries
                        <svg
                            className={cn(
                                "w-4 h-4 transition-transform",
                                isDropdownOpen && "rotate-180"
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-10">
                            {entriesOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onEntriesPerPageChange(option);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-4 py-2 text-left text-sm transition-colors",
                                        option === entriesPerPage
                                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                                        "first:rounded-t-lg last:rounded-b-lg"
                                    )}
                                >
                                    {option} entries
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filter Button */}
                <button
                    onClick={onFilter}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" />
                    Filter
                </button>

                {/* Export Button */}
                <button
                    onClick={onExport}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>
        </div>
    );
}
