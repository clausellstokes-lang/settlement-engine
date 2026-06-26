/**
 * savedMapsSnapshotTrigger.pglite.test.js — EXECUTION proof that the 091 BEFORE
 * INSERT OR UPDATE guard on public.saved_maps closes the edit-after-publish BYPASS
 * 089 left open.
 *
 * THE TRAP THIS CLOSES: 089's scanner guards ONLY publish_map. But
 * updateMapGalleryMetadata (src/lib/gallery.js) writes gallery_world_snapshot AND
 * gallery_world_sections via a DIRECT owner-RLS
 * `supabase.from('saved_maps').update(...)`, never touching publish_map — so the
 * 089 scanner is skipped entirely on that path, and the edit path could store raw
 * DM content (a HARD-DENY / covert key) that get_gallery_map then serves to anon.
 *
 * 091 adds a BEFORE INSERT OR UPDATE trigger that enforces the same contract on
 * EVERY write path. This test loads the NET-CURRENT scanner + the 091 guard
 * function + trigger into in-process Postgres (pglite) and RUNS a DIRECT UPDATE
 * (NOT publish_map — that is the whole point: this exercises the bypassed path).
 *
 * REPRODUCING: every rejection assertion below FAILS before 091 (a direct UPDATE
 * with a forbidden snapshot/section landed silently) and PASSES after, because the
 * trigger now RAISES on the write.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins extraction of a `create or replace function` body across all
 *  migrations (file order) — returns the LAST definition so we exercise the
 *  net-current behaviour, not a superseded one. */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'ig');
  let last = null;
  for (const f of files) {
    const matches = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8').match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return last;
}

/** Extract the `create trigger <name> ...;` statement from the 091 migration file
 *  so the test wires up the REAL trigger DDL, not a hand-rolled copy. */
function triggerStmt(file, name) {
  const sql = readFileSync(resolve(MIGRATIONS_DIR, file), 'utf-8');
  const re = new RegExp(`create\\s+trigger\\s+${name}\\b[\\s\\S]*?;`, 'i');
  const m = sql.match(re);
  return m ? m[0] : null;
}

const OWNER = '11111111-1111-1111-1111-111111111111';
const MAP_ID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const TRIGGER_FILE = '091_saved_maps_snapshot_guard_trigger.sql';

const SAFE_FN = netCurrentFn('_gallery_world_snapshot_is_safe');
const GUARD_FN = netCurrentFn('_saved_maps_world_snapshot_guard');
const TRIGGER = triggerStmt(TRIGGER_FILE, 'trg_saved_maps_world_snapshot_guard');

let db;

describe('saved_maps world-snapshot guard trigger — net-current execution (pglite)', () => {
  it('locates the net-current scanner + the 091 guard function and trigger', () => {
    expect(SAFE_FN, 'no _gallery_world_snapshot_is_safe found (089)').toBeTruthy();
    expect(GUARD_FN, 'no _saved_maps_world_snapshot_guard found (091)').toBeTruthy();
    expect(TRIGGER, 'no trg_saved_maps_world_snapshot_guard found (091)').toBeTruthy();
    // The guard MUST gate the snapshot on schemaVersion = 1 AND the safe scan, and
    // run the safe scan over sections too — guard against a recreate dropping either.
    expect(GUARD_FN).toMatch(/schemaVersion/i);
    expect(GUARD_FN).toMatch(/_gallery_world_snapshot_is_safe\s*\(\s*new\.gallery_world_snapshot/i);
    expect(GUARD_FN).toMatch(/_gallery_world_snapshot_is_safe\s*\(\s*new\.gallery_world_sections/i);
    // It MUST fire BEFORE the write (so a violation aborts before the row lands).
    expect(TRIGGER).toMatch(/before\s+insert\s+or\s+update\s+on\s+public\.saved_maps/i);
  });

  beforeAll(async () => {
    db = new PGlite();
    await db.exec('create schema if not exists public;');

    // Minimal saved_maps shape carrying the two anon-served artifacts the guard
    // inspects (plus enough columns to insert a seed row).
    await db.exec(`
      create table public.saved_maps (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        name text,
        share_kind text default 'map',
        map_data jsonb default '{}'::jsonb,
        is_public boolean default false,
        public_slug text,
        gallery_share_world boolean default false,
        gallery_world_sections jsonb,
        gallery_world_snapshot jsonb
      );
    `);

    // Load the net-current scanner (089), then the 091 guard fn + trigger.
    await db.exec(SAFE_FN);
    await db.exec(GUARD_FN);
    await db.exec(TRIGGER);

    // A seed row the OWNER can edit. Insert with NULL snapshot/sections so the
    // baseline row is clean — every test below mutates it via a DIRECT UPDATE,
    // exactly the path updateMapGalleryMetadata takes (NOT publish_map).
    await db.exec(`
      insert into public.saved_maps (id, user_id, name, map_data, share_kind, is_public, public_slug)
      values ('${MAP_ID}', '${OWNER}', 'Edited Map', '{}'::jsonb, 'map_with_campaign', true, 'edit-slug');
    `);
  });

  /** A DIRECT update of the stored snapshot — the bypassed edit path. */
  const updateSnapshot = (snapshot) =>
    db.query(
      `update public.saved_maps set gallery_world_snapshot = $1::jsonb where id = '${MAP_ID}'`,
      [snapshot === null ? null : JSON.stringify(snapshot)],
    );

  /** A DIRECT update of the stored sections — also bypassed by 089. */
  const updateSections = (sections) =>
    db.query(
      `update public.saved_maps set gallery_world_sections = $1::jsonb where id = '${MAP_ID}'`,
      [sections === null ? null : JSON.stringify(sections)],
    );

  it('REJECTS a direct UPDATE of gallery_world_snapshot carrying a nested HARD-DENY key', async () => {
    // The exact bypass: a forbidden key nested deep inside an otherwise-allowed
    // section, written via the direct owner-RLS UPDATE path (not publish_map).
    await expect(
      updateSnapshot({ schemaVersion: 1, dashboard: { rngSeed: 12345 } }),
    ).rejects.toThrow(/forbidden private key/i);
  });

  it('REJECTS a direct UPDATE of gallery_world_snapshot carrying a top-level HARD-DENY key', async () => {
    await expect(
      updateSnapshot({ schemaVersion: 1, npcStates: { n1: { secret: 'x' } } }),
    ).rejects.toThrow(/forbidden private key/i);
  });

  it('REJECTS a direct UPDATE of gallery_world_snapshot carrying a covert prose channel', async () => {
    await expect(
      updateSnapshot({ schemaVersion: 1, summary: { rollExplanation: 'DM rolled a 1' } }),
    ).rejects.toThrow(/forbidden private key/i);
  });

  it('REJECTS a snapshot missing schemaVersion = 1 as malformed', async () => {
    await expect(
      updateSnapshot({ worldClock: { tick: 1 } }),
    ).rejects.toThrow(/schemaVersion/i);
  });

  it('REJECTS a non-object snapshot (a scalar/array smuggled in its place)', async () => {
    await expect(
      updateSnapshot([{ schemaVersion: 1 }]),
    ).rejects.toThrow(/malformed/i);
  });

  it('REJECTS a direct UPDATE of gallery_world_sections carrying a forbidden key', async () => {
    // Sections gets the same depth scan (no version gate): a covert key buried in
    // a section array element is rejected.
    await expect(
      updateSections([{ title: 'Wars' }, { preWorldState: { hidden: true } }]),
    ).rejects.toThrow(/forbidden private key/i);
  });

  it('ALLOWS a clean, versioned snapshot via the direct UPDATE path (stored verbatim)', async () => {
    await updateSnapshot({ schemaVersion: 1, worldClock: { tick: 7 } });
    const stored = (await db.query(
      `select gallery_world_snapshot as s from public.saved_maps where id = '${MAP_ID}'`,
    )).rows[0].s;
    expect(stored).toEqual({ schemaVersion: 1, worldClock: { tick: 7 } });
  });

  it('ALLOWS a clean sections array via the direct UPDATE path', async () => {
    await updateSections([{ title: 'Wars' }, { title: 'Pantheon' }]);
    const stored = (await db.query(
      `select gallery_world_sections as s from public.saved_maps where id = '${MAP_ID}'`,
    )).rows[0].s;
    expect(stored).toEqual([{ title: 'Wars' }, { title: 'Pantheon' }]);
  });

  it('ALLOWS nulling the snapshot out (no shared-world panel is nothing to leak)', async () => {
    await updateSnapshot(null);
    const stored = (await db.query(
      `select gallery_world_snapshot as s from public.saved_maps where id = '${MAP_ID}'`,
    )).rows[0].s;
    expect(stored).toBeNull();
  });

  it('REJECTS a forbidden snapshot at INSERT time too (the trigger fires on insert)', async () => {
    await expect(
      db.query(
        `insert into public.saved_maps (user_id, name, gallery_world_snapshot)
           values ('${OWNER}', 'New Row', $1::jsonb)`,
        [JSON.stringify({ schemaVersion: 1, factionStates: { f1: 'secret' } })],
      ),
    ).rejects.toThrow(/forbidden private key/i);
  });
});
