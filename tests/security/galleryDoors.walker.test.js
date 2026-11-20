/**
 * galleryDoors.walker.test.js — THE DOORS ARE REGISTERED (VR20 (C); the walker beside galleryDoors.pglite.test.js).
 *
 * Every function a visitor (Postgres roles `anon`, `authenticated`) may EXECUTE that touches a shared town
 * (`public.settlements`) or a shared map (`public.saved_maps`) is a possible door beside the veiled main document. The
 * ruling: no such function, no column it returns, no list filter or sort it reads, and no event type the app writes
 * to a chronicle goes unregistered. The walker boots a chain of every migration on disk (with Supabase's default
 * privileges) and reads the catalogue as the server holds it.
 *
 * THE ARMS:
 *   1 THE CENSUS: pg_proc's public functions executable by anon or authenticated whose body names settlements,
 *     saved_maps, the tile rows or the two gallery reads. Each is in REGISTRY with a kind (door, owner, admin, social,
 *     system) read from its body on the chain. Red on an unregistered function and on a stale row (a registered
 *     function gone from pg_proc, or no longer in the census). One tolerance: _gallery_public_tile_rows may drop out
 *     (arm 4's cure revokes it from visitors); no other registered row may.
 *   2 THE COLUMNS OF EACH DOOR: a door returning TABLE(...) has every column of pg_get_function_result registered with
 *     its rule; a door returning jsonb has every key of every jsonb_build_object in its body registered (method:
 *     comments stripped, then each jsonb_build_object( call's arguments split at its own top-level commas, quote- and
 *     paren-aware; the arguments at the key positions 1, 3, 5... are taken; a key that is not a quoted literal is
 *     registered by its expression text). A door that returns another door's object names it (delegatesTo) and its
 *     body must still call it. Red on an unregistered column and on a stale one.
 *   3 FILTERS AND SORTS: every filter key list_gallery_dossiers and list_gallery_maps read (`filters ? 'k'`,
 *     `filters->'k'`, `filters->>'k'`, the same with p_filters) and every sort key (`sort_key = 'k'`,
 *     `p_sort_key = 'k'`) is registered with its rule. Red on unregistered and on stale.
 *   4 THE TILE ROWS ARE NO DOOR: _gallery_public_tile_rows() is executable by neither anon nor authenticated.
 *   5 THE CHRONICLE'S CLASSES: every event type the app writes to campaign_state.eventLog (EVENT_REGISTRY's keys; the
 *     store's own rows: the `type:` literals of settlementSlice, settlementRenameHelpers and
 *     settlementPendingEditWriters, a ternary's fallback literal included; TABLE_EFFECTS' event kinds in
 *     pendingEditIntents) is classed by the SQL `_gallery_doors_chronicle_classes()` and by the JS CHRONICLE_CLASSES
 *     (src/domain/display/galleryDoors.js); the two tables are equal; every class is one of the seven (house, person,
 *     power, target, covert, stressor, withheld: VEIL-DOORS-2's table on purpose).
 *   6 THE BAND TABLE IS ONE: labelBands' STABILITY_BANDS equals the array inside the SQL `_gallery_doors_band(text)`.
 *   7 VR27 AS AMENDED, THE CATALOGUE (VEIL-DOORS-2): every underscore function of the share's family (named `_gallery_*`
 *     or `_saved_maps_*`, or whose body names a town or a map) is executable by neither visitor role, OR stands on
 *     VISITOR_LIST with the visitor context that needs it or the catalogue's class that leaves it to SEC-GRANTS's 213
 *     (the eight older INVOKER helpers: they run with the caller's own rights and grant nothing). Red on an unlisted one
 *     and on a stale row. And 212 revokes none of the eight by name (VR27 as amended: not 212's to revoke).
 *   8 EVERY DOOR ANSWERS A VISITOR AFTER 212, AND A SIGNED-IN USER SAVES A MAP: on a chain holding a shared town and a
 *     shared map, every door is called as anon and as authenticated (an import as authenticated) and answers with the
 *     row; a signed-in user inserts and updates a map carrying a world snapshot, the saved_maps trigger's path, which runs
 *     _gallery_world_snapshot_is_safe as that user. (The scaffold grants tables to the visitor roles as Supabase does.)
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { EVENT_TYPES } from '../../src/domain/events/registry.js';
import { STABILITY_BANDS } from '../../src/domain/display/labelBands.js';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 600_000;

vi.mock('../../src/lib/supabase.js', () => {
  const supabase = { rpc: async () => ({ data: null, error: null }) };
  return { supabase, isConfigured: true, default: supabase };
});

const ROOT = process.cwd();
const MIGRATIONS = resolve(ROOT, 'supabase', 'migrations');
const OWNER = '11111111-1111-1111-1111-111111111111';
const READER = '22222222-2222-2222-2222-222222222222';
// The hand-rows harness's scaffold, and SUPABASE'S DEFAULT PRIVILEGES: a function created in public is executable by
// anon and authenticated unless a migration revokes it from them by name (`revoke ... from public` does not).
const SCAFFOLD = `
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select '{}'::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}',
      raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz,
      email_confirmed_at timestamptz, phone text, deleted_at timestamptz, is_anonymous boolean default false);
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    grant usage on schema public to anon, authenticated, service_role;
    create schema if not exists extensions;
    create schema if not exists cron;
    create table if not exists cron.job (jobid bigserial primary key, jobname text, schedule text, command text);
    create or replace function cron.schedule(n text, s text, c text) returns bigint language sql as $fn$
      insert into cron.job (jobname, schedule, command) values (n, s, c) returning jobid $fn$;
    create or replace function cron.unschedule(n text) returns boolean language sql as $fn$ select true $fn$;
    create or replace function cron.unschedule(n bigint) returns boolean language sql as $fn$ select true $fn$;
    create schema if not exists storage;
    create table if not exists storage.buckets (id text primary key, name text, public boolean, owner uuid,
      file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now(), updated_at timestamptz default now());
    create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text,
      owner uuid, metadata jsonb, created_at timestamptz default now(), updated_at timestamptz default now());
    create or replace function storage.foldername(name text) returns text[] language sql immutable as $fn$
      select string_to_array(name, '/') $fn$;
    create extension if not exists pgcrypto;`;

// THE CENSUS: the regex a body must match to be counted (run on a native chain: 63 functions).
const CENSUS_BODY = String.raw`(public\.)?(settlements|saved_maps)\M|_gallery_public_tile_rows|get_gallery_map|get_gallery_dossier`;
// The one registered row that may leave the census: the cure of arm 4 revokes it from visitors.
const TILE_ROWS = '_gallery_public_tile_rows';

// ── THE RULES (short strings; the census table of REVIEW-VEIL-10 names the sources) ──────────────────────────────
const VEIL_DATA = 'veil: 211+212 (data)';
const TILE = 'VR22 tile rule (_gallery_public_tile_rows)';
const CHRONICLE = 'VR20 (B) chronicle veil (_gallery_doors_chronicle)';
const OWNER_AUTHORED = 'owner-authored';
const COUNT = 'count';
const ROW = 'row metadata (id, slug, dates, curation): not derived from a town';
const IDENTITY = "identity (the town's own name: a floor)";
const AUTHOR = "author identity (profiles.external_name: the author's public name)";
const AT_PUBLISH = 'stored at publish (facet snapshot): not derived from a town at read';
const WORLD = 'stored at publish (world snapshot): not derived from a town at read';
const MAP_OWNED = "the map's own state (owner-authored): not derived from a town";
const RAW_BARRED = 'RAW settlements.data: no visitor executes this function (arm 4)';

/** The tile columns every gallery list carries (_gallery_public_tile_rows' projection, read through a door). */
const TILE_COLUMNS = {
  id: ROW, public_slug: ROW, name: IDENTITY, tier: ROW, published_at: ROW, updated_at: ROW, view_count: COUNT,
  is_curated: ROW, gallery_description: OWNER_AUTHORED, gallery_image_url: OWNER_AUTHORED, gallery_image_alt: OWNER_AUTHORED,
  gallery_tags: OWNER_AUTHORED, population: TILE, terrain: TILE, government_type: TILE, magic_level: TILE, stability: TILE,
  primary_resource: TILE, threat_level: TILE, culture: TILE, prosperity: TILE, primary_deity: TILE, at_war: AT_PUBLISH,
  net_votes: COUNT, comment_count: COUNT, author_name: AUTHOR, aliveness: AT_PUBLISH, reactions: COUNT,
};

/**
 * THE REGISTRY: every censused function, classed by reading its body on the chain (pg_get_functiondef).
 * kind: 'door' a public read (a visitor reaches a shared town or map's content) | 'owner' scoped to auth.uid() |
 * 'admin' gated inside on an admin/developer/support role or the service role | 'social' votes, reactions, comments,
 * reports, view/import bumps | 'system' triggers, crons, purges, billing hooks.
 */
const REGISTRY = {
  // ── DOORS ──
  _gallery_public_tile_rows: {
    kind: 'door', why: 'SECURITY DEFINER projection of every is_public settlement: tile columns read RAW from data, plus owner_id (arm 4 revokes it)',
    columns: {
      ...Object.fromEntries(Object.keys(TILE_COLUMNS).filter((c) => c !== 'author_name').map((c) => [c, TILE_COLUMNS[c] === TILE ? RAW_BARRED : TILE_COLUMNS[c]])),
      owner_id: 'owner identity (user_id): no visitor executes this function (arm 4)',
      importable: OWNER_AUTHORED,
    },
  },
  get_gallery_dossier: {
    kind: 'door', why: 'the gallery read of one public town: the veiled document, the tile columns, the chronicle',
    columns: {
      id: ROW, public_slug: ROW, name: IDENTITY, tier: ROW, data: VEIL_DATA, published_at: ROW, updated_at: ROW,
      view_count: COUNT, is_curated: ROW, gallery_description: OWNER_AUTHORED, gallery_image_url: OWNER_AUTHORED,
      gallery_image_alt: OWNER_AUTHORED, gallery_tags: OWNER_AUTHORED, gallery_share_dm: OWNER_AUTHORED,
      gallery_importable: OWNER_AUTHORED, gallery_member_overrides: "veil: 211 (the veil's `served` allowlist)",
      population: TILE, terrain: TILE, government_type: TILE, magic_level: TILE, stability: TILE, primary_resource: TILE,
      threat_level: TILE, net_votes: COUNT, comment_count: COUNT, chronicle: CHRONICLE, author_name: AUTHOR, aliveness: AT_PUBLISH,
    },
  },
  get_gallery_map: {
    kind: 'door', why: 'the gallery read of one public map: its own state, the stored world panel, each member town veiled with its chronicle',
    columns: {
      slug: ROW, name: "identity (the map's or a member town's own name: a floor)", kind: ROW, description: OWNER_AUTHORED,
      tags: OWNER_AUTHORED, imageUrl: OWNER_AUTHORED, imageAlt: OWNER_AUTHORED, realmArcSummary: WORLD,
      mapState: MAP_OWNED, fmgSnapshot: MAP_OWNED, seed: MAP_OWNED, customBackdrop: MAP_OWNED, placements: MAP_OWNED,
      labels: MAP_OWNED, markers: MAP_OWNED, forests: MAP_OWNED, backdrop: MAP_OWNED,
      world: WORLD, snapshot: WORLD, sections: WORLD,
      members: "the map's member list (owner's own active towns, IDOR guard 046)",
      old_id: ROW, tier: ROW, public_slug: ROW,
      settlement: 'veil: 211+212 (a member town, VR23 default veil when unmarked)',
      chronicle: CHRONICLE,
    },
  },
  import_gallery_map: {
    kind: 'door', why: "an importable public map, for a signed-in caller: returns get_gallery_map's object whole",
    delegatesTo: 'get_gallery_map', columns: {},
  },
  get_unlisted_dossier: {
    kind: 'door', why: 'the unlisted-link read of one town by its secret slug: the veiled document',
    columns: {
      id: ROW, name: IDENTITY, tier: ROW, slug: ROW, unlisted: ROW, author_name: AUTHOR,
      is_owner: "the caller's own flag (auth.uid() = owner)", gallery_share_dm: 'constant false (no DM view on a link)',
      gallery_member_overrides: "veil: 211 (the veil's `served` allowlist)", dossier: VEIL_DATA,
    },
  },
  get_unlisted_map: {
    kind: 'door', why: 'the unlisted-link read of one map by its secret slug: its header and the stored world panel',
    columns: {
      id: ROW, name: IDENTITY, slug: ROW, unlisted: ROW, share_kind: ROW, description: OWNER_AUTHORED, tags: OWNER_AUTHORED,
      image_url: OWNER_AUTHORED, world_snapshot: WORLD, world_sections: WORLD, realm_arc_summary: WORLD,
    },
  },
  import_gallery_dossier: {
    kind: 'door', why: 'an importable public town, for a signed-in premium caller: the veiled document',
    columns: { id: ROW, name: IDENTITY, tier: ROW, data: VEIL_DATA },
  },
  list_gallery_dossiers: {
    kind: 'door', why: 'the gallery list: tile rows filtered, searched, sorted and counted',
    columns: { ...TILE_COLUMNS, importable: OWNER_AUTHORED, total_count: COUNT },
    filters: {
      tier: ROW, terrain: TILE, magicLevel: TILE, culture: TILE, prosperity: TILE, hasDeity: `${TILE}: primary_deity`,
      atWar: AT_PUBLISH, populationMin: `${TILE}: population`, populationMax: `${TILE}: population`,
      importable: OWNER_AUTHORED, hasImage: OWNER_AUTHORED, hasComments: COUNT, curatedOnly: ROW,
    },
    sorts: {
      top_voted: COUNT, most_viewed: COUNT, most_commented: COUNT, newest: ROW, recently_updated: ROW,
      population_desc: `${TILE}: population`, population_asc: `${TILE}: population`, name_asc: IDENTITY, most_alive: AT_PUBLISH,
    },
  },
  list_gallery_more_by_creator: {
    kind: 'door', why: "the same author's other public towns beside one dossier: tile rows",
    columns: { ...TILE_COLUMNS },
  },
  list_gallery_maps: {
    kind: 'door', why: 'the map gallery list: map rows with facets and a member count, filtered and sorted',
    columns: {
      slug: ROW, name: "identity (the map's own name)", kind: ROW, description: OWNER_AUTHORED, tags: OWNER_AUTHORED,
      backdrop_kind: MAP_OWNED, thumb_url: MAP_OWNED, published_at: ROW, view_count: COUNT, import_count: COUNT,
      member_count: "count (the owner's own active member towns)", importable: OWNER_AUTHORED, author_name: AUTHOR,
      image_url: OWNER_AUTHORED, image_alt: OWNER_AUTHORED, at_war: AT_PUBLISH, world_age: AT_PUBLISH, aliveness: AT_PUBLISH,
    },
    filters: {
      kind: ROW, backdrop: MAP_OWNED, tags: OWNER_AUTHORED, hasSettlements: "count (member_count)", importable: OWNER_AUTHORED,
    },
    sorts: { most_viewed: COUNT, most_imported: COUNT },
  },
  list_featured_dossiers: {
    kind: 'door', why: 'the featured public towns: row columns only',
    columns: { id: ROW, public_slug: ROW, name: IDENTITY, tier: ROW, published_at: ROW, view_count: COUNT, featured_order: ROW },
  },
  list_curated_dossiers: {
    kind: 'door', why: 'the curated public towns: row columns only',
    columns: { id: ROW, public_slug: ROW, name: IDENTITY, tier: ROW, published_at: ROW, view_count: COUNT, curated_order: ROW },
  },
  list_featured_maps: {
    kind: 'door', why: 'the featured public maps: row columns only',
    columns: { id: ROW, public_slug: ROW, name: "identity (the map's own name)", share_kind: ROW, published_at: ROW, view_count: COUNT, featured_order: ROW },
  },

  // ── OWNER ──
  list_my_gallery_dossiers: { kind: 'owner', why: "tile rows joined to settlements where user_id = auth.uid(): the caller's own shares" },
  list_my_unlisted_dossiers: { kind: 'owner', why: "settlements where user_id = auth.uid() with an unlisted slug" },
  list_my_unlisted_maps: { kind: 'owner', why: "saved_maps where user_id = auth.uid() and visibility unlisted" },
  publish_settlement: { kind: 'owner', why: 'auth.uid() owner check, canon gate; sets is_public and the slug' },
  unpublish_settlement: { kind: 'owner', why: 'auth.uid() owner check; clears is_public' },
  share_settlement_unlisted: { kind: 'owner', why: 'auth.uid() owner check; mints the unlisted slug' },
  revoke_settlement_unlisted: { kind: 'owner', why: 'update where user_id = auth.uid(); clears the unlisted slug' },
  rotate_settlement_unlisted_slug: { kind: 'owner', why: 'auth.uid() owner check; mints a new unlisted slug' },
  publish_map: { kind: 'owner', why: 'auth.uid() owner check of the map and every member town; stores the sanitized world snapshot' },
  unpublish_map: { kind: 'owner', why: 'auth.uid() owner check; clears is_public' },
  share_map_unlisted: { kind: 'owner', why: 'auth.uid() owner check; mints the unlisted slug' },
  revoke_map_unlisted: { kind: 'owner', why: 'update where user_id = auth.uid(); clears the unlisted slug' },
  rotate_map_unlisted_slug: { kind: 'owner', why: 'auth.uid() owner check; mints a new unlisted slug' },
  reactivate_free_settlement: { kind: 'owner', why: "owner_id = auth.uid() check; reactivates the caller's own free save" },
  merge_neighbour_backlink: { kind: 'owner', why: "writes the caller's own partner town (user_id = auth.uid(), for update)" },
  mutate_settlement_batch: { kind: 'owner', why: "p_expected_user must equal auth.uid(); every update/delete/create scoped to user_id = auth.uid()" },
  persist_world_pulse_advance: { kind: 'owner', why: "campaign and settlements scoped to user_id = auth.uid()" },
  apply_create_route_command: { kind: 'owner', why: "p_expected_owner = auth.uid(); both saves written where user_id = auth.uid()" },
  apply_cut_trade_route_command: { kind: 'owner', why: "p_expected_owner = auth.uid(); the save written where user_id = auth.uid()" },
  apply_import_reconciliation_command: { kind: 'owner', why: "p_expected_owner = auth.uid(), premium; rows scoped to user_id = auth.uid()" },
  compare_and_swap_campaign_content_binding: { kind: 'owner', why: "p_expected_owner = auth.uid(), premium; the campaign row scoped to user_id = auth.uid()" },

  // ── ADMIN ──
  admin_remove_gallery_item: { kind: 'admin', why: "has_role(p_actor, admin|developer); p_actor is the service caller's word (granted to service_role)" },
  admin_remove_gallery_map: { kind: 'admin', why: "has_role(p_actor, admin|developer); p_actor is the service caller's word" },
  admin_revoke_share_link: { kind: 'admin', why: "has_role(p_actor, admin|developer); p_actor is the service caller's word" },
  admin_set_content_banned: { kind: 'admin', why: "has_role(p_actor, admin|developer); p_actor is the service caller's word" },
  admin_soft_delete_map: { kind: 'admin', why: "has_role(p_actor, admin|developer); p_actor is the service caller's word" },
  admin_soft_delete_settlement: { kind: 'admin', why: "has_role(p_actor, admin|developer); p_actor is the service caller's word" },
  admin_user_summary: { kind: 'admin', why: 'current_user_is_support_or_higher() gate; counts a user\'s settlements' },
  list_gallery_reports: { kind: 'admin', why: 'where current_user_is_privileged(): the report queue' },
  list_open_report_targets: { kind: 'admin', why: 'where current_user_is_privileged(): open report targets' },
  set_curated: { kind: 'admin', why: "caller's profiles.role in (developer, admin)" },
  set_featured: { kind: 'admin', why: "caller's profiles.role in (developer, admin)" },
  set_featured_map: { kind: 'admin', why: "caller's profiles.role in (developer, admin)" },
  grant_dossier_entitlement: { kind: 'admin', why: "raises unless the JWT role is service_role (the payment webhook)" },
  claim_dossier_purchase_by_session: { kind: 'admin', why: "raises unless the JWT role is service_role" },

  // ── SOCIAL ──
  add_gallery_comment: { kind: 'social', why: 'signed-in, active, rate-limited, civility-checked comment on a public town' },
  list_gallery_comments: { kind: 'social', why: "a public town's comments; tombstones send no body or author" },
  report_gallery_comment: { kind: 'social', why: 'signed-in, rate-limited report of a comment on a public town' },
  report_gallery_dossier: { kind: 'social', why: 'signed-in report of a public town' },
  report_gallery_map: { kind: 'social', why: 'signed-in, rate-limited report of a public map' },
  toggle_gallery_vote: { kind: 'social', why: 'signed-in, rate-limited vote on a public town; returns the count' },
  get_gallery_vote_state: { kind: 'social', why: "a public town's vote count and the caller's own vote" },
  toggle_gallery_reaction: { kind: 'social', why: 'signed-in, rate-limited reaction on a public town; returns the counts' },
  get_gallery_reaction_state: { kind: 'social', why: "a public town's reaction counts and the caller's own" },
  bump_public_view: { kind: 'social', why: 'deduped view counter of a public town (no read)' },
  bump_map_import: { kind: 'social', why: 'deduped import counter of an importable public map (no read)' },

  // ── SYSTEM ──
  enforce_save_limit: { kind: 'system', why: 'the settlements insert trigger: save cap by tier' },
  purge_expired_plan_inactive_settlements: { kind: 'system', why: 'retention purge (cron/service): deletes expired inactive settlements; no row returned' },
  purge_expired_plan_inactive_assets: { kind: 'system', why: 'retention purge (cron/service): deletes expired inactive settlements and maps; returns counts' },
  handle_premium_downgrade: { kind: 'system', why: 'billing hook (granted to service_role): marks a user\'s rows inactive; returns counts; no gate in its body' },
};
const KINDS = new Set(['door', 'owner', 'admin', 'social', 'system']);

// VR27 AS AMENDED (the seventh chair, 2026-11-20): an underscore function of the share's family a visitor may execute is
// on this list with the context that needs it, or with SEC-GRANTS's catalogue class that leaves it to 213
// (docs/chair/2026-11-20/security/CATALOGUE.md on origin/lane/sec-grants-2026-11-20). Every other one is revoked.
const FOR_213 = "an INVOKER helper: runs with the caller's own rights and grants nothing; not 212's to revoke (VR27 as amended): SEC-GRANTS's 213, with its catalogue's proof";
const VISITOR_LIST = {
  _gallery_world_snapshot_is_safe: { needs: 'a signed-in user saving a map: the saved_maps trigger (_saved_maps_world_snapshot_guard, an INVOKER trigger) runs it as that user (arm 8)' },
  _saved_maps_world_snapshot_guard: { needs: 'the saved_maps BEFORE INSERT OR UPDATE trigger function itself (catalogue: TRIGGER, left alone; no EXECUTE is checked when a trigger fires)' },
  _gallery_chronicle_entry: { for213: `${FOR_213} (catalogue: VISITOR-NEEDED, called by the invoker _gallery_chronicle_json)` },
  _gallery_npc_key: { for213: `${FOR_213} (catalogue: VISITOR-NEEDED, called by the invoker _gallery_apply_member_overrides)` },
  _gallery_sanitize_public_json: { for213: `${FOR_213} (catalogue: VISITOR-NEEDED, called by the invoker _gallery_apply_member_overrides)` },
  _gallery_chronicle_json: { for213: `${FOR_213} (catalogue: INTERNAL, invoker helper, for 213)` },
  _gallery_apply_member_overrides: { for213: `${FOR_213} (catalogue: INTERNAL, invoker helper, for 213)` },
  _gallery_dm_full_json: { for213: `${FOR_213} (catalogue: INTERNAL, invoker helper, for 213)` },
  _gallery_map_backdrop: { for213: `${FOR_213} (catalogue: INTERNAL, invoker helper, for 213)` },
};
/** The eight older helpers VR27 as amended leaves to 213 (no `revoke` in 212 may name one). */
const OLDER_EIGHT = ['_gallery_chronicle_entry', '_gallery_chronicle_json', '_gallery_map_backdrop', '_gallery_apply_member_overrides',
  '_gallery_npc_key', '_gallery_dm_full_json', '_gallery_sanitize_public_json', '_gallery_world_snapshot_is_safe'];

// ── THE PARSERS ─────────────────────────────────────────────────────────────────────────────────────────────────
/** Split at the top-level commas of an argument text (quote- and paren-aware). */
function splitTop(text) {
  const out = []; let depth = 0; let quoted = false; let cur = '';
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) { cur += ch; if (ch === "'") { if (text[i + 1] === "'") { cur += text[i + 1]; i += 1; } else quoted = false; } continue; }
    if (ch === "'") quoted = true;
    else if (ch === '(' || ch === '[') depth += 1;
    else if (ch === ')' || ch === ']') depth -= 1;
    else if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
/** The argument text of the call whose '(' sits at `open` (quote- and paren-aware). */
function callArgs(src, open) {
  let depth = 0; let quoted = false;
  for (let i = open; i < src.length; i += 1) {
    const ch = src[i];
    if (quoted) { if (ch === "'") { if (src[i + 1] === "'") i += 1; else quoted = false; } continue; }
    if (ch === "'") quoted = true;
    else if (ch === '(') depth += 1;
    else if (ch === ')') { depth -= 1; if (depth === 0) return src.slice(open + 1, i); }
  }
  throw new Error(`unbalanced call at ${open}`);
}
const stripComments = (src) => src.replace(/--[^\n]*/g, '');
/** The column names of a TABLE(...) result. */
function tableColumns(result) {
  const m = /^(?:setof\s+)?TABLE\(([\s\S]*)\)$/i.exec(result.trim());
  return m ? splitTop(m[1]).map((c) => c.split(/\s+/)[0].replace(/^"|"$/g, '')) : null;
}
/** Every key of every jsonb_build_object in a body (a non-literal key by its expression text). */
function builtKeys(prosrc) {
  const src = stripComments(prosrc); const keys = new Set();
  for (const m of src.matchAll(/jsonb_build_object\s*\(/gi)) {
    const args = splitTop(callArgs(src, m.index + m[0].length - 1));
    for (let i = 0; i < args.length; i += 2) {
      const lit = /^'((?:[^']|'')*)'$/.exec(args[i]);
      keys.add(lit ? lit[1].replace(/''/g, "'") : args[i]);
    }
  }
  return [...keys];
}
const filterKeys = (prosrc) => [...new Set([...stripComments(prosrc).matchAll(/\b(?:p_)?filters\s*(?:\?|->>?)\s*'([^']+)'/g)].map((m) => m[1]))];
const sortKeys = (prosrc) => [...new Set([...stripComments(prosrc).matchAll(/\b(?:p_)?sort_key\s*=\s*'([^']+)'/g)].map((m) => m[1]))];
/** What a door reads beside what its row registers: unregistered and stale. */
const audit = (found, registered = {}) => ({
  unregistered: found.filter((k) => !(k in registered)).sort(),
  stale: Object.keys(registered).filter((k) => !found.includes(k)).sort(),
});

describe('VR20 (C): every door beside data is registered (the walker)', () => {
  /** @type {PGlite} */ let db;
  /** @type {{ proname: string, args: string, result: string, prosrc: string }[]} */ let census = [];

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    await db.exec(SCAFFOLD);
    const failed = [];
    for (const f of readdirSync(MIGRATIONS).filter((n) => /^\d{3}_.*\.sql$/.test(n)).sort()) {
      const sql = readFileSync(join(MIGRATIONS, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
      try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 160)}`); }
    }
    expect(failed).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
      insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
      update public.profiles set role = 'developer' where id = '${OWNER}';
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    census = (await db.query(`select p.proname, pg_get_function_identity_arguments(p.oid) as args, pg_get_function_result(p.oid) as result, p.prosrc
        from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public'
         and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute'))
         and p.prosrc ~ $1
       order by p.proname, args`, [CENSUS_BODY])).rows;
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('1 THE CENSUS: every function a visitor may execute that touches a shared town or map is registered with its kind; no registered row is stale', async () => {
    expect(census.length, 'the census found nothing: the walker is blind').toBeGreaterThan(0);
    const names = [...new Set(census.map((f) => f.proname))];
    expect(names.filter((n) => !(n in REGISTRY)), 'UNREGISTERED: class each in REGISTRY by reading its body').toEqual([]);
    expect(Object.entries(REGISTRY).filter(([, r]) => !KINDS.has(r.kind) || !r.why).map(([n]) => n), 'a row without a known kind or a why').toEqual([]);
    const absent = Object.keys(REGISTRY).filter((n) => !names.includes(n) && n !== TILE_ROWS);
    const existing = new Set((await db.query(`select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = any($1::text[])`, [absent])).rows.map((r) => r.proname));
    expect(absent.map((n) => `${n}: ${existing.has(n) ? 'exists but is no longer in the census' : 'no longer exists'}`), 'STALE registry rows').toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('2 THE COLUMNS OF EACH DOOR: every column of a TABLE door and every built key of a jsonb door is registered with its rule', () => {
    const problems = [];
    for (const f of census) {
      const row = REGISTRY[f.proname];
      if (row?.kind !== 'door') continue;
      if (!row.columns) { problems.push(`${f.proname}: a door with no columns map`); continue; }
      const cols = tableColumns(f.result);
      let found;
      if (cols) found = cols;
      else if (/^jsonb$/i.test(f.result.trim())) {
        found = builtKeys(f.prosrc);
        if (row.delegatesTo && !new RegExp(`\\bpublic\\.${row.delegatesTo}\\s*\\(`).test(f.prosrc)) problems.push(`${f.proname}: no longer returns ${row.delegatesTo} (delegatesTo is stale)`);
      } else { problems.push(`${f.proname}: a door returning ${f.result}: register how it is walked`); continue; }
      const { unregistered, stale } = audit(found, row.columns);
      for (const c of unregistered) problems.push(`${f.proname}.${c}: UNREGISTERED column`);
      for (const c of stale) problems.push(`${f.proname}.${c}: stale column (no longer returned)`);
      for (const [c, rule] of Object.entries(row.columns)) if (typeof rule !== 'string' || !rule) problems.push(`${f.proname}.${c}: no rule`);
    }
    expect(problems).toEqual([]);
  });

  it('3 FILTERS AND SORTS: every filter key and sort key the two gallery lists read is registered with its rule', () => {
    const problems = [];
    for (const name of ['list_gallery_dossiers', 'list_gallery_maps']) {
      const f = census.find((x) => x.proname === name);
      if (!f) { problems.push(`${name}: not in the census`); continue; }
      const filters = audit(filterKeys(f.prosrc), REGISTRY[name].filters);
      const sorts = audit(sortKeys(f.prosrc), REGISTRY[name].sorts);
      for (const k of filters.unregistered) problems.push(`${name} filter ${k}: UNREGISTERED`);
      for (const k of filters.stale) problems.push(`${name} filter ${k}: stale (no longer read)`);
      for (const k of sorts.unregistered) problems.push(`${name} sort ${k}: UNREGISTERED`);
      for (const k of sorts.stale) problems.push(`${name} sort ${k}: stale (no longer read)`);
    }
    expect(problems).toEqual([]);
  });

  it('4 THE TILE ROWS ARE NO DOOR: _gallery_public_tile_rows() is executable by neither anon nor authenticated', async () => {
    const r = (await db.query(`select to_regprocedure('public._gallery_public_tile_rows()') is not null as present,
      coalesce(has_function_privilege('anon', to_regprocedure('public._gallery_public_tile_rows()'), 'execute'), false) as a,
      coalesce(has_function_privilege('authenticated', to_regprocedure('public._gallery_public_tile_rows()'), 'execute'), false) as u`)).rows[0];
    expect({ anon: r.a, authenticated: r.u }, 'a visitor may call the tile rows directly (RAW data, owner_id)').toEqual({ anon: false, authenticated: false });
  }, ARM_TIMEOUT_MS);

  it("5 THE CHRONICLE'S CLASSES: every event type the app writes to a chronicle is classed by the SQL table and the JS table, which are equal; every class is target or covert", async () => {
    const src = (p) => readFileSync(resolve(ROOT, p), 'utf-8');
    // the store's own rows: a `type:` literal, or a ternary's fallback literal (settlementPendingEditWriters' TABLE_INCIDENT)
    const storeTypes = ['src/store/settlementSlice.js', 'src/store/settlementRenameHelpers.js', 'src/store/settlementPendingEditWriters.js']
      .flatMap((p) => [...src(p).matchAll(/\btype:\s*[^,\n]*?'([A-Z][A-Z0-9_]+)'/g)].map((m) => m[1]));
    const tableBlock = /const TABLE_EFFECTS = Object\.freeze\(\{([\s\S]*?)\}\);/.exec(src('src/domain/pendingEditIntents.js'));
    expect(tableBlock, 'TABLE_EFFECTS not found in pendingEditIntents.js: the scan is blind').toBeTruthy();
    const tableTypes = [...tableBlock[1].matchAll(/\[\s*'([A-Z][A-Z0-9_]+)'/g)].map((m) => m[1]);
    expect(storeTypes, "the store scan is blind: its own rows are no longer found").toEqual(expect.arrayContaining(['RENAME_SETTLEMENT', 'DESTROY_SETTLEMENT', 'TABLE_INCIDENT']));
    const written = [...new Set([...EVENT_TYPES, ...storeTypes, ...tableTypes])].sort();

    const present = (await db.query(`select to_regprocedure('public._gallery_doors_chronicle_classes()') is not null as p`)).rows[0].p;
    expect(present, 'public._gallery_doors_chronicle_classes() does not exist on the chain: the SQL class table is not built').toBe(true);
    const sqlClasses = (await db.query('select public._gallery_doors_chronicle_classes() as c')).rows[0].c;
    let jsClasses;
    try {
      ({ CHRONICLE_CLASSES: jsClasses } = await import(/* @vite-ignore */ resolve(ROOT, 'src/domain/display/galleryDoors.js')));
    } catch (e) {
      expect.fail(`src/domain/display/galleryDoors.js does not load (CHRONICLE_CLASSES is not built): ${String(e?.message || e).slice(0, 160)}`);
    }
    expect(written.filter((t) => !(t in (sqlClasses || {}))), 'written types the SQL table does not class').toEqual([]);
    expect(written.filter((t) => !(t in (jsClasses || {}))), 'written types CHRONICLE_CLASSES does not class').toEqual([]);
    expect(sqlClasses, 'the SQL and JS class tables differ').toEqual({ ...jsClasses });
    // VEIL-DOORS-2 (item 5): the classes, each with its rule in _gallery_doors_chronicle_classes' comment
    const CLASSES = ['house', 'person', 'power', 'target', 'covert', 'stressor', 'withheld'];
    const bad = (table, side) => Object.entries(table || {}).filter(([, c]) => !CLASSES.includes(c)).map(([t, c]) => `${side} ${t}: ${c}`);
    expect([...bad(sqlClasses, 'sql'), ...bad(jsClasses, 'js')], `a class outside ${CLASSES.join(', ')}`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('6 THE BAND TABLE IS ONE: STABILITY_BANDS equals the array inside _gallery_doors_band(text)', async () => {
    const r = (await db.query(`select p.prosrc from pg_proc p where p.oid = to_regprocedure('public._gallery_doors_band(text)')`)).rows[0];
    expect(r, 'public._gallery_doors_band(text) does not exist on the chain: the SQL band table is not built').toBeTruthy();
    const arr = /unnest\s*\(\s*array\s*\[([\s\S]*?)\]/i.exec(stripComments(r.prosrc));
    expect(arr, '_gallery_doors_band has no unnest(array[...]) to read').toBeTruthy();
    const sqlBands = [...arr[1].matchAll(/'((?:[^']|'')*)'/g)].map((m) => m[1].replace(/''/g, "'"));
    expect(sqlBands).toEqual([...STABILITY_BANDS]);
  }, ARM_TIMEOUT_MS);

  it('7 VR27 AS AMENDED, THE CATALOGUE: every underscore function of the share\'s family a visitor may execute stands on VISITOR_LIST with its context; no row is stale; 212 revokes none of the eight older helpers', async () => {
    const family = (await db.query(`select p.proname, bool_or(p.prosecdef) as definer from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname like '\\_%'
         and (p.proname like '\\_gallery\\_%' or p.proname like '\\_saved\\_maps\\_%' or p.prosrc ~ $1)
         and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute'))
       group by p.proname order by p.proname`, [CENSUS_BODY])).rows;
    expect(family.filter((f) => !(f.proname in VISITOR_LIST)).map((f) => `${f.proname}${f.definer ? ' (SECURITY DEFINER)' : ''}`),
      'a visitor may execute an underscore function of the share\'s family that no written context needs: revoke it by name').toEqual([]);
    expect(family.filter((f) => f.definer).map((f) => f.proname), 'a listed helper is a definer: a definer helper is never left to a visitor').toEqual([]);
    expect(Object.keys(VISITOR_LIST).filter((n) => !family.some((f) => f.proname === n)), 'STALE VISITOR_LIST rows (no longer executable by a visitor)').toEqual([]);
    expect(Object.entries(VISITOR_LIST).filter(([, r]) => !(r.needs || r.for213)).map(([n]) => n), 'a row with no context').toEqual([]);
    const sql = stripComments(readFileSync(join(MIGRATIONS, '212_share_veil_later_cures.sql'), 'utf-8'));
    const revokes = [...sql.matchAll(/\brevoke\b[^;]*;/gi)].map((m) => m[0]);
    expect(OLDER_EIGHT.filter((n) => revokes.some((r) => r.includes(n))), '212 revokes an older helper by name (VR27 as amended: SEC-GRANTS\'s 213)').toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('8 EVERY DOOR ANSWERS A VISITOR AFTER 212, AND A SIGNED-IN USER SAVES A MAP (the saved_maps trigger runs _gallery_world_snapshot_is_safe as that user)', async () => {
    const TOWN = { name: 'Rookford', population: 1800, institutions: [{ id: 'inst_mill', name: 'Mill', category: 'Economy' }, { id: 'inst_black', name: 'Black market', category: 'Criminal' }],
      powerStructure: { stability: 'Stable', factions: [] }, config: { terrainType: 'riverlands' } };
    const SID = 'e0000000-0000-0000-0000-000000000001';
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_importable,gallery_member_overrides,access_state)
      values ($1,$2,'Rookford','town',$3::jsonb,true,'v27-town',now(),'v27-link','unlisted',true,$4::jsonb,'active')`,
    [SID, OWNER, JSON.stringify(TOWN), JSON.stringify({ $veil: { v: 1, mode: 'live', at: '2026-11-01T00:00:00.000Z', deltas: [] } })]);
    await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign,gallery_importable,unlisted_slug,visibility,access_state)
      values (gen_random_uuid(),$1,'Realm',$2::jsonb,true,'v27-realm','map_with_campaign',true,true,'v27-maplink','unlisted','active')`, [OWNER, JSON.stringify({ campaign: { settlementIds: [SID] } })]);
    const CALLS = [
      ['get_gallery_dossier', `select * from public.get_gallery_dossier('v27-town')`, (r) => r.rows[0]?.id === SID],
      ['get_unlisted_dossier', `select public.get_unlisted_dossier('v27-link') as o`, (r) => r.rows[0]?.o?.id === SID],
      ['list_gallery_dossiers', `select * from public.list_gallery_dossiers(0, 24, 'newest', '', '{}'::jsonb, false)`, (r) => r.rows.some((x) => x.id === SID)],
      ['list_gallery_more_by_creator', `select * from public.list_gallery_more_by_creator('v27-town', 6)`, (r) => Array.isArray(r.rows)],
      ['list_featured_dossiers', `select * from public.list_featured_dossiers()`, (r) => Array.isArray(r.rows)],
      ['list_curated_dossiers', `select * from public.list_curated_dossiers()`, (r) => Array.isArray(r.rows)],
      ['get_gallery_map', `select public.get_gallery_map('v27-realm') as o`, (r) => r.rows[0]?.o?.members?.length === 1],
      ['get_unlisted_map', `select public.get_unlisted_map('v27-maplink') as o`, (r) => r.rows[0]?.o != null],
      ['list_gallery_maps', `select * from public.list_gallery_maps(0, 24, 'newest', '', '{}'::jsonb)`, (r) => r.rows.length >= 1],
      ['list_featured_maps', `select * from public.list_featured_maps()`, (r) => Array.isArray(r.rows)],
    ];
    const IMPORTS = [
      ['import_gallery_dossier', `select * from public.import_gallery_dossier('v27-town')`, (r) => r.rows[0]?.id === SID],
      ['import_gallery_map', `select public.import_gallery_map('v27-realm') as o`, (r) => r.rows[0]?.o != null],
    ];
    const problems = [];
    const call = async (role, [name, sql, ok]) => {
      try {
        await db.exec(`set role ${role}; set test.uid = '${role === 'anon' ? '' : READER}';`);
        const r = await db.query(sql);
        if (!ok(r)) problems.push(`${name} as ${role}: answered without the row`);
      } catch (e) { problems.push(`${name} as ${role}: ${String(e?.message || e).slice(0, 120)}`); } finally { await db.exec('reset role; reset test.uid;'); }
    };
    for (const role of ['anon', 'authenticated']) for (const c of CALLS) await call(role, c);
    for (const c of IMPORTS) await call('authenticated', c);
    // the map save: a signed-in user's own map with a world snapshot and sections, inserted then updated as that user
    const SNAP = JSON.stringify({ schemaVersion: 1, headline: 'A quiet season in the realm.' });
    try {
      await db.exec(`set role authenticated; set test.uid = '${READER}';`);
      const ins = await db.query(`insert into public.saved_maps (user_id, name, map_data, gallery_world_snapshot, gallery_world_sections)
        values ($1, 'My realm', '{}'::jsonb, $2::jsonb, '[]'::jsonb) returning id`, [READER, SNAP]);
      await db.query(`update public.saved_maps set gallery_world_snapshot = $2::jsonb, name = 'My realm, renamed' where id = $1`, [ins.rows[0].id, SNAP]);
    } catch (e) { problems.push(`a signed-in user's map save: ${String(e?.message || e).slice(0, 160)}`); } finally { await db.exec('reset role; reset test.uid;'); }
    expect(problems).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
