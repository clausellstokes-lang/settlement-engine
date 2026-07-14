/**
 * domain/display/settlementPestilence.js — the PESTILENCE read-model sibling
 * (domain-readmodels-4). M11a's traveling plague, made DM-readable as a spatial
 * phenomenon — the one-mover-one-read-model contract that rumors/beliefs/trade
 * flow/occupation/war already satisfy.
 *
 * ONE stored ledger (worldState.spatialLedgers.epidemic, spatial/pestilence.js),
 * one pure selector that bands the graded level + phase + care counterforce into
 * DM-speakable fiction: "Plague burns in Briarwatch — a raging sickness, three
 * weeks up the road from Ashford; the healers hold what line they can."
 *
 *   • The player/DM split follows the includeGroundTruth convention (default
 *     false → the banded fiction a settlement would know about its own sickness;
 *     true → a `truth` block with the raw level/phase/tick internals for the DM).
 *     Pestilence carries no belief-vs-truth divergence — a plague is not a secret
 *     — so the truth block is additive detail, never a scrub gate.
 *
 * INCUBATING records (front landed, onset pending) read as the drama of the
 * APPROACH ("the sickness has not yet broken out"); ACTIVE as the plague itself;
 * RECOVERING as its passing. Care posture (temples/healing houses/druids/
 * alchemists) is derived from a supplied settlement's institution roster.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on
 * absent/garbage ledgers; every list codepoint-sorted. Lazy-only (rides the news/
 * inspector chunk) so budget-free — byte-inert to the engine and its goldens.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, hopWeeks } from '../spatial/distanceRead.js';
import { EPIDEMIC_TUNING, classifyCareRoster, careCapacity } from '../spatial/pestilence.js';

/** @typedef {import('../spatial/pestilence.js').EpidemicRecord} EpidemicRecord */

/** @param {unknown} v @param {number} f @returns {number} */
function finiteNumber(v, f) {
  return typeof v === 'number' && Number.isFinite(v) ? v : f;
}

/** @param {unknown} v @returns {number} */
function clamp01(v) {
  return Math.max(0, Math.min(1, finiteNumber(v, 0)));
}

/** @param {unknown} worldState @returns {Record<string, EpidemicRecord>|null} */
function epidemicLedger(worldState) {
  const led = getSpatialLedger(/** @type {Record<string, unknown>} */ (worldState), 'epidemic');
  return led && typeof led === 'object' && !Array.isArray(led)
    ? /** @type {Record<string, EpidemicRecord>} */ (led) : null;
}

// ── The in-world bands ───────────────────────────────────────────────────────

const SEVERITY_WORDS = Object.freeze([
  'the first few sick', 'a spreading sickness', 'a heavy sickness', 'a raging plague',
]);

/** Graded level 0..1 → a severity band 0..3. @param {number} level */
export function pestilenceSeverityBand(level) {
  const l = clamp01(level);
  if (l >= 0.7) return 3;
  if (l >= 0.45) return 2;
  if (l >= 0.2) return 1;
  return 0;
}

/** @param {number} band */
function severityPhrase(band) {
  return SEVERITY_WORDS[Math.max(0, Math.min(3, Math.round(finiteNumber(band, 0))))];
}

/** @param {'incubating'|'active'|'recovering'} phase */
function trendOf(phase) {
  if (phase === 'incubating') return 'approaching';
  if (phase === 'recovering') return 'receding';
  return 'active';
}

/**
 * Care posture from a settlement's institution roster (temples, healing houses,
 * druids, alchemists) — banded against the care cap, plus its fiction voice.
 * @param {Array<unknown>|undefined} institutions
 * @returns {{ band: number, roster: { church: number, healingHouse: number, druid: number, alchemist: number }, fiction: string } | null}
 */
function carePosture(institutions) {
  if (!Array.isArray(institutions)) return null;
  const roster = classifyCareRoster(institutions);
  const total = roster.church + roster.healingHouse + roster.druid + roster.alchemist;
  const ratio = careCapacity(roster) / EPIDEMIC_TUNING.CARE_MAX_RELIEF; // 0..~1
  const band = ratio >= 0.55 ? 2 : ratio >= 0.2 ? 1 : 0;
  const fiction = total === 0
    ? 'There is little here to hold it back.'
    : band >= 2
      ? 'The healers and temples hold a firm line against it.'
      : 'The healers do what they can, but they are stretched thin.';
  return { band, roster, fiction };
}

/** @param {string | null | undefined} id @param {(id: string) => string} nameFor */
function nameOf(id, nameFor) {
  return id == null || id === '' ? 'parts unknown' : nameFor(String(id));
}

/**
 * The plague fiction for ONE settlement, or null when it carries no epidemic
 * record. Pure; inert on absent/garbage ledgers.
 *
 * @param {Object} args
 * @param {{ tick?: number, spatialLedgers?: unknown, spatialDigest?: unknown } | null | undefined} args.worldState
 * @param {unknown} args.settlementId
 * @param {{ institutions?: Array<unknown> } | null} [args.settlement]  optional — supplies care posture.
 * @param {boolean} [args.includeGroundTruth]  DM surfaces ⇒ true (adds a raw `truth` block).
 * @param {(id: string) => string} [args.nameFor]  settlement id → display name.
 * @returns {Record<string, unknown> | null}
 */
export function settlementPestilence({
  worldState,
  settlementId,
  settlement = null,
  includeGroundTruth = false,
  nameFor = (id) => String(id),
} = /** @type {never} */ ({})) {
  if (settlementId == null) return null;
  const ledger = epidemicLedger(worldState);
  if (!ledger) return null;
  const rec = ledger[String(settlementId)];
  if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return null;

  const phase = rec.phase === 'active' || rec.phase === 'recovering' ? rec.phase : 'incubating';
  const level = clamp01(rec.level);
  const band = pestilenceSeverityBand(level);
  const where = nameOf(String(settlementId), nameFor);
  const trend = trendOf(phase);

  // Origin + distance (the front's approach — the drama). hopWeeks reads the
  // frozen distance matrix; a seed origin ('') or absent digest ⇒ no origin.
  const sourceId = String(rec.sourceId ?? '');
  const digest = worldState?.spatialDigest;
  const weeksAway = sourceId && digest ? hopWeeks(digest, sourceId, String(settlementId)) : null;
  const origin = sourceId
    ? { id: sourceId, name: nameOf(sourceId, nameFor), weeksAway: Number.isFinite(weeksAway) ? weeksAway : null }
    : null;

  // Presence fiction, phase-shaped.
  let presence;
  if (phase === 'incubating') {
    presence = `Word of plague has reached ${where}; the sickness has not yet broken out.`;
  } else if (phase === 'recovering') {
    presence = `The plague in ${where} is passing — the worst is behind it.`;
  } else {
    presence = `Plague burns in ${where}: ${severityPhrase(band)}.`;
  }

  const originFiction = origin
    ? (origin.weeksAway != null
      ? `It came from ${origin.name}, some ${origin.weeksAway} ${origin.weeksAway === 1 ? 'week' : 'weeks'} up the road.`
      : `It came from the direction of ${origin.name}.`)
    : 'It began here.';

  const care = carePosture(settlement?.institutions);

  /** @type {Record<string, unknown>} */
  const projection = {
    settlementId: String(settlementId),
    where,
    phase,
    presence,
    severityBand: band,
    severity: severityPhrase(band),
    trend,
    origin,
    originFiction,
    care: care ? { band: care.band, fiction: care.fiction } : null,
  };
  if (!includeGroundTruth) return projection;
  return {
    ...projection,
    truth: {
      level: rec.level,
      phase,
      arrivedTick: rec.arrivedTick,
      activeSince: rec.activeSince,
      sinceTick: rec.sinceTick,
      sourceId: sourceId || null,
      careRoster: care ? care.roster : null,
    },
  };
}

/**
 * The realm-wide plague front: every afflicted settlement, projected and ordered
 * (severity desc, then codepoint on id). The "spatial phenomenon" view the DM
 * reads to see where the front burns and where it is closing in. Dormant ⇒ [].
 *
 * @param {Object} args
 * @param {{ tick?: number, spatialLedgers?: unknown, spatialDigest?: unknown } | null | undefined} args.worldState
 * @param {boolean} [args.includeGroundTruth]
 * @param {(id: string) => string} [args.nameFor]
 * @param {(id: string) => ({ institutions?: Array<unknown> } | null | undefined)} [args.settlementOf]  id → settlement (care posture).
 * @returns {Array<Record<string, unknown>>}
 */
export function realmPestilence({
  worldState,
  includeGroundTruth = false,
  nameFor = (id) => String(id),
  settlementOf,
} = /** @type {never} */ ({})) {
  const ledger = epidemicLedger(worldState);
  if (!ledger) return [];
  const ids = Object.keys(ledger).sort(compareCodepoint);
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const id of ids) {
    const projection = settlementPestilence({
      worldState,
      settlementId: id,
      settlement: settlementOf ? settlementOf(id) : null,
      includeGroundTruth,
      nameFor,
    });
    if (projection) out.push(projection);
  }
  return out.sort((a, b) => (Number(b.severityBand) - Number(a.severityBand))
    || compareCodepoint(String(a.settlementId), String(b.settlementId)));
}

/**
 * Panel presence gate: does this world carry ANY epidemic record? Dormant (no
 * key / empty) ⇒ false ⇒ no surface renders ⇒ byte-identical UI.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 */
export function hasPestilence(worldState) {
  const ledger = epidemicLedger(worldState);
  return !!ledger && Object.keys(ledger).length > 0;
}

/**
 * The dossier/panel-presence gate for the campaign OWNING a save. Boolean-only
 * (a store selector calls this every render); mirrors campaignHasRumorLedger.
 * @param {Array<{ settlementIds?: Array<string | number>,
 *   worldState?: { spatialLedgers?: unknown } } | null> | null | undefined} campaigns
 * @param {unknown} saveId
 * @returns {boolean}
 */
export function campaignHasEpidemic(campaigns, saveId) {
  if (saveId == null || !Array.isArray(campaigns)) return false;
  const sid = String(saveId);
  return campaigns.some((campaign) => campaign
    && (campaign.settlementIds || []).map(String).includes(sid)
    && hasPestilence(campaign.worldState));
}
