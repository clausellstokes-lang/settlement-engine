/**
 * counterIntelIn3.test.js — IN-3 THE COUNTER-GAME: the wave's acceptance file (the FP kit's
 * BUILD-FP-I3 brief; the compiled block #19; docs/DESIGN_FP_ARCH_IN.md §4 IN-3; R-29).
 *
 * THE FOUR-FENCE DORMANCY SET for `counterIntelEnabled`, plus the lit-mutant control:
 *   FENCE 1 — OWN FOOTPRINT: dark, the statecraft head over a fixture that closes a gate in
 *     answer and doubts a planted claim the moment the key is lit returns the bytes it returned
 *     BEFORE IN-3 (a digest computed with the base head, c2beb233f, from its archive).
 *   FENCE 2 — ABSENT vs EXPLICIT FALSE vs TRUTHY-NOT-TRUE: one output, bytes and all.
 *   FENCE 3 — CALL PATH: pass-through spies on the two reads only a lit world reaches (the
 *     scandal condition and the posture), reached CROSS-MODULE from the head.
 *   FENCE 4 — GATE POLARITY over the real tree: every code read of the key is `=== true`.
 * Then the acceptance rows: the read and its K3 pins, castDoubt, HIDE as answer and its
 * reversal, the sweep's three outcomes, the house (too_hot, the exposure producer), VET and
 * SEND-TWO, the editor line headless, the phantom readers and the registry rows.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../helpers/codeOnlySource.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = vi.hoisted(() => ({ archetypes: 0, posture: 0 }));

vi.mock('../../src/domain/activeConditions.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, activeArchetypes: (...args) => { calls.archetypes += 1; return actual.activeArchetypes(...args); } };
});
vi.mock('../../src/domain/worldPulse/strategicPosture.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, courtPostureOf: (...args) => { calls.posture += 1; return actual.courtPostureOf(...args); } };
});

const {
  DECEPTION_INCIDENTS, SUSPICION_BANDS, SUSPICION_TUNING, ZEAL_POSTURES, claimDoubtOf, counterIntelActive,
  secrecyInAnswer, suspicionClears, suspicionDoubt, suspicionOf, zealOf,
} = await import('../../src/domain/worldPulse/suspicion.js');
const {
  COUNTER_INTEL_WORLD_CONDITIONS, SEND_TWO_TUNING, SUSPICION_ABOVE_CONDITION, SUSPICION_ABOVE_ROW, SWEEP_DIRECTION_OP_TYPES,
  SWEEP_DIRECTION_TYPE, SWEEP_OUTCOMES, SWEEP_REFUSALS, SWEEP_TUNING, VET_DECISION, castAccused, covertWatchersOf,
  resolveSweep, sendTwoRead, suspicionAboveSubjects, watchRowsFor, weighEnvoyWord,
} = await import('../../src/domain/worldPulse/counterIntelSweep.js');
const { PATRON_EXPOSURE_TUNING, exposedPatronInstitutions, projectedPatronBindingsFor } = await import('../../src/domain/worldPulse/patronExposure.js');
const { advanceInformationStatecraft, processLies, processSecrecy, SIGHT_TUNING } = await import('../../src/domain/worldPulse/informationStatecraft.js');
const { compositeCredibilityWeight } = await import('../../src/domain/worldPulse/npcCredibility.js');
const { PLANT_REFUSALS, commissionPlant, plantTooHot } = await import('../../src/domain/worldPulse/brokerageServicesPlant.js');
const { QUERY_REFUSALS } = await import('../../src/domain/worldPulse/brokerageServices.js');
const { ENVOY_RECEPTION_DECISIONS } = await import('../../src/domain/worldPulse/envoyErrandVocabulary.js');
const { ENVOY_RECEPTION_TYPE, envoyReceptionRow } = await import('../../src/domain/worldPulse/envoyInbound.js');
const { TESTIMONY_LADDER } = await import('../../src/domain/worldPulse/envoyTestimony.js');
const { readSendTwoDivergence, vetVolunteerEnvoy } = await import('../../src/domain/worldPulse/sendTwoDivergence.js');
const { projectPatronBindings } = await import('../../src/domain/worldPulse/brokeragePatronage.js');
const { hash01 } = await import('../../src/domain/region/contestMath.js');
const { HABIT_FORK_REGISTRY } = await import('../../src/domain/worldPulse/habitForkRegistry.js');
const { ENGINE_GATED_VIRTUAL_RULE_KEYS } = await import('../../src/domain/worldPulse/simulationRules.js');
const { resolveDecree, stage } = await import('../../src/domain/edit/registry.js');
const { OP_TYPES } = await import('../../src/domain/edit/operations.js');
const { PHANTOM_KIND } = await import('../../src/domain/edit/phantoms.js');
const { PROSPERITY_TIERS } = await import('../../src/data/constants.js');
const { mintCovert } = await import('../helpers/errandSpineFixture.js');
const { advanceEnvoyErrands } = await import('../../src/domain/worldPulse/envoyErrand.js');
const { IN3_ENVOY_WORD_COUPLING, IN3_TEMPER_AND_WOUNDS_COUPLING } = await import('../../src/domain/certification/couplingRegistryInfo.js');
/** The modules the wave's two coupling rows address, as namespaces (a row naming any other module reds). */
const ADDRESSED = Object.freeze({
  'src/domain/worldPulse/suspicion.js': await import('../../src/domain/worldPulse/suspicion.js'),
  'src/domain/worldPulse/counterIntelSweep.js': await import('../../src/domain/worldPulse/counterIntelSweep.js'),
  'src/domain/worldPulse/strategicPosture.js': await import('../../src/domain/worldPulse/strategicPosture.js'),
});

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'counterIntelEnabled';
/** The lit drive, spelled LITERALLY: the lit-coverage walker credits a flag only through a
 *  literal `<flag>: true` in a test (tests/property/mechanismLitCoverage.test.js). */
const LIT = Object.freeze({ counterIntelEnabled: true });
const FATES = /\b(?:hanged|killed|executed|exiled|shuttered|murdered|slain)\b/i;

// ⟦FIXTURE⟧ — read verbatim by the digest script that computed PRE_IN3_DARK_DIGEST against the base head.
const TICK = 10;
const ZERO_RNG = { fork: () => ({ random: () => 0 }) };
const belief = (band, extra = {}) => ({
  readiness: 0.25, strengthBand: band, allianceLabel: 'hostile', faithLabel: 'Aldra', confidence01: 0.8, lastUpdateTick: 5, ...extra,
});

/**
 * THE FIXTURE. A weak, malicious court `a` bluffs into its neighbour `h`, and `h` holds two
 * receipts: a live corruption scandal on its own record and a caught watcher scarred on the
 * edge it shares with `a`, the resentment still held. `h` has no ambient reason to hide.
 * @param {Record<string, unknown>} rules
 */
function fixture(rules = {}) {
  const worldState = {
    spatialCanonVersion: 1,
    tick: TICK,
    simulationRules: { infoMode: 'full', infoStatecraftEnabled: true, ...rules },
    spatialLedgers: {
      beliefMaps: { a: { seat: { h: belief(4) } }, h: { seat: { a: belief(1, { allianceLabel: 'neutral' }) } } },
    },
    relationshipStates: { 'e-a-h': { resentment: 0.7, recentIncidents: [{ tick: 8, type: 'spy_exposed' }] } },
  };
  const settlements = [
    { id: 'a', settlement: { id: 'a', name: 'A', npcs: [] } },
    { id: 'h', settlement: { id: 'h', name: 'H', npcs: [], activeConditions: [{ archetype: 'corruption_exposed', severity: 0.5 }] } },
  ];
  const snapshot = { settlements, byId: new Map(settlements.map((s) => [s.id, s])), regionalGraph: { edges: [{ id: 'e-a-h', from: 'a', to: 'h' }] } };
  return {
    snapshot, worldState, graph: snapshot.regionalGraph, rng: ZERO_RNG, tick: TICK, now: 'tick-10',
    strengthOf: (id) => (id === 'a' ? 0.2 : 0.8),
    alignmentOf: (id) => (id === 'a' ? { malice01: 0.9, lawfulness01: 0.1 } : { malice01: 0, lawfulness01: 0.9 }),
    nameFor: (id) => String(id).toUpperCase(),
  };
}

/** The whole return of the head, serialized, less the rules it was handed (the key under test
 *  rides in on the input and would otherwise echo back into every digest). */
function bytesOf(out) {
  return JSON.stringify({ ...out, worldState: { ...out.worldState, simulationRules: undefined } });
}
// ⟦/FIXTURE⟧
const digest = (text) => createHash('sha256').update(text).digest('hex');

/**
 * THE PRE-IN-3 FOOTPRINT: this fixture's full `advanceInformationStatecraft` return, computed by
 * the digest script with the head as it stood at the base (c2beb233f, its archive), the same
 * fixture text read out of this file between its markers.
 */
const PRE_IN3_DARK_DIGEST = 'f2064b2c0a8c8c2a3ac68393d1cef5cd4e882225bc807d8435369a47f9fb4087';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(p);
  }
  return out;
}

describe('IN-3 — the four dormancy fences and the lit-mutant control', () => {
  test('fence 1 — dark, the head returns the pre-IN-3 bytes over a fixture that answers with its gates and doubts a claim lit', () => {
    for (const rules of [{}, { [FLAG]: false }, { [FLAG]: 'true' }, { [FLAG]: 1 }]) {
      expect(digest(bytesOf(advanceInformationStatecraft(fixture(rules)))), JSON.stringify(rules)).toBe(PRE_IN3_DARK_DIGEST);
    }
  });

  test('THE LIT-MUTANT CONTROL — the same fixture lit closes h\'s gates in answer and plants a doubted claim', () => {
    expect(Object.keys(LIT)).toEqual([FLAG]);
    const lit = advanceInformationStatecraft(fixture(LIT));
    const dark = advanceInformationStatecraft(fixture());
    expect(digest(bytesOf(lit))).not.toBe(PRE_IN3_DARK_DIGEST);
    const litSecrecy = lit.worldState.spatialLedgers.secrecyPostures;
    const darkSecrecy = dark.worldState.spatialLedgers.secrecyPostures;
    expect(litSecrecy.h).toEqual({ level01: SIGHT_TUNING.HIDE_ENTER, enteredTick: TICK });
    // anchored: the lit twin above holds h's answer, so its absence here is the dark law.
    expect(darkSecrecy).not.toHaveProperty('h');
    expect(litSecrecy.a).toEqual(darkSecrecy.a);
    const litClaim = lit.worldState.spatialLedgers.beliefMaps.h.seat.a.confidence01;
    const darkClaim = dark.worldState.spatialLedgers.beliefMaps.h.seat.a.confidence01;
    expect(darkClaim).toBe(0.7);
    expect(litClaim).toBeLessThan(darkClaim);
    expect(lit.worldState.spatialLedgers.disinfo).toEqual(dark.worldState.spatialLedgers.disinfo);
  });

  test('fence 2 — absent, explicit false and a truthy non-true value are one output', () => {
    const absent = bytesOf(advanceInformationStatecraft(fixture()));
    expect(bytesOf(advanceInformationStatecraft(fixture({ [FLAG]: false })))).toBe(absent);
    expect(bytesOf(advanceInformationStatecraft(fixture({ [FLAG]: 'true' })))).toBe(absent);
    expect(bytesOf(advanceInformationStatecraft(fixture({ [FLAG]: 1 })))).toBe(absent);
  });

  test('fence 3 — the call path: dark, neither lit-only read is reached from the head; lit, both are', () => {
    calls.archetypes = 0;
    calls.posture = 0;
    for (const rules of [{}, { [FLAG]: false }, { [FLAG]: 'true' }]) advanceInformationStatecraft(fixture(rules));
    expect({ archetypes: calls.archetypes, posture: calls.posture }).toEqual({ archetypes: 0, posture: 0 });
    advanceInformationStatecraft(fixture(LIT));
    expect(calls.archetypes).toBeGreaterThan(0);
    expect(calls.posture).toBeGreaterThan(0);
  });

  test('fence 4 — the gate polarity census: every code read of the key is the strict === true form, in one file', () => {
    const reads = [];
    const loose = [];
    for (const abs of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const code = codeOnly(readFileSync(abs, 'utf8'));
      for (const match of code.matchAll(/\bcounterIntelEnabled\b/g)) {
        const tail = code.slice(match.index + match[0].length, match.index + match[0].length + 12);
        (/^\s*===\s*true/.test(tail) ? reads : loose).push(rel);
      }
    }
    expect(loose, 'a read of the key that is not the strict === true form').toEqual([]);
    expect(reads).toEqual(['src/domain/worldPulse/suspicion.js']);
  });
});

/** A lit world and snapshot around one home court `h`, with the receipts a caller chooses. */
function court({ scandal = false, resentment = 0, incident = 'spy_exposed', rules = LIT, npcs = [], sight = null, prosperity = null } = {}) {
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full', ...rules },
    spatialLedgers: sight ? { sightPostures: sight } : {},
    relationshipStates: resentment ? { 'e-h-v': { resentment, recentIncidents: [{ tick: 3, type: incident }] } } : {},
  };
  const home = {
    id: 'h', name: 'Harrowmere', npcs,
    ...(scandal ? { activeConditions: [{ archetype: 'corruption_exposed', severity: 0.5 }] } : {}),
    ...(prosperity ? { economicState: { prosperity } } : {}),
  };
  const settlements = [{ id: 'h', settlement: home }, { id: 'v', settlement: { id: 'v', name: 'Velden', npcs: [] } }];
  const snapshot = { settlements, byId: new Map(settlements.map((s) => [s.id, s])), regionalGraph: { edges: [{ id: 'e-h-v', from: 'h', to: 'v' }] } };
  return { worldState, snapshot, home };
}
const posture = (covert = true) => ({ fidelity01: 0.6, enteredTick: 3, upkeep: 0.5, covert });
const MAYOR = Object.freeze({ id: 'ilse', name: 'Ilse', role: 'Mayor', importance: 'key' });

describe('IN-3 — the suspicion read, and it never reads truth', () => {
  test('the read derives from the receipts a court holds, banded on the borrowed intensity ladder, quiet when dark', () => {
    expect(SUSPICION_BANDS).toEqual(['quiet', 'present', 'pressing', 'decisive']);
    const read = (opts) => suspicionOf({ ...court(opts), settlementId: 'h' });
    expect(read({})).toMatchObject({ band: 'quiet', rank: 0, terms: [] });
    expect(read({ scandal: true })).toMatchObject({ band: 'pressing', terms: ['scandal'] });
    expect(read({ resentment: 0.5 })).toMatchObject({ band: 'present', terms: ['grievance'] });
    expect(read({ scandal: true, resentment: 0.7 })).toMatchObject({ band: 'decisive', terms: ['scandal', 'grievance'] });
    // Every deception-class incident speaks, and a scar of another class does not.
    for (const incident of DECEPTION_INCIDENTS) expect(read({ resentment: 0.7, incident }).terms).toEqual(['grievance']);
    expect(read({ resentment: 0.7, incident: 'war' }).terms).toEqual([]);
    // The mirror gap arrives only through an injected reader; absent, the named degraded read.
    const { worldState, snapshot } = court({ resentment: 0.5 });
    expect(suspicionOf({ worldState, snapshot, settlementId: 'h', mirrorGapOf: () => 1 }).terms).toEqual(['grievance', 'mirror']);
    expect(read({ scandal: true, resentment: 0.7, rules: {} })).toMatchObject({ band: 'quiet', rank: 0 });
    expect(counterIntelActive(court({ rules: { [FLAG]: 'true' } }).worldState)).toBe(false);
  });

  test('K3: rightly suspicious with no spy present, wrongly calm with three watchers standing on the town', () => {
    const three = { a: { h: posture() }, b: { h: posture() }, c: { h: posture() } };
    const calm = court({ sight: three });
    expect(covertWatchersOf(calm.worldState, 'h')).toEqual(['a', 'b', 'c']);
    expect(suspicionOf({ ...calm, settlementId: 'h' })).toMatchObject({ band: 'quiet', rank: 0 });
    const coincidence = court({ scandal: true, resentment: 0.7 });
    expect(covertWatchersOf(coincidence.worldState, 'h')).toEqual([]);
    expect(suspicionOf({ ...coincidence, settlementId: 'h' }).band).toBe('decisive');
  });

  test('SUSPICION NEVER READS TRUTH: the import pin, the token scan, and the guard-the-guard control', () => {
    const path = join(ROOT, 'src/domain/worldPulse/suspicion.js');
    const source = readFileSync(path, 'utf8');
    const imports = [...source.matchAll(/^import .* from '([^']+)';$/gm)].map((m) => m[1]).sort();
    expect(imports).toEqual([
      '../../kernel/math.js', '../activeConditions.js', '../deterministicSort.js', './beliefMap.js',
      './envoyErrandVocabulary.js', './relationshipState.js', './strategicPosture.js',
    ]);
    const TRUTH = /sightPostures|disinfo|getSpatialLedger|strengthOf|npcStates|foreignAssets|infiltration|inboundEnvoys|covertWatchers|trueBand|errand/;
    // Comments are stripped and STRING LITERALS KEPT, because a ledger is named by a string.
    const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
    const scan = (text) => [...stripComments(text).matchAll(new RegExp(TRUTH.source, 'g'))].map((m) => m[0]);
    expect(scan(source)).toEqual([]);
    // THE PLANTED MUTANT: the same scan convicts a truth read planted in the read.
    const planted = source.replace('const grievance = heldDeception01(world, snapshot, id);',
      "const grievance = heldDeception01(world, snapshot, id) + Object.keys(getSpatialLedger(world, 'sightPostures')).length;");
    expect(planted).not.toBe(source);
    expect(scan(planted)).toEqual(['getSpatialLedger', 'sightPostures']);
    // THE GUARD-THE-GUARD: the sweep legitimately reads the truth it hunts, and the scan bites on it.
    const sweep = readFileSync(join(ROOT, 'src/domain/worldPulse/counterIntelSweep.js'), 'utf8');
    expect(scan(sweep).length).toBeGreaterThan(3);
  });
});

describe('IN-3 — castDoubt, and HIDE as answer with its reversal', () => {
  test('castDoubt: quiet is EXACTLY one, each band lowers toward the floor, composed on the mouthpiece plane, identity dark', () => {
    const at = (rank) => suspicionDoubt({ settlementId: 'h', band: SUSPICION_BANDS[rank], rank, score01: 0, terms: [] });
    expect(at(0)).toBe(1);
    expect(at(1)).toBeGreaterThan(at(2));
    expect(at(2)).toBeGreaterThan(at(3));
    expect(at(3)).toBe(SUSPICION_TUNING.doubtFloor);
    const plane = compositeCredibilityWeight(1.1, 0.8);
    expect(plane * at(0)).toBe(plane);
    expect(plane * at(3)).toBeLessThan(plane);
    const lit = court({ scandal: true, resentment: 0.7 });
    expect(claimDoubtOf({ ...lit, settlementId: 'h' })).toBe(SUSPICION_TUNING.doubtFloor);
    expect(claimDoubtOf({ ...court({ scandal: true, resentment: 0.7, rules: {} }), settlementId: 'h' })).toBe(1);
    // Through the real head: the bluff planted in a suspicious audience is believed less.
    const run = (rules) => processLies({ ...fixture(rules), beliefMaps: fixture(rules).worldState.spatialLedgers.beliefMaps });
    expect(run(LIT).overrides.get('h').get('a').confidence01).toBeLessThan(run({}).overrides.get('h').get('a').confidence01);
  });

  test('the deliberate HIDE entry fires ONLY on evidence crossing its posture-scaled band, and never by dice', () => {
    const args = (world) => ({ worldState: world.worldState, snapshot: world.snapshot, priorSecrecy: {}, tick: 7, tuning: SIGHT_TUNING });
    // The scandal is h's own receipt; v, its neighbour, holds none and keeps its gates open.
    const suspicious = court({ scandal: true });
    expect(secrecyInAnswer(null, args(suspicious))).toEqual({ h: { level01: SIGHT_TUNING.HIDE_ENTER, enteredTick: 7 } });
    // No evidence, no ambient ratchet: the same court without receipts keeps its gates open.
    expect(secrecyInAnswer(null, args(court()))).toBeNull();
    const standing = { h: { level01: 0.3, enteredTick: 2 } };
    expect(secrecyInAnswer(standing, args(suspicious))).toBe(standing);
    const darkWorld = court({ scandal: true, resentment: 0.7, rules: {} });
    const ledger = { v: { level01: 0.3, enteredTick: 2 } };
    expect(secrecyInAnswer(ledger, args(darkWorld))).toBe(ledger);
    // THE ZEAL: a trusting posture needs harder evidence than a paranoid one.
    expect(zealOf(suspicious.worldState, 'h', 'paranoid').factor).toBeLessThan(1);
    expect(zealOf(suspicious.worldState, 'h', 'trusting').factor).toBeGreaterThan(1);
    const present = suspicionOf({ ...court({ resentment: 0.62 }), settlementId: 'h' });
    expect(suspicionClears(present, zealOf(null, 'h', 'paranoid'))).toBe(true);
    expect(suspicionClears(present, zealOf(null, 'h', 'trusting'))).toBe(false);
  });

  test('THE REVERSAL: suspicion decays, the answer stops holding, and the ambient exit law reopens the gates', () => {
    const world = court({ scandal: true, resentment: 0.7 });
    const ticks = [];
    let prior = {};
    for (let tick = 1; tick <= 12; tick += 1) {
      // The scandal and the grievance lapse after tick four, on their own laws.
      const now = tick <= 4 ? world : court();
      const ambient = processSecrecy({ snapshot: now.snapshot, priorSecrecy: prior, beliefMaps: {}, rng: null, tick, strengthOf: () => 0.5, alignmentOf: () => ({ malice01: 0, lawfulness01: 1 }) });
      const next = secrecyInAnswer(ambient, { worldState: now.worldState, snapshot: now.snapshot, priorSecrecy: prior, tick, tuning: SIGHT_TUNING });
      ticks.push(!!(next && next.h));
      prior = next || {};
    }
    expect(ticks.slice(0, 4)).toEqual([true, true, true, true]);
    // Held through the dwell the ambient law owes a standing posture, then open again.
    expect(ticks.lastIndexOf(true)).toBeGreaterThan(3);
    expect(ticks[ticks.length - 1]).toBe(false);
  });
});

describe('IN-3 — the sweep: the clean miss, the false accusation and the catch', () => {
  test('THE CLEAN MISS, seeded properly: eyes stand on OTHER towns, none on the home, and none is invented', () => {
    const world = court({ sight: { a: { v: posture() }, b: { v: posture(false) } }, npcs: [MAYOR] });
    expect(Object.keys(world.worldState.spatialLedgers.sightPostures)).toEqual(['a', 'b']);
    const out = resolveSweep({ ...world, settlementId: 'h', tick: 9, rng: ZERO_RNG, nameFor: (id) => id.toUpperCase() });
    expect(out).toMatchObject({ refused: null, outcome: 'clean_miss', caughtWatcherIds: [], accusedNpcId: null, deltas: [] });
    expect(out.newsEntries.map((entry) => entry.kind)).toEqual(['sweep_launched']);
    // FP IN-5 (SR-1): the interim `war` desk became the knowledge desk IN-5 minted.
    expect(out.newsEntries[0]).toMatchObject({ id: 'wizard_news.9.sweep_launched.h', audience: 'public', section: 'knowledge', settlementIds: ['h'] });
    // THE PRICE: a court too poor to pay for the hunt is refused, not charged.
    const poor = court({ prosperity: PROSPERITY_TIERS[0] });
    expect(resolveSweep({ ...poor, settlementId: 'h', tick: 9, rng: ZERO_RNG }).refused).toBe('cannot_afford');
  });

  test('THE FALSE ACCUSATION, priced: a zealous sweep of an innocent, suspicious town names a resident and pays for it', () => {
    const world = court({ scandal: true, resentment: 0.7, npcs: [MAYOR] });
    expect(covertWatchersOf(world.worldState, 'h')).toEqual([]);
    const out = resolveSweep({ ...world, settlementId: 'h', tick: 9, rng: ZERO_RNG, posture: 'paranoid', nameFor: (id) => (id === 'h' ? 'Harrowmere' : id) });
    expect(out).toMatchObject({ outcome: 'false_accusation', accusedNpcId: 'h:ilse', zeal: 'paranoid', caughtWatcherIds: [] });
    expect(out.deltas).toEqual([{ id: 'h', kind: 'deception', magnitude01: SWEEP_TUNING.falseAccusationCharge }]);
    const [beat] = out.newsEntries;
    expect(beat).toMatchObject({ kind: 'false_accusation', audience: 'public', significance: 'notable', npcIds: ['h:ilse'], settlementIds: ['h'] });
    // NO-FATES: the accused is named, never removed, and no sentence counts in digits.
    for (const text of [beat.headline, beat.summary, ...beat.reasons]) {
      // anchored: `beat` is the one accusation the fixture above resolves.
      expect(text).not.toMatch(FATES);
      // anchored: the same sentences, each carrying words and no count.
      expect(text).not.toMatch(/\d/);
    }
    // Decisive evidence moves even a trusting court; milder evidence moves only a paranoid one.
    expect(resolveSweep({ ...world, settlementId: 'h', tick: 9, rng: ZERO_RNG, posture: 'trusting' }).outcome).toBe('false_accusation');
    const mild = court({ resentment: 0.8, npcs: [MAYOR] });
    expect(resolveSweep({ ...mild, settlementId: 'h', tick: 9, rng: ZERO_RNG, posture: 'trusting' }).outcome).toBe('clean_miss');
    expect(resolveSweep({ ...mild, settlementId: 'h', tick: 9, rng: ZERO_RNG, posture: 'paranoid' }).outcome).toBe('false_accusation');
    // The accused is a cast person: the one chokepoint's admission, never a minor soul.
    // The off-stage souls sort FIRST, so only the chokepoint keeps them from being named.
    const offStage = [{ id: 'ansel', name: 'Ansel', importance: 'key', status: 'jailed' }, { id: 'bram', name: 'Bram', importance: 'key', stasis: true }];
    expect(castAccused('h', { npcs: [...offStage, MAYOR] })).toEqual({ id: 'h:ilse', name: 'Ilse' });
    expect(castAccused('h', { npcs: [{ id: 'aldo', name: 'Aldo', importance: 'key', status: 'dead' }, MAYOR] })).toEqual({ id: 'h:ilse', name: 'Ilse' });
    expect(castAccused('h', { npcs: [{ id: 'kid', name: 'Kip', role: 'Laborer', importance: 'minor' }] })).toEqual({ id: '', name: '' });
  });

  test('THE CATCH: a keyed draw per covert watcher on the home, one fork per swept town and tick', () => {
    const labels = [];
    const rngAt = (u) => ({ fork: (label) => { labels.push(label); return { random: () => u }; } });
    const world = court({ sight: { a: { h: posture() }, b: { h: posture(false) }, c: { h: posture() } }, npcs: [MAYOR] });
    const caught = resolveSweep({ ...world, settlementId: 'h', tick: 9, rng: rngAt(0) });
    expect(caught).toMatchObject({ outcome: 'caught', caughtWatcherIds: ['a', 'c'], newsEntries: [] });
    expect(labels).toEqual(['sweep:h:9']);
    expect(resolveSweep({ ...world, settlementId: 'h', tick: 9, rng: rngAt(0.99) }).outcome).toBe('clean_miss');
    expect(SWEEP_OUTCOMES).toEqual(['clean_miss', 'false_accusation', 'caught']);
    // Every refusal is reachable, and a phantom is refused by construction.
    const phantom = { id: 'ph', kind: PHANTOM_KIND, name: 'Farhollow', seed: 'seed-1', traits: {} };
    const reached = [
      resolveSweep({ ...court({ rules: {} }), settlementId: 'h', tick: 9 }).refused,
      resolveSweep({ ...world, settlementId: phantom.id, tick: 9 }).refused,
      resolveSweep({ ...court({ prosperity: PROSPERITY_TIERS[0] }), settlementId: 'h', tick: 9 }).refused,
    ];
    expect([...reached].sort()).toEqual([...SWEEP_REFUSALS]);
  });
});

describe('IN-3 — the house plays its own game', () => {
  test('PLANT_REFUSALS grows to SEVEN with too_hot appended, and QUERY_REFUSALS is unchanged', () => {
    expect(PLANT_REFUSALS).toEqual(['dormant', 'no_market', 'bad_intent', 'cannot_pay', 'no_channel', 'already_active', 'too_hot']);
    // The query side's five words, as they stood at the base (c2beb233f), unmoved.
    expect(QUERY_REFUSALS).toEqual(['dormant', 'no_house', 'channel_declined', 'cannot_pay', 'no_record']);
  });

  test('too_hot: the counter refuses to sell into a court whose suspicion is pressing, lit only, and only with a reading', () => {
    const reading = (band) => ({ settlementId: 'm', band, rank: SUSPICION_BANDS.indexOf(band), score01: 0, terms: [] });
    const lit = court().worldState;
    expect(plantTooHot(lit, reading('pressing'))).toBe(true);
    expect(plantTooHot(lit, reading('decisive'))).toBe(true);
    expect(plantTooHot(lit, reading('present'))).toBe(false);
    expect(plantTooHot(lit, null)).toBe(false);
    expect(plantTooHot(court({ rules: {} }).worldState, reading('decisive'))).toBe(false);
    const market = { id: 'mk', name: 'the Whisper Exchange', tags: ['criminal', 'information', 'brokerage'], serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'] };
    const counter = (rules, audienceSuspicion) => commissionPlant({
      worldState: { ...lit, simulationRules: { ...lit.simulationRules, infoStatecraftEnabled: true, informationBrokeragesEnabled: true, ...rules } },
      item: { id: 'h', settlement: { id: 'h', name: 'h', tier: 'town', population: 3000, npcs: [], institutions: [market] } },
      patronId: 'p', audienceId: 'm', subjectId: 'v', subjectTrueBand: 2, audienceBelief: belief(2), intent: 'deflate', tick: 9, audienceSuspicion,
    });
    expect(counter({}, reading('pressing')).refusal).toEqual({ reason: 'too_hot', detail: expect.any(String) });
    // Present, absent, or dark: the counter goes on to the purse exactly as before.
    for (const [rules, heat] of [[{}, reading('present')], [{}, null], [{ [FLAG]: false }, reading('decisive')]]) {
      // anchored: the pressing arm above is refused too_hot on this same counter.
      expect(counter(rules, heat).refusal?.reason).not.toBe('too_hot');
    }
  });

  test('THE EXPOSURE PRODUCER supplies `exposed`: a covert binding is public only when the producer says so', () => {
    const binding = (institutionId) => ({ institutionId, houseName: institutionId, legality: 'illegal', form: 'minor', patronId: 'h:ring', patronName: 'the Ring', patronArchetype: 'criminal', source: 'genesis', covert: true });
    const ids = ['loft-a', 'loft-b', 'loft-c', 'loft-d', 'loft-e', 'loft-f'];
    const keyed = (id) => hash01(`patron-exposure:h:${id}`);
    const exposedAtDecisive = ids.filter((id) => keyed(id) < PATRON_EXPOSURE_TUNING.oddsByRank[3]);
    expect(exposedAtDecisive.length).toBeGreaterThan(0);
    expect(exposedAtDecisive.length).toBeLessThan(ids.length);
    const bindings = ids.map(binding);
    const decisive = court({ scandal: true, resentment: 0.7 });
    const produced = exposedPatronInstitutions({ ...decisive, item: { id: 'h', settlement: decisive.home }, bindings });
    expect(produced).toEqual([...exposedAtDecisive].sort());
    // Monotone in the band: what pressing exposes, decisive exposes too.
    const pressing = court({ scandal: true });
    const atPressing = exposedPatronInstitutions({ ...pressing, item: { id: 'h', settlement: pressing.home }, bindings });
    expect(atPressing.every((id) => produced.includes(id))).toBe(true);
    // Quiet or dark, nothing.
    expect(exposedPatronInstitutions({ ...court(), item: { id: 'h', settlement: {} }, bindings })).toEqual([]);
    expect(exposedPatronInstitutions({ ...court({ scandal: true, resentment: 0.7, rules: {} }), item: { id: 'h', settlement: {} }, bindings })).toEqual([]);
    // The projection names the patron of an exposed house to a player, and hides the rest.
    const player = projectPatronBindings(bindings, { audience: 'player', exposed: produced });
    for (const row of player) expect(row.patronName).toBe(produced.includes(row.institutionId) ? 'the Ring' : 'unknown');
    const wired = projectedPatronBindingsFor({ worldState: decisive.worldState, snapshot: decisive.snapshot, item: { id: 'h', settlement: decisive.home }, audience: 'player' });
    expect(wired.exposed).toEqual(exposedPatronInstitutions({ ...decisive, item: { id: 'h', settlement: decisive.home } }));
  });
});

describe('IN-3 — VET, the third reception arm, and SEND-TWO over the one reader', () => {
  test('VET is a reception member, resolves through the reception row, and its verdict is deterministic', () => {
    expect(ENVOY_RECEPTION_DECISIONS).toEqual(['receive', 'turn_away', 'vet']);
    expect(VET_DECISION).toBe('vet');
    const catalogues = { opTypes: { [ENVOY_RECEPTION_TYPE]: envoyReceptionRow }, pools: {} };
    const op = (decision) => ({ type: ENVOY_RECEPTION_TYPE, target: { kind: 'settlement', id: 'h' }, payload: { decision, errandId: 'e1' } });
    expect(resolveDecree(stage([], op('vet'), { id: 'd1', orderedAt: 't0' })[0], catalogues)).toEqual({ ok: true });
    expect(resolveDecree(stage([], op('interrogate'), { id: 'd2', orderedAt: 't0' })[0], catalogues)).toEqual({ ok: false, missing: 'pool-value', was: 'interrogate' });
    const clean = { npcId: 'n1', loyaltyBand: 'proven', foreignTieBand: 'none' };
    // ⟨F8⟩ THE ONE VETTING HOME DECIDES: the arm carries the careful seat's own verdict whole and
    // moves only the testimony rung by it (a cleared man keeps his rung, a refused one drops one).
    const careful = (volunteer) => vetVolunteerEnvoy({ quality: 'careful', volunteer });
    expect(careful(clean)).toEqual({ accepted: true, quality: 'careful', basis: 'nothing_found', reason: 'vetted' });
    expect(weighEnvoyWord({ rung: 'corroborated', volunteer: clean })).toEqual({ decision: 'vet', verdict: careful(clean), rung: 'corroborated' });
    const suspect = { ...clean, loyaltyBand: 'suspect' };
    expect(careful(suspect)).toMatchObject({ accepted: false, basis: 'loyalty' });
    expect(weighEnvoyWord({ rung: 'corroborated', volunteer: suspect })).toEqual({ decision: 'vet', verdict: careful(suspect), rung: 'reported' });
    expect(weighEnvoyWord({ rung: 'tavern_talk', volunteer: { ...clean, foreignTieBand: 'close' } }).rung).toBe(TESTIMONY_LADDER[3]);
    // A volunteer the seat cannot read is the decider's own refusal, carried as it came.
    expect(careful({}).reason).toBe('invalid_volunteer');
    expect(weighEnvoyWord({ rung: 'corroborated', volunteer: {} })).toEqual({ decision: 'vet', verdict: careful({}), rung: 'reported' });
    expect(weighEnvoyWord({ rung: 'corroborated', volunteer: clean })).toEqual(weighEnvoyWord({ rung: 'corroborated', volunteer: clean }));
  });

  test('SEND-TWO: two honest carriers of weathered hearsay never read as a traitor, a reported divergence does', () => {
    const graded = (rung, a = 'd1', b = 'd2') => ({ reason: 'graded', accounts: [
      { id: 'x1', npcId: 'n1', sheetDigest: a, rung }, { id: 'x2', npcId: 'n2', sheetDigest: b, rung },
    ] });
    const args = (testimony) => ({ testimony, encounterId: 'enc-1', attendedBy: ['n1', 'n2'] });
    expect(readSendTwoDivergence(args(graded('tavern_talk'))).signature).toBe(true);
    expect(sendTwoRead(args(graded('tavern_talk')))).toEqual({ verdict: 'diverged', flagged: false, topRung: 'tavern_talk' });
    expect(sendTwoRead(args(graded('reported')))).toEqual({ verdict: 'diverged', flagged: true, topRung: 'reported' });
    expect(sendTwoRead(args(graded('confirmed', 'd1', 'd1'))).flagged).toBe(false);
    expect(SEND_TWO_TUNING.toleranceRung).toBe('reported');
  });

  test('THE ONE HOME: the divergence reader, its vocabulary and the vetting decision each live once; the sweep consumes them, planted forks convicted', () => {
    const declarations = (files) => files.flatMap(([rel, text]) => (
      /export\s+function\s+readSendTwoDivergence\b|export\s+const\s+SEND_TWO_VERDICTS\b/.test(codeOnly(text)) ? [rel] : []));
    const tree = walk(join(ROOT, 'src')).map((abs) => [relative(ROOT, abs).replace(/\\/g, '/'), readFileSync(abs, 'utf8')]);
    expect(declarations(tree)).toEqual(['src/domain/worldPulse/sendTwoDivergence.js']);
    const sweep = readFileSync(join(ROOT, 'src/domain/worldPulse/counterIntelSweep.js'), 'utf8');
    expect(sweep).toMatch(/import \{ readSendTwoDivergence, VETTING_QUALITIES, vetVolunteerEnvoy \} from '\.\/sendTwoDivergence\.js';/);
    const forked = [...tree, ['src/domain/worldPulse/counterIntelSweep.js', `${sweep}\nexport function readSendTwoDivergence() { return null; }\n`]];
    expect(declarations(forked)).toEqual(['src/domain/worldPulse/sendTwoDivergence.js', 'src/domain/worldPulse/counterIntelSweep.js']);
    // ⟨F8⟩ THE VETTING DECISION, mirroring tests/domain/sendTwoDivergenceWr7d.test.js's one-home
    // scan so this suite reds on its own module: no vetting-named function here, and no acceptance
    // or basis spelled (the non-decider price that scan's enrolled derivers pay).
    const F8_SPELLING = /function\s+\w*[vV]et(Volunteer|Candidate|Envoy|ting)\w*\s*\(/;
    expect(F8_SPELLING.test(`${sweep}\nexport function vetEnvoyWord() { return null; }\n`)).toBe(true);
    expect(F8_SPELLING.test(sweep)).toBe(false);
    expect(sweep).toMatch(/const verdict = vetVolunteerEnvoy\(\{ quality: careful, volunteer \}\);/);
    // The rung moves on the decider's own answer alone: no second acceptance rule composed here.
    expect(sweep).toMatch(/const after = verdict\.accepted \? index : /);
    // anchored: the decider call and the rung rule are pinned just above on this same live source.
    expect(sweep).not.toContain('accepted:');
    // anchored: the same live source whose decider call and rung rule are pinned above.
    expect(sweep).not.toContain('basis:');
  });
});

describe('IN-3 — the editor line: the direction and the predicate, headless', () => {
  test('sweep-for-agents resolves through resolveDecree, refuses a zeal word outside the set, and names its world condition', () => {
    const catalogues = { opTypes: SWEEP_DIRECTION_OP_TYPES, pools: {} };
    const op = (payload) => ({ type: SWEEP_DIRECTION_TYPE, target: { kind: 'settlement', id: 'h' }, payload });
    let registry = [];
    [{}, ...ZEAL_POSTURES.map((word) => ({ posture: word }))].forEach((payload, index) => {
      registry = stage(registry, op(payload), { id: `d${index}`, orderedAt: 't0' });
    });
    for (const entry of registry) expect(resolveDecree(entry, catalogues)).toEqual({ ok: true });
    expect(resolveDecree(stage([], op({ posture: 'frantic' }), { id: 'x', orderedAt: 't0' })[0], catalogues)).toEqual({ ok: false, missing: 'pool-value', was: 'frantic' });
    const row = SWEEP_DIRECTION_OP_TYPES[SWEEP_DIRECTION_TYPE];
    expect(Object.keys(row).sort()).toEqual(Object.keys(OP_TYPES['add-faction']).sort());
    expect(row).toMatchObject({ target: 'settlement', stage: 'home', consequence: 'home' });
    expect(row.requires).toEqual({ world: [SUSPICION_ABOVE_CONDITION], registry: [] });
    expect(row.payload.posture.values).toBe(ZEAL_POSTURES);
    // THE REFUSAL: with suspicionAbove false the world half of `requires` is unmet, so no seal.
    const unmet = (record, campaign) => row.requires.world.filter((name) => !COUNTER_INTEL_WORLD_CONDITIONS[name].predicate(record, campaign));
    const calm = court();
    expect(unmet(calm.home, { worldState: calm.worldState, regionalGraph: calm.snapshot.regionalGraph })).toEqual([SUSPICION_ABOVE_CONDITION]);
    const hot = court({ scandal: true, resentment: 0.7 });
    expect(unmet(hot.home, { worldState: hot.worldState, regionalGraph: hot.snapshot.regionalGraph })).toEqual([]);
  });

  test('suspicionAbove holds TRUE with the home court as its subject, and FALSE dark, calm, or with no campaign', () => {
    const hot = court({ scandal: true, resentment: 0.7 });
    const campaign = { worldState: hot.worldState, regionalGraph: hot.snapshot.regionalGraph };
    expect(SUSPICION_ABOVE_ROW.subjects(hot.home, campaign)).toEqual(['h']);
    expect(SUSPICION_ABOVE_ROW.predicate(hot.home, campaign)).toBe(true);
    const dark = court({ scandal: true, resentment: 0.7, rules: {} });
    expect(SUSPICION_ABOVE_ROW.predicate(dark.home, { worldState: dark.worldState, regionalGraph: dark.snapshot.regionalGraph })).toBe(false);
    expect(SUSPICION_ABOVE_ROW.predicate(court().home, { worldState: court().worldState })).toBe(false);
    expect(SUSPICION_ABOVE_ROW.predicate(hot.home, null)).toBe(false);
    expect(SUSPICION_ABOVE_ROW.source).toBe('live');
    expect(COUNTER_INTEL_WORLD_CONDITIONS).toEqual({ [SUSPICION_ABOVE_CONDITION]: SUSPICION_ABOVE_ROW });
    // The ES arm reads the ONE inbound reader's true class, never a second reader.
    const sweep = readFileSync(join(ROOT, 'src/domain/worldPulse/counterIntelSweep.js'), 'utf8');
    expect(sweep).toMatch(/inboundEnvoysAt\(world, id\)\.some\(\(row\) => purposeClassOf\(row\) === COVERT_CLASS\)/);
  });

  test('THE ES ARM, live: a covert errand the production writer mints, standing at the gate, opens the seal on a calm court', () => {
    const minted = mintCovert();
    expect(minted.reason, 'the production writer minted the fixture').toBe('minted');
    const at = (worldState, tick) => advanceEnvoyErrands({ worldState, tick }).worldState;
    const arrived = at(at(minted.worldState, 11), 12);
    const world = (lit) => ({ ...arrived, spatialCanonVersion: 1, simulationRules: { ...arrived.simulationRules, infoMode: 'full', [FLAG]: lit } });
    // The gate court holds no receipt at all: its suspicion is quiet, so only the ES arm speaks.
    expect(suspicionOf({ worldState: world(true), snapshot: {}, settlementId: 'irontown' }).rank).toBe(0);
    expect(SUSPICION_ABOVE_ROW.subjects({ id: 'irontown' }, { worldState: world(true) })).toEqual(['irontown']);
    expect(SUSPICION_ABOVE_ROW.predicate({ id: 'irontown' }, { worldState: world(false) })).toBe(false);
    // The sender's own court is not the gate: its agent stands abroad, not at home.
    expect(SUSPICION_ABOVE_ROW.predicate({ id: 'ashford' }, { worldState: world(true) })).toBe(false);
  });

  test('every reader the wave adds takes a phantom partner, a minimal library row, without throwing', () => {
    const phantom = { id: 'ph', kind: PHANTOM_KIND, name: 'Farhollow', seed: 'seed-1', traits: {} };
    const hot = court({ scandal: true, resentment: 0.7 });
    expect(suspicionOf({ ...hot, settlementId: phantom.id })).toMatchObject({ band: 'quiet', rank: 0 });
    expect(suspicionAboveSubjects(phantom, { worldState: hot.worldState, regionalGraph: hot.snapshot.regionalGraph })).toEqual([]);
    expect(castAccused(phantom.id, phantom)).toEqual({ id: '', name: '' });
    expect(exposedPatronInstitutions({ ...hot, item: phantom })).toEqual([]);
    expect(watchRowsFor({ ...hot, settlementId: phantom.id })).toMatchObject({ watches: [], watchedBy: [], gateClosed: false });
  });
});

describe('IN-3 — the registry rows and the manifest', () => {
  test('HBF-103 registers the sweep draw with SWEEP_OUTCOMES from the fork\'s own module, the key is manifested virtual, and the coupling rows name live exports', () => {
    const row = HABIT_FORK_REGISTRY.find((r) => r.symbol === 'resolveSweep');
    expect(row).toMatchObject({ forkId: 'HBF-103', module: 'src/domain/worldPulse/counterIntelSweep', discovery: 'checklist', disposition: 'DEFER', actionVocabulary: 'SWEEP_OUTCOMES' });
    expect(HABIT_FORK_REGISTRY.find((r) => r.symbol === 'exposedPatronInstitutions')).toMatchObject({ forkId: 'HBF-104', discovery: 'idiom', disposition: 'DEFER', actionVocabulary: null });
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(FLAG);
    const at = ENGINE_GATED_VIRTUAL_RULE_KEYS.indexOf(FLAG);
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS[at - 1] < FLAG && FLAG < ENGINE_GATED_VIRTUAL_RULE_KEYS[at + 1]).toBe(true);
    // THE WAVE'S TWO COUPLING ROWS NAME LIVE EXPORTS. No coupling walker resolves a row's `#symbol`,
    // so a rename would strand an address in silence (the ⟨F8⟩ cure renamed the VET arm).
    for (const row of [IN3_ENVOY_WORD_COUPLING, IN3_TEMPER_AND_WOUNDS_COUPLING]) {
      for (const address of [row.read, row.counterforce]) {
        const [path, symbol] = address.split('#');
        expect(typeof ADDRESSED[path]?.[symbol], address).toBe('function');
      }
    }
    expect(IN3_ENVOY_WORD_COUPLING.counterforce).toBe('src/domain/worldPulse/counterIntelSweep.js#weighEnvoyWord');
  });

  test('NO-FATES and no numbers across every sentence the counter-game composes', () => {
    const world = court({ scandal: true, resentment: 0.7, npcs: [MAYOR] });
    const beats = [
      ...resolveSweep({ ...world, settlementId: 'h', tick: 9, rng: ZERO_RNG, posture: 'paranoid' }).newsEntries,
      ...resolveSweep({ ...court({ npcs: [MAYOR] }), settlementId: 'h', tick: 9, rng: ZERO_RNG }).newsEntries,
    ];
    const composed = beats.flatMap((entry) => [entry.headline, entry.summary, ...entry.reasons]);
    expect(composed.length).toBeGreaterThan(4);
    for (const text of composed) {
      // anchored: `composed` holds both beats the two sweeps above resolve.
      expect(text).not.toMatch(new RegExp(`\\d|${FATES.source}`, 'i'));
    }
  });
});
