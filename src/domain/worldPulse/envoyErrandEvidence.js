/**
 * envoyErrand/evidence — the typed rows an errand hands to the news and belief adapters.
 *
 * A PURE LEAF OF THE ENVOY-ERRAND WRITER FAMILY (ruling R-BLD-4). The family head emits
 * evidence; it does not compose it. This leaf composes it and writes nothing.
 *
 *   THE ADDRESS CHAIN — every row carries the errand, the person, BOTH settlements, the
 *     source offer and the state it was in (NEWS ADDRESS LAW). The route reference is read
 *     off the leg the traveller actually stands on, so a headline can name the road.
 *   THE LOSS PAIR — a closed errand emits `envoy_lost`, and a loss that was CARRYING a
 *     signed sheet emits `terms_never_reached` beside it. The pair is minted in one place
 *     so a second closing path cannot forget the second row, which is the receipt a court
 *     needs to learn that peace died on the road.
 *
 * This leaf never writes Wizard News or another subsystem's ledger — it returns rows, and
 * the integration adapters decide what becomes a story.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/envoyErrand.test.js + tests/domain/envoyNews.test.js
 */
import {
  EVIDENCE_KIND_SET,
  asObject,
  cloneData,
  text,
  wholeTick,
} from './envoyErrandVocabulary.js';
import { normalizeEnvoyEvidence, normalizeErrand } from './envoyErrandRecords.js';
import { normalizeRouteRef } from './envoyErrandTransit.js';

/** @param {Record<string, unknown>} errand @param {string} kind @param {number} tick @param {Record<string, unknown>} [extra] */
export function evidenceFor(errand, kind, tick, extra = {}) {
  const offer = /** @type {Record<string, unknown>} */ (errand.offer);
  const position = asObject(errand.positionRef);
  const journeyLegs = Array.isArray(errand.legs)
    ? errand.legs.filter((leg) => asObject(leg).journey === position.journey)
    : [];
  const currentLeg = wholeTick(position.legIndex) == null
    ? null
    : asObject(journeyLegs[/** @type {number} */ (wholeTick(position.legIndex))]);
  const routeRef = normalizeRouteRef(currentLeg?.routeRef);
  return /** @type {Record<string, unknown>} */ (normalizeEnvoyEvidence({
    id: `envoy_evidence:${kind}:${String(errand.id)}:${tick}`,
    kind,
    tick,
    errandId: errand.id,
    npcId: errand.npcId,
    settlementId: errand.from,
    counterpartId: errand.to,
    sourceOfferId: offer.outcomeId,
    state: errand.state,
    ...(text(errand.npcName) ? { npcName: text(errand.npcName) } : {}),
    ...(text(errand.fromName) ? { settlementName: text(errand.fromName) } : {}),
    ...(text(errand.toName) ? { counterpartName: text(errand.toName) } : {}),
    ...(routeRef ? {
      routeId: routeRef.id,
      ...(routeRef.name ? { routeName: routeRef.name } : {}),
    } : {}),
    ...extra,
  }));
}

/** Detached typed evidence factory for adapters that observe an existing row. */
export function envoyEvidenceFor(errand, kind, tick, extra = {}) {
  const normalized = normalizeErrand(errand);
  const at = wholeTick(tick);
  if (!normalized || !EVIDENCE_KIND_SET.has(text(kind)) || at == null) return null;
  return evidenceFor(normalized, text(kind), at, asObject(cloneData(extra)));
}

/** @param {Record<string, unknown>} errand */
export function termSheetIdOf(errand) {
  const sheet = asObject(errand.termSheet);
  return text(sheet.id || sheet.termSheetId || sheet.treatyId);
}

/** @param {Record<string, unknown>} current @param {number} tick @param {string} cause */
export function lostErrand(current, tick, cause) {
  return {
    ...current,
    state: 'lost',
    lossCause: cause,
    lostTick: tick,
    closedTick: tick,
  };
}

/** @param {Record<string, unknown>} errand @param {number} tick */
export function lostEvidence(errand, tick) {
  const rows = [evidenceFor(errand, 'envoy_lost', tick, { lossCause: errand.lossCause })];
  if (errand.termSheet) {
    const termSheetId = termSheetIdOf(errand);
    rows.push(evidenceFor(errand, 'terms_never_reached', tick, {
      lossCause: errand.lossCause,
      ...(termSheetId ? { termSheetId } : {}),
    }));
  }
  return rows;
}
