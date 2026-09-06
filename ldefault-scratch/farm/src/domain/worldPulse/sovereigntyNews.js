/**
 * sovereigntyNews.js — WR-10's evidence-to-reader projection (the sovereignty market).
 *
 * Behavioral owners hand this leaf a typed fact that already happened: the conveyance
 * writer's `newsSeeds` (sovereigntyTransfer.js), the market composer's clearing and
 * no-trade receipts, and the DM verb's executed order. This module never decides whether
 * a settlement was offered, sold, refused, or ceded; never discovers a seller, buyer,
 * asset, house, temple, or seat; and never prices anything. It only joins that typed
 * evidence to the governed fifteen-kind corpus authored in
 * docs/content/RECEIPT_POOLS_WAR.md under `# WR-10 — THE SOVEREIGNTY MARKET`.
 *
 * Names are source facts. A name must either resolve from the supplied snapshot or travel
 * beside its typed id on the evidence row. Missing identities fail CLOSED — the row is
 * refused, never rendered with a slug or a blank where a town's name belongs.
 *
 * ⚠ THE SLOT ROLES ARE PER-KIND, AND ONE KIND INVERTS THEM. Fourteen of the fifteen kinds
 * bind `{counterpart}` to the SELLER and `{third_party}` to the BUYER. `sovereignty_no_trade`
 * is authored the other way round — its first variant reads "{counterpart} would not take
 * what {third_party} could bear to give", so there `{counterpart}` is the BUYER (the party
 * that would not take) and `{third_party}` is the SELLER (the party that could bear to
 * give). A single global binding would make that sentence assert that the seller refused
 * its own sale — compiling, passing, and exactly backwards. SLOT_ROLES below is the whole
 * cure and the walker pins the inversion by name.
 *
 * THE COVERT ROW. `sale_books_diverged` is the WR-10 twin of WR-5's
 * `ruler_books_compromised`: structurally DM-only and covert, and fail-closed UPSTREAM —
 * a row whose books reading does not positively name the SEAT as the interest served is
 * REFUSED here, not redacted downstream, because a redaction still admits the fact existed.
 * The war volume's §5 Lifecycle-paths clause (landed 2026-08-04) is the authority: "Herald
 * kinds ride the governed projector with audience projection (dm-only ⇒ covert, the
 * ruler_books_compromised discipline for the books-divergence kind)". The content annex
 * marks that kind `AUDIENCE: public`; the volume outranks the annex by the annex's own
 * stated conflict rule, and the divergence is disclosed rather than silently resolved.
 *
 * BYTE NEUTRALITY (T4). Actor-id keys spread in ONLY when non-empty — an empty array is a
 * key and a key is a byte.
 *
 * NO FABRICATED BANDS. `{band}` is filled only from an authored qualitative token supplied
 * by the producer. A raw scalar on the evidence (a resistance figure, a price) is never
 * banded here: inventing a threshold ladder at the projection layer would mint an unsoaked
 * band nobody ratified, and the pools each carry slotless variants precisely so an absent
 * band degrades to an honest authored sentence instead of a number in prose.
 */

import { fnv1a32 } from './eventProse.js';
import { SOVEREIGNTY_RECEIPTS } from './sovereigntyReceiptPools.js';
import { stablePart } from './stablePart.js';

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/**
 * @typedef {{kind:string,significance:'major'|'notable'|'routine',
 * audience:'public'|'dm-only',section:'trade'|'events'|'faith'|'adjudication',
 * pool:readonly ProseVariant[],requiredSlots:ReadonlyArray<readonly string[]>}} SovereigntyRegistryEntry
 */

/**
 * @param {string} kind
 * @param {'major'|'notable'|'routine'} significance
 * @param {'public'|'dm-only'} audience
 * @param {'trade'|'events'|'faith'|'adjudication'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<SovereigntyRegistryEntry>}
 */
function sovereigntyKindRow(kind, significance, audience, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (SOVEREIGNTY_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/**
 * The governed WR-10 reader kinds. Significance, audience and desk are the annex's own
 * declarations; `requiredSlots` is derived per template from the slots that template
 * actually interpolates, so a family whose named evidence is absent is skipped rather
 * than rendered with a hole. Every pool carries at least one slotless family.
 * @type {ReadonlyArray<Readonly<SovereigntyRegistryEntry>>}
 */
export const SOVEREIGNTY_KIND_REGISTRY = Object.freeze([
  sovereigntyKindRow('sovereignty_sale_offered', 'notable', 'public', 'trade',
    [['counterpart', 'good', 'route', 'settlement'], [], [], [], [], ['route', 'settlement']]),
  sovereigntyKindRow('sovereignty_sale_cleared', 'major', 'public', 'trade',
    [['counterpart', 'third_party'], ['good', 'route', 'settlement'], [], [], []]),
  sovereigntyKindRow('sovereignty_no_trade', 'routine', 'public', 'trade',
    [['counterpart', 'third_party'], [], ['band'], [], [], ['settlement'], [], [], ['counterpart', 'third_party'], []]),
  sovereigntyKindRow('sovereignty_swap', 'major', 'public', 'trade',
    [['counterpart', 'third_party'], ['settlement'], [], [], []]),
  sovereigntyKindRow('cession_for_peace', 'major', 'public', 'adjudication',
    [['counterpart', 'settlement'], [], [], [], ['reason']]),
  sovereigntyKindRow('sovereignty_edge_rewritten', 'notable', 'public', 'events',
    [['settlement', 'third_party'], [], ['route'], [], [], []]),
  sovereigntyKindRow('sold_settlement_grievance', 'major', 'public', 'events',
    [['settlement'], [], [], [], ['counterpart']]),
  sovereigntyKindRow('bought_seat_fragility', 'notable', 'public', 'adjudication',
    [['band', 'settlement', 'third_party'], [], [], [], [], []]),
  sovereigntyKindRow('lineage_survives_the_sale', 'notable', 'public', 'events',
    [['counterpart', 'settlement'], [], [], ['third_party'], [], []]),
  sovereigntyKindRow('wartime_firesale', 'notable', 'public', 'trade',
    [['counterpart', 'settlement'], [], ['band'], [], ['third_party'], ['settlement']]),
  sovereigntyKindRow('sovereignty_sale_judged', 'notable', 'public', 'faith',
    [['counterpart', 'settlement'], [], ['temple'], [], ['counterpart'], []]),
  sovereigntyKindRow('kinship_opposes_the_sale', 'notable', 'public', 'adjudication',
    [['counterpart', 'settlement'], ['house'], [], [], [], []]),
  sovereigntyKindRow('sale_books_diverged', 'major', 'dm-only', 'adjudication',
    [['npc', 'settlement'], [], [], [], []]),
  sovereigntyKindRow('overflow_valve_sold', 'notable', 'public', 'events',
    [['counterpart'], [], ['band'], [], [], []]),
  sovereigntyKindRow('streams_rerouted', 'routine', 'public', 'trade',
    [['counterpart', 'good', 'third_party'], ['route', 'settlement'], [], ['counterpart'], [], [], ['counterpart'], ['route'], [], ['third_party']]),
]);

/** The exact WR-10 governed reader-kind set. */
export const SOVEREIGNTY_KINDS = Object.freeze(
  SOVEREIGNTY_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<SovereigntyRegistryEntry>>} */
const KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<SovereigntyRegistryEntry>]>} */ (
    SOVEREIGNTY_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

const KIND_SET = new Set(SOVEREIGNTY_KINDS);

/**
 * ⚠ THE PER-KIND SLOT ROLES (see the module header). `counterpart` and `third_party` are
 * bound to the trade's roles kind by kind, because `sovereignty_no_trade` is authored with
 * them the other way round and a uniform binding would invert who refused the bargain.
 * `settlement` is the conveyed ASSET in every kind that names it.
 * @type {Readonly<Record<string, { counterpart: 'seller'|'buyer', third_party: 'seller'|'buyer' }>>}
 */
const SLOT_ROLES = Object.freeze({
  // The one inversion, authored: "{counterpart} would not take what {third_party} could
  // bear to give" — the party that would not take is the BUYER.
  sovereignty_no_trade: Object.freeze({ counterpart: 'buyer', third_party: 'seller' }),
});
const DEFAULT_SLOT_ROLES = Object.freeze({ counterpart: 'seller', third_party: 'buyer' });

/** The identities a kind's address chain cannot be honest without.
 *  @type {Readonly<Record<string, readonly string[]>>} */
const REQUIRED_IDENTITIES = Object.freeze({
  sovereignty_sale_offered: Object.freeze(['settlement', 'counterpart']),
  sovereignty_sale_cleared: Object.freeze(['settlement', 'counterpart', 'third_party']),
  sovereignty_no_trade: Object.freeze(['settlement', 'counterpart', 'third_party']),
  sovereignty_swap: Object.freeze(['settlement', 'counterpart', 'third_party']),
  cession_for_peace: Object.freeze(['settlement', 'counterpart']),
  sovereignty_edge_rewritten: Object.freeze(['settlement', 'third_party']),
  sold_settlement_grievance: Object.freeze(['settlement', 'counterpart']),
  bought_seat_fragility: Object.freeze(['settlement', 'third_party']),
  lineage_survives_the_sale: Object.freeze(['settlement', 'counterpart', 'third_party']),
  wartime_firesale: Object.freeze(['settlement', 'counterpart', 'third_party']),
  sovereignty_sale_judged: Object.freeze(['settlement', 'counterpart']),
  kinship_opposes_the_sale: Object.freeze(['settlement', 'counterpart']),
  sale_books_diverged: Object.freeze(['settlement', 'npc']),
  overflow_valve_sold: Object.freeze(['settlement', 'counterpart']),
  streams_rerouted: Object.freeze(['settlement', 'counterpart', 'third_party']),
});

/** Headlines name the parties and assert only what the evidence already earned.
 *  @type {Readonly<Record<string, (x: Record<string, string>) => string>>} */
const HEADLINE = Object.freeze({
  sovereignty_sale_offered: (x) => `${x.seller} offers ${x.asset} for sale`,
  sovereignty_sale_cleared: (x) => `${x.asset} passes from ${x.seller} to ${x.buyer}`,
  sovereignty_no_trade: (x) => `${x.buyer} and ${x.seller} part without a price for ${x.asset}`,
  sovereignty_swap: (x) => `${x.seller} and ${x.buyer} exchange settlements`,
  cession_for_peace: (x) => `${x.seller} cedes ${x.asset} to end the war`,
  sovereignty_edge_rewritten: (x) => `${x.asset} answers to ${x.buyer} now`,
  sold_settlement_grievance: (x) => `${x.asset} holds its sale against ${x.seller}`,
  bought_seat_fragility: (x) => `${x.buyer} holds ${x.asset} on a seat it bought`,
  lineage_survives_the_sale: (x) => `${x.seller} sold ${x.asset} and remains its founder`,
  wartime_firesale: (x) => `${x.seller} sells ${x.asset} in the middle of its war`,
  sovereignty_sale_judged: (x) => `${x.seller}'s sale of ${x.asset} is weighed abroad`,
  kinship_opposes_the_sale: (x) => `${x.seller} will not sell ${x.asset}`,
  sale_books_diverged: (x) => `${x.npc} sold ${x.asset} to keep the seat`,
  overflow_valve_sold: (x) => `${x.seller} sold the steading its overflow needed`,
  streams_rerouted: (x) => `${x.asset}'s streams run to ${x.buyer} now`,
});

/** The recorded reason — the address law's fourth field.
 *  @type {Readonly<Record<string, string>>} */
const REASON = Object.freeze({
  sovereignty_sale_offered: 'A recorded holder offered a settlement it holds, and the offer names the bundle it asks for.',
  sovereignty_sale_cleared: "Both courts valued the same bundle through their own needs, and the seller's reserve sat under the buyer's ceiling.",
  sovereignty_no_trade: 'The recorded bundle never bridged the two courts, and the absence is entered with its reason.',
  sovereignty_swap: 'Two conveyances were minted together on one shared swap, and neither stood without the other.',
  cession_for_peace: 'The recorded terms named a settlement as the price of ending the war.',
  sovereignty_edge_rewritten: 'The holding edge was rewritten to the buyer; the founding line and the people were not.',
  sold_settlement_grievance: 'The conveyed settlement holds a recorded grievance against the court that conveyed it.',
  bought_seat_fragility: 'Authority obtained by purchase begins with the standing of a seat nobody fought for.',
  lineage_survives_the_sale: 'The founding entry survives the conveyance, and a founding entry is a claim in waiting.',
  wartime_firesale: "The sale was recorded while the seller's war was live, and the price carries the buyer's reading of it.",
  sovereignty_sale_judged: "An observing court weighed the sale on its own axis against what it believes of the buyer.",
  kinship_opposes_the_sale: 'A recorded kinship bond on the pair outweighed the bundle, and the sale scored nothing.',
  sale_books_diverged: "The recorded seat and realm books wanted opposite things, and the seat's interest signed.",
  overflow_valve_sold: "The conveyed steading was the parent settlement's recorded outlet for its own overflow.",
  streams_rerouted: 'The goods that answered to the seller answer to the buyer, by the recorded edge.',
});

/** Authored qualitative band tokens → the reader words the pools interpolate.
 *  @type {Readonly<Record<string, string>>} */
const BAND_WORD = Object.freeze({
  quiet: 'little',
  present: 'somewhat',
  pressing: 'deeply',
  decisive: 'heavily',
  secure: 'firm',
  contested: 'uncertain',
  precarious: 'fragile',
  unseated: 'without a settled holder',
  narrow: 'slightly',
  clear: 'plainly',
  slight: 'a little',
  moderate: 'some',
  steep: 'a great deal',
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

/** Reader words cannot carry scalars, raw ids, JSON, or engine-token syntax.
 *  @param {unknown} value @returns {string} */
function readerText(value) {
  const valueText = text(value);
  if (!valueText || /[\d%×_{}[\]]/u.test(valueText)) return '';
  if (/\b(?:rng|roll|score|ratio|tick|chance)\b/i.test(valueText)) return '';
  return valueText;
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

/** Resolve a snapshot item from either supported index shape.
 *  @param {unknown} snapshot @param {unknown} id @returns {unknown} */
function itemFor(snapshot, id) {
  const key = text(id);
  if (!key) return null;
  const snap = asObject(snapshot);
  const index = snap.byId;
  if (index instanceof Map) return index.get(key) ?? null;
  const byId = asObject(index);
  if (Object.hasOwn(byId, key)) return byId[key];
  const rows = Array.isArray(snap.settlements) ? snap.settlements : [];
  return rows.find((row) => text(asObject(row).id) === key) ?? null;
}

/** @param {unknown} item @returns {Record<string, unknown>} */
function settlementOf(item) {
  const row = asObject(item);
  const save = asObject(row.save);
  const nested = asObject(row.settlement || save.settlement);
  return Object.keys(nested).length ? nested : row;
}

/** A supplied display name is evidence only while paired with a distinct typed id.
 *  @param {unknown} id @param {unknown} supplied @returns {string} */
function pairedName(id, supplied) {
  const key = text(id);
  const name = readerText(supplied);
  return key && name && name !== key ? name : '';
}

/** @param {unknown} snapshot @param {string} id @param {unknown} supplied @returns {string} */
function settlementName(snapshot, id, supplied) {
  const item = itemFor(snapshot, id);
  const row = asObject(item);
  const settlement = settlementOf(item);
  const name = readerText(settlement.name || row.name || asObject(row.save).name);
  return name && name !== id ? name : pairedName(id, supplied);
}

/** Resolve a roster name by exact global/local id, then accept an id-paired receipt name.
 *  @param {unknown} snapshot @param {string} settlementId @param {string} id
 *  @param {unknown} supplied @returns {string} */
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

/**
 * Resolve one WR-10 sentence without inventing a party, house, temple, route, good, or
 * qualitative band. Families whose named source facts are absent are ineligible; their
 * slotless siblings remain honest authored fallbacks.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function sovereigntyReceipt(kind, seed, interp = {}) {
  const row = KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/** @param {string} significance */
function presentationWeight(significance) {
  if (significance === 'major') return { severity: 0.76, score: 78 };
  if (significance === 'routine') return { severity: 0.34, score: 36 };
  return { severity: 0.56, score: 58 };
}

/**
 * WW-A's writer emits `{ kind, assetId, fromId, toId, tick, … }`; the DM verb and the
 * market composer may address the same fact with explicit role spellings. Both are read
 * here, the seed's own shape first, so the writer's contract needs no translation layer.
 * @param {Record<string, unknown>} row
 * @returns {{ assetId: string, sellerId: string, buyerId: string }}
 */
function addressOf(row) {
  return {
    assetId: text(row.assetId || row.settlementId),
    sellerId: text(row.fromId || row.sellerId || row.holderId),
    buyerId: text(row.toId || row.buyerId || row.acquirerId),
  };
}

/**
 * Project one already-earned WR-10 evidence row. Unknown kinds, missing source ids or
 * ticks, unresolved identities, and an unsupported covert-books claim are silence rather
 * than generic prose.
 *
 * @param {{evidence?:unknown,snapshot?:unknown,now?:string|null}} input
 * @returns {Record<string, unknown>|null}
 */
export function sovereigntyNewsEntry({ evidence = null, snapshot = null, now = null } = {}) {
  const row = asObject(evidence);
  const kind = text(row.kind);
  const tick = wholeTick(row.tick);
  if (!KIND_SET.has(kind) || tick == null) return null;

  const { assetId, sellerId, buyerId } = addressOf(row);
  // The writer mints no receipt id — the conveyance IS the treaty's, not the feed's — so
  // the source ref is DERIVED from the fact's own address when none travels with it.
  // Same parties, same asset, same tick ⇒ same id, which is what folds a duplicate.
  // (The `evidenceId` arm was deleted as writerless — only the plural `evidenceIds`
  // array is ever written, and never on a sovereignty seed or beat.)
  const sourceEventId = text(row.sourceEventId || row.id)
    || [kind, assetId, sellerId, buyerId, tick].filter(Boolean).map(String).join('.');
  if (!sourceEventId || !assetId) return null;

  const asset = settlementName(snapshot, assetId, row.assetName || row.settlementName);
  const seller = sellerId ? settlementName(snapshot, sellerId, row.sellerName || row.fromName) : '';
  const buyer = buyerId ? settlementName(snapshot, buyerId, row.buyerName || row.toName) : '';

  const npcId = text(row.npcId || row.rulerId);
  const npc = npcName(snapshot, sellerId || assetId, npcId, row.npcName || row.rulerName);

  const roles = SLOT_ROLES[kind] || DEFAULT_SLOT_ROLES;
  /** @param {'seller'|'buyer'} role @returns {string} */
  const partyFor = (role) => (role === 'seller' ? seller : buyer);
  /** @type {Record<string, string>} */
  const identities = {
    settlement: asset,
    counterpart: partyFor(roles.counterpart),
    third_party: partyFor(roles.third_party),
    npc,
    seller,
    buyer,
    asset,
  };
  if (REQUIRED_IDENTITIES[kind].some((key) => !identities[key])) return null;

  // THE COVERT ROW, FAIL-CLOSED UPSTREAM. A books divergence that does not positively
  // record the SEAT as the interest served is refused outright — redacting it downstream
  // would still admit that the fact existed, which is the leak the discipline forbids.
  const covertBooks = kind === 'sale_books_diverged';
  if (covertBooks && text(row.booksInterest || row.interestServed) !== 'seat') return null;

  const band = BAND_WORD[text(row.band || row.bandToken)] || '';
  const reason = readerText(row.reason);
  const route = readerText(row.routeName || row.route);
  const good = readerText(row.goodName || row.good);
  const house = readerText(row.houseName || row.house);
  const temple = readerText(row.templeName || row.temple);
  const interp = {
    ...identities,
    ...(band ? { band } : {}),
    ...(reason ? { reason } : {}),
    ...(route ? { route } : {}),
    ...(good ? { good } : {}),
    ...(house ? { house } : {}),
    ...(temple ? { temple } : {}),
  };
  const receipt = sovereigntyReceipt(kind, sourceEventId, interp);
  const headline = HEADLINE[kind]?.(identities);
  if (!receipt || !readerText(headline) || !readerText(receipt.line)) return null;

  const settlementIds = [assetId, sellerId, buyerId].filter(Boolean);
  const settlementNames = [asset, seller, buyer].filter(Boolean);
  const suppliedReasons = (Array.isArray(row.reasons) ? row.reasons : [])
    .map((entry) => readerText(entry))
    .filter(Boolean);
  const weight = presentationWeight(receipt.significance);
  return {
    id: `wizard_news.${tick}.${stablePart(kind)}.${stablePart(sourceEventId)}`,
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
    sourceEventId,
    tags: ['world_pulse', 'sovereignty', receipt.section],
    reasons: [...new Set([REASON[kind], ...suppliedReasons])],
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
    // heraldRouting accepts an authored section only from a governed projector. Without
    // this token the four adjudication kinds and the faith-desk kind file by their content
    // token instead, which lands them in the events catch-all — compiling, passing, wrong.
    sectionAuthority: 'sovereignty_registry',
    // T4 BYTE NEUTRALITY: an actor-id key spreads in only when it carries something.
    ...(npcId && npc ? { npcIds: [npcId] } : {}),
    ...(receipt.audience === 'dm-only' ? { covert: true } : {}),
  };
}

/**
 * Batch projection. Input order is irrelevant; duplicate source-kind evidence is folded
 * and output is codepoint-stable.
 *
 * @param {{evidence?:unknown[],snapshot?:unknown,now?:string|null}} input
 * @returns {Array<Record<string, unknown>>}
 */
export function sovereigntyNewsEntries({ evidence = [], snapshot = null, now = null } = {}) {
  const byId = new Map();
  for (const source of Array.isArray(evidence) ? evidence : []) {
    const entry = sovereigntyNewsEntry({ evidence: source, snapshot, now });
    if (entry && !byId.has(String(entry.id))) byId.set(String(entry.id), entry);
  }
  return [...byId.values()].sort((a, b) => (
    String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0
  ));
}
