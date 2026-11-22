# UK-LEGACY: a town that reads law 1 takes law 1's band whoever regenerates it. Builder BUL.

Written 2026-11-22T02:52:30Z by SEAT-10, on the chair's order of 02:52Z (a unit of the lane, before "SEAT <commit>").

## THE RED (do not weaken it)

`tests/domain/seat/seatLawSavedTown.test.js` :: "4. THE LEGACY EDGE (measured): a save with no settlement.config regenerated under a lit world's form config stays law 1". It fails today with "no config, no _config: the seat marker in the fallback config moved regenNPCsPipeline".

- Bisected by SEAT-10 (CONFIRMED): green 5/5 at `b2845bafc`, red at the UK merge `9624a7ac4`, red at the tip, dark and flipped.
- The mechanism (PLAUSIBLE, yours to prove): `src/generators/npc/powerBand.js :: powerBandOfRole(role, config)` reads `seatsByHolder(config)` off the config it is HANDED. `npcGenerator.js :: generateNPCPowerLevel` hands it the npc config. On the regen road, `store/settlementRegenAction.js` hands `regenNPCsPipeline` / `regenHistoryPipeline` the fallback `settlement.config || config`; for a legacy save (no `config`, no `_config`) that is the store's FORM config, which carries `_seatLawVersion: 2` once a lit town was Library-loaded. The town still reads 1 (`resolveSeatLawVersion(after) === 1`), but its regenerated people take law 2's band fold.

## THE RULE (the chair's)

Every reader of the seat law on a regenerate road reads it OFF THE RECORD BEING REGENERATED: the settlement's own marker, through the lane's one resolver (`src/domain/seat/seatLaw.js :: resolveSeatLawVersion` / `seatsByHolder`). It never reads it off a fallback or form config it is handed. A record with no marker is law 1.

At BIRTH nothing changes: the born config IS the record's config.

## WHERE AND WHAT YOU MAY TOUCH

- **Tree:** you work ONLY in the scratch clone `/tmp/claude-0/-home-user-settlement-engine/063b430e-c1e9-57b8-bc28-1d71aefb0933/scratchpad/bul`, at the commit of this brief. NEVER touch `/home/user/settlement-engine`: a census control runs on it and needs it clean.
- **Git:** you commit in that clone, by explicit paths, on its local branch `uk-legacy`. You make NO push and NO pull request. The integrator fetches your branch from the clone.
- **The manifest, at most these files:**
  - `src/generators/generateSettlementPipeline.js`: the preferred seam. In `regenNPCsPipeline` and `regenHistoryPipeline`, the config handed down carries the RECORD's seat marker (the record's, or none), never the handed one. One seam covers the store and the engine service (`src/engine/serviceEntry.js` re-exports these passes).
  - `src/domain/seat/seatLaw.js`: at most ONE new small export, if the seam needs a helper (for example "this config with the seat key the record's"). It goes through the one resolver; no second reader of the key.
  - `src/generators/npc/powerBand.js`: comments only, if the "born config" comment needs to name the regen rule.
  - `docs/chair/2026-11-20/content/seat/briefs/UK-LEGACY-REPORT.md`: your report.
  - NOTHING in `tests/`. If you believe a test needs a change, STOP and say so.
- **If the seam cannot hold** (for example a pass reads `settlement.config` and the handed config for different keys, and the override breaks something), STOP and report it by symbol. Do not widen the manifest.

## GREEN

1. **The red goes green.** `seatLawSavedTown.test.js` 5/5 unflipped.
2. **Green flipped too.** Make a SECOND scratch copy of your cured tree, outside the repository, with exactly the two dial edits: `seatLaw.js :: NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION` and `seatCircumstances.js :: SEAT_CONTEST_LIT = true`. Quote its diff. There, the same file is 5/5. Never commit the flipped copy.
3. **Unmoved:** `tests/generators/seatBandFold.test.js`, `tests/generators/roleCategory.test.js`, and every file under `tests/domain/seat`. Each green unflipped, and name its count.
4. **The registers' doors (run each, report green or what moved; re-take NOTHING):**
   - `tests/lint/sizeBaseline.test.js`
   - `tests/lint/densityCreateBoundary.walker.test.js`
   - `tests/lint/writerReach.walker.test.js`
   - `node scripts/wiring-census.mjs --dry`
   - `tests/lint/sovereigntyLightingContract.walker.test.js`

   If one moves, say what moved. The integrator takes registers by their doors.
5. **Dark: no birth moves.** That proof (confine-two, from `a64619510` to the new tip) is the integrator's: do not run it.

## THE SWEEP (in the report)

Find by grep every reader of the seat law that takes it from a HANDED config rather than the record, on these roads:
- regenerate (`regenSection`, the two passes);
- re-derive (`store/settlementRederiveAction.js`, `regenerateWithLayer`);
- clone (`domain/clone.js :: deepClone`);
- load (`hydrateFromSave`, the Library load, import: `lib/importReconciliation.js`).

The saved-place test's other arms name these roads. Start from `grep -rn "seatsByHolder\|resolveSeatLawVersion\|_seatLawVersion\|SEAT_LAW_CONFIG_KEY" src`, and follow each reader's argument back to who hands it.

For each reader, give `file :: symbol`, what it reads (a record or a handed config), and the verdict: it reads the record, or you cured it here, or you NAME it (not cured; why). A re-derive is a BIRTH under `densityLaw.js`'s header rule when it re-runs `generateSettlementPipeline` over a config: say whether its config is the record's.

## LIMITS

- **Runs:** single files only, each through `TMPDIR=/tmp GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=1 <files>`, output to a file. Never read a gate through a pipe; read the file afterwards. No whole-suite run. No `npm run build`.
- **Environment:** never with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX set.
- **Network and services:** no supabase command, no hosted database, no deploy.
- **Wall time:** about 60 minutes.
- **If your own permission check refuses any action:** that refusal stands. Report it in one line and try nothing else to the same end.

## OUTPUT

`UK-LEGACY-REPORT.md` holds:
- the cure (the diff summary, `file :: symbol`);
- each GREEN item with its count;
- the flipped copy's diff;
- the sweep table;
- your commit sha.

Label each claim CONFIRMED (run) or PLAUSIBLE (read). Your final message: at most 200 words, the commit sha first.
