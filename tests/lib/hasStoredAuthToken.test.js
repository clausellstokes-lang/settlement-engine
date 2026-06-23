/** @vitest-environment jsdom */
/**
 * hasStoredAuthToken.test.js — the synchronous "is there a persisted session?"
 * check the root gate uses to route logged-out visitors to the landing without
 * awaiting the async session restore. Supabase writes the token under
 * `sb-<ref>-auth-token` (+ chunked `.0/.1` variants) in localStorage (remember
 * me) or sessionStorage (session-only).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { hasStoredAuthToken } from '../../src/lib/supabase.js';

describe('hasStoredAuthToken', () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

  it('is false when no auth token is stored (fresh / logged-out visitor)', () => {
    localStorage.setItem('settlementforge', '{}');
    localStorage.setItem('sf_some_pref', '1');
    expect(hasStoredAuthToken()).toBe(false);
  });

  it('detects a remember-me token in localStorage', () => {
    localStorage.setItem('sb-uhozyhcdccbhigvlacdu-auth-token', '{"access_token":"x"}');
    expect(hasStoredAuthToken()).toBe(true);
  });

  it('detects a session-only token in sessionStorage (incl. chunked variants)', () => {
    sessionStorage.setItem('sb-uhozyhcdccbhigvlacdu-auth-token.0', 'chunk-0');
    expect(hasStoredAuthToken()).toBe(true);
  });
});
