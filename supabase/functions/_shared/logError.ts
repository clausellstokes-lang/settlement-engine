/**
 * supabase/functions/_shared/logError.ts — structured error logging for the
 * money / AI trust-boundary edge functions (review B16 observability).
 *
 * WHY
 *   The money + AI paths (stripe-webhook, create-checkout, verify-single-dossier,
 *   generate-narrative / generate-chronicle) emit ad-hoc `console.error(...)` lines
 *   with inconsistent shapes, so a Supabase function-log search ("which user lost a
 *   refund?", "which webhook failed?") has to grep free text. This helper writes ONE
 *   structured JSON line per failure — `{ level, fn, user, error, ... }` — so the
 *   logs are greppable and alertable (a log drain can match on `level:"error"` +
 *   `fn:"stripe-webhook"` without a per-function parser).
 *
 * WHAT
 *   `logError(fn, user, error, extra?)` prints a single-line JSON object to
 *   console.error. It NEVER throws (a logging failure must never break the request)
 *   and NEVER serializes a full request/secret — the caller passes only the fields
 *   it wants surfaced (a message string, an id, a status).
 *
 * The line is intentionally a plain console.error so it lands in the existing
 * Supabase function-log pipeline with no new infra; the JSON shape is the contract
 * a future log drain / alert rule keys on.
 */

/** Normalize any thrown value to a plain message string (no stack, no PII). */
function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/**
 * Emit one structured error log line for a money/AI-path failure.
 *
 * @param fn    Short function identifier (e.g. "stripe-webhook").
 * @param user  The acting user id, or null when unauthenticated/unknown.
 * @param error The thrown value or a message string.
 * @param extra Optional extra non-secret fields to include (status, ids, etc.).
 */
export function logError(
  fn: string,
  user: string | null,
  error: unknown,
  extra: Record<string, unknown> = {},
): void {
  try {
    console.error(
      JSON.stringify({
        level: "error",
        fn,
        user: user ?? null,
        error: toMessage(error),
        ts: new Date().toISOString(),
        ...extra,
      }),
    );
  } catch {
    // A logging failure must never break the caller. Fall back to a plain line.
    console.error(`[${fn}] logError failed for user=${user}`);
  }
}
