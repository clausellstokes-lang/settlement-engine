/**
 * domain/worldPulse/peaceTermsDocument.js — §13 THE TREATY AS A LEGIBLE
 * DOCUMENT, plus the two ledger reads the war layer consumes.
 *
 * PURE structured reads over the treaty ledger: the pair's live treaties (the
 * shape warReasons.scoreTreatyDefault consumes — W-PEACE-1's registration seam),
 * the live fracture records the coalition_fracture peace reason reads, and the
 * document itself — parties, terms with years remaining and per-term compliance,
 * the seam that will tear first named. House-VOICE prose lives in the lazy display
 * layer (domain/display/treatyDocument.js); THIS returns only ledger facts (the
 * InstitutionCard honesty gate — never invent, render what the ledger holds).
 * Dark/absent ⇒ null or empty.
 *
 * Extracted verbatim from peaceTerms.js by THE DECOMPOSITION WAVE (war tranche,
 * file 2 of 4).
 */
import { clamp01 } from '../../kernel/math.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { treatyYearsRemaining } from './treatyClock.js';
import { PEACE_TERMS_TUNING, termLabel } from './peaceTermsCatalog.js';
import { round4, complianceRank, treatyPairKey } from './peaceTermsPrimitives.js';

/** @typedef {import('./peaceTermsCatalog.js').TermRecord} TermRecord */
/** @typedef {import('./peaceTermsCatalog.js').TreatyRecord} TreatyRecord */
/** @typedef {import('./peaceTermsCatalog.js').TreatyLedger} TreatyLedger */

/**
 * Every live treaty whose parties include BOTH ids (either direction) — the
 * shape warReasons.scoreTreatyDefault consumes ({ parties, complianceState,
 * defaultedBy, defaultSeverity01 }). This CLOSES W-PEACE-1's treaty_default
 * registration seam: advanceWarReasons feeds this into its scorer.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} aId @param {unknown} bId
 * @returns {Array<{ parties: string[], complianceState: string, defaultedBy: string, defaultSeverity01: number }>}
 */
export function treatiesForPair(worldState, aId, bId) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return [];
  const a = String(aId); const b = String(bId);
  /** @type {Array<{ parties: string[], complianceState: string, defaultedBy: string, defaultSeverity01: number }>} */
  const out = [];
  for (const key of Object.keys(ledger).sort()) {
    const t = ledger[key];
    const parties = Array.isArray(t?.parties) ? t.parties.map(String) : [];
    if (!parties.includes(a) || !parties.includes(b)) continue;
    out.push({
      parties,
      complianceState: String(t?.complianceState || 'honored'),
      defaultedBy: String(t?.defaultedBy || ''),
      defaultSeverity01: clamp01(Number(t?.defaultSeverity01) || 0),
    });
  }
  return out;
}

/**
 * Every live fracture record that names `partyId` among the ABANDONED within the
 * fracture window — the durable, legible signal the coalition_fracture peace
 * reason consumes (a peel is legible for a window even after the deserter's
 * deployment is recalled). Returns the deserter + coalition size per fracture.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} partyId @param {number} tick
 * @returns {Array<{ deserter: string, coalitionSize: number, abandonedCount: number, tick: number }>}
 */
export function fracturesAbandoning(worldState, partyId, tick) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return [];
  const id = String(partyId);
  const now = Number(tick);
  /** @type {Array<{ deserter: string, coalitionSize: number, abandonedCount: number, tick: number }>} */
  const out = [];
  for (const key of Object.keys(ledger).sort()) {
    const fr = /** @type {{ deserter?: unknown, abandoned?: unknown[], coalitionSize?: unknown, tick?: unknown }} */ (
      /** @type {Record<string, unknown>} */ (ledger[key]).fracture);
    if (!fr || !Array.isArray(fr.abandoned)) continue;
    if (!fr.abandoned.map(String).includes(id)) continue;
    const at = Number(fr.tick);
    if (Number.isFinite(now) && Number.isFinite(at) && now - at > PEACE_TERMS_TUNING.FRACTURE_WINDOW) continue;
    out.push({
      deserter: String(fr.deserter || ''),
      coalitionSize: Math.max(0, Math.floor(Number(fr.coalitionSize) || 0)),
      abandonedCount: fr.abandoned.length,
      tick: Number.isFinite(at) ? at : now,
    });
  }
  return out;
}

// ── THE TREATY DOCUMENT read-model (§13 legibility — the structured facts) ────

/**
 * @typedef {Object} TreatyTermView
 * @property {string} type
 * @property {string} label
 * @property {string} family
 * @property {number} magnitude
 * @property {number} yearsRemaining
 * @property {string} complianceState
 * @property {number} burden01
 * @property {boolean} fraying   whether this is the seam nearest default
 * @property {string} [good]
 */

/**
 * @typedef {Object} TreatyDocument
 * @property {string} pairKey
 * @property {string} victorId @property {string} loserId
 * @property {string} victorName @property {string} loserName
 * @property {number} signedTick
 * @property {number} believedMarginAtSignature
 * @property {number} budgetGranted @property {number} budgetSpent
 * @property {string} complianceState
 * @property {TreatyTermView[]} terms
 * @property {string | null} frayingType
 * @property {{ id: string, name: string } | null} mediator
 * @property {string[] | null} coalitionScope
 * @property {Record<string, number> | null} shares
 * @property {boolean} separateExit
 * @property {{ deserter: string, abandoned: string[], coalitionSize: number, credibilityHit: number, receipt: string } | null} fracture
 * @property {string[]} receipts
 * @property {{ total: number, honored: number, frayingType: string | null, line: string } | null} summary
 */

/**
 * The term nearest default — the seam that will tear first (§13 "the DM watches
 * the seam that will tear"). Worst observed compliance wins; ties break to the
 * term closest to expiry, then codepoint. Null when every term holds clean.
 * @param {TermRecord[]} terms @param {number} tick
 * @param {TreatyRecord | null | undefined} [treaty]
 * @returns {TermRecord | null}
 */
export function frayingTermOf(terms, tick, treaty) {
  /** @type {TermRecord | null} */
  let worst = null;
  for (const t of terms) {
    if (complianceRank(String(t.complianceState)) <= 0) continue; // honored terms do not fray
    if (!worst) { worst = t; continue; }
    const dr = complianceRank(String(t.complianceState)) - complianceRank(String(worst.complianceState));
    if (dr > 0) { worst = t; continue; }
    if (dr < 0) continue;
    const dy = treatyYearsRemaining(t.expiresTick, tick, treaty) - treatyYearsRemaining(worst.expiresTick, tick, treaty);
    if (dy < 0 || (dy === 0 && String(t.type) < String(worst.type))) worst = t;
  }
  return worst;
}

/**
 * A terse, dependency-free fraying summary the irony brief renders (§14.4 — "the
 * peace holds by two terms of five; the tribute frays"). honoredCount / total +
 * the fraying term's type. Pure; safe on any treaty record.
 * @param {Record<string, unknown> | null | undefined} treaty @param {number} tick
 * @returns {{ total: number, honored: number, frayingType: string | null, line: string } | null}
 */
export function treatyFrayingSummary(treaty, tick) {
  const terms = /** @type {TermRecord[]} */ (Array.isArray(treaty?.terms) ? treaty.terms : []);
  if (terms.length === 0) return null;
  const honored = terms.filter((t) => complianceRank(String(t.complianceState)) <= 0).length;
  const fray = frayingTermOf(terms, tick, treaty);
  const frayingType = fray ? String(fray.type) : null;
  const line = frayingType
    ? `The peace holds by ${honored} term${honored === 1 ? '' : 's'} of ${terms.length}; the ${termLabel(frayingType)} frays.`
    : `The peace holds — all ${terms.length} term${terms.length === 1 ? '' : 's'} stand.`;
  return { total: terms.length, honored, frayingType, line };
}

/** Locate a treaty by directed OR undirected pair key (`victor>loser`). Accepts
 *  either direction. @param {TreatyLedger | null} ledger @param {string} pairKey @returns {TreatyRecord | null} */
function findTreatyByKey(ledger, pairKey) {
  if (!ledger) return null;
  if (ledger[pairKey]) return ledger[pairKey];
  // Try the reverse direction (the caller may hold either order).
  const parts = String(pairKey).split('>');
  if (parts.length === 2) {
    const rev = treatyPairKey(parts[1], parts[0]);
    if (ledger[rev]) return ledger[rev];
  }
  return null;
}

/**
 * THE TREATY DOCUMENT read-model (§13): the treaty as a legible document —
 * parties, terms with years remaining and per-term compliance, the fraying seam
 * named. Pure; renders ONLY ledger facts. Null when the ledger is dark/absent or
 * no treaty stands for the pair.
 * @param {Record<string, unknown> | null | undefined} worldState @param {string} pairKey
 * @returns {TreatyDocument | null}
 */
export function treatyDocument(worldState, pairKey) {
  const ledger = treatyLedgerOf(worldState);
  const treaty = findTreatyByKey(ledger, String(pairKey));
  if (!treaty) return null;
  const tick = Number(/** @type {{ tick?: unknown }} */ (worldState || {}).tick) || 0;
  const victorId = String(treaty.victorId);
  const loserId = String(treaty.loserId);
  const terms = /** @type {TermRecord[]} */ (Array.isArray(treaty.terms) ? treaty.terms : []);
  const fray = frayingTermOf(terms, tick, treaty);
  const frayingType = fray ? String(fray.type) : null;
  /** @type {TreatyTermView[]} */
  const termViews = terms.map((t) => {
    /** @type {TreatyTermView} */
    const v = {
      type: String(t.type),
      label: termLabel(String(t.type)),
      family: String(t.family),
      magnitude: round4(clamp01(Number(t.magnitude) || 0)),
      yearsRemaining: treatyYearsRemaining(t.expiresTick, tick, treaty),
      complianceState: String(t.complianceState || 'honored'),
      burden01: round4(clamp01(Number(t.burden01) || 0)),
      fraying: !!fray && t === fray,
    };
    if (t.good) v.good = String(t.good);
    return v;
  });
  const fr = /** @type {{ deserter?: unknown, abandoned?: unknown[], coalitionSize?: unknown, credibilityHit?: unknown, receipt?: unknown }} */ (
    /** @type {Record<string, unknown>} */ (treaty).fracture);
  return {
    pairKey: treatyPairKey(victorId, loserId),
    victorId,
    loserId,
    victorName: String(treaty.victorName || victorId),
    loserName: String(treaty.loserName || loserId),
    signedTick: Number(treaty.mintedTick) || 0,
    believedMarginAtSignature: round4(Number(treaty.believedMarginAtSignature) || 0),
    budgetGranted: round4(Number(treaty.budgetGranted) || 0),
    budgetSpent: round4(Number(treaty.budgetSpent) || 0),
    complianceState: String(treaty.complianceState || 'honored'),
    terms: termViews,
    frayingType,
    mediator: treaty.mediator && typeof treaty.mediator === 'object'
      ? { id: String(/** @type {{ id?: unknown }} */ (treaty.mediator).id || ''), name: String(/** @type {{ name?: unknown }} */ (treaty.mediator).name || '') }
      : null,
    coalitionScope: Array.isArray(treaty.coalitionScope) ? treaty.coalitionScope.map(String) : null,
    shares: treaty.shares && typeof treaty.shares === 'object' ? /** @type {Record<string, number>} */ (treaty.shares) : null,
    separateExit: !!treaty.separateExit,
    fracture: fr && Array.isArray(fr.abandoned)
      ? {
        deserter: String(fr.deserter || ''),
        abandoned: fr.abandoned.map(String),
        coalitionSize: Math.max(0, Math.floor(Number(fr.coalitionSize) || 0)),
        credibilityHit: round4(clamp01(Number(fr.credibilityHit) || 0)),
        receipt: String(fr.receipt || ''),
      }
      : null,
    receipts: Array.isArray(treaty.receipts) ? treaty.receipts.map(String) : [],
    summary: treatyFrayingSummary(treaty, tick),
  };
}

/**
 * Every treaty document where `settlementId` is a party (victor or loser),
 * codepoint-ordered by pair key — the dossier's "treaties where this settlement
 * is a party" read. Empty when dark/absent.
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} settlementId
 * @returns {TreatyDocument[]}
 */
export function treatyDocumentsForSettlement(worldState, settlementId) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return [];
  const id = String(settlementId);
  /** @type {TreatyDocument[]} */
  const out = [];
  for (const key of Object.keys(ledger).sort()) {
    const t = ledger[key];
    const parties = Array.isArray(t?.parties) ? t.parties.map(String) : [];
    if (!parties.includes(id)) continue;
    const doc = treatyDocument(worldState, key);
    if (doc) out.push(doc);
  }
  return out;
}
