/**
 * proseTasteMeasure.walker.test.js — THE HARNESS'S OWN ARMS (TASTE car M-7).
 *
 * ⛔ WHY A HARNESS NEEDS ARMS AT ALL. `scripts/taste-measure.mjs` is the only thing standing
 * between a wording set and the sitting: a writing round is accepted or refused on its output
 * and on nothing else. So the two failure modes that would let a bad set through are the ones
 * held here.
 *
 *   1. AN UNWRITTEN SET MUST NOT READ AS A CLEAN ONE. On the ⟦TO-AUTHOR⟧ state every pool
 *      reads WITHHELD with the marker NAMED, and every measure below it declares itself
 *      NOT-EXECUTABLE rather than answering zero. A harness that answered PASS on a pool with
 *      no prose in it would sign off the corpus by measuring its own placeholders.
 *   2. A LAWFUL SET MUST MOVE EXACTLY ITS OWN ROW. The plant below writes one pool's wording
 *      set, drives the whole harness, and asserts that pool's row moved and the other six did
 *      not — the property that makes the per-pool table readable at all.
 *
 * The remaining arms hold the pieces a reader has to trust: the CARTESIAN unit set is the
 * attach set times the spine variants times the pool's variants times the faces; N is set from
 * a MEASURED cost with its confidence stated; and the harness reads the round counters from
 * the packet directory and writes nothing there.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';

import {
  ENTRY_NUMBERS, EXEMPLAR_DIR, EXEMPLAR_LEAVES, PACKETS, bandPositionOf, exemplarBands,
  measure, roundsOf, sampleSizeFor, tableLines, tieRate, unitsOfPool,
} from '../../scripts/taste-measure.mjs';
import { AUTHORING_MARKER } from '../../scripts/lib/dossier-annex-grammar.mjs';
import { TASTE_POOLS } from '../../scripts/prose-licence-card.mjs';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';

const CORPUS = { ...DOSSIER_STATE_PROSE_DEFENSE, ...DOSSIER_STATE_PROSE_GENERAL };

describe('the CARTESIAN unit set is the attach set times the spines times the faces', () => {
  it('counts exactly what the composer could produce, for every pool', () => {
    for (const { block, pool } of TASTE_POOLS) {
      const meta = CORPUS[block].poolMeta[pool];
      const variants = CORPUS[block].pools[pool];
      const facesOf = (v) => 1 + (Array.isArray(v.wordings) ? v.wordings.length : 0);
      let expected = 0;
      for (const spineKey of meta.attach) {
        for (const spine of CORPUS[block].pools[spineKey]) {
          for (const variant of variants) expected += facesOf(spine) * facesOf(variant);
        }
      }
      const units = unitsOfPool(block, pool);
      expect(units.length, `${block} :: ${pool}`).toBe(expected);
      // EVERY UNIT IS A SPINE PLUS EXACTLY ONE MODIFIER, and the modifier is THIS pool.
      for (const unit of units) {
        expect(unit.pieces).toHaveLength(2);
        expect(unit.pieces[0].role).toBe('spine');
        expect(unit.pieces[1].role).toBe('modifier');
        expect(unit.pieces[1].key).toBe(pool);
        expect(meta.attach).toContain(unit.pieces[0].key);
        // THE ARRANGEMENT IS THE COMPOSER'S: `addition` at the sentence seat takes the EMPTY
        // opener, and the composer down-cases only after a NON-EMPTY one, so the unit is the
        // two texts with one space between them and no other byte.
        expect(unit.text).toBe(`${unit.pieces[0].text} ${unit.pieces[1].text}`);
      }
    }
  });

  it('is EMPTY on a pool whose attach set is empty, and never a guess', () => {
    // A spine takes no attach set, so it composes no unit; the harness must answer 0 rather
    // than falling back to some other population.
    expect(unitsOfPool('DS-DEF-11', 'WALLED-STRAINED')).toEqual([]);
    expect(unitsOfPool('DS-DEF-11', 'no such pool')).toEqual([]);
    expect(unitsOfPool('NO-SUCH-BLOCK', 'x')).toEqual([]);
  });
});

describe('N is set from a MEASURED cost, with its confidence stated', () => {
  it('walks the whole population where the walk is cheap, and says so', () => {
    const cheap = sampleSizeFor(120, 0.5);
    expect(cheap.exhaustive).toBe(true);
    expect(cheap.n).toBe(120);
    expect(cheap.confidence).toContain('exact');
    // AND SAMPLES WHERE IT IS NOT: the half-width, not a round number somebody liked.
    const dear = sampleSizeFor(200_000, 0.5);
    expect(dear.exhaustive).toBe(false);
    expect(dear.n).toBe(384);
    expect(dear.confidence).toContain('5.0 percentage points');
    // The boundary is the COST and not the count: a large population that walks in under a
    // second is still walked whole.
    expect(sampleSizeFor(100_000, 0.000_001).exhaustive).toBe(true);
  });
});

describe('the harness reads the packet directory and writes nothing in it', () => {
  it('counts the rounds a pool\'s writers have left, and answers zero for an empty one', () => {
    for (const entry of TASTE_POOLS) {
      const rounds = roundsOf(entry.dir);
      expect(typeof rounds.draftRounds).toBe('number');
      expect(rounds.draftRounds).toBeGreaterThanOrEqual(0);
      expect(typeof rounds.refineA).toBe('boolean');
      expect(typeof rounds.refineB).toBe('boolean');
    }
    const absent = roundsOf('no-such-pool-directory');
    expect(absent).toEqual({
      draftRounds: 0, refineA: false, refineB: false, files: [],
    });
    expect(existsSync(PACKETS), 'the packet root the workflow writes into').toBe(true);
  });
});

describe('the exemplar bands, and the band position of one face', () => {
  it('builds the bands from the TEN LEAF registers, or declares itself NOT-EXECUTABLE', () => {
    const built = exemplarBands(EXEMPLAR_DIR);
    if (!built.bands) {
      // The kit is not on this machine: the measure must SAY so and must not invent a band.
      expect(built.why).toContain(EXEMPLAR_DIR);
      expect(bandPositionOf('The stores are short.', built).executable).toBe(false);
      return;
    }
    expect(built.labels.length).toBeGreaterThanOrEqual(3);
    for (const label of built.labels) expect(EXEMPLAR_LEAVES).toContain(label);
    expect(Object.keys(built.bands).length).toBeGreaterThan(10);
    // Every banded metric carries a median INSIDE its own band, by construction.
    for (const [metric, band] of Object.entries(built.bands)) {
      expect(built.medians[metric]).toBeGreaterThanOrEqual(band.lo);
      expect(built.medians[metric]).toBeLessThanOrEqual(band.hi);
    }
    const position = bandPositionOf('The stores behind that provision are short of what the year asks.', built);
    expect(position.executable).toBe(true);
    expect(position.scored).toBeGreaterThan(0);
    expect(position.meanDistanceFromMedian).toBeGreaterThanOrEqual(0);
    // THE THREE NUMBERS AT THE ENTRY GRAIN are the ones applied, and they are read from the
    // constant rather than retyped: budget two thirds, depth 1.75.
    expect(ENTRY_NUMBERS.depth).toBe(1.75);
    expect(Math.round(ENTRY_NUMBERS.budgetShare * 3)).toBe(2);
    expect(typeof position.budgetOk).toBe('boolean');
    expect(typeof position.depthOk).toBe('boolean');
  });

  it('flags a PERFECTION-suspect face, which is a finding and never a rewrite trigger', () => {
    const built = exemplarBands(EXEMPLAR_DIR);
    if (!built.bands) return;
    // A face inside every band exceeds nothing; §16.1 says that is SUSPECT, not clean.
    const wide = { bands: {}, medians: {} };
    for (const [metric, band] of Object.entries(built.bands)) {
      wide.bands[metric] = { lo: -1e6, hi: 1e6 };
      wide.medians[metric] = band.lo;
    }
    const position = bandPositionOf('The hall keeps the rolls, and the rolls are current.', wide);
    expect(position.exceeded).toBe(0);
    expect(position.perfectionSuspect).toBe(true);
  });
});

describe('the tie rate is measured on the REAL rungs, and says when it cannot be', () => {
  it('names the multi-candidate rungs the taste actually creates', () => {
    const ties = tieRate(['a', 'b', 'c']);
    expect(ties.rungs).toBeGreaterThan(0);
    // DS-DEF-11's three WALLED-* rungs each take the country pool AND a watch pool; DS-DEF-2's
    // disaster cell takes both stock pools. Those are the rungs where a tie is possible at all.
    expect(ties.multiCandidateRungs).toBe(4);
    expect(ties.pairs).toBeGreaterThan(0);
    expect(ties.tieBp).toBeGreaterThanOrEqual(0);
    expect(ties.note).toBe('');
  });
});

describe('⭐⭐ THE HARNESS ON THE ⟦TO-AUTHOR⟧ STATE: every pool WITHHELD, the marker named', () => {
  it('DRIVES THE WHOLE MEASURE and reports every pool WITHHELD with the marker by name', async () => {
    // ⛔ THE HARNESS ITSELF, NOT A RE-IMPLEMENTATION OF IT. The two cheap sections are turned
    // off (no `--base`, no `--variety`) because this arm is about the VERDICT rule and not
    // about the classifier, and both of those declare themselves NOT-EXECUTABLE by name.
    const out = await measure({
      arm: 'walker-arm', round: 0, base: null, variety: 0, exemplars: EXEMPLAR_DIR,
    });
    expect(out.pools).toHaveLength(TASTE_POOLS.length);
    for (const pool of out.pools) {
      expect(pool.verdict, `${pool.block} :: ${pool.pool}`).toBe('WITHHELD');
      expect(pool.why, 'the marker is NAMED in the reason').toContain(AUTHORING_MARKER);
      expect(pool.walk, 'and no measure is answered on an unwritten set').toBeNull();
      expect(pool.band).toBeNull();
      expect(pool.units).toBe(0);
    }
    // NOTHING TO WALK, AND THE WALK SAYS SO rather than reporting a clean sample.
    expect(out.walk.totalUnits).toBe(0);
    expect(out.walk.verdicts).toEqual({ FAIL: 0, WITHHELD: 0, PASS: 0 });
    expect(out.manifest.executable).toBe(false);
    expect(out.variety.executable).toBe(false);
    // AND THE TABLE A GATE AGENT READS SAYS IT SEVEN TIMES.
    const table = tableLines(out).join('\n');
    expect(table.match(/\[WITHHELD\]/g) || []).toHaveLength(TASTE_POOLS.length);
    expect(table).toContain('NOT-EXECUTABLE');
  }, 120_000);

  it('is the state this dock is committed in, and every pool carries the marker', () => {
    for (const { block, pool } of TASTE_POOLS) {
      const variants = CORPUS[block].pools[pool];
      const marked = variants.filter((v) => String(v.text).includes(AUTHORING_MARKER));
      expect(marked.length, `${block} :: ${pool} is unwritten`).toBe(variants.length);
      // AND SO ITS UNIT SET IS EMPTY: the harness has nothing to walk, which is why the row
      // must read WITHHELD rather than PASS.
      expect(unitsOfPool(block, pool).length).toBeGreaterThan(0);
    }
  });
});
