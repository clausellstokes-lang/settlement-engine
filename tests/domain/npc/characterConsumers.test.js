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
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  CORRUPTIBLE_AXES,
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
  derivedAlignment,
  effectiveAxesOf,
  effectiveDescriptors,
  riskRegister,
  vettingTemperBand,
} from '../../../src/domain/npc/characterConsumers.js';
import { NPC_ALIGNMENTS } from '../../../src/domain/npc/npcFacetContract.js';

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
    const out = effectiveDescriptors({ words, npc: CHARTED_NPC, drift: null, project: null });
    expect(out).toBe(words);
  });

  test('a projection bound but NO chart ⇒ still the same array, by reference', () => {
    const out = effectiveDescriptors({ words, npc: PLAIN_NPC, drift: null, project: fixtureProject });
    expect(out).toBe(words);
  });

  test('a chart whose axes the projection declines ⇒ still the same array, by reference', () => {
    const npc = { character: { axes: { INDUSTRY: { pole: 'vice', level: 'defining' } } } };
    expect(effectiveDescriptors({ words, npc, drift: null, project: fixtureProject })).toBe(words);
  });

  test('THE COMPARATOR CAN SEE: a charted vice REPLACES the word it displaced', () => {
    const out = effectiveDescriptors({ words, npc: CHARTED_NPC, drift: null, project: fixtureProject });
    expect(out).not.toBe(words);
    // `callous` was displaced by MERCY's vice pole; the caller's own order survives.
    expect(out).toEqual(['patient', 'cruel', 'cautious', 'brave']);
  });

  test('an axis no authored word occupied is APPENDED, codepoint-ordered', () => {
    const bare = ['patient'];
    const out = effectiveDescriptors({ words: bare, npc: CHARTED_NPC, drift: null, project: fixtureProject });
    expect(out).toEqual(['patient', 'brave', 'cruel']);
  });

  test('drift alone can move a word — the funnel\'s whole purpose, proved end to end', () => {
    const flipped = effectiveDescriptors({
      words, npc: CHARTED_NPC, drift: { COURAGE: { offset: -6, updatedTick: 1 } }, project: fixtureProject,
    });
    expect(flipped).toContain('cowardly');
    expect(flipped).not.toContain('brave');
  });

  test('a malformed word list is EMPTY, never a crash and never a guess', () => {
    expect(effectiveDescriptors({ words: /** @type {any} */ (null), npc: PLAIN_NPC, project: fixtureProject })).toEqual([]);
    expect(effectiveDescriptors({ words: /** @type {any} */ ('patient'), npc: PLAIN_NPC, project: null })).toEqual([]);
  });

  test('a malformed list does NOT silence a chart — the caller\'s bug is not the soul\'s', () => {
    // Deliberate, and the direction matters: dropping the chart here would make a
    // caller-side shape error look like a person with no character, which is the one
    // failure this seam must never produce silently.
    expect(effectiveDescriptors({ words: /** @type {any} */ (null), npc: CHARTED_NPC, project: fixtureProject }))
      .toEqual(['brave', 'cruel']);
  });
});

describe('THE RISK REGISTER (R6, R8)', () => {
  test('a soul with nothing to read sits at the neutral centre with the narrowest window', () => {
    const bare = riskRegister({ npc: {}, drift: null });
    expect(bare.center).toBe(NEUTRAL_RISK_CENTER);
    expect(bare.breadth).toBe(MIN_RISK_BREADTH);
  });

  test('the ABSENT terms are declared, so "nobody is desperate" reads apart from "nobody asked"', () => {
    expect(riskRegister({ npc: {}, drift: null }).absent).toEqual([...RISK_TERMS]);
    expect(riskRegister({ npc: {}, desperation01: 0, disorder01: 0 }).absent).toEqual([]);
    // A supplied ZERO is supplied, not absent — the whole point of the declaration.
    expect(riskRegister({ npc: {}, desperation01: 0 }).absent).toEqual(['disorder01']);
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
      npc: CHARTED_NPC, drift: { MERCY: { offset: -1, updatedTick: 1 } },
    });
    expect(corruptibleAxisByDepth({ npc: CHARTED_NPC })).toBe(null);
    expect(drifted).toBe('MERCY');
  });
});

describe('R7 — THE DERIVED ALIGNMENT READING', () => {
  test('NO COLUMN ⇒ NO CLAIM, and `claim:false` is not `true_neutral`', () => {
    const reading = derivedAlignment({ npc: CHARTED_NPC, drift: null, planeOf: null });
    expect(reading.claim).toBe(false);
    expect(reading.word).toBe(null);
    expect(reading.good).toBe(null);
  });

  test('a chart whose every axis the column declines ⇒ still NO CLAIM, never a middle', () => {
    const npc = { character: { axes: { INDUSTRY: { pole: 'vice', level: 'defining' } } } };
    expect(derivedAlignment({ npc, planeOf: fixturePlane }).claim).toBe(false);
  });

  test('THE COMPARATOR CAN SEE: a cruel soul reads evil-leaning and says so', () => {
    const cruel = { character: { axes: { MERCY: { pole: 'vice', level: 'defining' } } } };
    const reading = derivedAlignment({ npc: cruel, planeOf: fixturePlane });
    expect(reading.claim).toBe(true);
    expect(reading.good).toBeLessThan(0);
    expect(reading.word).toBe('neutral_evil');
  });

  test('the same axis at the opposite pole reads the opposite way — the projection is signed', () => {
    const kind = { character: { axes: { MERCY: { pole: 'virtue', level: 'defining' } } } };
    expect(derivedAlignment({ npc: kind, planeOf: fixturePlane }).good).toBeGreaterThan(0);
  });

  test('"he was a good man once" is mechanical — drift alone flips the word', () => {
    const kind = { character: { axes: { MERCY: { pole: 'virtue', level: 'defining' } } } };
    const before = derivedAlignment({ npc: kind, planeOf: fixturePlane });
    const after = derivedAlignment({ npc: kind, drift: { MERCY: { offset: -6, updatedTick: 1 } }, planeOf: fixturePlane });
    expect(before.word).toBe('neutral_good');
    expect(after.word).toBe('neutral_evil');
  });

  test('a null column is a GAP, not a zero — an unscored axis cannot drag the mean to the middle', () => {
    const mixed = { character: { axes: {
      MERCY: { pole: 'vice', level: 'defining' }, INDUSTRY: { pole: 'virtue', level: 'defining' },
    } } };
    const only = { character: { axes: { MERCY: { pole: 'vice', level: 'defining' } } } };
    expect(derivedAlignment({ npc: mixed, planeOf: fixturePlane }).good)
      .toBe(derivedAlignment({ npc: only, planeOf: fixturePlane }).good);
  });

  test('every word this table can return is a member of the editor\'s own contract', () => {
    const cells = [[1, 1], [1, 0], [1, -1], [0, 1], [0, 0], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
    for (const [law, good] of cells) expect(NPC_ALIGNMENTS).toContain(alignmentWord(law, good));
  });

  test('⚠⚠ `chaotic_good` HAS NO WORD — the fallback drops the LAW half, never the moral one', () => {
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
    expect(vettingTemperBand({ axes: { FIDELITY: { pole: 'vice', level: 'marked' } } })).toBe('ordinary');
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
