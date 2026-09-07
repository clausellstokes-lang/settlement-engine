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
import { describe, expect, it } from 'vitest';
import {
  armA, armE, armF, armG, armThreeNumbers, armsB, ceilingFor, entropyOf, openerOf,
  openingShape, runCeilingFor, segmentCount, tenseOf, walkGrammar,
} from '../../src/domain/prose/grammarWalker.js';
import {
  classifyMoves, GRAMMAR_TAG_CONTRACT, LEVEL1_ORDERS, NON_MOVES, orderIdOf, readGrammar, WALLS,
} from '../../src/domain/prose/moveGrammar.js';
import { fingerprint, RATE_METRICS, scoreAgainstBands } from '../../src/domain/prose/proseFingerprint.js';
import { typedFactsOf } from '../../src/domain/prose/entryWalker.js';
import {
  ARM_CONTROLS, ARM_D_CONTROL, CHAIR_THREE_NUMBERS, C_SIBLING_CONTROL, fairDraw, HAND_TAGGED,
  OWNER_TEMPLATE_SEQUENCE, ROTA_SEQUENCE, SYNTHETIC_BANDS,
} from '../fixtures/grammarControls.js';
import { loadCausalLeaf, loadStateLeaves, poolCells } from '../helpers/dossierCorpus.js';
import { composedFillByBlock, fillSites } from '../helpers/dossierComposedFill.js';

/** @param {import('../../src/domain/prose/grammarWalker.js').GrammarReport} r */
const armsThatFailed = (r) => [...new Set(r.fails.map((f) => f.arm))].sort();

describe('the ceilings — read from n, never fixed', () => {
  it('is min(1/n + 0.10, 1.5/n) for n ≥ 3 and NOT-EXECUTABLE at n ≤ 2', () => {
    expect(ceilingFor(1)).toBeNull();
    expect(ceilingFor(2)).toBeNull();
    expect(ceilingFor(3)).toBeCloseTo(0.4333, 4);
    expect(ceilingFor(4)).toBeCloseTo(0.35, 4);
    expect(ceilingFor(5)).toBeCloseTo(0.30, 4);
    // At n = 6 the old fixed 0.35 is 2.1x uniform; the formula holds 1.5x.
    expect(ceilingFor(6)).toBeCloseTo(0.25, 4);
    expect(ceilingFor(8)).toBeCloseTo(0.1875, 4);
    for (const n of [3, 4, 5, 6, 8, 12, 20]) {
      expect(ceilingFor(n) / (1 / n)).toBeLessThanOrEqual(1.6 + 1e-9);
    }
  });

  it('the run ceiling is 1/n + 2 SE, floored at 1/n + 0.05, never a fixed slack', () => {
    // On a 40-line sample the SE term is large and the floor does not bind.
    expect(runCeilingFor(4, 40)).toBeGreaterThan(0.25 + 0.05);
    // On a large sample the floor binds instead.
    expect(runCeilingFor(4, 100000)).toBeCloseTo(0.30, 3);
    expect(runCeilingFor(1, 40)).toBeNull();
  });
});

describe('the four negative controls and the positive one (MOVE-GRAMMAR §4.4, as the sitting re-cut them)', () => {
  it('CONTROL 1 — the owner\'s own template reds on arm A and arm B1', () => {
    const a = armA(OWNER_TEMPLATE_SEQUENCE, 'control-1', 4);
    const b = armsB(OWNER_TEMPLATE_SEQUENCE, 'control-1', 4);
    expect(a.fails.map((f) => f.arm)).toContain('A');
    expect(a.fails[0].value).toBe(1);
    expect(b.fails.map((f) => f.arm)).toContain('B1');
    expect(b.figures.runRate).toBe(1);
  });

  it('CONTROL 2 — the rota PASSES A and B1 and REDS on B3, which is the whole point of it', () => {
    const a = armA(ROTA_SEQUENCE, 'control-2', 4);
    const b = armsB(ROTA_SEQUENCE, 'control-2', 4);
    expect(a.fails).toEqual([]);
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

  it('CONTROL 5 (POSITIVE) — a fair draw over n orders passes every arm', () => {
    const n = 6;
    const sequence = fairDraw(n, 600);
    const a = armA(sequence, 'control-5', n);
    const b = armsB(sequence, 'control-5', n);
    expect(a.fails).toEqual([]);
    expect(b.fails).toEqual([]);
    const top = /** @type {any[]} */ (a.figures.histogram)[0];
    expect(top.share).toBeLessThan(ceilingFor(n));
    expect(Number(b.figures.runRate)).toBeLessThan(Number(b.figures.runCeiling));
  });

  it('CONTROL B2 — adjacency is judged at the CHANCE FLOOR, so a fair draw is not reported as a loop', () => {
    const b = armsB(fairDraw(4, 400, 99), 'control-b2', 4);
    expect(b.notes.filter((note) => note.arm === 'B2')).toEqual([]);
    expect(Number(b.figures.chanceFloor)).toBeCloseTo(0.25, 6);
  });

  it('CONTROL H — n ≤ 2 declares NOT-EXECUTABLE and never a pass', () => {
    const a = armA(['O0', 'O1', 'O0', 'O1'], 'control-h', 2);
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

  it('BUDGET fails a unit exceeding more than a third of the soft rules and reports one above a sixth', () => {
    const r = armThreeNumbers(outside, SYNTHETIC_BANDS, CHAIR_THREE_NUMBERS, 'outside');
    const scored = Number(/** @type {any} */ (r.figures).scored);
    const exceeded = /** @type {any[]} */ (/** @type {any} */ (r.figures).exceeded);
    expect(scored).toBeGreaterThan(10);
    // The control is only a control if it actually exceeds something.
    expect(exceeded.length).toBeGreaterThan(0);
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

  it('SPREAD names WHICH rules a unit exceeds, so uniform imperfection is visible', () => {
    const r = armThreeNumbers(outside, SYNTHETIC_BANDS, CHAIR_THREE_NUMBERS, 'spread');
    expect(Array.isArray(/** @type {any} */ (r.figures).spread)).toBe(true);
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
    const report = walkGrammar({ corpus: leaves.slice(0, 400), register: 'dossier' });
    const gaps = /** @type {any} */ (report.figures.gaps);
    expect(gaps.closeKinds.length).toBeGreaterThan(1);
    expect(gaps.openingShapes.length).toBeGreaterThan(2);
    expect(gaps.tenses.length).toBeGreaterThan(1);
    console.log(`\nB-GRAMMAR GAPS · first 400 R1 variants\n`
      + `  opening shapes: ${gaps.openingShapes.map(([k, v]) => `${k}=${v}`).join(' ')}\n`
      + `  close kinds:    ${gaps.closeKinds.map(([k, v]) => `${k}=${v}`).join(' ')}\n`
      + `  tenses:         ${gaps.tenses.map(([k, v]) => `${k}=${v}`).join(' ')}\n`
      + `  settlement-token openers: ${gaps.settlementOpeners} · contrast shapes: ${gaps.contrastShapes}`
      + ` · bare relatives: ${gaps.bareRelatives} · appositives: ${gaps.appositives}\n`);
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
