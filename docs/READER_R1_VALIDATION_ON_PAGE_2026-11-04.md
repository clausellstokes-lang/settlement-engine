# READER R1 — VALIDATION-ON-PAGE (+ GAPS-VS-RECORD), 2026-11-04/05

> Lane `lane/reader-validation-on-page-2026-11-04`, cut from `lane/window-rung2-2026-11-04` at `3bc72bc0` (the rung-2D tip, which contains the brief's base `6a9fb3ca`). A fix seat's record. No signed record is taken and nothing is refrozen.

## 1. Measure first (unit 1)

**The base, 60 births** (`node scripts/audit/soak-review.mjs --count 60 --workers 4 --out artifacts/r1-base`): `reader:validation-on-page` **60 of 60**, 163 occurrences (overview 11 · resources 59 · viability 23 · **pdf 70**). Sub-cases: gaps 59 · viability-count 12 · structural 8 · requires-on-water 3. The PDF carries the largest share, so the cure had to reach the PDF view model too (§3, judgement J1).

**Which check wrote each line, and what the record says.** Every line in the three blocks of the six births (`corpus.mjs :: birth`). "Answered by" names the record field that holds the input; a FALSE gap is one the record answers.

| seed | block | line at the base | writer | answered by (record field) | verdict |
|---|---|---|---|---|---|
| soak1k-0 thorp · mountain/port | Overview Structural Issues + Viability Structural Crises | "Alpine Pastures: Alpine Pastures is not compatible with port access." (and Mineral Hot Springs) | `structuralValidator` `resource_access_violation` | `config.terrainType` = mountain: the pasture is on the terrain; the route is not its home | rule text |
| soak1k-0 | Overview Suggestions | "A port settlement without dock facilities cannot service the ships… Consider: Docks/port facilities." | `structuralValidator` suggestion | — | generator advice |
| soak1k-0 | Resources Gaps | "Access to external mill exists but lacks access to grain" | `resourceGenerator :: evaluateInstitutionChain` lacks-access | food record `normalImportPct` 17% (port trade) | FALSE |
| soak1k-4 city · desert/crossroads | Resources Gaps | "Caravanserai exists but lacks access to camel_herds" | lacks-access | `config.tradeRouteAccess` crossroads; the house carries the `transport` tag | FALSE |
| soak1k-4 | Resources Gaps | "Smelter exists but lacks access to iron ore / copper ore / gold/silver ore" (3 lines) | lacks-access | `economicState.primaryImports` "Iron" | FALSE |
| soak1k-4 | Resources Gaps | "Public bathhouse … hot_springs_mineral"; "Potter … clay"; "Brickmaker … clay" | lacks-access | nothing (no springs near, none imported; no clay) | TRUE |
| soak1k-12 thorp · mountain/crossroads | Resources Gaps | "Access to external mill exists but lacks access to grain" | lacks-access | `economicState.localProduction` "grain"; food sources [grain] | FALSE |
| soak1k-12 | Viability verdict | "1 critical issue prevents settlement survival." beside no Critical Issues block | `viability.js :: buildViabilitySummary` vs the tab's filter | `issues[severity=critical]` = 1 = `metrics.criticalIssueCount`; the tab dropped `type=stress_consequence` | count DISAGREES |
| soak1k-24 thorp · coastal/crossroads, siege | Overview Suggestions | "Frontier region: even small settlements benefit from a palisade… Consider: Palisade or earthworks, Citizen militia." | `structuralValidator` suggestion | — | generator advice |
| soak1k-24 | Resources Gaps | "Access to external mill exists but lacks access to grain" | lacks-access | `economicState.primaryImports` "Grain" | FALSE |
| soak1k-24 | Viability verdict | "2 critical issues prevent settlement survival." · "Critical Issues (1)" · pill "2 critical" | `buildViabilitySummary` vs the tab's filter | `metrics.criticalIssueCount` 2 (the siege stress consequence is critical) | count DISAGREES |
| soak1k-24 | Viability Critical Issues | "…(67% of needs) and has no dependable trade route." | `foodBalance.js` uncovered-deficit arm (the siege overrides the route to isolated) | `config.tradeRouteAccess` crossroads | FALSE (a route that is cut) |
| soak1k-8 village · coastal/mountain_pass | Resources Gaps | "Mill exists but lacks access to grain" | lacks-access | `localProduction` "grain"; food sources [grain, fish]; grown 102%; exports "Grain surplus" | FALSE |
| soak1k-8 | Resources Gaps | "Sawmill … timber" + "… mountain_timber"; "Potter … clay" | lacks-access | nothing | TRUE (sawmill, potter) |
| soak1k-22 city · coastal/river | Resources Gaps | "Bakers exists but lacks access to grain" | lacks-access | `primaryImports` "Grain" (the city grows 62% and imports 37%) | FALSE |
| soak1k-22 | Resources Gaps | "Public bathhouse exists but lacks access to hot_springs_mineral" | lacks-access | `config.nearbyResources` hot_springs; `primaryExports` "Healing waters (bottled)" | FALSE |
| soak1k-22 | Resources Gaps | "Salt works exists but lacks access to desert_salt" | lacks-access | `localProduction` "salt" | FALSE |
| soak1k-22 | Resources Gaps | "Smelter … iron ore / copper ore / gold/silver ore" | lacks-access | `primaryImports` "Iron ore (local mines exhausted)" | FALSE |
| soak1k-22 | Resources Gaps | "Charcoal burner … mountain_timber" | lacks-access | `primaryImports` "Ritual wood and herbs" | FALSE |
| soak1k-22 | Resources Gaps | "Potter … clay"; "Brickmaker … clay"; "Vintner … grapes" | lacks-access | nothing | TRUE |

**The mechanism of the false gaps.** `resourceGenerator.js :: evaluateInstitutionChain` walks every institution against every chain in `RESOURCE_CHAINS` whose `processingInstitutions` names it, and prints "lacks access" whenever that chain is not in the ACTIVE list. A chain is active only when the TERRAIN's `allowedResources` permits it AND a nearby resource reconciles with its `rawResource` string. So a grain chain on a coastal terrain is never active, whatever the village grows; `hot_springs` never reconciles with `hot_springs_mineral`; and nothing in the rule reads imports, exports, local production or the food record. The rule asks the catalogue, not the place.

**The viability count.** The summary (`buildViabilitySummary`) and `metrics.criticalIssueCount` count every `severity: critical` issue, a critical stress consequence included; the tab's Critical Issues list (and the PDF's `criticalIssues`) dropped `type: stress_consequence`. Two lists for one count.

## 2. The cure (unit 2) — what reads what now

One home, `src/domain/display/validationOnPage.js`, read by the three tabs and by the PDF view model (`src/pdf/lib/viewModel.js :: viabilitySlice`, `overviewSlice`; `src/pdf/lib/viewModelBodySlices.js :: resourcesSlice`), and through the view model by the Foundry journal's Viability page. Render-time only: the record is untouched (the three-birth hash check in §4).

- **Ruling 1, validation text never renders on a DM surface.** Cut from the DM page: the Overview's "Structural Issues" and "Suggestions", the Viability tab's "Structural Crises", the Resources tab's priority notes; the PDF's structural violations, structural suggestions, raw gap rows and priority notes. The rows stay on the record and print on ONE staff surface: the Viability tab's **"Generator checks (staff) (N)"** section (`staffValidationRows`), for an elevated viewer (developer / admin, `isElevated`, the WarTab / RumorsTab seam) and never on the player view or a public dossier. Proof: `tests/components/readerValidationOnPage.test.js` renders the three tabs for a non-staff viewer on four births and finds no validator sentence; the staff case finds the panel and the row.
- **Ruling 2, one count, one home.** `criticalIssuesOf(v)` is the record's critical issues, the list `metrics.criticalIssueCount` and `buildViabilitySummary` already count (a critical stress consequence included). The tab's "Critical Issues (N)", the verdict sentence and the "N critical" pill now read the same N; "Active Stress Effects" holds only the non-critical stress consequences (`stressEffectsOf`). The PDF lists every critical issue once. A priority note two critical rows share prints once.
- **Ruling 3, the gaps read the record.** `resourceGapLines(s)` prints a gap only when the record holds none of the house's inputs. Inputs are named per CHAIN (`CHAIN_INPUTS`, keyed by `RESOURCE_CHAINS`' keys, never by an institution's name) and answered by: `economicState.localProduction`, `primaryImports`, `primaryExports`; the nearby resources that are not depleted (`availableNativeResourceKeys`) and their catalogue commodities; the food record's `foodSources`, and for the staple its `normalImportPct` (ordinary supply); a connected `tradeRouteAccess` for a house whose catalogue tags are `market` or `transport`, and for the camel chain. A house with several inputs is idle only when none is answered (a smelter with iron ore coming in is not idle for want of gold). A raw resource no house works is not printed when the economy exports it.
- **Ruling 4, the route.** `viabilityIssueText` keeps "has no dependable trade route" only where `tradeRouteAccess` is disconnected; on a connected route (the siege overrides it to isolated inside `foodBalance.js`) the clause reads "and its trade route is cut."

**The new DM-facing sentences (recorded as the chair's rulings):**

| where | sentence | when |
|---|---|---|
| Resources "Gaps & Opportunities" + PDF Resources | "No {input} reaches the {house}." / "No {inputs} reach the {house}." (e.g. "No clay reaches the potter.", "No grapes reach the vintner.", "No water from the hot springs reaches the public bathhouse.") | the record holds none of the house's inputs |
| same | "No one here works the {resource} near {settlement}." | a raw resource is near and active, no house works it, and the economy does not export it |
| same | "Work on the {resource} here stops half-way: no {house or house} finishes it." | a chain is worked by one processor of the two it needs |
| Viability "Critical Issues" + PDF + Foundry | "…(N% of needs) and its trade route is cut." | the uncovered-deficit issue on a connected route (a siege) |
| Viability, staff only | "Generator checks (staff) (N)" | an elevated viewer; not a DM sentence |

**Judgements taken (vetoable):**
- J1. The PDF view model is cured with the tabs, outside the brief's named files: the PDF carried 70 of the 163 base occurrences, so a tabs-only cure could not meet the bar. The Foundry journal follows through the view model; nothing in `src/foundry` was edited. No pool file was touched.
- J2. The structural suggestions ("Consider: …") and the resource priority notes ("Strong economic focus creates pressure…", "Military focus highlights gap…") are the generator's advice and its sliders, not facts; they moved to the staff panel with the violations.
- J3. The count is unified by LISTING the critical stress consequence, not by re-counting the summary: the verdict "Not viable" stands on that issue (famine-only `soak1k-12` would otherwise read "Not viable" over an empty list).
- J4. The unexploited / partial gap rows are re-voiced too (they were rule-shaped: "Raw resource available but not being processed"), and the generator's duplicate chains (`glass sand` / `glass_sand`, `timber` / `mountain_timber`) print once.
- J5. The staff panel lives on the Viability tab only (one surface for all four row kinds), open by default for the staff viewer.

## 3. The instrument (unit 3) and the measurement

`readerBattery.js :: validationOnPageFindings` keeps its four sub-cases and gains **`[gap-vs-record]`**: a gap line in either voice (the generator's "X exists but lacks access to Y", the house's "No Y reaches the X.") whose good the record holds (production, imports, exports, non-depleted nearby keys, food sources; grain also by ordinary supply). It is its own simple reader (a word in common), deliberately not the cure's table; it reads "precious stones" as gems.

**The 60:** base 60 of 60 (163 occurrences) → after **0**. The X-50 boilerplate raised by the first cure (a shared priority note under two critical rows, 3 seeds) was cured in `f93bcd2`; the after-60 reads X-50 0.

**The 1,000** — "before" is the base `56b3788` with the unit-3 instrument copied in and no cure (scratch worktree); "after" is `cf7cbb3`. Rendered 1,000 / errors 0 both.

| sub-case | before (thorp/hamlet/village/town/city/metro) | after |
|---|---|---|
| **reader:validation-on-page** | **985** (160/162/165/167/165/166) | **0** |
| gaps | 977 (154/161/165/167/164/166) | 0 |
| gap-vs-record | 782 (80/80/130/167/159/166) | 0 |
| viability-count | 173 (32/39/30/23/24/25) | 0 |
| structural | 117 (29/17/22/20/12/17) | 0 |
| requires-on-water | 23 (7/6/1/5/1/3) | 0 |

Surfaces before: pdf 1,899 · resources 1,759 · viability 313 · overview 140 occurrences; after: none. Every other reader class is identical before and after (relation-types 647, daily-life-placeholder 495, scale-lists 156, traditions-water 150, rule-text 148, tonight-wants 128, hook-pools 113, possessive-slip 93, tension-memory 60). Finding classes: `coh:crisis-blind-prose` 278 → 278 (the base's own level, unmoved), `A-05:lacks-access-lines` 977 → 0, `info:battery-would-not-vouch` 691 → 691, `A-12` 18 → 18, `A-09` 8 → 8; no `cert:` class either side.

**The first 1,000 after unit 3 (`451689f`) read 9 and raised A-11 1**; the three causes were cured in `cf7cbb3`: the plural ("Mineral salts" answers salt; 8 seeds, soak1k-249/-297/-453/-99/-801/-63/-107/-615), the instrument's "precious stones" (soak1k-316, a true gap), and A-11 reading the house-voice lack under F5's licence (soak1k-992, a desert fishmonger: "No fish reaches the fishmonger.").

## 4. Reds, registers, goldens

- **Record hashes, three births, base vs lane** (`corpus.mjs :: sha(birth(i).settlement)`): soak1k-0 `d615804a8c4592dd`, soak1k-8 `33ff8c56ae106813`, soak1k-24 `b51d754bd3e4690d` — identical. Render-time only: no generator golden, prose manifest or census row moves by a record.
- **Governing suites** (108 files naming a changed module): 47 failed at the base, the same 47 by title at the tip, none new. Pins rewritten to the ruling (they pinned the cut blocks): `g5FirstSurveyCopy` ×2, `pdfParityFixes` pdf-3, `generalDeskTabFlow` DS-GEN-7, `tabs.smoke` ×2.
- **Register rows moved inside walkers already red at the base (listed, not refrozen):** `observedShapeReaders.walker` +6 stale rows, all from reads the cure removed — 3 "lawful repair" (`viewModel.js` stressConsequences on economicViability; `viewModelBodySlices.js` structuralGaps on resourceAnalysis and on settlement) and 3 "instrument erosion" classifications of the same removals (`viewModel.js` criticalIssues and structuralSuggestions on economicViability; `viewModelBodySlices.js` priorityNotes on economicViability); `rawColorLiteral` 1,230 → 1,229 (an unbanked shrink, the cut blocks' borders).
- `typecheck:domain:strict` reds on `crisisFactFindings.js` +4 at the base and here (not this lane's); `typecheck:ratchet` OK 167/167; eslint clean on every touched file.
