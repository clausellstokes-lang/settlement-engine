# TE-CH-7 receipt

Slot `claude/composite-r4` = c3289244d58b7259205d80594856e8e0cc520817.
Worktree laneCH7-tree, own `npm ci` (589 pkgs), `.husky/_` PRESENT (pre-commit RUNS; eslint --fix
re-stages, so every proof below is re-earned at the COMMITTED TIP).

## COMMITS
- `335b25049` — the fix + the 7-title pin + the census re-record
- `373601437` — MF-CH7 minted at LANDED (packet md + manifest + INDEX row), alone

## MEASURED (all CONFIRMED by execution)
- 276 unique catalog institution names.
- criminal bare 10 / anchored 6. FOUR false positives, re-derived: `Resident smith (part-time)`
  (hamlet/Crafts), `Priest (resident)` (village/Religious), `Warden's Lodge` (town/Magic),
  `Dragon resident` (city/Exotic) — the identical four CH-1 anchored elsewhere.
- RENDER: criminal NPC + [Priest (resident), Gambling den] -> `institution.priest_resident`
  BEFORE, `institution.gambling_den` AFTER.
- `den` SURVIVES: `Gambling den` still matches `\bdens?\b`. NOT a dead alternation.
- tavern/gang/black market: anchoring behaviour-IDENTICAL (0 dropped, 0 gained).
- ⚠ Anchoring NOT uniformly safe: `church`(3 Parish churches), `broker`(Pawnbroker),
  `bank`(Banking houses/district) match MID-WORD and are TRUE positives.
- SEVENTH ARCANE SPELLING: conversion moves 18 of 276 (4 lost, 14 gained incl. the divine
  healer). NOT FREE -> its own car. NOT converted. Its own mid-word population is ZERO.
- SIBLINGS: `cohesionWeave.js:289` already cured; `districtProfile.js:113` = CH-4's, untouched;
  `customContent.js:114` UNCLAIMED (Gardens of Sela / Maidens Rest / Warden of the Wood -> criminal).
- CENSUS DELTA +0/+0/+0/+7 titles/+1 suite title; attributed by single-file control (33/33 at slot tuple).
- Packet surface 179 -> 180, `[implementation-packets] valid: 180 packets (0 READY)`.
- 6 mutations red the pins; restore 46/46.

## RESUME POINT
- DONE: fix, pins, mutations, census, packet mint. Tree CLEAN at 373601437.
- IN FLIGHT: gate1 (started before the packet mint, so CONTAMINATED — disregard its verdict).
- NEXT: run ONE clean full gate at the tip, then pin refs/preserve/holding-ch7.
- CMD: cd laneCH7-tree && npm run check:tail ; echo TRUE_EXIT=$?
