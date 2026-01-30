"use client";

import { useState, useEffect } from "react";
import { Pagination } from "@/app/components/dashboard/Pagination";
import { TableControls } from "@/app/components/dashboard/TableControls";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { fetchUsers, getTotalUsersCount, type User } from "@/app/services/userService";

export default function UsersPage() {
    // State management
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch users data when page or entries per page changes
    useEffect(() => {
        loadUsers();
    }, [currentPage, entriesPerPage]);

    // Load total count on mount
    useEffect(() => {
        loadTotalCount();
    }, []);

    // Fetch users from API
    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetchUsers(currentPage, entriesPerPage);
            setUsers(response.data);
            setTotalPages(response.totalPages);
            setTotalUsers(response.total);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load total count
    const loadTotalCount = async () => {
        try {
            const count = await getTotalUsersCount();
            setTotalUsers(count);
        } catch (error) {
            console.error("Error loading total count:", error);
        }
    };

    // Handle entries per page change
    const handleEntriesPerPageChange = (entries: number) => {
        setEntriesPerPage(entries);
        setCurrentPage(1); // Reset to first page
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Generate avatar placeholder with initials
    const getAvatarUrl = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true&size=128`;
    };

    // Placeholder action handlers
    const handleRefresh = () => {
        loadUsers();
    };

    const handleFilter = () => {
        console.log("Filter clicked");
    };

    const handleExport = () => {
        console.log("Export clicked");
    };

    const handleEdit = (userId: number) => {
        console.log("Edit user:", userId);
    };

    const handleDelete = (userId: number) => {
        console.log("Delete user:", userId);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Data User
                    </h1>
                    <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-500 px-3 py-1 rounded-full text-sm font-medium">
                        {totalUsers} users
                    </span>
                </div>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                    Add User
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                {/* Table Controls */}
                <TableControls
                    totalEntries={totalUsers}
                    entriesPerPage={entriesPerPage}
                    onEntriesPerPageChange={handleEntriesPerPageChange}
                    currentPage={currentPage}
                    onRefresh={handleRefresh}
                    onFilter={handleFilter}
                    onExport={handleExport}
                />

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    PIC
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                // Loading State
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Loading users...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                // Empty State
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            No users found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                // User Rows
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {/* Name Column with Avatar */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar || getAvatarUrl(user.name)}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {user.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status Column */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${user.status === "Active"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${user.status === "Active"
                                                        ? "bg-green-600 dark:bg-green-400"
                                                        : "bg-gray-600 dark:bg-gray-400"
                                                        }`}
                                                />
                                                {user.status}
                                            </span>
                                        </td>

                                        {/* Role Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {user.role}
                                        </td>

                                        {/* PIC Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {user.pic}
                                        </td>

                                        {/* Actions Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(user.id)}
                                                    className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && users.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
