"use client";

import { useTheme } from "@/app/hooks/useTheme";

export function DebugPanel() {
    const { theme } = useTheme();

    return (
        <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500 p-4 rounded-lg shadow-lg text-xs font-mono z-50">
            <div className="font-bold mb-2">🐛 Debug Panel</div>
            <div>Current Theme: <strong>{theme}</strong></div>
            <div>Dark Class: <strong>{typeof document !== 'undefined' ? String(document.documentElement.classList.contains('dark')) : 'N/A'}</strong></div>
            <div className="mt-2 pt-2 border-t border-yellow-500">
                <div className="text-gray-900 dark:text-white">
                    This text should change color
                </div>
                <div className="bg-white dark:bg-black p-2 mt-1">
                    BG should toggle
                </div>
            </div>
        </div>
    );
}
