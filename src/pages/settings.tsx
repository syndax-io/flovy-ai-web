"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import { sessionManager } from "../lib/sessionManager";
import { PRESET_CONFIGS } from "../config/session";

export default function Settings() {
  const [currentConfig, setCurrentConfig] = useState(
    sessionManager.getConfig()
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // Determine which preset is currently active
  useEffect(() => {
    const config = sessionManager.getConfig();
    setCurrentConfig(config);

    // Find which preset matches the current config
    const matchingPreset = Object.entries(PRESET_CONFIGS).find(
      ([, preset]) =>
        preset.timeoutMinutes === config.timeoutMinutes &&
        preset.resetOnActivity === config.resetOnActivity &&
        preset.warningThresholdMinutes === config.warningThresholdMinutes
    );

    setSelectedPreset(matchingPreset ? matchingPreset[0] : "");
  }, []);

  const handlePresetChange = (presetName: keyof typeof PRESET_CONFIGS) => {
    sessionManager.usePreset(presetName);
    setSelectedPreset(presetName);
    setCurrentConfig(sessionManager.getConfig());
  };

  const getPresetColor = (presetName: string) => {
    switch (presetName) {
      case "HIGH_SECURITY":
        return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20";
      case "STANDARD":
        return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20";
      case "DEVELOPMENT":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20";
      case "NO_TIMEOUT":
        return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20";
      default:
        return "border-gray-200 dark:border-gray-700";
    }
  };

  const getPresetTextColor = (presetName: string) => {
    switch (presetName) {
      case "HIGH_SECURITY":
        return "text-red-900 dark:text-red-100";
      case "STANDARD":
        return "text-blue-900 dark:text-blue-100";
      case "DEVELOPMENT":
        return "text-green-900 dark:text-green-100";
      case "NO_TIMEOUT":
        return "text-gray-900 dark:text-gray-100";
      default:
        return "text-gray-900 dark:text-gray-100";
    }
  };

  const getPresetDescriptionColor = (presetName: string) => {
    switch (presetName) {
      case "HIGH_SECURITY":
        return "text-red-700 dark:text-red-300";
      case "STANDARD":
        return "text-blue-700 dark:text-blue-300";
      case "DEVELOPMENT":
        return "text-green-700 dark:text-green-300";
      case "NO_TIMEOUT":
        return "text-gray-700 dark:text-gray-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Configure your session preferences and app settings
            </p>

            {/* Session Configuration Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Session Configuration
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose how long your session should stay active and when to show
                warnings.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PRESET_CONFIGS).map(([presetName, preset]) => (
                  <button
                    key={presetName}
                    onClick={() =>
                      handlePresetChange(
                        presetName as keyof typeof PRESET_CONFIGS
                      )
                    }
                    className={`p-6 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                      selectedPreset === presetName
                        ? `${getPresetColor(
                            presetName
                          )} ring-2 ring-blue-500 ring-opacity-50`
                        : `${getPresetColor(presetName)} hover:scale-105`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className={`font-semibold ${getPresetTextColor(
                          presetName
                        )}`}
                      >
                        {presetName.replace("_", " ")}
                      </h3>
                      {selectedPreset === presetName && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p
                        className={`text-sm ${getPresetDescriptionColor(
                          presetName
                        )}`}
                      >
                        <strong>Timeout:</strong>{" "}
                        {preset.timeoutMinutes === 0
                          ? "No timeout"
                          : `${preset.timeoutMinutes} minutes`}
                      </p>
                      <p
                        className={`text-sm ${getPresetDescriptionColor(
                          presetName
                        )}`}
                      >
                        <strong>Warning:</strong>{" "}
                        {preset.warningThresholdMinutes === 0
                          ? "None"
                          : `${preset.warningThresholdMinutes} minutes before expiry`}
                      </p>
                      <p
                        className={`text-sm ${getPresetDescriptionColor(
                          presetName
                        )}`}
                      >
                        <strong>Activity Reset:</strong>{" "}
                        {preset.resetOnActivity ? "Yes" : "No"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Current Configuration Display */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Current Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Timeout:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {currentConfig.timeoutMinutes === 0
                        ? "No timeout"
                        : `${currentConfig.timeoutMinutes} minutes`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Warning:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {currentConfig.warningThresholdMinutes === 0
                        ? "None"
                        : `${currentConfig.warningThresholdMinutes} minutes`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Activity Reset:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {currentConfig.resetOnActivity ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings Sections */}
            <div className="space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Account Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Account management features coming soon...
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Notifications
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Notification preferences coming soon...
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Privacy & Security
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Privacy and security settings coming soon...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
