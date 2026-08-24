# TE-DW-FIX receipt

STATUS: STARTED 2026-08-24
LANE: TE-DW-FIX — READ-ONLY measurement. No vitest, no npm, no worktree, no repo writes.
GATE: ODQ §545.4 — the dwellings charter fixture-kind list claims "the tranches' union,
de-duplicated" and is not. Mechanically re-derive the union; itemise the delta vs the shipped 60;
resolve `portableFurnaces`; rule on whether 82 holds.

SLOT (per brief): claude/composite-r4 = 510c51b766a4ef329a697d61f3006e23d4fb2325
⚠ DIVERGENCE NOTED: LANE-LAW.md line 3 names the slot as 79b78881ca86612ec312602c2e3dc6d06aa34df8.
   The brief is newer; I use 510c51b76 and record the discrepancy.
BUNDLE: refs/preserve/research-dossiers-2026-08-23 = 029268fe5 (ORPHAN — research ground truth only)

## RESUME POINT
DONE: nothing yet (just started)
NEXT: verify both shas resolve; extract the compiled charter and the 8 research drafts with
      braced ${SHA}:path and byte counts.
CMD:  git -C /Users/cstokes/Desktop/settlement-engine cat-file -t 510c51b766a4ef329a697d61f3006e23d4fb2325

## CHECKPOINT 1 — inputs verified, control established, method defect found
- Slot 510c51b76 and bundle 029268fe5 both resolve; `git merge-base` exits 1 (orphan confirmed).
- Charter extracted 129,030 B / 1,102 lines (matches brief exactly).
- Frozen draft `charters/draft-DWELLINGS-CHARTER.md` extracted 237,547 B / 3,070 lines (matches ls-tree).
- §2.3's list parsed mechanically: **60 segments, 60 distinct lowercase — AR-7's recount CONFIRMED.**
- `FURNISHING_KINDS` at slot = exactly 22 members (interiorTemplates.js, 10,471 B). 22+60=82.
- HAND CONTROL: R-INST-5 L1081 (Uraniborg) hand-enumerated = 21 tokens. Extractor v1 = 21. MATCH.
- ⛔ **METHOD DEFECT FOUND.** DW-0's recorded rule ("backticked UPPER_SNAKE token from each
  fixtures[] block") is blind to two of the corpus's THREE registers:
    (1) backticked UPPER_SNAKE  -- R-INST-1/3/4/5
    (2) bolded marker + lowercase backticked -- R-INST-6 (8 blocks, ALL invisible to v1: v1 got 0)
    (3) bare prose marker + unbackticked items -- R-INST-2 (the very rows the shipped 60 drew from:
        `tan pit`, `tenter`, `loom`, `staddle`, `bin`, `louvre`, `chute`)
  Extractor v2 (all three) finds **85 spans**, equal to the raw `fixtures[` hit count. v1 found 65.

## RESUME POINT
DONE: inputs verified w/ byte counts; 60-list parsed; 22 FURNISHING_KINDS read at slot; control 21/21;
      v2 extractor finds all 85 spans.
NEXT: dump all 85 spans verbatim and adjudicate every token into (a) genuine miss (b) structural
      bucket / not-a-fixture (c) fairly-consolidated variant.
CMD:  D=<dwfix> node <dwfix>/dump.js

## CHECKPOINT 2 — GATE DISCHARGED (measurement complete)

### The extraction rule (v4, reproducible)
SPAN  = from the literal marker `fixtures[` OR `fixtures:` in any of its FOUR observed dressings
        (backticked / bolded / bare-prose / bracketless) to the earliest of a fixed terminator set
        (paragraph break, next bullet, `Structural`, `Engine`, `Anchors`, `Licensing`, `Buckets:`,
        `Wear:`, `Decline`, `. HOME:`, sibling typed-field labels).
TOKEN = top-level split on `,` `;` `MIDDLE DOT`, ignoring separators inside ( ) { } [ ].
NORM  = strip backticks/bold; strip `{qualifier}` NESTED-SAFE but RETAIN it for matching
        (`STACK{bone}` is the corpus form of the 60-list's `bone stack`); lowercase; `_`->space.
MATCH = against ALL 82 (22 FURNISHING_KINDS + the 60), at EXACT / HEAD-noun / ANY-WORD levels.
RESULT: 102 spans, 861 token instances, 713 distinct keys.

### Controls (all three executed)
- CONTROL (accuracy): R-INST-5 L1081 Uraniborg, hand-enumerated 21. Extractor returns 21. MATCH.
- CONTROL (can OVER-count): removing the bucket terminators makes the same span return 28 —
  it swallows the 7 `Structural buckets:` items. The instrument reds when mutated.
- CONTROL (can MISS): DW-0's own recorded rule (backticked UPPER_SNAKE only) returns
  **0 spans / 0 tokens on R-INST-6**, against a hand count of 8 blocks / 75 tokens.

### The answer
82 = 22 + 60 CONFIRMED as arithmetic (60 segments, 60 distinct — AR-7's recount holds).
82 REFUTED as "the tranches' union". TRUE UNION = **135** (82 + 53 genuine misses).
SENSITIVITY: floor 106 / ruled 135 / ceiling 563. **Every rule exceeds 82.**
Adjudication of all 481 unmatched keys: (a) 53 genuine · (c) 277 variants · (b) 147 not-fixtures
· 14 parse noise. Integrity 481/481, zero unadjudicated, zero stray.

### Engine facts resolved AT THE SLOT (full walk of all 2,185 src files)
`portableFurnace` 0 · `flue`/`flues` 0 · `flueCount` 0 · `furnace` 7 occurrences in 3 files, ALL PROSE.
The DW-5d arm names THREE quantities and the engine types NONE of them.

## RESUME POINT
DONE: gate discharged. Union, three-way delta, portableFurnaces resolution, 82 verdict all measured.
NEXT: nothing — lane complete. Report delivered to chair. No repo writes made.

## CHECKPOINT 3 — RE-DERIVED under the chair's struck alembic/condenser-loop precedent

RULING APPLIED: a fixture is a FIXED INSTALLATION -- a property of the ROOM, not of whoever works
there. Movable bench equipment is not a fixture kind. Legibility is carried by ATTRIBUTES, not
members (the same reasoning that makes RING_TABLE = table{shape}, not a genuine miss).

TRAP AVOIDED: a naive grep for the vessel family caught `cistern` ("stored-water vessel") and
`immersion pool` ("bath is a heated vessel") on a PROSE MENTION of the word. Neither is a
vessel-family member; both are fixed installations and both SURVIVE. Family membership was
re-derived by CONSOLIDATION TARGET, not by word occurrence. True family = 8 rows:
aludel · blowpipe · crucible · cucurbit · drug jar · pots · pots set · receiver.

### FLOOR CHECK (the chair's stop condition) -- PASSED
vessel-family rows carrying a NO TYPED HOME flag: **0**. The floor's family count is UNCHANGED
at 24. The floor moves 106 -> 105 only because the BASE moves 82 -> 81 when `alembic` leaves.
The chair's reasoning is confirmed by measurement, not assumed.

### THE RE-DERIVED NUMBER
  AS REPORTED (precedent intact)   base 82 + 53 = **135**   floor 106 / ceiling 549
  READING A  chair's explicit strike (vessel struck; `alembic` leaves the 60)
                                   base 81 + 52 = **133**   floor 105 / ceiling 540
  READING B  test applied consistently (also strikes die/stamp, mould, scrutiny urns,
             touchstone, bier; `cupel tray` also leaves the 60)
                                   base 80 + 47 = **127**   floor 102 / ceiling 524
BOTH readings clear 82 by a wide margin. STOP CONDITION NOT TRIGGERED.

RECOMMENDED TO THE CHAIR: **READING A = 133**. Reading B is the same test applied to five more
families and is offered, not taken -- the chair struck one family and gave the principle; extending
it to `bier`, `touchstone`, `die/stamp`, `mould`, `scrutiny urns` and to the shipped `cupel tray`
is a further ruling, not an inference. Flagged either way: `crate`, `barrel` and `ledger` are
movable and are ALREADY SHIPPED in the landed 22 -- the test cuts against them too, and striking
landed members is a live-render change, out of this lane's scope.

## RESUME POINT
DONE: gate discharged AND re-derived under the struck precedent. Floor check passed.
NEXT: nothing -- lane complete, standing down. No repo writes made at any point.

## CHECKPOINT 4 — CONFIRMED under the chair's REVISED rule (granularity, not fixedness)

REVISED RULE: does the vocabulary name things at the granularity a dossier reader needs?
Finer distinctions are ATTRIBUTES, not members.  `table`+shape · `vessel`+kind · `furnace`+flued.

⚠⚠ **THIS IS THE RULE THE ORIGINAL ADJUDICATION ALREADY USED.** The family-head discipline
("each genuine gap gets ONE entry, its spellings fold in") IS the revised rule. So the revised
ruling reproduces the ORIGINAL figure exactly, and no re-adjudication was needed -- only
verification. Preconditions verified AT THE DATA, not assumed:
  `alembic` in the 60 = true · `cupel tray` in the 60 = true · base 22+60 = 82
  `vessel` = ONE member with 8 rows folding in (aludel · blowpipe · crucible · cucurbit ·
     drug jar · pots · pots set · receiver)
  `bier` · `touchstone` · `die/stamp` · `mould` · `scrutiny urns` each stand as their own member
  landed 22 members touched: **0** -- crate/barrel/ledger never entered the adjudication at all

### ⛔ THE NUMBER IS 135, AND IT MOVED BY **TWO**, NOT ONE — reported as the chair required
  Reading A was base 81 + (a) 52 = 133.
  The revision restores TWO INDEPENDENT THINGS, not one:
     (1) `vessel` restored as a member : (a) 52 -> 53   (+1)
     (2) `alembic` restored to the base: base 81 -> 82  (+1)
  133 + 1 + 1 = **135**.
  ⚠ This is NOT the consolidation misbehaving. The chair's revised ruling PROSE contains both
  restorations ("alembic therefore stays in the 60"; "the base back at 82"); the chair's
  arithmetic SKETCH carried only one and landed on 134. The chair's own stated premises
  (base 82, vessel restored) give 82 + 53 = 135. The prose is right; the sketch dropped a step.

  UNION 135 · three-way delta (a) 43 / (c) 277 / (b) 147 / noise 14
  SENSITIVITY: FLOOR **106** (family count back to 24) · RULED 135 · CEILING 549
  No landed member touched.

### Residual granularity — OFFERED, NOT TAKEN
Three pairs in the 53 could arguably collapse under the revised rule: `immersion pool`->`bath`,
`grindstone`->`mill`, `beam`->`workbench`. Collapsing all three gives 132. NOT taken --
recommending 135 and leaving the call to the chair. Verified NOT candidates: grille/hatch,
basin/cistern, portcullis/drawbridge, chest/key board, sawpit/jointer.

### ⭐ STANDING LAW RECORDED BY THE CHAIR THIS EXCHANGE
1. **Derive family membership by CONSOLIDATION TARGET, never by word occurrence.** A prose
   mention of "vessel" in the notes for `cistern` ("stored-water vessel") and `immersion pool`
   ("bath is a heated vessel") nearly deleted two genuine FIXED fixtures and would have reported
   a number two low WITH NO SIGNAL. Third word-occurrence bite in this estate today.
2. **Offer a wider inference; do not take it.** Reading B was computed and offered rather than
   applied. The chair's words: an inference drawn silently on his behalf "would have shipped my
   error at a larger scale." The refusal to extend a ruling is what surfaced that six more rows
   failed the test, three of them carried NO TYPED HOME flags, and three LANDED members failed
   it too -- which is what convicted the fixedness axis and produced the granularity rule.

## RESUME POINT
DONE: gate discharged; re-derived twice; final figure CONFIRMED at 135 under the revised rule.
NEXT: nothing -- lane complete, standing down. Zero repo writes at any point.

## CHECKPOINT 5 — THE (a) FIGURE RECONCILED AT THE DATA. 135 STANDS.

⛔ **TWO DENOMINATORS, AND THE REPORTS NEVER NAMED WHICH WAS WHICH.** The chair's third option
is correct. Neither 43 nor 53 is wrong; they count different things:
  **(a) ROWS   = 43** — adjudication keys categorised A. Sums with (c) 277 + (b) 147 + noise 14
                        to exactly **481**, the NONE set. The "481/481, zero unadjudicated"
                        integrity claim was and remains TRUE — it was always a ROW claim.
  **(a) MEMBERS = 53** — 43 explicit A rows + **10 FAMILY HEADS THAT ARE NOT ROWS AT ALL**.
                        The union uses MEMBERS: 82 + 53 = **135**.

**The mechanism is NOT the chair's guess (any-word rescues).** A key that matched at head-noun or
any-word level never entered the NONE set and so was never adjudicated — it cannot be an A. The
real mechanism: **10 family heads never appear as a bare token anywhere in the corpus.** No tranche
writes `vessel`, `bath`, `furnace`, `hanging`, `basin`, `mill`, `hoist`, `mould` or `die/stamp` as a
standalone fixture name — they appear only as `CUCURBIT`, `BALNEUM`, `LAMP_FURNACE`, `MARKET_SCALES`
and so on. A head that is never spelled cannot be a key, so it is a MEMBER without being a ROW.
The ten: vessel · hanging · bath · furnace · scales · basin · mill · hoist · mould · die/stamp.

### The three inconsistent statements, each accounted for
1. **Report 1's table summing to 491 — MY ERROR.** I put the MEMBER count (53) into a table whose
   other three cells were ROW counts. Correct row table: **43 / 277 / 147 / 14 = 481**.
2. **Report 2's Reading A (43/269/155/14 = 481) — CORRECT** for the vessel-struck state. `(a)` rows
   stayed 43 because all 8 moved rows were `C` rows; the `vessel` head is head-only, so striking it
   removes a MEMBER (53->52) without removing any A ROW. Internally consistent, not contradictory.
3. **Report 3 (43/277/147/14 = 481) — CORRECT** for the nothing-struck state.

### The fourth figure: FINAL-A.txt
The file holds **53** members. `wc -l` reports 52 because the file has **NO TERMINAL NEWLINE**
(last byte 0x6c, 'l', from "vessel"); `grep -c .` reports 53. Verified set-identical to the
computed 53, `vessel` present. The artifact supports 53, not 52.

### Ceiling reconciled
563 (report 1) counted ALL 481 unmatched keys as candidate members. 549 (report 3) excluded the
14 parse-noise rows. **I changed the definition between scripts and did not say so.**
CORRECT = **549** — parse noise is not a candidate member.

### A real defect found in my own TSV, count-invariant
Row `scales C scales (A-head)` names ITSELF as its head. Had it been written `A`: explicit A rows
43->44, head-only 10->9, **MEMBER TOTAL UNCHANGED at 53**, row total unchanged at 481.
Recorded rather than silently patched; it moves no reported figure.

### FINAL, RECONCILED
  base 82 · (a) MEMBERS 53 · (a) ROWS 43 · **UNION 135**
  three-way delta (rows, /481): (a) 43 · (c) 277 · (b) 147 · noise 14
  sensitivity: FLOOR 106 · RULED 135 · CEILING 549
  offered collapses: chair ruled TAKE NONE. No landed member touched.

## RESUME POINT
DONE: gate discharged; re-derived twice; (a) reconciled across both denominators. 135 final.
NEXT: nothing -- lane complete, standing down. Zero repo writes at any point.
