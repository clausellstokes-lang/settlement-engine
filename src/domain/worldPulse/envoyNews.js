/**
 * envoyNews.js — WR-7a's typed evidence-to-reader projection.
 *
 * The errand writer owns behavior and emits closed evidence. This pure leaf
 * discovers nothing from ambient war state: it resolves the two typed courts and
 * the durable H1 person, admits only paired route prose, and projects one of the
 * seven governed scalar-free receipt families. Missing identity is silence.
 */

import { envoyReceipt, fnv1a32 } from './eventProse.js';
import { ENVOY_EVIDENCE_KINDS, normalizeEnvoyEvidence } from './envoyErrand.js';
import { stablePart } from './stablePart.js';

const KIND_SET = new Set(ENVOY_EVIDENCE_KINDS);

const HEADLINE = Object.freeze({
  envoy_departed: (x) => `${x.npc} leaves ${x.settlement} for ${x.counterpart}'s court`,
  envoy_on_the_road: (x) => `${x.npc} is on the road between ${x.settlement} and ${x.counterpart}`,
  envoy_returning: (x) => `${x.npc} carries terms home to ${x.settlement}`,
  envoy_home: (x) => `${x.npc} returns to ${x.settlement} with word from ${x.counterpart}`,
  envoy_lost: (x) => `${x.npc} is lost between ${x.settlement} and ${x.counterpart}`,
  envoy_silence_inference: (x) => `${x.settlement} fears ${x.counterpart} has taken its legate`,
  terms_never_reached: (x) => `Terms between ${x.settlement} and ${x.counterpart} never reached home`,
});

const REASON = Object.freeze({
  envoy_departed: 'The court entrusted a live peace offer to one named person on the lived road network.',
  envoy_on_the_road: 'The message remains in transit while the physical war stays open.',
  envoy_returning: 'Terms have no authority until the returning legate tells them at home.',
  envoy_home: 'The named legate completed the mandatory return and delivered the court’s answer.',
  envoy_lost: 'The errand closed without inventing knowledge of what happened beyond the recorded loss.',
  envoy_silence_inference: 'The expected return passed without word, so the court hardened a belief from silence rather than truth.',
  terms_never_reached: 'An agreement existed in transit but never arrived where it could acquire authority.',
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

/** Reader words cannot carry scalars, raw ids, JSON, or tuning vocabulary. */
function readerText(value) {
  const valueText = text(value);
  if (!valueText || /[\d%\u00d7_{}\[\]]/u.test(valueText)) return '';
  if (/\b(?:rng|roll|score|ratio|tick|chance|candidate|probability|odds|threshold|coefficient|multiplier|percent(?:age)?|per\s+cent|state\s*read)\b/i.test(valueText)) return '';
  return valueText;
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

/** Resolve a durable H1 person from its sole ledger, then accept paired evidence. */
function npcName(snapshot, npcId, supplied) {
  const key = text(npcId);
  if (!key) return '';
  const spatial = asObject(asObject(snapshot?.worldState).spatialLedgers);
  const ledger = asObject(spatial.npcLedger);
  const record = asObject(asObject(ledger.roamers)[key] || asObject(ledger.placed)[key]);
  const name = readerText(asObject(record.identityFacets).name || asObject(record.originRef).name);
  return name && name !== key ? name : pairedName(key, supplied);
}

/** @param {string} significance */
function presentationWeight(significance) {
  if (significance === 'major') return { severity: 0.76, score: 78 };
  if (significance === 'routine') return { severity: 0.34, score: 36 };
  return { severity: 0.56, score: 58 };
}

/** Hide errand/offer ids while retaining exact-once public identity. */
function publicSourceRef(kind, sourceEventId) {
  const basis = `${kind}\u0000${sourceEventId}`;
  const digest = [
    fnv1a32(`envoy-public-a\u0000${basis}`),
    fnv1a32(`envoy-public-b\u0000${basis}`),
  ].map((part) => part.toString(16).padStart(8, '0')).join('');
  return `envoy_receipt.${stablePart(kind)}.${digest}`;
}

/**
 * Project one already-earned WR-7a evidence row. Unknown kinds, malformed
 * evidence, or unresolved typed identities fail closed.
 *
 * @param {{evidence?:unknown,snapshot?:unknown,now?:string|null}} input
 * @returns {Record<string, unknown>|null}
 */
export function envoyNewsEntry({ evidence = null, snapshot = null, now = null } = {}) {
  const row = normalizeEnvoyEvidence(evidence);
  if (!row) return null;
  const kind = text(row.kind);
  const sourceEventId = text(row.id);
  const tick = Number.isInteger(row.tick) && Number(row.tick) >= 0 ? Number(row.tick) : null;
  if (!KIND_SET.has(kind) || !sourceEventId || tick == null) return null;

  const settlementId = text(row.settlementId);
  const counterpartId = text(row.counterpartId);
  const npcId = text(row.npcId);
  const settlement = settlementName(snapshot, settlementId, row.settlementName);
  const counterpart = settlementName(snapshot, counterpartId, row.counterpartName);
  const npc = npcName(snapshot, npcId, row.npcName);
  if (!settlement || !counterpart || !npc) return null;

  const route = pairedName(row.routeId, row.routeName);
  const identities = { settlement, counterpart, npc };
  const receipt = envoyReceipt(kind, sourceEventId, {
    ...identities,
    ...(route ? { route } : {}),
  });
  const headline = HEADLINE[kind]?.(identities);
  const reason = REASON[kind];
  if (!receipt || !readerText(headline) || !readerText(receipt.line) || !readerText(reason)) return null;

  const weight = presentationWeight(receipt.significance);
  const publicSourceEventId = publicSourceRef(kind, sourceEventId);
  return {
    id: `wizard_news.${tick}.${stablePart(kind)}.${publicSourceEventId.split('.').at(-1)}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: receipt.significance,
    severity: weight.severity,
    score: weight.score,
    headline,
    summary: receipt.line,
    kind: receipt.kind,
    impactKind: receipt.kind,
    channelType: receipt.section === 'adjudication'
      ? 'political_authority'
      : receipt.section === 'divination' ? 'information_flow' : null,
    settlementIds: [settlementId, counterpartId],
    settlementNames: [settlement, counterpart],
    npcIds: [npcId],
    impactIds: [],
    channelIds: [],
    sourceEventId: publicSourceEventId,
    tags: ['world_pulse', 'envoy', receipt.section],
    reasons: [reason],
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
    sectionAuthority: 'envoy_registry',
  };
}

/** Stable, exact-once batch projection. */
export function envoyNewsEntries({ evidence = [], snapshot = null, now = null } = {}) {
  const byId = new Map();
  for (const source of Array.isArray(evidence) ? evidence : []) {
    const entry = envoyNewsEntry({ evidence: source, snapshot, now });
    if (entry && !byId.has(String(entry.id))) byId.set(String(entry.id), entry);
  }
  return [...byId.values()].sort((left, right) => (
    String(left.id) < String(right.id) ? -1 : String(left.id) > String(right.id) ? 1 : 0
  ));
}
