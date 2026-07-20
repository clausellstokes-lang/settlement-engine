/**
 * edgeLogGuard.mjs — [security-2] the CI grep guard for edge-function logging PII.
 *
 * A console.* call must NEVER embed a hardcoded email literal: PII in a log line can only
 * be scrubbed if it flows through redact() in supabase/functions/_shared/log.ts, and a
 * literal address baked into the call string can never be. This guard fails the edge gate
 * (scripts/validate-edge-functions.mjs) on any such line, so the raw-console.* surface
 * cannot grow with new PII leaks while the incremental migration to the redacting logger
 * burns the existing backlog down.
 *
 * Kept as a standalone, side-effect-free module so it is BOTH used by the validator and
 * unit-tested directly (tests/security/edgeLogRedaction.test.js) without executing the
 * validator's top-level scan.
 */

// A console.* call whose argument text contains a literal email address. Single-line by
// design (a literal email sits on the line with the string); interpolated variables
// (`console.error(err.message)`) are NOT matched — those flow through redact() over time.
const EMAIL_LITERAL_LOG_RE =
  /console\.\w+\([^)]*?[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

/**
 * @param {string} source  an edge-function .ts source
 * @param {string} rel     a label for messages (relative path)
 * @returns {string[]} one message per offending line (empty = clean)
 */
export function consolePiiLiteralOffenders(source, rel = '<source>') {
  const out = [];
  const lines = String(source).split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (EMAIL_LITERAL_LOG_RE.test(lines[i])) {
      out.push(
        `${rel}:${i + 1}: a console.* call embeds a literal email — route PII through redact() in supabase/functions/_shared/log.ts`,
      );
    }
  }
  return out;
}
