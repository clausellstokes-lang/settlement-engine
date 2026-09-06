# RECEIPT — lane L-DEFAULT (`LGT-C2-DEFAULT`), Opus 5 implementer, chair Fable 5.1

**STATUS: PARTIAL — hunks 1 and 1b landed; hunk 2 in recon.**
Re-dispatched 2026-09-06 ~07:45 after the predecessor session hit its usage-window limit at 05:52.

## STATE ON ARRIVAL (CONFIRMED, measured in-shell at 07:41)
Dock `$SC/laneLDEFAULT` HEAD `fd36f0298` == `claude/composite-r4`; zero cars; porcelain exactly the 3 modified files the brief predicted; `$SC/HOLD-VITEST` absent; load 2.25/2.72/3.35.
The predecessor left hunk 1 EDITED AND UNCOMMITTED. I re-derived every premise myself before committing it; nothing below is inherited unverified.

## OUTCOME TABLE
| # | Hunk | Premise measured | Cure or refusal | sha |
|---|------|------------------|-----------------|-----|
| 1 | Class C+D into the lit default | 21 keys, every one VIRTUAL (absent from `DEFAULT_SIMULATION_RULES`; `RULE_COMPARISON_KEYS` is *derived* from that surface at `simulationRules.js:1156-1167`, so absence is by construction). Identity held 3 ways. Comment fence: `*Enabled` token set 95 → 95, zero added. Comment repairs line-count-neutral (2→2, 2→2, 1→1); only line-count change is the 25-line lit entry. | **LANDED** | `432ff6441` |
| 1b | Witness re-record + golden-shift ledger | Exactly 1 row of 8 moved, 7 fields; `__birth_default__` UNMOVED. Not a register act (no capture arm, no env; freeze register untouched and still `frozenAt: null`). | **LANDED** | `f7a78711d` |
| 2 | O-1 birth form | (in recon) | — | — |

## THE SHIFT — per preset, per cause (evidence for the chair's declaration sentences)

**The one surface that moved: `preset-lighting-witness`, one row of eight.**

| field | before | after | reading |
|---|---|---|---|
| `ruleKeyCount` | 37 | 58 | +21, exactly the keys lit |
| `litFlagCount` | 12 | 33 | +21, exactly the keys lit |
| `darkFlagCount` | 13 | 13 | unmoved — nothing darkened |
| `rulesSha256` / `bornWorldSha256` / `worldStateSha256` / `wizardNewsSha256` / `settlementUpdatesSha256` | — | — | all five moved |
| `regionalGraphSha256` | `ccc6ccbf…` | `ccc6ccbf…` | **unmoved** — the witness realm is hand-built, never generated |
| `resolvesBirthConstant` / `advanceEpochLit` / `observedTicks` / `status` | — | — | all unmoved |

Rows `__birth_default__`, `quiet_local`, `dramatic_campaign`, `static_campaign`, `narrative_campaign`, `living_realm`, `full_simulation`: byte-identical, verified field by field.

**⭐ THE SHARPEST FACT — hunk 1's live reach is NARROWER than "every new world", and the source comment does not draw the line (the ledger entry now does).**
`__birth_default__` did not move because it resolves `NEW_CAMPAIGN_SIMULATION_PRESET_ID`, still `null`, and the tree's one plain campaign-birth call (`campaignImportedCreation.js:56`) passes no preset id. **`DEFAULT_SIMULATION_PRESET_ID` has ZERO consumers in `src/` outside its defining file** — it is the INFERENCE fallback, never a birth selector.
- **LIVE TODAY** (reached by the LITERAL id): `composeInstantWorld.js:402` fallback tone; `worldPlan.js:92` `DEFAULT_TONE`; `temperamentPresets.js:38,42` (`steady_realm`, `the_long_winter`); explicit "Realistic" pick in the dialog / `WorldMapToolbar.jsx:576`.
- **STILL DARK**: the plain `buildNewCampaign` birth path. It lights at hunk 2; `__birth_default__` is the row that will move then.

**Certification grade table — unmoved keys.** `darkFlagCount` held at 13 across the move, so no key was darkened; the 21 lit keys were all previously *virtual* (in neither the lit nor the dark census), which is why the dark count did not fall.

**The birth price (declared-shift sentence (v)/(xi) evidence).** Naming this preset materializes **28** keys (30 → 58) = 7 profile axes + 21 gates, up from **7** (30 → 37). CAR 1's tripwire fired one hunk EARLIER than its own paragraph predicted — at the *lighting*, not the *naming* — because the price is a property of the PRESET, not of the constant that names it. Old figure kept verbatim beside the new one; split asserted separately.

**`soakScriptSeams` leak-under-overlay**: `realistic_regional` 33 → 12, stated as arithmetic (all 21 were already full_simulation keys, 33 − 21 = 12), not as a captured figure.

**Surfaces that did NOT move.** `generatorGoldenMaster`: **525 rows moved at BASE `fd36f0298` and 525 with the edit — identical.** This is a PRE-EXISTING red the chair has banked since §901 (the golden-master row); it is not mine and not a STOP. The brief's "a move on either arm is a STOP" applies to a move MY HUNK causes, and a base-equal count rules that out. Mechanism lit-coverage denominator: 95 → 95. Pulse HASH goldens: predicted 0 rows (they drive literal rules objects) and held.

## ASK THE CHAIR
1. **The rung for step 7.** Rung 18 landed at §902; rung 19 is spoken for by the ninth exemption's retirement. The 25-key re-key therefore needs **rung 20, or a merged migration with 19**. I will not mint a rung. Please rule before I reach step 7.
2. **DECISION (i) — the birth price of a lit preset. DECLARED, with a corrected figure.** The addendum carried +7; the measured price at a *lit* preset is **+28 (30 → 58)**, because lighting happens before naming. I declare the cost rather than choosing a non-materialising successor — the +21 are virtual gate keys, never profile axes, so the CL-0 constitutional law stays intact for campaigns that never name a preset. **Veto point:** if the chair wants the birth price held at +7, hunk 2 must name a successor that does NOT spread the lit default.
3. **DECISION (ii) — `advanceEpochEnabled` vs `clock.js:79`.** Not yet measured; it belongs to hunk 5 (class E). Reported at that hunk.
4. **The same-commit adjacency of hunk 1b.** The witness discipline says a row moves in the same commit as the change that moved it. Hunk 1b is one commit later because the predecessor died before measuring the witness and the fences forbid `--amend`. Substance met, adjacency not. The chair's to veto.

## PROOFS (every exit captured in-shell, never from a notification)
- `npx eslint` on the three touched files — **exit 0**.
- Mutex, `npx vitest run` over `simulationRulesPreset.stability`, `soakScriptSeams`, `engineGatedRuleKeys.walker`, `mechanismLitCoverage` — **4 files, 53 tests, exit 0** (`ldefault-scratch/h1-proof1.log`). Load at launch 2.29/2.44/3.08.
- Mutex, `npx vitest run` over `presetLightingWitness`, `goldenFreeze.walker`, `enforcement-claims` — **118 tests, 117 passed, exit 1** (`ldefault-scratch/h1b-proof.log`). Load at launch 2.56/2.66/2.98. The one red is `enforcement-claims :: every completeness claim carries an @enforced-by tag with ≥1 target`, **BANKED DEBT** at `scripts/.test-ratchet-baseline.json:26`, cause measured 2026-09-01 at `bf902c59f` naming exactly six sites. The run named exactly those six; my ledger entry adds NONE, and the `FROZEN_NAKED` per-claim arm that catches a seventh **PASSED**. The entry was written against that census's own regex before staging.
- `tests/lint/` DIRECTORY RUN: **OWED — not yet run by me.** (Predecessor's 05:52 run at the pre-commit tree: 140 files / 2194 tests green, `ldefault-scratch/lintdir1.log`. That is inherited, not mine.) I will run it before reporting done. No car has added, renamed or deleted a file under `src/` or `tests/` so far — all edits are modifications.

## RETROVALIDATION ROW (preamble requirement)
- **What was judged:** (a) that hunk 1's 21 keys are safe on a LEGACY preset id because virtuality makes identity untouchable; (b) that re-recording `preset-lighting-witness` is NOT a register act and is within a lane's authority; (c) that the predecessor's inherited source comment is true but incomplete, cured by prose in 1b rather than by an amend.
- **What the Fable chair must re-derive:** (b) above is the load-bearing one — confirm that a hand re-record of an unfrozen, capture-armless golden is a lane act and not a chair act. Also re-read the (i) decision: I moved the declared birth price from the addendum's +7 to a measured +28.
- **Receipts by path:** `ldefault-scratch/p1.mjs` (premise measurement), `h1-proof1.log`, `h1b-proof.log`, `h1-witness.log` (the pre-record red, showing the move), `witness-rows-new.json`, `base-control.log` / `base-rows.txt` / `mine-rows.txt` (the golden-master base-equal control).
- **Priority:** HIGH on (b); MEDIUM on the +7 → +28 correction, since hunk 2 spends it.

## DOCK TIP
`f7a78711d` · cars over `fd36f0298`: **2** · porcelain **0**
