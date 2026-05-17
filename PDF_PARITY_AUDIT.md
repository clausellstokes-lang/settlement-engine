# PDF Parity Audit

Research-only inventory comparing every on-screen tab to its PDF section. Goal: identify what each tab renders, what the PDF currently renders, and the explicit gap to drive a rewrite. Field paths are taken from the actual `settlement.*` shape used in tab code, with conditionals noted.

The PDF data layer is `src/pdf/lib/viewModel.js` — already a slim selector. Many tabs read `settlement.*` directly while the PDF reads `vm.*`, so a large class of gaps can be closed by widening viewModel slices rather than rewriting pages.

---

## 1. Summary Tab

- **Tab source**: `src/components/new/SummaryTab.jsx`
- **PDF section**: NONE (no counterpart at all — Cover.jsx is just a title page)
- **What the tab renders**:
  - Identity header line: `settlement.name`, `settlement.tier`, `settlement.population.toLocaleString()`, `settlement.dominantRace`, `settlement.terrain`
  - Active crisis banner: derived from `settlement.stress` (`siege`, `famine`, `occupied`, `plague`, `civilWar`, etc.) — one chip per active stress + descriptive line
  - Arrival scene prose: `settlement.aiNarrative.arrivalScene` (AI mode) or fallback raw template
  - Pressure sentence: `settlement.aiNarrative.pressureSentence` (AI mode) or derived from stress + viability
  - 3-tile situation row:
    - Power: `settlement.governanceType` + governing faction name from `settlement.factions[].isGoverning`
    - Economy: `settlement.economicComplexity` + primary export from `settlement.primaryExports[0]`
    - Defense: `settlement.defenseReadiness.label` + average of `settlement.defenseScores.{military,monster,internal,economic,magical}`
  - Power & Conflict panel: each faction as `FactionBar` (name, power 0–100 bar, isGoverning flag) + tensions count
  - Prominent relationship card: `settlement.prominentRelationship` (with type, otherSettlement, description) — conditional, from runtime relationship engine
  - Key Figures grid: top 4 NPCs from `settlement.npcs` sorted by `power`, each with `name`, `title`, `factionAffiliation`, `characterSentence(r)` (`personality` or first plot hook)
  - Collapsible plot hooks list: aggregated from NPCs/conflicts/safety/history (same source as PlotHooksTab)
  - Setting accordion: terrain detail, layout, age, regional context, governmentType, tradeAccess
  - Institutions accordion: counts by category, source badges (REQ/forced/auto-resolved)
- **What the PDF renders**: Cover.jsx renders only `name`, `tier`, `dominantRace`, `terrain`, AI badge, and the date. Nothing else from SummaryTab.
- **Gap**: ENTIRE TAB MISSING. Cover is a title plate, not a summary page. The summary tab is the on-screen "elevator pitch" and has no equivalent print page.
- **Rendering notes**: SummaryTab is the most opinionated tab — its layout assumes interactive collapsibles. For PDF, the situation row + arrival scene + pressure sentence + key figures grid + active crisis banner is the highest-value subset.

---

## 2. Overview Tab

- **Tab source**: `src/components/new/tabs/OverviewTab.jsx`
- **PDF section**: `src/pdf/sections/Overview.jsx` (chapter 01)
- **What the tab renders**:
  - Identity strip + key facts: `name`, `tier`, `population`, `dominantRace`, `terrain`, `layout`, `age`, `governmentType`, `tradeAccess`, `founding.summary`
  - Active crisis: `settlement.stress` (object keys → labelled chips with summaries) + each stress's `stressHook` (one-line plot hook per crisis — currently dropped by PDF)
  - **Systems Health Dashboard**:
    - Tile: prosperity (`settlement.prosperity`)
    - Tile: safety (`settlement.safety`)
    - Tile: viability verdict (`settlement.viability.verdict` — viable/marginal/notViable)
    - Tile: defense readiness label (`settlement.defenseReadiness.label`)
    - Score bars: `settlement.defenseScores.{military,monster,internal,economic,magical}` (5 bars, 0–100)
    - Enforcement ratio: `settlement.safetyRatio` (e.g. 0.32 watch:pop)
    - Food deficit bar: `settlement.foodBalance.{deficit,surplus,production,need,importCoverage}` rendered as proportional bar
  - Tensions & Conflicts list: `settlement.tensions[]` (label, severity, description) + `settlement.conflicts[]` (parties, description, plotHooks)
  - Situation block: `settlement.aiNarrative.arrivalScene`, `settlement.aiNarrative.pressureSentence` (AI gate)
  - Settlement origin: `settlement.settlementReason` or `settlement.history.foundedBy` + `initialChallenge` + `overcoming` (multi-line origin story)
  - Notable connection: `settlement.prominentRelationship` (with otherSettlement + relationshipType + description)
  - Geography & Resources block: `settlement.terrain`, `settlement.terrainAdvantages[]`, `settlement.terrainCriticals[]`, `settlement.nearbyResources[]`
  - Spatial Layout: `settlement.quarters[]` with each quarter's `name`, `description`, `landmarks[]`
  - Warnings & Coherence Notes: `settlement.viability.coherenceNotes[]`, `settlement.viability.structuralSuggestions[]`, `settlement.warnings[]`
  - Institutions panel: full list grouped by category, with `category distribution bar` (% per category) + per-institution source badges (REQ / forced / auto-resolved) from `inst.source` field
- **What the PDF renders**:
  - Thesis callout (`vm.overview.thesis` — AI-only)
  - 4 stat tiles: pop / age / prosperity / safety (with prosperity/safety tone)
  - Character paragraph: `vm.overview.character` (sourced from `settlement.history.historicalCharacter`)
  - Active crises: pills + per-crisis labelled summary line (from `vm.overview.stress[]`)
  - 3-column "At a Glance": Economy (complexity + economyOutput + 3 exports), Defense (readiness label + defense avg + magicDependency flag), Society (factions/NPCs/institutions counts + tensions count)
- **Gap**: Major. Missing from PDF:
  - `stressHook` per crisis (currently the engine-generated hook line attached to each stress is dropped)
  - **Entire Systems Health Dashboard**: 5 score bars, enforcement ratio, food deficit bar
  - Tensions & Conflicts list with descriptions and plot hooks (PDF only shows a count)
  - Arrival scene + pressure sentence prose
  - Settlement origin / settlement reason narrative
  - Prominent relationship card
  - Geography detail (terrainAdvantages, terrainCriticals, nearbyResources)
  - Spatial Layout: quarters with descriptions and landmarks
  - Warnings + coherenceNotes + structuralSuggestions
  - Institutions panel with category distribution + source badges
- **Rendering notes**: Defense score bars are visual; PDF's existing `BarMeter` already handles them. Food deficit bar is the same shape. Spatial layout (quarters with landmarks) and institutions distribution-bar both need new helpers — the existing primitives can render them but viewModel must surface the data.

---

## 3. Identity & Daily Life

- **Tab source**: `src/components/new/tabs/DailyLifeTab.jsx`
- **PDF section**: `src/pdf/sections/IdentityDailyLife.jsx` (chapter 02)
- **What the tab renders**:
  - Anchor facts panel:
    - Settlement: `name` + `tier`
    - Economy: `prosperity` + `economicComplexity` label
    - Safety: `safety` + `safetyLabel`
    - Food: `foodBalance.deficit` or `surplus` (with units)
    - Governed by: governing faction name from `factions[].isGoverning`
    - Terrain: `terrain` + `layout`
    - Culture: `dominantRace` + `culturalNotes` (if present)
    - Access: `tradeAccess` (label)
    - Defense: `defenseReadiness.label` + score average
    - Magic: `magicDependency` flag + `magicalCapability`
    - Active stress: list from `settlement.stress` (active keys only)
  - "Generate AI Narrative" button (interactive — irrelevant for PDF)
  - Five AI prose passages: `settlement.aiDailyLife.{dawn,morning,midday,evening,night}`
- **What the PDF renders**:
  - Identity definition rows: Name, Tier, Population, Dominant Race, Terrain, Layout, Age, Government, Trade Access, Founded (founding.summary)
  - Quarters pills (name only)
  - Daily Life: AI passages (when `vm.daily.hasPassages`) OR food balance fallback callout + "generate AI" copy
- **Gap**: Significant.
  - Anchor facts panel is tab-side only — none of: governing faction line, safety label, food units phrasing, magic dependency flag, magical capability, active stress list, cultural notes
  - Quarters: tab-side has `description` and `landmarks[]`; PDF shows name only
  - PDF has Identity rows the tab does not (Founded date), so identity in the PDF is roughly OK but quarters/anchors are thin
- **Rendering notes**: This is the closest-to-parity section; main missing element is the per-quarter detail and anchor facts panel for non-AI exports. Conditional: `cultureNotes` and `magicalCapability` only render when populated.

---

## 4. Power Structure

- **Tab source**: `src/components/new/tabs/PowerTab.jsx`
- **PDF section**: `src/pdf/sections/PowerStructure.jsx` (chapter 03)
- **What the tab renders**:
  - Public Legitimacy banner: `settlement.legitimacy.score` (0–100), `settlement.legitimacy.label`, `settlement.legitimacy.breakdown` (chips: e.g. `+10 economic`, `−5 fractured`), `settlement.legitimacy.governanceFractured` boolean (warning callout)
  - Stability + governing authority header: `settlement.stability`, governing faction name + criminal capture badge from `settlement.criminalCapture`
  - Power distribution: stacked horizontal bar showing all factions proportionally + per-faction row (sorted by power), each row expandable with:
    - `faction.name`, `faction.power` (0–100), `faction.powerLabel` (label), `faction.rawPower` (numeric power before modifiers), `faction.isGoverning` flag
    - `faction.description` / `faction.desc` (multi-sentence faction blurb)
    - `faction.category` (e.g. trade, religious, criminal, military)
    - `faction.crisisNote` (one-line crisis indicator if active)
    - `faction.modifiers[]` (each with `label` + `delta`, e.g. "+15 prosperity", "-10 stress")
    - Sub-faction groups: `faction.subFactions[]` or `faction.matchedGroups[]` with member NPC names
  - Tensions list: `settlement.tensions[]` with `severity` badge, `factions[]`, `description`
  - Active conflicts: `settlement.conflicts[]` with `parties`, `issue`, `stakes`, `intensity` level, `plotHooks[]`
- **What the PDF renders**:
  - Stability box, legitimacy box (score + label only — NOT breakdown), criminal capture box, governanceFractured callout
  - Faction cards: name + power meter + AI blurb (vm.power.factions[].blurb) + modifiers as pills
  - Recent conflict callout (`vm.power.recentConflict`)
  - Tensions list (label/type/description)
  - Internal conflicts list (parties + description)
- **Gap**: Substantial.
  - Legitimacy `breakdown` chips
  - Stacked power-distribution bar (all factions in one visualisation)
  - Per-faction `description`, `category`, `crisisNote`, `powerLabel`, `rawPower`
  - Sub-faction groups / matchedGroups / member NPC names
  - Modifier `delta` values (PDF shows label only, not the +/- value)
  - Tension `severity` badges + `factions[]` parties (PDF shows label/desc only)
  - Conflict `issue`, `stakes`, `intensity` level
  - Plot hooks attached to each tension and each conflict (engine surfaces them; PDF drops them — they only reach the consolidated PlotHooks chapter)
- **Rendering notes**: viewModel.js's `powerSlice` already filters faction fields. The blurb the PDF shows is the AI-generated factionBlurb, NOT `faction.desc` — so even raw exports lose the engine description. Modifier `delta` is currently coerced to a label string when it could be `+15` or similar.

---

## 5. Economics & Trade

- **Tab source**: `src/components/new/tabs/EconomicsTab.jsx`
- **PDF section**: `src/pdf/sections/EconomicsTrade.jsx` (chapter 04)
- **What the tab renders**:
  - Prosperity header
  - 2 at-a-glance tiles: Economy (`economyOutput` + `economicComplexity`) and Food (`foodBalance.{deficit,surplus,production,need,importCoverage,agricultureModifier,stressModifier}`)
  - Income sources bars: `settlement.incomeSources[]` with `source`, `percentage`, `desc`, `isCriminal` flag
  - Trade profile: `settlement.primaryExports[]`, `settlement.primaryImports[]`, `settlement.isEntrepot` (flag), `settlement.terrainCriticals[]`, `settlement.necessityImports[]` (flag), `settlement.localProduction[]`
  - Food security with balance bar (`foodBalance.production` vs `foodBalance.need`) + narrative paragraph from `foodBalance.summary`
  - **Economic Flows**: filter tabs (all/impaired/productive/entrepot/magic/services). Each flow chain is a card with:
    - `chain.name`, `chain.status` (productive/impaired/entrepot/magic/services), status badge
    - `chain.processingInstitutions[]`
    - `chain.outputs[]`
    - `chain.dependency` (e.g. magic-dependent)
    - `chain.incomeContribution` (numeric or %)
    - Institutional services section: chains tagged as service-type
  - Economic plot hooks: from `chain.plotHooks[]` and `viability.economicHooks[]`
  - Supply chains visualization
  - Resource exploitation block: `settlement.resourceExploitation.{full,partial,unexploited}` lists
  - Shadow economy section:
    - `settlement.shadowEconomy.captureRate` (% of economy)
    - `settlement.shadowEconomy.operations[]` (each with name + description)
    - `settlement.shadowEconomy.criminalChains[]`
    - `settlement.shadowEconomy.crimeTypes[]`
- **What the PDF renders**:
  - 4 stat tiles: prosperity, complexity, economyOutput, tradeAccess
  - Income sources bars with desc (criminal flagged via `tone="bad"`)
  - 3-column trade flows: Exports / Imports / Local Production
  - Entrepôt callout
  - Critical trade dependencies pills (combined `tradeDependencies` + `criticalImports`)
  - Food balance callout (deficit OR surplus only — no production/need)
  - Active economic issues pills (severity + title only)
  - Underworld hooks short list
- **Gap**: Major.
  - Food details: `production`, `need`, `importCoverage`, `agricultureModifier`, `stressModifier`, `summary` narrative (PDF gives only the deficit/surplus number)
  - **Economic Flows entirely missing**: chain status, processing institutions, outputs, dependency, income contribution
  - Institutional services breakdown
  - **Shadow economy entirely missing**: capture rate, operations, criminal chains list, crime types from this lens (PDF shows them only on the Defense page)
  - Resource exploitation block (PDF puts it on Resources chapter; tab also has it on Economics for cross-reference)
  - Necessity imports flag, terrain criticals as a distinct list
  - Issue `description`, `priorityNote`, `suggestedFixes` (PDF shows severity + title only)
  - Per-chain plot hooks
- **Rendering notes**: Economic flows are the biggest single gap on this page — it's a card-list of chain objects with status badges. ViewModel doesn't surface chains today; needs a new slice.

---

## 6. Defense & Security

- **Tab source**: `src/components/new/tabs/DefenseTab.jsx`
- **PDF section**: `src/pdf/sections/DefenseSecurity.jsx` (chapter 05)
- **What the tab renders**:
  - Defense overview header: `settlement.defenseReadiness.label` + tile, `settlement.terrain` strategic value, `settlement.guardAssessment` text
  - Active military status banner (stress override): `settlement.stress.{siege,occupied,civilWar}` triggers a coloured banner overriding readiness
  - Threat assessment: 5 expandable threat cards (one per `settlement.defenseScores` key + `settlement.threats.{military,monster,internal,economic,magical}` containing `score`, `description`, `factors[]`)
  - **Criminal architecture & public order**:
    - Internal security banner (from `settlement.publicOrder` + `settlement.lawEnforcement`)
    - Criminal structure classification: `settlement.criminalCapture.{label,classification,score,description}`
    - Active criminal operations: `settlement.criminalOperations[]` with name, scope, target
    - Criminal faction: `settlement.factions[]` filtered by `category === 'criminal'` (full faction card)
    - Crime types: `settlement.crimeTypes[]`
    - Order/crime plot hooks: `settlement.plotHooks` filtered by source
  - Armed forces (each conditional on the institution existing):
    - Fortifications/walls: `settlement.institutions[]` filter for type=walls
    - Standing forces: garrison + militia + watch institutions
    - Mercenary: mercenary institution (with `notableUnits`, `loyaltyNote`)
    - Charter: adventurer charter institution
    - Arcane: magicDef institution + `arcaneCorps` data
  - Supporting capabilities: `economicBacking`, `magicalCapability`, `legalSystem`, `medicalCapability`, `logistics`, `navalCapability` (each with label + description)
  - Vulnerabilities list: `settlement.defenseVulnerabilities[]` or derived from low-score defenseScores keys
- **What the PDF renders**:
  - Readiness pill banner (label only)
  - Threat scores: 5 BarMeters from `vm.defense.scores.{military,monster,internal,economic,magical}` (numeric only)
  - Defense institutions: 7 fixed pills (walls/garrison/militia/watch/mercenary/charter/magicDef) — present/absent
  - Crime & Safety summary row (3 small stats): safetyLabel, safetyRatio, foodResilience
  - Crime types pills
  - Criminal organisations: bullet list (name only)
  - Black market callout
- **Gap**: Substantial.
  - Threat `description` + `factors[]` per threat type (PDF shows numeric score only)
  - Active military status override banner (when sieged/occupied/civil war)
  - Guard assessment text
  - `criminalCapture.{classification,score,description}` (PDF gets a callout but only the label)
  - Active criminal operations (each operation's scope + target)
  - Criminal faction full card
  - Order/crime plot hooks
  - Per-institution detail: notableUnits, loyaltyNote, arcaneCorps, etc. (PDF shows just present/absent pill)
  - Supporting capabilities entirely missing: economicBacking, magicalCapability, legalSystem, medicalCapability, logistics, navalCapability
  - Defense vulnerabilities list
- **Rendering notes**: PDF currently treats defense as a checklist of institutions; tab treats it as a layered narrative (overview → threats with factors → criminal architecture → armed forces detail → supporting capabilities). The `factors[]` for each threat is the most important loss because it explains the score.

---

## 7. Services & Institutions

- **Tab source**: `src/components/new/tabs/ServicesTab.jsx`
- **PDF section**: `src/pdf/sections/ServicesInstitutions.jsx` (chapter 06)
- **What the tab renders**:
  - Header strip: `settlement.institutions.length`, impairment counts (`impaired`, `degraded`, `vulnerable`)
  - Search box (interactive — N/A)
  - Category health grid: per-category mini-tile with health summary (impaired count vs total)
  - Notable absences: derived list of expected-but-missing institutions
  - Service categories: each category as a section with `ServiceItem` cards. Each card shows:
    - `inst.name`, `inst.category`, `inst.subCategory`
    - `inst.status` (impaired/degraded/vulnerable/healthy)
    - `inst.statusReason` (string)
    - `inst.servicesOffered[]` (list of services)
    - `inst.chainDepth` (lookup against supply chains)
    - `inst.source` (REQ / forced / auto-resolved badge)
    - `inst.notableUnits`, `inst.notes`, `inst.staffing` (varies by category)
    - Criminal category gets red treatment (criminal categories are special-cased)
- **What the PDF renders**:
  - Institutions grouped by category: each category labelled with count + colour dot, then institutions as muted pills (name only)
  - Available services: per-category lists from `vm.services.available` rendered as green pills
  - Active supply chains: short list of chain names + descriptions
- **Gap**: Substantial.
  - Header impairment counts (impaired/degraded/vulnerable totals)
  - Per-institution `status`, `statusReason`, `servicesOffered`, `chainDepth`, `notableUnits`, `notes`, `staffing`, `subCategory`
  - Source badges (REQ / forced / auto-resolved) — important for GMs to know what was hand-placed
  - Notable absences (gap analysis)
  - Category health grid (counts of healthy vs impaired per category)
  - Special criminal-category treatment
- **Rendering notes**: Tab gives institutions individual depth; PDF reduces them to name pills. The `inst.source` field is in the data and just not consumed by viewModel.

---

## 8. Resources & Production

- **Tab source**: `src/components/new/tabs/ResourcesTab.jsx`
- **PDF section**: `src/pdf/sections/ResourcesProduction.jsx` (chapter 07)
- **What the tab renders**:
  - Terrain identity header + economic strengths list (`settlement.economicStrengths[]`)
  - Resource exploitation: 3 columns (unexploited/partial/full) — each item shows `name`, `chainStatus`, and a chain-flow visualization linking resource → processing institution → output
  - Nearby resources: `settlement.nearbyResources[]` split into depleted/abundant/commodities (with `name`, `quantity`, `quality`, `accessibility`)
  - Export potential: `settlement.exportPotential[]` (resource + estimated value)
  - Gaps & opportunities: `settlement.viability.priorityNotes[]` + `settlement.structuralGaps[]` with severity
  - Terrain effects: `settlement.terrainEffects[]` (modifier list with effect description)
- **What the PDF renders**:
  - Terrain pill + strategic value callout (`vm.resources.strategicValue`)
  - Economic strengths pills
  - Resource exploitation 3-column list (item names only)
  - Imports section split critical/recommended (NOT in tab — derived in viewModel)
- **Gap**: Notable.
  - Per-resource chain status + chain-flow visualization (resource → institution → output)
  - Nearby resources detail (`quantity`, `quality`, `accessibility`, depleted/abundant/commodities split)
  - Export potential (`resource` + `estimatedValue`)
  - Gaps & opportunities (`priorityNotes`, `structuralGaps` with severity)
  - Terrain effects list
- **Rendering notes**: The chain flow visualisation (resource → institution → output) is a graphical layout that needs a new helper — could degrade to a `Resource ▶ Institution ▶ Output` text row in PDF. Imports are PDF-only (the tab focuses on what's HERE).

---

## 9. Viability Assessment

- **Tab source**: `src/components/new/tabs/ViabilityTab.jsx`
- **PDF section**: `src/pdf/sections/ViabilityAssessment.jsx` (chapter 08)
- **What the tab renders**:
  - Viability verdict banner: `settlement.viability.verdict` (notCoherent/marginal/coherent) + summary
  - Magic dependency warning (when `settlement.magicDependency`): list of `settlement.viability.activeMagicChains[]`
  - By-design contradictions: `settlement.viability.byDesignContradictions[]` (intentional tensions noted at gen-time)
  - Structural crises: `settlement.viability.structuralCrises[]`
  - Critical issues with suggested fixes: `viability.criticalIssues[]` each with `title`, `description`, `severity`, `suggestedFixes[]`, `institution`
  - Other issues: lower-severity items
  - Stress consequences: `settlement.viability.stressConsequences[]` per active stress
  - Warnings: `settlement.viability.warnings[]` and `settlement.warnings[]`
- **What the PDF renders**:
  - Verdict callout (good/bad/uncertain) with summary
  - Active issues table (severity pill + title + institution + description) — collapses critical/other into one list
  - Warnings list
  - Structural violations list
  - Active stress pills
  - Key Metrics dump (first 8 entries from `vm.viability.metrics` — generic key/value)
- **Gap**: Moderate.
  - Magic dependency dedicated panel + activeMagicChains list
  - By-design contradictions section (intentional vs unintentional differentiation)
  - `suggestedFixes[]` per issue (PDF shows description but not the fixes)
  - `priorityNote` per issue
  - Stress consequences list (per-stress consequence text)
- **Rendering notes**: PDF version of this is roughly OK — it gets the verdict, severities, descriptions and warnings. The big miss is `suggestedFixes[]` which is the actionable GM content. By-design contradictions are also semantically important (these are NOT bugs, they're intentional).

---

## 10. History & Founding

- **Tab source**: `src/components/new/tabs/HistoryTab.jsx`
- **PDF section**: `src/pdf/sections/HistoryFounding.jsx` (chapter 09)
- **What the tab renders**:
  - Identity header
  - Visual timeline: dots/labels with anchored flags + event-type colour legend (e.g. catastrophe red, founding gold)
  - Current tensions: `settlement.tensions[]` with severity badges + plot hooks per tension
  - Founding section: `settlement.history.{origin,foundedBy,initialChallenge,overcoming,stressNote}` (multi-paragraph)
  - Major historical events: `settlement.history.events[]` sorted recent-first, each expandable with:
    - `type`, `severity`, `yearsAgo`, `recencyLabel` (e.g. "recent", "ancient")
    - `description`
    - `lastingEffects[]`
    - `plotHooks[]`
- **What the PDF renders**:
  - Age stat tile + `historicalCharacter` italic block
  - Founding callout (single paragraph from `founding.summary`)
  - Historical events list: yearsAgo badge + severity pill + type + description (sorted ascending)
  - Live tensions: short list with label + description
- **Gap**: Notable.
  - Visual timeline (replaceable with chronological ordering — PDF orders events but no visual marker)
  - Tab has `recencyLabel` per event ("recent"/"ancient")
  - Founding decomposition: `origin`, `foundedBy`, `initialChallenge`, `overcoming`, `stressNote` (PDF concatenates them all into one `founding.summary` blob)
  - Per-event `lastingEffects[]` and `plotHooks[]`
  - Per-tension severity badge + plot hooks
- **Rendering notes**: The founding info is structurally rich (5 distinct fields) but the PDF flattens it. A new founding sub-block can render the 5 fields as a definition list. Per-event plot hooks are the most valuable miss.

---

## 11. Notable NPCs

- **Tab source**: `src/components/new/tabs/NPCsTab.jsx`
- **PDF section**: `src/pdf/sections/NotableNPCs.jsx` (chapter 10)
- **What the tab renders**:
  - Header: pinned count, search box (interactive)
  - Influence filter: all/high/moderate/low
  - NPCs grouped by power faction (via `NPCCategoryGroup`): each NPC card shows:
    - `name`, `title`, `race`, `gender`, `age`
    - `factionAffiliation` (link)
    - `power` (numeric), `influence.label`, `influence.description`
    - `personality` (multi-sentence)
    - `appearance`
    - `motivation`, `secrets[]`
    - `plotHooks[]` (full list, not truncated)
    - `relationships[]` (NPC ↔ NPC links)
  - NPC relationships accordion: full `npcRelationships[]` list at bottom of tab (relationships between NPCs and to factions)
- **What the PDF renders**:
  - Tiered grouping: Major (≥70 power) / Notable (40–69) / Other (<40)
  - Major: full card with name, title, factionAffiliation, power pill, blurb, influence summary, up to 2 plot hooks
  - Notable: half-card 2-per-row with first plot hook only
  - Other: single-line listing (name, title, factionAffiliation only)
- **Gap**: Notable, but partial parity for top-tier NPCs.
  - `race`, `gender`, `age`
  - `personality` (multi-sentence) and `appearance` (the PDF blurb may be `personality` first sentence only)
  - `motivation`, `secrets[]`
  - Plot hooks beyond 2 (PDF caps at 2 even for major figures)
  - NPC ↔ NPC relationships per-NPC view
  - `influence.description` (PDF shows label only)
- **Rendering notes**: PDF's tiering pattern is good design; the issue is field depth per card. Adding `motivation` and `secrets[]` to FullCard would close most of the gap.

---

## 12. Plot Hooks & Quests

- **Tab source**: `src/components/new/tabs/PlotHooksTab.jsx`
- **PDF section**: `src/pdf/sections/PlotHooks.jsx` (chapter 11)
- **What the tab renders**:
  - Aggregates hooks from: NPCs (`npc.plotHooks[]`), faction conflicts (`conflict.plotHooks[]`), history tensions (`tension.plotHooks[]`), relationships (`prominentRelationship`/`neighbours[].plotHooks[]`), economic viability (`viability.economicHooks[]`), safety profile (`safetyProfile.hooks[]` / underworld hooks), history events (`history.events[].plotHooks[]`)
  - Filter by source (npc/conflict/crime/crisis/relationship/history)
  - Sort by priority (high/medium/low) or category
  - Each hook displays: `hook.text`, `hook.source`, `hook.sourceName` (e.g. NPC name), `hook.priority`, `hook.category` (e.g. mystery, intrigue)
- **What the PDF renders**:
  - Numbered list grouped by source (NPC / CONFLICT / CRIME / CRISIS) with source pill + count
  - Each hook: padded number + sourceName label + hook text
  - Underlying tensions list at bottom (label + description)
- **Gap**: Minor (PDF is roughly OK here but missing some sources).
  - Relationship-sourced hooks (`prominentRelationship`, `neighbours[].plotHooks[]`) — not in PDF source labels
  - History event-sourced hooks (`history.events[].plotHooks[]`)
  - Hook `priority` and `category` metadata (PDF treats hooks as untyped strings; tab sorts/filters by these)
- **Rendering notes**: This section is closest to parity. Adding `relationship` and `history` source buckets and surfacing `priority` (e.g. as a small priority dot) would close it.

---

## 13. Relationships

- **Tab source**: `src/components/new/tabs/RelationshipsTab.jsx`
- **PDF section**: `src/pdf/sections/Relationships.jsx` (chapter 12)
- **What the tab renders**:
  - Neighbour network cards: each `settlement.neighbours[]` with `neighbourName`, `relationshipType` (rival/allied/etc.), `description`, `plotHooks[]`, `lastEvent`, `flavour` text
  - Cross-settlement NPC contacts: `crossSettlementNPCContacts[]` (NPCs that span multiple saves)
  - Cross-settlement engagements: conflict + faction items spanning multiple settlements (`crossConflicts[]`, `crossFactions[]`)
  - Emergent conditions banner: derived state (e.g. "isolated", "trade hub", "frontier outpost")
  - NPC relationships section: full list with type filter (ally/rival/family/professional) and From filter
  - Factions: list of factions with relationship lines between them
  - Active conflicts: `settlement.conflicts[]` (already on power tab, repeated for context)
- **What the PDF renders**:
  - Neighbour network rows: name | RelPill | description (no plot hooks, no lastEvent, no flavour)
  - Single live neighbour card (when no saved neighbours exist)
  - Inter-settlement relationships ("Shared Figures & Stories"): `npcName`/title + RelPill + description + otherSettlement
  - Cross-settlement conflicts: title + description
  - Internal relationships: short bulleted list (label + description)
- **Gap**: Notable.
  - Per-neighbour `plotHooks[]`, `lastEvent`, `flavour`
  - Cross-settlement NPC contact detail (PDF lumps them with relationships)
  - Emergent conditions banner
  - NPC ↔ NPC relationship type/From filter view
  - Factions panel (PDF refers user back to power chapter implicitly)
- **Rendering notes**: Roughly OK for raw neighbour and cross-settlement data; misses the relational-NPC section depth. Plot hooks per neighbour are dropped here AND on the consolidated Plot Hooks page (the source `relationship` is missing from PDF's hook aggregator).

---

## 14. DM Compass (AI Appendix)

- **Tab source**: `src/components/new/tabs/DMCompassTab.jsx` (AI-only — only registers when narrative content exists)
- **PDF section**: `src/pdf/sections/AIAppendix.jsx` (chapter 13, AI-only)
- **What the tab renders**:
  - DM Compass: `aiSettlement.dmCompass.{hooks[],redFlags[],twist}` — 3 hooks, 2 red flags, 1 twist sentence
  - Identity Markers: `aiSettlement.identityMarkers[]` (4–6 sensory/physical details)
  - Friction Points: `aiSettlement.frictionPoints[]` (3–5 named small-scale interpersonal grievances with `parties[]`)
  - Connections Map: `aiSettlement.connectionsMap[]` (4–8 NPC ↔ faction edges with `from`, `to`, `relationship`/`type`/`kind`, optional `note`)
- **What the PDF renders**:
  - DM Compass: numbered hooks list, red flags with `!` markers, twist callout
  - Identity Markers: 2-column tinted cards with optional `label`
  - Friction Points: numbered list with `parties` joined by `↔`
  - Connections Map: from | RelPill | to | optional note row
- **Gap**: Minimal. This section is full parity. The only minor difference is visual-only (tab uses cards, PDF uses styled rows) — same field set.
- **Rendering notes**: This is the cleanest parity in the dossier — likely because it was designed PDF-first with a tightly-scoped AI schema. Use as the template for parity in other sections.

---

## Tabs With No PDF Counterpart

- **SummaryTab** (`src/components/new/SummaryTab.jsx`) — entirely missing. Cover.jsx is a title plate, not a summary page. No "elevator pitch" page exists in the dossier.

(All other tabs have PDF sections, but with significant content gaps as itemised above.)

---

# Final Report

## 1. Total field gap count

Approximate count of distinct missing field-paths/blocks across all sections (counting nested fields and conditional sub-blocks as separate items):

- Summary tab: ~22 (entire tab missing)
- Overview: ~24 (Systems Health Dashboard alone is ~10)
- Identity & Daily Life: ~8
- Power Structure: ~14
- Economics & Trade: ~26 (Economic Flows + Shadow Economy are major blocks)
- Defense & Security: ~22 (threat detail + supporting capabilities)
- Services & Institutions: ~12
- Resources & Production: ~12
- Viability Assessment: ~6
- History & Founding: ~10
- Notable NPCs: ~10
- Plot Hooks: ~4
- Relationships: ~8
- AI Appendix: 0

**Total: roughly 178 distinct field/block gaps.** This aligns with the user's "PDF shows ~20–30%" estimate.

## 2. Top 3 most-broken sections

1. **Summary** — entire on-screen page has no PDF counterpart. The Cover renders 5 fields total; the tab renders ~30+.
2. **Economics & Trade** — Economic Flows, Shadow Economy, food balance details, and economic-issue suggested fixes are all dropped. Only the headline tiles + 3-column trade flows + a few pills remain.
3. **Defense & Security** — Threat scores survive but `factors[]` (the WHY of each score), supporting capabilities (legal/medical/logistics/naval), per-institution detail, and active military status overrides are all dropped.

## 3. Top 3 sections roughly OK

1. **AI Appendix** — full parity with DM Compass tab.
2. **Plot Hooks** — gets the four main source buckets and renders them with sourceName and numbering. Missing only relationship/history sources and priority/category metadata.
3. **Identity & Daily Life** — Identity definition rows are richer than the tab; Daily Life passages render fully when AI is on. Only quarter detail and the anchor-facts fallback panel are thin.

## 4. Tabs with no PDF counterpart

- **SummaryTab** — no equivalent; this is the largest single gap in the rewrite.

(`DMCompassTab`, `RelationshipsTab` and `neighbours` are conditionally registered tabs that DO have PDF counterparts.)

## 5. Data shapes that look likely to need new helpers

- **Stacked distribution bar** — Power tab's faction-power distribution and Overview tab's institution-category distribution. Both are proportional segments labelled by colour. New `<StackedBar>` primitive needed.
- **Chain-flow row** — Resource → processing institution → output. Used in ResourcesTab and EconomicsTab (Economic Flows). New `<ChainRow>` (or arrow/triangle bullet) primitive needed.
- **Score+factors expandable card** — DefenseTab threats render score + description + factors[]. Static analogue: card with score bar header + factors as bulleted list. New `<ScoreCard>` helper.
- **Visual timeline** — HistoryTab renders chronological dots/labels. PDF degrade-path: ordered list (already used) plus a year-anchored left rail; could be a thin column instead of a true timeline.
- **Stat-with-breakdown chips** — LegitimacyBanner uses `score` + `label` + `breakdown[]` chips. Reusable for Power, Defense, possibly Economy. New `<ScoreWithBreakdown>` helper.
- **Status-badged card list** — Economic Flows chains, Service institution cards, History event cards all share `name + status badge + description + sub-fields`. A single `<StatusCard>` primitive serving all three would reduce duplication.

The single highest-leverage change is widening `src/pdf/lib/viewModel.js` slices — many "missing" fields are already in `settlement.*` and just not surfaced.
