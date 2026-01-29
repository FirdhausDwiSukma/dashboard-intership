export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    View your dashboard analytics and insights
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">1,234</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">+12% from last month</p>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">$45,231</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">+23% from last month</p>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Sessions</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">573</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Current active users</p>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">3.2%</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">-2% from last month</p>
                </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Traffic Overview</h2>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <p className="text-gray-400">Chart placeholder - Add your chart library here</p>
                </div>
            </div>
        </div>
    );
}
