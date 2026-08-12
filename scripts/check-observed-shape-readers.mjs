#!/usr/bin/env node
/**
 * check-observed-shape-readers.mjs — THE READER-WITH-NO-WRITER RATCHET.
 *
 * THE CLASS. A reader asks a record for a key NO WRITER EVER PRODUCES. Because
 * the read is defensively guarded (`x?.id`, `String(x.foo || '')`,
 * `containers.find(r => Array.isArray(r.exports))`), it does not throw — it
 * degrades to a default, and the arm behind it is structurally dead forever.
 * Nothing reds. Three were found by accident in one week
 * (TCD-1 `.id` on a RulingFaction, TCD-2 `exports` on economicState/economy/
 * trade, TCD-3 `satellite.foundingTier`), plus the recorded
 * `faction-key-defect-class`. Nobody knew how many more there were. This is the
 * machinery that answers that question and keeps answering it.
 *
 * HOW IT DECIDES. Two halves, both derived, neither transcribed:
 *   scripts/lib/observed-shape-corpus.mjs  EXECUTES the real producers across a
 *     multi-seed corpus and histograms the keys each record shape ACTUALLY
 *     carries. Types are not consulted: they were wrong or silent on all three.
 *   scripts/lib/legacy-reader-shape-scan.mjs   THE GATE AUTHORITY (schema 4).
 *     The governed, byte-frozen heuristic detector: it grounds each receiver by
 *     a name prior over the observed shape set and reports reads whose key
 *     appears in NO run. Fast, total, and it terminates on every tree.
 *   scripts/lib/reader-shape-scan.mjs      THE TARGETED EXACT INSTRUMENT.
 *     Resolves each property read to the exact executed origin its receiver
 *     holds. Reachable only through `--scan-only --scan-mode=exact-origin`,
 *     because full-tree exact resolution walls (CR-OSR-FREEZE-1).
 *
 * ⚠ UNION, NEVER INTERSECTION. A key present in ANY seed is written. Only a key
 * present in NO seed is a finding. Situational keys (`modifier`, `isGoverning`,
 * `modifiers`, `legitimacyCrisis`) appear in some seeds only; treating absence
 * in one run as evidence would flood the report and get this turned off.
 *
 * SHRINK-ONLY, AND CONTENT-ADDRESSED. The estate has pre-existing violations
 * beyond the three, and fixing them is a separate wave. The frozen inventory is
 * a per-file, PER-FINDING-IDENTITY ceiling.
 *
 * ⚠⚠ WHY IDENTITIES AND NOT COUNTS. The first spelling froze one NUMBER per
 * file, and a number cannot tell a defect from its neighbour. A verifier drove
 * it live on `src/domain/rulingPower.js` (ceiling 10): remove one real finding,
 * add a different one, and the count is unchanged — so a FRESH reader-without-a-
 * writer lands GREEN behind a ratchet that reports nothing. A per-file count is
 * blind to IDENTITY SWAP by construction. The inventory therefore freezes the
 * finding IDENTITY — under schema 4, `<key> on <shape>` with its multiplicity.
 * A NEW identity in an already-listed file has ceiling 0 and REDS even when the
 * file's TOTAL does not move, exactly as a new file does.
 *
 * ⚠ THE IDENTITY DELIBERATELY EXCLUDES THE LINE NUMBER. Lines churn on every
 * unrelated edit above them; a line-keyed baseline would red on whitespace and
 * be deleted within a week.
 *
 * A file over any of its numbers fails, a file with no row has ceiling 0, and a
 * fixed site is banked by LOWERING or DELETING its identity row. Never raise one.
 *
 * USAGE
 *   node scripts/check-observed-shape-readers.mjs            gate (exit 1 on growth)
 *   node scripts/check-observed-shape-readers.mjs --report   list every finding
 *   node scripts/check-observed-shape-readers.mjs --write    re-freeze (deliberate)
 *   node scripts/check-observed-shape-readers.mjs --scan-only
 *     --scan-mode=legacy-leaf --json=<external-p>
 *                        write the governed HEURISTIC artifact (the schema-4
 *                        authority; executes the corpus fresh)
 *   node scripts/check-observed-shape-readers.mjs --scan-only --json=<external-p>
 *                        write a TARGETED exact governed artifact
 *   node scripts/check-observed-shape-readers.mjs --scan-only
 *     --scan-mode=legacy-leaf --corpus-artifact=<exact-p> --json=<external-p>
 *                        pin both legs to ONE executed corpus (optional)
 *   node scripts/check-observed-shape-readers.mjs --scan-only --json=<external-p>
 *     --progress 2> <external-progress.jsonl>     emit durable JSONL read progress
 * Artifact outputs are always outside the repository and never overwrite.
 * OSR_SUBJECT_SHA/OSR_SCANNER_SHA are accepted only for immutable Git-less
 * historical archives; authoritative current scans bind directly to clean HEAD.
 */
import { execFileSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import {
  closeSync, constants, existsSync, fsyncSync, lstatSync, openSync, readFileSync,
  readdirSync, renameSync, statSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { buildObservedCorpus } from './lib/observed-shape-corpus.mjs';
import {
  assertBaselineRow,
  BASELINE_SCHEMA,
  MIN_ROWS,
  ORIGIN_MIN_ROWS,
  RETIRED_EXACT_BASELINE_SCHEMA,
  RETIRED_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA,
  validateSchema6Baseline,
} from './lib/observed-shape-baseline.mjs';
import {
  parseExactFlags,
  planExternalArtifactOutputs,
  publishJsonExclusive,
} from './lib/governed-artifact-io.mjs';
import {
  artifactBaselineSchemaOf,
  artifactIdentityOf,
  artifactInventoryOf,
  assertHealthyScanProvenance,
  canonicalJson,
  createScanArtifact,
  digestOf,
  fileManifestFromEntries,
  fileManifestOf,
  governedLegacyAlgorithmOf,
  scanSentinelOf,
  validateScanArtifact,
} from './lib/observed-shape-governance.mjs';
import { scanReaders as scanLegacyReaders } from './lib/legacy-reader-shape-scan.mjs';
import { scanReaders } from './lib/reader-shape-scan.mjs';
import { validateMigrationBundle } from './migrate-observed-shape-readers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = join(ROOT, 'scripts/.observed-shape-readers-baseline.json');

/**
 * 1 = one COUNT per file (retired: blind to identity swap).
 * 2 = per leaf-name identity, ungoverned envelope (the migration predecessor).
 * 3 = per path-qualified executed origin identity (RETIRED — see below).
 * 4 = per leaf-name identity in the GOVERNED envelope, RAW detector output (RETIRED).
 * 5 = the same identity narrowed by M6 + M8/M9 alone (RETIRED).
 * 6 = the same identity narrowed by ALL FOUR declared post-filters — M6, M11,
 *     M12 and M8/M9. THE LIVE AUTHORITY.
 */
export {
  BASELINE_SCHEMA, MIN_ROWS, ORIGIN_MIN_ROWS,
  RETIRED_EXACT_BASELINE_SCHEMA, RETIRED_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA,
};

/**
 * ⭐⭐ CR-OSR-FREEZE-1/2/3-R1 — THE GATE AUTHORITY IS THE HEURISTIC LEG.
 *
 * After four measured walls (the original never-terminating read, prototypes P1
 * and P2, and the `src/data/constants.js:56` growth wall at 16,385 > 16,384),
 * full-tree EXACT resolution is retired as an ambition. The exact instrument
 * survives for TARGETED per-read/per-file probes — reachable only through
 * `--scan-only --scan-mode=exact-origin`, where it is proven — and the governed
 * heuristic (`legacy-leaf`) detector becomes the standing full-tree authority
 * that the gate, `--report` and `--write` all drive.
 *
 * ⚠ CONSEQUENCE, STATED SO IT IS NEVER READ AS AN ACCIDENT: the heuristic leg is
 * handed the UNFILTERED file census and carries NO scope exclusion, so
 * `src/components/` — excluded from EXACT resolution by CR-OSR-SCOPE-1 — is now
 * under direct gate enforcement. CR-OSR-SCOPE-1's exclusion binds the EXACT
 * instrument ONLY. That is CR-OSR-FREEZE-7's intended answer to the freeze
 * docket's open question, and it RAISES coverage rather than reducing it.
 */
export const BASELINE_SCAN_MODE = 'legacy-leaf';

/**
 * A shape seen fewer times than this is too thin to judge a read against.
 * MEASURED, not guessed (at eca65c8a, the pre-fix sha where all three ground
 * truths still exist): 8 → 4,969 findings; 40 → 3,221; 120 → 3,084; 400 →
 * 2,604 but TCD-3 ESCAPES, because the SatelliteRecord shape carries 222 rows
 * and a threshold above that blinds the walker to the defect that motivated it.
 * 40 keeps a 5.5× margin under the thinnest ground truth while dropping a third
 * of the noise — the trade this number exists to make.
 */
export const SCAN_CONFIG = Object.freeze({
  corpusGraphSchema: 2,
  minRows: MIN_ROWS,
  originMinRows: ORIGIN_MIN_ROWS,
});

/** Scanner contents are separate provenance from the source tree under test. */
export function scannerToolFiles(root = ROOT) {
  return [
    'package.json',
    'package-lock.json',
    'scripts/check-observed-shape-readers.mjs',
    'scripts/lib/governed-artifact-io.mjs',
    'scripts/lib/legacy-reader-shape-scan.mjs',
    'scripts/lib/observed-shape-baseline.mjs',
    'scripts/lib/observed-shape-corpus.mjs',
    'scripts/lib/observed-shape-governance.mjs',
    'scripts/lib/reader-shape-scan.mjs',
    'scripts/migrate-observed-shape-readers.mjs',
    'tests/fixtures/spatialPackFixtures.js',
  ].map((file) => join(root, file));
}

/** Every `.js`/`.jsx` under `src/` — the whole app, not just `src/domain`: the
 *  recorded SP-D repair proved a law scoped to one subtree leaves the UI layer,
 *  where a defect actually reaches a player, entirely unscanned. */
export const isObservedShapeScanPath = (path) => (
  /\.(js|jsx)$/.test(path) && !path.endsWith('.generated.js')
);

export const isObservedShapeSubjectPath = (path) => /\.(js|jsx|json)$/.test(path);

/**
 * ⭐⭐ CR-OSR-SCOPE-1 (Fable chair, 2026-08-09, vetoable) — THE DECLARED UI-LAYER
 * EXCLUSION FROM **EXACT** RESOLUTION. Verbatim from the ruling:
 *
 *   "The exact scanner's mission is guarding domain generation shapes; UI
 *    components (src/components/**) are downstream projections of those shapes,
 *    still covered by the heuristic leg. After three measured walls (the
 *    original never-terminating read, P1/P2 both rejected, and now a
 *    genuine-growth budget failure at a UI read), the marginal value of exact
 *    resolution inside the UI layer does not justify a fourth analyzer round.
 *    The exclusion must be DECLARED MACHINERY, never silent."
 *
 * The third wall is `src/components/SettlementsPanel.jsx:359`
 * (`updatedSaves.filter(...).map(s => s.id)` through the 959-line
 * `factionRename.js`): a BOUNDED verdict in ~145 s that fails the 16,384
 * abstract-state growth budget. `budgetFailure` THROWS, and nothing catches it
 * in the scan loop, so that one UI read aborts the WHOLE full-tree exact scan.
 *
 * WHY THIS IS MACHINERY AND NOT A COMMENT:
 *   · SCOPE PREFIX, never a per-file list — a per-file list rots the moment a
 *     component is renamed and then silently excludes nothing (or something
 *     else). One prefix cannot rot.
 *   · EXACT IDENTITY + SHRINK-ONLY — the frozen ceiling for this list is pinned
 *     in tests/lint/readerShapeResolver.test.js as a SUBSET check, so ADDING any
 *     entry reds. Shrinking (returning a scope to exact resolution) is legal.
 *   · UI-ONLY, ASSERTED AT DECLARATION — `assertExactScanExcludedScope` runs at
 *     module load, so a `src/domain/**` entry cannot be quietly added: it throws
 *     before any scan, gate, or write can begin. The predicate is TOTAL
 *     (every entry must start with an allowed UI root), never an enumeration of
 *     forbidden roots, which would fail open on the root nobody listed.
 *   · REPOSITORY-RELATIVE — never matched against an absolute path, because an
 *     absolute prefix test matches the CHECKOUT'S OWN directory name.
 *   · READ SITES ONLY — excluded files still enter the program index, so domain
 *     reads whose provenance passes through a component resolve unchanged.
 *   · RECORDED IN EVERY SCAN — `stats.excludedReadScopes` / `excludedReadFiles`
 *     travel into every artifact, and `--progress` emits them on `scan-start`.
 *
 * ⚠ THE HEURISTIC LEG IS THE OTHER HALF OF THIS RULING. `scanLegacyReaders` is
 * handed the UNFILTERED `before.files` below and MUST STAY UNFILTERED; it is
 * the coverage this exclusion leans on, and under schema 4 it is no longer a
 * fallback but the gate authority itself (see `BASELINE_SCAN_MODE`).
 *
 * ⚠⚠ THE FIGURE THAT USED TO SIT HERE WAS THE WRONG ARTIFACT'S. "88 files / 250
 * identities" is the SCHEMA-2 predecessor's `src/components/` slice, produced by
 * the EXACT detector at `ec525a59` and leaf-spelled. The schema-4 genesis
 * inventory is produced by the HEURISTIC detector and measures 53 files / 162
 * identities / 260 counts. Nothing here restates either number: `cohortOf()`
 * DERIVES it from whichever inventory it is handed, so the figure cannot rot.
 */
export const EXACT_SCAN_EXCLUDED_SCOPE = Object.freeze(['src/components/']);

/** The UI roots an exclusion may name. TOTAL positive predicate: an entry that
 *  is not under one of these is refused, so no unlisted root fails open. */
const EXACT_SCAN_EXCLUDABLE_UI_ROOTS = Object.freeze(['src/components/']);

/** Fail-closed at declaration: a DOMAIN scope cannot be quietly added. */
export function assertExactScanExcludedScope(scopes = EXACT_SCAN_EXCLUDED_SCOPE) {
  if (!Array.isArray(scopes)) {
    throw new Error('observed-shape EXACT_SCAN_EXCLUDED_SCOPE must be an array of scope prefixes');
  }
  for (const scope of scopes) {
    if (typeof scope !== 'string' || !scope.endsWith('/') || scope.startsWith('/')) {
      throw new Error(`observed-shape excluded scope must be a repository-relative directory prefix ending in "/"; received ${JSON.stringify(scope)}`);
    }
    if (!EXACT_SCAN_EXCLUDABLE_UI_ROOTS.some((root) => scope.startsWith(root))) {
      throw new Error(`observed-shape excluded scope ${JSON.stringify(scope)} is outside the UI layer.`
        + ` CR-OSR-SCOPE-1 excludes ONLY downstream UI projections (${EXACT_SCAN_EXCLUDABLE_UI_ROOTS.join(', ')});`
        + ' a domain scope would remove exact coverage from the shapes this instrument exists to guard.');
    }
  }
  return scopes;
}
assertExactScanExcludedScope();

/** True when a REPOSITORY-RELATIVE forward-slash path is excluded from exact
 *  resolution. Never pass an absolute path: see the note above. */
export const isExactScanExcludedReadPath = (relativePath) => (
  EXACT_SCAN_EXCLUDED_SCOPE.some((scope) => String(relativePath).startsWith(scope))
);

/**
 * ⭐⭐ CR-OSR-FREEZE-6 (Fable chair, 2026-08-10) / CR-OSR-FREEZE-6-R1 — THE
 * SHAPE-FAMILY POST-FILTER, "M6". Sibling machinery to the exclusion above, and
 * declared the same way: in source, measured, and controlled.
 *
 * THE DEFECT IT REMOVES — SIBLING-SLICE POVERTY. In the leaf-name view this leg
 * consumes, a shape's NAME is the container key it was walked under
 * (`shapeNameOf`), so one pipeline record observed at several stages under
 * several sibling keys becomes several SEPARATE shapes, each holding only the
 * keys its own stage exposed. The resolver then binds a reader to whichever of
 * those names its evidence path happens to spell — for `outcome` reads, the
 * grounded property-access rule firing on `proposal.outcome`, whose only walked
 * home is the proposal's stored clone (`applyWorldPulse.js`, `outcome:
 * clone(outcome)`) and never the enriched applied record. The detector convicts
 * every read of a key only the fatter siblings happened to carry, while reads of
 * keys NO sibling carries still red — which is why this filter is per-KEY and
 * not per-binding.
 * ⚠ NOT POLYMORPHIC MIS-BINDING, AND THE READING HAS NOW BEEN PROPOSED TWICE.
 * `scanReaders` refuses to emit a finding unless the receiver resolves to
 * EXACTLY ONE shape (`legacy-reader-shape-scan.mjs`, the `objects.length === 1`
 * guard), so a receiver that genuinely bound to several shapes produces no
 * finding at all and no such row ever reaches this filter. The executed
 * corroboration is in the committed inventory: from the SAME `outcome` parameter
 * of the SAME function, `deityReembed`, `foodStockpileDeltas`, `lifecyclePatch`,
 * `powerTransfer` and `resourceMembership` survive while `populationDeltas`,
 * `tierChange` and `resourcePatch` clear. Identical binding, identical receiver,
 * identical function; the split is purely per-KEY, which a binding-level defect
 * cannot produce.
 * Measured at HEAD (857e3a1a), the two shapes this reaches:
 *   outcome    48 keys / 756 rows, family {selected 121k, candidates 101k,
 *              autoApplied 111k}                       → union 141 keys
 *   stressors  33 keys / 162 rows, family {selected, candidates, autoApplied,
 *              resolvedStressors 27k, stressor 27k}    → union 146 keys
 * `src/domain/worldPulse/applyWorldPulse.js` reading `outcome.populationDeltas`,
 * `outcome.tierChange`, `outcome.resourcePatch` is the shape of every row this
 * clears: real code reading a real field of its own record.
 *
 * THE RULE. A shape T joins S's family when T covers at least THETA of S's OWN
 * keys; S is then judged against keys(S) UNION keys(family(S)). ⚠ UNION, NEVER
 * INTERSECTION — the standing law for this instrument; an intersection would
 * narrow the accepted key set and INVENT findings.
 *
 * WHY A POST-FILTER AND NOT A DETECTOR CHANGE. `legacy-reader-shape-scan.mjs` is
 * BYTE-FROZEN to blob 0310fa9f (mutant-proven: appending one comment is refused
 * by `assertGovernedLegacyDetectorSource`). So this cannot be, and is not, an
 * edit to the detector: it consumes the detector's returned findings array and
 * returns a SUBSET. `scan.stats` is passed through by identity, so the
 * anti-vacuity sentinel still measures the DETECTOR's reach and this filter
 * cannot mask a detector that stopped observing.
 *
 * WHY THESE NUMBERS. Measured at HEAD over the committed schema-4 baseline's
 * 2,164 findings — theta 1.00 clears 36, 0.90 clears 50, 0.80 clears 122
 * (5.6%), 0.70 clears the same 122. 0.80 is where the `stressors` family
 * appears and below it nothing further is gained. The >=8-key guard keeps thin
 * shapes out of the relation entirely: a 2-key shape is covered by almost
 * anything, so without the guard containment is noise (theta 1.00 with no guard
 * clears rows on 10 shapes instead of 2).
 *
 * ⭐ THE ADOPTION BASIS IS ZERO ERASURE, AND IT IS MACHINERY BELOW, NOT A
 * MEASUREMENT THAT HAPPENED ONCE. See `CLASS_A_PROTECTED_IDENTITIES`.
 */
export const SHAPE_FAMILY_FILTER = Object.freeze({
  theta: 0.8,
  minKeys: 8,
});

/**
 * ⭐⭐ THE CR-OSR-FREEZE-6 CONTROL. Every identity the chair's CR-OSR-FREEZE-3-R2
 * triage classed **(a) — TRUE POSITIVE, banked pending repair**. The filter may
 * never clear one; `assertShapeFamilyDebtPreserved` throws if it does.
 *
 * PROVENANCE, so this is auditable rather than asserted: the ledger's 2,326
 * decisions are keyed by an opaque `osr-predecessor-row-v1:<digest>` whose
 * pre-image is {address, predecessorCount, legacyCount, delta, reconciliation}.
 * The addresses were recovered by REPRODUCING the row set from the schema-2
 * predecessor inventory and joining on rowId — a join proven total, 2,326 of
 * 2,326, because a partial join would silently drop protected rows. Selecting
 * the STRUCTURED tag `[CR-OSR-FREEZE-3-R2 triage a]` yields exactly 23
 * addresses over 21 distinct identities. ⚠ The structured tag is the debt
 * surface, never the prose phrase, which matches only 12 of 23 (CR-OSR-FREEZE-5).
 *
 * WHY IDENTITIES AND NOT ADDRESSES. The filter's decision is a pure function of
 * (shape, key) — it clears an IDENTITY everywhere or nowhere, so the identity is
 * exactly its decision granularity. Keying the guard on file paths would also
 * import the hand-keyed-address rot this program has already been bitten by;
 * a `<key> on <shape>` identity survives any file move.
 *
 * ⚠ 8 of these were still live at the schema-5 genesis; the others were REPAIRED
 * between the genesis and then (the baseline shrank 2,196 → 2,171 → 2,164). They
 * stay listed: the guard is against the FILTER, not a claim about what is
 * currently outstanding, and a regressed repair must not become silently
 * clearable.
 * ⭐ The guard is not vacuous — `coalitionEvidence on outcome` is live and sits
 * on `outcome`, whose union grows 48 → 141 keys under this very filter.
 *
 * ⚠⚠ ONE ROW HAS BEEN RE-TRIAGED OUT, AND THIS IS THE ONLY DIRECTION THAT
 * REDUCES ENFORCEMENT, SO IT CARRIES ITS REASON. `factions on locks` was banked
 * class-(a) on the evidence that no `setLock` call names `factions`. That
 * evidence was a GREP ARTIFACT: the writer is the DYNAMIC key row at
 * `src/components/dossier/LockControls.jsx` — a `WORLD_LOCKS` entry spelling
 * `key: 'factions'` and a `setLock(key, …)` call that resolves it at run time —
 * and it has existed since `73f00920`. The refusal to touch the row was right;
 * its stated reason was wrong. The chair therefore re-triaged it under
 * CR-OSR-SCHEMA-6 and it moves to `EXPLAINED_WRITER_EXEMPTIONS` as an M8
 * admission-list entry, which is the remedy the error message below already
 * named: *"a row banked as a real defect cannot be exempted as explained;
 * re-triage it instead."* The two acts are one commit BY NECESSITY —
 * `assertExplainedWriterExemptions` throws at module load if a class-(a)
 * identity is exempted, so the removal and the entry cannot be separated.
 */
export const CLASS_A_PROTECTED_IDENTITIES = Object.freeze([
  '__adjudicationPending on stressors',
  '__forecast on stressors',
  '__resolution on stressors',
  'authored on institutions',
  'coalitionEvidence on outcome',
  'decreed on stressors',
  'description on prominentRelationship',
  'dots on npcs',
  'evidenceId on outcome',
  'flavor on prominentRelationship',
  'flavour on prominentRelationship',
  'hooks on settlement',
  'institutions on locks',
  'notability on npcs',
  'otherSettlement on prominentRelationship',
  'plotHooks on settlement',
  'relationshipType on prominentRelationship',
  'summary on prominentRelationship',
  'supplyChains on settlement',
  'title on currentTensions',
]);

/** Key sets once per scan; the containment test is O(shapes) per bound shape. */
function shapeKeySetsOf(shapes) {
  const sets = new Map();
  for (const [name, shape] of Object.entries(shapes || {})) {
    sets.set(name, new Set(Array.isArray(shape?.keys) ? shape.keys : []));
  }
  return sets;
}

/**
 * keys(S) UNION keys(T) for every T covering >= theta of S's own keys.
 *
 * FAIL-SAFE IN BOTH DIRECTIONS OF IGNORANCE: a shape absent from the corpus, or
 * one below the size guard, yields only its own keys (possibly none) — so an
 * unknown shape clears NOTHING and the finding survives. The filter can only
 * ever remove findings it can affirmatively justify.
 */
export function shapeFamilyUnionOf(shapeName, shapes, keySets = shapeKeySetsOf(shapes)) {
  const own = keySets.get(shapeName);
  if (!own || own.size < SHAPE_FAMILY_FILTER.minKeys) return new Set(own || []);
  const union = new Set(own);
  for (const [name, keys] of keySets) {
    if (name === shapeName || keys.size === 0) continue;
    let covered = 0;
    for (const key of own) if (keys.has(key)) covered += 1;
    if (covered / own.size >= SHAPE_FAMILY_FILTER.theta) for (const key of keys) union.add(key);
  }
  return union;
}

/**
 * ⭐⭐ THE ONE HOME OF THE CLASS-(a) EROSION LAW, shared by every post-filter.
 *
 * ⚠ WHY THIS IS ONE FUNCTION AND NOT ONE PER FILTER (CR-OSR-FREEZE-8's shape).
 * Four declared filters now narrow this instrument, and every one of them is
 * adopted on the same measured property: it erases zero rows the chair banked as
 * TRUE POSITIVES. Four copies of that check would be one live law with four
 * homes, and the copy nobody tested would drift. The set intersection and the
 * refusal live here exactly once; only the PROSE differs per filter, because a
 * message that cannot say which instrument fired costs the next lane the time it
 * exists to save.
 */
function assertClassADebtPreserved(clearedIdentities, { instrument, remedy }) {
  const guarded = new Set(CLASS_A_PROTECTED_IDENTITIES);
  const erased = [...clearedIdentities].filter((identity) => guarded.has(identity));
  if (erased.length) {
    throw new Error(`${instrument} cleared ${erased.length} CR-OSR-FREEZE-3-R2 class-(a)`
      + ` TRUE-POSITIVE row(s): ${erased.join('; ')}.${remedy}`);
  }
  return erased;
}

/**
 * ⭐⭐ THE CONTROL CR-OSR-FREEZE-6 REQUIRES. Zero true-positive erasure is the
 * WHOLE basis on which the filter was adopted, so it is enforced on every scan
 * rather than remembered from the adoption measurement.
 */
export function assertShapeFamilyDebtPreserved(clearedIdentities) {
  return assertClassADebtPreserved(clearedIdentities, {
    instrument: `observed-shape shape-family filter (CR-OSR-FREEZE-6, theta=${SHAPE_FAMILY_FILTER.theta},`
      + ` >=${SHAPE_FAMILY_FILTER.minKeys} keys)`,
    remedy: ' The filter was adopted ONLY on the measured property that it erases zero true positives, so this'
      + ' is not a threshold to retune: the scan is refused until the chair re-triages the row(s).',
  });
}

/**
 * Post-scan, PRE-INVENTORY. Everything downstream — the artifact, `compare`, the
 * cohort notice and the frozen inventory — consumes the returned findings, and
 * `stats` is the SAME OBJECT the detector returned, so no arrangement of this
 * code can let the filter move the anti-vacuity floor.
 *
 * ⚠ HEURISTIC LEG ONLY. The family relation is defined over the leaf-name shape
 * vocabulary; exact-origin findings are addressed by executed origin, where
 * "the same record under another name" is not expressible. Targeted exact
 * probes therefore keep the detector's raw output.
 */
export function applyShapeFamilyFilter({ scanMode, corpus, scan }) {
  if (scanMode !== BASELINE_SCAN_MODE) {
    return { ...scan, familyFilter: { applied: false, cleared: 0, clearedIdentities: [] } };
  }
  const shapes = corpus?.shapes || {};
  const keySets = shapeKeySetsOf(shapes);
  const unions = new Map();
  const unionFor = (name) => {
    if (!unions.has(name)) unions.set(name, shapeFamilyUnionOf(name, shapes, keySets));
    return unions.get(name);
  };
  const cleared = new Set();
  const findings = scan.findings.filter((finding) => {
    if (!unionFor(finding.shapes.join('|')).has(finding.key)) return true;
    cleared.add(identityOf(finding));
    return false;
  });
  const clearedIdentities = [...cleared].sort();
  assertShapeFamilyDebtPreserved(clearedIdentities);
  return {
    findings,
    stats: scan.stats,
    familyFilter: {
      applied: true,
      cleared: scan.findings.length - findings.length,
      clearedIdentities,
    },
  };
}

/** Recorded on every scan, the way the excluded scope is — a narrowing nobody
 *  has to read the source to discover. */
export function shapeFamilyNotice(familyFilter) {
  if (!familyFilter?.applied) {
    return 'CR-OSR-FREEZE-6 shape-family filter: NOT APPLIED (exact-origin probe keeps the raw detector output).';
  }
  return `CR-OSR-FREEZE-6 shape-family filter (theta=${SHAPE_FAMILY_FILTER.theta},`
    + ` >=${SHAPE_FAMILY_FILTER.minKeys} keys): cleared ${familyFilter.cleared} read(s)`
    + ` across ${familyFilter.clearedIdentities.length} identit(ies) whose key is carried by a sibling`
    + ' shape in the same family. Zero CR-OSR-FREEZE-3-R2 class-(a) rows may be cleared; the scan refuses if one is.';
}

/**
 * ⭐⭐ CR-OSR-SCHEMA-6 / M11 — THE DOM-GLOBAL RECEIVER EXCLUSION.
 *
 * THE DEFECT IT REMOVES. The ROOT NAME PRIOR in the byte-frozen detector is
 * deliberately narrow, and its own comment names the reason: widening it "binds
 * `window`, `raw`, `plan` and `outcome` to unrelated shapes". So a bare `window`
 * grounds to NOTHING. But the next hop does not stop there: in
 * `window.history.replaceState`, the receiver `window.history` resolves empty,
 * which drops into the UNGROUNDED SINGLE-HOME rule — a name with exactly one
 * home in the corpus binds. `history` has exactly one home, the settlement
 * history container, so `window.history` binds to it and every member read on
 * the browser History API becomes a finding against a domain record it has
 * nothing to do with. MEASURED at HEAD: 11 reads across 3 identities and 3
 * files, every one of them literally `window.history.*`.
 *
 * ⚠⚠ IT KEYS ON THE RECEIVER TEXT, NEVER ON THE KEY NAME, AND THAT IS THE WHOLE
 * DESIGN. A key-name exclusion listing `state`, `replaceState`, `pushState`
 * would suppress those keys on EVERY shape forever, and `state` is an entirely
 * plausible domain key. The finding record already carries what is needed:
 * `text`, the read expression as written. A finding clears only when its
 * expression BEGINS with a declared host-global receiver, which is total,
 * narrow, and structurally incapable of failing open on a domain key.
 *
 * ⚠ OPTIONAL CHAINING IS MATCHED TOO (`window?.history`), because a codebase
 * that adopts it must not silently lose the exclusion — and a receiver root is
 * the one position where `?.` changes nothing about what is being read.
 *
 * ⭐ WHY A POST-FILTER: the same reason M6 is one. `BUILTIN_MEMBERS` and the
 * root prior both live inside `legacy-reader-shape-scan.mjs`, byte-frozen to
 * blob 0310fa9f, so this consumes the detector's findings array and returns a
 * SUBSET; `stats` passes through by identity and the anti-vacuity floor keeps
 * measuring the DETECTOR.
 */
export const DOM_GLOBAL_RECEIVER_ROOTS = Object.freeze([
  'document', 'globalThis', 'window',
]);

/**
 * The host-global names an exclusion MAY name. TOTAL positive predicate, the
 * same shape as `EXACT_SCAN_EXCLUDABLE_UI_ROOTS`: a root that is not one of
 * these is refused, so no unlisted name fails open.
 *
 * ⚠ `self` IS ADMISSIBLE AND DELIBERATELY NOT DECLARED. It is a genuine host
 * global, which is why it belongs in the vocabulary — and it is also an
 * entirely plausible domain identifier (`const self = …`), which is why adding
 * it to the live set would be a real risk and must be a deliberate act rather
 * than a token nobody notices. Recorded here so the omission is not read as an
 * oversight and re-"fixed".
 */
const DOM_GLOBAL_RECEIVER_VOCABULARY = Object.freeze([
  'document', 'globalThis', 'self', 'window',
]);

/** A read expression's receiver root, or null. `?.` is accepted at the root. */
const RECEIVER_ROOT = /^([A-Za-z_$][\w$]*)\??\./;

/** Fail-closed at declaration: a DOMAIN receiver cannot be quietly added. */
export function assertDomGlobalReceiverRoots(roots = DOM_GLOBAL_RECEIVER_ROOTS) {
  if (!Array.isArray(roots) || !roots.length) {
    throw new Error('observed-shape DOM_GLOBAL_RECEIVER_ROOTS must be a nonempty array of host-global receiver names');
  }
  for (const root of roots) {
    if (typeof root !== 'string' || !/^[A-Za-z_$][\w$]*$/.test(root)) {
      throw new Error(`observed-shape DOM-global receiver root must be a bare identifier; received ${JSON.stringify(root)}`);
    }
    if (!DOM_GLOBAL_RECEIVER_VOCABULARY.includes(root)) {
      throw new Error(`observed-shape DOM-global receiver root ${JSON.stringify(root)} is not a declared host global`
        + ` (${DOM_GLOBAL_RECEIVER_VOCABULARY.join(', ')}). M11 excludes reads whose RECEIVER is browser/runtime`
        + ' surface; a domain receiver here would clear every read of a real record and blind the instrument.');
    }
  }
  return roots;
}
assertDomGlobalReceiverRoots();

/** The declared host-global receiver a finding's expression opens with, or null. */
export function domGlobalReceiverOf(text, roots = DOM_GLOBAL_RECEIVER_ROOTS) {
  const match = RECEIVER_ROOT.exec(String(text ?? ''));
  return match && roots.includes(match[1]) ? match[1] : null;
}

/**
 * ⭐⭐ THE CORPUS-DERIVED HALF OF THE GUARD, and it is the one that cannot rot.
 * The vocabulary above is a literal and a literal can be widened; this is not.
 * A declared root may never be one of the corpus's own WALK ROOTS — the exact
 * names the detector's root prior grounds (`settlement`, `save`, `campaign`,
 * `worldState`, …) — because clearing every read whose expression opens with one
 * of those would retire most of the instrument in a single token.
 *
 * ⚠ IT IS DELIBERATELY *NOT* "the root must not be an observed shape". MEASURED
 * at HEAD: `window` IS an observed corpus shape name, while being nothing the
 * root prior can ground. That check would therefore have thrown on the very
 * exclusion this filter exists to make — a guard written from reasoning instead
 * of from a measurement.
 */
export function assertDomGlobalRootsAreNotCorpusRoots(roots, corpus) {
  const walkRoots = new Set(corpus?.rootShapes || []);
  const collisions = roots.filter((root) => walkRoots.has(root));
  if (collisions.length) {
    throw new Error(`observed-shape DOM-global receiver root(s) ${collisions.join(', ')} name a CORPUS WALK ROOT.`
      + ' The detector grounds those names through its root prior, so excluding them would clear reads of real'
      + ' records rather than of browser surface. The scan is refused.');
  }
  return roots;
}

/**
 * Post-scan, PRE-INVENTORY, and downstream of the shape-family filter. Same
 * contract as every filter here: a SUBSET, `stats` by identity, heuristic leg
 * only — the exact leg addresses findings by executed origin, where a receiver
 * root is not part of the address.
 */
export function applyDomGlobalReceiverFilter({
  scanMode, corpus, scan, roots = DOM_GLOBAL_RECEIVER_ROOTS,
}) {
  if (scanMode !== BASELINE_SCAN_MODE) {
    return { ...scan, domGlobals: { applied: false, cleared: 0, clearedIdentities: [] } };
  }
  assertDomGlobalReceiverRoots(roots);
  assertDomGlobalRootsAreNotCorpusRoots(roots, corpus);
  const cleared = new Set();
  const receivers = new Set();
  const findings = scan.findings.filter((finding) => {
    const receiver = domGlobalReceiverOf(finding.text, roots);
    if (!receiver) return true;
    receivers.add(receiver);
    cleared.add(identityOf(finding));
    return false;
  });
  const clearedIdentities = [...cleared].sort();
  assertClassADebtPreserved(clearedIdentities, {
    instrument: `observed-shape DOM-global receiver filter (CR-OSR-SCHEMA-6 / M11, roots ${roots.join(', ')})`,
    remedy: ' A row the chair banked as a REAL defect cannot be dismissed as browser surface: either the'
      + ' triage was wrong and the chair must re-triage it, or this filter is reaching further than its'
      + ' declared receivers. The scan is refused until one of those is settled.',
  });
  return {
    ...scan,
    findings,
    stats: scan.stats,
    domGlobals: {
      applied: true,
      cleared: scan.findings.length - findings.length,
      clearedIdentities,
      receivers: [...receivers].sort(),
    },
  };
}

/** Recorded on every human-facing run, the way the scope exclusion is. */
export function domGlobalReceiverNotice(domGlobals, roots = DOM_GLOBAL_RECEIVER_ROOTS) {
  if (!domGlobals?.applied) {
    return 'CR-OSR-SCHEMA-6 M11 DOM-global receiver filter: NOT APPLIED (exact-origin probe keeps the raw detector output).';
  }
  return `CR-OSR-SCHEMA-6 M11 DOM-global receiver filter (${roots.join(', ')}): cleared`
    + ` ${domGlobals.cleared} read(s) across ${domGlobals.clearedIdentities.length} identit(ies) whose read`
    + ' EXPRESSION begins with a host global, so the shape the ungrounded single-home rule bound them to is not'
    + ' the record being read. Keyed on the RECEIVER, never on the key name. No class-(a) TRUE POSITIVE may be cleared.';
}

/**
 * ⭐⭐ CR-OSR-SCHEMA-6 / M12 — THE LANGUAGE-SURFACE RESIDUAL.
 *
 * THE DEFECT IT REMOVES. The frozen detector skips language surface through its
 * own `BUILTIN_MEMBERS` set, and its header states the premise that set rests
 * on: "a domain key that collides with it would be skipped. Nothing in the
 * measured corpus collides." The set is a hand-written enumeration inside a
 * BYTE-FROZEN module, so any member it omits is a permanent hole — and it omits
 * `toLocaleString`, which `Object.prototype` has carried since ES1. MEASURED at
 * HEAD: `popFirst.toLocaleString()` and `popLast.toLocaleString()` on population
 * NUMBERS drawn out of a history array, reported as reads of a key the history
 * container never writes. 2 reads, 1 identity, 1 file, and a pure artefact.
 *
 * ⚠ THIS IS AN EXACT FROZEN KEY SET, NEVER A PATTERN, AND THE MEASUREMENT SAYS
 * WHY. A tempting `/^to[A-Z]/` rule would also have cleared `toType on history`
 * (`src/domain/worldPulse/stressorDynamics.js`), which is a genuine domain key
 * on a genuine record. One character of pattern would have silently deleted a
 * real finding; an enumerated set cannot.
 *
 * ⚠ `test on test` (`src/domain/hookEscalation.js`, `rule.test.test(text)` where
 * `rule.test` is a RegExp) is language surface by the same argument and is
 * DELIBERATELY LEFT IN THE INVENTORY — deliberately deferred, documented, not a
 * bug to re-find. Two independent reasons: `test` is far more plausible as a
 * domain key than `toLocaleString` is, and the corpus MEASURABLY carries `test`
 * as a real key on a real shape, which the declaration guard below refuses
 * outright. Clearing one read is not worth a permanent blind spot.
 */
export const LANGUAGE_SURFACE_RESIDUAL_KEYS = Object.freeze(['toLocaleString']);

/**
 * The prototypes a declared residual key must actually live on. EXECUTED, not
 * enumerated: `'toLocaleString' in Object.prototype` is asked of the running
 * engine, so this predicate cannot rot and cannot be satisfied by a domain key.
 *
 * ⚠ `RegExp.prototype` and `Function.prototype` are ABSENT ON PURPOSE. They
 * would admit `source`, `flags`, `lastIndex`, `test` and `name` — and `source`
 * is already an observed domain key on four shapes in this very estate, while
 * `name` is the most common domain key there is. A vocabulary that admits them
 * is a door, not a guard.
 */
const LANGUAGE_SURFACE_PROTOTYPES = Object.freeze([
  Object.prototype, Array.prototype, String.prototype,
  Number.prototype, Boolean.prototype, Date.prototype,
]);

/** Fail-closed at declaration: a key that is not on a builtin prototype is refused. */
export function assertLanguageSurfaceResidualKeys(keys = LANGUAGE_SURFACE_RESIDUAL_KEYS) {
  if (!Array.isArray(keys) || !keys.length) {
    throw new Error('observed-shape LANGUAGE_SURFACE_RESIDUAL_KEYS must be a nonempty array of builtin member names');
  }
  for (const key of keys) {
    if (typeof key !== 'string' || !/^[A-Za-z_$][\w$]*$/.test(key)) {
      throw new Error(`observed-shape language-surface residual key must be a bare identifier; received ${JSON.stringify(key)}`);
    }
    if (!LANGUAGE_SURFACE_PROTOTYPES.some((proto) => key in proto)) {
      throw new Error(`observed-shape language-surface residual key ${JSON.stringify(key)} is not a member of any`
        + ' declared builtin prototype (Object, Array, String, Number, Boolean, Date). M12 exists only to finish the'
        + ' frozen detector\'s BUILTIN_MEMBERS list; a key that is not language surface is a DOMAIN key and clearing'
        + ' it would delete a real finding.');
    }
  }
  return keys;
}
assertLanguageSurfaceResidualKeys();

/**
 * ⭐⭐ THE CORPUS-DERIVED HALF, and the reason `test` cannot be smuggled in.
 * The frozen detector's own header rests on "nothing in the measured corpus
 * collides" — so this ASKS the corpus instead of trusting the sentence. A
 * declared residual key that any observed shape genuinely carries is refused,
 * because on that shape the read is real and clearing it would be a deletion.
 * MEASURED at HEAD: `toLocaleString` is carried by ZERO shapes; `test` is
 * carried by one.
 */
export function assertLanguageSurfaceKeysAreNotObserved(keys, corpus) {
  const collisions = [];
  for (const [name, shape] of Object.entries(corpus?.shapes || {})) {
    for (const key of keys) {
      if (Array.isArray(shape?.keys) && shape.keys.includes(key)) collisions.push(`${key} on ${name}`);
    }
  }
  if (collisions.length) {
    throw new Error(`observed-shape language-surface residual key(s) are OBSERVED DOMAIN KEYS: ${collisions.sort().join('; ')}.`
      + ' A key a producer actually writes is not language surface, and clearing it would delete real findings.'
      + ' The scan is refused.');
  }
  return keys;
}

/**
 * Post-scan, PRE-INVENTORY. Same contract as its three siblings: a SUBSET,
 * `stats` by identity, heuristic leg only.
 *
 * ⚠ SHAPE-BLIND ON PURPOSE, and this is the ONE filter here that is. M6, M11 and
 * M8/M9 are all qualified — by family, by receiver, by identity. Language
 * surface is the one thing that genuinely IS on every object, so qualifying by
 * shape would mean re-declaring the same key for each shape it appears on and
 * getting a permanent hole on the shape nobody listed. The declaration guards
 * above are what make shape-blindness safe: the key must be on a builtin
 * prototype AND absent from every observed shape.
 */
export function applyLanguageSurfaceFilter({
  scanMode, corpus, scan, keys = LANGUAGE_SURFACE_RESIDUAL_KEYS,
}) {
  if (scanMode !== BASELINE_SCAN_MODE) {
    return { ...scan, languageSurface: { applied: false, cleared: 0, clearedIdentities: [] } };
  }
  assertLanguageSurfaceResidualKeys(keys);
  assertLanguageSurfaceKeysAreNotObserved(keys, corpus);
  const residual = new Set(keys);
  const cleared = new Set();
  const findings = scan.findings.filter((finding) => {
    if (!residual.has(finding.key)) return true;
    cleared.add(identityOf(finding));
    return false;
  });
  const clearedIdentities = [...cleared].sort();
  assertClassADebtPreserved(clearedIdentities, {
    instrument: `observed-shape language-surface filter (CR-OSR-SCHEMA-6 / M12, keys ${keys.join(', ')})`,
    remedy: ' A row the chair banked as a REAL defect cannot be dismissed as language surface. The scan is'
      + ' refused until the chair re-triages the row or the declared key set is narrowed.',
  });
  return {
    ...scan,
    findings,
    stats: scan.stats,
    languageSurface: {
      applied: true,
      cleared: scan.findings.length - findings.length,
      clearedIdentities,
    },
  };
}

/** Recorded on every human-facing run, the way the scope exclusion is. */
export function languageSurfaceNotice(languageSurface, keys = LANGUAGE_SURFACE_RESIDUAL_KEYS) {
  if (!languageSurface?.applied) {
    return 'CR-OSR-SCHEMA-6 M12 language-surface filter: NOT APPLIED (exact-origin probe keeps the raw detector output).';
  }
  return `CR-OSR-SCHEMA-6 M12 language-surface filter (${keys.join(', ')}): cleared`
    + ` ${languageSurface.cleared} read(s) across ${languageSurface.clearedIdentities.length} identit(ies) of a`
    + ' builtin prototype member the byte-frozen detector\'s BUILTIN_MEMBERS list predates. Each declared key must'
    + ' live on a builtin prototype AND be absent from every observed shape, or the scan refuses.';
}

/**
 * ⭐⭐ THE WRITE-SHAPE PROBE — four spellings, because two of them were MEASURED
 * defeating the quoted-string scan that was this discipline's best manual check.
 *
 * A triage lane asking "does anything write this key?" grepped `<key>:` and
 * `'<key>'`. The M8 re-audit (2026-08-11) found two write shapes that BOTH
 * return zero hits for either query and are nonetheless real writes:
 *
 *   SHORTHAND INSIDE A CONDITIONAL SPREAD
 *     `src/generators/historyGenerator.js:888` — `...(ancientRuin ? { ancientRuin } : {})`.
 *     Neither `ancientRuin:` nor `'ancientRuin'` exists anywhere in the estate.
 *   BARE TOKEN INSIDE A SPACE-JOINED STRING LITERAL
 *     `src/store/configSlice.js:82` — `latentPantheon` sits inside a
 *     `('… latentPantheon …').split(' ')` key list. The quoted scan returns ZERO.
 *
 * ⚠ THE CONCEPT ALREADY EXISTED AND WAS PER-ROW: `src/domain/fieldManifest.js`
 * carries a hand-written `writeProbe` regex on exactly one row
 * (`resilienceScore`) because its author hit the shorthand case once. This
 * GENERALISES that — one probe builder, four spellings, derived from the key —
 * so the next lane does not have to notice the blindness for itself. A per-row
 * hand-written regex is a fix; a probe that knows the shapes is machinery.
 *
 * ⚠⚠ HONEST LIMIT, STATED SO NOBODY READS THIS AS A WRITER ORACLE. This is a
 * TEXTUAL probe: it proves a spelling is PRESENT, never that the write reaches
 * the shape under test, and it cannot see a computed key (`obj[name] = …`) at
 * all. It is used here for exactly one job — refusing an exemption entry whose
 * named writer no longer mentions the key — which is the direction where a false
 * NEGATIVE reds (safe) and a false positive merely fails to red an entry a human
 * already argued for.
 */
export const WRITE_SHAPE_SPELLINGS = Object.freeze([
  'property', 'quoted', 'shorthand', 'token-in-string-literal',
]);

const escapeForRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The four probes for one key, in `WRITE_SHAPE_SPELLINGS` order. */
export function writeShapeProbesOf(key) {
  if (typeof key !== 'string' || !key || /\s/.test(key)) {
    throw new Error(`observed-shape write-shape probe requires a whitespace-free key; received ${JSON.stringify(key)}`);
  }
  const k = escapeForRegExp(key);
  return [
    // `key: value` — the ordinary property write, never a member read (`x.key:`)
    // and never a longer identifier ending in the key.
    { spelling: 'property', pattern: new RegExp(`(?<![.\\w$])${k}\\s*:`) },
    // `'key'` / `"key"` / backtick — the quoted spelling a computed field list uses.
    { spelling: 'quoted', pattern: new RegExp(`['"\`]${k}['"\`]`) },
    // `{ key }` and `{ key, }` — shorthand, INCLUDING inside a conditional
    // spread, which is the case that defeated the quoted scan.
    { spelling: 'shorthand', pattern: new RegExp(`(?<![.\\w$])${k}\\s*(?:,|\\})`) },
    // A bare token inside a string literal that is later SPLIT ON WHITESPACE.
    // ⚠ The whitespace adjacency is load-bearing, not decoration: without it
    // this probe also matches a plain `'key'`, and the two spellings stop being
    // distinguishable — which would make the report say "token in a joined list"
    // about an ordinary quoted key and hide the blindness this exists to name.
    {
      spelling: 'token-in-string-literal',
      pattern: new RegExp(`['"\`][^'"\`\\n]*(?:\\s${k}(?![\\w$])|(?<![\\w$])${k}\\s)[^'"\`\\n]*['"\`]`),
    },
  ];
}

/** Every spelling of `key` present in `source`, in declaration order. */
export function writeShapesIn(source, key) {
  const text = String(source ?? '');
  return writeShapeProbesOf(key)
    .filter(({ pattern }) => pattern.test(text))
    .map(({ spelling }) => spelling);
}

/**
 * ⭐⭐⭐ M8 / M9 — THE EXPLAINED-WRITER EXEMPTION. THE STRUCTURAL POINT OF THIS
 * MINT, and the reason the previous four items were worth carrying with it.
 *
 * THE DEFECT IT REMOVES. `observed-shape-corpus.mjs` executes GENERATION and
 * only generation. So "no writer in the corpus" and "no writer" are different
 * claims, and the gap between them is precisely the surface a person or a
 * lifecycle path outside generation fills in. Two writers live in that gap:
 *
 *   M8 — THE USER writes it (authored input, importer admission lists).
 *   M9 — THE SAVE PATH writes it (a key minted when a world is persisted,
 *        linked, or re-hydrated, which the generation corpus never runs).
 *
 * They are ONE CLASS with two writers, and the question that separates a real
 * finding from either of them is always the same: **"who writes this, and does
 * the corpus RUN that writer?"**
 *
 * THE MEASURED INSTANCE THAT FORCED IT. `neighbourNetwork on settlement` — 23
 * files already bank it in the schema-4 inventory, `src/lib/saves.js` writes it
 * (`withNeighbourNetworkFromRelationship`, and the link/undo/import paths beside
 * it), and the corpus runs none of them.
 * ⚠ THAT FUNCTION NAME WAS WRONG UNTIL CR-OSR-SCHEMA-6 and the correction is
 * worth recording: this line used to say `deriveOwnNeighbourEntry`, a function
 * that has never existed anywhere in the estate — a single grep returned exactly
 * one hit, this comment itself. The invented name almost certainly came from the
 * real function's own docstring verb ("Derive the settlement's own
 * neighbourNetwork entry…"). Prose inside a governed file is not machine-checked
 * the way `entry.writer` below is, which is precisely why it could rot unnoticed. A display repair then moved
 * `src/components/townMap/edgeAnnotations.js` off the genuinely-dead
 * `settlement.neighbors` onto the real `settlement.neighbourNetwork`, and the
 * instrument correctly refused the maintenance write: an identity SWAP is
 * GROWTH, not a shrink, so only a migration can express it. That refusal is the
 * instrument working. Banking that one row BY HAND would have left the next
 * save-time read to red the gate all over again — so the row is banked BY RULE.
 *
 * ── THE ADMISSION LAW (the M8 five-gate router, as machinery) ────────────────
 * An entry may be admitted on exactly these grounds, and `mechanism` names which:
 *   gate 0  the WIDENED write-shape probe above finds the key in the named
 *           writer. MACHINE-CHECKED on every scan by
 *           `assertExplainedWriterEvidence` — a stale entry REDS.
 *   gate 1  `git log --all -S"<key>:" -- src/` returning ZERO means an
 *           authored-input explanation is IMPOSSIBLE. This is a REFUSAL gate: it
 *           can only close the M8 hypothesis, never open it, so it is a
 *           triage-lane obligation (`assertAuthoredInputHistoryPossible` below
 *           runs it on demand) and deliberately NOT a per-run gate check —
 *           `git log --all` is a HISTORY query, and history is the one input in
 *           this instrument that no manifest content-addresses.
 *   gate 2  a CLOSED ingest shape (the save envelope is closed on both doors:
 *           `saves.js` and `accountImport.js` each enumerate their keys), so
 *           what the door admits is decidable.
 *   gate 3  the key is named by a CLOSED admission list — `isAllowedConfigKey`,
 *           `FIELD_ALIASES` values, `EDITABLE_FIELDS` paths, importer lists —
 *           SHAPE-QUALIFIED, and excluding `*_not_imported` exclusion rows.
 *   gate 4  ⛔ REFUSED AS A BASIS. An OPEN-SPREAD shape (`{ ...settlement }`)
 *           tolerates ANY key generically, so admitting on it would retire every
 *           settlement-root row and mean nothing. Evidence must come from a
 *           CLOSED list that NAMES the key.
 *
 * ⚠ SHRINK-ONLY, PINNED AS AN EXACT SET in tests/lint/observedShapeSentinel.test.js:
 * adding an entry REDS, removing one (returning an identity to enforcement) is
 * lawful. And no entry may name a CR-OSR-FREEZE-3-R2 class-(a) identity — the
 * same guard set M6 is held to, asserted at module load below.
 *
 * ⚠⚠ H26 — GATE 0 PROBES THE CONTAINER KEY, NOT THE SUB-KEY, AND THE CHAIR HAS
 * ACCEPTED THAT BLIND SPOT WITH A WRITTEN REASON. `worldPulse on campaignState`
 * is the second live instance and states the shape plainly: the writer emits
 * `{lastTick, lastInterval, updatedAt}`, both readers ask for `.events`, and
 * gate 0 — a textual probe for the key `worldPulse` — passes on the container
 * while saying nothing about the sub-key. An exemption here would have made a
 * genuinely broken read invisible, so the exemption was gated on the repair
 * landing first: `src/store/aiChronicleContext.js` now sources the AI
 * Chronicle's world lane from the campaign's `worldState.pulseHistory`
 * (CR-S6-6, landed `da31d170`), and the surviving `campaignState.worldPulse`
 * read is the deliberate legacy per-save FALLBACK the sibling dossier surface
 * also kept. ⭐ The standing cure the chair has ruled for the class is
 * BANK-BY-RULE — an exempted row stays visible in the inventory as a ceiling
 * instead of vanishing — and it is chartered as its own mint, because
 * re-admitting rows is a SET-GROWING change and this genesis is a pure shrink.
 */
export const EXPLAINED_WRITER_EXEMPTIONS = Object.freeze([
  Object.freeze({
    identity: 'factions on locks',
    mechanism: 'admission-list',
    writer: 'src/components/dossier/LockControls.jsx',
    ruling: 'CR-OSR-SCHEMA-6 / M8 — re-triaged out of class (a)',
    why: 'A USER-ACTION writer the generation corpus never runs. WORLD_LOCKS is a closed,'
      + ' shape-qualified admission list naming the key (`key: \'factions\'`), and the toggle'
      + ' resolves it through a DYNAMIC `setLock(key, …)` call — which is why a grep for'
      + ' "setLock naming factions" returned nothing and the row was mis-banked class (a).',
  }),
  Object.freeze({
    identity: 'neighbourNetwork on settlement',
    mechanism: 'save-time-writer',
    writer: 'src/lib/saves.js',
    ruling: 'CR-OSR-FREEZE-6-R2 / M9',
    why: 'The persisted neighbour graph is minted when a world is SAVED, LINKED or'
      + ' IMPORTED — never during generation, which is the only thing the corpus executes.'
      + ' saves.js derives the settlement\'s own entry and the link/undo/import paths rewrite'
      + ' it; 23 files banked the identity under schema 4 for exactly this reason.',
  }),
  Object.freeze({
    identity: 'stresses on settlement',
    mechanism: 'admission-list',
    writer: 'src/domain/settlement.schema.js',
    ruling: 'CR-OSR-SCHEMA-6 / M8 — registered alias',
    why: 'A DECLARED historical alias in FIELD_ALIASES. normalizeSettlement reads from any'
      + ' alias and writes ONLY the canonical key, so nothing emits `stresses` BY DESIGN;'
      + ' the reads are inbound compatibility for saves authored before the rename. Gate 3'
      + ' admits FIELD_ALIASES values by name, and the entry names the DECLARATION rather'
      + ' than the adapter because the declaration IS the admission list.',
  }),
  Object.freeze({
    identity: 'worldPulse on campaignState',
    mechanism: 'save-time-writer',
    writer: 'src/store/campaignPulseHelpers.js',
    ruling: 'CR-OSR-SCHEMA-6 / M9',
    why: 'campaignStateForWorldPulse installs the key onto a real campaignState when a pulse'
      + ' is PERSISTED. The corpus executes generation plus the DOMAIN pulse and seeds'
      + ' campaignState itself, so the STORE-layer writer is never run — one lifecycle step'
      + ' further out than saves.js and the same class.',
  }),
]);

/** The mechanisms an entry may claim. TOTAL positive predicate: an unlisted
 *  mechanism is refused, so a new one cannot fail open on the value nobody
 *  thought to forbid. `open-spread` is absent BY RULING (gate 4). */
const EXPLAINED_WRITER_MECHANISMS = Object.freeze([
  'save-time-writer', 'closed-ingest', 'admission-list',
]);

/** Fail-closed at declaration: shape, grammar, and the class-(a) overlap. */
export function assertExplainedWriterExemptions(entries = EXPLAINED_WRITER_EXEMPTIONS) {
  if (!Array.isArray(entries)) {
    throw new Error('observed-shape EXPLAINED_WRITER_EXEMPTIONS must be an array of declared entries');
  }
  const guarded = new Set(CLASS_A_PROTECTED_IDENTITIES);
  const seen = new Set();
  for (const entry of entries) {
    const fields = Object.keys(entry || {}).sort().join(',');
    if (fields !== 'identity,mechanism,ruling,why,writer') {
      throw new Error(`observed-shape explained-writer exemption has noncanonical fields: ${JSON.stringify(entry)}`);
    }
    if (!/^\S+ on \S+$/.test(entry.identity)) {
      throw new Error(`observed-shape explained-writer exemption identity must be "<key> on <shape>"; received ${JSON.stringify(entry.identity)}`);
    }
    if (seen.has(entry.identity)) {
      throw new Error(`observed-shape explained-writer exemption repeats ${JSON.stringify(entry.identity)}`);
    }
    seen.add(entry.identity);
    if (!EXPLAINED_WRITER_MECHANISMS.includes(entry.mechanism)) {
      throw new Error(`observed-shape explained-writer exemption ${JSON.stringify(entry.identity)} claims an undeclared mechanism`
        + ` ${JSON.stringify(entry.mechanism)}; the admitted grounds are ${EXPLAINED_WRITER_MECHANISMS.join(', ')}.`
        + ' An OPEN-SPREAD tolerance is REFUSED as a basis (gate 4): it admits every key generically and so names none.');
    }
    if (!/^src\//.test(entry.writer) || !/\.(js|jsx)$/.test(entry.writer)) {
      throw new Error(`observed-shape explained-writer exemption ${JSON.stringify(entry.identity)} must name a repository-relative src/ writer; received ${JSON.stringify(entry.writer)}`);
    }
    if (typeof entry.why !== 'string' || entry.why.trim().length < 40
      || typeof entry.ruling !== 'string' || !entry.ruling.trim()) {
      throw new Error(`observed-shape explained-writer exemption ${JSON.stringify(entry.identity)} lacks a ruling and a substantive reason`);
    }
    if (guarded.has(entry.identity)) {
      throw new Error(`observed-shape explained-writer exemption ${JSON.stringify(entry.identity)} is a CR-OSR-FREEZE-3-R2 class-(a)`
        + ' TRUE POSITIVE. A row banked as a real defect cannot be exempted as explained; re-triage it instead.');
    }
  }
  return entries;
}
assertExplainedWriterExemptions();

/**
 * ⭐⭐ GATE 0, EXECUTED. The declaration above is an ARGUMENT; this is the part
 * that cannot rot. Every entry's key must still be written, in one of the four
 * measured spellings, by the file it names — so a writer that is deleted,
 * renamed, or refactored away turns the exemption RED instead of leaving a
 * silent hole in the enforcement surface.
 *
 * ⚠ This reads the writer from the SCANNED TREE, which is content-addressed by
 * `scanTree`, so the evidence is bound to the same commit as the findings.
 */
export function assertExplainedWriterEvidence(
  entries = EXPLAINED_WRITER_EXEMPTIONS,
  { root = ROOT, readSource = (path) => readFileSync(join(root, path), 'utf8') } = {},
) {
  const evidence = [];
  for (const entry of entries) {
    const key = entry.identity.slice(0, entry.identity.indexOf(' on '));
    let source;
    try {
      source = readSource(entry.writer);
    } catch (error) {
      throw new Error(`observed-shape explained-writer exemption ${JSON.stringify(entry.identity)} names a writer that cannot be read: ${entry.writer}`, { cause: error });
    }
    const spellings = writeShapesIn(source, key);
    if (!spellings.length) {
      throw new Error(`observed-shape explained-writer exemption ${JSON.stringify(entry.identity)} is STALE:`
        + ` ${entry.writer} no longer writes ${JSON.stringify(key)} in any of the ${WRITE_SHAPE_SPELLINGS.length} measured`
        + ` write shapes (${WRITE_SHAPE_SPELLINGS.join(', ')}).`
        + ' Either the writer moved — re-point the entry — or the key genuinely lost its writer, in which'
        + ' case the reads are real findings again and the exemption must be DELETED, not repaired.');
    }
    evidence.push({ identity: entry.identity, key, writer: entry.writer, spellings });
  }
  return evidence;
}

/**
 * GATE 1, on demand. Zero commits touching `<key>:` anywhere in history means no
 * human ever could have supplied the field, so an authored-input (M8) story is
 * IMPOSSIBLE and the row must be triaged some other way. Exported for triage
 * lanes and pinned by a test; deliberately NOT wired into `run()` — see the
 * admission law above.
 */
export function authoredInputHistoryCommits(key, { root = ROOT } = {}) {
  if (typeof key !== 'string' || !key || /\s/.test(key)) {
    throw new Error(`observed-shape authored-input history probe requires a whitespace-free key; received ${JSON.stringify(key)}`);
  }
  return execFileSync('git', ['log', '--all', '--format=%H', `-S${key}:`, '--', 'src'], {
    cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  }).trim().split('\n').filter(Boolean);
}

/**
 * Post-scan, PRE-INVENTORY, and LAST in the declared chain — downstream of M6,
 * M11 and M12. Same contract as all three: `stats` passes through BY IDENTITY,
 * so the anti-vacuity floor keeps measuring the DETECTOR's reach and no
 * exemption can be added to hide a corpus that stopped observing.
 *
 * ⚠ HEURISTIC LEG ONLY, for the same reason the family filter is: the exemption
 * is keyed on the leaf-name identity, which the exact leg does not speak.
 */
export function applyExplainedWriterFilter({
  scanMode, scan, entries = EXPLAINED_WRITER_EXEMPTIONS, evidence,
}) {
  if (scanMode !== BASELINE_SCAN_MODE) {
    return { ...scan, explainedWriters: { applied: false, cleared: 0, clearedIdentities: [] } };
  }
  const exempt = new Map(entries.map((entry) => [entry.identity, entry]));
  // ⚠ THE KEY PRE-FILTER IS NOT A SECOND SPELLING OF THE IDENTITY — the decision
  // still goes through `identityOf`, the one home for that spelling. It exists so
  // the canonical minter is invoked ONLY on findings that could possibly be
  // cleared, exactly as the shape-family filter does. That matters beyond speed:
  // `identityOf` asserts a canonical repository-relative path, so minting one for
  // EVERY finding would throw on a planted probe living outside the tree — which
  // is a legitimate thing for a mutant harness to scan and not something a filter
  // should get an opinion about.
  const exemptKeys = new Set([...exempt.keys()].map((identity) => identity.slice(0, identity.indexOf(' on '))));
  const cleared = new Set();
  const findings = scan.findings.filter((finding) => {
    if (!exemptKeys.has(finding.key)) return true;
    const identity = identityOf(finding);
    if (!exempt.has(identity)) return true;
    cleared.add(identity);
    return false;
  });
  return {
    ...scan,
    findings,
    stats: scan.stats,
    explainedWriters: {
      applied: true,
      cleared: scan.findings.length - findings.length,
      clearedIdentities: [...cleared].sort(),
      evidence: evidence || [],
    },
  };
}

/** Said out loud on every human-facing run, the way the scope exclusion is. */
export function explainedWriterNotice(explainedWriters, entries = EXPLAINED_WRITER_EXEMPTIONS) {
  if (!explainedWriters?.applied) {
    return 'M8/M9 explained-writer exemption: NOT APPLIED (exact-origin probe keeps the raw detector output).';
  }
  return `M8/M9 explained-writer exemption (CR-OSR-FREEZE-6-R2): ${entries.length} declared identit(ies)`
    + ` whose writer the GENERATION corpus never runs; cleared ${explainedWriters.cleared} read(s)`
    + ` across ${explainedWriters.clearedIdentities.length} of them on this scan.`
    + ' Each entry names its writer and its key must still be written there, in one of the four measured'
    + ' write shapes, or the scan refuses. No class-(a) TRUE POSITIVE may be exempted.';
}

export function sourceFiles(root = ROOT) {
  const out = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (isObservedShapeScanPath(p)) out.push(p);
    }
  }(join(root, 'src')));
  return out.sort();
}

/** Complete JavaScript subject inputs. The scan omits generated JS and cannot
 * parse JSON, while executed producers may consume both; all are still bound. */
export function subjectFiles(root = ROOT) {
  const out = [];
  (function walk(d) {
    for (const entry of readdirSync(d)) {
      const path = join(d, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (isObservedShapeSubjectPath(path)) out.push(path);
    }
  }(join(root, 'src')));
  return out.sort();
}

export function executionInputFiles(root = ROOT) {
  return [...new Set([...subjectFiles(root), ...scannerToolFiles(root)])].sort();
}

/** The stable identity of a finding under the BASELINE AUTHORITY: WHICH key, on
 * WHICH observed shape. Never the line — see the header note on why line numbers
 * are excluded. Targeted exact probes address findings through
 * `artifactIdentityOf('exact-origin', …)` instead; that spelling is the RETIRED
 * schema-3 definition and cannot enter a schema-4 inventory. */
export function identityOf(finding) {
  return artifactIdentityOf(BASELINE_SCAN_MODE, finding);
}

/** Per-file, per-identity counts, forward-slash normalized so the ratchet reads
 *  the same on every platform. Both levels are sorted so a re-freeze produces a
 *  reviewable diff rather than a reshuffle. */
export function inventoryOf(findings) {
  return artifactInventoryOf(BASELINE_SCAN_MODE, findings);
}

/**
 * Normalize one baseline row to `{identity: multiplicity}`. A BARE NUMBER is the
 * retired count-only form and is REFUSED rather than accepted: silently reading
 * `10` as "any ten findings you like" is precisely the identity-swap hole this
 * ratchet was rebuilt to close, so a hand-edit back to it must fail loudly.
 *
 * ⭐ CR-OSR-FREEZE-8: this used to carry its OWN copy of the row law, untested,
 * beside the copy inside the envelope validator. It now delegates to the single
 * home in `observed-shape-baseline.mjs` so the two cannot drift.
 */
export function rowOf(row, file = '') {
  return assertBaselineRow(row, file);
}

/**
 * ⭐⭐ CR-OSR-FREEZE-7 — THE UNREVIEWED-UI COHORT, BANKED AS MACHINERY.
 *
 * Making the heuristic leg the gate authority pulls `src/components/` into
 * direct enforcement. Those rows enter the genesis REVIEWED-AS-A-COHORT rather
 * than individually triaged, and the ruling is explicit that they must stay
 * QUERYABLE and never be silently absorbed. So the cohort is a derivation over
 * whatever inventory it is handed — never a transcribed number that can rot
 * away from the artifact it describes — and it is printed on every human-facing
 * run beside the scope notice.
 */
export const UNREVIEWED_UI_COHORT = Object.freeze({
  tag: 'UNREVIEWED-UI',
  ruling: 'CR-OSR-FREEZE-7',
  scopes: EXACT_SCAN_EXCLUDED_SCOPE,
});

/** Files / identities / counts of one inventory restricted to `scopes`. */
export function cohortOf(inventory, scopes = UNREVIEWED_UI_COHORT.scopes) {
  const files = Object.keys(inventory || {})
    .filter((file) => scopes.some((scope) => file.startsWith(scope)))
    .sort();
  let identities = 0;
  let counts = 0;
  for (const file of files) {
    for (const count of Object.values(inventory[file])) {
      identities += 1;
      counts += count;
    }
  }
  return { files: files.length, identities, counts, paths: files };
}

/** Say the cohort out loud wherever the scope notice is said. */
export function cohortNotice(inventory, cohort = UNREVIEWED_UI_COHORT) {
  const { files, identities, counts } = cohortOf(inventory, cohort.scopes);
  return `${cohort.ruling} ${cohort.tag} cohort (${cohort.scopes.join(', ')}):`
    + ` ${files} file(s) / ${identities} identit(ies) / ${counts} read(s), banked in the`
    + ' frozen inventory and PER-ROW TRIAGED under CR-OSR-FREEZE-7 (the dispositions live in the'
    + ' chair\'s record, not here). These are ENFORCED, not excluded:'
    + ' CR-OSR-SCOPE-1 removes them from EXACT resolution only.';
}

/** The failure message IS the documentation — see "ratchet kindness". */
export function ratchetMessage(file, rows) {
  const detail = rows.map(({ identity, count, ceiling }) => (ceiling === 0
    ? `    NEW      ${identity} — ${count} read(s); this file has no frozen row for it (ceiling 0)`
    : `    OVER     ${identity} — ${count} read(s); frozen ceiling is ${ceiling}`)).join('\n');
  return `${file}: read(s) of a key no writer produces, outside the frozen inventory:\n${detail}\n`
    + '  A guarded read of a key the real generator never writes cannot throw — it\n'
    + '  degrades to a default, and the arm behind it is dead on every generated world.\n'
    + '  A NEW row means a fresh one landed even if this file\'s TOTAL did not move: the\n'
    + '  inventory is addressed by finding IDENTITY, not by count, so a swap cannot hide.\n'
    + '  TO COMPLY: read a key the producer actually writes, or delete the dead arm.\n'
    + '    The authority is a real run, not a typedef: `node scripts/check-observed-shape-readers.mjs --report`\n'
    + '    prints the shape and the keys it was observed carrying.\n'
    + '  TO SHRINK: fixed a site? LOWER this file\'s number for that identity in\n'
    + '    scripts/.observed-shape-readers-baseline.json (delete the row when it reaches 0).\n'
    + '    Never raise a number, never add a file, never add an identity.';
}

/** Say the scope reduction out loud on every human-facing run. A silent
 *  exclusion is the failure mode CR-OSR-SCOPE-1 exists to prevent. */
export function excludedScopeNotice(scopes, stats) {
  if (!scopes?.length) return 'scan scope: the WHOLE scanned tree (no declared exclusion).';
  return `⚠ DECLARED SCOPE EXCLUSION (CR-OSR-SCOPE-1): read sites under ${scopes.join(', ')}`
    + ` were NOT exactly resolved — ${stats?.excludedReadFiles ?? 0} of ${stats?.files ?? 0} indexed`
    + ' file(s). They remain in the program index and are covered by the heuristic'
    + ' (legacy-leaf) detector, which is handed the unfiltered file list.';
}

/**
 * The measurement that makes every green here mean something.
 *
 * ⚠ THE MODE IS EXPLICIT AND DEFAULTS TO THE EXACT INSTRUMENT, not to the gate
 * authority. The two sentinels are different RECORDS — `exact-origin` carries
 * thirteen fields including the origin and traversal-loss counters,
 * `legacy-leaf` carries three — so a caller comparing one against a baseline
 * frozen from the other silently compares nothing. Callers that mean the
 * baseline authority pass `BASELINE_SCAN_MODE` and say so.
 */
export function sentinelOf(corpus, stats, scanMode = 'exact-origin') {
  return scanSentinelOf(scanMode, corpus, stats, SCAN_CONFIG);
}

/**
 * ANTI-VACUITY. This walker's real failure mode is not a false finding — it is a
 * corpus that quietly stops observing. A renamed simulation flag, a producer
 * that throws and is swallowed, a shape that stops being reached: every one of
 * them EMPTIES the observed key sets, and an empty corpus makes the ratchet
 * green while proving nothing. So the frozen figures are floored at 90%, the
 * `fullTypecheckRatchet` scope-sentinel idiom one layer up.
 */
export function sentinelFailures(sentinel, frozen) {
  if (!frozen) return [];
  const out = [];
  for (const [k, floorPct] of [
    ['usableShapes', 0.9], ['totalKeys', 0.9], ['usableOrigins', 0.9],
    ['originKeys', 0.9], ['transitions', 0.9], ['resolvedReads', 0.9],
    ['resolvedOrigins', 0.9],
  ]) {
    const floor = Math.floor((frozen[k] || 0) * floorPct);
    if (frozen[k] && sentinel[k] < floor) {
      out.push(`${k}: ${sentinel[k]} < ${floor} (90% of the frozen ${frozen[k]}) — the corpus or the resolver`
        + ' collapsed, so a pass here would be VACUOUS. Fix the producer/scan before touching the inventory.');
    }
  }
  if ((sentinel.depthTruncations || 0) !== 0) {
    out.push(`depthTruncations: ${sentinel.depthTruncations} — the corpus walker or resolver silently abandoned a provenance path; remove the depth cause rather than baseline it.`);
  }
  if ((sentinel.cycleCuts || 0) !== 0) {
    out.push(`cycleCuts: ${sentinel.cycleCuts} — a corpus identity cycle or resolver recursion was cut; repair the producer/resolver rather than baseline the provenance loss.`);
  }
  return out;
}

/** Compare a fresh scan against the frozen inventory. */
export function compare(findings, baseline) {
  const inv = inventoryOf(findings);
  const violations = [];
  for (const [file, ids] of Object.entries(inv)) {
    const frozen = file in baseline.inventory ? rowOf(baseline.inventory[file], file) : {};
    const over = [];
    for (const [identity, count] of Object.entries(ids)) {
      const ceiling = frozen[identity] ?? 0;
      if (count > ceiling) over.push({ identity, count, ceiling });
    }
    if (over.length) violations.push(ratchetMessage(file, over));
  }
  // Schema 3 is an exact inventory, not a ceiling with dormant headroom. A row
  // whose file vanished OR whose multiplicity fell is stale and must be removed
  // in the same reviewed maintenance change; otherwise a later identity swap can
  // spend the abandoned count while appearing to remain under the old ceiling.
  const stale = [];
  for (const [file, row] of Object.entries(baseline.inventory)) {
    if (!existsSync(join(ROOT, file))) {
      stale.push(`${file}: deleted or moved — remove its row from the baseline.`);
      continue;
    }
    const now = inv[file] || {};
    for (const [identity, ceiling] of Object.entries(rowOf(row, file))) {
      const count = now[identity] || 0;
      if (count === 0 && ceiling !== 0) {
        stale.push(`${file}: "${identity}" is GONE against a frozen count of ${ceiling} — delete the row now; schema 4 permits no dormant headroom.`);
      } else if (count < ceiling) {
        stale.push(`${file}: "${identity}" is ${count} against a frozen count of ${ceiling} — lower the row now; schema 4 permits no dormant headroom.`);
      }
    }
  }
  return { inventory: inv, violations, stale };
}

export function corpusPayloadOf(parsed) {
  if (parsed?.kind !== 'observed-shape-reader-scan') return parsed;
  validateScanArtifact(parsed);
  return parsed.corpus;
}

async function corpusFor() {
  if (process.env.OSR_CORPUS) {
    throw new Error('OSR_CORPUS is retired for authoritative scans; execute producers fresh or use the reviewed bundle corpus during migration freeze');
  }
  return buildObservedCorpus();
}

function headShaFor() {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
}

function repositoryHeadFor() {
  try {
    return headShaFor();
  } catch {
    return null;
  }
}

function gitShaFor(envName) {
  const supplied = envName ? process.env[envName]?.trim() : null;
  if (supplied) return supplied;
  return headShaFor();
}

function dirtyInputsFor() {
  if (!repositoryHeadFor()) return null;
  // A bounded pathspec avoids macOS ARG_MAX on the ~2k scanned source files.
  // Requiring all of src/ clean is slightly stricter than the scan exclusion for
  // generated files, and intentionally easier to audit than parsing full status.
  const paths = [
    'src',
    'scripts/.observed-shape-readers-baseline.json',
    ...scannerToolFiles().map((file) => relative(ROOT, file).split('\\').join('/')),
  ];
  return execFileSync(
    'git',
    ['status', '--short', '--untracked-files=all', '--', ...paths],
    { cwd: ROOT, encoding: 'utf8' },
  ).trim();
}

function gitBlobBytesByOid(objectIds) {
  const uniqueIds = [...new Set(objectIds)];
  const output = execFileSync('git', ['cat-file', '--batch'], {
    cwd: ROOT,
    input: `${uniqueIds.join('\n')}\n`,
    maxBuffer: 256 * 1024 * 1024,
  });
  const blobs = new Map();
  let offset = 0;
  for (const expectedOid of uniqueIds) {
    const headerEnd = output.indexOf(0x0a, offset);
    if (headerEnd < 0) throw new Error('git cat-file returned a truncated observed-shape blob header');
    const header = output.subarray(offset, headerEnd).toString('utf8');
    const match = /^([0-9a-f]{40}) blob (\d+)$/.exec(header);
    if (!match || match[1] !== expectedOid) {
      throw new Error(`git cat-file returned unexpected observed-shape blob provenance: ${header}`);
    }
    const size = Number(match[2]);
    const contentStart = headerEnd + 1;
    const contentEnd = contentStart + size;
    if (!Number.isSafeInteger(size) || size < 0 || contentEnd >= output.length
      || output[contentEnd] !== 0x0a) {
      throw new Error(`git cat-file returned a truncated observed-shape blob: ${expectedOid}`);
    }
    blobs.set(expectedOid, output.subarray(contentStart, contentEnd));
    offset = contentEnd + 1;
  }
  if (offset !== output.length) {
    throw new Error('git cat-file returned trailing observed-shape blob data');
  }
  return blobs;
}

/** Reconstruct the exact manifests from a commit, including ignored-file and
 * executable-bit authority that `git status` alone cannot prove. */
function committedInputManifestsFor(subjectSha) {
  const detectorPaths = scannerToolFiles()
    .map((file) => relative(ROOT, file).split('\\').join('/'));
  const listing = execFileSync('git', [
    'ls-tree', '-r', '-z', '-l', '--full-tree', subjectSha, '--', 'src', ...detectorPaths,
  ], {
    cwd: ROOT,
    maxBuffer: 32 * 1024 * 1024,
  });
  const rows = listing.toString('utf8').split('\0').filter(Boolean).map((row) => {
    const match = /^([0-7]{6}) blob ([0-9a-f]{40})\s+(\d+)\t([^\0]+)$/s.exec(row);
    if (!match || !['100644', '100755'].includes(match[1])) {
      throw new Error(`observed-shape committed input is not a regular file: ${JSON.stringify(row)}`);
    }
    return {
      mode: match[1], oid: match[2], declaredSize: Number(match[3]), path: match[4],
    };
  });
  const byPath = new Map(rows.map((row) => [row.path, row]));
  if (byPath.size !== rows.length) {
    throw new Error('observed-shape committed input tree repeats a path');
  }
  const missingDetector = detectorPaths.filter((path) => !byPath.has(path));
  if (missingDetector.length) {
    throw new Error(`observed-shape subject commit omits governed detector input(s): ${missingDetector.join(', ')}`);
  }
  const blobs = gitBlobBytesByOid(rows.map((row) => row.oid));
  const entries = rows.map(({ mode, oid, declaredSize, path }) => {
    const content = blobs.get(oid);
    if (!content || content.length !== declaredSize) {
      throw new Error(`observed-shape committed blob size mismatch: ${path}`);
    }
    return {
      path,
      type: 'file',
      mode,
      size: content.length,
      sha256: createHash('sha256').update(content).digest('hex'),
    };
  });
  const sourceEntries = entries.filter((entry) => (
    entry.path.startsWith('src/') && isObservedShapeSubjectPath(entry.path)
  ));
  const detectorSet = new Set(detectorPaths);
  const detectorEntries = entries.filter((entry) => detectorSet.has(entry.path));
  const scanEntries = sourceEntries.filter((entry) => isObservedShapeScanPath(entry.path));
  if (!sourceEntries.length || !scanEntries.length
    || detectorEntries.length !== detectorPaths.length) {
    throw new Error('observed-shape subject commit has an incomplete source or detector tree');
  }
  return {
    scanTree: fileManifestFromEntries(scanEntries),
    sourceTree: fileManifestFromEntries(sourceEntries),
    detectorTree: fileManifestFromEntries(detectorEntries),
    executionTree: fileManifestFromEntries([...sourceEntries, ...detectorEntries]),
  };
}

function validateBaselineHistory(baseline) {
  const subjectSha = baseline.migrationReview.subjectSha;
  try {
    execFileSync('git', ['cat-file', '-e', `${subjectSha}^{commit}`], { cwd: ROOT });
    execFileSync('git', ['merge-base', '--is-ancestor', subjectSha, 'HEAD'], { cwd: ROOT });
  } catch (error) {
    throw new Error('observed-shape migration genesis is not a committed ancestor of current HEAD', { cause: error });
  }
  const baselinePath = relative(ROOT, BASELINE).split('\\').join('/');
  let predecessorText;
  try {
    predecessorText = execFileSync('git', ['show', `${subjectSha}:${baselinePath}`], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch (error) {
    throw new Error('observed-shape migration genesis commit lacks its predecessor baseline', { cause: error });
  }
  let predecessor;
  try {
    predecessor = JSON.parse(predecessorText);
  } catch (error) {
    throw new Error('observed-shape committed predecessor baseline is not valid JSON', { cause: error });
  }
  if (sha256Text(predecessorText) !== baseline.migrationReview.predecessorBaselineTextSha256
    || digestOf(predecessor) !== baseline.migrationReview.predecessorBaselineDigest
    || digestOf(predecessor.inventory) !== baseline.migrationReview.predecessorInventoryDigest) {
    throw new Error('observed-shape migration receipt does not match the predecessor baseline committed at its genesis SHA');
  }
  const genesis = committedInputManifestsFor(subjectSha);
  for (const [manifestName, receiptName] of [
    ['scanTree', 'scanTreeDigest'],
    ['sourceTree', 'sourceTreeDigest'],
    ['detectorTree', 'detectorTreeDigest'],
    ['executionTree', 'executionTreeDigest'],
  ]) {
    if (genesis[manifestName].digest !== baseline.migrationReview[receiptName]) {
      throw new Error(`observed-shape migration receipt ${receiptName} does not reconstruct from its genesis commit`);
    }
  }
  const receiptCommits = execFileSync('git', [
    'rev-list', '--reverse', '--ancestry-path', `${subjectSha}..HEAD`, '--', baselinePath,
  ], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  let committedGenesisReceipt = null;
  for (const commit of receiptCommits) {
    let candidate;
    try {
      candidate = JSON.parse(execFileSync('git', ['show', `${commit}:${baselinePath}`], {
        cwd: ROOT,
        encoding: 'utf8',
        maxBuffer: 16 * 1024 * 1024,
      }));
    } catch {
      continue;
    }
    if (candidate?.schema !== BASELINE_SCHEMA) continue;
    if (candidate.migrationReview?.subjectSha !== subjectSha) {
      throw new Error(`observed-shape first schema-${BASELINE_SCHEMA} baseline has a different migration genesis`);
    }
    committedGenesisReceipt = candidate.migrationReview;
    break;
  }
  if (!committedGenesisReceipt) {
    throw new Error(`observed-shape migration receipt has no committed schema-${BASELINE_SCHEMA} genesis descendant`);
  }
  if (canonicalJson(committedGenesisReceipt) !== canonicalJson(baseline.migrationReview)) {
    throw new Error(`observed-shape migration receipt changed after its committed schema-${BASELINE_SCHEMA} genesis`);
  }
  return baseline;
}

function inputSnapshot(runtime) {
  const files = runtime.sourceFiles();
  const subject = runtime.subjectFiles();
  const detector = runtime.scannerToolFiles();
  const execution = runtime.executionInputFiles();
  return {
    files,
    subject,
    detector,
    execution,
    headSha: runtime.repositoryHeadFor(),
    dirty: runtime.dirtyInputsFor(),
    baselineTextSha256: runtime.baselineExists()
      ? sha256Text(runtime.readBaselineText())
      : null,
    scanTree: runtime.fileManifestOf(ROOT, files),
    sourceTree: runtime.fileManifestOf(ROOT, subject),
    detectorTree: runtime.fileManifestOf(ROOT, detector),
    executionTree: runtime.fileManifestOf(ROOT, execution),
  };
}

function assertStableSnapshot(before, after, { requireClean = false } = {}) {
  const stableView = (snapshot) => ({
    files: snapshot.files.map((file) => resolve(file)),
    subject: snapshot.subject.map((file) => resolve(file)),
    detector: snapshot.detector.map((file) => resolve(file)),
    execution: snapshot.execution.map((file) => resolve(file)),
    headSha: snapshot.headSha,
    baselineTextSha256: snapshot.baselineTextSha256,
    scanTree: snapshot.scanTree,
    sourceTree: snapshot.sourceTree,
    detectorTree: snapshot.detectorTree,
    executionTree: snapshot.executionTree,
  });
  if (canonicalJson(stableView(before)) !== canonicalJson(stableView(after))) {
    throw new Error('observed-shape inputs or HEAD changed while the scan was running; discard the evidence and retry');
  }
  if (before.dirty !== after.dirty) {
    throw new Error('observed-shape input dirtiness changed while the scan was running; discard the evidence and retry');
  }
  if (requireClean && (before.dirty || after.dirty)) {
    throw new Error(`observed-shape evidence requires clean committed inputs:\n${after.dirty || before.dirty}`);
  }
  return after;
}

function assertAuthoritativeSnapshot(snapshot, runtime) {
  const subjectSha = runtime.subjectShaFor();
  const scannerSha = runtime.scannerShaFor();
  if (snapshot.headSha) {
    if (subjectSha !== snapshot.headSha || scannerSha !== snapshot.headSha) {
      throw new Error('observed-shape current evidence must bind subject and scanner to clean current HEAD');
    }
    const committed = runtime.committedInputManifestsFor(snapshot.headSha);
    for (const name of ['scanTree', 'sourceTree', 'detectorTree', 'executionTree']) {
      if (canonicalJson(snapshot[name]) !== canonicalJson(committed[name])) {
        throw new Error(`observed-shape current ${name} is not the exact committed HEAD input tree`);
      }
    }
  } else if (!process.env.OSR_SUBJECT_SHA || !process.env.OSR_SCANNER_SHA) {
    throw new Error('Git-less observed-shape evidence requires explicit OSR_SUBJECT_SHA and OSR_SCANNER_SHA');
  }
  if (snapshot.dirty) {
    throw new Error(`observed-shape evidence requires clean committed inputs:\n${snapshot.dirty}`);
  }
  return { subjectSha, scannerSha };
}

function artifactArguments({
  scanMode, snapshot, subjectSha, scannerSha, corpus, findings, stats, sentinel,
}) {
  return {
    scanMode,
    baselineSchema: artifactBaselineSchemaOf(scanMode),
    subjectSha,
    scannerSha,
    scanTree: snapshot.scanTree,
    sourceTree: snapshot.sourceTree,
    detectorTree: snapshot.detectorTree,
    executionTree: snapshot.executionTree,
    scanConfig: SCAN_CONFIG,
    ...(scanMode === 'legacy-leaf'
      ? { legacyAlgorithm: governedLegacyAlgorithmOf(snapshot.detectorTree) }
      : {}),
    corpus,
    findings,
    stats,
    sentinel,
    inventory: artifactInventoryOf(scanMode, findings),
  };
}

function assertArtifactMatchesSnapshot(artifact, snapshot, { subjectSha, scannerSha } = {}) {
  validateScanArtifact(artifact);
  const expected = {
    scanTree: snapshot.scanTree,
    sourceTree: snapshot.sourceTree,
    detectorTree: snapshot.detectorTree,
    executionTree: snapshot.executionTree,
  };
  for (const [name, manifest] of Object.entries(expected)) {
    if (canonicalJson(artifact[name]) !== canonicalJson(manifest)) {
      throw new Error(`observed-shape artifact ${name} does not match the live immutable inputs`);
    }
  }
  if ((subjectSha && artifact.provenance.subjectSha !== subjectSha)
    || (scannerSha && artifact.provenance.scannerSha !== scannerSha)) {
    throw new Error('observed-shape artifact SHA provenance does not match the live immutable inputs');
  }
  return artifact;
}

function assertFindingSourceEvidence(findings, snapshot) {
  const fileByPath = new Map(snapshot.files.map((file) => [
    relative(ROOT, file).split('\\').join('/'), file,
  ]));
  const contents = new Map();
  for (const finding of findings) {
    const path = fileByPath.get(finding.file);
    if (!path) throw new Error(`observed-shape finding is outside the live scan tree: ${finding.file}`);
    let source = contents.get(path);
    if (source === undefined) {
      source = readFileSync(path, 'utf8');
      contents.set(path, source);
    }
    if (!Number.isSafeInteger(finding.pos) || finding.pos < 0 || finding.pos >= source.length) {
      throw new Error(`observed-shape finding position is outside its bound source: ${finding.file}:${finding.pos}`);
    }
    const line = source.slice(0, finding.pos).split('\n').length;
    if (finding.line !== line) {
      throw new Error(`observed-shape finding line does not match its exact source position: ${finding.file}:${finding.pos}`);
    }
    const normalizedWindow = source
      .slice(Math.max(0, finding.pos - 240), Math.min(source.length, finding.pos + 480))
      .replace(/\s+/g, ' ')
      .trim();
    if (!normalizedWindow.includes(finding.text)) {
      throw new Error(`observed-shape finding text is not present around its exact source position: ${finding.file}:${finding.pos}`);
    }
    const kind = finding.site?.match(/\|kind=(dot|element)\|/)?.[1];
    if (kind === 'dot' && source.slice(finding.pos, finding.pos + finding.key.length) !== finding.key) {
      throw new Error(`observed-shape dot finding position does not name its key: ${finding.file}:${finding.pos}`);
    }
  }
  return findings;
}

function unscannedInputDigestOf(snapshot) {
  const scanned = new Set(snapshot.scanTree.entries.map((entry) => entry.path));
  return digestOf(snapshot.sourceTree.entries.filter((entry) => !scanned.has(entry.path)));
}

function baselineOf({ snapshot, headSha, corpus, stats, sentinel, findings, migrationReview }) {
  const inventory = inventoryOf(findings);
  const manifests = {
    scanTree: snapshot.scanTree,
    sourceTree: snapshot.sourceTree,
    detectorTree: snapshot.detectorTree,
    executionTree: snapshot.executionTree,
  };
  const baseline = {
    _doc: [
      'READER-WITH-NO-WRITER INVENTORY — per-file HEURISTIC-LEAF identities, SHRINK-ONLY.',
      'A row is "<key> on <shape>": multiplicity, produced by the governed legacy-leaf detector.',
      'Content-addressed per identity: dormant headroom and identity swaps are refused, so a NEW',
      'identity in an already-listed file reds exactly as a new file does, even at constant count.',
      'The line number is excluded so unrelated line churn does not rewrite the governed identity.',
      'Fixes may only lower or delete rows. Detector changes require a new governed instrument migration.',
      'The RETIRED schema-3 exact "<key> on <shape> @ <origin> # <site>" spelling cannot enter this file.',
      'SCHEMA 6 = the same identity, NON-DOMAIN-SURFACE FILTERED. The byte-frozen detector is unchanged;',
      'its output is narrowed by FOUR DECLARED post-filters in check-observed-shape-readers.mjs —',
      'CR-OSR-FREEZE-6 shape-family union (M6), the M11 DOM-global receiver exclusion, the M12',
      'language-surface residual, and the M8/M9 explained-writer exemption. All four are inside',
      'the detectorTree digest this envelope binds, so retuning any reds the gate and needs a new mint.',
      'A row here therefore means: a guarded read, of a real record rather than of browser or language',
      'surface, of a key NO writer the corpus runs produces and no declared out-of-corpus writer explains.',
      'Schema 4 (raw) and schema 5 (M6 + M8/M9 only) are the RETIRED predecessors.',
    ],
    schema: BASELINE_SCHEMA,
    frozen: new Date().toISOString().slice(0, 10),
    frozenAtSha: headSha,
    minRows: MIN_ROWS,
    originMinRows: ORIGIN_MIN_ROWS,
    corpusMeta: corpus.meta,
    scanStats: stats,
    sentinel,
    total: findings.length,
    identities: Object.values(inventory).reduce((sum, row) => sum + Object.keys(row).length, 0),
    inventory,
    migrationReview,
    manifests,
    scannerProvenance: {
      scanTreeDigest: manifests.scanTree.digest,
      sourceTreeDigest: manifests.sourceTree.digest,
      detectorDigest: manifests.detectorTree.digest,
      executionTreeDigest: manifests.executionTree.digest,
      unscannedInputDigest: unscannedInputDigestOf(manifests),
    },
    digests: {
      corpusMeta: digestOf(corpus.meta),
      scanStats: digestOf(stats),
      sentinel: digestOf(sentinel),
      inventory: digestOf(inventory),
      manifests: digestOf(manifests),
      migrationReview: digestOf(migrationReview),
    },
  };
  validateSchema6Baseline(baseline);
  return baseline;
}

const sha256Text = (text) => createHash('sha256').update(text).digest('hex');

function writeBaselineAtomically(value, expectedText) {
  const targetStat = lstatSync(BASELINE);
  if (!targetStat.isFile() || targetStat.isSymbolicLink()) {
    throw new Error('observed-shape baseline target must remain a regular non-symlink file');
  }
  const lock = `${BASELINE}.write-lock`;
  const temporary = `${BASELINE}.tmp-${process.pid}-${randomBytes(10).toString('hex')}`;
  let lockFd;
  let temporaryFd;
  try {
    lockFd = openSync(lock, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, 0o600);
    if (readFileSync(BASELINE, 'utf8') !== expectedText) {
      throw new Error('observed-shape predecessor baseline changed after validation; refusing replacement');
    }
    temporaryFd = openSync(
      temporary,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL,
      0o644,
    );
    writeFileSync(temporaryFd, `${canonicalJson(value, 1)}\n`, 'utf8');
    fsyncSync(temporaryFd);
    closeSync(temporaryFd);
    temporaryFd = undefined;
    renameSync(temporary, BASELINE);
    const directoryFd = openSync(dirname(BASELINE), constants.O_RDONLY);
    try {
      fsyncSync(directoryFd);
    } finally {
      closeSync(directoryFd);
    }
  } finally {
    if (temporaryFd !== undefined) closeSync(temporaryFd);
    if (lockFd !== undefined) closeSync(lockFd);
    if (existsSync(temporary)) unlinkSync(temporary);
    if (existsSync(lock)) unlinkSync(lock);
  }
}

export function frozenDetectorDigestOf(baseline) {
  const topLevel = baseline?.scannerProvenance?.detectorDigest || null;
  const migration = baseline?.migrationReview?.currentDetectorDigest || null;
  if (topLevel && migration && topLevel !== migration) {
    throw new Error('observed-shape baseline scanner provenance disagrees with its migration receipt');
  }
  return topLevel || migration;
}

/** Parse the bounded scan-only mode before executing its expensive inputs. */
export function commandOf(argv = []) {
  const parsed = parseExactFlags(argv, {
    '--scan-only': { kind: 'flag', name: 'scanOnly' },
    '--scan-mode': { kind: 'value', name: 'scanMode' },
    '--corpus-artifact': { kind: 'value', name: 'corpusArtifactPath' },
    '--json': { kind: 'value', name: 'jsonPath' },
    '--report': { kind: 'flag', name: 'report' },
    '--progress': { kind: 'flag', name: 'progress' },
    '--write': { kind: 'flag', name: 'write' },
    [`--migrate-schema=${BASELINE_SCHEMA}`]: { kind: 'flag', name: 'migrationFlag' },
    '--migration-review': { kind: 'value', name: 'migrationReviewPath' },
  });
  // ⚠⚠ THE GATE'S MODE IS NOT A DEFAULT — IT IS THE BASELINE AUTHORITY.
  // `--scan-mode` remains a `--scan-only` affordance for targeted EXACT probes;
  // every baseline-bearing mode (gate, --report, --write, --migrate-schema)
  // drives `BASELINE_SCAN_MODE`, because the frozen inventory is spelled in that
  // mode's identities and a gate running the other detector would compare two
  // different alphabets and report the whole tree as new.
  const scanMode = parsed.scanOnly ? (parsed.scanMode || 'exact-origin') : BASELINE_SCAN_MODE;
  if (!['exact-origin', 'legacy-leaf'].includes(scanMode)) {
    throw new Error(`observed-shape --scan-mode is unsupported: ${JSON.stringify(scanMode)}`);
  }
  if (parsed.scanOnly && !parsed.jsonPath) {
    throw new Error('observed-shape --scan-only requires a nonempty --json=<artifact-path>');
  }
  if (!parsed.scanOnly && (parsed.jsonPath || parsed.scanMode || parsed.corpusArtifactPath)) {
    throw new Error('observed-shape --json, --scan-mode, and --corpus-artifact are only valid with --scan-only');
  }
  if (parsed.scanOnly && (parsed.write || parsed.report
    || parsed.migrationFlag || parsed.migrationReviewPath)) {
    throw new Error('observed-shape --scan-only cannot be combined with baseline/report modes');
  }
  // ⚠⚠ THE LEGACY LEG CAN EXECUTE ITS OWN CORPUS. It used to REQUIRE
  // `--corpus-artifact=<validated exact-origin artifact>`, which made the
  // heuristic leg unrunnable the moment the exact leg stopped being able to
  // finish a full-tree scan: the only artifact it would accept was one that can
  // no longer be produced. `--corpus-artifact` stays supported — pinning both
  // legs to ONE executed corpus is exactly what the migration reconciliation
  // needs — but it is now an OPTION, not a precondition. Without it the legacy
  // leg executes the producers fresh, the same way the exact leg always has.
  if (scanMode === 'exact-origin' && parsed.corpusArtifactPath) {
    throw new Error('observed-shape exact-origin scan executes the corpus fresh and forbids --corpus-artifact');
  }
  if (parsed.migrationFlag && (!parsed.write || !parsed.migrationReviewPath)) {
    throw new Error(`observed-shape --migrate-schema=${BASELINE_SCHEMA} requires --write and a nonempty --migration-review=<bundle.json>`);
  }
  if (parsed.migrationReviewPath && (!parsed.write || !parsed.migrationFlag)) {
    throw new Error('observed-shape --migration-review is only valid for an explicit schema migration write');
  }
  if (parsed.write && parsed.report) throw new Error('observed-shape --write and --report are conflicting modes');
  return {
    ...parsed,
    mode: parsed.scanOnly ? 'scan-only' : 'gate',
    scanMode,
  };
}

export async function run(argv = [], overrides = {}) {
  const command = commandOf(argv);
  const runtime = {
    corpusFor,
    sourceFiles,
    subjectFiles,
    executionInputFiles,
    scanReaders,
    scanLegacyReaders,
    fileManifestOf,
    scannerToolFiles,
    subjectShaFor: () => gitShaFor('OSR_SUBJECT_SHA'),
    scannerShaFor: () => gitShaFor('OSR_SCANNER_SHA'),
    headShaFor,
    repositoryHeadFor,
    dirtyInputsFor,
    assertHealthyScanProvenance,
    assertExplainedWriterEvidence: () => assertExplainedWriterEvidence(),
    createScanArtifact,
    validateScanArtifact,
    assertFindingSourceEvidence,
    validateBaseline: validateSchema6Baseline,
    validateBaselineHistory,
    committedInputManifestsFor,
    validateMigrationBundle,
    planArtifactOutput: (path, inputs, protectedPaths) => planExternalArtifactOutputs({
      root: ROOT, outputs: [path], inputs, protectedPaths,
    })[0],
    writeArtifact: (plan, artifact) => publishJsonExclusive(plan, artifact, {
      stringify: (value) => canonicalJson(value, 2),
    }),
    readJson: (path) => JSON.parse(readFileSync(path, 'utf8')),
    writeProgress: (event) => process.stderr.write(`${JSON.stringify(event)}\n`),
    baselineExists: () => existsSync(BASELINE),
    readBaseline: () => JSON.parse(readFileSync(BASELINE, 'utf8')),
    readBaselineText: () => readFileSync(BASELINE, 'utf8'),
    writeBaseline: writeBaselineAtomically,
    ...overrides,
  };
  const emitProgress = command.progress
    ? (event) => runtime.writeProgress({ at: new Date().toISOString(), ...event })
    : null;
  const readBaselineEnvelope = () => {
    if (overrides.readBaseline && !overrides.readBaselineText) {
      const value = runtime.readBaseline();
      return { value, text: `${canonicalJson(value, 1)}\n` };
    }
    const text = runtime.readBaselineText();
    return { value: JSON.parse(text), text };
  };

  let baseline = null;
  let baselineText = null;
  let bundle = null;
  let migrationReceipt = null;
  if (command.mode === 'gate') {
    if (!runtime.baselineExists()) throw new Error('observed-shape baseline is missing');
    ({ value: baseline, text: baselineText } = readBaselineEnvelope());
    if (command.migrationFlag) {
      if (baseline.schema === BASELINE_SCHEMA) {
        throw new Error(`observed-shape baseline is already schema ${BASELINE_SCHEMA}; a migration review cannot authorize ordinary maintenance.`);
      }
      bundle = runtime.readJson(command.migrationReviewPath);
      migrationReceipt = runtime.validateMigrationBundle(bundle);
      if (digestOf(baseline) !== migrationReceipt.predecessorBaselineDigest
        || canonicalJson(baseline) !== canonicalJson(bundle.predecessorBaseline)
        || sha256Text(baselineText) !== migrationReceipt.predecessorBaselineTextSha256) {
        throw new Error('observed-shape migration bundle is not bound to the exact predecessor baseline bytes and content');
      }
    } else if (baseline.schema !== BASELINE_SCHEMA) {
      if (command.write) {
        throw new Error(`observed-shape baseline schema ${JSON.stringify(baseline.schema)} cannot be overwritten by schema ${BASELINE_SCHEMA}. Run the governed migration report and pass --migrate-schema=${BASELINE_SCHEMA} explicitly.`);
      }
      console.error(`observed-shape baseline: schema ${JSON.stringify(baseline.schema)} — expected ${BASELINE_SCHEMA}.`
        + ' Build and review the governed migration bundle, then explicitly re-freeze with'
        + ` --write --migrate-schema=${BASELINE_SCHEMA} --migration-review=<bundle.json>.`);
      return 1;
    } else {
      runtime.validateBaseline(baseline);
      runtime.validateBaselineHistory(baseline);
    }
  }

  const before = inputSnapshot(runtime);
  if (baselineText != null && sha256Text(baselineText) !== before.baselineTextSha256) {
    throw new Error('observed-shape baseline changed between admission and input snapshot; retry from one immutable predecessor');
  }
  let authority = null;
  if (command.mode === 'scan-only' || command.write) {
    authority = assertAuthoritativeSnapshot(before, runtime);
  }
  if (baseline?.schema === BASELINE_SCHEMA
    && (baseline.scannerProvenance.detectorDigest !== before.detectorTree.digest
      || baseline.scannerProvenance.unscannedInputDigest !== unscannedInputDigestOf(before))) {
    const message = `observed-shape detector or unscanned execution input changed since the schema-${BASELINE_SCHEMA} instrument was governed; an ordinary gate/write cannot migrate the instrument`;
    if (command.write) throw new Error(message);
    console.error(message);
    return 1;
  }

  let outputPlan = null;
  if (command.mode === 'scan-only') {
    outputPlan = runtime.planArtifactOutput(
      command.jsonPath,
      command.corpusArtifactPath ? [command.corpusArtifactPath] : [],
      [BASELINE, ...before.execution],
    );
  }

  let corpus;
  emitProgress?.({ phase: 'corpus-start', scanMode: command.scanMode });
  if (command.corpusArtifactPath) {
    const inputCorpusArtifact = runtime.readJson(command.corpusArtifactPath);
    runtime.validateScanArtifact(inputCorpusArtifact);
    if (inputCorpusArtifact.scanMode !== 'exact-origin') {
      throw new Error('observed-shape legacy detector requires a validated exact-origin corpus artifact');
    }
    assertArtifactMatchesSnapshot(inputCorpusArtifact, before, authority);
    corpus = inputCorpusArtifact.corpus;
  } else if (command.migrationFlag) {
    assertArtifactMatchesSnapshot(bundle.currentArtifact, before, authority);
    assertArtifactMatchesSnapshot(bundle.legacyArtifact, before, authority);
    corpus = bundle.currentArtifact.corpus;
  } else {
    corpus = await runtime.corpusFor();
  }
  emitProgress?.({
    phase: 'corpus-complete',
    scanMode: command.scanMode,
    origins: Object.keys(corpus.graph?.origins || {}).length,
  });

  // The heuristic (legacy-leaf) leg is deliberately handed the UNFILTERED file
  // list: it is the coverage CR-OSR-SCOPE-1's UI exclusion leans on.
  const excludedReadScopes = command.scanMode === 'legacy-leaf'
    ? []
    : assertExactScanExcludedScope();
  emitProgress?.({
    phase: 'scan-start',
    scanMode: command.scanMode,
    files: before.files.length,
    excludedReadScopes,
  });
  const rawScan = command.scanMode === 'legacy-leaf'
    ? runtime.scanLegacyReaders({
      files: before.files,
      shapes: corpus.shapes,
      arrayShapes: corpus.arrayShapes,
      singleHome: corpus.singleHome,
      rootShapes: corpus.rootShapes,
      minRows: MIN_ROWS,
      root: ROOT,
    })
    : runtime.scanReaders({
      files: before.files,
      graph: corpus.graph,
      minRows: ORIGIN_MIN_ROWS,
      root: ROOT,
      excludedReadScopes,
      onReadStart: emitProgress
        ? (read) => emitProgress({ phase: 'read-start', ...read })
        : null,
    });
  emitProgress?.({
    phase: 'scan-complete',
    scanMode: command.scanMode,
    findings: rawScan.findings.length,
    reads: rawScan.stats.reads,
    excludedReadFiles: rawScan.stats.excludedReadFiles ?? 0,
  });
  // ⚠ EVIDENCE AND VACUITY ARE MEASURED ON THE DETECTOR'S WHOLE OUTPUT, BEFORE
  // THE FILTER EXISTS IN THIS DATA FLOW. Source evidence is proven for every row
  // the detector emitted (a filtered row cannot escape the check by being
  // dropped), and the sentinel is built from the detector's own `stats` — so the
  // anti-vacuity floor keeps measuring the DETECTOR's reach and no shape-family
  // threshold can ever be tuned into hiding a corpus that stopped observing.
  runtime.assertFindingSourceEvidence(rawScan.findings, before);
  const sentinel = scanSentinelOf(command.scanMode, corpus, rawScan.stats, SCAN_CONFIG);
  runtime.assertHealthyScanProvenance({
    scanMode: command.scanMode,
    corpus,
    stats: rawScan.stats,
    sentinel,
    scanConfig: SCAN_CONFIG,
  });
  // ⭐⭐ THE DECLARED POST-FILTER CHAIN — post-scan, pre-inventory, and the ONE
  // place its order is fixed. Four filters narrow the byte-frozen detector's
  // output, and they are applied in DECLARATION ORDER (M6, M11, M12, M8/M9),
  // which the walker's own composition must match or it measures a different
  // instrument than the gate. ⚠ ORDER IS IMMATERIAL TO THE RESULT AND THAT IS
  // MEASURED, NOT ASSUMED: the four are DISJOINT on the live estate — no read is
  // claimed by two — so no permutation moves a figure. The order is fixed anyway,
  // because "whatever order it happens to run in" is not a specification.
  // CR-OSR-FREEZE-6 — the shape-family union.
  const familyScan = applyShapeFamilyFilter({ scanMode: command.scanMode, corpus, scan: rawScan });
  emitProgress?.({
    phase: 'family-filter-complete',
    scanMode: command.scanMode,
    findings: familyScan.findings.length,
    cleared: familyScan.familyFilter.cleared,
  });
  // ⭐ M11 — reads whose RECEIVER is a host global, never the record they bound to.
  const domGlobalScan = applyDomGlobalReceiverFilter({
    scanMode: command.scanMode, corpus, scan: familyScan,
  });
  emitProgress?.({
    phase: 'dom-global-filter-complete',
    scanMode: command.scanMode,
    findings: domGlobalScan.findings.length,
    cleared: domGlobalScan.domGlobals.cleared,
  });
  // ⭐ M12 — the builtin prototype members the frozen BUILTIN_MEMBERS list predates.
  const languageScan = applyLanguageSurfaceFilter({
    scanMode: command.scanMode, corpus, scan: domGlobalScan,
  });
  emitProgress?.({
    phase: 'language-surface-filter-complete',
    scanMode: command.scanMode,
    findings: languageScan.findings.length,
    cleared: languageScan.languageSurface.cleared,
  });
  // ⭐ M8/M9 — the explained-writer exemption, last and still upstream of every
  // inventory, so its `cleared` count reports only rows nothing else explained.
  // `assertExplainedWriterEvidence` runs FIRST: a stale entry must red the scan,
  // never quietly exempt nothing.
  const explainedWriterEvidence = runtime.assertExplainedWriterEvidence();
  const scan = applyExplainedWriterFilter({
    scanMode: command.scanMode, scan: languageScan, evidence: explainedWriterEvidence,
  });
  emitProgress?.({
    phase: 'explained-writer-filter-complete',
    scanMode: command.scanMode,
    findings: scan.findings.length,
    cleared: scan.explainedWriters.cleared,
  });
  const after = inputSnapshot(runtime);
  assertStableSnapshot(before, after, { requireClean: command.mode === 'scan-only' || command.write });

  if (command.mode === 'scan-only') {
    const artifact = runtime.createScanArtifact(artifactArguments({
      scanMode: command.scanMode,
      snapshot: after,
      ...authority,
      corpus,
      findings: scan.findings,
      stats: scan.stats,
      sentinel,
    }));
    runtime.writeArtifact(outputPlan, artifact);
    console.log(`observed-shape ${command.scanMode} artifact: ${scan.findings.length} finding(s) written to ${command.jsonPath}`);
    console.log(excludedScopeNotice(excludedReadScopes, scan.stats));
    console.log(shapeFamilyNotice(scan.familyFilter));
    console.log(domGlobalReceiverNotice(scan.domGlobals));
    console.log(languageSurfaceNotice(scan.languageSurface));
    console.log(explainedWriterNotice(scan.explainedWriters));
    return 0;
  }

  if (command.write) {
    if (command.migrationFlag) {
      // ⭐⭐ ONE DETECTOR, RE-EXECUTED. The schema-2 -> schema-3 freeze ran BOTH
      // detectors here and required each to reproduce its own bundled artifact.
      // Schema 4's authority IS the governed heuristic detector, so there is no
      // second artifact to reproduce — and demanding one would require a
      // full-tree EXACT scan, which cannot complete (the measured
      // `src/data/constants.js:56` growth wall). The bundle still carries both
      // `legacyArtifact` and `currentArtifact` so nothing downstream changes
      // shape; under schema 4 they are the SAME artifact, and this is the pin
      // that refuses a bundle where they are not.
      const heuristicArtifact = runtime.createScanArtifact(artifactArguments({
        scanMode: BASELINE_SCAN_MODE, snapshot: after, ...authority, corpus,
        findings: scan.findings, stats: scan.stats, sentinel,
      }));
      const heuristicDigest = digestOf(heuristicArtifact);
      const heuristicText = canonicalJson(heuristicArtifact);
      if (heuristicDigest !== migrationReceipt.legacyArtifactDigest
        || heuristicDigest !== migrationReceipt.currentArtifactDigest
        || heuristicText !== canonicalJson(bundle.legacyArtifact)
        || heuristicText !== canonicalJson(bundle.currentArtifact)) {
        throw new Error('observed-shape migration artifacts do not exactly match the fresh governed heuristic detector');
      }
    } else {
      const maintenance = compare(scan.findings, baseline);
      if (maintenance.violations.length) {
        throw new Error(`observed-shape schema-${BASELINE_SCHEMA} maintenance is shrink-only; growth or an identity swap cannot be re-frozen:\n`
          + maintenance.violations.join('\n'));
      }
      const maintenanceVacuity = sentinelFailures(sentinel, baseline.sentinel);
      if (maintenanceVacuity.length) {
        throw new Error(`observed-shape schema-${BASELINE_SCHEMA} maintenance scan is vacuous:\n${maintenanceVacuity.join('\n')}`);
      }
      migrationReceipt = baseline.migrationReview;
    }
    const finalSnapshot = inputSnapshot(runtime);
    assertStableSnapshot(after, finalSnapshot, { requireClean: true });
    const next = baselineOf({
      snapshot: finalSnapshot,
      headSha: authority.subjectSha,
      corpus,
      stats: scan.stats,
      sentinel,
      findings: scan.findings,
      migrationReview: migrationReceipt,
    });
    runtime.writeBaseline(next, baselineText);
    console.log(`froze ${scan.findings.length} finding(s) / ${next.identities} identit(ies) across ${Object.keys(next.inventory).length} file(s)`);
    return 0;
  }

  const { violations, stale } = compare(scan.findings, baseline);
  const vacuity = sentinelFailures(sentinel, baseline.sentinel);
  if (command.report) {
    for (const finding of scan.findings) {
      console.log(`${finding.file}:${finding.line}  ${finding.key}  on ${finding.shapes.join('|')}   ${finding.text}`);
    }
    console.log(`\n${scan.findings.length} finding(s); scan reached ${scan.stats.resolved}/${scan.stats.reads} reads across ${scan.stats.files} files`);
    console.log(excludedScopeNotice(excludedReadScopes, scan.stats));
    console.log(shapeFamilyNotice(scan.familyFilter));
    console.log(domGlobalReceiverNotice(scan.domGlobals));
    console.log(languageSurfaceNotice(scan.languageSurface));
    console.log(explainedWriterNotice(scan.explainedWriters));
    console.log(cohortNotice(inventoryOf(scan.findings)));
  }
  if (!violations.length && !stale.length && !vacuity.length) {
    console.log(`observed-shape readers: ${scan.findings.length} finding(s), exactly matching the frozen inventory.`);
    console.log(shapeFamilyNotice(scan.familyFilter));
    console.log(domGlobalReceiverNotice(scan.domGlobals));
    console.log(languageSurfaceNotice(scan.languageSurface));
    console.log(explainedWriterNotice(scan.explainedWriters));
    console.log(cohortNotice(baseline.inventory));
    return 0;
  }
  for (const violation of vacuity) console.error(`ANTI-VACUITY — ${violation}`);
  for (const violation of violations) console.error(violation);
  for (const staleRow of stale) console.error(`STALE ROW — ${staleRow}`);
  return 1;
}

const invokedDirectly = process.argv[1] && relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) process.exit(await run(process.argv.slice(2)));
