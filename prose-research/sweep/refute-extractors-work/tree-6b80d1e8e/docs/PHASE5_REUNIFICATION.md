# Phase 5 — The Reunification (program plan)

OWNER MANDATE (2026-07-11): complete Phase 5 and Phase 6. Fable reviews later; the
standard and governing theory are established across the program. This is the manager's
wave plan; the exhaustive worklist is memory/feature-parity-ledger.md (74 ABSENT / 39
PARTIAL / 15 OURS-BETTER / 1 live defect, top-20 ranked).

THE PREMISE (verified via git): the wave-4 merges are ancestors of HEAD, yet the
product-surface files they introduced are absent from OUR working tree — the merge kept
OUR functional cores and dropped THEIR features that lived inside those surfaces. The
reunification pulls the dropped features back onto OUR floor: their feature, our logic
inside, one product one floor.

## Standing laws (every wave)
- Adopt the FEATURE onto OUR floor; never blind-copy their file. Preserve OUR logic.
- DO-NOT-REGRESS the OURS-ahead set (ledger tail): mounted Versions tab, per-category
  email opt-out, worker PDF render, richer SEO/JSON-LD, share-image export,
  FeedbackWidget, legal pages, landingV2-on, faithSpreadEnabled gate, checkout-reconcile
  spine, and the landing OURS-ahead (hero closer copy, members→/create, F40 selector,
  welcomeView optional-chain).
- If an item pulls ABSENT deps or needs a store action that doesn't exist: wire what
  works cleanly, STOP the rest, and report. Never stub a missing backend.
- First-paint budget is a HARD gate (verify:dist). Newly-mounted heavy components
  lazy-load. Same gate discipline as the whole program: eslint, typecheck+strict,
  targeted tests, build+verify:dist; goldens byte-identical (these are UI-side).
- Opus implements per wave; manager reviews the index diff and commits.

## Wave sequence (by collision-fence, not just priority)

- **RQ — punch-list + the live defect** (IN FLIGHT). OAuth live (flip googleOauth/
  discordOauth, un-disable Discord, sign-in-scope, safe describeOAuthError); DELETE the
  dead $2.99 home CTA (live defect #12); register the Relationships tab (#19); mount
  NextActionRail (#17-PL); wire RealmStrip into CampaignFolder; flip compendiumInlineHelp;
  wire the orphaned Gallery maps surfaces; per-member import toggle; legal footer check.
  OPS DEP: Supabase OAuth provider must be configured in the dashboard for the buttons to
  authenticate (graceful failure ships safe regardless).
- **W4a — Library living surface**: advance-time from the list (folder button + interval
  picker + per-card kebab — owner finding #2, #1) on the existing `advanceCampaignWorld`/
  `isAdvanceInFlight` store; bulk multi-select + BulkActionBar; SaveQuotaMeter; HealthPip +
  LivingWorldSignalRow + the missing `livingWorldSignals.js`; needs-attention sort/filters.
  Fence: settlements/**, SettlementsPanel, LibraryToolbar, CampaignFolder (after RQ).
- **W4b — Realm war/faith surfacing**: War & Resolve inspector tab (#2, restore the
  section id + gate) + WarResolveSection; spatial WarFaithMapOverlay + war/faith
  relationship edges + LayersPanel toggle + MapLegend (#8); AssignDeityFromMap steering;
  SimulationRulesDialog engine gates + focus-trap (#20). Fence: map/**, region/**.
- **W4c — Gallery import**: import a shared settlement end-to-end (UI + hook +
  `importGallerySettlement` store action) (#3); share-flow import opt-in + facet capture;
  facet reconciliation. Fence: gallery/**, campaignSlice.
- **W4d — Account**: Security section (change password / linked identities / sign-out-
  everywhere) + the lib/auth methods (#4); Data & Privacy wiring the orphaned
  accountData/accountImport back-ends + delete-account (#7); Support tickets UI
  (AccountTickets) + operator SupportQueuePanel (#5); referral/redeem on account;
  preferences; left-rail AccountNav IA. Fence: account/**, admin/** (SupportQueue),
  lib/auth.js. (Runs AFTER RQ — shares the auth layer.)
- **W4e — Dossier depth**: Substrate + Magic + War&Faith tabs + EngineSections (#9);
  Workshop editor + WhatChangedPanel + ChangeQueuePanel; entity-hyperlink layer; the 8
  EventComposer field modules. Extend OUR FaithSection into the War&Faith tab (don't
  drop the Phase-4 premium seam). Fence: OutputContainer, dossier/**, settlement/**,
  new/tabs/** (after RQ registers the Relationships tab).
- **W4f — Generate + PDF + Compendium**: Place-in-Region card (#15); draft-export button;
  interrupted-save recovery; PDF Faith&War chapter + Campaign-State variant (#16);
  Compendium content-pack system + Living-World tab + deity surfaces (#11).
- **W4g — Admin**: audited AdminUsersPanel, AiPricingResyncPanel, AdminSimTuningPanel (#10).
- **RP — polish sweep**: the RP-tagged rows (a11y, skeletons, empty-state recovery,
  mobile branches, heroV2 GA-inline, size-toggle role=group, focus-traps).

## After reunification (rest of Phase 5)
- **W2 — conjunction content multiplication**: the specific role×situation×cause×
  lifecycleStage content against the W-C5 conjunction-key contract; the sanctioned regen.
  The one that makes the engine's depth speak.
- **Temporal audit/registry sweep**: normalize every remaining constant to the 4-4-5
  weekly calendar; the completeness-pinned temporal registry.
- **W-Session — session mode + Foundry export** (premium-adjacent to Export PDF).
- **W5 — polish**: dark mode, deity authoring UI cluster finish, hero wake-replay.

## Then Phase 6 (docs/PHASE6_DATA_LIFECYCLE.md)
Lifecycle-complete data layer; owner punch list (db push→head, og-image deploy, CSP flip,
backup drill, OWNER_EMAIL, sitemap env, founder-cap migration comment); the full-stack
"everything-on" soak + war-distribution certification (flips warSupplyQualityEnabled et al.
on with evidence); final comprehensive Fable grade-check.
