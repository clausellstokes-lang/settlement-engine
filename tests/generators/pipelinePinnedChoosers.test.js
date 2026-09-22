/**
 * pipelinePinnedChoosers.test.js — EM-B2a3's acceptance battery A1-A7: `assembleInstitutions`
 * and `generatePower` consult the landed pin seam for every key they provide.
 *
 * THE SEAM GOES FROM ONE STEP OF TWENTY-TWO TO THREE. `runPipeline` hands the pins to every step
 * under the reserved context key, and each registered chooser consults `chooseOrPin` at its own
 * exported home on the runner. A pinned chooser DOES NOT DRAW, and the value it hands back is
 * CLONED by the step, so a record-built bag is never written through by a later pass.
 *
 * ⭐ WHY EVERY REPRODUCTION ARM HERE IS PAIRED WITH AN ANTI-VACUITY ARM (the packet's §9a). At the
 * base of this member both steps IGNORED the pins: the runner seeded the context with them, the
 * step overwrote them with its own patch, and the settlement came back byte-identical to the
 * baseline. A naive "the pinned run reproduces the record" assertion is therefore GREEN BEFORE
 * THIS MEMBER EXISTS. A2 is the arm that convicts a member that did nothing: it pins a
 * DELIBERATELY ALTERED value, one key at a time over all five, and reds on the key that was
 * missed.
 *
 * ⛔ TWO INSTRUMENTS, AND THE DIFFERENCE MATTERS. A2, A3 and A6's sealed half drive the pins
 * THROUGH THE MEMBER'S OWN CONSULTS (the runner's pins channel). A5 and A6's negative control
 * drive the packet's §0 instrument instead — the pin INJECTED over the step's patch at the step
 * boundary — because those are the figures §0 measured and sealed, and the control that keeps
 * them honest is a property of that instrument.
 *
 * ⛔ NO `clearSteps()` ANYWHERE IN THIS FILE: it drives the REAL registry.
 * ⛔ Nothing here names a variable or a parameter `it`, `test` or `describe`.
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { getStepMeta } from '../../src/generators/pipeline.js';
import { GENERATION_TIER1 } from '../../src/domain/generation/generationForkRegistry.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { computeRelTension } from '../../src/generators/power/relationshipArchetypes.js';
import { applyStressEventFactions } from '../../src/generators/power/stressFactions.js';
import {
  generatePowerStructure,
  normalizeAndAnnotateFactions,
  renormalizeFactionPower,
} from '../../src/generators/power/rulingStructure.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { censusCorpus, instrumentedRoot, runHeadless } from '../helpers/generationForkCensus.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

/**
 * THE MINT RECORDER, DECLARED THROUGH `vi.hoisted`. `vi.mock` is hoisted ABOVE this file's STATIC
 * imports, and those imports reach `src/kernel/prng.js` transitively — the pipeline entry point
 * imports it on its own first import line — so the FACTORY RUNS WHILE THOSE IMPORTS LOAD, before
 * any plain module-scope `const` below it has initialized. Declared as a plain const the recorder
 * killed the whole suite at load with `Cannot access 'mintSeeds' before initialization`, MEASURED
 * on this file. `vi.hoisted` lifts the recorder's initialization above both the mock and the
 * imports; it is the estate's own idiom for exactly this shape, and the precedents say so in the
 * same words: `tests/ui/homeHeroAnonGauge.test.jsx:39-40` ("the factory runs before the module
 * body's consts"), `tests/ui/anonPreGenLocked.test.jsx:28`, `tests/ui/catalogTabsRestore.test.jsx:21`.
 * It is OFF by default: only A3 turns it on, and only around the two runs it discriminates.
 *
 * ⭐ WHY A3 NEEDS IT, AND WHY THE FORK COUNT DOES NOT SUFFICE. `instrumentedRoot` wraps the ROOT
 * stream's `fork`, so it sees `createPowerGenerationIntent`'s `stepRng.fork('power-structure')`
 * and is BLIND to `projectPowerGenerationIntent`'s `setActiveRng(createPRNG(intent.rngSeed))`,
 * which is a STANDALONE MINT and not a fork. A member that held `powerStructure` but still ran
 * the projection would lose the fork with the intent and pass the fork arm, and would hand the
 * pin back either way and pass A2. The mint seed is the only thing that tells the two apart.
 *
 * ⛔ THE WRAPPER IS A PURE PASS-THROUGH: it records the seed and returns the REAL stream, so no
 * draw order moves and no fork is re-implemented. `prng.js`'s own `fork` calls its INTRA-MODULE
 * `createPRNG`, which this wrapper does not intercept, so what it records is exactly the set of
 * DIRECT mints the generator graph takes through the module's exported door.
 */
const mintSeeds = vi.hoisted(() => ({ seeds: [], on: false, actualKeys: [] }));

vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
  const actual = await importOriginal();
  mintSeeds.actualKeys = Object.keys(actual).sort();
  return {
    ...actual,
    createPRNG: (seed) => {
      if (mintSeeds.on) mintSeeds.seeds.push(String(seed));
      return actual.createPRNG(seed);
    },
  };
});

const ASSEMBLE = 'assembleInstitutions';
const POWER = 'generatePower';
const GOLDEN_MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');
const POWER_DIR = resolve(process.cwd(), 'src', 'generators', 'power');

/** The one corpus row every single-row figure below was measured on. */
const PROBE = { settType: 'town', terrainOverride: 'plains' };
/** `assembleInstitutions`'s own-stream draw budget on PROBE, unpinned. Re-measured by A3. */
const PROBE_DRAWS = 66;
/** The label `createPowerGenerationIntent` forks to MINT the power stream's seed. */
const POWER_MINT_LABEL = 'power-structure';
/** Planted by A2 and A6 alone; it appears in no generator vocabulary. */
const SENTINEL = 'EM-B2a3 SENTINEL LANTERNWRIGHT';

/**
 * §0.S's OWN WATCH LIST, in its table's order: the record keys whose survival under a
 * record-built pin the packet measured. A5 asserts which of them are TOTAL and that the rest
 * are not; it asserts none of the individual short figures (a named STOP of §11).
 */
const WATCHED = [
  'institutions', 'economicState', 'availableServices', 'simulationTrace', 'economicViability',
  'resourceAnalysis', 'npcs', 'factions', 'powerStructure', 'generationCoherenceReceipt',
  'defenseProfile', 'relationships', 'conflicts', 'history', 'spatialLayout', 'isolationSupport',
  'stress', 'name', 'population',
];
/** The three §0.S measured TOTAL under `assembleInstitutions`'s record-built pin. */
const ASSEMBLE_TOTAL = ['stress', 'name', 'population'];

const text = (value) => JSON.stringify(value);
const probeRow = () => censusCorpus().find(
  (row) => row.settType === PROBE.settType && row.terrainOverride === PROBE.terrainOverride,
);
/** The census's own verdict for one chooser: `recordPath` is where a pin must reappear. */
const recordPathOf = (step, key) => GENERATION_TIER1.find(
  (row) => row.step === step && row.key === key,
).recordPath;
const readRecordPath = (record, path) => path.split('.').slice(1).reduce(
  (node, key) => (node == null ? node : node[key]), record,
);
/** The chooser lists come from the LIVE registry; this file never re-types them. */
const choosersOf = (step) => getStepMeta().find((meta) => meta.name === step).provides;

/** One plain run, with each named step's patch captured (cloned) at its own boundary. */
function plainRun(row, steps) {
  /** @type {Record<string, any>} */ const boundary = {};
  const context = runHeadless(row, createPRNG(row._seed), {
    onStep: (name, _ctx, patch) => {
      if (steps.includes(name)) boundary[name] = structuredClone(patch);
    },
  });
  return { context, boundary };
}

/** The whole-`provides` pin a caller builds FROM THE RECORD, per the census's `recordPath`. */
function recordBuiltPins(step, record, produced) {
  return Object.fromEntries(choosersOf(step).map((key) => {
    const path = recordPathOf(step, key);
    return [key, path === null ? produced[key] : readRecordPath(record, path)];
  }));
}

/** The pin honoured THROUGH THE MEMBER: the runner's own pins channel. */
function throughTheMember(row, pins, onStep) {
  return runHeadless(row, createPRNG(row._seed), { pins, onStrictViolation: () => {}, onStep });
}

/** The packet's §0 instrument: the pin INJECTED over the step's patch at the step boundary. */
function injectedAtTheBoundary(row, step, pins) {
  return runHeadless(row, createPRNG(row._seed), {
    onStep: (name, context) => {
      if (name === step) Object.assign(context, structuredClone(pins));
    },
  });
}

/** Survival of every settlement key over the whole census corpus, by the §0 instrument. */
function survivalByInjection(step, build) {
  const corpus = censusCorpus();
  let whole = 0;
  /** @type {Map<string, number>} */ const perKey = new Map();
  for (const row of corpus) {
    const { context, boundary } = plainRun(row, [step]);
    const base = context.settlement;
    const rerun = injectedAtTheBoundary(row, step, build(base, boundary[step]));
    if (text(rerun.settlement) === text(base)) whole += 1;
    for (const key of Object.keys(base)) {
      const same = text(rerun.settlement[key]) === text(base[key]);
      perKey.set(key, (perKey.get(key) || 0) + (same ? 1 : 0));
    }
  }
  return { rows: corpus.length, whole, perKey };
}

/** Write-through over the whole corpus: does the CALLER's record move, and does the run throw? */
function writeThrough(step, mode) {
  const corpus = censusCorpus();
  let mutated = 0;
  let threw = 0;
  let taken = 0;
  let handedBackByReference = 0;
  /** @type {Set<string>} */ const messages = new Set();
  for (const row of corpus) {
    const { context, boundary } = plainRun(row, [step]);
    const record = context.settlement;
    const pins = recordBuiltPins(step, record, boundary[step]);
    const watched = recordPathOf(step, choosersOf(step).find((key) => recordPathOf(step, key) !== null));
    const before = text(readRecordPath(record, watched));
    try {
      if (mode === 'member') {
        throughTheMember(row, pins, (name, _ctx, patch) => {
          if (name !== step) return;
          // THE NON-VACUITY FLOOR: the pin was TAKEN on this row, and what came back is the
          // step's own CLONE rather than the caller's object. A member that dropped the pin
          // would leave the record unmoved too, and this is what tells the two apart.
          if (choosersOf(step).every((key) => text(patch[key]) === text(pins[key]))) taken += 1;
          if (choosersOf(step).some((key) => patch[key] === pins[key])) handedBackByReference += 1;
        });
      } else {
        runHeadless(row, createPRNG(row._seed), {
          onStep: (name, context2) => { if (name === step) Object.assign(context2, pins); },
        });
      }
    } catch (error) {
      threw += 1;
      messages.add(String(error.message));
    }
    if (text(readRecordPath(record, watched)) !== before) mutated += 1;
  }
  return {
    rows: corpus.length, mutated, threw, taken, handedBackByReference, messages: [...messages],
  };
}

describe('EM-B2a3 — the institution and power choosers consult the pin seam', () => {
  it('A1 — the null change: an unpinned run and pins {} leave the golden corpus byte-identical', () => {
    const rows = goldenCorpus();
    const manifest = JSON.parse(readFileSync(GOLDEN_MANIFEST, 'utf-8'));
    const stride = Math.max(1, Math.floor(rows.length / 40));
    const moved = [];
    let checked = 0;
    for (let index = 0; index < rows.length; index += stride) {
      const { _seed: seed, ...config } = rows[index];
      checked += 1;
      const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
      const digest = createHash('sha256').update(JSON.stringify(settlement)).digest('hex');
      if (manifest[keyOf(rows[index])] !== digest) moved.push(keyOf(rows[index]));
    }
    expect(checked).toBeGreaterThanOrEqual(40);
    expect(moved, 'the pin consults moved generated output').toEqual([]);

    const row = probeRow();
    const plain = runHeadless(row, createPRNG(row._seed));
    const empty = runHeadless(row, createPRNG(row._seed), { pins: {} });
    expect(Object.keys(empty)).toEqual(Object.keys(plain));
    expect(text(empty.settlement)).toBe(text(plain.settlement));
  }, 180_000);

  it('A2 — the pin is TAKEN: a deliberately altered value, one key at a time over all five', () => {
    const row = probeRow();
    const { context, boundary } = plainRun(row, [ASSEMBLE, POWER]);
    const record = context.settlement;
    const bags = {
      [ASSEMBLE]: recordBuiltPins(ASSEMBLE, record, boundary[ASSEMBLE]),
      [POWER]: recordBuiltPins(POWER, record, boundary[POWER]),
    };
    /** Each chooser's altered pin, keyed by the chooser: the step must hand THIS back. */
    const alter = {
      institutions: (bag) => bag.institutions.map(
        (entry, index) => (index === 0 ? { ...entry, name: SENTINEL } : entry),
      ),
      catalogForTier: (bag) => ({ ...bag.catalogForTier, [SENTINEL]: {} }),
      generationRepairs: (bag) => [...bag.generationRepairs, { id: SENTINEL, type: SENTINEL }],
      powerIntent: (bag) => ({ ...bag.powerIntent, sentinel: SENTINEL }),
      powerStructure: (bag) => ({ ...bag.powerStructure, stability: SENTINEL }),
    };
    expectAbsentWithAnchor(
      text(record), SENTINEL, record.name, 'A2: the sentinel is planted by this arm alone',
    );

    const dropped = [];
    const unreached = [];
    for (const step of [ASSEMBLE, POWER]) {
      for (const key of choosersOf(step)) {
        const pins = { ...bags[step], [key]: alter[key](bags[step]) };
        /** @type {Record<string, any>} */ const seen = {};
        const rerun = throughTheMember(row, pins, (name, _ctx, patch) => {
          if (name === step) seen.patch = structuredClone(patch);
        });
        if (text(seen.patch[key]) !== text(pins[key])) dropped.push(`${step}.${key}`);
        const path = recordPathOf(step, key);
        if (path !== null && !text(readRecordPath(rerun.settlement, path)).includes(SENTINEL)) {
          unreached.push(`${step}.${key}`);
        }
      }
    }
    expect(dropped, 'a chooser dropped its pin and produced its own value instead').toEqual([]);
    expect(unreached, 'a pinned value never reached the record path the census names').toEqual([]);
  }, 180_000);

  it('A3 — a pinned key takes no draw, on the honest instrument per step', () => {
    const row = probeRow();
    const { context, boundary } = plainRun(row, [ASSEMBLE, POWER]);
    const record = context.settlement;

    // `assembleInstitutions` draws on its OWN stream, so the draw count is its instrument.
    const bare = instrumentedRoot(row._seed);
    runHeadless(row, bare.root);
    expect(bare.perStep.get(ASSEMBLE).draws, 'the unpinned budget this arm discriminates against')
      .toBe(PROBE_DRAWS);
    const pinnedAssemble = instrumentedRoot(row._seed);
    runHeadless(row, pinnedAssemble.root, {
      pins: recordBuiltPins(ASSEMBLE, record, boundary[ASSEMBLE]), onStrictViolation: () => {},
    });
    expect(pinnedAssemble.perStep.get(ASSEMBLE).draws, 'a pinned chooser advanced its own stream')
      .toBe(0);

    // ⛔ `generatePower` takes ZERO own-stream draws unpinned, so that instrument is VACUOUS
    // there. Its honest one is the MINT: the step forks its own stream exactly once to derive
    // the power stream's seed, and a pinned step forks nothing.
    expect(bare.perStep.get(POWER).draws, 'the step-stream instrument is vacuous here').toBe(0);
    expect(bare.perStep.get(POWER).forkLabels).toEqual([POWER_MINT_LABEL]);
    const mintSeed = `${row._seed}::${POWER}::${POWER_MINT_LABEL}`;
    expect(boundary[POWER].powerIntent.rngSeed).toBe(mintSeed);
    expect(mintSeeds.actualKeys, 'the wrapper no longer stands over the real module')
      .toContain('createPRNG');

    // THE MINT CENSUS, SCOPED TO THE STEP'S OWN WINDOW. The recorder is drained at every step
    // boundary, so what it hands back is the set of mints THIS step took. The scope is
    // load-bearing and measured: `powerEconomyReconcilePass` re-projects the intent LATER in the
    // same run and mints the very same seed, so a process-wide census would find it under a pin
    // too and this arm could never convict the step. That later projection is EM-R3's seam.
    const mintsDuringPower = (pins) => {
      const during = [];
      mintSeeds.on = true;
      mintSeeds.seeds = [];
      const options = { onStep: (name) => {
        const taken = mintSeeds.seeds.splice(0);
        if (name === POWER) during.push(...taken);
      } };
      if (pins) Object.assign(options, { pins, onStrictViolation: () => {} });
      const instrumented = instrumentedRoot(row._seed);
      runHeadless(row, instrumented.root, options);
      mintSeeds.on = false;
      return { during, instrumented };
    };
    const mintedUnpinned = mintsDuringPower(null).during;
    const pinnedRun = mintsDuringPower(recordBuiltPins(POWER, record, boundary[POWER]));
    const mintedPinned = pinnedRun.during;
    const pinnedPower = pinnedRun.instrumented;
    expect(pinnedPower.perStep.get(POWER).forkLabels, 'a pinned step minted the power stream')
      .toEqual([]);
    expect(pinnedPower.perStep.get(POWER).draws).toBe(0);
    // ⭐ THE ARM §9 A3 NAMES: `createPRNG` is never called with the power stream's seed under a
    // pin. Anchored on the unpinned run, which must mint it, so a wrapper that stopped seeing
    // the mint reds on the LIVENESS half instead of passing the removal half vacuously.
    expectPresentThenAbsent(
      mintedUnpinned, mintedPinned, mintSeed,
      'A3: a pinned powerStructure never mints the power stream',
    );
  }, 180_000);

  it('A4 — the partial pin refuses BY NAME, and the name is not always this member\'s step', () => {
    const row = probeRow();
    const { context, boundary } = plainRun(row, [ASSEMBLE, POWER]);
    const record = context.settlement;

    // THE CLOSURE, computed from the live registry and asserted BOTH directions.
    const closureOf = (seed) => {
      const keys = new Set(seed);
      const steps = new Set();
      for (let changed = true; changed;) {
        changed = false;
        for (const meta of getStepMeta()) {
          if (!meta.provides.some((key) => keys.has(key))) continue;
          if (!steps.has(meta.name)) { steps.add(meta.name); changed = true; }
          for (const key of meta.provides) if (!keys.has(key)) { keys.add(key); changed = true; }
        }
      }
      return { keys: [...keys].sort(), steps: [...steps].sort() };
    };
    expect(closureOf(choosersOf(ASSEMBLE))).toEqual({
      keys: ['catalogForTier', 'generationRepairs', 'institutions', 'isolationSupport', 'stress', 'stressTypes'],
      steps: [ASSEMBLE, 'coherenceRepairPass', 'isolationPass', 'resolveStress', 'stressConfirmPass'],
    });
    expect(closureOf(choosersOf(POWER))).toEqual({ keys: ['powerIntent', 'powerStructure'], steps: [POWER] });

    // THE WHOLE SENTENCE, never a substring, and it names a step this member does not own.
    let thrown = null;
    try {
      runHeadless(row, createPRNG(row._seed), {
        pins: recordBuiltPins(ASSEMBLE, record, boundary[ASSEMBLE]),
      });
    } catch (error) { thrown = error; }
    expect(thrown, 'the institution closure must refuse').toBeInstanceOf(Error);
    expect(thrown.message).toBe(
      'Pipeline pins: step "coherenceRepairPass" has choosers [generationRepairs, isolationSupport] '
      + 'but pins supply only [generationRepairs]. Pin every chooser of a step or none of them.',
    );
    const violations = [];
    runHeadless(row, createPRNG(row._seed), {
      pins: recordBuiltPins(ASSEMBLE, record, boundary[ASSEMBLE]),
      onStrictViolation: (violation) => violations.push(violation),
    });
    expect(violations).toContainEqual({ step: 'coherenceRepairPass', kind: 'pin', keys: ['isolationSupport'] });

    // The power keys drag in nothing, so pinning the two of them alone does NOT refuse.
    expect(() => runHeadless(row, createPRNG(row._seed), {
      pins: recordBuiltPins(POWER, record, boundary[POWER]),
    })).not.toThrow();
  }, 180_000);

  it('A5 — the survival, sealed only where §0 measured it TOTAL over the census corpus', () => {
    const produced = (step) => (_base, patch) => Object.fromEntries(
      choosersOf(step).map((key) => [key, patch[key]]),
    );
    const fromRecord = (step) => (base, patch) => recordBuiltPins(step, base, patch);

    // (c) THE CONTROL FIRST: each step's OWN produced values, injected, reproduce the whole
    // settlement, so any figure short of total below is the PIN'S CONTENT and not the instrument.
    const powerControl = survivalByInjection(POWER, produced(POWER));
    const assembleControl = survivalByInjection(ASSEMBLE, produced(ASSEMBLE));
    expect(powerControl.whole, 'the instrument itself moved the settlement').toBe(powerControl.rows);
    expect(assembleControl.whole, 'the instrument itself moved the settlement').toBe(assembleControl.rows);

    // The watch list is live: every key it names is a key of the record it is read from.
    const anyRecord = plainRun(probeRow(), []).context.settlement;
    expect(WATCHED).toHaveLength(19);
    expect(WATCHED.filter((key) => Object.hasOwn(anyRecord, key))).toEqual(WATCHED);

    // (a) `generatePower`'s record-built whole-`provides` pin reproduces the settlement TOTALLY.
    const power = survivalByInjection(POWER, fromRecord(POWER));
    expect(power.whole, 'the power pin no longer reproduces the record').toBe(power.rows);
    expect(WATCHED.filter((key) => power.perKey.get(key) === power.rows)).toEqual(WATCHED);

    // (b) `assembleInstitutions`'s does not, and ONLY three watched keys survive totally. The
    // short figures themselves are RECORDED MEASUREMENT with an as-of mark and are asserted
    // nowhere: they belong to the later writers this member does not own (§11).
    const assemble = survivalByInjection(ASSEMBLE, fromRecord(ASSEMBLE));
    const total = WATCHED.filter((key) => assemble.perKey.get(key) === assemble.rows);
    expect(total).toEqual(ASSEMBLE_TOTAL);
    expect(WATCHED.filter((key) => assemble.perKey.get(key) < assemble.rows))
      .toEqual(WATCHED.filter((key) => !ASSEMBLE_TOTAL.includes(key)));
    expect(assemble.whole).toBeLessThan(assemble.rows);
  }, 300_000);

  it('A6 — the pin bag is never written through, and the uncloned control keeps that honest', () => {
    // SEALED: through the member's own consults the caller's record never moves and nothing throws.
    const memberAssemble = writeThrough(ASSEMBLE, 'member');
    const memberPower = writeThrough(POWER, 'member');
    expect([memberAssemble.mutated, memberAssemble.threw], 'a held roster was written through').toEqual([0, 0]);
    expect([memberPower.mutated, memberPower.threw], 'a held structure was written through').toEqual([0, 0]);
    // ⭐ NOT VACUOUS: every row really took the pin, and no row got the caller's object back.
    expect(memberAssemble.taken, 'the roster pin was dropped, so the zero above proves nothing')
      .toBe(memberAssemble.rows);
    expect(memberPower.taken, 'the structure pin was dropped, so the zero above proves nothing')
      .toBe(memberPower.rows);
    expect([memberAssemble.handedBackByReference, memberPower.handedBackByReference],
      'a chooser handed the caller its own object back').toEqual([0, 0]);

    // THE NEGATIVE CONTROL: the same bag, injected BY REFERENCE with no clone anywhere, is
    // written through by the later passes on most rows and refused outright on two, so the
    // member's clone can never go silently missing.
    const bareAssemble = writeThrough(ASSEMBLE, 'uncloned');
    const barePower = writeThrough(POWER, 'uncloned');
    expect(bareAssemble.mutated).toBe(52);
    expect(bareAssemble.threw).toBe(2);
    expect(bareAssemble.messages).toEqual(['Cannot add property 1, object is not extensible']);
    expect(barePower.mutated).toBe(30);
    expect(barePower.threw).toBe(0);
    expect(bareAssemble.rows).toBe(63);
  }, 300_000);

  it('A7 — the file list is two, and the three power helpers are untouched', () => {
    const roster = getStepMeta();
    expect(roster).toHaveLength(22);
    const helpers = {
      relationshipArchetypes: { computeRelTension },
      stressFactions: { applyStressEventFactions },
      rulingStructure: { generatePowerStructure, normalizeAndAnnotateFactions, renormalizeFactionPower },
    };
    const declaring = [];
    const registered = [];
    for (const [leaf, exported] of Object.entries(helpers)) {
      const source = readFileSync(resolve(POWER_DIR, `${leaf}.js`), 'utf8');
      if (source.includes('provides:')) declaring.push(leaf);
      if (roster.some((meta) => meta.name === leaf)) registered.push(leaf);
      expect(Object.values(exported).every((value) => typeof value === 'function')).toBe(true);
    }
    expect(declaring, 'a power helper declared a chooser list and is now a pinnable step').toEqual([]);
    expect(registered, 'a power helper became a registered step').toEqual([]);

    // The only door to all three is the projection the power pin short-circuits, so a pinned
    // `powerStructure` makes them unreachable. The anchor is the step that does own the door.
    const stepNames = roster.map((meta) => meta.name);
    expectAbsentWithAnchor(stepNames, 'rulingStructure', POWER, 'A7: the helper is not a step');
    const powerSource = readFileSync(
      resolve(process.cwd(), 'src', 'generators', 'steps', 'generatePower.js'), 'utf8',
    );
    expect(powerSource).toContain("import { chooseOrPin, registerStep } from '../pipeline.js';");
    const imported = [...powerSource.matchAll(/from '([^']+)';/g)].map((hit) => hit[1]);
    for (const leaf of Object.keys(helpers)) {
      expectAbsentWithAnchor(
        imported, `../power/${leaf}.js`, '../power/economyReconciliation.js',
        'A7: the helper is reached only through the projection',
      );
    }
  });
});
