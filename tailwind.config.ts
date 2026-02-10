/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                outfit: ["var(--font-outfit)", "Outfit", "sans-serif"],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#6366f1",
                    foreground: "#ffffff",
                },
                success: "#22c55e",
                warning: "#f59e0b",
                error: "#ef4444",
                chart: {
                    orange: "#f97316",
                    green: "#22c55e",
                }
            },
        },
    },
    plugins: [],
};
