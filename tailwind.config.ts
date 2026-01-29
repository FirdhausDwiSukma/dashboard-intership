import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class", // Enable class-based dark mode
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#d94333',
                    600: '#c23b2e',
                    700: '#a83329',
                    800: '#8e2b24',
                    900: '#74231f',
                },
            },
        },
    },
    plugins: [],
};

export default config;
