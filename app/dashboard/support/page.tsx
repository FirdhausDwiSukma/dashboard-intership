export default function SupportPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Get help and contact support
                </p>
            </div>

            {/* Support Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Documentation</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Browse our comprehensive guides
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Chat with our support team
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📧</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Support</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Send us an email
                    </p>
                </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Support</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            placeholder="What do you need help with?"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Message
                        </label>
                        <textarea
                            rows={5}
                            placeholder="Describe your issue..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
