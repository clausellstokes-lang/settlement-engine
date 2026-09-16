/**
 * twoKey.ts — the ACCOUNT-level "two-key" confirmation rule (owner-ordered
 * 2026-07-21): a destructive change to an account's premium/tier/entitlement
 * status, or a ban / disable / role change, requires the admin to (1) retype the
 * target's exact user id AND (2) re-authenticate with their OWN password.
 *
 * The password never touches our code. The client calls GoTrue's
 * signInWithPassword (reauthenticateWithPassword in authSecurity.js), which — on
 * success — mints a NEW session whose access-token JWT carries a fresh `amr`
 * (Authentication Method Reference) entry {method:"password", timestamp:<now>}.
 * A token REFRESH preserves the ORIGINAL amr timestamps, so a stale session can
 * never fake freshness: only a real, recent GoTrue password verification produces
 * a password-amr within FRESHNESS_WINDOW_S. That is the cryptographic teeth of
 * this gate — the server verifies the SIGNED claim, not a value we could be
 * tricked into trusting.
 *
 * ACTION-bound, not role-bound: whoever invokes a protected action — admin OR
 * developer (owner order: "make that for developers too") — passes the identical
 * gate. The set below is the single source of truth; the walker
 * (tests/edgeFunctions/adminActionTwoKeyWalker.test.js) asserts every switch case
 * in admin-actions is classified into exactly one of PROTECTED / BROADCAST /
 * MODERATION / UNGATED, so a new action can never silently escape
 * classification.
 *
 * This module is PURE (no Deno globals, no network, no https imports) so the edge
 * function, the Deno unit test, and the vitest walker can all read it.
 */

export const FRESHNESS_WINDOW_S = 300;

/**
 * PROTECTED — the two-key set. Every action here changes an ACCOUNT's
 * premium/tier/entitlement status, bans/disables the account, or changes a role.
 * Each targets a specific user id (`userId`), so the retype-the-id half of the
 * gate always has a concrete target. Fail-closed: an action whose destructiveness
 * is ambiguous belongs IN this set, not out of it.
 */
export const PROTECTED_ACTION_SET: ReadonlySet<string> = new Set([
  "update_user_metadata", // role / tier / is_founder (role escalation ≥ a ban)
  "update_user_credits", // absolute credit set (paid entitlement)
  "grant_credits", // credit delta grant/refund (paid entitlement)
  "set_account_disabled", // disable / enable an account
  "set_account_banned", // ban / unban an account
  "grant_surveyor", // grant the surveyor entitlement
  "revoke_surveyor", // revoke the surveyor entitlement (destructive)
]);

/**
 * BROADCAST — the mass-delivery two-key set. Queueing a message to every account
 * is not an account-targeted mutation, so the account-id guard above cannot
 * express its deliberate-confirmation key. It gets a separate closed set and a
 * separate exact phrase while sharing the same fresh-password AMR proof.
 *
 * Cancellation is intentionally not here: it reduces blast radius and must stay
 * available throughout the short mercy window without demanding another
 * password ceremony. The edge still restricts it to the highest roles.
 */
export const BROADCAST_ACTION_SET: ReadonlySet<string> = new Set([
  "queue_operator_broadcast",
]);

export const BROADCAST_CONFIRMATION_PHRASE = "SEND TO ALL";

/**
 * MODERATION — reversible, staff-only content moderation. These get the
 * typed-ITEM-id confirm (retype the exact settlement/map/comment id) but NOT the
 * password re-auth, so routine moderation stays workable (manager decision,
 * 2026-07-21, vetoable). The password gate is reserved for the ACCOUNT set above.
 */
export const MODERATION_ACTION_SET: ReadonlySet<string> = new Set([
  "soft_delete_settlement",
  "remove_gallery_item",
  "revoke_share_link",
  "soft_delete_map", // map/campaign soft-delete (171)
  "remove_gallery_map", // map/campaign set-private (171)
  "set_content_banned", // reversible ban across both content kinds (171)
  "moderate_comment", // hide/unhide a gallery comment → tombstone (169/172)
  // Report-queue resolution (resolve_gallery_report) is added with its case.
]);

/**
 * UNGATED — everything else: read-only reads AND non-destructive staff writes
 * (warnings, notes, ticket workflow, system config, mint, one-time backfill). No
 * extra confirm beyond the existing role gate. (The manager's third walker class
 * is named READ_ONLY; it is spelled UNGATED here because it legitimately holds
 * non-destructive WRITES too, e.g. issue_warning — accurate name, same contract.)
 */
export const UNGATED_ACTION_SET: ReadonlySet<string> = new Set([
  "get_analytics_dashboard",
  "get_client_error_dashboard",
  "get_operational_health",
  "get_analytics_trend",
  "get_analytics_distribution",
  "get_analytics_summary",
  "get_analytics_crosstab",
  "get_pulse_mutations",
  "get_stressor_genesis",
  "get_proposal_decisions",
  "get_config_variance",
  "get_regional_impacts",
  "get_channel_funnel",
  "get_regional_arcs",
  "get_regional_propagation",
  "get_npc_distribution",
  "list_users",
  "get_user_summary",
  "get_user_full",
  "list_support_messages",
  "get_stats",
  "issue_warning",
  "add_internal_note",
  "list_warnings",
  "list_internal_notes",
  "mint_redeem_code",
  "ai_pricing_resync",
  "ai_pricing_cron_status",
  "ai_pricing_cron_set",
  "review_billing",
  "diagnostic_bundle",
  "send_operator_message",
  "list_operator_broadcasts",
  "cancel_operator_broadcast",
  "list_ticket_pool",
  "list_ticket_thread",
  "claim_ticket",
  "set_ticket_status",
  "post_ticket_reply",
  "link_ticket_faq",
  "backfill_money_events",
  // Acknowledgement is an audited note over an obligation that remains visible
  // and retryable. It moves no money, erases no privacy work, and changes no
  // account entitlement, so the ordinary highest-role gate is sufficient.
  "acknowledge_operational_obligation",
  // list_gallery_reports is added with the report-pipeline lane's switch case.
]);

/** True iff `action` is a two-key protected action. */
export function isProtectedAction(action: unknown): boolean {
  return typeof action === "string" && PROTECTED_ACTION_SET.has(action);
}

/** True iff `action` queues a mass delivery and needs broadcast two-key. */
export function isBroadcastAction(action: unknown): boolean {
  return typeof action === "string" && BROADCAST_ACTION_SET.has(action);
}

/** One amr entry as GoTrue mints it. */
export interface AmrEntry {
  method?: string;
  timestamp?: number;
}

/**
 * Decode the `amr` claim from an already-signature-verified access token WITHOUT
 * re-verifying it (the edge function's getUser() already verified the JWT; we
 * only read one claim). Mirrors authSecurity.js/decodeJwtSessionId +
 * sessionGate.ts/decodeSessionId. Returns null on any unrecognised shape.
 */
export function decodeJwtAmr(token: unknown): AmrEntry[] | null {
  try {
    const parts = String(token || "").split(".");
    if (parts.length < 2) return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    payload += "=".repeat((4 - (payload.length % 4)) % 4);
    const claims = JSON.parse(atob(payload));
    const amr = claims?.amr;
    return Array.isArray(amr) ? (amr as AmrEntry[]) : null;
  } catch {
    return null;
  }
}

/** The freshest password-amr timestamp (seconds), or null if none present. */
export function latestPasswordAmrTs(amr: unknown): number | null {
  if (!Array.isArray(amr)) return null;
  let latest: number | null = null;
  for (const e of amr) {
    if (
      e && typeof e === "object" &&
      (e as AmrEntry).method === "password" &&
      typeof (e as AmrEntry).timestamp === "number"
    ) {
      const ts = (e as AmrEntry).timestamp as number;
      if (latest === null || ts > latest) latest = ts;
    }
  }
  return latest;
}

export interface TwoKeyContext {
  action: string;
  /** The action's target user id (all protected actions target `userId`). */
  targetUserId: unknown;
  /** body.confirm.typedTargetId — the id the admin retyped. */
  typedTargetId: unknown;
  /** The caller's decoded JWT `amr` claim (array of {method,timestamp}). */
  amr: unknown;
  /** Current time in UNIX seconds. */
  nowS: number;
  /** Override the freshness window (seconds); defaults to FRESHNESS_WINDOW_S. */
  freshnessWindowS?: number;
}

export interface TwoKeyResult {
  ok: boolean;
  /** Machine reason (audited server-side only; never leaked to the caller). */
  reason:
    | "ok"
    | "missing_target"
    | "missing_typed_id"
    | "typed_id_mismatch"
    | "no_password_amr"
    | "amr_stale";
  /** Age of the freshest password-amr in seconds (nowS − ts), or null. */
  amrAgeS: number | null;
}

export interface BroadcastTwoKeyContext {
  action: string;
  /** body.confirm.typedBroadcastPhrase — the phrase the operator retyped. */
  typedBroadcastPhrase: unknown;
  /** The caller's decoded JWT `amr` claim (array of {method,timestamp}). */
  amr: unknown;
  /** Current time in UNIX seconds. */
  nowS: number;
  /** Override the freshness window (seconds); defaults to FRESHNESS_WINDOW_S. */
  freshnessWindowS?: number;
}

export interface BroadcastTwoKeyResult {
  ok: boolean;
  reason:
    | "ok"
    | "missing_typed_phrase"
    | "typed_phrase_mismatch"
    | "no_password_amr"
    | "amr_stale";
  amrAgeS: number | null;
}

/**
 * The pure guard core. Rejects unless BOTH keys check out:
 *   1. body.confirm.typedTargetId is present and EXACTLY equals the target user
 *      id (string equality after trim, NO case-folding — ids are UUIDs);
 *   2. the caller's JWT carries a `password` amr entry whose timestamp is within
 *      the freshness window of now (a refreshed token keeps the ORIGINAL amr
 *      timestamp, so only a real recent password verification passes).
 * Fails CLOSED: an absent/malformed amr rejects rather than weakening the check.
 */
export function checkTwoKey(ctx: TwoKeyContext): TwoKeyResult {
  const win = ctx.freshnessWindowS ?? FRESHNESS_WINDOW_S;

  const target = typeof ctx.targetUserId === "string" ? ctx.targetUserId.trim() : "";
  if (!target) return { ok: false, reason: "missing_target", amrAgeS: null };

  const typed = typeof ctx.typedTargetId === "string" ? ctx.typedTargetId.trim() : "";
  if (!typed) return { ok: false, reason: "missing_typed_id", amrAgeS: null };
  if (typed !== target) return { ok: false, reason: "typed_id_mismatch", amrAgeS: null };

  const latest = latestPasswordAmrTs(ctx.amr);
  if (latest === null) return { ok: false, reason: "no_password_amr", amrAgeS: null };

  const amrAgeS = ctx.nowS - latest;
  // "within the window of now" — a refreshed token's old timestamp is far in the
  // past (rejected); clock skew a little either way is tolerated symmetrically.
  if (Math.abs(amrAgeS) > win) return { ok: false, reason: "amr_stale", amrAgeS };

  return { ok: true, reason: "ok", amrAgeS };
}

/**
 * Mass-delivery sibling of `checkTwoKey`. The literal is deliberately closed,
 * case-sensitive, and compared after trimming paste-only outer whitespace. A
 * caller cannot substitute an audience label supplied by the client.
 */
export function checkBroadcastTwoKey(
  ctx: BroadcastTwoKeyContext,
): BroadcastTwoKeyResult {
  const typed = typeof ctx.typedBroadcastPhrase === "string"
    ? ctx.typedBroadcastPhrase.trim()
    : "";
  if (!typed) {
    return { ok: false, reason: "missing_typed_phrase", amrAgeS: null };
  }
  if (typed !== BROADCAST_CONFIRMATION_PHRASE) {
    return { ok: false, reason: "typed_phrase_mismatch", amrAgeS: null };
  }

  const latest = latestPasswordAmrTs(ctx.amr);
  if (latest === null) {
    return { ok: false, reason: "no_password_amr", amrAgeS: null };
  }
  const amrAgeS = ctx.nowS - latest;
  const win = ctx.freshnessWindowS ?? FRESHNESS_WINDOW_S;
  if (Math.abs(amrAgeS) > win) {
    return { ok: false, reason: "amr_stale", amrAgeS };
  }
  return { ok: true, reason: "ok", amrAgeS };
}
