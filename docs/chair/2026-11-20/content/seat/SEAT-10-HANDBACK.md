# SEAT-10 — HAND-BACK (kept current at every push; first written 2026-11-21T23:21:00Z, read from `date -u`)

**For the next owner of this lane:** you need this file, `SEAT-9-HANDBACK.md` (items 80 to 85), `SEAT-7-HANDBACK.md` (items 69 to 79, §2 to §7), `SEAT-6-TO-LIGHT.md` and `briefs/`.

The rulings in force are SEAT-5's 1 to 52, SEAT-6's 53 to 68, SEAT-7's 69 to 79, SEAT-9's 80 to 85, and this file's 86 on.

SEAT-10's assignment is `docs/chair/2026-11-21/eighth/prompts/SEAT-10.txt` on `origin/lane/chair-2026-11-08`, from `12efb6f5f` on.

The chair is the eighth chair, session_01ACmDYY29VRchM87v1yhL9Q.

## 0. WHERE THE LANE STANDS (brought up at 2026-11-22T00:04:37Z, read from `date -u`)

- **Lane tip:** `lane/seat-10-2026-11-21`, pushed with this file.
  - **The base:** fast-forwarded at 23:41:11Z (from the reflog) to the chair's base `3e6894120`, which is `3e8e2e37d` (SEAT-9's tip) plus the line `a64619510` (point 86) plus this seat's `f82c2a183` (item 88).
  - **The lane's own commits since:** `18530fc0d` (unit 2's docs, the re-cut script); `5e26f4062` (wiring census); `ef5abf4da` (lighting census); `9fa2612b1` (KEY-PROBE's play addendum); `70e4e1945` (writer-reach, item 89); `5c9fa5b81` (unit 2's play-time answer, item 90).
- **The working line:** `lane/join-2026-11-14` has moved to `89ab44e34` (point 87, the sameness door: no `src/`, two new `tests/lint` walkers). By the chair's word of 23:41Z the lane stays on `a64619510` for the census; the chair joins the newer line at the landing.
- **UNIT 1 (the line): DONE except its proofs in flight.**
  - **The doors:** each re-taken by its own door, red before and green after: the wiring census, the lighting census, writer-reach (on the chair's three-way condition, item 89). The `npcGenerator.js` size baseline needed nothing: `sizeBaseline.test.js` is green at 930. The mutation manifest, the chair's union, is green.
  - **IN FLIGHT:** `tests/lint` whole, started at `ef5abf4da` before the writer-reach door. It is expected to read writer-reach red, the door's prior state; that walker was re-run green at `70e4e1945`.
  - **NEXT:** confine-two `3e8e2e37d` → tip, as asked; it is expected to DIFFER by the line's own causes. Then `a64619510` → tip, the lane's dark over the line, expected EQUAL.
- **UNIT 2: DONE.**
  - **At birth (item 87):** accepted by the chair at 23:42Z.
  - **Over play time (item 90):** sent to the chair with this push.
- **UNIT 3 (the flip's census, re-cut):**
  - **The flipped clone:** made by `recut/recut.sh prep` at `ef5abf4da` in the scratchpad (`census-flip`, exactly the two dials). Its `src/` and `tests/` equal the tip's, because the doors since touched only registers under `scripts/`, `docs/` and `tests/lint/.lighting-census-baseline.json`.
  - **NEXT:** `sets`, then flipped shards 1 and 2 of 2, then the control's 1 and 2, then `lists`. One run at a time.
- **UNIT 4 (rule 8, "SEAT <commit>"):** not started.
- **OUT:** none. BKP is finished.
- **The wip branch** `lane/seat-10-2026-11-21-wip` (`2b3489eef`) is superseded: everything on it is on the lane.

## 1. RULINGS AND FINDINGS SINCE SEAT-9's HAND-BACK

86. **THE LINE'S MERGE WAS REFUSED BY THIS SEAT'S PERMISSION CHECK (23:20Z).** By COMMON-EIGHTH 8 the refusal stands. It went to the chair in one line, and the chair's word decides the route.

87. **THE KEY QUESTION, ANSWERED BY MEASURE (BKP, `briefs/KEY-PROBE.md` → `keyprobe/keyprobe.md`; CONFIRMED by run at `f82c2a183`). No key path is new under law 2 at birth.**
   - **Pairs:** 166 birth pairs (the corpus's `CONFIGS × SEEDS` 16, plus 6 sizes × 25 germanic seeds), each born with `_seatLawVersion` 1 and 2 through `generateSettlementPipeline`.
   - **Result:** law 2 writes no key path that law 1 lacks, and the reverse holds too. There are 1,028 paths under each law with the corpus's fold and 1,068 with no fold.
   - **Both contest dials:** the result is the same with the contest dark and lit (a scratch clone, one edit). Arm B's law-1 births equal arm A's on 10 of 10 hashed pairs.
   - **Law 2 acts:** law 2 moves values on 10 of 10 hashed pairs.
   - **Caveat:** the marker `_seatLawVersion` on `config` and `_config` is absent from the corpus. Its one reader, `seatLaw.js :: resolveSeatLawVersion`, uses computed access, which the scan cannot see, so it is no finding and there is no baseline row.
   - **So:** no explained-writer row is owed.
   - **Not measured:** play-time writes (the pulse and the coup, where the contest dial is read).
   - **Seen in passing, PLAUSIBLE:** on the 10 hashed pairs the lit contest leaves the law-2 birth byte-equal. TO-LIGHT §2 expected `factionStanding.js`'s "contestedBy" to move at birth when lit. The census re-cut will show whether it does.

88. **THE LINE CAME IN BY THE CHAIR'S HAND, AND THE LANE TOOK IT BY A FAST-FORWARD.**
   - **The rule:** by the chair's ruling of 23:24Z, a merge of the line into a seat's branch is asked of a seat, never required of it.
   - **The merge:** the chair built `66585d96a`, the line `a64619510` merged into `3e8e2e37d`:
     - `npcGenerator.js :: generateSingleNPC` keeps both sides (read by SEAT-10: correct);
     - the mutation manifest is the union of both sides;
     - the wiring census, writer-reach and lighting registers are byte-equal to the line's;
     - nothing was re-pinned.
   - **The base:** the chair then merged `f82c2a183` into that, giving `3e6894120`. The chair's lane gates at the base were type ratchet 167/167, strict 1113/1113 and eslint 0. The fast-forward was at 23:41:11Z.
   - **The doors, at the base:**
     - (a) **the wiring census:** `5e26f4062`, `producerIndexFiles` 1439 → 1444, 0 rows and 0 bytes moved.
     - (b) **the lighting census:** `ef5abf4da`, files 3723 → 3730, parked 476 → 478, credited 3247 → 3252, titles 31318 → 31412, suiteTitles 8680 → 8706.
     - (c) **the size baseline:** `npcGenerator.js` stays at 930, unchanged and green.
     - (d) **writer-reach:** item 89.
   - **A correction of the chair's (COMMON-EIGHTH 7):** the cloud machine always sets eleven `GIT_*` variables (certificates, credentials and config). Only git's REPOSITORY variables are the hazard: the list that `.husky/pre-push` unsets.
89. **WRITER-REACH, RE-TAKEN BY ITS DOOR ON THE CHAIR'S THREE-WAY CONDITION (`70e4e1945`; the chair's ruling, 23:54Z).**
   - **The question:** the door's `--report` was not identical at the two trees (LIT 701 at the tip and the lane, 700 at the line), so under COMMON-RULES 9 it came to the chair.
   - **The ruling:** the door may write if every `surfaceReach` row at the tip equals the line's frozen row or the lane's frozen row.
   - **The proof:** a scratch script, `scratchpad/wr-threeway.mjs`, compared the two frozen baselines with the tip's live measure. Of 12,726 rows, 12,720 are equal at all three, 4 equal the lane's, 2 equal the line's, 0 equal neither; 0 rows are new and 0 are missing.
   - **Identities:** none is new. Judged 12,726 and DARK 1,425 at all three trees.
   - **The door:** `--write` gave cohort 1385 → 1385, with 0 stale and 0 rows now lit.
   - **The walker:** red before (1, `priorityMilitary on config`), green after (52/52).
   - **The security reader's table** is §5.
90. **THE KEY QUESTION OVER PLAY TIME (the chair's addendum, 23:42Z; BKP play mode; CONFIRMED by run at `ef5abf4da` with the contest LIT): no key path is new under law 2.**
   - **What ran:** 30 pairs, 5 a size, both laws. Each pair had six one-month pulse intervals, one DM change and one coup-road transfer. The DM change went through `mutateSettlementChecked` with `CHANGE_RULING_POWER`. The coup-road transfer was a hand-built `power_transfer` outcome in `coup.js`'s shape, applied by `applyWorldPulse.js :: applyWorldPulseOutcomes`.
   - **Result:** law 2 writes no key path that law 1 never writes, at any step. The one raw difference is a runtime-id-keyed `worldState.spatialLedgers.provenance` entry; each law writes 98 entries of that shape, so it is fold noise.
   - **Transfers (law 1 / law 2):**
     - pulse 0 / 0, **so the pulse's own road was NOT measured**;
     - DM 27 / 14 (in 13 pairs the target already held the seat under law 2);
     - coup 27 / 27.
   - **Cost:** 28 s.

## 2. THE UNITS

| unit | branch | state |
|---|---|---|
| 1 THE LINE | `lane/seat-10-2026-11-21` (base `3e6894120`) | merged by the chair, fast-forwarded; doors done (items 88, 89); `tests/lint` whole and confine-two in flight |
| 2 THE KEY QUESTION | BKP (subagent; `keyprobe/`) | DONE at birth (87) and over play time (90) |
| 3 FLIP CENSUS (re-cut) | `recut/recut.sh`; scratch clone `census-flip` at `ef5abf4da` | prepared; shards next |
| 4 RULE 8 | — | not started |

## 3. STORED FIGURES THIS SEAT MOVED

- `docs/content/wiring-census.json`: the stamp `producerIndexFiles` 1439 → 1444, the line's and the lane's new files joined (`5e26f4062`).
- `tests/lint/.lighting-census-baseline.json`: 3723 → 3730 files and the rest as in item 88 (`ef5abf4da`).
- `scripts/.writer-reach-baseline.json`: the four lane rows of §5, `verdictDigest`, `closureSizes`, `population`, `scanStats` and `frozenAtSha` (`70e4e1945`).
- Not moved: `scripts/.size-baseline.json` (`npcGenerator.js` 930) and `scripts/mutation-coverage-manifest.json` (the chair's union).

## 4. HOUSES AND CLASS-TABLE ROWS FOR THE JOIN

None added by SEAT-10.

## 5. FOR THE SECURITY READER: THE SIX WRITER-REACH ROWS THE LINE'S MERGE JOINED (item 89)

Each row's value at the tip was already frozen on one side under that side's own proof. The merge made no reach that neither side held.

| identity | the tip's reach | the side | the unit that moved it, and why |
|---|---|---|---|
| `hidden on factions` | +campaign-pdf (now every surface) | lane | U4-CURE cure 2 (`040221723`). `seatTable.js :: isVeiledRow` reads `hidden` (a hidden or criminal power is VEILED), and the holder leaf (`holderOfSeat.js :: holderOf`) and the contest's kind read take every veiled row OUT of the open field. **The campaign PDF reads it FOR exclusion:** it reaches the PDF through the PDF's power-contest lines (`printProse.js :: buildPrintProse` → `coupContenders`; PLAUSIBLE: read from TO-LIGHT §4h and the closure, not traced edge by edge), and a hidden power is never named or counted there as an open challenger. The flag is read; no new text about the hidden power is printed (TO-LIGHT §4h; the PDF is the owner's DM document, audience `'dm'`). |
| `narrative on factionRelationships` | N everywhere → R on campaign-pdf, dossier-pdf, foundry, web-transitive, world-book | lane | U3/U4-CURE2 (`6fa7063fb`): R1, the holder read, reads the seat edge's sentence (`holderOfSeat.js :: transferTakerOf` → `transferSentenceSays`). U5: `rulingPower.js :: transferRulingPower` writes and reads the retired edge's narrative. Hidden names are masked in both slots (TO-LIGHT §4f). It reaches every surface that renders the contest or the holder. |
| `priorityMilitary on config` | +foundry | lane | U4 (`28d85cbd5`): `seatCircumstances.js` reads the town's military priority for the `martial_pressure` circumstance (a figure the owner set in the wizard; not hideable). It reaches the Foundry export through the contest the export renders. |
| `recentConflict on powerStructure` | +web-transitive | lane | U3/U4-CURE2: the holder read's tie-break reads the transfer's own sentence (`holderOfSeat.js :: transferTakerOf`). U5 writes it in kept-form wordings, with hidden takers masked (TO-LIGHT §4e). |
| `raw on compound` | foundry=R | line | The line's own (page round, point 86); this lane did not move it. |
| `economy on raw` | foundry=R | line | The line's own (page round, point 86); this lane did not move it. |
