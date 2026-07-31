/**
 * tests/lint/founderSeatsMigration.test.js — static shape pins for the DRAFT
 * Founder-seats migration (137_founder_seats.sql), THE FOUNDER LANE.
 *
 * The migration is owner-gated + written-not-applied, so these are the pins that
 * are testable WITHOUT a deploy: they read the SQL SOURCE and assert the entitlement
 * shape the report presents for sign-off holds together — the immutable seat range,
 * the twin append-only ledger, the fail-closed public projection (opted-in fields
 * only, nothing granted to anon on the base tables), holder-scoped self-service, and
 * the service-role assignment primitive. If the shape is edited during sign-off, these
 * move with it. (The SECURITY DEFINER search_path pin is enforced globally by
 * migrationSearchPathPin.test.js — these functions must satisfy it too.)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SQL = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/137_founder_seats.sql'),
  'utf8',
);
const lower = SQL.toLowerCase();

describe('137 founder_seats — production shape pins (THE FOUNDER LANE)', () => {
  it('creates both the seat table and its append-only transfer ledger', () => {
    expect(lower).toMatch(/create table if not exists public\.founder_seats\b/);
    expect(lower).toMatch(/create table if not exists public\.founder_seat_transfers\b/);
  });

  it('seat_id is the immutable primary key, constrained to 1..30', () => {
    expect(lower).toMatch(/seat_id\s+smallint\s+primary key/);
    expect(lower).toMatch(/seat_id between 1 and 30/);
  });

  it('seeds the 30 unclaimed seats (the dignified pre-launch state)', () => {
    expect(lower).toMatch(/generate_series\(1,\s*30\)/);
    expect(lower).toMatch(/on conflict \(seat_id\) do nothing/);
  });

  it('enables RLS on both tables', () => {
    expect(lower).toMatch(/alter table public\.founder_seats\s+enable row level security/);
    expect(lower).toMatch(/alter table public\.founder_seat_transfers\s+enable row level security/);
  });

  it('grants a holder UPDATE only over their OWN seat row', () => {
    expect(lower).toMatch(/^create policy "holder updates own founder seat" on public\.founder_seats/m);
    expect(lower).toMatch(/auth\.uid\(\)\s*=\s*holder_user_id/);
  });

  it('grants NOTHING to anon on the base tables (fail-closed — the RPC is the only public read)', () => {
    // LIVENESS ANCHOR: the corpus DOES grant to anon — the projection RPC's execute
    // grant — so a renamed/emptied migration reds here instead of passing the three
    // exclusions below for want of any grant text at all.
    expect(lower).toMatch(/^grant execute on function public\.list_founder_seats_public\(\) to anon/m);
    // No table-level grant to anon on either base table.
    // anchored: the anon execute-grant above proves `lower` is the live migration text
    expect(lower).not.toMatch(/grant\s+[^;]*\bon\s+table\s+public\.founder_seats\b[^;]*\bto\b[^;]*\banon\b/);
    // anchored: same liveness anchor — this leg drops the optional `table` keyword
    expect(lower).not.toMatch(/grant\s+[^;]*\bon\s+public\.founder_seats\b[^;]*\bto\b[^;]*\banon\b/);
    // The transfer ledger has NO policy at all → default-deny; assert no select/insert
    // policy names it (append-only via the service-role write path only).
    // The REGEX is deliberately unanchored (negative-presence): it must catch a future
    // re-creation at ANY indentation — this corpus legally mints indented
    // policies/triggers (005:69 DO-block EXECUTE; 003:65/004:49 DO-block DDL). Pinned in
    // netCurrentExtractorAnchor.walker FROZEN_UNANCHORED — do not add `^` to it.
    // anchored: liveness comes from the anon execute-grant above, not from the regex
    expect(lower).not.toMatch(/create policy[^;]*on public\.founder_seat_transfers/);
  });

  it('exposes the public projection RPC to anon, returning opted-in fields only', () => {
    // ⚠ Create-statement matches are LINE-START anchored (`^` + m) here and
    // below: the unanchored form also matches prose quoting the statement, and
    // this file only asserts over SOURCE text. Canonical writeup:
    // tests/security/moneyRpcNetCurrentGuards.test.js.
    expect(lower).toMatch(/^create or replace function public\.list_founder_seats_public\(\)/m);
    expect(lower).toMatch(/grant execute on function public\.list_founder_seats_public\(\) to anon, authenticated/);
    // Fail-closed: a name projects only when moderation-approved.
    expect(lower).toMatch(/display_name_status\s*=\s*'approved'/);
    // The projection must not select the holder's user id into its output columns.
    // Anchor on the actual CREATE ... $$ body ... $$; (the name also appears in
    // comments, so a naive split is unreliable).
    const m = SQL.match(
      /^create or replace function public\.list_founder_seats_public\(\)[\s\S]*?\$\$([\s\S]*?)\$\$;/im,
    );
    expect(m).not.toBeNull();
    // LIVENESS ANCHOR: the extracted body is the real projection query (it selects the
    // opted-in columns), so the exclusion below measures omission, not an empty capture.
    expect(m[1].toLowerCase()).toMatch(/display_name/);
    // anchored: the body is asserted non-null and to carry display_name, immediately above
    expect(m[1].toLowerCase()).not.toMatch(/holder_user_id/);
  });

  it('the holder self-service opt-in RPC is authenticated-only and re-enters moderation', () => {
    expect(lower).toMatch(/^create or replace function public\.set_founder_display_optin\(/m);
    expect(lower).toMatch(/grant execute on function public\.set_founder_display_optin\([^)]*\) to authenticated/);
    expect(lower).toMatch(/display_name_status\s*=\s*'pending'/);
  });

  it('the seat-assignment primitive is service-role only (revoked from public)', () => {
    expect(lower).toMatch(/^create or replace function public\.claim_next_founder_seat\(/m);
    expect(lower).toMatch(/revoke all on function public\.claim_next_founder_seat\([^)]*\) from public/);
    expect(lower).toMatch(/grant execute on function public\.claim_next_founder_seat\([^)]*\) to service_role/);
    // service-role gate inside the body.
    expect(lower).toMatch(/service_role/);
  });

  // ── Money Wave v2 (§6.1): the transfer-lifecycle columns/stamps + the wired
  //    webhook hook + the mirrored clawback release. ──────────────────────────
  it('adds the transfer-lifecycle columns to founder_seats', () => {
    expect(lower).toMatch(/original_purchase_at\s+timestamptz/);
    expect(lower).toMatch(/acquired_via\s+text\s+not null\s+default 'purchase'/);
    expect(lower).toMatch(/acquired_via in \('purchase','transfer','estate','grant'\)/);
    expect(lower).toMatch(/transfer_eligible_at\s+timestamptz/);
    expect(lower).toMatch(/last_transfer_at\s+timestamptz/);
    expect(lower).toMatch(/cooldown_until\s+timestamptz/);
    expect(lower).toMatch(/security_status\s+text\s+not null\s+default 'normal'/);
    expect(lower).toMatch(/security_status in \('normal','transfer_locked','flagged','escheat'\)/);
  });

  it('claim_next_founder_seat stamps the original-purchase lifecycle', () => {
    // The claim path stamps original_purchase_at + a +12mo transfer_eligible_at.
    expect(lower).toMatch(/original_purchase_at\s*=\s*now\(\)/);
    expect(lower).toMatch(/transfer_eligible_at\s*=\s*now\(\)\s*\+\s*interval '12 months'/);
  });

  it('adds the service-role clawback seat-release RPC (mirror of the claim)', () => {
    expect(lower).toMatch(/^create or replace function public\.release_founder_seat_on_clawback\(/m);
    expect(lower).toMatch(/revoke all on function public\.release_founder_seat_on_clawback\([^)]*\) from public/);
    expect(lower).toMatch(/grant execute on function public\.release_founder_seat_on_clawback\([^)]*\) to service_role/);
    // Appends a 'clawback' lineage note (append, never erase).
    expect(lower).toMatch(/'clawback'/);
  });

  it('is SIGNED OFF (production shape), still written-not-deployed', () => {
    expect(lower).toMatch(/signed off/);
    // Prod head stays 117 — the whole 118+ chain ships together at db push.
    expect(lower).toMatch(/written-not-deployed/);
    // The draft/awaiting-sign-off framing is gone.
    // anchored: the two header assertions above prove `lower` still carries the header prose
    expect(lower).not.toMatch(/awaiting owner sign-off/);
  });

  it('every SECURITY DEFINER function pins search_path = public, pg_temp (pg_temp LAST)', () => {
    // Each definer function header must carry the pinned search_path (the global
    // migrationSearchPathPin walker also enforces this; asserted locally so a shape
    // edit that drops the pin fails here too).
    const defs = [...SQL.matchAll(/security definer/gi)];
    expect(defs.length).toBeGreaterThanOrEqual(3);
    // LIVENESS ANCHOR first: the corpus carries at least three PINNED search_path
    // settings, so the "no bare form" exclusion below cannot pass on empty text.
    const pinned = [...lower.matchAll(/set search_path = public, pg_temp/g)];
    expect(pinned.length).toBeGreaterThanOrEqual(3);
    // No definer function may use a bare `set search_path = public` (without pg_temp).
    // anchored: the >= 3 pinned search_path matches above prove `lower` is live
    expect(lower).not.toMatch(/set search_path = public\s*\n/);
  });

});
