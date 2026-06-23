/**
 * auth-recovery — LOGGED-OUT password-recovery edge function (Auth Phase 2).
 *
 * The signed-OUT half of the security-question recovery flow. A user who has
 * forgotten their password (and therefore has NO JWT) hits this endpoint, is
 * shown ONE of their two security questions chosen at random, answers it, and —
 * on a correct answer — is emailed a password-reset link to the set-new-password
 * page. Everything runs through the SERVICE-ROLE client because the caller is
 * unauthenticated; the recovery DB primitives (migration 066) are granted to
 * service_role ONLY and are never reachable from anon/authenticated.
 *
 * Modeled on account-actions: a fail-CLOSED CORS allowlist (never "*"), the
 * Tier 0.10 botGuard, a defaultAdminClient() over the service key, and the Resend
 * sendEmail helper. The crucial DIFFERENCE from account-actions: there is NO JWT
 * to verify here — the platform gate is pinned verify_jwt = false in config.toml
 * and the function defends itself with a hard per-IP + per-email rate limit
 * (consume_recovery_rate_limit, 066), the botGuard, and JSON-only parsing.
 *
 * Actions (over POST, JSON body):
 *   lookup  — body { email } → rate-limit (per-IP + per-email, fail-closed) →
 *             pick_recovery_question(email) → { exists, slot, questionId }. The
 *             user explicitly chose REVEAL-as-described, so exists:false is an
 *             allowed response — but it is STILL rate-limited hard to throttle
 *             enumeration. On a missing account (or an account with no security
 *             answers) we return exists with NO question. EVERY call consumes the
 *             limiter so probing for existence is itself throttled.
 *   verify  — body { email, slot, answer } → rate-limit (GENUINELY tighter: a
 *             3-guess per-email cap over a 1-hour window, fail-closed) → CUMULATIVE
 *             per-account lockout gate (recovery_is_locked, 067; a hard-locked
 *             account is denied generically without a bcrypt compare) →
 *             verify_recovery_answer(email, slot, answer). On TRUE, clear the
 *             account's lockout counter, mint a 'recovery' link via
 *             admin.generateLink redirecting to the set-new-password page, send it
 *             with Resend, and return { ok: true } generically. On FALSE, bump the
 *             cumulative per-account counter (067) and return { ok: false }. The
 *             answer and the hash are NEVER echoed.
 *
 *   The per-IP cap is NOT relied on as a second factor: the IP comes from
 *   client-controllable x-forwarded-for / x-real-ip headers and is rotatable. The
 *   real over-time bound on answer-guessing is the cumulative per-account lockout
 *   (067), keyed to the account, which survives rate-limit window rollover.
 *
 * SECURITY INVARIANTS (mirror the foundation migration 066 contract):
 *   - the answer_hash NEVER leaves the server: the function only ever sees the
 *     boolean from verify_recovery_answer, never the hash.
 *   - both endpoints are rate-limited per-IP + per-email; the limiter FAILS
 *     CLOSED (a limiter error denies, it does not allow).
 *   - the reset link is sent to the account's email ONLY (read from auth.users
 *     by the RPC's email→user resolution + generateLink's own recipient), so a
 *     correct-answer caller cannot redirect the reset to an arbitrary inbox.
 *
 * Env:
 *   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — service-role client (required).
 *   ALLOWED_ORIGINS  — comma-separated CORS allowlist (else the known prod +
 *                      localhost hosts; NEVER "*").
 *   RESEND_API_KEY / RESEND_FROM_EMAIL — the reset-link mailer. Unlike the
 *                      best-effort lifecycle emails this one is load-bearing:
 *                      when unconfigured, verify still returns { ok: true }
 *                      generically (so a correct answer never leaks "no email
 *                      configured") but logs the misconfiguration.
 *   APP_URL / PUBLIC_SITE_URL — base origin the recovery link redirects to
 *                      (set-new-password page). Falls back to the first allowed
 *                      origin so a misconfigured deploy still points at the app.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { botGuard } from "../_shared/requestMeta.ts";

// CORS: fail CLOSED, mirroring account-actions / ingest-events. When
// ALLOWED_ORIGINS is configured use it, otherwise fall back to the known
// production + localhost hosts (incl. the dev ports). NEVER "*": this is an
// unauthenticated endpoint, so a missing env var must not silently allow any
// origin to drive the recovery flow.
const DEFAULT_ORIGINS = [
  "https://settlementforge.com",
  "https://www.settlementforge.com",
  "https://settlementwork.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];
const CONFIGURED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") || "")
  .split(",").map((s) => s.trim()).filter(Boolean);
const ORIGIN_ALLOWLIST = CONFIGURED_ORIGINS.length ? CONFIGURED_ORIGINS : DEFAULT_ORIGINS;

// The set-new-password page path. The recovery email link lands here; the page
// (a separate workstream) consumes the recovery token from the URL and completes
// the password change. Kept as a constant so the redirect target is one edit.
const SET_NEW_PASSWORD_PATH = "/set-new-password";

function corsHeadersFor(req: Request): Record<string, string> {
  const requestOrigin = req.headers.get("Origin") || "";
  const allowOrigin = ORIGIN_ALLOWLIST.includes(requestOrigin)
    ? requestOrigin
    : ORIGIN_ALLOWLIST[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Vary": "Origin",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

// Base origin the recovery link redirects to. Prefer an explicit env var; fall
// back to the first allowed origin (the canonical prod host) so a misconfigured
// deploy still points the link at the real app rather than at nothing.
function appBaseUrl(): string {
  const explicit = (Deno.env.get("APP_URL") || Deno.env.get("PUBLIC_SITE_URL") || "").trim();
  const base = explicit || ORIGIN_ALLOWLIST[0] || "https://settlementforge.com";
  return base.replace(/\/+$/, "");
}

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

/** Service-role client — the recovery RPCs (066) are granted to service_role ONLY. */
function defaultAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// Reset-link mailer. Unlike the best-effort lifecycle sends this one is the
// payload of a successful recovery; we still SOFT-fail (return false, log) so a
// provider hiccup never throws past the generic { ok: true } — a correct-answer
// caller must not be able to distinguish "email sent" from "email failed".
async function sendEmail(to: string | null, subject: string, text: string): Promise<boolean> {
  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
    if (!apiKey || !fromEmail || !to || !to.includes("@")) {
      console.warn("[auth-recovery] reset email not sent: mailer unconfigured or bad recipient");
      return false;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromEmail, to: [to], subject, text }),
    });
    if (!res.ok) {
      console.warn(`[auth-recovery] Resend ${res.status} sending reset email`);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[auth-recovery] reset email send failed:", errorMessage(e));
    return false;
  }
}

// Constant-time floor for the answer-verify response (ms). Every verify OUTCOME
// (locked, wrong, correct) is padded to this minimum so the extra work the
// correct path does (mint link + send email) is not a timing oracle for a
// correct answer. The work stays AWAITED for delivery reliability; only the
// response latency is equalized. Paired with the 3-guess/hour cap + per-account
// lockout, this keeps the verify response uninformative on timing.
const VERIFY_FLOOR_MS = 800;

// Rate-limit policy, visible at the call site (not buried in DB defaults). The
// lookup path is slightly more permissive (a person may retry the email box) over
// the shared 15-minute window. The verify path is GENUINELY tighter — a 3-guess
// cap over a LONGER 1-hour window — because the per-IP cap is not a real second
// factor (the IP is derived from spoofable x-forwarded-for / x-real-ip headers,
// migration 067 header). The per-IP cap stays only as a coarse flood guard.
//
// The fixed window still resets, so this cap alone bounds guesses-per-window, not
// guesses-over-time. The CUMULATIVE per-account lockout (migration 067:
// recovery_is_locked / note_recovery_verify_failure) is what bounds lifetime
// guesses to a small constant — after RECOVERY_LOCKOUT_MAX wrong answers the
// account hard-locks recovery until a correct answer or an operator clear, so an
// attacker cannot spend a fresh budget every window indefinitely.
const LOOKUP_LIMITS = { windowSeconds: 900, ipLimit: 10, emailLimit: 5 } as const;
const VERIFY_LIMITS = { windowSeconds: 3600, ipLimit: 10, emailLimit: 3 } as const;

/**
 * Consume one unit of the recovery rate limit for (ip, email). Returns
 * { ok: true } when under both limits, else { ok: false, reason }. FAILS CLOSED:
 * a limiter error / missing service key DENIES (the enumeration- and guess-
 * sensitive recovery path must never run unthrottled).
 */
async function consumeRecoveryLimit(
  admin: ReturnType<typeof defaultAdminClient>,
  ip: string,
  email: string,
  limits: { windowSeconds: number; ipLimit: number; emailLimit: number },
): Promise<{ ok: true } | { ok: false; reason: "rate_limited" | "rate_limit_unavailable" }> {
  const { data, error } = await admin.rpc("consume_recovery_rate_limit", {
    p_ip: ip,
    p_email: email,
    p_window_seconds: limits.windowSeconds,
    p_ip_limit: limits.ipLimit,
    p_email_limit: limits.emailLimit,
  });
  if (error || !data) {
    console.error("[auth-recovery] rate limiter error:", error?.message ?? "no data returned");
    return { ok: false, reason: "rate_limit_unavailable" };
  }
  if ((data as Record<string, unknown>).allowed !== true) {
    const d = data as Record<string, unknown>;
    console.warn(
      `[auth-recovery] rate-limited ip_count=${d.ip_count} email_count=${d.email_count}`,
    );
    return { ok: false, reason: "rate_limited" };
  }
  return { ok: true };
}

// Cumulative per-account lockout check (migration 067). The fixed-window limiter
// resets every window; this is the constraint that survives rollover. Returns true
// only when the account is hard-locked. FAILS CLOSED-but-quiet: on a limiter error
// we LOG and return false (do not lock a legit user out on an infra blip) — the
// per-window cap + botGuard still throttle; the lockout is the over-time backstop,
// not the only gate, so a soft-fail here does not open a brute-force hole.
async function isRecoveryLocked(
  admin: ReturnType<typeof defaultAdminClient>,
  email: string,
): Promise<boolean> {
  const { data, error } = await admin.rpc("recovery_is_locked", { p_email: email });
  if (error) {
    console.error("[auth-recovery] recovery_is_locked error:", error.message);
    return false;
  }
  return data === true;
}

// Exported so the handler can be EXECUTION-tested with injected stubs (an
// adminClient that returns canned RPC results) without standing up Supabase.
// Production passes nothing, so behaviour is identical to the inline handler.
export async function handleAuthRecovery(
  req: Request,
  deps: { adminClient?: () => ReturnType<typeof createClient> } = {},
): Promise<Response> {
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const cors = corsHeadersFor(req);
  const jsonHeaders = { ...cors, "Content-Type": "application/json" };
  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: jsonHeaders });

  // CORS preflight.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  // JSON-only: this endpoint takes a structured body, nothing else.
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Tier 0.10 — obvious-bot guard at the door. Also gives us the client IP.
  const guard = botGuard(req, "auth-recovery");
  if (guard.reject) return guard.reject;
  const { ip } = guard.meta;

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const action = typeof payload.action === "string" ? payload.action : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  // A real email is required up front for BOTH actions — it is the per-email
  // rate-limit key. Reject obviously-malformed input before consuming a unit.
  if (!email || !email.includes("@")) {
    return json({ error: "A valid email is required" }, 400);
  }

  const admin = makeAdminClient();

  try {
    switch (action) {
      // ── lookup — reveal existence + ONE random question, hard rate-limited ──
      case "lookup": {
        const limit = await consumeRecoveryLimit(admin, ip, email, LOOKUP_LIMITS);
        if (!limit.ok) {
          const status = limit.reason === "rate_limited" ? 429 : 503;
          return json({ error: limit.reason }, status);
        }

        // Cumulative-lockout gate (067). A hard-locked account stops offering a
        // question entirely: respond as { exists:true, no question } — the SAME
        // shape as an account with no answers set — so the lockout does not become
        // an oracle and a brute-forcer simply runs out of slots to attack.
        if (await isRecoveryLocked(admin, email)) {
          return json({ exists: true, slot: null, questionId: null });
        }

        const { data, error } = await admin.rpc("pick_recovery_question", { p_email: email });
        if (error) {
          console.error("[auth-recovery] pick_recovery_question error:", error.message);
          return json({ error: "lookup_failed" }, 500);
        }
        // The RPC returns a one-row table: { account_exists, slot, question_id }.
        const row = (Array.isArray(data) ? data[0] : data) as
          | { account_exists?: boolean; slot?: number | null; question_id?: string | null }
          | null
          | undefined;
        const exists = row?.account_exists === true;
        const slot = exists && typeof row?.slot === "number" ? row.slot : null;
        const questionId = exists && typeof row?.question_id === "string" ? row.question_id : null;

        // exists:false → no question (honest reveal, still rate-limited). exists
        // with a null slot (OAuth-only / no answers set) → exists:true, no
        // question, so the client can route elsewhere without leaking more.
        return json({ exists, slot, questionId });
      }

      // ── verify — check ONE answer; on success email the reset link ──────────
      case "verify": {
        // Pad every verify OUTCOME below to VERIFY_FLOOR_MS so locked/wrong/
        // correct return at the same minimum latency — no timing oracle.
        const verifyStart = Date.now();
        const floorVerify = async () => {
          const dt = Date.now() - verifyStart;
          if (dt < VERIFY_FLOOR_MS) await new Promise((r) => setTimeout(r, VERIFY_FLOOR_MS - dt));
        };
        const slotRaw = payload.slot;
        const slot = typeof slotRaw === "number"
          ? slotRaw
          : (typeof slotRaw === "string" ? parseInt(slotRaw, 10) : NaN);
        const answer = typeof payload.answer === "string" ? payload.answer : "";

        if (slot !== 1 && slot !== 2) {
          return json({ error: "A valid slot is required" }, 400);
        }
        if (!answer.trim()) {
          return json({ error: "An answer is required" }, 400);
        }

        // Consume the limiter FIRST (tighter per-email cap), so every guess —
        // right or wrong — counts and a brute-forcer is throttled before the
        // bcrypt compare runs.
        const limit = await consumeRecoveryLimit(admin, ip, email, VERIFY_LIMITS);
        if (!limit.ok) {
          const status = limit.reason === "rate_limited" ? 429 : 503;
          return json({ error: limit.reason }, status);
        }

        // Cumulative-lockout gate (067): once an account has crossed the lifetime
        // wrong-answer cap, reject every verify generically WITHOUT running the
        // bcrypt compare — so waiting out the rate-limit window buys no new guesses.
        // Generic { ok: false } (same as a wrong answer) leaks no locked/unlocked
        // oracle. We still consumed the limiter above, keeping the locked-account
        // probe rate itself throttled.
        if (await isRecoveryLocked(admin, email)) {
          await floorVerify();
          return json({ ok: false });
        }

        const { data: ok, error } = await admin.rpc("verify_recovery_answer", {
          p_email: email,
          p_slot: slot,
          p_answer: answer,
        });
        if (error) {
          console.error("[auth-recovery] verify_recovery_answer error:", error.message);
          return json({ error: "verify_failed" }, 500);
        }

        // Wrong answer (or no such account / slot). The limiter already counted
        // this attempt; ALSO bump the cumulative per-account counter so lifetime
        // guesses are bounded across windows (067). Never echo the answer/hash;
        // deny generically. The increment is best-effort — a logged failure here
        // must not flip a wrong answer into a misleading success.
        if (ok !== true) {
          const { error: noteErr } = await admin.rpc("note_recovery_verify_failure", {
            p_email: email,
          });
          if (noteErr) {
            console.error("[auth-recovery] note_recovery_verify_failure error:", noteErr.message);
          }
          await floorVerify();
          return json({ ok: false });
        }

        // Correct answer → clear the cumulative lockout counter so a legit user who
        // mistyped a few times before getting it right starts clean next time.
        // Best-effort: a failure here doesn't change the successful recovery.
        const { error: clearErr } = await admin.rpc("clear_recovery_lockout_by_email", {
          p_email: email,
        });
        if (clearErr) {
          console.error("[auth-recovery] clear_recovery_lockout_by_email error:", clearErr.message);
        }

        // Correct answer → mint a 'recovery' link redirecting to the set-new-
        // password page and email it to the ACCOUNT's address. The link's
        // recipient is the account email (the RPC matched on it); a correct-
        // answer caller can never redirect the reset to an arbitrary inbox.
        const redirectTo = `${appBaseUrl()}${SET_NEW_PASSWORD_PATH}`;
        let actionLink: string | null = null;
        try {
          const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
            type: "recovery",
            email,
            options: { redirectTo },
          });
          if (linkErr) {
            console.error("[auth-recovery] generateLink error:", linkErr.message);
          } else {
            actionLink = linkData?.properties?.action_link ?? null;
          }
        } catch (e) {
          console.error("[auth-recovery] generateLink threw:", errorMessage(e));
        }

        // Send the reset email. SOFT-fail: a mailer/provider failure must not
        // change the generic { ok: true } a correct-answer caller sees (no oracle
        // for "email configured?"). The misconfiguration is logged for the
        // operator. We only send when we actually minted a link.
        if (actionLink) {
          await sendEmail(
            email,
            "Reset your SettlementForge password",
            [
              "You (or someone who answered your security question) asked to reset",
              "your SettlementForge password.",
              "",
              "Open this link to choose a new password. It expires shortly:",
              "",
              `  ${actionLink}`,
              "",
              "If this wasn't you, ignore this email — your password is unchanged.",
              "",
              "— SettlementForge",
            ].join("\n"),
          );
        }

        // Generic success regardless of mail/link outcome — the answer was
        // correct, which is the only thing the response reveals.
        await floorVerify();
        return json({ ok: true });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    return json({ error: errorMessage(err) }, 500);
  }
}

// Wrap in a 1-arg lambda so the handler's optional `deps` param doesn't clash
// with std/http's Handler signature (req, connInfo). The deps default applies.
serve((req) => handleAuthRecovery(req));
