/**
 * domain/worldPulse/commercialReasonsNews.js — TR-1's evidence-to-reader projection
 * (the casus commercii).
 *
 * The ledger owns behavior and emits typed facts that already happened: one directed
 * pair, one taxonomy type, one bounded magnitude, and the slots its receipt may name.
 * This pure leaf never decides whether a market was shut, a toll gouged, or a compact
 * kept; it never discovers a settlement, good, route or house; and it never prices
 * anything. It joins that typed evidence to the governed twenty-kind corpus authored in
 * docs/content/RECEIPT_POOLS_TRADE.md under `# TR-1 — THE CASUS COMMERCII`.
 *
 * THREE SURFACES, ONE CORPUS. Nineteen kinds are Herald reader kinds on the commerce
 * desk (the sixteen taxonomy types, the dm-only suppression receipt, and the two
 * band-crossing headlines); the twentieth, `commercial_relation_line`, is the town
 * dossier's relations-panel row and is DELIBERATELY not a routed event token — a panel
 * line is not something that happened. That exclusion is stated here and asserted by the
 * walker, so it can never become a silent omission.
 *
 * ⚠ THE FALLBACK IS PAIR-ONLY, NOT SLOTLESS, AND THE PICKER IS BUILT AROUND THAT. Eleven
 * of the twenty pools carry no wholly slotless variant (measured — see the pools leaf's
 * header), because a commercial receipt that named no town would not be an address. So
 * the picker filters to the variants whose slots the caller ACTUALLY SUPPLIED and draws
 * from that eligible sub-pool. A pool whose eligible set is empty returns null and the
 * caller stays silent; it never renders a hole, a slug, or an invented name.
 *
 * DETERMINISM. Selection is a keyed hash of the caller's seed over the ELIGIBLE pool —
 * no rng draw, no Date, no locale. The same world at the same tick picks the same
 * sentence forever, which is what THE PROMISE requires of a receipt.
 *
 * @enforced-by tests/lint/commercialKindPools.walker.test.js
 */

import { fnv1a32 } from './eventProse.js';
import { COMMERCIAL_RECEIPTS, COMMERCIAL_RECEIPT_SLOTS } from './commercialReceiptPools.js';
import {
  PARTNERSHIP_REASON_TYPES,
  SEVERANCE_REASON_TYPES,
} from './commercialReasonTaxonomy.js';
import { stablePart } from './stablePart.js';

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/**
 * @typedef {{kind:string,significance:'major'|'notable'|'routine',
 * audience:'public'|'dm-only',section:'trade',surface:'herald'|'dossier',
 * pool:readonly ProseVariant[],requiredSlots:ReadonlyArray<readonly string[]>}} CommercialRegistryEntry
 */

/** The engine token for a taxonomy type. ONE spelling, derived, never re-typed.
 *  @param {unknown} type @returns {string} */
export const commercialKindOf = (type) => `commercial_${String(type)}`;

/**
 * Significance is an ASSIGNMENT from SP-6a's one family, read off the annex's own
 * declaration per kind — never a scale minted here (the R5 ruling). Severance causes
 * are notable and their mirrors routine by default; the four exceptions below are the
 * annex's, and the walker pins every one of them against the document.
 * @type {Readonly<Record<string, 'major'|'notable'|'routine'>>}
 */
const SIGNIFICANCE_OVERRIDES = Object.freeze({
  commercial_cornering: 'major',
  commercial_famine_profiteering: 'major',
  commercial_famine_relief: 'notable',
  commercial_market_opened: 'notable',
});

/**
 * @param {string} kind
 * @param {'major'|'notable'|'routine'} significance
 * @param {'public'|'dm-only'} audience
 * @param {'herald'|'dossier'} surface
 * @returns {Readonly<CommercialRegistryEntry>}
 */
function commercialKindRow(kind, significance, audience, surface) {
  const pool = /** @type {readonly ProseVariant[]} */ (COMMERCIAL_RECEIPTS[kind]);
  const slots = COMMERCIAL_RECEIPT_SLOTS[kind];
  if (!pool || !slots || pool.length !== slots.length) {
    throw new Error(`commercialReasonsNews: ${kind} has no annex pool of matching arity`);
  }
  return Object.freeze({
    kind,
    significance,
    audience,
    section: /** @type {'trade'} */ ('trade'),
    surface,
    pool,
    requiredSlots: Object.freeze(slots.map((entry) => Object.freeze([...entry]))),
  });
}

/**
 * The governed TR-1 reader kinds, in taxonomy order: eight severance causes, their
 * eight mirrors, the suppression receipt, the two band crossings, and the dossier line.
 * @type {ReadonlyArray<Readonly<CommercialRegistryEntry>>}
 */
export const COMMERCIAL_KIND_REGISTRY = Object.freeze([
  ...SEVERANCE_REASON_TYPES.map((type) => commercialKindRow(
    commercialKindOf(type),
    SIGNIFICANCE_OVERRIDES[commercialKindOf(type)] || 'notable',
    'public',
    'herald',
  )),
  ...PARTNERSHIP_REASON_TYPES.map((type) => commercialKindRow(
    commercialKindOf(type),
    SIGNIFICANCE_OVERRIDES[commercialKindOf(type)] || 'routine',
    'public',
    'herald',
  )),
  commercialKindRow('commercial_casus_suppressed', 'routine', 'dm-only', 'herald'),
  commercialKindRow('commercial_severance_crossing', 'major', 'public', 'herald'),
  commercialKindRow('commercial_partnership_crossing', 'notable', 'public', 'herald'),
  commercialKindRow('commercial_relation_line', 'routine', 'public', 'dossier'),
]);

/** The exact TR-1 governed reader-kind set. */
export const COMMERCIAL_KINDS = Object.freeze(COMMERCIAL_KIND_REGISTRY.map((row) => row.kind));

/**
 * The Herald subset — every governed kind except the dossier relations-panel row. This
 * is the set that owes WHAT_PHRASES and heraldRouting rows.
 */
export const COMMERCIAL_HERALD_KINDS = Object.freeze(
  COMMERCIAL_KIND_REGISTRY.filter((row) => row.surface === 'herald').map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<CommercialRegistryEntry>>} */
const KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<CommercialRegistryEntry>]>} */ (
    COMMERCIAL_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/** The two crossing headlines — the only kinds this wave MINTS as news.
 *  @type {Readonly<Record<string, (interp: Record<string, string>) => string>>} */
const HEADLINE = Object.freeze({
  commercial_severance_crossing: (x) => `${x.settlement} cuts its trade with ${x.counterpart}`,
  commercial_partnership_crossing: (x) => `${x.settlement} and ${x.counterpart} bind their markets together`,
});

const REASON = Object.freeze({
  commercial_severance_crossing: 'A typed commercial grievance crossed the severance band, and the record names which one.',
  commercial_partnership_crossing: 'A typed commercial partnership crossed its band, and the record names the evidence both sides read.',
});

/** Presentation weight per significance class — the SP-6a family, not a new scale. */
const WEIGHT = Object.freeze({
  major: Object.freeze({ severity: 0.7, score: 0.8 }),
  notable: Object.freeze({ severity: 0.45, score: 0.55 }),
  routine: Object.freeze({ severity: 0.25, score: 0.3 }),
});

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Reader words carry no scalars, ids, JSON or tuning vocabulary — the same fence
 * envoyNews.js sets, applied to every slot value a producer hands in.
 * @param {unknown} value @returns {string}
 */
export function commercialReaderText(value) {
  const valueText = text(value);
  // The CLOSING bracket is backslash-escaped and the opening one is not, which is the
  // only spelling that both parses and lints. Written bare, `[\d%×_{}[]]` closes the
  // class at its own `]` and leaves a lone `]` behind — a SyntaxError under the `u` flag,
  // authored and executed here before it shipped. Do not spell the members as unicode
  // escapes either: this estate's authoring tools interpret those on the way to disk.
  if (!valueText || /[\d%×_{}[\]]/u.test(valueText)) return '';
  if (/\b(?:rng|roll|score|ratio|tick|chance|magnitude|probability|odds|threshold|coefficient|multiplier|percent(?:age)?|state\s*read)\b/i.test(valueText)) return '';
  return valueText;
}

/**
 * Pick one authored variant for `kind`, drawing ONLY from the variants whose slots the
 * caller supplied. Returns null when the kind is unknown or no variant is renderable.
 *
 * @param {string} kind
 * @param {string} seed the caller's deterministic key (never an rng draw)
 * @param {Record<string, string>} interp
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:'major'|'notable'|'routine',audience:'public'|'dm-only',
 *   section:'trade'} | null}
 */
export function commercialReceipt(kind, seed, interp = {}) {
  const row = KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const supplied = new Set(
    Object.keys(interp).filter((slot) => commercialReaderText(interp[slot])),
  );
  /** @type {number[]} */
  const eligible = [];
  for (let i = 0; i < row.pool.length; i += 1) {
    if (row.requiredSlots[i].every((slot) => supplied.has(slot))) eligible.push(i);
  }
  if (eligible.length === 0) return null;
  const templateIndex = eligible[fnv1a32(String(seed)) % eligible.length];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  if (!line) return null;
  return {
    kind: row.kind,
    line,
    // The family identity is the TEMPLATE's, not the rendered sentence's, so SP-6's
    // repetition instrument cannot mistake one sentence in different names for depth.
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * Project one band CROSSING into a wizard-news entry. Missing identity is silence: a
 * crossing whose two towns cannot both be named is refused, never rendered with a slug.
 *
 * @param {{crossing?:Record<string, unknown>, now?:string|null}} input
 * @returns {Record<string, unknown> | null}
 */
export function commercialCrossingNewsEntry({ crossing = {}, now = null } = {}) {
  const kind = text(crossing.kind);
  if (kind !== 'commercial_severance_crossing' && kind !== 'commercial_partnership_crossing') return null;
  const fromId = text(crossing.fromId);
  const toId = text(crossing.toId);
  const settlement = commercialReaderText(crossing.fromName);
  const counterpart = commercialReaderText(crossing.toName);
  if (!fromId || !toId || !settlement || !counterpart) return null;
  const tick = Number.isFinite(crossing.tick) ? Number(crossing.tick) : 0;

  /** @type {Record<string, string>} */
  const interp = { settlement, counterpart };
  for (const slot of ['good', 'route', 'band', 'reason', 'house']) {
    const value = commercialReaderText(crossing[slot]);
    if (value) interp[slot] = value;
  }
  const sourceEventId = text(crossing.sourceEventId)
    || [kind, fromId, toId, tick].join('.');
  const receipt = commercialReceipt(kind, sourceEventId, interp);
  const headline = HEADLINE[kind](interp);
  if (!receipt || !commercialReaderText(headline)) return null;

  const weight = WEIGHT[receipt.significance];
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
    channelType: null,
    settlementIds: [...new Set([fromId, toId])],
    settlementNames: [...new Set([settlement, counterpart])],
    impactIds: [],
    channelIds: [],
    sourceEventId,
    tags: ['world_pulse', 'commerce', receipt.section],
    reasons: [REASON[kind], ...(text(crossing.casusReceipt) ? [text(crossing.casusReceipt)] : [])],
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
  };
}

/**
 * Batch projection. Input order is irrelevant; duplicates fold by id and the output is
 * codepoint-stable.
 * @param {{crossings?:unknown[], now?:string|null}} input
 * @returns {Array<Record<string, unknown>>}
 */
export function commercialCrossingNewsEntries({ crossings = [], now = null } = {}) {
  /** @type {Map<string, Record<string, unknown>>} */
  const byId = new Map();
  for (const crossing of Array.isArray(crossings) ? crossings : []) {
    const entry = commercialCrossingNewsEntry({
      crossing: /** @type {Record<string, unknown>} */ (crossing), now,
    });
    if (entry && !byId.has(String(entry.id))) byId.set(String(entry.id), entry);
  }
  return [...byId.values()].sort((a, b) => (
    String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0
  ));
}
