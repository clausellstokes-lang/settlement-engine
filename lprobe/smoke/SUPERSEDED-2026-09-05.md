# ⛔ THE OVERLAY-SEAM ARTIFACTS IN THIS DIRECTORY ARE SUPERSEDED (L-OVERLAY, 2026-09-05)

`overlay.log`, `overlays/overlay-leak-report.json` and the `--rules-json` lines in
`dryrun.log` were produced by `preset-overlay.mjs` against the seam that existed BEFORE
DOCKET item 7 (§899, car `2200db6f3`) gave `whole-world-soak.mjs` a real `--preset <id>`.

They read **"7 preset(s), 6 with leaks"**. That was TRUE of the `--rules-json` overlay seam
and is NOT a statement about the tree today: `--preset` REPLACES the composition base, and
measurement at `38474a59e` shows a `--preset P` soak composes the REAL BIRTH of P for all
seven presets — JSON-byte-identical, key order included.

**A stale receipt is a claim that has decayed while still wearing a receipt's clothes.** Read
these files as HISTORY of the old seam, never as a finding about the current one. The live
instrument is `../preset-seam.mjs`; the live figures are in
`$SC/laneOVERLAY-scratch/cert899/seam/preset-seam-report.json` and `$SC/receipt-l-overlay.md`.
