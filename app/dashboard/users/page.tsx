"use client";

import { useState } from "react";
import { Pagination } from "@/app/components/dashboard/Pagination";
import { TableControls } from "@/app/components/dashboard/TableControls";
import { Pencil, Trash2 } from "lucide-react";

// User interface with enhanced fields
interface User {
    id: number;
    name: string;
    username: string;
    avatar?: string;
    role: string;
    status: "Active" | "Inactive";
    pic: string; // Person in Charge
}

// Sample user data with usernames and PICs
const USERS_DATA: User[] = [
    { id: 1, name: "John Doe", username: "@john", role: "Admin", status: "Active", pic: "Sarah Johnson" },
    { id: 2, name: "Jane Smith", username: "@jane", role: "Manager", status: "Active", pic: "Michael Brown" },
    { id: 3, name: "Bob Johnson", username: "@bob", role: "User", status: "Inactive", pic: "Sarah Johnson" },
    { id: 4, name: "Alice Williams", username: "@alice", role: "Moderator", status: "Active", pic: "John Davis" },
    { id: 5, name: "Charlie Brown", username: "@charlie", role: "User", status: "Active", pic: "Sarah Johnson" },
    { id: 6, name: "Diana Prince", username: "@diana", role: "Admin", status: "Active", pic: "Michael Brown" },
    { id: 7, name: "Eve Miller", username: "@eve", role: "User", status: "Active", pic: "John Davis" },
    { id: 8, name: "Frank Castle", username: "@frank", role: "Moderator", status: "Inactive", pic: "Sarah Johnson" },
    { id: 9, name: "Grace Lee", username: "@grace", role: "User", status: "Active", pic: "Michael Brown" },
    { id: 10, name: "Henry Ford", username: "@henry", role: "Manager", status: "Active", pic: "John Davis" },
    { id: 11, name: "Asep", username: "@john", role: "Admin", status: "Active", pic: "Sarah Johnson" },
    { id: 12, name: "Udin", username: "@jane", role: "Manager", status: "Active", pic: "Michael Brown" },
    { id: 13, name: "Bob Johnson", username: "@bob", role: "User", status: "Inactive", pic: "Sarah Johnson" },
    { id: 14, name: "Alice Williams", username: "@alice", role: "Moderator", status: "Active", pic: "John Davis" },
    { id: 15, name: "Charlie Brown", username: "@charlie", role: "User", status: "Active", pic: "Sarah Johnson" },
    { id: 16, name: "Diana Prince", username: "@diana", role: "Admin", status: "Active", pic: "Michael Brown" },
    { id: 17, name: "Eve Miller", username: "@eve", role: "User", status: "Active", pic: "John Davis" },
    { id: 18, name: "Frank Castle", username: "@frank", role: "Moderator", status: "Inactive", pic: "Sarah Johnson" },
    { id: 19, name: "Grace Lee", username: "@grace", role: "User", status: "Active", pic: "Michael Brown" },
    { id: 20, name: "Henry Ford", username: "@henry", role: "Manager", status: "Active", pic: "John Davis" },
];

export default function UsersPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    // Calculate pagination
    const totalPages = Math.ceil(USERS_DATA.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const visibleUsers = USERS_DATA.slice(startIndex, endIndex);

    // Reset to page 1 when entries per page changes
    const handleEntriesPerPageChange = (entries: number) => {
        setEntriesPerPage(entries);
        setCurrentPage(1);
    };

    // Generate avatar placeholder with initials
    const getAvatarUrl = (name: string) => {
        const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true&size=128`;
    };

    // Placeholder action handlers
    const handleRefresh = () => {
        console.log("Refresh clicked");
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
                        {USERS_DATA.length} users
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
                    totalEntries={USERS_DATA.length}
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
                            {visibleUsers.map((user) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}
