/**
 * supabase/functions/_shared/requestMeta.ts — Tier 0.10 abuse-defense
 * helpers shared across every edge function.
 *
 * Extracts client IP and User-Agent from a Request and provides a
 * `denyObviousBot` helper that rejects scrapers/bots with 403. This
 * is defense-in-depth: every edge function (stripe-webhook,
 * create-checkout, generate-narrative, admin-actions) is already
 * auth-gated, but bots probing for unprotected endpoints waste budget
 * and pollute logs. Rejecting them at the door is cheap.
 *
 * Design:
 *   - IP is read from `cf-connecting-ip` (Cloudflare / Supabase
 *     edge) first, then `x-forwarded-for` (split on comma, take the
 *     leftmost), then `x-real-ip`. Falls back to '0.0.0.0'.
 *   - UA is read from `user-agent`. Falls back to ''.
 *   - `denyObviousBot` checks the UA against a small allowlist of
 *     legitimate bots (Stripe, Supabase, monitoring) — those are
 *     accepted. Everything else matching the deny list is rejected.
 *
 * The bot list is conservative: it only matches strings that are
 * clearly bots ("bot", "crawler", "spider", common scraping tools).
 * It does NOT match all browsers — that would create a denial-of-
 * service vector if a Chrome update changed its UA string. False
 * negatives (real bots that get through) are cheaper than false
 * positives (real users blocked).
 *
 * Logging policy: every rejection produces one console.warn line so
 * the supabase logs surface abuse spikes without us needing a
 * separate audit pipeline yet. The optional `anonymous_telemetry`
 * table (migration TBD) is where structured telemetry will go once
 * the volume justifies it.
 */

import { getCorsHeaders } from './cors.ts';
import { logSafe, maskIp } from './log.ts';

const OBVIOUS_BOT_PATTERNS = [
  // Generic bot indicators
  /\bbot\b/i,
  /\bcrawler\b/i,
  /\bspider\b/i,
  /\bscraper\b/i,
  /\bcurl\b/i,
  /\bwget\b/i,
  /\bpython-requests\b/i,
  /\bpython-urllib\b/i,
  /\bgo-http-client\b/i,
  /\bjava\b/i,
  /\bperl\b/i,
  /\bphp\b/i,
  /\bruby\b/i,
  /\bnode-fetch\b/i,
  /\baxios\b/i,
  /\bhttpx\b/i,
  /\binsomnia\b/i,
  /\bpostmanruntime\b/i,
  // Headless / automation
  /\bheadless\b/i,
  /\bphantom\b/i,
  /\bselenium\b/i,
  /\bplaywright\b/i,
  /\bpuppeteer\b/i,
  /\bautomation\b/i,
];

/**
 * Bots we deliberately accept. These are infra integrations we depend
 * on — blocking them would break webhooks / monitoring / e2e tests.
 *
 * Pattern: longer-than-substring matches so a deceptive UA "stripe-
 * bot-scraper" doesn't slip through on "stripe".
 */
const ALLOWED_BOT_PATTERNS = [
  /^Stripe\//i,            // Stripe's own webhook UA
  /Supabase/i,             // Supabase health checks
  /UptimeRobot/i,           // monitoring
  /Pingdom/i,               // monitoring
  /BetterStack/i,           // monitoring
];

export type RequestMeta = {
  ip: string;
  ua: string;
  isObviousBot: boolean;
  isAllowedBot: boolean;
};

/** A pattern's readable name: `/\bpython-requests\b/i` -> `python-requests`. */
function patternLabel(rx: RegExp): string {
  return rx.source.replace(/\\b/g, '').replace(/^\^/, '').replace(/\\\//g, '');
}

/**
 * Classify a User-Agent to the BOT PATTERN it matched, never echoing the string itself
 * (A+ backend.6). A raw UA is a fingerprint; the pattern name is the fact the log line was
 * actually written to carry. Exported so the rejection line's contents are unit-testable
 * without driving a Request through the whole guard.
 *
 * Deny patterns are consulted first and independently of `isAllowedBot`, because the caller
 * decides policy: a function may reject a UA this module would have allowed, and the label
 * must describe the UA rather than re-state that decision.
 */
export function botUaClass(ua: string): string {
  const value = typeof ua === 'string' ? ua : '';
  if (value === '') return 'empty';
  for (const rx of OBVIOUS_BOT_PATTERNS) if (rx.test(value)) return patternLabel(rx);
  for (const rx of ALLOWED_BOT_PATTERNS) if (rx.test(value)) return `allowed:${patternLabel(rx)}`;
  return 'unclassified';
}

/**
 * Extract IP + UA from a Request and classify the UA. Returns a
 * cheap-to-compute summary every edge function can include in
 * audit logs without re-parsing headers.
 */
export function readRequestMeta(req: Request): RequestMeta {
  const h = req.headers;
  const ip =
    h.get('cf-connecting-ip') ||
    (h.get('x-forwarded-for') || '').split(',')[0].trim() ||
    h.get('x-real-ip') ||
    '0.0.0.0';
  const ua = h.get('user-agent') || '';

  const isAllowedBot = ALLOWED_BOT_PATTERNS.some(rx => rx.test(ua));
  const isObviousBot = !isAllowedBot && OBVIOUS_BOT_PATTERNS.some(rx => rx.test(ua));
  return { ip, ua, isObviousBot, isAllowedBot };
}

/**
 * Build a 403 Response for an obvious-bot request. Caller decides
 * whether to invoke based on the function's policy (e.g. stripe-
 * webhook should NEVER reject — Stripe's own UA matches the allowed
 * list but the function should always validate the signature even
 * if a forwarder were to spoof the UA).
 *
 * @param meta   The RequestMeta from readRequestMeta(req).
 * @param functionName Short identifier of the calling function for logs.
 */
export function rejectObviousBot(
  meta: RequestMeta,
  functionName: string,
  corsHeaders: Record<string, string> = {},
): Response {
  // Log a single warning line per rejection, through the redacting logger.
  //
  // A+ backend.6. This line used to be
  //     console.warn(`[${functionName}] bot rejected ip=${meta.ip} ua=${meta.ua.slice(0, 200)}`)
  // — a RAW client IP and 200 characters of raw User-Agent, on a bare console call, reaching
  // the Supabase function-log pipeline and any attached drain in the clear. Both halves are
  // now masked, and the line goes through logSafe() so redactFields() governs it by policy
  // rather than by the discipline of whoever edits this function next.
  //
  // WHAT SURVIVES THE MASK IS EXACTLY THE DIAGNOSTIC. The reason this line exists is to make
  // an abuse spike legible in the logs, and neither the host octet nor the UA's version/
  // platform tail carries that: `ip` keeps the /24, so one noisy neighbourhood still reads as
  // one, and `ua_class` names WHICH bot pattern matched — strictly more useful for spotting a
  // spike than a truncated raw string, and it cannot fingerprint a person. `ua_len` keeps the
  // one remaining signal a class label drops: an absurdly long UA is itself suspicious.
  logSafe('warn', functionName, {
    event: 'bot_rejected',
    ip: maskIp(meta.ip),
    ua_class: botUaClass(meta.ua),
    ua_len: meta.ua.length,
  });
  return new Response(
    JSON.stringify({ error: 'Automated requests are not permitted on this endpoint.' }),
    {
      status: 403,
      // CORS headers MUST be present even on a fail-closed rejection: without
      // Access-Control-Allow-Origin the browser cannot read the 403, so a
      // rejected fetch surfaces as an opaque "Failed to send a request to the
      // Edge Function" / "can't connect" instead of this readable message.
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
}

/**
 * Helper: read metadata and short-circuit with 403 if it's a bot.
 * Returns the meta when the request should proceed, or null when
 * the caller should immediately return the supplied Response.
 *
 * Usage:
 *   const guard = botGuard(req, 'create-checkout');
 *   if (guard.reject) return guard.reject;
 *   const { ip, ua } = guard.meta;
 */
export function botGuard(req: Request, functionName: string): {
  meta: RequestMeta;
  reject: Response | null;
} {
  const meta = readRequestMeta(req);
  if (meta.isObviousBot) {
    // Build the reject WITH the shared CORS headers for this request's origin,
    // so a browser can actually read the 403 (see rejectObviousBot).
    return { meta, reject: rejectObviousBot(meta, functionName, getCorsHeaders(req)) };
  }
  return { meta, reject: null };
}
