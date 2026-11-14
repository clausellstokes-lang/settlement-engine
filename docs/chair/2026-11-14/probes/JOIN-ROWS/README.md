# JOIN-ROWS probes (JOIN-ROWS-1, 2026-11-14)

Scripts that made docs/chair/2026-11-14/JOIN-ROWS.md and JOIN-ROWS.json. Run from the repository root with the nine lanes, the readers' branches, lane/integration-2026-11-07, lane/join-2026-11-14 and lane/chair-2026-11-08 fetched (full history). Nothing here writes into a repository tree except where an output path is given; pass paths outside every tree.

1. `extract.py <dir of hand-back copies> <out dir>`: every section whose heading names FOR THE JOIN, NAMED, NOT MINE, NOT THIS LANE, LEFT, DECLARATION PASS or CARRIED, each to its own file (the copies were made by `git show origin/lane/<lane>:<path>` for each hand-back or statement file the lane's own diff since its merge base touches under docs/chair).
2. `r_*.py`: the rows, transcribed by the seat from those sections (each with its source's path and heading); `r_bar.py` reads `bar/*.json` (copies of the chair's BAR-0-ROWS-no-lane.json and -untraced.json).
3. `build.py <out rows.merged.json>`: one list, rows named by two sources merged (`merge`).
4. `writers.py`: each row's writer on the joined tree (file, fixed needle); `grep_writers.py` the first, wider grep.
5. `hold.py <rows.merged.json> <out hold.json>`: the enclosing unit and the lanes whose own hunks touch it (BY FUNCTION).
6. `post.py <hold.json> <out post.json>`: the lanes' commits after the join took them, on each writer.
7. `sent.py`: the rows' keys grepped in the nine running briefs and in CHAIR-HANDOFF-FIFTH section 7 from 09:00 (its inputs: `briefs/*.md` and `handoff5-sec7-0900.md` beside its parent directory, made by `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-14/...`).
8. `states.py`: each row's state as the seat settled it from 5-7 (commits verified to exist by table.py).
9. `table.py <dir with rows.merged.json and hold.json> <out .md> <out .json>`: the table, the counts.
