"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme() {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        console.log("🔍 [useTheme] Hook initialized");

        // ONLY check local storage, NEVER check system preference
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        console.log("📦 [useTheme] Stored theme:", storedTheme);

        if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            console.log("✅ [useTheme] Applied stored theme:", storedTheme);
        } else {
            // Default to light mode, completely ignore system preference
            console.log("💡 [useTheme] No stored theme, defaulting to LIGHT (ignoring system)");
            setTheme("light");
            document.documentElement.classList.remove("dark");
        }

        console.log("📋 [useTheme] HTML classes:", document.documentElement.className);
        console.log("🎨 [useTheme] Has .dark class:", document.documentElement.classList.contains("dark"));
    }, []);


    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        console.log("🔄 [toggleTheme] Switching from", theme, "to", newTheme);

        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        // Use explicit add/remove instead of toggle for clarity
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        console.log("✅ [toggleTheme] Theme updated to:", newTheme);
        console.log("📋 [toggleTheme] HTML classes:", document.documentElement.className);
        console.log("🎨 [toggleTheme] Has .dark class:", document.documentElement.classList.contains("dark"));
    };


    return { theme, toggleTheme };
}
