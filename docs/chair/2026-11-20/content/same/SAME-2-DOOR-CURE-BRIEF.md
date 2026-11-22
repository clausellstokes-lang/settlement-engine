# SAME-2 · BRIEF D — THE DOOR'S LAW 1, TIED TO THE BAR (then the first reading)

Written by SAME-2 (the seventh chair's sameness seat) for its builder, 2026-11-20. This file, `SAME-1-DOOR-BRIEF.md`
beside it (the door's design) and `door/REPORT.txt` on the door branch are your whole assignment.

## WHERE YOU WORK
A worktree at `/home/user/same2-door` on a new branch `lane/same-2-door-2026-11-20`, cut from
`origin/lane/same-1-door-2026-11-20` at 795953904 (the door, built by SAME-1's builder, NOT merged). Symlink
`node_modules` to `/home/user/settlement-engine/node_modules`; keep the symlink out of git. Commit by explicit paths,
author `Claude <noreply@anthropic.com>`. NEVER push, never `--no-verify`, never touch another branch. The base the
renders stand on: the join line 43ab0f5eb plus SAME-1's census and door commits (no `src/` change): say so in the report.

You OWN `scripts/sameness-census.mjs`, `scripts/census/sameness-census.render.census.jsx`,
`scripts/census/sameness-census.classes.json`, `scripts/census/sameness-census.register.json`,
`tests/lint/samenessCensus.walker.test.js`, and new files under `docs/chair/2026-11-20/content/same/door/`.
Read `scripts/sameness-census.mjs` and the walker WHOLE before you change them. Nothing under `src/` changes.

## PART 1 — THE CHAIR'S RULING (18:52 UTC), BUILT
The door's law 1 false-reds on a fresh sample (hxw: 83 unregistered slots at 5 to 10 places, 0 rises). THE RULING,
verbatim: "LAW 1 IS TIED TO THE BAR, BY SIZE, WITH NO SECOND SAMPLE: an unregistered slot REDS only where ONE
SENTENCE of it prints at 15 or more of the 150 places of some size (two thirds of the bar); an unregistered slot whose
top sentence prints at 8 to 14 of 150 at some size is LISTED as "watch" in the check's output, not red; below that it
is neither. MIN_PLACES 5 and NOISE_SE 4 stay for the registered rows' law of rises."

Build it so:
1. `judge`: an unregistered slot-size is RED when its COMMONEST SENTENCE prints in at least `ceil(n × 0.10)` places
   of that size (15 at n = 150), WATCH when in at least `ceil(n × 8 / 150)` (8 at 150), else neither (counted in one
   NOTE line). It is the top sentence's places, NOT the slot's places: a slot printed in every place with every
   sentence distinct is neither. No confirmation corpus is read for law 1. Name the two figures as exported
   constants with a `_MEASURE`-style string citing the ruling (two thirds of the 15% bar; 8 of 150 the watch line).
2. `--check` prints each watch row (size, slot, top places / n, the masked top sentence cut to 100 characters) and
   counts them in its summary line. The exit code is unchanged in meaning: 1 on any red.
3. `--write` keeps registering every slot at `MIN_PLACES` or more (more rows are harmless); `--tighten` unchanged.
4. The header, `REGISTER_LAW` and the register's `_law` say the new law 1 in plain words. (A changed `_law` string is
   the only register change; no ceiling moves.)
5. THE WALKER (red first): add planted tests: an unregistered slot whose top sentence prints at 15 of 150 REDS; at 14
   of 150 it is WATCH, not red; at 7 of 150 neither; a slot printed in 150 of 150 places with 150 distinct sentences
   is neither. RUN THEM AGAINST THE OLD `judge` FIRST and record the failing titles (the red), then build, then green.
   Keep every existing test green. If the manifest row's text must change, change ONLY that row and say why.

RECEIPTS (each to a file; read the count lines only; `sh scripts/gate-tail.sh <cmd>` for every gate):
- `npx vitest run tests/lint/samenessCensus.walker.test.js tests/lint/mutationCoverageManifest.test.js` (red then green);
  bare `npx eslint` on every changed file.
- `node scripts/sameness-census.mjs --check --out=<scratch>/hxd` at your tip: 0 red; its summary line; the watch rows.
- The fresh-sample probe: `--check --seed-prefix=hxw` (render 150 a size): 0 red; its watch count. Keep both run
  directories: PART 2 reads the hxd one.
Run the two renders one after the other, never at once (four cores). Commit PART 1 as ONE commit with the receipts in
its message. Then STOP and return (≤ 200 words: the commit, the red titles, the two summary lines, the watch counts,
anything that surprised you). SAME-2 reads your diff and merges; PART 2 comes to you by message.

## PART 2 — THE FIRST READING (measure only; on SAME-2's message)
From the hxd run of PART 1 (no new render), new files under `docs/chair/2026-11-20/content/same/door/`:
- `RANKED.md`: every printed slot whose commonest sentence prints in more than 15% of ALL places of some size, RANKED
  BY WEIGHT (the places printing that sentence, summed over the six sizes). Columns: rank; weight; per size `k/150
  (shareAll) · shareIn`; class; surface | position; the stored path(s) it is attributed to BY CONTAINMENT (or
  COMPOSED with its module); the masked top sentence (≤ 140 chars); the LANE that covers it (below). Mark a size over
  20% (beyond sampling) in bold.
- `FULL.tsv`: every printed slot × size: places, distinct, top places, shareAll, shareIn, SEEN (for the slots whose
  meet is SEEN: the share a second place repeats), class, attribution.
- THE LANES (mark by the attribution path or composing module; cite the match; anything matching none is "COVERED BY
  NOTHING YET"; a match you are unsure of is marked `?` with why, never guessed):
  PEOPLE — `factions[].desc` (a power's description), `factionRelationships[].narrative`, `npcs[].structuralPosition`,
  `npcs[].activeConstraint`, `settlementReason`, `history.founding.*`; PLACE — `safetyDesc`, `entrepotNote` and the
  trade note, `economicDragDesc`, the economy's and safety's plot hooks (`economicState.safetyProfile.plotHooks`,
  the economy's hooks); DEPTH — `powerStructure.recentConflict` / `pressureSentence`, a person's ties and hooks; TROUBLE
  (PAGE-7) — a trouble's sentence (`tensionCause`), a trouble's `plotHooks`; GOALS — a person's wants/goals; PAGE-6 —
  the arrival paragraph, a person's secret; PROSE — `publicProse.blocks.*` (the page's state sentences); FRAME — the
  stakes' reason `stress.cast.stakes[].reason` and the session sheet; DAILY — daily life; TRAD — traditions.
- THE `?` CLASSES (354 rows): resolve each by the rule in `sameness-census.classes.json`'s header, from the code that
  composes the slot (cite `path :: symbol`), into the classes file. Resolve the RANKED rows' first. A row you cannot
  resolve from code is NAMED in `door/UNRESOLVED.md` with why. NEVER a guess. If the count runs long, stop at the
  ranked rows and name the rest.
One commit, docs and the classes file only; return ≤ 200 words: the commit, the count of ranked rows, how many are
COVERED BY NOTHING YET, the `?` resolved and named.

## RULES
Never the whole suite; never the repository's lighting or wiring census. Never a pipe for a gate's exit. Every run to a
file, read by its count lines. No test run with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR,
GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment. A sentence you think wrong is a line in your report, never an
edit. `package.json` and `package-lock.json` are not touched.
