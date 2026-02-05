import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                ocean: {
                    deep: "#0a1628",
                    mid: "#0f2138",
                    surface: "#152742",
                },
                lobster: {
                    primary: "#ff4d4d",
                    light: "#ff6b6b",
                    dark: "#cc3d3d",
                },
                bioluminescent: {
                    DEFAULT: "#00d9ff",
                    dim: "#00b8d9",
                },
                pearl: {
                    DEFAULT: "#fafafa",
                    dim: "rgba(255, 255, 255, 0.7)",
                    muted: "rgba(255, 255, 255, 0.5)",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
            },
            animation: {
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                float: "float 4s ease-in-out infinite",
                swim: "swim 3s ease-in-out infinite",
            },
            keyframes: {
                "pulse-glow": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.6" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                swim: {
                    "0%": { transform: "translateX(0) rotate(0deg)" },
                    "25%": { transform: "translateX(5px) rotate(2deg)" },
                    "75%": { transform: "translateX(-5px) rotate(-2deg)" },
                    "100%": { transform: "translateX(0) rotate(0deg)" },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
