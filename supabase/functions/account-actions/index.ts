/**
 * account-actions — Edge function for a user's OWN account-data actions, plus the
 * service-role soft-delete PROCESSOR. This is the endpoint src/lib/accountData.js
 * requestAccountDeletion() prefers; until now it didn't exist, so that client fell
 * back to a direct deletion_requests insert (RLS-allowed). This completes the loop.
 *
 * Actions:
 *   request_deletion  — file the CALLER's OWN soft-delete request (any authed
 *                       user). Idempotent: an already-open request is reported
 *                       back rather than duplicated. Soft-delete only — the client
 *                       can never erase its own account (RLS forbids it).
 *   process_deletions — run the durable processor (migration 175): anonymise +
 *                       lock every due profile and transactionally enqueue its
 *                       service-role-only external cleanup job. HIGHEST role only
 *                       (admin|developer). The SAME shared worker used by the
 *                       unattended cron then revokes GoTrue, enumerates/cancels
 *                       every Stripe subscription, and asks the completion RPC
 *                       to clear all linkage + mark request/job done atomically.
 *
 * Authorization:
 *   request_deletion  — any authenticated user (acts on their own row only).
 *   process_deletions — role='developer'|'admin' (or the OWNER_EMAIL identity).
 *
 * The unattended path is account-deletion-worker, dispatched via a secret-gated
 * pg_net cron. It never calls the SQL processor without also draining the durable
 * external queue. This edge action is the human-triggered path.
 *
 * Env (all optional; defaults preserve historical behaviour):
 *   OWNER_EMAIL          — privileged owner-override email.
 *   ALLOWED_ORIGINS      — comma-separated origins ADDED to the shared fail-closed
 *                          CORS allowlist (_shared/cors.ts); there is no wildcard
 *                          fallback, a disallowed origin is pinned and rejected.
 *   DELETION_GRACE_DAYS  — grace window before a request is processed (default 7).
 *   RESEND_API_KEY / RESEND_FROM_EMAIL — when set, request_deletion sends a
 *                          best-effort confirmation; never blocks the request.
 *   STRIPE_SECRET_KEY    — lets the shared cleanup worker cancel all deleted-
 *                          account subscriptions. Unset = a linked job remains
 *                          retryable; Stripe ids and request=processing are kept.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
// Tier 0.10 — abuse defense baseline (shared with every edge function).
import { botGuard } from "../_shared/requestMeta.ts";
import { isSessionSuperseded, deviceLabelFromRequest } from "../_shared/sessionGate.ts";
import { logError } from "../_shared/logError.ts";
import {
  defaultDeletionStripeClient,
  processAccountDeletionCleanupQueue,
  type StripeSubscriptionsApi,
} from "../_shared/accountDeletionCleanup.ts";
// One CORS allowlist for every edge function (incl. Cloudflare Pages preview).
// Fail CLOSED, never "*": the endpoint is independently protected by JWT auth +
// role gating + botGuard, but a misconfigured deploy must not silently allow any
// origin. The shared module honors ALLOWED_ORIGINS / CLIENT_URL.
import { getCorsHeaders as sharedCorsHeaders } from "../_shared/cors.ts";

function corsHeadersFor(req: Request): Record<string, string> {
  return sharedCorsHeaders(req);
}

// Owner-override email — configurable via OWNER_EMAIL ONLY. Missing var FAILS
// CLOSED (override disabled), never fails privileged. Matches admin-actions.
const OWNER_EMAIL = (Deno.env.get("OWNER_EMAIL") || "").trim().toLowerCase();

// Grace window before a filed request is eligible for processing. Defaults to 7
// days; an out-of-range / unparsable value falls back to 7.
function graceDays(): number {
  const raw = parseInt(Deno.env.get("DELETION_GRACE_DAYS") || "", 10);
  return Number.isFinite(raw) && raw >= 0 && raw <= 365 ? raw : 7;
}

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

// ── Dossier retro-claim, same-device token path (migration 108) ──────────────
// sha256 hex of a string (crypto.subtle, the ingest-events idiom). The webhook
// stored sha256(checkout_token); the claimer re-hashes the token they present and
// we compare the two DIGESTS — the raw token is never stored and never compared.
async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Constant-time equality of two ASCII/hex strings. Both operands here are sha256
// hex digests (fixed 64 chars), but we still compare in constant time so the
// token claim cannot be probed by response-timing: fold length into the
// accumulator (never early-return on a mismatch) so the loop runs to a fixed
// bound regardless of where — or whether — the strings differ. Mirrors the
// verify-single-dossier token-comparison discipline, hardened past its `===`.
function timingSafeEqualHex(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/** Default user-scoped client (anon key + the caller's JWT) — verifies identity. */
function defaultUserClient(authHeader: string) {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
}

/** Default service-role client (the account_is_active gate + RLS-bypassing RPCs). */
function defaultAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// Best-effort email send (Resend). Soft-fails to false when unconfigured or on
// error — a ticket lifecycle email must never block or fail the user action.
async function sendEmail(to: string | null, subject: string, text: string): Promise<boolean> {
  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
    if (!apiKey || !fromEmail || !to || !to.includes("@")) return false;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromEmail, to: [to], subject, text }),
    });
    return res.ok;
  } catch (e) {
    console.warn("[account-actions] email send failed:", errorMessage(e));
    return false;
  }
}

// Exported (not just inlined into serve) so the account_is_active gate can be
// EXECUTION-tested: index.test.ts feeds requests with injected supabase stubs and
// asserts a banned/disabled actor is REJECTED (403) on the ticket-WRITE paths
// before any write RPC runs, and that an active actor is allowed through. `deps`
// is the optional injection seam (userClient verifies the JWT, adminClient runs
// the gate + service-role RPCs); production passes nothing so behavior is
// identical to the previous inline handler.
export async function handleAccountActions(
  req: Request,
  deps: {
    userClient?: (authHeader: string) => ReturnType<typeof createClient>;
    adminClient?: () => ReturnType<typeof createClient>;
    stripeClient?: () => StripeSubscriptionsApi | null;
  } = {},
): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const makeStripeClient = deps.stripeClient ?? defaultDeletionStripeClient;
  const cors = corsHeadersFor(req);
  const jsonHeaders = { ...cors, "Content-Type": "application/json" };
  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: jsonHeaders });

  // CORS preflight.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  // Tier 0.10 — obvious-bot guard at the door.
  const guard = botGuard(req, "account-actions");
  if (guard.reject) return guard.reject;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing authorization" }, 401);
    }

    // User-scoped client → verify the caller's identity from their JWT.
    const userClient = makeUserClient(authHeader);
    const {
      data: { user: callingUser },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !callingUser) {
      return json({ error: "Invalid token" }, 401);
    }

    // Service-role client → RLS-bypassing reads/writes + the processor RPC.
    const adminClient = makeAdminClient();

    // SINGLE-SESSION GATE (161, §7.2): reject a superseded device's JWT.
    if (await isSessionSuperseded(adminClient, callingUser.id, authHeader, deviceLabelFromRequest(req))) {
      return json({ error: "session_superseded" }, 401);
    }

    const {
      action, graceDays: graceOverride,
      // A5 ticket params (user-facing self-service path).
      subject, message, category, priority, links, ticketId, body, metadata,
      // Dossier retro-claim, same-device token params (108).
      sessionId, checkoutToken, saveId,
    } = await req.json();

    // A+ defense-in-depth (finding #1): a banned/disabled/soft-deleted account may
    // not write NEW support content (mirrors the account_is_active gate on the AI
    // edge functions). Fail-CLOSED on null/RPC-error (isActive !== true). Read-only
    // ticket actions and the account-deletion lifecycle stay reachable.
    // NOTE: the user-facing reply action handled HERE is "reply_ticket" (switch case
    // below); "post_ticket_reply" is the admin-actions name and never reaches this
    // function — gating on it would be dead. Both write paths must fail-closed.
    const TICKET_WRITE_ACTIONS = new Set(["create_ticket", "reply_ticket"]);
    if (TICKET_WRITE_ACTIONS.has(action)) {
      const { data: isActive } = await adminClient.rpc("account_is_active", { p_uid: callingUser.id });
      if (isActive !== true) {
        return json({ error: "Account is not active" }, 403);
      }
    }

    switch (action) {
      // ── A5: create_ticket — the CALLER files their OWN ticket. The user_id is
      // taken from the verified JWT (forwarded as p_actor), never the body, so a
      // user can only ever open a ticket for themselves. Fires the create email.
      case "create_ticket": {
        if (typeof subject !== "string" || !subject.trim()) {
          return json({ error: "A subject is required" }, 400);
        }
        if (typeof message !== "string" || !message.trim()) {
          return json({ error: "A message is required" }, 400);
        }
        const { data, error } = await adminClient.rpc("create_ticket", {
          p_actor: callingUser.id,
          p_subject: subject.trim(),
          p_message: message.trim(),
          p_email: callingUser.email ?? "unknown",
          p_category: typeof category === "string" ? category : "general",
          p_priority: typeof priority === "string" ? priority : "normal",
          p_links: links && typeof links === "object" ? links : {},
          p_metadata: metadata && typeof metadata === "object" ? metadata : {},
        });
        if (error) { logError("account-actions", callingUser.id, `db error: ${error.message}`); return json({ error: "The request could not be completed. Please try again." }, 500); }
        const ticket = (data ?? {}) as Record<string, unknown>;
        const notified = await sendEmail(
          callingUser.email ?? null,
          `We received your support request (${ticket.ticket_number ?? ""})`,
          `Thanks for reaching out. Your ticket ${ticket.ticket_number ?? ""} is open.\n\n` +
          `Subject: ${subject.trim()}\n\n` +
          `We'll get back to you here and by email. You can also follow it from ` +
          `the Support section of your account.`,
        );
        return json({ success: true, ticket: data, notified });
      }

      // ── A5: list_my_tickets — the caller's OWN tickets only. The RPC reads
      // auth.uid(), so we call it through the USER-scoped client (not the
      // service-role one) so auth.uid() resolves to the caller.
      case "list_my_tickets": {
        const { data, error } = await userClient.rpc("list_my_tickets");
        if (error) { logError("account-actions", callingUser.id, `db error: ${error.message}`); return json({ error: "The request could not be completed. Please try again." }, 500); }
        return json({ success: true, tickets: data || [] });
      }

      // ── A5: list_ticket_thread — user-visible events for one of the caller's
      // OWN tickets. The RPC enforces visibility (owner never sees internal
      // notes). Run via the user-scoped client so auth.uid() scopes the read.
      case "list_ticket_thread": {
        if (typeof ticketId !== "string" || !ticketId) {
          return json({ error: "A ticketId is required" }, 400);
        }
        const { data, error } = await userClient.rpc("list_ticket_thread", { p_id: ticketId });
        if (error) { logError("account-actions", callingUser.id, `db error: ${error.message}`); return json({ error: "The request could not be completed. Please try again." }, 500); }
        return json({ success: true, events: data || [] });
      }

      // ── A5: reply_ticket — the OWNER posts a user-visible reply to their OWN
      // ticket. The RPC rejects a non-owner / non-agent and forces visibility to
      // 'user' for an owner (an owner can never post an internal note).
      case "reply_ticket": {
        if (typeof ticketId !== "string" || !ticketId) {
          return json({ error: "A ticketId is required" }, 400);
        }
        if (typeof body !== "string" || !body.trim()) {
          return json({ error: "A reply body is required" }, 400);
        }
        const { data, error } = await adminClient.rpc("post_ticket_reply", {
          p_actor: callingUser.id, p_id: ticketId, p_body: body.trim(), p_visibility: "user",
        });
        if (error) { logError("account-actions", callingUser.id, `db error: ${error.message}`); return json({ error: "The request could not be completed. Please try again." }, 500); }
        return json({ success: true, event: data });
      }
      // ── claim_dossier_purchase — same-device token retro-claim (108) ────────
      // The SOLE retro-claim path (user-locked): same-device + same-settlement +
      // automatic. The original device still holds the checkout token in its
      // purchase stash; after the anonymous buyer signs up and saves THAT
      // settlement, the client makes a silent post-save call with
      // { sessionId, checkoutToken, saveId }. There is NO email-match / cross-
      // device path. We verify, on the SERVER, that:
      //   1. a purchase row exists for sessionId and is still 'unclaimed', and
      //   2. sha256(checkoutToken) matches the stored checkout_token_hash
      //      (constant-time) — proof the caller holds the original device's token.
      // Only then do we call the service-role claim RPC, which binds the voucher
      // to a save the caller owns and mints the durable right. NO Stripe API call:
      // the webhook-recorded row IS the paid truth (it exists only for a paid,
      // signed session). Rate-limited per user; every rejection is logged.
      case "claim_dossier_purchase": {
        if (typeof sessionId !== "string" || !sessionId.trim()) {
          return json({ error: "A sessionId is required" }, 400);
        }
        if (typeof checkoutToken !== "string" || checkoutToken.length < 24 || checkoutToken.length > 128) {
          return json({ error: "A valid checkout token is required" }, 400);
        }
        if (typeof saveId !== "string" || !saveId.trim()) {
          return json({ error: "A saveId is required" }, 400);
        }

        // Per-user rate limit (reuse the shared keyed limiter, 036): a token
        // claim is a proof-of-purchase check, so bound the guess rate per account
        // and namespace the key so it can never collide with another limiter.
        // Fail CLOSED on a limiter error — a claim is value-moving, so an
        // unavailable limiter must not open an unbounded guessing window.
        const { data: underRate, error: rateErr } = await adminClient.rpc("ingest_check_rate", {
          p_key: `dossier_claim:${callingUser.id}`,
          p_max: 20,
          p_window_seconds: 3600,
        });
        if (rateErr || underRate === false) {
          if (rateErr) logError("account-actions", callingUser.id, `dossier claim rate limiter error: ${rateErr.message}`, { stage: "dossier_claim_rate" });
          return json({ error: "Too many attempts. Please wait a little while and try again." }, 429);
        }

        // Read the recorded purchase (service-role bypasses the no-policy RLS on
        // single_dossier_purchases). A missing row, a non-unclaimed row, or a
        // token-hash mismatch ALL collapse to the SAME generic rejection so the
        // endpoint cannot be used to probe which session ids exist or which are
        // already claimed/refunded. Every branch logs the true reason server-side.
        const { data: purchase, error: readErr } = await adminClient
          .from("single_dossier_purchases")
          .select("stripe_session_id, checkout_token_hash, status")
          .eq("stripe_session_id", sessionId.trim())
          .maybeSingle();
        if (readErr) {
          logError("account-actions", callingUser.id, `dossier purchase read failed: ${readErr.message}`, { stage: "dossier_claim_read" });
          return json({ error: "The request could not be completed. Please try again." }, 500);
        }

        const storedHash = typeof purchase?.checkout_token_hash === "string" ? purchase.checkout_token_hash : "";
        const presentedHash = await sha256hex(checkoutToken);
        // Always compute the hash + compare, even when the row/hash is absent, so
        // the response timing does not distinguish "no such session" from "wrong
        // token". The compare against an empty stored hash fails on length.
        const tokenOk = storedHash !== "" && timingSafeEqualHex(presentedHash, storedHash);
        if (!purchase || purchase.status !== "unclaimed" || !tokenOk) {
          logError(
            "account-actions",
            callingUser.id,
            !purchase ? "dossier claim: unknown session"
              : purchase.status !== "unclaimed" ? `dossier claim: purchase not unclaimed (${purchase.status})`
              : "dossier claim: token mismatch",
            { stage: "dossier_claim_verify", session_id: sessionId.trim() },
          );
          return json({ error: "This purchase could not be verified." }, 403);
        }

        // Token proof established → the service-role RPC claims the voucher and
        // mints the durable right, keyed to a save the caller owns. It re-checks
        // save ownership and is claim-once (a concurrent/replayed claim no-ops).
        const { data: claim, error: claimErr } = await adminClient.rpc("claim_dossier_purchase_by_session", {
          p_session_id: sessionId.trim(),
          p_user: callingUser.id,
          p_save_id: saveId.trim(),
        });
        if (claimErr) {
          logError("account-actions", callingUser.id, `claim_dossier_purchase_by_session failed: ${claimErr.message}`, { stage: "dossier_claim_rpc" });
          return json({ error: "The request could not be completed. Please try again." }, 500);
        }
        if (!claim?.ok) {
          // A business rejection (save_not_found / already_claimed / refunded /
          // already_entitled). Surface a stable generic message; log the reason.
          logError("account-actions", callingUser.id, `dossier claim declined: ${claim?.reason ?? "unknown"}`, { stage: "dossier_claim_declined", session_id: sessionId.trim() });
          const status = claim?.reason === "save_not_found" ? 400 : 409;
          return json({ error: "This purchase could not be claimed.", reason: claim?.reason ?? "unknown" }, status);
        }

        return json({ success: true, entitlementId: claim.entitlement_id });
      }

      // ── request_deletion — any authed user files their OWN soft-delete ──────
      // The user acts only on their own row (user_id is taken from the verified
      // JWT, never the body). Idempotent: an already-open request is returned as
      // queued rather than duplicated.
      case "request_deletion": {
        const requestedAt = new Date().toISOString();

        // Already have an open request? Report it back (no duplicate row).
        const { data: existing } = await adminClient
          .from("deletion_requests")
          .select("id, status, requested_at")
          .eq("user_id", callingUser.id)
          .in("status", ["requested", "processing"])
          .order("requested_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existing) {
          return json({
            status: "queued",
            requestedAt: existing.requested_at,
            alreadyRequested: true,
          });
        }

        const { error: insertErr } = await adminClient
          .from("deletion_requests")
          .insert({
            user_id: callingUser.id,
            email: callingUser.email ?? null,
            requested_at: requestedAt,
            status: "requested",
          });
        if (insertErr) {
          logError("account-actions", callingUser.id, `deletion insert failed: ${insertErr.message}`);
          return json({ error: "The request could not be completed. Please try again." }, 500);
        }

        // Best-effort confirmation email so the grace window is genuine notice.
        // NEVER blocks or fails the request (Resend may be unconfigured).
        try {
          const apiKey = Deno.env.get("RESEND_API_KEY");
          const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
          const to = callingUser.email;
          if (apiKey && fromEmail && to) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: fromEmail,
                to: [to],
                subject: "Your account deletion request",
                text:
                  `We received your request to delete your account.\n\n` +
                  `Your account will be anonymised and locked after a ` +
                  `${graceDays()}-day grace period. If this wasn't you, or you ` +
                  `change your mind, contact support before then to cancel.`,
              }),
            });
          }
        } catch (e) {
          console.warn("[account-actions] deletion confirm email failed:", errorMessage(e));
        }

        return json({ status: "queued", requestedAt });
      }

      // ── process_deletions — HIGHEST role only; run the processor RPC ────────
      case "process_deletions": {
        // Role gate: profiles.role developer|admin, or the owner identity.
        const { data: callerProfile, error: callerProfileErr } = await adminClient
          .from("profiles")
          .select("role, email")
          .eq("id", callingUser.id)
          .single();
        if (callerProfileErr) {
          logError("account-actions", callingUser.id, `deletion caller lookup failed: ${callerProfileErr.message}`, {
            stage: "deletion_caller_lookup",
          });
          return json({ error: "The request could not be completed. Please try again." }, 500);
        }
        const callerEmail = String(callingUser.email || callerProfile?.email || "")
          .trim().toLowerCase();
        const ownerOverride = OWNER_EMAIL !== "" && callerEmail === OWNER_EMAIL;
        const isHighest = ownerOverride ||
          ["developer", "admin"].includes(callerProfile?.role || "");
        if (!isHighest) {
          return json({ error: "Insufficient privileges" }, 403);
        }

        const grace = Number.isFinite(Number(graceOverride)) &&
            Number(graceOverride) >= 0 && Number(graceOverride) <= 365
          ? Math.trunc(Number(graceOverride))
          : graceDays();

        // Migration 175 makes this the LOCAL stage only: anonymise + lock and
        // transactionally enqueue a durable cleanup job. The request deliberately
        // remains `processing`; the shared external worker is the only path that
        // can finalize it after GoTrue + Stripe success.
        const { data, error } = await adminClient.rpc("process_account_deletions", {
          p_actor: callingUser.id,
          p_grace_days: grace,
          p_limit: 500,
        });
        if (error) {
          logError("account-actions", callingUser.id, `db error: ${error.message}`);
          return json({
            success: false,
            error: "The request could not be completed. Please try again.",
          }, 500);
        }

        let cleanup;
        try {
          cleanup = await processAccountDeletionCleanupQueue(adminClient, {
            stripeClient: makeStripeClient(),
            claimBatchSize: 25,
            maxJobs: 50,
            staleAfterMinutes: 30,
            log: (message, details) =>
              logError("account-actions", callingUser.id, message, {
                stage: "deletion_external_cleanup",
                ...details,
              }),
          });
        } catch (cleanupError) {
          logError(
            "account-actions",
            callingUser.id,
            `deletion queue failed: ${errorMessage(cleanupError)}`,
            { stage: "deletion_queue" },
          );
          return json({
            success: false,
            error: "Account deletion is queued, but the cleanup worker could not be reached. It will retry.",
            result: data,
          }, 500);
        }

        if (cleanup.failed > 0 || cleanup.leaseLost > 0) {
          return json({
            success: false,
            error: "Account deletion is safely queued, but external cleanup is incomplete. The durable worker will retry.",
            result: data,
            ...cleanup,
            processedAt: new Date().toISOString(),
          }, 502);
        }

        if (cleanup.capped) {
          return json({
            success: true,
            moreQueued: true,
            result: data,
            ...cleanup,
            processedAt: new Date().toISOString(),
          }, 202);
        }

        return json({
          success: true,
          result: data,
          ...cleanup,
          processedAt: new Date().toISOString(),
        });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    // Generic client message; raw error logged server-side (may carry DB internals).
    logError("account-actions", null, `outer handler error: ${errorMessage(err)}`);
    return json({ error: "The request could not be completed. Please try again." }, 500);
  }
}

// Wrap in a 1-arg lambda so the handler's optional `deps` param doesn't clash with
// std/http's Handler signature (req, connInfo) — `deno check` (check:edge) flags a
// direct `serve(handler)` as a Handler-shape mismatch. The deps default applies.
serve((req) => handleAccountActions(req));
