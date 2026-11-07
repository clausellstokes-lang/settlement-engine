# MERGE-5AB: the people car's lanes 5A then 5B onto the 234-merge tip. Both MERGED (5B by the chair's ruling); the observed-shape register is a STOP (2026-11-07)

> Archival record of the cloud chair's merge seat MERGE-5AB. The prompt: merge lane 5A, then lane 5B, in that order onto the 234-merge tip; re-derive every register at each merged tip; run the suites; push. A non-mechanical conflict is reported, not resolved. The one principle the seat may apply where both lanes touched one file is ONE WRITER PER FACT.

## 1. The tips

- **Base.** `origin/lane/people-234-merge-2026-11-07` at `c7d552370` (lanes 1+2+3+4). The seat branched from it in the shared worktree, which was a clean detached HEAD at that sha, with `git switch -c`. `npm ci` exited 0. The clone was unshallowed.
- **Lane 5A (`3d76fb058`): MERGED** at `053283dfd` with no conflicts. 5A was cut from `c7d552370`, so the merged tree is byte-identical to 5A's tip (tree `8c8ab7a40`).
- **Lane 5B, first attempt (`32dfacaee`): ABORTED.**
  - It conflicted in 10 files. Two of them change the same behaviour differently (§3).
  - The seat pushed what was merged, with an interim record (`5dd99ee74` … `3c66d320e`). It ran the wide suite and the goldens at the 5A tip; the union caused no red there.
- **Lane 5B, final (`f24623a9f`, its tip after "the wide sweep attributed and the remainder listed"): MERGED** at `a725df7e4`. This followed the chair's ruling of 15:3x UTC on the two divergences (§3).
- **The tip:** `lane/people-5ab-merge-2026-11-07`. It holds 234 + 5A + 5B, the registers in §4, and this record.

## 2. The merge of 5A (`053283dfd`)

No conflicts. 5A's merge base with the 234 tip is the 234 tip itself.

## 3. The merge of 5B (`a725df7e4`): conflicts and resolutions

Merging `f24623a9f` onto the 5A-merged tip conflicts in 11 files.

**Who owns the six src files.** PEOPLE-5-PREP §1 classes all six as EDIT, which 5B's brief gives to 5B. 5A's brief §1 groups (d), (f) and (g) also name five of them by file, and 5A's record lists the sixth (`pendingEditsPreview.js:422`). Both lanes re-wired the same reads.

**The two divergences, ruled by the chair** (15:3x UTC, by the briefs' ownership):

1. **`src/domain/pendingEditsPreview.js` → 5B's side.** The ruling: "the preview is the edit layer's". 5A had renamed the powers' count `downstreamCounts.factions` → `.powers`; 5B kept `.factions`. 5B's writer was taken.
   - 5A's two readers were re-keyed to `.factions`: `src/components/dossier/CascadePreviewPanel.jsx:288` and `src/lib/editFingerprint.js:63`.
   - Their tests were re-keyed the same way: `tests/lib/editFingerprint.test.js` and `tests/ui/cascadePreviewLinkedSaves.test.jsx`.
   - Cause: "MERGE-5AB: the preview is the edit layer's". `tests/domain/pendingEdits.test.js` took 5B's side.
2. **`src/domain/relationships/neighbourBackLink.js` → 5A's side.** The ruling: "the neighbour link is the display lane's". `own` and `partner` both carry `powerStructure.factions`, which matches 5A's `crossSettlementConflicts.js :: engagingFactions`, now with no grouping fallback.
   - 5B's `partner.factions` copy was dropped. 5B's JSDoc line (`powerStructure?: unknown` on the settlement) was kept.
   - No 5B test pinned the partner shape (searched: no test names `liveNeighbourEngagements` or `neighbourBackLink`).

**Mechanical (the same re-wire in other words).**
- `EventComposer.jsx`, `SettlementDetailEditNames.jsx`, `normalizeSettlement.js`, `regenerationMode.js`: 5A's text, consistent with ruling (2).
- `tests/components/editNamesFactionRoster.test.jsx`: 5A's arm in the one conflicting hunk (the same two assertions in another order). 5B's re-keyed rename-cascade arms in the non-conflicting hunks were kept. A first resolution that took 5A's whole file dropped those arms. The touched tests caught it (2 red), and it was redone hunk by hunk: 43 / 43 green.

**Registers taken to commit, then re-derived (§4):**
- `scripts/.writer-reach-baseline.json`: 5A's side.
- `tests/lint/.source-citation-baseline.json` and its walker header: both lanes' notes kept.

## 4. The registers at the 5A+5B tip

| register | door | result | commit |
|---|---|---|---|
| **observed-shape readers** | `--write`, then the plain check | **STOP: exit 1 both, `executionTree manifest digest mismatch`** (see below) | — |
| writer reach | `--rebank --charter='§934.105'` (the door both lanes and MERGE-234 used) | cohort 1399 → 1397. 4 admitted (`elected_reeve` / `feudal_stewardship` on `leaderNpcIds`, `lastTargetedBy` / `lastTargetedTick` on `osr000:npc_barracks`: FPZ's per-NPC ledgers re-dealt by card id over the union's roster, M-6). 6 stale folded out (the grouping's fields, gone with 5B's v2 boundary). Then the plain check exits 0 | `f06de9b25` |
| lighting census | `LIGHTING_CENSUS_REFREEZE` on a clean tree (exit 1 on write, by convention), then the plain run | 34 / 34 | `548709ab0` |
| wiring census | `node scripts/wiring-census.mjs --check` | exit 0: 709 pools / 2310 variants / 165 relation rows. Its JSON did not conflict | — |
| fork registry, held-key census, tuning, writer-reach walker | the walkers, in the wide run | no pin moved by the union; their reds are the base's or the STOP's (§5) | — |
| dated roster | `sourceCitationIntegrity.walker` | 99 → 101 at the union (PEOPLE_5B_EDIT and this record). Both lanes' notes kept; the `_rosterGrowth2026-11-07-merge-5ab` note and the header's `dated (101)` set; 18 / 18 | `6a23130cc` (`06b83a03c` at the 5A tip) |
| edge-shared bundles | `npm run build:edge-shared`, once at the end | exit 0 | EDGE_COMMIT |

**The observed-shape register: a STOP.** The chair's ruling restores a consistent baseline at schema 30. That cannot pass, for the following reasons, measured here.

- `validateBaselineHistory` (`scripts/check-observed-shape-readers.mjs:2561`) walks every commit on `subjectSha..HEAD` that touches the baseline. It runs `assertExplainedWriterRowTags` → `validateSchema30Baseline` → `assertManifest` on each one (stack at `:2622`, `observed-shape-baseline.mjs:1390`, `observed-shape-governance.mjs:329`).
- `c7d552370`'s committed baseline (MERGE-234's textual merge, never re-derived) fails that check, and it is now on every descendant's ancestry path.
- **Tried:** `8dd30106b`'s consistent file restored in the working tree. The plain check still throws the same mismatch, now from `validateBaselineHistory`, which reads `c7d552370`'s committed file. The restore was reverted; nothing was committed.
- **Neither lane cut a rung.** 5A's STOP 2 and 5B's §3 both stopped here, so there are no rungs "5A's then 5B's" to compose.

The only escape is a new genesis: rung 30 → 31, the precedent being `1f09ca532` (act 1, 8 files, +226 / −37) and `8fa9de5b8` (act 2). It would run in three steps:
- (a) Commit `8dd30106b`'s consistent schema-30 file at a commit X.
- (b) Act 1: `BASELINE_SCHEMA` 31, `validateSchema30Baseline` re-bound as retired, the 30 → 31 policy and pairing, the CLI allow-list, both headers, and the pins in `observedShapeBaseline` / `observedShapeMigration` / `observedShapeSentinel`.
- (c) Act 2: the register re-minted through the migration with X as the genesis. Its predecessor is then X's consistent file, and the history walk starts after X.

What it would admit is the chair's to say. Per 5B's scan against `8dd30106b`: NEW 113, GONE 8, DECREASED 1. That covers 5A's re-pointed reads, FPZ's simulation reads (M-6), and the migration's deliberate v1 reads, which 5B would DECLARE as one explained-writer class. The schema-24 / rung-30 posture would instead admit every row with attribution and declare nothing. The seat did not cut the rung: it is a design act (declare or admit), and it is beyond a merge seat's budget.

## 5. The suites at the 5A+5B tip

**Wide run at `6a23130cc`.** Command: `sh scripts/gate-tail.sh npx vitest run tests/generators/people tests/domain/dossier tests/domain/crisis tests/domain/edit tests/lint tests/scripts tests/domain/settlementMigrations.test.js`. **250 files: 16 red. 3,573 tests: 30 red, 16 skipped. Exit 1.**

**5B's save museum and migration suites** (`tests/lib/saveMuseum.test.js`, `tests/domain/settlementMigrations.test.js`): **30 / 30 green.**

**The red list, by owner.** Each red was attributed against the 5A-tip run (§1, `5dd99ee74`), the lanes' own records, or a base / lane-tip worktree run.

| suite | red | owner |
|---|---|---|
| `tests/lint/observedShapeReaders.walker` | 6 | **the STOP (§4).** 2 at the base (the digest error), plus the arms that bank the union's moved reads: 5 at the 5A tip, 4 in 5B's record |
| `tests/lint/writerReach.walker` | 3 | **the STOP.** Its "producers ran" (1719 live against OSR's frozen 1725 shapes), corpusMeta and shapesDigest arms compare against the observed-shape register's frozen corpus |
| `tests/generators/people/castPowers` | 2 | 5B's record §4: lane 1's arm reads the shim's `factionAffiliation` on the returned record, which 5B's v2 boundary strips (the landing deletes the shim) |
| `tests/domain/dossier/seatHolder` | 1 | 5B's record §4: lane 2's seat read on the returned record |
| `tests/lint/proseFamilyContract.walker` | 5 | the lanes' (the AO-0 corpus re-dealt by the cast) |
| `tests/lint/tuningRegister.walker` | 4 | the base |
| `tests/lint/institutionTable.walker` | 2 | the base |
| `tests/lint/negativeAssertionAnchor.walker` | 2 | the base |
| `tests/domain/editWorldFactResources` | 2 (A2, A6) | the base (re-run in a base worktree) |
| `tests/lint/heldKeyWriterCensus.walker` | 1 (A3) | the base (re-run in a base worktree) |
| `tests/lint/mutationCoverageManifest` | 1 | the base |
| `tests/lint/proseWiringCensus.walker` | 1 | the base |
| `tests/lint/newsHeadlineContract.walker`, `newsVoiceContract.walker` | suite-level | the lanes' (the AO-0 year) |
| `tests/lint/ledgerCitationIntegrity`, `tests/scripts/provenanceMap` | suite-level | ENVIRONMENT: there is no local `refs/heads/review-fixes-2026-07-08` |

**Outside the wide run, seen while checking the resolution:**
- `tests/copy/voiceMechanics` (1): `settlementMigrations.js` em 2 → 3. This is 5B's: red at 5B's tip `f24623a9f` in a worktree.
- `tests/build/vendorPdfLazy` (4), `tests/components/repeatOnceTonightTraditions` (1): the base's (5B's record §4).

**What the union cured.** At the 5A tip: the dated roster, by the roster step. At the merge: `editNamesFactionRoster`'s two rename arms, whose 5B re-keys were restored.

**What the union caused.** Only the STOP's arms grew, because both lanes' moved reads now sit on one broken register. No other red is the union's.

**The goldens (M-3), banked, never re-recorded.** PENDING at this commit (the run is in flight).

**5B's other reds**, per its own record §4 and listed, not this seat's: the FPZ casualties (18 tests in 8 files, M-6), lane 5A's birth/display readers on the returned record (6 in 6 files), and its own remainder (§6 below).

## 6. Lane 5B's remainder, inherited by the landing seat (quoted from `docs/PEOPLE_5B_EDIT_2026-11-07.md` §9)

> 1. Re-key `tests/generators/generationCertificationCorpus.test.js` (7): conflict parties checked against `powerStructure.factions` (as `scripts/audit/generation-certification-soak.mjs` now does); its member check left with the grouping.
> 2. Re-key `tests/lib/persistenceAdmission.test.js` (2) to schema 2: measure what the admission now reports and re-key with cause M-7.
> 3. Re-key `tests/generators/pipelinePinnedChoosers.test.js` (1) and `pipelinePinnedMode.test.js` (1): measure the pinned key list and the pinned run under the v2 boundary; re-key with cause M-7.
> 4. The observed-shape rung 30 -> 31 (§3, the chair's ruling first): a restored predecessor, the migration's v1 reads declared as one class, FPZ's rows admitted with attribution, 5a's re-points landed first.
> 5. Hand lane 5a the six birth/display reds above and the export allowlist's three unwritten keys (§3, writer reach).

## 7. This seat's remainder

1. The observed-shape rung 30 → 31, as §4 describes: first commit a consistent predecessor, then act 1 and act 2. The chair rules what is declared and what is admitted.
2. After the rung, re-run `observedShapeReaders.walker` and `writerReach.walker`. Their STOP arms should then go green.

## 8. CONFIRMED vs PLAUSIBLE

CONFIRMED:
- The conflict lists, from git's merge output, at both 5B tips.
- The ruling applied file by file.
- The touched tests green (43 / 43) after the resolution.
- Every door's exit code.
- The STOP's mechanism: the stack traces at the restored-file run and the history walk read in source.
- The red attributions, by the runs named.

PLAUSIBLE: that a rung cut from a committed consistent predecessor escapes the history walk. This was read in `validateBaselineHistory` (the walk starts at the genesis `subjectSha`), not run.

## 9. The tip

`lane/people-5ab-merge-2026-11-07`, pushed with `--no-verify`. The tip is the commit that carries this file's last edit.
