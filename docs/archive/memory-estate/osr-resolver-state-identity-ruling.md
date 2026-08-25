---
name: osr-resolver-state-identity-ruling
description: "⭐⭐ OSR SCANNER RULING (Fable chair, 2026-08-09; LANDED in F-SURVEY-1 @ 2340497d, repair lane DISPATCHED same day): the four semantic mechanisms are RATIFIED (call-chain no-repeat→'many' closure; fail-closed invocation-owned receiver proof; relevant-flow projection; demand-key refinement); the repair is AUTHORIZED along ONE canonical dependency-state identity — projected relevant-owner cutoffs × interned frame-cell REFERENCES with version-stamp invalidation × multiplicity — superseding the prior 'no more analyzer variant' clause; ⚠⚠ no cache key may embed monotone approximation CONTENTS, and unknown observability projects to the FULL map (fail-closed)"
metadata:
  type: project
  date: 2026-08-09
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T15:45:20.635Z
---

2026-08-09, Fable chair session. Basis: a Fable recon mechanism map of
`scripts/lib/reader-shape-scan.mjs` (8,171 lines; buildIndex 574-2071, makeResolver
2084-7828) executed against the live tree, plus the S12-OSR-FP queue rows.

## The four re-rulings the queue tail requested — all RATIFIED

1. **Call-chain identity** — finite no-repeat static call chains, repeated sites close to
   multiplicity `many`. Three independent spellings implement it (`contextualArrayProducer`
   ~:3267, `instantiateSymbolic` local arm ~:6722 `repeatsStaticCall`,
   `qualifyRecursiveCallReturns` ~:7020). RATIFIED as law; the triple spelling is a
   one-home-law hazard — the authorized repair consolidates to one helper, pinning each
   former call site.
2. **Invocation-owned receiver proof** (`invocationOwnsReceiverForTarget` ~:3829) —
   fail-closed: parameters, captures, aliases, logical transfers, unproven calls all refuse;
   only same-owner lexical receivers with every identity source fresh in that invocation
   qualify. RATIFIED; any repair must keep the exact-receiver fallback (~:4139-4170)
   reachable.
3. **Relevant-flow-context projection** (`flowContextIdsForSource` ~:3103, stepCount-based
   invalidation) — RATIFIED, and it is the PRECEDENT the unified identity generalizes.
4. **Demand-key refinement** (heap-demand memo ~:3998; `Object.keys` key-domain narrowing
   ~:3961-3982) — semantics RATIFIED. The FULL cutoff signature + FULL effect-chain in the
   key is part of the performance disease; re-keying to projected identities is authorized
   PROVIDED the pinned risks below stay green.

## The disease, in one sentence

Chains/views use a finite lattice; cutoff-dependent state (function versions ~:5458,
binding versions ~:5739, local records `:c<id>` ~:2745, heap demands ~:3998) keys on RAW
COMPLETE cutoff maps; frames have either NO cache identity (four `cacheable =
sentinelFrames.size === 0` guards disable binding/param caches whenever any frame is
installed) or TOTAL-STATE identity (context keys serializing full frame contents, rotated
by every monotone growth). The blocked read (`SettlementsPanel.jsx:359`,
`updatedSaves.filter(...).map(s => s.id)` element receiver via the 959-line
`factionRename.js`) dies of RECOMPUTATION WITHOUT GROWTH, which no budget meters (budgets
count growth steps/tokens only).

Why the two rejected prototypes failed: **P1** (framed-binding cache) embedded monotone
token-set CONTENTS in its keys — every growth rotates the key, hit rate collapses exactly
on growing reads. **P2** (cutoff-independent summary sharing) collapsed the cutoff
dimension (543→13 summaries) while frames stayed uncached — instantiated tokens re-entered
frame-disabled binding resolution, 9,385 → 221,472 binding starts. Collapsing one dimension
without an identity for the other moves the product.

## The AUTHORIZED repair (chair ruling, vetoable; supersedes the prior continuation's
## "no more analyzer variant" clause, which bound only that continuation)

ONE canonical dependency-state identity for all cached resolver facts:

    DependencyState(subject) = Π_{owner ∈ Relevant(subject)} CutoffBand(owner)
                             × Π_{param ∈ Consulted(subject)} FrameCellRef(param)
                             × Multiplicity{one, many}

- **Relevance projection generalized from flow tokens to functions/bindings**:
  Relevant(fn) = owners of writes on free mutable bindings transitively read by its
  returns + owners of heap effects on locals it allocates (the write-occurrence census
  `bindingVersionOf` already computes). `functionVersionOf` keys on the PROJECTED map.
  Pure helper ⇒ ⊥ ⇒ exactly one version (P2's win, per-owner and fail-closed).
- **Frames as interned REFERENCES, never contents**: key framed bindings by (binding,
  projected cutoffs, reference to the interned frame cell identified by call-entry
  identity — the `local:inst:`/frameKey scheme ~:6748/:7022); growth of a cell's contents
  invalidates by VERSION STAMP (the `heapStepStableVersion === approximationVersion`
  pattern ~:4006), never by key rotation.
- **Fail-closed**: when a subject's write census cannot be established (dynamic calls,
  unknown escapes), project to the FULL cutoff map — today's behavior; degraded
  performance, never degraded soundness.

## Conditions on the repair (each is a gate)

1. The invariant stated LOCALLY in the file header (resume-order step 5's requirement).
2. Risk pins stay green — sibling-invocation distinctness (`readerShapeResolver.test.js`
   ~:1715, ~:1775), captured-memoized cross-invocation mutation (~:1732, ~:1754),
   demand-scoped clones; PLUS new negative controls: exact-origin non-crossing and
   captured-mutable (resume-order step 5 names both).
3. Advisory recomputation-without-growth meter added (observability, not a failure mode).
4. Acceptance ladder: resolver suite 90/90 + new controls → the blocked read completes
   within the 90 s target on the 2,074-file corpus → full-tree run under the 30-minute
   ceiling with `--progress`. Then resume-order steps 6-10 unchanged (commit green scanner
   FIRST, fresh clone for the authoritative artifact, schema-3 freeze needs the explicit
   later owner/Fable freeze ruling — still owed, NOT granted here).
5. Staffing: Opus implementation lane, chair-briefed (JUDGMENT: not an implementation
   packet — the packet INDEX governs product dispatch; scanner apparatus lanes run
   chair-briefed). Dispatch when a write-lane slot frees (concurrency law: two lanes).

## ⭐⭐ OUTCOME — the repair was BUILT and COMMITTED @ `6da84cfd` (2026-08-09)

The dispatch in §5 above completed. `6da84cfd` (Sun Aug 9 22:54:05 2026,
branch claude/composite-r4) — "OSR: the one canonical dependency-state identity — and
the disease moves to where a cache cannot follow" — implements the AUTHORIZED identity
in `scripts/lib/reader-shape-scan.mjs` (+353/−49) and `tests/lint/readerShapeResolver.test.js`
(+65). Recorded here 2026-08-10.

⚠⚠ **Do not read §5 as still-pending work.** Until 2026-08-10 this sha existed in NO
memory file — the index line carried it alone and an index compaction dropped it, at
which point this file said "DISPATCHED" and the sibling said "UNCOMMITTED", so both
read as NOT LANDED for work that had shipped. Recovered from `git log`. Anchor a
landing sha in the TOPIC FILE the same turn it lands; an index hook is not storage.

⚠⚠ **The ruling's own "recomputation-without-growth" diagnosis is SUPERSEDED by the
build.** The §"The disease, in one sentence" paragraph above still states the
pre-repair disease; post-repair the blocked read (`SettlementsPanel.jsx:359`) dies of
GENUINE MONOTONE GROWTH instead (`abstract-state growth steps 16385 > 16384`, ~145 s,
was: never terminated). Gate 2 of §4's acceptance ladder FAILS; gate 3 was never
attempted because the ladder is ordered. Full measurements, the four planted mutants,
and the unpinned-frame-coordinate finding live in [[osr-identity-repair-landed-and-growth-wall]].

Related: [[osr-identity-repair-landed-and-growth-wall]] (the build, its measured verdict,
and the remaining wall) · [[observed-shape-readers-walker-landed]] ·
[[walker-census-law-machinery]] · [[first-match-document-pin-class]]. The mechanism-map
agent's full report lives in this session's transcript; the essentials are above.

## CR-OSR-SCOPE-1 (chair, 2026-08-09, vetoable) — the scope decision after the growth wall

**RULED: take the scope-reduction fallback.** The exact scanner's mission is guarding
domain generation shapes; UI components (src/components/**) are downstream projections
of those shapes, still covered by the heuristic leg. After three measured walls (the
original never-terminating read, P1/P2 both rejected, and now a genuine-growth budget
failure at a UI read), the marginal value of exact resolution inside the UI layer does
not justify a fourth analyzer round. The exclusion must be DECLARED MACHINERY, never
silent: an exact-identity, shrink-only excluded-scope list in the scanner with the
reason recorded, a control proving an excluded read still gets heuristic coverage, and
a control proving a DOMAIN read cannot be quietly added to the exclusion. The
widen-the-projection direction (bounding free-binding initializer resolution) stays
recorded as an optional future improvement, NOT a gate. The schema-3 freeze itself
(resume-order step 7) remains gated on its own explicit ruling when the artifact
exists — this scope ruling does not pre-grant it.

## OUTCOME of CR-OSR-SCOPE-1 (landed @ ce9f575a, 2026-08-10)

The exclusion is machinery (114/114, five mutants killed) — but ⚠⚠ **the premise was
REFUTED: the UI was masking a second wall.** The full scan now dies at
`src/data/constants.js:56` (`prosperityRank`'s `prosperity?.tier` param read),
growth 16,385 > 16,384 at ~4.2 min on a 12 GB heap; ⚠⚠ at DEFAULT heap the process
OOMs before the growth budget can fire (a step budget is not a memory bound — any
full-tree run needs explicit `--max-old-space-size`). `src/data` is NOT excludable
under the UI-only law (module-load predicate enforces it). The three follow-on
decisions live in the S12-OSR-SCOPE queue row's FREEZE-RULING DOCKET: research
direction vs demand-level bound for ubiquitous pure helpers vs accepting the exact
scanner as a targeted instrument; the legacy-leg-on-gate question; wiring the
observedShapeReaders walker to the exclusion at the schema-3 migration.

## CR-OSR-FREEZE-1..3 (chair, 2026-08-10, under the full delegation grant) — the docket ruled

1. **The exact scanner is a TARGETED INSTRUMENT, not a full-tree gate.** After four
   measured walls (the UI read, P1, P2, the src/data growth wall), full-tree exact
   resolution is retired as an ambition: the exact mode remains for targeted
   per-read/per-file probes (where it is proven — the commandEnvelope receipt), and the
   HEURISTIC LEG becomes the full-tree authority. The initializer-bounding research
   direction stays recorded as optional, never a gate.
2. **The legacy/heuristic leg JOINS THE ORDINARY GATE** — `check:observed-shape-readers`
   runs the heuristic leg on every invocation (not artifact-only), so excluded UI files
   and the whole tree keep standing per-gate coverage. In writing, as the docket demanded.
3. **The schema-3 freeze REDESIGNS around decisions 1-2:** the schema-3 baseline derives
   from the HEURISTIC leg's full-tree scan (schema-2's own producer, so the migration is
   a re-freeze not a re-invention), annotated with the exact scanner's targeted receipts
   where they exist; the observedShapeReaders walker wires to EXACT_SCAN_EXCLUDED_SCOPE
   in the same change; the gate's schema pin (BASELINE_SCHEMA 3 vs live 2) goes green at
   that freeze. The freeze itself executes as a lane against these three rulings — no
   further owner/Fable act required, per the grant.

## CR-OSR-FREEZE-3-R1..R3 (chair, 2026-08-10) — the freeze ruling revised on five measured blockers

⚠⚠ CR-OSR-FREEZE-3's "schema-3 derives from the heuristic leg" was EXECUTION-REFUTED:
schema 3 IS the exact per-site identity by definition; its validator refused 2168/2168
heuristic rows; the governed bundle structurally requires an exact artifact; the exact
wall reproduces at HEAD (16385>16384 at src/data/constants.js, read #963, 36/2081
files); the heuristic leg carries 171 UNREVIEWED growth rows validateReviewLedger
rightly refuses; and genesis needs a COMMIT. The withholding lane's judgment stands.

- **R1: SCHEMA 4 IS MINTED** — the heuristic-leaf identity becomes its own schema;
  schema 3 stays as the RETIRED exact definition (redefining it in place would falsify
  every recorded reference — the no-history-rewriting ethos). Migration = schema-2 →
  schema-4 via the existing predecessorRows reconciliation (needs no exact artifact).
  The instrument gains a schema-4 heuristic-authority mode; targeted exact probes stay;
  the 730s-to-skip walker rewires in the same change.
- **R2: THE 171 GROWTH ROWS ARE REVIEWED FIRST** — a triage lane dispositions every
  new/increased reader-with-no-writer candidate BEFORE the genesis freezes; the review
  ledger the validator enforces is honored, never amended around.
- **R3: the manager commits the genesis** (as everything else — plumbing+CAS).
Path: review lane → schema-4 author/implementation → genesis commit → gate green.

## CR-OSR-FREEZE-4..8 (chair, 2026-08-10) — the schema-4 census's five rulings
### ⭐ ALL FIVE ARE FABLE-ISSUED — they are Fable-validated and owe NO Opus-era row.

The schema-4 lane BUILT 3 of 9 items and correctly STOPPED before the mint: the
pieces are NOT independently landable — CR-TRFZ-4 converts the OSR walker's hidden
24 skips into a VISIBLE uncollected suite, which greens only in heuristic mode,
which needs the schema-4 baseline, which needs a COMMIT. Vault:
`refs/preserved/schema4-prep` @ `2e2889d1` (4 files, +324/-24; never merge — restore
by `git show ref:path > path`).

- **CR-OSR-FREEZE-4 — ATOMIC LANDING, NO ALLOWLIST.** The prep work lands WITH the
  genesis or not at all. ⛔ Allowlisting the walker into `uncollectedSuites` to green
  the interim is REFUSED: it is the cure-you-can-bypass shape, and it would re-hide
  the very disabled guard CR-TRFZ-4 exists to expose (the walker-census law).
- **CR-OSR-FREEZE-5 — ⚠⚠ THE CHAIR'S OWN DEBT MARKER WAS WRONG, corrected by
  measurement.** The brief named the PROSE phrase "TRUE-POSITIVE, banked pending
  repair" — it matches only **12 of 23** rows; the STRUCTURED tag
  `[CR-OSR-FREEZE-3-R2 triage a]` matches exactly **23** and survives a
  reword-one-note control (prose drops to 11). **The structured tag IS the debt
  surface.** A prose-keyed query would have silently lost 11 true positives —
  the [[first-match-document-pin-class]] wearing a new hat: never key a queryable
  debt surface on human prose.
- **CR-OSR-FREEZE-6 — M6 ADOPTED at θ=0.80 with the ≥8-key guard, AS A POST-FILTER.**
  Measured: clears 122 of 2,196 findings (76 already-triaged artifacts), erases
  **ZERO true positives**; only 4 of 58 bound shapes have a non-empty family
  (`stressors` alone = 72 rows). ⚠⚠ `legacy-reader-shape-scan.mjs` is BYTE-FROZEN to
  blob `0310fa9f` (mutant-proven: one appended comment is refused) — the filter is
  NEVER an edit to the frozen detector; it is a post-filter (or a NEW governed
  detector version). REQUIRED: the filter carries a control pin that REDS if it ever
  clears a class-(a) row — the 0-erasure property is the whole basis of adoption.
- **CR-OSR-FREEZE-7 — the UI cohort ENTERS enforcement, banked as a NAMED cohort.**
  Making the heuristic leg the gate authority pulls `src/components/` (88 files / 250
  identities) into direct enforcement, mooting CR-OSR-SCOPE-1's gate role — **this is
  the intended answer to the freeze docket's open question** ("excluded UI files have
  no per-gate coverage unless the freeze lane adds the legacy leg — decide in
  writing"): CR-OSR-SCOPE-1's exclusion binds the EXACT instrument ONLY. The 250
  identities bank into the genesis tagged UNREVIEWED-UI (queryable, never silently
  absorbed); a follow-on triage lane clears them. Coverage is never reduced to make
  a freeze fit.
- **CR-OSR-FREEZE-8 — the doubled `count === 1` law CONVERGES or BOTH get pinned.**
  Two copies exist; only one is tested. An untested twin is the recorded
  [[unreachable-arm-and-self-supplied-anchor]] shape.
- **RATIFIED (lane JUDGMENT):** `issues` semantics move from "the reconciliation is
  not clean" to "not reviewed", stated in source so it cannot later read as
  accidental weakening. Correct — the reconciliation is DATA; reviewedness is the
  gate. The five-case control (incl. the forged-issue probe) proves it non-vacuous.

## ⭐⭐ CR-OSR-FREEZE-6-R1 (chair, 2026-08-10) — M6 DEFERS; the genesis freezes the instrument AS IT IS
### FABLE-ISSUED (pre-boundary) — owes NO Opus-era row. This REVISES CR-OSR-FREEZE-6.

⚠⚠ TWO FABLE RULINGS COLLIDED, found by measurement BEFORE any mint code was
written: a predecessor `rowId` digests `legacyCount`, so CR-OSR-FREEZE-6's M6
post-filter MOVES 59 of the 2,326 rowIds and `validateReviewLedger` refuses the
CR-OSR-FREEZE-3-R2 ledger outright. A mint built first would have produced a
genesis THAT CANNOT VALIDATE.

**RULING: M6 leaves the genesis and becomes a FOLLOW-ON freeze.** Four reasons:
1. **Put the novel argument last, not at the foundation.** The address-carrying
   re-key is sound but NEW (the lane itself flags "may a reviewed disposition be
   re-keyed by ADDRESS at all" as the thing to re-examine). A genesis is the
   hardest artifact in the instrument to reverse — it must depend on the FEWEST
   novel claims, not the most.
2. **Deferring dissolves the collision entirely** — the supplied ledger stays
   byte-valid, exactly as the lane observed.
3. **After genesis, M6 is an ORDINARY migration** (schema 4 → schema 4) through
   the standard predecessorRows machinery, diffed against a COMMITTED baseline —
   a far stronger proof surface than a hand-supplied JSON, and its class-(a)
   control pin (CR-OSR-FREEZE-6's condition) then runs against real history.
4. **Its removals are the SAFE direction**: in the deferred world the 122 rows sit
   in the genesis reviewed-and-accepted, and the follow-on REMOVES them — which the
   reconciliation classes as a lawful SHRINK needing no new review.
⭐ The lane's re-key tool + its negative control (a mutant erasing `otherSettlement`
drops the debt 23→21 and the tool REFUSES, true exit 1) are PRESERVED as the
follow-on's ready-made machinery — built, not wasted. Scripts: scratchpad
`osr4-m6-vs-ledger.cjs`, `osr4-rekey-ledger.cjs`, `osr4-rekey-MUTANT.cjs`.
⚠ Lesson: when two rulings of mine meet in one artifact, the CHEAPER SEPARATION
beats the cleverer reconciliation — and a lane measuring the collision before
coding is the behavior to keep rewarding.

## ⭐⭐ CR-OSR-FREEZE-4-R1 (chair, 2026-08-10) — the atomic unit is the COMMIT PAIR
### FABLE-ISSUED (pre-boundary) — owes NO Opus-era row. REVISES CR-OSR-FREEZE-4.

⚠⚠ **THE MINT IS STRUCTURALLY IMPOSSIBLE AS ONE PRE-COMMIT UNIT** — measured, sixth
execution-refutation of the era, nothing edited:
- `--write --migrate-schema=N` requires `dirtyInputsFor()` EMPTY
  (check-observed-shape-readers.mjs:993-995 → :671-673), and the instrument's OWN suite
  pins it (observedShapeSentinel.test.js:656-667 asserts /requires clean committed
  inputs/). **The inherited prep alone already blocks the write.**
- `validateBaselineHistory:536-576` requires BOTH that `<subjectSha>:baseline.json` be
  the schema-2 predecessor BY DIGEST **and** that `committedInputManifestsFor(subjectSha)`
  — which includes the detectorTree, i.e. the very files the mint edits — reconstruct
  from that commit. So subjectSha necessarily carries **schema-4 CODE + a schema-2
  BASELINE**, and the genesis is necessarily LATER. **No accepted sequence is shorter
  than two commits.**

**RULING: the atomic unit is the COMMIT PAIR.** CR-OSR-FREEZE-4's target was a
half-migrated instrument sitting with a HIDDEN disabled guard — the mischief was
"allowlist the walker to green an interim," which is BYPASS. A deliberately-RED,
immediately-succeeded intermediate commit is the OPPOSITE: honest, visible, cured
inside the same sequence. Conditions: (1) the intermediate commit's own message
STATES it is deliberately gate-red and names both red legs; (2) the genesis follows
immediately; (3) ⛔ NO allowlist, ceiling motion, or skip may mask the interim red.
⛔ **REJECTED: amending `validateBaselineHistory` to admit a self-subject genesis.**
Collapsing the pair would cost the predecessor-bytes proof — weakening a guard to fit
an operation is the raise-the-ceiling anti-pattern in a new costume. When the
instrument's design demands two commits, that IS its safety property; respect it.

**Corrections ratified from the same lane (measurement beats the ruling's prose):**
- ⚠ CR-OSR-FREEZE-7's UI figure was WRONG for the artifact it governs: 88 files / 250
  identities is the SCHEMA-2 slice; the schema-4 genesis inventory is **53 files / 162
  identities / 260 counts**. A pin written to 250 reds on first measurement. (This
  confirms the separately-flagged stale-UI-coverage figure.)
- ⚠ HAND-KEYED-ADDRESS ROT: the schema-3 surfaces are at
  migrate-observed-shape-readers.mjs **:519 and :546** (not :447/:474 — the inherited
  prep's +111 lines pushed them down); observed-shape-baseline.mjs :21/:242 stand.
  CR-OSR-FREEZE-8's twins: observed-shape-baseline.mjs:227 + check-observed-shape-readers.mjs:284.
- ⭐ NEW PROPERTY RECORDED: all ten genesis digests reproduce byte-identically across
  two independent processes — the corpus is DETERMINISTIC CROSS-PROCESS.
- ⚠ Step-1 blocker: `--scan-mode=legacy-leaf` cannot execute its own corpus
  (`commandOf` demands `--corpus-artifact=<exact artifact>` that can never exist).
Pre-computed durable inputs: scratchpad `osr4b-genesis-inputs.json` (7 of 9 bindings;
subjectSha + reportDigest are unknowable pre-commit), `osr4b-heuristic-inventory.json`.

## CR-OSR-FREEZE-9 (chair, 2026-08-10) — the anti-vacuity floor RE-DERIVES (a legitimate one-time shift)
### FABLE-ISSUED — no Opus row. RATIFIES the code lane's flagged acceptance.

The genesis re-freezes the anti-vacuity floor **12,433 → 9,265 resolvedReads (−25%)**.
RATIFIED as a legitimate detector change, NOT a coverage reduction under
CR-OSR-FREEZE-7: `git show ec525a59:check-observed-shape-readers.mjs` proves the
schema-2 predecessor was frozen by the **EXACT** detector, so 2→4 changes the
MEASURING INSTRUMENT — the two figures measure different things and comparing them
is apples-to-oranges. Not-a-collapse is affirmatively evidenced: `usableShapes`
228→338 and `totalKeys` 2,431→6,584 (a RICHER corpus), so the heuristic `singleHome`
prior simply resolves proportionally fewer reads as more shapes share names; and the
799-gone / 11-decreased rows are dispositioned ROW BY ROW in the reviewed ledger.
⚠⚠ Conditions: the genesis commit must state the shift EXPLICITLY and record BOTH
figures (the honesty-about-behavior-shifts law — a re-recorded floor never rides
silently), and the new floor must DERIVE from the new measurement, never be
hand-picked. ⭐ The lane FLAGGED this instead of absorbing it — the behavior to keep
rewarding; a silently re-recorded vacuity floor is how an instrument dies quietly.

⚠ ALSO CORRECTED BY MEASUREMENT (my brief was wrong): **CR-TRFZ-4's uncollected leg
is GREEN at the interim, not red.** The rewired walker no longer explodes in
`beforeAll` — it RUNS 26 tests, 22 pass / 4 fail / **0 skip**, which is exactly the
visible state CR-TRFZ-4 exists to produce. The interim red moves from the uncollected
guard to the PER-TEST census (4 named ids), and skips DROP by 24 (ceiling 105
untouched). The disabled guard is now a visible failing guard — the walker-census
law's intended end state.

## ⭐⭐⭐ THE SCHEMA-4 GENESIS IS LANDED — the pair closed @ `894325ff` + `2a7fb033`
### CHAIR-VERIFIED at the REAL committed sha: gate CLI **exit 0** via gate-tail.sh.

The observed-shape instrument now freezes on its HEURISTIC LEAF. Artifact:
`scripts/.observed-shape-readers-baseline.json`, 1,419,997 B, text sha256
`9e8b506f…`, schema 4, frozenAtSha `894325ff`, 2,196 findings / 1,527 identities /
397 files. ⭐ REPRODUCIBILITY EXECUTED, not asserted: the whole pipeline rebuilt in a
second process on an independent clean checkout of 894325ff — every output
cmp-identical. Walker 26/26 with ZERO skips (was: 730s to skip all 24); eight OSR
suites 232/232 here vs 4 failed at base — **same denominator 232 both ends, no test
lost**; ratchets unmoved 173/1134.

**⚠⚠ THE HAZARDS THIS LANDING TAUGHT — each measured:**
1. **A ledger binding can reproduce from NOTHING.** The chair ledger's
   `predecessorBaselineTextSha256` matched no live bytes, no historical blob, no
   encoding variant; bundling with it is REFUSED exit 1. **Always lift the WHOLE
   `bindings` object from a FRESH template**, never a hand-carried subset — and note
   the refusal is the negative control that proves the receipt binds.
2. **⚠⚠ THE CENSUS MOVED +39 TITLES WHERE +3 WAS EXPECTED** — five ALREADY-CREDITED
   files gained pins beside the one new file (townCartographyBuildings +23/+5,
   observedShapeMigration +8/+1, testRatchet +3, walker +2, sentinel +2,
   determinism +1). Final row: **files 2383 / parked 364 / credited 2019 / titles
   19539 / suiteTitles 5517**. The estimate-from-new-files-only instinct is WRONG;
   re-derive all five, and prove the instrument didn't move with a NEGATIVE CONTROL
   (0f7424f7's tests/ tree re-measured by the CURRENT classifier read the old row
   back exactly).
3. **The gate CLI cannot pass pre-commit BY DESIGN** — `validateBaselineHistory`
   walks `git rev-list --ancestry-path <subjectSha>..HEAD -- <baselinePath>` for a
   COMMITTED schema-4 baseline (:658-682). Every other arm passes first; only this
   one needs the commit. Prove the cure in a throwaway DETACHED worktree
   (`--no-verify`, no branch moved), never by weakening the arm.
4. **Schema-3 refs STAY on schema 3** (chair-ratified, not owed debt): schema 3 is
   RETIRED-not-deleted, its controls still exist and pass, and readerShapeResolver
   governs the still-live exact resolver — re-pointing would MISDESCRIBE controls
   that genuinely test schema-3 machinery. A new schema-4 rationale is correctly
   UNREFERENCED until schema-4-specific controls exist.

**STILL OPEN off this program:** the 23 class-(a) true positives (task #14; the
prominentRelationship 8 are USER-VISIBLE); the 250→162 UNREVIEWED-UI cohort's
per-row triage; M6 as the follow-on freeze (CR-OSR-FREEZE-6-R1, re-key tool ready);
CR-TRFZ-1..3's 105→111 attributed raise + census re-freeze, now UNBLOCKED.

## ⛔⛔ CR-OSR-FREEZE-6-R1's LANDING PATH IS EXECUTION-REFUTED (M6 lane, 2026-08-11)

⚠⚠ **"After genesis, M6 is an ORDINARY migration (schema 4 → schema 4)" IS FALSE** —
`check-observed-shape-readers.mjs:1258` refuses a schema-4→schema-4 migration outright,
and `:1290` refuses ANY run whose live detectorTree digest differs from the frozen one.
All 11 governed scanner paths sit inside that digest, so every possible caller of the
filter trips it: the gate reds (exit 1) and **`--write` THROWS even on a clean COMMITTED
tree** (proven in a detached worktree; the guard fires before the corpus build). Adding a
12th path additionally breaks `validateBaselineHistory` at genesis `894325ff`.
**Only a SCHEMA 5 MINT can land M6** — chair/owner-gated. Full mechanics + the
do-not-amend rule: [[osr-detector-change-requires-schema-mint]].

⭐ **THE MEASUREMENT ITSELF STANDS and was re-derived at HEAD** (committed baseline
2,164 / 1,499 / 395): θ=0.80 with the ≥8-key guard clears **122** (76 class-(c) + 46
untriaged "same", **0 class-(a), 0 class-(b)**), over 31 identities — `stressors` 72 +
`outcome` 50; only 4 of 57 bound shapes have a non-empty family. The 122 is unchanged
from the stale figure because none of the 32 rows retired since the genesis were
M6-clearable. Post-filter would be **2,042 / 1,440 / 391** (−122 / −59 / −4; the −59
corroborates R1's "59 rowIds move"). ⚠ Honest limit: a/b/c triage covers only the
171-row growth set, so "erases zero true positives" means *zero KNOWN* true positives —
46 of the 122 were never triaged (their source text was read and they are plainly real
fields, e.g. `applyWorldPulse.js` reading `outcome.populationDeltas`).

⭐ THE CONTROL PIN CR-OSR-FREEZE-6 DEMANDED IS BUILT AND MUTANT-PROVEN (vaulted, not
landed): the class-(a) surface re-derives to **23 addresses / 21 identities** via a
join proven total at 2,326/2,326; it is keyed on IDENTITIES because the filter's
decision is a pure function of (shape, key). ⚠ Only **8 of 21 are still live** at HEAD.
The pin is non-vacuous — `coalitionEvidence on outcome` is live on the very shape whose
union grows 48→141 — and the PAIRED NEGATIVE CONTROL (same corpus, unguarded
`settlementId on outcome`, clears silently) proves it fires on class-(a) membership
rather than on clearing. Vault: scratchpad `m6-vault/m6-filter.patch` (+384/−7).

## ⭐⭐ CR-OSR-FREEZE-6-R2 (chair, 2026-08-11) — M6 DEFERS TO A CONSOLIDATED SCHEMA-5 MINT
### FABLE-ISSUED. My R1 premise was EXECUTION-REFUTED; this is the corrected ruling.

⚠⚠ **CR-OSR-FREEZE-6-R1 SAID M6 WOULD RETURN AS "AN ORDINARY MIGRATION (schema 4 → 4)".
THERE IS NO SUCH THING.** Measured on three legs, each with the true exit captured:
1. the gate exits **1** — *"detector or unscanned execution input changed… an ordinary
   gate/write cannot migrate the instrument"* (`:1290`); negative control with the edit
   reverted exits 0;
2. **`--write` on a CLEAN COMMITTED tree THROWS** (`:1294`, proven in a detached
   throwaway worktree) — **the very step R1 assigned to the chair cannot succeed**;
3. `--write --migrate-schema=4` is refused at `:1258` — *"already schema 4; a migration
   review cannot authorize ordinary maintenance."*
No placement escapes: all 11 `scannerToolFiles()` paths are inside the digest, a 12th
breaks `validateBaselineHistory` (absent at genesis `894325ff`), and an ungoverned module
still needs the governed orchestrator to import it. The baseline's own `_doc` states the
law: **"Detector changes require a new governed instrument migration."**
⛔ The lane REFUSED to amend `:1290` — correctly, on CR-OSR-FREEZE-4-R1's own rejection of
"weaken a guard to fit an operation." That refusal is ratified.

**THE RULING: M6 is DEFERRED, not abandoned — to a CONSOLIDATED SCHEMA-5 MINT that
carries EVERY pending detector change at once.** Rationale: a schema mint is a commit
pair plus a full migration ledger, and this program now has **three** pending detector
changes, none of which is worth a mint alone but which together clearly are —
(a) **M6's family-union post-filter** (vaulted, verified: `m6-vault/m6-filter.patch`,
+384/−7, `git apply --check` clean; θ=0.80/≥8 keys clears **122** at HEAD for
2,042/1,440/391, with **zero class-(a) and zero class-(b)** erased and its control pin
mutant-proven with an accurate message);
(b) **the two write-shape blindnesses the M8 audit measured** — a shorthand property
inside a conditional spread, and a bare token inside a space-joined string literal, both
of which defeat the quoted-string scan that is currently the discipline's best manual
check;
(c) **the M8 five-gate router** as a filter (12/31 decided, 12/12 correct).
⭐ **Do not pay the mint cost three times.** Trigger: when the next detector change is
wanted, mint schema 5 carrying all three.
⚠ Cost of deferral is PRECISION ONLY, NOT SOUNDNESS: the 122 rows sit banked
reviewed-and-accepted, and they are genuine reads of keys the thin-bound shape lacks —
artifacts of binding, not false claims. ⚠ Honest limit recorded by the lane: "zero true
positives erased" means **zero KNOWN**, since a/b/c triage covers only the 171-row growth
set; it read the 46 untriaged rows' source and found plainly real fields.
⭐ The lane VAULTED rather than half-landing — landing would have left the instrument
gate-red AND UN-WRITABLE, blocking all future OSR maintenance. Exactly CR-OSR-FREEZE-4's
ratified precedent.
⚠⚠ **THE HARNESS REPORTED THE RED GATE AS "exit code 0" AGAIN** — second sighting; only
the captured `$?` showed 1. [[a-background-gate-cannot-wake-a-stopped-lane]] tail.

## ⭐⭐⭐ CR-OSR-FREEZE-6-R2 IS DISCHARGED — the schema-5 mint is BUILT and PROVEN (2026-08-11)

The consolidated mint R2 ordered exists, carries **all five** deferred items, and was
executed end to end at a THROWAWAY DETACHED PAIR (`3a1ccbb3` code + `77b8648c` genesis,
no branch moved) with every exit captured by `$?`: gate CLI **0**, five OSR suites
**225/225**. Measured 2,164/1,499/395 → **2,003/1,413/385**, reconciling **1,413 same /
86 gone / 0 new / 0 increased / 0 decreased** — a PURE SHRINK, so `report.issues` is
EMPTY and the ledger has nothing to discharge.

⚠⚠ **THE PIPELINE CANNOT BE PRE-RUN, AND THAT IS STRUCTURAL, NOT A LANE FAILURE.**
`frozenAtSha` and `migrationReview.subjectSha` ARE the subject commit's sha, and
`validateBaselineHistory` walks `<subjectSha>..HEAD`. A lane can only PROVE the pipeline
in a throwaway worktree; the artifact it produces is bound to the throwaway sha and is
worthless on the real branch. **The chair runs steps 1–5 BETWEEN the two commits.**

Full account, the five items' disposition, the four mechanics that bit while building it,
and the runbook: [[osr-schema5-mint-built]].
