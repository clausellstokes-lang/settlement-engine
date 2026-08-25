# TE-SEAM receipt — the band-seam two-truths defect (ODQ §625.2 R1)

Lane: TE-SEAM (Fable survey seat, re-dispatch after the context-break loss). MEASURE-ONLY — no edits, no commits, no refs moved. No worktrees were created; all reads via `git show`/`git grep` at the pinned SHAs.
Date: 2026-08-24. SHAs under measure: **build slot `e4ed27f48`** · **register seal `93fa8a2ca`** (= refs/preserve/map-sandbox-reg3-shapes). Evidence scripts and extracted modules: `$SP/demo/` (kept as receipt evidence).

## 0. Headline

The defect is real and it is **not two truths — it is FOUR classifier sites in three value-families**, plus one guarded mirror. The register seal's fabric classifier (`tierForPopulation`) disagrees with the landed engine classifier (`popToTier`) across **pop 5001–8000** (city vs town) and **25001–40000** (metropolis vs city), and the disagreement is not merely cosmetic: the fabric's high-water law reads the engine's correct tier stamp as a **recorded demotion**, invents a peak population the settlement never had, and renders a healthy city with demotion dressing (deficit up to 0.375). Separately, two map-side inline chains (`TierIcon.jsx`, `mapSlice.js`) disagree with everything else across **pop 241–400** (village vs hamlet), at BOTH SHAs — that half ships today.

## 1. Definition-site table (CONFIRMED — read at both SHAs)

| # | Site | slot e4ed27f48 | seal 93fa8a2ca | thorp | hamlet | village | town | city | metropolis |
|---|------|----------------|----------------|-------|--------|---------|------|------|------------|
| A | `src/data/constants.js` — `POPULATION_RANGES` (:7-14) + `popToTier` (:26-35) | present | present, **values byte-identical** (only the magic-licence ladder differs between SHAs — verified by `git diff`) | ≤60 | ≤400 | ≤900 | ≤5000 | ≤25000 | >25000 (max 100000) |
| B | `src/domain/townMap/fabric/tierGrammar.js` — `TIER_PROFILE` (:320-325) + `tierForPopulation` (:514-521) | **file does not exist** | present | ≤60 | ≤400 | ≤900 | **≤8000** | **≤40000** | >40000 (max 200000) |
| C | `src/components/map/TierIcon.jsx` :25-29 (inline chain) | present | present, identical | ≤60 | **≤240** | ≤900 | ≤5000 | ≤25000 | >25000 |
| D | `src/store/mapSlice.js` :819-824 (inline chain → `settType`) | present | present, identical | ≤60 | **≤240** | ≤900 | ≤5000 | ≤25000 | >25000 |
| E | `src/domain/townCartography/cartographyTuning.js` — `MULTIPLICITY.POPULATION_SPAN` (slot :404-408, seal :263+) | present | present | mirrors A exactly at both SHAs — **and is the only GUARDED mirror**: `tests/domain/townCartographyBuildings.test.js:350` ("POPULATION_SPAN mirrors POPULATION_RANGES exactly, both ways") exists at the slot | | | | | |

Drift between the SHAs: A, C, D, E are value-identical at both. **B exists only at the seal** — the W3-fresh sandbox (single squashed preserve commit `ee0db96d3`; per-value archaeology is closed from this ref) authored the second town/city/metropolis truth. The seal also **lacks** the engine-side `src/domain/highWater.js` (284 lines at the slot, truth A) and lacks the E-guard test file — the seal's 16 test files use tierGrammar as their own oracle (`townMapFabricBuildOut.test.js:20,887` imports `tierForPopulation` itself), so **no test at the seal can red on this drift**.

Two self-contradictions inside the seal's own artifacts (basis for "drift, not deliberate re-band"):
- `tierGrammar.js:510-512` claims `tierForPopulation` is "the local spelling of the landed popToTier" — false at 5001–8000 and 25001–40000.
- `fabric/compile.js:115` publishes the provenance receipt `put('tier-occupancy', scale.tier, 'popToTier(population)', 'derived')` — the shipped register provenance NAMES popToTier while carrying tierForPopulation's answer.
- Also `tierGrammar.js:453-454` quotes §161f's law as "a 5,000-soul town and a 5,001-soul city wear near-identical frames" — the file's own prose still remembers the landed 5000 boundary its table abandoned.

## 2. Reader→truth table

| Surface | Entry point (file:line) | Truth | Present at |
|---------|------------------------|-------|-----------|
| Engine advance — lifecycle promote/demote | `src/domain/worldPulse/settlementLifecycleKernel.js:956-965` (POPULATION_RANGES mins), `settlementLifecycleFirstClass.js`, `calamityKernel.js` (`popToTier(afterDeaths - exodus)`), `tierOutcomeApply.js`, `demographicsLadder.js` etc. | **A** — the stored `s.tier` is stamped and moved by truth A | both |
| Engine events / DM tier shifts | `src/domain/events/mutateEntities.js:28,917` | **A** (stored tier first, `popToTier` fallback) | both |
| Genesis / generators | `src/generators/steps/resolveConfig.js`, `lookups.js`, `helpers.js` | **A** | both |
| Engine high water → undercity | `src/domain/highWater.js:56,186,274` (truth A), consumed by `src/domain/undercity/{colonization,connectivity,monotoneComponents,sewerDerivation}.js` | **A** | slot only |
| townMapDraw painter (via model) | `src/domain/townMap/townMapModel.js:38,391` — stored `s.tier` first, else `popToTier` | **A** family | both |
| townCartography painter | stored-tier index (`cartographyTuning.js:46-54`) + `POPULATION_SPAN` mirror (site E, guarded) | **A** family | both |
| Fabric-fed register path | `fabric/buildFabric.js:36,165` → `tierScale()` → `tier`/`extentTier` published at :835-838; consumed by `epochAxis.js:135,271`, `institutions.js:361,693`, `leafCensus.js:98,106`, `measure.js`, `immersion.js:245`, `circuitDemotion.js:114`, wear grade at `buildFabric.js:86` | **B** — and NOTE: `tierScale():661-663` has a vestigial conditional whose branches are IDENTICAL (`tierForPopulation(current)` both ways); the stored engine tier is consulted only inside `deriveHighWater` as a demotion signal | seal only |
| Wizard | `src/components/ConfigurationPanel.jsx:3,45` (`POPULATION_RANGES` per chosen tier; custom pop cap 500000), `GenerateWizard.jsx:216` (`tier: cfg.settType`) | **A** | both |
| Compendium | `scripts/generate-compendium-data.mjs:53,481-482` | **A** (the printed source reference values, e.g. Thorp 20-80, diverge DELIBERATELY and are documented at :23 — not part of this defect) | both |
| Realm-map icons + thumbnails | `TierIcon.jsx:25-29` → `PlacementsLayer.jsx`, `mapThumb.js` | **C** (hamlet≤240) | both |
| Realm-map settType records | `mapSlice.js:819-824` | **D** (=C) | both |
| Prerender | `scripts/prerender-routes.mjs` — no popToTier/POPULATION_RANGES import found | stored tier (A family) — PLAUSIBLE | both |
| PDF export / dossier | no direct classifier import found in export components or `scripts/.pdf-field-manifest.json` | stored tier (A family) — PLAUSIBLE (not traced to the printed field) | both |

## 3. Divergence demonstration (CONFIRMED — executed)

Method: the REAL modules extracted verbatim (`git show '93fa8a2ca:...'` → `$SP/demo/constants.mjs`, `$SP/demo/tierGrammar.mjs`; tierGrammar has zero imports so it runs standalone), truth C reproduced verbatim from `TierIcon.jsx:25-29`. Runner: `$SP/demo/seamDemo.mjs`, exit 0. Real output:

```
pop      A:popToTier   B:tierForPopulation   C:TierIcon/mapSlice   agree?
241      hamlet        hamlet                village               <<< DISAGREE
400      hamlet        hamlet                village               <<< DISAGREE
5001     city          town                  city                  <<< DISAGREE
6500     city          town                  city                  <<< DISAGREE
8000     city          town                  city                  <<< DISAGREE
25001    metropolis    city                  metropolis            <<< DISAGREE
40000    metropolis    city                  metropolis            <<< DISAGREE
```
(all values outside the three windows agree; full table in the demo output)

The false-demotion consequence, real output from the seal's own `deriveHighWater`/`tierScale`:

```
engine-stamped city, pop 6500 (healthy, never shrank)
  engine truth A says: city (stored tier 'city')
  fabric occupancyTier (truth B): town   extentTier: city
  highWater: population=8001 tier=city demoted=true deficit=0.1876
  evidence: ["stored tier 'city' over a town-scale population — a recorded demotion"]

engine-stamped metropolis, pop 30000 (healthy)
  fabric occupancyTier (truth B): city   extentTier: metropolis
  highWater: population=40001 tier=metropolis demoted=true deficit=0.2500

engine-stamped town, pop 4900 (healthy control)
  fabric occupancyTier: town   extentTier: town   demoted=false deficit=0.0000  (negative control clean)
```

What visibly breaks (seal register path, windows 5001–8000 and 25001–40000):
1. **A city banded as a town** — occupancy tier 'town' drives town morphology on the register leaf: square kind 'market' not 'market-plural', blockDepth 2 not 3, organisms 4–6 not 7–9, accentBand 0.78 not 0.58, town grain — while dossier, wizard, compendium, realm map all say city. Exactly ODQ §625.2 R1's named failure mode.
2. **Invented peak + false demotion dressing** — `deriveHighWater` asserts peak = TIER_PROFILE floor of the stored tier (8001 / 40001), a population the settlement NEVER HAD. `demoted=true` whenever current < 0.92 × invented peak (cities 5001–7360, metropolises 25001–36800): wear grade takes the deficit (`buildFabric.js:86`), wall-circuit retention halves (`circuitDemotion.js:114`, ×0.55), `immersion.js:245` engages §12.8 ghost fabric, and the extent is sized/graded at the invented peak — a healthy 30,000-soul metropolis renders with a quarter of its fabric as high-water elegy. This INVERTS the charter: §161g's elegy instrument, built to honor real demotions, fires on healthy settlements as a direct arithmetic consequence of the seam.
3. **The provenance receipt lies** — `compile.js:115` publishes the occupancy tier as derived by 'popToTier(population)'.
4. Window 241–400 (both SHAs, ships today): realm-map icon and settType say village while every other surface says hamlet — cosmetic tier mismatch between the realm map and the dossier.
5. At the D3a port (future): engine `highWater.js` (truth A) and fabric `deriveHighWater` (truth B) will coexist — undercity extent (A) and surface extent (B) can then disagree about whether the same settlement is demoted.

## 4. Classification under the hazard-conversion law

**MACHINERY.** A structural fix is identifiable and its precedent already exists in this repo: site E is a mirror of the same table, guarded by a producer-equality both-ways test (`tests/domain/townCartographyBuildings.test.js:350` at the slot). The cure is single-spelling plus that exact guard pattern extended to every mirror; nothing about this defect requires accepting residual risk. (Basis: the seal's own comments assert equivalence with the landed classifier — the divergence is drift against the file's own stated contract, not a signed re-band; a signed world re-band would be an owner-gated tuning decision and would have to move truth A, not fork it.)

## 5. Cure options, ranked (recommend only — the chair rules)

**R1 (recommended): canonicalize truth A's thresholds; fabric keeps a GUARDED local mirror.** tierGrammar deliberately avoids importing generation-side modules into the render-time projection (same bounded-closure law as CR-TC3B-BYTES at site E), so the cure is the site-E pattern, not an import edge:
- (a) Make the fabric's classifier step on A's thresholds. Two sub-shapes for TIER_PROFILE:
  - (i) **Split the roles**: add explicit classifier thresholds mirroring POPULATION_RANGES (guarded), keep `TIER_PROFILE.pop` as grading anchors only IF the chair rules the 8000/40000 anchors were deliberate fabric tuning. Cheaper, but a 6,500 city then grades at bandPosition 0 of the city anchors — flat grading in the seam windows.
  - (ii) **Reconcile `TIER_PROFILE.pop` to POPULATION_RANGES exactly** (town [901,5000], city [5001,25000], metropolis [25001,100000]). One table, one truth — cleaner; but every interpolated quantity (footprint, organisms, grain roofs above village) moves at town+ tiers: a broad same-seed shift across the corpus register, and the GRAIN_BAND measurements ("measured, 10 seeds/tier at 6b337fb1", `tierGrammar.js:351`) were taken under B's bands — a re-measure bill at the seam windows.
- (b) `TierIcon.jsx:26` and `mapSlice.js:820`: hamlet 240→400 (one line each; or import `popToTier` outright — no bounded-closure constraint on those surfaces). Can land on the build branch NOW as a small car, independent of the register arc.
- (c) The ratchet: producer-equality both-ways assertions for every remaining mirror (tierGrammar classifier; E already guarded). ⚠ a NEW test file bills three censuses at landing (memory law) — prefer adding cases to an existing fabric test file.
- (d) Fix the `compile.js:115` provenance string, and delete the vestigial identical-branch conditional at `tierScale():661-663`.
- **Blast radius**: fabric/register surfaces only; zero engine, save, dossier, compendium, wizard movement; stored tiers untouched (THE PROMISE untouched). **Declared-shift candidate: YES** — same-seed register leaves change in windows 5001–8000 / 25001–40000 (tier morphology corrects, false demotion dressing disappears, extents re-derive from real peaks) plus interpolation movement under (ii); realm-map icons shift for pops 241–400 under (b). Declare once, cause stated: "band-seam cure, false demotion removed". Note the legitimate-demotion path also shifts: a REAL demoted city's step-1 floor drops from 8001 to 5001, so genuine elegies shrink slightly.
- **Where in the register arc**: truth B is sandbox-only, so the seam ships exactly when the D3a port lands the fabric onto the build branch. The cure must ride IN the sandbox line before the port completes, or as a car within the port itself — never after, and the port review should treat `tierForPopulation ≡ popToTier` as a gate check. Part (b) precedes the arc entirely.

**R2: fabric trusts the stored `s.tier` for occupancy.** Rejected — destroys the high-water instrument (`stored tier vs derived tier` IS the demotion signal, `tierGrammar.js:561`); §161g's elegy machinery would go blind. The vestigial conditional suggests this was started and abandoned.

**R3: canonicalize B — re-band the world to 8000/40000.** Rejected; listed for completeness. It moves engine advance, lifecycle promotions, every stored tier in every lived save (THE PROMISE: lived history immutable), compendium, wizard, PDF. If the chair actually wants fatter bands, that is a tuning-signature decision for the tuning pass (which is LAST by the endgame order) and must not ride the register arc.

## 6. Residue
- PDF and prerender tier sources labeled PLAUSIBLE (stored tier) — not traced to the printed field; a one-hour trace if the chair wants it CONFIRMED.
- The sandbox's squashed preserve history closes archaeology on whether 8000/40000 was chosen deliberately; if intent matters, the sandbox lane transcripts (`subagents/*.jsonl` route of record) are the remaining source.
- `TIER_PROFILE` metropolis max 200000 vs `POPULATION_RANGES` max 100000 vs wizard custom-pop cap 500000 (`ConfigurationPanel.jsx:343`) — three different ceilings; advisory today (everything above the city threshold classifies metropolis) but worth one ruling.
- The compendium's printed source reference values (Thorp 20-80) diverge deliberately and are documented (`generate-compendium-data.mjs:23`) — explicitly NOT part of this defect.
- The seal's test suite is self-referential on tier bands (uses tierGrammar as its own oracle) — the guard in R1(c) is the only thing that can make this class red.
- Scratchpad hygiene: an early Write in this lane went to a typo'd sibling scratchpad dir (`...9edf-1c32d073e393`); it was removed the same minute. Evidence kept: `$SP/demo/{constants.mjs,tierGrammar.mjs,seamDemo.mjs}`.
