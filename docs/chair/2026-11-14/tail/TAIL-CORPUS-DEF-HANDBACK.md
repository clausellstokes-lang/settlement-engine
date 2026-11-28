# TAIL-CORPUS-DEF · hand-back (kept current after every batch)

Seat: TAIL-CORPUS-DEF (session_01ACmDYZgBVcMqAiAKUcmt3T), branch `lane/tail-corpus-def-2026-11-14`, cut from the joined
line `lane/join-2026-11-14` at **48fedbe98**. Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-CORPUS-DEF.{md,json}`
(196 rows, read at e5b421802). Files: the four `src/data/dossierStateProse/{defense,power,stressors,warFaith}.generated.js`,
edited through their source `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (DS-DEF / DS-POW / DS-FTH / DS-CND sections only).

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)
- (C1) pools DS-DEF, DS-POW, DS-FTH, DS-CND; a line cured by a declaration or a rewording in the SOURCE, never by striking a
  middle row; leaves rebuilt by `node scripts/generate-dossier-state-prose.mjs`, `--check` passing before every push.
- (C2) declarations measured BY REPLAY (W2-WRITE-13's `replay.mjs` / `moved.mjs`) over the base render's own eligible lists.
- (C3) no ceiling raised; a state a declaration would leave mute takes a twin; land pool by pool.
- (C5, the chair 23:25 UTC, replacing C3's council clause) THE COUNCIL LINES IN A HEADMAN'S TOWN (DS-POW-5 council v1, v2,
  v4) ARE NOT REWORDED IN THIS WAVE: the atom `ruling body` (granted 2026-11-14, built on another seat's branch) gives them
  `needs: ['ruling body']` and a lone-ruler twin in the next wave. (This seat read the ruling only after batch 1 pushed;
  batch 1 had reworded them; the three lines are RESTORED to the base's words in the correction commit after 4908ad69a.)
- (C4) no section of DS-ECO, DS-GEN or DS-SUP touched (none was); a power named in a sentence through its slot.
- BRIEF-TAIL's laws (silence is true; a line in its pool unless the town makes it false; a draw is not moved outside its
  pool; siege / famine / clip laws; one home for one fact; no new vocabulary word; no `src/pdf` or `src/foundry`).

- (C7, the chair 2026-11-15 00:00-00:30 UTC) THE POWERS' FAMILY OF ATOMS IS NAMED AND CLOSED FOR NOW: `shared power` (on
  this branch), `ruling body` (built; the ties seat's branch) and `rival power` (built; the crisis seat's branch; true of
  the SETTLED record only). THE COUNCIL ROWS (C5) WAIT until the chair names a tip of the joined line that holds
  `ruling body`: then merge origin/lane/join-2026-11-14 AT THAT TIP (the only merge this seat may make) and key them (a
  line about a council of many `needs: ['ruling body']`, with a twin true under one ruler where the slot falls mute).
  A fourth atom is asked of the chair with every line that would use it and their measures.
- (C9) THE MAGIC-DEPENDENCY ROWS (a chain said to be sustained by magic beside a food ledger that holds none) stay named,
  with their towns: a measuring seat takes the class.
- (C8) A CLASS BEING MEASURED, not this seat's: prose written before its facts are final (true when drawn, false because
  the record moved afterwards): a row found to be that is NAMED with that reason.
- (X9) THE EXPORTS' READ: one row of these pools only the PDF and the journal print (read-all-3/WORKLIST3-CORPUS-DEF.md:
  **26310**, DS-DEF-2 Internal Security court without detention v1, "money and exile" under a siege, 18 towns): taken
  with its pool's batch, measured by `SURFACES=PDF,Journal python3 inventory.py <out-dir> x.json`.

## The base (the first act)
- Census at 48fedbe98 (CENSUS-3's one command, its render extended to also write each pool's eligible/drawn lists and each
  town's record: `render.census3d.jsx`, see "instruments"). 720 towns, 29,876 distinct sentences.
- GONE AT THE BASE / no longer prints in the town read: **16429** (fold gone), **B19191, 15551, B21189, 21034, 01440,
  06949** (no longer print in the reader's town: cured upstream by W2-WRITE-13/14's declarations).
- The test files naming the touched files carry **33 reds at the base** (16 files; e.g. `wiringCensusDeclared` stale census,
  presumedThings ARM 1, proseWaveGate (d)): carried from the joined line, not this seat's.

## Batch 1 — DS-DEF-5, DS-DEF-2, DS-DEF-8 (commit 09a1afc81; register 56d3a4757; C5 correction after 4908ad69a)
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

STRUCK (true by the record): **29122** gates v3 (the gate is on the record in all 82 towns: the reader's header lacked it);
**12714** viability intact v2 in the metropolis under plague (it has defenders; the line claims work, food and sleep, not
normality).

MEASURED BY REPLAY (the declared moves, by pool, 720): walls PRESENT v2→v3 8, v2→v1 3 (all ports); viability intact
v2→v1 24, v2→v3 18 (all with nobody under arms); walls ABSENT v2→v1 4, v2→v3 1. No other pool moved.
INVENTORY DIFF: 20 rows gone, 4 fewer by exactly their measure; the other 3 lines in fewer towns are the same lines in
sibling tiers, false there too. INHERITORS read: walls ABSENT v1 ("unfortified … cannot control entry") and v3 under a
siege; walls PRESENT v1 / v3 at a walled port; viability intact v1 / v3 (reworded) — TRUE.
GUARD: `tests/domain/tailCorpusDefGuards.test.js` (5 declared rows each with its `instead` sibling, 3 keeps, 6 rewordings
after the C5 correction): 11 red at the base, 3 keep green; 14 green after.
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

## Waits for the atom (C5)
- **19461 06324 04080 04089** (DS-POW-5 council v4, v1, v2 in a Headman's Authority town): measure 45 of the 47 printing
  towns (19461 22, 06324 14, 04080 6, 04089 3 towns of their folds); **06326** (the same v1 in 2 Town Council towns) TRUE.
  Next wave: `needs: ['ruling body']` and a lone-ruler twin. Left at the base's words.

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

---

# TAIL-CORPUS-DEF-2 (the successor seat, session_01ACmDYWhPqWyyegu9YVWWef, a child of the chair session_01ACmDYZrFEVXyZEUg1NDxxC; 2026-11-15)

Continues on the same branch from **c66510264** (read back from origin). Scratch worktree, its own `npm ci`. The base
census (CENSUS-3's one command with `render.census3d.jsx`, re-made by `mkrender.py`) at c66510264: 720 towns, 29,875
distinct sentences on the tabs, 35,778 on PDF+Journal (`SURFACES=PDF,Journal`). Replay probe 54,144 matches, 0 misses.
The test files that name the touched files: now 67 (the grep of `dossierStateProse|RECEIPT_POOLS_DOSSIER_STATE|<desk>.generated`);
33 reds at the base, carried (the same 33 as the predecessor's).

INSTRUMENT ADDED: `replay2.mjs` = W2-WRITE-13's `replay.mjs` with `NEWV='<pool>:<vid>,…'`: a NEW vid (a twin, absent from
the base render's recorded eligible lists) is eligible where its declaration admits it. Without it a declared pool's twin
replays as "silent". (In `docs/chair/2026-11-14/probes/TAIL-CORPUS-DEF/`.)

## Batch 2 — the capacity lines with a food twin; the autocrat under a succession (as the predecessor verified it)

| row(s) | pool · line | false in (by the record) | cure | towns before → after (replay) |
|---|---|---|---|---|
| 23220 23219 | DS-DEF-12 CAPACITY: ample v1–v3 ("more than enough to get through a hard year") | 2 of the 4 printing towns (r2s-famine-village-3 famine; r2s-under_siege-town-2 food deficit) | DECLARED `food: ≥ pressured` on v1–v3; TWIN v4 `food: ≤ importDependent` | v3 2→0; v4 0→2 |
| 00333 (+ its class) | DS-POW-5 autocrat v1–v4 ("one person decides … quickly") | 2 of 36 (r2s-succession_void-town-0, r2s-politically_fractured-town-2: no stable governing authority) | DECLARED `no crisis: succession` on v1–v4; TWIN v5 `crisis: succession` | v1 9→7; v5 0→2 |

MEASURED BY REPLAY: exactly those four towns move (ample v3→v4 2; autocrat v1→v5 2); NO OTHER POOL MOVED.
GUARD: `tests/domain/tailCorpusDefGuards.test.js` +4 DECLARED (each with its `instead` twin) +2 KEEP (r2r-town-54 ample
v3, a secure isolated town; r2r-town-17 autocrat v1, a Feudal Appointee at peace): the 4 red at the base leaves, the 2
keeps green; all 20 green after.
PINS re-keyed by identity (+2 variants, +2 source lines): `composeStateProse` variants 2951→2953;
`proseEntryContradiction` 3419→3421, 2714→2716 (twice), the `economicBase: extraction` row 2417→2418 and the annex row
"the same trades exempt" 6160→6162 (re-addressed by their text); `proseWaveGate` units 626→627. (A first wording of the
ample twin moved the trailing-coordinate pin and the move-grammar repeated-opener pin by one each; it was reworded so
both stand at the base's figures, not re-keyed.)
GATES: generator 0 / `--check` 0; strict 0; type ratchet 0; eslint 0 on the touched files; presumed-things `--check`
fresh 147 stale 0 (exit 1, the same as the base); grid 2 falls (r2r-city-0, r2s-insurgency-metropolis-0 P7a), the same as
the base; the 67 named files: 33 reds at the base, the same 33 after.

### New lines (the owner's veto list)
7. DS-DEF-12 CAPACITY: ample v4 `[ledger · food: ≤ importDependent]`: "In an ordinary year {settlement} would not miss
   the road, river or port it lacks, but this is not an ordinary year: the town is not raising the food it needs." —
   2 towns: r2s-famine-village-3 (a famine, the smallest) · r2s-under_siege-town-2 (a siege, the largest).
8. DS-POW-5 autocrat v5 `[unfolding · crisis: succession]`: "Who speaks for the {seat} at {settlement} is an open question
   now, and until it is settled, nothing that comes out of the {seat} is sure to stand." — 2 towns (both towns):
   r2s-succession_void-town-0 · r2s-politically_fractured-town-2 (no siege, famine or occupation reaches the pool's
   succession state at the base). It claims no plurality.

### Verified in batch 2 and NOT cured (named)
- THE AUTOCRAT LINES UNDER A COUNCIL OF MANY (the `ruling body` family, C7): 22 of the 36 towns that print DS-POW-5
  autocrat v1–v4 ("One person decides …") hold a seat named "Military Council" / "Military City Council" / "Grand
  Military Council" (`ruler: council`); row **00335** (r2s-under_siege-metropolis-1, a ruling three named on the page) is
  one. PARKED with the C5 council rows: the line about one ruler takes `no ruling body` (or its atom's excludes form) and
  a twin true under a body, when the chair names the tip. Measure 22 towns (v1 5, v2 7, v3 4, v4 6 by draw).
- THE SEAT ECLIPSED (the `rival power` family, C7): row **00334** (r2s-under_siege-town-2): the page says "Feudal
  Appointee keeps the title; Military/Guard makes the decisions that matter" beside autocrat v1. That state ("X keeps the
  title; Y makes the decisions", 22 towns across every kind of seat at the base) has no atom on this branch: PARKED for `rival
  power`.

## Batch 3 — DS-POW-4 `Power › Rule and succession`: the Stable (no challengers) lines, and three declared lines

The chair's C10 hands this pool rows **15073 B14249** (Critical v1, from TAIL-DISPLAY-CIVIC's read). Verified by the record
(`powerStructure.publicLegitimacy.label`, the crisis kinds) at c66510264; the pool has no atom for legitimacy, so the
Stable lines are REWORDED to claim no more than every printing town bears (no "nobody is asking who comes next" under a
Legitimacy Crisis; no slot without its article: `{faction}` → "the {seat}").

| row(s) | line | false in (by the record) | cure | towns before → after (inventory) |
|---|---|---|---|---|
| 14859 14856 14852 14857 14854 B14026 | Stable v1 "it has no rival, and nobody in the town is asking who comes next" | 41 of 52 (Legitimacy Crisis 28, Contested 13) | REWORDED | each →0 |
| 21584 21590 21587 21595 | Stable v2 "The question of who might replace the {seat} … does not come up" | 39 of 53 (Contested 21, Crisis 18) | REWORDED | each →0 |
| 15533 15536 15531 B14699 B14695 B14704 | Stable v3 "{faction} is safe in the hall" | 27 of 49 (Legitimacy Crisis; Desperate stability) | REWORDED | each →0 |
| 14648 14646 14639 | Stable v6 "what threatens {faction} now is the fighting across the town" | 13 of 31 (the kingdom's war, fought elsewhere) | REWORDED | each →0 |
| 15073 B14249 (C10) | Critical v1 "Nothing at {settlement} protects the {seat} now. {counterpart} has the strength" | the seat is the strongest power / has a symbiotic guard: the contenders model's "ungated" is the office failing, not force | REWORDED (no slot as a verb's subject) | each →0 |
| B22476 23484 | Contested v4 "Visitors … are quietly told to stay polite" | 3 (sieges: no visitor arrives) | DECLARED `no crisis: under_siege` | 4→3, 1→0, 2→1 (exactly the 3) |
| 07358 | Critical v3 "{counterpart} has not yet moved to take it" | 1 (an occupation: the occupier already rules) | DECLARED `no crisis: occupied` | 1→0 |

MEASURED BY REPLAY: Contested v4→v1 2, v4→v2 1 (the three sieges); Critical v3→v2 1 (r2s-occupied-city-0); no other pool moved.
INVENTORY DIFF (before c66510264 → after, one census each, tabs; the PDF+Journal inventory moves identically): 29,875 →
29,864 sentences; the 27 rows of batches 2 and 3: 26 GONE, B22476 fewer by exactly its measure. The only other lines in
fewer towns are the batch-2 autocrat v1 fold in the fractured town and the second siege-visitor fold: both the replayed
towns. INHERITORS read where they print: the four reworded Stable lines (14, 13, 12, 11 … towns; thorp to metropolis);
Contested v1/v2 in the three siege towns ("could now take the hall", "no longer sure the hall belongs to") and Critical
v2 in the occupied city ("is waiting … could change hands within the season"): TRUE. The batch-2 twins print where
replay put them (ample v4 in r2s-famine-village-3 and r2s-under_siege-town-2; autocrat v5 in r2s-succession_void-town-0
and r2s-politically_fractured-town-2).
Critical v1's words were set AFTER the census (the census showed "if Religious Authorities moves against it": the slot
the subject of a verb it may not agree with); same vid, same draws.
GUARD: tailCorpusDefGuards +2 DECLARED, +2 KEEP (r2r-village-23 Contested v4, r2r-city-44 Critical v3), +5 REWORDED: 7
red at the batch-2 tip, the 2 keeps green; 29 green after. No pin moved.
GATES: generator 0 / `--check` 0; strict 0; ratchet 0; eslint 0; presumed-things fresh 147 stale 0 (exit 1, as the
base); grid 2 falls (as the base); the 67 named files: 33 reds at the base, 36 after the cure: the three new were
`seatSafetyUnrest.test.js`, whose subject was Stable v3's retired claim found by the instrument's regex (`is safe in the
hall`): RE-KEYED BY IDENTITY (v3 by vid; the instrument shown alive on the retired words and silent on the new; the pool
shown to make the claim nowhere): the same 33 after.
REGISTER NAMED: `src/domain/coherence/crisisBlindFindings.js` (outside this group) still carries the claim rows for the
retired words ("is safe in the hall"): dead patterns now; its owner's group may retire or re-word them.

### New or changed lines (the owner's veto list)
9. DS-POW-4 Stable v1: "Nobody at {settlement} is in a position to take the {seat}'s place: whatever the town thinks of
   the {seat}, no contender stands ready to try." — 52 towns: r2s-monster_pressure-thorp-1 · r2r-hamlet-0 · r2r-thorp-38 (a crisis of the three).
10. Stable v2: "If anyone at {settlement} asked who might replace the {seat}, the town would have no contender to name."
    — 53: r2r-thorp-31 · r2r-metropolis-7 · r2r-thorp-45.
11. Stable v3: "People at {settlement} may grumble, but nobody in the town stands ready to lead them against the {seat}."
    — 49: r2s-mass_migration-thorp-3 · r2s-plague_onset-village-3 · r2s-famine-thorp-2.
12. Stable v6: "In a season of fighting, having no rival at {settlement} is small comfort to the {seat}: what threatens it
    now is the fighting itself." — 31: r2s-insurgency-thorp-0 · r2s-slave_revolt-town-3 · r2s-wartime-thorp-2 (a famine too).
13. Critical v1: "The office no longer shields the {seat} at {settlement}: against a move by {counterpart}, holding the
    title will not be enough." — 7: r2s-wartime-town-2 · r2r-metropolis-50 · r2s-famine-town-1.
Declared (no new words): Contested v4 `no crisis: under_siege`; Critical v3 `no crisis: occupied`.

### Rows of DS-POW-4 verified and NOT cured (named)
- THE CONTENDERS MODEL AGAINST THE POWER TABLE (two homes for one fact; the record's lane, `coupContenders` vs the
  GOVERNMENT tiers): Holding **13371 19242 13139 13169**, Contested **16423 13247 13583 20174 13579 16375 20172 15175
  13581 16424 01055 28453**, Critical **13595 14680 13596**: each line is the contenders model's own reading (weights times
  the legitimacy multiplier), and the page's GOVERNMENT table rates the powers otherwise. Not cured by wording here.
- THE SLASH LABELS ("Military/Guard" in a sentence: 23484 and the Holding/Contested/Critical lines): the `{counterpart}` /
  `{faction}` slot is filled outside this group's files; route it through `powerSentenceName.js :: PROSE_FORMS` (C4) in the
  slot's builder: NAMED for that file's group.
- **01008 01022** ("X is governed by the Elder Council" under an occupation; the worklist traced them to DS-POW-5
  agrarian v1): the writer is `src/domain/display/governanceAccount.js` — NAMED for its group.

## What is left (after batch 3)
1. THE COUNCIL ROWS, NOW UNBLOCKED (C11, the chair 01:01 UTC): the joined line at **eeaa06816** holds `ruling body` and
   `rival power`. Merge origin/lane/join-2026-11-14 AT eeaa06816 (a merge commit of its own; the only merge), RE-TAKE THE
   BEFORE at the merged tree (it holds other groups' cures and four declared moves of the record), then key: DS-POW-5
   council v1 v2 v4 (19461 06324 04080 04089; 45 towns) `needs: ['ruling body']` with a lone-ruler twin; DS-POW-5
   autocrat v1–v4 under a council of many (22 towns, row 00335) the excludes form with a twin under a body; row 00334
   and the "keeps the title; Y makes the decisions" class (22 towns) by `rival power`.
2. C10's **B00937** (DS-DEF-3 Safe v1 "{settlement} is a quiet town." beside a regional monster threat; 10 towns, all
   r2r- arms with no active crisis): the line's "quiet" is about crime; reword it to say so, with DS-DEF-3's batch.
3. X9's **26310** (DS-DEF-2 court without detention v1, "money and exile" under a siege; 18 towns, PDF/Journal): with
   DS-DEF-2's batch (`no crisis: under_siege` or a siege twin; measure with `SURFACES=PDF,Journal`).
4. By width: DS-CND-1 DIRECTION worsening/stable (11 rows, 83 towns: lines that name merchants, officials, work gangs or
   quarrels a thorp does not have); DS-DEF-4 semi-organized v3 (16620, 60 towns); DS-DEF-2 Economic Survival STRONG/WEAK
   and the CHAIN lines (14 rows); DS-POW-5 FLAG merchantArmy (7); DS-POW-6; DS-DEF-5/-8/-11/-3 smaller rows; DS-FTH-4.
5. DS-DEF-9 magicDependency (13 rows, 93 towns): C9 — named with their towns; a measuring seat takes the class.

## After the hand-back: the chair's READ-ALL-4 note (2026-11-15 01:56 UTC), answered, not cured
- THE SLASH LABEL IN DS-POW-6 GM ADVISORY ("… if Military/Guard refuses it", "Military/Guard answers to the Elder Council
  … in name only"): the corpus's words are slots; THE FILLER is `src/domain/display/stateProse/powerStateProse.js`
  (outside this group's files), every power name passing `properFill(text(…))` raw: `:654` (`{faction}`, the people
  rungs), `:960` (`{seat}` / `{faction}` = `governingName`), `:1101` (`{counterpart}` = the first challenger), `:1113`
  (`{faction}` = the advised party of DS-POW-6). ONE CHANGE there (the name through `powerSentenceName.js ::
  powerSentenceName` before `properFill`) covers every DS-POW pool that composer draws (DS-POW-3/-4/-5/-6); the other
  desks of this group fill no power slot but `warFaithStateProse.js:883` (`{faction}` = the religious faction).
  MEASURE before (the after-census of batch 3, tabs, every writer): 429 distinct sentences, 2,892 printings, carry a
  slash label. NAMED for that file's group.
- DS-POW-5 council v4 ("its members cannot agree") where the cast seats one person (17 of 47): the chair names it a class
  of the RECORD; the line is left.


---

# TAIL-CORPUS-DEF-3 (the third seat, session_01ACmDYZ7SGaT7upxMDiRtAD, a child of the chair session_01ACmDYZrFEVXyZEUg1NDxxC; 2026-11-15)

Continues on the same branch from **cff6cd098** (read back from origin). Scratch worktree, its own `npm ci`. The base
census at cff6cd098 (CENSUS-3's command with `render.census3d.jsx`): 720 towns, 29,864 distinct sentences on the tabs.
Replay probe 54,144 matches, 0 misses. The 67 named test files (59 test files run): 33 reds at the base, carried.
INSTRUMENT ADDED: `f2.mjs <tree> <records> <out.json>` (tier, population, `market`, imports/exports counts, the crisis,
the powers and their relationships/conflicts counts, legitimacy, conditions) beside `facts.mjs`.

## The chair's rulings since (2026-11-15 02:10 UTC; each vetoable by the owner)
- (C14) THE COUNCIL ROWS WAIT A LITTLE LONGER: the atom `ruling body` takes NO NEW LINE until the chair says so (a measuring
  seat is answering whether the density resize changes the governing power's one-or-many kind after the lines are
  written). No merge for them now; when the word comes, the tip to merge is named with it. THE ONE-MEMBER COUNCIL ("its
  members cannot agree" where the cast seats one person: 17 of 47 towns) is a class of the RECORD, named for its next
  measure: those lines are left.
- (C15) THE SLASH LABEL in these pools' sentences is cured at the slot's filler (`src/domain/display/stateProse/
  powerStateProse.js`, the four call sites named above): GIVEN TO THE CIVIC DISPLAY'S SEAT; no pool is reworded round it.
- (C16) THE ORDER: B00937, 26310, DS-CND-1; then the rows printing in FIVE TOWNS OR MORE, widest first; a row in fewer
  than five towns waits.
- (C17, the chair 2026-11-15 02:26 UTC, read by this seat only after its hand-back) C14 IS LIFTED: on the 720 the
  density resize never changes the governing power (name, `government`, category: 720 of 720), so `ruling body` is safe
  at every step and takes new lines again. THE COUNCIL ROWS ARE OPEN: merge origin/lane/join-2026-11-14 AT d817736d8 (it
  holds both atoms; the only merge), re-take the before there, and take the council rows in their place by width. STILL
  NOT TO BE KEYED ON: the governing power's capture state (it moves after the write in 103 towns) and its legitimacy
  crisis note (11). The one-member council stays the record's class: leave those lines.
- (U1) the weekly usage warning: commit and push every batch the moment it holds, with WHAT IS LEFT current; hand back at
  250,000; one line to the chair at the hand-back, a stop, or a question only.

## Batch 4 — B00937, 26310 and DS-CND-1 (C16's first three)

| row(s) | pool · line | false in (by the record) | cure | towns before → after (inventory) |
|---|---|---|---|---|
| B00937 (C10) | DS-DEF-3 Safe v1 "{settlement} is a quiet town." | 6 of 10 (a `plagued` or `frontier` monster threat: hamlet-18/-51/-6, town-20, city-53, metropolis-43) | REWORDED (the line is about crime; no tier noun) | 10→0 (+ the four tier folds) |
| 26310 (X9) | DS-DEF-2 court without detention v1 "money and exile"; v2 "the purse or the road" | 4 (sieges: city-1, city-3, town-1; town-0 for v2) | DECLARED `no crisis: under_siege` on v1, v2 (v3 "the fines cannot be enforced" inherits) | tabs 58→55, 26→25; PDF+Journal 18→16, 32→31, 26→25 |
| 07715 | DS-CND-1 worsening·insurgency v3 "Fewer merchants … pay its rivals" | 4 of 11 (no market) | DECLARED `market` | 11→7 |
| 13414 | DS-CND-1 stable·occupied v4 "Merchants … pay the occupiers the same share of every sale" | 6 of 9 (no market) | DECLARED `market` | 9→3 |
| 15102 | DS-CND-1 stable·succession_void v3 "merchants deal season to season" | 5 of 6 (no market) | DECLARED `market` | 6→1 |
| 06991 | worsening·insurgency v1 "more of X's officials stop answering" | 3 of 8 (a thorp or hamlet: no officials) | REWORDED | 8→0 |
| 22986 | worsening·insurgency v4 "trust fewer of their own officers" | 6 of 9 (thorps and hamlets of one power) | REWORDED | 9→0 |
| 04039 | worsening·fractured v3 "a different answer in every street" | 1 of 9 (a thorp of 15) | REWORDED | 9→0 |
| B07294 | worsening·fractured v4 "Fights between X's powers break out" | 4 of 13 (no relationship and no conflict on the record) | REWORDED (no fight claimed) | 13→0 |
| 21712 | worsening·slave_revolt v1 "spreads to more work gangs" | 1 of 5 (a thorp of 15) | REWORDED | 5→0 |
| 21580 | stable·religious_conversion v1 "settled into habit … the neighbours do not ask" | 5 (a Tense town whose page calls the quarrel escalating: the line claimed calm, the status is only "stable") | REWORDED | 5→0 |
| 09250 (+ its tiers) | worsening·famine v3 "less of it comes in" | 3 of 11 (imports none: thorp-17, thorp-54, hamlet-1) | REWORDED | 11→0 |
| (inheritor) | stable·succession_void v2 "the old officers do what they did before" | v3's inheritors: thorps and villages with no officers | REWORDED | 1→0 (the new words in 4) |

STRUCK: **B20559** (worsening·fractured v1 "The quarrel among X's powers grows sharper"): TRUE by the crisis: a
`politically_fractured` crisis IS the powers' quarrel; the empty relationships/conflicts list beside it in 3 of 7 towns is
the record disagreeing with itself (NAMED, a class of the record).
MEASURED BY REPLAY: court without detention v1→v3 3, v2→v3 1 (the four sieges); insurgency worsening v3→v4 2, v3→v2 2;
occupied stable v4→v2 3, v4→v1 2, v4→v3 1; succession stable v3→v2 3, v3→v1 2 (all the no-market towns). NO OTHER POOL MOVED.
INVENTORY DIFF (cff6cd098 → batch 4, one census each): 29,864 → 29,860; 17 gone, 13 new; the rows: 7 GONE, 2 fewer by
exactly their measure (07715, 13414) and 15102, 26310 by exactly theirs. The only other lines in fewer towns: the patron-deity
card's three lines in ONE town (r2r-thorp-2, 717→716): not a sentence of these pools, no draw of that town moved by
replay: a render flake of the card, named. INHERITORS read where they print: the new words (below); court v3 in the four
sieges ("the fines cannot be enforced": TRUE); insurgency v2 in two no-market towns, v4 (new words) in two; occupied
stable v2 in three thorps/hamlets, v1 and v3; succession stable v1 and v2 (new words): TRUE, but see the name below.
GUARD: tailCorpusDefGuards +5 DECLARED (each with its `instead`), +4 KEEP, +9 REWORDED: 14 red at the base, the 4 keeps
green; 47 green after.
PIN re-keyed by identity: `proseMoveGrammar.walker` CONTROL 4 uniform segments 569→570, share 0.665→0.666, second half
514→515 (Safe v1 is one sentence now, so the Safe pool is uniform).
GATES: generator 0 / `--check` 0; strict 0; type ratchet 0; eslint 0 on the touched files; presumed-things fresh 147
stale 0 (exit 1, as the base); grid 2 falls (r2r-city-0, r2s-insurgency-metropolis-0 P7a, as the base); the named files:
33 reds at the base, the same 33 after (the two new were the pin, re-keyed).
NAMED (not cured): DS-CND-1 stable·occupied v2 "The occupiers in X's streets …" now prints in 11 towns, 5 of them thorps
or hamlets (2 thorps and a hamlet at the base, unflagged by the readers): a rewording to drop "streets" is a NEW line to
the presumed-things walker (it presumes the occupation; the register is shrink-only), a stop: left at the base's words.

### New or changed lines (the owner's veto list; towns read: smallest · largest · a siege/famine/occupation)
14. DS-DEF-3 Safe v1: "Crime at {settlement} stays small: things are taken occasionally and the taking does not spread,
    because the people who would spread it are known." — 10: r2r-hamlet-18 · r2r-metropolis-22 (the pool admits no
    threat or unrest crisis).
15. DS-CND-1 worsening·famine v3: "Food costs more in {settlement} each week, and there is less of it than the town
    needs." — 11: r2r-thorp-17 (a famine, the smallest) · r2s-famine-city-3.
16. worsening·fractured v3: "Ask who governs {settlement} and you get a different answer depending on whom you ask, and
    the answers are angrier than they were." — 9: r2s-politically_fractured-thorp-3 · r2r-metropolis-2.
17. worsening·fractured v4: "Each of {settlement}'s powers keeps its own people close at hand now, and watches the
    others more warily every week." — 13: r2s-politically_fractured-thorp-2 · r2s-politically_fractured-metropolis-2.
18. worsening·insurgency v1: "Each week fewer people at {settlement} answer to those in charge, and more of their orders
    go unheeded." — 8: r2r-thorp-22 · r2s-insurgency-city-1.
19. worsening·insurgency v4: "Those in charge of {settlement} trust fewer of the people around them each week, and
    cannot tell who has changed sides." — 11: r2s-insurgency-thorp-2 · r2r-city-33 · r2s-insurgency-hamlet-0 (a famine too).
20. stable·religious_conversion v1: "The quarrel over {settlement}'s faith is no nearer an end: each household keeps the
    rite it has chosen, and neither side is winning more of them." — 5: r2s-religious_conversion-village-0 ·
    r2s-religious_conversion-metropolis-1.
21. worsening·slave_revolt v1: "The revolt in {settlement} spreads further each week, and less of the work gets done." —
    5: r2s-slave_revolt-thorp-1 · r2s-slave_revolt-metropolis-2.
22. stable·succession_void v2: "Life in {settlement} goes on without a leader: what was done before is still done, and
    nobody begins anything new." — 4: r2s-succession_void-thorp-3 · r2s-succession_void-town-3.
Declared (no new words): DS-DEF-2 court without detention v1, v2 `no crisis: under_siege`; DS-CND-1 insurgency
worsening v3, occupied stable v4, succession stable v3 `market`.

## Batch 5 — DS-DEF-2: the widest rows by C16 (commit after 51f0f553a)

| row(s) | pool · line | false in (by the record) | cure | towns before → after (inventory) |
|---|---|---|---|---|
| 01607 (+ v2) | Economic Survival WEAK v1 "pay book … people owed wages"; v2 "are already owed" | 13 of 15 (an unpaid militia or levy only: no watch, garrison or hire) | REWORDED v1, v2 (no wages owed) | 15→0, 24→0 |
| 01541 B19529 (+ tiers) | CHAIN food trades failing v1 "so little food is being put by"; v2 "little is being put by" | every printing town holds 6 to 15 months of stores (the chain is failing; the stock is not small) | REWORDED v1, v2 (the shortfall, not the stock) | 10/4/3→0, 6/3→0 |
| B06130 | Beasts plagued, perimeter AND force v2 "not an emergency arrangement … nobody treats any of it as unusual" | 2 of 8 (a monster crisis, a war) | DECLARED `no crisis: monster_pressure · no crisis: wartime` | 8→6 |
| 14935 (sibling fold) | Economic Survival STRONG v8 "Nobody … lies awake over a lean year" | the town fold: 2 of 15 (`food: pressured`, deficits 6% and 8%) | DECLARED `food: ≥ secure` | town fold 15→13 |

STRUCK, true by the record: **14935** itself (the metropolis fold, 15 towns, all `food: secure`; the reader's town
r2r-metropolis-38 is `secure` with 15 months of stores: its 5% deficit is inside the band); **B01461** (CHAIN defence
supplied v2, 32: `defenseProfile.chainModifiers.military > 0` in all 32; the chains' "vulnerable" is a fragility, not a
failure); **20442 20443** (CHAIN defence short v3, 14 + 14: `chainModifiers.military < 0` in all; the reader read the
prosperity and a bowyer, not the chain); **23535** (walls with citizen militia v1, 18: walls on the record in all 18;
"inadequate against anybody who arrives professionally" is the Vulnerable the reader saw).
MEASURED BY REPLAY (over batch 4's census): Beasts plagued v2→v4 1 (r2s-monster_pressure-city-0), v2→v1 1
(r2s-wartime-town-0); STRONG v8→v1 2 (r2r-town-42, r2r-town-9). NO OTHER POOL MOVED.
INVENTORY DIFF (batch 4 → batch 5): 29,860 → 29,861; 7 gone, 8 new; the rows: 3 GONE, B06130 and 14935's town fold fewer
by exactly their measure; no other line in fewer towns. INHERITORS read where they print: the new words (below); STRONG
v1 ("accounts have money in hand", prosperity ≥ moderate) in the two pressured towns; Beasts v4 ("keeps its wall …
nobody walks out past it unarmed") in the monster-crisis city and v1 ("thick with creatures … both in use constantly")
in the war town: TRUE.
GUARD: tailCorpusDefGuards +3 DECLARED, +2 KEEP, +4 REWORDED: 7 red at batch 4's tip, the keeps green; 56 green after.
No pin moved.
GATES: generator 0 / `--check` 0; strict 0; ratchet 0; eslint 0; presumed-things fresh 147 stale 0 (exit 1, as the base);
grid 2 falls (as the base); the named files: the same 33 reds.

### New or changed lines (the owner's veto list)
23. DS-DEF-2 Economic Survival WEAK v1: "{settlement} is always short of money for its defence: whoever is called to
    defend it is paid late or not at all, and is slow to turn out when trouble comes." — 15: r2s-politically_fractured-
    thorp-2 · r2r-town-7 · r2s-occupied-thorp-0 (an occupation).
24. WEAK v2: "The people who would have to hold {settlement} through something know there is no money to pay them for
    it." — 24: r2r-thorp-7 · r2s-succession_void-town-3 · r2r-thorp-27 (an occupation).
25. CHAIN food trades failing v1: "{settlement}'s food trades are failing, so less food is being put by than should be;
    if the town were cut off, it would have less to fall back on than it ought." — 17: r2r-town-3 · r2r-metropolis-6 ·
    r2s-occupied-city-0 (an occupation).
26. CHAIN food trades failing v2: "The food trades at {settlement} are struggling to keep up, and less is being put by
    against the town being cut off than ought to be." — 9: r2s-religious_conversion-city-1 · r2s-slave_revolt-
    metropolis-0 · r2s-famine-metropolis-2 (a famine).
Declared (no new words): Beasts plagued perimeter AND force v2; Economic Survival STRONG v8.

### Named from batch 5's verification (a class with two homes)
- **20245 21035 22321** (STRONG v12 "went into this trouble with money in hand", 43 towns, 12 Poor or Struggling) and its
  sibling v3 (41, 15): the Economic Survival score (`defenseGenerator.js`, `W.floors.sup`) against the prosperity ladder.
  v1 floors at `prosperity: ≥ moderate`, v9 at `≥ poor` (earlier seats); flooring v3 and v12 leaves a Struggling town in a
  crisis MUTE, and no twin is true without knowing what the score counts: the chair's.

## What is left (after batch 5; SUPERSEDED by the list after batch 6, below)
1. Batch 5 is landed.
2. By C16 (five towns or more, widest first), at cff6cd098's census: 03383 DS-DEF-5 ARCANE alchemists v1 (17);
   28625 DS-DEF-1 readiness STRONG v2 (15); 23021 DS-DEF-11 WALLED-QUIET v1 (14); 20059 DS-DEF-3 COMPOUND succession v3
   (13); 00779 DS-DEF-11 UNWALLED-SMALL v5 (12); B00729 DS-DEF-3 COMPOUND migration v1 (12); B20295 DS-DEF-6 port only v2
   (11); B14096 / 00985 DS-DEF-8 QUARANTINE v2 / v1 (11, 9); 23379 DS-DEF-8 RELIGIOUS UPHEAVAL v3 (10); 14024 DS-DEF-8
   COMMAND SPLIT v1 (10); 02617 / 20576 DS-DEF-5 free company v1 / v2 (9, 9); 06123 / B05859 DS-POW-6 capture RECOVERING
   (9, 6); B21649 DS-DEF-4 organized v4 (9); 20485 DS-FTH-4 heresy hunted v5 (8); 22361 DS-POW-5 merchantArmy v1 (7);
   11931 DS-DEF-5 militia PRESENT v3 (7); 15476 DS-DEF-3 COMPOUND plague v2 (6); 28629 DS-DEF-12 CAPACITY enough v2 (5);
   B19173 DS-FTH-4 crusaderSynthesis v1 (5); 00714 DS-POW-6 criminal revenue v1 (19: a PAIR with another writer's famine
   line: read it first).
3. OPEN BY C17 (not begun): the council and autocrat rows (merge d817736d8 first; 04066 autocrat v2 among them). WAITING: DS-DEF-9 magicDependency (C9: B14709 04098
   11437 B10908 B03973); the Economic Survival STRONG class (above, the chair's); 44 rows in fewer than five towns (C16).

## TAIL-CORPUS-DEF-3 HANDED BACK at the 250,000 line (2026-11-15 ~03:40 UTC), batch 5's tip 1e7344d2e
Two batches landed (4: 13 rows cured, 1 struck; 5: 5 rows cured, 5 struck), 13 new or changed lines on the veto list
(14-26). The next seat continues from "What is left (after batch 5)" above, re-taking its before census at this branch's
tip (CENSUS-3's command with `render.census3d.jsx`, made by `mkrender.py`); `f2.mjs` and `facts.mjs` give the facts.

---

# TAIL-CORPUS-DEF-4 (the fourth seat, session_01ACmDYXd3BE95kDrjFpAC1f, a child of the chair session_01ACmDYZrFEVXyZEUg1NDxxC; 2026-11-15)

Continues on the same branch from **b230bfb8b** (read back from origin). Scratch worktree, its own `npm ci`. FIRST ACT:
merged origin/lane/join-2026-11-14 AT **d817736d8** as C17 names (clean; `--check` 0): **7ccad225e**, pushed. The base
census there (CENSUS-3's command, `render.census3d.jsx`): 720 towns, 30,112 distinct sentences on the tabs. The named
test files (every test naming the leaves or the source: 60 files): 36 reds at the merged base, carried.
INSTRUMENT ADDED (scratch only): `towns.py <inv.json> <run> <fold substring> [expr over R (record), D (dump)] [dist expr]`.

## The chair's ruling since (C18, 2026-11-15 04:03 UTC; vetoable by the owner)
- (C18) WHAT THE BAR'S READERS MET IN THESE POOLS (ten fresh towns read whole and cold by two readers each at the landed
  tip 5d1e3096b): each flag a candidate, checked at this branch's tip first (batches 4 and 5 are not on the read line),
  measured over every town of the 720 that prints it, cured at the pool by a declaration (measured by replay), a twin or a
  rewording: DS-DEF-11 UNWALLED (78) beside a past occupation; DS-DEF-5 garrison gate (64) beside an underground network;
  DS-DEF-4 semi-organized (53) beside a thieves' guild with a head; DS-DEF-3 Moderate (36) beside "Law & order: Critical";
  DS-DEF-2 Economic Survival pay book (15) and DS-DEF-8 rations (4) where only a militia stands; DS-DEF-11 WALLED "sound"
  (13) beside a Vulnerable defence; DS-DEF-3 Safe v2 "enforcement" where nobody is under arms; DS-POW-4 riskLabel (2)
  beside a live succession crisis. THE "ECONOMIC SURVIVAL: STRONG" QUESTION IS PARKED (the ratings themselves are the
  record's measuring seat's): those lines are left. THEN: what is left that prints in five towns or more, widest first.

- (U2, the chair 2026-11-15 04:49 UTC) NO VETO on batch 6's rewordings. REAL BREAKS BEFORE THE NEXT BATCH: the first
  whole check of the joined line at d817736d8 found 198 failing tests; twelve red files stand in the defence desk's area.
  Each is run ALONE at this tip and split: (i) these pools cause it, a regression of an earlier cure: CURED; (ii) a pin a
  declared move or a rewording explains: RE-KEYED by identity, the move named in the commit; (iii) the cause is not in
  these files: ONE LINE here with the file and the commit that moved it. Never skip, weaken or delete a test.

## Batch 6 — C18 (commit d4a4bd590)

| flag | pool · line | false in (by the record, at the merged base) | cure | towns before → after |
|---|---|---|---|---|
| UNWALLED | DS-DEF-11 UNWALLED-SMALL v4 "nothing has yet come against it that a wall would have stopped" | 27 of 78 (`history.historicalEvents` holds "The Occupation" or "The Siege"); 6 at war | REWORDED (no past claimed) + DECLARED `no crisis: wartime` | 78→0; the new words 72 |
| garrison | DS-DEF-5 garrison PRESENT v3 "Everyone entering X is counted at the gate" | 17 of 64 (DS-ECO's "underground house" facet prints: "come and go by passages under the town") | REWORDED (only the gate's traffic counted) | 64→0; new 64 |
| structure | DS-DEF-4 semi-organized v1 "not coordinated enough to have a head" | 14 of 53 (a `criminal` power among `powerStructure.factions`) | REWORDED (no headlessness claimed) | 53→0; new 53 (tier noun: "the whole city") |
| Moderate | DS-DEF-3 Moderate v5 "keeps order well enough by itself"; v6 "no great need of anyone yet" | 22 of 36; 23 of 34 (the Foundations' Law & order Critical or Collapsed) | REWORDED v5, v6 (no claim that order holds) | 36→0, 34→0 |
| DS-DEF-8 | override INTERNAL PRESSURE (famine) v1 "The guards' rations" | 1 of 4 (a militia only: r2s-famine-village-1) | REWORDED ("those who defend") | 4→0 |
| WALLED | DS-DEF-11 WALLED-STRAINED v1 "the defences are sound"; v2, v7 "X's defences are sound"; v6 "still stand sound" | v1 6 of 22; v2 29 of 49; v7 26 of 28; v6 3 of 4 (`defenseProfile.readiness` Vulnerable) | REWORDED (the {defwork} kept in repair; nothing said of holding) | each →0 |
| Safe v2 | DS-DEF-3 Safe v2 "enforcement keeps it down"; v3 "plain that somebody keeps it that way"; Very Safe v3 "enforcement far outweighs" | 1 of 6; 1 of 17; 1 of 11 (no `guardPresence`: no watch, garrison, militia or company) | DECLARED `guardPresence`; TWINS Safe v4, Very Safe v5 `no guardPresence · crisis: any` (a no-guard Safe town under a threat or unrest crisis was left mute) | 1→0, 17→16, 3→2 |

STRUCK: **pay book** (DS-DEF-2 WEAK v1, 15): the read line held the old words; batch 5 (not on the read line) reworded
v1 and v2 for exactly this (an unpaid militia is "paid late or not at all"); DS-DEF-8 rations was the same class (cured
above). NAMED, NOT CURED (fewer than five towns, and a class of the record): **riskLabel** (DS-POW-4 Stable v1 "Nobody … is
in a position to take the X's place", 52 towns): in 3 (r2r-hamlet-31, r2r-hamlet-39, r2r-thorp-48)
`history.currentTensions` holds a `succession_crisis` with a "Popular candidate" faction, written in the past tense ("the
ruler of the time was aging"), beside a power record with no challenger: two homes for one fact; no atom reads the
history's tensions.
MEASURED BY REPLAY (`replay2.mjs`, NEWV the two twins): UNWALLED-SMALL v4→v1 2, v4→v2 4 (the war towns); Safe v2→v4 1
(r2s-infiltrated-village-2), v3→v4 1 (r2r-thorp-28); Very Safe v3→v5 1 (r2r-village-49). NO OTHER POOL MOVED.
TOLD TO THE CHAIR BEFORE THE PUSH (the 20-town rule): UNWALLED v4, garrison v3, WALLED-STRAINED v1/v2/v7, Moderate v5/v6
replace TRUE lines in more than twenty towns (near-synonyms, each claiming less).
INVENTORY DIFF (7ccad225e → batch 6): 30,112 → 30,119; 21 gone, 28 new; every row GONE, or fewer by exactly its measure
(Safe v3 17→16, Very Safe v3 3→2); no other line in fewer towns. More towns: UNWALLED v2 "No wall marks where X ends"
106→110 and v1 "too small to wall and knows it" 19→21 (the war towns): TRUE (v1's "safety is its distance and its
unimportance" in a thorp at war is the line's own claim, admitted there at the base). INHERITORS read where they print:
the new words (below).
GUARD: tailCorpusDefGuards +4 DECLARED (each with its `instead`), +3 KEEP, +10 REWORDED: 14 red at the base (the base's
leaf restored, not committed), the keeps green; 73 green after.
PINS re-keyed by identity (+2 variants, the twins): composeStateProse variants 2953→2955; proseEntryContradiction
3421→3423, 2716→2718 (twice), the annex row "the same trades exempt" re-addressed 6162→6164, the trailing-coordinate class
375→373 (report-only); proseMoveGrammar repeated openers 135→137, share 0.158→0.160; proseWaveGate units 627→629.
GATES: generator 0 / `--check` 0; strict 0; type ratchet 0; eslint 0 on the touched files; presumed-things fresh 145
stale 2 (exit 1; none in these files: narrativeText.js, computeActiveChains.js, carried by the merge); grid 2 falls
(r2r-city-0, r2s-insurgency-metropolis-0 P7a, as before); the named files: 36 reds at the merged base, 35 after, none
new (the anti-vacuity QUALIFY ARM on DS-POW-5 theocracy went green).

### New or changed lines (the owner's veto list; towns read: smallest · largest · a siege/famine/occupation)
27. DS-DEF-11 UNWALLED-SMALL v4 (`no threat · no crisis: wartime`): "{settlement} has no wall, and nothing threatens it
    now that a wall would keep out." — 72: r2s-religious_conversion-thorp-0 · r2r-village-52 · r2s-famine-thorp-2.
28. DS-DEF-5 garrison PRESENT v3: "Everyone who comes through {settlement}'s gate is counted there by a soldier whose job
    it is, and counted again on the way out." — 64: r2s-infiltrated-town-2 · r2r-metropolis-32 · r2s-occupied-town-1.
29. DS-DEF-4 semi-organized v1: "Criminal work at {settlement} is coordinated enough to hold routes and territories,
    though not yet tight enough to run the whole town." — 53: r2r-hamlet-17 · r2s-politically_fractured-metropolis-2 ·
    r2s-under_siege-city-0.
30. DS-DEF-3 Moderate v5: "Nobody at {settlement} is paid to keep order; what order the place has, its own people keep."
    — 36: r2r-thorp-48 · r2r-village-51 (no siege, famine or occupation prints it).
31. Moderate v6: "{settlement} has nobody to keep the peace, and trouble here is left for neighbours to settle between
    themselves." — 34: r2s-infiltrated-thorp-2 · r2r-village-32.
32. DS-DEF-8 INTERNAL PRESSURE (famine) v1: "Those who defend {settlement} eat cut rations like everyone else, and a
    hungry defender cannot be asked for much for long." — 4: r2s-famine-village-1 · r2s-famine-metropolis-2.
33. DS-DEF-11 WALLED-STRAINED v1: "… fall short on the watch's wages, so the defences stand and too few people man
    them." — 22: r2s-infiltrated-town-2 · r2s-indebted-metropolis-3.
34. WALLED-STRAINED v2: "{settlement} keeps its {defwork} in repair, but fewer people turn out each season to man the
    defences, and the town is slow to notice." — 46: r2r-thorp-6 · r2r-metropolis-7.
35. WALLED-STRAINED v6: "{settlement} still keeps its {defwork} in repair, though nobody in the town has the work of
    manning the defences." — 4: r2r-thorp-43 · r2r-village-17.
36. WALLED-STRAINED v7: "{settlement} keeps its {defwork} in repair, and the only people who would stand on the defences
    are the town's own." — 28: r2s-succession_void-thorp-3 · r2s-famine-village-1 · r2s-famine-village-3.
37. DS-DEF-3 Very Safe v5 (twin, `no guardPresence · crisis: any`): "The town's record of crimes at {settlement} is short:
    there is little crime to write down, and neighbours settle what there is between themselves." — 1: r2r-village-49.
38. Safe v4 (twin, `no guardPresence · crisis: any`): "The town's record of crimes at {settlement} stays short: there is
    some crime, and neighbours settle most of it between themselves." — 2: r2r-thorp-28 · r2s-infiltrated-village-2.
Declared (no new words): Safe v2, v3 and Very Safe v3 `guardPresence`.

## U2 — the thirteen red files in the defence desk's area (commit after d4a4bd590)

Each run ALONE at d4a4bd590 (all red), and at b230bfb8b, d817736d8 and the branch's cut 48fedbe98: eleven were already
red at 48fedbe98 (before this group's branch); defenseWordsFindings is green at b230bfb8b and red on the joined line.
The cause of each was bisected (two read-only investigators, their own worktrees; every claim below verified green at
the parent, red at the commit).

CURED (i), in these pools:
- **defensePerimeterCalm** ("occupied: the pool went mute"): 5077c9ec1 (W2-WRITE-11 1a) declared DS-DEF-2 Beasts settled,
  defenses beyond the need v4 v5 off an occupation and left the occupied state mute: TWIN v6 `[ledger · threat · crisis:
  occupied]`. Replay: no draw of the 720 moved (no census town reaches that state). 5/5 green.
RE-KEYED BY IDENTITY (ii), the move named:
- **coherenceAgreeCures** (the chair's thirteenth, 2 of 45): the W2-WRITE `no gate` twins of DS-DEF-5 walls PRESENT
  (91592cbf1, bc5ee968b, 07f53f717) name the gate's ABSENCE: the fortification read sets "no (proper) gate" apart before it
  looks for a gate word; the mark test accepts `gate` or `no gate` (either side of the atom). Shown able to red by a plant
  (v4 made to say "every arrival goes through a gate": red), not committed. 45/45.
- **defenseSupplyUnderACrisis**: 30895bb67 (W2-WRITE-4 round 3) reworded DS-DEF-2 CHAIN defence supplied v1-v3: SUPPLIED
  re-keyed to the new words. 2/2.
- **defenseInvasionWithinACriticalBand** "above the Critical band": rr3-town-occupied-rand-4 is occupied, and 1dfa83d89
  (W2-WRITE-10) declared walls AND professional garrison v1-v3 off an occupation: that seed is silent by design.
- **defensePostureAgainstItsFacts** "a walled town with its watch keeps the line": rand-4 now draws readiness STRONG v6
  (7a2774754 / 47f8bdd8e, W2-WRITE-3): WALLED_KEEPS re-keyed to rr3-town-monster_pressure-rand-8.
- Pins of the twin (+1 variant): composeStateProse 2955→2956; proseEntryContradiction 3423→3424, 2718→2719 (twice), the
  annex row 6164→6165; proseMoveGrammar 137→138, share 0.160→0.161; proseWaveGate 629→630.
NAMED (iii), the cause not in these files (no repair here):
- defenseInvasionWithinACriticalBand premise + "beside a Critical band": src/generators/defenseGenerator.js, the rebuild
  33b12cbef (JOIN-1 · 9) then 7509b3794 (UPKEEP-13 P4, milPerHead 1): Makropyrgos 11→31→24 (Weak). New seeds needed.
- defensePostureAgainstItsFacts premise + "beside a Weak bar": defenseGenerator.js via 33b12cbef (Ingili now 100);
  "the Guard assessment at its lowest tier": src/generators/safetyLineTruth.js, 48ad4da91 (UPKEEP-8, "exists on paper" gone).
- defenseWatchIsNotTheLevy: defenseGenerator.js, 7509b3794 (rr3-thorp-famine-rand-0 36→14, Critical: withinTheBar silences it).
- threatRowsTrueUnderBand: defenseGenerator.js + src/data/defenceWeights.js, 7509b3794 (rv2-calm-hamlet-1, 34 people: WEAK).
- defenseWithinTheBar: defenseGenerator.js: 07ebe8bdc (COHERENCE-UPKEEP fundedGate), 94c5d408f (UPKEEP-CAPACITY C1), 7509b3794.
- defenseWordsFindings: src/generators/safetyProfile.js:589, 6b8a9b993 (TAIL-DEFECON batch 1) "What food is put by goes to
  whoever can pay…" in a tiny place (7 of 64): its words, in TAIL-DEFECON's file.
- defenceTraditionReaders: defenseGenerator.js, 42d82c775 (UPKEEP-CAPACITY C4a: the walk to another's church, no divine).
- defenseTabFlow: src/domain/institutions/defenseInstitutionBuckets.js, 83883baaa (UPKEEP-CAPACITY C6: an alchemist is a trade).
- crimeLineDisqualifiers (3): the cure is in src/domain/display/stateProse/crimeLineDisqualifiers.js (not this group's):
  91592cbf1 reworded DS-POW-6 ADVANCING #1, #3 (no bought official now: drop those entries; the test's lists [2]→[1..11],
  [1,2,3]→[1..11], fixture `tier: 'town'`, the desk's free check widened); and a5e74f02b (W2-WRITE-3) added RECOVERING #4
  "Criminal money finds little purchase…" with no declaration (no atom reads a bought official): its entry belongs in that
  table (`'an official in pay'`). Verified 8/8 green with those edits in a scratch tree (reverted).
- defensePostureReadsBadge: A CONFLICT OF TWO CURES, THE CHAIR'S: 7a2774754 (W2-WRITE-3) wrote readiness STRONG v5/v6 as the
  siege lines on purpose; this test (an earlier guard) says the strong posture says nothing under a siege. Either v5/v6 take
  `no crisis: occupied, under_siege` (with what then speaks under a siege) or the test admits them. Behind it: wartime-city-0
  readiness 72→80 (33b12cbef, 'Well-Defended'→'Fortress', iii) and the wartime v7 (ii). Left.
NAMED TEST FILES after U2: 36 reds at the merged base, 32 now, none new.
THE CHAIR'S RULE FOR EVERY NEW TEST FROM NOW (2026-11-15 05:06 UTC): anchors computed through tests/helpers/drawnProse.js,
negatives anchored (tests/helpers/anchoredNegatives.js), seed loops through the totality helper; no more literal
state-prose anchors in tailCorpusDefGuards (it holds 24: a close seat computes them); never edit
scripts/mutation-coverage-manifest.json.

### New line (the owner's veto list)
39. DS-DEF-2 Beasts & Monsters: settled, defenses beyond the need v6 (`threat · crisis: occupied`): "{settlement}'s works
    were seldom tested by the settled country around it, and now they stand in the occupiers' hands." — no town of the 720
    prints it (the state is the test's made town); read in defensePerimeterCalm's occupied case.

## What is left (after batch 6; THE CURRENT LIST)
1. C18 is landed (batch 6) but riskLabel (named above). THE ECONOMIC SURVIVAL STRONG CLASS is parked (C18).
2. By C16 (five towns or more, widest first), measured at cff6cd098's census (re-measure each at this tip first):
   00714 DS-POW-6 criminal revenue v1 (19: a PAIR with another writer's famine line: read it first); 03383 DS-DEF-5 ARCANE
   alchemists v1 (17); 28625 DS-DEF-1 readiness STRONG v2 (15); 23021 DS-DEF-11 WALLED-QUIET v1 (14); 20059 DS-DEF-3
   COMPOUND succession v3 (13); 00779 DS-DEF-11 UNWALLED-SMALL v5 (12); B00729 DS-DEF-3 COMPOUND migration v1 (12); B20295
   DS-DEF-6 port only v2 (11); B14096 / 00985 DS-DEF-8 QUARANTINE v2 / v1 (11, 9); 23379 DS-DEF-8 RELIGIOUS UPHEAVAL v3
   (10); 14024 DS-DEF-8 COMMAND SPLIT v1 (10); 02617 / 20576 DS-DEF-5 free company v1 / v2 (9, 9); 06123 / B05859 DS-POW-6
   capture RECOVERING (9, 6); B21649 DS-DEF-4 organized v4 (9); 20485 DS-FTH-4 heresy hunted v5 (8); 22361 DS-POW-5
   merchantArmy v1 (7); 11931 DS-DEF-5 militia PRESENT v3 (7); 15476 DS-DEF-3 COMPOUND plague v2 (6); 28629 DS-DEF-12
   CAPACITY enough v2 (5); B19173 DS-FTH-4 crusaderSynthesis v1 (5).
0. U2's named reds above (iii and the chair's conflict) are other files' or the chair's.
3. OPEN BY C17 (the merge is made: 7ccad225e holds `ruling body` and `rival power`): the council and autocrat rows, by
   width (04066 autocrat v2 among them). WAITING: DS-DEF-9 magicDependency (C9); 44 rows in fewer than five towns (C16).

## TAIL-CORPUS-DEF-4 HANDED BACK at the 250,000 line (2026-11-15 ~05:45 UTC)
The merge of d817736d8 (7ccad225e), batch 6 (C18: 9 flags, 7 cured, 1 struck, 1 named; lines 27-38) and U2 (13 red files:
1 cured, 5 re-keyed, the rest named; line 39). The next seat continues from "What is left (after batch 6)" above, re-taking
its before census at this branch's tip (CENSUS-3's command with `render.census3d.jsx`, made by `mkrender.py`); for twins
replay with `replay2.mjs` and NEWV=<pool key>:<vid>. A census after U2 was NOT taken: replay shows no draw of the 720
moved by the one twin, and the rest are test edits.

---

# TAIL-CORPUS-DEF-5 (the fifth seat, session_01ACmDYaqwQpDn5da47f5sjx, a child of the chair session_01ACmDYZrFEVXyZEUg1NDxxC; 2026-11-15)

THE BASE: lane/join-2026-11-14 at 7163b309 (holds 9d3d177a0) merged as fb591934. Each named red run ALONE there (logs
in the seat's scratch): 10 failing tests in 7 files. No cause file differed on lane/tail-defecon-2026-11-14 or
lane/tail-close-src-2026-11-15 (three-dot diff) when each was taken.

## U2's named reds (each: its commit, and what was done)
- **defenseWatchIsNotTheLevy** (1 of 2 red): 7509b3794 (UPKEEP-13 P4, declared: people.milPerHead 1) holds
  rr3-thorp-famine-rand-0 (14 people) to 14, Critical, where withinTheBar rightly silences the citizen-militia pool.
  RE-KEYED (ii): the keeper is rr3-thorp-famine-rand-7 (27 people, walls + militia, draws the pool). 2/2.
- **threatRowsTrueUnderBand** (1 of 2): 7509b3794 (declared) holds rv2-calm-hamlet-1 (34) to Weak, where "not enough
  against an army" is true. RE-KEYED (ii): rv2-calm-hamlet-12 (88, Strong, the twin prints). 2/2.
- **defenceTraditionReaders** (1 of 2): 42d82c775 (UPKEEP-CAPACITY C4a, declared: the walk to another's church opens no
  tradition). No thorp or hamlet of r2r-thorp-0..29 / r2r-hamlet-0..11 holds the divine tradition now. RE-KEYED (ii):
  the holder is r2r-village-1 (Parish church, resident Priest); r2r-thorp-1 still does not hold it. 2/2.
- **defenseWithinTheBar** (2 of 3): 07ebe8bdc / 94c5d408f / 7509b3794 (all declared) took three hamlets off a Strong bar
  (rv2-wartime-hamlet-5 60 Adequate, rv2-calm-hamlet-27 29 Weak, rv2-calm-hamlet-30 59 Adequate). RE-KEYED (ii): the
  nearest Strong hamlet of each crisis: rv2-wartime-hamlet-7, rv2-calm-hamlet-20, rv2-calm-hamlet-50. 3/3.

- **defensePostureAgainstItsFacts** (3 of 10): the military score's declared moves (33b12cbef, 7509b3794, 07ebe8bdc,
  94c5d408f) took Ingili to Strong / Fortress and Muulcoba to Adequate (both still occupied, strong pool still struck:
  kept, premise re-keyed to their facts); rv2-calm-hamlet-27 / -30 replaced by -20 / -50 (Strong over Vulnerable). No
  town of 900 read holds a Weak or Critical bar under a Well-Defended or Fortress badge now, so the reverse arm's record
  is a MADE one (the file's ruling (e) convention): rr3-town-calm-rand-2 (Well-Defended, readiness 57, at peace, draws
  STRONG) with only its Invasion & War score set to 30: it draws readiness ADEQUATE. 48ad4da91 (UPKEEP-8, declared)
  writes the guard's lowest tier by the force and the pay: the premise reads its three leads; rr3-town-insurgency-rand-2
  (Defensible now) replaced by rr3-city-calm-rand-17. RE-KEYED (ii); plants (reverted) red both arms. 10/10.
- **defensePostureReadsBadge** (1 of 5), C24: STRONG v5 and v6 read; each true of a besieged town at Strong readiness,
  neither presumes an open road or peace (no corpus cure needed). RE-KEYED TO THE LAW: under a siege the pool prints v5,
  v6 or nothing (texts through drawnProse.js), any other member red, a siege line is read (rv2-under_siege-city-5). At
  war: rv2-wartime-city-0 Fortress now (33b12cbef), still the strong pool; its drawn line is a member the disqualifiers
  do not strike 'at war'. Plant (reverted: v1 let under a siege, v5/v6 struck there) reds it. 5/5.
- **defenseWordsFindings** (1 of 12): CURED (i) in src/generators/safetyProfile.js: 6b8a9b993 (TAIL-DEFECON batch 1,
  #05801) wrote the thorp/hamlet twin "What food is put by goes to whoever can pay the holder's price." ('put by' = stored
  food on the Defense tab, 7 of 64). Now "What food there is goes to whoever can pay the holder's price." DECLARED MOVE:
  36 of 720 towns, one field (economicState.safetyProfile.crimeTypes); every reader read (commit body). Pin re-keyed with
  it: tailDefeconSafetyLines #05801's 'instead'. 12/12; the 30 files naming safetyProfile.js 2 failed / 602 passed before
  and after (editWorldFactResources, carried); grid 0 rises (2 carried falls); eslint, both type ratchets 0.

### New or changed line (the owner's veto list)
40. Economics/Defense `Safety & Crime` crime pattern 'black market food' in a thorp or hamlet under a famine or siege:
    "What food there is goes to whoever can pay the holder's price." (36 of the 720; was "What food is put by …").

## What is left (TAIL-CORPUS-DEF-5's list, current)
- **defenseTabFlow** (C25, 1 of 21): 83883baaa (UPKEEP-CAPACITY C6, G5, declared: the alchemist is a trade) leaves no
  dead-magic birth with a house filed as arcane defence (nomagic-a..z; r2r-town/city/metropolis-0..19, magic off).
  RE-KEYED (ii): STOP-2's premise is r2r-city-0 of the 720's configuration (Scroll scribe, Enchanter's shop), its own
  record with the magic dial off; anchored on its live record, where the group prints. Plant (arcaneDefenseOf's gate
  off) reds it. 21/21.
- **vocabularyPageFindings** (C28, 1 of 34): the plant was DS-DEF-5 ARCANE: alchemists v1 (8e70d2bed); 91592cbf1 and
  3f5da151e reworded both lines of the pool off the house, and no state-prose line names the alchemists' house now (every
  leaf scanned). Case (ii): the plant MOVED to the one page line that still names it, the Economics income line by its
  constant (incomeLineSiblings.js :: ALCHEMIST_SUPPLEMENTS_LINE). Family kept, not retired. Plant reds it. 34/34.

## What is left (TAIL-CORPUS-DEF-5's list, current)
1. All seven named U2 reds, C25's defenseTabFlow and C28's vocabularyPageFindings green. Nothing lent to this seat is left.
   AT THE SWEPT MERGE (f714fb6a5, merge cff4998c): the ten files 130 of 131. The one red is NOT this seat's:
   vocabularyPageFindings "a famine written as a risk to come" (expected ['famineToCome'], got []): its plant is DS-ECO-9
   'FOOD SOURCES: one source' v1, which a8ea5ef8 (TAIL-CORPUS-ECO-4 batch 8, C20) rewrote from a risk to come ("would
   cost the whole town dear") to a present one ("is felt across the whole town"). The same shape as C28: for the chair.
   C29 (the chair lent it): case (i): every leaf scanned with the family's words and context; the plant MOVED to DS-DEF-12
   'CAPACITY: short' v2 ("… so a bad harvest there would mean going without.", no mark or pool declaration keeps it out of
   a famine town), computed through variantByVid. Plant reds it. 34/34: the ten files 131 of 131.
2. Seen, not chased (not lent): rv2-wartime-hamlet-5 (walls, no force, 60 Adequate) prints the Invasion line "has walls
   and nobody to put on them. A determined attacker takes this town …" beside an Adequate bar; threatRowsTrueUnderBand's
   FALSE_UNDER holds "A determined attacker" false under ADEQUATE on the readiness rows (its law's births are rv2-calm and
   rv2-under_siege, so it does not read this town). For the chair to place.

## TAIL-CORPUS-DEF-5 HANDED BACK (2026-11-15 ~07:23 UTC), tip 922cfa66 + this note
Merges: fb591934 (join 7163b309), cff4998c (the chair's SWEPT f714fb6a5). Ten files lent (the seven of U2, C25's
defenseTabFlow, C28 / C29's vocabularyPageFindings, with tailDefeconSafetyLines as touched): 131 of 131 at the
SWEPT merge after C29. One record move (36 of 720, crimeTypes; veto line 40); every other change a pin re-keyed by
identity or a plant moved, each shown able to red by a reverted plant. Waiting on the chair's LAND word; nothing lent
is left. Instruments: RECORD-MEASURE-1 births-only.sh + fielddiff.mjs over CENSUS-3's seeds (git-archived out).
