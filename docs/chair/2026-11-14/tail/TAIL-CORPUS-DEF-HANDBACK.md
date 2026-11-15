# TAIL-CORPUS-DEF · hand-back (kept current after every batch)

Seat: TAIL-CORPUS-DEF (session_01ACmDYZgBVcMqAiAKUcmt3T), branch `lane/tail-corpus-def-2026-11-14`, cut from the joined
line `lane/join-2026-11-14` at **48fedbe98**. Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-CORPUS-DEF.{md,json}`
(196 rows, read at e5b421802). Files: the four `src/data/dossierStateProse/{defense,power,stressors,warFaith}.generated.js`,
edited through their source `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (DS-DEF / DS-POW / DS-FTH / DS-CND sections only).

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)
- (C1) pools DS-DEF, DS-POW, DS-FTH, DS-CND; a line cured by a declaration or a rewording in the SOURCE, never by striking a
  middle row; leaves rebuilt by `node scripts/generate-dossier-state-prose.mjs`, `--check` passing before every push.
- (C2) declarations measured BY REPLAY (W2-WRITE-13's `replay.mjs` / `moved.mjs`) over the base render's own eligible lists.
- (C3) no ceiling raised; a state a declaration would leave mute takes a twin; land pool by pool; the council lines in a
  headman's town reworded to claim no plurality (done, batch 1).
- (C4) no section of DS-ECO, DS-GEN or DS-SUP touched (none was); a power named in a sentence through its slot.
- BRIEF-TAIL's laws (silence is true; a line in its pool unless the town makes it false; a draw is not moved outside its
  pool; siege / famine / clip laws; one home for one fact; no new vocabulary word; no `src/pdf` or `src/foundry`).

## The base (the first act)
- Census at 48fedbe98 (CENSUS-3's one command, its render extended to also write each pool's eligible/drawn lists and each
  town's record: `render.census3d.jsx`, see "instruments"). 720 towns, 29,876 distinct sentences.
- GONE AT THE BASE / no longer prints in the town read: **16429** (fold gone), **B19191, 15551, B21189, 21034, 01440,
  06949** (no longer print in the reader's town: cured upstream by W2-WRITE-13/14's declarations).
- The test files naming the touched files carry **33 reds at the base** (16 files; e.g. `wiringCensusDeclared` stale census,
  presumedThings ARM 1, proseWaveGate (d)): carried from the joined line, not this seat's.

## Batch 1 — DS-DEF-5, DS-DEF-2, DS-DEF-8, DS-POW-5 (commit 09a1afc81; register 56d3a4757)
Rows verified by script over the census's records (`facts.mjs` = `factsOf` of every town; `verify.py`).

| row(s) | pool · line | false in (by the record) | cure | towns before → after |
|---|---|---|---|---|
| 20784 22421 (+ the thorp/town/city folds) | DS-DEF-5 arcane defense ABSENT v1 "defense is conventional throughout" | 70 of 88 (no wall, no palisade, nobody under arms) | REWORDED | 40→0, 48→0 |
| B14309 B14310 (+ tiers) | arcane defense ABSENT v3 "Nothing unseen is known to have come" | 15 of 44 (a recorded Purge or Arcane Incident) | REWORDED | 39→0, 5→0 |
| 29118 | DS-DEF-5 walls ABSENT v2 "pass nobody on the way in" | 5 (4 sieges, 1 occupation) | DECLARED `no crisis: under_siege · no crisis: occupied` | 97→92 |
| 01111 01113 (+ metropolis fold 35→33) | DS-DEF-5 walls PRESENT v2 "every arrival goes through a gate" | 11 (every one a port) | DECLARED `no port` | 39→34, 28→24 |
| B14258 B14259 B14260 B11532 | DS-DEF-2 Invasion & War neither walls nor force v2 "Nothing has come for X … nobody having wanted it" | 46 of 77 (a recorded siege, occupation or purge) | REWORDED | 26/27/24/77→0 |
| B11985 (+ hamlet 24→10, thorp 13→4) | DS-DEF-8 override active, viability intact v2 "the defence makes do" | 42 (nobody under arms) | DECLARED `guardPresence` | 22→3 |
| 03156 03157 03158 03160 03161 B03075 | DS-DEF-8 viability intact v3 "A visitor would not guess at the trouble from the streets" | 134 towns over every crisis (plague, war, revolt, migration show) | REWORDED | all →0 |
| (inheritor) | viability intact v1 "its defence has had to change" | v2's 24 inheriting towns with nobody under arms | REWORDED | — |
| 20690 | DS-DEF-8 SECURITY COMPROMISED v2 "The guards at X have changed their rounds" | 1 (r2r-hamlet-34: a citizen militia only) | REWORDED | 6→0 |
| 19461 06324 04080 04089 06326 | DS-POW-5 council v4 / v1 / v2 "its members cannot agree", "the whole {seat} must agree" | 45 of 47 (a Headman's Authority: one headman) | REWORDED (C3) | all →0 |

STRUCK (true by the record): **29122** gates v3 (the gate is on the record in all 82 towns: the reader's header lacked it);
**12714** viability intact v2 in the metropolis under plague (it has defenders; the line claims work, food and sleep, not
normality).

MEASURED BY REPLAY (the declared moves, by pool, 720): walls PRESENT v2→v3 8, v2→v1 3 (all ports); viability intact
v2→v1 24, v2→v3 18 (all with nobody under arms); walls ABSENT v2→v1 4, v2→v3 1. No other pool moved.
INVENTORY DIFF: 20 rows gone, 4 fewer by exactly their measure; the other 3 lines in fewer towns are the same lines in
sibling tiers, false there too. INHERITORS read: walls ABSENT v1 ("unfortified … cannot control entry") and v3 under a
siege; walls PRESENT v1 / v3 at a walled port; viability intact v1 / v3 (reworded) — TRUE.
GUARD: `tests/domain/tailCorpusDefGuards.test.js` (5 declared rows each with its `instead` sibling, 3 keeps, 9 rewordings):
14 red at the base, 3 keep green; 17 green after.
PINS re-keyed by identity: `proseEntryContradiction` trailing coordinate 376→375 (neither v2);
`proseMoveGrammar` CONTROL 4 568→569 and 0.664→0.665 (arcane ABSENT now uniform).
REGISTER: presumed-things widened register, 1 stale row shrunk through its own door (`--shrink`), its own commit; fresh 147
(the base's), stale 0.
GATES: generator 0 / `--check` 0; strict 0; type ratchet 0; eslint 0 on the touched files; grid 0; the 59 test files that
name the touched files: 33 reds at the base, the same 33 after (the 3 new reds were the two pins and the stale row, cured).

### New or changed lines (the owner's veto list; towns read: smallest · largest · a siege/famine/occupation)
1. DS-DEF-5 arcane ABSENT v1: "{settlement} has no arcane defense: what arrives unseen here goes undetected and therefore
   unanswered." — 195 towns: r2r-thorp-0 · r2s-under_siege-metropolis-0 · r2r-thorp-1.
2. arcane ABSENT v3: "Anything unseen that came at {settlement} would find nothing to meet it: the town keeps no wards or
   seers to notice it." — the old v3's 157 towns (text set after the census; same draws): r2s-famine-thorp-0 ·
   r2s-religious_conversion-metropolis-0 · r2s-famine-thorp-0.
3. DS-DEF-2 neither walls nor force v2: "If anyone came for {settlement}, nothing about the town would stop them. Its safety
   rests on nobody wanting it enough to try." — 77: r2r-thorp-14 · r2s-succession_void-village-3 · r2r-thorp-54 (past siege).
4. DS-DEF-8 viability intact v1: "… though it has had to change its ways to meet it." — 163: r2r-thorp-1 ·
   r2s-slave_revolt-metropolis-3 · r2r-thorp-1.
5. viability intact v3: "{settlement} is shaken by this trouble, but it is still standing and means to stay that way." —
   152: r2r-thorp-16 · r2s-wartime-metropolis-2 · (the pool is `no crisis: occupied`; no siege or famine reaches it).
6. SECURITY COMPROMISED v2: "Those who keep watch at {settlement} have changed their rounds …" — 6: r2r-hamlet-34 ·
   r2s-recently_betrayed-city-1 (no siege/famine/occupation reaches it).
7. DS-POW-5 council v1: "… because the {seat} hears everyone out before it acts …" — 83: r2r-thorp-11 ·
   r2s-wartime-metropolis-3 · r2r-thorp-38.
8. council v2: "At {settlement} the town's business goes to the {seat} …" — 89: r2r-thorp-1 · r2s-slave_revolt-metropolis-0.
9. council v4: "… has left obvious decisions untaken, because no answer to them would satisfy everyone it must answer to."
   — 94: r2r-thorp-10 · r2r-metropolis-6 · r2r-thorp-27.
Declared (no new words): walls ABSENT v2, walls PRESENT v2, viability intact v2.

## Rows verified and struck or parked (not in a batch yet)
- STRUCK, true by the record: **15200 B04388 03110 03112** (DS-DEF-2 full legal chain: court AND prison AND watch on the
  record in all 171 printing towns); **23463** (DS-DEF-4 organized v3: crime `organized` in all 43); **01472 01519 01516
  01518 01520 01514 01512 01522** (DS-DEF-11 WALLED-STRAINED "defences sound": walls on the record in all 85; "vulnerable"
  is the too-few-to-man-them the line says); **20580** (crimeIsGovt flag set and crime `semi-organized` in the town read).
- PARKED for the record's lane (a fact the vocabulary lacks; NAMED, not cured here): **B27765 B27760 B19765 28742**
  (DS-DEF-9 magicDependency false beside a food record that makes part of its food by magic: the record disagrees with
  itself; `defenseProfile.magicDependency` is the generator's, outside this group).
- READY FOR BATCH 2 (verified, not yet cured): **23220 23219** (CAPACITY: ample in a famine and a siege-deficit town:
  declare `food: ≥ pressured` on v1–v3, as CAPACITY: enough carries, and a twin `food: ≤ importDependent`);
  **00333 00334 00335** (DS-POW-5 autocrat in a succession void and a fractured town, 2 towns: `no crisis: succession` on
  v1–v4 and a twin `crisis: succession`).

## Rows named for other lanes
- DS-DEF-9 magicDependency (above): the record's lane (`defenseProfile.magicDependency` vs the food record's magic share).

## Registers named stale
- The wiring census (`wiringCensusDeclared` red at the base and after: carried; the generator did not refuse, so not re-taken).
- The prose byte baseline and the shift register: not re-taken (re-derived once, at the close).

## What is left of the worklist
- Batch 2 as above; then DS-DEF-3 / DS-DEF-4 / DS-DEF-12 / DS-POW-4 (Stable no challengers, Contested) / DS-CND-1 / DS-FTH-4
  rows by width; the slash labels in DS-POW-4 / DS-POW-6 lines ("Military/Guard": route through
  `powerSentenceName.js :: PROSE_FORMS`); W2-WRITE-HANDBACK-14's STEP 1 pools not landed (Economic Survival STRONG and its
  twins; neither walls nor force v3; the rest with their measures there).

## How the instruments are re-made
- CENSUS-3 out of `lane/census-3-2026-11-14` by `git archive`; `render.census3d.jsx` = `render.census3.jsx` plus the kernel's
  `drawVariant` wrapped (each pool's eligible and drawn vids, tab walk only) and the record, written to `<out>/draws/` and
  `<out>/records/` (not `dumps/`, whose count the census checks). Run with `CENSUS_RENDER=render.census3d.jsx`.
- Replay: a directory with `dumps -> <out>/draws`, `records -> <out>/records`; `replay.mjs <tree> <dir> probe` (54,144
  matches, 0 misses at the base), then `replay.mjs <tree> <dir>` and `moved.mjs <dir> <dir>.replay.json '.'`.
- (all three in `docs/chair/2026-11-14/probes/TAIL-CORPUS-DEF/`; `mkrender.py <CENSUS-3 dir>` writes render.census3d.jsx) `facts.mjs <tree> <records> <out.json>` (factsOf of every town, compact) and `verify.py` (a row's towns from the
  inventory, the predicate that makes it false).
