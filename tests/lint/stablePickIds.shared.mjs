/**
 * stablePickIds.shared.mjs — THE ID GUARD of point 120 (D13 STABLE-PICKS): the reader, the findings and the door's plan,
 * shared by the walker (`tests/lint/stablePickIds.walker.test.js`) and the door (`scripts/stable-pick-ids-door.mjs`).
 *
 * WHY IT EXISTS. Point 120 prints, for each slot, the admitted line with the highest hash of (the slot's key, THE LINE'S
 * OWN ID) (`src/kernel/proseHash.js :: pickRendezvous`). So an id must never move: never renumbered, never reused; a
 * removed line's id is RETIRED. Point 121 (TAIL-PICKS) put seven more view-time picks on a line's own id
 * (`rankRendezvous`, `pickRendezvous`, the door's ranked mode in `src/domain/facts/drawDeclared.js`). Three id families
 * are held:
 *   DAILY LIFE  the pool lines under `src/data/dailyLife/` (objects with an `id` and a `text`), read by IMPORT; a line's
 *               scope is its slot and branch (`<slot>|<branch>`); ids are unique within a scope.
 *   VIABILITY   the pairs `['SS1', `…sentence…`]` written inside `src/domain/display/dossierViewModel.js ::
 *               deriveViability`, read from SOURCE TEXT by a small lexer (one scope, `viability`: ids unique across all
 *               the function's pools).
 *   IMPORTED POOLS  point 121's pools, named one by one in `IMPORTED_POOLS` (a module, an export, a scope, a layout:
 *               a flat array, or a record whose values are arrays), read by IMPORT at run time; a row is an object
 *               with a string `id` and its words: a `text`, a `say` function (fingerprinted by its own source text,
 *               `String(row.say)`, normalised as the text is), or (S-G1, the voices' lines) `versions`, four strings
 *               keyed on the stored dispositions, read in one fixed order and joined. ONE RUNTIME (RULING 121-6): the family is read under
 *               PLAIN NODE on both sides: the door imports it itself; the walker takes it from a plain-node child,
 *               `node scripts/stable-pick-ids-door.mjs --print-tree`, never from its own import under the test loader
 *               (which rewrites an imported binding and adds semicolons inside a function's source).
 *
 * THE BASELINE (`tests/lint/stablePickIds.baseline.json`) holds, per scope, `present` (each id with a FINGERPRINT of
 * the line's words as banked) and `retired` (ids that once existed and are gone). The fingerprint's input: Daily Life,
 * the line's `text`; viability, the sentence's template source text as written; before hashing, runs of whitespace are
 * collapsed, the ends trimmed, and the letters lower-cased. The baseline's path is fixed; no environment variable
 * re-points it.
 *
 * THE WALKER IS RED when: a banked present id is neither in the tree nor retired (a silent removal); an id of the tree
 * (or of the baseline's present) is also retired (a reuse); an id appears twice in its scope; an id of the tree is not
 * banked (red until the door adds it); a banked fingerprint is found under a DIFFERENT present id of its scope (an id
 * moved between lines: the insertion that shifts later ids, the swap); a present id's words differ from the banked
 * fingerprint (re-worded in place: red until the door re-banks it); the baseline file is absent; the reader cannot read
 * the tree (below).
 *
 * THE VIABILITY READER IS FAIL-CLOSED: line and block comments are stripped; every row `[<id>, <sentence>]` is seen
 * whatever its layout and quote style (every pair `[<a plain string>, <a string or a template>]` is a row, and a row whose
 * id is not of the id's form is red); EVERY STRING OF AN ID'S FORM inside the function, in any quote style (single,
 * double, backtick), at any depth, is counted as an id key, and the count of id keys must equal the count of rows read;
 * a row form it does not recognise, a function it cannot find or lex, is red. The Daily Life reader is fail-closed too:
 * every exported value of every pool file that holds an id-bearing object must sit at a slot this module names; every
 * slot it names is read exactly once; a pool file that holds no line is red. The imported-pools reader is fail-closed:
 * every module of its table must import; every named export must exist, have its layout, and yield at least one row;
 * every row must carry a string `id` and its words; an export named twice in the table is red. IN EVERY FAMILY an id is a
 * NON-EMPTY string with no space at either end and no line break (`idProblem`; the viability rows' id form already holds
 * it); anything else is red, the row named, and the door refuses it.
 *
 * WHAT IT IS FOR: an honest mistake.
 *   - an insertion that shifts the later ids;
 *   - a swap of two ids;
 *   - a reuse of a retired id;
 *   - a duplicate id;
 *   - a silent removal;
 *   - all five in the imported pools as well: a frame re-worded in place or moved to another id is seen, a `say`
 *     frame by its own source text;
 *   - a `say` frame is fingerprinted by its source as PLAIN NODE prints it, the same in the door and the walker (the
 *     walker's copy is read by a plain-node child; a child that fails, prints nothing or no JSON, or reads fewer
 *     scopes than the table names is red, its stderr in the message).
 * WHAT IT DOES NOT CATCH (the deliberate kind; the reviewer of the change is the control):
 *   - a moved line whose words are also changed;
 *   - an id assembled by concatenation, or a row built outside `deriveViability`;
 *   - a swap laundered through several door runs;
 *   - a scope's entry deleted whole from the baseline (the door banks the scope afresh, its retired ids freed);
 *   - the outsider impressions' SECOND pick (`src/domain/dailyLife.js :: outsiderParts`) draws among options keyed by
 *     their BRANCH NAME, not a line's id: a renamed branch re-deals that pick;
 *   - present ids deleted from the baseline by hand and then shifted in the tree (they are banked afresh);
 *   - `pickRendezvous` itself, handed a duplicate or a missing id or a falsy key, returns the first line in LIST ORDER
 *     (the guard is what keeps duplicates out; a nameless record's picks follow the pool's order, as the old pick's did);
 *   - a `say` frame whose words are built from a value outside the function: it is fingerprinted by its source text,
 *     not by what it prints (a re-worded outside value is not seen);
 *   - a pool that is not in `IMPORTED_POOLS`: the table is the list of what is held, and a ranked pick added elsewhere
 *     without a row here is not seen.
 *   - a row moved between two pools of one export, its id and words kept: a record's arrays are read into ONE scope and
 *     the array's key is not banked (the id's own form pins the pool where it carries one: the tradition table's and the
 *     cast wants' tests);
 *   - letter case and whitespace alone are no re-wording (the fingerprint collapses whitespace and lower-cases);
 *   - a comment added inside a `say` function IS read as a re-wording (its source text is fingerprinted: red until re-banked).
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const BASELINE_REL = 'tests/lint/stablePickIds.baseline.json';
export const DAILY_LIFE_DIR_REL = 'src/data/dailyLife';
export const VIABILITY_FILE_REL = 'src/domain/display/dossierViewModel.js';
export const VIABILITY_FUNCTION = 'deriveViability';
export const VIABILITY_SCOPE = 'viability';

/**
 * Every pool export of `src/data/dailyLife/`, and the slot it is drawn under (the slot of the pick's key
 * `<name>::dailyLife.<slot>::<branch>` in `src/domain/dailyLife.js`). An ARRAY export names its own branch; an OBJECT
 * export's keys are the branches. An id-bearing export missing here is red (the reader is fail-closed).
 * @type {Readonly<Record<string, { slot: string, branch?: string }>>}
 */
export const DAILY_LIFE_EXPORTS = Object.freeze({
  GATHERING_NAMED: { slot: 'gathering_places', branch: 'named' },
  GATHERING_PLAIN: { slot: 'gathering_places', branch: 'plain' },
  DAWN_WORK: { slot: 'dawn_work' },
  CHILD_WARNINGS: { slot: 'child_warnings' },
  COMMONER_RESENTMENTS: { slot: 'commoner_resentments' },
  COMMONER_RESENTMENTS_DM: { slot: 'commoner_resentments_dm' },
  FOOD_CULTURE: { slot: 'food_culture' },
  OUTSIDER_IMPRESSIONS: { slot: 'outsider_impressions' },
  UNSPOKEN_TOPICS: { slot: 'unspoken_topics' },
  RECENT_CHANGES: { slot: 'recent_changes' },
});

/**
 * THE IMPORTED POOLS (point 121, TAIL-PICKS): every pool held by import, its scope, its layout and where its words are.
 * `flat`: the export is an array of rows; `record`: an object whose values are arrays of rows (its keys are not scopes).
 * Words: `text` (a string), `say` (a function, by its source), or `versions` (S-G1: an object of FOUR strings keyed on the
 * stored dispositions, `VERSION_KEYS`, read in that order and joined: a re-wording of any one is a re-wording of the row).
 * @typedef {{ module: string, export: string, scope: string, layout: 'flat' | 'record', words: 'text' | 'say' | 'versions' }} ImportedPool
 * @type {ReadonlyArray<ImportedPool>}
 */
export const IMPORTED_POOLS = Object.freeze([
  { module: 'src/data/fortuneMeritLines.js', export: 'FORTUNE_MERIT_LINES', scope: 'fortune.merit', layout: 'flat', words: 'text' },
  { module: 'src/data/fortuneLastingLines.js', export: 'FORTUNE_LASTING_LINES', scope: 'fortune.lasting', layout: 'flat', words: 'text' },
  ...['ACT_LEADS', 'ELEMENT_GLOSS', 'HOUSE_FRAMES', 'POWER_FRAMES', 'OWNER_FRAMES', 'KEEPER_FRAMES_TOO', 'CAUSE_FRAMES', 'ECONOMY_FRAMES'].map((t) => ({
    module: 'src/data/traditionDescriptionTable.js', export: t, scope: `traditionDescription.${t}`, layout: /** @type {'flat' | 'record'} */ (t === 'OWNER_FRAMES' ? 'flat' : 'record'), words: /** @type {'text'} */ ('text'),
  })),
  { module: 'src/domain/summary/tonightSheet.js', export: 'CAST_WANTS', scope: 'tonight.castWants', layout: 'record', words: 'text' },
  { module: 'src/domain/display/defenseDisplay.js', export: 'ORGANIZED_RING_NOTES', scope: 'defense.organizedRing', layout: 'flat', words: 'text' },
  { module: 'src/pdf/lib/headlines.js', export: 'OVERVIEW_HEADLINES', scope: 'pdf.headlines.overview', layout: 'flat', words: 'say' },
  { module: 'src/pdf/lib/headlines.js', export: 'ECONOMICS_HEADLINES', scope: 'pdf.headlines.economics', layout: 'flat', words: 'say' },
  { module: 'src/pdf/lib/headlines.js', export: 'NPCS_HEADLINES', scope: 'pdf.headlines.npcs', layout: 'flat', words: 'say' },
  { module: 'src/domain/summary/settlementQuickGuide.js', export: 'SCOPE_LINE_FRAMES', scope: 'quickGuide.scopeLine', layout: 'flat', words: 'say' },
  { module: 'src/data/voices/saidLines.js', export: 'SAID_LINES', scope: 'voices.said', layout: 'record', words: 'versions' },
  { module: 'src/data/voices/liarLines.js', export: 'LIAR_LINES', scope: 'voices.liar', layout: 'record', words: 'versions' },
].map((r) => Object.freeze(r)));

/** THE FOUR VERSIONS of a voices line (S-G1), in the order they are read: the stored dispositions (`npc.presentation.disposition`). */
export const VERSION_KEYS = Object.freeze(['welcoming', 'transactional', 'cautious', 'dismissive']);
/** What joins the four versions before the fingerprint (no version holds it; whitespace alone would collapse). */
export const VERSIONS_JOIN = ' ¦ ';

/**
 * A `versions` row's words: its four versions in `VERSION_KEYS` order, joined; null unless all four are non-empty strings.
 * @param {unknown} versions @returns {string | null}
 */
export function versionsWordsOf(versions) {
  if (!versions || typeof versions !== 'object' || Array.isArray(versions)) return null;
  const v = /** @type {Record<string, unknown>} */ (versions);
  const words = VERSION_KEYS.map((k) => v[k]);
  return words.every((w) => typeof w === 'string' && w.trim() !== '') ? words.join(VERSIONS_JOIN) : null;
}

/** An id's form: a prefix of letters and a number (`P3`, `SS1`; lower case counted too). */
export const ID_FORM = /^[A-Za-z]{1,4}[0-9]+$/;

/**
 * AN ID IS a non-empty string with no space at either end and no line break (RULING 121-5 (b)), in EVERY family's reader:
 * anything else is red in the walker and refused by the door, the row named.
 * @param {unknown} id @returns {string | null} why the value is not an id, or null when it is one
 */
export const idProblem = (id) => (typeof id !== 'string' ? 'not a string'
  : id === '' ? 'an empty string'
    : /^\s|\s$/.test(id) ? 'a space at an end'
      : /[\r\n\u2028\u2029]/.test(id) ? 'a line break' : null);

/** @param {string} words @returns {string} the words as the fingerprint reads them */
export const normaliseWords = (words) => words.replace(/\s+/g, ' ').trim().toLowerCase();

/** @param {string} words @returns {string} a short fingerprint of the words (12 hex of sha256 of the normalised words) */
export const fingerprintOf = (words) => createHash('sha256').update(normaliseWords(words), 'utf8').digest('hex').slice(0, 12);

/**
 * @typedef {{ id: string, fp: string }} TreeLine
 * @typedef {{ scopes: Map<string, TreeLine[]>, problems: string[] }} Tree
 * @typedef {{ present: Record<string, string>, retired: string[] }} BaselineScope
 * @typedef {{ scopes: Record<string, BaselineScope> }} Baseline
 * @typedef {{ kind: 'removed' | 'reused' | 'duplicate' | 'unbanked' | 'moved' | 'reworded', scope: string, id: string, detail: string }} Finding
 */

/** @param {unknown} x @returns {boolean} */
const isIdBearing = (x) => !!x && typeof x === 'object' && !Array.isArray(x) && 'id' in /** @type {object} */ (x);

/** @param {unknown} v @returns {boolean} the value holds an id-bearing object anywhere inside it */
function holdsIdBearing(v, depth = 0) {
  if (depth > 6 || !v || typeof v !== 'object') return false;
  if (isIdBearing(v)) return true;
  return Object.values(/** @type {object} */ (v)).some((x) => holdsIdBearing(x, depth + 1));
}

/**
 * Read one branch's lines into the tree (fail-closed: every member must be `{ id: string, text: string }`).
 * @param {Map<string, TreeLine[]>} scopes @param {string[]} problems @param {string} scope @param {unknown} lines @param {string} where
 */
function readBranch(scopes, problems, scope, lines, where) {
  if (!Array.isArray(lines)) { problems.push(`${where}: the branch is not an array of lines`); return; }
  if (scopes.has(scope)) problems.push(`${where}: scope ${scope} is read twice`);
  /** @type {TreeLine[]} */ const out = scopes.get(scope) ?? [];
  lines.forEach((l, i) => {
    if (!l || typeof l.id !== 'string' || typeof l.text !== 'string') { problems.push(`${where}[${i}]: a line without a string id and text`); return; }
    const bad = idProblem(l.id);
    if (bad) { problems.push(`${where}[${i}]: the id ${JSON.stringify(l.id)} is not an id (${bad}: an id is a non-empty string with no space at either end and no line break)`); return; }
    out.push({ id: l.id, fp: fingerprintOf(l.text) });
  });
  scopes.set(scope, out);
}

/**
 * THE DAILY LIFE READER: every pool file of `src/data/dailyLife/`, by import.
 * @param {Record<string, Record<string, unknown>>} modules file name → the module's exports
 * @param {{ whole?: boolean }} [opts] `whole`: these are ALL the pool files, so every slot named here must be read once
 * @returns {Tree}
 */
export function dailyLifeTreeOf(modules, { whole = false } = {}) {
  /** @type {Map<string, TreeLine[]>} */ const scopes = new Map();
  /** @type {string[]} */ const problems = [];
  /** @type {Map<string, number>} */ const read = new Map();
  for (const [file, exports] of Object.entries(modules)) {
    let held = 0;
    for (const [name, value] of Object.entries(exports)) {
      if (!holdsIdBearing(value)) continue;
      held++;
      read.set(name, (read.get(name) ?? 0) + 1);
      const at = DAILY_LIFE_EXPORTS[name];
      const where = `${DAILY_LIFE_DIR_REL}/${file} :: ${name}`;
      if (!at) { problems.push(`${where}: an id-bearing export this guard does not name (add it to DAILY_LIFE_EXPORTS with its slot)`); continue; }
      if (at.branch) { readBranch(scopes, problems, `${at.slot}|${at.branch}`, value, where); continue; }
      if (Array.isArray(value)) { problems.push(`${where}: an array where branches were expected`); continue; }
      for (const [branch, lines] of Object.entries(/** @type {Record<string, unknown>} */ (value))) {
        if (!holdsIdBearing(lines)) continue;
        readBranch(scopes, problems, `${at.slot}|${branch}`, lines, `${where}.${branch}`);
      }
    }
    if (whole && held === 0) problems.push(`${DAILY_LIFE_DIR_REL}/${file}: a pool file that holds no line (emptied, or not a pool file)`);
  }
  if (whole) {
    for (const name of Object.keys(DAILY_LIFE_EXPORTS)) {
      if ((read.get(name) ?? 0) !== 1) problems.push(`${DAILY_LIFE_DIR_REL} :: ${name}: read ${read.get(name) ?? 0} times (once expected)`);
    }
  }
  return { scopes, problems };
}

/** @param {string} root @returns {Promise<Record<string, Record<string, unknown>>>} */
export async function importDailyLife(root = ROOT) {
  const dir = join(root, DAILY_LIFE_DIR_REL);
  /** @type {Record<string, Record<string, unknown>>} */ const modules = {};
  for (const file of readdirSync(dir).filter((f) => /\.(m?js)$/.test(f)).sort()) {
    modules[file] = { ...(await import(pathToFileURL(join(dir, file)).href)) };
  }
  return modules;
}

// ── THE VIABILITY READER: a small JavaScript lexer over the function's source ─────────────────────────────────────────

/**
 * @typedef {{ t: 'str', q: string, body: string, at: number }
 *   | { t: 'tpl', body: string, subst: boolean, inner: Tok[][], at: number }
 *   | { t: 'punc', v: string, at: number }
 *   | { t: 'word', v: string, at: number }
 *   | { t: 're', at: number }} Tok
 */

const REGEX_AFTER_WORDS = new Set(['return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'instanceof', 'yield', 'await']);

/**
 * Lex code from `i` until the brace that closes depth 0 (when `closeAtBrace`), or the end of `src`.
 * Comments are dropped. Throws on anything unterminated.
 * @param {string} src @param {number} i @param {boolean} closeAtBrace
 * @returns {{ toks: Tok[], end: number }} `end` is the index of the closing brace (or src.length)
 */
function lexCode(src, i, closeAtBrace) {
  /** @type {Tok[]} */ const toks = [];
  let depth = 0;
  const prevAllowsRegex = () => {
    const p = toks[toks.length - 1];
    if (!p) return true;
    if (p.t === 'punc') return p.v !== ')' && p.v !== ']';
    if (p.t === 'word') return REGEX_AFTER_WORDS.has(p.v);
    return false;
  };
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { const e = src.indexOf('\n', i); i = e < 0 ? src.length : e; continue; }
    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      if (e < 0) throw new Error(`an unterminated block comment at ${i}`);
      i = e + 2; continue;
    }
    if (c === '\'' || c === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; if (src[j] === '\n') throw new Error(`an unterminated string at ${i}`); j++; }
      if (j >= src.length) throw new Error(`an unterminated string at ${i}`);
      toks.push({ t: 'str', q: c, body: src.slice(i + 1, j), at: i }); i = j + 1; continue;
    }
    if (c === '`') { const { tok, end } = lexTemplate(src, i); toks.push(tok); i = end; continue; }
    if (c === '/' && prevAllowsRegex()) {
      let j = i + 1; let inClass = false;
      while (j < src.length) {
        const d = src[j];
        if (d === '\n') throw new Error(`an unterminated regular expression at ${i}`);
        if (d === '\\') { j += 2; continue; }
        if (d === '[') inClass = true; else if (d === ']') inClass = false; else if (d === '/' && !inClass) break;
        j++;
      }
      if (j >= src.length) throw new Error(`an unterminated regular expression at ${i}`);
      j++; while (j < src.length && /[a-z]/.test(src[j])) j++;
      toks.push({ t: 're', at: i }); i = j; continue;
    }
    if (/[A-Za-z0-9_$]/.test(c)) {
      let j = i; while (j < src.length && /[A-Za-z0-9_$]/.test(src[j])) j++;
      toks.push({ t: 'word', v: src.slice(i, j), at: i }); i = j; continue;
    }
    if (c === '{') depth++;
    if (c === '}') {
      if (depth === 0 && closeAtBrace) return { toks, end: i };
      depth--;
    }
    toks.push({ t: 'punc', v: c, at: i }); i++;
  }
  if (closeAtBrace) throw new Error('an unclosed brace (the code ran to the end of the source)');
  return { toks, end: src.length };
}

/**
 * Lex a template literal starting at the backtick `i`; its substitutions are lexed as code.
 * @param {string} src @param {number} i @returns {{ tok: Tok, end: number }}
 */
function lexTemplate(src, i) {
  let j = i + 1; let subst = false;
  /** @type {Tok[][]} */ const inner = [];
  while (j < src.length && src[j] !== '`') {
    if (src[j] === '\\') { j += 2; continue; }
    if (src[j] === '$' && src[j + 1] === '{') {
      subst = true;
      const { toks, end } = lexCode(src, j + 2, true);
      inner.push(toks); j = end + 1; continue;
    }
    j++;
  }
  if (j >= src.length) throw new Error(`an unterminated template literal at ${i}`);
  return { tok: { t: 'tpl', body: src.slice(i + 1, j), subst, inner, at: i }, end: j + 1 };
}

/** @param {Tok | undefined} t @returns {string | null} the content of a plain string (or a template with no substitution) */
const plainContent = (t) => (!t ? null : t.t === 'str' ? t.body : t.t === 'tpl' && !t.subst ? t.body : null);
/** @param {Tok | undefined} t @param {string} v */
const isPunc = (t, v) => !!t && t.t === 'punc' && t.v === v;

/**
 * Locate the function's body in the source and lex it.
 * @param {string} src @param {string} fn @returns {Tok[]}
 */
function functionBody(src, fn) {
  const re = new RegExp(`\\bfunction\\s+${fn}\\s*\\(`, 'g');
  const at = [...src.matchAll(re)].map((m) => m.index ?? 0);
  if (at.length !== 1) throw new Error(`\`function ${fn}(\` is written ${at.length} times (one expected)`);
  // the parameters: lex to the first top-level `{` after the parameter list closes
  let i = at[0] + (src.slice(at[0]).indexOf('(')) + 1; let paren = 1;
  while (i < src.length && paren > 0) { if (src[i] === '(') paren++; else if (src[i] === ')') paren--; i++; }
  while (i < src.length && /\s/.test(src[i])) i++;
  if (src[i] !== '{') throw new Error(`the body of ${fn} does not open with a brace`);
  return lexCode(src, i + 1, true).toks;
}

/**
 * Every row and every id key in a token list, at every depth (template substitutions included).
 * @param {Tok[]} toks @param {{ rows: Array<{ id: string, src: string }>, idKeys: number, unread: string[] }} acc
 */
function collect(toks, acc) {
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k];
    const content = plainContent(t);
    if (content !== null) {
      const a = toks[k - 1]; const comma = toks[k + 1]; const b = toks[k + 2];
      let close = toks[k + 3];
      if (isPunc(close, ',')) close = toks[k + 4];
      const sentence = b && (b.t === 'str' || b.t === 'tpl') ? b.body : null;
      // EVERY pair `[<a plain string>, <a string or a template>]` is a row (RULING 120R-2, cure 3)
      const isRow = isPunc(a, '[') && isPunc(comma, ',') && sentence !== null && isPunc(close, ']');
      const idForm = ID_FORM.test(content);
      if (idForm) acc.idKeys++;
      if (isRow && idForm) acc.rows.push({ id: content, src: /** @type {string} */ (sentence) });
      else if (isRow) acc.unread.push(`${JSON.stringify(content)} (at ${t.at}): a row whose id is not of the id's form`);
      else if (idForm) acc.unread.push(`${content} (at ${t.at}): a string of an id's form outside a row \`[<id>, <sentence>]\``);
    }
    if (t.t === 'tpl') for (const sub of t.inner) collect(sub, acc);
  }
}

/**
 * THE VIABILITY READER over one source text.
 * @param {string} src the source of `dossierViewModel.js`
 * @returns {{ rows: Array<{ id: string, src: string }>, idKeys: number, problems: string[] }}
 */
export function viabilityRowsIn(src) {
  /** @type {{ rows: Array<{ id: string, src: string }>, idKeys: number, unread: string[] }} */
  const acc = { rows: [], idKeys: 0, unread: [] };
  /** @type {string[]} */ const problems = [];
  try {
    collect(functionBody(src, VIABILITY_FUNCTION), acc);
  } catch (e) {
    problems.push(`${VIABILITY_FILE_REL} :: ${VIABILITY_FUNCTION}: the reader cannot read it: ${/** @type {Error} */ (e).message}`);
    return { rows: [], idKeys: 0, problems };
  }
  if (acc.idKeys !== acc.rows.length) {
    problems.push(`${VIABILITY_FILE_REL} :: ${VIABILITY_FUNCTION}: ${acc.idKeys} id keys against ${acc.rows.length} rows read`);
  }
  for (const u of acc.unread) problems.push(`${VIABILITY_FILE_REL} :: ${VIABILITY_FUNCTION}: ${u}`);
  if (acc.rows.length === 0) problems.push(`${VIABILITY_FILE_REL} :: ${VIABILITY_FUNCTION}: no row read (the reader is vacuous)`);
  return { rows: acc.rows, idKeys: acc.idKeys, problems };
}

/** @param {string} src @returns {Tree} the viability family as a tree */
export function viabilityTreeOf(src) {
  const { rows, problems } = viabilityRowsIn(src);
  return { scopes: new Map([[VIABILITY_SCOPE, rows.map((r) => ({ id: r.id, fp: fingerprintOf(r.src) }))]]), problems };
}

/**
 * @param {string} root @param {{ importedFromChild?: boolean }} [opts] `importedFromChild`: the imported pools are read by
 * a plain-node child of the door (the walker), not by this process's own import (the door, itself under plain node)
 * @returns {Promise<Tree>} every family, read from the tree at `root`
 */
export async function readTree(root = ROOT, { importedFromChild = false } = {}) {
  const daily = dailyLifeTreeOf(await importDailyLife(root), { whole: true });
  const via = viabilityTreeOf(readFileSync(join(root, VIABILITY_FILE_REL), 'utf8'));
  const imported = importedFromChild ? importedPoolsTreeFromChild(IMPORTED_POOLS, { root })
    : importedPoolsTreeOf(await importPoolModules(IMPORTED_POOLS, root), IMPORTED_POOLS);
  return {
    scopes: new Map([...daily.scopes, ...via.scopes, ...imported.scopes]),
    problems: [...daily.problems, ...via.problems, ...imported.problems],
  };
}

// ── THE IMPORTED-POOLS READER (point 121) ─────────────────────────────────────────────────────────────────────────────

/** @typedef {{ exports: Record<string, unknown> } | { error: string }} PoolModule a module's exports, or why it would not import */
/**
 * Import every module the table names; a module that will not import is held as its error.
 * @param {ReadonlyArray<ImportedPool>} table @param {string} root
 * @returns {Promise<Record<string, PoolModule>>}
 */
export async function importPoolModules(table, root = ROOT) {
  /** @type {Record<string, PoolModule>} */ const out = {};
  for (const m of [...new Set(table.map((r) => r.module))]) {
    try {
      out[m] = { exports: { ...(await import(pathToFileURL(join(root, m)).href)) } };
    } catch (e) {
      out[m] = { error: /** @type {Error} */ (e).message };
    }
  }
  return out;
}

/**
 * THE IMPORTED-POOLS READER: each table row's export, read at run time (fail-closed).
 * @param {Record<string, PoolModule>} modules module path → its exports (or its import error)
 * @param {ReadonlyArray<ImportedPool>} table
 * @returns {Tree}
 */
export function importedPoolsTreeOf(modules, table) {
  /** @type {Map<string, TreeLine[]>} */ const scopes = new Map();
  /** @type {string[]} */ const problems = [];
  /** @type {Set<string>} */ const named = new Set();
  for (const pool of table) {
    const where = `${pool.module} :: ${pool.export}`;
    if (named.has(where)) { problems.push(`${where}: named twice in IMPORTED_POOLS (read once)`); continue; }
    named.add(where);
    const mod = modules[pool.module];
    if (!mod) { problems.push(`${pool.module}: not imported`); continue; }
    if (!('exports' in mod)) { problems.push(`${pool.module}: will not import (${mod.error})`); continue; }
    if (!Object.hasOwn(mod.exports, pool.export)) { problems.push(`${where}: no such export`); continue; }
    const value = mod.exports[pool.export];
    /** @type {Array<[string, unknown]>} */ const branches = [];
    if (pool.layout === 'flat') {
      if (!Array.isArray(value)) { problems.push(`${where}: not a flat array of rows`); continue; }
      branches.push(['', value]);
    } else {
      if (!value || typeof value !== 'object' || Array.isArray(value)) { problems.push(`${where}: not a record of arrays`); continue; }
      for (const [k, v] of Object.entries(value)) {
        if (!Array.isArray(v)) { problems.push(`${where}.${k}: not an array of rows`); continue; }
        branches.push([`.${k}`, v]);
      }
    }
    if (scopes.has(pool.scope)) problems.push(`${where}: scope ${pool.scope} is read twice`);
    /** @type {TreeLine[]} */ const lines = scopes.get(pool.scope) ?? [];
    for (const [k, rows] of branches) {
      /** @type {unknown[]} */ (rows).forEach((row, i) => {
        const r = /** @type {{ id?: unknown, text?: unknown, say?: unknown, versions?: unknown } | null} */ (row);
        const words = !r ? null : pool.words === 'text' ? (typeof r.text === 'string' ? r.text : null)
          : pool.words === 'versions' ? versionsWordsOf(r.versions) : (typeof r.say === 'function' ? String(r.say) : null);
        const what = pool.words === 'text' ? 'text' : pool.words === 'versions' ? 'four versions' : '`say` function';
        if (!r || typeof r.id !== 'string' || words === null) { problems.push(`${where}${k}[${i}]: a row without a string id and its ${what}`); return; }
        const bad = idProblem(r.id);
        if (bad) { problems.push(`${where}${k}[${i}]: the id ${JSON.stringify(r.id)} is not an id (${bad}: an id is a non-empty string with no space at either end and no line break)`); return; }
        lines.push({ id: r.id, fp: fingerprintOf(words) });
      });
    }
    if (lines.length === 0) problems.push(`${where}: no row read (an empty pool)`);
    scopes.set(pool.scope, lines);
  }
  return { scopes, problems };
}

// ── ONE RUNTIME (RULING 121-6): the imported pools as a plain-node child of the door reads them ───────────────────────

export const DOOR_REL = 'scripts/stable-pick-ids-door.mjs';
export const PRINT_TREE_FLAG = '--print-tree';

/** @param {Tree} tree @returns {string} the tree as the door's print mode writes it */
export const treeJson = (tree) => JSON.stringify({ scopes: [...tree.scopes], problems: tree.problems });

/**
 * The imported pools read by a PLAIN-NODE child (`node <door> --print-tree [<module> <export>]`), fail-closed: a non-zero
 * exit, empty output, output that is not the tree's JSON, or fewer scopes than the table names is a problem (the child's
 * stderr in it).
 * @param {ReadonlyArray<ImportedPool>} table the scopes the child must read
 * @param {{ root?: string, args?: string[], door?: string }} [opts] `args`: a fixture's module and export; `door`: another
 * script in the door's place (both for the self-test only)
 * @returns {Tree}
 */
export function importedPoolsTreeFromChild(table, { root = ROOT, args = [], door = join(root, DOOR_REL) } = {}) {
  const r = spawnSync(process.execPath, [door, PRINT_TREE_FLAG, ...args], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 });
  const err = `${r.error ? `${r.error.message}; ` : ''}stderr: ${(r.stderr || '').trim() || '(empty)'}`;
  /** @param {string} why @returns {Tree} */
  const red = (why) => ({ scopes: new Map(), problems: [`the imported pools' plain-node child (${DOOR_REL} ${PRINT_TREE_FLAG}): ${why} (${err})`] });
  if (r.status !== 0) return red(`exited ${r.status ?? r.signal}`);
  if (!(r.stdout || '').trim()) return red('printed nothing');
  /** @type {{ scopes?: unknown, problems?: unknown }} */ let parsed;
  try { parsed = JSON.parse(r.stdout); } catch (e) { return red(`printed no JSON (${/** @type {Error} */ (e).message})`); }
  if (!parsed || !Array.isArray(parsed.scopes) || !Array.isArray(parsed.problems)) return red('printed JSON that is not a tree');
  const scopes = new Map(/** @type {Array<[string, TreeLine[]]>} */ (parsed.scopes));
  const want = new Set(table.map((p) => p.scope)).size;
  if (scopes.size < want) {
    return { scopes, problems: [...red(`read ${scopes.size} scopes where the table names ${want}`).problems, .../** @type {string[]} */ (parsed.problems)] };
  }
  return { scopes, problems: /** @type {string[]} */ (parsed.problems) };
}

// ── THE BASELINE ──────────────────────────────────────────────────────────────────────────────────────────────────────

/** @param {string} root @returns {Baseline | null} the baseline, or null when the file is absent */
export function readBaseline(root = ROOT) {
  const p = join(root, BASELINE_REL);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (e) {
    throw new Error(`${BASELINE_REL} is not JSON (${/** @type {Error} */ (e).message}): restore it from git; the baseline is never re-made`);
  }
}

/** @param {Baseline} baseline @returns {string[]} what is malformed in the baseline itself */
export function baselineProblems(baseline) {
  /** @type {string[]} */ const out = [];
  if (!baseline || typeof baseline.scopes !== 'object' || baseline.scopes === null) return ['the baseline has no `scopes` object'];
  for (const [scope, s] of Object.entries(baseline.scopes)) {
    if (!s || typeof s.present !== 'object' || s.present === null || !Array.isArray(s.retired)) { out.push(`${scope}: a scope without \`present\` and \`retired\``); continue; }
    for (const id of s.retired) if (Object.hasOwn(s.present, id)) out.push(`${scope} ${id}: banked present AND retired`);
    if (new Set(s.retired).size !== s.retired.length) out.push(`${scope}: an id retired twice`);
  }
  return out;
}

/**
 * THE FINDINGS: the tree against the baseline, every red the walker owes, scope by scope.
 * @param {Tree} tree @param {Baseline} baseline @returns {Finding[]}
 */
export function findings(tree, baseline) {
  /** @type {Finding[]} */ const out = [];
  const allScopes = new Set([...tree.scopes.keys(), ...Object.keys(baseline.scopes || {})]);
  for (const scope of allScopes) {
    const lines = tree.scopes.get(scope) ?? [];
    const bank = baseline.scopes?.[scope] ?? { present: {}, retired: [] };
    const retired = new Set(bank.retired);
    /** @type {Map<string, Set<string>>} fingerprint → the present ids banked with it */ const owners = new Map();
    for (const [id, fp] of Object.entries(bank.present)) { if (!owners.has(fp)) owners.set(fp, new Set()); owners.get(fp)?.add(id); }
    /** @type {Map<string, number>} */ const seen = new Map();
    for (const l of lines) seen.set(l.id, (seen.get(l.id) ?? 0) + 1);
    for (const [id, n] of seen) if (n > 1) out.push({ kind: 'duplicate', scope, id, detail: `written ${n} times in its scope` });
    for (const l of lines) {
      if (retired.has(l.id)) { out.push({ kind: 'reused', scope, id: l.id, detail: 'a retired id is in the tree again' }); continue; }
      const banked = Object.hasOwn(bank.present, l.id) ? bank.present[l.id] : null;
      const others = [...(owners.get(l.fp) ?? [])].filter((x) => x !== l.id);
      if (others.length && !(owners.get(l.fp)?.has(l.id))) {
        out.push({ kind: 'moved', scope, id: l.id, detail: `holds the words banked as ${others.join(', ')} (an id moved between lines)` });
        continue;
      }
      if (banked === null) { out.push({ kind: 'unbanked', scope, id: l.id, detail: 'not in the baseline (the door adds it)' }); continue; }
      if (banked !== l.fp) out.push({ kind: 'reworded', scope, id: l.id, detail: 're-worded in place (the door re-banks it)' });
    }
    for (const id of Object.keys(bank.present)) {
      if (retired.has(id)) out.push({ kind: 'reused', scope, id, detail: 'banked present and retired' });
      else if (!seen.has(id)) out.push({ kind: 'removed', scope, id, detail: 'banked present, gone from the tree, not retired (the door retires it)' });
    }
  }
  return out;
}

/**
 * THE DOOR'S PLAN: what `--write` would do, or why it refuses.
 * It ONLY adds ids, retires a vanished id, and re-banks a re-wording in place; it never renumbers and never frees a
 * retired id. It refuses a missing baseline, a baseline emptied to a skeleton where the tree holds ids, a move, a reuse, a duplicate,
 * a malformed baseline, and a tree the reader cannot read.
 * @param {Tree} tree @param {Baseline | null} baseline
 * @returns {{ refusals: string[], added: string[], retired: string[], reworded: string[], next: Baseline | null }}
 */
export function doorPlan(tree, baseline) {
  /** @type {string[]} */ const refusals = [];
  /** @type {string[]} */ const added = [];
  /** @type {string[]} */ const retiredNow = [];
  /** @type {string[]} */ const reworded = [];
  if (baseline === null) {
    return { refusals: [`${BASELINE_REL} is absent: restore it from git; the baseline is never re-made`], added, retired: retiredNow, reworded, next: null };
  }
  for (const p of baselineProblems(baseline)) refusals.push(`the baseline is malformed: ${p}`);
  if (refusals.length) return { refusals, added, retired: retiredNow, reworded, next: null };
  for (const p of tree.problems) refusals.push(`the reader cannot read the tree: ${p}`);
  const bankedTotal = Object.values(baseline.scopes).reduce((n, s) => n + Object.keys(s.present).length, 0);
  const treeTotal = [...tree.scopes.values()].reduce((n, l) => n + l.length, 0);
  if (bankedTotal === 0 && treeTotal > 0) refusals.push('the baseline banks no id at all while the tree holds ids: restore the baseline from git; it is never refilled');
  for (const [scope, lines] of tree.scopes) {
    const s = baseline.scopes[scope];
    // the EMPTIED SKELETON only (RULING 120R-2, cure 2): a wholly retired scope takes new ids as any scope does
    if (s && Object.keys(s.present).length === 0 && s.retired.length === 0 && lines.length > 0) refusals.push(`${scope}: the baseline's present and retired are empty where the tree holds ids: restore the baseline from git; it is never refilled`);
  }
  const f = findings(tree, baseline);
  for (const x of f) {
    if (x.kind === 'moved' || x.kind === 'reused' || x.kind === 'duplicate') refusals.push(`${x.kind}: ${x.scope} ${x.id}: ${x.detail}`);
  }
  if (refusals.length) return { refusals, added, retired: retiredNow, reworded, next: null };
  /** @type {Baseline} */ const next = { ...baseline, scopes: {} };
  const scopes = [...new Set([...Object.keys(baseline.scopes), ...tree.scopes.keys()])];
  for (const scope of scopes) {
    const old = baseline.scopes[scope] ?? { present: {}, retired: [] };
    const lines = tree.scopes.get(scope) ?? [];
    /** @type {Record<string, string>} */ const present = {};
    for (const l of lines) {
      if (!Object.hasOwn(old.present, l.id)) added.push(`${scope} ${l.id}`);
      else if (old.present[l.id] !== l.fp) reworded.push(`${scope} ${l.id}`);
      present[l.id] = l.fp;
    }
    const retired = [...old.retired];
    for (const id of Object.keys(old.present)) if (!Object.hasOwn(present, id)) { retired.push(id); retiredNow.push(`${scope} ${id}`); }
    next.scopes[scope] = { present, retired };
  }
  return { refusals, added, retired: retiredNow, reworded, next };
}

/** @param {Baseline} baseline @returns {string} the file's text, as the door writes it */
export const baselineText = (baseline) => `${JSON.stringify(baseline, null, 2)}\n`;
