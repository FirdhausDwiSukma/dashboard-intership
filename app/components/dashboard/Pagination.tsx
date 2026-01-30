"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface PaginationProps {
    /** Current active page (1-indexed) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Callback when page changes */
    onPageChange: (page: number) => void;
}

/**
 * Pagination Component
 * Displays page numbers with Previous/Next navigation
 * Active page uses primary color
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Generate page numbers array
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        // If total pages <= 7, show all pages
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        if (currentPage <= 3) {
            // Near beginning: 1 2 3 4 5 ... 10
            for (let i = 2; i <= 5; i++) {
                pages.push(i);
            }
            pages.push("...");
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            // Near end: 1 ... 6 7 8 9 10
            pages.push("...");
            for (let i = totalPages - 4; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Middle: 1 ... 4 5 6 ... 10
            pages.push("...");
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }
            pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                    currentPage === 1
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => {
                if (page === "...") {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-gray-500 dark:text-gray-400"
                        >
                            ...
                        </span>
                    );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-[40px]",
                            isActive
                                ? "bg-primary-500 text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        aria-label={`Page ${pageNum}`}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {pageNum}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                    currentPage === totalPages
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                aria-label="Next page"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
}
