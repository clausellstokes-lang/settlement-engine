/**
 * Pure planning and admission policy for the production migration train.
 *
 * The executable shell lives in migration-rehearsal.mjs. Keeping the contract
 * here makes three consequential properties testable without a database:
 *
 *   - the checked-in waves cover every pending migration exactly once;
 *   - rollback posture is explicit even when an older migration omitted its own
 *     `@rollback` annotation;
 *   - a database is admitted only when a short-lived attestation binds an exact
 *     clone target to the source backup and declares the isolation controls.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

export const MIGRATION_TRAIN_BASE_HEAD = 121;
export const MIGRATION_TRAIN_REPO_HEAD = 211;

const FORWARD_ONLY_REASON = [
  'No automatic schema rollback is admitted for this wave.',
  'Recover by a reviewed forward-fix; use PITR only for destructive data repair.',
].join(' ');

/**
 * The boundaries are intentionally semantic rather than equal-sized batches.
 * A failed wave stops the train before the next product subsystem is exposed.
 */
export const MIGRATION_WAVES = Object.freeze([
  Object.freeze({
    id: 'activation-trust-and-market-plane',
    from: 122,
    to: 136,
    purpose: 'Dossier purchases, projection privacy, email preferences, analytics, and corpus contracts.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: FORWARD_ONLY_REASON,
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.dossier_purchases' }),
      Object.freeze({ kind: 'table', name: 'public.user_action_rate_limits' }),
      Object.freeze({ kind: 'table', name: 'public.email_preferences' }),
      Object.freeze({ kind: 'function', name: 'rollup_intent_atlas_daily' }),
    ]),
  }),
  Object.freeze({
    id: 'founder-surveyor-and-community',
    from: 137,
    to: 156,
    purpose: 'Founder-seat custody, Surveyor entitlements/governors, AI audit, gallery reactions, and abuse controls.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: FORWARD_ONLY_REASON,
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.founder_seats' }),
      Object.freeze({ kind: 'table', name: 'public.ai_operation_log' }),
      Object.freeze({ kind: 'table', name: 'public.surveyor_entitlements' }),
      Object.freeze({ kind: 'table', name: 'public.gallery_reactions' }),
      Object.freeze({ kind: 'table', name: 'public.token_buckets' }),
    ]),
  }),
  Object.freeze({
    id: 'money-lifecycle-and-moderation',
    from: 157,
    to: 174,
    purpose: 'Money events, auto-reload, founder lifecycle, sessions, retention, moderation, and margin policy.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: FORWARD_ONLY_REASON,
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.money_events' }),
      Object.freeze({ kind: 'table', name: 'public.credit_auto_reload_settings' }),
      Object.freeze({ kind: 'table', name: 'public.founder_transfer_cases' }),
      Object.freeze({ kind: 'table', name: 'public.current_account_session' }),
      Object.freeze({ kind: 'table', name: 'public.gallery_map_reports' }),
    ]),
  }),
  Object.freeze({
    id: 'durable-external-obligations',
    from: 175,
    to: 182,
    purpose: 'Crash-recoverable deletion, refund, webhook, and operator-attention obligations.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Roll workers and webhook callers back before forward-fixing their database contracts.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.account_deletion_cleanup_jobs' }),
      Object.freeze({ kind: 'table', name: 'public.payment_refund_obligations' }),
      Object.freeze({ kind: 'table', name: 'public.operational_obligation_acknowledgements' }),
      Object.freeze({ kind: 'function', name: 'report_operational_obligation_health' }),
      Object.freeze({ kind: 'function', name: 'claim_stripe_webhook_event' }),
    ]),
  }),
  Object.freeze({
    id: 'application-command-authority',
    from: 183,
    to: 184,
    purpose: 'Durable command identity, revision compare-and-swap, reconciliation, and the first atomic canon-event and structured-import verticals.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Roll the CUT_TRADE_ROUTE and structured-import callers back before forward-fixing the journal/RPC contracts.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.application_command_journal' }),
      Object.freeze({ kind: 'function', name: 'claim_application_command' }),
      Object.freeze({ kind: 'function', name: 'apply_cut_trade_route_command' }),
      Object.freeze({ kind: 'function', name: 'apply_import_reconciliation_command' }),
      Object.freeze({ kind: 'function', name: 'report_application_command_health' }),
    ]),
  }),
  Object.freeze({
    id: 'versioned-custom-content',
    from: 185,
    to: 185,
    purpose: 'Immutable custom-content revisions, pack and environment versions, reviewed activation, and the transactional extension-language command boundary.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Before the first revisioned write, an unused rehearsal clone may be discarded.',
        'After the first write, preserve authored history and repair only with a reviewed forward migration.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.custom_content_definitions' }),
      Object.freeze({ kind: 'table', name: 'public.custom_content_revisions' }),
      Object.freeze({ kind: 'table', name: 'public.content_pack_versions' }),
      Object.freeze({ kind: 'table', name: 'public.content_environment_revisions' }),
      Object.freeze({ kind: 'function', name: 'apply_custom_content_command' }),
    ]),
  }),
  Object.freeze({
    id: 'campaign-content-binding-authority',
    from: 186,
    to: 186,
    purpose: 'Server-authoritative campaign content-binding compare-and-swap on the canonical saved-map envelope.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Roll campaign-binding writers back before forward-fixing the saved-map trigger and compare-and-swap RPC.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'function',
        name: 'compare_and_swap_campaign_content_binding',
      }),
      Object.freeze({
        kind: 'function',
        name: 'enforce_campaign_content_binding_cas',
      }),
    ]),
  }),
  Object.freeze({
    id: 'custom-content-archive-transfer',
    from: 187,
    to: 187,
    purpose: 'Canonical custom-content archive export, deterministic restore, and browser-local premium cutover.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Preserve imported constitutional history and repair archive-transfer contracts only with a reviewed forward migration.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'table',
        name: 'public.custom_content_archive_imports',
      }),
      Object.freeze({
        kind: 'function',
        name: 'import_custom_content_archive',
      }),
      Object.freeze({
        kind: 'function',
        name: 'export_custom_content_archive',
      }),
    ]),
  }),
  Object.freeze({
    id: 'reviewed-supply-chain-persistence',
    from: 188,
    to: 188,
    purpose: 'Exact reviewed-derived supply-chain identity, transaction-bound command authority, archive repair, and campaign-binding persistence.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Preserve reviewed revisions, lifecycle generations, environment and campaign references, archive receipts, and quarantine evidence.',
        'Repair reviewed supply-chain persistence only with a reviewed forward migration.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'function',
        name: 'apply_reviewed_supply_chain_command',
      }),
    ]),
  }),
  Object.freeze({
    id: 'wave8-reversal-safety',
    from: 189,
    to: 190,
    purpose: 'Wave 8 money-and-privacy safety: faction-member public-scrub parity and the credit-pack refund clawback.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        '189 recreates the gallery sanitizer net-current (a narrower predicate would re-open the member-privacy leak);',
        '190 writes clawback ledger rows that are money truth — never unwound automatically.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'function',
        name: '_gallery_sanitize_public_json',
      }),
      Object.freeze({
        kind: 'function',
        name: 'system_clawback_credits',
      }),
    ]),
  }),
  Object.freeze({
    id: 'surveyor-probe-and-tier-price',
    from: 191,
    to: 192,
    purpose: 'Surveyor BYOK capability probing (profile columns + probe-tier RPCs) and the tier credit multiplier on spend_credits — priced identity until the owner seeds ai_tier_multipliers.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        '191 recreates surveyor_byok_set carrying the 143 health-reset repair that 159 dropped — reverting reopens that regression;',
        '192 recreates the net-current spend_credits; with no seeded multiplier row it charges base prices, so forward is already the safe state.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'function',
        name: 'surveyor_byok_set_probe_tier',
      }),
      Object.freeze({
        kind: 'function',
        name: 'spend_credits',
      }),
    ]),
  }),
  Object.freeze({
    id: 'bilateral-user-route-command',
    from: 193,
    to: 193,
    purpose: 'The bilateral user-route command: both endpoint base-projection compare-and-swaps, the shared journal claim, and the final receipt in one transaction.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Roll the CREATE_ROUTE caller back before forward-fixing the RPC: dropping it while clients still call it turns every user route into a hard failure,',
        'and the routes already written are world truth carried in the settlement rows, not in anything this migration owns.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'function',
        name: 'apply_create_route_command',
      }),
      Object.freeze({
        kind: 'function',
        name: 'assert_create_route_half',
      }),
    ]),
  }),
  Object.freeze({
    id: 'operator-messages-consent-and-courier',
    from: 194,
    to: 194,
    purpose: 'Private operator-message receipts, explicit announcement consent, durable consent history, and the lease-safe broadcast courier.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Roll Account, admin, unsubscribe, and courier callers back before forward-fixing their RPC contracts.',
        'Preserve in-product delivery receipts and consent-change records as user-facing and compliance evidence; never erase them with an automatic rollback.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({
        kind: 'table',
        name: 'public.operator_messages',
      }),
      Object.freeze({
        kind: 'table',
        name: 'public.operator_message_receipts',
      }),
      Object.freeze({
        kind: 'table',
        name: 'public.operator_message_delivery_jobs',
      }),
      Object.freeze({
        kind: 'table',
        name: 'public.consent_change_records',
      }),
      Object.freeze({
        kind: 'function',
        name: 'claim_operator_message_recipient',
      }),
      Object.freeze({
        kind: 'function',
        name: 'list_my_operator_messages',
      }),
    ]),
  }),
  Object.freeze({
    id: 'civility-guard-and-public-identity',
    from: 195,
    to: 195,
    purpose: 'The civility guard\'s server mirror — blocklist and allowlist as data, the '
      + 'normalize/blocked verdict pair, and the display-name and gallery-comment writers '
      + 'that consult it — plus the public display identity\'s consent column and its '
      + 'avatars storage bucket.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        // ⚠ THIS WAVE POLICY IS THE FALLBACK, NOT 195's CLASSIFICATION. 195 ships
        // supabase/rollback/195_civility_guard_and_public_identity.down.sql, so
        // classifyRollback resolves it to `data-safe-down-script` and never reads this
        // reason. It is written for the wave's SUCCESSORS, and it states the half the
        // down script deliberately does not cover.
        FORWARD_ONLY_REASON,
        'The 195 down script is PARTIAL by design: it drops the avatars policies, restores '
        + 'add_gallery_comment and update_display_name to their prior bodies, and drops the '
        + 'four civility functions.',
        'It deliberately does NOT drop profiles.public_identity_opt_in (recorded consent), '
        + 'the operator-curated civility term/allow tables, their RLS tightening, or the '
        + 'avatars bucket row — those are data and security reversals.',
        'Revert the client in the same window: an account that already opted in would '
        + 'otherwise stay published with no server-side guard behind it.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.civility_terms' }),
      Object.freeze({ kind: 'table', name: 'public.civility_allow' }),
      Object.freeze({ kind: 'function', name: 'civility_normalize' }),
      Object.freeze({ kind: 'function', name: 'civility_blocked' }),
    ]),
  }),
  Object.freeze({
    id: 'simulation-metrics-storage',
    from: 196,
    to: 196,
    purpose: 'The SIMULATION metric class gets its own PII-free-by-schema table, a '
      + 'service-role loader and a run-scoped rollup. Nothing in the running product '
      + 'reads or writes it: the rows are engine evidence produced by the diagnostic '
      + 'soak harness, so this wave exposes no user-facing subsystem at all.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'No down script is shipped, and that is a decision rather than an omission: the '
        + 'only reversal is DROP TABLE public.world_sim_metrics, which destroys the '
        + 'accumulated engine evidence the table exists to hold. Reversing this wave is '
        + 'therefore a data-destroying act and must be a reviewed, deliberate one.',
        'A forward fix is cheap by construction. No running code path reads the table, '
        + 'so a defect here cannot degrade any product surface — it can only make the '
        + 'next soak load fail loudly, which is the direction that gets noticed.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.world_sim_metrics' }),
      Object.freeze({ kind: 'function', name: 'load_sim_metrics' }),
      Object.freeze({ kind: 'function', name: 'rollup_sim_metrics' }),
    ]),
  }),
  Object.freeze({
    id: 'consent-person-adjacent-default',
    from: 197,
    to: 197,
    purpose: 'Consent model v3 (§359.6): anything person-adjacent defaults OFF, so the '
      + '`research` plane returns to opt-IN on the server. This is the FIRST wave in the '
      + 'train to UPDATE existing telemetry_consent rows — 124 moved the column default '
      + 'and deliberately rewrote nothing — so the wave that matters here is a DATA wave, '
      + 'not a shape wave: it creates no object and defines no function. It reads '
      + 'public.consent_change_records (194) in its predicate and, through 194\'s existing '
      + 'trigger, causes a system-sourced row to be written there for each profile it '
      + 'flips. The anonymous simulation half of the ruling needs no migration at all: '
      + 'world_sim_metrics is PII-free by schema, so nothing about it is consent-gated.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'The column-default half IS trivially reversible (restore 124\'s default), and the '
        + 'migration\'s own @rollback annotation spells that statement out — which is why '
        + 'this migration classifies as documented-manual-reversal rather than taking the '
        + 'wave policy.',
        'The DATA half is deliberately not scripted. Re-flipping the updated rows back to '
        + 'research:true would re-opt-in a population on a default they never chose, which '
        + 'is the v2 lesson run backwards and a worse harm than the drift it would undo. '
        + 'The affected rows are individually identifiable — a consent_change_records row, '
        + 'research true→false, source \'system\', inside this migration\'s window — so a '
        + 'targeted reversal remains possible on owner direction. It is unscripted because '
        + 'doing it unreviewed is the harm, not because it is impossible.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.profiles' }),
    ]),
  }),
  Object.freeze({
    id: 'retention-numbers',
    from: 198,
    to: 198,
    purpose: 'The concrete retention numbers (§359.7): raw analytics_events shorten from '
      + '400 days to 90, the retention cohorts move from a destructively-recomputed '
      + 'materialized view to a durable append table, and the research plane gets an '
      + 'export-then-prune ceiling gated on the export receipt. This is the train\'s '
      + 'first wave whose risk is what it DELETES rather than what it exposes, so the '
      + 'operator review is of the two prune gates, not of the DDL: the 90-day window '
      + 'activates only while the cohort table is non-empty, and a research row is '
      + 'prunable only when 038\'s export_cursors receipt covers it. Both fail closed. '
      + 'The 038 materialized view is deliberately KEPT for one release — '
      + 'report_retention() re-targets the table behind an unchanged return type and an '
      + 'unchanged grant surface — so no reader breaks on deploy.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'The SHAPE half of this wave is reversible in a handful of statements and the '
        + 'migration\'s own @rollback annotation spells them out, which is why it '
        + 'classifies as documented-manual-reversal rather than taking the wave policy.',
        'The DELETIONS are not reversible by any script: once a run has pruned raw events '
        + 'past 90 days, or an exported research row past the 400-day ceiling, those rows '
        + 'are gone and re-lengthening an interval cannot return them. PITR is the only '
        + 'recovery, which is the ordinary posture for a destructive data act.',
        'One combination must never be rehearsed as safe: reverting the SHAPE while '
        + 'leaving the shortened window in place would re-establish the destructive '
        + 'full-refresh cohort recompute over a 90-day raw history. Revert both halves or '
        + 'neither.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.analytics_retention_cohorts' }),
      Object.freeze({ kind: 'function', name: 'append_retention_cohorts' }),
      Object.freeze({ kind: 'function', name: 'analytics_monthly_prune' }),
      Object.freeze({ kind: 'function', name: 'analytics_nightly_maintenance' }),
      Object.freeze({ kind: 'function', name: 'report_retention' }),
    ]),
  }),
  Object.freeze({
    id: 'referral-funnel-report',
    from: 199,
    to: 199,
    purpose: 'The READ half of the referral funnel (§359.8): one SECURITY DEFINER report '
      + 'function, service_role only, that counts public.referrals\' intent / grant / '
      + 'clawback stamps per day. It is the smallest wave in the train by construction — it '
      + 'creates no table, alters no column, writes no row and touches no policy, because the '
      + 'conversion half of the funnel deliberately mints NO new record: the referral tables '
      + 'already hold the money-grade truth and a second, weaker ledger on the money path was '
      + 'the alternative this member refused. The operator-visible surface is one admin card; '
      + 'the money path itself is byte-unchanged, and the wave exposes no user-facing '
      + 'subsystem at all.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'This wave is nonetheless the cheapest reversal in the train, and the migration\'s own '
        + '@rollback annotation spells the whole of it out as a single statement — which is why '
        + '199 classifies as documented-manual-reversal rather than taking the wave policy. '
        + 'Dropping the function destroys nothing: it holds no state, nothing else depends on '
        + 'it, and the only consequence is that one admin card reports an error while every '
        + 'other panel keeps working.',
        'A forward fix is likewise cheap. No product code path calls the function — only the '
        + 'privilege-gated admin-actions edge route does — so a defect here cannot degrade any '
        + 'user-facing surface; it can only make one operator card show its error, which is the '
        + 'direction that gets noticed.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: 'report_referral_funnel' }),
    ]),
  }),
  Object.freeze({
    id: 'deity-authored-character-check',
    from: 200,
    to: 200,
    purpose: 'W-FAITH F1c\'s legacy-table half (the 049/056 idiom): ONE re-stated CHECK '
      + 'on public.custom_content admitting the deity\'s authored character — '
      + 'authoredTemper (optional; warlike/peacelike/neutral; absent reads as "derive"), '
      + 'the paradigm-chart positions, and the typed boon/bane pairs. It creates no '
      + 'table, no column, no function, no policy and writes no row — DROP CONSTRAINT '
      + 'IF EXISTS then ADD CONSTRAINT custom_content_deity_axes_check is the whole '
      + 'wave. The JS admission wall, the edge validator and migration 185\'s '
      + '_custom_content_record_valid already refuse the same malformed values, so '
      + 'this is the only half of the law not yet true in production. Reviewed at the '
      + 'SUBSTRATE landing when the scope sentinel demanded the manifest extend; '
      + 'DEPLOYMENT remains the owner\'s manual act, and until it the repo head '
      + 'sits visibly ahead of the applied head by design.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: FORWARD_ONLY_REASON,
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'table', name: 'public.custom_content' }),
    ]),
  }),
  Object.freeze({
    id: 'staff-unlock-surveyor-entitlement',
    from: 201,
    to: 201,
    purpose: 'ODQ §934.28 (the owner: every paid feature unlocked for developers and admins, '
      + 'for now): ONE re-stated SECURITY DEFINER function. public.has_surveyor_entitlement() '
      + 'is 139\'s body verbatim plus a single disjunct — `or public.current_user_is_privileged()` '
      + '— checked BEFORE the entitlement row so a staff account never depends on one existing. '
      + 'That function is the gate nine edge functions and surveyor_byok_set (159) route through, '
      + 'so curing it here makes the client\'s staff predicate and the server agree by construction '
      + 'instead of by vigilance. It creates no table, no column, no policy and no row; it mints '
      + 'no entitlement, leaves the surveyor_stage_enabled() kill switch and has_dossier_entitlement '
      + '(108) untouched, and opens no purchase. The role it honours is not client-writable (018\'s '
      + 'profiles UPDATE policy pins role; 061 locks the moderation columns). Reviewed at the '
      + '2026-09-18 fixes landing when the scope sentinel demanded the manifest extend; DEPLOYMENT '
      + 'remains the owner\'s manual act (`supabase db push` plus the applied-head bump in the same '
      + 'act), and until it the repo head sits visibly ahead of the applied head by design.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 199, this wave is one re-stated function and its own @rollback annotation spells '
        + 'the whole reversal out: recreate 139\'s body verbatim, i.e. the same function with the '
        + 'privileged disjunct removed — which is why 201 classifies as documented-manual-reversal '
        + 'rather than taking the wave policy. Nothing is destroyed on reversal: the function holds '
        + 'no state and no row was minted, and the only consequence is that staff accounts are '
        + 'refused on the AI layer exactly as they were before 201 — the state production is in '
        + 'until the owner applies it. The client\'s companion switch, STAFF_UNLOCK_ALL_PAID in '
        + 'src/lib/staffEntitlements.js, is one line in the other direction.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: 'has_surveyor_entitlement' }),
    ]),
  }),
  Object.freeze({
    id: 'edit-registry-public-denylist',
    from: 202,
    to: 202,
    purpose: 'Design §12.4 (the settlement editor and the decree registry, ODQ §934.36): '
      + 'ONE re-stated SECURITY DEFINER function. public._gallery_world_snapshot_is_safe is '
      + '136\'s body VERBATIM plus two hard_deny members (dmLayer, decrees) and one '
      + 'alternation alternative (.*decrees.*), so a stored gallery world snapshot carrying '
      + 'the settlement editor\'s two DM-private save-time keys is rejected SERVER-side. It '
      + 'is the third of three hand-mirrored denylists and it lands FIRST: the drift test is '
      + 'one-directional (every client token needs a covering SQL alternative, never the '
      + 'reverse), so the server may refuse a key before a client token exists but never '
      + 'after. It creates no table, no column, no policy and no row, and re-points '
      + 'publish_map (089) and the saved_maps guard (091) by name with no signature change '
      + 'and no re-grant. DEPLOYMENT remains the owner\'s manual act (`supabase db push` '
      + 'plus the applied-head bump in that same act), and until it the repo head sits two '
      + 'migrations ahead of the applied head by design.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 201, this wave is one re-stated function and its own @rollback annotation '
        + 'spells the whole reversal out: recreate 136\'s body verbatim, i.e. the same '
        + 'function with the two hard_deny members and the one alternation alternative '
        + 'removed — which is why 202 classifies as documented-manual-reversal rather than '
        + 'taking the wave policy. Nothing is destroyed on reversal: the function holds no '
        + 'state and no row was minted; the only consequence is that a stored gallery '
        + 'snapshot carrying the editor\'s keys is accepted server-side exactly as today.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: '_gallery_world_snapshot_is_safe' }),
    ]),
  }),
  Object.freeze({
    id: 'gallery-scanner-client-mirror-totality',
    from: 203,
    to: 203,
    purpose: 'Design §12.4 / ODQ §934.55: ONE re-stated SECURITY DEFINER function. '
      + 'public._gallery_world_snapshot_is_safe is 202\'s body VERBATIM outside the hard_deny '
      + 'array literal, which gains the three client hard-deny members no migration named — '
      + 'factionPairStates, envoyErrands and concludedWars, conditional ledgers that landed on '
      + 'the client after 136 froze the array and that 202 copied forward unchanged. It also '
      + 'corrects the array comment 136 and 202 both carried ("every CONDITIONAL_LEDGER_KEY but '
      + 'pantheon"), which was true when written and went stale three times, by naming the RULE '
      + 'rather than a snapshot. A stored gallery world snapshot carrying any of the three is '
      + 'now rejected SERVER-side. It creates no table, no column, no policy and no row, and '
      + 're-points publish_map (089), the saved_maps guard (091) and the campaign-tiles RPC '
      + '(148) by name with no signature change and no re-grant. DEPLOYMENT remains the owner\'s '
      + 'manual act (`supabase db push` plus the applied-head bump in that same act), and until '
      + 'it the repo head sits three migrations ahead of the applied head by design.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 201 and 202, this wave is one re-stated function and its own @rollback annotation '
        + 'spells the whole reversal out: recreate 202\'s body verbatim, i.e. the same function '
        + 'with the three hard_deny members removed — which is why 203 classifies as '
        + 'documented-manual-reversal rather than taking the wave policy. Nothing is destroyed '
        + 'on reversal: the function holds no state and no row was minted; the only consequence '
        + 'is that a stored gallery snapshot carrying those three ledgers is accepted '
        + 'server-side exactly as today.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: '_gallery_world_snapshot_is_safe' }),
    ]),
  }),
  Object.freeze({
    id: 'engine-generation-report',
    from: 204,
    to: 204,
    purpose: 'The READ half of the engine service\'s cost log (ENGINE-5 unit 4): one SECURITY '
      + 'DEFINER report function, service_role only, that counts the engine_generate rows the '
      + 'engine-generate edge function writes to public.analytics_events — today and this month, '
      + 'by op and outcome — for the admin analytics panel\'s one line. Like 199 it creates no '
      + 'table, alters no column, writes no row and touches no policy; it returns counts only, '
      + 'never the rows\' caller hash. The operator-visible surface is one admin line, and the '
      + 'wave exposes no user-facing subsystem at all.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 199, this wave is one new read-only function and its own @rollback annotation '
        + 'spells the whole reversal out as a single statement, which is why 204 classifies as '
        + 'documented-manual-reversal rather than taking the wave policy. Dropping the function '
        + 'destroys nothing: it holds no state, nothing else depends on it, and the only '
        + 'consequence is that the admin engine line reports its error while every other '
        + 'dashboard keeps working.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: 'report_engine_generations' }),
    ]),
  }),
  Object.freeze({
    id: 'retired-faction-public-keys',
    from: 205,
    to: 205,
    purpose: 'The people car (ODQ §934.105, PEOPLE-RULINGS M-1b / M-2) retired the NPC grouping '
      + '`settlement.factions` and the per-NPC faction fields; the owner\'s word of 2026-11-07: '
      + 'the export allowlist\'s dead keys go before the deploy. ONE re-stated function: '
      + 'public._gallery_sanitize_public_json is 189\'s body VERBATIM outside its two allowlist '
      + 'literals and their comments — public_toplevel loses \'factions\' and npc_allowed loses '
      + '\'factionAffiliation\' and \'secondaryAffiliation\'. Every change only HIDES; no public '
      + 'field is added. It creates no table, no column, no policy and no row, and re-points '
      + 'get_gallery_dossier, get_unlisted_dossier, import_gallery_dossier and '
      + '_gallery_apply_member_overrides (093) by name with no signature change and no re-grant. '
      + 'DEPLOYMENT remains the owner\'s manual act (`supabase db push` plus the applied-head '
      + 'bump in that same act).',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 202 and 203, this wave is one re-stated function and its own @rollback annotation '
        + 'spells the whole reversal out: recreate 189\'s body verbatim, i.e. the same function '
        + 'with the three keys restored to its two allowlists — which is why 205 classifies as '
        + 'documented-manual-reversal rather than taking the wave policy. Nothing is destroyed '
        + 'on reversal: the function holds no state and no row was minted; the only consequence '
        + 'is that the three retired keys project publicly again, exactly as today.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: '_gallery_sanitize_public_json' }),
    ]),
  }),
  Object.freeze({
    id: 'public-card-veil-bit',
    from: 206,
    to: 206,
    purpose: 'FIX-PUBLIC-VEIL (the chair\'s ruling of 2026-11-07, shape (a)): every writer of a card\'s '
      + '`institution` stamps `institution.veiled` at birth from one predicate (src/domain/people/cardVeil.js), '
      + 'and the public dossier sanitizer reads the bit. ONE re-stated function: '
      + 'public._gallery_sanitize_public_json is 205\'s body VERBATIM outside two new constants '
      + '(npc_house_keys, npc_house_named), two locals and the per-row house rule — an NPC object\'s '
      + '`institution` and `memberships` are public only where `institution.veiled` is false, and a face '
      + 'whose `institution` is an object with the bit true or absent loses `title` and `role` '
      + '(fail-closed). A card with no institution record projects exactly as at 205. THE SECOND SEAT (the '
      + 'chair\'s ruling of 2026-11-08) adds one ROOT pass inside the same function: a hidden power\'s own row, the '
      + 'conflicts and crisis stakes naming it, and its name in any other public string VALUE (masked by walking '
      + 'the document — never a key, never the settlement\'s own name; amended before first apply by the pre-deploy '
      + 'review of 2026-11-10, as in 207 and 210) leave the public JSON, every row stamped hidden leaves, and a '
      + 'veiled face\'s ties lose its title (npc1Role / npc2Role). It creates no '
      + 'table, no column, no policy and no row, and re-points get_gallery_dossier, get_unlisted_dossier, '
      + 'import_gallery_dossier and _gallery_apply_member_overrides (093) by name with no signature '
      + 'change and no re-grant. DEPLOYMENT remains the owner\'s manual act after 205 (`supabase db '
      + 'push` plus the applied-head bump in that same act).',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 202, 203 and 205, this wave is one re-stated function and its own @rollback annotation '
        + 'spells the whole reversal out: recreate 205\'s body verbatim, i.e. the same function without '
        + 'the two house constants and the per-row rule — which is why 206 classifies as '
        + 'documented-manual-reversal rather than taking the wave policy. Nothing is destroyed on '
        + 'reversal: the function holds no state and no row was minted; the only consequence is that '
        + 'every face\'s title and role project publicly again and no face\'s institution or memberships do.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: '_gallery_sanitize_public_json' }),
    ]),
  }),
  Object.freeze({
    id: 'public-hall-capture-veil',
    from: 207,
    to: 207,
    purpose: 'ALLEGIANCE-CAR2, J-20 (the chair\'s ruling of 2026-11-08): the hall-capture state is derived from the '
      + 'ruling three\'s HIDDEN allegiances (src/domain/people/hallCapture.js), so the public dossier carries none of '
      + 'it. ONE re-stated function: public._gallery_sanitize_public_json is 206\'s body VERBATIM plus one root-pass '
      + 'block — powerStructure.criminalCaptureState and every factions[].captureState are stripped, and every '
      + 'factionRelationships[] row carrying a captureState or typed corrupted is dropped whole. It creates no '
      + 'table, no column, no policy and no row; _gallery_world_snapshot_is_safe is untouched. DEPLOYMENT remains '
      + 'the owner\'s manual act after 206 (`supabase db push` plus the applied-head bump in that same act).',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 202, 203, 205 and 206, this wave is one re-stated function and its own @rollback annotation '
        + 'spells the whole reversal out: recreate 206\'s body verbatim, i.e. the same function without the '
        + 'hall-capture block — which is why 207 classifies as documented-manual-reversal rather than taking the '
        + 'wave policy. Nothing is destroyed on reversal: the function holds no state and no row was minted; the '
        + 'only consequence is that the capture state and the capture relation rows project publicly again.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: '_gallery_sanitize_public_json' }),
    ]),
  }),
  Object.freeze({
    id: 'party-link-independent-idempotent-veiled',
    from: 208,
    to: 208,
    // THE ENTRY THE LANE OMITTED (SW-B7a PARTY-LINK; written by STYLE-2-MERGE at its merge point on the chair's ruling of
    // 17:2x): the purpose QUOTES the migration's own header, trimmed by elision only.
    purpose: 'SW-B7a PARTY-LINK, from the migration\'s own header: "208 — the party link: idempotent, veiled, owner-aware, '
      + 'independent of the listing … Recreates the five settlement party-link RPCs of migration 168 and derives 168\'s '
      + '`visibility` column from the slug. The map RPCs … are untouched." (c) "an existing slug is returned unchanged with '
      + 'no write at all; only rotate_settlement_unlisted_slug mints anew, only revoke_settlement_unlisted ends it." (d) '
      + '"THE LINK HONOURS THE VEIL AND NEVER WIDENS. … Now the read keeps 168\'s sanitized base, runs '
      + '_gallery_apply_member_overrides over it with the sanitized JSON as its only source (so it can hide, never '
      + 'reveal), and returns gallery_member_overrides (and gallery_share_dm = false)" — the overrides less the '
      + 'export\'s frozen snapshot (amended before first apply by the pre-deploy review of 2026-11-10). '
      + '(f) "get_unlisted_dossier returns is_owner = (s.user_id = '
      + 'auth.uid()), false for anon" (g) "share no longer touches is_public, is_featured or visibility-as-listing … The '
      + 'column `visibility` is DERIVED: \'unlisted\' exactly when unlisted_slug is not null, held by a check constraint '
      + 'after a backfill". The backfill UPDATE and the check constraint settlements_visibility_derived have no kind of '
      + 'their own in this manifest; the constraint is carried on its table. DEPLOYMENT remains the owner\'s manual act '
      + '(`supabase db push` plus the applied-head bump in that same act), after 207.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 202–207, this wave\'s own @rollback annotation spells the whole reversal out, quoted: "re-create '
        + 'share_settlement_unlisted, rotate_settlement_unlisted_slug, revoke_settlement_unlisted, get_unlisted_dossier '
        + 'and list_my_unlisted_dossiers at their migration-168 bodies, and `alter table public.settlements drop '
        + 'constraint if exists settlements_visibility_derived`. No data is lost either way: the backfill only re-states '
        + 'visibility from unlisted_slug, and no slug is minted, moved or dropped by this migration." — which is why 208 '
        + 'classifies as documented-manual-reversal rather than taking the wave policy.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: 'share_settlement_unlisted' }),
      Object.freeze({ kind: 'function', name: 'rotate_settlement_unlisted_slug' }),
      Object.freeze({ kind: 'function', name: 'revoke_settlement_unlisted' }),
      Object.freeze({ kind: 'function', name: 'get_unlisted_dossier' }),
      Object.freeze({ kind: 'function', name: 'list_my_unlisted_dossiers' }),
      Object.freeze({ kind: 'table', name: 'settlements' }),
    ]),
  }),
  Object.freeze({
    id: 'surveyor-premium-only',
    from: 209,
    to: 209,
    purpose: 'TIER-PARITY-FIX (the owner, 2026-11-09: the Surveyor is "Premium only"; law (7) of the '
      + 'owner\'s tier law): ONE re-stated SECURITY DEFINER function. public.has_surveyor_entitlement() '
      + 'is 201\'s body with the row test narrowed and one disjunct added: staff first (201, unchanged), '
      + 'then an active premium tier through 024\'s current_user_has_premium_access() (tier premium or '
      + 'is_founder — Founders as lifetime premium), then an active surveyor_entitlements row whose '
      + 'source is \'grant\' (the admin concierge path) — a purchased \'subscription\' row no longer '
      + 'admits by itself. It is the gate the nine AI-control edge functions and the BYOK RPCs (159, '
      + '191) route through, so the client\'s isSurveyorTier and the server agree by construction. It '
      + 'creates no table, no column, no policy and no row, mints and deletes no entitlement, and '
      + 'leaves the surveyor_stage_enabled() kill switch, the per-task metering and the dark '
      + 'SURVEYOR_PLAN untouched. DEPLOYMENT remains the owner\'s manual act (`supabase db push` plus '
      + 'the applied-head bump in that same act), after 207 and 208.',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 201, this wave is one re-stated function and its own @rollback annotation spells the '
        + 'whole reversal out: re-run 201\'s body verbatim (staff OR any active row) — which is why 209 '
        + 'classifies as documented-manual-reversal rather than taking the wave policy. Nothing is '
        + 'destroyed on reversal: the function holds no state and no row was minted or deleted; the '
        + 'only consequence is that a bare Cartographer and a Founder are refused on the AI layer again '
        + 'and a purchased row admits again.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: 'has_surveyor_entitlement' }),
    ]),
  }),
  // 208 and 209 land with their own lanes' entries (SW-B7a, TIER-PARITY-FIX); this lane writes 210's alone.
  Object.freeze({
    id: 'public-prose-text-projection',
    from: 210,
    to: 210,
    purpose: '210 — the public dossier carries the owner\'s composed blocks as text (publicProse). '
      + 'STYLE-RULINGS-2 B10(a), lane SW-B7b PROJECTION; the chair\'s ruling of 2026-11-09 12:5x: the paid-surface '
      + 'gate (§885.3, publicDossier ⇒ no state prose) is LIFTED for the gallery page and the players\' link, as a '
      + 'TEXT PROJECTION. The composed blocks are drawn owner-side (the player audience, the record\'s own seed) at '
      + 'every save and carried as strings in `settlements.data.publicProse` … The seed posture (099/121) stands: '
      + 'the seed never travels; only the drawn sentences do. A mechanical re-statement of 207\'s '
      + '`_gallery_sanitize_public_json` body (latest wins) with ONE token added to the top-level allowlist: '
      + '\'publicProse\'. Deeper levels keep the recursive denylist, so a key under publicProse that matches a '
      + 'private token is stripped, fail-closed. … `_gallery_apply_member_overrides` (093, 208\'s twin) calls this '
      + 'function by name and is unchanged. DEPLOYMENT remains the owner\'s manual act after 207, 208 and 209 '
      + '(`supabase db push` plus the applied-head bump in that same act).',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Like 202, 203, 205, 206 and 207, this wave is one re-stated function and its own @rollback annotation '
        + 'spells the whole reversal out: re-apply 207\'s body verbatim, i.e. the same function without '
        + '\'publicProse\' in public_toplevel — which is why 210 classifies as documented-manual-reversal rather '
        + 'than taking the wave policy. Nothing is destroyed on reversal: the function holds no state; the public '
        + 'page then falls silent where the composed blocks stood, as at 207.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: '_gallery_sanitize_public_json' }),
    ]),
  }),
  Object.freeze({
    id: 'server-side-share-veil',
    from: 211,
    to: 211,
    purpose: '211 — the server-side share veil (COHERENCE-VEIL, the chair\'s rulings of 2026-11-12): the veil a DM '
      + 'sets by hand is applied before the response leaves. New helper functions _gallery_veil* (the SQL twin of '
      + 'galleryVeil.js\'s resolver and applier); four reads restated as their previous bodies plus the veil — '
      + 'get_gallery_dossier (147; a snapshot share is served its frozen copy through the same projection, and the '
      + 'live row is not sent), get_unlisted_dossier (208 as amended; the sanitiser runs once), get_gallery_map (088) '
      + 'and import_gallery_dossier (131). gallery_member_overrides travels as an allowlist: members\' booleans and the '
      + 'served marker {v: 2, mode, at, groupings}. No table, column, constraint, policy or row. DEPLOYMENT remains '
      + 'the owner\'s manual act after 204 to 210 (`supabase db push` plus the applied-head bump in that same act).',
    rollback: Object.freeze({
      mode: 'forward-only',
      reason: [
        FORWARD_ONLY_REASON,
        'Its reversal is executable: supabase/rollback/211_server_side_share_veil.down.sql, run last in, first '
        + 'out (undo 211 before 210, 207, 206, 205 and 208\'s set), recreates the four reads at their previous '
        + 'bodies and drops every _gallery_veil* function; tests/security/galleryVeilCures.pglite.test.js '
        + 'rehearses it against a chain stopped at 210. Nothing is destroyed on reversal; the new client draws a '
        + 'v 1 share as before.',
      ].join(' '),
    }),
    expectedObjects: Object.freeze([
      Object.freeze({ kind: 'function', name: '_gallery_veil' }),
      Object.freeze({ kind: 'function', name: '_gallery_veil_resolve' }),
      Object.freeze({ kind: 'function', name: '_gallery_veil_apply' }),
      Object.freeze({ kind: 'function', name: '_gallery_veil_served' }),
      Object.freeze({ kind: 'function', name: 'get_gallery_dossier' }),
      Object.freeze({ kind: 'function', name: 'get_unlisted_dossier' }),
    ]),
  }),
]);

const MIGRATION_FILE = /^(\d+)_.*\.sql$/;
const SHA256 = /^[a-f0-9]{64}$/;
const REHEARSAL_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{7,79}$/;
const LOOPBACK = new Set(['localhost', '127.0.0.1', '::1']);
const REQUIRED_ISOLATION = Object.freeze([
  'customerTrafficDisabled',
  'outboundNetworkDisabled',
  'productionSecretsRemoved',
  'scheduledJobsPaused',
]);

/** @param {string} value */
function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

/** @param {string} migrationDirectory */
export function readMigrationFiles(migrationDirectory) {
  return readdirSync(migrationDirectory)
    .map((name) => {
      const match = name.match(MIGRATION_FILE);
      if (!match) return null;
      const file = join(migrationDirectory, name);
      const source = readFileSync(file, 'utf8');
      return Object.freeze({
        number: Number(match[1]),
        name,
        file,
        bytes: Buffer.byteLength(source),
        sha256: digest(source),
        source,
      });
    })
    .filter(Boolean)
    .sort((left, right) =>
      left.number - right.number || left.name.localeCompare(right.name));
}

/**
 * Capture the annotation plus its contiguous comment continuation. The receipt
 * keeps only operational metadata, never the SQL body.
 *
 * @param {string} source
 */
export function readRollbackAnnotation(source) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => /--\s*@rollback:/i.test(line));
  if (start < 0) return null;
  const note = [];

  for (let index = start; index < lines.length && note.length < 12; index += 1) {
    const match = lines[index].match(/^\s*--\s?(.*)$/);
    if (!match) break;
    note.push(match[1].replace(/^@rollback:\s*/i, '').trim());
  }
  return note.filter(Boolean).join(' ').replace(/\s+/g, ' ').slice(0, 1_200);
}

/**
 * @param {{ number: number, source: string }} migration
 * @param {string} rollbackDirectory
 * @param {{ mode: string, reason: string }} waveRollback
 */
export function classifyRollback(
  migration,
  rollbackDirectory,
  waveRollback,
) {
  const downScript = readdirSync(rollbackDirectory).find((name) =>
    name.startsWith(`${String(migration.number).padStart(3, '0')}_`)
      && name.endsWith('.down.sql'));
  if (downScript) {
    return Object.freeze({
      mode: 'data-safe-down-script',
      source: 'down-script',
      path: `supabase/rollback/${downScript}`,
    });
  }

  const annotation = readRollbackAnnotation(migration.source);
  if (annotation) {
    return Object.freeze({
      mode: /forward[- ]fix only/i.test(annotation)
        ? 'forward-only'
        : 'documented-manual-reversal',
      source: 'migration-annotation',
      note: annotation,
    });
  }

  return Object.freeze({
    mode: waveRollback.mode,
    source: 'wave-policy',
    note: waveRollback.reason,
  });
}

/**
 * @param {{
 *   migrationDirectory: string,
 *   rollbackDirectory: string,
 *   appliedHead: number,
 *   waves?: typeof MIGRATION_WAVES,
 * }} options
 */
export function buildMigrationRehearsalPlan({
  migrationDirectory,
  rollbackDirectory,
  appliedHead,
  waves = MIGRATION_WAVES,
}) {
  const files = readMigrationFiles(migrationDirectory);
  if (files.length === 0) throw new Error('No migration files were found.');

  const numbers = files.map((migration) => migration.number);
  const duplicates = numbers.filter((number, index) =>
    numbers.indexOf(number) !== index);
  if (duplicates.length) {
    throw new Error(`Duplicate migration numbers: ${[...new Set(duplicates)].join(', ')}.`);
  }
  for (let index = 1; index < numbers.length; index += 1) {
    if (numbers[index] !== numbers[index - 1] + 1) {
      throw new Error(
        `Migration chain is not contiguous at ${numbers[index - 1]} → ${numbers[index]}.`,
      );
    }
  }

  const repoHead = numbers.at(-1);
  if (appliedHead > repoHead) {
    throw new Error(`Applied head ${appliedHead} exceeds repository head ${repoHead}.`);
  }
  if (appliedHead === repoHead) {
    return Object.freeze({
      schemaVersion: 1,
      kind: 'settlementforge_migration_rehearsal_plan',
      appliedHead,
      repoHead,
      pendingCount: 0,
      migrationSetSha256: digest(''),
      waves: Object.freeze([]),
    });
  }
  // The checked-in train keeps every wave it ever planned — the historical record of
  // how 122–200 reached production is part of what this file attests. Production
  // catching up to a WAVE BOUNDARY (the owner's 2026-09-16 push took the ledger to
  // 200, exactly wave 200's `to`) therefore does not rebase the train: the live plan
  // simply starts at that boundary and carries the waves past it. A ledger head that
  // sits INSIDE a wave is still refused, because no checked-in wave describes the
  // half-applied remainder and inventing one here would be the rehearsal lying about
  // what it is about to run.
  const boundaries = [MIGRATION_TRAIN_BASE_HEAD, ...waves.map((wave) => wave.to)];
  if (!boundaries.includes(appliedHead)) {
    throw new Error(
      `The checked-in wave train starts at applied head ${MIGRATION_TRAIN_BASE_HEAD} `
      + `and its wave boundaries are ${boundaries.join(', ')}, but the ledger says `
      + `${appliedHead}. Rebase and review the wave boundaries.`,
    );
  }
  if (repoHead !== MIGRATION_TRAIN_REPO_HEAD) {
    throw new Error(
      `The wave manifest ends at ${MIGRATION_TRAIN_REPO_HEAD}, but the repository `
      + `head is ${repoHead}. Extend and review the final bounded wave.`,
    );
  }

  const pending = files.filter((migration) => migration.number > appliedHead);
  const covered = [];
  const plannedWaves = waves.filter((wave) => wave.from > appliedHead).map((wave) => {
    const migrations = pending
      .filter((migration) =>
        migration.number >= wave.from && migration.number <= wave.to)
      .map((migration) => {
        covered.push(migration.number);
        return Object.freeze({
          number: migration.number,
          name: migration.name,
          bytes: migration.bytes,
          sha256: migration.sha256,
          rollback: classifyRollback(
            migration,
            rollbackDirectory,
            wave.rollback,
          ),
        });
      });
    if (migrations.length !== wave.to - wave.from + 1) {
      throw new Error(
        `Wave ${wave.id} must cover every migration ${wave.from}–${wave.to}.`,
      );
    }
    return Object.freeze({
      id: wave.id,
      from: wave.from,
      to: wave.to,
      purpose: wave.purpose,
      rollback: wave.rollback,
      expectedObjects: wave.expectedObjects,
      migrations: Object.freeze(migrations),
    });
  });

  const expected = pending.map((migration) => migration.number);
  if (covered.join(',') !== expected.join(',')) {
    throw new Error(
      'Migration waves do not cover every pending migration exactly once.',
    );
  }

  const migrationSetSha256 = digest(
    plannedWaves.flatMap((wave) =>
      wave.migrations.map((migration) =>
        `${migration.number}\0${migration.name}\0${migration.sha256}\n`))
      .join(''),
  );
  return Object.freeze({
    schemaVersion: 1,
    kind: 'settlementforge_migration_rehearsal_plan',
    appliedHead,
    repoHead,
    pendingCount: pending.length,
    migrationSetSha256,
    waves: Object.freeze(plannedWaves),
  });
}

/**
 * Parse a credential-bearing target for admission without returning its secret.
 *
 * @param {string} value
 */
export function parseRehearsalTarget(value) {
  let parsed;
  try {
    parsed = new URL(String(value || ''));
  } catch {
    throw new Error('REHEARSAL_DATABASE_URL is not a valid PostgreSQL URL.');
  }
  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    throw new Error('The rehearsal target must use postgres:// or postgresql://.');
  }

  const host = parsed.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  const database = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  if (!host || !database) {
    throw new Error('The rehearsal target must name an exact host and database.');
  }
  if (LOOPBACK.has(host)) {
    throw new Error(
      'A local database is not admitted as a production-shaped clone.',
    );
  }
  if (!['require', 'verify-ca', 'verify-full'].includes(
    parsed.searchParams.get('sslmode') || '',
  )) {
    throw new Error('The remote rehearsal target must require TLS via sslmode.');
  }

  return Object.freeze({
    host,
    port: parsed.port || '5432',
    database,
    principal: decodeURIComponent(parsed.username || '').toLowerCase(),
    label: `${host}:${parsed.port || '5432'}/${database}`,
  });
}

/**
 * @param {{
 *   attestation: Record<string, any>,
 *   target: ReturnType<typeof parseRehearsalTarget>,
 *   appliedHead: number,
 *   allowedHosts: string[],
 *   productionRefs?: string[],
 *   now?: Date,
 * }} options
 */
export function validateCloneAttestation({
  attestation,
  target,
  appliedHead,
  allowedHosts,
  productionRefs = [],
  now = new Date(),
}) {
  if (!attestation || typeof attestation !== 'object') {
    throw new Error('The clone attestation must be a JSON object.');
  }
  if (
    attestation.schemaVersion !== 1
    || attestation.kind !== 'settlementforge_migration_rehearsal_clone'
  ) {
    throw new Error('The clone attestation kind or schema version is invalid.');
  }
  if (!REHEARSAL_ID.test(String(attestation.rehearsalId || ''))) {
    throw new Error('The clone attestation has an invalid rehearsalId.');
  }
  if (attestation.environment !== 'migration-rehearsal') {
    throw new Error('The attested environment must be migration-rehearsal.');
  }
  if (Number(attestation.source?.appliedHead) !== appliedHead) {
    throw new Error('The attested source head does not match the rehearsal plan.');
  }
  if (!SHA256.test(String(attestation.source?.snapshotReceiptSha256 || ''))) {
    throw new Error('The attestation must bind a SHA-256 backup/clone receipt.');
  }
  if (
    String(attestation.target?.host || '').toLowerCase() !== target.host
    || String(attestation.target?.port || '5432') !== target.port
    || String(attestation.target?.database || '') !== target.database
  ) {
    throw new Error('The attested target does not match REHEARSAL_DATABASE_URL.');
  }

  const admittedHosts = new Set(
    allowedHosts.map((host) => host.trim().toLowerCase()).filter(Boolean),
  );
  if (!admittedHosts.has(target.host)) {
    throw new Error(
      `Target host ${target.host} is not in SF_MIGRATION_REHEARSAL_ALLOWED_HOSTS.`,
    );
  }
  const explicitProductionReferences = productionRefs.map((value) =>
    value.trim().toLowerCase()).filter(Boolean);
  if (explicitProductionReferences.length === 0) {
    throw new Error(
      'An explicit production database host or project reference is required.',
    );
  }
  for (const reference of explicitProductionReferences) {
    const isHostname = reference.includes('.');
    const matches = isHostname
      ? target.host === reference
      : (
        target.host.split('.').includes(reference)
        || target.principal.split(/[.:_]/).includes(reference)
      );
    if (matches) {
      throw new Error('The rehearsal target matches an explicit production host/reference.');
    }
  }
  for (const control of REQUIRED_ISOLATION) {
    if (attestation.isolation?.[control] !== true) {
      throw new Error(`Clone isolation control ${control} is not attested.`);
    }
  }

  const createdAt = new Date(attestation.createdAt);
  const expiresAt = new Date(attestation.expiresAt);
  if (
    !Number.isFinite(createdAt.getTime())
    || !Number.isFinite(expiresAt.getTime())
  ) {
    throw new Error('The clone attestation timestamps are invalid.');
  }
  if (createdAt.getTime() > now.getTime() + 5 * 60_000) {
    throw new Error('The clone attestation was created in the future.');
  }
  if (expiresAt.getTime() <= now.getTime()) {
    throw new Error('The clone attestation has expired.');
  }
  if (expiresAt.getTime() <= createdAt.getTime()) {
    throw new Error('The clone attestation must expire after it was created.');
  }
  if (expiresAt.getTime() - createdAt.getTime() > 7 * 24 * 60 * 60_000) {
    throw new Error('The clone attestation lifetime may not exceed seven days.');
  }

  return Object.freeze({
    rehearsalId: attestation.rehearsalId,
    snapshotReceiptSha256: attestation.source.snapshotReceiptSha256,
    target: target.label,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    isolation: Object.freeze(Object.fromEntries(
      REQUIRED_ISOLATION.map((control) => [control, true]),
    )),
  });
}

/**
 * psql returns this query as one compact JSON row.
 */
export const REHEARSAL_IDENTITY_SQL = `
select json_build_object(
  'database', current_database(),
  'environment', coalesce(current_setting('settlementforge.environment', true), ''),
  'rehearsalId', coalesce(current_setting('settlementforge.rehearsal_id', true), ''),
  'readOnly', current_setting('default_transaction_read_only'),
  'serverVersion', current_setting('server_version')
);`;

export const MIGRATION_HEAD_SQL = `
select coalesce(
  max(case
    when version::text ~ '^[0-9]+$' then version::text::numeric
    else null
  end),
  0
)::text
from supabase_migrations.schema_migrations;`;

export const MIGRATION_HISTORY_SQL = `
with numeric_history as (
  select distinct version::text::integer as version
  from supabase_migrations.schema_migrations
  where version::text ~ '^[0-9]+$'
),
summary as (
  select
    coalesce(max(version), 0)::integer as head,
    count(*)::integer as count
  from numeric_history
)
select json_build_object(
  'head', summary.head,
  'count', summary.count,
  'nonNumeric', (
    select count(*)::integer
    from supabase_migrations.schema_migrations
    where version::text !~ '^[0-9]+$'
  ),
  'missing', coalesce((
    select json_agg(candidate order by candidate)
    from generate_series(1, summary.head) candidate
    where not exists (
      select 1 from numeric_history h where h.version = candidate
    )
  ), '[]'::json)
)
from summary;`;

/**
 * The snapshot intentionally uses exact counts for the four durable core tables.
 * A schema train may add rows, but it must not make profiles, saved settlements,
 * ledger rows, or spend allocations disappear. Mismatch/orphan counts may
 * improve and may never increase.
 */
export const INTEGRITY_SNAPSHOT_SQL = `
select json_build_object(
  'migrationHead', (${MIGRATION_HEAD_SQL.replace(/;\s*$/, '')}),
  'invalidConstraints', (
    select count(*)::integer
    from pg_constraint
    where not convalidated
  ),
  'rowCounts', json_build_object(
    'profiles', (select count(*)::bigint from public.profiles),
    'settlements', (select count(*)::bigint from public.settlements),
    'creditLedger', (select count(*)::bigint from public.credit_ledger),
    'creditSpendAllocations', (
      select count(*)::bigint from public.credit_spend_allocations
    )
  ),
  'creditBalanceMismatches', (
    select count(*)::integer
    from public.profiles p
    where p.credits is distinct from public.get_credit_balance(p.id)
  ),
  'orphanSpendAllocations', (
    select count(*)::integer
    from public.credit_spend_allocations a
    left join public.credit_ledger spend on spend.id = a.spend_id
    left join public.credit_ledger grant_row on grant_row.id = a.grant_id
    where spend.id is null or grant_row.id is null
  ),
  'schemaFingerprint', (
    select md5(coalesce(string_agg(
      table_schema || '.' || table_name || '.' || column_name || ':'
        || data_type || ':' || is_nullable,
      '|' order by table_schema, table_name, ordinal_position
    ), ''))
    from information_schema.columns
    where table_schema in ('public', 'auth', 'storage')
  )
);`;

/**
 * @param {Record<string, any>} before
 * @param {Record<string, any>} after
 */
export function compareIntegritySnapshots(before, after) {
  const failures = [];
  for (const key of [
    'profiles',
    'settlements',
    'creditLedger',
    'creditSpendAllocations',
  ]) {
    const beforeValue = Number(before.rowCounts?.[key]);
    const afterValue = Number(after.rowCounts?.[key]);
    if (
      !Number.isFinite(beforeValue)
      || !Number.isFinite(afterValue)
      || beforeValue < 0
      || afterValue < 0
    ) {
      failures.push(`${key} row count is invalid`);
    } else if (afterValue < beforeValue) {
      failures.push(`${key} row count decreased`);
    }
  }
  for (const key of [
    'invalidConstraints',
    'creditBalanceMismatches',
    'orphanSpendAllocations',
  ]) {
    const beforeValue = Number(before[key]);
    const afterValue = Number(after[key]);
    if (
      !Number.isFinite(beforeValue)
      || !Number.isFinite(afterValue)
      || beforeValue < 0
      || afterValue < 0
    ) {
      failures.push(`${key} is invalid`);
    } else if (afterValue > beforeValue) {
      failures.push(`${key} increased`);
    }
  }
  return Object.freeze({ ok: failures.length === 0, failures });
}

/**
 * Build a read-only presence query from manifest-owned object names.
 *
 * @param {{ kind: string, name: string }[]} expectedObjects
 */
export function expectedObjectPresenceSql(expectedObjects) {
  const rows = expectedObjects.map((object) => {
    const escaped = object.name.replaceAll("'", "''");
    if (object.kind === 'table') {
      return `('${escaped}', to_regclass('${escaped}') is not null)`;
    }
    if (object.kind === 'function') {
      return `('${escaped}', exists (
        select 1
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.proname = '${escaped}'
      ))`;
    }
    throw new Error(`Unsupported expected object kind: ${object.kind}.`);
  });
  return `
select coalesce(json_object_agg(name, present), '{}'::json)
from (values ${rows.join(',\n')}) as expected(name, present);`;
}

/** @param {Record<string, boolean>} presence */
export function missingExpectedObjects(presence) {
  return Object.entries(presence)
    .filter(([, present]) => present !== true)
    .map(([name]) => name)
    .sort();
}

/** @param {string} file */
export function readAttestationFile(file) {
  if (!existsSync(file)) {
    throw new Error(`Clone attestation not found: ${basename(file)}.`);
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}
