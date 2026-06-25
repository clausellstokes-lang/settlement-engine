/** @vitest-environment jsdom */
/**
 * aiAccessTokenSafe.test.js
 *
 * getAccessTokenSafe (src/lib/ai.js) hardening:
 *   - a token that lapsed within a small skew grace (~30s) is still served from
 *     the localStorage fallback rather than rejected outright;
 *   - when nothing usable is cached, the fallback attempts ONE bounded refresh
 *     before failing, so an expired-but-refreshable session doesn't surface a
 *     spurious "not signed in";
 *   - a token expired well past the grace (and unrecoverable) is still rejected.
 *
 * jsdom gives us a real localStorage so we can exercise the persisted-token path.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const auth = vi.hoisted(() => ({
  getSession: vi.fn(async () => ({ data: { session: null } })),
  refreshSession: vi.fn(async () => ({ data: { session: null } })),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { auth },
}));

import { generateNarrative } from '../../src/lib/ai.js';

const settlement = { id: 's1', name: 'Ashford', institutions: [] };

// The LS key ai.js derives from VITE_SUPABASE_URL — derive the same here.
function authTokenKey() {
  try {
    const host = new URL(import.meta.env.VITE_SUPABASE_URL).host;
    const ref = host.split('.')[0];
    return ref ? `sb-${ref}-auth-token` : null;
  } catch { return null; }
}

function ndjsonResponse(lines) {
  const encoder = new TextEncoder();
  const body = lines.map((l) => JSON.stringify(l)).join('\n') + '\n';
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(encoder.encode(body)); controller.close(); },
  });
  return { ok: true, status: 200, text: async () => '', body: stream };
}

beforeEach(() => {
  auth.getSession.mockResolvedValue({ data: { session: null } });
  auth.refreshSession.mockResolvedValue({ data: { session: null } });
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('getAccessTokenSafe — skew tolerance and refresh fallback', () => {
  test('a just-expired token (within the skew grace) is still served from the LS fallback', async () => {
    const key = authTokenKey();
    expect(key).toBeTruthy();
    // expires_at 5s in the PAST — inside the 30s grace, so still usable.
    const expAt = Math.floor(Date.now() / 1000) - 5;
    localStorage.setItem(key, JSON.stringify({ access_token: 'skewed-tok', expires_at: expAt }));

    let sentAuth = null;
    vi.stubGlobal('fetch', vi.fn((_url, opts) => {
      sentAuth = opts?.headers?.Authorization;
      return Promise.resolve(ndjsonResponse([
        { done: true, result: { thesis: 'ok' }, creditsRemaining: 1, type: 'narrative' },
      ]));
    }));

    await generateNarrative('narrative', settlement, 's1', {});
    // Before the fix this token was rejected outright (expAt*1000 < now) and the
    // call threw "Not signed in"; now the grace lets it ride through.
    expect(sentAuth).toBe('Bearer skewed-tok');
  });

  test('with no usable cached token, a bounded refresh is attempted before failing', async () => {
    auth.refreshSession.mockResolvedValue({ data: { session: { access_token: 'refreshed-tok' } } });

    let sentAuth = null;
    vi.stubGlobal('fetch', vi.fn((_url, opts) => {
      sentAuth = opts?.headers?.Authorization;
      return Promise.resolve(ndjsonResponse([
        { done: true, result: { thesis: 'ok' }, creditsRemaining: 1, type: 'narrative' },
      ]));
    }));

    await generateNarrative('narrative', settlement, 's1', {});
    expect(auth.refreshSession).toHaveBeenCalled();
    expect(sentAuth).toBe('Bearer refreshed-tok');
  });

  test('a token expired well past the grace, with no refresh, is still rejected', async () => {
    const key = authTokenKey();
    // 10 minutes in the past — far outside the grace.
    const expAt = Math.floor(Date.now() / 1000) - 600;
    localStorage.setItem(key, JSON.stringify({ access_token: 'stale-tok', expires_at: expAt }));
    auth.refreshSession.mockResolvedValue({ data: { session: null } });

    vi.stubGlobal('fetch', vi.fn());
    await expect(generateNarrative('narrative', settlement, 's1', {}))
      .rejects.toThrow(/not signed in/i);
    expect(fetch).not.toHaveBeenCalled();
  });
});
