# ECO11-V6: DS-ECO-11 "worked out, recovers in time" v6 re-read (PROSE-5's builder brief; the chair's ruling E60, 2026-11-22 08:38 UTC)

Read `CLAUDE.md` first. Then read this brief, `lines/PROSE-5-ECO11-V6-DRAFT.md` beside it, and the files named below, AND NO WIDER. A doubt is a STOP and a question to PROSE-5, never an invention.

## WHERE YOU WORK
- Your own git worktree on a NEW branch `lane/prose-5-2026-11-22-eco11v6`, cut from the commit PROSE-5 names in your prompt. Run `npm ci` in the worktree first; it installs the hooks.
- Then `git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD`, or `ledgerCitationIntegrity` reads falsely red.
- Never run a test with git's REPOSITORY variables (`GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` …) in the environment.
- Commit by explicit paths, with the hooks. Never `--no-verify`. Never push. Never a pull request. Never the whole suite.
- Heavy runs go one at a time: `sh scripts/gate-mutex.sh --run -- <command>`, to a file. Never read a gate through a pipe: use `sh scripts/gate-tail.sh <command>` and read its count lines.
- A refusal by your own permission check stands: report it and try nothing else to the same end.

## THE CHANGE (word for word)
- Pool: `DS-ECO-11 :: RESOURCE CONDITION: worked out, recovers in time`, vid 6. Its marks `[threshold · colour]` and its vid are kept.
- OLD: "Nothing more can be taken from the {resource} at {settlement} for the present, but not for good; given time, there will be something to take again."
- NEW: "Nothing more can be taken from the {resource} at {settlement} until what was taken has had time to come back."
- Route it the way 9ae014014 routed the old one (read that commit's diff whole). The existing row `POINT89-CHAIR-2026-11-22-V6` of `scripts/generate-dossier-state-prose.mjs :: WORD_CORRECTIONS` keeps its `from` and gets the NEW text's sha256 as `to`. Its ruling becomes `E60-CHAIR-2026-11-22` and its comment says why.
- If `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` holds v6's text, it follows as 9ae014014 did it.
- Then `npm run gen:dossier-prose`, then `npm run gen:dossier-prose -- --check`, which must exit 0.
- Nothing else in `src/` changes.

## THE CENSUS, ITS OWN COMMIT (red first)
- `tests/lint/proseWiringCensus.walker.test.js`: the THIN literal 613 goes to 612 and COVERED 248 to 249.
- The comment the chair wrote there at cc2f43aee (look for 612 -> 613 / 249 -> 248 and its cause) NAMES THE WRONG VARIANT. CORRECT IT with the measured cause: the pool lost its second grammar at 9513ba024, when the old v4 "The {resource} at {settlement} is worked out and coming back on its own, at the ground's own pace." (`OBJECT`) was reworded to a `V4` line. v6 (the old one and point 94's) read `V4` throughout. The new v6 reads `OBJECT` and gives the pool two grammars again.
- RED FIRST: on your base with the literals changed and before the wording change, the walker reds at 612/249. Quote its line. GREEN after the wording change.
- If the literals do not move exactly so, STOP and report what moved.

## RE-READ BY CAUSE, NEVER RE-POINTED BLIND
- `tests/lint/proseEntryContradiction.walker.test.js`, the QUALIFY arm's trailing-coordinate count: it is expected to go back 392 to 391, because v6 leaves the class it joined at point 94. Measure it. Re-key it with that cause in its comment, in the form the chair used for 392 (E39).
- `tests/domain/corpusEcoTailGuards.test.js` and the economy desk (`tests/domain/economyStateProseDesk.test.js`): every row naming DS-ECO-11's worked-out pool or v6's old text. A row that reds because it quotes the old text is re-pointed to the new text with the cause; a guard that loses its teeth is a STOP. The draw is keyed by vid, so no town's draw should move: prove it (v6 drawn in the same census towns before and after; the count).
- Every other test file under `tests/` that quotes the old v6 text (search `for the present, but not for good`). List them.

## PROOFS (each to a file, its count line quoted in the report)
- `npm run gen:dossier-prose -- --check`: exit 0.
- The two-tree confinement: `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <base> <tip> <scratch>` (read its README first). It must show 0 NON-STRING differences, and the string differences named by path and count.
- `tests/lint` WHOLE, after your last test change (COMMON-EIGHTH 11). Give the count and every red by name. The line's known reds are the three owner's size signings (`proseCorpusBytes` RAW and GZIP, `proseComposed` A0b): name them and do not cure them.
- The governing files: every file you changed or re-pointed, plus `tests/domain/corpusEcoTailGuards.test.js`, `tests/domain/economyStateProseDesk.test.js`, `tests/generators/selfVouchReceipt.test.js`.
- eslint on the touched files.
- THE FILLS (the chair's question): from the census towns or the map's births, print one real filled v6 sentence per distinct `{resource}` fill that the pool draws (name the seed). Confirm each fill is a thing that comes back: `src/domain/resourceSemantics.js :: RESOURCE_SEMANTICS` gives `natural` only to the 15 renewables. A fill outside them is a STOP.

## REPORT
- Write `docs/chair/2026-11-20/content/prose/ECO11-V6-REPORT.md` and commit it.
- It gives: the commits; red and green by test title; every count line and exit; confinement; the re-keyed counts with their causes; the fills table.
- Mark EXECUTED vs INFERRED on every claim.
- Final message: at most 200 words.
