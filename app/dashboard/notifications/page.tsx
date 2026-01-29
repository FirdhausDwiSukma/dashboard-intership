export default function NotificationsPage() {
    const notifications = [
        { id: 1, title: "New user registered", message: "John Doe just created an account", time: "2 minutes ago", read: false },
        { id: 2, title: "Payment received", message: "You received a payment of $50.00", time: "1 hour ago", read: false },
        { id: 3, title: "System update", message: "System will be maintained tonight", time: "3 hours ago", read: true },
        { id: 4, title: "New comment", message: "Someone commented on your post", time: "1 day ago", read: true },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        View and manage your notifications
                    </p>
                </div>
                <button className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    Mark all as read
                </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-primary-500 transition-colors cursor-pointer ${!notif.read ? "border-l-4 border-l-primary-500" : ""
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{notif.title}</h3>
                                    {!notif.read && (
                                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notif.time}</p>
                            </div>
                            <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State (if no notifications) */}
            {/* <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-400 dark:text-gray-500">No new notifications</p>
            </div> */}
        </div>
    );
}
