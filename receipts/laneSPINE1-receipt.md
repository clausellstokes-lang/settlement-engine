# lane SPINE-1 — THE PARTITION · §3a–3d CONSTRUCTION · THE PAGE VIEW SKELETON — RECEIPT

**Seat:** SPINE-1 (Opus implementer). **Chair:** Fable.
**Charter:** `docs/DESIGN_SPINE.md` body + **Amendment A1** (A1 wins every conflict), ODQ §669–§670,
`receipts/laneGROWA-receipt.md`, the five-lens panel `wf_fd286ccd-722/journal.jsonl`.
**Clean room (§668):** no GPL source read or fetched by this lane. Design docs + this repo only.

## §1 · SETUP PROOF (executed)

```
git worktree add "$SP/laneSPINE1-tree" 9de7290218d01d0777262787b013c397414834cf   → EXIT 0
mkdir -p node_modules && cp -R <repo>/node_modules/seedrandom node_modules/       → 3.0.5
node v24.12.0
BASELINE  node harness/exemplars.mjs "$SP/spine1/base"        → 18 SVG + manifest = 29 artifacts, 14.95 s
```

### ⭐⭐ J-SPINE1-0 · THE LANE BASE MOVED ONE COMMIT, DECLARED BEFORE ANY EDIT

The charter names the seal `9de729021` as base **and** names GROW-A's two S0 ledger modules as
consumed inputs. Those modules exist only on GROW-A's WIP tip `51684eb9e5`, whose **parent is the
seal**. Rather than duplicate-spell a 998-line ledger, the lane's detached HEAD was reset to that
tip (no ref moved; `refs/preserve/map-sandbox-bridge-rivers` re-read at `9de7290218d0…` after).

```
git -C <lane tree> reset --hard 51684eb9e5fee931667ac92b26ec84c4a7c7dfd7   (detached)
node harness/exemplars.mjs "$SP/spine1/base-growa"
diff -r "$SP/spine1/base" "$SP/spine1/base-growa"   → IDENTICAL 29/29
```

**The base did not move the drawing.** GROW-A's tip is byte-identical to the seal on all 29
artifacts, so every dormancy and determinism proof below is against the same picture the seal draws.

## §2 · STATUS

IN FLIGHT.
