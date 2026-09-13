/**
 * proseWaveGate.walker.test.js — THE WAVE GATE'S OWN ARMS (TASTE car M-7, renamed and
 * extended at REWRITE car 8a-5 with the harness it walks).
 *
 * ⛔ WHY A HARNESS NEEDS ARMS AT ALL. `scripts/prose-wave-gate.mjs` is the only thing standing
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
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import {
  ENTRY_NUMBERS, EXEMPLAR_DIR, EXEMPLAR_LEAVES, FACE_LEVEL_METRICS, PACKETS, SECTION_LEAVES,
  TEXT_LEVEL_METRICS, bandGrainsOf, bandPositionAt, bandPositionOf, censusSynonymTable,
  exemplarBands, exemplarCitationRate, fixtureSection, inBandOf, keepOrRevert, labelOfFinding,
  measure, packetDirFor, packetRefusal, packetTargetFor, poolRosterOf, qVocabularyReport,
  reportRowsOf, roundsOf, sampleSizeFor, scopedWalkOf,
  sectionsCoverEveryPool, shapeReport, siblingSpreadOf, siteOfFinding, tableLines, tieRate,
  unitsOfPool, withheldPoolRow,
} from '../../scripts/prose-wave-gate.mjs';
import { AUTHORING_MARKER } from '../../scripts/lib/dossier-annex-grammar.mjs';
import { unitsOfPool as libUnitsOfPool } from '../../scripts/lib/prose-composed-units.mjs';
import { TASTE_POOLS } from '../../scripts/prose-licence-card.mjs';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';

const CORPUS = { ...DOSSIER_STATE_PROSE_DEFENSE, ...DOSSIER_STATE_PROSE_GENERAL };
/**
 * The whole merged corpus, built from the gate's OWN section table rather than transcribed —
 * the cross-check arm below has to hand the lib the same corpus the gate reads, and a
 * hand-written list here would be the second roster car 8a-5 already found drifting once.
 */
const CORPUS_ALL = Object.assign({}, ...Object.values(SECTION_LEAVES));
const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '../..');

/**
 * ⛔⛔ THE SEVEN TASTE POOLS' STANDING IN THIS TREE (REWRITE car 8a-3).
 *
 * `TASTE_POOLS` is a LIST OF NAMES on the licence card, and the harness measures the pools
 * those names point at. In the taste's own dock the seven modifier pools were born in the
 * annex, so every name resolved. This car lands the taste's INSTRUMENTS and refuses its ANNEX
 * ROWS to 8b (brief item 3), so not one of the seven names resolves to a pool and the harness
 * has nothing to walk.
 *
 * ⛔ THAT IS AN ABSENT INPUT, NOT A FINDING, and the difference is the whole reason for this
 * constant. An arm that read `unitsOfPool(...)` as `[]` and asserted something about the empty
 * array would report the harness as working on a population of zero — the vacuous-instrument
 * failure this estate refuses by name. So every arm whose subject is a taste pool declares
 * itself NOT-EXECUTABLE against THIS measurement and asserts the CAUSE (the pool is absent
 * from the shipped corpus), which is a statement that can be false. The day 8b authors the
 * first modifier row the constant flips with no edit below it.
 *
 * The arms that carry the harness's OWN rules — the plants, the scoping, the band builder, the
 * packet reader, the Q vocabulary — are untouched: their fixtures are in this file.
 */
const TASTE_POOLS_LANDED = TASTE_POOLS
  .every(({ block, pool }) => Array.isArray(CORPUS[block]?.pools?.[pool]));
/** The seven names, and whether the corpus knows each — printed once when it does not. */
const TASTE_POOLS_ABSENT = TASTE_POOLS
  .filter(({ block, pool }) => !Array.isArray(CORPUS[block]?.pools?.[pool]))
  .map(({ block, pool }) => `${block} :: ${pool}`);

describe('the CARTESIAN unit set is the attach set times the spines times the faces', () => {
  it('counts exactly what the composer could produce, for every pool', () => {
    if (!TASTE_POOLS_LANDED) {
      expect(TASTE_POOLS_ABSENT, 'NOT-EXECUTABLE: every taste pool the harness would walk is'
        + ' refused to 8b, so there is no attach set to multiply out')
        .toHaveLength(TASTE_POOLS.length);
      return;
    }
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

  it('⭐⭐ A SPINE POOL COMPOSES ITS OWN FACES, which is the REWRITE\'s unit (car 8a-5)', () => {
    // ⛔ THIS ARM READ `toEqual([])` UNTIL REWRITE car 8a-5, AND THAT WAS THE GATE HAVING NO
    // SUBJECT. The taste walked MODIFIER pools, whose unit is the cartesian of an attach set;
    // the REWRITE's first writing workflow rewrites a DESK SECTION's SPINE pools and grows
    // their faces, and a spine's attach set is empty on all 708 by construction. Under the old
    // rule the gate composed NOTHING for the very pools the wave is about.
    const units = unitsOfPool('DS-DEF-11', 'WALLED-STRAINED');
    expect(units.length, 'two variants, one face each').toBe(2);
    for (const unit of units) {
      expect(unit.pieces, 'a bare spine is ONE piece').toHaveLength(1);
      expect(unit.pieces[0].role).toBe('spine');
      expect(unit.pieces[0].key).toBe('WALLED-STRAINED');
      expect(unit.poolKey, 'and the unit is addressed at the pool itself').toBe('WALLED-STRAINED');
      expect(unit.text, 'its text is the face, with nothing appended').toBe(unit.pieces[0].text);
    }
    // AND THE ABSENT CASES STILL ANSWER NOTHING, which is what stops the widening from
    // becoming a fallback: a pool that does not exist composes no unit at all.
    expect(unitsOfPool('DS-DEF-11', 'no such pool')).toEqual([]);
    expect(unitsOfPool('NO-SUCH-BLOCK', 'x')).toEqual([]);
  });

  it('⭐⭐ ONE UNIT BUILDER: the gate and the lib agree on EVERY pool of a section', () => {
    // ⛔ THE FORK THIS ARM CLOSES (SITTING §U c-2, fold NEW-1 of the gate lens). Car 8a-2
    // landed `scripts/lib/prose-composed-units.mjs` for exactly this job and 8a-5 landed the
    // gate with a SECOND copy beside it. Driven on shipped input the two disagreed at once —
    // DS-DEF-11 :: WALLED-STRAINED gate 2 / lib 0, WALLED-QUIET 3 / 0, DS-DEF-2 :: Disasters &
    // Famine: granary AND hospital 3 / 0 — because the bare-spine branch lived only in the
    // gate, and nothing cross-checked them while both fed the same sitting. The branch now
    // lives in the lib behind `bareSpine` and the gate is four lines; this arm is what keeps
    // it that way, because a fork does not announce itself.
    const roster = poolRosterOf({ section: 'defense' });
    expect(roster.rows.length, 'the section must have a roster to compare over')
      .toBeGreaterThanOrEqual(100);
    const disagree = [];
    let total = 0;
    for (const { block, pool } of roster.rows) {
      const mine = unitsOfPool(block, pool);
      const theirs = libUnitsOfPool(CORPUS_ALL, block, pool, { bareSpine: true });
      total += mine.length;
      if (mine.length !== theirs.length) {
        disagree.push(`${block} :: ${pool} — gate ${mine.length} / lib ${theirs.length}`);
      } else if (mine.some((u, i) => u.text !== theirs[i].text)) {
        disagree.push(`${block} :: ${pool} — same count, different text`);
      }
    }
    expect(disagree.slice(0, 5), 'a pool the two builders read differently').toEqual([]);
    // NON-VACUITY on the only axis that could hide a fork: a comparison over zero units is two
    // implementations agreeing about nothing. The defense section composes 448 units today.
    // ⛔ THIS LITERAL WAS ALREADY STALE WHEN THE 8b DS-DEF-2 DRAFT GATE READ IT, and the
    // staleness is recorded rather than quietly absorbed: at the dock's HEAD (`f6bdcf591`,
    // cure 3) the section already composed 394 units against this 383 and the arm was RED —
    // the two faces cure 3 seated (the archiver's observation and the public) and its
    // re-cut were never carried onto this line. The draft gate's three pools take it to 448
    // (+45 wording faces, +9 spines re-cut, nothing removed), and the number is moved to
    // what the builders actually compare. A UNIT COUNT ONLY RISES while the REWRITE runs;
    // the arm that reds on a FALL is the shift register's `face-count-per-variant` row.
    // ⭐ MOVED AGAIN AT THE 8b DS-DEF-2 DRAFT GATE'S SECOND SITTING: five more pools of the
    // block take the section 448 → 579 (+131 wording faces, +15 spines re-cut, nothing
    // removed). A RISE, which is the only direction this line may move while the REWRITE runs.
    // ⭐⭐ MOVED AGAIN AT THE DRAFT GATE'S THIRD SITTING: five more pools of the block take the
    // section 579 → 712 (+133 wording faces, +15 spines re-cut, nothing removed). A sixth packet
    // was REFUSED at that gate (`Disasters & Famine: granary AND parish care only`) and its three
    // shipped spine rows are still counted here as three units, unchanged. A RISE, which is the
    // only direction this line may move while the REWRITE runs.
    // ⭐⭐⭐ MOVED AGAIN AT THE 8b DS-DEF-2 CURE GATE (v3), BY THE REFUSED POOL AND BY NOTHING
    // ELSE: `Disasters & Famine: granary AND parish care only`, whose cure removes the one
    // PROVENANCE citation the draft gate refused it for, lands its 3 spines and 22 faces and
    // takes the section 712 → 734 (+22 wording faces; its three spine rows were already counted
    // here as three units, so the spines add nothing). The other five packets this gate applied
    // re-cut wordings inside counts they already had and move this line by ZERO. A RISE, which
    // is the only direction this line may move while the REWRITE runs.
    // ⭐⭐⭐⭐ MOVED AGAIN AT THE 8b DS-DEF-2 DRAFT GATE (v3, sitting 4), BY THE BLOCK'S LAST SIX
    // POOLS AND BY NOTHING ELSE. All six packets were APPLIED — nothing was refused at this gate —
    // and they take the section 734 → 889 (+155 wording faces; the eighteen spine rows were already
    // counted here as eighteen units, so the re-cut spines add nothing). With this commit every one
    // of DS-DEF-2's twenty-six pools carries faces and no pool of the block is a bare spine.
    // A RISE, which is the only direction this line may move while the REWRITE runs.
    expect(total, 'the units actually compared').toBe(889);
    // AND THE FLAG IS A FLAG: without `bareSpine` the lib answers the SHAPE REPORT's question
    // (the units a corpus LICENSES), which on a spine pool is none. The two populations are
    // different on purpose, and this is the line that says so.
    expect(libUnitsOfPool(CORPUS_ALL, 'DS-DEF-11', 'WALLED-STRAINED'), 'a spine licenses no'
      + ' composed unit, which is the shape report\'s subject').toEqual([]);
    expect(libUnitsOfPool(CORPUS_ALL, 'DS-DEF-11', 'WALLED-STRAINED', { bareSpine: true }).length)
      .toBe(2);
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
    expect(existsSync(PACKETS), 'the packet root the workflow READS from').toBe(true);
  });

  it('⭐⭐ THE PACKET IT WRITES IS NAMESPACED BY DOCK, and two arms in one tree are two paths', () => {
    // ⛔ THE INCIDENT THIS ARM IS CUT FROM (SITTING §U c-1, fold NEW-2). The gate used to write
    // `${PACKETS}/measure-${arm}.json` — one path shared by every dock under the chair's
    // scratchpad — with `--arm` defaulting to `draft` and no refusal on an existing file. A
    // skeptic's bare probe destroyed laneTASTE's live round-4 draft packet that way
    // (169,324 B -> 17,245 B). 8b runs arms A and B concurrently by design, so this is the
    // FALSE-GREEN INSTRUMENT class: a folder would read another run's figures under this
    // run's name and could not tell.
    const had = Object.prototype.hasOwnProperty.call(process.env, 'PACKETS');
    const previous = process.env.PACKETS;
    delete process.env.PACKETS;
    try {
      // (i) TWO ARMS IN ONE TREE ARE TWO PATHS.
      const armA = packetTargetFor({ arm: 'A' });
      const armB = packetTargetFor({ arm: 'B' });
      expect(armA).not.toBe(armB);
      expect(path.dirname(armA), 'and they share this dock\'s own packet directory')
        .toBe(path.dirname(armB));
      expect(path.basename(armA)).toBe('measure-A.json');

      // (ii) TWO DOCKS ARE TWO DIRECTORIES — the half the filename alone cannot give, and the
      // half the incident needed.
      expect(packetDirFor('/tmp/scratch/laneONE'))
        .not.toBe(packetDirFor('/tmp/scratch/laneTWO'));
      expect(packetDirFor('/tmp/scratch/laneONE')).toBe(path.join('/tmp/scratch/packets', 'laneONE'));

      // (iii) IT IS NEVER THE WRITERS' SHARED ROOT, and never inside the worktree — an
      // untracked directory in the dock would break the porcelain-0 law every gate run is
      // held to, which is why the namespace sits BESIDE the docks.
      expect(path.dirname(armA)).not.toBe(PACKETS);
      expect(armA.startsWith(`${ROOT}${path.sep}`), 'the packet must not land inside the dock')
        .toBe(false);

      // (iv) `--out` names the whole path; `$PACKETS` names the directory.
      expect(packetTargetFor({ arm: 'A', out: '/tmp/somewhere/mine.json' }))
        .toBe(path.resolve('/tmp/somewhere/mine.json'));
      process.env.PACKETS = '/tmp/env-packets';
      expect(packetTargetFor({ arm: 'draft' }))
        .toBe(path.join(path.resolve('/tmp/env-packets'), 'measure-draft.json'));
    } finally {
      if (had) process.env.PACKETS = previous; else delete process.env.PACKETS;
    }
  });

  it('⭐⭐ A FOREIGN PACKET IS REFUSED — another arm, or a LATER round, is never overwritten', () => {
    // The exact incident, as a row: a bare `--arm draft --round 0` probe against a live
    // round-4 draft packet.
    const live = { arm: 'draft', round: 4, at: '2026-09-09T05:58:55' };
    const bare = packetRefusal({ existing: live, arm: 'draft', round: 0 });
    expect(bare, 'a bare probe must not clobber a round-4 measurement').toBeTruthy();
    expect(bare).toContain('LATER measurement');
    expect(bare).toContain('round 4');
    expect(bare).toContain('2026-09-09T05:58:55');
    expect(bare).toContain('--out');
    // The other shape of foreign: a sibling arm's file, reached through `--out`.
    const other = packetRefusal({ existing: { arm: 'A', round: 1 }, arm: 'B', round: 1 });
    expect(other).toContain('belongs to another run');
    expect(other).toContain('arm "A"');
    // ⛔ AND THE CONTROL, because a refusal that refused everything would be useless: the
    // workflow's own progress is allowed. Same arm at the same round (a re-run), same arm at a
    // later round (the next round), and no file at all.
    expect(packetRefusal({ existing: live, arm: 'draft', round: 4 }), 're-running a round')
      .toBeNull();
    expect(packetRefusal({ existing: live, arm: 'draft', round: 5 }), 'the next round').toBeNull();
    expect(packetRefusal({ existing: null, arm: 'draft', round: 0 }), 'nothing there').toBeNull();
    expect(packetRefusal({ existing: {}, arm: 'draft', round: 0 }), 'a file with no header'
      + ' is not a packet').toBeNull();
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
    // THE THREE NUMBERS AT THE ENTRY GRAIN are REPORTED CONSTANTS, READ BY NO VERDICT
    // (ADDENDUM 18 ruling 1, 2026-09-12): the scorer still computes `budgetOk` / `depthOk`
    // from them — budget two thirds, depth 1.75 — and the values are pinned here because the
    // ruling's reversal clause restores `ENTRY_NUMBERS.depth` as a gate arm, which only means
    // something while the constant is what §16.2 cut.
    expect(ENTRY_NUMBERS.depth).toBe(1.75);
    expect(Math.round(ENTRY_NUMBERS.budgetShare * 3)).toBe(2);
    expect(typeof position.budgetOk).toBe('boolean');
    expect(typeof position.depthOk).toBe('boolean');
    // AND NO VERDICT READS THEM: a face with both flags false is reported, never refused.
    const breached = inBandOf({
      band: [{ ...cleanBand(1)[0], budgetOk: false, depthOk: false, deepest: { metric: 'punctuation.colonRate', depth: 6.987, side: 'over' } }],
      lengths: cleanLengths,
      owned: null,
    });
    expect(breached.inBand).toBe(true);
    expect(breached.failing).toEqual([]);
    expect(breached.report.depth.map((r) => r.measure)).toEqual(['band depth · punctuation.colonRate (over)']);
    expect(breached.report.budget.map((r) => r.measure)).toEqual(['band budget']);
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
    if (!TASTE_POOLS_LANDED) {
      // The rungs a tie is possible on are the rungs a MODIFIER can seat at, and this tree has
      // none — the harness must say so rather than report a tie rate of zero on no rungs.
      const ties = tieRate(['a', 'b', 'c']);
      expect(ties.multiCandidateRungs, 'NOT-EXECUTABLE: no rung takes two candidates').toBe(0);
      expect(ties.note, 'and the harness says why, rather than printing 0 bp').not.toBe('');
      return;
    }
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

describe('⭐⭐ AN UNWRITTEN SET MUST NOT READ AS A CLEAN ONE, and the rule stays armed', () => {
  // ⛔ WHY THIS ARM IS A PLANT AND NOT A READING OF THE CORPUS. Until car M-9 this rule was held
  // by asserting that every one of the seven pools STILL CARRIED the marker — a statement about
  // the corpus's state on the day it was written, not about the harness's rule. The draft rounds
  // wrote the seven pools, the state changed, and the arm went red without a single defect: it
  // was measuring the wrong thing. The rule is now planted on the row builder the harness itself
  // calls, so it holds however many pools have been written.
  const rounds = {
    draftRounds: 0, rounds: [], refineA: false, refineB: false, files: [],
  };
  it('PLANT: a pool whose variants carry the marker is WITHHELD, out of band, every measure NOT-EXECUTABLE', () => {
    const row = withheldPoolRow({ block: 'DS-DEF-11', pool: 'country: pressed (walled)', dir: 'def11-country-walled' }, {
      variants: [{ text: `${AUTHORING_MARKER} to be written`, wordings: [] }, { text: 'A written line.', wordings: [] }],
      marked: [{ text: `${AUTHORING_MARKER} to be written` }],
      attach: ['WALLED-STRAINED'],
      rateBp: 6693,
      departure: 0,
      rounds,
    });
    expect(row.verdict).toBe('WITHHELD');
    expect(row.why, 'the marker is NAMED in the reason').toContain(AUTHORING_MARKER);
    expect(row.walk, 'no measure is answered on an unwritten set').toBeNull();
    expect(row.band).toBeNull();
    expect(row.units).toBe(0);
    // ⛔ AND IT IS NEVER IN BAND. An unwritten set with no owned finding would otherwise satisfy
    // car M-9's own rule ("zero owned findings and every face inside every band") vacuously.
    expect(row.inBand).toBe(false);
    expect(row.failing[0].value).toContain(AUTHORING_MARKER);
    expect(row.owned, 'and there is no writers\' grain to report').toBeNull();
    expect(row.inheritedCount).toBe(0);
  });

  it('DRIVES THE WHOLE MEASURE and reports each pool at BOTH grains, consistently', async () => {
    // ⛔ THE HARNESS ITSELF, NOT A RE-IMPLEMENTATION OF IT. The two cheap sections are turned
    // off (no `--base`, no `--variety`) because this arm is about the VERDICT rule and not
    // about the classifier, and both of those declare themselves NOT-EXECUTABLE by name.
    const out = await measure({
      arm: 'walker-arm', round: 0, base: null, variety: 0, exemplars: EXEMPLAR_DIR,
    });
    expect(out.pools).toHaveLength(TASTE_POOLS.length);
    if (!TASTE_POOLS_LANDED) {
      // ⛔ THE HARNESS STILL RUNS END TO END and still emits a row per named pool; what it
      // cannot do is measure one. The arm holds it to that: every row NOT-EXECUTABLE with a
      // named reason and no measure answered, which is a different green from "seven clean
      // pools" and would red the moment a row came back measured on an absent pool.
      for (const pool of out.pools) {
        const at = `${pool.block} :: ${pool.pool}`;
        expect(pool.verdict, `${at}: the WORD a reader sees is not PASS`).toBe('NOT-EXECUTABLE');
        expect(pool.units, `${at}: an absent pool composes no unit`).toBe(0);
        expect(pool.walk, `${at}: and no measure is answered on it`).toBeNull();
        expect(pool.band, `${at}: nor any band position`).toBeNull();
        expect(pool.inBand, `${at}: an unmeasured set is never in band`).toBe(false);
        expect(String(pool.why), `${at}: the row carries its own reason`).not.toBe('');
        expect(pool.failing, `${at}: and exactly one failing row names the unit set`)
          .toHaveLength(1);
      }
      expect(out.walk.totalUnits, 'and the walk sums to nothing at all').toBe(0);
      expect(tableLines(out).join('\n')).toContain('NOT-EXECUTABLE');
      return;
    }
    for (const pool of out.pools) {
      const at = `${pool.block} :: ${pool.pool}`;
      const marked = CORPUS[pool.block].pools[pool.pool]
        .filter((v) => String(v.text).includes(AUTHORING_MARKER));
      if (marked.length > 0) {
        expect(pool.verdict, at).toBe('WITHHELD');
        expect(pool.why, 'the marker is NAMED in the reason').toContain(AUTHORING_MARKER);
        expect(pool.walk, 'and no measure is answered on an unwritten set').toBeNull();
        expect(pool.band).toBeNull();
        expect(pool.units).toBe(0);
        expect(pool.inBand, 'an unwritten set is never in band').toBe(false);
        continue;
      }
      // A WRITTEN SET IS MEASURED AT BOTH GRAINS, and the two are arithmetically consistent.
      expect(pool.units, at).toBeGreaterThan(0);
      expect(pool.walk, at).not.toBeNull();
      expect(pool.band, at).not.toBeNull();
      const unitTotal = pool.walk.verdicts.FAIL + pool.walk.verdicts.WITHHELD + pool.walk.verdicts.PASS;
      const ownedTotal = pool.owned.verdicts.FAIL + pool.owned.verdicts.WITHHELD
        + pool.owned.verdicts.PASS;
      expect(unitTotal, at).toBe(pool.units);
      expect(ownedTotal, 'every unit takes an owned verdict too').toBe(pool.units);
      // ⛔ EVERY FINDING IS ACCOUNTED FOR EXACTLY ONCE. A scope that silently DROPPED a finding
      // would read as clean, which is the one failure this whole car could introduce.
      expect(pool.owned.findingCount + pool.inheritedCount, `${at}: owned + inherited = the walk`)
        .toBe(pool.walk.findingCount);
      // THE OWNED GRAIN IS NEVER HARSHER THAN THE UNIT GRAIN: it is a subset of the findings.
      expect(pool.owned.verdicts.PASS).toBeGreaterThanOrEqual(pool.walk.verdicts.PASS);
      // AND THE VERDICT IS ITS OWN REASON LIST, never a second opinion beside it.
      expect(pool.inBand, at).toBe(pool.failing.length === 0);
      expect(pool.spineWithheld).toBe(pool.inheritedCount > 0);
      for (const row of pool.inherited) {
        expect(pool.attach, `${at}: an inherited row names a spine of this pool's attach set`)
          .toContain(row.spineKey);
        expect(row.count).toBeGreaterThan(0);
      }
      for (const row of pool.qVocabulary) {
        expect(row.klass === undefined || row.klass === 'Q').toBe(true);
        expect(typeof row.synonymTable).toBe('string');
      }
    }
    // THE WALK'S POPULATION IS THE POOLS' OWN, summed, and never some other set.
    expect(out.walk.totalUnits).toBe(out.pools.reduce((n, p) => n + p.units, 0));
    expect(out.manifest.executable).toBe(false);
    expect(out.variety.executable).toBe(false);
    // AND THE TABLE A GATE AGENT READS CARRIES BOTH GRAINS, seven times.
    const table = tableLines(out).join('\n');
    expect(table.match(/inBand (?:YES|NO)/g) || []).toHaveLength(TASTE_POOLS.length);
    expect(table).toContain('NOT-EXECUTABLE');
  }, 120_000);

  it('holds every taste pool wholly written or wholly unwritten, and never half', () => {
    if (!TASTE_POOLS_LANDED) {
      expect(TASTE_POOLS_ABSENT, 'NOT-EXECUTABLE: a pool that does not exist is neither written'
        + ' nor half-written').toHaveLength(TASTE_POOLS.length);
      return;
    }
    for (const { block, pool } of TASTE_POOLS) {
      const variants = CORPUS[block].pools[pool];
      const marked = variants.filter((v) => String(v.text).includes(AUTHORING_MARKER));
      // A HALF-WRITTEN SET is a projection refusal and must never reach the harness, where the
      // marker branch would declare the WHOLE pool not-executable and hide the written half.
      expect([0, variants.length], `${block} :: ${pool} is half-written`).toContain(marked.length);
      expect(unitsOfPool(block, pool).length).toBeGreaterThan(0);
    }
  });
});

// ── ⭐⭐ CAR M-9: THE GATE JUDGES THE MODIFIER AND THE JOINT ─────────────────────────

/**
 * THE FIXTURE CARRIES THE SHIPPED SHAPE, and the arm below proves it does: a piece row with the
 * role, key, text, slots, marks and seat `unitsOfPool` itself emits, arranged as the composer
 * arranges it (`spine + ' ' + modifier`, verbatim). A fixture whose shape drifted from the
 * shipped one would exercise nothing, which is the way an arm goes blind while reading green.
 */
const SPINE_TEXT = 'The wall is kept up out of the town\'s own purse; stone keeps itself, and wages do not.';
const FACE_TEXT = 'The watch is bought where the muster fell short.';
const fixtureUnit = () => ({
  blockId: 'DS-DEF-11',
  poolKey: 'WALLED-STRAINED',
  text: `${SPINE_TEXT} ${FACE_TEXT}`,
  pieces: [
    {
      role: 'spine', key: 'WALLED-STRAINED', text: SPINE_TEXT, slots: [], marks: [],
    },
    {
      role: 'modifier',
      key: 'watch: bought (revealed)',
      text: FACE_TEXT,
      slots: [],
      marks: [],
      relation: 'addition',
      declaredRelation: 'addition',
      seat: 'sentence',
    },
  ],
});
/** An entry-walker finding, in `entryWalker.finding`'s own shape. */
const entryFinding = (clause) => ({
  id: 'DS-DEF-11 :: WALLED-STRAINED',
  klass: 'Q',
  arm: 'a trailing coordinate naming no second field',
  clause,
  column: '(second typed field)',
  value: 'none',
  description: 'R-DA-03 licenses a QUALIFY by a SECOND typed field; this segment names none',
});
/** A result in `walkComposed`'s own shape, with the planted rows on the named channel. */
const plantedResult = ({ entryWithheld = [], composedFails = [], composedWithheld = [] } = {}) => ({
  entry: {
    fails: [], withheld: entryWithheld, notes: [], notExecutable: [],
  },
  composed: {
    fails: composedFails, withheld: composedWithheld, reports: [], notExecutable: [],
  },
});
/** A band with every face inside it, in `bandPositionOf`'s own return shape. */
const cleanBand = (faces) => Array.from({ length: faces }, (_, face) => ({
  vid: 0,
  face,
  executable: true,
  sentences: 1,
  scored: 12,
  exceeded: 3,
  exceededShare: 0.25,
  deepest: { metric: 'shapes.adverbsPerSentence', depth: 0.4, side: 'over' },
  meanDistanceFromMedian: 0.5,
  budgetOk: true,
  depthOk: true,
  perfectionSuspect: false,
}));
const cleanLengths = { form: 'sentence', ceiling: null, rows: [{ vid: 0, faces: [9, 9, 9, 9] }] };

describe('⭐⭐ CAR M-9: a finding is sited on the spine, the modifier or the joint', () => {
  it('THE FIXTURE IS THE SHIPPED SHAPE — the same piece rows unitsOfPool emits', () => {
    const real = unitsOfPool('DS-DEF-11', 'watch: bought (revealed)');
    if (!TASTE_POOLS_LANDED) {
      // ⛔ NOT-EXECUTABLE, AND IT IS THE ONE THAT COSTS SOMETHING. This arm is what keeps the
      // fixture below honest: without a real unit to compare against, the fixture's shape is
      // asserted only against itself. The internal half still runs; the SHAPE half is owed to
      // 8b, and is recorded on the receipt as the one arm this car could not keep armed.
      expect(real, 'the pool this arm compares against is refused to 8b').toEqual([]);
      expect(fixtureUnit().text)
        .toBe(`${fixtureUnit().pieces[0].text} ${fixtureUnit().pieces[1].text}`);
      return;
    }
    expect(real.length, 'the shipped pool composes units to compare against').toBeGreaterThan(0);
    const shape = (unit) => unit.pieces.map((p) => Object.keys(p).sort().join(','));
    expect(shape(fixtureUnit())).toEqual(shape(real[0]));
    expect(fixtureUnit().text).toBe(`${fixtureUnit().pieces[0].text} ${fixtureUnit().pieces[1].text}`);
    expect(real[0].text).toBe(`${real[0].pieces[0].text} ${real[0].pieces[1].text}`);
  });

  it('sites a clause by WHERE IT LIES, and reads an unlocatable one at the joint', () => {
    const unit = fixtureUnit();
    expect(siteOfFinding(entryFinding('stone keeps itself, and wages do not.'), unit).site).toBe('spine');
    expect(siteOfFinding(entryFinding('The watch is bought where the muster fell short.'), unit).site).toBe('modifier');
    // A clause that CROSSES the boundary belongs to neither half, so it is the joint's.
    expect(siteOfFinding(entryFinding('do not. The watch is bought'), unit).site).toBe('joint');
    // ⛔ AND SO IS ONE WITH NO EVIDENCE AT ALL: the default is OWNED, never inherited, because
    // excusing an unattributable finding as the spine's is the only direction that hides a defect.
    expect(siteOfFinding(entryFinding(''), unit).site).toBe('joint');
    // THE CROSS-PIECE ARMS ARE THE JOINT'S BY CONSTRUCTION.
    expect(siteOfFinding({ arm: 'A1', subject: 'restatement', value: 'wall: kept vs kept' }, unit).site).toBe('joint');
    expect(siteOfFinding({ arm: 'A2', subject: 'no row', value: 'a | b' }, unit).site).toBe('joint');
    // A13 NAMES ITS PIECE BY KEY, and the key itself carries a colon, so the reader may not split on one.
    expect(siteOfFinding({ arm: 'A13', subject: 'a holder with no institution', value: 'watch: bought (revealed): muster' }, unit).site).toBe('modifier');
    expect(siteOfFinding({ arm: 'A13', subject: 'a holder with no institution', value: 'WALLED-STRAINED: rolls' }, unit).site).toBe('spine');
  });

  it('PLANT 1 — a Q finding on the SPINE is INHERITED: owned clean, and the pool is IN BAND', () => {
    const scoped = scopedWalkOf([fixtureUnit()], () => plantedResult({
      entryWithheld: [entryFinding('stone keeps itself, and wages do not.')],
    }));
    expect(scoped.verdicts, 'the UNIT grain still withholds, which is the rewrite\'s row').toEqual({ FAIL: 0, WITHHELD: 1, PASS: 0 });
    expect(scoped.owned.verdicts, 'and the WRITERS\' grain is clean').toEqual({ FAIL: 0, WITHHELD: 0, PASS: 1 });
    expect(scoped.inheritedCount).toBe(1);
    expect(scoped.inherited[0].spineKey).toBe('WALLED-STRAINED');
    expect(scoped.inherited[0].clause).toBe('stone keeps itself, and wages do not.');
    expect(scoped.inherited[0].label).toBe('Q · a trailing coordinate naming no second field');
    expect(scoped.owned.findingCount).toBe(0);
    const verdict = inBandOf({ band: cleanBand(4), lengths: cleanLengths, owned: scoped.owned });
    expect(verdict.failing).toEqual([]);
    expect(verdict.inBand, 'a spine-withheld pool with a clean modifier IS in band').toBe(true);
  });

  it('PLANT 2 — the same finding on the MODIFIER is OWNED: still IN BAND, and named in report.composedWalk (ADDENDUM 18 ruling 1)', () => {
    const scoped = scopedWalkOf([fixtureUnit()], () => plantedResult({
      entryWithheld: [entryFinding('The watch is bought where the muster fell short.')],
    }));
    expect(scoped.owned.verdicts).toEqual({ FAIL: 0, WITHHELD: 1, PASS: 0 });
    expect(scoped.inheritedCount).toBe(0);
    expect(scoped.owned.findings[0].site).toBe('modifier');
    const verdict = inBandOf({ band: cleanBand(4), lengths: cleanLengths, owned: scoped.owned });
    // ⛔ THE SITING IS UNCHANGED AND THE VERDICT IS NOT: the owned finding is the writers' own
    // and it is REPORTED — a lexical detector's finding is not a mechanical refusal (ruling 1).
    expect(verdict.inBand).toBe(true);
    expect(verdict.failing).toEqual([]);
    expect(verdict.report.composedWalk.map((f) => f.measure)).toContain('composed walk · Q · a trailing coordinate naming no second field');
    expect(verdict.report.composedWalk.map((f) => f.measure)).toContain('composed walk · owned unit verdicts');
  });

  it('PLANT 3 — a JOINT finding counts as owned, and a FAIL is REPORTED, never a refusal (ADDENDUM 18 ruling 1)', () => {
    const jointFail = {
      id: 'x', arm: 'A2', channel: 'FAIL', subject: 'no row', value: 'forces.walls.present | security.watch', description: 'the joint has no relation row',
    };
    const scoped = scopedWalkOf([fixtureUnit()], () => plantedResult({ composedFails: [jointFail] }));
    expect(scoped.verdicts).toEqual({ FAIL: 1, WITHHELD: 0, PASS: 0 });
    expect(scoped.owned.verdicts).toEqual({ FAIL: 1, WITHHELD: 0, PASS: 0 });
    expect(scoped.inheritedCount).toBe(0);
    expect(scoped.owned.findings[0].site).toBe('joint');
    const verdict = inBandOf({ band: cleanBand(4), lengths: cleanLengths, owned: scoped.owned });
    expect(verdict.inBand).toBe(true);
    expect(verdict.failing).toEqual([]);
    expect(verdict.report.composedWalk.map((f) => f.measure)).toContain('composed walk · A2 · no row');
    expect(verdict.report.composedWalk.map((f) => f.measure)).toContain('composed walk · owned unit verdicts');
  });

  it('CONTROL — no finding at all is IN BAND; a band breach is REPORTED and refuses nothing (ADDENDUM 18 ruling 1); only the fragment word COUNT refuses', () => {
    const scoped = scopedWalkOf([fixtureUnit()], () => plantedResult());
    expect(scoped.verdicts).toEqual({ FAIL: 0, WITHHELD: 0, PASS: 1 });
    expect(scoped.owned.verdicts).toEqual({ FAIL: 0, WITHHELD: 0, PASS: 1 });
    const clean = inBandOf({ band: cleanBand(4), lengths: cleanLengths, owned: scoped.owned });
    expect(clean.inBand).toBe(true);
    expect(clean.failing).toEqual([]);
    expect(clean.report).toEqual({
      band: [], depth: [], budget: [], composedWalk: [],
    });
    // ⛔ THE BAND HALF IS STILL MEASURED AND STILL ROWED — the same figure, the same row shape —
    // and it is a REPORT: taste is judged at the pool and the block, never at the face
    // (ADDENDUM 18 ruling 1). Before the ruling this exact row refused the pool; on DS-DEF-2 it
    // held 16 of 26 pools open for one colon or one participial opener in one of twelve faces.
    const deep = cleanBand(4);
    deep[2] = {
      ...deep[2], depthOk: false, deepest: { metric: 'closers.pronounRate', depth: 10.249, side: 'over' },
    };
    const banded = inBandOf({ band: deep, lengths: cleanLengths, owned: scoped.owned });
    expect(banded.inBand).toBe(true);
    expect(banded.failing).toEqual([]);
    expect(banded.report.depth[0].measure).toBe('band depth · closers.pronounRate (over)');
    expect(banded.report.depth[0].value).toContain('10.249 band-widths on 1 of 4 face(s)');
    expect(banded.report.depth[0].band).toContain('REPORTED, refuses nothing');
    // A BAND THAT COULD NOT BE MEASURED IS REPORTED AS NOT-EXECUTABLE — honest about the
    // absent instrument, and not a refusal: the fingerprints' absence is a fact about the
    // machine, not about the face.
    const absent = inBandOf({
      band: [{ executable: false, why: 'the exemplar fingerprints are not on this machine' }],
      lengths: cleanLengths,
      owned: scoped.owned,
    });
    expect(absent.inBand).toBe(true);
    expect(absent.failing).toEqual([]);
    expect(absent.report.band[0].value).toContain('NOT-EXECUTABLE');
    // ⛔ THE ONE REFUSAL THIS FUNCTION KEEPS IS A COUNT: a fragment over its form's word ceiling.
    const long = inBandOf({
      band: cleanBand(1),
      lengths: { form: 'fragment', ceiling: 12, rows: [{ vid: 0, faces: [9, 14] }] },
      owned: scoped.owned,
    });
    expect(long.inBand).toBe(false);
    expect(long.failing[0].measure).toBe('words per face (fragment form)');
    // AND THE FLAT READER THE TABLE PRINTS FROM keeps the report's order: band, depth, budget,
    // composed walk — and answers nothing on the rows an unwritten or absent pool carries.
    expect(reportRowsOf(banded.report).map((r) => r.measure)).toEqual(['band depth · closers.pronounRate (over)']);
    expect(reportRowsOf(null)).toEqual([]);
  });

  it('names a finding in the grain the gate rounds print', () => {
    expect(labelOfFinding({ klass: 'F25', arm: 'a cited record\'s content' })).toBe('F25 · a cited record\'s content');
    expect(labelOfFinding({ arm: 'A3', subject: 'the band half is the refuter\'s' })).toBe('A3 · the band half is the refuter\'s');
  });
});

describe('⭐ ARM Q\'S VOCABULARY IS REPORTED AND NO ARM IS CHANGED', () => {
  it('says whether the clause\'s nouns map to a field the spine reads, and names the table it used', () => {
    const census = JSON.parse(readFileSync(path.join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
    const table = censusSynonymTable(census);
    // ⭐ THE TABLE LANDED AT REWRITE car 8a-6 AND THIS ARM SAID IT WOULD BE READ WHEN IT DID.
    // Until then the census shipped none and the report named what it had looked for; the
    // reader was written to find one under any of three names, and the census now writes
    // `fieldSynonyms`. The `why` is empty because there is nothing left to explain away.
    expect(table.why, 'a table ships, so the report has no absence to name').toBe('');
    expect(Object.keys(table.table).length, 'and it is not an empty object wearing a name')
      .toBeGreaterThan(0);
    expect(table.table['settlement.defenseProfile.economicGates.military'],
      'including the row SITTING §H rule 3 names').toContain('wages');
    // ⛔ AND THE ABSENCE BRANCH IS STILL LIVE, driven on a census that carries no table — the
    // half this arm used to prove on the product, kept as a plant so it cannot rot.
    const bare = censusSynonymTable({ ratifiedAliases: { rows: [1, 2, 3] } });
    expect(bare.table).toEqual({});
    expect(bare.why).toContain('fieldVocabulary');
    expect(bare.why, 'and it counts the alias rows that census DOES carry')
      .toContain('3 ratified alias row(s)');
    // AND THE READER FINDS A TABLE UNDER ANY OF THE THREE NAMES.
    const supplied = censusSynonymTable({ fieldVocabulary: { 'a.b': ['wages'] } });
    expect(supplied.why).toBe('');
    expect(supplied.table['a.b']).toEqual(['wages']);
    const inherited = [
      {
        klass: 'Q', clause: 'stone keeps itself, and wages do not.', spineKey: 'WALLED-STRAINED', count: 12,
      },
      {
        klass: 'Q', clause: 'the threat is on the town\'s books as plainly as the grain.', spineKey: 'WALLED-THREATENED', count: 12,
      },
      {
        klass: 'F25', clause: 'the books say', spineKey: 'UNWALLED-LARGE', count: 12,
      },
    ];
    const reads = {
      'WALLED-STRAINED': ['forces.walls.present', 'settlement.defenseProfile.economicGates.military'],
      'WALLED-THREATENED': ['forces.walls.present', 'settlement.config.monsterThreat'],
    };
    const report = qVocabularyReport(inherited, (key) => reads[key] || [], table);
    // ⛔ ONLY THE Q ROWS: the report is arm Q's vocabulary and not a second walk.
    expect(report).toHaveLength(2);
    // ⭐⭐ THE OWNER'S EXEMPLAR LINE, AND IT NOW MAPS (REWRITE car 8a-6). `wages` names the
    // military economic gate through the census's ratified synonym row, which is exactly the
    // join SITTING §H rule 3 asked for. Before this car it read `[]` and the report said the
    // census shipped no table; the arm is kept, and what changed is the answer.
    expect(report[0].mapped)
      .toEqual(['settlement.defenseProfile.economicGates.military (as "wages")']);
    expect(report[0].reads).toEqual(reads['WALLED-STRAINED']);
    expect(report[0].verdict).toContain('DOES name a field');
    expect(report[0].synonymTable, 'and the row names the table it used').toBe(
      'a word-level synonym table ships and was applied',
    );
    // AND THE OTHER HALF OF THE REPORT IS REAL: a clause that DOES name a field the spine reads,
    // which is the case that says the arm and the census disagree rather than the writer erring.
    expect(report[1].mapped).toEqual(['settlement.config.monsterThreat (as "threat")']);
    expect(report[1].verdict).toContain('DOES name a field');
    expect(report.every((r) => r.executable)).toBe(true);
  });

  it('⛔ DECLARES ITSELF NOT-EXECUTABLE where no text could claim the census reading', () => {
    const table = { table: {}, why: 'none ships' };
    const q = (spineKey) => [{
      klass: 'Q', clause: 'and wages do not.', spineKey, count: 1,
    }];
    // THE SYNTHETIC TABLE LABEL — DS-DEF-2's own shipped reading since SEAM car 3h. A report
    // that answered "maps to no field" here would be a negative answer to a question that was
    // never askable, which is exactly the shape the §908 law refuses.
    const synthetic = qVocabularyReport(q('Disasters & Famine: granary AND hospital'), () => ['disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL in defenseStateProse.js)'], table);
    expect(synthetic[0].executable).toBe(false);
    expect(synthetic[0].verdict).toContain('NOT-EXECUTABLE');
    expect(synthetic[0].verdict).toContain('synthetic table label');
    expect(synthetic[0].mapped).toEqual([]);
    // AND A SPINE THE CENSUS RECOVERED NO READING FOR AT ALL.
    const none = qVocabularyReport(q('WALLED-STRAINED'), () => [], table);
    expect(none[0].executable).toBe(false);
    expect(none[0].verdict).toContain('NOT-EXECUTABLE');
    // ⛔ THE CONTROL: a real field path IS executable, so the limb above is not swallowing
    // every row it is handed.
    const real = qVocabularyReport(q('WALLED-STRAINED'), () => ['settlement.defenseProfile.economicGates.military'], table);
    expect(real[0].executable).toBe(true);
  });

  it('the report on the SHIPPED corpus says NOT-EXECUTABLE on exactly the tabled block', async () => {
    // ⛔ THE SHIPPED SHAPE, NOT A FIXTURE: DS-DEF-2's spine reads a table label and DS-DEF-11's
    // read field paths, so a report that answered the same way on both would be blind.
    const out = await measure({
      arm: 'walker-arm-q', round: 0, base: null, variety: 0, exemplars: EXEMPLAR_DIR,
    });
    const rows = out.pools.flatMap((p) => (p.qVocabulary || []).map((r) => ({ block: p.block, ...r })));
    if (rows.length === 0) return; // every pool unwritten: nothing inherited to report on
    const def2 = rows.filter((r) => r.block === 'DS-DEF-2');
    const rest = rows.filter((r) => r.block !== 'DS-DEF-2');
    expect(def2.length, 'DS-DEF-2 carries inherited Q findings to report on').toBeGreaterThan(0);
    expect(def2.every((r) => r.executable === false)).toBe(true);
    expect(rest.every((r) => r.executable === true)).toBe(true);
  }, 120_000);
});

// ── REWRITE car 8a-5: THE FIVE PIECES SITTING §T.5 FOUND MISSING ────────────────────

describe('⭐⭐ (a) THE BAND GRAIN, CURED — the constant the sitting struck (SITTING §T.5)', () => {
  const exemplars = exemplarBands(EXEMPLAR_DIR);
  const SHORT = 'The wall is kept out of the purse.';
  const LONG = 'The wall is kept out of the purse, and the muster roll behind it was paid twice'
    + ' over in a season when the harvest came in light.';
  const REST = [
    'Grain moves upriver by autumn.',
    'The gate is shut at dusk by whoever is nearest.',
    'Tolls pay the mason before they pay the watch.',
  ];
  const corpusWith = (face) => [face, ...REST].join(' ');

  it('the split is 13 text-level and 8 word-level, and the two do not overlap', () => {
    expect(TEXT_LEVEL_METRICS.length, 'the thirteen the chair\'s probe named').toBe(13);
    expect(FACE_LEVEL_METRICS.length, 'and the eight a single sentence answers').toBe(8);
    expect(TEXT_LEVEL_METRICS.filter((m) => FACE_LEVEL_METRICS.includes(m)),
      'a metric on both sides would be scored twice').toEqual([]);
    expect(TEXT_LEVEL_METRICS.length + FACE_LEVEL_METRICS.length,
      'and together they are the twenty-one, so none is dropped').toBe(21);
  });

  it('⛔ THE OLD PATH REPRODUCES THE DEFECT EXACTLY, which is what makes the cure a cure', () => {
    if (!exemplars.bands) { expect(exemplars.why).toBeTruthy(); return; }
    // SITTING §T.5, CONFIRMED by the chair's own probe: an 8-word face, a 15-word face and the
    // draft's breach line all scored `exceeded 13/21 · share 0.619 · mean 0.486 · deepest
    // wordsPerSentence.neighbourVariation 1.597 under`. Driven here on two faces of very
    // different length, against the WHOLE 21-metric band set.
    const before = bandPositionOf(SHORT, exemplars);
    const after = bandPositionOf(LONG, exemplars);
    expect(before.scored, 'all twenty-one scored on one sentence').toBe(21);
    expect(before.exceeded).toBe(13);
    expect(before.exceededShare).toBe(0.619);
    expect(before.meanDistanceFromMedian).toBe(0.486);
    expect(before.deepest.metric).toBe('wordsPerSentence.neighbourVariation');
    expect(before.deepest.depth).toBe(1.597);
    expect(before.deepest.side).toBe('under');
    // AND THE TWO FACES ARE INDISTINGUISHABLE, which is the whole finding.
    expect({ ...after }, 'two faces of different length read the IDENTICAL tuple')
      .toEqual({ ...before });
  });

  it('⭐ THE PLANT: two faces of different length now read DIFFERENT text-grain figures', () => {
    if (!exemplars.bands) { expect(exemplars.why).toBeTruthy(); return; }
    const a = bandGrainsOf(SHORT, corpusWith(SHORT), exemplars);
    const b = bandGrainsOf(LONG, corpusWith(LONG), exemplars);
    // THE CORPUS GRAIN DISCRIMINATES, which the face grain could not.
    expect(a.corpus.scored).toBe(13);
    expect(b.corpus.scored).toBe(13);
    expect(a.corpus.exceeded === b.corpus.exceeded
      && a.corpus.meanDistanceFromMedian === b.corpus.meanDistanceFromMedian,
    'the two corpora must not read the same tuple').toBe(false);
    // AND THE FACE GRAIN READS THE SAME ONLY WHERE THE LEXICON AGREES, which here it does:
    // neither face carries a colon, an em dash, a question, an exclamation, a parenthesis, a
    // participial opener, a which-tail or a line of dialogue. That is a fact about the two
    // sentences and not a property of the instrument, so it is asserted with its reason.
    expect(a.face.exceeded, 'neither face trips a word-level band').toBe(0);
    expect(b.face.exceeded).toBe(0);
    expect(a.face.meanDistanceFromMedian).toBe(b.face.meanDistanceFromMedian);
    // ⛔ AND THE FACE GRAIN IS NOT A CONSTANT: a face that DOES carry one of the eight moves.
    const withDash = bandPositionAt('The wall is kept — and kept badly — out of the purse.', exemplars, 'face');
    expect(withDash.exceeded, 'an em dash is a word-level fact and the face grain sees it')
      .toBeGreaterThan(0);
  });

  it('every band row carries BOTH grains and says which is which', () => {
    if (!exemplars.bands) { expect(exemplars.why).toBeTruthy(); return; }
    const grains = bandGrainsOf(SHORT, corpusWith(SHORT), exemplars);
    expect(grains.face.grain).toBe('face');
    expect(grains.corpus.grain).toBe('corpus');
  });
});

describe('(b) THE SIBLING SPREAD — a distance, not a detector (SITTING §T.3 row 8)', () => {
  it('reports the distribution over a variant\'s faces, in basis points', () => {
    const spread = siblingSpreadOf([
      'The wall is kept out of the purse.',
      'The purse pays for the wall.',
      'Grain moves upriver by autumn.',
    ]);
    expect(spread.pairs, 'three faces make three pairs').toBe(3);
    expect(spread.maxOverlapBp, 'the nearest pair shares half its content words').toBe(5000);
    expect(spread.minOverlapBp, 'and the farthest shares none').toBe(0);
    expect(spread.nearest.overlapBp).toBe(spread.maxOverlapBp);
    expect(Number.isInteger(spread.medianOverlapBp), 'the median is an integer in bp').toBe(true);
  });

  it('⛔ NOT-EXECUTABLE on a one-face variant, which is every shipped variant at this tip', () => {
    const spread = siblingSpreadOf(['only one face']);
    expect(spread.pairs).toBe(0);
    expect(spread.minOverlapBp).toBeNull();
    expect(spread.why).toContain('NOT-EXECUTABLE');
  });

  it('⛔ IT SEES WHAT A5 CANNOT: a paraphrase pair with a different opener', () => {
    // A5 fires only when the opener AND the segment count AND the overlap all agree, so a
    // paraphrase that changes its first two words is invisible to it. The distance is not.
    const paraphrase = ['The muster roll is short at the wall.', 'At the wall the muster roll runs short.'];
    const spread = siblingSpreadOf(paraphrase);
    expect(spread.sameOpenerPairs, 'A5\'s opener test does NOT fire').toBe(0);
    expect(spread.maxOverlapBp, 'and the distance shows the pair for what it is')
      .toBeGreaterThanOrEqual(6000);
  });
});

describe('(c) THE EXEMPLAR CITATION RATE — with its denominator and its control', () => {
  const rate = exemplarCitationRate(EXEMPLAR_DIR);

  it('reads whichever leaves have raw prose and NAMES the ones it could not', () => {
    expect(rate.leavesTotal).toBe(EXEMPLAR_LEAVES.length);
    expect(rate.leavesRead + rate.absent.length, 'every leaf is read or named absent')
      .toBe(EXEMPLAR_LEAVES.length);
    for (const leaf of rate.absent) expect(EXEMPLAR_LEAVES).toContain(leaf);
  });

  it('⛔ THE NON-VACUITY CONTROL: a zero rate must not come from a dead detector', () => {
    // A rate of zero from prose that cites nothing and a rate of zero from a detector that
    // cannot fire are the same number and opposite findings. The control sentence is one the
    // detector must find, and the report carries its answer beside the rate.
    expect(rate.detectorLive, 'the control sentence scores above zero').toBe(true);
    if (rate.executable) {
      expect(rate.sentences, 'and the denominator is real prose').toBeGreaterThan(100);
      expect(rate.perUnitBp, 'the rate is a number in bp').toBeGreaterThanOrEqual(0);
    }
  });
});

describe('(d) THE FIXTURE SECTION — the interested fact BOTH WAYS (SITTING §T.4, C‴)', () => {
  const fixture = fixtureSection();

  it('composes the captured town and the clean control, and names their standings', () => {
    expect(fixture.executable, fixture.why || '').toBe(true);
    expect(fixture.towns.map((t) => t.label)).toEqual(['captured', 'clean']);
    const captured = fixture.towns[0];
    const clean = fixture.towns[1];
    expect(captured.standing, 'rate-9-2 is the captured town').toBe('INTERESTED');
    expect(clean.standing, 'rate-3-0 is the control and it is NOT interested').toBe('LICENSED');
    expect(captured.holder, 'and the holder is the census\'s own answer').toBeTruthy();
  });

  it('⭐ THE TWO RENDERINGS DIFFER IN EXACTLY ONE WAY, which is what the sitting is being shown', () => {
    const captured = fixture.towns[0];
    // INLINE: the DM page carries a DIFFERENT passage. PEN LINE: the same passage on both, and
    // the DM's knowledge in the adjacent slot. That contrast IS agenda C‴'s question.
    expect(captured.renderInline.passagesDiffer, 'the inline rendering splits the two pages').toBe(true);
    expect(captured.renderInline.player).not.toBe(captured.renderInline.dm);
    expect(captured.renderPenLine.passagesDiffer).toBe(false);
    expect(captured.renderPenLine.player).toBe(captured.renderPenLine.dm);
    expect(captured.renderPenLine.pen, 'and the pen carries the interested fact').toBeTruthy();
  });

  it('⛔ THE CONTROL HAS NO PEN LINE AT ALL, which is what makes the pair a pair', () => {
    const clean = fixture.towns[1];
    expect(clean.renderPenLine.pen, 'a LICENSED holder is not interested, so nothing is owed')
      .toBeNull();
    expect(clean.renderInline.passagesDiffer, 'and the inline rendering has nothing to inline')
      .toBe(false);
  });

  it('THE PAIRED-TOWN ARM at the passage grain holds on both towns', () => {
    for (const town of fixture.towns) {
      expect(town.passagesIdentical, `${town.label}: the compiled passage must be audience-independent`)
        .toBe(true);
    }
    expect(fixture.pairedTownHolds).toBe(true);
  });
});

describe('(e) `--shapes` — reached, never re-spelled', () => {
  it('returns the shape report\'s OWN lines, verbatim', () => {
    const report = shapeReport(null);
    expect(report.executable, report.why).toBe(true);
    expect(report.lines[0]).toContain('PASSAGE-SHAPE DISTRIBUTION');
    expect(report.lines.join('\n'), 'the product corpus has no shape question at this tip')
      .toContain('attach-bearing pools 0');
  });
});

describe('THE ROSTER — a desk section is a LEAF, and the partition is asserted', () => {
  it('⛔ THE SIX LEAVES COVER EVERY POOL EXACTLY ONCE', () => {
    // The first cut of this roster was a hand-written PREFIX list and it put DS-REL and DS-CND
    // on the wrong desks and DS-POP on none, leaving 29 of the 708 pools reachable from no
    // section at all. Deriving the roster from the leaves makes that impossible; asserting the
    // partition makes "impossible" a measurement.
    const cover = sectionsCoverEveryPool();
    expect(cover.sections).toBe(6);
    expect(cover.pools, 'every shipped pool').toBe(708);
    expect(cover.unreached, 'a pool no section reaches').toEqual([]);
    expect(cover.twice, 'a pool two sections claim').toEqual([]);
  });

  it('each section names its own leaf\'s pools, and a bad name is NOT-EXECUTABLE', () => {
    let total = 0;
    for (const section of Object.keys(SECTION_LEAVES)) {
      const roster = poolRosterOf({ section });
      expect(roster.rows.length, `${section} must have pools`).toBeGreaterThan(0);
      total += roster.rows.length;
      for (const row of roster.rows) {
        expect(row.dir, 'the packet directory is DERIVED from the key, never invented')
          .toMatch(/^[a-z0-9-]+$/);
      }
    }
    expect(total, 'and the six sum to the corpus').toBe(708);
    expect(poolRosterOf({ section: 'no-such-desk' }).rows).toEqual([]);
    expect(poolRosterOf({ section: 'no-such-desk' }).why).toContain('NOT-EXECUTABLE');
    expect(poolRosterOf({}).rows.length, 'and no flag at all is the taste\'s seven').toBe(7);
  });
});

describe('THE TWO-PHASE RULE, ENCODED (Part B §21.2)', () => {
  const failing = (...names) => ({ failing: names.map((measure) => ({ measure })) });

  it('a lawful set KEEPS only if it stays lawful', () => {
    expect(keepOrRevert(failing(), failing()).verdict).toBe('KEEP');
    expect(keepOrRevert(failing(), failing('band depth')).verdict).toBe('REVERT');
  });

  it('an unlawful set KEEPS if its failures fall or hold with NONE NEW', () => {
    expect(keepOrRevert(failing('a', 'b'), failing('a')).verdict).toBe('KEEP');
    expect(keepOrRevert(failing('a'), failing('a')).verdict, 'holding is not losing').toBe('KEEP');
  });

  it('⛔ THE TRADE IS A REVERT, and a count test would have passed it', () => {
    // Two failures traded one for one hold the COUNT and move the set sideways. §21.2 says
    // "with no new failure" in terms, so the rule is by measure NAME.
    const verdict = keepOrRevert(failing('a', 'b'), failing('a', 'c'));
    expect(verdict.verdict).toBe('REVERT');
    expect(verdict.before).toBe(verdict.after);
    expect(verdict.newFailures).toEqual(['c']);
    expect(verdict.cured).toEqual(['b']);
  });

  it('two DRY rounds BANK an unlawful set, and never a lawful one', () => {
    expect(keepOrRevert(failing('a'), failing('a'), { dryRounds: 2 }).verdict).toBe('BANK');
    expect(keepOrRevert(failing('a'), failing(), { dryRounds: 2 }).verdict,
      'a set that became lawful on the second dry round is not banked').toBe('KEEP');
  });

  it('a KEEP names its own limit — the gate is not the refuters (SITTING §T.4)', () => {
    expect(keepOrRevert(failing(), failing()).why).toContain('refuters');
  });
});
