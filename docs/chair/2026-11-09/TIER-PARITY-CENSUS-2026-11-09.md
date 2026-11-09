# TIER-PARITY CENSUS — every tier read in the product, classified against the owner's tier law

**Seat:** TIER-PARITY-CENSUS (read-only; child of the cloud chair `session_01FbPLbejcfwX5nii12VM673`). **Written:** 2026-11-09 02:52 UTC (from `date`). **Branch:** `lane/tier-parity-census-2026-11-09`, cut from `origin/lane/integration-2026-11-07` at **d46ce9503** (464887416 is its ancestor). **No product byte was written.** This file and the dated-roster bump are the only bytes.

## §0 Method and base

1. **The grep.** `tier === 'premium'`, `tier !== 'premium'`, `isPremium`, `viewerIsPremium`, `isElevated`, `elevated`, `canExport`, `resolveTier`, `TIER_GATE.`, `TIER_FACTS.`, `isSurveyorTier`, `includeGroundTruth`, `purchasesOpen` were searched over `src/{components,lib,domain,config,copy,pdf,foundry}` and `supabase/functions`, tests excluded. The raw count before classification was **559 lines over 145 files**, plus **25 tier-keyed SQL lines over 10 migrations** (98 migrations mention tier, premium or cartographer in some form, mostly settlement-size or consent tiers). Rows also cover reads the grep missed: `viewerCanAuthor` in UnaffiliatesSection, `CHRONICLE_LIMITS`, `has_surveyor_entitlement`, and the SQL policies. `src/store` is outside the charter dirs but holds `TIER_GATE` (`src/store/authSlice.js:82-85`) and the store gates, so it gets its own section. There is no `src/pages`.
2. **Folding.** Prop forwarding, type annotations and comment hits are folded into the gate they feed. About 90 comment-only lines and 37 false positives were found: `elevated` meaning terrain or risk, `tier` meaning settlement size, and `includeGroundTruth` audience projections with no tier read. Both are listed in the group sections rather than given rows.
3. **Classification seats.** Four read-only sub-readers classified the four file groups from one brief: A for DM truth and display, B for components and store, C for lib, config and copy, D for edge and SQL. This seat then re-read the load-bearing rows and promoted the ones it ran to CONFIRMED (§6).
4. **Renders (run, CONFIRMED).**
   - `sh scripts/gate-tail.sh node scripts/audit/soak-review.mjs --count 12 --workers 2 --out <scratch>/soak12` gave exit 0: *"12 settlements, 6 findings, 0 errors"*.
   - A scratch harness (`viewer-diff.mjs`, kept in the seat's scratchpad, not committed) booted the soak's own `renderHarness.mjs`. It birthed the same twelve towns (`corpus.mjs :: birth(0..11)`) and rendered all twenty dossier tabs, plus `HousesBlock` and `WatchPanel`, as four viewers. The free owner was `auth.tier 'free'`, `viewerIsPremium false`. The premium owner was `'premium'`, `true`. The player was premium with `playerView`. The public viewer was premium with `publicDossier`. Each pair was diffed line by line.
   - `sh scripts/gate-tail.sh npx vitest run tests/lint/premiumGateSingleSource.test.js tests/config/tierFacts.contract.test.js tests/security/enforceSaveLimit.pglite.test.js tests/config/entitlementLadder.enforcement.test.js` gave 4 files and 57 tests passed, exit 0.
   - A node probe of `src/lib/chronicle.js` `appendChronicleEntry` under `CHRONICLE_LIMITS` appended 8 entries. Free kept `full ×5, summary ×3`. Premium kept `full ×8`.
5. **What the render printed (free against premium, twelve at-birth towns).** **Zero differing lines on every tab except Faith.** That includes Rumours and War: free and premium print byte-identical text at birth. Relationships printed its empty shell for every viewer under the harness's props, and Houses and Watch printed nothing, because they need a world state. So those three are equal but vacuous. **Faith differed on 12 of 12 towns.** The free owner printed the heading "Faith", the same engine-made faith line both viewers print, and the upsell *"Awaken a living pantheon (a patron god, rival cults, and the rising and ebbing of devotion) with a premium campaign."* The player and public views differ from the owner's view on most tabs, which is expected: that is the view axis, not the tier. **So every DM-truth tier gate is invisible on at-birth data, and it bites only when a campaign's world state is present.** This is the measured basis of ruling (a).

## §1 The law and the seven

The owner, 2026-11-09, verbatim: *"Renenber, the only thing that is premium abd up is up is the ability to edit post generation, access to the simulator, custom content, unlimited export, import from gallery, access to the world map, and access to the surveyor. Everything else is at parity to the free account."*

| # | Premium-and-up | The enforcement symbol at d46ce9503 |
|---|---|---|
| 1 | Post-generation editing | `TIER_GATE.settlementEditor` ∧ staff while dark (`authSlice.js:868`); `viewerCanAuthor` (`src/lib/viewerAuthority.js`) |
| 2 | The simulator (living Realm: advancing time, neighbours, campaigns) | `TIER_GATE.neighbour`, `canManageCampaigns`; SQL `saved_maps` policies (059), campaign import and bind (184, 186) |
| 3 | Custom content (gods, guilds, goods; so the deity-filled Faith row) | `TIER_GATE.customContent`; SQL `apply_custom_content_command` (185/188), archive import (187) |
| 4 | Unlimited export (free buys a $2.99 durable right per saved settlement) | `TIER_GATE.export` / `canExport` / `resolveExportAccess` |
| 5 | Import from the gallery | client gate + SQL premium check (live text `131:366-405`, re-creating 120) |
| 6 | The world map | `TIER_GATE.mapChains`; the campaign group of the WorldMap toolbar. **The map canvas itself is not gated for free on desktop** (§3, U1) |
| 7 | The Surveyor (own entitlement, priced per task) | client `isSurveyorTier` (`src/components/surveyor/surveyorGate.js:16-22`); server `has_surveyor_entitlement` (`supabase/migrations/201_*.sql:82-102`) |

Everything else is at parity. Two things outside the seven are tier-gated today and are already in the owner's queue: **the save cap** (§4, question c) and **anon's own limits** (§5, listed rather than judged).

## §2 The census table

Classes: **CONSISTENT** (gates one of the seven) · **DERIVED** (follows from one of the seven; the row says which) · **VIOLATION** (gates something at parity) · **UNDER-GATE** (grants free something in the seven) · **INFRA** (a resolver, definition, display fact, analytics, or staff/admin only; not a user gate) · **SAVE-CAP** (held for the owner's answer to (c)). The evidence column is PLAUSIBLE (read only) unless a row says CONFIRMED. §6 lists the promotions.

**Counts by class.** These are gate rows; copy claims are in C §B.

| Group | Rows | CONSISTENT | DERIVED | VIOLATION | UNDER-GATE | SAVE-CAP | INFRA |
|---|---|---|---|---|---|---|---|
| A: DM truth and display | 36 (24 + 12 domain seams) | 6 | 7 | 7 | 0 | 0 | 16 |
| B: components and store | 60 | 28 | 6 | 4 | 1 | 4 | 17 |
| C: lib, config and pdf/foundry gate rows | 29 (its `CHRONICLE_LIMITS` row is B's) | 7 | 3 | 0 | 0 | 1 | 18 |
| D: edge and SQL | 47 | 17 | 5 | 0 | 0 | 3 | 22 |
| **Total** | **172** | **58** | **21** | **11** | **1** | **8** | **73** |
| Copy claims (C §B) | 79 | 56 | — | 8 | — | (in V) | STALE 15 |

The eleven gate-row VIOLATIONs and eight copy VIOLATIONs collapse to **six distinct violations** (V1 to V6 in §3), one under-gate (U1) and two drifts (R1, R2). V1 alone is seven rows in A plus one PDF caller.

The group sections below are the full rows as the sub-readers wrote them, kept verbatim except for heading levels.


### §2.A Group A — DM-truth and display reads (tier-parity census, 2026-11-09, read-only, d46ce9503)

Definitions I checked first (they decide every row below):
- `isElevated()` = `isStaffRole(auth.role)` (src/store/authSlice.js:416), so it means STAFF ONLY. Every `tier === 'premium' || elevated` below is "premium or staff". `viewerIsPremium` (OutputContainer.jsx:280) is the same expression, passed down as a prop.
- `viewerCanAuthor` (src/lib/viewerAuthority.js:74) = premium ∨ founder ∨ staff.
- Campaigns load for every signed-in non-anon account (App.jsx:341 `if (authTier !== 'anon') loadCampaigns()`). `supabaseList` (lib/campaigns.js:493) returns retained `inactive_plan` rows too, with their `map_data`, so the worldState comes along. Campaign CREATE needs premium (campaignSlice.js:586), and so does gallery map import (5).
- Retention (023:63 / 024:338-373): a downgrade sets `tier='free'` and marks settlements and `saved_maps` `inactive_plan` with `retention_expires_at = now()+3 months`. The owner can still read them (saved_maps SELECT is owner-only with no access_state term, 002:29). `purge_expired_plan_inactive_assets` (165:58) deletes the campaigns at expiry. Free can reactivate up to 3 settlements (023 `reactivate_free_settlement`) but no campaign. So **a FREE account holds simulator world-state ONLY as a downgraded Cartographer's retained campaign, for up to 3 months.** No other path exists, because anon/free cannot create or import a campaign.
- The dossier tabs pick the campaign with a plain `campaigns.find(...)` and never filter `isCampaignActive` (RumorsTab:157, WarTab:419, RelationshipsTab:54, FaithTab:105, UnaffiliatesSection:~110). The map does filter (useWorldMapCampaignModel.js:60, and gives `[]` when not premium). So in the dossier, a downgraded free DM **already sees the PLAYER projection of their retained realm**, and only the DM truth beside it is refused.
- No DM-truth read in this group reads at-birth settlement data. Each one reads `campaign.worldState` ledgers that only the simulator (2) writes. The at-birth relationships, conflicts and martial record on the same tabs are ungated.

| file:line | what it gates | serves | class | re-key needed | conf |
|---|---|---|---|---|---|
| src/components/new/tabs/RumorsTab.jsx:10-11,134-137,163,166,177 | Per-rumour **DM truth block** (`settlementRumors` `projectTruth`, settlementRumors.js:886): canonical eventRef/tick, hop count, completeness/accuracy, provenance origin+relay chain, lineage, corroboration roots, raw causeClass, the raw deity name, framing, the TRUE headline, and the divergence list ("details lost on the road", "the tale has grown…", "a name has been swapped…"). Also passes `campaign.wizardNews` only under the flag, which drives the true-headline/divergence join. Data: `campaign.worldState.spatialLedgers.rumorLedgers` + `campaign.wizardNews`, simulator only. Free sees the scrubbed player rumours of a retained realm and no truth. | none (data exists only from 2) | VIOLATION (ruling a; reachable only by a downgraded Cartographer inside the 3-month window) | `includeGroundTruth = !playerView && !publicDossier`. Data presence is already gated by the `find(… rumorLedgers)` on the viewer's own store. Optionally `viewerSeesDmSecrets({isOwner:!!auth.user, authenticated:!!auth.user, public:publicDossier}) && !playerView` (src/domain/display/viewerSecrets.js, the existing tier-free owner-session predicate) | PLAUSIBLE |
| src/components/new/tabs/WarTab.jsx:21,281,309-327,332,412,415,481-482,564,568,571,574,588-591,603-604,666 | (a) **"DM truth" disclosure on the unit abroad**: "Where it truly stands: X" plus "The gap: the town believes the host near Y; in truth it stands at X" (true `currentRegion(ours)` vs the believed position). (b) **BeliefsBlock** "DM · what this town believes of its neighbours" (`settlementBeliefs`: strength/readiness/confidence/staleness per neighbour). (c) Through `warPictureFlags.anything`, whether a beliefs-only picture counts as content. Data: `worldState.canonizedAt`, `armyTransitLedger`, belief maps, all simulator. | none (data only from 2) | VIOLATION (ruling a; retained-realm reach only) | `includeGroundTruth = !playerView && !publicDossier`. Data is already gated by `c.worldState?.canonizedAt`, `ours` (transit record), and `hasBeliefMaps(worldState)` | PLAUSIBLE |
| src/components/dossier/useLaunchTones.js:19,24,28,30,37,41 (caller OutputContainer.jsx:466) | Only whether the War tab wears the purple "launch" tone. It passes `includeGroundTruth` into `warTabHasContent`, so a premium viewer whose realm holds only beliefs gets a live tab and a free one gets the teaser hue. Nothing is revealed here, but the tone must agree with WarTab. | none | VIOLATION (derived from WarTab; must be re-keyed in lockstep) | `includeGroundTruth = !playerView && !publicDossier`, with no `viewerIsPremium` arg | PLAUSIBLE |
| src/components/new/tabs/RelationshipsTab.jsx:31,44,56-57 (caller OutputContainer.jsx:280,760) | Neighbour-mirror "DM truth" `<details>` under each standing line: `basisPhrases(mirror.basis)` (what was shown to the counterpart and on what basis) and `lastShownTick` (neighbourMirror.js:203-205). The line itself is identical for both audiences. Data: `campaign.worldState.spatialLedgers` second-order mirror, simulator only. | none (data only from 2) | VIOLATION (ruling a; retained-realm reach only) | `includeGroundTruth = !playerView && !publicDossier`. `publicDossier` already nulls the campaign at :54. Drop the `viewerIsPremium` prop at OutputContainer.jsx:760 | PLAUSIBLE |
| src/components/new/tabs/HousesBlock.jsx:12-15,29,31,33,36,42 | "The houses": each information house's TRUE patron ("Serves X, taken by force"), covert or public, plus whether the town has exposed it. Data: `counterIntelActive(worldState)` (beliefs + `simulationRules.counterIntelEnabled`) and brokerage patron bindings, simulator only. **NOT MOUNTED.** The only references are itself and tests/components/counterIntelSurfacesIn3.test.jsx. | none | VIOLATION (ruling a; latent, no production mount) | `includeGroundTruth = !playerView && !publicDossier` (drop the `viewerIsPremium` prop before the page owner mounts it) | PLAUSIBLE |
| src/components/new/tabs/WatchPanel.jsx:10,47,49,51,54,57 | "Who watches": whom the town watches and who watches it, with "(covert eyes)" marked; the court's suspicion band; gates open or closed (`watchRowsFor`, the DM-truth side). Data: `counterIntelActive(worldState)`, simulator only. **NOT MOUNTED** (same as HousesBlock). | none | VIOLATION (ruling a; latent) | same as HousesBlock | PLAUSIBLE |
| src/components/new/tabs/UnaffiliatesSection.jsx:19-31,40,105-106,112,128,136,139 (not in reads.txt) | `seesSecrets = viewerCanAuthor ∧ ¬playerView ∧ ¬publicDossier` gates two things. (a) The **covert half** of the wanderer projection (`projectNpcPool includeCovert`: whose leash a compromised official was on), a DM truth read. (b) The DM **verbs** (settle/kill/pardon, WandererUndoControl), which are world writes. Data: `wanderersDoorOpen(campaign)` consequence economy, simulator only. | (b) 2; (a) none | VIOLATION for (a), split needed; (b) DERIVED from 2 (the verbs write the world; a retained campaign is also read-only under 024 RLS) | Split: `seesCovert = !playerView && !publicDossier` feeds `unaffiliateRows`; keep `canAuthor && seesCovert` for the verb controls | PLAUSIBLE |
| src/components/new/tabs/FaithTab.jsx:86-87,100-106 | `dmRealmView = isPremium ∧ ¬playerView ∧ ¬publicDossier` mounts the **realm PantheonPanel** (every deity in the realm, seats and tiers) when `hasPantheon(campaign)`. Data: the campaign's live pantheon, i.e. simulator plus custom gods. | 2, 3 | DERIVED (2,3). By ruling-(a) logic, reading a retained realm's pantheon is viewing, not simulating, so this is an owner call | if the owner extends (a): `dmRealmView = !playerView && !publicDossier`, with data gated by `hasPantheon(campaign)` | PLAUSIBLE |
| src/components/new/tabs/FaithTab.jsx:110-111,187-197 | `faithWillRender = hasEmbed ∨ ¬isPremium`. A premium viewer with no deity gets the FaithTeaserLines desk passage. A free viewer instead gets FaithSection's TEASER (the same `model.line` faith reading **plus** the "Awaken a living pantheon… premium campaign" upsell). Both see the at-birth faith line. | 3 | DERIVED (3) (presentation of the Faith-row upsell; the at-birth faith line reaches both) | — | PLAUSIBLE |
| src/components/new/tabs/PowerTab.jsx:246,252-253 | `politicsBlocsOf({includeGroundTruth: !playerView, includeCovert: !playerView})`: raw bloc end/glue tokens for desk routing, with no tier term. | none | CONSISTENT (already view-keyed: **the precedent ruling (a) asks for**) | — | PLAUSIBLE |
| src/components/new/tabs/ViabilityTab.jsx:58-60,110,314 | `showStaffChecks = isElevated ∧ ¬playerView ∧ ¬publicDossier` controls the staff panel's raw generator checks (`staffValidationRows`) | none | INFRA (staff-only) | — | PLAUSIBLE |
| src/components/dossier/SettlementWorkbenchMount.jsx:16-31,49-53 | `viewerCanAuthor` sets the Workbench `readOnly`/`canReview` (prose editor, Edit NPC details, Change Dock) | 1 | CONSISTENT | — | PLAUSIBLE |
| src/components/dossier/ExportUnlockDialog.jsx:8,43,65,74 | `purchasesOpen()` disables the $2.99 single-dossier "Continue to checkout" before launch | 4 | INFRA (launch gate, not tier) | — | PLAUSIBLE |
| src/components/dossier/DossierLadderModal.jsx:32,52,120 | `purchasesOpen()` disables the Cartographer and one-time rungs for anon before launch; "create free account" stays live | 4 | INFRA (launch gate) | — | PLAUSIBLE |
| src/components/dossier/DossierSessionNotices.jsx:6,38,61,63 | `purchasesOpen()` disables "View plans" on the AI-credits error notice | none | INFRA (launch gate) | — | PLAUSIBLE |
| src/components/map/useWorldMapCampaignModel.js:55,58,60 | `canManageCampaigns = premium ∨ staff`. Otherwise `activeCampaigns = []`, so on the map a free viewer has NO active campaign: no Herald panels and no advance. Retained (inactive) campaigns are filtered out for everyone. | 2, 6 | CONSISTENT | — | PLAUSIBLE |
| src/components/map/RealmDashboard.jsx:16-18,190-240,266,338 | `!canManageCampaigns` shows the RealmDashboardLocked teaser instead of the live dashboard and LivingWorldGates `canWrite` | 2, 6 | CONSISTENT. Side finding: the P9 "your realm's Conflict band" preview reads `campaign?.worldState`, but the campaign is always null for free (row above), so the preview is dead code | — | PLAUSIBLE |
| src/components/map/RealmMobileGate.jsx:25,105,109,141,157 | Phone Realm: the companion's live decisions appear only when `canManageCampaigns ∧ realmHasAdvanced`; locked copy otherwise | 2, 6 | CONSISTENT | — | PLAUSIBLE |
| src/components/map/RealmLockedGate.jsx:39,44,81-82,99,120-125 | The locked-Realm card ("The Realm comes alive with Cartographer… live controls and the world pulse unlock with Cartographer"). `purchasesOpen` disables the tier door; `isAnon` swaps in Sign in. | 2, 6 | CONSISTENT (copy matches the law) + INFRA (launch gate) | — | PLAUSIBLE |
| src/components/map/BeliefDivergenceBand.jsx:11-15,98-101,107,109,115,120,123 | "What they believe": per observer, `settlementBeliefs` (believed strength/readiness/bond/faith with confidence and staleness), plus gold **truth-divergence bands** from `beliefTruthProvider`. Data: `hasBeliefMaps(worldState)`, simulator only. Mounted only in HeraldBody's War door with a campaign, and for free the campaign is always null (useWorldMapCampaignModel). | 6 (reach) | DERIVED (6): the inner tier term is redundant, since free can never mount it | per (a): `includeGroundTruth = true` (a DM-only Herald surface; data gated by `hasBeliefMaps`). If a shared/public Herald ever ships, use `viewerSeesDmSecrets(ctx)` | PLAUSIBLE |
| src/components/map/PerspectiveStandings.jsx:11,59-61,101-102,111,136 | "The world as X knows it": the **believed** half (settlementBeliefs lines) and the ", no modelled belief" clause. Public sieges, coalitions and treaties are ungated. | 6 (reach) | DERIVED (6), redundant | same as BeliefDivergenceBand | PLAUSIBLE |
| src/components/map/RelationshipChronicleSection.jsx:147,150,160-161,205-208 | `includeCovert` on `relationshipChronicle`: the **covert ("quiet business") history rows** in gold, and the footer sentence variant | 6 (reach) | DERIVED (6), redundant | same | PLAUSIBLE |
| src/components/map/NpcTrailSection.jsx:12,93,97,100,109,114 | The court's dated NPC **trail** (`npcInteriority(...includeGroundTruth:true).groundTruth.trail`, the ladder sidecar). It passes `npc:{name}` only, so no at-birth `npc.secret` is involved. | 6 (reach) | DERIVED (6), redundant | same | PLAUSIBLE |
| src/components/map/TreatyPanel.jsx:79,84,172-176,191 (+ treatyDocument.js:30,236-240) | The treaty **true-state chip**: a term whose `trueState` has failed while the observed `complianceState` still reads honored (a quiet default). Without the flag, the "kept" public reading. | 6 (reach) | DERIVED (6), redundant | same | PLAUSIBLE |

Comment-only (not rows): dossierLazyTabs.js:29,34,56,63 · OverviewTab.jsx:529 (`r.tier`/`tierNounFor` are settlement-size tiers, not account tiers) · galleryVeil.js:336 · rumorHeraldLink.js:25 · validationOnPage.js:14,271 · powerStateProse.js:819 · npcInteriorityRead.js:12,14,34,254 · BeliefDivergenceBand/PerspectiveStandings/NpcTrail header lines (folded above).

Domain/display parameter seams (no tier read inside; each defaults to `includeGroundTruth=false`, fail-closed). **These are INFRA, and the re-key is at the callers only.** I grepped all 14 domain files for `tier ===|isPremium|isElevated|useStore|auth.|resolveTier|TIER_` and found 0 hits.

| domain function (file:line) | callers that pass the flag |
|---|---|
| settlementRumors (settlementRumors.js:947-996) | RumorsTab.jsx:160 (tier) · domain/briefs/composers.js:149,310,357 (`true`), 186 (`false`) · pdf/lib/liveWorld.js:177 (`false`) |
| settlementBeliefs (settlementBeliefs.js:139-154) | WarTab.jsx:482 · BeliefDivergenceBand.jsx:114 · PerspectiveStandings.jsx:102 (all `true` behind a tier-keyed outer check) · **pdf/lib/liveWorld.js:182 (`true`, behind the PDF chapter's "premium/canon/live three-fold gate"; not group A, needs the same re-key)** |
| beliefTruthProvider (beliefTruthBands.js:66-70) | BeliefDivergenceBand.jsx:109 |
| neighbourMirrorLines (neighbourMirror.js:183-205) | RelationshipsTab.jsx:56 |
| npcInteriority (npcInteriorityRead.js:261-291) | NpcTrailSection.jsx:109 (`true`) · new/npcComponents.jsx:283 (no flag, so player-only for everyone) |
| treatyTrueStateChip (treatyDocument.js:236-240) | TreatyPanel.jsx:84 |
| settlementCredibility / realmCredibility (credibilityRead.js:59,94) | composers.js:148,185 (`false`) · RealmIntrigue.jsx:59 (omitted, so false) · internal :103 |
| settlementBlocs / realmPolitics (politicsRead.js:112,141) | composers.js:146,183,335-336 · RealmIntrigue.jsx:58 (includeCovert only) · internal :148. PowerTab reaches the same seam through `politicsBlocsOf` (`!playerView`) |
| giftsAndDebtsFor / realmGiftsAndDebts (giftsAndDebtsRead.js:97,141) | internal :150 only; **no UI caller** (dormant seam) |
| settlementPestilence / realmPestilence (settlementPestilence.js:115,201) | pdf/lib/liveWorld.js:199 (`false`) · internal :213 |
| linkRumorsToHerald / heraldEntriesByEventRef (rumorHeraldLink.js:76,140; `includeCovert`) | internal only |
| staffValidationRows (validationOnPage.js:271) | ViabilityTab.jsx:110 (staff) |

#### NOTES

**Counts by class (24 rows):** VIOLATION 7 (RumorsTab, WarTab, useLaunchTones, RelationshipsTab, HousesBlock (latent), WatchPanel (latent), Unaffiliates covert half (split)) · DERIVED 7 (FaithTab ×2, BeliefDivergenceBand, PerspectiveStandings, RelationshipChronicleSection, NpcTrailSection, TreatyPanel) · CONSISTENT 6 (PowerTab, SettlementWorkbenchMount, useWorldMapCampaignModel, RealmDashboard, RealmMobileGate, RealmLockedGate (copy + launch)) · INFRA 4 (ViabilityTab staff, ExportUnlockDialog, DossierLadderModal, DossierSessionNotices) · plus 12 domain seams, INFRA (parameter-only). Comment-only hits: about 14 lines, folded.

**Special question, the chair's ruling (a): verified, sized as SMALL.**
- (i) The reveals are listed per row above. All are DM-truth projections of **simulator ledgers**: rumour truth, provenance and divergence; true army position and the belief gap; belief maps; neighbour-mirror basis and date; covert house patrons; covert watchers; covert wanderer leashes; covert chronicle rows; NPC trails; quiet treaty defaults.
- (ii) Data: **every one reads `campaign.worldState`** (rumorLedgers, canonizedAt + armyTransit, belief maps, spatialLedgers mirror, counterIntel, consequence economy, treaty ledger). Only the simulator writes them. **None reads at-birth settlement fields.** The at-birth relationships, conflicts, martial record and faith line on these same tabs are already ungated.
- (iii) A free account can hold this data only as a **downgraded Cartographer's retained campaign**: `inactive_plan`, owner-readable, loaded into `campaigns` for every non-anon account, and purged at `retention_expires_at = downgrade + 3 months` (023:63, 024:338-373, 165:58). Anon and free cannot create or import one (campaignSlice:586; gallery import premium). Inside that window the dossier tabs show the player projection and refuse the truth. That refusal is the only reachable VIOLATION surface. **So there is no instance of "a free DM refused truth about their own *generated* settlement"; the refusal is about their own *retained simulated realm*.** On the map, free is already refused the campaign wholesale (useWorldMapCampaignModel `activeCampaigns=[]`), which is a legitimate (6), so the map panels' inner tier term is dead weight (DERIVED). Re-keying it changes no reachable behaviour.
- (iv) Re-key expression for the dossier reads: `includeGroundTruth = !playerView && !publicDossier`. "World state present" is already enforced inside each read by its `campaigns.find(...)` predicate on the viewer's OWN store plus `hasBeliefMaps` / `counterIntelActive` / `canonizedAt`, so no extra `hasWorldState` term is needed. For the map panels: `includeGroundTruth = true`. If an owner-session proof is wanted, reuse `viewerSeesDmSecrets` (src/domain/display/viewerSecrets.js), which is already tier-free and already used by HeraldRemembrance:217, HeraldWanderers and RoadScenePanel:64. **PowerTab.jsx:252 (`!playerView`) is the landed precedent.**
- Callers to touch: RumorsTab:137 · WarTab:591 · useLaunchTones:30 (must move with WarTab) · RelationshipsTab:44 and OutputContainer:760 (drop the prop) · HousesBlock:33 · WatchPanel:51 · UnaffiliatesSection:106 (split the covert read from the verbs) · map: BeliefDivergenceBand:101, PerspectiveStandings:61, RelationshipChronicleSection:150, NpcTrailSection:97, TreatyPanel:176. Outside group A: pdf/lib/liveWorld.js:182 (beliefs truth behind the PDF premium gate) and OutputContainer.jsx:535 `hasFaithTab` (`!viewerIsPremium`).

**Surprises:**
1. Dossier tabs never filter `isCampaignActive` while the map does, so retained realms show in the dossier (player projection) but not on the map. The re-key should state whether retained `inactive_plan` campaigns count as "world state present". I recommend yes, because the player half already renders.
2. RealmDashboardLocked's P9 "preview of your own realm" can never fire for free, since the campaign is always null.
3. HousesBlock and WatchPanel are unmounted, so their re-key is free.
4. Re-keying will turn red tier-pinned tests and the `tests/lint/premiumGateSingleSource.test.js` 'content-visibility' census rows (BeliefDivergenceBand:136, TreatyPanel:150, PerspectiveStandings:156, OutputContainer:126, …). Candidate suites: beliefDivergenceBand, npcTrailSection, relationshipChronicleSection, treatyDossierTab, warFaithSurfacing, dossierDepthTabs, counterIntelSurfacesIn3. That census should shrink as a ratchet.

### §2.B TIER-PARITY CENSUS — GROUP B rows (the other component gates)
Repo read-only at d46ce9503. Every row is PLAUSIBLE: I read the code and did not execute it. Store selectors: `canExport` / `canUseMapChains` / `canUseCustomContent` = staffUnlocksPaidFeatures(role) ∨ TIER_GATE[tier].flag; `isElevated()` = isStaffRole(role), which is IDENTITY and NOT governed by the STAFF_UNLOCK_ALL_PAID kill switch; `viewerCanAuthor` = tier∈{premium,founder} ∨ isElevated (src/lib/viewerAuthority.js:79).
Extra class used: **UNDER-GATE** (a tier read that grants FREE something the law puts in the seven).

#### FAITH (special question b)

| file:line | what it gates | serves | class | re-key needed | conf |
|---|---|---|---|---|---|
| OutputContainer.jsx:280,535 (fwd 466 → dossier/useLaunchTones, 760 → RelationshipsTab: both group A) | Faith TAB PRESENCE. A non-premium, non-public viewer ALWAYS gets the tab (teaser). Premium/elevated + no `config.primaryDeitySnapshot` gets NO tab at all, so premium never sees the engine-generated faith line (church/temple words, senior cleric, religious faction, tithe, observance band from faithReadingOf). | 3 | VIOLATION (inverted parity): the line is generated-at-birth data that every tier holds, and it is withheld from premium. SessionMode already fixed this with `hasChurch` (see below); OutputContainer did not. | presence = embed ∨ faithHasChurchEvidence(reading), for every tier. Upsell clause keyed separately on ¬canUseCustomContent ∧ ¬publicDossier. Never tier. | PLAUSIBLE |
| settlement/FaithSection.jsx:354-363 (folds 300-345 teaser, 313 upsell) | Three modes. ACTIVE: the settlement carries an embed, and the full read-only panel (patron, cults, ranks, piety, legitimacy, mandate) renders to EVERYONE, free and public included. HIDDEN: premium + no embed, renders null. TEASER: free/anon + no embed, renders `faithLinesOf(reading)` (generated church/cleric/faction/tithe/observance, or the "quiet observances" line, plus FAITH_YOURS_LINE) and the "Awaken the pantheon" upsell (not on public dossiers). | 3 | DERIVED (3) for the upsell, but the HIDDEN branch has the same inverted-parity defect as the row above. Uses a tier literal, not canUseCustomContent. | Render the faith line for all tiers. Show the upsell iff ¬canUseCustomContent. | PLAUSIBLE |
| settlement/DeityAssignmentPanel.jsx:113,153,200,245 (mounted OutputContainer.jsx:731 when !readOnly; map/AssignDeityFromMap) | Patron/cult picker. canUseCustomContent → full picker. Lapsed (not entitled, owns an embed) → shed-only (remove patron/cult) + renew. Free/anon → upsell that names no deity. Store seam deityWriteGate (settlementDeityHelpers.js:97-108) enforces the same. | 3 (and 1) | CONSISTENT | — | PLAUSIBLE |
| settlement/eventComposer/EventComposerDeityField.jsx:63-64,88-90,93 | Make-Changes composer patron/cult staging. When !canUseCustom it shows an upsell and canStageDeityEvent returns false, which refuses the REMOVE mode too. | 3 (1) | CONSISTENT, with one small drift: a lapsed owner can shed a deity in the panel but not in the composer. | Optional: allow `deityMode==='remove'` when the settlement owns the embed (mirror deityWriteGate shed). | PLAUSIBLE |
| session/SessionMode.jsx:197-199,226 | Session Mode event tail: a non-premium viewer's last-3 events drop the deity event kinds (isFaithEventEntry). | 3 | DERIVED (3), over-wide: a lapsed/downgraded owner loses their own deity chronicle lines while FaithSection ACTIVE shows them the same deity name. | Filter only when the settlement owns no embed, or key on canUseCustomContent ∨ embed ownership. | PLAUSIBLE |
| session/SessionMode.jsx:238,243,251,377 | Session Mode faith-section presence. Embed → panel. Free → teaser. Premium + church building → the faith line. Premium with no embed and no church → nothing. | 3 | DERIVED (3). This is the already-fixed version of the OutputContainer inverted bug. Residual: premium + accessOnly/faction/cleric with no church building still gets nothing (uses `hasChurch`, not faithHasChurchEvidence). | Use faithHasChurchEvidence. | PLAUSIBLE |
| settlementDetail/resolveExportSeam.js:54,67-69; SettlementDetail.jsx:408,415; settlements/CampaignFolder.jsx:132,160,196; generate/ExportDraftButton.jsx:74 (constant false) | `faithUnlocked` (tier premium ∨ elevated) feeds pdf/variants.js:191 faithChapterVisible = included ∧ **hasLiveWorld** ∧ faithUnlocked. Free PDFs never carry the Faith & War chapter. | 2,3 | DERIVED (2): the chapter only has data when the simulator ran (hasLiveWorld = a campaign worldState). The tier conjunct is redundant except for a lapsed owner. | Drop the tier term. Key on hasLiveWorld ∧ (embed ∨ campaign) present. | PLAUSIBLE |

#### EDITING (1) / EXPORT (4)

| file:line | what it gates | serves | class | re-key | conf |
|---|---|---|---|---|---|
| OutputContainer.jsx:33,284,492,720,721,752,1032 | npcAuthoringAllowed = viewerCanAuthor ∧ ¬public ∧ ¬player. NPC lifecycle levers and Institutions/Crisis `canAuthor`. Free sees read-only cards. | 1 | CONSISTENT | — | PLAUSIBLE |
| SettlementDetail.jsx:232,262,314-317,538,790,791 | canEdit / canAuthorNpc (viewerCanAuthor ∧ owner-scope). The Edit Dossier door and NPC editors. Free gets "Edit (Cartographer)" → upsell. | 1 | CONSISTENT | — | PLAUSIBLE |
| settlementDetail/SettlementDetailActions.jsx:36-53 | The Edit button. !canEdit → "Edit (Cartographer)" secondary, launch-locked pre-launch. | 1 | CONSISTENT | — | PLAUSIBLE |
| settlement/NextActionRail.jsx:54,141,217-229 | Rail "Edit" item. !canEdit → Lock icon, "Manual editing is a Cartographer feature". | 1 | CONSISTENT | — | PLAUSIBLE |
| settlement/NextActionRail.jsx:153 | `realmTier` tag (Cartographer) on the "Send to Realm" item. A display tag only; the item is still offered. | 6 | INFRA (display) | — | PLAUSIBLE |
| settlements/SettlementCard.jsx:110-111,514 | canEditSettlement = TIER_GATE.settlementEditor ∧ isStaffRole: the dark Edit-mode door. Staff only today; Cartographer does not see it. | 1 | CONSISTENT (dark: narrower than the law, owner-gated per authSlice §20.4) | — | PLAUSIBLE |
| BuyThisDossier.jsx:56-60,76-77,114; SettlementDetail.jsx:243-248,323,393,544,804; settlement/NextActionRail.jsx:78-82 | resolveExportAccess: canExport ∨ elevated → export. Anon → anon one-shot buy. Free unsaved → "save first". Free saved without a right → $2.99 durable per-save rung. Free saved WITH the right → export. | 4 | CONSISTENT | — | PLAUSIBLE |
| generate/ExportDraftButton.jsx:42-50 | Export of an unsaved draft PDF. The button self-hides unless canExport ∨ elevated. Free must save, then buy. | 4 | CONSISTENT | — | PLAUSIBLE |
| primitives/exportLaunchGate.js:29-40 (consumers: primitives/LaunchGatedExport.jsx, WorldPage, compendium/CustomContent, surveyor/CustomContentPanel, contentStudio) | exportsOpenFor = staff ∨ gallery ∨ purchasesOpen. Pre-launch, EVERY non-staff export (premium included) wears the "Available at launch" skin. | 4 | INFRA (a launch switch, not a tier read; tier-blind) | — | PLAUSIBLE |
| settlement/VersionsTab.jsx:256,341 | Version history. Non-premium gets LockedDestination: no timeline, no manual snapshot, no compare, no revert. The store records snapshots tier-blind (settlementSlice.js:306 recordSnapshot, with no gate), so a free save can hold canonize/save/export milestones it cannot see. | none (revert is arguably 1) | VIOLATION | Show timeline + compare + manual snapshot to all. Gate only REVERT on viewerCanAuthor if the owner rules revert = editing. Tier literal also omits founder/staff unlock. | PLAUSIBLE |

#### SIMULATOR (2) / WORLD MAP (6) / GALLERY IMPORT (5) / CUSTOM CONTENT (3)

| file:line | what it gates | serves | class | re-key | conf |
|---|---|---|---|---|---|
| SettlementsPanel.jsx:68,85,87-88,805,814,874,898,926; fwd settlements/SettlementCard.jsx:555,597; settlements/CampaignFolder.jsx:224 | canManageCampaigns (premium ∨ elevated). Campaign folders, add/remove-to-campaign, bulk campaign actions, Create campaign. Free sees a flat library with a "campaigns are Cartographer" upsell. Neighbour modifiers stay ungated (line 278-281). | 2 | CONSISTENT | — | PLAUSIBLE |
| settlements/CampaignFolder.jsx:224,366-382 | Campaign PDF / World Book. The folder is only active when canManageCampaigns, plus a LaunchGatedExport wrap. | 2 (4) | DERIVED (2): campaign exports exist only with a campaign | — | PLAUSIBLE |
| WorldMap.jsx:134,495,771-772,813,868,878-879 (canManageCampaigns from map/useWorldMapCampaignModel.js:58, group A) | Realm campaign picker, Advance Realm/pulse, Herald, simulation rules, save-map-to-campaign, auto-resume, mobile RealmMobileGate / desktop RealmLockedGate. | 2 | CONSISTENT | — | PLAUSIBLE |
| WorldMap.jsx:820 (+ map/WorldMapToolbar.jsx:374,391, group A) | `handleExportMap` = authTier !== 'anon'. Any signed-in FREE account can export the world-map image. More broadly, the desktop FMG canvas, mode switch, templates, regenerate, layers and image import render for free; only the campaign group (toolbar:391) is gated. | 6 | UNDER-GATE: the world map (6) itself is not gated on desktop, only the campaign/simulator layer is | If (6) is the map: gate the canvas/toolbar on a world-map entitlement (premium), not campaign. At minimum, export-map = canUseMapChains-style premium. Owner call. | PLAUSIBLE |
| MapOverlay.jsx:69,337 | `<ChainEdges/>` (supply-chain edges) renders only with canUseMapChains (TIER_GATE.mapChains). Derivation is tier-blind. | 6 | CONSISTENT. In practice it is also DERIVED (2): edges exist only between settlements placed in a campaign, which free cannot create. | — | PLAUSIBLE |
| generate/PlaceInRegionCard.jsx:33-34 | Create-flow "Place in Region" (target campaign + birth patron). Non-premium sees a labelled teaser + upsell. | 2,3 | CONSISTENT. Its campaign half is keyed on canUseCustomContent rather than the campaign entitlement; the tier set is the same today. | Campaign half → the campaign predicate. | PLAUSIBLE |
| instant/InstantWorldEntry.jsx:51,68,78 | Instant World (one-click staged realm + map). Non-premium → pricing moment + purchase modal. | 2,6 | CONSISTENT (tier literal ∨ isElevated: staff bypass survives a kill-switch revoke) | — | PLAUSIBLE |
| gallery/GalleryMaps.jsx:36,119,133,184,186,278,281 | Import gallery map / map+settlements. Free → "Import (premium)" + error notice. Server-gated too (galleryImportMap, mig 120). | 5 | CONSISTENT | — | PLAUSIBLE |
| gallery/GalleryCampaigns.jsx:70,148,160,199,298,299 | Import gallery campaign. Free → "Import (premium)". | 5 (2) | CONSISTENT | — | PLAUSIBLE |
| gallery/GalleryDetail.jsx:144,237 (+152 purchasesOpen) | Import a gallery settlement. Free signed-in → "Import (premium)" → pricing. Signed out / non-importable → "Forge your own". Viewing the dossier is open to all. | 5 | CONSISTENT | — | PLAUSIBLE |
| account/AccountDataPrivacySection.jsx:462 | Account-file import preview: "Campaign import needs premium; campaigns in this file will be skipped" (store accountImportBody.js:73). | 2 | CONSISTENT | — | PLAUSIBLE |
| account/AccountDataPrivacySection.jsx:152-157 | Account DATA EXPORT loads cloud custom content only if canUseCustomContent. A lapsed owner's cloud gods/guilds/goods are not loaded into their own export file. | 3 | DERIVED (3), but it touches data portability (the owner's own data, not authoring) | Load for export regardless of tier (read-only). Owner/privacy call. | PLAUSIBLE |
| compendium/CustomContentGate.jsx:77 (+21 purchasesOpen) | Custom-content upsell card, "See Cartographer". The decision lives in compendium/CustomContent.jsx (group A). | 3 | CONSISTENT | — | PLAUSIBLE |

#### SURVEYOR (7) — special question d

| file:line | what it gates | serves | class | re-key | conf |
|---|---|---|---|---|---|
| surveyor/surveyorGate.js:16-21 | isSurveyorTier DEFINITION: hasSurveyorEntitlement ∨ isFounder ∨ role∈{admin,developer}. | 7 | INFRA (definition) | — | PLAUSIBLE |
| surveyor/useSurveyorEntitled.js:18,41-52; surveyor/SurveyorDoor.jsx:75,94,107 | THE DOOR: the floating left-margin AI tab, the analyst, and the workshop. It returns null unless entitled. Free and bare Cartographer see NOTHING (no tease). | 7 | CONSISTENT | — | PLAUSIBLE |
| account/useAccountSurveyorGate.js:21-25,48-59; AccountPage.jsx:80,107,497,519 (+ AccountAiKeysSection.jsx:58,90, group A) | Account "AI & keys" (BYOK) nav row + section. ?section=ai falls back to Profile when not entitled. | 7 | CONSISTENT (byte-identical inline copy, pinned by tests/components/surveyorGateParity.test.js) | — | PLAUSIBLE |

#### INFRA (staff identity, sell-to-the-tier, launch switch, display facts, save cap)

| file:line | what it gates | serves | class | re-key | conf |
|---|---|---|---|---|---|
| AccountPage.jsx:73,431,517; account/AccountNav.jsx:61,71-72; AccountMenu.jsx:192,253,280,460; AdminPanel.jsx:72,75,122; CommandPalette.jsx:53 | Staff identity: Developer Admin row/link, the "Developer" name fallback, slate rule, /admin body (support desk too), and elevated routes left out of the palette. | none | INFRA (staff-only) | — | PLAUSIBLE |
| account/AccountSubscriptionSection.jsx:28,41,77,80,83,108,111,164,179,193; PricingPage.jsx:76,217,247; PurchaseModal.jsx:36,173,178,310,325 | Sell-to-the-tier: plan badge/colour, "Current plan", "Manage subscription", "See Cartographer" CTA, credits ∞ for staff, credits→subscription nudge. | none | INFRA | — | PLAUSIBLE |
| account/AccountSubscriptionSection.jsx:145-153 (copy) | "Cartographer = unlimited + cloud sync". "Cloud sync" means custom-content sync (useCustomContentCloudSync); saves are cloud for free too. | 3 (+save cap) | INFRA (copy claim). Ambiguous: it reads as if free lacks cloud saves. | Copy: "unlimited saves + custom-content sync". | PLAUSIBLE |
| purchasesOpen() sites: AccountAutoReloadPanel.jsx:52,91; AccountSeatTransferPanel.jsx:212; AccountSubscriptionSection.jsx:60; ReferralRedeemBlocks.jsx:134; BuyThisDossier.jsx:110; PurchaseModal.jsx:46,81; GalleryDetail.jsx:152; InstantWorldEntry.jsx:72; PricingBands.jsx:261; PricingMomentCard.jsx:134; PricingTierCards.jsx:66,262; LockedDestination.jsx:73; EventComposerDeityField.jsx:93; SettlementDetailActions.jsx:35; SettlementCard.jsx:75; SaveQuotaMeter.jsx:50; FaithSection.jsx:307; DeityAssignmentPanel.jsx(purchasesAreOpen); PlaceInRegionCard.jsx:37; CustomContentGate.jsx:21 | The launch switch (lib/launchGate.js): purchase CTAs are disabled and wear the AvailableAtLaunch pill. Tier-blind. | none | INFRA | — | PLAUSIBLE |
| home/LandingBelowFold.jsx:37,423 | TIER_FACTS display (ANON_MAX_SIZE_LABEL, FREE_SAVE_LIMIT, FOUNDER_SEATS) interpolated into the tier strip. The words come from copy/landing.js `closer.tiers` (copy dir, another group). | none | INFRA (display fact) | — | PLAUSIBLE |
| GenerateWizard.jsx:84-85,592,600-601 | canSave / authTier forwarded to the Save row, BuyThisDossier, ExportDraftButton (rows above). | 4 | folded (fwd) | — | PLAUSIBLE |
| SettlementsPanel.jsx:65,283,368,783,896,924 | Free may REACTIVATE retained `inactive_plan` saves up to min(maxSaves,3). Lets a downgraded Cartographer bring 3 saves back. | none | SAVE-CAP family: maxSaves (free 3 / ∞) is enforced (TIER_GATE + 014/024 trigger) but is NOT among the seven. VIOLATION by the letter; owner question. | Owner: is the save cap a premium thing? If parity → free.maxSaves Infinity + server save_limit. | PLAUSIBLE |
| settlements/SaveQuotaMeter.jsx:26,46,77,95,125 | Save meter: "N of 3 saves left on Wanderer" + "at cap" + upsell pitch. Premium: "Unlimited saves · the living world is unlocked". | none | SAVE-CAP family (same owner question) | as above | PLAUSIBLE |
| AccountPage.jsx:83,435,483; account/AccountSubscriptionSection.jsx:32,137,145; account/AccountDataPrivacySection.jsx:74,342-343,458 | Save-cap display; account-file import truncates to the remaining free slots. | none | SAVE-CAP family | as above | PLAUSIBLE |

Not rows: compendium/CatalogTabs.jsx:80 ("elevated" is English prose, a false positive); StaffOnlyPage.jsx:4 and admin/{AdminSimTuningPanel,AdminUsersPanel,AiPricingResyncPanel,SupportQueuePanel}.jsx (comment-only; the panels mount inside the elevated-gated AdminPanel).

#### OUTSIDE THE CHARTER DIRS (src/store, src/hooks, src/App*.jsx, src/main.jsx; there is no src/pages; utils/workers/engine/kernel/generators/data/design/styles/application have no hits)

| file:line | what it gates | serves | class | re-key | conf |
|---|---|---|---|---|---|
| store/authSlice.js:83-85,118,416,420,423,801-905 | TIER_GATE, resolveTier, isElevated, isPremium, isFounder, the can*/maxSaves/maxAllowedTier selectors. | — | INFRA (definitions) | — | PLAUSIBLE |
| store/index.js:287,288,294 | useCanUseNeighbour / useCanExport / useIsElevated hook exports. | — | INFRA | — | PLAUSIBLE |
| store/galleryImportSettlement.js:37-38; store/galleryImportMap.js:124-128,225-229 | Store-seam refusals for gallery settlement/map/campaign import. Server: mig 120 current_user_has_premium_access. | 5 | CONSISTENT | — | PLAUSIBLE |
| store/campaignSlice.js:586; store/campaignImportedCreation.js:84-85 | createCampaign / imported-campaign creation refused for non-premium. | 2 | CONSISTENT | — | PLAUSIBLE |
| store/accountImportBody.js:73,203,223 | Account-file import: campaigns need premium; custom-content archive/pack needs canUseCustomContent ("Custom-content import needs premium"). A lapsed owner restoring their own export loses their gods/guilds/goods. | 2,3 | CONSISTENT | — | PLAUSIBLE |
| store/customContentArchiveActions.js:86; store/settlementDeityHelpers.js:99 | Custom-content archive writes; deityWriteGate (assign refused, shed allowed for embed owner). | 3 | CONSISTENT | — | PLAUSIBLE |
| store/campaignWorldPulseSlice.js:391 | Spatial canonize on the campaign map → `not_entitled` unless tier premium. | 2,6 | CONSISTENT (raw tier literal; staff pass via resolveTier) | — | PLAUSIBLE |
| store/settlementLifecycleHelpers.js:200-208 (callers settlementGenerateAction.js:687, settlementSlice.js:1455) | activateFaithIfEntitled: premium ∨ elevated opening/generating a LEGACY save copies the engine-baked `config.latentPantheon` (the premade pool, retired by T4) into live embeds. Free never activates, and the latent gods stay private. | none (premade gods, not custom content) | VIOLATION-legacy: tier unlocks engine data that is not custom content. Only pre-T4 saves carry it. | Owner: retire the activation (the doctrine says no premade gods), or key it on canUseCustomContent. | PLAUSIBLE |
| store/aiChronicleAppend.js:42-44 (lib/chronicle.js:23 CHRONICLE_LIMITS free 5 / premium ∞) | AI chronicle retention per save: free keeps 5 entries, premium/staff unlimited. The data is the user's own paid-credit narrations. | none | VIOLATION | One limit for all tiers (Infinity, or an owner-chosen N). Not a tier read. | PLAUSIBLE |
| store/galleryImportSettlement.js:40; galleryImportMap.js:253; instantWorldBody.js:183; saveMoments.js:129; accountImportBody.js:576 | maxSaves() caps on import, instant world, and save moments. | none | SAVE-CAP family (owner question) | as above | PLAUSIBLE |
| store/creditsSlice.js:67; store/aiSlice.js:329,611,820 | Staff bypass the credit balance check (AI is credit-priced for every tier). | none | INFRA (staff) | — | PLAUSIBLE |
| store/settlementGenerateAction.js:63,95 | TIER_FACTS maxSizeLabel / ANON_SIZES in the size-refusal copy. | none | INFRA (display fact) | — | PLAUSIBLE |
| hooks/useCustomContentCloudSync.js:15,23,49 | Custom-content cloud migrate/load for premium ∨ elevated. Anon clears. A lapsed free owner neither loads nor clears. | 3 | CONSISTENT | — | PLAUSIBLE |
| hooks/useCampaignAutoResume.js:43,51; hooks/useRealmInspector.js:73,227 | Realm auto-resume of the last campaign; pending simulation-rules consumption. | 2 | CONSISTENT | — | PLAUSIBLE |
| hooks/useReferralIntent.js:64,68; hooks/useFounderTileEligible.js:78 | Referral field / founder tile hidden for premium/founder/staff. | none | INFRA (sell-to-the-tier) | — | PLAUSIBLE |
| App.jsx:153,534,628,785; AppViews.jsx:207 | Staff identity: admin view, account-menu Developer row. | none | INFRA | — | PLAUSIBLE |
| App.jsx:369-371,571,629 | Post-checkout tier refresh; a "map_clicked" pricing moment when a free user opens Realm; showUpgrade. | 6 (analytics) | INFRA | — | PLAUSIBLE |
| AppViews.jsx:163 | `isPremium` prop to HomeLanding. HomeLanding never reads it (dead prop). | none | INFRA (dead) | Delete the prop. | PLAUSIBLE |
| main.jsx:61,89 | Analytics elevated flag / auth-state bucket. | none | INFRA | — | PLAUSIBLE |

#### NOTES

**Counts by class** (group B + outside, one per row above):
- CONSISTENT 28 (21 in group B, 7 outside)
- DERIVED 6 (FaithSection, two SessionMode rows, faithUnlocked/PDF, CampaignFolder exports, AccountDataPrivacy export)
- VIOLATION 4 (OutputContainer Faith-tab inverted parity, VersionsTab, aiChronicle retention, legacy latent-pantheon activation)
- UNDER-GATE 1 (WorldMap export/canvas vs 6)
- SAVE-CAP family 4 rows (owner question; VIOLATION by the letter)
- INFRA 17 (8 in group B, 9 outside)
- Folded: 1 (GenerateWizard)

Comment-only / type-annotation hits: 43 (OutputContainer 5, BuyThisDossier 6, AccountNav 4, AccountMenu 3, useAccountSurveyorGate 3, SettlementDetail 3, AdminUsersPanel 2, SurveyorDoor 2, useSurveyorEntitled 2, one each in surveyorGate, PricingPage, CampaignFolder, SaveQuotaMeter, AdminSimTuning, SupportQueue, AiPricingResync, WorldMap, GenerateWizard, MapOverlay, StaffOnlyPage, AccountPage, resolveExportSeam). One false positive: CatalogTabs:80.

**(b) FAITH: the chair's DERIVED-from-(3) ruling is REFUTED in part.**
- The deity half is truly custom content. Generation never writes `primaryDeitySnapshot` (generateSettlementPipeline.js:175). Gallery import strips embeds (lib/importScrub.js:54, galleryImportSettlement.js:76-80). catalogData.js has no deities. T4 retired the premade pool.
- But a free owner CAN hold faith content, in three ways:
  - **Downgraded Cartographer.** handle_premium_downgrade (023/024) flips every save to `inactive_plan` for 3 months. SettlementsPanel lets free reactivate 3, and each keeps its `primaryDeitySnapshot`/cults/faithProfile. DeityAssignmentPanel's LAPSED mode exists for exactly this case.
  - **Legacy pre-T4 saves.** They carry an engine-baked `config.latentPantheon` (premade, not custom). Only premium activates it (settlementLifecycleHelpers.js:200).
  - **A shared premium dossier.** Its embed renders ACTIVE to everyone, including a free viewer.
- **What the free viewer sees in place of the Faith row:**
  - With no embed: the TEASER. `faithLinesOf(faithReadingOf(s))` is built from GENERATED data: church/temple institutions, senior cleric NPC, religious faction, tithe income row, and the `priorityReligion` dial. The text is e.g. "A parish church keeps the faith in the village. X, the priest, leads its clergy… Tithes are collected… The faith's god and the church's name are yours to set." Then the "Awaken the pantheon" upsell (no deity named).
  - With an embed: the full panel.
- So the tier read is not gating custom content at all on the free side. It gates the upsell and, perversely, HIDES the generated faith line from premium (OutputContainer:535, FaithSection:363). The correct key is "embed present → panel; church evidence → line; ¬canUseCustomContent → upsell", for any tier.

**(d) SURVEYOR**
- isSurveyorTier (surveyor/surveyorGate.js:16) admits exactly: an active `surveyor_entitlements` row (via the `has_surveyor_entitlement()` RPC, which also returns true for staff under mig 201), OR `isFounder`, OR role admin/developer. The client role disjunct is not governed by STAFF_UNLOCK_ALL_PAID.
- A **bare Cartographer does NOT hold it.**
- Founders are admitted client-side and by the provisioning/BYOK RPCs (mig 159/191), though not by `has_surveyor_entitlement()` itself.
- What each account sees:
  - **Free / premium:** no door and no AI & keys tab; `?section=ai` redirects to Profile. Silent, no tease.
  - **Surveyor / founder / staff:** the door (chat → analyst/workshop) and the BYOK section.
- It is consistent with (7). The account copy is a byte-pinned inline twin of the predicate.

**Map / region / import / export**
- **Is the region map the world map?** Yes. There is no separate region-map component. The "region" in PlaceInRegionCard is a campaign. "Send to Realm" places a settlement on WorldMap.jsx's FMG map. components/region/* are regional-graph (simulator) readers, not maps.
- **Map gates (6) are only partly consistent.**
  - mapChains is consistent (and DERIVED from 2 in practice).
  - Every WorldMap gate is canManageCampaigns, i.e. the campaign/simulator (2). The desktop map canvas/toolbar itself renders for free, and WorldMap.jsx:820 lets any signed-in free account export the map image. This is an UNDER-GATE if (6) means the map itself.
- **Gallery import (5):** consistent client and server (mig 120). Viewing and sharing to the gallery stay free.
- **Export (4):** consistent through resolveExportAccess / canExport, including the $2.99 durable-right rung. The exportLaunchGate pre-launch switch closes non-staff export for premium too (tier-blind).

**Surprises**
- VersionsTab and chronicle retention (free 5) are tier gates on things outside the seven.
- The save cap (free 3) is enforced everywhere but is not in the seven. The owner should say whether it counts.
- `tier==='premium' || isElevated()` is used by many gates (InstantWorld, SessionMode, FaithSection, OutputContainer, SettlementsPanel canManageCampaigns, resolveFaithUnlocked). That pattern is NOT governed by the STAFF_UNLOCK kill switch, unlike the `can*` selectors.

### §2.C Group C: tier-parity census rows (read-only, d46ce9503)

#### A. Gate rows (group C files)

| file:line | what it gates | serves | class | re-key needed | conf |
|---|---|---|---|---|---|
| src/lib/viewerAuthority.js:76-77 (folded 23,24,28,45,47,57,70,72) | `viewerCanAuthor`: the one authoring predicate, `tier==='premium'\|\|'founder'\|\|isElevated()===true`. Its consumers (SettlementDetail canEdit, SettlementWorkbenchMount, OutputContainer npcAuthoringAllowed, UnaffiliatesSection) hide prose, NPC and change-dock editing from non-premium users. It reads raw `auth.tier` plus `isElevated` (IDENTITY), so the STAFF_UNLOCK switch does not reach it (staffEntitlements.js:52-56) | 1 | INFRA (definition; its consumers are CONSISTENT (1)) | — | PLAUSIBLE |
| src/config/tierFacts.js:173-176 (EXPORT_MODE) | Display fact: anon/free `per_dossier`, premium `unlimited`. Pinned to TIER_GATE.export by contract test | 4 | INFRA (display fact) | — | PLAUSIBLE |
| src/config/tierFacts.js:178-180 (CUSTOM_CONTENT) | Display fact: custom content premium-only | 3 | INFRA | — | PLAUSIBLE |
| src/config/tierFacts.js:191-196 (SETTLEMENT_EDITOR) | Display fact: editor premium-only (the gate adds a staff-only conjunct while dark) | 1 | INFRA | — | PLAUSIBLE |
| src/config/tierFacts.js:186-190, 127-130 (PRE_GEN_OPTIONS, signInUnlocksCustomize) | Display fact: anon false, free = premium true. Free is at parity; only anon is locked | none (anon-only) | INFRA | — | PLAUSIBLE |
| src/config/tierFacts.js:30,44-46,71-87,93,144 (ANON_MAX_TIER, ANON_SIZES=['town'], SIGN_IN_UNLOCKS, accountHolderPhrase) | Anon size display: anon forges only a Town. Free and premium both get every size | none (anon-only) | INFRA | — | PLAUSIBLE |
| src/config/tierFacts.js:160-169, 206-232, 237 (TIER_FACTS.*.saveLimit, FREE_SAVE_LIMIT, signInUnlocksClause) | Save-cap display: anon 0, free 3 (from TIERS.wanderer.saveLimit), premium ∞. This is the cap's display home; see Q(c) | none (saves are not among the seven) | INFRA (display of a cap the law does not name) | see Q(c) | PLAUSIBLE |
| src/config/entitlementLadder.js:98 every-size | Pricing table row, free=true | parity | CONSISTENT | — | PLAUSIBLE |
| src/config/entitlementLadder.js:99 saves | Pricing table row: free "3 saves", Cartographer "unlimited" (enforcement TIER_GATE.maxSaves) | none | VIOLATION (pending owner Q(c)) | if the cap goes: free:'unlimited' (or drop the row) | PLAUSIBLE |
| src/config/entitlementLadder.js:100 custom-content | free false / cart true | 3 | CONSISTENT | — | PLAUSIBLE |
| src/config/entitlementLadder.js:101 gallery-viewing | parity row. NOTE: the ladder has NO row for gallery IMPORT (5), the editor (1) or the world map (6) | parity | CONSISTENT | — (omissions noted) | PLAUSIBLE |
| src/config/entitlementLadder.js:107 same-engine | "constitutional" parity row | parity | CONSISTENT | — | PLAUSIBLE |
| src/config/entitlementLadder.js:108 living-realm | TIER_GATE.neighbour | 2 | CONSISTENT | — | PLAUSIBLE |
| src/config/entitlementLadder.js:109,148,167 map-chains (+ VIEWING_PAYWALLS_PENDING_514) | Supply-chain layer on the world map (MapOverlay/LayersPanel/RoutesToolbar). The §514 ledger calls it a "viewing paywall"; under the new law the whole world map is premium, so the ledger entry is moot | 6 | DERIVED (6) | — (the §514 ledger entry can retire) | PLAUSIBLE |
| src/config/entitlementLadder.js:124 export-bundle | free "$2.99 per settlement", cart "included" | 4 | CONSISTENT | — | PLAUSIBLE |
| src/config/entitlementLadder.js:130 surveyor-stages | "per task" on both columns | 7 | CONSISTENT | — | PLAUSIBLE |
| src/config/pricing.js:248,271,302 (TIERS.*.saveLimit 3/∞/∞) | Catalog source of the free cap (feeds TIER_FACTS) | none | INFRA (cap source; Q(c)) | see Q(c) | PLAUSIBLE |
| src/config/pricing.js:250-260,273-279,304-310 (TIERS.*.features) | neighbourhoodSystem/pdfExport/jsonExport/supplyChainMap/founderBadge flags. No reader in src (only tests/tierFacts pins) | 2/4/6 | INFRA (dead display data) | — | PLAUSIBLE |
| src/config/pricing.js:269 (cartographer.monthlyCredits 30) | A premium credit allowance, not a capability gate. Credits pay narration and Surveyor tasks, which stay per-task for everyone | none | INFRA (price bundle) | — (owner may ask whether a premium-only credit grant is "parity") | PLAUSIBLE |
| src/config/pricing.js:143-147,467 (TIER_MULTIPLIERS, getSurveyorAiCost) | Per-tier Surveyor price multiplier. Inert: every value is 1 and no caller passes a tier | 7 | INFRA | — | PLAUSIBLE |
| src/lib/chronicle.js:23-27 (CHRONICLE_LIMITS; consumer src/store/aiChronicleAppend.js:42-44, doc aiSlice.js:1015) | Narrative chronicle on each save (`ai_data.chronicle`: initial/regenerate/progression/revert snapshots). FREE/ANON keep 5 FULL snapshots; older ones rotate to `summary` (aiSettlement/aiDailyLife prose nulled, so a revert to them loses the prose). Premium and elevated keep all of them. Reads `isPremium()` (raw tier) and `isElevated()` | none (history depth of the narrative layer, which is pay-per-use at parity; not the simulator) | VIOLATION | one limit for every tier (Infinity, or a storage cap applied the same to everyone); never key it on tier | PLAUSIBLE |
| src/lib/pricingMoments.js:48 | Suppresses upsell modals for premium. Also compares `opts.tier` to 'developer'/'admin', which a tier never holds (dead disjuncts) | none | INFRA (sell-to-the-tier) | — | PLAUSIBLE |
| src/pdf/SettlementPDF.jsx:64-72,124-131,165,206 (faithUnlocked → faithChapterVisible, pdf/variants.js:191) | PDF chapter 18 "Faith & War": deity, patron/mandate odds, war status, mobilisation, army, occupation, trade pressure, rumors, DM belief-divergence, pestilence, flow drift. It renders only if `faithUnlocked` (resolveFaithUnlocked = tier==='premium'\|\|isElevated, resolveExportSeam.js:67) AND liveWorld is non-null. liveWorld is non-null only with an ACTIVE campaign's worldState (simulator, 2) or a `primaryDeitySnapshot` (deity, 3). Can a free account hold that data? WAR half: no. A downgrade sets campaigns `inactive_plan` (024 handle_premium_downgrade), `isCampaignActive` is then false, so campaign=null. DEITY half: yes. A downgraded Cartographer who reactivates a settlement through 023 reactivate_free_settlement keeps its deity embed, and its export omits the chapter | 2 (war), 3 (faith) | DERIVED (2,3) | none needed; if the owner wants "custom content" to mean authoring only, re-key the faith half to "settlement carries a deity" | PLAUSIBLE |
| src/foundry/journalPages.js:405-410,477-484,516-519 + src/foundry/generateFoundryModule.js:7-10,33-37,51 | Same seam for the Foundry VTT module: the Faith & War journal page via faithChapterVisible, plus the Timeline page dropping faith events (gateFaithEvents) when !faithUnlocked | 2,3 | DERIVED (2,3) | as above | PLAUSIBLE |
| src/pdf/lib/liveWorld.js:41-44,170-199 (includeGroundTruth false/true/false) | Audience projection inside the Faith & War slice: rumors are player-safe, beliefs are DM truth, pestilence is player-safe. DM truth reaches only the premium chapter above. No tier read here | 2 | INFRA (projection riding the SettlementPDF gate) | — | PLAUSIBLE |
| src/lib/copyGuard.js:20,47-48,65,78 | Copy/selection deterrent, flag `copyGuard` default OFF. Only STAFF (`isElevated`) is exempt. Premium is NOT exempt, despite the header saying it "nudges toward a premium account" | none | INFRA (staff-only) | — | PLAUSIBLE |
| src/lib/routes.js:35,92,419 | `guard:'elevated'` on /admin | none | INFRA (staff) | — | PLAUSIBLE |
| src/lib/stripe.js:19,128 + src/lib/launchGate.js:31 | `purchasesOpen()`: all checkout is closed until VITE_PURCHASES_OPEN. It applies to every tier, so it closes the $2.99 right (4) for free too | none | INFRA (launch gate) | — | PLAUSIBLE |
| src/lib/checkoutReconcile.js:36,76,114 | Post-checkout poll: success when the fetched tier is 'premium' | none | INFRA | — | PLAUSIBLE |
| src/lib/analyticsFlush.js:68-71; analyticsQueue.js:50; analyticsQueueState.js:31 | 'dogfood' stamp for elevated (staff) actors | none | INFRA (analytics) | — | PLAUSIBLE |

**comment-only (not rows, 14):** stripe.js:42; staffEntitlements.js:33,44,45,53,59; saveAccess.js:13,14; refusalReasons.js:80; engineRemote.js:11; engineAbsentPaths.js:17; flagRegistry.js:71 (founderRecognition tile "self-gates on tier !== 'premium'", the gate itself is in FounderTile, another group); auth.js:11; pricing.js:252.

**false-positive (36):**
- "elevated", meaning risk band, terrain or text (13): magicProfile.js:49,65; settlement.schema.js:1701; catalogData.js:24,25; compendiumData.generated.js:464,465; scenePortraitExport.js:20; compileTownSceneGeometry.js:512; townLayoutV2.js:201,206,212,221.
- "tier", meaning settlement size band (4): genesis.js:142,157,355; politics.js:93.
- `includeGroundTruth` as a DM/player AUDIENCE projection with no tier read (19): hegemony.js:136,146,249; composers.js:12,148,149,183,185,186,210,217,243,278,310,357; citations.js:13,28,31,41. The brief composers have no consumer outside their own module.

#### B. Copy census (one row per claim)

| file:line | claim (≤15 words) | of seven | verdict |
|---|---|---|---|
| landing.js:46 | "Free. No account needed to forge your first town." | parity | CONSISTENT |
| landing.js:74 (rendered LandingBelowFold:540) | "Without an account, forge up to a Town. Sign in free for every size, saving…" | anon | STALE ("up to": anon now gets Town ONLY, ANON_SIZES=['town']) |
| landing.js:86-91 forge.sizes | Hamlet/Village/Town unlocked; City/Metropolis locked | anon | STALE but UNRENDERED (LandingBelowFold:177 says unreferenced) |
| landing.js:110 brief.library | "Sign in free to keep every town in your Library" | saves | STALE (cap 3), unrendered (no reader found) |
| landing.js:120 brief.saveNote (rendered LandingArtifacts:271) | "free account · keeps every draft" | saves | STALE (gate caps free at 3; CONSISTENT if the cap goes) |
| landing.js:172 realm.waypointPill | "Cartographer" pill over the whole Realm section | 2,3,6 | CONSISTENT |
| landing.js:176 realm.body1 | "Canonize the draft… part of your campaign… world map… your own gods, guilds" | 2,3,6 | CONSISTENT for campaign/map/content; canonize itself is ungated in the store, and the pill implies it is premium (minor) |
| landing.js:203 | "Turns on when you do. The free tier keeps working." | 2 | CONSISTENT |
| landing.js:238 commons.body | "admire and share freely, and fork one… with Cartographer" | 5 | CONSISTENT |
| landing.js:277 Wanderer | "every size with full settlement customization… up to {freeSaves} saves… Gallery" | saves/parity | CONSISTENT with the gates (the cap is Q(c)) |
| landing.js:278 Cartographer | "the Realm, wars…, custom content, and gallery import. Unlimited saves and unlimited exports." | 2,3,5,4 (+saves) | CONSISTENT; omits editor (1) and world map (6); "unlimited saves" depends on Q(c) |
| landing.js:279 Surveyor | "optional AI workshop… proposes edits for you to approve… Bring your own key." | 7 | CONSISTENT (see Q(d)) |
| landing.js:295 Founder (hidden by invitationOnly) | "Everything Cartographer runs" | — | CONSISTENT |
| pricingPage.js:32 serviceLine | "your realm keeps living (wars resolve, prices move, chronicles write)" | 2 | CONSISTENT |
| pricingPage.js:36-37 Surveyor | "priced per task… No subscription required." | 7 | CONSISTENT with per-task pricing; omits that the door needs an entitlement (isSurveyorTier). See Q(d) |
| pricingPage.js:38 | BYOK runs tasks without credits | 7 | CONSISTENT |
| pricingPage.js:60 charter | "Everything Cartographer runs…" | — | CONSISTENT |
| pricingPage.js:76-77 bundle | "{price} buys one settlement's complete export bundle… No account required." | 4 | CONSISTENT (SINGLE_DOSSIER.requiresAccount false; closed until purchasesOpen) |
| pricingPage.js:125 engineNote | "Every tier runs the same simulation. The engine itself is never tier-gated." | 2 | CONSISTENT in letter (same engine), but in TENSION with (2): free cannot advance time |
| pricingPage.js:139-148 band4 rows | the ladder table (see A rows) | — | as in A; "saves" row VIOLATION pending Q(c); no rows for 1, 5, 6 |
| pricingPage.js:159 surveyorNote | "priced per task, on either plan, with no subscription" | 7 | CONSISTENT; contradicts the dark SURVEYOR_PLAN $14.99/mo (pricing.js:348) if it is ever lit |
| pricingPage.js:170 FAQ cancel | "Library keeps the free tier's {freeSaves} saves active; beyond that retrievable {retentionMonths} months" | saves | CONSISTENT-ish: downgrade inactivates ALL settlements (024) and the user re-activates 3 via the RPC; the copy implies 3 stay active automatically. Depends on Q(c) |
| pricingPage.js:174 | "Monthly Cartographer credits arrive with each cycle." | — | CONSISTENT (bundle) |
| pricingPage.js:186 | "a free account adds saves and every settlement size" | anon/saves | CONSISTENT |
| en.js:77 | "Free anonymous generations are capped at town size." | anon | CONSISTENT |
| en.js:103-104,122,133,431 | "{full} free settlements today…" / "today's free towns" (anon daily cap 1+2) | anon | CONSISTENT (anonGenCounter) |
| en.js:123,139,1479 | "Sign in (free) to reach thorpe… metropolis and save your drafts. PDF for $2.99." | anon/4 | CONSISTENT |
| en.js:187 | "The lighter sizes open with a free account." | anon | CONSISTENT |
| en.js:221-223 (rendered AuthPanel:262-263) | "Saves, larger settlements, and the Neighbour System" / "link settlements in the Neighbour System" | 2 | STALE (promises FREE the neighbour system; TIER_GATE.free.neighbour=false) |
| en.js:442,452,459,488 refusals | size / anon floor / pre-gen lock sentences | anon | CONSISTENT |
| en.js:536-537 realmGate | "Advance the realm… Access wars, religion, trade, the world!" | 2,6 | CONSISTENT |
| en.js:561-565 / 653-657 Wanderer | "any size, from hamlet to metropolis" · "3 saved settlements" · "$2.99" · credit packs | parity/saves/4 | CONSISTENT (omits thorpe; cap is Q(c)) |
| en.js:578-581 / 663-667 Cartographer | advance time, campaigns, war layer + pantheon, custom content + gallery import | 2,3,5 | CONSISTENT |
| en.js:582 / 668 | "Unlimited saves + cloud sync" | saves | VIOLATION for "cloud sync": free saves are cloud rows too (settlements table, 014/024). "Unlimited saves" depends on Q(c) |
| en.js:583 / 669 | "Unlimited PDF and JSON export of every settlement" | 4 | CONSISTENT |
| en.js:584 / 670 | "30 narrative credits every month" | — | CONSISTENT (bundle, not a gate) |
| en.js:618-621 / 676-679 Founder | badge, Discord, "Early access to new simulators" | — | CONSISTENT (not gates) |
| en.js:628 singleDossier | "We'll generate, export, and email you a full PDF. No account needed." | 4 | CONSISTENT |
| en.js:705 valueLadder.tries | "Generate a coherent town up to town size, no signup." | anon | STALE-minor ("up to": town only) |
| en.js:712 / 1732 | "A free account generates any size… saves your work. PDF for $2.99." | parity/4 | CONSISTENT |
| en.js:718 / 1734 | "Advance time and the region runs for years…" (Cartographer) | 2 | CONSISTENT |
| en.js:766-773 surveyorDoor | door labels, no tier claim | 7 | CONSISTENT |
| en.js:821, 861 | "Your first three saves are free." (hard-coded "three") | saves | CONSISTENT with the cap (a Q(c) byte) |
| en.js:1100 | "monthly Cartographer credits reset each cycle" | — | CONSISTENT |
| en.js:1141 | "not enough free save slots for a realm this size" | saves | CONSISTENT (a Q(c) byte) |
| en.js:1170-1171 | "freeing one of your three free slots" (hard-coded) | saves | CONSISTENT (a Q(c) byte) |
| en.js:1318, 1321 | "Save this {tierNoun}. Free account" / "{limit}-save cap on the free tier" | saves | CONSISTENT (a Q(c) byte) |
| en.js:1456 first_canonize (fired by PhaseBadge.jsx:64, useNextActionRailHandlers.js:72) | "Upgrade adds canon snapshots, timeline export variants, and narrative refinement." | none | VIOLATION: canonize is ungated; variants are canon-gated, not tier-gated (ExportSheet.jsx:41); narrative refinement is pay-per-use at parity |
| en.js:1460 first_ai_use | "Upgrade includes a monthly credit allowance" | — | CONSISTENT (bundle) |
| en.js:1464 first_canon_export (fired SettlementDetail.jsx:436) | "Upgrade unlocks unlimited canon-mode exports and the timeline-packet variant." | 4 | CONSISTENT for "unlimited exports"; VIOLATION for "timeline-packet variant" (canon-gated, not tier-gated) |
| en.js:1468 cloud_save (NO trigger found) | "Upgrade syncs your settlements, drafts… to your account." | none | VIOLATION in dead copy (cloud sync is at parity) |
| en.js:1472 first_save | "Free tier holds 3 saves" | saves | CONSISTENT (a Q(c) byte) |
| en.js:1483 first_pdf_export | "Cartographer exports every settlement, unlimited, with cloud sync." | 4 | CONSISTENT for exports; VIOLATION for "cloud sync" |
| en.js:1487 third_save | "Wanderer caps at 3 saves… unlimited saves, cloud sync, neighbour network, full export" | saves,2,4 | "cloud sync" is a VIOLATION; 2 and 4 are CONSISTENT; the cap is Q(c) |
| en.js:1492 regen_burst | "Drift and the chronicle: Cartographer hands you the worldbuilder controls." | 2 | CONSISTENT if "chronicle" means the realm chronicle; if it means the narrative chronicle it rides the CHRONICLE_LIMITS VIOLATION |
| en.js:1495-1496 map_clicked | "World Map unlocks with Cartographer." | 6 | CONSISTENT |
| en.js:1502,1509,1513,1517 | realm teaser / advance / war layer / pantheon → Cartographer | 2 | CONSISTENT |
| en.js:1529, 1818 | Founder Hall claims | — | CONSISTENT |
| en.js:1540-1547 pricingPitch | "Any size, free" / "Three saves is enough" / Cartographer = advance time, campaigns | parity/saves/2 | CONSISTENT (Q(c) byte at 1542) |
| en.js:1623-1624 | "A one-time purchase unlocks every export for this settlement…" | 4 | CONSISTENT |
| en.js:1635 | "Save this settlement to unlock its exports" | 4 | CONSISTENT ((4) presumes a save; see Q(c)) |
| en.js:1640 saveFirst.atCap | "at its save limit. Free a slot, or move to Cartographer for unlimited exports." | saves/4 | CONSISTENT with the gates. The cap BLOCKS the $2.99 right: a capped free user cannot buy (4) for a 4th settlement |
| en.js:1649, 1653, 1657 ladder | free account + buy once / Cartographer unlimited PDFs + simulation / one-time no account | 4,2 | CONSISTENT |
| en.js:1757 aboutLiving.intro | "Each one is premium, opt-in, and off until you turn it on." | 2 | CONSISTENT |
| en.js:1794 replay.footer | "Cartographer runs it across your whole campaign." | 2 | CONSISTENT |
| en.js:1806 accountFaq | "Every account gets one free Narrative." | parity | CONSISTENT |
| en.js:1941 | "The settlement editor is not open on this account." | 1 | CONSISTENT |
| HowToUse.jsx:99 | "The premium layer: how a whole region keeps moving" | 2 | CONSISTENT |
| HowToUse.jsx:241 | "pick a mode: Basic Generate… or Advanced Generate" (untiered) | anon | STALE for anon (no mode picker: GenerateWizard.jsx:339; preGen locked) |
| HowToUse.jsx:244 | "Free mode (no account) reaches up to {Town}; sign in to unlock City and Metropolis" | anon | STALE (anon = Town only; sign-in also unlocks thorpe/hamlet/village; it tells anon to pick Hamlet or Village) |
| HowToUse.jsx:252, 310, 397 | Save / "Export PDF… print-ready briefing" (untiered) | 4 | STALE-minor (non-premium export goes to the $2.99 ladder; anon cannot save) |
| HowToUse.jsx:306, 309, 393 | "Campaigns… Group settlements into named campaign folders… Export a campaign" (untiered) | 2 | STALE (reads as free; campaign creation is premium-gated, campaignSlice.js:586) |
| HowToUse.jsx:299, 312, 396 | "Edit Names lets you rename any NPC or faction" (untiered) | 1 | STALE (editing is viewerCanAuthor-gated; PLAUSIBLE) |
| HowToUse.jsx:365 | "Group into campaigns, link as neighbours, edit, rename, and export." | 1,2,4 | STALE (premium verbs, unmarked) |
| HowToUse.jsx:366, 400-403 | World Map drag-to-place; Relations; "Chains" supply-chain overlay (untiered) | 6 | STALE (unmarked; mapChains premium) |
| HowToUse.jsx:394 | "Link Neighbour… bidirectionally link it to another" (untiered) | 2 | STALE (unmarked) |
| HowToUse.jsx:419-420 | "Build your own institutions… appear in the Settlement Editor catalog and persist to your browser" | 3,1 | STALE (unmarked premium; also account-synced, not browser-only) |
| howto/LivingWorldTab.jsx:110,167 | "Cartographer is the paid tier that runs the living simulation, $5.99 a month." | 2 | CONSISTENT |
| howto/AboutManifesto.jsx:220-221 | "saved settlements stay retrievable for {RETENTION_MONTHS} months after a downgrade (migration 023)" | saves | CONSISTENT |

#### NOTES

**Gate-row counts (30 rows):** INFRA 18 · CONSISTENT 7 · DERIVED 3 (map-chains (6); PDF Faith & War (2,3); Foundry Faith & War (2,3)) · VIOLATION 2 (ladder `saves` row, pending Q(c); `CHRONICLE_LIMITS` free=5). Also 14 comment-only hits and 36 false-positives (17 "elevated"/"tier" meaning terrain, risk or size band; 19 `includeGroundTruth` audience projections with no tier read).

**Copy counts (79 claim rows; a row counts as VIOLATION if it carries any VIOLATION part):** CONSISTENT 56 · VIOLATION 8 (cloud sync ×4: en.js:582/668, 1483, 1487, 1468-dead; first_canonize 1456; timeline-packet 1464; band4 ladder "saves" row pending Q(c); en.js:1492 is not counted) · STALE 15 (anon "up to Town" landing:74 / en.js:705; landing forge.sizes (unrendered); landing:110 (unrendered) and :120 keeps-every-draft; en.js:221-223 Neighbour System promised to free; HowToUse anon steps 241, 244; HowToUse unmarked premium verbs: export 252, campaigns 306, Edit Names 312, 365, world map 366, Link Neighbour 394, custom content 420).

**Surprising:**
1. `CHRONICLE_LIMITS` (src/lib/chronicle.js:23) is a tier gate nobody's ladder lists. Free and anon lose the full prose of narrative-chronicle entries past the 5th.
2. "Cloud sync" is sold as a Cartographer feature four times, but free saves are already server rows.
3. The first_canonize moment sells "canon snapshots, timeline export variants" as upgrades. Both are at parity in the code.
4. en.js:221-223 (the auth modal, which is live) promises the free account the Neighbour System, which is premium.
5. copyGuard exempts staff only. With the flag on, a paying subscriber is copy-blocked too.
6. The landing and HowToUse still say anon reaches "up to a Town". Since 2026-10-30 anon gets only Town.

**Q(c) THE SAVE CAP: every carrier, and what changes if the cap goes** (cap goes = free maxSaves → Infinity, or unlimited):
- ENFORCEMENT, client: src/store/authSlice.js:84 `free.maxSaves: 3` → Infinity. Readers update automatically: authSlice.js:810 canSave (stays true), :901-904 maxSaves(); SettlementsPanel.jsx:65,783; AccountPage.jsx:83,435,483; AccountSubscriptionSection.jsx:137,145,153 (its "One save left" warning goes dark at ∞); AccountDataPrivacySection.jsx:74,342-343; galleryImportSettlement.js:40; galleryImportMap.js:252-258; instantWorldBody.js:182-183 (en.js:1141 realmSlots then never fires); accountImportBody.js:575-576.
- HARD-CODED 3 in client logic: SettlementsPanel.jsx:283 `Math.min(maxSaves||0, 3)` gates reactivation of inactive saves. Remove the min, or make reactivation unconditional. saveMoments.js:42 `=== 3 && maxSaves === 3` (third_save): the moment dies naturally, or delete it.
- ENFORCEMENT, server: supabase/migrations/033_security_review_hardening.sql:117-137 is the LIVE `enforce_save_limit` (`else 3`; it supersedes 014:64-86 and 024:297-312). A new migration is needed to return NEW for 'free', or to drop the trigger. 023:133-143 `reactivate_free_settlement` (`active_count >= 3` → free_limit_reached) needs a new migration that removes the count. 024 handle_premium_downgrade (~:340-370) inactivates ALL settlements and campaigns on downgrade. Without a cap, decide whether settlements stay `active` (campaigns/maps stay inactive, because the simulator (2) and map (6) are premium). 165 purge, 166/retention-warning-cron, 178, 179 and 102 consume `inactive_plan`: retention then applies only to premium-only artifacts. 120's gallery-import gate is unaffected.
- DISPLAY sources: pricing.js:248 `TIERS.wanderer.saveLimit: 3` → Infinity. tierFacts.js:216 (derives), :237 FREE_SAVE_LIMIT, :167 signInUnlocksClause (its `saveLimit > 0` branch would print "save up to Infinity drafts", so it needs a "save your drafts" branch). entitlementLadder.js:99 'saves' row (both columns 'unlimited', or drop the row).
- DISPLAY renderers: SaveQuotaMeter.jsx:26,75 ("save up to {N}"; the meter's used/max strip becomes meaningless, retire it). LandingBelowFold.jsx:423 + landing.js:277 `{freeSaves}`. PricingBands.jsx:349 + pricingPage.js:170 FAQ (rewrite the cancel answer). SingleDossierSuccessPage.jsx:33,416. HomeHero.jsx:453 (via the clause).
- LITERAL "3/three" bytes: en.js:562, 654, 821, 861, 1170, 1171, 1321 ({limit}), 1472, 1487, 1542, 1640. src/lib/emailTemplates.js:50 and supabase/functions/send-email/index.ts:64 ("Your first three saves are free"). No other edge function carries the cap.
- TESTS pinning 3: tests/config/pricing.test.js:335; tests/config/tierFacts.contract.test.js:139; tests/store/staffUnlockEntitlements.test.js:90,210,287; tests/security/enforceSaveLimit.pglite.test.js:11,80-86; tests/store/saveMoments.test.js:60-116; tests/components/saveQuotaMeter.test.jsx; tests/copy/signInUnlocks.test.js; tests/copy/landingClaimsParity.test.js; tests/config/entitlementLadder.enforcement.test.js; tests/store/quotaGates.test.js; tests/store/phantomQuota.test.js; e2e/flow-c-save-journey.spec.js. Fixture stubs `maxSaves: 3` in tests/components/launchLock.account.test.jsx:92 and tests/ui/accountSubscriptionSectionCta.test.jsx:38.
- DO NOT CONFUSE: entitlementLadder.js:243 `RETENTION_MONTHS = 3` is the retention window (months), not the cap.
- KEEP-the-cap path: fix only the STALE copy (landing.js:120 "keeps every draft", and the unrendered :110) and record the cap as an owner-ruled eighth premium item. Law (4) presumes a save, and en.js:1640 shows the cap blocking the $2.99 right at the 4th settlement. That interaction is the strongest argument for removing the cap.

**Q(d) Surveyor promises:**
- Landing (landing.js:279, for everyone, logged out): "AI · early access" workshop (analyst, prose briefs, session interpretation that "proposes edits for you to approve"), BYOK, outside the tier cards.
- Pricing (pricingPage.js:36-38, 159; ladder :130; for both plans): "priced per task… No subscription required… on either plan."
- en.js: only the door labels (766-773). There is no tier claim.
- HowToUse: says nothing about the Surveyor.
- The gate (isSurveyorTier) requires an owner-granted entitlement, a Founder, or staff. No surface says access is by grant; "early access" is the only hint.
- Two tensions: (a) the dark SURVEYOR_PLAN $14.99/mo (pricing.js:348) contradicts "no subscription". (b) "Proposes edits for you to approve": applying an edit is (1) post-generation editing. Does a free, Surveyor-entitled user get to approve? That is unmeasured and an owner question.

**Q(anon) how anon differs from free beyond saves and exports:**
1. Size: one size only. TIER_GATE.anon minTier=maxTier='town' (authSlice.js:83); tierFacts ANON_SIZES; settlementGenerateAction.js:138,320 force settType town. A sample fork passes the floor (§934.34).
2. Pre-generation options: locked. preGenOptions false; GenerateWizard.jsx:339 hides the Basic/Advanced mode picker; refusal PRE_GEN_LOCKED.
3. Daily generation cap: 1 full + 2 rerolls. lib/anonGenCounter.js:38-43; enforced at settlementGenerateAction.js:407-416. Free has no cap.
4. Draft lifetime: unsaved anon draft expires after 24h (persistMerge.js:38-57).
5. Narration: canNarrate requires non-anon and a saveId (SettlementDossierHero.jsx:54). The welcome free Narrative is accounts only (WelcomeCreditCard.jsx:81).
6. Campaign runtime never loads for anon (campaignRuntimeView.js:28,35). Moot, since campaigns are premium.
7. World-map image export is hidden for anon (WorldMap.jsx:823). Moot, since the map is (6).
8. Export ladder: BuyThisDossier.jsx:58,204 routes anon to the one-shot buy (no durable right, since there is no save).
9. UI-only differences: GenerateWizard.jsx:272 (no unsaved-exit prompt), HomeHero.jsx:149, SaveQuotaMeter.jsx:47, SampleDashboard.jsx:27, RealmLockedGate.jsx:82, CustomContent.jsx:232 (upsell variant), PostGenCoach.jsx:220. Anon-only surfaces: RegionWakeReplay.jsx:73, HomeSampleDossier.jsx:60,71; non-anon only: WelcomeBackCard.jsx:43.
- The other ~110 `'anon'` hits are ownerId storage keys (customContent*, campaignSliceShared, campaignSync, customContentLocal*), not tier gates.

### §2.D Group D — server side (supabase/functions + supabase/migrations)

Repo HEAD d46ce9503. supabase/applied-head.json: appliedHead 203, so 201 is LIVE in production and 204-206 are pending. None of 204-206 touches a tier gate.
"LIVE" below means the latest CREATE OR REPLACE / CREATE POLICY in migration order. "sup." lists the definitions it superseded.
The 094 ALTER only re-pins search_path and never changes a body.

#### A. Edge functions

| file:line | what it gates | serves | class | re-key needed | conf |
|---|---|---|---|---|---|
| functions/ai-analyst/index.ts:201-204 (comment :8) | The AI analyst. `rpc('has_surveyor_entitlement')`; if that is not `true`, returns 403 "The analyst is part of the Surveyor plan…". Refused: free, and a bare Cartographer (premium, no Surveyor row). Admitted: an active surveyor_entitlements row, or staff. | 7 | CONSISTENT | — | PLAUSIBLE |
| functions/construct-realm/index.ts:170-172 | AI realm construction. Same has_surveyor_entitlement gate, 403 "AI construction is part of the Surveyor plan. You can still compose realms by hand". | 7 | CONSISTENT | — | PLAUSIBLE |
| functions/construct-settlement/index.ts:169-171 | AI settlement construction. Same gate, 403 ("…generate settlements by hand in the wizard"). | 7 | CONSISTENT | — | PLAUSIBLE |
| functions/custom-content/index.ts:181-183 (comment :12) | AI custom-content compiler. Same gate. It returns DRAFTS only and writes no state. Minting a draft goes through apply_custom_content_command, which is premium-gated (row C-9). So a free account that buys Surveyor gets drafts it cannot mint (7 ∧ 3 stack). | 7 | CONSISTENT | — | PLAUSIBLE |
| functions/interpret-session/index.ts:184-186 (comment :12) | AI session interpretation. Same gate, 403. | 7 | CONSISTENT | — | PLAUSIBLE |
| functions/interview/index.ts:145-147 (comment :11) | The Interview. Same gate, 403. | 7 | CONSISTENT | — | PLAUSIBLE |
| functions/parley/index.ts:120-122 | Parley. Same gate, 403. | 7 | CONSISTENT | — | PLAUSIBLE |
| functions/surveyor-autonomy/index.ts:161-163 (comment :14) | Autonomous advances. Same gate, 403. In practice it also needs a live campaign, and only premium can create one (row C-6). | 7 | CONSISTENT | — | PLAUSIBLE |
| functions/surveyor-byok/index.ts:171-173 | Bring-your-own-key. Same gate, 403. (Its `tier` at :271-323 is the PROBE tier scout/journeyman/master, not an account tier.) | 7 | CONSISTENT | — | PLAUSIBLE |
| parley:219,252-253 · construct-settlement:290,360-361 · surveyor-autonomy:286,357-358 · interpret-session:310,382-383 · construct-realm:291,361-362 · interview:277,308-309 · ai-analyst:344,392-393 · ai-analyst/creditFlow.ts:23,43-44,90,99,101,106 · custom-content:314,384-385 | `elevated` is spend_credits' STAFF flag (role developer/admin). Staff are never debited, so refund() no-ops and the balance shows as 999999. This is not a tier read. | none | INFRA | — | PLAUSIBLE |
| functions/generate-narrative/index.ts:1225,1285,1397-1413,1468,1525,1585 (comments 1170,1202,1297,1323,1330,1344,1406-1410,1418,1582) | Narrative refinement has NO tier or Surveyor gate: it reads no tier, no premium flag and no surveyor entitlement. It is credit-priced (spend_credits). Every account gets one free narrative (claim_free_narrative, :1351; migration 118). The only special case is staff: current_user_is_privileged, `isElevated`. Free and premium are treated identically. | none | INFRA (parity; staff-only branch) | — | PLAUSIBLE |
| functions/generate-chronicle/index.ts:288,292,298 | Same pattern as narrative: credits plus the staff `isElevated` bypass. No tier read. | none | INFRA | — | PLAUSIBLE |
| functions/engine-generate/index.ts:70,102,162-167,316-319 | Staff (profiles.role) skip the per-account and per-IP rate limit. No tier read. NOTE: the server has NO anon "town only" size cap and no free thorp..capital range. The TIER_GATE.anon/free min/maxTier is client-only. | none | INFRA | — | PLAUSIBLE |
| functions/admin-actions/index.ts:77-78,215-218,234-238,263-264,336,351,951,1075-1110,1859,1941 | Staff console. It sets profiles.tier free/premium and is_founder (two-key, _shared/twoKey.ts:39), counts premium users, grants Surveyor (:1859), and labels Cartographer ledger rows. | none | INFRA | — | PLAUSIBLE |
| functions/stripe-webhook/index.ts:2893-2928, 3011, 3318-3348, 3382, 3406-3431, 860-887, 176-294 | Billing state machine. On checkout it sets tier='premium' (premium) or tier='premium' with is_founder (founder), then calls restore_premium_settlements. It grants Surveyor as a SEPARATE entitlement row (:3011, product 'surveyor'), never a tier. On pause or delete it calls handle_premium_downgrade; the `tier !== 'premium'` guards at :3323 and :3408 stop retention being stamped twice. On resume it restores. The founder refund clawback is at :884. | none | INFRA | — | PLAUSIBLE |
| functions/stripe-webhook/index.ts:304-306,344-346,441-471 | The Cartographer monthly allowance: 30 credits per paid premium invoice (plan 'cartographer_monthly'). A bundled credit perk, not a gate. Credits then buy narrative or Surveyor tasks. | none | INFRA (pricing fact) | — | PLAUSIBLE |
| functions/founder-transfer/index.ts:656-708 · functions/create-checkout/index.ts:97,113 | Founder seat handoff writes tier and is_founder. The checkout product list: premium and surveyor are subscriptions, founder_lifetime is abolished. | none | INFRA | — | PLAUSIBLE |
| functions/send-email/index.ts:64-66 | Welcome email copy: "Your first three saves are free. After that, sign up for a Cartographer subscription or claim a Founder Lifetime seat". Two problems: it advertises the save cap (rows C-1 and C-2), and it sells an ABOLISHED product (create-checkout:113 ABOLISHED_PRODUCTS = founder_lifetime). | none | VIOLATION (follows the save-cap call; stale founder copy regardless) | Drop the cap claim if the cap goes. Drop "Founder Lifetime seat" either way. | PLAUSIBLE |
| functions/retention-warning-cron/index.ts:6,195,257-269 | Emails owners of plan-inactive settlements and saved_maps rows when retention_expires_at falls within 14 days (default windowDays 14). | none | INFRA | — | PLAUSIBLE |
| functions/ingest-events/index.ts:133,172-174,236-305 · _shared/aiGroundingBundle.js:9787,9811 · og-image/index.ts:155,231 | Not account-tier reads. ingest-events uses `elevated` as a rate band and `tier` as the consent tier. The grounding bundle's "elevated" is a baseRisk flavour value, and its 99 `tier` hits are SETTLEMENT size tiers. og-image shows the settlement size tier. | none | INFRA (non-tier) | — | PLAUSIBLE |
| functions/verify-single-dossier/* · migrations/108_dossier_entitlements.sql:306 has_dossier_entitlement | Export (4) on the server is a durable per-save purchased right. It never reads tier. "Unlimited export for premium" is a CLIENT-only gate (canExport); no server byte refuses a free export. | 4 | CONSISTENT (no tier read) | — | PLAUSIBLE |

#### B. SQL — definitions (resolvers)

| file:line | what it gates | serves | class | re-key needed | conf |
|---|---|---|---|---|---|
| migrations/024_billing_retention_and_atomic_mutations.sql:240-255 `current_user_has_premium_access()` (LIVE, only definition) | True iff the caller's profile has tier='premium', or is_founder, or role in (developer, admin). The server's single "premium" predicate; rows B and C build on it. | 1,2,3,5,6 | INFRA (definition) | — | PLAUSIBLE |
| migrations/017_fix_credit_auth_integrity.sql:125-140,174 `profile_has_premium_access(uuid)` | tier='premium' or staff (no is_founder disjunct). DEAD: its only users, the custom_content write policies (017:142-171, re-created 059:253-267), were dropped by 185:1340-1352, and the table's writes were REVOKEd. | 3 | INFRA (dead helper) | — | PLAUSIBLE |
| migrations/201_staff_unlock_surveyor_entitlement.sql:82-108 `has_surveyor_entitlement()` (LIVE, applied; sup. 139:66-89) | Returns false when there is no auth.uid(). Returns true for staff (current_user_is_privileged()). Otherwise true only if an active `surveyor_entitlements` row exists. It does NOT read profiles.tier or is_founder, so a bare Cartographer FAILS and a Founder without a row FAILS. | 7 | INFRA (definition) | — | PLAUSIBLE |
| migrations/178_inactive_account_billing_fence.sql:494-571 grant_surveyor_entitlement (LIVE; sup. 159:45-78) · 159:81-127 revoke_surveyor_entitlement(_by_subscription) · 178:434-489 guard_inactive_surveyor_entitlement trigger · 139:48-64 table and owner-read policy | How a surveyor_entitlements row is written and removed. Service-role only. Callers: stripe-webhook :3011 (sub) and admin-actions :1859. No migration or webhook mints a row for founders or premium. | 7 | INFRA | — | PLAUSIBLE |
| migrations/001_initial_schema.sql:7 · 003_admin_rls_policies.sql:47-48 | CHECK tier in ('free','premium'). This makes the 'cartographer', 'founder' and 'wanderer' arms of enforce_save_limit unreachable. | none | INFRA | — | PLAUSIBLE |
| migrations/087_review_money_hardening.sql:46 (LIVE; sup. 075:273, 061:58, 018:60, 009) | profiles self-UPDATE policy pins tier, role, credits and is_founder to their current values, so a client cannot write its own tier. | none | INFRA | — | PLAUSIBLE |
| migrations/178:381-428 guard_inactive_profile_billing · 160_founder_transfer_cases.sql:642,703 · 175:259,368,391 / 178:630,1094,1199,1219 | Two fences: an inactive (deleted/disabled/banned) profile cannot be upgraded to premium or founder, and founder-transfer finalize sets tier='premium'. Plus the cleanup that runs on account deletion. | none | INFRA | — | PLAUSIBLE |
| migrations/192_tier_credit_multiplier.sql:110-215 spend_credits (LIVE; sup. 174:104, 161, 153, 151, 149, 140, 131, 114, 057, 024, 018, 009) | Credit debits for every AI feature. No account-tier read. Only staff (role) bypass. Its `p_tier` is the probe tier. AI pricing is tier-blind. | none | INFRA | — | PLAUSIBLE |
| migrations/050:228,313 · 053:171,671,729,737 · 104:92 · 117:91-94,183-184 | Admin summaries and reports that project or count tier and premium purchases. | none | INFRA | — | PLAUSIBLE |

#### C. SQL — user gates

| file:line | what it gates | serves | class | re-key needed | conf |
|---|---|---|---|---|---|
| C-1 migrations/033_security_review_hardening.sql:93-141 `enforce_save_limit()` (LIVE; sup. 024:273-315 and 014:29-91). Trigger `settlements_enforce_save_limit` BEFORE INSERT on settlements, created 014:94-98 and still bound. | A free account's 4th ACTIVE settlement INSERT raises 'save limit reached: free allows 3 active saves. Upgrade for unlimited saves.' Premium is unlimited. Staff return early. Only rows with access_state='active' count, and each count takes a per-user advisory lock. The cap value lives at 033:117-121 (`case user_tier when 'premium' then null … else 3`). | none (a save count is not one of the seven) | VIOLATION (owner call, question c) | Owner choice. To drop the cap, make `else 3` `else null` (and also C-2 :142). To keep it, add "saves" to the law. | PLAUSIBLE |
| C-2 migrations/023_explicit_models_and_plan_retention.sql:108-160 `reactivate_free_settlement(uuid)` (LIVE, only definition) | A free-only RPC: it raises 'reactivation is only needed for free accounts' when tier<>'free' (:132-135). It moves ONE retained inactive_plan settlement back to active and clears retention_expires_at, so that row is never purged again. It refuses with 'free_limit_reached' once there are 3 active (:142 `active_count >= 3`). | none | VIOLATION (same call as C-1) | Same as C-1. If the cap is dropped, this RPC becomes "reactivate any" or is retired. | PLAUSIBLE |
| C-3 migrations/024:334-379 `handle_premium_downgrade` (LIVE; sup. 023:56-106) | Service-role; called by stripe-webhook on pause or delete. It sets tier='free' and stamps premium_downgraded_at and premium_retention_expires_at = now()+interval '3 months' (:341). ALL active settlements AND all saved_maps go to inactive_plan with the same expiry. Founders are exempt (no-op). | none | INFRA (retention) | — | PLAUSIBLE |
| C-4 migrations/165_purge_spares_paid_entitlements.sql:38-67 `purge_expired_plan_inactive_assets` (LIVE; sup. 024:410-433), scheduled by pg_cron 'purge-expired-plan-assets' '17 3 * * *' (024:445-458) · 023:196-216 purge_expired_plan_inactive_settlements (still defined; cron does not call it) · 024:226-238 one-time saved_maps backfill (`premium_downgraded_at + interval '3 months'`, :232) | Daily at 03:17 UTC it DELETEs inactive_plan/pending_delete settlements and saved_maps whose retention_expires_at is ≤ now(). It SPARES a settlement that carries an active dossier_entitlements row; that settlement stays inactive_plan (read-only) with no end date. | none | INFRA | — | PLAUSIBLE |
| C-5 migrations/178:323-370 `restore_premium_settlements` (LIVE; sup. 024:381-406, 023:162-193) | On re-upgrade, every inactive_plan/pending_delete settlement and saved_maps row returns to active. Refused for an inactive account. | none | INFRA | — | PLAUSIBLE |
| C-6 migrations/059_enforce_account_status_rls.sql:81-97 saved_maps INSERT/UPDATE policies "Premium users insert own maps" / "…update active own maps" (LIVE; sup. 024:318-327, 002) | saved_maps holds both the world map and the campaign/realm envelopes. Insert and update require current_user_has_premium_access() ∧ account_is_active (update also needs access_state='active'). A free account cannot create or modify a map or campaign at all. | 6, 2 | CONSISTENT | — | PLAUSIBLE |
| C-7 migrations/179_owner_confirmed_privacy_deletes.sql:41-49 saved_maps DELETE policy (LIVE; sup. 059:99-104, 024:328-331) · 179:31-38 settlements DELETE (sup. 059:70) | Deletion is at parity: any active owner can erase a map or settlement, retained rows included. No premium predicate. | none | CONSISTENT (parity) | — | PLAUSIBLE |
| C-8 migrations/102_gate_pulse_persist_on_access_state.sql:45-218 `persist_world_pulse_advance` (LIVE; sup. 084, 069) | Advancing time (the World Pulse write). No tier read. It requires an owned saved_maps campaign row with access_state='active', and only premium can create one (C-6). A downgraded campaign is inactive_plan, so the advance is refused. | 2 | DERIVED (from 2, via the saved_maps RLS) | — | PLAUSIBLE |
| C-9 migrations/102:220-300 `merge_neighbour_backlink` (LIVE; sup. 096) | Writes neighbourNetwork and interSettlementRelationships into the caller's partner SETTLEMENT. Checks only account_is_active and access_state='active'. NO tier read, so a free account is admitted (settlements are free-writable). Neighbours (2) are gated only on the client (TIER_GATE.neighbour). | 2 | CONSISTENT (no tier read). GAP: no server gate for (2) here | — (parity-safe; add `current_user_has_premium_access()` only if the server must enforce 2) | PLAUSIBLE |
| C-10 migrations/185_custom_content_versions.sql:1925-1994 apply_custom_content_command body (renamed `_apply_custom_content_command_authorable` by 188:1604; the public wrapper 188:1608 delegates to it; grants 188:2742-2747) · 185:1340-1352 legacy custom_content writes revoked | Creating, revising, archiving or restoring custom content (gods, guilds, goods, traditions…) raises 'active premium account required' unless the caller is active ∧ current_user_has_premium_access(). | 3 | CONSISTENT | — | PLAUSIBLE |
| C-11 migrations/187_custom_content_archive_transfer.sql:1037-1078 `import_custom_content_archive` · 187:2690 `export_custom_content_archive` | Archive import is premium-only ('active premium account required'). Archive EXPORT has no tier gate: a downgraded user can still take their content out. | 3 | CONSISTENT | — | PLAUSIBLE |
| C-12 migrations/188_reviewed_supply_chain_persistence.sql:1049-1102 `apply_reviewed_supply_chain_command` | Persists a reviewed supply chain, which is derived from custom-definition revisions. Premium-only. | 3 | DERIVED (from 3) | — | PLAUSIBLE |
| C-13 migrations/186_campaign_content_binding_cas.sql:394-431 `compare_and_swap_campaign_content_binding` | Binds a content environment to a campaign (a saved_maps row). Premium-only. | 2, 3 | DERIVED (from 2/3) | — | PLAUSIBLE |
| C-14 migrations/184_import_reconciliation_commands.sql:200-246 `apply_import_reconciliation_command` | Structured import INTO a campaign ('import.settlement.create-and-attach', 'import.campaign.attach-existing'). Premium-only. A plain settlement import without a campaign uses the ordinary save path and is not gated here. | 2 | DERIVED (from 2: campaign membership) | — | PLAUSIBLE |
| C-15 migrations/131_repin_definer_search_path_pg_temp.sql:366-405 `import_gallery_dossier(text)` (LIVE; sup. 120:37-77, 093:161, 092:215-216, 048:25) | Clones a shared gallery SETTLEMENT. WHERE … `and public.current_user_has_premium_access()` (:403), so free and anon get ZERO rows (a clean "not available"). Viewing (get_gallery_dossier) and publishing stay free. | 5 | CONSISTENT | — | PLAUSIBLE |
| C-16 migrations/072_saved_maps_importable.sql:135-147 `import_gallery_map(text)` (LIVE, only definition) | Gallery MAP import needs only auth. It returns the same public projection get_gallery_map already shows, so a free account receives the payload. Persisting the clone is premium-only via the saved_maps INSERT policy (C-6). The server's refusal is indirect (an RLS failure on save), unlike the dossier path. | 5, 6 | DERIVED (from 5/6, via saved_maps RLS) | — (optional: add the predicate for parity with C-15) | PLAUSIBLE |
| C-17 migrations/191_surveyor_probe_tier.sql:185-205 `surveyor_byok_set` (LIVE; sup. 159:134-150) | Storing a provider key needs has_surveyor_entitlement() ∨ is_founder. Founders pass this SQL door but fail has_surveyor_entitlement in the surveyor-byok edge (:171), so the key is unreachable in practice. | 7 | CONSISTENT (founder mismatch noted) | — | PLAUSIBLE |
| (not rows) 011,019,020,022,025-032,046-048,057:201-226,063,071,076:104,088,092,093,123/128/130/142/189/205/206 denylists,147,168 | Every one projects or filters `s.tier`/`r.tier`, which is SETTLEMENT size. 036/037/038/041/042/198 are `consent_tier`. None reads an account tier. | — | non-tier | — | — |

#### NOTES

**Counts, all 47 rows across sections A–C (CONSISTENT counts include the one annotated CONSISTENT + GAP):**

| Class | Count | Rows |
|---|---|---|
| CONSISTENT | 17 | 9 Surveyor edge gates (7); export no-read (4); C-6 maps/campaigns (2,6); C-7 deletes (parity); C-9 backlink (no tier read, with a GAP on 2); C-10 and C-11 custom content (3); C-15 dossier import (5); C-17 BYOK (7) |
| DERIVED | 5 | C-8 pulse advance (2); C-12 supply chain (3); C-13 binding (2/3); C-14 campaign import (2); C-16 map import (5/6) |
| VIOLATION | 3 | C-1 save cap; C-2 reactivate cap; the send-email copy. All three hang on the owner's save-cap call. |
| INFRA | 22 | All of section B (9), 10 edge rows (including the non-tier row for ingest-events, grounding bundle and og-image), and C-3, C-4, C-5 |

No server-side gate keys the narrative, chronicle or engine on tier. Comment-only hits: about 20 (generate-narrative comments, engine-generate :70, the 120 header, and the 049/155 doctrine comments).

**Surprising:**
1. The founder mismatch has two sides:
   - The client's `isSurveyorTier` (src/components/surveyor/surveyorGate.js:16-22) admits `isFounder`. The server's has_surveyor_entitlement (201) does not, and nothing mints a row for founders. A Founder sees the Surveyor door and gets a 403 — the same inversion 201 fixed for staff.
   - surveyor_byok_set admits founders, but the edge in front of it refuses them.
2. Several pieces are client-only on the server:
   - Neighbour back-links (C-9).
   - The anon "town only" and free thorp..capital size ranges (engine-generate has none).
   - Unlimited export (4).
   - The dossier import (C-15) is server-refused, but the map import (C-16) only fails at save.
3. The enforce_save_limit 'cartographer', 'founder' and 'wanderer' arms are dead bytes: CHECK tier ∈ {free, premium}.
4. The welcome email still sells "Founder Lifetime", which is abolished.

**(c) Save cap, every byte that carries the free cap:**
- LIVE: 033:117-121 (`else 3`) and the message at 033:136-137; 023:142 (`active_count >= 3`) and the free-only guard at 023:132-135.
- Superseded (inert): 014:64-70 and 014:85-86, the message "Upgrade to Cartographer for unlimited"; 024:297-301.
- Comments: 014:59-62 and 014:100-101 "Free/Wanderer = 3 saves"; 023:230 "three free active settlements".
- Copy: functions/send-email/index.ts:64.
- No edge function enforces saves; create-checkout's saveId binding has no cap.

Changing the cap either way takes a new migration that re-creates enforce_save_limit (the 033 body) and reactivate_free_settlement (the 023 body).

**Retention window, every byte that carries "3 months":** 024:341 (LIVE handle_premium_downgrade), 023:63 (superseded), 024:232 (one-time backfill). The warning email goes 14 days before (retention-warning-cron:195). The purge runs daily at 03:17 UTC (024:452).

**(a-support) What a downgraded (premium→free) account keeps, and for how long:**
- **On downgrade:** handle_premium_downgrade flips EVERY settlement and EVERY saved_maps row to inactive_plan, with an expiry of now()+3 months.
- **Readable for 3 months:** inactive rows stay READABLE ("Users read own settlements"/"…maps" select policies 001:69 / 002:28 are not access_state-gated) but cannot be written (024/059 policies; the 102 RPCs).
- **Campaigns and realm/world state (saved_maps) are purged at 3 months.** No free reactivation path exists for them, and persist_world_pulse_advance refuses them.
- **Settlements can be kept forever.** The free user can reactivate up to 3 via reactivate_free_settlement; that clears retention, so those rows are kept INDEFINITELY and are writable. They keep whatever settlement.data carried (neighbourNetwork, interSettlementRelationships, realm/pulse stamps).
- **Paid-export settlements are also kept forever.** Any settlement with an active dossier entitlement is never purged (165), though it stays read-only.

So YES: a free account can permanently hold settlement-embedded simulator data. A never-premium free account can also write neighbour data server-side (C-9 and plain upserts carry no tier check).

**(d) Surveyor server side:**
- **Definition:** has_surveyor_entitlement (201:82-102, live; 139:66 superseded).
- **What it admits:** staff, or an active surveyor_entitlements row.
- **How a row is minted:** only the 'surveyor' Stripe product (stripe-webhook:3011) or an admin grant (admin-actions:1859).
- **A bare Cartographer does NOT pass.** Premium never mints a row.
- **Gated by surveyor:** all nine AI-control edge functions (analyst, construct-realm, construct-settlement, custom-content, interpret-session, interview, parley, surveyor-autonomy, surveyor-byok).
- **Gated by premium:** NO AI function.
- **Gated by neither:** generate-narrative and generate-chronicle are gated by CREDITS only (plus the one free narrative), with no tier and no Surveyor check.

**(5) Gallery import:**
- **120 is NOT the live text.** 131:366-405 re-created import_gallery_dossier verbatim with search_path `public, pg_temp`, keeping the 120 predicate `current_user_has_premium_access()` at :403. Behaviour is identical: free and anon get 0 rows; premium, founder and staff get the clone.
- **The map import (072) has no such predicate.** It relies on the saved_maps premium INSERT policy.

## §3 The violations, their re-keys and the lane each needs

| # | Violation | Rows (file:line) | What the non-premium owner loses, and on which data | Re-key | Lane | Evidence |
|---|---|---|---|---|---|---|
| **V1** | **DM truth gated on tier** (the chair's ruling (a)) | `RumorsTab.jsx:137` · `WarTab.jsx:591` · `useLaunchTones.js:30` (moves with WarTab) · `RelationshipsTab.jsx:44` + `OutputContainer.jsx:280,760` (drop the `viewerIsPremium` prop) · `UnaffiliatesSection.jsx:106` (covert half only; split it from the settle/kill/pardon verbs, which are world writes) · `HousesBlock.jsx:33` and `WatchPanel.jsx:51` (latent: **not mounted**) · `src/pdf/lib/liveWorld.js:182` (belief truth behind the PDF's tier term) | Rumour truth, provenance and divergence; the unit's true position and the belief gap; belief maps; neighbour-mirror basis and date; covert patrons, watchers and wanderer leashes. **Every one reads `campaign.worldState`, which only the simulator writes. None reads an at-birth field.** At birth, free and premium print identically on all twelve towns (CONFIRMED, §0.5). A free account holds such data only as a **downgraded Cartographer**: `handle_premium_downgrade` (`024:338-373`) marks campaigns `inactive_plan`, they stay owner-readable and load for every non-anon account (`App.jsx:341`), and they are purged at downgrade + 3 months (`165`; the daily schedule at `024:452`). In that window the dossier shows the player projection and refuses the truth beside it. Settlements a free owner reactivates (`023:108-160`) are kept indefinitely, but the truth reads key on the **campaign**, not the settlement, so after the purge they have no data. | `includeGroundTruth = !playerView && !publicDossier`. No extra world-state term is needed: each read already requires its own data (`campaigns.find` on the viewer's own store, `hasBeliefMaps`, `counterIntelActive`, `canonizedAt`). `PowerTab.jsx:252` (`!playerView`) is the landed precedent. If an owner-session proof is wanted, `viewerSeesDmSecrets` (`src/domain/display/viewerSecrets.js`) is already tier-free. Every domain/display function takes the flag as a parameter (default false, no tier inside), so **only the callers change**. **One ruling is owed with it:** do retained `inactive_plan` campaigns count as "world state present"? The dossier shows their player half today; the map filters them out. The sub-reader recommends yes. | One build lane (dossier tabs + PDF caller). It reds the tier-pinned tests (beliefDivergenceBand, npcTrailSection, relationshipChronicleSection, treatyDossierTab, warFaithSurfacing, dossierDepthTabs, counterIntelSurfacesIn3) and shrinks the `content-visibility` rows of `tests/lint/premiumGateSingleSource.test.js`, which should stay a ratchet. **Size: small. The only reachable change is the 3-month window of a downgraded realm.** | At-birth parity CONFIRMED (render). Window and data PLAUSIBLE (read). |
| V1-map | Map panels' inner `premium ∨ elevated` | `BeliefDivergenceBand.jsx:101` · `PerspectiveStandings.jsx:61` · `RelationshipChronicleSection.jsx:150` · `NpcTrailSection.jsx:97` · `TreatyPanel.jsx:176` | Nothing reachable: `useWorldMapCampaignModel` hands a free viewer no campaigns, so the panels never mount for free. Classed DERIVED from (6). | `includeGroundTruth = true` (the outer world-map gate carries the law). Hygiene only, no behaviour change. | Same lane as V1 | PLAUSIBLE |
| **V2** | **Faith tab presence inverted** | `OutputContainer.jsx:535` (`hasFaithTab = embed ∨ (¬viewerIsPremium ∧ ¬publicDossier)`); `FaithSection.jsx:354-363` HIDDEN branch | A **premium** owner with no deity gets no Faith tab, so never sees the engine-made faith line (church, senior cleric, religious faction, tithe, observance) that the free owner sees. The render printed that line identically for both viewers inside the tab (CONFIRMED). The presence gate hides it from premium (read). `SessionMode.jsx:238-251` already fixed the same bug with `hasChurch`. | `hasFaithTab = !!deityEmbed \|\| !publicDossier` (or `faithHasChurchEvidence`, matching SessionMode). FaithSection's HIDDEN mode then renders the faith line without the upsell. The upsell stays free-only, since it sells (2) and (3). | Small build lane (two files and its pins) | The line's parity CONFIRMED; the presence gate PLAUSIBLE |
| **V3** | **Version history locked for free** | `VersionsTab.jsx:256,341` (`isPaid = tier === 'premium'` → LockedDestination) | Free gets no timeline, manual snapshot or compare, though the store records snapshots tier-blind (`settlementSlice.js:306`). | Show the timeline, compare and manual snapshot to all. **Revert is arguably post-generation editing (1)**, so the chair rules whether revert stays premium. | Small build lane | PLAUSIBLE |
| **V4** | **AI chronicle retention cap** (missing from every ladder) | `src/lib/chronicle.js:23-27` `CHRONICLE_LIMITS {free 5, premium ∞}`, read at `src/store/aiChronicleAppend.js:42-44` | Past the fifth narration on a save, free entries rotate to `summary` and their `aiSettlement`/`aiDailyLife` prose is nulled. These are the user's own credit-paid narrations, so a revert to them loses the prose. | One limit for every tier (Infinity, or an owner-chosen N), no tier read. Also the copy `en.js:1492` if "chronicle" means this. | Small build lane | **CONFIRMED** (probe: free full×5 + summary×3; premium full×8) |
| **V5** | **Legacy latent-pantheon activation on tier** | `src/store/settlementLifecycleHelpers.js:200-208` (`activateFaithIfEntitled`; callers `settlementGenerateAction.js:687`, `settlementSlice.js:1455`) | Opening a LEGACY save copies its engine-made `config.latentPantheon` into live deity embeds for premium only. These are premade gods, not custom content. Legacy saves only (the pool retired at T4). | Either activate for every owner, or rule the living pantheon simulator-side (2), which makes it DERIVED. A chair ruling, not a re-key. | Chair rules; tiny if it lands | PLAUSIBLE |
| **V6** | **Copy that sells parity as premium** | `en.js:582`, `:668`, `:1483`, `:1487` ("cloud sync"; free saves are server rows, migrations 014/024/033) · `en.js:1468` (dead copy, no trigger) · `en.js:1456` first_canonize ("canon snapshots, timeline export variants"; canonize is ungated, and variants are canon-gated at `ExportSheet.jsx:41`) · `en.js:1464` ("timeline-packet variant") · `entitlementLadder.js:99` "saves" row (held on (c)) | A visitor told that parity features are paid. | Strike "cloud sync" and the variant and snapshot clauses. The ladder row follows (c). | Copy lane (owner's style law) | PLAUSIBLE |
| **U1** | **The world map is under-gated** | `WorldMap.jsx:820` (`handleExportMap = authTier !== 'anon'`); `map/WorldMapToolbar.jsx:374,391` | On desktop a free account gets the world-map canvas, mode switch, templates, regenerate, layers, image import and **map image export**. Only the campaign group is gated. The region map and the world map are one surface (WorldMap.jsx). | Gate the world-map surface on (6) and keep the campaign group on (2). **This takes something from free users, so the owner rules it** (paid-surface behaviour). | Owner → build lane | PLAUSIBLE |
| **R1** | **Drift: the Founder and the Surveyor** | client `surveyorGate.js:16-22` admits `isFounder`; server `201:82-102` admits staff or an active `surveyor_entitlements` row only | A Founder sees the Surveyor door and the AI & keys tab, then gets a 403 from every AI-control function. | Make both sides agree: drop `isFounder` from the client, or grant Founders a row. The owner rules which, since it is a paid surface. | Owner → tiny lane | Read both sources myself: PLAUSIBLE (not executed) |
| **R2** | **Drift: `isElevated` outside the staff kill switch** | many `tier === 'premium' \|\| isElevated()` spellings (A and B rows) | `isElevated` is not governed by `STAFF_UNLOCK`, unlike the `can*` selectors, so turning staff unlock off leaves staff elevated on those surfaces. Not a parity violation. Recorded so the V1 re-key removes the class instead of copying it. | V1's re-key deletes most of them. | Folds into V1 | PLAUSIBLE |

**STALE copy (15 claims, promising or omitting the wrong thing; not parity violations):**
- `en.js:221-223`: the live auth modal promises free accounts the Neighbour System (that is (2)).
- `landing.js:74`, `en.js:705`, `HowToUse.jsx:241,244`: anon "up to a Town", but anon gets Town only since 2026-10-30.
- `HowToUse.jsx:252,306,312,365,366,394,420`: export, campaigns, Edit Names, the world map, Link Neighbour and custom content listed with no premium marking.
- `landing.js:110,120`: "keeps every draft".
- `send-email/index.ts:64-66` and `src/lib/emailTemplates.js:50`: the welcome email sells the abolished Founder Lifetime seat beside the save cap.

**Server gaps (client-only gates the server never checks; consistent with the law, but enforced on one side only):** neighbour back-links (`merge_neighbour_backlink`, `102:220`), unlimited export, and the anon/free size ranges (`engine-generate` has no size cap). `generate-narrative` and `generate-chronicle` carry no tier gate (credits only), which is at parity.

## §4 For the owner's two answers

### (c) The free save cap of three: every surface and byte
Both execution paths are spelled out. The cap is not among the seven, but law (4) presumes a save. `en.js:1640` shows the cap blocking the $2.99 durable right at a free account's fourth settlement. That is the measured interaction.
- **Client enforcement:** `src/store/authSlice.js:84` `free.maxSaves: 3`. Its readers follow automatically: `authSlice.js:810,901-904`; `SettlementsPanel.jsx:65,783`; `AccountPage.jsx:83,435,483`; `AccountSubscriptionSection.jsx:137,145,153`; `AccountDataPrivacySection.jsx:74,342-343`; `galleryImportSettlement.js:40`; `galleryImportMap.js:252-258`; `instantWorldBody.js:182-183`; `accountImportBody.js:575-576`.
- **Hard-coded 3 in client logic:** `SettlementsPanel.jsx:283` `Math.min(maxSaves||0, 3)` (reactivation); `saveMoments.js:42` (`third_save`).
- **Server (live):** `supabase/migrations/033_security_review_hardening.sql:117-137` `enforce_save_limit` (`else 3`; it supersedes 014 and 024). This is pinned by `tests/security/enforceSaveLimit.pglite.test.js`, which ran green here (CONFIRMED). The trigger `settlements_enforce_save_limit` is bound at `014:94-98`. Also `023:108-160` `reactivate_free_settlement` (`active_count >= 3`). Removing the cap needs a new migration for each, and a ruling on `handle_premium_downgrade` (`024:~340-370`): do settlements stay active on downgrade, while campaigns and maps stay inactive under (2) and (6)? The 165 purge and the 166/178/179 crons then apply only to premium-only artifacts.
- **Display sources:** `src/config/pricing.js:248` `TIERS.wanderer.saveLimit: 3`; `tierFacts.js:216,237` (`FREE_SAVE_LIMIT`); `tierFacts.js:167` `signInUnlocksClause`, which would print "save up to Infinity drafts" and so needs its own branch; `entitlementLadder.js:99` "saves" row.
- **Display renderers:** `SaveQuotaMeter.jsx:26,75` (retire it); `LandingBelowFold.jsx:423` + `landing.js:277` `{freeSaves}`; `PricingBands.jsx:349` + `pricingPage.js:170` FAQ; `SingleDossierSuccessPage.jsx:33,416`; `HomeHero.jsx:453`.
- **Literal three:** `en.js:562,654,821,861,1170,1171,1321,1472,1487,1542,1640`; `src/lib/emailTemplates.js:50`; `supabase/functions/send-email/index.ts:64`. No other edge function carries it.
- **Tests that pin 3:**
  - `tests/config/pricing.test.js:335`
  - `tests/config/tierFacts.contract.test.js:139`
  - `tests/store/staffUnlockEntitlements.test.js:90,210,287`
  - `tests/security/enforceSaveLimit.pglite.test.js:11,80-86`
  - `tests/store/saveMoments.test.js:60-116`
  - `tests/components/saveQuotaMeter.test.jsx`
  - `tests/copy/signInUnlocks.test.js`
  - `tests/copy/landingClaimsParity.test.js`
  - `tests/config/entitlementLadder.enforcement.test.js`
  - `tests/store/quotaGates.test.js`
  - `tests/store/phantomQuota.test.js`
  - `e2e/flow-c-save-journey.spec.js`
  - the fixture stubs at `tests/components/launchLock.account.test.jsx:92` and `tests/ui/accountSubscriptionSectionCta.test.jsx:38`
- **Do not confuse:** `entitlementLadder.js:243` `RETENTION_MONTHS = 3` is the retention window in months, not the cap.
- **Keep-the-cap path:** fix only the stale "keeps every draft" copy (`landing.js:110,120`), and record the cap as an owner-ruled eighth premium item.

### (d) The Surveyor's entitlement
- **What it admits:**
  - **Client** `isSurveyorTier(auth)` (`src/components/surveyor/surveyorGate.js:16-22`) admits `hasSurveyorEntitlement === true` ∨ `isFounder` ∨ role `admin` ∨ `developer`.
  - **Server** `has_surveyor_entitlement()` (`201:82-102`, live; it replaced `139:66`) admits privileged staff ∨ an active `surveyor_entitlements` row. Only the Surveyor Stripe product or an admin grant creates that row.
  - All nine AI-control edge functions check the Surveyor gate and none checks premium: analyst, construct-realm, construct-settlement, custom-content, interpret-session, interview, parley, surveyor-autonomy, surveyor-byok.
- **A bare Cartographer does not hold it**, on either side. Free and premium accounts without the entitlement see no Surveyor door and no AI & keys tab, and no tease. Founders: see R1.
- **What the copy promises:**
  - Landing (`landing.js:279`, logged out): an "AI · early access" workshop (analyst, prose briefs, session interpretation that "proposes edits for you to approve"), BYOK, set outside the tier cards.
  - Pricing (`pricingPage.js:36-38,159`; ladder row `entitlementLadder.js` `surveyor-stages`, "per task" on both columns): "priced per task… No subscription required… on either plan".
  - `en.js:766-773`: door labels only.
  - HowToUse: nothing.
  - No surface says that access is by grant.
- **Two tensions for the owner:** the dark `SURVEYOR_PLAN` at $14.99/mo (`pricing.js:348`) contradicts "no subscription". And "proposes edits for you to approve" is applying an edit, which is (1): whether a free, Surveyor-entitled owner may approve is unmeasured.

## §5 Anon: where it differs from free beyond saves and exports
Listed for the owner, not judged (the law speaks of free).
1. **One size.** `TIER_GATE.anon` minTier = maxTier = `town` (`authSlice.js:83`); `ANON_SIZES` (`tierFacts.js`); forced at `settlementGenerateAction.js:138,320`. A curated fork passes the floor only (§934.34).
2. **Pre-generation options locked.** `preGenOptions: false`; `GenerateWizard.jsx:339` hides the Basic/Advanced picker; refusal `PRE_GEN_LOCKED`.
3. **Daily generation cap.** 1 full generation + 2 rerolls (`src/lib/anonGenCounter.js:38-43`, enforced at `settlementGenerateAction.js:407-416`). Free has no cap.
4. **Draft lifetime.** An unsaved anon draft expires after 24 h (`persistMerge.js:38-57`).
5. **No narration and no welcome credit.** `canNarrate` requires non-anon and a saveId (`SettlementDossierHero.jsx:54`); `WelcomeCreditCard.jsx:81`.
6. **Export ladder.** Anon gets the one-shot buy only, with no durable right, because there is no save (`BuyThisDossier.jsx:58,204`).
7. **Moot under the seven:** the campaign runtime never loads (`campaignRuntimeView.js:28,35`), and world-map image export is hidden (`WorldMap.jsx:823`).
8. **UI-only differences:** `GenerateWizard.jsx:272`, `HomeHero.jsx:149`, `SaveQuotaMeter.jsx:47`, `SampleDashboard.jsx:27`, `RealmLockedGate.jsx:82`, `CustomContent.jsx:232`, `PostGenCoach.jsx:220`. Anon-only surfaces: `RegionWakeReplay.jsx:73`, `HomeSampleDossier.jsx:60,71`. About 110 other `'anon'` hits are ownerId storage keys, not tier gates.
9. **The server does not enforce the anon size range** (`engine-generate` has no size cap). That is a client-only gate.

## §6 CONFIRMED against PLAUSIBLE

**CONFIRMED (run here):**
- The soak (`soak-review.mjs --count 12 --workers 2`) exited 0.
- The four-viewer render of the twelve towns showed **free ≡ premium on every tab but Faith**, which includes the five DM-truth surfaces at birth. This is the measured base of V1's sizing.
- In the same render, the Faith tab prints the engine-made faith line identically for free and premium, with free alone getting the heading and the upsell (V2's data).
- The `CHRONICLE_LIMITS` probe (V4).
- `premiumGateSingleSource`, `tierFacts.contract`, `enforceSaveLimit.pglite` and `entitlementLadder.enforcement` (57 tests) ran green: the save cap is enforced in SQL and the facts agree with `TIER_GATE`.

**PLAUSIBLE (read only):** every other row. That includes:
- the 3-month window and the reachability of retained campaigns;
- OutputContainer's Faith presence expression;
- VersionsTab, the latent pantheon, the world-map under-gate and the Founder/Surveyor split (both sources read by this seat; not executed against a live auth);
- every SQL "live definition" trace;
- the copy census.

**Not rendered:**
- world-state DM truth with a real campaign. The harness carries no campaign, so V1's *window* behaviour is read, not printed.
- RelationshipsTab. The harness's props print its empty shell ("Generate a settlement to see relationship data.") for every viewer, so its parity at birth rests on reading.
