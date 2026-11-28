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
 * THE `needs` WORDS (ruling 10: "map each `needs` word of the TSV to an atom of the vocabulary; a word with NO atom makes
 * its line INELIGIBLE … never a new atom invented"). `NEEDS_ATOM` below is that map, and the whole of it: a word it
 * names maps to ONE atom of `facts/factVocabulary.js` (checked declarable by the data test); a word it does not name
 * makes the line INELIGIBLE (`ineligible: '<word>: no atom'`), kept in the data so the id guard banks it and the chair
 * can rule it, never drawn. A word written with tempers, `(W,T)`, needs its atom only in those versions
 * (`versionNeeds`); a word written bare needs it in all four (`needs`). The `{good}` slot's "needs: named good" is a
 * slot rule, not a fact (the leaf refuses the line where the mark's good is not a named good).
 *
 * Deterministic: the same two TSVs write the same two files, byte for byte.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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
});

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

/** @param {string} cell @returns {string[]} a speaker rule's mouths, in the writer's order */
export function speakerTokensOf(cell) {
  return String(cell || '').split(';').map((s) => s.trim()).filter(Boolean);
}

/** @param {string} kind @param {string} state @returns {string} the pool key a line is filed under */
const poolKeyOf = (kind, state) => `${kind}.${state}`;

/** @param {string[]} r @returns {object} one said line, as data */
function saidLineOf(r) {
  const [id, kind, state, speaker, , w, t, c, d, slots, , , needsCell] = r;
  /** @type {string[]} */ const needs = [];
  /** @type {Record<string, string[]>} */ const versionNeeds = {};
  /** @type {string[]} */ const words = [];
  /** @type {string[]} */ const missing = [];
  for (const term of needsTermsOf(needsCell)) {
    words.push(term.word);
    const atom = Object.hasOwn(NEEDS_ATOM, term.word) ? NEEDS_ATOM[/** @type {keyof typeof NEEDS_ATOM} */ (term.word)] : null;
    if (!atom) { missing.push(term.word); continue; }
    if (!term.tempers) { if (!needs.includes(atom)) needs.push(atom); continue; }
    for (const tp of term.tempers) (versionNeeds[tp] ||= []).includes(atom) || versionNeeds[tp].push(atom);
  }
  const sl = slotsOf(slots);
  return {
    id, kind, state, speaker: speakerTokensOf(speaker),
    ...(sl.length ? { slots: sl } : {}), ...(words.length ? { needsWords: words } : {}), ...(needs.length ? { needs } : {}),
    ...(Object.keys(versionNeeds).length ? { versionNeeds } : {}),
    ...(missing.length ? { ineligible: missing.map((x) => `${x}: no atom`).join('; ') } : {}),
    versions: { welcoming: w.trim(), transactional: t.trim(), cautious: c.trim(), dismissive: d.trim() },
  };
}

/** @param {string} id @returns {string} the liar line's group: `office.hall`, `front.trade`, `retainer`, `theft` … */
export function liarGroupOf(id) {
  const parts = id.split('.');
  return parts.slice(1, -1).join('.');
}

/** @param {string[]} r @returns {object} one liar line, as data */
function liarLineOf(r) {
  const [id, touches, fits, , , w, t, c, d, falseClaim, inTruth] = r;
  return {
    id, group: liarGroupOf(id), touches: touches.trim(), fits: fits.trim(),
    versions: { welcoming: w.trim(), transactional: t.trim(), cautious: c.trim(), dismissive: d.trim() },
    falseClaim: falseClaim.trim(), inTruth: inTruth.trim(),
  };
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
  const { versions } = /** @type {{ versions: Record<string, string> }} */ (row);
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
 * speaker rule (\`speaker\`: its mouths, in the writer's order); and, only where the writer gave one: its \`slots\`, the
 * writer's \`needsWords\`, its \`needs\` (atoms every version needs) and \`versionNeeds\` (atoms one version needs alone),
 * mapped from the words by the generator's \`NEEDS_ATOM\`, and \`ineligible\` (a needs word with no atom: the line is kept and
 * never drawn, ruling 10); and its four \`versions\`, keyed on the speaker's stored disposition
 * (\`npc.presentation.disposition\`). An absent field is empty.
 *
 * Pure data, no logic. Read by \`domain/voices/voicePlan.js\` alone (lazily, with the tab: never on the first paint).
 */
`;

const LIAR_HEAD = `/**
 * data/voices/liarLines.js — THE LIAR'S LINES (S-G1; VOICES-LINES' \`D-liar-lines.tsv\` at 4116f40b2). ⛔ GENERATED ONCE by
 * \`node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv>\`; after that load this file is the lines' home,
 * fingerprinted and banked as the said lines are.
 *
 * Filed by group: the tie's way through the holder's own house and its family (\`office.hall\`, \`office.faith\`,
 * \`front.trade\`, \`front.other\`, \`retainer\`) and the criminal house's kind (\`smuggling\`, \`blackmarket\`, \`theft\`,
 * \`secrets\`, \`killing\`, \`extortion\`, \`tunnels\`). Each line: its \`id\`, what it \`touches\`, what tie it \`fits\`, its four
 * \`versions\`, the false claim, and \`inTruth\`: THE DM'S NOTE, shown only on the owner's own page, never to a reader.
 *
 * Pure data, no logic. Read by \`domain/voices/voicePlan.js\` alone.
 */
`;

/** @param {string} saidTsv @param {string} liarTsv @returns {{ said: string, liar: string, counts: object }} */
export function generate(saidTsv, liarTsv) {
  /** @type {Map<string, object[]>} */ const said = new Map();
  let ineligible = 0;
  for (const r of readTsv(saidTsv)) {
    const line = /** @type {{ kind: string, state: string, ineligible?: string }} */ (saidLineOf(r));
    if (line.ineligible) ineligible += 1;
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
