/**
 * tests/helpers/peopleKinds.js — BAR4-PEOPLE (BRIEF-BAR4 amendment K): THE DETECTORS OF THE PEOPLE'S TWO KINDS, each a
 * pure function over a town's RECORD and the words its page prints from it. They read the settled facts and the lines'
 * own declarations, never the words of one flagged sentence.
 *
 *   P1 · THE PAIR'S TIES (`pairTieClashes`): every pair of cards that carries two or more ties, each tie read by its
 *     printed line's declarations in `src/data/npcData.js` (the archetype's `desc`/`tension` rows: `contact: 'none'` a
 *     line that claims the two do not speak; `successor: true` a line that names a successor to the mentor's own
 *     place, true only of a pair of one house's trade or face, `pairPlace.js :: pairOfOneHouse`) and its TEMPER (`TIE_TEMPER`, beside
 *     the archetypes: a warm strength, a cold kind; a line declaring `trust: 'full'` is warm). An instance is one of:
 *       'broken'    a tie whose line claims no speech beside another tie of the same two (any other tie has them deal);
 *       'warm-cold' a warm tie (a devoted or lifelong teacher, a deep respect, a trust declared full) beside an enemy's;
 *       'successor' a successor's line printed for a pair of no one house's trade or face (the tanner names a carpenter);
 *                   NAMED EXCLUSION: the namer holds the first rank of a power the named sits in: the place is the head's seat.
 *     A successor's line needs no second tie: it is the pair's own condition, read on every tie that prints it.
 *   P2 · A SEX-NAMED EVERYDAY TITLE (`sexNamedTitleClashes`): every word a card is called by (its honorific as the page
 *     resolves it, `cardHonorificOf` and the keeper's `keeperHonorificOf`; its title; its role; the role its ties style
 *     it by) against the table of sex-named words below and the card's `gender`. By the chair's ruling TM1 a title in
 *     "-master" fits either sex, and an office's title is the office's (NAMED EXCLUSIONS below, each with its reason).
 *
 * Pure: no draw, no generation. Each detector takes its tables as an optional argument so a positive control can hand
 * it a constructed table on which it MUST fire.
 */
import { HANDLER_TIE_ARCHETYPES, STRESS_ECONOMIC_EFFECTS, TIE_TEMPER, tieIndexOf } from '../../src/data/npcData.js';
import { leadsPowerOf, pairOfOneHouse } from '../../src/generators/people/pairPlace.js';
import { cardHonorificOf } from '../../src/domain/people/cardDoor.js';
import { keeperHonorificOf } from '../../src/domain/people/seatKeeper.js';
import { defenseFactsOf, forceWordsOf } from '../../src/domain/defense/defenseFacts.js';
import { OFFICE_WORDS } from '../../src/data/officeTitles.js';

/** @param {any} v @returns {Record<string, any>} */
const obj = (v) => (v && typeof v === 'object' ? v : {});
/** @param {any} row */
const closureOf = (row) => (typeof row === 'function' ? row : row?.line);

/**
 * The line a stored tie printed, by its archetype's rows: `{ row, field }` where the description (or the tension) the
 * record holds is that row's own line (not its twin), written either way round; null where none matches.
 * @param {any} archetype @param {Record<string, any>} tie @param {any} a @param {any} b @param {any} force the town's force words
 */
function printedRows(archetype, tie, a, b, force) {
  /** @type {Array<{ row: any, field: 'desc' | 'tension', ends: [any, any] }>} */
  const out = [];
  if (!Number.isInteger(tie.proseVariant)) return out;
  const index = tieIndexOf(tie.proseVariant);
  for (const field of /** @type {const} */ (['desc', 'tension'])) {
    const lines = archetype?.[field]?.lines;
    if (!Array.isArray(lines) || !lines.length) continue;
    const row = lines[index % lines.length];
    const line = closureOf(row);
    if (typeof line !== 'function') continue;
    const text = field === 'desc' ? tie.description : tie.tension;
    for (const ends of /** @type {Array<[any, any]>} */ ([[a, b], [b, a]])) {
      /** @type {string} */
      let said;
      try { said = String(line(ends[0], ends[1], force)); } catch { said = ''; }
      if (said === String(text ?? '')) { out.push({ row, field, ends }); break; }
    }
  }
  return out;
}

/** @param {Record<string, any>} tie @param {Record<string, any>} [tables] */
function archetypeOf(tie, tables = { ...STRESS_ECONOMIC_EFFECTS, ...HANDLER_TIE_ARCHETYPES }) {
  const key = tie.archetypeKey;
  return typeof key === 'string' && Object.hasOwn(tables, key) ? tables[key] : null;
}

/**
 * A tie's temper: 'warm', 'cold' or null (neither).
 * @param {Record<string, any>} tie @param {Array<{ row: any }>} rows @param {Record<string, any>} temper
 */
function temperOf(tie, rows, temper) {
  if (rows.some(({ row }) => row && typeof row === 'object' && row.trust === 'full')) return 'warm';
  const kind = obj(temper[tie.type]);
  return kind[tie.strength] ?? kind['*'] ?? null;
}

/**
 * P1 · every instance of the pair's ties that cannot both hold, and of a successor's line the pair's trades deny.
 * @param {any} record a town's record (`npcs`, `relationships`)
 * @param {{ archetypes?: Record<string, any>, temper?: Record<string, any> }} [tables]
 * @returns {Array<{ kind: 'broken' | 'warm-cold' | 'successor', pair: [string, string], ties: string[], line: string }>}
 */
export function pairTieClashes(record, tables = {}) {
  const s = obj(record);
  const archetypes = tables.archetypes ?? { ...STRESS_ECONOMIC_EFFECTS, ...HANDLER_TIE_ARCHETYPES };
  const temper = tables.temper ?? TIE_TEMPER;
  const cards = new Map((Array.isArray(s.npcs) ? s.npcs : []).map((c) => [String(obj(c).id), c]));
  const force = forceWordsOf(defenseFactsOf({ institutions: Array.isArray(s.institutions) ? s.institutions : [] }));
  /** @type {Map<string, Array<{ tie: Record<string, any>, rows: Array<{ row: any, field: string, ends: [any, any] }> }>>} */
  const pairs = new Map();
  /** @type {ReturnType<typeof pairTieClashes>} */
  const found = [];
  for (const tie of Array.isArray(s.relationships) ? s.relationships : []) {
    const t = obj(tie);
    const a = cards.get(String(t.from)), b = cards.get(String(t.to));
    if (!a || !b) continue;
    const rows = printedRows(archetypeOf(t, archetypes), t, a, b, force);
    const key = [String(t.from), String(t.to)].sort().join('\u0000');
    const pair = /** @type {[string, string]} */ ([String(obj(a).name), String(obj(b).name)]);
    // NAMED EXCLUSION: the namer holds the first rank of a power the named sits in (`leadsPowerOf`): the place is the head's seat
    if (rows.some(({ row, ends }) => row?.successor && !pairOfOneHouse(ends[0], ends[1]) && !leadsPowerOf(ends[0], ends[1]))) {
      found.push({ kind: 'successor', pair, ties: [String(t.id)], line: String(t.description) });
    }
    pairs.set(key, [...(pairs.get(key) || []), { tie: t, rows }]);
  }
  for (const ties of pairs.values()) {
    if (ties.length < 2) continue;
    const names = /** @type {[string, string]} */ ([String(ties[0].tie.npc1Name), String(ties[0].tie.npc2Name)]);
    const ids = ties.map(({ tie }) => String(tie.id));
    const broken = ties.find(({ rows }) => rows.some(({ row }) => row?.contact === 'none'));
    if (broken) found.push({ kind: 'broken', pair: names, ties: ids, line: String(broken.tie.description) });
    const tempers = ties.map(({ tie, rows }) => temperOf(tie, rows, temper));
    if (tempers.includes('warm') && tempers.includes('cold')) {
      found.push({ kind: 'warm-cold', pair: names, ties: ids, line: ties.map(({ tie }) => `${tie.typeName} (${tie.strength})`).join(' / ') });
    }
  }
  return found;
}

/**
 * THE SEX-NAMED EVERYDAY WORDS: a word a reader hears as one sex's, with an ordinary word for the other. Matched as a
 * whole word (a hyphen joins: "Cunning-Man"), case-blind.
 */
export const SEX_NAMED_WORDS = Object.freeze({
  male: Object.freeze(['landlord', 'lord', 'goodman', 'headman', 'foreman', 'ferryman', 'tollman', 'spokesman', 'frontman', 'dairyman',
    'cunning-man', 'boatman', 'watchman', 'huntsman', 'fisherman', 'herdsman', 'woodsman', 'horseman', 'ploughman', 'king', 'prince', 'duke',
    'baron', 'abbot', 'father', 'brother', 'monk', 'friar', 'priest']),
  female: Object.freeze(['landlady', 'lady', 'goodwife', 'alewife', 'fishwife', 'cunning-woman', 'queen', 'princess', 'duchess', 'baroness',
    'abbess', 'priestess', 'mother', 'sister', 'nun', 'madam', 'matron', 'mistress', 'hostess']),
});

/**
 * THE NAMED EXCLUSIONS (each a phrase that holds a sex-named word and is TRUE of either holder, with its reason).
 * Matched before the words: an excluded phrase is taken out of the text first.
 */
export const SEX_NAMED_EXCLUSIONS = Object.freeze([
  Object.freeze({ phrase: /\blord (?:bishop|chancellor|governor)\b/gi, why: "an office's title is the office's (the chair's TM1): the honorific pools' Lord Bishop, Lord Chancellor and Lord Governor are offices" }),
  Object.freeze({ phrase: /\blord's\b/gi, why: "the lord's appointee and the Lord's Bailiff name the lord who appoints, not the holder" }),
  Object.freeze({ phrase: /\bwarlord\b/gi, why: 'a war-leader\'s word with no ordinary other form: it names the rule, not the sex' }),
  Object.freeze({ phrase: /\bmidwife\b/gi, why: "the trade's own word, borne by either sex" }),
  Object.freeze({ phrase: /\b(?:father|mother) (?:superior)\b/gi, why: "an order's office" }),
  Object.freeze({ phrase: /\bpriest\b/gi, why: "the faiths' own word for the office, borne by women as by men (the honorific gives her Mother; the high priest's pair is the high office's own style): FOR THE OWNER'S VETO" }),
]);

/**
 * A word that IS an office's title (`officeTitles.js :: OFFICE_WORDS`, the leader's office written to the card's role, in
 * the caretaker's form or not) is the office's (the chair's TM1): Headman, Lord Mayor, Alderman, Lord Burgomaster.
 */
const OFFICE_FORM = new RegExp(`^(?:acting |regent |deputy )?(?:${OFFICE_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$`, 'i');

/** @param {string} text @param {Readonly<{ male: readonly string[], female: readonly string[] }>} words @param {ReadonlyArray<{ phrase: RegExp }>} exclusions */
function sexOfWords(text, words, exclusions) {
  let t = ` ${String(text || '')} `;
  for (const { phrase } of exclusions) t = t.replace(phrase, ' ');
  const tokens = t.toLowerCase().split(/[^a-z'-]+/).flatMap((w) => [w, ...w.split('-')]).filter(Boolean);
  const joined = t.toLowerCase().split(/[^a-z'-]+/).filter(Boolean);
  /** @type {Array<{ word: string, sex: 'male' | 'female' }>} */
  const hits = [];
  for (const sex of /** @type {const} */ (['male', 'female'])) {
    for (const w of words[sex]) {
      if (w.includes('-') ? joined.includes(w) : tokens.includes(w)) hits.push({ word: w, sex });
    }
  }
  return hits;
}

/**
 * P2 · every word a card is called by that names the other sex.
 * @param {any} record a town's record
 * @param {{ words?: Readonly<{ male: readonly string[], female: readonly string[] }>, exclusions?: ReadonlyArray<{ phrase: RegExp }> }} [tables]
 * @returns {Array<{ card: string, gender: string, where: string, text: string, word: string }>}
 */
export function sexNamedTitleClashes(record, tables = {}) {
  const s = obj(record);
  const words = tables.words ?? SEX_NAMED_WORDS;
  const exclusions = tables.exclusions ?? SEX_NAMED_EXCLUSIONS;
  /** @type {ReturnType<typeof sexNamedTitleClashes>} */
  const found = [];
  const cards = Array.isArray(s.npcs) ? s.npcs : [];
  const byId = new Map(cards.map((c) => [String(obj(c).id), obj(c)]));
  /** @param {Record<string, any>} c @param {string} where @param {unknown} text */
  const read = (c, where, text) => {
    const g = c.gender;
    if ((g !== 'male' && g !== 'female') || typeof text !== 'string' || !text || OFFICE_FORM.test(text.trim())) return;
    for (const hit of sexOfWords(text, words, exclusions)) {
      if (hit.sex !== g) found.push({ card: String(c.name), gender: g, where, text, word: hit.word });
    }
  };
  for (const card of cards) {
    const c = obj(card);
    read(c, 'honorific', cardHonorificOf(c, s));
    read(c, 'keeper honorific', keeperHonorificOf(c, s));
    read(c, 'title', c.title);
    read(c, 'role', c.role);
  }
  for (const tie of Array.isArray(s.relationships) ? s.relationships : []) {
    const t = obj(tie);
    const a = byId.get(String(t.from)), b = byId.get(String(t.to));
    if (a) read(a, 'tie role', t.npc1Role);
    if (b) read(b, 'tie role', t.npc2Role);
  }
  return found;
}
