# CENSUS-2 — hand-back (kept current after every kind)

Seat: CENSUS-2, measure only. Branch `lane/census-2-2026-11-13`. Counted tree: `lane/integration-2026-11-07` at
9e57f5023 (read back from origin at the start, 2026-11-13 ~20:30 UTC). Nothing under src/, tests/, scripts/ or any
register is changed.

## Rulings worked to
- The brief (the chair's message, 2026-11-13).
- The chair, 2026-11-13 20:50Z: read the instrument lane's page list (lane/w2-b-declare-2026-11-12,
  src/domain/facts/registeredWords.js and src/domain/coherence/vocabularyPageFindings.js), reuse it as a lexicon,
  never import or change it in product code; in the document say what each catches that the other does not on the
  readers' own lines. DONE for kinds a and c (bdcompare.mjs, EXECUTED: its function run unchanged from a scratch
  worktree of that lane on the same 80 pages); kind e to follow.

## State
- Kinds a, b, c: proved (recall on the readers' 80 towns re-rendered at the tip; precision by reading 30 hits a kind
  across the 720, tightened and re-read; a town-weighted read of the twenty largest writers), counted at the tip,
  writers traced, holders read, known/NEW joined. Document: docs/chair/2026-11-13/CENSUS-2-2026-11-13.md; hits:
  docs/chair/2026-11-13/CENSUS-2.json.
- Package: `sh docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree> <out> [workers] [--files a,b] [--seeds f]
  [--reuse] [--count-only]`; reads every stage's own exit; fails on an empty count. Measured: births+render 10m21s
  (720, 4 workers), count+trace+report ~60s.
- Next: kinds d to h, then the finished package and document.
