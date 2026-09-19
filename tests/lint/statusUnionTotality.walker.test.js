/**
 * statusUnionTotality.walker.test.js — EM-B1d. THE `NpcStatus` UNION IS TOTAL, AND NO
 * CONSUMER MAY ENUMERATE PART OF IT WHILE READING AS COMPLETE.
 *
 * ⛔ THE LAW, IN ONE SENTENCE (ODQ §934.47 ruling R6′, verbatim). This walker strips block
 * and line comments from every file under `src/` excluding `**\/*.test.*`, flags each file
 * whose remaining source contains any of the quoted literals `'dead'`, `'exiled'` or
 * `'retired'` — the TRIGGER SET, being the members of the live `NpcStatus` typedef that are
 * members of no other declared vocabulary in the tree — and REDS unless every flagged file is
 * either a row of the declared consumer roster, whose enumeration must contain every
 * non-`active` member of the live typedef or carry a one-line reasoned omission naming the
 * members it leaves out, or a row of the declared exemption register naming the foreign
 * vocabulary it belongs to.
 *
 * ── WHY THE TRIGGER IS A SUBSET AND NOT THE WHOLE UNION ──────────────────────────────
 *
 * The class this walker exists for is THE ENUMERATION OF NON-ACTIVE MEMBERS. A consumer that
 * tests only `=== 'active'` is total by construction — every member that ever joins the union
 * is "not active", so it handles a new member correctly without knowing the word. The consumer
 * that breaks is the one that LISTS the absent/away statuses, of which `NPC_UNAVAILABLE_STATUSES`
 * is the archetype: a jailed figure silently counts as available because nobody added the word.
 *
 * ⛔⛔ TWO READINGS, TWO NAMES, AND VERSION 4 CONFLATED THEM. `NPC_UNAVAILABLE_STATUSES` says who
 * cannot ACT, HOLD A PLACE OR SUCCEED. `ROSTER_ABSENT_STATUSES` (`density/factionLifecycle.js`)
 * says who is off their HOUSE'S roster, so that an empty roster DISSOLVES the house — and R18
 * admits only IRREVERSIBLE causes to that irreversible consequence. A verdict ends, so `jailed`
 * is UNAVAILABLE and still ON the roster. Participation is a THIRD question, cured once at
 * `isOffStage` by EM-B1f. This walker owns the availability half; the house half is pinned in
 * `tests/generators/densityLaw.test.js` beside the law it belongs to.
 *
 * ⛔ THE HOMONYMS, AND THE CANNOT-CATCH THEY CREATE — DERIVED HERE, NOT AUTHORED. A member is
 * DISCRIMINATING when no declared vocabulary in the tree other than this union's own
 * enumerators spells it. Measured at this tip, by name and file: `'active'` 11 foreign
 * vocabularies (`ACTIVE_STAGES` ×4, `ACTIVE_STRESSOR_STAGES` ×2, `ACTIVE_UI_STAGES`,
 * `ACTIVE_FLOW_STAGES`, `ACTIVE_SYNERGY_STAGES`, `STRESSOR_LIFECYCLE_STAGES`, `THREAT_STAGES`),
 * `'removed'` 8 (`INACTIVE_STATUS`, `RUIN_STATUS`, `INACTIVE_STATUSES`, `NONSTANDING_STATUS`,
 * `DEAD_ENDPOINT_STATUS`, `TRANSPORT_DOWN_STATUSES`, `RUINED_STATUS`, `DEAD_EDGE_STATUSES`),
 * `'missing'` 3 (`STASIS_REASONS`, in three files), `'jailed'` 3 (`VERDICTS`,
 * `VERDICT_CAUSES`, `AUTHORITY_VERDICTS`). `'dead'`, `'exiled'` and `'retired'` have none.
 *
 * ⇒ A consumer that enumerates ONLY the homonym members (`active`, `removed`, `missing`,
 * `jailed`) is INVISIBLE to this walker, because those four words belong to the
 * stressor-lifecycle, institution-status, stasis-reason and verdict vocabularies as well as to
 * `NpcStatus`, and triggering on them would cost ~60 declared exemptions that say only "this is
 * `ACTIVE_STAGES`, not `NpcStatus`" — a register nobody reads. MEASURED AT THIS TIP: no such
 * site exists. The one homonym-only `.status` comparison in the tree
 * (`src/domain/crisisLifecycle.js`, `n.status === 'active'`) reads a STRESSOR, not an NPC, and
 * is a single positive test — total by construction. Should one ever exist it joins the roster
 * BY HAND with that reason.
 *
 * ⭐ THE VERDICT UNION IS EXEMPT BY NAME AND BY STRUCTURE (ODQ §934.47 addendum 6).
 * `npcVerdictTable.js`, `npcLedgerFacets.js` and `warAuthorityVerdict.js` spell `'jailed'` as
 * the COURT'S VERDICT — a verdict handed down and the status it leaves are the same word by
 * design (option J1). They are not flagged, because `'jailed'` is a homonym excluded from the
 * trigger, and the arm below asserts exactly that rather than assuming it. The exemption
 * register therefore carries ZERO rows at this tip and is authored inline: an empty register
 * does not earn a sibling data file, and the machinery that would police a row is proved on a
 * planted one instead of resting on an empty loop.
 *
 * ⭐ TWO DELIBERATELY DIFFERENT READS OF `npcs.js`. The TRIGGER strips comments, so it cannot
 * see the `NpcStatus` typedef (a JSDoc block); the file is flagged on its CODE instead — the
 * `killNpc` writer's `status: 'dead'`. The UNION PARSE reads that typedef comment on purpose,
 * from raw source. Both reads are stated so the walker is not self-contradictory.
 *
 * ⛔ THE STRIP IS THIS FILE'S OWN AND MAY NOT BE REPLACED BY `tests/helpers/codeOnlySource.js`.
 * That shared helper blanks comments AND string TEXT, which is right for a USE claim and fatal
 * here: this walker's whole subject is the quoted literal. Comments are blanked; string
 * contents are preserved; offsets and newlines are preserved so a hit reports its real line.
 *
 * @enforced-by itself (a source scan plus the live typedef; the seat arms call real functions)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import { NPC_UNAVAILABLE_STATUSES } from '../../src/domain/entities/npcs.js';
import { inferSuccessors } from '../../src/domain/entities/successors.js';
import { rosterPersonAvailable } from '../../src/domain/worldPulse/envoyCasting.js';

/**
 * The repo root, resolved DEFENSIVELY. Under some vitest modes `import.meta.url` is not a
 * `file:` URL and `fileURLToPath` THROWS, which would fail this file at collection and report
 * as a walker red that has nothing to do with the union. The estate's other `tests/lint`
 * walkers are split between the two spellings for exactly this reason; this one prefers the
 * URL when it is usable and falls back to `process.cwd()`, which vitest sets to the project
 * root. The walk's own non-empty assertion in A1 is what proves the root actually resolved.
 */
const ROOT = (() => {
  try { return join(dirname(fileURLToPath(import.meta.url)), '../..'); } catch { return process.cwd(); }
})();

const UNION_FILE = 'src/domain/entities/npcs.js';
const ENTITY_STATUS_FILE = 'src/domain/entities/status.js';

/** The two spellings a foreign vocabulary used for this union's own words before EM-B1d. */
const RETIRED_FOREIGN_SPELLINGS = Object.freeze(['killed', 'imprisoned']);

/**
 * ⭐ THE AVAILABILITY VOCABULARY, BY NAME — what a `union-read` row must be seen to import.
 * ⛔ IT IS NOT `ROSTER_ABSENT_STATUSES`, and the difference is the whole of version 5: that
 * constant answers whether a figure is off their HOUSE'S roster, so that an empty roster
 * DISSOLVES the house, and R18 admits only IRREVERSIBLE causes to an irreversible consequence.
 * A verdict ends, so a jailed figure is UNAVAILABLE but still ON the roster. The house half of
 * that law is pinned in tests/generators/densityLaw.test.js; this file owns the availability half.
 */
const AVAILABILITY_VOCABULARY = 'NPC_UNAVAILABLE_STATUSES';

/**
 * THE DECLARED CONSUMER ROSTER — eight rows. Five are this packet's own files; three were
 * found by the trigger and are NOT edited, because all three pair `=== 'dead'` with
 * `isOffStage`, the one participation chokepoint, and status-based absence joins that
 * chokepoint in EM-B1f rather than here.
 *
 * `spelling` is CHECKED against the tree, never trusted: a `literals` row must be flagged and
 * a `union-read` row must be unflagged, import the union, and spell no retired foreign word.
 * That is what keeps a cured consumer cured — a regression to hand-spelled literals reds here
 * even though the file would still "contain the union's own words".
 */
const ALL_BUT_DEAD = Object.freeze(['exiled', 'jailed', 'missing', 'removed', 'retired']);
const CHOKEPOINT = 'pairs === \'dead\' with isOffStage, the ONE participation chokepoint (src/domain/roads/state.js §8, built on isInStasis); status-based absence joins that chokepoint in EM-B1f, not here';
const READS_UNION = { spelling: 'union-read', enumerator: true, omits: [], why: '' };

const CONSUMER_ROSTER = Object.freeze([
  { file: UNION_FILE, symbol: AVAILABILITY_VOCABULARY, spelling: 'literals', enumerator: true, omits: ['missing', 'retired'],
    why: 'unavailability is not absence: a MISSING figure may walk back through the gate and a RETIRED elder may still be named a successor, so neither can mean "cannot act, hold a place, or succeed". This file is also the union\'s home and the KILL_NPC writer, which is the code the trigger flags it on' },
  { file: 'src/domain/density/factionLifecycle.js', symbol: 'ROSTER_ABSENT_STATUSES', spelling: 'literals', enumerator: true, omits: ['jailed', 'missing', 'retired'],
    why: 'THE HOUSE ROSTER, NOT AVAILABILITY (R18): an irreversible consequence may only be triggered by irreversible causes, so active, jailed, missing and retired are all PRESENT — a verdict ends, and a reversible absence must never dissolve a house permanently' },
  { file: 'src/domain/entities/successors.js', symbol: 'inferSuccessors', ...READS_UNION },
  { file: 'src/domain/worldPulse/envoyCasting.js', symbol: 'rosterPersonAvailable', ...READS_UNION },
  { file: 'src/domain/worldPulse/magicFormsPractitioner.js', symbol: 'LOST_NPC_STATUS', spelling: 'literals', enumerator: true, omits: [], why: '' },
  { file: 'src/domain/worldPulse/warSeatBooks.js', symbol: 'rosterNpcById', spelling: 'literals', enumerator: false, omits: ALL_BUT_DEAD, why: CHOKEPOINT },
  { file: 'src/domain/worldPulse/npcLadderState.js', symbol: 'eligibleMembersOf', spelling: 'literals', enumerator: false, omits: ALL_BUT_DEAD, why: CHOKEPOINT },
  { file: 'src/domain/worldPulse/npcLadderKernel.js', symbol: 'advanceLitLadder', spelling: 'literals', enumerator: false, omits: ALL_BUT_DEAD, why: CHOKEPOINT },
]);

/**
 * ⭐ EMPTY AT THIS TIP, AND INLINE BECAUSE IT IS EMPTY. A future row joins as
 * `{ file, vocabulary, why }` naming the foreign vocabulary the file's trigger word belongs
 * to. The checker below is proved on a planted row, so zero rows is not zero machinery.
 */
const EXEMPTION_REGISTER = Object.freeze([]);

/** The three files that spell the verdict union's `'jailed'`, exempt by structure. */
const VERDICT_UNION_FILES = Object.freeze([
  'src/domain/worldPulse/npcVerdictTable.js',
  'src/domain/worldPulse/npcLedgerFacets.js',
  'src/domain/worldPulse/warAuthorityVerdict.js',
]);

/**
 * Comments blanked, string and template TEXT preserved, offsets and newlines preserved.
 * @param {string} src @returns {string}
 */
function stripComments(src) {
  const out = src.split('');
  const n = src.length;
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '; };
  let i = 0;
  while (i < n) {
    const c = src[i]; const d = src[i + 1];
    if (c === '/' && d === '/') { let j = i; while (j < n && src[j] !== '\n') j++; blank(i, j); i = j; continue; }
    if (c === '/' && d === '*') {
      let j = i + 2;
      while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++;
      blank(i, Math.min(j + 2, n)); i = j + 2; continue;
    }
    // One branch for all three quote forms: a template may hold newlines, the other two
    // may not, and an escaped quote never ends the literal (that bug swallows the code after it).
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === c || (c !== '`' && src[j] === '\n')) break;
        j++;
      }
      i = j + 1; continue;
    }
    i++;
  }
  return out.join('');
}

/** @param {string} word @returns {RegExp} the word as a quoted literal, any quote style. */
function quoted(word) {
  return new RegExp(`(?:'${word}'|"${word}"|\`${word}\`)`);
}

/** @param {string} dir @param {string[]} out @returns {string[]} */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(?:js|jsx|mjs)$/.test(p) && !/\.test\./.test(p)) out.push(p);
  }
  return out;
}

/**
 * The members of a `@typedef {'a'|'b'} Name` union, READ FROM THE COMMENT ON PURPOSE.
 * @param {string} raw @param {string} name @returns {string[]} sorted
 */
function parseUnion(raw, name) {
  const block = new RegExp(`@typedef\\s*\\{([^}]*)\\}\\s*${name}\\b`).exec(raw);
  if (!block) return [];
  return [...block[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).sort();
}

/** @param {string} source @param {readonly string[]} words @returns {string[]} sorted */
function wordsIn(source, words) {
  const code = stripComments(source);
  return words.filter((w) => quoted(w).test(code)).sort();
}

/** @param {string} source @param {readonly string[]} words @returns {string[]} `line:word` hits */
function hits(source, words) {
  return stripComments(source).split('\n')
    .flatMap((line, i) => words.filter((w) => quoted(w).test(line)).map((w) => `${i + 1}:${w}`));
}

const SRC_FILES = walk(join(ROOT, 'src')).map((p) => relative(ROOT, p).replace(/\\/g, '/')).sort();
const SOURCE = new Map(SRC_FILES.map((rel) => [rel, readFileSync(join(ROOT, rel), 'utf8')]));

const NPC_STATUS = parseUnion(SOURCE.get(UNION_FILE) || '', 'NpcStatus');
const ENTITY_STATUS = parseUnion(readFileSync(join(ROOT, ENTITY_STATUS_FILE), 'utf8'), 'EntityStatus');
const NON_ACTIVE = NPC_STATUS.filter((m) => m !== 'active');

/**
 * ⭐ A vocabulary DECLARED INSIDE a declared consumer-roster file is this union's OWN, never
 * foreign — the roster IS the list of files that speak NpcStatus. Derived from the roster's
 * FILES rather than its symbols, because a consumer may derive a second, unnamed-in-the-roster
 * set from the vocabulary it imports: `envoyCasting.js` does exactly that, and keying on symbols
 * made its own derived set count ITSELF as a foreign vocabulary spelling `missing` (measured).
 */
const ROSTER_FILES = new Set(CONSUMER_ROSTER.map((r) => r.file));

/**
 * ⭐ THE DERIVATION. Every SCREAMING_SNAKE const initialised to an array or Set of string
 * literals is a DECLARED VOCABULARY. A union member spelled inside one that belongs to no
 * roster file is a HOMONYM; a member no foreign vocabulary spells is DISCRIMINATING and joins
 * the trigger. Derived from the tree, so a future member sorts itself.
 * @returns {Map<string, string[]>} member -> the foreign vocabularies that spell it
 */
function foreignVocabularies() {
  const decl = /(?:export\s+)?(?:const|let|var)\s+([A-Z][A-Z0-9_]*)\s*=\s*(?:Object\.freeze\(\s*)?(?:new\s+Set\(\s*)?\[([^\][]*)\]/g;
  const found = new Map(NPC_STATUS.map((m) => [m, []]));
  for (const rel of SRC_FILES) {
    const code = stripComments(SOURCE.get(rel) || '');
    for (const match of code.matchAll(decl)) {
      if (ROSTER_FILES.has(rel)) continue;
      const literals = [...match[2].matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] ?? m[2]);
      for (const member of NPC_STATUS) {
        if (literals.includes(member)) found.get(member).push(`${match[1]} (${rel})`);
      }
    }
  }
  return found;
}

const FOREIGN = foreignVocabularies();
const TRIGGER = NPC_STATUS.filter((m) => FOREIGN.get(m).length === 0);
const FLAGGED = SRC_FILES.filter((rel) => wordsIn(SOURCE.get(rel) || '', TRIGGER).length > 0);
const LITERAL_ROWS = CONSUMER_ROSTER.filter((r) => r.spelling === 'literals').map((r) => r.file).sort();
const DECLARED_FLAGGABLE = [...new Set([...LITERAL_ROWS, ...EXEMPTION_REGISTER.map((r) => r.file)])].sort();

/** Files whose source LISTS two or more distinct non-active members: the enumerator shape. */
const DISCOVERED_ENUMERATORS = SRC_FILES
  .filter((rel) => wordsIn(SOURCE.get(rel) || '', NON_ACTIVE).length >= 2);

/**
 * The totality demand of ONE roster row, as offender strings. Empty means the row is honest.
 * @param {{file: string, spelling: string, omits: readonly string[], why: string}} row
 * @param {string} source @returns {string[]}
 */
function offencesOf(row, source) {
  const out = [];
  const listed = wordsIn(source, NON_ACTIVE);
  const stale = row.omits.filter((m) => !NON_ACTIVE.includes(m));
  if (stale.length) out.push(`${row.file}: omits a word that is not a member of the live union: ${stale.join(', ')}`);
  if (row.omits.length && row.why.trim().length < 40) out.push(`${row.file}: omits ${row.omits.join(', ')} with no written reason`);
  if (row.spelling === 'union-read') {
    const spelled = wordsIn(source, [...TRIGGER, ...RETIRED_FOREIGN_SPELLINGS]);
    if (spelled.length) out.push(`${row.file}: declared a union READ but spells ${spelled.join(', ')} at ${hits(source, spelled).join(' ')}`);
    if (!stripComments(source).includes(AVAILABILITY_VOCABULARY)) out.push(`${row.file}: declared a union READ but does not read ${AVAILABILITY_VOCABULARY}`);
    return out;
  }
  const missing = NON_ACTIVE.filter((m) => !listed.includes(m) && !row.omits.includes(m));
  if (missing.length) out.push(`${row.file}: enumerates the union without ${missing.join(', ')}`);
  return out;
}

/**
 * The exemption register's own guard: an exempted file must still contain the vocabulary it
 * names. Proved below on a planted row, because the live register is empty.
 * @param {{file: string, vocabulary: string}} row @param {string} source @returns {string[]}
 */
function exemptionOffencesOf(row, source) {
  return stripComments(source).includes(row.vocabulary)
    ? []
    : [`${row.file}: claims exemption as ${row.vocabulary}, which the file no longer contains`];
}

describe('EM-B1d — the NpcStatus union is total, and no consumer enumerates part of it', () => {
  test('A1 — the scan is live, NpcStatus parses to exactly seven, and EntityStatus is PINNED at five', () => {
    expect(SRC_FILES.length, 'the src walk found nothing — every absence below would be vacuous').toBeGreaterThan(1500);
    expect(SOURCE.get(UNION_FILE), 'the union file did not load').toBeTruthy();
    // ⛔ AN EXACT SORTED LIST, never a length: a rename plus an addition keeps a count honest.
    expect(NPC_STATUS, 'NpcStatus moved. This union is ADD-ONLY: EM-B1d added `jailed` and renamed nothing.')
      .toEqual(['active', 'dead', 'exiled', 'jailed', 'missing', 'removed', 'retired']);
    expect(new Set(NPC_STATUS).size, 'a member is spelled twice in the typedef').toBe(NPC_STATUS.length);
    // ⭐ ODQ §934.47 addenda 6 and 7 made structural: EntityStatus is NOT this union and is not
    // widened here. A later lane that quietly adds a word to it reds on this line.
    expect(ENTITY_STATUS, 'EntityStatus is pinned UNCHANGED at five — widening it is EM-B1a\'s and EM-B1e\'s, never this walker\'s roster')
      .toEqual(['active', 'destroyed', 'impaired', 'removed', 'vacant']);
    // GUARD THE GUARD: the parser and the strip are real work in both directions.
    expect(parseUnion("/** @typedef {'a'|'b'} Probe */", 'Probe')).toEqual(['a', 'b']);
    expect(parseUnion('/** no typedef here */', 'Probe')).toEqual([]);
    expect(wordsIn("// a comment naming 'dead'\nconst x = 1;", ['dead'])).toEqual([]);
    expect(wordsIn("const x = ['dead'];", ['dead'])).toEqual(['dead']);
    expect(wordsIn("const x = 'a string naming dead';", ['dead']), 'the strip blanked string TEXT — this walker\'s whole subject is the quoted literal').toEqual([]);
    expect(stripComments("/* c */const x = 1;"), 'the strip moved an offset — a hit would report the wrong line').toHaveLength('/* c */const x = 1;'.length);
    // ⭐⭐ THE PLACEMENT IS ASSERTED, NOT REMEMBERED. The availability vocabulary is an exported
    // runtime constant, so it lands bytes wherever its home is bundled. It lives HERE because
    // `npcs.js` is absent from the generation worker's static closure and no module inside that
    // closure imports it — measured — so the EXACT, zero-slack worker ceiling cannot be touched
    // and the tree-shaking question never arises. A lane that relocates this constant must
    // re-price the packet's §3.2 against that ceiling rather than discover it at a terminal.
    expect(NPC_UNAVAILABLE_STATUSES, 'the availability vocabulary is not a frozen array').toEqual(['dead', 'exiled', 'jailed', 'removed']);
    expect(Object.isFrozen(NPC_UNAVAILABLE_STATUSES), 'the vocabulary must be frozen at load').toBe(true);
    expect(
      stripComments(SOURCE.get(UNION_FILE) || ''),
      `${AVAILABILITY_VOCABULARY} must be exported from ${UNION_FILE} — its measured home. Moving`
      + ' it is a byte-budget act: re-price §3.2 against the generation worker before you do.',
    ).toContain(`export const ${AVAILABILITY_VOCABULARY}`);
  });

  test('A2/A4 — T1: the declared enumerator roster equals what the tree discovers, and every row carries the union or its reasoned omission', () => {
    const unresolved = CONSUMER_ROSTER
      .filter((row) => !SOURCE.has(row.file) || !stripComments(SOURCE.get(row.file)).includes(row.symbol))
      .map((row) => `${row.file}#${row.symbol}`);
    expect(unresolved, 'a roster row names a path+symbol the tree no longer has. Re-aim the row at the moved enumerator — never delete it to green the walker.').toEqual([]);
    // ⛔ DECLARED EQUALS DISCOVERED, both directions, over the ENUMERATOR shape: a file that
    // lists two or more distinct non-active members IS an enumerator, whoever wrote it.
    expect(
      DISCOVERED_ENUMERATORS,
      'a file enumerates two or more non-active NpcStatus members and is not a declared'
      + ' enumerator row. The next consumer is exactly how this union goes partial: add the row,'
      + ' with its omissions named, or make the file READ the union.',
    ).toEqual(CONSUMER_ROSTER.filter((r) => r.enumerator && r.spelling === 'literals').map((r) => r.file).sort());
    const offences = CONSUMER_ROSTER.flatMap((row) => offencesOf(row, SOURCE.get(row.file) || ''));
    expect(
      offences,
      'a declared consumer neither enumerates every non-active member of the LIVE typedef nor'
      + ' names what it leaves out and why. This is the arm that makes a widening'
      + ' irreversible-by-accident: the day a member joins the typedef, every partial enumerator reds.',
    ).toEqual([]);
    // ⭐ A4, PROVED ON SYNTHETIC SOURCES so the green above is not a snapshot of itself: drop
    // `jailed` from an enumerator and it is convicted BY NAME; plant a fifth enumerator and the
    // discovery arm sees it.
    const row = { file: 'probe.js', spelling: 'literals', omits: [], why: '' };
    expect(offencesOf(row, "const S = ['dead', 'exiled', 'jailed', 'missing', 'removed', 'retired'];")).toEqual([]);
    expect(offencesOf(row, "const S = ['dead', 'exiled', 'missing', 'removed', 'retired'];"))
      .toEqual(['probe.js: enumerates the union without jailed']);
    expect(offencesOf({ ...row, omits: ['jailed'], why: 'x'.repeat(40) }, "const S = ['dead', 'exiled', 'missing', 'removed', 'retired'];")).toEqual([]);
    expect(offencesOf({ ...row, omits: ['jailed'], why: 'too short' }, "const S = ['dead'];").length).toBeGreaterThan(0);
    expect(wordsIn("const FIFTH = ['dead', 'exiled'];", NON_ACTIVE).length).toBeGreaterThanOrEqual(2);
  });

  test('A3 — T2: the trigger is DERIVED, the flagged set is SET-EQUAL both directions to roster plus register, and the CANNOT-CATCH is measured', () => {
    // The matcher fires on a planted literal BEFORE any absence below is read.
    expect(wordsIn("if (s === 'exiled') return;", TRIGGER), 'the matcher stopped firing — every equality below would be vacuous').toEqual(['exiled']);
    expect(
      TRIGGER,
      'the DERIVED trigger set moved. GROWTH is a new member unique to this union (update the'
      + ' pin deliberately); a SHRINK means a foreign vocabulary claimed one of these words and'
      + ' R6′ must be re-ruled by the chair — it is never a lane\'s choice.',
    ).toEqual(['dead', 'exiled', 'retired']);
    expect(TRIGGER.length, 'a trigger set of one token or none cannot discriminate at all — STOP').toBeGreaterThan(1);
    const unnamed = NPC_STATUS.filter((m) => !TRIGGER.includes(m) && FOREIGN.get(m).length === 0);
    expect(unnamed, 'a member is excluded from the trigger without a foreign vocabulary to name').toEqual([]);
    // ⛔ DEFENSIVE READ, and the red-first run is why: at a tree whose typedef lacks `jailed`
    // the map has no such key, and `FOREIGN.get('jailed').length` threw a TypeError instead of
    // failing with a sentence. A1 already pins the exact member list, so this arm must report
    // the exemption's subject, never crash on the same condition.
    expect((FOREIGN.get('jailed') || []).length, 'the verdict union no longer spells `jailed`, or `jailed` left the union — the declared exemption has lost its subject').toBeGreaterThan(0);
    // ⛔ SET-EQUAL, BOTH DIRECTIONS. An unlisted flagged file reds by name; a stale row reds.
    expect(
      FLAGGED,
      'a file under src/ spells a discriminating NpcStatus word and is on neither the consumer'
      + ' roster nor the exemption register. Add it to the roster with its enumeration honest, or'
      + ' to the register naming the foreign vocabulary it belongs to.',
    ).toEqual(DECLARED_FLAGGABLE);
    // GUARD THE GUARD (2): a cured row must still read the union, and the verdict union must
    // still be structurally exempt rather than merely unmentioned.
    const structural = VERDICT_UNION_FILES.filter((f) => !wordsIn(SOURCE.get(f) || '', ['jailed']).includes('jailed') || FLAGGED.includes(f));
    expect(
      structural,
      'a verdict-union file either stopped spelling `jailed` or became flagged. The exemption is'
      + ' STRUCTURAL — `jailed` is a homonym excluded from the trigger — and this arm is what'
      + ' keeps that a measurement instead of a sentence.',
    ).toEqual([]);
    expect(EXEMPTION_REGISTER, 'the register gained a row — all eight flagged files were genuine consumers at the tip, so a row means the homonym measurement moved and R6′ must be re-ruled').toEqual([]);
    expect(exemptionOffencesOf({ file: 'probe.js', vocabulary: 'VERDICTS' }, "const VERDICTS = ['jailed'];")).toEqual([]);
    expect(exemptionOffencesOf({ file: 'probe.js', vocabulary: 'VERDICTS' }, 'const OTHER = [];'))
      .toEqual(['probe.js: claims exemption as VERDICTS, which the file no longer contains']);
    // ⭐ THE FOREIGN SPELLINGS CANNOT COME BACK. Planting either retired word into a cured row
    // reds with its file:line, which is the arm addendum 5 asked for.
    const cured = "import { NPC_UNAVAILABLE_STATUSES } from '../entities/npcs.js';\nconst U = new Set([...NPC_UNAVAILABLE_STATUSES, 'missing']);\nexport function rosterPersonAvailable(npc) { return !U.has(npc.status); }";
    expect(offencesOf(CONSUMER_ROSTER[3], cured), 'the cured shape itself must pass, or the conviction below proves nothing').toEqual([]);
    const planted = cured.replace('npc.status)', "npc.status) && npc.status !== 'imprisoned'");
    expect(offencesOf(CONSUMER_ROSTER[3], planted))
      .toEqual(['src/domain/worldPulse/envoyCasting.js: declared a union READ but spells imprisoned at 3:imprisoned']);
    expect(offencesOf(CONSUMER_ROSTER[3], planted.replace('imprisoned', 'killed'))[0]).toContain('3:killed');
    expect(offencesOf(CONSUMER_ROSTER[3], cured.replace("'missing'", "'exiled'"))[0], 'a regression to hand-spelled trigger literals must red even though the word is the union\'s own').toContain('spells exiled');
  });

  test('A5/A6/A7 — UNAVAILABILITY (not house membership), the envoy cure and the inertness, through the real functions', () => {
    const jailed = { id: 'npc.j', name: 'Jailed Mayor', status: 'jailed', importance: 'key', factionAffiliation: 'The House', linkedInstitutionIds: ['inst.hall'] };
    const active = { id: 'npc.a', name: 'Live Deputy', status: 'active', importance: 'key', factionAffiliation: 'The House', linkedInstitutionIds: ['inst.hall'] };
    const outgoing = { id: 'npc.o', name: 'The Mayor', status: 'dead', importance: 'pillar', linkedInstitutionIds: ['inst.hall'] };
    const settlement = { npcs: [jailed, active, outgoing], powerStructure: { factions: [{ name: 'The House' }] } };
    // ⭐ A5, THE AVAILABILITY HALF — ANCHORED BY THE ACTIVE DEPUTY, so the arm cannot pass on an
    // empty roster. ⛔ THE OTHER HALF IS NOT HERE AND MUST NOT BE: that a jailed figure stays ON
    // the house roster (and that an all-jailed house reads `crewed`) is pinned in
    // tests/generators/densityLaw.test.js, beside the R18 law it belongs to. Neither file alone
    // can express the split, which is exactly why version 5 exists.
    const successors = inferSuccessors({ outgoing, settlement }).map((n) => n.id);
    expect(successors, 'the active deputy is not eligible — the roster or the scorer drifted, and the jailed absence below would be vacuous').toEqual(['npc.a']);
    expect(NPC_UNAVAILABLE_STATUSES, 'a jailed holder cannot keep a seat (design §15)').toContain('jailed');
    // A6 — the envoy cure, through the real predicate and then over its own source.
    expect(rosterPersonAvailable(active), 'an active person is castable — without this the two refusals below are vacuous').toBe(true);
    expect(rosterPersonAvailable(jailed), 'a jailed person was cast as an envoy').toBe(false);
    expect(rosterPersonAvailable({ status: 'dead', name: 'x' }), 'a dead person was cast as an envoy').toBe(false);
    const envoy = SOURCE.get('src/domain/worldPulse/envoyCasting.js') || '';
    const body = stripComments(envoy).slice(envoy.indexOf('export function rosterPersonAvailable'));
    expect(wordsIn(body.slice(0, body.indexOf('\n}')), [...NPC_STATUS, ...RETIRED_FOREIGN_SPELLINGS]), 'rosterPersonAvailable spells a status instead of reading a union').toEqual([]);
    // A7 — THE INERTNESS, PROVED: no writer in src/ assigns `jailed` to a status, so every
    // widened predicate above is unreachable on data that exists. The matcher is proved live on
    // a planted writer first, so the empty list is a measurement and not a broken regex.
    const writer = /status\s*[:=]\s*'jailed'/;
    expect(writer.test("const x = { ...npc, status: 'jailed' };"), 'the writer matcher stopped firing').toBe(true);
    const writers = SRC_FILES.filter((rel) => writer.test(stripComments(SOURCE.get(rel) || '')));
    expect(writers, 'a writer now assigns `jailed` to a status. The widening is no longer inert: EM-B1a\'s ops and EM-B1f\'s chokepoint arm must land before this becomes reachable.').toEqual([]);
  });
});
