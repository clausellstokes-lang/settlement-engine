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

## 2. Rulings received (from the chair; each vetoable by the owner)

- **VR18** (by 00:32, to VEIL-VR17): the shut-grouping list rides the client's page model as data (`$veilGroupings`),
  never saved or sent; a model with NO signal on a non-owner surface reads every family grouping as shut; the map member
  stays fail-closed. Asked of me: any transform that REBUILDS the page after the veil (civility mask, sanitizer, cache,
  snapshot). Answered in REVIEW-VEIL-10.md §1b's closing paragraph.
- **VR20** (00:44): V10-1 HIGH, blocks. THE CLASS: every column a non-owner read returns BESIDE `data`: (A) computed from
  the veiled document under its source path's rule; (B) the chronicle takes its own veil by entry (name search over its
  strings, its event's class, what it points at; an unknown event type withheld); (C) a walker registers every column of
  every function a non-owner may call.
- **VR19** (00:44, to the builders): a value every shared page draws whose stored figure carries a hidden term keeps only
  its diffuse band (the stability word, the safety band); its precise or crime-specific part (the stability label's
  cause, raw figures) is withheld by the server on every non-owner read. AT FINAL a universal value whose absence or
  precision tells is a finding.
- **VR21** (00:53): ORDER AND GAPS: no counter, index, id sequence or count taken before the veil's removal reaches a
  non-owner read (re-derived over what is served, or withheld; references follow). V10-6 joins item B (VEIL-19).
- **VR22** (00:53): V10-3 HIGH, blocks: each tile computed under the row's own veil (the band word alone, never the
  cause; a band only where a visitor cannot recompute its no-hidden-house value from the served document); a tile that
  cannot be sent lawfully is NULL for every marked row; no filter, facet, sort or count reads its raw value; the closed
  answer sends no tile.
- **VR23** (00:53): V10-4 HIGH, blocks: a map member with no `$veil` takes the DEFAULT veil (R4's reasoning); R4's
  sparing of an unmarked LISTED page untouched; the count of maps already public to the deploy document.
- **VR24** (00:53): timing (V10-7) out of the clearance's scope, recorded for the owner as a residual signal.
- V10-5 MED to VEIL-19 with item B (by positive account); V10-2 MED to VEIL-VR17 as its next unit. A new seat
  VEIL-DOORS (`lane/veil-doors-2026-11-20`) builds the class beside `data`.
- (01:08) The `GIT_*` rule means git's REPOSITORY variables only; the check:
  `env | grep -E '^GIT_(DIR|WORK_TREE|INDEX_FILE|COMMON_DIR|OBJECT_DIRECTORY|PREFIX|NAMESPACE)='` prints nothing.
- The push: refused three times by my permission check; the owner's 2026-11-18 grant (origin/lane/join-2026-11-14
  CLAUDE.md lines 18–23) and the human at my session's "I leave all decisions to you" (01:0x) preceded the first push,
  e53798cd1. Later pushes are plain pushes of this branch only.

## 2b. After Phase 1B (executed)

- MASTER'S STORED SHAPE (`RV10_GEN=/home/user/wt/master RV10_TPL=xp212`): tile `stability` A/B 10, A/C 0; `prosperity`
  A/B 34, A/C 0 (V10-3 holds); trace `ts` holes in 24 of 30 towns (V10-6 holds); the switch: Show-all ALSO sends a
  criminal faction's top-level `factions[].members` (people with roles like "Assassin Guildmaster") on REVEAL-OFF gallery
  and link reads in 8 towns where no hand can open that eye (V10-2, stronger on this shape); a new or renamed criminal
  house after Show-all starts hidden 23/23; Hide all state "hidden" 72/72. The gap probe's `factions[].members[].power`
  rows (5) are an artefact (index-aligned lists after a member leaves; `power` is not a counter).

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
