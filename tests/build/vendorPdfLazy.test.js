/**
 * tests/build/vendorPdfLazy.test.js — Tier 9.7 first-paint lazy verification.
 *
 * Two heavy chunks must stay OUT of the entry's first-paint static closure:
 *   • vendor-pdf (@react-pdf/renderer + jsPDF, ~1.85 MB / 616 kB gz) — only
 *     when the user clicks "Export PDF".
 *   • the generator engine (~514 kB) — only on first Generate (settlementSlice's
 *     loadEngine dynamic import) and lazy dossier tabs. The entry reaches only
 *     the small kernel + engine-core chunks; see vite.config.js manualChunks.
 *
 * The load-bearing vendor-pdf contract is:
 *
 *   1. vendor-pdf is its own chunk (manualChunks isolates the PDF stack).
 *   2. vendor-pdf is ABSENT from the ENTRY chunk's *transitive static
 *      import closure* — i.e. nothing the entry statically pulls in
 *      (directly or through another static edge) references vendor-pdf.
 *      This is the real regression guard: it was defeated once because
 *      Rollup co-located Vite's __vitePreload helper into vendor-pdf, so
 *      the entry statically imported the whole PDF stack just to reach a
 *      20-line helper. The fix pins that helper into vendor-state (see
 *      vite.config.js). A byte budget on the closure ratchets that shut.
 *   3. index.html does not emit a <link rel="modulepreload"> hint for
 *      vendor-pdf (secondary — a preload hint can only *add* a fetch for
 *      a chunk that's already reachable; the static-closure check above
 *      is what proves the chunk isn't reachable at all).
 *   4. The components that export PDFs use dynamic `import()` (source
 *      contract — survives source refactors even without a build).
 *
 * Contracts 1–3 read the built dist/ output and run only when dist/
 * exists (i.e. after `npm run build`); CI runs this after the build
 * step. Contract 4 runs against source and needs no build.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, dirname, relative } from 'node:path';
// The eager first-paint module graph, read from vite.config.js's OWN derivation
// (never a replica — see the WEAVE ST-2 surface-law block at the foot).
import { EAGER_FIRST_PAINT_MODULES } from '../../vite.config.js';
import {
  brotliCompressSync,
  constants as zlibConstants,
  gzipSync,
} from 'node:zlib';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);

// ── STALE-DIST POLICY (scripts-build-ci-2 / test-gate-honesty-1) ─────────────
// `npm run check` runs `test` BEFORE `build`, so during the plain test phase the
// dist/ on disk PREDATES the current tree (or is absent). A dist-READING contract
// that runs then measures the PREVIOUS build — a stale-dist false red (or, worse,
// a false GREEN that lets a regression ride, exactly how W-F0..F6 first-paint
// growth rode +293 B under a vacuous ratchet, documented below). The cure, first
// applied to townMapLazy's presence half and now the house idiom across tests/build/:
//   • PRESENCE / SIZE / BUDGET assertions (the chunk exists, is large enough, the
//     first-paint closure is under budget) READ the fresh build's bytes and are
//     gated on VERIFY_DIST — they run ONLY in the post-build `npm run verify:dist`
//     re-run (VERIFY_DIST=1, after `npm run build`), never in the pre-build phase.
//   • ABSENCE assertions (X is NOT in the entry closure / not preloaded) stay
//     UNGATED (runIf(distExists) only): a stale dist can only UNDER-report absence
//     (a newly-added eager edge is missing from the old dist ⇒ at worst a false
//     PASS pre-build), which the post-build VERIFY_DIST re-run then catches — an
//     absence check never false-REDS on a stale dist, so gating it would only lose
//     coverage. The anti-vacuity `it` below makes VERIFY_DIST=1 + missing dist a
//     HARD failure, so the gated halves can never count green having measured nothing.
const requireDistRead = process.env.VERIFY_DIST === '1';

// ── First-paint static-closure byte budget ──────────────────────────────────
// The entry's transitive static import closure is everything the browser is
// forced to download before it can paint. Measured after the KERNEL + ENGINE-
// CORE split that lifted the 656 kB engine chunk out of first paint
// (2026-07-09, `npm run build`):
//
//   data          438,161   +  index(entry)  516,565
//   engine-core   107,802   +  vendor-icons   30,041
//   kernel          8,852   +  vendor-react  193,160
//   vendor-state   17,031
//   ──────────────────────────────────────────────────
//   MEASURED TOTAL: 1,311,612 raw bytes (~1.25 MB)  —  7 files
//
// This was 1,825,278 (+ the 655,647 engine chunk) before the split. What moved:
//   • The seeded-PRNG seam (prng.js + rngContext.js) became src/kernel/ — a
//     tiny (~9 kB) first-paint chunk that the createPRNG edge (domain/events/
//     mutate) now resolves to instead of the engine chunk.
//   • The entry-reachable generator SPINE (structuralValidator,
//     crossSettlementConflicts, stepMetadata + helpers/priorityHelpers/
//     institutionProbability/neighbourGenerator) AND the domain vocabulary the
//     generators lean on (the ENGINE_SHARED_DOMAIN closure — trace, schema,
//     magicFilter, deterministicSort, clock, corruption, faction*, …) split
//     into the small (~108 kB) 'engine-core' chunk. Rollup used to co-locate
//     that shared domain into the 656 kB engine chunk, which is precisely why
//     the entry statically imported engine before this change.
//   • buildThreatAssessment moved to a pure domain leaf
//     (domain/display/threatAssessment.js), cutting the defense-display edge.
//   • stressTypes.js (now pure data) moved engine→data.
//
// The 656 kB engine chunk is now ABSENT from this closure (asserted below) and
// is fetched lazily on first Generate. vendor-pdf (1.85 MB / 616 kB gz) is
// likewise absent. The ceiling below is measured + ~5% headroom, and is a
// monotone ratchet: it should only ever move DOWN as more is made lazy, never
// up without a deliberate, documented reason. If this fails high, something
// re-entered the static graph — very likely a NEW eager store/domain/first-
// paint-UI static import of a heavy generator (which would drag the engine
// chunk back in). Check the closure listing the test prints and route the
// offending edge through kernel / engine-core / a leaf instead.
//
// (2026-07-10, W2b — the ceiling HOLDS at the pre-W2b 1,377,000 because the
// sim-applier leaf extraction absorbed the wave's eager cost.) The events wave
// added SHIFT_TIER / IMPOSE_CULT / APPLY_STRESSOR-souring to the event-mutation
// vocabulary (domain/events/mutateEntities.js + mutateWorld.js, statically
// reachable from the eager store via mutate.js). Their handlers reuse the landed
// sim's single-source appliers, which initially dragged the fat sim modules
// (+~83 kB min) into this closure. Fixed by the mandated leaf extraction (the
// domain/deityConstants.js pattern):
//   worldPulse/tierOutcomeApply.js    — applyTierOutcomeToSettlement + its
//     catalog helpers (imports only institutionalCatalog, data/constants, and
//     the stablePart slug leaf); tierResourceDynamics.js re-exports verbatim.
//   worldPulse/cultImpositionApply.js — reconcileCultImposition + nicheOf/
//     capacityForTier/deityRankStrength + the SLOTS_BY_TIER and
//     DEITY_RANK_STRENGTH tables (zero imports); religionState.js and
//     pantheon.js re-export / fold them back.
//   worldPulse/stablePart.js          — the id-slug (zero imports); worldState.js
//     re-exports it, so the eager applier mints byte-identical institution ids.
// The heavy evaluation machinery (worldState, simulationRules, resourceTaxonomy,
// goodsCatalog, pantheon, relationshipState, canonicalAccessors, supplyChainData)
// stays lazy — the 514 kB engine chunk is asserted ABSENT above. Remaining W2b
// additions that legitimately ride first paint: the event handlers themselves,
// warStressorTypes (zero imports) + canonicalRelationship (import-free, ~7 kB —
// small APPLY_STRESSOR vocabulary leaves, NOT worth their own split), plus
// institutionClassify, deityConstants, the causalState 16-variable growth, and
// the npcData trait tables. NET: MEASURED 1,368,015 raw bytes (7 chunks)
// post-extraction — up ~56 kB from the 2026-07-09 pre-W2b 1,311,612 (the legit
// additions above), but still UNDER the pre-W2b 1,377,000 ceiling, which is
// therefore RESTORED UNCHANGED: W2b lands net-zero against the first-paint
// budget. If this fails high, the extraction leaked or a new eager heavy edge
// re-entered — read the closure listing the test prints and route it through
// kernel / engine-core / a leaf.
// (2026-07-10, W2b-r + 4a) 1,377,000 -> 1,382,000: wave 4a's deity store mounts
// (+~9 KB entry) consumed the extraction headroom (HEAD measured 1,377,320 on a
// clean build — the 4a gate passed at the ceiling's jitter margin), and W2b-r's
// three event-registry entries add 2,742 B of composer-facing copy
// (SET_PRIMARY_DEITY / IMPOSE_CULT / SHIFT_TIER — canonical descriptions, same
// shape as every existing entry). Measured 1,380,062; +~2 KB headroom only.
// RATCHET-DOWN PATH (wave 5): evaluate code-splitting EVENT_REGISTRY's narrate/
// description prose out of first paint (the validation path needs only the type
// table); then return toward ~1,370,000.
// (2026-07-10, 4b/4c) 1,382,000 -> 1,400,000: the single-source copy registry
// (en.js 676 -> 1,245 lines, owner-ratified consolidation) rides the first-paint
// data chunk; 4b's gate measured green but HEAD then measured 1,398,495 — the
// SECOND measurement instability at this ceiling tonight (see 4a jitter note).
// 4c NET-REDUCED the closure to 1,395,755 (lazy HomeLanding/PostGenCoach/DEV
// panels/CampaignSyncBanner). RATCHET-DOWN PATH (4h/wave 5): (a) namespace-level
// lazy segmentation of the copy registry (deep-surface namespaces load with
// their surfaces), (b) the registry-prose code-split from the W2b-r note,
// (c) make this measurement deterministic — investigate chunk-assembly
// nondeterminism before trusting sub-kilobyte margins again.
// (2026-07-10, 4d) 1,400,000 -> 1,410,000 — ONE allowance for the remaining
// wave-4 boot-graph dribble (4d's auth bridge measured 1,402,172; third
// pass-then-fail at this ceiling tonight). NO further per-wave bumps: wave 5
// owns the reduction program — registry-prose split, copy-namespace
// segmentation, measurement determinization — and ratchets DOWN from here.
// (2026-07-10, 4g) ceiling HOLDS at 1,410,000, and 4g BUYS headroom back. The
// share loop's seo.js additions (per-route OG/Twitter image trio + the site
// WebSite/SoftwareApplication JSON-LD) rode the eager entry and pushed the
// closure to 1,412,642 (OVER). Two moves absorbed it and then some:
//   • the map-only lucide split — icons imported ONLY by src/components/map/**
//     (20 of them) now ride a lazy 'vendor-icons-map' chunk, shrinking the
//     first-paint vendor-icons chunk 31,750 -> 27,751 (see vite.config
//     computeMapOnlyLucideIcons); and
//   • the per-shared-dossier head enricher (setSharedDossierMeta) moved to the
//     lazy lib/seoDossier.js so only the gallery surface pays for it, not the
//     entry.
// NET MEASURED 1,407,4xx (`npm run build`) — back UNDER the ceiling (~2.6 kB
// headroom) with the icon split's margin restored. If this fails high, re-measure the closure
// listing the test prints; the map split can only ever move MAP-EXCLUSIVE icons
// out (safety invariant enforced by tests/build/iconChunkSplit.test.js).
//
// ── (wave 5b) MEASUREMENT-DETERMINISM ROOT CAUSE ────────────────────────────
// The "pass-then-fail at the jitter margin" incidents above (4a/4b/4d) read as
// build NON-DETERMINISM. Wave 5b investigated it empirically: two BACK-TO-BACK
// `npm run build`s of the SAME tree produce a BYTE-IDENTICAL closure (1,407,359
// across the same 7 chunks — data / index / engine-core / vendor-react /
// vendor-icons / vendor-state / kernel). So within a fixed tree + toolchain the
// measurement is DETERMINISTIC. The historical "instability" was NOT same-tree
// chunk-assembly jitter — it was (1) cross-COMMIT first-paint growth (the gate
// ran on commit A; a later HEAD measured higher because it genuinely added
// first-paint code) and (2) the residual cross-ENVIRONMENT risk (CI's Node/OS
// vs a dev machine can shift Rollup output a few hundred bytes) — both hiding
// behind a sub-3 kB margin. That margin, not nondeterminism, is what made the
// gate look flaky.
//
// Consequence for the ratchet: this budget is deliberately NOT tightened here.
// The wave-5 reduction program's ratchet-DOWN to ≤1,377,000 is CONTINGENT on
// first SHRINKING the closure — (a) code-splitting EVENT_REGISTRY narrate/
// description prose out of first paint, (b) namespace-level lazy segmentation of
// the copy registry (deep-surface namespaces load with their surfaces). Those
// are large refactors of the domain event registry + the copy loader seam that
// risk golden byte-identity and were held for a dedicated, verifiable pass (the
// exact seams are mapped: registry.js EventSpec prose vs the eager store→
// eventPipeline/batch validation path; en.js's account/auth/pricing/gallery/
// moments/valueLadder/aboutLiving namespaces). Tightening the 2.6 kB margin
// WITHOUT that closure reduction would only re-create the pass-then-fail bumps
// this wave exists to end, so the budget HOLDS at 1,410,000 until the closure
// itself comes down. Monotone-down thereafter; never raise.
// (2026-07-11, W-F7 landing) 1,410,000 -> 1,411,000: a +293 B overage, pre-existing
// relative to W-F7 (byte-identical with all W-F7 src stashed).
// ROOT-CAUSE CORRECTION (2026-07-11 post-landing forensics): NOT dependency drift.
// A fresh `npm ci` from the committed lockfile rebuilds to 1,410,293 byte-for-byte
// (runtime deps in the lock are unchanged since Jun 16 — the only later lock change
// added `sharp`, a devDependency), and an isolated-worktree per-wave bisect shows
// deterministic COMMITTED-SOURCE growth from the wave-5b baseline 1,407,359:
//   +463 (W-F0/F1)  +506 (W-F2)  +160 (W-F3)  +420 (W-F4a)  +595 (W-F5)
//   +790 (W-F6, crosses 1,410,000)  = +2,934 total
// — ordinary eager-surface accretion of the Phase 4 faith waves eating the 2.6 kB
// wave-5b margin. It rode green gates because the ratchet was VACUOUS at gate time:
// `npm run check` ran `test` BEFORE `build`, so this suite measured the PREVIOUS
// run's dist (W-F6's gate measured the W-F5.5 closure, 1,409,503 — under budget),
// and this chain's ci.yml lost the post-build VERIFY_DIST=1 re-run in the
// reconciliation (master's a50efa2e chain had it; the merged ci.yml did not).
// Both gates are now fixed: `check` chains `npm run verify:dist` after its build,
// and ci.yml re-runs tests/build/ post-build. ONE growth allowance — and note the
// remaining margin is a razor 707 B while cross-environment Rollup output can shift
// a few hundred bytes, so the reduction program is load-bearing, not aspirational:
// (registry-prose split + copy-namespace segmentation, seams mapped since wave 5b)
// remains FORMALLY SCHEDULED as its own wave before Phase 5 and ratchets DOWN
// from here.
//
// REUNIFICATION ALLOWANCE (2026-07-11, owner-approved): raised 1,411,000 → 1,440,000
// for the Phase-5 reunification's Gallery-import (W4c) + dossier Substrate/Magic/
// War&Faith tabs (W4e). The overage is NOT their own code (all lazy) — it is shared
// dossier/war read-models (dossierViewModel, warStatus, causalState — the latter an
// engine module that cannot leave first paint) that Rollup HOISTS into the entry once
// the new lazy surfaces add importers, against a ratchet HEAD had already pinned to a
// 163 B margin. normalizeSettlement was made lazy first (−2.1 kB, deterministic;
// settlement-normalize chunk).
//
// W4h EXTENSION (2026-07-11): raised 1,440,000 → 1,441,000. The domain-display
// read-models (armyStrength/tradePressure/visibilityAudit) are imported by TWO lazy
// surfaces — the PDF Faith&War chapter AND AdminSimTuningPanel — so Rollup hoists ~440 B
// of the shared closure toward the entry (HEAD 1,439,584 → 1,440,024, 24 B over). SAME
// mechanism as W4c/W4e above. A manualChunks pin was tried and REVERTED: pinning the 3
// leaf files co-located their engine-core-shared transitive deps into the pinned chunk,
// which first-paint (vendor-state) then imports — pulling ~26 kB IN, strictly worse. The
// real read-model code adds 0 first-paint bytes (verified: entry chunk has zero W4h
// string-fingerprints). +1,000 covers the 440 B hoist with cross-env Rollup drift margin.
//
// The FIRST-PAINT REDUCTION PROGRAM is now HIGH-priority and must ratchet this back DOWN:
// pin the dossier/war read-model closure lazy where it is not engine-shared (a finer
// split than the leaf-pin that failed here — the deps must move too), and revisit the
// eager store slices. Build is deterministic (byte-identical across runs), so this
// ceiling is stable, not flaky.
//
// ── (2026-07-12, FP-1) THE REDUCTION PROGRAM LANDED: 1,441,000 → 1,256,000 ──
// Baseline measured 1,440,968 (32 B headroom); five seams, measured one at a
// time (`npm run build` + this closure BFS after each), every change kept only
// on a measured reduction:
//   • copy-namespace segmentation  −38,195 → 1,402,773. App.jsx was the ONLY
//     eager copy consumer and read ONLY footer.* — it now imports the eagerly
//     segmented copy/footer.js (local t(), same semantics), so copy/index.js +
//     the whole en.js registry ride lazy chunks. en.js spreads footer back in;
//     the full tree stays single-sourced for tests/linter.
//   • registry-prose split         −7,978 → 1,394,795. EVENT_REGISTRY's 38
//     description/targetPrompt strings (composer-only prose) moved to
//     domain/events/registryProse.js; registryFull.js folds them back onto the
//     same spec objects and the composer surfaces import THAT. The eager
//     pipeline (label/requiresTarget/stateDeltas/narrate) is untouched.
//   • dossier read-model split     −33,487 → 1,361,308. deriveExportPosture —
//     the ONE display derivation the eager deriveSystemState needs — extracted
//     to the dependency-free leaf domain/display/exportPosture.js (re-exported
//     by dossierViewModel). That cut the eager edge into dossierViewModel →
//     magicProfile → capacityModel (~80 kB source). This is the FINER split
//     W4h's failed leaf-pin pointed at: move the function, not the chunk pin;
//     causalState (ENGINE-SHARED) untouched.
//   • data-chunk split             −86,440 → 1,274,868. The single 'data'
//     chunk carried EVERY src/data table into first paint. vite.config now
//     derives the eager module graph (CHUNK-level: main.jsx graph + engine-
//     core spine + ENGINE_SHARED_DOMAIN + kernel + data-routed libs — a static
//     edge from any eager chunk would drag a lazy chunk back in) and routes
//     only eager-reachable tables into 'data'; the rest (namingData,
//     historyData, sample*, …) ride the new lazy 'data-lazy' chunk (~86 kB,
//     zero static imports).
//   • icon split, graph-derived    −20,898 → 1,253,970. vendor-icons now keeps
//     ONLY icons the eager module graph imports (9 at landing); the old
//     five-dir LAZY_ICON_DIRS list is retired and every other icon rides
//     vendor-icons-lazy / vendor-icons-map. iconChunkSplit.test.js's size
//     clause updated for the flipped relation (the eager chunk may now be
//     smaller than the map chunk — that is the point).
// NOT DONE, deliberately: the eager store slices (settlementSlice/aiSlice/
// campaign*) stay eager — the store is a monolithic 15-slice create() with no
// lazy-registration pattern; inventing one was out of the wave's fence
// (STOP-AND-REPORT filed). The store's event-mutation domain vocabulary
// (stressors/mutate*/region — W2b-blessed) rides with it.
// MEASURED 1,253,970 (7 chunks: data / engine-core / index / kernel /
// vendor-icons / vendor-react / vendor-state), byte-identical across
// back-to-back builds. Ceiling = measured + ~2 kB cross-env Rollup margin.
// Monotone ratchet: DOWN only, never up without a deliberate, documented
// owner-approved reason.
//
// ── (2026-07-12, FP-R) SPATIAL LEDGER CONSOLIDATION: 1,256,000 → 1,255,985 ──
// The five Phase 5.5 spatial mover ledgers (spatialArrivals, rumorLedgers,
// beliefMaps, embattlement, supplyShipments) each used to be its OWN top-level
// worldState key, enumerated as a string literal in the EAGER
// CONDITIONAL_LEDGER_KEYS array (worldState.js) — so each new mover ledger cost
// ~13-18 first-paint bytes and the array had only 17 B of headroom left, too
// little for the remaining movers M4-M10. They now nest under ONE conditional
// key, `worldState.spatialLedgers`, so the eager array carries a single name for
// the whole family and a NEW mover ledger costs ZERO first-paint bytes (it nests
// via the distanceRead.js setSpatialLedger accessor — no eager-array touch). The
// namespace is deep-cloned/dropped-when-empty exactly as the five keys were, so
// every dormant golden stays byte-identical (no fixture carries any of the five).
// Pure refactor: the accessors live in the existing lazy distanceRead.js chunk
// (the sibling of activeSpatialDigest), so NO new chunk / preload-manifest entry
// was minted — an earlier attempt that put them in a fresh module leaked ~37 B
// into the entry's __vitePreload map and undershot the reclaim (net −16 B); the
// distanceRead home recovers the full reclaim.
// MEASURED 1,255,921 (same 7 chunks), a 62 B reclaim from the pre-wave 1,255,983.
// Budget lowered 1,256,000 → 1,255,985 — locking in the reclaim while RESERVING a
// RATCHETED DOWN 2026-07-14 (1,255,985 → 1,216,350) after FP-G1: the stressors
// leaf split took the heavy evaluation machinery (stressors/stressorDynamics/
// stressorGates/foodStockpile, −51,655 B minified) out of first paint — the four
// eager consumers only ever used the light catalog surface. Measured closure at
// the ratchet: 1,216,273 (unified post-merge tip); ~77 B working margin keeps the
// house anti-brittleness posture (a Rollup chunk-graph artifact once cost +49 B).
// History: 1,441,000 → 1,256,000 (FP-1) → 1,255,985 (FP-R) → 1,216,350 (FP-G1)
// → 1,214,050 (FP-G2, 2026-07-14: the coup-contest leaf split — the contest model's
// only consumers were lazy tick modules; −2,180 B; measured 1,213,967, ~83 B margin)
// → 1,215,520 (A1-FP, 2026-07-14: the analytics transport eager-leaf/lazy-flush split
// reclaimed 2,281 B — MORE than the A1 v2-core's +1,451 B — so the wave landed net
// −830 B; measured closure 1,215,443, ~77 B working margin per house posture).
// → 1,121,903 (2026-07-15: RATCHET #9 at the W-COMPOSER-2 window close — THE REALM LIFT
// lands NET-NEGATIVE on first paint. The composer threaded only +2,500 B eager (store
// actions stageRealmVerb/updateQueuedEvent + operationRegistry rows + queueRefusalNews; the
// manifest/arms/forecast/prose/UI all lazy — the single force-as-proposal lane made the
// 14-verb lift ~5× cheaper than the per-verb precedent). Funded by FP-G7's engine-core
// over-inclusion trim: the derived ENGINE_SHARED_DOMAIN closure conservatively routed 4
// generator-only/lazy-only leaves (customCategories, magicFilter, resolveTerrain,
// region/foldTradeCategories) into eager engine-core; excised to ride the lazy engine chunk
// → −3,260 B (formatNumber DELIBERATELY LEFT IN — its ~27 lazy consumers risk shared-chunk
// churn, and the 4 sufficed). Measured closure 1,121,818 (7 files) + 85 house margin — BELOW
// the pre-composer 1,122,578: the eager-threading wave shrank first paint. Prior line:
// → 1,122,663 (2026-07-15: RATCHET #8 at the W-UPSWING window close — FP-G6 + W-UPSWING
// integrated together. FP-G6 found the ~24KB NPC-secret STRESS_INSTITUTION_EFFECTS table
// riding first paint on a single helpers.js pass-through re-export (sole real consumer =
// the lazy npcGenerator) → stressInstitutionEffects.js data-lazy leaf, −21,664 B. W-UPSWING
// threaded +948 B eager (the condition-archetype catalog — the :714 promoted-conditions
// hazard makes it structurally eager); everything else (upswingKernel, calamity bucket,
// motive terms) rides lazy. Measured closure at the close: 1,122,578 (7 files) + 85 house
// margin. Prior line:
// → 1,142,580 (2026-07-15: RATCHET #7 at the SM-3 window close — FP-G5 + SM-3 + W-GUIDE-1
// integrated together per the window-close law. FP-G5 found resourceData.js co-hauling the
// lazy-only RESOURCE_CHAINS + INDUSTRY_WATER_NEEDS tables eager → resourceChains.js
// data-lazy leaf, −7,006 B. SM-3's applyMapEdit persist action threaded +~460 B eager (the
// only store-side cost of map editing; reclaim-first honored — no raise). W-GUIDE-1 landed
// zero-eager-plus-deletions (PostGenCoach/ActionRail out). Measured closure at the close:
// 1,142,495 (7 files) + 85 house margin. Prior line:
// → 1,149,256 (2026-07-15: RATCHET #6 at the doctrine-block window close. FP-G4 found
// economicData.js dragging the 21KB TRADE_DEPENDENCY_NEEDS raw-material table eager to
// serve a 9KB finished-goods classifier → finishedGoodsCategory leaf, −12,730 B. Measured
// closure 1,149,172 + 84 house margin. Prior owner-blessed floor (1,214,050) honored by
// ~65 KB.  Prior line: → 1,161,902 (2026-07-15: SEQUENCING CORRECTION, JUDGMENT vetoable — the FP-G3
// ratchet to 1,161,810 fired MID-integration-window while the three-wave peace stack
// was known-incoming; the stack's real eager cost was +92 B of functional ledger state.
// Law clarified: ratchets bind at integration-window CLOSE. Post-merge measured
// 1,161,818 + 84 house margin. The owner-blessed floor this stretch replaced was
// 1,214,050 — every owner-signed boundary is honored by ~52 KB. Prior line:
// → 1,161,810 (FP-G3 + THE GENEROSITY VERBS, 2026-07-15 — reclaim-then-thread):
//   • the npcData split RECLAIMED −51,957 B: domain/corruption.js (EAGER, an
//     ENGINE_SHARED_DOMAIN member) was the SOLE eager importer of the 64 kB (minified)
//     data/npcData.js, reading ONLY the small TRAIT_ALIGNMENT map. TRAIT_ALIGNMENT +
//     TRAIT_AGGRESSION moved to the zero-import leaf data/npcTraitWeights.js (npcData.js
//     re-exports verbatim — byte-identical data), so npcData.js left first paint entirely
//     (closure 1,210,333 → 1,158,376).
//   • the FORCE_RELIEF / OFFER_CREDIT counterpart DM-verbs then THREADED +3,350 B eager
//     (registry lean-specs + mutateWorld handlers + the generosityGate leaf + dispatch/
//     batch/undo rows; prose + manifest ride the lazy side per the registryProse idiom;
//     closure 1,158,376 → 1,161,726) — the reclaim paid for the verbs ~15× over, NET
//     −48,607 B vs the pre-wave 1,210,333. Budget 1,214,050 → 1,161,810 (measured
//     1,161,726 + ~84 B house margin). No behavior shift; goldens byte-identical.
// → 1,066,400 (RATCHET #10 — FP-G8 + the W-R2-INTENT thread, 2026-07-16,
//   reclaim-then-thread at program scale):
//   • FP-G8 RECLAIMED −60,906 B via two engine-core over-inclusion trims (the
//     stale generator-spine eager pin — checkDraftEdit, its sole first-paint
//     consumer, went lazy waves ago — plus the settlement.schema.js leaf excise;
//     vite.config.js only, goldens byte-identical; closure 1,121,942 → 1,061,036).
//   • W-R2-INTENT then THREADED +2,796 B eager (eight intent-trust store fixes:
//     typed refusal surfacing, outbox column-set ordering, pause-window guards,
//     the placement gate, delete/rename persistence — all synchronous test-pinned
//     control flow, proven irreducible by the trim census; closure → 1,063,832).
//   • Budget 1,121,903 → 1,066,400 = measured 1,063,832 + ~2,568 B DELIBERATE
//     funded headroom for the recorded budget-blocked queue: the persist-gap
//     satellite (+596 B, §10.4, blocked since 2026-07-14), W2 feed-retention
//     (+363 B, round-21), W-R2-DEPTH (~100 B), and slack. The reclaim paid for
//     the whole queue ~15× over; NET −55,503 B vs the pre-G8 1,121,942.
// Monotone-down only; raises are owner-signed, never incidental.
// ── (2026-07-16, FP-G9) MASTER-MERGE RECLAIM — budget HOLDS at 1,066,400 ──
// The master-merge fold-in (claude/master-merge-r1) adopted master's entity-link
// consumer layer (EntityLink/DossierEntityContext/useNavigateToEntity + the
// focusedEntity uiSlice) and W6's ported store fixes — legitimate features RATCHET
// #10's budget never funded. The folded tree measured 1,069,872 (+3,472 OVER). FP-G9
// RECLAIMED 6,456 B with ONE behavior-neutral move: the eager store (mapSlice) pulled
// computeRoadEdges (+ its supplyChains dep, ~19 KB source) into first paint via a
// static import, used there ONLY for the fire-and-forget MAP_ROUTE_DRAWN analytics —
// never for state. Dynamic-imported at the call site (the settlementSlice loadEngine
// idiom); roadNetwork + supplyChains now ride the lazy map chunk (the lazy WorldMap/
// RoadsLayer surfaces already import computeRoadEdges directly). The sole observable
// shift is analytics timing (MAP_ROUTE_DRAWN fires one microtask later; the placement,
// its gate return, and MAP_PLACEMENT_ADDED all stay synchronous). Measured closure
// 1,063,416 (7 files, index 519,514 → 513,058) — GREEN with 2,984 B margin, which
// restores RATCHET #10's reserved budget-blocked-queue headroom (persist-gap +596,
// W2 feed-retention +363, W-R2-DEPTH ~100, slack). The budget is DELIBERATELY NOT
// lowered: dropping it would consume that reserved, owner-funded headroom. Goldens
// byte-identical (no lit-path change). Monotone-down only; raises owner-signed.
// RATCHET #11 (2026-07-17, FP-G10 fold): 1,066,400 -> 1,040,000. FP-G10 reclaimed
// -33,803 B (the SUPPLY_CHAIN_NEEDS table's sole eager importer severed; closure
// 1,065,000 -> 1,031,197). ~8.8KB headroom deliberately retained to fund the remaining
// build-out waves' honest registration costs (S3-S6, gallery phase 2, content); the
// FINAL tightening happens at the composite gate. Monotone-down per the constitution.
// (2026-07-21, C5 claims-parity note on the line above): the retained headroom did
// its funded job — the S/V/C build-out landed and the review composite measures
// 1,039,975 (`npm run build` on this lineage), 25 B under budget. The "~8.8KB
// headroom" is GONE (spent on exactly what it was retained for), and the remaining
// margin sits BELOW the ~85 B house working margin — so the composite-gate FINAL
// tightening now has nothing to cut: at promotion the owner either lands a reclaim
// first or re-pins budget = measured + ~85 B house margin then. Until promotion,
// treat eager Δ as HARD-ZERO for every remaining lane. Monotone-down unchanged;
// raises stay owner-signed.
//
// ── (2026-08-01, THE WAVE RECLAIM) BUDGET UNCHANGED AT 1,040,000; RED CLEARED ──
// The build waves D (CREATE_ROUTE) / F (gathered adjudication) / G (autoplacement)
// / J1 + H1 (engine ledgers) drove this ratchet RED: MEASURED 1,056,635, i.e. 16,635
// OVER, against a pre-wave 1,035,454. The budget was NOT raised (it is owner-signed
// and the C5 note above already spent the last of its headroom); the closure was
// brought back down. Two measured moves, one at a time, `npm run build` + this BFS
// after each:
//   • WAVE-D SEAM REPAIR  1,056,635 -> 1,045,523 (-11,112). domain/events/mutate.js
//     is reached statically from the store, so its MUTATION_HANDLERS table is EAGER.
//     Wave D's CREATE_ROUTE handler imported the deterministic edge id from
//     roads/userRoutes.js, which statically imports spatial/distanceRead.js — the
//     53 kB frozen-digest reader whose own docblock states it "never reaches first
//     paint". One three-line function pulled the whole derivation plus the digest
//     reader into the critical path. Cured with the house leaf extraction (move the
//     FUNCTION, not the chunk pin — the stablePart / exportPosture idiom):
//     roads/userRouteIdentity.js carries orderedRouteEndpoints + userRouteEdgeId with
//     ZERO imports, roads/userRoutes.js re-exports them verbatim so no consumer or
//     test moved, and the eager handler imports the leaf. The eager module graph
//     drops userRoutes.js AND distanceRead.js; index 602,063 -> 590,951.
//     @enforced-by tests/build/userRouteIdentityLeaf.test.js (5 layers: the leaf's
//     zero-imports contract, the handler's anchored-negative import site, a
//     main.jsx source-graph exclusion, dist absence of the derivation, and dist
//     PRESENCE of the eager handler — the pair that keeps the absence non-vacuous).
//   • FP-G16 ESD OVER-INCLUSION TRIM  1,045,523 -> 1,020,590 (-24,933). The
//     conservative generator-domain derivation routed domain/cultureProfiles.js — a
//     466-byte re-export BOUNDARY — into eager engine-core because three generators
//     import it; being an eager-graph member, it then dragged its 33 kB governed
//     corpus (data/cultureProfiles.js) into the eager 'data' chunk through the
//     derived EAGER_DATA classifier. MEASURED: no module in the true first-paint
//     graph reaches either file (every importer is the lazy engine or a lazy surface
//     — ConfigurationPanel, new/dailyLifeLogic). Excised from ENGINE_SHARED_DOMAIN
//     and pinned to engine-core-lazy — pinned, not orphaned, because an unpinned
//     excision co-locates into the big `engine` chunk (the FP-G11 formatNumber
//     incident) and makes those two UI surfaces fetch the whole generator. Placement
//     only: zero source modules changed, generator-golden-master unchanged.
//     data 125,804 -> 100,868. @enforced-by tests/build/cultureProfilesLazy.test.js.
// MEASURED 1,020,590 across the same 8 chunks — 19,410 B under the ceiling. The
// budget is DELIBERATELY LEFT AT 1,040,000 rather than re-pinned to measured + the
// ~85 B house margin: tightening it is the composite-gate/owner move the C5 note
// reserves, and this margin is what the remaining build waves' honest registration
// costs have to spend. Monotone-down unchanged; raises stay owner-signed.
// RAISE 1,040,000 -> 1,042,000 (OWNER-RATIFIED 2026-08-31, the DENS landing): the
// TE-DENSITY-1 consist is the declared cost — the density pulse seam and its shared
// vocabulary leaves (domain/density/*, eager engine-core members by the ESD
// derivation) spent the reserved margin exactly as this note anticipated honest
// registration costs would. MEASURED at the ratification: 1,041,284 across the
// closure, T12's tip green on this row, so the whole delta is the train's own.
// Monotone-down and owner-signed discipline unchanged.
//
// ── RAISE 1,042,000 -> 1,047,000 (OWNER-RATIFIED 2026-09-01, the SUBSTRATE COUPLING) ──
// THE DECLARED COST IS THE CHARACTER/FAITH SUBSTRATE'S GENUINELY-EAGER REMAINDER, AND
// "REMAINDER" IS THE LOAD-BEARING WORD: this is what is left AFTER two extractions, not
// the landing's raw overrun. The coupling measured 1,054,284 at its tip (+12,284), and
// the +12,656 against its base decomposed as 10,535 B of newly-eager modules, 1,974 B of
// growth inside already-eager ones, and 147 B of corruption.js in engine-core.
//   • REC-1 (-7,234) moved the faith causal binding — the channel→variable register, the
//     total reader, the lift and CAUSAL_SWING — into the zero-import leaf
//     worldPulse/faithChannelBindings.js, so the EAGER causalState.js stopped dragging
//     the field kernel AND worldPulse/piety.js (28,584 B, lazy since it was written).
//   • REC-2 (-681) did the same for domain/deityCommitEmbed.js, so the EAGER mutation
//     router stopped dragging deitySnapshot.js's authoring and restore halves.
//   • ⛔ NEITHER WAS CURABLE BY PLACEMENT, and that was proved by execution rather than
//     by citing FP-G17: pinning the newly-eager modules to a dedicated lazy chunk made
//     the closure 291 B WORSE, because an eager importer re-parents its own lazy chunk.
//     A genuinely-eager static edge admits only the WAVE-D cure — move the FUNCTION.
// What remains is registration cost no extraction can remove: the two leaves' own bytes,
// causalState's new deriver, mutateEntities' two new call sites, the store helpers, and
// corruption.js. MEASURED at the ratification: 1,046,369 across the same 8 chunks —
// 631 B under this ceiling, i.e. this raise funds the remainder and nothing else.
//
// ⛔⛔ THE UNRELATED RECLAIM WAS REFUSED, AND THAT REFUSAL IS WHY THIS IS A RAISE RATHER
// THAN A GREEN ROW. Wave 5 measured a 12-member ENGINE_SHARED_DOMAIN reclaim worth
// -26,546 B that would have cleared this budget in one placement-only commit, honest by
// the FP-G16 bar. It was refused because ESD is byte-identical base-to-tip: those holes
// pre-date this coupling by many landings, and spending them to absorb this landing's
// honest +12,656 would bank a baseline in which the overrun never happened — a gate that
// goes green on someone else's headroom has measured nothing. It is chartered separately
// as REC-3, each member still owing its own semantic pin (the FP-G11 law), and it is the
// owner's move, not a lane's. Monotone-down and owner-signed discipline unchanged.
//
// ── RAISE 1,047,000 -> 1,048,000 (OWNER-RATIFIED 2026-09-01, T13 TRANS — ledger §880.8) ──
// THE DECLARED COST IS THE DETERMINISTIC TRANSCENDENTAL KERNEL'S TWO GENUINELY-EAGER CALL
// SITES, AND "TWO" IS THE LOAD-BEARING WORD: of the 42 census sites remaining at this tip
// only these two sit in the first-paint graph, so this raise funds the WHOLE T13 wiring,
// not a sample of it. Both are in the settlement slice's own mutation layer, reached by
// static edges from main.jsx (traced with this config's own edge reader, ESD seeding
// removed, dynamic `import()` excluded):
//   • relationships/canonicalRelationship.js:230 — Math.log10 in the pop-tier score;
//     main.jsx -> store/index.js -> settlementSlice.js -> events/mutate.js ->
//     events/mutateWorld.js -> canonicalRelationship.js, 5 hops.
//   • domain/corruption.js:532 — Math.exp in the saturating guild grip; the same chain
//     through events/mutateEntities.js, 4 hops.
// ⛔ NEITHER WAS CURABLE BY EXCISION, and that was proved by EXECUTION rather than by
// citing FP-G7/FP-G11: both modules were added to ENGINE_SHARED_DOMAIN_EXCISIONS and the
// eager set re-derived with the config's OWN derivation — eager modules 264, UNCHANGED,
// and both STILL EAGER. They are not conservative ESD over-inclusion; they are genuinely
// first-paint-reachable, and excising them would put reachable modules on the excision
// list that tests/build/engineChunkLazy.test.js (FP-G17) exists to catch.
// "REMAINDER" IS THE OTHER LOAD-BEARING WORD — two cures were already spent before this ask:
//   • Car 1b routed detMath.js into its OWN LAZY chunk instead of the eager `kernel` chunk
//     (the settlement-normalize precedent), which is why the eager `kernel` chunk and the
//     lazy `engine` chunk are BYTE-IDENTICAL under full wiring.
//   • Car 1c's byte diet took the eager det-math core 1,188 B -> 823 B: **-321 B of closure
//     at ZERO precision cost**, every family's achieved error unchanged TO THE DIGIT
//     (exp2Det 1.96e-16, log2Det 3.94e-16, detExp 2.21e-16, detLn 4.32e-16, detLog10
//     2.22e-16, detTanh 4.59e-16, halfLifeKeep 2.17e-16, detIntPow 9.80e-15). It re-formed
//     two Horner chains as integer-divisor loops — log2Det in LOCKSTEP with detPow.js so
//     its bit-identity pin stays EXACT, never restated — and split the lazy decay wrappers
//     into det-math-decay so the eager closure stops paying for halfLifeKeep it never calls.
// MEASURED at the ratification (build #4, BOTH eager sites wired): **1,047,205** — 205 B
// over the old ceiling, **795 B under this one**. The closure is NINE members there: the
// eight that predate T13, unmoved, plus the 823 B det-math core. det-math-decay is ABSENT
// from that list, and its absence is the split working — the eager closure never pays for
// the decay wrappers. The lazy `engine` chunk measured 675,339 B, BYTE-IDENTICAL across all
// four T13 builds, so bill row 13's own owner-ratified 676,000 ceiling is untouched here.
//
// ⛔⛔ THE COMPRESSED CEILINGS ARE NOT RAISED WITH IT, AND THAT REFUSAL IS THE POINT. At the
// same measurement gzip is 332,532 / 337,000 (4,468 B spare) and Brotli 279,199 / 283,000
// (3,801 B spare) — roughly 22x and 19x this overrun. The budgets that govern what a visitor
// actually DOWNLOADS never came close, so raising them here would be exactly the INCIDENTAL
// raise the block below this constant refuses in terms.
// THE ALTERNATIVES WERE WEIGHED AND REFUSED, each on its own measurement, not on preference:
//   • the ESD excision — REFUTED above by the config's own derivation.
//   • the load-order seam — a 347 B stub at the two eager sites, the real kernel arriving on
//     first use through a dynamic import. PREDICTED ~1,046,352, about 648 B under the OLD
//     ceiling — and PLAUSIBLE, not measured. Refused because two SYNCHRONOUS store actions on
//     the "Discover channels" path would have to become async (a public store-API change,
//     owner-gated in its own right), and it mints a throw-on-early-use failure mode in the
//     mutation layer that the codebase then keeps forever — for 205 B.
//   • a platform-`Math` fallback at the two eager sites — never offered: it ships the very
//     cross-engine fork T13 exists to cure, at the two sites nearest the store.
// THE OWNER'S WORD, VERBATIM (2026-09-01, in chat, after the two options were put in plain
// terms with their costs): **"do what you recommend"** — and the recommendation on the table
// was this raise. Ledger §880.8; the seam is RECORDED AS PRICED AND NOT TAKEN, its prototype
// kept out of the tree. Monotone-down and owner-signed discipline unchanged.
const CLOSURE_BUDGET_BYTES = 1_048_000;
// Transfer budgets measure each fetched chunk independently, matching CDN
// compression rather than compressing an artificial concatenation. Recorded
// 2026-07-24 from the seven-file closure: raw 1,034,954; gzip 321,341;
// Brotli 269,548. The ~5% platform margin absorbs zlib-version variance while
// still catching a payload that is raw-small but compression-hostile.
//
// ── (2026-09-01, THE SUBSTRATE COUPLING) BOTH CEILINGS HOLD — THE RAISE WAS MEASURED
//    AND THEN REFUSED, AND THE MEASUREMENT IS WHY ────────────────────────────────────
// The wave that raised the raw budget above was chartered to raise these two with it,
// on wave 5's finding that they sat UNDER 1.9 kB from red (gzip 335,162 / Brotli
// 281,122 at the uncured tip). ⭐ THE CURES CHANGED THAT INPUT. Measured at the cured
// tip, on the same eight chunks the raw figure above comes from:
//     gzip     332,064 / 337,000   —  4,936 B of margin (1.486 %)
//     Brotli   278,569 / 283,000   —  4,431 B of margin (1.590 %)
// i.e. 2.6x and 2.4x the margin wave 5 warned about. The reason for the raise had
// evaporated by the time the raise was due, so raising anyway would have been the
// INCIDENTAL raise the line above this one forbids in terms.
// ⚠ THE OTHER TWO CANDIDATES WERE COMPUTED RATHER THAN WAVED AWAY, so a chair or owner
// who disagrees can act on arithmetic rather than re-measure:
//   • measured + the RAW BUDGET's own proportional margin (1,047,000/1,046,369 =
//     +0.0603 %) gives 332,264 / 278,737. That is a LOWERING, constitutionally free —
//     and REFUSED, because it would cut this pair's variance absorber from 1.5 % to
//     0.06 %. These ceilings' declared job is to survive a zlib-version bump; a ratchet
//     that reds on a toolchain upgrade has stopped measuring the payload.
//   • measured + this pair's OWN declared ~5 % platform margin (337,000/321,341 =
//     1.04873; 283,000/269,548 = 1.04990) gives 348,300 / 292,500. That IS a raise, and
//     it spends ~11.3 kB / ~9.5 kB of headroom no measurement asks for.
// Leaving both untouched is the only one of the three that neither spends owner headroom
// nor weakens the instrument. Monotone-down unchanged; raises stay owner-signed.
const CLOSURE_GZIP_BUDGET_BYTES = 337_000;
const CLOSURE_BROTLI_BUDGET_BYTES = 283_000;

// Parse the top-level *static* module edges out of a built chunk. Static
// edges use the `from` keyword — `import{..}from"./x.js"` and re-exports
// `export{..}from"./x.js"` — plus bare side-effect imports `import"./x.js"`.
// Dynamic imports are `import("./x.js")` (no `from`, paren-called) and are
// deliberately excluded: they're what keeps a chunk lazy.
function staticImportSpecifiers(code) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
}

// Resolve the entry chunk filename from the built index.html.
function findEntryChunk() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  return m[1];
}

// Transitive static closure of the entry: BFS over static import edges.
function entryStaticClosure() {
  const entry = findEntryChunk();
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    for (const dep of staticImportSpecifiers(code)) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return { entry, files: [...seen] };
}

// Compression at Brotli quality 11 is deliberately expensive. The gzip and
// Brotli budgets are independent laws (one may pass while the other fails), so
// they need independent tests, but re-compressing the same closure in each test
// would double the post-build gate cost. Cache one immutable measurement for
// both assertions; dist/ cannot change during a single Vitest module run.
let transferMeasurement = null;
function entryTransferMeasurement() {
  if (transferMeasurement) return transferMeasurement;
  const { files } = entryStaticClosure();
  let gzipTotal = 0;
  let brotliTotal = 0;
  const lines = [];
  for (const file of files.sort()) {
    const bytes = readFileSync(join(assetsDir, file));
    const gzip = gzipSync(bytes, { level: 9 }).length;
    const brotli = brotliCompressSync(bytes, {
      params: {
        [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
      },
    }).length;
    gzipTotal += gzip;
    brotliTotal += brotli;
    lines.push(`  gzip ${String(gzip).padStart(7)}  br ${String(brotli).padStart(7)}  ${file}`);
  }
  transferMeasurement = Object.freeze({ gzipTotal, brotliTotal, breakdown: lines.join('\n') });
  return transferMeasurement;
}

// ── VERIFY_DIST post-build anti-vacuity guard ([tests-1]/[test-quality-1]) ──
// Every dist-reading contract in this file is `describe.runIf(distExists)` and
// silently NO-OPs when dist/ is absent. That is correct in the plain `npm run
// test` run (a fresh checkout has no dist/ yet), but a GREEN-ON-NOTHING bug in
// the CI + `npm run check` POST-BUILD re-run (`npm run verify:dist` →
// VERIFY_DIST=1 vitest run tests/build/) — the run whose whole job is to verify
// the constitutional first-paint closure ratchet (law 5). That ratchet once went
// vacuous and let +293 B ride green (documented in the header above). So when
// VERIFY_DIST=1, a missing dist/ MUST hard-fail rather than skip. This `it` is
// UNCONDITIONAL — never itself gated by a runIf — so it cannot be vacated the same
// way the contracts it guards were; it reads process.env.VERIFY_DIST directly and
// only bites the post-build re-run. (This makes the ci.yml:106 comment finally
// true.)
describe('Tier 9.7 — VERIFY_DIST post-build anti-vacuity', () => {
  const requireDist = process.env.VERIFY_DIST === '1';
  it('when VERIFY_DIST=1, dist/ + dist/assets exist (post-build must verify, not skip)', () => {
    expect(
      !requireDist || distExists,
      'VERIFY_DIST=1 but dist/assets is absent — a skipped post-build chunk contract is green-on-nothing; run `npm run build` first',
    ).toBe(true);
  });
});

describe.runIf(distExists)('Tier 9.7 — vendor-pdf lazy load contract', () => {
  // ── Chunk isolation ─────────────────────────────────────────────────────
  // PRESENCE/SIZE reads: VERIFY_DIST-gated (see STALE-DIST POLICY at top).
  it.skipIf(!requireDistRead)('vendor-pdf is its own chunk in dist/assets/', () => {
    const files = readdirSync(assetsDir);
    const vendorPdfFiles = files.filter(f => /^vendor-pdf-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(vendorPdfFiles.length).toBeGreaterThan(0);
  });

  it.skipIf(!requireDistRead)('vendor-pdf chunk is large (would dominate initial bundle if eagerly loaded)', () => {
    const files = readdirSync(assetsDir);
    const vendorPdf = files.find(f => /^vendor-pdf-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(vendorPdf).toBeDefined();
    const size = statSync(join(assetsDir, vendorPdf)).size;
    // Meaningfully large (>500 KB): if it shrinks dramatically, PDF code
    // probably merged into a hot chunk. Upper bound (<3 MB): runaway growth
    // means a new dep snuck in.
    expect(size).toBeGreaterThan(500_000);
    expect(size).toBeLessThan(3_000_000);
  });

  // ── The real guard: vendor-pdf is NOT in the entry's static closure ──────
  it('entry does NOT statically import vendor-pdf (directly)', () => {
    const entry = findEntryChunk();
    const direct = staticImportSpecifiers(readFileSync(join(assetsDir, entry), 'utf-8'));
    const pdfDirect = direct.filter(f => /^vendor-pdf-/.test(f));
    expect(pdfDirect, `entry ${entry} directly imports ${pdfDirect.join(', ')}`).toHaveLength(0);
  });

  it('vendor-pdf is absent from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const pdfInClosure = files.filter(f => /^vendor-pdf-/.test(f));
    expect(
      pdfInClosure,
      `vendor-pdf reached first paint via static graph. Closure:\n  ${files.join('\n  ')}`,
    ).toHaveLength(0);
  });

  // ── The engine contract this split establishes ───────────────────────────
  // The ~656 kB (→ ~514 kB post-split) generator engine chunk must NOT be in
  // the entry's first-paint static closure. It is fetched lazily on first
  // Generate (settlementSlice's loadEngine dynamic import) and by lazy dossier
  // tabs. The entry reaches only the small kernel + engine-core chunks. If this
  // fails, an eager store/domain/first-paint-UI module statically imports a
  // heavy generator (or a domain module the generators pull that Rollup then
  // co-located into engine) — route it through kernel/engine-core/a leaf.
  // NB: the 'engine' chunk is `engine-<hash>.js`; the first-paint spine chunk
  // is `engine-core-<hash>.js` — exclude the latter explicitly.
  it('the engine chunk is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const engineInClosure = files.filter(
      f => /^engine-/.test(f) && !/^engine-core-/.test(f),
    );
    expect(
      engineInClosure,
      `the lazy engine chunk reached first paint via the static graph. Closure:\n  ${files.join('\n  ')}`,
    ).toHaveLength(0);
  });

  it.skipIf(!requireDistRead)('the engine chunk still exists (lazy) and remains large', () => {
    const files = readdirSync(assetsDir);
    const engine = files.find(f => /^engine-[A-Za-z0-9_-]+\.js$/.test(f) && !/^engine-core-/.test(f));
    expect(engine, 'expected a lazy engine-<hash>.js chunk to still be emitted').toBeDefined();
    const size = statSync(join(assetsDir, engine)).size;
    // It should stay meaningfully large (the generation pipeline lives here).
    // If it collapses, generation code leaked into a hot chunk; if it balloons
    // past this ceiling, something eager re-merged into it.
    // CEILING RAISE 660_000 -> 673_000 (owner-ratified 2026-07-26): measured
    // 670,719 after the three lazy-leaf pins in vite.config.js
    // (crossSettlementConflicts, aiLayer, formatNumber), plus ~2.3 kB of
    // cross-environment Rollup margin. NOTHING EAGER RE-MERGED — the
    // first-paint closure IMPROVED over this lane, and the closure budget
    // above is the guard that proves it. The growth is the 26 new
    // generation-critical-path modules the generation remediation added.
    // CEILING RAISE 673_000 -> 676_000 (OWNER-RATIFIED 2026-08-31, the DENS
    // landing): measured 675,323. The "something eager re-merged" diagnosis does
    // NOT apply — nothing re-merged; the TE-DENSITY-1 consist added ~700 effective
    // lines of genuinely new generation code (densityRoll, applyDensityLaw,
    // densityAscension, successionGrammar, titularSuccession) to the lazy engine,
    // where generation code belongs. T12's tip was green on this row.
    // CEILING RAISE 676_000 -> 677_000 (CHAIR RULING 2026-09-19, ODQ §934.19, OFFERED FOR
    // RATIFICATION as the two above were): measured 676,321 at the 2026-09-18 fixes consist's
    // final tip (2b0322992, lockfile-clean); the control build at the worker-headroom car's
    // consist position (96cfd7e17) read 675,865, so the +456 B are the owner's content cures
    // composed after it (the parish-church text, the food writer's published split, the
    // article-by-sound rule, the label ladder) — generation text, where it belongs. Nothing
    // eager re-merged: the first-paint closure arm above is green on the same build. The
    // ~700 B cross-environment margin the two prior raises carried is kept.
    // CEILING RAISE 677_000 -> 679_000 (CHAIR RULING 2026-09-19, ODQ §934.19 addendum 2,
    // OFFERED FOR RATIFICATION as the three above were): measured 678,131 at the EM-T2 cure
    // tip (023eda2ec); the control build at train EM-T1's green terminal (ed9d99295) read
    // 676,949, so the +1,182 B are EM-P0's pipeline seam (ODQ §934.47) — exactly TWO modules
    // moved, and they are EM-P0's two: src/generators/pipeline.js, 9,843 -> 12,548 rendered
    // bytes, and src/generators/steps/generatePopulation.js, 6,864 -> 9,702 rendered bytes
    // (the runner hands `pins` to every step and refuses a partial pin; generatePopulation
    // consults a pin at each of its four choosers on its one stream). That is generation
    // code, where it belongs. Nothing eager re-merged: the first-paint closure arm above is
    // green on the same build. The ~700 B cross-environment margin the three prior raises
    // carried is kept — 678,131 + 700 = 678,831, under this ceiling.
    expect(size).toBeGreaterThan(300_000);
    expect(size).toBeLessThan(679_000);
  });

  // ── T13 TRANS: the transcendental kernel's CHUNK PLACEMENT ───────────────
  // `src/kernel/detMath.js` replaces the 22 implementation-approximated Math
  // functions across the seeded trees. Its placement is a BUDGET decision, not a
  // taste one, and it is pinned here because the measurement that forced it is not
  // reproducible by reading the source: routed into the eager `kernel` chunk it
  // costs the first-paint closure ~2,086 B against a 995 B margin (a red, and an
  // owner-gated ceiling ask); routed into the big lazy `engine` chunk it costs
  // bill row 13 the same way, against 661 B. It therefore rides its OWN small lazy
  // chunk (the settlement-normalize / custom-schema precedent). Nothing about that
  // is visible to a reader of detMath.js, so a future lane deleting the
  // manualChunks rule as "redundant" would silently re-create a budget red.
  //
  // The SOURCE arm runs everywhere (no dist needed) and is the one that actually
  // stops the regression; the DIST arms below prove the rule does what it says.
  it('the det-math manualChunks rule is present in vite.config.js', () => {
    const config = readFileSync(join(process.cwd(), 'vite.config.js'), 'utf-8');
    // Liveness anchor first: prove we read the real config, so an empty or moved
    // read reds HERE rather than passing every absence claim below vacuously.
    expect(config).toContain("if (id.includes('/src/kernel/'))");
    expect(
      config,
      'the det-math chunk rule is gone — detMath.js would fall through to the EAGER'
      + ' kernel chunk and red the first-paint closure budget (measured: +2,086 B raw'
      + ' against a 995 B margin). Re-read the rule comment before removing it.',
    ).toContain("if (id.includes('/src/kernel/detMath.js'))");
    expect(
      config,
      'the det-math-decay rule is gone — the lazy wrappers would share the core chunk and'
      + ' the first-paint closure would pay for exp2Det/halfLifeKeep it never calls',
    ).toContain("if (id.includes('/src/kernel/detMathDecay.js'))");
    // The DECAY rule must precede the CORE rule: `detMath.js` is a substring of
    // `detMathDecay.js`'s path check only in the other direction, but the core rule's
    // `id.includes('/src/kernel/detMath.js')` does NOT match the decay file — still, the
    // order is pinned so a future reader cannot reorder them into ambiguity.
    expect(
      config.indexOf("id.includes('/src/kernel/detMathDecay.js')"),
    ).toBeLessThan(config.indexOf("id.includes('/src/kernel/detMath.js')"));
    // ORDER MATTERS: the specific rule must precede the general /src/kernel/ one,
    // or it never fires. A containment check alone would miss a re-ordering.
    expect(
      config.indexOf("id.includes('/src/kernel/detMath.js')"),
      'the det-math rule now sits AFTER the general /src/kernel/ rule, so it can never'
      + ' fire — detMath would ride the eager kernel chunk again',
    ).toBeLessThan(config.indexOf("if (id.includes('/src/kernel/'))\n"));
  });

  it.skipIf(!requireDistRead)('detMath rides its own lazy chunk, never the eager kernel chunk', () => {
    const files = readdirSync(assetsDir);
    const kernelChunks = files.filter((f) => /^kernel-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(kernelChunks.length, 'expected exactly one kernel chunk').toBe(1);
    const kernelSrc = readFileSync(join(assetsDir, kernelChunks[0]), 'utf-8');
    // THE MARKER WAS CHOSEN BY READING A REAL EMITTED CHUNK, NOT BY GUESSING AT THE
    // SOURCE. Two traps were measured and avoided. (1) Minification mangles every
    // identifier, so names are useless. (2) The obvious literal `6227020800` (1/13!) is
    // NOT present in the output at all — esbuild constant-folds `1 / 6227020800` to
    // `16059043836821613e-26` — and it is not detMath-specific anyway, because
    // `detPow.js` carries the same factorial — it DID ride this chunk the moment T13
    // Car 4 (v) gave it consumers, at a MEASURED 744 B, so it is lazy now (vite.config).
    // What survives folding AND belongs only to detMath is its log10 change-of-base constant, its underflow rail, and its Cody-Waite ln2
    // high word. Any ONE of them here means detMath leaked into first paint.
    const DET_MATH_FINGERPRINT = /3010299956639812|-1075|6931471803691238/;
    expect(
      DET_MATH_FINGERPRINT.test(kernelSrc),
      'the eager kernel chunk now carries detMath — the first-paint closure budget is'
      + ' about to red. Check the manualChunks det-math rule.',
    ).toBe(false);

    // NON-VACUITY, and it is not optional: an absence assertion over a fingerprint that
    // matches nothing passes forever. When a det-math chunk exists (i.e. some consumer
    // reaches the kernel), the SAME regex must match it — that is the proof this arm can
    // see. When no consumer exists yet the module is tree-shaken away entirely, there is
    // no chunk to check and the absence above is trivially true, which we say out loud
    // rather than dress up as a pass.
    const detMathChunks = files.filter((f) => /^det-math-[A-Za-z0-9_-]+\.js$/.test(f));
    if (detMathChunks.length) {
      expect(
        DET_MATH_FINGERPRINT.test(readFileSync(join(assetsDir, detMathChunks[0]), 'utf-8')),
        'the det-math fingerprint no longer matches the det-math chunk itself — the marker'
        + ' has rotted, so the absence check above is proving nothing. Re-derive it from the'
        + ' emitted chunk.',
      ).toBe(true);
    }
  });

  // ── The affordance manifest stays a LAZY LEAF (Composer V2 §2) ───────────
  // The manifest (domain/events/affordanceManifest.js) rides the lazy composer
  // chunk exactly like registryProse — never the eager closure. A NAMED guard
  // (not just the byte ratchet): the module embeds a sentinel string constant;
  // if any eager module ever imports the manifest, the sentinel lands in a
  // closure chunk and this fails with the culprit visible in the breakdown.
  it('the affordance manifest is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const carriers = files.filter(f =>
      readFileSync(join(assetsDir, f), 'utf-8').includes('AFFORDANCE_MANIFEST_LAZY_SENTINEL'));
    expect(
      carriers,
      `the affordance manifest reached first paint via ${carriers.join(', ')} — it must stay a lazy leaf (registryProse idiom)`,
    ).toHaveLength(0);
  });

  // ── The guidance registry stays a LAZY LEAF (W-GUIDE-1 §2) ───────────────
  // Same registryProse idiom as the affordance manifest above. NON-VACUOUS by
  // construction: the AFFORDANCE sentinel is a dead standalone `export const`
  // that Rollup tree-shakes out of the app bundle, so its absence guard proves
  // nothing. The guidance sentinel instead rides a LIVE property of the retained
  // GUIDANCE_REGISTRY object a lazy consumer (FirstDossierCallouts) reads, so it
  // survives into the lazy chunk — and we assert BOTH absence from the entry AND
  // presence in some chunk (the real non-vacuity check).
  it('the guidance registry is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const carriers = files.filter(f =>
      readFileSync(join(assetsDir, f), 'utf-8').includes('GUIDANCE_REGISTRY_LAZY_SENTINEL'));
    expect(
      carriers,
      `the guidance registry reached first paint via ${carriers.join(', ')} — it must stay a lazy leaf (registryProse idiom)`,
    ).toHaveLength(0);
  });

  it.skipIf(!requireDistRead)('the guidance registry sentinel is PRESENT in some lazy chunk (non-vacuity)', () => {
    const carriers = readdirSync(assetsDir)
      .filter(f => f.endsWith('.js'))
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes('GUIDANCE_REGISTRY_LAZY_SENTINEL'));
    expect(
      carriers.length,
      'the guidance registry sentinel was tree-shaken out of every chunk — the lazy-leaf guard above would be vacuous. Ensure a lazy consumer reads the retained GUIDANCE_REGISTRY object (FirstDossierCallouts does).',
    ).toBeGreaterThan(0);
  });

  // ── The Surveyor's-notes sidecar stays a LAZY LEAF (W-GUIDE-2 §4) ─────────
  // Same registryProse idiom as the guidance registry above. guidanceNotes.js
  // is a zero-import lazy leaf imported ONLY by SurveyorNote.jsx (mounted in the
  // lazy settlements chunk via SampleDashboard). The sentinel rides a LIVE
  // property of the retained GUIDANCE_NOTES object (noteKeyFor reads .lines), so
  // it survives DCE into the lazy chunk — assert BOTH absence from the entry AND
  // presence in some chunk (the real non-vacuity check).
  it('the guidance notes sidecar is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const carriers = files.filter(f =>
      readFileSync(join(assetsDir, f), 'utf-8').includes('GUIDANCE_NOTES_LAZY_SENTINEL'));
    expect(
      carriers,
      `the guidance notes sidecar reached first paint via ${carriers.join(', ')} — it must stay a lazy leaf (registryProse idiom); an eager import of SurveyorNote/guidanceNotes leaked it`,
    ).toHaveLength(0);
  });

  it.skipIf(!requireDistRead)('the guidance notes sentinel is PRESENT in some lazy chunk (non-vacuity)', () => {
    const carriers = readdirSync(assetsDir)
      .filter(f => f.endsWith('.js'))
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes('GUIDANCE_NOTES_LAZY_SENTINEL'));
    expect(
      carriers.length,
      'the guidance notes sentinel was tree-shaken out of every chunk — the lazy-leaf guard above would be vacuous. Ensure a lazy consumer reads the retained GUIDANCE_NOTES object (SurveyorNote → SampleDashboard does).',
    ).toBeGreaterThan(0);
  });

  // ── The generated glossary stays a LAZY LEAF (W-GUIDE-2 §6) ───────────────
  // glossary.js derives from the affordance manifest (itself a lazy leaf) + the
  // state/capacity/corruption legends; it is imported only by the lazy "what am
  // I reading?" affordance (SurveyorGlossary → HealthPip, on the lazy settlement
  // card / map surfaces). If it reached first paint it would drag the affordance
  // manifest eager with it (and blow the manifest's own guard) — so assert BOTH
  // absence from the entry AND presence in some chunk.
  it('the glossary is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const carriers = files.filter(f =>
      readFileSync(join(assetsDir, f), 'utf-8').includes('GLOSSARY_LAZY_SENTINEL'));
    expect(
      carriers,
      `the glossary reached first paint via ${carriers.join(', ')} — it must stay a lazy leaf; an eager import of SurveyorGlossary/glossary.js leaked it (and would drag the affordance manifest eager)`,
    ).toHaveLength(0);
  });

  it.skipIf(!requireDistRead)('the glossary sentinel is PRESENT in some lazy chunk (non-vacuity)', () => {
    const carriers = readdirSync(assetsDir)
      .filter(f => f.endsWith('.js'))
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes('GLOSSARY_LAZY_SENTINEL'));
    expect(
      carriers.length,
      'the glossary sentinel was tree-shaken out of every chunk — the lazy-leaf guard above would be vacuous. Ensure a lazy consumer reads the retained GLOSSARY object (SurveyorGlossary → HealthPip does).',
    ).toBeGreaterThan(0);
  });

  // ── First-paint byte budget (the monotone ratchet) ───────────────────────
  // The constitutional first-paint law (law 5). VERIFY_DIST-gated: measuring a
  // stale pre-build dist is exactly how it once went vacuous and let +293 B ride
  // green (header above). It runs ONLY post-build (`npm run verify:dist`).
  it.skipIf(!requireDistRead)(`entry static closure raw bytes stay under the first-paint budget (${CLOSURE_BUDGET_BYTES})`, () => {
    const { files } = entryStaticClosure();
    let total = 0;
    const lines = [];
    for (const f of files.sort()) {
      const sz = statSync(join(assetsDir, f)).size;
      total += sz;
      lines.push(`  ${String(sz).padStart(9)}  ${f}`);
    }
    // Surface the breakdown on failure so a regression names the culprit.
    expect(
      total,
      `first-paint static closure = ${total} bytes (budget ${CLOSURE_BUDGET_BYTES}):\n${lines.join('\n')}`,
    ).toBeLessThanOrEqual(CLOSURE_BUDGET_BYTES);
  });

  it.skipIf(!requireDistRead)(
    `entry static closure gzip bytes stay under ${CLOSURE_GZIP_BUDGET_BYTES}`,
    () => {
      const { gzipTotal, breakdown } = entryTransferMeasurement();
      expect(
        gzipTotal,
        `first-paint gzip transfer = ${gzipTotal} B (budget ${CLOSURE_GZIP_BUDGET_BYTES}):\n${breakdown}`,
      ).toBeLessThanOrEqual(CLOSURE_GZIP_BUDGET_BYTES);
    },
  );

  it.skipIf(!requireDistRead)(
    `entry static closure Brotli bytes stay under ${CLOSURE_BROTLI_BUDGET_BYTES}`,
    () => {
      const { brotliTotal, breakdown } = entryTransferMeasurement();
      expect(
        brotliTotal,
        `first-paint Brotli transfer = ${brotliTotal} B (budget ${CLOSURE_BROTLI_BUDGET_BYTES}):\n${breakdown}`,
      ).toBeLessThanOrEqual(CLOSURE_BROTLI_BUDGET_BYTES);
    },
  );

  // ── modulePreload hint (secondary check) ─────────────────────────────────
  it('index.html does NOT preload vendor-pdf', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    const preloadRe = /<link\s+rel="modulepreload"[^>]*href="[^"]*vendor-pdf[^"]*"/g;
    const matches = html.match(preloadRe) || [];
    expect(matches).toHaveLength(0);
  });
});

// ── Source-level lazy-import contract ───────────────────────────────────────
// Runs without dist/. Asserts that the components that trigger a PDF
// export use dynamic import() rather than a top-level static import,
// so the lazy chain stays intact through source-level refactors.

describe('Tier 9.7 — source uses dynamic import for PDF generation', () => {
  const lazyConsumers = [
    'src/components/SettlementDetail.jsx',
    'src/components/SingleDossierSuccessPage.jsx',
  ];

  for (const file of lazyConsumers) {
    it(`${file} uses dynamic import('.../generateSettlementPDF.js')`, () => {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8');
      // Must contain a dynamic import targeting the PDF generator.
      expect(source).toMatch(/import\(['"][^'"]*generateSettlementPDF[^'"]*['"]\)/);
      // Must NOT have a top-level static import of @react-pdf/renderer
      // (that would force the chunk into the consumer's chunk graph).
      expect(source).not.toMatch(/^import\s.*from\s+['"]@react-pdf\/renderer['"]/m);
    });
  }
});

// ── F41 — PDF render runs in a Web Worker ────────────────────────────────────
// @react-pdf's toBlob() reconcile + layout + serialization used to freeze the
// main thread for multiple seconds on a big dossier. The render now lives in
// src/utils/pdfRender.worker.js; src/utils/generateSettlementPDF.js posts the
// serializable SettlementPDF props to it and receives the Blob back. These
// source contracts pin the architecture:
//
//   1. The main-thread entry has NO static import of @react-pdf/renderer —
//      the worker carries its own bundle; the main thread touches vendor-pdf
//      only via the dynamic-import fallback (worker construction failure).
//   2. The entry constructs the worker with Vite's statically-analyzable
//      `new Worker(new URL('…', import.meta.url), { type: 'module' })` form —
//      anything else and Vite can't emit the worker as its own lazy asset.
//   3. The fallback is feature-detected (`typeof Worker`), never user-agent
//      sniffed.
//   4. The worker module imports the window shim BEFORE @react-pdf — the
//      vendor browser build reads `window.*` unguarded, and module graphs
//      evaluate dependencies in import order, so ordering IS the fix.

describe('F41 — PDF worker source contracts', () => {
  const entrySrc = readFileSync(resolve(process.cwd(), 'src/utils/generateSettlementPDF.js'), 'utf-8');
  const workerSrc = readFileSync(resolve(process.cwd(), 'src/utils/pdfRender.worker.js'), 'utf-8');

  it('generateSettlementPDF.js has NO static @react-pdf/renderer import (worker owns the render)', () => {
    expect(entrySrc).not.toMatch(/^import\s.*from\s+['"]@react-pdf\/renderer['"]/m);
    // The fallback still reaches the renderer — dynamically.
    expect(entrySrc).toMatch(/import\(['"]@react-pdf\/renderer['"]\)/);
  });

  it('generateSettlementPDF.js constructs the render worker via the Vite worker syntax', () => {
    expect(entrySrc).toMatch(/new Worker\(\s*new URL\(['"]\.\/pdfRender\.worker\.js['"],\s*import\.meta\.url\)/);
    expect(entrySrc).toMatch(/type:\s*['"]module['"]/);
  });

  it('generateSettlementPDF.js feature-detects Worker (no user-agent sniffing)', () => {
    expect(entrySrc).toMatch(/typeof Worker/);
    expect(entrySrc).not.toMatch(/userAgent/);
  });

  it('pdfRender.worker.js imports the window shim BEFORE @react-pdf/renderer', () => {
    const shimAt = workerSrc.indexOf("import './pdfWorkerShim.js'");
    const pdfAt = workerSrc.search(/import\s.*from\s+['"]@react-pdf\/renderer['"]/);
    expect(shimAt, 'worker must import ./pdfWorkerShim.js').toBeGreaterThanOrEqual(0);
    expect(pdfAt, 'worker must import @react-pdf/renderer').toBeGreaterThanOrEqual(0);
    expect(shimAt, 'shim import must precede the @react-pdf import').toBeLessThan(pdfAt);
    // And it renders the real document component.
    expect(workerSrc).toMatch(/from\s+['"]\.\.\/pdf\/SettlementPDF\.jsx['"]/);
  });

  // The worker's own module scope must stay free of dynamic import(). The
  // rationale is stated once, in src/utils/pdfRender.worker.js's docblock — it
  // is a latency contract, NOT the old build constraint (worker.format is 'es'
  // here, and townScene.worker code-splits under it, so a split PDF graph would
  // build fine). Vendored deps are the build's problem; this pins our file so a
  // future edit fails with a named culprit.
  it('pdfRender.worker.js contains no dynamic import()', () => {
    const code = workerSrc
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toMatch(/import\(/);
  });
});

// ── F41 — built worker asset (needs dist/) ───────────────────────────────────
describe.runIf(distExists)('F41 — PDF worker chunk contract', () => {
  it.skipIf(!requireDistRead)('the worker is emitted as its own asset and carries the PDF stack', () => {
    const files = readdirSync(assetsDir);
    const worker = files.find(f => /^pdfRender\.worker-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(worker, 'expected a pdfRender.worker-<hash>.js asset').toBeDefined();
    // It must actually contain the renderer — a tiny worker file would mean
    // the PDF stack silently failed to bundle in and the render will throw.
    const size = statSync(join(assetsDir, worker)).size;
    expect(size).toBeGreaterThan(500_000);
  });

  it('the worker asset is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const workerInClosure = files.filter(f => /^pdfRender\.worker-/.test(f));
    expect(
      workerInClosure,
      `the PDF worker reached first paint via the static graph. Closure:\n  ${files.join('\n  ')}`,
    ).toHaveLength(0);
  });

  it('index.html does NOT preload the PDF worker', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    const preloadRe = /<link\s+rel="modulepreload"[^>]*href="[^"]*pdfRender\.worker[^"]*"/g;
    expect(html.match(preloadRe) || []).toHaveLength(0);
  });
});

// ── WEAVE ST-2 — the goods namespace surface law ─────────────────────────────
// The goods vocabulary is split across nine physical modules and unified as a
// LOGICAL namespace: a types-only vocabulary (src/domain/goods.schema.js) plus
// two physical index surfaces. `data/resourceChains.js:1-17` states in the
// tree's own words why a single merged catalog is forbidden — "DO NOT re-export
// these from resourceData.js — an eager re-export would re-drag them into first
// paint" — and an index module IS a re-export, so the same law binds the
// surfaces. It reduces to two sentences:
//
//   • data/goods/identity.js (EAGER surface) may re-export only tables that are
//     ALREADY in the first-paint module graph. Anything else it re-exports gets
//     dragged into the closure the moment an eager consumer imports it.
//   • data/goods/chains.js (LAZY surface) may have NO importer in the first-
//     paint module graph. vite's isEagerData classifier is DERIVED from the
//     import graph, so one such edge re-classifies every chains-half table
//     (~390 kB of data-lazy) as first-paint data — against ~13 kB of headroom.
//
// This runs against source, needs no dist/, and reads the eager graph from
// vite.config.js's OWN derivation (EAGER_FIRST_PAINT_MODULES) rather than a
// replica: a replica drifts the first time that function changes, and a
// first-paint guard measuring a stale graph is the vacuous green this whole
// file exists to prevent. The mutant arm proves the reader can actually fail.
// @enforces src/domain/goods.schema.js "THE SURFACE LAW"

const GOODS_IDENTITY_SURFACE = 'src/data/goods/identity.js';
const GOODS_CHAINS_SURFACE = 'src/data/goods/chains.js';
const GOODS_IDENTITY_TABLES = ['src/data/resourceData.js'];
const GOODS_CHAINS_TABLES = [
  'src/data/resourceChains.js',
  'src/data/economicData.js',
  'src/data/tradeGoodsData.js',
  'src/data/finishedGoodsCategory.js',
  'src/data/supplyChainData.js',
  'src/data/supplyChainResourceIndex.js',
];

/** Static (never dynamic) relative import/re-export specifiers, comments stripped —
 *  the same reading vite.config.js's eager-graph walker performs. */
function goodsStaticSpecs(code) {
  const stripped = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs = [];
  for (const m of stripped.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.push(m[1]);
  for (const m of stripped.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
  return specs.filter((s) => s.startsWith('.'));
}

/** Every .js/.jsx file under src/, as repo-relative POSIX paths. */
function goodsSrcFiles(dir = resolve(process.cwd(), 'src'), out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) goodsSrcFiles(p, out);
    else if (/\.jsx?$/.test(entry)) out.push(relative(process.cwd(), p));
  }
  return out;
}

/** Resolve a relative specifier from `fromRel` to a repo-relative path, or null. */
function goodsResolve(fromRel, spec) {
  const base = resolve(dirname(resolve(process.cwd(), fromRel)), spec);
  for (const c of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')]) {
    if (existsSync(c) && statSync(c).isFile()) return relative(process.cwd(), c);
  }
  return null;
}

/**
 * THE PURE READER, so the mutant arm can drive it with a fabricated tree.
 * `sources` is a Map<relPath, code>; `isEager` is the membership predicate.
 * Returns the relative paths of eager modules that statically import `target`.
 */
function eagerImportersOf(target, sources, isEager) {
  const hits = [];
  for (const [rel, code] of sources) {
    if (!isEager(rel)) continue;
    for (const spec of goodsStaticSpecs(code)) {
      if (goodsResolve(rel, spec) === target) { hits.push(rel); break; }
    }
  }
  return hits.sort();
}

describe('WEAVE ST-2 — the goods namespace surface law', () => {
  const srcFiles = goodsSrcFiles();
  const sources = new Map(srcFiles.map((rel) => [rel, readFileSync(resolve(process.cwd(), rel), 'utf-8')]));
  const eagerRel = new Set(
    [...EAGER_FIRST_PAINT_MODULES].map((abs) => relative(process.cwd(), abs)),
  );
  const isEager = (rel) => eagerRel.has(rel);

  it('the eager graph this arm reads is non-empty and contains the entry (anti-vacuity)', () => {
    // Without this, every assertion below is green-on-nothing the day the
    // export stops resolving — the failure mode that makes a guard worthless.
    expect(eagerRel.size).toBeGreaterThan(50);
    expect(eagerRel.has('src/main.jsx'), 'the entry must be in the eager graph').toBe(true);
    expect(sources.size, 'the src/ walk found no files').toBeGreaterThan(100);
  });

  it('both goods index surfaces exist where the vocabulary says they do', () => {
    for (const surface of [GOODS_IDENTITY_SURFACE, GOODS_CHAINS_SURFACE]) {
      expect(existsSync(resolve(process.cwd(), surface)), `${surface} is missing`).toBe(true);
    }
  });

  it('the EAGER identity surface re-exports only tables already in the first-paint graph', () => {
    const reExported = goodsStaticSpecs(sources.get(GOODS_IDENTITY_SURFACE))
      .map((spec) => goodsResolve(GOODS_IDENTITY_SURFACE, spec));
    expect(reExported, 'identity.js must re-export at least one table').not.toHaveLength(0);
    const lazy = reExported.filter((rel) => !isEager(rel));
    expect(
      lazy,
      `identity.js re-exports lazy module(s) ${lazy.join(', ')} — an eager consumer would drag them`
      + ' into the first-paint closure (the resourceChains.js:1-17 law).',
    ).toEqual([]);
    // And it must not reach the lazy half by ANY name, index or table.
    const chainsReach = reExported.filter((rel) => GOODS_CHAINS_TABLES.includes(rel) || rel === GOODS_CHAINS_SURFACE);
    expect(chainsReach, 'the eager surface reached the chains half').toEqual([]);
  });

  it('NO module in the first-paint graph imports the LAZY chains surface', () => {
    const offenders = eagerImportersOf(GOODS_CHAINS_SURFACE, sources, isEager);
    expect(
      offenders,
      `first-paint module(s) ${offenders.join(', ')} import ${GOODS_CHAINS_SURFACE}. vite's isEagerData`
      + ' would re-classify every chains-half table as first-paint data (~390 kB against ~13 kB of'
      + ' headroom). Import the physical table directly, or move the consumer off the eager graph.',
    ).toEqual([]);
  });

  it('the LAZY chains surface is itself absent from the first-paint module graph', () => {
    expect(
      isEager(GOODS_CHAINS_SURFACE),
      `${GOODS_CHAINS_SURFACE} entered the eager graph — some eager module reaches it transitively.`,
    ).toBe(false);
  });

  it('MUTANT: a fabricated eager importer of the chains surface is caught', () => {
    // A control that cannot fail proves nothing. Drive the same reader with a
    // synthetic tree in which an eager module imports the lazy surface.
    const fabricated = new Map([
      ['src/data/goods/chains.js', 'export const X = 1;\n'],
      ['src/fake/eagerOffender.js', "import { RESOURCE_CHAINS } from '../data/goods/chains.js';\n"],
      ['src/fake/lazyConsumer.js', "import { RESOURCE_CHAINS } from '../data/goods/chains.js';\n"],
    ]);
    const fabricatedEager = (rel) => rel === 'src/fake/eagerOffender.js';
    const caught = eagerImportersOf(GOODS_CHAINS_SURFACE, fabricated, fabricatedEager);
    expect(caught, 'the reader failed to catch a planted eager importer').toEqual(['src/fake/eagerOffender.js']);
  });

  it('MUTANT: a DYNAMIC import of the chains surface is not counted (lazy boundary)', () => {
    // The mirror control: the reader must not fire on the one edge that is
    // legitimately lazy, or every dynamic-import consumer becomes a false red.
    const fabricated = new Map([
      ['src/fake/eagerOffender.js', "const m = await import('../data/goods/chains.js');\n"],
    ]);
    const caught = eagerImportersOf(GOODS_CHAINS_SURFACE, fabricated, () => true);
    expect(caught, 'a dynamic import was counted as a static eager edge').toEqual([]);
  });

  it('tradeLinks.js — the one eager chains-half consumer — keeps its DIRECT import (FP-G4)', () => {
    // FP-G4 split finishedGoodsCategory.js out of economicData.js precisely so
    // this single first-paint edge would stop dragging the 21 kB
    // TRADE_DEPENDENCY_NEEDS table into the closure. Routing it through the
    // chains surface would undo that split and re-eager the whole half, so the
    // exception is pinned rather than left to memory.
    const rel = 'src/domain/region/tradeLinks.js';
    expect(isEager(rel), 'tradeLinks.js is expected to be in the first-paint graph').toBe(true);
    const reached = goodsStaticSpecs(sources.get(rel)).map((spec) => goodsResolve(rel, spec));
    expect(reached).toContain('src/data/finishedGoodsCategory.js');
    // anchored: the toContain directly above pins `reached` non-empty and pins the very entry this denies drifting to, so an emptied collection reds there first
    expect(reached, 'tradeLinks.js must never route through the lazy surface').not.toContain(GOODS_CHAINS_SURFACE);
  });

  it('every chains-half table stays out of the first-paint graph except the FP-G4 leaf', () => {
    const eagerTables = GOODS_CHAINS_TABLES.filter((rel) => isEager(rel));
    expect(
      eagerTables,
      'a chains-half table entered first paint; expected only the FP-G4 finishedGoodsCategory leaf',
    ).toEqual(['src/data/finishedGoodsCategory.js']);
    // The identity half is eager by design — asserted so the two halves can
    // never quietly swap places.
    expect(GOODS_IDENTITY_TABLES.every((rel) => isEager(rel))).toBe(true);
  });
});

// ── WEAVE ST-2 — the migration roster is a WALKED artifact, not a comment ────
// A1.1.4 requires "an explicit migration roster naming which of the importers
// move where". A roster written once in a header rots the first time a consumer
// is added, and a rotted roster is worse than none — it reads as a census while
// describing a tree that no longer exists. So the roster in
// src/domain/goods.schema.js is MACHINE-READ here and every column is
// RE-DERIVED from the import graph. The table cannot drift, and it cannot be
// edited into agreement with a wrong tree: the tree is the denominator.
//
// This arm is green in BOTH states of the ST-2 build by construction — before
// the consumers move (every door reads `direct`) and after (they read
// `surface`) — because it compares the declaration to the tree rather than to a
// constant. That is the sovereigntyLightingContract design, applied here.

describe('WEAVE ST-2 — the goods migration roster matches the tree', () => {
  const VOCABULARY = 'src/domain/goods.schema.js';
  const HALF_TABLES = new Map([
    ...GOODS_IDENTITY_TABLES.map((t) => [t, 'identity']),
    ...GOODS_CHAINS_TABLES.map((t) => [t, 'chains']),
  ]);
  const SURFACES = new Map([[GOODS_IDENTITY_SURFACE, 'identity'], [GOODS_CHAINS_SURFACE, 'chains']]);
  // Namespace members with no surface door — the eslint src/data purity rule
  // bans a data module from importing the generators layer, and a data → domain
  // import would invert the layering, so these two are typed by the vocabulary
  // and imported where they live.
  const MEMBERS = new Set(['src/domain/resourceSemantics.js', 'src/generators/tradeCommodity.js']);
  const NAMESPACE = new Set([...HALF_TABLES.keys(), ...SURFACES.keys(), ...MEMBERS, VOCABULARY]);

  const srcFiles = goodsSrcFiles();
  const sources = new Map(srcFiles.map((rel) => [rel, readFileSync(resolve(process.cwd(), rel), 'utf-8')]));
  const eagerRel = new Set([...EAGER_FIRST_PAINT_MODULES].map((abs) => relative(process.cwd(), abs)));

  /** The roster the tree ACTUALLY implies: relPath → `${E|l}|${halves}|${door}`. */
  function derivedRoster() {
    const out = new Map();
    for (const [rel, code] of sources) {
      if (NAMESPACE.has(rel)) continue;
      const reached = goodsStaticSpecs(code)
        .map((spec) => goodsResolve(rel, spec))
        .filter(Boolean);
      const halves = new Set();
      let viaSurface = false;
      let viaTable = false;
      let viaMember = false;
      for (const dep of reached) {
        if (SURFACES.has(dep)) { halves.add(SURFACES.get(dep)); viaSurface = true; }
        else if (HALF_TABLES.has(dep)) { halves.add(HALF_TABLES.get(dep)); viaTable = true; }
        else if (MEMBERS.has(dep)) viaMember = true;
      }
      if (!halves.size && !viaMember) continue;
      const halfLabel = halves.size
        ? ['identity', 'chains'].filter((h) => halves.has(h)).join('+')
        : 'none';
      const door = !halves.size ? 'member'
        : viaSurface && viaTable ? 'mixed'
          : viaSurface ? 'surface' : 'direct';
      out.set(rel, `${eagerRel.has(rel) ? 'E' : 'l'}|${halfLabel}|${door}`);
    }
    return out;
  }

  /** The roster the vocabulary module DECLARES. */
  function declaredRoster(text) {
    const out = new Map();
    for (const m of text.matchAll(/^\s*\*\s*R \| ([El]) \| (\S+) +\| (\S+) +\| (\S+)\s*$/gm)) {
      out.set(m[4], `${m[1]}|${m[2]}|${m[3]}`);
    }
    return out;
  }

  const vocabularyText = readFileSync(resolve(process.cwd(), VOCABULARY), 'utf-8');

  it('the roster reader finds rows at all (anti-vacuity)', () => {
    // An empty parse would make the exact-set assertion below pass against an
    // empty tree-derived map only if BOTH were empty — but a silently-empty
    // declaration with a non-empty tree must fail loudly, and this says so.
    expect(declaredRoster(vocabularyText).size).toBeGreaterThan(20);
    expect(derivedRoster().size).toBeGreaterThan(20);
  });

  it('MUTANT: a row whose door column is wrong is caught', () => {
    const good = 'R | l | chains          | direct  | src/x.js';
    const parsed = declaredRoster(` * ${good}\n`);
    expect(parsed.get('src/x.js')).toBe('l|chains|direct');
    const mutated = declaredRoster(' * R | E | chains          | surface | src/x.js\n');
    expect(mutated.get('src/x.js')).not.toBe(parsed.get('src/x.js'));
  });

  it('every consumer in the tree is declared, with the right eager flag, halves and door', () => {
    const declared = declaredRoster(vocabularyText);
    const derived = derivedRoster();
    const missing = [...derived.keys()].filter((k) => !declared.has(k)).sort();
    const stale = [...declared.keys()].filter((k) => !derived.has(k)).sort();
    expect(
      missing,
      `goods consumers absent from the roster in ${VOCABULARY} — add a row for each:\n  `
      + missing.map((k) => `R | ${derived.get(k).split('|')[0]} | ${derived.get(k).split('|')[1]} | ${derived.get(k).split('|')[2]} | ${k}`).join('\n  '),
    ).toEqual([]);
    expect(stale, `roster rows naming files that no longer consume the namespace: ${stale.join(', ')}`).toEqual([]);
    const wrong = [...derived.entries()]
      .filter(([k, v]) => declared.get(k) !== v)
      .map(([k, v]) => `${k}: declared ${declared.get(k)}, tree says ${v}`)
      .sort();
    expect(wrong, `roster rows that disagree with the import graph:\n  ${wrong.join('\n  ')}`).toEqual([]);
  });
});

// ── ARCH car 2 — THE COMPOSED-PROSE CORPUS IS LAZY, AND ITS CHUNK HAS A ROW ───
// (ARCH-COMPOSED-PROSE §10, §12 row 2; lane MEASURE car 2.)
//
// WHAT RIDES ON THIS. The composed-prose model grows the dossier's authored corpus
// from 641,410 raw bytes over six state leaves toward a declared ceiling of about
// 2.8 MB (§10's arithmetic on measured unit costs). That is more than twice the
// ENTIRE first-paint closure this file's constitutional budget governs. The corpus
// is affordable only because it is LAZY: the leaves are imported by the six state
// desks, the desks by the lazy dossier tab components, so the whole corpus rides
// the data-lazy chunk and is fetched with the first lazy tab. If one eager static
// edge ever reaches a leaf, vite's DERIVED isEagerData classifier re-files it into
// the first-paint 'data' chunk and the closure budget goes from 5,878 B of margin to
// hundreds of kilobytes over — the FP-G16 cultureProfiles mechanism exactly, at four
// times the size. Car 2 pins that shut here, where the estate already measures it,
// rather than minting a second first-paint ruler (§11 refuses one in terms).
//
// TWO HALVES, AND THE SPLIT IS THE STALE-DIST POLICY AT THE TOP OF THIS FILE.
//   • The ABSENCE half runs UNGATED and needs no build: it reads the eager module
//     graph from vite.config.js's OWN derivation (EAGER_FIRST_PAINT_MODULES) and
//     asserts no prose leaf and no prose desk is in it. This is the half that
//     actually stops the regression, and it stops it at source-edit time.
//   • The MEMBERSHIP and SIZE half is VERIFY_DIST-gated, because it reads emitted
//     chunks and a stale dist would measure the previous build.
//
// THE FINGERPRINTS ARE DERIVED, NEVER HAND-PICKED. A pinned sentence would rot the
// first time car 8's rewrite wave touches the leaf that carries it, and a membership
// guard whose marker matches nothing passes forever. Each leaf's fingerprint is
// instead re-derived from its own source on every run: the longest quote-free,
// backslash-free `"text"` value it holds, which minification preserves verbatim as a
// string literal. Car 8 may rewrite every sentence in the estate and this arm still
// knows where the leaf landed.
const PROSE_STATE_LEAF_DIR = 'src/data/dossierStateProse';
const PROSE_CAUSAL_LEAF = 'src/data/dossierCausalProse.generated.js';

// The data-lazy chunk's ceiling is ARCH §10's corpus ceiling, carried onto the chunk
// that ships it: measured 939,520 raw at car 2's build, plus the corpus's whole
// declared growth allowance (2,800,000 - 641,410 = 2,158,590). The gzip ceiling is
// built the same way (622,222 - 121,630 = 500,592 over the measured 271,305). NO
// extra platform margin is taken and that is deliberate: the allowance is ~2.16 MB,
// three orders of magnitude past the few hundred bytes of cross-environment Rollup
// drift this file's own wave-5b note measures, so a margin here would only spend
// headroom no measurement asks for. Unlike the first-paint budgets above, these are
// NOT constitutional and NOT owner-signed — they are the model's own arithmetic, and
// scripts/.prose-byte-baseline.json is where a leaf's growth is declared row by row.
const DATA_LAZY_RAW_CEILING_BYTES = 3_098_110;
const DATA_LAZY_GZIP_CEILING_BYTES = 771_897;
// A collapse is as much a regression as a breach: if the corpus leaves this chunk it
// has gone somewhere, and the somewhere is what the membership arms then name.
const DATA_LAZY_FLOOR_BYTES = 500_000;

/** Every prose leaf on disk, repo-relative. DERIVED from the directory, so a leaf car 4
 *  projects is claimed the day it lands rather than the day someone remembers. */
function proseLeafFiles() {
  const dir = resolve(process.cwd(), PROSE_STATE_LEAF_DIR);
  const state = readdirSync(dir)
    .filter((f) => f.endsWith('.generated.js'))
    .map((f) => `${PROSE_STATE_LEAF_DIR}/${f}`)
    .sort();
  return [...state, PROSE_CAUSAL_LEAF];
}

/** The longest quote-free, backslash-free authored sentence in a leaf. Quote-free so the
 *  emitted chunk's own escaping cannot make the search miss; longest so the match cannot
 *  be an accident of common phrasing. Returns null when the leaf holds no such sentence,
 *  which the anti-vacuity arm below turns into a loud failure rather than a silent pass. */
function proseLeafFingerprint(rel) {
  const src = readFileSync(resolve(process.cwd(), rel), 'utf-8');
  const safe = /^[A-Za-z0-9 ,.:;()-]+$/;
  const texts = [...src.matchAll(/^\s*"text": "([^"\\]+)",?$/gm)]
    .map((m) => m[1])
    .filter((t) => safe.test(t));
  texts.sort((a, b) => (b.length - a.length) || (a < b ? -1 : 1));
  return texts.length ? texts[0] : null;
}

describe('ARCH car 2 — the prose corpus is ABSENT from the first-paint module graph', () => {
  const srcFiles = goodsSrcFiles();
  const sources = new Map(srcFiles.map((rel) => [rel, readFileSync(resolve(process.cwd(), rel), 'utf-8')]));
  const eagerRel = new Set([...EAGER_FIRST_PAINT_MODULES].map((abs) => relative(process.cwd(), abs)));
  const isEager = (rel) => eagerRel.has(rel);
  const leaves = proseLeafFiles();
  // The six state desks are the leaves' only product importers; the causal reader is
  // the seventh. Guarding the DESKS as well as the leaves catches the edge one hop
  // earlier, where the failure is still legible as "an eager module imports a desk".
  const PROSE_DESKS = [
    'src/domain/display/stateProse/defenseStateProse.js',
    'src/domain/display/stateProse/economyStateProse.js',
    'src/domain/display/stateProse/generalStateProse.js',
    'src/domain/display/stateProse/powerStateProse.js',
    'src/domain/display/stateProse/stressorsStateProse.js',
    'src/domain/display/stateProse/warFaithStateProse.js',
    'src/domain/display/stateProse/causalDossierProse.js',
  ];

  it('anti-vacuity: the eager graph is live and the leaf roster is non-empty', () => {
    expect(eagerRel.size).toBeGreaterThan(50);
    expect(eagerRel.has('src/main.jsx'), 'the entry must be in the eager graph').toBe(true);
    expect(leaves.length, 'the prose leaf walk found nothing').toBeGreaterThanOrEqual(7);
    for (const rel of leaves) {
      expect(existsSync(resolve(process.cwd(), rel)), `${rel} is rostered but absent`).toBe(true);
    }
    for (const desk of PROSE_DESKS) {
      expect(sources.has(desk), `${desk} is named here but no longer exists`).toBe(true);
    }
  });

  it('no prose LEAF is in the first-paint module graph', () => {
    const eagerLeaves = leaves.filter(isEager);
    expect(
      eagerLeaves,
      `prose leaf/leaves ${eagerLeaves.join(', ')} entered the eager graph. vite's isEagerData is`
      + ' DERIVED from that graph, so the whole corpus re-files into the first-paint data chunk'
      + ' against 5,878 B of closure margin (the FP-G16 cultureProfiles mechanism, four times the'
      + ' size). Find the eager importer and route it through a lazy surface.',
    ).toEqual([]);
  });

  it('no prose DESK is in the first-paint module graph', () => {
    const eagerDesks = PROSE_DESKS.filter(isEager);
    expect(
      eagerDesks,
      `prose desk(s) ${eagerDesks.join(', ')} entered the eager graph — they import the leaves`
      + ' statically, so this is the leaf breach one hop before it is visible as one.',
    ).toEqual([]);
  });

  it('NO module in the first-paint graph imports a prose leaf', () => {
    const offenders = leaves.flatMap((leaf) =>
      eagerImportersOf(leaf, sources, isEager).map((rel) => `${rel} -> ${leaf}`));
    expect(offenders, `first-paint module(s) statically import the corpus:\n  ${offenders.join('\n  ')}`).toEqual([]);
  });

  it('MUTANT: a fabricated eager importer of a prose leaf is caught', () => {
    // A control that cannot fail proves nothing. Drive the SAME pure reader the three
    // arms above use with a synthetic tree in which an eager module reaches a leaf.
    const target = `${PROSE_STATE_LEAF_DIR}/general.generated.js`;
    const fabricated = new Map([
      [target, 'export const DOSSIER_STATE_PROSE_GENERAL = {};\n'],
      ['src/fake/eagerProseOffender.js', "import { DOSSIER_STATE_PROSE_GENERAL } from '../data/dossierStateProse/general.generated.js';\n"],
      ['src/fake/lazyProseConsumer.js', "import { DOSSIER_STATE_PROSE_GENERAL } from '../data/dossierStateProse/general.generated.js';\n"],
    ]);
    const fabricatedEager = (rel) => rel === 'src/fake/eagerProseOffender.js';
    const caught = eagerImportersOf(target, fabricated, fabricatedEager);
    expect(caught, 'the reader failed to catch a planted eager importer of a prose leaf').toEqual(['src/fake/eagerProseOffender.js']);
  });

  it('MUTANT: a DYNAMIC import of a prose leaf is not counted (the lazy boundary)', () => {
    // The mirror control: the reader must not fire on the edge that is legitimately
    // lazy, or every dynamic-import consumer becomes a false red.
    const target = `${PROSE_STATE_LEAF_DIR}/general.generated.js`;
    const fabricated = new Map([
      ['src/fake/lazyProseConsumer.js', "const m = await import('../data/dossierStateProse/general.generated.js');\n"],
    ]);
    expect(eagerImportersOf(target, fabricated, () => true), 'a dynamic import was counted as a static eager edge').toEqual([]);
  });
});

describe.runIf(distExists)('ARCH car 2 — the corpus rides data-lazy, and that chunk has a row', () => {
  it('anti-vacuity: every leaf yields a fingerprint, and they are unique to their leaf', () => {
    // If the derivation stops finding sentences (a schema change, a new escaping) the
    // membership arms below would search for null and pass on nothing. Say so here.
    const leaves = proseLeafFiles();
    const sources = new Map(leaves.map((rel) => [rel, readFileSync(resolve(process.cwd(), rel), 'utf-8')]));
    for (const rel of leaves) {
      const fp = proseLeafFingerprint(rel);
      expect(
        fp,
        `${rel} yielded no quote-free authored sentence, so its membership arm would prove nothing.`
        + ' Widen the safe-character class in proseLeafFingerprint rather than dropping the leaf.',
      ).toBeTruthy();
      expect(fp.length, `${rel}'s fingerprint is too short to be distinctive`).toBeGreaterThan(40);
      const carriers = leaves.filter((other) => sources.get(other).includes(fp));
      expect(carriers, `${rel}'s fingerprint is not unique to it among the leaf sources`).toEqual([rel]);
    }
  });

  // ⛔ THE ARM IS SPLIT, AND THE SPLIT IS THIS FILE'S OWN STALE-DIST POLICY (the MEASURE fold's
  // F1, cure 4). The membership check was one `it` under `describe.runIf(distExists)`, and it
  // carried a PRESENCE limb — `if (!carriers.length) …` — which the policy at the top of this
  // file rules must be `VERIFY_DIST`-gated, because a stale dist makes a presence assertion
  // false-RED. The fingerprint is re-derived from the leaf SOURCE every run, so a source
  // rewrite moves it while the stale chunk still carries the old text: executed, `fingerprint
  // changed: true`, `does the OLD chunk contain the NEW fingerprint? false` ⇒ carriers `[]` ⇒
  // RED, with a message naming two wrong causes. `npm run check` runs `test` before `build`,
  // so the AUTHORING WAVE — the wave this instrument exists for — would have red on every leaf
  // whose prose moved. The ABSENCE half stays ungated, where a stale dist can only
  // under-report; the PRESENCE half moves behind the post-build re-run.
  const membershipFindings = (needCarriers) => {
    const { files: closure } = entryStaticClosure();
    const closureSet = new Set(closure);
    const chunks = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
    const text = new Map(chunks.map((f) => [f, readFileSync(join(assetsDir, f), 'utf-8')]));
    const eagerDataChunks = chunks.filter((f) => /^data-(?!lazy-)[A-Za-z0-9_-]+\.js$/.test(f));
    const entryChunks = chunks.filter((f) => /^index-[A-Za-z0-9_-]+\.js$/.test(f));
    const findings = [];
    for (const rel of proseLeafFiles()) {
      const fp = proseLeafFingerprint(rel);
      const carriers = chunks.filter((f) => text.get(f).includes(fp));
      if (rel === PROSE_CAUSAL_LEAF) {
        // The causal register is DARK: src/domain/display/stateProse/causalDossierProse.js
        // has no product importer at this tip, so the leaf reaches no chunk at all (a
        // measured correction to §10, which states it rides data-lazy). §12 car 13 is
        // owner-gated, "wire or retire", so BOTH states are lawful and this arm names the
        // one thing that never is: reaching first paint. Wiring it will move this row.
        //
        // ⚠ READING THE CAUSAL LEAF'S CARRIERS IS A PRESENCE READ TOO: on a stale dist the
        // day it is wired, `carriers` is empty and this limb would report the OLD build. It
        // therefore runs only in the gated half.
        if (!needCarriers) continue;
        const unlawful = carriers.filter((f) => !/^data-lazy-/.test(f));
        if (unlawful.length) findings.push(`${rel}: carried by ${unlawful.join(', ')} — a wired causal register must ride data-lazy`);
        continue;
      }
      if (!carriers.length) {
        // THE PRESENCE LIMB. Gated: a stale dist cannot carry a fingerprint derived from a
        // source it predates, and that is not a finding about the tree.
        if (needCarriers) {
          findings.push(`${rel}: reached NO emitted chunk. Either its desk lost its last importer (the corpus is dead code) or the fingerprint no longer survives minification.`);
        }
        continue;
      }
      const strays = carriers.filter((f) => !/^data-lazy-/.test(f));
      if (strays.length) findings.push(`${rel}: carried by non-data-lazy chunk(s) ${strays.join(', ')}`);
      const inClosure = carriers.filter((f) => closureSet.has(f));
      if (inClosure.length) findings.push(`${rel}: reached FIRST PAINT via ${inClosure.join(', ')}`);
      const inEagerData = carriers.filter((f) => eagerDataChunks.includes(f));
      if (inEagerData.length) findings.push(`${rel}: landed in the EAGER data chunk ${inEagerData.join(', ')}`);
      const inEntry = carriers.filter((f) => entryChunks.includes(f));
      if (inEntry.length) findings.push(`${rel}: landed in the ENTRY chunk ${inEntry.join(', ')}`);
    }
    return { findings, closure };
  };

  it('no prose leaf reaches a first-paint chunk, the entry chunk or the eager data chunk', () => {
    // THE ABSENCE HALF, UNGATED. Every finding here is "a leaf that IS somewhere it must never
    // be", which a stale dist can only under-report — the policy's own reason for leaving
    // absence checks in the plain phase, where they stop the regression at source-edit time.
    const { findings, closure } = membershipFindings(false);
    expect(
      findings,
      `the composed-prose corpus left the lazy chunk. Closure (${closure.length} files):\n  ${closure.join('\n  ')}\n`
      + `Findings:\n  ${findings.join('\n  ')}`,
    ).toEqual([]);
  });

  it.skipIf(!requireDistRead)('every prose leaf lands in a data-lazy chunk (PRESENCE: the fresh build only)', () => {
    // THE PRESENCE HALF, GATED. It reads a build taken after the current sources, so a leaf
    // whose fingerprint reaches no chunk really has lost its importer.
    const { findings, closure } = membershipFindings(true);
    expect(
      findings,
      `a prose leaf reached no data-lazy chunk in a FRESH build. Closure (${closure.length} files):\n  ${closure.join('\n  ')}\n`
      + `Findings:\n  ${findings.join('\n  ')}`,
    ).toEqual([]);
  });

  it.skipIf(!requireDistRead)(`the data-lazy chunk stays under its raw ceiling (${DATA_LAZY_RAW_CEILING_BYTES})`, () => {
    const chunks = readdirSync(assetsDir).filter((f) => /^data-lazy-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(chunks.length, 'no data-lazy chunk was emitted — the corpus went somewhere else').toBeGreaterThan(0);
    let total = 0;
    const lines = [];
    for (const f of chunks.sort()) {
      const size = statSync(join(assetsDir, f)).size;
      total += size;
      lines.push(`  ${String(size).padStart(9)}  ${f}`);
    }
    expect(total, `data-lazy raw = ${total} B, under the floor:\n${lines.join('\n')}`).toBeGreaterThan(DATA_LAZY_FLOOR_BYTES);
    expect(
      total,
      `data-lazy raw = ${total} B against the ceiling ${DATA_LAZY_RAW_CEILING_BYTES}:\n${lines.join('\n')}`,
    ).toBeLessThanOrEqual(DATA_LAZY_RAW_CEILING_BYTES);
  });

  it.skipIf(!requireDistRead)(`the data-lazy chunk stays under its gzip ceiling (${DATA_LAZY_GZIP_CEILING_BYTES})`, () => {
    const chunks = readdirSync(assetsDir).filter((f) => /^data-lazy-[A-Za-z0-9_-]+\.js$/.test(f));
    let total = 0;
    const lines = [];
    for (const f of chunks.sort()) {
      const gzip = gzipSync(readFileSync(join(assetsDir, f)), { level: 9 }).length;
      total += gzip;
      lines.push(`  gzip ${String(gzip).padStart(8)}  ${f}`);
    }
    expect(
      total,
      `data-lazy gzip = ${total} B against the ceiling ${DATA_LAZY_GZIP_CEILING_BYTES}:\n${lines.join('\n')}`,
    ).toBeLessThanOrEqual(DATA_LAZY_GZIP_CEILING_BYTES);
  });
});

// ── ARCH car 2 — THE THREE FIRST-PAINT CEILINGS ARE BYTE-UNTOUCHED ───────────
// §12 row 2's acceptance and §13 row 17 both say it: this design raises none of the
// three constitutional budgets. They are pinned to their literals here so a car that
// moves one has to move this pin in the same commit, which makes a raise a deliberate,
// reviewable act rather than a diff nobody reads. Raises stay owner-signed; the long
// ratification histories above each constant are the record of what that costs.
describe('ARCH car 2 — the three first-paint budgets stay where the owner signed them', () => {
  it('the raw, gzip and Brotli closure budgets are unmoved', () => {
    expect(CLOSURE_BUDGET_BYTES, 'the raw first-paint budget moved').toBe(1_048_000);
    expect(CLOSURE_GZIP_BUDGET_BYTES, 'the gzip transfer budget moved').toBe(337_000);
    expect(CLOSURE_BROTLI_BUDGET_BYTES, 'the Brotli transfer budget moved').toBe(283_000);
  });
});
