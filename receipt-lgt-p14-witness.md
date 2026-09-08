# RECEIPT — LGT-P14-WITNESS (L-HOMES CAR 9) — ✅ COMPLETE

**Lane** L-HOMES-9 / `LGT-P14-WITNESS` · **Seat** Opus 5 — Fable-unvalidated · **Chair** Fable 5.1
**Dock** `$SC/laneLH9`, opened detached at `408d2e2b171b521cebe086e9c8e86e35f517f538` (CAR 1's tip).
**Arrival verified:** HEAD == `408d2e2b1` ✅ · `git status --porcelain --untracked-files=all` = **0 lines** ✅ ·
`node_modules/vitest` is a symlink into the owner tree ✅.
**Exit:** porcelain **0 lines** · no rebase, no push, no ref write, no register act, no `git stash`, no
`git checkout --`, no `git show HEAD:<path> >`, no `node_modules` materialisation. Scratch lives OUTSIDE the
measured tree at `$SC/lh9/`.

---

## 1 · PREMISES RE-DERIVED BEFORE ACTING (a brief figure is the chair's claim, not a fact)

| premise as stated | measured at `408d2e2b1` | verdict |
|---|---|---|
| `presetLightingWitness` = 0 files | `git grep -l 'presetLightingWitness\|preset-lighting-witness' -- src tests scripts schema docs` = **0** | ✅ HOLDS |
| CAR 1's seam is in my tree | `NEW_CAMPAIGN_SIMULATION_PRESET_ID` (`simulationRules.js:31`), `newCampaignSimulationRules` (`:1231`), `createNewCampaignWorldState` (`worldState.js:664`) all present | ✅ HOLDS |
| the birth delta is **+7**, not +1 | born rule keys: dark **30**, `realistic_regional` **37** — the six `PROFILE_KEYS` plus `narrativeTempo` | ✅ HOLDS (CAR 1's correction consumed, not re-discovered) |
| `createDefaultWorldState` is the LOAD base, not the birth address | the witness births through `createNewCampaignWorldState` only | ✅ consumed |
| "the 52-tick window" (CH-6) | `INTERVAL_WEEKS.one_year` = **52**, and one `interval:'one_year'` advance was **counted** through `onTickObservation` at **52 ticks for all 8 rows** | ✅ HOLDS — and it is now asserted in the suite, not assumed |
| the golden-freeze machinery is PRESENT and UNFROZEN | `frozenAt`/`frozenAtSha`/`genesis` all `null`; 48 surface rows; walker arms 1–5 live | ✅ HOLDS |
| ⛔ "the golden-freeze register row (or exclusion) in the SAME commit" | **the obligation is real but the WALKER WOULD NOT HAVE ENFORCED IT** at the briefed path — see §2.1 | ⚠ **AMENDED** |
| the file is `tests/simulation/presetLightingWitness.test.js` + a fixture | file ✅ as briefed; the fixture path re-cut (§2.1); a THIRD file added (§3) | ⚠ **AMENDED** |
| `it.each` is available for a per-preset instrument | ⛔ **REFUTED** — the each-family park ceiling reds. See §2.2 | ⛔ **REFUTED, and it changed the build** |

## 2 · THE TWO BRIEF ADDRESSES RE-CUT BY MEASUREMENT

### 2.1 The fixture is named `preset-lighting-witness-GOLDEN.json`, not `preset-lighting-witness.json`

`tests/lint/goldenFreeze.walker.test.js:461–470`, the arm that claims orphan goldens, filters:

```js
if (!/golden/i.test(rel) || !rel.endsWith('.json')) return false;
```

⇒ **a golden fixture whose PATH does not contain the word "golden" is invisible to the register's own orphan
detector.** At the briefed path the enrolment would have rested on this lane's good faith alone, and a later
deletion of the register row would have reddened **nothing** (arm 4's surface floor is `>= 48`, and my row makes
it 49). Under the `-golden` name the row is structurally required: delete it and arm 2 convicts by path.

**This is also a general gap in the machinery, reported and NOT fixed** (the walker is not this car's): the
estate's golden roster is closed by NAME, so any future same-seed manifest that avoids the word "golden" enters
the tree unenrolled and silent. Widening that glob is a chair/owner call, because it would immediately claim
every `tests/fixtures/*.json` the register does not yet name.

### 2.2 ⛔ `it.each` IS REFUSED BY THE ESTATE, AND THE WALKER NAMES THE CURE

The first build used `it.each(witnessRoster())` for the eight per-row arms. The **whole `tests/lint/` run**
convicted it:

```
× ⛔ THE EACH-FAMILY PARK DEBT ONLY SHRINKS — and the false reformat reds here
AssertionError: MORE files now park solely because of `each`/`for` than the frozen ceiling allows.
  … tests/domain/cultureProfiles.test.js: expected 112 to be less than or equal to 111
  (sovereigntyLightingContract.walker.test.js:2648, EACH_FAMILY_PARK_CEILING)
```

⚠ **vitest prints ACTUAL first: the tree measured 112 against a ceiling of 111.** The walker's own message names
the cure — *"a plain parameterless test looping over the rows in its body, never a new `each` call"* — so the
eight cases became ONE arm comparing the whole live array to the whole recorded array with `toEqual`. That is
also the **truthful** idiom: a per-row loop that threw would report a lower bound, which is exactly the defect
`seedLoopTotality`/`negativeAssertionAnchor` sweep. After the change the each-family arm is **GREEN** and the
same file's title cost fell from 14 to 7.

⭐ **A NOTE FOR EVERY REMAINING WAVE CAR: the lighting census walker's each-family ceiling sits ONE call from its
limit.** Any car that adds an `it.each`/`test.each` to a file that does not already carry one reds it. This is
not in any brief.

## 3 · WHAT LANDED — one commit

| step | outcome | sha |
|---|---|---|
| CAR 9 — the per-preset new-campaign witness (helper + suite + manifest + register row) | ✅ green | **`c0c1db24b`** |

- `tests/simulation/presetLightingWitnessRun.js` — **the SINGLE WRITER of the measurement.** Deliberately **not**
  a `*.test.js`: the lighting census walk, the ratchet's file count and both EP walkers all filter on
  `\.test\.(js|jsx)$` (measured, and confirmed by the walker's own `soakFlagRegistryFixture.js` note), so the
  helper moves **no** register figure and the suite beside it pays them all. Both the suite and the re-record
  recipe drive this one module, so the recorded world and the asserted world cannot diverge.
- `tests/simulation/presetLightingWitness.test.js` — **7 titles, 1 suite.**
- `tests/fixtures/preset-lighting-witness-golden.json` — 8 rows.
- `tests/fixtures/.golden-freeze-register.json` — **+1 surface row, every measured field `null`.**

**The birth path.** Every row is born through `createNewCampaignWorldState(campaign, presetId)` — the exact
expression `buildNewCampaign` evaluates — and never through `SIMULATION_RULE_PRESETS[id].rules`. The
`__birth_default__` row passes **no** preset id, so it resolves `NEW_CAMPAIGN_SIMULATION_PRESET_ID` through the
real door: it is the row that moves the day the shipped default is lit, and moves back the day it is silently
re-darkened.

**The window.** ONE `interval: 'one_year'` advance, with the interior ticks **counted** through
`onTickObservation` and asserted at 52, plus a separate arm asserting the estate's own `INTERVAL_WEEKS.one_year`
is still 52. An arm that assumed 52 and hashed twelve ticks would be a false control that looks like a real one.

**The fixture is HAND-BUILT, not generated.** A two-settlement realm written out in the helper. A fixture
composed through `generateSettlementPipeline` (the chair's `lprobe/pulse-hashes.mjs` idiom) would couple this
witness to the generator estate — the prose car alone moves `generator-golden-master` on 525 of 525 rows — and a
witness that reds on every unrelated generator move gets re-recorded reflexively until it witnesses nothing.
**Recorded as a deliberate divergence from L-PROBE's own probe** (retrovalidation row 2).

**No capture arm, no env spelling — and that is forced, not lazy.** `goldenRecordDoor.recordGolden` writes
`sha256`/`rows`/`ownerRow` onto the register row, and walker arm 1 (`:358`) reds any recorded value while
`frozenAt` is null (CORRECTIONS §7). A door-routed capture arm would therefore **poison the register**. The
surface takes `interior-golden`'s disposition: hand re-record under the golden-shift discipline, from a recipe
carried in the manifest's own `_doc` that drives the committed helper — **verified to run from a clean checkout**:

```
node --input-type=module -e "import('./tests/simulation/presetLightingWitnessRun.js')
  .then(async (m) => console.log(JSON.stringify(await m.measureWitness(), null, 2)))"
```

## 4 · THE WITNESS ITSELF — 8 rows, measured

| row | rule keys | ticks | status | 52-tick world sha256 (16) |
|---|---|---|---|---|
| `__birth_default__` | **30** | 52 | complete | `8ecc0b3ebb87e1ea` |
| quiet_local | 37 | 52 | complete | `a9c0cedfead3d969` |
| realistic_regional | 37 | 52 | complete | `934feeda43a9b28d` |
| dramatic_campaign | 56 | 52 | complete | `bd7fc01049d4a01c` |
| static_campaign | 36 | 52 | complete | `895cfe4af077dcd1` |
| narrative_campaign | 37 | 52 | complete | `885ed4306fe27d4d` |
| living_realm | 55 | 52 | complete | `f5f44a265106539b` |
| full_simulation | 70 | 52 | complete | `b03ba26cee3652f2` |

**DISCRIMINATION, MEASURED: 8 of 8 distinct** on `rulesSha256`, `bornWorldSha256`, `worldStateSha256` and
`wizardNewsSha256` (7/8 on `settlementUpdatesSha256`, 6/8 on `regionalGraphSha256` — recorded for diagnosis, not
asserted as a floor). The suite's discrimination arm asserts the two 8/8 figures, because a pulse that stopped
reading `simulationRules` would still hash — identically — and every equality arm would go on passing against a
flat re-recorded manifest.

⭐ **CROSS-CHECKED against LGT-P1-BIRTH's independently generated deliverable: all seven preset `rulesSha256` are
BYTE-IDENTICAL** to `$SC/lh1/birth-fixtures-p1.json`, and all eight rule-key counts match. Two lanes, two
instruments, one answer. (The `bornWorldSha256` values differ by construction and must: the campaign id is part
of the world's `rngSeed`, and the two fixtures pin different ids.)

**DETERMINISM:** the minting run is byte-identical across two fresh processes (`cmp` on the whole manifest), and
the born world itself is identical across a 1.1 s gap (`canonizedAt` is `null`, not a clock read).

## 5 · PLANT-OUT — four mutants, all killed, all restored byte-identical

Harness refuses a plant whose anchor is not unique and refuses one whose md5 does not move. Restore is `cp` from
a backup taken BEFORE the plant, verified by `cmp` **and** md5 in the same shell. The checkout family was never
used.

| # | mutant | reds | logs |
|---|---|---|---|
| M1 | `NEW_CAMPAIGN_SIMULATION_PRESET_ID = 'full_simulation'` — the L-DEFAULT event, unannounced | **3** — the constant arm, the `__birth_default__` row, **and the discrimination arm** | `$SC/lh9/m1.log` |
| M2 | the birth door drops its argument (`newCampaignSimulationRules()`) — a door onto nothing | **8** — all seven preset rows plus discrimination | `$SC/lh9/m2.log` |
| M3 | one recorded digest doctored in the manifest (`quiet_local`) | **1** — that row only | `$SC/lh9/m3.log` |
| M4 | the window collapses `one_year` → `one_month` | **9** — the 52-tick arm plus every row | `$SC/lh9/m4.log` |

⭐ **M1 is the one that matters, and it kills MORE than predicted:** lighting the default does not merely move
`__birth_default__` — it collapses the roster from 8 distinct worlds to 7, because the default row becomes a
duplicate of `full_simulation`. The instrument convicts a silent re-darkening from two independent directions.

**Restore proof:** `simulationRules.js f5d7d1a31ce33e858e92034e23362cb0` · `worldState.js
fbad6f773674d02aaec142cdb44f44ed` · `preset-lighting-witness-golden.json 0faef841c3b78941ad869ab451333206` ·
`presetLightingWitnessRun.js 087393861dd05bf19e180ff6d77e471b` — live == backup for all four, porcelain empty,
clean re-run exit **0**.

## 6 · RECEIPTS, EVERY EXIT CAPTURED IN-SHELL

| instrument | exit | figure |
|---|---|---|
| `npx eslint` (both new JS files) | **0** | zero problems, zero warnings |
| `npm run typecheck:domain:strict` | **0** | `no strict-type regressions (1120 errors, ceiling 1120)` |
| `npm run check:observed-shape-readers` | **0** | `1993 finding(s), exactly matching the frozen inventory` |
| `node scripts/check-writer-reach.mjs` | **0** | judged 6520 · LIT 550 · LIT-NAME 4644 · DARK 1326 (identical to CAR 1) |
| `node scripts/count-tuning-inventory.mjs` | **0** | 233 / 2110 / 535 / 6985 / 8 / 147 — identical to the frozen totals |
| the witness suite (mutex) | **0** | `Test Files 1 passed (1) · Tests 7 passed (7)` at the committed tip |
| guards: `mechanismLitCoverage` + `campaignRuntimeLazy` + `voiceMechanics` + `proseLeak` + `goldenFreeze.walker` + the witness | **0** | `Test Files 6 passed (6) · 154 passed \| 3 skipped (157)` |
| **`tests/lint/` WHOLE** (final tree) | **1** | `Test Files 1 failed \| 138 passed (139) · Tests 1 failed \| 2145 passed (2146)` · 98.4 s |

**The single `tests/lint/` red, attributed by measurement:** `sovereigntyLightingContract.walker.test.js` >
"THE CENSUS IS AN ASSERTION" — `expected 2524 to be 2523`. **The tree measures 2524**; 2523 is the frozen file
count. It is the lighting census owed to the chair, caused by this car's one new test file and nothing else.
**Every other arm of the 83-walker scanner family is green**, including `goldenFreeze.walker` (my new register
row), `negativeAssertionAnchor`, `seedLoopTotality`, `sizeBaseline` and `distributionEnvelopePower`. No other
file in `tests/lint/` failed. The earlier each-family red (§2.2) is **cured**, not banked: it does not appear in
the final run.

⚠ **A FALSE GREEN CAUGHT IN MY OWN RUN, recorded because it is the shape the preamble warns about.** The first
guards run named `tests/lint/mechanismLitCoverage.test.js`; that file lives in `tests/property/`. Vitest
reported `Test Files 5 passed (5)` — **exit 0 over a six-file request, with the missing file reported nowhere.**
Caught by counting the files in the summary against the files I asked for. Re-run at the correct path: 6/6.

## 7 · EAGER BYTES = 0 — the reason, not the hope

This car adds **no `src/` byte and no new import edge from any first-paint module**. All four touched paths are
under `tests/`, and nothing under `tests/` is reachable from the build entry `src/main.jsx` — the closure that
the hashed-chunk listing measures does not contain the test corpus at all. The landed authority is re-executed
rather than argued: `tests/build/campaignRuntimeLazy.test.js` passes at this tip (§6 guards row), so the
catalog's import position is unmoved. ⇒ **predicted first-paint delta 0 B.** The chair's hashed-chunk listing
diff remains the proof; this is the reason.

## 8 · PREDICTED REGISTER DELTAS — recorded, NOT taken

Base measured by holding `presetLightingWitness.test.js` aside and re-running the farmed probe in the same dock
(`mv` out, probe, `mv` back, `cmp` + md5 verified) — never inferred from CAR 1's receipt, though it agrees with
it exactly.

```
FROZEN (tests/lint/.lighting-census-baseline.json)  2523 / 371 / 2152 / 23204 / 6217
MY BASE (408d2e2b1, this file held aside)           2523 / 371 / 2152 / 23211 / 6218   [MEASURED]
MY TIP  (c0c1db24b)                                 2524 / 371 / 2153 / 23218 / 6219   [MEASURED]
```

| register | frozen | this tip | delta owed at the landing | of which THIS CAR | how |
|---|---|---|---|---|---|
| lighting census `files` | 2523 | **2524** | **+1** | **+1** | MEASURED (farmed probe; and by the walker's own red) |
| lighting census `parked` | 371 | **371** | 0 | 0 | MEASURED — the file is CREDITED, not parked (it was parked before the `each` cure) |
| lighting census `credited` | 2152 | **2153** | **+1** | **+1** | MEASURED |
| lighting census `titles` | 23204 | **23218** | **+14** | **+7** | MEASURED — CAR 1 owns the other +7 |
| lighting census `suiteTitles` | 6217 | **6219** | **+2** | **+1** | MEASURED — the walker throws on `files` first, so this figure is invisible to it |
| **golden-freeze register `surfaces`** | 48 | **49** | **+1** | **+1** | MEASURED — arm 4's floor is `>= 48`, so the growth passes; every measured field on the new row is `null`, so arm 1 (`:358`) stays green |
| test ratchet `totalTests` | 31511 | 31525 | +14 | **+7** | DERIVED (a 90 % collapse floor; a rise cannot red it) |
| test ratchet `totalFiles` | 2470 | 2471 | +1 | **+1** | DERIVED, same floor |
| test ratchet `entries` | 2 | 2 | 0 | 0 | no new known failure — the car lands green |
| four censuses per new `src/domain` leaf | — | — | **0** | 0 | no `src` file created or edited |
| `sizeBaseline` | — | — | **0** | 0 | no baselined file touched; `tests/lint/sizeBaseline.test.js` green in the whole-dir run |
| voice magnitudes | — | — | **0** | 0 | `voiceMechanics` + `proseLeak` green; the car adds no user-facing string |
| writer-reach · OSR · domain-any · tuning | — | — | **0** | 0 | each executed above, exit 0, figures identical |
| **eager / first-paint bytes** | — | — | **0 B** | 0 | §7 |

⛔ **No register act was taken.** `LIGHTING_CENSUS_REFREEZE` was never set; `--update`, `--write`, `--genesis`,
`--rebank` were never run; no `*_REFREEZE`/`UPDATE_*` env var was set anywhere in this lane.

## 9 · FINDINGS RECORDED, NOT BUILT

1. ⭐ **The golden roster is closed by NAME.** `goldenFreeze.walker.test.js:466` claims fixtures by
   `/golden/i` on the path. Any same-seed manifest named without that word enters the tree unenrolled and
   silent, and its register row (if a lane writes one voluntarily) can be deleted later with nothing reding.
   Cured **for this surface** by naming; the general hole is the chair's.
2. ⭐ **The each-family park ceiling is one call from its limit (111, tree measured 112 with a single new
   `each`).** No brief in this wave mentions it. Every remaining car that would parameterise a test needs the
   body-loop idiom instead.
3. **`lprobe/pulse-hashes.mjs` already computes 52-tick hashes per preset**, by a different birth (`buildNewCampaign`
   then `prepareRulesUpdate`) and a generator-composed fixture. This car deliberately did **not** adopt that
   fixture (§3). The two instruments are therefore complementary, not redundant: L-PROBE-2's arm measures the
   corpus-shaped world, this one measures the preset in isolation. **If the chair wants them comparable, that is
   a decision to make now, not after the freeze.**
4. **The docket's `size` row says the car "owes THREE new-test-file censuses."** Measured, it owes **four moved
   figures on ONE census** (`files`, `credited`, `titles`, `suiteTitles` on the lighting census) plus two test-ratchet
   collapse floors and one golden-freeze surface count. The count is a figure the chair should take from §8, not
   from the docket.
5. **`advanceEpochEnabled` is `undefined` in all eight born worlds today.** `src/domain/clock.js:79` THROWS on a
   lit world with no threaded epoch, so the helper threads a pinned per-row nonce when the flag is strictly true
   and `null` otherwise, and every row records `advanceEpochLit: false`. The lit branch is therefore **declared
   and untested** — it becomes live the day L-DEFAULT lights that key, and the row's own field makes the
   transition visible rather than silent.

## 10 · RETROVALIDATION ROW (owed to the Fable 5.1 chair)

| # | what an Opus seat JUDGED | what the chair must RE-DERIVE | receipts by path | priority |
|---|---|---|---|---|
| 1 | the fixture is `tests/fixtures/preset-lighting-witness-**golden**.json`, not the briefed name, so arm 2's `/golden/i` glob claims it and the enrolment is structural rather than voluntary | that the deviation from the briefed path is worth the enforcement, and that no chair/L-PROBE-2 tooling expects the briefed identity | `goldenFreeze.walker.test.js:461–470` · the register row's `note` · commit `c0c1db24b` | **HIGH** — it re-cuts a briefed address |
| 2 | the witness realm is HAND-BUILT rather than composed the way `lprobe/pulse-hashes.mjs` composes its own, to keep generator moves out of this manifest | that a preset witness should be generator-independent, and whether L-PROBE-2's arm and this one are meant to be comparable | `presetLightingWitnessRun.js` header · finding 9.3 | **HIGH** |
| 3 | the surface is enrolled with `recordEnv: null` and re-recorded BY HAND, because a door-routed capture arm would write a recorded value onto an UNFROZEN register row | that `interior-golden`'s disposition is the right one here, and that the freeze act will convert this surface with the rest | register row `note` · CORRECTIONS §7 · `goldenFreeze.walker.test.js:358` | MEDIUM |
| 4 | the measurement lives in a non-`*.test.js` helper so it can be the single writer without paying a second file's censuses | that a `tests/simulation/*.js` helper is the right home (precedent: `simHelpers.js`), and that the census/ratchet/EP filters make it free — measured, not assumed | `presetLightingWitnessRun.js` · §8 base-vs-tip measurement | MEDIUM |
| 5 | the eight per-row cases were collapsed into ONE array comparison rather than `it.each`, on the walker's own instruction | that a single `toEqual` over eight rows is acceptable legibility, and that the each-family ceiling finding (9.2) should be circulated to the remaining cars | `$SC/lh9/vitest-lint.log` (the each red) vs `vitest-lint2.log` (cured) | MEDIUM |
| 6 | `advanceEpoch` is threaded conditionally on `advanceEpochEnabled`, leaving one branch declared-but-untaken | that a declared branch is preferable to a throw when L-DEFAULT lights that key | finding 9.5 · `src/domain/clock.js:79` | LOW |
| 7 | committed WITH the pre-commit hook (not `--no-verify`); the hook changed nothing | that the four committed blobs equal the working files — verified here by `git show HEAD:<path> \| md5` against the live md5 for all four | §6 · `$SC/lh9/pre-commit-md5.txt` | LOW |

**Dock tip: `c0c1db24b53577b015de024cd847426034af9e45`.**
