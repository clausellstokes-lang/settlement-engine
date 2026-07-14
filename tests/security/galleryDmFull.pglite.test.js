/**
 * galleryDmFull.pglite.test.js — EXECUTION test for the SERVER DM-share (full)
 * projection _gallery_dm_full_json (net-current migration 129, which adds the
 * latentPantheon strip to 121).
 *
 * The DM-full opt-in (gallery_share_dm) publishes the owner's OWN DM-private
 * content — secrets, hooks, NPC goals, DM Compass — but NOT content the dossier
 * has yet to name. The Phase 4 latent pantheon is exactly that: gods still latent
 * in the seed, unrevealed until a premium activation copies them into the LIVE
 * embeds. The architect ruling: unrevealed content never leaves the account, not
 * even on a DM-full share. This proves the SERVER dm_full body strips it (and the
 * ACTIVATED embeds survive), plus the static net-current drift check.
 *
 * It loads the NET-CURRENT dm_full body (latest-wins across all migrations), so the
 * 129 amendment is exercised, not the superseded 121 definition — self-contained
 * SQL, loads verbatim into pglite with no stubs.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins extraction of the net-current `_gallery_dm_full_json` body across
 *  all migrations (file order). Returns the LAST definition so the EFFECTIVE server
 *  projection is tested, not a superseded one. */
function netCurrentDmFullSql() {
  if (!existsSync(MIGRATIONS_DIR)) return null;
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = /create\s+or\s+replace\s+function\s+public\._gallery_dm_full_json\b[\s\S]*?\$\$;/ig;
  let last = null;
  for (const f of files) {
    const src = readFileSync(join(MIGRATIONS_DIR, f), 'utf-8');
    const matches = src.match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return last;
}

const DM_FULL_SQL = netCurrentDmFullSql();

// A representative DM-share settlement: allowlisted public content + the owner's
// DM-private content (kept in full mode), a `config` carrying the UNREVEALED latent
// pantheon (must strip) alongside the ACTIVATED live embeds (must survive), plus
// both generation seed carriers at the top level and config._seed (all secret in
// EVERY gallery view — 099/121).
const SETTLEMENT = {
  name: 'Brackwater', tier: 'town', population: 1200,
  thesis: 'A salt town that forgot its founding.',
  plotHooks: ['the heir is hidden'],
  dmCompass: { twist: 'the mayor is a doppelganger' },
  npcs: [{ id: 'n1', name: 'Aldric', role: 'Mayor', goal: 'seize power', secret: 'bastard heir' }],
  // AI prose blobs (dropped) + a DM Compass on aiSettlement (kept as the four fields):
  aiData: { aiSettlement: {} }, aiDailyLife: { dawn: 'z' },
  aiSettlement: {
    name: 'Refined Brackwater', npcs: [{ name: 'prose' }],
    identityMarkers: ['m1'], frictionPoints: ['f1'], connectionsMap: ['c1'], dmCompass: { hooks: ['h'] },
  },
  dmNotes: 'the BBEG is the mayor', dossierNotes: 'prep', notes: 'scratch', narrativeNotes: 'n',
  // Generation seeds — secret in every gallery view (099/121):
  _seed: 'abc', _regenSeed: 'def', _config: { raw: 1 },
  config: {
    _seed: 'nested-seed',
    // UNREVEALED — the Phase 4 premium-gate secret; must never leave the account.
    latentPantheon: { patron: { name: 'The Deep', _deityRef: 'deity:core:the_deep' }, cults: [{ name: 'Ash' }] },
    // ACTIVATED live embeds — a shared premium pantheon is visible read-only to all.
    primaryDeityRef: 'deity:core:sun',
    primaryDeitySnapshot: { name: 'Sun', alignmentAxis: 'good', rankAxis: 'major' },
    cultDeitySnapshots: [{ name: 'Ash', alignmentAxis: 'evil' }],
    faithProfile: { patron: { name: 'Sun', share: 62 } },
    tradeRouteAccess: 'road',
  },
};

let db;

// Anti-vacuity ([tests-3]/[test-quality-2]): if `_gallery_dm_full_json` is renamed
// or dropped across a migration merge, the extraction returns null and the execution
// suite below silently describe.runIf-skips while vitest stays green. This
// UNCONDITIONAL assert fails loudly — the net-current server projection must exist.
describe('_gallery_dm_full_json exists in the migration corpus (guards against silent vacuous skip)', () => {
  it('a net-current _gallery_dm_full_json definition is present (renamed/dropped must fail loudly)', () => {
    expect(existsSync(MIGRATIONS_DIR), `migrations dir missing: ${MIGRATIONS_DIR}`).toBe(true);
    expect(DM_FULL_SQL, '_gallery_dm_full_json not found in any migration — renamed?').toBeTruthy();
  });
});

describe.runIf(!!DM_FULL_SQL)('_gallery_dm_full_json — DM-full latent-pantheon strip (pglite)', () => {
  let serverOut;

  beforeAll(async () => {
    db = new PGlite();
    await db.exec(DM_FULL_SQL);
    const row = (await db.query(
      `select public._gallery_dm_full_json($1::jsonb) as j`,
      [JSON.stringify(SETTLEMENT)],
    )).rows[0];
    serverOut = row.j;
  }, 30000); // PGlite WASM cold-start is ~8s under parallel load — beyond the 10s default.

  it('static: the net-current dm_full body strips latentPantheon (129 drift guard)', () => {
    // The config re-add must remove BOTH _seed AND latentPantheon.
    expect(DM_FULL_SQL).toMatch(/\(j -> 'config'\)\s*-\s*'_seed'\s*-\s*'latentPantheon'/);
  });

  it('(129) strips config.latentPantheon but keeps the activated live embeds', () => {
    expect(serverOut.config).toBeTruthy();
    expect(serverOut.config.latentPantheon, 'the unrevealed latent pantheon must not leak on DM-full share').toBeUndefined();
    expect(serverOut.config.primaryDeityRef).toBe('deity:core:sun');
    expect(serverOut.config.primaryDeitySnapshot).toEqual({ name: 'Sun', alignmentAxis: 'good', rankAxis: 'major' });
    expect(serverOut.config.cultDeitySnapshots).toEqual([{ name: 'Ash', alignmentAxis: 'evil' }]);
    expect(serverOut.config.faithProfile).toEqual({ patron: { name: 'Sun', share: 62 } });
    expect(serverOut.config.tradeRouteAccess).toBe('road');
  });

  it('keeps the owner DM-private content the full opt-in reveals (121 behaviour intact)', () => {
    expect(serverOut.plotHooks).toEqual(['the heir is hidden']);
    expect(serverOut.dmCompass).toEqual({ twist: 'the mayor is a doppelganger' });
    expect(serverOut.npcs[0].goal).toBe('seize power');
    expect(serverOut.npcs[0].secret).toBe('bastard heir');
    // The DM Compass on aiSettlement is preserved (only the four fields)…
    expect(serverOut.aiSettlement).toEqual({
      identityMarkers: ['m1'], frictionPoints: ['f1'], connectionsMap: ['c1'], dmCompass: { hooks: ['h'] },
    });
    // …the prose is gone.
    expect(serverOut.aiSettlement.name).toBeUndefined();
  });

  it('still strips the prose/notes and BOTH generation seeds (121 behaviour intact)', () => {
    for (const k of ['aiData', 'aiDailyLife', 'dmNotes', 'dossierNotes', 'notes', 'narrativeNotes', '_seed', '_regenSeed', '_config']) {
      expect(serverOut[k], `"${k}" must not leak on DM-full share`).toBeUndefined();
    }
    expect(serverOut.config._seed, 'nested config._seed must not leak').toBeUndefined();
  });

  it('the client twin toPublicSafe({full:true}) strips latentPantheon identically', () => {
    // The client full-mode projection mirrors the server strip on the faith surface:
    // latentPantheon out, activated embeds in. (The client full mode is a
    // pre-publish preview; the server remains the security boundary.)
    const clientOut = toPublicSafe(SETTLEMENT, { full: true });
    expect(clientOut.config.latentPantheon).toBeUndefined();
    expect(serverOut.config.latentPantheon).toBeUndefined();
    expect(clientOut.config.primaryDeitySnapshot).toEqual(serverOut.config.primaryDeitySnapshot);
    expect(clientOut.config.cultDeitySnapshots).toEqual(serverOut.config.cultDeitySnapshots);
    expect(clientOut.config.faithProfile).toEqual(serverOut.config.faithProfile);
  });
});
