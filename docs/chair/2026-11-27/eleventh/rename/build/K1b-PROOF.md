# K1b PROOF: AN IMPORTED COPY FOUNDS THE OWNER's TRADITIONS

RENAME-BUILD, 2026-11-28.

**The commits**
- 8bfe1a5f9 + 7b376724f: the red test.
- beaa3c707: the cure.
- f383108a9: the re-keys (`K1b-REKEYS.md`).

**The scope.** At 0.10.0 (`bornAtOrAfter(record, '0.10.0')`), the founding draw (`traditions/genesis.js :: deriveFoundingTraditions`) keys on the town's id through `pickKeyOf`. The founding draw is the Traditions tab's preview, the world tick's mint at a town's first lit tick, and `traditionsOf`. A 0.9.0 or a stampless record draws on the old chain.

Every count is a script's (CONFIRMED).

## The proofs

| proof | C | V |
|---|---|---|
| births (every size), K1 tree against the K1b tree (`tools/tradset.jsx`, `tools/analyze-tradset.mjs`) | 900 | 900 |
| born at 0.10.0 | 900 of 900 | 900 of 900 |
| a born record holding a stored tradition ledger (so a birth that K1b could move) | **0** | **0** |
| re-stamped 0.9.0: drawn set, shown set and shared rows differ between the trees | **0 of 900** | **0 of 900** |
| stampless: the same | **0 of 900** | **0 of 900** |
| the JSON-imported copy (`_seed` dropped) founds, shows and shares the owner's set: on K1 | 0 of 900 | 0 of 900 |
| the same: on K1b | **900 of 900** | **900 of 900** |
| the born founding set re-dealt (once, at this point) | 900 of 900 | 900 of 900 |
| RECORDS MOVE (sha1 of the born record, the first 150 of each corpus, every view walked: `tools/analyze-e2-k1b.mjs`) | **0 of 150** | **0 of 150** |
| pages moved | 150 of 150, 1,823 lines | 150 of 150, 1,861 lines |
| lines moved outside World/Traditions (the tabs, the PDF, Foundry, Tonight) | **0** | **0** |
| the shared stamp (`publicProse`) re-composed | 150 of 150 | 150 of 150 |
| ten towns of C, the owner's page against the copy's after the JSON import (R2), every tab (`tools/roads-render.jsx`; `results/BR-k1b.txt`) | K1: 10 of 10 pages moved, 217 lines, all World/Traditions. **K1b: 0 of 10, 0 lines** | |
| the same after the gallery import (R4) | K1: 3,458 lines (the public projection's own losses plus 217 on World/Traditions). **K1b: 3,241, World/Traditions 0**; every other view's count identical to K1's | |

## A lit world

- A ledger minted before K1b is stored (`worldState` traditions). A tick carries it, and it is shown identically on K1 and on K1b: 5 of 5 towns, measured before the build and sent.
- K1b re-derives no stored set. The first lit tick of a town not yet lit mints the id-keyed set.
- **The WF-0 world** (the chair's ruling K1b-2; `results/wf0-lit-world.json`), with its patron host soak-a:
  - It is lit on the K1 tree: a live year through the product's advance entry. soak-a's ledger is minted at the first lit tick: 5 rites, 4 drawing pilgrims.
  - It is then advanced a further year on the K1b tree (ticks 52 -> 104). It keeps soak-a's minted set identical: 5 of 5 rites, id, name, motif and band, and 4 still drawing pilgrims.
  - A fresh K1b derivation of soak-a would hold none.
  - So no saved lit world loses its pilgrimage.

## Named, not changed

- **A share stamped before K1b** keeps its old traditions rows until the next save, because `PUBLIC_PROSE_VERSION` is not bumped (the chair's ruling K1-1 (iv)). The stamp is re-composed on 150 of 150 (above). This is named for the share lane.
- **faithObservationFloorWf0:** red 2 of 15 under K1b, and green with K1b reverted. Its corpus is the soak's own seed. It awaits the chair's word (`K1b-REKEYS.md`).
- **Goldens:** none is re-recorded.
  - The goldens and pins that read the founding draw are green on BOTH trees, so K1b moves none of them (CONFIRMED): `tests/property/traditionsDormancyGolden` (the golden-pinned founding leaf), `traditionsTabCustomMerge`, `facts/water` and `customFoundingTraditions`.
  - The record goldens cannot move, since 0 births moved (above).
  - `dossier-prose-manifest-golden`, red on the base (`K1-PROOF.md`), would also take K1b's World/Traditions cells (PLAUSIBLE). It is named, as at K1.
