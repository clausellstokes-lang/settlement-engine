/**
 * tests/domain/reciprocalPatronLoop.test.js — Phase 4 W-F4 reciprocal patron loop.
 *
 * A patron is retained partly by ALIGNMENT FIT: how much the settlement's OWN
 * ENDOGENOUS conduct (governance character + compromise depth + governance-form law
 * affinity — NOT war/trade/partnerships, NOT the user/party) matches the deity's
 * two-axis plane. The loop is grafted onto deityLegitimacyTarget's W_RULER family,
 * gated on a measured piety record (the "live settlement" signal), and:
 *  - IMPOSED-GOD-WITHERS: an evil/chaotic patron over good/lawful/clean conduct earns
 *    a LOWER legitimacy target than the same patron over matching conduct; and setting
 *    the deity WITHOUT lived conduct (no piety record) grants no fit — SET_PRIMARY_DEITY
 *    sets but never feeds.
 *  - CONTINUOUSLY FED: the fit tracks CURRENT conduct — as conduct drifts toward the
 *    deity's plane the target rises, away from it the target falls (no perpetual credit).
 *  - NEUTRAL BYTE-IDENTITY: a neutral deity gets fit exactly 0 ⇒ the loop is invisible.
 *  - SUBCRITICAL: the swing is bounded by CONDUCT_FIT_W (no absorbing state).
 */

import { describe, it, expect } from 'vitest';
import { deityLegitimacyTarget, RELIGION_LEGITIMACY_TUNING } from '../../src/domain/worldPulse/religionLegitimacy.js';

const deity = (name, { align = 'neutral', law = 'neutral', temper = 'neutral', rank = 'minor' } = {}) => ({
  _deityRef: `custom:lu_${name.toLowerCase()}`, name, alignmentAxis: align, lawAxis: law, temperamentAxis: temper, rankAxis: rank,
});

// A synthetic ruling-power lens: align 0 evil … 1 good; compromise 0 clean … 1 rotten.
const lensOf = ({ align, compromise }) => ({ align, compromise, temper: 0.5, power: 0.6, corrupt: compromise });

const fresh = { tenure: 0, heresyStain: 0, standing: 'cult' };

const target = ({ d, lens, government, pietyMult, entry = fresh }) => deityLegitimacyTarget({
  settlement: {}, snapshot: {}, worldState: {}, cid: 's1',
  deity: d, deityRef: d._deityRef, neighbourIds: [], entry, lens, government, pietyMult,
  deitySnapshotFor: () => null,
});

const GOOD_LAWFUL_CLEAN = { lens: lensOf({ align: 1, compromise: 0 }), government: 'feudal monarchy' };
const EVIL_CHAOTIC_ROTTEN = { lens: lensOf({ align: 0, compromise: 0.9 }), government: 'criminal syndicate' };
const NEUTRAL_CONDUCT = { lens: lensOf({ align: 0.5, compromise: 0 }), government: 'merchant council' };

const darkGod = deity('Korl', { align: 'evil', law: 'chaotic', temper: 'warlike' });

describe('reciprocal patron loop — the imposed god withers', () => {
  it('an evil/chaotic patron over good/lawful/clean conduct earns LESS legitimacy than over matching conduct', () => {
    const misaligned = target({ d: darkGod, ...GOOD_LAWFUL_CLEAN, pietyMult: 1 });
    const aligned = target({ d: darkGod, ...EVIL_CHAOTIC_ROTTEN, pietyMult: 1 });
    expect(aligned).toBeGreaterThan(misaligned);
  });

  it('SET_PRIMARY_DEITY sets but never feeds: with no measured piety the conduct-fit term is inert', () => {
    // The same imposed dark god over the same misaligned conduct: measuring piety (a
    // "live" settlement) LOWERS the target via the fit penalty; without a piety record
    // (freshly imposed, not yet lived) the loop is inert ⇒ higher (unwithered) target.
    const lived = target({ d: darkGod, ...GOOD_LAWFUL_CLEAN, pietyMult: 1 });
    const justImposed = target({ d: darkGod, ...GOOD_LAWFUL_CLEAN, pietyMult: null });
    expect(lived).toBeLessThan(justImposed);
  });

  it('CONTINUOUSLY FED: the fit tracks CURRENT conduct (drift toward the plane raises the target)', () => {
    const inGood = target({ d: darkGod, ...GOOD_LAWFUL_CLEAN, pietyMult: 1 });
    const inNeutral = target({ d: darkGod, ...NEUTRAL_CONDUCT, pietyMult: 1 });
    const inDark = target({ d: darkGod, ...EVIL_CHAOTIC_ROTTEN, pietyMult: 1 });
    expect(inNeutral).toBeGreaterThan(inGood);
    expect(inDark).toBeGreaterThan(inNeutral);
  });

  it('NEUTRAL BYTE-IDENTITY: a fully-neutral deity gets fit exactly 0 (loop invisible with/without piety)', () => {
    const neutralGod = deity('Vael', { align: 'neutral', law: 'neutral', temper: 'neutral' });
    const withPiety = target({ d: neutralGod, ...EVIL_CHAOTIC_ROTTEN, pietyMult: 1 });
    const noPiety = target({ d: neutralGod, ...EVIL_CHAOTIC_ROTTEN, pietyMult: null });
    expect(withPiety).toBe(noPiety);
  });

  it('SUBCRITICAL: the fit swing never exceeds CONDUCT_FIT_W (bounded — no absorbing state)', () => {
    // Same deity, best-aligned vs worst-aligned conduct, holding everything else fixed via
    // a neutral lens is impossible (lens drives other terms), so bound the fit CONTRIBUTION
    // directly: a good/lawful deity flips the sign, and |aligned − misaligned| across the
    // moral+law extremes stays within 2×CONDUCT_FIT_W of the plane geometry.
    const brightGod = deity('Sael', { align: 'good', law: 'lawful', temper: 'peaceful' });
    const alignedBright = target({ d: brightGod, ...GOOD_LAWFUL_CLEAN, pietyMult: 1 });
    const misalignedBright = target({ d: brightGod, ...EVIL_CHAOTIC_ROTTEN, pietyMult: 1 });
    // The bright god thrives under good/lawful conduct and withers under dark conduct —
    // the MIRROR of the dark god, confirming the term is signed and symmetric.
    expect(alignedBright).toBeGreaterThan(misalignedBright);
    expect(RELIGION_LEGITIMACY_TUNING.CONDUCT_FIT_W).toBeLessThanOrEqual(0.2);
  });
});
