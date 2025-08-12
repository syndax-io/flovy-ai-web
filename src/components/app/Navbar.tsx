"use client";

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../web/Logo";
import ThemeToggle from "../web/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Logout
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
