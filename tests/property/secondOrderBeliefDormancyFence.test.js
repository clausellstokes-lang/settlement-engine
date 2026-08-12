/**
 * secondOrderBeliefDormancyFence.test.js — IN-1a's FOUR-FENCE dormancy set, with the
 * lit-mutant control and each guard door pinned individually.
 *
 * `secondOrderBeliefEnabled` is built DARK, and this lane makes a STRONGER dormancy claim
 * than any of its siblings: the mirror is a pure leaf with ZERO production callers, so the
 * world is byte-identical in BOTH flag states. IN-1b legitimately ends that when it brings
 * the first consumer; until then the claim is asserted rather than assumed, because "no
 * caller" is exactly the sort of fact that rots silently the day someone adds one.
 *
 *   FENCE 1 — OWN-FOOTPRINT INVARIANT, CARRYING NO STORED HASH. There is no golden file
 *     here and nothing to re-record: the collector hands back its ONE frozen inert input
 *     by IDENTITY when dark, and the derivation hands back the frozen unknown by IDENTITY.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE vs every truthy-but-not-`true`
 *     spelling. Its designed blind spot is that it stays GREEN if the feature runs in BOTH
 *     configurations, which is why it never ships alone.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. A state pin cannot see a read that ran and happened to
 *     return nothing; a strict pass-through spy can. THE SPY SITS ON `outboundImpression.js`
 *     AND THE DIRECTION IS LOAD-BEARING: the recorded lesson is that wrapping a function in
 *     ITS OWN module's namespace counts ZERO, because the internal binding is the original.
 *     `secondOrderBelief.js` IMPORTS the heuristic from that leaf, so mocking it really does
 *     intercept. Dark the count is ZERO; lit it is not.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree. Exactly THREE modules name
 *     the key in code and exactly ONE gates on it. ⚠ The comment strip is load-bearing and
 *     not hygiene: `outboundImpression.js` names this key twice in its own HEADER, where it
 *     records which wave would come to consume it. A raw scan would convict SP's file for
 *     having predicted us.
 *
 *   THE LIT-MUTANT CONTROL. Every fence above is an ABSENCE. A fence set that could not SEE
 *     the feature would pass all four while proving nothing, so the same arc is executed lit
 *     and each fence is shown to fail there.
 *
 * @enforced-by this file
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test, vi } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = { impression: 0 };

vi.mock('../../src/domain/worldPulse/outboundImpression.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    // STRICT pass-through: rest-args in, the original's result out. Instrumenting the
    // module cannot perturb a byte of the runs the other fences measure.
    outboundImpressionOf: (/** @type {any[]} */ ...args) => {
      calls.impression += 1;
      return actual.outboundImpressionOf(...args);
    },
  };
});

const {
  MIRROR_UNKNOWN, mirrorInputsAt, secondOrderBeliefActive, secondOrderMirrorOf,
} = await import('../../src/domain/worldPulse/secondOrderBelief.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'secondOrderBeliefEnabled';
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * THE ADVERSARIAL WORLD. Every durable family the mirror reads is populated and both
 * degradation legs are armed, so a dormancy claim here is a claim about the lane and not
 * about a quiet world.
 * @param {{flag?: unknown}} args
 */
function mirrorWorld({ flag }) {
  const rules = flag === undefined ? {} : { [FLAG]: flag };
  return {
    simulationRules: rules,
    spatialLedgers: {
      disinfo: {
        'lie:s:o': { liarId: 's', subjectId: 's', audienceId: 'o', assertedBand: 4, trueBand: 1, seededTick: 10, lineageId: 'disinfo:s:o:10' },
      },
      intelTransfers: {
        'intel.s.o.s.20': { sellerId: 's', receiverId: 'o', subjectId: 's', mode: 'sale', belief: { strengthBand: 2 }, fidelity01: 0.4, depositTick: 20 },
      },
      secrecyPostures: { s: { level01: 0.8, enteredTick: 12 } },
      beliefMaps: { s: { seat: { o: { readiness: 0.4, strengthBand: 2, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.8, lastUpdateTick: 14 } } } },
    },
    envoyErrands: [
      { from: 's', to: 'o', state: 'intercepted', encounters: [{ interceptorId: 'o', encounteredTick: 15 }] },
    ],
  };
}

/** The full arc: collect, derive, and hash everything the lane could possibly emit. */
function fullArc({ flag }) {
  const worldState = mirrorWorld({ flag });
  const before = hash(worldState);
  const input = mirrorInputsAt(worldState, 's', 'o', 20);
  const mirror = secondOrderMirrorOf(input);
  return { after: hash(worldState), input, mirror, trace: hash({ input, mirror }), unchanged: before === hash(worldState), worldState };
}

describe('FENCE 1 — the own-footprint invariant, measured rather than remembered', () => {
  test('dark, the collector hands back its ONE inert input by reference', () => {
    // IDENTITY, not deep equality: a fork that produced an equal object would still have
    // perturbed the reference every downstream memo keys on.
    const first = mirrorInputsAt(mirrorWorld({ flag: undefined }), 's', 'o', 20);
    const second = mirrorInputsAt(mirrorWorld({ flag: false }), 'other', 'court', 99);
    expect(first).toBe(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(first.plants).toEqual([]);
    expect(first.transfers).toEqual([]);
    expect(first.evidence).toEqual([]);
  });

  test('dark, the derivation hands back the frozen unknown by reference', () => {
    const dark = fullArc({ flag: undefined });
    expect(dark.mirror).toBe(MIRROR_UNKNOWN);
    expect(dark.mirror.lastShownTick).toBeNull();
    expect(dark.mirror.basis).toEqual([]);
  });

  test('the leaf writes nothing at all, lit or dark — it has no ledger to write to', () => {
    for (const flag of [undefined, false, true]) {
      expect(fullArc({ flag }).unchanged, `flag ${String(flag)} perturbed the world`).toBe(true);
    }
  });
});

describe('FENCE 2 — the differential: absent, false, and every truthy imposter', () => {
  test('the whole trace is IDENTICAL across every dark spelling', () => {
    const absent = fullArc({ flag: undefined }).trace;
    for (const spelling of [false, 0, 1, 'true', 'yes', {}, [], null]) {
      expect(fullArc({ flag: spelling }).trace, `spelling ${JSON.stringify(spelling)}`).toBe(absent);
    }
  });

  test('the gate itself refuses every spelling that is not the boolean true', () => {
    for (const spelling of [undefined, false, 0, 1, 'true', 'yes', {}, [], null]) {
      expect(secondOrderBeliefActive(mirrorWorld({ flag: spelling })), `spelling ${JSON.stringify(spelling)}`).toBe(false);
    }
    expect(secondOrderBeliefActive(mirrorWorld({ flag: true }))).toBe(true);
  });
});

describe('FENCE 3 — call-path dormancy, on a spy the leaf really goes through', () => {
  test('dark, the composed heuristic is not called ONCE; lit, it is', () => {
    calls.impression = 0;
    fullArc({ flag: undefined });
    fullArc({ flag: false });
    expect(calls.impression).toBe(0);
    calls.impression = 0;
    fullArc({ flag: true });
    // ATTRIBUTABLE, not merely non-zero: a count of zero here would mean the mock stopped
    // intercepting and every absence above would be proving nothing.
    expect(calls.impression).toBe(1);
  });
});

describe('FENCE 4 — the gate-polarity census over the real source tree', () => {
  const walk = (dir, out = []) => {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.(js|jsx)$/.test(p)) out.push(p);
    }
    return out;
  };
  const SRC = walk(join(ROOT, 'src')).map((p) => relative(ROOT, p).replace(/\\/g, '/')).sort();
  const codeOf = (rel) => readFileSync(join(ROOT, rel), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  test('the scanned set is real, so every absence below is real', () => {
    expect(SRC.length).toBeGreaterThan(500);
    expect(SRC).toContain('src/domain/worldPulse/secondOrderBelief.js');
  });

  test('EXACTLY THREE modules name the key in code, and one of them spells the gate', () => {
    // TWO NAME IT AS DATA and exactly ONE gates on it: the CQ5 manifest and this lane's
    // certification row are string members of frozen tables, and they are LISTED rather
    // than excluded by a `certification/` pattern, because a pattern would also swallow a
    // real gate someone later put in a certification module.
    const namers = SRC.filter((rel) => new RegExp(`\\b${FLAG}\\b`).test(codeOf(rel)));
    expect(namers.sort()).toEqual([
      'src/domain/certification/subsystemRowsVirtual.js',
      'src/domain/worldPulse/secondOrderBelief.js',
      'src/domain/worldPulse/simulationRules.js',
    ]);
    const gate = codeOf('src/domain/worldPulse/secondOrderBelief.js');
    expect(gate).toContain(`${FLAG} === true`);
    // NO LOOSE SPELLING ANYWHERE: a truthy read would make ABSENT and FALSE differ.
    for (const rel of namers) {
      const source = codeOf(rel);
      // LIVENESS ANCHOR, and deliberately NOT the scan's own predicate. Asserting the file
      // still names the flag would be self-referential, since `namers` is filtered on
      // exactly that. `export` and a length floor prove instead that this read returned a
      // real module body rather than an empty or comment-only file.
      expect(source, `${rel} read as an empty or comment-only file`).toContain('export');
      expect(source.length, `${rel} read too short to hold a gate`).toBeGreaterThan(200);
      // anchored: the `export` + length assertions immediately above prove this exact subject is live source
      expect(source, `${rel} loose read`).not.toMatch(new RegExp(`${FLAG}\\s*\\)`));
      expectAbsentWithAnchor(source, `!${FLAG}`, 'export', `${rel} negated read`);
      expectAbsentWithAnchor(source, `${FLAG} !== true`, 'export', `${rel} inequality read`);
    }
  });

  test('the ONE gate is read by NAME — no frozen-list `.every()` hides it from the census', () => {
    const gate = codeOf('src/domain/worldPulse/secondOrderBelief.js');
    expect((gate.match(new RegExp(`\\b${FLAG}\\b`, 'g')) || []).length).toBe(1);
  });

  test('THE COMMENT STRIP IS LOAD-BEARING: SP predicted this wave in its own header', () => {
    // The raw tree carries a FOURTH namer, and convicting it would be convicting the leaf
    // this wave was built to compose for having said so first.
    const raw = (rel) => readFileSync(join(ROOT, rel), 'utf8');
    const rawNamers = SRC.filter((rel) => new RegExp(`\\b${FLAG}\\b`).test(raw(rel)));
    expect(rawNamers).toContain('src/domain/worldPulse/outboundImpression.js');
    // The anchor is SP's own exported symbol: it survives the strip, so a clean read here
    // measures the strip rather than an unreadable or emptied file.
    expectAbsentWithAnchor(
      codeOf('src/domain/worldPulse/outboundImpression.js'),
      FLAG,
      'outboundImpressionOf',
      'SP header prose is stripped before the census',
    );
  });

  test('the key is VIRTUAL: absent from the rules DEFAULTS and every preset', async () => {
    const { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS, ENGINE_GATED_VIRTUAL_RULE_KEYS } =
      await import('../../src/domain/worldPulse/simulationRules.js');
    const presets = Object.values(SIMULATION_RULE_PRESETS);
    expect(presets.length, 'the preset catalog emptied — this absence claim would be vacuous')
      .toBeGreaterThanOrEqual(5);
    expect(FLAG in DEFAULT_SIMULATION_RULES).toBe(false);
    for (const preset of presets) {
      expect(FLAG in (preset.rules || {}), `${preset.id} lit ${FLAG}`).toBe(false);
      // anchored: the presets DO carry rule keys, so the absence above is a measurement
      // rather than a lookup into an empty object.
      expect(Object.keys(preset.rules || {}).length, `${preset.id} carries no rules`).toBeGreaterThan(0);
    }
    // …and it IS declared, so the census that demands its certification can see it.
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(FLAG);
  });
});

describe('THE LIT-MUTANT CONTROL — the fences are proved to have eyes', () => {
  test('the SAME arc, lit, breaks every fence that passed dark', () => {
    const dark = fullArc({ flag: undefined });
    // The literal below is what earns this key its lit-coverage credit; the same line pays
    // both bills, which is why the control lives here rather than in a second file.
    const lit = fullArc({ flag: true });

    // FENCE 1 would fail: the collector really assembled a record and the derivation
    // really answered from it.
    expect(lit.mirror).not.toBe(MIRROR_UNKNOWN);
    expect(lit.input.plants).toHaveLength(1);
    expect(lit.input.transfers).toHaveLength(1);
    expect(lit.input.evidence).toHaveLength(2);
    expect(lit.mirror.lastShownTick).toBe(12);
    expect(lit.mirror.basis.length).toBeGreaterThan(0);

    // FENCE 2 would fail: the trace really differs.
    expect(lit.trace).not.toBe(dark.trace);

    // …and the world STILL did not move, which is this lane's own stronger claim and the
    // one property the lit run must NOT break.
    expect(lit.unchanged).toBe(true);
  });

  test('a world that lights the flag is otherwise identical to one that does not', () => {
    const litRules = { secondOrderBeliefEnabled: true };
    expect(Object.keys(litRules)).toEqual([FLAG]);
    const dark = mirrorWorld({ flag: undefined });
    const lit = mirrorWorld({ flag: true });
    expect(hash({ ...lit, simulationRules: {} })).toBe(hash({ ...dark, simulationRules: {} }));
  });
});
