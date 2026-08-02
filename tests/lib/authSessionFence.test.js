import { describe, expect, it } from 'vitest';
import {
  authSessionIdentity,
  captureAuthSessionFence,
  isAuthSessionFenceCurrent,
} from '../../src/lib/authSessionFence.js';

function token(sessionId, marker) {
  const payload = globalThis.btoa(JSON.stringify({ session_id: sessionId, marker }));
  return `header.${payload}.signature`;
}

describe('auth session fence', () => {
  it('survives access-token refresh inside one logical session', () => {
    const before = {
      user: { id: 'user-1' },
      session: { access_token: token('logical-login-1', 'first') },
    };
    const refreshed = {
      user: { id: 'user-1' },
      session: { access_token: token('logical-login-1', 'refreshed') },
    };
    const fence = captureAuthSessionFence(before);
    expect(authSessionIdentity(before)).toBe('session:logical-login-1');
    expect(isAuthSessionFenceCurrent(fence, refreshed)).toBe(true);
  });

  it('rejects owner changes and same-owner re-login generations', () => {
    const fence = captureAuthSessionFence({
      user: { id: 'user-1' },
      session: { access_token: token('logical-login-1', 'first') },
    });
    expect(isAuthSessionFenceCurrent(fence, {
      user: { id: 'user-2' },
      session: { access_token: token('logical-login-1', 'same-token-session') },
    })).toBe(false);
    expect(isAuthSessionFenceCurrent(fence, {
      user: { id: 'user-1' },
      session: { access_token: token('logical-login-2', 'new-login') },
    })).toBe(false);
  });
});
