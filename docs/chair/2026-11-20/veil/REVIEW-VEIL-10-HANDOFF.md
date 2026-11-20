# REVIEW-VEIL-10 — HAND-OFF (written 2026-11-20 ~00:50 UTC, after Phase 1B, before the chair's "FINAL")

The review: `REVIEW-VEIL-10.md` beside this file. Probes and outputs: `probes/REVIEW-VEIL-10/`. **No verdict; 212 is NOT
cleared.** The predecessor's hand-off (`docs/chair/2026-11-19/veil/REVIEW-VEIL-9-HANDOFF.md` on
origin/lane/review-veil-9-2026-11-19) stands whole: its section 2 (VR4 to VR17), section 3 (baselines) and section 4
(the instruments and FINAL, steps 1 to 10). This file adds only what Phase 1B changed.

## 1. Findings sent to the chair (all executed at bedd5a392, 212 `dae0ae6c…19e247`)

| Id | Rank | Sent (UTC) | One line |
|---|---|---|---|
| V10-1 | HIGH | 00:31 | the `chronicle` column (gallery read, campaign-map members) names a hidden house; outside 212 |
| V10-3 | HIGH | ~00:4x | the tile columns (`stability`, `prosperity`, …) read raw by `_gallery_public_tile_rows`: list, featured, more-by-creator, the gallery read's top-level columns, the og card |
| V10-4 | HIGH or (d) | ~00:4x | a never-listed campaign-map member is served unveiled (criminal house whole) |
| V10-6 | HIGH | ~00:5x | `simulationTrace[].ts` holes count the withheld houses (Reveal DM) |
| V10-2 | MED | ~00:5x | the switch's Show-all opens `people` (and others) no hand can open |
| V10-5 | MED | ~00:5x | an unstamped criminal house renamed name-only keeps its birth name |
| V10-7 | ruling | ~00:5x | read latency 1.41–1.69x when something is hidden |

## 2. Rulings received

None yet at this writing.

## 3. Instruments (re-made as the predecessor's section 4, plus)

- My probes import nothing by absolute path but the pg module (`/var/tmp/v16/pgmod`) and the worktree in `RV6_SRC`;
  `run.sh <probe> <log>` removes every `GIT_*` variable (this container sets several) and runs vitest with
  `vitest.config.mjs` beside it. The chains: x212, x211, xp212, xp211 (REVIEW-VEIL-6's `native/chain.sh`).
- A probe that stores rows MUST delete each row after reading it (the tile function scans every public row: my first
  tile run grew quadratic, killed at 166 rows).
- `settlements.visibility` must be 'unlisted' when both slugs are set (the check `settlements_visibility_derived`).

## 4. FINAL, added to the predecessor's ten steps

11. Re-run every Phase 1B probe at the FINAL tip (x212 rebuilt from the FINAL tree; `RV6_SRC=/home/user/wt/f`):
    `chronicle.probe.jsx` (V10-1: `galleryChronicleHasHouse` and `mapMemberChronicleHasHouse` must be false),
    `tile.probe.jsx` with `RV10_N=2` (V10-3: `stability` A/B must be 0 where A/C is 0; `prosperity` per the chair's
    ruling), the map-member SQL of section 0 V10-4 (per the ruling), `gaps.probe.jsx` and `trace.probe.jsx` (V10-6: no
    hole), `switch.probe.jsx` (V10-2: `unreachable` and `showVsHand` empty, or as ruled), `v82.probe.jsx` and
    `unstamped.probe.jsx` (V10-5), `dangling.probe.jsx` (NOW MEANINGFUL: VR9 withholds holders whole; every removed
    person's id, name and `npc.<slug>` nowhere), `closed.probe.jsx` (the closed read and the tile columns beside it),
    `timing.probe.jsx` (as ruled). Also the master shape (`RV10_GEN=/home/user/wt/master`, `RV10_TPL=xp212`) for the
    tile, gaps and switch probes, which Phase 1B did not reach.
