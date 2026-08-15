/**
 * warCoalitionNews.js — WR-6's evidence-to-reader projection.
 *
 * The coalition graph, decision readers, and settlement writer own behavior.
 * This pure leaf accepts only their typed evidence, resolves exact identities,
 * translates closed qualitative bands into authored world words, and joins the
 * result to the governed twelve-kind receipt corpus. It never discovers a call,
 * alliance, payment, or peace from ambient state.
 */

import { fnv1a32, warCoalitionReceipt } from './eventProse.js';
import { stablePart } from './stablePart.js';
import {
  COALITION_REFUSAL_CAUSES,
  normalizeWarCoalitionEvidence,
} from './warCoalitionEvidence.js';

const THIRD_PARTY_KINDS = new Set([
  'coalition_entry_priced',
  'coalition_joined',
  'coalition_refused',
  'casus_alliance_obligation',
  'coalition_stayed',
  'coalition_separate_peace',
]);

const HEADLINE = Object.freeze({
  coalition_entry_priced: (x) => `${x.settlement} prices ${x.counterpart}'s war against ${x.thirdParty}`,
  coalition_joined: (x) => `${x.settlement} answers ${x.counterpart}'s call against ${x.thirdParty}`,
  coalition_refused: (x) => `${x.settlement} refuses ${x.counterpart}'s call against ${x.thirdParty}`,
  casus_alliance_obligation: (x) => `${x.settlement} names its compact with ${x.counterpart} as cause against ${x.thirdParty}`,
  mirror_obligation_discharged: (x) => `${x.settlement} discharges its obligation to ${x.counterpart}`,
  coalition_expenditure_read: (x) => `${x.settlement} reckons the cost of answering ${x.counterpart}`,
  coalition_stayed: (x) => `${x.settlement} stays in ${x.counterpart}'s war against ${x.thirdParty}`,
  coalition_separate_peace: (x) => `${x.settlement} leaves ${x.counterpart}'s war by making peace with ${x.thirdParty}`,
  coalition_apportionment: (x) => `${x.settlement}'s share of the coalition payment to ${x.counterpart} is apportioned`,
  coalition_spoils_divided: (x) => `${x.settlement}'s share of the coalition spoils is settled with ${x.counterpart}`,
  coalition_debt_paid: (x) => `${x.counterpart} pays its coalition debt to ${x.settlement}`,
  coalition_debt_unpaid: (x) => `${x.counterpart}'s coalition debt to ${x.settlement} goes unpaid`,
});

const REASON = Object.freeze({
  coalition_entry_priced: 'The deciding court read both the direct compact and the wider alliance web before answering.',
  coalition_joined: 'A recorded alliance call created a separate bilateral front with its own cause and ending.',
  coalition_refused: 'The called court recorded a refusal after reading the alliance web and its own books.',
  casus_alliance_obligation: "The caller's live cause and the surviving compact are the recorded grounds for this front.",
  mirror_obligation_discharged: 'Service under the compact turned the recorded obligation back into a bond.',
  coalition_expenditure_read: 'The bill is derived from deployed strength, recorded attrition, live territorial exposure, and attributable home-front evidence.',
  coalition_stayed: 'The allied court reread the open front through its own books and temperament and chose to remain.',
  coalition_separate_peace: 'One bilateral edge closed while the other fronts remained standing.',
  coalition_apportionment: 'The aggregate settlement was divided by capacity, culpability, field loss, and who called whom.',
  coalition_spoils_divided: 'The victors divided the settlement by who bled, who led, and who came late.',
  coalition_debt_paid: 'What the ally received answered what its existing books say it spent.',
  coalition_debt_unpaid: 'What the ally received fell short of what its existing books say it spent.',
});
const COALITION_REFUSAL_REASON = Object.freeze({
  strategic: REASON.coalition_refused,
  army_committed: 'The called court could not answer because its only field army was committed elsewhere.',
  army_returned: 'The called court could not answer because its army had only just returned.',
  home_threatened: 'The called court kept its army home because its own walls were threatened.',
  occupied: 'An occupying power prevented the called court from marching into a different war.',
  front_infeasible: 'The called court could not field a force capable of opening a separate front.',
});
if (Object.keys(COALITION_REFUSAL_REASON).sort().join('\u0000')
  !== [...COALITION_REFUSAL_CAUSES].sort().join('\u0000')) {
  throw new Error('Coalition refusal prose must cover every closed refusal cause.');
}

const BAND_WORDS = Object.freeze({
  coalition_entry_priced: Object.freeze({
    none: 'little risk', quiet: 'little risk', light: 'little risk', low: 'little risk',
    present: 'a real risk', modest: 'a real risk', moderate: 'a real risk', fair: 'a real risk',
    pressing: 'a grave risk', high: 'a grave risk', heavy: 'a grave risk', large: 'a grave risk',
    decisive: 'ruinous risk', severe: 'ruinous risk', extreme: 'ruinous risk', greatest: 'ruinous risk',
  }),
  coalition_expenditure_read: Object.freeze({
    none: 'lightly', quiet: 'lightly', light: 'lightly', low: 'lightly', small: 'lightly',
    present: 'noticeably', modest: 'noticeably', moderate: 'noticeably', fair: 'noticeably',
    pressing: 'deeply', high: 'deeply', heavy: 'deeply', large: 'deeply',
    decisive: 'mercilessly', severe: 'mercilessly', extreme: 'mercilessly', greatest: 'mercilessly',
  }),
  coalition_apportionment: Object.freeze({
    none: 'a slight share', quiet: 'a slight share', light: 'a slight share', low: 'a slight share', small: 'a slight share',
    present: 'a material share', modest: 'a material share', moderate: 'a material share', fair: 'a material share',
    pressing: 'a heavy share', high: 'a heavy share', heavy: 'a heavy share', large: 'a heavy share',
    decisive: 'the greater share', severe: 'the greater share', extreme: 'the greater share', greatest: 'the greater share',
  }),
  coalition_spoils_divided: Object.freeze({
    none: 'little', quiet: 'little', light: 'little', low: 'little', small: 'little',
    present: 'a fair share', modest: 'a fair share', moderate: 'a fair share', fair: 'a fair share',
    pressing: 'much', high: 'much', heavy: 'much', large: 'much',
    decisive: 'the greater part', severe: 'the greater part', extreme: 'the greater part', greatest: 'the greater part',
  }),
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
  if (/\b(?:rng|score|ratio|tick|chance|candidate|probability|odds|threshold|coefficient|multiplier|percent(?:age)?|per\s+cent|state\s*read)\b/i.test(valueText)) return '';
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

/** A supplied display name is evidence only while paired with a typed id. */
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

/** Route and good names need both the typed id and an authored paired label. */
function optionalPairedName(id, supplied) {
  return pairedName(id, supplied);
}

/** @param {string} kind @param {Record<string, unknown>} row */
function bandWord(kind, row) {
  const raw = text(
    row.band || row.riskBand || row.expenditureBand || row.costBand
    || row.shareBand || row.paymentBand || row.burdenBand,
  );
  return BAND_WORDS[kind]?.[raw] || '';
}

/** @param {string} significance */
function presentationWeight(significance) {
  return significance === 'major'
    ? { severity: 0.76, score: 78 }
    : { severity: 0.56, score: 58 };
}

/** Private call/relationship/settlement ids never ride a public news record. */
function publicSourceRef(kind, sourceEventId) {
  const basis = `${kind}\u0000${sourceEventId}`;
  const digest = [
    fnv1a32(`coalition-public-a\u0000${basis}`),
    fnv1a32(`coalition-public-b\u0000${basis}`),
  ].map((part) => part.toString(16).padStart(8, '0')).join('');
  return `coalition_receipt.${stablePart(kind)}.${digest}`;
}

/**
 * Project one already-earned WR-6 fact. Missing typed identities or authored
 * names fail closed. Missing optional band/route/good evidence merely removes
 * the pool families that name that fact.
 *
 * @param {{evidence?:unknown,snapshot?:unknown,now?:string|null}} input
 * @returns {Record<string, unknown>|null}
 */
export function warCoalitionNewsEntry({ evidence = null, snapshot = null, now = null } = {}) {
  const row = normalizeWarCoalitionEvidence(evidence);
  if (!row) return null;
  const kind = text(row.kind);
  const sourceEventId = text(row.id);
  const tick = /** @type {number} */ (row.tick);
  const settlementId = text(row.settlementId);
  const counterpartId = text(row.counterpartId);
  const thirdPartyId = THIRD_PARTY_KINDS.has(kind) ? text(row.thirdPartyId) : '';

  const settlement = settlementName(
    snapshot, settlementId, row.settlementName || row.actorName || row.attackerName,
  );
  const counterpart = settlementName(
    snapshot, counterpartId, row.counterpartName || row.callerName || row.opponentName,
  );
  const thirdParty = thirdPartyId
    ? settlementName(snapshot, thirdPartyId, row.thirdPartyName || row.enemyName || row.targetName)
    : '';
  if (!settlement || !counterpart || (THIRD_PARTY_KINDS.has(kind) && !thirdParty)) return null;

  const route = optionalPairedName(row.routeId, row.routeName);
  const good = optionalPairedName(row.goodId, row.goodName);
  const band = bandWord(kind, row);
  const interp = {
    settlement,
    counterpart,
    ...(thirdParty ? { third_party: thirdParty } : {}),
    ...(route ? { route } : {}),
    ...(good ? { good } : {}),
    ...(band ? { band } : {}),
  };
  const receipt = warCoalitionReceipt(kind, sourceEventId, interp);
  const headline = HEADLINE[kind]?.({ settlement, counterpart, thirdParty });
  const reason = kind === 'coalition_refused'
    ? COALITION_REFUSAL_REASON[text(row.refusalCause)] || REASON.coalition_refused
    : REASON[kind];
  if (!receipt || !readerText(headline) || !readerText(receipt.line) || !readerText(reason)) return null;

  const settlementIds = [settlementId, counterpartId, thirdPartyId].filter(Boolean);
  const settlementNames = [settlement, counterpart, thirdParty].filter(Boolean);
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
    channelType: receipt.section === 'adjudication' ? 'political_authority' : null,
    settlementIds: [...new Set(settlementIds)],
    settlementNames: [...new Set(settlementNames)],
    impactIds: [],
    channelIds: [],
    sourceEventId: publicSourceEventId,
    tags: ['world_pulse', 'war_coalition', receipt.section],
    reasons: [reason],
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
    sectionAuthority: 'war_coalition_registry',
  };
}

/**
 * Batch projection. Input order is irrelevant; retries of the same source-kind
 * fact fold to one stable reader entry.
 *
 * @param {{evidence?:unknown[],snapshot?:unknown,now?:string|null}} input
 * @returns {Array<Record<string, unknown>>}
 */
export function warCoalitionNewsEntries({ evidence = [], snapshot = null, now = null } = {}) {
  const byId = new Map();
  for (const source of Array.isArray(evidence) ? evidence : []) {
    const entry = warCoalitionNewsEntry({ evidence: source, snapshot, now });
    if (entry && !byId.has(String(entry.id))) byId.set(String(entry.id), entry);
  }
  return [...byId.values()].sort((left, right) => (
    String(left.id) < String(right.id) ? -1 : String(left.id) > String(right.id) ? 1 : 0
  ));
}
