/**
 * galleryWorldSnapshotScanner.pglite.test.js — EXECUTION test of the NET-CURRENT
 * server-side world-snapshot scanner `_gallery_world_snapshot_is_safe` (089; the
 * `_config` denylist token added net-current in 127).
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
 * Plus the 127 fix:
 *  (127) the `_config` raw-authoring-config channel is rejected at any depth.
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
    // It must carry the hardened HARD-DENY list (deferredPartyImpacts is fix 3),
    // the 127 `_config` denylist token, and the 128 `latentPantheon` token.
    expect(SCANNER.sql).toMatch(/deferredPartyImpacts/);
    expect(SCANNER.sql).toMatch(/_config/);
    expect(SCANNER.sql).toMatch(/latentPantheon/i);
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

  it('(127) rejects the _config raw-authoring-config channel at any depth', async () => {
    // The RAW authoring config is SECRET on every public projection (099/121 seed
    // posture): its keys can carry the generation seed, plot hooks, DM notes. The
    // client PRIVATE_KEY_RE drops it; 127 mirrors that in the server scanner.
    expect(await isSafe({ schemaVersion: 1, _config: { seed: 42 } })).toBe(false);
    expect(await isSafe({ schemaVersion: 1, nested: [{ _config: { supplyChain: 1 } }] })).toBe(false);
    // Contains-semantics: a key that merely embeds the token is rejected too.
    expect(await isSafe({ schemaVersion: 1, raw_config: 1 })).toBe(false);
  });

  it('(128) rejects the latentPantheon unrevealed-starting-pantheon channel at any depth', async () => {
    // The LATENT PANTHEON is baked into every seed but UNREVEALED until premium
    // activation (Phase 4 premium gate): the gods a dossier has not yet named. The
    // client PRIVATE_KEY_RE drops it; 128 mirrors that in the server scanner so a
    // world snapshot embedding a settlement config cannot carry it to anon.
    expect(await isSafe({ schemaVersion: 1, latentPantheon: { patron: { name: 'X' } } })).toBe(false);
    expect(await isSafe({ schemaVersion: 1, settlements: { Brack: { config: { latentPantheon: {} } } } })).toBe(false);
    // Contains-semantics: a key that merely embeds the token is rejected too.
    expect(await isSafe({ schemaVersion: 1, latentPantheonRef: 1 })).toBe(false);
    // But the ACTIVATED live embeds are NOT rejected — a shared premium pantheon is
    // visible read-only to all (the owner's premium-gate ruling).
    expect(await isSafe({ schemaVersion: 1, settlements: { Brack: { config: { primaryDeitySnapshot: { name: 'Sun' } } } } })).toBe(true);
  });

  it('(135) rejects the merged-wave conditional ledgers (spatialLedgers/politicsLedgers/warPosture/…) at any depth', async () => {
    // The census lift: every worldState CONDITIONAL_LEDGER_KEY but pantheon is hard-denied.
    // These carry the DM-private heart of the sim (covert blocs, war posture, the raw
    // spatial mover ledgers). The client final-scrub drops them; 135 mirrors that server-side.
    for (const key of ['spatialLedgers', 'politicsLedgers', 'warPosture', 'religionStates', 'occupations', 'martialReadiness', 'conquestFeeds', 'mercenaryMarket', 'rulesetLog', 'spatialDigest', 'narrativeTempo']) {
      expect(await isSafe({ schemaVersion: 1, [key]: { a: 1 } }), `${key} must be rejected`).toBe(false);
      expect(await isSafe({ schemaVersion: 1, nested: [{ [key]: {} }] }), `nested ${key} must be rejected`).toBe(false);
    }
    // The PUBLIC-allowlisted pantheon is NOT rejected (its scrubbed derivation is surfaced).
    expect(await isSafe({ schemaVersion: 1, pantheon: { sun: { tier: 'major', seats: 3 } } })).toBe(true);
  });

  it('(130) accepts public economics-attribution notes but still rejects the private note keys', () => {
    // The `note` channel is narrowed to the genuinely-private note keys (mirroring the
    // client PRIVATE_KEY_RE): a published world snapshot embedding a settlement config
    // with a public economics note (upstreamNote / magicFoodNote / storageNote) is no
    // longer false-REJECTED, while a dmNotes-class / bare notes key still is.
    return Promise.all([
      // ACCEPTED — public economics annotations (no \y before "Note").
      expect(isSafe({ schemaVersion: 1, settlements: { Brack: { economicState: { activeChains: [{ upstreamNote: 'imported grain' }] } } } })).resolves.toBe(true),
      expect(isSafe({ schemaVersion: 1, x: { magicFoodNote: 'divine provision', storageNote: '8mo' } })).resolves.toBe(true),
      // REJECTED — the genuinely-private note keys.
      expect(isSafe({ schemaVersion: 1, notes: 'scratch' })).resolves.toBe(false),
      expect(isSafe({ schemaVersion: 1, deep: { note: 'x' } })).resolves.toBe(false),
      expect(isSafe({ schemaVersion: 1, dossierNotes: 'prep' })).resolves.toBe(false),
      expect(isSafe({ schemaVersion: 1, tabNotes: { a: 1 } })).resolves.toBe(false),
      expect(isSafe({ schemaVersion: 1, deep: { dmNote: 'secret' } })).resolves.toBe(false),
    ]);
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
