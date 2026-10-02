/**
 * scripts/wiring-census.mjs — ARCH car 0: THE WIRING CENSUS, COMMITTED AS DATA.
 *
 * WHAT THIS IS. `src/domain/prose/wiringCensus.js` is an INSTRUMENT: pure, file-free, and
 * fenced out of every product import path by bytes. The composed-prose model needs its
 * output at AUTHORING time — the projector reads it beside the annex to refuse a `READS`
 * token the census does not list, to emit the render half of `poolMeta`, and to refuse to
 * run at all when its stamp is stale (ARCH §3.5). A module the product cannot import
 * cannot serve that, and a leaf the product CAN import would breach the fence. So the
 * census ships as DATA: `docs/content/wiring-census.json`, written here, `--check`-gated
 * exactly as the prose leaves are (`generate-dossier-state-prose.mjs:706-713`).
 *
 * ── THE FOUR MODES ──────────────────────────────────────────────────────────────────
 *   (default)             write `docs/content/wiring-census.json`
 *   --check               refuse on a stale byte or a stale stamp; write nothing
 *   --dry                 the would-be diff summary against the committed file; WRITES NOTHING
 *   --print               the receipt's own figures, from this one command
 *   --rates <file>        fold a RATE-corpus run (scripts/prose-rate-corpus.mjs --out)
 *                         into the rate half before writing
 *
 * ⚠ WHY `--check` DOES NOT RECOMPUTE THE RATE HALF. The rate half is 768 generated towns
 * composed through six desks; that is a lane's probe and never a gate operation. `--check`
 * recomputes the CENSUS half and the STAMP and carries the committed rate half through
 * verbatim, so a stale composer byte reds and a stale rate table is refreshed by an
 * explicit `--rates` run. Stated here rather than left as a silence: a check that quietly
 * skipped half the file would be the false green this estate has a name for.
 *
 * ── WHY THE SOURCE READERS FOR THE RELATION TABLE LIVE HERE AND NOT IN THE MODULE ────
 * `src/domain/**` carries a hard 800-effective-line ceiling and `wiringCensus.js` stands
 * at 783 after car 0's six row columns. The RELATION EXTRACTION produces no row column, it
 * READS FILES (which the census module's own header forbids it to do), and it lands in
 * this JSON. It is therefore built here, in the estate's own idiom — the scanner lives in
 * `scripts/` and the walker imports it, exactly as `writerReach.walker.test.js` imports
 * `check-writer-reach.mjs` and `scripts/lib/writer-reach-scan.mjs`.
 *
 * READ-ONLY except `docs/content/wiring-census.json`. No RNG, no clock in any figure.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { parse } from 'espree';

import {
  attachSets, censusSummary, customReachable, factBudget, factIndex, modifierRows, rootOf,
  spineRows, tierRows, TIERS, WIRING_STATUS, wiringCensus,
} from '../src/domain/prose/wiringCensus.js';
import { holderCensus, sourceSummary } from '../src/domain/prose/holderTable.js';
import { fieldSynonymTable } from '../src/domain/prose/fieldSynonyms.js';
import { DOSSIER_MOUNTS, UNMOUNTED_BLOCKS } from '../src/domain/display/stateProse/dossierMounts.js';
import { CONDITION_ARCHETYPE_TEMPLATES } from '../src/domain/activeConditions.js';
import { canonicalAffectedSystems } from '../src/domain/worldPulse/stressorsCore.js';
import { CAUSE_SIGNAL } from '../src/domain/worldPulse/causeVocabulary.js';
import { CUSTOM_CONTENT_MANIFEST } from '../src/domain/content/customContentManifest.js';
import { loadStateLeaves, ROOT, STATE_ANNEX } from '../tests/helpers/dossierCorpus.js';
import { readAnnexDeclarations } from './lib/dossier-annex-grammar.mjs';
import {
  COMPOSERS, composedFillByBlock, composedFillByKeyFunction, composerSources, fillSites,
  unrenderedFacts,
} from '../tests/helpers/dossierComposedFill.js';

export const CENSUS_JSON = join(ROOT, 'docs/content/wiring-census.json');

/**
 * The files whose bytes the stamp is taken over: the six composers and the mount registry.
 * A sha here moving is the `stale-stamp` refusal — the census was taken against a composer
 * that has since changed. The CANDIDATE LEAVES are stamped too, but through their own
 * measurement below rather than through this list, because their membership is discovered
 * at the tip and not declared here (SEAM car 3b-0).
 */
export const STAMPED = Object.freeze([
  ...COMPOSERS,
  'src/domain/display/stateProse/dossierMounts.js',
]);

/** Where the per-desk candidate leaves live, and the suffix that identifies one. */
export const CANDIDATE_LEAF_DIR = 'src/domain/display/stateProse';
/** @see CANDIDATE_LEAF_DIR */
export const CANDIDATE_LEAF_SUFFIX = 'StateProseCandidates.js';

/** @param {string} text @returns {string} */
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

/**
 * ⭐ THE CANDIDATE LEAVES, MEASURED AT THE TIP (SEAM car 3b-0).
 *
 * ⛔ WHY THIS IS A FUNCTION AND NOT A SENTENCE. Car 0 stamped the string `none at this tip:
 * car 3a lands src/domain/display/stateProse/*StateProseCandidates.js`, written in
 * anticipation of a car that has now landed. A hand-written claim about the tree is true
 * until the tree moves and then goes on being re-emitted, word for word, by a script whose
 * whole job is to say what is actually there: re-running the census would have faithfully
 * republished a false sentence. So the claim is replaced by the reading — the leaves that
 * EXIST, by name, each with the sha256 of its bytes. Six today, and the walker asserts the
 * six by name so a seventh desk, or a leaf deleted, is a red rather than a quiet number.
 *
 * The leaves are NOT in `STAMPED`: this is a discovered set, and a path list that had to be
 * edited by hand to admit a new leaf would carry the same failure mode one level up.
 *
 * @returns {Record<string, string>} repo-relative path -> sha256, ordered by path
 */
export function candidateLeafIndex() {
  const dir = join(ROOT, CANDIDATE_LEAF_DIR);
  const names = readdirSync(dir).filter((name) => name.endsWith(CANDIDATE_LEAF_SUFFIX)).sort();
  return Object.fromEntries(names.map((name) => [
    `${CANDIDATE_LEAF_DIR}/${name}`,
    sha256(readFileSync(join(dir, name), 'utf8')),
  ]));
}

/**
 * Every `.js` file under a directory, recursively.
 * @param {string} dir
 * @param {string[]} [out]
 * @returns {string[]} absolute paths
 */
function jsFilesUnder(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) { jsFilesUnder(abs, out); continue; }
    if (abs.endsWith('.js')) out.push(abs);
  }
  return out;
}

/** The parse this module reads every source with. `loc` is what makes a citation openable. */
const ESPREE_OPTIONS = Object.freeze({ ecmaVersion: 2024, sourceType: 'module', loc: true });

/**
 * ⭐ WHAT A FILE WRITES AND WHAT IT MENTIONS, READ FROM THE SYNTAX TREE (the MEASURE fold's
 * cures 8 and 27, SITTING §P.2-27).
 *
 * ⛔ WHY A LINE REGEX WAS NOT ENOUGH, TWICE OVER, AND BOTH ARE MEASURED FAILURES.
 *   (a) `/([A-Za-z_$][\w$]*)\s*:/` cannot see an ES6 SHORTHAND property, so three real writes
 *       — `blackMarketCapture,` `blockadeBypass,` `prominentRelationship,` — were invisible
 *       and six `not-produced` cells carried a wrong verdict. The estate already spelled the
 *       cure for one of them by hand (`fieldManifest.js:373`, `producerProbe`).
 *   (b) The same regex reads a token inside a PROSE STRING, a TEMPLATE STRING or a COMMENT as
 *       a write, and reads an arrow's PARAMETER as a mention of a root. Five of the nine
 *       `generator-write` alias citations rested on exactly those four shapes.
 * A syntax tree answers both: a Property key and a member assignment target are writes and
 * nothing else is; an Identifier in code position is a mention, and a parameter BINDING is
 * not (a function naming its own argument `name` is not naming the desk's `name` root).
 *
 * FAIL-CLOSED ON A PARSE FAILURE: the file contributes nothing and is NAMED, because a
 * silent fallback to the regex would put the shape this function exists to refuse back in.
 * @param {string} source
 * @returns {{writes: Array<{name: string, line: number}>,
 *   mentions: Array<{name: string, line: number}>, parsed: boolean}}
 */
export function astTokens(source) {
  /** @type {Array<{name: string, line: number}>} */
  const writes = [];
  /** @type {Array<{name: string, line: number}>} */
  const mentions = [];
  /** @type {object} */
  let root;
  try { root = parse(String(source), ESPREE_OPTIONS); } catch { return { writes, mentions, parsed: false }; }
  /** @param {object|null} node @returns {string} */
  const nameOf = (node) => {
    if (!node) return '';
    if (node.type === 'Identifier') return node.name;
    return node.type === 'Literal' && typeof node.value === 'string' ? node.value : '';
  };
  /** @param {unknown} node */
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { for (const child of node) walk(child); return; }
    const row = /** @type {Record<string, any>} */ (node);
    if (typeof row.type !== 'string') return;
    if (row.type === 'Property' && !row.computed && row.key && row.key.loc) {
      const name = nameOf(row.key);
      if (name) writes.push({ name, line: row.key.loc.start.line });
    }
    if (row.type === 'AssignmentExpression' && row.left && row.left.type === 'MemberExpression'
      && !row.left.computed && row.left.property && row.left.property.loc) {
      const name = nameOf(row.left.property);
      if (name) writes.push({ name, line: row.left.property.loc.start.line });
    }
    if (row.type === 'Identifier' && row.loc) mentions.push({ name: row.name, line: row.loc.start.line });
    const isFunction = row.type === 'FunctionDeclaration' || row.type === 'FunctionExpression'
      || row.type === 'ArrowFunctionExpression';
    for (const key of Object.keys(row)) {
      if (key === 'loc' || key === 'range' || key === 'parent') continue;
      if (isFunction && key === 'params') continue;
      walk(row[key]);
    }
  };
  walk(root);
  return { writes, mentions, parsed: true };
}

/**
 * THE PRODUCER INDEX — every leaf key some writer in the estate WRITES, as an object
 * literal key (SHORTHAND INCLUDED) or as an assignment target, over `src/generators/**` and
 * `src/domain/**`. It is the ground of the `absent` column's `not-produced` limb: a read of
 * a key no writer produces cannot throw, it degrades to a default, and the arm behind it is
 * dead on every generated world (the observed-shape register's own sentence).
 * @returns {{produced: Set<string>, files: number, unparsed: string[]}}
 */
export function producerIndex() {
  const { cites, files, unparsed } = producerCitations();
  return { produced: new Set(cites.keys()), files, unparsed };
}

/**
 * ⭐ THE PRODUCER INDEX, KEPT WITH ITS CITATIONS (SEAM car 5b). `producerIndex` answers WHICH
 * keys the estate writes; the holder table's every mapping row claims WHERE one of them is
 * written, as a `file:line` a reader can open. This is the same walk with the line kept, so the
 * walker can re-derive every citation from the tree rather than believe the table: a row whose
 * `cite` has gone stale, or never existed, reds by name.
 *
 * ⛔ IT IS THE SAME SCAN AND NOT A SECOND ONE. Two walks over `src/generators/**` and
 * `src/domain/**` that could disagree would be two producer indexes, and the estate's rule is
 * one reader per fact: `producerIndex` is written in terms of this function so a divergence is
 * impossible rather than merely unlikely.
 * @returns {{cites: Map<string, string[]>, files: number, unparsed: string[]}}
 */
export function producerCitations() {
  /** @type {Map<string, string[]>} */
  const cites = new Map();
  /** @type {string[]} */
  const unparsed = [];
  const files = [
    ...jsFilesUnder(join(ROOT, 'src/generators')),
    ...jsFilesUnder(join(ROOT, 'src/domain')),
  ];
  for (const abs of files) {
    const rel = relative(ROOT, abs);
    const { writes, parsed } = astTokens(readFileSync(abs, 'utf8'));
    if (!parsed) { unparsed.push(rel); continue; }
    for (const write of writes) {
      const held = cites.get(write.name);
      if (held) held.push(`${rel}:${write.line}`);
      else cites.set(write.name, [`${rel}:${write.line}`]);
    }
  }
  return { cites, files: files.length, unparsed };
}

// ═══════════════════════════════════════════════════════════════════════════════════
// THE RELATION TABLE (ARCH §5.2) — FOUR SOURCES, DIRECTION ON EVERY ROW
//
// A connective is chosen by the typed provenance EDGE and never by the music, so a
// `consequence` or a `tension` joint needs a table row whose endpoints include the spine's
// PRIMARY field, READ IN ITS DIRECTION. Car 0 PRINTS the row count before any car authors
// a joint, because a table that turns out to be empty between the fields a desk reads is
// the risk §11 carries and the arithmetic of §6 rests on.
//
//   (a) condition archetype -> system variable, through `canonicalAffectedSystems`
//   (b) the CAUSE_SIGNAL rows: the score or condition a cause class READS is the cause and
//       the class is its reading, so the direction is source -> class
//   (c) the generator's recorded derivations: a persisted gate or score whose initialiser
//       reads another field
//   (d) the sitting's ratified axis pairs and `interesting_tension` types — EMPTY today,
//       and asserted empty rather than left unmentioned
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {object} RelationRow
 * @property {string} a the endpoint the edge runs FROM
 * @property {string} b the endpoint the edge runs TO
 * @property {'consequence'|'tension'} relation
 * @property {'a'|'b'|'c'|'d'} source
 * @property {'a->b'|'b->a'} direction
 * @property {string} via how the edge was recovered
 */

/**
 * Source (a): 46 condition archetypes to their canonical system variables.
 * @returns {RelationRow[]}
 */
export function relationsFromArchetypes() {
  /** @type {RelationRow[]} */
  const out = [];
  for (const [archetype, template] of Object.entries(CONDITION_ARCHETYPE_TEMPLATES)) {
    for (const system of canonicalAffectedSystems(template.affectedSystems || [])) {
      out.push({
        a: `condition:${archetype}`,
        b: `system:${system}`,
        relation: 'consequence',
        source: 'a',
        direction: 'a->b',
        via: 'CONDITION_ARCHETYPE_TEMPLATES.affectedSystems via canonicalAffectedSystems',
      });
    }
  }
  return out;
}

/**
 * Source (b): the resolution-predicate table, read out of each class's own function source.
 * @returns {RelationRow[]}
 */
export function relationsFromCauseSignal() {
  /** @type {RelationRow[]} */
  const out = [];
  for (const [cls, fn] of Object.entries(CAUSE_SIGNAL)) {
    const body = String(fn);
    /** @type {Set<string>} */
    const endpoints = new Set();
    for (const m of body.matchAll(/ctx\.scores\.([A-Za-z_$][\w$]*)/g)) endpoints.add(`system:${m[1]}`);
    for (const m of body.matchAll(/ctx\.conditions\.has\('([^']+)'\)/g)) endpoints.add(`condition:${m[1]}`);
    for (const m of body.matchAll(/ctx\.([A-Za-z_$][\w$]*)/g)) {
      if (m[1] === 'scores' || m[1] === 'conditions') continue;
      endpoints.add(`signal:${m[1]}`);
    }
    for (const endpoint of [...endpoints].sort()) {
      out.push({
        a: endpoint,
        b: `cause:${cls}`,
        relation: 'consequence',
        source: 'b',
        direction: 'a->b',
        via: 'CAUSE_SIGNAL predicate source',
      });
    }
  }
  return out;
}

/**
 * THE DECLARED SHAPE source (c) reads, stated so a reader can check what it counted rather
 * than trusting the number: a persisted GATE or SCORE object literal (`economicGates: {…}`
 * / `scores: {…}`) in a generator, plus a reassignment of one of its keys in the same file.
 * Each initialiser's identifiers are resolved through the file's own `const` aliases for at
 * most TWO hops, and the identifier reached is the source endpoint.
 */
const DERIVED_CONTAINERS = Object.freeze(['economicGates', 'scores']);

/** Identifiers a derivation never runs from. */
const NOT_A_FIELD = new Set([
  'Math', 'Number', 'Object', 'Array', 'String', 'Boolean', 'JSON', 'min', 'max', 'round',
  'true', 'false', 'null', 'undefined', 'const', 'let', 'return', 'if', 'else', 'new',
  'typeof', 'length', 'floor', 'ceil', 'abs', 'isFinite', 'map', 'filter', 'reduce',
]);

/**
 * @param {string} expr
 * @returns {string[]} the identifiers an expression reads
 */
function identifiersIn(expr) {
  return [...new Set([...String(expr).matchAll(/\b([A-Za-z_$][\w$]*)\b/g)].map((m) => m[1]))]
    .filter((id) => !NOT_A_FIELD.has(id));
}

/**
 * Source (c): the generator's own recorded derivations. The estate's canonical instance is
 * `milUpkeepMult = min(1, 0.6 + econOutput/50 * 0.4)` degrading `scores.military` and
 * persisted as `economicGates.military` (`defenseGenerator.js :: computeDefenseScores` — the `milUpkeepMult` derivation and the `economicGates` block it feeds).
 * @returns {RelationRow[]}
 */
export function relationsFromGenerators() {
  /** @type {RelationRow[]} */
  const out = [];
  for (const abs of jsFilesUnder(join(ROOT, 'src/generators'))) {
    const src = readFileSync(abs, 'utf8');
    const file = relative(ROOT, abs);
    /** @type {Map<string, string>} */
    const aliases = new Map();
    for (const m of src.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)/g)) aliases.set(m[1], m[2]);
    /** @param {string} expr @param {number} depth @returns {string[]} */
    const resolve = (expr, depth) => {
      const ids = identifiersIn(expr);
      if (depth === 0) return ids;
      return [...new Set(ids.flatMap((id) => (aliases.has(id) ? resolve(aliases.get(id) || '', depth - 1) : [id])))];
    };
    for (const container of DERIVED_CONTAINERS) {
      for (const m of src.matchAll(new RegExp(`\\b${container}\\s*:\\s*\\{([^{}]*(?:\\{[^{}]*\\}[^{}]*)*)\\}`, 'g'))) {
        for (const entry of m[1].matchAll(/([A-Za-z_$][\w$]*)\s*:\s*([^,\n]+)/g)) {
          for (const id of resolve(entry[2], 2)) {
            if (id === entry[1]) continue;
            out.push({
              a: `${file}::${id}`,
              b: `${container}.${entry[1]}`,
              relation: 'consequence',
              source: 'c',
              direction: 'a->b',
              via: `${file} ${container} literal, two alias hops`,
            });
          }
        }
      }
    }
  }
  return out;
}

/**
 * Source (d) — the sitting's. A ratified axis pair or an `interesting_tension` type becomes
 * a row through the STANDING RATIFICATION DOOR (ARCH §5.2, E-F14b). No sitting has ratified
 * one, so the source is EMPTY, and it is returned empty rather than omitted so the walker
 * can assert the emptiness instead of a reader inferring it from a missing key.
 * @returns {RelationRow[]}
 */
export function relationsFromSitting() {
  return [];
}

/**
 * The whole relation table, with its row counts by source and by direction.
 * @returns {{rows: RelationRow[], bySource: Array<[string, number]>,
 *   byDirection: Array<[string, number]>}}
 */
export function relationTable() {
  const rows = [
    ...relationsFromArchetypes(),
    ...relationsFromCauseSignal(),
    ...relationsFromGenerators(),
    ...relationsFromSitting(),
  ];
  /** @type {Map<string, number>} */
  const bySource = new Map();
  /** @type {Map<string, number>} */
  const byDirection = new Map();
  for (const row of rows) {
    bySource.set(row.source, (bySource.get(row.source) || 0) + 1);
    byDirection.set(row.direction, (byDirection.get(row.direction) || 0) + 1);
  }
  return {
    rows,
    bySource: [...bySource].sort(),
    byDirection: [...byDirection].sort(),
  };
}

/**
 * MOUNTS PER FACT — spine and modifier (ARCH §3.2, §6.6, T-F10), keyed on the PRODUCER
 * TOKEN (`rootOf`) so the two halves speak one vocabulary. The echo bound the owner vetoes
 * is stated over this table: one producer fact backs a modifier at at most ONE mount per
 * page-set, and at NO mount on a tab where that fact is already a spine.
 *
 * ⭐ THE MODIFIER HALF IS THE TAB'S QUESTION, NOT THE BLOCK'S, and getting that wrong
 * answers zero on every row. A fact read by one of a block's own spines SPINES on that
 * block's tab by construction, so the echo bound excludes it there and a within-block
 * derivation can only ever report nothing. §6.6's own sentence is the right one: the
 * modifier-eligible facts of a tab are the facts THE TAB'S DESKS READ that do not spine on
 * that tab — the key-only facts of car 5's census, which is exactly where `purse: short`
 * comes from in ARCH §6.5 (`economicGates.military` spines on defense and is free to
 * modify on overview).
 *
 * ⛔ NOT-EXECUTABLE WITHOUT `deskFacts`. With no held-fact census the modifier column is
 * `null`, never 0: a comparison against nothing answers "no modifier can attach anywhere",
 * which reads as a finding and is a blindness.
 * @param {ReadonlyArray<object>} rows the decorated census rows
 * @param {ReadonlyArray<{mount: string, tab: string, desk: string, blockId: string}>} mounts
 * @param {Map<string, ReadonlyArray<string>>} [deskFacts] desk name to the facts it HOLDS
 * @returns {{rows: Array<{field: string, mountsSpine: number, mountsModifier: number|null,
 *   spineTabs: string[], modifierMounts: string[]}>, byTab: Array<[string, number]>,
 *   notExecutable: string[]}}
 */
export function factMounts(rows, mounts, deskFacts) {
  /** @type {Map<string, Array<{mount: string, tab: string, desk: string}>>} */
  const byBlock = new Map();
  for (const m of mounts) {
    const seat = byBlock.get(m.blockId);
    if (seat) seat.push(m); else byBlock.set(m.blockId, [m]);
  }
  /** @type {Map<string, Set<string>>} tab to the facts that SPINE on it */
  const spineFactsByTab = new Map();
  /** @type {Map<string, {spine: Set<string>, tabs: Set<string>, modifier: Set<string>}>} */
  const index = new Map();
  const seatOf = (field) => {
    let seat = index.get(field);
    if (!seat) { seat = { spine: new Set(), tabs: new Set(), modifier: new Set() }; index.set(field, seat); }
    return seat;
  };
  /** @type {Map<string, number>} tab to how many RESOLVED spines it carries */
  const spinesByTab = new Map();
  for (const row of rows) {
    if (row.status !== WIRING_STATUS.RESOLVED) continue;
    for (const m of byBlock.get(row.block) || []) {
      spinesByTab.set(m.tab, (spinesByTab.get(m.tab) || 0) + 1);
      let tabSeat = spineFactsByTab.get(m.tab);
      if (!tabSeat) { tabSeat = new Set(); spineFactsByTab.set(m.tab, tabSeat); }
      for (const path of row.reads || row.fieldsRead || []) {
        const field = rootOf(path);
        seatOf(field).spine.add(m.mount);
        seatOf(field).tabs.add(m.tab);
        tabSeat.add(field);
      }
    }
  }
  if (!(deskFacts instanceof Map)) {
    return {
      rows: [...index].map(([field, seat]) => ({
        field, mountsSpine: seat.spine.size, mountsModifier: null, spineTabs: [...seat.tabs].sort(), modifierMounts: [],
      })).sort((a, b) => (a.field < b.field ? -1 : 1)),
      byTab: [],
      notExecutable: ['no desk-fact census supplied: the modifier half of mounts-per-fact is NOT-EXECUTABLE'],
    };
  }
  /** @type {Map<string, Set<string>>} tab to every fact its desks hold */
  const tabFacts = new Map();
  for (const m of mounts) {
    let seat = tabFacts.get(m.tab);
    if (!seat) { seat = new Set(); tabFacts.set(m.tab, seat); }
    for (const fact of deskFacts.get(m.desk) || []) seat.add(fact);
  }
  /** @type {Array<[string, number]>} */
  const byTab = [];
  for (const [tab, facts] of tabFacts) {
    const spineFacts = spineFactsByTab.get(tab) || new Set();
    const eligible = [...facts].filter((f) => !spineFacts.has(f));
    byTab.push([tab, eligible.length]);
    if ((spinesByTab.get(tab) || 0) === 0) continue;
    for (const field of eligible) {
      for (const m of mounts.filter((x) => x.tab === tab)) seatOf(field).modifier.add(m.mount);
    }
  }
  return {
    rows: [...index].map(([field, seat]) => ({
      field,
      mountsSpine: seat.spine.size,
      mountsModifier: seat.modifier.size,
      spineTabs: [...seat.tabs].sort(),
      modifierMounts: [...seat.modifier].sort(),
    })).sort((a, b) => (a.field < b.field ? -1 : 1)),
    byTab: byTab.sort((a, b) => b[1] - a[1]),
    notExecutable: [],
  };
}

/**
 * ⭐ THE JOIN BETWEEN THE RELATION TABLE AND THE DESKS, MEASURED BOTH WAYS — and this is
 * car 0's sharpest finding, so it is printed as two integers rather than one.
 *
 * A `consequence` or a `tension` joint is licensed ONLY by a table row whose endpoints
 * include the spine's PRIMARY field (ARCH §4.5, E-F14b). The two vocabularies are:
 *
 *   the TABLE names PRODUCER tokens — `condition:<archetype>`, `system:<variable>`,
 *     `cause:<class>`, `economicGates.<gate>`, `scores.<score>`
 *   the CENSUS names CALLER paths and bare key-function parameters — `readings.x`,
 *     `settlement.x`, and unrooted locals like `gate`, `forces`, `granary`
 *
 * STRICT is the join a projector could perform today: `rootOf(endpoint)` present in the
 * desks' read roots. LEAF is the join available after a normalisation nobody has built:
 * the endpoint's final token present as a segment of some read path. The gap between the
 * two is the wiring debt the joint sits behind, and it is a NUMBER rather than a worry.
 * @param {ReadonlyArray<RelationRow>} rows
 * @param {ReadonlyArray<object>} censusRows
 * @returns {{strictBoth: number, strictEither: number, leafBoth: number, leafEither: number,
 *   leafRows: RelationRow[], deskRoots: number, deskSegments: number}}
 */
export function relationJoin(rows, censusRows) {
  /** @type {Set<string>} */
  const roots = new Set();
  /** @type {Set<string>} */
  const segments = new Set();
  for (const row of censusRows) {
    for (const path of row.reads || row.fieldsRead || []) {
      roots.add(rootOf(path));
      for (const segment of String(path).split(/[^A-Za-z_$]+/)) if (segment) segments.add(segment);
    }
  }
  /** @param {string} endpoint @returns {string} */
  const leafOf = (endpoint) => {
    const bare = String(endpoint).replace(/^[a-z]+:/, '').split('::').pop() || '';
    return bare.split('.').filter(Boolean).pop() || bare;
  };
  const strict = (endpoint) => roots.has(rootOf(endpoint));
  const leaf = (endpoint) => segments.has(leafOf(endpoint));
  const leafRows = rows.filter((r) => leaf(r.a) && leaf(r.b));
  return {
    strictBoth: rows.filter((r) => strict(r.a) && strict(r.b)).length,
    strictEither: rows.filter((r) => strict(r.a) || strict(r.b)).length,
    leafBoth: leafRows.length,
    leafEither: rows.filter((r) => leaf(r.a) || leaf(r.b)).length,
    leafRows,
    deskRoots: roots.size,
    deskSegments: segments.size,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════════
// THE ALIAS DRAFT (ARCH car 0f, SITTING §O.2) — MEASURED, AND NOTHING RATIFIED
//
// Car 0's F1: over 89 relation endpoints and the desks' read roots the STRICT join is 0
// rows, the either-endpoint join is 0, and even a leaf-level normalisation reaches 0 on
// both endpoints. The chair chartered this car to MEASURE what a normalisation would buy:
// a candidate ALIAS between a PRODUCER TOKEN and a DESK READ ROOT, each row carrying the
// EVIDENCE that proposes it and a `file:line` a reader can open.
//
// ⛔ NOTHING HERE IS RATIFIED AND NOTHING IS WRITTEN INTO ANY LEAF. §O.2: "the aliases are
// a sitting act (car 7's standing door), then the join lands as a frozen data leaf in the
// SEAM train". This mode prints a draft and exits. It writes no file, it is not folded into
// `docs/content/wiring-census.json`, and `relationJoin` above still answers 0.
//
// THE FOUR EVIDENCE KINDS, IN THE ORDER A ROW TAKES THE STRONGEST IT HAS:
//   identifier       the endpoint's leaf and the root's leaf are ONE identifier under a
//                    case- and underscore-insensitive reading (`food_security` ~ foodSecurity)
//   reading-builder  a desk-read line that fills the ROOT as a bag key and names the leaf
//   generator-write  a generator writes the leaf as a key or an assignment, in a file that
//                    also writes the root: the persisted shape behind both names
//   docblock         one comment line names both tokens
// A candidate is a PROPOSAL with a citation, never a join. The receipt prints the rows, the
// counts, and the endpoints with NO candidate, which are the wiring debt the SEAM and WAVE
// trains inherit.
// ═══════════════════════════════════════════════════════════════════════════════════

/** The evidence kinds a candidate may carry, STRONGEST FIRST. */
export const EVIDENCE_ORDER = Object.freeze(['identifier', 'reading-builder', 'generator-write', 'docblock']);

/** @param {string} token @returns {string} the case- and separator-insensitive reading */
export const aliasKey = (token) => String(token).toLowerCase().replace(/[^a-z0-9]/g, '');

/** @param {string} endpoint @returns {string} the endpoint's own leaf token */
export const endpointLeaf = (endpoint) => {
  const bare = String(endpoint).replace(/^[a-z]+:/, '').split('::').pop() || '';
  return bare.split('.').filter(Boolean).pop() || bare;
};

/**
 * Index a file set by the identifier tokens each LINE names AND by the tokens it WRITES (an
 * object key or an assignment target), so a pair test is two Map lookups rather than a scan
 * per pair.
 *
 * ⛔ THE TWO INDEXES ARE NOT ONE, AND THE DIFFERENCE IS THE WHOLE STRENGTH OF THE EVIDENCE.
 * A first cut proposed an alias whenever two tokens shared a generator line, which produced
 * `condition:famine -> war` from one line of `economy/foodBalance.js` and 51 rows of that
 * shape. An alias worth a sitting is "the generator WRITES the endpoint's field, on a line
 * that names the root" — a write and a mention, never two mentions.
 * @param {Map<string, string>} sources file to text
 * @param {(line: string) => boolean} keep which lines count
 * @returns {{byToken: Map<string, Set<string>>, byWrite: Map<string, Set<string>>, at: Map<string, string>}}
 */
export function lineIndex(sources, keep) {
  /** @type {Map<string, Set<string>>} */
  const byToken = new Map();
  /** @type {Map<string, Set<string>>} */
  const byWrite = new Map();
  /** @type {Map<string, string>} */
  const at = new Map();
  /** @param {Map<string, Set<string>>} index @param {string} token @param {string} id */
  const add = (index, token, id) => {
    const key = aliasKey(token);
    if (!key) return;
    let seat = index.get(key);
    if (!seat) { seat = new Set(); index.set(key, seat); }
    seat.add(id);
  };
  for (const [file, text] of sources) {
    const lines = String(text).split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (!keep(lines[i])) continue;
      const id = `${file}:${i + 1}`;
      at.set(id, lines[i].trim());
      for (const m of lines[i].matchAll(/\b([A-Za-z_$][\w$]*)\b/g)) add(byToken, m[1], id);
      for (const m of lines[i].matchAll(/(?:^|[{,([\s])([A-Za-z_$][\w$]*)\s*:/g)) add(byWrite, m[1], id);
      for (const m of lines[i].matchAll(/\.\s*([A-Za-z_$][\w$]*)\s*=[^=]/g)) add(byWrite, m[1], id);
    }
  }
  return { byToken, byWrite, at };
}

/**
 * ⭐ THE SAME INDEX, READ FROM THE SYNTAX TREE — `generator-write`'s ground after SITTING
 * §P.2-27 ("re-cut to a real assignment or key write read from an AST, never a line regex").
 * `byWrite` carries only Property keys and member assignment targets; `byToken` carries only
 * Identifiers in CODE position, so a comment, a prose string, a template string and an
 * arrow's parameter — the four shapes the fold refuted — can propose nothing.
 * @param {Map<string, string>} sources file to text
 * @returns {{byToken: Map<string, Set<string>>, byWrite: Map<string, Set<string>>,
 *   at: Map<string, string>, unparsed: string[]}}
 */
export function astLineIndex(sources) {
  /** @type {Map<string, Set<string>>} */
  const byToken = new Map();
  /** @type {Map<string, Set<string>>} */
  const byWrite = new Map();
  /** @type {Map<string, string>} */
  const at = new Map();
  /** @type {string[]} */
  const unparsed = [];
  /** @param {Map<string, Set<string>>} index @param {string} token @param {string} id */
  const add = (index, token, id) => {
    const key = aliasKey(token);
    if (!key) return;
    let seat = index.get(key);
    if (!seat) { seat = new Set(); index.set(key, seat); }
    seat.add(id);
  };
  for (const [file, text] of sources) {
    const { writes, mentions, parsed } = astTokens(text);
    if (!parsed) { unparsed.push(file); continue; }
    const lines = String(text).split('\n');
    /** @param {Map<string, Set<string>>} index @param {{name: string, line: number}} row */
    const record = (index, row) => {
      const id = `${file}:${row.line}`;
      at.set(id, String(lines[row.line - 1] || '').trim());
      add(index, row.name, id);
    };
    for (const write of writes) record(byWrite, write);
    for (const mention of mentions) record(byToken, mention);
  }
  return {
    byToken, byWrite, at, unparsed,
  };
}

/**
 * A COMMENT LINE THAT NAMES BOTH TOKENS — the weakest evidence, and the only one where a
 * mention on each side is all there is to have.
 * @param {{byToken: Map<string, Set<string>>}} index
 * @param {string} a
 * @param {string} b
 * @returns {string}
 */
function sharedMention(index, a, b) {
  const left = index.byToken.get(a);
  const right = index.byToken.get(b);
  if (!left || !right) return '';
  for (const id of left) if (right.has(id)) return id;
  return '';
}

/**
 * THE DRAFT. Pure: every source arrives as a string, so the walker drives it on a fixture.
 * @param {{endpoints: ReadonlyArray<string>, roots: ReadonlyArray<string>,
 *   paths?: ReadonlyArray<string>, builders?: Map<string, string>,
 *   generators?: Map<string, string>, docs?: Map<string, string>}} input
 * ⛔ THE `docblock` KIND IS WITHDRAWN FROM `rows` AND SURVIVES AS A REPORT CHANNEL ONLY
 * (SITTING §P.2-27 EXTENDED, the chair's ruling at SEAM car 3h §3h.6 item 2). §P.2-27 re-cut
 * `generator-write` as an AST reading because a comment, a prose string, a template string and
 * an arrow parameter are not evidence; the `docblock` kind is comments BY DEFINITION and cannot
 * be re-cut the same way. It minted `economicGates.disaster <- row` out of two English words
 * sharing one comment line, and the note written to record that artefact re-minted the same
 * row. So a docblock candidate is REPORTED and never proposed: `rows` carries the three
 * evidence kinds a syntax tree can stand behind, and a car that writes a composer comment can
 * no longer move a declared figure.
 * @returns {{rows: Array<{endpoint: string, readRoot: string, evidence: string, at: string,
 *   line: string}>, docblockReports: Array<{endpoint: string, readRoot: string, at: string,
 *   line: string}>, endpointsWithCandidate: number, noCandidate: string[],
 *   syntheticRootsExcluded: number}}
 */
export function aliasDraft(input) {
  const endpoints = [...new Set(input.endpoints || [])].sort();
  const allRoots = [...new Set(input.roots || [])].sort();
  // THE INSTRUMENT'S OWN LABELS ARE NOT JOIN TARGETS (the car-10 cure-4 law, applied here):
  // the table rung writes `"<reader> (via <TABLE> in <file>)"` as its field, and an alias to
  // one of those would be an alias to a string this census invented.
  const roots = allRoots.filter((r) => !r.includes(' (via '));
  const builders = lineIndex(input.builders || new Map(), (line) => !/^\s*(\*|\/\/)/.test(line));
  // ⛔ THE GENERATOR INDEX IS AN AST READING AND THE OTHER TWO ARE NOT, DELIBERATELY. §P.2-27
  // re-cut `generator-write` and nothing else: `docblock` evidence IS a comment line by
  // definition, and `reading-builder` reads the two desk-read modules, whose bag-key writes a
  // line reader gets right. The kind the fold refuted is the kind that moved.
  const generators = astLineIndex(input.generators || new Map());
  const docs = lineIndex(input.docs || new Map(), (line) => /^\s*(\*|\/\/)/.test(line));
  // ONE ROW PER (endpoint, root) PAIR, CARRYING THE STRONGEST EVIDENCE IT HAS. A pair proposed
  // three times over is one proposal, and a table that printed it three times would read as
  // three times the ground.
  /** @type {Map<string, {endpoint: string, readRoot: string, evidence: string, at: string, line: string}>} */
  const best = new Map();
  /** @type {Map<string, {endpoint: string, readRoot: string, at: string, line: string}>} */
  const reported = new Map();
  /** @param {{endpoint: string, readRoot: string, evidence: string, at: string, line: string}} row */
  const offer = (row) => {
    const key = `${row.endpoint}|${row.readRoot}`;
    const held = best.get(key);
    if (held && EVIDENCE_ORDER.indexOf(held.evidence) <= EVIDENCE_ORDER.indexOf(row.evidence)) return;
    best.set(key, row);
  };
  // ⭐ THE SEGMENT GRAIN, WHICH IS WHERE THE IDENTIFIER EVIDENCE ACTUALLY LIVES. `rootOf` cuts
  // a read path to `eco` or `settlement.config`, and no producer token is ever spelled that
  // way; the token IS spelled in the middle of the path (`eco.foodSecurity.label` against
  // `system:food_security`). Car 0's LEAF join missed exactly these because it compared raw
  // segments with no case or underscore reading, which is the normalisation §O.2 says nobody
  // has built. Every identifier row carries the READ PATH that proposed it as its citation.
  for (const path of input.paths || []) {
    if (String(path).includes(' (via ')) continue;
    const segments = new Set(String(path).split(/[^A-Za-z_$0-9]+/).filter(Boolean).map(aliasKey));
    for (const endpoint of endpoints) {
      const leaf = aliasKey(endpointLeaf(endpoint));
      if (!leaf || !segments.has(leaf)) continue;
      offer({
        endpoint, readRoot: rootOf(path), evidence: 'identifier', at: path, line: path,
      });
    }
  }
  for (const endpoint of endpoints) {
    const leaf = aliasKey(endpointLeaf(endpoint));
    for (const root of roots) {
      const rootLeaf = aliasKey(String(root).split('.').pop() || root);
      if (!leaf || !rootLeaf) continue;
      /**
       * A line that WRITES `written` and NAMES `named`. The direction is the evidence.
       * @param {{byToken: Map<string, Set<string>>, byWrite: Map<string, Set<string>>}} index
       * @param {string} written @param {string} named
       */
      const shared = (index, written, named) => {
        const a = index.byWrite.get(written);
        const b = index.byToken.get(named);
        if (!a || !b) return '';
        for (const id of a) if (b.has(id)) return id;
        return '';
      };
      // A READING BUILDER fills the ROOT and names the endpoint's leaf; a GENERATOR writes the
      // endpoint's FIELD on a line that names the root. The two directions are opposite on
      // purpose, and each is the direction its own sentence in §O.2 states.
      const builderAt = shared(builders, rootLeaf, leaf);
      const generatorAt = builderAt ? '' : shared(generators, leaf, rootLeaf);
      const docAt = builderAt || generatorAt ? '' : sharedMention(docs, leaf, rootLeaf);
      const at = builderAt || generatorAt || docAt;
      if (!at) continue;
      const index = builderAt ? builders : (generatorAt ? generators : docs);
      const line = index.at.get(at) || '';
      if (docAt) {
        // THE REPORT CHANNEL, never a candidate: a comment line is not evidence.
        reported.set(`${endpoint}|${root}`, {
          endpoint, readRoot: root, at, line,
        });
        continue;
      }
      offer({
        endpoint,
        readRoot: root,
        evidence: builderAt ? 'reading-builder' : 'generator-write',
        at,
        line,
      });
    }
  }
  const rows = [...best.values()].sort((a, b) => EVIDENCE_ORDER.indexOf(a.evidence) - EVIDENCE_ORDER.indexOf(b.evidence)
    || (a.endpoint < b.endpoint ? -1 : 1) || (a.readRoot < b.readRoot ? -1 : 1));
  const covered = new Set(rows.map((r) => r.endpoint));
  return {
    rows,
    docblockReports: [...reported.values()]
      .sort((a, b) => (a.endpoint < b.endpoint ? -1 : 1) || (a.readRoot < b.readRoot ? -1 : 1)),
    endpointsWithCandidate: covered.size,
    noCandidate: endpoints.filter((e) => !covered.has(e)),
    syntheticRootsExcluded: allRoots.length - roots.length,
  };
}

/**
 * THE WILSON 95 % INTERVAL, IN BASIS POINTS. ARCH E-F4: a cell earns hand-written text only
 * when the LOWER bound of its rate clears 5 %, because at 27 of 525 a cell truly at 5 %
 * clears a naive floor 48 % of the time and a coin flip cannot gate a permanent authoring
 * act. Returned as integers: this estate's prose-numerics register counts a `toFixed` and a
 * float interpolation, and a statistic that formats has decided a presentation for a reader
 * it cannot see.
 * @param {number} k successes
 * @param {number} n trials
 * @returns {{loBp: number, hiBp: number, rateBp: number}}
 */
export function wilsonBp(k, n) {
  if (!n) return { loBp: 0, hiBp: 0, rateBp: 0 };
  const z = 1.959963984540054;
  const p = k / n;
  const denominator = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / denominator;
  const spread = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denominator;
  return {
    loBp: Math.round(Math.max(0, centre - spread) * 10000),
    hiBp: Math.round(Math.min(1, centre + spread) * 10000),
    rateBp: Math.round(p * 10000),
  };
}

/**
 * The smallest count whose Wilson lower bound clears `floorBp` at sample size `n`.
 * @param {number} n
 * @param {number} floorBp
 * @returns {number}
 */
export function wilsonFloorCount(n, floorBp) {
  for (let k = 0; k <= n; k++) if (wilsonBp(k, n).loBp >= floorBp) return k;
  return n + 1;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// THE CENSUS ITSELF
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * THE TWO GRAINS, SIDE BY SIDE (SITTING §O.1). The ruling re-cut `reads` from the KEY
 * FUNCTION's whole reading set to the SELECTING BRANCH's own fields, and asked for the cost
 * to be measured rather than argued. So every figure that is a function of `reads` is
 * computed TWICE — once on the shipped rows, once on a shadow copy whose `reads` is the
 * function-wide `fieldsRead` — and both ship in the JSON. The shadow is a copy: no row of
 * the census is mutated to take the second reading.
 * @param {ReadonlyArray<object>} rows
 * @param {ReadonlyArray<object>} mounts
 * @param {Map<string, ReadonlyArray<string>>} deskFacts
 * @returns {object}
 */
export function grainFigures(rows, mounts, deskFacts) {
  const budget = factBudget(rows);
  const attach = attachSets(rows);
  return {
    zeroK: budget.zeroK,
    executable: budget.executable,
    notExecutable: budget.notExecutable,
    histogram: budget.histogram,
    blocksWithSpine: attach.length,
    cannotAttach: attach.filter((a) => a.spinesReachedBp === 0).map((a) => a.block).sort(),
    readPaths: rows.reduce((total, r) => total + (r.reads || []).length, 0),
    modifierEligibleFactsByTab: factMounts(rows, mounts, deskFacts).byTab,
  };
}

/**
 * Build the whole census, decorated, with every ARCH car-0 derivation beside it.
 * @param {{rates?: {rows: Array<{block: string, pool: string, rateBp: number,
 *   byTier: Record<string, number>}>, corpus: object}|null}} [options]
 * @returns {Promise<object>}
 */
export async function buildCensus(options = {}) {
  const leaves = await loadStateLeaves();
  /** @type {Map<string, Map<string, Array<{text: string, slots: string[]}>>>} */
  const pools = new Map();
  for (const e of leaves) {
    if (!pools.has(e.block)) pools.set(e.block, new Map());
    const block = pools.get(e.block);
    if (!block.has(e.pool)) block.set(e.pool, []);
    block.get(e.pool).push({ text: e.text, slots: e.slots });
  }
  const sites = fillSites();
  const fill = new Map([...composedFillByBlock(sites)].map(([b, r]) => [b, r.slots]));
  const { produced, files: producerFiles } = producerIndex();
  const census = wiringCensus({
    sources: composerSources(),
    pools,
    fill,
    fillByKeyFunction: composedFillByKeyFunction(sites),
    unmounted: UNMOUNTED_BLOCKS,
    produced,
    mounts: DOSSIER_MOUNTS,
    // NO NARROWS LINE EXISTS AT THIS TIP. `reads === tests` on every one of the 708 rows;
    // the mechanism is proved by the walker's fixture rather than by a shipped row.
    narrows: new Map(),
    // ⭐ THE ANNEX'S OWN DECLARATION, FOR MODIFIER POOLS ONLY (TASTE car M-2). A modifier's
    // predicate lives in its desk's candidate leaf, so no rung of the ladder can recover its
    // reading; without this the row carries no `tests` and the projector refuses the pool's
    // own `READS:` line against an empty set. See CensusInput's `declared` note for why the
    // reading is AUTHOR-DECLARED, what says so on the row (`rung: 'annex'`), and where the
    // executable cross-check lives.
    declared: readAnnexDeclarations(readFileSync(STATE_ANNEX, 'utf8')),
  });
  const held = [...new Set(unrenderedFacts().flatMap((r) => r.held))];
  // ⭐⭐ EVERY CORPUS FIGURE BELOW IS COMPUTED OVER THE SPINE ROWS, AND THAT IS WHAT KEEPS
  // EVERY PINNED INTEGER OF THIS REGISTER MEANING WHAT IT WAS PINNED TO MEAN (TASTE car M-2).
  // A modifier row is a row of the census and is NOT a spine of its block: counting one as a
  // spine makes DS-DEF-11 read nine spines where it has five, and the attach coverage the
  // authoring wave is sized from would count a modifier as a site a modifier can attach to.
  // The modifier rows are carried in `rows` and counted on their own line (`totals.modifierRows`
  // and the `modifiers` section), so a reader adding the two gets `rows.length` exactly.
  const spines = spineRows(census.rows);
  const modifiers = modifierRows(census.rows);
  const summary = censusSummary(spines, held);
  const tiers = tierRows({ rows: spines, held });
  // ⭐ THE FOURTH TIER (SITTING §O.5). A per-tier silence the RATE corpus cannot explain by
  // the rung choosing another value class at that size is an AUTHORING WAVE row, and it
  // joins the tier table rather than living in a second list nobody reads. It arrives ONLY
  // with a rate half: with none, the table carries three tiers and says so by their absence
  // rather than by a zero that would read as "measured, and none found".
  for (const s of (options.rates?.tierSilences || [])) {
    if (s.verdict !== TIERS.MISSING_AT_TIER) continue;
    tiers.push({
      tier: TIERS.MISSING_AT_TIER,
      block: s.block,
      subject: `${s.pool} @ ${s.tier}`,
      fields: [],
      readingFunction: s.rung,
      count: `fired on ${s.firedOverall} towns overall and on 0 at ${s.tier}; its rung said nothing there`,
    });
  }
  const attach = attachSets(spines);
  const facts = unrenderedFacts();
  /** @type {Map<string, string[]>} the facts each DESK holds, keyed as the mount registry names it */
  const deskFacts = new Map(facts.map((r) => [r.file.replace(/^.*\/(\w+)StateProse\.js$/, '$1'), r.held]));
  const mountsPerFact = factMounts(spines, DOSSIER_MOUNTS, deskFacts);
  const budget = factBudget(spines);
  // THE SHADOW ROWS carry the FUNCTION-WIDE grain and nothing else differs, so the pair of
  // figure sets below differs by exactly the ruling and by nothing this script chose.
  const shadow = spines.map((row) => ({ ...row, reads: row.fieldsRead }));
  const grains = {
    branch: grainFigures(spines, DOSSIER_MOUNTS, deskFacts),
    function: grainFigures(shadow, DOSSIER_MOUNTS, deskFacts),
  };
  const custom = customReachable(spines, CUSTOM_CONTENT_MANIFEST.categories);
  const sources = sourceSummary(spines);
  const relations = relationTable();
  const rateRows = options.rates?.rows || [];
  const rateBy = new Map(rateRows.map((r) => [`${r.block} :: ${r.pool}`, r]));
  for (const row of census.rows) {
    const hit = rateBy.get(`${row.block} :: ${row.pool}`);
    row.rateBp = hit ? hit.rateBp : null;
  }
  // ⭐ THE RATIFIED ALIASES (SITTING §P.2-27), AND WHY EXACTLY THREE ROWS SHIP. The chair
  // ratified the draft's `identifier` rows — the same identifier on both sides, one of them
  // ARCH §5.2's own worked edge — and WITHDREW the four "would join" rows and every
  // `generator-write` citation that was a comment, a prose string, a template string or an
  // arrow parameter. The identifier pass is PURE (it reads the census's own read paths and no
  // file at all), so this block costs no I/O and cannot drift from the draft mode above: it
  // is the same function with the three file-reading evidence kinds absent.
  //
  // ⛔ STILL NOT A LEAF. The relations leaf is SEAM car 4's; this is the census RECORDING what
  // the sitting ratified, so the leaf has one source and the walker can convict it.
  const readPathsForAlias = [...new Set(spines.flatMap((r) => r.reads || []))].sort();
  const ratifiedAliasRows = aliasDraft({
    endpoints: [...new Set(relations.rows.flatMap((r) => [r.a, r.b]))],
    roots: [...new Set(readPathsForAlias.map((p) => rootOf(p)))],
    paths: readPathsForAlias,
  }).rows.filter((r) => r.evidence === 'identifier');
  /** @type {Array<[string, string]>} */
  const stampedFiles = STAMPED.map((rel) => [rel, sha256(readFileSync(join(ROOT, rel), 'utf8'))]);
  const tierCounts = tiers.reduce((m, t) => m.set(t.tier, (m.get(t.tier) || 0) + 1), new Map());
  return {
    schema: 'wiring-census/1',
    stamp: {
      files: Object.fromEntries(stampedFiles),
      candidateLeaves: candidateLeafIndex(),
      producerIndexFiles: producerFiles,
    },
    totals: {
      pools: summary.total,
      blocks: new Set(spines.map((r) => r.block)).size,
      variants: summary.variants,
      resolved: summary.resolved,
      unresolved: summary.unresolved,
      resolvedWithPredicate: summary.resolvedWithPredicate,
      resolvedWithCleanPredicate: summary.resolvedWithCleanPredicate,
      keyFunctions: census.functions,
      keyFunctionsConsulted: census.consulted,
      keyTables: census.tables,
      slotless: summary.slotless.length,
      bagless: summary.bagless.length,
      predicatesOverUnreadFields: summary.predicatesOverUnreadFields.length,
      syntheticTableFields: summary.syntheticTableFields,
      tiers: {
        MISSING: tierCounts.get(TIERS.MISSING) || 0,
        THIN: tierCounts.get(TIERS.THIN) || 0,
        COVERED: tierCounts.get(TIERS.COVERED) || 0,
        'MISSING-AT-TIER': tierCounts.get(TIERS.MISSING_AT_TIER) || 0,
      },
      tierSilences: (options.rates?.tierSilences || []).length,
      tierSilencesLawful: (options.rates?.tierSilences || []).filter((s) => s.verdict === 'LAWFUL').length,
      narrowsRefused: census.refusals.length,
      narrowedRows: spines.filter((r) => r.narrowed).length,
      covertRows: spines.filter((r) => r.covert).length,
      objectClassed: spines.filter((r) => r.objectClass !== null).length,
      mountedRows: spines.filter((r) => (r.sites || []).length > 0).length,
      absent: absentTotals(spines),
      zeroK: budget.zeroK,
      kExecutable: budget.executable,
      kNotExecutable: budget.notExecutable,
      branchGrainRows: spines.filter((r) => r.readsGrain === 'branch').length,
      functionGrainRows: spines.filter((r) => r.readsGrain === 'function').length,
      customReachableRows: custom.rows.length,
      relationRows: relations.rows.length,
      relationRowsJoinable: relationJoin(relations.rows, spines).strictBoth,
      ratifiedAliases: ratifiedAliasRows.length,
      tableRungRowsWithoutAbsence: spines.filter((r) => r.rung === 'table').length,
      modifierEligibleFactsByTab: mountsPerFact.byTab,
      sourceLicensedRows: sources.rows.LICENSED,
      sourceOfficeRows: sources.rows.OFFICE,
      sourceUnresolvedRows: sources.rows['SOURCE-UNRESOLVED'],
      sourceTwoSourceRows: sources.twoSourceRows,
      // ⭐ THE MODIFIER ROWS, COUNTED ON THEIR OWN LINE (TASTE car M-2). Every integer above
      // is measured over the SPINE rows, so `pools + modifierRows === rows.length` exactly and
      // nothing is hidden by the filter that keeps those integers stable.
      modifierRows: modifiers.length,
    },
    rows: census.rows,
    // ⭐ THE MODIFIER SECTION. A modifier pool is the estate's first non-spine, and it is
    // carried here so a reader meets it once, whole, rather than by grepping `rows` for a
    // `role`. `rung: 'annex'` on every one of them says the reading is AUTHOR-DECLARED and
    // that the executable cross-check is the candidate leaf's own arm.
    modifiers: {
      ruling: 'ARCH §2.3, §2.5: a MODIFIER pool declares its ROLE and its one READS path in the'
        + ' annex, and its selecting predicate lives in its desk\'s *StateProseCandidates.js'
        + ' leaf. No rung of the wiring ladder can recover it, so the row is taken from the'
        + ' annex declaration and says so (rung `annex`). It is NOT a spine of its block and no'
        + ' spine-shaped figure of this register counts it.',
      rows: modifiers.map((r) => ({
        block: r.block, pool: r.pool, reads: r.reads, covert: r.covert,
        objectClasses: r.objectClasses, source: r.source, variants: r.variants,
      })),
    },
    factIndex: factIndex(spines),
    mountsPerFact,
    attachCoverage: attach.map(({ byFact: _byFact, ...rest }) => rest),
    attachByFact: attach,
    factBudget: budget,
    grains,
    customReachable: custom,
    holders: {
      ruling: 'SITTING §Q (owner "Do it", 2026-09-08): every fact the record states has a typed'
        + ' SOURCE, derived and never authored. The producing field maps through the frozen'
        + ' holder table to a record-holder KIND, and the kind resolves to THIS town\'s'
        + ' institution and its standing through the institution table. A field whose holder the'
        + ' engine does not hold is SOURCE-UNRESOLVED, printed, never inferred. The `holder` and'
        + ' the standing beside it are null in this REGISTER because a register is not a town.',
      census: holderCensus(),
      summary: sources,
    },
    relations: { ...relations, join: relationJoin(relations.rows, spines) },
    ratifiedAliases: {
      ruling: 'SITTING §P.2-27: the three `identifier` rows are RATIFIED as aliases; the four'
        + ' "would join" rows and every `generator-write` citation that is a comment, a prose'
        + ' string, a template string or an arrow parameter are WITHDRAWN. The relations LEAF is'
        + ' SEAM car 4 and carries exactly these rows.',
      rows: ratifiedAliasRows,
    },
    // ⭐⭐ THE FIELD-SYNONYM TABLE (REWRITE car 8a-6; SITTING §H rule 3). A REPORT column and
    // never a gate: the nouns a field may be named by in prose, so arm Q, F25 and A0b can see a
    // clause that names a real second field in the field's own WORLD word rather than in its
    // PATH's word. `wages` names the military economic gate; `books` and `roll` name the record
    // a holder kind keeps. Ratified like an alias — every row cites where the join comes from.
    fieldSynonyms: fieldSynonymTable(spines),
    fieldSynonymsRuling: 'SITTING §H rule 3 and the chair\'s M-9 ruling 4. THE COLUMN IS A'
      + ' REPORT: it widens what an arm can SEE and licenses nothing on its own. A synonym is'
      + ' ratified like an alias — cited to the card, never to a comment or a prose string — so'
      + ' a row whose only evidence is that a writer used the word is not a synonym. The'
      + ' HOLDER-KIND nouns are generated from the frozen HOLDER_KINDS list rather than typed,'
      + ' so a kind added there gains its nouns with no edit.',
    tiers,
    rate: options.rates || null,
    narrowsRefusals: census.refusals,
  };
}

/**
 * The `absent` label distribution over every read path of every row.
 * @param {ReadonlyArray<{absent?: Record<string, string>}>} rows
 * @returns {Record<string, number>}
 */
export function absentTotals(rows) {
  /** @type {Record<string, number>} */
  const totals = {
    measured: 0, default: 0, 'not-produced': 0, 'method-call': 0,
  };
  for (const row of rows) {
    for (const label of Object.values(row.absent || {})) {
      totals[label] = (totals[label] || 0) + 1;
    }
  }
  return totals;
}

/** @param {object} data @returns {string} */
export const serialise = (data) => `${JSON.stringify(data, null, 2)}\n`;

/**
 * THE INTERLOCK, as a pure comparison so the walker can drive BOTH its limbs without
 * writing a byte. A stale STAMP and a stale BYTE are different failures with different
 * cures, and a check that collapsed them would tell a maintainer to regenerate when the
 * real answer is that a composer moved under a census nobody re-took.
 * @param {string|null} committedText
 * @param {object} data the freshly built census
 * @returns {{ok: boolean, reason: 'missing'|'stale-stamp'|'stale-bytes'|'', detail: string}}
 */
export function censusCheck(committedText, data) {
  if (committedText === null) {
    return { ok: false, reason: 'missing', detail: 'docs/content/wiring-census.json is missing; run `node scripts/wiring-census.mjs`.' };
  }
  /** @type {object} */
  let have;
  try { have = JSON.parse(committedText); } catch {
    return { ok: false, reason: 'stale-bytes', detail: 'docs/content/wiring-census.json does not parse as JSON.' };
  }
  for (const [rel, hash] of Object.entries(data.stamp.files)) {
    if (have.stamp?.files?.[rel] !== hash) {
      return {
        ok: false,
        reason: 'stale-stamp',
        detail: `wiring-census.json stamp is stale for ${rel}: the composer moved since the census was taken. Re-run \`node scripts/wiring-census.mjs\`.`,
      };
    }
  }
  if (committedText !== serialise(data)) {
    return { ok: false, reason: 'stale-bytes', detail: 'docs/content/wiring-census.json is stale; run `node scripts/wiring-census.mjs`.' };
  }
  return { ok: true, reason: '', detail: '' };
}

/**
 * ⭐ THE DRY READ (SEAM car 5, §5.8 item 3; the chair's ADDENDUM 2 to car 5b). The script had
 * FOUR modes and none of them could answer "what would change?" without writing: `--check`
 * throws on the first difference and the bare invocation REWRITES the committed register. A
 * lane that wanted the delta had to take the door and restore from `HEAD`, and car 5 ran that
 * write by accident doing exactly this. A register a lane cannot READ without WRITING is a
 * hazard family this estate has met before, so the read is its own mode.
 *
 * It is a SUMMARY and not a diff tool: the whole file is 1.8 MB and a line diff of it belongs
 * in `git diff`, which is available the moment the door is actually taken. What a lane needs
 * before deciding is which SECTIONS moved, by how many bytes, and whether any stamped sha or
 * any ROW moved, because those are the three questions the chair's own rule turns on.
 * @param {string|null} committedText
 * @param {object} data the freshly built census
 * @returns {{ok: boolean, bytes: {committed: number, fresh: number},
 *   sections: string[], stampFilesMoved: string[], candidateLeavesMoved: boolean,
 *   rowsMoved: number, rowExamples: string[]}}
 */
export function censusDry(committedText, data) {
  const fresh = serialise(data);
  // ⚠ BYTES, NOT CODE UNITS. A JS string's `.length` counts UTF-16 units and this register
  // carries section rules and typographic marks, so the two readings differ by more than a
  // thousand on the shipped file; a lane comparing `.length` against `wc -c` would read a
  // delta that is not there.
  const bytesOf = (text) => Buffer.byteLength(text, 'utf8');
  if (committedText === null) {
    return {
      ok: false,
      bytes: { committed: 0, fresh: bytesOf(fresh) },
      sections: ['(the committed file is missing)'],
      stampFilesMoved: [],
      candidateLeavesMoved: false,
      rowsMoved: data.rows.length,
      rowExamples: [],
    };
  }
  /** @type {object} */
  let have;
  try { have = JSON.parse(committedText); } catch {
    return {
      ok: false,
      bytes: { committed: bytesOf(committedText), fresh: bytesOf(fresh) },
      sections: ['(the committed file does not parse as JSON)'],
      stampFilesMoved: [],
      candidateLeavesMoved: false,
      rowsMoved: data.rows.length,
      rowExamples: [],
    };
  }
  const sections = Object.keys(data)
    .filter((key) => JSON.stringify(have[key]) !== JSON.stringify(data[key]));
  const stampFilesMoved = Object.entries(data.stamp.files)
    .filter(([rel, sha]) => have.stamp?.files?.[rel] !== sha).map(([rel]) => rel);
  const before = new Map((have.rows || []).map((r) => [`${r.block} :: ${r.pool}`, JSON.stringify(r)]));
  /** @type {string[]} */
  const rowExamples = [];
  let rowsMoved = 0;
  for (const row of data.rows) {
    const key = `${row.block} :: ${row.pool}`;
    if (before.get(key) === JSON.stringify(row)) continue;
    rowsMoved += 1;
    if (rowExamples.length < 5) rowExamples.push(key);
  }
  return {
    ok: committedText === fresh,
    bytes: { committed: bytesOf(committedText), fresh: bytesOf(fresh) },
    sections,
    stampFilesMoved,
    candidateLeavesMoved: JSON.stringify(have.stamp?.candidateLeaves)
      !== JSON.stringify(data.stamp.candidateLeaves),
    rowsMoved,
    rowExamples,
  };
}

/**
 * The dry read's own print, so the mode is one command and not a command plus a reading.
 * @param {ReturnType<typeof censusDry>} dry
 * @returns {string[]}
 */
export function dryLines(dry) {
  return [
    `[wiring-census --dry] the committed register is ${dry.ok ? 'CURRENT' : 'STALE'}; nothing was written`,
    `  bytes committed ${dry.bytes.committed} · fresh ${dry.bytes.fresh}`
      + ` · delta ${dry.bytes.fresh - dry.bytes.committed}`,
    `  sections that would move: ${dry.sections.join(' · ') || '(none)'}`,
    `  stamped shas that would move: ${dry.stampFilesMoved.join(' · ') || '(none)'}`
      + ` · candidate leaves ${dry.candidateLeavesMoved ? 'MOVED' : 'unmoved'}`,
    `  ROWS that would move: ${dry.rowsMoved}`
      + (dry.rowExamples.length ? ` (first: ${dry.rowExamples.join(' · ')})` : ''),
  ];
}

/**
 * THE TWO GRAINS PRINTED SIDE BY SIDE, ONCE — the measured cost of SITTING §O.1, so that a
 * reader compares two columns rather than two receipts.
 * @param {object} data
 * @returns {string[]}
 */
export function grainLines(data) {
  const b = data.grains.branch;
  const f = data.grains.function;
  const pad = (n) => String(n).padStart(6);
  /** @param {string} label @param {number|string} left @param {number|string} right */
  const row = (label, left, right) => `    ${label.padEnd(34)} ${pad(left)} ${pad(right)}`;
  return [
    '  ── the two GRAINS, side by side (branch | function-wide) ─────────',
    row('read paths over all 708 rows', b.readPaths, f.readPaths),
    row('k = 0 of the RESOLVED rows', b.zeroK, f.zeroK),
    row('blocks that can attach NOTHING', b.cannotAttach.length, f.cannotAttach.length),
    `    blocks the branch grain FREES: ${f.cannotAttach.filter((x) => !b.cannotAttach.includes(x)).join(' · ') || '(none)'}`,
    `    k histogram, branch:   ${b.histogram.map(([k, n]) => `k=${k} ${n}`).join(' · ')}`,
    `    k histogram, function: ${f.histogram.map(([k, n]) => `k=${k} ${n}`).join(' · ')}`,
  ];
}

/**
 * The receipt's own print, from ONE command.
 * @param {object} data
 * @returns {string[]}
 */
export function printLines(data) {
  const t = data.totals;
  const pad = (n) => String(n).padStart(5);
  const lines = [
    'WIRING CENSUS · ARCH car 0 · committed at docs/content/wiring-census.json',
    `  pools ${t.pools} · blocks ${t.blocks} · variants ${t.variants}`,
    `  RESOLVED ${t.resolved} · WIRING-UNRESOLVED ${t.unresolved} · with a predicate ${t.resolvedWithPredicate} · clean ${t.resolvedWithCleanPredicate}`,
    `  key functions ${t.keyFunctions} (consulted ${t.keyFunctionsConsulted}) · key tables ${t.keyTables}`,
    `  TIERS · MISSING ${t.tiers.MISSING} · THIN ${t.tiers.THIN} · COVERED ${t.tiers.COVERED}`
      + ` · MISSING-AT-TIER ${t.tiers['MISSING-AT-TIER']} (of ${t.tierSilences} per-tier silences, ${t.tierSilencesLawful} LAWFUL)`,
    '  ── the car-0 columns ─────────────────────────────────────────────',
    `  reads = tests on ${t.pools - t.narrowedRows} of ${t.pools} rows · narrowed ${t.narrowedRows} · NARROWS refused ${t.narrowsRefused}`,
    `  reads GRAIN (SITTING §O.1) · BRANCH on ${t.branchGrainRows} rows · function-wide, fail-closed, on ${t.functionGrainRows}`,
    ...grainLines(data),
    `  absent · measured ${t.absent.measured} · default ${t.absent.default} · not-produced ${t.absent['not-produced']}`
      + ` · method-call ${t.absent['method-call']}`
      + ` (over ${Object.values(t.absent).reduce((a, b) => a + b, 0)} read paths;`
      + ` the table rung's ${t.tableRungRowsWithoutAbsence} rows carry the instrument's own label and no absence record)`,
    `  covert rows ${t.covertRows} · objectClass named on ${t.objectClassed} of ${t.pools}`
      + ` (of which ${data.rows.filter((r) => (r.objectClasses || []).length > 1).length} name MORE THAN ONE class,`
      + ` and T-F12 refuses on the SET) · rows with a mount ${t.mountedRows}`,
    `  fact budget · k = 0 on ${t.zeroK} of ${t.kExecutable} RESOLVED rows · ${t.kNotExecutable} NOT-EXECUTABLE (UNRESOLVED)`,
    `  k histogram: ${data.factBudget.histogram.map(([k, n]) => `k=${k} ${n}`).join(' · ')}`,
    '  ── THE SOURCE OF EACH CONSTRUCTION (SITTING §Q) ──────────────────',
    `  ROWS · LICENSED ${t.sourceLicensedRows} · OFFICE ${t.sourceOfficeRows}`
      + ` · SOURCE-UNRESOLVED ${t.sourceUnresolvedRows} (of ${t.pools});`
      + ` two-source rows ${t.sourceTwoSourceRows}`,
    `  of the UNRESOLVED rows, ${data.holders.summary.rowsWithNoReading} carry NO recovered reading at all`
      + ` (the census's own WIRING-UNRESOLVED set: no predicate, so no field, so no source),`
      + ` leaving ${t.sourceUnresolvedRows - data.holders.summary.rowsWithNoReading} rows that read`
      + ` a field the holder table does not map`,
    `  FIELDS · LICENSED ${data.holders.summary.fields.LICENSED}`
      + ` · OFFICE ${data.holders.summary.fields.OFFICE}`
      + ` · SOURCE-UNRESOLVED ${data.holders.summary.fields['SOURCE-UNRESOLVED']}`
      + ` (no mapping ${data.holders.summary.unresolvedGrounds['no-mapping']},`
      + ` no institution in the roster ${data.holders.summary.unresolvedGrounds['no-institution-in-roster']})`,
    `  by KIND: ${data.holders.summary.byKind.map(([k, n]) => `${k} ${n}`).join(' · ') || '(none)'}`,
    `  holder kinds with NO institution in the shipped roster:`
      + ` ${data.holders.summary.kindsWithNoInstitution.join(' · ') || '(none)'}`,
    ...data.holders.census.map((h) => `    ${h.kind.padEnd(10)} fields ${String(h.fields).padStart(2)}`
      + ` · record services ${String(h.services).padStart(2)} (duty-named ${h.dutyNamed})`
      + ` · roster ${h.rosterBacked ? 'BACKED' : 'EMPTY'}`),
    `  customReachable rows ${t.customReachableRows} over ${data.customReachable.byKind.length} kinds`,
    `    ${data.customReachable.byKind.map(([k, n]) => `${k} ${n}`).join(' · ')}`,
    `  relation rows ${t.relationRows} · by source ${data.relations.bySource.map(([s, n]) => `(${s}) ${n}`).join(' · ')}`,
    `    by direction ${data.relations.byDirection.map(([d, n]) => `${d} ${n}`).join(' · ')}`,
    `    THE JOIN: rows both of whose endpoints a desk reads — STRICT ${data.relations.join.strictBoth}`
      + ` (either endpoint ${data.relations.join.strictEither}) · by LEAF ${data.relations.join.leafBoth}`
      + ` (either ${data.relations.join.leafEither}) over ${data.relations.join.deskRoots} desk read roots`,
    `  RATIFIED ALIASES (SITTING §P.2-27) ${t.ratifiedAliases} — the identifier rows, and nothing else:`,
    ...data.ratifiedAliases.rows.map((r) => `    ${r.endpoint.padEnd(30)} -> ${r.readRoot.padEnd(26)} ${r.at}`),
    '  ── attach coverage, the ten blocks with the most spines ──────────',
    ...[...data.attachCoverage].sort((a, b) => b.spines - a.spines).slice(0, 10)
      .map((a) => `    ${a.block.padEnd(11)} spines ${pad(a.spines)} · facts ${pad(a.facts)}`
        + ` · spines reached ${pad(a.spinesReachedBp)} bp · mean reach ${pad(a.meanReachBp)} bp`),
    `  modifier-eligible facts per tab: ${t.modifierEligibleFactsByTab.map(([tab, n]) => `${tab} ${n}`).join(' · ')}`,
    '  ── mounts per fact, the twelve with the most spine mounts ────────',
    ...[...data.mountsPerFact.rows].sort((a, b) => b.mountsSpine - a.mountsSpine).slice(0, 12)
      .map((f) => `    ${f.field.slice(0, 46).padEnd(46)} spine ${pad(f.mountsSpine)} · modifier ${pad(f.mountsModifier)}`),
  ];
  if (data.rate) {
    lines.push('  ── the RATE corpus ───────────────────────────────────────────────');
    lines.push(`    ${data.rate.corpus.cells} cells x ${data.rate.corpus.seeds} seeds = ${data.rate.corpus.towns} towns`
      + ` · pools that fired ${data.rate.rows.length}`);
  } else {
    lines.push('  RATE corpus: ABSENT from this file (run scripts/prose-rate-corpus.mjs --out, then --rates)');
  }
  return lines;
}

/**
 * THE FOUR FILE SETS THE DRAFT READS, DECLARED HERE AND NOWHERE ELSE, so a reader can see
 * exactly what an alias may be proposed from. Nothing outside them is scanned.
 * @returns {{builders: Map<string, string>, generators: Map<string, string>, docs: Map<string, string>}}
 */
export function draftSources() {
  /** @type {Map<string, string>} */
  const builders = new Map();
  for (const rel of ['src/components/new/generalDeskRead.js', 'src/components/new/economyDeskRead.js']) {
    builders.set(rel, readFileSync(join(ROOT, rel), 'utf8'));
  }
  /** @type {Map<string, string>} */
  const generators = new Map();
  for (const abs of jsFilesUnder(join(ROOT, 'src/generators'))) {
    generators.set(relative(ROOT, abs), readFileSync(abs, 'utf8'));
  }
  /** @type {Map<string, string>} */
  const docs = new Map([...builders]);
  for (const rel of COMPOSERS) docs.set(rel, readFileSync(join(ROOT, rel), 'utf8'));
  return { builders, generators, docs };
}

/**
 * The draft's own print: the table, the counts, the rows that WOULD join, and the debt.
 * @param {object} data the built census
 * @returns {string[]}
 */
export function draftLines(data) {
  const endpoints = [...new Set(data.relations.rows.flatMap((r) => [r.a, r.b]))];
  /** @type {Set<string>} */
  const roots = new Set();
  /** @type {Set<string>} */
  const paths = new Set();
  for (const row of data.rows) {
    for (const path of row.reads || []) { roots.add(rootOf(path)); paths.add(path); }
  }
  const draft = aliasDraft({
    endpoints, roots: [...roots], paths: [...paths].sort(), ...draftSources(),
  });
  /** @type {Map<string, Set<string>>} endpoint to the roots proposed for it */
  const byEndpoint = new Map();
  for (const row of draft.rows) {
    let seat = byEndpoint.get(row.endpoint);
    if (!seat) { seat = new Set(); byEndpoint.set(row.endpoint, seat); }
    seat.add(row.readRoot);
  }
  const joined = data.relations.rows.filter((r) => byEndpoint.has(r.a) && byEndpoint.has(r.b));
  // ⛔ THE JOIN AT THE RATIFIED GRADE, BESIDE THE JOIN AT THE DRAFT'S (SITTING §P.2-27). The
  // chair ratified the three `identifier` rows and WITHDREW everything else, so a reader who
  // sees "4 would join" must also see that all four rest on evidence the sitting withdrew.
  // Both counts print; neither is a join, and the shipped `relationJoin` is still 0.
  const ratifiedEndpoints = new Set(draft.rows.filter((r) => r.evidence === 'identifier').map((r) => r.endpoint));
  const joinedRatified = data.relations.rows
    .filter((r) => ratifiedEndpoints.has(r.a) && ratifiedEndpoints.has(r.b));
  /** @type {Map<string, number>} */
  const byDirection = new Map();
  for (const r of joined) byDirection.set(r.direction, (byDirection.get(r.direction) || 0) + 1);
  /** @type {Map<string, number>} */
  const byEvidence = new Map();
  for (const row of draft.rows) byEvidence.set(row.evidence, (byEvidence.get(row.evidence) || 0) + 1);
  return [
    'ALIAS DRAFT · ARCH car 0f · SITTING §O.2 · MEASURED, NOTHING RATIFIED, NO LEAF WRITTEN',
    `  endpoints ${endpoints.length} · desk read roots ${roots.size}`
      + ` (${draft.syntheticRootsExcluded} excluded as the instrument's own table labels)`
      + ` · read paths ${paths.size}`,
    `  candidate rows ${draft.rows.length} · endpoints with at least one candidate ${draft.endpointsWithCandidate}`
      + ` · with none ${draft.noCandidate.length}`,
    `  by evidence: ${[...byEvidence].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · ') || '(none)'}`,
    `  DOCBLOCK candidates, WITHDRAWN from the draft and REPORTED only (SITTING §P.2-27 extended,`
      + ` SEAM car 3h §3h.6 item 2): ${draft.docblockReports.length}`,
    ...draft.docblockReports.slice(0, 8).map((r) => `    REPORT  ${r.endpoint.slice(0, 42).padEnd(42)}`
      + ` -> ${r.readRoot.padEnd(26)} ${r.at}`),
    `  RELATION ROWS THAT WOULD JOIN under this draft: ${joined.length} of ${data.relations.rows.length}`
      + ` · by direction ${[...byDirection].map(([d, n]) => `${d} ${n}`).join(' · ') || '(none)'}`,
    `  RELATION ROWS THAT WOULD JOIN under the RATIFIED rows only (SITTING §P.2-27, the three`
      + ` identifier rows): ${joinedRatified.length} — the four above rest on evidence the sitting WITHDREW`,
    `  (the shipped join, unchanged and unratified: STRICT ${data.relations.join.strictBoth})`,
    ...joined.map((r) => `    WOULD JOIN  ${r.relation} (${r.source}) ${r.a} ${r.direction === 'a->b' ? '->' : '<-'} ${r.b}`),
    '  ── the draft, the forty strongest candidates ─────────────────────',
    ...draft.rows
      .slice(0, 40)
      .map((r) => `    ${r.endpoint.slice(0, 42).padEnd(42)} -> ${r.readRoot.padEnd(26)} ${r.evidence.padEnd(16)} ${r.at}`),
    '  ── endpoints with NO candidate: the wiring debt the SEAM and WAVE trains inherit ──',
    ...chunked(draft.noCandidate, 3).map((line) => `    ${line}`),
  ];
}

/**
 * @param {ReadonlyArray<string>} list
 * @param {number} per
 * @returns {string[]}
 */
function chunked(list, per) {
  /** @type {string[]} */
  const out = [];
  for (let i = 0; i < list.length; i += per) out.push(list.slice(i, i + per).join(' · '));
  return out;
}

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const checkOnly = argv.includes('--check');
  const dryOnly = argv.includes('--dry');
  const printOnly = argv.includes('--print');
  const draftOnly = argv.includes('--join-draft');
  const ratesAt = argv.indexOf('--rates');
  /** @type {object|null} */
  let rates = null;
  if (ratesAt >= 0 && argv[ratesAt + 1]) rates = JSON.parse(readFileSync(argv[ratesAt + 1], 'utf8'));
  const committed = (() => {
    try { return readFileSync(CENSUS_JSON, 'utf8'); } catch { return null; }
  })();
  // THE RATE HALF IS CARRIED THROUGH unless a run supplies a new one, so a check and a
  // no-flag write are both reproducible from the committed file plus the live composers.
  if (!rates && committed) rates = JSON.parse(committed).rate;
  const data = await buildCensus({ rates });
  const text = serialise(data);
  if (printOnly) {
    for (const line of printLines(data)) console.log(line);
    return;
  }
  // ⛔ THE DRAFT MODE WRITES NOTHING. It prints and returns before the write below, so a
  // reader can see by the control flow and not only by the docblock that no leaf moves.
  if (draftOnly) {
    for (const line of draftLines(data)) console.log(line);
    return;
  }
  // ⛔ THE DRY MODE RETURNS BEFORE THE WRITE BELOW, like `--join-draft`, so a reader can see by
  // the control flow and not only by the docblock that no register byte moves.
  if (dryOnly) {
    for (const line of dryLines(censusDry(committed, data))) console.log(line);
    return;
  }
  if (checkOnly) {
    const verdict = censusCheck(committed, data);
    if (!verdict.ok) throw new Error(verdict.detail);
    console.log(`[wiring-census] verified ${data.totals.pools} pools / ${data.totals.variants} variants`
      + ` / ${data.totals.relationRows} relation rows against ${Object.keys(data.stamp.files).length} stamped files`);
    return;
  }
  writeFileSync(CENSUS_JSON, text);
  console.log(`[wiring-census] wrote ${relative(ROOT, CENSUS_JSON)} — ${data.totals.pools} pools,`
    + ` ${data.totals.relationRows} relation rows, ${Object.keys(data.stamp.files).length} stamped files`);
}

if (process.argv[1] && process.argv[1].endsWith('wiring-census.mjs')) await main();
