# RECEIPT — lane L-DEFAULT (`LGT-C2-DEFAULT`), Opus 5 implementer, chair Fable 5.1

**STATUS: DONE for this dispatch. Hunk 1 is COMPLETE in four cars; hunks 2–7 are REFUSED WITH MEASUREMENT, every one of them gated on an act reserved to the chair or the owner.**
Re-dispatched 2026-09-06 ~07:45 after the predecessor hit its usage-window limit at 05:52.

## OUTCOME TABLE
| # | Hunk | Premise measured | Cure or refusal | sha |
|---|------|------------------|-----------------|-----|
| 1 | Class C+D into the lit default | 21 keys, every one VIRTUAL; `RULE_COMPARISON_KEYS` is *derived* from `DEFAULT_SIMULATION_RULES` (`simulationRules.js:1156-1167`), so absence is by construction, not by claim. Identity held 3 ways. Comment fence: `*Enabled` token set 95 → 95. Comment repairs line-count-neutral (2→2, 2→2, 1→1). | **LANDED** | `432ff6441` |
| 1b | Witness re-record + shift ledger | 1 row of 8 moved, 7 fields; `__birth_default__` UNMOVED. Not a register act. | **LANDED** | `f7a78711d` |
| 1c | Compendium artifact regenerated | **A red hunk 1 CAUSED**: 19 of the 21 keys are Compendium systems; the committed artifact went stale on both freshness arms. | **LANDED** | `a2f135cd4` |
| 1d | Lived-experience preset census 3 → 4 | **A second red hunk 1 CAUSED**: a literal three-preset roster for `traditionsEnabled`. | **LANDED** | `6ff3249b9` |
| 2 | O-1 birth form (lit successor id) | Mints a **PUBLIC, PERSISTED** preset identifier. Brief supplies neither id nor label. | ⛔ **REFUSED — owner-gated** | — |
| 3 | Class B into lit successors | Requires hunk 2's id. | ⛔ **REFUSED — gated on 2** | — |
| 4 | O-2 `infoMode: 'perfect_delayed'` | Paid-surface behaviour (`campaignWorldPulseSlice.js:391` premium gate); second half needs hunk 2. | ⛔ **REFUSED — owner-gated** | — |
| 5 | Class E `false → true` | **PROVED impossible on a legacy id** (below). | ⛔ **REFUSED — gated on 2** | — |
| 6 | Classes F + G (25 keys) | Lighting them makes 25 keys **discoverable**, which GROWS the OSR; growth needs the governed migration and a rung. | ⛔ **REFUSED — gated on the rung** | — |
| 7 | `LGT-P15-EP1` half (a) | Needs rung 20 or a merged migration. Never mint a rung. | ⛔ **REFUSED — chair's rung** | — |

## ⛔ THE REFUSALS, WITH THE NUMBERS

**Hunk 5 is not merely ordered after hunk 2 — it is IMPOSSIBLE on the legacy default, and I proved it by execution** (`ldefault-scratch/p3.mjs`). The 13 class-E-shaped keys (false in `DEFAULT_SIMULATION_RULES`, dark on the lit default — and exactly the witness's `darkFlagCount: 13`) are ALL `RULE_COMPARISON_KEYS` members. Lighting each one alone on `realistic_regional`, then asking what a keyless copy of the preset re-infers:

- **11 of 13 → `'custom'`.** The preset stops round-tripping to its own id.
- **`seasonsEnabled` → `'living_realm'`.** ⚠ This is *worse* than `custom`: a silent re-label to a REAL, DIFFERENT preset, which reads legitimate everywhere `custom` would not.
- **`faithSpreadEnabled` alone → `realistic_regional`** (survives) — but the O-12 lockstep requires it paired with `religionDynamicsEnabled`, and **the pair → `custom`**.
- **All thirteen together → `custom`.**

That is the O-12 breach verbatim, now measured on the default rather than argued from the drama preset.

**Hunk 6 is hard-gated on the rung, and the plan says why (§5.2).** The corpus builder discovers flags by regex over `src/domain/**/*.js` and lights every one it finds, so *writing `<x>Enabled: true` into the preset table is itself the discovery event*. The 25 class F+G keys are exactly the "newly discoverable" set. Growth on the OSR goes through the governed migration — `--write` may only shrink, `--update` is FORBIDDEN. I have no rung and will not mint one.

**Hunk 2 is the owner-gated atom.** A `presetId` is persisted into every save written under it, so under THE PROMISE the identifier is permanent and un-renamable the day one world is born with it. The brief names neither the id nor the label. Its measured bill, beyond the identifier itself: a new witness manifest row + `presetRosterWhenRecorded` + `birthSuccessorPresetIdWhenRecorded` + a MOVED `__birth_default__` row; a new key in `soakScriptSeams`' exact-object leak table; my own `4 lit + 3 dark == PRESET_IDS` anti-vacuity; a second compendium regeneration; a UI decision (the dialog's `GRID_PRESETS` and the toolbar's three chips both enumerate by literal); and a second OSR input drift. **⚠ The brief's own wording is ambiguous and I will not guess:** "a lit SUCCESSOR id AFTER the legacy trio in key order" reads either as *mint a new id* (which the O-12 block requires, since hunk 3 needs an id no installed world carries) or as *point the birth constant at an existing lit preset*. Those are different acts with different blast radii.

## THE SHIFT — per preset, per cause

**One same-seed surface moved: `preset-lighting-witness`, one row of eight.**

| field | before | after | reading |
|---|---|---|---|
| `ruleKeyCount` | 37 | 58 | +21, exactly the keys lit |
| `litFlagCount` | 12 | 33 | +21, exactly the keys lit |
| `darkFlagCount` | 13 | 13 | unmoved — nothing darkened (and these 13 are the class-E set above) |
| `rulesSha256`, `bornWorldSha256`, `worldStateSha256`, `wizardNewsSha256`, `settlementUpdatesSha256` | — | — | all five moved |
| `regionalGraphSha256` | `ccc6ccbf…` | `ccc6ccbf…` | **unmoved** — the witness realm is hand-built, never generated |
| `resolvesBirthConstant`, `advanceEpochLit`, `observedTicks`, `status` | — | — | all unmoved |

The other seven rows are byte-identical, verified field by field against committed bytes.

**⭐ THE SHARPEST FACT: `__birth_default__` DID NOT MOVE.** It resolves `NEW_CAMPAIGN_SIMULATION_PRESET_ID`, still `null`, and the tree's one plain campaign-birth call (`campaignImportedCreation.js:56`) passes no preset id. **`DEFAULT_SIMULATION_PRESET_ID` has ZERO consumers in `src/` outside its defining file** — it is the INFERENCE fallback, never a birth selector, which is exactly why identity held.
- **LIVE TODAY** (reached by the LITERAL id): `composeInstantWorld.js:402` fallback tone · `worldPlan.js:92` `DEFAULT_TONE` · `temperamentPresets.js:38,42` (`steady_realm`, `the_long_winter`) · explicit "Realistic" pick in the dialog / `WorldMapToolbar.jsx:576`.
- **STILL DARK**: the plain `buildNewCampaign` birth path. It lights at hunk 2. **So declared-shift sentence (xi), "the shipped default mints epochs", is NOT yet earned** — the shipped *birth* is unchanged.

**Certification grade table, for unmoved keys** (read from the table, never inferred from a hash): `darkFlagCount` held at 13, so no key was darkened; the 21 lit keys were previously *virtual* — in neither the lit nor the dark census — which is why the dark count did not fall.

**Birth price (declared-shift evidence).** 28 keys (30 → 58) = 7 profile axes + 21 gates, up from 7 (30 → 37). CAR 1's tripwire fired one hunk EARLIER than its own paragraph predicted — at the *lighting*, not the *naming* — because the price is a property of the PRESET, not the constant naming it.

**`soakScriptSeams` leak-under-overlay**: `realistic_regional` 33 → 12, stated as arithmetic (33 − 21 = 12), not captured.

**Surfaces that did NOT move.** `generatorGoldenMaster`: **525 rows moved at BASE `fd36f0298` and 525 with the edit — identical**, a pre-existing red the chair has banked since §901; not mine, and not the brief's STOP, which is about a move MY hunk causes. Mechanism lit-coverage denominator 95 → 95. Pulse HASH goldens: predicted 0 and held. **OSR discovered-flag set: 81 at base, 81 at my tip, zero added, zero removed** (`ldefault-scratch/disc.mjs`) — so my cars caused **no OSR growth**, only the one input drift below.

## ASK THE CHAIR
1. **⛔ AN OSR RE-FREEZE IS OWED AND IT IS YOURS.** `tests/lint/observedShapeReaders.walker.test.js` reds on my tip: `drift.inputs = ["src/domain/compendium/generated/compendiumData.generated.js"]`, caused by car 1c. **`drift.detectorSources` is EMPTY** — so this is the LAWFUL class, and the walker's own message says it: "an execution INPUT drifted since the mint — lawful, and the shrink-only re-freeze absorbs it". **It does NOT need a rung or a migration.** A shrink-only re-freeze is a plain `--write`, a register act reserved to you at the landing. The walker's own history comment names "the generated compendium" as a prior member of this same class.
2. **The rung for step 7** — rung 20, or merged with rung 19. I minted nothing.
3. **DECISION (i), the birth price: DECLARED, with your figure corrected.** The addendum carried +7; the measured price at a *lit* preset is **+28 (30 → 58)**, because lighting precedes naming. I declare the cost rather than choosing a non-materialising successor: the +21 are virtual gate keys, never profile axes, so CL-0 stays intact for campaigns that never name a preset. **Veto point:** to hold the price at +7, hunk 2 must name a successor that does not spread the lit default.
4. **DECISION (ii), `advanceEpochEnabled` vs `clock.js:79`: NOT SPENT.** It is one of the 35 still-dark virtual keys and is identity-safe on a legacy id, but §5.3 of your own plan says the EP-1 release does NOT ride this car. Unchanged, and named.
5. **Hunk 1b's same-commit adjacency.** The witness discipline says a row moves in the commit that moved it; 1b is one commit later because the predecessor died before measuring it and the fences forbid `--amend`. Substance met, adjacency not.
6. **A LEGIBILITY FINDING, reported not fixed (copy is owner-signed).** The public Compendium now shows Realistic Regional lighting **19** systems — the same count as Full Simulation, MORE than Living Realm's 18 — while its summary still reads "The default. The region evolves at a measured, realistic pace." The presets still differ sharply, but in keys the Compendium does not surface as systems.
7. **THE BRIEF'S READ-FIRST PATH IS WRONG.** `git show refs/preserve/light-plan-2026-09-05:PLAN.md` does not exist; the file is at **`lightingwave/PLAN.md`**. `git cat-file -e` exits 128 on the brief's spelling. Worth fixing before the next lane loses time on it.

## PROOFS (every exit captured in-shell, never from a notification)
| proof | result | log |
|---|---|---|
| `npx eslint` on hunk 1's three files | **exit 0** | — |
| mutex · stability, soakScriptSeams, engineGatedRuleKeys.walker, mechanismLitCoverage | **4 files, 53 tests, exit 0** | `h1-proof1.log` |
| mutex · presetLightingWitness, goldenFreeze.walker, enforcement-claims | 118 tests, 117 passed, **exit 1** — the ONE red is banked debt (below) | `h1b-proof.log` |
| `node scripts/generate-compendium-data.mjs` | **exit 0**, one file written | — |
| mutex · compendiumDataFreshness | **10 tests, exit 0** (both previously-red arms green) | `compendium2.log` |
| `npx eslint` on hunk 1d's three files | **exit 0** | — |
| mutex · livedExperience {Sources, Funnel, Catalog}, acceptanceCharacterReads | **4 files, 166 tests, exit 0** | `h1d-proof.log` |
| mutex · consumer sweep batch 1 (12 suites incl. litBurndown, composeInstantWorld, baseStateCapsule, campaignRuntimeLazy, controlBytes, subsystemCertification, temperamentPresets) | **12 files, 181 passed, exit 0** | `h1-sweep1.log` |
| mutex · consumer sweep batch 2 (12 suites incl. all 8 subsystemRows, tickScanBudget) | **exit 1** → the single red was livedExperienceSources, CURED by car 1d | `h1-sweep2.log` |
| mutex · consumer sweep batch 3 (infoModeUnlock, characterDrift, readerCorpusManifest, stability, soakScriptSeams, witness) | **6 files, 114 tests, exit 0** | `h1-sweep3.log` |
| **`tests/lint/` DIRECTORY RUN (owed by the preamble)** | **exit 1 — 139 of 140 files passed, 2193 of 2194 tests** | `lintdir-mine.log` |

**The `tests/lint/` failing-arm list, in full — ONE arm:** `observedShapeReaders.walker.test.js > reader-with-no-writer ratchet: the live scan > the provenance drift classifier separates a detector change from an input change > THE LIVE ESTATE INSTANCE: a freshly re-minted baseline has NO drift at all`. Cause, class and owner are ASK-THE-CHAIR item 1. It was **green at 05:52 before car 1c** (predecessor's `lintdir1.log`: 140/140, 2194/2194), so it is mine, it is the lawful class, and its cure is yours.

**The other standing red, and why it is not mine:** `enforcement-claims :: every completeness claim carries an @enforced-by tag with ≥1 target` is BANKED DEBT at `scripts/.test-ratchet-baseline.json:26`, cause measured 2026-09-01 at `bf902c59f` naming exactly six sites. My run named exactly those six; my ledger entry adds NONE, and the `FROZEN_NAKED` per-claim arm that catches a seventh PASSED. The entry was written against that census's own regex before staging.

## STRUCTURAL NOTE — how the two extra reds were found, and the class closed
Neither `compendiumDataFreshness` nor `livedExperienceSources` is named by the brief, by the plan's test list, or by any gate I was told to run. Both were found by asking *who closes over per-preset flag membership* before writing hunk 2 — the lifecycle question, not the test question. After the second one I stopped guessing and scanned structurally: of every file in `tests/`, `src/`, `scripts/` carrying a preset-list literal, exactly **four** also name one of the 21 lit keys — `simulationRules.js`, `simulationRulesPreset.stability.test.js`, `livedExperienceSources.test.js`, `compendiumData.generated.js` — and all four are cured. **The class is closed, by scan and not by hope.** A lane that had run only its brief's test list would have shipped a stale public artifact behind two green single-file runs.

## RETROVALIDATION ROW
- **What was judged:** (a) hunk 1's 21 keys are safe on a LEGACY id because virtuality makes identity untouchable; (b) re-recording `preset-lighting-witness` by hand is NOT a register act and is within a lane's authority; (c) regenerating `compendiumData.generated.js` is a lane act (the suite's own header prescribes it) even though it drifts an OSR input; (d) the predecessor's inherited source comment is true but incomplete, cured by prose in 1b rather than by a forbidden amend; (e) hunks 2–7 are all gated, each refused with a measurement rather than attempted.
- **What the Fable chair must re-derive:** **(b) and (c) are the load-bearing pair** — confirm a hand re-record of an unfrozen, capture-armless golden and a prescribed generator re-run are lane acts, not chair acts. Then the (i) decision: I moved the declared birth price from your +7 to a measured +28. Then the hunk-5 impossibility proof, which is the strongest claim in this receipt and the one that most changes the wave's shape.
- **Receipts by path (all under `$SC/ldefault-scratch/`):** `p1.mjs` (virtuality, identity, birth price, leak table) · `p2.mjs`/`p3.mjs` (the class-E impossibility) · `p4.mjs` (the 35 still-dark virtual keys, each identity-checked) · `disc.mjs` (OSR discovered-flag set, base vs tip) · `h1-proof1.log`, `h1b-proof.log`, `h1-witness.log`, `h1d-proof.log`, `h1-sweep{1,2,3}.log`, `compendium.log`, `compendium2.log`, `lintdir-mine.log` · `witness-rows-new.json` · `base-control.log`/`base-rows.txt`/`mine-rows.txt` (predecessor's golden-master base-equal control).
- **Priority:** HIGH on (b)+(c) and on the OSR re-freeze; HIGH on the hunk-5 proof; MEDIUM on the +7 → +28 correction.

## DOCK TIP
`6ff3249b9` · cars over `fd36f0298`: **4** · porcelain **0**
