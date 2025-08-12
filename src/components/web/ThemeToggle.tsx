"use client";

import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  return (
    <div className="p-1 rounded-full bg-gray-50 dark:bg-gray-700 inline-flex space-x-1">
      <div className="relative">
        <input
          className="absolute h-0 w-0 opacity-0"
          id="light"
          name="theme"
          type="radio"
          value="light"
          checked={theme === "light"}
          onChange={() => handleThemeChange("light")}
        />
        <label
          className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
            theme === "light"
              ? "bg-blue-500 text-white"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
          htmlFor="light"
        >
          <span className="material-icons text-sm">light_mode</span>
        </label>
      </div>

      <div className="relative">
        <input
          className="absolute h-0 w-0 opacity-0"
          id="dark"
          name="theme"
          type="radio"
          value="dark"
          checked={theme === "dark"}
          onChange={() => handleThemeChange("dark")}
        />
        <label
          className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
            theme === "dark"
              ? "bg-blue-500 text-white"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
          htmlFor="dark"
        >
          <span className="material-icons text-sm">dark_mode</span>
        </label>
      </div>

      <div className="relative">
        <input
          className="absolute h-0 w-0 opacity-0"
          id="system"
          name="theme"
          type="radio"
          value="system"
          checked={theme === "system"}
          onChange={() => handleThemeChange("system")}
        />
        <label
          className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
            theme === "system"
              ? "bg-blue-500 text-white"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
          htmlFor="system"
        >
          <span className="material-icons text-sm">devices</span>
        </label>
      </div>
    </div>
  );
};

export default ThemeToggle;
