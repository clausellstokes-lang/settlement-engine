/**
 * envoyNegotiationPictureBuilder.js — WR-7b's picture MINT, kept off the
 * integration leaf.
 *
 * `envoyDiplomacy.js` casts people and prices roads; this leaf does one other
 * thing: it turns an already-earned termination read plus the observer's own
 * beliefs into ONE closed, banded negotiation picture. It is the only place
 * where live settlement facts are allowed to become a picture, and it is
 * deliberately outside the K3 negotiation fence for exactly that reason: what
 * it mints is FROZEN at the moment of minting and never refreshed afterwards.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { factionArchetype } from '../factionArchetypes.js';
import { governingFactionOf } from '../rulingPower.js';
import { beliefRecord, strengthBandOf } from './beliefMap.js';
import {
  ENVOY_STRENGTH_BANDS,
  envoyOfferEpisodeKey,
  normalizeEnvoyPeaceOffer,
} from './envoyErrand.js';
import { createNegotiationPicture } from './negotiationPictures.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';
import { buildPressureSummary, settlementStrength } from './relationshipEvolution.js';
import { readWarSeatBooks } from './warSeatBooks.js';
import { readWarTerminationForParty } from './warTermination.js';

export const PRESSURE_BANDS = Object.freeze(['quiet', 'present', 'pressing', 'decisive']);
export const RATIO_BANDS = Object.freeze(['far_behind', 'behind', 'matched', 'ahead', 'far_ahead']);

export const STORES_FROM_PRESSURE = Object.freeze({
  quiet: 'deep',
  present: 'stocked',
  pressing: 'thin',
  decisive: 'bare',
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function wholeTick(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function snapshotItem(snapshot, id) {
  const key = text(id);
  if (!key) return null;
  if (snapshot?.byId instanceof Map) return snapshot.byId.get(key) || null;
  return (Array.isArray(snapshot?.settlements) ? snapshot.settlements : [])
    .find((row) => text(asObject(row).id) === key) || null;
}

function settlementOf(item) {
  const row = asObject(item);
  const direct = asObject(row.settlement);
  if (Object.keys(direct).length) return direct;
  return asObject(asObject(row.save).settlement);
}

/** Collision-free stable identity shared with the WR-7 ledgers. */
function stableParts(parts) {
  return parts.map((value) => {
    const part = String(value);
    return `${part.length}:${part}`;
  }).join('|');
}

/** @param {unknown} value */
function closedPressure(value) {
  const band = text(value);
  return PRESSURE_BANDS.includes(band) ? band : '';
}

/** The stronger of the known closed pressure reads; absence remains absence. */
function strongestClosedPressure(...values) {
  const known = values.map(closedPressure).filter(Boolean);
  return known.sort((left, right) => PRESSURE_BANDS.indexOf(right) - PRESSURE_BANDS.indexOf(left))[0] || '';
}

/** One court's believed opponent strength, never the current opponent truth. */
function believedOpponentStrengthBand(worldState, observerId, subjectId, ownBand, ratioBand) {
  const held = beliefRecord(worldState, observerId, subjectId);
  if (held && Number.isFinite(Number(held.strengthBand))) {
    const index = Math.max(0, Math.min(
      ENVOY_STRENGTH_BANDS.length - 1,
      Math.round(Number(held.strengthBand)),
    ));
    return ENVOY_STRENGTH_BANDS[index];
  }
  const ownIndex = ENVOY_STRENGTH_BANDS.indexOf(ownBand);
  const ratioIndex = RATIO_BANDS.indexOf(text(ratioBand));
  if (ownIndex < 0 || ratioIndex < 0) return '';
  const believedGap = ratioIndex - RATIO_BANDS.indexOf('matched');
  const opponentIndex = Math.max(0, Math.min(
    ENVOY_STRENGTH_BANDS.length - 1,
    ownIndex - believedGap,
  ));
  return ENVOY_STRENGTH_BANDS[opponentIndex];
}

/** Public court structure is lawful authored knowledge; missing structure is unknown. */
function governingArchetypeOf(item) {
  const governing = governingFactionOf(
    /** @type {Parameters<typeof governingFactionOf>[0]} */ (settlementOf(item)),
  );
  if (!governing) return 'unknown';
  const archetype = factionArchetype(governing);
  return ['merchant', 'military', 'religious'].includes(archetype) ? archetype : 'other';
}

/** Project existing seat-book character to the closed negotiation press ladder. */
function alignmentPressBandOf(worldState, snapshot, actorId, opponentId) {
  const books = readWarSeatBooks({ worldState, snapshot, actorId, opponentId });
  if (books.moralityBand === 'benevolent') return 'merciful';
  if (books.moralityBand === 'malicious') return 'punitive';
  if (books.lawfulnessBand === 'lawful') return 'hard';
  return 'measured';
}

/** A court knows its own explicitly authored export list, if one exists. */
function ownExportsOf(item) {
  const settlement = settlementOf(item);
  const containers = [
    asObject(settlement.economicState),
    asObject(settlement.economy),
    asObject(settlement.trade),
  ];
  const container = containers.find((row) => Array.isArray(row.exports));
  if (!container) return { exportKnowledge: 'unknown', exports: [] };
  const exports = [...new Set(container.exports.map((raw) => {
    if (typeof raw === 'string') return text(raw);
    const row = asObject(raw);
    return text(row.name || row.good || row.resource || row.label);
  }).filter(Boolean))].sort(compareCodepoint);
  return { exportKnowledge: 'known', exports };
}

/** Current own-court termination read used only at picture capture. */
function currentTerminationForPicture({ worldState, snapshot, partyId, counterpartId, tick }) {
  const pictureSnapshot = { ...asObject(snapshot), worldState };
  const pressures = pressureIndex(deriveSettlementPressures(pictureSnapshot));
  return readWarTerminationForParty({
    worldState,
    snapshot: pictureSnapshot,
    pIndex: pressures,
    tick,
    actorId: partyId,
    opponentId: counterpartId,
  });
}

/**
 * Freeze one party's qualitative picture. Self facts may read current truth;
 * opponent strength comes only from a held belief or the party's already-earned
 * believed balance. Unsupported observations normalize to explicit `unknown`.
 */
export function buildEnvoyNegotiationPicture({
  worldState,
  snapshot,
  offer: rawOffer,
  partyId,
  carrierKind,
  carrierId,
  tick,
  termination = null,
} = {}) {
  const offer = normalizeEnvoyPeaceOffer(rawOffer);
  const atTick = wholeTick(tick);
  const party = text(partyId);
  const carrier = text(carrierId);
  const kind = text(carrierKind);
  const payload = asObject(offer?.proposalPayload);
  const pair = [text(payload.offererId), text(payload.targetId)];
  const counterpartId = pair.find((id) => id && id !== party) || '';
  if (!offer || atTick == null || !party || !counterpartId || !carrier
    || !['envoy', 'court'].includes(kind)) return null;
  const terminationRead = asObject(termination).receipt
    ? asObject(termination)
    : currentTerminationForPicture({
        worldState,
        snapshot,
        partyId: party,
        counterpartId,
        tick: atTick,
      });
  const receipt = asObject(terminationRead.receipt);
  const partyItem = snapshotItem(snapshot, party);
  const counterpartItem = snapshotItem(snapshot, counterpartId);
  const liveSnapshot = { ...asObject(snapshot), worldState };
  const pressures = partyItem
    ? pressureIndex(deriveSettlementPressures(liveSnapshot))
    : null;
  const ownStrengthIndex = partyItem
    ? strengthBandOf(settlementStrength(partyItem, buildPressureSummary(pressures, party)))
    : -1;
  const ownStrengthBand = ENVOY_STRENGTH_BANDS[ownStrengthIndex] || '';
  const counterpartStrengthBand = believedOpponentStrengthBand(
    worldState,
    party,
    counterpartId,
    ownStrengthBand,
    receipt.believedBalanceBand,
  );
  const components = asObject(receipt.homeFrontComponents);
  const storesPressure = closedPressure(asObject(components.stores).band);
  const foodPressureBand = storesPressure;
  const economyPressureBand = strongestClosedPressure(
    asObject(components.hands).band,
    asObject(components.institutions).band,
  );
  const tradePressureBand = closedPressure(asObject(components.markets).band);
  const ratio = text(receipt.believedBalanceBand);
  const threatBand = ratio === 'far_behind' ? 'decisive'
    : ratio === 'behind' ? 'pressing'
      : ratio === 'matched' ? 'present'
        : ['ahead', 'far_ahead'].includes(ratio) ? 'quiet' : '';
  const causeStatus = ['dissolved', 'anchor_unavailable', 'live'].includes(text(receipt.causeState))
    ? text(receipt.causeState)
    : 'unknown';
  if (!partyItem || !counterpartItem || !ownStrengthBand || !counterpartStrengthBand) return null;
  const ownSubject = {
    settlementId: party,
    strengthBand: ownStrengthBand,
    ...(storesPressure ? { storesBand: STORES_FROM_PRESSURE[storesPressure] } : {}),
    ...(foodPressureBand ? { foodPressureBand } : {}),
    ...(economyPressureBand ? { economyPressureBand } : {}),
    ...(tradePressureBand ? { tradePressureBand } : {}),
    ...(threatBand ? { threatBand } : {}),
    ...(closedPressure(receipt.costToContinueBand)
      ? { warExhaustionBand: closedPressure(receipt.costToContinueBand) }
      : {}),
    governingArchetype: governingArchetypeOf(partyItem),
    alignmentPressBand: alignmentPressBandOf(worldState, snapshot, party, counterpartId),
    ...ownExportsOf(partyItem),
  };
  const counterpartSubject = {
    settlementId: counterpartId,
    strengthBand: counterpartStrengthBand,
    governingArchetype: governingArchetypeOf(counterpartItem),
    alignmentPressBand: alignmentPressBandOf(worldState, snapshot, counterpartId, party),
  };
  const episodeKey = envoyOfferEpisodeKey(offer);
  const pictureId = `negotiation_picture:${stableParts([
    kind,
    carrier,
    party,
    counterpartId,
    episodeKey,
    atTick,
  ])}`;
  return createNegotiationPicture({
    id: pictureId,
    carrier: { kind, id: carrier },
    partyId: party,
    counterpartId,
    relationshipKey: String(offer.relationshipKey),
    episodeKey,
    frontOwnerId: String(payload.peaceFrontOwnerId),
    frontSinceTick: Number(payload.peaceFrontSinceTick),
    capturedTick: atTick,
    causeStatus,
    subjects: [ownSubject, counterpartSubject],
    evidenceIds: text(receipt.id) ? [String(receipt.id)] : [],
  });
}
