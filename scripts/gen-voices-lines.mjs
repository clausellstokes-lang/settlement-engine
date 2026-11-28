#!/usr/bin/env node
/**
 * scripts/gen-voices-lines.mjs — THE VOICES' LINES, LOADED ONCE FROM THE WRITER'S TWO TSVs (S-G1; the eleventh chair's
 * ruling E28 point 10: "the lines are data … generated ONCE from the two TSVs by a small script you write and commit").
 *
 *   node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv>
 *
 * The two TSVs are VOICES-LINES' (`docs/chair/2026-11-27/eleventh/survey/lines/` on the chair's record branch, at
 * 4116f40b2): 197 said lines in four tempers and 40 liar lines. The script writes `src/data/voices/saidLines.js` and
 * `src/data/voices/liarLines.js` (frozen data, no logic), each line with its id, its four versions, its speaker rule and
 * its `needs`. The TSVs are the source of the FIRST load only: after it, the two data files are the lines' home (a line
 * re-worded there is re-banked by the id guard's own door, `scripts/stable-pick-ids-door.mjs`).
 *
 * THE `needs` WORDS (ruling 10, as the chair's rulings G1-1 and G1-2 shaped it): each word is answered ONE of three ways,
 * per version (a word written with tempers, `(W,T)`, holds for those versions only; a bare word for all four):
 *   an ATOM      a town-level noun, through `NEEDS_ATOM` to one atom of `facts/factVocabulary.js` (asked of the record
 *                through the door; checked declarable by the data test): the version's `needs`;
 *   the CARD     what KIND of house the card is (`domain/voices/cardWords.js :: CARD_WORDS`, answered by the card's own
 *                catalogue id): the version's `card`;
 *   NOWHERE      the version's `ineligible` (kept, banked by the id guard, never spoken; another line is taken).
 * A word naming the tension's TYPE (`TYPE_STATE`) is a STATE, not a need: the line is filed under that state. No atom is
 * invented. The `{good}` slot's "needs: named good" is a slot rule (the leaf refuses a version whose slot has no value).
 *
 * Deterministic: the same two TSVs write the same two files, byte for byte.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { REGISTERED_WORDS, newWordsNamedIn, thingsNamedIn } from '../src/domain/facts/registeredWords.js';
import { CARD_WORDS } from '../src/domain/voices/cardWords.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SAID_OUT_REL = 'src/data/voices/saidLines.js';
export const LIAR_OUT_REL = 'src/data/voices/liarLines.js';

/** The four tempers in the TSVs' column order, by the stored disposition each is keyed on. */
export const TEMPERS = Object.freeze(['welcoming', 'transactional', 'cautious', 'dismissive']);
const TEMPER_LETTER = Object.freeze({ W: 'welcoming', T: 'transactional', C: 'cautious', D: 'dismissive' });

/**
 * THE MAP, WHOLE (each a town-level noun the record answers through the one door). PLAUSIBLE readings, listed for the
 * chair: `streets (a village or larger)` → the tier; `guards (a watch, garrison or militia)` → the vocabulary's ONE
 * composite of a standing guard; `collectors (the creditor's agents)` and `preachers (the new faith's teachers)` → the
 * crisis's own body (its comment names "the creditor's agent; a second congregation"); `charms sold (a seller of magic)`
 * → a house offering enchanting; `a hearing` → a court sits on the live roster.
 */
export const NEEDS_ATOM = Object.freeze({
  streets: 'tier: ≥ village',
  guards: 'guardPresence',
  collectors: 'crisis body: indebted',
  preachers: 'crisis body: religious_conversion',
  'charms sold': 'enchanting',
  'a hearing': 'court sits',
  // the chair's ruling G1-1 (2): the vocabulary holds the food source (`foodSources`)
  livestock: 'livestock',
});

/**
 * THE TENSION TYPES THAT ARE STATES OF THEIR OWN (the chair's ruling G1-1 (3)): a line whose `needs` names the tension's
 * TYPE is filed under its own state, keyed on the type by the leaf (`cardsOf.js :: TENSION_GROUP`): a key, not an atom.
 */
export const TYPE_STATE = Object.freeze({
  'type: corruption_scandal': 'graft',
  'type: infiltration_fear or occupation_legacy': 'mistrust',
});

/**
 * THE NOUNS A VERSION NAMES (the design's §4: "a SAID line … declares its NOUNS like any line"): the generator asks the
 * rule book (`facts/registeredWords.js`, the presumed-things walker's) which registered things each version's text and
 * each liar line's DM note name, and declares the answer the rule book gives that thing, by this map alone. A thing the
 * map does not name stops the generator (a new noun is a ruling, never a guess). Each entry is an atom or band of the
 * vocabulary the rule book itself lists for the thing.
 */
export const NOUN_DECLARATION = Object.freeze(/** @type {Record<string, { needs?: string[], excludes?: string[], byWord?: Record<string, string[]> }>} */ ({
  watch: { needs: ['watch'] },
  // a line that names the SOLDIERS declares the soldiers (the rule book's own sufficient atom, and the office class's):
  // the war's lines ("war and occupation both guarantee soldiers"); any other armed force, a standing guard
  armedForce: { needs: ['guardPresence'], byWord: { soldiers: ['soldiers'] } },
  streets: { needs: ['tier: ≥ village'] },
  openTrade: { excludes: ['crisis: under_siege'] },
  market: { needs: ['market'] },
  'house: smuggling': { needs: ['house: smuggling'] },
}));

/**
 * THE CHANGED WORDS (the chair's rulings G1-3 (3) and G1-4 of 2026-11-28, each on the owner's veto list as changed words):
 * a false hit of the presumption-classes walker, or a thing answered nowhere that a plain rewording keeps (the four candle
 * versions: "candles" out, the late light kept, each a different remark, L-4), is cured by the LINE's words, never by the
 * rule book. Keyed `<line id> <temper | inTruth>`. The TSV's own text must be `from` (a TSV that changed stops the
 * generator); `drops` names the writer's needs words the old text alone called for.
 */
export const CHANGED_WORDS = Object.freeze(/** @type {Record<string, { from: string, to: string, drops?: string[] }>} */ ({
  'SAID.inst.workshop-ordinary.4 cautious': { from: 'Prices are hard to judge these days.', to: 'Prices are hard to guess these days.' },
  'SAID.trad.feast.3 welcoming': { from: 'Neighbours lend each other pots and pans for the feast.', to: 'Neighbours lend each other pans and dishes for the feast.' },
  'SAID.person.powerface.1 welcoming': { from: 'People come with favours to ask, and most get a hearing.', to: 'People come with favours to ask, and most are heard.' },
  'LIE.front.trade.1 welcoming': { from: 'Anyone may look at the books, and plenty have.', to: 'Anyone may look at the accounts, and plenty have.' },
  'LIE.front.trade.1 cautious': { from: 'The books here have never had a question asked of them.', to: 'The accounts here have never had a question asked of them.' },
  'LIE.front.trade.1 inTruth': { from: 'the books hide the criminal house\'s money passing through', to: 'the accounts hide the criminal house\'s money passing through' },
  'SAID.inst.hall-ordinary.5 transactional': { from: 'Candles burn here long after dark, and someone pays for them.', to: 'The lights burn late there, most nights.', drops: ['candles'] },
  'SAID.inst.inn-ordinary.2 transactional': { from: 'Late nights burn a lot of candles.', to: 'Keeping the lamps lit late costs a fair bit.', drops: ['candles'] },
  'SAID.trad.vigil.3 transactional': { from: 'Candles for the vigil cost more each year.', to: 'Lighting the vigil costs more each year.' },
  'SAID.trad.vigil.3 welcoming': { from: 'Families take turns keeping the candles lit.', to: 'Families take turns tending the lights all night.' },
}));

/**
 * THE CLASS ANSWERS (the chair's rulings G1-3 (1) and (2) of 2026-11-28; the table the chair read, the seat's
 * `CLASS-HITS.md`): what a version presumes where the presumption-classes walker reads a THING class in its words (goods,
 * office, outside …), or where a speaker's word states a MATERIAL fact of the town (drink in plenty): an atom of the
 * vocabulary, asked of the record through the one door like any line's, or the card that answers it
 * (`domain/voices/cardWords.js`). Keyed `<line id> <temper | inTruth>`; an `inTruth` answer is the LINE's (its note
 * prints with every version).
 */
export const CLASS_ANSWERS = Object.freeze(/** @type {Record<string, { needs?: string[], excludes?: string[], card?: string[] }>} */ ({
  // drink in plenty, a material fact: the hunger family (famine, under_siege) shut out
  'SAID.trad.feast.2 transactional': { excludes: ['crisis: hunger'] },
  // a healer's herbs and clean cloths: a healer, an apothecary or a hospital (never an almshouse)
  'SAID.inst.care-ordinary.4 transactional': { card: ['medicine'] },
  // the first carts of the day at a mill or a granary: the town grows grain, and no siege shuts the gate
  'SAID.inst.grain-ordinary.4 welcoming': { needs: ['grain'], excludes: ['crisis: under_siege'] },
  // an inn's travellers: a route at all, and no siege
  'SAID.inst.inn-ordinary.3 welcoming': { needs: ['route open'], excludes: ['crisis: under_siege'] },
  'SAID.inst.inn-ordinary.4 welcoming': { needs: ['route open'], excludes: ['crisis: under_siege'] },
  'SAID.inst.inn-ordinary.4 cautious': { needs: ['route open'], excludes: ['crisis: under_siege'] },
  // a lie about outside goods still needs goods to come in (G1-3 (2))
  'LIE.smuggling.4 welcoming': { needs: ['imports'] },
  'LIE.front.trade.2 welcoming': { needs: ['route open'] },
  'LIE.smuggling.1 inTruth': { needs: ['house: smuggling'] },
}));

/** @param {string} id @param {string} where @param {string} text @returns {string} the text, changed where ruled */
function changedText(id, where, text) {
  const c = Object.hasOwn(CHANGED_WORDS, `${id} ${where}`) ? CHANGED_WORDS[`${id} ${where}`] : null;
  if (!c) return text;
  if (c.from !== text) throw new Error(`gen-voices-lines: ${id} ${where} is no longer "${c.from}" in the TSV: "${text}"`);
  return c.to;
}
/** @param {string} id @param {string} where @returns {{ needs: string[], excludes: string[], card: string[] }} */
function classAnswerOf(id, where) {
  const a = Object.hasOwn(CLASS_ANSWERS, `${id} ${where}`) ? CLASS_ANSWERS[`${id} ${where}`] : {};
  return { needs: [...(a.needs || [])], excludes: [...(a.excludes || [])], card: [...(a.card || [])] };
}

/**
 * THE SPEAKER RULES AS KEYS (the writer's words for a mouth, each to the one key the plan reads). A mouth the map does not
 * name stops the generator.
 */
export const SPEAKER_KEY = Object.freeze(/** @type {Record<string, string>} */ ({
  anyone: 'anyone', keeper: 'keeper', 'one who works there': 'works-there', 'an officer of the watch': 'watch-officer',
  'a member of the power': 'member', 'anyone not of the power': 'not-member', 'anyone not of the power (the aggrieved)': 'not-member',
  "anyone not of the seat's power": 'not-seat', "anyone (never a member of the seat's power)": 'not-seat',
  'one it has wronged': 'wronged', 'one it has wronged (never an officer of the watch or of the seat)': 'wronged-not-officer',
  'one who works at the market': 'market-worker', 'the keeper of the rites': 'rite-keeper',
  "the card's own person (a power's own face)": 'own-person', 'one who depends on it': 'depends',
}));

/**
 * The declaration the nouns of one text call for, through `NOUN_DECLARATION`.
 * @param {string} text @param {string} where @returns {{ needs: string[], excludes: string[] }}
 */
export function nounDeclarationOf(text, where) {
  /** @type {string[]} */ const needs = []; /** @type {string[]} */ const excludes = [];
  for (const id of [...thingsNamedIn(text), ...newWordsNamedIn(text)]) {
    if (!Object.hasOwn(REGISTERED_WORDS, id)) continue;
    const d = Object.hasOwn(NOUN_DECLARATION, id) ? NOUN_DECLARATION[id] : null;
    if (!d) throw new Error(`gen-voices-lines: ${where} names the registered thing '${id}', which NOUN_DECLARATION does not answer: "${text}"`);
    const word = Object.keys(d.byWord || {}).find((w) => new RegExp(`\\b${w}\\b`, 'i').test(text));
    for (const a of word ? /** @type {Record<string, string[]>} */ (d.byWord)[word] : d.needs || []) if (!needs.includes(a)) needs.push(a);
    for (const a of d.excludes || []) if (!excludes.includes(a)) excludes.push(a);
  }
  return { needs, excludes };
}

/** @param {string} text @param {string[]} needs @param {string[]} excludes @returns {{ text: string, needs?: string[], excludes?: string[] }} */
const versionOf = (text, needs, excludes) => ({ text, ...(needs.length ? { needs } : {}), ...(excludes.length ? { excludes } : {}) });

/** @param {string} path @returns {string[][]} the rows under the header */
function readTsv(path) {
  const lines = readFileSync(path, 'utf8').split('\n').filter((l) => l.trim() !== '');
  return lines.slice(1).map((l) => l.split('\t'));
}

/**
 * One `needs` cell, parsed: `word (gloss) (W,T); other (gloss)` → its terms. A trailing `(…)` of temper letters names the
 * versions; any other parenthesis is a gloss. A bare parenthetical term (a note) is dropped.
 * @param {string} cell
 * @returns {Array<{ word: string, tempers: string[] | null }>}
 */
export function needsTermsOf(cell) {
  /** @type {Array<{ word: string, tempers: string[] | null }>} */ const out = [];
  for (const raw of splitTop(String(cell || ''))) {
    let t = raw.trim();
    if (!t || t.startsWith('(')) continue;
    /** @type {string[] | null} */ let tempers = null;
    const m = /\(([WTCD](?:\s*,\s*[WTCD])*)\)\s*$/.exec(t);
    if (m) { tempers = m[1].split(',').map((x) => TEMPER_LETTER[/** @type {'W'} */ (x.trim())]); t = t.slice(0, m.index).trim(); }
    const word = t.replace(/\s*\(.*\)\s*$/, '').trim();
    if (word) out.push({ word, tempers });
  }
  return out;
}

/** @param {string} s @returns {string[]} the cell split on the semicolons outside every parenthesis */
function splitTop(s) {
  /** @type {string[]} */ const out = []; let depth = 0; let at = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth += 1;
    else if (s[i] === ')') depth = Math.max(0, depth - 1);
    else if (s[i] === ';' && depth === 0) { out.push(s.slice(at, i)); at = i + 1; }
  }
  out.push(s.slice(at));
  return out;
}

/** @param {string} cell @returns {string[]} the slot names a line's `slots` cell holds */
function slotsOf(cell) {
  return [...String(cell || '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}

/** @param {string} cell @param {string} where @returns {string[]} a speaker rule's mouths, in the writer's order, as keys */
export function speakerTokensOf(cell, where = '') {
  return String(cell || '').split(';').map((x) => x.trim()).filter(Boolean).map((m) => {
    if (!Object.hasOwn(SPEAKER_KEY, m)) throw new Error(`gen-voices-lines: ${where} names a mouth SPEAKER_KEY does not know: '${m}'`);
    return SPEAKER_KEY[m];
  });
}

/** @param {string} kind @param {string} state @returns {string} the pool key a line is filed under */
const poolKeyOf = (kind, state) => `${kind}.${state}`;

/** @param {string[]} r @returns {object} one said line, as data */
function saidLineOf(r) {
  const [id, kind, stateCell, speaker, , w, t, c, d, slots, , , needsCell] = r;
  let state = stateCell;
  // the needs of every version, then of one version alone, by kind: an atom of the vocabulary (asked through the door),
  // a word the CARD answers (`domain/voices/cardWords.js`), or a word answered nowhere (that version is ineligible)
  /** @type {Record<string, { atoms: string[], card: string[], nowhere: string[] }>} */
  const per = Object.fromEntries(TEMPERS.map((tp) => [tp, { atoms: [], card: [], nowhere: [] }]));
  const add = (/** @type {string[]} */ list, /** @type {string} */ x) => { if (!list.includes(x)) list.push(x); };
  for (const term of needsTermsOf(needsCell)) {
    if (Object.hasOwn(TYPE_STATE, term.word)) { state = TYPE_STATE[/** @type {keyof typeof TYPE_STATE} */ (term.word)]; continue; }
    const atom = Object.hasOwn(NEEDS_ATOM, term.word) ? NEEDS_ATOM[/** @type {keyof typeof NEEDS_ATOM} */ (term.word)] : null;
    for (const tp of term.tempers || TEMPERS) {
      if (CHANGED_WORDS[`${id} ${tp}`]?.drops?.includes(term.word)) continue; // the changed words no longer name it
      if (atom) add(per[tp].atoms, atom);
      else if (Object.hasOwn(CARD_WORDS, term.word)) add(per[tp].card, term.word);
      else add(per[tp].nowhere, term.word);
    }
  }
  const texts = { welcoming: changedText(id, 'welcoming', w.trim()), transactional: changedText(id, 'transactional', t.trim()),
    cautious: changedText(id, 'cautious', c.trim()), dismissive: changedText(id, 'dismissive', d.trim()) };
  /** @type {Record<string, object>} */ const versions = {};
  for (const tp of TEMPERS) {
    const own = nounDeclarationOf(texts[/** @type {'welcoming'} */ (tp)], `${id} ${tp}`);
    const ans = classAnswerOf(id, tp);
    const vn = [...per[tp].atoms];
    for (const a of [...own.needs, ...ans.needs]) if (!vn.includes(a)) vn.push(a);
    const ve = [...own.excludes]; for (const a of ans.excludes) if (!ve.includes(a)) ve.push(a);
    for (const x of ans.card) add(per[tp].card, x);
    versions[tp] = { ...versionOf(texts[/** @type {'welcoming'} */ (tp)], vn, ve),
      ...(per[tp].card.length ? { card: per[tp].card } : {}), ...(per[tp].nowhere.length ? { ineligible: per[tp].nowhere } : {}) };
  }
  const sl = slotsOf(slots);
  return { id, kind, state, speaker: speakerTokensOf(speaker, id), ...(sl.length ? { slots: sl } : {}), versions };
}

/** @param {string} id @returns {string} the liar line's group: `office.hall`, `front.trade`, `retainer`, `theft` … */
export function liarGroupOf(id) {
  const parts = id.split('.');
  return parts.slice(1, -1).join('.');
}

/** @param {string[]} r @returns {object} one liar line, as data (the writer's notes, `touches`, `fits` and the false claim, stay in the TSV) */
function liarLineOf(r) {
  const [id, , , , , w, t, c, d, , inTruth] = r;
  const truth = changedText(id, 'inTruth', inTruth.trim());
  const note = nounDeclarationOf(truth, `${id} inTruth`);
  { const ans = classAnswerOf(id, 'inTruth'); for (const a of ans.needs) if (!note.needs.includes(a)) note.needs.push(a); for (const a of ans.excludes) if (!note.excludes.includes(a)) note.excludes.push(a); }
  const texts = { welcoming: changedText(id, 'welcoming', w.trim()), transactional: changedText(id, 'transactional', t.trim()),
    cautious: changedText(id, 'cautious', c.trim()), dismissive: changedText(id, 'dismissive', d.trim()) };
  /** @type {Record<string, object>} */ const versions = {};
  for (const tp of TEMPERS) {
    const own = nounDeclarationOf(texts[/** @type {'welcoming'} */ (tp)], `${id} ${tp}`);
    const ans = classAnswerOf(id, tp);
    const vn = [...own.needs]; for (const a of ans.needs) if (!vn.includes(a)) vn.push(a);
    const ve = [...own.excludes]; for (const a of ans.excludes) if (!ve.includes(a)) ve.push(a);
    versions[tp] = versionOf(texts[/** @type {'welcoming'} */ (tp)], vn, ve);
  }
  return { id, group: liarGroupOf(id), inTruth: truth, ...(note.needs.length ? { needs: note.needs } : {}), ...(note.excludes.length ? { excludes: note.excludes } : {}), versions };
}

/** @param {unknown} v @returns {string} a JS literal of a plain value (frozen whole by the file's own \`deepFreeze\`) */
function lit(v) {
  if (v === null) return 'null';
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(v)) return `[${v.map(lit).join(', ')}]`;
  if (typeof v === 'object') {
    const key = (/** @type {string} */ k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`);
    const ents = Object.entries(/** @type {object} */ (v));
    return ents.length ? `{ ${ents.map(([k, x]) => `${key(k)}: ${lit(x)}`).join(', ')} }` : '{}';
  }
  return String(v);
}

/** @param {object} row @returns {string} one line of a pool, its versions on a line each */
function rowOf(row) {
  const { versions } = /** @type {{ versions: Record<string, object> }} */ (row);
  // the pool's key carries the kind, the state and the group: a row does not repeat them
  const rest = Object.fromEntries(Object.entries(row).filter(([k]) => !['versions', 'kind', 'state', 'group'].includes(k)));
  const head = lit(rest).replace(/ }$/, '');
  return `    ${head},\n      versions: {\n${TEMPERS.map((t) => `        ${t}: ${lit(versions[t])},`).join('\n')}\n      } },`;
}

const FREEZE = `/** @template T @param {T} v @returns {T} */
function deepFreeze(v) {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) { Object.freeze(v); for (const x of Object.values(v)) deepFreeze(x); }
  return v;
}
`;

/** @param {Map<string, object[]>} groups @param {string} name @returns {string} */
function recordOf(groups, name) {
  const body = [...groups].map(([k, rows]) => `  '${k}': [\n${rows.map(rowOf).join('\n')}\n  ],`).join('\n');
  return `${FREEZE}\nexport const ${name} = deepFreeze({\n${body}\n});\n`;
}

const SAID_HEAD = `/**
 * data/voices/saidLines.js — THE SAID LINES (S-G1; VOICES-LINES' \`C-said-lines.tsv\` at 4116f40b2, accepted by the chair as
 * ruling L-5). ⛔ GENERATED ONCE by \`node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv>\`; after that
 * load this file is the lines' home, and every version of every line is fingerprinted by the id guard
 * (\`tests/lint/stablePickIds.shared.mjs :: IMPORTED_POOLS\`, words \`versions\`) and banked by its own door.
 *
 * Filed by pool, \`<card kind>.<state>\` (the keys of \`survey/lines/A-keys.md\` as ruled L-1 to L-4). Each line: its \`id\`; its
 * speaker rule (\`speaker\`: its mouths in the writer's order, as the generator's \`SPEAKER_KEY\` keys them); its \`slots\`
 * where it has any; and its four \`versions\`, keyed on the speaker's stored disposition (\`npc.presentation.disposition\`),
 * each \`{ text, needs, excludes, card, ineligible }\`: the atoms that version presumes, asked of the record through the one
 * door (the writer's needs words through \`NEEDS_ATOM\`, the nouns the text names through \`NOUN_DECLARATION\`); the
 * card-level words its card must answer (\`domain/voices/cardWords.js\`); the words answered nowhere (that version is
 * never spoken). An absent field is empty.
 *
 * Pure data, no logic. Read by \`domain/voices/voicePlan.js\` alone (lazily, with the tab: never on the first paint).
 */
`;

const LIAR_HEAD = `/**
 * data/voices/liarLines.js — THE LIAR'S LINES (S-G1; VOICES-LINES' \`D-liar-lines.tsv\` at 4116f40b2). ⛔ GENERATED ONCE by
 * \`node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv>\`; after that load this file is the lines' home,
 * fingerprinted and banked as the said lines are.
 *
 * Each line: its \`id\`; \`inTruth\`; the \`needs\` and \`excludes\` its DM note presumes; and its four versions, each
 * \`{ text, needs, excludes }\` as the said lines'. Filed by group: the tie's way through the holder's own house and its family (\`office.hall\`, \`office.faith\`,
 * \`front.trade\`, \`front.other\`, \`retainer\`) and the criminal house's kind (\`smuggling\`, \`blackmarket\`, \`theft\`,
 * \`secrets\`, \`killing\`, \`extortion\`, \`tunnels\`). \`inTruth\` is THE DM'S NOTE, shown only on the owner's own page,
 * never to a reader. What each line touches and what tie it fits are the writer's notes, kept in the TSV.
 *
 * Pure data, no logic. Read by \`domain/voices/voicePlan.js\` alone.
 */
`;

/** @param {string} saidTsv @param {string} liarTsv @returns {{ said: string, liar: string, counts: object }} */
export function generate(saidTsv, liarTsv) {
  /** @type {Map<string, object[]>} */ const said = new Map();
  let ineligible = 0;
  for (const r of readTsv(saidTsv)) {
    const line = /** @type {{ kind: string, state: string, versions: Record<string, { ineligible?: string[] }> }} */ (saidLineOf(r));
    if (Object.values(line.versions).some((v) => v.ineligible)) ineligible += 1;
    const k = poolKeyOf(line.kind, line.state);
    if (!said.has(k)) said.set(k, []);
    /** @type {object[]} */ (said.get(k)).push(line);
  }
  /** @type {Map<string, object[]>} */ const liar = new Map();
  for (const r of readTsv(liarTsv)) {
    const line = /** @type {{ group: string }} */ (liarLineOf(r));
    if (!liar.has(line.group)) liar.set(line.group, []);
    /** @type {object[]} */ (liar.get(line.group)).push(line);
  }
  // every changed word and every class answer names a line and a place that exist (a key misspelled stops the generator)
  const places = new Set([...said.values(), ...liar.values()].flat().flatMap((/** @type {any} */ l) => [...TEMPERS, ...(l.inTruth ? ['inTruth'] : [])].map((w) => `${l.id} ${w}`)));
  for (const k of [...Object.keys(CHANGED_WORDS), ...Object.keys(CLASS_ANSWERS)]) if (!places.has(k)) throw new Error(`gen-voices-lines: '${k}' names no line's version or note`);
  const n = (/** @type {Map<string, object[]>} */ m) => [...m.values()].reduce((a, v) => a + v.length, 0);
  return {
    said: `${SAID_HEAD}\n${recordOf(said, 'SAID_LINES')}`,
    liar: `${LIAR_HEAD}\n${recordOf(liar, 'LIAR_LINES')}`,
    counts: { said: n(said), saidPools: said.size, ineligible, liar: n(liar), liarGroups: liar.size },
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [saidTsv, liarTsv] = process.argv.slice(2);
  if (!saidTsv || !liarTsv) { console.error('usage: node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv>'); process.exit(2); }
  const out = generate(saidTsv, liarTsv);
  mkdirSync(join(ROOT, 'src/data/voices'), { recursive: true });
  writeFileSync(join(ROOT, SAID_OUT_REL), out.said);
  writeFileSync(join(ROOT, LIAR_OUT_REL), out.liar);
  console.log(JSON.stringify(out.counts));
}
