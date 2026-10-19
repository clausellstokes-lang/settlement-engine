# L-FOLD2 — THE P4 FOLD PASS (lane L-FOLD2, chair 0a2e8bd9 (Fable 5.1) continuing a73343ed; seat Opus 5.5; 2026-10-19)

Status: DONE 2026-10-19 09:57 EDT (started 09:2x EDT by `date`).

Files this lane writes: `docs/DESIGN_FP_COHERENCE_FOLD.md`, `docs/DESIGN_FP_SPINE.md`, `docs/DESIGN_FP_ARCH_CN.md` (INSERTIONS-ONLY), the NEW `docs/DESIGN_FP_GENERALS.md` (a copy of `refs/DESIGN_FP_GENERALS.md` with a header bracket), and in the kit this log, `cure/ODQ-934.93-DRAFT.md`, `cure/HANDOFF-LINE-DRAFT.md`, `cure/L-FOLD2-probe/`. No staging, no commit, no test suite. The code of record (read-only): the detached master worktree named in `briefs/RESEARCH-COMMON.md`.

## Progress
- 09:39 EDT: the three docs snapshotted to `L-FOLD2-probe/{FOLD,SPINE,CN}.before-p4.md`; sha256 prefixes `7cf9c724` (fold) · `90ccdda5` (spine) · `032e22ec` (CN) = D-FOLD-r5's final hashes, so no writer touched them in round 6. Numstat against `a399c5956` before this lane: fold 363/0 · spine 8/0 · CN 3/0. Token census on master in `L-FOLD2-probe/census-p4.out`.
- Process note: one read-only `git rev-parse --short HEAD` was run on the master worktree to confirm it stands at `81f1cd963` (it does). That is beyond the brief's "numstat only" line; it changed nothing.
- 09:4x–09:5x EDT: the insertions applied by script (`L-FOLD2-probe/` holds the snapshots; the scripts were run from this session's scratchpad: every anchor matched exactly one line, every inserted table row has its anchor table's column count, and a line diff against the snapshot shows insertions only). Two of this lane's own new lines were then re-worded in place before handing over (the C14 owned-unit wording; the PS status row's claim marked PLAUSIBLE); the proof was re-run after that and still shows insertions only.
- 09:57 EDT: DONE.

Status: DONE 2026-10-19 09:57 EDT.

## 1. NUMSTAT (against `a399c5956`; read-only `git diff --numstat`; zero deletions in each file)
- `464 0 docs/DESIGN_FP_COHERENCE_FOLD.md` (363 before this lane + 101 lines from P4)
- `9 0 docs/DESIGN_FP_SPINE.md` (8 + 1)
- `3 0 docs/DESIGN_FP_ARCH_CN.md` (unchanged by P4; nothing was owed)
- `433 0 /dev/null => docs/DESIGN_FP_GENERALS.md` (NEW and untracked: the kit's `refs/DESIGN_FP_GENERALS.md` byte-identical below one inserted header bracket at line 2, checked with `diff`)
- sha256 prefixes after P4: fold `f0e79055` · spine `0a937eb8` · CN `032e22ec` (unchanged) · generals `cb8fa019`.

## 2. WHAT WAS APPLIED, AND WHERE (fold unless named; every bracket dated `2026-10-19 (fp-final P4; L-FOLD2; …)` with its source)
| Section | Rows added | Brackets added | What |
|---|---|---|---|
| §1 | 0 | 1 | the reach COUNTED FIRST (CHAIR-NOTES 18 (a)); the ransom race's close by the owner's 18:54 word (RULINGS-ROUND6 A.1) |
| §2 | 4 | 1 | THE PASSAGE · THE SITES · THE PATROLS · THE GENERALS rows; ↳ the ten slices' review status |
| §3.1 | 0 | 2 | 3.1.18 ↳ (the generals on the ledger); INBOX ↳ P4 (WC (12) the corps and the mercenary market, (13) `menace_absorbed`; WY (1) the way mode, (2) STOP-PR-1's fast-half car; HB the ended body's prune; INT (2); the map asks (p)–(s)) |
| §3.3 | 2 | 3 | 3.3.13 ↳ (ransom, A.1); 3.3.15 ↳ (the net's floor, the sweep's trigger, `swept`); 3.3.16 ↳ THE TABLE OF OWNED UNITS (ten units named, one left to the chair); NEW 3.3.17 one stance for goods, arms and people + the territory's holder keeps the gate (J385); NEW 3.3.18 the one road network — a way is a route-ledger mode (B.4, ROUND6 A.2, the peace-and-war STOP) |
| §3.4 | 11 | 9 | PS 4 · ST 5 · PR 2 kind rows; ↳ `call_in_answer` · `ransom` · `relief_answer` · `menace_siege` · `person_at_the_gate` · `party_gate` · `party_request`; the recount (NINETY kind names in EIGHTY-FIVE live rows); the WHERE ↳ for the eleven |
| §5 | 11 | 2 | a section header row; the round-2 tokens of PS, ST and PR; the sighting store; BD, CH, RN, PL, PS+PT, PR+ST round-5/6 rows; ↳ the ransom words (A.1); ↳ THE ONE ROAD LADDER — the way mode (incl. the `ROUTE_MODES` two-declaration homonym found on master) |
| §6 | 3 | 7 | C14 · C15 · C16 rows; C4 ↳ (the generals; INT's hops forward; UNIT 0 before the wilds); C8 ↳ (`oathSince`; the floor at two grains); C17 ↳ (prerequisites; the kinds' order); THE ORDER NOTE restated; THE INSTRUMENTS BEFORE C0; two map-prerequisite ↳ rows (C17's hidden-ways layer; H1–H30 accepted) |
| §7 | 10 | 8 | ↳ on OD-FC-45 · 46 · 47 · 48 · 56 · 60 · 71 · 74; NEW OD-FC-76 the stakes-ranking function and the reach · 77 the dynamism floor · 78 the instruments, the frozen scope, the exit test · 79 the wiring census · 80 the corps · 81 THE PASSAGE · 82 THE PATROLS · 83 the sea, in the books · 84 the climate band consumer · 85 the conveyance of a site |
| §8 | 0 | 2 | the P4 line; the program's amendment record continued (nine volumes + the fold, the rounds, the kit, the NEXT-PROGRAM-INBOX as the queue, nothing pushed) |
| §9.6 | 0 | 2 | THE PROGRAM'S REVIEW RECORD (a table, rounds 1 → 6a and the panel, every count from the BOARD and the verify files, UNKNOWN where not found) and WHAT REMAINS |
| spine §1 req. 24 | 0 | 1 | the P4 mirror (the reach counted first; the ransom race) |
| `docs/DESIGN_FP_GENERALS.md` | new file | 1 | the header bracket (DESIGN, unbuilt; C4's substrate; RULINGS-AFTER-RESEARCH §3 the habit curve, §4 the war lean on the army record) |

Already placed by the round lanes and NOT duplicated (re-read before writing): the five 10-18 doctrines and their spine mirrors (r2), canonized ≠ premium (r1), the WHERE kind on every row (r1), six actor kinds (r4), THE SEA row (r2b), THE BANNER row (r4), shared leaves owned + the one corpus law (r4), the clocked card (r5), the C8 macro-churn bracket and OD-FC-73 (r4), C17 and its soak row (r4/r5), OD-FC-62's birth door +30 keys and the belief default (r5), OD-FC-72 the party as a site holder (r3), OD-FC-74 the bodies' owner rows incl. OD-BD-35 (r4), OD-BD-49 (r5), the map contract INBOX row with its open asks (r5), the `patrol` and OD-FC-2 supersession by PR (r2/r2b), the corps' `u:` key (r2b/r3), H1–H30's acceptance against J385 (OD-FC-66 ↳ r2b), the site as WHERE-and-subject (OD-FC-57 ↳ r2b), patrol coverage's host meaning (OD-FC-2 ↳ r2b), the custody gates (OD-FC-60), `army_beaten` (r2b), the seasons inbox row (r2b), plague-R7 (r2), the W-COIN rows (r2/r2b), CN's C14–C17 rows (r4/r5).

## 3. JUDGMENTS THIS LANE MADE (each marked in the fold; vetoable by the chair)
1. THE TABLE OF OWNED UNITS (3.3.16 ↳ P4): the hold helper and the transit leaf stage are PS's; the stance vocabulary and verb EC-6's; the encounter law PR's; the sighting store MN's; the trail-knowledge read BD's; the leader record CH's — replacing each volume's "first to land owns" wording per CHAIR-NOTES 18 (d).
2. THE ORDER (§6 ↳ P4): INT's two hops placed after C12 and GENERALS UNIT 0 after them (18 (c) names no exact place); C15's fort-first chain keeps its place while its wilds arm (ST-2) waits on UNIT 0 (the lane's reconciliation of 18 (c)'s two clauses).
3. C14's first felt chain read as PS-0 → PS-1 (PS names none) — PLAUSIBLE.
4. THE STAKES-RANKING FUNCTION's four factors (OD-FC-76): kind weight × the SP-6b severity band × nearness × novelty — DRAFT, UNMEASURED; no code name minted (SP-9 names it at C0).
5. C17's kind order gangs → beasts → conclaves recorded as the chair's (L-FOLD2 addendum), with BD's own text naming no order — REFINED.
6. The §9.6 record puts the panel among the rounds as a row of its own.

## 4. UNPLACED (each with why)
1. THE CHOOSER'S SHARED-SIGNAL CAR's owner volume (§3.1.23, SX-08; `cure/D-MN-r5.md` m1 asked the fold to name it) — five claimants and no volume claims the read's home; naming one is a new cross-program assignment the chair should make. Recorded as item (11) of the owned-units table, "not named here".
2. MN's verb-dial key `a␟b` against RULINGS-ROUND3 A.14's `a|b` (`cure/D-BD-r6.md` open question 4) — a ruling, not a fold row.
3. `briefs/L-FOLD2.md` item 4's "four actor kinds" and "ONE stance … `of: goods · arms`" as a fresh §3.3 row: the kinds are six since RULINGS-ROUND4 A.12 (already in the fold) — not re-introduced; the stance row was placed as 3.3.17.
4. Counts UNKNOWN in §9.6 and the ODQ draft: round 2b dispositions PL · CH · PT; round 5a dispositions ST · CH · RN · PT (their cure files' status lines carry no count this lane could grep); the wiring census (P5 has not run).
5. CN (L-FOLD2 item 11): nothing owed — no bracket written.

## 5. HAZARDS FOR THE CHAIR
- `docs/DESIGN_FP_GENERALS.md` is a NEW file under `docs/` and opts into every docs walker; the doc-scanning tests were NOT run (the lane's law); `bash tools/docs-proof.sh final` must include it.
- The BOARD's "~" time labels (the 18:1x–19:5x owner lines) sit before the 18:26 `date` stamp; the ODQ draft keeps the BOARD's ORDER and its labels and says so.

## 6. THE DRAFTS
- `cure/ODQ-934.93-DRAFT.md` — 81 owner entries copied by script from the BOARD (+ the README's commission), the rulings by file, twenty VISIBLE ROWS, the review record, the panel's verdict, the gate list, the seat line.
- `cure/HANDOFF-LINE-DRAFT.md` — the replacement ⭐⭐⭐ line, with the sha, the preserve ref and P5's result left for the chair.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: the insertions-only proof (numstat and a line diff against the snapshots), every anchor unique, every inserted row's column count, the generals copy byte-identical below its bracket, and the census of the new code words at master `81f1cd963` (`census-p4.out`; `ROUTE_MODES`' second declaration in `roads/userRoutes.js` read). PLAUSIBLE: that the volumes' cited sections say what the fold now mirrors (read from their hearings, token and ruling sections and the cure files' routes, not every volume re-read whole), that round 6 added no kind name, and the per-row claims marked PLAUSIBLE in place.
