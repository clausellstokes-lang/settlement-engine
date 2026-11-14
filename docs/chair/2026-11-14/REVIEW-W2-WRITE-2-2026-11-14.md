# REVIEW-W2-WRITE-2: the corpus lane at 70e5e7468 (its stage from b5206acd3)

**Verdict: NOT CLEAR.**

The stage writes 2 HIGH and 13 MED false lines of its own where they print, and it leaves 3 reds of its own in its
governing tests. One of the bar's four HIGH rows (#116) is reworded and not cured. Measured over 905 towns born in
the app's own configuration shape, these false lines print in towns where the base's corpus prints nothing false.

**Reviewer:** REVIEW-W2-WRITE-2 (session_01ACmDYZJMawsMVEwSu1YBW8), for the chair session_01ACmDYZrFEVXyZEUg1NDxxC.
Nothing was changed on `lane/w2-write-2026-11-13`. The lane was read at the tip named, 70e5e7468. Its branch has
moved on to 440f40cfc (the eleventh seat), which was not read.

**Order kept.** Step 1, the cold list `REVIEW-W2-WRITE-2-LINES-READ.md`, was committed and pushed at e5b2deaae before
any hand-back, statement or commit message of the range was opened. Its header records two commit subjects that git
printed unasked.

## 1. Every new or reworded line, read where it prints (step 1; the detail is in LINES-READ)
- **The stage changes only the corpus.** Its 133 commits touch the six generated corpus files, the source document,
  registers and tests; no generator, kernel or display code.
- **207 lines in scope:** 11 new, 121 reworded, 65 whose conditions alone changed, and the 10 unchanged rows of the last
  read's 59.
- **The towns.** 905 rendered at the tip: 132 fresh `rv2-` towns, the census's 720, the last read's 38 and 15 siege
  towns found by hunting. 1,696 more births were hunted by the kernel's ledger alone.
- **Three surfaces:** the page, the PDF's state-prose text and the stored public prose.
- **Where a line prints** is taken from the kernel's own draw ledger. Text matching misses the lines that the overview
  clips at the first comma.
- **The readers.** Seven reader seats read by block. Each line was read by eye in at least 3 towns, then checked by
  script in every town it prints in.
- **Own or carried, exactly:** I drew every tip town again through the tip tree with the base's corpus restored.

**Result: 62 of the 202 printing lines are FALSE at HIGH or MED; 6 of them are HIGH.**

| | lines |
|---|---|
| FALSE, the stage's own in at least one town | 15 (2 HIGH, 13 MED) |
| FALSE, carried only | 47 (4 HIGH); 38 of them reworded or re-gated by the stage and left false |
| TRUE (LOW notes kept) | 140 |
| NEVER PRINT, in 2,601 births | 5 |

## 2. The lane's statement (step 2: hand-backs 8, 9 and 10)
**The bar's four HIGH rows, by my own count on the 905 towns.** "Base corpus" means the same towns drawn through the
base's corpus.

| row | pool | base corpus → tip | what prints in its place | my verdict |
|---|---|---|---|---|
| #75 | DS-ECO-1 C4 v4 v5 v7 (the pre-siege poverty claim) | 71 siege draws of the old wording → 0 | the rewordings, true in 68 of 71; false in 3 where a magic import channel still feeds the town under siege (carried) | **CURED AND TRUE** |
| #217 | DS-DEF-3 Moderate v3 ("streets to avoid") in thorps and hamlets | 23 → 0 | Moderate v5 or v6 ("Nobody … is paid to keep order"); none of the 23 has any guard-like house | **CURED AND TRUE** |
| #246 | DS-ECO-12 religious houses v1 v2 in thorps and hamlets | 46 → 0 | silence from the pool in all 46 | **CURED BY SILENCE** |
| #116 | DS-ECO-11 unexploited v1 (both pools) | 67 → 67: the text changed, the claim stayed | "X leaves its timber unworked" beside a Sawmill, Carpenters, a running Timber chain or a "Timber Trade" income line | **STILL FALSE in 59 of 67**; the tenth seat names it for the join (the catalogue's tag) |

**The other cure claims I checked:**
- **Walls AND garrison v1–v3 under occupation (HANDBACK-9's HIGH):** 14 → 0. In their place, in r2s-occupied-city-1, the
  new STRONG v12 prints "its defenders are still paid on time" beside "The occupiers take the revenue", a MED of the
  stage's own.
- **Beasts plagued v2 under siege or occupation (#645):** 4 → 0.
- **NO organized force v1–v3 under occupation:** 15 → 0. What prints in their place reads true, at LOW.
- **#1170 (walls AND garrison v1, reworded):** true in 96 of 96 towns.
- **#19 (NAMED chain v1–v3):** true in 228 of 228.
- **#767 (Beasts plagued v3, v4) and #125 (mages' guild v2):** true.
- **#1085 and #1178 (arcane PRESENT):** "detection, wards" is gone. "Some of what protects the town is magic" still prints in
  13 alchemy-only towns beside "Arcane Support None". I read that as LOW, since the page itself classes the alchemist
  quarter as an arcane defence.
- **#58 (DS-DEF-12 CAPACITY): THE CLAIM FAILS.** The eighth seat declared v1 and v2 `food: ≥ pressured` and reworded v3
  without it. v3 is now the pool's only line under hunger: "a good year is comfortable and a bad one is lean" prints
  under famine and siege in 19 towns where the base's corpus does not print it.
  - The seat's own list reads v3 "in famine" (Strathglen) and "under siege" (Sanctavallis) and calls it true.
  - This is **HIGH 2**.
- **#27 (v4 and v8, "danger is close at hand"):** true, except v4 at rw3-hamlet-under_siege-1. There it replaces the cured
  H2 line, and the town's Adventurers' charter hall musters the defence (MED, own).

**Removals: a count falling is not a cure.** I read 940 prints that leave a town because of the stage's re-gates and
strikes: 89 removals, up to 30 towns each (`readers2/`).
- **648 were false and 292 were true.**
- **Re-gates mostly removed false lines.** Examples: religious houses v1 and v2 (HIGH in all 46), shadow tier v0,
  SECURE v3, DEF-12 v1 and v2 under famine, Moderate v3 in thorps.
- **Several strikes and re-gates removed lines that were true where they printed.** garrison PRESENT v4 was true in 28 of
  30 towns, UNWALLED-LARGE v3 in 18 of 19, BOUGHT-IN v10 in 16 of 16, ECO-12 a-house-needs v3 and v4 in 39 of 39, C4 v2
  and v6 in 17 of 17, STRONG v2 in 26 of 30. That text is lost (silence, or another line).
- **What prints in their place:** 644 true, 218 silence, 78 false. The MED replacements are:
  - Velipol's "watch is all the town has to send" (HIGH 1);
  - STRONG v3 and v12 under occupation;
  - council v1, v2 and v4 "fears the town turning on it" beside an Endorsed rating (8 towns, carried lines);
  - WALLED-STRAINED "defences are sound" beside an Undefended rating (7 towns, carried lines);
  - ECO-12 land-cannot-give "produces no luxury goods" beside gem deposits (7 towns, carried);
  - ECO-10 established v5 "sending goods out" in a besieged town (rw3-town-under_siege+famine-1).

**The headline counts, reproduced in direction:**

| row | seat 10, 772 towns | mine, 905 towns |
|---|---|---|
| #75 | 107 → 0 | 71 → 0 |
| #217 | 19 → 0 | 23 → 0 |
| #246 | 25 → 0 | 46 → 0 |
| occupied garrison | 18 → 0 | 14 → 0 |
| #645 | 11/4 → 0 | 4 → 0 |
| NO force | 16 → 0 | 15 → 0 |

The figures differ because the town sets differ.

**The last read's 59 false rows:**
- 19 cured and true.
- 12 cured, by rewording or by silence, with what prints in their place true.
- 10 struck, with what prints in their place true.
- **18 still false** in their own towns (LINES-READ, table).

**Rulings.** The chair's rulings the seats copied are their briefs' and the 04:58 ruling on fresh presumed-things hits.
I would rule differently on one point:
- **A cure by re-gating has to read the line that inherits the towns.** #58, H4's v9 and H2's v4 each moved a cured town
  onto a sibling that is false there.
- I would require each disqualifier cure's commit to read the pool's remaining eligible line in the cured row's own
  towns.

## 3. The laws (step 3)
- **No record field moves.** With the merged line held fixed (976db5b19 → 70e5e7468) all 720 census records are
  identical. No key was added. `src/domain/facts/factVocabulary.js` is unchanged.
- **Draws:** only corpus draws move, in the 64 pools the stage touched.
- **The shift record.** The draft (`W2-WRITE-SHIFT-RECORD-DRAFT.md`) is not touched inside the stage. I measured its
  surfaces between the tip tree with the base's corpus and the tip:
  - generator golden master, espionage fence, PDF golden, Herald desk golden and preset lighting: 38 tests green at both,
    **unmoved**;
  - the dossier prose manifest: red at base, at the tip tree with the base's corpus and at the tip, **moved**, as declared
    for the merge seat.
- **Ratings, not machinery:** no line prints a count range, an identifier or a rating's machinery. Catalogue labels do
  print through slots in the stage's reworded lines: "gold/silver ore" (47 towns) and "Military/Guard" (36). Both slot
  fills are carried.

## 4. The guards (step 4 and step 8)
The stage's guard file `tests/domain/corpusCureGuards.test.js` has 80 rows.
- **At the tip:** 80 green.
- **With the base's corpus restored:** 78 red. One of the 2 that stay green is DEFICIT v1, a pre-stage cure.
- **BOUGHT-IN v5 cannot red on its fault.** Its cure is `tier: ≥ village`, and its guard town is a hamlet that the pool's
  `guild` mark already refuses.
- **Single plants:**
  - removing DEF-12 CAPACITY v1's `food: ≥ pressured` reds exactly its 2 rows;
  - removing walls AND garrison v2's `no crisis: occupied` reds exactly its 1 row;
  - removing MARKET-OPEN v2's `no crisis: plague_onset` reds **nothing**.
- **21 of the stage's 88 disqualifier cures have no guard row** (`probes/.../unguarded.json`). Among them:
  - MARKET-OPEN v1 and v2 (plague);
  - NO-MARKET v1 to v3 (siege);
  - walls with NO force v2, v3 and v5 (`no mercenary · no crisis: occupied`);
  - Beasts settled v4 and v5;
  - neither walls nor force v6, v8 and v9;
  - POW-6 ADVANCING v1, v2, v5 and v9;
  - SECURE v3 (`stores: < 12`).

## 5. The merge of the line (step 5)
- **d004d56b6's one corpus conflict keeps both sides.** It is walls PRESENT v2, where the line's `gate` sits inside the
  lane's `gate · guardPresence · no crisis: under_siege`. The 7 conflicted files hold no code.
- **Each block at the tip equals its branch,** plus the 14 commits after the merge.
- **The registers, by their own doors at the tip:**
  - wiring census `--check`: 0;
  - fact layers: 0 rises and 0 falls;
  - writer reach: 0;
  - presumed things `--check`: **1**, with 23 fresh hits, named and not cured;
  - observed shapes: **1**: "execution INPUT changed since the last re-freeze" for defense.generated.js and
    economy.generated.js. The tenth seat's corpus commits came after the ninth seat's re-freeze;
  - the page census's banked grid: **red on 7 of its seeds**. 4 of those 7 are green with the base's corpus restored. The
    stage's rewordings removed the P1b words in those towns, and the grid's banked rows were not re-derived after the
    later commits.

## 6. The gates and the governing tests (step 6)
**The gates the stage names, at the tip:** strict-domain 0, type ratchet 0, eslint on the stage's 24 touched JS files 0.

**The governing tests** (32 files: those the stage touched, its registers' tests, the six desks and the two UI flows):
16 red at the tip. I ran the red files at the base and at the tip tree with the base's corpus restored.
- **Red at the base too (carried, 4):**
  - presumedThings ARM 1, "every source literal … declares it";
  - dossierProseManifest DRIFT, FOUR SEEDS and MIXED-POOL AUDIENCE.
- **Red at the tip, green at the base, and green with the base's corpus restored: THE STAGE'S OWN (6 titles in 3
  files):**
  - `tests/ui/generalDeskTabFlow.test.js` FAILS TO LOAD: "drawnMember: NOTHING DRAWS at DS-GEN-18 :: STALLED · seed
    forge_town … 0 are eligible". The ninth seat found it and did not cure it.
  - `tests/ui/economicsTabFlow.test.js` › exportPosture: the page prints "beyond the village" where the anchor expects
    "beyond the town".
  - `tests/components/pageCensus.walker.test.jsx` › the grid, 4 seeds (r2r-metropolis-0, r2s-insurgency-metropolis-0,
    r2s-occupied-hamlet-0, r2s-succession_void-city-0).
- **Red at the tip, green at the base, red with the base's corpus restored (from the merged line's code, or not
  separable, 6):**
  - powerStateProseDesk DS-POW-6 "5a RE-RULED" and "ALIVENESS". The tenth seat measured these red at 6fdff4abd.
  - observedShapeReaders "LIVE ESTATE".
  - pageCensus grid, 3 seeds.

The whole suite was not run (see "What I did not measure").

## 7. The measuring seat's command (step 7: CENSUS-2 over the stage's six corpus files, 720 births, base and tip)
| file | base | tip |
|---|---|---|
| economy | a 102 towns / 25 lines, **b 16 / 9** | a 62 / 2, **b 18 / 10 (RISES)** |
| defense | c 30 / 6, b 7 / 2, a 22 / 18 | c 9 / 5, b 7 / 2, a 17 / 17 |
| power | a 32 / 16, b 3 / 1 | b 3 / 1 |
| general | e 16 / 15, a 5 / 3 | e 15 / 14, a 4 / 2 |
| stressors | c 3 / 1, a 12 / 3 | the same |

- **Kind b on economy rises by 2 towns and 1 line.**
- **The hits new at the tip are siege towns:**
  - ECO-12 land-cannot-give v2 as reworded: "the thorp brings in what it uses, or goes without", at
    r2s-under_siege-thorp-0;
  - ECO-6 minor shadow v1, unchanged: "trade goes unrecorded", at r2s-under_siege-thorp-3 and r2s-under_siege-village-1.
- **The cause is not separable.** The census's base births differ from the tip's by the merged line, so the rise is
  PLAUSIBLY exposure, not proven.
- **The text is the stage's.** The rewording keeps the line's presumption of buying under a siege, and the pool lacks the
  siege mark its sibling pool carries. That is LOW, since "or goes without" covers it.

## Findings, ranked
| # | rank | what | town · sentence | EXECUTED / PLAUSIBLE | origin |
|---|---|---|---|---|---|
| H1 | HIGH | DEF-2 neither walls nor force v9 inherits H4's town and lacks its siblings' `no mercenary` | r2s-monster_pressure-town-2: "With trouble at hand, Velipol's watch is all the town has to send" (Free company hall; "A mercenary company provides enforcement") | EXECUTED | **STAGE'S OWN** (0 base prints, 4 tip prints) |
| H2 | HIGH | DEF-12 CAPACITY v3 left bare when v1, v2 were declared `food: ≥ pressured` | rv2-hamlet-famine-2 and 18 more famine or siege towns: "a good year is comfortable and a bad one is lean" | EXECUTED | **STAGE'S OWN** in 19 towns; CARRIED in 7 |
| H3 | HIGH | DEF-2 neither walls nor force v7: "no soldiers" beside a free company | r2r-town-50 (Saraibuurt) | EXECUTED | CARRIED (a row of the 59, unchanged) |
| H4 | HIGH | POW-5 council v1, v2, v4: "the whole Headman's Authority must agree" where one headman rules; the stage's `no ruler: lord` does not take a headman | r2r-hamlet-24 and 63 town-draws | EXECUTED | CARRIED (re-gated by the stage); v4 is OWN in 2 towns |
| H5 | HIGH (the bar's rank) | #116 not cured: "leaves its timber unworked" beside a Sawmill | 59 of 67 towns, e.g. rv2-metropolis-mass_migration-1 | EXECUTED (my query at rv2-metropolis-mass_migration-1: Sawmill (commercial), Carpenters, Shipyard) | CARRIED; named for the join |
| M1 | MED | GEN-16 LEGACY x6 reworded into bad agreement: "The plague years is a generation old" | 61 towns, e.g. rv2-town-occupied-1 | EXECUTED | STAGE'S OWN |
| M2 | MED | DEF-2 STRONG v3 (reworded) and v12 (new): "its defenders are still paid on time" beside "The occupiers take the revenue" or "Chronically underpaid" | r2s-occupied-city-1, r2r-metropolis-39 (7 towns) | EXECUTED | STAGE'S OWN |
| M3 | MED | DEF-2 v4 inherits H2's town: "no line and no force" beside a charter hall that musters the defence | rw3-hamlet-under_siege-1 | PLAUSIBLE (reader) | STAGE'S OWN |
| M4 | MED | DEF-2 v6 as reworded: "nobody under arms" under the Beasts row's "people arming themselves" | r2r-thorp-5 | PLAUSIBLE (reader) | STAGE'S OWN |
| M5 | MED | GEN-13 MARKET-OPEN v3 lacks the `no crisis: plague_onset` its siblings now carry: "Visitors find Weichsee's market without asking" beside "the guards turn back travellers" | r2s-plague_onset-hamlet-1 and 6 more; 2 are new | EXECUTED (my query of the record and the page at r2s-plague_onset-hamlet-1) | OWN in 2 towns, CARRIED in 5 |
| M6 | MED | GEN-18 STALLED v3 (new): "always bought in" beside "No recorded imports" | 1 town | PLAUSIBLE | STAGE'S OWN |
| M7 | MED | 3 reds of the stage's own: generalDeskTabFlow (fails to load), economicsTabFlow exportPosture, pageCensus grid x4 | — | EXECUTED | STAGE'S OWN |
| M8 | MED | 38 lines the stage reworded or re-gated and left false (ECO-11 unexploited, ECO-12 critical import, DEF-3 Moderate v1, DEF-9 magicDependency, ECO-1 C4 v3, POW-6 ADVANCING v5 and v9 under occupation, FTH-4 heresy, and others) | LINES-READ | readers, a sample re-checked | CARRIED |
| M9 | MED | 21 disqualifier cures with no guard row; MARKET-OPEN v2's plant reds nothing; BOUGHT-IN v5's guard cannot red | — | EXECUTED | STAGE'S OWN (the guard file is the stage's) |
| L1 | LOW | strikes and re-gates removed lines true where they printed (garrison PRESENT v4 28/30, UNWALLED-LARGE v3 18/19, BOUGHT-IN v10 16/16, ECO-12 v3/v4 39/39, C4 v2/v6 17/17) | readers2 | EXECUTED (readers) | STAGE'S OWN |
| L2 | LOW | the siege and plague twins of DS-GEN-13 are clipped at the first comma on the overview: their crisis clause never prints | e.g. "Kaliburg's market grew up on the road's trade." under siege | EXECUTED | the rung's clip (display code), not the stage's |
| L3 | LOW | census-2 economy kind b rises 16 → 18 towns | §7 | EXECUTED; the cause PLAUSIBLE | not separable |
| L4 | LOW | catalogue labels through slots: "gold/silver ore", "Military/Guard" | 83 towns | EXECUTED | CARRIED slot fills |
| L5 | LOW | observed-shape freeze stale for two corpus files; presumed things 23 fresh | doors | EXECUTED | STAGE'S OWN, named by the lane |

**Lines I would strike or re-gate, for the owner's veto:**
- DEF-2 v9: add `no mercenary`.
- DEF-12 v3: add `food: ≥ pressured`, so the pool falls silent under hunger.
- DEF-2 v7: add `no mercenary`.
- POW-5 council v1, v2, v4: a headman atom.
- ECO-11 unexploited v1 and v3 (both pools): strike until the catalogue's tag lands.
- GEN-16 LEGACY x6: undo "The {calamity} is".
- DEF-2 STRONG v3 and v12: add `no crisis: occupied`.
- GEN-13 MARKET-OPEN v3: add `no crisis: plague_onset`.

**What the chair must rule:** whether the lane goes back for a seat before it joins. My recommendation is yes, for H1, H2,
M1, M2, M5 and M7, with a guard row each; and with the rule in §2 that a re-gate reads the line that inherits the towns.

## What I did not measure
- **The whole suite, in six shards.** I ran 32 governing files, then the red files at the base and at the tip tree with
  the base's corpus restored.
- **More than 3 eye reads per line**, outside the scripts. The readers' MED reads are not each re-checked by me: I checked
  the 6 HIGH, one MED per reader, and the 10 struck rows of the 59.
- **Five lines that never print** in 2,601 births (LEGACY-LINKED v1, v2; POSTURE: vulnerable v2; NO-MARKET v1, v2).
- **The eleventh seat's commits after 70e5e7468.**
- **The page census door's full 720 run.** Its banked grid was read through its walker test.
- **The side branches' own hand-backs** beyond what hand-backs 8 to 10 repeat.

## Hazards
- **`npm ci` set `core.hookspath=.husky/_`** in the shared local config. I unset it at once, restoring the snapshot.
  Refs and config were compared before and after every suite and every push.
- **Ref changes:** only my own branch, the fetched remote refs, and `review-fixes-2026-07-08`, which the brief said to
  fetch.
- **Pushes ran with no hook installed**, nothing skipped and no `--no-verify`. I ran the hook's three gates by hand at the
  tip.
- **Scratch worktrees,** all detached at 70e5e7468, b5206acd3 and 976db5b19: `undo` and `plant` (each plant restored with
  `git checkout`), outside the repository tree. They are not committed.

## HAND BACK (the count read 502,174 at 13:02 UTC, past the 400,000 mark)
**Done.** Steps 1–8 and the verdict are complete:
- e5b2deaae: step 1, the cold list.
- 7eedabb18: steps 2–8 and the verdict.

Nothing is running. Every scratch worktree is outside the repository and uncommitted.

**What is left, line by line** (none of it changes the verdict):
1. **The whole suite in six shards**, `--shard=<i>/6`, each to its own file, every red file classed at the base. The
   governing 32 files are already classed (§6).
2. **The page census door's full 720 run**, `node scripts/census/page-census.mjs --workers=3` at the tip. Only its grid
   was read, through its walker test.
3. **A re-read by hand of the readers' MED lines** I did not check myself (§"What I did not measure"). Each has its
   town, sentence and fact in `probes/REVIEW-W2-WRITE-2/lines-read.json` and `readers/out-*.json`.
4. **The side branches' own hand-backs** (W2-WRITE-SIDE-ECO-HANDBACK, W2-WRITE-SIDE-REST-HANDBACK): their cure rows read
   against `lines-read.json`.

**How the instruments are re-made.** Every script is under `probes/REVIEW-W2-WRITE-2/`. Extract it with
`git archive origin/lane/review-w2-write-2-2026-11-14 docs/chair/2026-11-14/probes/REVIEW-W2-WRITE-2 | tar -x -C <scratch>`,
then:
- **Trees.** Make detached worktrees at 70e5e7468 (tip), b5206acd3 (base) and 976db5b19 (int). Run `npm ci` in tip, then
  `git config --local --unset core.hookspath` in the main clone. Link node_modules into the others; the lockfile is the
  same.
- **The tip with the base's corpus (`undo`):** a worktree at 70e5e7468 with the six
  `src/data/dossierStateProse/*.generated.js` files written from `git show b5206acd3:<path>`.
- **The render:** `sh render.sh <tree> <out> <seedsfile> 4`, with seeds from `seedsfresh.txt`, `seedsprev.txt`,
  `seedshunt.txt` and the census's `seeds.txt` from lane/second-wave-census-2026-11-12.
- **The other surfaces:** `node pdftext.mjs <tree> <out>/records <out>/pdf <out>/pp` writes the PDF and stored-prose
  text.
- **Where each line prints:** `node drawn.mjs <tree> <records> <out.json>` reads the kernel's draw ledger. Run it with the
  tip and with `undo` to get own or carried.
- **The line list:** `node attach.mjs items.json drawn.json <renderRoot> lines.json`, then
  `node linesread.mjs <work> <readersDir> <md> <json>`.
- **Lines that never print:** `node hunt.mjs <tree> <seedsfile> "<ids>" <out.json>`, by the ledger alone.
- **Removals:** `node removals.mjs removals.json <undo pdf> <tip pdf> drawn-tip.json mounts.txt <outDir>`.
- **Guard plants:** in a scratch worktree, `node plant.mjs <tree> <file> <block> <pool> <vid> <mark>`, run the guard file,
  then `git checkout -- src/data/dossierStateProse/`.
- **The laws:** `idlaw.mjs` (ids and rows), `fielddiff.mjs` (the census births, `births.mjs`, at int and tip) and
  `twins.mjs`.
- **The readers' briefs:** `LINES-READER-BRIEF.md` and `REMOVALS-READER-BRIEF.md`.
