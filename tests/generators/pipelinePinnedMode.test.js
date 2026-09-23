/**
 * pipelinePinnedMode.test.js — TWO BATTERIES IN TWO TOP-LEVEL SUITES: EM-P0's acceptance
 * battery (A1–A7) and EM-B2a2's (A1–A4). EM-P0's seven arms are byte-unmoved.
 *
 * THE PIPELINE SEAM. `runPipeline(initialContext, rng, { pins })` hands the pins to every
 * step through the context under the reserved key `__pins`; inside a step every registered
 * chooser consults them, and A PINNED CHOOSER DOES NOT DRAW. `generatePopulation` keeps ONE
 * registration and ONE stream object, with its root/derive seam moved INSIDE the file.
 *
 * ⛔ WHY THIS IS A BATTERY AND NOT A PARAGRAPH. Version 1 of this packet split the step into
 * TWO registered steps and argued from the deriving half's arguments that the goldens could
 * not move. Executed, that design moved 41 of 41 sampled golden rows: `fork(label)` is
 * `createPRNG` over a derived seed — a fresh stream at position 0, never a continuation — so
 * two registrations can never share one stream position. A1 is the arm that catches that
 * whole class, and it reads the committed fixture as its authority.
 *
 * ⚠ THE SCOPE OF A1 HERE. The 525-row TOTALITY is `tests/property/generatorGoldenMaster.test.js`
 * run PLAIN; that suite is the standing proof and EM-P0 runs it unchanged before and after.
 * This file samples the same corpus by a fixed stride — the same 41 rows version 1's refutation
 * was measured over — so the null change is carried by the acceptance battery at a cost the
 * battery can afford.
 *
 * ⛔ NO `clearSteps()` ANYWHERE IN THIS FILE. It drives the REAL registry, so clearing it would
 * unregister the step under test. (Contrast `pipelineStrictMode.test.js`, which owns a private
 * registry of fake steps and deliberately never imports the real entry point.)
 *
 * ⭐ THE SECOND BATTERY (EM-B2a2). `chooseOrPin` — the four effective lines that return an
 * own-present pin WITHOUT calling the draw thunk — was lifted VERBATIM out of
 * `generatePopulation.js` into `pipeline.js`, the runner that owns `_PINS_KEY`, so that every
 * writer the re-entry family will teach consults a pin through ONE spelling in ONE exported
 * home. That battery drives the primitive at its new home, re-measures the null change, and
 * proves the pin is still LIVE with an overridden value (§9a: a same-seed re-derive
 * reproduces the record whether or not the pin is consulted, so only a draw count and an
 * override discriminate).
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { chooseOrPin, getStepMeta, getStepOrder, runPipeline } from '../../src/generators/pipeline.js';
import { generateRelationships } from '../../src/generators/npcGenerator.js';
import { generateConflicts, generateFactions } from '../../src/generators/powerGenerator.js';
import { resolveConfigWithUserContentTunables } from '../../src/domain/content/userContentTunables.js';
import { pinsFrom, rederive } from '../../src/domain/edit/dmLayer.js';
import { declarationsFor, isEditableCard } from '../../src/domain/edit/fieldDeclarations.js';
import { withCustomContent } from '../../src/lib/dependencyEngine.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { censusCorpus, runHeadless as runCorpusRow } from '../helpers/generationForkCensus.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

const GOLDEN_MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');
const POPULATION_STEP = 'generatePopulation';
/** The record paths `generatePopulation`'s four choosers write. Pins are keyed by these. */
const CHOOSER_KEYS = ['npcs', 'relationships', 'factions', 'conflicts'];
const SEED = 'em-p0-pinned-mode';
const CONFIG = {
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'riverside',
  tradeRouteAccess: 'river',
  monsterThreat: 'civilized',
};
/** The derive half's measured draw budget: generateRelationships 62 + factions 2 + conflicts 3. */
const DERIVE_HALF_DRAWS = 67;
/** The seed §0R.1's derive-half probe was measured on, and the settlement it measured over. */
const DERIVE_PROBE_STREAM = 'em-p0-probe-derive';
const DERIVE_PROBE_SEED = 'em-p0-probe';

/** The golden master's own hash, spelled exactly as `generatorGoldenMaster.test.js` spells it. */
function hashFor(config) {
  const { _seed, ...cfg } = config;
  const settlement = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(settlement)).digest('hex');
}

/** The initial context `generateSettlementPipeline` builds, so a direct runner call is honest. */
function initialContextFor(seed) {
  return {
    config: resolveConfigWithUserContentTunables({ ...CONFIG }, {}),
    importedNeighbour: null,
    _seed: seed,
    _traceClock: 0,
  };
}

/** Run the REAL registered pipeline headlessly, with an optional pins bag. */
function runHeadless(rng, options = {}) {
  return withCustomContent({}, () => runPipeline(initialContextFor(SEED), rng, options));
}

/**
 * A counting proxy over ONE stream object. Every method call is recorded; `fork` is recorded
 * separately, because a fork taken inside the step would be a SECOND stream and is exactly
 * what version 1's design did wrong.
 */
function countingStream(base, record) {
  const proxy = {};
  for (const key of Object.keys(base)) {
    const value = base[key];
    if (typeof value !== 'function') {
      proxy[key] = value;
    } else if (key === 'fork') {
      proxy[key] = (label) => { record.innerForks += 1; return value(label); };
    } else {
      proxy[key] = (...args) => { record.draws += 1; return value(...args); };
    }
  }
  return proxy;
}

/**
 * A root PRNG whose per-step forks are observable and whose `generatePopulation` fork is the
 * counting proxy above. The runner draws nothing on the root itself — it only forks.
 */
function instrumentedRoot(seed) {
  const base = createPRNG(seed);
  const record = { forkLabels: [], draws: 0, innerForks: 0, streams: [] };
  const root = {
    ...base,
    fork: (label) => {
      record.forkLabels.push(label);
      const child = base.fork(label);
      if (label !== POPULATION_STEP) return child;
      const proxy = countingStream(child, record);
      record.streams.push(proxy);
      return proxy;
    },
  };
  return { root, record };
}

/**
 * Count the RAW draws an ambient body takes. Every `rngContext` helper funnels through
 * `_activeRng.random()`, so counting that one method is the exact raw-draw count.
 *
 * ⚠ THE STREAM'S LABEL IS PART OF THE MEASUREMENT, not decoration. The deriving choosers
 * BRANCH on their draws, so a different label yields a different draw count for the same
 * roster (measured: relabelling this stream moved generateRelationships from 62 to 70). The
 * label below is the one §0R.1's figure was measured on, so this arm re-measures THAT figure.
 */
function withAmbientCounter(body) {
  const base = createPRNG(DERIVE_PROBE_STREAM);
  const counter = { calls: 0 };
  const stream = { ...base, random: () => { counter.calls += 1; return base.random(); } };
  const previous = setActiveRng(stream);
  try {
    return body(counter);
  } finally {
    clearActiveRng(previous);
  }
}

/** Every chooser of `generatePopulation`, pinned from a run's own record. */
function pinsFromContext(ctx) {
  return {
    npcs: ctx.npcs,
    relationships: ctx.relationships,
    factions: ctx.factions,
    conflicts: ctx.conflicts,
  };
}

describe('EM-P0 — the pipeline seam: pins are consulted per chooser, on one stream', () => {
  it('A1 — the null change: no pins and pins {} leave the golden corpus byte-identical', () => {
    const rows = goldenCorpus();
    const manifest = JSON.parse(readFileSync(GOLDEN_MANIFEST, 'utf-8'));
    const stride = Math.max(1, Math.floor(rows.length / 40));
    const moved = [];
    let checked = 0;
    for (let index = 0; index < rows.length; index += stride) {
      const row = rows[index];
      checked += 1;
      if (manifest[keyOf(row)] !== hashFor(row)) moved.push(keyOf(row));
    }
    expect(checked).toBeGreaterThanOrEqual(40);
    expect(moved, 'golden rows moved — version 1 of this packet moved 41 of 41 here').toEqual([]);

    // `pins: {}` is asserted at the RUNNER: no production caller passes pins until EM-B2a,
    // so `generateSettlementPipeline` has no pins parameter to exercise.
    const plain = runHeadless(createPRNG(SEED));
    const empty = runHeadless(createPRNG(SEED), { pins: {} });
    expect(Object.keys(empty)).toEqual(Object.keys(plain));
    expect(JSON.stringify(empty.settlement)).toBe(JSON.stringify(plain.settlement));
  }, 180_000);

  it('A2 — the pin reproduces the record: a record-built bag rebuilds the settlement through rederive', () => {
    const first = runHeadless(createPRNG(SEED));
    // ⭐ THE BAG IS BUILT FROM THE RECORD, THROUGH THE PRODUCT'S OWN CHANNEL (EM-R2 §0.S,
    // judgment 204b). The key `npcs` names TWO facts: ctx's PRE-enrichment roster and the
    // record's post-coherence roster. `dmLayer :: pinsFrom` structuredClones `source[key]` out
    // of the RECORD, and `rederive` is the only caller a DM edit reaches — so the record's is
    // the fact the gate is defined on, and a ctx-built bag would assert a claim the product
    // never makes. The root override re-states the record's own value, so the bag is the
    // record's own roster and nothing else.
    const record = first.settlement;
    const engine = { run: generateSettlementPipeline, getStepMeta };
    const declarations = { declarationsFor, isEditableCard };
    const npc0 = (record.npcs || [])[0] || {};
    const layer = {
      roots: { [`npc:${npc0.id}:status`]: npc0.status }, worldFacts: {}, minted: {}, phantoms: {},
    };
    const { pins } = pinsFrom(record, layer, declarations, engine);
    for (const key of CHOOSER_KEYS) expect(pins[key]).toBeDefined();

    const second = rederive(record, { ...CONFIG }, layer, engine, declarations);
    expect(JSON.stringify(second.record)).toBe(JSON.stringify(record));
  }, 120_000);

  it('A3 — a pinned chooser does not draw: 67 derive-half draws unpinned, zero fully pinned', () => {
    const unpinned = instrumentedRoot(SEED);
    const unpinnedCtx = runHeadless(unpinned.root);
    expect(unpinned.record.draws).toBeGreaterThan(DERIVE_HALF_DRAWS);

    const pinned = instrumentedRoot(SEED);
    runHeadless(pinned.root, { pins: pinsFromContext(unpinnedCtx) });
    expect(pinned.record.draws, 'a fully pinned step draws nothing on its own stream').toBe(0);

    // The derive half's own budget, re-measured exactly the way §0R.1 measured it — same
    // probe settlement, same seed — because that is the figure the packet predicts. An
    // argument is not a proof of purity: these three run from a GIVEN roster and still draw.
    const probeSettlement = generateSettlementPipeline({}, null, {
      seed: DERIVE_PROBE_SEED, customContent: {},
    });
    const budget = withAmbientCounter((counter) => {
      const start = counter.calls;
      const relationships = generateRelationships(
        probeSettlement.npcs, probeSettlement.config || {}, probeSettlement.institutions || [],
      );
      const afterRelationships = counter.calls;
      const factions = generateFactions(probeSettlement.npcs, relationships);
      const afterFactions = counter.calls;
      generateConflicts(
        factions, relationships, probeSettlement.config || {}, probeSettlement.institutions || [],
      );
      return {
        relationships: afterRelationships - start,
        factions: afterFactions - afterRelationships,
        conflicts: counter.calls - afterFactions,
        total: counter.calls - start,
      };
    });
    expect(budget.relationships).toBe(62);
    expect(budget.factions).toBe(2);
    expect(budget.conflicts).toBe(3);
    expect(budget.total).toBe(DERIVE_HALF_DRAWS);
  }, 180_000);

  it('A4 — the partial pin refuses: some-but-not-all choosers throws, or reports under strict', () => {
    const complete = runHeadless(createPRNG(SEED));
    const partial = { relationships: complete.relationships };

    expect(() => runHeadless(createPRNG(SEED), { pins: partial })).toThrow(
      `Pipeline pins: step "${POPULATION_STEP}" has choosers [${CHOOSER_KEYS.join(', ')}] `
      + 'but pins supply only [relationships]. Pin every chooser of a step or none of them.',
    );

    const violations = [];
    runHeadless(createPRNG(SEED), {
      pins: partial,
      onStrictViolation: (violation) => violations.push(violation),
    });
    expect(violations).toContainEqual({
      step: POPULATION_STEP,
      kind: 'pin',
      keys: ['npcs', 'factions', 'conflicts'],
    });
  }, 120_000);

  it('A5 — one stream, one step: no second registration and no second stream object', () => {
    const order = getStepOrder();
    expect(order.filter((name) => name === POPULATION_STEP)).toEqual([POPULATION_STEP]);
    // THE ANCHOR IS THE ONE REGISTRATION: `generatePopulation` sits in the same live registry
    // order the two retired half-step names would sit in, so it travels the same code path and
    // the exclusion cannot go vacuous — an order that drifted away reds on the anchor instead.
    expectAbsentWithAnchor(order, 'drawPopulation', POPULATION_STEP, 'A5: no split registration');
    expectAbsentWithAnchor(order, 'derivePopulation', POPULATION_STEP, 'A5: no split registration');

    const instrumented = instrumentedRoot(SEED);
    runHeadless(instrumented.root);
    const labels = instrumented.record.forkLabels.filter((label) => label === POPULATION_STEP);
    expect(labels, 'the runner forks the step exactly once').toEqual([POPULATION_STEP]);
    expect(instrumented.record.streams, 'exactly one stream object serves the step').toHaveLength(1);
    expect(instrumented.record.innerForks, 'nothing inside the step mints a second stream').toBe(0);
    // Both halves drew on that ONE object: the derive half's 67 cannot fit alone in a count
    // that also carries the root half's density band and roster draws.
    expect(instrumented.record.draws).toBeGreaterThan(DERIVE_HALF_DRAWS);
  }, 120_000);

  it('A6 — idempotency and purity: three pinned calls agree, and nothing is mutated', () => {
    const source = runHeadless(createPRNG(SEED));
    const pins = pinsFromContext(source);
    const pinsBefore = JSON.stringify(pins);
    const initialContext = initialContextFor(SEED);
    const initialBefore = JSON.stringify(initialContext);

    const runs = [];
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const ctx = withCustomContent({}, () => runPipeline(
        initialContextFor(SEED), createPRNG(SEED), { pins },
      ));
      runs.push(JSON.stringify(ctx.settlement));
      expect(Object.prototype.hasOwnProperty.call(ctx, '__pins')).toBe(false);
    }
    expect(runs[1]).toBe(runs[0]);
    expect(runs[2]).toBe(runs[0]);
    expect(JSON.stringify(pins)).toBe(pinsBefore);
    expect(JSON.stringify(initialContext)).toBe(initialBefore);
  }, 180_000);

  it('A7 — no second stream anywhere: one registration, zero forks, the fork law untouched', () => {
    const stepSource = readFileSync(
      resolve(process.cwd(), 'src', 'generators', 'steps', 'generatePopulation.js'), 'utf-8',
    );
    expect(stepSource.match(/registerStep\(/g)).toHaveLength(1);
    expect(stepSource.match(/fork\(/g), 'no stream is minted in the step').toBeNull();

    // Control: the owner-gated derivation is byte-identical to the base.
    const prngSource = readFileSync(
      resolve(process.cwd(), 'src', 'kernel', 'prng.js'), 'utf-8',
    );
    expect(prngSource).toContain('fork: (label) => createPRNG(`${seed}::${label}`),');
  });
});

/** The step's own unpinned draw count at SEED and CONFIG. AS-OF `bdbf7c89c`, re-measured at
 *  EM-B2a2's base; A2 and A3 both re-measure it rather than trusting the numeral. */
const UNPINNED_STEP_DRAWS = 315;
/** The overridden VALUE A3 carries through the pin channel into the assembled record. It is
 *  planted by the arm and appears nowhere in the generator's vocabulary. */
const OVERRIDE_SENTINEL = 'EM-B2a2 SENTINEL BURGRAVE';

describe('EM-B2a2 — the pin primitive has ONE exported home: chooseOrPin lives on the runner', () => {
  it('A1 — own-presence decides at the exported home, and the step keeps no second definition', () => {
    const calls = { count: 0 };
    const draw = () => { calls.count += 1; return 'DREW'; };

    // OWN-PRESENT: the pin comes back and the thunk is NEVER called. OWN-PRESENCE, not
    // truthiness, decides — an own `undefined` pins exactly as hard as an object does.
    expect(chooseOrPin({ npcs: 'PINNED' }, 'npcs', draw)).toBe('PINNED');
    expect(chooseOrPin({ npcs: undefined }, 'npcs', draw)).toBeUndefined();
    expect(chooseOrPin({ npcs: null }, 'npcs', draw)).toBeNull();
    expect(chooseOrPin({ npcs: 0 }, 'npcs', draw)).toBe(0);
    expect(calls.count, 'an own-present pin must not advance the stream').toBe(0);

    // The pin is the caller's own object BY REFERENCE: the primitive clones nothing.
    // Cloning is EM-R1's rule, at the runner, and it is not this member's.
    const bag = { npcs: [{ name: 'Ilse' }] };
    expect(chooseOrPin(bag, 'npcs', draw)).toBe(bag.npcs);
    expect(calls.count).toBe(0);

    // ABSENT, INHERITED, null and undefined each call the draw EXACTLY ONCE. The
    // prototype-chain row is the one that convicts a rewrite into `key in pins`.
    const inherited = Object.create({ npcs: 'FROM THE PROTOTYPE' });
    expect(inherited.npcs, 'the fixture really does inherit the key').toBe('FROM THE PROTOTYPE');
    expect(Object.prototype.hasOwnProperty.call(inherited, 'npcs')).toBe(false);
    expect([
      chooseOrPin({ other: 'PINNED' }, 'npcs', draw),
      chooseOrPin(inherited, 'npcs', draw),
      chooseOrPin(null, 'npcs', draw),
      chooseOrPin(undefined, 'npcs', draw),
    ]).toEqual(['DREW', 'DREW', 'DREW', 'DREW']);
    expect(calls.count, 'each unpinned consult calls its draw exactly once').toBe(4);

    // NO SECOND DEFINITION survives in the step, anchored on the widened import so the arm
    // cannot pass by the file having vanished, emptied or been renamed out from under it.
    const stepSource = readFileSync(
      resolve(process.cwd(), 'src', 'generators', 'steps', 'generatePopulation.js'), 'utf-8',
    );
    expect(stepSource, 'the step consults the primitive through its exported home')
      .toContain("import { chooseOrPin, registerStep } from '../pipeline.js';");
    expect(stepSource.match(/function chooseOrPin\(/g), 'the step kept a second DEFINITION')
      .toBeNull();
    // The SPELLING survives five times over — the widened import plus the four call sites —
    // so an arm phrased as "no occurrence" would be false rather than strict.
    expect(stepSource.match(/chooseOrPin/g)).toHaveLength(5);
  });

  it('A2 — the lift moves nothing: the golden corpus, the draw count and the one-stream shape', () => {
    // (1) THE COMMITTED BASE. The manifest was recorded before the lift, so any byte the
    // pure move moved reds here. The same fixed stride EM-P0's A1 samples.
    const rows = goldenCorpus();
    const manifest = JSON.parse(readFileSync(GOLDEN_MANIFEST, 'utf-8'));
    const stride = Math.max(1, Math.floor(rows.length / 40));
    const moved = [];
    let checked = 0;
    for (let index = 0; index < rows.length; index += stride) {
      const row = rows[index];
      checked += 1;
      if (manifest[keyOf(row)] !== hashFor(row)) moved.push(keyOf(row));
    }
    expect(checked).toBeGreaterThanOrEqual(40);
    expect(moved, 'the lift moved a byte of generated output').toEqual([]);

    // (2) ALL FOUR POPULATION KEYS still reach the assembled record through the lifted
    // primitive, at the same count the context carries.
    const instrumented = instrumentedRoot(SEED);
    const ctx = runHeadless(instrumented.root);
    for (const key of CHOOSER_KEYS) {
      expect(ctx[key], `${key} is produced unpinned`).toBeDefined();
      expect(ctx.settlement[key].length, `${key} reaches the settlement`).toBe(ctx[key].length);
    }
    expect(ctx.npcs.length).toBeGreaterThan(0);

    // (3) THE STEP'S OWN STREAM takes the SAME count unpinned. A draw added or removed in
    // transit reds here (STOP-2).
    expect(instrumented.record.draws, 'the unpinned draw count moved: a draw was added or removed')
      .toBe(UNPINNED_STEP_DRAWS);

    // (4) ONE registration, ONE stream object, ZERO inner forks: the lift did not split the
    // step on its way out of the file.
    const order = getStepOrder();
    expect(order.filter((name) => name === POPULATION_STEP)).toEqual([POPULATION_STEP]);
    expectAbsentWithAnchor(order, 'drawPopulation', POPULATION_STEP, 'A2: one registration');
    expectAbsentWithAnchor(order, 'derivePopulation', POPULATION_STEP, 'A2: one registration');
    expect(instrumented.record.streams, 'exactly one stream object serves the step').toHaveLength(1);
    expect(instrumented.record.innerForks, 'nothing inside the step mints a second stream').toBe(0);
  }, 180_000);

  it('A3 — the pin is live: an overridden pin value reaches the settlement, and a pinned step draws zero', () => {
    const unpinned = instrumentedRoot(SEED);
    const base = runHeadless(unpinned.root);
    expect(unpinned.record.draws, 'the unpinned baseline this arm discriminates against')
      .toBe(UNPINNED_STEP_DRAWS);

    // FROZEN BEFORE ANY PINNED RUN. Design §21.5 measured a coherence pass writing through
    // a caller's own bag on three of nine sampled rows, so the base's text is captured
    // first and every later assertion reads THIS string.
    const baseJson = JSON.stringify(base.settlement);
    const anchorName = base.npcs[0].name;

    const pins = pinsFromContext(base);
    const overridden = {
      ...pins,
      npcs: pins.npcs.map((npc, index) => (
        index === 0 ? { ...npc, name: OVERRIDE_SENTINEL } : npc
      )),
    };
    const pinned = instrumentedRoot(SEED);
    const rederived = runHeadless(pinned.root, { pins: overridden });

    expect(pinned.record.draws, 'a fully pinned step must not advance its own stream').toBe(0);

    // THE DISCRIMINATOR (§9a). Generation is same-seed deterministic, so a DEAD pin
    // reproduces the record anyway; only a draw count and an OVERRIDDEN VALUE convict one.
    // The base is anchored on the roster name the override replaced, so the absence cannot
    // pass by the settlement having drifted away.
    expectAbsentWithAnchor(baseJson, OVERRIDE_SENTINEL, anchorName, 'A3: the sentinel is planted by this arm');
    expect(JSON.stringify(rederived.settlement), 'the overridden pin never reached the record')
      .toContain(OVERRIDE_SENTINEL);
  }, 180_000);

  it('A4 — the partial-pin refusal survives the lift: the whole sentence, and the strict report', () => {
    const complete = runHeadless(createPRNG(SEED));
    const partial = { relationships: complete.relationships };

    // THE WHOLE SENTENCE, NEVER A SUBSTRING: the message is asserted by equality, so a
    // loosened or re-worded refusal reds here even if it still contains these words.
    let thrown = null;
    try {
      runHeadless(createPRNG(SEED), { pins: partial });
    } catch (error) {
      thrown = error;
    }
    expect(thrown, 'a partial pin set must refuse').toBeInstanceOf(Error);
    expect(thrown.message).toBe(
      `Pipeline pins: step "${POPULATION_STEP}" has choosers [${CHOOSER_KEYS.join(', ')}] `
      + 'but pins supply only [relationships]. Pin every chooser of a step or none of them.',
    );

    const violations = [];
    runHeadless(createPRNG(SEED), {
      pins: partial,
      onStrictViolation: (violation) => violations.push(violation),
    });
    expect(violations).toContainEqual({
      step: POPULATION_STEP,
      kind: 'pin',
      keys: ['npcs', 'factions', 'conflicts'],
    });
  }, 120_000);
});

/** The census corpus's own row count (EM-P2's declared 63). The floor every A7 figure rests on. */
const CENSUS_ROWS = 63;
/** The rows §0.1 measured the leak in, and the two keys it moved. RE-MEASURED by A7, never trusted. */
const LEAKED_ROWS = 42;
/** The three pin channels A8 walks: every registered step that provides a held record key. */
const PIN_CHANNELS = ['generatePopulation', 'assembleInstitutions', 'generatePower'];

/** One corpus row's own production for `step`, deep-copied so it stands in for a DM's record. */
function recordBuiltBag(row, step, keys) {
  let produced = null;
  runCorpusRow(row, createPRNG(row._seed), {
    onStep: (name, ctx) => {
      if (name !== step) return;
      produced = structuredClone(Object.fromEntries(keys.map((key) => [key, ctx[key]])));
    },
  });
  return produced;
}

/**
 * THE RUNNER'S CLONES, DEFEATED. A7's negative control needs the pre-member aliasing back, and
 * EM-R1 takes TWO kinds of clone: the ENTRY clones, and judgment 200's clone at the PATCH MERGE.
 * A bypass that fires once at the first boundary is re-cloned by the merge and reports a FALSE
 * zero, so this one re-points `ctx[key]` AND `ctx.__pins[key]` at the caller's own objects at
 * EVERY boundary, which is byte-for-byte what the runner did before this member.
 */
function bypassEveryRunnerClone(bag, keys) {
  return (_name, ctx) => {
    if (!ctx.__pins) return;
    for (const key of keys) {
      ctx[key] = bag[key];
      ctx.__pins[key] = bag[key];
    }
  };
}

describe('EM-R1 — the pin bag is cloned on entry, at the runner', () => {
  it('A7 — the leak and the cure: a record-built bag moves 0 of 63, where the uncloned control moves 42', () => {
    const rows = censusCorpus();
    const keys = getStepMeta().find((meta) => meta.name === POPULATION_STEP).provides;
    expect(rows, 'the census corpus is the floor every figure here rests on').toHaveLength(CENSUS_ROWS);
    expect(keys).toEqual(CHOOSER_KEYS);

    // COLLECT, THEN ASSERT ONCE: a bare per-row expect is the shape seedLoopTotality convicts.
    const through = { moved: 0, threw: 0, took: 0, perKey: {} };
    const bypassed = { moved: 0, threw: 0, took: 0, perKey: {} };
    for (const row of rows) {
      const bag = recordBuiltBag(row, POPULATION_STEP, keys);
      for (const [mode, tally] of [['through', through], ['bypassed', bypassed]]) {
        const caller = structuredClone(bag);
        const before = JSON.stringify(caller);
        // ANTI-VACUITY, MEASURED AT THE PRODUCER'S OWN BOUNDARY: the pin was TAKEN on this row,
        // which is what tells a cured runner apart from a member that dropped the pin entirely.
        // It is read from the PATCH, never from the finished context: `corruptionPass` mutates
        // `npcs` and `factions` AFTER the pin lands, so the final context differs on 42 rows by
        // design and a check placed there would report a false 21 of 63.
        const bypass = mode === 'bypassed' ? bypassEveryRunnerClone(caller, keys) : null;
        const options = {
          pins: caller,
          onStrictViolation: () => {},
          onStep: (name, ctx, patch) => {
            if (bypass) bypass(name, ctx);
            if (name !== POPULATION_STEP || !patch) return;
            if (keys.every((key) => JSON.stringify(patch[key]) === JSON.stringify(bag[key]))) {
              tally.took += 1;
            }
          },
        };
        try {
          runCorpusRow(row, createPRNG(row._seed), options);
        } catch {
          tally.threw += 1;
        }
        if (JSON.stringify(caller) !== before) {
          tally.moved += 1;
          for (const key of keys) {
            if (JSON.stringify(caller[key]) !== JSON.stringify(bag[key])) {
              tally.perKey[key] = (tally.perKey[key] || 0) + 1;
            }
          }
        }
      }
    }

    // THE CURE: through the runner's own clones the caller's record never moves.
    expect([through.moved, through.threw], 'a held record was written through at the runner').toEqual([0, 0]);
    expect(through.took, 'the pins were dropped, so the zero above proves nothing').toBe(CENSUS_ROWS);
    expect(through.perKey).toEqual({});

    // THE NEGATIVE CONTROL: the same bag with every runner clone defeated is written through on
    // 42 rows, by npcs and factions alone, so the zero above can never go silently vacuous.
    expect(bypassed.moved, 'the control came back clean: the bypass no longer defeats the clones')
      .toBe(LEAKED_ROWS);
    expect(bypassed.perKey).toEqual({ npcs: LEAKED_ROWS, factions: LEAKED_ROWS });
    expect(bypassed.took, 'the control must take the pin too, or it measures a different world')
      .toBe(CENSUS_ROWS);
  }, 300_000);

  it('A8 — the bag is not the context at every step, and own-presence survives the clone', () => {
    const row = censusCorpus()[0];
    const meta = getStepMeta();
    const aliased = [];
    const walked = [];
    for (const step of PIN_CHANNELS) {
      const keys = meta.find((entry) => entry.name === step).provides;
      const bag = recordBuiltBag(row, step, keys);
      let boundaries = 0;
      runCorpusRow(row, createPRNG(row._seed), {
        pins: structuredClone(bag),
        onStrictViolation: () => {},
        onStep: (name, ctx) => {
          if (!ctx.__pins) return;
          boundaries += 1;
          for (const key of keys) {
            if (ctx.__pins[key] === ctx[key]) aliased.push(`${step}|${key}|after ${name}`);
          }
        },
      });
      walked.push([step, boundaries]);
    }
    // ANTI-VACUITY FIRST: every channel really walked the whole run, so an empty `aliased` is a
    // measurement and not an empty read.
    expect(walked.map(([, boundaries]) => boundaries > 0)).toEqual([true, true, true]);
    expect(walked.map(([step]) => step)).toEqual(PIN_CHANNELS);
    // anchored: the line above proves all three channels walked a non-empty run, so this empty
    // set is the two-channel entry clone plus judgment 200's merge clone holding at every step.
    expect(aliased, 'ctx.__pins aliased ctx: a later pass can write through a held fact').toEqual([]);

    // THE FOUR ROWS EM-B2a2's LANDED A1 DEPENDS ON: structuredClone keeps an own property whose
    // value is undefined, null, 0 or '', and does NOT promote an inherited key to an own one.
    const source = { a: undefined, b: null, c: 0, d: '' };
    const copy = structuredClone(source);
    expect(['a', 'b', 'c', 'd'].map((key) => Object.prototype.hasOwnProperty.call(copy, key)))
      .toEqual([true, true, true, true]);
    expect(['a', 'b', 'c', 'd'].map((key) => copy[key])).toEqual([undefined, null, 0, '']);
    const inheritedSource = Object.create({ npcs: 'FROM THE PROTOTYPE' });
    inheritedSource.own = 1;
    const inheritedCopy = structuredClone(inheritedSource);
    expect(inheritedSource.npcs, 'the fixture really does inherit the key').toBe('FROM THE PROTOTYPE');
    // anchored: the line above proves the prototype chain is live and the line below proves the
    // clone kept the OWN key, so this false is a promotion that did not happen.
    expect(Object.prototype.hasOwnProperty.call(inheritedCopy, 'npcs')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(inheritedCopy, 'own')).toBe(true);
  }, 180_000);
});

/** The step whose two choosers are the rule's whole subject: one transient, one record-backed. */
const POWER_STEP = 'generatePower';
/** The record-backed chooser of that step, and the key a DM's own record can supply. */
const POWER_KEY = 'powerStructure';
/** The value A5 plants INTO the transient chooser's pin, to prove the seam still hands it back. */
const INTENT_SENTINEL = 'EM-R1b SENTINEL INTENT';

describe('EM-R1b — a recordPath-less chooser is not counted against a record-built bag', () => {
  it('A4 — EM-R1b: a record-built power bag runs unrefused on every census row, and a partial bag still refuses', () => {
    const rows = censusCorpus();
    expect(rows, 'the census corpus is the floor every figure here rests on').toHaveLength(CENSUS_ROWS);
    const choosers = getStepMeta().find((meta) => meta.name === POWER_STEP).provides;
    expect(choosers, 'the ROSTER is kept: this member changes the rule, never the declaration')
      .toEqual(['powerIntent', POWER_KEY]);

    // THE BAG IS READ AT THE RECORD PATH. `record.powerStructure` is the only chooser of this step
    // a DM's own record can supply; `powerIntent` never lands on a record at all, which is exactly
    // why counting it against this bag refused a re-derivation that is otherwise complete.
    const refused = [];
    const took = [];
    for (const row of rows) {
      const record = runCorpusRow(row, createPRNG(row._seed)).settlement;
      const bag = { [POWER_KEY]: structuredClone(record[POWER_KEY]) };
      let landed = false;
      try {
        runCorpusRow(row, createPRNG(row._seed), {
          pins: bag,
          onStep: (name, ctx, patch) => {
            if (name !== POWER_STEP || !patch) return;
            landed = JSON.stringify(patch[POWER_KEY]) === JSON.stringify(bag[POWER_KEY]);
          },
        });
      } catch (error) {
        refused.push(`${keyOf(row)}: ${error.message}`);
        continue;
      }
      took.push(landed);
    }
    expect(refused, 'the record-built power bag was refused: a transient chooser is still counted')
      .toEqual([]);
    // ANTI-VACUITY AT THE PRODUCER'S OWN BOUNDARY: the held structure really was TAKEN on every
    // row, which is what tells a cured rule apart from a run that quietly dropped the pin.
    expect(took.filter(Boolean), 'the held structure was not taken, so the zero above proves nothing')
      .toHaveLength(CENSUS_ROWS);

    // ⭐ THE POSITIVE CONTROL, IN THIS ARM: the narrowing must not go wide. A bag supplying ONE of
    // four RECORD-BACKED choosers is still a partial pin, refused by the whole sentence, with the
    // same three keys in its strict report.
    const complete = runHeadless(createPRNG(SEED));
    const partial = { relationships: complete.relationships };
    let thrown = null;
    try {
      runHeadless(createPRNG(SEED), { pins: partial });
    } catch (error) {
      thrown = error;
    }
    expect(thrown, 'a partial bag over record-backed choosers must still refuse').toBeInstanceOf(Error);
    expect(thrown.message).toBe(
      `Pipeline pins: step "${POPULATION_STEP}" has choosers [${CHOOSER_KEYS.join(', ')}] `
      + 'but pins supply only [relationships]. Pin every chooser of a step or none of them.',
    );
    const violations = [];
    runHeadless(createPRNG(SEED), {
      pins: partial,
      onStrictViolation: (violation) => violations.push(violation),
    });
    expect(violations).toContainEqual({
      step: POPULATION_STEP,
      kind: 'pin',
      keys: ['npcs', 'factions', 'conflicts'],
    });
  }, 600_000);

  it('A5 — EM-R1b: a supplied transient chooser is still handed back, and the unpinned path is inert', () => {
    // (1) THE SEAM IS UNTOUCHED. `chooseOrPin` still returns an own-present pin, transient or not:
    // the RULE stopped counting the key, the primitive never stopped honouring it.
    const row = censusCorpus()[0];
    const produced = {};
    const record = runCorpusRow(row, createPRNG(row._seed), {
      onStep: (name, ctx, patch) => { if (name === POWER_STEP && patch) produced.patch = structuredClone(patch); },
    }).settlement;
    expect(produced.patch, 'the step produced no patch, so the sentinel below would land nowhere')
      .toBeDefined();
    let taken = null;
    runCorpusRow(row, createPRNG(row._seed), {
      pins: {
        powerIntent: { ...produced.patch.powerIntent, sentinel: INTENT_SENTINEL },
        [POWER_KEY]: structuredClone(record[POWER_KEY]),
      },
      onStep: (name, ctx, patch) => {
        if (name === POWER_STEP && patch) taken = patch.powerIntent?.sentinel ?? null;
      },
    });
    expect(taken, 'a SUPPLIED transient chooser is no longer handed back by chooseOrPin')
      .toBe(INTENT_SENTINEL);

    // THE COUNTERFORCE, IN THIS ARM (§P6): the same run with the transient chooser NOT supplied
    // re-rolls it on the step's own stream, so the sentinel arrives only because the PIN carried
    // it. Without this, the assertion above would also pass on a step that never consults a pin.
    let unpinned = 'not reached';
    runCorpusRow(row, createPRNG(row._seed), {
      pins: { [POWER_KEY]: structuredClone(record[POWER_KEY]) },
      onStep: (name, ctx, patch) => {
        if (name === POWER_STEP && patch) unpinned = patch.powerIntent?.sentinel ?? null;
      },
    });
    expect(unpinned, 'the step re-rolls an unsupplied transient chooser, so the sentinel can only '
      + 'have come from the pin channel').toBeNull();

    // (2) THE UNPINNED PATH IS INERT. With `pins` absent the rule cannot execute at all, so the
    // committed golden is unmoved over the same fixed stride EM-P0's A1 samples.
    const goldenRows = goldenCorpus();
    const goldenManifest = JSON.parse(readFileSync(GOLDEN_MANIFEST, 'utf-8'));
    const goldenStride = Math.max(1, Math.floor(goldenRows.length / 40));
    const moved = [];
    let checked = 0;
    for (let index = 0; index < goldenRows.length; index += goldenStride) {
      const goldenRow = goldenRows[index];
      checked += 1;
      if (goldenManifest[keyOf(goldenRow)] !== hashFor(goldenRow)) moved.push(keyOf(goldenRow));
    }
    expect(checked).toBeGreaterThanOrEqual(40);
    expect(moved, 'the golden moved: an unpinned run took a branch this member added').toEqual([]);
  }, 600_000);
});
