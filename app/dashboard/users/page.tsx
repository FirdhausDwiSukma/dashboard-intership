"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/app/components/dashboard/Pagination";
import { TableControls } from "@/app/components/dashboard/TableControls";
import { AddUserModal } from "@/app/components/users/AddUserModal";
import { EditUserModal } from "@/app/components/users/EditUserModal";
import { DeleteUserModal } from "@/app/components/users/DeleteUserModal";
import ResetPasswordModal from "@/app/components/users/ResetPasswordModal"; // Default Import
import { Pencil, Trash2, Loader2, Key, ArrowUpDown, ArrowUp, ArrowDown, Phone, MessageCircle } from "lucide-react";
import { fetchUsers, getTotalUsersCount, deleteUser, type User } from "@/app/services/userService";
import { cn } from "@/app/lib/utils";
import { useToast } from "@/app/context/ToastContext";

type SortColumn = "full_name" | "status" | "role" | null;
type SortOrder = "asc" | "desc";

export default function UsersPage() {
    const router = useRouter();
    const { addToast } = useToast();

    // Check for role access
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "super_admin") {
            router.push("/dashboard");
        }
    }, [router]);
    // State management
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Selection state
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

    const [selectAll, setSelectAll] = useState(false);

    // Sort state
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [resetPasswordUser, setResetPasswordUser] = useState<{ id: number; name: string } | null>(null); // New State
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    // Fetch users data when page, entries, or sort changes
    useEffect(() => {
        loadUsers();
    }, [currentPage, entriesPerPage, sortColumn, sortOrder]);

    // Load total count on mount
    useEffect(() => {
        loadTotalCount();
    }, []);

    // Fetch users from API
    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetchUsers(currentPage, entriesPerPage);
            let sortedData = response.data;

            // Apply sorting if needed
            if (sortColumn) {
                sortedData = [...response.data].sort((a, b) => {
                    let aValue = "";
                    let bValue = "";

                    // Handle different column types
                    if (sortColumn === "full_name") {
                        aValue = a.full_name.toLowerCase();
                        bValue = b.full_name.toLowerCase();
                    } else if (sortColumn === "status") {
                        aValue = a.status.toLowerCase();
                        bValue = b.status.toLowerCase();
                    } else if (sortColumn === "role") {
                        const aRole = typeof a.role === 'string' ? a.role : a.role?.name || "";
                        const bRole = typeof b.role === 'string' ? b.role : b.role?.name || "";
                        aValue = aRole.toLowerCase();
                        bValue = bRole.toLowerCase();
                    }

                    if (sortOrder === "asc") {
                        return aValue.localeCompare(bValue);
                    } else {
                        return bValue.localeCompare(aValue);
                    }
                });
            } else {
                // Default: sort by ID descending (newest first)
                sortedData = [...response.data].sort((a, b) => b.id - a.id);
            }

            setUsers(sortedData);
            setTotalPages(response.totalPages);
            setTotalUsers(response.total);

            // Reset selection when data changes
            setSelectedUsers(new Set());
            setSelectAll(false);
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
    // Handle sort column click with 3-state cycle:
    // null (default: newest first) -> asc -> desc -> null
    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            // Same column clicked - cycle through states
            if (sortOrder === "asc") {
                setSortOrder("desc");
            } else {
                // desc -> back to default (null)
                setSortColumn(null);
                setSortOrder("asc");
            }
        } else {
            // New column clicked - start with ascending
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    // Handle select all checkbox
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map(u => u.id)));
        }
        setSelectAll(!selectAll);
    };

    // Handle individual checkbox
    const handleSelectUser = (userId: number) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
        setSelectAll(newSelected.size === users.length && users.length > 0);
    };

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
        const userToEdit = users.find(u => u.id === userId);
        if (userToEdit) {
            setEditingUser(userToEdit);
        }
    };

    const handleDelete = (userId: number) => {
        const userToDelete = users.find(u => u.id === userId);
        if (userToDelete) {
            setDeletingUser(userToDelete);
        }
    };

    const confirmDelete = async () => {
        if (!deletingUser) return;

        try {
            setIsDeleteLoading(true);
            await deleteUser(deletingUser.id);
            addToast({
                type: "success",
                title: "User deleted",
                message: "User deleted successfully",
                duration: 3000
            });
            loadUsers(); // Refresh list
            loadTotalCount(); // Refresh count
            setDeletingUser(null);
        } catch (error: any) {
            addToast({
                type: "error",
                title: "Delete failed",
                message: error.message || "Failed to delete user",
                duration: 5000
            });
        } finally {
            setIsDeleteLoading(false);
        }
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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                >
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
                                {/* Checkbox Column */}
                                <th className="px-6 py-3 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded cursor-pointer"
                                    />
                                </th>

                                {/* Name Column with Sort */}
                                <th className="px-2 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("full_name")}
                                        className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                    >
                                        Name
                                        {sortColumn === "full_name" ? (
                                            sortOrder === "asc" ? (
                                                <ArrowUp className="w-4 h-4 text-primary-500" strokeWidth={2.5} />
                                            ) : (
                                                <ArrowDown className="w-4 h-4 text-primary-500" strokeWidth={2.5} />
                                            )
                                        ) : (
                                            <ArrowUpDown className="w-4 h-4 text-gray-400" strokeWidth={2} />
                                        )}
                                    </button>
                                </th>

                                {/* Status Column with Sort */}
                                <th className="px-6 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("status")}
                                        className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                    >
                                        Status
                                        {sortColumn === "status" ? (
                                            sortOrder === "asc" ? (
                                                <ArrowUp className="w-4 h-4 text-primary-500" strokeWidth={2.5} />
                                            ) : (
                                                <ArrowDown className="w-4 h-4 text-primary-500" strokeWidth={2.5} />
                                            )
                                        ) : (
                                            <ArrowUpDown className="w-4 h-4 text-gray-400" strokeWidth={2} />
                                        )}
                                    </button>
                                </th>

                                {/* Role Column with Sort */}
                                <th className="px-6 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("role")}
                                        className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                    >
                                        Role
                                        {sortColumn === "role" ? (
                                            sortOrder === "asc" ? (
                                                <ArrowUp className="w-4 h-4 text-primary-500" strokeWidth={2.5} />
                                            ) : (
                                                <ArrowDown className="w-4 h-4 text-primary-500" strokeWidth={2.5} />
                                            )
                                        ) : (
                                            <ArrowUpDown className="w-4 h-4 text-gray-400" strokeWidth={2} />
                                        )}
                                    </button>
                                </th>

                                {/* Email Column */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>

                                {/* Contact Column */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Contact
                                </th>

                                {/* Actions Column */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                // Loading State
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
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
                                    <td colSpan={6} className="px-6 py-12 text-center">
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
                                        {/* Checkbox Column */}
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.has(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                                className="w-4 h-4 rounded cursor-pointer"
                                            />
                                        </td>

                                        {/* Name Column with Avatar */}
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        user.avatar_url
                                                            ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${user.avatar_url}`)
                                                            : getAvatarUrl(user.full_name)
                                                    }
                                                    alt={user.full_name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = getAvatarUrl(user.full_name);
                                                    }}
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.full_name}
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
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${user.status === "active"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${user.status === "active"
                                                        ? "bg-green-600 dark:bg-green-400"
                                                        : "bg-gray-600 dark:bg-gray-400"
                                                        }`}
                                                />
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>

                                        {/* Role Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {typeof user.role === 'string' ? user.role : user.role.name}
                                        </td>

                                        {/* Email Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {user.email}
                                        </td>

                                        {/* Contact Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {user.contacts && user.contacts.length > 0 ? (
                                                (() => {
                                                    const primary = user.contacts.find(c => c.is_primary) || user.contacts[0];
                                                    return (
                                                        <div className="flex items-center gap-2">
                                                            {primary.contact_type === 'whatsapp' ? (
                                                                <MessageCircle className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <Phone className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span>{primary.contact_value}</span>
                                                        </div>
                                                    );
                                                })()
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
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
                                                    onClick={() => setResetPasswordUser({ id: user.id, name: user.full_name })}
                                                    className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Reset Password"
                                                >
                                                    <Key className="w-4 h-4" />
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

            {/* Add User Modal */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    // Reload users after successful creation
                    loadUsers();
                    loadTotalCount();
                    addToast({
                        type: "success",
                        title: "Successfully added user",
                        message: "The new user has been created and can now access the system.",
                        duration: 5000,
                    });
                }}
            />

            {/* Edit User Modal */}
            {editingUser && (
                <EditUserModal
                    isOpen={!!editingUser}
                    onClose={() => setEditingUser(null)}
                    onSuccess={() => {
                        loadUsers();
                        setEditingUser(null);
                        addToast({
                            type: "success",
                            title: "Successfully updated user",
                            message: "User details have been updated successfully.",
                            duration: 5000,
                        });
                    }}
                    user={editingUser}
                />
            )}

            {/* Delete User Modal */}
            <DeleteUserModal
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={confirmDelete}
                userName={deletingUser?.full_name || ""}
                isLoading={isDeleteLoading}
            />

            {/* Reset Password Modal */}
            <ResetPasswordModal
                isOpen={!!resetPasswordUser}
                onClose={() => setResetPasswordUser(null)}
                userId={resetPasswordUser?.id || null}
                userName={resetPasswordUser?.name || ""}
            />
        </div>
    );
}
