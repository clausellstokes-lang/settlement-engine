# TE-DW-PREP receipt — READ-ONLY prep lane

STATUS: **STARTED** 2026-08-24
Chair: Fable 5. Lane: TE-DW-PREP. Mode: READ-ONLY (no vitest, no npm run check*, no worktree, no repo writes).
Slot under measurement: `claude/composite-r4` = c3289244d58b7259205d80594856e8e0cc520817 (brief says 60 cars / packets 179).
NOTE: LANE-LAW.md still names slot 510c51b766a4ef329a697d61f3006e23d4fb2325 (54 landings / packets 177). Brief is newer; I measure at c3289244d.

## RESUME POINT
Done: receipt opened.
Next: read charter `${LEDGER}:docs/DW0-CHARTER-COMPILED.md`, fixture gate outputs, ODQ rows.

## CHECKPOINT 1 — inputs read, and the §F.0 decay is already visible
- Charter extracted 129,030 B / 1,102 raw lines (918 non-blank). MATCHES brief exactly.
- Charter's OWN declared base is `79b78881ca86612ec312602c2e3dc6d06aa34df8` (54 landings) — NOT 510c51b76,
  NOT the slot. **32 commits separate the charter's base from the slot c3289244d.**
- Ancestry PROVED with `--is-ancestor` (status, not string): 79b78881 -> ANC=0; 510c51b76 -> ANC=0.
  Both ancestors of c3289244d. So the charter's base IS reachable and its rows are re-measurable.
- ⛔ In those 32 commits I can already read CH-3 (14 commits), CG-2 (4 commits + MF-CG2 mint),
  CH-5/Shape F (3 commits + MF-CH5 LANDED), AIP-2. The charter files ALL of CH-3, CG-2 and CH-5
  as **OUTSTANDING**. Re-measuring now.
- Fixture gate read: union 135 = base 82 + 53 MEMBERS (43 A ROWS + 10 head-only). FINAL-A.txt = 53
  by `grep -c .` (52 by `wc -l`; no terminal newline — confirmed independently this lane).

## RESUME POINT
DONE: charter fully read (§A..§K + amendment record); fixture-gate receipt + FINAL-A + adjudication2 read.
NEXT: re-measure every §F.0 row at c3289244d; then map the 53 to cars; then B11 resize.

## CHECKPOINT 2 — the fixture arithmetic REPRODUCED independently; §F.0 decay measured
- Re-derived the fixture gate's whole tally from its own TSVs, denominators named:
  481 adjudication ROWS = 43 A + 147 B* + 277 C + 14 N.  43 A rows + 10 head-only = **53 MEMBERS**
  = FINAL-A.txt's 53 (graphic lines; `wc -l` says 52, no terminal newline — confirmed this lane).
  Every DWFIX figure CONFIRMED by independent recomputation. Union 135 = 22 + 113. STANDS.
- ⛔ B* CLASS TALLY (denominator 147) — this RESIZES B11 differently than the brief states:
  BE 73 ENVELOPE (a surface NO charter vocabulary owns) · BR 39 (another EXISTING DW vocabulary)
  · BX 16 (declared RECESS/SUBDIVISION, which B11's 5-set OMITS) · BS 19 (no vocabulary at all).
- The 53 crossed against LANDED vocabularies: 0 vs ROOM_KINDS(28), 0 vs FURNISHING_KINDS(22),
  0 vs JOINT_KINDS(5). Exactly **1** collision with B11's known 20: `cistern` (becomes 3-way).
  2 substring hazards: grep "bar" also matches `drawbar` and `barred grille`.
- §F.0 DECAY MEASURED at c3289244d: **CH-3 LANDED** (minTier 36->10 = -26 exactly),
  **CH-5 LANDED** (ARCANE_INST_TAGS = ['arcane','planar','enchanting'] — `alchemy` gone),
  **CG-2's code LANDED** (TC4_ROW_BYTES_BAND now DERIVED). Charter files all three OUTSTANDING.
- ⛔ §B's headline figure DECAYED: CH-3 shipped a REVISED §3.2 — `exclusiveGroup` NOT deleted
  (`religiousCenter` still 7 occurrences, unchanged); ROSTER_CHANGED **30 of 420**, not 81;
  **123** new name strings, not ~130.
- CONFIRMED-UNCHANGED (reporting both directions): ROOM_KINDS 28 @:35 incl stall+dais ·
  FURNISHING_KINDS 22 @:50 · INTERIOR_KINDS 8 @:29 · interiorKindOf @:172 ·
  compendium roomKinds 28 @:409 · CatalogHubs @:66 · CEILING 17, banked 11 ·
  VIEWING_PAYWALLS_PENDING_514 = 3 · JOINT_KINDS 5 · connectivity 28,261 B · property 9,141 B ·
  `\binteriorKind\b` = 0 in src (C-24 HOLDS).
- ⚠ LANE-LAW's own census tuple is stale: titles 21017->**21026**, suiteTitles 5847->**5848**
  at the slot; files/parked/credited unchanged at 2525/366/2159.

## RESUME POINT
DONE: all measurement complete except CH-4/CH-6/CH-2B status and the compendium-regen risk.
NEXT: those two, then compose the four deliverables into the brief.

## CHECKPOINT 3 — LANE COMPLETE. Brief delivered.

DELIVERABLE: `laneDWPREP-BRIEF.md` (this directory). Zero repo writes at any point —
no vitest, no `npm run check*`, no worktree, no packet, no commit, no pin, no push.

### The five answers, one line each
1. **The 53 -> the charter.** ONE owning car: **DW-1b**. Four charter sites carry `82` and must move
   together to **135** (`22 + 113`): §D taxonomy row, §G DW-1 EXIT, §H G8, §I C-25's provisional flag.
   23 of the 53 create a seam obligation on another car (DW-1a 4 · DW-1d 6 · DW-1e 3 · DW-5d 1 ·
   10 heads needing an attribute domain); the other 30 are clean single-vocabulary adds.
2. **The arm.** `furnace` ✓ supplied · `flued` needs a fixture-attribute map the charter has no
   mechanism for · ⛔ **`flueCount` is STILL 0 of 2,185 src files — the rewrite swaps one undefined
   symbol for another.** Recommended split: arm 4a (totality + unflued-EXISTS, live at DW-1b with a
   convicting mutant) and arm 4b (the `<= flueCount` inequality, deferred to DW-2b with a NAMED home).
3. **§F.0.** Three rows MOVED: CH-3 LANDED, CH-5 LANDED (G3 discharged), CG-2's code LANDED.
   Nine rows HOLD. ⛔ Decayed integer: §B's `81 of 420 / ~130 names` is **30 of 420 / 123 names**, and
   the MECHANISM changed — `exclusiveGroup` was never deleted.
4. **DW-1 brief.** 6 cars, INERT, serialized 1a->1b. 15 exit criteria as integers. ⛔ Only FOUR
   figures are provisional and **none of them is provisional on CH-6** — measured and refuted.
   The real unrun blocker is **C-19's sub-form recount**, ruled and never executed, blocking DW-1d+1e.
5. **B11.** Not 20 -> 147. **20 -> 36 names across 8 vocabularies in 2 arms**, plus one open chair
   ruling (the ENVELOPE, 73 tokens with no vocabulary anywhere). The 53 cost it exactly **+1**.

### Verification of the load-bearing claim (three instruments + a working control)
Claim: no DW-1 figure is CH-6-derived. Proof: `compendiumData.generated.js` is byte-identical across
the 32-commit gap in which CH-3, CH-5 and CG-2 all landed — blob `3b1bf2c25`, 98,359 B at BOTH ends;
absent from `git diff --name-only`; absent from `git log -- <path>`. **CONTROL: the same three
instruments DO report `src/data/institutionalCatalog.js` as moved across the same range**, so the
instrument can fail and did not. `arcaneInstitutionVocabulary.js` (CH-6's file) is not a generator
input; CH-5 moved 0 catalog name-keys.

## RESUME POINT
DONE: everything. Lane complete, standing down.
NEXT: nothing. Chair reads `laneDWPREP-BRIEF.md`; §6 is the disagreement table, §4.5 the dispatch call.

## CHECKPOINT 4 — FINAL. Chair's four rulings folded. Session ending; successor handoff.

DELIVERABLE ON DISK: `laneDWPREP-BRIEF.md` — **read its §0 first, it states where the document stops.**

### The four rulings, all folded
1. **RECORD MAP (branch A)** — `FIXTURE_KINDS` becomes `{kind, attrs}` + `FIXTURE_FOLD`. Two new arms:
   TOTALITY (10 heads declare a domain) and CONSOLIDATION (no folded spelling is itself a kind;
   mutant = re-add `crucible`). ⛔ **DW-1b = 7 arms / +7 titles; wave census 30 -> 33; the `+6 eff`
   estimate was sized for 60 members, not 113 — and records triple, not double. RE-CUT IT.** → brief §2
2. **4a/4b SPLIT** — 4a live at DW-1b (totality + unflued-EXISTS; mutant = set every `flued` true).
   4b (`<= envelope.flueCount`) deferred to **DW-2b** with a named home. → brief §3
3. **NO CH-6 GATE for DW-1** — 3 instruments + a live control. → brief §5.4
4. **ENVELOPE its own vocabulary** — costed ~20 members (floor 18 / ruled ~20 / ceiling 73),
   ⚠ SAMPLE GRADE not adjudicated. ⭐ `service{flue}` is the producer that unblocks arm 4b.
   ⛔ The CAR is a separate call: DW-1g recommended, **J-DW0-2 ("41 cars stands") is the cost.** → brief §6

### The four `82` sites that must move TOGETHER to `135`
charter L570 (§D taxonomy row) · L107 (§G DW-1 EXIT) · L210 (§H G8) · L79 (§I C-25, discharge the flag)

### The five `interior/` citations to correct (NOT three — line-numbered ones are the dangerous set)
L512 · L539 · L568 · L754 · L1003 → all need `src/domain/interior/…`.
Bare mentions, lower risk: L661, L772, L1084. Already correct: L658.

### C-19 lane, dispatchable cold → brief §7
Source `029268fe5:charters/draft-DWELLINGS-CHARTER.md`. CIRC **L809-848** (claim ~55 at L826);
STOR **L849-885** (claim ~35 at L851). Five claim sites move together: L826, L851, L1047, L1894,
L2992-2993. ⚠ FIRST-PASS SIGNAL ONLY: naive distinct **86** circ / **69** stor — both understated,
same direction as 82->135. ⭐ CIRC x STOR collisions = **0**, one B11 arm already discharged.
Use node — `git grep -E` ignores `\b` and ugrep fails silently on bounded repetition.

### Record findings
✅ LANE-LAW re-stamped by the chair (21026/5848, packets 179, slot c3289244d) — CLOSED.
⚠ Unlogged conflict: architecture `:1568` puts DW-1f parallel, charter §F.4 serializes it. §I has no row.

## RESUME POINT — LANE COMPLETE, STANDING DOWN
DONE: everything. Four rulings folded, brief written to disk, receipt closed.
NEXT: nothing from me. Successor reads `laneDWPREP-BRIEF.md` §0 (completeness map), then §7 to
dispatch the C-19 lane and §6.3 for the one open chair call (the ENVELOPE car vs J-DW0-2).
ZERO repo writes at any point in this lane.
