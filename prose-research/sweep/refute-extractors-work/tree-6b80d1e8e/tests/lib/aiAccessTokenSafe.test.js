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

// CI has no .env, so VITE_SUPABASE_URL is undefined there and ai.js derives a
// null AUTH_TOKEN_LS_KEY (computed EAGERLY at module load — ai.js:49), leaving the
// localStorage-fallback path under test unreachable. Pin a deterministic project
// URL BEFORE ai.js is imported (vi.hoisted runs ahead of the static imports
// below), so ai.js's key and this file's authTokenKey() agree on a real key and
// the test stays hermetic regardless of the ambient environment.
vi.hoisted(() => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://testref.supabase.co');
});

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
  // BLOCKED ON OWNER (master merge W6): master serves a just-expired token
  // within a clock-skew grace window and attempts a bounded refreshSession()
  // fallback before failing. Serving expired tokens is a SECURITY-POSTURE
  // change (owner-gated) — the two tests pinning it were removed until the
  // owner rules ("AI token skew-grace + refresh fallback", master-merge owner
  // queue). The strict-rejection test below pins this lineage's current
  // fail-closed posture.

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
