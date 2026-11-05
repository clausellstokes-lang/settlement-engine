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
