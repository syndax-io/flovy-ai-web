"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Logo from "../components/web/Logo";
import LoginButton from "../components/web/LoginButton";
import FlovySlogan from "../components/app/FlovySlogan";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <nav className="flex justify-between items-center p-4">
        <div className="mb-6 flex items-center">
          <Logo className="mx-auto" width={50} height={50} />
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white ml-4">
            flovy.ai
          </span>
        </div>
      </nav>
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 px-4 py-24 text-center">
        {/* Logo Placeholder */}

        {/* Flovy Slogan Component */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <FlovySlogan />
        </div>
      </header>

      {/* Product Description Section */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
          Why flovy.ai?
        </h2>
        <ul className="space-y-6 text-gray-700 dark:text-gray-300 text-lg">
          <li>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Personalized Focus:
            </span>{" "}
            Connects to your calendar, goals, and past activities to give daily
            suggestions on what to focus on.
          </li>
          <li>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Holistic Tracking:
            </span>{" "}
            Keeps track of your habits, energy levels, and tasks you&apos;ve
            been avoiding helping you stay aligned with your long-term goals.
          </li>
          <li>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Evolving Intelligence:
            </span>{" "}
            The more you use it, the smarter it gets. flovy.ai learns from your
            behavior, refines its recommendations, and adapts to your working
            style and ambitions.
          </li>
          <li>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Beyond Task Management:
            </span>{" "}
            Not just a task manager. It&apos;s a thought partner, motivation
            coach, and daily strategist built with AI.
          </li>
        </ul>
      </section>

      {/* Call to Action Footer */}
      <footer className="mt-auto py-8 text-center bg-white/70 dark:bg-gray-900/70 backdrop-blur">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ready to work smarter, not harder?
        </p>
        <LoginButton>Sign in to Get Started</LoginButton>
        <p className="mt-6 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} flovy.ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
