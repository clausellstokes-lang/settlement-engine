/**
 * domain/facts/presumptionCheck.js — THE RUNTIME SELF-CHECK (CENSUS-1b wave 1, item 4;
 * `docs/DESIGN_POOL_CENSUS.md` §3.4). Certification class `cert:false-presumption`.
 *
 * After the record is final and before certification, every line the birth (or the render)
 * drew through `drawDeclared` or the kernel is replayed against the FINAL record: each declared
 * atom is asserted with the SAME reader the draw used (`factVocabulary.js :: declarationAdmits`
 * over `factsOf(record)`). A failed atom is a certification failure carrying the pool, the line,
 * the atom and the reader's answer. It catches a LATE WRITE (true when drawn, false at the end of
 * the birth) and a declaration that lies about the record; a reader finding on a declared line
 * means its declaration is incomplete (the fix is the declaration).
 *
 * Pure over `(record, ledger)`; one reader call per declared atom per drawn line.
 */
import { declarationOfTags, declarationAdmits, atomHolds } from './factVocabulary.js';
import { factsOf } from './factsOf.js';

/**
 * @typedef {object} FalsePresumption
 * @property {'false-presumption'} code
 * @property {string} pool @property {string|number} lineId
 * @property {string} atom the atom as declared
 * @property {string} answer the reader's answer on the final record
 */

/**
 * @param {object | null | undefined} record the final settlement record
 * @param {ReadonlyArray<import('./presumptionLedger.js').LedgerEntry>} ledger
 * @param {{ worldStressors?: ReadonlyArray<unknown> | null, settlementId?: unknown }} [options]
 * @returns {FalsePresumption[]}
 */
export function presumptionFindings(record, ledger, options = {}) {
  /** @type {FalsePresumption[]} */
  const out = [];
  if (!Array.isArray(ledger) || ledger.length === 0) return out;
  const facts = settledFacts(factsOf(record, options));
  for (const entry of ledger) {
    const atoms = [...(entry.poolDeclares || []), ...(entry.atoms || [])];
    if (atoms.length === 0 && !entry.crisisScoped) continue;
    const decl = declarationOfTags(atoms);
    const verdict = declarationAdmits(decl, facts, { crisisScoped: entry.crisisScoped === true, ctx: entry.ctx });
    for (const atom of verdict.refused) {
      out.push({ code: 'false-presumption', pool: entry.pool, lineId: entry.lineId, atom, answer: answerOf(atom, facts, entry.ctx) });
    }
  }
  return out;
}

/**
 * The final record's facts, each read ONCE: the check runs after the record is final, so a
 * settled view is the same answer as the live one and costs one read per fact, not per atom.
 * @param {Readonly<Record<string, unknown>> & { hasInstitution(kind: string): boolean, hasOtherNpc(npc: unknown): boolean, sharesPower(pair: unknown): boolean|undefined }} live
 *   a `factsOf` object
 */
function settledFacts(live) {
  /** @type {Record<string, unknown>} */ const held = {};
  /** @type {Map<string, boolean>} */ const kinds = new Map();
  /** @type {Map<unknown, boolean>} */ const others = new Map();
  const view = {};
  for (const name of Object.keys(live)) {
    if (typeof Object.getOwnPropertyDescriptor(live, name)?.value === 'function') continue;
    Object.defineProperty(view, name, { enumerable: true, get: () => (name in held ? held[name] : (held[name] = live[name])) });
  }
  return Object.assign(view, {
    hasInstitution: (/** @type {string} */ k) => (kinds.has(k) ? kinds.get(k) : (kinds.set(k, live.hasInstitution(k)), kinds.get(k))),
    hasOtherNpc: (/** @type {unknown} */ n) => (others.has(n) ? others.get(n) : (others.set(n, live.hasOtherNpc(n)), others.get(n))),
    sharesPower: (/** @type {unknown} */ pair) => live.sharesPower(pair), // R2-CODE-A-14 (s1): a pair's fact, read per line
  });
}

/** @param {string} atom @param {import('./factVocabulary.js').FactsLike} facts @param {Record<string, unknown>|undefined} ctx */
function answerOf(atom, facts, ctx) {
  if (atom.startsWith('crisis:')) {
    const c = facts.crisis;
    return c && c.active ? `active: ${c.kinds.join(', ') || c.types.join(', ')}` : 'calm';
  }
  const held = atomHolds(atom.replace(/^no\s+/i, ''), facts, ctx);
  return held === undefined ? 'unanswered' : String(held);
}

/**
 * The soak's `declared-share`: the share of drawn lines that went through a declaration, by
 * surface. `{ surface: { drawn, declared } }`.
 * @param {ReadonlyArray<import('./presumptionLedger.js').LedgerEntry>} ledger
 * @returns {Record<string, { drawn: number, declared: number }>}
 */
export function declaredShare(ledger) {
  /** @type {Record<string, { drawn: number, declared: number }>} */
  const out = {};
  for (const e of Array.isArray(ledger) ? ledger : []) {
    const row = (out[e.surface] ||= { drawn: 0, declared: 0 });
    row.drawn += 1;
    // A `colour` line (R-AO) is declared: read, presumes nothing (the chair, 11:0x, on CENSUS-4h Q1).
    if ((e.atoms && e.atoms.length) || (e.poolDeclares && e.poolDeclares.length) || e.crisisScoped || e.colour === true) row.declared += 1;
  }
  return out;
}
