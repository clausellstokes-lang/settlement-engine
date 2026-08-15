// applyWorldPulseFactionRoster — the roster-power half of the apply pass: the faction
// payload kinds plus the bounded power bump/shift a capture or contested transfer writes
// onto settlement.powerStructure.factions. Split verbatim out of applyWorldPulse.js by
// THE DECOMPOSITION WAVE (war tranche, file 4); every body here is byte-identical to its
// pre-split declaration. NOTE for tests/lint/ruinFilterRoster.walker.test.js: the single
// `.institutions` name-lookup the walker catalogues for the apply pass now lives HERE.
import { stablePart } from '../region/index.js';
import { INSTITUTION_SUPPRESSION_SEVERITY } from './factionCompetition.js';
import { transferRulingPower } from '../rulingPower.js';
import { withImpairment } from '../entities/status.js';
// THE TYPE SURFACE IS PART OF THE PUBLIC SURFACE (R-BLD-9 / the file-2 lesson):
// these aliases are re-declared in every member of the family that names them, so a
// split never silently drops a typedef and lands strict errors on a consumer.
/** @typedef {import('./pulseShapes.js').WorldState} PulseWorldState */
/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {import('../settlement.schema.js').SimFaction} SimFaction */
/** @typedef {import('../settlement.schema.js').SimInstitution} SimInstitution */


// Shared loose sim-shape typedefs for the war-2/war-3/war-4 apply arms below. Zero
// any-holes here: the deliberate looseness lives inside the referenced typedefs'
// own modules (pulseShapes.js / settlement.schema.js), the house convention.

// (stampDeploymentRecall moved to warIntent.js — the strategy chooser's decisions,
// deposited as the war-ledger state the ONE opener consumes, are one family and now
// live in one module. Its three call sites below are unchanged.)

// war-2 — APPROVED FACTION PROPOSALS APPLY FOR REAL. The four DM-facing faction
// payload kinds whose apply arms below move real settlement state (the government
// read-path, the named institution, the roster power scalars) instead of the old
// factionState-ledger cosmetics. Only these payload-carrying (severity-gated, DM-
// facing) proposals reach the effect; a faction-free / low-severity world never
// generates one ⇒ byte-identical.
export const FACTION_PAYLOAD_KINDS = new Set([
  'government_change', 'institution_capture', 'institution_suppression', 'faction_power_shift',
]);
// Bounded roster effects (RELATIVE power weights, matching transferRulingPower's +6
// coup bump — no renormalization). Named + retunable.
const FACTION_CAPTURE_POWER_GAIN = 5;      // institutional control → bounded roster influence
const FACTION_POWER_SHIFT_AMOUNT = 8;      // a contested transfer between two seats

/** @param {SimFaction|SimInstitution|null|undefined} x */
const entityName = (x) => String(x?.faction || x?.name || x?.label || '').trim().toLowerCase();
/** @param {Array<SimFaction|SimInstitution>|null|undefined} list @param {string} name */
function entityByName(list, name) {
  const n = String(name || '').trim().toLowerCase();
  if (!n || !Array.isArray(list)) return null;
  return list.find((e) => entityName(e) === n) || null;
}

/** Coerce a roster power weight to a finite number (0 for absent/garbage).
 *  @param {unknown} v @returns {number} */
const rosterNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Bounded roster power gain for a single faction (institution_capture). No-op if the
 *  faction is not on the roster. @param {SimSettlement} settlement @param {string} name @param {number} amount */
function bumpRosterFactionPower(settlement, name, amount) {
  const ps = settlement?.powerStructure;
  const factions = ps && Array.isArray(ps.factions) ? ps.factions : [];
  const fac = entityByName(factions, name);
  if (!ps || !fac) return settlement;
  return {
    ...settlement,
    powerStructure: {
      ...ps,
      factions: factions.map((f) => (f === fac ? { ...f, power: Math.round(rosterNum(f.power) + amount) } : f)),
    },
  };
}

/** Bounded roster power TRANSFER from `loseName` to `gainName` (faction_power_shift):
 *  the contest can be lost as well as won (the two-way path). No-op if either seat is
 *  absent. @param {SimSettlement} settlement @param {string} gainName @param {string} loseName @param {number} amount */
function shiftRosterFactionPower(settlement, gainName, loseName, amount) {
  const ps = settlement?.powerStructure;
  const factions = ps && Array.isArray(ps.factions) ? ps.factions : [];
  const gain = entityByName(factions, gainName);
  const lose = entityByName(factions, loseName);
  if (!ps || !gain || !lose || gain === lose) return settlement;
  const moved = Math.min(amount, Math.max(0, rosterNum(lose.power)));
  if (moved <= 0) return settlement;
  return {
    ...settlement,
    powerStructure: {
      ...ps,
      factions: factions.map((f) => {
        if (f === gain) return { ...f, power: Math.round(rosterNum(f.power) + moved) };
        if (f === lose) return { ...f, power: Math.round(rosterNum(f.power) - moved) };
        return f;
      }),
    },
  };
}

/**
 * Apply the real settlement effect of an approved faction payload (war-2). Additive on
 * top of applyFactionPatch (the factionState-ledger accretion is unchanged). Returns
 * the same settlement reference when nothing matches (byte-identical no-op).
 * @param {SimSettlement} settlement @param {PulseOutcome} outcome @param {PulseWorldState} state @param {{ now?: string|null, tick?: number|null }} ctx
 */
export function applyFactionPayloadEffect(settlement, outcome, state, { now, tick }) {
  const pay = outcome.proposalPayload;
  if (!settlement || !pay) return settlement;
  const factionName = outcome.metadata?.factionName;
  switch (pay.kind) {
    case 'government_change': {
      // The challenging faction takes the seat — the government read-path
      // (powerStructure.government + governing faction) actually changes, as a coup
      // does. cause 'appointment': a DM-sanctioned political installation, not a
      // violent seizure. Institutions are preserved (transferRulingPower never touches
      // them). No-op when the faction is absent / already governs.
      if (!factionName) return settlement;
      // FORCED SEAM: SimSettlement's loose sub-shapes (powerStructure.government:
      // string|Object) are not statically assignable to rulingPower.js's narrower
      // RulingPowerSettlement, though every runtime caller passes the same objects.
      // One unknown-bridge here (zero any-holes), matching how the untyped callers
      // already cross this boundary.
      const rulingView = /** @type {import('../rulingPower.js').RulingPowerSettlement} */ (
        /** @type {unknown} */ (settlement));
      const result = transferRulingPower(rulingView, factionName, {
        cause: 'appointment',
        tick: Number.isFinite(tick) ? tick : null,
      });
      return result.error ? settlement : /** @type {SimSettlement} */ (result.settlement);
    }
    case 'institution_suppression': {
      // Impair the named institution — the suppression now BITES (status + legitimacy),
      // not just an id on a text list. Idempotent by causeEventId.
      const institutions = Array.isArray(settlement.institutions) ? settlement.institutions : [];
      const inst = entityByName(institutions, pay.institutionName)
        || institutions.find((i) => stablePart(i?.id || i?.name || '') === String(pay.institutionId));
      if (!inst) return settlement;
      // FORCED SEAM (same class as above): SimInstitution.status is string|Object,
      // StatusEntity.status is string — structurally incompatible typedef families
      // for the same runtime objects. One unknown-bridge, zero any-holes.
      const statusView = /** @type {import('../entities/status.js').StatusEntity} */ (
        /** @type {unknown} */ (inst));
      const impaired = withImpairment(statusView, {
        type: 'legitimacy',
        severity: INSTITUTION_SUPPRESSION_SEVERITY,
        causeEventId: `faction_suppression:${pay.factionId}:${pay.institutionId}`,
        appliedAt: now ?? null,
        description: `${factionName || 'A rival faction'} suppressed ${inst.name || pay.institutionName}.`,
      });
      return { ...settlement, institutions: institutions.map((i) => (i === inst ? /** @type {SimInstitution} */ (impaired) : i)) };
    }
    case 'institution_capture': {
      // Institutional control → bounded roster influence for the capturing faction; a
      // later rival faction_power_shift can move it back (two-way, existing machinery).
      return bumpRosterFactionPower(settlement, factionName, FACTION_CAPTURE_POWER_GAIN);
    }
    case 'faction_power_shift': {
      // A bounded power transfer from the contested rival to the contesting faction.
      const rivalName = state?.factionStates?.[pay.rivalFactionId]?.name;
      if (!factionName || !rivalName) return settlement;
      return shiftRosterFactionPower(settlement, factionName, rivalName, FACTION_POWER_SHIFT_AMOUNT);
    }
    default:
      return settlement;
  }
}
