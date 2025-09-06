"use client";

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo";
import ThemeToggle from "../ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const { user, logout, timeRemaining } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Logo className="w-8 h-8 mr-3" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                router.pathname === "/dashboard"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className={`text-sm font-medium transition-colors ${
                router.pathname === "/settings"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {user && (
              <>
                {/* Session Timeout Warning */}
                {timeRemaining > 0 && timeRemaining <= 5 && (
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                    <span className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                      {timeRemaining} min
                    </span>
                  </div>
                )}

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                    {user.displayName || user.email}
                  </span>
                </div>

                {/* Settings Icon */}
                <Link
                  href="/settings"
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Settings"
                >
                  <SettingsIcon className="w-5 h-5" />
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-2"
                >
                  <LogoutIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
