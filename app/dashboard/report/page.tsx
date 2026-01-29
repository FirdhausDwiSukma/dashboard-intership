export default function ReportPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Generate and view your reports
                </p>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-red-500 transition-colors cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Report</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        View detailed sales analytics and trends
                    </p>
                    <button className="mt-4 text-red-600 dark:text-red-400 text-sm font-medium hover:underline">
                        Generate Report →
                    </button>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-red-500 transition-colors cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Activity</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Track user engagement and behavior
                    </p>
                    <button className="mt-4 text-red-600 dark:text-red-400 text-sm font-medium hover:underline">
                        Generate Report →
                    </button>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-red-500 transition-colors cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Report</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Complete financial overview and statements
                    </p>
                    <button className="mt-4 text-red-600 dark:text-red-400 text-sm font-medium hover:underline">
                        Generate Report →
                    </button>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Reports</h2>
                <div className="space-y-3">
                    {["Monthly Sales Report - January 2026", "User Activity Q4 2025", "Financial Summary 2025"].map((report, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{report}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Generated 2 days ago</p>
                            </div>
                            <button className="text-sm text-red-600 dark:text-red-400 hover:underline">Download</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
