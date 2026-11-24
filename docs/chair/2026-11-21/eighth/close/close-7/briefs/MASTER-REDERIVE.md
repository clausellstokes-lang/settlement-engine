READS WHOLE: `close-7/briefs/CURES-COMMON.md` (its laws bind you), `close-7/briefs/R24f.md` ((3) is this brief's ruling, IN ITS
OWN WORDS; it governs where this file differs), then `src/domain/edit/dmLayer.js` and `src/store/settlementRederiveAction.js` whole
as they stand at the line's tip, and your own `close-7/b1i/rederive-saved.census.jsx` (the harness you already proved). WINDOW: 1,000,000.

# MASTER-REDERIVE — WHAT THE LINE ALREADY DOES TO A SAVED PLACE (CLOSE-7; R24f (3)). READ ONLY: A MEASURE.

TREES (made by you, removed by you at the end, both DETACHED, node_modules and .husky/_ symlinked as before):
- `/home/user/wt/master` at origin/master db832c892 (`git fetch origin master` first; check `git rev-parse origin/master` names
  db832c892, and if it names another commit say so and use db832c892).
- `/home/user/wt/line` at the line's tip f9531eb3a.
No file under src/, tests/ or scripts/ changes in any tree; no commit in either tree.

THE RUN: 30 places a size (thorp, hamlet, village, town, city, metropolis = 180), born by MASTER's engine from the census seeds
(the C corpus's own configs and seeds, `dp-<size>-<i>` for i = 0..29, as `read24/dslots.mjs` / the census plan names them; say
which plan file you used). SAVE each IN MASTER's SHAPE: what master's own save path writes (find it; say file :: symbol), as JSON.
Then on the LINE's tip, load each saved record by the line's own load path (whatever migration of a saved place the line runs on
load: say it) and RE-DERIVE it with an EMPTY layer, exactly as an edit would (`dmLayer.rederive` as `settlementRederiveAction`
calls it). Compare what each place HOLDS before (master's saved record) and after (the line's re-derived record):
  houses (institutions: lost / gained by name), people (NPCs: count lost / gained, and named roles), powers (factions / power
  structure: lost / gained), the government's name, events (the place's events / history: lost / gained).
Say how you key each (by name? by id?) and that the key is stable across master and the line, or the count is wrong.

OUTPUT, `close-7/reports/MASTER-REDERIVE.md` plus its data under `close-7/master-rederive/`:
- by size: places that move AT ALL (n / 30), and for each of houses, people, powers, government name, events: places moved and the
  mean / max moved per place;
- three examples, each with its seed and exactly what it lost and gained;
- whether a record would move with NO code difference (control: re-derive master's saved place on MASTER itself, 30 a size; if
  that moves, the measure must say by how much, since then a re-derive is not a no-op even without a cure).
Label every number CONFIRMED (run) or PLAUSIBLE (read). Then ONE MESSAGE to CLOSE-7: the by-size table in one line a size, the
control's count, the three examples in a line each. Then remove both trees (`git worktree remove`), and stop.
