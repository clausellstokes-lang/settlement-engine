# UK — report (builder BUK2 to SEAT-6, 2026-11-20; brief `UK-BAND.md`; base `fb937f369`)

**Outcome.** BUILT, two commits plus a test fixup, dark on the lane and ready to light. One gate stays red because of this unit's new file and is outside its files: `mutationCoverageManifest` TOTALITY (below). STOPPED there, not widened.

- **(a) `323e512a2`**: `npcGenerator.js :: powerBandOfRole(role, config)` applies the fold of f4a434660 (`_` and space read alike, on both sides) ONLY when `seat/seatLaw.js :: seatsByHolder(config)` is true. Any other value reads the old law by the old expression: no config, a missing key, 1, the string '2', or 3. `generateNPCPowerLevel(role, config)` still makes ONE `_rng()` call. The file is still 1,327 lines, and no other file is edited.
- **(b) `a55622d63`** (droppable: revert this one commit): adds the stem `'wealthiest merchant'` in its own list beside `MID_POWER`, read only under the same `law`. If it went inside the `MID_POWER` literal, the old law would read it too, and `roleCategory.test.js`'s mirror of the old law's arrays would go red.

- **fixup of (a)'s test, `0ef0f3c3a`:** a first run of `tests/lint` whole at (b) found `seedLoopTotality` red. Arm 3's six births were run in a bare loop, which had replaced a `test.each` that the each-family park ceiling refuses. They now go through `seedFailures.js :: collectSeedFailures`, with the same assertions and the same recorded digests. (b) still reverts cleanly on top of it (`git apply -R --check`).

**Callers.** These TAKE THE LAW through `generateSingleNPC`'s config, and each already spreads the born config: `generateNPCs` (mandatory roles and fill), `filterByGuild`, `people/representatives.js :: mintPowerFace` and its birth seam (`castPowers.js` hands `settlement.config`). This one READS THE OLD LAW: `castPowers.js :: raiseToOfficeBand`, which has no config. Its office roles (Elder, Mayor, Governor) read the same band under both laws (arm 5), so it is untouched.

**Red → green** (`tests/generators/seatBandFold.test.js`). At the base: 4 red, 7 green (arm 1: 1 red; arm 2, a town and a city: 3 red; arms 3 and 5 are guards). Arm 3's digests were RECORDED at `fb937f369` before any edit. At (a): 11 green. Arm 4 at (a): 2 red; at (b): 13 green.

**Gates.**
- **The 60 test files that name `npcGenerator`** (a superset of the 55): 3 failed, 57 passed at both commits. The 3 are the known reds, and each matches a run at the base: `generatorGoldenMaster` 521, `espionageDormancyFence` received `dba9ff26…`, `worldFactRederive` A7 7.
- **`tests/lint` whole:** `poolDominance` and `writerReach` stay green, so neither moved dark. Two arms are red, NAMED and not re-recorded:
  - `sovereigntyLightingContract`'s census arm: files 3,710 → 3,711, which is this unit's one new file.
  - `mutationCoverageManifest` TOTALITY: the new test has no row in `scripts/mutation-coverage-manifest.json`, which is outside this unit's files.
  - At `0ef0f3c3a`, these two stay red and nothing else is: `seedLoopTotality` and the each-family debt are green (re-run by file after the fixup).
- **Static gates:** lint 0 errors; `typecheck:ratchet` 167/167; `typecheck:domain:strict` 1113/1113.
- **The worker bundle** (`generationWorkerLazy`, 2,585,176 B): NOT MEASURED. Its ceiling arm skips without a built bundle. `seatLaw.js` is already in the generation graph (`rulingPower.js`), so the delta should be only the edited lines' bytes.
- **`confine-two.sh fb937f369 a55622d63`:** EQUAL. Both sides read `all 36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89 1245`.

**THE LIT MEASURE (item 67).** I ran MEASURE-UK's instrument on the BUILT trees: S = `fb937f369`, SK = (a), SKW = (b), with `_seatLawVersion: 2` forced. The instrument is copied with two lines changed: the receipt reads `powerBandOfRole(r, FORCE)`, and the dark switch is added. The calibration step is skipped because it births only the trial's trees. The run gave 3,600 births with 0 errors. Its `aggregate` and `pairs` are BYTE-IDENTICAL to the committed `uk/uk.json`:
- 547 cards in 313 places.
- Guild Master 462 cards low → high.
- The share of powers whose first card reads low: 44.4 → 32.0 %.
- Ties 1,161; goals 606.
- SKW adds +219 cards (766 − 547).

**THE DARK CONTROL:** the same 1,200 places born without the law: S → SK 0 moved, S → SKW 0 moved, 0 errors.

**CONFIRMED:** everything above was executed. A grep of `src/`, `tests/` and `scripts/` finds no other caller of `powerBandOfRole`. **PLAUSIBLE, not traced:** that a SAVED town whose cards are re-dealt (regen, or a section re-roll) hands `generateSingleNPC` its stored config, and so keeps the law it was born under. That belongs to the "TO LIGHT" worklist of item 67.
