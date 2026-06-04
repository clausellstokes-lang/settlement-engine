/**
 * supabase/functions/_shared/requestMeta.ts - Tier 0.10 abuse-defense
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
 *     legitimate bots (Stripe, Supabase, monitoring) - those are
 *     accepted. Everything else matching the deny list is rejected.
 *
 * The bot list is conservative: it only matches strings that are
 * clearly bots ("bot", "crawler", "spider", common scraping tools).
 * It does NOT match all browsers - that would create a denial-of-
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
 * on - blocking them would break webhooks / monitoring / e2e tests.
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
 * webhook should NEVER reject - Stripe's own UA matches the allowed
 * list but the function should always validate the signature even
 * if a forwarder were to spoof the UA).
 *
 * @param meta   The RequestMeta from readRequestMeta(req).
 * @param functionName Short identifier of the calling function for logs.
 */
export function rejectObviousBot(meta: RequestMeta, functionName: string): Response {
  // Log a single warning line per rejection. The supabase function
  // logs surface these without us needing a structured pipeline yet.
  console.warn(
    `[${functionName}] bot rejected ip=${meta.ip} ua=${meta.ua.slice(0, 200)}`,
  );
  return new Response(
    JSON.stringify({ error: 'Automated requests are not permitted on this endpoint.' }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
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
    return { meta, reject: rejectObviousBot(meta, functionName) };
  }
  return { meta, reject: null };
}
