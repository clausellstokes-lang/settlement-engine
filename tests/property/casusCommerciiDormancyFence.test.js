/**
 * casusCommerciiDormancyFence.test.js — TR-1's FOUR-FENCE dormancy set, plus the
 * lit-mutant control that proves the fences can see.
 *
 * `casusCommerciiEnabled` is built DARK. The claim this file has to make good is not
 * "nothing happened in a world where nothing was going to happen anyway" — that is the
 * vacuous green every dormancy pin drifts toward. It is the harder one: on the exact
 * fixtures that DO mint a commercial casus and DO reach the trade-war seam when the flag
 * is lit, the dark run writes nothing and calls nothing.
 *
 *   FENCE 1 — OWN-FOOTPRINT INVARIANT. TR-1's whole surface is one conditionally
 *     materialized sub-ledger. Dark, the world must come out of the drive IDENTICAL TO
 *     ITS OWN INPUT — a strictly better fence than a stored hash, which this estate has
 *     already watched rot into a pure false-positive generator across 162 commits. A
 *     feature that declares zero eager bytes admits an invariant no unrelated engine
 *     evolution can move and no re-record can ever be owed for.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE, over the whole projection. No
 *     fixture, so it cannot rot. Its designed blind spot is that it stays GREEN if the
 *     feature runs in BOTH configurations, which is exactly why it is never shipped alone
 *     and why the lit-mutant below expects it to pass while fences 1 and 3 red.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. A strict pass-through spy counts real invocations of
 *     the seam's evidence factory. State pins cannot see a feature that ran and happened
 *     to write nothing; this can.
 *
 *     ⚠ THE SPY SITS OUTSIDE tradeWar.js, AND THAT IS LOAD-BEARING. The recorded WR-10
 *     lesson is that wrapping a function in ITS OWN module's namespace counts ZERO when
 *     the caller invokes it intra-module, because the internal binding is the original.
 *     Here the caller (tradeWar.js) imports the factory from commercialReasons.js, so
 *     mocking that module's export really does intercept the call — the same lesson,
 *     applied the correct way round.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree: every production read of
 *     the flag is the strict `=== true` form, so ABSENT and FALSE are identical BY
 *     CONSTRUCTION at decision sites no state pin reaches. It reuses the engine-gated-key
 *     walker's own comment/string blanker rather than a second regex, so a gate written
 *     in prose cannot be miscounted as a gate.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = { pressureReads: 0 };

vi.mock('../../src/domain/worldPulse/commercialReasons.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // STRICT pass-through: rest-args in, the original's result out. Instrumenting the
    // module cannot perturb a byte of the runs the other fences measure.
    makeCommercialPressureRead: (...args) => {
      calls.pressureReads += 1;
      return actual.makeCommercialPressureRead(...args);
    },
  };
});

const { advanceCommercialReasons, COMMERCIAL_REASONS_LEDGER } = await import('../../src/domain/worldPulse/commercialReasons.js');
const { evaluateTradeWar } = await import('../../src/domain/worldPulse/tradeWar.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'casusCommerciiEnabled';

/**
 * THE ADVERSARIAL FIXTURE. A gouging entrepôt on a busy road between two trading towns —
 * a world that DOES mint `toll_extortion` the moment the flag is lit. Every dark claim
 * below is made against this, never against an empty world.
 */
function adversarialWorld() {
  const byId = new Map([
    ['a', { id: 'a', name: 'Aldenmoor', settlement: { id: 'a', name: 'Aldenmoor' } }],
    ['b', { id: 'b', name: 'Thornwall', settlement: { id: 'b', name: 'Thornwall' } }],
  ]);
  return {
    snapshot: {
      byId,
      settlements: [{ id: 'a' }, { id: 'b' }],
      relationships: [{ from: 'a', to: 'b', relationshipType: 'trade_partner' }],
      worldState: { relationshipStates: {} },
    },
    worldState: {
      spatialLedgers: {
        entrepots: { b: { centrality: 0.94, toll: 1 } },
        commodityStocks: { b: { grain: 12 } },
      },
    },
  };
}

const clone = (value) => JSON.parse(JSON.stringify(value));

/** Drive the writer once under the given rules and return the resulting world. */
function drive(rules) {
  const { snapshot, worldState } = adversarialWorld();
  const before = clone(worldState);
  const out = advanceCommercialReasons({ snapshot, worldState, tick: 17, rules });
  return { before, after: clone(out.worldState), ledger: out.ledger, crossings: out.crossings };
}

describe('TR-1 fence 1 — the own-footprint invariant on an adversarial fixture', () => {
  test('dark, the world comes out identical to its own input', () => {
    for (const rules of [undefined, {}, { [FLAG]: false }]) {
      const { before, after, ledger } = drive(rules);
      expect(after, `rules=${JSON.stringify(rules)}`).toEqual(before);
      expect(ledger).toBeNull();
      expect(after.spatialLedgers[COMMERCIAL_REASONS_LEDGER]).toBeUndefined();
    }
  });

  test('THE LIT-MUTANT CONTROL: the same fixture lit really does write', () => {
    // Without this the fence above is a claim about a fixture that could never produce.
    const { before, after, ledger, crossings } = drive({ [FLAG]: true });
    expect(after).not.toEqual(before);
    expect(ledger).toBeTruthy();
    expect(after.spatialLedgers[COMMERCIAL_REASONS_LEDGER]).toEqual(ledger);
    expect(Object.keys(ledger)).toEqual(['a>b']);
    expect(ledger['a>b'].map((row) => row.type)).toContain('toll_extortion');
    expect(crossings.map((row) => row.kind)).toContain('commercial_severance_crossing');
    // The pre-existing ledgers this fixture carries are untouched — the writer adds a
    // sub-key, it does not rewrite its neighbours.
    expect(after.spatialLedgers.entrepots).toEqual(before.spatialLedgers.entrepots);
    expect(after.spatialLedgers.commodityStocks).toEqual(before.spatialLedgers.commodityStocks);
  });
});

describe('TR-1 fence 2 — absent versus explicit false, over the whole projection', () => {
  test('the two dark spellings are indistinguishable in every observable', () => {
    // No fixture to rot: this compares two runs of the SAME drive against each other.
    const absent = drive({});
    const explicitFalse = drive({ [FLAG]: false });
    expect(explicitFalse.after).toEqual(absent.after);
    expect(explicitFalse.ledger).toEqual(absent.ledger);
    expect(explicitFalse.crossings).toEqual(absent.crossings);
    // The same equality across the trade-war seam's whole return value.
    const { snapshot, worldState } = adversarialWorld();
    const rng = { fork: () => ({ random: () => 0.5 }), random: () => 0.5 };
    const run = (rules) => JSON.stringify(evaluateTradeWar({
      snapshot, worldState, rng, tick: 6, rules: { warLayerEnabled: true, ...rules },
    }));
    expect(run({ [FLAG]: false })).toBe(run({}));
    // ⚠ ITS DESIGNED BLIND SPOT, STATED: this fence would stay green if the feature ran in
    // BOTH configurations. Fences 1 and 3 are what close that, which is why the set ships
    // together and never one at a time.
  });
});

describe('TR-1 fence 3 — call-path dormancy at the trade-war seam', () => {
  test('dark the seam factory is NEVER invoked, and lit it is', () => {
    const { snapshot, worldState } = adversarialWorld();
    const rng = { fork: () => ({ random: () => 0.5 }), random: () => 0.5 };

    calls.pressureReads = 0;
    for (const rules of [{}, { [FLAG]: false }]) {
      evaluateTradeWar({ snapshot, worldState, rng, tick: 6, rules: { warLayerEnabled: true, ...rules } });
    }
    expect(calls.pressureReads, 'the commercial read ran in a dark world').toBe(0);

    // THE CONTROL. The identical drive with the flag lit MUST reach it — otherwise the
    // zero above proves only that the spy is broken or the seam unreachable.
    evaluateTradeWar({
      snapshot, worldState, rng, tick: 6, rules: { warLayerEnabled: true, [FLAG]: true },
    });
    expect(calls.pressureReads).toBe(1);

    // And the war layer's own gate still dominates: no trade war, no commercial read,
    // however lit this flag is.
    calls.pressureReads = 0;
    evaluateTradeWar({ snapshot, worldState, rng, tick: 6, rules: { [FLAG]: true } });
    expect(calls.pressureReads).toBe(0);
  });
});

describe('TR-1 fence 4 — gate polarity and purity, censused over the real tree', () => {
  /** @param {string} dir @param {string[]} out */
  function walk(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.(js|jsx)$/.test(p)) out.push(p);
    }
    return out;
  }

  const sources = walk(join(ROOT, 'src')).map((p) => ({
    rel: relative(ROOT, p).replace(/\\/g, '/'),
    code: codeOnly(readFileSync(p, 'utf8')),
  }));

  test('every production read of the flag is the strict === true form', () => {
    /** @type {string[]} */
    const offenders = [];
    let reads = 0;
    for (const { rel, code } of sources) {
      for (const line of code.split('\n')) {
        if (!line.includes(FLAG)) continue;
        reads += 1;
        // A JSDoc-style property in a blanked-out type position is gone by now, so any
        // surviving mention is real code and must carry the strict comparison.
        if (!new RegExp(`${FLAG}\\s*===\\s*true`).test(line)) offenders.push(`${rel}: ${line.trim()}`);
      }
    }
    expect(offenders, 'a permissive or negated read of the flag exists').toEqual([]);
    // NON-VACUITY: the blanker must not have eaten every read. Two real gates exist —
    // the writer's own and the trade-war seam's.
    expect(reads, 'the flag census found no reads at all').toBeGreaterThanOrEqual(2);
  });

  test('the flag is virtual: it is absent from the rules DEFAULTS and every preset', async () => {
    const { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS, ENGINE_GATED_VIRTUAL_RULE_KEYS } =
      await import('../../src/domain/worldPulse/simulationRules.js');
    expect(FLAG in DEFAULT_SIMULATION_RULES).toBe(false);
    // SIMULATION_RULE_PRESETS is a preset-id-keyed RECORD, not an array — measured, not
    // assumed, after the first draft of this pin tried to iterate it and threw.
    const presets = Object.values(SIMULATION_RULE_PRESETS);
    expect(presets.length, 'the preset catalog emptied — this absence claim would be vacuous')
      .toBeGreaterThanOrEqual(5);
    for (const preset of presets) {
      expect(FLAG in (preset.rules || {}), `${preset.id} lit the flag`).toBe(false);
      // anchored: the presets DO carry rule keys, so the absence above is a measurement
      // rather than a lookup into an empty object.
      expect(Object.keys(preset.rules || {}).length, `${preset.id} carries no rules`)
        .toBeGreaterThan(0);
    }
    // …and it IS declared, so the census that demands its certification can see it. This
    // is the CQ5 one-commit law's other half, asserted from the dormancy side.
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(FLAG);
  });

  test('the TR-1 family is PRNG-free and clock-free', () => {
    // Zero PRNG is a charter law, not a style note: a ledger that rolled would break
    // same-seed re-derivation and with it THE PROMISE. Receipt selection is a keyed hash.
    const family = sources.filter(({ rel }) => /\/commercial[A-Z]/.test(rel));
    expect(family.length, 'the TR-1 module family emptied — re-aim this scan').toBeGreaterThanOrEqual(4);
    /** @type {string[]} */
    const impure = [];
    for (const { rel, code } of family) {
      for (const forbidden of ['Math.random', 'Date.now', 'new Date', 'performance.now']) {
        if (code.includes(forbidden)) impure.push(`${rel}: ${forbidden}`);
      }
    }
    expect(impure).toEqual([]);
    // anchored: the scan DOES find these tokens elsewhere in the tree, so an empty result
    // for this family is a property of the family and not of a broken scan.
    expect(sources.some(({ code }) => code.includes('Math.random'))).toBe(true);
  });
});
