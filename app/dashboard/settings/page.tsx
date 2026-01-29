export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-1">
                        {["General", "Security", "Notifications", "Appearance", "Privacy"].map((item) => (
                            <button
                                key={item}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Account Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Admin User"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="admin@dashtern.com"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Language
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                        <option>English</option>
                                        <option>Indonesia</option>
                                        <option>Spanish</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                                        Save Changes
                                    </button>
                                    <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
