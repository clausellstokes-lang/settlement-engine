# VOICES-CARDS STATE (measuring seat; branch lane/voices-cards-measure-2026-11-28; product tree lane/stack-122-wip-2026-11-28 @ 777733a2a)
- 04:05 UTC 2026-11-28 (date -u).
- BUILT (scratch /home/user/scratch-cards, outside the repo): render harness `tools/cards.jsx` (fiber census of mounted cards,
  owner + share), `extract.mjs` (cards from the record by the tree's readers), `analyze.mjs` (weights, simulation, speakers,
  states), `make-a.mjs`, `make-cde.mjs`, `fill-a.sh`, `fill-cde.sh` (regenerate the tables in A, C, D, E).
- PROVEN on C (900/900 rendered, 0 errors; census = record on 900/900 for the six kinds): A, B, C, D, E, F written and pushed.
- RUNNING: corpus V render (run.sh resumes from V.jsonl; ~257/900 at 04:05; the background chain stops near 04:40: restart
  `sh run.sh tools/plan-V.json V.jsonl 900 75` in scratch if so).
- NEXT: when V = 900: `node extract.mjs V.jsonl V.x.jsonl`; `node analyze.mjs V.x.jsonl > V.analysis.json` (analyze reads the
  corpus name from argv order: pass `C.x.jsonl V.x.jsonl` and split), then fill-a.sh + fill-cde.sh, push; then REPORT.md and the
  chair's message.
