---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-18
  type: milestone
  status: COMPLETE — base restoration + C1r-c craft consolidation (5 commits)
  branch: claude/deep-craft
  base: fb5e8031
  tips: "c722c99b (C1r-a), 2a12cc9c (C1r-b), 5e7cbdf4 (C1r-c1), 4075b499 (C1r-c2), 01ad3a8f (C1r-c3)"
  worktree: .claude/worktrees/agent-a39bc277a620ae767
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# C1-fin RE-CUT — the create-page base restoration

## Why this matters
Owner's BASE RULING (§1b of THE_REMAINING_ARCHITECTURE): origin/master @ d024286e
is THE UI BASE OF RECORD. Merge 0168e287 ("MASTER MERGE W1") discarded master's
create-page organization. Slice C1-fin restores it. The base restoration is the
slice's named core deliverable; the craft consolidation (C1r-c) sits on top.

## What shipped (base restoration — DONE + full-suite verified)
- **C1r-a @ c722c99b** — config stage restored to master's single
  LayeredConfigurationPanel (byte-identical to master; zero-reseat re-hosting).
  Stepped wizard DELETED (wizardStep stepping gone per manager ruling). Orphaned
  StepIndicator + WizardCommitBand files deleted (WizardChipRow kept — ChangeModeBar
  imports it). TradeDynamicsPanel "Step 4" double-disclosure flattened to master's
  `return <GoodsPanel/>`. Focus test retargeted to master's single-surface version.
- **C1r-b @ 2a12cc9c** — WizardEmptyState + HomeHero to master's remediated
  composition. theme.js: LANDING_MAX export added. THE ANON GAUGE LAW enforced
  (gauge maps `sizes` not TIER_ORDER → anon shows hamlet/village/town ONLY; the
  capped 3 are ABSENT). heroV2 inlined GA; 'Instant Generation' eyebrow dropped;
  P10 failure surface added (ClerkNote); two anon notes → one. NEW guard
  tests/ui/homeHeroAnonGauge.test.jsx.

## Load-bearing HAZARDS / discoveries (verify before touching these files)
- **setEntryPath / entryPath / createResetNonce are NOT in the live store.**
  Master's HomeHero + GenerateWizard use them; the composite dropped them. The
  live GenerateWizard exit machinery (doExit/requestExit, incl. an anon-exit bug
  fix `authTier !== 'anon'`) is the base — do NOT re-introduce entryPath.
- **tierFacts.contract.test.js (tip-lineage, ABSENT in master) REQUIRES
  HomeHero.jsx to import `../config/tierFacts.js`** and forbids stale tier-fact
  literals. Master's registry-only anon-cap drops that import → would fail this
  gate. HomeHero keeps config-derived TIER_FACTS.free.saveLimit + SINGLE_DOSSIER_PRICE.
- **deepCraftKillList is tolerance-0 per-commit (toBe(ceiling)).** Restoring
  master's SaaS chrome (rounded/shadowed plates, swatch.dangerBg washes) RAISES
  counts = an owner-signed regression the gate forbids. RESOLUTION PRINCIPLE:
  restore master's STRUCTURE, keep Deep Craft MATERIAL (flat plates, ClerkNote
  errors, Button primitive). Ceilings now borderRadius 1082 · boxShadow 115 ·
  rgba 270 · tinted 247.
- **5th pre-existing suite red: aiGroundingBundle.freshness** (bundle stale vs
  src/domain/aiGrounding.js). NOT in the brief's four parked goldens but provably
  pre-existing (my diff touches zero of its hashed domain inputs). The four parked
  goldens (generatorGoldenMaster · beliefMapGolden · worldpulseDeityGolden · pdf
  goldenViewModel) remain the known reds.

## C1r-c SHIPPED 2026-07-18 (the craft consolidation — 3 lettered commits)
- **C1r-c1 @ 5e7cbdf4** — THE LEAF: Advanced config (LayeredConfigurationPanel +
  WizardCloseout) wrapped in `.oc-m-unfold` (layout only, zero handler changes;
  content in DOM at t=0 so behavioral pins hold untouched). InstantWorldEntry
  RE-HOMED below the mode picker (same props/Suspense as fb5e8031's mount,
  still lazy) — the C1r-b recorded deferral is CLOSED.
- **C1r-c2 @ 4075b499** — THE TINT TRIO: WizardLoadedBanners' two tinted status
  banners → ClerkNotes. **WizardChipRow DELETED — it had ZERO importers
  repo-wide; the "ChangeModeBar imports it" premise (brief + C1r-a message) was
  FALSE** (WizardChipRow imported MODE_OPTIONS *from* ChangeModeBar, not the
  reverse). Ceilings lowered: borderRadius 1082→1078, tinted 247→246.
- **C1r-c3 @ 01ad3a8f** — THE STAGE BACKDROP: six evolution stills (ledger
  site-plates → sips 800px JPEG q70, 133–150 KB each, public/evolution/<tier>.jpg)
  behind the gauge, keyed to pickedSize. INTERACTION-GATED (stageLive — no fetch
  before LCP; hover prefetch deduped); pinned by NEW
  tests/ui/homeHeroStageBackdrop.test.jsx. Eager closure 1,038,614 B across all
  three commits — byte-identical to C1r-b (HomeHero rides the lazy
  GenerateWizard chunk). Verdict: SHIPPED (zero first-paint cost, measured).
- **DEFERRED (recorded, chip task_2bb0e68e): demo-panel MINIATURES.** A pure
  presentational half-scale (transform/zoom) would shrink RegionWakeReplay's
  deliberately-guarded 44px touch targets — an a11y regression; a faithful
  miniature needs an internal `compact` variant (violates the zero-change
  wrapper constraint) → owner-gated follow-up, not built.
