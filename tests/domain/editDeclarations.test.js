/**
 * editDeclarations.test.js — EM-A1's DECLARATION BATTERY (cases A1, A2, A3, A4, A7 and
 * the dormancy case).
 *
 * ⭐ THE FROZEN WAVE-1 ID LIST HAS EXACTLY ONE HOME, AND IT IS THIS FILE. ARM I-1, the
 * EXISTENCE arm, is the arm that asks "does this field exist yet, and if not which named
 * packet makes it", so the list of packets that may answer belongs with it. Version 4 ran
 * the same membership check in this file AND in the walker, each with its own re-typed
 * copy, and a single planted row then reddened two arms at once, which is a guard that
 * cannot say what it caught. The walker's root arm now takes `createdBy` PRESENCE only.
 *
 * ⭐ NOTHING HERE RE-TYPES A PRODUCER'S SET. The card types are read off the table's own
 * keys; the rename key surfaces are imported from `src/domain/factionRename.js`; the
 * record paths are probed against settlements this file GENERATES. The one authored list
 * is `WAVE1_PACKET_IDS`, which no producer publishes.
 *
 * ⭐ EVERY DETECTOR IS A FUNCTION THE PLANTS RE-ENTER. Each guard-the-guard arm runs the
 * SAME predicate the live arm runs, over a MUTATED COPY of the table — a control that
 * re-implements its detector proves nothing about the detector.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { beforeAll, describe, expect, test } from 'vitest';
import { commentsOnly } from '../helpers/codeOnlySource.js';
import {
  FIELD_DECLARATIONS,
  declarationsFor,
  isEditableCard,
} from '../../src/domain/edit/fieldDeclarations.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { FACTION_RENAME_SURFACES, NPC_RENAME_SURFACES } from '../../src/domain/factionRename.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * ⭐ THE FROZEN WAVE-1 PACKET IDS, SPELLED ONCE IN THE ESTATE (§6.3 ARM I-1). The EM
 * charter's wave-1 rows, with EM-A2's ruled split into A2a and A2b and EM-B1's into B1a
 * and B1b. A `createdBy` outside this list names a packet nobody chartered, which is the
 * difference between "this field is coming" and an invented promise.
 */
const WAVE1_PACKET_IDS = Object.freeze([
  'EM-A1', 'EM-A2a', 'EM-A2b', 'EM-A3', 'EM-B1a', 'EM-B1b', 'EM-B2', 'EM-B3', 'EM-B4',
]);

/** The two leaves EM-A1 creates, as repo-relative paths, for the dormancy scan. */
const NEW_LEAVES = Object.freeze(['src/domain/edit/types.js', 'src/domain/edit/fieldDeclarations.js']);

/**
 * Three tiers, three cultures, three terrains — and EIGHT seeds of each, which is a
 * MEASURED floor rather than a round number.
 *
 * ⚠ `npcs[].status` is the sparsest declared root key in the table: it rides with the
 * structural-seat family and nothing else, and at this base it is carried by 14 of 234
 * people over these 24 settlements (6.0 %). Executed at compile: of eight consecutive
 * seed TRIPLES, ONE carried no `status` at all — so a three-settlement corpus is not a
 * small corpus, it is a coin flip that reds this arm roughly one time in eight for a
 * field that is perfectly healthy. Eight triples carry a 14-person margin. If the arm
 * ever reds on `npcs[].status` alone, read the sparsity note below before touching the
 * declaration: the field being EMPTY on most people is the design (§2.1), and the card
 * shows it empty.
 */
const CORPUS_TIERS = Object.freeze([
  { settType: 'village', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  { settType: 'town', culture: 'coastal', terrain: 'coastal', tradeRouteAccess: 'river' },
  { settType: 'city', culture: 'imperial', terrain: 'hills', tradeRouteAccess: 'crossroads' },
]);
const CORPUS_SEED_COUNT = 8;

const CARD_TYPES = Object.keys(FIELD_DECLARATIONS);
const ALL_ROWS = Object.values(FIELD_DECLARATIONS).flat();

/** Where each card type's rows live on a generated record. */
const CARD_ROWS_ON_RECORD = Object.freeze({
  institution: (record) => record.institutions ?? [],
  npc: (record) => record.npcs ?? [],
  faction: (record) => record.powerStructure?.factions ?? [],
  powerSeat: (record) => (record.powerStructure ? [record.powerStructure] : []),
});

/** The leaf key an `outputKey` addresses on one row of its card (`a.b[].leaf` -> `leaf`). */
function leafKeyOf(outputKey) {
  const parts = String(outputKey).split('.');
  return parts[parts.length - 1];
}

/** Whether a dotted path exists as an OWN key chain on a record. */
function pathExists(record, path) {
  let cursor = record;
  for (const key of String(path).split('.')) {
    if (!cursor || typeof cursor !== 'object' || !Object.hasOwn(cursor, key)) return false;
    cursor = cursor[key];
  }
  return true;
}

/**
 * ARM I-1, THE EXISTENCE ARM — the predicate, as a function both the live arm and the
 * plant run. Returns one message per offending row.
 * @param {readonly import('../../src/domain/edit/types.js').FieldDeclaration[]} rows
 * @param {object[]} corpus generated settlement records
 * @returns {string[]}
 */
function existenceOffenders(rows, corpus) {
  const offenders = [];
  for (const row of rows) {
    if (row.provenance === 'annotation') continue;
    // ⭐ EM-F3 WIDENS THIS ARM IN PLACE, BY ADDITION AND NEVER BY DELETION. A `dm` row is OUT of
    // this arm's population by construction, and for a reason the annotation exclusion does not
    // carry: an annotation row has no record path because nothing READS it, while a `dm` row has
    // none because its subject is not on this record AT ALL — a phantom counterparty is a SAVE
    // OF ITS OWN (EM-F1, judgment 261). Asking a generated corpus whether it holds
    // `phantom.name` would ask the wrong question of the wrong record. The join a `dm` row DOES
    // owe — its pooled fields against the mint's own trait table — is ARM I-5's, in the walker.
    if (row.provenance === 'dm') continue;
    if (row.provenance === 'world-fact') {
      if (!corpus.some((record) => pathExists(record, row.outputKey))) {
        offenders.push(`${row.card}.${row.field}: world-fact outputKey '${row.outputKey}' is not a live record path in any generated tier`);
      }
      continue;
    }
    if (row.createdBy) {
      if (!WAVE1_PACKET_IDS.includes(row.createdBy)) {
        offenders.push(`${row.card}.${row.field}: createdBy '${row.createdBy}' is not a wave-1 packet id`);
      }
      continue;
    }
    const leaf = leafKeyOf(row.outputKey);
    const live = corpus.some((record) => (CARD_ROWS_ON_RECORD[row.card]?.(record) ?? [])
      .some((entry) => entry && typeof entry === 'object' && Object.hasOwn(entry, leaf)));
    if (!live) {
      offenders.push(`${row.card}.${row.field}: outputKey '${row.outputKey}' is no live key on its card at any generated tier, and the row names no createdBy`);
    }
  }
  return offenders;
}

/**
 * THE §6.2 SHAPE LAW, BY PROVENANCE — the predicate, as a function both the live arm and
 * the two plants run. Returns one message per offending cell.
 * @param {readonly import('../../src/domain/edit/types.js').FieldDeclaration[]} rows
 * @returns {string[]}
 */
function shapeOffenders(rows) {
  const offenders = [];
  const cascadeKeySurfaces = new Set(
    [...NPC_RENAME_SURFACES, ...FACTION_RENAME_SURFACES].filter((s) => s.kind === 'key').map((s) => s.path),
  );
  const seenPairs = new Set();
  const seenPools = new Set();
  const nonBlank = (value) => typeof value === 'string' && value.trim().length > 0;
  const at = (row) => `${row.card}.${row.field}`;

  for (const row of rows) {
    for (const key of ['card', 'field', 'kind', 'provenance', 'label', 'group']) {
      if (!nonBlank(row[key])) offenders.push(`${at(row)}: '${key}' is required and non-blank on every row`);
    }
    if (!CARD_TYPES.includes(row.card)) offenders.push(`${at(row)}: card is outside the closed five the table declares`);
    if (!['pool', 'free', 'free-cascade', 'share'].includes(row.kind)) offenders.push(`${at(row)}: kind is outside the closed four`);
    if (!['root', 'world-fact', 'annotation', 'dm'].includes(row.provenance)) offenders.push(`${at(row)}: provenance is outside the closed four`);

    const pair = `${row.card}::${row.field}`;
    if (seenPairs.has(pair)) offenders.push(`${at(row)}: a duplicate (card, field) row`);
    seenPairs.add(pair);

    const hasWriter = Object.hasOwn(row, 'writer');
    const hasCreatedBy = Object.hasOwn(row, 'createdBy');
    if (row.provenance === 'root') {
      if (hasWriter === hasCreatedBy) offenders.push(`${at(row)}: a root row carries EXACTLY ONE of writer / createdBy, never both and never neither`);
      if (row.kind === 'free') offenders.push(`${at(row)}: no root row is kind 'free'`);
      if (!nonBlank(row.outputKey)) offenders.push(`${at(row)}: a root row carries a non-blank outputKey`);
      if (Object.hasOwn(row, 'tier1')) offenders.push(`${at(row)}: tier1 is the world-fact join and is absent on a root row`);
      if (Object.hasOwn(row, 'inputKey')) offenders.push(`${at(row)}: inputKey is the world-fact ENGINE key and is absent on a root row`);
      if (Object.hasOwn(row, 'readersProof')) offenders.push(`${at(row)}: readersProof is absent on a root row`);
    }
    if (row.provenance === 'world-fact') {
      if (row.kind !== 'pool') offenders.push(`${at(row)}: a world-fact row is always kind 'pool'`);
      if (!nonBlank(row.outputKey)) offenders.push(`${at(row)}: a world-fact row carries a non-blank outputKey`);
      if (hasWriter || hasCreatedBy) offenders.push(`${at(row)}: writer and createdBy are both absent on a world-fact row`);
      if (!row.tier1 || !nonBlank(row.tier1.step) || !nonBlank(row.tier1.key)) offenders.push(`${at(row)}: a world-fact row carries tier1 as a non-blank { step, key }`);
      // ⭐ EM-B2b's THIRD WORD (judgment 241 ruling 2). `outputKey` says where the value LANDS and
      // `tier1` names the ctx key; NEITHER is the key the engine READS, and for terrain the three
      // are three different words. The cell is here and not only in the walker because this
      // predicate carries NO unknown-key check — it never enumerates a row's own keys — so an
      // undeclared inputKey would pass silently and this file's own "which keys a row carries is a
      // contract, not a convenience" claim would go false.
      if (!nonBlank(row.inputKey)) offenders.push(`${at(row)}: a world-fact row carries a non-blank inputKey, the config key the ENGINE reads`);
      if (Object.hasOwn(row, 'readersProof')) offenders.push(`${at(row)}: readersProof is absent on a world-fact row`);
    }
    if (row.provenance === 'annotation') {
      if (row.kind !== 'free') offenders.push(`${at(row)}: an annotation row is always kind 'free'`);
      if (Object.hasOwn(row, 'outputKey')) offenders.push(`${at(row)}: an annotation row carries no outputKey, and the absence IS the claim that nothing on the record reads it`);
      if (hasWriter || hasCreatedBy) offenders.push(`${at(row)}: writer and createdBy are both absent on an annotation row`);
      if (Object.hasOwn(row, 'tier1')) offenders.push(`${at(row)}: tier1 is absent on an annotation row`);
      if (Object.hasOwn(row, 'inputKey')) offenders.push(`${at(row)}: inputKey is absent on an annotation row`);
      if (!nonBlank(row.readersProof)) offenders.push(`${at(row)}: an annotation row carries a non-blank readersProof`);
    }

    // ⭐ EM-F3's FOURTH PROVENANCE, cell by cell, in the same shape as the other three. A `dm`
    // row declares a field of a DM-MINTED ENTITY: the value is an ARGUMENT OF THE MINT that
    // writes that entity's own save, so there is no record path, no generating writer, no
    // packet that will one day add one, and no Tier-1 pair. The absence of `outputKey` is
    // therefore a DIFFERENT claim from the annotation row's, and it is asserted here so the
    // day somebody gives a `dm` row an outputKey the table says what went wrong.
    if (row.provenance === 'dm') {
      if (!['pool', 'free'].includes(row.kind)) offenders.push(`${at(row)}: a dm row is kind 'pool' or 'free'`);
      if (Object.hasOwn(row, 'outputKey')) offenders.push(`${at(row)}: a dm row carries no outputKey, and the absence IS the claim that its subject is not on this record at all`);
      if (hasWriter || hasCreatedBy) offenders.push(`${at(row)}: writer and createdBy are both absent on a dm row`);
      if (Object.hasOwn(row, 'tier1')) offenders.push(`${at(row)}: tier1 is absent on a dm row`);
      if (Object.hasOwn(row, 'inputKey')) offenders.push(`${at(row)}: inputKey is absent on a dm row`);
    }

    if (Object.hasOwn(row, 'pool') !== (row.kind === 'pool')) offenders.push(`${at(row)}: pool is present iff kind is 'pool'`);
    if (row.kind === 'pool') {
      if (!nonBlank(row.pool)) offenders.push(`${at(row)}: a pool id is non-blank`);
      if (seenPools.has(row.pool)) offenders.push(`${at(row)}: pool id '${row.pool}' is claimed twice`);
      seenPools.add(row.pool);
    }
    const wantsMaxLength = row.kind === 'free-cascade' || row.kind === 'free';
    if (Object.hasOwn(row, 'maxLength') !== wantsMaxLength) offenders.push(`${at(row)}: maxLength is present iff kind is 'free-cascade' or 'free'`);
    if (Object.hasOwn(row, 'readersProof') !== (row.kind === 'free')) offenders.push(`${at(row)}: readersProof is present iff kind is 'free'`);

    if (row.kind === 'free-cascade' && !cascadeKeySurfaces.has(row.outputKey) && row.outputKey !== 'institutions[].name') {
      offenders.push(`${at(row)}: a free-cascade outputKey is a declared KEY rename surface, or the one named exception institutions[].name whose cascade EM-R6 mints`);
    }
    if (Object.values(row).some((value) => value === null)) offenders.push(`${at(row)}: null is forbidden anywhere in a row`);
  }
  return offenders;
}

/** Every `.js` / `.jsx` file under a directory, repo-relative. */
function walkSources(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkSources(full, out);
    else if (/\.jsx?$/.test(entry)) out.push(relative(ROOT, full).replace(/\\/g, '/'));
  }
  return out;
}

/**
 * THE DORMANCY MATCHER — the predicate, as a function the live arm and its in-body control
 * both run, over source text the caller supplies.
 *
 * ⭐ IT READS CODE, NEVER PROSE. Every source goes through the estate's ONE shared comment
 * strip (`commentsOnly`, `tests/helpers/codeOnlySource.js`), which blanks `//`, block and
 * JSX comments and keeps every literal byte-for-byte. A JSDoc
 * `@typedef {import('…/edit/types.js').FieldDeclaration}` is a TYPE-ONLY reference that no
 * bundler ever emits an edge for, so it puts nothing into any closure and cannot move the
 * +0 B price; a RUNTIME `import … from '…'` still convicts by name, because its specifier
 * lives in a string literal the strip preserves.
 *
 * TOOL-32 (2026-09-21): the matcher used to read RAW bytes, and the composed train reds on
 * EM-D0d's `src/components/edit/FreeField.jsx` and `PoolField.jsx`, which carry exactly that
 * JSDoc line. MEASURED at that base rather than argued: the build's OWN derivation strips
 * comments before it reads a specifier (`computeEagerModuleGraph` in `vite.config.js`), and
 * with it neither leaf is in `EAGER_FIRST_PAINT_MODULES` (269 modules, `src/main.jsx` in it
 * as the control, nothing under `src/domain/edit/`), while a plain import-graph walk over
 * all 2,256 `src/` modules on stripped source resolves 9,553 real edges and reaches neither
 * leaf from either file (closures of 10 and 12 modules). The arm's PURPOSE held; its matcher
 * was over-broad. Nothing here weakens what the arm catches — see the control in the arm.
 *
 * @param {ReadonlyArray<readonly [string, string]>} entries repo-relative path and its source
 * @returns {string[]} one message per importer, `<file> imports <leaf>`
 */
function dormancyImporters(entries) {
  const importers = [];
  for (const [rel, source] of entries) {
    for (const match of commentsOnly(source).matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      if (!specifier.startsWith('.')) continue;
      const resolved = relative(ROOT, resolve(dirname(join(ROOT, rel)), specifier)).replace(/\\/g, '/');
      if (NEW_LEAVES.includes(resolved)) importers.push(`${rel} imports ${resolved}`);
    }
  }
  return importers;
}

/** @type {object[]} */
let corpus = [];

beforeAll(() => {
  const generated = [];
  for (let nth = 1; nth <= CORPUS_SEED_COUNT; nth += 1) {
    for (const config of CORPUS_TIERS) {
      generated.push(generateSettlementPipeline(config, null, {
        seed: `em-a1-existence-${config.settType}-${nth}`,
        customContent: {},
      }));
    }
  }
  corpus = generated;
});

describe('EM-A1 — the field declarations, their shape law and their existence on the record', () => {
  test('DORMANCY: no module under src/ imports either new leaf, so neither enters any bundle closure', () => {
    // §8 step 1 and §7's byte-price probe in one arm. The scanned population EXCLUDES the
    // two leaves themselves, because the type-only edge between them is this packet's ONE
    // declared new edge; the claim is about the rest of the tree, and it is what makes the
    // predicted +0 B on all four budgeted closures true by construction rather than by hope.
    const scanned = walkSources(join(ROOT, 'src')).filter((rel) => !NEW_LEAVES.includes(rel));
    expect(scanned.length, 'the src/ walk found nothing, so the absence below would be vacuous').toBeGreaterThan(400);
    const importers = dormancyImporters(scanned.map((rel) => [rel, readFileSync(join(ROOT, rel), 'utf8')]));

    // ⭐⭐ EM-B1a WIDENS THIS ARM IN PLACE, BY ADDITION AND NEVER BY DELETION. The roster is
    // now EXACT and asserted SET-EQUAL IN BOTH DIRECTIONS, with both sides sorted, because
    // `walkSources` order is `readdirSync` order and is not stable across filesystems. The
    // FIRST entry is EM-B1a's op catalogue reaching EM-A1's `fieldDeclarations.js` — this
    // leaf's SINGLE RUNTIME EDGE into EM-A1's volume. Its `Op` and `EntityRef` typedefs
    // reach `types.js` by JSDoc alone, which TOOL-32's comment strip correctly does not
    // count, exactly as it does not count EM-D0d's two `FreeField`/`PoolField` typedefs.
    // ⭐⭐ EM-C4a WIDENS IT AGAIN, BY ADDITION AND NEVER BY DELETION. The SECOND entry is
    // `src/store/editSlice.js`, the settlement editor's plain-edit store half and the FIRST
    // RUNTIME IMPORTER of this leaf from outside `src/domain/edit/`. It is LAZY, and that is
    // MEASURED rather than argued: `src/store/index.js` names it nowhere, and at this tip it
    // has ZERO importers under `src/`, static or dynamic. So it is composed by no eager slice,
    // enters no first-paint closure, and the +0 B price this arm defends is unmoved. Its own
    // import list is pinned at exactly four by arm A5 of EM-C4a's own walker,
    // `tests/lint/editMutationPath.walker.test.js`, whose MUTANT arm separates an EAGER
    // static edge from a DYNAMIC one over this very target.
    const EXPECTED_IMPORTERS = [
      // ⭐ EM-D0e WIDENS THIS ARM IN PLACE, BY ADDITION AND NEVER BY DELETION. The first entry
      // is the first editor door, and it is LAZY in the only sense this arm measures: EM-D1's
      // SHELL MOUNTS IT (the entry below), and that shell is itself reached from the App root
      // through a single `lazy(() => import(...))` edge — so the door is composed by no eager
      // slice, contributes 0 members to EAGER_FIRST_PAINT_MODULES, and the +0 B price this arm
      // defends is unmoved. Measured by EM-D0e's own first-paint membership probe, which
      // imports the exported set and reads no build output.
      'src/components/edit/CardEditorDialog.jsx imports src/domain/edit/fieldDeclarations.js',
      // ⭐ EM-D1 WIDENS THIS ARM IN PLACE, BY ADDITION AND NEVER BY DELETION. The edit-mode
      // shell is the FIRST MOUNTED consumer of the declaration table: it asks `isEditableCard`
      // which cards wear a pencil and `declarationsFor` which collection a card's subjects live
      // in, and it imports NOTHING ELSE from the edit volume — no op catalogue, no world
      // conditions, no layer. It is LAZY in this arm's own sense: `src/App.jsx` reaches it
      // through one `lazy(() => import(...))` edge, which the eager first-paint graph does not
      // follow, so the table still enters no first-paint closure. The editor-train arm of
      // tests/build/vendorPdfLazy.test.js prices that same membership from the build config.
      'src/components/edit/EditModeShell.jsx imports src/domain/edit/fieldDeclarations.js',
      'src/domain/edit/operations.js imports src/domain/edit/fieldDeclarations.js',
      'src/store/editSlice.js imports src/domain/edit/fieldDeclarations.js',
    ];
    expect(
      [...importers].sort(),
      'the importer roster of EM-A1\'s new leaves is EXACT, in both directions. Wave 1 is'
      + ' HEADLESS by construction: an UNLISTED importer puts the declaration table into a'
      + ' bundle closure and invalidates the +0 B price this packet declared on the worker, the'
      + ' lazy engine, the eager first paint and the edge metas. A MISSING listed importer means'
      + ' a sanctioned edge is gone and the roster has aged instead of convicting. EM-B1a\'s'
      + ' op catalogue and EM-C4a\'s LAZY store slice are the two sanctioned runtime edges.',
    ).toEqual([...EXPECTED_IMPORTERS].sort());

    // ⭐ THE SECOND-ORDER SCAN (EM-B1a, WIDENED IN PLACE BY EM-C4a). This is an EXACT importer
    // roster over EM-B1a's own two leaves, asserted SET-EQUAL IN BOTH DIRECTIONS with both sides
    // sorted — the first roster's own idiom, for the same reason: `walkSources` order is
    // `readdirSync` order and is not stable across filesystems. EM-B1a LANDED dark; its op
    // catalogue's FIRST RUNTIME IMPORTER is EM-C4a's `src/store/editSlice.js`, the plain-edit
    // store half, and it is listed here exactly. That slice is LAZY, MEASURED rather than
    // argued: `src/store/index.js` names it nowhere and it has ZERO importers under `src/`,
    // static or dynamic, at this tip — so EM-A1's declaration table still reaches no bundle
    // closure THROUGH EM-B1a's leaves and the +0 B price stays true BY CONSTRUCTION rather than
    // by an absence. The world-condition leaf still has NO importer under `src/` at all, which
    // is why any row naming it would be a NEW closure edge and reds here.
    const B1A_LEAVES = ['src/domain/edit/operations.js', 'src/domain/edit/worldConditions.js'];
    const EXPECTED_SECOND_ORDER = [
      // ⭐ U72's SECOND SANCTIONED RUNTIME EDGE, AND IT IS DYNAMIC. Design §20.3 puts the
      // stale-vocabulary resolver at the head of the tick, and only the store's advance can
      // compose the `{ opTypes, pools }` the resolver takes — a pool's values are a function
      // of a live SETTLEMENT, which neither the kernel nor the hook may reach. The advance
      // session therefore names this leaf, behind `await import(…)` and behind a dormancy
      // guard: a campaign whose saves hold no PENDING decree reaches the import not at all.
      // The +0 B price is unmoved and MEASURED, not argued — `EAGER_FIRST_PAINT_MODULES`
      // walks STATIC edges only and reads 270 with this row in place, exactly as before.
      'src/store/campaignAdvanceSession.js imports src/domain/edit/operations.js',
      'src/store/editSlice.js imports src/domain/edit/operations.js',
    ];
    const secondOrder = [];
    for (const rel of scanned.filter((each) => !B1A_LEAVES.includes(each))) {
      const code = commentsOnly(readFileSync(join(ROOT, rel), 'utf8'));
      for (const match of code.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
        if (!match[1].startsWith('.')) continue;
        const resolved = relative(ROOT, resolve(dirname(join(ROOT, rel)), match[1])).replace(/\\/g, '/');
        if (B1A_LEAVES.includes(resolved)) secondOrder.push(`${rel} imports ${resolved}`);
      }
    }
    expect(
      [...secondOrder].sort(),
      'the importer roster of EM-B1a\'s two leaves is EXACT, in both directions. EM-B1a LANDED'
      + ' dark, and its op catalogue\'s first runtime importer is EM-C4a\'s LAZY store slice,'
      + ' listed here exactly; its world-condition leaf still has no importer under src/ at all.'
      + ' An UNLISTED importer can carry EM-A1\'s declaration table into a bundle closure behind'
      + ' this arm\'s back; a MISSING listed one means a sanctioned edge is gone and the roster'
      + ' has aged instead of convicting.',
    ).toEqual([...EXPECTED_SECOND_ORDER].sort());

    // GUARD-THE-GUARD, through the SAME predicate (this file's house rule, ⭐ third header
    // paragraph): the comment strip blinds the matcher to a JSDoc type reference and to
    // NOTHING ELSE. Both probes are SYNTHETIC source strings — no file is written under src/,
    // and the path is resolved by arithmetic — so the pair travels with the arm it defends
    // and costs the scan above nothing. Without it, a strip that one day blanked too much
    // would leave the absence above green forever with nothing left to catch, which is the
    // exact failure the estate's shared strip exists to make visible rather than silent.
    const plantedAt = 'src/components/edit/PlantedField.jsx';
    expect(
      dormancyImporters([[plantedAt, "import { declarationsFor } from '../../domain/edit/fieldDeclarations.js';\n"]]),
      'a RUNTIME import of a leaf must still convict, naming the file and the leaf',
    ).toEqual([`${plantedAt} imports src/domain/edit/fieldDeclarations.js`]);
    expect(
      dormancyImporters([[plantedAt, "/** @typedef {import('../../domain/edit/types.js').FieldDeclaration} FieldDeclaration */\n"]]),
      'a JSDoc typedef names a TYPE, enters no bundle closure and is not an importer',
    ).toEqual([]);
  });

  test('A1: every declared card type returns its authored rows, in authored order, frozen', () => {
    expect(CARD_TYPES.length, 'the table declares six card types').toBe(6);
    const problems = [];
    for (const cardType of CARD_TYPES) {
      const rows = declarationsFor(cardType);
      if (rows !== FIELD_DECLARATIONS[cardType]) problems.push(`${cardType}: declarationsFor returned a copy rather than the authored array`);
      if (rows.length === 0) problems.push(`${cardType}: present and empty, which the table forbids — an undeclarable card type is ABSENT`);
      if (!Object.isFrozen(rows)) problems.push(`${cardType}: the returned array is not frozen`);
      if (!isEditableCard(cardType)) problems.push(`${cardType}: isEditableCard is false for a declared card type`);
      const filedElsewhere = rows.filter((row) => row.card !== cardType).map((row) => row.field);
      if (filedElsewhere.length) problems.push(`${cardType}: rows filed under the wrong card: ${filedElsewhere.join(', ')}`);
    }
    expect(problems).toEqual([]);
    expect(ALL_ROWS.length, 'nineteen declared fields across the six cards').toBe(19);
  });

  test('A2: an unknown, absent or non-string card type returns the SAME frozen empty array, and never throws', () => {
    const probes = [undefined, '', 'nope', 42, 'constructor', 'toString', 'world fact'];
    const results = probes.map((probe) => declarationsFor(probe));
    const identical = results.every((result) => result === results[0]);
    expect(identical, 'every miss returns the same shared frozen empty array BY IDENTITY').toBe(true);
    expect(results[0]).toEqual([]);
    expect(Object.isFrozen(results[0])).toBe(true);
    expect(probes.map((probe) => isEditableCard(probe))).toEqual(probes.map(() => false));
    // 'world fact' with a space is the banned spelling: the card is 'worldFact', and the
    // spacey form must miss rather than quietly resolve through some normalization.
    expect(declarationsFor('worldFact').length).toBe(5);
  });

  test('A3: ARM I-1 — every root row is live on its card or names a chartered packet, and a planted packet id REDS', () => {
    expect(corpus.length, 'the corpus is empty, so every existence claim below would be vacuous')
      .toBe(CORPUS_SEED_COUNT * CORPUS_TIERS.length);
    const denominators = corpus.map((record) => (record.institutions ?? []).length + (record.npcs ?? []).length);
    expect(Math.min(...denominators), 'a generated tier carried no institutions and no people').toBeGreaterThan(0);
    // The sparsity floor, named: `npcs[].status` is the one declared key rare enough that a
    // small corpus can miss it, so its margin is asserted HERE rather than discovered as a
    // confusing red on the totality below.
    const peopleWithStatus = corpus.reduce((n, record) => n
      + (record.npcs ?? []).filter((person) => person && Object.hasOwn(person, 'status')).length, 0);
    expect(peopleWithStatus, 'the corpus carries no person with a status at all, so the sparsest'
      + ' declared root key cannot be proved live — widen the corpus before doubting the row')
      .toBeGreaterThan(0);

    expect(existenceOffenders(ALL_ROWS, corpus)).toEqual([]);

    // GUARD-THE-GUARD, through the SAME predicate: an invented packet id must convict, and
    // the message must name the card and the field so a reader knows which row moved.
    const planted = ALL_ROWS.map((row) => (row.card === 'institution' && row.field === 'state'
      ? { ...row, createdBy: 'EM-ZZ9' }
      : row));
    const caught = existenceOffenders(planted, corpus);
    expect(caught).toEqual(["institution.state: createdBy 'EM-ZZ9' is not a wave-1 packet id"]);

    // ...and the annotation rows really are out of this arm's population by construction:
    // they carry no outputKey at all, so a population that included them could not pass.
    expect(ALL_ROWS.filter((row) => row.provenance === 'annotation').length).toBe(2);
    // ...and so are EM-F3's dm rows, for the second reason this arm's own predicate states.
    expect(ALL_ROWS.filter((row) => row.provenance === 'dm').length).toBe(2);
    expect(ALL_ROWS.filter((row) => row.provenance === 'dm' && Object.hasOwn(row, 'outputKey'))).toEqual([]);
  });

  test('A4: the §6.2 shape law holds for all seventeen rows, and two planted rows RED', () => {
    expect(shapeOffenders(ALL_ROWS)).toEqual([]);

    const shareRow = ALL_ROWS.find((row) => row.kind === 'share');
    expect(shareRow, 'no share row exists, so its plant has no subject').toBeTruthy();
    const plantedShare = ALL_ROWS.map((row) => (row === shareRow ? { ...row, pool: 'faction.share' } : row));
    expect(shapeOffenders(plantedShare)).toEqual(["faction.power: pool is present iff kind is 'pool'"]);

    const annotationRow = ALL_ROWS.find((row) => row.provenance === 'annotation');
    expect(annotationRow, 'no annotation row exists, so its plant has no subject').toBeTruthy();
    const plantedAnnotation = ALL_ROWS.map((row) => (row === annotationRow ? { ...row, outputKey: 'institutions[].note' } : row));
    expect(shapeOffenders(plantedAnnotation)).toEqual([
      'institution.note: an annotation row carries no outputKey, and the absence IS the claim that nothing on the record reads it',
    ]);

    // ⭐ EM-F3's dm CELLS, and their plant, through the SAME predicate. The population is
    // asserted non-empty first, exactly as the others are, or the cells would be green on
    // nothing; the plant is the LIVE name row given an outputKey, which is the one mistake a
    // later author would make — declaring a phantom's field as though it were a record field.
    const dmRows = ALL_ROWS.filter((row) => row.provenance === 'dm');
    expect(dmRows.length, 'no dm row exists, so the dm cells have no subject').toBe(2);
    const dmNameRow = dmRows.filter((row) => row.field === 'name')[0];
    expect(shapeOffenders(ALL_ROWS.map((row) => (row === dmNameRow
      ? { ...row, outputKey: 'phantoms[].name' }
      : row)))).toEqual([
      'phantom.name: a dm row carries no outputKey, and the absence IS the claim that its subject is not on this record at all',
    ]);
    // ...and a dm row given a WRITER reds on its own cell, so the two halves of the absence
    // table are separable rather than one lump.
    expect(shapeOffenders(ALL_ROWS.map((row) => (row === dmNameRow
      ? { ...row, writer: 'src/generators/steps/generatePopulation.js#generatePopulation' }
      : row)))).toEqual([
      'phantom.name: writer and createdBy are both absent on a dm row',
    ]);

    // ⭐ EM-B2b's THREE inputKey CELLS, and their plant, through the SAME predicate. The
    // population is asserted non-empty first, exactly as tier1's own cells are, or the three
    // cells below would be green on nothing.
    const worldFactRows = ALL_ROWS.filter((row) => row.provenance === 'world-fact');
    expect(worldFactRows.length, 'no world-fact row exists, so the inputKey cells have no subject').toBe(5);
    expect(
      worldFactRows.filter((row) => typeof row.inputKey !== 'string' || row.inputKey.trim().length === 0),
      'every world-fact row declares the config key the ENGINE reads',
    ).toEqual([]);

    // The plant: a world-fact row STRIPPED of its inputKey. Without this cell the predicate has no
    // unknown-key check to fall back on, so the row would pass silently and `config′` would be
    // keyed by nothing.
    const terrainRow = worldFactRows.find((row) => row.field === 'terrain');
    const plantedInputKey = ALL_ROWS.map((row) => (row === terrainRow
      ? Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'inputKey'))
      : row));
    expect(shapeOffenders(plantedInputKey)).toEqual([
      'worldFact.terrain: a world-fact row carries a non-blank inputKey, the config key the ENGINE reads',
    ]);
  });

  test('A7: the readers are pure and the table is deep-frozen', () => {
    const problems = [];
    for (const cardType of CARD_TYPES) {
      if (declarationsFor(cardType) !== declarationsFor(cardType)) problems.push(`${cardType}: repeated calls returned different arrays`);
    }
    expect(problems).toEqual([]);
    expect(Object.isFrozen(FIELD_DECLARATIONS)).toBe(true);
    expect(ALL_ROWS.filter((row) => !Object.isFrozen(row)).map((row) => `${row.card}.${row.field}`)).toEqual([]);
    expect(ALL_ROWS.filter((row) => row.tier1 && !Object.isFrozen(row.tier1)).map((row) => `${row.card}.${row.field}`)).toEqual([]);
    // ESM is strict, so a write to a frozen row throws rather than failing silently.
    expect(() => { FIELD_DECLARATIONS.npc[0].label = 'a planted label'; }).toThrow();
    expect(() => { FIELD_DECLARATIONS.worldFact[0].tier1.step = 'noSuchStep'; }).toThrow();
  });
});
