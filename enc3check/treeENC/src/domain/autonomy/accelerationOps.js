/**
 * domain/autonomy/accelerationOps.js — ACCELERATION OPS: pressure nudges, never
 * state-jumps (SURVEYOR S7, DESIGN_AI_CONTROL_SURFACE §2 stage 7 — "raise the
 * conditions, let the simulator decide").
 *
 * A nudge CONSUMES the existing registered op vocabulary — it duplicates nothing:
 * the one acceleration primitive is `injectCampaignStressor` (src/store/
 * operationRegistry.js, klass 'macro'), whose bounded severity (clamp01 in
 * stressorsCore.normalizeStressor) is a genuine PRESSURE INPUT: the simulator ages the
 * stressor (crisisLifecycle), promotes it into activeConditions (conditionPromotion),
 * and the derived pressures rise — outcomes stay the engine's to decide. This module
 * only ever EMITS the op shape; it never touches worldState, never writes outcome
 * state, never rolls. The panel dispatches an APPROVED emission through the registered
 * store action (manifest-walker-honest by construction).
 *
 * MAX_NUDGE_SEVERITY (JUDGMENT, vetoable): 0.85 — a nudge may never press harder than
 * a realm verb's 'severe' dial (REALM_SEVERITY_VALUES.severe, realmManifest.js);
 * equality is pinned by tests/domain/autonomy/accelerationOps.test.js.
 */

import { STRESSOR_CATALOG, catalogFor } from '../worldPulse/stressorsCore.js';

/** The single acceleration op type — consumed from the existing registered vocabulary. */
export const NUDGE_OP_TYPE = 'injectCampaignStressor';

/** The nudge ceiling — lockstep with REALM_SEVERITY_VALUES.severe (test-pinned). */
export const MAX_NUDGE_SEVERITY = 0.85;

/** The severity floor — below this a stressor is noise, not a nudge. */
export const MIN_NUDGE_SEVERITY = 0.05;

/** The closed nudge vocabulary: the stressor catalog's own keys (21 today). */
export const NUDGE_TYPES = Object.freeze(Object.keys(STRESSOR_CATALOG));

/**
 * @typedef {object} NudgeSpec
 * @property {string} type — ∈ NUDGE_TYPES (the stressor catalog)
 * @property {string} originSettlementId
 * @property {number} severity — bounded [MIN_NUDGE_SEVERITY, MAX_NUDGE_SEVERITY]
 * @property {string} [rationale] - the composer's one-line why (display only)
 */

/**
 * @typedef {object} NudgeOpEmission
 * @property {typeof NUDGE_OP_TYPE} opType
 * @property {string} campaignId
 * @property {{ type: string, originSettlementId: string, severity: number }} stressor
 */

/**
 * Validate a nudge against the closed vocabulary. Pure; never throws.
 * @param {unknown} nudge
 * @param {{ settlementIds?: Array<string> }} [world]
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validateNudge(nudge, { settlementIds = [] } = {}) {
  /** @type {string[]} */
  const errors = [];
  const n = /** @type {Record<string, unknown>} */ (nudge && typeof nudge === 'object' ? nudge : {});
  const type = typeof n.type === 'string' ? n.type : '';
  if (!NUDGE_TYPES.includes(type)) {
    errors.push(`unknown stressor type "${type || '(empty)'}" — a nudge may only raise a catalogued pressure`);
  }
  const origin = typeof n.originSettlementId === 'string' ? n.originSettlementId : '';
  if (!origin) {
    errors.push('a nudge names its originSettlementId');
  } else if (settlementIds.length && !settlementIds.map(String).includes(origin)) {
    errors.push(`originSettlementId "${origin}" is not in this campaign`);
  }
  const sev = typeof n.severity === 'number' && Number.isFinite(n.severity) ? n.severity : NaN;
  if (!(sev >= MIN_NUDGE_SEVERITY && sev <= MAX_NUDGE_SEVERITY)) {
    errors.push(`severity must sit in [${MIN_NUDGE_SEVERITY}, ${MAX_NUDGE_SEVERITY}]`);
  }
  return { ok: errors.length === 0, errors };
}

/**
 * Build the op EMISSION for an approved nudge — the shape the panel hands to the
 * registered store action. Pure: emits data, writes nothing. Severity is re-clamped
 * here so no caller can smuggle a harder press past the ceiling.
 * @param {string} campaignId
 * @param {NudgeSpec} nudge
 * @returns {NudgeOpEmission}
 */
export function buildNudgeOp(campaignId, nudge) {
  const severity = Math.min(
    MAX_NUDGE_SEVERITY,
    Math.max(MIN_NUDGE_SEVERITY, Number.isFinite(nudge.severity) ? nudge.severity : MIN_NUDGE_SEVERITY),
  );
  return Object.freeze({
    opType: NUDGE_OP_TYPE,
    campaignId: String(campaignId),
    stressor: Object.freeze({
      type: String(nudge.type),
      originSettlementId: String(nudge.originSettlementId),
      severity,
    }),
  });
}

/**
 * A human line for the approve card.
 * @param {NudgeSpec} nudge
 * @returns {string}
 */
export function describeNudge(nudge) {
  const entry = /** @type {{ label?: unknown }} */ (catalogFor(nudge.type) || {});
  const label = typeof entry.label === 'string' && entry.label ? entry.label : String(nudge.type).replace(/_/g, ' ');
  const pct = Math.round((Number.isFinite(nudge.severity) ? nudge.severity : 0) * 100);
  return `${label} at ${nudge.originSettlementId} (severity ${pct}%)`;
}
