#!/usr/bin/env node
/**
 * Governed observed-reader baseline migrations.
 *
 * TWO MIGRATION FAMILIES LIVE HERE, and their target rungs are explicit:
 *
 *   schema 2 -> 3  (RETIRED) `migrationReport`. Pairs the governed heuristic
 *     detector against the EXACT detector site-by-site, so the target inventory
 *     is a NEW alphabet and every paired site needs its own reviewed row.
 *
 *   schema 2 -> 4  (RETIRED) `heuristicMigrationReport`. CR-OSR-FREEZE-3-R1: the
 *     heuristic leaf identity becomes its own schema, so the target inventory is
 *     the heuristic artifact's OWN inventory — the SAME alphabet the schema-2
 *     predecessor is spelled in. There is no cross-detector pairing to review,
 *     and therefore no `rows`: the whole reconciliation is the predecessorRows
 *     ledger that already exists. It needs NO exact artifact, which is the point
 *     — the exact detector cannot complete a full-tree scan.
 *
 *   schema 4 -> 5  (RETIRED) the SAME function with a different target. The
 *     alphabet did not move again — schema 5 is schema 4's identity with the
 *     detector's output NARROWED by two declared post-filters — so the whole
 *     review is once more `predecessorRows`, and the code path is genuinely the
 *     same argument rather than a copy of it. The only two things that differ
 *     are which schema the predecessor envelope must be, and which number the
 *     target claims; both are parameters, and `LEAF_MIGRATION_PREDECESSOR`
 *     is the one table that binds them so no caller can pair 5 with a schema-2
 *     predecessor or 4 with a schema-4 one.
 *
 *   schema 5 -> 6  (RETIRED) the same function, a third target, and NOT ONE new
 *     branch. Schema 6 adds two further post-filters (M11 DOM-global receiver,
 *     M12 language-surface residual) to the same byte-frozen detector, so the
 *     alphabet is unchanged for the third time running and the reconciliation
 *     is once more `predecessorRows`. That this migration needed only a row in
 *     `LEAF_MIGRATION_PREDECESSOR` and an entry in the predecessor-validator
 *     table is the evidence that the 4→5 generalisation was the right shape.
 *
 *   schema 6 -> 7  (RETIRED) the same numeric reconciliation, re-admitting
 *     explained-writer rows and binding their governance in sparse rowTags.
 *
 *   schema 7 -> 8  (RETIRED) the same tagged numeric reconciliation after the
 *     governed corpus builder gains an opt-in scalar second consumer. Its
 *     default topology bytes stay stable; the frozen artifact remains topology.
 *
 *   schema 8 -> 9  (LIVE)    the same tagged numeric reconciliation, re-governing
 *     the instrument to inputs that moved UNDER it: the corpus's dark
 *     `advanceEpochEnabled` decision, two added `package.json` scripts, and one
 *     changed generated (subject-but-UNSCANNED) source file. Two things make it
 *     the first target that is not a straight repeat of its predecessor: the
 *     delta is FIVE governed paths rather than four, and the unscanned input
 *     digest MOVED — recorded for review by named path instead of refused,
 *     because refusing it would leave the instrument permanently dark. Its
 *     reconciliation is NOT constrained to same-only rows (see
 *     `assertCorpusCoverageInventoryInvariant`, which is schema 8's alone):
 *     the mint is cut at a later tip than the one it was measured at.
 *
 *   schema 10 -> 11 (LIVE)   the same tagged numeric reconciliation, re-governing the
 *     instrument to a DETECTOR THAT GENUINELY CHANGED (TE-OSHAPE-1's provenance-drift
 *     classifier and its fourth door) and growing the explained-writer bank by ONE, the
 *     ninth identity under the new `conditional-generator-branch` mechanism. It is also
 *     THE RUNG THAT COULD NOT RUN, and the reason is recorded here rather than in a
 *     lane note: every rung before it migrated from a predecessor that still sat at its
 *     own mint, so `frozenAtSha === migrationReview.subjectSha` held by accident and was
 *     mistaken for a law. A lawful shrink had since re-frozen the schema-10 baseline
 *     (`12b3aa53` -> `4f42be70`), and the instrument became permanently unmigratable.
 *     ⛔ CHAIR RULING ODQ §784.2 replaced that equality with the bind that always
 *     carried custody — see `assertPredecessorCustody`. BIND BY DIGEST, NEVER BY
 *     GENESIS; this is the third recorded instance of that family law.
 *
 *   ⚠ RUNGS 11 -> 12 THROUGH 14 -> 15 KEEP THEIR RATIONALE BESIDE THEIR OWN TARGET
 *     CONSTANTS rather than in this list, and that is where to read them. This note
 *     exists because the list above stops at 10 -> 11 and a reader could otherwise
 *     take that for the newest rung; it is not.
 *
 *   schema 15 -> 16 (LIVE)   the same tagged numeric reconciliation, re-governing the
 *     instrument to a DOOR whose VALIDATOR changed while its DETECTOR did not. The
 *     virtual-dormant-writer door's clause 1 became SHAPE-SCOPED and its clause 2 now
 *     accepts a gate in a row-declared COMPANION file. Two things make it not a straight
 *     repeat of its predecessor:
 *       - THE DRIFT IS A CLOSED VALIDATOR HOLE, NOT A NEW DETECTION. Clause 1 accepted a
 *         READ SITE as a write shape (measured: an argument-list token as `shorthand`, a
 *         re-emission onto another shape as `property`), so a row could name a pure
 *         reader as its writer and pass for two of three keys. Which reads are FOUND did
 *         not change; only which explanations are ACCEPTED.
 *       - THE ALPHABET IS UNCHANGED AND THAT WAS PROVED BY A PASSING ARM, not argued: the
 *         walker's inventory triple reproduces five figures frozen under the PREVIOUS
 *         detector, which a different alphabet could not do. So the reconciliation is
 *         `predecessorRows` with row delta ZERO.
 *     Its delta is THREE instrument paths, MEASURED against the predecessor's own
 *     manifest and re-measured after the set was written — a fixed point, because writing
 *     the set changes a file that is itself in it. See
 *     `COMPANION_GATE_SCANNER_DELTA_PATHS`.
 *     ⭐ AND IT IS RE-RUNNABLE, DEMONSTRATED RATHER THAN ASSUMED, because 10 -> 11's
 *     disaster was not a bad migration but one that left the instrument unable to move
 *     again: `assertPredecessorCustody` was executed against a predecessor whose
 *     `frozenAtSha` had been advanced past its `subjectSha` and it ACCEPTED, while still
 *     refusing a review edited under its own digest. Nothing this rung adds reads that
 *     equality, and a 16 -> 17 needs the same four data rows this one added.
 *
 *   schema 16 -> 17 (LIVE)   the same tagged numeric reconciliation, and THE FIRST RUNG
 *     SINCE 8 WHOSE SUBJECT IS THE CORPUS BUILDER RATHER THAN THE DOOR. Two things
 *     follow from that, and neither is a repeat of 16:
 *       - IT MOVES ROWS, AND THAT IS THE POINT. Rungs 13, 14, 15 and 16 were
 *         verdict-only and had to report a row delta of ZERO. This one clears TWELVE
 *         frozen rows and adds NONE, because the corpus can now observe writers it
 *         never could. `predecessorGone` is therefore expected to be 12 and
 *         `predecessorNew`/`predecessorIncreased` must still be 0 — a single NEW row
 *         means the corpus grew its judgement rather than its observation, and the mint
 *         STOPS. (The report raises issues for `new` and `increased` only; `gone` is a
 *         lawful shrink and needs no discharge, which is precisely why the zero on the
 *         other two is the fence that matters.)
 *       - THE CORPUS'S EXECUTION IDENTITY DOES NOT MOVE. `seeds`, `configs`,
 *         `generations` and `pulseIntervals` are `corpusCompatibilityOf`'s EXECUTION
 *         keys and must match the predecessor exactly; the three OBSERVATION keys
 *         (`simulationFlagsLit`, `steadingsMinted`, `shapeCount`) are recorded rather
 *         than refused, and here they do not move either. That is not luck: the stress
 *         pass enters `roots` and NOT `generated`, so producer 2's pulse — every save,
 *         every steading, every shape it mints — is untouched. Feeding the same
 *         settlements through `generated` instead moves four execution keys and would
 *         be refused by that function before any review could see it.
 *     Its delta is FOUR instrument paths — the corpus builder as SUBJECT plus the three
 *     bookkeeping files every rung moves — MEASURED against the predecessor's own
 *     recorded manifest and re-measured after the set was written, because writing it
 *     changes `migrate-observed-shape-readers.mjs`, which is itself a member. See
 *     `STRESS_TOPOLOGY_SCANNER_DELTA_PATHS`.
 *
 *   schema 17 -> 18 (LIVE)   the same tagged numeric reconciliation, and THE FIRST RUNG
 *     WHOSE SUBJECT IS THE RECEIPT'S OWN PROVENANCE RATHER THAN THE DETECTOR OR THE
 *     CORPUS. Nothing about what the instrument SEES moves; what moves is where its
 *     receipt can be READ FROM.
 *       - WHY A RUNG IS THE ONLY ROAD. `validateBaselineHistory` requires
 *         `migrationReview.subjectSha` to be a committed ancestor of HEAD and then
 *         reconstructs the whole receipt — predecessor baseline text, scan/source/
 *         detector/execution tree digests — FROM THAT COMMIT'S TREE. Schema 17's genesis
 *         was taken in its lane's own dock and CHERRY-PICKED into the composed lineage,
 *         so its subject sha is reachable as an object but is not an ancestor of any
 *         commit that carries the register. The receipt cannot reconstruct from anything
 *         in this lineage, and the validator therefore refuses the ORDINARY GATE and
 *         every `--write` alike — it runs before the scan, so the instrument returns 1
 *         in zero seconds without looking at a single file. ⛔ A hand-edited `subjectSha`
 *         would not reconstruct either; it would only make the receipt a lie. The
 *         governed migration path is the one door that does not consult history, because
 *         it BRINGS its own predecessor bytes in the bundle, so a rung is the only lawful
 *         re-anchoring and this is it.
 *       - IT MOVES NO ROW, AND THAT IS THE FENCE. Rung 17 cleared twelve; this one is
 *         verdict-only like 13, 14, 15 and 16, and its reconciliation must be EMPTY —
 *         `predecessorGone`, `predecessorNew`, `predecessorIncreased` and
 *         `predecessorDecreased` are ALL required to be 0. Measured before the rung was
 *         cut: the tip's live scan reproduces the frozen register exactly (1,972 findings
 *         / 1,397 identities / 386 files, zero rows gone, new or count-moved), so any
 *         movement at all would mean this rung's own bookkeeping changed a verdict, which
 *         a re-anchoring may not do.
 *       - THE ONE FIGURE THAT DOES MOVE IS AN OBSERVATION KEY.
 *         `corpusMeta.simulationFlagsLit` goes 80 -> 81, because the register was frozen
 *         before SEAT-78 minted `irregularForceEnabled` and the corpus lights every
 *         simulation flag it can see. That is a `CORPUS_OBSERVATION_KEYS` member —
 *         RECORDED by `corpusCompatibilityOf`, never refused — while all four
 *         EXECUTION keys (seeds 4, configs 4, generations 16, pulseIntervals 12) are
 *         measured unmoved, which is what makes the two sides the same experiment.
 *     Its delta is THREE instrument paths, the bookkeeping set every verdict-only rung
 *     moves, MEASURED against the predecessor's own recorded manifest — at which all
 *     ELEVEN detector inputs were byte-identical before this rung was written. See
 *     `LINEAGE_REANCHOR_SCANNER_DELTA_PATHS`.
 *
 *   schema 18 -> 19 (RETIRED) the same tagged numeric reconciliation, re-governing the
 *     register to a declared M8/M9 bank of EIGHT after the owner's 2026-09-17 order
 *     deleted the writer of `factions on locks`. It moves six rows, every one an estate
 *     shrink. Its full rationale lives beside `EXEMPTION_RETIREMENT_TARGET_SCHEMA`.
 *
 *   schema 19 -> 20 (RETIRED) the same tagged numeric reconciliation, and THE FIRST RUNG
 *     WHOSE SUBJECT IS THE WRITE: a register whose bank the walker's hand-owned literal
 *     module does not already state is REFUSED before a byte moves, and a migration write
 *     is refused unless the rung's own declared post-bank (`DECLARED_BANK_BY_TARGET`)
 *     agrees with the measurement. It moves NO row. Its full rationale — the third stale
 *     twin, and why nothing short of the write can fence it — lives beside
 *     `BANK_FENCE_TARGET_SCHEMA`.
 *
 *   schema 20 -> 21 (RETIRED) the same tagged numeric reconciliation, and THE FIRST RUNG
 *     WHOSE SUBJECT IS A PRODUCT SURFACE rather than the instrument: the paid PDF's
 *     `relationships.network` position was mounted and starved, and lighting it put a list
 *     assembler under `src/components/new/` that reads three SAVE-TIME keys the generation
 *     corpus can never observe a writer for. It ADMITS THREE ROWS, all in that one new
 *     file, and it is the first rung to GROW the bank (60/39 -> 61/40) — the bank fence's
 *     first real exercise, since 20's own re-freeze moved nothing. Its full rationale lives
 *     beside `RELATIONSHIPS_MOUNT_TARGET_SCHEMA`.
 *
 *   schema 21 -> 22 (LIVE)   the same tagged numeric reconciliation, and THE FIRST RUNG THAT
 *     EXISTS TO UNDO AN ARRANGEMENT ITS PREDECESSOR BANKED. 21 admitted the assembler's rows
 *     where they happened to land — under `src/components/` — and the file's own header then
 *     wrote that location down as a law, on the true measurement that a domain reader would
 *     mint new identities. The owner ruled the other way (ODQ §934.16): a domain-side reader
 *     of the relationship keys is bought with a governed register migration, not refused by
 *     one. So the assembler moved to `src/domain/display/stateProse/`, ODQ §934.18 made the
 *     printed Relationships block derive its engagements instead of reading a key nothing
 *     writes, and this rung is what pays for both. It is a PURE SHRINK plus two address
 *     moves: no row is added to any file that did not already carry it, the identity
 *     `crossSettlementConflicts on settlement` leaves the register at zero addresses, and
 *     the BANK DOES NOT MOVE — which is the fence's second exercise and the first proving
 *     that a MOVE is not a growth. Its full rationale lives beside
 *     `DOMAIN_READER_TARGET_SCHEMA`.
 *
 * In every family, the predecessor baseline and scan artifacts are
 * canonical, content-addressed inputs sharing one committed source, execution
 * tree, executed corpus and scan configuration. The legacy detector is the
 * governed 6e7acc4d algorithm with one semantic-neutral addition:
 * `pos: node.name.getStart(sf)`. That lets the retired path pair by an exact
 * source address; text and nearest-line guesses are deliberately forbidden
 * because repeated reads make either ambiguous.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  parseExactFlags,
  planExternalArtifactOutputs,
  publishJsonExclusive,
} from './lib/governed-artifact-io.mjs';
import {
  canonicalJson,
  digestOf,
  LEGACY_ALGORITHM_BASE_SHA,
  LEGACY_ALGORITHM_BLOB_SHA,
  LEGACY_ALGORITHM_ENRICHMENT,
  validateScanArtifact,
} from './lib/observed-shape-governance.mjs';
import {
  RETIRED_BANKED_EXPLAINED_WRITER_BASELINE_SCHEMA,
  RETIRED_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA,
  RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA,
  validateSchema4Baseline,
  validateSchema5Baseline,
  validateSchema6Baseline,
  validateSchema7Baseline,
  validateSchema8Baseline,
  validateSchema9Baseline,
  validateSchema10Baseline,
  validateSchema14Baseline,
  validateSchema15Baseline,
  validateSchema16Baseline,
  validateSchema17Baseline,
  validateSchema18Baseline,
  validateSchema19Baseline,
  validateSchema20Baseline,
  validateSchema21Baseline,
} from './lib/observed-shape-baseline.mjs';

export const MIGRATION_REPORT_SCHEMA = 2;
export const MIGRATION_REVIEW_SCHEMA = 2;
export const MIGRATION_BUNDLE_SCHEMA = 2;

/** The RETIRED exact target. Named rather than hand-keyed so the two target
 *  schemas can never be confused at a call site, and so a reader grepping for
 *  "3" finds a definition instead of a literal. */
export const RETIRED_EXACT_TARGET_SCHEMA = 3;
/** The RETIRED UNFILTERED heuristic-leaf target. */
export const HEURISTIC_TARGET_SCHEMA = 4;
/** The RETIRED M6-and-M8/M9-only filtered heuristic-leaf target. */
export const FILTERED_TARGET_SCHEMA = 5;
/** The RETIRED surface-filtered heuristic-leaf target (M6 + M11 + M12 plus
 *  clear-outright M8/M9). */
export const SURFACE_FILTERED_TARGET_SCHEMA = 6;
/** The RETIRED bank-by-rule target. */
export const BANKED_EXPLAINED_WRITER_TARGET_SCHEMA = 7;
/** The RETIRED corpus-coverage target: schema 7's tagged topology inventory
 *  after the governed builder gains its opt-in scalar second consumer. */
export const CORPUS_COVERAGE_TARGET_SCHEMA = 8;
/** The RETIRED epoch-dark target: schema 8's tagged topology inventory
 *  re-governed to the landed post-EP-1 detector and unscanned inputs, with the
 *  explained-writer bank grown by the four declared eventLog identities. */
export const EPOCH_DARK_CORPUS_TARGET_SCHEMA = 9;
/** The LIVE target: schema 9's tagged topology inventory and its eight-identity
 *  bank, unchanged, re-governed to two regenerated subject-but-unscanned prose
 *  leaves and one added package.json lint-staged binding. An ENVELOPE
 *  RE-RECONCILIATION and nothing else — no declaration, no threshold, no
 *  filter, no bank growth. */
export const PROSE_REGEN_TARGET_SCHEMA = 10;
/** The LIVE target: schema 10's tagged topology inventory re-governed to a
 *  DETECTOR THAT GENUINELY CHANGED — which is what separates this rung from 9
 *  and 10, both of which were envelope re-reconciliations that declared nothing.
 *  TE-OSHAPE-1 repaired the provenance gate (per-path drift classification, so a
 *  regenerated artifact can no longer brick the shrink-only re-freeze) and gave
 *  the walker its fourth door. This mint binds that repair and grows the
 *  explained-writer bank by ONE: the ninth identity, `isCriminal on
 *  incomeSources`, under the new `conditional-generator-branch` mechanism
 *  (ODQ §771.2). Its unscanned movement is reviewable for the same reason 8→9's
 *  was, and the 8→9 header says it best: refusing it would leave the instrument
 *  permanently dark. */
export const TREASURY_ADMISSION_TARGET_SCHEMA = 11;
/** The LIVE target: schema 11's tagged topology inventory re-governed to a SUBJECT
 *  TREE THAT GREW A NEW READER, and this rung is a third kind again. 9 and 10 were
 *  envelope re-reconciliations that declared nothing; 11 bound a detector that
 *  genuinely changed. This one changes NO detector semantics whatever — its whole
 *  reason for existing is that the shrink-only `--write` cannot express INVENTORY
 *  GROWTH, and refuses it in those words ("growth or an identity swap cannot be
 *  re-frozen"). That refusal is the instrument working; a migration is the only
 *  thing that can express the other side of it.
 *
 *  WHAT GREW. The T5 GENESIS train landed `src/domain/instantWorld/genesisDiplomacy.js`
 *  (POLIS-2), the materializer that turns a plan's slot-addressed founding ties into
 *  neighbour links on the composed members. It reads three keys the GENERATION corpus
 *  never observes, and all three have real writers one lifecycle step out from
 *  generation:
 *    • `_slot on save`  — written at `composeInstantWorld.js:344` (`_slot: site.slot`)
 *    • `tier on save`   — written at `composeInstantWorld.js:329`
 *    • `neighbourNetwork on settlement` — the DECLARED M9 save-time identity, which
 *      this module now also writes at compose time; it is tagged BY RULE here, as its
 *      24 siblings already are.
 *  Chair ruling ODQ §819 admits all three. ⛔ NO mechanism is added and NO exemption
 *  is declared: bank-by-rule tags a row from the EXISTING declaration, so the bank's
 *  nine declared identities are untouched and only the tagged ROW COUNT moves. */
export const GENESIS_TIES_TARGET_SCHEMA = 12;
/** The LIVE target: schema 12's tagged topology inventory re-governed to a DEPENDENCY
 *  THAT LEFT — the first rung whose delta is driven by neither the detector nor the
 *  inventory. E-STRIP4-4 (chair order TE-MINT-1, ODQ §783.3/§788.2(d)/§821) drops
 *  `three@0.185.1`, a PRODUCTION dependency with zero importers under every module
 *  syntax; the portrait 3D view layer it once served is gone, and
 *  `tests/architecture/archViewWall.test.js` already asserts its total absence from
 *  shipped source while deferring the package.json byte to "STRIP-6's sweep". This is
 *  that sweep.
 *
 *  ⭐ WHY A RUNG AT ALL FOR A DEAD DEPENDENCY. `package.json` and `package-lock.json`
 *  are DELIBERATE governed detector inputs — check-observed-shape-readers.mjs says why
 *  in its own words, "a dependency bump can move the parser" — so the shrink-only
 *  `--write` refuses them by design and only a migration can bind the new bytes.
 *
 *  ⛔ AND THE RECONCILIATION MUST BE EMPTY, which is this rung's whole claim. Removing
 *  a package nothing imports cannot change what the scanner FINDS, so any moved row
 *  would mean the drop was not inert and the mint must STOP rather than bank it.
 *  Measured: predecessorSame 1413, new/decreased/gone/increased ALL ZERO. */
export const DEAD_DEPENDENCY_TARGET_SCHEMA = 13;

/** The schema-14 leaf target — THE WIDENED CLAUSE 4 (E-T2-7, lane T9).
 *
 *  ⭐ WHAT MOVED, AND WHY IT NEEDED A RUNG. Clause 4 of the virtual-dormant-writer
 *  door retires a row whose flag has stopped being dark. It read only a WINDOW of the
 *  flag manifest — the slice between the `DEFAULT_SIMULATION_RULES` and
 *  `ENGINE_GATED_VIRTUAL_RULE_KEYS` declarations — and the entire preset table sits
 *  beyond it: 41 of the manifest's 52 `<x>Enabled: true` lights are outside the window,
 *  11 inside. A preset override spread is how every virtual flag in this estate is
 *  actually lit, so the clause could not fire for the one path it was written to watch.
 *  It is now 4a (the defaults, byte-unchanged) plus 4b, which reads the WHOLE executed
 *  manifest, leaving no boundary to drift.
 *
 *  ⭐ WHY A RUNG FOR A CHANGE THAT CONVICTS NOTHING NEW TODAY. The widening lands in
 *  `check-observed-shape-readers.mjs`, a governed detector source, and the shrink-only
 *  `--write` refuses a moved detector BY DESIGN — frozen numbers taken under one
 *  detector do not mean the same thing under another even when they are numerically
 *  equal. That refusal is the instrument working, and a rung is the only lawful way
 *  past it.
 *
 *  ⛔ AND THE RECONCILIATION MUST BE EMPTY, which is this rung's whole claim. 4b
 *  convicts only a flag lit `true` OUTSIDE the defaults, and every flag carrying a
 *  dormant-writer row is dark in the live manifest — the clause is armed and silent.
 *  So any moved row would mean the widening was not inert and the mint must STOP
 *  rather than bank it. */
export const PRESET_LIGHT_TARGET_SCHEMA = 14;

/** The schema-15 leaf target — THE CHURN RULE GIVEN A STABLE-CORE GUARD (R-T8-OSR,
 *  chair ruling option C, lane T8).
 *
 *  ⭐ WHAT MOVED, AND WHY IT NEEDED A RUNG. The corpus builder collapses a node into
 *  an id-keyed map on three independent branches. Two of them quantify over EVERY
 *  key — `exactIdKeys` proves key ≡ value.id, and `allObject`/`allArray` require the
 *  whole node to be homogeneous — but the third, the CHURN branch, judged a node by a
 *  CORNER of it: two traversable keys seen on under 80 % of its instances were enough,
 *  whatever the rest of the node did. A fixed record carrying two optional ledgers was
 *  therefore classified as a map. The branch now states the guarantee its two siblings
 *  already had: a node at least `SCHEMA_PRESENCE` of whose keys are schema keys is a
 *  RECORD WITH OPTIONAL FIELDS, and no number of coming-and-going traversable fields
 *  can reclassify it. ONE constant governs the key-level reading and the node-level one
 *  so the two can never drift apart.
 *
 *  ⭐ WHY A RUNG FOR A CHANGE THAT IS PURE CLASSIFICATION. The cure lands in
 *  `scripts/lib/observed-shape-corpus.mjs`, a governed detector source, and the
 *  shrink-only `--write` refuses a moved detector BY DESIGN — frozen numbers taken
 *  under one detector do not mean the same thing under another even when they are
 *  numerically equal. That refusal is the instrument working, and a rung is the only
 *  lawful way past it.
 *
 *  ⛔ AND THE RECONCILIATION MUST BE EMPTY, which is this rung's whole claim. The cure
 *  is CLASSIFICATION-ONLY — it removes a mislabel and the `/dynamic` facet the mislabel
 *  minted — so the live inventory at the cured tip reproduces the schema-14 predecessor
 *  ROW FOR ROW. Measured in advance: 1,999 reads / 1,412 identities / 388 files,
 *  violations 0 and stale 0, which is the frozen register exactly. The mint must
 *  therefore report predecessorSame 1412 with new, gone, increased and decreased ALL
 *  ZERO; any moved row means the cure was not classification-only and the mint STOPS
 *  rather than banking it. */
export const STABLE_CORE_TARGET_SCHEMA = 15;

/* ⭐⭐ THE SCHEMA 15 → 16 RUNG — THE COMPANION-GATE MINT (ENC-3, ruled §893.4).
 *
 *  WHAT MOVED, AND IT IS THE DOOR'S VALIDATOR RATHER THAN THE DETECTOR. The
 *  virtual-dormant-writer door (M13) gained two corrections in one act:
 *    · CLAUSE 1 IS NOW SHAPE-SCOPED. It asked whether a file wrote the key ANYWHERE
 *      while the door's identities are `"<key> on <shape>"` — a shape it then ignored.
 *      MEASURED on a pure READER of a `grievance`: `fromSid` passed as `shorthand` off
 *      an argument list, `incidentType` as `property` off a re-emission onto another
 *      shape, and `toSid` not at all. So a row naming the reader as its writer passed
 *      for two of three keys on the strength of its own READ SITE. A door that convicts
 *      for the wrong reason is worse than one that refuses, because it blesses the next
 *      case silently.
 *    · CLAUSE 2 ACCEPTS A GATE IN A ROW-DECLARED COMPANION. It required the gate in the
 *      writer, assuming one file both writes the key and reads the flag. A better-built
 *      subsystem splits them: ENCOUNTERS has a PURE leaf that computes receipts and a
 *      STAGE that owns the ONE gate read. The old clause's only route was to spell the
 *      flag inside the pure leaf — degrading the product to satisfy the tool, and
 *      reddening that subsystem's own polarity census, which pins the gate at EXACTLY
 *      ONE site. Two instruments in tension means one has the narrower premise.
 *
 *  ⭐ THE ALPHABET DID NOT MOVE, AND THAT IS WHY THIS IS THE LIGHT FAMILY. The door is
 *  a POST-FILTER: it narrows the VERDICT, it does not change what the detector DETECTS.
 *  PROVED BY A PASSING ARM rather than by argument — the walker's inventory triple
 *  reproduces `reads`/`identities`/`files`/`bankedReads`/`taggedRows` against literals
 *  frozen under the PREVIOUS detector, and a detector with a different alphabet could
 *  not reproduce five predecessor figures. So the reconciliation is `predecessorRows`
 *  and the mint must report predecessorSame 1409 with new, gone, increased and decreased
 *  ALL ZERO; any moved row means the change was not verdict-only and the mint STOPS.
 *
 *  ⚠ THE DRIFT CAME FROM CLOSING A VALIDATOR HOLE, NOT FROM A NEW DETECTION — the
 *  distinction this rung exists to record. The detector source moved, so `--write`
 *  refuses BY DESIGN (executed, not inferred: it throws and leaves the baseline
 *  untouched); but nothing about which reads are FOUND has changed, only which
 *  explanations are ACCEPTED. */
export const COMPANION_GATE_TARGET_SCHEMA = 16;

/* ⭐⭐ THE SCHEMA 16 → 17 RUNG — THE STRESS-TOPOLOGY CORPUS MINT (lane OSR-SCHEMA17).
 *
 *  WHAT MOVED, AND IT IS THE CORPUS BUILDER RATHER THAN THE DOOR — the first rung since
 *  7 → 8 whose subject is `observed-shape-corpus.mjs`. `buildObservedCorpus` gained a
 *  STRESS-LOADED TOPOLOGY PASS: one config × the four seeds under `insurgency` + `famine`,
 *  pushed into `roots` and DELIBERATELY NOT into `generated`.
 *
 *  ⭐ WHY THE INSTRUMENT NEEDED IT. The reader-with-no-writer ratchet reports its
 *  CORPUS'S REACH, not the code's truth. `economicState.js:349` writes `isCriminal` onto
 *  an `incomeSources` row only inside `if (safetyProfile.blackMarketCapture > 10)`, and
 *  that capture is `baseShadowPercent + stressShadowBonus` with the bonus EXACTLY ZERO
 *  when no stress flag is set. The four unstressed configs could therefore never observe
 *  the key, and three shipped readers of a working lens were all reported dead. The same
 *  blindness hid `power/stressFactions.js`'s `modifiers`, `power/rulingStructure.js`'s
 *  `captureState`, and the whole `issues` shape written by `economy/foodBalance.js` under
 *  `if (stressNotes.length > 0)`.
 *
 *  ⛔ THIS RUNG MOVES ROWS AND MUST — the difference from 13, 14, 15 and 16, which were
 *  verdict-only and had to report a row delta of zero. Measured before the rung was cut,
 *  through the gate's own declared post-scan chain reproduced out of band (the gate
 *  refuses to scan a moved detector source, so there is no in-band way to look first):
 *
 *      identities 1409 → 1397 · findings 1993 → 1972 · files 388 → 386
 *      GONE 12 · NEW 0 · RAISED 0 · LOWERED 0
 *
 *  Five keys entering three shapes account for every cleared row with nothing left over.
 *  A row here can only vanish by its writer becoming OBSERVABLE: the pass adds roots and
 *  removes none, so no shape can lose rows and none can fall back under `MIN_ROWS`.
 *
 *  ⛔ THE ONE THING THAT WOULD FALSIFY THIS RUNG IS A SINGLE ADDED IDENTITY. Adding the
 *  same settlements to `generated` instead was measured to clear 33 rows and MINT 20, by
 *  re-rolling producer 2's pulse until thin shapes crossed `MIN_ROWS` into being
 *  judgeable. Topology without pulse is a pure shrink; topology WITH pulse is a new
 *  baseline wearing a shrink's clothes. */
export const STRESS_TOPOLOGY_TARGET_SCHEMA = 17;

/* ⭐⭐ THE SCHEMA 17 → 18 RUNG — THE LINEAGE RE-ANCHORING (lane OSR-SCHEMA18).
 *
 *  WHAT MOVED, AND IT IS NEITHER THE DETECTOR NOR THE CORPUS — the first rung whose
 *  subject is the RECEIPT'S OWN PROVENANCE. Every filter, every threshold, every declared
 *  bank entry and the whole executed corpus definition are byte-for-byte what schema 17
 *  governed. What changed is which commit the receipt can be reconstructed FROM.
 *
 *  ⭐ WHY THE INSTRUMENT NEEDED IT. `validateBaselineHistory` demands that
 *  `migrationReview.subjectSha` be a committed ancestor of HEAD and then rebuilds the
 *  receipt from that commit's tree. Schema 17's genesis was executed in lane
 *  OSR-SCHEMA17's own dock (subject `0742f8ff5`) and CHERRY-PICKED into the composed
 *  desk lineage as a different sha, so the subject commit is reachable as a git OBJECT
 *  but is an ancestor of nothing that carries the register. The validator runs BEFORE
 *  the scan, so the whole instrument — the ordinary gate, `--report` and every `--write`
 *  — returned 1 in zero seconds without reading one source file, and
 *  `base-state-capsule.mjs`, which shells out to it, could not regenerate either.
 *  ⛔ THE ONE CURE THAT IS NOT AVAILABLE IS EDITING `subjectSha`: the digests would not
 *  reconstruct from the substituted commit, so the receipt would stop being checkable
 *  and start being a claim. The governed migration path is the only door that does not
 *  consult history — it carries its own predecessor bytes inside the reviewed bundle —
 *  which is exactly why a rung, and only a rung, can re-anchor a register.
 *
 *  ⛔ THIS RUNG MOVES NO ROW AND MUST NOT — the difference from 17, which cleared twelve,
 *  and the same discipline 13, 14, 15 and 16 kept. Measured before the rung was cut, via
 *  `--scan-only --scan-mode=legacy-leaf`, which reaches a real scan because it never
 *  enters the gate branch that validates history:
 *
 *      identities 1397 → 1397 · findings 1972 → 1972 · files 386 → 386
 *      GONE 0 · NEW 0 · RAISED 0 · LOWERED 0
 *
 *  ⛔ THE FENCE IS THE ZERO ON ALL FOUR, not merely on `new`/`increased` as at rung 17.
 *  A shrink is lawful when the corpus's reach genuinely grew; here it did not grow, so a
 *  vanished row could only mean this rung's own bookkeeping changed a verdict — and a
 *  re-anchoring that moves a verdict is not a re-anchoring.
 *
 *  ⚠ ONE OBSERVATION KEY MOVES: `corpusMeta.simulationFlagsLit` 80 → 81. The register was
 *  frozen before SEAT-78 minted `irregularForceEnabled`, and the corpus lights every
 *  simulation flag it can see. `corpusCompatibilityOf` RECORDS the three observation keys
 *  and REFUSES only the four execution keys, all of which are measured unmoved. That one
 *  figure is also the whole of the writer-reach walker's declared debt against this
 *  register: two banked ratchet rows read `expected 81 to be 80` until this write. */
export const LINEAGE_REANCHOR_TARGET_SCHEMA = 18;

/* ⭐⭐ THE SCHEMA 18 → 19 RUNG — THE EXEMPTION RETIREMENT (owner order, 2026-09-17).
 *
 *  WHAT MOVED, AND IT IS THE DECLARED BANK'S MEMBERSHIP — the first rung since 11 to
 *  change the roster of `EXPLAINED_WRITER_EXEMPTIONS`, and the FIRST EVER to SHRINK it.
 *  11 grew the bank by one; this one retires one, and the direction matters because a
 *  retirement RESTORES enforcement rather than reducing it.
 *
 *  ⭐ WHY THE INSTRUMENT NEEDED IT, AND WHY NOTHING SMALLER WOULD DO. The owner ordered
 *  every lock control out of the dossier ("I approve and remove the other padlocks and
 *  fix the remaining contradictions as well") and `src/components/dossier/LockControls.jsx`
 *  was deleted with them. That file was the entire basis of the `factions on locks`
 *  exemption: it held the only `WORLD_LOCKS` declaration and the only `setLock` writer of
 *  the key. Gate 0 reads each entry's named writer from the scanned tree on EVERY scan, so
 *  the deletion did not leave a stale row — it raised "names a writer that cannot be read"
 *  and refused the whole instrument. Gate 0's own message names the remedy: *"the key
 *  genuinely lost its writer, in which case the reads are real findings again and the
 *  exemption must be DELETED, not repaired."*
 *  ⛔ AND DELETING IT IS EXACTLY WHAT THE SHRINK-ONLY `--write` CANNOT ABSORB. The entry's
 *  two committed row tags outlive the declaration by one act, and `assertExplainedWriterRowTags`
 *  — run against the PREDECESSOR baseline before any scan — classes a tagged inventory
 *  address with no declaration as a FORGED tag and throws. The register cannot drop the
 *  tags without a write, and no ordinary write can start while they are there. Only a rung
 *  breaks that circle, and `check-observed-shape-readers.mjs` says so in its own words:
 *  "A declaration membership or ruling change alters tag authenticity and requires a
 *  governed instrument migration; it is not ordinary maintenance."
 *
 *  ⛔ THIS RUNG MOVES ROWS AND MUST — like 17, and unlike 13 through 16 and 18. But the
 *  cause is the opposite of 17's and that distinction is the fence. 17 moved rows because
 *  the INSTRUMENT's reach grew; this one moves them because the ESTATE shrank, and the
 *  instrument's reach is byte-for-byte what schema 18 governed. Measured before the rung
 *  was cut, via `--scan-only --scan-mode=legacy-leaf` at the committed retirement:
 *
 *      identities 1397 → 1392 · findings 1972 → 1966 · files 386 → 386
 *      GONE 5 · DECREASED 1 · NEW 0 · RAISED 0
 *
 *  The six are all on the `locks` shape and all in two files: `factions`, `geography`,
 *  `history` and `identity on locks` GONE from `src/domain/locksPreservation.js`,
 *  `npcs on locks` LOWERED there 3 → 2, and `factions on locks` GONE from
 *  `src/domain/worldPulse/coup.js`. Every one is a read that left the estate with the lock
 *  controls.
 *  ⛔ THE FENCE IS THE ZERO ON NEW AND INCREASED. A deletion cannot mint a reader, so a
 *  single added row would mean this rung's own bookkeeping changed a verdict — and a
 *  retirement that convicts something new is not a retirement. `files` holding at 386 is
 *  the other half: neither file lost all of its rows, so no file may leave the register.
 *
 *  ⚠ THE BANK'S FIGURES MOVE WITH THE ROSTER, AND BOTH HALVES ARE RECORDED: the declared
 *  roster goes 9 → 8, and the banked reads go 62 → 60 across 41 → 39 tagged addresses.
 *  The two banked rows are the same two `factions on locks` addresses that this rung's
 *  reconciliation reports GONE — they stopped being banked and stopped existing in the
 *  same act, which is why no tagged row survives undeclared.
 *
 *  Its delta is THREE instrument paths, the bookkeeping set every rung moves. MEASURED,
 *  NEVER LISTED: each of the ELEVEN governed detector inputs was hashed against the
 *  PREDECESSOR'S OWN RECORDED MANIFEST before a byte of this rung was written, and exactly
 *  ONE came back moved — `check-observed-shape-readers.mjs`, carrying the committed
 *  retirement itself — with `package.json` and `package-lock.json` measured byte-SAME
 *  rather than assumed, because any `package.json` byte is itself a mint trigger. The set
 *  was re-measured after it was written, because writing it changes
 *  `migrate-observed-shape-readers.mjs`, which is itself a member. See
 *  `EXEMPTION_RETIREMENT_SCANNER_DELTA_PATHS`. */
export const EXEMPTION_RETIREMENT_TARGET_SCHEMA = 19;

/* ⭐⭐ THE SCHEMA 19 → 20 RUNG — THE BANK FENCE (2026-09-18).
 *
 *  WHAT MOVED, AND IT IS THE WRITE — the first rung whose subject is neither the detector
 *  (11, 13–16), the corpus (17), the receipt (18) nor the declared roster (9, 11, 19) but
 *  the act that lands a register: `check-observed-shape-readers.mjs --write`, in every
 *  mode, now REFUSES to freeze a bank the walker's hand-owned literal does not already
 *  state, and a `--migrate-schema` write additionally refuses unless the rung's own
 *  declared post-bank agrees. See `assertBankTwins` there and `DECLARED_BANK_BY_TARGET`
 *  below.
 *
 *  ⭐ WHY THE INSTRUMENT NEEDED IT. The walker keeps the register's bank as a LITERAL by
 *  ruling — a derived re-freeze may never RAISE the bank, so a hand-written figure is the
 *  right instrument and a red on it is the governed event announcing itself. That literal
 *  went stale at the very rung before this one: `fe021a487` re-froze the register at
 *  schema 19 and took the bank 62/41 → 60/39, touching exactly ONE file, and the walker's
 *  twin stayed at 62/41 — RED AT THE TIP ITSELF, before any later lane's first car, until
 *  three lanes had independently reproduced it against a pristine archive (`1637f85d1`).
 *  It was the THIRD stale twin in that file's history (TE-INSTR-1; the WAR landing
 *  `18df1bb3d`), and the first two were cured by reading the triple from the register — a
 *  cure the bank cannot take without becoming a self-comparison. The structural cause is
 *  that the figure's three homes — the rung's docblock (prose), the walker's literal (a
 *  test file) and the register (a tool's output) — had no edge between them. This rung
 *  draws the edges: the docblock's figure becomes DATA the write checks, and the literal
 *  becomes a MODULE the write reads. Both are still hand-written; neither is derived.
 *
 *  ⛔ NOTHING SHORT OF THE WRITE FIRES AT THE MOMENT OF THE ACT. A pre-commit hook was
 *  weighed and refused with evidence: husky's shim resolves `.husky/pre-commit` from the
 *  MAIN checkout for every worktree (`$(dirname "$(dirname "$0")")/$n`), so a hook fence
 *  would be governed by whichever branch the main checkout happens to be on. A test-time
 *  assertion fires at the next tip, which is the failure this rung exists to prevent. And
 *  the write is a detector source, so the fence costs exactly this rung — a no-row rung of
 *  rung 18's shape.
 *
 *  ⛔ THIS RUNG MOVES NO ROW, AND THAT IS ITS FENCE. Like 13–16 and 18, and unlike 17 and
 *  19, its reconciliation must be EMPTY — `predecessorGone`, `predecessorNew`,
 *  `predecessorIncreased` and `predecessorDecreased` all 0 — and the bank it declares below
 *  is the bank schema 19 froze, so `inventory` and `rowTags` come out byte-identical. The
 *  write proves that itself: this rung's re-freeze is the fence's first live exercise.
 *
 *  Its delta is THREE instrument paths, the bookkeeping set every verdict-only rung moves:
 *  the checker (the fence, its live-validator binding, its `_doc` and schema index), the
 *  baseline library (the 19 → 20 bump, the retired-19 constant and its re-bound validator)
 *  and this rung. MEASURED against the predecessor's own recorded manifest and re-measured
 *  after the set was written, because writing it changes this file, which is itself a
 *  member. See `BANK_FENCE_SCANNER_DELTA_PATHS`. */
export const BANK_FENCE_TARGET_SCHEMA = 20;

/**
 * ⭐⭐ THE DECLARED POST-BANK — what a rung's docblock used to say in a sentence, as data
 * the write can refuse against. From 19 onward every rung states the bank its re-freeze
 * must land: banked reads across tagged addresses. `check-observed-shape-readers.mjs`
 * refuses a `--migrate-schema` write whose freshly derived bank disagrees with the live
 * target's entry, so a figure PREDICTED FROM THE DELTA rather than measured stops the mint
 * instead of landing as a stale sentence.
 *
 * ⚠ ONLY MEASURED FIGURES ENTER. 19's pair is read off the register `fe021a487` froze
 * (60 banked reads across 39 tagged addresses, over seven of eight declared identities);
 * 20 moves no row and declares the same. Rungs before 19 recorded no data figure and none
 * is transcribed from their prose here — a backfilled number nobody measured would be the
 * stale-numeral class this table exists to refuse. A rung that moves the bank adds its own
 * entry; a rung that does not carries its predecessor's figure forward BY HAND, so the
 * declaration is always a statement and never a default.
 */
/* ⭐⭐ THE SCHEMA 20 → 21 RUNG — THE RELATIONSHIPS MOUNT (ODQ §934.9, 2026-09-18).
 *
 *  WHAT MOVED, AND IT IS THE ESTATE RATHER THAN THE INSTRUMENT. The owner's "do these as
 *  well" ordered the paid PDF's `relationships.network` position lit. It had been MOUNTED
 *  AND STARVED: `printProse.js` put the position, the chapter rendered it, and the two
 *  lists the DS-REL-1 desk draws from were assembled inside `RelationshipsTab.jsx`, where
 *  a headless builder cannot reach them. The cure is the one the builder's own seam note
 *  prescribed — `src/components/new/relationshipsDeskRead.js`, holding that merge, called
 *  by the tab AND by the builder. That assembler reads `neighbourNetwork`,
 *  `interSettlementRelationships` and `crossSettlementConflicts`.
 *
 *  ⛔ AND THE SCAN IS RIGHT ABOUT ALL THREE. Every one is written when a world is SAVED,
 *  LINKED or IMPORTED — `src/lib/saves.js`, the neighbour back-link, the link / undo /
 *  import paths — and never by the generation pipeline this instrument executes, so no
 *  corpus world carries one and every reader of them is convicted. The reads are real and
 *  the position they light is real; what the register owes them is ADMISSION, not a
 *  silenced detector. THREE NEW ROWS, one read each, all in that one file; nothing moves
 *  anywhere else, and no filter, door, mechanism or declaration is touched.
 *
 *  ⭐ THE BANK GROWS, AND THAT IS THE FENCE'S FIRST REAL EXERCISE. `neighbourNetwork on
 *  settlement` is a DECLARED identity, so `rowTagsOf` tags its new address exactly as it
 *  tags all 25 of its siblings — there is no choice in it, and `assertExplainedWriterRowTags`
 *  throws on a declared address that lacks its tag. The bank therefore goes 60 -> 61 banked
 *  reads across 39 -> 40 tagged addresses, the first growth since `assertBankTwins` existed,
 *  and the write refuses unless BOTH hand-owned twins already say so: the literal module and
 *  `DECLARED_BANK_BY_TARGET[21]` below. Rung 20 declared the same pair as 19 and proved
 *  nothing about a MOVE; this one does.
 *
 *  ⛔ THE OTHER TWO STAY ORDINARY ROWS, AND THE ALTERNATIVE IS REFUSED ON EVIDENCE rather
 *  than on taste. Declaring them would make them M8/M9 bank entries — and:
 *    • `crossSettlementConflicts on settlement` CANNOT BE DECLARED AT ALL. Gate 0 re-proves
 *      on every scan that a declaration's named writer still writes the key in one of the
 *      four measured write shapes, and NOTHING in `src/` writes this key: the deterministic
 *      generator that mints those rows writes them into `interSettlementRelationships`
 *      (`domain/relationships/neighbourBackLink.js:144,149`), and
 *      `tests/lint/writerReach.walker.test.js` already lists the key in its own `unwritten`
 *      roster. An entry naming any writer would be a false one, and gate 0 would refuse it.
 *    • `interSettlementRelationships on settlement` COULD be declared — it has real
 *      save-time writers — but the roster is keyed by IDENTITY, not by address, so adding
 *      it would auto-tag the SEVEN ordinary rows the estate has carried for it since schema
 *      4 and move them into the enforced bank. That is a change of enforcement posture over
 *      rows this rung did not cause, and it is not a lane's to make on the way to mounting a
 *      paragraph. An ordinary row here matches what those seven siblings already are.
 *
 *  Its delta is THREE instrument paths, the bookkeeping set every rung moves: the checker
 *  (the live-validator binding, its `_doc` and its schema index), the baseline library (the
 *  20 -> 21 bump, the retired-20 constant and its re-bound validator) and this rung.
 *  MEASURED against the predecessor's own recorded manifest and re-measured after the set
 *  was written, because writing it changes this file, which is itself a member. See
 *  `RELATIONSHIPS_MOUNT_SCANNER_DELTA_PATHS`.
 *
 *  ⚠ THE SUBJECT COMMIT IS RATCHET-RED BY CONSTRUCTION, for one commit, and that is the
 *  recorded CR-OSR-FREEZE-4 pair: the register may only move from a CLEAN COMMITTED tree, so
 *  the reader lands first and this rung's re-freeze lands after it. */
export const RELATIONSHIPS_MOUNT_TARGET_SCHEMA = 21;

/* ⭐⭐ THE SCHEMA 21 → 22 RUNG — THE DOMAIN READER (ODQ §934.16 + §934.18, 2026-09-19).
 *
 *  WHAT MOVED, AND IT IS AN ARRANGEMENT RATHER THAN A READING. Rung 21 admitted three rows
 *  for DS-REL-1's list assembler at `src/components/new/relationshipsDeskRead.js`. Nothing
 *  about those reads was wrong. What was wrong was WHERE THEY LIVED: `printProse.js` is a
 *  `src/domain` module and it imported that assembler, so the paid export path carried a
 *  domain → components layer inversion, and the assembler's own header wrote the
 *  arrangement down as a law ("⛔ WHY IT LIVES UNDER src/components AND MAY NOT MOVE TO
 *  src/domain") on the true measurement that a domain reader mints new identities. THE
 *  REGISTER WAS HOLDING THE INVERSION IN PLACE. The owner ruled the other way:
 *
 *      "If a future car wants a domain-side reader of the relationship keys, it is a
 *       governed register migration."
 *
 *  This is that migration. The assembler is now
 *  `src/domain/display/stateProse/relationshipsDeskRead.js`; the component file is deleted
 *  and all three importers re-pointed.
 *
 *  ⭐ AND THE SECOND HALF IS A DEFECT THE FIRST HALF UNCOVERED (ODQ §934.18).
 *  `pdf/lib/viewModel.js` fed the printed "Cross-settlement conflicts" block from the
 *  PERSISTED `settlement.crossSettlementConflicts`. NO WRITER IN `src/` PRODUCES THAT KEY —
 *  the deterministic generator that mints those rows writes them into
 *  `interSettlementRelationships` (`domain/relationships/neighbourBackLink.js:144,149`), and
 *  `tests/lint/writerReach.walker.test.js` carries it in its own `unwritten` roster. So on
 *  every LINKED world the screen drew the derived engagements and the paid document drew
 *  nothing, while a record carrying the pre-merge fossil printed rows the screen had stopped
 *  drawing. Both surfaces now derive from the one assembler, and that read is gone.
 *
 *  ⛔ THE RECONCILIATION IS A SHRINK AND TWO ADDRESS MOVES, AND NOT ONE ADDED ROW.
 *    • `neighbourNetwork on settlement` and `interSettlementRelationships on settlement`
 *      leave `src/components/new/relationshipsDeskRead.js` and appear at the domain path,
 *      one read each, same spelling, same identities.
 *    • `crossSettlementConflicts on settlement` is DELETED TWICE — at the component
 *      assembler, which no longer merges the key, and at `src/pdf/lib/viewModel.js`. It
 *      therefore reaches ZERO addresses and LEAVES THE REGISTER ENTIRELY. That is the
 *      strongest outcome this ratchet has: the reader-with-no-writer class it named is now
 *      unreachable rather than banked.
 *  `predecessorNew` and `predecessorIncreased` must be 0 at the domain path's own identities
 *  only in the sense that no identity is new to the ESTATE; the two moved rows are new to
 *  their FILE, which is exactly what a governed rung exists to admit and what the ordinary
 *  shrink-only write refuses.
 *
 *  ⛔ THE ROSTER DOES NOT MOVE, AND THE ALTERNATIVE IS REFUSED ON THE PRECEDENT rather than
 *  on taste. `interSettlementRelationships on settlement` COULD be declared — unlike its
 *  sibling it has a real in-src property writer — but the roster is keyed by IDENTITY, not
 *  by address, so declaring it would auto-tag the SEVEN ordinary rows the estate has carried
 *  since schema 4 and move them into the enforced bank. Rung 21 refused exactly that as "a
 *  change of enforcement posture over rows this rung did not cause", and the refusal STANDS:
 *  the moved row is ORDINARY, like its siblings. `crossSettlementConflicts on settlement`
 *  could never have been declared at all, and now needs no answer — gate 0 refuses an entry
 *  whose named writer does not write, and the identity no longer exists.
 *
 *  ⭐ THE BANK DOES NOT MOVE, AND THAT IS THE FENCE'S SECOND EXERCISE. 21 proved the fence
 *  catches a GROWTH; this proves it does not mistake a MOVE for one. `neighbourNetwork on
 *  settlement` changes address and not count, so the pair stays 61 banked reads across 40
 *  tagged addresses and `tests/lint/observedShapeBank.literal.js` stands still. A rung that
 *  had guessed at "one address left, one arrived, therefore +0" without measuring would have
 *  been right by luck; `declaredBankOf(22)` below is MEASURED off the live scan.
 *
 *  Its delta is THREE instrument paths, the bookkeeping set every rung moves: the checker
 *  (the live-validator binding, its `_doc` and its schema index), the baseline library (the
 *  21 -> 22 bump, the retired-21 constant and its re-bound validator) and this rung. The
 *  moved reader and the view model are SUBJECT files — scanned, not scanning — so they are
 *  deliberately NOT in it; they move `sourceTreeDigest` and `scanTreeDigest`, which the
 *  transition records on its own.
 *
 *  ⚠ THE SUBJECT COMMIT IS RATCHET-RED BY CONSTRUCTION, for one commit, and that is the
 *  recorded CR-OSR-FREEZE-4 pair: the register may only move from a CLEAN COMMITTED tree, so
 *  the reader lands first and this rung's re-freeze lands after it. */
export const DOMAIN_READER_TARGET_SCHEMA = 22;

export const DECLARED_BANK_BY_TARGET = Object.freeze({
  [EXEMPTION_RETIREMENT_TARGET_SCHEMA]: Object.freeze({ bankedReads: 60, taggedRows: 39 }),
  [BANK_FENCE_TARGET_SCHEMA]: Object.freeze({ bankedReads: 60, taggedRows: 39 }),
  // MEASURED, never predicted from the delta: `bankOf` over the committed schema-20
  // register derives 60/39, and the one new address this rung admits is a DECLARED
  // identity, so the post-move pair is 61/40 with `neighbourNetwork on settlement` at
  // 39 reads across 26 addresses. The write refuses if the measurement disagrees.
  [RELATIONSHIPS_MOUNT_TARGET_SCHEMA]: Object.freeze({ bankedReads: 61, taggedRows: 40 }),
  // MEASURED off the live scan at the subject commit, never inferred from the delta: the one
  // declared-identity row this rung touches CHANGES ADDRESS and not count, so the pair does
  // not move. `bankOf` over the committed schema-21 register derives 61/40, the live scan at
  // the subject derives 61/40, and the literal module already states it.
  [DOMAIN_READER_TARGET_SCHEMA]: Object.freeze({ bankedReads: 61, taggedRows: 40 }),
});

/** The declared post-bank of a target, or `null` for a rung that predates the law. */
export function declaredBankOf(targetSchema) {
  return DECLARED_BANK_BY_TARGET[targetSchema] ?? null;
}

/**
 * The complete, reviewed detector transition admitted by the retired 6→7 mint.
 *
 * `package.json` is inherited from GTR-1; the other three paths are H26's own
 * scanner implementation. Keeping the set as exported data makes the packet's
 * provenance ruling executable and gives the review ledger one closed subject
 * to accept. A fifth path, or one of these four remaining byte-identical, is a
 * different migration and therefore fails closed.
 */
export const BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS = Object.freeze([
  'package.json',
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/** The exact scanner inputs changed by the schema 7→8 corpus-coverage mint. */
export const CORPUS_COVERAGE_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/lib/observed-shape-corpus.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The exact scanner inputs changed by the schema 8→9 epoch-dark mint — FIVE,
 * not four, and that is why the retained-count law below had to stop being a
 * hard-coded seven. `package.json` moved on its own (two added npm scripts, the
 * lockfile untouched) and `observed-shape-corpus.mjs` moved for EP-1, both
 * BEFORE this mint was cut; the three instrument files are the mint's own.
 */
export const EPOCH_DARK_CORPUS_SCANNER_DELTA_PATHS = Object.freeze([
  'package.json',
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/lib/observed-shape-corpus.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The exact scanner inputs changed by the schema 9→10 prose-regen mint — FOUR.
 * `package.json` moved on its own before this mint was cut (one added
 * lint-staged binding, the lockfile untouched); the three instrument files are
 * the mint's own schema rung. `observed-shape-corpus.mjs` is NOT here: this mint
 * changes no corpus decision, which is why the inventory is expected to
 * reconcile all-same.
 *
 * ⚠ DELIBERATELY ITS OWN CONSTANT even though the schema 6→7 delta happens to
 * name the same four paths today. These are two different recorded transitions,
 * and aliasing them would let an edit made for one silently redefine the other's
 * governed provenance. Each target owns its own closed subject to accept.
 */
export const PROSE_REGEN_SCANNER_DELTA_PATHS = Object.freeze([
  'package.json',
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The schema-10 → 11 detector delta, and every path is this lane's own work:
 *   • check-observed-shape-readers.mjs — TE-OSHAPE-1's drift classifier + fourth
 *     door, and the ninth explained-writer declaration;
 *   • observed-shape-baseline.mjs — the schema bump and the retired-10 validator;
 *   • migrate-observed-shape-readers.mjs — this rung;
 *   • tests/fixtures/spatialPackFixtures.js — the corpus FIXTURE, which had
 *     already drifted before this lane began (1 of 11 stale at the pristine base)
 *     and is exactly the input whose refusal darkened the instrument. It is
 *     carried here as a DELTA rather than waved through, because the ritual's
 *     law is that modified paths equal the declared set exactly.
 * ⛔ `package.json` and the lockfile are NOT in this set and must not be: this
 * lane changed no dependency and no script.
 */
export const TREASURY_ADMISSION_SCANNER_DELTA_PATHS = Object.freeze([
  // ⚠ THE FIFTH PATH IS NOT THIS LANE'S WORK, AND IT IS DECLARED RATHER THAN RECLASSIFIED.
  // The strip-finish train removed the dead `gen:atlas-samples` script, so `package.json`
  // differs from the schema-10 predecessor at the tree this rung is minted against. No
  // parser moved and the temptation to call it an input is real — but package.json sits on
  // the DETECTOR side by explicit estate law (any package.json byte is a mint trigger) and
  // by this instrument's own classifier, so the lawful response is to name it in the
  // governed delta and let the review accept it, never to widen the classifier the first
  // time it inconveniences its author. The 8→9 rung did exactly this for two ADDED scripts,
  // which is the precedent this row follows.
  'package.json',
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
  'tests/fixtures/spatialPackFixtures.js',
]);

/**
 * The schema-11 → 12 detector delta — THREE paths, and every one of them is the schema
 * rung itself rather than a change of detector semantics:
 *   • observed-shape-baseline.mjs — the bump and the retired-11 validator;
 *   • migrate-observed-shape-readers.mjs — this rung;
 *   • check-observed-shape-readers.mjs — the LIVE-VALIDATOR BINDING and nothing else.
 *     `runtime.validateBaseline` names the live validator BY NAME, so a rung that renames
 *     it (each one does, so the retired validators keep their own numbers) necessarily
 *     moves this file too. It is three identical `validateSchema11Baseline` →
 *     `validateSchema12Baseline` token replacements: the import, the row-tag assertion's
 *     envelope check, and the runtime binding. No filter, no door, no declaration.
 *
 * ⚠ THE FIRST DRAFT OF THIS CONSTANT DECLARED TWO PATHS AND WAS WRONG, which is recorded
 * because the instrument is what caught it rather than review: dropping the checker made
 * `run()` validate a schema-12 baseline with the schema-11 validator and six sentinel arms
 * reddened with "baseline is not schema 11". `governedScannerTransitionOf` would then have
 * refused the mint anyway — modified paths must EQUAL the declared set — so the delta and
 * the code cannot silently disagree in either direction.
 *
 * ⛔ `package.json` and the lockfile are NOT in this set and must not be. The 10→11 rung
 * had to declare package.json because the strip-finish train had moved it; nothing has
 * moved it since, this lane changed no dependency and no script, and any package.json
 * byte is a mint trigger under estate law.
 */
export const GENESIS_TIES_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The schema-12 → 13 detector delta — FIVE paths, in two groups that must not be
 * confused with one another:
 *   • package.json + package-lock.json — THE SUBJECT OF THIS RUNG. `three@0.185.1`
 *     and its single lock record leave; the diff is 8 deletions and ZERO insertions,
 *     with no registry-metadata churn. These two sit on the DETECTOR side by explicit
 *     estate law (any package.json byte is a mint trigger) and by this instrument's own
 *     classifier, so the lawful response is to name them in the governed delta and let
 *     the review accept them — the 8→9 and 10→11 rungs each did exactly this.
 *   • the three instrument files — the bump and retired-12 validator, this rung, and
 *     the checker's live-validator binding. Bookkeeping, carried for the same reason
 *     the 11→12 rung carried them, and no detector semantics move.
 *
 * ⛔ NOTHING ELSE MOVED, and that is verified rather than assumed: a recorded-vs-computed
 * sweep over all eleven governed inputs at the schema-12 freeze reported exactly these
 * two package files MOVED and the other nine SAME — including
 * `tests/fixtures/spatialPackFixtures.js`, whose owed digest (§783.3) the schema-12
 * freeze had already absorbed.
 */
export const DEAD_DEPENDENCY_SCANNER_DELTA_PATHS = Object.freeze([
  'package-lock.json',
  'package.json',
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The schema-13 → 14 delta: THREE instrument paths and nothing else.
 *
 * The subject of this rung IS one of the instrument files, which is what makes its
 * delta smaller than every rung since 10: there is no separate subject to declare.
 *   - `check-observed-shape-readers.mjs` — clause 4b itself, plus the live-validator
 *     binding moving from `validateSchema13Baseline` to `validateSchema14Baseline`;
 *   - `observed-shape-baseline.mjs` — the 13 → 14 bump, the retired-13 constant and
 *     its re-bound validator;
 *   - `migrate-observed-shape-readers.mjs` — this rung.
 *
 * ⛔ NO package file is in this delta and none may be: lane T9 changed no dependency
 * and no script, and any `package.json` byte is itself a mint trigger.
 */
export const PRESET_LIGHT_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The schema-14 → 15 delta: FOUR paths, every one of them an instrument file.
 *   - `observed-shape-corpus.mjs` — THE SUBJECT: the churn rule's stable-core guard;
 *   - `check-observed-shape-readers.mjs` — the live-validator binding moving from
 *     `validateSchema14Baseline` to `validateSchema15Baseline`;
 *   - `observed-shape-baseline.mjs` — the 14 → 15 bump, the retired-14 constant and
 *     its re-bound validator;
 *   - `migrate-observed-shape-readers.mjs` — this rung.
 *
 * ⭐ THE SUBJECT IS ITSELF A DETECTOR SOURCE, as it was at the 7→8 corpus-coverage
 * rung — the only other rung whose subject was this same file — so the set is four
 * instrument paths rather than a subject plus its bookkeeping.
 *
 * ⛔ NO package file is in this delta and none may be, and here that is MEASURED
 * rather than asserted: a recorded-vs-computed sweep of all eleven governed inputs
 * against the schema-14 freeze reported `package.json` and `package-lock.json`
 * byte-SAME, with `observed-shape-corpus.mjs` the ONLY moved entry before this rung
 * was written. Any `package.json` byte is itself a mint trigger, so an extra path
 * here — or one of these four remaining byte-identical — is a different migration and
 * fails closed.
 */
export const STABLE_CORE_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/lib/observed-shape-corpus.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The schema-15 → 16 delta: THREE instrument paths and nothing else.
 *
 * ⛔ MEASURED, NEVER LISTED (chair condition, §893.4). The set below was derived by
 * observing what minting this rung actually changed — `git diff --name-only` over the
 * eleven governed inputs at the minted tip — and then re-measured after the set was
 * written, because writing it changes `migrate-observed-shape-readers.mjs`, which is
 * itself a member. The declared set is therefore a FIXED POINT of its own measurement.
 * A mis-declared delta set is how rung 10 → 11 became permanently unmigratable.
 *
 * The subject of this rung IS one of the instrument files, as at 13 → 14, which is what
 * makes its delta three rather than a subject plus its bookkeeping:
 *   - `check-observed-shape-readers.mjs` — THE SUBJECT: the door's shape-scoped clause 1,
 *     its companion-gate clause 2 and the three ENCOUNTERS rows, plus the live-validator
 *     binding moving from `validateSchema15Baseline` to `validateSchema16Baseline`;
 *   - `observed-shape-baseline.mjs` — the 15 → 16 bump, the retired-15 constant and its
 *     re-bound validator;
 *   - `migrate-observed-shape-readers.mjs` — this rung.
 *
 * ⛔ NO package file is in this delta and none may be: this rung changes no dependency
 * and no script, and any `package.json` byte is itself a mint trigger. An extra path
 * here — or one of these three remaining byte-identical — is a different migration and
 * fails closed.
 */
export const COMPANION_GATE_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The schema-16 → 17 delta: FOUR paths — a SUBJECT plus the three bookkeeping files.
 *
 * ⛔ MEASURED, NEVER LISTED. Derived by hashing each of the ELEVEN governed detector
 * inputs against the PREDECESSOR'S OWN RECORDED MANIFEST — not against HEAD, and not by
 * reasoning about which files this lane touched. At the corpus car the measurement named
 * exactly one moved path (`observed-shape-corpus.mjs`); the other three are this rung's
 * own bookkeeping and were re-measured after the set was written, because writing it
 * changes `migrate-observed-shape-readers.mjs`, which is itself a member. The declared
 * set is a FIXED POINT of its own measurement. A mis-declared delta set is how rung
 * 10 → 11 became permanently unmigratable.
 *
 *   - `observed-shape-corpus.mjs` — THE SUBJECT: the stress-loaded topology pass;
 *   - `check-observed-shape-readers.mjs` — the live-validator binding moving from
 *     `validateSchema16Baseline` to `validateSchema17Baseline`;
 *   - `observed-shape-baseline.mjs` — the 16 → 17 bump, the retired-16 constant and its
 *     re-bound validator;
 *   - `migrate-observed-shape-readers.mjs` — this rung.
 *
 * ⛔ NO package file is in this delta and none may be: this rung changes no dependency
 * and no script, and any `package.json` byte is itself a mint trigger. An extra path
 * here — or one of these four remaining byte-identical — is a different migration and
 * fails closed. This is the FIRST four-path delta since 14 → 15, and it is four rather
 * than three because the subject is a detector input that is NOT one of the three files
 * every rung already moves.
 */
export const STRESS_TOPOLOGY_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/lib/observed-shape-corpus.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The schema-17 → 18 delta: THREE paths — the bookkeeping set and nothing else.
 *
 * ⛔ MEASURED, NEVER LISTED, and this rung's measurement has an unusually clean shape.
 * Each of the ELEVEN governed detector inputs was hashed against the PREDECESSOR'S OWN
 * RECORDED MANIFEST at the composed tip BEFORE a byte of this rung was written, and ALL
 * ELEVEN came back byte-identical — including `package.json` and `package-lock.json`,
 * measured rather than asserted, because any `package.json` byte is itself a mint
 * trigger. The delta is therefore exactly the set this rung goes on to touch, and it was
 * re-measured after the set was written, because writing it changes
 * `migrate-observed-shape-readers.mjs`, which is itself a member. The declared set is a
 * FIXED POINT of its own measurement. A mis-declared delta set is how rung 10 → 11 became
 * permanently unmigratable.
 *
 *   - `check-observed-shape-readers.mjs` — the live-validator binding moving from
 *     `validateSchema17Baseline` to `validateSchema18Baseline`, and the register's `_doc`
 *     header, which had described SCHEMA 10 and an eight-identity bank through eight
 *     rungs of drift;
 *   - `observed-shape-baseline.mjs` — the 17 → 18 bump, the retired-17 constant and its
 *     re-bound validator;
 *   - `migrate-observed-shape-readers.mjs` — this rung.
 *
 * ⛔ THREE RATHER THAN FOUR, and the missing one is the point: 16 → 17 carried a fourth
 * path because its SUBJECT was `observed-shape-corpus.mjs`, a detector input outside the
 * bookkeeping set. This rung's subject is not a file at all — it is the receipt's
 * provenance — so it moves nothing beyond the three files every verdict-only rung moves.
 * An extra path here, or one of these three remaining byte-identical, is a different
 * migration and fails closed.
 */
export const LINEAGE_REANCHOR_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The schema-18 → 19 delta: THREE paths — the bookkeeping set and nothing else.
 *
 * ⛔ MEASURED, NEVER LISTED. Each of the ELEVEN governed detector inputs was hashed
 * against the PREDECESSOR'S OWN RECORDED MANIFEST at the committed retirement BEFORE a
 * byte of this rung was written. Exactly one came back MOVED —
 * `check-observed-shape-readers.mjs`, which carries the retirement itself — and the other
 * ten byte-identical, `package.json` and `package-lock.json` among them, measured rather
 * than asserted because any `package.json` byte is itself a mint trigger. The other two
 * paths below are this rung's own bookkeeping, and the set was re-measured after it was
 * written, because writing it changes `migrate-observed-shape-readers.mjs`, which is
 * itself a member. The declared set is a FIXED POINT of its own measurement. A
 * mis-declared delta set is how rung 10 → 11 became permanently unmigratable.
 *
 *   - `check-observed-shape-readers.mjs` — THE SUBJECT: the retired entry itself, the
 *     re-triage docblock that now records both of the row's moves, the register's `_doc`
 *     header, and the live-validator binding moving from `validateSchema18Baseline` to
 *     `validateSchema19Baseline`;
 *   - `observed-shape-baseline.mjs` — the 18 → 19 bump, the retired-18 constant and its
 *     re-bound validator;
 *   - `migrate-observed-shape-readers.mjs` — this rung.
 *
 * ⛔ THREE RATHER THAN FOUR, for the same reason 15 → 16 and 17 → 18 were three: the
 * subject is one of the bookkeeping files. An extra path here, or one of these three
 * remaining byte-identical, is a different migration and fails closed.
 */
export const EXEMPTION_RETIREMENT_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The 19 → 20 delta — the bookkeeping set, THREE paths:
 *   - `check-observed-shape-readers.mjs` — the bank fence (`bankOf`, `assertBankTwins`,
 *     the write reading the literal module), the live-validator binding moving from
 *     `validateSchema19Baseline` to `validateSchema20Baseline`, the register's `_doc`
 *     header and the schema index;
 *   - `observed-shape-baseline.mjs` — the 19 → 20 bump, the retired-19 constant and its
 *     re-bound validator;
 *   - `migrate-observed-shape-readers.mjs` — this rung and `DECLARED_BANK_BY_TARGET`.
 *
 * ⛔ THREE RATHER THAN FOUR, as 15 → 16, 17 → 18 and 18 → 19 were three: the subject is
 * the write, which lives in a bookkeeping file. The literal module the write reads is a
 * test-side file and NOT a governed input, by design (a bank shrink must stay a hand
 * edit, not a rung). An extra path here, or one of these three remaining byte-identical,
 * is a different migration and fails closed.
 */
export const BANK_FENCE_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The 20 → 21 delta — the same bookkeeping set, THREE paths:
 *   - `check-observed-shape-readers.mjs` — the live-validator binding moving from
 *     `validateSchema20Baseline` to `validateSchema21Baseline`, the register's `_doc`
 *     header (which now states what the rung admits and why the other two rows stay
 *     ordinary) and the schema index;
 *   - `observed-shape-baseline.mjs` — the 20 → 21 bump, the retired-20 constant and its
 *     re-bound validator;
 *   - `migrate-observed-shape-readers.mjs` — this rung and its declared post-bank.
 *
 * ⛔ THE NEW READER IS NOT IN THIS SET, and that is the whole point of it being a SUBJECT
 * file rather than a detector one: `src/components/new/relationshipsDeskRead.js` is scanned,
 * not scanning. It moves `sourceTreeDigest` and `scanTreeDigest`, which the transition
 * records on its own; the DETECTOR delta is these three and no more.
 */
export const RELATIONSHIPS_MOUNT_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

/**
 * The 21 → 22 delta — the same bookkeeping set, THREE paths:
 *   - `check-observed-shape-readers.mjs` — the live-validator binding moving from
 *     `validateSchema21Baseline` to `validateSchema22Baseline`, the register's `_doc`
 *     header (which now states what the rung moves, what it deletes, and why the roster
 *     does not move with it) and the schema index;
 *   - `observed-shape-baseline.mjs` — the 21 → 22 bump, the retired-21 constant and its
 *     re-bound validator;
 *   - `migrate-observed-shape-readers.mjs` — this rung and its declared post-bank.
 *
 * ⛔ THE MOVED READER AND THE VIEW MODEL ARE NOT IN THIS SET, for the reason rung 21 spelled
 * for the reader's first home: `src/domain/display/stateProse/relationshipsDeskRead.js` and
 * `src/pdf/lib/viewModel.js` are SUBJECT files, scanned rather than scanning. They move
 * `sourceTreeDigest` and `scanTreeDigest`, which the transition records on its own; the
 * DETECTOR delta is these three and no more.
 */
export const DOMAIN_READER_SCANNER_DELTA_PATHS = Object.freeze([
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
]);

export const BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS = Object.freeze([
  'package-lock.json',
  'package.json',
  'scripts/check-observed-shape-readers.mjs',
  'scripts/lib/governed-artifact-io.mjs',
  'scripts/lib/legacy-reader-shape-scan.mjs',
  'scripts/lib/observed-shape-baseline.mjs',
  'scripts/lib/observed-shape-corpus.mjs',
  'scripts/lib/observed-shape-governance.mjs',
  'scripts/lib/reader-shape-scan.mjs',
  'scripts/migrate-observed-shape-readers.mjs',
  'tests/fixtures/spatialPackFixtures.js',
]);

const BANKED_EXPLAINED_WRITER_SCANNER_TRANSITION_POLICY =
  'schema-6-to-7-exact-scanner-transition-v1';
const TREASURY_ADMISSION_SCANNER_TRANSITION_POLICY =
  'schema-10-to-11-exact-scanner-transition-v1';
const GENESIS_TIES_SCANNER_TRANSITION_POLICY =
  'schema-11-to-12-exact-scanner-transition-v1';
const DEAD_DEPENDENCY_SCANNER_TRANSITION_POLICY =
  'schema-12-to-13-exact-scanner-transition-v1';
const PRESET_LIGHT_SCANNER_TRANSITION_POLICY =
  'schema-13-to-14-exact-scanner-transition-v1';
const STABLE_CORE_SCANNER_TRANSITION_POLICY =
  'schema-14-to-15-exact-scanner-transition-v1';
const COMPANION_GATE_SCANNER_TRANSITION_POLICY =
  'schema-15-to-16-exact-scanner-transition-v1';
const STRESS_TOPOLOGY_SCANNER_TRANSITION_POLICY =
  'schema-16-to-17-exact-scanner-transition-v1';
const LINEAGE_REANCHOR_SCANNER_TRANSITION_POLICY =
  'schema-17-to-18-exact-scanner-transition-v1';
const EXEMPTION_RETIREMENT_SCANNER_TRANSITION_POLICY =
  'schema-18-to-19-exact-scanner-transition-v1';
const BANK_FENCE_SCANNER_TRANSITION_POLICY =
  'schema-19-to-20-exact-scanner-transition-v1';
const RELATIONSHIPS_MOUNT_SCANNER_TRANSITION_POLICY =
  'schema-20-to-21-exact-scanner-transition-v1';
const DOMAIN_READER_SCANNER_TRANSITION_POLICY =
  'schema-21-to-22-exact-scanner-transition-v1';
const CORPUS_COVERAGE_SCANNER_TRANSITION_POLICY =
  'schema-7-to-8-exact-scanner-transition-v1';
const EPOCH_DARK_CORPUS_SCANNER_TRANSITION_POLICY =
  'schema-8-to-9-exact-scanner-transition-v1';
const PROSE_REGEN_SCANNER_TRANSITION_POLICY =
  'schema-9-to-10-exact-scanner-transition-v1';

/**
 * ⭐⭐ THE ONE TABLE THAT PAIRS A LEAF TARGET WITH ITS PREDECESSOR SCHEMA.
 *
 * All five leaf migrations run the same reconciliation, so the only way to keep
 * them from being confusable is to make the pairing DATA that every entry point
 * reads — never hand-written literals at separate call sites. A caller cannot
 * migrate a schema-2 baseline to schema 6, nor re-run a retired pairing against
 * the wrong predecessor, because no such pairing exists here.
 *
 * ⚠ THE CHAIN IS STRICT AND SINGLE-STEP BY CONSTRUCTION: each target's value is
 * written as the CONSTANT for its predecessor rather than as a literal, so a
 * skipped rung (2 → 6) is not expressible.
 */
export const LEAF_MIGRATION_PREDECESSOR = Object.freeze({
  [HEURISTIC_TARGET_SCHEMA]: 2,
  [FILTERED_TARGET_SCHEMA]: HEURISTIC_TARGET_SCHEMA,
  [SURFACE_FILTERED_TARGET_SCHEMA]: FILTERED_TARGET_SCHEMA,
  [BANKED_EXPLAINED_WRITER_TARGET_SCHEMA]: SURFACE_FILTERED_TARGET_SCHEMA,
  [CORPUS_COVERAGE_TARGET_SCHEMA]: BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
  [EPOCH_DARK_CORPUS_TARGET_SCHEMA]: CORPUS_COVERAGE_TARGET_SCHEMA,
  [PROSE_REGEN_TARGET_SCHEMA]: EPOCH_DARK_CORPUS_TARGET_SCHEMA,
  [TREASURY_ADMISSION_TARGET_SCHEMA]: PROSE_REGEN_TARGET_SCHEMA,
  [GENESIS_TIES_TARGET_SCHEMA]: TREASURY_ADMISSION_TARGET_SCHEMA,
  [DEAD_DEPENDENCY_TARGET_SCHEMA]: GENESIS_TIES_TARGET_SCHEMA,
  [PRESET_LIGHT_TARGET_SCHEMA]: DEAD_DEPENDENCY_TARGET_SCHEMA,
  [STABLE_CORE_TARGET_SCHEMA]: PRESET_LIGHT_TARGET_SCHEMA,
  [COMPANION_GATE_TARGET_SCHEMA]: STABLE_CORE_TARGET_SCHEMA,
  [STRESS_TOPOLOGY_TARGET_SCHEMA]: COMPANION_GATE_TARGET_SCHEMA,
  [LINEAGE_REANCHOR_TARGET_SCHEMA]: STRESS_TOPOLOGY_TARGET_SCHEMA,
  [EXEMPTION_RETIREMENT_TARGET_SCHEMA]: LINEAGE_REANCHOR_TARGET_SCHEMA,
  [BANK_FENCE_TARGET_SCHEMA]: EXEMPTION_RETIREMENT_TARGET_SCHEMA,
  [RELATIONSHIPS_MOUNT_TARGET_SCHEMA]: BANK_FENCE_TARGET_SCHEMA,
  [DOMAIN_READER_TARGET_SCHEMA]: RELATIONSHIPS_MOUNT_TARGET_SCHEMA,
});

/**
 * ⭐ THE ONE TABLE THAT NAMES EACH LEAF PREDECESSOR'S GOVERNED ENVELOPE LAW.
 * Sibling to the pairing above and kept beside it for the same reason: a
 * `if (schema === 4) … else if (schema === 5) …` chain is two places to forget
 * a rung. Schema 2 has no entry because it is the UNGOVERNED predecessor and
 * has no validator of its own — the structural checks below are its law.
 *
 * ⚠ THE TABLE IS NOT DENSE, AND THE HOLE IS OLDER THAN THIS RUNG: schemas 11, 12
 * and 13 have no entry, so a predecessor at one of those numbers is admitted on
 * the structural checks alone rather than on its own governed envelope law. That
 * is the three rungs 11→12, 12→13 and 13→14 each not extending this table, not a
 * ruling that those envelopes are unguarded; the 14 entry below is this rung
 * paying its own way rather than adding a fourth omission. ⚠ Filling 11–13 would
 * change what three RETIRED pairings accept and is deliberately NOT done here —
 * documented so it is not re-found as a mystery.
 */
const LEAF_PREDECESSOR_VALIDATOR = Object.freeze({
  [RETIRED_UNFILTERED_LEAF_BASELINE_SCHEMA]: validateSchema4Baseline,
  [RETIRED_FILTERED_LEAF_BASELINE_SCHEMA]: validateSchema5Baseline,
  [RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA]: validateSchema6Baseline,
  [RETIRED_BANKED_EXPLAINED_WRITER_BASELINE_SCHEMA]: validateSchema7Baseline,
  [CORPUS_COVERAGE_TARGET_SCHEMA]: validateSchema8Baseline,
  [EPOCH_DARK_CORPUS_TARGET_SCHEMA]: validateSchema9Baseline,
  [PROSE_REGEN_TARGET_SCHEMA]: validateSchema10Baseline,
  // The schema-15 rung's own predecessor. `validateSchema14Baseline` is bound to the
  // RETIRED literal from this rung onward, so this entry keeps validating schema 14
  // as schema 14 after the live number moves past it.
  [PRESET_LIGHT_TARGET_SCHEMA]: validateSchema14Baseline,
  // The schema-16 rung's own predecessor. `validateSchema15Baseline` is bound to the
  // RETIRED literal from this rung onward, so this entry keeps validating schema 15
  // as schema 15 after the live number moves past it.
  [STABLE_CORE_TARGET_SCHEMA]: validateSchema15Baseline,
  // The schema-17 rung's own predecessor. `validateSchema16Baseline` is bound to the
  // RETIRED literal from this rung onward, so this entry keeps validating schema 16
  // as schema 16 after the live number moves past it.
  [COMPANION_GATE_TARGET_SCHEMA]: validateSchema16Baseline,
  // The schema-18 rung's own predecessor. `validateSchema17Baseline` is bound to the
  // RETIRED literal from this rung onward, so this entry keeps validating schema 17
  // as schema 17 after the live number moves past it.
  [STRESS_TOPOLOGY_TARGET_SCHEMA]: validateSchema17Baseline,
  // The schema-19 rung's own predecessor. `validateSchema18Baseline` is bound to the
  // RETIRED literal from this rung onward, so this entry keeps validating schema 18
  // as schema 18 after the live number moves past it.
  [LINEAGE_REANCHOR_TARGET_SCHEMA]: validateSchema18Baseline,
  // The schema-20 rung's own predecessor. `validateSchema19Baseline` is bound to the
  // RETIRED literal from this rung onward, so this entry keeps validating schema 19
  // as schema 19 after the live number moves past it.
  [EXEMPTION_RETIREMENT_TARGET_SCHEMA]: validateSchema19Baseline,
  // The schema-21 rung's own predecessor. `validateSchema20Baseline` is bound to the
  // RETIRED literal from this rung onward, so this entry keeps validating schema 20
  // as schema 20 after the live number moves past it.
  [BANK_FENCE_TARGET_SCHEMA]: validateSchema20Baseline,
  // The schema-22 rung's own predecessor. `validateSchema21Baseline` is bound to the
  // RETIRED literal from this rung onward, so this entry keeps validating schema 21
  // as schema 21 after the live number moves past it.
  [RELATIONSHIPS_MOUNT_TARGET_SCHEMA]: validateSchema21Baseline,
});

const RETIRED_EXACT_MIGRATION_KIND = `observed-shape-schema-2-to-${RETIRED_EXACT_TARGET_SCHEMA}-migration`;
const leafMigrationKindOf = (targetSchema) => (
  `observed-shape-schema-${LEAF_MIGRATION_PREDECESSOR[targetSchema]}-to-${targetSchema}-migration`
);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const GOVERNED_LEGACY_ALGORITHM = Object.freeze({
  baseSha: LEGACY_ALGORITHM_BASE_SHA,
  sourceBlobSha: LEGACY_ALGORITHM_BLOB_SHA,
  enrichment: LEGACY_ALGORITHM_ENRICHMENT,
});

const ABBREVIATED_GIT_SHA = /^[0-9a-f]{7,40}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const normalizedText = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const sortedUnique = (values) => [...new Set(values)].sort();
const equalArrays = (a, b) => a.length === b.length && a.every((value, i) => value === b[i]);
const exactAddress = (finding) => [finding.file, finding.pos, finding.key].join('\u0000');
const predecessorAddress = (file, identity) => [file, identity].join('\u0000');
const isRecord = (value) => value != null && typeof value === 'object'
  && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;

function positiveSafeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`schema-2 predecessor ${label} must be a positive safe integer; received ${JSON.stringify(value)}`);
  }
  return value;
}

function nonNegativeSafeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`schema-2 predecessor ${label} must be a non-negative safe integer; received ${JSON.stringify(value)}`);
  }
  return value;
}

function canonicalPredecessorBaseline(predecessorBaseline, predecessorSchema = 2) {
  if (!isRecord(predecessorBaseline) || predecessorBaseline.schema !== predecessorSchema) {
    throw new Error(`observed-shape predecessor baseline must be a schema-${predecessorSchema} object`);
  }
  // ⭐ A LEAF PREDECESSOR IS VALIDATED BY ITS OWN GOVERNED ENVELOPE LAW, not by
  // the loose structural checks below, which exist because the schema-2
  // predecessor was UNGOVERNED and had no validator of its own. Re-deriving a
  // second, weaker definition of an envelope that already has a governed one is
  // the doubled-law shape; this defers to the real law and then continues with
  // the shared structural checks, which the governed envelope also satisfies.
  LEAF_PREDECESSOR_VALIDATOR[predecessorSchema]?.(predecessorBaseline);
  // Canonicalization is itself part of validation: it refuses cycles,
  // undefined values and non-finite numbers before any digest is authoritative.
  const canonical = JSON.parse(canonicalJson(predecessorBaseline));
  if (!ISO_DATE.test(canonical.frozen || '')) {
    throw new Error('schema-2 predecessor frozen date must use YYYY-MM-DD');
  }
  if (canonical.frozenAtSha !== null
    && !ABBREVIATED_GIT_SHA.test(canonical.frozenAtSha || '')) {
    throw new Error('schema-2 predecessor frozenAtSha must be null or a 7-40 character lowercase Git SHA');
  }
  positiveSafeInteger(canonical.minRows, 'minRows');
  if (!isRecord(canonical.inventory) || Object.keys(canonical.inventory).length === 0) {
    throw new Error('schema-2 predecessor inventory must be a nonempty object');
  }

  let total = 0;
  let identities = 0;
  for (const [file, row] of Object.entries(canonical.inventory)) {
    if (!file.startsWith('src/') || file.includes('\\') || file.includes('\u0000')
      || file.split('/').some((part) => !part || part === '.' || part === '..')) {
      throw new Error(`schema-2 predecessor inventory has an unsafe file path: ${JSON.stringify(file)}`);
    }
    if (!isRecord(row) || Object.keys(row).length === 0) {
      throw new Error(`schema-2 predecessor inventory row is empty or malformed: ${file}`);
    }
    for (const [identity, count] of Object.entries(row)) {
      if (!identity || identity.includes('\u0000')) {
        throw new Error(`schema-2 predecessor inventory has an invalid identity in ${file}`);
      }
      positiveSafeInteger(count, `inventory[${JSON.stringify(file)}][${JSON.stringify(identity)}]`);
      total += count;
      identities += 1;
      if (!Number.isSafeInteger(total) || !Number.isSafeInteger(identities)) {
        throw new Error('schema-2 predecessor inventory totals exceed safe integer range');
      }
    }
  }
  positiveSafeInteger(canonical.total, 'total');
  positiveSafeInteger(canonical.identities, 'identities');
  if (canonical.total !== total || canonical.identities !== identities) {
    throw new Error(`schema-2 predecessor totals disagree with inventory: ${JSON.stringify({
      declaredTotal: canonical.total,
      measuredTotal: total,
      declaredIdentities: canonical.identities,
      measuredIdentities: identities,
    })}`);
  }

  if (!isRecord(canonical.scanStats)) {
    throw new Error('schema-2 predecessor scanStats must be an object');
  }
  for (const key of ['files', 'reads', 'resolved']) {
    positiveSafeInteger(canonical.scanStats[key], `scanStats.${key}`);
  }
  nonNegativeSafeInteger(canonical.scanStats.unresolved, 'scanStats.unresolved');
  if (canonical.scanStats.reads
    !== canonical.scanStats.resolved + canonical.scanStats.unresolved) {
    throw new Error('schema-2 predecessor scanStats reads do not conserve resolved plus unresolved');
  }

  if (!isRecord(canonical.sentinel)) {
    throw new Error('schema-2 predecessor sentinel must be an object');
  }
  for (const key of ['usableShapes', 'totalKeys', 'resolvedReads']) {
    positiveSafeInteger(canonical.sentinel[key], `sentinel.${key}`);
  }
  if (canonical.sentinel.resolvedReads !== canonical.scanStats.resolved) {
    throw new Error('schema-2 predecessor sentinel does not match scanStats.resolved');
  }

  if (!isRecord(canonical.corpusMeta)) {
    throw new Error('schema-2 predecessor corpusMeta must be an object');
  }
  for (const key of ['seeds', 'configs', 'generations', 'pulseIntervals', 'shapeCount']) {
    positiveSafeInteger(canonical.corpusMeta[key], `corpusMeta.${key}`);
  }
  for (const key of ['simulationFlagsLit', 'steadingsMinted']) {
    nonNegativeSafeInteger(canonical.corpusMeta[key], `corpusMeta.${key}`);
  }
  return canonical;
}

export function validatePredecessorBaseline(predecessorBaseline, predecessorSchema = 2) {
  return canonicalPredecessorBaseline(predecessorBaseline, predecessorSchema);
}

function predecessorInputOf(predecessorBaseline, predecessorBaselineText, predecessorSchema = 2) {
  const predecessor = canonicalPredecessorBaseline(predecessorBaseline, predecessorSchema);
  if (typeof predecessorBaselineText !== 'string' || !predecessorBaselineText) {
    throw new Error('observed-shape migration requires the exact predecessor baseline text');
  }
  let parsed;
  try {
    parsed = JSON.parse(predecessorBaselineText);
  } catch (error) {
    throw new Error(
      `observed-shape predecessor baseline text is not valid JSON: ${error.message}`,
      { cause: error },
    );
  }
  const parsedPredecessor = canonicalPredecessorBaseline(parsed, predecessorSchema);
  if (canonicalJson(parsedPredecessor) !== canonicalJson(predecessor)) {
    throw new Error('observed-shape predecessor baseline object does not match its exact input text');
  }
  return {
    predecessor,
    predecessorBaselineTextSha256: createHash('sha256')
      .update(Buffer.from(predecessorBaselineText, 'utf8'))
      .digest('hex'),
  };
}

function assertLegacyFinding(finding) {
  if (!finding || typeof finding !== 'object'
    || typeof finding.file !== 'string' || !finding.file || finding.file.includes('\\')
    || !Number.isInteger(finding.line) || finding.line < 1
    || !Number.isInteger(finding.pos) || finding.pos < 0
    || typeof finding.key !== 'string'
    || !Array.isArray(finding.shapes) || finding.shapes.length !== 1
    || typeof finding.shapes[0] !== 'string'
    || typeof finding.text !== 'string') {
    throw new Error(`legacy observed-shape finding lacks exact pos/leaf provenance: ${JSON.stringify(finding)}`);
  }
}

/**
 * ONE HOME for "this is the governed heuristic detector's own artifact". Both
 * migration targets need exactly this claim — the retired path as the LEGACY
 * half of a pair, the live path as the WHOLE authority — and a second copy of a
 * detector-governance check is the doubled-law shape.
 */
function assertGovernedLegacyArtifact(legacy) {
  validateScanArtifact(legacy);
  if (legacy.scanMode !== 'legacy-leaf' || legacy.baselineSchema !== 2) {
    throw new Error('legacy migration input must be a validated legacy-leaf/schema-2 scan artifact');
  }
  if (legacy.posEnrichment !== 'node-name-start-v1') {
    throw new Error('legacy migration input must record the governed node-name-start-v1 position enrichment');
  }
  if (legacy.legacyAlgorithm?.baseSha !== GOVERNED_LEGACY_ALGORITHM.baseSha
    || legacy.legacyAlgorithm?.sourceBlobSha !== GOVERNED_LEGACY_ALGORITHM.sourceBlobSha
    || legacy.legacyAlgorithm?.enrichment !== GOVERNED_LEGACY_ALGORITHM.enrichment
    || legacy.legacyAlgorithm?.modulePath !== 'scripts/lib/legacy-reader-shape-scan.mjs') {
    throw new Error('legacy migration input is not the governed 6e7acc4d detector with the sole node-name-start-v1 enrichment');
  }
  for (const finding of legacy.findings) assertLegacyFinding(finding);
  return legacy;
}

function assertArtifactPair(legacy, current) {
  assertGovernedLegacyArtifact(legacy);
  validateScanArtifact(current);
  if (current.scanMode !== 'exact-origin'
    || current.baselineSchema !== RETIRED_EXACT_TARGET_SCHEMA) {
    throw new Error('current migration input must be a validated exact-origin/schema-3 scan artifact');
  }
  if (legacy.provenance.subjectSha !== current.provenance.subjectSha) {
    throw new Error(`migration artifacts describe different subject commits: ${legacy.provenance.subjectSha} != ${current.provenance.subjectSha}`);
  }
  if (legacy.provenance.sourceTreeDigest !== current.provenance.sourceTreeDigest
    || canonicalJson(legacy.sourceTree) !== canonicalJson(current.sourceTree)) {
    throw new Error('migration artifacts do not describe the exact same source tree');
  }
  for (const [label, field] of [
    ['scan tree', 'scanTree'],
    ['detector tree', 'detectorTree'],
    ['execution tree', 'executionTree'],
  ]) {
    if (canonicalJson(legacy[field]) !== canonicalJson(current[field])) {
      throw new Error(`migration artifacts do not describe the exact same ${label}`);
    }
  }
  if (legacy.provenance.scannerSha !== current.provenance.scannerSha) {
    throw new Error('migration artifacts were not emitted by the same committed scanner toolchain');
  }
  if (legacy.digests.corpus !== current.digests.corpus
    || canonicalJson(legacy.corpus) !== canonicalJson(current.corpus)) {
    throw new Error('migration artifacts do not bind the exact same canonical executed corpus');
  }
  if (canonicalJson(legacy.scanConfig) !== canonicalJson(current.scanConfig)) {
    throw new Error('migration artifacts do not bind the exact same thresholds and scan configuration');
  }
}

/**
 * The corpus keys that define the EXPERIMENT. A change here means the two sides
 * observed different worlds, so no reconciliation between them is meaningful.
 */
const CORPUS_EXECUTION_KEYS = ['seeds', 'configs', 'generations', 'pulseIntervals'];

/**
 * The corpus keys that describe WHAT THE EXPERIMENT SAW. These legitimately move
 * when the corpus BUILDER gains reach without the corpus DEFINITION changing —
 * which is exactly what happened, and exactly what nothing recorded.
 */
const CORPUS_OBSERVATION_KEYS = ['simulationFlagsLit', 'steadingsMinted', 'shapeCount'];

/**
 * ⚠⚠ THE CORPUS DEFINITION MOVED UNDER THE RECONCILIATION AND NOTHING SAW IT.
 * The first spelling compared four keys — seeds/configs/generations/pulseIntervals
 * — and never `shapeCount`. Between the schema-2 freeze and HEAD the corpus
 * builder gained the graph-schema-2 origins and `shapeCount` went 305 -> 1,321,
 * which grows `known`/`singleHome`/`rootShapes` and therefore re-grounds receivers
 * that previously resolved to nothing. That is the measured driver of the growth
 * rows the freeze had to review, and the compatibility check was BLIND to it.
 *
 * ⚠ AND THE HOLE WAS WORSE THAN AN OMITTED KEY: nothing validates an artifact's
 * `corpus.meta` at all, so a key that is simply ABSENT compared `undefined` and
 * the migration accepted a corpus that never declared its own definition. Presence
 * is now REQUIRED for every key on both sides.
 *
 * Execution keys must MATCH. Observation keys are RECORDED, not refused — a
 * genesis is entitled to bank a corpus that saw more, but never silently.
 */
function corpusCompatibilityOf(predecessor, legacyArtifact) {
  const current = legacyArtifact.corpus?.meta;
  if (!isRecord(current)) {
    throw new Error('observed-shape migration artifact corpus does not declare its executed meta record');
  }
  const keys = {};
  for (const key of [...CORPUS_EXECUTION_KEYS, ...CORPUS_OBSERVATION_KEYS]) {
    const before = predecessor.corpusMeta[key];
    const after = current[key];
    nonNegativeSafeInteger(before, `corpusMeta.${key}`);
    if (!Number.isSafeInteger(after) || after < 0) {
      throw new Error(`observed-shape migration artifact corpus meta ${key} is missing or not a non-negative safe integer; received ${JSON.stringify(after)}`);
    }
    keys[key] = { predecessor: before, current: after, moved: before !== after };
  }
  for (const key of CORPUS_EXECUTION_KEYS) {
    if (keys[key].moved) {
      throw new Error(`schema-2 predecessor corpus configuration ${key} does not match the legacy artifact`);
    }
  }
  return {
    executionKeys: [...CORPUS_EXECUTION_KEYS],
    observationKeys: [...CORPUS_OBSERVATION_KEYS],
    keys,
    moved: Object.entries(keys)
      .filter(([, value]) => value.moved)
      .map(([key, value]) => `${key}: ${value.predecessor} -> ${value.current}`),
  };
}

function assertPredecessorExecutionCompatibility(predecessor, legacyArtifact) {
  if (predecessor.minRows !== legacyArtifact.scanConfig.minRows) {
    throw new Error(`schema-2 predecessor minRows ${predecessor.minRows} does not match the legacy artifact threshold ${legacyArtifact.scanConfig.minRows}`);
  }
  return corpusCompatibilityOf(predecessor, legacyArtifact);
}

const manifestEntriesByPath = (manifest) => new Map(
  manifest.entries.map((entry) => [entry.path, entry]),
);

/** The SUBJECT inputs the scan does not read — generated JS and JSON. Bound by
 *  the envelope, never parsed, and therefore the one governed surface that can
 *  move without any detector or scanned source moving with it. */
function unscannedEntriesOf({ sourceTree, scanTree }) {
  const scannedPaths = new Set(scanTree.entries.map((entry) => entry.path));
  return sourceTree.entries.filter((entry) => !scannedPaths.has(entry.path));
}

function unscannedInputDigestOf(trees) {
  return digestOf(unscannedEntriesOf(trees));
}

/**
 * ⭐ THE MOVED UNSCANNED INPUTS, BY NAME. A digest inequality says only "these
 * two sets differ", which is not something a reviewer can accept or refuse. This
 * derives the actual paths from the two manifests, so the review decision is
 * taken over named files.
 */
function unscannedMovementOf(predecessor, legacyArtifact) {
  const before = new Map(unscannedEntriesOf(predecessor.manifests)
    .map((entry) => [entry.path, entry]));
  const after = new Map(unscannedEntriesOf(legacyArtifact)
    .map((entry) => [entry.path, entry]));
  const added = [...after.keys()].filter((path) => !before.has(path)).sort();
  const removed = [...before.keys()].filter((path) => !after.has(path)).sort();
  const modified = [...before.keys()]
    .filter((path) => after.has(path)
      && canonicalJson(before.get(path)) !== canonicalJson(after.get(path)))
    .sort();
  return {
    added,
    removed,
    modified,
    changedPaths: sortedUnique([...added, ...removed, ...modified]),
  };
}

/**
 * ⚠⚠ `reviewableUnscannedMovement` IS PER-TARGET AND NEVER RETROACTIVE. Targets
 * 7 and 8 keep unscanned-input EQUALITY as a hard refusal, because that is the
 * law each of them was actually governed under and a retroactive relaxation
 * would falsify their recorded transitions. Targets 9 and 10 each declare the
 * movement REVIEWABLE — separately, in their own entries, never by a shared
 * default — because in each case its cause is a landed generated-source
 * re-record, and the alternative — refusing it — leaves the instrument
 * permanently un-mintable and therefore permanently dark. ⭐ Target 10 is the
 * evidence that this was the right law rather than a one-off accommodation: the
 * class RECURRED within nine commits of the schema-9 freeze, and the target-9
 * apparatus carried it with no new law. Reviewable is not silent: the movement is recorded
 * by NAMED PATH in the transition record, travels into the report's issue list,
 * and needs the same accepted, noted decision every other governed row needs.
 * The STANDING gate arm is untouched: `check-observed-shape-readers.mjs` still
 * returns 1 the moment the live unscanned digest leaves the frozen one.
 */
const SCANNER_TRANSITION_BY_TARGET = new Map([
  [BANKED_EXPLAINED_WRITER_TARGET_SCHEMA, Object.freeze({
    deltaPaths: BANKED_EXPLAINED_WRITER_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: BANKED_EXPLAINED_WRITER_SCANNER_TRANSITION_POLICY,
    reviewableUnscannedMovement: false,
  })],
  [CORPUS_COVERAGE_TARGET_SCHEMA, Object.freeze({
    deltaPaths: CORPUS_COVERAGE_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: CORPUS_COVERAGE_SCANNER_TRANSITION_POLICY,
    reviewableUnscannedMovement: false,
  })],
  [EPOCH_DARK_CORPUS_TARGET_SCHEMA, Object.freeze({
    deltaPaths: EPOCH_DARK_CORPUS_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: EPOCH_DARK_CORPUS_SCANNER_TRANSITION_POLICY,
    reviewableUnscannedMovement: true,
  })],
  [PROSE_REGEN_TARGET_SCHEMA, Object.freeze({
    deltaPaths: PROSE_REGEN_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: PROSE_REGEN_SCANNER_TRANSITION_POLICY,
    reviewableUnscannedMovement: true,
  })],
  [TREASURY_ADMISSION_TARGET_SCHEMA, Object.freeze({
    deltaPaths: TREASURY_ADMISSION_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: TREASURY_ADMISSION_SCANNER_TRANSITION_POLICY,
    reviewableUnscannedMovement: true,
  })],
  [GENESIS_TIES_TARGET_SCHEMA, Object.freeze({
    deltaPaths: GENESIS_TIES_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: GENESIS_TIES_SCANNER_TRANSITION_POLICY,
    // TRUE, matching 8→9, 9→10 and 10→11: the flag is PER-TARGET and never retroactive,
    // and setting it false would make this rung refuse an unscanned movement that is
    // lawful and reviewable — which is precisely what left this instrument dark once
    // already. ⭐ MEASURED AT THIS MINT, THOUGH, NOTHING MOVED: the report's
    // `unscannedMovement` is null. `unscannedInputDigestOf` is the SUBJECT tree minus the
    // SCAN tree, and the subject tree is `src/**` — so the T5 train's regenerated
    // artifacts (the two AI edge-shared bundles under `supabase/functions/_shared/`) are
    // not subject paths at all and cannot move this digest. The permission is carried
    // because the class is lawful, not because this rung exercises it.
    reviewableUnscannedMovement: true,
  })],
  [DEAD_DEPENDENCY_TARGET_SCHEMA, Object.freeze({
    deltaPaths: DEAD_DEPENDENCY_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: DEAD_DEPENDENCY_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9. MEASURED at this mint: nothing moved. The
    // subject tree is `src/**` and this rung touches only the two package files at the
    // root, so the unscanned digest cannot move and the report's `unscannedMovement`
    // is null. The permission is carried because the class is lawful, not exercised.
    reviewableUnscannedMovement: true,
  })],
  [PRESET_LIGHT_TARGET_SCHEMA, Object.freeze({
    deltaPaths: PRESET_LIGHT_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: PRESET_LIGHT_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9 — the flag is PER-TARGET and never
    // retroactive. MEASURED at this mint: nothing moved. `unscannedInputDigestOf` is
    // the SUBJECT tree minus the SCAN tree, and this rung touches only three files
    // under `scripts/`, which are not subject paths at all, so the digest cannot move
    // and the report's `unscannedMovement` is null. The permission is carried because
    // the class is lawful, not because this rung exercises it.
    reviewableUnscannedMovement: true,
  })],
  [LINEAGE_REANCHOR_TARGET_SCHEMA, Object.freeze({
    deltaPaths: LINEAGE_REANCHOR_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: LINEAGE_REANCHOR_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9 — the flag is PER-TARGET and never
    // retroactive. `unscannedInputDigestOf` is the SUBJECT tree minus the SCAN tree,
    // and the subject tree is `src/**`; this rung touches three files under `scripts/`,
    // which are not subject paths at all, so the digest cannot move BY THIS RUNG. It is
    // carried because this rung is cut TWENTY-FIVE CARS later than its predecessor's
    // freeze — the widest gap any rung has spanned — and a landed generated-source
    // re-record anywhere in that span is exactly the movement targets 9 and 10 declared
    // reviewable. Refusing it here would refuse the re-anchoring for a movement that
    // belongs to the lineage rather than to the instrument.
    reviewableUnscannedMovement: true,
  })],
  [STRESS_TOPOLOGY_TARGET_SCHEMA, Object.freeze({
    deltaPaths: STRESS_TOPOLOGY_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: STRESS_TOPOLOGY_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9 — the flag is PER-TARGET and never
    // retroactive. `unscannedInputDigestOf` is the SUBJECT tree minus the SCAN tree,
    // and the subject tree is `src/**`; this rung touches four files under `scripts/`,
    // which are not subject paths at all, so the digest cannot move BY THIS RUNG. The
    // permission is carried because the class is lawful and because this rung is cut at
    // a later tip than its predecessor's freeze — a landed generated-source re-record
    // between the two is exactly the movement targets 9 and 10 declared reviewable.
    reviewableUnscannedMovement: true,
  })],
  [COMPANION_GATE_TARGET_SCHEMA, Object.freeze({
    deltaPaths: COMPANION_GATE_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: COMPANION_GATE_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9 — the flag is PER-TARGET and never
    // retroactive. `unscannedInputDigestOf` is the SUBJECT tree minus the SCAN tree,
    // and the subject tree is `src/**`; this rung touches three files under `scripts/`,
    // which are not subject paths at all, so the digest cannot move and the report's
    // `unscannedMovement` is null. The permission is carried because the class is
    // lawful, not because this rung exercises it.
    reviewableUnscannedMovement: true,
  })],
  [EXEMPTION_RETIREMENT_TARGET_SCHEMA, Object.freeze({
    deltaPaths: EXEMPTION_RETIREMENT_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: EXEMPTION_RETIREMENT_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9 — the flag is PER-TARGET and never
    // retroactive. `unscannedInputDigestOf` is the SUBJECT tree minus the SCAN tree, and
    // the subject tree is `src/**`; this rung touches three files under `scripts/`, which
    // are not subject paths at all, so the digest cannot move BY THIS RUNG. It is carried
    // because the ESTATE moved under this rung in the very act that caused it — the lock
    // controls were deleted from `src/components/` — and a generated or data leaf
    // re-recorded anywhere in that same landing is exactly the movement targets 9 and 10
    // declared reviewable. Refusing it would refuse the retirement for a movement that
    // belongs to the owner's change rather than to the instrument.
    reviewableUnscannedMovement: true,
  })],
  [BANK_FENCE_TARGET_SCHEMA, Object.freeze({
    deltaPaths: BANK_FENCE_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: BANK_FENCE_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9 — the flag is PER-TARGET and never
    // retroactive. `unscannedInputDigestOf` is the SUBJECT tree minus the SCAN tree, and
    // the subject tree is `src/**`; this rung touches three files under `scripts/` and a
    // test-side literal module, none of them subject paths, so the digest cannot move BY
    // THIS RUNG. The permission is carried because the class is lawful, not because this
    // rung exercises it.
    reviewableUnscannedMovement: true,
  })],
  [DOMAIN_READER_TARGET_SCHEMA, Object.freeze({
    deltaPaths: DOMAIN_READER_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: DOMAIN_READER_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9 — the flag is PER-TARGET and never retroactive.
    // `unscannedInputDigestOf` is the SUBJECT tree minus the SCAN tree; this rung touches
    // three files under `scripts/`, none of them subject paths, and the two source files it
    // was cut for are plain `.js` modules the scan READS, so they enter the scan tree rather
    // than the unscanned remainder. The permission is carried because the class is lawful,
    // not because this rung exercises it.
    reviewableUnscannedMovement: true,
  })],
  [RELATIONSHIPS_MOUNT_TARGET_SCHEMA, Object.freeze({
    deltaPaths: RELATIONSHIPS_MOUNT_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: RELATIONSHIPS_MOUNT_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9 — the flag is PER-TARGET and never retroactive.
    // `unscannedInputDigestOf` is the SUBJECT tree minus the SCAN tree; this rung touches
    // three files under `scripts/`, none of them subject paths, and the source file it was
    // cut for is a plain `.js` module that the scan READS, so it enters the scan tree rather
    // than the unscanned remainder. The permission is carried because the class is lawful,
    // not because this rung exercises it.
    reviewableUnscannedMovement: true,
  })],
  [STABLE_CORE_TARGET_SCHEMA, Object.freeze({
    deltaPaths: STABLE_CORE_SCANNER_DELTA_PATHS,
    inputPaths: BANKED_EXPLAINED_WRITER_SCANNER_INPUT_PATHS,
    policy: STABLE_CORE_SCANNER_TRANSITION_POLICY,
    // TRUE, matching every rung since 8→9 — the flag is PER-TARGET and never
    // retroactive. `unscannedInputDigestOf` is the SUBJECT tree minus the SCAN tree,
    // and the subject tree is `src/**`; this rung touches four files under `scripts/`,
    // which are not subject paths at all, so the digest cannot move and the report's
    // `unscannedMovement` is null. The permission is carried because the class is
    // lawful, not because this rung exercises it.
    reviewableUnscannedMovement: true,
  })],
]);

/**
 * The four governed detector-tree transitions (6→7, 7→8, 8→9 and 9→10) share one
 * fail-closed proof. Inventory reconciliation alone cannot distinguish a ruled
 * scanner edit from an arbitrary detector rewrite, so each target supplies an
 * exact predecessor, input universe and delta-path set.
 */
/**
 * ⭐⭐ CUSTODY IS THE DIGEST BIND, NEVER GENESIS (chair ruling ODQ §784.2, 2026-08-30).
 *
 * ── THE DEFECT THIS REPLACES, AND HOW IT WAS FOUND ──────────────────────────
 * This function used to open with
 *
 *     predecessor.frozenAtSha !== predecessor.migrationReview.subjectSha
 *       => "requires the immutable schema-N migration genesis as predecessor"
 *
 * — i.e. a migration could only ever run from a baseline that had NEVER been ordinarily
 * re-frozen. That held by accident for every rung up to 9→10, because each predecessor
 * happened to still sit at its own mint. It stopped holding the moment a lane took a
 * lawful shrink: MEASURED at the 10→11 attempt, the live baseline was minted at
 * `12b3aa53` and re-frozen at `4f42be70`, so the schema could never advance again.
 *
 * ⛔ THE SHAPE IS A RECORDED FAMILY LAW, AND THIS IS ITS THIRD INSTANCE. TE-OSHAPE-1
 * cured a gate that darkened `--write` after ordinary INPUT churn. This one darkened
 * `--migrate` after ordinary `--write` churn. Both said, in effect, "the instrument may
 * not move once ordinary maintenance has happened" — which inverts the point of having
 * ordinary maintenance at all. BIND BY DIGEST, NEVER BY GENESIS.
 *
 * ── WHAT ACTUALLY CARRIES CUSTODY, AND IT ALWAYS DID ────────────────────────
 * The chain of custody was never the genesis equality; it is the DIGEST BIND, enforced
 * in three places that the relaxation does not touch:
 *   1. the predecessor's own envelope — `validateLeafBaseline` (run by this report's
 *      predecessor validator BEFORE this function) binds every internal digest,
 *      `migrationReview` included, so a validly-frozen predecessor is a self-consistent
 *      one by definition;
 *   2. this assertion, which re-states that bind at the transition so a tampered
 *      predecessor is refused HERE and not merely upstream;
 *   3. the write itself, where `--migrate-schema` refuses unless
 *      `digestOf(baseline) === receipt.predecessorBaselineDigest`, the canonical JSON
 *      matches the bundle's own copy, AND the baseline TEXT sha matches.
 * A forged predecessor fails all three. A lawfully re-frozen one fails none — and that
 * is exactly the case the old rule refused.
 *
 * @param {any} predecessor @param {string} transitionLabel
 */
export function assertPredecessorCustody(predecessor, transitionLabel) {
  const review = predecessor?.migrationReview;
  if (!review || typeof review !== 'object' || Array.isArray(review)) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition requires a predecessor carrying its own migration review`);
  }
  if (!SHA1_RE.test(String(review.subjectSha || ''))) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition requires a predecessor whose migration review names the sha it was minted at`);
  }
  if (!SHA1_RE.test(String(predecessor.frozenAtSha || ''))) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition requires a predecessor frozen at a named sha`);
  }
  // THE BIND. `frozenAtSha` may legitimately have advanced past `subjectSha` — that is an
  // ordinary re-freeze and is precisely what this ruling admits — but the review it claims
  // to have been minted under must still be the one its own digest addresses.
  if (digestOf(review) !== predecessor?.digests?.migrationReview) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition predecessor migration review does not match its own digest;`
      + ' custody is the digest bind, so a predecessor whose review has been edited under its digest is refused');
  }
  return predecessor;
}

const SHA1_RE = /^[0-9a-f]{40}$/;

function governedScannerTransitionOf(predecessor, legacyArtifact, targetSchema) {
  const transition = SCANNER_TRANSITION_BY_TARGET.get(targetSchema);
  const predecessorSchema = LEAF_MIGRATION_PREDECESSOR[targetSchema];
  if (!transition) {
    throw new Error(`observed-shape schema-${predecessorSchema}-to-${targetSchema} migration has no governed scanner-transition law`);
  }
  const transitionLabel = `schema-${predecessorSchema} to schema-${targetSchema}`;
  assertPredecessorCustody(predecessor, transitionLabel);
  const beforeByPath = manifestEntriesByPath(predecessor.manifests.detectorTree);
  const afterByPath = manifestEntriesByPath(legacyArtifact.detectorTree);
  const beforePaths = [...beforeByPath.keys()].sort();
  const afterPaths = [...afterByPath.keys()].sort();
  if (!equalArrays(beforePaths, transition.inputPaths)
    || !equalArrays(afterPaths, transition.inputPaths)) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition must bind the exact governed 11-input detector universe:`
      + ` predecessor=${JSON.stringify(beforePaths)} current=${JSON.stringify(afterPaths)}`);
  }
  const addedPaths = afterPaths.filter((path) => !beforeByPath.has(path));
  const removedPaths = beforePaths.filter((path) => !afterByPath.has(path));
  if (addedPaths.length || removedPaths.length) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition changes the governed detector path set:`
      + ` added=${JSON.stringify(addedPaths)} removed=${JSON.stringify(removedPaths)}`);
  }

  const modifiedPaths = beforePaths.filter((path) => (
    canonicalJson(beforeByPath.get(path)) !== canonicalJson(afterByPath.get(path))
  ));
  if (!equalArrays(modifiedPaths, transition.deltaPaths)) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition must modify exactly `
      + `${JSON.stringify(transition.deltaPaths)}; received ${JSON.stringify(modifiedPaths)}`);
  }

  const changes = modifiedPaths.map((path) => {
    const predecessorEntry = beforeByPath.get(path);
    const currentEntry = afterByPath.get(path);
    if (predecessorEntry.type !== currentEntry.type
      || predecessorEntry.mode !== currentEntry.mode) {
      throw new Error(`observed-shape ${transitionLabel} scanner transition changes file type or mode at ${path}`);
    }
    if (predecessorEntry.sha256 === currentEntry.sha256) {
      throw new Error(`observed-shape ${transitionLabel} scanner transition does not change content at ${path}`);
    }
    return { path, predecessor: predecessorEntry, current: currentEntry };
  });
  // ⚠⚠ THE RETAINED COUNT IS DERIVED FROM THIS TARGET'S OWN LAW, NEVER A
  // LITERAL. It used to be a hard-coded `!== 7`, which silently assumed every
  // future mint changes exactly four of the eleven governed inputs — an
  // assumption the 8→9 five-path delta falsifies. The arithmetic is identical
  // for targets 7 and 8 (11 − 4 = 7), so this is a generalisation and not a
  // relaxation; the count is still EXACT and still fails closed.
  const retainedPaths = transition.inputPaths.length - transition.deltaPaths.length;
  const unchangedPaths = beforePaths.filter((path) => !modifiedPaths.includes(path));
  if (unchangedPaths.length !== retainedPaths) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition must retain exactly ${retainedPaths} byte-identical detector inputs; received ${unchangedPaths.length}`);
  }

  const predecessorUnscannedInputDigest = predecessor.scannerProvenance.unscannedInputDigest;
  const currentUnscannedInputDigest = unscannedInputDigestOf(legacyArtifact);
  let unscannedMovement = null;
  if (predecessorUnscannedInputDigest !== currentUnscannedInputDigest) {
    if (!transition.reviewableUnscannedMovement) {
      throw new Error(`observed-shape ${transitionLabel} scanner transition changes unscanned governed source inputs:`
        + ` ${predecessorUnscannedInputDigest} != ${currentUnscannedInputDigest}`);
    }
    unscannedMovement = unscannedMovementOf(predecessor, legacyArtifact);
    // Anti-vacuity: a moved digest that names no path would be a review over
    // nothing, and the accepted decision would mean nothing.
    if (!unscannedMovement.changedPaths.length) {
      throw new Error(`observed-shape ${transitionLabel} scanner transition reports a moved unscanned input digest that names no changed path`);
    }
  }
  if (predecessor.migrationReview.scanConfigDigest !== legacyArtifact.digests.scanConfig) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition changes the governed scan configuration`);
  }
  if (legacyArtifact.provenance.subjectSha !== legacyArtifact.provenance.scannerSha) {
    throw new Error(`observed-shape schema-${targetSchema} migration artifact subject and scanner SHAs must name one committed code half`);
  }
  if (legacyArtifact.provenance.scannerSha === predecessor.migrationReview.currentScannerSha) {
    throw new Error(`observed-shape ${transitionLabel} scanner transition must advance to a fresh committed scanner SHA`);
  }

  return {
    policy: transition.policy,
    predecessorSchema,
    targetSchema,
    predecessor: {
      scannerSha: predecessor.migrationReview.currentScannerSha,
      detectorTreeDigest: predecessor.manifests.detectorTree.digest,
      scannerToolDigest: predecessor.migrationReview.currentScannerToolDigest,
      unscannedInputDigest: predecessorUnscannedInputDigest,
    },
    current: {
      scannerSha: legacyArtifact.provenance.scannerSha,
      detectorTreeDigest: legacyArtifact.detectorTree.digest,
      scannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
      unscannedInputDigest: currentUnscannedInputDigest,
    },
    modifiedPaths,
    unchangedPaths,
    changes,
    ...(unscannedMovement ? { unscannedMovement } : {}),
  };
}

const scannerTransitionRowIdOf = (scannerTransition) => (
  `osr-scanner-transition-v1:${digestOf(scannerTransition)}`
);

function legacySitesOf(findings) {
  const sites = new Map();
  for (const finding of findings) {
    const address = exactAddress(finding);
    if (sites.has(address)) {
      throw new Error(`legacy migration input repeats exact site ${finding.file}:${finding.pos}:${finding.key}`);
    }
    sites.set(address, finding);
  }
  return sites;
}

function currentSitesOf(findings) {
  const sites = new Map();
  const exactRows = new Set();
  for (const finding of findings) {
    const origin = finding.origins?.[0];
    const rowAddress = [finding.file, finding.site, finding.key, origin].join('\u0000');
    if (exactRows.has(rowAddress)) {
      throw new Error(`current migration input repeats site/origin ${finding.file} | ${finding.site} | ${finding.key} | ${origin}`);
    }
    exactRows.add(rowAddress);
    const address = exactAddress(finding);
    let site = sites.get(address);
    if (!site) {
      site = {
        file: finding.file,
        line: finding.line,
        pos: finding.pos,
        key: finding.key,
        site: finding.site,
        text: normalizedText(finding.text),
        rows: [],
      };
      sites.set(address, site);
    } else if (site.site !== finding.site || site.line !== finding.line
      || site.text !== normalizedText(finding.text)) {
      throw new Error(`current migration rows disagree at exact site ${finding.file}:${finding.pos}:${finding.key}`);
    }
    site.rows.push(finding);
  }
  for (const site of sites.values()) {
    site.rows.sort((a, b) => a.origins[0].localeCompare(b.origins[0]));
  }
  return sites;
}

function predecessorRowsOf(predecessorBaseline, legacyInventory) {
  const addresses = new Map();
  const add = (file, identity) => {
    const address = predecessorAddress(file, identity);
    if (!addresses.has(address)) addresses.set(address, { file, identity });
  };
  for (const [file, row] of Object.entries(predecessorBaseline.inventory)) {
    for (const identity of Object.keys(row)) add(file, identity);
  }
  for (const [file, row] of Object.entries(legacyInventory)) {
    for (const identity of Object.keys(row)) add(file, identity);
  }
  return [...addresses.values()]
    .sort((a, b) => a.file.localeCompare(b.file) || a.identity.localeCompare(b.identity))
    .map(({ file, identity }) => {
      const predecessorCount = predecessorBaseline.inventory[file]?.[identity] || 0;
      const legacyCount = legacyInventory[file]?.[identity] || 0;
      const reconciliation = predecessorCount === legacyCount
        ? 'same'
        : predecessorCount === 0
          ? 'new'
          : legacyCount === 0
            ? 'gone'
            : legacyCount < predecessorCount ? 'decreased' : 'increased';
      const core = {
        address: { file, identity },
        predecessorCount,
        legacyCount,
        delta: legacyCount - predecessorCount,
        reconciliation,
      };
      return { rowId: `osr-predecessor-row-v1:${digestOf(core)}`, ...core };
    });
}

/**
 * Schema 8 adds an opt-in scalar second consumer; it does not widen or narrow
 * the topology inventory that the heuristic detector freezes. The scanner
 * transition is reviewable, but an inventory motion is not part of this mint:
 * accepting one here would silently turn a corpus-coverage proof into a new
 * topology baseline. Keep both statements executable — identical canonical
 * bytes and a same-only reconciliation — so neither representation can drift
 * away from the other during a later refactor.
 *
 * ⚠⚠ THIS INVARIANT IS SCHEMA 8'S ALONE, AND ITS ABSENCE ELSEWHERE IS DECLARED
 * RATHER THAN FORGOTTEN. Schema 9 deliberately does NOT get one: that mint is
 * cut at a later tip than the one its inventory was measured at, so a landed
 * repair may legitimately move a row, and a hard same-only rule would force the
 * executor to choose between a false claim and an un-mintable instrument.
 * Schema 9 reconciles every non-'same' row through its own reviewed, accepted,
 * noted decision instead — which is strictly more information than this
 * invariant carries, and never a bulk accept.
 */
function assertCorpusCoverageInventoryInvariant(
  predecessor,
  legacyInventory,
  predecessorRows,
  targetSchema,
) {
  if (targetSchema !== CORPUS_COVERAGE_TARGET_SCHEMA) return;
  const motions = predecessorRows.filter((row) => row.reconciliation !== 'same');
  if (canonicalJson(predecessor.inventory) !== canonicalJson(legacyInventory)
    || motions.length !== 0) {
    const counts = Object.fromEntries(
      ['same', 'new', 'increased', 'decreased', 'gone'].map((kind) => [
        kind,
        predecessorRows.filter((row) => row.reconciliation === kind).length,
      ]),
    );
    throw new Error('observed-shape schema-7 to schema-8 migration requires a byte-identical, same-only topology inventory; '
      + `received ${JSON.stringify(counts)}`);
  }
}

function legacyView(finding) {
  if (!finding) return null;
  return {
    line: finding.line,
    shapes: sortedUnique(finding.shapes),
    text: normalizedText(finding.text),
  };
}

function currentView(site) {
  if (!site) return null;
  return {
    line: site.line,
    site: site.site,
    text: site.text,
    origins: site.rows.map((finding) => ({
      origin: finding.origins[0],
      shape: finding.shapes[0],
    })),
  };
}

function rowOf(address, legacy, current) {
  const [file, rawPos, key] = address.split('\u0000');
  const legacyShapes = legacy ? sortedUnique(legacy.shapes) : [];
  const currentShapes = current
    ? sortedUnique(current.rows.map((finding) => finding.shapes[0]))
    : [];
  if (legacy && current && (legacy.line !== current.line
    || normalizedText(legacy.text) !== current.text)) {
    throw new Error(`same-source migration text/line mismatch at ${file}:${rawPos}:${key}`);
  }
  const core = {
    address: { file, pos: Number(rawPos), key },
    legacy: legacyView(legacy),
    current: currentView(current),
    facets: {
      presence: legacy && current ? 'paired' : (legacy ? 'legacy-only' : 'current-only'),
      exactOrigins: !current ? 'none' : (current.rows.length === 1 ? 'single' : 'split'),
      leafShapes: !legacy || !current
        ? 'not-comparable'
        : (equalArrays(legacyShapes, currentShapes) ? 'same' : 'corrected'),
    },
  };
  return { rowId: `osr-migration-row-v1:${digestOf(core)}`, ...core };
}

function assertConservation(report) {
  const c = report.conservation;
  if (c.legacySitesCovered !== c.legacyFindings
    || c.currentSitesCovered !== c.currentSites
    || c.currentFindingsCovered !== c.currentFindings
    || c.paired + c.legacyOnly !== c.legacyFindings
    || c.paired + c.currentOnly !== c.currentSites
    || c.predecessorIdentitiesCovered !== c.predecessorIdentities
    || c.predecessorCountsCovered !== c.predecessorCount
    || c.legacyInventoryIdentitiesCovered !== c.legacyInventoryIdentities
    || c.legacyInventoryCountsCovered !== c.legacyInventoryCount
    || c.legacyInventoryCount !== c.legacyFindings
    || c.predecessorRows !== report.predecessorRows.length) {
    throw new Error(`observed-shape migration conservation failed: ${JSON.stringify(c)}`);
  }
  const allRows = [...report.predecessorRows, ...report.rows];
  const rowIds = new Set(allRows.map((row) => row.rowId));
  if (rowIds.size !== allRows.length) {
    throw new Error('observed-shape migration produced duplicate row IDs');
  }
}

/** Build the canonical report. Both artifacts are validated before any pairing. */
export function migrationReport(
  predecessorBaseline,
  legacyArtifact,
  currentArtifact,
  predecessorBaselineText,
) {
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
  );
  assertArtifactPair(legacyArtifact, currentArtifact);
  const corpusCompatibility = assertPredecessorExecutionCompatibility(predecessor, legacyArtifact);
  const legacySites = legacySitesOf(legacyArtifact.findings);
  const currentSites = currentSitesOf(currentArtifact.findings);
  const addresses = sortedUnique([...legacySites.keys(), ...currentSites.keys()])
    .sort((a, b) => {
      const aa = a.split('\u0000');
      const bb = b.split('\u0000');
      return aa[0].localeCompare(bb[0]) || Number(aa[1]) - Number(bb[1]) || aa[2].localeCompare(bb[2]);
    });
  const rows = addresses.map((address) => rowOf(
    address,
    legacySites.get(address),
    currentSites.get(address),
  ));
  const predecessorRows = predecessorRowsOf(predecessor, legacyArtifact.inventory);
  const count = (facet, value) => rows.filter((row) => row.facets[facet] === value).length;
  const predecessorCount = (value) => predecessorRows
    .filter((row) => row.reconciliation === value).length;
  const legacyInventoryIdentities = Object.values(legacyArtifact.inventory)
    .reduce((n, row) => n + Object.keys(row).length, 0);
  const legacyInventoryCount = Object.values(legacyArtifact.inventory)
    .reduce((n, row) => n + Object.values(row).reduce((sum, value) => sum + value, 0), 0);
  // ⚠⚠ AN ISSUE CARRIES ITS ROW ID BECAUSE AN ISSUE IS DISCHARGEABLE BY REVIEW.
  // The first spelling emitted bare strings, and `validateReviewLedger` threw on
  // any of them BEFORE reading a single decision (the check sat above the
  // decisions loop). That made the review ledger unable to mean what the freeze
  // ruling assumed it meant: a COMPLETE, fully-accepted ledger with a real note on
  // every row still threw while any growth row existed — control-proven, both
  // directions, by the refusal lane. Carrying `rowId` lets the SAME issue be
  // discharged by the SAME row's reviewed decision, and by nothing else.
  const predecessorIssues = predecessorRows
    .filter((row) => row.reconciliation === 'new' || row.reconciliation === 'increased')
    .map((row) => ({
      rowId: row.rowId,
      file: row.address.file,
      identity: row.address.identity,
      reconciliation: row.reconciliation,
      predecessorCount: row.predecessorCount,
      legacyCount: row.legacyCount,
      message: `${row.address.file}: ${JSON.stringify(row.address.identity)} is ${row.reconciliation}`
        + ` against the schema-2 predecessor (${row.predecessorCount} -> ${row.legacyCount})`,
    }));
  const report = {
    reportSchema: MIGRATION_REPORT_SCHEMA,
    kind: RETIRED_EXACT_MIGRATION_KIND,
    inputs: {
      subjectSha: currentArtifact.provenance.subjectSha,
      predecessorBaselineDigest: digestOf(predecessor),
      predecessorBaselineTextSha256,
      predecessorInventoryDigest: digestOf(predecessor.inventory),
      predecessorFrozenAtSha: predecessor.frozenAtSha,
      sourceTreeDigest: currentArtifact.provenance.sourceTreeDigest,
      scanTreeDigest: currentArtifact.scanTree.digest,
      detectorTreeDigest: currentArtifact.detectorTree.digest,
      executionTreeDigest: currentArtifact.executionTree.digest,
      corpusDigest: currentArtifact.digests.corpus,
      scanConfigDigest: digestOf(currentArtifact.scanConfig),
      legacyArtifactDigest: digestOf(legacyArtifact),
      legacyAlgorithm: legacyArtifact.legacyAlgorithm,
      legacyAlgorithmDigest: digestOf(legacyArtifact.legacyAlgorithm),
      currentArtifactDigest: digestOf(currentArtifact),
      legacyFindingsDigest: legacyArtifact.digests.findings,
      currentFindingsDigest: currentArtifact.digests.findings,
      legacyScannerSha: legacyArtifact.provenance.scannerSha,
      legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
      legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
      currentScannerSha: currentArtifact.provenance.scannerSha,
      currentDetectorDigest: currentArtifact.provenance.detectorDigest,
      currentScannerToolDigest: currentArtifact.provenance.scannerToolDigest,
    },
    target: {
      baselineSchema: RETIRED_EXACT_TARGET_SCHEMA,
      inventoryDigest: currentArtifact.digests.inventory,
      findingsDigest: currentArtifact.digests.findings,
    },
    predecessorRows,
    rows,
    summary: {
      paired: count('presence', 'paired'),
      legacyOnly: count('presence', 'legacy-only'),
      currentOnly: count('presence', 'current-only'),
      singleOrigin: count('exactOrigins', 'single'),
      splitOrigin: count('exactOrigins', 'split'),
      sameLeafShape: count('leafShapes', 'same'),
      correctedLeafShape: count('leafShapes', 'corrected'),
      predecessorSame: predecessorCount('same'),
      predecessorDecreased: predecessorCount('decreased'),
      predecessorGone: predecessorCount('gone'),
      predecessorIncreased: predecessorCount('increased'),
      predecessorNew: predecessorCount('new'),
    },
    conservation: {
      predecessorIdentities: predecessor.identities,
      predecessorCount: predecessor.total,
      legacyInventoryIdentities,
      legacyInventoryCount,
      predecessorRows: predecessorRows.length,
      predecessorIdentitiesCovered: predecessorRows
        .filter((row) => row.predecessorCount > 0).length,
      predecessorCountsCovered: predecessorRows
        .reduce((n, row) => n + row.predecessorCount, 0),
      legacyInventoryIdentitiesCovered: predecessorRows
        .filter((row) => row.legacyCount > 0).length,
      legacyInventoryCountsCovered: predecessorRows
        .reduce((n, row) => n + row.legacyCount, 0),
      legacyFindings: legacyArtifact.findings.length,
      currentFindings: currentArtifact.findings.length,
      currentSites: currentSites.size,
      legacySitesCovered: rows.filter((row) => row.legacy).length,
      currentSitesCovered: rows.filter((row) => row.current).length,
      currentFindingsCovered: rows.reduce((n, row) => n + (row.current?.origins.length || 0), 0),
      paired: count('presence', 'paired'),
      legacyOnly: count('presence', 'legacy-only'),
      currentOnly: count('presence', 'current-only'),
    },
    corpusCompatibility,
    issues: predecessorIssues,
  };
  assertConservation(report);
  return report;
}

export function migrationReportDigest(report) {
  return digestOf(report);
}

export function validateMigrationReport(
  report,
  predecessorBaseline,
  legacyArtifact,
  currentArtifact,
  predecessorBaselineText,
) {
  const expected = migrationReport(
    predecessorBaseline,
    legacyArtifact,
    currentArtifact,
    predecessorBaselineText,
  );
  if (canonicalJson(report) !== canonicalJson(expected)) {
    throw new Error('observed-shape migration report is not the canonical report for its bound inputs');
  }
  assertConservation(report);
  return report;
}

/* ══ SCHEMA 2 -> 4 — THE LIVE HEURISTIC MIGRATION ══════════════════════════ */

/**
 * ⚠⚠ THE SCHEMA-4 REPORT CARRIES NO SITE-MIGRATION ROWS, AND THAT IS THE WHOLE
 * SHAPE OF THE ARGUMENT — not an omission.
 *
 * `rows` exists in the retired 2->3 report because that migration RE-SPELLS every
 * finding: a legacy leaf identity becomes an exact per-site identity, so each
 * pairing is a fresh claim a reviewer has to accept. Schema 4 does not re-spell
 * anything. The target inventory IS the heuristic artifact's own inventory, in
 * the SAME alphabet the schema-2 predecessor is written in, so the only thing
 * that moved is which reads the detector found — which is exactly what
 * `predecessorRows` reconciles, row by row, with `new`/`increased` rows raised as
 * `issues` that a reviewed decision must discharge.
 *
 * `assertHeuristicConservation` therefore PINS `rows.length === 0` rather than
 * leaving it implied: an empty array that nobody asserts is empty is one refactor
 * away from becoming an unreviewed row set, and `validateReviewLedger` derives
 * its expected row list from `predecessorRows.concat(rows)`.
 */
function assertHeuristicConservation(report) {
  const c = report.conservation;
  if (report.rows.length !== 0) {
    throw new Error(`observed-shape heuristic migration carries site-migration rows; the schema-${report.target?.baselineSchema} target is`
      + ' the heuristic inventory itself and has no cross-detector pairing to review');
  }
  if (c.predecessorIdentitiesCovered !== c.predecessorIdentities
    || c.predecessorCountsCovered !== c.predecessorCount
    || c.legacyInventoryIdentitiesCovered !== c.legacyInventoryIdentities
    || c.legacyInventoryCountsCovered !== c.legacyInventoryCount
    || c.legacyInventoryCount !== c.legacyFindings
    || c.targetIdentities !== c.legacyInventoryIdentities
    || c.targetCount !== c.legacyInventoryCount
    || c.predecessorRows !== report.predecessorRows.length) {
    throw new Error(`observed-shape heuristic migration conservation failed: ${JSON.stringify(c)}`);
  }
  const governedRows = [
    ...report.predecessorRows,
    ...(report.scannerTransition
      ? [{ rowId: scannerTransitionRowIdOf(report.scannerTransition) }]
      : []),
  ];
  const rowIds = new Set(governedRows.map((row) => row.rowId));
  if (rowIds.size !== governedRows.length) {
    throw new Error('observed-shape migration produced duplicate row IDs');
  }
}

/** Build the canonical leaf migration report — retired 2→4 through 6→7, or
 *  live 7→8 — chosen by required `targetSchema` so no caller can fall into the
 *  wrong rung by omission. ONE artifact is validated before reconciliation. */
export function heuristicMigrationReport(
  predecessorBaseline,
  legacyArtifact,
  predecessorBaselineText,
  targetSchema,
) {
  const predecessorSchema = LEAF_MIGRATION_PREDECESSOR[targetSchema];
  if (predecessorSchema === undefined) {
    throw new Error(`observed-shape leaf migration target must be ${Object.keys(LEAF_MIGRATION_PREDECESSOR).join(' or ')};`
      + ` received ${JSON.stringify(targetSchema)}`);
  }
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
    predecessorSchema,
  );
  assertGovernedLegacyArtifact(legacyArtifact);
  const corpusCompatibility = assertPredecessorExecutionCompatibility(predecessor, legacyArtifact);
  const scannerTransition = SCANNER_TRANSITION_BY_TARGET.has(targetSchema)
    ? governedScannerTransitionOf(predecessor, legacyArtifact, targetSchema)
    : null;
  const predecessorRows = predecessorRowsOf(predecessor, legacyArtifact.inventory);
  assertCorpusCoverageInventoryInvariant(
    predecessor,
    legacyArtifact.inventory,
    predecessorRows,
    targetSchema,
  );
  const predecessorCount = (value) => predecessorRows
    .filter((row) => row.reconciliation === value).length;
  const legacyInventoryIdentities = Object.values(legacyArtifact.inventory)
    .reduce((n, row) => n + Object.keys(row).length, 0);
  const legacyInventoryCount = Object.values(legacyArtifact.inventory)
    .reduce((n, row) => n + Object.values(row).reduce((sum, value) => sum + value, 0), 0);
  const artifactDigest = digestOf(legacyArtifact);
  // An issue carries its row id because an issue is DISCHARGEABLE BY REVIEW —
  // see the identical note on the retired path; the mechanism is shared because
  // the ledger it feeds is shared.
  const predecessorIssues = predecessorRows
    .filter((row) => row.reconciliation === 'new' || row.reconciliation === 'increased')
    .map((row) => ({
      rowId: row.rowId,
      file: row.address.file,
      identity: row.address.identity,
      reconciliation: row.reconciliation,
      predecessorCount: row.predecessorCount,
      legacyCount: row.legacyCount,
      message: `${row.address.file}: ${JSON.stringify(row.address.identity)} is ${row.reconciliation}`
        + ` against the schema-${predecessorSchema} predecessor (${row.predecessorCount} -> ${row.legacyCount})`,
    }));
  const report = {
    reportSchema: MIGRATION_REPORT_SCHEMA,
    kind: leafMigrationKindOf(targetSchema),
    inputs: {
      subjectSha: legacyArtifact.provenance.subjectSha,
      predecessorBaselineDigest: digestOf(predecessor),
      predecessorBaselineTextSha256,
      predecessorInventoryDigest: digestOf(predecessor.inventory),
      predecessorFrozenAtSha: predecessor.frozenAtSha,
      sourceTreeDigest: legacyArtifact.provenance.sourceTreeDigest,
      scanTreeDigest: legacyArtifact.scanTree.digest,
      detectorTreeDigest: legacyArtifact.detectorTree.digest,
      executionTreeDigest: legacyArtifact.executionTree.digest,
      corpusDigest: legacyArtifact.digests.corpus,
      scanConfigDigest: digestOf(legacyArtifact.scanConfig),
      legacyArtifactDigest: artifactDigest,
      legacyAlgorithm: legacyArtifact.legacyAlgorithm,
      legacyAlgorithmDigest: digestOf(legacyArtifact.legacyAlgorithm),
      // ⭐ current* === legacy* THROUGHOUT. Schema 4 has one detector, and the
      // receipt says so in every field rather than leaving "current" undefined —
      // an absent binding cannot be checked, an equal one can.
      currentArtifactDigest: artifactDigest,
      legacyFindingsDigest: legacyArtifact.digests.findings,
      currentFindingsDigest: legacyArtifact.digests.findings,
      legacyScannerSha: legacyArtifact.provenance.scannerSha,
      legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
      legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
      currentScannerSha: legacyArtifact.provenance.scannerSha,
      currentDetectorDigest: legacyArtifact.provenance.detectorDigest,
      currentScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
      ...(scannerTransition ? { scannerTransitionDigest: digestOf(scannerTransition) } : {}),
    },
    target: {
      baselineSchema: targetSchema,
      inventoryDigest: legacyArtifact.digests.inventory,
      findingsDigest: legacyArtifact.digests.findings,
    },
    predecessorRows,
    rows: [],
    summary: {
      predecessorSame: predecessorCount('same'),
      predecessorDecreased: predecessorCount('decreased'),
      predecessorGone: predecessorCount('gone'),
      predecessorIncreased: predecessorCount('increased'),
      predecessorNew: predecessorCount('new'),
    },
    conservation: {
      predecessorIdentities: predecessor.identities,
      predecessorCount: predecessor.total,
      legacyInventoryIdentities,
      legacyInventoryCount,
      targetIdentities: legacyInventoryIdentities,
      targetCount: legacyInventoryCount,
      predecessorRows: predecessorRows.length,
      predecessorIdentitiesCovered: predecessorRows
        .filter((row) => row.predecessorCount > 0).length,
      predecessorCountsCovered: predecessorRows
        .reduce((n, row) => n + row.predecessorCount, 0),
      legacyInventoryIdentitiesCovered: predecessorRows
        .filter((row) => row.legacyCount > 0).length,
      legacyInventoryCountsCovered: predecessorRows
        .reduce((n, row) => n + row.legacyCount, 0),
      legacyFindings: legacyArtifact.findings.length,
    },
    corpusCompatibility,
    ...(scannerTransition ? { scannerTransition } : {}),
    issues: [
      ...predecessorIssues,
      ...(scannerTransition ? [{
        rowId: scannerTransitionRowIdOf(scannerTransition),
        reconciliation: 'scanner-transition',
        modifiedPaths: scannerTransition.modifiedPaths,
        ...(scannerTransition.unscannedMovement
          ? { unscannedPaths: scannerTransition.unscannedMovement.changedPaths }
          : {}),
        message: `schema-${predecessorSchema} to schema-${targetSchema} governed scanner transition requires one accepted review decision: `
          + scannerTransition.modifiedPaths.join(', ')
          + (scannerTransition.unscannedMovement
            ? '; UNSCANNED governed source inputs moved and are RECORDED for the same decision: '
              + scannerTransition.unscannedMovement.changedPaths.join(', ')
            : ''),
      }] : []),
    ],
  };
  assertHeuristicConservation(report);
  return report;
}

export function validateHeuristicMigrationReport(
  report,
  predecessorBaseline,
  legacyArtifact,
  predecessorBaselineText,
  targetSchema,
) {
  const expected = heuristicMigrationReport(
    predecessorBaseline,
    legacyArtifact,
    predecessorBaselineText,
    targetSchema,
  );
  if (canonicalJson(report) !== canonicalJson(expected)) {
    throw new Error('observed-shape migration report is not the canonical report for its bound inputs');
  }
  assertHeuristicConservation(report);
  return report;
}

/** The schema-4 authorization. Same receipt KEY SET as the retired path so the
 *  baseline envelope needs no new shape; every `current*` field is bound to the
 *  one governed heuristic artifact. */
function validateGovernedHeuristicMigration({
  predecessorBaseline,
  predecessorBaselineText,
  legacyArtifact,
  currentArtifact,
  report,
  review,
  targetSchema,
}) {
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
    LEAF_MIGRATION_PREDECESSOR[targetSchema],
  );
  // ⛔ A leaf bundle that carries a DIFFERENT "current" artifact is refused
  // outright rather than quietly ignored: the bundle keeps both fields so the
  // consumer needs no branch, and this is what stops that convenience from
  // becoming a hole through which an unreviewed second artifact travels.
  if (currentArtifact !== undefined
    && canonicalJson(currentArtifact) !== canonicalJson(legacyArtifact)) {
    throw new Error(`observed-shape schema-${targetSchema} migration bundle carries a current artifact that is not`
      + ' the governed heuristic artifact itself');
  }
  validateHeuristicMigrationReport(
    report,
    predecessor,
    legacyArtifact,
    predecessorBaselineText,
    targetSchema,
  );
  return {
    ...validateReviewLedger(review, report),
    predecessorBaselineDigest: digestOf(predecessor),
    predecessorBaselineTextSha256,
    predecessorInventoryDigest: digestOf(predecessor.inventory),
    legacyArtifactDigest: report.inputs.legacyArtifactDigest,
    currentArtifactDigest: report.inputs.currentArtifactDigest,
    legacyScannerSha: legacyArtifact.provenance.scannerSha,
    legacyAlgorithmBaseSha: legacyArtifact.legacyAlgorithm.baseSha,
    legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
    legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
    currentFindingsDigest: legacyArtifact.digests.findings,
    currentScannerSha: legacyArtifact.provenance.scannerSha,
    currentDetectorDigest: legacyArtifact.provenance.detectorDigest,
    currentScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
  };
}

export function reviewTemplateOf(report) {
  if (!report || report.reportSchema !== MIGRATION_REPORT_SCHEMA
    || !Array.isArray(report.predecessorRows) || !Array.isArray(report.rows)) {
    throw new Error('cannot create a review template for a malformed migration report');
  }
  return {
    reviewSchema: MIGRATION_REVIEW_SCHEMA,
    kind: 'observed-shape-migration-review',
    bindings: {
      reportDigest: migrationReportDigest(report),
      subjectSha: report.inputs.subjectSha,
      predecessorBaselineDigest: report.inputs.predecessorBaselineDigest,
      predecessorBaselineTextSha256: report.inputs.predecessorBaselineTextSha256,
      predecessorInventoryDigest: report.inputs.predecessorInventoryDigest,
      sourceTreeDigest: report.inputs.sourceTreeDigest,
      scanTreeDigest: report.inputs.scanTreeDigest,
      detectorTreeDigest: report.inputs.detectorTreeDigest,
      executionTreeDigest: report.inputs.executionTreeDigest,
      corpusDigest: report.inputs.corpusDigest,
      scanConfigDigest: report.inputs.scanConfigDigest,
      targetInventoryDigest: report.target.inventoryDigest,
      ...(report.scannerTransition
        ? { scannerTransitionDigest: report.inputs.scannerTransitionDigest }
        : {}),
    },
    decisions: [
      ...report.predecessorRows.map((row) => ({
        rowId: row.rowId,
        subject: 'predecessor-reconciliation',
        decision: 'pending',
        note: '',
      })),
      ...report.rows.map((row) => ({
        rowId: row.rowId,
        subject: 'site-migration',
        decision: 'pending',
        note: '',
      })),
      ...(report.scannerTransition ? [{
        rowId: scannerTransitionRowIdOf(report.scannerTransition),
        subject: 'scanner-transition',
        decision: 'pending',
        note: '',
      }] : []),
    ],
  };
}

export function validateReviewLedger(review, report) {
  if (!review || review.reviewSchema !== MIGRATION_REVIEW_SCHEMA
    || review.kind !== 'observed-shape-migration-review') {
    throw new Error('observed-shape migration review has an unsupported schema');
  }
  const expectedBindings = reviewTemplateOf(report).bindings;
  if (canonicalJson(review.bindings) !== canonicalJson(expectedBindings)) {
    throw new Error('observed-shape migration review is not bound to this report and target inventory');
  }
  if (!Array.isArray(review.decisions)) throw new Error('observed-shape migration review decisions are missing');
  const expectedRows = [
    ...report.predecessorRows.map((row) => [row.rowId, 'predecessor-reconciliation']),
    ...report.rows.map((row) => [row.rowId, 'site-migration']),
    ...(report.scannerTransition
      ? [[scannerTransitionRowIdOf(report.scannerTransition), 'scanner-transition']]
      : []),
  ];
  const expectedIds = new Map(expectedRows);
  const seen = new Set();
  for (const decision of review.decisions) {
    if (!decision || !expectedIds.has(decision.rowId)) {
      throw new Error(`observed-shape migration review contains an unknown row: ${JSON.stringify(decision?.rowId)}`);
    }
    if (seen.has(decision.rowId)) throw new Error(`observed-shape migration review repeats ${decision.rowId}`);
    seen.add(decision.rowId);
    if (decision.subject !== expectedIds.get(decision.rowId)) {
      throw new Error(`observed-shape migration row ${decision.rowId} has the wrong review subject`);
    }
    if (decision.decision !== 'accept') {
      throw new Error(`observed-shape migration row ${decision.rowId} is ${JSON.stringify(decision.decision)}, not accepted`);
    }
    if (typeof decision.note !== 'string' || !decision.note.trim()) {
      throw new Error(`observed-shape migration row ${decision.rowId} lacks a review note`);
    }
  }
  const missing = [...expectedIds.keys()].filter((rowId) => !seen.has(rowId));
  if (missing.length) throw new Error(`observed-shape migration review is missing ${missing.length} row(s)`);

  // ⚠⚠ THE ISSUE GATE RUNS *AFTER* THE DECISIONS, AND THAT ORDER IS THE FIX.
  // `issues` used to mean "the reconciliation is not CLEAN"; it now means "the
  // reconciliation is not REVIEWED". Say that out loud rather than let a later
  // reader conclude the gate weakened by accident: it did not weaken, it moved
  // its authority from a mechanical filter over the reconciliation to the
  // reviewed disposition of the SAME rows. Every growth row must still be
  // dispositioned by an ACCEPTED decision carrying a note; an issue whose row is
  // missing, pending, or rejected still FAILS CLOSED here — and the loop above
  // has already refused any decision that is not `accept` with a real note, so
  // reaching this line at all means every enumerated row was reviewed.
  const accepted = new Set(review.decisions
    .filter((decision) => decision.decision === 'accept')
    .map((decision) => decision.rowId));
  const undispositioned = (report.issues || []).filter((issue) => !accepted.has(issue?.rowId));
  if (undispositioned.length) {
    throw new Error('observed-shape migration report has unresolved issues: '
      + undispositioned.map((issue) => issue?.message || JSON.stringify(issue)).join('; '));
  }
  return {
    reportDigest: expectedBindings.reportDigest,
    reviewDigest: digestOf(review),
    subjectSha: expectedBindings.subjectSha,
    predecessorBaselineDigest: expectedBindings.predecessorBaselineDigest,
    predecessorBaselineTextSha256: expectedBindings.predecessorBaselineTextSha256,
    predecessorInventoryDigest: expectedBindings.predecessorInventoryDigest,
    sourceTreeDigest: expectedBindings.sourceTreeDigest,
    scanTreeDigest: expectedBindings.scanTreeDigest,
    detectorTreeDigest: expectedBindings.detectorTreeDigest,
    executionTreeDigest: expectedBindings.executionTreeDigest,
    corpusDigest: expectedBindings.corpusDigest,
    scanConfigDigest: expectedBindings.scanConfigDigest,
    targetInventoryDigest: expectedBindings.targetInventoryDigest,
  };
}

/**
 * The check gate consumes this authorization before writing a governed baseline.
 *
 * ⚠ THE TARGET SCHEMA IS READ FROM THE REPORT, NEVER FROM A FLAG THE CALLER
 * PASSES. The report is the digest-bound artifact; a caller-supplied target
 * would be the one input in this whole chain nothing content-addresses, and it
 * would decide which validator runs.
 */
export function validateGovernedMigration({
  predecessorBaseline,
  predecessorBaselineText,
  legacyArtifact,
  currentArtifact,
  report,
  review,
}) {
  if (LEAF_MIGRATION_PREDECESSOR[report?.target?.baselineSchema] !== undefined) {
    return validateGovernedHeuristicMigration({
      predecessorBaseline,
      predecessorBaselineText,
      legacyArtifact,
      currentArtifact,
      report,
      review,
      targetSchema: report.target.baselineSchema,
    });
  }
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
  );
  validateMigrationReport(
    report,
    predecessor,
    legacyArtifact,
    currentArtifact,
    predecessorBaselineText,
  );
  return {
    ...validateReviewLedger(review, report),
    predecessorBaselineDigest: digestOf(predecessor),
    predecessorBaselineTextSha256,
    predecessorInventoryDigest: digestOf(predecessor.inventory),
    legacyArtifactDigest: report.inputs.legacyArtifactDigest,
    currentArtifactDigest: report.inputs.currentArtifactDigest,
    legacyScannerSha: legacyArtifact.provenance.scannerSha,
    legacyAlgorithmBaseSha: legacyArtifact.legacyAlgorithm.baseSha,
    legacyDetectorDigest: legacyArtifact.provenance.detectorDigest,
    legacyScannerToolDigest: legacyArtifact.provenance.scannerToolDigest,
    currentFindingsDigest: currentArtifact.digests.findings,
    currentScannerSha: currentArtifact.provenance.scannerSha,
    currentDetectorDigest: currentArtifact.provenance.detectorDigest,
    currentScannerToolDigest: currentArtifact.provenance.scannerToolDigest,
  };
}

/** One self-contained file is the only migration authority the freeze gate accepts. */
export function migrationBundleOf({
  predecessorBaseline,
  predecessorBaselineText,
  legacyArtifact,
  currentArtifact,
  report,
  review,
}) {
  const { predecessor, predecessorBaselineTextSha256 } = predecessorInputOf(
    predecessorBaseline,
    predecessorBaselineText,
    LEAF_MIGRATION_PREDECESSOR[report?.target?.baselineSchema] ?? 2,
  );
  validateGovernedMigration({
    predecessorBaseline: predecessor,
    predecessorBaselineText,
    legacyArtifact,
    currentArtifact,
    report,
    review,
  });
  const payload = {
    predecessorBaseline: predecessor,
    predecessorBaselineText,
    predecessorBaselineTextSha256,
    legacyArtifact,
    currentArtifact,
    report,
    review,
  };
  return {
    bundleSchema: MIGRATION_BUNDLE_SCHEMA,
    kind: 'observed-shape-migration-review-bundle',
    bundleDigest: digestOf(payload),
    ...payload,
  };
}

export function validateMigrationBundle(bundle) {
  if (!bundle || bundle.bundleSchema !== MIGRATION_BUNDLE_SCHEMA
    || bundle.kind !== 'observed-shape-migration-review-bundle'
    || bundle.bundleDigest !== digestOf({
      predecessorBaseline: bundle.predecessorBaseline,
      predecessorBaselineText: bundle.predecessorBaselineText,
      predecessorBaselineTextSha256: bundle.predecessorBaselineTextSha256,
      legacyArtifact: bundle.legacyArtifact,
      currentArtifact: bundle.currentArtifact,
      report: bundle.report,
      review: bundle.review,
    })) {
    throw new Error('observed-shape migration review bundle has an unsupported schema');
  }
  const authorization = validateGovernedMigration(bundle);
  if (bundle.predecessorBaselineTextSha256 !== authorization.predecessorBaselineTextSha256) {
    throw new Error('observed-shape migration bundle predecessor text digest mismatch');
  }
  return { ...authorization, bundleDigest: bundle.bundleDigest };
}

export function run(argv = process.argv.slice(2)) {
  const command = parseExactFlags(argv, {
    '--predecessor': { kind: 'value', name: 'predecessorPath' },
    '--legacy': { kind: 'value', name: 'legacyPath' },
    '--current': { kind: 'value', name: 'currentPath' },
    '--target-schema': { kind: 'value', name: 'targetSchema' },
    '--json': { kind: 'value', name: 'jsonPath' },
    '--review-template': { kind: 'value', name: 'templatePath' },
    '--review': { kind: 'value', name: 'reviewPath' },
    '--bundle': { kind: 'value', name: 'bundlePath' },
  });
  const { predecessorPath, legacyPath, currentPath } = command;
  // The target is DERIVED FROM THE INPUTS unless stated: an exact `--current`
  // artifact can only mean the retired 2->3 pairing, and its absence can only
  // mean the LIVE leaf re-freeze. `--target-schema` makes it explicit and turns
  // any mismatch into a refusal rather than a silent mode switch.
  const targetSchema = command.targetSchema
    ? Number(command.targetSchema)
    : (currentPath ? RETIRED_EXACT_TARGET_SCHEMA : DOMAIN_READER_TARGET_SCHEMA);
  if (![RETIRED_EXACT_TARGET_SCHEMA, HEURISTIC_TARGET_SCHEMA, FILTERED_TARGET_SCHEMA,
    SURFACE_FILTERED_TARGET_SCHEMA, BANKED_EXPLAINED_WRITER_TARGET_SCHEMA,
    CORPUS_COVERAGE_TARGET_SCHEMA, EPOCH_DARK_CORPUS_TARGET_SCHEMA,
    PROSE_REGEN_TARGET_SCHEMA, TREASURY_ADMISSION_TARGET_SCHEMA,
    GENESIS_TIES_TARGET_SCHEMA, DEAD_DEPENDENCY_TARGET_SCHEMA,
    PRESET_LIGHT_TARGET_SCHEMA, STABLE_CORE_TARGET_SCHEMA,
    COMPANION_GATE_TARGET_SCHEMA, STRESS_TOPOLOGY_TARGET_SCHEMA,
    LINEAGE_REANCHOR_TARGET_SCHEMA, EXEMPTION_RETIREMENT_TARGET_SCHEMA,
    BANK_FENCE_TARGET_SCHEMA, RELATIONSHIPS_MOUNT_TARGET_SCHEMA,
    DOMAIN_READER_TARGET_SCHEMA].includes(targetSchema)) {
    throw new Error(`observed-shape --target-schema must be ${DOMAIN_READER_TARGET_SCHEMA} (live domain-reader leaf),`
      + ` ${RELATIONSHIPS_MOUNT_TARGET_SCHEMA} (retired relationships-mount leaf),`
      + ` ${BANK_FENCE_TARGET_SCHEMA} (retired bank-fence leaf),`
      + ` ${EXEMPTION_RETIREMENT_TARGET_SCHEMA} (retired exemption-retirement leaf),`
      + ` ${LINEAGE_REANCHOR_TARGET_SCHEMA} (retired lineage-reanchor leaf),`
      + ` ${STRESS_TOPOLOGY_TARGET_SCHEMA} (retired stress-topology leaf),`
      + ` ${COMPANION_GATE_TARGET_SCHEMA} (retired companion-gate leaf),`
      + ` ${STABLE_CORE_TARGET_SCHEMA} (retired stable-core leaf),`
      + ` ${PRESET_LIGHT_TARGET_SCHEMA} (retired preset-light leaf),`
      + ` ${DEAD_DEPENDENCY_TARGET_SCHEMA} (retired dead-dependency leaf),`
      + ` ${GENESIS_TIES_TARGET_SCHEMA} (retired genesis-ties leaf),`
      + ` ${TREASURY_ADMISSION_TARGET_SCHEMA} (retired treasury-admission leaf),`
      + ` ${PROSE_REGEN_TARGET_SCHEMA} (retired prose-regen leaf),`
      + ` ${EPOCH_DARK_CORPUS_TARGET_SCHEMA} (retired epoch-dark leaf),`
      + ` ${CORPUS_COVERAGE_TARGET_SCHEMA} (retired corpus-coverage leaf),`
      + ` ${BANKED_EXPLAINED_WRITER_TARGET_SCHEMA} (retired banked explained-writer leaf),`
      + ` ${SURFACE_FILTERED_TARGET_SCHEMA} (retired surface-filtered leaf),`
      + ` ${FILTERED_TARGET_SCHEMA} (retired M6/M8-only filtered leaf),`
      + ` ${HEURISTIC_TARGET_SCHEMA} (retired unfiltered leaf)`
      + ` or ${RETIRED_EXACT_TARGET_SCHEMA} (retired exact); received ${JSON.stringify(command.targetSchema)}`);
  }
  const heuristicTarget = LEAF_MIGRATION_PREDECESSOR[targetSchema] !== undefined;
  if (!predecessorPath || !legacyPath || (!heuristicTarget && !currentPath)) {
    throw new Error('usage: migrate-observed-shape-readers.mjs --predecessor=<predecessor-baseline.json> --legacy=<legacy-artifact.json> [--target-schema=10] [--current=<exact-artifact.json> --target-schema=3] [--json=<report.json>] [--review-template=<review.json>] [--review=<completed-review.json> --bundle=<governed-review.json>]');
  }
  if (heuristicTarget && currentPath) {
    throw new Error(`observed-shape --current is only valid for the retired --target-schema=${RETIRED_EXACT_TARGET_SCHEMA} pairing;`
      + ` the schema-${targetSchema} target IS the governed heuristic artifact`);
  }
  if (command.bundlePath && !command.reviewPath) {
    throw new Error('--bundle requires a completed --review ledger');
  }
  if (command.templatePath && command.reviewPath) {
    throw new Error('--review-template and --review are conflicting phases');
  }
  const outputEntries = [
    ['json', command.jsonPath],
    ['template', command.templatePath],
    ['bundle', command.bundlePath],
  ].filter(([, path]) => path);
  const plans = outputEntries.length ? planExternalArtifactOutputs({
    root: ROOT,
    outputs: outputEntries.map(([, path]) => path),
    inputs: [
      predecessorPath,
      legacyPath,
      ...(currentPath ? [currentPath] : []),
      ...(command.reviewPath ? [command.reviewPath] : []),
    ],
  }) : [];
  const planByName = new Map(outputEntries.map(([name], index) => [name, plans[index]]));
  const predecessorBaselineText = readFileSync(predecessorPath, 'utf8');
  const predecessorBaseline = JSON.parse(predecessorBaselineText);
  const legacy = JSON.parse(readFileSync(legacyPath, 'utf8'));
  // Under the heuristic target the governed heuristic artifact IS the current
  // authority, so it fills both roles rather than a second artifact being read.
  const current = currentPath ? JSON.parse(readFileSync(currentPath, 'utf8')) : legacy;
  const report = heuristicTarget
    ? heuristicMigrationReport(predecessorBaseline, legacy, predecessorBaselineText, targetSchema)
    : migrationReport(predecessorBaseline, legacy, current, predecessorBaselineText);
  const template = command.templatePath ? reviewTemplateOf(report) : null;
  const review = command.reviewPath
    ? JSON.parse(readFileSync(command.reviewPath, 'utf8'))
    : null;
  if (review) validateReviewLedger(review, report);
  let governedBundle = null;
  if (command.bundlePath) {
    governedBundle = migrationBundleOf({
      predecessorBaseline,
      predecessorBaselineText,
      legacyArtifact: legacy,
      currentArtifact: current,
      report,
      review,
    });
  }
  if (command.jsonPath) publishJsonExclusive(planByName.get('json'), report, {
    stringify: (value) => canonicalJson(value, 2),
  });
  if (command.templatePath) publishJsonExclusive(planByName.get('template'), template, {
    stringify: (value) => canonicalJson(value, 2),
  });
  if (command.bundlePath) {
    publishJsonExclusive(planByName.get('bundle'), governedBundle, {
      stringify: (value) => canonicalJson(value, 2),
    });
  }
  console.log(canonicalJson(report.summary, 2));
  return report;
}

const invokedDirectly = process.argv[1]
  && relative(process.argv[1], fileURLToPath(import.meta.url)) === '';
if (invokedDirectly) run();
