/**
 * composeStateProse.test.js — ARCH-COMPOSED-PROSE car 3a: THE SEAM, PROVEN UNREACHABLE.
 *
 * WHAT THIS SUITE HAS TO ESTABLISH, and why the order of the arms is the order of the risk:
 *
 *   1. THE SEAM COMPOSES TO THE KERNEL. With an EMPTY candidate list and no turn, the
 *      composer's text IS `readStateProse`'s and its `pieces` ARE the composed-prose
 *      manifest's base-side synthesis. Cars 3b–3g route six desks through this code on the
 *      strength of that equality, and they are accepted on a manifest that cannot move — so
 *      if the equality is only approximately true, six cars land a silent rewrite.
 *      Driven twice: over the whole shipped corpus (708 pools, both audiences, six seeds)
 *      against the kernel, and over EVERY CELL of the DRIFT corpus against car 1's recorder.
 *
 *   2. EVERY LIMB IT SHIPS IS EXECUTED. The composed model's own laws — the comparator, the
 *      fact budget, the seats, the position budget, the audience-first candidate stage, the
 *      drop-and-continue — have no content to run on today, so they are driven by FIXTURE.
 *      A law that ships with no arm is a paragraph, and this estate has paid for those.
 *
 *   3. THE STATEMENTS ABOUT THE SHIPPED CORPUS ARE MEASURED, NOT ASSERTED. "No clause can
 *      seat today" and "no turn can seat today" are consequences of two empty leaves and an
 *      absent `poolMeta`, and both are read off the tree here rather than believed.
 *
 * ⛔ WHAT THIS SUITE CANNOT DO, said here rather than discovered at car 3b. The recorder
 * cannot see a desk's SLOT BAG — it lives inside the desk call, which is why the manifest
 * identifies a cell's variant from the rendered sentence rather than by recomputing the draw
 * (a recomputation over the audible pool disagrees on thousands of cells). So no arm here can
 * compose a RECORDED CELL end to end: what is pinned per cell is the composer's own
 * COORDINATE RULE, driven on the live pool through the exported `composedPieceOf`, and what
 * is pinned end to end is the composer against the kernel over the whole corpus. The
 * remaining half — the desk's own bag flowing through the composer — is exactly what cars
 * 3b–3g prove, one desk at a time, on a manifest that must not move.
 *
 * @enforced-by npx vitest run tests/domain/composeStateProse.test.js
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import {
  CAR_4_LEAF_SPECIFIERS,
  CLAUSE_SEAT,
  COMPOSITION_BOUNDS,
  CONNECTIVES,
  PROSE_NORMS,
  PROSE_RELATIONS,
  RELATIONS,
  SENTENCE_SEAT,
  composeStateProse,
  composeStateProseMount,
  composedPieceOf,
} from '../../src/domain/display/stateProse/composeStateProse.js';
import {
  ARCHIVER_SOURCE, FULL_STOP_JOINT, STATE_MARK_DIMENSIONS, WEIGH_KIND,
  pairJoint, poolDimensions, readStateProse,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_CONNECTIVES } from '../../src/data/dossierConnectives.generated.js';
import { drawnAtMount } from '../../src/domain/display/stateProse/dossierMounts.js';
import { defenseStateProseCandidates } from '../../src/domain/display/stateProse/defenseStateProseCandidates.js';
import { economyStateProseCandidates } from '../../src/domain/display/stateProse/economyStateProseCandidates.js';
import { generalStateProseCandidates } from '../../src/domain/display/stateProse/generalStateProseCandidates.js';
import { powerStateProseCandidates } from '../../src/domain/display/stateProse/powerStateProseCandidates.js';
import { stressorsStateProseCandidates } from '../../src/domain/display/stateProse/stressorsStateProseCandidates.js';
import { warFaithStateProseCandidates } from '../../src/domain/display/stateProse/warFaithStateProseCandidates.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { driftRun } from '../helpers/dossierManifest.js';
import { ROOT } from '../helpers/dossierCorpus.js';

/**
 * THE SHIPPED CORPUS, all six state leaves merged on block id — which is the shape a desk
 * hands the composer, and which is only legal because a block lives in exactly one leaf. The
 * merge asserts that rather than assuming it.
 * @type {Record<string, {pools: Record<string, Array<object>>}>}
 */
const CORPUS = {};
/** @type {string[]} */
const BLOCK_COLLISIONS = [];
const LEAF_DIR = join(ROOT, 'src/data/dossierStateProse');
for (const file of readdirSync(LEAF_DIR).filter((f) => f.endsWith('.generated.js')).sort()) {
  const mod = await import(/* @vite-ignore */ `file://${join(LEAF_DIR, file)}`);
  const table = /** @type {Record<string, any>} */ (Object.values(mod)[0]);
  for (const [blockId, block] of Object.entries(table)) {
    if (CORPUS[blockId]) BLOCK_COLLISIONS.push(blockId);
    CORPUS[blockId] = block;
  }
}

/** Every (block, pool) of the shipped corpus, flat. */
const SHIPPED_POOLS = Object.entries(CORPUS).flatMap(([blockId, block]) => Object
  .entries(block.pools || {}).map(([poolKey, pool]) => ({ blockId, poolKey, pool })));

/** ONE RUN for the whole suite — the golden master's 525 configurations at both faces. */
const run = await driftRun();

/** The seeds the corpus sweep reads. The empty string is the imported town's. */
const SWEEP_SEEDS = ['', 'a', 'seed-1', 'Thornwall::1', 'town-42', 'zz'];

/** A bag filling every slot any variant of the pool names, so a fill never fails. */
function bagFor(pool) {
  /** @type {Record<string, string>} */
  const slots = {};
  for (const variant of pool) for (const slot of variant.slots || []) slots[slot] = 'Thornwall';
  return slots;
}

/** An answer for every dimension the pool partitions itself by (law 5). */
function dimensionsFor(pool) {
  /** @type {Record<string, string>} */
  const answers = {};
  for (const name of poolDimensions(pool)) answers[name] = STATE_MARK_DIMENSIONS[name][0];
  return answers;
}

// ── THE FIXTURE BLOCK ────────────────────────────────────────────────────────────────
// Every law below runs on content the corpus does not carry yet, so the fixtures are the
// only way any of it is EXECUTED at this car. They are deliberately small and named.

const FIX = 'DS-FIX-1';
const SPINE = 'spine: walled';

/** @param {{pools?: object, poolMeta?: object}} parts */
function fixtureCorpus(parts = {}) {
  return {
    [FIX]: {
      title: 'fixture',
      slots: [],
      pools: {
        [SPINE]: [{ angle: 'ledger', text: 'The walls stand.' }],
        ...(parts.pools || {}),
      },
      poolMeta: { ...(parts.poolMeta || {}) },
    },
  };
}

/** A modifier pool's metadata, with `attach` on the fixture spine by default. */
function modifierMeta(over = {}) {
  return {
    role: 'modifier', relation: 'addition', form: 'sentence', attach: [SPINE], ...over,
  };
}

/** Compose the fixture with these candidates. */
function composeFixture(corpus, options = {}) {
  return composeStateProse(corpus, FIX, {
    spineKey: SPINE, candidates: [], turns: [], slots: {}, seed: 'fx-1', audience: 'dm', ...options,
  });
}

// ⭐⭐ THE ONE POOL THAT HAS LAWFULLY LEFT THE ZERO-SHIFT WORLD (REWRITE 8b, DS-DEF-2's v3
// cure). Until the first v3 pool shipped, every arm below could assert a global equality
// because NO shipped variant carried a wording face. `DS-DEF-2 :: Invasion & War: walls with
// NO force` now carries three faces on each of its three variants and one `disagree` pair, so
// the face draw and the pair render really do move its text — which is the ruling's aim, not
// a defect. The equalities are therefore re-pinned, not deleted: they hold over the other 707
// pools BY MEASUREMENT, and the mover is NAMED here in one place so the day a second pool
// lands faces the arms red by name and are re-pinned in that pool's own cure commit.
const FACED_BLOCK = 'DS-DEF-2';
const FACED_POOL = 'Invasion & War: walls with NO force';
const FACED_AT = `${FACED_BLOCK} :: ${FACED_POOL}`;
// ⭐⭐ RE-PINNED AT THE 8b DS-DEF-2 DRAFT GATE (v3). Three more pools of the SAME block landed
// wording faces in one commit, so the carve-out is a LIST and no longer one name. Every entry
// is still inside DS-DEF-2 — nothing outside this block carries a face — and the arms below
// still assert the equality over the other 704 pools BY MEASUREMENT. ⛔ THE NEW THREE NAME NO
// ATTRIBUTION SLOT, so unlike `walls with NO force` they do not fail closed on a roles-less
// read: their drift is TEXT + SPINE on every seed that draws a face other than the spine.
const FACED_POOLS = Object.freeze([
  FACED_POOL,
  'Invasion & War: force with NO walls',
  'Internal Security: no legal infrastructure',
  'Disasters & Famine: NO reserves, NO medical provision',
]);
const FACED_ATS = Object.freeze(FACED_POOLS.map((pool) => `${FACED_BLOCK} :: ${pool}`));
/** @param {string} row a drift line @param {boolean} [prefix] match at the head only */
const isFaced = (row, prefix = false) => FACED_ATS
  .some((at) => (prefix ? row.startsWith(at) : row.includes(at)));

describe('the composer — the corpus loads, and the merge is legal', () => {
  it('every block lives in exactly one leaf, and the sweep found the whole corpus', () => {
    expect(BLOCK_COLLISIONS, 'a block id emitted by two leaves').toEqual([]);
    expect(Object.keys(CORPUS).length, 'blocks').toBe(68);
    expect(SHIPPED_POOLS.length, 'pools').toBe(708);
    expect(SHIPPED_POOLS.reduce((n, row) => n + row.pool.length, 0), 'variants').toBe(2266);
  });
});

describe('⭐ THE SEAM COMPOSES TO THE KERNEL — an empty candidate list moves nothing', () => {
  it('is byte-identical to `readStateProse` on all 708 pools, both faces, six seeds', () => {
    // THE EQUALITY CARS 3b–3g REST ON. Not a sample: every pool of the shipped corpus, at
    // both audiences, at six seeds including the seedless one, with a bag that fills every
    // slot and an answer for every demoted dimension — so eligibility turns on the LAW here
    // rather than on a gap in the fixture.
    /** @type {string[]} */
    const drift = [];
    let checks = 0;
    let composed = 0;
    for (const { blockId, poolKey, pool } of SHIPPED_POOLS) {
      const slots = bagFor(pool);
      const dimensions = dimensionsFor(pool);
      for (const audience of ['dm', 'player']) {
        for (const key of SWEEP_SEEDS) {
          checks += 1;
          const read = { slots, seed: key, audience, dimensions };
          const base = readStateProse(CORPUS, blockId, poolKey, read);
          const unit = composeStateProse(CORPUS, blockId, {
            ...read, spineKey: poolKey, candidates: [], turns: [],
          });
          const at = `${blockId} :: ${poolKey} :: ${audience} :: "${key}"`;
          if (base === null || unit === null) {
            if (base !== unit) drift.push(`NULLNESS ${at}`);
            continue;
          }
          composed += 1;
          if (unit.text !== base.text) drift.push(`TEXT ${at}`);
          if (unit.angle !== base.angle) drift.push(`ANGLE ${at}`);
          if (unit.poolKey !== base.poolKey || unit.blockId !== base.blockId) drift.push(`ID ${at}`);
          if (unit.pieces.length !== 1) drift.push(`PIECES ${at}`);
          else if (unit.pieces[0].role !== 'spine' || unit.pieces[0].key !== poolKey
            || unit.pieces[0].face !== 0) drift.push(`SPINE ${at}`);
        }
      }
    }
    process.stdout.write(`\n[compose] ${checks} reads over ${SHIPPED_POOLS.length} pools x 2`
      + ` audiences x ${SWEEP_SEEDS.length} seeds · ${composed} composed a unit · drift`
      + ` ${drift.length}\n`);
    // ⭐ RE-PINNED AT THE FIRST v3 POOL. The equality is asserted over the 707 pools that
    // still carry one face each, and the mover is partitioned out BY NAME rather than
    // silently tolerated: DS-DEF-2's faced pool is allowed to disagree with the kernel's
    // one-face read, every other pool is not, and the disagreement is itself asserted to
    // exist so the carve-out cannot go vacuous.
    const faced = drift.filter((row) => isFaced(row));
    const elsewhere = drift.filter((row) => !isFaced(row));
    expect(elsewhere.slice(0, 10), 'a pool where the composer and the kernel disagree').toEqual([]);
    expect(elsewhere.length).toBe(0);
    // NON-VACUITY OF THE CARVE-OUT: the faced pool really does move.
    // ⭐ AND THE KIND OF MOVE CHANGED AT CAR 8b-W-18l, which is worth stating rather than
    // loosening silently. Until the re-cut, the faced pool's disagreement with the kernel was
    // TEXT + SPINE: the composer drew a face and the kernel read the spine. Then the faces
    // named ATTRIBUTION SLOTS, and this sweep hands the composer no `roles` (it composes the
    // shipped corpus with nothing but a bag), so every drawn face FAILED CLOSED and the whole
    // unit was silent — NULLNESS. A read that skipped `withFaceSources` may silence a rung and
    // may never print `{hall}`.
    //
    // ⭐⭐ AND IT CHANGED AGAIN AT THE POOL RE-CUT OF CARS 8b-W-18n/18o, back to TEXT + SPINE,
    // FOR A REASON THAT IS THE NEW FORM'S WHOLE DEFINITION. The pool now carries an
    // `[archiver · observed]` face (ADDENDUM 18 ruling 27) and the archiver IS NOT A SOURCE: it
    // has no roster to draw a person from, so it names NO attribution slot and prints in the
    // archiver's own hand. It is THE ONE FACE OF THIS POOL THAT CAN SPEAK ON A READ WITH NO
    // ROLES AT ALL — not a loosening of the fail-closed rule, but a face the rule has nothing
    // to close on.
    //
    // ⛔ AND ON THESE SIX SEEDS IT IS THE ONE THAT DRAWS, WHICH IS THE DECLARED RE-ROLL AND NOT
    // A LOST PROPERTY. Variant #1's eligible list grew from four faces to five when the
    // observation was seated, and `h % 5` is not `h % 4`: both drifting seeds (`Thornwall::1`
    // and `town-42`) now land on face 4, the observation, where they used to land on a sourced
    // face and fail closed. The shift register's `face-count-per-variant` row carries that
    // re-roll by name. The arm below proves the fail-closed path is still THERE rather than
    // trusting these six seeds to have covered it.
    expect(faced.length, 'the named mover moved').toBeGreaterThan(0);
    expect([...new Set(faced.map((row) => row.split(' ')[0]))].sort()).toEqual(['SPINE', 'TEXT']);
    // ⛔⛔ NON-VACUITY OF THE FAIL-CLOSED PATH. A read with no roles MUST still silence a face
    // that names an attribution slot — if this ever passed by drawing the observation every
    // time, the sweep above would have stopped testing the thing it exists for. Driven on a
    // seed that lands on a sourced face, named rather than searched for.
    const facedRow = SHIPPED_POOLS.find((r) => `${r.blockId} :: ${r.poolKey}` === FACED_AT);
    expect(facedRow, 'the faced pool is in the sweep at all').toBeTruthy();
    const silenced = ['b', 'f'].map((seed) => composeStateProse(CORPUS, FACED_BLOCK, {
      spineKey: FACED_POOL, seed, audience: 'dm', slots: bagFor(facedRow.pool), dimensions: {},
    }));
    expect(silenced.every((u) => u === null), 'a face naming {hall} on a roles-less read is SILENT')
      .toBe(true);
    // ANTI-VACUITY: an equality over an empty sweep is free.
    expect(checks).toBe(708 * 2 * SWEEP_SEEDS.length);
    expect(composed, 'and most of the sweep really did compose a unit').toBeGreaterThan(6000);
  });

  it('the unit is FROZEN, and so is its piece list', () => {
    const unit = composeFixture(fixtureCorpus());
    expect(Object.isFrozen(unit), 'the unit').toBe(true);
    expect(Object.isFrozen(unit.pieces), 'the pieces array').toBe(true);
    expect(Object.isFrozen(unit.pieces[0]), 'and each piece').toBe(true);
  });

  it('a null spine key is silence, and so is an absent block or pool (R-DST-K)', () => {
    const corpus = fixtureCorpus();
    expect(composeStateProse(corpus, FIX, { spineKey: null }), 'no key').toBe(null);
    expect(composeStateProse(corpus, FIX, { spineKey: '' }), 'the empty key').toBe(null);
    expect(composeStateProse(corpus, FIX, {}), 'no key at all').toBe(null);
    expect(composeStateProse(corpus, 'DS-NOPE', { spineKey: SPINE }), 'no block').toBe(null);
    expect(composeStateProse(corpus, FIX, { spineKey: 'no such pool' }), 'no pool').toBe(null);
    expect(composeStateProse(null, FIX, { spineKey: SPINE }), 'no corpus').toBe(null);
    // The paired positive, or every line above passes on a composer that returns null always.
    expect(composeFixture(corpus).text, 'and the fixture does compose').toBe('The walls stand.');
  });
});

describe('⭐ THE BASE-SIDE SYNTHESIS — every recorded cell, against the composer\'s own rule', () => {
  it('reproduces car 1\'s `pieces[0]` on every cell of the DRIFT corpus', () => {
    // M-F6, and the fold's P8: the recorder synthesises `pieces` and `face` because neither
    // exists in the shipped shape, and car 3a is where the composer is pinned against that
    // table. The COMPOSER'S OWN function is driven — not a second spelling of it — so a
    // change to the coordinate rule reds here rather than passing against a copy of itself.
    /** @type {Array<{blind: boolean, pool: string, at: string}>} */
    const mismatch = [];
    let checked = 0;
    let facedCells = 0;
    for (const cell of run.cells) {
      const block = CORPUS[cell.block];
      const pool = block && block.pools ? block.pools[cell.pool] : undefined;
      if (!Array.isArray(pool)) {
        mismatch.push({ blind: false, pool: cell.pool, at: `NOPOOL ${cell.cell}` });
        continue;
      }
      const variant = pool[cell.vid];
      const audience = cell.cell.split('::')[1];
      // ⭐ RE-PINNED AT THE FIRST v3 POOL. The arm's subject is the COORDINATE RULE — that
      // the composer derives `vid` (the position as authored), `index` (the position in the
      // audience-filtered pool) and the piece's key set exactly as the recorder did. `face`
      // and `source` are PASS-THROUGH on both sides, and the literal `face: 0` here was
      // only ever the shipped corpus's own constant. DS-DEF-2's faced pool ended that, so
      // the drawn face and its source are now passed from the recorded cell rather than
      // assumed, and the coordinate equality is asserted on the same cells as before.
      const recorded = cell.pieces[0] || {};
      const piece = composedPieceOf(pool, variant, cell.pool, {
        role: 'spine',
        audience,
        face: recorded.face ?? 0,
        source: recorded.source ?? null,
        pairOf: recorded.pairOf ?? null,
        pairKind: recorded.pairKind ?? null,
      });
      if (cell.block === FACED_BLOCK && cell.pool === FACED_POOL) facedCells += 1;
      checked += 1;
      if (JSON.stringify(piece) !== JSON.stringify(cell.pieces[0])) {
        // THE ONE SHAPE THE RECORDER'S TEMPLATE READER CANNOT ANSWER: a faced pool's cell
        // whose rendered sentence is a FACE, so the recorder resolved nothing (`vid: null`)
        // and the composer, handed `pool[null]`, answered `-1`. Everything else is a real
        // coordinate disagreement. The two must agree on the FACE either way.
        const blindSpot = isFaced(`${cell.block} :: ${cell.pool}`, true)
          && cell.resolved === false
          && recorded.vid === null && recorded.index === null
          && piece.vid === -1 && piece.index === -1
          && piece.face === recorded.face && piece.key === recorded.key
          && piece.role === recorded.role;
        mismatch.push({
          blind: blindSpot,
          pool: cell.pool,
          at: `${cell.cell} :: composer ${JSON.stringify(piece)}`
            + ` :: recorder ${JSON.stringify(cell.pieces[0])}`,
        });
      }
    }
    // ⛔⛔ THE INSTRUMENT'S OWN BLIND SPOT, NAMED AT THE 8b DS-DEF-2 DRAFT GATE RATHER THAN
    // TOLERATED, AND IT IS A NARROWING OF THIS ARM. `cellsOfTown` identifies a ONE-PIECE
    // unit's variant from the RENDERED SENTENCE and reads the composer's own pieces only
    // when there are TWO OR MORE of them. Three of the four faced pools name NO attribution
    // slot, so on a roles-less read their faces really draw and the rendered sentence is a
    // FACE, which no pool template matches: the recorder writes `vid: null, index: null,
    // resolved: false` and the composer, handed `pool[null]`, answers `-1 / -1`. That is the
    // READER'S LIMIT and not a coordinate disagreement — so those cells are partitioned out
    // BY NAME and BY SHAPE, and ANY other disagreement on them still reds here.
    //
    // ⛔ THE FIX IS A MACHINERY CAR AND IS NOT TAKEN HERE. Reading the composer's pieces for
    // a one-piece unit too (`rung.pieces.length >= 1`) closes this AND takes `run.unresolved`
    // back to 0 — MEASURED at this gate — but it also flips `drawAgrees` from a measured
    // comparison to an unconditional `true` on 3,912 OTHER cells across ten blocks, which is
    // the false-green class. The threshold and `drawAgrees` must move together, in their own
    // car, with the composed path made to measure the draw rather than assert it.
    const blind = mismatch.filter((row) => row.blind);
    const real = mismatch.filter((row) => !row.blind);
    process.stdout.write(`[compose] base-side synthesis checked on ${checked} cells of`
      + ` ${run.rows.size} rows · mismatches ${mismatch.length}`
      + ` (recorder-blind ${blind.length})\n`);
    expect(real.slice(0, 5).map((row) => row.at), 'a cell the composer would coordinate differently').toEqual([]);
    expect(real.length).toBe(0);
    // AND THE CARVE-OUT IS BOUNDED: every blind cell is a faced pool's, records the exact
    // `-1/-1` against `null/null` shape, and agrees with the recorder on the face itself.
    expect([...new Set(blind.map((row) => row.pool))].sort(), 'the blind cells are the faced pools\' own')
      .toEqual(['Internal Security: no legal infrastructure']);
    expect(blind.length, 'and the blind spot is the size the gate measured').toBe(504);
    expect(checked, 'the whole recorded table').toBe(run.cells.length);
    expect(run.rows.size, 'and the table is the full DRIFT corpus').toBe(1050);
    // NON-VACUITY OF THE RE-PIN: the DRIFT run really does reach the one faced pool, and
    // really does record a face past 0 there — otherwise the change above would be inert.
    expect(facedCells, 'the DRIFT run reaches the faced pool').toBeGreaterThan(0);
    const facedFaces = run.cells
      .filter((cell) => cell.block === FACED_BLOCK && cell.pool === FACED_POOL)
      .map((cell) => (cell.pieces[0] || {}).face);
    expect(facedFaces.some((face) => face > 0), 'and records a drawn face past 0 there').toBe(true);
  }, 300_000);

  it('⭐ THE CELL ARM CAN NOW TELL `vid` FROM `index`: the blind spot closed at car 8a-1', () => {
    // ⛔ A LIMIT OF THE ARM ABOVE, FOUND BY EXECUTING IT AND REPORTED RATHER THAN PAPERED
    // OVER. `vid` is the position AS AUTHORED and `index` the position in the
    // AUDIENCE-FILTERED pool, and the two can only differ when a `dm-only` variant sits
    // BEFORE the drawn one on the player face. Until REWRITE car 8a-1 that never happened on
    // this corpus: ZERO recorded cells had vid != index, so the per-cell equality above would
    // also have passed for a composer that confused the two coordinates. The arm was written
    // with the sentence "the day a car makes a player face draw past a covert variant it reds
    // here", and this is the receipt for that day.
    //
    // ⭐ WHAT CLOSED IT, EXACTLY. The index-stable draw (kernel law 6) is an argmax over each
    // variant's stable id rather than `hash % length`, so it re-drew every pool once. On
    // `DS-POW-1 :: governanceFractured true` — four variants of which the THIRD is `dm-only` —
    // the player's draw moved to the fourth authored variant, which sits at audible index 2
    // and authored index 3. That is 36 cells of the DRIFT run whose two coordinates now
    // disagree, and the per-cell equality arm above is sensitive to the confusion for the
    // first time.
    //
    // The corpus ships twelve MIXED pools and the DRIFT run still reaches only a few of them,
    // so the figure remains small and is PINNED IN BOTH DIRECTIONS rather than floored.
    const apart = run.cells.filter((cell) => cell.vid !== cell.index);
    /** @type {Map<string, {n: number, covert: number[]}>} */
    const mixedPools = new Map();
    for (const { blockId, poolKey, pool } of SHIPPED_POOLS) {
      const covert = pool
        .map((v, i) => ((v.marks || []).includes('dm-only') ? i : -1)).filter((i) => i >= 0);
      if (covert.length > 0 && covert.length < pool.length) {
        mixedPools.set(`${blockId} :: ${poolKey}`, { n: pool.length, covert });
      }
    }
    const reached = [...new Set(run.cells.map((cell) => `${cell.block} :: ${cell.pool}`))]
      .filter((at) => mixedPools.has(at)).sort();
    process.stdout.write(`[compose] recorded cells whose authored vid and audible index differ:`
      + ` ${apart.length} of ${run.cells.length} · mixed pools in the corpus ${mixedPools.size}`
      + ` · reached by the DRIFT run ${reached.length} (${reached.join(' | ') || 'none'})\n`);
    expect(mixedPools.size, 'the corpus really does hold mixed pools').toBe(12);
    // PINNED IN BOTH DIRECTIONS, and no longer at zero. A fall back to 0 means the estate
    // lost the discrimination again and the arm above went blind; a rise means another pool's
    // player face started drawing past a covert variant, which is a draw movement somebody
    // owes a declared row for.
    expect(apart.length, 'cells that would tell the two coordinates apart').toBe(36);
    // And the cells are exactly the pool the draw moved, named rather than counted.
    expect([...new Set(apart.map((cell) => `${cell.block} :: ${cell.pool}`))])
      .toEqual(['DS-POW-1 :: governanceFractured true']);
    expect([...new Set(apart.map((cell) => `vid ${cell.vid} / index ${cell.index}`))])
      .toEqual(['vid 3 / index 2']);
    // SO THE DISCRIMINATION IS DRIVEN SYNTHETICALLY, on the shape the corpus cannot supply.
    // Without this, nothing in the estate would refuse a composer that recorded `index` as
    // the authored position.
    const mixed = [
      { text: 'covert', marks: ['dm-only'] },
      { text: 'open one' },
      { text: 'open two' },
    ];
    const player = composedPieceOf(mixed, mixed[2], 'p', { role: 'spine', face: 0, audience: 'player' });
    const dm = composedPieceOf(mixed, mixed[2], 'p', { role: 'spine', face: 0, audience: 'dm' });
    expect(player.vid, 'the authored position is the same on both faces').toBe(dm.vid);
    expect(player.vid).toBe(2);
    expect(dm.index, 'the DM sees all three').toBe(2);
    expect(player.index, 'the player list is shorter, so the coordinate moves').toBe(1);
    // AND the third coordinate the recorder can differ on: an ELIGIBLE-list position. A
    // composer that indexed its own eligible list would answer 0 here, not 1.
    expect(player.index, 'index is the AUDIBLE position, never the eligible one').not.toBe(0);
  });

  it('the seedless corpus reads canonical-at-zero the way the gallery import does', () => {
    // SITTING §P.4 item 1. `galleryImportSettlement.js:76` sets `_seed: undefined`, so the
    // desks reach the composer with no seed at all. All three spellings of absence must
    // compose the SAME unit as the kernel's canonical read, on every pool of the corpus.
    /** @type {string[]} */
    const drift = [];
    let pools = 0;
    for (const { blockId, poolKey, pool } of SHIPPED_POOLS) {
      const read = {
        slots: bagFor(pool), audience: 'dm', dimensions: dimensionsFor(pool),
      };
      const base = readStateProse(CORPUS, blockId, poolKey, { ...read, seed: '' });
      const spellings = [undefined, null, ''].map((given) => composeStateProse(CORPUS, blockId, {
        ...read, seed: given, spineKey: poolKey, candidates: [], turns: [],
      }));
      pools += 1;
      const texts = new Set(spellings.map((unit) => (unit === null ? null : unit.text)));
      if (texts.size !== 1) drift.push(`SPELLINGS ${blockId} :: ${poolKey}`);
      if ((base === null) !== (spellings[0] === null)) drift.push(`NULLNESS ${blockId} :: ${poolKey}`);
      else if (base !== null && spellings[0] !== null && spellings[0].text !== base.text) {
        drift.push(`TEXT ${blockId} :: ${poolKey}`);
      }
    }
    expect(drift.slice(0, 5), 'a pool where an unseeded read is not the canonical one').toEqual([]);
    expect(pools).toBe(708);
  });
});

describe('the composer — salience, and the comparator law (ARCH §4.3)', () => {
  /** Three modifier pools, so a ranking has something to rank. */
  function rankingCorpus(metaOver = {}) {
    return fixtureCorpus({
      pools: {
        alpha: [{ angle: 'plain', text: 'Alpha holds.' }],
        beta: [{ angle: 'plain', text: 'Beta holds.' }],
        gamma: [{ angle: 'plain', text: 'Gamma holds.' }],
      },
      poolMeta: {
        [SPINE]: { role: 'spine', readsCount: 2 },
        alpha: modifierMeta(metaOver.alpha),
        beta: modifierMeta(metaOver.beta),
        gamma: modifierMeta(metaOver.gamma),
      },
    });
  }

  /** Which modifier key seated, given a candidate list and a seed. */
  function seatedKey(corpus, candidates, seed, leaves) {
    const unit = composeFixture(corpus, { candidates, seed, leaves });
    const seat = unit.pieces.find((piece) => piece.role === 'modifier');
    return seat ? seat.key : null;
  }

  it('⭐⭐ KINSHIP OUTRANKS THE BAND — a subject shift is forced last, whatever it scores', () => {
    // SITTING §T.4 adopting agenda C″: "the modifier sharing the spine's subject noun sits
    // nearest the spine, and a subject shift is forced last REGARDLESS of band". `kin` is the
    // projector's frozen answer to that question (`kinSpines`), and the comparator reads it
    // ahead of the band. THE PLANT IS THE HARD CASE ON PURPOSE: the two pools that turn
    // outward carry BOTH of the other signals and would win the band outright.
    const threaded = rankingCorpus({
      alpha: { kin: [], relation: 'contrast' },
      beta: { kin: [], relation: 'contrast' },
      gamma: { kin: [SPINE] },
    });
    const candidates = [{ key: 'alpha', change: 1 }, { key: 'beta', change: 1 }, { key: 'gamma' }];
    /** @type {Set<string|null>} */
    const seated = new Set();
    for (let i = 0; i < 40; i += 1) seated.add(seatedKey(threaded, candidates, `kin-${i}`));
    expect([...seated], 'the pool that threads seats, though the other two outscore it 2-0')
      .toEqual(['gamma']);
    // ⛔ THE CONTROL, AND IT IS THE ONE THAT MATTERS: the SAME corpus with the kinship lists
    // removed hands the seat back to the band, so the arm above is kinship biting and not the
    // fixture's key order. Without it a comparator that ignored `kin` entirely would pass.
    const blind = rankingCorpus({
      alpha: { relation: 'contrast' }, beta: { relation: 'contrast' }, gamma: {},
    });
    /** @type {Set<string|null>} */
    const byBand = new Set();
    for (let i = 0; i < 40; i += 1) byBand.add(seatedKey(blind, candidates, `kin-${i}`));
    expect([...byBand].sort(), 'with no kinship declared the band decides, and gamma never seats')
      .toEqual(['alpha', 'beta']);
  });

  it('⛔ AN ABSENT `kin` LIST IS KIN — the corpus that never carried the signal orders as before', () => {
    // FAIL-OPEN, and it is why this car moves no cell of the shipped manifest: every one of
    // the 708 pools is a spine with no `kin` key, so `kinOf` answers 1 for all of them and the
    // comparator falls straight through to the band. An implementation that read a missing
    // list as "not kin" would read the WHOLE estate as a subject shift.
    const plain = rankingCorpus();
    const candidates = [{ key: 'alpha' }, { key: 'beta' }, { key: 'gamma' }];
    /** @type {Set<string|null>} */
    const level = new Set();
    for (let i = 0; i < 40; i += 1) level.add(seatedKey(plain, candidates, `absent-${i}`));
    expect([...level].sort(), 'no pool declares `kin`, so the seeded permutation still reaches all three')
      .toEqual(['alpha', 'beta', 'gamma']);
    // AND AN EMPTY LIST IS NOT AN ABSENT ONE: `kin: []` says the projector ASKED and found no
    // thread, which is the opposite answer and must not read the same.
    const declaredNone = rankingCorpus({
      alpha: { kin: [] }, beta: { kin: [] }, gamma: { kin: [SPINE] },
    });
    /** @type {Set<string|null>} */
    const withEmpty = new Set();
    for (let i = 0; i < 40; i += 1) withEmpty.add(seatedKey(declaredNone, candidates, `absent-${i}`));
    expect([...withEmpty], 'an empty list is a measured NO and loses to a measured YES').toEqual(['gamma']);
  });

  it('⛔ `kin` IS PER SPINE — a thread with SOME OTHER spine buys nothing here', () => {
    // The list names the attach spines this pool threads with, so a pool that threads with a
    // spine the reader is not reading is a subject shift at THIS one. A membership test that
    // asked "is the list non-empty" instead of "does it contain this spine" would pass every
    // other arm in this file and fail exactly here.
    const elsewhere = rankingCorpus({
      alpha: { kin: ['spine: some other'] },
      beta: { kin: ['spine: some other'] },
      gamma: { kin: [SPINE] },
    });
    const candidates = [{ key: 'alpha' }, { key: 'beta' }, { key: 'gamma' }];
    /** @type {Set<string|null>} */
    const seated = new Set();
    for (let i = 0; i < 40; i += 1) seated.add(seatedKey(elsewhere, candidates, `other-${i}`));
    expect([...seated], 'only a thread with the spine being read counts').toEqual(['gamma']);
  });

  it('the BAND wins before the seed does — three signals, each an integer', () => {
    // DEPARTURE off the norm leaf, TENSION off the pool's own relation, CHANGE off the
    // desk's typed flag. A candidate carrying any of them outranks one carrying none,
    // whatever the seeded permutation would have said.
    const plain = rankingCorpus();
    const tense = rankingCorpus({ gamma: { relation: 'contrast' } });
    /** @type {Set<string|null>} */
    const withTension = new Set();
    /** @type {Set<string|null>} */
    const withChange = new Set();
    /** @type {Set<string|null>} */
    const withDeparture = new Set();
    const candidates = [{ key: 'alpha' }, { key: 'beta' }, { key: 'gamma' }];
    const departed = { norms: { [`${FIX}::gamma`]: { departure: 1 } } };
    for (let i = 0; i < 40; i += 1) {
      withTension.add(seatedKey(tense, candidates, `probe-${i}`));
      withChange.add(seatedKey(plain, [{ key: 'alpha' }, { key: 'beta' }, { key: 'gamma', change: 1 }], `probe-${i}`));
      withDeparture.add(seatedKey(plain, candidates, `probe-${i}`, departed));
    }
    expect([...withTension], 'TENSION: the contrasting pool always seats').toEqual(['gamma']);
    expect([...withChange], 'CHANGE: the changed pool always seats').toEqual(['gamma']);
    expect([...withDeparture], 'DEPARTURE: the uncommon pool always seats').toEqual(['gamma']);
    // THE CONTROL: without a signal the three really do share a band, so the sets above are
    // the band biting rather than an accident of the key order.
    /** @type {Set<string|null>} */
    const level = new Set();
    for (let i = 0; i < 40; i += 1) level.add(seatedKey(plain, candidates, `probe-${i}`));
    expect([...level].sort(), 'a level band is decided by the seed, and reaches all three')
      .toEqual(['alpha', 'beta', 'gamma']);
  });

  it('the INPUT ORDER is never consulted — a shuffled call order composes the same unit', () => {
    // The desk's call order is a fact about the desk's source file, not about the town.
    const corpus = rankingCorpus();
    const orders = [
      [{ key: 'alpha' }, { key: 'beta' }, { key: 'gamma' }],
      [{ key: 'gamma' }, { key: 'alpha' }, { key: 'beta' }],
      [{ key: 'beta' }, { key: 'gamma' }, { key: 'alpha' }],
    ];
    /** @type {Set<string>} */
    const texts = new Set();
    for (const order of orders) texts.add(composeFixture(corpus, { candidates: order }).text);
    expect(texts.size, 'three call orders, one unit').toBe(1);
  });

  it('a TIE is broken by code-unit comparison, never by a locale collation', () => {
    // Two keys whose salience digests are equal is the case the tie-break exists for, and it
    // is not reachable by fixture at this size. So the comparator's tie limb is driven
    // directly, on the keys a locale collation and a code-unit comparison ORDER DIFFERENTLY:
    // in en-US, 'a' sorts before 'B'; by code unit, 'B' (0x42) sorts before 'a' (0x61).
    const byCodeUnit = ['a', 'B'].sort((x, y) => (x === y ? 0 : (x < y ? -1 : 1)));
    expect(byCodeUnit, 'the comparator this module uses').toEqual(['B', 'a']);
    // The unseeded composer takes the tie-break outright (every digest is 0), so the law is
    // observable end to end: with no seed, the code-unit-first key seats.
    const corpus = fixtureCorpus({
      pools: {
        B: [{ angle: 'plain', text: 'Bee holds.' }],
        a: [{ angle: 'plain', text: 'Ay holds.' }],
      },
      poolMeta: { [SPINE]: { role: 'spine', readsCount: 2 }, B: modifierMeta(), a: modifierMeta() },
    });
    const unit = composeFixture(corpus, { candidates: [{ key: 'a' }, { key: 'B' }], seed: '' });
    expect(unit.pieces[1].key, 'seedless, the code-unit-first key seats').toBe('B');
  });

  it('is a pure function of its inputs: same call, same unit, and no clock or RNG touched', () => {
    const corpus = rankingCorpus();
    const candidates = [{ key: 'alpha' }, { key: 'beta' }, { key: 'gamma' }];
    const random = vi.spyOn(Math, 'random');
    const now = vi.spyOn(Date, 'now');
    try {
      const first = composeFixture(corpus, { candidates });
      const second = composeFixture(corpus, { candidates });
      expect(second).toEqual(first);
      expect(random.mock.calls.length, 'no RNG').toBe(0);
      expect(now.mock.calls.length, 'no clock').toBe(0);
    } finally {
      random.mockRestore();
      now.mockRestore();
    }
  });
});

describe('the composer — the candidate stage is AUDIENCE-FIRST (ARCH §4.2 step 2, P-F3)', () => {
  /** A covert modifier beside an ordinary one. */
  const corpus = fixtureCorpus({
    pools: {
      covert: [{ angle: 'plain', text: 'The seam is bought.', marks: ['dm-only'] }],
      open: [{ angle: 'plain', text: 'The granary is thin.' }],
    },
    poolMeta: {
      [SPINE]: { role: 'spine' },
      covert: modifierMeta(),
      open: modifierMeta(),
    },
  });

  it('⛔ NOTHING A COVERT PIECE DOES IS OBSERVABLE ON THE PLAYER FACE, INCLUDING WHAT IT PREVENTED', () => {
    // The law, in its executable form. A covert pool filtered LATE would already have taken
    // the seat, and the player would read a unit shortened by a fact they may not know
    // exists. So the player face composed WITH the covert candidate offered must be
    // byte-identical to the player face composed without it having been offered at all.
    const withCovert = composeFixture(corpus, {
      audience: 'player', candidates: [{ key: 'covert' }, { key: 'open' }],
    });
    const without = composeFixture(corpus, {
      audience: 'player', candidates: [{ key: 'open' }],
    });
    expect(withCovert).toEqual(without);
    expect(withCovert.pieces.map((piece) => piece.key), 'the open modifier took the seat')
      .toEqual([SPINE, 'open']);
    // THE PAIRED POSITIVE: on the DM face the covert pool IS a candidate, so the suppression
    // above is a filter doing work rather than a pool nobody offered.
    const dm = composeFixture(corpus, {
      audience: 'dm', candidates: [{ key: 'covert' }, { key: 'open' }], seed: 'fx-covert',
    });
    expect(dm.pieces.some((piece) => piece.key === 'covert'), 'the DM face can seat it')
      .toBe(true);
  });

  it('a pool that partitions itself by an UNANSWERED dimension is silent BY ITSELF', () => {
    // Law 5, at the candidate grain. The demoted dimension is per POOL, so a block holding a
    // partitioned modifier beside an unpartitioned one loses only the first.
    const partitioned = fixtureCorpus({
      pools: {
        graded: [
          { angle: 'plain', text: 'A minor wave.', marks: ['minor'] },
          { angle: 'plain', text: 'A major wave.', marks: ['major'] },
        ],
        plain: [{ angle: 'plain', text: 'The road is open.' }],
      },
      poolMeta: {
        [SPINE]: { role: 'spine' },
        graded: modifierMeta(),
        plain: modifierMeta(),
      },
    });
    const unanswered = composeFixture(partitioned, { candidates: [{ key: 'graded' }] });
    expect(unanswered.pieces.length, 'unanswered: the pool cannot speak').toBe(1);
    const answered = composeFixture(partitioned, {
      candidates: [{ key: 'graded' }], dimensions: { severity: 'major' },
    });
    // ⚠ THE OPENER IS DRAWN FROM THE LEAF, which is why this string carries one: REWRITE car
    // 8a-11 wired `CONNECTIVES` to `src/data/dossierConnectives.generated.js`, whose
    // `addition.sentence` list has stood at its floor of three since 8a-9. The subject of this
    // arm is the DIMENSION, and the opener is the composer working; the list's LENGTH is the
    // SHIFT REGISTER's `connective-list-length` mechanism and the twelve joints are the
    // owner's copy, signed at the walk (§13 row 27), so a copy act moves this line with it.
    expect(answered.text, 'answered: it speaks the value it names')
      .toBe('The walls stand. Also, a major wave.');
  });

  it('refuses a candidate that is not a modifier, not attached, or not in the block', () => {
    const corpus2 = fixtureCorpus({
      pools: {
        elsewhere: [{ angle: 'plain', text: 'Elsewhere.' }],
        unroled: [{ angle: 'plain', text: 'Unroled.' }],
        detached: [{ angle: 'plain', text: 'Detached.' }],
        good: [{ angle: 'plain', text: 'Good.' }],
      },
      poolMeta: {
        [SPINE]: { role: 'spine' },
        elsewhere: modifierMeta({ attach: ['some other spine'] }),
        unroled: { role: 'spine' },
        detached: modifierMeta({ attach: [] }),
        good: modifierMeta(),
      },
    });
    const refused = ['elsewhere', 'unroled', 'detached', 'absent'].map((key) => composeFixture(
      corpus2, { candidates: [{ key }] },
    ).pieces.length);
    expect(refused, 'each refused candidate leaves a bare spine').toEqual([1, 1, 1, 1]);
    // AND THE CONTROL: an attached modifier pool with a modifier role DOES seat, so the four
    // refusals above are four different filters rather than one composer that never seats.
    expect(composeFixture(corpus2, { candidates: [{ key: 'good' }] }).pieces.length).toBe(2);
    // The spine itself is never its own modifier, and a key offered twice seats once.
    expect(composeFixture(corpus2, { candidates: [{ key: SPINE }] }).pieces.length).toBe(1);
    expect(composeFixture(corpus2, {
      candidates: [{ key: 'good' }, { key: 'good' }],
    }).pieces.length, 'a key offered twice').toBe(2);
  });

  it('DROPS a candidate whose slot has no fill and walks on down the rank', () => {
    // ARCH §4.2 step 5. A drop changes no modulus of any pool already drawn, which is what
    // makes it safe to do at render time at all.
    const corpus3 = fixtureCorpus({
      pools: {
        anchored: [{ angle: 'plain', text: 'The {counterpart} presses.', slots: ['counterpart'] }],
        free: [{ angle: 'plain', text: 'The road is open.' }],
      },
      poolMeta: {
        [SPINE]: { role: 'spine' },
        // The anchored pool is given a departure bit so it OUTRANKS the free one and the
        // drop is genuinely the thing being tested rather than the ranking.
        anchored: modifierMeta(),
        free: modifierMeta(),
      },
    });
    const leaves = { norms: { [`${FIX}::anchored`]: { departure: 1 } } };
    const unfilled = composeFixture(corpus3, {
      candidates: [{ key: 'anchored' }, { key: 'free' }], leaves,
    });
    // The drawn `addition` opener rides in front of the seated candidate; see the dimension
    // arm above for why this string carries one since REWRITE car 8a-11.
    expect(unfilled.text, 'the top-ranked candidate dropped, the next one seated')
      .toBe('The walls stand. Also, the road is open.');
    const filled = composeFixture(corpus3, {
      candidates: [{ key: 'anchored' }, { key: 'free' }],
      slots: { counterpart: 'Highfen' },
      leaves,
    });
    expect(filled.text, 'and with the anchor present it is the one that seats')
      .toBe('The walls stand. The {counterpart} presses.'.replace('{counterpart}', 'Highfen'));
  });
});

describe('the composer — the bound: facts, seats, capacity (ARCH §4.4)', () => {
  /** A block whose spine's SELECTING BRANCH reads this many fields. */
  function boundedCorpus(readsCount, extra = {}) {
    return fixtureCorpus({
      pools: {
        one: [{ angle: 'plain', text: 'One holds.' }],
        two: [{ angle: 'plain', text: 'Two holds.' }],
        ...(extra.pools || {}),
      },
      poolMeta: {
        [SPINE]: { role: 'spine', ...(readsCount === null ? {} : { readsCount }) },
        one: modifierMeta(extra.one),
        two: modifierMeta(extra.two),
      },
    });
  }

  const BOTH = [{ key: 'one' }, { key: 'two' }];
  /** The connective leaf a clause joint needs; the SEAT itself is frozen on the pool. */
  const CLAUSE_LEAVES = {
    connectives: { ...CONNECTIVES, consequence: { clause: [', so'] } },
  };
  const CLAUSE_TWO = { two: { relation: 'consequence', seat: CLAUSE_SEAT } };

  it('THE FACT BUDGET is `3 - readsCount`, and a three-fact spine takes none', () => {
    const clause = { ...CLAUSE_LEAVES };
    expect(composeFixture(boundedCorpus(1, CLAUSE_TWO), { candidates: BOTH, leaves: clause }).pieces.length,
      'a one-fact spine takes two modifiers').toBe(3);
    expect(composeFixture(boundedCorpus(2, CLAUSE_TWO), { candidates: BOTH, leaves: clause }).pieces.length,
      'a two-fact spine takes one').toBe(2);
    expect(composeFixture(boundedCorpus(3, CLAUSE_TWO), { candidates: BOTH, leaves: clause }).pieces.length,
      'a three-fact spine takes none').toBe(1);
    expect(composeFixture(boundedCorpus(5, CLAUSE_TWO), { candidates: BOTH, leaves: clause }).pieces.length,
      'and the eleven five-fact spines the census found take none either').toBe(1);
    expect(COMPOSITION_BOUNDS.facts, 'the ceiling the budget is spent against').toBe(3);
  });

  it('AN ABSENT COUNT IS ONE FACT — the 368 pools the census recovered nothing for', () => {
    // ABSENT, NOT ZERO (the norm leaf's own rule, applied here): a pool the census could not
    // resolve has no measurable reading, and reading it as ZERO would hand a three-modifier
    // budget to the very pools nobody has wired.
    expect(composeFixture(boundedCorpus(null, CLAUSE_TWO), { candidates: BOTH, leaves: { ...CLAUSE_LEAVES } })
      .pieces.length, 'absent reads as one fact, so the budget is two').toBe(3);
  });

  it('⛔ THE PLANT: the budget spends `readsCount` and NEVER a `reads` array (car 4d)', () => {
    // `PoolMeta` has no `reads` key — the authoring half never ships (ARCH §16) — so a
    // composer that reads one is naming a field its own input cannot carry. This fixture
    // carries BOTH: a three-entry `reads` that would answer a budget of ZERO, and the
    // census's own `readsCount: 1` that answers TWO. A composer reading the array seats
    // nothing; the shipped one seats both modifiers.
    const planted = fixtureCorpus({
      pools: {
        one: [{ angle: 'plain', text: 'One holds.' }],
        two: [{ angle: 'plain', text: 'Two holds.' }],
      },
      poolMeta: {
        [SPINE]: { role: 'spine', readsCount: 1, reads: ['walls', 'gate', 'muster'] },
        one: modifierMeta(),
        two: modifierMeta({ relation: 'consequence', seat: CLAUSE_SEAT }),
      },
    });
    expect(composeFixture(planted, { candidates: BOTH, leaves: { ...CLAUSE_LEAVES } }).pieces.length,
      'the projected integer wins over the phantom array').toBe(3);
    // AND THE CONTROL, so the arm is not simply blind to `readsCount`: move the integer to
    // three and the same fixture seats nothing.
    const bound = fixtureCorpus({
      pools: {
        one: [{ angle: 'plain', text: 'One holds.' }],
        two: [{ angle: 'plain', text: 'Two holds.' }],
      },
      poolMeta: {
        [SPINE]: { role: 'spine', readsCount: 3, reads: [] },
        one: modifierMeta(),
        two: modifierMeta({ relation: 'consequence', seat: CLAUSE_SEAT }),
      },
    });
    expect(composeFixture(bound, { candidates: BOTH, leaves: { ...CLAUSE_LEAVES } }).pieces.length,
      'and a three-fact count closes the budget whatever the array says').toBe(1);
  });

  it('DEPTH IS NEVER FOUR: two seats exist and no third is reachable', () => {
    const clause = { ...CLAUSE_LEAVES };
    const corpus = fixtureCorpus({
      pools: {
        one: [{ angle: 'plain', text: 'One holds.' }],
        two: [{ angle: 'plain', text: 'Two holds.' }],
        three: [{ angle: 'plain', text: 'Three holds.' }],
        four: [{ angle: 'plain', text: 'Four holds.' }],
      },
      poolMeta: {
        [SPINE]: { role: 'spine' },
        one: modifierMeta(),
        two: modifierMeta({ relation: 'consequence', seat: CLAUSE_SEAT }),
        three: modifierMeta(),
        four: modifierMeta({ relation: 'consequence', seat: CLAUSE_SEAT }),
      },
    });
    const unit = composeFixture(corpus, {
      candidates: [{ key: 'one' }, { key: 'two' }, { key: 'three' }, { key: 'four' }],
      leaves: clause,
    });
    expect(unit.pieces.length, 'spine plus at most two pieces').toBeLessThanOrEqual(3);
    expect(unit.pieces.filter((piece) => piece.seat === CLAUSE_SEAT).length, 'one joint at most')
      .toBeLessThanOrEqual(1);
    expect(unit.pieces.filter((piece) => piece.seat === SENTENCE_SEAT).length, 'one sentence seat')
      .toBeLessThanOrEqual(1);
  });

  it('THE SENTENCE SEAT is closed by a spine that already states two sentences', () => {
    const corpus = fixtureCorpus({
      pools: {
        [SPINE]: [{ angle: 'ledger', text: 'The walls stand. The gate is watched.' }],
        one: [{ angle: 'plain', text: 'One holds.' }],
      },
      poolMeta: { [SPINE]: { role: 'spine' }, one: modifierMeta() },
    });
    expect(composeFixture(corpus, { candidates: [{ key: 'one' }] }).pieces.length,
      'a two-sentence spine seats nothing at the sentence').toBe(1);
    // The control: the same modifier seats behind a one-sentence spine.
    expect(composeFixture(fixtureCorpus({
      pools: { one: [{ angle: 'plain', text: 'One holds.' }] },
      poolMeta: { [SPINE]: { role: 'spine' }, one: modifierMeta() },
    }), { candidates: [{ key: 'one' }] }).pieces.length).toBe(2);
  });

  it('THE CLAUSE SEAT is closed by a final sentence that already ranks two clauses', () => {
    const ranked = fixtureCorpus({
      pools: {
        [SPINE]: [{ angle: 'ledger', text: 'The walls stand; the gate is watched.' }],
        two: [{ angle: 'plain', text: 'the muster is thin' }],
      },
      poolMeta: {
        [SPINE]: { role: 'spine' },
        two: modifierMeta({ relation: 'consequence', form: 'fragment', seat: CLAUSE_SEAT }),
      },
    });
    expect(composeFixture(ranked, { candidates: [{ key: 'two' }], leaves: CLAUSE_LEAVES })
      .pieces.length, 'a semicolon in the final sentence closes the joint').toBe(1);
    const clean = fixtureCorpus({
      pools: { two: [{ angle: 'plain', text: 'the muster is thin' }] },
      poolMeta: {
        [SPINE]: { role: 'spine' },
        two: modifierMeta({ relation: 'consequence', form: 'fragment', seat: CLAUSE_SEAT }),
      },
    });
    expect(composeFixture(clean, { candidates: [{ key: 'two' }], leaves: CLAUSE_LEAVES }).text,
      'and with a clean final sentence the joint lands').toBe('The walls stand, so the muster is thin.');
  });
});

describe('the composer — relations, seats and connectives (ARCH §4.5)', () => {
  /** The fixture modifier, seated however the projector resolved it. */
  const withSeat = (over) => fixtureCorpus({
    pools: { m: [{ angle: 'plain', text: 'the muster is thin' }] },
    poolMeta: {
      [SPINE]: { role: 'spine' },
      m: modifierMeta({ relation: 'consequence', form: 'fragment', ...over }),
    },
  });
  const corpus = withSeat({});
  const CLAUSE_LIST = { ...CONNECTIVES, consequence: { clause: [', so'] } };
  /** A relation table that WOULD license every joint in the fixture, if anything read it. */
  const LICENSING = {
    'walls|muster': [{ relation: 'consequence', source: 'd', direction: 'a→b' }],
    'muster|walls': [{ relation: 'consequence', source: 'd', direction: 'b→a' }],
  };

  it('⛔ NO CLAUSE CAN SEAT ON THE SHIPPED CORPUS, because the relation table is empty', () => {
    // ARCH §16 item 9 / car 0's F1: none of the engine's 165 relation rows joins a desk read
    // root, and source (d) is empty. So every joint on the shipped corpus stands at the
    // `addition` floor. Read off the leaf rather than believed.
    expect(Object.keys(PROSE_RELATIONS).length, 'relation rows that ship today').toBe(0);
    expect(Object.keys(PROSE_NORMS).length, 'norm bits that ship today').toBe(0);
    const unit = composeFixture(corpus, { candidates: [{ key: 'm' }] });
    expect(unit.pieces.filter((piece) => piece.seat === CLAUSE_SEAT), 'no joint seats')
      .toEqual([]);
    // A `consequence` the projector could not license is not refused — it seats as an
    // ADDITION at the sentence, which is where a cause belongs (§4.5), AND ITS RELATION
    // CHANGES WITH ITS SEAT: `consequence` has one list and it is the clause list, so a
    // fallback that kept the declared relation would find no list and fail to seat at all.
    expect(unit.pieces[1].seat, 'it falls to the sentence seat').toBe(SENTENCE_SEAT);
    expect(unit.pieces[1].relation, 'and it seats AS an addition').toBe('addition');
    // ⚠ THE FIXTURE'S TEXT IS A FRAGMENT, which is why the unit reads oddly here: the annex
    // refuses `FORM: fragment` under a sentence seat (§2.5's FORM row), so this row could
    // not ship. What is being driven is the SEAT decision, not a shippable sentence.
    expect(unit.text).toBe('The walls stand. Beside that, the muster is thin');
  });

  it('⭐ THE SEAT IS READ OFF THE POOL, and an explicit `sentence` is the same as none', () => {
    const seated = (over) => {
      const piece = composeFixture(withSeat(over), {
        candidates: [{ key: 'm' }], leaves: { connectives: CLAUSE_LIST },
      }).pieces[1];
      return `${piece.seat}/${piece.relation}`;
    };
    expect(seated({ seat: CLAUSE_SEAT }), 'a licensed pool takes the clause')
      .toBe(`${CLAUSE_SEAT}/consequence`);
    expect(seated({ seat: SENTENCE_SEAT, seatReason: 'no-row' }), 'an unlicensed one is an addition')
      .toBe(`${SENTENCE_SEAT}/addition`);
    expect(seated({}), 'and an ABSENT seat reads exactly as the sentence')
      .toBe(`${SENTENCE_SEAT}/addition`);
  });

  it('⛔⛔ THE PLANT (car 4d): the composer NEVER re-asks the licence from a `reads` field', () => {
    // ARCH §5.2 fixes the licence on the spine's PRIMARY field — the first entry of `reads` —
    // and `reads` never ships (ARCH §16). Until car 4d `seatFor` read `spineMeta.reads[0]`
    // anyway. This fixture hands the composer EVERYTHING that reader wanted: a spine whose
    // `reads` names `walls`, a modifier whose `reads` names `muster`, a relation table with
    // the licensing row in both spellings, and the clause list to draw from — and NO
    // projected `seat`. A composer that re-asks seats the clause; the shipped one seats the
    // sentence, because the licence is not its question.
    const planted = fixtureCorpus({
      pools: { m: [{ angle: 'plain', text: 'the muster is thin' }] },
      poolMeta: {
        [SPINE]: { role: 'spine', reads: ['walls'] },
        m: modifierMeta({ relation: 'consequence', form: 'fragment', reads: ['muster'] }),
      },
    });
    const piece = composeFixture(planted, {
      candidates: [{ key: 'm' }],
      leaves: { relations: LICENSING, connectives: CLAUSE_LIST },
    }).pieces[1];
    expect(`${piece.seat}/${piece.relation}`, 'the phantom field licenses nothing')
      .toBe(`${SENTENCE_SEAT}/addition`);
    // AND THE CONTROL: the same fixture with the SEAT frozen on it does take the clause, so
    // the arm is not a composer that has simply stopped seating clauses.
    const licensed = composeFixture(withSeat({ seat: CLAUSE_SEAT }), {
      candidates: [{ key: 'm' }], leaves: { connectives: CLAUSE_LIST },
    }).pieces[1];
    expect(`${licensed.seat}/${licensed.relation}`).toBe(`${CLAUSE_SEAT}/consequence`);
  });

  it('⛔ AN EMPTY `consequence.clause` LIST WITHHOLDS A LICENSED CLAUSE — and the shipped list is no longer empty', () => {
    // The two halves of a joint are INDEPENDENT, and this arm drives that independence from
    // BOTH sides.
    //
    // ⚠ THE PREMISE MOVED, AND SAYING SO IS THE POINT (REWRITE car 8a-11, SITTING §U c-5).
    // This arm used to read `CONNECTIVES.consequence.clause` as `[]` and call it "empty and
    // OWED". That was true of the composer's own FLOOR CONSTANT and it stopped being true of
    // the LEAF at car 8a-9, which authored all four lists to their floor of three; the two
    // homes then disagreed for a whole car with nothing saying so. The composer now READS the
    // leaf, so the shipped clause list stands at three and the withheld path has to be driven
    // on an INJECTED empty list rather than on the shipped one.
    expect(CONNECTIVES.consequence.clause, 'the shipped clause list, at its floor since 8a-9')
      .toEqual([', so', ', and so', ', leaving']);
    const licensed = withSeat({ seat: CLAUSE_SEAT });
    // (i) THE WITHHELD PATH, on an injected empty list: `drawConnective` answers null and the
    // candidate is DROPPED, which is a withholding and not a silent empty joint.
    const starved = composeFixture(licensed, {
      candidates: [{ key: 'm' }],
      leaves: { connectives: { ...CONNECTIVES, consequence: { clause: [] } } },
    });
    expect(starved.pieces.length, 'licensed, and withheld for want of a joint').toBe(1);
    // (ii) THE CONTROL, on ONE authored joint: the same licensed pool seats at the clause.
    const unit = composeFixture(licensed, {
      candidates: [{ key: 'm' }], leaves: { connectives: CLAUSE_LIST },
    });
    expect(unit.pieces.length).toBe(2);
    expect(unit.text).toBe('The walls stand, so the muster is thin.');
    // (iii) AND ON THE SHIPPED LEAF the licensed pool seats too, drawing one of the three.
    const shipped = composeFixture(licensed, { candidates: [{ key: 'm' }] });
    expect(shipped.pieces.length, 'the shipped list seats it').toBe(2);
    expect(CONNECTIVES.consequence.clause.map((j) => `The walls stand${j} the muster is thin.`),
      'and the joint it drew is one of the leaf\'s own three').toContain(shipped.text);
  });

  it('⭐ THE RELATION LEAF IS NOT READ AT RENDER — every unit is identical with and without it', () => {
    // ARCH §4.1 gives the composer three leaves and car 4d leaves it reading two: the licence
    // moved to projection, where the census makes the spine's primary field visible at all.
    // The roster stays at three because it is the architecture's (the chair's row on the
    // receipt), so the independence is ASSERTED here rather than left as a paragraph in the
    // module header — a re-added read reds on this arm over the whole seed sweep.
    const cases = [
      { what: 'unlicensed', corpus: withSeat({}) },
      { what: 'clause-seated', corpus: withSeat({ seat: CLAUSE_SEAT }) },
      { what: 'addition', corpus: withSeat({ relation: 'addition', form: 'sentence' }) },
    ];
    const cells = cases.flatMap((row) => SWEEP_SEEDS.map((seed) => ({ ...row, seed })));
    const failures = collectSeedFailures(cells, (cell) => {
      const bare = composeFixture(cell.corpus, {
        candidates: [{ key: 'm' }], seed: cell.seed, leaves: { connectives: CLAUSE_LIST },
      });
      const withTable = composeFixture(cell.corpus, {
        candidates: [{ key: 'm' }],
        seed: cell.seed,
        leaves: { connectives: CLAUSE_LIST, relations: LICENSING },
      });
      expect(withTable, `${cell.what} at seed ${cell.seed || 'seedless'}`).toEqual(bare);
    });
    expectNoSeedFailures(failures, 'the relation table changes no composed unit');
    expect(cells, 'the sweep really ran').toHaveLength(cases.length * SWEEP_SEEDS.length);
  });

  it('⭐⭐ ONE HOME: the composer\'s connective lists ARE the leaf, not a copy of it', () => {
    // ⛔ THE TWO-HOMES DEFECT THIS CLOSES (REWRITE car 8a-11, SITTING §U c-5). Car 3a landed
    // ahead of car 4, so the composer carried the four lists as its own FLOOR CONSTANTS. Car
    // 8a-9 authored the leaf to its floors of three and the constant stayed at 1/1/0/0, so for
    // one whole car the estate held the connectives in two places that DISAGREED, with nothing
    // able to say so — and `scripts/prose-shape-report.mjs` printed a refusal naming "the
    // connectives leaf" for a condition that was true only of the constant, 408 times on the
    // taste corpus, in the report the sitting reads when it rules on shape 3.
    //
    // IDENTITY, NOT DEEP EQUALITY. Two objects that happen to match today are two homes that
    // will disagree tomorrow; `toBe` is what makes a second copy impossible rather than merely
    // currently absent.
    expect(CONNECTIVES, 'the composer reads the leaf itself').toBe(DOSSIER_CONNECTIVES);
    // The four reachable (relation, seat) pairs, and the floors the SHIFT REGISTER pins.
    expect(Object.keys(CONNECTIVES).sort()).toEqual([...RELATIONS].sort());
    expect({
      'consequence.clause': CONNECTIVES.consequence.clause.length,
      'tension.sentence': CONNECTIVES.tension.sentence.length,
      'contrast.sentence': CONNECTIVES.contrast.sentence.length,
      'addition.sentence': CONNECTIVES.addition.sentence.length,
    }, 'the `connective-list-length` mechanism, unmoved by this cure').toEqual({
      'consequence.clause': 3,
      'tension.sentence': 3,
      'contrast.sentence': 3,
      'addition.sentence': 3,
    });
    // ⛔ AND THE FENCE THE READ DOES NOT BREACH: the leaf is one of ARCH §4.1's OWN three, so
    // this widened the composer's import list by a licensed name and by nothing else.
    expect(CAR_4_LEAF_SPECIFIERS[0]).toBe('../../../data/dossierConnectives.generated.js');
  });

  it('a relation whose list is EMPTY cannot seat, and says so by not seating', () => {
    // Borrowing another relation's opener would put a claim in the joint that the edge does
    // not license, so an empty list withholds rather than falling back.
    //
    // ⚠ AS ABOVE, THE SHIPPED LIST IS NO LONGER THE EMPTY ONE: `tension.sentence` stood empty
    // in the composer's floor constant and has stood at three in the leaf since car 8a-9, and
    // REWRITE car 8a-11 made the composer read the leaf. What still stops a `tension` modifier
    // seating on any town is that no shipped pool declares one, which is a different fact and
    // is asserted where it belongs (the projection contract's `role: modifier` count of 0).
    const tense = fixtureCorpus({
      pools: { t: [{ angle: 'plain', text: 'The road is closed.' }] },
      poolMeta: { [SPINE]: { role: 'spine' }, t: modifierMeta({ relation: 'tension' }) },
    });
    expect(CONNECTIVES.tension.sentence, 'the shipped tension list, at its floor since 8a-9')
      .toEqual(['Against that,', 'Even so,', 'At the same time,']);
    // THE WITHHELD PATH, driven on an injected empty list.
    expect(composeFixture(tense, {
      candidates: [{ key: 't' }],
      leaves: { connectives: { ...CONNECTIVES, tension: { sentence: [] } } },
    }).pieces.length, 'an empty list withholds rather than borrowing').toBe(1);
    // The control: give the leaf one opener and the same pool seats.
    const seated = composeFixture(tense, {
      candidates: [{ key: 't' }],
      leaves: { connectives: { ...CONNECTIVES, tension: { sentence: ['even so,'] } } },
    });
    expect(seated.text).toBe('The walls stand. Even so, the road is closed.');
  });

  it('a ONE-PHRASE list takes NO HASH, and a longer one draws on key 4', () => {
    const one = fixtureCorpus({
      pools: { m2: [{ angle: 'plain', text: 'The road is open.' }] },
      poolMeta: { [SPINE]: { role: 'spine' }, m2: modifierMeta() },
    });
    const spy = vi.spyOn(Math, 'imul');
    try {
      composeFixture(one, { candidates: [{ key: 'm2' }], seed: '' });
      expect(spy.mock.calls.length, 'seedless, one phrase, one face: no fold at all').toBe(0);
    } finally {
      spy.mockRestore();
    }
    // A longer list is a real draw: over many seeds it reaches every phrase.
    const many = { connectives: { ...CONNECTIVES, addition: { sentence: ['', 'and yet,', 'meanwhile,'] } } };
    /** @type {Set<string>} */
    const reached = new Set();
    for (let i = 0; i < 60; i += 1) {
      reached.add(composeFixture(one, { candidates: [{ key: 'm2' }], seed: `j-${i}`, leaves: many }).text);
    }
    expect(reached.size, 'three phrases, three units').toBe(3);
    // And seedless takes the first phrase, like every other draw here.
    expect(composeFixture(one, { candidates: [{ key: 'm2' }], seed: '', leaves: many }).text)
      .toBe('The walls stand. The road is open.');
  });

  it('the four relations are the only four', () => {
    expect([...RELATIONS].sort()).toEqual(['addition', 'consequence', 'contrast', 'tension']);
    expect(Object.keys(CONNECTIVES).sort(), 'and the leaf carries a list for each')
      .toEqual([...RELATIONS].sort());
    const seats = Object.entries(CONNECTIVES).map(([relation, bySeat]) => `${relation}.${Object.keys(bySeat).join()}`);
    expect(seats.sort(), 'four reachable (relation, seat) pairs and no fifth')
      .toEqual(['addition.sentence', 'consequence.clause', 'contrast.sentence', 'tension.sentence']);
  });
});

describe('the composer — the arrangement (ARCH §4.2 step 8)', () => {
  function opener(phrase, text, over = {}) {
    const corpus = fixtureCorpus({
      pools: { m: [{ angle: 'plain', text, ...over }] },
      poolMeta: { [SPINE]: { role: 'spine' }, m: modifierMeta() },
    });
    return composeFixture(corpus, {
      candidates: [{ key: 'm' }],
      slots: { settlement: 'Thornwall' },
      leaves: { connectives: { ...CONNECTIVES, addition: { sentence: [phrase] } } },
    }).text;
  }

  it('the EMPTY opener is adjacency and nothing else', () => {
    expect(opener('', 'The granary is thin.')).toBe('The walls stand. The granary is thin.');
  });

  it('a non-empty opener is CAPITALISED and the modifier\'s first token down-cased', () => {
    expect(opener('and yet,', 'The granary is thin.'))
      .toBe('The walls stand. And yet, the granary is thin.');
  });

  it('⛔ a PROPER-typed opening slot is never down-cased — wall 10 across the join', () => {
    // T-F8. By the time the text is filled, a proper noun and a common one look the same, so
    // the rule reads the RAW text: a face that opens on `{settlement}` keeps its capital.
    expect(opener('and yet,', '{settlement} holds the road.', { slots: ['settlement'] }))
      .toBe('The walls stand. And yet, Thornwall holds the road.');
  });

  it('the CLAUSE seat strips the spine\'s stop and closes on the standing cost', () => {
    const corpus = fixtureCorpus({
      pools: { m: [{ angle: 'plain', text: 'the muster is thin' }] },
      poolMeta: {
        [SPINE]: { role: 'spine' },
        m: modifierMeta({ relation: 'consequence', form: 'fragment', seat: CLAUSE_SEAT }),
      },
    });
    const leaves = { connectives: { ...CONNECTIVES, consequence: { clause: [', so'] } } };
    const unit = composeFixture(corpus, { candidates: [{ key: 'm' }], leaves });
    expect(unit.text).toBe('The walls stand, so the muster is thin.');
    expect(unit.pieces[1].seat).toBe(CLAUSE_SEAT);
    expect(unit.pieces[1].relation).toBe('consequence');
  });
});

describe('the composer — turns (ARCH §4.2 step 1, §5.3)', () => {
  const corpus = fixtureCorpus({
    pools: {
      turn: [{ angle: 'ledger', text: 'The walls stand because the levy paid for them.' }],
      covered: [{ angle: 'plain', text: 'The levy is heavy.' }],
      other: [{ angle: 'plain', text: 'The road is open.' }],
      covertTurn: [{ angle: 'ledger', text: 'The seam is bought.', marks: ['dm-only'] }],
    },
    poolMeta: {
      [SPINE]: { role: 'spine' },
      turn: {
        role: 'turn', explains: 'levy-paid-walls', spines: [SPINE], covers: ['covered'],
      },
      covertTurn: { role: 'turn', explains: 'covert', spines: [SPINE], covers: [] },
      covered: modifierMeta(),
      other: modifierMeta(),
    },
  });

  it('a turn REPLACES the spine and the modifiers it covers', () => {
    const unit = composeFixture(corpus, {
      turns: [{ key: 'turn' }], candidates: [{ key: 'covered' }, { key: 'other' }],
    });
    expect(unit.pieces[0].role, 'the head is the turn').toBe('turn');
    expect(unit.pieces[0].key).toBe('turn');
    expect(unit.pieces.map((piece) => piece.key), 'the covered modifier is gone; the other is not')
      .toEqual(['turn', 'other']);
    expect(unit.poolKey, 'the unit still reports the SPINE key it replaced').toBe(SPINE);
    expect(unit.text.startsWith('The walls stand because the levy paid for them.')).toBe(true);
  });

  it('a COVERT turn is never a candidate on the player face', () => {
    const player = composeFixture(corpus, { turns: [{ key: 'covertTurn' }], audience: 'player' });
    expect(player.pieces[0].role, 'the composition falls back to spine plus modifiers')
      .toBe('spine');
    const dm = composeFixture(corpus, { turns: [{ key: 'covertTurn' }], audience: 'dm' });
    expect(dm.pieces[0].role, 'and the DM face does seat it').toBe('turn');
  });

  it('a turn whose `spines` does not list this spine cannot replace it', () => {
    const unit = composeFixture(corpus, { spineKey: SPINE, turns: [{ key: 'turn' }] });
    expect(unit.pieces[0].role).toBe('turn');
    const elsewhere = fixtureCorpus({
      pools: { turn: [{ angle: 'ledger', text: 'Elsewhere.' }] },
      poolMeta: { turn: { role: 'turn', spines: ['some other spine'], covers: [] } },
    });
    expect(composeFixture(elsewhere, { turns: [{ key: 'turn' }] }).pieces[0].role).toBe('spine');
  });

  it('⛔ NO TURN CAN SEAT ON THE SHIPPED CORPUS, because every pool is a SPINE', () => {
    // ⚠ AMENDED BY SEAM CAR 4, AND THE AMENDMENT IS THE POINT. This arm read "because no
    // block carries `poolMeta`" — true until car 4 landed the RENDER half, and a claim that
    // would have gone on being asserted about a corpus that had moved under it. The property
    // cars 3b–3g rest on is not the ABSENCE of metadata; it is that every shipped pool
    // declares `role: 'spine'`, which is what makes every candidate and every turn offered
    // against the corpus read as a spine and be refused. So the arm now asserts the metadata
    // is THERE and says spine, which is a stronger claim than the absence it replaced: the
    // day a pool is authored `modifier` or `turn`, this reds instead of going quietly true.
    const roles = new Set(Object.values(CORPUS)
      .flatMap((block) => Object.values(block.poolMeta || {})).map((meta) => meta.role));
    expect([...roles], 'a shipped pool declares a role other than spine').toEqual(['spine']);
    const withoutMeta = Object.entries(CORPUS).filter(([, block]) => !block.poolMeta);
    expect(withoutMeta.map(([blockId]) => blockId), 'a shipped block carrying NO pool metadata')
      .toEqual([]);
    // So every candidate and every turn offered against the shipped corpus reads as a spine
    // and is refused, which is what makes cars 3b–3g byte-identical whatever a desk offers.
    const block = SHIPPED_POOLS[0];
    const unit = composeStateProse(CORPUS, block.blockId, {
      spineKey: block.poolKey,
      candidates: SHIPPED_POOLS.filter((row) => row.blockId === block.blockId
        && row.poolKey !== block.poolKey).map((row) => ({ key: row.poolKey })),
      turns: SHIPPED_POOLS.filter((row) => row.blockId === block.blockId
        && row.poolKey !== block.poolKey).map((row) => ({ key: row.poolKey })),
      slots: bagFor(block.pool),
      seed: 'shipped-probe',
      audience: 'dm',
      dimensions: dimensionsFor(block.pool),
    });
    expect(unit.pieces.length, 'every sibling pool offered, and none of them seats').toBe(1);
  });
});

describe('the composer — the POSITION BUDGET (ARCH §4.4)', () => {
  /** Ten rungs, each with a modifier that would seat if the mount let it. */
  const corpus = fixtureCorpus({
    pools: Object.fromEntries([
      ...Array.from({ length: 10 }, (_, i) => [`s${i}`, [{ angle: 'ledger', text: `Spine ${i}.` }]]),
      ...Array.from({ length: 10 }, (_, i) => [`m${i}`, [{ angle: 'plain', text: `Mod ${i}.` }]]),
    ]),
    poolMeta: Object.fromEntries([
      ...Array.from({ length: 10 }, (_, i) => [`s${i}`, { role: 'spine' }]),
      ...Array.from({ length: 10 }, (_, i) => [`m${i}`, modifierMeta({ attach: [`s${i}`] })]),
    ]),
  });
  const rungs = Array.from({ length: 10 }, (_, i) => ({
    spineKey: `s${i}`, candidates: [{ key: `m${i}` }], turns: [],
  }));

  it('at most TWO rungs of a mount carry modifiers, and the rest are bare spines', () => {
    const units = composeStateProseMount(corpus, FIX, rungs, { seed: 'mount-1', audience: 'dm' });
    expect(units.length, 'one unit per rung, in the rungs\' own order').toBe(10);
    expect(units.map((unit) => unit.poolKey), 'and the order really is the desk\'s')
      .toEqual(rungs.map((rung) => rung.spineKey));
    const bearing = units.filter((unit) => unit.pieces.length > 1);
    expect(bearing.length, 'the position budget')
      .toBe(COMPOSITION_BOUNDS.modifierBearingRungs);
    expect(COMPOSITION_BOUNDS.modifierBearingRungs).toBe(2);
    // The control: composed one at a time, all ten would carry a modifier. The budget is
    // therefore doing work rather than describing a mount that could not seat anyway.
    const alone = rungs.map((rung) => composeStateProse(corpus, FIX, {
      ...rung, seed: 'mount-1', audience: 'dm',
    }));
    expect(alone.filter((unit) => unit.pieces.length > 1).length, 'ten rungs, ten modifiers')
      .toBe(10);
  });

  it('the two that keep their modifiers are chosen by BAND first, then by the seed', () => {
    const leaves = { norms: { [`${FIX}::m7`]: { departure: 1 }, [`${FIX}::m3`]: { departure: 1 } } };
    /** @type {Set<string>} */
    const winners = new Set();
    for (let i = 0; i < 25; i += 1) {
      const units = composeStateProseMount(corpus, FIX, rungs, { seed: `p-${i}`, audience: 'dm', leaves });
      winners.add(units.filter((unit) => unit.pieces.length > 1)
        .map((unit) => unit.poolKey).sort().join('|'));
    }
    expect([...winners], 'the two banded rungs win every seed').toEqual(['s3|s7']);
  });

  it('a pool seated at one rung is WITHDRAWN from the others at that mount', () => {
    // One modifier pool attached to every spine: the mount may seat it once, not twice.
    const shared = fixtureCorpus({
      pools: {
        ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`s${i}`, [{ angle: 'ledger', text: `Spine ${i}.` }]])),
        shared: [{ angle: 'plain', text: 'The levy is heavy.' }],
      },
      poolMeta: {
        ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`s${i}`, { role: 'spine' }])),
        shared: modifierMeta({ attach: ['s0', 's1', 's2', 's3'] }),
      },
    });
    const units = composeStateProseMount(shared, FIX, Array.from({ length: 4 }, (_, i) => ({
      spineKey: `s${i}`, candidates: [{ key: 'shared' }], turns: [],
    })), { seed: 'w-1', audience: 'dm' });
    const seated = units.filter((unit) => unit.pieces.some((piece) => piece.key === 'shared'));
    expect(seated.length, 'one fact speaks once per mount').toBe(1);
  });

  it('a mount with no candidates composes every rung as a bare spine, in order', () => {
    const bare = composeStateProseMount(corpus, FIX, rungs.map((rung) => ({
      spineKey: rung.spineKey, candidates: [], turns: [],
    })), { seed: 'mount-1', audience: 'dm' });
    expect(bare.map((unit) => unit.text), 'ten spines and nothing else')
      .toEqual(Array.from({ length: 10 }, (_, i) => `Spine ${i}.`));
    expect(composeStateProseMount(corpus, 'DS-NOPE', rungs, {}), 'an absent block is ten silences')
      .toEqual(rungs.map(() => null));
  });
});

describe('the composer — what it must NOT do', () => {
  it('⛔ COHERENCE IS NOT THE DRAW\'S: a restating modifier still seats', () => {
    // CLERK-LAWS §2.5 / R-DA-20. A runtime refusal would change `eligible.length` and move
    // every later index, so a restatement is refused at the FREEZE (a projector error on
    // ATTACH) and convicted at the GATE, never filtered here. This arm exists so a later
    // lane cannot "improve" the composer into a filter without a red.
    const corpus = fixtureCorpus({
      pools: { echo: [{ angle: 'plain', text: 'The walls stand.' }] },
      poolMeta: { [SPINE]: { role: 'spine' }, echo: modifierMeta() },
    });
    const unit = composeFixture(corpus, { candidates: [{ key: 'echo' }] });
    // The restatement is stated twice WITH the drawn opener in front of it, which is if
    // anything the sharper reading of the same point: the composer joins whatever it is handed.
    expect(unit.text, 'the composer states it twice, and the gate is what refuses that')
      .toBe('The walls stand. Beside that, the walls stand.');
    expect(unit.pieces.length).toBe(2);
  });

  it('⛔ `provenance.pieces` rides inside the object a GLANCE mount strips', () => {
    // ARCH §4.1: the composed unit goes into a rung's `provenance`, and `drawnAtMount` blanks
    // `provenance` outright on a glance row — so a glance surface cannot leak a piece list.
    const unit = composeFixture(fixtureCorpus());
    const rung = { glance: 'Walled', sentence: unit.text, detail: [], provenance: unit };
    const glance = drawnAtMount('overview.snapshotTiles', rung);
    expect(glance === null || glance.provenance === null, 'a glance row carries no provenance')
      .toBe(true);
    // The paired positive: a SENTENCE mount keeps it, so the strip above is a rung class
    // rather than a function that blanks everything.
    const kept = drawnAtMount('overview.systemsHealth', rung);
    expect(kept.provenance.pieces.length, 'a sentence mount keeps the pieces').toBe(1);
  });
});

describe('the six candidates leaves (ARCH §4.1, M-F7)', () => {
  const LEAVES = [
    ['defense', defenseStateProseCandidates], ['economy', economyStateProseCandidates],
    ['general', generalStateProseCandidates], ['power', powerStateProseCandidates],
    ['stressors', stressorsStateProseCandidates], ['warFaith', warFaithStateProseCandidates],
  ];

  it('all six exist, answer a FROZEN ordered array, and are EMPTY at this car', () => {
    const answers = LEAVES.map(([desk, fn]) => {
      const out = fn('DS-GEN-3', { anything: true });
      return `${desk}:${Array.isArray(out)}:${Object.isFrozen(out)}:${out.length}`;
    });
    expect(answers).toEqual([
      'defense:true:true:0', 'economy:true:true:0', 'general:true:true:0',
      'power:true:true:0', 'stressors:true:true:0', 'warFaith:true:true:0',
    ]);
  });

  it('each one FAILS CLOSED on a caller with no block or no readings', () => {
    const bad = LEAVES.flatMap(([desk, fn]) => [
      `${desk}:${fn('', {}).length}`, `${desk}:${fn('DS-GEN-3', null).length}`,
      `${desk}:${fn('DS-GEN-3', 'not an object').length}`,
    ]);
    expect(bad.every((row) => row.endsWith(':0')), 'silence, never a guess').toBe(true);
    expect(bad.length, 'and every leaf was asked').toBe(18);
  });

  it('an EMPTY candidate list is what the whole car rests on', () => {
    // The desks call these leaves from car 3b onward. While they answer `[]`, routing a desk
    // through the composer cannot move a byte — which is the acceptance of cars 3b–3g.
    const block = SHIPPED_POOLS.find((row) => row.blockId === 'DS-GEN-3') || SHIPPED_POOLS[0];
    const candidates = generalStateProseCandidates(block.blockId, { any: 1 });
    const unit = composeStateProse(CORPUS, block.blockId, {
      spineKey: block.poolKey, candidates, turns: [], slots: bagFor(block.pool),
      seed: 'leaf-probe', audience: 'dm', dimensions: dimensionsFor(block.pool),
    });
    const base = readStateProse(CORPUS, block.blockId, block.poolKey, {
      slots: bagFor(block.pool), seed: 'leaf-probe', audience: 'dm',
      dimensions: dimensionsFor(block.pool),
    });
    expect(unit.text).toBe(base.text);
    expect(unit.pieces.length).toBe(1);
  });
});

describe('the car-4 leaf roster', () => {
  it('names exactly three specifiers, and is what the fence allowlist joins to', () => {
    expect([...CAR_4_LEAF_SPECIFIERS]).toEqual([
      '../../../data/dossierConnectives.generated.js',
      '../../../data/proseNorms.generated.js',
      '../../../data/dossierRelations.generated.js',
    ]);
    expect(Object.isFrozen(CAR_4_LEAF_SPECIFIERS)).toBe(true);
  });
});

/**
 * ── ONE FACE PER POWER AT THE COMPOSER (ADDENDUM 18 ruling 15; REWRITE car 8b-W-18c) ──
 * The desk hands the town's roster as `sources`; the face is drawn among the faces whose power
 * resolves; a marked PAIR renders both halves in face order, the partner's piece marked
 * `pairOf` with the pair's `pairKind`; the head's power rides on the unit as `source`.
 */
describe('the composer — ONE FACE PER POWER: the source filter and the pair (car 8b-W-18c)', () => {
  /** One variant, four faces: the spine (stranger), the hall, the tavern (paired, disagree), a bare face. */
  const POWERED = {
    angle: 'ledger',
    text: 'The walls stand.',
    wordings: ['The hall has the circuit kept.', 'The tavern says nobody stands on it.', 'Anyone can see the stone.'],
    sources: [null, 'hall', 'tavern', null],
    pairs: [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null],
  };
  const poweredCorpus = () => fixtureCorpus({ pools: { [SPINE]: [POWERED] } });
  const SEEDS = Array.from({ length: 200 }, (_, i) => `pair-seed-${i}`);

  /**
   * ⭐ THE FIVE ARRANGEMENTS A `disagree` PAIR OF TWO SINGLE SENTENCES CAN TAKE (ADDENDUM 18
   * ruling 23; car 8b-W-18i) — the four compound joints and the full stop. Spelled out here
   * rather than recomputed from `PAIR_JOINTS`, so a car that quietly re-worded a joint or
   * dropped the lowercase rule reds against the SENTENCES a reader would see.
   */
  const PAIR_RENDERS = Object.freeze([
    'The hall has the circuit kept, though the tavern says nobody stands on it.',
    'The hall has the circuit kept, but the tavern says nobody stands on it.',
    'The hall has the circuit kept, while the tavern says nobody stands on it.',
    'The hall has the circuit kept, and yet the tavern says nobody stands on it.',
    'The hall has the circuit kept. The tavern says nobody stands on it.',
  ]);

  it('⭐ a pair renders BOTH where both powers resolve, in face order, the partner marked pairOf + pairKind', () => {
    const corpus = poweredCorpus();
    let paired = 0;
    for (const seed of SEEDS) {
      const unit = composeFixture(corpus, { seed, sources: new Set(['stranger', 'hall', 'tavern']) });
      expect(unit).not.toBe(null);
      const faces = unit.pieces.map((piece) => piece.face);
      if (unit.pieces.length === 2) {
        paired += 1;
        expect(faces, 'face order, whichever half was drawn').toEqual([1, 2]);
        // ⭐ THE JOINT IS DRAWN (ADDENDUM 18 ruling 23; car 8b-W-18i): the pair renders as one
        // of five arrangements — four compound forms and the full stop, which is car
        // 8b-W-18c's own render. The set is closed and the membership is the assertion.
        expect(PAIR_RENDERS, `seed ${seed}`).toContain(unit.text);
        const drawn = unit.pieces.find((piece) => piece.pairOf === undefined);
        const partner = unit.pieces.find((piece) => piece.pairOf !== undefined);
        expect(drawn.source).toBe(drawn.face === 1 ? 'hall' : 'tavern');
        expect(partner.pairOf).toBe(drawn.face);
        expect(partner.pairKind).toBe('disagree');
        expect(partner.source).toBe(partner.face === 1 ? 'hall' : 'tavern');
        expect(unit.source, 'the unit carries the DRAWN half\'s power').toBe(drawn.source);
        expect(Object.isFrozen(partner)).toBe(true);
      } else {
        expect(unit.pieces.length).toBe(1);
        expect([0, 3]).toContain(faces[0]);
        expect(unit.source, 'an unsourced face puts no source on the unit').toBe(undefined);
        expect(unit.pieces[0].source).toBe(undefined);
      }
    }
    expect(paired, 'and the pair really was drawn').toBeGreaterThan(40);
  });

  it('⭐ a pair renders ONE where the partner\'s power is absent — the drawn face alone', () => {
    const corpus = poweredCorpus();
    let hall = 0;
    for (const seed of SEEDS) {
      const unit = composeFixture(corpus, { seed, sources: ['stranger', 'hall'] });
      expect(unit.pieces.length, seed).toBe(1);
      expect(unit.pieces[0].face, 'the tavern never speaks in a town without one').not.toBe(2);
      if (unit.pieces[0].face === 1) {
        hall += 1;
        expect(unit.text).toBe('The hall has the circuit kept.');
        expect(unit.source).toBe('hall');
        expect(unit.pieces[0].pairOf, 'the drawn face is never marked as a partner').toBe(undefined);
      }
    }
    expect(hall).toBeGreaterThan(30);
  });

  it('no roster on the read is the stranger alone; an empty roster likewise', () => {
    const corpus = poweredCorpus();
    for (const seed of SEEDS.slice(0, 60)) {
      for (const sources of [undefined, null, [], new Set(), 'hall']) {
        const unit = composeFixture(corpus, { seed, sources });
        expect([0, 3], `seed ${seed}`).toContain(unit.pieces[0].face);
        expect(unit.pieces.length).toBe(1);
      }
    }
  });

  it('⭐ ZERO SHIFT: the shipped corpus composes byte-identically with any roster, all 708 pools, both audiences', () => {
    const rosters = [undefined, new Set(['stranger']), new Set(['stranger', 'hall', 'tavern', 'guild', 'register', 'muster', 'watch', 'garrison', 'gate', 'market', 'court', 'elders'])];
    const drift = [];
    let checks = 0;
    for (const { blockId, poolKey, pool } of SHIPPED_POOLS) {
      const slots = bagFor(pool);
      const dimensions = dimensionsFor(pool);
      for (const audience of ['dm', 'player']) {
        for (const seed of SWEEP_SEEDS) {
          const base = composeStateProse(CORPUS, blockId, { slots, seed, audience, dimensions, spineKey: poolKey, candidates: [] });
          for (const sources of rosters) {
            checks += 1;
            const unit = composeStateProse(CORPUS, blockId, { slots, seed, audience, dimensions, sources, spineKey: poolKey, candidates: [] });
            if (JSON.stringify(unit) !== JSON.stringify(base)) drift.push(`${blockId} :: ${poolKey} :: ${audience} :: "${seed}"`);
          }
        }
      }
    }
    // ⭐ RE-PINNED AT THE FIRST v3 POOL. A roster CANNOT move a read on the 707 pools that
    // carry one face each — that is still asserted, and it is the whole zero-shift claim
    // cars 3b–3g rest on. On DS-DEF-2's faced pool a roster is SUPPOSED to move the read
    // (ADDENDUM 18 ruling 15: a town hears the powers it has), so the mover is named and
    // its movement asserted rather than tolerated.
    const faced = drift.filter((row) => isFaced(row, true));
    const elsewhere = drift.filter((row) => !isFaced(row, true));
    expect(elsewhere.slice(0, 10)).toEqual([]);
    expect(elsewhere.length).toBe(0);
    expect(faced.length, 'the named mover moved under a roster').toBeGreaterThan(0);
    expect(checks).toBe(708 * 2 * SWEEP_SEEDS.length * rosters.length);
  });

  it('the one-piece shipped unit keeps exactly its five keys — no source, no pairOf, no pairKind', () => {
    const unit = composeFixture(fixtureCorpus());
    expect(Object.keys(unit.pieces[0]).sort()).toEqual(['face', 'index', 'key', 'role', 'vid']);
    expect('source' in unit).toBe(false);
    // And a sourced piece carries exactly the keys it earned.
    const sourced = composedPieceOf([POWERED], POWERED, SPINE, { role: 'spine', face: 2, source: 'tavern', pairOf: 1, pairKind: 'disagree' });
    expect(Object.keys(sourced).sort()).toEqual(['face', 'index', 'key', 'pairKind', 'pairOf', 'role', 'source', 'vid']);
    const bare = composedPieceOf([POWERED], POWERED, SPINE, { role: 'spine', face: 3, source: null, pairOf: null, pairKind: null });
    expect(Object.keys(bare).sort()).toEqual(['face', 'index', 'key', 'role', 'vid']);
  });

  it('a paired head closes the SENTENCE seat while it states two sentences, and a COMPOUND pair opens it again (ruling 23)', () => {
    const corpus = fixtureCorpus({
      pools: {
        [SPINE]: [POWERED],
        'muster: short': [{ angle: 'ledger', text: 'The muster is short.' }],
      },
      poolMeta: { 'muster: short': modifierMeta() },
    });
    const both = new Set(['hall', 'tavern']);
    let stopped = 0;
    let compounded = 0;
    for (const seed of SEEDS) {
      const unit = composeStateProse(corpus, FIX, {
        spineKey: SPINE, candidates: [{ key: 'muster: short' }], seed, audience: 'dm', sources: both, leaves: { connectives: CONNECTIVES },
      });
      const headPieces = unit.pieces.filter((piece) => piece.key === SPINE);
      if (headPieces.length !== 2) continue;
      // ⭐ THE CAPACITY IS SPENT IN SENTENCES, NOT IN FACES (car 8b-W-18i, said out loud rather
      // than discovered later). A pair joined by the FULL STOP states two sentences and closes
      // the sentence seat exactly as a two-sentence spine would. A pair that COMPOUNDS states
      // ONE, so the unit has a sentence left and the seat is open — which is ruling 23 working
      // as written: the second attribution rides inside the sentence and costs nothing extra.
      const joint = pairJoint('disagree', FIX, SPINE, seed);
      const modifiers = unit.pieces.filter((piece) => piece.role === 'modifier');
      if (joint === FULL_STOP_JOINT) {
        stopped += 1;
        expect(modifiers, `seed ${seed}: no third sentence after a stopped pair`).toEqual([]);
      } else {
        compounded += 1;
        expect(modifiers.length, `seed ${seed}: the compound left a sentence to spend`).toBe(1);
        // The compound itself, whole and in one sentence, wherever the arrangement puts it.
        expect(unit.text, seed).toContain('The hall has the circuit kept,');
        expect(unit.text, seed).toContain('the tavern says nobody stands on it.');
        // The modifier seats with the connectives leaf's own opener, so the match is on its
        // body rather than on its capital: "Also, the muster is short."
        expect(unit.text.toLowerCase(), seed).toContain('the muster is short.');
      }
    }
    expect(stopped, 'the full-stop arrangement really was drawn').toBeGreaterThan(10);
    expect(compounded, 'and so was the compound').toBeGreaterThan(40);
  });

  // ── THE ARCHIVER'S WEIGHING ROW (ADDENDUM 18 ruling 22; car 8b-W-18i) ──────────────────
  /** The same pair, with the archiver's one sentence closing it. */
  const WEIGHED = {
    angle: 'ledger',
    text: 'The walls stand.',
    wordings: [
      'The hall has the circuit kept.',
      'The tavern says nobody stands on it.',
      'It may be that the two are describing different weeks.',
    ],
    sources: [null, 'hall', 'tavern', ARCHIVER_SOURCE],
    pairs: [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, { id: 1, kind: WEIGH_KIND }],
  };

  it('⭐ THE WEIGHING ROW CLOSES THE PAIR — appended after the joint, marked pairOf + pairKind weigh, and never drawn alone (ruling 22)', () => {
    const corpus = fixtureCorpus({ pools: { [SPINE]: [WEIGHED] } });
    const both = new Set(['stranger', 'hall', 'tavern']);
    let weighed = 0;
    let alone = 0;
    for (const seed of SEEDS) {
      const unit = composeFixture(corpus, { seed, sources: both });
      // ⛔ THE ARCHIVER IS NEVER THE DRAWN FACE, on any seed.
      expect(unit.pieces[0].face, `seed ${seed}`).not.toBe(3);
      expect(unit.pieces[0].source).not.toBe(ARCHIVER_SOURCE);
      if (unit.pieces.length === 1) {
        alone += 1;
        // The spine drew: no pair, so no weighing either.
        expect(unit.pieces[0].face).toBe(0);
        expect(unit.text).toBe('The walls stand.');
        continue;
      }
      weighed += 1;
      expect(unit.pieces.map((piece) => piece.face), 'the pair in face order, then the weighing')
        .toEqual([1, 2, 3]);
      const weigh = unit.pieces[2];
      expect(weigh.source).toBe(ARCHIVER_SOURCE);
      expect(weigh.pairKind).toBe(WEIGH_KIND);
      expect(weigh.pairOf, 'the weighing is marked against the DRAWN half').toBe(unit.pieces
        .find((piece) => piece.pairOf === undefined).face);
      expect(Object.isFrozen(weigh)).toBe(true);
      // THE TEXT: the pair as ruling 23 arranged it, then the archiver's sentence, on a space.
      expect(unit.text.endsWith(' It may be that the two are describing different weeks.')).toBe(true);
      const pair = unit.text.slice(0, -' It may be that the two are describing different weeks.'.length);
      expect(PAIR_RENDERS, `seed ${seed}: the pair under the weighing`).toContain(pair);
      // ⛔ AND THE UNIT'S SOURCE IS STILL THE DRAWN HALF'S, never the archiver's.
      expect(['hall', 'tavern']).toContain(unit.source);
    }
    expect(weighed, 'the pair really was drawn').toBeGreaterThan(40);
    expect(alone, 'and the spine really was drawn too').toBeGreaterThan(10);
  });

  it('⭐ NO PAIR, NO WEIGHING: a town that hears only one half hears no weighing either (ruling 22)', () => {
    const corpus = fixtureCorpus({ pools: { [SPINE]: [WEIGHED] } });
    for (const seed of SEEDS.slice(0, 80)) {
      // Only the hall stands here, so the pair never resolves whole.
      const unit = composeFixture(corpus, { seed, sources: new Set(['stranger', 'hall']) });
      expect(unit.pieces.length, `seed ${seed}`).toBe(1);
      expect(unit.pieces[0].face).not.toBe(3);
      expect(unit.text).not.toContain('It may be that');
      expect(unit.pieces[0].pairKind).toBe(undefined);
    }
  });

  it('⭐ AN UNFILLED WEIGHING ROW SILENCES ITSELF AND LEAVES THE PAIR STANDING (car 8b-W-18i)', () => {
    // The weighing names a slot the read has no fill for; the pair still renders.
    const corpus = fixtureCorpus({
      pools: {
        [SPINE]: [{
          ...WEIGHED,
          slots: ['material'],
          text: 'The walls of {material} stand.',
          wordings: [
            'The hall has the circuit kept.',
            'The tavern says nobody stands on it.',
            'It may be that the {counterpart} road is the older argument.',
          ],
        }],
      },
    });
    let paired = 0;
    for (const seed of SEEDS.slice(0, 120)) {
      const unit = composeFixture(corpus, {
        seed, sources: new Set(['stranger', 'hall', 'tavern']), slots: { material: 'stone' },
      });
      if (unit === null || unit.pieces.length === 1) continue;
      paired += 1;
      expect(unit.pieces.map((piece) => piece.face), 'the weighing dropped, the pair kept').toEqual([1, 2]);
      expect(unit.text).not.toContain('{counterpart}');
      expect(PAIR_RENDERS).toContain(unit.text);
    }
    expect(paired, 'the pair really was drawn').toBeGreaterThan(20);
  });

  it('the mount passes the roster through to every rung', () => {
    const corpus = poweredCorpus();
    const out = composeStateProseMount(corpus, FIX, [{ spineKey: SPINE }, { spineKey: SPINE }], { seed: 'mount-7', audience: 'dm', sources: new Set(['hall', 'tavern']) });
    const direct = composeFixture(corpus, { seed: 'mount-7', sources: new Set(['hall', 'tavern']) });
    expect(JSON.stringify(out[0])).toBe(JSON.stringify(direct));
    expect(JSON.stringify(out[1])).toBe(JSON.stringify(direct));
  });
});
