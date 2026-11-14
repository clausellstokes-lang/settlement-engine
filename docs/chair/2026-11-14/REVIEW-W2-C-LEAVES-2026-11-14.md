# REVIEW-W2-C-LEAVES — the third leaves lane, d79ea4c70..da7a567f4 (2026-11-14): HAND-BACK AT THE COUNT

By REVIEW-W2-C-LEAVES for the chair (session_01ACmDYZrFEVXyZEUg1NDxxC).

**Why this is a hand-back.** My count read 418,004 at 10:04 UTC, which is over the 400,000 mark, so I stop here. This file says what is done, with its commits and counts, and WHAT IS LEFT, line by line.

- **The tip read:** da7a567f4.
- **The base:** d79ea4c70. For the page diff it was read with the line's 976db5b19 merged in ("basep").
- **Step 1's list:** `REVIEW-W2-C-LEAVES-LINES-READ.md`, pushed at d7065ff8a before any claim of the lane's was opened.
- **Marks:** EXECUTED means run and read; PLAUSIBLE means read from code.

## Verdict so far: NOT CLEAR (provisional, but it cannot turn CLEAR)
Two HIGH findings of the stage's own (EXECUTED; each was sent to the chair at once) already make the lane NOT CLEAR at da7a567f4. Step 2 can add to them, never remove them.
1. **The Defense tab's new "Semi-organized networks … lacks a single controlling authority. Several gangs may be competing".** It prints, with "Rival crews … are fighting over who runs the streets", in 18 towns where a criminal power governs the town.
   - Example: r2r-metropolis-0, "Underworld: Shadow Senate · Dominant".
   - The writer is `defenseDisplay.js :: deriveCriminalStructure` via `rivalRingsOf`.
2. **The Resources tab's "… worked all the way through: the ground gives it, {House} finishes it, and it leaves as {good}."** It is newly printed by the stage's re-filing (`exploitationForDesk`) and false in 34 of the 41 towns where it is new.
   - Example: r2r-village-5, "Fishmonger finishes it", with no fishmonger and no fish export.

The MEDIUM findings of the stage's own number 7 families, and the carried findings are listed. All of them, with towns and facts, are in the LINES-READ file's ranked list.

## Done beyond step 1 (EXECUTED)
- **Step 3 (part), the field diff over the census's 720, basep against the tip** (`fielddiff.mjs` over the rendered records; out: `probes/REVIEW-W2-C-LEAVES/out/fd720.txt`):
  - **The generator's record does not move:** 0 leaf diffs outside `publicProse`, no new key and no gone key.
  - **`publicProse` (the stored composed sentences) moves in 266 towns:**
    - `defense:criminal.ringNote` 125;
    - `defense:criminal.structure.sentence` 117;
    - `economy:*.exploitation` 105 (four blocks);
    - `economy:economics.exploitation.sentence` 77.
  - **A name in a stored sentence:** 2 of the 319 moved sentences carry an institution name, a bare catalogue name ("Sawmill finishes it", "Fishmonger finishes it"). Across the 720 such fills rise from 55 at basep to 76 at the tip. No NPC or faction name is written in.
  - **No new word in the vocabulary file:** `src/domain/facts/factVocabulary.js` is not in the stage's diff.
- **Step 5 (part), the merge baa4b707d's remerge diff** (every conflicted file read):
  - `goods.schema.js` keeps both rows.
  - `wiring-census.json` takes producerIndexFiles 1349.
  - `phoneChromeFloor.census.test.js` re-counts the routes, with the stage's three moves written into its comment.
  - Measured at the tip through their own doors: `phoneChromeFloor.census`, `proseWiringCensus.walker`, `wiringCensusDeclared.walker`, `proseNumerics`, `writerReach.walker` and `ruinFilterRoster.walker` are GREEN, and `node scripts/census/page-census.mjs` reads "at or under the register" (exit 0).
  - **`tests/lint/presumedThings.walker.test.js` is RED at the tip and GREEN at basep.** The title is "every source literal that names a thing declares it". It flags `src/domain/display/tradeListDisplay.js :: bank :: "international banking services"` and `:: market :: "magical item market"` (the stage's `SERVICE_OUTPUTS`). This is the stage's own unless its statement declares it; that is not yet read.
  - The edge bundles are not yet rebuilt and compared.
- **Step 6 (part), the gates at the tip** (each through `scripts/gate-tail.sh`): typecheck:domain:strict exit 0; typecheck:ratchet exit 0 (167 errors, ceiling 167); eslint on the 68 touched JS/JSX files exit 0.
  - **The stage's own 45 test files at the tip: 1 red file, 1 title.** The file is `tests/domain/display/arcaneNoneLeftOutBesideAMage.test.js`, the title "the reader's town: an Arcane Council governs …".
  - Its anchor fails: the council no longer governs rww-town-calm-1.
  - It is GREEN at 8c5e90ff6, the lane before the line's merge, so the line's merge moved its town. It is not yet checked against the statement.
- **Step 8:**
  - The revert of a2eaf6a6a by bb2002626 is WHOLE (the diff over its five files is empty; byte-identical at the base and the tip).
  - The three-surface claim is read on 1,824 towns: TRUE for the trade lists in their goods; TRUE for the journal's chain state; FALSE for the PDF's chain state (720 towns) and its outputs (1,453 towns).
- **Refs and local config** were snapshotted around every suite and the push.
  - `npm ci` set `core.hookspath=.husky/_`; I unset it back to the snapshot.
  - Nothing else moved but my own branch's refs.

## WHAT IS LEFT, line by line
1. **Step 2, the lane's statement** (`docs/chair/2026-11-13/W2-C-LEAVES-HANDBACK.md` at da7a567f4, only the parts of the seats inside the stage).
   - **Each row the stage claims cured:** read the row's own town and my births, with the lines removed at my run as the measure:
     - tab: 22,048 gone;
     - PDF: 23,175 gone;
     - journal: 2,709 gone.
     These are in `probes/REVIEW-W2-C-LEAVES/out/families-new-lines.tgz`'s source runs. Re-make them with `linediff.mjs`; its "gone" rows are the removed lines.
   - **Each removal:** read thirty and count the true ones. Candidates already seen:
     - the Arcane Support rows removed beside a Mages' district or an Academy (true lines lost);
     - the Naval "Port only" rows;
     - "Produced locally" wool and coal in r2r-thorp-16.
   - The headline counts, by my run.
   - The chair's rulings, copied in the statement: judge the stage against them. I would rule differently on the brickmaker "No one here works the stone" lines, which disagree with the chain card.
   - Whether the two red guards above are declared.
2. **Step 3, the rest: the draft shift record against `tests/fixtures/.golden-freeze-register.json`.** Measure the surfaces it declares moved and sample those it declares unmoved. The publicProse moves above are the measure to set beside it.
3. **Step 4, a plant for each of the stage's 34 new and 13 changed guards** (the list: `git diff --name-status d79ea4c70 da7a567f4 -- tests`).
   - Revert one cure at a time in a scratch tree at the tip and run the guard files. The REVIEW-R3-STAGES `plant.sh` pattern does this.
   - List the cures with no guard. Candidates:
     - the PDF's chain state (no guard; `tradeListsThreeSurfaces` checks lists only);
     - the semi-organized key against a governing power;
     - the full-row exploitation prose.
4. **Step 5, the rest:** rebuild the edge bundles at the tip (`npm run build:edge-shared` in a scratch tree) and compare them byte for byte with the committed `supabase/functions/_shared/*`. Also re-derive the rows of `tests/lint/.prose-numerics-baseline.json`, `presumedThings.widened.register.json`, `scripts/.writer-reach-baseline.json` and `page-census.register.json` that the stage added, through their own doors.
5. **Step 6, the rest:** run the reds the statement names, as its own and as carried, by FILE at the tip and at d79ea4c70.
6. **Step 7, the measuring seat's command:**
   - `git fetch origin lane/census-2-2026-11-13`.
   - `git archive … docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <scratch>/c2` (already extracted at `/tmp/claude-0/rw2c/probes/c2/`).
   - `sh census2.sh <tree> <out> 4 --files <the stage's 21 src files>`, at basep and at the tip. A kind that rises is a finding.
7. **The verdict file:** this file, completed with steps 2 to 7; the message to the chair (CLEAR or NOT CLEAR, the branch's tip read back, the counts by rank).

## How the instruments are re-made (all under `probes/REVIEW-W2-C-LEAVES/`)
- **Trees:** `git worktree add --detach <s>/tip da7a567f4`, with `npm ci` there. Then build basep:
  - `git worktree add --detach <s>/basep d79ea4c70`;
  - in it, `git merge --no-commit --no-ff 976db5b19`;
  - `git checkout --theirs` on the conflicted files (docs, bundles, one test), then `git add -A`;
  - link node_modules from tip.
  Never commit in basep.
- **Renders:** `sh render.sh <tree> <out> seeds-all.txt 2` gives the tab dumps and the records (two workers, about 45 minutes per tree on 4 cores). Then `sh surfaces.sh <tree> <out>/records <surf-out> <seeds>` (canon PDF text and journal; absolute paths), and `node jrlines.mjs <surf-out> <seeds>`.
- **Lines:** `node linediff.mjs <basep dumps> <tip dumps> seeds-all.txt ld.jsonl [.pdf-canon_dossier|.journal]`, then `node families.mjs ld.jsonl <dir>`.
- **Structured lines:** `TREE=<tip> RECS=<records> OUT=leaves.jsonl SEEDS=… node leaves.mjs`.
- **The last read's cures:** `node cures.mjs leaves.jsonl`.
- **Readers:** `readers/PROMPT-TEMPLATE.md`, `readers/SCALE.md`, and each reader's `result.json` and scripts.
- **Field diff:** `node recs2nd.mjs <records> <seeds> x.ndjson.gz` on each tree, then `node fielddiff.mjs base.gz tip.gz out.jsonl`.
