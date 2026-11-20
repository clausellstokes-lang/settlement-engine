# FRAME-8 — hand-back (the session sheet's lane, the owner after FRAME-7)

Last written 2026-11-20T22:05Z (`date -u`) by FRAME-8 on `lane/frame-8-2026-11-20`. The lane was taken at `a42e90d89` on the chair's word "THE LANE IS YOURS at a42e90d89" (21:52 UTC), fast-forwarded. A successor needs this file and the briefs it names.

## RULINGS IN FORCE (one list; the source of each in brackets)

1-51. As listed in `FRAME-6-HANDBACK.md` (35-51) and the hand-backs it names, all in force, except where a later ruling below supersedes.
52-65. As listed in `FRAME-7-HANDBACK.md` at `a42e90d89`, all in force; ruling 61 (the whole ratchet) is SUPERSEDED by 64.
66. **COMMON-RULES** (`docs/chair/2026-11-20/seventh/prompts/COMMON-RULES.txt` on the chair's branch) binds every seat word for word; its rule 8 is RE-RULED (the chair, 21:27 UTC, = ruling 64): before each landing request (a) `npm run build` + `VERIFY_DIST=1` on `tests/build/vendorPdfLazy.test.js` and `tests/build/generationWorkerLazy.test.js`; (b) ONE run of the test directories of what the lane touched, ALWAYS `tests/lint` and `tests/build`, through the mutex, failing rows BY NAME against `ci/RED-AT-LINE.tsv` (53 rows at `062504aa8`). No whole `npm run test:ratchet` on a seat's box. Fetch COMMON-RULES again before the first landing request.
67. **THE ORDER FROM THE HAND-OVER** (the chair, 21:52 UTC): SR1 (builder still in FRAME-7's container; committed work `lane/frame-7-2026-11-20-sr1-wip` at `4eea702d8`, read by nobody): when its final branch comes, read its diff WHOLE ONCE, re-run its three proofs, see WHY `troubleWeight.test.js` and `scripts/census/pool-dominance.register.json` moved and say so, merge; then the three tuning rows re-frozen by the inventory's door (ruling 62). MEANWHILE one builder on FRAME-8's box: F3+F4 (path-disjoint from SR1, checked against `4eea702d8`'s list). P1 waits for SR1's tip. THE SIX SHEETS AGAIN FOR THE OWNER after SR1 and P1 are merged: tell the chair when ready for its eye.
68. **F3F4 LINES RULED** (the chair, 22:02 UTC, on `3e12fbd72`): the third Facts row on the owner's framed sheet, labels "Supply" (W3) and "The hall" (W4); F3 "{chain}: {source} ({cause})." for the FIRST impaired chain in the record's order, ending "; N more impaired." (digits) where more than one is; F4 "The ruling seat is {CAPTURE_RUNG_LABELS[rung] lower-cased}." printed only where `captureState` AND `criminalCaptureState` both say the hall is taken (fail closed); `castTroubleFrame` returns `strain` (not stored); the W3 frame's own words untouched. FOR THE VEIL READER: both rows owner-framed only; F4 reads a fact about crime; whether F3's first chain can be a hideable house's or a criminal chain is answered in `frame8/F3F4-RESULTS.md`; one test pins that no audience but the owner gets either row.
69. **SR1's TWO FINDINGS AND THE ORDER** (the chair, 22:23 UTC): (1) ONE HOME (COMMON-RULES rule 2): `SPLIT_LINES[0]` and `LOSES_FALLBACK[0]` were copies of `STAKE_REASONS.split` / `.loses`; cured IN THE MERGE as a separate commit, same bytes out (`[STAKE_REASONS.split, ...siblings]` by reference; the fallback composed as C2b(b) composed it). (2) THE MIXED PICK: SR1 merges as built on `crisisCast.js :: castHash` (plain FNV-1a; this lane's kernel has no `pickVariantMixed`/`mix32`); THE SWITCH to the kernel's mixed pick is ONE COMMIT OF ITS OWN right after the lane's merge of the line, with the measure (the commonest printed reason by size, ALL and CRISIS) re-taken once and the pins recorded by cause. THE SIX SHEETS ARE CUT AFTER THAT SWITCH, never before. ORDER: SR1's merge + the one-home commit + the six re-keyed lint rows (same text, same hash, new file key: a move, not a raise; by the register's door if it can move a row, else by hand, listed in the message); the three tuning rows by the inventory's door (ruling 62); F3F4's merge (the pins and the lighting census re-taken by whichever merges second); P1 on SR1's tip; the line's merge; the mixed-pick commit; the re-measure; rule 8's run (ruling 64); "FRAME <commit>"; the six sheets to the chair's eye. SR1's first paint: Brotli +107 ACCEPTED on the proof that the entry's index file normalised for chunk hashes is byte-identical at base and tip (in the merge message); the worker's +2,599 goes on the owner's size list (cause: the stake reasons' wordings). NIT, NO CHANGE: a `loses` row of a system with no pool notes its ledger poolId as `loses.<sys>`, not the fallback (no system lacks a pool today). Proof scripts live in the lane's docs (`frame8/tools/`), never only in a container.

## FOR THE OWNER'S SIGNING

As in `FRAME-7-HANDBACK.md` (`sideArchetypes.js#FRAME_TUNING`, unchanged). P1's `CRISIS_COUNTERPART_TUNING` joins when it comes.

## FOR THE JOIN AND THE SECURITY READER

As in FRAME-6's and FRAME-7's hand-backs. F3+F4 will add: the reader of a chain's cause word (`src/domain/display/`) for the join's fold of `EconomicsTab.jsx`, `SupplyChainsPanel.jsx`, `pdf/sections/SupplyChainFlow.jsx`, `pdf/sections/Services.jsx`; the export F4 reads for the "hall held" clauses; F4's capture line LISTED for the security reader (a fact about crime, owner-only by construction).

## EACH UNIT: STATE, BRANCH, COMMIT

| unit | state | commit | receipts |
|---|---|---|---|
| take-over | DONE | `a42e90d89` (fast-forward) | — |
| SR1 | BUILDER OUT in FRAME-7's container; `-sr1-wip` at `4eea702d8` | brief `frame7/SR1-BUILD.md` | at `4eea702d8` it touches `stakeReasonLines.js` (new), `crisisCast.js`, `crisisPage.js`, `pool-dominance.register.json`, `stakeReasonLines.test.js` (new), pins in crisisCast.test, tailCrisisBatch3/4, crisisStakeFollowups, troubleWeight |
| F3+F4 | BUILDER OUT (branch `frame8-f3f4` in an Agent worktree on FRAME-8's box, worktree `scratchpad/wt-f3f4`, deps in `scratchpad/deps` (main checkout's `node_modules` is an untracked symlink there: never stage it), from `accd953ef`); lines `3e12fbd72` (pushed `lane/frame-8-2026-11-20-f3f4`) RULED (68); BUILDING the two commits | brief `frame8/F3F4-BUILD.md` (`accd953ef`) | path overlap with SR1 only on framed-owner pins in `troubleWeight.test.js` and the lighting census (FRAME-8 refreezes at each merge) |
| P1, F6, P2, P3a, P3b, P4b, SR2 (+ the "# governs, with N other powers" line, ruling 64's second-batch item), the measures, build + verify:dist, the six sheets again | NOT STARTED | — | ruling 52's order; P1 on SR1's tip |

## STORED FIGURES THIS LANE MOVED (named, signed by nobody)

None yet under FRAME-8. FRAME-7's (C2b(b)): golden master 227 rows, FENCE 1 9bcbfbef -> 9dc8b4dd, generationForkCensus A1 control 26932f67 -> f1a55652.

## RUNNING COST IN WORKER BYTES

Worker 2,588,252 at `bcec56844` (the lane's base under ruling 59; the line 2,617,934); first paint 1,177,668 raw / 374,666 gzip / 314,465 Brotli.
