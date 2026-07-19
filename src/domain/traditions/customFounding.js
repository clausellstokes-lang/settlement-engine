/**
 * customFounding.js — merges a DM's authored custom traditions into the founding
 * set AT THE VIEW CONSUMER (WB-j genesis consumption).
 *
 * The pure leaf `deriveFoundingTraditions` is golden-pinned (traditionsDormancyGolden)
 * and stays byte-identical: this wrapper NEVER touches it — it appends adapted custom
 * records AFTER it. With no custom traditions it returns the base set UNCHANGED, so a
 * settlement with no homebrew is byte-identical to the leaf's own output.
 *
 * SCOPE — view only. This is wired into the dossier's Traditions tab (the preview
 * consumer), NOT the tick-time mover (traditionsKernel, worldPulse): custom content
 * is not a deterministic tick input, and worldPulse is owned by a parallel lane.
 * Tick-time consumption of custom traditions is a deferred coordination seam.
 *
 * PURITY (the genesis leaf discipline): a true leaf — no store/React/Date/
 * Math.random. The observance window is seeded off the tradition's own id (the
 * authoring form has no date field), so each custom tradition gets a STABLE,
 * distinct calendar window, the same way genesis seeds its windows.
 */
import { createPRNG } from '../../kernel/prng.js';

/**
 * Adapt one authored custom tradition ({ id, name, motifElement?, motifAct?,
 * epithet? }) into a founding TraditionRec, matching genesis's assembleRec key
 * order and null campaign-time fields (ownership/outcomes exist only where time
 * exists). A seeded, stable startWeekOfYear stands in for the absent authored date.
 * @param {{id?:string,name?:string,motifElement?:string,motifAct?:string,epithet?:string}} custom
 */
export function adaptCustomTradition(custom) {
  const id = `custom:${custom?.id ?? custom?.name ?? 'unnamed'}`;
  const startWeekOfYear = createPRNG(`${id}::custom:window`).randInt(0, 51) + 1;
  return {
    id,
    coreMotif: { element: custom?.motifElement || null, act: custom?.motifAct || null },
    name: custom?.name || 'Custom tradition',
    foundedYear: 1,
    window: { startWeekOfYear, weeks: 1 },
    scaleBand: 0,
    ownerKey: null,
    ownerKind: null,
    ownerLabel: null,
    deityRef: null,
    expression: { trappings: [], epithet: custom?.epithet || '' },
    mutationLog: [],
    lastHeldYear: null,
    lastOutcome: null,
    suppressedBy: null,
    adoptedFrom: null,
    custom: true,
  };
}

/**
 * Return the founding set with authored custom traditions appended. An empty/absent
 * custom list ⇒ `baseRecs` returned UNCHANGED (byte-identical), preserving the golden.
 * @param {any[]} baseRecs   the output of deriveFoundingTraditions(settlement)
 * @param {any[]} customTraditions   customContent.traditions (may be undefined)
 * @returns {any[]}
 */
export function mergeCustomFoundingTraditions(baseRecs, customTraditions) {
  const base = Array.isArray(baseRecs) ? baseRecs : [];
  if (!Array.isArray(customTraditions) || customTraditions.length === 0) return base;
  return [...base, ...customTraditions.map(adaptCustomTradition)];
}
