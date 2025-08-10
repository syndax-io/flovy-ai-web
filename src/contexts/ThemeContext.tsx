"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme following Tailwind CSS v4 documentation pattern
    const root = document.documentElement;

    if (theme === "light") {
      // User explicitly chooses light mode
      localStorage.theme = "light";
      root.classList.remove("dark");
    } else if (theme === "dark") {
      // User explicitly chooses dark mode
      localStorage.theme = "dark";
      root.classList.add("dark");
    } else {
      // User explicitly chooses to respect the OS preference
      localStorage.removeItem("theme");
      // Check if dark mode should be enabled
      const shouldBeDark =
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      root.classList.toggle("dark", shouldBeDark);
    }

    // Update isDark state
    setIsDark(root.classList.contains("dark"));
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        const shouldBeDark =
          localStorage.theme === "dark" ||
          (!("theme" in localStorage) && e.matches);

        root.classList.toggle("dark", shouldBeDark);
        setIsDark(shouldBeDark);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
