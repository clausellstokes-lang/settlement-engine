# GEN11-FIELDS: which stored field says the words the coherence battery calls contradictions

Measure-only (PROSE-2 helper, brief `MEASURE-GEN11-FIELDS`, 2026-11-20). No source or test changed. Seeds `hxd-<size>-0..49`, six sizes, 300 places, born as `map-birth.shared.mjs` births them (no compose). Run from commit e18c64793.

## The checker

The receipt's `record_coherence_battery` judgment is `src/generators/recordBatteryFindings.js :: recordBatteryJudgment`. It joins every stored string that holds a space (walked in key order, skipping `config`, `generationCoherenceReceipt`, `simulationTrace`, keys starting with `_`, and a superseded `culturalIdentity.foodways`) into one text with `\n` (`recordTextSurfaces`). It then runs `src/domain/coherence/recordBattery.js :: recordBattery` over that text. `defense-words` (`defenseWordsFindings.js`) splits the text into sentences on `[.!?]` plus whitespace **and on `\n`**, and flags a sentence that names `walls|walled`, `soldier(s)`, `garrison(s|ed)`, `hospital(s)` and so on when `defenseFactsOf` says the place lacks the thing, unless a denial word comes before the term in the same clause. `tier-noun` (`tierNounFindings.js`) flags each singular `[Tt]own` in the strings that say "town" when the tier is not `town`, unless the word sits inside a kept span (`tierNounKeptSpans`). **A finding does not carry its source path.** It carries only `path: battery.<check>`, `detail` and a quote cut to 160 characters. So the census re-ran the matchers itself:

- **defense-words.** The census re-ran it field by field on the same record. Sentences never cross a `\n`, so this is exact.
- **tier-noun.** The census ran it once over the same joined text and mapped each finding's index back to the field whose span holds it.

The census walk's joined text equals `recordTextSurfaces`' own at all 103 places (`walkMatches` 103/103). The attributed findings equal the receipt's, check by check (`countsMatch` 103/103) and detail by detail (`detailsMatch` 103/103).

## The fields

The places count is how many places carry the finding, and the findings count is the number of findings. "Printed by" comes from a search for the field's key in `src/components` (the web dossier), then in `src/pdf`, `src/foundry` and `TableView.jsx`. In the example column, `#` stands for the place's own name.

| kind | word | field path | places | findings | printed by | example |
|---|---|---|---:|---:|---|---|
| defense-words | walls | `institutions[].desc` | 38 | 38 | web: `InstitutionsTab.jsx :: institutionDescription` (also `DefenseTab.jsx` l.367 for defence houses) | "A walled plot gated against livestock, kept by the households in turn." (hamlet 32, town 3, village 3) |
| defense-words | soldiers | `history.founding.foundedBy` | 18 | 18 | web: `HistoryTab.jsx` Founding, "Founded by" (l.295); PDF `HistoryFounding.jsx`; Foundry `journalPages.js` | "a discharged soldier who liked the view and had nowhere better to be" (all thorp) |
| tier-noun | town | `culturalIdentity.defensePattern` | 14 | 14 | web: none found; PDF `cultureOnPage.js :: RAW_CULTURE_ROWS` "Defense" (town tier or larger only, row-gated) | "Civic musters come first; paid guards are added only when a threat lasts and the town can pay." (hamlet 5, thorp 3, village 3, metropolis 2, city 1) |
| defense-words | walls | `spatialLayout.layout` | 11 | 11 | web: none found (cut from `OverviewTab.jsx` by X-37; `SummaryTab.jsx` reads it but nothing imports it); PDF `IdentityDailyLife.jsx` "Layout" via `viewModel.js` l.295 | "Stone-walled holdings climbing a south-facing hillside" (all thorp) |
| defense-words | walls | `culturalIdentity.builtForm` | 8 | 8 | web: none found; PDF `cultureOnPage.js` "Built form" (town tier or larger only) | "Walled compounds, tiled roofs, axial streets, shop houses, and garden courts organize distinct wards." (village 7, hamlet 1) |
| defense-words | walls | `culturalNotes` | 8 | 8 | web: none found; PDF notes box `IdentityDailyLife.jsx` via `cultureOnPage` (generated default prints only at town tier or larger); Foundry `journalPages.js` "Cultural notes" | the same sentence as the builtForm row (`culturalNotesFor` = socialTexture + builtForm), at the same 8 places |
| defense-words | soldiers | `npcs[].physical.clothes` | 8 | 8 | none found (X-48: `viewModel.js` l.726 says the look "prints nowhere") | "soldier's practical dress with officer's insignia" (town 7, hamlet 1) |
| defense-words | hospital | `institutions[].desc` | 7 | 7 | web: `InstitutionsTab.jsx :: institutionDescription` | "May operate hospital/school." (all town) |
| defense-words | soldiers | `institutions[].desc` | 6 | 7 | web: `InstitutionsTab.jsx :: institutionDescription` | "A district given to stables, horse-trade, and the farrier's craft, for any merchant, soldier, or traveller needing a new mount." (all town) |
| defense-words | walls | `history.historicalEvents[].lastingEffects[]` | 5 | 5 | web: `HistoryTab.jsx` HistoryEventCard, when expanded (l.154); PDF `viewModel.js` l.702 | "The merchant quarter and the labourers' quarter remain walled apart" |
| defense-words | walls | `history.legacyAnnotations[].annotation` | 4 | 4 | web dossier: none (`generalStateProse.js :: legacyPoolKey` reads it and never prints it); `TableView.jsx` via `tonightAtTheTable.js` TWIST body (top annotation only) | "What it left behind (the merchant quarter and the labourers' quarter remain walled apart) is still part of the place." |
| defense-words | walls | `culturalIdentity.architecturalDetail` | 4 | 4 | web: none found as a field (its words reach `arrivalScene`); PDF `IdentityDailyLife.jsx :: architectureLineOf` (gated by `architecturalDetailRefused`) | "gates, low walls, and planted courtyards divide public from household space" (all village) |
| defense-words | soldiers | `availableServices.equipment[].desc` | 3 | 3 | web: `ServicesTab.jsx` → `serviceComponents.jsx` (desc, l.56) | "Practical clothing for soldiers and servants." |
| defense-words | walls | `history.currentTensions[].lastingEffects[]` | 3 | 3 | none found (`HistoryTab.jsx :: TensionRow` prints type, severity, description, issue and factions; PDF `viewModel.js` l.347 drops it) | "The merchant quarter and the labourers' quarter remain walled apart" |
| defense-words | walls | `arrivalScene` | 3 | 3 | web: `OverviewTab.jsx` (`overview-place-arrival`, l.347); PDF `Overview.jsx`; Foundry | "Gates, low walls, and planted courtyards divide public from household space." (all village) |
| defense-words | soldiers | `history.founding.reason` | 2 | 2 | web: `HistoryTab.jsx` Founding, "Origin" (l.294); PDF `HistoryFounding.jsx` | "began when a failed soldier received a land grant and discovered the soil was worth more than any battlefield" |
| defense-words | walls | `npcs[].presentation.impression` | 2 | 2 | none found (`npcComponents.jsx` l.349: "`impression` stays dark") | "The walls are covered with charts weighted down by stones." |
| defense-words | garrison | `institutions[].desc` | 2 | 2 | web: `InstitutionsTab.jsx :: institutionDescription` | "They hire out by the day for escort, garrison duty, and brief campaigns: less costly than keeping an army, more dependable than a rabble." |
| defense-words | garrison | `availableServices.employment[].desc` | 2 | 2 | web: `ServicesTab.jsx` → `serviceComponents.jsx` | "Hire trained soldiers for military campaigns, garrison duty, and escorts." |

The garrison rows have the detail "garrison without a garrison": these places have a hired company but no garrison.

By field, counting places across every word: `institutions[].desc` 52, `history.founding.foundedBy` 18, `culturalIdentity.defensePattern` 14, `spatialLayout.layout` 11, `culturalIdentity.builtForm` 8, `culturalNotes` 8, `npcs[].physical.clothes` 8, `history.historicalEvents[].lastingEffects[]` 5, `history.legacyAnnotations[].annotation` 4, `culturalIdentity.architecturalDetail` 4, `availableServices.equipment[].desc` 3, `history.currentTensions[].lastingEffects[]` 3, `arrivalScene` 3, `history.founding.reason` 2, `npcs[].presentation.impression` 2, `availableServices.employment[].desc` 2.

## Totals: they reconcile

- **Places.** 300 places: 108 are in the pool, 103 are `needs_review`, 11 have count > 0, and 97 are `needs_review` with count 0. These are GEN11-108's figures, every one.
- **Findings.** The receipts hold 149 findings at the 103 places, and the census attributed all 149: 135 `defense-words` and 14 `tier-noun`. There are no other checks and no `unnamed`. The table's findings column sums to 149.
- **By word.**
  - walls: 86 findings at 64 places
  - soldiers: 38 findings at 33 places
  - tier-noun: 14 findings at 14 places
  - hospital: 7 findings at 7 places
  - garrison: 4 findings at 2 places

  These match GEN11-108's 64, 33, 14, 7 and 2 places. GEN11-108 gave places, not findings, for garrison.
- **Places by row.** The table's places column sums to more than 103, because one place can carry findings in several fields.

## Writers (`path :: symbol`)

- `institutions[].desc`: `src/generators/steps/assembleInstitutions.js :: settlementDensity` (`inst.desc = speakTierNoun(…DESC_V…)`, l.1004) and `src/generators/steps/institutionDescDraw.js :: drawInstitutionDesc`. The text is from `src/data/institutionDescVariants.js` ("A walled plot…", l.206) and `src/data/institutionalCatalog.js` ("May operate hospital/school.").
- `history.founding.foundedBy`, `history.founding.reason`: `src/generators/narrativeGenerator.js :: genArrivalDetail` (`FOUNDERS_BY_TIER`, l.313; `reason`/`foundedBy`, l.424–425), called from `src/generators/historyGenerator.js` l.956 and spoken by `speakFounding` (l.1025).
- `culturalIdentity.defensePattern`, `.builtForm`, `.architecturalDetail`: `src/data/cultureProfiles.js :: materializeCulturalIdentity`, called from `src/generators/steps/resolveConfig.js` l.174. The rows are in `cultureProfiles.js`: defensePattern l.527, builtForm l.321, architecturalDetail l.608.
- `culturalNotes`: `src/generators/steps/assembleSettlement.js` l.174 (`culturalNotesFor`, from `src/data/cultureProfiles.js :: culturalNotesFor`).
- `spatialLayout.layout`: `src/generators/spatialGenerator.js :: generateSpatialLayout` (`thorpLayouts.hills`, l.260; `LAYOUT_BY_TIER`, l.264), called from `src/generators/steps/economyReconcilePass.js` l.197.
- `npcs[].physical.clothes`: `src/generators/npcGenerator.js :: generateSingleNPC` (l.157), with the text from `src/data/npcData.js` l.403.
- `npcs[].presentation.impression`: `src/generators/npcGenerator.js :: pickTitle` (l.550), with the text from `src/data/people/titleSecretsPresentations.js` (l.365).
- `history.historicalEvents[].lastingEffects[]`: `src/generators/historyGenerator.js :: generateEventNarrative` (l.338, `sizedLastingEffects`), with the text from `src/data/historyData.js` l.1159.
- `history.currentTensions[].lastingEffects[]`: `src/generators/historyGenerator.js :: buildHistoricalEvent` (the tension map, `...tension`, l.581–583; called at l.974). The text is from `src/data/historyData.js` l.1946.
- `history.legacyAnnotations[].annotation`: `src/generators/legacyGenerator.js :: deriveLegacyAnnotations` / `buildAnnotation` (l.292), stored by `src/generators/steps/generateNarratives.js` l.122–126.
- `availableServices.equipment[].desc`, `availableServices.employment[].desc`: `src/generators/servicesGenerator.js :: generateAvailableServices`. The catalogue rows are in `src/data/institutionServices.js` ("Working clothes (bulk)", l.450; "Mercenary hire", l.962).
- `arrivalScene`: `src/generators/narrative/arrivalScene.js :: generateArrivalScene` (its sight beat reads `culturalIdentity.architecturalDetail`, l.319), set by `src/generators/steps/assembleSettlement.js` l.254.

## EXECUTED vs INFERRED

**EXECUTED**

- **The census.** It ran as six vitest processes, one per size, and each exited with 0; each wrote 50 rows.
- **The counts.** The places, findings and field-path counts, the reconciliation to GEN11-108, and the checks `walkMatches`, `countsMatch` and `detailsMatch` (103/103 each) all come from the tally over those rows.

**INFERRED (code reading, not run)**

- **The "printed by" column.**
  - This is a key search by containment plus reading the matched lines; no page was rendered.
  - Whether a gated row actually prints at a given place was not evaluated: the PDF's town-or-larger rule, `architecturalDetailRefused`, and the HistoryEventCard's expand.
  - On the PDF's town-or-larger rule: most of the culture-row findings are at hamlet, village and thorp tiers, where that rule says the raw rows do not print.
- **The writers.**
  - These come from searches for assignments plus reading the source data lines that hold each example text.
  - The services writer's exact assignment line inside `generateAvailableServices` was not pinned.
  - `settlementDensity` is the nearest top-level function enclosing `assembleInstitutions.js` l.1004.
- **Path caveat.** A string reachable by two paths is credited to the first path in key order: the walk's `seen` set and the `town` Set de-duplicate, as the receipt's own walk does.

## Files

Committed beside this report:

- `gen11-fields.census.mjs` (the census)
- `vitest.gen11f.config.mjs` (a copy of `vitest.map.config.mjs`, rooted at `GEN11F_ROOT`)
- `tally-gen11-fields.mjs` (the tally)

Run, from the worktree root `$W`:

```
for s in thorp hamlet village town city metropolis; do ( GEN11F_ROOT=$W \
  GEN11F_FILE=$W/docs/chair/2026-11-20/content/prose/map/gen11-fields/gen11-fields.census.mjs \
  GEN11F_SIZES=$s GEN11F_N=50 GEN11F_OUT=$SCR/rows.$s.jsonl \
  npx vitest run --config $W/docs/chair/2026-11-20/content/prose/map/gen11-fields/vitest.gen11f.config.mjs > $SCR/log.$s.txt 2>&1 ) & done; wait
node docs/chair/2026-11-20/content/prose/map/gen11-fields/tally-gen11-fields.mjs $SCR
```

The JSONL rows stay local, in the helper's scratchpad `gen11f/` folder:

| file | size (bytes) |
|---|---:|
| `rows.thorp.jsonl` | 21199 |
| `rows.hamlet.jsonl` | 26271 |
| `rows.village.jsonl` | 17811 |
| `rows.town.jsonl` | 26053 |
| `rows.city.jsonl` | 5117 |
| `rows.metropolis.jsonl` | 6623 |
