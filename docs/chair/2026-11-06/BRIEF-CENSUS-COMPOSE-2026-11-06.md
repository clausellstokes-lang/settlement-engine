# BRIEF — THE CENSUS COMPOSE (lane CENSUS-COMPOSE, 2026-11-06)

Seat: Opus 5.5, builder. Chair: Fable 5.1, cloud session `01FE9mEvGxnFx6WTBkEC6ie9`, under the owner's full delegation of 2026-11-03/04/06 ("I also now give all permissions required now and in the future. I also defer all judgement to you."). Every ruling you need is written; where one is missing, STOP that unit, record the question in your report, and go on with the next unit. You send no messages to anyone; your report is the hand-back.

## 0. Where you work

- Worktree: `/home/user/se-census`, branch `lane/census-compose-2026-11-06`, cut from `origin/lane/census-sop-2026-11-04` at `f28689600` (the chair's rulings docs commit). `node_modules` is a symlink to the main checkout's install (the lock is byte-identical across every lane; never run `npm install`/`npm ci` here; never edit `package.json` or `package-lock.json` — rule 11 of the standard: a lane that would edit either STOPS).
- The box has 4 cores shared with a running gate (the rung-1 landing's `npm run check` in `/home/user/se-landing`) and one sibling lane. Run soaks with `--workers 2`. Run vitest ONLY on targeted files (`npx vitest run <file> …`), never the whole suite, never `npm test`, never `npm run check` — the chair runs the gate.
- Read a gate or a long command NEVER through a pipe: `sh scripts/gate-tail.sh <command…>` or redirect to a file under `/tmp/claude-0/-home-user-settlement-engine/91098d1e-536b-53ea-a385-88e9fe415a85/scratchpad/` and read its exit code from the file. Never print a log, a register or a generated artifact whole into your context — grep the count lines, read by range.
- Commit on your branch by explicit paths, receipts in the message body (what moved, how measured, the red-first's title). End every commit message with these two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01FE9mEvGxnFx6WTBkEC6ie9`
- PUSH AS TRANSPORT after every milestone (`git push -u origin lane/census-compose-2026-11-06`; on a network failure retry 2s/4s/8s/16s): this container is ephemeral and the push is how work survives. Never push any other branch, never master, never open a pull request.
- Stop and hand back at about 300k tokens of your own context, after the unit you are on, with everything committed and pushed.

## 1. Read first, whole (in this order)

1. `docs/OPERATING_STANDARD.md` §1, §4, §5 (quality floor; measure first; the report diet; no dumps).
2. `docs/DESIGN_POOL_CENSUS.md` (the program: the fact vocabulary, the pool inventory, the gate design, the order).
3. `docs/census/CHAIR_RULINGS_2026-11-05.md` — WHOLE. R-A…R-AZ bind you. The last two blocks (10:3x and 11:0x) name the compose's late items; this brief restates them in §3.
4. `docs/census/VOCABULARY_RULINGS_2026-11-04.md`.
5. After the merges of §2: every lane record — `docs/CENSUS_1B_LANE_2026-11-04.md`, `docs/CENSUS_2_LANE_2026-11-04.md`, `docs/CENSUS_3_LANE_2026-11-04.md`, `docs/CENSUS_4_LANE_2026-11-04.md`, `docs/CENSUS_5_LANE_2026-11-04.md`, `docs/CENSUS_1_LANE_2026-11-04.md`, `docs/READER_R11_TONIGHT_WANTS_2026-11-04.md`, `docs/SOAK_READER_INSTRUMENTS_2026-11-04.md`, and the reader-validation lane's record (find it under `docs/` after its merge). Each names the commands it ran (the prose generator's `--check`, the wiring census's `--dry` and re-take, the walker suites), its interlock reds, and what it left for the compose.
6. `docs/RUNG2_F12_CRISIS_BLIND_2026-11-04.md`, `docs/SOAK_10000_RUNG2C_2026-11-04.md` and (after merging `window-rung2`) the rung 2D report — the STOP the compose owns.

## 2. The compose (unit 1) — one branch carrying every census and reader lane

Merge, in this order, each as a merge commit (`git merge --no-ff <sha>`), resolving every conflict as the UNION of both lanes' intent — never a choice of one lane over the other made silently; every conflict and its resolution goes in your record:

1. `origin/lane/window-rung2-2026-11-04` at `3bc72bc0c` (rung 2D's tip: the famine-stores rounding and two instrument units) — first check `git merge-base --is-ancestor`; merge only what is not already an ancestor. Do the same ancestry check for `origin/lane/rung2-f12-crisis-blind-2026-11-04` `e216a2673`, `origin/lane/rung2-f13-crisis-facts-2026-11-04` `a01fd581f`, `origin/lane/rung2b-fixes-2026-11-04` `1b8c43aa8`, `origin/lane/census-0-2026-11-04` `ce21acd2d`, `origin/lane/reader-instruments-2026-11-04` `15bb47e57`; merge any that is not an ancestor and say so.
2. `origin/lane/census-1b-2026-11-04` at `e36e4916f` — THE MECHANISM LANE, complete (the chair, 11:0x).
3. `origin/lane/census-4-2026-11-04` at `240c11f56` — THE NPC LANE, complete (it already carries 1b at `e36e491`).
4. `origin/lane/census-5-2026-11-04` at `47e15fee4` — THE POWER LANE, complete (it carries 1b at `5978662`; its conflict on `rulingStructure.js` was resolved as the lane record says).
5. `origin/lane/census-2-2026-11-04` at `9018f1efd`.
6. `origin/lane/census-3-2026-11-04` at `a354498cf`.
7. `origin/lane/reader-validation-on-page-2026-11-04` at `176fc2cfa`.
8. `origin/lane/reader-tonight-wants-2026-11-04` at `efb84c01a`.

After the merges, before anything else: the prose generator's `--check` and the wiring census's `--dry` (the exact commands are in the lane records; `node scripts/wiring-census.mjs --dry` is the census's door), bare `npx eslint` on the files the merges touched, `npm run typecheck:ratchet` and `npm run typecheck:domain:strict` (each reads its own ceiling), and the walker suites the lane records name (`tests/lint/wiringCensusDeclared.walker.test.js`, `tests/lint/proseWiringCensus.walker.test.js`, the census readers). Record every red with its cause: a red a lane declared for the compose (the census interlock, R-T) is yours to cure in unit 2; a red no lane declared is an EXCEPTION — record it, cure it only if its cause is one of the merges' conflicts, else leave it named.

## 3. The late items (unit 2) — each counted, each its own commit

From the chair's rulings of 10:3x and 11:0x (R-A…R-AZ), in this order:

1. **The wiring census re-take through its door (R-T)** for the NPC lane's three `tablePools` rows (+66 bytes, 0 state rows, no stamp): `node scripts/wiring-census.mjs`, then both `--check`s green; the two census-interlock reds close.
2. **R-AW reaches edit mode.** A sub-regeneration that calls `generatePowerStructure` outside the pipeline still prints the carried "Military/Guard" label: run the label close after that regeneration too, against the current record. Red-first: a test that regenerates the power section in edit mode and reads the label. Births byte-identical (prove it: the 60 and the golden hashes, §4).
3. **`declared-share` counts a `colour` mark as declared** (CENSUS-4h's question 1, ruled yes): change the draw ledger's counting; report the share BEFORE and AFTER the change ONCE in your record, so the record is honest.
4. **Guard Captain#1's `crime`** (4h's question 3; R-V): measure `crime` at the goal draw against the final record on the 1,000; equal on every birth → declare it through the delegated getter; else leave it "waiting on order" (R-Q) and say so with the count.
5. **The four DS-FTH lines that speak of "the clergy"** are re-read by R-AD now that `clergy` (= priest ∨ sacredHouse, CENSUS-1h) exists: a line that asserts the place HAS clergy at work declares `clergy`; a line that describes the faith's tradition stays colour. Four lines; counted.
6. **Unit 8's two bare `needs: crisis` declarations** (DS-FTH-1 SINK arc rising v1; DS-DEF-2 Economic Survival STRONG v3): the annex, the prose generator, `--check`, counted.
7. **The power lane's waiting lines** (the council home; the deferral reason's two lines; `docs/CENSUS_5_LANE_2026-11-04.md` names them) go into your record's queue WITH THEIR COUNTS — not built.
8. **The `pairProse` closures' `.lines`** (249 tie-prose marks applied): recorded as wave 2's walker item, not a blocker.

Every item: red-first where it changes behaviour (name the test and its red title at the parent), the count before → after, and byte identity where the ruling says births are untouched.

## 4. The measure (unit 3) — the 60 and the 1,000 as a diff (R-B)

BEFORE is rung 2D's tip (`3bc72bc0c`, the figures in its report) and AFTER is your tip. Run `node scripts/audit/soak-review.mjs --count 1000 --workers 2 --out artifacts/compose-1k` (and the lane's sixty the same way with `--count 60`), redirected to a file. Your bar (R-B): no contradiction class RISES; `cert:*` stays 1,000/1,000 with `cert:false-presumption` 0; the classes the declarations target FALL, reported by claim. `coh:crisis-blind-prose` (2,721 of 10,000 at 2D, all on unit 3's nine phrases) and `A-12:self-vouch-false` (1.7%) are the compose's own to cure: after the merges, measure them on the 1,000; if they do not fall to 0, read the residue BY PHRASE and cure what the written rulings cover (a declaration a pool already owns; a draw site already wired), one commit per phrase class, and re-measure; what no ruling covers goes in your record as a question with its count — do not invent a declaration. Reader kinds (`reader:*`) are kind 9, outside the stop rule; report them by cause.

Also count, at your tip, with a scratch hasher you write under the scratchpad (NOT committed): the generator golden corpus (`tests/helpers/goldenMasterCorpus.js` drives it — read it) hashed at your tip vs at `3bc72bc0c`, and say how many of the 525 rows move and by which unit (bisect by commit if more than one unit moves them). Re-record NOTHING: no golden door, no register refreeze beyond the wiring census's own re-take in §3 item 1 — the chair's landing seat records every cause at the composed tip.

## 5. The hand-back

- Your record: `docs/census/COMPOSE_2026-11-06.md` on your branch — the merge order with each conflict and its resolution; every late item with its count and red-first; the diff table (class · 2D · your tip · Δ · first three seeds); the questions for the chair; the goldens that move by unit.
- Your final message: at most 350 words plus ONE table — outcome first; what the chair must rule; one CONFIRMED-vs-PLAUSIBLE sentence; the branch tip sha and whether it is pushed. Everything else lives in the record file.
