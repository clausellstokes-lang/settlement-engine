/**
 * domain/display/politicsRead.js — the POLITICS-BLOC read-model sibling
 * (domain-display-readmodels-4, residue). W-DOCTRINE-4's per-settlement bloc
 * ledger (worldState.politicsLedgers) — coalitions inside the walls, and under an
 * autarchy the COVERT conspiracies against the seat — was written by the engine and
 * read by NOTHING display-side. This is its DM-readable projection, on the
 * settlementPestilence pattern.
 *
 *   • THE COVERT SPLIT (includeCovert, default false): a covert bloc is a
 *     CONSPIRACY (Bloc.covert). Default false ⇒ the player-safe view (open blocs
 *     only — a conspiracy is a secret). true ⇒ the DM view (conspiracies surfaced,
 *     dressed as the quiet faction they are). Mirrors the tradePressure/mobilization
 *     includeCovert convention.
 *   • THE DM TRUTH SEAM (includeGroundTruth, default false): adds a `truth` block
 *     with the raw strain/end/sinceTick/glue for the DM.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on
 * absent/garbage ledgers; every list codepoint-sorted. Lazy-only leaf (rides the
 * realm-inspector chunk) so it is byte-inert to the engine and its goldens.
 */

import { compareCodepoint } from '../deterministicSort.js';

/** @typedef {{ id: string, members: string[], glue: Array<{ type: string, detail: string }>,
 *   end: string, strain: number, sinceTick: number, covert?: boolean }} Bloc */

/** @param {unknown} v @param {number} f @returns {number} */
function finiteNumber(v, f) {
  return typeof v === 'number' && Number.isFinite(v) ? v : f;
}

/** @param {unknown} v @returns {number} */
function clamp01(v) {
  return Math.max(0, Math.min(1, finiteNumber(v, 0)));
}

/** @param {unknown} worldState @returns {Record<string, { blocs?: unknown }> | null} */
function politicsLedgers(worldState) {
  const led = /** @type {Record<string, unknown>} */ (worldState || {}).politicsLedgers;
  return led && typeof led === 'object' && !Array.isArray(led)
    ? /** @type {Record<string, { blocs?: unknown }>} */ (led) : null;
}

/** @param {unknown} entry @returns {Bloc[]} */
function blocsOf(entry) {
  const blocs = entry && typeof entry === 'object' ? /** @type {{ blocs?: unknown }} */ (entry).blocs : null;
  return Array.isArray(blocs) ? /** @type {Bloc[]} */ (blocs) : [];
}

// ── The in-world bands ───────────────────────────────────────────────────────

const STRAIN_WORDS = Object.freeze(['holding firm', 'strained', 'fracturing']);

/** strain 0..1 → a cohesion band 0..2. @param {number} strain */
export function blocStrainBand(strain) {
  const s = clamp01(strain);
  if (s >= 0.66) return 2;
  if (s >= 0.33) return 1;
  return 0;
}

const END_PHRASE = Object.freeze({
  seats: 'for a share of the seats',
  doctrine: 'over doctrine',
  commerce: 'over the terms of trade',
  survival: 'out of common survival',
  patron: "under a patron's hand",
});

/** @param {string} end */
function endPhrase(end) {
  return /** @type {Record<string, string>} */ (END_PHRASE)[String(end)] || 'over the balance of power';
}

/**
 * The bloc fiction for ONE bloc.
 * @param {Bloc} bloc @param {boolean} includeGroundTruth
 * @returns {Record<string, unknown>}
 */
function projectBloc(bloc, includeGroundTruth) {
  const members = Array.isArray(bloc.members) ? bloc.members.map(String) : [];
  const covert = !!bloc.covert;
  const band = blocStrainBand(bloc.strain);
  const kind = covert ? 'conspiracy' : 'bloc';
  const who = members.length >= 2 ? members.join(' and ') : (members[0] || 'a faction');
  const presence = covert
    ? `A quiet faction moves against the seat — ${who}, bound ${endPhrase(bloc.end)}.`
    : `${who} stand together as a bloc, ${endPhrase(bloc.end)}.`;
  /** @type {Record<string, unknown>} */
  const out = {
    id: String(bloc.id),
    kind,
    covert,
    memberCount: members.length,
    presence,
    strainBand: band,
    cohesion: STRAIN_WORDS[band],
  };
  if (includeGroundTruth) {
    out.truth = {
      members,
      end: bloc.end,
      strain: bloc.strain,
      sinceTick: bloc.sinceTick,
      glue: Array.isArray(bloc.glue) ? bloc.glue : [],
    };
  }
  return out;
}

/**
 * The politics fiction for ONE settlement — its blocs (and, when includeCovert,
 * its conspiracies), or null when it carries no ledger entry / no visible bloc.
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {unknown} args.settlementId
 * @param {boolean} [args.includeGroundTruth]  DM surfaces ⇒ true (raw truth block).
 * @param {boolean} [args.includeCovert]  DM surfaces ⇒ true (conspiracies surfaced).
 * @returns {Record<string, unknown> | null}
 */
export function settlementBlocs({ worldState, settlementId, includeGroundTruth = false, includeCovert = false } = /** @type {never} */ ({})) {
  if (settlementId == null) return null;
  const ledger = politicsLedgers(worldState);
  if (!ledger) return null;
  const all = blocsOf(ledger[String(settlementId)]);
  const visible = all.filter((b) => includeCovert || !b.covert);
  if (visible.length === 0) return null;
  const blocs = visible
    .slice()
    .sort((a, b) => compareCodepoint(String(a.id), String(b.id)))
    .map((b) => projectBloc(b, includeGroundTruth));
  return {
    settlementId: String(settlementId),
    blocCount: blocs.filter((b) => b.kind === 'bloc').length,
    conspiracyCount: blocs.filter((b) => b.kind === 'conspiracy').length,
    blocs,
  };
}

/**
 * The realm-wide politics view: every settlement carrying a visible bloc, ordered
 * codepoint on id. Dormant ⇒ [].
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {boolean} [args.includeGroundTruth]
 * @param {boolean} [args.includeCovert]
 * @param {(id: string) => string} [args.nameFor]
 * @returns {Array<Record<string, unknown>>}
 */
export function realmPolitics({ worldState, includeGroundTruth = false, includeCovert = false, nameFor = (id) => String(id) } = /** @type {never} */ ({})) {
  const ledger = politicsLedgers(worldState);
  if (!ledger) return [];
  const ids = Object.keys(ledger).sort(compareCodepoint);
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const id of ids) {
    const projection = settlementBlocs({ worldState, settlementId: id, includeGroundTruth, includeCovert });
    if (projection) out.push({ ...projection, where: nameFor(id) });
  }
  return out;
}

/**
 * Panel presence gate: does this world carry ANY bloc (covert included, so the DM
 * surface lights on conspiracies too)? Dormant ⇒ false ⇒ no surface ⇒ byte-identical.
 * @param {unknown} worldState @returns {boolean}
 */
export function hasPolitics(worldState) {
  const ledger = politicsLedgers(worldState);
  if (!ledger) return false;
  return Object.values(ledger).some((entry) => blocsOf(entry).length > 0);
}

/**
 * The campaign/save-scoped presence gate (mirrors campaignHasEpidemic).
 * @param {Array<{ settlementIds?: Array<string | number>, worldState?: unknown } | null> | null | undefined} campaigns
 * @param {unknown} saveId @returns {boolean}
 */
export function campaignHasPolitics(campaigns, saveId) {
  if (saveId == null || !Array.isArray(campaigns)) return false;
  const sid = String(saveId);
  return campaigns.some((campaign) => campaign
    && (campaign.settlementIds || []).map(String).includes(sid)
    && hasPolitics(campaign.worldState));
}
