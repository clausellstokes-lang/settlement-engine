/**
 * galleryWorldSnapshotScanner.pglite.test.js — EXECUTION test of the NET-CURRENT
 * server-side world-snapshot scanner `_gallery_world_snapshot_is_safe` (089).
 *
 * The scanner is the server-side defense-in-depth that publish_map calls to REJECT
 * a client-supplied p_world_snapshot before it is stored and later served to anon by
 * get_gallery_map. A bypass here re-rests the whole worldState privacy contract on
 * the unprivileged client serializer alone, so the scanner's behaviour is loaded
 * latest-wins from the migrations and RUN against adversarial snapshots.
 *
 * Covers the three 089 hardening fixes:
 *  (1) case-insensitive HARD-DENY compare  — a mixed/upper-cased forbidden key
 *      (NpcStates) is rejected, not just the camelCase literal.
 *  (2) covert-regex parity + whole-key anchoring — a bare "explanation" key is
 *      rejected (covert union), while a benign settlement key that merely CONTAINS a
 *      token ("Seedhaven") is accepted (not false-rejected by a substring match).
 *  (3) deferredPartyImpacts is in the HARD-DENY set — rejected at any depth.
 *
 * A clean schemaVersion = 1 snapshot still passes.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins extraction of a `create or replace function` body across all
 *  migrations (file order). Returns the LAST definition so we test the net-current
 *  behaviour, not a superseded one. */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'ig');
  let last = null;
  let lastFile = null;
  for (const f of files) {
    const src = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8');
    const matches = src.match(re);
    if (matches && matches.length) { last = matches[matches.length - 1]; lastFile = f; }
  }
  return { sql: last, file: lastFile };
}

let db;
const SCANNER = netCurrentFn('_gallery_world_snapshot_is_safe');

describe('gallery world-snapshot scanner — net-current execution (pglite)', () => {
  // Hard-fail (not skip) if the net-current scanner can't be located — a moved or
  // renamed migration must surface loudly, not silently drop this coverage.
  it('locates the net-current _gallery_world_snapshot_is_safe across migrations', () => {
    expect(SCANNER.sql, 'no _gallery_world_snapshot_is_safe found in any migration').toBeTruthy();
    // It must carry the hardened HARD-DENY list (deferredPartyImpacts is fix 3).
    expect(SCANNER.sql).toMatch(/deferredPartyImpacts/);
  });

  beforeAll(async () => {
    db = new PGlite();
    // The function pins `set search_path = public`; create the schema + load it.
    await db.exec('create schema if not exists public;');
    await db.exec(SCANNER.sql);
  });

  const isSafe = async (obj) =>
    (await db.query(`select public._gallery_world_snapshot_is_safe($1::jsonb) as out`, [JSON.stringify(obj)])).rows[0].out;

  it('(1) rejects a HARD-DENY key in mixed/upper case (NpcStates)', async () => {
    expect(await isSafe({ schemaVersion: 1, NpcStates: { a: 1 } })).toBe(false);
    // And the canonical camelCase form, plus a nested occurrence.
    expect(await isSafe({ schemaVersion: 1, npcStates: {} })).toBe(false);
    expect(await isSafe({ schemaVersion: 1, deep: { NPCSTATES: 1 } })).toBe(false);
  });

  it('(2) rejects a bare "explanation" key (covert-regex parity)', async () => {
    expect(await isSafe({ schemaVersion: 1, explanation: 'why the dice fell' })).toBe(false);
    // Sibling private channels from PRIVATE_KEY_RE are also covered.
    expect(await isSafe({ schemaVersion: 1, dmNotes: 'secret' })).toBe(false);
    expect(await isSafe({ schemaVersion: 1, gmGuidance: 'tense' })).toBe(false);
  });

  it('(2) accepts a benign settlement key that merely CONTAINS "seed" (Seedhaven)', async () => {
    expect(await isSafe({ schemaVersion: 1, settlements: { Seedhaven: { pop: 1200 } } })).toBe(true);
    // A seed-prefixed camelCase key is also benign (whole-key anchoring).
    expect(await isSafe({ schemaVersion: 1, seedTick: 4 })).toBe(true);
    // But the exact seed channels are still rejected.
    expect(await isSafe({ schemaVersion: 1, seed: 42 })).toBe(false);
    expect(await isSafe({ schemaVersion: 1, rngSeed: 42 })).toBe(false);
  });

  it('(3) rejects deferredPartyImpacts at any depth', async () => {
    expect(await isSafe({ schemaVersion: 1, deferredPartyImpacts: [] })).toBe(false);
    expect(await isSafe({ schemaVersion: 1, nested: [{ deferredPartyImpacts: { x: 1 } }] })).toBe(false);
  });

  it('passes a clean schemaVersion = 1 snapshot', async () => {
    const clean = {
      schemaVersion: 1,
      sourceWorldStateSchemaVersion: 7,
      worldClock: { tick: 12, calendar: { elapsedMonths: 3, month: 4, year: 2, season: 'spring' } },
      pantheon: [{ deityId: 'sun', name: 'Sun', tier: 'major', seats: 3, wins: 1, losses: 0 }],
      warNetwork: { sieges: [], tradeWars: [], dispositions: [], channels: [] },
      dashboard: { simulationRules: { presetId: 'balanced' }, realmArcLines: [] },
      settlements: { Seedhaven: { pop: 1200 } },
    };
    expect(await isSafe(clean)).toBe(true);
  });
});
