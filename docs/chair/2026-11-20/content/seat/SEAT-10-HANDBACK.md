# SEAT-10 — HAND-BACK (kept current at every push; first written 2026-11-21T23:21:00Z, read from `date -u`)

**For the next owner of this lane:** you need this file, `SEAT-9-HANDBACK.md` (items 80 to 85), `SEAT-7-HANDBACK.md` (items 69 to 79, §2 to §7), `SEAT-6-TO-LIGHT.md` and `briefs/`.

The rulings in force are SEAT-5's 1 to 52, SEAT-6's 53 to 68, SEAT-7's 69 to 79, SEAT-9's 80 to 85, and this file's 86 on.

SEAT-10's assignment is `docs/chair/2026-11-21/eighth/prompts/SEAT-10.txt` on `origin/lane/chair-2026-11-08`, from `12efb6f5f` on.

The chair is the eighth chair, session_01ACmDYY29VRchM87v1yhL9Q.

## 0. WHERE THE LANE STANDS

- **Lane tip:** `lane/seat-10-2026-11-21`. It was cut at SEAT-9's saved tip `3e8e2e37d`, which I verified equal to `origin/lane/seat-9-2026-11-20` at seating, 23:19Z. Nothing from SEAT-10 is merged yet: only this file.
- **The working line:** `lane/join-2026-11-14` at `a64619510` (point 86), read at 23:20Z. `ci/LINE-NOW.md` still names point 86.
- **UNIT 1 (merge the line): BLOCKED BY A REFUSAL.** At 23:20Z my own permission check refused `git merge --no-ff --no-commit origin/lane/join-2026-11-14`. The reason given was "Destructive or Unwanted Actions". The refusal stands. It was reported to the chair at 23:20Z, and nothing else was tried to the same end. The tree is untouched and no merge is in progress. SEAT-9's measure of the conflicts still stands, and I have not re-taken it: five files (`npcGenerator.js` plus four registers; SEAT-9 §0).
- **UNIT 2 (law 2's keys against `observedShapeReaders`):** not started; it waits on unit 1.
- **UNIT 3 (the flip's census):** my answer to the chair is that the cut `9cc5045f2` does NOT answer for the tip. It lacks UK, which changes law-2 births, and it lacks the line's points 83 to 86. A re-cut of the two flipped shards plus the control, 793 files each way, is estimated at about 1.5 h of box: shard 1 took 18 min for 309 files. That is under the 2 h bar, so the census is re-cut at the merged tip after unit 1.
- **UNIT 4 (rule 8, then "SEAT <commit>"):** not started.
- **THE CHAIR'S WORD (23:24Z):** the order to merge the line is WITHDRAWN. The chair merges `a64619510` into this branch's tip `f82c2a183` in its own container and pushes the result as `lane/seat-10-base-2026-11-21`:
  - `npcGenerator.js` keeps both sides;
  - the four registers take the line's side, and the manifest takes the union;
  - nothing is re-pinned.

  SEAT-10 then takes it by a fast-forward. Each register's door and the size baseline become SEAT-10's next commits, each with its proof. Until then, SEAT-10 adds NO commit to its branch: the two files below stay untracked.
- **UNIT 2 IS DONE (item 87), reported to the chair at 23:47Z.** BKP's `keyprobe/` outputs (probe, report and JSON) were read by SEAT-10.
- **THE BASE (23:33Z):** the chair's `66585d96a` has first parent `3e8e2e37d`, not this branch's `f82c2a183`, so it is not a fast-forward. The chair was asked for a merge that includes `f82c2a183`, or a re-seat on the base. Until then, the work in progress is on `lane/seat-10-2026-11-21-wip` (`c0b8c7cf1`, then `d4caa078a`).
- SEAT-10 read the base's `npcGenerator.js :: generateSingleNPC` hunk. It keeps both sides correctly: UK's `generateNPCPowerLevel(role, config)` sits above the line's `const card = {…}` with `noteSecretSource(card, secretSource); return card;`.
- **READY:** `recut/recut.sh`, the census re-cut at the merged tip. It is BFL's set, shard runner and four lists, without the whole run, on a flipped local clone.
- **NEXT:** the chair's line with the base's commit, then the fast-forward.

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

## 2. THE UNITS

| unit | branch | state |
|---|---|---|
| 1 THE LINE | `lane/seat-10-2026-11-21` | BLOCKED (item 86) |
| 2 THE KEY QUESTION | BKP (subagent; outputs in `keyprobe/`) | DONE (item 87) |
| 3 FLIP CENSUS (re-cut) | — | not started; to be re-cut at the merged tip |
| 4 RULE 8 | — | not started |

## 3. STORED FIGURES THIS SEAT MOVED

None yet.

## 4. HOUSES AND CLASS-TABLE ROWS FOR THE JOIN

None yet.
