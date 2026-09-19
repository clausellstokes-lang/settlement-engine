/**
 * tests/domain/ruinInstitution.test.js — EM-B1e: THE PULSE'S RUIN SHAPE HAS ONE WRITER.
 *
 * ODQ §934.47 addendum 7 option (a): the pulse exports ONE shared
 * `ruinInstitution(inst, { reason, fate })`, its own ruin path calls it, and there is
 * exactly one writer of the pulse's ruin shape. A disaster and a DM's decree then
 * leave the SAME record, differing only in the two words they pass.
 *
 * THE CENTRAL CLAIM IS BYTE-EQUALITY (A1). THE PROMISE makes lived history immutable,
 * so the calamity path's record after the refactor must be `JSON.stringify`-identical
 * to the record it produced before it — the same five keys, the same values, in the
 * same ORDER. The order is load-bearing rather than cosmetic: the preset lighting
 * witness is a byte golden that hashes 52 interior one-week ticks of world pulse, so a
 * re-ordered serialization moves a golden that has no capture arm by design.
 *
 * WHY THE ORACLE IS A FROZEN LITERAL AND NOT AN IMPORT. Both the retired private arrow
 * and its enclosing `applyStrikeToRoster` are module-private, so a pre-edit record
 * cannot be captured by importing the writer. It was captured instead by driving the
 * EXPORTED `advanceCalamity` with a controlled rng — the driver of
 * tests/domain/calamity.kernel.integration.test.js (`runStrike` / `struckOf`), which
 * reaches BOTH ruin arms — and frozen below as PRE_EDIT_DESTROY / PRE_EDIT_COLLAPSE.
 *
 * SEVEN STRAIGHT-LINE `it` UNDER ONE LITERAL `describe` (EM preamble §P3.4): no
 * `.each`, no `runIf`, no nesting, no conditional registration.
 */

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect } from 'vitest';

import { advanceCalamity, ruinInstitution } from '../../src/domain/worldPulse/calamityKernel.js';
import { advanceCauseLifecycle } from '../../src/domain/worldPulse/causeLifecycle.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { institutionProvenanceOf } from '../../src/domain/provenance/rosterProvenance.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── A1's ORACLE — the records the calamity path produced BEFORE the refactor ───
// Captured by execution at the packet's base (76be138a1), through advanceCalamity.
// ⛔ These are actuals. A mismatch is lived history moving, never a number to edit.
const PRE_EDIT_DESTROY = '{"name":"Blacksmith","category":"crafts","status":"ruined","_worldPulseInactive":true,"_worldPulseEconomyClosed":true,"worldPulseFate":"destroyed_by_disaster","remnantReason":"Destroyed outright by the disaster."}';
const PRE_EDIT_COLLAPSE = '{"name":"Tavern","category":"lodging","status":"ruined","_worldPulseInactive":true,"_worldPulseEconomyClosed":true,"worldPulseFate":"destroyed_by_disaster","remnantReason":"Razed as the district collapsed to a single survivor after the disaster."}';

const DECREE_REASON = "Razed by the table's hand.";
const DECREE_FATE = 'ruined_by_decree';
const DISASTER_FATE = 'destroyed_by_disaster';

// ── The calamity driver, copied from tests/domain/calamity.kernel.integration.test.js
// (runStrike :110 / struckOf :125). One strike reaches BOTH ruin arms: 'Blacksmith'
// is the singleton DESTROY (call site :286) and 'Tavern' the COLLAPSE (:282).
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['thornwood', 'midvale', 'faredge'];

function digestFor() {
  const pack = makeGridPack({ cols: 10, rows: 6 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

// Key-aware rng stub: fire the strike at THORNWOOD only, take the max K, drive every
// other draw at 0 (deterministic target pick + min loss).
function stubRng() {
  const val = (key) => {
    const m = /^disaster:([^:]+):\d+$/.exec(key);
    if (m) return m[1] === 'thornwood' ? 0 : 0.99;
    if (/^disaster:k:/.test(key)) return 0.99;
    return 0;
  };
  const make = (key) => ({ random: () => val(key), fork: (k) => make(k) });
  return { fork: (k) => make(k) };
}

function struckSettlement() {
  return {
    name: 'Thornwood', tier: 'city', population: 5000,
    config: { terrainType: 'forest' },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },
      { name: 'Water source', required: true, category: 'infrastructure' },
      { name: 'Blacksmith', category: 'crafts' },
      { name: 'Inn', category: 'lodging' },
      { name: 'Tavern', category: 'lodging' },
      { name: "Mages' guild", category: 'magic' },
    ],
    economicState: {
      primaryExports: ['iron tools'], primaryImports: [],
      activeChains: [{ resource: { name: 'iron ore' }, processingInstitutions: ['Blacksmith'], outputs: ['iron tools'] }],
    },
    powerStructure: { publicLegitimacy: { score: 60 }, factions: [], conflicts: [] },
    npcs: [{ id: 'npc1', name: 'Aldric the Elder', role: 'elder' }],
    activeConditions: [],
    populationHistory: [],
  };
}

const plainSettlement = (name) => ({
  name, tier: 'town', population: 1500, config: { terrainType: 'plains' },
  institutions: [{ name: 'Market', category: 'trade' }],
  economicState: { primaryExports: [], primaryImports: ['iron tools'], activeChains: [] },
  activeConditions: [], npcs: [],
});

function runStrike() {
  const settlements = [
    { id: 'thornwood', name: 'Thornwood', settlement: struckSettlement() },
    { id: 'midvale', name: 'Midvale', settlement: plainSettlement('Midvale') },
    { id: 'faredge', name: 'Faredge', settlement: plainSettlement('Faredge') },
  ];
  const digest = digestFor();
  return advanceCalamity({
    settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })),
    worldState: { tick: 52, simulationRules: { disastersEnabled: true }, spatialCanonVersion: 1, spatialDigest: digest },
    snapshot: {
      settlements,
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'e.t.m', from: 'thornwood', to: 'midvale', relationshipType: 'trade_partner' },
          { id: 'e.m.f', from: 'midvale', to: 'faredge', relationshipType: 'trade_partner' },
        ],
        channels: [],
      }),
    },
    digest,
    pIndex: { get: () => ({ score: 0.4 }) },
    rules: { disastersEnabled: true },
    rng: stubRng(),
    season: 'spring',
    prevWeeks: 51,
    weeks: 52,
    tick: 52,
    now: NOW,
  });
}

const struckOf = (res) => res.settlementUpdates.find((u) => u.saveId === 'thornwood').settlement;
const instByName = (s, name) => (s.institutions || []).find((i) => String(i.name) === name);

// ── A6's driver — the REAL cause-lifecycle terminal, not a re-implementation ───
// `institutionDestroyed` is module-private, so its verdict is read where it has a
// consequence: TERMINAL 2 (paymaster death) re-adjudicates an NPC's criminal leash.
// A truthy verdict emits a 're-adjudicated' event; a standing paymaster emits none.
const fixedRng = (v) => { const f = { random: () => v, fork: () => f }; return f; };

function leashSevered(sustainer) {
  const npc = {
    id: 'cap', name: 'cap', corrupt: true,
    personality: { dominant: 'principled', flaw: 'honest' },
    corruptTies: { criminalInstitution: 'Smuggling ring' },
  };
  const key = npcId('a', npc, 0);
  const item = {
    id: 'a',
    settlement: { name: 'a', npcs: [npc], institutions: [sustainer], config: {}, powerStructure: {}, activeConditions: [] },
    causal: { scores: {} },
    activeConditions: [],
  };
  const prior = {
    a: {
      [key]: {
        causeClass: 'captured', family: 'corruption', stage: 'attributed', role: 'criminal',
        situation: 'compromised-covert', originTick: 2, resolveHold: 0, priorCauses: [],
      },
    },
  };
  const out = advanceCauseLifecycle({
    snapshot: { settlements: [item] },
    worldState: { npcStates: { [key]: { roleArchetype: 'criminal' } } },
    priorLedger: prior,
    rng: fixedRng(0),
    tick: 12,
  });
  return Boolean(out.events.find((e) => e.stage === 're-adjudicated'));
}

// ── A7's matcher — a COMMENT-ONLY strip that KEEPS string contents ────────────
// ⛔ NOT the estate's shared `codeOnly`: that blanks comments AND string/template
// CONTENTS, so `'ruined'` becomes `'      '` and the matcher can never fire — a
// vacuously-green arm. Measured at pre-proof: raw bytes find 4 (three are JSDoc
// prose describing the shape), shared codeOnly finds 0, this strip finds the 1 truth.
function commentsOnly(src) {
  const out = src.split('');
  const n = src.length;
  let i = 0;
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '; };
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { let j = i; while (j < n && src[j] !== '\n') j++; blank(i, j); i = j; continue; }
    if (c === '/' && d === '*') { let j = i + 2; while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++; blank(i, Math.min(j + 2, n)); i = j + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === c) break;
        if (c !== '`' && src[j] === '\n') break;
        j++;
      }
      i = j + 1;
      continue;
    }
    i++;
  }
  return out.join('');
}

const RUIN_WRITE_RE = /status:\s*'ruined'/;

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

const sha256Of = (rel) => createHash('sha256').update(readFileSync(join(ROOT, rel))).digest('hex');

describe('EM-B1e — the pulse ruin shape has exactly one writer', () => {
  it('A1 BYTE-EQUALITY: both calamity ruin sites still write the pre-refactor record, to the byte', () => {
    const s = struckOf(runStrike());
    const destroyArm = JSON.stringify(instByName(s, 'Blacksmith'));
    const collapseArm = JSON.stringify(instByName(s, 'Tavern'));
    // GUARD-THE-GUARD, before the equality: an empty or non-ruin capture would let
    // this arm pass on a strike that never fired.
    expect(destroyArm.length, 'the DESTROY arm captured nothing, so the equality below would be vacuous').toBeGreaterThan(0);
    expect(destroyArm).toContain('"status":"ruined"');
    expect(collapseArm.length, 'the COLLAPSE arm captured nothing, so the equality below would be vacuous').toBeGreaterThan(0);
    expect(collapseArm).toContain('"status":"ruined"');
    // ⛔ THE PROMISE: lived history is immutable. A one-character drift here is a
    // saved world's history changing under it, and is a STOP, never a repair.
    expect(destroyArm, 'the DESTROY site (:286) no longer writes the pre-refactor record').toBe(PRE_EDIT_DESTROY);
    expect(collapseArm, 'the COLLAPSE site (:282) no longer writes the pre-refactor record').toBe(PRE_EDIT_COLLAPSE);
  });

  it("A2 a decree carries its OWN fate and cause, and no disaster vocabulary enters the record", () => {
    const rec = ruinInstitution({ name: 'Smuggling ring', category: 'crime' }, { reason: DECREE_REASON, fate: DECREE_FATE });
    expect(rec.status).toBe('ruined');
    expect(rec._worldPulseInactive).toBe(true);
    expect(rec._worldPulseEconomyClosed).toBe(true);
    expect(rec.worldPulseFate).toBe(DECREE_FATE);
    expect(rec.remnantReason).toBe(DECREE_REASON);
    // The decree's own words, and the disaster's word nowhere in the record. The
    // anchor is the decree fate itself: it travels the same serialization, so a
    // record that lost its keys cannot pass this as "correctly excluded".
    expectAbsentWithAnchor(JSON.stringify(rec), DISASTER_FATE, DECREE_FATE, 'a decree record carries no disaster vocabulary');
  });

  it('A3 both arguments are REQUIRED: absence, emptiness and non-strings each throw', () => {
    const inst = { name: 'Tannery', category: 'crafts' };
    // LIVENESS ANCHOR FIRST: the valid call must succeed, or every throw below
    // would pass on a broken import rather than on the guard.
    expect(ruinInstitution(inst, { reason: DECREE_REASON, fate: DECREE_FATE }).status).toBe('ruined');
    expect(() => ruinInstitution(inst)).toThrow();
    expect(() => ruinInstitution(inst, {})).toThrow();
    expect(() => ruinInstitution(inst, { reason: DECREE_REASON })).toThrow();
    expect(() => ruinInstitution(inst, { fate: DECREE_FATE })).toThrow();
    expect(() => ruinInstitution(inst, { reason: '', fate: DECREE_FATE })).toThrow();
    expect(() => ruinInstitution(inst, { reason: DECREE_REASON, fate: '' })).toThrow();
    expect(() => ruinInstitution(inst, { reason: 7, fate: DECREE_FATE })).toThrow();
    expect(() => ruinInstitution(inst, { reason: DECREE_REASON, fate: { toString: () => DECREE_FATE } })).toThrow();
    // ⛔ THE LIE THIS EXISTS TO MAKE IMPOSSIBLE: a defaulted fate would let a caller
    // silently stamp a disaster on a record no disaster touched. Nothing is coerced.
    let leaked = null;
    // The catch body is deliberately empty: the throw IS the required behaviour, so
    // `leaked` simply stays null and the assertion below reads it.
    try { leaked = ruinInstitution(inst, { reason: DECREE_REASON }); } catch { /* the guard fired */ }
    expect(leaked, 'a missing fate produced a record instead of throwing').toBeNull();
  });

  it('A4 the pulse history does not move: both goldens and the preset witness are bytewise unchanged', () => {
    // ⛔ PACKET-SCOPED BYTE PIN. These are actuals measured at this packet's base,
    // asserted so the refactor cannot move a golden silently. The preset witness is
    // the instrument that actually covers this path (it hashes 52 interior one-week
    // ticks of world pulse) and it has NO capture arm by design, so a move cannot be
    // quietly re-recorded. A lawful move is a hand act with a stated cause under
    // docs/GOLDEN_SHIFT_LEDGER.md, which re-records this line too.
    expect(sha256Of('tests/fixtures/generator-golden-master.json')).toBe('7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e');
    expect(sha256Of('tests/fixtures/dossier-prose-manifest-golden.json')).toBe('921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41');
    expect(sha256Of('tests/fixtures/preset-lighting-witness-golden.json')).toBe('7f67ee8e6cda2b7e70a780090b16db20a4f8032a1746a51b2e044dd69bd98ae2');
  });

  it('A5 pure: the input is never mutated, the result is a new object, and repetition changes nothing', () => {
    const inst = { name: 'Almshouse', category: 'civic', tags: ['charity'], nested: { rung: 2 } };
    const before = structuredClone(inst);
    const out = ruinInstitution(inst, { reason: DECREE_REASON, fate: DECREE_FATE });
    expect(inst, 'the writer mutated its input').toEqual(before);
    expect(out).not.toBe(inst);
    expect(ruinInstitution(inst, { reason: DECREE_REASON, fate: DECREE_FATE })).toEqual(out);
    for (let i = 0; i < 100; i++) ruinInstitution(inst, { reason: DECREE_REASON, fate: DECREE_FATE });
    expect(inst, '100 calls moved the input').toEqual(before);
    expect(out.status).toBe('ruined');
  });

  it('A6 the decree fate is INERT at its real consumers, and inert BY SUFFICIENCY', () => {
    const decreed = ruinInstitution({ name: 'Smuggling ring', category: 'crime' }, { reason: DECREE_REASON, fate: DECREE_FATE });
    const disastered = ruinInstitution({ name: 'Smuggling ring', category: 'crime' }, { reason: 'Destroyed outright by the disaster.', fate: DISASTER_FATE });
    // (1) THE FATE READER, through the real exported reader: free text, branching on
    // no value. The disaster-ruined control travels the identical shape.
    const prov = institutionProvenanceOf(decreed);
    expect(prov.lastLifecycle.fate).toBe(DECREE_FATE);
    expect(prov.lastLifecycle.reason).toBe(DECREE_REASON);
    expect(institutionProvenanceOf(disastered).lastLifecycle.fate).toBe(DISASTER_FATE);
    // (2) THE TRUTHINESS READER, at its CONSEQUENCE: a destroyed paymaster severs an
    // NPC's criminal leash. Negative control first, so the driver is proved live.
    expect(leashSevered({ name: 'Smuggling ring', category: 'crime' }), 'a STANDING paymaster must not sever the leash, or this driver is vacuous').toBe(false);
    expect(leashSevered(decreed)).toBe(true);
    expect(leashSevered(disastered)).toBe(true);
    // (3) ⭐ THE SUFFICIENCY ARM — why `ruined_by_decree` needs no vocabulary row.
    // Delete the fate key outright: `_worldPulseInactive` decides first and `'ruined'`
    // decides again, so the fate's VALUE can never change a verdict.
    const noFate = { ...decreed };
    delete noFate.worldPulseFate;
    expect(decreed.worldPulseFate, 'the key must exist before deleting it, or this arm proves nothing').toBe(DECREE_FATE);
    expect(noFate.worldPulseFate).toBeUndefined();
    expect(leashSevered(noFate), 'the verdict changed when the fate key was removed, so the value is NOT inert').toBe(true);
  });

  it('A7 one writer in src/, the matcher proved live, and the convergence fence held', () => {
    const files = walkFiles(join(ROOT, 'src')).filter((p) => /\.(js|jsx)$/.test(p) && !/\.test\./.test(p));
    const hits = files
      .filter((p) => RUIN_WRITE_RE.test(commentsOnly(readFileSync(p, 'utf8'))))
      .map((p) => relative(ROOT, p).replace(/\\/g, '/'));
    expect(files.length, 'the src/ scan found no files at all').toBeGreaterThan(2000);
    expect(hits).toEqual(['src/domain/worldPulse/calamityKernel.js']);
    // BOTH CONTROLS ARE REQUIRED — the matcher must fire on a planted second writer
    // and must ignore a commented one, or the single-hit result above is an accident.
    expect(RUIN_WRITE_RE.test(commentsOnly("const x = { ...inst, status: 'ruined', _worldPulseInactive: true };"))).toBe(true);
    expect(RUIN_WRITE_RE.test(commentsOnly("// { ...inst, status: 'ruined' }"))).toBe(false);
    // ⛔ THE CHAIR'S EXPLICIT EXCLUSION, asserted in BOTH directions: this packet does
    // not import, read or edit convergence.js (hot at 798/800), and convergence.js
    // does not reach back into the calamity kernel either.
    const kernel = readFileSync(join(ROOT, 'src/domain/worldPulse/calamityKernel.js'), 'utf8');
    const convergence = readFileSync(join(ROOT, 'src/domain/worldPulse/convergence.js'), 'utf8');
    expectAbsentWithAnchor(kernel, 'convergence', './stablePart.js', 'the calamity kernel never reaches convergence.js');
    expectAbsentWithAnchor(convergence, 'calamityKernel', './worldState.js', 'convergence.js never reaches the calamity kernel');
  });
});
