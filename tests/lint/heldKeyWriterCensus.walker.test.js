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
 * 6.  THE THREE HELD-BUT-SAVED-ONLY KEYS are asserted EXCLUDED, never observed. Generation writes
 *     none of `neighbourNetwork`, `interSettlementRelationships` or `crossSettlementConflicts`; the
 *     arm that watches them over a real save then load is EM-R7's.
 * 7.  A6 READS THE THREE `src/` FILES' TEXT. It proves WHERE the clone is spelled, not that the
 *     runtime took it; `tests/generators/pipelinePinnedMode.test.js`'s A7 and A8 are the executed
 *     halves and this arm is their source-level counterpart.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { RECORD_CLASSES, SAVED_ONLY_KEYS } from '../../src/domain/edit/recordRegister.js';
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
    expect(savedOnlyHeld).toEqual(['crossSettlementConflicts', 'interSettlementRelationships', 'neighbourNetwork']);
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
});
