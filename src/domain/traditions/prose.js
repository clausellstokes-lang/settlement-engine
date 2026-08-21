/**
 * domain/traditions/prose.js — THE TRADITIONS wave (Engine Lift #4), slice T-5.
 *
 * The seeded SELECTION layer over the src/data/traditionProse.js pools (the data holds
 * the fields, the engine holds the draws — the traditionCorpus/genesis split). Two
 * consumers:
 *   • traditionsKernel.traditionBeat — the outcome news phrasing (a lit-tick beat).
 *   • dossier/plotHooks.collectPlotHooks — the outcome/relation-conditioned plot hooks.
 *
 * PURE SELECTION (the eventProse.pickLine idiom, carried self-contained so the dossier +
 * PDF chunks that pull the hooks do NOT drag in all of eventProse's war/peace pools): a
 * pure FNV-1a hash of a STABLE seed string — no rng, no Date, no rng-stream perturbation.
 * CANONICAL-AT-ZERO: a falsy seed selects index 0 (the pre-existing canonical string), so
 * a seedless caller is byte-identical; only the seeded path varies. Matches the newsVoice /
 * eventProse FNV so the same seed lands the same variant everywhere.
 */
import {
  TRAD_OUTCOME_PHRASE, TRAD_HELD_SUMMARY, TRAD_CANCELLED_SUMMARY, TRAD_HOOKS,
} from '../../data/traditionProse.js';

/** @typedef {import('./genesis.js').TraditionRec} TraditionRec */
/** @typedef {import('../../data/traditionProse.js').TraditionProseVariant} TraditionProseVariant */

/** FNV-1a 32-bit — the pure variant-selection hash (matches eventProse/newsVoice).
 *  @param {string} str @returns {number} */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  const s = String(str);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Pick a phrasing variant deterministically. A FALSY seed ⇒ index 0 (canonical). A
 *  function entry is resolved with `interp`. Pure.
 *  @param {ReadonlyArray<TraditionProseVariant>} pool @param {string|null|undefined} seed
 *  @param {Record<string, unknown>} [interp] @returns {string} */
function pickLine(pool, seed, interp = {}) {
  if (!Array.isArray(pool) || pool.length === 0) return '';
  const idx = seed ? fnv1a32(seed) % pool.length : 0;
  const v = pool[idx];
  return typeof v === 'function' ? String(v(interp)) : String(v);
}

/**
 * The outcome-beat prose parts for one held/cancelled observance (traditionBeat). Index-0
 * canonical when `seed` is falsy. Returns the outcome verb `phrase` and the composed
 * `summary`; the caller builds the headline from `phrase` and supplies the mechanical reason.
 * @param {Object} a
 * @param {string} a.outcome  a TRADITION_OUTCOME value
 * @param {string} a.name     the tradition name
 * @param {string} a.town     the settlement name
 * @param {string} a.ownerBit the trailing owner-accountability clause (may be '')
 * @param {string|null|undefined} a.seed  the stable per-(tradition,year) seed
 * @returns {{ phrase: string, summary: string }}
 */
export function traditionBeatProse({ outcome, name, town, ownerBit, seed }) {
  const phrasePool = /** @type {Record<string, ReadonlyArray<string>>} */ (TRAD_OUTCOME_PHRASE)[outcome]
    || TRAD_OUTCOME_PHRASE.good;
  const phrase = pickLine(phrasePool, seed ? `${seed}#phrase` : null) || 'was held';
  const cancelled = outcome === 'cancelled';
  const summaryPool = cancelled ? TRAD_CANCELLED_SUMMARY : TRAD_HELD_SUMMARY;
  const summary = pickLine(summaryPool, seed ? `${seed}#summary` : null, { town, name, phrase, ownerBit });
  return { phrase, summary };
}

// ── PLOT-HOOK conditions (§10 hooks: outcome/relation-conditioned) ─────────────
/** @param {unknown} x @returns {Record<string, unknown>} */
function asObject(x) {
  return x && typeof x === 'object' && !Array.isArray(x) ? /** @type {Record<string, unknown>} */ (x) : {};
}

/**
 * The single strongest hook CONDITION a mirror record raises this year, by precedence
 * (a rite under an overlord / just liberated / transplanted outranks a bare outcome), or
 * null when the record raises none. Pure. @param {TraditionRec} rec
 * @returns {{ condition: keyof typeof TRAD_HOOKS, priority: number }|null}
 */
export function traditionHookCondition(rec) {
  const r = asObject(rec);
  if (r.suppressedBy) return { condition: 'suppressed', priority: 8 };
  const log = Array.isArray(r.mutationLog) ? r.mutationLog : [];
  const lastKind = log.length ? String(asObject(log[log.length - 1]).kind) : '';
  if (lastKind === 'restoration') return { condition: 'restored', priority: 7 };
  if (typeof r.adoptedFrom === 'string' && r.adoptedFrom) return { condition: 'adopted', priority: 6 };
  const outcome = String(r.lastOutcome || '');
  if (outcome === 'failure') return { condition: 'failure', priority: 8 };
  if (outcome === 'cancelled') return { condition: 'cancelled', priority: 7 };
  if (outcome === 'triumph') return { condition: 'triumph', priority: 6 };
  return null;
}

/**
 * The plot-hook seed for one mirror record, or null when it raises no condition. The text
 * is seeded on the record id (stable, deterministic, varied across records). Pure.
 * @param {TraditionRec} rec @param {{ town?: string }} [ctx]
 * @returns {{ text: string, condition: string, priority: number, source: string }|null}
 */
export function traditionHook(rec, ctx = {}) {
  const cond = traditionHookCondition(rec);
  if (!cond) return null;
  const r = asObject(rec);
  const name = String(r.name || 'a local rite');
  const town = String(ctx.town || 'the town');
  const pool = TRAD_HOOKS[cond.condition];
  const text = pickLine(pool, `${String(r.id || name)}:hook`, { name, town });
  if (!text) return null;
  return { text, condition: cond.condition, priority: cond.priority, source: name };
}
