/**
 * domain/compendium/corpusStaging.js — THE CORPUS FACTORY's canon side (V-5, VISION WAVE).
 *
 * The corpus (institution descriptions, NPC voice pools, tradition motifs) is the thin
 * editorial layer over the deep engine. The Factory drafts candidates with AI, stages them
 * in the runtime store, and lets the OWNER approve — but the owner's taste stays the canon
 * gate. This module is the CANON boundary that makes that law load-bearing:
 *
 *   APPROVED_CORPUS is the ONLY corpus the generated compendium artifact reflects
 *   (gen:compendium-data reads THIS committed leaf, never the runtime store). A candidate
 *   reaches canon exactly when the owner APPROVES it in the panel AND commits it here — a
 *   runtime approval alone changes nothing generated. "staged-never-canonical-without-
 *   approval" is therefore structural, not a convention.
 *
 * The build-time fold: draft → stage → approve (runtime) → serializeApprovedCorpus →
 * paste into APPROVED_CORPUS below → `npm run gen:compendium-data` (owner) → canon.
 */

/** The closed kind vocabulary. A candidate whose kind is not one of these can never fold. */
export const CORPUS_KINDS = Object.freeze(['institutionDesc', 'npcVoice', 'traditionMotif']);

/**
 * The APPROVED, owner-committed corpus. EMPTY at V1: the staging catalog lives in the
 * runtime store; nothing here until the owner folds approved candidates in. Every entry
 * carries its provenance (the draft's model / prompt family / date / source).
 * @type {ReadonlyArray<CanonCandidate>}
 */
export const APPROVED_CORPUS = Object.freeze([]);

/** @typedef {{ model: string, promptFamily: string, date: string, source: string }} CorpusProvenance */
/** @typedef {{ kind: string, target: string, text: string, provenance: CorpusProvenance }} CanonCandidate */
/** @typedef {{ id?: string, kind?: string, target?: string, text?: string, status?: string, provenance?: Partial<CorpusProvenance> }} StagedCandidate */

/** @param {unknown} k @returns {boolean} */
export function isCorpusKind(k) {
  return typeof k === 'string' && CORPUS_KINDS.includes(k);
}

/** Coerce a candidate's provenance to the full, honest shape (never partial in canon).
 *  @param {Partial<CorpusProvenance>|undefined} p @returns {CorpusProvenance} */
export function normalizeProvenance(p) {
  const o = p && typeof p === 'object' ? p : {};
  return {
    model: typeof o.model === 'string' && o.model ? o.model : 'unknown',
    promptFamily: typeof o.promptFamily === 'string' && o.promptFamily ? o.promptFamily : 'unknown',
    date: typeof o.date === 'string' && o.date ? o.date : 'unknown',
    source: typeof o.source === 'string' && o.source ? o.source : 'ai-draft',
  };
}

/** Normalize a staged candidate to the canon shape (drops runtime-only fields). Pure.
 *  @param {StagedCandidate} c @returns {CanonCandidate} */
export function normalizeCandidate(c) {
  const o = c && typeof c === 'object' ? c : {};
  return {
    kind: typeof o.kind === 'string' ? o.kind : 'institutionDesc',
    target: typeof o.target === 'string' ? o.target : '',
    text: typeof o.text === 'string' ? o.text.trim() : '',
    provenance: normalizeProvenance(o.provenance),
  };
}

/** Stable sort key for deterministic canon order (kind → target → text). Pure.
 *  @param {CanonCandidate} c @returns {string} */
function stableKey(c) {
  return `${c.kind} ${c.target} ${c.text}`;
}

/**
 * The candidates ELIGIBLE for canon: ONLY status === 'approved' and a valid kind, with a
 * non-empty text — normalized + deterministically ordered. A staged or rejected candidate
 * can NEVER pass (the load-bearing pin's subject). Pure.
 * @param {StagedCandidate[]} candidates @returns {CanonCandidate[]}
 */
export function approvedForCanon(candidates) {
  return (Array.isArray(candidates) ? candidates : [])
    .filter((c) => c && c.status === 'approved' && isCorpusKind(c.kind))
    .map(normalizeCandidate)
    .filter((c) => c.text.length > 0)
    .sort((a, b) => (stableKey(a) < stableKey(b) ? -1 : stableKey(a) > stableKey(b) ? 1 : 0));
}

/**
 * Render the APPROVED_CORPUS array body the owner commits into this leaf (the build-time
 * fold). Deterministic + pretty (one entry per line) so the diff is legible. Pure.
 * @param {StagedCandidate[]} candidates @returns {string}
 */
export function serializeApprovedCorpus(candidates) {
  const canon = approvedForCanon(candidates);
  if (canon.length === 0) return 'export const APPROVED_CORPUS = Object.freeze([]);';
  const lines = canon.map((c) => `  ${JSON.stringify(c)},`);
  return `export const APPROVED_CORPUS = Object.freeze([\n${lines.join('\n')}\n]);`;
}

/** The compendium block the generator emits from APPROVED_CORPUS. Kept here (next to the
 *  data) so the generator and the freshness parity read ONE shape. Pure.
 *  @param {ReadonlyArray<CanonCandidate>} approved */
export function corpusCompendiumBlock(approved) {
  const list = Array.isArray(approved) ? approved : [];
  return {
    count: list.length,
    authored: true,
    kinds: [...CORPUS_KINDS],
    byKind: CORPUS_KINDS.reduce((/** @type {Record<string, number>} */ acc, k) => {
      acc[k] = list.filter((c) => c.kind === k).length;
      return acc;
    }, {}),
    entries: list.map((c) => ({ kind: c.kind, target: c.target, text: c.text, provenance: c.provenance })),
  };
}
