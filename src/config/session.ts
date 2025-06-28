// Session Configuration
// Modify these values to customize your session behavior

export const SESSION_CONFIG = {
  // Session timeout in minutes (default: 30 minutes)
  timeoutMinutes: 30,
  
  // How often to check for activity in seconds (default: 60 seconds)
  checkIntervalSeconds: 60,
  
  // Whether to reset timer on user activity (default: true)
  resetOnActivity: true,
  
  // Warning threshold in minutes (show warning when this much time is left)
  warningThresholdMinutes: 5,
  
  // Events that count as user activity
  activityEvents: [
    'mousedown',
    'mousemove', 
    'keypress',
    'scroll',
    'touchstart',
    'click',
    'focus'
  ]
} as const;

// Session persistence options
export const PERSISTENCE_OPTIONS = {
  // LOCAL: Persists across browser sessions (default)
  LOCAL: 'browserLocalPersistence',
  
  // SESSION: Persists only for current session
  SESSION: 'browserSessionPersistence',
  
  // MEMORY: No persistence (cleared on page refresh)
  MEMORY: 'inMemoryPersistence'
} as const;

// Recommended configurations for different use cases
export const PRESET_CONFIGS = {
  // High security - short sessions
  HIGH_SECURITY: {
    timeoutMinutes: 15,
    checkIntervalSeconds: 60,
    resetOnActivity: true,
    warningThresholdMinutes: 3
  },
  
  // Standard office use
  STANDARD: {
    timeoutMinutes: 30,
    checkIntervalSeconds: 60,
    resetOnActivity: true,
    warningThresholdMinutes: 5
  },
  
  // Long sessions for development
  DEVELOPMENT: {
    timeoutMinutes: 120, // 2 hours
    checkIntervalSeconds: 60,
    resetOnActivity: true,
    warningThresholdMinutes: 10
  },
  
  // No timeout (not recommended for production)
  NO_TIMEOUT: {
    timeoutMinutes: 0, // Disabled
    checkIntervalSeconds: 60,
    resetOnActivity: false,
    warningThresholdMinutes: 0
  }
} as const; 