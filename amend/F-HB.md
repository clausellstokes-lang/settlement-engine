# LANE F / HB sub-seat — worklog (DESIGN_FP_ARCH_HB.md), 2026-10-16

Base: kit `volumes-master/DESIGN_FP_ARCH_HB.md` (4480 lines), copied over the (deleted) destination `docs/DESIGN_FP_ARCH_HB.md`, then amended. Destination: 4517 lines.
Applier: scratchpad `hb_apply.py` (104 exact-string anchors, each asserted count==1 in the BASE before anything was applied — 0 misses; pointers `:{{REF:id}}` resolved to destination line numbers after insertion). Record: scratchpad `hb_applied.json`. Verifier: scratchpad `hb_verify.py`.
No git command, no memory/ODQ/HANDOFF write, no other file written.

## Verification
- Insertion-only: `python3 -I hb_verify.py` → "inserted lines: 37 modified lines (insert-only within line): 70 violations: 0", exit 0 (line-level difflib: only `insert` and equal-length `replace`; every replaced line checked at char level: insert-only).
- Brackets: `grep -c '2026-10-16 (coherence fold'` = 96 (104 entries minus 8 bare `[see :N]` pointers). `grep -c 'OWNER ROW OD-FC'` = 4 (OD-FC-23, -24, -30, -33). FIRST-VISIBLE/TIER lines = 10 (HB-0..HB-9).
- Requirement-13 Alignment lines: byte-identical to base (grep 'req 13' set compared with cmp).
- Every pointer target spot-checked (30 of them) against the bracket it names.

## Applied (entry id · what · mode · destination line)
| id | what | mode | dest line | status |
|---|---|---|---|---|
| STATUS | status header (S1, refinement 1, fold §2 HABIT row) | after | 14 | APPLIED |
| R2 | refinement 2 (Q1 signed by reading; unsealed) | after | 39 | APPLIED |
| PIN | vocab §5 pin (first use) | inline | 60 | APPLIED |
| DOCTRINE | vocab §5 doctrine (first use) | inline | 69 | APPLIED |
| R1 | fold §3.2.9 (CR-ES-4 release) | after | 300 | APPLIED |
| R3 | S14 (bandedStock riders) | inline | 313 | APPLIED |
| R5 | S12 / X13 (chartered prefixes) | inline | 353 | APPLIED |
| R7 | refinement 5 (S5, S6: fortify disjunct + martialMoves) | inline | 397 | APPLIED |
| R8 | S13 / X14 (proseNumerics ceiling) | inline | 411 | APPLIED |
| MEASURED | vocab §5 measured (first prose use of the rung) | inline | 423 | APPLIED |
| R17 | OD-FC-23 pointer at R17 | inline | 599 | APPLIED |
| S05-3 | refinement 5 pointer (§0.5 item 3) | inline | 687 | APPLIED |
| SEVEN | refinement 20a (C8, seven closes) | inline | 699 | APPLIED |
| GENERALS | refinement 23 (X16, generals rulings) — first site of J-HB-2 | inline | 716 | APPLIED |
| SHAPE | refinement 3 (S2, ledger shape) | before | 759 | APPLIED |
| BYTES | refinement 4 pointer (§1.1 byte figures) | inline | 788 | APPLIED |
| C7 | refinement 5 pointer (§1.3) + C7/X17 site-8 vocabulary | before | 898 | APPLIED |
| CAP | refinement 4 (S3, S4: 48 / 208 / ~121KB) | inline | 917 | APPLIED |
| V | refinement 3 pointer (§1.5 migrate v) | inline | 983 | APPLIED |
| WRITER | HB-2 status (writeHabits zero callers) | inline | 1003 | APPLIED |
| NS | status pointer (§2 namespace census) | inline | 1027 | APPLIED |
| SPD | refinement 9 (X3, S8: SP-D reachability) | after | 1127 | APPLIED |
| FIRMNESS | vocab §5 hold → firmness (first use of the sheet field) | after | 1887 | APPLIED |
| PLANT1 | fold §3.2.8 pointer (§3b deception road) | inline | 1915 | APPLIED |
| LAWBAND | refinement 16 + fold §3.1.13 (S16, X10) | after | 1932 | APPLIED |
| SEAT | refinement 3 pointer (seat shock) | inline | 1949 | APPLIED |
| RING | req 23 pointer (timing law, MAX_HISTORY) | inline | 1984 | APPLIED |
| C1 | refinement 7b (C1, misplaced EP-r erratum) | inline | 2056 | APPLIED |
| 812 | refinement 6 (S7, X12: 812 baseline) | after | 2292 | APPLIED |
| SHEET2 | vocab §5 hold pointer (§3d sheet shape) | after | 2502 | APPLIED |
| SECOND | refinement 11 (X5, S10: IN-1 landed) | after | 2609 | APPLIED |
| SEAM2 | refinement 21 pointer (seam 2 row) | inline | 2616 | APPLIED |
| FLAGSHIP | OD-FC-23 (Q-HB-A, the flagship sentence) | inline | 2619 | APPLIED |
| SEAMS | refinement 21 (C4, X20: HB-7 wiring) | after | 2641 | APPLIED |
| E3 | refinement 9 pointer (§3e intro) | inline | 2667 | APPLIED |
| PAYOFF | refinement 13a (C2: twice waited) | after | 2681 | APPLIED |
| TAP | refinement 9 pointer (§3e (2)) | inline | 2691 | APPLIED |
| DELTA | refinement 13a pointer (delta row) | inline | 2702 | APPLIED |
| LEGREFS | refinement 7a (X1, S11: legRefs five) | after | 2709 | APPLIED |
| PLANT | fold §3.2.8 + refinement 8 (X2: planted doctrine road) | inline | 2726 | APPLIED |
| PLANT2 | fold §3.2.8 pointer (deception row) | inline | 2757 | APPLIED |
| ACCRUAL | refinement 23 pointer (refinement 13 accrual) | inline | 2785 | APPLIED |
| AWARE | fold §3.1.12 (STRUCK truth read of sightPostures) | inline | 2816 | APPLIED |
| IN3 | refinement 10 (X4, S9: IN-3 landed) | after | 2841 | APPLIED |
| RCPT | vocab §5 hold pointer (receipt field) | after | 2856 | APPLIED |
| PN413 | S13 pointer (§3g law 1) | inline | 2878 | APPLIED |
| DECISIVE | refinement 13b (C3: decisive) | inline | 2891 | APPLIED |
| SHIFTED | refinement 15 (doctrine_shifted has no sentence) | inline | 2910 | APPLIED |
| LAST | refinement 14 (sorts LAST at the flagship) | inline | 2921 | APPLIED |
| DMEDIT | refinement 24 (X15: L10 Edit Mode) | inline | 2928 | APPLIED |
| DARK | refinement 22 (C10: every one DARK) | after | 2933 | APPLIED |
| HB0 | FIRST-VISIBLE/TIER HB-0 | after | 2947 | APPLIED |
| HB0-LAW | fold §3.1.13 pointer at the HB-0 charter | inline | 2956 | APPLIED |
| HB0-BS | S14 pointer (HB-0 first rider) | inline | 2958 | APPLIED |
| HB0-CB | refinement 17 (C5: CHANNEL_BANDS pin) | inline | 2975 | APPLIED |
| HB1 | FIRST-VISIBLE/TIER HB-1 | after | 2988 | APPLIED |
| HB1-MM | refinement 5 pointer (HB-1 martialMoves) | inline | 2993 | APPLIED |
| HB1-F | refinement 5 pointer (HB-1 fortify) | inline | 2998 | APPLIED |
| HB1-REG | fork registry 104 rows (fold §2) | inline | 3017 | APPLIED |
| HB1-812 | refinement 6 pointer (HB-1 size move) | inline | 3053 | APPLIED |
| HB2 | FIRST-VISIBLE/TIER HB-2 | after | 3068 | APPLIED |
| HB2-S | HB-2 landed shape differs; writeHabits zero callers | after | 3072 | APPLIED |
| HB3 | FIRST-VISIBLE/TIER HB-3 | after | 3102 | APPLIED |
| EDGES | refinement 19 (S15: SHEET_FLOOR + close-1/close-8 edges absent) | inline | 3106 | APPLIED |
| EDGES2 | refinement 19 pointer (HB-3 close 8) | inline | 3115 | APPLIED |
| HB3-Q1 | OD-FC-24 pointer (HB-3 foreign fields) | inline | 3135 | APPLIED |
| HB4 | FIRST-VISIBLE/TIER HB-4 | after | 3186 | APPLIED |
| HB4-S2 | refinement 18 (C6: site-2 pin) | inline | 3205 | APPLIED |
| HB5 | FIRST-VISIBLE/TIER HB-5 | after | 3210 | APPLIED |
| HB5REL | fold §3.2.9 (HB-5 joint unit) | inline | 3213 | APPLIED |
| HB5-812 | refinement 6 pointer (HB-5 812) | inline | 3215 | APPLIED |
| HB6 | FIRST-VISIBLE/TIER HB-6 | after | 3275 | APPLIED |
| HB7 | FIRST-VISIBLE/TIER HB-7 | before | 3303 | APPLIED |
| HB7-S | refinement 21 pointer (HB-7 charter) | inline | 3318 | APPLIED |
| HB7-C9 | C9 (counterWeight scope in HB-7 pins) | inline | 3329 | APPLIED |
| HB7-D | fold §3.1.12 pointer (HB-7 damper mutant) | inline | 3331 | APPLIED |
| HB8 | FIRST-VISIBLE/TIER HB-8 | after | 3337 | APPLIED |
| HB8-SF | refinement 19 pointer (HB-8 SHEET_FLOOR) | inline | 3339 | APPLIED |
| HB8-L | refinement 7a pointer (HB-8 SEVENTH) | inline | 3343 | APPLIED |
| HB8-P | fold §3.2.8 pointer (HB-8 (c)) | inline | 3345 | APPLIED |
| HB8-V | refinement 15 pointer (HB-8 (d)) | inline | 3346 | APPLIED |
| HB8-SPD | refinement 9 pointer (HB-8 dark-forever) | inline | 3349 | APPLIED |
| HB9 | FIRST-VISIBLE/TIER HB-9 | after | 3365 | APPLIED |
| WC | refinement 9 pointer (wave count) | inline | 3403 | APPLIED |
| S5-1 | refinement 9 pointer (§5 reason 1) | after | 3433 | APPLIED |
| S5-2 | refinement 6 pointer (§5 reason 2) | inline | 3436 | APPLIED |
| S5-R | refinement 9 pointer (§5 ordering risk) | inline | 3452 | APPLIED |
| S5-C1 | refinement 9 pointer (§5 clause 1) | inline | 3470 | APPLIED |
| S5-C2 | refinement 3 pointer (§5 clause 2) | inline | 3477 | APPLIED |
| S5-C5 | fold §3.2.9 pointer (§5 clause 5) | inline | 3504 | APPLIED |
| JHB2 | refinement 23 pointer (J-HB-2) | inline | 3529 | APPLIED |
| JHB8 | S13 pointer (J-HB-8) | inline | 3592 | APPLIED |
| Q1 | OD-FC-24 (Q-HB-C, the two foreign fields) | after | 3935 | APPLIED |
| Q4 | S12 pointer (Q4) | inline | 4048 | APPLIED |
| SR3 | refinement 7a + 9 pointer (seam row 3) | inline | 4085 | APPLIED |
| SR4 | fold §3.2.8 pointer (seam row 4) | inline | 4086 | APPLIED |
| SR6 | refinement 10 pointer (seam row 6) | inline | 4088 | APPLIED |
| S83 | refinement 6 pointer (§8.3) | inline | 4136 | APPLIED |
| EPJ | refinement 12 (X6: stated identically) | after | 4142 | APPLIED |
| HORIZON | req 23 / findings EP X11 (the 29-record horizon) | inline | 4217 | APPLIED |
| LIGHT | OD-FC-30 (HB-D lighting shift) | inline | 4291 | APPLIED |
| FOOT | footer census (overturned (b), (e)) | after | 4334 | APPLIED |
| S9 | refinement 25 (sidecar move: recorded, not executed) | after | 4349 | APPLIED |
| OVER | refinement 20b (over-claimed agreement) | before | 4448 | APPLIED |

## Findings §10 refinement → entry
R1→STATUS · R2→R2 · R3→SHAPE (+V, SEAT, S5-C2, HB2-S) · R4→CAP (+BYTES) · R5→R7 (+S05-3, C7, HB1-MM, HB1-F) · R6→812 (+HB1-812, HB5-812, S5-2, S83) · R7→LEGREFS + C1 (+HB8-L, SR3) · R8→PLANT (+PLANT1, PLANT2, HB8-P, SR4) · R9→SPD (+E3, TAP, HB8-SPD, WC, S5-1, S5-R, S5-C1, SR3) · R10→IN3 (+AWARE, SR6, HB7-D) · R11→SECOND · R12→EPJ · R13→PAYOFF + DECISIVE (+DELTA) · R14→LAST · R15→SHIFTED (+HB8-V) · R16→LAWBAND (+HB0-LAW) · R17→HB0-CB · R18→HB4-S2 · R19→EDGES (+EDGES2, HB8-SF) · R20→SEVEN + OVER · R21→SEAMS (+SEAM2, HB7-S) · R22→DARK · R23→GENERALS (+ACCRUAL, JHB2) · R24→DMEDIT · R25→S9 (recorded, not executed — see below). All 25 APPLIED.
§5 contradictions not in §10: C7/X17→C7 · C9→HB7-C9 (C1-C6, C8, C10 are §10 rows). §6 stale premises not in §10: S12→R5 (+Q4) · S13→R8 (+PN413, JHB8) · S14→R3 (+HB0-BS). Overturned (e) "EIGHTEEN premises"→FOOT.
Lane obligations: §3.1.13→LAWBAND/HB0-LAW · §3.2.8→PLANT · §3.2.9→R1/HB5REL/S5-C5 · §3.1.12→AWARE · HB-1 reversals→R7/HB1-* · HB-2 shape + writeHabits→SHAPE/HB2-S/WRITER · SHEET_FLOOR + edges→EDGES · HB-8 SP-D→SPD/HB8-SPD · registry 104/84/20/0→STATUS/HB1-REG · OD-FC-23→FLAGSHIP · OD-FC-24→Q1 · OD-FC-30→LIGHT · req 23 / OD-FC-33→HORIZON (+RING) · vocab doctrine/hold/measured/pin→DOCTRINE/FIRMNESS/MEASURED/PIN · status header→STATUS · FIRST-VISIBLE/TIER→HB0..HB9.

## Deliberate non-applications and placements (with reasons)
- R25 (move §9 + J-HB-23..28 to a `HABIT_COUNT_CENSUS.md` sidecar): NOT EXECUTED. Moving deletes text (breaks insertion-only) and creates a file outside the manifest. Recorded as a CLARIFIED bracket at §9's heading; the move rides the next re-compile. The same bracket warns that §9's body md5 / line count are now pre-fold.
- Placement policy: one full bracket at the site the fold or findings name as primary (e.g. J-HB-2's generals bracket at its first statement in §0.5, the §3.2.8 STRUCK at §3e (3), OD-FC-23 at seam 4′), pointer `[see :N]` at every other site of the same fact.
- Header history lines (147-150: census at `5166a342` — prefixes ELEVEN, bandedStock ZERO, suspicionOf ZERO, 812) are covered by the one status bracket ("this header is history"); no per-line brackets, per the brief's one-bracket header rule.
- C5's second half (seam row 2's "equality in BOTH directions" for the axis vocabulary): not bracketed — findings call it a different object and "mild"; only HB-0's CHANNEL_BANDS pin (the real R9 conflict) is bracketed.
- `doctrineBands` and the other unlanded `doctrine*` tokens (`doctrineSheetOf`, `doctrineTapEnabled`, `DOCTRINE_ADOPT`): the DOCTRINE bracket gives the register's two spellings (`habitSheet`, `habit_sheet_shifted`) and does not invent spellings for the others.
- The flag `doctrineTapEnabled` is unlanded but the register exempts only `believedDoctrineEnabled`; I did not rule on it (see the fold questions).
- Q-HB-E (paid surface) and Q-HB-D's wording are not owner rows in fold §7 except via OD-FC-30; no bracket beyond LIGHT.
- The footer's "the disagreement is a bug to report" vs requirement 22(b): not bracketed (no findings row asks for it).

## For the fold / chair to rule
1. MIS-CITE IN THE FOLD: §2's HABIT row ends "(OD-FC-24)" for the flagship sentence; §7 defines OD-FC-23 = Q-HB-A (the sentence) and OD-FC-24 = Q-HB-C (the two foreign fields). I used §7's definitions; §2's cell needs `OD-FC-24` → `OD-FC-23`.
2. Fold §3.1.13 cites `habitCurve.js:102` for `LEARN_RATES`; the code of record has it at :101 (I cited :101).
3. §5 `hold` → `firmness`: the register names only the SHEET field. The §3g receipt shape carries a second unlanded `hold:` field holding the same rung; I pointed it at the ruling as a PLAUSIBLE extension (RCPT, line 2856). Confirm or narrow.
4. §5 `doctrine`: confirm whether the other unlanded `doctrine*` tokens (`doctrineBands`, `doctrineSheetOf`, `doctrineTapEnabled`, `DOCTRINE_ADOPT`) rename at minting, and whether `doctrineTapEnabled` takes the `believedDoctrineEnabled` exemption.
5. OD-FC-24 says "sign the first only", but §3a, HB-3, HB-5 and J-HB-24 still charter the `treaty.habitEpisode` write. I bracketed at Q1 and pointed from HB-3 only; whether HB-3's charter drops the second carry pin until close 2 asks is the fold's to say.
6. HB-8's tier: the volume says (a)/(d) are "reachable the day this lands", yet `doctrineTapActive` gates the whole flag on `espionageActive`. The DEGRADED ARM line says "per the charter's own reachability claim, else dark". Needs a ruling at HB-8.
7. Fold §3.2.8 says the planted sheet enters "through the commission fold". I named it as `processLies`' `commissionedPlants` (informationStatecraft.js:549-658). Confirm that this is the fold meant.
