"use client";

import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { PRESET_CONFIGS, SESSION_CONFIG } from '../config/session';

interface SessionConfig {
  timeoutMinutes: number; // Session timeout in minutes
  checkIntervalSeconds: number; // How often to check for activity
  resetOnActivity: boolean; // Whether to reset timer on user activity
  warningThresholdMinutes: number; // Warning threshold in minutes
}

class SessionManager {
  private config: SessionConfig;
  private timeoutId: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private isActive: boolean = false;
  private isInitialized: boolean = false;

  constructor(config?: SessionConfig) {
    // Use preset config or default config
    this.config = config || SESSION_CONFIG;
    // Don't setup listeners immediately - wait for browser environment
  }

  private setupActivityListeners() {
    // Only setup listeners if we're in a browser environment
    if (typeof window === 'undefined' || this.isInitialized) return;
    
    if (this.config.resetOnActivity) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      events.forEach(event => {
        document.addEventListener(event, () => {
          this.resetTimer();
        }, { passive: true });
      });
    }
    
    this.isInitialized = true;
  }

  private resetTimer() {
    this.lastActivity = Date.now();
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    // Only set timeout if timeoutMinutes > 0
    if (this.config.timeoutMinutes > 0) {
      this.timeoutId = setTimeout(() => {
        this.handleSessionTimeout();
      }, this.config.timeoutMinutes * 60 * 1000);
    }
  }

  private handleSessionTimeout() {
    console.log('Session timeout - logging out user');
    this.isActive = false;
    signOut(auth);
  }

  public start() {
    if (!this.isActive) {
      this.isActive = true;
      // Setup listeners when starting (browser environment guaranteed)
      this.setupActivityListeners();
      this.resetTimer();
      console.log(`Session manager started - timeout: ${this.config.timeoutMinutes} minutes`);
    }
  }

  public stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isActive = false;
  }

  public updateConfig(newConfig: Partial<SessionConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (this.isActive) {
      this.resetTimer();
    }
  }

  public usePreset(presetName: keyof typeof PRESET_CONFIGS) {
    const preset = PRESET_CONFIGS[presetName];
    this.updateConfig(preset);
    console.log(`Switched to ${presetName} preset: ${preset.timeoutMinutes} minutes`);
  }

  public getTimeRemaining(): number {
    if (!this.isActive || !this.timeoutId || this.config.timeoutMinutes === 0) return 0;
    
    const elapsed = Date.now() - this.lastActivity;
    const remaining = (this.config.timeoutMinutes * 60 * 1000) - elapsed;
    return Math.max(0, remaining);
  }

  public getTimeRemainingMinutes(): number {
    return Math.ceil(this.getTimeRemaining() / (60 * 1000));
  }

  public getConfig(): SessionConfig {
    return { ...this.config };
  }
}

// Create default session manager instance with STANDARD preset
export const sessionManager = new SessionManager(PRESET_CONFIGS.STANDARD);

// Export the class for custom instances
export { SessionManager };
export type { SessionConfig }; 