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
  admin: RateAdmin,
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
  if (opts.userId) {
    if (!(await underKey(admin, `${opts.prefix}:u:${opts.userId}`, opts.userMax, opts.userWindowSeconds))) {
      return false;
    }
  }
  if (opts.ip && opts.ip !== '0.0.0.0') {
    const ipMax = opts.ipMax ?? opts.userMax * 3;
    const ipWindow = opts.ipWindowSeconds ?? opts.userWindowSeconds;
    if (!(await underKey(admin, `${opts.prefix}:ip:${opts.ip}`, ipMax, ipWindow))) {
      return false;
    }
  }
  return true;
}
