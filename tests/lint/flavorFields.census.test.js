/**
 * flavorFields.census.test.js — THE FLAVOR CENSUS (EM-A3, wave 1). For every row of the
 * editable-field declaration table it proves that a `free` field has zero derivation
 * readers by BOTH halves, and that a field the rename cascade joins on is declared
 * `free-cascade`, never `free`.
 *
 * THE TWO HALVES, AND WHY NEITHER ALONE IS THE INSTRUMENT.
 *
 *   VALUE JOINS. A field whose stored path is a declared KEY surface of the rename
 *   cascade can never be plain `free`: renaming its value must cascade. The four
 *   denominators are read by LIVE IMPORT from the cascade module itself
 *   (`src/domain/factionRename.js :: FACTION_RENAME_SURFACES`, `:: NPC_RENAME_SURFACES`,
 *   `:: NON_CASCADED_SURFACES`, `:: NPC_NON_CASCADED_SURFACES`); no path is re-spelled
 *   here, and nothing is sorted or normalised beyond the exact `[]` spelling the module
 *   uses. `kind: 'prose'` surfaces are EXCLUDED from the join predicate by design: a
 *   prose surface is a substitution target, not an exact-key join, and the two carry
 *   different risks (the cascade module's own `kind` docblock).
 *
 *   PROPERTY READS — THE RECEIVER-SHAPE PREDICATE (judgment 157d). The census pairs each
 *   free key with its RECEIVER SHAPE through the estate's own exported scanner
 *   (`scripts/lib/writer-reach-scan.mjs :: scanSurfaceReads`), keyed by the estate's ONE
 *   identity spelling (`:: writerIdentity`), over a corpus built by the CHEAP folder
 *   (`scripts/lib/observed-shape-corpus.mjs :: foldCorpus`) carrying an EXPLICIT
 *   `rootShapes`. The FULL tree is indexed and only the three ruled roots are inspected:
 *   `scanSurfaceReads` takes `index` and `files` as separate parameters for exactly that,
 *   because a generator receiver grounds only through call sites that may live elsewhere.
 *
 * ⛔ `rootShapes` IS THE DIFFERENCE BETWEEN A PROOF AND A SILENT ALL-CLEAR. `foldCorpus`
 * emits no such key and the resolver's parameter defaults to an empty list, so a census
 * that forgot it would ground NOTHING and report an empty `R` that is indistinguishable
 * from a clean tree. Case A4's planted split probe asserts `stats.rGrades > 0`, which is
 * the only assertion that can tell those two worlds apart.
 *
 * ⛔ THE REACH THIS CENSUS MAY CLAIM, STATED ONCE AND NEVER OVERSTATED. `R` is the legacy
 * resolver's grounding, and that resolver reaches part of the corpus by its own header's
 * measurement. AN EMPTY `R` THEREFORE PROVES ZERO GROUNDED READS, NEVER ZERO READS. The
 * second claim — that no ungrounded read of a free key under the three roots is a read of
 * one of these records — is carried by case A7's key-level site roster and by the written
 * declaration beside each of its rows, because no resolver can prove that negative for an
 * ungrounded receiver. The `N` grade is a per-FILE set and cannot serve as that roster.
 *
 * ⛔ NEITHER REGISTER BASELINE IS READ, and no writing door of either is ever called: a
 * census that re-freezes a baseline to make itself green has inverted the instrument.
 */
import { readdirSync, statSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import ts from 'typescript';
import {
  buildIndex, keysToShapesOf, scanSurfaceReads, writerIdentity, isWriteTarget, MIN_ROWS,
} from '../../scripts/lib/writer-reach-scan.mjs';
import { foldCorpus } from '../../scripts/lib/observed-shape-corpus.mjs';
import { sourceFiles } from '../../scripts/check-observed-shape-readers.mjs';
import { FIELD_DECLARATIONS } from '../../src/domain/edit/fieldDeclarations.js';
import {
  FACTION_RENAME_SURFACES, NPC_RENAME_SURFACES,
  NON_CASCADED_SURFACES, NPC_NON_CASCADED_SURFACES,
} from '../../src/domain/factionRename.js';

/** The repository root, derived from this module rather than from the working directory. */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SELF_REL = relative(ROOT, fileURLToPath(import.meta.url)).split('\\').join('/');

/**
 * THE SCAN SCOPE (judgment 157b). FIVE roots, and the last three are FILES.
 *
 * ⭐ THE FOURTH ROOT IS RE-ADDED, AND THE MEASUREMENT THAT DROPPED IT IS KEPT RATHER THAN
 * DELETED. The governing document named `src/domain/edit/guards*`. When this census landed
 * (EM-A3, wave 1) the pattern `/(^|\/)guard[A-Za-z]*\.js$/` matched ZERO files anywhere
 * under `src/`, and a root resolving to an empty set would make case A4's own fence red on
 * its own contract — so the root was dropped with the measurement written down for a later
 * lane. THAT LANE IS EM-C3 (wave 2): the pattern now matches TWO files, EM-C2's guard engine
 * `src/domain/edit/guards.js` and EM-C3's rule set `src/domain/edit/guardRules.js`, both of
 * which exist at this member's landing commit, so A4's empty-root fence is satisfied.
 *
 * ⛔ `filesUnder` TAKES A DIRECTORY OR A FILE AND APPLIES NO GLOB, so the fourth root is
 * spelled as the two FILE roots themselves rather than as the document's pattern. A third
 * guard-named leaf would need its own row here; that is the price of a glob-free walk and it
 * is cheaper than a pattern nobody can read off the scanned set.
 *
 * ⛔ AND THE CENSUS'S CLAIM DOES NOT MOVE, MEASURED RATHER THAN ASSUMED: `freeRows()` filters
 * `kind === 'free'`, which at this tip is exactly `institution.note` and `npc.note`, and
 * NEITHER new root spells `note` at all (0 and 0 over the raw bytes). `guardRules.js`'s
 * `.name` reads are `institutions[].name` — a `free-cascade` row this census does not govern.
 */
const SCAN_ROOTS = Object.freeze([
  'src/generators',
  'src/domain/worldPulse',
  'src/domain/causalState.js',
  'src/domain/edit/guards.js',
  'src/domain/edit/guardRules.js',
]);

/** The declared root shape the resolver grounds a receiver through. */
const ROOT_SHAPE = 'settlement';

/**
 * The census states its own row floor rather than defaulting silently. The estate's
 * `MIN_ROWS` is the floor for a REAL corpus of generated settlements; this census folds a
 * small synthetic corpus, so its floor is one row and the relation between the two is
 * asserted in case A4.
 */
const MIN_ROWS_HERE = 1;

/** How many synthetic settlement observations the folded corpus carries. */
const OBSERVATION_COUNT = 8;

/**
 * THE DECOY TABLE — frozen, keyed by FILE and RECEIVER NAME and never by line. Every row
 * is a read of a free key on a receiver that is not one of these records, and the `why` is
 * the evidence for that, because no resolver can prove the negative for an ungrounded
 * receiver. A table keyed by `path:line` would make every future line shift in the scanned
 * roots a re-address this census owes on files it does not own; keyed this way a SEVENTH
 * site reds BY NAME when its receiver is new and by COUNT when it is not.
 */
const DECOY_RECEIVERS = Object.freeze([
  Object.freeze({
    file: 'src/domain/worldPulse/partyImpact.js',
    receiver: 'action',
    occurrences: 3,
    why: 'a pulse ACTION record\'s own annotation, built and consumed inside the party-impact fold',
  }),
  Object.freeze({
    file: 'src/domain/worldPulse/warReasons.js',
    receiver: 'demoTerms',
    occurrences: 1,
    why: 'a demand-terms value object assembled for a war reason, never a record on the settlement',
  }),
  Object.freeze({
    file: 'src/generators/economy/viability.js',
    receiver: 'water',
    occurrences: 1,
    why: 'the water-access verdict\'s own note, interpolated into a viability description',
  }),
  Object.freeze({
    file: 'src/generators/npcGenerator.js',
    receiver: 'override',
    occurrences: 2,
    why: 'a CALLER-SUPPLIED override bag read before an npc exists; the write target is a separate key',
  }),
  Object.freeze({
    file: 'src/generators/structuralValidator.js',
    receiver: 'entry',
    occurrences: 1,
    why: 'a validator ENTRY being normalised, not one of these records',
  }),
]);

/** The SITE and OCCURRENCE totals the roster asserts beside its rows. */
const DECOY_SITE_TOTAL = 6;
const DECOY_OCCURRENCE_TOTAL = 8;

/**
 * THE MEASURED DORMANCY SPLIT. Which card types carry a `free` row is a CLAIM about the
 * declaration table, not a recomputation of it: a card that changes side reds case A2 BY
 * NAME. Recomputing the split from the same table it is asserted over would make the
 * dormancy arm true by construction and prove nothing.
 */
const CARDS_WITHOUT_FREE = Object.freeze(['faction', 'powerSeat', 'worldFact']);
const CARDS_WITH_FREE = Object.freeze(['institution', 'npc']);

/**
 * ⭐⭐ EM-F3: THIS CENSUS'S POPULATION IS A FREE FIELD OF A CARD OF THE RECORD, AND THAT WAS
 * ALWAYS ITS SUBJECT — it is stated here because a fourth provenance now makes the boundary
 * visible instead of accidental. Both halves of the census ask a question ABOUT THE RECORD: the
 * value-join half asks whether the field's key is a declared cascade surface of a stored path,
 * and the receiver-shape half grounds reads of the key ON ITS CARD'S STORED SHAPE. A `dm` row
 * declares a field of a DM-MINTED ENTITY (design §2.8's phantom counterparty, which is a SAVE OF
 * ITS OWN), so its card has no stored shape, no array home and no key on the record at all —
 * `shapeOf` answers null for it, which is the measurement rather than a gap. Asking either half
 * about it would not be a weaker claim, it would be a question with no subject.
 *
 * ⛔ IT IS AN EXCLUSION BY PROVENANCE AND BY NOTHING ELSE, and case A2 asserts the excluded set
 * is EXACTLY the `dm` rows, that each still carries its own non-blank proof, and that not one of
 * them carries an `outputKey` — which is what makes "no key on the record" a fact this file
 * measured rather than a claim it accepted.
 */
const CENSUSED_PROVENANCES = Object.freeze(['root', 'world-fact', 'annotation']);
const isOfTheRecord = (row) => CENSUSED_PROVENANCES.includes(row.provenance);

/**
 * THE ONE NAMED EXCEPTION, in the estate's own landed spelling
 * (`tests/domain/editDeclarations.test.js :: shapeOffenders`): a `free-cascade` row whose
 * cascade a later member mints. It is not a silencer — case A1 asserts the exception still
 * names a live `free-cascade` row, so a stale exception reds rather than hiding.
 */
const NAMED_CASCADE_EXCEPTIONS = Object.freeze(['institutions[].name']);

/**
 * THE MIRROR HOMES. A card's records also live under these containers. Each one is proved
 * in case A4 to be a real container of a declared cascade path, so a hand-written spelling
 * cannot enter here unchallenged.
 */
const MIRROR_HOMES = Object.freeze({
  npc: Object.freeze(['factions[].members[]']),
  faction: Object.freeze(['factions[]']),
});

/** Every declaration row of the live table, in AUTHORED order. Nothing is sorted. */
function declarationRows() {
  const rows = [];
  for (const cardRows of Object.values(FIELD_DECLARATIONS)) {
    for (const row of cardRows) rows.push(row);
  }
  return rows;
}

/** One row's address, for a message a reader can act on. */
function addressOf(row) {
  return `${row.card}.${row.field}`;
}

/** The container a declared stored path lives under: the path without its final key. */
function containerOf(path) {
  const cut = path.lastIndexOf('.');
  return cut < 0 ? '' : path.slice(0, cut);
}

/** Every declared cascade surface, both denominators, in their authored order. */
function cascadeSurfaces() {
  return [...FACTION_RENAME_SURFACES, ...NPC_RENAME_SURFACES];
}

/** The declared KEY paths only: a `prose` surface is a substitution target, not a join. */
function cascadeKeyPaths() {
  return new Set(cascadeSurfaces().filter((row) => row.kind === 'key').map((row) => row.path));
}

/** The written exclusions, both ledgers. A path here is a RULING, not a miss. */
function ruledOutSurfaces() {
  return [...NON_CASCADED_SURFACES, ...NPC_NON_CASCADED_SURFACES];
}

/**
 * The stored path family of one row, built from the DECLARED homes: the containers this
 * card's own declared output keys live under, plus the card's mirror homes.
 */
function storedPathsOf(card, field) {
  const homes = new Set();
  for (const row of FIELD_DECLARATIONS[card] ?? []) {
    if (typeof row.outputKey === 'string' && row.outputKey.length > 0) homes.add(containerOf(row.outputKey));
  }
  for (const mirror of MIRROR_HOMES[card] ?? []) homes.add(mirror);
  return [...homes].filter((home) => home.length > 0).map((home) => `${home}.${field}`);
}

/** The card's stored SHAPE, derived from the same declared homes the paths come from. */
function shapeOf(card) {
  for (const row of FIELD_DECLARATIONS[card] ?? []) {
    if (typeof row.outputKey === 'string' && row.outputKey.length > 0) {
      const container = containerOf(row.outputKey);
      const last = container.split('.').pop();
      if (last.endsWith('[]')) return last.slice(0, -2);
    }
  }
  return null;
}

/**
 * THE VALUE-JOIN PREDICATE, as a function the live arm and its guard-the-guard control both
 * drive. A control that re-implements the predicate proves nothing about the predicate.
 *
 * @param {ReadonlyArray<object>} rows declaration rows to classify
 * @returns {{ offenders: string[], joined: string[] }}
 */
function classifyJoins(rows) {
  const keyPaths = cascadeKeyPaths();
  const offenders = [];
  const joined = [];
  for (const row of rows) {
    const paths = storedPathsOf(row.card, row.field);
    const hit = paths.find((path) => keyPaths.has(path)) ?? null;
    if (hit !== null) {
      joined.push(addressOf(row));
      if (row.kind === 'free') {
        offenders.push(`${addressOf(row)} is declared 'free' but ${hit} is a declared cascade KEY surface`);
      }
      if (row.kind === 'pool') {
        offenders.push(`${addressOf(row)} is declared 'pool' but ${hit} is a declared cascade KEY surface`);
      }
    } else if (row.kind === 'free-cascade' && !NAMED_CASCADE_EXCEPTIONS.includes(row.outputKey)) {
      offenders.push(`${addressOf(row)} is declared 'free-cascade' but no declared cascade KEY surface`
        + ` matches any of ${JSON.stringify(paths)}`);
    }
  }
  return { offenders, joined };
}

/** The walk accepts a FILE root as well as a directory root (judgment 157b). */
function filesUnder(root) {
  const absolute = join(ROOT, root);
  if (!statSync(absolute).isDirectory()) return /\.jsx?$/.test(absolute) ? [absolute] : [];
  const out = [];
  const descend = (directory) => {
    for (const entry of readdirSync(directory)) {
      const candidate = join(directory, entry);
      if (statSync(candidate).isDirectory()) descend(candidate);
      else if (/\.jsx?$/.test(candidate)) out.push(candidate);
    }
  };
  descend(absolute);
  return out.sort();
}

/** Every `kind: 'free'` row of the live table that is a field OF THE RECORD (see above). */
function freeRows() {
  return declarationRows().filter((row) => row.kind === 'free' && isOfTheRecord(row));
}

/**
 * The synthetic corpus, DERIVED from the declaration table rather than hand-written: one
 * record per card that carries a free row, holding that card's own declared field names.
 */
function syntheticObservations() {
  const out = [];
  for (let nth = 0; nth < OBSERVATION_COUNT; nth += 1) {
    const value = {};
    for (const row of freeRows()) {
      const shape = shapeOf(row.card);
      if (shape === null) continue;
      const records = [];
      for (const member of ['a', 'b']) {
        const record = {};
        for (const sibling of FIELD_DECLARATIONS[row.card]) record[sibling.field] = `${sibling.field}-${nth}-${member}`;
        records.push(record);
      }
      value[shape] = records;
    }
    out.push({ name: ROOT_SHAPE, value });
  }
  return out;
}

/** The folded corpus with its EXPLICIT root shapes. */
function buildCorpus() {
  const corpus = foldCorpus(syntheticObservations());
  corpus.rootShapes = [ROOT_SHAPE];
  return corpus;
}

/** @type {{ reads: Map<string, {R: Set<string>, N: Set<string>}>, stats: object, files: string[], indexed: number } | null} */
let liveScanCache = null;

/** The live scan, run ONCE: the FULL tree indexed, only the three roots inspected. */
function liveScan() {
  if (liveScanCache !== null) return liveScanCache;
  const corpus = buildCorpus();
  const keysToShapes = keysToShapesOf(corpus, MIN_ROWS_HERE);
  const files = SCAN_ROOTS.flatMap(filesUnder);
  const indexInputs = [...new Set([...sourceFiles(ROOT), ...files])];
  const index = buildIndex(indexInputs);
  const { reads, stats } = scanSurfaceReads({
    index, corpus, files, root: ROOT, minRows: MIN_ROWS_HERE, keysToShapes,
  });
  liveScanCache = { reads, stats, files, indexed: indexInputs.length, index };
  return liveScanCache;
}

/**
 * ARM 2's KEY-LEVEL SITE ROSTER, taken with the estate's own parse (through `buildIndex`)
 * and the estate's own write-target test, over the same three roots. The two
 * receiver-bearing site kinds are counted: property access and string element access.
 * A destructuring or `in` site carries no receiver the resolver can ground and is `N` only
 * by the scanner's own construction, so it is not a roster row.
 *
 * @returns {{ rows: Map<string, {file: string, receiver: string, lines: number[], occurrences: number}>, kinds: Set<string> }}
 */
function siteRoster() {
  const { files, index } = liveScan();
  const keys = new Set(freeRows().map((row) => row.field));
  const rows = new Map();
  const kinds = new Set();
  for (const file of files) {
    const source = index.sources.get(file);
    if (source === undefined) continue;
    const rel = relative(ROOT, file).split('\\').join('/');
    const visit = (node) => {
      let key = null;
      let receiver = null;
      let kind = null;
      if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) {
        key = node.name.text;
        receiver = node.expression;
        kind = 'property-access';
      } else if (ts.isElementAccessExpression(node) && node.argumentExpression
        && ts.isStringLiteralLike(node.argumentExpression)) {
        key = node.argumentExpression.text;
        receiver = node.expression;
        kind = 'element-access';
      }
      if (key !== null && keys.has(key) && !isWriteTarget(node)) {
        kinds.add(kind);
        const text = receiver.getText(source);
        const rowKey = `${rel} :: ${text}`;
        let row = rows.get(rowKey);
        if (row === undefined) {
          row = { file: rel, receiver: text, lines: [], occurrences: 0 };
          rows.set(rowKey, row);
        }
        row.lines.push(source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1);
        row.occurrences += 1;
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return { rows, kinds };
}

/**
 * THE PLANTED SPLIT PROBE (case A4's positive control). Decoys in one planted file and one
 * grounded read in another, written ONLY into a fresh temporary directory and never into
 * the tree. It replaces a live control that was refuted by measurement: a planted control
 * cannot rot, and it exercises the discrimination the whole property-read arm rests on.
 */
function splitProbe() {
  const corpus = buildCorpus();
  const keysToShapes = keysToShapesOf(corpus, MIN_ROWS_HERE);
  const directory = mkdtempSync(join(tmpdir(), 'flavor-census-split-'));
  const decoyFile = join(directory, 'decoys.js');
  const realFile = join(directory, 'real.js');
  const keys = freeRows().map((row) => row.field);
  const decoyLines = DECOY_RECEIVERS.map((decoy, nth) => {
    const key = keys[nth % keys.length];
    return `  out.push(${decoy.receiver}.${key});`;
  }).join('\n');
  const decoyParams = DECOY_RECEIVERS.map((decoy) => decoy.receiver).join(', ');
  writeFileSync(decoyFile, `export function decoyReads(${decoyParams}) {\n`
    + '  const out = [];\n'
    + `${decoyLines}\n`
    + '  return out;\n}\n', 'utf8');
  const realLines = freeRows().map((row) => {
    const shape = shapeOf(row.card);
    return `  out.push(${ROOT_SHAPE}.${shape}[0].${row.field});`;
  }).join('\n');
  writeFileSync(realFile, `export function realReads(${ROOT_SHAPE}) {\n`
    + '  const out = [];\n'
    + `${realLines}\n`
    + '  return out;\n}\n', 'utf8');
  const files = [decoyFile, realFile];
  const index = buildIndex([...files]);
  const { reads, stats } = scanSurfaceReads({
    index, corpus, files, root: directory, minRows: MIN_ROWS_HERE, keysToShapes,
  });
  // The scan records every file RELATIVE to the root it was given, so the control compares
  // against the same spelling rather than against the absolute path it planted.
  return { reads, stats, decoy: relative(directory, decoyFile), real: relative(directory, realFile) };
}

/** The identity a free row is scanned under, in the estate's ONE identity spelling. */
function identityOf(row) {
  return writerIdentity(row.field, shapeOf(row.card));
}

describe('EM-A3 — the flavor census: a free field has zero derivation readers, by both halves', () => {
  test('A1 — every row joining the rename cascade is free-cascade, and no free or pool row joins', () => {
    const { offenders, joined } = classifyJoins(declarationRows());
    expect(
      offenders,
      'a declared cascade KEY surface makes its field a join key: it is free-cascade, never free and'
      + ' never pool, and a free-cascade row without a cascade is a claim the tree does not carry.'
      + ` Offenders:\n${offenders.join('\n')}`,
    ).toEqual([]);
    expect(joined.length, 'no declaration row was classified JOINING, so this arm proved nothing').toBeGreaterThan(0);

    const liveExceptions = declarationRows()
      .filter((row) => row.kind === 'free-cascade' && NAMED_CASCADE_EXCEPTIONS.includes(row.outputKey))
      .map((row) => row.outputKey);
    expect(
      NAMED_CASCADE_EXCEPTIONS.filter((outputKey) => !liveExceptions.includes(outputKey)),
      'a named cascade exception that names no live free-cascade row is a dead letter, and a dead'
      + ' letter in an exception list is how a guard is silenced without anyone deciding to',
    ).toEqual([]);
  });

  test('A2 — a card with no free row runs both halves and reports nothing, over a non-empty denominator', () => {
    const censused = (rows) => rows.filter(isOfTheRecord);
    const measuredWithout = Object.keys(FIELD_DECLARATIONS)
      .filter((card) => censused(FIELD_DECLARATIONS[card] ?? []).length > 0
        && censused(FIELD_DECLARATIONS[card] ?? []).every((row) => row.kind !== 'free')).sort();
    const measuredWith = Object.keys(FIELD_DECLARATIONS)
      .filter((card) => censused(FIELD_DECLARATIONS[card] ?? []).some((row) => row.kind === 'free')).sort();

    // ⭐ EM-F3's BOUNDARY, MEASURED IN BOTH DIRECTIONS before it is used. The rows this census
    // does not govern are EXACTLY the `dm` rows; every one of them carries its own non-blank
    // proof, and not one carries an `outputKey` — so "no key on the record" is a fact read off
    // the table here rather than a claim the exclusion above asks anyone to take on trust.
    const outside = declarationRows().filter((row) => !isOfTheRecord(row));
    expect(outside.map((row) => row.provenance), 'the excluded rows are exactly the dm rows')
      .toEqual(outside.map(() => 'dm'));
    expect(outside.length, 'nothing is excluded, so the boundary below is vacuous').toBeGreaterThan(0);
    expect(outside.filter((row) => Object.hasOwn(row, 'outputKey')),
      'an excluded row with an outputKey would be a key on the record this census stopped watching')
      .toEqual([]);
    expect(outside.filter((row) => row.kind === 'free'
      && (typeof row.readersProof !== 'string' || row.readersProof.trim().length === 0)),
      'and every excluded free row still names the instrument that grounded ITS OWN value').toEqual([]);
    expect(
      measuredWith,
      'a card type changed side: the declaration table now carries free rows on a different set of'
      + ' cards than this census was measured against, and the dormancy claim below is about the old set',
    ).toEqual([...CARDS_WITH_FREE].sort());
    expect(
      measuredWithout,
      'a card type changed side: a card counted as carrying no free row now carries one, or the reverse',
    ).toEqual([...CARDS_WITHOUT_FREE].sort());
    expect(measuredWithout.length, 'no card type lacks a free row, so this dormancy arm has no subject').toBeGreaterThan(0);
    expect(measuredWith.length, 'no card type carries a free row, so the whole census would be vacuous').toBeGreaterThan(0);

    const reported = [];
    for (const card of CARDS_WITHOUT_FREE) {
      const rows = FIELD_DECLARATIONS[card] ?? [];
      expect(rows.length, `the dormant card ${card} declares nothing, so running both halves over it is vacuous`).toBeGreaterThan(0);
      const { offenders } = classifyJoins(rows);
      for (const offender of offenders) reported.push(offender);
      // A card whose records live under no array home has no stored SHAPE, so the
      // receiver-shape half has nothing to ground there and says so rather than guessing.
      const shape = shapeOf(card);
      for (const row of rows) {
        if (shape === null) continue;
        const entry = liveScan().reads.get(writerIdentity(row.field, shape));
        if (entry !== undefined && entry.R.size > 0 && row.kind === 'free') {
          reported.push(`${addressOf(row)} is free on a dormant card and is GROUNDED in ${JSON.stringify([...entry.R])}`);
        }
      }
    }
    expect(reported, `a dormant card reported something:\n${reported.join('\n')}`).toEqual([]);

    const { stats } = liveScan();
    expect(stats.files, 'the property-read half inspected nothing, so the dormancy above is vacuous').toBeGreaterThan(0);
  });

  test('A3 — GUARD-THE-GUARD: a free row planted on a declared cascade key REDS, naming the row and the path', () => {
    const carrier = declarationRows().find((row) => row.kind === 'free-cascade' && classifyJoins([row]).joined.length === 1);
    expect(carrier, 'no joining row exists to plant on, so this control could not be built').toBeTruthy();
    const planted = { ...carrier, kind: 'free' };
    const { offenders, joined } = classifyJoins([planted]);
    expect(joined).toEqual([addressOf(planted)]);
    expect(offenders.length, 'the planted free row on a cascade key was not convicted').toBe(1);
    expect(offenders[0]).toContain(addressOf(planted));
    const hit = storedPathsOf(planted.card, planted.field).find((path) => cascadeKeyPaths().has(path));
    expect(offenders[0]).toContain(hit);

    const pooled = { ...carrier, kind: 'pool' };
    expect(classifyJoins([pooled]).offenders.length, 'a pooled join key is a cascade miss too').toBe(1);
    const cured = { ...carrier, kind: 'free-cascade' };
    expect(classifyJoins([cured]).offenders, 'the cured form must clear the same predicate').toEqual([]);
  });

  test('A4 — the anti-vacuity fence and the planted SPLIT PROBE: the resolver really discriminates', () => {
    expect(FACTION_RENAME_SURFACES.length, 'the faction cascade denominator is empty').toBeGreaterThan(0);
    expect(NPC_RENAME_SURFACES.length, 'the npc cascade denominator is empty').toBeGreaterThan(0);
    expect(ruledOutSurfaces().length, 'the written-exclusion ledgers are empty').toBeGreaterThan(0);
    const withoutWhy = ruledOutSurfaces().filter((row) => typeof row.why !== 'string' || row.why.length === 0);
    expect(withoutWhy.map((row) => row.path), 'a written exclusion without a reason is not a ruling').toEqual([]);
    const keyPaths = cascadeKeyPaths();
    const contradictions = ruledOutSurfaces().filter((row) => keyPaths.has(row.path)).map((row) => row.path);
    expect(contradictions, 'a path cannot be both a declared cascade KEY and a written exclusion').toEqual([]);

    expect(classifyJoins(declarationRows()).joined.length, 'no row classified JOINING').toBeGreaterThan(0);

    const cascadeContainers = new Set(cascadeSurfaces().map((row) => containerOf(row.path)));
    const inventedHomes = Object.values(MIRROR_HOMES).flat().filter((home) => !cascadeContainers.has(home));
    expect(inventedHomes, 'a mirror home that no declared cascade path lives under is a hand-written spelling').toEqual([]);

    const emptyRoots = SCAN_ROOTS.filter((root) => filesUnder(root).length === 0);
    expect(emptyRoots, 'a scan root that resolves to no file makes every arm over it vacuous').toEqual([]);
    const { stats, files, indexed } = liveScan();
    expect(stats.files, 'the scan inspected a different population than the roots hold').toBe(files.length);
    expect(indexed, 'the index is not wider than the inspected set, so a receiver could not ground').toBeGreaterThan(files.length);
    expect(MIN_ROWS, 'the estate floor is stated so this census cannot default to it silently').toBeGreaterThan(MIN_ROWS_HERE);

    const probe = splitProbe();
    expect(probe.stats.rGrades, 'the resolver grounded nothing: an empty R here is a silent all-clear, not a proof').toBeGreaterThan(0);
    const discrimination = [];
    for (const row of freeRows()) {
      const entry = probe.reads.get(identityOf(row));
      if (entry === undefined) {
        discrimination.push(`${identityOf(row)}: the probe recorded no read at all`);
        continue;
      }
      if ([...entry.R].join('|') !== probe.real) discrimination.push(`${identityOf(row)}: R is ${JSON.stringify([...entry.R])}, not exactly the grounded file`);
      if (!entry.N.has(probe.decoy)) discrimination.push(`${identityOf(row)}: N does not hold the decoy file, so N is not the over-permissive grade`);
      if (!entry.N.has(probe.real)) discrimination.push(`${identityOf(row)}: N does not hold the grounded file`);
    }
    expect(discrimination, `the split probe did not discriminate:\n${discrimination.join('\n')}`).toEqual([]);
  });

  test('A5 — every free row carries a live proof, and no other kind carries one', () => {
    const offenders = [];
    for (const row of declarationRows()) {
      // ⭐ EM-F3: a row outside this census's population is outside BOTH branches below — it
      // neither owes this file's name in its proof nor is convicted for carrying one. Case A2
      // holds the excluded set to its own proof rule.
      if (!isOfTheRecord(row)) continue;
      const carries = Object.hasOwn(row, 'readersProof');
      if (row.kind === 'free') {
        if (!carries) offenders.push(`${addressOf(row)} is free and carries no readersProof`);
        else if (typeof row.readersProof !== 'string' || row.readersProof.trim().length === 0) {
          offenders.push(`${addressOf(row)} carries a blank readersProof`);
        } else if (!row.readersProof.includes(SELF_REL)) {
          offenders.push(`${addressOf(row)} names no arm this census ran: its readersProof does not name ${SELF_REL}`);
        }
      } else if (carries) {
        offenders.push(`${addressOf(row)} is '${row.kind}' and carries a readersProof, which only a free row may`);
      }
    }
    expect(
      offenders,
      `a free field's proof names the instrument that proved it, and no other kind claims one:\n${offenders.join('\n')}`,
    ).toEqual([]);
    expect(freeRows().length, 'the free denominator is empty, so this arm proved nothing').toBeGreaterThan(0);
  });

  test('A6 — the receiver-shape arm: every free key grounds zero reads on its own card shape', () => {
    const { reads, stats } = liveScan();
    const grounded = [];
    for (const row of freeRows()) {
      const shape = shapeOf(row.card);
      expect(shape, `${addressOf(row)} has no declared stored shape, so its identity cannot be formed`).toBeTruthy();
      const entry = reads.get(identityOf(row));
      const reach = entry === undefined ? [] : [...entry.R].sort();
      if (reach.length > 0) grounded.push(`${identityOf(row)} is GROUNDED in ${JSON.stringify(reach)}`);
    }
    expect(
      grounded,
      'a grounded read of a free key on its own card shape under the scanned roots is a derivation'
      + ` reader, and the field is not free:\n${grounded.join('\n')}`,
    ).toEqual([]);
    expect(stats.rGrades, 'the live scan grounded nothing at all, so the empty R above proves nothing').toBeGreaterThan(0);
  });

  test('A7 — the key-level site roster holds exactly the declared decoys and nothing else', () => {
    const { rows, kinds } = siteRoster();
    const measured = [...rows.values()].map((row) => `${row.file} :: ${row.receiver}`).sort();
    const declared = DECOY_RECEIVERS.map((decoy) => `${decoy.file} :: ${decoy.receiver}`).sort();
    expect(measured, 'a receiver on this roster that no declaration explains is a read nothing accounts for').toEqual(declared);

    const countOffenders = [];
    let sites = 0;
    let occurrences = 0;
    for (const decoy of DECOY_RECEIVERS) {
      const row = rows.get(`${decoy.file} :: ${decoy.receiver}`);
      if (row === undefined) {
        countOffenders.push(`${decoy.file} :: ${decoy.receiver} vanished from the roster`);
        continue;
      }
      if (row.occurrences !== decoy.occurrences) {
        countOffenders.push(`${decoy.file} :: ${decoy.receiver} reads ${row.occurrences} times, declared ${decoy.occurrences}`);
      }
      sites += new Set(row.lines).size;
      occurrences += row.occurrences;
    }
    expect(countOffenders, `a declared receiver gained or lost a site:\n${countOffenders.join('\n')}`).toEqual([]);
    expect(sites, 'the distinct SITE total moved').toBe(DECOY_SITE_TOTAL);
    expect(occurrences, 'the read OCCURRENCE total moved').toBe(DECOY_OCCURRENCE_TOTAL);

    const missingWhy = DECOY_RECEIVERS.filter((decoy) => decoy.why.length === 0).map((decoy) => decoy.receiver);
    expect(missingWhy, 'a decoy row without a written reason is an assertion with no evidence').toEqual([]);
    expect([...kinds].sort().length, 'the roster saw no receiver-bearing read kind at all').toBeGreaterThan(0);

    const { reads } = liveScan();
    const named = new Set();
    for (const row of freeRows()) {
      const entry = reads.get(identityOf(row));
      if (entry !== undefined) for (const file of entry.N) named.add(file);
    }
    const unnamed = [...new Set([...rows.values()].map((row) => row.file))]
      .filter((file) => !named.has(file))
      .map((file) => `the roster holds ${file} but no free key's name-level grade does`);
    expect(unnamed, `the roster and the scanner disagree about which files read a free key:\n${unnamed.join('\n')}`).toEqual([]);
  });
});
