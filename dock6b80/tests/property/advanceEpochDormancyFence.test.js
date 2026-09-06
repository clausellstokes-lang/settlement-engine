/**
 * advanceEpochDormancyFence.test.js — EP-1's FIVE-fence dormancy set, plus the
 * lit-mutant control that proves the fences can see.
 *
 * `advanceEpochEnabled` is built DARK, and its dark claim is the hardest one in this
 * estate: TR-1 earned byte identity by keeping draw COUNTS equal while a value moved;
 * this seam changes the stream IDENTITY STRING itself. So dark identity is earned BY
 * CONSTRUCTION here, never by a parity argument, and every fence below asserts a named
 * link of the invariant chain rather than asserting "dark is identical" as a mood.
 *
 *   (L1) DARK ⇒ `epochTerm` IS null. TWO gates make it so and BOTH are required: the
 *        store mint is gated so no value comes into existence dark, and the kernel
 *        re-reads the flag beside the value so a value that outlived a flag flip on the
 *        PERSISTED pause cursor cannot be used.
 *   (L2) `epochTerm === null` ⇒ every flag-driven materialization vanishes. At EP-1
 *        there is exactly ONE — M1, the `epoch` key on the pulse record. (M2, the
 *        paused-advance cursor, lands at EP-2; M3, the ledger stamp, at EP-3. Neither
 *        exists in this tree, and this file asserts what exists rather than what is
 *        planned — see THE SCOPE NOTE below.)
 *   (L3) the materializations vanishing ⇒ THE SERIALIZED KEY SET IS UNCHANGED. This is
 *        the link a stream-only fence cannot see, and it is the one that catches a
 *        materialization keyed on the raw threaded value instead of the gated term.
 *   (L4) `epochSuffix(null) === ''` and `${x}${''} === x` ⇒ THE STREAM IDENTITY STRING
 *        IS CHARACTER-FOR-CHARACTER TODAY'S, per advance path.
 *   (L5) L3 ∧ L4 ⇒ byte-identical.
 *
 * THE FIVE FENCES.
 *   FENCE 1 — OWN-FOOTPRINT, over FOUR rule configurations and BOTH value states (an
 *     EIGHT-cell grid). The second column is the cell a mint-only gate leaves open: a
 *     REAL epoch value arriving at a flag-dark kernel. Without it the fence proves only
 *     what the absent value already made true, and L1's second gate is untested.
 *   FENCE 2 — DIFFERENTIAL, absent vs explicit false, over the whole projection. Its
 *     blind spot is stated: it stays green if the feature ran in BOTH configurations,
 *     which is exactly what fence 1's literal-string arm catches.
 *   FENCE 3 — CALL-PATH, respelled for this seam (see THE FENCE-3 RESPELLING below).
 *   FENCE 4 — GATE-POLARITY CENSUS over the real src tree, with the INVERTED purity arm.
 *   FENCE 5 — the flag-dark/value-present cell driven down the MULTI-TICK COMPOSED PATH,
 *     which is the path `advanceMultiTick` makes default-ON.
 *
 * ⚠ THE SCOPE NOTE, stated rather than glossed. The volume specifies fence 5 as the
 * end-to-end STORE flag-flip: pause a lit advance, round-trip the campaign, flip the rule
 * dark, resume. That path depends on the cursor carrying `advanceEpoch` — materialization
 * M2 — and on `runResolveIntervalMajors` re-threading it. NEITHER EXISTS AT EP-1: both are
 * EP-2's, by the compile's own member split. A fence written here over that path would
 * drive a world in which the epoch CANNOT reach the resume, and would pass because nothing
 * rendered — the rendered-surface-negative vacuity class, which this estate has spent the
 * quarter killing. So fence 5 asserts the half that is REACHABLE at this member — the
 * kernel's flag re-read against a real value, on the composed path — and the store half is
 * recorded as OWED BY EP-2 in the packet, where the cursor field it needs is minted.
 *
 * ⚠ THE FENCE-3 RESPELLING, and it is a correction rather than a weakening. Every other
 * fence 3 in this estate counts invocations and expects ZERO dark: those seams are behind
 * a branch. This one is not. The kernel composes `${…}${epochSuffix(epochTerm)}`
 * UNCONDITIONALLY, because a branch would have cost a line in a file banked at tolerance
 * zero in both directions. `epochSuffix` therefore runs on EVERY tick in EVERY flag state
 * BY DESIGN, and a fence asserting zero dark invocations WOULD RED A CORRECT BUILD. The
 * honest call-path claim is the one asserted below: every dark invocation is handed `null`
 * and returns the EMPTY STRING, so the call is real and its contribution is nothing.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

/** The recorders. Hoisted, because vi.mock factories hoist above the imports. */
const spy = {
  /** @type {string[]} every seed handed to createPRNG, in composition order. */
  roots: [],
  /** @type {Array<{ arg: unknown, out: string }>} every epochSuffix call. */
  suffixCalls: [],
};
const resetSpy = () => { spy.roots = []; spy.suffixCalls = []; };

// THE SPY SITS OUTSIDE pulseKernel.js, AND THAT IS LOAD-BEARING. The recorded WR-10
// lesson is that wrapping a function in its OWN module's namespace counts ZERO when the
// caller invokes it intra-module, because the internal binding stays the original. Here
// the caller (pulseKernel.js) IMPORTS both symbols from src/kernel/prng.js, so mocking
// that module's exports really does intercept — the same lesson, applied the right way
// round, and a second reason the segment's home is the prng module rather than the kernel.
vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // STRICT pass-through, both of them: rest-args in, the original's result out.
    // Instrumenting cannot perturb a byte of the runs the other fences measure.
    createPRNG: (...args) => {
      spy.roots.push(String(args[0]));
      return actual.createPRNG(...args);
    },
    epochSuffix: (...args) => {
      const out = actual.epochSuffix(...args);
      spy.suffixCalls.push({ arg: args[0], out });
      return out;
    },
  };
});

const { simulateCampaignWorldPulse } = await import('../../src/domain/worldPulse/pulseKernel.js');
const { simulateCampaignWorldInterval } = await import('../../src/domain/worldPulse/advanceInterval.js');
const { ensureRegionalGraph } = await import('../../src/domain/region/index.js');
const { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS, ENGINE_GATED_VIRTUAL_RULE_KEYS } =
  await import('../../src/domain/worldPulse/simulationRules.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'advanceEpochEnabled';
const NOW = '2026-01-01T00:00:00.000Z';

/** The fixture's frozen coordinates. Every literal below is derived from these BY HAND. */
const SEED = 'ep-fence';
const START_TICK = 1;
const EPOCH = 'ep-nonce-7';

/**
 * THE LITERALS ARE HARD-CODED, NEVER RECOMPUTED FROM THE SAME TOKENS. A pin that rebuilds
 * the expectation with the template it is testing is a mirror of the deriver and passes
 * through any change made to both — the analytic-pin mirror rule.
 *
 * `::tick:` carries START_TICK + 1 because the kernel composes the seed for the tick it is
 * ABOUT to run. `one_week` is not a typo on the composed path: `simulateCampaignWorldInterval`
 * builds every interior tick with the LITERAL `interval: 'one_week'` regardless of the DM's
 * chosen interval, which is why §2.4's dark-identity claim is made PER PATH and never across.
 */
const DARK_MONTH = 'ep-fence::tick:2::one_month';
const LIT_MONTH = 'ep-fence::tick:2::one_month::epoch:ep-nonce-7';
const DARK_WEEK_FIRST = 'ep-fence::tick:2::one_week';

/** The FOUR rule configurations, and each is a distinct way of being dark. */
const DARK_CONFIGS = Object.freeze([
  ['absent', undefined],
  ['empty', {}],
  ['explicit false', { [FLAG]: false }],
  // DARK-NEVER-PERMISSIVE: the string 'true' is truthy in JS and is NOT `=== true`. A gate
  // spelled with a loose check would light here, which is the whole reason the L2 shape
  // mandates the strict form.
  ['truthy non-boolean', { [FLAG]: 'true' }],
]);

const deity = (ref, name, align, law) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: 'major' });
const PATRON = deity('custom:ep_dawn', 'Dawnfather', 'good', 'lawful');
const PLAIN = deity('custom:ep_still', 'The Still', 'neutral', 'neutral');

function epSettlement(name, patron, storageMonths, deficitPct) {
  return {
    name, tier: 'town', population: 1600,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 20,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
      economicBase: 'agrarian',
    },
    institutions: [],
    economicState: {
      primaryExports: ['Bulk grain and foodstuffs'], primaryImports: [],
      economicBase: 'agrarian',
      foodSecurity: {
        storageMonths, deficitPct, surplusPct: 0,
        foodRatio: deficitPct > 0 ? 0.6 : 1.2, importDependency: 0.2, resilienceScore: 55,
      },
    },
    powerStructure: {
      publicLegitimacy: { score: 44, label: 'Contested' },
      factions: [{ faction: 'Landed Gentry', category: 'noble', power: 60 }],
      conflicts: [],
    },
    npcs: [{ id: `steward_${name}`, name: `Steward ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

const epSave = (id, name, patron, storage, deficit) => ({
  id, name, phase: 'canon', settlement: epSettlement(name, patron, storage, deficit),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

/**
 * THE ADVERSARIAL FIXTURE — a famine world under real stress, whose pulse genuinely
 * produces (candidates, rolls and news) on every tick. Every dark claim below is made
 * against this, never against an empty world where nothing was going to happen anyway.
 * THE LIT-MUTANT CONTROL at the bottom is what proves it really produces.
 */
/**
 * ⚠ THE GRAPH IS BUILT ONCE AND DEEP-CLONED PER FIXTURE, and that is load-bearing rather
 * than tidy. `ensureRegionalGraph` stamps each edge with a WALL-CLOCK `updatedAt`, so
 * building it per call makes two otherwise-identical worlds differ by a few milliseconds
 * — a pre-existing fixture non-determinism that has nothing to do with this member, and
 * that would have forced fence 2 to strip fields until it could no longer see anything.
 * Cloning one graph removes the noise at its source instead of masking it downstream.
 */
const BASE_GRAPH = ensureRegionalGraph({
  edges: [
    { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
    { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'trade_partner' },
  ],
});

function makeCampaignAndSaves(rules) {
  const saves = [
    epSave('a', 'Ashford', PATRON, 8, 0),
    epSave('b', 'Briarwatch', PLAIN, 0.4, 55),
    epSave('c', 'Crownhold', PLAIN, 5, 0),
  ];
  const campaign = {
    id: 'ep-fence-campaign', name: 'Epoch Fence', settlementIds: ['a', 'b', 'c'],
    worldState: {
      rngSeed: SEED, tick: START_TICK,
      ...(rules === undefined ? {} : { simulationRules: rules }),
      calendar: { elapsedWeeks: 30 },
      stressors: [
        { id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 3 },
      ],
    },
    regionalGraph: JSON.parse(JSON.stringify(BASE_GRAPH)),
    wizardNews: { currentTick: START_TICK, entries: [] },
  };
  return { campaign, saves };
}

/**
 * Drive ONE single-tick kernel pass. `advanceEpoch` is passed through verbatim, including
 * `null`, so the caller controls the value column of the grid explicitly.
 */
function driveSingleTick(rules, advanceEpoch) {
  resetSpy();
  const { campaign, saves } = makeCampaignAndSaves(rules);
  const result = simulateCampaignWorldPulse({
    campaign, saves, interval: 'one_month', now: NOW, advanceEpoch,
  });
  const history = result.worldState?.pulseHistory || [];
  return {
    result,
    record: history[history.length - 1] || null,
    roots: [...spy.roots],
    suffixCalls: [...spy.suffixCalls],
  };
}

/**
 * The comparable projection: the world plus the tick's public surfaces, oracle-normalized.
 *
 * ⚠ `worldState.simulationRules` IS EXCLUDED, and the exclusion is narrow and reasoned.
 * The kernel echoes its normalized rules back onto the world it returns, so that key is a
 * copy of the fence's own INPUT — and fence 2's two cells vary exactly that input (absent
 * vs explicit false). Including it would ask the fence to prove `false === undefined`,
 * which is false, instead of proving that the two configurations produce the same WORLD.
 * Nothing else is stripped: every other key the seam could touch stays in the comparison.
 */
const projectionOf = (result) => normalizeForDormancy({
  worldState: { ...result.worldState, simulationRules: undefined },
  candidates: result.candidates,
  selected: result.selected,
  autoApplied: result.autoApplied,
  proposals: result.proposals,
  rollExplanations: result.rollExplanations,
  regionalGraph: result.regionalGraph,
});

// ── FENCE 1 ──────────────────────────────────────────────────────────────────────────
describe('EP-1 fence 1 — the own-footprint grid: FOUR dark configurations, BOTH value states', () => {
  test('L4: all eight dark cells compose the LITERAL legacy seed', () => {
    /** @type {string[]} */
    const composed = [];
    for (const [label, rules] of DARK_CONFIGS) {
      // seed-loop: collected — this loop walks CONFIGURATIONS, not seeds, and it collects
      // every cell's composed root into `composed` before asserting once below, so a
      // failure in cell 1 does not hide cells 2..8. The truthfulness the collector helper
      // exists to buy is bought here by construction.
      for (const value of [null, EPOCH]) {
        const { roots } = driveSingleTick(rules, value);
        composed.push(`${label}/${value === null ? 'no value' : 'value present'}: ${roots[0]}`);
      }
    }
    expect(composed).toEqual([
      'absent/no value: ep-fence::tick:2::one_month',
      'absent/value present: ep-fence::tick:2::one_month',
      'empty/no value: ep-fence::tick:2::one_month',
      'empty/value present: ep-fence::tick:2::one_month',
      'explicit false/no value: ep-fence::tick:2::one_month',
      'explicit false/value present: ep-fence::tick:2::one_month',
      'truthy non-boolean/no value: ep-fence::tick:2::one_month',
      'truthy non-boolean/value present: ep-fence::tick:2::one_month',
    ]);
  });

  test('L1 + L3: the VALUE-PRESENT column changes no serialized key on the record', () => {
    /** @type {string[]} */
    const mismatches = [];
    for (const [label, rules] of DARK_CONFIGS) {
      // seed-loop: collected — configurations again, and every cell's verdict is pushed
      // rather than thrown, so the report names ALL offending configurations at once.
      const absent = driveSingleTick(rules, null);
      const present = driveSingleTick(rules, EPOCH);
      const keysAbsent = Object.keys(absent.record || {}).sort();
      const keysPresent = Object.keys(present.record || {}).sort();
      if (JSON.stringify(keysAbsent) !== JSON.stringify(keysPresent)) {
        mismatches.push(`${label}: ${keysPresent.filter((k) => !keysAbsent.includes(k)).join(',')}`);
      }
      if (keysPresent.includes('epoch')) mismatches.push(`${label}: an \`epoch\` key reached a DARK record`);
    }
    expect(mismatches).toEqual([]);
  });

  test('the record is a real, populated subject — the non-vacuity floor both arms above stand on', () => {
    const { record } = driveSingleTick(undefined, null);
    expect(record).toBeTruthy();
    // Without this, a kernel that stopped writing pulse history at all would make the key
    // comparison above a comparison of two empty lists, and it would pass forever.
    expect(Object.keys(record).length).toBeGreaterThan(8);
    expect(record.createdAt).toBe(NOW);
  });
});

// ── FENCE 2 ──────────────────────────────────────────────────────────────────────────
describe('EP-1 fence 2 — the differential: absent vs explicit false, whole projection', () => {
  test('the two dark configurations produce the identical projection', () => {
    // NO FIXTURE-SPECIFIC EXPECTATION, so this fence cannot rot. ⚠ ITS BLIND SPOT, stated
    // rather than discovered: it stays GREEN if the feature ran in BOTH configurations.
    // That is precisely what fence 1's literal-string arm catches, and it is why this
    // fence is never shipped alone.
    const absent = driveSingleTick(undefined, null);
    const explicitFalse = driveSingleTick({ [FLAG]: false }, null);
    expect(projectionOf(explicitFalse.result)).toEqual(projectionOf(absent.result));
  });
});

// ── FENCE 3 ──────────────────────────────────────────────────────────────────────────
describe('EP-1 fence 3 — the call path: the segment runs dark, and contributes nothing', () => {
  test('every dark invocation is handed null and returns the empty string', () => {
    const { suffixCalls } = driveSingleTick({ [FLAG]: false }, EPOCH);
    // THE CALL REALLY HAPPENS — the seam is unconditional by design (see the header), so a
    // zero here would mean the spy missed it, not that the seam was dormant.
    expect(suffixCalls.length).toBeGreaterThanOrEqual(1);
    expect(suffixCalls.map((call) => call.out)).toEqual(suffixCalls.map(() => ''));
    expect(suffixCalls.map((call) => call.arg)).toEqual(suffixCalls.map(() => null));
  });

  test('the spy really intercepts — the LIT run proves the interception is not a no-op', () => {
    // A pass-through spy that failed to bind would record nothing and every assertion
    // above would be about an empty list. This is the discrimination half.
    const { suffixCalls } = driveSingleTick({ [FLAG]: true }, EPOCH);
    expect(suffixCalls.length).toBeGreaterThanOrEqual(1);
    expect(suffixCalls[0].arg).toBe(EPOCH);
    expect(suffixCalls[0].out).toBe('::epoch:ep-nonce-7');
  });
});

// ── FENCE 4 ──────────────────────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));

describe('EP-1 fence 4 — the gate-polarity census over the real source tree', () => {
  test('every production read of the flag is the strict === true form', () => {
    // `codeOnly` is the engine-gated walker's OWN blanker, imported rather than
    // re-implemented: a second regex is a second thing to drift, and a gate written in
    // prose must not be miscountable as a gate.
    const strict = [];
    const loose = [];
    for (const { rel, src } of SRC_FILES) {
      const code = codeOnly(src);
      if (!code.includes(FLAG)) continue;
      for (const line of code.split('\n')) {
        if (!line.includes(FLAG)) continue;
        if (new RegExp(`\\b(?:rules|simulationRules)\\s*\\)?\\s*\\??\\.\\s*${FLAG}\\s*===\\s*true`).test(line)) {
          strict.push(rel);
        } else if (!/ENGINE_GATED_VIRTUAL_RULE_KEYS|'advanceEpochEnabled'|"advanceEpochEnabled"/.test(line)) {
          loose.push(`${rel}: ${line.trim()}`);
        }
      }
    }
    expect(loose).toEqual([]);
    // THE NON-VACUITY FLOOR: the store mint and the kernel re-read. Both are required by
    // the invariant chain's L1, so a floor of two is the contract, not a guess.
    expect(strict.length).toBeGreaterThanOrEqual(2);
    expect([...new Set(strict)].sort()).toEqual([
      'src/domain/worldPulse/pulseKernel.js',
      'src/store/campaignAdvanceSession.js',
    ]);
  });

  test('VIRTUALITY: the key is absent from the defaults and from every preset', () => {
    expect(Object.keys(DEFAULT_SIMULATION_RULES).includes(FLAG)).toBe(false);
    // SIMULATION_RULE_PRESETS is a RECORD, not an array — a `.some()` over it would
    // iterate nothing and pass vacuously.
    const presetNames = Object.keys(SIMULATION_RULE_PRESETS);
    expect(presetNames.length).toBeGreaterThan(0);
    const declaring = presetNames.filter((name) => Object.keys(SIMULATION_RULE_PRESETS[name] || {}).includes(FLAG));
    expect(declaring).toEqual([]);
  });

  test('MANIFEST MEMBERSHIP: the key is engine-gated and censusable', () => {
    // anchored: the length floor on the line below proves the manifest is a populated list, so this membership is a real find rather than a search of nothing
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS.length).toBeGreaterThan(20);
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(FLAG);
  });

  test('§2.4: the two advance paths compose DIFFERENT interval terms, and EP hides nothing about it', () => {
    // `advanceMultiTick` is a REAL default-ON flag that ALREADY forks the pulse stream
    // identity: the composed path builds every interior tick with the LITERAL 'one_week'
    // while the single-tick path passes the DM's own interval. A dark-state fence that
    // left this unpinned would compare two different streams and greenwash. EP absorbs,
    // normalizes and hides nothing about that pre-existing fork.
    const single = driveSingleTick(undefined, null);
    expect(single.roots[0]).toBe(DARK_MONTH);
    expect(DARK_WEEK_FIRST).not.toBe(DARK_MONTH);
  });

  test('THE PURITY ARM INVERTS: confinement, not absence', () => {
    // Every other fence 4 in this estate asserts its family calls no Math.random /
    // Date.now / new Date. THIS PROGRAM'S MINT SITE EXISTS TO CALL generateSeed(), which
    // is built from both. The honest claim is CONFINEMENT: exactly one entropy call site,
    // in src/store — never in src/domain, where eslint already forbids it, so the fence is
    // a second lock — and the entropy reached through generateSeed rather than a
    // hand-rolled Math.random.
    const mintSites = SRC_FILES
      .filter(({ src }) => codeOnly(src).includes('generateSeed()'))
      .filter(({ src }) => codeOnly(src).includes(FLAG))
      .map(({ rel }) => rel);
    expect(mintSites).toEqual(['src/store/campaignAdvanceSession.js']);
    // THE DOMAIN HALF IS PROVABLY PURE: the two domain files this member touches reach no
    // entropy primitive at all. A planted positive control follows, so a broken scan
    // cannot pass this by matching nothing.
    const domainHalf = ['src/domain/worldPulse/pulseKernel.js', 'src/domain/clock.js', 'src/kernel/prng.js'];
    const impure = domainHalf.filter((rel) => {
      if (rel === 'src/kernel/prng.js') return false; // the sanctioned entropy home itself
      const file = SRC_FILES.find((entry) => entry.rel === rel);
      return /\bMath\.random\s*\(/.test(codeOnly(file.src));
    });
    expect(impure).toEqual([]);
    // THE PLANTED POSITIVE CONTROL: the detector fires on the banned shape, so the empty
    // list above is a measurement rather than a broken regex.
    expect(/\bMath\.random\s*\(/.test(codeOnly('const x = Math.random();'))).toBe(true);
    expect(/\bMath\.random\s*\(/.test(codeOnly('// a comment mentioning Math.random()'))).toBe(false);
  });
});

// ── FENCE 5 ──────────────────────────────────────────────────────────────────────────
describe('EP-1 fence 5 — the flag-dark / value-present cell on the COMPOSED path', () => {
  test('L1 + L4: a real epoch reaching a flag-dark composed advance composes the legacy per-tick seeds', async () => {
    resetSpy();
    const { campaign, saves } = makeCampaignAndSaves({ [FLAG]: false });
    await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_month', now: NOW, autoResolve: true, advanceEpoch: EPOCH,
    });
    const roots = [...spy.roots];
    expect(roots.length).toBeGreaterThan(1);
    expect(roots[0]).toBe(DARK_WEEK_FIRST);
    // EVERY composed tick, not merely the first: the epoch rides `tickArgs` once for the
    // whole advance, so a flag read that leaked on any interior tick would show here.
    expect(roots.filter((root) => root.includes('::epoch:'))).toEqual([]);
  });

  test('L3: no record written by that composed advance carries an epoch key', async () => {
    const { campaign, saves } = makeCampaignAndSaves({ [FLAG]: false });
    const result = await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_month', now: NOW, autoResolve: true, advanceEpoch: EPOCH,
    });
    const history = result.worldState?.pulseHistory || [];
    expect(history.length).toBeGreaterThan(0);
    expect(history.filter((record) => Object.keys(record).includes('epoch'))).toEqual([]);
  });

  test('THE STRUCTURAL GUARD: a LIT advance with no threaded epoch throws rather than composing dark', () => {
    // The sharpest failure mode this member has is NOT a crash: a lit advance whose caller
    // forgot to thread the value composes the DARK seed and silently replays the pre-wave
    // future while the world believes it entered a new epoch. Nothing else in the estate
    // would notice. In NODE_ENV==='test' that is now impossible.
    const { campaign, saves } = makeCampaignAndSaves({ [FLAG]: true });
    expect(() => simulateCampaignWorldPulse({
      campaign, saves, interval: 'one_month', now: NOW, advanceEpoch: null,
    })).toThrow(/advanceEpochEnabled strictly true and no threaded/);
  });
});

// ── THE LIT-MUTANT CONTROL ───────────────────────────────────────────────────────────
describe('EP-1 THE LIT-MUTANT CONTROL — the fixture really produces', () => {
  test('lit, the same fixture composes a DIFFERENT seed and draws a DIFFERENT world', () => {
    // Without this every fence above is a claim about a fixture that could never produce.
    const dark = driveSingleTick(undefined, null);
    const lit = driveSingleTick({ [FLAG]: true }, EPOCH);
    expect(dark.roots[0]).toBe(DARK_MONTH);
    expect(lit.roots[0]).toBe(LIT_MONTH);
    // The stream really moved the world, not merely the string.
    expect(projectionOf(lit.result)).not.toEqual(projectionOf(dark.result));
  });

  test('M1: the epoch field really appears, and its neighbours are untouched', () => {
    const dark = driveSingleTick(undefined, null);
    const lit = driveSingleTick({ [FLAG]: true }, EPOCH);
    expect(lit.record.epoch).toBe(EPOCH);
    expect(Object.keys(dark.record).includes('epoch')).toBe(false);
    // The conditional spread lands the key and nothing else: the record's key set gains
    // EXACTLY `epoch` and loses none of its own.
    const gained = Object.keys(lit.record).filter((key) => !Object.keys(dark.record).includes(key));
    const lost = Object.keys(dark.record).filter((key) => !Object.keys(lit.record).includes(key));
    expect(gained).toEqual(['epoch']);
    expect(lost).toEqual([]);
    // NEIGHBOURING FIELDS BY NAME, because a key-set comparison would not notice a
    // neighbour whose VALUE the spread corrupted.
    expect(lit.record.createdAt).toBe(dark.record.createdAt);
    expect(lit.record.committed).toBe(dark.record.committed);
    expect(lit.record.interval).toBe(dark.record.interval);
  });

  test('the fixture is genuinely adversarial: the dark pulse itself does real work', () => {
    // A world where nothing happens would make "a different stream draws a different
    // world" unprovable, and every dark fence above vacuous.
    const dark = driveSingleTick(undefined, null);
    expect(dark.result.rollExplanations.length + dark.result.candidates.length).toBeGreaterThan(0);
  });
});
