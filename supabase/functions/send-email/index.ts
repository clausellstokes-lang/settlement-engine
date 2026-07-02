/**
 * send-email — Tier 8.5 lifecycle email dispatcher.
 *
 * Renders one of the lifecycle templates and posts to Resend
 * (https://resend.com/docs/api-reference/emails/send-email) via
 * RESEND_API_KEY. The client-facing entry point is
 * src/lib/emailLifecycle.js → supabase.functions.invoke('send-email').
 *
 * Authorization:
 *   - For every template EXCEPT cap_warning, the recipient is read
 *     from auth.uid() — only authenticated users can email themselves.
 *     This prevents a malicious client from spamming arbitrary
 *     addresses via the welcome/save/etc. paths.
 *   - cap_warning accepts an explicit `recipient` payload because
 *     anonymous users (who hit the cap) have no auth.uid(). To keep
 *     this from becoming a spam relay it is gated by a real per-IP
 *     AND per-recipient rate limit (consume_email_rate_limit, migration
 *     034) checked via the service-role client before dispatch, on top
 *     of the per-request botGuard. Its caller-supplied placeholders are
 *     schema-validated (digit-only counters) so the rendered mail can
 *     never carry attacker-controlled text.
 *
 * Templates: inlined here (kept in sync with src/lib/emailTemplates.js
 * — the client tests assert key parity). Edge function can't import
 * from src/ because Deno doesn't resolve Vite-aliased ESM at deploy
 * time; we pay one duplication for one-edge-deploy independence.
 *
 * Failure modes:
 *   - Missing RESEND_API_KEY → returns { ok: false, reason: 'unconfigured' }
 *     instead of throwing; client emailLifecycle.js handles null
 *     gracefully so the user action never blocks on email.
 *   - Resend API error → logged + returned as { ok: false, reason }.
 *   - Unknown template → 400.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { botGuard } from "../_shared/requestMeta.ts";
// One CORS allowlist for every edge function (incl. Cloudflare Pages preview).
// This previously emitted "*"; the shared helper fails closed (echoes the
// matched origin, never "*") and accepts the Cloudflare Pages preview origin.
import { getCorsHeaders as sharedCorsHeaders } from "../_shared/cors.ts";

/** Per-request CORS headers from the shared allowlist (preserves prior Allow-Headers). */
function corsHeadersFor(req: Request): Record<string, string> {
  return sharedCorsHeaders(req);
}

// ── Templates (kept in sync with src/lib/emailTemplates.js) ─────────────────
const TEMPLATES: Record<string, { subject: string; text: string }> = {
  welcome: {
    subject: "Welcome to SettlementForge",
    text: [
      "Hello {displayName},",
      "",
      "Your SettlementForge account is live. A few orientation notes:",
      "",
      "  • Every settlement is simulated from constraints. Not AI-generated.",
      "    Each town is the only coherent settlement that satisfies the",
      "    constraints you set — sliders, terrain, trade, stress.",
      "",
      "  • Your first three saves are free. After that, sign up for a",
      "    Cartographer subscription or claim a Founder Lifetime seat",
      "    (limited to the first 500 supporters).",
      "",
      "  • Narrative refinement (the optional prose layer) costs credits",
      "    per pass. Cartographer subscriptions include a monthly",
      "    allowance; credit packs top you up.",
      "",
      "Forge well.",
      "",
      "— SettlementForge",
      "https://settlementforge.com",
    ].join("\n"),
  },
  save_confirmation: {
    subject: "Saved: {settlementName}",
    text: [
      "Hello {displayName},",
      "",
      "Your settlement {settlementName} ({tier}) has been saved to your",
      "campaign library. You can find it any time at:",
      "",
      "  https://settlementforge.com/?view=settlements",
      "",
      "The save preserves the simulator state, your edits, and any",
      "narrative refinement passes you have run. Future regenerations",
      "will not overwrite locked entities.",
      "",
      "— SettlementForge",
    ].join("\n"),
  },
  export_confirmation: {
    subject: "Dossier exported: {settlementName}",
    text: [
      "Hello {displayName},",
      "",
      "Your {settlementName} ({tier}) dossier export is ready.",
      "",
      "The PDF includes the simulator output, your saved canon, and any",
      "narrative refinement you have layered on. If anything looks off,",
      "you can re-export from the settlement detail view at any time.",
      "",
      "— SettlementForge",
    ].join("\n"),
  },
  credit_low: {
    subject: "Narrative credits running low",
    text: [
      "Hello {displayName},",
      "",
      "Your narrative credit balance has dropped to {balance}. Each",
      "narrative refinement pass costs {narrativeCost} credits; each",
      "daily-life pass costs {dailyLifeCost}.",
      "",
      "Top up here:",
      "  https://settlementforge.com/?view=pricing",
      "",
      "Reminder: settlements themselves never use credits — only the",
      "optional narrative refinement layer does. Your simulator output",
      "continues to work as normal.",
      "",
      "— SettlementForge",
    ].join("\n"),
  },
  founder_thank_you: {
    subject: "Welcome, Founder",
    text: [
      "Hello {displayName},",
      "",
      "You are one of the first 500 supporters. Thank you.",
      "",
      "Your Founder Lifetime seat is permanent — Cartographer-tier",
      "access, unlimited saves, all current and future expansion packs.",
      "You also get the Founder badge on every dossier you publish.",
      "",
      "A direct line to the dev lives in Discord. The invite is on your",
      "account page.",
      "",
      "Forge well.",
      "",
      "— SettlementForge",
    ].join("\n"),
  },
  cap_warning: {
    subject: "Anonymous generation cap reached",
    text: [
      "Hello,",
      "",
      "You have hit the daily cap for anonymous settlement generation",
      "on SettlementForge ({capUsed} of {capTotal} used). The cap",
      "resets at midnight UTC.",
      "",
      "Sign up for a free account to unlock:",
      "  • Up to Town size (Capital with a Cartographer subscription)",
      "  • Saved settlements (3 free)",
      "  • PDF export of any saved dossier",
      "",
      "Sign up: https://settlementforge.com/?view=signin",
      "",
      "— SettlementForge",
    ].join("\n"),
  },
};

// Templates that don't require an authenticated caller. These accept
// `recipient` in the request body.
//
// SECURITY NOTE: cap_warning is an unauthenticated mailer to a caller-supplied
// recipient, so it is defended in depth:
//   1. botGuard rejects obvious bots (does NOT throttle — that's why it alone
//      was insufficient).
//   2. consume_email_rate_limit (migration 034) enforces a real fixed-window
//      per-IP AND per-recipient limit via the service-role client BEFORE any
//      send. A caller over either limit gets 429 and no email leaves.
//   3. ANON_PLACEHOLDER_RULES below rejects any payload value that is not the
//      exact shape the template calls for (cap_warning: two small counters).
//      An anonymous caller therefore cannot place ANY free text — no URLs, no
//      phishing copy — into an email sent from our Resend identity.
// The blast radius is also bounded by design: a single fixed-content "you hit
// your cap" template with no caller-supplied body. Do NOT add free-text
// templates here, and do NOT add a template to this set without a rate-limit
// path AND a placeholder rule set of its own.
const ANON_OK_TEMPLATES = new Set(["cap_warning"]);

// Rate-limit defaults for the anonymous path. Kept in the function (not the DB
// signature defaults) so the policy is visible at the call site; passed
// explicitly to consume_email_rate_limit.
const ANON_RATE_LIMIT = {
  windowSeconds:  3600, // 1 hour
  ipLimit:        5,    // sends per IP per window
  recipientLimit: 3,    // sends per recipient address per window
} as const;

function interpolate(str: string, vars: Record<string, unknown>): string {
  return str.replace(/\{(\w+)\}/g, (m, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m
  );
}

// A cap-usage counter: a small non-negative integer, as a number or a digit
// string (the client sends `String(capUsed ?? 3)`). Returns the canonical
// digit string, or null when the value is anything else.
function asBoundedCount(value: unknown): string | null {
  const str =
    typeof value === "number" && Number.isFinite(value) ? String(value) : value;
  if (typeof str !== "string" || !/^\d{1,4}$/.test(str)) return null;
  return str;
}

// Strict placeholder schema for the anonymous templates, whose payload values
// are caller-supplied and get interpolated into the rendered email. A previous
// revision merely stripped control chars and length-capped each value, which
// still let an anonymous caller inject ~200 chars of arbitrary visible text
// (URLs, phishing copy) PER SLOT into mail sent from our Resend identity.
// Now each anonymous template declares the exact shape of every placeholder it
// accepts; anything that doesn't match is rejected with 400 before rendering.
// cap_warning's two placeholders are usage counters, so only small
// non-negative integers pass.
const ANON_PLACEHOLDER_RULES: Record<
  string,
  Record<string, (value: unknown) => string | null>
> = {
  cap_warning: {
    capUsed: asBoundedCount,
    capTotal: asBoundedCount,
  },
};

// Validate a caller-supplied anonymous payload against its template's rules.
// Every declared placeholder must be present and pass its rule; keys outside
// the schema are dropped (interpolate() would never read them, but we don't
// let them near the renderer either — in particular a caller cannot smuggle a
// displayName override). Returns the validated string map, or null (reject).
function validateAnonPayload(
  template: string,
  payload: Record<string, unknown>,
): Record<string, string> | null {
  const rules = ANON_PLACEHOLDER_RULES[template];
  if (!rules) return null; // no declared schema → fail closed
  const out: Record<string, string> = {};
  for (const [key, rule] of Object.entries(rules)) {
    const value = rule(payload?.[key]);
    if (value === null) return null;
    out[key] = value;
  }
  return out;
}

// Plausible-email check for the caller-supplied recipient on the anonymous
// path. Deliberately conservative (single @, non-empty local + dotted domain,
// no whitespace/control chars) – a stricter gate than the prior ".includes('@')".
function isPlausibleEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendViaResend(opts: {
  to: string;
  from: string;
  subject: string;
  text: string;
  apiKey: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:    opts.from,
      to:      [opts.to],
      subject: opts.subject,
      text:    opts.text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
  return res.json();
}

/**
 * Consume one unit of the anonymous-path rate limit for (ip, recipient).
 *
 * Returns `{ ok: true }` when the caller is under both limits and the send may
 * proceed, or `{ ok: false, reason }` otherwise. FAILS CLOSED: if the limiter
 * is unreachable or misconfigured (missing service-role key, RPC error) we do
 * NOT send. cap_warning is non-critical by design, so the safe failure for a
 * spam-relay control is to drop the email rather than relay it unthrottled.
 */
async function consumeAnonRateLimit(
  ip: string,
  recipient: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("[send-email] rate limiter unavailable: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
    return { ok: false, reason: "rate_limit_unavailable" };
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data, error } = await admin.rpc("consume_email_rate_limit", {
    p_ip: ip,
    p_recipient: recipient,
    p_window_seconds: ANON_RATE_LIMIT.windowSeconds,
    p_ip_limit: ANON_RATE_LIMIT.ipLimit,
    p_recipient_limit: ANON_RATE_LIMIT.recipientLimit,
  });

  if (error || !data) {
    // RPC failed or returned nothing — a limiter malfunction, not a caller
    // over their limit. Fail closed.
    console.error("[send-email] rate limiter error:", error?.message ?? "no data returned");
    return { ok: false, reason: "rate_limit_unavailable" };
  }
  if (data.allowed !== true) {
    // Over limit on IP and/or recipient. Log enough to spot abuse spikes in
    // the function logs without a separate pipeline.
    console.warn(
      `[send-email] cap_warning rate-limited ip=${ip} ` +
      `ip_count=${data.ip_count} recipient_count=${data.recipient_count}`,
    );
    return { ok: false, reason: "rate_limited" };
  }
  return { ok: true };
}

/**
 * Exported handler with an injectable `deps` seam (production passes nothing)
 * so the anonymous-path trust boundary — bot reject, recipient plausibility,
 * strict placeholder schema, rate limit, rendered-output shape — is
 * execution-testable without a live Supabase or a live Resend key.
 */
export async function handleSendEmail(
  req: Request,
  deps: {
    consumeRateLimit?: typeof consumeAnonRateLimit;
    dispatch?: typeof sendViaResend;
  } = {},
): Promise<Response> {
  const consumeRateLimit = deps.consumeRateLimit ?? consumeAnonRateLimit;
  const dispatch = deps.dispatch ?? sendViaResend;

  const corsHeaders = corsHeadersFor(req);
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const guard = botGuard(req, "send-email");
  if (guard.reject) return guard.reject;
  const { ip } = guard.meta;

  try {
    const { template, payload = {}, recipient = null } = await req.json();

    // Template validation
    if (!template || !TEMPLATES[template]) {
      return new Response(
        JSON.stringify({ ok: false, reason: "unknown_template" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Recipient resolution. Authenticated paths read the user's email
    // from auth; anonymous paths (cap_warning) accept an explicit
    // recipient string from the payload.
    let to: string | null = null;
    let displayName: string | null = null;
    let anonPayload: Record<string, string> | null = null;

    if (ANON_OK_TEMPLATES.has(template)) {
      // Caller-supplied recipient: require a plausible single-address email
      // (stricter than ".includes('@')") and reject control chars/whitespace.
      if (!isPlausibleEmail(recipient)) {
        return new Response(
          JSON.stringify({ ok: false, reason: "bad_recipient" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Strict placeholder schema: every value the caller supplies must match
      // the exact shape the template declares (cap_warning: digit-only
      // counters). Rejected before the rate limit is consumed — an invalid
      // payload never costs the caller budget and never reaches the renderer.
      anonPayload = validateAnonPayload(
        template,
        (payload ?? {}) as Record<string, unknown>,
      );
      if (anonPayload === null) {
        return new Response(
          JSON.stringify({ ok: false, reason: "bad_payload" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Real rate limit (per-IP AND per-recipient) before this unauthenticated
      // path can dispatch. botGuard above only blocks obvious bots; this is the
      // throttle that keeps cap_warning from becoming a spam relay. Consumed
      // here (not after a successful send) so a caller can't probe for free.
      const limit = await consumeRateLimit(ip, recipient);
      if (!limit.ok) {
        // 429 for an over-limit caller; 503 when the limiter itself is down
        // (fail-closed — see consumeAnonRateLimit). Either way, no email sent.
        const status = limit.reason === "rate_limited" ? 429 : 503;
        return new Response(
          JSON.stringify({ ok: false, reason: limit.reason }),
          { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      to = recipient;
    } else {
      // Authenticated path: read email + display_name from auth.uid()
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ ok: false, reason: "auth_required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user }, error: userErr } = await userClient.auth.getUser();
      if (userErr || !user) {
        return new Response(
          JSON.stringify({ ok: false, reason: "auth_invalid" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      to = user.email ?? null;
      displayName = user.user_metadata?.display_name ?? null;
      if (!to) {
        return new Response(
          JSON.stringify({ ok: false, reason: "no_email_on_account" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Apply provider config. RESEND_API_KEY + RESEND_FROM_EMAIL come
    // from Supabase secrets — set with:
    //   npx supabase secrets set RESEND_API_KEY=re_xxx
    //   npx supabase secrets set RESEND_FROM_EMAIL="SettlementForge <hello@settlementforge.com>"
    const apiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
    if (!apiKey || !fromEmail) {
      // Soft fail — emails are non-blocking by design. Surface in logs
      // but return 200 so the client doesn't retry.
      console.warn("[send-email] RESEND_API_KEY or RESEND_FROM_EMAIL not set");
      return new Response(
        JSON.stringify({ ok: false, reason: "unconfigured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Render. Inject displayName from auth if not supplied.
    // For the anonymous path only the schema-validated payload (digit-only
    // counters for cap_warning) reaches the renderer — the raw caller payload
    // never does. Authenticated paths trust the values they assemble from
    // auth state, so their behavior is unchanged.
    const safePayload = ANON_OK_TEMPLATES.has(template)
      ? anonPayload!
      : payload;
    const fullPayload = { displayName: displayName || "there", ...safePayload };
    const tmpl = TEMPLATES[template];
    const subject = interpolate(tmpl.subject, fullPayload);
    const text = interpolate(tmpl.text, fullPayload);

    try {
      const result = await dispatch({ to: to!, from: fromEmail, subject, text, apiKey });
      return new Response(
        JSON.stringify({ ok: true, id: result?.id || null }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.error("[send-email] provider error:", (e as Error).message);
      return new Response(
        JSON.stringify({ ok: false, reason: "provider_error", detail: (e as Error).message }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (e) {
    console.error("[send-email] handler error:", (e as Error).message);
    return new Response(
      JSON.stringify({ ok: false, reason: "internal_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

serve((req) => handleSendEmail(req));
