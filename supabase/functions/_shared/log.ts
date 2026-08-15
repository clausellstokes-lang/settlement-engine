/**
 * supabase/functions/_shared/log.ts — the redacting structured logger for the edge
 * functions (A+ backend.2/3; security-2).
 *
 * WHY
 *   Edge-function logs land in the Supabase function-log pipeline and any attached log
 *   drain. A raw `console.error(err)` or a spread `...extra` can carry an email, IP, or
 *   bearer token in the clear — and PII scrubbing cannot be left to per-call discipline
 *   across 100+ call sites. `redact()` is the single policy chokepoint: emails, IPv4/IPv6
 *   addresses, and bearer / JWT tokens are masked BY CONSTRUCTION before a line is emitted.
 *
 * WHAT
 *   - `redact(value)`        — stringify + mask any value's PII. Used by _shared/logError.ts
 *                              so its `error` and `extra` fields are scrubbed by policy.
 *   - `redactFields(fields)` — redact the string leaves of a flat log-fields object.
 *   - `logSafe(level, fn, fields)` — emit one structured, redacted JSON log line.
 *
 * Import-free by design (pure string ops) so it is safe in the Deno edge runtime AND
 * unit-testable from the node/vitest suite (tests/security/edgeLogRedaction.test.js).
 *
 * INCREMENTAL MIGRATION (deliberately deferred, documented — not a bug to re-find): the
 * ~100 pre-existing raw `console.*` sites migrate to logSafe()/redact() over time. The
 * CI grep guard in scripts/edgeLogGuard.mjs (wired into scripts/validate-edge-functions.mjs)
 * blocks any NEW console.* line that embeds a literal email, so the surface cannot grow
 * while the backlog burns down.
 * @enforced-by scripts/edgeLogGuard.mjs + tests/security/edgeLogRedaction.test.js
 */

// ── redaction patterns (highest-risk PII in a log line) ──────────────────────
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const IPV4_RE = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
const IPV6_RE = /\b(?:[A-Fa-f0-9]{1,4}:){3,7}[A-Fa-f0-9]{1,4}\b/g;
const BEARER_RE = /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi;
// A JWT / dotted opaque token: three base64url runs separated by dots (abort/confirm
// tokens, session JWTs). Kept specific so ordinary dotted identifiers are untouched.
const JWT_RE = /\b[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\b/g;

function stringify(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

/** Mask emails, IPv4/IPv6 addresses, and bearer/JWT tokens in any value's string form. */
export function redact(value: unknown): string {
  return stringify(value)
    .replace(EMAIL_RE, "[email]")
    .replace(BEARER_RE, "Bearer [token]")
    .replace(JWT_RE, "[token]")
    .replace(IPV6_RE, "[ip]")
    .replace(IPV4_RE, "[ip]");
}

/** Redact the string leaves of a flat log-fields object (values only; keys untouched). */
export function redactFields(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    out[k] = typeof v === "string" ? redact(v) : v;
  }
  return out;
}

/** Emit one structured, PII-redacted JSON log line. */
export function logSafe(
  level: "info" | "warn" | "error",
  fn: string,
  fields: Record<string, unknown> = {},
): void {
  const line = JSON.stringify({ level, fn, ts: new Date().toISOString(), ...redactFields(fields) });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
