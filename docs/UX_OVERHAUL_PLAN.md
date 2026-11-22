# SETTLEMENTFORGE — Comprehensive UI/UX Overhaul Plan

> **Status:** Synthesis / design spec. Supersedes the per-surface design notes by merging them into one cohesive information architecture. Where the per-surface designs conflicted, the conflicts are resolved here in favor of the durable, reorganized architecture (see §3 and §7).
>
> **Author's correction to the source audits:** the audits repeatedly cite `src/components/settlement/CausalViewTabs.jsx` as a "fully built but mounted-nowhere" orphan to wire in. **That file does not exist** (`ls` confirms). It is therefore a **primitive to BUILD**, not a wiring fix. The genuinely-unused-but-present helpers are `deriveBlockadeRelief` and `deriveMagicPosture` in `src/domain/display/dossierViewModel.js` (both exported, both consumed by zero components — verified). Plan accordingly.

---

## 1. Executive Summary & Design Philosophy

### The problem in one sentence
SETTLEMENTFORGE grew from a constraint-driven town generator into a deterministic, causally-grounded **living geopolitical simulation** — but the UI still sells, navigates, and renders the *static generator*. The premium product (the simulation: advance-time / world pulse, the war layer, the religion/pantheon subsystem, the 15-variable causal substrate) is modeled in depth in the engine and is **almost entirely invisible** across every user-facing surface.

### The goal
Comprehensively overhaul the dossier, settlements view, settlement editor, PDF, world map, compendium, and about page so they are **cohesive with the engine's intent** — surfacing every system currently missing from the UI, for **3 audiences × 4 lenses**, with UX that does **not overwhelm** but layers depth so a new DM sees a clean surface and a worldbuilder can drill all the way down. Reorganize the information architecture where the durable answer requires it.

### The four design principles

1. **Progressive disclosure is the system, not a per-surface decision.** Today depth is layered inconsistently: `editMode` hides the whole engine in the dossier; a modal hides the simulation rules; anon-hiding hides the map; a scatter of flags (`dossierFiveTabs`, `summaryMagazineV2`, `simulationDrawer`, `tableView`) fork the dossier. We replace this with **one altitude axis** — `Overview → Detail → Engine` — applied identically everywhere, backed by a single persisted user preference, defaulted from the inferred lens.

2. **The living world made legible.** Every rich live state the engine computes (causal vars, pressures, settlement strength, war/siege/conquest, disposition, war-exhaustion, pantheon, the chronicle) gets a **read surface** where the DM already is — and a **"why" trace** (the engine already authors human-readable `contributors[]` reason strings). The simulation's payoff is the world *moving*; we surface `compareCausalState` deltas as the post-advance "what changed and why" moment.

3. **Honest, layered funnel.** anon → free → premium and new → power are **the same surfaces at different tiers of disclosure**, never separate apps. Premium value is sold by *showing the shape of the living world while it sits frozen* (a dormant substrate grid, an empty-but-labeled War & Faith section, a locked Realm preview) — structural teasers, never popups. Pricing copy is rewritten to name the actual product.

4. **Byte-identical when off / dormant-until-active is sacred.** Every new block self-gates to render **nothing** when its system is dormant (no campaign worldState, no assigned deity, peacetime, gate off). A peacetime / non-campaign / deity-free save must render exactly as it does today. This is the engine's contract; the UI must honor it.

### The 3 audiences
1. **ANONYMOUS** — no account. Generates up to town tier, 0 saves. Funnel-stage state.
2. **FREE** — account; town ceiling, 3 saves, PDF export. No custom content, no simulation, no campaigns.
3. **PREMIUM** — custom content authoring + **the simulation** (advance time) + campaigns + gallery + capital tier + unlimited saves. **The simulation IS the premium product.**

### The 4 lenses (cut across audiences)
- **(a) NEW DMs** — a good town fast, sensible defaults, NOT overwhelmed.
- **(b) INTERMEDIATE DMs** — presets + some control + plain-language understanding.
- **(c) POWER USERS** — all the knobs, the causal model, the simulation depth.
- **(d) WORLDBUILDERS** — the regional/campaign/geopolitical/pantheon scope; a consistent living world across many settlements.

---

## 2. Comprehensive System Inventory

Every engine system × the surface(s) that own it after this overhaul × current status. **"GAP"** = modeled in the engine, invisible (or nearly) in the UI today; this plan closes it. **"thin"** = partially surfaced. **"OK"** = adequately surfaced today.

### Causal substrate & settlement-local engine

| Engine system | Source | Owning surface(s) after overhaul | Status today |
|---|---|---|---|
| 15 causal SYSTEM_VARIABLES (score/band/`contributors[]` "why") | `causalState.js` `deriveCausalState` | Dossier → Systems → **Substrate** sub-tab; Editor "Causal State" card; PDF "State" chapter (Engine altitude) | **GAP** — consumed only by `structuralFingerprint.js` + AI grounding; rendered nowhere |
| `economic_capacity` (live war-affordability dial) | `causalState.js` | Dossier Economics + Substrate; Editor "Pressures & Strength" | **GAP** — appears in zero UI files |
| 4-dim system state (resilience/volatility/externalThreat/resourcePressure) | `deriveSystemState.js` / `SystemStateBar.jsx` | Dossier Summary (promoted to read view); PDF 03B | **thin** — mounted only in `SettlementDetail` editMode |
| 9 PRESSURE axes (+`reasons[]`) | `pressureModel.js` `deriveSettlementPressures` | Dossier Substrate; Editor "Pressures & Strength"; PDF (Engine altitude) | **GAP** — "pressure" in UI = prose `pressureSentence` only |
| `settlementStrength` + war-homeostasis (war_drain/war_exhaustion → economy → strength → peace) | `relationshipEvolution.js` | Dossier Substrate + War & Faith; Editor; Realm War panel | **GAP** |
| `warExhaustion` scar (non-reverting peace driver) | `worldState.warExhaustion` | Realm dashboard; Dossier War & Faith; library card pip | **GAP** — *no reader in `warStatus.js` exists*; needs a new pure selector |
| Food granary (live `storageMonths`, tithe/drawdown, blockade/famine/deployment, teleport/airship bypass) | `foodStockpile.js`; `deriveBlockadeRelief` | Dossier Economics (live granary gauge); PDF Economics | **thin** — only frozen `resilienceScore`/deficit% shown; `deriveBlockadeRelief` unused |
| 10-facet magic profile (legality/availability/risk + roles + deity coupling) | `magicProfile.js`; `deriveMagicPosture` | Dossier → Systems → **Magic** sub-tab; PDF Viability/Identity | **GAP** — zero component refs; `deriveMagicPosture` unused; only binary `magicDependency` shown |
| Population dynamics + `populationHistory` + migration flows | `populationDynamics.js` | Dossier World → History (post-pulse); Realm Chronicle | **GAP** — written each tick, no timeline surface |
| `compareCausalState` before/after deltas | `causalState.js` | Dossier "What changed & why" (post-advance); PDF Timeline | **thin** — wired only to `RegenerationDeltaCard` |

### Social / political layer

| Engine system | Source | Owning surface(s) | Status today |
|---|---|---|---|
| Ruling power: legitimacy bands, coup contender/verdict, `previousGovernments` lineage, conquest provenance | `rulingPower.js`, `coup.js` | Dossier Power ("Rule & Succession"); Editor; PDF Power | **GAP** — `CHANGE_RULING_POWER` event exists but no forecast/lineage read |
| Faction live state: momentum/exhaustion/rivals/internalSeats/lawPreferences/captureState | `factionCompetition.js` | Dossier Power (faction dashboard); Editor | **thin** — only captureState/momentum/rivals projected |
| NPC agency: goals+progress, ambition/loyalty, rivalryTargets, `consequenceIfRemoved` | `npcAgency.js`, `npcProfile.js` | Dossier World → NPCs (agency disclosure); Editor | **thin** — only name/title/goal.short + corruption flags |
| Criminal capture ladder + thieves-guild strength | `factionCapture.js`, `thievesGuild.js` | Dossier Power (underworld block) | **thin** — captureState rollup only |
| Institution lifecycle + fate history + faction control | `institutionLifecycle.js` | Dossier Institutions; PDF Institutions | **thin** — name/category mostly |
| Regional graph: 13 channel types, public/gm/hidden visibility, 10 relationship types | `region/graph.js`, `relationshipEvolution.js` | Realm Map overlays + legend; Dossier Relationships | **thin** — drawn on map (title-hover only), 1 `primaryRelationship` per NPC in dossier |
| Aggressiveness DISPOSITION (gov + NPC personality + W/L + deity temper) + standings | `disposition.js`, `dispositionLedger.js` | Dossier War & Faith; Realm War panel; library pip | **thin** — only map `LiveWarStatus` |
| Settlement STRATEGY posture (defend/hold/deploy/sue_for_peace) | `settlementStrategy.js` | Dossier War & Faith; Realm War panel | **GAP** — buried in chronicle text |

### Geopolitical war layer (premium, default off)

| Engine system | Source | Owning surface(s) | Status today |
|---|---|---|---|
| Deployments / armies abroad | `warDeployment.js`; `activeDeployments()` | Realm Map (deployment arrows) + War panel; Dossier; library pip | **thin** — text rows in map panel only |
| Coalition siege + verdict | `warDeployment.js`; `liveSieges()` | Realm Map (siege ring + coalition badge) + War panel; Dossier | **thin** — panel-only |
| Conquest / regime change (occupation authority) | `warDeployment.js` | Realm Map (occupation shading); Dossier Power lineage; PDF | **GAP** — shows as generic ruling-power change, war provenance lost |
| Per-commodity trade war | `tradeWar.js`; `liveTradeWars()` | Realm Map (prize glyph) + War panel; Dossier; PDF | **thin** — panel-only |
| `warLayerEnabled` gate | `simulationRules.js` | Realm → Rules (advanced systems group); Editor Faith/War cards | **GAP** — **no UI toggle anywhere**; omitted from `SimulationRulesDialog` TOGGLES |
| `settlementStrategyEnabled` gate | `simulationRules.js` | Realm → Rules (advanced); Editor | **GAP** — no UI toggle |
| War-layer calibration knobs (HOSTILE_CONFIDENCE, CONQUEST_MARGIN, SIEGE_K, tuning weights) | `disposition.js` etc. (frozen exports) | Realm → Rules → Expert pane | **GAP** — export-ready, no surface |

### Premium religion subsystem (premium, dormant-until-assigned)

| Engine system | Source | Owning surface(s) | Status today |
|---|---|---|---|
| 3-axis deity authoring (good/evil · warlike/peacelike · major/minor/cult) | `customContentSchema.js` | Compendium → Custom → Deities (+ effect preview) | **OK (authoring)** — but axis *effects* undocumented |
| Assign-primary-deity (the activation embed) | `PrimaryDeityPicker.jsx`, `setPrimaryDeity` | Editor "Faith & Pantheon" card; Realm/Pantheon assign entry | **thin** — dossier editMode only; no map entry |
| `religionDynamicsEnabled` gate | `simulationRules.js` | Realm → Rules (advanced); Editor/Compendium activation strip | **GAP** — **no UI toggle anywhere**; engine effectively unreachable |
| Deity-vs-deity conversion contest + spread | `religiousContest.js` | Realm Pantheon (contest preview); faith-map overlay | **GAP** — only post-hoc headline |
| Pantheon ledger (wins/losses/seats/tier) + realm arcs (Ascendancy/Twilight) | `pantheon.js`, `realmEvents.js`, `realmArcSummary.js` | Realm Pantheon; PDF Campaign-State variant; library folder strip | **thin** — `PantheonPanel` on map; no next-threshold/contest depth |
| Couplings: good/evil→corruption, warlike→aggression, major→magic-legality, rank→religious_authority | `corruption.js`, `disposition.js`, `magicProfile.js`, `causalState.js` | Compendium deity effect-preview; Dossier "Faith Effects"; About Living World | **GAP** — zero in-product cause→effect disclosure |
| Deity `domain` (free text) | snapshot | Dossier + Pantheon as labeled flavour | **GAP** — authored, never displayed; mark as flavour-only |

### Simulation, content & funnel infrastructure

| Engine system | Source | Owning surface(s) | Status today |
|---|---|---|---|
| World pulse / advance-time pipeline | `advanceCampaignWorld.js` | **Realm hub** (new) → Pulse; library/dossier deep-link in | **thin/GAP** — invoked from 3 places, no IA home, never named in marketing |
| Simulation presets (quiet_local/realistic_regional/dramatic_campaign) + 15 toggles + propagation/intensity/migration | `simulationRules.js` | Realm → Rules (preset chips + advanced) | **thin** — modal-only, 12/15 toggles |
| Stressor catalog (~24) + active conditions (~40) | `stressors.js`, `activeConditions.js` | Compendium "Living World" reference; Realm Pulse | **GAP** — no catalog browser; gen-stress chips only |
| Wizard News (240-cap) + AI chronicle | `wizardNews.js`, `chronicle.js` | Realm → Chronicle (full history scrollback); PDF Campaign-State | **thin** — `chronicles[0]` + latest pulse only |
| Custom content: 11 buckets + taxonomy + tier gates | `customContentSlice.js`, `customContentSchema.js`, `customRegistry.js` | Compendium → My Custom Content (2 lanes) | **thin** — 5 buckets not in registry/picker; factions don't reach generation |
| Tier gating (anon/free/premium) | `authSlice.js` `TIER_GATE` | Global header tier chip; "What the Realm unlocks" surface | **thin** — deep/binary; premium value mis-sold |
| Pricing moments + copy | `pricingMoments.js`, `en.js` | Global funnel; Realm locked-state | **GAP** — copy sells storage, not the simulation; moments tied to old surface |
| Campaign as navigable object | `campaignSlice.js` | **Realm hub** + library "state of the realm" folder strip | **GAP** — no campaign hub; assemble by tab-hopping |

---

## 3. Global Information Architecture

### 3.1 The durable reorganization: six destinations, one altitude axis

The current six top-level tabs (Create, Settlements, World Map, Compendium, Gallery, About) bucket by *feature*, hide the World Map from anon, and give the simulation **no home**. We re-architect around the user's journey and give the living world a first-class destination.

**Desktop top nav becomes:**

```
Create · Library · Realm · Compendium · Gallery · About        [ tier chip ]
```

- **Create** (was `generate`) — the funnel front door + generation editor.
- **Library** (rename of `Settlements`) — VIEW + ORGANIZE saved settlements; the dossier is its detail view.
- **Realm** (NEW) — **the IA home the simulation never had.** Hosts the World Map, World Pulse, Wizard News/Chronicle, and Pantheon as sub-tabs of ONE destination. Self-gates to a **locked-state preview** for anon/free instead of being hidden.
- **Compendium** — Built-in Catalog + My Custom Content (authoring).
- **Gallery** — share / import dossiers.
- **About** — landing + how-to.
- **Persistent header tier chip** (replaces the AccountMenu-only path to pricing): anon → "Sign in"; free → "Upgrade"; premium → account/credits chip. Routes to the single canonical **"What the Realm unlocks"** surface.

**Mobile** `MOBILE_NAV_PRIORITY`: `create, library, realm, gallery, compendium` (+ About & account in the menu).

**Back-compat (non-negotiable):** legacy `/settlements` and `/map` links must resolve — `/map` redirects into `/realm` (Map sub-tab); the `?view=` seam and `viewToPath` fallbacks are preserved. World Map *moves into* Realm as the Map sub-tab and **stops being anon-hidden** (becomes a locked preview).

### 3.2 The single progressive-disclosure primitive

One **altitude control** — `Overview → Detail → Engine` — backed by a persisted `userPref.detailLevel: 'guided' | 'standard' | 'expert'`, defaulted from the inferred lens. It **replaces** the scattered flags (`dossierFiveTabs`, `summaryMagazineV2`, `simulationDrawer`, `tableView`) with one axis, applied identically to:

| Surface | Overview (guided) | Detail (standard) | Engine (expert) |
|---|---|---|---|
| Dossier `SystemStateBar` | 4 friendly dims | band pills + plain "why" | 15-var grid + 9 pressures + strength + contributor deltas |
| `ConfigurationPanel` (Create) | size picker + 1 "Character" preset | + sliders + culture/age | + resources/stress/institutions/services/trade |
| `SimulationRulesDialog` (Realm) | 3 named preset chips | presets + read what they do | 15 toggles + propagation/intensity/migration + calibration |
| Realm Map `LayersPanel` | settlements + relationships | + supply chains | + 13 channels + GM layers + impacts |
| PDF export | today's clean dossier | + Faith & War + bands | + causal detail + pressures + magic facets |

Default rung is **inferred** (chosen size, slider usage, whether the map was opened) and **persisted** once explicitly changed, so a new DM lands at Overview and a returning power user stays at Engine.

### 3.3 The anon → free → premium funnel (as a continuous ramp, not cliffs)

- **anon → free:** Create yields a meaningful town-sized dossier (no account); cap-hit fires `anon_cap_hit`; the **Realm locked-state preview** + the About "Watch a region wake up" replay let anon *see* the premium product (instead of the map being hidden). First artifact / cap → free signup (or the existing $2.99 single-dossier side door).
- **free → premium:** one persistent **"Upgrade" tier chip** and the **Realm locked-state** both route to ONE canonical *"What the Realm unlocks"* surface whose copy finally names the **simulation, campaigns, gallery, war layer, pantheon** (today `en.js` sells "unlimited saves / capital size / PDF+JSON"). Lens-aware pricing moments pitch the right thing (worldbuilders → war/pantheon; new DMs → saves/size).
- **new → power → worldbuilder:** the single altitude axis lets the same surfaces serve a clean face and the full substrate; the Compendium/About "Living World" ladder is the educational on-ramp.

**Funnel mechanics:** extend `pricingMoments.js` with simulation-intent moments (`first_advance_attempt`, `war_layer_curiosity`, `pantheon_preview`, `map_realm_teaser`) fired from the Realm locked-state; each CTA routes to the canonical premium-value surface. Persist a lightweight lens inference to tailor moment copy and the default altitude. Restore footer links (About / Pricing / Compendium / Gallery / legal).

---

## 4. Per-Surface Overhaul Specs

### 4.1 Dossier (read view) — `OutputContainer.jsx` in `SettlementDetail.jsx`

**Current:** read mode shows only the tabbed card (legacy flat ~14 tabs or 4 groups behind `dossierFiveTabs`: Summary/Systems/World/Notes). The entire causal/engine readout (`SystemStateBar`, EventComposer, deity picker, Timeline) is gated behind premium `editMode`. `FaithWarBlock` in `SummaryTab` is the only live war/religion read.

**Overhaul (graduate `dossierFiveTabs` to default-on; flat strip = killswitch fallback):**

- **Promote `SystemStateBar` out of editMode** to the TOP of read-view Summary (read-only). 4-dim glance for new DMs at Overview altitude.
- **New `Substrate` sub-tab** (Systems group): **build `CausalViewTabs`** (it does not exist yet) to render the 15-var grid — band pills, de-emphasized scores, expandable `contributors[]` "why", polarity-aware sort floating strained/critical/collapsed to top (`pressuresOn`), `criminal_opportunity` band-flip. Plus a Pressures section (9 axes, 0..1 bars + reasons) and a `settlementStrength` readout with the war-cost penalty + one-line homeostasis story. Dropped from the strip when no meaningful causal content (Engine altitude).
- **New `Magic` sub-tab** (Systems): render `deriveMagicProfile` 10 facets via the unused `deriveMagicPosture`; include deity⇄magic coupling.
- **Replace `FaithWarBlock` with a fuller `War & Faith` section** on Summary (self-gating): strategy posture, aggressiveness disposition + its 4 named inputs, `warExhaustion` ("war-weary 0.7 — near peace" — needs a new `warStatus.js` reader), disposition W/L badge, trade-war prize, and a **Faith Effects** disclosure (good/evil→corruption, warlike→aggression, major→magic-legality, rank→authority; `domain` as flavour).
- **Deepen Economics** with `economic_capacity` band + live granary gauge (`storageMonths` vs capacity, tithe/drawdown/blockade/deployment flags, `deriveBlockadeRelief`).
- **Deepen Defense** — bridge frozen `defenseProfile.scores` to live `defense_readiness` + contributors; reframe `militaryStress` into a war-front readout (coalition, conquest/occupation provenance, garrison thinning) when live.
- **Deepen Power** — ruler identity, coup-risk forecast (`coupContenders`/`resolveCoupVerdict`), `previousGovernments` lineage (conquest provenance), disposition.
- **Deepen NPCs** (World) — agency disclosure (goals/ambition/rivalries/`consequenceIfRemoved`).
- **`What changed & why` panel** (History/Summary, post-advance) — `compareCausalState` per-var before→after + `populationHistory`.

**Tiering:** new DM = promoted 4-dim strip + crises + situation tiles + figures + hooks; Substrate/Magic are drilldowns; War & Faith renders nothing for a peaceful town. Power user = Substrate grid + pressures + strength + coup forecast. Worldbuilder = the post-advance "what changed" + warExhaustion trajectory + trade-war + conquest lineage + granary/population arcs. **Anon/free:** static layers only; a frozen-generation Substrate grid is a legitimate *teaser* ("advance time to watch it move").

### 4.2 Settlements view → **Library** — `SettlementsPanel.jsx`

**Current:** flat list — toolbar (search/sort, Canon/Linked chips; `draftOnly`/`hasPendingEdits` filters implemented but no chip), premium New Campaign, CampaignFolders, Unassigned cards. No save-quota meter, no living-world state on cards.

**Overhaul:**
- **Living-world signal row** on `SettlementCard` (self-gating): siege / at-war / occupied / faith pip (deity + rank, alignment-colored) / disposition chip / war-weary — all from `settlementWarStatus` + embedded snapshot + `computeAggressiveness`. Reuses the read-model `SummaryTab` already consumes.
- **Health pip** (4-dim resilience band dot) + a "Needs attention" sort key.
- **Promote `CampaignFolder` header to a "state of the realm" strip** when canonized: in-world clock, active-siege count (`liveSieges`), dominant-faith pill (top pantheon tier), Wizard-News recency. Self-hides when dormant.
- **Fix the dead-end standalone "Advance Time"** — replace the inert hint-toggle with a gold CTA that deep-links into Realm with the settlement preselected (or the move-to-campaign popover).
- **Wire orphaned filters + add living-world filters** (`At war`, `Has deity`, `In crisis`, campaign selector) under a `Filters▾` disclosure so the default toolbar stays `Search · Sort · Filters▾`.
- **Save-quota meter + premium funnel header** (free: "2 of 3 slots"; anon: "Sign in to save"); the "Unlock campaigns + Advance Time" card names the *real* premium product.
- **Bulk / multi-select** (Select toggle → action bar: Add to campaign / Canonize / Delete / Export).

### 4.3 Editor — `SettlementDetail.jsx` edit mode + Create — `GenerateWizard.jsx`

**Current (Create):** Basic vs Advanced fork (`ModeSelector`); `ConfigurationPanel` packs 13+ controls; archetype preset buried in `SliderPanel`. **Current (Edit):** one premium `editMode` toggle reveals the entire engine as one long scroll.

**Overhaul (Create):** collapse Basic/Advanced into ONE layered `ConfigurationPanel` (Foundations always-on → Fine-tune collapsible → Deep constraints collapsibles that absorb Institutions/Services/Trade). **Promote the 17-archetype "Character" preset to a top-level Tier-1 card.** Keep the anon HomeHero instant path untouched. Add a premium "Place in Region" close-out step. Keep step ids as collapsible-section ids so funnel analytics still fire.

**Overhaul (Edit):** replace the binary gate with a **right-rail "Workshop"** of labeled, collapsible cards that **READ in view mode and become EDITABLE in edit mode** — the read-outs are the free→premium teaser; the write controls stay premium. Order: (1) Causal State [4-dim header → 15 vars], (2) Pressures & Strength [+ live granary + disposition], (3) Faith & Pantheon [axis-effect disclosure + "Awaken religion" toggle], (4) Power & Succession [coup forecast + lineage], (5) Make Changes (EventComposer — now *preceded* by the state it mutates), (6) Timeline & Chronicle, (7) Provenance & Links.

**Add the three subsystem gates** (`warLayerEnabled`, `settlementStrategyEnabled`, `religionDynamicsEnabled`) as deliberate, explained toggles — in the Faith/War cards AND added to `SimulationRulesDialog` — each carrying the byte-identical-when-off promise.

**Consolidate rename** — the three name-edit places (config `customName`, `SettlementDetailEditNames`, `DossierHeaderRow` inline) merge into ONE inline-edit on the dossier header.

### 4.4 PDF export — `src/pdf/`

**Current:** one `buildViewModel()` → `SettlementPDF.jsx` (3 variants). Thorough on settlement-local state; only `SystemStateSnapshot` (4 dims) + `Timeline` for campaign state. **Does not receive campaign `worldState`** — so no war/pantheon possible. `SummaryTab` renders a live Faith & War panel the PDF cannot — a proven screen↔PDF asymmetry. A divergent jsPDF `generateCampaignPDF.js` has zero war/pantheon refs.

**Overhaul (plumbing first — the real blocker):**
- Thread `campaign: { worldState, regionalGraph }` into `generateSettlementPDF.js` + `buildViewModel()`; `SettlementDetail` resolves the owning campaign (same lookup `FaithWarBlock` uses).
- New `liveWorld` view-model slice reusing the **existing pure selectors** (`settlementWarStatus`, `liveSieges`, `activeDeployments`, `liveTradeWars`, `dispositionStandings`, pantheon, `realmArcLines`) — all return `[]`/`null` when dormant → byte-identical off-state.
- New **"Faith & War"** chapter (03D, canon-only, self-gating) mirroring `SummaryTab`. **Read `*Axis` fields, not `tier`/`alignment`** (the snapshot carries `rankAxis`/`alignmentAxis`/`temperamentAxis`).
- Upgrade 03B into a layered "State of the Settlement" (4 dims default; optional causal-detail 15-var grid + 9 pressures behind the Engine altitude / a new **"Campaign State"** variant).
- Enrich Power (Rule & Succession), Institutions (deity content), Defense (live war_front), Identity/Viability (magic legality via `summarizeMagic`).
- New **"Campaign State / War Room" variant**; extend `generateCampaignPDF.js` with a Realm Chronicle & Geopolitics section using the **same** selectors (no three-way drift).
- Smoke-test: empty `worldState` → byte-identical output.

### 4.5 World Map → **Realm** hub — `WorldMap.jsx` + map components

**Current:** body-swapping `campaignWorkspace` tabs (Map/Pulse/News/Pantheon) **replace** the map; `LiveWarStatus` trapped in the Pulse panel; war shows only a thin `war_front` line on the map; no legend; `WizardNewsPanel` renders `chronicles[0]` only; `SimulationRulesDialog` omits the 3 premium gates; no assign-deity entry; binary non-premium cliff.

**Overhaul:**
- **Persistent right-dock "Realm Inspector"** rail (overlays the map, never replaces it): Realm Dashboard · War & Diplomacy (`LiveWarStatus` promoted here) · Pantheon · Pulse Results · Chronicle. Node-focus: clicking a settlement/edge filters the rail to its egonet.
- **Add the 3 missing gates** to `SimulationRulesDialog` as a "Living-world systems (advanced)" group below the 12 existing toggles (each with "what it does" + byte-identical promise). *Highest-impact single fix — the premium engine is currently unreachable.*
- **Spatial war/faith overlays** (extend `MapOverlay`/`RegionalCausalityLayer`): deployment arrows (home→target), siege rings + coalition badge, occupation shading, trade-war prize glyph, faith-front overlay — honoring public/gm/hidden visibility.
- **Persistent collapsible legend** (channel/relationship colors + war glyphs + impact scale).
- **Realm Dashboard** (default Inspector section + non-premium teaser): tick/era, settlement count, active wars, dominant faith, war-weariest power (new `warExhaustionStandings()` selector), tension.
- **Chronicle / Timeline scrollback** — full `chronicles[]` + `pulseHistory[]`, scrubbable, per-tick diff via `compareCausalState`, click → highlight affected node.
- **Steering layer** — per-settlement right-click: Declare War / Force Siege / Trigger Trade War / Sue for Peace / Assign Primary Deity (route through `recordPartyImpact` + event registry; wire `PrimaryDeityPicker` so religion can be awakened from the map).
- **Deepen Pantheon** — "X seats from Major" progress, conversion-contest preview, deity-coupling explainer.
- **Preset chips on the toolbar** (Quiet / Realistic / Dramatic) so a new DM never opens the 15-toggle matrix; refresh `WorldMapTourSteps`.
- **Non-premium:** locked Realm Dashboard teaser + sample read-only "living campaign" demo → `map_realm_teaser` pricing moment.

### 4.6 Compendium — `CompendiumPanel.jsx` + `CustomContent.jsx` + `CatalogTabs.jsx`

**Current:** Built-in Catalog (7 tabs documenting only the original generator; stale Magic & Religion) + My Custom Content (flat 8-bucket row; deities authorable but axis-effects undocumented; factions never reach generation; no export/import; dead `tradeRoutes`/`powerPresets`/`defensePresets` buckets).

**Overhaul:**
- **Two authoring lanes:** "Settlement Content" (institutions/services/resources/trade goods/supply chains) and "Living World — powers the simulation" (deities/factions).
- **Deity Effect Preview** ("This god will…") computed from the **same** coupling constants the engine uses (shared source of truth, not hand-copied).
- **Pantheon activation strip** (authored / assigned / `religionDynamicsEnabled`) with deep-links to assign + enable-dynamics.
- **Rebuild Magic & Religion catalog tab** → "Religion & the Pantheon" (axes + effects + dormant-until-assigned + conversion contest + tiers + arcs); add a **"Living World" catalog group** (Causal Substrate, Pressures & Strength, World Pulse, War Layer, Religion & Pantheon) — the missing static→living-world bridge.
- **Resolve the faction-generation gap** (either wire `customContent.factions` into `eligibleCustomContent` + golden-master, OR relabel as add-via-event with a banner routing to EventComposer — recommend the relabel near-term).
- **Reuse & sharing** — export/import content packs (re-run `validateDeity` + re-namespace refIds on import) + premium "Share to Gallery as a content pack".
- **"Start from a built-in"** clone seeds + **"Test in a generation"** preview.
- **Prune** dead buckets (migration-safe) and fix stale upsell/Reference copy.

### 4.7 About / Landing — `HowToUse.jsx` + funnel copy

**Current:** 7 tabs explain the *static generator*; "simulate" always means the one-shot pipeline; no living-world/simulation content; pricing copy sells storage.

**Overhaul:**
- **Reframe as LANDING + HOW-TO** led by one thesis: *"It generates a town in seconds, then it runs the region for years."*
- **New "The Living World" tab** (between Power User and Under the Hood): Advance Time, the self-ending war, the pantheon, the chronicle — each a claim + a how-it-stays-coherent line + a premium chip + the opt-in/off-by-default/reversible qualifier.
- **Anon demo path** — below `HomeSampleDossier`, a read-only **"Watch a region wake up"** replay driven by existing projections over a small canned fixture (siege forms, trade prize flips, deity gains seats, war ends).
- **3-rung value ladder** (anon tries / free saves / premium simulates), lens-labeled, wired to existing triggers.
- **Split LogicTab** into Generation (existing 12 Insights) + Simulation (15 vars, 9 pressures, settlementStrength, the why-trace). Fix stale Magic & Religion + Reference copy.
- **Restore Pricing** link (landing + footer); rewrite `en.js` Cartographer features + AuthModal blurb to lead with the simulation.

---

## 5. The 3-Audience × 4-Lens Matrix

Rows = lens (depth need); cells note what they get and what is gated. Audience layered within each cell (A=anon, F=free, P=premium).

| Lens | Create | Library / Dossier | Realm (simulation) | Compendium / About |
|---|---|---|---|---|
| **NEW DM** | A/F/P: size picker + 1 "Character" preset (Overview altitude). Clean. | A/F/P: 4-dim health strip, crises, figures, hooks. No var grid; War & Faith renders nothing for a peaceful town. | A/F: locked Realm preview / "watch a region wake up" teaser. P: 3 preset chips → Advance → read Chronicle. | Built-in Catalog; "The Living World" tab optional + labeled premium. |
| **INTERMEDIATE** | F/P: Fine-tune (sliders, culture, age, presets). | F/P: Systems tabs with band pills + plain "why"; War & Faith named inputs + faith-effects in plain language. | A/F: locked preview teaches what advancing does. P: presets + apply/dismiss proposals + legend. | "Settlement Content" lane (clone-a-built-in, test-generate); Living-World reference. |
| **POWER USER** | F/P: Deep constraints (resources/stress/institutions/services/trade). | F: full **read** of Substrate (15 vars + contributor deltas), 9 pressures, strength, coup forecast — **write is premium**. P: + EventComposer authoring. | P: Rules → 15 toggles + propagation/intensity/migration + Preview + roll explanations + calibration knobs. | Full field switch + dependency diagnostics + tier gates + effect previews. |
| **WORLDBUILDER** | P: "Place in Region" + assign deity + gate toggles at birth. | P: post-advance "what changed", warExhaustion trajectory, conquest lineage, granary/population arcs; library "state of the realm" strips. | P: full Realm — spatial overlays, Chronicle scrollback, Pantheon depth, steering, the 3 living-world toggles. | "Living World" lane (author a pantheon, share packs); Living-World catalog + About tab. |

**How nobody is overwhelmed yet everyone has depth:** the altitude axis defaults to the inferred lens; every premium/engine block self-gates to nothing when dormant; depth is always opt-in drilldown on the *same* surface, never a wall or a separate mode. **A new DM's clean Summary and a power user's 15-var Substrate are the same dossier at different rungs.**

---

## 6. Dependency-Ordered Implementation Plan

Same discipline as the engine build: **shared primitives first, then per-surface, byte-identical/non-breaking where possible.** Each phase is independently green-buildable. 🔒 = premium-gated capability.

| Phase | Slice (green-buildable) | Key work | Premium-gating | Depends on |
|---|---|---|---|---|
| **0 — Pure read-model seams** | New selectors, no UI | `warExhaustionStandings()` + `warExhaustion` reader in `warStatus.js`; shared "deity axis → effect" constants module (single source for couplings); confirm `deriveBlockadeRelief`/`deriveMagicPosture` outputs. All pure, rng-free, no worldState mutation. | — | — |
| **1 — Altitude primitive** | One `detailLevel` userPref + `<AltitudeControl>` + a `useAltitude()` hook; **build `CausalViewTabs`** (15-var grid + pressures + strength, lazy/memoized). Mount nowhere yet. Begin retiring `dossierFiveTabs`/`summaryMagazineV2`/`simulationDrawer`/`tableView` behind the new axis (staged, killswitch-preserving). | — | Phase 0 |
| **2 — Dossier read overhaul** | Promote `SystemStateBar` to read view; mount `CausalViewTabs` as **Substrate** sub-tab; add **Magic** sub-tab; replace `FaithWarBlock` with fuller **War & Faith** + Faith Effects; deepen Economics/Defense/Power/NPCs; "What changed & why" panel. All self-gating. | War/faith/substrate-movement light up only with a 🔒 campaign worldState | 0,1 |
| **3 — Library overhaul** | Living-world signal row + health pip on `SettlementCard`; folder "state of the realm" strip; fix standalone Advance-Time dead-end (deep-link); wire orphaned + new filters; save-quota meter + funnel header; bulk select. | Campaigns/Advance-Time 🔒; pips appear only inside a 🔒 simulated campaign | 0,2 |
| **4 — Realm hub (the big IA move)** | Create `/realm` destination + nav rename (`settlements`→Library); `/map` redirect; right-dock Inspector; promote `LiveWarStatus`; **add the 3 missing gates to `SimulationRulesDialog`**; persistent legend; Realm Dashboard (+ locked non-premium teaser); preset chips on toolbar. | Whole hub 🔒 (`canManageCampaigns`); locked preview for anon/free | 0,1 |
| **5 — Spatial overlays + steering + chronicle history** | Deployment arrows / siege rings / occupation shading / trade-war glyph / faith-front (visibility-honored); Chronicle scrollback (`chronicles[]` + `pulseHistory[]`) + per-tick `compareCausalState` diff; steering via `recordPartyImpact`; wire `PrimaryDeityPicker` into Realm/Pantheon; Pantheon depth. | All 🔒 | 4 |
| **6 — Editor Workshop** | Right-rail READ-then-WRITE cards; the 3 gate toggles in Faith/War cards; consolidate rename to one control; "Place in Region" close-out; collapse Create Basic/Advanced into one layered panel (keep step ids for analytics). | Write controls + deity assign + gates + region 🔒 | 0,2 |
| **7 — PDF plumbing + chapters** | Thread `campaign` worldState into `generateSettlementPDF`/`buildViewModel`; `liveWorld` slice; **Faith & War** chapter (`*Axis` fields); layered State chapter; enrich Power/Institutions/Defense/Magic; "Campaign State" variant; extend `generateCampaignPDF`; empty-worldState smoke test. | Live-world chapters 🔒 (don't pass worldState for free/anon — gate at data layer) | 0 |
| **8 — Compendium overhaul** | Two authoring lanes; deity Effect Preview (shared constants); pantheon activation strip; rebuild Magic & Religion + add "Living World" catalog group; resolve faction-generation gap; export/import packs (`validateDeity` + refId re-namespace); clone/test-generate; prune dead buckets (migration-safe); fix copy. | Authoring + packs 🔒; catalog/reference free (teaser) | 0,6 |
| **9 — About + funnel rewrite** | Reframe landing + thesis; "The Living World" tab; "Watch a region wake up" replay (canned fixture, existing projections); 3-rung ladder; split LogicTab; restore Pricing/footer; rewrite `en.js`/AuthModal copy; new simulation-intent pricing moments + lens inference. | Copy names 🔒 product; replay is read-only | 4,5 |

**Sequencing rationale:** Phase 0–1 are pure/no-UI so they can't regress anything. Phase 2–3 deliver the highest user-visible value (the living world legible in the surfaces users already use) on existing routing. Phase 4 is the structural IA move (Realm) and is isolated so its routing/back-compat risk is contained. Phases 5–9 layer depth and funnel onto the now-stable architecture. **Every phase preserves byte-identical output for dormant/peacetime/non-campaign saves** — the single hard invariant.

---

## 7. Open Decisions (your call) — with recommendations

1. **Rename `Settlements` → `Library` and introduce a top-level `Realm` destination?**
   *Recommendation: YES.* This is the load-bearing fix — the simulation has no IA home and the map is hidden from the audience meant to convert. Mitigate with strict back-compat redirects (`/map`→`/realm`, `/settlements` preserved). *(Alternative if you want minimal churn: keep `Settlements`/`World Map` names but still add the Realm Inspector + Dashboard inside World Map. Less clean, lower risk.)*

2. **Replace the four dossier/UX flags with ONE `detailLevel` altitude axis, or keep flags?**
   *Recommendation: REPLACE, staged.* One axis is the whole progressive-disclosure thesis. But it touches in-flight soak/killswitch behavior — do it as a staged migration (new axis reads old flags during soak), not a big-bang removal.

3. **Un-hide the World Map for anon (locked preview) — or keep it hidden?**
   *Recommendation: locked preview.* The hidden map is the sharpest funnel cliff. Risk: a worse first impression if the locked-state copy is ambiguous — gate copy must be unmistakable. *(If you'd rather not change anon's nav at all, keep it hidden but add the "Watch a region wake up" replay on About as the sole anon teaser.)*

4. **Rewrite premium pricing copy wholesale (simulation-led) or A/B test?**
   *Recommendation: A/B test.* The current concrete "unlimited saves" pitch may convert better than an abstract "living simulation" claim for some segments. Ship the simulation-led copy behind an experiment; keep the storage line as a secondary bullet either way.

5. **Custom factions: wire into generation now, or relabel as add-via-event?**
   *Recommendation: relabel now, wire later.* True generation wiring touches `eligibleCustomContent` + golden-master fixtures and risks byte-identical output. Relabel the form (add-via-event banner → EventComposer) immediately to stop the honesty gap; schedule the generation wiring as its own change with fixture updates.

6. **Surface the 15 causal vars / 9 pressures / disposition at Engine altitude — accepting they were engine-internal?**
   *Recommendation: YES, at Engine altitude only, behind the altitude axis.* They are the premium depth worldbuilders pay for. Guard the determinism contract: render only canonized/derived public state (no wall-clock, no non-canonized bleed), and do a copy pass on the highest-traffic contributor strings (they were written for AI grounding and may be terse).

7. **Steering interventions (Declare War / Trigger Trade War / Assign Deity) on the map — in scope, or read-only Realm first?**
   *Recommendation: read-only Realm first (Phases 4–5), steering as a fast follow.* Steering must route through `recordPartyImpact` + the event registry and round-trip cleanly via the undo stack; ship the legible read surfaces first, then add authoring once the projections and undo are proven.

8. **One canonical "What the Realm unlocks" premium-value surface, or keep value spread across PricingPage + moments + CTAs?**
   *Recommendation: ONE canonical surface*, reachable from the header tier chip, the Realm locked-state, and the footer; PricingPage and moments link INTO it. Single source of truth for premium value prevents the current copy drift.
