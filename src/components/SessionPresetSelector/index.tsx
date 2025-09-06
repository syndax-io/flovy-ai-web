"use client";

import React from "react";
import { sessionManager } from "../../lib/sessionManager";
import { PRESET_CONFIGS } from "../../config/session";

const SessionPresetSelector: React.FC = () => {
  const handlePresetChange = (presetName: keyof typeof PRESET_CONFIGS) => {
    sessionManager.usePreset(presetName);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Session Configuration
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Choose a session preset to configure timeout behavior:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handlePresetChange("HIGH_SECURITY")}
          className="p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <h4 className="font-semibold text-red-900 dark:text-red-100">
            High Security
          </h4>
          <p className="text-sm text-red-700 dark:text-red-300">
            {PRESET_CONFIGS.HIGH_SECURITY.timeoutMinutes} min timeout
          </p>
          <p className="text-xs text-red-600 dark:text-red-400">
            Warning at {PRESET_CONFIGS.HIGH_SECURITY.warningThresholdMinutes}{" "}
            min
          </p>
        </button>

        <button
          onClick={() => handlePresetChange("STANDARD")}
          className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
            Standard
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {PRESET_CONFIGS.STANDARD.timeoutMinutes} min timeout
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Warning at {PRESET_CONFIGS.STANDARD.warningThresholdMinutes} min
          </p>
        </button>

        <button
          onClick={() => handlePresetChange("DEVELOPMENT")}
          className="p-4 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          <h4 className="font-semibold text-green-900 dark:text-green-100">
            Development
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            {PRESET_CONFIGS.DEVELOPMENT.timeoutMinutes} min timeout
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">
            Warning at {PRESET_CONFIGS.DEVELOPMENT.warningThresholdMinutes} min
          </p>
        </button>

        <button
          onClick={() => handlePresetChange("NO_TIMEOUT")}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            No Timeout
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            No automatic logout
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Manual logout only
          </p>
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Current Config:</strong>{" "}
          {sessionManager.getConfig().timeoutMinutes} min timeout,
          {sessionManager.getConfig().resetOnActivity
            ? " activity resets timer"
            : " no activity reset"}
        </p>
      </div>
    </div>
  );
};

export default SessionPresetSelector;
