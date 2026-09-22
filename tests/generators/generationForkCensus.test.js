/**
 * generationForkCensus.test.js — EM-P2's CENSUS BY EXECUTION.
 *
 * The register at src/domain/generation/generationForkRegistry.js declares what generation's
 * 75 `(step, key)` pairs DO. This file measures the same things by RUNNING the pipeline and
 * holds the declaration equal to the measurement. On any difference the arm builds the fresh
 * literal as the exact source text of the declaration, PRINTS it, and FAILS — it writes no
 * file and takes no update flag (§6.7, STOP-10). A census that rewrites its own baseline
 * proves nothing.
 *
 * ⛔ THE FIRST ARM IS THE INSTRUMENT'S OWN CONTROL, AND IT IS A STOP — NOT A HOPE. Two module
 * mocks live here. If they do not reach the generator graph the census cannot lie loudly, it
 * lies QUIETLY: `total mints` reads 4 instead of 35 while every other control stays green,
 * which is exactly what the pre-proof's negative control produced. A1 therefore runs before a
 * line of literal is read, and if it reds the lane writes the STOP with the numbers it saw. It
 * does NOT touch vite.config.js, a setupFiles entry or any shared vitest configuration: the
 * shared-config fallback is a chair act, never a packet step (chair ruling, 2026-09-19).
 *
 * ⛔ THE FORK RE-IMPLEMENTATION IS THE LOAD-BEARING PART OF THE MINT MOCK, and the estate has
 * the lesson written down already at tests/property/advanceEpochDormancyFence.test.js:77-82:
 * "wrapping a function in its OWN module's namespace counts ZERO when the caller invokes it
 * intra-module, because the internal binding stays the original." `src/kernel/prng.js :: fork` IS
 * such a caller, so a naive wrapper is blind to 31 of 35 mints. The cure is exact rather than
 * approximate: `fork(label)` is DEFINED as `createPRNG` over a derived seed, so routing it
 * through the wrapper yields the same seed string and therefore the same stream, byte for
 * byte, and counts it. The equivalence is PINNED by A1's source assertion on prng.js :: fork — the
 * same pin pipelinePinnedMode.test.js A7 already carries — so if that line ever changes, A1
 * reds before the census can lie.
 *
 * ⭐ THE HASH MOCK NEEDS NO RE-IMPLEMENTATION, and the intra-module rule is why: `pickVariant`
 * has no intra-module caller, so its wrapper is total over its callers; `pickVariant` calls
 * `fnv1a32` intra-module (proseHash.js:52), so the `fnv1a32` wrapper counts only the module's
 * EXTERNAL callers. The two censuses are disjoint BY CONSTRUCTION, and nothing is double
 * counted. That is a property, not a convenience, and A6 asserts it.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

/**
 * THE RECORDERS. Module-scope consts declared ABOVE the `vi.mock` calls, because a factory
 * hoists above the imports but RUNS lazily; the modules under test are therefore reached by
 * `await import(...)` below, which is the shape every precedent in this tree uses.
 *
 * Each carries an `on` flag and both are OFF for the classification: 63 rows x 23 runs x ~31
 * mints is forty-five thousand records the classification does not read.
 */
const mintCensus = { rows: [], on: false, actualKeys: [] };
const hashCensus = { picks: [], hashes: [], on: false, actualKeys: [] };

vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
  const actual = await importOriginal();
  mintCensus.actualKeys = Object.keys(actual).sort();
  const mint = (seed, via) => {
    const inner = actual.createPRNG(seed);
    const record = { seed: String(seed), via, calls: 0, forkLabels: [] };
    if (mintCensus.on) mintCensus.rows.push(record);
    const out = {};
    for (const key of Object.keys(inner)) {
      const value = inner[key];
      if (typeof value !== 'function') { out[key] = value; continue; }
      if (key === 'fork') {
        // NOT `inner.fork(label)`. See THE FORK RE-IMPLEMENTATION in this file's header.
        out[key] = (label) => {
          record.forkLabels.push(String(label));
          return mint(`${seed}::${label}`, 'fork');
        };
        continue;
      }
      out[key] = (...args) => { record.calls += 1; return value(...args); };
    }
    return out;
  };
  return { ...actual, createPRNG: (seed) => mint(seed, 'direct') };
});

vi.mock('../../src/kernel/proseHash.js', async (importOriginal) => {
  const actual = await importOriginal();
  hashCensus.actualKeys = Object.keys(actual).sort();
  return {
    ...actual,
    pickVariant: (pool, seed) => {
      if (hashCensus.on) {
        hashCensus.picks.push({
          seed: seed === undefined ? ' undefined' : String(seed),
          poolLen: Array.isArray(pool) ? pool.length : -1,
        });
      }
      return actual.pickVariant(pool, seed);
    },
    fnv1a32: (str) => {
      if (hashCensus.on) hashCensus.hashes.push(String(str));
      return actual.fnv1a32(str);
    },
  };
});

const {
  censusCorpus, classify, emitTier1Literal, instrumentedRoot, runHeadless,
} = await import('../helpers/generationForkCensus.js');
const { goldenCorpus, keyOf } = await import('../helpers/goldenMasterCorpus.js');
const { expectAbsentWithAnchor } = await import('../helpers/anchoredNegatives.js');
const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
const { getStepMeta, getStepOrder } = await import('../../src/generators/pipeline.js');
const {
  GENERATION_CENSUS_ROWS, GENERATION_CHANNELS, GENERATION_TIER1, GENERATION_TIER2,
} = await import('../../src/domain/generation/generationForkRegistry.js');
const prngModule = await import('../../src/kernel/prng.js');
const proseHashModule = await import('../../src/kernel/proseHash.js');

const GOLDEN_MANIFEST_PATH = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');
const PRNG_SOURCE_PATH = resolve(process.cwd(), 'src', 'kernel', 'prng.js');
/** The manifest row A1 pins, and the hash it carries — both asserted, so neither drifts alone. */
const GOLDEN_CONTROL_KEY = 'town|germanic|plains|road|civilized|golden-master-v3';
const GOLDEN_CONTROL_HASH = 'b77b5909009112855bad4dacf881847d06e43385f64a15f4b528e0d30c91c3ce';
/** EM-P0's own pinned-mode row and its four chooser keys, re-measured here under the mocks. */
const PIN_ROW = {
  settType: 'town', culture: 'germanic', terrainOverride: 'riverside',
  tradeRouteAccess: 'river', monsterThreat: 'civilized', _seed: 'em-p0-pinned-mode',
};
const POPULATION_STEP = 'generatePopulation';
const CHOOSER_KEYS = ['npcs', 'relationships', 'factions', 'conflicts'];
const POPULATION_UNPINNED_DRAWS = 315;
/** The row both side channels are censused on (the pre-proof's probe row). */
const CENSUS_ROW = {
  settType: 'town', culture: 'germanic', terrainOverride: 'riverside',
  tradeRouteAccess: 'river', monsterThreat: 'civilized', _seed: 'golden-master-v3',
};
/** The seed the mint census sees minted FOUR times, and the vias that convict a blind wrapper. */
const REPEATED_SEED = `${CENSUS_ROW._seed}::generatePower::power-structure`;
const REPEATED_VIAS = ['fork', 'direct', 'direct', 'direct'];
const PICK_VARIANT_CALLS = 96;
const FNV_EXTERNAL_CALLS = 6;
/** The fork law A1 pins: the mint wrapper's equivalence rests on this line and nothing else. */
const FORK_LAW = 'fork: (label) => createPRNG(`${seed}::${label}`),';
/** §6.4's off-corpus block: a wizard-reachable switch, the keys it moves, and 24 seeds. */
const OFF_CORPUS_BASE = {
  settType: 'town', culture: 'germanic', terrainOverride: 'plains',
  tradeRouteAccess: 'road', monsterThreat: 'civilized',
};
const OFF_CORPUS_PROBES = [
  { label: "settType:'random'", patch: { settType: 'random' }, keys: ['tier', 'townPlus'] },
  { label: "culture:'random_culture'", patch: { culture: 'random_culture' }, keys: ['culture'] },
  { label: '_randomizePriorities:true', patch: { _randomizePriorities: true }, keys: ['magicLevel', 'priorityMagicEffective'] },
];
const OFF_CORPUS_SEEDS = Array.from({ length: 24 }, (_, index) => `offcorpus-${index}`);
const OFF_CORPUS_STEP = 'resolveConfig';
/**
 * ⛔ THE THREE DISPLAY-NAME-KEYED CHOICE SITES, NAMED HERE RATHER THAN IN THE REGISTER, and the
 * placement is a MEASUREMENT rather than a preference (lane EM-P2, 2026-09-20). Spelling these
 * three module paths under `src/` convicts the register under two standing estate walkers at
 * once: tests/lint/entropyRootCensus.walker.test.js counts a quoted stream-mint call as a site
 * even inside a string literal (35 -> 36 in src/domain), and
 * tests/lint/settlementMapSurfaceAllowlist.walker.test.js refuses settlement-map vocabulary
 * anywhere under `src/` (ODQ §725). Neither walker scans `tests/`, and these sites are OBSERVED
 * DATA either way, so they live beside the arm that observes them. They are EM-P1b's class and
 * this packet asserts nothing about their cure.
 */
const DISPLAY_NAME_KEYED_SITES = [
  { site: 'src/generators/steps/assembleInstitutions.js:774', channel: 'hash', marker: 'inst.name' },
  { site: 'src/data/npcData.js:1334', channel: 'hash', marker: '?.name' },
  { site: 'src/domain/townMap/glyphAssign.js:125', channel: 'mint', marker: 'createPRNG(`glyph:${seedId}`)' },
];

/** The golden master's own hash, spelled exactly as generatorGoldenMaster.test.js spells it. */
function hashFor(row) {
  const { _seed: seed, ...cfg } = row;
  const settlement = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(settlement)).digest('hex');
}

/** Run one row with both recorders ON, and hand back what they saw. */
function censusRun(row) {
  mintCensus.rows = []; mintCensus.on = true;
  hashCensus.picks = []; hashCensus.hashes = []; hashCensus.on = true;
  const instrumented = instrumentedRoot(row._seed);
  const context = runHeadless(row, instrumented.root);
  mintCensus.on = false; hashCensus.on = false;
  return {
    context, instrumented, mints: mintCensus.rows, picks: hashCensus.picks, hashes: hashCensus.hashes,
  };
}

/** Resolve a Tier-2 `a.b[].c` path against a record; [] means the path does not exist there. */
function resolveOutputKey(root, path) {
  let nodes = [root];
  for (const segment of path.split('.')) {
    const isArray = segment.endsWith('[]');
    const key = isArray ? segment.slice(0, -2) : segment;
    const next = [];
    for (const node of nodes) {
      if (node === null || node === undefined || typeof node !== 'object') continue;
      const value = node[key];
      if (value === undefined) continue;
      if (isArray) { if (Array.isArray(value)) next.push(...value); } else next.push(value);
    }
    nodes = next;
  }
  return nodes.filter((value) => value !== undefined);
}

describe('EM-P2 — generation census by execution: the instrument, the classification, both channels', () => {
  /** One classification serves A3e and A4; it is the expensive measurement in this file. */
  let measured = null;
  const measure = () => {
    if (measured === null) measured = classify();
    return measured;
  };
  /** The declared rows, keyed, so a comparison names the row rather than an index. */
  const declaredBy = new Map(GENERATION_TIER1.map((row) => [`${row.step}|${row.key}`, row]));
  /** THE MISMATCH ARM: it PRINTS the fresh literal and FAILS. It never writes (STOP-10). */
  const failOnDifference = (differences, fresh) => {
    expect(
      differences,
      `\nTHE REGISTER DISAGREES WITH A FRESH EXECUTION on ${differences.length} row(s):\n`
      + `${differences.join('\n')}\n\n`
      + 'PASTE THIS FRESH LITERAL into src/domain/generation/generationForkRegistry.js and\n'
      + 're-run. That green is the proof; this arm writes no file and takes no update flag.\n\n'
      + `${fresh}\n`,
    ).toEqual([]);
  };

  it('A1 — the instrument reaches the generator graph: mints split 4 direct / 31 via fork, no golden moves, 315 draws unpinned and 0 pinned', () => {
    // ── C0 — the mocks lose no export. A replacement that dropped a name would break
    // importers silently, and every figure below would be measured on a crippled module.
    expect(mintCensus.actualKeys.length, 'the prng mock factory never ran').toBeGreaterThan(0);
    expect(hashCensus.actualKeys.length, 'the proseHash mock factory never ran').toBeGreaterThan(0);
    expect(Object.keys(prngModule).sort(), 'prng.js export parity').toEqual(mintCensus.actualKeys);
    expect(Object.keys(proseHashModule).sort(), 'proseHash.js export parity').toEqual(hashCensus.actualKeys);

    // ── THE FORK LAW. The mint wrapper re-implements `fork` as the SAME derivation, so it
    // yields the same stream byte for byte. If this line changes the equivalence is gone.
    expect(readFileSync(PRNG_SOURCE_PATH, 'utf8'), 'STOP-4: prng.js :: fork is the fork law').toContain(FORK_LAW);

    // ── C1 — the golden control: the instrument changes no generated byte.
    const manifest = JSON.parse(readFileSync(GOLDEN_MANIFEST_PATH, 'utf-8'));
    const rows = goldenCorpus();
    const control = rows.find((row) => keyOf(row) === GOLDEN_CONTROL_KEY);
    expect(control, `the golden control row ${GOLDEN_CONTROL_KEY} left the corpus`).toBeDefined();
    expect(manifest[GOLDEN_CONTROL_KEY], 'the manifest row moved').toBe(GOLDEN_CONTROL_HASH);
    expect(hashFor(control), 'the control row regenerated under both mocks').toBe(GOLDEN_CONTROL_HASH);
    const moved = [];
    let checked = 0;
    for (let index = 0; index < rows.length; index += 21) {
      checked += 1;
      if (manifest[keyOf(rows[index])] !== hashFor(rows[index])) moved.push(keyOf(rows[index]));
    }
    expect(checked, 'the stride sweep is not vacuous').toBeGreaterThanOrEqual(25);
    expect(moved, 'STOP-3: golden rows moved under the instrument').toEqual([]);

    // ── C2 — the pin control (EM-P0 A3, re-measured under the instrument).
    const unpinned = instrumentedRoot(PIN_ROW._seed);
    const unpinnedContext = runHeadless(PIN_ROW, unpinned.root);
    const unpinnedPopulation = unpinned.perStep.get(POPULATION_STEP);
    expect(unpinnedPopulation, 'the runner never forked the population step').toBeDefined();
    expect(unpinnedPopulation.draws, 'unpinned population draws').toBe(POPULATION_UNPINNED_DRAWS);
    expect(unpinnedPopulation.random, 'every unpinned draw is a random() call').toBe(POPULATION_UNPINNED_DRAWS);
    expect(unpinnedPopulation.other, 'no non-random method on the population stream').toBe(0);
    expect(unpinnedPopulation.forkLabels, 'nothing inside the step mints a second stream').toEqual([]);

    const pins = Object.fromEntries(CHOOSER_KEYS.map((key) => [key, unpinnedContext[key]]));
    for (const key of CHOOSER_KEYS) expect(pins[key], `pin ${key}`).toBeDefined();
    const pinned = instrumentedRoot(PIN_ROW._seed);
    const pinnedContext = runHeadless(PIN_ROW, pinned.root, { pins });
    expect(pinned.perStep.get(POPULATION_STEP).draws, 'a fully pinned step draws nothing').toBe(0);
    expect(JSON.stringify(pinnedContext.settlement), 'the pinned run reproduces the record')
      .toBe(JSON.stringify(unpinnedContext.settlement));

    // ── C3 — THE MINT CENSUS. A total of 4 is the signature of a mock that never reached the
    // generator graph: it is exactly what the pre-proof's negative control produced while every
    // control above stayed green. That is the whole reason this arm exists.
    const seen = censusRun(CENSUS_ROW);
    const direct = seen.mints.filter((record) => record.via === 'direct');
    const viaFork = seen.mints.filter((record) => record.via === 'fork');
    const foreign = seen.mints.filter((record) => !record.seed.startsWith(CENSUS_ROW._seed));
    process.stdout.write(`\n[A1] mints total=${seen.mints.length} direct=${direct.length}`
      + ` viaFork=${viaFork.length} foreign=${foreign.length}`
      + ` pickVariant=${seen.picks.length} fnv1a32External=${seen.hashes.length}\n`
      + `[A1] direct seeds = ${direct.map((record) => record.seed).join(' | ')}\n`);
    expect(seen.context.settlement, 'the census run produced no settlement').toBeDefined();
    expect(direct.length, 'STOP-6: DIRECT mints — a 4 here with a total of 4 is the blind wrapper').toBe(4);
    expect(seen.mints.length, 'STOP-5: total mints below 35 means the mock never reached the graph')
      .toBeGreaterThanOrEqual(35);
    expect(seen.mints.length, 'total mints is row-dependent but bounded').toBeLessThanOrEqual(36);
    expect(viaFork.length, 'STOP-6: mints via the re-implemented fork').toBeGreaterThanOrEqual(31);
    expect(foreign.map((record) => record.seed), 'every minted seed is root-prefixed').toEqual([]);
  }, 120_000);

  it('A3e — the classification re-executed: the declared corpus is 63 rows, 13 steps draw, and every stepDraws and keyMoves reproduces', () => {
    const corpus = censusCorpus();
    const grid = [];
    const pairsSeen = new Set();
    for (const row of corpus) {
      const key = `${row.settType}|${row.terrainOverride}`;
      if (pairsSeen.has(key)) break;
      pairsSeen.add(key);
      grid.push(row);
    }
    expect(corpus.length, 'the declared census corpus size').toBe(GENERATION_CENSUS_ROWS);
    expect(corpus.length, 'the corpus is 42 grid rows plus the 21-row tail').toBe(63);
    expect(grid.length, 'the grid half is every (settType, terrain) pair once').toBe(42);
    expect(corpus.length - grid.length, 'the tail is not optional (the rare drawn rows live there)').toBe(21);
    expect(new Set(corpus.map(keyOf)).size, 'the corpus holds no duplicate row').toBe(corpus.length);

    const fresh = measure();
    expect(fresh.corpusRows, 'the classifier measured the declared corpus').toBe(GENERATION_CENSUS_ROWS);
    expect(fresh.rows.length, 'the measured pair set is the registry"s, not a literal').toBe(GENERATION_TIER1.length);
    expect(fresh.rows.length, 'anti-vacuity: the pair set is real before any equality is claimed').toBeGreaterThan(70);
    expect(fresh.steps.length, 'every registered step was perturbed').toBe(getStepOrder().length);
    expect(fresh.drawingSteps.length, 'steps that draw at all').toBe(13);
    process.stdout.write(`\n[A3e] corpus=${fresh.corpusRows} pairs=${fresh.rows.length}`
      + ` wall=${fresh.wallMs}ms drawingSteps=${fresh.drawingSteps.length}\n`);

    const differences = [];
    for (const row of fresh.rows) {
      const id = `${row.step}|${row.key}`;
      const declared = declaredBy.get(id);
      if (!declared) { differences.push(`${id}: measured but not declared`); continue; }
      for (const field of ['via', 'stepDraws', 'keyMoves', 'rows', 'class']) {
        if (declared[field] !== row[field]) {
          differences.push(`${id}.${field}: declared ${JSON.stringify(declared[field])} measured ${JSON.stringify(row[field])}`);
        }
      }
    }
    for (const declared of GENERATION_TIER1) {
      const id = `${declared.step}|${declared.key}`;
      if (!fresh.rows.some((row) => `${row.step}|${row.key}` === id)) differences.push(`${id}: declared but not measured`);
    }
    failOnDifference(differences, emitTier1Literal(fresh.rows));
  }, 180_000);

  it('A4 — both landing triples re-executed: the six varies rows, the eighteen disagreements, and zero differing landing paths', () => {
    const fresh = measure();
    const differences = [];
    for (const row of fresh.rows) {
      const id = `${row.step}|${row.key}`;
      const declared = declaredBy.get(id);
      if (!declared) { differences.push(`${id}: measured but not declared`); continue; }
      for (const triple of ['onRecord', 'producedOnRecord']) {
        for (const bucket of ['absent', 'same', 'transformed']) {
          if (declared[triple][bucket] !== row[triple][bucket]) {
            differences.push(`${id}.${triple}.${bucket}: declared ${declared[triple][bucket]} measured ${row[triple][bucket]}`);
          }
        }
      }
      for (const field of ['onRecordClass', 'producedOnRecordClass', 'recordPath']) {
        if (declared[field] !== row[field]) {
          differences.push(`${id}.${field}: declared ${JSON.stringify(declared[field])} measured ${JSON.stringify(row[field])}`);
        }
      }
      // §6.2's TRIPWIRE: a row that lands in two different places while reading unanimously
      // would be a register telling a caller a single truth it does not have.
      if (!row.recordPathUnanimous && row.onRecordClass !== 'varies') {
        differences.push(`${id}: non-unanimous recordPath ${JSON.stringify(row.recordPathCounts)} on a '${row.onRecordClass}' row (STOP-11)`);
      }
    }
    const variesRows = fresh.rows.filter((row) => row.onRecordClass === 'varies').map((row) => `${row.step}|${row.key}`);
    const disagreeing = fresh.rows.filter((row) => row.onRecordClass !== row.producedOnRecordClass)
      .map((row) => `${row.step}|${row.key}`);
    const nonUnanimous = fresh.rows.filter((row) => !row.recordPathUnanimous).map((row) => `${row.step}|${row.key}`);
    process.stdout.write(`\n[A4] varies=${variesRows.length} disagreeing=${disagreeing.length}`
      + ` nonUnanimousPaths=${nonUnanimous.length} differingLandingPaths=${fresh.pathDiffRows.length}\n`
      + `[A4] varies rows: ${variesRows.join(', ')}\n`);

    failOnDifference(differences, emitTier1Literal(fresh.rows));
    expect(variesRows.length, 'the varies rows of the FINAL comparand').toBe(6);
    expect(disagreeing.length, 'the rows where the two comparands disagree').toBe(18);
    expect(nonUnanimous.length, 'exactly one row lands in two places, and it is already varies').toBe(1);
    // ⛔ THERE IS NO producedPath, AND THAT IS A MEASUREMENT. If this ever becomes non-zero a
    // second path field is owed and the register is telling half a truth about WHERE.
    expect(
      fresh.pathDiffRows.map((entry) => `${entry.id} ${entry.count}/${fresh.corpusRows} ${entry.example}`),
      'a post-step value landed at a different path than the final one: a producedPath is owed',
    ).toEqual([]);
    // The derived labels really are derived: each triple sums to the denominator on every row.
    for (const row of fresh.rows) {
      const id = `${row.step}|${row.key}`;
      expect(row.onRecord.absent + row.onRecord.same + row.onRecord.transformed, `${id} onRecord sums to rows`).toBe(row.rows);
      expect(row.producedOnRecord.absent + row.producedOnRecord.same + row.producedOnRecord.transformed, `${id} producedOnRecord sums to rows`).toBe(row.rows);
    }
  }, 120_000);

  it('A5 — the mint channel: four DIRECT mints, every seed root-prefixed, and one seed minted four times with a fork-first via list', () => {
    const seen = censusRun(CENSUS_ROW);
    const direct = seen.mints.filter((record) => record.via === 'direct');
    const viaFork = seen.mints.filter((record) => record.via === 'fork');
    const bySeed = new Map();
    for (const record of seen.mints) bySeed.set(record.seed, [...(bySeed.get(record.seed) || []), record.via]);
    const repeated = [...bySeed.entries()].filter(([, vias]) => vias.length > 1);
    let subForks = 0;
    for (const step of getStepOrder()) subForks += (seen.instrumented.perStep.get(step)?.forkLabels.length || 0);
    process.stdout.write(`\n[A5] total=${seen.mints.length} direct=${direct.length} viaFork=${viaFork.length}`
      + ` stepForks=${getStepOrder().length} subForks=${subForks}`
      + ` repeatedSeeds=${repeated.map(([seed, vias]) => `${seed} x${vias.length} [${vias.join('|')}]`).join(' ; ')}\n`);

    expect(direct.length, 'STOP-6: the DIRECT count is the assertion').toBe(GENERATION_CHANNELS.mints.direct);
    expect(GENERATION_CHANNELS.mints.instrument, 'the register names the mint door').toBe('src/kernel/prng.js#createPRNG');
    expect(GENERATION_CHANNELS.mints.rootSeedPrefixed, 'the register claims root-prefixed seeds').toBe(true);
    expect(seen.mints.filter((record) => !record.seed.startsWith(CENSUS_ROW._seed)).map((record) => record.seed),
      'a foreign-prefix seed would be a stream this census cannot attribute').toEqual([]);
    expect(viaFork.length, 'every fork the proxy saw is a mint the census saw')
      .toBe(getStepOrder().length + subForks);
    expect(seen.mints.length, 'total mints is row-dependent and is recorded, not pinned').toBeGreaterThanOrEqual(35);
    // ⭐ THE SHARPEST DISCRIMINATOR. Under a naive wrapper this seed is minted x3 with vias
    // [direct|direct|direct]; the fork-minted member of the quartet is exactly what the
    // re-implementation buys, so the via list alone convicts a mock that did not take.
    expect(bySeed.get(REPEATED_SEED), `${REPEATED_SEED} vias`).toEqual(REPEATED_VIAS);
    expect(repeated.map(([seed]) => seed), 'exactly one seed is minted more than once').toEqual([REPEATED_SEED]);
  }, 120_000);

  it('A6 — the hash channel: 96 distinct pickVariant seeds, six external fnv1a32 calls, and two censuses disjoint by construction', () => {
    const seen = censusRun(CENSUS_ROW);
    const realChoices = seen.picks.filter((pick) => pick.poolLen > 1 && pick.seed && pick.seed !== ' undefined');
    const pickSeeds = new Set(seen.picks.map((pick) => pick.seed));
    process.stdout.write(`\n[A6] pickVariant=${seen.picks.length} realChoices=${realChoices.length}`
      + ` distinctSeeds=${pickSeeds.size} fnv1a32External=${seen.hashes.length}\n`);

    expect(seen.picks.length, 'pickVariant calls on the probe row').toBe(PICK_VARIANT_CALLS);
    expect(realChoices.length, 'every call is a real choice: pool > 1 and a non-falsy seed').toBe(PICK_VARIANT_CALLS);
    expect(pickSeeds.size, 'every choice carries its own seed string').toBe(PICK_VARIANT_CALLS);
    expect(seen.picks.filter((pick) => pick.poolLen <= 1), 'a pool of one is not a choice').toEqual([]);
    expect(seen.hashes.length, 'fnv1a32 EXTERNAL callers').toBe(FNV_EXTERNAL_CALLS);
    expect(GENERATION_CHANNELS.hash.fnv1a32External, 'the register declares the external count').toBe(FNV_EXTERNAL_CALLS);
    expect(GENERATION_CHANNELS.hash.instrument, 'the register names the hash door').toBe('src/kernel/proseHash.js#pickVariant');
    // DISJOINT BY CONSTRUCTION: pickVariant calls fnv1a32 intra-module, so the fnv1a32 wrapper
    // counts only EXTERNAL callers and no choice is ever double-counted as a raw hash site.
    const hashStrings = new Set(seen.hashes);
    expect([...pickSeeds].filter((seed) => hashStrings.has(seed)),
      'a pickVariant seed reached the fnv1a32 wrapper: the two censuses overlap').toEqual([]);

    // The three DISPLAY-NAME-KEYED sites, named as observed data. EM-P1b owns their cure; this
    // packet asserts nothing about it, only that the register still names where they are.
    expect(DISPLAY_NAME_KEYED_SITES.length, 'the observed name-keyed sites').toBe(3);
    for (const site of DISPLAY_NAME_KEYED_SITES) {
      const [rel, lineNumber] = site.site.split(':');
      const line = readFileSync(resolve(process.cwd(), rel), 'utf8').split('\n')[Number(lineNumber) - 1];
      expect(line, `${site.site} is past the end of its file: re-measure the observed site`).toBeDefined();
      expect(line, `${site.site} no longer carries ${site.marker}: re-measure the observed site`).toContain(site.marker);
      expect(['hash', 'mint'], `${site.site} channel`).toContain(site.channel);
    }
  }, 120_000);

  it('A7 — the corpus ceiling: each key the register calls pure moves under at least one wizard-reachable config', () => {
    const meta = new Map(getStepMeta().map((entry) => [entry.name, entry]));
    const configKeys = new Set([...meta.get(OFF_CORPUS_STEP).provides, ...meta.get(OFF_CORPUS_STEP).mutates]);
    const digest = (value) => createHash('sha1').update(JSON.stringify(value) ?? ' undefined').digest('hex').slice(0, 16);
    const snapshot = (row, perturbStep) => {
      let bag = null;
      runHeadless(row, instrumentedRoot(row._seed, { perturbStep }).root, {
        onStep: (step, ctx) => {
          if (step !== OFF_CORPUS_STEP) return;
          bag = {};
          for (const key of configKeys) bag[key] = key in ctx ? digest(ctx[key]) : ' ABSENT';
        },
      });
      return bag;
    };

    const tooWeak = [];
    const neverRan = [];
    for (const probe of OFF_CORPUS_PROBES) {
      const tally = new Map();
      // ⛔ NO ASSERTION INSIDE THE SEED LOOP. A seed loop that asserts inline stops at the FIRST
      // failing seed, so its failure count is a lower bound and every later seed goes unrun
      // (tests/lint/seedLoopTotality.walker.test.js). Every seed runs here; the collections are
      // judged once, below, so the failure message carries the true count rather than a floor.
      for (const seed of OFF_CORPUS_SEEDS) {
        const row = { ...OFF_CORPUS_BASE, ...probe.patch, _seed: seed };
        const base = snapshot(row, null);
        const perturbed = snapshot(row, OFF_CORPUS_STEP);
        if (base === null || perturbed === null) { neverRan.push(`${probe.label}/${seed}`); continue; }
        for (const key of Object.keys(base)) if (base[key] !== perturbed[key]) tally.set(key, (tally.get(key) || 0) + 1);
      }
      process.stdout.write(`\n[A7] ${probe.label} moved = `
        + `${[...tally.entries()].sort((a, b) => b[1] - a[1]).map(([key, n]) => `${key}:${n}/${OFF_CORPUS_SEEDS.length}`).join(' , ')}\n`);
      for (const key of probe.keys) {
        // ⛔ `> 0`, NEVER A RATIO. The ratios are a property of the seed SET, not of the tree:
        // the compile lane's seeds moved townPlus 13/24 where the recon's moved it 11/24. A
        // ratio assertion would be a flake with a number on it.
        const seen = tally.get(key) || 0;
        const declared = GENERATION_TIER1.find((r) => r.step === OFF_CORPUS_STEP && r.key === key);
        expect(declared, `${key} is not a declared resolveConfig row`).toBeDefined();
        expect(declared.class, `${key} is classed by the register over the corpus`).toBe('pure');
        if (seen === 0) tooWeak.push(`${probe.label}: ${key} moved in 0 of ${OFF_CORPUS_SEEDS.length} seeds`);
      }
    }
    expect(
      neverRan,
      'resolveConfig never ran for these probe seeds, so their tallies measured nothing',
    ).toEqual([]);
    expect(
      tooWeak,
      'a key the register calls pure did not move under ANY of its 24 off-corpus seeds, so the'
      + ' corpus-ceiling blind half no longer describes the tree',
    ).toEqual([]);
  }, 120_000);

  it('A8e — Tier 2 executed: every outputKey resolves on a generated record and every origin equals its holding-step perturbation', () => {
    const corpus = censusCorpus();
    const grid = [];
    const pairsSeen = new Set();
    for (const row of corpus) {
      const key = `${row.settType}|${row.terrainOverride}`;
      if (pairsSeen.has(key)) break;
      pairsSeen.add(key);
      grid.push(row);
    }
    expect(grid.length, 'the Tier-2 corpus is every tier x terrain once').toBe(42);
    expect(GENERATION_TIER2.length, 'the declared Tier-2 rows').toBe(10);

    const holders = [...new Set(GENERATION_TIER2.map((row) => row.step))];
    const occupancy = new Map(GENERATION_TIER2.map((row) => [row.outputKey, 0]));
    const movedUnderHolder = new Map(GENERATION_TIER2.map((row) => [row.outputKey, 0]));
    /** The two paths EM-A1 asked about that get NO row, measured rather than asserted away. */
    const ABSENT_PROBES = ['institutions[].state', 'powerStructure.seats[].holder'];
    const absentOccupancy = new Map(ABSENT_PROBES.map((path) => [path, 0]));
    let resolvingPaths = null;

    for (const row of grid) {
      const base = runHeadless(row, instrumentedRoot(row._seed).root).settlement;
      for (const declared of GENERATION_TIER2) {
        if (resolveOutputKey(base, declared.outputKey).length) {
          occupancy.set(declared.outputKey, occupancy.get(declared.outputKey) + 1);
        }
      }
      for (const path of ABSENT_PROBES) {
        if (resolveOutputKey(base, path).length) absentOccupancy.set(path, absentOccupancy.get(path) + 1);
      }
      if (resolvingPaths === null) {
        resolvingPaths = [...GENERATION_TIER2.map((declared) => declared.outputKey), ...ABSENT_PROBES]
          .filter((path) => resolveOutputKey(base, path).length > 0);
      }
      for (const holder of holders) {
        const perturbed = runHeadless(row, instrumentedRoot(row._seed, { perturbStep: holder }).root).settlement;
        for (const declared of GENERATION_TIER2) {
          if (declared.step !== holder) continue;
          const before = JSON.stringify(resolveOutputKey(base, declared.outputKey));
          const after = JSON.stringify(resolveOutputKey(perturbed, declared.outputKey));
          if (before !== after) movedUnderHolder.set(declared.outputKey, movedUnderHolder.get(declared.outputKey) + 1);
        }
      }
    }
    process.stdout.write(`\n[A8e] occupancy = ${GENERATION_TIER2.map((row) => `${row.outputKey}:${occupancy.get(row.outputKey)}/${grid.length}`).join(' , ')}\n`
      + `[A8e] movedUnderHolder = ${GENERATION_TIER2.map((row) => `${row.outputKey}:${movedUnderHolder.get(row.outputKey)}/${grid.length}`).join(' , ')}\n`
      + `[A8e] absent probes = ${ABSENT_PROBES.map((path) => `${path}:${absentOccupancy.get(path)}/${grid.length}`).join(' , ')}\n`);

    // ── ARM A: occupancy > 0. Row 5 (npcs[].status) sits at 18/42 — the structural-seat family
    // EM-A1 §1c.2 names — so the floor is `> 0`, not `=== 42`.
    const empty = GENERATION_TIER2.filter((row) => occupancy.get(row.outputKey) === 0).map((row) => row.outputKey);
    expect(empty, 'STOP-8: a Tier-2 outputKey does not resolve on a generated record').toEqual([]);
    // ── ARM C: origin EQUALS the measurement, in both directions.
    const wrongOrigin = GENERATION_TIER2
      .filter((row) => row.origin !== (movedUnderHolder.get(row.outputKey) > 0 ? 'drawn' : 'computed'))
      .map((row) => `${row.outputKey}: declared ${row.origin}, moved ${movedUnderHolder.get(row.outputKey)}/${grid.length}`);
    expect(wrongOrigin, 'a declared origin disagrees with its holding-step perturbation').toEqual([]);
    expect(GENERATION_TIER2.filter((row) => row.origin === 'computed').length,
      'the power structure consumes zero draws, and all ten rows stay editable anyway').toBe(5);

    // ── THE ANCHORED NEGATIVE. `powerStructure.seats[].holder` is the path the version-2 design
    // joined on and it exists NOWHERE; `powerStructure.governingName` is the real seat and
    // travels the same generatePower code path, so the exclusion cannot go vacuous.
    expect(absentOccupancy.get('powerStructure.seats[].holder'), 'the version-2 seat path resolves nowhere').toBe(0);
    expect(absentOccupancy.get('institutions[].state'), 'institutions[].state does not exist at generation').toBe(0);
    expectAbsentWithAnchor(
      resolvingPaths, 'powerStructure.seats[].holder', 'powerStructure.governingName',
      'A8e: the real seat is governingName, not seats[].holder',
    );
  }, 120_000);
});
