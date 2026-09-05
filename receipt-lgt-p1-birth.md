# RECEIPT — LGT-P1-BIRTH (L-HOMES CAR 1) — ✅ COMPLETE

**Lane** L-HOMES-1 / `LGT-P1-BIRTH` · **Seat** Opus 5 — Fable-unvalidated · chair Fable 5.1
**Dock** `$SC/laneLH1`, opened detached at `38474a59e` (HEAD and porcelain 0 both verified on arrival).
**Dock tip: `408d2e2b171b521cebe086e9c8e86e35f517f538`** · porcelain 0 at close · no rebase, no push, no ref write, no register act, no `git stash`,
no `git checkout --`, no `git show HEAD:<path> >`, no `node_modules` materialisation.

---

## 1 · PREMISES RE-DERIVED BEFORE ACTING (a brief figure is the chair's claim, not a fact)

| premise as stated | measured at `38474a59e` | verdict |
|---|---|---|
| `NEW_CAMPAIGN_SIMULATION_PRESET_ID` = 0 files | `git grep -l … -- src tests scripts schema docs` = **0** | ✅ HOLDS |
| a default campaign is born by plain `normalizeSimulationRules()` | `campaignImportedCreation.js:50` `ensureWorldState(null, …)` — the ONLY `ensureWorldState(null` in `src` | ✅ HOLDS |
| `worldState.js` ~:317 / :527 / :530 | `:317` `simulationRules: normalizeSimulationRules()` · `:527` `const base = createDefaultWorldState(campaign)` · `:530` `normalizeSimulationRules(raw?.simulationRules)` | ✅ HOLDS exactly |
| the L-PROBE receipts describe MY tip | `$SC/laneCLAMP3` HEAD = `38474a59eba460f30d6596dcb65efda3a446738a` == my dock | ✅ HOLDS |
| `simulationRules.js` is regexed as RAW SOURCE, a flag name in a comment mints it | `mechanismLitCoverage.test.js:186` `simRulesSrc.matchAll(/\b([a-zA-Z][a-zA-Z0-9]*Enabled)\b/g)` — comments included | ✅ HOLDS; obeyed and proven (§4) |
| `subsystemRowsVirtual.js` at its 800-line ceiling | not touched by this car | n/a |
| **"dark-inert because the lit preset resolves to the same rules as today"** | ⛔ **FALSE for the obvious construction** — see §2 | ⛔ **REFUTED, and it changed the build** |
| brief: touch `buildNewCampaign`, `campaignImportedCreation`, `createDefaultWorldState` | `buildNewCampaign` **lives in** `campaignImportedCreation.js` (one file, two names); `createDefaultWorldState` is the **wrong address** — see §2 | ⚠ **AMENDED** |

## 2 · ⛔ THE BRIEF ERROR THAT CHANGED THE BUILD

**Measured:** `normalizeSimulationRules(SIMULATION_RULE_PRESETS[DEFAULT_SIMULATION_PRESET_ID].rules)` returns **37 keys**;
`normalizeSimulationRules()` returns **30**. The seven extra are the six `PROFILE_KEYS` plus `narrativeTempo`.

**Cause:** `preset(id, label, overrides)` (`simulationRules.js:501`) builds `rules` as
`{ ...DEFAULT_SIMULATION_RULES, presetId: id, ...overrides }`, and `DEFAULT_SIMULATION_RULES` carries
`...PROFILE_DEFAULTS`. So **every** preset's `rules` names a profile key, which fires the normalizer's
`PROFILE_KEYS.some(key => key in input)` MATERIALIZE branch. The CL-0 virtual profile stops being virtual.

**Consequence:** a birth seam whose constant pointed at `realistic_regional` — the reading the brief invites —
would have shipped **+7 persisted rule keys on every new campaign and a moved new-campaign envelope**, i.e. exactly
the cost CR-WR10-C refused ("+32 serialized bytes per key on every NEW campaign, a moved new-campaign state hash").
**It would not have been dark-inert.**

**Cure:** `NEW_CAMPAIGN_SIMULATION_PRESET_ID = null` — "no lit successor exists yet", the honest value, which
resolves to the plain default and is byte-identical to today's birth. The +7 cost is now **written into the constant's
own comment and asserted by two pins**, so L-DEFAULT declares it instead of discovering it.

**Second amendment — `createDefaultWorldState` is the wrong address.** It is called at `worldState.js:527` as the
`base` for **every load of every installed campaign**, and `:530` overrides `simulationRules` unconditionally from
the raw. A birth preset resolved there would be **inert on the birth path** (`ensureWorldState(null, …)` re-normalizes
from an absent raw) and a **PROMISE risk on the load path**. The birth door is therefore a new sibling beside
`ensureWorldState`, not an edit to `createDefaultWorldState`; `:317`, `:527` and `:530` are **UNEDITED**.

## 3 · WHAT LANDED — one commit

| step | outcome | sha |
|---|---|---|
| CAR 1 — the birth seam (constant + resolver + door + wiring + 7 pins) | ✅ green | `408d2e2b1` |

- `src/domain/worldPulse/simulationRules.js` — `NEW_CAMPAIGN_SIMULATION_PRESET_ID = null` (beside `DEFAULT_SIMULATION_PRESET_ID`, which is **untouched**) + `newCampaignSimulationRules(presetId?)`, the ONE reader.
- `src/domain/worldPulse/worldState.js` — `createNewCampaignWorldState(campaign, presetId?)`, a sibling of `ensureWorldState`. ⛔ `ensureWorldStateWithEnvoyNormalizer` keeps plain `normalizeSimulationRules(raw?.simulationRules)`.
- `src/store/campaignImportedCreation.js` — `buildNewCampaign` births through the door (feeds BOTH `createCampaign` and `createImportedCampaign`).
- `tests/domain/simulationRulesPreset.stability.test.js` — **+7 tests, +1 suite. NO new test file.**

## 4 · RECEIPTS, EVERY EXIT CAPTURED IN-SHELL

| instrument | exit | figure |
|---|---|---|
| `npx eslint` (4 changed files) | **0** | zero problems |
| `npm run typecheck:domain:strict` | **0** | `no strict-type regressions (1120 errors, ceiling 1120)` |
| `npm run check:observed-shape-readers` | **0** | `1993 finding(s), exactly matching the frozen inventory` |
| `node scripts/check-writer-reach.mjs` | **0** | judged 6520 · LIT 550 · LIT-NAME 4644 · DARK 1326 |
| `node scripts/count-domain-any.mjs` (per file) | — | simulationRules **12** == frozen 12 · worldState **33** == frozen 33 |
| `node scripts/count-tuning-inventory.mjs` | **0** | 233 / 2110 / 535 / 6985 / 8 / 147 — **identical to the frozen totals** |
| focused vitest (5 files) | **0** | `Test Files 5 passed (5) · Tests 94 passed (94)` |
| **`tests/lint/` WHOLE** | **1** | `Test Files 1 failed | 138 passed (139) · Tests 1 failed | 2145 passed (2146)` |
| guards: `mechanismLitCoverage` + `campaignRuntimeLazy` + `voiceMechanics` + `proseLeak` | **0** | `Test Files 4 passed (4) · 57 passed | 3 skipped` |

**The single `tests/lint/` red, attributed:** `sovereigntyLightingContract.walker.test.js` >
"THE CENSUS IS AN ASSERTION" — `expected 23211 to be 23204`. **The tree measures 23211**; 23204 is the frozen
figure. It is the lighting census owed to the chair, caused by this car's 7 new titles, and by nothing else.
Every other arm of the 83-walker scanner family is green. No other file in `tests/lint/` failed.

**The flag denominator did not move** — control executed rather than asserted: `enumerateFlags`'s regex over
`simulationRules.js` at HEAD vs my worktree returns **90 tokens on both sides, added [] removed []**. No flag was
minted by a comment. `mechanismLitCoverage`'s two exact-equality ratchets are green.

## 5 · PLANT-OUT — four mutants, all killed, all restored byte-identical

Harness refuses a plant whose anchor is not unique and refuses one whose md5 does not move. Restore is `cp` from a
backup taken BEFORE the plant, verified by `cmp` **and** md5 in the same shell. The checkout family was never used.

| # | mutant | reds |
|---|---|---|
| M1 | `buildNewCampaign` re-opens `ensureWorldState(null, …)` (seam severance) | 1 — *the store births THROUGH the door* |
| M2 | the birth preset LEAKS into `ensureWorldStateWithEnvoyNormalizer` (THE PROMISE breach) | 1 — *LOADING never re-decides a world* |
| M3 | `NEW_CAMPAIGN_SIMULATION_PRESET_ID = 'full_simulation'` — the L-DEFAULT event, unannounced | **4** — the declared-shift tripwire fires on every arm |
| M4 | the resolver ignores its argument (a door onto nothing) | 3 |

Restore proof: `simulationRules.js f5d7d1a31ce33e858e92034e23362cb0` · `worldState.js fbad6f773674d02aaec142cdb44f44ed` ·
`campaignImportedCreation.js 77c5fb99cd9d4ed20d7face4b3a035fa` — live == backup for all three, `git status --porcelain
--untracked-files=all` **empty**, and a clean re-run exits **0**.

⭐ M3 is the one that matters: a later silent re-darkening — or lighting — of the default preset **cannot land quietly**.

## 6 · DARK-INERTNESS, MEASURED

```
ensureWorldState(null, C)                                          -> 1296 bytes, sha bedbc7305b9586c1
ensureWorldState({simulationRules: normalizeSimulationRules()}, C) -> 1296 bytes, sha bedbc7305b9586c1
BYTE IDENTICAL (whole worldState) = true · top-level key order equal = true · rules key order equal = true
```
The same identity is asserted in the landed pin (`the birth DOOR is byte-identical to the birth it replaces`) and
re-proved by the fixture generator (`darkBirth.equalsPreCarBirth: true`). **Same-seed shift: NONE.**
Machinery proved with the door FORCED: all seven presets round-trip through the real birth path;
`full_simulation` reaches the born world at **70** rule keys against the dark birth's **30**.

## 7 · EAGER BYTES = 0 — the reason, not the hope

All three source files are OUTSIDE the first-paint closure, behind `campaignRuntimeBridge`'s one dynamic edge, and
this car adds **no new import edge from any first-paint module** (`worldState.js` already imported
`simulationRules.js`; `campaignImportedCreation.js` already imported `worldState.js`). The authority is a LANDED
pin, not my own walker: `tests/build/campaignRuntimeLazy.test.js` asserts `sourceStaticClosure('src/main.jsx')` does
not contain `worldState.js`, `simulationRules.js` or `campaignSlice.js` — **it passes at this tip** (§4 guards row).
The chair's own eager probe at this same tip reports `catalogInSourceClosure: false`, closure 237, verdict
`LAZY — clear`, `stopTriggered: false`; nothing in this car moves the catalog's import position.
⇒ **predicted first-paint delta 0 B.** The chair's hashed-chunk listing diff remains the proof; this is the reason.

## 8 · PREDICTED REGISTER DELTAS — recorded, NOT taken

| register | frozen | this tip | delta | how |
|---|---|---|---|---|
| lighting census `files` | 2523 | **2523** | 0 | MEASURED (`lprobe/census-probe.mjs`, read-only farm) |
| lighting census `parked` | 371 | **371** | 0 | MEASURED |
| lighting census `credited` | 2152 | **2152** | 0 | MEASURED |
| lighting census `titles` | 23204 | **23211** | **+7** | MEASURED (and independently by the walker's own red) |
| lighting census `suiteTitles` | 6217 | **6218** | **+1** | MEASURED — the walker throws on `titles` first, so this figure is invisible to it |
| test ratchet `totalTests` | 31511 | 31518 | +7 | DERIVED; a 90 % collapse floor, so a rise cannot red it |
| test ratchet `totalFiles` | 2470 | 2470 | 0 | no file added or deleted |
| test ratchet `entries` | 2 | 2 | 0 | no new known failure |
| four censuses per new `src/domain` leaf | — | — | **0** | no new leaf; both edits are to existing modules |
| golden-freeze register | — | — | **0** | no new test file, no fixture, and **no golden-adjacent env spelling** anywhere in the diff (`grep -E "UPDATE_|GOLDEN|REFREEZE|process\.env"` over the touched test file = none) ⇒ neither a row nor an exclusion is owed |
| `sizeBaseline` | — | — | **0** | none of the three src files is baselined; effective lines 324 / 351 / 135 AT THIS TIP (pre-car 316 / 345 / 135) against a layer ceiling of 800, and `tests/lint/sizeBaseline.test.js` is green in the whole-dir run |
| voice magnitudes | — | — | **0** | `voiceMechanics` + `proseLeak` green; the car adds no user-facing string |
| writer-reach · OSR · domain-any · tuning | — | — | **0** | each measured above, exit 0, figures identical |

## 9 · THE CAR 9 DELIVERABLE — a REAL-birth fixture per preset

`$SC/lh1/birth-fixtures-p1.json`, generated by `$SC/lh1/birth-fixture-p1.mjs` (writes nothing into the tree).
Born through `createNewCampaignWorldState(campaign, presetId)` — **the exact expression `buildNewCampaign`
evaluates** — and **never** through `SIMULATION_RULE_PRESETS[id].rules`. Campaign identity is PINNED
(`birth-<presetId>`) because `rngSeed` is `world-pulse:${id}`; the volatile `id/createdAt/updatedAt` live on the
store ENVELOPE, not on the world, so the world hash needs no exclusion list.

| preset | rule keys | round-trips | world sha256 (16) |
|---|---|---|---|
| quiet_local | 37 | yes | `dfd3b661f039db1b` |
| realistic_regional | 37 | yes | `121fce47cbe8b630` |
| dramatic_campaign | 56 | yes | `d1dd3c8ef390ca8c` |
| static_campaign | 36 | yes | `ff07d95eea857f88` |
| narrative_campaign | 37 | yes | `3c5da597e90aa061` |
| living_realm | 55 | yes | `983faa9f6ce390ea` |
| full_simulation | 70 | yes | `af7155a784a8cb3f` |

⭐ **CROSS-CHECKED against the chair's L-PROBE `f-birth-fixtures.json`, which reached the same worlds by a
DIFFERENT path (`simulationProfile.prepareRulesUpdate`): all seven `resolvedRules` are identical — sorted-key JSON
equal, zero differing keys, matching key counts 37/37/56/36/37/55/70.** Two independent instruments, one answer.

⚠ **A control CAR 9 must not inherit blindly:** L-PROBE's `defaultRuleKeyCount: 36` is
`Object.keys(DEFAULT_SIMULATION_RULES).length`, **not** `normalizeSimulationRules()` (which is **30**). Comparing a
resolved 37 against 36 reads a +1 delta; the true birth delta is **+7**.

## 10 · FINDINGS RECORDED, NOT BUILT

1. **A third birth path the brief does not name.** `src/lib/instantWorld/composeInstantWorld.js` `applyTonePreset`
   already births through a preset (`plan.tonePresetId`) and falls back to a **hardcoded**
   `SIMULATION_RULE_PRESETS.realistic_regional` for an unknown tone id. Its births therefore ALREADY carry the
   materialized profile (37 keys), unlike `buildNewCampaign`'s. Untouched — the tone is a customer's choice, not a
   default — but the **fallback** arguably belongs on the birth seam. **An L-DEFAULT decision, not this car's.**
2. **PLAN §6 POSITION 2 row 1's "sibling pin beside `simulationRules.js:136–145`" does not address a pin** at this
   tip: :136–145 is the `warLevyEnabled` comment block. The row's own "new test file? no — extends
   `simulationRulesPreset.stability.test.js`" is the correct address, and that is where the seven pins went.
3. **Two detectors in this car reddened on their first run by reading the car's own prose** —
   `createNewCampaignWorldState`'s JSDoc names `newCampaignSimulationRules`, and `buildNewCampaign`'s comment
   quotes the `ensureWorldState(null, …)` call it replaced. Cured by scanning EXECUTABLE source, with a control
   proving the stripper works in both directions. **The general shape: a source-contract negative that scans raw
   text is satisfied by commenting the forbidden call out, and convicted by explaining it.** Worth a standing row.

## 11 · RETROVALIDATION ROW (owed to the Fable 5.1 chair)

| # | what an Opus seat JUDGED | what the chair must RE-DERIVE | receipts by path | priority |
|---|---|---|---|---|
| 1 | `NEW_CAMPAIGN_SIMULATION_PRESET_ID = null` rather than a real preset id, on the measured ground that any preset id materializes the CL-0 profile (+7 keys) and is therefore NOT dark-inert | that `null` is the right form for the seam, and that L-DEFAULT's hunk 2 is content to name the successor **here** | `$SC/lh1/probe-preset-identity.mjs` · `simulationRules.js` constant comment · pins 1–2 | **HIGH** — it re-cuts the brief |
| 2 | the birth door is a NEW sibling of `ensureWorldState`, not an edit to `createDefaultWorldState` as the brief directs | that `:317/:527/:530` were rightly left unedited, and that a door beside `ensureWorldState` is the shape L-DEFAULT wants | `worldState.js` `createNewCampaignWorldState` + its ⛔ block · mutant M2 | **HIGH** |
| 3 | the wiring and load-path invariants are pinned by SOURCE contract, because their behavioural halves are vacuous while the successor is null | that a source contract is acceptable here, and that the `executable()` stripper is the right cure for finding 10.3 | pins 6–7 · `$SC/lh1/m1.log`, `m2.log` | MEDIUM |
| 4 | the +7 profile-key cost is DECLARED in the source and tripwired, rather than deferred to L-DEFAULT's own discovery | that this is the right home for the declaration, and that the register owes the shift on the day the constant moves | commit `408d2e2b1` message · pin 2 · mutant M3 (`$SC/lh1/m3.log`) | MEDIUM |
| 5 | the CAR 9 fixture is a SCRATCH artifact, not a committed `tests/fixtures/` file, so CAR 9 pays the fixture's censuses once | that CAR 9 should mint `preset-lighting-witness.json` from this artifact rather than this car committing one | `$SC/lh1/birth-fixtures-p1.json` · `$SC/lh1/birth-fixture-p1.mjs` | LOW |
| 6 | committed with `--no-verify` | that the hook's work was done by hand instead: eslint exit 0 on all four files, and `tests/lint/sizeBaseline.test.js` green inside the whole-dir run, so no `eslint --fix` re-stage could have hidden anything | §4 | LOW |

**Dock tip: `408d2e2b171b521cebe086e9c8e86e35f517f538`.**
