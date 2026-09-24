/**
 * tests/lint/heldKeyWriterCensus.walker.test.js — THE WRITER CENSUS OF EVERY HELD KEY (EM-R1,
 * the re-entry family's runner-clone member).
 *
 * WHAT IT HOLDS. A generated record carries SEVEN held keys, and the whole re-entry programme
 * rests on knowing exactly WHO WRITES EACH ONE — at the STEP level (which of the 22 registered
 * steps provides or mutates it) and at the FUNCTION level (which symbol inside the assembly
 * step's own call graph produces, mutates, enriches, replays, mints or MIRRORS it). EM-R2
 * through EM-R7 each place a consult against that roster; a roster that is written down once
 * and never checked against the tree rots silently — a new writer appears and is classed
 * nowhere, a retired one keeps its row, a symbol moves file and the roster still names the old
 * home. This walker holds the roster EQUAL IN BOTH DIRECTIONS against the LIVE registry and
 * the LIVE source, so every one of those REDS, by name.
 *
 * ⛔ FOUR CONSTRUCTION RULES (packet §6), each with its own instrument:
 *   0. THE ROOT IS DERIVED FROM `import.meta.url`, NEVER `process.cwd()` at module scope. This
 *      file READS SOURCE, so it needs a repository root, and
 *      `tests/lint/moduleScopeCwdRatchet.test.js` banks `tests/lint` EXACT IN BOTH DIRECTIONS
 *      on exactly the working-directory spelling. The cured root keeps that population unmoved
 *      and is the shape that ratchet's own cure names.
 *   1. `it`, `test` and `describe` are bound EXACTLY ONCE each — never re-bound, not even as a
 *      callback parameter. The sovereignty-lighting census resolves an opener only where the
 *      module binds the word once, and a stray arrow parameter parks the whole file.
 *   2. Every set an arm iterates is IMPORTED from its producer — the held keys from
 *      `recordRegister.js`, the step roster from `getStepMeta()`, the declaration resolver from
 *      `tests/helpers/generationForkCensus.js` — never a local literal copy of a table, which is
 *      the shape `tests/lint/contractTestAntiVacuity.walker.test.js` Rule 2 convicts.
 *   3. Every negative carries `// anchored:` on the line IMMEDIATELY above the `expect` itself,
 *      or is a both-directions set equality that cannot go vacuous.
 *
 * ⛔ IT READS SOURCE AND THE LIVE REGISTRY. It runs NO generation and reads no `dist`, so it
 * cannot skip and it costs the gate seconds rather than minutes.
 *
 * CANNOT-CATCH:
 * 1.  A WRITER REACHED WITHOUT A CALL. A held key mutated through an alias (`const f = mergeNPCLists`
 *     then `f(...)`), through a dynamic `import()`, or by a helper the assembly step's body does not
 *     name is invisible to A3's discovery set. The set is a FLOOR on the surface, never a proof that
 *     the surface is closed.
 * 2.  DEPTH ONE. A3 discovers the imported symbols called in the assembly step's OWN body. Roster
 *     rows 3 to 8 live one level down, inside `generateCoherence`, and are held by A3's RESOLUTION
 *     half (each `(module, symbol)` resolves) rather than by its discovery half. A seventh writer
 *     appearing two levels down reds nowhere here; EM-R7's corpus ratchet is the arm for that.
 * 3.  CLASS IS DECLARED, NOT DERIVED — except for MIRROR. A4 proves the class vocabulary is total
 *     and that every MIRROR row really consults no pin; it does NOT re-derive `enricher` versus
 *     `replay` from behaviour. A row mis-classed between those two stays green here.
 * 4.  THE STREAM RULE IS READ FROM SOURCE, NOT FROM A RUN. A5 reads the substream wrapper's literal
 *     around `enrichNpcCoherence`; a writer that entered a named child stream through a helper, or
 *     one whose wrapper is spelled differently, is unseen.
 * 5.  `powerIntent` IS OUT OF REACH BY CONSTRUCTION. `generatePower` declares it as a chooser, but it
 *     is absent from `RECORD_CLASSES`, so the IMPORTED denominator excludes it. That is deliberate:
 *     the `recordPath`-less chooser is EM-R1b's subject, and widening the denominator by hand here
 *     to reach it is a named STOP of this member's packet (§11 item 8).
 * 6.  THE FOUR HELD-BUT-SAVED-ONLY KEYS are asserted EXCLUDED, never observed. Generation writes
 *     none of `neighbourNetwork`, `interSettlementRelationships`, `crossSettlementConflicts` or
 *     `peaceOffers` (NOTE-14, which classed the fourth); the arm that watches them over a real
 *     save then load is EM-R7's.
 * 7.  A6 READS THE THREE `src/` FILES' TEXT. It proves WHERE the clone is spelled, not that the
 *     runtime took it; `tests/generators/pipelinePinnedMode.test.js`'s A7 and A8 are the executed
 *     halves and this arm is their source-level counterpart.
 * 8.  ⭐ A7'S SCANNER IS A LINE PREDICATE, NOT A PARSER, and two holes follow from that. They are
 *     named here rather than discovered later. A THIRD was closed at NOTE-14: a COMPUTED-key write
 *     (`{ …record, [KEY]: … }`, the shape `peaceTermsDrafting.js` uses for `peaceOffers`) carries
 *     no literal key on the line, so the scanner now resolves the CONSTANTS whose literal value IS
 *     a governed key out of RAW source and matches a bracket that OPENS a property — which is what
 *     keeps the ternary `settlement[PEACE_OFFER_KEY] : undefined` out of the write set. (i) The
 *     enclosing symbol is the nearest column-zero binding head at or above the line, the same
 *     backward scan `tests/lint/moduleScopeCwdRatchet.test.js` drives against live controls; a
 *     site inside a nested helper is attributed to its outermost declaration. (ii) A NON-WRITER
 *     row's site count is not pinned, only its presence, so a second `decrees:` line inside an
 *     already-declared display helper does not red. WRITER counts ARE pinned, which is the half
 *     that matters: the undo path's two rehydration branches cannot collapse into one unnoticed.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

import { RECORD_CLASSES, SAVED_KEY_WRITERS, SAVED_ONLY_KEYS } from '../../src/domain/edit/recordRegister.js';
import { getStepMeta, getStepOrder } from '../../src/generators/pipeline.js';
import { codeOnly } from '../helpers/codeOnlySource.js';
import { declaredSymbols } from '../helpers/generationForkCensus.js';

/** Construction rule 0: the cured root, never the working directory at module scope. */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const ASSEMBLY_STEP = 'assembleSettlement';
const ASSEMBLY_FILE = 'src/generators/steps/assembleSettlement.js';
const RECONCILE_FILE = 'src/generators/power/economyReconciliation.js';
const NARRATIVE_FILE = 'src/generators/narrativeGenerator.js';
const RUNNER_FILE = 'src/generators/pipeline.js';
const INSTITUTION_STEP_FILE = 'src/generators/steps/assembleInstitutions.js';
const POWER_STEP_FILE = 'src/generators/steps/generatePower.js';

/**
 * EVERY COHERENCE SUBSTREAM LABEL THE NARRATIVE LEAF DECLARES, held exact in both directions, so a
 * SECOND named child stream around a held writer reds by name. Only the first is over a held
 * writer; the other four wrap presentation concerns and write no held record key.
 */
const SUBSTREAM_LABELS = Object.freeze(
  ['npc-enrichment', 'historical-character', 'prominent-relationship', 'coherence-notes', 'siege-capability'].sort(),
);
/** The one label that wraps a held writer: `enrichNpcCoherence`, the family's ONE lawful skip. */
const HELD_WRITER_STREAM = 'npc-enrichment';

/** The six classes, and they are the whole vocabulary. */
const CLASSES = Object.freeze(['producer', 'mutator', 'enricher', 'replay', 'mint', 'MIRROR']);
/** Where a writer's draws are taken: its own NAMED child stream, or the step's shared one. */
const NAMED_CHILD = 'named-child';
const SHARED = 'shared';

const source = (relative) => codeOnly(readFileSync(join(ROOT, relative), 'utf8'));
const rawSource = (relative) => readFileSync(join(ROOT, relative), 'utf8');

/**
 * THE FROZEN FUNCTION-LEVEL ROSTER — every writer of a held key inside the assembly step's call
 * graph, with its home, its class and its stream. `via` records WHERE the symbol is called, which
 * is what lets A3 hold the assembly body's discovery set exactly without pretending the rows one
 * level down are reachable from it.
 */
const ROSTER = Object.freeze([
  { symbol: 'generateSettlementName', file: 'src/generators/npcGenerator.js', cls: 'mint', stream: SHARED, via: ASSEMBLY_STEP },
  { symbol: 'generateCoherence', file: NARRATIVE_FILE, cls: 'enricher', stream: SHARED, via: ASSEMBLY_STEP },
  { symbol: 'enrichNpcCoherence', file: NARRATIVE_FILE, cls: 'enricher', stream: NAMED_CHILD, via: 'generateCoherence' },
  { symbol: 'buildPoliticalNarrative', file: NARRATIVE_FILE, cls: 'enricher', stream: NAMED_CHILD, via: 'generateCoherence' },
  { symbol: 'mergeNPCLists', file: 'src/generators/npcGenerator.js', cls: 'enricher', stream: NAMED_CHILD, via: 'generateCoherence' },
  { symbol: 'disperseNamedRoster', file: 'src/generators/density/applyDensityLaw.js', cls: 'enricher', stream: NAMED_CHILD, via: 'generateCoherence' },
  { symbol: 'enrichNPCsWithStructure', file: 'src/generators/npcStructure.js', cls: 'enricher', stream: NAMED_CHILD, via: 'generateCoherence' },
  { symbol: 'relinkFactionMembers', file: NARRATIVE_FILE, cls: 'MIRROR', stream: SHARED, via: 'generateCoherence' },
  { symbol: 'ensureFactionStructuralNpcs', file: 'src/generators/factionRoles.js', cls: 'producer', stream: SHARED, via: ASSEMBLY_STEP },
  { symbol: 'reconcilePowerStructure', file: RECONCILE_FILE, cls: 'replay', stream: SHARED, via: ASSEMBLY_STEP },
  { symbol: 'resizePoliticalRoster', file: 'src/generators/density/applyDensityLaw.js', cls: 'replay', stream: SHARED, via: ASSEMBLY_STEP },
]);

/**
 * THE TWO ASSERT ROWS — the census's seventh column, EM-R3's subject. They read the held-key
 * surface and write nothing, so they are named here rather than classed.
 */
const ASSERTS = Object.freeze([
  { symbol: 'assertPowerEconomyFreshness', file: RECONCILE_FILE, via: ASSEMBLY_STEP },
  { symbol: 'assertStableGeneratedRoster', file: RECONCILE_FILE, via: 'reconcilePowerStructure' },
]);

/**
 * ⭐ THE DECLARED ASSERT EXEMPTION, WITH ITS WRITTEN REASON. The packet's §5.4 calls the two rows
 * above "complete"; MEASURED at this base, `src/generators/power/economyReconciliation.js`
 * declares a THIRD `assert*` and has since before this member was compiled, so the completeness
 * claim needs this exemption rather than a silent third row. A3's own mechanism carries it: a
 * symbol found in the surface that is not a roster row goes in a DECLARED table with a reason.
 */
const ASSERT_EXEMPT = Object.freeze([
  {
    symbol: 'assertIntent',
    reason: 'A VERSION GUARD ON THE INTENT ENVELOPE, not a held-key assert: it throws when the '
      + 'power-generation intent is absent or carries a stale POWER_INTENT_VERSION, and it reads no '
      + 'held record key and no pin. Module-private, never imported by the assembly step, and '
      + 'present in this file since before EM-R1 was compiled.',
  },
]);

/**
 * THE DECLARED EXEMPT TABLE for A3's discovery set: every symbol the assembly step imports AND
 * calls that writes no held key. Each entry carries a written reason, and the equality is held in
 * both directions, so a new import that IS a writer cannot hide here.
 */
const DISCOVERY_EXEMPT = Object.freeze([
  { symbol: 'registerStep', reason: 'the runner\'s registration door; it declares the step and writes nothing.' },
  { symbol: 'chooseOrPin', reason: 'the runner\'s pin primitive; it returns an own-present pin or calls the thunk and writes no held key itself.' },
  { symbol: 'renderStressSummary', reason: 're-renders a stress summary string; touches `stress`, a READING, never a held key.' },
  { symbol: 'generatePressureSentence', reason: 'presentation prose for the settlement header; writes no held key.' },
  { symbol: 'generateArrivalScene', reason: 'presentation prose for the arrival scene; writes no held key.' },
  { symbol: 'generateDefenseProfile', reason: 'builds `defenseProfile`, classed READING in the record register, not HELD.' },
  { symbol: 'normalizeSettlement', reason: 'the canonical-shape adapter: stamps version fields and defaults containers; it restructures no held collection.' },
  { symbol: 'promoteStressorsToConditions', reason: 'promotes live stressors into `activeConditions`, a WORLD key, never a held one.' },
  { symbol: 'reapplyEventConditions', reason: 'the same surface as the row above, for event-sourced conditions.' },
  { symbol: 'culturalNotesFor', reason: 'a pure lookup over the culture profile table; it writes nothing at all.' },
  { symbol: 'buildGenerationCoherenceReceipt', reason: 'builds `generationCoherenceReceipt`, classed RECEIPT, not HELD.' },
  { symbol: 'refreshPowerGenerationTraces', reason: 're-stamps the power traces in `simulationTrace`, the sanctioned cross-cutting ledger, never `powerStructure` itself.' },
]);

/** The held denominator, DERIVED from its producers and never re-typed. */
const HELD_KEYS = Object.freeze(
  Object.entries(RECORD_CLASSES)
    .filter(([, cls]) => cls === 'HELD')
    .map(([key]) => key)
    .filter((key) => ![...SAVED_ONLY_KEYS].includes(key))
    .sort(),
);

/** The step-level rows the LIVE registry produces: every (step, held key, how) triple, in order. */
function liveStepRows() {
  const rows = [];
  for (const step of getStepMeta()) {
    for (const key of step.provides) {
      if (HELD_KEYS.includes(key)) rows.push(`${step.name}|${key}|provides`);
    }
    for (const key of step.mutates) {
      if (HELD_KEYS.includes(key) && !step.provides.includes(key)) rows.push(`${step.name}|${key}|mutates`);
    }
  }
  return rows.sort();
}

/** THE FROZEN STEP-LEVEL ROSTER, in the same spelling the derivation above produces. */
const STEP_ROSTER = Object.freeze([
  'assembleInstitutions|institutions|provides',
  'assembleSettlement|powerStructure|mutates',
  'cascadePass|institutions|mutates',
  'coherenceRepairPass|institutions|mutates',
  'corruptionPass|factions|mutates',
  'corruptionPass|npcs|mutates',
  'factionCorrelationPass|institutions|mutates',
  'generatePopulation|conflicts|provides',
  'generatePopulation|factions|provides',
  'generatePopulation|npcs|provides',
  'generatePopulation|relationships|provides',
  'generatePower|powerStructure|provides',
  'isolationPass|institutions|mutates',
  'neighbourFactions|powerStructure|mutates',
  'powerEconomyReconcilePass|powerStructure|mutates',
  'subsumptionPass|institutions|mutates',
]);

/** The symbols the assembly step IMPORTS, read from its own raw source (specifiers survive there). */
function assemblyImports() {
  const raw = rawSource(ASSEMBLY_FILE);
  const names = [];
  for (const match of raw.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"][^'"]+['"]/g)) {
    for (const part of match[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop().trim();
      if (name) names.push(name);
    }
  }
  return names;
}

/** The body of the assembly step's registration, comments blanked. */
function assemblyBody() {
  const code = source(ASSEMBLY_FILE);
  const openers = [...code.matchAll(/registerStep\s*\(/g)];
  return openers.length === 1 ? code.slice(openers[0].index) : '';
}

/** The body of one declared symbol, comments blanked, to the next column-zero declaration. */
function bodyOf(relative, symbol) {
  const code = source(relative);
  const head = new RegExp(
    `(?:^|\\n)[ \\t]*(?:export[ \\t]+)?(?:async[ \\t]+)?function[ \\t]+${symbol}\\b`
    + `|(?:^|\\n)[ \\t]*(?:export[ \\t]+)?(?:const|let|var)[ \\t]+${symbol}[ \\t]*=`,
  );
  const at = code.search(head);
  if (at < 0) return '';
  const rest = code.slice(at + 1);
  const next = rest.search(/\n(?:export[ \t]+)?(?:async[ \t]+)?function[ \t]+|\n(?:export[ \t]+)?(?:const|let|var)[ \t]+[A-Za-z_$][\w$]*[ \t]*=/);
  return next < 0 ? rest : rest.slice(0, next);
}

const called = (body, symbol) => new RegExp(`\\b${symbol}\\s*\\(`).test(body);

/* ── A7's surface: the written saved-only keys and every site that names them ─────────────── */

/** One spelling of "sorted copy", so two arms of this file cannot order a set differently. */
const sorted = (values) => [...values].sort();

/** The keys `SAVED_KEY_WRITERS` governs, DERIVED from the roster itself, never re-typed. */
const WRITTEN_KEYS = Object.freeze([...new Set(SAVED_KEY_WRITERS.map((row) => row.key))].sort());

/** Every module under `src/`, so the scan has no hand-typed file surface to go stale. */
function srcFiles(dir = join(ROOT, 'src'), out = []) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) srcFiles(full, out);
    else if (/\.(js|jsx|mjs)$/.test(name)) out.push(full);
  }
  return out;
}

/** A module-scope or nested binding head at column zero — the same backward scan the cwd ratchet drives. */
const DECL_HEAD = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)|^(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=/;

/**
 * EVERY `src/` MODULE READ ONCE — the raw text and the comment/literal-blanked strip. Three of
 * A7's derivations walk the same tree, and re-reading it per roster row is what made the first
 * cut of this arm time out at twenty seconds; the cache is the whole cure.
 * @type {{file: string, raw: string, lines: string[]}[]|null}
 */
let SRC_CACHE = null;
function srcModules() {
  if (SRC_CACHE === null) {
    SRC_CACHE = srcFiles().map((abs) => {
      const raw = readFileSync(abs, 'utf8');
      return { file: relative(ROOT, abs).split('\\').join('/'), raw, lines: codeOnly(raw).split('\n') };
    });
  }
  return SRC_CACHE;
}

/**
 * The module CONSTANTS whose literal value IS one of the governed keys, mapped to that key. Read
 * from RAW source because `codeOnly` blanks literal text by design — the very text this needs.
 * This is what lets the scanner see a COMPUTED-key write without being told the constant's name.
 */
function keyConstants() {
  /** @type {Map<string, string>} */
  const byName = new Map();
  for (const module of srcModules()) {
    for (const match of module.raw.matchAll(/(?:^|\n)[ \t]*(?:export[ \t]+)?const[ \t]+([A-Z][A-Z0-9_]*)[ \t]*=[ \t]*'([^']*)'[ \t]*;/g)) {
      if (WRITTEN_KEYS.includes(match[2])) byName.set(match[1], match[2]);
    }
  }
  return byName;
}

/** A bracket that OPENS a property: `{ [KEY]: …` or `, [KEY]: …`, never a ternary's `] : …`. */
const COMPUTED_WRITE = /(?:^|[{,])\s*\[\s*([A-Za-z_$][\w$]*)\s*\]\s*(?::|=[^=])/g;

/**
 * Every site in `src/` that names one of the governed keys, as `key|file|symbol|spelling` with its
 * site count. Read from CODE, never from prose: `codeOnly` blanks comments and literal text, so
 * this register's own documentation of its keys is not counted as a use of them.
 */
function savedKeySites() {
  /** @type {Map<string, number>} */
  const rows = new Map();
  const constants = keyConstants();
  for (const { file, lines } of srcModules()) {
    const symbolAt = (index) => {
      for (let back = index; back >= 0; back -= 1) {
        const head = lines[back].match(DECL_HEAD);
        if (head) return head[1] || head[2];
      }
      return '(module)';
    };
    lines.forEach((line, index) => {
      for (const key of WRITTEN_KEYS) {
        const assign = new RegExp(`\\.${key}\\s*=[^=]`).test(line);
        const literal = new RegExp(`(^|[{,(\\s])${key}\\s*:`).test(line);
        if (!assign && !literal) continue;
        const id = `${key}|${file}|${symbolAt(index)}|${assign ? 'assign' : 'literal'}`;
        rows.set(id, (rows.get(id) || 0) + 1);
      }
      for (const match of line.matchAll(COMPUTED_WRITE)) {
        const key = constants.get(match[1]);
        if (key === undefined) continue;
        const id = `${key}|${file}|${symbolAt(index)}|computed`;
        rows.set(id, (rows.get(id) || 0) + 1);
      }
    });
  }
  return rows;
}

/**
 * How many times each of the given symbols is CALLED anywhere in `src/`, its own declaration line
 * excluded — ONE pass over the cached tree for all of them, never one pass per symbol.
 * @param {readonly string[]} symbols @returns {Map<string, number>}
 */
function callCounts(symbols) {
  const probes = symbols.map((symbol) => ({
    symbol,
    call: new RegExp(`\\b${symbol}\\s*\\(`),
    declaration: new RegExp(`(?:^|[^\\w$])(?:export\\s+)?(?:async\\s+)?function\\s+${symbol}\\s*\\(`),
  }));
  const counts = new Map(symbols.map((symbol) => [symbol, 0]));
  for (const { lines } of srcModules()) {
    for (const line of lines) {
      for (const probe of probes) {
        if (probe.call.test(line) && !probe.declaration.test(line)) {
          counts.set(probe.symbol, counts.get(probe.symbol) + 1);
        }
      }
    }
  }
  return counts;
}

/**
 * THE DECLARED NON-WRITERS: every site the scanner finds that names an editor key and writes it
 * on NOTHING THAT IS A RECORD. Each carries a written reason, and the equality in A7 is held in
 * both directions, so a site that IS a record write cannot hide in here.
 */
const SAVED_KEY_NON_WRITERS = Object.freeze([
  {
    id: 'dmLayer|src/domain/edit/recordRegister.js|RECORD_CLASSES|literal',
    reason: 'the register CLASSING its own key. Pure frozen data that describes the record and '
      + 'writes none: the shared source strip exists for exactly this case, a registry convicted '
      + 'for describing the thing it classifies.',
  },
  {
    id: 'decrees|src/domain/edit/recordRegister.js|RECORD_CLASSES|literal',
    reason: 'the same row as the line above, for the second editor key; one source line carries '
      + 'both class declarations and neither is a write.',
  },
  {
    id: 'peaceOffers|src/domain/edit/recordRegister.js|RECORD_CLASSES|literal',
    reason: 'NOTE-14\'s class row, the third of the same kind. The register classes the key as '
      + 'HELD and writes it nowhere; its two real writers live in the world pulse and are '
      + 'declared in SAVED_KEY_WRITERS.',
  },
  {
    id: 'decrees|src/domain/ai/personaSlicer.js|buildPersonaSlice|literal',
    reason: 'a field of the PERSONA SLICE handed to the clerk, capped at six entries and read out '
      + 'of the home record. The slice is a projection built for one prompt and is never written '
      + 'back to any settlement.',
  },
  {
    id: 'decrees|src/domain/display/decreeTracker.js|describeCluster|literal',
    reason: 'a field of a DISPLAY read model row — the tracker\'s per-cluster section — built for '
      + 'the advance report. The read model is rebuilt from the record on every render and is '
      + 'never a record itself.',
  },
  {
    id: 'decrees|src/domain/display/decreeTracker.js|decreeHistory|literal',
    reason: 'the same display read model as the row above, at its per-advance entry shape; it '
      + 'carries a tick and a span label beside the section, which no record key does.',
  },
  {
    id: 'decrees|src/store/editSlice.js|stageAddDecreeIntent|literal',
    reason: 'the ACTION RESULT envelope the caller gets back — `{ ok, saveId, decreeId, op, '
      + 'decrees }`. The store\'s write already happened in `commitRegistry`; this is the report '
      + 'of it, and a UI reads it rather than saving it.',
  },
  {
    id: 'decrees|src/store/editSlice.js|stageFulfilOp|literal',
    reason: 'the same action-result envelope as the row above, returned by the fulfilment path; '
      + 'it names the registry the commit produced and writes nothing.',
  },
]);

describe('EM-R1 — the writer census of every held key', () => {
  it('A1 — the held denominator is IMPORTED from the record register, never re-typed', () => {
    const derived = Object.entries(RECORD_CLASSES)
      .filter(([, cls]) => cls === 'HELD')
      .map(([key]) => key)
      .filter((key) => ![...SAVED_ONLY_KEYS].includes(key))
      .sort();
    // ANTI-VACUITY FIRST: an empty denominator would make every equality below vacuous.
    expect(derived.length, 'the held denominator is empty: every arm below would be vacuous')
      .toBeGreaterThan(0);
    expect(HELD_KEYS).toEqual(derived);
    expect(HELD_KEYS).toEqual(['conflicts', 'factions', 'institutions', 'name', 'npcs', 'powerStructure', 'relationships']);

    // The three HELD-but-SAVED_ONLY keys are excluded BY NAME, by the producer's own table.
    const savedOnlyHeld = Object.entries(RECORD_CLASSES)
      .filter(([key, cls]) => cls === 'HELD' && [...SAVED_ONLY_KEYS].includes(key))
      .map(([key]) => key)
      .sort();
    // ⭐ FOUR, NOT THREE, SINCE NOTE-14: `peaceOffers` was a top-level saved key with no class in
    // the register at all. It is classed HELD with its three cross-settlement neighbours and for
    // their reason — a first-hand relational fact generation never re-derives.
    expect(savedOnlyHeld).toEqual([
      'crossSettlementConflicts', 'interSettlementRelationships', 'neighbourNetwork', 'peaceOffers',
    ]);
    // anchored: the line above proves all three are live HELD rows of the register, so this
    // disjointness is an exclusion the denominator made, not a table that drifted away.
    expect(savedOnlyHeld.filter((key) => HELD_KEYS.includes(key))).toEqual([]);
  });

  it('A2 — the STEP-LEVEL census is total against the live registry, in both directions', () => {
    const live = liveStepRows();
    // ANTI-VACUITY: the registry is populated and still carries the assembly step.
    expect(getStepOrder().length, 'the step registry is empty: this arm would be vacuous')
      .toBeGreaterThan(0);
    expect(getStepMeta().map((step) => step.name)).toContain(ASSEMBLY_STEP);

    expect(live, 'a held-key writer step appeared or retired').toEqual([...STEP_ROSTER]);
    const writerSteps = [...new Set(STEP_ROSTER.map((row) => row.split('|')[0]))];
    expect(writerSteps).toHaveLength(12);
    expect(getStepMeta()).toHaveLength(22);
  });

  it('A3 — the FUNCTION-LEVEL roster is live and exact, and its discovery set is closed', () => {
    // (a) RESOLUTION: every roster row and every ASSERT row resolves at its own path, count 1.
    const unresolved = [];
    const cache = new Map();
    for (const row of [...ROSTER, ...ASSERTS]) {
      if (!cache.has(row.file)) cache.set(row.file, declaredSymbols(rawSource(row.file)));
      if (cache.get(row.file).get(row.symbol) !== 1) unresolved.push(`${row.file} :: ${row.symbol}`);
    }
    expect(ROSTER).toHaveLength(11);
    expect(unresolved, 'a roster row names a symbol its file no longer declares exactly once').toEqual([]);

    // (b) DISCOVERY, both directions, over the assembly step's OWN body.
    const body = assemblyBody();
    // ANTI-VACUITY: the body was found and is not a stub.
    expect(body.length, 'the assembly step body was not found: the discovery set would be empty')
      .toBeGreaterThan(1000);
    const discovered = assemblyImports().filter((symbol) => called(body, symbol)).sort();
    const declared = [
      ...ROSTER.filter((row) => row.via === ASSEMBLY_STEP).map((row) => row.symbol),
      ...ASSERTS.filter((row) => row.via === ASSEMBLY_STEP).map((row) => row.symbol),
      ...DISCOVERY_EXEMPT.map((row) => row.symbol),
    ].sort();
    expect(discovered, 'the assembly step calls an imported symbol no roster or exempt row names')
      .toEqual(declared);
    expect(DISCOVERY_EXEMPT.every((row) => row.reason.length >= 40)).toBe(true);

    // (c) The rows one level down are called where the roster says they are.
    const coherence = bodyOf(NARRATIVE_FILE, 'generateCoherence');
    const misplaced = ROSTER
      .filter((row) => row.via === 'generateCoherence')
      .filter((row) => !called(coherence, row.symbol) && !called(bodyOf(NARRATIVE_FILE, 'enrichNpcCoherence'), row.symbol));
    expect(misplaced.map((row) => row.symbol), 'a roster row is not called where its `via` says').toEqual([]);

    // (d) THE ASSERT SURFACE, both directions: the two rows plus the declared exemption, and a
    // FOURTH assert appearing in that file reds by name.
    const assertsInFile = [...declaredSymbols(rawSource(RECONCILE_FILE)).keys()]
      .filter((symbol) => /^assert/.test(symbol)).sort();
    expect(assertsInFile, 'a new assert appeared in the reconciliation leaf, or one retired').toEqual(
      [...ASSERTS.map((row) => row.symbol), ...ASSERT_EXEMPT.map((row) => row.symbol)].sort(),
    );
    expect(ASSERT_EXEMPT.every((row) => row.reason.length >= 40)).toBe(true);
  });

  it('A4 — the six classes are total, and every MIRROR row is a measurement', () => {
    expect(CLASSES).toEqual(['producer', 'mutator', 'enricher', 'replay', 'mint', 'MIRROR']);
    const unclassed = ROSTER.filter((row) => !CLASSES.includes(row.cls));
    expect(unclassed.map((row) => row.symbol), 'a roster row carries a class outside the vocabulary').toEqual([]);

    // MIRROR is a MEASUREMENT, not prose: such a row's body consults no pin, so it always runs.
    const measuredMirrors = ROSTER
      .filter((row) => {
        const body = bodyOf(row.file, row.symbol);
        return body.length > 0 && !/\bchooseOrPin\b/.test(body) && !/__pins/.test(body);
      })
      .filter((row) => row.cls === 'MIRROR')
      .map((row) => row.symbol)
      .sort();
    const declaredMirrors = ROSTER.filter((row) => row.cls === 'MIRROR').map((row) => row.symbol).sort();
    // ANTI-VACUITY: there IS at least one MIRROR row, so the equality is not two empty sets.
    expect(declaredMirrors).toEqual(['relinkFactionMembers']);
    expect(measuredMirrors, 'a MIRROR row consults a pin, so it does not always run').toEqual(declaredMirrors);
  });

  it('A5 — the stream rule: exactly one function-level writer sits in its own named child stream', () => {
    const declaredNamed = ROSTER.filter((row) => row.stream === NAMED_CHILD).map((row) => row.symbol).sort();
    const narrative = source(NARRATIVE_FILE);

    // The ONE lawful skip, read from source: enrichNpcCoherence's own 'npc-enrichment' child.
    const enrichment = rawSource(NARRATIVE_FILE).match(/'npc-enrichment'/g) || [];
    expect(enrichment, 'the one named child stream label moved or multiplied').toHaveLength(1);
    const wrapper = /inCoherenceSubstream\(\s*coherenceRng,\s*\n?\s*'npc-enrichment'/.test(rawSource(NARRATIVE_FILE))
      || /inCoherenceSubstream\(\s*\n?\s*coherenceRng,\s*\n?\s*'npc-enrichment'/.test(rawSource(NARRATIVE_FILE));
    expect(wrapper, 'enrichNpcCoherence is no longer wrapped by its named child stream').toBe(true);
    expect(declaredNamed).toContain('enrichNpcCoherence');

    // Every OTHER held writer is SHARED-STREAM and therefore consumes and discards.
    const shared = ROSTER.filter((row) => row.stream === SHARED).map((row) => row.symbol).sort();
    expect(shared).toEqual([
      'ensureFactionStructuralNpcs', 'generateCoherence', 'generateSettlementName',
      'reconcilePowerStructure', 'relinkFactionMembers', 'resizePoliticalRoster',
    ]);
    // ⛔ generateSettlementName is the row this rule exists for: the mint draws on the assembly
    // step's own shared stream, so a held name is CONSUMED AND DISCARDED, never skipped.
    expect(ROSTER.find((row) => row.symbol === 'generateSettlementName').stream).toBe(SHARED);

    // THE OTHER NAMED-CHILD ROWS ARE INSIDE THAT ONE STREAM, not streams of their own: each is
    // called from `enrichNpcCoherence`'s own body, so they inherit its child stream.
    const inside = declaredNamed.filter((symbol) => symbol !== 'enrichNpcCoherence');
    const enrichmentBody = bodyOf(NARRATIVE_FILE, 'enrichNpcCoherence');
    expect(enrichmentBody.length, 'enrichNpcCoherence was not found: the claim below is vacuous').toBeGreaterThan(500);
    expect(inside.filter((symbol) => !called(enrichmentBody, symbol)),
      'a named-child row is not called from the one named child stream').toEqual([]);
    expect(inside).toEqual([
      'buildPoliticalNarrative', 'disperseNamedRoster', 'enrichNPCsWithStructure', 'mergeNPCLists',
    ]);

    // A SECOND named child stream around a held writer reds BY NAME: the substream label set is
    // held exact in both directions, and only `npc-enrichment` is declared over a held writer.
    const labels = [...rawSource(NARRATIVE_FILE)
      .matchAll(/inCoherenceSubstream\(\s*\n?\s*[A-Za-z_$][\w$]*,\s*\n?\s*'([^']+)'/g)]
      .map((match) => match[1]).sort();
    expect(labels, 'a coherence substream label appeared or retired').toEqual(SUBSTREAM_LABELS);
    expect(labels.filter((label) => label === HELD_WRITER_STREAM)).toHaveLength(1);

    // The STEP-level family is skippable through the runner's own fork-by-name, read from source.
    const runner = source(RUNNER_FILE);
    expect(runner, 'the runner no longer forks a named child stream per step').toMatch(/rng\.fork\(name\)/);
  });

  it('A6 — the clone is at the runner, once, and the two local clones are retired', () => {
    const runner = source(RUNNER_FILE);
    const institutions = source(INSTITUTION_STEP_FILE);
    const power = source(POWER_STEP_FILE);

    // POSITIVE CONTROL, FIRST: the runner really does carry the clone, on both channels and at
    // the merge, so the zeros below are a measurement and not an empty read.
    const runnerClones = runner.match(/structuredClone\(/g) || [];
    expect(runnerClones.length, 'the runner carries no clone at all: the zeros below prove nothing')
      .toBeGreaterThanOrEqual(2);
    expect(runner).toMatch(/\[_PINS_KEY\]:\s*pins/);
    expect(runner).toMatch(/\.\.\.structuredClone\(pins\)/);
    // THE NAMED REFUSAL is a string LITERAL, so it is read from RAW source: `codeOnly` blanks a
    // literal's contents by design, which is why the code claims above read the stripped text and
    // this one does not.
    expect(rawSource(RUNNER_FILE)).toMatch(/must be structured-cloneable/);

    // THE PRIMITIVE IS UNTOUCHED: `chooseOrPin` still clones nothing.
    const primitive = bodyOf(RUNNER_FILE, 'chooseOrPin');
    expect(primitive.length, 'chooseOrPin was not found, so the claim below is vacuous').toBeGreaterThan(0);
    // anchored: the line above proves the primitive resolves and is non-empty, so this zero is a
    // property of ITS body and not of a symbol that vanished.
    expect(primitive.match(/structuredClone\(/g)).toBeNull();

    // THE TWO STEP FILES CARRY ZERO. This is the counterforce arm: against the pre-member tree
    // these two files carry FIVE between them, so a member that unwrapped nothing reds here.
    // anchored: both files are read above and each is a live non-empty module (their own
    // registrations are asserted below), so an empty match is a retirement, not a lost file.
    expect(institutions.match(/structuredClone\(/g)).toBeNull();
    // anchored: as the line above, for the power step's two retired wrappers.
    expect(power.match(/structuredClone\(/g)).toBeNull();
    expect(institutions).toMatch(/registerStep\(/);
    expect(power).toMatch(/registerStep\(/);
  });

  it('A7 — the SAVED-ONLY keys with writers: every one RE-DERIVED from source, both directions (U62, NOTE-14)', () => {
    // THE DENOMINATOR IS REFUSED FIRST. An empty file walk or an empty key set would make every
    // equality below two empty sets, which is the way a census goes vacuously green.
    const modules = srcFiles();
    expect(modules.length, 'the src/ walk found no modules: every equality below would be vacuous')
      .toBeGreaterThan(500);
    expect(WRITTEN_KEYS, 'the roster governs the editor\'s two keys and NOTE-14\'s third')
      .toEqual(['decrees', 'dmLayer', 'peaceOffers']);

    // THE ROSTER IS TIED TO THE REGISTER IT LIVES IN: every governed key is SAVED-ONLY and carries
    // a class, so a reclassification cannot leave this roster pointing at a key that moved out.
    const misfiled = WRITTEN_KEYS.filter((key) => !SAVED_ONLY_KEYS.includes(key) || !(key in RECORD_CLASSES));
    expect(misfiled, `a governed key left the saved-only class or lost its class row:\n${misfiled.join('\n')}`).toEqual([]);

    // ⛔ THE COMPUTED SCANNER'S POSITIVE CONTROL, BEFORE THE EQUALITY THAT DEPENDS ON IT. NOTE-14's
    // key is written only through a constant, so a scanner that resolved none would report those
    // two writers missing rather than report that it had gone blind.
    const constants = keyConstants();
    expect([...constants.entries()].sort(), 'the key constants the computed scanner resolves')
      .toEqual([['PEACE_OFFER_KEY', 'peaceOffers']]);

    // (a) BOTH DIRECTIONS over the SITES. Every site the scanner finds is a declared writer or a
    // declared non-writer, and every declared row resolves to a site that exists.
    const derived = savedKeySites();
    const declared = [
      ...SAVED_KEY_WRITERS.map((row) => `${row.key}|${row.file}|${row.symbol}|${row.spelling}`),
      ...SAVED_KEY_NON_WRITERS.map((row) => row.id),
    ].sort();
    expect(sorted(new Set(declared)), 'a declared id is spelled twice').toEqual(declared);
    expect(sorted(derived.keys()),
      'a site naming a governed key is declared by no writer and no non-writer row, or a declared'
      + ' row names a site the tree no longer carries. Add the writer to SAVED_KEY_WRITERS in the'
      + ' record register, or the non-writer here WITH ITS REASON — never widen the scan.')
      .toEqual(declared);

    // (b) THE WRITER COUNTS ARE THE CLAIM'S SECOND HALF. A symbol that gains or loses a write site
    // keeps its id, so without this the undo path's three branches could collapse into one.
    const countFaults = SAVED_KEY_WRITERS
      .filter((row) => derived.get(`${row.key}|${row.file}|${row.symbol}|${row.spelling}`) !== row.sites)
      .map((row) => `${row.file} :: ${row.symbol} writes ${row.key} at `
        + `${derived.get(`${row.key}|${row.file}|${row.symbol}|${row.spelling}`)} site(s), not the declared ${row.sites}`);
    expect(countFaults, `a declared writer's site count moved:\n${countFaults.join('\n')}`).toEqual([]);

    // (c) THE MEASUREMENT IS NOT ONE-SIDED. Both keys really are written, in more than one file,
    // which is the fact the cured claim exists to carry: the row it closes named ONE writer each.
    expect(SAVED_KEY_WRITERS.length, 'the roster is empty').toBeGreaterThan(0);
    const writerFiles = sorted(new Set(SAVED_KEY_WRITERS.map((row) => row.file)));
    expect(writerFiles, 'the governed keys are written from four homes, not one').toEqual([
      'src/domain/worldPulse/decreeHook.js',
      'src/domain/worldPulse/peaceTermsDrafting.js',
      'src/store/campaignWorldPulseDeferred.js',
      'src/store/editSlice.js',
    ]);
    const totalSites = SAVED_KEY_WRITERS.reduce((sum, row) => sum + row.sites, 0);
    expect(totalSites, 'the measured write sites of the governed keys').toBe(10);

    // (c2) ⭐ NOTE-14's SECOND MEASUREMENT: a DECLARED writer is not a LIVE one. `reachedFromSrc`
    // is re-derived from the call graph, so the register can never imply that `peaceOffers` is
    // live saved state while nothing in src/ calls the two functions that would write it.
    const counts = callCounts(SAVED_KEY_WRITERS.map((row) => row.symbol));
    const reachFaults = SAVED_KEY_WRITERS
      .filter((row) => (counts.get(row.symbol) > 0) !== row.reachedFromSrc)
      .map((row) => `${row.file} :: ${row.symbol} is called ${counts.get(row.symbol)} time(s) in src/,`
        + ` which contradicts reachedFromSrc: ${row.reachedFromSrc}`);
    expect(reachFaults, `a declared writer's reach moved:\n${reachFaults.join('\n')}`).toEqual([]);
    // anchored: the roster is asserted non-empty above, so this partition is over real rows — and
    // BOTH sides are non-empty, which is what makes the predicate a discriminating one.
    expect(SAVED_KEY_WRITERS.filter((row) => row.reachedFromSrc === false).map((row) => row.symbol).sort(),
      'NOTE-14\'s two writers are the whole of the unreached set').toEqual(['withPeaceOffer', 'withoutPeaceOffer']);
    expect(SAVED_KEY_WRITERS.filter((row) => row.reachedFromSrc === true).length,
      'every other writer is reached from src/').toBe(6);

    // (d) EVERY NON-WRITER CARRIES A WRITTEN REASON, so the exempt table cannot become a silent
    // allow-list. anchored: the table is asserted non-empty first, so this is not a vacuous every.
    expect(SAVED_KEY_NON_WRITERS.length, 'the non-writer table is empty').toBeGreaterThan(0);
    expect(SAVED_KEY_NON_WRITERS.every((row) => row.reason.length >= 40)).toBe(true);
  });
});
