"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ToastData, ToastContextType } from "@/app/types/toast";
import { ToastItem } from "@/app/components/ui/Toast";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = useCallback((toast: Omit<ToastData, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastData = { ...toast, id };
        setToasts((prev) => [newToast, ...prev]); // Add to top
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex flex-col items-center sm:items-end px-4 py-6 sm:p-6 z-[100] gap-4"
            >
                {/* Position: top-right via items-end + flex-col */}
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
