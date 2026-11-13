# CENSUS-2 — hand-back (kept current after every kind)

Seat: CENSUS-2, measure only. Branch `lane/census-2-2026-11-13`. Counted tree: `lane/integration-2026-11-07` at
9e57f5023 (read back from origin at the start, 2026-11-13 ~20:30 UTC). Nothing under src/, tests/, scripts/ or any
register is changed.

## Rulings worked to
- The brief (the chair's message, 2026-11-13).
- The chair, 2026-11-13 20:50Z: reuse the instrument lane's page list (lane/w2-b-declare-2026-11-12) as a lexicon,
  never import or change it in product code; say what each catches that the other does not on the readers' own
  lines. DONE for kinds a, c, e (bdcompare.mjs: its own function run unchanged from a scratch worktree of that lane
  at 9f83ffbb2 on the same 80 pages).
- The chair, 2026-11-13 21:13Z: the Foundry journal escapes brackets (this render covers no journal: stated in the
  limits); fold case and slugs for kinds a and e (done: "_" read as a space on the page, catalogue ids on the roster).

## State
- All eight kinds proved (recall on the readers' 80 towns re-rendered at the tip; precision by reading hits across
  the 720, tightened and re-read; a town-weighted read of the largest writers for kind a), counted at the tip,
  writers traced, holders read, known/NEW joined. Document: docs/chair/2026-11-13/CENSUS-2-2026-11-13.md; hits:
  docs/chair/2026-11-13/CENSUS-2.json.
- Package: `sh docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree> <out> [workers] [--files a,b] [--seeds f]
  [--reuse] [--count-only]`; reads every stage's own exit; fails on an empty count. Measured: births+render 10m21s
  (720, 4 workers, the same render through the first census's script), count+trace+report of eight kinds 107s.
- Open: a from-scratch run of census2.sh on the 720 (launched after this push; its time is added below when read).
- Not done (outside the brief or out of budget): a chain-state denial test (most of the readers' kind-e lines);
  grammar breaks (most of their kind-d lines); 124 label lines of kind f on NPC-card and member rows left untraced.
