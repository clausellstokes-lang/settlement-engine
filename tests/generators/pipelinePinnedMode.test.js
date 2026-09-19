/**
 * pipelinePinnedMode.test.js — EM-P0's acceptance battery (A1–A7).
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
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepOrder, runPipeline } from '../../src/generators/pipeline.js';
import { generateRelationships } from '../../src/generators/npcGenerator.js';
import { generateConflicts, generateFactions } from '../../src/generators/powerGenerator.js';
import { resolveConfigWithUserContentTunables } from '../../src/domain/content/userContentTunables.js';
import { withCustomContent } from '../../src/lib/dependencyEngine.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
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

  it('A2 — the pin reproduces the record: pinning every chooser rebuilds the settlement', () => {
    const first = runHeadless(createPRNG(SEED));
    const pins = pinsFromContext(first);
    for (const key of CHOOSER_KEYS) expect(pins[key]).toBeDefined();

    const second = runHeadless(createPRNG(SEED), { pins });
    expect(JSON.stringify(second.settlement)).toBe(JSON.stringify(first.settlement));
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
