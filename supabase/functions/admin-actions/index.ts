/**
 * admin-actions — Edge function for developer/admin operations.
 *
 * Actions:
 *   update_user_metadata — Update profile-backed auth metadata (tier, role)
 *   update_user_credits  — Set a user's credit balance through the ledger
 *   list_users           — List all users (with profiles)
 *   get_stats            — System-wide statistics
 *
 * Authorization: Only users with role='developer' or role='admin'
 * in the profiles table (or the OWNER_EMAIL identity) can invoke this function.
 *
 * Env (optional, both default to the historical behaviour if unset):
 *   OWNER_EMAIL     — privileged owner-override email (was hardcoded in source).
 *   ALLOWED_ORIGINS — comma-separated CORS allowlist; when set, replaces the
 *                     wildcard "*" with a reflected-Origin allowlist.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Tier 0.10 — abuse defense baseline (shared with every edge function).
import { botGuard } from "../_shared/requestMeta.ts";
// One CORS allowlist for every edge function (incl. Cloudflare Pages preview).
import { getCorsHeaders as sharedCorsHeaders } from "../_shared/cors.ts";

// CORS: fail CLOSED via the shared allowlist (_shared/cors.ts) — NEVER "*" for
// this admin endpoint. The endpoint is independently protected by JWT auth +
// role gating + botGuard, so the allowlist is defense-in-depth, but a
// misconfigured deploy must not silently allow any origin to drive admin actions
// from a victim's authenticated browser context. The shared module honors
// ALLOWED_ORIGINS / CLIENT_URL and accepts the Cloudflare Pages preview origin.
function corsHeadersFor(req: Request): Record<string, string> {
  return sharedCorsHeaders(req);
}

const ALLOWED_ROLES = ["user", "developer", "admin"];
const ALLOWED_TIERS = ["free", "premium"];
const ALLOWED_METADATA_KEYS = ["role", "tier", "display_name", "is_founder"];
// Owner-override email — configurable via the OWNER_EMAIL env var ONLY. No
// hardcoded fallback: a missing env var FAILS CLOSED (owner override disabled,
// access falls back to profiles.role), never fails privileged. Deployments that
// want the override must set OWNER_EMAIL explicitly.
const OWNER_EMAIL = (Deno.env.get("OWNER_EMAIL") || "").trim().toLowerCase();

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(record: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

/** Default user-scoped client (anon key + the caller's JWT) — verifies identity. */
function defaultUserClient(authHeader: string) {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
}

/** Default service-role client (bypasses RLS for the role gate + RPC dispatch). */
function defaultAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

function buildProfilePatch(metadata: Record<string, unknown>) {
  const unsupported = Object.keys(metadata).filter((key) =>
    !ALLOWED_METADATA_KEYS.includes(key)
  );
  if (unsupported.length) {
    throw new Error(`Unsupported metadata keys: ${unsupported.join(", ")}`);
  }

  const patch: Record<string, unknown> = {};

  if (hasOwn(metadata, "role")) {
    const role = String(metadata.role);
    if (!ALLOWED_ROLES.includes(role)) throw new Error(`Invalid role: ${role}`);
    patch.role = role;
  }

  if (hasOwn(metadata, "tier")) {
    const tier = String(metadata.tier);
    if (!ALLOWED_TIERS.includes(tier)) throw new Error(`Invalid tier: ${tier}`);
    patch.tier = tier;
  }

  if (hasOwn(metadata, "display_name")) {
    const rawName = metadata.display_name;
    if (rawName === null || rawName === undefined) {
      patch.display_name = null;
    } else {
      const displayName = String(rawName).trim();
      if (displayName.length > 64) {
        throw new Error("display_name too long (max 64 chars)");
      }
      patch.display_name = displayName || null;
    }
  }

  if (hasOwn(metadata, "is_founder")) {
    if (typeof metadata.is_founder !== "boolean") {
      throw new Error("is_founder must be boolean");
    }
    patch.is_founder = metadata.is_founder;
  }

  if (Object.keys(patch).length === 0) {
    throw new Error("No supported metadata keys supplied");
  }

  return patch;
}

// Exported (not just inlined into serve) so the privilege gate can be EXECUTION-
// tested: index.test.ts feeds requests with injected supabase stubs and asserts a
// non-privileged caller is REJECTED (403) before any RPC runs, and that a valid
// admin action routes to the right RPC. `deps` is the optional injection seam
// (userClient verifies the JWT, adminClient dispatches); production passes nothing
// so behavior is identical to the previous inline handler.
export async function handleAdminActions(
  req: Request,
  deps: {
    userClient?: (authHeader: string) => ReturnType<typeof createClient>;
    adminClient?: () => ReturnType<typeof createClient>;
  } = {},
): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  // CORS + JSON helper are per-request so the allowed Origin can reflect the
  // caller (when an allowlist is configured).
  const cors = corsHeadersFor(req);
  const jsonHeaders = { ...cors, "Content-Type": "application/json" };
  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: jsonHeaders });

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  // Tier 0.10 — obvious-bot guard. Admin actions are role-gated, but
  // bots probing for admin endpoints should be rejected at the door.
  const guard = botGuard(req, "admin-actions");
  if (guard.reject) return guard.reject;

  try {
    // Get the user's JWT from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing authorization" }, 401);
    }

    // Create a client with the user's JWT to verify their identity
    const userClient = makeUserClient(authHeader);

    // Verify the calling user
    const {
      data: { user: callingUser },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError || !callingUser) {
      return json({ error: "Invalid token" }, 401);
    }

    // Check that the calling user has an elevated role
    const adminClient = makeAdminClient();
    const { data: callerProfile } = await adminClient
      .from("profiles")
      .select("role, email")
      .eq("id", callingUser.id)
      .single();

    const callerEmail = String(callingUser.email || callerProfile?.email || "")
      .trim()
      .toLowerCase();
    // Owner override applies ONLY when OWNER_EMAIL is configured AND matches —
    // an empty OWNER_EMAIL can never match (so an empty caller email can't
    // accidentally equal an empty owner email and bypass the role gate).
    const ownerOverride = OWNER_EMAIL !== "" && callerEmail === OWNER_EMAIL;
    // A3: `support` is an elevated role for REDACTED reads / ticket triage, but
    // NOT for user-management writes or full-PII. `admin`/`developer` (the
    // "highest" roles) get everything. We track both so each action can pick its
    // own gate below.
    const callerRole = callerProfile?.role || "";
    const isHighestRole = ["developer", "admin"].includes(callerRole);
    const hasElevatedRole = isHighestRole || callerRole === "support";
    if (!ownerOverride && !hasElevatedRole) {
      return json({ error: "Insufficient privileges" }, 403);
    }
    // Highest-role gate (full-PII + user-management writes). Owner override
    // counts as highest. Used by the write/full-PII switch arms below.
    const isHighest = ownerOverride || isHighestRole;

    // A3: append-only audit writer. Every mutating action writes exactly one
    // row through the SECURITY DEFINER write_audit RPC (the ONLY insert path
    // into audit_log). before/after are REDACTED snapshots — never raw PII.
    const writeAudit = async (entry: {
      action: string;
      targetUserId?: string | null;
      targetType?: string | null;
      targetId?: string | null;
      before?: unknown;
      after?: unknown;
      destructive?: boolean;
      reversible?: boolean;
      notified?: boolean;
    }) => {
      const { error: auditErr } = await adminClient.rpc("write_audit", {
        p_action: entry.action,
        p_target_user_id: entry.targetUserId ?? null,
        p_target_type: entry.targetType ?? null,
        p_target_id: entry.targetId ?? null,
        p_reason: auditReason,
        p_before: entry.before ?? null,
        p_after: entry.after ?? null,
        p_was_destructive: entry.destructive ?? false,
        p_was_reversible: entry.reversible ?? true,
        p_user_notified: entry.notified ?? false,
        p_actor_id: callingUser.id,
      });
      if (auditErr) {
        console.warn("[admin-actions] audit write failed:", auditErr.message);
      }
    };

    // Parse the request body
    const {
      action, userId, metadata, credits, reason, dashboard,
      from: fromDate, to: toDate,
      // Trends-panel params (migration 040 report_* functions)
      metric, field, granularity, rowField, colField, limit,
      // System-mutation params (migration 041 report_* functions)
      configSignature,
      // A4 user-management params
      severity, note, settlementId, enabled, full, emailTemplate, emailPayload,
      // A5 ticket-queue params
      ticketId, status, body: replyBody, visibility, faq,
    } = await req.json();
    const auditReason = typeof reason === "string" && reason.trim()
      ? reason.trim()
      : null;

    // A4: resolve the target user's email server-side (NEVER returned to the
    // client) so we can notify them on an action. Returns null if the profile or
    // email is missing. Used only by the notify path; the client never sees it.
    const resolveTargetEmail = async (target: string): Promise<string | null> => {
      const { data } = await adminClient
        .from("profiles").select("email").eq("id", target).single();
      const email = data?.email;
      return typeof email === "string" && email.includes("@") ? email : null;
    };

    // A4: notify a TARGET user by email (not the actor). Sends via Resend with the
    // service-role-resolved address. Soft-fails (returns false) when Resend is
    // unconfigured or errors — notification is never allowed to block or fail an
    // admin action. Returns whether the user was actually notified (drives the
    // `notified` audit flag).
    const notifyTargetEmail = async (
      target: string, subject: string, text: string,
    ): Promise<boolean> => {
      try {
        const apiKey = Deno.env.get("RESEND_API_KEY");
        const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
        if (!apiKey || !fromEmail) return false; // unconfigured — soft fail
        const to = await resolveTargetEmail(target);
        if (!to) return false;
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: fromEmail, to: [to], subject, text }),
        });
        return res.ok;
      } catch (e) {
        console.warn("[admin-actions] notify failed:", errorMessage(e));
        return false;
      }
    };

    // Layer 2 (review B16 #1): toggle GoTrue's NATIVE ban via the service-role
    // admin client. A native ban invalidates the user's refresh tokens/sessions at
    // the auth provider, so a banned/disabled account's LIVE JWT stops working —
    // something the profiles.banned_at flag alone never did. `'876000h'` (~100y) is
    // the conventional "permanent" ban_duration; `'none'` clears it on un-ban/enable.
    // Returns whether the auth call succeeded; the caller treats a false as
    // soft-fail (the DB flag + RLS/trigger gate already closed the write boundary).
    const setGoTrueBan = async (target: string, banned: boolean): Promise<boolean> => {
      try {
        const { error: banErr } = await adminClient.auth.admin.updateUserById(
          target,
          { ban_duration: banned ? "876000h" : "none" },
        );
        if (banErr) {
          console.warn("[admin-actions] GoTrue ban toggle failed:", banErr.message);
          return false;
        }
        return true;
      } catch (e) {
        console.warn("[admin-actions] GoTrue ban toggle threw:", errorMessage(e));
        return false;
      }
    };

    // Shared date defaults for the analytics reads (last 30 days).
    const today = new Date().toISOString().slice(0, 10);
    const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
    const asDate = (v: unknown, fallback: string) =>
      typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : fallback;
    const pFrom = asDate(fromDate, monthAgo);
    const pTo = asDate(toDate, today);

    switch (action) {
      // Read-only analytics dashboards (migration 038 report_* functions). The
      // privilege gate above already enforced developer/admin/owner. The edge
      // function assembles NO SQL — it only dispatches to a fixed report fn.
      case "get_analytics_dashboard": {
        const REPORT_FNS: Record<string, string> = {
          funnel: "report_funnel",
          preferences: "report_preferences",
          edit_heatmap: "report_edit_heatmap",
          ai_usage: "report_ai_usage",
          retention: "report_retention",
        };
        const fn = typeof dashboard === "string" ? REPORT_FNS[dashboard] : undefined;
        if (!fn) return json({ error: "Unknown dashboard" }, 400);
        const args = fn === "report_retention" ? {} : { p_from: pFrom, p_to: pTo };
        const { data, error } = await adminClient.rpc(fn, args);
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, dashboard, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      // ── Trends panel (migration 040). Same posture as get_analytics_dashboard:
      // the privilege gate above already enforced developer/admin/owner, and the
      // edge function assembles NO SQL — it forwards scalar args to fixed report
      // functions whose own allowlists reject any metric/field outside the set.
      case "get_analytics_trend": {
        if (typeof metric !== "string") return json({ error: "Missing metric" }, 400);
        const { data, error } = await adminClient.rpc("report_trend", {
          p_metric: metric,
          p_granularity: typeof granularity === "string" ? granularity : "day",
          p_from: pFrom,
          p_to: pTo,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, metric, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_analytics_distribution": {
        if (typeof field !== "string") return json({ error: "Missing field" }, 400);
        const args: Record<string, unknown> = { p_field: field, p_from: pFrom, p_to: pTo };
        if (typeof granularity === "string" && granularity) args.p_granularity = granularity;
        if (Number.isFinite(Number(limit))) args.p_limit = Math.trunc(Number(limit));
        const { data, error } = await adminClient.rpc("report_distribution", args);
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, field, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_analytics_summary": {
        const { data, error } = await adminClient.rpc("report_summary", { p_from: pFrom, p_to: pTo });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_analytics_crosstab": {
        if (typeof rowField !== "string" || typeof colField !== "string") {
          return json({ error: "Missing rowField or colField" }, 400);
        }
        const { data, error } = await adminClient.rpc("report_crosstab", {
          p_row: rowField,
          p_col: colField,
          p_from: pFrom,
          p_to: pTo,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, rowField, colField, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      // ── System-mutation reports (migration 041). Same posture: fixed report
      // functions whose own allowlists reject out-of-set input; no SQL here.
      case "get_pulse_mutations": {
        const { data, error } = await adminClient.rpc("report_pulse_mutations", { p_from: pFrom, p_to: pTo });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_stressor_genesis": {
        const { data, error } = await adminClient.rpc("report_stressor_genesis", { p_from: pFrom, p_to: pTo });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_proposal_decisions": {
        const { data, error } = await adminClient.rpc("report_proposal_decisions", { p_from: pFrom, p_to: pTo });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_config_variance": {
        if (typeof configSignature !== "string" || !configSignature) {
          return json({ error: "Missing configSignature" }, 400);
        }
        const { data, error } = await adminClient.rpc("report_config_variance", {
          p_config_signature: configSignature, p_from: pFrom, p_to: pTo,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, configSignature, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      // ── Regional / NPC reports (migration 042) ──────────────────────────────
      case "get_regional_impacts": {
        const { data, error } = await adminClient.rpc("report_regional_impacts", { p_from: pFrom, p_to: pTo });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_channel_funnel": {
        const { data, error } = await adminClient.rpc("report_channel_funnel", { p_from: pFrom, p_to: pTo });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_regional_arcs": {
        const { data, error } = await adminClient.rpc("report_regional_arcs", { p_from: pFrom, p_to: pTo });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_regional_propagation": {
        const { data, error } = await adminClient.rpc("report_regional_propagation", { p_from: pFrom, p_to: pTo });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "get_npc_distribution": {
        if (typeof field !== "string") return json({ error: "Missing field" }, 400);
        const { data, error } = await adminClient.rpc("report_npc_distribution", { p_field: field, p_from: pFrom, p_to: pTo });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, field, rows: data || [], refreshedAt: new Date().toISOString() });
      }

      case "update_user_metadata": {
        // HIGHEST role only — defense-in-depth parity with grant_credits and the
        // account ban/disable cases. service_update_profile_metadata re-checks
        // privilege at the DB (and gates role/tier/is_founder writes), but this
        // user-management write must also fail closed at the edge so a
        // `support`-role caller never reaches the RPC.
        if (!isHighest) return json({ error: "Insufficient privileges" }, 403);
        if (!userId || !metadata) {
          return json({ error: "Missing userId or metadata" }, 400);
        }
        if (!isRecord(metadata)) {
          return json({ error: "metadata must be an object" }, 400);
        }

        let profilePatch: Record<string, unknown>;
        try {
          profilePatch = buildProfilePatch(metadata);
        } catch (e) {
          return json({ error: errorMessage(e) }, 400);
        }

        const { data: profileResult, error: profileError } =
          await adminClient.rpc("service_update_profile_metadata", {
            actor_user: callingUser.id,
            target_user: userId,
            profile_patch: profilePatch,
            reason: auditReason,
          });

        if (profileError) {
          return json({ error: profileError.message }, 500);
        }

        // profiles is the source of truth; auth metadata is a compatibility
        // mirror for legacy JWT/display-name surfaces.
        const { error: mirrorError } =
          await adminClient.auth.admin.updateUserById(userId, {
            user_metadata: profilePatch,
          });

        // A3: audit the mutation. Snapshot is REDACTED — only the patched keys
        // and the actor/target, never raw email/payment ids. A role change is
        // reversible; none of these patches are destructive.
        await writeAudit({
          action: "update_user_metadata",
          targetUserId: userId,
          targetType: "profile",
          targetId: String(userId),
          after: { keys: Object.keys(profilePatch) },
          destructive: false,
          reversible: true,
        });

        if (mirrorError) {
          console.warn("[admin-actions] user_metadata mirror failed:", mirrorError.message);
          return json({
            success: true,
            profile: profileResult,
            warning: "Profile updated, but auth metadata mirror failed",
          });
        }

        return json({ success: true, profile: profileResult });
      }

      case "list_users": {
        const rawSearch = typeof metadata?.search === "string"
          ? metadata.search.trim()
          : "";
        // Strip PostgREST logical-filter metacharacters so caller-supplied search
        // can't break out of the .or() expression (commas/parens/operator tokens).
        const search = rawSearch.replace(/[,()*\\]/g, " ").trim();

        // A3: REDACTED BY DEFAULT. Select an explicit non-PII column set — never
        // `select("*")` (which leaked raw email + stripe_customer_id to every
        // elevated role). The raw email for a single user is reachable only via
        // the audited get_user_full action below (highest role + reason).
        let query = adminClient
          .from("profiles")
          .select("id, role, tier, is_founder, credits, display_name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(100);

        if (search) {
          query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
        }

        const { data, error } = await query;
        if (error) return json({ error: error.message }, 500);

        // Mask the email in the response; the raw value is used ONLY server-side
        // for the search filter, never returned. No payment ids are selected.
        const masked = (data || []).map((u: Record<string, unknown>) => {
          const email = typeof u.email === "string" ? u.email : "";
          const at = email.indexOf("@");
          const email_masked = at > 0
            ? (email.length && at >= 1 ? email[0] + "***" : "*") + email.slice(at)
            : null;
          const { email: _raw, ...rest } = u;
          return { ...rest, email_masked, redacted: true };
        });

        return json({ users: masked });
      }

      // A3: REDACTED per-user summary (support+). Masked email, counts, status —
      // no raw PII. The default "open a user" read.
      case "get_user_summary": {
        if (!userId) return json({ error: "Missing userId" }, 400);
        const { data, error } = await adminClient.rpc("admin_user_summary", {
          target_user: userId,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, summary: data });
      }

      // A3: FULL-PII per-user read (HIGHEST role only + reason + audited). The
      // RPC itself re-checks the role and writes the audit row; we also gate at
      // the edge so support never reaches it.
      case "get_user_full": {
        if (!isHighest) return json({ error: "Insufficient privileges for full PII" }, 403);
        if (!userId) return json({ error: "Missing userId" }, 400);
        if (!auditReason) return json({ error: "A reason is required to read full PII" }, 400);
        const { data, error } = await adminClient.rpc("admin_user_full", {
          target_user: userId,
          p_reason: auditReason,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, user: data });
      }

      // A3: REDACTED support-ticket list (support+). Masked sender email.
      case "list_support_messages": {
        const status = typeof metadata?.status === "string" ? metadata.status : null;
        const { data, error } = await adminClient.rpc("admin_support_messages", {
          p_status: status,
          p_limit: 100,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, messages: data || [] });
      }

      case "update_user_credits": {
        // HIGHEST role only — defense-in-depth parity with grant_credits and the
        // account ban/disable cases. The service_set_credits RPC re-checks
        // privilege at the DB, but a setting-real-money action must also fail
        // closed at the edge so a `support`-role caller never reaches the RPC.
        if (!isHighest) return json({ error: "Insufficient privileges" }, 403);
        if (!userId || credits === undefined) {
          return json({ error: "Missing userId or credits" }, 400);
        }

        const newCredits = parseInt(String(credits), 10);
        if (!Number.isFinite(newCredits) || Number.isNaN(newCredits) || newCredits < 0) {
          return json({ error: "credits must be a non-negative integer" }, 400);
        }

        const { data: result, error: creditError } =
          await adminClient.rpc("service_set_credits", {
            actor_user: callingUser.id,
            target_user: userId,
            new_credits: newCredits,
            reason: auditReason,
          });

        if (creditError) {
          return json({ error: creditError.message }, 500);
        }

        // A3: audit the credit change. before/after balances are not PII; we log
        // them for accountability. Reversible (a credit set can be re-set).
        await writeAudit({
          action: "update_user_credits",
          targetUserId: userId,
          targetType: "profile",
          targetId: String(userId),
          before: result && typeof result === "object" && "prev" in result
            ? { credits: (result as Record<string, unknown>).prev }
            : null,
          after: { credits: newCredits },
          destructive: false,
          reversible: true,
        });

        return json({ success: true, ...(result || {}) });
      }

      case "get_stats": {
        const { data: profiles } = await adminClient
          .from("profiles")
          .select("tier, role, credits");

        const total = profiles?.length || 0;
        const premiumCount =
          profiles?.filter((p: any) => p.tier === "premium").length || 0;
        const totalCredits =
          profiles?.reduce((sum: number, p: any) => sum + (p.credits || 0), 0) ||
          0;
        const developerCount =
          profiles?.filter((p: any) =>
            ["developer", "admin"].includes(p.role)
          ).length || 0;

        return json({
          total,
          premiumCount,
          totalCredits,
          developerCount,
        });
      }

      // ── A4 user-management action set ───────────────────────────────────────
      // Each forwards the SERVER-VERIFIED actor id (callingUser.id) to a SECURITY
      // DEFINER RPC that re-checks the role AND writes its OWN single audit row.
      // We DON'T double-audit here — the RPC owns the audit so the role snapshot
      // and reason are written in one place. Soft-delete-first throughout.

      // Issue a warning (support+). Optionally notify the user by email.
      case "issue_warning": {
        if (!userId) return json({ error: "Missing userId" }, 400);
        if (!auditReason) return json({ error: "A warning reason is required" }, 400);
        const sev = typeof severity === "string" ? severity : "notice";
        let notified = false;
        if (metadata?.notify === true) {
          notified = await notifyTargetEmail(
            userId,
            "A notice about your SettlementForge account",
            `An administrator has issued a ${sev} warning on your account.\n\nReason: ${auditReason}\n\nIf you believe this is in error, reply to this email.`,
          );
        }
        const { data, error } = await adminClient.rpc("issue_warning", {
          p_actor: callingUser.id, p_target: userId,
          p_severity: sev, p_reason: auditReason, p_notified: notified,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, warningId: data, notified });
      }

      // Add an internal note about a user (support+). The user can never read it.
      case "add_internal_note": {
        if (!userId) return json({ error: "Missing userId" }, 400);
        if (typeof note !== "string" || !note.trim()) {
          return json({ error: "A note body is required" }, 400);
        }
        const { data, error } = await adminClient.rpc("add_internal_note", {
          p_actor: callingUser.id, p_target: userId, p_note: note,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, noteId: data });
      }

      // Read warning / internal-note history (support+). Notes are gated in the
      // RPC; the requesting user can never reach their own notes.
      case "list_warnings": {
        if (!userId) return json({ error: "Missing userId" }, 400);
        const { data, error } = await adminClient.rpc("admin_list_warnings", { p_target: userId });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, warnings: data || [] });
      }
      case "list_internal_notes": {
        if (!userId) return json({ error: "Missing userId" }, 400);
        const { data, error } = await adminClient.rpc("admin_list_internal_notes", { p_target: userId });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, notes: data || [] });
      }

      // Grant / refund credits — REUSES the audited service_set_credits RPC via
      // the existing update_user_credits path conceptually, but here we apply a
      // DELTA (grant +N / refund +N) computed from the current balance so the
      // caller doesn't have to know the absolute value. HIGHEST role only.
      case "grant_credits": {
        if (!isHighest) return json({ error: "Insufficient privileges" }, 403);
        if (!userId) return json({ error: "Missing userId" }, 400);
        const delta = parseInt(String(credits), 10);
        if (!Number.isFinite(delta) || Number.isNaN(delta) || delta === 0) {
          return json({ error: "credits delta must be a non-zero integer" }, 400);
        }
        const { data: prof } = await adminClient
          .from("profiles").select("credits").eq("id", userId).single();
        const prev = Number(prof?.credits ?? 0);
        const next = Math.max(0, prev + delta);
        const { data: result, error: creditError } =
          await adminClient.rpc("service_set_credits", {
            actor_user: callingUser.id, target_user: userId,
            new_credits: next, reason: auditReason,
          });
        if (creditError) return json({ error: creditError.message }, 500);
        // service_set_credits audits to admin_actions; mirror a row into the A3
        // append-only log so the unified trail captures grant/refund too.
        await writeAudit({
          action: delta > 0 ? "grant_credits" : "refund_credits",
          targetUserId: userId, targetType: "profile", targetId: String(userId),
          before: { credits: prev }, after: { credits: next },
          destructive: false, reversible: true,
        });
        return json({ success: true, prev, next, ...(result || {}) });
      }

      // Review billing — REDACTED Stripe summary (support+, masked customer id).
      case "review_billing": {
        if (!userId) return json({ error: "Missing userId" }, 400);
        const { data, error } = await adminClient.rpc("admin_billing_summary", {
          p_actor: callingUser.id, p_target: userId,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, billing: data });
      }

      // Disable / enable account — reversible soft flag. HIGHEST role only.
      // `enabled` semantics: pass enabled:true to RE-ENABLE; anything else (the
      // default) disables.
      case "set_account_disabled": {
        if (!isHighest) return json({ error: "Insufficient privileges" }, 403);
        if (!userId) return json({ error: "Missing userId" }, 400);
        const wantDisabled = !(enabled === true);
        const { data, error } = await adminClient.rpc("set_account_disabled", {
          p_actor: callingUser.id, p_target: userId,
          p_disabled: wantDisabled, p_reason: auditReason,
        });
        if (error) return json({ error: error.message }, 500);
        // Layer 2 (review B16 #1): invalidate the user's tokens/sessions at the
        // auth provider so the live JWT dies too. The DB profiles.disabled_at flag
        // (above) + the RLS/trigger account-status gate (migrations 057/059) reject
        // a disabled account's writes even with a valid JWT, but GoTrue's native ban
        // also kills the SESSION so the locked account can't keep reading either.
        // Soft-fails: if the admin call errors we still report success — the DB +
        // RLS layer already closed the write boundary.
        const authBan = await setGoTrueBan(userId, wantDisabled);
        return json({ success: true, sessionRevoked: authBan, ...(data || {}) });
      }

      // Ban / unban account — reversible soft flag. HIGHEST role only.
      case "set_account_banned": {
        if (!isHighest) return json({ error: "Insufficient privileges" }, 403);
        if (!userId) return json({ error: "Missing userId" }, 400);
        const wantBanned = !(enabled === true);
        let notified = false;
        if (wantBanned && metadata?.notify === true) {
          notified = await notifyTargetEmail(
            userId,
            "Your SettlementForge account has been suspended",
            `Your account has been suspended.${auditReason ? `\n\nReason: ${auditReason}` : ""}\n\nReply to this email to appeal.`,
          );
        }
        const { data, error } = await adminClient.rpc("set_account_banned", {
          p_actor: callingUser.id, p_target: userId,
          p_banned: wantBanned, p_reason: auditReason,
        });
        if (error) return json({ error: error.message }, 500);
        // Layer 2 (review B16 #1): a still-valid JWT no longer grants WRITE access
        // once banned_at is set — spend_credits / mutate_settlement_batch (057), the
        // direct-table RLS/trigger gate (059), and the AI edge functions'
        // account_is_active gate all reject a banned account. This ALSO eagerly
        // revokes the live session at the auth provider (GoTrue native ban) so the
        // SESSION dies, not just write access — closing the gap the profiles flag
        // alone never could. Soft-fails: the DB+RLS layer stands even if it errors.
        const sessionRevoked = await setGoTrueBan(userId, wantBanned);
        return json({ success: true, notified, sessionRevoked, ...(data || {}) });
      }

      // Soft-delete / restore a settlement — reversible. HIGHEST role only.
      case "soft_delete_settlement": {
        if (!isHighest) return json({ error: "Insufficient privileges" }, 403);
        if (!settlementId) return json({ error: "Missing settlementId" }, 400);
        const del = !(enabled === true); // enabled:true ⇒ restore
        const { data, error } = await adminClient.rpc("admin_soft_delete_settlement", {
          p_actor: callingUser.id, p_id: settlementId,
          p_delete: del, p_reason: auditReason,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, ...(data || {}) });
      }

      // Remove a public gallery item — unpublish (reversible). HIGHEST role only.
      case "remove_gallery_item": {
        if (!isHighest) return json({ error: "Insufficient privileges" }, 403);
        if (!settlementId) return json({ error: "Missing settlementId" }, 400);
        const { data, error } = await adminClient.rpc("admin_remove_gallery_item", {
          p_actor: callingUser.id, p_id: settlementId, p_reason: auditReason,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, ...(data || {}) });
      }

      // Revoke a public share link — clears the slug (reversible). HIGHEST role.
      case "revoke_share_link": {
        if (!isHighest) return json({ error: "Insufficient privileges" }, 403);
        if (!settlementId) return json({ error: "Missing settlementId" }, 400);
        const { data, error } = await adminClient.rpc("admin_revoke_share_link", {
          p_actor: callingUser.id, p_id: settlementId, p_reason: auditReason,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, ...(data || {}) });
      }

      // Diagnostic bundle — REDACTED by default (support+). full:true ⇒ a FULL
      // debug copy: HIGHEST role + a justification (reason). The RPC enforces
      // both and audits which variant it produced.
      case "diagnostic_bundle": {
        if (!userId) return json({ error: "Missing userId" }, 400);
        const wantFull = full === true;
        if (wantFull && !isHighest) {
          return json({ error: "A full debug copy requires admin or developer" }, 403);
        }
        if (wantFull && !auditReason) {
          return json({ error: "A justification is required for a full debug copy" }, 400);
        }
        const { data, error } = await adminClient.rpc("admin_diagnostic_bundle", {
          p_actor: callingUser.id, p_target: userId,
          p_full: wantFull, p_reason: auditReason,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, bundle: data, full: wantFull });
      }

      // Send an email to a user (reuse a send-email lifecycle template). The
      // template+payload are forwarded; the target's address is resolved
      // server-side. Writes one audit row (notified reflects the send result).
      case "send_user_email": {
        if (!userId) return json({ error: "Missing userId" }, 400);
        const subject = typeof emailPayload?.subject === "string"
          ? emailPayload.subject : "A message from SettlementForge";
        const body = typeof emailPayload?.body === "string"
          ? emailPayload.body
          : (typeof emailTemplate === "string" ? emailTemplate : "");
        if (!body.trim()) return json({ error: "An email body is required" }, 400);
        const notified = await notifyTargetEmail(userId, subject, body);
        await writeAudit({
          action: "send_user_email",
          targetUserId: userId, targetType: "profile", targetId: String(userId),
          after: { subject, length: body.length },
          destructive: false, reversible: true, notified,
        });
        return json({ success: true, notified });
      }

      // ── A5 support-ticket agent queue ───────────────────────────────────────
      // The queue + claim/assign/transition/reply/link surface for support+.
      // Each mutation forwards the SERVER-VERIFIED actor (callingUser.id) to a
      // SECURITY DEFINER RPC that re-checks the support role AND writes its OWN
      // audit row where material (claim / status / link). The lifecycle email is
      // sent here via notifyTargetEmail (service-role-resolved, soft-fail).

      // List the ticket pool (support+), filter by status. Masked sender email.
      case "list_ticket_pool": {
        const filter = typeof status === "string" && status ? status : null;
        const { data, error } = await adminClient.rpc("list_ticket_pool", {
          p_status: filter, p_limit: 100,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, tickets: data || [] });
      }

      // Read the full thread of a ticket (support+ sees ALL events including
      // internal notes). We call the RPC as the verified support agent via a
      // user-scoped client so its current_user_is_support_or_higher() resolves.
      case "list_ticket_thread": {
        if (typeof ticketId !== "string" || !ticketId) {
          return json({ error: "A ticketId is required" }, 400);
        }
        const { data, error } = await userClient.rpc("list_ticket_thread", { p_id: ticketId });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, events: data || [] });
      }

      // Claim a ticket — assign to the calling agent. Audited in the RPC.
      case "claim_ticket": {
        if (typeof ticketId !== "string" || !ticketId) {
          return json({ error: "A ticketId is required" }, 400);
        }
        const { data, error } = await adminClient.rpc("claim_ticket", {
          p_actor: callingUser.id, p_id: ticketId,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, ...(data || {}) });
      }

      // Transition status — audited in the RPC. Fires the lifecycle email to the
      // ticket owner on the notable transitions (assigned/waiting/resolved/etc).
      case "set_ticket_status": {
        if (typeof ticketId !== "string" || !ticketId) {
          return json({ error: "A ticketId is required" }, 400);
        }
        if (typeof status !== "string" || !status) {
          return json({ error: "A status is required" }, 400);
        }
        const { data, error } = await adminClient.rpc("set_ticket_status", {
          p_actor: callingUser.id, p_id: ticketId, p_status: status, p_reason: auditReason,
        });
        if (error) return json({ error: error.message }, 500);
        // Resolve the ticket owner to notify them of the lifecycle change.
        let notified = false;
        const NOTIFY_STATES: Record<string, string> = {
          assigned: "An agent is now looking at your ticket.",
          waiting_on_user: "We need a bit more information to continue.",
          resolved: "We've marked your ticket as resolved.",
          closed: "Your ticket has been closed.",
          reopened: "Your ticket has been reopened.",
        };
        if (NOTIFY_STATES[status]) {
          const { data: ticketRow } = await adminClient
            .from("support_messages").select("user_id, ticket_number").eq("id", ticketId).single();
          const ownerId = ticketRow?.user_id;
          if (ownerId) {
            notified = await notifyTargetEmail(
              ownerId,
              `Update on your support ticket ${ticketRow?.ticket_number ?? ""}`,
              `${NOTIFY_STATES[status]}${auditReason ? `\n\nNote: ${auditReason}` : ""}\n\n` +
              `You can view and reply from the Support section of your account.`,
            );
          }
        }
        return json({ success: true, notified, ...(data || {}) });
      }

      // Post a reply — agent may post a user-visible reply OR an internal note.
      // An internal note is NEVER visible to the ticket owner (enforced in the
      // RPC + RLS). On a user-visible reply we notify the owner by email.
      case "post_ticket_reply": {
        if (typeof ticketId !== "string" || !ticketId) {
          return json({ error: "A ticketId is required" }, 400);
        }
        if (typeof replyBody !== "string" || !replyBody.trim()) {
          return json({ error: "A reply body is required" }, 400);
        }
        const vis = visibility === "internal" ? "internal" : "user";
        const { data, error } = await adminClient.rpc("post_ticket_reply", {
          p_actor: callingUser.id, p_id: ticketId, p_body: replyBody.trim(), p_visibility: vis,
        });
        if (error) return json({ error: error.message }, 500);
        let notified = false;
        if (vis === "user") {
          const { data: ticketRow } = await adminClient
            .from("support_messages").select("user_id, ticket_number").eq("id", ticketId).single();
          const ownerId = ticketRow?.user_id;
          if (ownerId) {
            notified = await notifyTargetEmail(
              ownerId,
              `New reply on your support ticket ${ticketRow?.ticket_number ?? ""}`,
              `Support has replied to your ticket.\n\nView and reply from the Support ` +
              `section of your account.`,
            );
          }
        }
        return json({ success: true, notified, ...(data || {}) });
      }

      // Link an FAQ article to a ticket when answering (support+). Audited.
      case "link_ticket_faq": {
        if (typeof ticketId !== "string" || !ticketId) {
          return json({ error: "A ticketId is required" }, 400);
        }
        if (typeof faq !== "string" || !faq.trim()) {
          return json({ error: "An FAQ slug is required" }, 400);
        }
        const { data, error } = await adminClient.rpc("link_ticket_faq", {
          p_actor: callingUser.id, p_id: ticketId, p_faq: faq.trim(),
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true, ...(data || {}) });
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
serve((req) => handleAdminActions(req));
