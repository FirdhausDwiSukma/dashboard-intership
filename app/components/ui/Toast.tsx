"use client";

import React, { useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { ToastData } from "@/app/types/toast";

interface ToastItemProps {
    toast: ToastData;
    onRemove: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    useEffect(() => {
        if (toast.duration) {
            const timer = setTimeout(() => {
                onRemove(toast.id);
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast, onRemove]);

    const getIcon = () => {
        switch (toast.type) {
            case "success":
                return <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500" />;
            case "error":
                return <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />;
            case "warning":
                return <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />;
            case "info":
            default:
                return <Info className="w-6 h-6 text-blue-600 dark:text-blue-500" />;
        }
    };

    const getIconBg = () => {
        switch (toast.type) {
            case "success":
                return "bg-green-100 dark:bg-green-900/30";
            case "error":
                return "bg-red-100 dark:bg-red-900/30";
            case "warning":
                return "bg-yellow-100 dark:bg-yellow-900/30";
            case "info":
            default:
                return "bg-blue-100 dark:bg-blue-900/30";
        }
    };

    return (
        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl transition-all duration-300 animate-in slide-in-from-top-5 fade-in">
            <div className="p-4">
                <div className="flex items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className={`rounded-full p-2 flex items-center justify-center ${getIconBg()}`}>
                            {getIcon()}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {toast.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {toast.message}
                        </p>
                        <div className="mt-3 flex space-x-7">
                            {toast.action && (
                                <button
                                    type="button"
                                    onClick={toast.action.onClick}
                                    className="rounded-md bg-white dark:bg-transparent text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                >
                                    {toast.action.label}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            type="button"
                            className="inline-flex rounded-md bg-white dark:bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            onClick={() => onRemove(toast.id)}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
