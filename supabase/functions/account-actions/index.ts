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
 *   process_deletions — run the processor: anonymise + lock every profile whose
 *                       request is past the grace window, advancing
 *                       requested->processing->done and writing one audit row
 *                       each. HIGHEST role only (admin|developer); the actual work
 *                       is the SECURITY DEFINER process_account_deletions RPC
 *                       (migration 054), invoked with the service-role client.
 *
 * Authorization:
 *   request_deletion  — any authenticated user (acts on their own row only).
 *   process_deletions — role='developer'|'admin' (or the OWNER_EMAIL identity).
 *
 * The destructive processor ALSO runs unattended as a scheduled cron calling the
 * RPC directly with a null actor (migration 054) — this edge action is the
 * on-demand, human-triggered path.
 *
 * Env (all optional; defaults preserve historical behaviour):
 *   OWNER_EMAIL          — privileged owner-override email.
 *   ALLOWED_ORIGINS      — comma-separated CORS allowlist (else wildcard "*").
 *   DELETION_GRACE_DAYS  — grace window before a request is processed (default 7).
 *   RESEND_API_KEY / RESEND_FROM_EMAIL — when set, request_deletion sends a
 *                          best-effort confirmation; never blocks the request.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Tier 0.10 — abuse defense baseline (shared with every edge function).
import { botGuard } from "../_shared/requestMeta.ts";
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
  } = {},
): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
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

    const {
      action, graceDays: graceOverride,
      // A5 ticket params (user-facing self-service path).
      subject, message, category, priority, links, ticketId, body, metadata,
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
        if (error) return json({ error: error.message }, 500);
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
        if (error) return json({ error: error.message }, 500);
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
        if (error) return json({ error: error.message }, 500);
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
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, event: data });
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
          return json({ error: insertErr.message }, 500);
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
        const { data: callerProfile } = await adminClient
          .from("profiles")
          .select("role, email")
          .eq("id", callingUser.id)
          .single();
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

        // The RPC re-checks the actor role, anonymises + locks each due profile,
        // advances the request status, and writes one audit row per request. We
        // forward the VERIFIED caller as the actor so the audit names a human.
        const { data, error } = await adminClient.rpc("process_account_deletions", {
          p_actor: callingUser.id,
          p_grace_days: grace,
          p_limit: 500,
        });
        if (error) return json({ error: error.message }, 500);

        // Layer 2 (review B16 #1): the RPC stamped deleted_at + disabled_at (so the
        // 057/059 DB+RLS gate already rejects every WRITE from the anonymised shell),
        // but the user's LIVE JWT/session would otherwise survive until expiry. Ban
        // each just-processed account at the auth provider (GoTrue native ban) so the
        // session dies immediately too. The RPC returns the deletion_request ids it
        // advanced; resolve each to its user_id and ban it. Soft-fails per user — a
        // GoTrue error never undoes the soft-delete (the DB anonymise/lock stands).
        let sessionsRevoked = 0;
        const requestIds = Array.isArray((data as Record<string, unknown> | null)?.ids)
          ? ((data as Record<string, unknown>).ids as unknown[]).map(String)
          : [];
        if (requestIds.length > 0) {
          const { data: processedRows } = await adminClient
            .from("deletion_requests")
            .select("user_id")
            .in("id", requestIds);
          const userIds = (processedRows || [])
            .map((r: Record<string, unknown>) => r.user_id)
            .filter((id: unknown): id is string => typeof id === "string");
          for (const uid of userIds) {
            try {
              const { error: banErr } = await adminClient.auth.admin.updateUserById(
                uid,
                { ban_duration: "876000h" },
              );
              if (banErr) {
                console.warn("[account-actions] GoTrue ban on deletion failed:", banErr.message);
              } else {
                sessionsRevoked += 1;
              }
            } catch (e) {
              console.warn("[account-actions] GoTrue ban on deletion threw:", errorMessage(e));
            }
          }
        }

        return json({
          success: true,
          result: data,
          sessionsRevoked,
          processedAt: new Date().toISOString(),
        });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    return json({ error: errorMessage(err) }, 500);
  }
}

// Wrap in a 1-arg lambda so the handler's optional `deps` param doesn't clash with
// std/http's Handler signature (req, connInfo) — `deno check` (check:edge) flags a
// direct `serve(handler)` as a Handler-shape mismatch. The deps default applies.
serve((req) => handleAccountActions(req));
