/**
 * Reusable input field component
 * Presentation layer - UI component
 */

"use client";

import React from "react";

interface InputFieldProps {
    label: string;
    type: "text" | "password";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    type,
    value,
    onChange,
    placeholder,
    error,
    icon,
}) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200
            ${icon ? "pl-12" : ""}
            ${error
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-gray-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        }
            outline-none
            placeholder:text-gray-400
            text-gray-900
          `}
                />
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};
