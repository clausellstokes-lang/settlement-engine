# READS-117 — BUILDER R (reads only; no file under src/, tests/ or scripts/ changed)

Brief: `close-7/briefs/LANDING-117.md`, part BUILDER R. Tree for every item: 97c6bfc7a.
Chair lists read at origin/lane/chair-2026-11-08 601264de0 (`docs/chair/2026-11-24/tenth/landing/117/`).
Runs: one detached worktree `/home/user/wt/reads`, node_modules linked, every run through
`scripts/gate-mutex.sh --run` to a log ending `exit=`; logs and JSON in the session scratchpad (`r117/logs/`).

Stages read (first-parent of 97c6bfc7a; the units): base d447ee31e · A1 bb457f3bf · A2 520ddb6a8 ·
MIRROR e2fd7caa4 · point 116 (the line's tip ddca5c789, merged 27408d4ec; not a CLOSE-7 unit) · GUARD eaf34abde /
0ec96f13d · BATCH: B1(i) f82d9d671, B1(ii) 3388806b4, C1 a7870e9cb, P3source 4fc54fb45, C1 de19885d7 · bd7a4f7b0 ·
b9b5ea268 · 44fefb11a, merged e9b726cdf. The named test files and their helpers/fixtures are byte-equal over the
whole range (`git diff d447ee31e 97c6bfc7a` empty on them), so every move is the tree under them.

## Status

DONE: seven runs, all through the mutex, each log ending `exit=`.

## Run 1: the item tree 97c6bfc7a (log `tip-all.log`, exit=1; 9 files, 15 failed | 138 passed)
Reproduces the chair's messages exactly, with the full arrays:
- tailDisplayCivicBatch2: the one failing CURED row is `r2s-occupied-town-3: Merchant Guilds~Craft Guildsstable` (the "stable" chip prints again).
- tailCrisisBatch8: r2s-famine-city-1's famine rows include `Merchant Guilds` (5 rows; Merchant Guild Council first).
- townCartographyCalibration W2: three rows, all desert, all an institutions drop with districts/sceneBuildings unmoved:
  `city|germanic|desert|road|frontier|cg1-seed-06` institutions 83 -> 81 (cartoBuildings 207 -> 203, bytes 397 -> 395);
  `metropolis|celtic|desert|road|safe|cg1-seed-08` 98 -> 95; `village|slavic|desert|road|civilized|cg1-seed-05` 15 -> 14.
- hookThemeDraws: total 2145 (pin 2147).
- dossierProseManifest: tally golden-master-v3 cells 72,614 -> 72,613 (gm-seed-a/b/c and towns unmoved); DRIFT arm 1050 rows moved;
  DM-only positions 214 -> 213.
- heraldKnowledgeDeskGolden: content digest `4600b864…` against the pinned `a4294c06…`.
- statecraftExposureBand: scandals 78 (ceiling 57).
- goalSentencesOnceInTown: every tier reds ONLY on (u)'s roster check under law 1: "the roster is not d3937c3f8's" on
  hamlet-22; village-21, -33, -43, -49; town-12, -20, -38; city-19, -22; metropolis-1, -13, -20, -29, -32, -37 (16 towns).
  (p) and (t) hold on both births.
- goals I-13: Portaminus `npc_parish_churches_10_30`, short goal "Make sure Iulia Volso is not left behind by the changes in
  the work." (full deal) -> "Keep the old lessons between them and Iulia Volso private." (deal with the middle card removed).

## Run 2: GUARD's tip 0ec96f13d, the tree BATCH was cut at (log `guardtip-all.log`, exit=1; 10 files, 2 failed | 172 passed)
Green there: statecraftExposureBand, goals I-13, goalSentencesOnceInTown, tailDisplayCivicBatch2, tailCrisisBatch8,
hookThemeDraws, heraldKnowledgeDeskGolden, townCartographyCalibration, and dossierProseManifest's tally and mixed-pool arms.
So every one of those moved INSIDE BATCH (B1(i), B1(ii), C1, P3source). Red there:
- dossierProseManifest's DRIFT arm (1050 rows), the same count as at the tip: red before BATCH (the chair's class 1).
- tests/scripts/implementationPackets.test.js (the sixth; see below): `EM-R1b.requiredSymbols[7]` and
  `EM-R1c.requiredSymbols[6]` "is missing from src/domain/edit/dmLayer.js: export const REDERIVE_UNAPPLIED_REASONS =
  Object.freeze(['step_not_pinnable', 'unknown_key']);".

## Runs 3 to 5: inside BATCH (logs `b1i-all.log`, `b1ii-all.log`, `c1a-all.log`; 10 files each)
- 6d30700e6 (B1(i) merged and finished; nothing else of BATCH): 15 failed. EVERY item of the tip reds here with the tip's
  exact figures (scandals 78; hooks 2145; tally 72,613; DM-only 213; herald `4600b864…`; the same 16 hxd towns; Portaminus's
  same two lines; the same three desert cartography rows; Merchant Guilds on r2s-famine-city-1), EXCEPT tailDisplayCivicBatch2,
  green here.
- 3388806b4 (B1(ii)): 15 failed, the same; tailDisplayCivicBatch2 still green.
- a7870e9cb (C1's first commit: the bought hall born "Council of Aldermen" / "Council of Syndics" / "Senate"): 16 failed;
  tailDisplayCivicBatch2 reds here with the tip's own row (`r2s-occupied-town-3: Merchant Guilds~Craft Guildsstable`).
  The other figures are the tip's. (P3source 4fc54fb45 and the later C1 commits were not run: the bisect had closed.)

## Run 6: read probes (log `probes.log`, exit=0; scripts `r117/probe-*.mjs` in the scratchpad, each the test's own birth)
Trees 97c6bfc7a, 3388806b4, 0ec96f13d; faultsNeed at 0ec96f13d (11 passed) and 6d30700e6 (1 failed: r2r-town-54);
implementationPackets at 27408d4ec, before GUARD's merge (21 passed).

## (3) THE SIX, AND THE SEVENTH

1. **statecraftExposureBand U1 (scandals 78 > 57): B1(i).** CONFIRMED (run): green at 0ec96f13d, 78 at 6d30700e6 and at the tip.
   The seeded realm's twenty years re-deal when any of its courts' houses re-deal; B1(i) withholds a desert court's fish,
   timber and game houses (the note's own history: the band follows each re-deal of this one realm's draw). Which court is
   desert: PLAUSIBLE (read). Not a dial move: EXPOSE_BASE is untouched. Re-keying the band by the note's method (mutant 0.06,
   head-dark twin) is the chair's/owner's.
2. **goals I-13 (Portaminus): a REAL keyed-determinism loss in `dealGoals`, latent, EXPOSED by B1(i).** No pinned value: the arm
   compares two deals of the same town. CONFIRMED (run): red first at 6d30700e6 (Portaminus, desert, lost its Fish market, so the
   sample's middle card X is now npc_weavers_textile_workers). CONFIRMED (probe): in the full deal the card's short goal is no
   repeat (receipt `repeat` has only `long`); in the deal without X its pass-one wording "Make sure § is not left behind…" has
   become a REPEAT (`repeat.short = 'free'`, `rotated {from 3, to 4}`) of another card's wording, so pass two rotates it.
   GR1's pass two (goals.js ~860-925) reads every other holder of a wording and none of them enters `receipt.refs`; the
   arm's exclusions (`refs`, `refused`, uncanny) cannot see it. goals.js is untouched in the range: the hole is the GOALS-1/3
   pass's, the birth only reached it.
3. **goalSentencesOnceInTown (all five tiers): B1(i).** CONFIRMED (run): green at 0ec96f13d; at 6d30700e6 the tip's exact
   16 towns. Every red is (u)'s premise only, "the roster is not d3937c3f8's" (ids or count), under law 1; (p) the count and (t)
   the reserve hold on both births. A withheld house takes its face off the roster. That the 16 are desert: PLAUSIBLE (read).
4. **tailDisplayCivicBatch2 (r2s-occupied-town-3): C1, and NOT a regression.** CONFIRMED (run): green at 3388806b4, red at
   a7870e9cb (C1's first commit). CONFIRMED (probe): Lykopetra (riverside) is governed by the bought hall; before C1 its
   conflicts held Merchant Guilds vs Craft Guilds HIGH ("A broken promise of support") and the Web printed "escalating";
   after the rename to "Council of Aldermen", `conflicts.js` keys its issue draw on the powers' names (BATCH.md's site, the
   alias withdrawn under R24m), the pair holds NO conflict at all, and its row's direction is "stable", which is now TRUE (the
   cure's rule is "no 'stable' beside a HIGH quarrel"). The anchor's premise moved: a re-anchor, not a cure.
5. **tailCrisisBatch8 (Merchant Guilds on r2s-famine-city-1): B1(i), and NOT a K25 regression.** CONFIRMED (run): green at
   0ec96f13d, red at 6d30700e6. CONFIRMED (probe): Skaldhammer (desert) loses Fish market, Toll bridge, Weavers, Chandler and
   Smuggling network; the STORED stake is unchanged ("split · it could side with either camp"), but the page now prints
   `Merchant Guilds · atOddsMany · in their own quarrel with Merchant Guild Council`: the re-dealt town gives it a quarrel with
   the seat, the same kind of row The Commercial Circle's KEEP already prints. A power in its own quarrel is touched; the
   anchor's premise moved. (That the quarrel comes from the re-dealt conflicts: PLAUSIBLE.)
6. **The sixth (classified.txt names no "six"; taken as its one other class-4 row that is no seed anchor):
   tests/scripts/implementationPackets.test.js: GUARD.** CONFIRMED (run): green at 27408d4ec, red at 0ec96f13d. 0a40b581d
   (R24j 3, 4) widens `REDERIVE_UNAPPLIED_REASONS` to `['engine_mismatch', 'step_not_pinnable', 'unknown_key']`; the live
   packet manifest's EM-R1b `requiredSymbols[7]` and EM-R1c `requiredSymbols[6]` (docs/implementation/PACKET_MANIFEST.json
   :40409, :41374) quote the old line byte for byte. A docs row to re-state (or retire by its § rule), not a code fault.
7. **faultsNeed item 1 (r2r-town-54): the ATOM is the wrong reader; the page is right. B1(i) exposes it, it does not leave a
   dead house's need.** CONFIRMED (run): green at 0ec96f13d, red at 6d30700e6. CONFIRMED (probe, Erdenbuurt, desert):
   page `["Livestock for meat and draft", "clay"]`, atom `["clay"]`. The livestock need is the Butchers (3-8)'s, a house that
   STANDS and that the page marks short of livestock (`rowShortOf`); the Fish market that left has no need on the list. What
   moved: the re-dealt town now has a live `Livestock auction` row at its Annual fair (none before). Both readers drop a need
   a live house deals in, unless a live house is short of it; the page reads shortness from the mark
   (`houseInputAtHand :: housesShortOf`), the atom's copy (`needNotBroughtIn.js :: dealtInHere`) reads only non-imported GAP
   ROWS, and the Butchers have no gap row (gaps: Caravanserai camel_herds, Brickmaker clay, Potter clay). So the atom drops
   livestock and the page keeps it. The cure is the atom's copy of the short rule, not B1(i).

## (4) THE FOUR FIGURES (every one first moves at 6d30700e6, B1(i), and is green at 0ec96f13d; CONFIRMED by run)
Run 7, `probes2.log` (exit=0): the hook corpus and the Herald row at 97c6bfc7a and 0ec96f13d.
- **hookThemeDraws 2,147 -> 2,145 (DOWN 2): B1(i).** What it is: an in-file pin of HK-3 ("no hook is lost"), one hook per
  card, so the total is the cast of its 60-town corpus. CONFIRMED (probe): exactly one town moves, `hk-probe-metropolis-6`
  (desert), 75 -> 73 cards and 75 -> 73 hooks: two withheld houses' faces are not minted. No hook was dropped from a card
  (HK-3's invariant holds). Door: none; an in-file constant re-keyed "by this file's own corpus" with the cause written, at a
  close under the owner's word (last: TAIL-CLOSE-DOORS-4, 2026-11-15). Its sibling pins (npcTotal 2149, hook-bearing 2147)
  sit after the failing line and follow by the same two (PLAUSIBLE).
- **heraldKnowledgeDeskGolden's digest: B1(i).** What it is: the non-omniscient Herald of the Full Simulation realm
  rr-fresh-full after one year, held byte-stable (contentSha256, itemCount, each item's desk). Moved `a4294c06…` -> `4600b864…`;
  CONFIRMED (probe) itemCount 473 -> 466 (DOWN 7): 18 section rows leave, 11 arrive, the realm's year re-dealt by its re-dealt
  houses (which court is desert: PLAUSIBLE). The refile itself (the desks) is not what moved. Door: `recordGolden`, surface
  `herald-knowledge-desk-golden`, `GOLDEN_SHIFT_SIGNED=<record> UPDATE_GOLDEN=1`; a re-record is the OWNER's to sign.
- **dossierProseManifest: B1(i).** What it is: the composed-prose manifest over the golden master's 525 configurations at two
  audiences. golden-master-v3 cells 72,614 -> 72,613 (DOWN 1; towns 516 and gm-seed-a/b/c unmoved); the mixed-pool arm's
  DM-only positions 214 -> 213 (DOWN 1, the lawful direction; player-only still empty, no leak). B1I.md: 24 of the 525 golden
  rows move, all desert. The DRIFT arm's 1,050 rows are red at 0ec96f13d too (not B1(i)'s). Door: the fixture moves only
  through `scripts/prose-manifest-cells.mjs --record` under `GOLDEN_SHIFT_SIGNED` (register row `dossier-prose-manifest`);
  the in-file figures are re-stated with the cause at a close under the owner's word and its record.
- **townCartographyCalibration W2 (three desert rows): B1(i).** What it is: the frozen 504-row cartography corpus, 52 rows
  re-measured live. Moved DOWN, institutions only (districts and scene buildings unmoved): city cg1-seed-06 83 -> 81 (carto
  buildings 207 -> 203), metropolis cg1-seed-08 98 -> 95, village cg1-seed-05 15 -> 14; all three `desert|road`. Door: W0's
  re-record arm, `UPDATE_CARTOGRAPHY_CALIBRATION=1` through `recordGolden` (surface `cartography-calibration-corpus`) under
  an owner-signed `GOLDEN_SHIFT_SIGNED` record, with the written reason in the file's SHIFT RECORD header. Nothing re-recorded.

## Clean-up
The worktree `/home/user/wt/reads` is removed (`git worktree remove`); nothing was committed; no file under src/, tests/ or
scripts/ was changed anywhere. This report is the one file written in the checkout.
