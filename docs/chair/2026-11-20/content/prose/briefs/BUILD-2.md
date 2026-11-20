# BUILD-2 — PROSE-LINES-3 and -4 into the corpus, by its own door, with the chair's verdict of 17:46 UTC (PROSE-2's builder brief)

Written by PROSE-2, 2026-11-20. You build in YOUR OWN worktree on a branch of your own cut from `lane/prose-2-2026-11-20` at the commit PROSE-2 names in your prompt (BUILD-1's lines are already in it); you commit there by explicit paths; you never push (PROSE-2 pushes your branch and merges it). In a fresh worktree run `npm ci` first (it installs the dependencies AND the git hooks; a commit without hooks is a gap you report).

## INPUT
- `docs/chair/2026-11-20/content/prose/lines/PROSE-LINES-3.md` (27 pools, 82 lines) and `PROSE-LINES-4.md` (27 pools, 41 lines), at the commits named in your prompt.
- The chair's verdict, verbatim: `docs/chair/2026-11-20/content/prose/verdicts/CHAIR-VERDICT-LINES-3-4.md`. It governs where it differs from a line file.
- `briefs/BUILD-1.md`: its sections THE BUILD (steps 1 to 5), RED FIRST and REPORT bind you, with the changes below.
Take each approved line EXACTLY in its source form `N. \`[angle · marks]\` text`, dropping only the italic notes `*(PROSE-1: …)*` and the files' commentary. A line marked "NOT for use" is never built.

## THE VERDICT, APPLIED BEFORE STEP 1 (each change listed in your report: pool, line, before, after)
1. THE NOUN: no new line says "the town", "a town" or "another town" (nor "town's"). Change each to "the place", "it", "its" or `{settlement}` (whichever reads as English in that sentence and does not repeat `{settlement}` twice in one line); "another town" becomes "elsewhere". Search the two files' NEW lines for `town` case-insensitively: report the count before (N) and after (0). Existing corpus rows are never touched.
2. File 3's rewordings and guards, word for word as the verdict gives them. Where the verdict quotes only the tail ("...no power at {settlement} is gathering to take its place."), keep the line's own opening up to the replaced words and print the WHOLE resulting line in the report. Marks the verdict adds (`no ruler: lord` on pool 1 lines 7 to 10; `no crisis: occupied` on pool 21 lines 14 to 17) are written in the source document's own mark syntax: copy it from an existing row that carries that mark, and name the row you copied it from.
3. File 3's 10.6: it stands ONLY if the walls group's absence means no palisade and no earthwork either. Find the code that decides the walls group's absence (the state that selects pool DS-DEF-5 walls ABSENT) and QUOTE its line with `path :: symbol`. If it does not exclude a palisade and an earthwork, DROP 10.6. Either way, say which and why.
4. File 4's rewordings (11.4, 20.9, 26.6), word for word.
5. `{timeband_age}` (file 3's 12.3, file 4's 3.3 and 3.4): count, on the 300 places of the map (`hxd-<size>-0..49`), how many places each line is ELIGIBLE at (from the draws' recorded eligible sets, after a trial build). A line eligible at 0 places is NOT built: remove it before your commit (it is a new row, never landed, so the rows after it in that pool are renumbered on; no existing row moves). Report the three counts.
6. dm-only marks stay as the files carry them (the chair: right). File 4's 15.11 stays public.

## THE MEASURE (replaces BUILD-1's step 4)
`map/run-map.sh` hard-codes `ROOT=/home/user/settlement-engine`: in your worktree it would measure the WRONG tree. Copy `run-map.sh` to a scratch folder with ROOT set to YOUR worktree (never edit the committed one) and run it in `draws` mode with prefix `hxd` and **150 places a size** (`<n>` = 150, six sizes), at the base (RED FIRST) and at your tip. Then `rank-reach.mjs` on each `draws` jsonl into `map/RANK-REACH-BUILD2-BEFORE.md` and `-AFTER.md` (commit both). THE BAR: a sentence's share over ALL places of a size, about 15% (to 20% passes as sampling). Report: pools over the bar before and after; the head of the after list; every pool of files 1 to 4 that did not come under and why (a mark the places lack, a slot unfilled).

## THE CONFINEMENT (BUILD-1 step 5): the two trees `43ab0f5eb` and your tip, 0 NON-STRING differences.

## REPORT
`docs/chair/2026-11-20/content/prose/BUILD-2-REPORT.md` as BUILD-1's REPORT, plus the verdict's change list (above). Final message at most 200 words: the commits, the gates' count lines and exits, pools over the bar before and after, the confinement count, executed vs inferred.
