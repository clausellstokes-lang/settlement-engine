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

## PLAY TIME (the addendum; measured 2026-11-21, clone `ef5abf4da34205519f37bf42f4a4801431825d5c`)

### THE ONE-LINE ANSWER

**None.** Across the pulse, the DM's change and the coup road, law 2 writes no key path that law 1 never writes.

- Only four raw paths differ, and they differ in both directions. Each is one runtime-id-keyed entry of `pulseResult.worldState.spatialLedgers.provenance`:
  - `"wizard_news.3…free_company_hall.3"` with `.parents`, `.tick` and `.type` appears under law 2 only;
  - `"wizard_news.2…town_watch.2"` with the same three keys appears under law 1 only.
- That is a dynamic map that the per-instance fold does not fold (fewer than 8 entries, and no `id` match). The probe has no cross-instance churn rule.
- Each law writes the same 98 entries of that shape (`.parents`, `.tick`, `.type`), so the folded identity is written under both laws.
- A runtime id cannot be a literal property read, so the readers step had no candidate to check. CONFIRMED (run).

### The run (CONFIRMED, run)

**The tree:**
- A `git clone --shared` of the repository, detached at `ef5abf4da`.
- `node_modules` copied with `cp -al`.
- One edit:
  ```
  -export const SEAT_CONTEST_LIT = false;
  +export const SEAT_CONTEST_LIT = true;
  ```

**How it ran:**
- One node process with `--max-old-space-size=4096`, through `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run`, with output to files. It exited 0.
- One pair, timed first, took 0.5 s (thorp). The whole run took 28 s for 30 pairs, with a peak heap of 326 MB and 0 errors.

**Pairs:** `{settType, culture:'germanic'}` for the six sizes × `kpp-<size>-0..4`, each born with `_seatLawVersion` 1 and 2.

**(a) The pulse:**
- `simulateCampaignWorldPulse`, 6 × one_month, `commit: true`, `now` fixed at `2026-01-01T00:00:00.000Z`.
- The campaign is built as the corpus's producer builds it, with one save. That is the tier-coverage one-save form: no edges and no relationshipStates.
- Every discovered `*Enabled` rule is lit except `advanceEpochEnabled`.
- `worldState`, `wizardNews`, `regionalGraph` and `saves` are carried forward between intervals.

**(b) The DM's change:**
- `src/domain/events/mutate.js :: mutateSettlementChecked` with `{type:'CHANGE_RULING_POWER', targetId, payload:{}}`. The cause defaults to `coup`.
- `targetId` is the first non-governing faction in roster order, as `affordanceManifest.js :: rulingPowerTargets` picks it.

**(c) The coup road:**
- The entry is `src/domain/worldPulse/applyWorldPulse.js :: applyWorldPulseOutcomes`, the narrowest exported entry that runs `applyOutcomeToSettlement` → `transferRulingPower`.
- Its snapshot is built with `buildWorldSnapshot`, as `applyWorldPulseProposal` builds it.
- **I constructed the outcome by hand**, in `coup.js`'s fall shape: `type:'power_transfer'`, `candidateType:'coup_succeeded'`, `applyMode:'auto'`, and `powerTransfer {toPowerName, cause:'coup', tick, losers}`.
- The winner is `rulingPowerCoup.js :: coupContenders(save).challengers[0]`.
- It is applied to the (a) save, not to the save (b) changed.

### Per-step totals

| step | pairs run | law-1 union | law-2 union | law-2-never-law-1 |
|---|---|---|---|---|
| a, pulse result 1–6 | 30 each | 6802–7265 | 6802–7265 | 4, only in interval 2 (the provenance entry above) |
| a, save | 30 | 982 | 982 | 0 |
| b, save | 27 | 1027 | 1027 | 0 |
| c, save | 27 | 988 | 988 | 0 |

- Three thorps have no second faction, so (b) and (c) did not run on them.
- In (b) and (c), the only per-pair differences are the `powerStructure.previousGovernments[]` paths. Law 2 lacks them in 15 pairs of (b) and 1 pair of (c), and law 1 writes none that law 2 never writes. This is a row count, not a key difference.

### Transfers by road

A transfer is counted when the governing power or the owner-audience holder (`holderOf`) changes.

| road | law 1 | law 2 |
|---|---|---|
| pulse (a), any transfer | **0** | **0** |
| pulse (a), by the coup road (`coup_succeeded` applied) | **0** | **0** |
| DM change (b) | 27 | 14 |
| coup road (c, hand-built outcome) | 27 | 27 |

- **The pulse road was NOT measured.** In 6 intervals it made 0 transfers under either law, so every seat change measured here came from (b) or (c).
- **Why (b) made 13 fewer transfers under law 2:**
  - Under law 2, (b) made no seat change in 13 pairs, and returned no veto.
  - In each of those pairs, the first non-governing faction is already the seat's holder (for example, Merchant Guilds holding under a Guild Council).
  - PLAUSIBLE (read): the change has nothing to move there.
