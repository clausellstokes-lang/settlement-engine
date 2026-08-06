---
name: ""
metadata:
  node_type: memory
  title: "FOLD PASS 2 EXECUTED — V-K + V-F + V-J folded into composite-r4"
  date: 2026-07-20
  tags:
    - fold
    - composite-r4
    - vision-wave
    - fold-law
    - anyCast-owner-gated
    - contention-flake
  branch: claude/composite-r4
  base: 5d9218c6
  tip: dbbc6fb6
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T19:27:35.346Z
---

# FOLD PASS 2 — V-K + V-F + V-J into claude/composite-r4

⭐ Folded three fold-ready lanes into composite-r4. Base 5d9218c6 (pass-1 quintuple
fold), **tip dbbc6fb6**. NOT pushed (owner-gated). 8 commits, working tree clean.

## The commits (in order)
- `0ee0c9e1` Fold: vision-k (b0f1dbe6) — assize + commons, engine-dark. CLEAN merge (9 files).
- `7eae9a8b` Fold: vision-f (c15c2311) — session ledger / auspice / DM screen. CLEAN merge (27 files, git region-merged the shared registries).
- `1d581ea7` Fold seams (V-F) — mounted ChroniclersLetterPanel + OraclePanel in DmScreen slots.
- `cf4fa74c` Fold: vision-j (3f3805b7) — prerender + SEO meta-shell. ONE conflict (routes.js viewToPath union).
- `4b992cc3` Fold seams (V-J) — vercel.json afterFiles rewrites (/gallery + /world/:code → meta-shell).
- `7278331f` Fold fixes — deepCraftKillList ceilings re-pinned (borderRadius 101→104, tintedCallouts 164→167).
- `36c2d695` Fold fixes — slugify defect-class cure in assizeKernel + regen analyticsEventsBundle.
- `dbbc6fb6` Fold fixes — disposition V-K's kernels in the .npcs (roadsParticipation §8) + .institutions (ruinFilter) census ratchets.

## FOUR structural/census ratchets tripped by V-K+V-F's new src/domain files (focused-gate blind spots — the "new domain file trips FOUR ratchets" hazard, exactly)
1. **anyCast** → owner-flagged (frozen ceiling; see below). NOT fixed.
2. **slugify** (`36c2d695`) → cured: assizeKernel uses canonical ladderFactionKey(), not a hand-rolled `fac.${slug}`.
3. **roadsParticipation §8 .npcs census** (`dbbc6fb6`) → assizeKernel + commonsVoiceKernel dispositioned into EXPECTED (raw-roster readers, flag-gated + dormant; the ratchet's intended "widen the belt").
4. **ruinFilter .institutions census** (`dbbc6fb6`) → assizeKernel.hasJusticeVenue routes through isLiveInstitution (a ruined courthouse is no venue) → COMPLIANT. Behavior-dark-safe.
Deterministic ratchet sweep (46 files / 305 tests = all of tests/lint + tests/design + walkers) is GREEN except the 2 anyCast tests.

## Closure (THE FOLD LAW — measured per merge; ceiling 1,040,000)
- baseline≈V-K: 1,036,408 (headroom 3,592) — V-K Δ0 eager as documented.
- after V-F (+seams): 1,037,885 (headroom 2,115) — Δ +1,477.
- after V-J (+seams): **1,038,364 (headroom 1,636)** — Δ +479, exactly V-J's documented eager delta. FINAL. No breach at any step.
- measure-closure.mjs (scratchpad) replicates vendorPdfLazy.test.js entryStaticClosure() exactly.

## Seams applied
- V-F letter/oracle SLOT MOUNTS: DmScreen now renders `<ChroniclersLetterPanel campaign={activeCampaign}/>`
  (both faces — it reformats the public wizardNews chronicle, no secret content; verified) and
  `<OraclePanel campaign={activeCampaign}/>` (DM-only). Removed the SlotPlaceholder helper + dead theme imports.
- V-F WORKER TRANSPORT SWAP = **NO-OP (verified, VETOABLE)**: the live campaign advance ALREADY rides
  runAdvanceInterval via V-D's harness in campaignWorldPulseSlice (base). V-F's only advance call is the
  auspice, which uses forecastRun.simulatePendingFuture (the pure sync forecast) and whose OWN recorded seam
  says "The sync path is v1; do not depend on the worker." forecastRun is SHARED with the docket, so forcing a
  worker swap there is out of scope + contradicts the recorded design. Treated as already-satisfied/deferred.
- V-F import→wall unification = STANDING PASS-3 SEAM (waits on V-G, per brief). Not attempted.
- V-J vercel.json rewrites: `/gallery→/api/meta-shell?gallery=1` + `/world/:code→/api/meta-shell?worldCode=:code`,
  before the SPA catch-all, after the existing /gallery/:slug. /gallery stays OUT of prerender (306 docs; 13 views
  + 293 compendium — more views than V-J's isolated base because covenant/bounty/first-hundred/roadmap/world are now
  indexable). Sitemap REGENERATED (336 URLs; byte-match pin green). meta-shell fetches served index.html + injects
  meta, so real browsers boot the SPA. get_unlisted_dossier (V-E, mig 168) is in base → unlisted path live.

## ⚠️ OWNER DECISION PENDING (the one non-parked red left in the gate)
`tests/lint/domainAnyCastBaseline.test.js` is RED. V-K + V-F's SIX new src/domain files add 32 any-holes (the
house **Mut idiom**, matching 72 already-baselined sibling worldPulse kernels) against `CEILING = 2252` with only
10 B margin → total 2242→2274 (over by 22). Both lanes breach INDEPENDENTLY (V-K +12, V-F +20) — a pre-existing
lane-quality item the lanes' focused gates skipped, NOT a composition defect. The ceiling is emphatically
owner-frozen ("NEVER raise, even via --update") — deliberately NOT raised, and NOT patched mid-fold (22 disparate
holes = a deliberate type burn-down lane, not a fold patch). **RESOLUTION IS OWNER'S:** (a) one-time ceiling raise
2252→2274 as an adoption event [historically precedented: 1247→1720→2291], updating tests/lint/.domain-any-baseline.json;
OR (b) a dedicated type-tightening lane on the 6 files. Files+counts: tableLedger.js 11, assizeKernel.js 11 (now
12 after the slugify cure added one cast), auspice.js 5, dmScreen.js 2, temperamentPresets.js 2, commonsVoiceKernel.js 1.

## Composition-defect fixes made (both surfaced by the full suite, both focused-gate blind spots)
1. **slugify defect class** (`36c2d695`): V-K's assizeKernel.js hand-rolled the faction key inline at 2 sites
   (`fac.${name.toLowerCase().replace(/[^a-z0-9]+/g,'_')}`) → cured to canonical `ladderFactionKey()` (the exact
   builder npcInFaction matches; shared with ladder+religion reads). Removes it from the slug-idiom inventory
   (36==36, ceiling HONORED not widened). Behavior-neutral for the default sim (assize flag-dark; assizeDormancyGolden
   byte-identical, proven) and correct-er active (the inline ignored faction.id + used nameOf not factionName).
2. **stale edge bundle** (`36c2d695`): V-F added the 'table-event' EditKind → analyticsEventsBundle regenerated via
   `npm run build:edge-shared` (a generated file — reconciled, not hand-edited). ⚠️ build:edge-shared ALSO re-stamps
   aiGroundingBundle.meta.json's `generatedAt` even when its sourceHash is unchanged — REVERT that spurious timestamp.
3. **deepCraftKillList ceilings** (`7278331f`): borderRadius 101→104, tintedCallouts 164→167 for V-F's new
   at-the-table UI. Manager-vetoable re-pin (pass 1 did the same 100→101/161→164); owner-vetoable = de-round instead.

## ⚠️ CONTENTION-FLAKE HAZARD (banked — bit HARD this session)
The two-shard suite is UNRELIABLE under the owner's parallel sessions. A shard-1 re-run hit **load average 229/410**
(36 node procs) and produced 35 "failures" (937s vs a clean 185s) — ~30 pglite security tests + component mounts
(homeLanding/realmHub/settlementsPanel.smoke) + timing tests + even the DETERMINISTIC rawColorLiteral (worker-crash
under contention). ALL were load flakes: the fold touches NONE of those surfaces (git-diff-proven), and every one
re-verified GREEN in isolation (rawColorLiteral 12/12, advancePauseResume 9/9). RULE: at load >~30, treat pglite/
component/timing reds as contention; re-verify red files in ISOLATION (memory says `--no-file-parallelism` for pglite)
and by non-intersection with the fold's changed files BEFORE calling anything a fold defect.

## Green gate receipts (AUTHORITATIVE clean-load two-shard, load ~5-30)
- strict 0 · full tsc 0 · lint 0 (29 changed source files) · closure 1,038,364 GREEN · verify:dist 28/191 · NUL clean all merges.
- **Shard 1/2 (174s): 7044 passed / 3 failed** = anyCast(2, owner-flagged) + beliefMapGolden(1, parked).
- **Shard 2/2 (251s): 7939 passed / 3 failed** = generatorGoldenMaster + worldpulseDeityGolden + goldenViewModel (all parked).
- The FOUR parked golden families at composite-r4 = beliefMapGolden, generatorGoldenMaster, worldpulseDeityGolden,
  **tests/pdf/goldenViewModel** (defense.scoreAvg 63→65, headcounts.institutions 54→55). ⚠️ goldenViewModel is
  PROVEN PRE-EXISTING at base 5d9218c6 (ran it in a throwaway worktree — IDENTICAL diff; the fold changes ZERO
  generation-pipeline files). NOTE: this set REPLACES V-K's memory's `pipeline.property` (that was base 212758ad;
  the set shifted at composite-r4 — pipeline.property is GREEN here).
- V-K 168 tests (29 dormancy goldens byte-identical + pins) · V-F 80 pins · V-J sitemap/build pins ·
  advancePauseResume 9/9 isolated · sampled shard-flaked pglite 41/41 isolated.
- **NET: the fold introduced ZERO new goldens and ZERO new real reds — only the anyCast ceiling (owner decision),
  a pre-existing lane-quality item both lanes carry independently.**

## Hazards specific to a successor
- The name-swap chain on the FROZEN pulseKernel is intact: pulseKernel imports
  `advanceNpcGrowthWith…AndRoadsAndCommonsAndAssize` (assizeKernel wraps the prior roads chain). Never add a pulseKernel block.
- Migration head stayed 168 (none of the three lanes minted one — verified).
- measure-closure.mjs lives in the session scratchpad; the authoritative closure test is vendorPdfLazy.test.js (CLOSURE_BUDGET_BYTES=1_040_000).
