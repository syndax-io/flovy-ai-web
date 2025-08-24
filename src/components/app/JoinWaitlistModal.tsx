"use client";

import React, { useState } from "react";
import Modal from "./Modal";

interface JoinWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const primaryChallengeOptions = [
  "Staying focused",
  "Prioritizing tasks",
  "Managing schedule",
  "Context switching",
];

const urgencyOptions = ["Immediately", "In 1–3 months", "Not urgent"];

const JoinWaitlistModal: React.FC<JoinWaitlistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [challenge, setChallenge] = useState<string>("");
  const [goal, setGoal] = useState("");
  const [urgency, setUrgency] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  const resetState = () => {
    setEmail("");
    setName("");
    setChallenge("");
    setGoal("");
    setUrgency("");
    setSubmitting(false);
    setSubmitted(false);
    setError("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, challenge, goal, urgency }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={submitted ? "You're on the list!" : "Join the Waitlist"}
      variant="blue"
    >
      {submitted ? (
        <div className="text-center py-6">
          <p className="text-gray-700 dark:text-gray-300">
            Thanks{name ? `, ${name}` : ""}! We'll email you when we’re ready.
          </p>
          <button
            onClick={handleClose}
            className="mt-6 inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              What’s your biggest challenge right now?
            </label>
            <select
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select one (optional)</option>
              {primaryChallengeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              What would you love our app to help you do?
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Keep it short (optional)"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              How soon do you want to start?
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select one (optional)</option>
              {urgencyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Short and sweet. We’ll never spam you.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-60"
            >
              {submitting ? "Joining…" : "Join Waitlist"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default JoinWaitlistModal;
