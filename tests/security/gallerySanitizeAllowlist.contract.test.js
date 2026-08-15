/**
 * gallerySanitizeAllowlist.contract.test.js — the public-projection ALLOWLIST
 * drift pin + round trip (review finding: sanitizer failed OPEN).
 *
 * Migration 050 flipped the SERVER settlement sanitizer
 * (_gallery_sanitize_public_json) and its CLIENT twin (publicSafe.js
 * toPublicSafe) from a top-level DENYLIST to a top-level ALLOWLIST, so a future
 * DM-private top-level field can no longer leak just because its key misses the
 * private-key regex. This file guards the two halves that must stay true:
 *
 *   1. DRIFT PIN — the SQL allowlist (parsed from the migration text) and the JS
 *      PUBLIC_TOPLEVEL_KEYS export are the SAME set. If one side gains/loses a
 *      key without the other, this fails.
 *   2. ROUND TRIP — sanitizing a REAL freshly-generated settlement (plus the
 *      narrated + DM-private keys the app attaches later) retains every key the
 *      public dossier renders and drops every DM-private key. Too-tight would
 *      break the gallery; too-loose would leak.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { toPublicSafe, PUBLIC_TOPLEVEL_KEYS } from '../../src/domain/display/publicSafe.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const MIGRATION = resolve(process.cwd(), 'supabase', 'migrations', '123_money_and_public_projection_hardening.sql');

// ── The MERGED (Wave-1) canonical top-level allowlist ────────────────────────
// This is the fused 123 SQL allowlist and the source of truth the JS twin
// (src/domain/display/publicSafe.js PUBLIC_TOPLEVEL_KEYS) must be reconciled TO
// by the src/domain merge wave. Wave-1 changed our pre-merge list by:
//   • REMOVING '_seed' + '_config' (secret on every shared surface — 099/121).
//   • ADDING crossSettlementConflicts, interSettlementRelationships,
//     neighbourNetwork, populationHistory (top-level keys their post-088 public
//     dossier serves AND renders in the anonymous playerView — reconciled per the
//     Wave-0 audit's fusion spec B step 6).
const CANONICAL_ALLOWLIST = [
  'activeConditions', 'arrivalScene', 'availableServices', 'coherenceNotes', 'config',
  'conflicts', 'crossSettlementConflicts', 'dailyLife', 'defenseProfile', 'economicState',
  'economicViability', 'factions', 'generatorVersion', 'history', 'id',
  'institutions', 'interSettlementRelationships', 'name', 'neighborRelationship', 'neighbourNetwork',
  'npcs', 'population', 'populationHistory', 'powerStructure', 'pressureSentence',
  'prominentRelationship', 'relationships', 'resourceAnalysis', 'schemaVersion', 'settlementReason',
  'simulationVersion', 'spatialLayout', 'stress', 'stressors', 'structuralSuggestions',
  'structuralViolations', 'thesis', 'tier',
];

/** Parse the `public_toplevel constant text[] := array[ '…','…' ];` literal from
 *  the fused migration 123 into a JS array of the quoted keys. */
function parseSqlAllowlist(sql) {
  const m = sql.match(/public_toplevel\s+constant\s+text\[\]\s*:=\s*array\[([\s\S]*?)\]/i);
  if (!m) throw new Error('could not find public_toplevel allowlist in migration 123');
  return [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
}

/** Parse the `npc_allowed constant text[] := array[ '…','…' ];` NPC-field allowlist. */
function parseSqlNpcAllowlist(sql) {
  const m = sql.match(/npc_allowed\s+constant\s+text\[\]\s*:=\s*array\[([\s\S]*?)\]/i);
  if (!m) throw new Error('could not find npc_allowed allowlist in migration 123');
  return [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
}

const migExists = existsSync(MIGRATION);

describe.runIf(migExists)('public sanitizer allowlist — drift pin (SQL ⇄ JS)', () => {
  const sql = readFileSync(MIGRATION, 'utf-8');

  it('the migration keeps a top-level allowlist gate (not a bare denylist)', () => {
    // The settlement ROOT gate is the allowlist; the deeper denylist stays.
    expect(sql).toMatch(/is_toplevel\s+and\s+not\s*\(key\s*=\s*any\(public_toplevel\)\)/);
    expect(sql).toMatch(/not\s+is_toplevel\s+and\s+key\s*~\*/); // denylist only deeper
  });

  it('the SQL 123 allowlist equals the merged canonical set (no dupes)', () => {
    const sqlKeys = parseSqlAllowlist(sql).sort();
    expect(sqlKeys).toEqual([...CANONICAL_ALLOWLIST].sort());
    expect(new Set(sqlKeys).size).toBe(sqlKeys.length);
  });

  it('the SQL allowlist drops _seed/_config and every leak-prone / DM-private key', () => {
    const set = new Set(parseSqlAllowlist(sql));
    for (const forbidden of [
      '_seed', '_config', // Wave-1: seed/raw-config are secret; dropped from the allowlist.
      'aiData', 'aiSettlement', 'aiDailyLife', 'aiOverlays', 'userCanon',
      'dmNotes', 'dmCompass', 'dossierNotes', 'notes', 'narrativeNotes', 'tabNotes',
      'plotHooks', 'pinnedNpc', 'identityMarkers', 'frictionPoints', 'connectionsMap',
      'simulationTrace', 'pendingEdits', 'campaign', 'version_history',
    ]) {
      expect(set.has(forbidden)).toBe(false);
    }
  });

  // THE ROADS §15 binding 1: npc.whereabouts (the live-movement display mirror) is DM-SECRET
  // BY CONSTRUCTION — never added to the NPC allowlist on EITHER side, so every shared/
  // gallery/anonymous payload drops it by fail-closed omission.
  it('the SQL npc_allowed field allowlist does NOT carry whereabouts (roads §15 binding 1)', () => {
    const npcKeys = new Set(parseSqlNpcAllowlist(sql));
    expect(npcKeys.has('whereabouts'), 'npc.whereabouts must never be a public NPC field').toBe(false);
    // sanity: the allowlist is the real (non-empty) NPC field gate.
    expect(npcKeys.has('name')).toBe(true);
  });

  it('the SQL denylist folds in seed/_config so nested config._seed cannot leak (099)', () => {
    // `config` is allowlisted at top level, so the deeper denylist MUST carry the
    // seed/_config tokens (fusion spec B step 3 / audit surprise #4).
    const denyLine = sql.match(/not\s+is_toplevel\s+and\s+key\s*~\*\s*'([^']+)'/i);
    expect(denyLine, 'deeper denylist regex present').toBeTruthy();
    expect(denyLine[1]).toMatch(/\|seed\|_config\)?/);
  });

  // ── SQL ⇄ JS drift pin — src/domain publicSafe.js twin merged (W2b) ──────────
  // The JS twin (PUBLIC_TOPLEVEL_KEYS) has been reconciled to CANONICAL_ALLOWLIST
  // (dropped _seed/_config, added the 4 relationship/history keys) by the src/domain
  // merge wave, so SQL == JS == canonical now holds strictly. The transitional
  // delta guard that lived here (asserting the KNOWN {seed/config} vs {4 render
  // keys} lag) was DELETED at the same time — its whole purpose was to stay green
  // while the twin lagged; both arrays are now equal.
  it('SQL 123 allowlist == JS PUBLIC_TOPLEVEL_KEYS', () => {
    expect(parseSqlAllowlist(sql).sort()).toEqual([...PUBLIC_TOPLEVEL_KEYS].sort());
  });
});

describe('public sanitizer allowlist — round trip against a REAL settlement', () => {
  const settlement = generateSettlementPipeline({}, null, { seed: 'allowlist-round-trip', customContent: {} });

  // Every top-level key a fresh generation produces that IS on the allowlist must
  // survive (retain what the public dossier renders — too-tight breaks the gallery).
  it('retains every allowlisted key present in a freshly generated settlement', () => {
    const out = toPublicSafe(settlement);
    const allow = new Set(PUBLIC_TOPLEVEL_KEYS);
    const expected = Object.keys(settlement).filter(k => allow.has(k));
    expect(expected.length).toBeGreaterThan(20); // sanity: it's a rich object
    for (const k of expected) {
      expect(out, `expected public key "${k}" to survive`).toHaveProperty(k);
    }
  });

  // Generation-time private keys (present in a fresh settlement) must NOT leak —
  // these are exactly the class the old denylist missed.
  it('drops the AI/owner-private keys a fresh generation carries (aiOverlays, userCanon, simulationTrace)', () => {
    const out = toPublicSafe(settlement);
    for (const k of ['aiOverlays', 'userCanon', 'simulationTrace']) {
      // Only assert if the generator actually emitted it (belt + suspenders).
      if (k in settlement) expect(out[k], `"${k}" must be dropped`).toBeUndefined();
    }
  });

  // App-attached DM-private blocks (added after generation) must be dropped by
  // omission — the whole point of the fail-closed flip.
  it('drops later-attached DM-private top-level blocks', () => {
    const hydrated = {
      ...settlement,
      dmNotes: 'the BBEG is the mayor',
      aiData: { aiSettlement: { secret: 1 } },
      aiSettlement: { name: 'refined', dmCompass: { twist: 't' } },
      aiDailyLife: { dawn: 'z' },
      dmCompass: { hooks: ['h'] },
      plotHooks: ['the heir is hidden'],
      dossierNotes: 'prep notes',
      narrativeNotes: { economics: 'per-tab prose' },
      pendingEdits: [{ field: 'x' }],
      campaign: { worldState: { secret: true } },
      version_history: [{ v: 1 }],
      // A brand-new DM-private field with a key the OLD denylist would MISS.
      dmBriefingDossierV2: { theTruth: 'leaks under a denylist' },
    };
    const out = toPublicSafe(hydrated);
    for (const k of [
      'dmNotes', 'aiData', 'aiSettlement', 'aiDailyLife', 'dmCompass', 'plotHooks',
      'dossierNotes', 'narrativeNotes', 'pendingEdits', 'campaign', 'version_history',
      'dmBriefingDossierV2',
    ]) {
      expect(out[k], `"${k}" must not leak`).toBeUndefined();
    }
    // …while ordinary public content still comes through.
    expect(out.name).toBe(settlement.name);
    expect(out.tier).toBe(settlement.tier);
  });

  // The shareNarrated gallery base is s.ai_data.aiSettlement — a full refined
  // clone. thesis + dailyLife (the narrated public prose) MUST survive; the DM
  // Compass + per-tab notes on that same object MUST be stripped.
  it('narrated base: keeps thesis + dailyLife, strips the DM Compass fields', () => {
    const narratedClone = {
      ...settlement,
      thesis: 'A salt town that forgot its own founding.',
      dailyLife: 'Dawn breaks over the brine flats…',
      tabNotes: { economics: 'prose' },
      narrativeNotes: { economics: 'prose' },
      dmCompass: { hooks: ['h'] },
      identityMarkers: ['brine-stained boardwalks'],
      frictionPoints: [{ who: 'A vs B' }],
      connectionsMap: [{ from: 'A', to: 'B' }],
    };
    const out = toPublicSafe(narratedClone);
    expect(out.thesis).toBe('A salt town that forgot its own founding.');
    expect(out.dailyLife).toBe('Dawn breaks over the brine flats…');
    for (const k of ['tabNotes', 'narrativeNotes', 'dmCompass', 'identityMarkers', 'frictionPoints', 'connectionsMap']) {
      expect(out[k], `"${k}" must be stripped`).toBeUndefined();
    }
  });

  // THE ROADS §15 binding 1 (JS twin): an NPC's live whereabouts mirror is dropped by the
  // fail-closed NPC allowlist (publicNpc copies only the 11 public fields) — the roads
  // secret-by-construction guarantee on the public projection.
  it('drops npc.whereabouts from the public projection (roads §15 binding 1)', () => {
    const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
    const hydrated = {
      ...settlement,
      npcs: [
        { id: 'trav', name: 'The Envoy', role: 'envoy', category: 'government',
          whereabouts: { state: 'hostage', placeId: 'dulwich', missionId: 'road.x', sinceTick: 5, expectedReturnTick: null } },
        ...npcs,
      ],
    };
    const out = toPublicSafe(hydrated);
    expect(Array.isArray(out.npcs), 'npcs survive as a public subtree').toBe(true);
    for (const n of out.npcs) {
      expect(n.whereabouts, 'no NPC may carry whereabouts on the public projection').toBeUndefined();
    }
    // …while the ordinary public NPC fields still come through.
    const envoy = out.npcs.find((n) => n.id === 'trav');
    expect(envoy).toBeDefined();
    expect(envoy.name).toBe('The Envoy');
  });

  // Deeper-level defense-in-depth: an allowed top-level subtree still gets its
  // nested DM-private keys stripped by the recursive denylist.
  it('still strips DM-private keys nested inside an allowed subtree', () => {
    const withNested = {
      ...settlement,
      history: { ...(settlement.history || {}), dmNote: 'a hidden aside', currentTensions: ['visible'] },
      economicState: { ...(settlement.economicState || {}), secretLedger: 'hidden' },
    };
    const out = toPublicSafe(withNested);
    expect(out.history).toBeDefined();
    expect(out.history.dmNote).toBeUndefined();          // nested denylist
    expect(out.history.currentTensions).toEqual(['visible']); // preserved
    expect(out.economicState.secretLedger).toBeUndefined();
  });
});
