/**
 * tests/domain/causeResolutionLifecycle.test.js — W-C5 cause-resolution lifecycle.
 *
 * Covers (per the WC5 brief §Gates): attribution lazily materializes + is
 * dormancy-neutral; each of the three covert paths under forced trait planes; both
 * terminals (exposure → public arc, infrastructure death → re-adjudicate);
 * resolution hysteresis; age-band stamps; re-cause coherence (adopted cause is
 * verifiably real in-state); undo round-trip for reform.
 */

import { describe, it, expect } from 'vitest';

import {
  advanceCauseLifecycle, projectCauseLifecycleOntoSettlement,
  causeLifecycleSelectionWeights, LIFECYCLE_TUNING, reformClimate01,
} from '../../src/domain/worldPulse/causeLifecycle.js';
import {
  readCauseContext, presentCauseClasses, causeIsClear, roleCauseAffinity,
  CAUSE_CLASS_IDS, CAUSE_FAMILY_OF,
} from '../../src/domain/worldPulse/causeVocabulary.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/worldState.js';
import { ageBandForElapsed, AGE_BANDS, AGE_BAND_IDS } from '../../src/domain/ageBands.js';
import {
  causeLifecyclePhrase, describeCompromiseLifecycle, FLOOR_CAUSE_CLASSES, LIFECYCLE_STAGES,
} from '../../src/domain/display/causeLifecycleVocabulary.js';

const HOLD = LIFECYCLE_TUNING.RESOLUTION_HOLD_TICKS;

// A fork stub whose random() is a fixed value (fork() returns itself), so a test
// can steer the weighted path pick deterministically. pickPath(reform,recause,
// historicize): roll = v*total; v→0 picks reform, v→1 picks historicize, a middle
// v lands in the recause band.
function fixedRng(v) {
  const f = { random: () => v, fork: () => f };
  return f;
}

// A snapshot item — the shape advanceCauseLifecycle reads: { id, settlement,
// causal:{scores}, activeConditions }.
function makeItem(cid, { npcs = [], scores = {}, conditions = [], config = {}, institutions = [], powerStructure = {} } = {}) {
  const settlement = {
    name: cid, npcs, institutions,
    config, powerStructure,
    activeConditions: conditions.map((a) => (typeof a === 'string' ? { archetype: a } : a)),
  };
  return {
    id: cid, settlement,
    causal: { scores },
    activeConditions: settlement.activeConditions,
  };
}

// A compromised bearer NPC. `personality` drives the trait plane.
function bearer(id, personality, extra = {}) {
  return { id, name: id, corrupt: true, personality, ...extra };
}

const worldStateWith = (npcStates = {}, extra = {}) => ({ npcStates, ...extra });
const roleState = (cid, npc, role) => ({ [npcId(cid, npc, 0)]: { roleArchetype: role } });

describe('W-C5 age bands (the shared temporal helper)', () => {
  it('maps elapsed weeks to the committed 4-4-5 calendar bands', () => {
    expect(ageBandForElapsed(0)).toBe('this-week');
    expect(ageBandForElapsed(1)).toBe('this-week');
    expect(ageBandForElapsed(2)).toBe('this-month');
    expect(ageBandForElapsed(4)).toBe('this-month');
    expect(ageBandForElapsed(5)).toBe('this-season');
    expect(ageBandForElapsed(13)).toBe('this-season');   // a season is 13 weeks (a 4-4-5 quarter)
    expect(ageBandForElapsed(14)).toBe('this-year');
    expect(ageBandForElapsed(49)).toBe('this-year');     // week 49 is still THIS year (52-week year)
    expect(ageBandForElapsed(52)).toBe('this-year');
    expect(ageBandForElapsed(53)).toBe('years-past');
    expect(ageBandForElapsed(500)).toBe('years-past');
  });
  it('clamps garbage to this-week', () => {
    expect(ageBandForElapsed(-3)).toBe('this-week');
    expect(ageBandForElapsed(NaN)).toBe('this-week');
    expect(AGE_BAND_IDS).toHaveLength(5);
  });
  it('DRIFT PIN: band boundaries equal the committed calendar law (INTERVAL_WEEKS)', () => {
    // ageBands.js deliberately does NOT import worldState.js (it must stay a headless
    // leaf the display side-car can import without dragging simulationRules/clock into
    // its chunk), so THIS pin is what makes the hardcoded boundaries un-driftable: the
    // month/season/year bounds MUST equal the single-source interval → week-count
    // table. If the calendar ever changes, this fails loudly.
    const bounds = Object.fromEntries(AGE_BANDS.map((b) => [b.id, b.maxTicks]));
    expect(bounds['this-week']).toBe(INTERVAL_WEEKS.one_week);
    expect(bounds['this-month']).toBe(INTERVAL_WEEKS.one_month);
    expect(bounds['this-season']).toBe(INTERVAL_WEEKS.one_season);
    expect(bounds['this-year']).toBe(INTERVAL_WEEKS.one_year);
    expect(bounds['years-past']).toBe(Infinity);
  });
});

describe('W-C5 cause vocabulary + resolution predicates', () => {
  it('reads an underfunded settlement as present, a funded one as clear', () => {
    const present = readCauseContext(makeItem('a', { scores: { economic_capacity: 20 } }), worldStateWith(), 'a');
    expect(presentCauseClasses(present)).toContain('underfunded');
    const funded = readCauseContext(makeItem('a', { scores: { economic_capacity: 80 } }), worldStateWith(), 'a');
    expect(causeIsClear('underfunded', funded)).toBe(true);
    expect(presentCauseClasses(funded)).not.toContain('underfunded');
  });

  it('reads siege / occupation / trade-embargo condition presence', () => {
    const warItem = makeItem('a', { conditions: ['siege'], scores: {} });
    const ctx = readCauseContext(warItem, worldStateWith(), 'a');
    expect(presentCauseClasses(ctx)).toContain('siege-scarred');
    const occ = readCauseContext(makeItem('a', {}), worldStateWith({}, { occupations: { a: { occupierId: 'x' } } }), 'a');
    expect(presentCauseClasses(occ)).toContain('occupation');
    const emb = readCauseContext(makeItem('a', { conditions: ['trade_embargo'] }), worldStateWith(), 'a');
    expect(causeIsClear('trade-strangled', readCauseContext(makeItem('a', {}), worldStateWith(), 'a'))).toBe(true);
    expect(presentCauseClasses(emb)).toContain('trade-strangled');
  });

  it('hysteresis band: a mid-range score is ambiguous (neither present nor clear)', () => {
    const mid = readCauseContext(makeItem('a', { scores: { economic_capacity: 48 } }), worldStateWith(), 'a');
    expect(presentCauseClasses(mid)).not.toContain('underfunded');
    expect(causeIsClear('underfunded', mid)).toBe(false);
  });

  it('role coherence ranks the canonical pairings highest', () => {
    expect(roleCauseAffinity('military', 'underfunded')).toBeGreaterThan(roleCauseAffinity('military', 'secularization'));
    expect(roleCauseAffinity('religious', 'conduct-drift')).toBeGreaterThan(roleCauseAffinity('religious', 'trade-strangled'));
    expect(roleCauseAffinity('merchant', 'trade-strangled')).toBeGreaterThan(roleCauseAffinity('merchant', 'siege-scarred'));
  });
});

describe('W-C5 attribution (lazy, dormancy-neutral, coherent)', () => {
  it('attributes the most role-coherent present cause on first touch', () => {
    const npc = bearer('cap', { dominant: 'ambitious', flaw: 'greedy' });
    const item = makeItem('a', { npcs: [npc], scores: { economic_capacity: 20 }, conditions: ['siege'] });
    const out = advanceCauseLifecycle({
      snapshot: { settlements: [item] }, worldState: worldStateWith(roleState('a', npc, 'military')),
      priorLedger: null, rng: fixedRng(0), tick: 5,
    });
    const rec = out.causeLifecycleByCid.a[npcId('a', npc, 0)];
    // military: war (siege-scarred) 1.0 outranks economic (underfunded) 0.7+0.25.
    // Both present; the coherent pick is the higher-affinity one.
    expect(['siege-scarred', 'underfunded']).toContain(rec.causeClass);
    expect(rec.stage).toBe('attributed');
    expect(rec.originTick).toBe(5);
    const evt = out.events.find((e) => e.stage === 'attributed');
    expect(evt.conjunctionKey).toEqual({ role: 'military', situation: 'compromised-covert', causeClass: rec.causeClass, lifecycleStage: 'attributed' });
  });

  it('never invents a cause: no present condition ⇒ no attribution, no ledger', () => {
    const npc = bearer('cap', { dominant: 'calm' });
    const item = makeItem('a', { npcs: [npc], scores: { economic_capacity: 90, trade_connectivity: 90, food_security: 90, defense_readiness: 90, religious_authority: 90 } });
    const out = advanceCauseLifecycle({
      snapshot: { settlements: [item] }, worldState: worldStateWith(roleState('a', npc, 'civic')),
      priorLedger: null, rng: fixedRng(0), tick: 1,
    });
    expect(out.causeLifecycleByCid).toBeNull();
    expect(out.events).toHaveLength(0);
  });

  it('dormancy: a settlement with no compromised NPC never materializes a ledger', () => {
    const clean = { id: 'clean', name: 'clean', corrupt: false };
    const item = makeItem('a', { npcs: [clean], scores: { economic_capacity: 10 }, conditions: ['siege'] });
    const out = advanceCauseLifecycle({
      snapshot: { settlements: [item] }, worldState: worldStateWith(), priorLedger: null, rng: fixedRng(0), tick: 1,
    });
    expect(out.causeLifecycleByCid).toBeNull();
  });
});

describe('W-C5 resolution hysteresis', () => {
  it('a cleared cause does not resolve until it has held the hold window', () => {
    const npc = bearer('cap', { dominant: 'calm' });
    // Attributed to underfunded, but now funded (clear). Prior hold below threshold.
    const prior = { a: { [npcId('a', npc, 0)]: { causeClass: 'underfunded', family: 'economic', stage: 'attributed', role: 'military', situation: 'compromised-covert', originTick: 0, resolveHold: 0, priorCauses: [] } } };
    const item = makeItem('a', { npcs: [npc], scores: { economic_capacity: 90 } });
    let ledger = prior;
    let out;
    for (let t = 1; t < HOLD; t++) {
      out = advanceCauseLifecycle({ snapshot: { settlements: [item] }, worldState: worldStateWith(roleState('a', npc, 'military')), priorLedger: ledger, rng: fixedRng(0), tick: t });
      ledger = out.causeLifecycleByCid;
      // Still holding: no reform/evolution yet.
      expect(out.reforms).toHaveLength(0);
      expect(ledger.a[npcId('a', npc, 0)].stage).toBe('attributed');
    }
    expect(ledger.a[npcId('a', npc, 0)].resolveHold).toBe(HOLD - 1);
    // One more clear tick reaches the threshold and evolves.
    out = advanceCauseLifecycle({ snapshot: { settlements: [item] }, worldState: worldStateWith(roleState('a', npc, 'military')), priorLedger: ledger, rng: fixedRng(0.999), tick: HOLD });
    const rec = out.causeLifecycleByCid?.a?.[npcId('a', npc, 0)];
    // fixedRng(0.999) → historicize path.
    expect(rec?.stage).toBe('historicized');
  });

  it('a one-tick blip resets the hold (a blip cannot reform a captain)', () => {
    const npc = bearer('cap', { dominant: 'calm' });
    const rec0 = { causeClass: 'underfunded', family: 'economic', stage: 'attributed', role: 'military', situation: 'compromised-covert', originTick: 0, resolveHold: HOLD - 1, priorCauses: [] };
    const prior = { a: { [npcId('a', npc, 0)]: rec0 } };
    // The cause is back (present again, not clear) → hold resets to 0.
    const item = makeItem('a', { npcs: [npc], scores: { economic_capacity: 15 } });
    const out = advanceCauseLifecycle({ snapshot: { settlements: [item] }, worldState: worldStateWith(roleState('a', npc, 'military')), priorLedger: prior, rng: fixedRng(0), tick: 5 });
    expect(out.causeLifecycleByCid.a[npcId('a', npc, 0)].resolveHold).toBe(0);
    expect(out.reforms).toHaveLength(0);
  });
});

// Helper: a settlement whose attributed cause (underfunded) is now CLEAR, primed to
// resolve THIS tick (resolveHold at threshold-1). Runs one tick with a forced fork.
function resolveOnce({ personality, role = 'military', climateScores = {}, forkV, alt = false }) {
  const npc = bearer('cap', personality);
  const scores = { economic_capacity: 90, ...climateScores };
  const conditions = alt ? ['siege'] : []; // an alternative REAL cause present for re-cause
  const item = makeItem('a', { npcs: [npc], scores, conditions });
  const rec = { causeClass: 'underfunded', family: 'economic', stage: 'attributed', role, situation: 'compromised-covert', originTick: 0, resolveHold: HOLD - 1, priorCauses: [] };
  const prior = { a: { [npcId('a', npc, 0)]: rec } };
  const out = advanceCauseLifecycle({
    snapshot: { settlements: [item] }, worldState: worldStateWith(roleState('a', npc, role)),
    priorLedger: prior, rng: fixedRng(forkV), tick: 20,
  });
  return { out, npc, cid: 'a', conditionId: npcId('a', npc, 0) };
}

describe('W-C5 the three covert paths (forced)', () => {
  it('REFORM clears the tag (undo-clean) and drops the record', () => {
    const { out, npc, conditionId } = resolveOnce({ personality: { dominant: 'principled', flaw: 'honest', modifier: 'incorruptible' }, forkV: 0, climateScores: { law_order: 90 } });
    expect(out.reforms).toHaveLength(1);
    expect(out.reforms[0].conditionId).toBe(conditionId);
    // Record dropped (bearer becomes clean).
    expect(out.causeLifecycleByCid).toBeNull();
    const evt = out.events.find((e) => e.stage === 'reformed');
    expect(evt).toBeTruthy();
    expect(evt.resolvedTick).toBe(20);
    // Undo round-trip: projecting the reform clears the tag as a BOUNDED, reversible
    // delta (corrupt→false, corruptionVector→null, stamp dropped) — no orphaned state,
    // so restoring those exact fields reproduces the original NPC byte-for-byte.
    const original = { ...npc, corruptionVector: 'greed', compromiseLifecycle: { stage: 'attributed', causeClass: 'underfunded' } };
    const settlement = { npcs: [original] };
    const reformed = projectCauseLifecycleOntoSettlement(settlement, null, 'a', 21, new Set([conditionId]));
    expect(reformed.npcs[0].corrupt).toBe(false);
    expect(reformed.npcs[0].corruptionVector).toBeNull();
    expect(reformed.npcs[0].compromiseLifecycle).toBeUndefined();
    const restored = { ...reformed.npcs[0], corrupt: true, corruptionVector: 'greed', compromiseLifecycle: { stage: 'attributed', causeClass: 'underfunded' } };
    expect(restored).toEqual(original);
  });

  it('HISTORICIZE persists the compromise, stamps resolved/historicized ticks, keeps the tag', () => {
    const { out, conditionId } = resolveOnce({ personality: { dominant: 'stoic' }, forkV: 0.999 });
    const rec = out.causeLifecycleByCid.a[conditionId];
    expect(rec.stage).toBe('historicized');
    expect(rec.resolvedTick).toBe(20);
    expect(rec.historicizedTick).toBe(20);
    expect(out.reforms).toHaveLength(0);
  });

  it('RE-CAUSE adopts a NEW cause that is verifiably REAL in-state (coherence)', () => {
    // A greedy plane + an alternative real cause (siege) present; force the recause band.
    const w = causeLifecycleSelectionWeights({ plane: { e: 0.8, c: 0.3, spread: 1 }, hasTemperament: false, reformClimate: 0.2, hasAlternative: true });
    const total = w.reform + w.recause + w.historicize;
    const midRecause = (w.reform + w.recause / 2) / total;
    const { out, conditionId } = resolveOnce({ personality: { dominant: 'ambitious', flaw: 'greedy' }, forkV: midRecause, alt: true, climateScores: { law_order: 20 } });
    const rec = out.causeLifecycleByCid.a[conditionId];
    expect(rec.stage).toBe('re-caused');
    expect(rec.priorCauses).toContain('underfunded');
    // The adopted cause must be REAL in-state right now (siege ⇒ siege-scarred present).
    expect(rec.causeClass).toBe('siege-scarred');
    expect(rec.causeClass).not.toBe('underfunded');
  });

  it('cannot re-cause when no OTHER real cause is present (never invents) — falls to reform/historicize', () => {
    // Greedy plane but NO alternative cause: recause weight is gated to 0.
    const { out, conditionId } = resolveOnce({ personality: { dominant: 'ambitious', flaw: 'greedy' }, forkV: 0.5, alt: false });
    const rec = out.causeLifecycleByCid?.a?.[conditionId];
    // With no alternative, the outcome is reform (dropped) or historicize — never re-caused.
    if (rec) expect(rec.stage).not.toBe('re-caused');
    else expect(out.events.some((e) => e.stage === 'reformed')).toBe(true);
  });
});

describe('W-C5 selection-weight gradient (trait plane + climate)', () => {
  it('a principled (good) plane in a clean climate leans REFORM', () => {
    const w = causeLifecycleSelectionWeights({ plane: { e: -0.9, c: -0.4, spread: 1.3 }, hasTemperament: false, reformClimate: 1, hasAlternative: true });
    expect(w.reform).toBeGreaterThan(w.recause);
    expect(w.reform).toBeGreaterThan(w.historicize);
  });
  it('a greedy (evil) plane with an alternative leans RE-CAUSE', () => {
    const w = causeLifecycleSelectionWeights({ plane: { e: 0.9, c: 0.4, spread: 1.3 }, hasTemperament: false, reformClimate: 0.2, hasAlternative: true });
    expect(w.recause).toBeGreaterThan(w.reform);
    expect(w.recause).toBeGreaterThan(w.historicize);
  });
  it('a steady-tempered, morally-neutral plane leans HISTORICIZE', () => {
    const w = causeLifecycleSelectionWeights({ plane: { e: 0, c: 0.2, spread: 0.2 }, hasTemperament: true, reformClimate: 0.5, hasAlternative: true });
    expect(w.historicize).toBeGreaterThan(w.recause);
    expect(w.historicize).toBeGreaterThan(w.reform);
  });
  it('rotten climate suppresses reform vs a clean climate', () => {
    const plane = { e: -0.5, c: 0, spread: 0.5 };
    const clean = causeLifecycleSelectionWeights({ plane, hasTemperament: false, reformClimate: 1, hasAlternative: false });
    const rotten = causeLifecycleSelectionWeights({ plane, hasTemperament: false, reformClimate: 0, hasAlternative: false });
    expect(clean.reform).toBeGreaterThan(rotten.reform);
  });
  it('reformClimate01 reads a captured, evil-patron town as reform-hostile', () => {
    const rotten = reformClimate01({ scores: { law_order: 20 }, captureState: 'capture', corruptingDeity: true }, { config: {} });
    const clean = reformClimate01({ scores: { law_order: 90 }, captureState: 'none', corruptingDeity: false }, { config: { primaryDeitySnapshot: { alignmentAxis: 'good' } } });
    expect(clean).toBeGreaterThan(rotten);
  });
});

describe('W-C5 the two terminals', () => {
  it('EXPOSURE: a covert→revealed crossing stamps exposed-public and stops quiet evolution', () => {
    const npc = bearer('cap', { dominant: 'stoic' }, { ousted: false });
    // Prior record covert; now the settlement has a REVEALED compromised institution.
    const prior = { a: { [npcId('a', npc, 0)]: { causeClass: 'captured', family: 'corruption', stage: 'attributed', role: 'military', situation: 'compromised-covert', originTick: 2, resolveHold: 0, priorCauses: [] } } };
    const institutions = [{ name: 'Town watch', impairments: [{ type: 'corruption', covert: false }] }];
    const item = makeItem('a', { npcs: [npc], institutions, powerStructure: { criminalCaptureState: 'capture' } });
    const out = advanceCauseLifecycle({ snapshot: { settlements: [item] }, worldState: worldStateWith(roleState('a', npc, 'military')), priorLedger: prior, rng: fixedRng(0), tick: 10 });
    const rec = out.causeLifecycleByCid.a[npcId('a', npc, 0)];
    expect(rec.stage).toBe('exposed-public');
    expect(rec.exposedTick).toBe(10);
    const evt = out.events.find((e) => e.stage === 'exposed-public');
    expect(evt.conjunctionKey.situation).toBe('compromised-revealed');
  });

  it('RE-ADJUDICATE: a destroyed sustaining institution re-judges the compromise', () => {
    const npc = bearer('cap', { dominant: 'principled', flaw: 'honest' }, { corruptTies: { criminalInstitution: 'Smuggling ring' } });
    const institutions = [{ name: 'Smuggling ring', status: 'remnant', worldPulseFate: 'captured_by_local_powers' }];
    const prior = { a: { [npcId('a', npc, 0)]: { causeClass: 'captured', family: 'corruption', stage: 'attributed', role: 'criminal', situation: 'compromised-covert', originTick: 2, resolveHold: 0, priorCauses: [] } } };
    const item = makeItem('a', { npcs: [npc], institutions });
    // Good plane + no alternative ⇒ resolve (the arrangement dies with its paymaster).
    const out = advanceCauseLifecycle({ snapshot: { settlements: [item] }, worldState: worldStateWith(roleState('a', npc, 'criminal')), priorLedger: prior, rng: fixedRng(0), tick: 12 });
    const evt = out.events.find((e) => e.stage === 're-adjudicated');
    expect(evt).toBeTruthy();
    expect(out.reforms).toHaveLength(1); // resolved
  });
});

describe('W-C5 the generic content floor', () => {
  it('resolves a non-empty phrase for EVERY lifecycleStage × causeClass (coverage ladder)', () => {
    for (const stage of LIFECYCLE_STAGES) {
      for (const causeClass of FLOOR_CAUSE_CLASSES) {
        const phrase = causeLifecyclePhrase({ stage, causeClass, role: 'military' });
        expect(typeof phrase).toBe('string');
        expect(phrase.length).toBeGreaterThan(0);
        expect(phrase).not.toContain('{cause}');
        expect(phrase).not.toContain('{role}');
      }
    }
  });
  it('the floor cause classes match the engine vocabulary exactly (no orphans)', () => {
    expect([...FLOOR_CAUSE_CLASSES].sort()).toEqual([...CAUSE_CLASS_IDS].sort());
  });
  it('historicize uses the years-past register only at years-past (the constitution PIN)', () => {
    const fresh = causeLifecyclePhrase({ stage: 'historicized', causeClass: 'underfunded', ageBand: 'this-month' });
    const old = causeLifecyclePhrase({ stage: 'historicized', causeClass: 'underfunded', ageBand: 'years-past' });
    // The years-past voice ("the lean years" / "years ago") is impossible below the threshold.
    expect(old.toLowerCase()).toMatch(/lean years|years ago/);
    expect(fresh.toLowerCase()).not.toMatch(/lean years|years ago/);
    expect(old).not.toBe(fresh);
  });
  it('describeCompromiseLifecycle produces the badge + phrase + conjunction key', () => {
    const desc = describeCompromiseLifecycle({ stage: 'historicized', causeClass: 'underfunded', role: 'military', situation: 'compromised-covert', ageBand: 'years-past' });
    expect(desc.badge).toBe('Longstanding');
    expect(desc.conjunctionKey).toEqual({ role: 'military', situation: 'compromised-covert', causeClass: 'underfunded', lifecycleStage: 'historicized' });
    expect(describeCompromiseLifecycle(null)).toBeNull();
  });
  it('every cause class has a family (taxonomy is total)', () => {
    for (const c of CAUSE_CLASS_IDS) expect(['economic', 'war', 'faith', 'corruption']).toContain(CAUSE_FAMILY_OF[c]);
  });
});

describe('W-C5 projection stamps the display read-model', () => {
  it('stamps compromiseLifecycle onto a compromised NPC with the age band', () => {
    const npc = bearer('cap', { dominant: 'stoic' });
    const ledger = { a: { [npcId('a', npc, 0)]: { causeClass: 'underfunded', family: 'economic', stage: 'attributed', role: 'military', situation: 'compromised-covert', originTick: 2 } } };
    const settlement = { npcs: [npc] };
    const projected = projectCauseLifecycleOntoSettlement(settlement, ledger, 'a', 20, null);
    const stamp = projected.npcs[0].compromiseLifecycle;
    expect(stamp.stage).toBe('attributed');
    expect(stamp.causeClass).toBe('underfunded');
    expect(stamp.ageBand).toBe(ageBandForElapsed(18)); // 20 - 2
  });
});
