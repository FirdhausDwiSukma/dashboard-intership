/**
 * Main login form component
 * Presentation layer - composes smaller components
 */

"use client";

import React from "react";
import { useLoginForm } from "@/app/hooks/useLoginForm";
import { useVantaBackground } from "@/app/hooks/useVantaBackground";
import Image from "next/image";

export const LoginForm: React.FC = () => {
    const { formState, handlers } = useLoginForm();
    const vantaRef = useVantaBackground("halo");

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Dark Background with Logo and Branding */}
            <div
                ref={vantaRef}
                className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
            >
                {/* Light effect on top right - Optional, dapat di-hide jika vanta sudah cukup */}
                {/* <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" /> */}

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    {/* Logo */}
                    <div className="mb-8">
                        <Image
                            src="/favicon.ico"
                            alt="Logo"
                            width={120}
                            height={120}
                            className="mb-6"
                        />
                    </div>

                    {/* Branding Text */}
                    <h1 className="text-3xl font-bold mb-2">Selamat Datang di</h1>
                    <h2 className="text-4xl font-bold mb-4">Dashtern - Dashboard Internship</h2>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                        Sistem Management Data Internship
                        <br />
                        JADEK
                    </p>
                </div>
            </div>

            {/* Right Side - White Background with Login Form */}
            <div className="flex-1 flex items-center justify-center bg-white px-6 lg:px-16">
                <div className="w-full max-w-md">
                    {/* Mobile Logo - only show on small screens */}
                    <div className="lg:hidden mb-8 text-center">
                        <Image
                            src="/favicon.ico"
                            alt="Logo"
                            width={80}
                            height={80}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-2xl font-bold text-gray-900">SIRAMA</h2>
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-black mb-2">Login</h3>
                    </div>

                    {/* Form */}
                    <form onSubmit={handlers.handleSubmit} className="space-y-6">
                        {/* General Error */}
                        {formState.errors.general && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                <p className="text-sm text-red-800 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {formState.errors.general}
                                </p>
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={formState.username}
                                onChange={(e) => handlers.handleUsernameChange(e.target.value)}
                                placeholder="username"
                                className={`
                  w-full px-4 py-3 border-b-2 transition-all duration-200
                  ${formState.errors.username
                                        ? "border-red-400 bg-red-50"
                                        : "border-gray-300 focus:border-blue-500"
                                    }
                  outline-none bg-transparent
                  placeholder:text-gray-400
                  text-gray-900
                `}
                            />
                            {formState.errors.username && (
                                <p className="text-sm text-red-600">{formState.errors.username}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="password"
                                    value={formState.password}
                                    onChange={(e) => handlers.handlePasswordChange(e.target.value)}
                                    placeholder="••••••••"
                                    className={`
                    w-full px-4 py-3 border-b-2 transition-all duration-200
                    ${formState.errors.password
                                            ? "border-red-400 bg-red-50"
                                            : "border-gray-300 focus:border-blue-500"
                                        }
                    outline-none bg-transparent
                    placeholder:text-gray-400
                    text-gray-900
                  `}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {formState.errors.password && (
                                <p className="text-sm text-red-600">{formState.errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={formState.isLoading}
                            className={`
                w-full py-3 px-6 rounded-lg font-medium text-white
                bg-[#d94333] hover:bg-[#c73c2d]
                focus:outline-none focus:ring-2 focus:ring-[#d94333] focus:ring-offset-2
                transform transition-all duration-200
                ${formState.isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01] active:scale-[0.99]"}
                shadow-md hover:shadow-lg
                flex items-center justify-center gap-2
              `}
                        >
                            {formState.isLoading ? (
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
                                    <span>Login...</span>
                                </>
                            ) : (
                                <span>Login</span>
                            )}
                        </button>

                        {/* Kontak Helpdesk - Removed as requested */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">Dashtern - Dashboard Internship</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
