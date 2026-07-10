/**
 * tests/domain/deityStance.test.js — Phase 4 W-F2.
 *
 * Pins the inter-deity STANCE tables row-by-row (the owner delegated the grid
 * design; the numbers land here as governed, equality-pinned data), the three
 * self-balancing ASYMMETRY properties the owner named, the TN/legacy neutrality
 * anchor, and the temper-derivation SHIM's byte-compatibility (stored verbatim for
 * every existing deity; derivation only for a deity with no stored axis).
 */
import { describe, expect, test } from 'vitest';

import {
  stanceOf,
  methodClash,
  lawSign,
  STANCE_TUNING,
} from '../../src/domain/worldPulse/deityStance.js';
import {
  evil01,
  chaos01,
  deriveTemper,
  deityTemper,
  TEMPER_DERIVATION,
} from '../../src/domain/worldPulse/deityAxes.js';
import { nicheOf } from '../../src/domain/worldPulse/cultImpositionApply.js';

// The nine alignment × law archetypes as embed-shaped snapshots (no temperamentAxis
// unless a test needs the shim's stored path).
const D = (/** @type {string} */ alignmentAxis, /** @type {string} */ lawAxis) => ({ alignmentAxis, lawAxis });
const LG = D('good', 'lawful');
const NG = D('good', 'neutral');
const CG = D('good', 'chaotic');
const LN = D('neutral', 'lawful');
const TN = D('neutral', 'neutral');
const CN = D('neutral', 'chaotic');
const LE = D('evil', 'lawful');
const NE = D('evil', 'neutral');
const CE = D('evil', 'chaotic');
const ALL = [LG, NG, CG, LN, TN, CN, LE, NE, CE];

const near = (/** @type {number} */ a, /** @type {number} */ b) => expect(a).toBeCloseTo(b, 10);

describe('deityStance — aggression rows (INTENT: good–evil)', () => {
  test('evil strikes EVERYONE incl. its own axis, only a SLIGHT tilt toward good/neutral', () => {
    // LE→LE (its own axis) is still HIGH; LE→good is only slightly higher (the tilt).
    near(stanceOf(LE, LE).aggression, 0.40);
    near(stanceOf(LE, LG).aggression, 0.50);
    near(stanceOf(LE, TN).aggression, 0.50);
    // the tilt is SLIGHT — vs-good exceeds vs-evil by exactly AGG_EVIL_TILT.
    near(stanceOf(LE, LG).aggression - stanceOf(LE, LE).aggression, STANCE_TUNING.AGG_EVIL_TILT);
  });

  test('chaotic evil raids impulsively — even its own axis', () => {
    near(stanceOf(CE, CE).aggression, 0.55);       // 0.40 base + 0.15 raid
    near(stanceOf(CE, LG).aggression, 0.65);       // 0.50 + 0.15 raid
    expect(stanceOf(CE, CE).aggression).toBeGreaterThan(stanceOf(LE, LE).aggression);
  });

  test('good is peaceful to all EXCEPT one strong, consolidated aggression vs evil', () => {
    near(stanceOf(LG, LE).aggression, 0.55);
    near(stanceOf(CG, CE).aggression, 0.55);
    expect(stanceOf(LG, LG).aggression).toBe(0);   // no aggression among the good
    expect(stanceOf(LG, TN).aggression).toBe(0);   // nor toward neutral
    expect(stanceOf(NG, LN).aggression).toBe(0);
  });

  test('neutral source never initiates aggression (the TN anchor)', () => {
    for (const target of ALL) expect(stanceOf(TN, target).aggression).toBe(0);
  });
});

describe('deityStance — cooperation rows + the three self-balancing asymmetries', () => {
  test('good cooperates on shared GOOD ground; not with evil or neutral', () => {
    near(stanceOf(NG, NG).cooperation, STANCE_TUNING.COOP_GOOD_BASE);
    near(stanceOf(LG, CG).cooperation, STANCE_TUNING.COOP_GOOD_BASE); // law doesn't gate good cooperation
    expect(stanceOf(LG, LE).cooperation).toBe(0);  // good will not ally evil
    expect(stanceOf(LG, TN).cooperation).toBe(0);  // stance is a modifier — neutral target = no signal
  });

  test('THE owner asymmetry: good-good cooperation > LE-LE cohesion > CE-anything', () => {
    const goodGood = stanceOf(NG, NG).cooperation;
    const leLe = stanceOf(LE, LE).cooperation;
    const ceCe = stanceOf(CE, CE).cooperation;
    expect(goodGood).toBeGreaterThan(leLe);
    expect(leLe).toBeGreaterThan(ceCe);
    expect(ceCe).toBeGreaterThan(0);               // evil still bands, just weakly
  });

  test('evil-pact cohesion keys on MIN lawfulness: LE×LE > LE×CE ≥ CE×CE', () => {
    const leLe = stanceOf(LE, LE).cooperation;
    const leCe = stanceOf(LE, CE).cooperation;
    const ceLe = stanceOf(CE, LE).cooperation;
    const ceCe = stanceOf(CE, CE).cooperation;
    expect(leLe).toBeGreaterThan(leCe);
    expect(leCe).toBeGreaterThanOrEqual(ceCe);
    near(leCe, ceLe);                              // cooperation is symmetric in the pair
    near(leCe, ceCe);                             // one chaotic party pins cohesion to the CE floor
  });

  test('the consolidation cap HOLDS: evil never out-cooperates good, by construction', () => {
    expect(STANCE_TUNING.EVIL_COOP_CAP).toBeLessThan(STANCE_TUNING.COOP_GOOD_BASE);
    const goodGround = [LG, NG, CG];
    const minGoodGood = Math.min(...goodGround.flatMap((a) => goodGround.map((b) => stanceOf(a, b).cooperation)));
    const evil = [LE, NE, CE];
    const maxEvil = Math.max(...evil.flatMap((a) => ALL.map((b) => stanceOf(a, b).cooperation)));
    expect(maxEvil).toBeLessThan(minGoodGood);     // evil's BEST cooperation < good's WORST shared-ground cooperation
    expect(maxEvil).toBeLessThanOrEqual(STANCE_TUNING.EVIL_COOP_CAP);
  });
});

describe('deityStance — betrayal + durability rows (METHOD: law–chaos)', () => {
  test('betrayal hazard: devils hold treaties, demons cannot — CE > NE > LE, good = 0', () => {
    near(stanceOf(LE, TN).betrayalHazard, 0.05);   // lawful evil: triggered-only
    near(stanceOf(NE, TN).betrayalHazard, 0.15);   // neutral evil: the floor
    near(stanceOf(CE, TN).betrayalHazard, 0.60);   // chaotic evil: capricious
    expect(stanceOf(LG, TN).betrayalHazard).toBe(0);   // good never initiates
    expect(stanceOf(TN, CE).betrayalHazard).toBe(0);   // nor neutral
    // ordering is monotone in disorder for a fixed evil intent.
    expect(stanceOf(CE, TN).betrayalHazard).toBeGreaterThan(stanceOf(NE, TN).betrayalHazard);
    expect(stanceOf(NE, TN).betrayalHazard).toBeGreaterThan(stanceOf(LE, TN).betrayalHazard);
  });

  test('treaty durability (signed modifier) scales with min lawfulness; evil is brittle', () => {
    near(stanceOf(LG, LG).treatyDurability, 0.50);   // lawful-good pacts hold
    near(stanceOf(LE, LE).treatyDurability, 0.26);   // lawful-evil: coercive-but-held (positive but discounted)
    near(stanceOf(LG, CE).treatyDurability, -0.62);  // one chaotic party ⇒ brittle
    near(stanceOf(CE, CE).treatyDurability, -0.74);  // demons: most brittle
    expect(stanceOf(TN, TN).treatyDurability).toBe(0);
    // ordering: LG-LG > LE-LE > LG-CE > CE-CE.
    const d = (/** @type {any} */ a, /** @type {any} */ b) => stanceOf(a, b).treatyDurability;
    expect(d(LG, LG)).toBeGreaterThan(d(LE, LE));
    expect(d(LE, LE)).toBeGreaterThan(d(LG, CE));
    expect(d(LG, CE)).toBeGreaterThan(d(CE, CE));
  });
});

describe('deityStance — the TN/legacy neutrality anchor (back-compat pin 5c)', () => {
  test('a fully-neutral pair reads a fully-ZERO stance', () => {
    expect(stanceOf(TN, TN)).toEqual({ aggression: 0, cooperation: 0, betrayalHazard: 0, treatyDurability: 0 });
  });

  test('a legacy 3-axis deity (no lawAxis) reads as law-neutral (chaos01 = 0.5)', () => {
    const legacyEvil = { alignmentAxis: 'evil' };            // no lawAxis at all
    expect(chaos01(legacyEvil)).toBe(0.5);
    expect(lawSign(legacyEvil)).toBe(0);
    // its stance equals the NE (neutral-law evil) stance — the lawAxis-absence⇒neutral rule.
    expect(stanceOf(legacyEvil, TN)).toEqual(stanceOf(NE, TN));
  });

  test('every archetype pair stays in-bounds (grid property)', () => {
    for (const a of ALL) for (const b of ALL) {
      const s = stanceOf(a, b);
      expect(s.aggression).toBeGreaterThanOrEqual(0);
      expect(s.aggression).toBeLessThanOrEqual(1);
      expect(s.cooperation).toBeGreaterThanOrEqual(0);
      expect(s.cooperation).toBeLessThanOrEqual(1);
      expect(s.betrayalHazard).toBeGreaterThanOrEqual(0);
      expect(s.betrayalHazard).toBeLessThanOrEqual(1);
      expect(s.treatyDurability).toBeGreaterThanOrEqual(-1);
      expect(s.treatyDurability).toBeLessThanOrEqual(1);
    }
  });
});

describe('deityStance — the LOCAL-lane law-METHOD terms (byte-safe for legacy)', () => {
  test('methodClash is 1 only for OPPOSED non-neutral law axes, else 0', () => {
    expect(methodClash(LG, CE)).toBe(1);           // lawful ↔ chaotic
    expect(methodClash(CG, LE)).toBe(1);
    expect(methodClash(LG, LN)).toBe(0);           // same law axis
    expect(methodClash(CG, CE)).toBe(0);
    expect(methodClash(LG, TN)).toBe(0);           // one side law-neutral
  });

  test('methodClash is ZERO whenever EITHER deity is law-neutral/legacy — even evil ones', () => {
    // This is the byte-identity guarantee: every existing fixture is law-neutral, so
    // the receptivity + patron-contest law terms vanish and behavior is unchanged.
    for (const a of ALL) {
      expect(methodClash(a, NE)).toBe(0);          // NE is law-neutral
      expect(methodClash(NE, a)).toBe(0);
      expect(methodClash(a, { alignmentAxis: 'evil' })).toBe(0); // legacy 3-axis evil
    }
  });

  test('lawSign: +1 lawful · −1 chaotic · 0 neutral/legacy', () => {
    expect(lawSign(LG)).toBe(1);
    expect(lawSign(CG)).toBe(-1);
    expect(lawSign(NG)).toBe(0);
    expect(lawSign({ alignmentAxis: 'evil' })).toBe(0);
    expect(lawSign(null)).toBe(0);
  });
});

describe('deityConstants — axis projections + the temper-derivation shim', () => {
  test('evil01 / chaos01 center neutral (and legacy) at 0.5', () => {
    expect(evil01(CE)).toBe(1);
    expect(evil01(TN)).toBe(0.5);
    expect(evil01(LG)).toBe(0);
    expect(evil01(null)).toBe(0.5);
    expect(evil01({ /* no axes */ })).toBe(0.5);
    expect(chaos01(CE)).toBe(1);
    expect(chaos01(LG)).toBe(0);
    expect(chaos01({ alignmentAxis: 'evil' })).toBe(0.5);   // no lawAxis ⇒ neutral
  });

  test('deriveTemper: intent leads (evil→warlike, good→peacelike), neutral core→neutral', () => {
    expect(deriveTemper(evil01(CE), chaos01(CE))).toBe('warlike');
    expect(deriveTemper(evil01(LE), chaos01(LE))).toBe('warlike');
    expect(deriveTemper(evil01(LG), chaos01(LG))).toBe('peacelike');
    expect(deriveTemper(evil01(NG), chaos01(NG))).toBe('peacelike');
    expect(deriveTemper(0.5, 0.5)).toBe('neutral');
    expect(deriveTemper(evil01(CN), chaos01(CN))).toBe('neutral'); // chaotic-neutral trickster is NOT warlike
    expect(deriveTemper(evil01(LN), chaos01(LN))).toBe('neutral');
  });

  test('the SHIM returns the stored temperament VERBATIM for every existing deity (byte-compat)', () => {
    for (const stored of ['warlike', 'peacelike', 'peaceful', 'neutral', 'scheming', '']) {
      const deity = { alignmentAxis: 'evil', lawAxis: 'chaotic', temperamentAxis: stored };
      expect(deityTemper(deity)).toBe(stored);           // NEVER the derived value
    }
  });

  test('the SHIM derives ONLY when there is no stored axis (the W-F4/W-F5 path)', () => {
    expect(deityTemper({ alignmentAxis: 'evil', lawAxis: 'chaotic' })).toBe('warlike'); // derived
    expect(deityTemper({ alignmentAxis: 'good', lawAxis: 'lawful' })).toBe('peacelike');
    expect(deityTemper(null)).toBeUndefined();
    expect(deityTemper(undefined)).toBeUndefined();
  });

  test('the niche key reads temper THROUGH the shim — stored verbatim ⇒ unchanged', () => {
    // Every existing deity carries a stored temperamentAxis, so nicheOf is byte-identical.
    expect(nicheOf({ temperamentAxis: 'warlike', alignmentAxis: 'evil' })).toBe('warlike:evil');
    expect(nicheOf({ temperamentAxis: 'peacelike', alignmentAxis: 'good' })).toBe('peacelike:good');
    expect(nicheOf({})).toBe('neutral:neutral');
    // a DERIVED-only deity (no stored temper) gets the derived niche — the W-F4 activation.
    expect(nicheOf({ alignmentAxis: 'evil', lawAxis: 'chaotic' })).toBe('warlike:evil');
  });
});

describe('deityStance — single-source discipline', () => {
  test('STANCE_TUNING and TEMPER_DERIVATION are frozen governed tables', () => {
    expect(Object.isFrozen(STANCE_TUNING)).toBe(true);
    expect(Object.isFrozen(TEMPER_DERIVATION)).toBe(true);
  });

  test('stanceOf returns exactly the four owner-named fields', () => {
    expect(Object.keys(stanceOf(CE, LG)).sort()).toEqual(
      ['aggression', 'betrayalHazard', 'cooperation', 'treatyDurability'],
    );
  });
});
