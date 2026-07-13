/**
 * moralDrift.test.js — Phase 5.5 M9b, component (3): MORAL DRIFT FROM UNJUST
 * INSTIGATION (design §4g).
 *
 * The binding contract:
 *   - an unjust instigation (a march on a NON-THREAT, on a false belief) banks
 *     alignment drift — SHARPEST for a lawful-good actor, scaled by victim innocence
 *     + past relations;
 *   - the arc SELF-CORRECTS (decays toward zero — the reckoning) unless reinforced
 *     (the spiral);
 *   - the drift DRIFTS the derived settlementAlignment (computeMalice up,
 *     computeLawfulness down) — and an ABSENT ledger is BYTE-IDENTICAL;
 *   - a threshold crossing surfaces a W-C5-shaped reckoning receipt.
 */
import { describe, it, expect } from 'vitest';

import {
  moralDriftDeltaFor, advanceMoralDrift, moralDriftTerm,
  moralReckoningNewsEntries, MORAL_DRIFT_TUNING,
} from '../../src/domain/spatial/moralDrift.js';
import { computeMalice, computeLawfulness } from '../../src/domain/worldPulse/disposition.js';
import { applyAllyIntelSharing, GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';

// A lawful-good aggressor vs a chaotic-evil one, on the SAME innocent victim + bond.
const LAWFUL_GOOD = { actorLawfulness01: 0.9, actorMalice01: 0.1 };
const CHAOTIC_EVIL = { actorLawfulness01: 0.1, actorMalice01: 0.9 };
const INNOCENT_WEAK = { victimMalice01: 0.1, victimStrength01: 0.15 };
const inst = (over) => ({ actorId: 's', victimId: 'x', ...LAWFUL_GOOD, ...INNOCENT_WEAK, trueRelationship: 'neutral', ...over });
const worldWith = (moralDrift) => ({ spatialLedgers: moralDrift ? { moralDrift } : {} });

describe('moralDriftDeltaFor — the sharpness scalings', () => {
  it('is SHARPEST for a lawful-good actor (the gap between creed and act)', () => {
    const lg = moralDriftDeltaFor(inst({ ...LAWFUL_GOOD })).malice;
    const ce = moralDriftDeltaFor(inst({ ...CHAOTIC_EVIL })).malice;
    expect(lg).toBeGreaterThan(ce);
    // A saint drifts several times harder than a devil for the same crime.
    expect(lg).toBeGreaterThan(ce * 2);
  });
  it('scales UP with victim innocence (saintly + weak is the worse target)', () => {
    const innocent = moralDriftDeltaFor(inst({ victimMalice01: 0.05, victimStrength01: 0.1 })).malice;
    const guilty = moralDriftDeltaFor(inst({ victimMalice01: 0.9, victimStrength01: 0.9 })).malice;
    expect(innocent).toBeGreaterThan(guilty);
  });
  it('a march on a FORMER FRIEND (friendly true relationship) drifts harder than on a stranger', () => {
    const friend = moralDriftDeltaFor(inst({ trueRelationship: 'allied' })).malice;
    const stranger = moralDriftDeltaFor(inst({ trueRelationship: 'neutral' })).malice;
    expect(friend).toBeCloseTo(stranger * MORAL_DRIFT_TUNING.FORMER_FRIEND_MULT, 6);
  });
  it('lawlessness drift is a fixed fraction of the malice drift', () => {
    const d = moralDriftDeltaFor(inst({}));
    expect(d.lawlessness).toBeCloseTo(d.malice * MORAL_DRIFT_TUNING.LAWLESSNESS_RATIO, 6);
  });
});

describe('advanceMoralDrift — accumulate, spiral, and the reckoning decay', () => {
  it('an unjust instigation materializes a drift entry', () => {
    const { next, changed } = advanceMoralDrift({ instigations: [inst({})], worldState: worldWith(null), tick: 5 });
    expect(changed).toBe(true);
    expect(next.s.malice).toBeGreaterThan(0);
    expect(next.s.instigations).toBe(1);
    expect(next.s.lastTick).toBe(5);
  });

  it('the arc DECAYS toward zero over silent ticks (the reckoning) — and prunes below the floor', () => {
    let ws = worldWith(null);
    const first = advanceMoralDrift({ instigations: [inst({})], worldState: ws, tick: 0 });
    ws = worldWith(first.next);
    const startMalice = first.next.s.malice;
    // Advance many SILENT ticks: no fresh instigation ⇒ pure decay.
    let last = first;
    for (let t = 1; t <= 40; t += 1) {
      last = advanceMoralDrift({ instigations: [], worldState: ws, tick: t });
      ws = worldWith(last.next);
      if (!last.next) break;
    }
    // Eventually the drift falls below MIN_DRIFT and the entry drops (reckoning complete).
    expect(last.next).toBeNull();
    // Midway it was strictly less than the start (monotone decay).
    const mid = advanceMoralDrift({ instigations: [], worldState: worldWith(first.next), tick: 3 });
    expect(mid.next.s.malice).toBeLessThan(startMalice);
  });

  it('a REPEATED instigation SPIRALS (rises faster than it decays)', () => {
    let ws = worldWith(null);
    let r = advanceMoralDrift({ instigations: [inst({})], worldState: ws, tick: 0 });
    const afterOne = r.next.s.malice;
    ws = worldWith(r.next);
    r = advanceMoralDrift({ instigations: [inst({})], worldState: ws, tick: 1 });
    // Two instigations one tick apart: the second lands on a barely-decayed first.
    expect(r.next.s.malice).toBeGreaterThan(afterOne);
    expect(r.next.s.instigations).toBe(2);
  });

  it('a reckoning FIRES on the tick the drift crosses the threshold', () => {
    // A lawful-good actor on an innocent former friend crosses in one strong act.
    const strong = inst({ trueRelationship: 'allied' });
    const { reckonings } = advanceMoralDrift({ instigations: [strong, strong], worldState: worldWith(null), tick: 2 });
    expect(reckonings.length).toBe(1);
    expect(reckonings[0].settlementId).toBe('s');
    expect(reckonings[0].malice).toBeGreaterThanOrEqual(MORAL_DRIFT_TUNING.RECKONING_THRESHOLD);
  });

  it('no instigations + no prior ⇒ a byte-neutral no-op', () => {
    const r = advanceMoralDrift({ instigations: [], worldState: worldWith(null), tick: 9 });
    expect(r.changed).toBe(false);
    expect(r.next).toBeNull();
    expect(r.reckonings).toEqual([]);
  });
});

describe('moralDriftTerm + disposition byte-identity', () => {
  const item = {
    id: 's',
    settlement: {
      name: 's', npcs: [{ id: 'n', name: 'Reeve', importance: 'key', personality: { dominant: 'honest' } }],
      powerStructure: { factions: [{ faction: 'Council', category: 'government', power: 60, isGoverning: true }] },
    },
  };

  it('an ABSENT ledger ⇒ {0,0} ⇒ computeMalice / computeLawfulness are BYTE-IDENTICAL', () => {
    const bare = { warExhaustion: {}, occupations: {} };
    const withEmptyLedger = { warExhaustion: {}, occupations: {}, spatialLedgers: {} };
    expect(moralDriftTerm(bare, 's')).toEqual({ malice: 0, lawlessness: 0 });
    // The alignment reads must be identical with no ledger vs an empty spatialLedgers.
    expect(computeMalice(item, withEmptyLedger)).toBe(computeMalice(item, bare));
    expect(computeLawfulness(item, withEmptyLedger)).toBe(computeLawfulness(item, bare));
  });

  it('a present drift entry RAISES malice and LOWERS lawfulness (the alignment drifts)', () => {
    const bare = { warExhaustion: {}, occupations: {} };
    const drifted = { warExhaustion: {}, occupations: {}, spatialLedgers: { moralDrift: { s: { malice: 0.5, lawlessness: 0.4, instigations: 3, sinceTick: 0, lastTick: 2 } } } };
    expect(computeMalice(item, drifted)).toBeGreaterThan(computeMalice(item, bare));
    expect(computeLawfulness(item, drifted)).toBeLessThan(computeLawfulness(item, bare));
  });

  it('moralDriftTerm clamps + tolerates garbage', () => {
    expect(moralDriftTerm(null, 's')).toEqual({ malice: 0, lawlessness: 0 });
    expect(moralDriftTerm({ spatialLedgers: { moralDrift: { s: { malice: 5, lawlessness: -1 } } } }, 's')).toEqual({ malice: 1, lawlessness: 0 });
  });
});

describe('moralReckoningNewsEntries — the W-C5-shaped receipt', () => {
  it('empty ⇒ [] (byte-neutral)', () => {
    expect(moralReckoningNewsEntries([])).toEqual([]);
  });
  it('a betrayal reckoning names the former friend + carries the betrayal tag', () => {
    const rows = moralReckoningNewsEntries(
      [{ settlementId: 's', victimId: 'x', malice: 0.4, lawlessness: 0.28, instigations: 2, trueRelationship: 'allied' }],
      (id) => id.toUpperCase(), 7, null,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].impactKind).toBe('moral_reckoning');
    expect(rows[0].tags).toContain('betrayal');
    expect(rows[0].tags).toContain('moral_drift');
    expect(rows[0].summary).toContain('former friend');
    expect(rows[0].settlementIds).toEqual(['s', 'x']);
  });
});

// ── THE EVIL-MANIPULATION ARC (M9b soak — components 3+4 composed) ─────────────
// The design's "dark emergent" (design §4g round 11): an EVIL settlement WEAPONIZES
// the ally-intel channel — feeds FALSE high-confidence intel to a lawful-good
// neighbour ⇒ the neighbour acts unjustly ⇒ DRIFTS. The soak asserts the arc OCCURS,
// is DETERMINISTIC, and stays BOUNDED (the co-built brakes: the MAX_DRIFT cap + the
// reckoning decay). No runaway, no NaN, and the arc RESOLVES when the manipulation stops.
describe('M9b soak — the evil-manipulation arc occurs and stays bounded', () => {
  const item = (id, factions = []) => ({ id, name: id.toUpperCase(), settlement: { name: id, tier: 'town', population: 2000, config: { primaryDeitySnapshot: { name: 'Sol' } }, powerStructure: { factions } } });
  const belief = (over = {}) => ({ readiness: 0.2, strengthBand: 2, allianceLabel: 'neutral', faithLabel: null, confidence01: 0.85, lastUpdateTick: 0, ...over });
  const EVIL = { lawfulness01: 0.4, malice01: 0.92 };

  it('an evil sharer PLANTS a false hostile belief about an innocent in a lawful-good ally', () => {
    // 'e' (evil) believes 'l' an ally, holds a confident belief about innocent 'i'.
    const maps = { e: { [GOVERNING_SEAT_KEY]: {
      l: belief({ allianceLabel: 'allied', confidence01: 0.8 }),
      i: belief({ allianceLabel: 'trade_partner', readiness: 0.05, strengthBand: 2, confidence01: 0.9 }),
    } } };
    const ctx = { byId: new Map([['e', item('e')], ['l', item('l')], ['i', item('i')]]), pressureIdx: null, worldState: {} };
    const nb = new Map([['e', new Map([['l', 'allied'], ['i', 'neutral']])]]);
    const out = applyAllyIntelSharing({ maps, ctx, neighbours: nb, alignmentOf: () => EVIL, now: 1 });
    // 'l' now BELIEVES the innocent 'i' is a hostile — the seed of an unjust war.
    expect(out.l[GOVERNING_SEAT_KEY].i.allianceLabel).toBe('hostile');
  });

  it('a RELENTLESS unjust-war spiral stays bounded (≤ MAX_DRIFT), deterministic, and never NaN', () => {
    const inst = { actorId: 'l', victimId: 'i', actorLawfulness01: 0.9, actorMalice01: 0.1, victimMalice01: 0.05, victimStrength01: 0.1, trueRelationship: 'trade_partner' };
    const run = () => {
      let ws = { spatialLedgers: {} };
      const trace = [];
      for (let t = 0; t < 60; t += 1) {
        const r = advanceMoralDrift({ instigations: [inst], worldState: ws, tick: t });
        ws = { spatialLedgers: r.next ? { moralDrift: r.next } : {} };
        const m = r.next?.l?.malice ?? 0;
        expect(Number.isFinite(m)).toBe(true);
        expect(m).toBeLessThanOrEqual(MORAL_DRIFT_TUNING.MAX_DRIFT);
        trace.push(m);
      }
      return { trace, ws };
    };
    const a = run();
    const b = run();
    expect(a.trace).toEqual(b.trace);                    // deterministic (no rng)
    // The alignment is bounded regardless — the derived malice never exceeds 1.
    const drifted = a.ws;
    const lItem = item('l', [{ faction: 'Council', category: 'government', power: 60, isGoverning: true }]);
    expect(computeMalice(lItem, drifted)).toBeLessThanOrEqual(1);
    expect(computeMalice(lItem, drifted)).toBeGreaterThan(computeMalice(lItem, { spatialLedgers: {} }));
  });

  it('when the manipulation STOPS, the arc RESOLVES — the drift decays to nothing (no perma-scar)', () => {
    const inst = { actorId: 'l', victimId: 'i', actorLawfulness01: 0.9, actorMalice01: 0.1, victimMalice01: 0.05, victimStrength01: 0.1, trueRelationship: 'trade_partner' };
    let ws = { spatialLedgers: {} };
    for (let t = 0; t < 5; t += 1) { const r = advanceMoralDrift({ instigations: [inst], worldState: ws, tick: t }); ws = { spatialLedgers: r.next ? { moralDrift: r.next } : {} }; }
    let last = null;
    for (let t = 5; t < 120; t += 1) { last = advanceMoralDrift({ instigations: [], worldState: ws, tick: t }); ws = { spatialLedgers: last.next ? { moralDrift: last.next } : {} }; if (!last.next) break; }
    expect(last.next).toBeNull();   // the conscience reasserts — the entry drops
  });
});
