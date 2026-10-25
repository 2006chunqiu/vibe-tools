/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070a09",
        surface: "#0c110f",
        panel: "#101713",
        lime: "#c9f36c",
        mint: "#7ef0c1",
        cyan: "#7ce7f4"
      },
      fontFamily: {
        display: ["Space Grotesk", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        sans: ["Space Grotesk", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        mono: ["SFMono-Regular", "Cascadia Code", "Consolas", "monospace"]
      },
      boxShadow: {
        glow: "0 0 60px -20px rgba(201, 243, 108, 0.35)",
        card: "0 30px 80px -45px rgba(0, 0, 0, 0.9)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        }
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite"
      }
    }
  },
  plugins: []
};
