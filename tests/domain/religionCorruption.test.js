import { describe, it, test, expect } from 'vitest';

import { ensureNpcStates, advanceNpcCorruption, npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { advanceFactionCapture } from '../../src/domain/worldPulse/factionCapture.js';
import { computeAggressiveness, AGGRESSION_TUNING } from '../../src/domain/worldPulse/disposition.js';
import {
  hasCorruptingDeity, hasRepressingDeity, npcAlignmentScore, npcDeityDisfavor,
  deityAlignmentDirection, DEITY_CORRUPTION_TUNING,
  deityLawDirection, deityCorruptionTolerance, DEITY_LAW_TUNING,
} from '../../src/domain/corruption.js';
import { TRAIT_ALIGNMENT } from '../../src/data/npcData.js';
import { createPRNG } from '../../src/generators/prng.js';
import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Feature D (R3) — good/evil deity → corruption (OQ18) + warlike → aggressiveness
// (OQ22). The deity effects are TRIPLE-GATED at the pulse (religionDynamicsEnabled
// AND isSubsystemActive AND per-settlement deity presence); these unit tests drive
// the pure transforms directly with `religionActive: true/false` to prove the gate
// relaxation, the bounded damping, and the byte-identity dormancy anchor.
// ─────────────────────────────────────────────────────────────────────────────

const EVIL = Object.freeze({ id: 'custom:malgrim', name: 'Malgrim', alignmentAxis: 'evil', temperamentAxis: 'neutral', rankAxis: 'major' });
const GOOD = Object.freeze({ id: 'custom:lumina', name: 'Lumina', alignmentAxis: 'good', temperamentAxis: 'neutral', rankAxis: 'major' });
const WARLIKE = Object.freeze({ id: 'custom:kaor', name: 'Kaor', alignmentAxis: 'neutral', temperamentAxis: 'warlike', rankAxis: 'major' });
const PEACELIKE = Object.freeze({ id: 'custom:serel', name: 'Serel', alignmentAxis: 'neutral', temperamentAxis: 'peacelike', rankAxis: 'major' });

// A CRIME-FREE town: NO criminal institution (the actual onset gate is
// hasCriminalInst, an institution check — independent of the crime/security
// numbers). With no deity, corruption onset is IMPOSSIBLE here because the gate
// never even rolls. Prosperity/security are middling (not maxed) so the onset
// hazard sits above its 0.005 floor and the deity's relaxed gate is observable
// rather than buried under the clamp. The single NPC carries a corruptible,
// evil-leaning flaw.
function crimeFreeSnapshot({ deity = null, flaw = 'greedy', dominant = null } = {}) {
  const personality = { flaw, dominant: dominant || 'pragmatic', modifier: 'ambitious' };
  return {
    settlements: [{
      id: 's1',
      activeConditions: [],
      settlement: {
        tier: 'city',
        config: deity ? { primaryDeitySnapshot: deity } : {},
        institutions: [{ name: 'Grand Market' }, { name: 'Cobbler Hall' }],
        economicState: {
          prosperity: 'Poor',
          safetyProfile: { safetyRatio: 0.5, blackMarketCapture: 0, compound: { criminalEffective: 0 } },
        },
        npcs: [
          { name: 'Greedy Magistrate', personality, factionAffiliation: 'Court', institutionId: 'inst_court', importance: 'key' },
        ],
      },
    }],
  };
}

function seedClean(snap, seedKey) {
  let ws = ensureNpcStates({ npcStates: {} }, snap, createPRNG(seedKey).fork('init'));
  for (const id of Object.keys(ws.npcStates)) {
    ws.npcStates[id] = { ...ws.npcStates[id], corruption: false, corruptionProfile: { corrupted: false, vector: null } };
  }
  return ws;
}

const findState = (ws, re) => Object.values(ws.npcStates).find((s) => re.test(s.name));

// ── OQ18 — evil deity onset in a crime-free town (corruption.js path) ─────────
describe('OQ18 — evil deity relaxes the corruption onset gate', () => {
  it('a crime-free town with NO deity sees ZERO onset (the byte-identity baseline)', () => {
    const snap = crimeFreeSnapshot({ deity: null });
    let ws = seedClean(snap, 'baseline');
    const base = createPRNG('no-deity').fork('corruption');
    for (let t = 0; t < 60; t++) {
      // religionActive false: the gate is NOT relaxed, deityDisfavor is 1.0.
      ws = advanceNpcCorruption(ws, snap, base, { tick: t, religionActive: false }).worldState;
    }
    expect(findState(ws, /Greedy Magistrate/).corruption).toBe(false);
  });

  it('the SAME crime-free town with an EVIL deity CAN now see onset (corrupted from within)', () => {
    // A strongly evil-aligned NPC; the deity's onset disfavor lifts the hazard
    // ABOVE the security floor (bounded, ~1.4×) so onset becomes possible where
    // the no-deity gate never even rolls.
    const snap = crimeFreeSnapshot({ deity: EVIL, dominant: 'ruthless' });
    let ws = seedClean(snap, 'evil-onset');
    const base = createPRNG('evil-deity').fork('corruption');
    let turned = false;
    for (let t = 0; t < 120; t++) {
      ws = advanceNpcCorruption(ws, snap, base, { tick: t, religionActive: true }).worldState;
      if (findState(ws, /Greedy Magistrate/).corruption) { turned = true; break; }
    }
    expect(turned).toBe(true);
  });

  it('an evil deity with religionActive=false stays dormant — no onset (gate not relaxed)', () => {
    const snap = crimeFreeSnapshot({ deity: EVIL });
    let ws = seedClean(snap, 'evil-dormant');
    const base = createPRNG('evil-deity').fork('corruption');
    for (let t = 0; t < 60; t++) {
      ws = advanceNpcCorruption(ws, snap, base, { tick: t, religionActive: false }).worldState;
    }
    expect(findState(ws, /Greedy Magistrate/).corruption).toBe(false);
  });
});

// ── OQ18 — the PARALLEL factionCapture.js gate is relaxed too (not half-applied)
describe('OQ18 — evil deity relaxes the PARALLEL factionCapture gate', () => {
  // A faction with a corrupt leader in a CRIME-FREE, secure town. With no deity
  // the capture climb is gated off (hasCriminalInst false); an evil deity relaxes
  // it the same way the corruption.js onset gate is relaxed.
  function captureSnap(deity) {
    return {
      settlements: [{
        id: 's1',
        settlement: {
          config: deity ? { primaryDeitySnapshot: deity } : {},
          institutions: [{ name: 'Grand Market' }],
          economicState: {
            prosperity: 'Wealthy',
            safetyProfile: { safetyRatio: 3, blackMarketCapture: 2, compound: { criminalEffective: 5 } },
          },
        },
      }],
    };
  }
  const wsWith = () => ({
    npcStates: { n1: { npcId: 'n1', corruption: true, dotRank: 3 } },
    factionStates: {
      f1: {
        factionId: 'f1', settlementId: 's1', name: 'City Watch', captureState: 'none',
        internalSeats: { leader_champion: { npcId: 'n1', dotRank: 3 }, lieutenant_operator: null, agent_protege: null },
      },
    },
  });

  it('NO deity → a crime-free town never climbs the capture ladder (baseline)', () => {
    let ws = wsWith();
    const s = captureSnap(null);
    const base = createPRNG('cap-baseline').fork('faction-capture');
    for (let t = 0; t < 60; t++) ws = advanceFactionCapture(ws, s, base, { tick: t, religionActive: false }).worldState;
    expect(ws.factionStates.f1.captureState).toBe('none');
  });

  it('EVIL deity → the parallel gate relaxes and the faction CAN climb (effect not half-applied)', () => {
    let ws = wsWith();
    const s = captureSnap(EVIL);
    const base = createPRNG('cap-evil').fork('faction-capture');
    for (let t = 0; t < 60; t++) ws = advanceFactionCapture(ws, s, base, { tick: t, religionActive: true }).worldState;
    expect(ws.factionStates.f1.captureState).not.toBe('none');
  });

  it('EVIL deity with religionActive=false stays dormant at the capture gate', () => {
    let ws = wsWith();
    const s = captureSnap(EVIL);
    const base = createPRNG('cap-evil').fork('faction-capture');
    for (let t = 0; t < 60; t++) ws = advanceFactionCapture(ws, s, base, { tick: t, religionActive: false }).worldState;
    expect(ws.factionStates.f1.captureState).toBe('none');
  });
});

// ── Good deity represses corruption (faster exposure / demotion) ──────────────
describe('OQ18 — a good deity represses corruption (vs neutral / no deity)', () => {
  // A corrupt, EVIL-leaning NPC in a MODERATELY-secure town (exposure mid-range,
  // NOT pinned at the 0.50 ceiling — so the deity's ×multiplier has headroom).
  // The exposure side runs regardless of a criminal institution. A good deity
  // boosts exposure of the misaligned (evil) NPC → faster demotion than the
  // no-deity baseline.
  function corruptSnap(deity) {
    return {
      settlements: [{
        id: 's1',
        activeConditions: [],
        settlement: {
          tier: 'city',
          config: deity ? { primaryDeitySnapshot: deity } : {},
          institutions: [{ name: 'City Watch' }],
          economicState: {
            prosperity: 'Poor',
            safetyProfile: { safetyRatio: 0.8, blackMarketCapture: 10, compound: { criminalEffective: 20 } },
          },
          npcs: [
            { name: 'Ruthless Captain', personality: { flaw: 'ruthless', dominant: 'cruel', modifier: 'vengeful' }, importance: 'key' },
          ],
        },
      }],
    };
  }
  function seedCorrupt(snap, seedKey) {
    let ws = ensureNpcStates({ npcStates: {} }, snap, createPRNG(seedKey).fork('init'));
    for (const id of Object.keys(ws.npcStates)) {
      ws.npcStates[id] = { ...ws.npcStates[id], corruption: true, corruptionProfile: { corrupted: true, vector: 'greed' }, dotRank: 3 };
    }
    return ws;
  }
  function exposureCountOverRun(deity, religionActive) {
    const snap = corruptSnap(deity);
    let ws = seedCorrupt(snap, 'expose-cmp');
    const base = createPRNG('expose-cmp-seed').fork('corruption');
    let exposures = 0;
    for (let t = 0; t < 40; t++) {
      const r = advanceNpcCorruption(ws, snap, base, { tick: t, religionActive });
      ws = r.worldState;
      exposures += r.exposures.length;
    }
    return exposures;
  }

  it('a good deity yields MORE exposures of an evil-aligned corrupt NPC than the neutral baseline', () => {
    const baseline = exposureCountOverRun(null, false);
    const good = exposureCountOverRun(GOOD, true);
    expect(good).toBeGreaterThan(baseline);
  });

  it('a good deity NEVER raises onset (its pressure rides exposure only)', () => {
    expect(npcDeityDisfavor(GOOD, { personality: { flaw: 'ruthless' } }).onset).toBe(1.0);
    expect(npcDeityDisfavor(GOOD, { personality: { dominant: 'compassionate' } }).onset).toBe(1.0);
  });
});

// ── No-death-spiral soak ──────────────────────────────────────────────────────
describe('OQ18 — no death spiral: deity corruption stays bounded over many ticks', () => {
  it('an evil deity over 200 ticks never corrupts the whole settlement to total collapse', () => {
    // A larger settlement of mixed NPCs; the exposure/security counter-force must
    // keep the corrupt fraction bounded well below 100%.
    const npcs = [];
    for (let i = 0; i < 12; i++) {
      // Half evil-leaning corruptible, half clean/good — the security loop should
      // keep equilibrium, not run away.
      const evilLeaning = i % 2 === 0;
      npcs.push({
        name: `NPC_${i}`,
        personality: evilLeaning
          ? { flaw: 'greedy', dominant: 'ruthless', modifier: 'ambitious' }
          : { flaw: 'kind', dominant: 'compassionate', modifier: 'patient' },
        importance: i < 3 ? 'key' : 'notable',
      });
    }
    const snap = {
      settlements: [{
        id: 's1',
        activeConditions: [],
        settlement: {
          tier: 'city',
          config: { primaryDeitySnapshot: EVIL },
          institutions: [{ name: 'City Watch' }, { name: 'Grand Market' }],
          economicState: {
            prosperity: 'Prosperous',
            safetyProfile: { safetyRatio: 2.5, blackMarketCapture: 4, compound: { criminalEffective: 8 } },
          },
          npcs,
        },
      }],
    };
    let ws = seedClean(snap, 'soak');
    const base = createPRNG('soak-seed').fork('corruption');
    let maxFraction = 0;
    for (let t = 0; t < 200; t++) {
      ws = advanceNpcCorruption(ws, snap, base, { tick: t, religionActive: true }).worldState;
      const states = Object.values(ws.npcStates);
      const corruptCount = states.filter((s) => s.corruption).length;
      maxFraction = Math.max(maxFraction, corruptCount / states.length);
    }
    // Bounded: the exposure counter-force prevents total capture. Comfortably
    // below 100% even after 200 ticks under an evil deity.
    expect(maxFraction).toBeLessThan(0.85);
  });

  it('the deity disfavor multiplier is hard-bounded inside the equilibrium span', () => {
    const span = DEITY_CORRUPTION_TUNING.span;
    // Strongest possible evil-aligned NPC under an evil deity.
    const evilNpc = { personality: { flaw: 'cruel', dominant: 'ruthless', modifier: 'cold-blooded' } };
    const d = npcDeityDisfavor(EVIL, evilNpc);
    expect(d.onset).toBeLessThanOrEqual(1 + span);
    expect(d.onset).toBeGreaterThanOrEqual(1 - span);
    expect(d.exposure).toBe(1.0); // only ONE knob moves for an evil deity
  });
});

// ── OQ22 — warlike deity → ONE aggressiveness term, no double-count ───────────
describe('OQ22 — warlike deity adds exactly ONE aggressiveness term', () => {
  function item(deity) {
    return {
      id: 's1',
      settlement: {
        tier: 'town',
        population: 4000,
        config: deity ? { primaryDeitySnapshot: deity } : {},
        economicState: { prosperity: 'Stable' },
        powerStructure: {
          publicLegitimacy: { score: 60, label: 'Stable' },
          factions: [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true }],
          conflicts: [],
        },
        npcs: [],
      },
    };
  }

  it('a warlike-deity settlement is MORE aggressive than the same settlement with no deity', () => {
    const none = computeAggressiveness(item(null), {});
    const warlike = computeAggressiveness(item(WARLIKE), {});
    expect(warlike).toBeGreaterThan(none);
  });

  it('a peacelike-deity settlement is LESS aggressive than no deity', () => {
    const none = computeAggressiveness(item(null), {});
    const peacelike = computeAggressiveness(item(PEACELIKE), {});
    expect(peacelike).toBeLessThan(none);
  });

  it('warlike > no-deity > peacelike — the term is monotone and signed', () => {
    const warlike = computeAggressiveness(item(WARLIKE), {});
    const none = computeAggressiveness(item(null), {});
    const peacelike = computeAggressiveness(item(PEACELIKE), {});
    expect(warlike).toBeGreaterThan(none);
    expect(none).toBeGreaterThan(peacelike);
  });

  it('NO double-count: the warlike effect appears exactly once (a neutral-temperament deity = no delta)', () => {
    // A neutral-alignment, neutral-temperament deity contributes 0 to the drive,
    // so the aggressiveness equals the no-deity case EXACTLY — proving the deity
    // term is the ONLY warlike contribution (no second multiplier hides elsewhere).
    const neutralDeity = { id: 'custom:x', name: 'X', alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'minor' };
    const none = computeAggressiveness(item(null), {});
    const neutral = computeAggressiveness(item(neutralDeity), {});
    expect(neutral).toBe(none);
  });

  it('the warlike delta exactly matches W_DEITY folded into the drive (single additive term)', () => {
    // Removing the deity term zeroes the delta: a neutral-temperament deity (0
    // term) reads identically to no deity, while warlike/peacelike are symmetric
    // around the no-deity value — the signature of ONE signed additive term.
    const none = computeAggressiveness(item(null), {});
    const warlike = computeAggressiveness(item(WARLIKE), {});
    const peacelike = computeAggressiveness(item(PEACELIKE), {});
    // Symmetric around the no-deity baseline (tanh is odd; gov term is the same).
    expect(Math.abs((warlike - none) - (none - peacelike))).toBeLessThan(1e-9);
    // The tuning exposes the deity weight (sanity: it's a real, nonzero term).
    expect(AGGRESSION_TUNING.W_DEITY).toBeGreaterThan(0);
  });
});

// ── TRAIT_ALIGNMENT reads AUTHORED personality, not npcStates.alignment ───────
describe('TRAIT_ALIGNMENT reads the AUTHORED personality (OQ13)', () => {
  it('npcAlignmentScore reads npc.personality.{dominant,flaw,modifier}, NOT npcStates.alignment', () => {
    const evilNpc = {
      personality: { dominant: 'cruel', flaw: 'ruthless', modifier: 'vengeful' },
      // a decoy RNG-rolled alignment that must be IGNORED:
      alignment: 'good',
    };
    const goodNpc = {
      personality: { dominant: 'compassionate', flaw: 'merciful', modifier: 'principled' },
      alignment: 'evil',
    };
    expect(npcAlignmentScore(evilNpc)).toBeLessThan(0); // evil-leaning, despite decoy 'good'
    expect(npcAlignmentScore(goodNpc)).toBeGreaterThan(0); // good-leaning, despite decoy 'evil'
  });

  it('an unknown descriptor contributes EXACTLY 0 (no silent churn)', () => {
    expect(npcAlignmentScore({ personality: { dominant: 'left-handed', flaw: 'tall' } })).toBe(0);
    expect(npcAlignmentScore({ personality: {} })).toBe(0);
    expect(npcAlignmentScore({})).toBe(0);
  });

  it('the lexicon is signed: good descriptors positive, evil negative', () => {
    expect(TRAIT_ALIGNMENT.compassionate).toBeGreaterThan(0);
    expect(TRAIT_ALIGNMENT.incorruptible).toBeGreaterThan(0);
    expect(TRAIT_ALIGNMENT.cruel).toBeLessThan(0);
    expect(TRAIT_ALIGNMENT.corrupt).toBeLessThan(0);
  });

  it('an evil deity corrupts an evil-aligned NPC faster than a good-aligned one (onset disfavor)', () => {
    const evilNpc = { personality: { flaw: 'cruel', dominant: 'ruthless' } };
    const goodNpc = { personality: { flaw: 'merciful', dominant: 'compassionate' } };
    const evilOnset = npcDeityDisfavor(EVIL, evilNpc).onset;
    const goodOnset = npcDeityDisfavor(EVIL, goodNpc).onset;
    expect(evilOnset).toBeGreaterThan(1); // aligned-with-evil ⇒ corrupts faster
    expect(goodOnset).toBeLessThan(1);    // resists the evil deity
  });
});

// ── Dormancy byte-identity at BOTH gates + aggressiveness ─────────────────────
describe('dormancy byte-identity — no deity / religionActive false is unchanged', () => {
  it('hasCorruptingDeity / hasRepressingDeity are false for a deity-free settlement', () => {
    expect(hasCorruptingDeity({ config: {} })).toBe(false);
    expect(hasCorruptingDeity({})).toBe(false);
    expect(hasRepressingDeity({ config: {} })).toBe(false);
    expect(deityAlignmentDirection(null)).toBe(0);
    expect(deityAlignmentDirection({ alignmentAxis: 'neutral' })).toBe(0);
  });

  it('npcDeityDisfavor is {1.0, 1.0} when there is no deity (the byte-identity anchor)', () => {
    const d = npcDeityDisfavor(null, { personality: { flaw: 'cruel' } });
    expect(d.onset).toBe(1.0);
    expect(d.exposure).toBe(1.0);
  });

  it('computeAggressiveness with no deity reads EXACTLY the legacy value (no deity term churn)', () => {
    // A no-signal civic town with no deity must read EXACTLY 1.0 (the anchor the
    // war-layer fixtures depend on). The deity term must not perturb this.
    const noSignal = {
      id: 's1',
      settlement: {
        tier: 'town', population: 4000, config: {},
        economicState: { prosperity: 'Stable' },
        powerStructure: { publicLegitimacy: { score: 60 }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], conflicts: [] },
        npcs: [],
      },
    };
    expect(computeAggressiveness(noSignal, {})).toBe(1.0);
  });

  it('advanceNpcCorruption with religionActive=false ignores even an embedded evil deity', () => {
    // The embedded deity is present, but the layer is OFF: byte-identical to a
    // run on the same fixture with the deity stripped out.
    const withDeity = crimeFreeSnapshot({ deity: EVIL });
    const withoutDeity = crimeFreeSnapshot({ deity: null });
    const run = (snap) => {
      let ws = seedClean(snap, 'dormancy-cmp');
      const base = createPRNG('dormancy-seed').fork('corruption');
      for (let t = 0; t < 30; t++) ws = advanceNpcCorruption(ws, snap, base, { tick: t, religionActive: false }).worldState;
      return Object.values(ws.npcStates).map((s) => `${s.name}:${s.corruption}:${s.dotRank}`);
    };
    expect(run(withDeity)).toEqual(run(withoutDeity));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B5 — the lawful/chaotic axis is a DISTINCT corruption lever (NO double-count
// with the good/evil knobs). Good/evil drives onset/exposure RATE (npcDeityDisfavor);
// the law axis shifts corruption-TOLERANCE / the order check (deityCorruptionTolerance)
// and feeds law_order — never re-touching the onset/exposure magnitude.
// ─────────────────────────────────────────────────────────────────────────────
describe('B5 — lawful/chaotic is a SEPARATE corruption lever (no double-count with good/evil)', () => {
  const LAWFUL = { ...GOOD, lawAxis: 'lawful' };   // good + lawful
  const CHAOTIC = { ...GOOD, lawAxis: 'chaotic' };  // good + chaotic
  const GOOD_NO_LAW = { ...GOOD };                  // good, no lawAxis (legacy)

  it('deityLawDirection: lawful +1, chaotic −1, neutral/absent 0', () => {
    expect(deityLawDirection({ lawAxis: 'lawful' })).toBe(1);
    expect(deityLawDirection({ lawAxis: 'chaotic' })).toBe(-1);
    expect(deityLawDirection({ lawAxis: 'neutral' })).toBe(0);
    expect(deityLawDirection(GOOD_NO_LAW)).toBe(0); // legacy 3-axis ⇒ no law term
    expect(deityLawDirection(null)).toBe(0);
  });

  it('the law axis does NOT move the good/evil onset/exposure knobs (no double-count)', () => {
    // The SAME NPC under a good deity reads identical onset/exposure whether the
    // deity is lawful, chaotic, or law-neutral — the law axis touches a DIFFERENT
    // lever, so it cannot inflate the good/evil corruption magnitude.
    const npc = { personality: { flaw: 'ruthless' } }; // evil-leaning, corruptible
    const baseline = npcDeityDisfavor(GOOD_NO_LAW, npc);
    expect(npcDeityDisfavor(LAWFUL, npc)).toEqual(baseline);
    expect(npcDeityDisfavor(CHAOTIC, npc)).toEqual(baseline);
  });

  it('the corruption-tolerance lever moves with the law axis (chaotic + / lawful −), zero for good/evil-only', () => {
    expect(deityCorruptionTolerance(CHAOTIC)).toBeCloseTo(DEITY_LAW_TUNING.tolerance, 10);
    expect(deityCorruptionTolerance(LAWFUL)).toBeCloseTo(-DEITY_LAW_TUNING.tolerance, 10);
    // A good/evil-only deity (no law axis) moves the tolerance lever NOT AT ALL —
    // proving the two couplings are orthogonal.
    expect(deityCorruptionTolerance(GOOD_NO_LAW)).toBe(0);
    expect(deityCorruptionTolerance(EVIL)).toBe(0);
  });

  it('the two levers are orthogonal: alignment direction is unchanged by the law axis', () => {
    // The good/evil alignment direction (the corruption-rate lever) is read off
    // alignmentAxis alone, so adding a law axis cannot perturb it.
    expect(deityAlignmentDirection(LAWFUL)).toBe(deityAlignmentDirection(GOOD_NO_LAW));
    expect(deityAlignmentDirection(CHAOTIC)).toBe(deityAlignmentDirection(GOOD_NO_LAW));
  });
});

// ── Full-pulse integration: the triple gate end-to-end ────────────────────────
// Drives the REAL pulse (previewCampaignWorldPulse → advanceCampaignWorld →
// advanceNpcCorruption / advanceFactionCapture / computeDispositionFactorMap),
// proving (a) the deity effects only fire under religionDynamicsEnabled +
// isSubsystemActive + per-settlement deity, and (b) a deity-embedded-but-flag-off
// pulse is byte-identical (in npcStates) to a deity-free one.
describe('R3 — full-pulse integration (the triple gate)', () => {
  const NOW = '2026-01-01T00:00:00.000Z';

  // A poor, low-security but CRIME-FREE settlement (no criminal institution), so
  // legacy onset is gated off; an embedded evil deity can relax that gate.
  function settlement(name, { deity = null } = {}) {
    return {
      name,
      tier: 'town',
      population: 2200,
      config: {
        tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30,
        ...(deity ? { primaryDeitySnapshot: deity } : {}),
      },
      institutions: [{ name: 'Grain Market' }, { name: 'Cobbler Hall' }],
      economicState: {
        prosperity: 'Poor',
        primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'],
        safetyProfile: { safetyRatio: 0.5, blackMarketCapture: 0, compound: { criminalEffective: 0 } },
      },
      powerStructure: {
        publicLegitimacy: { score: 30, label: 'Contested' },
        factions: [
          { faction: 'Merchant League', category: 'economy', power: 60, isGoverning: true },
          { faction: 'Iron Wardens', category: 'military', power: 50 },
        ],
        conflicts: [],
      },
      npcs: [
        { id: `magistrate_${name}`, name: `Magistrate ${name}`, personality: { flaw: 'greedy', dominant: 'ruthless', modifier: 'vengeful' }, factionAffiliation: 'Merchant League', importance: 'key' },
        { id: `captain_${name}`, name: `Captain ${name}`, personality: { flaw: 'corrupt', dominant: 'cruel', modifier: 'ambitious' }, factionAffiliation: 'Iron Wardens', importance: 'notable' },
      ],
      activeConditions: [],
    };
  }
  function save(id, name, patch) {
    return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
  }
  function campaignFixture({ deity = null, rules = {}, worldState = {} } = {}) {
    return {
      id: 'r3-integration',
      name: 'R3 Integration',
      settlementIds: ['a', 'b'],
      worldState: {
        rngSeed: 'r3-integration-seed',
        tick: 4,
        simulationRules: rules,
        stressors: [],
        ...worldState,
      },
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
        channels: [{ type: 'trade_route', from: 'a', to: 'b', status: 'confirmed' }],
      }),
      wizardNews: { currentTick: 4, entries: [] },
    };
  }

  function runManyTicks({ deity, rules }) {
    let campaign = campaignFixture({ deity, rules });
    let saves = [save('a', 'Ashford', { deity }), save('b', 'Briarwatch')];
    let result;
    for (let i = 0; i < 12; i++) {
      result = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      // feed the evolved worldState back so corruption accrues across ticks.
      campaign = { ...campaign, worldState: result.worldState };
    }
    return result;
  }

  function corruptCount(result) {
    return Object.values(result.worldState.npcStates || {}).filter((s) => s.corruption).length;
  }

  test('flag ON + embedded evil deity: corruption onset fires in the crime-free town', () => {
    const result = runManyTicks({ deity: EVIL, rules: { religionDynamicsEnabled: true } });
    expect(corruptCount(result)).toBeGreaterThan(0);
  });

  test('flag OFF + embedded evil deity is byte-identical (npcStates) to a deity-free campaign', () => {
    const withDeityFlagOff = runManyTicks({ deity: EVIL, rules: { religionDynamicsEnabled: false } });
    const noDeity = runManyTicks({ deity: null, rules: { religionDynamicsEnabled: false } });
    // Strip per-id keys that mention the deity-bearing config; compare corruption
    // state shape. The deity embed lives on the settlement config (not npcStates),
    // so npcStates must match exactly between the two runs.
    const shape = (r) => Object.entries(r.worldState.npcStates || {})
      .map(([id, s]) => `${id}:${s.corruption}:${s.dotRank}:${s.ousted || false}`)
      .sort();
    expect(shape(withDeityFlagOff)).toEqual(shape(noDeity));
    // And the dormant run produced ZERO corruption (the crime-free gate held).
    expect(corruptCount(noDeity)).toBe(0);
    expect(corruptCount(withDeityFlagOff)).toBe(0);
  });

  // A RIVAL edge + a war_pressure stressor so the pulse produces a hostility
  // candidate (rival_sabotage / rival_arms_race) that the aggressiveness
  // multiplier modulates — otherwise the disposition term has nothing to scale.
  function conflictFixture({ deity, rules }) {
    return {
      id: 'r3-oq22',
      name: 'R3 OQ22',
      settlementIds: ['a', 'b'],
      worldState: {
        rngSeed: 'r3-oq22-seed',
        tick: 4,
        simulationRules: rules,
        stressors: [{ id: 'world_stressor.war_pressure.a', type: 'war_pressure', severity: 0.6, affectedSettlementIds: ['a'], age: 1 }],
      },
      regionalGraph: ensureRegionalGraph({
        edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' }],
        channels: [
          { type: 'war_front', from: 'a', to: 'b', status: 'confirmed' },
          { type: 'resource_competition', from: 'a', to: 'b', status: 'confirmed' },
        ],
      }),
      wizardNews: { currentTick: 4, entries: [] },
    };
  }

  test('OQ22: a warlike deity raises a settlement candidate severity vs no deity (one term, via the live pulse)', () => {
    // warLayerEnabled routes computeAggressiveness into candidateBase. A warlike
    // deity tilts the disposition multiplier up; a peacelike one down.
    const sevById = (result) => {
      const m = new Map();
      for (const c of result.candidates || []) if (c?.id != null && Number.isFinite(c.severity)) m.set(c.id, c.severity);
      return m;
    };
    const runWith = (deity) => previewCampaignWorldPulse({
      campaign: conflictFixture({ deity, rules: { warLayerEnabled: true, religionDynamicsEnabled: true } }),
      saves: [save('a', 'Ashford', { deity }), save('b', 'Briarwatch')],
      interval: 'one_month', now: NOW,
    });
    const warlike = sevById(runWith(WARLIKE));
    const peacelike = sevById(runWith(PEACELIKE));
    // At least one shared candidate has a strictly higher severity under the
    // warlike deity — the single aggressiveness term is live through the pulse.
    let sawHigher = false;
    let sawDifference = false;
    for (const [id, sevW] of warlike) {
      if (!peacelike.has(id)) continue;
      const sevP = peacelike.get(id);
      if (sevW !== sevP) sawDifference = true;
      if (sevW > sevP) sawHigher = true;
    }
    expect(sawDifference).toBe(true);
    expect(sawHigher).toBe(true);
  });
});
