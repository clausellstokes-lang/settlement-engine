# CLOSE-8 — HAND-BACK (FINAL: CLOSE-8 HANDS OVER by the chair's G46; section 0 is the whole memory)

The close's seat of THE TENTH CHAIR (session_019yED1SUxGVHyjQnoqoFvQ8), successor of CLOSE-7. Its law:
`docs/chair/2026-11-24/tenth/prompts/START-CLOSE-8.txt` on `lane/chair-2026-11-08`; the rulings G42-G46 in
`docs/chair/2026-11-24/tenth/gen/RULING-G.md` there. A successor reads its own start file, then THIS SECTION, and needs nothing else.

## 0. FOR THE SUCCESSOR

### 0.A POINT 118: WHERE EVERYTHING IS (accepted by the chair, G46)
- THE JOIN: `lane/close-8-2026-11-25-join` at **3836a832e3** (pushed), cut at the line's tip 09c29806b (point 117). The landing
  record, everything sent with "CLOSE-8 3836a832e3": `docs/chair/2026-11-21/eighth/close/close-8/LANDING-118.md` (merge commits of
  the 29 units, the table of proof (4), each unit's every-birth check, frozen surfaces, sizes, the veto sentences, process notes).
  The chair's helper lands it; the second reader's eight faults (G45) are cured by the chair's builder on the landing's tree, not here.
- NO SEAT'S UNIT on the join: G43 bb6bcd035f (`power/governanceLabelRoster.js :: noGrazingQuarrelOfBirth`, the grazing flag's one
  home; walker `tests/lint/grazingQuarrelOneHome.walker.test.js`), its lighting door ae135e8ee6. ANCHORS-5 26a8ad9e3c (test-only).
- THE CURES, each on its own branch (all pushed), merged into the join:
  | cure | branch | commits | merge on the join |
  |---|---|---|---|
  | NEED-ATOM (R24q 7) | lane/close-8-2026-11-25-need-atom-wip | 031e04e84c | de397d6de6 |
  | D7-BYTES (G24) | lane/close-8-2026-11-25-d7-bytes-wip | f94dc00d82 | 18564b34b1 |
  | GOALS-I13 (R24q 2, G44) | lane/close-8-2026-11-25-goals-i13-wip | 1f6d2c0ce2, b136ae0b2d, e59e38ddbb | 81c6223752 |
  | WRITER-REACH (G20, G37 (i)) | on the join itself | 3836a832e3 | (itself) |
  Their briefs: `close-8/briefs/` (NEED-ATOM, D7-BYTES, GOALS-I13, G43-ONE-HOME, ANCHORS-5, WRITER-REACH, PROOF-4). Their reports are
  the builders' final messages, kept in LANDING-118.md (every builder's own REPORT.md write was refused by its permission check).
  GOALS-I13's measure is runnable: `close-8/goals-i13/README.md` (one command, two tables; residual C 6, V 6: the order-free deal is
  the owner's pre-release decision).
- THE PROOF'S TOOLS: `close-8/tools/` (CLOSE-7's page battery `page-battery.mjs` + `page-battery.render.census.jsx`, plan makers
  `make-plan.mjs` (C) and `make-visitor-plan.mjs` + `plan-lit.json` (V); BIRTH-1's births harness `births.mjs` + `births.census.jsx`,
  `measure-keys.mjs` (per-field hashes), `check-d2.mjs`, `check-d2b.mjs`, `check-d7.mjs`, `measure-d*.mjs`; `goals-i13.census.jsx`);
  the PROOF-4 builder's copies of every seat's tools and its attribution script: `close-8/proof/tools/<seat>/`, `proof/tools-C/attr.mjs`;
  its report `proof/PROOF-4.md`.
- HOW C AND V ARE RE-BORN ON A TREE: `node close-8/tools/make-plan.mjs planC.json` and `node close-8/tools/make-visitor-plan.mjs
  close-8/tools/plan-lit.json planV.json` (900 each, seeds dp-<size>-<i>); then THE BEFORE-AND-AFTER:
  `GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- node close-8/tools/page-battery.mjs --plan=planC.json --out=<dir>
  --tree=<abs tree> --workers=3 --views` on each tree (the tools must live inside the main checkout so their imports resolve), then
  `node close-8/tools/page-battery.mjs --diff=<before>,<after>`. At 4 workers a worker can die on a metropolis: re-render the missing
  seeds as a fill plan into another dir, copy the rows in, and recount with `--from=<dir> --plan=...`. The "Patron deity" block on
  the Power view flips between renders of the SAME tree: render noise (C 5, V 4 pages at 118).
- WORKTREES (container only, all clean): /home/user/wt/join, /home/user/wt/before (detached at 09c29806b), need-atom, d7-bytes,
  goals-i13, b1ib (cut at 3836a832e3, EMPTY: its builder was stopped by G46 before writing anything). Each has node_modules and
  `.husky/_` linked; `/node_modules` and `/.husky/_` are in `.git/info/exclude`.

### 0.B WHAT JOINING TAUGHT (written nowhere else)
1. THE ORDER THAT WORKED: no-birth units first (D5, D4, D3), then each seat's group in its own noted order (BIRTH-1's D2, D2b, D7 and
   BIRTH-2's P9; WORDS-1's E1, D6, E8, E8b, E13b; WORDS-2's test-only units, then E9, E4, G6, G1 (the shared generator and opposite
   pairs together), G8, G9, G10, G11, G34, E5, E6, E13a), the one records-moving WORDS-2 unit (E3) LAST, then the cures, then the
   register doors that read the whole tree (writer-reach) LAST of all. `git merge-tree --write-tree --name-only <a> <b>` predicts
   every textual conflict without a worktree or a commit: run it unit by unit against the line and pair by pair on shared files.
2. THE DOORS (each re-takes its file; a conflict takes the join's side first, `git checkout --ours`):
   - lighting: `LIGHTING_CENSUS_REFREEZE='<seat>' LIGHTING_CENSUS_NOTE='<why>' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`
     through the mutex: it FAILS BY DESIGN on the refreezing run ("census REFROZEN ..."); commit the file; the next run without the
     env is the green. It refuses a dirty tree (hence the excludes).
   - wiring: `node scripts/wiring-census.mjs --check`; if stale, `node scripts/wiring-census.mjs` (writes).
   - observed-shape: `node scripts/check-observed-shape-readers.mjs` (check); `--write` to re-freeze.
   - writer-reach: `node scripts/check-writer-reach.mjs --write` (shrink-only; it also re-freezes the tree's own closure sizes and
     digests; there is NO form to declare a display reader: `scripts/lib/writer-reach-scan.mjs :: WEB_DISPLAY_DIRS` is a fixed list).
   - the mutation manifest (`scripts/mutation-coverage-manifest.json`) has NO door: hand rows; a conflict is the union (G42 (b)).
   - the dossier state prose: `node scripts/generate-dossier-state-prose.mjs` after E4/E9/G1/G6 re-projects the .md and
     `economy.generated.js` (byte-equal at 118).
   The scratch scripts that ran all this (merge with census-side, merge+typecheck chain, doors per group, lint) lived in the session
   scratchpad and go with the container: rebuild them from this list.
3. THE ONE CLEAN-TEXT CONFLICT: D3 x E3. D3 COPIED rulingStructure's inline grazing flag into its new leaf
   `governanceLabelRoster.js`; E3 changed `noGrazingQuarrelOf`'s arguments and its one call. Git merged it clean; ONLY
   `npm run typecheck:ratchet` (TS2353, +1 in the leaf) showed that D3's re-write path would undo E3's rule. THE LAW (G43): such a
   conflict is a STOP with the hunk to the chair, and the cure is ONE HOME, never a copy brought up to date. Run both typechecks
   after EVERY src merge, before the next: it is the only net for semantic conflicts.
4. The pre-push hook judges the directory it runs in: push each code branch from its own worktree, by its own name, after
   `git ls-remote`; the join cannot be pushed while a typecheck is red on it. A PUSH WITH NOTHING NEW RUNS THE WHOLE CHECK: compare
   `git rev-parse HEAD` with `git ls-remote` in the SAME command and skip the push when equal (CLOSE-8 failed this once at the
   hand-over, 06:2x UTC 2026-11-26: a commit that did not happen left HEAD equal to origin; the check ran to `test:ratchet` and was
   killed; core.bare false, no Fixture identity or commits after). The pre-commit hook runs `eslint --fix` on staged .mjs/.jsx:
   never commit a builder's tool copies while it is still running them.
5. A builder's every-birth check read on the JOINED tree can show another unit's moves (E8b's round trip held E13b's and E1's
   strings; D3's measure held D7's twin births): attribute by unit before calling it a fault.

### 0.C POINT 119 (ruled; NOT STARTED; build in this order, each red first with its every-birth check on C and V; cut at the line's
tip once point 118 has landed, or at 3836a832e3 if the chair says so)
1. B1(i)b (R24r 6): the Hunter's lodge's successor "Furrier's district" is not withheld (18 of 40 desert cities and metropolises hold
   it with no hunting grounds and no fur import): the successor lives on what its lodge lives on, by ONE home of the rule
   (`src/domain/landWithholding.js`, lazy-pinned), a row read by catalogue id. Brief ready: `close-8/briefs/B1IB.md` (re-cut at the
   new base).
2. E13d (G35): the sameness door does not count a role title or a fixed caption as a drawn sentence; the skip list DERIVED by import
   from the titles' own homes and `sectionHelp.js`, never typed, never by length, never a slot skipped whole; a test that no drawn
   pool's line is in it; the door's reading before and after (only the eleven slots change; one still over its ceiling is a
   finding); the register re-taken only by `--write` and only if it passes. WRITTEN WHOLE in WORDS-2's hand-back section 0.8:
   `git show origin/lane/words-2-2026-11-25:docs/chair/2026-11-24/tenth/gen/words-2/HANDBACK.md`.
3. P9b's MEASURE (G37 (ii)): the PDF's four defence score averages (`src/pdf/lib/viewModel.js`, scoreAvg) still average the STORED
   monster score: measure what they print in settled country on C and V and propose ONE line; build nothing before the chair rules.
4. B1(ii) REDESIGNED, LAST (R24r 1 and G45's added line): `traditions/genesis.js`'s field-rite rule: the draw runs exactly as before
   and the rule is asked AFTER it (a refused field rite is replaced by the next admitted pick; no other row moves); the predicate is
   the place's own food record (grain NOT grown here), native goods only; a record not stamped by this engine keeps its set; A
   VIEW-TIME RULE MUST NOT RE-DEAL A SAVED TOWN (D13's principle); the check over every birth AND over the shown set of every
   base-born record (0 moved). It lands as its own point (it cost a day riding a large landing).
5. D13 STABLE-PICKS (G45): a saved town's Daily Life is re-dealt by G8, E5, E6 (accepted for 118, written down): a MEASURE and a
   DESIGN first, one message to the chair, nothing built before the ruling.

### 0.D STATE AT THE HAND-OVER
Every branch pushed; the main checkout clean on `lane/close-8-2026-11-25`; no builder and no run alive. Mark: the chair's read of my
record was 485,514 an hour before G46; my own estimates ran low by about half throughout.
