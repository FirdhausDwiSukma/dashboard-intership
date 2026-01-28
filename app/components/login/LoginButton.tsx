/**
 * Login button component
 * Presentation layer - UI component
 */

"use client";

import React from "react";

interface LoginButtonProps {
    isLoading: boolean;
    onClick?: () => void;
    type?: "button" | "submit";
}

export const LoginButton: React.FC<LoginButtonProps> = ({
    isLoading,
    onClick,
    type = "submit",
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`
        w-full py-3.5 px-6 rounded-xl font-semibold text-white
        bg-gradient-to-r from-indigo-600 to-purple-600
        hover:from-indigo-700 hover:to-purple-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        transform transition-all duration-200
        ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"}
        shadow-lg hover:shadow-xl
        flex items-center justify-center gap-2
      `}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Memproses...</span>
                </>
            ) : (
                <span>Masuk</span>
            )}
        </button>
    );
};
