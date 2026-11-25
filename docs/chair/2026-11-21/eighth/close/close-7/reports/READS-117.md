# READS-117 — BUILDER R (reads only; no file under src/, tests/ or scripts/ changed)

Brief: `close-7/briefs/LANDING-117.md`, part BUILDER R. Tree for every item: 97c6bfc7a.
Chair lists read at origin/lane/chair-2026-11-08 601264de0 (`docs/chair/2026-11-24/tenth/landing/117/`).
Runs: one detached worktree `/home/user/wt/reads`, node_modules linked, every run through
`scripts/gate-mutex.sh --run` to a log ending `exit=`; logs and JSON in the session scratchpad (`r117/logs/`).

Stages read (first-parent of 97c6bfc7a; the units): base d447ee31e · A1 bb457f3bf · A2 520ddb6a8 ·
MIRROR e2fd7caa4 · point 116 (the line's tip ddca5c789, merged 27408d4ec; not a CLOSE-7 unit) · GUARD eaf34abde /
0ec96f13d · BATCH: B1(i) f82d9d671, B1(ii) 3388806b4, C1 a7870e9cb, P3source 4fc54fb45, C1 de19885d7 · bd7a4f7b0 ·
b9b5ea268 · 44fefb11a, merged e9b726cdf. The named test files and their helpers/fixtures are byte-equal over the
whole range (`git diff d447ee31e 97c6bfc7a` empty on them), so every move is the tree under them.

## Status

PARTIAL — runs in progress.

## Run 1: the item tree 97c6bfc7a (log `tip-all.log`, exit=1; 9 files, 15 failed | 138 passed)
Reproduces the chair's messages exactly, with the full arrays:
- tailDisplayCivicBatch2: the one failing CURED row is `r2s-occupied-town-3: Merchant Guilds~Craft Guildsstable` (the "stable" chip prints again).
- tailCrisisBatch8: r2s-famine-city-1's famine rows include `Merchant Guilds` (5 rows; Merchant Guild Council first).
- townCartographyCalibration W2: three rows, all desert, all an institutions drop with districts/sceneBuildings unmoved:
  `city|germanic|desert|road|frontier|cg1-seed-06` institutions 83 -> 81 (cartoBuildings 207 -> 203, bytes 397 -> 395);
  `metropolis|celtic|desert|road|safe|cg1-seed-08` 98 -> 95; `village|slavic|desert|road|civilized|cg1-seed-05` 15 -> 14.
- hookThemeDraws: total 2145 (pin 2147).
- dossierProseManifest: tally golden-master-v3 cells 72,614 -> 72,613 (gm-seed-a/b/c and towns unmoved); DRIFT arm 1050 rows moved;
  DM-only positions 214 -> 213.
- heraldKnowledgeDeskGolden: content digest `4600b864…` against the pinned `a4294c06…`.
- statecraftExposureBand: scandals 78 (ceiling 57).
- goalSentencesOnceInTown: every tier reds ONLY on (u)'s roster check under law 1: "the roster is not d3937c3f8's" on
  hamlet-22; village-21, -33, -43, -49; town-12, -20, -38; city-19, -22; metropolis-1, -13, -20, -29, -32, -37 (16 towns).
  (p) and (t) hold on both births.
- goals I-13: Portaminus `npc_parish_churches_10_30`, short goal "Make sure Iulia Volso is not left behind by the changes in
  the work." (full deal) -> "Keep the old lessons between them and Iulia Volso private." (deal with the middle card removed).
