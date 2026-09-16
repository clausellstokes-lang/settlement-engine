/**
 * proseMoveGrammar.walker.test.js — THE B-GRAMMAR WALKER's own gate.
 *
 * ── WHAT IT PROVES ─────────────────────────────────────────────────────────────────
 * That every arm fires on a control built to make it fire, and stays silent on a control
 * built to make it silent. Four negative controls, one positive, and one per arm the chair's
 * sitting owed (B2, D, F, G, H, C-sibling) — plus the three-numbers arms and the ten gaps.
 *
 * ⛔ ARM A DOES NOT GATE THE CORPUS HERE, and the reason is measured, not cautious. The
 * classifier agrees with a hand-tagged sample on 20 of 24 (0.83), or 18 of 24 (0.75) counting
 * the two tags this lane revised after seeing its output. MOVE-GRAMMAR §4.1 item 3 says in
 * as many words that the classifier's precision is measured on a hand-tagged sample BEFORE
 * it gates anything. At 0.75–0.83 it is good enough to REPORT a distribution and not good
 * enough to fail a pool on one reading. The corpus figures it produces are printed and
 * carried to the chair; the gate is on the INSTRUMENT.
 *
 * ── CONTROL 4's CALIBRATION IS EXACT ───────────────────────────────────────────────
 * The sitting re-cut MOVE-GRAMMAR §4.4's control 4 at 407/708 and asked for the SEGMENT
 * DEFINITION to be pinned in writing. It is pinned in `grammarWalker.segmentCount`'s doc, and
 * this file asserts both of PROBE_ALL's figures — 407/708 uniform and 79/708 repeated-opener
 * — as exact integers. A calibration that reproduces to the unit is a walker reading the same
 * corpus the probe read.
 *
 * @see src/domain/prose/grammarWalker.js
 * @see src/domain/prose/moveGrammar.js
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  armA, armE, armESpread, armF, armF10, armG, armThreeNumbers, armsB, ceilingFor, entropyOf,
  openerOf, openingShape, runCeilingFor, segmentCount, tenseOf, walkGrammar, wallScopeCensus,
} from '../../src/domain/prose/grammarWalker.js';
import {
  classifyMoves, CLAUSE_DETECTORS, clauseUnits, GRAMMAR_TAG_CONTRACT, LEVEL1_ORDERS, NON_MOVES,
  orderIdOf, readGrammar, WALLS,
} from '../../src/domain/prose/moveGrammar.js';
import { fingerprint, RATE_METRICS, scoreAgainstBands } from '../../src/domain/prose/proseFingerprint.js';
import { typedFactsOf } from '../../src/domain/prose/entryWalker.js';
import {
  ARM_CONTROLS, ARM_D_CONTROL, ARM_D_PAIR_CONTROL, CHAIR_CEILINGS, CHAIR_THREE_NUMBERS,
  C_SIBLING_CONTROL, fairDraw, HAND_TAGGED, OWNER_TEMPLATE_SEQUENCE, ROTA_SEQUENCE,
  SYNTHETIC_BANDS, TAGGED_POOL,
} from '../fixtures/grammarControls.js';
import { loadCausalLeaf, loadStateLeaves, poolCells, ROOT } from '../helpers/dossierCorpus.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { composedFillByBlock, fillSites } from '../helpers/dossierComposedFill.js';

/** @param {import('../../src/domain/prose/grammarWalker.js').GrammarReport} r */
const armsThatFailed = (r) => [...new Set(r.fails.map((f) => f.arm))].sort();

describe('the ceilings — read from n, never fixed', () => {
  it('is min(1/n + 0.10, 1.5/n) for n ≥ 3 and NOT-EXECUTABLE at n ≤ 2', () => {
    expect(ceilingFor(1, CHAIR_CEILINGS)).toBeNull();
    expect(ceilingFor(2, CHAIR_CEILINGS)).toBeNull();
    expect(ceilingFor(3, CHAIR_CEILINGS)).toBeCloseTo(0.4333, 4);
    expect(ceilingFor(4, CHAIR_CEILINGS)).toBeCloseTo(0.35, 4);
    expect(ceilingFor(5, CHAIR_CEILINGS)).toBeCloseTo(0.30, 4);
    // At n = 6 the old fixed 0.35 is 2.1x uniform; the formula holds 1.5x.
    expect(ceilingFor(6, CHAIR_CEILINGS)).toBeCloseTo(0.25, 4);
    expect(ceilingFor(8, CHAIR_CEILINGS)).toBeCloseTo(0.1875, 4);
    for (const n of [3, 4, 5, 6, 8, 12, 20]) {
      expect(ceilingFor(n, CHAIR_CEILINGS) / (1 / n)).toBeLessThanOrEqual(1.6 + 1e-9);
    }
  });

  it('the run ceiling is 1/n + 2 SE, floored at 1/n + 0.05, never a fixed slack', () => {
    // On a 40-line sample the SE term is large and the floor does not bind.
    expect(runCeilingFor(4, 40, CHAIR_CEILINGS)).toBeGreaterThan(0.25 + 0.05);
    // On a large sample the floor binds instead.
    expect(runCeilingFor(4, 100000, CHAIR_CEILINGS)).toBeCloseTo(0.30, 3);
    expect(runCeilingFor(1, 40, CHAIR_CEILINGS)).toBeNull();
  });
});

describe('the four negative controls and the positive one (MOVE-GRAMMAR §4.4, as the sitting re-cut them)', () => {
  it('CONTROL 1 — the owner\'s own template reds on arm A and arm B1', () => {
    const a = armA(OWNER_TEMPLATE_SEQUENCE, 'control-1', 4, CHAIR_CEILINGS);
    const b = armsB(OWNER_TEMPLATE_SEQUENCE, 'control-1', 4, CHAIR_CEILINGS);
    expect(a.fails.map((f) => f.arm)).toContain('A');
    expect(a.fails[0].value).toBe(1);
    expect(b.fails.map((f) => f.arm)).toContain('B1');
    expect(b.figures.runRate).toBe(1);
  });

  it('CONTROL 2 — the rota PASSES A and B1 and REDS on B3, which is the whole point of it', () => {
    const a = armA(ROTA_SEQUENCE, 'control-2', 4, CHAIR_CEILINGS);
    const b = armsB(ROTA_SEQUENCE, 'control-2', 4, CHAIR_CEILINGS);
    expect(a.fails).toEqual([]);
    // anchored: the very next line asserts B3 IS in this same list, so an empty or dead list cannot pass
    expect(b.fails.map((f) => f.arm)).not.toContain('B1');
    expect(b.fails.map((f) => f.arm)).toContain('B3');
    // Every successor is deterministic, so every transition row is at 1.0 and zero bits.
    const rows = /** @type {any[]} */ (b.figures.transitions);
    expect(rows.every((r) => r.topShare === 1)).toBe(true);
    expect(rows.every((r) => r.entropy === 0)).toBe(true);
  });

  it('CONTROL 4 — today\'s R1 leaves reproduce PROBE_ALL\'s two figures EXACTLY, with the segment definition pinned', async () => {
    const leaves = await loadStateLeaves();
    const cells = poolCells(leaves);
    let uniformSegments = 0;
    let repeatedOpener = 0;
    for (const pool of cells.values()) {
      if (new Set(pool.map((v) => segmentCount(v.text))).size === 1) uniformSegments += 1;
      if (new Set(pool.map((v) => openerOf(v.text))).size < pool.length) repeatedOpener += 1;
    }
    expect(cells.size).toBe(708);
    // SITTING B.3 / Part B §14: 407 of 708, not the 408 MOVE-GRAMMAR §0 first printed.
    expect(uniformSegments).toBe(407);
    expect(repeatedOpener).toBe(79);
    expect(uniformSegments / cells.size).toBeCloseTo(0.575, 3);
    expect(repeatedOpener / cells.size).toBeCloseTo(0.112, 3);
  });

  it('CONTROL 4, SECOND HALF — the R1 leaves RED ON ARM E, which is what the control actually says', async () => {
    // ⛔ THE CALIBRATION ABOVE IS NOT THE CONTROL. It re-measures 407/708 and 79/708 through
    // `segmentCount` and `openerOf` — two helpers — while MOVE-GRAMMAR §4.4 control 4 says
    // today's R1 leaves must RED on ARM E. Arm E had no fail channel at all, so the control
    // was being met by a different instrument. `armESpread` is that channel, and this is the
    // control executed on the arm.
    const leaves = await loadStateLeaves();
    const report = walkGrammar({
      corpus: leaves, cells: poolCells(leaves), register: 'dossier', ceilings: CHAIR_CEILINGS,
    });
    const spreadFails = report.fails.filter((f) => f.arm === 'E/spread');
    console.log(`\nCONTROL 4 · arm E over the R1 leaves\n${spreadFails.map((f) => `  RED  ${f.detail}`).join('\n')}\n`);
    expect(spreadFails.length).toBeGreaterThan(0);
    expect(spreadFails.map((f) => f.detail).join(' ')).toMatch(/uniformSegments/);
    expect(spreadFails.map((f) => f.detail).join(' ')).toMatch(/repeatedOpener/);
    // The arm reads the SAME pools the calibration counted, to the unit.
    const figures = /** @type {any} */ (report.figures.spread);
    expect(figures.pools).toBe(708);
    expect(Math.round(figures.uniformSegmentShare * 708)).toBe(407);
    expect(Math.round(figures.repeatedOpenerShare * 708)).toBe(79);
  });

  it('ARM E is NOT-EXECUTABLE without spread ceilings — never a pass on a number it invented', () => {
    const rows = [{ pool: 'p', uniformGrammar: true, uniformSegments: true, dup: 1 }];
    const bare = armESpread(rows, 'no-ceilings', { slack: 0.1, ratioCap: 1.5, runFloor: 0.05, successorCeiling: 0.5 });
    expect(bare.fails).toEqual([]);
    expect(bare.notExecutable.map((x) => x.arm)).toEqual(['E/spread']);
    // anchored: the same rows WITH ceilings do fail, so the silence above is the missing
    // number and not a dead arm
    expect(armESpread(rows, 'ceilinged', CHAIR_CEILINGS).fails.length).toBeGreaterThan(0);
    // and a clean register passes both
    const clean = Array.from({ length: 100 }, (_, i) => ({ pool: `p${i}`, uniformGrammar: false, uniformSegments: false, dup: 0 }));
    expect(armESpread(clean, 'clean', CHAIR_CEILINGS).fails).toEqual([]);
  });

  it('CONTROL 5 (POSITIVE) — a fair draw over n orders passes every arm', () => {
    const n = 6;
    const sequence = fairDraw(n, 600);
    const a = armA(sequence, 'control-5', n, CHAIR_CEILINGS);
    const b = armsB(sequence, 'control-5', n, CHAIR_CEILINGS);
    expect(a.fails).toEqual([]);
    expect(b.fails).toEqual([]);
    const top = /** @type {any[]} */ (a.figures.histogram)[0];
    expect(top.share).toBeLessThan(Number(ceilingFor(n, CHAIR_CEILINGS)));
    expect(Number(b.figures.runRate)).toBeLessThan(Number(b.figures.runCeiling));
  });

  it('CONTROL B2 — silent on a fair draw, and it FIRES on a sequence above the chance floor', () => {
    // ⛔ THE SILENT HALF WAS THE WHOLE CONTROL, AND IT COULD NOT HAVE FAILED. B2's note used
    // to need `runRate > 2/n` AND `runRate <= 1/n + 2 SE` — an empty window unless n > 20.
    // The chair's own wording is "no adjacent same order ABOVE the chance floor", and at the
    // floor the window is reachable. Both halves are asserted here.
    const fair = armsB(fairDraw(4, 400, 99), 'control-b2-silent', 4, CHAIR_CEILINGS);
    expect(fair.notes.filter((note) => note.arm === 'B2')).toEqual([]);
    expect(Number(fair.figures.chanceFloor)).toBeCloseTo(0.25, 6);
    // A sequence that repeats a little more than chance: 4 orders, 40 pairs, 13 repeats
    // (32.5% against a 25% floor) — above the floor and inside B1's 1/n + 2 SE ceiling
    // (0.387 at these numbers), which is exactly the window the old `2/n` threshold made
    // empty.
    /** @type {string[]} */
    const loop = [];
    let k = 0;
    for (let i = 0; i < 41; i += 1) {
      if (i > 0 && i % 3 === 0) loop.push(loop[i - 1]);
      else { loop.push(`O${k % 4}`); k += 1; }
    }
    const b = armsB(loop, 'control-b2-fires', 4, CHAIR_CEILINGS);
    const fired = b.notes.filter((note) => note.arm === 'B2');
    expect(fired.length).toBe(1);
    expect(Number(b.figures.runRate)).toBeGreaterThan(Number(b.figures.chanceFloor));
    expect(Number(b.figures.runRate)).toBeLessThanOrEqual(Number(b.figures.runCeiling));
    expect(b.fails.filter((f) => f.arm === 'B1')).toEqual([]);
  });

  it('CONTROL H — n ≤ 2 declares NOT-EXECUTABLE and never a pass', () => {
    const a = armA(['O0', 'O1', 'O0', 'O1'], 'control-h', 2, CHAIR_CEILINGS);
    expect(a.fails).toEqual([]);
    expect(a.notExecutable.map((x) => x.arm)).toEqual(['A']);
    expect(armE([{ id: 'x', text: 'One variant.' }], 'pool-of-one').notExecutable).toHaveLength(1);
  });
});

describe('arms F and G — one control each, every one of which must fire', () => {
  for (const control of ARM_CONTROLS) {
    it(`${control.arm} fires on: ${control.expect}`, () => {
      const entry = { id: `control::${control.arm}`, text: control.text };
      const moves = classifyMoves(control.text);
      const found = control.arm.startsWith('G')
        ? armG(entry).map((f) => f.arm)
        : armF(entry, moves, 'dossier').map((f) => f.arm);
      expect(found).toContain(control.arm);
    });
  }

  it('the wall scoping is the sitting\'s, not the spec\'s original — five of ten are register-bound', () => {
    const scoped = WALLS.filter((w) => !w.scope.includes('*')).map((w) => w.id).sort((a, b) => a - b);
    expect(scoped).toEqual([4, 5, 6, 8, 9, 10]);
    // Wall 6 is the dossier's; a chrome unit of three sentences is not its business.
    const chrome = armF({ id: 'c', text: 'One. Two. Three.' }, ['PRESENT'], 'chrome');
    const dossier = armF({ id: 'd', text: 'One. Two. Three.' }, ['PRESENT'], 'dossier');
    // anchored: the next line asserts F6 DOES fire on the identical text in the dossier register
    expect(chrome.map((f) => f.arm)).not.toContain('F6');
    expect(dossier.map((f) => f.arm)).toContain('F6');
  });

  it('arm G stays silent on a licensed record sentence', () => {
    expect(armG({ id: 'clean', text: 'The hall keeps the rolls of freemen, and the roll is current.' })).toEqual([]);
  });
});

describe('arm D and C-sibling — the controls the sitting owed', () => {
  it('arm D fails a variant naming a slot the bag does not offer, and passes one that does not', () => {
    const composedFill = new Map([['B', ARM_D_CONTROL.bag]]);
    const passes = walkGrammar({
      corpus: [{ id: 'ok', text: ARM_D_CONTROL.passes, block: 'B' }],
      composedFill,
      register: 'dossier',
    });
    const fails = walkGrammar({
      corpus: [{ id: 'bad', text: ARM_D_CONTROL.fails, block: 'B' }],
      composedFill,
      register: 'dossier',
    });
    expect(passes.fails.filter((f) => f.arm === 'D')).toEqual([]);
    expect(fails.fails.filter((f) => f.arm === 'D')).toHaveLength(1);
  });

  it('arm D resolves TWO POOLS OF ONE BLOCK differently — gap (e), keyed on (block, pool)', () => {
    const { block, wide, narrow, text, wideBag, narrowBag } = ARM_D_PAIR_CONTROL;
    // The map the estate's own resolver would build once it is keyed per pool: one block,
    // two pools, two licences.
    const composedFill = new Map([
      [`${block} :: ${wide}`, wideBag],
      [`${block} :: ${narrow}`, narrowBag],
      // The BLOCK-wide bag is the superset, and it is what the walker used to read for both.
      [block, wideBag],
    ]);
    const onWide = walkGrammar({
      corpus: [{ id: 'w', text, block, pool: wide }], composedFill, register: 'dossier',
    });
    const onNarrow = walkGrammar({
      corpus: [{ id: 'n', text, block, pool: narrow }], composedFill, register: 'dossier',
    });
    // SAME BLOCK, SAME TEXT, TWO VERDICTS — which is the whole of gap (e).
    expect(onWide.fails.filter((f) => f.arm === 'D')).toEqual([]);
    expect(onNarrow.fails.filter((f) => f.arm === 'D')).toHaveLength(1);
    expect(onNarrow.fails.find((f) => f.arm === 'D').detail).toContain('(block, pool)');
    // anchored: the pair above proves the per-pool key is read; this proves the BLOCK key is
    // still the fallback, so a caller holding only block-level bags keeps working.
    const blockOnly = walkGrammar({
      corpus: [{ id: 'b', text, block, pool: 'a-pool-the-map-does-not-carry' }],
      composedFill,
      register: 'dossier',
    });
    expect(blockOnly.fails.filter((f) => f.arm === 'D')).toEqual([]);
    expect(blockOnly.notExecutable.filter((f) => f.arm === 'D')).toEqual([]);
  });

  it('arm D declares NOT-EXECUTABLE when no bag is supplied, never a pass', () => {
    const r = walkGrammar({ corpus: [{ id: 'x', text: 'The {institution} keeps the rolls.', block: 'B' }] });
    expect(r.fails.filter((f) => f.arm === 'D')).toEqual([]);
    expect(r.notExecutable.some((x) => x.arm === 'D')).toBe(true);
  });

  it('C-sibling reds on two variants banding one noun differently, and passes an honest difference', () => {
    /** @param {ReadonlyArray<string>} texts */
    const cell = (texts) => new Map([['cell', texts.map((text, i) => ({ id: `v${i}`, text, poolId: 'cell' }))]]);
    const bad = walkGrammar({ corpus: [], cells: cell(C_SIBLING_CONTROL.conflicting) });
    const good = walkGrammar({ corpus: [], cells: cell(C_SIBLING_CONTROL.lawful) });
    expect(bad.fails.filter((f) => f.arm === 'C-sibling')).toHaveLength(1);
    expect(good.fails.filter((f) => f.arm === 'C-sibling')).toEqual([]);
    // The lawful pair differs by OMISSION, which is what a pool of standpoints is for.
    expect(Object.keys(typedFactsOf({ id: 'b', text: C_SIBLING_CONTROL.lawful[1] }).bands)).toEqual([]);
  });
});

describe('THE WALLS WITH NO DETECTOR — declared, never silent (MOVE-GRAMMAR §4.4.1)', () => {
  it('emits a NOT-EXECUTABLE row for every undetected wall, with what a detector would need', () => {
    const rows = wallScopeCensus('dossier');
    expect(rows.map((r) => r.arm).sort()).toEqual(['F4', 'F5', 'F7', 'F8', 'F9']);
    for (const row of rows) {
      expect(row.detail).toContain('NOT-EXECUTABLE');
      expect(row.detail).toContain('Wanted:');
      expect(row.detail).toMatch(/IN SCOPE HERE|out of this register/);
    }
    // ⭐ WALL 10 IS ABSENT FROM THE ROSTER BECAUSE IT NOW HAS A DETECTOR. SITTING §L.2 item
    // 65 charters one "if it is one arm with one control", and the opener shape already
    // computed the token, so the wall is a count plus an adjacency over one pool.
    // anchored: the roster is pinned to five named arms above, so an empty roster cannot pass
    expect(rows.map((r) => r.arm)).not.toContain('F10');
    // and wall 10 IS in the WALLS list — it is absent from the roster because it is detected,
    // not because the wall went away.
    expect(WALLS.map((w) => w.id)).toContain(10);
    expect(armF10([
      { id: 'a', text: '{settlement} keeps its own rolls.' },
      { id: 'b', text: '{settlement} pays its toll at the bridge.' },
    ], 'detector-live').length).toBeGreaterThan(0);
    // and the roster reaches a whole walk
    const report = walkGrammar({ corpus: [{ id: 'x', text: 'The granary stands half full.' }], register: 'dossier' });
    expect(report.notExecutable.filter((x) => /^F\d+$/.test(x.arm)).map((x) => x.arm).sort())
      .toEqual(['F4', 'F5', 'F7', 'F8', 'F9']);
  });

  it('WALL 10 fires on more than one settlement-token opener in a pool, and on two adjacent', () => {
    const v = (id, text) => ({ id, text });
    const one = armF10([v('a', '{settlement} keeps its own rolls.'), v('b', 'The hall keeps the rolls.')], 'pool-1');
    expect(one).toEqual([]);
    const two = armF10([
      v('a', '{settlement} keeps its own rolls.'),
      v('b', 'The hall keeps the rolls.'),
      v('c', '{settlement} pays its toll at the bridge.'),
    ], 'pool-2');
    expect(two).toHaveLength(1);
    expect(two[0].arm).toBe('F10');
    expect(two[0].detail).toContain('at most one per pool');
    const adjacent = armF10([
      v('a', '{settlement} keeps its own rolls.'),
      v('b', '{settlement} pays its toll at the bridge.'),
    ], 'pool-3');
    // Two openers AND two adjacent: the count row and the adjacency row are different rows.
    expect(adjacent).toHaveLength(2);
    expect(adjacent.map((f) => f.detail).join(' ')).toContain('never two adjacent');
  });
});

describe('ARM A gates the TAG and reports the classifier (SITTING K.2, §L.2 item 67) — U5\'s fixture', () => {
  it('reads the TAG on a tagged pool: the tagged half FAILS and the untagged half only reports', () => {
    const tagged = walkGrammar({
      corpus: TAGGED_POOL,
      register: 'dossier',
      ceilings: CHAIR_CEILINGS,
      admissible: { 'dossier · level 1': 4 },
    });
    const level1 = /** @type {any} */ (tagged.figures.level1);
    // Arm A read the TAG: four variants, one tag, share 1.0 against a 0.35 ceiling at n = 4.
    expect(level1.tagged).toBe(4);
    expect(level1.untagged).toBe(0);
    expect(level1.taggedHistogram).toEqual([['V1', 4]]);
    const aFails = tagged.fails.filter((f) => f.arm === 'A');
    expect(aFails).toHaveLength(1);
    expect(aFails[0].value).toBe(1);
    // ⭐ THE PROOF THAT IT READ THE TAG AND NOT THE CLASSIFIER: the classifier reads MORE
    // than one order over these four texts, so a walker scoring the classifier would have
    // found a lower top share and no fail at all.
    const classified = new Set(TAGGED_POOL.map((v) => classifyMoves(v.text).join('→')));
    expect(classified.size).toBeGreaterThan(1);
    // The classifier's disagreement with the tag is REPORTED, in the channel that never gates.
    expect(tagged.withheld.some((w) => w.arm === 'A/tag')).toBe(true);
    expect(tagged.fails.some((f) => f.arm === 'A/tag')).toBe(false);
  });

  it('is REPORT-ONLY on the shipped corpus, because the tag is applied to nothing', async () => {
    const leaves = (await loadStateLeaves()).slice(0, 300);
    const report = walkGrammar({
      corpus: leaves, register: 'dossier', ceilings: CHAIR_CEILINGS,
    });
    // No tagged variant exists, so the gating half has n = 0 and declares itself
    // NOT-EXECUTABLE rather than passing an empty set.
    expect(report.fails.filter((f) => f.arm === 'A')).toEqual([]);
    expect(report.notExecutable.some((x) => x.arm === 'A')).toBe(true);
    // The untagged half still measures and prints, in the note channel.
    const level1 = /** @type {any} */ (report.figures.level1);
    expect(level1.untagged).toBe(300);
    expect(level1.tagged).toBe(0);
    expect(/** @type {any} */ (level1.untaggedFigures).histogram.length).toBeGreaterThan(1);
  });
});

describe('the owner\'s three numbers as arms (§912.3)', () => {
  /** A unit whose prose is bland enough to sit inside every synthetic band. */
  const inside = [
    'The hall keeps the rolls of freemen and the roll is current this season.',
    'The granary stands half full and the toll bar is manned each morning by the watch.',
    'Grain moves out along the road and the market square fills twice a week without fail.',
  ];
  /** The same unit, pushed outside several bands at once. */
  const outside = [
    'The hall keeps the rolls; the roll is current; the clerk is paid; the seal is kept.',
    'The granary stands half full; the toll bar is manned; the watch is doubled; the gate holds.',
    'Grain moves out; the market fills; the quay is busy; the road is kept; the bridge stands.',
  ];

  it('BUDGET FAILS above a third and NOTES above a sixth — both channels driven, on bands built to drive them', () => {
    // ⛔ THE FIRST CUT ASSERTED `scored > 10` AND `exceeded.length > 0` AND NOTHING ELSE, so
    // it could not tell a BUDGET fail from a BUDGET note from silence. The arm has three
    // outcomes and all three are driven here, each on a band set chosen to produce it.
    const metrics = Object.keys(fingerprint(outside).metrics);
    /** @param {number} howMany bands narrowed to a point the unit cannot sit inside */
    const bandsExceeding = (howMany) => Object.fromEntries(metrics.map((m, i) => [
      m, i < howMany ? { lo: -2, hi: -1 } : { lo: -1e6, hi: 1e6 },
    ]));
    const total = metrics.length;
    // ABOVE A THIRD → FAIL.
    const fail = armThreeNumbers(outside, bandsExceeding(Math.ceil(total / 2)), CHAIR_THREE_NUMBERS, 'budget-fail');
    expect(fail.fails.filter((f) => f.arm === 'BUDGET')).toHaveLength(1);
    expect(Number(fail.fails.find((f) => f.arm === 'BUDGET').value)).toBeGreaterThan(1 / 3);
    // BETWEEN A SIXTH AND A THIRD → NOTE, never a fail.
    const note = armThreeNumbers(outside, bandsExceeding(Math.round(total * 0.25)), CHAIR_THREE_NUMBERS, 'budget-note');
    expect(note.fails.filter((f) => f.arm === 'BUDGET')).toEqual([]);
    expect(note.notes.filter((n) => n.arm === 'BUDGET')).toHaveLength(1);
    // BELOW A SIXTH → silent on BUDGET (the PERFECTION arm speaks instead at zero).
    const quiet = armThreeNumbers(outside, bandsExceeding(1), CHAIR_THREE_NUMBERS, 'budget-quiet');
    expect(quiet.fails.filter((f) => f.arm === 'BUDGET')).toEqual([]);
    expect(quiet.notes.filter((n) => n.arm === 'BUDGET')).toEqual([]);
    // And the original synthetic-band control still exceeds something, so it remains a control.
    const r = armThreeNumbers(outside, SYNTHETIC_BANDS, CHAIR_THREE_NUMBERS, 'outside');
    expect(Number(/** @type {any} */ (r.figures).scored)).toBeGreaterThan(10);
    expect(/** @type {any[]} */ (/** @type {any} */ (r.figures).exceeded).length).toBeGreaterThan(0);
  });

  it('DEPTH fails past 0.5 band-widths and exempts a DECLARED defining feature', () => {
    const bands = { 'punctuation.semicolonRate': { lo: 0.00, hi: 0.02 } };
    const metrics = { 'punctuation.semicolonRate': 0.5 };
    const { exceeded } = scoreAgainstBands(metrics, bands);
    expect(exceeded).toHaveLength(1);
    expect(exceeded[0].depth).toBeGreaterThan(0.5);
    const strict = armThreeNumbers(outside, bands, CHAIR_THREE_NUMBERS, 'strict');
    const exempt = armThreeNumbers(outside, bands, {
      ...CHAIR_THREE_NUMBERS, definingFeatures: ['punctuation.semicolonRate'],
    }, 'exempt');
    expect(strict.fails.some((f) => f.arm === 'DEPTH')).toBe(true);
    expect(exempt.fails.some((f) => f.arm === 'DEPTH')).toBe(false);
    expect(exempt.notes.some((n) => n.arm === 'DEPTH')).toBe(true);
  });

  it('the PERFECTION CEILING flags a unit inside every band — a finding, never a fail', () => {
    const r = armThreeNumbers(inside, SYNTHETIC_BANDS, CHAIR_THREE_NUMBERS, 'inside');
    const perfect = /** @type {any[]} */ (/** @type {any} */ (r.figures).exceeded).length === 0;
    if (perfect) {
      expect(r.notes.some((n) => n.arm === 'PERFECTION')).toBe(true);
      expect(r.fails.some((f) => f.arm === 'PERFECTION')).toBe(false);
    }
    // Whether this particular prose lands inside every synthetic band is not the claim; the
    // claim is that a zero-exceedance unit is FLAGGED and never FAILED, and that is asserted
    // directly on a hand-built zero case below.
    const zero = armThreeNumbers(
      ['The hall keeps the rolls of freemen and the roll is current this season.'
        + ' The clerk is paid by the quarter and the seal is kept in the strongbox.'],
      { 'shapes.triadRate': { lo: 0.0, hi: 1.0 } },
      CHAIR_THREE_NUMBERS,
      'zero',
    );
    expect(zero.notes.map((n) => n.arm)).toContain('PERFECTION');
    expect(zero.fails).toEqual([]);
  });

  it('every three-numbers arm is NOT-EXECUTABLE without bands, and says so', () => {
    const r = armThreeNumbers(inside, {}, CHAIR_THREE_NUMBERS, 'no-bands');
    expect(r.fails).toEqual([]);
    expect(r.notExecutable).toHaveLength(1);
    expect(r.notExecutable[0].arm).toBe('three-numbers');
  });

  it('SPREAD names WHICH rules a unit exceeds, and TWO UNITS EXCEEDING THE SAME RULES ARE VISIBLE AS SUCH', () => {
    // ⛔ `expect(Array.isArray(spread)).toBe(true)` PASSES ON AN EMPTY ARRAY, so the old
    // assertion held on a walker whose SPREAD figure had gone dark. §912.3 item 4 says the
    // walker prints WHICH rules each pool exceeds so that uniform imperfection — every pool
    // breaking the same rules — is visible as the template it is. That is a claim about
    // CONTENT, and it is asserted on content here.
    const metrics = Object.keys(fingerprint(outside).metrics);
    const pinned = [metrics[0], metrics[1]];
    const bands = Object.fromEntries(metrics.map((m) => [
      m, pinned.includes(m) ? { lo: -2, hi: -1 } : { lo: -1e6, hi: 1e6 },
    ]));
    const a = armThreeNumbers(outside, bands, CHAIR_THREE_NUMBERS, 'spread-a');
    const b = armThreeNumbers(inside, bands, CHAIR_THREE_NUMBERS, 'spread-b');
    const spreadA = /** @type {string[]} */ (/** @type {any} */ (a.figures).spread);
    const spreadB = /** @type {string[]} */ (/** @type {any} */ (b.figures).spread);
    expect(spreadA).toEqual([...pinned].sort());
    // UNIFORM IMPERFECTION: two different units exceeding exactly the same rules.
    expect(spreadB).toEqual(spreadA);
    // anchored: the two lines above prove the figure carries names; this proves it is not a
    // constant — a unit inside every band exceeds nothing and its spread is empty.
    const none = armThreeNumbers(outside, Object.fromEntries(metrics.map((m) => [m, { lo: -1e6, hi: 1e6 }])), CHAIR_THREE_NUMBERS, 'spread-none');
    expect(/** @type {string[]} */ (/** @type {any} */ (none.figures).spread)).toEqual([]);
  });
});

describe('the fingerprint — one ruler for the estate and the exemplars', () => {
  it('computes all twenty-one rate metrics', () => {
    const fp = fingerprint([
      'The hall keeps the rolls of freemen; the roll is current. The clerk is paid by the quarter.',
      'Grain moves out along the road, and the market square fills twice a week.',
    ]);
    expect(fp.sentences).toBeGreaterThan(2);
    expect(Object.keys(fp.metrics).sort()).toEqual([...RATE_METRICS].sort());
  });

  it('refuses to score a zero-width band rather than reporting an infinite depth', () => {
    const { unscorable, exceeded } = scoreAgainstBands(
      { 'shapes.triadRate': 0.5 },
      { 'shapes.triadRate': { lo: 0.1, hi: 0.1 } },
    );
    expect(unscorable).toContain('shapes.triadRate');
    expect(exceeded).toEqual([]);
  });
});

describe('the classifier — measured against a hand-tagged sample, and printed', () => {
  it('agrees with the hand tags at a rate this test PRINTS rather than asserts', async () => {
    const corpus = [...await loadStateLeaves(), ...await loadCausalLeaf()];
    const byId = new Map(corpus.map((e) => [e.id, e]));
    let exact = 0;
    let firstMove = 0;
    let conservative = 0;
    /** @type {string[]} */
    const rows = [];
    for (const item of HAND_TAGGED) {
      const entry = byId.get(item.id);
      // A hand tag whose variant the wave has rewritten must ERROR, never score a stale line.
      expect(entry, `the hand-tagged variant is gone from the corpus: ${item.id}`).toBeTruthy();
      const read = classifyMoves(entry.text);
      const same = read.join('→') === item.hand.join('→');
      if (same) exact += 1;
      if (same && !item.revisedAfterSeeing) conservative += 1;
      if (read[0] === item.hand[0]) firstMove += 1;
      rows.push(`${same ? '  ok' : 'DIFF'}  hand=${item.hand.join('→').padEnd(34)} read=${read.join('→')}`);
    }
    const n = HAND_TAGGED.length;
    console.log(`\nB-GRAMMAR CLASSIFIER · agreement on a ${n}-variant stratified hand-tagged sample\n`
      + `  exact sequence:            ${exact}/${n} = ${(exact / n).toFixed(2)}\n`
      + `  conservative (the two revised-after-seeing tags counted as disagreements): `
      + `${conservative}/${n} = ${(conservative / n).toFixed(2)}\n`
      + `  first move agrees:         ${firstMove}/${n} = ${(firstMove / n).toFixed(2)}\n${rows.join('\n')}\n`);
    // The sample must be big enough to mean something and the classifier must beat the
    // trivial "everything is PRESENT" baseline, which scores the share of one-move variants.
    expect(n).toBeGreaterThanOrEqual(24);
    const baseline = HAND_TAGGED.filter((t) => t.hand.length === 1 && t.hand[0] === 'PRESENT').length;
    expect(exact).toBeGreaterThan(baseline);
  });

  it('THE DOCBLOCK\'S NAMED SAMPLE PATH EXISTS, and names the export it claims', () => {
    // ⛔ THE HEADER STRING WAS UNGUARDED (INSTR-912 car 10, cure 14; FOLD-2 P11). Car 12's
    // cure pointed `moveGrammar.js`'s docblock at the real file, and the walker's IMPORT of
    // `HAND_TAGGED` would red on a bad path — but the DOCBLOCK is a separate string, and a
    // successor moving the fixture would fix the import and leave the header pointing at
    // nothing. A header that names a path is a claim; this is the arm that reads it.
    const header = readFileSync(join(ROOT, 'src/domain/prose/moveGrammar.js'), 'utf8').slice(0, 4000);
    const named = header.match(/`(tests\/fixtures\/[\w.-]+\.js)`/);
    expect(named, 'the docblock names a fixture path at all').toBeTruthy();
    expect(existsSync(join(ROOT, named[1])), `the docblock's named sample path exists: ${named[1]}`).toBe(true);
    // AND THE EXPORT IT NAMES BESIDE THE PATH, or the path is right and the claim is not.
    const exported = header.match(/`(tests\/fixtures\/[\w.-]+\.js)`,\s*`([A-Z_][A-Z0-9_]*)`/);
    expect(exported, 'the docblock names the export beside the path').toBeTruthy();
    expect(readFileSync(join(ROOT, exported[1]), 'utf8'))
      .toContain(`export const ${exported[2]}`);
    // NON-BLIND: the reader must actually find a path, so a header emptied of its claim reds
    // here rather than passing an existence check on nothing.
    expect(existsSync(join(ROOT, 'tests/fixtures/a-path-no-fixture-uses.js')),
      'the existence check can answer false').toBe(false);
    expect(named[1], 'and it is the file this test itself imports HAND_TAGGED from')
      .toBe('tests/fixtures/grammarControls.js');
  });

  it('reports `agrees: null` on an untagged variant — never a silent true', () => {
    expect(readGrammar({ text: 'The granary stands half full.' }).agrees).toBeNull();
    expect(readGrammar({ text: 'The granary stands half full.', grammar: 'V1' }).agrees).toBe(true);
    expect(readGrammar({ text: 'The granary stands half full.', grammar: 'V5' }).agrees).toBe(false);
  });

  it('names V3 and V8 as one ambiguous reading rather than picking between them', () => {
    // Both are PRESENT → ABSENCE and differ only in the ABSENCE CLASS, which no lexical read
    // settles. A classifier that picked would be inventing a licence.
    expect(orderIdOf(['PRESENT', 'ABSENCE'])).toBe('V3|V8');
    expect(LEVEL1_ORDERS.V3.order).toEqual(LEVEL1_ORDERS.V8.order);
  });
});

describe('the ten instrument gaps (SITTING §J) — all reported, none gating', () => {
  it('reads the opening shape, the tense and the close kind', () => {
    expect(openingShape('{settlement} keeps its own rolls.')).toBe('settlement-token');
    expect(openingShape('The hall keeps its own rolls.')).toBe('article');
    expect(openingShape('There is no watch here.')).toBe('expletive');
    expect(openingShape('In the wood, the town finds its timber.')).toBe('prepositional');
    expect(tenseOf('The granary will hold.')).toBe('future');
    expect(tenseOf('The granary would hold.')).toBe('subjunctive');
    expect(tenseOf('The granary was emptied.')).toBe('past');
    expect(tenseOf('The granary stands half full.')).toBe('present');
  });

  it('prints the register-level gap census over the shipped corpus', async () => {
    const leaves = await loadStateLeaves();
    const sample = leaves.slice(0, 400);
    // The cells are supplied because gap (a) is now the PER-POOL count and a walk with no
    // pools can only report a register total — the very shape the gap was re-cut away from.
    const report = walkGrammar({ corpus: sample, cells: poolCells(sample), register: 'dossier' });
    const gaps = /** @type {any} */ (report.figures.gaps);
    expect(gaps.closeKinds.length).toBeGreaterThan(1);
    expect(gaps.openingShapes.length).toBeGreaterThan(2);
    expect(gaps.tenses.length).toBeGreaterThan(1);
    console.log(`\nB-GRAMMAR GAPS · first 400 R1 variants\n`
      + `  opening shapes: ${gaps.openingShapes.map(([k, v]) => `${k}=${v}`).join(' ')}\n`
      + `  close kinds:    ${gaps.closeKinds.map(([k, v]) => `${k}=${v}`).join(' ')}\n`
      + `  tenses:         ${gaps.tenses.map(([k, v]) => `${k}=${v}`).join(' ')}\n`
      + `  settlement-token openers (gap (a), PER POOL): register total ${gaps.settlementOpeners.registerTotal}`
      + ` · pools with any ${gaps.settlementOpeners.poolsWithAny} of ${gaps.settlementOpeners.poolsMeasured}`
      + ` · pools with MORE THAN ONE ${gaps.settlementOpeners.poolsWithMoreThanOne}`
      + ` (wall 10's own subject) · most in one pool ${gaps.settlementOpeners.maxInOnePool}\n`
      + `  contrast shapes: ${gaps.contrastShapes} · bare relatives: ${gaps.bareRelatives}`
      + ` · appositives: ${gaps.appositives}\n`);
    // GAP (a) IS THE PER-POOL COUNT SITTING §J ASKED FOR, not the register total the walk
    // used to print — and the per-pool shape is what wall 10 fails on.
    expect(typeof gaps.settlementOpeners.registerTotal).toBe('number');
    expect(gaps.settlementOpeners.poolsMeasured).toBeGreaterThan(0);
    expect(gaps.settlementOpeners.byPool.every((row) => row.openers > 0)).toBe(true);
  });
});

describe('the grammar tag — declared, and applied to nothing', () => {
  it('names the two files that must move with it and holds THE PROMISE', () => {
    expect(GRAMMAR_TAG_CONTRACT.movesWith).toHaveLength(2);
    expect(GRAMMAR_TAG_CONTRACT.movesWith.join(' ')).toContain('generate-dossier-state-prose.mjs');
    expect(GRAMMAR_TAG_CONTRACT.movesWith.join(' ')).toContain('dossierStateProseProjection.contract.test.js');
    expect(GRAMMAR_TAG_CONTRACT.seedSafe).toContain('THE PROMISE');
  });

  it('is on NO shipped variant — this lane tags nothing', async () => {
    const corpus = [...await loadStateLeaves(), ...await loadCausalLeaf()];
    expect(corpus.filter((e) => 'grammar' in e)).toEqual([]);
  });
});

describe('the walk over the shipped corpus — REPORTED, and the arms that cannot run say so', () => {
  it('reports arms B1/B2/B3 NOT-EXECUTABLE without a simulated reading sequence', async () => {
    const leaves = await loadStateLeaves();
    const report = walkGrammar({ corpus: leaves.slice(0, 200), register: 'dossier' });
    expect(report.fails.some((f) => f.arm.startsWith('B'))).toBe(false);
    expect(report.notExecutable.some((x) => x.arm === 'B')).toBe(true);
    // Arm I is not-executable until the rank-form manifest is typed.
    expect(report.notExecutable.some((x) => x.arm === 'I')).toBe(true);
  });

  it('walks the whole dossier corpus and prints the level-1 figures', async () => {
    const leaves = await loadStateLeaves();
    const causal = await loadCausalLeaf();
    const corpus = [...leaves, ...causal];
    const report = walkGrammar({
      corpus,
      cells: poolCells(corpus),
      composedFill: new Map([...composedFillByBlock(fillSites())].map(([b, row]) => [b, row.slots])),
      register: 'dossier',
    });
    const level1 = /** @type {any} */ (report.figures.level1);
    const spread = /** @type {any} */ (report.figures.spread);
    console.log(`\nB-GRAMMAR · level 1 over ${corpus.length} variants\n`
      + `  realised orders n = ${level1.orderHistogram.length}; top: `
      + `${level1.orderHistogram.slice(0, 6).map(([o, k]) => `${o} ${(k / corpus.length * 100).toFixed(1)}%`).join(' · ')}\n`
      + `  index-0 orders: ${level1.indexZeroHistogram.slice(0, 4).map(([o, k]) => `${o} ${k}`).join(' · ')}\n`
      + `  untagged variants: ${level1.untagged} of ${corpus.length}\n`
      + `  pools ${spread.pools} — uniform grammar ${(spread.uniformGrammarShare * 100).toFixed(1)}%, `
      + `uniform segments ${(spread.uniformSegmentShare * 100).toFixed(1)}%, `
      + `repeated opener ${(spread.repeatedOpenerShare * 100).toFixed(1)}%\n`
      + `  fails by arm: ${armsThatFailed(report).join(', ') || '(none)'}\n`);
    // Every variant is untagged today, and the walker must say so rather than scoring silence
    // as agreement.
    expect(level1.untagged).toBe(corpus.length);
    expect(spread.pools).toBe(786);
    // The walk must find SOMETHING and must not find everything.
    expect(report.fails.length).toBeGreaterThan(0);
    expect(report.fails.length).toBeLessThan(corpus.length);
    expect(report.notExecutable.length).toBeGreaterThan(0);
  });

  it('entropy is a real measure — a flat distribution beats a concentrated one', () => {
    expect(entropyOf([0.25, 0.25, 0.25, 0.25])).toBeCloseTo(2, 6);
    expect(entropyOf([1])).toBe(0);
    expect(entropyOf([0.9, 0.1])).toBeLessThan(0.5);
  });

  it('the non-move roster is closed and every member carries a detector', () => {
    expect(Object.keys(NON_MOVES).sort()).toEqual(
      ['FEELING', 'FIGURE', 'FORECAST', 'MEANING', 'SAYING', 'VERDICT'],
    );
    for (const spec of Object.values(NON_MOVES)) expect(spec.detect).toBeInstanceOf(RegExp);
  });
});

// ── THE PROVENANCE DETECTOR'S VOCABULARY (SITTING §R c-16; the seam fold's R1) ───────
//
// The fold refuted the shipped docblock at b573bb5f4: of 18 citing variants, 11 rested on a
// generic reporting-verb limb naming NO holder kind at all (two literally read "the record
// has" / "the record holds"), and a frozen register had been re-taken on that ground. Car 5c
// narrowed the row to the twelve kinds. THIS ARM EXISTS SO THE SITTING BUDGETS ON A FIGURE IT
// UNDERSTANDS: the split is printed and asserted as three integers beside the total, and the
// withdrawn limb is driven as a LIVE control over the same corpus, so the arm cannot go
// vacuous — the eleven sentences are still in the leaves, and the assertion is that the
// shipped detector no longer reads them as citations.

/** The KIND limb: the twelve holder kinds, each naming the BOOK that holds the record. */
const PROVENANCE_KIND_LIMB = /\b(the (?:treasury|watch|parish|market|court|census|office)(?:'s)? (?:books|roll|rolls|register|registers|count|ledger|ledgers)|the (?:muster|toll) (?:roll|rolls|books|register)|the elders (?:say|hold|remember|keep)|the tradition (?:says|holds|remembers|keeps)|from the road)\b/i;

/** The GENERIC limb, WITHDRAWN at car 5c and kept here as the control that proves the split. */
const PROVENANCE_GENERIC_LIMB = /\b(the (?:rolls|registers?|ledgers?|books?|records?) (?:say|says|show|shows|hold|holds|carry|carries|name|names|record|records|have|has))\b/i;

/** One sentence per kind, so a kind dropped from the vocabulary reds by name. */
const KIND_CONTROLS = Object.freeze({
  treasury: 'the treasury\'s ledgers run three years behind',
  muster: 'the muster roll is long',
  census: 'the census count was taken two winters ago',
  parish: 'the parish register names every one of them',
  'toll-bar': 'the toll rolls show a lean season',
  market: 'the market books are kept by the guild',
  watch: 'the watch register carries the names',
  court: 'the court rolls are sealed',
  elders: 'the elders remember a drier year',
  tradition: 'the tradition holds that the well never failed',
  road: 'from the road it looks prosperous',
  office: 'the office books close at midwinter',
});

/**
 * What the narrowed vocabulary REFUSES: a bare record, a generic reporting verb, and two
 * tokens that are not holder kinds. Each carries the WHOLE reading the classifier gives it,
 * not merely the absence of PROVENANCE — an absence on its own is true both when the token
 * was correctly excluded and when the classifier stopped answering at all.
 */
const NOT_A_CITATION = Object.freeze([
  { text: 'the books say the mill is idle', reads: ['PRESENT', 'OBJECT'] },
  { text: 'the record has two readings', reads: ['PRESENT'] },
  { text: 'the records show a lean year', reads: ['PRESENT'] },
  { text: 'the rolls carry three hundred names', reads: ['PRESENT'] },
  { text: 'the customs books are current', reads: ['TRADITION'] },
  { text: 'the tithe roll is short', reads: ['PRESENT'] },
]);

describe('the PROVENANCE detector cites the twelve holder kinds and nothing wider (SITTING §R c-16)', () => {
  it('splits the shipped citations as THREE INTEGERS beside the total: kind-only 7 · generic-only 0 · both 0', async () => {
    const leaves = await loadStateLeaves();
    const cited = leaves.filter((v) => classifyMoves(v.text).includes('PROVENANCE'));
    let kindOnly = 0; let genericOnly = 0; let both = 0;
    for (const v of cited) {
      const k = PROVENANCE_KIND_LIMB.test(v.text);
      const g = PROVENANCE_GENERIC_LIMB.test(v.text);
      if (k && g) both += 1; else if (k) kindOnly += 1; else if (g) genericOnly += 1;
    }
    // THE CONTROL THAT MAKES THE ZERO MEAN SOMETHING: the withdrawn limb's own sentences are
    // still in the corpus. If a later car re-admits the limb these eleven become citations
    // again, `cited.length` reads 18 and `genericOnly` reads 11, and both lines below red.
    const genericNotCited = leaves.filter(
      (v) => PROVENANCE_GENERIC_LIMB.test(v.text)
        && !PROVENANCE_KIND_LIMB.test(v.text)
        && !classifyMoves(v.text).includes('PROVENANCE'),
    );
    console.log(`\nPROVENANCE · ${cited.length} citing variants of ${leaves.length}\n`
      + `  kind-only ${kindOnly} · generic-only ${genericOnly} · both ${both}\n`
      + `  carrying the WITHDRAWN generic limb but NOT cited: ${genericNotCited.length}\n`
      + `${cited.map((v) => `    ${v.block} :: ${v.pool} | ${(v.text.match(PROVENANCE_KIND_LIMB) || [''])[0]}`).join('\n')}\n`);
    expect(cited.length).toBe(7);
    expect(kindOnly).toBe(7);
    expect(genericOnly).toBe(0);
    expect(both).toBe(0);
    expect(genericNotCited.length).toBe(11);
  });

  it('every one of the twelve kinds is live, and the withdrawn vocabulary is refused', () => {
    for (const [kind, text] of Object.entries(KIND_CONTROLS)) {
      expect(classifyMoves(text), `${kind} must cite`).toContain('PROVENANCE');
    }
    expect(Object.keys(KIND_CONTROLS)).toHaveLength(12);
    for (const { text, reads } of NOT_A_CITATION) {
      // THE WHOLE READING, so the refusal cannot be confused with a classifier that answers
      // nothing: each of these still classifies, and to something the corpus recognises.
      expect(classifyMoves(text), `the classifier's reading of "${text}"`).toEqual(reads);
      expectAbsentWithAnchor(classifyMoves(text), 'PROVENANCE', reads[0],
        `the classifier's reading of "${text}"`);
    }
  });

  it('the shipped row carries no generic reporting-verb limb, and no non-kind token', () => {
    const row = CLAUSE_DETECTORS.find((d) => d.move === 'PROVENANCE');
    expect(row).toBeTruthy();
    const src = String(row?.re.source);
    // THE LIVENESS ANCHOR COMES FIRST, and it is the whole vocabulary: all twelve kinds are
    // asserted PRESENT in this same string before anything is asserted absent from it, so a
    // regex that drifted away entirely reds here rather than passing the three negatives.
    for (const kind of ['treasury', 'muster', 'census', 'parish', 'toll', 'market',
      'watch', 'court', 'elders', 'tradition', 'road', 'office']) {
      expect(src, `${kind} is a holder kind and must be in the vocabulary`).toContain(kind);
    }
    expect(src.length, 'and the source is a real regex body, not an empty string').toBeGreaterThan(120);
    // anchored: the twelve kinds are asserted PRESENT in this same `src` immediately above
    expect(src).not.toMatch(/rolls\|registers\?\|ledgers\?\|books\?\|records\?/);
    // anchored: same `src`, whose twelve kind tokens are asserted present immediately above
    expect(src).not.toContain('customs');
    // anchored: same `src`, whose twelve kind tokens are asserted present immediately above
    expect(src).not.toContain('tithe');
  });

  it('U5 — the reading does not depend on the row\'s PRIORITY POSITION', async () => {
    // `classifyMoves` collects EVERY detector that fires and orders them by match index, so
    // position decides only ties. Measured at car 5c over all six leaves with the row moved
    // to LAST in CLAUSE_DETECTORS: 0 of 2,266 move sequences differ. Held here in the form
    // the walker can execute without a second module: no OTHER detector claims any of the
    // seven citing clauses at the same index, so no tie exists for position to break.
    const leaves = await loadStateLeaves();
    const cited = leaves.filter((v) => classifyMoves(v.text).includes('PROVENANCE'));
    const ties = [];
    for (const v of cited) {
      for (const unit of clauseUnits(v.text)) {
        const at = CLAUSE_DETECTORS
          .map((d) => { const m = d.re.exec(unit); return m ? { move: d.move, at: m.index } : null; })
          .filter((m) => m !== null);
        const prov = at.find((m) => m?.move === 'PROVENANCE');
        if (!prov) continue;
        for (const other of at) {
          if (other && other.move !== 'PROVENANCE' && other.at === prov.at) {
            ties.push(`${v.block} :: ${v.pool} | ${other.move} ties PROVENANCE at ${prov.at}`);
          }
        }
      }
    }
    expect(cited.length).toBe(7);
    expect(ties).toEqual([]);
  });
});
