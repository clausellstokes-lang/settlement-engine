# PAGE-8's hand-back (PEOPLE AND PLACE, after PAGE-6). Last written 2026-11-20 21:35 UTC by `date -u`

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
| F5-NARROW | builder c54e50185 (`page8/f5`, worktree /home/user/wt-p8-f5); MERGED on `page8/int` (/home/user/wt-p8-int): 75cb5ef99 merge, f43e5266a manifest row, a8674e012 lighting door (3714→3715) | read once; red/green re-run 3 failed\|1 passed → 4 passed; builder's 300: narrow 139→21, F5 1,019→901, 118 cards secret only | AWAITS THE CHAIR'S RULING on the join surprise (§3); then `tests/generators`, `tests/data`, `tests/lint`, `tests/build` (rule 8 as re-ruled 21:27), writer-reach by its door if ruled (A), fast-forward the lane to `page8/int`, push, request "F5-NARROW <commit>" |
| SECRET-LINES (frames) build | builder in /home/user/wt-p8-sec, `page8/secret-lines` | out (resumed 19:5x); told COMMON-RULES rule 2 (key siblings K0–K3 by index), rule 7 | read diff once, red/green, two-tree (only secret.what/.stakes), lighting, build + two build tests, directories, merge |
| ARRIVAL-LINES-2 (landmarks) build | builder in /home/user/wt-p8-arr2, `page8/arrival-lines-2` | out (resumed 19:5x); told rule 2 (key by branch + index), rule 7 | same; plus the under-siege count; register the pool as siblings are |
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
