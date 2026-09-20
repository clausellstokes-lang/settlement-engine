/**
 * seam.mjs — THE WHOLE §22 SEAM, prototyped in scratch. No tree edit anywhere.
 *
 * §22 ruling 1 "HELD FACTS ARE FINAL": every WRITER of a held key consults the pin FIRST and,
 * when the key is held, leaves the key as it is. Three override mechanisms stand in for the
 * three kinds of writer P1 measured:
 *
 *   (i)  the runner's own pin channel (`options.pins`) — the ONE consult that exists in the
 *        tree today, `generatePopulation`'s `chooseOrPin`. It SKIPS the draw (315 → 0).
 *   (ii) an `onStep` restore after every STEP-level writer of a held key (institutions'
 *        six writers, `corruptionPass`, the power passes). This is a CONSUME stand-in: the
 *        step runs, spends its draws, and its write is overwritten. The real implementation
 *        would SKIP; §7 of the report prices the difference.
 *   (iii) `__FN_OVERRIDE__` on every FUNCTION-level writer inside `assembleSettlement`
 *        (P1.D's list), which is where the record's rosters are actually made.
 *
 * Ruling 4's pin-aware invariants and ruling 6's `structuredClone` on entry are here too.
 */
import { instrumentedRoot, runHeadless, getStepOrder, getStepMeta, TREE } from './instrument.mjs';
import { clone } from './lib.mjs';

const { fingerprintPowerEconomyInput } = await import(`${TREE}/src/generators/power/economyReconciliation.js`);

export const HELD_KEYS = ['institutions', 'npcs', 'factions', 'relationships', 'conflicts', 'powerStructure', 'name'];
/** `generatePopulation`'s four choosers — the only keys with a real pin consult in the tree. */
export const CHOOSERS = ['npcs', 'relationships', 'factions', 'conflicts'];

const META = getStepMeta();
const ORDER = getStepOrder();
/** Every step that PROVIDES or MUTATES a held ctx key (P1.A, confirmed by P1.B/P1.C). */
export const WRITER_STEPS = Object.fromEntries(
  ['institutions', 'npcs', 'factions', 'relationships', 'conflicts', 'powerStructure'].map(k => [k,
    ORDER.filter(s => s !== 'assembleSettlement')
      .filter(s => { const m = META.find(x => x.name === s); return (m.provides || []).includes(k) || (m.mutates || []).includes(k); })]),
);

/** The trace entries a step emitted, keyed by `entry.step`. */
export const traceStepsOf = (trace) => [...new Set((trace || []).map(t => t.step))];

/**
 * Re-derive a settlement with a held bag.
 *
 * @param {object} row  the generation config (`config′` — a world-fact edit is applied here)
 * @param {object} held the held bag: any subset of HELD_KEYS
 * @param {object} [opts]
 *   nameMode: 'skip' (ruling 1 literal — the mint never runs) | 'consume' (the mint runs and
 *             its result is discarded) | 'free' (the name is not held)
 *   relink:   false (ruling 1 literal — `factions` is final, `relinkFactionMembers` is skipped)
 *             | true (the member mirror is re-linked to the held roster)
 *   pinAwareAsserts: true (ruling 4) | false (the invariants stay as the tree has them)
 *   holdPower: true (ruling 1: the replay leaves a held power structure alone)
 *   tracePartition: null | { record } — ruling 8: a held step's recorded entries are carried
 *   onStepExtra: an extra onStep hook
 */
export function rederive(row, held, opts = {}) { return rederiveFull(row, held, opts).settlement; }

/** As `rederive`, but returns the whole ctx (so the receipt's inputs are reachable), and
 *  accepts `rootOpts` (the instrument's `perturbStep`) — RECON-3's extension. */
export function rederiveFull(row, held, opts = {}) {
  const {
    nameMode = 'skip', relink = false, pinAwareAsserts = true, holdPower = true,
    tracePartition = null, onStepExtra = null, heldStepsForTrace = null,
  } = opts;
  // ── ruling 6: pins are deep-cloned on entry, always.
  const H = structuredClone(held);
  const has = (k) => H[k] !== undefined && H[k] !== null;

  const ov = {};
  // ── the roster is final INSIDE the enrichment (the one seam measured to reproduce 63/63).
  if (has('npcs')) ov.enrichNpcCoherence = () => clone(H.npcs);
  // ── `factions` is a held key, so `relinkFactionMembers` is one of its writers.
  if (has('factions')) ov.relinkFactionMembers = (args, orig) => (relink ? orig(args[0], args[1]) : clone(H.factions));
  // ── the faction→NPC structural coupling writes npcs AND factions.
  if (has('npcs') || has('factions')) ov.ensureFactionStructuralNpcs = () => ({});
  // ── the density law's resize REPLACES powerStructure.
  if (has('powerStructure') && holdPower) ov.resizePoliticalRoster = (args) => ({ powerStructure: args[0].powerStructure, plan: null });
  // ── the power REPLAY: a held power structure is final, so the replay is not run and the
  //    identity assertion has nothing to compare (ruling 1 + ruling 5, no schema change).
  if (has('powerStructure') && holdPower) {
    ov.reconcilePowerStructure = (args) => ({
      beforeFactions: (args[0]?.factions || []).map(f => ({ ...f })),
      afterFactions: args[0]?.factions || [],
    });
  }
  // ── ruling 4: under held mode the freshness fingerprint is REFRESHED from the current
  //    readings; it is a derived receipt, not a held fact.
  if (has('powerStructure') && pinAwareAsserts) {
    ov.assertPowerEconomyFreshness = (args) => {
      const [ps, es, tier] = args;
      if (ps) ps.economyInputFingerprint = fingerprintPowerEconomyInput(es, tier);
      return true;
    };
    // ruling 4's second half: the held roster is the subject, so the replay's roster can
    // never convict it. (With the replay skipped this never fires; it is here so a run with
    // holdPower:false still honours ruling 4.)
    ov.assertStableGeneratedRoster = () => undefined;
  }
  // ── the settlement's NAME is held (ruling 1 names it).
  if (has('name') && nameMode !== 'free') {
    ov.generateSettlementName = (args, orig, self) => {
      if (nameMode === 'consume') { orig.apply(self, args); }
      return H.name;
    };
  }

  const stepRestores = new Map(); // step -> [keys]
  for (const k of Object.keys(WRITER_STEPS)) {
    if (!has(k)) continue;
    // `placement` decides ruling 1's "final at EVERY writer" (the default) against X7's
    // "pin at the LAST producer" — the alternative that keeps a held key's FINAL value from
    // reaching the INTERMEDIATE consumers that originally read an intermediate value.
    const steps = (opts.placement === 'last')
      ? [WRITER_STEPS[k][WRITER_STEPS[k].length - 1]]
      : WRITER_STEPS[k];
    for (const s of steps) {
      if (!stepRestores.has(s)) stepRestores.set(s, []);
      stepRestores.get(s).push(k);
    }
  }

  const pins = {};
  for (const k of CHOOSERS) if (has(k)) pins[k] = clone(H[k]);

  globalThis.__FN_OVERRIDE__ = ov;
  try {
    const inst = instrumentedRoot(row._seed, opts.rootOpts || {});
    const ctx = runHeadless(row, inst.root, {
      pins: Object.keys(pins).length ? pins : undefined,
      onStep: (name, c, patch) => {
        const keys = stepRestores.get(name);
        if (keys) for (const k of keys) c[k] = clone(H[k]);
        if (onStepExtra) onStepExtra(name, c, patch);
      },
    });
    const settlement = ctx.settlement;
    ctx.__perStep = inst.perStep;
    // ── ruling 8 (prototyped in P5): a HELD step re-emits nothing; its recorded entries are
    //    carried from the record. A DERIVING step's entries are the fresh ones.
    if (tracePartition && Array.isArray(settlement?.simulationTrace)) {
      const heldSteps = new Set(heldStepsForTrace || []);
      const carried = (tracePartition.simulationTrace || []).filter(t => heldSteps.has(t.step));
      const fresh = settlement.simulationTrace.filter(t => !heldSteps.has(t.step));
      // the entry's own clock is `ts` (P5.a: every entry carries causes, downstreamEffects,
      // targetType, targetId, step, result, ts — 95/95).
      settlement.simulationTrace = [...carried, ...fresh]
        .slice()
        .sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0));
    }
    return { settlement, ctx };
  } finally { globalThis.__FN_OVERRIDE__ = null; }
}

export const tryRederive = (row, held, opts) => {
  try { return { out: rederive(row, held, opts) }; } catch (e) { return { err: e.message }; }
};

/** A plain (unpinned) generation of `row` — the record the DM saved. */
export function generate(row) {
  return runHeadless(row, instrumentedRoot(row._seed).root).settlement;
}

/** The held bag a record yields: the record's own held facts. */
export function heldOf(rec) {
  return Object.fromEntries(HELD_KEYS.map(k => [k, clone(rec[k])]));
}
