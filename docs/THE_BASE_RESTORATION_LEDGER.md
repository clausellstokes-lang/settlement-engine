# THE BASE RESTORATION LEDGER — every file merge 0168e287 decided against master

Mechanically generated 2026-07-18 from `git diff --name-status d024286e 0168e287 -- src/`,
commissioned by the owner's caution: "it might not have just been the create page that
diverged from base." CONFIRMED: 469 modified + 13 deleted (+245 program-new additions,
which carry no restoration duty). `●` = changed again post-merge (152 files; waves built
on top — higher-care restoration).

SCOPE LAW: the base ruling governs UI ORGANIZATION. Engine-side (domain/generators/lib/
store/kernel) modifications were the merge's documented, owner-adjudicated core
(MASTER_MERGE_PLAN §4/§5 dispositions + the 8 reconciliation rulings) and are marked
MERGE-PLAN ADJUDICATED — not re-litigated; ROUND 3 spot-audits. The 13 DELETIONS get
individual verdicts regardless of layer (deletion is the highest-severity outcome).

PHASE-D GATE: the deep wave cannot close while any row reads PENDING. Legal
dispositions: RESTORED @ <commit> · MATCHES-MASTER (verified) · PROGRAM-SIDE-RULED
(reason named) · SUPERSEDED (by a named program system, verified) · DEFERRED (reason +
owner visibility). Owning slices update rows in the same commit as the work.
Per-file recipe: `git show d024286e:<path>` · `git diff 0168e287^2 0168e287 -- <path>`.

## C1/C4 (App float) — 1 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| D | src/components/PostGenCoach.jsx |  | RESTORED @ 67586c86 (revived as HOST of the wizard-postgen whisper — registry component swap; WizardNextSteps deleted → LEGACY; one-whisper budget pin intact; the guidance-walker collision resolved exactly per the ledgered recipe) |

## C3/C4 (library rail) — 2 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| D | src/components/primitives/ActionRail.jsx |  | RESTORED @ eba0be75 + materials @ 41757691/a8d9fff0 (flat, tokenized) — guidance-layer deletion superseded by the base ruling (recorded) |
| D | src/components/settlement/NextActionRail.jsx |  | RESTORED @ eba0be75 — from master; only adaptation: retired strings.js COPY map migrated to copy/en.js t() templates |

## ⛔ADJUDICATE (deleted UI/copy) — 2 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| D | src/components/settlement/LockToggle.jsx |  | PROGRAM-SIDE-RULED (owner dead-code @ 11fc55d0) |
| D | src/copy/strings.js |  | SUPERSEDED by copy/en.js t()/tx() |

## ⛔ADJUDICATE (deleted domain) — 8 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| D | src/domain/devAnomalies.js |  | PROGRAM-SIDE-RULED (owner dead-code @ 11fc55d0) |
| D | src/domain/devDebug.js |  | PROGRAM-SIDE-RULED (owner dead-code @ 11fc55d0) |
| D | src/domain/distributionDashboard.js |  | PROGRAM-SIDE-RULED (owner dead-code @ 11fc55d0) |
| D | src/domain/genreProfile.js |  | PROGRAM-SIDE-RULED (owner dead-code @ 11fc55d0) |
| D | src/domain/pipelineRail.js |  | PROGRAM-SIDE-RULED (owner dead-code @ 11fc55d0) |
| D | src/domain/provenance.js |  | SUPERSEDED by provenanceKernel/provenanceModel |
| D | src/domain/region/migrations.js |  | PROGRAM-SIDE-RULED (owner dead-code @ 11fc55d0) |
| D | src/generators/rngContext.js |  | RELOCATED to kernel/rngContext.js |

## C16 + C1 (PostGenCoach mount) — 1 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/App.jsx | ● | PARTIAL @ 67586c86 (PostGenCoach app-level lazy mount restored, master's placement) — C16 shell/nav treatment remains; ⚠ file sits EXACTLY at its 732 max-lines ceiling |

## assign at slice — 97 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/AppViews.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/AccountPage.jsx | ● | OWNER-FLAG (census §2 — backend-gated) |
| M | src/components/AdminPanel.jsx |  | RESTORATION-OWED (census §1 #2 — 3-tier hierarchy flattened; user table stays removed; sweep scheduled) |
| M | src/components/AuthModal.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/BuyThisDossier.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/CampaignSyncBanner.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/ChroniclePanel.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/CompendiumPanel.jsx | ● | RESTORATION-OWED (census §1 #9 — Page identity, ARIA tabs dropped; sweep scheduled) |
| M | src/components/ConfigurationPanel.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/FeatureErrorBoundary.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/GalleryPage.jsx | ● | RESTORATION-OWED (census §1 #10 — shared header/frame/Segmented dropped; sweep scheduled) |
| M | src/components/MapOverlay.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/PrivacySettings.jsx |  | RESTORATION-OWED (census §1 #4 — bare-prop → card-in-card; consent opt-out = owner; sweep scheduled) |
| M | src/components/ProseParagraph.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/PublicDossierView.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/PurchaseModal.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/ShareToGallery.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/SingleDossierSuccessPage.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/TableView.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/TradeDynamicsPanel.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/WorldMap.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/account/AccountDataPrivacySection.jsx |  | RESTORATION-OWED (census §1 #5 — bare-prop regression; visibility defaults backend-gated; sweep scheduled) |
| M | src/components/account/AccountNav.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/account/AccountRecoveryQuestionsSection.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/account/AccountSecuritySection.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/account/AccountSubscriptionSection.jsx |  | RESTORATION-OWED (census §1 #6 — free-tier upgrade CTA lost; sweep scheduled) |
| M | src/components/account/AccountSupportSection.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/account/AccountTickets.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/account/ReferralRedeemBlocks.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/admin/AdminAnalyticsPanel.jsx |  | RESTORATION-OWED (census §1 #3 — card-in-card; hand-rolled tablist; sweep scheduled) |
| M | src/components/admin/AdminTrendsPanel.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/admin/SupportQueuePanel.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/auth/AuthPanel.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/auth/authUI.jsx |  | RESTORATION-OWED (census §1 #7 — wordmark link, Page dropped, a11y; sweep scheduled) |
| M | src/components/compendium/CatalogTabs.jsx | ● | RESTORATION-OWED (census §1 #11 — SectionHeading hierarchy, guards, empty-states; sweep scheduled) |
| M | src/components/compendium/ContentPackBar.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/compendium/CustomContent.jsx |  | RESTORATION-OWED (census §1 #12 — HEAVIEST: cloud-sync, two-lane IA; sweep scheduled) |
| M | src/components/compendium/DeityEffectPreview.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/compendium/HelpPopover.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/compendium/PantheonActivationStrip.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/gallery/GalleryDetail.jsx | ● | RESTORATION-OWED (census §1 #13 — DesktopOnlyGate + forge-CTA dropped; sweep scheduled) |
| M | src/components/gallery/GalleryList.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/gallery/GallerySidebar.jsx |  | RESTORATION-OWED (census §1 #14 — mobile BottomSheet, FilterChips a11y; sweep scheduled) |
| M | src/components/gallery/GalleryTopbar.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/gallery/MapShareEditor.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/gallery/galleryMapsUtils.js | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/gallery/galleryUtils.js | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/AnnotateToolbar.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/AssignDeityFromMap.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/AutoSaveChip.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/ChronicleScrollback.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/IconButton.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/LiveWarStatus.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/MapLegend.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/PlacementDetailCard.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/PlacementsLayer.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/QuickInspector.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/RealmDashboard.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/RealmInspector.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/RelationshipEdges.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/SettlementPalette.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/SimulationRulesDialog.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/WizardNewsPanel.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/WorldMapOverlays.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/WorldMapStage.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/WorldMapToolbar.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/WorldPulseData.js |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/WorldPulsePanel.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/map/relationshipEdgeStyle.js |  | RESTORATION-OWED (census §1 #8 — criminal_network type dropped; sweep scheduled) |
| M | src/components/new/SupplyChainsPanel.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/new/dailyLifeLogic.js |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/new/npcComponents.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/new/serviceComponents.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/components/purchase/ReferralIntentField.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |
| M | src/data/constants.js | ● | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/economicData.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/entityTags.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/geographyData.js | ● | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/historyData.js | ● | RESTORATION-OWED (census §1 #22 — lastingEffects absent from templates; sweep scheduled) |
| M | src/data/institutionServices.js | ● | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/institutionalCatalog.js | ● | RESTORATION-OWED (census §1 #23 — priorityCategory inconsistent, guard test absent; sweep scheduled) |
| M | src/data/namingData.js | ● | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/narrativeData.js | ● | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/npcData.js | ● | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/powerData.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/resourceData.js | ● | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/sampleDossier.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/sampleDossier.json |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/sampleSettlements.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/servicesData.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/spatialData.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/stressTypes.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/stressTypesMeta.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/supplyChainData.js |  | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/data/tradeGoodsData.js | ● | PROGRAM-SIDE-RULED (data content relocation, census §4) |
| M | src/index.css |  | MATCHES-MASTER (restyle-only, census §4) |
| M | src/main.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 assign at slice) |

## C1 — 8 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/components/GenerateWizard.jsx | ● | RESTORED @ C1r (verify at fold) |
| M | src/components/HomeHero.jsx |  | RESTORED @ C1r (verify at fold) |
| M | src/components/generate/ChangeModeBar.jsx |  | RESTORED @ C1r (verify at fold) |
| M | src/components/generate/ExportDraftButton.jsx |  | RESTORED @ C1r (verify at fold) |
| M | src/components/generate/PlaceInRegionCard.jsx |  | RESTORED @ C1r (verify at fold) |
| M | src/components/generate/SaveToLibraryButton.jsx | ● | RESTORED @ C1r (verify at fold) |
| M | src/components/generate/WizardEmptyState.jsx | ● | RESTORED @ C1r (verify at fold) |
| M | src/components/generate/WizardOutputToolbar.jsx |  | RESTORED @ C1r (verify at fold) |

## C2/C6-C12 — 3 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/components/HomeLanding.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C2/C6-C12) |
| M | src/components/HowToUse.jsx | ● | RESTORATION-OWED (census §1 #1 — 11 headings collapsed to 1; sweep scheduled) |
| M | src/components/home/HomeSampleDossier.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C2/C6-C12) |

## C4 — 23 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/components/OutputContainer.jsx | ● | RESTORED @ 50f2ba14 + 2abed50e (TAB_GROUPS world = NPC-first per P8; header suppression at panel A; earlier PARTIAL @ eba0be75 suppressNarrativeCta retained) — craft step-3 still owed at C4 |
| M | src/components/dossier/DossierHeaderRow.jsx | ● | RESTORED @ 507662c0 (header reroll REMOVED → tab bodies; HEADER_FACT #D8C8A8 high-contrast per P7; allowRename REVIVED — caller wiring = C3 scope) |
| M | src/components/dossier/DossierNarrativeButtons.jsx |  | SPEC READY (map S1) |
| M | src/components/dossier/DossierTabStrip.jsx |  | SPEC READY (map S1) |
| M | src/components/dossier/FirstDossierCallouts.jsx |  | SPEC READY (map S1) |
| M | src/components/dossier/SimulationDrawer.jsx | ● | SPEC READY (map S1) |
| M | src/components/new/SummaryTabV2.jsx | ● | SPEC READY (map S1) |
| M | src/components/new/tabConstants.js |  | SPEC READY (map S1) |
| M | src/components/new/tabs/DailyLifeTab.jsx |  | SPEC READY (map S1) |
| M | src/components/new/tabs/DefenseTab.jsx | ● | SPEC READY (map S1) |
| M | src/components/new/tabs/EconomicsTab.jsx | ● | SPEC READY (map S1) |
| M | src/components/new/tabs/HistoryTab.jsx |  | SPEC READY (map S1) |
| M | src/components/new/tabs/MagicTab.jsx |  | SPEC READY (map S1) |
| M | src/components/new/tabs/NPCsTab.jsx |  | SPEC READY (map S1) |
| M | src/components/new/tabs/OverviewTab.jsx |  | RESTORED @ 2abed50e (actionable "Full relationship web →" onNavigateTab jump revived; Spatial Layout own top-level Section) — craft step-3 still owed at C4 |
| M | src/components/new/tabs/PowerTab.jsx | ● | SPEC READY (map S1) |
| M | src/components/new/tabs/RelationshipsTab.jsx |  | SPEC READY (map S1) |
| M | src/components/new/tabs/ResourcesTab.jsx |  | SPEC READY (map S1) |
| M | src/components/new/tabs/ServicesTab.jsx |  | SPEC READY (map S1) |
| M | src/components/new/tabs/SubstrateTab.jsx |  | SPEC READY (map S1) |
| M | src/components/new/tabs/ViabilityTab.jsx |  | SPEC READY (map S1) |
| M | src/components/new/tabs/WarFaithTab.jsx |  | SPEC READY (map S1) |
| M | src/pdf/sections/Overview.jsx | ● | SPEC READY (map S1) |

## C6 — 3 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/components/PricingPage.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C6) |
| M | src/components/pricing/FounderTile.jsx |  | RESTORATION-OWED (census §1 #15 — checkout retry + scarcity meter dropped; sweep scheduled) |
| M | src/components/pricing/PricingMomentCard.jsx |  | RESTORATION-OWED (census §1 #16 — anon sign-in buy-wall bug; sweep scheduled) |

## C3/C4 — 26 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/components/SettlementDetail.jsx | ● | RESTORED @ eba0be75 (two-column dossierHero + sticky rail) · PROGRAM-SIDE-RULED: hero extracted to SettlementDossierHero.jsx (max-lines ratchet; extraction doctrine) |
| M | src/components/primitives/LifecycleSpine.jsx |  | VERIFIED @ S2r — renders in the lifecycle bar; no org divergence (agent census) |
| M | src/components/primitives/StateBadge.jsx |  | VERIFIED @ S2r — no org divergence (agent census) |
| M | src/components/settlement/AIInlineCard.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/CoherencePanel.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/EventComposer.jsx | ● | SPEC READY (map S2) |
| M | src/components/settlement/ExportSheet.jsx | ● | VERIFIED @ S2r — rail onExport reuses existing open state; no org divergence |
| M | src/components/settlement/PendingIntentions.jsx | ● | SPEC READY (map S2) |
| M | src/components/settlement/PhaseBadge.jsx |  | VERIFIED @ S2r — no org divergence (agent census) |
| M | src/components/settlement/ProvenanceBlock.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/SuccessorPrompt.jsx | ● | SPEC READY (map S2) |
| M | src/components/settlement/Timeline.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/VersionsTab.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/AddNpcTraitFields.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/BatchCart.jsx | ● | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/EventComposerConstants.js | ● | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/EventComposerCorruptionFields.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/EventComposerDeityField.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/EventComposerLinkNeighbourField.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/EventComposerRelationshipExtras.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/EventComposerSecondaryFields.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/EventComposerTargetField.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/EventComposerTierField.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/PreviewPanel.jsx |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/buildEvent.js |  | SPEC READY (map S2) |
| M | src/components/settlement/eventComposer/helpers.js | ● | SPEC READY (map S2) |

## C3 — 10 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/components/SettlementsPanel.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C3) |
| M | src/components/library/LibraryToolbar.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C3) |
| M | src/components/settlements/BulkActionBar.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C3) |
| M | src/components/settlements/CampaignFolder.jsx |  | RESTORATION-OWED (census §1 #17 — mobile reflow + member cap; sweep scheduled) |
| M | src/components/settlements/HealthPip.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C3) |
| M | src/components/settlements/RealmStrip.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C3) |
| M | src/components/settlements/SampleDashboard.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C3) |
| M | src/components/settlements/SaveQuotaMeter.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C3) |
| M | src/components/settlements/SettlementCard.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C3) |
| M | src/components/settlements/advanceTimeTarget.js |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C3) |

## C16 — 12 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/components/new/design.js |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |
| M | src/components/primitives/BottomSheet.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |
| M | src/components/primitives/Card.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |
| D | src/components/primitives/CausalNarrativeTable.jsx | ● | PROGRAM-SIDE-RULED (orphan — not mounted in master either, census §3) |
| M | src/components/primitives/DesktopOnlyGate.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |
| M | src/components/primitives/Disclosure.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |
| M | src/components/primitives/IconButton.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |
| M | src/components/primitives/LockedDestination.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |
| M | src/components/primitives/MobileTabStrip.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |
| M | src/components/primitives/Page.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |
| M | src/design/tokens.js | ● | MATCHES-MASTER (restyle-only, census §4) |
| M | src/pdf/primitives/ProseText.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C16) |

## C1/C16 — 1 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/components/theme.js |  | PARTIAL @ C1r (LANDING_MAX); rest at C16 |

## engine (merge-plan scope) — 271 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/config/pageBackgrounds.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/config/pricing.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/activeConditions.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/aiGrounding.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/aiOverlayVerifier.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/campaign/canon.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/canonStatus.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/canonicalAccessors.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/capacityModel.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/causalState.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/causalViews.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/clock.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/coherence/checkDraftEdit.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/compendium/catalogData.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/compendium/searchIndex.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/conditionPromotion.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/contradictions.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/corruption.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/counterfactual.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/crisisLifecycle.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/customCategories.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/customContent.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/customContentMigrations.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/customContentSchema.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/dailyLife.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/defenseLedger.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/armyStrength.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/chronicleTimeline.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/defenseDisplay.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/deityEffects.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/dossierViewModel.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/mobilizationStatus.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/occupationStatus.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/placeholders.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/publicSafe.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/servicesDisplay.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/tradePressure.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/visibilityAudit.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/warResolve.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/display/worldSnapshotPublic.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/districtProfile.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/dossier/chronicleFeed.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/dossier/entityLinks.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/dossier/plotHooks.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/entities/npcs.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/entities/propagate.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/entities/status.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/entities/successors.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/applyEvent.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/batch.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/drainQueuedEvents.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/eventPipeline.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/factionResponses.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/mutate.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/mutateEntities.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/mutateHelpers.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/mutateWorld.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/partyEventLinkage.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/previewEvent.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/registry.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/events/undoEvent.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/explanation.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/factionArchetypes.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/factionProfile.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/factionRelationshipUpdate.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/factions/factionCatalog.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/fieldManifest.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/foodLedger.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/governanceLedger.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/healingLedger.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/historyBeats.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/hookEscalation.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/inferSupplyChains.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/institutionClassify.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/institutions/institutionCatalog.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/magicFilter.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/magicLedger.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/magicProfile.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/mapProfile.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/normalizeSettlement.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/npcProfile.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/pendingEdits.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/qualitativeBands.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/regenerationDelta.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/regenerationMode.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/region/contestMath.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/region/deriveRegionalState.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/region/discoverDependencyCandidates.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/region/goodsCatalog.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/region/graph.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/region/index.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/region/propagation.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/region/tradeLinks.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/region/wizardNews.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/regionalGraph.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/relationships/canonicalRelationship.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/relationships/neighbourBackLink.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/roles/roleCatalog.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/rulingPower.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/settlement.schema.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/settlementMigrations.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/settlementReconciliation.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/simulationSpine.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/state/bands.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/state/compareSystemState.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/state/deriveSystemState.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/stressorPicker.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/summary/tonightAtTheTable.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/supplyChainState.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/threatProfile.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/timeProgression.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/trace.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/tradeRouteSemantics.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/types.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/userEdits.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/validation/consistency.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/advanceInterval.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/applyWorldPulse.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/archetypeCatalog.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/attrition.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/blockadeTransport.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/candidateEvents.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/changeAuthorityPolicy.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/coup.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/decisionTier.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/deploymentReturn.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/disposition.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/factionCapture.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/factionCompetition.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/foodStockpile.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/index.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/institutionLifecycle.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/mobilization.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/mobilizationReactions.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/npcAgency.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/occupation.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/pantheon.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/partyImpact.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/populationDynamics.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/pressureModel.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/pulseHelpers.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/pulseKernel.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/realmEvents.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/relationshipRuleHelpers.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/relationshipRulesAdversarial.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/relationshipRulesCore.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/religionLegitimacy.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/religionState.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/religiousContest.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/resourceTaxonomy.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/settlementStrategy.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/simulationRules.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/stressorDynamics.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/stressorGates.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/stressorSeverity.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/stressors.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/tierResourceDynamics.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/tradeSalience.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/tradeWar.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/warDeployment.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/domain/worldPulse/worldState.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/aiLayer.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/cascadeGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/computeActiveChains.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/crossSettlementConflicts.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/defenseGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/economicGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/factionCorrelation.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/factionDynamics.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/factionRoles.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/foodGenerator.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/generateSettlementPipeline.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/helpers.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/historyGenerator.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/institutionProbability.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/isolationGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/legacyGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/lookups.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/narrativeGenerator.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/narrativeText.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/neighbourGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/npcGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/npcStructure.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/pipeline.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/powerGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/priorityHelpers.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/resourceGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/safetyProfile.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/servicesGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/spatialGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/assembleInstitutions.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/assembleSettlement.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/cascadePass.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/corruptionPass.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/economyReconcilePass.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/factionCorrelationPass.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/generateEconomy.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/generateNarratives.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/generatePopulation.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/generatePower.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/index.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/isolationPass.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/neighbourFactions.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/resolveConfig.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/resolveNeighbour.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/resolveResources.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/resolveStress.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/stepMetadata.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/stressConfirmPass.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/structuralValidationPass.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/steps/subsumptionPass.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/stressGenerator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/stressNarrative.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/structuralValidator.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/generators/terrainHelpers.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/hooks/useAdvanceSession.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/hooks/useCampaignAutoResume.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/hooks/useFocusOnViewChange.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/hooks/useGalleryPageState.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/hooks/useMapBridge.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/hooks/useMapImageImport.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/hooks/usePricingMoment.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/hooks/useRealmInspector.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| R | src/kernel/prng.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/accountImport.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/advanceWorkerClient.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/ai.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/analyticsEvents.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/analyticsQueue.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/auth.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/campaignSync.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/consent.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/contentPacks.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/customRegistry.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/dependencyEngine.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/dossierEntitlements.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/emailTemplates.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/entities.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/flags.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/founderSeats.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/gallery.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/mapBridge.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/pendingDossier.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/pricingMoments.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/referralRedeem.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/researchCapture.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/routes.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/saves.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/seo.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/session.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/stripe.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/lib/supabase.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/accountImportSlice.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/aiSlice.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/authSlice.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/campaignPulseHelpers.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/campaignRegionalSlice.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/campaignSlice.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/campaignSliceShared.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/campaignWorldPulseSlice.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/configSlice.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/customContentSlice.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/index.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/mapSlice.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/settlementDeityHelpers.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/settlementRenameHelpers.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/settlementSlice.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/settlementSliceHelpers.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/store/uiSlice.js | ● | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/utils/generateCampaignPDF.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |
| M | src/utils/generateSettlementPDF.js |  | MERGE-PLAN ADJUDICATED — engine reconciliation was the merge's documented core (MASTER_MERGE_PLAN §4/§5 + the 8 owner rulings); base-ruling scope is UI ORGANIZATION; ROUND 3 spot-audit only |

## copy law (cross-cut) — 1 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/copy/en.js | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 copy law (cross-cut)) |

## C15/PDF — 14 files

| St | File | Δpost | Disposition |
|---|---|---|---|
| M | src/pdf/SettlementPDF.jsx | ● | RESTORATION-OWED (census §1 #20 — campaign_state Current-State demoted; sweep scheduled) |
| M | src/pdf/lib/format.js | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
| M | src/pdf/lib/liveWorld.js | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
| M | src/pdf/lib/viewModel.js | ● | RESTORATION-OWED (census §1 #21 — entity-anchor/lineage/magicProfile stripped; sweep scheduled) |
| M | src/pdf/sections/AIAppendix.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
| M | src/pdf/sections/Cover.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
| M | src/pdf/sections/EconomicsTrade.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
| M | src/pdf/sections/FaithWar.jsx | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
| M | src/pdf/sections/IdentityDailyLife.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
| M | src/pdf/sections/PowerStructure.jsx |  | RESTORATION-OWED (census §1 #18 — RULE & SUCCESSION subsection deleted; sweep scheduled) |
| M | src/pdf/sections/Relationships.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
| M | src/pdf/sections/Timeline.jsx |  | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
| M | src/pdf/sections/ViabilityAssessment.jsx |  | RESTORATION-OWED (census §1 #19 — MAGIC LEGALITY subsection deleted; sweep scheduled) |
| M | src/pdf/variants.js | ● | DISPOSITIONED-BY-CENSUS (matches-master/program-ruled, census §4 C15/PDF) |
