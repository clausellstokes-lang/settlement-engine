/**
 * supabase/functions/_shared/rateLimit.ts — per-user + per-IP fixed-window rate
 * gate built on the EXISTING `ingest_check_rate` RPC (migration 036 — the generic
 * keyed limiter already deployed and used by ingest-events / account-actions).
 *
 * Purpose: give a function that today has NO server-side limit a per-user +
 * per-IP ceiling WITHOUT a new migration. This reuses the existing limiter idiom
 * rather than inventing a second one (see the Wave-D rate-limit audit). A true
 * cross-instance token bucket (smooth refill, one table) would be stronger but is
 * a schema change — owner-gated; see docs/PERIMETER_RUNBOOK.md.
 *
 * FAIL CLOSED (mirrors ingest-events / account-actions / log-client-error): any
 * RPC error or thrown transport error, or either dimension at/over its limit,
 * returns false → the caller returns 429. Only a definite `data === true`
 * (under rate) on every CHECKED dimension returns true.
 *
 * Keys are FUNCTION-SCOPED via `prefix` so a function's buckets never collide
 * with another's — ingest-events already uses BARE `u:`/`d:`/`ip:` keys, so a
 * bare key here would share its bucket and cross-meter unrelated traffic. Use a
 * short, stable prefix per function (e.g. 'ccp' for create-customer-portal).
 *
 * HONEST LIMIT: `ingest_check_rate` is a fixed-WINDOW counter, not a smooth token
 * bucket — it resets on the window boundary, so a burst can straddle two windows
 * (up to ~2x the nominal rate across a boundary). It is the right migration-free
 * reuse for metering RARE, expensive, authed actions; it is not a precise burst
 * control. `x-forwarded-for` is client-spoofable (see requestMeta.ts) so the IP
 * dimension is advisory; `cf-connecting-ip` is the trustworthy edge value.
 */

/** The subset of a supabase-js client this module needs (keeps it stub-friendly). */
type RateAdmin = {
  rpc: (
    fn: string,
    args?: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: unknown }>;
  from?: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => PromiseLike<{
          data: { value?: unknown } | null;
          error: unknown;
        }>;
      };
    };
  };
};

/**
 * Shallow public boundary for generated Supabase clients. Expanding their full
 * recursive return types at each edge-function call site can exceed Deno's type
 * instantiation limit; callable rpc/from members retain the useful contract
 * without importing that recursive graph.
 */
type RateAdminBoundary = {
  rpc: (...args: never[]) => unknown;
  from?: (...args: never[]) => unknown;
};

/** One dimension: true only when the RPC returns a definite under-rate. */
async function underKey(
  admin: RateAdmin,
  key: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const { data, error } = await admin.rpc('ingest_check_rate', {
      p_key: key,
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    // Fail closed: only a definite `true` (under rate) proceeds; false OR a
    // non-null error OR a null/undefined result is treated as over-rate.
    return !error && data === true;
  } catch {
    return false; // fail closed on a thrown transport error
  }
}

/**
 * Check a per-user and a per-IP dimension against `ingest_check_rate`. Returns
 * true only when BOTH checked dimensions are under rate. The user dimension is
 * skipped when no userId is given; the IP dimension is skipped for a missing /
 * sentinel IP ('0.0.0.0') so unrelated callers do not share one bucket.
 *
 * @param admin a service-role client (ingest_check_rate is granted to service_role)
 */
export async function checkUserIpRate(
  admin: RateAdminBoundary,
  opts: {
    prefix: string;
    userId?: string | null;
    ip?: string | null;
    userMax: number;
    userWindowSeconds: number;
    ipMax?: number;
    ipWindowSeconds?: number;
  },
): Promise<boolean> {
  const rateAdmin = admin as RateAdmin;
  if (opts.userId) {
    if (!(await underKey(rateAdmin, `${opts.prefix}:u:${opts.userId}`, opts.userMax, opts.userWindowSeconds))) {
      return false;
    }
  }
  if (opts.ip && opts.ip !== '0.0.0.0') {
    const ipMax = opts.ipMax ?? opts.userMax * 3;
    const ipWindow = opts.ipWindowSeconds ?? opts.userWindowSeconds;
    if (!(await underKey(rateAdmin, `${opts.prefix}:ip:${opts.ip}`, ipMax, ipWindow))) {
      return false;
    }
  }
  return true;
}

// ── AI per-IP burst gate (Wave-D item 2) ─────────────────────────────────────
// The 11 AI edge functions meter spend with the per-USER daily limiter
// (consume_ai_generate_rate_limit, 079) which is deliberately FAIL-OPEN. This adds
// the missing PER-IP dimension on the cross-instance token bucket (migration 156,
// consume_token_bucket), and it is FAIL-CLOSED — the same posture as the hard spend
// cap, because it guards provider COGS: a definite over-limit is 429, and a
// limiter-INFRASTRUCTURE error is a 503 DENY, never a silent open.

/** Server-side fallbacks for migration 156's private ai_ip_rate_limit config:
 *  a 40-request burst refilling ~40/hour. Never client-overridable. */
const AI_IP_CAPACITY = 40;
const AI_IP_REFILL_PER_SEC = 40 / 3600; // ≈ 0.0111 tokens/sec → 40/hour sustained

export type AiIpRateResult = { ok: boolean; reason: 'under' | 'over' | 'error' | 'skipped' };

type AiIpRateConfig = { capacity: number; refillPerSec: number };

/**
 * Read the private operator-tunable row installed by migration 156. A missing
 * query seam (unit stubs), missing row, read error, or malformed value falls back
 * to the same conservative server defaults; it never disables the limiter.
 */
async function loadAiIpRateConfig(admin: RateAdmin): Promise<AiIpRateConfig> {
  const fallback = { capacity: AI_IP_CAPACITY, refillPerSec: AI_IP_REFILL_PER_SEC };
  if (typeof admin.from !== 'function') return fallback;

  try {
    const { data, error } = await admin
      .from('system_config')
      .select('value')
      .eq('key', 'ai_ip_rate_limit')
      .maybeSingle();
    if (error || !data?.value || typeof data.value !== 'object') return fallback;

    const value = data.value as Record<string, unknown>;
    const capacity = value.capacity;
    const refillPerSec = value.refill_per_sec;
    return {
      capacity: typeof capacity === 'number' && Number.isFinite(capacity) && capacity >= 1
        ? capacity
        : fallback.capacity,
      refillPerSec: typeof refillPerSec === 'number' && Number.isFinite(refillPerSec) && refillPerSec >= 0
        ? refillPerSec
        : fallback.refillPerSec,
    };
  } catch {
    return fallback;
  }
}

/**
 * Consume one token from the caller's per-IP AI bucket. FAIL-CLOSED on a limiter
 * infra error ('error' → the caller returns 503). SKIPS (ok:true, 'skipped')
 * when there is no real client IP: production edge traffic always carries
 * cf-connecting-ip, so the '0.0.0.0' sentinel only appears locally / in tests,
 * where the gate must be inert (no RPC call at all).
 *
 * @param admin a service-role client (consume_token_bucket is service_role-only)
 */
export async function checkAiIpRate(
  admin: RateAdmin,
  ip: string | null | undefined,
  opts?: { capacity?: number; refillPerSec?: number },
): Promise<AiIpRateResult> {
  if (!ip || ip === '0.0.0.0') return { ok: true, reason: 'skipped' };
  const config = await loadAiIpRateConfig(admin);
  const capacity = opts?.capacity ?? config.capacity;
  const refillPerSec = opts?.refillPerSec ?? config.refillPerSec;
  try {
    const { data, error } = await admin.rpc('consume_token_bucket', {
      p_key: `aiip:${ip}`,
      p_capacity: capacity,
      p_refill_per_sec: refillPerSec,
      p_cost: 1,
    });
    if (error) return { ok: false, reason: 'error' };            // fail-CLOSED: infra error → 503
    const allowed = (data as { allowed?: boolean } | null)?.allowed;
    if (allowed === true) return { ok: true, reason: 'under' };
    if (allowed === false) return { ok: false, reason: 'over' }; // definite over-limit → 429
    return { ok: false, reason: 'error' };                        // unexpected shape → fail-closed
  } catch {
    return { ok: false, reason: 'error' };                        // thrown transport error → fail-closed
  }
}

/**
 * Convenience wrapper for the 11 AI call sites: runs checkAiIpRate and returns a
 * ready-to-return 429 (over) / 503 (infra error) Response, or null to proceed.
 * The 503 copy mirrors the AI spend-cap idiom ("temporarily unavailable, no
 * credits charged"). Keeps each call site to two lines.
 */
export async function aiIpRateGuard(
  // checkAiIpRate itself stays typed against the exact result shapes; this
  // boundary only prevents call-site expansion of Supabase's recursive client.
  admin: RateAdminBoundary,
  ip: string | null | undefined,
  corsHeaders: Record<string, string>,
): Promise<Response | null> {
  const r = await checkAiIpRate(admin as RateAdmin, ip);
  if (r.ok) return null;
  const status = r.reason === 'over' ? 429 : 503;
  const error = r.reason === 'over'
    ? 'Too many AI requests from your network right now. Please wait a moment and try again.'
    : 'The AI service is briefly unavailable. Please try again in a moment. No credits were charged.';
  return new Response(
    JSON.stringify({ error }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
}
