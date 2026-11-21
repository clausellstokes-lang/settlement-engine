# KEY-PROBE: the keys law 2 writes at birth that law 1 does not (builder BKP, SEAT-10)

Measured 2026-11-21 at HEAD `f82c2a183`, worktree `src/` clean. Measure only. No git write was made. Nothing was written outside this folder and the scratch directory.

## THE ONE-LINE ANSWER

**None.** Law 2 writes no key path at birth that law 1 does not. That holds in 166 pairs with the dial dark (arm A) and in 166 pairs with the contest lit (arm B), so no reader can read such a path unseen. CONFIRMED (run).

The one key a law-2 world carries and a corpus birth lacks is the law marker itself, `_seatLawVersion on config` and `on _config`. It lies outside the pairing, which sets the marker on both sides; see §5. CONFIRMED (run).

## 1. Totals (CONFIRMED, run)

| arm | dial | pairs | errors | law-1 union paths | law-2 union paths | law-2-only paths | law-1-only paths | peak heap | wall |
|---|---|---|---|---|---|---|---|---|---|
| A | `SEAT_CONTEST_LIT = false` (as committed) | 166 | 0 | 1028 | 1028 | **0** | **0** | 244 MB | 42 s |
| B | `SEAT_CONTEST_LIT = true` (scratch copy) | 166 | 0 | 1028 | 1028 | **0** | **0** | 224 MB | 41 s |
| B, no fold (cross-check) | lit | 166 | 0 | 1068 | 1068 | **0** | **0** | 241 MB | 43 s |

- **Births.** Each arm makes 166 pairs: the corpus's own 16 (`CONFIGS × SEEDS`) plus 150 more (`{settType, culture:'germanic'}` for thorp, hamlet, village, town, city and metropolis × `kp-<size>-0..24`). Each pair is born once with `_seatLawVersion: 1` and once with `_seatLawVersion: 2`, through `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`.
- **Streaming.** Each run was one node process with `--max-old-space-size=4096`, run through `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run`, with output to a file. Each pair's two path sets were diffed and then dropped. All three runs exited 0.
- **Law 2 is not inert.** In all 10 hashed pairs per arm, the law-1 birth differs from the law-2 birth (JSON sha256). The law changes values, not keys.
- **Arm B, law-1 side.** On the first 10 pairs, arm B's law-1 birth is byte-identical to arm A's (sha256 equal, 10/10). Arm B's law-2 birth is also identical to arm A's (10/10), so the contest dial does not reach birth at all. CONFIRMED (run).
- **Arm B's one edit**, applied to `git archive f82c2a183` with `node_modules` symlinked:
  ```
  -export const SEAT_CONTEST_LIT = false;
  +export const SEAT_CONTEST_LIT = true;
  ```

**The fold.**
- An array index becomes `[]`.
- The corpus's exact-id rule (`value.id === key`) is applied per instance, folding the key to `{*}`.
- So is its allObject/allArray collapse for 8 or more keys.
- The corpus's cross-instance churn rule is not applied.
- The no-fold cross-check run (every key kept literally) also finds 0 differences, so the fold hides nothing.
- A path's shape is its parent's last named field, which is how `shapeNameOf` names it.

## 2. Law-2-only paths: the reader table

| path | shape | pairs | reader (file :: symbol) | baseline finding | corpus writer |
|---|---|---|---|---|---|
| none | | | | | |

There are no candidates, so steps 4(a) to 4(c) had nothing to check. The readers mode in `probe.mjs` builds the law-1 corpus and runs the live `scanLegacyReaders` plus a key-removed discovery scan. It was not run, because its input set is empty.

## 3. The reverse: paths law 1 writes and law 2 never does

**None.** Both unions are equal in both arms. CONFIRMED (run).

The only per-pair difference in either arm is one pair, `town/mediterranean/osr-d`. There, law 1 writes `conflicts[]` rows and law 2 writes none. The 12 paths are `settlement.conflicts[].{desc,intensity,issue,parties,plotHooks,stakes}` and `settlement.powerStructure.conflicts[].{same six}`, each law-1-only in 1 pair out of 166. Law 2 writes all 12 in other pairs, so this is a situational row count rather than a missing writer, and no reader check is needed.

## 4. Per-path table

`keyprobe.json` holds the per-path table. It contains:
- the per-arm diff rows, with counts and example seeds;
- the unions;
- the 10-pair hash comparison;
- arm B's diff.

## 5. Outside the pairing: the marker (CONFIRMED, run, except where marked)

- **Where the marker lives.** A marker-free birth (`{settType:'town', culture:'germanic'}`, `kp-town-0`) carries no `_seatLawVersion` anywhere, and the corpus births this way. A law-2 birth carries it at `settlement.config._seatLawVersion` and `settlement._config._seatLawVersion`.
- **Reader.** Its one reader is `src/domain/seat/seatLaw.js :: resolveSeatLawVersion`. It reads by computed access (`[SEAT_LAW_CONFIG_KEY]`), which the heuristic scan does not see because it reads only literal property accesses (PLAUSIBLE, read).
- **Baseline.** The baseline holds no `_seatLawVersion` identity (0 matches, grep).
- **Corpus writer.** The law-1 corpus never writes the marker. PLAUSIBLE: its configs carry none, and the pipeline adds none on a marker-free config (run).
- So the marker is unseen by the corpus but also unread by the scan, and the walker reports no finding for it.

## Not measured

- The pulse and coup paths, where `SEAT_CONTEST_LIT` is read (`rulingPowerCoup.js`, `stressorDynamics.js`). This probe covers birth only.
- The corpus's churn fold. The no-fold cross-check covers it.
