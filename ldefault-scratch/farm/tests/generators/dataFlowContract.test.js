/**
 * dataFlowContract.test.js — A+ generators.3.
 *
 * P1.7 declared each step's WRITE set (provides/mutates/scratch) and strict mode
 * enforces it. generators.3 completes the data-flow contract by declaring each
 * step's READ set (the ctx keys it consumes that another step produces) and
 * cross-checking the hand-written run order against it:
 *
 *   - SOUNDNESS / COMPATIBILITY: every declared read is produced by an EARLIER
 *     step in getStepOrder(). So the deps-derived order can no longer drift out
 *     of sync with the real data dependencies — a step scheduled before a
 *     producer of a key it reads fails here (and at runtime under strict mode,
 *     pinned by pipelineContract.test.js).
 *   - NO PHANTOM READS: every declared read key is produced by SOME step.
 *   - The contract stays populated (guards against the reads decls silently emptying).
 *
 * SCOPE NOTE (why the run order is still derived from deps, not replaced by a
 * computed data-flow order): `economicState` is produced TWICE — generateEconomy
 * provides the provisional value generatePower needs to establish political
 * intent, then economyReconcilePass re-derives the final value consumed by
 * powerEconomyReconcilePass. A pure data-flow order ("reader after every
 * producer of K") would still force the intent-producing generatePower after
 * economyReconcilePass and cycle. So deps remains the authoritative
 * (golden-stable) order, CROSS-CHECKED by this contract.
 *
 * ── THE VERSIONED-KEY GAP, CLOSED (T7 · HYGIENE, ODQ §764.2) ────────────────
 * This note used to end "Resolving which production each reader consumes needs
 * versioned keys; until then…" — a conceded hole, and the §711.6 same-field-
 * different-meaning class living INSIDE the pipeline: a step reading the
 * provisional value where it means the reconciled one passes `reads` (the key
 * exists), passes strict mode, and the golden simply pins the wrong behaviour.
 *
 * The versioned keys now exist. `registerStep` takes `readsVersion`, every
 * reader of a RE-DERIVED key declares which production it means, and the block
 * at the bottom of this file asserts the declaration agrees with the run order.
 * The re-derived key set is COMPUTED LIVE from the registry (a key some step
 * both reads and provides), never listed here — so a new double-produced key
 * inherits the requirement automatically instead of waiting for someone to
 * remember. Zero runtime cost: the pipeline never reads the field.
 *
 * ── WHY THE CHECKS ARE FUNCTIONS AND NOT INLINE LOOPS (ODQ 764.2, lane T9) ──
 * This file was one of the five `kind:"uncovered"` rows in the mutation-coverage
 * manifest: a seam contract with nothing proving IT can red. Its subject is not
 * source text, so the house string-doctoring idiom does not reach it, and the
 * sweep's disk-mutate path is closed to build lanes (its revert is the checkout
 * family this program's shared-tree protocol forbids outright). The cure is
 * neither: each check is now a PURE FUNCTION of (order, meta), so a DOCTORED
 * COPY of the live registry can be driven through THE SAME FUNCTION the live arm
 * calls — a standing control that runs on every ordinary invocation rather than a
 * weekly one. A control that re-implements the detector proves nothing about the
 * detector, so nothing below re-implements anything.
 */
import { describe, it, expect } from 'vitest';
import '../../src/generators/generateSettlementPipeline.js'; // registers all steps
import { getStepOrder, getStepMeta } from '../../src/generators/pipeline.js';

const META = new Map(getStepMeta().map((m) => [m.name, m]));
const ORDER = getStepOrder();

/** Reads with no earlier producer, in `order`. The soundness check itself. */
const soundnessViolations = (order, meta) => {
  const producedBefore = (key, idx) => order.slice(0, idx).some((n) => {
    const m = meta.get(n);
    return m.provides.includes(key) || m.mutates.includes(key);
  });
  const violations = [];
  order.forEach((name, idx) => {
    for (const k of meta.get(name).reads) {
      if (!producedBefore(k, idx)) violations.push(`${name} reads "${k}" but no earlier step provides/mutates it`);
    }
  });
  return violations;
};

/** Declared reads no step anywhere produces. The phantom-read check itself. */
const phantomReads = (meta) => {
  const produced = new Set();
  for (const m of meta.values()) {
    m.provides.forEach((k) => produced.add(k));
    m.mutates.forEach((k) => produced.add(k));
  }
  const phantom = [];
  for (const m of meta.values()) {
    for (const k of m.reads) if (!produced.has(k)) phantom.push(`${m.name}:${k}`);
  }
  return phantom;
};

/** Steps declaring at least one read. The populated-contract check itself. */
const stepsWithReads = (order, meta) => order.filter((n) => meta.get(n).reads.length > 0);

/** Steps that read a key they also provide. The re-derivation check itself. */
const rederiversIn = (order, meta) => order.filter((n) => {
  const m = meta.get(n);
  return m.reads.some((k) => m.provides.includes(k));
}).sort();

/**
 * A copy of the live registry with ONE step's declaration patched. Deep enough
 * that the live registry — a process-wide singleton other suites share — is never
 * touched: the arrays are rebuilt, not aliased.
 */
const doctor = (name, patch) => {
  const copy = new Map();
  for (const [k, m] of META) {
    copy.set(k, {
      ...m,
      reads: [...m.reads],
      provides: [...m.provides],
      mutates: [...m.mutates],
    });
  }
  Object.assign(copy.get(name), patch);
  return copy;
};

describe('pipeline reads/produces data-flow contract (A+ generators.3)', () => {
  it('every declared read is produced by an EARLIER step (deps order respects the data graph)', () => {
    expect(soundnessViolations(ORDER, META)).toEqual([]);
  });

  it('every declared read key is produced by SOME step (no phantom reads)', () => {
    expect(phantomReads(META)).toEqual([]);
  });

  it('the reads contract is populated for every data-consuming step (not silently empty)', () => {
    // resolveConfig is the lone pure-source step (consumes only initial config);
    // every other step declares >=1 read. A drift that empties the decls fails here.
    expect(stepsWithReads(ORDER, META).length).toBe(ORDER.length - 1);
    expect(META.get('resolveConfig').reads).toEqual([]);
  });

  it('a step that reads-and-reprovides a key (re-derivation) has an earlier first producer', () => {
    // isolationPass reads `stress` then re-provides it with an appended isolation
    // famine (subsistence thorps/hamlets); stressConfirmPass reads `stress` then
    // re-provides a confirmed `stress`; economyReconcilePass reads `economicState`
    // then re-provides a re-derived one. That read∩provides overlap is a legitimate
    // re-derivation — but it must still have an EARLIER producer (covered by the
    // soundness test: resolveStress produces `stress` before both stress
    // re-derivers). Pin the known re-derivers so the pattern is documented, not
    // accidental.
    expect(rederiversIn(ORDER, META)).toEqual([
      'coherenceRepairPass',
      'economyReconcilePass',
      'isolationPass',
      'stressConfirmPass',
    ]);
  });

  // ── THE STANDING CONTROLS (ODQ 764.2) ──────────────────────────────────────
  // Four green assertions over one registry can be four assertions over an EMPTY
  // registry, or over checks whose loops no longer run. Each control drives the
  // same function its live sibling drives, over a doctored copy, and asserts the
  // conviction lands BY NAME — attribution, not just a red.
  describe('THE STANDING CONTROLS: each check is proved able to convict', () => {
    it('the registry itself is not vacuous — an empty one would pass every arm above', () => {
      expect(ORDER.length).toBeGreaterThan(10);
      expect(META.size).toBe(ORDER.length);
      // …and the checks are reading the reads they claim to read.
      expect(stepsWithReads(ORDER, META).length).toBeGreaterThan(10);
    });

    it('SOUNDNESS convicts a step scheduled before its own producer', () => {
      // Move the last step to the front: whatever it reads is now read before
      // anything produces it. This is the drift the arm exists to catch — a deps
      // order edited without re-checking the data graph.
      const moved = ORDER[ORDER.length - 1];
      const planted = [moved, ...ORDER.slice(0, -1)];
      const found = soundnessViolations(planted, META);
      expect(found.length).toBeGreaterThan(0);
      expect(found.every((v) => v.startsWith(`${moved} reads `))).toBe(true);
      // …and it DISCRIMINATES: the live order is silent.
      expect(soundnessViolations(ORDER, META)).toEqual([]);
    });

    it('NO-PHANTOM-READS convicts a read of a key no step produces', () => {
      const victim = ORDER[ORDER.length - 1];
      const planted = doctor(victim, { reads: [...META.get(victim).reads, 'aKeyNoStepProduces'] });
      expect(phantomReads(planted)).toEqual([`${victim}:aKeyNoStepProduces`]);
      expect(phantomReads(META)).toEqual([]);
    });

    it('THE POPULATED CONTRACT convicts a step whose reads were silently emptied', () => {
      const victim = ORDER[ORDER.length - 1];
      const planted = doctor(victim, { reads: [] });
      expect(stepsWithReads(ORDER, planted).length).toBe(ORDER.length - 2);
      expect(stepsWithReads(ORDER, META).length).toBe(ORDER.length - 1);
    });

    it('THE RE-DERIVER PIN convicts a fifth step quietly re-providing what it reads', () => {
      // resolveConfig is the one step with no reads, so making it re-provide is the
      // cleanest fifth re-deriver available and cannot collide with an existing one.
      const planted = doctor('resolveConfig', { reads: ['config'], provides: ['config'] });
      expect(rederiversIn(ORDER, planted)).toContain('resolveConfig');
      expect(rederiversIn(ORDER, planted)).toHaveLength(5);
      expect(rederiversIn(ORDER, META)).toHaveLength(4);
    });

    it('the doctoring never touches the live registry (the controls cannot poison a sibling suite)', () => {
      // getStepMeta() hands out the process-wide singleton other suites read.
      const victim = ORDER[ORDER.length - 1];
      const before = [...META.get(victim).reads];
      doctor(victim, { reads: ['aKeyNoStepProduces'] });
      expect(META.get(victim).reads).toEqual(before);
      expect(getStepMeta().find((m) => m.name === victim).reads).toEqual(before);
    });
  });
});

// ── THE VERSIONED-KEY CONTRACT ────────────────────────────────────────────────
// The checker is a PURE FUNCTION over (order, meta) so the real registry and a
// planted-divergence control can be driven through the SAME code. A contract
// that can only be run against reality is a contract nobody has proven can
// fail — the vacuity class this estate has convicted three times.

/**
 * @param {string[]} order
 * @param {Map<string, {name:string, reads:string[], provides:string[], mutates:string[], readsVersion:Record<string,string>}>} meta
 * @returns {{ rederived: Map<string, string[]>, violations: string[] }}
 */
export function auditVersionedReads(order, meta) {
  /** @type {Map<string, string[]>} */
  const rederived = new Map();
  for (const name of order) {
    const m = meta.get(name);
    if (!m) continue;
    for (const key of m.reads) {
      if (!m.provides.includes(key)) continue;
      if (!rederived.has(key)) rederived.set(key, []);
      /** @type {string[]} */ (rederived.get(key)).push(name);
    }
  }
  const violations = [];
  for (const [key, deriverNames] of rederived) {
    const idx = (n) => order.indexOf(n);
    const firstDeriver = Math.min(...deriverNames.map(idx));
    const lastDeriver = Math.max(...deriverNames.map(idx));
    for (const name of order) {
      const m = meta.get(name);
      if (!m || deriverNames.includes(name) || !m.reads.includes(key)) continue;
      const declared = (m.readsVersion || {})[key];
      if (!declared) {
        violations.push(`${name} reads re-derived key "${key}" without declaring readsVersion`);
        continue;
      }
      if (declared !== 'provisional' && declared !== 'reconciled') {
        violations.push(`${name}.readsVersion["${key}"] is "${declared}" — not provisional|reconciled`);
        continue;
      }
      const at = idx(name);
      if (declared === 'reconciled' && at < lastDeriver) {
        violations.push(`${name} declares "${key}" reconciled but runs at ${at}, BEFORE the last re-deriver (${lastDeriver})`);
      }
      if (declared === 'provisional' && at > firstDeriver) {
        violations.push(`${name} declares "${key}" provisional but runs at ${at}, AFTER the first re-deriver (${firstDeriver})`);
      }
    }
  }
  return { rederived, violations };
}

describe('versioned reads of re-derived keys (T7 — the SCOPE NOTE gap, closed)', () => {
  it('the re-derived key set is discovered live and is not empty', () => {
    const { rederived } = auditVersionedReads(ORDER, META);
    // economicState is the recorded instance; the others were found by the same live rule.
    expect([...rederived.keys()].sort()).toEqual(['economicState', 'isolationSupport', 'stress']);
    expect(rederived.get('economicState')).toEqual(['economyReconcilePass']);
  });

  it('every reader of a re-derived key declares WHICH production, and the order agrees', () => {
    const { violations } = auditVersionedReads(ORDER, META);
    expect(violations, 'a reader of a twice-produced ctx key either does not say which '
      + 'production it means, or says one the run order cannot give it').toEqual([]);
  });

  it('the contract is not vacuous — it convicts each way a declaration can be wrong', () => {
    // A synthetic three-step pipeline with one re-derived key, driven through the SAME checker.
    const build = (readerVersion, readerFirst = false) => {
      const order = readerFirst
        ? ['read', 'produce', 'rederive']   // the reader runs BEFORE the re-deriver
        : ['produce', 'rederive', 'read'];  // the reader runs AFTER it
      const meta = new Map([
        ['produce', { name: 'produce', reads: [], provides: ['k'], mutates: [], readsVersion: {} }],
        ['rederive', { name: 'rederive', reads: ['k'], provides: ['k'], mutates: [], readsVersion: {} }],
        ['read', { name: 'read', reads: ['k'], provides: [], mutates: [], readsVersion: readerVersion }],
      ]);
      return auditVersionedReads(order, meta);
    };
    // (a) no declaration at all
    expect(build({}).violations).toEqual([
      'read reads re-derived key "k" without declaring readsVersion',
    ]);
    // (b) a declaration outside the vocabulary
    expect(build({ k: 'final' }).violations).toEqual([
      'read.readsVersion["k"] is "final" — not provisional|reconciled',
    ]);
    // (c) THE DEFECT THE SCOPE NOTE FEARED: a reader ordered BEFORE the re-deriver that
    //     believes it is getting the reconciled value.
    expect(build({ k: 'reconciled' }, true).violations).toEqual([
      'read declares "k" reconciled but runs at 0, BEFORE the last re-deriver (2)',
    ]);
    // (d) the mirror: a reader ordered AFTER, believing it holds the provisional value.
    expect(build({ k: 'provisional' }).violations).toEqual([
      'read declares "k" provisional but runs at 2, AFTER the first re-deriver (1)',
    ]);
    // (e) …and the two correct spellings are silent.
    expect(build({ k: 'reconciled' }).violations).toEqual([]);
    expect(build({ k: 'provisional' }, true).violations).toEqual([]);
  });
});
