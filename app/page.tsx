"use client";

import Link from "next/link";
import { useVantaBackground } from "@/app/hooks/useVantaBackground";

export default function Home() {
  const vantaRef = useVantaBackground("halo");

  return (
    <div ref={vantaRef} className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Dashtern - Dashboard Internship
        </h1>
        <p className="text-white font-medium mb-8">
          Selamat datang di dashboard internship
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#d94333] text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Masuk ke Dashboard
        </Link>
      </div>
    </div>
  );
}
