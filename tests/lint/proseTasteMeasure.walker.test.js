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
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import {
  ENTRY_NUMBERS, EXEMPLAR_DIR, EXEMPLAR_LEAVES, PACKETS, bandPositionOf, censusSynonymTable,
  exemplarBands, inBandOf, labelOfFinding, measure, qVocabularyReport, roundsOf, sampleSizeFor,
  scopedWalkOf, siteOfFinding, tableLines, tieRate, unitsOfPool, withheldPoolRow,
} from '../../scripts/taste-measure.mjs';
import { AUTHORING_MARKER } from '../../scripts/lib/dossier-annex-grammar.mjs';
import { TASTE_POOLS } from '../../scripts/prose-licence-card.mjs';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';

const CORPUS = { ...DOSSIER_STATE_PROSE_DEFENSE, ...DOSSIER_STATE_PROSE_GENERAL };
const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '../..');

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

  it('PLANT 2 — the same finding on the MODIFIER is OWNED: out of band, and named in failing[]', () => {
    const scoped = scopedWalkOf([fixtureUnit()], () => plantedResult({
      entryWithheld: [entryFinding('The watch is bought where the muster fell short.')],
    }));
    expect(scoped.owned.verdicts).toEqual({ FAIL: 0, WITHHELD: 1, PASS: 0 });
    expect(scoped.inheritedCount).toBe(0);
    expect(scoped.owned.findings[0].site).toBe('modifier');
    const verdict = inBandOf({ band: cleanBand(4), lengths: cleanLengths, owned: scoped.owned });
    expect(verdict.inBand).toBe(false);
    expect(verdict.failing.map((f) => f.measure)).toContain('composed walk · Q · a trailing coordinate naming no second field');
    expect(verdict.failing.map((f) => f.measure)).toContain('composed walk · owned unit verdicts');
  });

  it('PLANT 3 — a JOINT finding counts as owned, and a FAIL carries the pool out of band', () => {
    const jointFail = {
      id: 'x', arm: 'A2', channel: 'FAIL', subject: 'no row', value: 'forces.walls.present | security.watch', description: 'the joint has no relation row',
    };
    const scoped = scopedWalkOf([fixtureUnit()], () => plantedResult({ composedFails: [jointFail] }));
    expect(scoped.verdicts).toEqual({ FAIL: 1, WITHHELD: 0, PASS: 0 });
    expect(scoped.owned.verdicts).toEqual({ FAIL: 1, WITHHELD: 0, PASS: 0 });
    expect(scoped.inheritedCount).toBe(0);
    expect(scoped.owned.findings[0].site).toBe('joint');
    const verdict = inBandOf({ band: cleanBand(4), lengths: cleanLengths, owned: scoped.owned });
    expect(verdict.inBand).toBe(false);
    expect(verdict.failing.map((f) => f.measure)).toContain('composed walk · A2 · no row');
  });

  it('CONTROL — no finding at all is IN BAND, and a band breach alone carries it out', () => {
    const scoped = scopedWalkOf([fixtureUnit()], () => plantedResult());
    expect(scoped.verdicts).toEqual({ FAIL: 0, WITHHELD: 0, PASS: 1 });
    expect(scoped.owned.verdicts).toEqual({ FAIL: 0, WITHHELD: 0, PASS: 1 });
    expect(inBandOf({ band: cleanBand(4), lengths: cleanLengths, owned: scoped.owned }).inBand).toBe(true);
    // ⛔ THE BAND HALF IS NOT SCOPED AWAY: a face outside its band is the writer's own defect
    // whatever the spine does, so it carries the pool out of band on its own.
    const deep = cleanBand(4);
    deep[2] = {
      ...deep[2], depthOk: false, deepest: { metric: 'closers.pronounRate', depth: 10.249, side: 'over' },
    };
    const banded = inBandOf({ band: deep, lengths: cleanLengths, owned: scoped.owned });
    expect(banded.inBand).toBe(false);
    expect(banded.failing[0].measure).toBe('band depth · closers.pronounRate (over)');
    expect(banded.failing[0].value).toContain('10.249 band-widths on 1 of 4 face(s)');
    // AND SO DOES A BAND THAT COULD NOT BE MEASURED: NOT-EXECUTABLE is never a pass.
    const absent = inBandOf({
      band: [{ executable: false, why: 'the exemplar fingerprints are not on this machine' }],
      lengths: cleanLengths,
      owned: scoped.owned,
    });
    expect(absent.inBand).toBe(false);
    expect(absent.failing[0].value).toContain('NOT-EXECUTABLE');
    // AND A FRAGMENT OVER ITS FORM'S WORD CEILING.
    const long = inBandOf({
      band: cleanBand(1),
      lengths: { form: 'fragment', ceiling: 12, rows: [{ vid: 0, faces: [9, 14] }] },
      owned: scoped.owned,
    });
    expect(long.inBand).toBe(false);
    expect(long.failing[0].measure).toBe('words per face (fragment form)');
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
    // AT THIS TIP THE CENSUS SHIPS NONE, and the report says so by naming what it looked for
    // rather than by asserting an absence a reader cannot check.
    expect(table.table).toEqual({});
    expect(table.why).toContain('fieldVocabulary');
    expect(table.why, 'and it counts the alias rows the census DOES carry')
      .toContain(`${census.ratifiedAliases.rows.length} ratified alias row(s)`);
    // ⛔ AND THE READER IS NOT BLIND TO A TABLE THAT LANDS LATER: a census carrying one is read.
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
    // THE OWNER'S EXEMPLAR LINE: `wages` names the pay gate and the arm's vocabulary cannot see it.
    expect(report[0].mapped).toEqual([]);
    expect(report[0].reads).toEqual(reads['WALLED-STRAINED']);
    expect(report[0].verdict).toContain('names no field');
    expect(report[0].synonymTable).toBe(table.why);
    // AND THE OTHER HALF OF THE REPORT IS REAL: a clause that DOES name a field the spine reads,
    // which is the case that says the arm and the census disagree rather than the writer erring.
    expect(report[1].mapped).toEqual(['settlement.config.monsterThreat (as "threat")']);
    expect(report[1].verdict).toContain('DOES name a field');
  });
});
