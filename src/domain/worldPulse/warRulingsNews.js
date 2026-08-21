/**
 * warRulingsNews.js — WR-5's evidence-to-reader projection.
 *
 * Behavioral owners hand this leaf an explicit receipt for a fact that already
 * happened. This module never decides whether peace was offered, refused, or
 * accepted; never discovers a ruler/faction/ally; and never infers a succession.
 * It only joins that typed evidence to the governed fourteen-kind corpus.
 *
 * Names are source facts. A name must either resolve from the supplied snapshot
 * or travel beside its typed id on the evidence row. Missing identities fail
 * closed. Public rows ignore all patron fields; the sole patron-facing row is
 * `ruler_books_compromised`, which is structurally DM-only and covert.
 */

import { warRulingReceipt, WAR_RULING_KINDS } from './eventProse.js';
import { stablePart } from './stablePart.js';

const KIND_SET = new Set(WAR_RULING_KINDS);

const REQUIRED_IDENTITIES = Object.freeze({
  sued_for_peace_seat: Object.freeze(['settlement', 'counterpart', 'npc']),
  sued_for_peace_realm: Object.freeze(['settlement', 'counterpart']),
  war_continued_for_the_seat: Object.freeze(['settlement', 'counterpart', 'npc']),
  war_ended_against_rival_triumph: Object.freeze(['settlement', 'counterpart', 'npc']),
  peace_refused: Object.freeze(['settlement', 'counterpart']),
  refusal_cost_legitimacy: Object.freeze(['settlement']),
  refusal_cost_ally_patience: Object.freeze(['settlement', 'counterpart', 'thirdParty']),
  ruler_books_compromised: Object.freeze(['settlement', 'npc', 'faction']),
  war_party_overturns_peacemaker: Object.freeze(['settlement', 'npc', 'faction']),
  peace_party_overturns_warmonger: Object.freeze(['settlement', 'npc', 'faction']),
  succession_demand_inherited: Object.freeze(['settlement', 'npc', 'faction']),
  successor_repudiates_war: Object.freeze(['settlement', 'counterpart', 'npc']),
  successor_escalates_war: Object.freeze(['settlement', 'counterpart', 'npc']),
  war_dissolved_by_verdict: Object.freeze(['settlement', 'counterpart', 'npc']),
});

const HEADLINE = Object.freeze({
  sued_for_peace_seat: (x) => `${x.npc} sues ${x.counterpart} for peace on ${x.settlement}'s behalf`,
  sued_for_peace_realm: (x) => `${x.settlement} sues ${x.counterpart} for peace`,
  war_continued_for_the_seat: (x) => `${x.settlement}'s war with ${x.counterpart} continues for ${x.npc}'s seat`,
  war_ended_against_rival_triumph: (x) => `${x.settlement} ends its war with ${x.counterpart} against ${x.npc}'s triumph`,
  peace_refused: (x) => `${x.settlement} refuses ${x.counterpart}'s peace`,
  refusal_cost_legitimacy: (x) => `${x.settlement}'s seat pays for refusing peace`,
  refusal_cost_ally_patience: (x) => `${x.thirdParty} loses patience with ${x.settlement}'s war`,
  ruler_books_compromised: (x) => `${x.npc}'s war books answer to ${x.faction}`,
  war_party_overturns_peacemaker: (x) => `${x.faction} overturns ${x.npc}'s peace`,
  peace_party_overturns_warmonger: (x) => `${x.faction} overturns ${x.npc}'s war course`,
  succession_demand_inherited: (x) => `${x.faction}'s war demand follows ${x.npc} into the seat`,
  successor_repudiates_war: (x) => `${x.npc} calls ${x.settlement}'s levies home from ${x.counterpart}`,
  successor_escalates_war: (x) => `${x.npc} widens ${x.settlement}'s war with ${x.counterpart}`,
  war_dissolved_by_verdict: (x) => `${x.settlement} recalls its war from ${x.counterpart} after the verdict`,
});

const REASON = Object.freeze({
  sued_for_peace_seat: "The offerer's recorded books say the seat, rather than the realm alone, carried the decision.",
  sued_for_peace_realm: "The offerer's recorded books say the realm's position carried the decision.",
  war_continued_for_the_seat: "The recorded ruler and realm books diverged, and the seat's interest held the war open.",
  war_ended_against_rival_triumph: "The recorded ruler and realm books diverged over a rival's triumph.",
  peace_refused: 'The target court heard a recorded offer and chose to keep the war open.',
  refusal_cost_legitimacy: 'The recorded refusal cost the deciding court standing at home.',
  refusal_cost_ally_patience: 'A named ally remained in the field after the recorded refusal.',
  ruler_books_compromised: "The exact ruling seat is recorded as serving a foreign patron's interest.",
  war_party_overturns_peacemaker: 'A named war party organized around the recorded peace decision and took the seat.',
  peace_party_overturns_warmonger: 'A named peace party organized around the recorded war decision and took the seat.',
  succession_demand_inherited: 'The installing faction wrote its war demand into the recorded succession.',
  successor_repudiates_war: 'A recorded authority change broke the old course and the successor chose peace.',
  successor_escalates_war: 'A recorded authority change broke the old course and the successor chose war.',
  war_dissolved_by_verdict: 'The recorded verdict removed the officeholder who owned the quarrel, dissolved the live cause, and recalled that court\'s deployment.',
});

const BAND_WORD = Object.freeze({
  quiet: 'little',
  present: 'somewhat',
  pressing: 'deeply',
  decisive: 'heavily',
  secure: 'firm',
  // CR-ES-3: the seat-security middle rung is `holding`, not `contested`. THE WORD IS
  // UNCHANGED ON PURPOSE — this is a key rename, so the rendered sentence is
  // byte-identical for the same world and the retarget costs no prose. The lookup is
  // fed by `rulerSecurityBand`, which reaches here because `peaceDecisionRulingEvidence`
  // spreads the whole warTermination receipt onto every evidence row; a retarget that
  // moved the producer without moving this key would have dropped the `{band}` interp
  // slot out of the WR-5 receipts silently — no exception, no red, just a poorer
  // sentence. This is the FOURTH consumer, and the ruling's cost note named three.
  holding: 'uncertain',
  precarious: 'fragile',
  unseated: 'without a settled holder',
  narrow: 'slightly',
  clear: 'plainly',
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** Reader words cannot carry scalars, raw ids, JSON, or engine-token syntax. */
function readerText(value) {
  const valueText = text(value);
  if (!valueText || /[\d%\u00d7_{}\[\]]/u.test(valueText)) return '';
  if (/\b(?:rng|roll|score|ratio|tick|chance)\b/i.test(valueText)) return '';
  return valueText;
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

/** Resolve a snapshot item from either supported index shape. */
function itemFor(snapshot, id) {
  const key = text(id);
  if (!key) return null;
  if (snapshot?.byId instanceof Map) return snapshot.byId.get(key) || null;
  const byId = asObject(snapshot?.byId);
  if (Object.hasOwn(byId, key)) return byId[key];
  const rows = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  return rows.find((row) => text(asObject(row).id) === key) || null;
}

/** @param {unknown} item @returns {Record<string, unknown>} */
function settlementOf(item) {
  const row = asObject(item);
  const save = asObject(row.save);
  const nested = asObject(row.settlement || save.settlement);
  return Object.keys(nested).length ? nested : row;
}

/** A supplied display name is evidence only while paired with a distinct typed id. */
function pairedName(id, supplied) {
  const key = text(id);
  const name = readerText(supplied);
  return key && name && name !== key ? name : '';
}

/** @param {unknown} snapshot @param {string} id @param {unknown} supplied */
function settlementName(snapshot, id, supplied) {
  const item = itemFor(snapshot, id);
  const row = asObject(item);
  const settlement = settlementOf(item);
  const name = readerText(settlement.name || row.name || asObject(row.save).name);
  return name && name !== id ? name : pairedName(id, supplied);
}

/** Resolve a roster name by exact global/local id, then accept an id-paired receipt name. */
function npcName(snapshot, settlementId, id, supplied) {
  const key = text(id);
  const settlement = settlementOf(itemFor(snapshot, settlementId));
  const rows = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  for (const raw of rows) {
    const npc = asObject(raw);
    const localId = text(npc.id);
    const name = readerText(npc.name || npc.label);
    if (!key || !name) continue;
    if (key === localId || key === `${settlementId}:${localId}`
      || key === `${settlementId}:${stablePart(name)}`) return name;
  }
  return pairedName(key, supplied);
}

/** Resolve a faction name by exact id/name-derived id, then accept paired receipt evidence. */
function factionName(snapshot, settlementId, id, supplied) {
  const key = text(id);
  const settlement = settlementOf(itemFor(snapshot, settlementId));
  const power = asObject(settlement.powerStructure);
  const rows = Array.isArray(power.factions) ? power.factions
    : Array.isArray(settlement.factions) ? settlement.factions : [];
  for (const raw of rows) {
    const faction = asObject(raw);
    const explicitId = text(faction.id);
    const name = readerText(faction.faction || faction.name || faction.label);
    if (!key || !name) continue;
    if (key === explicitId || key === `${settlementId}:${explicitId}`
      || key === `${settlementId}:${stablePart(name)}`) return name;
  }
  return pairedName(key, supplied);
}

/** WR-5 receipt fields can be nested when a caller passes a decision wrapper. */
function flattenEvidence(raw) {
  const row = asObject(raw);
  const flat = { ...asObject(row.receipt), ...row };
  const demand = asObject(flat.warDemand);
  if (!Object.keys(demand).length) return flat;
  return {
    ...flat,
    actorId: flat.actorId || demand.actorId,
    targetId: flat.targetId || demand.targetId,
    decisionId: flat.decisionId || demand.decisionId,
    desiredAction: flat.desiredAction || demand.desiredAction,
  };
}

/** The two existing bilateral shapes use opposite primary sides. */
function settlementIdFor(kind, row) {
  const explicit = text(row.settlementId || row.actorId || row.attackerId);
  if (explicit) return explicit;
  if (kind === 'sued_for_peace_seat' || kind === 'sued_for_peace_realm') {
    return text(row.offererId);
  }
  return text(row.targetId);
}

function counterpartIdFor(kind, row) {
  const explicit = text(row.counterpartId || row.opponentId);
  if (explicit) return explicit;
  if (kind === 'sued_for_peace_seat' || kind === 'sued_for_peace_realm') {
    return text(row.targetId);
  }
  return text(row.offererId || row.targetId);
}

/** The seat/realm suing split must be supported by the books receipt itself. */
function interestAllows(kind, row) {
  if (kind !== 'sued_for_peace_seat' && kind !== 'sued_for_peace_realm') return true;
  const interest = text(row.interestServed || row.booksInterest);
  return kind === 'sued_for_peace_realm'
    ? interest === 'realm'
    : interest === 'seat' || interest === 'patron';
}

/** @param {string} significance */
function weight(significance) {
  return significance === 'major'
    ? { severity: 0.76, score: 78 }
    : { severity: 0.56, score: 58 };
}

/**
 * Project one already-earned WR-5 evidence record. Unknown kinds, missing source
 * ids/ticks, unsupported interest claims, and missing authored identities are
 * silence rather than generic prose.
 *
 * @param {{evidence?:unknown,snapshot?:unknown,now?:string|null}} input
 * @returns {Record<string, unknown>|null}
 */
export function warRulingNewsEntry({ evidence = null, snapshot = null, now = null } = {}) {
  const row = flattenEvidence(evidence);
  const kind = text(row.kind);
  // The `evidenceId` arm was deleted as writerless: the plural `evidenceIds` (an
  // array, on negotiation-picture and provisioning-record shapes) is the only
  // spelling any writer produces, and `git log -S "evidenceId:"` finds no assignment
  // of the singular on any branch. All four ruling-evidence producers write `id`.
  const sourceEventId = text(row.sourceEventId || row.id);
  const tick = wholeTick(row.tick);
  if (!KIND_SET.has(kind) || !sourceEventId || tick == null || !interestAllows(kind, row)) return null;

  const settlementId = settlementIdFor(kind, row);
  const counterpartId = counterpartIdFor(kind, row);
  const suppliedSettlement = row.settlementName || row.actorName || row.attackerName;
  const suppliedCounterpart = row.counterpartName || row.opponentName
    || (kind.startsWith('sued_for_peace_') ? row.targetName : row.offererName);
  const settlement = settlementName(snapshot, settlementId, suppliedSettlement);
  const counterpart = counterpartId
    ? settlementName(snapshot, counterpartId, suppliedCounterpart)
    : '';

  const npcId = text(row.npcId || row.rulerId || row.toRulerId);
  const npc = npcName(snapshot, settlementId, npcId, row.npcName || row.rulerName || row.toRulerName);

  // Patron identity is read ONLY for the private kind. Public kinds cannot leak
  // it through a faction slot, actor id, reason, tag, or address-chain field.
  const privateBooks = kind === 'ruler_books_compromised';
  const factionId = privateBooks
    ? text(row.patronId || row.factionId)
    : text(row.factionId || row.installerFactionId || row.governingFactionId);
  const faction = factionName(
    snapshot,
    privateBooks ? text(row.patronId || settlementId) : settlementId,
    factionId,
    privateBooks
      ? row.patronName || row.factionName
      : row.factionName || row.installerFactionName || row.governingFactionName,
  );

  const thirdPartyId = text(row.thirdPartyId || row.allyId);
  const thirdParty = thirdPartyId
    ? settlementName(snapshot, thirdPartyId, row.thirdPartyName || row.allyName)
    : '';
  const identities = { settlement, counterpart, npc, faction, thirdParty };
  if (REQUIRED_IDENTITIES[kind].some((key) => !identities[key])) return null;
  if (privateBooks && text(row.booksInterest || row.interestServed) !== 'patron') return null;

  const band = BAND_WORD[text(row.band || row.refusalCostBand || row.rulerSecurityBand)] || '';
  const reason = readerText(row.reason || row.booksPublicReason);
  const route = readerText(row.routeName || row.route);
  const interp = {
    settlement,
    counterpart,
    npc,
    faction,
    third_party: thirdParty,
    ...(band ? { band } : {}),
    ...(reason ? { reason } : {}),
    ...(route ? { route } : {}),
  };
  const receipt = warRulingReceipt(kind, sourceEventId, interp);
  const headline = HEADLINE[kind]?.(identities);
  if (!receipt || !readerText(headline) || !readerText(receipt.line)) return null;

  const settlementIds = [settlementId, counterpartId, thirdPartyId].filter(Boolean);
  const settlementNames = [settlement, counterpart, thirdParty].filter(Boolean);
  const presentation = weight(receipt.significance);
  return {
    id: `wizard_news.${tick}.${stablePart(kind)}.${stablePart(sourceEventId)}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: receipt.significance,
    severity: presentation.severity,
    score: presentation.score,
    headline,
    summary: receipt.line,
    kind: receipt.kind,
    impactKind: receipt.kind,
    channelType: receipt.section === 'adjudication' ? 'political_authority' : null,
    settlementIds: [...new Set(settlementIds)],
    settlementNames: [...new Set(settlementNames)],
    impactIds: [],
    channelIds: [],
    sourceEventId,
    tags: ['world_pulse', 'war_rulings', receipt.section],
    reasons: [REASON[kind]],
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
    // heraldRouting accepts an authored section only from this governed
    // projector. A generic record carrying a coincidental `section` field must
    // remain routed by its own content token.
    sectionAuthority: 'war_rulings_registry',
    ...(npcId ? { npcIds: [npcId] } : {}),
    ...(factionId ? { factionIds: [factionId] } : {}),
    ...(receipt.audience === 'dm-only' ? { covert: true } : {}),
  };
}

/**
 * Batch projection. Input order is irrelevant; duplicate source-kind evidence is
 * folded and output is codepoint-stable.
 *
 * @param {{evidence?:unknown[],snapshot?:unknown,now?:string|null}} input
 * @returns {Array<Record<string, unknown>>}
 */
export function warRulingNewsEntries({ evidence = [], snapshot = null, now = null } = {}) {
  const byId = new Map();
  for (const source of Array.isArray(evidence) ? evidence : []) {
    const entry = warRulingNewsEntry({ evidence: source, snapshot, now });
    if (entry && !byId.has(String(entry.id))) byId.set(String(entry.id), entry);
  }
  return [...byId.values()].sort((a, b) => (
    String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0
  ));
}
