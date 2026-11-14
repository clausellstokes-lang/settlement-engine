# H3 rows: chain card facts and house labels

Paths: tip = scratchpad/tip/src. Surfaces: D = tab dumps, Pc/Pd/Pt = PDF canon_dossier/draft_brief/timeline_packet, F = Foundry (3), T = Tonight.

| id | file::function | line (template) | conditions | surfaces | towns printed | towns read | verdict | evidence |
|---|---|---|---|---|---|---|---|---|
| H3-1 | domain/display/chainHouses.js::chainHousesOf (via SupplyChainsPanel::chainFlowFacts → EconomicsTab "Via") | Via: {house label} · {house label} | each processingInstitutions pattern matched (first 12 letters, at the start of a word) against the town's roster; deduped by label | D Economics; Pc/Pd (SupplyChainFlow nodes, Services "A + B") | 1513 | script: all 1536 (19964 chains; every named house is a roster label: 0 misses; 191 pattern→house pairs read by eye, none of the wrong trade); eye: r2s-under_siege-thorp-0, r2s-occupied-metropolis-0, r2r-city-0 | TRUE | |
| H3-2 | chainHouses.js::chainHousesOf (ruling e, "Access to …") | Via: Access to external mill / Access to a house of worship | pattern "Access to…" names that row; another pattern falls back to the access row when the roster holds no house of its own | D, Pc/Pd | 457 (thorp, hamlet) | script all; eye r2s-under_siege-thorp-0, rr3-hamlet-under_siege+famine-rand-2, r2r-thorp-12 | FALSE LOW | rr3-hamlet-under_siege+famine-rand-2: "Grain & Bread ✓ Running / From Grain fields / Access to external mill" under a siege that cuts every road (16 such cards in ~12 siege towns: grain via external mill, parish via access). The running status is the generator's; the row names a road-bound house as working under siege |
| H3-3 | chainHouses.js::chainSourceOf (absent ground dropped) | From: {resource} | CONDITION CHANGE: prints only when resourceCondition is not "absent" (or older record: input available or depleted) | D, Pc/Pd | 1195 print a From; 950 towns lose ≥1 From | script all: every printed ground checked against resourceAnalysis.resourceConditions / availableResources: 0 absent, 0 not in record, 0 depleted-unmarked | TRUE | |
| H3-4 | chainSourceOf (renamed toll, F1 composition) | From: Harbour traffic / River traffic | chainPrintName renamed the chain by config.tradeRouteAccess | D, Pc/Pd | 247 | script all (route = port/river in every one); eye r2r-village-2, rr3-village-occupied-port-1 | TRUE | (route=port villages with only a Fisher's landing: by record the route is a port) |
| H3-5 | chainSourceOf + card | {resource} (depleted) | resourceDepleted | D, Pc/Pd | 660 (= the 660 records with a depleted source) | script all; eye r2s-occupied-metropolis-0 | TRUE | |
| H3-6 | components/new/SupplyChainsPanel.jsx::chainFlowFacts (importedUpstream []) | "Import: {chain label}" | REMOVED (prints nowhere) | D, Pc/Pd | 0 | grep all dumps/PDF | TRUE | |
| H3-7 | SupplyChainsPanel.jsx::chainFlowFacts (upstreamNote null) | "Needs imported X: no local source" / "Upstream X chain is impaired" | REMOVED | D, Pc/Pd | 0 | grep all | TRUE | |
| H3-8 | components/new/serviceComponents.jsx (service need) | Needs {resource}. {impact ≤70 chars} | serviceImpactReason; sentence only on first card with that impact | D Services | 80 with sentence (70 "Supply route severed…", 10 "No trade access: running on existing stockpiles only.") | script: the 70 are all under siege, the 10 all route=isolated; eye r2r-hamlet-34, r2r-metropolis-14, r2s-under_siege-town-1 | TRUE | |
| H3-9 | components/new/tabs/InstitutionsTab.jsx (REQ badge) | "REQ" | REMOVED from roster (sourceTag required → unbadged) | D Institutions | 0 on Institutions | grep all | TRUE | twin: see H3-T1 |
| H3-10 | InstitutionsTab.jsx roster card label | {institutionHouseLabel(inst)} | every row | D Institutions | 1536 | script all names (43 bracketed names: 29 stripped, 14 in-world qualifiers kept); eye 3 above | TRUE | |
| H3-11 | InstitutionsTab.jsx services fallback | {institutionHouseLabel(svc.name)} | entity not in index | D Institutions | fallback only | census 0 ranges in Institutions | TRUE | |
| H3-12 | components/primitives/EntityLink.jsx | {house label} for institution links | type institution | D all tabs | all | census: 0 ranges via links | TRUE | |
| H3-13 | components/primitives/InstitutionLink.jsx trigger | {house label} / "Institution" | | D | all | census | TRUE | |
| H3-14 | InstitutionLink.jsx title | View {label} profile | tooltip | not in dumps | n/a | code + script (labels clean) | TRUE | |
| H3-15 | domain/display/institutionProfile.js heading | {house label} | profile dialog | not in dumps | n/a | script (labels clean) | TRUE | |
| H3-16 | domain/display/institutionDisplayName.js::HOUSE_LABEL_PLURALS | Inns | "Inn (multiple)" | D, Pc/Pd, F | 256 (town) | grep: "Inns" in rosters, NPC lines ("the innkeeper (Inns)"); no "Inns is/has" agreement break | TRUE | |
| H3-17 | institutionDisplayName.js::institutionHouseLabel | label without count range/household range/gate | trailing bracket digit-led, "high magic", "if walled" | all | 1536 | script all names | TRUE | |
| H3-18 | institutionDisplayName.js::houseLabelsInText via pdf/sections/ViabilityAssessment.jsx issues | N institutions operating on stockpiles only (isolated trade): {labels} | held houses' raw/display names swapped | Pc/Pd | 3 (r2r-town-9, r2s-mass_migration-town-2, rr3-town-infiltrated-rand-2) | eye all 3 ("Taverns", not "Taverns (5-20)"); siege issue does not print in PDF (title only) | TRUE | |
| H3-19 | ViabilityAssessment.jsx issue.institution, warnings (l.198), contradictions (l.233) housed | {labels} | | Pc/Pd | all | census 0 ranges | TRUE | |
| H3-20 | pdf/primitives/EntityRef.jsx | {house label} | type institution | Pc/Pd | all | census 0 | TRUE | |
| H3-21 | pdf/sections/Services.jsx chain flow | {source} » {house + house} » {outputs} | source via chainSourceOf, houses via chainHousesOf | Pc/Pd | 1535 | script (as H3-1/H3-3); eye r2r-city-0 | TRUE | |
| H3-22 | Services.jsx::svcLabel | {house label} | | Pc/Pd | all | census 0 | TRUE | |
| H3-23 | pdf/sections/SupplyChainFlow.jsx source node | {source}( (depleted)) | chainSourceOf | Pc/Pd | 1513 | eye r2s-occupied-metropolis-0 (PDF = screen) | TRUE | |
| H3-24 | SupplyChainFlow.jsx house nodes | {house label} | chainHousesOf; "(missing)" no longer reachable | Pc/Pd | 1513 | grep "(missing)": 0 | TRUE | |
| H3-25 | SupplyChainFlow.jsx Legend | Vulnerable (swatch) | always | Pc/Pd | 1536 | | TRUE | |
| H3-26 | pdf/sections/EconomicsTrade.jsx PROC row | PROC {houses} | only with pdfVisualChains off (default on) | — | 0 | flag default true; code: chainHousesOf(…, []) has no roster, always [], so the row is filtered out even with the flag off | NEVER PRINTS | 1536 towns, flag on |
| H3-27 | EconomicsTrade.jsx custom chains flow | {resource} » {houses} » {outputs} | user custom chains | — | 0 | 0 custom chains in 1536; code: houses always dropped ([] roster) | NEVER PRINTS | |
| H3-28 | pdf/sections/Institutions.jsx source meta | Source: Raised by a power | inst.source === 'faction_boost' | Pc/Pd | 199 | script: factionSource vs powerStructure.factions[].faction | FALSE LOW | r2s-infiltrated-town-2 (also rr3-town-politically_fractured-port-0, rr3-city-monster_pressure-rand-1): "Smuggling operation · Source: Raised by a power" — factionSource "Thieves' Guild", not among the town's powers (Corrupt Council, Merchant Guilds, Craft Guilds) |
| H3-29 | Institutions.jsx other sources removed | (Required/Generated/Cascade/Coherence Repair) | REMOVED | Pc/Pd | 0 | grep | TRUE | twin: H3-T1 |
| H3-30 | Institutions.jsx card title | {house label} | | Pc/Pd | 1536 | census 0 | TRUE | |
| H3-31 | Institutions.jsx services row | {house label of svc.name} | | Pc/Pd | all | census 0 | TRUE | |
| H3-32 | chainHouses.js (Services/SupplyChainFlow/EconomicsTab) duplicate join | one name per house | dedupe by label | D, Pc/Pd | all | pairs.out: no pattern matched >1 house | TRUE | |
| H3-T1 | TWIN of H3-9/H3-29: components/new/tabs/DefenseTab.jsx:345, pdf/sections/DefenseSecurity.jsx:191 | REQ / FORCED badge on a force | source required/forced | D Defense, Pc/Pd | REQ 768, FORCED 482 | grep all | FALSE MED | r2r-city-0 Defense: "City walls and gates / Masonry ramparts… / REQ": the provenance chip ruling (b) took off the roster still prints on the Defense tab and PDF |
| H3-T2 | TWIN of the label rows: DefenseTab / DefenseSecurity print force.name raw | Gates (if walled) | roster holds "Gates (if walled)" | D Defense, Pc, Pd | 14 | grep all | FALSE HIGH | r2r-town-11 Defense: "Gates (if walled) / Controlled entry points with gatekeepers." |
| H3-T3 | TWIN: domain/display/defenseDisplay.js:414 (healerName raw) | {healer}. Wounds and fevers treated one at a time; no beds to contain an outbreak. | no hospital, healer is a catalogue name | D Defense, Pc, Pd | 12 (metropolis) | grep all | FALSE HIGH | r2r-metropolis-32 Medical Readiness: "Major monasteries (5-10). Wounds and fevers treated…" |
| H3-T4 | TWIN of H3-18: OverviewTab / HistoryTab print history.currentTensions without houseLabelsInText (PDF HistoryFounding does) | 11 institutions operating on stockpiles only (isolated trade): … Taverns (5-20) … | stored tension naming a ranged house | D Summary/Overview, World/History | 1 | eye | FALSE HIGH | r2r-town-9: "…Weekly market, Market square, Taverns (5-20), Town granary…" (PDF of the same town reads "Taverns") |

## Census: catalogue count ranges and gates, every surface (1536 towns)
Regex: `\((\d…-\d…[+]?( households)?|\d…+ (only|households)?|high magic|low magic|if walled|multiple)\)`; plus a shape tally of every digit-led bracket and a check for brackets split across PDF lines (none).
- Dumps: Defense "Gates (if walled)" 14 towns; Defense Medical Readiness "Major monasteries (5-10)." 12 towns; Overview + History "Taverns (5-20)" 1 town (r2r-town-9). Nothing else (Institutions, Services, Economics, Power, NPCs, Outlook: 0).
- PDF canon_dossier and draft_brief: the same Defense two (14, 12). timeline_packet: 0.
- Foundry (all three) and Tonight: 0.
- Stored only, never printed: suggestions "Add Merchant guilds (3-8)…" (17 towns), simulationTrace reasons, the siege issue (title only in PDF).

## Chain checks (all 1536 records, 19964 chains)
- Every house a chain card names is a roster house (by label): 0 misses. No pattern matches two houses.
- Every printed ground: 0 the record marks absent, 0 not in the record, 0 depleted without "(depleted)"; renamed tolls (247) all on the town's route.

## Method
Scripts in this folder: names.mjs (bracketed roster names → label), chains.mjs (houses/sources over every chain), rowcounts.mjs, renamed.mjs, access.mjs, census.mjs (range census per surface/section), bystress.mjs, town.mjs, peek.mjs. Note: dumps drop repeated lines, so a later card's repeated From/Via line is not missing.

## Not read
InstitutionLink title and the profile dialog heading are not in any capture (I checked them by code and script only).
