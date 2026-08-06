---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-22
  title: Dossier-web lane — power support web shipped; compendium-link half blocked
  branch: claude/dossier-web
  base: claude/composite-r4 @ f7b6ecb6 (newest owner fold; bfb22b34 + K-3 ledger + pricing trim)
  commit: e8ef756b (power web) + 755feafd (ruin-walker exemption)
  tags: 
    - dossier
    - power-tab
    - entity-links
    - compendium
    - institutions
    - finite-semantics
    - order-a
    - order-b
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T05:19:34.488Z
---

# Dossier-web lane (owner orders 2026-07-22)

Two owner orders. ORDER A (power support web) BUILT + tested. ORDER B (link web)
is mostly a VERDICT: half already exists, the compendium half is blocked by
missing infrastructure. Branch `claude/dossier-web` off the newest fold f7b6ecb6.
Commit e8ef756b.

## ORDER A — the power support web (SHIPPED @ e8ef756b)

"In the power tab, there should show when you click a power all of the
institutions that support that power for the DM to understand the web."

- New pure derivation `src/domain/dossier/powerSupport.js` → `deriveFactionSupport(settlement)`
  returns Map<factionDisplayName, SupportEdge[]>. Each faction row in PowerTab,
  when expanded, lists its supporting institutions with a one-line typed basis.
- PowerTab.jsx: the faction row is now a real disclosure (aria-expanded /
  aria-controls=`power-faction-<i>-detail`), expandable when it has a desc OR
  supporting institutions. Synergy: an NPC→faction hyperlink already expands the
  focused row, so it now ALSO reveals that power's institutions.
- Each listed institution is an `InstitutionLink` (existing primitive → the
  InstitutionCard popover, which surfaces the compendium-authored `oneLiner`
  identity via institutionVocabulary). This is the ORDER-B "institutions are
  links" requirement met with the affordance the app already ships.

### The derivation basis (typed, finite — the DATA REALITY)
Probed the FULL pipeline (`generateSettlementPipeline(config, null, {seed, customContent:{}})`).
The generator emits **no per-institution controlling-faction field** and **no
per-faction institution list**. The only institution↔faction join is the faction
**display-name STRING** (there are NO ids/slugs on factions). Two honest signals:
- `founded` — institution.`factionSource` (a sparse ~1/settlement EXACT faction-name
  marker: e.g. Great cathedral→Religious Authorities). Basis phrase: "Raised by this power".
- `aligned` — category alignment: institution.`priorityCategory` maps (INST_CATEGORY_TO_FACTION)
  to a faction.`category`; the leading faction of that category is the backer.
  REUSES `institutionBackingFactionName` — the SAME helper the InstitutionCard
  "Backed by" row reads (I exported it from institutionProfile.js; byte-identical
  behavior) so the Power tab and InstitutionCard NEVER diverge. Basis phrase keyed
  by the backing faction's canonical `factionArchetype` (merchant→"A commercial
  house of this power", military→"An armed body under this command", religious→"A
  house of this faith", etc. — a FROZEN, finite `SUPPORT_BASIS` enum, no dashes/F24).
- An institution is attributed to AT MOST ONE faction (founder wins over aligned).
- Coverage on real data: city 33/47 institutions under 5 factions, town 39/50
  under 4, village 20/32 under 2. Ungrouped = categories with no faction
  (entertainment/adventuring/infrastructure) — correct: they back no power bloc.
- ⚠️ COARSENESS: the aligned relation is category-level, disambiguated to the
  dominant faction of the category. It can surface a surprising attribution
  (e.g. an "Auction house" tagged priorityCategory:military lands under the Watch)
  — but that is a PRE-EXISTING generator classification quirk, surfaced
  consistently with the InstitutionCard, NOT introduced here.

## ORDER B — the link web (VERDICT: half wired, compendium half BLOCKED)

"The dossier is supposed to be a web of hyperlinks back to another location within
the dossier for NPCs and to the compendium responsible place for institutions and
resources and goods and the likes."

### Intended-vs-wired (the owner explicitly wanted to know)
- **NPCs → in-dossier: BUILT AND WIRED.** `EntityLink` (primitives/EntityLink.jsx)
  + `buildDossierEntityIndex` (domain/dossier/entityLinks.js) + `useDossierEntityNav`
  + `DossierEntityContext` (provider hoisted in OutputContainer). Consumed by
  EngineSections (Ruler/contenders → power tab; NpcAgencySection agent+rival names),
  neighbourComponents (local NPC names), and narrative prose via `ProseParagraph` +
  the `⟦entity:id|name⟧` tokenizer, whose PRODUCER exists end-to-end
  (supabase/functions/generate-narrative/entityRefWrapper.ts → store/operations.js).
  Rename-safe (id-based, live currentName), broken-link-safe (degrades to plain
  text). This half of the owner's vision is REAL, not regressed. EntityLink is used
  today only with type "npc" and "faction".
- **Institutions / resources / goods → compendium: NOT built, and BLOCKED.**
  Verified the compendium: it is a top-level route (`navigate('compendium', ...)`).
  Per-entry DOM anchors exist for ONLY 6 classes (deities, operations, systems,
  presets, lenses, calamity flavours), format `deity-<slug>` etc. via
  registrySlug.slug. **Institutions have NO per-entry compendium anchor** — the
  InstitutionsTab renders name-keyed cards (`key={inst.name}`, no id), capped at
  the first 48 unless a search filters. **Resources and trade goods have NO
  compendium representation at all** (no entry/anchor/route; they live only as
  prose Cards in EconomyTab). No dossier surface links to the compendium today.
  → A per-entry compendium deep-link for institutions/resources/goods CANNOT be
  built inside a golden-safe display-only lane: it needs (a) per-entry DOM ids on
  compendium cards, (b) a search-prefill/deep-link that bypasses the 48-card cap,
  (c) name-identity reconciliation (dossier institution ids use `_` separator vs
  the compendium dash slug), and likely (d) COMPENDIUM_INDEX rows — shared
  compendium surgery that is a **genuinely-new capability, owner-gated**. Resources/
  goods additionally need compendium CONTENT that does not exist (generation/
  compendium-data work). Reported as a scoped follow-up, not built.

## OWNER-DECISION QUEUE (from this lane)
1. Compendium per-entry linking for institutions: build the anchor + deep-link
   infrastructure (new capability on the shared compendium surface)? The clean
   FIRST win is DEITIES (they already have per-entry anchors + COMPENDIUM_INDEX
   rows + all cards rendered; join = slug) — a dossier deity→compendium link is
   cleanly achievable and would prove the mechanism.
2. Resources / trade goods: do they get compendium entries at all (generation +
   compendium-data)? Prerequisite before any resource/good compendium link.

## HAZARDS / how-to-apply
- ⚠️⚠️ THE ONE REAL REGRESSION (caught + fixed @ 755feafd): any NEW `src/domain/**`
  file that reads `.institutions` trips `tests/lint/ruinFilterRoster.walker.test.js`
  (structural-prevention Pattern 2) — it must route through `liveInstitutions`/
  `isLiveInstitution` (src/domain/institutions/institutionRoster.js) OR be listed in
  RUIN_AGNOSTIC_EXEMPT with a reason. powerSupport.js reads the roster; I classified
  it EXEMPT (display/list — relationship/alignment display, not a live-provider
  capacity aggregate; the InstitutionLink surfaces each institution's real state).
  This walker fires ONLY in the full suite (a lint family), not in focused runs — so
  ALWAYS run it when adding a domain roster reader.
- ⚠️ The support relation reuses `institutionBackingFactionName` (now exported from
  src/domain/display/institutionProfile.js). Keep the two in lockstep — if you
  change the backing heuristic, both the InstitutionCard "Backed by" row and the
  Power tab support web move together (that is the point).
- ⚠️ `powerSupport.js` is domain-strict-clean and domain-any=0 (I used structural
  typedefs, NOT `any`, so the shrink-only any-baseline stays flat — do the same for
  any edits). tests/lint/domainAnyCastBaseline.test.js is AIRTIGHT (exact match).
- ⚠️ Closure: powerSupport.js is imported ONLY by the lazy PowerTab chunk, so
  first-paint closure is Δ0 (measured in a fresh worktree — see gate receipts).
- Faction join is BY NAME (no ids). factionSource compare is normalized name.
- The lane did NOT touch: entityLinks.js, EntityLink, the compendium panel, any
  store action, generation, or the PDF. In-dossier NPC/faction web untouched
  (already works).

## GATE RECEIPTS (commit e8ef756b)
- Focused: powerSupport.test.js + powerTabSupport.test.jsx = 21/21; regression
  cluster (powerTabLadder, institutionLinkTabs, tabs.smoke, compendiumPanel.smoke,
  dossierEntityLink, entityIndex, institutionProfile, entityLinksFactionIdentity,
  useNavigateToEntityStability, entityRefProducerConsumer) = all green.
- tsc full = 0 errors, exit 0. domain-strict = 0 (ceiling 0). domain-any baseline
  = pass (powerSupport 0 any). eslint (changed) = 0. copyCorruption = pass. NUL = 0.
  sizeBaseline / layerBoundaries / powerStructure = pass.
- Fresh-worktree build + VERIFY_DIST: CONFIRMED. Detached worktree at e8ef756b,
  full build (vite + prebuild sitemap + postbuild prerender). FIRST-PAINT CLOSURE =
  **1,039,995 bytes = Δ0 vs the 1,039,995 target** (powerSupport rides only the lazy
  PowerTab chunk). VERIFY_DIST=1 vitest run tests/build/ = 30 files / 225 tests PASS,
  exit 0. (755feafd changes only a test file — never bundled — so the closure quote
  holds unchanged; CONFIRMED by construction.)
- Full suite (run as 4 shards under raw parallelism; the sanctioned harness serializes
  pglite/heavy families, which raw --shard does not): the ONLY code-caused failure was
  the ruin-filter walker (fixed @ 755feafd, now 3/3). The 4 PARKED GOLDEN FAMILIES
  reproduced deterministically and are TOLERATED: tests/pdf/goldenViewModel.test.js,
  tests/property/generatorGoldenMaster.test.js, tests/property/worldpulseDeityGolden.test.js,
  tests/property/beliefMapGolden.test.js — all assert GENERATION output; my commit
  touches ZERO generation/golden files (git show --stat confirms 5 display/test files),
  so they are pre-existing parked reds. advancePauseResume (flaky) PASSED isolated 9/9.
  All other raw-shard failures (tests/security/*.pglite ×11, ghostFamine,
  servicesSeverityPlaceholder, foodModelSingleWriter, joins/ordering, feedDistribution,
  settlementsPanelDelete, realmHub) PASSED single-threaded (--no-file-parallelism):
  61/61 — parallelism/contention artifacts of raw sharding, NOT regressions, NOT mine.
