import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { isSessionActive, getCurrentSessionName, listSessions } from '../../dist/lib/zellij.js';

describe('zellij session activity detection', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    // Clear environment variables
    delete process.env.ZELLIJ_SESSION_NAME;
    delete process.env.ZELLIJ;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('isSessionActive', () => {
    it('should return true when session matches current session name', () => {
      // Set environment variable to simulate being inside zellij
      process.env.ZELLIJ_SESSION_NAME = 'test-session';
      
      const result = isSessionActive('test-session');
      
      assert.strictEqual(result, true);
    });

    it('should return false when session does not match current session name', () => {
      // Set environment variable to simulate being inside zellij with different session
      process.env.ZELLIJ_SESSION_NAME = 'other-session';
      
      const result = isSessionActive('test-session');
      
      assert.strictEqual(result, false);
    });

    it('should return false for non-existent session when no current session', () => {
      // No ZELLIJ_SESSION_NAME set, so getCurrentSessionName returns null
      // This will fall back to checking listSessions, which will return empty array in test
      const result = isSessionActive('non-existent-session');
      
      assert.strictEqual(result, false);
    });
  });

  describe('integration with existing functions', () => {
    it('should work correctly with getCurrentSessionName', () => {
      process.env.ZELLIJ_SESSION_NAME = 'my-session';
      
      const currentSession = getCurrentSessionName();
      const isActive = isSessionActive('my-session');
      
      assert.strictEqual(currentSession, 'my-session');
      assert.strictEqual(isActive, true);
    });

    it('should return null when not inside zellij', () => {
      // No ZELLIJ_SESSION_NAME set
      const currentSession = getCurrentSessionName();
      
      assert.strictEqual(currentSession, null);
    });
  });
});