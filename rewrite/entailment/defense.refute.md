# THE DEFENSE DESK — REFUTATION PACKET (verdicts on the survey, no ruling)

Refuter seat: Fable 5.1. Dock `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW` at `f2da5a3ee`, READ-ONLY; nothing staged, no suite run, no build. The only executions were two print-only scripts (`scripts/prose-licence-card.mjs` for five DS-DEF-5 pools, and a scratchpad `node` import of `src/data/institutionalCatalog.js` that prints rows). Every `file:line` is the dock tree.

Verdict scale, as the chair set it: **HOLDS** (true for every member and consistent with the engine) · **CONDITIONAL** (true only for named members or only where a named field resolves; condition stated exactly) · **REFUTED** (false for some member or contradicted by the engine; code quoted). Default under doubt is REFUTED or CONDITIONAL.

Survey under review: `rewrite/entailment/defense.survey.md`. The survey is careful and most of its rows survive. What it did not do is read the ROSTER LAWS that decide which members a generated world can actually hold, and those laws move about a third of the verdicts. They are stated once in §1 and cited by letter afterwards.

---

## 1. FIVE ROSTER LAWS THE SURVEY DID NOT READ (they move many verdicts)

### R-A · `required: true` rows are pushed without a draw, and a required row EVICTS a same-group row already drawn

`src/generators/steps/assembleInstitutions.js:283-293`: a row with `inst.required` enters the required branch, which never consults `baseChance`; if its `exclusiveGroup` is already held, the holder is `splice`d out unless `isProtectedGenerationEntity` (a generated row is not: `src/domain/generationOwnership.js:183-194`). A generated row is refused outright when its group is held (`:345-346`, `if (!inst.exclusiveGroupCoexists) return;`). Catalogue iteration is `Object.entries` order (`:255-256`). Consequences, all measured on the catalogue dump (`rewrite/entailment/_catdump.tsv`):

| Tier | Required Defense-relevant rows (catalog line) | What that makes unreachable on a NATIVE roster |
|---|---|---|
| town | `Town watch` req, bc 1, `exclusiveGroup: 'civilianDefense'` (`institutionalCatalog.js:1348-1355`); `Town granary` req (`:925`); `Town hall` req (`:1550`) | **`Citizen militia` at town** — it shares `civilianDefense` (`:1340-1347`), sits BEFORE the watch in category order (`:1340` < `:1348`), is drawn at 0.6 and then spliced by the required watch. `hasWatch` is true on every town; `hasGranary` and `hasCourtSystem` are true on every town. |
| city | `City walls and gates` req (`:1910`, group `defenseLevel`); `Professional city watch` req (`:1918`); `Garrison` req, **no baseChance at all** (`:1925`); `City granaries` req (`:1590`); `City hall` req (`:2268`); `Multiple courthouses` req (`:2275`) | `walls ABSENT`, `UNWALLED-LARGE`, `watch PRESENT`, `militia PRESENT`, `NO organized force`, every `no reserves` pool, `no legal infrastructure`, `detention without process` — all unreachable at city on a native roster (a ruin stamp can later remove the walls: `src/domain/institutions/institutionRoster.js:38-42`). |
| metropolis | the merged catalogue is `{...city, ...metropolis}` per category (`assembleInstitutions.js:117-124`, `:244`), so `City walls and gates` (required, group `defenseLevel`) is iterated BEFORE `Massive walls and fortifications` (generated, same group, no `exclusiveGroupCoexists`: `:2347`) | **`Massive walls and fortifications` never generates.** The threat plan cannot add it either: it adds a fortification only when NONE matches (`src/generators/threatDefensePolicy.js:73-80`), and the required city walls always match. |
| hamlet | `Access to parish church` req, bc 1 (`institutionalCatalog.js:300`; keyword `church` in `priorityHelpers.js:65`) | `hasChurch` is TRUE ON EVERY HAMLET from a church 2-5 km away in another settlement. |
| village | `Parish church` req (`_catdump.tsv` row 41) | `hasChurch` true on every village. |

### R-B · the recorded `desc` is ONE OF UP TO THREE seeded strings

`assembleInstitutions.js:735-747`: `inst.desc = pickVariant([inst.desc, ...variants], seed:name)` over `src/data/institutionDescVariants.js`. A "[RECORDED]" property is recorded only if it survives EVERY variant of the row. Checked for every Defense-relevant row (`institutionDescVariants.js:21-24, 93-108, 441-448, 501-504, 537-545, 673-676, 689-704, 809-832, 1157-1168, 1229-1232`). Where a variant drops a property it is noted at the row.

### R-C · the THREAT PLAN adds defence rows after the draw, on its own regexes

`threatDefensePolicy.js:60-99`: a `plagued` country, or a `frontier` country at town+, forces a fortification when nothing matches `FORTIFICATION_NAME = /\bwall|citadel|garrison|barracks|palisade|earthwork|fortress\b/i` (`:47-48`); a `plagued` country forces a force when nothing matches `MILITARY_FORCE_NAME = /\bgarrison|guard|militia|levy|barracks|mercenary|watch\b/i` (`:49-50`). Preferences per tier at `:10-42` (thorp: `Palisade` + **`Household levy`**). Called twice (`assembleInstitutions.js:38`, `steps/coherenceRepairPass.js:36`). So: a frontier town with no walls and no Barracks is GIVEN `Town walls`; a frontier town holding a `Barracks` is counted as fortified and given nothing (the regex reads `barracks` as a fortification).

### R-D · the military upkeep multiplier is a function of `econOutput` alone and gates unpaid institutions identically

`defenseGenerator.js:189` `milUpkeepMult = min(1, 0.6 + econOutput/50 * 0.4)`; `:190-192` applies it to everything above `communityMilBase`. That base is non-zero ONLY for thorp/hamlet/village (`:138-156`: 6/8/10 + a route bonus + 3 for a church + 3 for a reeve); at town+ it is 0, so the whole score is "the funded portion". `hasWalls +30`, `hasMilitia +10`, `hasWatch +7` (`:160-163`) are gated exactly as `hasGarrison +28`. The gate is recorded whenever `hasAnyDefense` (`:467-470`), which a lone palisade satisfies. The comment says "garrison wages, wall maintenance" (`:182`); the code says "any defence row, any econOutput below 50".

### R-E · custom content never reaches a bucket or a flag; it does reach the criminal classifier

`src/domain/content/customContentSemanticAuthority.js:22-32, 41-48`: `nativeSemanticName` returns `''` for materialized custom content; both `partitionDefenseInstitutions` (`defenseInstitutionBuckets.js:137-138`) and `getInstitutionNames` (`priorityHelpers.js:41-43`) read it. `deriveCriminalStructure` reads raw `.name` (`defenseDisplay.js:185`). Survey C-12 has this right; it is restated because it conditions several rows below.

---

## 2. VERDICTS, ROW BY ROW

### E-1 · `palisade`

| Entailment (survey) | Verdict | Evidence / condition |
|---|---|---|
| timber / wood, tagged [RECORDED] | **CONDITIONAL** | The tag is wrong; the entailment survives as DEFINITIONAL only. The thorp row's own text is *"Sharpened stakes encircling the settlement"* (`institutionalCatalog.js:97-99`) and both variants say *"sharpened stakes"* / *"Pointed stakes"* (`institutionDescVariants.js:673-676`); no wood word on any of the three. The survey's *"wooden"* cite is the hamlet row (`:345`), which is the DISJUNCTIVE row (E-2). AND the engine's supply model feeds a palisade STONE: the `fortification` chain has `resource: 'Stone quarry'`, `rawInputs: ['Quarried stone', 'Building materials']`, `upstreamChains: ['stone']` and `processingInstitutions: ['Palisade', 'Town walls', 'City walls and gates', 'Citadel']` (`src/data/supplyChainData.js:873-884`; the comment at `:880-882` says the `Palisade` prefix reaches the hamlet/village row too). Condition: the bare word only, on a row named `Palisade`; never a material-SOURCE or supply clause ("cut from its own woods"), which the chain contradicts. |
| a continuous enclosure of the settlement | **CONDITIONAL** | Thorp: *"encircling"*, *"ring"*, *"rough circle"* — holds. Village row: *"Perimeter"* / *"around the edge"* (`:877`, variants `:1161-1164`) — holds. Hamlet row: *"Basic wooden palisade or earthwork berm"* and both variants (`:345`, `:445-448`) say nothing about enclosure. Condition: the thorp `Palisade` and the village `Palisade or earthworks` rows; not the hamlet row. |
| a chokepoint / control of approach | **CONDITIONAL** | Recorded on the VILLAGE row only (`:877`); the thorp desc and variants say nothing of approach; the service row *"Gated entry"* is on `Palisade or earthworks` (`src/data/institutionServices.js:1545-1547`), and the thorp `Palisade` has NO services row at all (grep). Condition: village member. |
| low protective value against a determined force | **CONDITIONAL** | True of the thorp and hamlet texts (*"minimal"*, *"stop nothing determined"*, *"without stopping them"*); the village variants say *"slows an attack"* / *"blunt an assault"* with no floor. And the ENGINE contradicts any comparative reading: a palisade scores `hasWalls +30` military and `+20` monster (`defenseGenerator.js:160, :202`) — identical to `City walls and gates`; `hasGates` fires on `palisade` (`priorityHelpers.js:53`); the causal walls bonus is +6 for any walls (`src/domain/causalState.js:1051-1053`). Condition: the row's own adjective, never "worth less than stone" or any comparison of works. |
| ENGINE CONTRADICTS: timber rots / needs replacing | **HOLDS** | `defenseGenerator.js:186-187` floor comment; no removal path; the only material term is the chain's `impaired` −4 (`:594-597`), a score, not an existence. |
| ENGINE CONTRADICTS: stone would be better / could not afford stone | **HOLDS** as a refusal, with a correction | The survey says "no build-cost model tying material to wealth" — true; but there IS a stone SUPPLY model tying every wall row to a quarry chain (`supplyChainData.js:873-884`), so a face saying the town "has no stone to build with" is contradicted twice. |

### E-2 · `earthwork` / `Palisade or earthworks`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| an enclosure that controls approach and slows attackers | **CONDITIONAL** | village row and variants — holds; hamlet variants say *"Enough to slow a raid or a wandering beast, no more"* / *"checks raiders and creatures"* (`:445-448`): slows, yes; controls approach, no. Condition: village member. |
| the work is one of {timber palisade, earth berm} | **HOLDS** | every variant keeps the disjunction (`:445-448`, `:1161-1164`). |
| the disjunction reaches the reader through `{defwork}` | **HOLDS** | `bareCommonFill` (`defenseStateProse.js:1010-1018`) rejects determiners, dashes, digits, sentence punctuation and snake_case only; `"palisade or earthworks"` passes; `defworkFill` (`:1027-1036`) matches on `palisade`. Also passes: `"gates (if walled)"` (parentheses are not refused). |
| ENGINE CONTRADICTS: any face resolving the disjunction | **HOLDS**, and stronger | the fortification chain feeds this row quarried stone (`supplyChainData.js:880-884`), so BOTH "timber" and "earth" are contradicted by the supply model on this row, not just unresolved. |

### E-3 · `wall` / `walls` (stone members)

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| Town walls: stone; gates | **HOLDS** | `:1332`; variants *"Gated stone defences"* / *"Masonry walls pierced by gates"* (`descVariants:825-828`); service *"Gate control"* on `p: 1.0` (`institutionServices.js:1457-1460`). |
| City walls and gates: masonry; towers; more than one gatehouse | **HOLDS** | `:1910`; variants *"Towered stone walls. Several gatehouses"* / *"Masonry ramparts studded with towers and pierced by many gates"* (`:97-100`). Reachability: REQUIRED at city (R-A), so every generated city carries it. |
| Massive walls: more than one circuit; more than one gatehouse; more than one garrison zone | **CONDITIONAL** | True of the row and of both variants (`:537-540`), and NO GENERATED WORLD CARRIES THE ROW (R-A, metropolis). Condition: a toggle-forced, imported or hand-built roster only. A licence written for it licenses nothing on the native product. |
| all three: a controlled entry point, therefore control of who enters | **HOLDS for the three rows; CONDITIONAL at the bucket** | the DS-DEF-5 `walls PRESENT` key reads `forces.walls.present` (`defenseStateProse.js:1251-1253`, `:1370`), which `Citadel` and `Gates (if walled)` also set; see E-4/E-5. |
| "stone endures / walls outlast the men" half-refused | **HOLDS** as the survey states it. See E-31 and §6 for the corpus face this reaches. |
| "expensive to maintain" implies decay | **HOLDS** as a refusal; the maintenance model is the chain's `impaired` −4 and nothing else (`defenseGenerator.js:594-597`). |

Added for the row: at town on a `frontier` or `plagued` country, `Town walls` is FORCED unless a `Barracks` (or any `garrison|citadel|fortress` name) already stands (R-C). `frontier` is the default tier (`src/data/monsterThreat.js:55-56`). So `walls ABSENT` / `UNWALLED-LARGE` at town is reachable mainly in a `heartland` country or beside a Barracks.

### E-4 · `citadel`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| a stronghold; INNER; last refuge in siege | **HOLDS** | `:1931`; variants (`:93-96`); service *"Last refuge"* `p: 1.0` (`institutionServices.js:1465-1466`). |
| NOT stone | **HOLDS** | no material anywhere on the row; the survey's note about the metropolis desc is moot since that row never generates (R-A). |
| NOT a garrison of its own / a command | **CONDITIONAL** | the service row *"Military command: Command and coordination centre for the city's defense"* is `on: false, p: 0.6` (`:1467`) — recorded on some citadels, never entailed. Condition: an instantiated service row. |
| ENGINE CONTRADICTS: a citadel is a perimeter | **CONDITIONAL** | the contradiction is real (`defenseInstitutionBuckets.js:85`), but the survey's case — "a city holding ONLY a Citadel" — is unreachable natively: `City walls and gates` is required at city (R-A). It becomes reachable when a ruin stamp removes the walls and leaves the citadel (`institutionRoster.js:38-42` filters `status`/`_worldPulseInactive`), or on an import. Condition: post-ruin or imported roster. |

### E-5 · `gate`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| a controlled entry point; gatekeepers | **HOLDS** | `:1356`; variants *"each with its keeper"* / *"gatekeepers posted"* (`:821-824`). |
| a toll bar | **HOLDS where the service row is instantiated** | *"Toll collection"* `on: true, p: 1.0` (`institutionServices.js:1550-1551`); holder table `src/domain/prose/holderTable.js:303-308`. |
| ENGINE CONTRADICTS: a gate implies a wall | **HOLDS**, and wider | `hasGates` (`priorityHelpers.js:53`) fires on `gates`, `town walls`, `city walls`, `massive walls` AND `palisade`, and is read by `safetyProfile.js:462` for a gate note — so a palisade town gets gate prose too. |

### E-6 · `perimeter` / `line` / `circuit`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| at least one `walls` bucket member stands | **HOLDS** | `defenseInstitutionBuckets.js:169-182`. |
| safe-spelling note ("the works", "what the town has built") | **HOLDS** | both are true of every member including the disjunctive row and the gate. |

### E-7 · `garrison`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| Garrison: professional soldiers; answer to noble or royal authority | **HOLDS** | `:1925`; variants *"kept by noble or crown"* / *"in noble or royal pay"* (`:101-104`). Reachability: REQUIRED at city with no `baseChance` (R-A), so `garrison PRESENT` is a tier fact at city and `forceCorePoolKey` (`defenseStateProse.js:1269-1276`) never reaches `watch PRESENT` there. |
| being paid, therefore exposed to the upkeep gate | **CONDITIONAL** | exposed, yes; but the gate is not a wage model (R-D). Condition: "paid" may be said from the row's *"in noble or royal pay"*; "the gate is about their pay" may not, because the same multiplier bites a palisade. |
| Multiple garrisons: more than one; distributed | **HOLDS** | `:2355`; variants (`:541-544`); metropolis bc 0.75, no group — reachable. |
| ENGINE CONTRADICTS: a Barracks is a garrison | **HOLDS** | `defenseInstitutionBuckets.js:89`; variants *"Quarters for the guard or a small garrison"* (`:809-812`); ladder `src/data/institutionLadders.js:23`. |
| ENGINE CONTRADICTS: a garrison is the town's own | **HOLDS** | as surveyed; the occupation stress −35 (`defenseGenerator.js:387-390`). |

### E-8 · `militia` / `muster`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| townspeople, not soldiers; part-time | **HOLDS** for hamlet/village | variants `:441-444`, `:1157-1160`. |
| an obligation at town tier | **CONDITIONAL** | the town row's text says it (`:1340`, variants `:813-816`), and the row NEVER GENERATES natively (R-A: `Town watch` required, same group, later in order, splices it). Condition: a toggle that `forceExclude`s the town watch (`assembleInstitutions.js:274`), or an import. |
| raising them takes them off other work | **HOLDS** | "part-time" on every tier and variant. |
| drilling at hamlet/village | **HOLDS** | hamlet variants keep *"drill"*; village keeps *"mustered"*. |
| a roll (muster) — the one institution that keeps one | **CONDITIONAL** | the holder record is a SERVICE ROW, and *"Muster training"* is `on: false, p: 0.5` (`institutionServices.js:835-838`); the holder table's own standard is *"a row the world actually wrote, never a catalog probability"* (`holderTable.js:243-247`). Condition: an instantiated `Muster training` service on this town's militia; about half of militias have no roll. |
| ENGINE CONTRADICTS: a militia and a watch coexist | **HOLDS**, and it is a law of the roster (R-A), not merely a desc sentence. |
| ENGINE CONTRADICTS: the muster is the roll of everyone under arms | **HOLDS** |

### E-9 · `watch`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| night patrol (Town watch) | **HOLDS** | `:1348`; variants `:829-832`; service *"Night patrol"* `p: 1.0` (`institutionServices.js:1322-1323`). |
| gate duty (Town watch) | **CONDITIONAL** | recorded on every town watch (`:1348`, service *"Gate duty"* `on: true, p: 0.8`, `:1324`), and `Town watch` is REQUIRED at every town while `Town walls` is bc 0.5 and `Gates (if walled)` bc 0.5 — so the record asserts gate duty on unwalled, gateless towns. Condition: `forces.walls.present` (or the `Gates (if walled)` row) on the same roster. |
| full-time law enforcement (Professional city watch) | **HOLDS** | `:1918`; variants `:105-108`. |
| order inside, not war outside | **HOLDS** | `defenseGenerator.js:235` (+18 internal) vs `:163` (+7 military). |
| ENGINE CONTRADICTS: "the watch" names one thing | **HOLDS** | `defenseInstitutionBuckets.js:89, :96`; `defenseDisplay.js:334-335, :350`. |
| ENGINE CONTRADICTS: the watch is the enforcement the label measures | **HOLDS** with a correction | `safetyProfile.js:44` is `militaryEffective / Math.max(8, criminalEffective)` — the denominator is floored at 8, which the survey omits. |

Added: because `Town watch` is required, `NO organized force at all` is unreachable at town natively, and `watch PRESENT` is the default town force pool wherever no `Barracks` (0.3) or `Free company hall`-less roster... precisely: `forceCorePoolKey` returns `garrison PRESENT` on 30% of towns (Barracks) and `watch PRESENT` on the rest.

### E-10 · `mercenary company`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| paid; a contract | **HOLDS** | annex `RECEIPT_POOLS_DOSSIER_STATE.md:2874-2880`; service *"Mercenary hire"* `p: 1.0` (`institutionServices.js:1074-1075`). |
| organized companies; hundreds to thousands | **HOLDS** | `:2182`; variants `:21-24` keep both. |
| ENGINE CONTRADICTS: the contracted force can be described from `hasMercenary` | **HOLDS**, plus a second seam | the `mercenary` supply chain's `processingInstitutions: ['Mercenary quarter', 'Free company hall']` (`supplyChainData.js:893-897`) gives a Free company hall town +4 military when healthy (`defenseGenerator.js:598-600`) — a third roster for the same word. |

### E-11 · `charter hall`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| operating under a charter / licence, every tier | **HOLDS** for the three `Adventurers' charter hall` rows | variants `:501-504`, `:689-692`, `:1229-1232` all keep charter or licence. REFUTED for `Multiple adventurers' guilds` (survey has it). |
| posting bounties | **CONDITIONAL** | hamlet and village rows say bounties; the TOWN row says *"Posts contracts, grades monster threats"* (`:1443`; variants `:689-692` say *"contracts"*). Condition: hamlet/village member. |
| coordinating monster response | **HOLDS** | present on all three tiers and their variants. |
| work a garrison is the wrong instrument for | **CONDITIONAL** | the hamlet text says *"when the garrison cannot"* (`:325`) at a tier that has NO garrison row (the hamlet Defense category is `Citizen militia` and `Palisade or earthworks` only — dump rows 17-18); the town text says *"militia cannot handle"* at a tier where the militia never generates (R-A). The words are recorded; the institutions they name are not on the roster. Condition: license "the things soldiers are wrong for", never "the garrison's" or "the militia's" by name. |
| ENGINE CONTRADICTS: Multiple adventurers' guilds is a charter hall | **HOLDS** |
| ENGINE CONTRADICTS: absence is a finding only where warranted | **HOLDS** | `defenseStateProse.js:1241-1243`, `:1294-1297`. |

### E-12 · `granary`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| grain is stored; buffers a harvest; communal at town | **HOLDS** | `:925`; services `:1429-1431`. |
| NOT how full / how many months | **HOLDS** and sharper | `defenseGenerator.js:265` defaults `storageMonths` to 4 when `foodSecurity` is absent and `hasGranary`; `foodGenerator.js:161-165` gives a town granary 5 months, village 3.5, and a thorp/hamlet WITH NO GRANARY 1.5 months. The flag and the stock are different numbers. |
| ENGINE CONTRADICTS: a granary means the town can eat through a bad year | **HOLDS** |
| (added) `hasGranary` is a TIER PROXY | — | `Town granary` and `City granaries` are required (R-A); no village/hamlet/thorp row matches `granar` (the thorp `Communal root cellar`, `institutionalCatalog.js:111`, *"A shared underground store for grain… Vital buffer against a bad harvest"*, does not). So every `granary …` pool is town+ and every `no reserves …` pool is village-and-below, and `No reserves, landlocked` (annex `:3046-3049`, *"holds no food buffer at all"*) prints on a thorp whose recorded row is a root cellar and whose food model gives it 1.5 months. `isolationSupport.js:47` counts `root cellar` as a reserve; the defence flag does not. |

### E-13 · `hospital`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| somewhere to put the sick; casualty treatment and containment | **CONDITIONAL** | true of the three hospital rows; `Healer (divine, 1st level)` (`:845`) and `Monastery or friary` (`:1267`, *"May operate hospital/school"* — MAY) also set the flag. Condition: a `hospital` name on the roster. |
| ENGINE CONTRADICTS: "Hospital present" means a hospital | **HOLDS** | and `Monastery or friary` also sets `hasChurch` and the generator's `hasDivine` tradition (`defenseGenerator.js:104-107`) — one row, three flags. |

### E-14 · `church` / `parish` / `clergy`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| consecrated ground; a place of observance (of an actual church row) | **CONDITIONAL** | `Access to parish church` (`:50`, `:300`) records a church IN ANOTHER SETTLEMENT (*"Walk 2-5km"*); `Wayside shrine` records a marker with no clergy and no consecration word. Condition: a `Parish church` / `Parish churches` / cathedral / monastery row. |
| ENGINE CONTRADICTS: `Clergy care` from `hasChurch` | **HOLDS**, and it is UNIVERSAL at hamlet | `Access to parish church` is `required: true, baseChance: 1` at hamlet (`institutionalCatalog.js:300`), so every generated hamlet with a granary-less roster reads… no: hamlets have no granary, so the disaster row gives them `NO reserves, NO medical provision` (church unconsulted in that branch, `defenseStateProse.js:580-586`). The exposure is DS-DEF-6's `Medical Readiness: Clergy care` (`defenseDisplay.js:237-239`, dark under C3) and the `granary AND parish care only` pool at town where a `Parish churches (2-5)` row is required (`institutionalCatalog.js:1260`) and `Small hospital` is bc 0.3 / `Monastery` bc 0.4: roughly half of towns print *"clergy who tend the sick"* (annex `:2706`) off a row that records parishes and nothing about care. |

### E-15 · `court`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| a process that runs | **CONDITIONAL** | `Town hall`'s own service row records *"Dispute arbitration: Bring commercial and civil disputes before a magistrate"* `on: true, p: 0.8` (`institutionServices.js:1623-1625`) — so a civil PROCEDURE is recorded on most town halls; a CRIMINAL trial is not. Condition: "try" / "arrest, try and hold" only where a `Courthouse` / `Multiple courthouses` / `Multiple court buildings` row stands; "a dispute goes before a magistrate" where the town-hall service is instantiated. |
| ENGINE CONTRADICTS: `hasCourtSystem` means a court | **HOLDS** (softened by the row above) | `Town hall` and `City hall` required (R-A). |

### E-16 · `prison`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| people can be held; public punishment at town | **HOLDS** | `:1564`; services *"Holding cells"* `p: 1.0`, *"Public punishment"* `p: 0.8` (`institutionServices.js:1635-1638`). |
| ENGINE CONTRADICTS: detention from `stocks` | **HOLDS** (hypothetical row). |

### E-17 · `port`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| water access for bulk trade | **HOLDS** | `:987`, `:1652`. |
| supply can arrive by water (the +10) | **CONDITIONAL** | `defenseGenerator.js:273-275` keys on the CONFIG `route === 'port'` AND `worldLaw.supportsMaritime()`, not on `hasPort`; `Docks/port facilities` has `tradeRouteRequired: ['port','river']` (`_catdump2` output), so a river-route dock sets `hasPort` and earns no sea-supply term. Condition: `config.tradeRouteAccess === 'port'` in a maritime world. |
| NOT the sea | **CONDITIONAL** | `Docks` and `Harbour master's office` fire on `river`; but `Shipyard` carries `forbiddenTradeRoutes: ['road','crossroads','mountain_pass','isolated','river']` and desc *"ocean-going merchant vessels"* (`:1025`) — for a `Shipyard` member the sea IS entailed. Condition: "the sea" is licensed off a `Shipyard` row, not off `hasPort`. |
| ENGINE CONTRADICTS: a shipyard is a port | **HOLDS** as a name-class fact; note the city `Shipyard` (`:1676`) records *"war vessels"* and the tag `military` while `hasNavy` stays false. |

### E-18 · `navy`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| no member | **HOLDS** | the full dump (316 rows) has no name containing `navy`, `fleet`, `warship` or `major port`; `Naval Defense: Naval force` is unreachable on a native roster (`defenseStateProse.js:1608-1612`). |

### E-19 · `arcane defense`

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| practitioners of the named kind | **CONDITIONAL** | true for wizard/mage/academy/alchemist rows; `Golem workforce` (`institutionalCatalog.js:2223`, *"Constructed servants if magic permits"*) is a `magicDef` member (`defenseInstitutionBuckets.js:107`) that records no practitioner. Condition: not the golem row. |
| NOT wards / detection / counterspells | **HOLDS** as a refusal, and the engine has one detection-shaped term the bucket does not see: `internal += min(8, …)` for *"Arcane surveillance (scrying, thought-reading)"* at `hasArcane && magPri >= 50` (`defenseGenerator.js:239-240`) and *"confessional intelligence"* for `hasDivine && relPri >= 60` (`:241-242`). |
| ENGINE CONTRADICTS: an alchemist is an arcane defence | **HOLDS** |
| world-setting gate | **HOLDS** | `:1319-1322`; `src/domain/worldPulse/magicWorksAt.js:49-53`. |
| (added) `arcane defense ABSENT` is REFUTED on druid and divine towns | — | `Druid Circle` (`institutionalCatalog.js:829`), `Warden's Lodge` (`:1409`), `Elder Grove Council` (`:1389`) set the generator's `hasDruid` (`defenseGenerator.js:112-114`: +12 monster, +6 magical, halved famine patrol penalty `:349-353`), and `Parish church` / `Monastery` / `Cathedral` set `hasDivine` at `relPri >= 55` (`:104-107`: +18 monster, divine internal term); none of those names is in `magicDef` (`defenseInstitutionBuckets.js:105-108`), so the desk prints *"nothing here would know"* / *"goes undetected and therefore unanswered"* (annex `:2933-2935`) on a town the engine scores as magically defended. |

### E-20 · `terrain` — **HOLDS** on every item (`geographyData.js:126, :208, :310, :418, :523, :621, :720`; the maps `defenseStateProse.js:693-703`, `:719-723`; annex `:2513-2515`). The contradiction (ground decides material) HOLDS; note the fortification chain's stone upstream applies on Plains as on Mountain.

### E-21 · terrain multiplier — **HOLDS** (`defenseGenerator.js:129-135`).

### E-22 · the band word — **HOLDS** (`src/domain/display/defenseScoreBands.js:38-39`; `src/domain/compendium/bandLadders.js:202-207`).

### E-23 · the readiness label

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| mean + tier bonus − threat penalty | **HOLDS**, one addition | in a no-magic world the mean is over FOUR arms (`defenseGenerator.js:502-505`), so the same works band differently across worlds. |
| not walls; not the badge's number | **HOLDS** | `:768-771` reads `readiness.score`. |
| ENGINE CONTRADICTS: a thorp reading well-defended is well defended | **HOLDS** |

### E-24 · the live band — **HOLDS** (`causalState.js:444-449`, `:1034-1053`); `collapsed` needs active conditions to fall below 15 from a 50 start with a −30 floor on the readiness term.

### E-25 · the safety label — **HOLDS** with the `max(8, criminalEffective)` correction (`safetyProfile.js:44`); the community bonus and court floor as surveyed (`:57-71`).

### E-26 · postures — see L-14..L-18 (all HOLD against `src/data/stressTypes.js:53-62, :64-72, :84-92, :104-113, :159-168`).

### E-27 · criminal structure

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| `organized` entails a hierarchy; permission by somebody; suppression of what draws enforcement | **REFUTED** for two members | `hasSyndicate` (`defenseDisplay.js:187`) classifies `Front businesses` (`institutionalCatalog.js:1480` town, *"Legitimate covers for criminal activity"*; `:2040` city) and `Multiple criminal factions` (`:2006`, *"Competing gangs. Turf disputes"*) as `organized`. The second contradicts the classifier's own `semi-organized` note two lines up (*"Multiple factions may be competing"*, `:167`) and the corpus's *"stable enough to negotiate with"* (annex `:2815`); the first is a laundering cover with no recorded hierarchy. Condition: license the hierarchy from a `Thieves' guild` row only. |
| `semi-organized` (routes and territories) | **REFUTED** for one member | `hasSemiOrg` (`:188`) fires on `gambling`: the town `Gambling den` (`institutionalCatalog.js:1520`, Entertainment, *"Dice, cards, simple games of chance"*) makes a town *"coordinated enough to hold routes and territories"* (annex `:2821`). |
| NOT numbers / a boss / reached the seat | **HOLDS** |
| ENGINE CONTRADICTS: `null` means no organized crime | **HOLDS** | and `Assassins' guild` also fails `hasCriminalInst`? No — `priorityHelpers.js:72` includes `assassins`, so the FLAG sees it while the STRUCTURE classifier does not: two crime classifiers in two files disagree about the same row. |

### E-28 · capture — **HOLDS** (`defenseStateProse.js:928-945`; `src/generators/power/rulingStructure.js:797`).

### E-29 · magic dependency — **HOLDS** on both items (`defenseGenerator.js:449-454`; the corpus gap at annex `:3211` is real).

### E-30 · blockade

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| a hostile fleet on the sea approaches; the port choked | **CONDITIONAL** | `foodStockpile.js:307` is `const blockaded = !!blockade;` — I did not trace the writer of `blockade`; "fleet" is the DISPLAY note's word (`defenseDisplay.js:263-266`), not a recorded field. Condition: the naval layer's own writer, which this packet did not read. |
| bypass is `teleport` or `airship` | **HOLDS** | `foodStockpile.js:313-316`; the channels are the `Teleportation circle` / `Airship docking` rows (`foodGenerator.js:139-144`), which `isolationGenerator.js:88-90` can FORCE onto an isolated high-magic roster. |

### E-31 · the economic-upkeep gate

| Entailment | Verdict | Evidence / condition |
|---|---|---|
| the FUNDED portion is under-funded in the proportion stated | **REFUTED** as a wage claim | R-D. The multiplier is `0.6 + econOutput/50 * 0.4` (`defenseGenerator.js:189`) — a function of the town's economic output, not of any payroll; it is applied to `hasWalls +30`, `hasMilitia +10`, `hasWatch +7`, `hasCharterHall +10` exactly as to `hasGarrison +28` (`:160-165`, `:190-192`); `economicGates.military` is recorded whenever `hasAnyDefense` (`:467-470`), which a lone palisade satisfies. A village with `Palisade or earthworks` + `Citizen militia` (part-time, obligated, no wage recorded anywhere) reports `military: 0.8` at `econOutput 25` and DS-DEF-11 prints `WALLED-STRAINED` (`defenseStateProse.js:1057`): *"stone keeps itself, and wages do not"* (annex `:5982`). |
| the unpaid community baseline is exempt | **CONDITIONAL** | true at thorp/hamlet/village (`:138-156`); at town+ the base is 0 and nothing is exempt. |
| NOT desertion / arrears / a season | **HOLDS** |
| ENGINE CONTRADICTS: under-funded is decaying | **HOLDS** |
| the desk's `< 1` threshold | **HOLDS** | `:1057`; `Math.round(x*100)/100` at `:468` means `0.99` fires it. |

### E-32 · stress — **HOLDS** (`stressTypes.js:10-170`; `slave_revolt` `requiresTier: "town"` at `:141`).

---

## 3. VERDICTS ON THE SURVEY'S LABEL TRAPS (§5) AND CONTRADICTIONS (§6)

All twenty-five label traps HOLD against the code cited; corrections: **L-6** the ratio denominator is `max(8, criminalEffective)` (`safetyProfile.js:44`); **L-8** `Monastery or friary` also sets `hasDivine` (`defenseGenerator.js:104-107`); **L-9** the hamlet member is REQUIRED (R-A); **L-10** the town hall records a magistrate arbitration service (`institutionServices.js:1623-1625`), which softens "a meeting hall"; **L-21** add the 1.5-month small-tier floor (`foodGenerator.js:161-165`). All thirteen contradictions HOLD; **C-2** and **C-3** are CONDITIONAL on a post-ruin or imported roster at city (R-A); **C-7** is stronger (the chain feeds it stone); **C-11** confirmed at `threatAssessment.js:59, :66`.

---

## 4. LABEL TRAPS THE SURVEY MISSED

| # | Label | Field / rule | Engine meaning | file:line |
|---|---|---|---|---|
| **X-1** | `Granary present` / `No reserves` | `compound.inst.hasGranary` | a TIER: true on every town+ (required rows), false on every village-and-below whatever it stores; the thorp `Communal root cellar` is a reserve to `isolationSupport.js` and not to this flag | R-A; `priorityHelpers.js:63`; `isolationSupport.js:47`; `foodGenerator.js:161-165` |
| **X-2** | `Clergy care` at hamlet | `hasChurch` | ALWAYS true at hamlet from a required row whose church is 2-5 km away | `institutionalCatalog.js:300`; `priorityHelpers.js:65` |
| **X-3** | `economicGates.military < 1` ("underfunded", "wages") | `defenseProfile.economicGates.military` | `econOutput < 50` on any roster with any defence row; bites a palisade and a part-time militia exactly as a garrison | `defenseGenerator.js:160-165, :189-192, :467-470` |
| **X-4** | "fortification" (threat plan) | `FORTIFICATION_NAME` | `barracks`, `garrison` and `fortress` COUNT AS A FORTIFICATION, so a frontier town with a Barracks is not given walls and its receipt reason (*"requires a defensible perimeter"*, `:76`) is written for a billet | `threatDefensePolicy.js:47-48, :73-80` |
| **X-5** | "force" (threat plan) vs "force" (bucket) | `MILITARY_FORCE_NAME` vs `DEFENSE_BUCKET_KEYWORDS` | the plan's force regex admits `levy` and `guard`; the buckets admit neither; a thorp `Household levy` is a force to the plan and *"NO organized force at all: no command, no training"* to DS-DEF-5 (annex `:2907`) | `threatDefensePolicy.js:13, :49-50`; `defenseInstitutionBuckets.js:88-100`; `institutionalCatalog.js:104-110` |
| **X-6** | `hasGates` | `priorityHelpers.js:53` | fires on `palisade`; read for a gate note by the safety profile | `safetyProfile.js:462` |
| **X-7** | `Citizen militia` @ town, `Massive walls and fortifications` @ metropolis | catalogue rows | rows no generated world carries; every entailment written for them licenses nothing natively | R-A |
| **X-8** | the recorded `desc` | `inst.desc` | one of up to three seeded strings; a property is recorded only if every variant keeps it (the thorp Palisade's "wooden" is in none) | `assembleInstitutions.js:735-747`; `institutionDescVariants.js` |
| **X-9** | `plagued` on the monster ARM | `threat` in `computeDefenseScores` | +8 baseline then −15 after the gate: the tier word LOWERS the monster score it seems to raise | `defenseGenerator.js:196-198, :227` |
| **X-10** | `Docks/port facilities` vs `Shipyard` | `tradeRouteRequired` / `forbiddenTradeRoutes` | docks admit `river`; the shipyard forbids it and records "ocean-going" — the sea is a Shipyard fact, never a `hasPort` fact | `_catdump2` output; `institutionalCatalog.js:987, :1025` |
| **X-11** | `Town watch` "gate duty" | the row's desc and service | recorded on EVERY town including the half with no wall and no gate row | `institutionalCatalog.js:1348`; `institutionServices.js:1324`; R-A |
| **X-12** | `Monastery or friary` | one row | sets `hasHospital`, `hasChurch`, `hasMonastery` and the `hasDivine` tradition at once | `priorityHelpers.js:64-67`; `defenseGenerator.js:104-107` |
| **X-13** | `hasCriminalInst` vs `deriveCriminalStructure` | two classifiers | the flag sees `assassins`, `street gang`, `gambling den`; the structure classifier sees none of the first two and reads the third as `semi-organized` | `priorityHelpers.js:72`; `defenseDisplay.js:186-189` |
| **X-14** | `magicDef` "arcane" | bucket vs traditions | the bucket is name-matched arcane/alchemy; the generator's magical defence is FOUR traditions (arcane, divine, druid, alchemy); `arcane defense ABSENT` prints on divine and druid towns the engine scores as defended | `defenseInstitutionBuckets.js:105-108`; `defenseGenerator.js:93-119, :208-212` |
| **X-15** | `orderStatus` (DS-DEF-3 STATE-KEY) | `scores.internal` banded as `Strong / Adequate / Weak Public Order`, `Critical: Order Failing` | a fourth safety vocabulary on the same banner the survey did not row; it is the INTERNAL SCORE (court +20, prison +15, garrison +15, watch +18, minus crime), not the ratio the label reads | annex `:2731-2736`; `defenseGenerator.js:231-255` |

## 5. ALIAS TRAPS THE SURVEY MISSED

| # | English word | The classes it spans | file:line |
|---|---|---|---|
| **Y-1** | "the levy" / "armed households" | `Household levy` (thorp) is in the threat plan's force class and in NO bucket, NO flag, NO holder row; `hasMilitaryInst` misses it | `threatDefensePolicy.js:13`; `priorityHelpers.js:45`; `institutionalCatalog.js:104` |
| **Y-2** | "hired swords" / "hired blades" | `Hired blades` (town/Entertainment, *"professional fighters available for private contracts"*) matches no bucket and no flag; `Veteran's lodge` matches `hasMercenary` only; `Mercenary quarter` matches both | `institutionalCatalog.js:1534`; `priorityHelpers.js:49`; `defenseInstitutionBuckets.js:98-100` |
| **Y-3** | "the reserve" / "the stores" | `hasGranary` (building, town+ only) vs `foodSecurity.storageMonths` (1.5 to 12) vs `RESERVE_INSTITUTION` (root cellar, warehouse, cistern) vs the `store`/`storehouse` civic classes | `priorityHelpers.js:63`; `foodGenerator.js:161-165`; `isolationSupport.js:47`; `wiringCensus.js:1305, :1322` |
| **Y-4** | "the gate(s)" | FIVE sources: the `Gates (if walled)` row; the `hasGates` flag (palisade included); `Town watch`'s *Gate duty*; `Palisade or earthworks`' *Gated entry*; `Town walls`' *Gate control* | `institutionalCatalog.js:1356`; `priorityHelpers.js:53`; `institutionServices.js:1324, :1546, :1458` |
| **Y-5** | "the magistrate" / "the court" | `Courthouse` rows vs `Town hall`'s *Dispute arbitration before a magistrate* (p 0.8) vs `Democratic assembly` | `institutionServices.js:1623-1625`; `priorityHelpers.js:55` |
| **Y-6** | "arcane" / "magical" defence | `magicDef` bucket · `hasMagicInst` flag · the generator's four traditions · `computeEffectiveMagicPresence` (the magical ARM) | `defenseInstitutionBuckets.js:105-108`; `priorityHelpers.js:68`; `defenseGenerator.js:93-119, :292-331` |
| **Y-7** | "fortified" (from a desc) | `Waystation` (*"A fortified overnight stop"*), `Caravanserai` (*"walled waystation"*, *"walled compound"*), `Burial ground` (*"A walled plot"*) carry wall words in the DESC and are in no wall class; a writer reading rosters will find "walled" on unwalled towns | `institutionalCatalog.js:405, :531, :538` (Caravanserai, Waystation); the hamlet `Burial ground` row |
| **Y-8** | "the soldiers" | corpus `garrison PRESENT` says *"soldiers"*; the bucket's members include a housing row and a police force; the annex's `charter hall ABSENT` sends *"soldiers"* at hamlet/village tiers that hold none | annex `:2893-2895, :2923-2925`; `defenseInstitutionBuckets.js:88-91` |

## 6. MISSED NOUNS (slot nouns or name classes the survey did not row)

1. **`Household levy`** (thorp, `institutionalCatalog.js:104-110`, desc *"One able-bodied adult from each household musters with hunting bows, spears, and farm tools"*): the thorp's whole defence class; in no bucket; forced by the threat plan on plagued thorps.
2. **`Hired blades`** (town/Entertainment): armed men outside every defence class.
3. **The druid tradition rows** — `Druid Circle` (village), `Warden's Lodge` (town, tag `military`, *"emergency scouts and trackers"*), `Elder Grove Council` (town): engine defence contributors (`defenseGenerator.js:112-114`) the desk never sees.
4. **The divine tradition** — `Parish church`, `Monastery or friary`, `Cathedral`, `Great cathedral` as `hasDivine` (`:104-107`): +18 monster, a divine internal term, a famine cap; the desk reads them only as `hasChurch`.
5. **`Communal root cellar`** (thorp): the small-tier reserve.
6. **`Customs house`** (town, tag `law_enforcement`, *"Levies duties on goods entering… via the port or main roads"*): a toll function with no gate and no wall.
7. **`Watchtower`**: a SERVICES row (`institutionServices.js:1561-1565`, *"Signal fire… Night watch"*) with NO catalogue row — a dead vocabulary a writer could cite.
8. **`Teleportation circle` / `Airship docking (high magic)`**: the blockade-bypass channels (`foodGenerator.js:139-144`; forced by `isolationGenerator.js:88-90`).
9. **`Multiple criminal factions`** vs **`Thieves' guild chapter`**: same `exclusiveGroup: 'criminalPower'` (`institutionalCatalog.js:2006` and the `Thieves' guild chapter` row above it), both `organized` to the classifier, opposite structures by their own descs.
10. **`Gladiatorial school`, `Fighting pits`, `Bowyers & fletchers (guild)`** (*"outfits town militias"* at a tier with no militia): armed-culture rows outside the class.
11. **`stress.summary` / `stress.viabilityNote`** (DS-DEF-8's STATE-KEY names them): generator prose with its own assertions (`src/generators/stressNarrative.js`, not read here).
12. **`guardEffectivenessDesc`** (the DM field DS-DEF-1 sits beside): its text asserts pay, bribery and *"volunteers with day jobs"* (`safetyProfile.js:319-345`), i.e. exactly the unlicensed class, one slot to the left of the corpus line.
13. **`orderStatus`** (X-15) and **`safetyDesc`**: the DS-DEF-3 banner's other two vocabularies.
14. **`economicGates.disaster`** and **`chainModifiers.{military,economic}`**: the fortification / garrison / mercenary / food-processing chain terms (`defenseGenerator.js:585-605`) — the engine's only maintenance-and-supply model for walls and soldiers.
15. **`hasFreeCompany`** (`priorityHelpers.js:50`): a flag with no reader found in `src/` (grep), i.e. a dead distinction the roster nevertheless records.
16. **The metropolis roster itself**: because of the merge order, every metropolis is a city with extra rows; `Massive walls` and the metropolis-only wall vocabulary never occur.

## 7. LIVE CORPUS FACES THIS REFUTATION REACHES (for the chair's rewrite, not ruled here)

| Face (annex line) | Why it is more knowledgeable than the simulation |
|---|---|
| DS-DEF-5 `watch PRESENT` v1 *"answers what happens inside the walls"* (`:2903`) | the key reads no wall; `Town watch` is required on every town and `Town walls` is bc 0.5 |
| DS-DEF-5 `garrison PRESENT` v3 *"counted at the gate by somebody whose job that is"* (`:2895`) | fires on a `Barracks` (housing) in an unwalled, gateless town |
| DS-DEF-5 `charter hall ABSENT` v1/v3 *"the garrison's problem"*, *"sends soldiers"* (`:2923, :2925`) | at hamlet/village no garrison row exists and the militia is bc 0.15/0.22 |
| DS-DEF-2 `settled, defenses beyond the need` v1 *"substantial works"*, v3 *"how relaxed the people on it are"* (`:2621, :2623`) | v1 on a thorp `Palisade` (*"minimal protection"*); v3 where `beastsRowSituation` deliberately ignores the force (`defenseStateProse.js:437-438`) |
| DS-DEF-11 `WALLED-STRAINED` v1 *"stone keeps itself, and wages do not"* (`:5982`) | `{defwork}` fills `palisade` / `palisade or earthworks`; the gate fires on a wage-less village at `econOutput < 50` (R-D) |
| DS-DEF-2 `walls with NO force` v1 *"takes this town with ladders"* (`:2641`) | an earth berm needs none; the member is not fixed |
| DS-DEF-2 `granary AND parish care only` v1 *"clergy who tend the sick"* (`:2706`) | `hasChurch` from `Parish churches (2-5)` (required at town) records parishes, not care |
| DS-DEF-5 `arcane defense ABSENT` all three (`:2933-2935`) | druid and divine towns the engine scores as magically defended (X-14) |
| DS-DEF-4 `structure organized` all four (`:2815-2818`) | fires on `Front businesses` and `Multiple criminal factions` (E-27) |
| DS-DEF-4 `structure semi-organized` v1 *"hold routes and territories"* (`:2821`) | fires on a `Gambling den` |
| DS-DEF-6 `No reserves, landlocked` v1 *"holds no food buffer at all"* (`:3047`) | a thorp with a `Communal root cellar` and 1.5 base months |
| DS-DEF-6 `Naval Defense: Port only` v3 *"A stranger sails into"* (`:3059`) | `hasPort` fires on a river dock |

## 8. WHAT THIS PACKET DID NOT VERIFY

- The writer of `blockade` at `foodStockpile.js:307` (E-30's "fleet").
- `coherenceRepairPass.js` beyond its import of the threat plan; `factionCorrelation.js` / `cascadeGenerator.js` add no Defense-category row by name (grep over `src/generators` found only the plan, the validator's subsumption map at `structuralValidator.js:38-49` and `factionCategories.js:36`), but a repair pass that re-draws a category was not traced end to end.
- `stressNarrative.js` (`stress.summary`).
- Whether `institutionToggles` in any shipped preset force-excludes `Town watch` (which would revive the town militia).

*Refuter's packet for the Fable chair. No law proposed. Dock `f2da5a3ee`, nothing written into the dock, no suite run.*
