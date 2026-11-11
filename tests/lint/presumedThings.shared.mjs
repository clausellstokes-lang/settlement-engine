/**
 * presumedThings.shared.mjs — THE WORD-TO-THING WALKER's rule book (COHERENCE-PRESUME, the chair's
 * charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §1; the pool census's "false
 * presumption", `docs/DESIGN_POOL_CENSUS.md`).
 *
 * A line that names a thing presumes the town has it. Each THING below has its words, written once,
 * beside the vocabulary atoms that answer for it (`src/domain/facts/factVocabulary.js ::
 * FACT_DIMENSIONS`), the way `src/domain/foodways.js :: SOURCE_WORDS` gives the food sources theirs.
 *
 *   ARM 1 (source)  every string literal of three words or more under ARM1_ROOTS that uses a thing's
 *                   words either DECLARES the thing (an atom of `atoms`, on its needs or its excludes,
 *                   in the declaration around it: `needs`, `excludes`, `tags`, `marks`, `cast`,
 *                   `poolDeclares`, or an array handed to the same call) or stands in the register
 *                   under a named reason.
 *   ARM 2 (printed) every sentence of a generated record that uses a thing's words, printed in a town
 *                   where the vocabulary's own readers (`factsOf`) say the thing is ABSENT, is listed;
 *                   a listed line stands in the register under a named reason, or the walker reds.
 * Arm 2 is what finds the lines that code pushes; arm 1 is what finds the lines no corpus reached.
 *
 * The register (`tests/lint/presumedThings.register.json`) is SHRINK-ONLY: a row is never added to
 * absorb a new line. A cure removes its row in the same commit.
 *
 * Pure apart from the file reads of arm 1; arm 2 reads the records it is handed.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

export const REGISTER_REL = 'tests/lint/presumedThings.register.json';

/** The trees arm 1 reads: the pool data and the writers that hold prose. */
export const ARM1_ROOTS = Object.freeze(['src/data', 'src/generators']);

/**
 * THE THINGS. `words`: the words that name it (a building's own walls are not the perimeter, ruling
 * 3; a moneylender is a person, not a house). `atoms`: the vocabulary atoms whose declaration answers
 * for it (a line declaring any of them, on either side, declares the thing). `absent(facts, names)`:
 * true when the record lacks it — the vocabulary's own readers where an atom exists; the live roster's
 * names (`liveInstitutionNames`) where the vocabulary has no atom yet.
 * @type {Readonly<Record<string, { words: RegExp, atoms: ReadonlyArray<string>, absent: (f: any, names: string[]) => boolean }>>}
 */
export const THINGS = Object.freeze({
  walls: {
    words: /\b(?:town|city) walls\b|\bthe walls\b|\bwalls and gates\b|\bramparts?\b|\bbattlements\b/i,
    atoms: ['walls', 'palisade', 'gate'],
    absent: (f) => !f.defence.walls && !f.defence.palisade,
  },
  garrison: {
    words: /\bgarrison(?:s|ed)?\b|\bbarracks\b/i,
    atoms: ['garrison', 'soldiers', 'commander'],
    absent: (f) => !f.defence.garrison,
  },
  militia: { words: /\bmilitias?\b/i, atoms: ['militia'], absent: (f) => !f.defence.militia },
  watch: {
    words: /\b(?:town|city|night|village) watch\b|\bwatchm[ae]n\b|\bthe watch\b|\bwatch captain\b|\bwatch rota\b/i,
    atoms: ['watch'],
    absent: (f) => !f.defence.watch,
  },
  mercenary: {
    words: /\bmercenar(?:y|ies)\b|\bsellswords?\b|\bfree compan(?:y|ies)\b/i,
    atoms: ['mercenary', 'soldiers'],
    absent: (f) => !f.defence.mercenary,
  },
  docks: {
    words: /\bdocks?\b|\bharbou?rs?\b|\bquays?\b|\bwharf\b|\bwharves\b|\bdockside\b|\bdockworkers?\b|\bdockhands?\b/i,
    atoms: ['docks', 'navigable', 'coast', 'river', 'port', 'institution: docks', 'route: port', 'route: river'],
    absent: (f) => !f.water.navigable && !f.hasInstitution('docks'),
  },
  granary: { words: /\bgranar(?:y|ies)\b/i, atoms: ['institution: granary'], absent: (f) => !f.hasInstitution('granary') },
  mill: { words: /\bmill(?:s|er|ers)?\b/i, atoms: ['institution: mill'], absent: (f) => !f.hasInstitution('mill') },
  market: {
    words: /(?<!\bblack |\bwhisper )\bmarket(?:place|s| square| day| days| cross)?\b/i,
    atoms: ['market'],
    absent: (f) => !f.market,
  },
  temple: {
    words: /\btemples?\b|\bchurch(?:es)?\b|\bchapels?\b|\bshrines?\b|\bcathedrals?\b|\babbey\b/i,
    atoms: ['temple', 'sacredHouse', 'clergy', 'priest', 'institution: temple', 'institution: monastery'],
    absent: (f) => !f.sacredHouse,
  },
  prison: {
    words: /\bprisons?\b|\bgaols?\b|\bjails?\b/i,
    atoms: [],
    absent: (_f, names) => !names.some((n) => /prison|gaol|jail|stocks/i.test(n)),
  },
  court: {
    words: /\bcourthouses?\b|\bcourts? of law\b|\blaw ?courts?\b/i,
    atoms: [],
    absent: (_f, names) => !names.some((n) => /court/i.test(n)),
  },
  bank: {
    words: /\bbankers?\b|\bbanking\b|\bmoney.?changers?\b|\bcounting.?houses?\b/i,
    atoms: [],
    absent: (_f, names) => !names.some((n) => /bank|money/i.test(n)),
  },
  guildhall: { words: /\bguild ?halls?\b/i, atoms: ['guild'], absent: (f) => !f.guild },
  war: {
    words: /\bthe war\b|\bwartime\b|\bat war\b|\bthe armies\b/i,
    atoms: ['war: front', 'war: aggressor', 'war: at war', 'war: peace', 'crisis: wartime', 'crisis: under_siege', 'crisis: occupied'],
    absent: (f) => f.warState === 'peace' && !f.crisis?.has?.('wartime') && !f.crisis?.has?.('under_siege') && !f.crisis?.has?.('occupied'),
  },
});

export const THING_IDS = Object.freeze(Object.keys(THINGS));

/**
 * A NEGATION the sentence itself states ("no militia could handle", "without courts or prison"):
 * the line names the thing to say it is not there. Read the same way by both arms.
 * @param {string} sentence @param {RegExp} words
 */
export function negates(sentence, words) {
  const m = new RegExp(words.source, 'ig');
  for (const hit of sentence.matchAll(m)) {
    const before = sentence.slice(Math.max(0, hit.index - 48), hit.index);
    const after = sentence.slice(hit.index + hit[0].length, hit.index + hit[0].length + 24);
    const denied = /\b(?:no|not|without|nor|lacks?|lacking|beyond any|than any)\s+(?:[\w'-]+,?\s+(?:or\s+|and\s+)?){0,3}$/i.test(before)
      || /^\s+(?:cannot|could not|can't|couldn't)\b/i.test(after);
    if (!denied) return false;
  }
  return true;
}

/** The sentences of a printed text (a semicolon closes one, as the scan of the critique read them). */
export const sentencesOf = (text) => String(text).split(/(?<=[.!?;])\s+/).map((s) => s.trim()).filter(Boolean);

/** The things a sentence names and does not negate. @param {string} sentence */
export function thingsNamedIn(sentence) {
  return THING_IDS.filter((id) => THINGS[id].words.test(sentence) && !negates(sentence, THINGS[id].words));
}

// ── ARM 1: the source ─────────────────────────────────────────────────────────────────────────

const DECL_PROPS = new Set(['needs', 'excludes', 'tags', 'marks', 'cast', 'poolDeclares', 'requires']);

/** The atom a declaration word answers (`no X` → X), lower-cased. @param {string} w */
const atomWord = (w) => w.trim().replace(/^no\s+/i, '').toLowerCase();

/**
 * Every string a declaration around `node` carries: the declaration properties of each object
 * literal on the way up (four levels), and the array arguments of each call on the way up (a
 * `declaredSet(text, ['watch'])`).
 * @param {any} node
 */
function declarationWordsAround(node) {
  /** @type {string[]} */ const out = [];
  const strings = (n) => collectStrings(n, out);
  let cur = node.parent;
  for (let depth = 0; cur && depth < 5; depth++, cur = cur.parent) {
    if (ts.isObjectLiteralExpression(cur)) {
      for (const p of cur.properties) {
        const name = p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null;
        if (name && DECL_PROPS.has(name) && ts.isPropertyAssignment(p)) strings(p.initializer);
      }
    } else if (ts.isCallExpression(cur)) {
      for (const a of cur.arguments) if (ts.isArrayLiteralExpression(a)) strings(a);
    }
    if (ts.isVariableStatement(cur) || ts.isFunctionDeclaration(cur) || ts.isSourceFile(cur)) break;
  }
  return out.map(atomWord);
}

/** Is this literal a property NAME (a sibling table's key: its line is declared beside it), or a `twinOf`? */
function isKeyOrTwinOf(node) {
  const p = node.parent;
  if (p && ts.isPropertyAssignment(p) && p.name === node) return true;
  if (p && ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === 'twinOf') return true;
  return false;
}

/**
 * The TEXT-KEYED declarations of one source text: a table whose key is a line's own text and whose
 * value declares it (`DESC_VARIANT_DECLARATIONS`, a sibling set `'<text>': declaredSet(…)`). Text →
 * the declaration words. Read over the whole tree first, because a line and its declaration may
 * live in two files (`rulingStructure.js` prints what `powerSiblings.js` declares).
 * @param {string} rel @param {string} src
 * @returns {Map<string, string[]>}
 */
export function keyedDeclarations(rel, src) {
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  /** @type {Map<string, string[]>} */ const out = new Map();
  const visit = (n) => {
    if (ts.isPropertyAssignment(n) && (ts.isStringLiteral(n.name) || ts.isNoSubstitutionTemplateLiteral(n.name))) {
      const words = [];
      const read = (m) => {
        if (ts.isObjectLiteralExpression(m)) {
          for (const p of m.properties) {
            const name = p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null;
            if (name && DECL_PROPS.has(name) && ts.isPropertyAssignment(p)) collectStrings(p.initializer, words);
          }
        }
        if (ts.isCallExpression(m)) for (const a of m.arguments) if (ts.isArrayLiteralExpression(a)) collectStrings(a, words);
        ts.forEachChild(m, read);
      };
      read(n.initializer);
      if (words.length) out.set(n.name.text, [...(out.get(n.name.text) || []), ...words.map(atomWord)]);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

/** @param {any} n @param {string[]} out */
function collectStrings(n, out) {
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) out.push(n.text);
  ts.forEachChild(n, (m) => collectStrings(m, out));
}

/**
 * Arm 1 over one source text: one hit per (literal, thing) that is NOT declared.
 * @param {string} rel the file's path from the repository root
 * @param {string} src
 * @param {Map<string, string[]>} [keyed] the tree's text-keyed declarations (`keyedDeclarations`)
 * @returns {Array<{ file: string, thing: string, text: string }>}
 */
export function scanSource(rel, src, keyed = keyedDeclarations(rel, src)) {
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
  /** @type {Array<{ file: string, thing: string, text: string }>} */ const hits = [];
  const visit = (n) => {
    const isText = ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n);
    if (isText && n.text.trim().split(/\s+/).length >= 3 && !isKeyOrTwinOf(n)) {
      let declared = null;
      for (const sentence of sentencesOf(n.text)) {
        for (const thing of thingsNamedIn(sentence)) {
          declared ??= [...declarationWordsAround(n), ...(keyed.get(n.text) || [])];
          const atoms = THINGS[thing].atoms.map((a) => a.toLowerCase());
          if (declared.some((w) => atoms.includes(w))) continue;
          if (!hits.some((h) => h.thing === thing && h.text === n.text)) hits.push({ file: rel, thing, text: n.text });
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return hits;
}

/** @param {string} root the repository root @returns {string[]} the files arm 1 reads */
export function listFiles(root) {
  /** @type {string[]} */ const files = [];
  const walk = (rel) => {
    for (const e of readdirSync(join(root, rel)).sort()) {
      const p = `${rel}/${e}`;
      if (statSync(join(root, p)).isDirectory()) walk(p);
      else if (/\.(?:js|jsx|mjs)$/.test(e)) files.push(p);
    }
  };
  for (const r of ARM1_ROOTS) walk(r);
  return files;
}

/** @param {string} root @returns {Array<{ file: string, thing: string, text: string }>} */
export function scanTree(root) {
  const files = listFiles(root).map((rel) => [rel, readFileSync(join(root, rel), 'utf8')]);
  /** @type {Map<string, string[]>} */ const keyed = new Map();
  for (const [rel, src] of files) for (const [k, v] of keyedDeclarations(rel, src)) keyed.set(k, [...(keyed.get(k) || []), ...v]);
  return files.flatMap(([rel, src]) => scanSource(rel, src, keyed));
}

// ── ARM 2: the printed record ─────────────────────────────────────────────────────────────────

/**
 * Record paths that are NOT printed, each with its reason. A path matches when it starts with one
 * of these (or equals it).
 */
export const NOT_PRINTED = Object.freeze({
  '.generationCoherenceReceipt': 'the birth receipt: a component reads its verdict (generalDeskRead.js :: recordCleanOf), never its findings, whose evidence quotes lines listed at their own paths',
  '.simulationTrace': 'the simulation trace: ids and targets for the engine',
});

/** The ids and keys a record carries beside its prose. */
const ID_PATH = /(?:\.id|\.key|\.family|targetId|\.inst\.names\[\])$/;

/** @param {string} path */
export const isPrinted = (path) => !ID_PATH.test(path) && !Object.keys(NOT_PRINTED).some((p) => path === p || path.startsWith(p + '.') || path.startsWith(p + '['));

/** @param {unknown} v @param {string} p @param {Array<[string, string]>} out */
function leaves(v, p, out) {
  if (typeof v === 'string') out.push([p, v]);
  else if (Array.isArray(v)) for (const x of v) leaves(x, `${p}[]`, out);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) leaves(x, `${p}.${k}`, out);
  return out;
}

/**
 * Arm 2 over one record: each (thing, path, sentence) printed while the thing is absent.
 * @param {object} record @param {object} facts `factsOf(record)` @param {string[]} names the live roster's names
 * @returns {Array<{ thing: string, path: string, sentence: string }>}
 */
export function printedAbsent(record, facts, names) {
  /** @type {Map<string, boolean>} */ const absent = new Map();
  const isAbsent = (thing) => {
    if (!absent.has(thing)) absent.set(thing, !!THINGS[thing].absent(facts, names));
    return absent.get(thing);
  };
  /** @type {Array<{ thing: string, path: string, sentence: string }>} */ const out = [];
  const seen = new Set();
  for (const [path, text] of leaves(record, '', [])) {
    if (text.length < 20 || !isPrinted(path)) continue;
    for (const sentence of sentencesOf(text)) {
      for (const thing of thingsNamedIn(sentence)) {
        if (!isAbsent(thing)) continue;
        const k = `${thing}\t${path}\t${sentence}`;
        if (!seen.has(k)) { seen.add(k); out.push({ thing, path, sentence }); }
      }
    }
  }
  return out;
}

/** THE CORPUS (the charter §0.4): the configuration a real browser sends, every dial on random. */
export const CORPUS_PLAN = Object.freeze([['village', 60], ['town', 160], ['city', 100], ['metropolis', 40]]);
export const corpusConfig = (tier) => ({
  settType: tier, tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded',
});
export const corpusSeeds = () => CORPUS_PLAN.flatMap(([tier, n]) => Array.from({ length: n }, (_, i) => ({ tier, seed: `presume-${tier}-${i}` })));

/**
 * Does a register row cover this arm-2 listing? A row names its thing, its path and a stable
 * fragment of the sentence (`text`; names vary between towns, so the fragment leaves them out).
 * @param {{ thing: string, path: string, text: string }} row
 * @param {{ thing: string, path: string, sentence: string }} hit
 */
export const rowCovers = (row, hit) => row.thing === hit.thing && row.path === hit.path && hit.sentence.includes(row.text);
