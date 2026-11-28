/**
 * THE TOWN'S RENAME REACHES ITS STORED SENTENCES (point 124, unit K2; RENAME-BUILD's measure `M3-K2-stored.md`).
 *
 * A born town stores its own name in a few sentences written at birth: `arrivalScene`, `pressureSentence` and each crisis's
 * `summary` (`stress`, one entry or a list, and its `stressors` mirror). Measured on 1,800 births of every size, those are the
 * only stored homes of the name a page prints. The rename wrote `name` alone, so every page went on printing the old
 * name there. The rename now rewrites them, as `factionRename.js :: applyFactionRenameToSettlement` rewrites a power's
 * stored prose: by WHOLE-WORD substitution through the one helper `lib/narrativeMutations.js :: substituteWholeWord`
 * (Unicode-aware, so "Ögedeidavan" and "Ásaker" match; a possessive "Linyuan's" is rewritten; "Fordham" is never "Ford").
 *
 * THE RULES (the hazards, each a test in tests/domain/townRename.test.js):
 *   - only the homes above, and case-sensitive: no other field is touched, and a lower-case common word never is;
 *   - an occurrence of the old name INSIDE another stored proper name of the record (a person, a house, a power, a quarter:
 *     "Ana Ford", "Ford Abbey") is masked and left as it is;
 *   - where the old name IS another stored name (a house called what the town is called), nothing but `name` is
 *     rewritten: the sentence cannot say which it means, and the rename does not guess.
 * A rename back restores the record byte for byte where the new name was in none of the homes before.
 * Pure: the record handed in is never mutated.
 */
import { substituteWholeWord } from '../lib/narrativeMutations.js';

/** The stored sentence homes of a town's own name, each a top-level key whose value is a sentence. */
export const TOWN_NAME_SENTENCE_KEYS = Object.freeze(['arrivalScene', 'pressureSentence']);
/** The crisis containers whose entries' `summary` is a stored sentence (one entry or a list; `stressors` mirrors `stress`). */
export const TOWN_NAME_CRISIS_KEYS = Object.freeze(['stress', 'stressors']);

/** @param {unknown} v @returns {string} */
const text = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * Every other proper name the record stores: its people, houses, powers and quarters (the keys a born record carries:
 * `scripts/check-observed-shape-readers.mjs`; the legacy top-level `factions` is not read, PEOPLE-5's FPZ).
 * @param {{ npcs?: unknown, institutions?: unknown, powerStructure?: { factions?: unknown } | null, spatialLayout?: { quarters?: unknown } | null }} s @returns {string[]}
 */
function otherNamesOf(s) {
  /** @type {string[]} */
  const out = [];
  /** @param {unknown} list @param {string[]} keys */
  const take = (list, keys) => {
    if (!Array.isArray(list)) return;
    for (const row of list) for (const k of keys) { const n = text(row?.[k]); if (n) out.push(n); }
  };
  take(s.npcs, ['name']);
  take(s.institutions, ['name']);
  take(s.powerStructure?.factions, ['name', 'faction']);
  take(s.spatialLayout?.quarters, ['name']);
  return out;
}

/** @param {string} str @returns {string} */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * One sentence, the old name rewritten wherever it is not inside another stored name.
 * @param {string} sentence @param {string} oldName @param {string} newName @param {string[]} shields the names that hold it
 * @returns {string}
 */
function rewrite(sentence, oldName, newName, shields) {
  if (!shields.length) return substituteWholeWord(sentence, oldName, newName);
  /** @type {string[]} */
  const held = [];
  let masked = sentence;
  for (const name of shields) {
    masked = masked.replace(new RegExp(escapeRegex(name), 'gu'), (m) => { held.push(m); return `\uE000${held.length - 1}\uE000`; });
  }
  return substituteWholeWord(masked, oldName, newName).replace(/\uE000(\d+)\uE000/g, (/** @type {string} */ _m, /** @type {string} */ i) => held[Number(i)]);
}

/**
 * The record under its new name, the stored sentences that held the old one rewritten.
 * @template {object} T
 * @param {T} settlement the town's record
 * @param {string} oldName its name before the rename
 * @param {string} newName its name after it
 * @returns {T} a new record (the one handed in where nothing changes)
 */
export function renameTownInRecord(settlement, oldName, newName) {
  if (!settlement || typeof settlement !== 'object') return settlement;
  const from = text(oldName);
  const to = text(newName);
  const out = /** @type {Record<string, unknown>} */ ({ ...settlement });
  if (to || !('name' in out)) out.name = to || out.name;
  if (!from || !to || from === to) return /** @type {T} */ (out);
  const others = otherNamesOf(/** @type {Parameters<typeof otherNamesOf>[0]} */ (settlement));
  if (others.includes(from)) return /** @type {T} */ (out);
  const shields = others.filter((n) => n !== from && substituteWholeWord(n, from, '\uE001') !== n);
  /** @param {unknown} v */
  const said = (v) => (typeof v === 'string' ? rewrite(v, from, to, shields) : v);
  for (const k of TOWN_NAME_SENTENCE_KEYS) if (typeof out[k] === 'string') out[k] = said(out[k]);
  /** @param {{ summary?: unknown } | null | undefined} e @returns {unknown} a crisis entry, its `summary` said under the new name */
  const entry = (e) => (e && typeof e === 'object' && typeof e.summary === 'string' ? { ...e, summary: said(e.summary) } : e);
  /** @param {unknown} v a crisis container: one entry or a list (TOWN_NAME_CRISIS_KEYS) */
  const crisis = (v) => (Array.isArray(v) ? v.map(entry) : v && typeof v === 'object' ? entry(v) : v);
  if ('stress' in out) out.stress = crisis(out.stress);
  if ('stressors' in out) out.stressors = crisis(out.stressors);
  return /** @type {T} */ (out);
}
