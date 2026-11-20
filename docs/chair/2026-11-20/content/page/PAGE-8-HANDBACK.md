# PAGE-8's hand-back (PEOPLE AND PLACE, after PAGE-6). Last written 2026-11-20 22:35 UTC by `date -u`

A successor needs this file, `PAGE-6-HANDBACK.md` (§0a the F5 ruling verbatim; §4 lines), the chair's
`docs/chair/2026-11-20/seventh/prompts/COMMON-RULES.txt` (origin `lane/chair-2026-11-08`; thirteen rules, binding) and the briefs
under `briefs/`: `BUILDER-RULES.md`, `F5-NARROW.md`, `SECRET-LINES-BUILD.md`, `ARRIVAL-LINES-2-BUILD.md`, `L4-FINISH.md`,
`S9-POST.md` (commit 2: the guard), and the HELD drafts' briefs `SECRETS-30.md`, `PHYSICAL.md`. PAGE-8 integrates; builders build.

## 1. State (21:35)

- THE LANE `lane/page-8-2026-11-20`: on origin at 8c99728d9 (faa833b7a + the working line 062504aa8 merged as 9b63e242f + docs).
  NO UNIT IS ON THE LANE YET. The line's tip, figures and known reds: `docs/chair/2026-11-20/seventh/ci/LINE-NOW.md` and
  `RED-AT-LINE.tsv` on the chair's branch (read before each landing request).
- STANDING ORDER (the chair, 20:52; the weekly usage limit): FINISH BEFORE STARTING. Finish F5-NARROW, the frames' build, the
  landmarks' build. HELD (not cancelled; start no builder): SECRETS-30's re-cut and its second file; PHYSICAL.
- LOCAL ONLY (this container): `/node_modules` added to `.git/info/exclude` so the lighting door sees a clean worktree (each
  worktree has an untracked `node_modules` symlink).

## 2. Units

| unit | where | state | next |
|---|---|---|---|
| F5-NARROW | builder c54e50185 (`page8/f5`, worktree /home/user/wt-p8-f5); MERGED on `page8/int` (/home/user/wt-p8-int): 75cb5ef99 merge, f43e5266a manifest row, a8674e012 lighting door (3714→3715) | read once; red/green re-run 3 failed\|1 passed → 4 passed; builder's 300: narrow 139→21, F5 1,019→901, 118 cards secret only | RULED (A) 21:33 (ruling 12); builder resumed for its test + writer-reach digest measure (no refreeze); pushed as `lane/page-8-2026-11-20-f5-wip` (a8674e012); then `tests/generators`, `tests/data`, `tests/lint`, `tests/build` (rule 8 as re-ruled 21:27), writer-reach by its door if ruled (A), fast-forward the lane to `page8/int`, push, request "F5-NARROW <commit>" |
| SECRET-LINES (frames) build | builder in /home/user/wt-p8-sec, `page8/secret-lines` | unit 9fc56c549 on kernel merge f2d187ab8 (pushed `lane/page-8-2026-11-20-frames-wip`): stopped on CN2 (7 lines name # twice); RULED 22:34 (ruling 14), builder resumed | read diff once, red/green, two-tree (only secret.what/.stakes), lighting, build + two build tests, directories, merge |
| ARRIVAL-LINES-2 (landmarks) build | builder in /home/user/wt-p8-arr2, `page8/arrival-lines-2` | unit 462fa0a81 on kernel merge f8ca5166d (pushed `lane/page-8-2026-11-20-arrival2-wip`), NOT wired (stopped on rule 2); RULED 22:34 (ruling 13), builder resumed | same; plus the under-siege count; register the pool as siblings are |
| SECRETS-30 | draft f861dd289 on the lane; worktree /home/user/wt-p8-s30 | HELD (re-cut ruled 20:50 but not drafted) | when released: §4 item 6 |
| PHYSICAL | /home/user/wt-p8-phys (an uncommitted partial measure script only) | HELD | when released: `briefs/PHYSICAL.md` |
| L4 | — | waits for F5's merge | `L4-FINISH.md` amended to F5's merged tip; register office rows into S9's pass AND the narrow pass; do NOT add "principled" to the guard at `npcData.js` (16:41 (3)) |
| the guard | — | after L4 | S9-POST commit 2 |

## 3. F5-NARROW's join surprise (sent to the chair 21:3x; ruling owed)

Two-tree 9b63e242f → `page8/int` (the scratch births in `cw/`): golden 525: 0 non-string, strings secret.what/.stakes 37 docs.
CENSUS 720: 13 NON-STRING: `npcs[].goal.intent.{short,long}.target` {power/house/npc} → null on 13 cards (goal.short 10,
goal.long 3), beside secret.what/.stakes on 226 cards. Cause: the goals lane (now on the line) deals wants AFTER the pass and
reads the secret, so a walked secret re-deals that card's want. Same cause: `tests/lint/writerReach.walker.test.js` shapesDigest
7350e7ff… → baa98954… (two titles; not on RED-AT-LINE). Options put: (A) accept the 13 as named and refreeze writer-reach by its
door; (B) keep the want as dealt; (C) move the pass before the goals deal, still after rankPowers' yield.
Build at `page8/int` vs the line: first paint 1,177,668 raw (=), 374,668 gzip (−2); worker 2,633,147 (+1,911); engine 927,799
(+1,901): all five build rows on RED-AT-LINE. `tests/lint` at f43e5266a: 3 failed of 3,271 (lighting: since refrozen; writer-reach ×2).

## 4. Rulings in force (the chair; each vetoable by the owner)

1. (18:26) F5 IS RULED: A-NARROW, five conditions (PAGE-6-HANDBACK §0a, verbatim).
2. (19:08) Order: F5-NARROW; L4 then the guard; ARRIVAL-LINES-2 and SECRET-LINES lines to the chair before a builder.
3. (20:02) SECRET-LINES 40 approved with five cures (in `SECRET-LINES-BUILD.md`); the build through the sibling door, the five
   conditions pinned red-first.
4. (20:02) ARRIVAL-LINES-2 31 of 32 (great cathedral [10] struck), three cures; the candidate list filtered WHOLE (drawn line
   included) before the keyed pick. STOP AT THE LANDMARK TRANCHE (the 255 more lines not ordered). NAMED, NOT CURED: 57 printed
   landmark lines name a grander house than the roster holds (27 towns "gatehouse arch" with only town walls; 30 cities "massive
   walls" with city walls + citadel; `checkInstCompat`'s declarations read through textOf only).
5. (20:02, re-ruled 21:27) Before each landing request: one `npm run build`, then `VERIFY_DIST=1` on
   `tests/build/vendorPdfLazy.test.js` and `tests/build/generationWorkerLazy.test.js`; first paint's three figures and the
   worker's beside LINE-NOW's. NO WHOLE `test:ratchet` (21:27): instead ONE run of the touched directories (`git diff
   --name-only <line tip>...HEAD -- src`): `tests/generators` + `tests/data` for `src/generators/**`/`src/data/**`;
   `tests/components` + `tests/pdf`; `tests/domain/<dir>/`; `tests/store`, `tests/lib`; ALWAYS `tests/lint` and `tests/build`;
   failing rows BY NAME against RED-AT-LINE.tsv; a row not on it is a figure the unit moved (named) or a real red cured first.
6. (20:50) SECRETS-30: BREADTH FIRST (30% bar): re-cut to ~60 lines over 57 rows ("divine visions" only to under 30%); a second
   file to bring all 113 rows under 30% (116 lines); draft for the six hideable-house rows too (a secret is owner-only by
   construction: `publicSafe.js`), listed for the security reader; the moneylender line declares the house or is reworded; §3's
   seven conditions are law, the two unscripted ones pinned by tests; tables keyed by row id/index, never full text. HELD 20:52.
7. (20:36) COMMON-RULES.txt binds every builder; rule 2: A LITERAL HAS ONE HOME (an existing line is never copied into a pool
   file; the call site composes [existing, ...siblings]).
8. (20:44) PHYSICAL: measure first (clothes/feature/build repeated inside one place); (a) the held pick, (b) more lines. HELD 20:52.
9. (20:52) FINISH BEFORE STARTING (standing until the owner answers).
10. (21:27) The line's CI at point 85: no real red; `tests/build/landingFixtureFreshness.test.js` ×2 are NOT the lane's (re-emitted
    at the close).
11. (16:41 (3)) L4 does NOT add "principled" to the guard at `npcData.js`. (e) keyed pools take `pickVariantMixed` (kernel-mix
    bd42d63c7, on the line).

12. (21:33) F5-NARROW AT THE JOIN: (A). The want follows the printed secret; THE 13 GOAL MOVES NAMED (`npcs[].goal.intent.{short,long}.target` and the goal's text on 13 cards of the census's 720; cause: the goals deal, landed at point 84, reads the final secret). (B) refused, (C) adds nothing. CONDITIONS: (1) ONE TEST pins the law on one of the 13 as a fixture (the printed want is the deal's for the printed secret; the stale want not printed); (2) WRITER-REACH by its own door with this cause; the merge message says what the two red titles' digests gained (a new writer identity for `secret.what`/`.stakes`; a new shape for `goal.intent.*.target`: which); a NEW identity is named and carried to the veil's reader list; (3) the 226 secret moves strings only.
13. (22:34) LANDMARKS: `structuralValidator.js :: checkInstCompat` returns the drawn landmark WITH its branch and index; every caller updated in the SAME commit reading the text as before; the record stores the same string; the two-tree run on that commit ALONE gives 0 differences before the siblings are wired. Three rewordings approved (citadel 3 "…plainly built to be held, not admired."; citadel 7 "The road passes beneath the citadel, close enough to see how thick its foundations are."; great cathedral 16 "…built to be seen from a long way off, and it is."); `church` on every cathedral row and `tier: ≥ village` on the two "streets" rows approved. Measure taken (6.8 / 8.1 / 9.1%; no siege paragraph carries the beat).
14. (22:34) FRAMES: the second mention of the SAME person in one sentence becomes they/them/their where no other person or group stands between; else recast so the name stands once. Build the seven (K1-1, K1-2, K1-6, K1-7, K1-10, K3-7, K3-10); they come to the chair as built, one line each with #, in the merge message (it may strike one then). The same rule cures the unit's own K0/K2 lines. THE TWO EXISTING FRAMES that repeat the name are NOT changed: list them here for a second batch, with one line on what `namesInSentences` CN2 misses (it reads only secrets with an internal full stop) for widening after the deploy. EXPLAIN in the landing line: the commonest frame on 18.0% of metropolises (one K0 sibling): K0's siblings against K1–K3 and the share of a metropolis's cards that draw K0; thinner → more K0 siblings in a later unit (lines to the chair); noise → show on 300. Then doors (pool dominance, lighting), rule 8's run, the landing line.
15. (22:34) THE MARK: the chair's read of this seat 343,465 at 22:34 (own count runs low). Go on to the landing line or 400,000 BY THE CHAIR'S READ, whichever is first; a successor is seated on this hand-back alone, on the lane's tip.

## 5. Measures (before → after)

| measure | before | after |
|---|---|---|
| principled + venal, PAGE-1's f5.mjs (300) | 1,019 / 5,452; narrow 139 | F5-NARROW (builder's): 901; narrow 21 (survivors named in its hand-back: prison warden 7, black marketeer 4, lord 2, luxury merchant 2, priest, dean, customs collector, bowyer, brickmaker, chandler) |
| arrival: three in a row share a sentence (900) | thorp 20.8 · hamlet 22.3 · village 19.7 · town 33.3 · city 40.9 · metropolis 59.6% | landmark beat projected 7.2 / 8.3 / 9.4% (town/city/metropolis); built: owed |
| the four secret frames, commonest (900) | village 50.7 · town 88.7 · city 100 · metropolis 99.3% | projected 8.0 / 11.3 / 12.7 / 13.3%; built: owed |

## 6. Houses listed for the security reader; stored figures moved

- Landmark lines need: great cathedral, cathedral, citadel, walls, gates (none hideable). Secret frames: no house.
- Stored figures moved so far: none on the lane. Pending F5: writer-reach shapesDigest (§3).
- Worker bytes: F5-NARROW +1,911 (measured at `page8/int`).
