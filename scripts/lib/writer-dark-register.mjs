/**
 * writer-dark-register.mjs — THE HAND-AUTHORED DARK REGISTER AND ITS CONVICTION
 * DOORS (HORIZON §1.10, §7.1).
 *
 * ── WHAT A ROW IS ────────────────────────────────────────────────────────────
 * A DARK identity — a key the engine writes on every world that no customer
 * surface reads — is either a ROW here or a member of the shrink-only banked
 * cohort in `scripts/.writer-reach-baseline.json`. A row is a CLAIM, in one of
 * three closed reasons, and every claim is CONVICTED by an executed bit on every
 * scan. A row that cannot be verified is a lie, not an exemption.
 *
 *   dark-by-construction — the key is written but a DOOR keeps it dark: an
 *       engine-gated virtual `simulation-flag`, or a `generation-dial` whose
 *       shipped version differs from the lit one. Dormancy is a BIT claim.
 *   engine-internal      — the key IS read, by plumbing behind the closure STOP
 *       (a regen path, a store selector). Not a customer fact at all.
 *   pending-surface      — the key SHOULD be shown and is not yet. An owed CAR
 *       and a capability question for the owner, never a silencer.
 *
 * ── ⛔ WHY `pending-surface` IS THE DANGEROUS ONE, AND HOW IT IS FENCED ──────
 * Without a fence, `{ reason: 'pending-surface', surface: <any class this key
 * does not reach>, car: '§0' }` would silence ANY new DARK identity by a
 * code-only edit — banking a row disarms the ratchet. So:
 *   1. `surface` must be a COUNTING class. A pending surface is one a customer
 *      will SEE, never a report-only class.
 *   2. `surface` must be one the identity does NOT currently reach.
 *   3. `car` must cite a section AND resolve to an IN-TREE artifact that NAMES
 *      the fact (⟦A21 E5⟧). A `§` alone is not existence-checkable from the build
 *      worktree, because the decision queue lives on the ledger branch.
 *   4. The pending-surface POPULATION is a shrink-only ceiling banked at genesis.
 *      A row may leave; none may join except through `--rebank --charter=§NNN`.
 *
 * ── ⚠ THE CITATION LAW, BOTH FACES ──────────────────────────────────────────
 * Clause E strips comments AND strings before looking for the consumer's read: a
 * USE claim reads CODE, because a call cannot execute from inside a quoted
 * literal. Clause D-flag keeps strings, because there the flag TOKEN is the
 * evidence. The distinction is not stylistic — the draft register named
 * `src/store/configSlice.js:81` as a consumer of `cultureProfileKey`, and that
 * "read" is the key's NAME inside a space-separated string of allowlisted config
 * fields. Clause E convicts it, correctly, and the row below does not claim it.
 *
 * @see docs/DESIGN_HORIZON.md §1.10, §7.1   (the charter; on the ledger line)
 * @see scripts/lib/writer-reach-scan.mjs    (the scanner and the vocabulary)
 */
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

import { COUNTING_CLASSES, SURFACE_CLASSES, canonicalJson } from './writer-reach-scan.mjs';
import { parseLeafBaselineIdentity } from './observed-shape-baseline.mjs';
import { writeShapesIn, assertVirtualDormantWriterEvidence } from '../check-observed-shape-readers.mjs';
import { codeOnly } from '../../tests/helpers/codeOnlySource.js';

/** The three closed reasons. Finite semantics: a fourth reason is a charter act. */
export const DARK_REASONS = Object.freeze(['dark-by-construction', 'engine-internal', 'pending-surface']);

/** The EXACT field set each reason carries — the M13 idiom, `Object.keys().sort().join(',')`. */
export const CANONICAL_FIELDS = Object.freeze({
  'dark-by-construction': 'car,charter,door,identity,key,lighting,reason,shape,writer',
  'engine-internal': 'charter,consumer,identity,key,reason,shape,why,writer',
  'pending-surface': 'car,carArtifact,charter,identity,key,reason,shape,surface,why,writer',
});

/** A `simulation-flag` door's flag spelling — the estate's own convention. */
export const SIMULATION_FLAG_PATTERN = /^[a-z][A-Za-z0-9]*Enabled$/;

/**
 * THE REGISTER. Rows 1, 2, 3 and 6 of the volume's six drafted rows. Rows 1 and 2
 * were the generation-dial pair, admitted by Car 4 once the chair ruled clause W
 * reason-aware (ledger §882.15) — before that ruling no instrument in the estate
 * could hold them, because their writes are an assignment and a computed key.
 *
 * ⭐⭐ ROW 1 IS RETIRED, BY ITS OWN PREMISE, ON THE DAY THE DIAL WAS LIT
 * (2026-09-08, lane LIGHT car 1b). `customContentRoster on settlement` was
 * dark-by-construction because `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION`
 * shipped at 1 against a roster law of 2. Its own `lighting` prose said what to
 * do when that stopped being true — "When the owner rolls the dial the key
 * becomes an ordinary written fact and this row must die with its premise" — and
 * clause D-dial says the same in the failure it throws: "Retire the row rather
 * than outliving its own premise." The row is struck rather than reworded,
 * because a dormancy claim whose ground has gone is not a claim to soften. The
 * identity is now judged NORMALLY, and what that judgement finds is a key no
 * world in the corpus writes: the roster materializes only where the run's
 * reviewed environment holds a living-content definition, and the walker's
 * corpus is generated under `customContent: {}`.
 *
 * The sixth row (2026-09-24, CURE-PEACE-1) is `supersessionReason on proposals`, engine-internal: the
 * lane's docket retirement (FP-17) is the first supersession writer the executed corpus runs, so the
 * reason code every supersession writer stamps became judgeable, and its one reader is the feed
 * reconcile. Its sibling stamp `supersededAtTick` had no reader at all and is no longer written by that
 * writer; the three older writers still write it (applyWorldPulse.js twice, candidateEvents.js), out of
 * the corpus's reach.
 *
 * Rows 3 and 6 were Car 1's:
 * Car 0 adjudicated all six at C' (⟦G0-13⟧) and found rows 1–2 are Car 3's
 * (their keys are not written under the dark corpus at all), row 4's key never
 * reaches the population under `customContent: {}`, and row 5's three families
 * are refuted or unobservable (`worldState` is THIN at 25 rows, so no
 * `worldState` identity is judgeable).
 */
export const WRITER_DARK_REGISTER = Object.freeze([
  Object.freeze({
    identity: 'densityRungRole on npcs',
    key: 'densityRungRole',
    shape: 'npcs',
    writer: 'src/generators/density/applyDensityLaw.js',
    reason: 'dark-by-construction',
    door: Object.freeze({
      kind: 'generation-dial',
      configKey: '_densityLawVersion',
      dialModule: 'src/domain/density/densityLaw.js',
      dialExport: 'NEW_SETTLEMENT_DENSITY_LAW_VERSION',
      litModule: 'src/domain/density/densityLaw.js',
      litExport: 'REGISTER_VII_DENSITY_LAW_VERSION',
    }),
    lighting: 'The Register VII density roll writes each seated member\'s rung role, and the shipped dial is 1 '
      + 'against a register version of 2, so no world a player generates carries the key at all. The estate has '
      + 'known this key was unread since D1 and says so in its own source at '
      + 'src/generators/density/titularSuccession.js:29; what it lacked was an instrument that could hold the '
      + 'claim, because the write is a computed property key behind RUNG_ROLE_FIELD and no text probe can see it. '
      + 'The dormancy is now an executed bit rather than a comment.',
    car: '§7 WRWALKER Car 4, the reason-aware clauses ruled at ledger §882.15',
    charter: '§7 WRWALKER, the drafted register row 2, writer CONFIRMED at applyDensityLaw.js:428',
  }),
  Object.freeze({
    identity: 'cultureProfileKey on config',
    key: 'cultureProfileKey',
    shape: 'config',
    writer: 'src/generators/steps/resolveConfig.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/generateSettlementPipeline.js',
      symbol: 'the regeneration path, which re-reads the resolved cultural identity key',
    }),
    why: 'The resolved culture profile KEY is plumbing, not a fact about the settlement. It is written by '
      + 'resolveConfig so the regeneration path can re-resolve the same cultural identity deterministically, and it '
      + 'is read only inside src/generators — behind the closure STOP by construction, so no customer surface can '
      + 'reach it and none should. What a player is shown is the culture NAME on the config, which is LIT at grade R '
      + 'on the campaign PDF, the dossier, the world book and the web display. The key beside it is the seed of that '
      + 'name, and showing a profile key to a player would be showing them the engine.',
    charter: '§7 WRWALKER, the drafted register row 3, adjudicated DARK by Car 0 at C-prime',
  }),
  Object.freeze({
    identity: 'isolationSupport on settlement',
    key: 'isolationSupport',
    shape: 'settlement',
    writer: 'src/generators/steps/assembleSettlement.js',
    reason: 'pending-surface',
    surface: 'web-display',
    car: '§12 WRW-2, the owner row that rules whether the isolation-support finding is shown',
    carArtifact: 'docs/GENERATION_CONTRACTS.md',
    why: 'Every settlement carries a full isolation-support finding — whether the place can be supplied at all, by '
      + 'which paths, at what tier, and what it would take to close the gap — and no component, display read model '
      + 'or PDF reads the container. It is one of exactly three settlement-root facts that reach no customer '
      + 'surface. This is not plumbing: it is a generated judgement about the settlement that a player would want, '
      + 'and the owner rules whether it is shown and where. Until that ruling it is an owed car, not an exemption.',
    charter: '§7 WRWALKER, the drafted register row 6, measured DARK by Car 0 at C-prime',
  }),
  Object.freeze({
    identity: 'magicDependent on isolationSupport',
    key: 'magicDependent',
    shape: 'isolationSupport',
    writer: 'src/generators/isolationSupport.js',
    reason: 'pending-surface',
    surface: 'web-display',
    car: '§12 WRW-2, the owner row that rules whether the isolation-support finding is shown',
    carArtifact: 'docs/GENERATION_CONTRACTS.md',
    why: 'Whether a settlement depends on magic to stay supplied is a striking fact about the place, and it is one '
      + 'of only two keys on the isolation-support shape that no surface reads even at name level — its seven '
      + 'siblings all read LIT-NAME. That asymmetry is the evidence it was overlooked rather than declined: a '
      + 'surface that shows the status and the tier is already in front of this fact and does not print it. The '
      + 'owner rules it with the container it belongs to.',
    charter: '§7 WRWALKER, the drafted register row 6, measured DARK by Car 0 at C-prime',
  }),
  Object.freeze({
    identity: 'requiredCapacity on isolationSupport',
    key: 'requiredCapacity',
    shape: 'isolationSupport',
    writer: 'src/generators/isolationSupport.js',
    reason: 'pending-surface',
    surface: 'web-display',
    car: '§12 WRW-2, the owner row that rules whether the isolation-support finding is shown',
    carArtifact: 'docs/GENERATION_CONTRACTS.md',
    why: 'The capacity a settlement would REQUIRE to end its isolation is the actionable half of the finding — the '
      + 'number that turns a status into something a player can plan against — and it reaches no surface, while the '
      + 'deficit and capacity beside it read LIT-NAME. Showing a settlement it is isolated without showing what '
      + 'would fix it is the half-told version of the fact, so this key rides with the container to the same owner '
      + 'ruling rather than being banked as unreviewed.',
    charter: '§7 WRWALKER, the drafted register row 6, measured DARK by Car 0 at C-prime',
  }),
  Object.freeze({
    identity: 'supersessionReason on proposals',
    key: 'supersessionReason',
    shape: 'proposals',
    writer: 'src/domain/worldPulse/proposalAdmission.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/worldPulse/worldPulseFeedCuration.js',
      symbol: 'reconcileSupersededProposalNews, which retires the queued question of a superseded row by its reason',
    }),
    why: 'Why a docket row was superseded is plumbing. The engine writes a closed reason code (record_mode_upgrade,'
      + ' bilateral_peace_lapsed, peacetime_suit_overtaken_by_war) so the feed reconcile can retire the queued'
      + ' question of a row whose premise died, and that reconcile is its only reader. What the DM is shown is the'
      + ' row itself in the Herald resolved log, timed by supersededAt, which that log reads. A surface that wants to'
      + ' explain a supersession would voice the cause in words, never print this code.',
    charter: '§7 WRWALKER, the row CURE-PEACE-1 owes for U1 (the chair ruling FP-17): the retirement writer is the'
      + ' first the executed corpus runs, measured DARK at the integration tip 6cf6920d4',
  }),
]);

const SECTION = /§\d+/;
const WRITER_PATH = /^src\/[^\s]*\.(js|jsx)$/;
const IDENTITY = /^\S+ on \S+$/;

/**
 * THE STRUCTURAL LAW — runs at module load. A malformed row must be impossible to
 * ship, not merely reported: an unverifiable row that survives to the gate has
 * already done its damage by looking like a decision.
 */
export function assertWriterDarkRegister(entries = WRITER_DARK_REGISTER) {
  if (!Array.isArray(entries)) throw new Error('writer dark register must be an array');
  const seen = new Set();
  for (const row of entries) {
    const label = JSON.stringify(row?.identity ?? row);
    if (!row || typeof row !== 'object') throw new Error(`writer dark register row is not an object: ${label}`);
    if (!DARK_REASONS.includes(row.reason)) {
      throw new Error(`writer dark register row ${label} carries an unknown reason ${JSON.stringify(row.reason)};`
        + ` the closed set is ${DARK_REASONS.join(', ')}.`);
    }
    const fields = Object.keys(row).sort().join(',');
    if (fields !== CANONICAL_FIELDS[row.reason]) {
      throw new Error(`writer dark register row ${label} (${row.reason}) has noncanonical fields: got`
        + ` [${fields}], expected [${CANONICAL_FIELDS[row.reason]}]. A foreign field is a claim nothing checks.`);
    }
    if (!IDENTITY.test(row.identity)) {
      throw new Error(`writer dark register row ${label} is not a "<key> on <shape>" identity`);
    }
    parseLeafBaselineIdentity(row.identity);
    if (row.identity !== `${row.key} on ${row.shape}`) {
      throw new Error(`writer dark register row ${label} does not name its own key and shape:`
        + ` expected ${JSON.stringify(`${row.key} on ${row.shape}`)}`);
    }
    if (seen.has(row.identity)) throw new Error(`writer dark register row ${label} is DUPLICATED`);
    seen.add(row.identity);
    if (!WRITER_PATH.test(row.writer)) {
      throw new Error(`writer dark register row ${label} names a writer that is not a repo-relative src/ module:`
        + ` ${JSON.stringify(row.writer)}`);
    }
    if (!SECTION.test(row.charter)) {
      throw new Error(`writer dark register row ${label} carries no chartering section in "charter"`);
    }
    const prose = row.reason === 'dark-by-construction' ? row.lighting : row.why;
    if (typeof prose !== 'string' || prose.length < 80) {
      throw new Error(`writer dark register row ${label} must explain itself in at least 80 characters;`
        + ` got ${prose?.length ?? 0}. A row nobody can read is a row nobody can veto.`);
    }
    if (row.reason === 'dark-by-construction') {
      assertDoor(row);
      if (!SECTION.test(row.car)) throw new Error(`writer dark register row ${label} carries no § in "car"`);
    }
    if (row.reason === 'engine-internal') {
      if (!row.consumer || typeof row.consumer.file !== 'string' || typeof row.consumer.symbol !== 'string') {
        throw new Error(`writer dark register row ${label} must name a consumer { file, symbol }`);
      }
    }
    if (row.reason === 'pending-surface') {
      if (!COUNTING_CLASSES.includes(row.surface)) {
        throw new Error(`writer dark register row ${label} names surface ${JSON.stringify(row.surface)}, which is not`
          + ` a COUNTING class. A pending surface is one a customer will SEE; the counting classes are`
          + ` ${COUNTING_CLASSES.join(', ')}.`);
      }
      if (!SECTION.test(row.car)) throw new Error(`writer dark register row ${label} carries no § in "car"`);
      if (typeof row.carArtifact !== 'string' || !row.carArtifact) {
        throw new Error(`writer dark register row ${label} must name an in-tree carArtifact; a § alone is not`
          + ' existence-checkable from the build worktree.');
      }
    }
  }
  return entries;
}

function assertDoor(row) {
  const label = JSON.stringify(row.identity);
  const door = row.door;
  if (!door || !['simulation-flag', 'generation-dial'].includes(door.kind)) {
    throw new Error(`writer dark register row ${label} carries an unknown door kind ${JSON.stringify(door?.kind)}`);
  }
  if (door.kind === 'simulation-flag') {
    if (!SIMULATION_FLAG_PATTERN.test(door.flag ?? '')) {
      throw new Error(`writer dark register row ${label} names a simulation flag that is not spelled`
        + ` <name>Enabled: ${JSON.stringify(door.flag)}`);
    }
    return;
  }
  for (const field of ['configKey', 'dialModule', 'dialExport', 'litModule', 'litExport']) {
    if (typeof door[field] !== 'string' || !door[field]) {
      throw new Error(`writer dark register row ${label} generation-dial door is missing ${field}`);
    }
  }
  if (!door.configKey.startsWith('_')) {
    throw new Error(`writer dark register row ${label} generation-dial configKey must start with "_":`
      + ` ${JSON.stringify(door.configKey)}`);
  }
  for (const field of ['dialModule', 'litModule']) {
    if (!door[field].startsWith('src/domain/')) {
      throw new Error(`writer dark register row ${label} generation-dial ${field} must live under src/domain/:`
        + ` ${JSON.stringify(door[field])}`);
    }
  }
}

/**
 * THE CONVICTION ARM — every scan, throwing `UNVERIFIABLE (clause n)`.
 *
 * W       the writer still writes the key, in one of the four measured spellings.
 * D-flag  REUSED VERBATIM from OSR's `assertVirtualDormantWriterEvidence` — one
 *         conviction machinery for one claim shape, rather than a second copy
 *         that can drift from the first.
 * D-dial  the shipped dial differs from the lit one, EXECUTED, and (once Car 3's
 *         arm exists) the identity is in `dialGated`. A dormancy claim is a bit.
 * E       the consumer exists, READS the key in CODE, and is in NO counting
 *         closure — else that identity would be LIT and the row is wrong.
 * P       the car cites a section AND resolves to an in-tree artifact that names
 *         the fact; the surface is a counting class the identity does not reach;
 *         the population is within its banked ceiling.
 * S       the identity is still DARK. A row that outlives its darkness is a WIN
 *         to be banked, not a row to be kept.
 */
export async function assertWriterDarkRegisterEvidence(entries = WRITER_DARK_REGISTER, {
  root,
  verdicts = null,
  closures = null,
  dialGated = null,
  pendingCeiling = null,
  readSource = (path) => readFileSync(join(root, path), 'utf8'),
  fileExists = (path) => existsSync(join(root, path)),
  importModule = (path) => import(join(root, path)),
  virtualEvidence = assertVirtualDormantWriterEvidence,
} = {}) {
  const evidence = [];
  let pending = 0;
  for (const row of entries) {
    const label = JSON.stringify(row.identity);
    const fail = (clause, message) => {
      throw new Error(`writer-reach dark register row ${label} is UNVERIFIABLE (clause ${clause}): ${message}`);
    };

    // ── W — REASON-AWARE (chair, ledger §882.15) ──
    const isDialRow = row.reason === 'dark-by-construction' && row.door.kind === 'generation-dial';
    let writerSource;
    try { writerSource = readSource(row.writer); } catch {
      fail('W', `its writer cannot be read: ${row.writer}`);
    }
    let spellings = writeShapesIn(writerSource, row.key);
    let writeProof;

    if (isDialRow) {
      // ⭐ THE WIDENING, AND IT IS NARROW BY CONSTRUCTION. A generation-dial row's
      // key is written on a world nobody ships, so the TEXT probe is the wrong
      // instrument twice over: `customContentRoster` is written by ASSIGNMENT
      // (`finalCtx.settlement.customContentRoster = …`) and `densityRungRole`
      // through a COMPUTED PROPERTY KEY behind a constant (`[RUNG_ROLE_FIELD]: …`),
      // and neither is one of OSR's four measured spellings. Clause W therefore
      // convicted both as "the writer stopped writing", which is FALSE — the estate
      // says so itself at src/generators/density/titularSuccession.js:29:
      // "`densityRungRole` (`RUNG_ROLE_FIELD`) has been WRITTEN since D1 and READ
      // BY NOTHING."
      //
      // So for THIS REASON ONLY the write proof is MEMBERSHIP IN `dialGated` — the
      // write OBSERVED BY EXECUTION (present in a lit corpus, absent from a shipped
      // one) rather than inferred from source text. It is strictly stronger than the
      // probe it replaces, and it is scoped: every other reason keeps the text probe,
      // so a row that merely writes by assignment gains nothing from this clause.
      //
      // ⛔ AND IT NEVER PASSES ON MISSING EVIDENCE. Without a measured `dialGated`
      // the row is UNVERIFIABLE, not excused — an absent measurement is the one
      // input a conviction clause must never read as innocence.
      if (!dialGated) {
        fail('W', 'it is a generation-dial row and no measured dialGated set was supplied, so its write cannot'
          + ' be observed. A dormancy claim is a BIT claim; build the lit corpus or strike the row. An absent'
          + ' measurement is not an acquittal.');
      }
      if (!dialGated.has(row.identity)) {
        fail('W', `it is not in the measured dialGated set, so a lit world does not write it either and there is`
          + ' no dormancy to claim. A dormancy claim is a BIT claim: present lit, absent dark.');
      }
      writeProof = 'dialGated membership (executed: present lit, absent dark)';
      spellings = spellings.length ? spellings : ['(none — written by assignment or a computed key)'];
    } else {
      if (!spellings.length) {
        fail('W', `${row.writer} no longer writes ${JSON.stringify(row.key)} in any measured write spelling.`
          + ' A row whose writer stopped writing is a row about nothing; strike it.');
      }
      writeProof = `source text (${spellings.join(', ')})`;
    }

    if (row.reason === 'dark-by-construction' && row.door.kind === 'simulation-flag') {
      await virtualEvidence([{
        identity: row.identity, writer: row.writer, key: row.key, flag: row.door.flag,
        lighting: row.lighting, charter: row.charter,
      }], { root, readSource });
    }

    if (row.reason === 'dark-by-construction' && row.door.kind === 'generation-dial') {
      const dial = (await importModule(row.door.dialModule))[row.door.dialExport];
      const lit = (await importModule(row.door.litModule))[row.door.litExport];
      if (dial === lit) {
        fail('D-dial', `the shipped dial ${row.door.dialExport} already EQUALS the lit ${row.door.litExport}`
          + ` (${JSON.stringify(dial)}), so the key is written on every world and this read must be judged`
          + ' normally. Retire the row rather than outliving its own premise.');
      }
      // The membership half of this clause MOVED TO W (ledger §882.15): "is it
      // written" is W's question, and W now answers it with the same executed bit.
      // What remains here is the door itself — is the shipped dial still behind the
      // lit one — which is the question only this clause can ask.
    }

    if (row.reason === 'engine-internal') {
      if (!fileExists(row.consumer.file)) fail('E', `its consumer does not exist: ${row.consumer.file}`);
      const code = codeOnly(readSource(row.consumer.file));
      if (!new RegExp(`(?<![\\w$])${escapeForRegExp(row.key)}(?![\\w$])`).test(code)) {
        fail('E', `${row.consumer.file} does not READ ${JSON.stringify(row.key)} in code. A name that appears only`
          + ' in a comment or a string literal is prose, not a use — the citation law.');
      }
      if (closures) {
        for (const cls of COUNTING_CLASSES) {
          if ((closures[cls] || new Set()).has(row.consumer.file)) {
            fail('E', `${row.consumer.file} is inside the ${cls} closure, so this identity would be LIT and the`
              + ' row is wrong about its own reason.');
          }
        }
      }
    }

    if (row.reason === 'pending-surface') {
      pending += 1;
      if (!fileExists(row.carArtifact)) {
        fail('P', `its car names ${row.carArtifact}, which does not exist in this tree. A § is not`
          + ' existence-checkable from the build worktree; the artifact is what makes the citation resolvable.');
      }
      const artifact = readSource(row.carArtifact);
      if (!artifact.includes(row.key) && !artifact.includes(row.shape)) {
        fail('P', `${row.carArtifact} names neither ${JSON.stringify(row.key)} nor ${JSON.stringify(row.shape)},`
          + ' so it does not record the fact this row defers. A citation that does not mention its subject is a'
          + ' citation to nothing.');
      }
      const reached = verdicts?.get(row.identity)?.reach ?? {};
      if (reached[row.surface]) {
        fail('P', `the identity already reaches ${row.surface} at grade ${reached[row.surface]}, so that surface is`
          + ' not pending. Name a surface it does not reach, or bank the win.');
      }
    }

    if (verdicts) {
      const live = verdicts.get(row.identity);
      if (isDialRow) {
        // ── S, INVERTED FOR THIS REASON (chair, ledger §882.15) ──
        // A generation-dial identity is EXPECTED to be absent from the judged
        // population: that absence IS the dormancy this row claims. Convicting it
        // would convict every correct dial row. What convicts instead is PRESENCE,
        // in two flavours that need different instructions.
        if (live && live.verdict === 'LIT') {
          fail('S', `the identity is now ${live.verdict}. BANK THE WIN — strike the row; a lit-dial identity that`
            + ' gained a surface reader must be banked, never silently lit.');
        }
        if (live) {
          fail('S', `the dial has ROLLED: a shipped world now writes ${row.identity} (judged ${live.verdict}), so`
            + ' the dormancy premise is dead. Retire the generation-dial row and let the identity be judged'
            + ' normally, as an ordinary written key.');
        }
      } else {
        if (!live) {
          fail('S', 'the identity is not in the judged population at all. A row about a key no shape carries above'
            + ' MIN_ROWS is a row about nothing.');
        }
        if (live.verdict !== 'DARK') {
          fail('S', `the identity is now ${live.verdict}, not DARK. BANK THE WIN — strike the row; a registered row`
            + ' that outlives its darkness is an exemption nobody is watching.');
        }
      }
    }
    evidence.push({ identity: row.identity, reason: row.reason, writer: row.writer, spellings, writeProof });
  }

  if (pendingCeiling !== null && pending > pendingCeiling) {
    throw new Error(`writer-reach pending-surface population GREW: ${pending} rows against a banked ceiling of`
      + ` ${pendingCeiling}. The cohort is shrink-only — a row may leave, none may join — because a pending-surface`
      + ' row silences a DARK identity by a code-only edit. The one growth door is --rebank --charter=§NNN.');
  }
  return evidence;
}

function escapeForRegExp(text) { return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** READERREVIEW's seed — every pending-surface row, sorted by surface then identity. */
export function pendingSurfaceBacklog(entries = WRITER_DARK_REGISTER) {
  return entries
    .filter((row) => row.reason === 'pending-surface')
    .map((row) => ({
      identity: row.identity, key: row.key, shape: row.shape,
      surface: row.surface, car: row.car, carArtifact: row.carArtifact, why: row.why,
    }))
    .sort((a, b) => (a.surface === b.surface
      ? (a.identity < b.identity ? -1 : 1)
      : (a.surface < b.surface ? -1 : 1)));
}

/** The register's content address. It MOVES whenever a row is struck or added. */
export function registerDigestOf(entries = WRITER_DARK_REGISTER) {
  return createHash('sha256').update(canonicalJson(entries.map((row) => ({ ...row })))).digest('hex');
}

export { COUNTING_CLASSES, SURFACE_CLASSES };
