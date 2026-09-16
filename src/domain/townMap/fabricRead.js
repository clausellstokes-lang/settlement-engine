/**
 * townMap/fabricRead.js — THE URBAN FABRIC READ API (task #39 → consumed by the
 * v2 layout engine, task #38, when lit).
 *
 * The fabric layer (worldPulse/urbanFabricKernel.js) projects its authoritative
 * sidecar ledger onto a compact NON-core `settlement.urbanFabric` mirror each
 * advance (the npcGrowth acquiredTraits idiom — self-healing). THIS module is
 * the pure, zero-engine-import reader the town-map layout engine consumes: it
 * reads the serialized mirror directly, never the engine leaf (the provenance
 * zero-engine→display-coupling law — chronicleGraph's recorded-edges precedent).
 *
 * ABSENT/DARK ⇒ EMPTY: with the fabric layer dormant (or on any pre-fabric
 * save) the mirror field does not exist, every reader here returns its empty
 * value, and the layout engine falls back to pure current-state derivation —
 * exactly the pre-fabric behavior.
 *
 * Shapes (the mirror, written by mirrorOf in the kernel):
 *   settlement.urbanFabric = {
 *     drift:    number 0..1 (0 lawful rubric … 1 chaotic encroachment),
 *     stocks:   { [districtClass]: prominence01 },   // the 12-enum classes
 *     scars:    [{ kind, severity: 0..1, week }],    // typed decaying scars
 *     rebirths: [{ classes: string[], type, week }], // latest catastrophe rebirths
 *   }
 *
 * Pure, deterministic, tolerant of malformed/partial data. No engine imports,
 * no React, no store.
 */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @returns {number} */
function num01(v) {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** The mirror blob, or null when absent (dark / pre-fabric save).
 *  @param {{ urbanFabric?: unknown }|null|undefined} settlement
 *  @returns {Record<string, unknown>|null} */
function mirror(settlement) {
  const m = settlement && typeof settlement === 'object' ? settlement.urbanFabric : null;
  return m && typeof m === 'object' && !Array.isArray(m) ? /** @type {Record<string, unknown>} */ (m) : null;
}

/**
 * The per-district-class prominence stocks (0..1), or {} when absent/dark —
 * the layout engine's history-weighted district sizing/priority input.
 * @param {{ urbanFabric?: unknown }|null|undefined} settlement
 * @returns {Record<string, number>}
 */
export function fabricStocksFor(settlement) {
  const m = mirror(settlement);
  if (!m) return {};
  const raw = asObject(m.stocks);
  /** @type {Record<string, number>} */
  const out = {};
  for (const cls of Object.keys(raw).sort()) {
    const v = num01(raw[cls]);
    if (v > 0) out[cls] = v;
  }
  return out;
}

/**
 * The alignment drift of NEW fabric — 0 lawful rubric-faithful … 1 chaotic
 * encroachment — or NULL when absent/dark (the layout engine then derives its
 * grain from current state alone; null ≠ 0.5, absence is not neutrality).
 * @param {{ urbanFabric?: unknown }|null|undefined} settlement
 * @returns {number|null}
 */
export function fabricDriftOf(settlement) {
  const m = mirror(settlement);
  if (!m || typeof m.drift !== 'number' || !Number.isFinite(m.drift)) return null;
  return num01(m.drift);
}

/**
 * The typed stressor scars ([{ kind, severity, week }], severity 0..1), sorted
 * by kind, or [] when absent/dark — burn lots, plague quarters, siege repairs
 * for the layout engine to draw as damaged/patched fabric.
 * @param {{ urbanFabric?: unknown }|null|undefined} settlement
 * @returns {Array<{ kind: string, severity: number, week: number }>}
 */
export function fabricScarsOf(settlement) {
  const m = mirror(settlement);
  if (!m || !Array.isArray(m.scars)) return [];
  /** @type {Array<{ kind: string, severity: number, week: number }>} */
  const out = [];
  for (const s of m.scars) {
    const o = asObject(s);
    const kind = typeof o.kind === 'string' ? o.kind : '';
    if (!kind) continue;
    const week = typeof o.week === 'number' && Number.isFinite(o.week) ? o.week : 0;
    out.push({ kind, severity: num01(o.severity), week });
  }
  return out.sort((a, b) => (a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0));
}

/**
 * The catastrophe rebirth markers ([{ classes, type, week }], newest last), or
 * [] when absent/dark — a rebirthed class draws FRESH fabric (current-era grain,
 * no inherited prominence) where the old quarter stood.
 * @param {{ urbanFabric?: unknown }|null|undefined} settlement
 * @returns {Array<{ classes: string[], type: string, week: number }>}
 */
export function fabricRebirthsOf(settlement) {
  const m = mirror(settlement);
  if (!m || !Array.isArray(m.rebirths)) return [];
  /** @type {Array<{ classes: string[], type: string, week: number }>} */
  const out = [];
  for (const r of m.rebirths) {
    const o = asObject(r);
    const classes = Array.isArray(o.classes) ? o.classes.filter((c) => typeof c === 'string').map(String) : [];
    const week = typeof o.week === 'number' && Number.isFinite(o.week) ? o.week : 0;
    out.push({ classes, type: String(o.type || ''), week });
  }
  return out;
}

/** Does the settlement carry ANY fabric memory (the lit-and-populated check the
 *  layout engine branches on before preferring fabric over current-state)?
 *  @param {{ urbanFabric?: unknown }|null|undefined} settlement @returns {boolean} */
export function hasFabric(settlement) {
  return mirror(settlement) != null;
}
