/**
 * characterConsumers.test.js — the battery for W-LIVES car L5's consumer seam.
 *
 * ⭐⭐ THE DISCIPLINE THIS FILE IS BUILT AROUND: every read in the leaf is
 * DOUBLY ABSENT on every world this engine can generate today — no chart is ever
 * authored, and no drift is ever written. A battery that only ever exercised those
 * two absences would be green, would look thorough, and would discover NOTHING
 * (the §866 vacuous-green class). So every arm below is driven TWICE: once with the
 * absence, to pin the byte-identity claim, and once with a chart and a fixture
 * projection, to prove the comparator can see the difference at all.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: a loop-registered
 * suite is TEST_UNREGISTERED to the lighting census and its assertions are then
 * evidence nowhere, however green vitest reports it.
 *
 * @enforced-by this test
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  CORRUPTIBLE_AXES,
  CORRUPTIBLE_AXIS_VECTORS,
  CORRUPTION_DEPTH_GATE,
  CONSUMER_SEAM_PROVENANCE,
  MAX_RISK_BREADTH,
  MIN_RISK_BREADTH,
  NEUTRAL_RISK_CENTER,
  PARADIGM_WORD_PROJECTION_SEAM,
  RISK_CENTER_AXES,
  RISK_CENTER_SHARE,
  RISK_CENTER_TERMS,
  RISK_TERMS,
  VETTING_TEMPER_BANDS,
  alignmentWord,
  corruptibleAxisByDepth,
  corruptionVectorByDepth,
  derivedAlignment,
  driftTaughtWithin,
  effectiveAxesOf,
  effectiveDescriptors,
  riskRegister,
  vettingTemperBand,
} from '../../../src/domain/npc/characterConsumers.js';
import { CHARACTER_DRIFT_KEY } from '../../../src/domain/npc/characterDrift.js';
import { NPC_ALIGNMENTS } from '../../../src/domain/npc/npcFacetContract.js';
import { CORRUPTION_VECTORS, corruptibility, npcCorruptibleFlaw, npcCorruptibleVector }
  from '../../../src/domain/corruption.js';
import { npcTraitPlane, readClergyPlane, targetedFootholds } from '../../../src/domain/worldPulse/clergyTraitPlane.js';
import { flawDistortion } from '../../../src/domain/worldPulse/espionage/espionageTap.js';
import { buildPersonaSlice } from '../../../src/domain/ai/personaSlicer.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const L1_CATALOG = join(REPO_ROOT, 'src/domain/npc/paradigmAxisCatalog.js');

/** A roster NPC exactly as the generators write one: personality words, NO chart. */
const PLAIN_NPC = Object.freeze({
  personality: Object.freeze({ dominant: 'patient', flaw: 'callous', modifier: 'cautious' }),
});

/** The same person, with an authored chart — the world car L8's edit surface makes. */
const CHARTED_NPC = Object.freeze({
  personality: PLAIN_NPC.personality,
  character: Object.freeze({
    axes: Object.freeze({
      COURAGE: Object.freeze({ pole: 'virtue', level: 'defining' }),
      PRUDENCE: Object.freeze({ pole: 'vice', level: 'defining' }),
      MERCY: Object.freeze({ pole: 'vice', level: 'marked' }),
      FIDELITY: Object.freeze({ pole: 'virtue', level: 'defining' }),
    }),
  }),
});

/**
 * A FIXTURE projection standing in for L1's `wordForAxisPosition`. It is deliberately
 * NOT a mirror of the real table — it is the smallest thing that proves the path is
 * wired, so nobody can mistake it for the catalog.
 * @param {{ axisId: string, pole?: string, level?: string }} position
 */
function fixtureProject({ axisId, pole }) {
  if (axisId === 'MERCY') return { word: pole === 'vice' ? 'cruel' : 'compassionate', displaces: ['callous', 'compassionate'] };
  if (axisId === 'COURAGE') return { word: pole === 'vice' ? 'cowardly' : 'brave', displaces: ['cowardly', 'brave'] };
  return null;
}

/** A FIXTURE plane column standing in for L1's per-axis `planeLean`. */
function fixturePlane(/** @type {string} */ axisId) {
  if (axisId === 'MERCY') return { e: 0.85, c: 0 };
  if (axisId === 'PRUDENCE') return { e: 0.3, c: 0.6 };
  return null;
}

/** The lens every production caller passes today: nothing bound at all. */
const DARK_LENS = null;
/** A lens with both seams bound — the comparator proved able to see. */
const LIT_LENS = Object.freeze({ project: fixtureProject, planeOf: fixturePlane });
/** @param {Record<string, {offset:number, updatedTick:number}>} entry */
const lensWithDrift = (entry) => ({ ...LIT_LENS, driftOf: () => entry });

describe('THE DOUBLE ABSENCE — measured, not assumed', () => {
  test('no generator writes an NPC chart, so effectiveAxesOf is empty on a real roster NPC', () => {
    expect(effectiveAxesOf(PLAIN_NPC, null)).toEqual({});
    expect(effectiveAxesOf(PLAIN_NPC, undefined)).toEqual({});
    // TOTAL: garbage, null and a missing npc are one case, and that case is silence.
    expect(effectiveAxesOf(null, null)).toEqual({});
    expect(effectiveAxesOf(/** @type {any} */ ('nonsense'), null)).toEqual({});
  });

  test('a chart IS read when one exists — so the absence above is a fact, not a broken read', () => {
    const axes = effectiveAxesOf(CHARTED_NPC, null);
    expect(Object.keys(axes).sort()).toEqual(['COURAGE', 'FIDELITY', 'MERCY', 'PRUDENCE']);
  });

  test('drift moves the chart through the L2 chokepoint, not around it', () => {
    const drift = { MERCY: { offset: -1, updatedTick: 1 } };
    expect(effectiveAxesOf(CHARTED_NPC, drift).MERCY).toEqual({ pole: 'vice', level: 'defining' });
  });
});

describe('THE DESCRIPTOR RE-ROUTE — reference identity is the byte-identity proof', () => {
  const words = Object.freeze(['patient', 'callous', 'cautious']);

  test('no projection bound ⇒ THE SAME ARRAY, by reference', () => {
    const out = effectiveDescriptors({ words, npc: CHARTED_NPC, lens: DARK_LENS });
    expect(out).toBe(words);
  });

  test('a projection bound but NO chart ⇒ still the same array, by reference', () => {
    const out = effectiveDescriptors({ words, npc: PLAIN_NPC, lens: LIT_LENS });
    expect(out).toBe(words);
  });

  test('a chart whose axes the projection declines ⇒ still the same array, by reference', () => {
    const npc = { character: { axes: { INDUSTRY: { pole: 'vice', level: 'defining' } } } };
    expect(effectiveDescriptors({ words, npc, lens: LIT_LENS })).toBe(words);
  });

  test('THE COMPARATOR CAN SEE: a charted vice REPLACES the word it displaced', () => {
    const out = effectiveDescriptors({ words, npc: CHARTED_NPC, lens: LIT_LENS });
    expect(out).not.toBe(words);
    // `callous` was displaced by MERCY's vice pole; the caller's own order survives.
    expect(out).toEqual(['patient', 'cruel', 'cautious', 'brave']);
  });

  test('an axis no authored word occupied is APPENDED, codepoint-ordered', () => {
    const bare = ['patient'];
    const out = effectiveDescriptors({ words: bare, npc: CHARTED_NPC, lens: LIT_LENS });
    expect(out).toEqual(['patient', 'brave', 'cruel']);
  });

  test('drift alone can move a word — the funnel\'s whole purpose, proved end to end', () => {
    const flipped = effectiveDescriptors({
      words, npc: CHARTED_NPC, lens: lensWithDrift({ COURAGE: { offset: -6, updatedTick: 1 } }),
    });
    expect(flipped).toContain('cowardly');
    // anchored: `flipped` is asserted above to CONTAIN `cowardly`, so the list is live
    expect(flipped).not.toContain('brave');
  });

  test('a malformed word list is EMPTY, never a crash and never a guess', () => {
    expect(effectiveDescriptors({ words: /** @type {any} */ (null), npc: PLAIN_NPC, lens: LIT_LENS })).toEqual([]);
    expect(effectiveDescriptors({ words: /** @type {any} */ ('patient'), npc: PLAIN_NPC, lens: DARK_LENS })).toEqual([]);
  });

  test('a malformed list does NOT silence a chart — the caller\'s bug is not the soul\'s', () => {
    // Deliberate, and the direction matters: dropping the chart here would make a
    // caller-side shape error look like a person with no character, which is the one
    // failure this seam must never produce silently.
    expect(effectiveDescriptors({ words: /** @type {any} */ (null), npc: CHARTED_NPC, lens: LIT_LENS }))
      .toEqual(['brave', 'cruel']);
  });
});

describe('THE RISK REGISTER (R6, R8)', () => {
  test('a soul with nothing to read sits at the neutral centre with the narrowest window', () => {
    const bare = riskRegister({ npc: {} });
    expect(bare.center).toBe(NEUTRAL_RISK_CENTER);
    expect(bare.breadth).toBe(MIN_RISK_BREADTH);
  });

  test('the ABSENT terms are declared, so "nobody is desperate" reads apart from "nobody asked"', () => {
    expect(riskRegister({ npc: {} }).absent).toEqual([...RISK_TERMS]);
    expect(riskRegister({ npc: {}, desperation01: 0, disorder01: 0 }).absent).toEqual([]);
    // A supplied ZERO is supplied, not absent — the whole point of the declaration.
    expect(riskRegister({ npc: {}, desperation01: 0 }).absent).toEqual(['disorder01']);
  });

  test('⛔⛔ NULL IS NOT ZERO — every value that coerces to a finite 0 is still ABSENT', () => {
    // ⭐⭐ THE ARM THIS TEST EXISTS FOR CANNOT BE SEEN FROM `center` OR `breadth`, AND
    // THAT IS WHY THE BUG LIVED. The guard was `Number.isFinite(Number(x))`, and
    // `Number(null)`, `Number('')`, `Number(false)` and `Number([])` are all a finite 0.
    // Every one of them was therefore recorded as a SUPPLIED ZERO — and a supplied zero
    // and an absence produce the SAME centre and the SAME breadth, so the only witness
    // in the whole return value is `absent[]`.
    //
    // ⚠ A FIXTURE THAT CANNOT FIRE THE ARM PROVES NOTHING, so each value is driven
    // through the register and the verdict is read off the one field that can see it,
    // and the numeric outputs are asserted IDENTICAL at the same time — which is the
    // proof that no other assertion in this suite could have caught it.
    const bare = riskRegister({ npc: {} });
    for (const value of [null, '', false, [], undefined, NaN, Infinity, 'x', {}]) {
      const read = riskRegister({ npc: {}, desperation01: value, disorder01: value });
      expect(read.absent, `${JSON.stringify(value) ?? String(value)} must be ABSENT, not a supplied zero`)
        .toEqual([...RISK_TERMS]);
      // …and the numbers agree with the empty call, which is exactly what made the
      // old bug invisible: these two lines would have passed before the cure.
      expect(read.center).toBe(bare.center);
      expect(read.breadth).toBe(bare.breadth);
    }
  });

  test('⭐ AND THE GUARD IS DISCRIMINATING — a REAL number is never mistaken for an absence', () => {
    // The other direction, which is what stops the cure from being "declare everything
    // absent". A test that only proved absences would pass on a guard that always says
    // absent, and that guard would be just as wrong.
    expect(riskRegister({ npc: {}, desperation01: 0, disorder01: 0 }).absent).toEqual([]);
    expect(riskRegister({ npc: {}, desperation01: 1, disorder01: 1 }).absent).toEqual([]);
    expect(riskRegister({ npc: {}, desperation01: 0.5, disorder01: 0.5 }).absent).toEqual([]);
    // …and a supplied value really does move the outputs, so "supplied" is a fact about
    // the reading and not only about the list.
    expect(riskRegister({ npc: {}, desperation01: 1 }).center)
      .toBeGreaterThan(riskRegister({ npc: {} }).center);
    expect(riskRegister({ npc: {}, disorder01: 1 }).breadth)
      .toBeGreaterThan(riskRegister({ npc: {} }).breadth);
    // ⛔ THE NEGATIVE CONTROL FOR THE `Number.isFinite` HALF, which the type test alone
    // cannot cover: `typeof NaN === 'number'`, so dropping the finite check would admit
    // NaN as a supplied value and poison `center` with a NaN.
    expect(riskRegister({ npc: {}, desperation01: NaN }).absent).toContain('desperation01');
    expect(Number.isFinite(riskRegister({ npc: {}, desperation01: NaN }).center)).toBe(true);
    expect(Number.isFinite(riskRegister({ npc: {}, disorder01: Infinity }).breadth)).toBe(true);
  });

  test('COURAGE raises the centre and PRUDENCE lowers it — F15\'s named pair, both directions', () => {
    const brave = { character: { axes: { COURAGE: { pole: 'virtue', level: 'defining' } } } };
    const wary = { character: { axes: { PRUDENCE: { pole: 'virtue', level: 'defining' } } } };
    expect(riskRegister({ npc: brave }).center).toBeGreaterThan(NEUTRAL_RISK_CENTER);
    expect(riskRegister({ npc: wary }).center).toBeLessThan(NEUTRAL_RISK_CENTER);
  });

  test('the axis pair alone can move the centre by exactly ONE share, never more', () => {
    const maxed = { character: { axes: {
      COURAGE: { pole: 'virtue', level: 'defining' }, PRUDENCE: { pole: 'vice', level: 'defining' },
    } } };
    expect(riskRegister({ npc: maxed }).center).toBeCloseTo(NEUTRAL_RISK_CENTER + RISK_CENTER_SHARE, 12);
  });

  test('the APPETITE term is the estate\'s own word read, not a second spelling of it', () => {
    const bold = { personality: { flaw: 'reckless' } };
    const timid = { personality: { flaw: 'timid' } };
    expect(riskRegister({ npc: bold }).center).toBeCloseTo(NEUTRAL_RISK_CENTER + RISK_CENTER_SHARE, 12);
    expect(riskRegister({ npc: timid }).center).toBeCloseTo(NEUTRAL_RISK_CENTER - RISK_CENTER_SHARE, 12);
  });

  test('desperation pushes OUTWARD ONLY — a calm world is the absent term, not a negative one', () => {
    const calm = riskRegister({ npc: {}, desperation01: 0 }).center;
    const desperate = riskRegister({ npc: {}, desperation01: 1 }).center;
    expect(calm).toBe(NEUTRAL_RISK_CENTER);
    expect(desperate).toBeCloseTo(NEUTRAL_RISK_CENTER + RISK_CENTER_SHARE, 12);
  });

  test('all three terms at their extreme land on exactly the window edge — the derived share, proved', () => {
    const reckless = { personality: { flaw: 'reckless' }, character: { axes: {
      COURAGE: { pole: 'virtue', level: 'defining' }, PRUDENCE: { pole: 'vice', level: 'defining' },
    } } };
    expect(riskRegister({ npc: reckless, desperation01: 1 }).center).toBeCloseTo(1, 12);
    expect(RISK_CENTER_SHARE * RISK_CENTER_TERMS.length).toBeCloseTo(NEUTRAL_RISK_CENTER, 12);
  });

  test('R8 — chaos is BREADTH: the window runs from one band\'s share to half the range', () => {
    expect(riskRegister({ npc: {}, disorder01: 0 }).breadth).toBe(MIN_RISK_BREADTH);
    expect(riskRegister({ npc: {}, disorder01: 1 }).breadth).toBe(MAX_RISK_BREADTH);
    expect(MIN_RISK_BREADTH).toBeLessThan(MAX_RISK_BREADTH);
  });

  test('the centre is clamped into the window and never escapes it', () => {
    const absurd = riskRegister({ npc: { personality: { flaw: 'reckless' } }, desperation01: 99 });
    expect(absurd.center).toBeLessThanOrEqual(1);
    expect(absurd.center).toBeGreaterThanOrEqual(0);
  });
});

describe('THE CORRUPTION DEPTH GATE (F13, pack row 13(a))', () => {
  test('the gate is OWNER-UNSIGNED and defaults to the SAFER threshold', () => {
    expect(CORRUPTION_DEPTH_GATE.signedBy).toBe(null);
    expect(CORRUPTION_DEPTH_GATE.threshold).toBe('defining');
    expect(CORRUPTION_DEPTH_GATE.thresholds).toContain('marked');
  });

  test('BOTH arms are live code — a `marked` vice opens nothing by default and opens under the flip', () => {
    const marked = { character: { axes: { MERCY: { pole: 'vice', level: 'marked' } } } };
    expect(corruptibleAxisByDepth({ npc: marked })).toBe(null);
    expect(corruptibleAxisByDepth({ npc: marked, threshold: 'marked' })).toBe('MERCY');
  });

  test('a `defining` vice opens the door under EITHER threshold', () => {
    const deep = { character: { axes: { MERCY: { pole: 'vice', level: 'defining' } } } };
    expect(corruptibleAxisByDepth({ npc: deep })).toBe('MERCY');
    expect(corruptibleAxisByDepth({ npc: deep, threshold: 'marked' })).toBe('MERCY');
  });

  test('a VIRTUE at any depth opens nothing — a virtue is not a shallow vice', () => {
    const saint = { character: { axes: { MERCY: { pole: 'virtue', level: 'defining' } } } };
    expect(corruptibleAxisByDepth({ npc: saint, threshold: 'a_touch' })).toBe(null);
  });

  test('⚠ THE REACH IS SEVEN OF SEVENTEEN — an axis with no corruption vector opens nothing', () => {
    const lazy = { character: { axes: { INDUSTRY: { pole: 'vice', level: 'defining' } } } };
    expect(corruptibleAxisByDepth({ npc: lazy, threshold: 'a_touch' })).toBe(null);
    expect(CORRUPTIBLE_AXES).toHaveLength(7);
    // anchored: CORRUPTIBLE_AXES is asserted to have length 7 one line above, so it is live
    expect(CORRUPTIBLE_AXES).not.toContain('INDUSTRY');
  });

  test('an unreadable threshold refuses everything — a gate fails toward FEWER doors', () => {
    const deep = { character: { axes: { MERCY: { pole: 'vice', level: 'defining' } } } };
    expect(corruptibleAxisByDepth({ npc: deep, threshold: 'catastrophic' })).toBe(null);
  });

  test('the answer is codepoint-first, so two open doors resolve to a stable one', () => {
    const both = { character: { axes: {
      TRUST: { pole: 'vice', level: 'defining' }, CANDOR: { pole: 'vice', level: 'defining' },
    } } };
    expect(corruptibleAxisByDepth({ npc: both })).toBe('CANDOR');
  });

  test('a plain roster NPC opens nothing — the byte-identity half of the gate', () => {
    expect(corruptibleAxisByDepth({ npc: PLAIN_NPC })).toBe(null);
    expect(corruptibleAxisByDepth({ npc: PLAIN_NPC, threshold: 'a_touch' })).toBe(null);
  });

  test('drift alone can open the door — becoming reachable is the endpoint of an arc', () => {
    const drifted = corruptibleAxisByDepth({
      npc: CHARTED_NPC, lens: lensWithDrift({ MERCY: { offset: -1, updatedTick: 1 } }),
    });
    expect(corruptibleAxisByDepth({ npc: CHARTED_NPC })).toBe(null);
    expect(drifted).toBe('MERCY');
  });
});

describe('R7 — THE DERIVED ALIGNMENT READING', () => {
  test('NO COLUMN ⇒ NO CLAIM, and `claim:false` is not `true_neutral`', () => {
    const reading = derivedAlignment({ npc: CHARTED_NPC, lens: DARK_LENS });
    expect(reading.claim).toBe(false);
    expect(reading.word).toBe(null);
    expect(reading.good).toBe(null);
  });

  test('a chart whose every axis the column declines ⇒ still NO CLAIM, never a middle', () => {
    const npc = { character: { axes: { INDUSTRY: { pole: 'vice', level: 'defining' } } } };
    expect(derivedAlignment({ npc, lens: LIT_LENS }).claim).toBe(false);
  });

  test('THE COMPARATOR CAN SEE: a cruel soul reads evil-leaning and says so', () => {
    const cruel = { character: { axes: { MERCY: { pole: 'vice', level: 'defining' } } } };
    const reading = derivedAlignment({ npc: cruel, lens: LIT_LENS });
    expect(reading.claim).toBe(true);
    expect(reading.good).toBeLessThan(0);
    expect(reading.word).toBe('neutral_evil');
  });

  test('the same axis at the opposite pole reads the opposite way — the projection is signed', () => {
    const kind = { character: { axes: { MERCY: { pole: 'virtue', level: 'defining' } } } };
    expect(derivedAlignment({ npc: kind, lens: LIT_LENS }).good).toBeGreaterThan(0);
  });

  test('"he was a good man once" is mechanical — drift alone flips the word', () => {
    const kind = { character: { axes: { MERCY: { pole: 'virtue', level: 'defining' } } } };
    const before = derivedAlignment({ npc: kind, lens: LIT_LENS });
    const after = derivedAlignment({ npc: kind, lens: lensWithDrift({ MERCY: { offset: -6, updatedTick: 1 } }) });
    expect(before.word).toBe('neutral_good');
    expect(after.word).toBe('neutral_evil');
  });

  test('a null column is a GAP, not a zero — an unscored axis cannot drag the mean to the middle', () => {
    const mixed = { character: { axes: {
      MERCY: { pole: 'vice', level: 'defining' }, INDUSTRY: { pole: 'virtue', level: 'defining' },
    } } };
    const only = { character: { axes: { MERCY: { pole: 'vice', level: 'defining' } } } };
    expect(derivedAlignment({ npc: mixed, lens: LIT_LENS }).good)
      .toBe(derivedAlignment({ npc: only, lens: LIT_LENS }).good);
  });

  test('every word this table can return is a member of the editor\'s own contract', () => {
    const cells = [[1, 1], [1, 0], [1, -1], [0, 1], [0, 0], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
    for (const [law, good] of cells) expect(NPC_ALIGNMENTS).toContain(alignmentWord(law, good));
  });

  test('⚠⚠ `chaotic_good` HAS NO WORD — the fallback drops the LAW half, never the moral one', () => {
    // anchored: four positive alignmentWord rows below read members OUT of NPC_ALIGNMENTS
    expect(NPC_ALIGNMENTS).not.toContain('chaotic_good');
    expect(alignmentWord(-1, 1)).toBe('neutral_good');
    // The eight cells that DO have words are unaffected by that fallback.
    expect(alignmentWord(1, 1)).toBe('lawful_good');
    expect(alignmentWord(-1, -1)).toBe('chaotic_evil');
    expect(alignmentWord(-1, 0)).toBe('chaotic_neutral');
    expect(alignmentWord(0, 0)).toBe('true_neutral');
  });

  test('the neutral band is a third of the axis, so a small lean does not become a word', () => {
    expect(alignmentWord(0, 0.2)).toBe('true_neutral');
    expect(alignmentWord(0, 0.4)).toBe('neutral_good');
  });
});

describe('THE VETTING BAND (⟨F8⟩)', () => {
  test('an absent chart reads `ordinary` — the middle band, so no arm can fire', () => {
    expect(vettingTemperBand(undefined)).toBe('ordinary');
    expect(vettingTemperBand({})).toBe('ordinary');
    expect(vettingTemperBand({ axes: {} })).toBe('ordinary');
  });

  test('THE COMPARATOR CAN SEE: FIDELITY at either extreme moves the band', () => {
    expect(vettingTemperBand({ axes: { FIDELITY: { pole: 'virtue', level: 'defining' } } })).toBe('dutiful');
    expect(vettingTemperBand({ axes: { FIDELITY: { pole: 'vice', level: 'defining' } } })).toBe('self_serving');
  });

  test('a shallow FIDELITY reads `ordinary` — a seat refuses on a conviction, not a lean', () => {
    // ⛔ THIS BAND WAS PINNED ON THE VICE SIDE ONLY, and a mutation SURVIVED because
    // of it: loosening `value >= SPECTRUM_HALF_SPAN` to `value > 0` promotes a
    // merely-loyal man to `dutiful`, and nothing above could see it — the two rows
    // that move the band both use `defining`, and the one shallow row was a VICE.
    // The shallow band is now closed on BOTH poles, at both rungs below conviction.
    expect(vettingTemperBand({ axes: { FIDELITY: { pole: 'vice', level: 'marked' } } })).toBe('ordinary');
    expect(vettingTemperBand({ axes: { FIDELITY: { pole: 'virtue', level: 'marked' } } })).toBe('ordinary');
    expect(vettingTemperBand({ axes: { FIDELITY: { pole: 'virtue', level: 'a_touch' } } })).toBe('ordinary');
    expect(vettingTemperBand({ axes: { FIDELITY: { pole: 'vice', level: 'a_touch' } } })).toBe('ordinary');
  });

  test('every band this returns is a member of the closed vocabulary', () => {
    expect(VETTING_TEMPER_BANDS).toContain(vettingTemperBand({ axes: { FIDELITY: { pole: 'vice', level: 'defining' } } }));
    expect(VETTING_TEMPER_BANDS).toContain(vettingTemperBand({}));
    expect(VETTING_TEMPER_BANDS).toHaveLength(3);
  });
});

describe('PROVENANCE + RECONCILE PINS — the mirror cannot outlive its source silently', () => {
  test('the seam names an address, so the landing binds an import rather than running a search', () => {
    expect(PARADIGM_WORD_PROJECTION_SEAM).toContain('paradigmAxisCatalog.js');
    expect(PARADIGM_WORD_PROJECTION_SEAM).toContain('wordForAxisPosition');
  });

  test('every magnitude in this leaf is DERIVED and the module says so', () => {
    expect(CONSUMER_SEAM_PROVENANCE.signedBy).toBe(null);
    expect(CONSUMER_SEAM_PROVENANCE.ownerRows.length).toBeGreaterThanOrEqual(5);
  });

  test('R6\'s two axes must be real axes in car L1\'s catalog the moment they share a tree', () => {
    if (!existsSync(L1_CATALOG)) {
      // Anchored: the absence is asserted positively rather than skipped, and the
      // sibling that DOES exist proves the path is right (the L2/L3 idiom).
      expect(existsSync(join(REPO_ROOT, 'src/domain/npc/characterDrift.js'))).toBe(true);
      expect([RISK_CENTER_AXES.nerve, RISK_CENTER_AXES.restraint]).toEqual(['COURAGE', 'PRUDENCE']);
      return;
    }
    const source = readFileSync(L1_CATALOG, 'utf8');
    const ids = [...source.matchAll(/^\s*id: '([A-Z]+)',$/gm)].map((match) => match[1]);
    expect(ids).toContain(RISK_CENTER_AXES.nerve);
    expect(ids).toContain(RISK_CENTER_AXES.restraint);
  });

  test('the corruptible-axis reach must equal L1\'s own non-null corruption vectors', () => {
    if (!existsSync(L1_CATALOG)) {
      expect(CORRUPTIBLE_AXES).toHaveLength(7);
      expect([...CORRUPTIBLE_AXES].sort()).toEqual([...CORRUPTIBLE_AXES]);
      return;
    }
    const source = readFileSync(L1_CATALOG, 'utf8');
    const rows = [...source.matchAll(/id: '([A-Z]+)',[\s\S]*?corruptionVector: (null|'[a-z_]+')/g)];
    const scored = rows.filter((row) => row[2] !== 'null').map((row) => row[1]).sort();
    expect(scored).toEqual([...CORRUPTIBLE_AXES].sort());
  });
});

// ── THE RE-ROUTES, AGAINST THE REAL CONSUMERS ────────────────────────────────
/**
 * ⭐⭐ THE POINT OF THIS BLOCK. Car L5's whole risk is that it wires four live
 * production readers to a seam that cannot fire yet, and calls the resulting
 * sameness a proof. So each re-route is asserted THREE ways, never one:
 *
 *   1. NO LENS vs the pre-car call shape — identical, on the real reader.
 *   2. A DARK LENS (an object with nothing bound) — identical too, so a caller
 *      that starts passing a lens before the catalog lands still moves no byte.
 *   3. A LIT LENS on a CHARTED npc — DIFFERENT, which is what makes 1 and 2
 *      evidence instead of a comparator that could not have seen anything.
 */
describe('THE RE-ROUTES — three ways each, because sameness alone proves nothing', () => {
  /** A minister whose authored words the plane scores, plus a chart the lens can read. */
  const MINISTER = Object.freeze({
    id: 'npc_1', name: 'Alda', importance: 'pillar',
    personality: Object.freeze({ dominant: 'patient', flaw: 'callous', modifier: 'cautious' }),
  });
  const CHARTED_MINISTER = Object.freeze({ ...MINISTER, character: CHARTED_NPC.character });
  /** @param {object} npc */
  const settlementOf = (npc) => ({
    id: 's1',
    powerStructure: { factions: [{ id: 'temple', archetype: 'religious' }] },
    npcs: [{ ...npc, linkedFactionIds: ['temple'] }],
  });

  test('npcTraitPlane: no lens and a DARK lens agree with each other, exactly', () => {
    expect(npcTraitPlane(/** @type {any} */ (MINISTER)))
      .toEqual(npcTraitPlane(/** @type {any} */ (MINISTER), DARK_LENS));
    expect(npcTraitPlane(/** @type {any} */ (CHARTED_MINISTER), DARK_LENS))
      .toEqual(npcTraitPlane(/** @type {any} */ (MINISTER)));
  });

  test('npcTraitPlane: A LIT LENS ON A CHART MOVES IT — the comparator can see', () => {
    const before = npcTraitPlane(/** @type {any} */ (CHARTED_MINISTER), DARK_LENS);
    const after = npcTraitPlane(/** @type {any} */ (CHARTED_MINISTER), LIT_LENS);
    // `callous` (e 0.6) becomes `cruel` (e 0.85) and `brave` joins: a sharper malice.
    expect(after).not.toEqual(before);
    expect(after.e).toBeGreaterThan(before.e);
  });

  test('readClergyPlane: byte-identical without a lens and with a dark one', () => {
    const s = settlementOf(CHARTED_MINISTER);
    const plain = readClergyPlane(/** @type {any} */ (s));
    expect(JSON.stringify(readClergyPlane(/** @type {any} */ (s), DARK_LENS))).toBe(JSON.stringify(plain));
    expect(plain.weight).toBeGreaterThan(0);
  });

  test('readClergyPlane: the lit lens moves the bench reading — GAP C\'s group projection', () => {
    const s = settlementOf(CHARTED_MINISTER);
    expect(JSON.stringify(readClergyPlane(/** @type {any} */ (s), LIT_LENS)))
      .not.toBe(JSON.stringify(readClergyPlane(/** @type {any} */ (s))));
  });

  test('⚠ targetedFootholds KEEPS TRUE SIGHT and is byte-unchanged without a lens', () => {
    const s = settlementOf(CHARTED_MINISTER);
    const patron = { alignmentAxis: 'good', lawAxis: 'lawful', name: 'The Warden' };
    const rivals = [{ ref: 'd2', snapshot: { alignmentAxis: 'evil', lawAxis: 'chaotic', name: 'The Worm' } }];
    const plain = targetedFootholds(/** @type {any} */ (s), patron, rivals);
    expect(JSON.stringify(targetedFootholds(/** @type {any} */ (s), patron, rivals, DARK_LENS)))
      .toBe(JSON.stringify(plain));
    // The DIVINE branch is `effectiveCharacter` reached through the same seam — the
    // deity is never routed to `knownCharacterOf`, so a god's sight is the true chart
    // and its lens is the same lens. Proved by the reading MOVING under a lit lens.
    expect(JSON.stringify(targetedFootholds(/** @type {any} */ (s), patron, rivals, LIT_LENS)))
      .not.toBe(JSON.stringify(plain));
  });

  test('flawDistortion: no lens, a dark lens, and the pre-car reading all agree', () => {
    const bold = { personality: { flaw: 'reckless' } };
    expect(flawDistortion(bold)).toBe(flawDistortion(bold, DARK_LENS));
    expect(flawDistortion(bold)).toBeLessThan(1);
    expect(flawDistortion({ personality: { flaw: 'timid' } })).toBeGreaterThan(1);
  });

  test('flawDistortion: A CHART CAN CHANGE A MAN\'S NERVE — the comparator can see', () => {
    // Authored `cautious` reads LOW risk; a `defining` COURAGE that projects to
    // `brave` is a HIGH_RISK word, so the same man under-reads the gate instead.
    const timid = { personality: { dominant: 'cautious' }, character: CHARTED_NPC.character };
    expect(flawDistortion(timid, DARK_LENS)).toBeGreaterThan(1);
    expect(flawDistortion(timid, LIT_LENS)).toBeLessThan(1);
  });

  test('the persona surface: R7 heads the alignment chain and is null without a lens', () => {
    const entity = { id: 'npc_1', personality: { dominant: 'patient' }, alignment: 'lawful_neutral' };
    const alignmentOf = (/** @type {any} */ lens) => {
      const slice = buildPersonaSlice({ entity, entityClass: 'npc', lens });
      const row = slice.facets.find((f) => f.manifestKey === 'alignment');
      return /** @type {any} */ (row?.data)?.alignment;
    };
    expect(alignmentOf(null)).toBe('lawful_neutral');
    expect(alignmentOf(DARK_LENS)).toBe('lawful_neutral');
  });

  test('the persona surface: a charted soul\'s READING outranks its stored word', () => {
    const entity = {
      id: 'npc_1', alignment: 'lawful_neutral',
      character: { axes: { MERCY: { pole: 'vice', level: 'defining' } } },
    };
    const slice = buildPersonaSlice({ entity, entityClass: 'npc', lens: LIT_LENS });
    const row = slice.facets.find((f) => f.manifestKey === 'alignment');
    expect(/** @type {any} */ (row?.data)?.alignment).toBe('neutral_evil');
  });
});


describe('THE DEPTH GATE, END TO END — additive, dark-safe, and two vocabularies apart', () => {
  const DEEP_MERCY = { character: { axes: { MERCY: { pole: 'vice', level: 'defining' } } } };
  const DEEP_COURAGE = { character: { axes: { COURAGE: { pole: 'vice', level: 'defining' } } } };

  test('the axis map speaks VECTORS, and every one is a member of the engine\'s own set', () => {
    expect(Object.keys(CORRUPTIBLE_AXIS_VECTORS).sort()).toEqual([...CORRUPTIBLE_AXES]);
    for (const [axisId, vector] of Object.entries(CORRUPTIBLE_AXIS_VECTORS)) {
      expect(CORRUPTION_VECTORS, axisId).toContain(vector);
    }
  });

  test('a deep drifted vice hands corruption.js a VECTOR it can act on', () => {
    expect(corruptionVectorByDepth({ npc: DEEP_MERCY })).toBe('greed');
    expect(corruptionVectorByDepth({ npc: DEEP_COURAGE })).toBe('fear');
    expect(corruptionVectorByDepth({ npc: PLAIN_NPC })).toBe(null);
  });

  test('⚠ THE TWO VOCABULARIES: a fear-drifted soul is NOT recorded as greedy', () => {
    // The trap this pin exists for: `corruptionVectorForFlaw` DEFAULTS an unmapped
    // word to `greed`, so a vector routed through the flaw reader would have made
    // every drifted door a greed door. The vector arm is validated, not defaulted.
    const steady = { personality: { dominant: 'patient' } };
    expect(npcCorruptibleVector(steady, corruptionVectorByDepth({ npc: DEEP_COURAGE }))).toBe('fear');
    expect(npcCorruptibleVector(steady, 'not_a_vector')).toBe(null);
  });

  test('⭐ ADDITIVE, NEVER SUBTRACTIVE — a corruptible man stays corruptible', () => {
    const greedy = { personality: { flaw: 'greedy' } };
    expect(npcCorruptibleFlaw(greedy)).toBe('greedy');
    // No drifted door, a wrong one, and a real one all leave him eligible.
    for (const arg of [undefined, null, 'fear', 'greed']) {
      expect(npcCorruptibleVector(greedy, arg), String(arg)).toBe('greed');
      expect(corruptibility(greedy, arg), String(arg)).toBeGreaterThan(0);
    }
  });

  test('⭐ AND THE ARC RUNS FORWARD: a steady soul becomes reachable only through DEPTH', () => {
    const steady = { personality: { dominant: 'patient' } };
    expect(corruptibility(steady)).toBe(0);
    expect(corruptibility(steady, corruptionVectorByDepth({ npc: PLAIN_NPC }))).toBe(0);
    // A `marked` vice opens nothing under the SAFER default; `defining` opens it.
    const marked = { ...steady, character: { axes: { MERCY: { pole: 'vice', level: 'marked' } } } };
    expect(corruptibility(steady, corruptionVectorByDepth({ npc: marked }))).toBe(0);
    expect(corruptibility(steady, corruptionVectorByDepth({ npc: { ...steady, ...DEEP_MERCY } })))
      .toBeGreaterThan(0);
    // ...and under the OTHER owner arm the `marked` soul becomes reachable too.
    expect(corruptibility(steady, corruptionVectorByDepth({ npc: marked, threshold: 'marked' })))
      .toBeGreaterThan(0);
  });

  test('RECONCILE PIN — the vectors are PROVEN against L1, and the proof moved to ONE census', () => {
    // ⭐⭐ THIS PIN SCRAPED L1's SOURCE with a lazy quantifier — `id: '(NAME)',` then
    // whatever `corruptionVector:` came next — and carried a dead `existsSync` arm.
    // It was right, and it was right by luck of block ordering. The live equality is
    // now one row of the MIRROR CENSUS in `tests/domain/npc/paradigmAxisCatalog.test.js`,
    // which reads `PARADIGM_AXES[].corruptionVector` as VALUES and pins both the seven
    // and the ten.
    //
    // ⚠ The mirror is RETAINED on purpose: this leaf is car L5's production door, so
    // importing L1 here would light its whole table on a live path — the one thing
    // L1's own darkness walker reserves to a deliberate re-pointing.
    expect(existsSync(L1_CATALOG)).toBe(true);
    expect(Object.keys(CORRUPTIBLE_AXIS_VECTORS)).toHaveLength(7);
  });
});

// ── F10: THE `npcStates.alignment` CENSUS, WITH A DENOMINATOR ────────────────
/**
 * ⭐⭐ F10 asks car 5 to census the stored `npcStates.alignment` and its live
 * consumers, then either RE-POINT them to R7's derived read or DECLARE the field a
 * projection cache — "no third state".
 *
 * ⚠ AND THE FIRST THING THE CENSUS DID WAS CORRECT F10'S OWN PREMISE. F10 says
 * "its FOUR live consumers". Measured: THREE read sites exist, and only TWO are
 * live — `settlementPolitics.leaderAlignmentKinship` (bloc formation) and
 * `warSeatBooks.rulerAlignment` (the ruler's war-continuation bias). The third,
 * `personaSlicer.personFacets`, has ZERO importers under src/ and is unreachable
 * from the running app; it is a real, correctly-shaped reader with no call path.
 *
 * THE RULING (vetoable): the field is DECLARED A PROJECTION CACHE, and the reason
 * is measured rather than preferred. `derivedAlignment` returns `claim:false` while
 * L1's per-axis plane column is unbound, so re-pointing the two live consumers today
 * would hand bloc formation and the war layer NOTHING on every existing campaign.
 * A stored, write-once, seeded roll is also lived history under THE PROMISE. So the
 * cache stands and the pin below is what stops it and the read becoming two
 * opinions: everything R7 can say must be a word both live parsers can read.
 */
describe('F10 — THE ALIGNMENT CENSUS, and the cache declared with its reconcile pin', () => {
  const SRC = join(REPO_ROOT, 'src');
  /** @param {string} dir @param {string[]} out */
  function jsFilesUnder(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) jsFilesUnder(full, out);
      else if (/\.(js|jsx)$/.test(entry)) out.push(full);
    }
    return out;
  }
  /**
   * ⚠ COMMENTS ARE STRIPPED FIRST, and that is the difference between a census and
   * a grep. Four files in this tree carry guard COMMENTS saying they never read the
   * field ("NEVER reads npcStates.alignment (RNG-rolled)"), and a naive scan counts
   * every one of them as a reader — a denominator inflated by the very discipline
   * that keeps it honest.
   * @param {string} text
   */
  const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

  /** Files that actually READ an alignment off an npcState-shaped record. */
  function readerFilesIn(sources) {
    return sources
      .filter(([, text]) => {
        const code = stripComments(text);
        return /npcStates/.test(code) && /\.alignment\b/.test(code);
      })
      .map(([file]) => relative(REPO_ROOT, file))
      .sort();
  }
  /** @returns {Array<[string, string]>} */
  const sourcesUnderSrc = () => jsFilesUnder(SRC).map((file) => [file, readFileSync(file, 'utf8')]);

  test('THE DENOMINATOR: three read sites, enumerated, and a fourth reds', () => {
    const DISPOSITIONED = [
      // LIVE — bloc formation reads a PAIR of rulers' kinship each tick.
      'src/domain/worldPulse/settlementPolitics.js',
      // LIVE — the ruler's war-continuation vs peace-seeking bias.
      'src/domain/worldPulse/warSeatBooks.js',
      // NOT LIVE — zero importers under src/; a reader with no call path.
      'src/domain/ai/personaSlicer.js',
    ].sort();
    expect(readerFilesIn(sourcesUnderSrc())).toEqual(DISPOSITIONED);
  });

  test('⭐ THE DETECTOR IS NOT VACUOUS — a planted fourth reader is caught', () => {
    const planted = /** @type {Array<[string, string]>} */ ([
      ...sourcesUnderSrc(),
      [join(SRC, 'zz_planted.js'), 'const a = worldState.npcStates[id].alignment;'],
    ]);
    expect(readerFilesIn(planted)).toContain('src/zz_planted.js');
    // ...and a file that only COMMENTS about the field is NOT caught, which is the
    // whole reason the strip exists.
    const commented = /** @type {Array<[string, string]>} */ ([
      [join(SRC, 'zz_guard.js'), '// NEVER reads npcStates.alignment (RNG-rolled).\nexport const x = 1;'],
    ]);
    expect(readerFilesIn(commented)).toEqual([]);
  });

  test('the dead reader really is dead — personaSlicer has no production importer', () => {
    // ⭐⭐ SHARPENED AT THE SUBSTRATE COUPLING — THE SEVENTH SIGHTING OF THIS ESTATE'S
    // SUBSTRING LAW IN ONE ARC, AND THIS ONE FIRED ON A COMMENT WRITTEN TO EXPLAIN THE
    // LAW. The reader-scan eleven lines above already strips comments, and its own
    // control asserts that "a file that only COMMENTS about the field is NOT caught,
    // which is the whole reason the strip exists". This test, in the same describe,
    // was still a raw substring — so when `livedExperienceCatalog.js` gained a comment
    // naming `personaSlicer` as one of the door's production consumers, the walker
    // convicted it of IMPORTING a module it does not import.
    //
    // The claim is unchanged. An import specifier or a dereference of the module's own
    // export, over comment- and string-stripped code.
    const dependsOnSlicer = (/** @type {string} */ text) => (
      /from\s+'[^']*\/personaSlicer\.js'/.test(stripComments(text))
        || /\b(buildPersonaSlice|sliceManifestKeys|sliceCoversManifest)\s*[([.]/.test(
          // ⭐ THE PASS ORDER AND THE NEWLINE BOUND ARE BOTH LOAD-BEARING (car STRIPPER-UNIFY).
          // TEMPLATES FIRST, because an apostrophe inside backticks otherwise opens a
          // spurious single-quote span that eats every line to the next apostrophe; and
          // NEWLINE-BOUNDED quote classes, because the same apostrophe inside a
          // DOUBLE-quoted string opens that span even after the reorder. Measured over
          // src/ at this base: the landed spelling hid 1,649,119 characters of live code
          // in 377 of 2,174 files, the reorder alone still hid 1,269,249 in 266. Both
          // halves are pinned by fixtures in the anti-vacuity test below.
          stripComments(text)
            .replace(/`(?:[^`\\]|\\.)*`/g, '``')
            .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
            .replace(/"(?:[^"\\\n]|\\.)*"/g, '""'),
        )
    );
    const importers = jsFilesUnder(SRC)
      .filter((file) => !file.endsWith('personaSlicer.js'))
      .filter((file) => dependsOnSlicer(readFileSync(file, 'utf8')))
      .map((file) => relative(REPO_ROOT, file));
    expect(importers).toEqual([]);
    // ANTI-VACUITY, both directions — a scan that stopped seeing things would report
    // this module dead forever, which is the one claim this test exists to make.
    expect(dependsOnSlicer("import { buildPersonaSlice } from '../ai/personaSlicer.js';")).toBe(true);
    expect(dependsOnSlicer('const f = buildPersonaSlice({ npc });')).toBe(true);
    expect(dependsOnSlicer('// personaSlicer is a dead reader\nconst a = 1;')).toBe(false);
    expect(dependsOnSlicer("const note = 'personaSlicer.js:buildPersonaSlice (unreachable)';")).toBe(false);
    // ⭐⭐ AND THE STRIPPER'S TWO ORDERING HAZARDS ARE PINNED HERE (car STRIPPER-UNIFY).
    // Each fixture is a LITERAL built on these lines, and each goes FALSE under exactly one
    // unsound spelling that was landed on this file's base: the first under a single-quote
    // pass that runs BEFORE the template pass (an apostrophe inside backticks opens a
    // spurious span that eats the code between the two templates), the second under a quote
    // class that does NOT stop at a newline (the same apostrophe inside a double-quoted
    // string does it even after the reorder). A stripper failing either one makes every
    // dereference arm above assert on text it cannot see — vacuous green, in the direction
    // that passes.
    // ⚠ THE TWO JOINS DIFFER ON PURPOSE. The first fixture is ONE LINE, so a
    // newline-bounded quote class cannot mask the ordering defect; the second spans
    // LINES, so only the newline bound can save it. Joined the other way round, each
    // mutant survives its own fixture — measured, not reasoned (plant-out M1/M2).
    expect(dependsOnSlicer([
      "const a = `the mayor's seat`;",
      'const f = buildPersonaSlice({ npc });',
      "const b = `the guild's hall`;",
    ].join(' '))).toBe(true);
    expect(dependsOnSlicer([
      'const a = "the baron\'s men";',
      'const f = buildPersonaSlice({ npc });',
      'const b = "the guild\'s hall";',
    ].join('\n'))).toBe(true);
    // anchored: the subject really is on the tree, so the empty list is a fact about
    // its reachability rather than about a filename that matches nothing.
    expect(jsFilesUnder(SRC).some((file) => file.endsWith('personaSlicer.js'))).toBe(true);
  });

  test('⭐ WHY THE CACHE STANDS: the derived read makes NO CLAIM while the column is unbound', () => {
    // This is the measurement that decides the ruling, asserted rather than argued.
    // Re-pointing the two live consumers at a reading that says nothing would zero
    // bloc formation and the ruler bias on every existing campaign.
    expect(derivedAlignment({ npc: CHARTED_NPC, lens: DARK_LENS }).claim).toBe(false);
    expect(derivedAlignment({ npc: CHARTED_NPC, lens: DARK_LENS }).word).toBe(null);
    // ...and it is NOT vacuous: with a column bound it speaks.
    expect(derivedAlignment({ npc: CHARTED_NPC, lens: LIT_LENS }).claim).toBe(true);
  });

  test('⭐⭐ THE RECONCILE PIN: every word R7 can produce is readable by BOTH live parsers', () => {
    // The cache and the read must never become two vocabularies. Both live consumers
    // parse the stored word by SUBSTRING (`.includes('lawful')` / `('good')`), so the
    // pin is that each derived word carries a token each parser can find — otherwise
    // a future re-point hands them a word that silently bands to the neutral middle.
    const cells = [[1, 1], [1, 0], [1, -1], [0, 1], [0, 0], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
    for (const [law, good] of cells) {
      const word = alignmentWord(law, good);
      expect(NPC_ALIGNMENTS, `${law},${good}`).toContain(word);
      // A `true_neutral`/`neutral_*` word is deliberately unreadable on its law half
      // by both parsers, and both fall to 0.5 there — which is the SAME answer they
      // give the stored `true_neutral` today, so the cache's own behaviour is met.
      const lawful = word.includes('lawful') || word.includes('chaotic') || word.includes('neutral') || word.includes('true');
      const moral = word.includes('good') || word.includes('evil') || word.includes('neutral');
      expect(lawful, word).toBe(true);
      expect(moral, word).toBe(true);
    }
  });

  test('⚠ AND THE SECOND FINDING: the categorical parser has TWO homes, not one', () => {
    // `alignmentAxes` is spelled twice — settlementPolitics returns {law, good} and
    // warSeatBooks returns {lawfulness01, malice01}, INVERTED on the moral axis. They
    // agree today because both parse the same substrings, and nothing checks that
    // they keep agreeing. Named here rather than merged: re-pointing two LIVE readers
    // at one parser is a behaviour risk this car did not take, and the pin at least
    // makes the duplication visible to whoever does.
    const homes = jsFilesUnder(SRC)
      .filter((file) => /function alignmentAxes\s*\(/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(REPO_ROOT, file))
      .sort();
    expect(homes).toEqual([
      'src/domain/worldPulse/settlementPolitics.js',
      'src/domain/worldPulse/warSeatBooks.js',
    ]);
  });
});

describe('driftTaughtWithin — THE SUBJECT-SCOPED RECENCY READ (ENC-3 supply)', () => {
  // ⛔⛔ THIS SUITE EXISTS BECAUSE THE BUG IT CATCHES SHIPPED AND NO GATE SAW IT.
  //
  // The chance-meeting stage caps how often one soul may be taught by a chance
  // meeting. Its first implementation took the WHOLE drift map plus a subject id,
  // and then looped `Object.values(driftMap)` — every soul in the world — while
  // never reading the id it was handed. So the per-subject season cap answered a
  // world-wide question: if ANY npc anywhere had been taught inside the window,
  // EVERY chance meeting in the world was refused its lesson. In a populated world
  // that is very nearly always true, so the whole `met_a_foreigner` experience was
  // dead on arrival — silently, in front of the funnel, with every test green.
  //
  // The cure is structural, not a patch: the read takes ONE identity and never sees
  // a second soul's cells. THE TEST THAT WOULD HAVE CAUGHT IT is the two-subject
  // one below, and it is the reason the signature changed shape.
  const WINDOW = 13;
  const NOW = 105;
  /** Two souls in ONE world: `taught` was written inside the window, `untaught` never. */
  const TWO_SUBJECTS = Object.freeze({
    [CHARACTER_DRIFT_KEY]: {
      taught: { MERCY: { offset: -2, updatedTick: 100 } },
      untaught: { MERCY: { offset: -2, updatedTick: 10 } },
    },
  });

  test('⭐ TWO SUBJECTS, ONE WORLD: a soul taught recently does not lock out a soul who was not', () => {
    // The convicting pair. Under the world-wide scan BOTH of these read `true`,
    // because `taught` is in the same map; only a subject-scoped read separates them.
    expect(driftTaughtWithin({
      worldState: TWO_SUBJECTS, wnpcId: 'taught', now: NOW, within: WINDOW,
    })).toBe(true);
    expect(driftTaughtWithin({
      worldState: TWO_SUBJECTS, wnpcId: 'untaught', now: NOW, within: WINDOW,
    })).toBe(false);
    // ANCHORED, so the `false` above is a fact about the SUBJECT and not about a
    // world that turned out to be empty, a key that was misspelled, or a window
    // that refuses everything: the map really does hold both souls, and the read
    // really can say `true` about this very world.
    expect(Object.keys(TWO_SUBJECTS[CHARACTER_DRIFT_KEY]).sort()).toEqual(['taught', 'untaught']);
  });

  test('a soul this world has never heard of reads false rather than throwing', () => {
    expect(driftTaughtWithin({
      worldState: TWO_SUBJECTS, wnpcId: 'no_such_soul', now: NOW, within: WINDOW,
    })).toBe(false);
    // total on garbage, like every other read on this seam
    expect(driftTaughtWithin({ worldState: null, wnpcId: 'taught', now: NOW, within: WINDOW })).toBe(false);
    expect(driftTaughtWithin()).toBe(false);
  });

  test('the window is a STRICT age comparison, and a non-positive window refuses everything', () => {
    // `taught` was written at 100. At now=113 the age is exactly the window (13) and
    // the cap has expired; at 112 it has not. Both sides of the boundary are pinned,
    // so a later `<=`/`<` slip cannot pass.
    expect(driftTaughtWithin({ worldState: TWO_SUBJECTS, wnpcId: 'taught', now: 112, within: WINDOW })).toBe(true);
    expect(driftTaughtWithin({ worldState: TWO_SUBJECTS, wnpcId: 'taught', now: 113, within: WINDOW })).toBe(false);
    // A zero or negative cadence is not "refuse nothing"; it is "there is no window".
    expect(driftTaughtWithin({ worldState: TWO_SUBJECTS, wnpcId: 'taught', now: NOW, within: 0 })).toBe(false);
    expect(driftTaughtWithin({ worldState: TWO_SUBJECTS, wnpcId: 'taught', now: NOW, within: -1 })).toBe(false);
  });

  test('⛔ THE STAGE TAKES THIS READ THROUGH THE DOOR AND HOLDS NO MAP OF ITS OWN', () => {
    // The habitat claim, asserted rather than trusted: the stage must not have kept a
    // whole-map read anywhere. If either name comes back into that file the
    // world-wide scan can be written again.
    const stage = readFileSync(
      join(REPO_ROOT, 'src/domain/worldPulse/envoyChanceMeetingStage.js'), 'utf8',
    );
    expect(stage.length).toBeGreaterThan(5000);          // anchored: the real file
    expect(stage).toContain('driftTaughtWithin');
    // anchored: the toContain above proves this haystack is the live stage and still holds the door's read
    expect(stage).not.toContain('characterDriftOf');
    // anchored: same haystack, proved non-empty and correctly loaded by the toContain above
    expect(stage).not.toContain('taughtRecently');
  });
});
