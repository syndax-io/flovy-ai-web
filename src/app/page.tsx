import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 px-4 py-24 text-center">
        {/* Logo Placeholder */}
        <div className="mb-6">
          <Image
            src="/flovy-logo.svg"
            alt="flovy.ai Logo"
            width={120}
            height={120}
            className="mx-auto"
            priority
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          flovy.ai
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          An AI-powered productivity assistant that helps you plan your day and
          understands you.
        </p>
        <a
          href="#early-access"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Get Early Access
        </a>
      </header>

      {/* Product Description Section */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
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
        <a
          id="early-access"
          href="mailto:hello@flovy.ai?subject=Early%20Access%20Request"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
        >
          Request Early Access
        </a>
        <p className="mt-6 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} flovy.ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
