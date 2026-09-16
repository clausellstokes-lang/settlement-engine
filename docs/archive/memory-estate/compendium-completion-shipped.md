---
name: compendium-completion-shipped
description: "2026-07-22 COMPLETE wave program closing the 63-gap compendium completeness audit across 13 waves (A-M). A+B+C-H FOLDED (composite-r4 bd796559); final leg I/J/K/L/M SHIPPED on claude/compendium-completion-3 (off bd796559), every closure Δ0. See docs/COMPENDIUM_COMPLETION_PLAN.md. NOTE: bd796559 carries 2 PRE-EXISTING lint reds from a parallel lane (settlementWorldChronicle any-holes + 2 unregistered walkers), not this program's."
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-22T09:17:35.168Z
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
---

# Compendium Completion program (2026-07-22, IN PROGRESS)

Audit-driven wave program (wave-program doctrine) closing the **63-gap** compendium
completeness audit (`/private/tmp/.../tasks/w4twahdqu.output`, 5 analysts + critic).
Branch **claude/compendium-completion** off composite-r4 **d93f8699**. THE LIVE PLAN
+ full wave specs + ledgers = **docs/COMPENDIUM_COMPLETION_PLAN.md** (authoritative;
this file is the index). ⚠️ The audit ran against the OLD tip 53d72f57, so verify
current state before authoring — several gaps were already closed by the operations-
legibility fold (causal-16 list, system blurbs, pressure readings, deity roster, the
calamity dormant flag).

## Shipped — PROGRAM COMPLETE (13 waves, A-M)
- **FINAL LEG I-M** on **claude/compendium-completion-3** (off composite-r4 **bd796559**, which folded C-H), every closure 1,039,961 = Δ0: **I** `e3c93c36` (Power: Public Legitimacy ladder + 13 faction archetypes + governance-stability labels); **J** `66d65c93` (Safety + Defense Readiness ladders, defenseDisplay authored read-only); **K** `f581838a` (map lens readings + Illustrated 6th lens + District wealth/safety bands + calamity scale/kFactor lead-in); **L** `e97eaf3f` (settlement lifecycle remnants/satellites + 10 NPC goal kinds + always-visible ops klass/scope legend); **M** `4b645cd0` (power-structure transfer causes + corruption machinery + archetype cond re-words off phantom tier/stress + magic-buffer/institutions prose). Plan-note `f11983d2`. New pins: compendiumPower, compendiumSafetyDefense, compendiumMapCalamity, compendiumLivingCompletions, compendiumPowerExtras.
- ⚠️ **PRE-EXISTING REDS on bd796559** (proven via temp-worktree run of the clean base; a PARALLEL lane's, not this program): domainAnyCastBaseline flags src/domain/dossier/settlementWorldChronicle.js (7 any-holes, baseline 0); mutationCoverageManifest flags tests/lint/autoresolveTwoMount.walker.test.js + tests/store/commitPendingEditsTotality.walker.test.js. Flag for the owner; do NOT attribute to the compendium program.
- **Waves A + B FOLDED** at composite-r4 **95f57988**. **Waves C-H shipped** on branch
  **claude/compendium-completion-2** (off 95f57988), one gated commit each, all closure
  1,039,961 = Δ0: **C1** `52a4d8c1` (deity 4 axes from DEITY_AXIS_EFFECTS + Pantheon Rank,
  no roster; totality pin gains the arcane tab); **C2** `def9fe8c` (Magic Level + Legality
  ladders; drifted config Magic whisper Mundane/Common/High -> None/Low/Medium/High);
  **D** `07b34a89` (Terrain id="terrain" + Cultures id="cultures" + dead anchors repointed:
  glossary verb -> living-world, power tab gains id="power"); **E** `5e454fc4` (the 4 quiet
  presets distinguished via intensity + humanized autonomy + summary); **F** `31fbd3f3`
  (monster-threat LIE fixed to the 3 real arms heartland/frontier/plagued, producer-bound,
  T4-safe); **G** `d7db7a16` (Food Security ladder foodGenerator-pinned + Severity/Magnitude
  dial ladders + glossary DEFS de-em-dashed, a shrink-only voice win glossary.js em 5->0);
  **H** `bd5eac94` (search drift: tier keywords derive from CD.tiers, 'affluent' phantom
  gone, the 13 W6 ladders indexed + deep-linkable). Plan-notes interleaved.
  ⚠️ NEW PINS added this run: compendiumFaith, compendiumWorldInputs, compendiumPresets,
  compendiumMonsterThreat, compendiumFoodSecurity, compendiumSearchDrift; the band-ladder
  totality pin's TAB_COMPONENT now includes `arcane`. A **Wave-G MED remainder** (legitimacy,
  governance stability, faction archetypes, corruption block, safety, defense, calamity
  scale/kFactor, lens one-liners, district bands, institutions selection, ops klass/scope
  legend, lifecycle phases) is ledgered in the plan doc for continuation.
- **Plan opened** `ea4b126f`; plan-note `efe9f188`.
- **Wave B** `140f56cd` — the 15 empty Stress rows now render `viabilityNote` (body) +
  `crisisHook` ("at the table" line). They were a bare EMPTY_VALUE dash because the tab
  read `s.description||s.desc` and STRESS_TYPE_MAP carries neither. Pin:
  tests/ui/compendiumStressRows.test.jsx (every entry has a non-empty viabilityNote +
  the tab renders it). No CD change.
- **Wave A** `e13a7ef8` — the owner's four Economy examples as W6 band ladders (the
  sanctioned path): **Priority Bands** (5 sliders, 5-95, cuts 15/35/65/85), **Chain
  Status** (the 6 DISPLAY statuses the SupplyChainsPanel shows; captured/collapsing named
  as defined-but-not-emitted), **Coherence Check** (RENAMED from "Viability Score" — the
  engine returns a 3-state verdict COHERENT/MARGINAL/NOT COHERENT, not a score), and an
  enriched Exports & Imports card. Regen'd; totality-pinned.

## THE MACHINERY (reuse for every remaining wave)
- **W6 ladder path** = add a row to `LADDER_META` in `src/domain/compendium/bandLadders.js`
  with either an authored `levels:[{name,reading}]` (the new idiom I added — Wave A) OR a
  `category` reading from the glossary; `npm run gen:compendium-data` bakes it into
  `CD.bandLadders`; the tab component renders `laddersFor(tab)`; the totality pin
  `tests/ui/compendiumBandLadders.test.jsx` auto-covers it (every rung read + rendered).
  For a NEW tab id, extend that pin's `TAB_COMPONENT` map + make the tab render laddersFor.
- ⚠️ **VOICE**: every reading routed into CD flows into `compendiumData.generated.js`
  (scanned by voiceMechanics Tier-2; baseline em:2, bang:0). NO em-dash, NO exclamation in
  authored readings. The glossary `SEVERITY_DEFS`/`MAGNITUDE_DEFS` CONTAIN em-dashes — the
  severity/magnitude dial ladders (deferred) need those de-em-dashed FIRST or the count grows.
- ⚠️ **CLOSURE**: baseline 1,039,956; Wave A landed 1,039,961 (+5 shared-chunk rebalance,
  NOT authored content — a length-neutral SEO edit did not move it). Under 1,040,000 hard cap.
  Extract the exact number by temporarily setting `CLOSURE_BUDGET_BYTES=1` in
  tests/build/vendorPdfLazy.test.js + `VERIFY_DIST=1 npx vitest run` it (prints on fail), restore.
- Fences (do NOT edit): dossier PowerTab.jsx + Wave-2 display files (monsterThreat/safety/
  defense), walk-completions, admin/gallery-detail, pricing, arch/, migrations. Compendium
  side (bandLadders/glossary/gen script/CatalogTabs/RegistryHubs) is IN scope.

## Remaining waves (severity-first; each spec'd in the plan doc with truthSources)
- **C** faith/magic/deity-axes (HIGH): deity AXES from DEITY_AXIS_EFFECTS (lead the tab, doctrine),
  Pantheon Rank (PANTHEON_TUNING), Magic Level + Legality (getMagicLevel + magicProfile exports;
  fix the drifted magicLevel whisper), Devotion + Faith Legitimacy (lift faithPanelModel bands to domain).
- **D** world inputs (HIGH, dead anchors): Cultures id="cultures" (12 values), Terrain id="terrain"
  (7 values), repoint verb->living-world + stamp id="power". The whispers currently land nowhere.
- **E** presets (HIGH): the 4 "quiet" presets read identically; extend the gen-script presets
  projection with distinguishing axes (intensity/autonomy/toggles from SIMULATION_RULE_PRESETS).
- **F** monster-threat vocabulary LIE (MED, producer-bound): replace fabricated Safe/Frontier/
  Dangerous/Plagued with the real 3 arms heartland/frontier/plagued (display Safe Heartland/Active
  Frontier/Embattled Region), bound to resolveConfig; re-word archetype conds + searchIndex. Must
  stay true after the queued T4 deriveSystemState fixes.
- **G** MED ladders: Food Security (deferred from A), severity/magnitude dials (de-em-dash first),
  legitimacy, governance stability, faction archetypes (13), power-structure, corruption machinery,
  safety, defense readiness, magic-as-buffer, prosperity food-cap clause, calamity scale/kFactor,
  map-lens one-liners + Illustrated 6th, district wealth/safety, institutions selection vocab,
  operations klass/scope legend, settlement lifecycle phases. Several coordinate with the folded
  power-strata (verify current state first).
- **H** LOW: searchIndex drift (affluent phantom, stale tier pops, derive from CD, all-15 stress
  entries, ladder search entries) + a drift walker; power-tab intro formula; NPC goal vocabulary.

## Owner-decision queue
- Closure +5 (Wave A): owner reclaim at promotion, or re-pin budget (vendorPdfLazy comment mechanism).
- BandPill orphan (critic): the display-label vocabulary (Contested/Stretched/...) has ZERO importers
  — dark. Do NOT author "shown as X" aliases; own-lane decision, not a compendium edit.
