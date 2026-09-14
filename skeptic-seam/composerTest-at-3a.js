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
  STATE_MARK_DIMENSIONS, poolDimensions, readStateProse,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { drawnAtMount } from '../../src/domain/display/stateProse/dossierMounts.js';
import { defenseStateProseCandidates } from '../../src/domain/display/stateProse/defenseStateProseCandidates.js';
import { economyStateProseCandidates } from '../../src/domain/display/stateProse/economyStateProseCandidates.js';
import { generalStateProseCandidates } from '../../src/domain/display/stateProse/generalStateProseCandidates.js';
import { powerStateProseCandidates } from '../../src/domain/display/stateProse/powerStateProseCandidates.js';
import { stressorsStateProseCandidates } from '../../src/domain/display/stateProse/stressorsStateProseCandidates.js';
import { warFaithStateProseCandidates } from '../../src/domain/display/stateProse/warFaithStateProseCandidates.js';
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
    expect(drift.slice(0, 10), 'a pool where the composer and the kernel disagree').toEqual([]);
    expect(drift.length).toBe(0);
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
    /** @type {string[]} */
    const mismatch = [];
    let checked = 0;
    for (const cell of run.cells) {
      const block = CORPUS[cell.block];
      const pool = block && block.pools ? block.pools[cell.pool] : undefined;
      if (!Array.isArray(pool)) { mismatch.push(`NOPOOL ${cell.cell}`); continue; }
      const variant = pool[cell.vid];
      const audience = cell.cell.split('::')[1];
      const piece = composedPieceOf(pool, variant, cell.pool, { role: 'spine', face: 0, audience });
      checked += 1;
      if (JSON.stringify(piece) !== JSON.stringify(cell.pieces[0])) {
        mismatch.push(`${cell.cell} :: composer ${JSON.stringify(piece)}`
          + ` :: recorder ${JSON.stringify(cell.pieces[0])}`);
      }
    }
    process.stdout.write(`[compose] base-side synthesis checked on ${checked} cells of`
      + ` ${run.rows.size} rows · mismatches ${mismatch.length}\n`);
    expect(mismatch.slice(0, 5), 'a cell the composer would coordinate differently').toEqual([]);
    expect(mismatch.length).toBe(0);
    expect(checked, 'the whole recorded table').toBe(run.cells.length);
    expect(run.rows.size, 'and the table is the full DRIFT corpus').toBe(1050);
  }, 300_000);

  it('⚠ THE CELL ARM CANNOT TELL `vid` FROM `index` AT THIS TIP, and here is the measurement', () => {
    // ⛔ A LIMIT OF THE ARM ABOVE, FOUND BY EXECUTING IT AND REPORTED RATHER THAN PAPERED
    // OVER. `vid` is the position AS AUTHORED and `index` the position in the
    // AUDIENCE-FILTERED pool, and the two can only differ when a `dm-only` variant sits
    // BEFORE the drawn one on the player face. On this corpus that never happens: ZERO of
    // the recorded cells have vid != index, so the per-cell equality above would also pass
    // for a composer that confused the two coordinates.
    //
    // WHY, measured here rather than asserted: the corpus ships twelve MIXED pools, and the
    // DRIFT run reaches only a few of them — on which the player's audible list is a prefix
    // of the authored one (or a single survivor), so the two coordinates coincide.
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
    // PINNED IN BOTH DIRECTIONS. Today it is 0, so this arm records a KNOWN BLIND SPOT; the
    // day a car makes a player face draw past a covert variant it reds here, and whoever
    // reads the red learns that the cell arm has just become sensitive to the confusion.
    expect(apart.length, 'cells that would tell the two coordinates apart').toBe(0);
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
        [SPINE]: { role: 'spine', reads: ['a', 'b'] },
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
      poolMeta: { [SPINE]: { role: 'spine', reads: ['x', 'y'] }, B: modifierMeta(), a: modifierMeta() },
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
      [SPINE]: { role: 'spine', reads: ['walls'] },
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
        [SPINE]: { role: 'spine', reads: ['walls'] },
        graded: modifierMeta(),
        plain: modifierMeta(),
      },
    });
    const unanswered = composeFixture(partitioned, { candidates: [{ key: 'graded' }] });
    expect(unanswered.pieces.length, 'unanswered: the pool cannot speak').toBe(1);
    const answered = composeFixture(partitioned, {
      candidates: [{ key: 'graded' }], dimensions: { severity: 'major' },
    });
    expect(answered.text, 'answered: it speaks the value it names')
      .toBe('The walls stand. A major wave.');
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
        [SPINE]: { role: 'spine', reads: ['walls'] },
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
        [SPINE]: { role: 'spine', reads: ['walls'] },
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
    expect(unfilled.text, 'the top-ranked candidate dropped, the next one seated')
      .toBe('The walls stand. The road is open.');
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
  /** A block whose spine declares `reads` of the given length. */
  function boundedCorpus(reads, extra = {}) {
    return fixtureCorpus({
      pools: {
        one: [{ angle: 'plain', text: 'One holds.' }],
        two: [{ angle: 'plain', text: 'Two holds.' }],
        ...(extra.pools || {}),
      },
      poolMeta: {
        [SPINE]: { role: 'spine', reads },
        one: modifierMeta(extra.one),
        two: modifierMeta(extra.two),
      },
    });
  }

  const BOTH = [{ key: 'one' }, { key: 'two' }];
  /** A relation table that licenses a clause joint from the spine's field to `two`'s. */
  const CLAUSE_LEAVES = {
    relations: { 'walls|muster': [{ relation: 'consequence', source: 'fixture', direction: 'a→b' }] },
    connectives: { ...CONNECTIVES, consequence: { clause: [', so'] } },
  };

  it('THE FACT BUDGET is `3 - |spine.reads|`, and a three-fact spine takes none', () => {
    const clause = { ...CLAUSE_LEAVES };
    const two = boundedCorpus(['walls'], { two: { relation: 'consequence', reads: ['muster'] } });
    const three = boundedCorpus(['walls', 'x', 'y'], { two: { relation: 'consequence', reads: ['muster'] } });
    const pair = boundedCorpus(['walls', 'x'], { two: { relation: 'consequence', reads: ['muster'] } });
    expect(composeFixture(two, { candidates: BOTH, leaves: clause }).pieces.length,
      'a one-fact spine takes two modifiers').toBe(3);
    expect(composeFixture(pair, { candidates: BOTH, leaves: clause }).pieces.length,
      'a two-fact spine takes one').toBe(2);
    expect(composeFixture(three, { candidates: BOTH, leaves: clause }).pieces.length,
      'a three-fact spine takes none').toBe(1);
    expect(COMPOSITION_BOUNDS.facts, 'the ceiling the budget is spent against').toBe(3);
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
        [SPINE]: { role: 'spine', reads: [] },
        one: modifierMeta(),
        two: modifierMeta({ relation: 'consequence', reads: ['muster'] }),
        three: modifierMeta(),
        four: modifierMeta({ relation: 'consequence', reads: ['muster'] }),
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
      poolMeta: { [SPINE]: { role: 'spine', reads: [] }, one: modifierMeta() },
    });
    expect(composeFixture(corpus, { candidates: [{ key: 'one' }] }).pieces.length,
      'a two-sentence spine seats nothing at the sentence').toBe(1);
    // The control: the same modifier seats behind a one-sentence spine.
    expect(composeFixture(fixtureCorpus({
      pools: { one: [{ angle: 'plain', text: 'One holds.' }] },
      poolMeta: { [SPINE]: { role: 'spine', reads: [] }, one: modifierMeta() },
    }), { candidates: [{ key: 'one' }] }).pieces.length).toBe(2);
  });

  it('THE CLAUSE SEAT is closed by a final sentence that already ranks two clauses', () => {
    const ranked = fixtureCorpus({
      pools: {
        [SPINE]: [{ angle: 'ledger', text: 'The walls stand; the gate is watched.' }],
        two: [{ angle: 'plain', text: 'the muster is thin' }],
      },
      poolMeta: {
        [SPINE]: { role: 'spine', reads: ['walls'] },
        two: modifierMeta({ relation: 'consequence', form: 'fragment', reads: ['muster'] }),
      },
    });
    expect(composeFixture(ranked, { candidates: [{ key: 'two' }], leaves: CLAUSE_LEAVES })
      .pieces.length, 'a semicolon in the final sentence closes the joint').toBe(1);
    const clean = fixtureCorpus({
      pools: { two: [{ angle: 'plain', text: 'the muster is thin' }] },
      poolMeta: {
        [SPINE]: { role: 'spine', reads: ['walls'] },
        two: modifierMeta({ relation: 'consequence', form: 'fragment', reads: ['muster'] }),
      },
    });
    expect(composeFixture(clean, { candidates: [{ key: 'two' }], leaves: CLAUSE_LEAVES }).text,
      'and with a clean final sentence the joint lands').toBe('The walls stand, so the muster is thin.');
  });
});

describe('the composer — relations, seats and connectives (ARCH §4.5)', () => {
  const corpus = fixtureCorpus({
    pools: { m: [{ angle: 'plain', text: 'the muster is thin' }] },
    poolMeta: {
      [SPINE]: { role: 'spine', reads: ['walls'] },
      m: modifierMeta({ relation: 'consequence', form: 'fragment', reads: ['muster'] }),
    },
  });
  const CLAUSE_LIST = { ...CONNECTIVES, consequence: { clause: [', so'] } };

  it('⛔ NO CLAUSE CAN SEAT ON THE SHIPPED CORPUS, because the relation table is empty', () => {
    // ARCH §16 item 9 / car 0's F1: none of the engine's 165 relation rows joins a desk read
    // root, and source (d) is empty. So every joint on the shipped corpus stands at the
    // `addition` floor. Read off the leaf rather than believed.
    expect(Object.keys(PROSE_RELATIONS).length, 'relation rows that ship today').toBe(0);
    expect(Object.keys(PROSE_NORMS).length, 'norm bits that ship today').toBe(0);
    const unit = composeFixture(corpus, { candidates: [{ key: 'm' }] });
    expect(unit.pieces.filter((piece) => piece.seat === CLAUSE_SEAT), 'no joint seats')
      .toEqual([]);
    // A `consequence` with no licensing row is not refused — it seats as an ADDITION at the
    // sentence, which is where a cause belongs (§4.5), AND ITS RELATION CHANGES WITH ITS
    // SEAT: `consequence` has one list and it is the clause list, so a fallback that kept
    // the declared relation would find no list and silently fail to seat at all.
    expect(unit.pieces[1].seat, 'it falls to the sentence seat').toBe(SENTENCE_SEAT);
    expect(unit.pieces[1].relation, 'and it seats AS an addition').toBe('addition');
    // ⚠ THE FIXTURE'S TEXT IS A FRAGMENT, which is why the unit reads oddly here: the annex
    // refuses `FORM: fragment` under a sentence seat (§2.5's FORM row), so this row could
    // not ship. What is being driven is the SEAT decision, not a shippable sentence.
    expect(unit.text).toBe('The walls stand. the muster is thin');
  });

  it('a row in the SPINE-TO-MODIFIER direction licenses the clause; the other way does not', () => {
    const forward = {
      relations: { 'walls|muster': [{ relation: 'consequence', source: 'd', direction: 'a→b' }] },
      connectives: CLAUSE_LIST,
    };
    const backward = {
      relations: { 'walls|muster': [{ relation: 'consequence', source: 'd', direction: 'b→a' }] },
      connectives: CLAUSE_LIST,
    };
    const mirrored = {
      relations: { 'muster|walls': [{ relation: 'consequence', source: 'd', direction: 'b→a' }] },
      connectives: CLAUSE_LIST,
    };
    const seatOf = (leaves) => {
      const piece = composeFixture(corpus, { candidates: [{ key: 'm' }], leaves }).pieces[1];
      return `${piece.seat}/${piece.relation}`;
    };
    expect(seatOf(forward), 'spine to modifier: the clause').toBe(`${CLAUSE_SEAT}/consequence`);
    expect(seatOf(backward), 'modifier to spine is a CAUSE, and a cause seats as an addition')
      .toBe(`${SENTENCE_SEAT}/addition`);
    expect(seatOf(mirrored), 'the pair keyed the other way round, direction b to a, is the same edge')
      .toBe(`${CLAUSE_SEAT}/consequence`);
  });

  it('a relation whose list is EMPTY cannot seat, and says so by not seating', () => {
    // `tension.sentence` ships empty: there is no authored opener, and borrowing another
    // relation's would put a claim in the joint that the edge does not license.
    const tense = fixtureCorpus({
      pools: { t: [{ angle: 'plain', text: 'The road is closed.' }] },
      poolMeta: { [SPINE]: { role: 'spine', reads: [] }, t: modifierMeta({ relation: 'tension' }) },
    });
    expect(CONNECTIVES.tension.sentence, 'the shipped tension list').toEqual([]);
    expect(composeFixture(tense, { candidates: [{ key: 't' }] }).pieces.length).toBe(1);
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
      poolMeta: { [SPINE]: { role: 'spine', reads: [] }, m2: modifierMeta() },
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
      poolMeta: { [SPINE]: { role: 'spine', reads: [] }, m: modifierMeta() },
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
        [SPINE]: { role: 'spine', reads: ['walls'] },
        m: modifierMeta({ relation: 'consequence', form: 'fragment', reads: ['muster'] }),
      },
    });
    const leaves = {
      relations: { 'walls|muster': [{ relation: 'consequence', source: 'd', direction: 'a→b' }] },
      connectives: { ...CONNECTIVES, consequence: { clause: [', so'] } },
    };
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
      [SPINE]: { role: 'spine', reads: [] },
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

  it('⛔ NO TURN CAN SEAT ON THE SHIPPED CORPUS, because no block carries `poolMeta`', () => {
    const withMeta = Object.entries(CORPUS).filter(([, block]) => block.poolMeta);
    expect(withMeta.map(([blockId]) => blockId), 'a shipped block carrying pool metadata')
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
      ...Array.from({ length: 10 }, (_, i) => [`s${i}`, { role: 'spine', reads: [] }]),
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
        ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`s${i}`, { role: 'spine', reads: [] }])),
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
      poolMeta: { [SPINE]: { role: 'spine', reads: [] }, echo: modifierMeta() },
    });
    const unit = composeFixture(corpus, { candidates: [{ key: 'echo' }] });
    expect(unit.text, 'the composer states it twice, and the gate is what refuses that')
      .toBe('The walls stand. The walls stand.');
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
