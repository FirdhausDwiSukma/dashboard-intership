export default function UsersPage() {
    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
        { id: 4, name: "Alice Williams", email: "alice@example.com", role: "Moderator", status: "Active" },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your users and permissions
                    </p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === "Active"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button className="text-red-600 dark:text-red-400 hover:underline mr-3">Edit</button>
                                    <button className="text-gray-600 dark:text-gray-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
