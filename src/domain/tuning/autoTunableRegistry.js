/**
 * autoTunableRegistry.js — the §10 AUTO-TUNABLE REGISTRY: the structural rail that
 * decides what the autonomous tuning loop may EVER auto-apply (lane A).
 *
 * ── THE CONSTITUTIONAL BOUNDARY (DESIGN_ANALYTICS_V2 §10) ──────────────────────
 * The loop has two lanes. LANE A auto-applies a bounded, monotone-stepped nudge; LANE B
 * queues a proposal for the owner's signature. The GOLDEN LAW is absolute: "no golden
 * regenerates without the owner's signature, ever" — so any constant whose change shifts
 * same-seed golden output is FOREVER lane B. The design's demand is that the rail make
 * that boundary "structurally impossible to cross, not just documented."
 *
 * HOW THE BOUNDARY IS MADE STRUCTURAL (three layers, not prose):
 *   1. SURFACE ALLOWLIST — a registry entry MUST declare a `surface` in SAFE_SURFACES
 *      (display / rollup / analytics). A sim/generation surface is unrepresentable: the
 *      validator rejects it.
 *   2. MODULE DENYLIST — the entry's `module` must NOT point into the seeded pipeline
 *      (worldPulse / spatial / generators / generate*). EVERY same-seed-shifting constant
 *      lives behind that call graph (see the golden fixtures), so a golden-shifting
 *      constant cannot be named by any valid entry. The validator rejects it, and the
 *      walker test (tests/domain/autoTunableRegistryWalker.test.js) fails the GATE if one
 *      is ever added — the "impossible to cross" enforcement.
 *   3. THE LANE CLASSIFIER (laneClassifier.js) additionally forces lane B on any proposal
 *      flagged `shiftsGolden` by the soak battery — belt-and-suspenders against a
 *      mis-declared surface.
 *
 * ── SHIPS EMPTY (owner ratifies at setup, §10: "owner rails ratified once at setup") ──
 * AUTO_TUNABLE is an EMPTY frozen list. Nothing is auto-tunable until the owner ratifies
 * an entry — so lane A is EMPTY on deploy and NOTHING auto-applies (maximally safe; the
 * §7 data-endogeneity law holds trivially). CANDIDATE_RAILS below documents the only
 * classes that could ever qualify (display/rollup-side constants) for the owner's review —
 * they are commentary, NOT active entries.
 *
 * PURITY / BUDGET: no transport, no side effects, no eager importer. Read only by the
 * lane classifier + the weekly job + tests — zero first-paint bytes (§7 near-zero-eager).
 */

/** Bump when the entry shape or the surface/denylist rules change (vocabulary-pin idiom). */
export const AUTO_TUNABLE_REGISTRY_VERSION = 1;

/** The ONLY surfaces an auto-tunable constant may live on — never 'sim'/'generation'. */
export const SAFE_SURFACES = Object.freeze(['display', 'rollup', 'analytics']);

/**
 * Module paths that are the SEEDED PIPELINE (same-seed golden output). No auto-tunable
 * entry may reference one — every golden-shifting constant is reachable through these, so
 * this denylist is what makes the golden boundary structural rather than documented.
 */
const FORBIDDEN_MODULE_RE = /(worldPulse|spatial|generators?|\/generate|movers?)/i;

/**
 * @typedef {{ id: string, module: string, surface: string, range: [number, number],
 *   maxStepPerWeek: number, requiredGreenEnvelopes: string[], monotoneDir?: 'up'|'down' }} RegistryEntry
 */

/**
 * Validate one registry entry against the §10 rail contract. Returns { ok, reasons }.
 * An entry is auto-tunable ONLY if it declares a RANGE, a MAX-STEP-PER-WEEK, and
 * REQUIRED-GREEN envelopes (§10), on a SAFE surface, in a non-pipeline module.
 * @param {unknown} entry
 * @returns {{ ok: boolean, reasons: string[] }}
 */
export function validateRegistryEntry(entry) {
  const reasons = [];
  const e = /** @type {Partial<RegistryEntry>} */ (entry && typeof entry === 'object' ? entry : {});
  if (typeof e.id !== 'string' || !e.id) reasons.push('missing id');
  if (typeof e.module !== 'string' || !e.module) reasons.push('missing module');
  else if (FORBIDDEN_MODULE_RE.test(e.module)) reasons.push(`module is in the seeded pipeline (golden-shifting): ${e.module}`);
  if (typeof e.surface !== 'string' || !SAFE_SURFACES.includes(e.surface)) {
    reasons.push(`surface must be one of ${SAFE_SURFACES.join('/')} (never sim/generation)`);
  }
  // RANGE: [min, max] with min < max.
  const r = Array.isArray(e.range) && e.range.length === 2 ? e.range : null;
  const rangeOk = !!r && Number.isFinite(r[0]) && Number.isFinite(r[1]) && r[0] < r[1];
  if (!rangeOk) reasons.push('range must be a finite [min, max] with min < max');
  // MAX-STEP-PER-WEEK: positive, and no larger than the whole range (a step can't jump the band).
  const step = e.maxStepPerWeek;
  if (!(typeof step === 'number' && Number.isFinite(step) && step > 0)) reasons.push('maxStepPerWeek must be a positive number');
  else if (r && step > (r[1] - r[0])) reasons.push('maxStepPerWeek exceeds the range width');
  // REQUIRED-GREEN envelopes: a non-empty list of envelope-suite names that must pass.
  if (!Array.isArray(e.requiredGreenEnvelopes) || e.requiredGreenEnvelopes.length === 0) {
    reasons.push('requiredGreenEnvelopes must be a non-empty list');
  }
  // Optional monotone direction (e.g. k-floors tighten UPWARD only).
  if (e.monotoneDir != null && !['up', 'down'].includes(e.monotoneDir)) {
    reasons.push("monotoneDir, if set, must be 'up' or 'down'");
  }
  return { ok: reasons.length === 0, reasons };
}

/**
 * Assert an entire ratified registry is valid. Throws on the FIRST invalid entry (used by
 * the loader + the walker test so an invalid entry can never silently become auto-tunable).
 * @param {readonly unknown[]} entries
 */
export function assertValidRegistry(entries) {
  if (!Array.isArray(entries)) throw new Error('auto-tunable registry must be an array');
  entries.forEach((entry, i) => {
    const { ok, reasons } = validateRegistryEntry(entry);
    if (!ok) {
      const id = entry && typeof entry === 'object' && 'id' in entry
        ? String(/** @type {{ id?: unknown }} */ (entry).id) : '?';
      throw new Error(`auto-tunable registry entry #${i} (${id}) invalid: ${reasons.join('; ')}`);
    }
  });
  return true;
}

/**
 * THE RATIFIED REGISTRY — SHIPS EMPTY. The owner adds entries once at setup (§10). Until
 * then lane A is empty and nothing auto-applies. Kept frozen so no runtime path mutates it.
 * @type {ReadonlyArray<RegistryEntry>}
 */
export const AUTO_TUNABLE = Object.freeze(/** @type {RegistryEntry[]} */ ([]));

/**
 * CANDIDATE_RAILS — documentation ONLY (not active entries). The classes of constant that
 * could legitimately be ratified into AUTO_TUNABLE because they are display/rollup-side and
 * never touch the seeded sim (recon-confirmed): the k-anonymity floors (SQL-side, monotone
 * UP only), display band thresholds, admin advisory heuristics. Sim balance constants
 * (every *_TUNING object under worldPulse/spatial) are golden-shifting → lane B FOREVER and
 * are intentionally absent here. This list is the owner's ratification menu, not a decision.
 */
export const CANDIDATE_RAILS = Object.freeze([
  { id: 'market_k_min_users', surface: 'rollup', note: 'SQL k-floor; monotone UP only (§4). Owner-ratify if auto-tightening is wanted.' },
  { id: 'market_k_min_campaigns', surface: 'rollup', note: 'SQL k-floor; monotone UP only (§4).' },
]);
