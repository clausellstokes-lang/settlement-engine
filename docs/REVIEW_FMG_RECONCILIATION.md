# REVIEW_FMG_RECONCILIATION — SettlementForge vs upstream Azgaar FMG (2026-08-29)

**Comparative review ordered by the owner at ODQ §727: "if any of our progress was convergent yet they did it better — more elegantly, more cohesively, more comprehensively, more variably — we should consider emulating or reconciling their finer points." Six Fable lanes (workflow `wf_23ff38dc-070`: five study lanes over upstream FMG @ fresh clone, our fork `sfdrop16`, and our simulator at build tip `73f5dfc02`, then a synthesis). ASSESSMENT ONLY — nothing here is chartered until the owner selects candidates. FMG is MIT: approach emulation is unrestricted; verbatim copying requires notice preservation (precedent `public/map/LICENSE-FMG.txt`). The synthesis follows; the five study reports are appended verbatim and carry the receipts.**

---

# COMPARATIVE REVIEW — SettlementForge vs upstream Azgaar FMG (SYNTHESIS)

Basis: five study reports (FMG-PHYS, FMG-ANTHRO, FMG-NET, SF-REALM, SF-SIM). Every file:line below is quoted from a report; nothing new was read. Ranking weight: cross-lane convergence first (independent lanes flagging the same mechanism), then herald/map visibility per effort. A structural fact that bounds everything: **every candidate below is an engine-side or bridge-side port — none requires re-vendoring the fork**, which matters because SF-REALM confirmed the upstream restructure has invalidated the `docs/fmg-fork.md` upgrade procedure entirely (see §6).

---

## 1. TOP EMULATION CANDIDATES (ranked by product value)

**1. Markov-chain name generation** — flagged #1 independently by FMG-NET and SF-SIM.
- Theirs: syllable-segmenting Markov chain per name-base corpus, cached, with per-base length/duplication rules and culture→base indirection (`src/generators/names-generator.ts:18-151`, bases `src/data/name-bases.ts:1-44`, ~130 lines, no deps).
- Ours: flat 30×30 prefix×suffix pools per 9 cultures (`src/data/namingData.js:5-70`; drawn at `src/domain/worldPulse/settlementLifecycleKernel.js:358-377`) — ≤900 combos per culture, one cadence, seam-visible.
- Wins on: **variability + cohesion** (unbounded fresh-but-phonotactically-consistent names; names appear on every product surface).
- Reconciliation: pure `src/domain/naming/` module; chain build is pure string work at load; draws from a keyed PRNG fork (`naming:<cultureKey>:<entityId>`), never their ambient `Math.random` (`names-generator.ts:235`). Train on corpora **we author** under our 9 culture keys — EUROPEAN_FANTASY_BASE is satisfied by corpus choice; FMG's non-European bases simply aren't imported. Deploy dormant: existing settlements keep their names forever (lived history immutable); flag gates genesis + lifecycle foundings; existing pools remain the absent-flag path, byte-identical.
- Effort **M**. Risk: same-seed name shift if lit on the generation path → dormant-first, new-worlds-only, declared golden shift. MIT attribution if chain code or bases are copied.

**2. Road topology — Urquhart supergraph + corridor-reuse/burg-attraction costs** — flagged by FMG-NET, SF-REALM, and SF-SIM.
- Theirs: per-landmass Urquhart graph (Delaunay minus each triangle's longest edge, `routes-generator.ts:243-285, 385-466`) plus two cost modifiers — ×0.5 on already-routed cell-pairs, ×3 off-burg (`routes-generator.ts:287-301`) — with shared-stretch segment splitting (`:337-363`).
- Ours: Prim MST over city+ placements (`src/lib/roadNetwork.js:240-284`) — a tree, zero cycles, one path per pair; each edge A*-routed **independently** (`public/map/sf-bridge.js:626-676`), producing parallel near-duplicate polylines.
- Wins on: **variability** (organic loops that survive interdiction — our own `routeNetworkConsumersInterdiction.js` consumers gain real alternatives), **cohesion/elegance** (trunk highways emerge from ~15 lines).
- Reconciliation, two tiers: (a) **S** — thread a connections set + non-burg multiplier through `settlementEngine:computeRoadNetwork` in deterministic edge order; render-only, deterministic per fixed edge list. (b) **M** — Urquhart edges as an additional pure candidate source in `routeNetworkGenesis.js` / the digest edge set, under a `SPATIAL_GEOMETRY_VERSION`/costLawVersion bump — spatialDigest §V.1 (`spatialDigest.js:95-97`) exists precisely so this is a discrete re-canonize, never silent drift. Keep our semantic edge selection (hostile suppression, typed reasons) untouched — FMG has nothing like it.
- Risk: (a) drawn-map visual shift, declared; (b) canon-affecting → version bump, new worlds by default. MIT attribution for the ~40-line Urquhart extraction if copied.

**3. River magnitude capture + navigability banding** — FMG-PHYS's own #1 priority; corroborated by FMG-NET (upstream's navigable-river routing).
- Theirs: per-river discharge/width/`isNavigable = flux ≥ 100` (`river-generator.ts:167-411, 646-649`).
- Ours: `r[]` consumed as a **boolean** — `spatialCost.js:148` riverBias, and `seaLanes.js:20-22` counts any `r≠0` as river frontage, so a mountain creek and a great navigable river are indistinguishable to port eligibility and trade.
- Wins on: **comprehensiveness** — the magnitude already exists in the iframe (`cells.fl`) and dies at the capture boundary.
- Reconciliation: add `fl`/`pack.rivers` to `getSpatialPack` (`sf-bridge.js:875-901`); band at canonize into `stream|river|great_river` (cut at their MIN_NAVIGABLE_FLUX 100); gate river-port eligibility on `river ∧ navigable` in `buildSeaLanes`. Frozen at canonize under existing re-canonize discipline.
- Effort **S**. Risk: newly-canonized worlds only; re-deriving an existing canon under the new law is a discrete owner-visible event (FMG-PHYS's explicit flag).

**4. Proper nouns for the herald — route names + war names** (FMG-NET #4 + FMG-ANTHRO F4).
- Theirs: route naming grammars with anchor-burg adjectivization (`routes-generator.ts:26-172, 852-874`; `src/utils/languageUtils.ts:32-169`); war names + weighted campaign nouns (`states-generator.ts:457-478, 584`).
- Ours: zero minted route names (`routeNetworkGenesis.js` grep-zero; `roadsProse.js` says "the ${dest} road"); wars have typed reasons/receipts and **no proper noun anywhere** (grep-zero, CONFIRMED).
- Wins on: **comprehensiveness + cohesion** — "seized by brigands on the Tarnford Way" is exactly the NEWS ADDRESS LAW register.
- Reconciliation: routes — closed typed grammar keyed to our 9 cultures, keyed PRNG on the stable pair key, behind a dormant `routeNamesEnabled` (adding names to existing ledger rows is a byte shift). Wars — a pure display-side deriver, function of (participants, warReason type, tick) over authored templates; finite-semantics clerk, zero engine state, zero risk. Write our own adjectivization (theirs is English-only).
- Effort **S each**. Risk: war names none; route names dormant-gated.

**5. Genesis diplomacy bootstrap with suzerain-closure** (FMG-ANTHRO #2 pick).
- Theirs: adjacency-class weighted relation tables, area-ratio vassalization, vassals inheriting the suzerain's whole relation row (transitive closure), and 1-2 believable opening wars (`states-generator.ts:488-671`).
- Ours: a fresh instant realm opens diplomatically cold (`worldPlan.js:174-222` seeds sites/per-settlement seeds only — **PLAUSIBLE**, composer unread).
- Wins on: **variability + elegance at t=0** — the first-five-minutes world.
- Reconciliation: deterministic genesis pass in the instantWorld composer — k-nearest adjacency (the ratified `autoplacement.js:88-89` idiom), tier-ratio vassalization, weighted tables from the plan's forked PRNG, suzerain-closure; optional opening war under `dramatic_campaign` tone. Writes only the *starting* world ⇒ THE PROMISE holds.
- Effort **M**. Risk: new plans only. **Verify the PLAUSIBLE gap before building** — the composer may already seed edges.

**6. Captured climate → typed per-settlement seasonal band** — convergent between FMG-PHYS (F2/F5) and SF-SIM (§4.4).
- Theirs: temperature from latitude+altitude (`temperature-generator.ts:13-37`), wind-advected precipitation (`precipitation-generator.ts:27-96`), template→latitude coupling (`coordinates.ts:12-56`).
- Ours: SEASONS-A amplitude is an authored 7-entry terrain-word table (`seasons.js:77-85`); `mapKind` influences climate nowhere — a volcano realm and a pangea run identical seasons.
- Wins on: **cohesion** — our bucket's source is thinner than a derivation sitting one iframe away.
- Reconciliation: extend `getSpatialPack` with `grid.cells.temp/prec` (via `pack.cells.g`); band at canonize into typed `climate: harsh|standard|mild` modifying `SEASONS_TUNING`, stored under the existing opt-in sub-digest idiom (`spatialDigest.js:245-265, 554-560`). Cheap fallback: one authored per-mapKind modifier table.
- Effort **S-M**. Risk: capture-side + dormant ⇒ old canons byte-identical; when lit, seasonal outputs shift for mapped settlements → declared, dormant-first. No conflict: banding keeps finite semantics; the full latitude/wind model stays out (see §3).

**7. Ledger-fed marker registry + event footprint overlays** (FMG-NET #7+#8).
- Theirs: declarative marker config — selector + legend-writer per type, lock-survival (`markers-generator.ts:41-56, 75-94, 126-160`); zone cell-footprints, some reading real campaign state (`zones-generator.ts:58-80`).
- Ours: markers are user annotations only (`src/components/map/MarkersLayer.jsx:1-18`); calamities/wars are addressed semantically but paint nothing spatial.
- Wins on: **comprehensiveness/legibility — with an ours-better twist**: their battlefields are decorative fiction; ours would be fed from *real* ledgers (war engagements, `believedRazings.js`, faith records).
- Reconciliation: adopt the declarative-registry *shape*, feed it from canon; footprints as seeded flood-fills from event ids. Derived render layer, recomputable from canon, no persisted state ⇒ dodges the regen hazard class entirely.
- Effort **M**. Risk: none to canon.

**8. Derived territory partition view** (FMG-ANTHRO's #1; corroborated by SF-SIM §2b).
- Theirs: one priority-flood mechanism reused five times — `totalCost = p + 10 + cellCost/expansionism` with budget cap (`states-generator.ts:282-350`), layer composition (own-culture discount `:325`), and enclave-dissolving normalize passes (`:352-369`).
- Ours: no cell-level political/cultural territory anywhere; the realm plate draws no territory (`realmPlateRenderer.js:17-31`).
- Wins on: **cohesion + elegance** for the one thing we lack — a political territory *view*; later unlocks their wild-province remainder sweep (`provinces-generator.ts:189-207, 304-319` — "every cell accounted for, remainders named honestly").
- Reconciliation: pure RNG-free module over `realm/placementRaster.js` cells — settlement seeds, tier as the expansionism analog, autoplacement terrain-fit costs, budget so wilderness stays unclaimed, their normalize pass as exactly the hygiene our "marks in open country" and thin-ring lessons demand. Consumed as realm shading + adjacency prior for #5. Derived-view-only ⇒ PROMISE-safe, dormant.
- Effort **M-L**. Risk: none to canon; requires placement-assertion censuses per program law.

**9. Sea-route drawing — haven constraint + coast-graded water costs** (FMG-NET #3, SF-REALM).
- Theirs: ports must exit via their haven cell (`routes-generator.ts:315-331, 365-377`), distance-from-shore cost tiers (`:16-22`), sea-temp impassability (`:14, 326`).
- Ours: `seaCost` = 1.2 shallow / 0.9 deep and nothing else (`sf-bridge.js:678-684`) — lanes clip a port's own headland.
- Wins on: **comprehensiveness at the drawing tier** (our seaLanes *semantics* — hazards, dormancy — stay ours-better).
- Reconciliation: read `pack.cells.t` and `pack.cells.haven`, both already in the vendored pack, in the bridge's water cost. No engine change, no new state.
- Effort **S**. Risk: render-only visual shift, declared.

**10. Lake typology sub-digest** (FMG-PHYS F3).
- Theirs: subtype as a derived consequence of a water budget — `frozen|dry|salt|freshwater…` (`features.ts:334-346`, budget `lakes.ts:49-126`, outlet creation `river-generator.ts:190-223`).
- Ours: no engine-side lake concept; all water IMPASSABLE (`spatialCost.js:194-197`).
- Wins on: **comprehensiveness** — and, notably, their derivation style *is* our finite-semantics idiom (closed vocabulary from arithmetic).
- Reconciliation: canonize-time flood-fill of captured `h<20` non-border components (we hold `h`+`c`), freeze typed `{cells, shoreline settlementIds, subtype}`; consumers exist today (`steadingTopography.js:165` desert_salt lean).
- Effort **S-M**. Risk: dormant opt-in slot; MIT if the Penman line is copied.

**11. Randomize-unless-locked + realm-pyramid jitter** (FMG-NET #9).
- Theirs: gaussian world knobs with per-option locks (`options.js:599-616`, `world-configurator.ts:48`).
- Ours: fixed REALM_SIZES pyramids behind 3 knobs (`worldPlan.js:37-95`) — no "keep my tone, surprise me otherwise."
- Reconciliation: (a) seed-derived jitter of pyramid bands in `worldPlan.js`; (b) per-knob "keep this" pins in the wizard, UI-state only. Effort **S**; plans only, no lived-world risk. The 3-knob front door itself stays (ours-better, §2).

**12. Headless heightmap DSL + derived coastline — the big variability prize** (FMG-PHYS F1+F6).
- Theirs: 10-op template DSL, 14 weighted templates, resolution-adaptive, ranges-as-distributions (`heightmap-generator.ts:11, 502-575`; `heightmap-templates.ts:158-173`); fractalized coastlines + distance-field ocean rings (`coastline-generator.ts:11-60`, `ocean-generator.ts:21-88`).
- Ours (headless surface only — the iframe already renders theirs): two scalars per mapKind and a 24-ray jittered blob that cannot express a peninsula, strait, or archipelago (`realmPlateRenderer.js:92-101, 177-194`).
- Reconciliation: port the ~600-line interpreter as pure `(template, gridGraph, prng) → Uint8Array` — must thread `kernel/prng.js` (upstream reseeds **global** `Math.random`, `heightmap-generator.ts:552` — forbidden), parameterize the two DOM reads, keep template strings verbatim (MIT). Coast = march the land/water boundary into our draw-op vocabulary; their cosine roughness needs authored tables (realm-plate trig ban, `realmPlateRenderer.js:33-39`).
- Effort **L**. Risk: feature-dormant, headless-only; iframe untouched ⇒ no same-seed world moves. Ranked last of the majors on value-per-effort, not on ceiling.

**Smaller steals (one line each):**
- **Faith `origins` lineage DAG** (`religions-generator.ts:966-1018`) — typed provenance field on deity/creed records; structure only, DEITY DOCTRINE bars their name-pool content; **S**; PLAUSIBLE that we lack one (modules unread).
- **Two-endpoint-per-water-body port invariant** (`burgs-generator.ts:283-291`) as a sea-trade sanity check — **S**.
- **Suitability-informed wizard defaults** — derive suggested tier/resources/tradeRouteAccess from the placed cell's captured pack data (SF-SIM §4.1-4.3); derivation feeds the choice, the frozen enum stays sacred — **S-M**; also chips at seam S3 (§6).
- **Goods catalog unification** — their single typed deposit→recipe→demand→price record shape (`goods-generator.ts:6-40`) vs our 5-file split; pure refactor, no behavior change — **M**.
- **Area-quantile prominence ladder** (`states-generator.ts:683-691`) for realm-hierarchy labels — **S**; European-subset forms only.
- **Pipeline-as-data for `composeInstantWorld`** (their `generation-pipeline.ts` idiom) — matches our §718 replayable-derivation doctrine; settlement pipeline already has this (parity per FMG-PHYS F8) — **S-M**.
- **Generative heraldry with kinship inheritance** (`emblems-generator.ts:222-252`, `burgs-generator.ts:378-384`) — vassal banners quartering the liege's charge is high-value world-legibility, but **L** and **OWNER-GATED** (new capability vs repair, per standing carve-outs).

---

## 2. OURS-BETTER — do not emulate, do not regress

- **Determinism hygiene** (all four study lanes, categorically): keyed PRNG forks + stable iteration vs their global `Math.random = Alea(seed)` monkey-patch and in-generator DOM reads — never port their RNG or DOM plumbing into any candidate above.
- **Living tick kernel + byte-exact feature dormancy** — FMG is one-shot; its regeneration deliberately reseeds from fresh entropy (`states-generator.ts:103`).
- **Causal explainability substrate** (causalState/capacityModel/receipts/spine) — FMG stores scores and cannot answer "why."
- **Belief layer / no omniscient actors** (`conquestFeasibility.js` zero-imports-by-test) vs their single shared diplomacy truth.
- **Diplomacy/war lifecycle** (coalitions, treaties, peace terms as documents) — their matrix is minted once and read only by the military generator.
- **Religion dynamics** (ratcheted pantheon, hysteresis tiers, per-tick containment) vs one-shot expansion.
- **Hazards as lifecycled conditions** vs static painted zones (their zone list is worth a vocabulary completeness check only — PLAUSIBLE gaps: tsunami/avalanche/fault).
- **Port law: geography ∧ institution** (`seaLanes.js:14-28`) vs geometric-only ports.
- **Autoplacement anti-star web objective** vs their quadtree spacing.
- **Pipeline lifecycle rigor** (version axes, dormancy oracles, reserved-slot digest discipline `spatialDigest.js:106-121`) — no upstream equivalent.
- **Three-knob front door** — deliberate design over forty sliders; only the lock *device* transfers (#11).
- **Economy in motion** (flows, entrepots, supply chains, trade wars) vs their static market snapshot.
- **Regen preservation** — their lock/recreate machinery ≈ our `regenerationPreservation.js`; comparable maturity, no adoption either direction.

---

## 3. DIVERGENT — deliberately not ours

- **Full latitude/winds/globe climate** — sub-century scope + EUROPEAN_FANTASY_BASE; we simulate time's consequences, they derive geography. (#6 takes the banded output, not the model.)
- **Substrate-derives-everything cell raster** — typed buckets frozen at canonize are constitutional (finite semantics, THE PROMISE), not a gap.
- **Lock-and-reroll regeneration philosophy** — answers "reroll pieces"; our byte-dormancy answers "never change shipped bytes" — the stricter, correct contract for THE PROMISE.
- **One-shot backstory wars/chronicle prose** — our history is lived, not painted.
- **Premade deity/meaning name pools** — DEITY DOCTRINE forbids the content outright; only the compositional structure is adoptable.
- **Geography-determined culture types** — ours are authored, setting-agnostic identity; inference is acceptable only as a UI placement suggestion.
- **Non-European name bases and culture-keyed state forms** (Khanate/Shogunate/Caliphate…) — outside EUROPEAN_FANTASY_BASE morphology.
- **Submap/resample geometry transforms** — no product surface today; if realm zoom ever lands, `resample.ts`'s family-walk is the reference checklist for our most-bitten bug class (the write that survives one path and ghosts another).
- **3D/satellite/erosion/label-solver/Electron** — map-tool features orthogonal to the simulation thesis.

---

## 4. LICENSE NOTE

MIT attribution (precedent: `public/map/LICENSE-FMG.txt`) is required wherever code or data is **copied verbatim** rather than re-derived: the heightmap interpreter + template strings (#12), the Markov chain and any imported name bases (#1), the Urquhart edge extraction (#2), the Penman evaporation formula (#10), and the emblems data tables (heraldry, if gated in). Approach emulation is unrestricted. `spatialCost.js`'s BIOME_COST is already a documented verbatim port from the vendored fork. Asset caveat (SF-REALM): only the pruned 104 CC0 charge files may ship — upstream's full charge set and new textures must never ride along with any future re-vendor.

---

## 5. COVERAGE HONESTY

- **Nothing was executed by any lane.** Every "CONFIRMED" means read-and-cited source lines; no goldens, diffs-at-runtime, or dynamic checks ran. All reconciliation sketches are PLAUSIBLE designs by definition.
- **Unread upstream (all lanes):** renderers, controllers, tests; markers beyond ~250/1721 lines; emblems data tables; the economy layer's internals beyond SF-SIM's 40-100-line samples — the *existence* of goods/markets/production is CONFIRMED, their quality is PLAUSIBLE.
- **Unread ours:** ~95% of worldPulse file *bodies* (159,723 lines — rosters + heads only; per-file mechanism claims beyond quoted heads are PLAUSIBLE); UI/Herald/dossier/townMap layers; the 672KB fork bundle (symbol-scanned/grep-probed only); `sf-origin.js`; the ~30-file `routeNetwork*` family in depth (skimmed).
- **PLAUSIBLE claims that gate specific candidates:** #5's "diplomatically cold at genesis" (composer unread — verify first); the missing faith-lineage record; thin t=0 folk-faith substrate; cultures-layer never read by any bridge handler; whether `resolveSeeds` would catch wrong-but-valid stale cellIds (S2 — not executed); the F9 corollary that *other* upstream quirk-fixes exist beyond the documented one; missing tsunami/avalanche/fault condition archetypes (catalog not enumerated).
- Fork-drift claims rest on cited docs and tree comparison, not a bundle diff.

---

## 6. OUT-OF-SCOPE FINDINGS THE OWNER SHOULD SEE (not emulation items; they bound the calculus)

- **F9 tripwire (FMG-PHYS, CONFIRMED):** upstream *fixed* the lake-shore bug our fork deliberately preserves (`grid-generator.ts:186-188` vs our `public/map/main.js:862`) — any re-vendor silently shifts every same-seed coastline and everything downstream of `t`, and the runbook's diff step will not flag it (it is an upstream shift, not a patch site).
- **Structural drift (SF-REALM, CONFIRMED):** the upstream TypeScript restructure invalidates `docs/fmg-fork.md`'s upgrade procedure and its cost model; the new `regenerateMap(reason?)` signature would silently ignore our seed — the exact H10-class failure the fork fixed once. The next re-vendor is a rebuild-and-reapply or a decision to stay pinned. All §1 candidates were chosen to be independent of this.
- **SF-REALM's five seams (S1-S5)** — terrain edits never reaching the sim (no `fmg:terrainChanged` listener), stale placement cellIds at capture, the terrain-enum-vs-geography double truth, drawn roads vs digest truth unreconciled, and iframe-hostage re-canonize — are internal repairs that arguably outrank several emulation candidates on product value; candidates #2 and the suitability-defaults steal partially address S4 and S3 respectively.

---

# APPENDIX FMG-PHYS (study lane report, verbatim)

# LANE FMG-PHYS — Physical world generation: upstream FMG vs SettlementForge

**Materials note (affects every citation):** the "fresh clone" upstream is Azgaar's *restructured* codebase — physical generation now lives in TypeScript under `src/generators/` + `src/data/`, orchestrated by a declared pipeline (`src/generators/generation-pipeline.ts`), not the old `modules/*.js`. Our vendored fork (`ours/public/map/`, rev sfdrop16) is a drop from the same lineage: its physical core is compiled into `index-Bp79q281.js` (grep-confirmed to contain `temperatureEquator`, `resolveDepressions`, `openNearSeaLakes`), with `config/heightmap-templates.js` content-identical to upstream `src/data/heightmap-templates.ts` (diff run; whitespace/wrapper-only differences). So on the iframe surface we already *are* them, one drop behind; the real comparison is against our **headless engine** (`ours/src/domain/**`), which consumes FMG only through a frozen capture of `{h, biome, r, p, c}` (`public/map/sf-bridge.js:874-898` `settlementEngine:getSpatialPack`; `src/domain/spatial/spatialDigest.js:298+`). All paths below are relative to the two study roots.

---

## F1. Heightmap template DSL — variability machinery

**WHAT THEY DO (CONFIRMED):** World shape is a 10-op string DSL — `Hill | Pit | Range | Trough | Strait | Mask | Invert | Add | Multiply | Smooth` (`src/generators/heightmap-generator.ts:11`, dispatcher `addStep` :502-543, interpreter `fromTemplate` :561-575) — with 14 authored templates carrying random-pick weights (`src/data/heightmap-templates.ts:158-173`, e.g. `continents: {probability: 16}`), plus PNG precreated heightmaps (`fromPrecreated` :586-612) as a second input mode. Op behavior is resolution-adaptive via `blobPower`/`linePower` lookup tables keyed on cell count (:24-61), so one template reads the same at 1k or 100k cells. Count/height args are ranges ("`5-6`", "`20-30`") resolved per run — one template is a *distribution* of worlds.

**WHAT WE DO (CONFIRMED):** Iframe path: same machinery; `sf-bridge.js:83-104` curates 6 single-landmass templates and *authors our own* (`SF_ARCHIPELago_TEMPLATE`, 7 DSL lines, registered with `probability: 0`) — proof the DSL composes for us already. Headless path: `src/domain/realmMap/realmPlateRenderer.js:92-101` reduces each mapKind to **two scalars** (`KIND_TERRAIN = { highIsland: { rough: 0.28, mounts: 4 }, … }`), producing a 24-ray jittered blob coast (:177-194); `src/domain/instantWorld/worldPlan.js:82-92` treats mapKind as an opaque label passed to the iframe.

**VERDICT: THEY-BETTER (variability, elegance)** — for the headless surface only. Fourteen-plus world shapes expressed as *data* against our seven shapes expressed as two scalars; the DSL is also exactly our house idiom (a closed op vocabulary interpreted deterministically — cf. our townMap draw-op list).
**Reconciliation sketch:** port the ~600-line interpreter into `src/domain/` as a pure function `(templateString, gridGraph, prng) → Uint8Array` — the port must (a) thread our `kernel/prng.js` explicitly (upstream reseeds the *global* `Math.random = Alea(seed)`, `heightmap-generator.ts:552` — ambient, forbidden by seeded-purity), (b) parameterize the two DOM reads (`getSelectedId` :546-548; `resolveDepressions`'s `document.getElementById` read at `river-generator.ts:428`), and (c) keep the existing template *strings* verbatim (MIT attribution per `public/map/LICENSE-FMG.txt` precedent — this is copying, not emulation). Feature-dormant behind the instant-world/realm-plate lane; the iframe's own generation is untouched, so no same-seed world moves.

---

## F2. One substrate → many layers — derivation cohesion

**WHAT THEY DO (CONFIRMED):** One heightfield drives everything, in a *declared* pipeline (`src/generators/generation-pipeline.ts:6-47`): heights → feature markup (ocean/lake/island + a signed distance-to-coast field `t`, `features.ts:90-141`) → deep-depression lakes + near-sea lake breaching (`grid-generator.ts:171-262`) → map-on-globe latitude box (`coordinates.ts:69-83`) → temperature (latitude+altitude, F5) → precipitation (winds over the same heights, F5) → coastal-densified re-graph (`pack-generator.ts:27-50` — deep-ocean points dropped, coast points doubled) → rivers (flux from precipitation, F4) → biomes (temp × moisture matrix, below) → ice (`ice-generator.ts:34+`: glaciers where `temp ≤ −8`, icebergs where `≤ 0`) → relief icons (`relief-generator.ts:26-40`: biome icons below h 50, mount/mountSnow above 70 by temperature). There is even an `ErasePipeline` (:60-99) — the exact re-derivation subset for heightmap edits. Biome assignment itself is a 5×26 moisture×temperature matrix plus override rules (`biomes-generator.ts:81-87`, `getId` :131-140: `<20` marine, `<−5°` glacier, `≥25° ∧ dry ∧ !river` hot desert, wetland test :142-147) with river-fed moisture (`define` :112-121: `moisture += max(flux/10, 2)` on river cells) and per-biome habitability/cost tables (:47, :64).

**WHAT WE DO (CONFIRMED):** The chain stops at the iframe wall. Engine captures `{h, biome, r, p, c}` only — **no `temp`, no `prec`, no `fl`, no features, no rivers list** (`sf-bridge.js:884-895`). From it we derive one number per cell (`spatialCost.js:139-150`: `BIOME_COST[b] × elevMult + riverBias`) and the digest (territory/distances/gates/receipts, `spatialDigest.js:362-580`). Everything else is typed-bucket, not derived: settlement terrain is minted from the trade route (`src/generators/terrainHelpers.js:23-35` — `port→coastal, river→riverside, …, default plains`); climate is SEASONS-A, an aspatial food-year whose only geography is a 7-entry `amplitudeByTerrain` table (`src/domain/worldPulse/seasons.js:77-85`).

**VERDICT: DIVERGENT-NOT-COMPARABLE at the architecture level** — finite semantics and THE PROMISE make "typed buckets frozen at canonize" a deliberate design, not a gap, and our reserved-slot digest discipline (`spatialDigest.js:106-121`) is *better* lifecycle engineering than anything upstream has. **But THEY-BETTER (cohesion) on one specific point:** our buckets' *sources* are thinner than the derivations sitting one iframe away. The amplitude a settlement's winter bites with (`mountain: 40, coastal: 20`) is authored per terrain word, while a principled per-settlement severity scalar is derivable at canonize time from data the iframe already computed (its cell's `temp`/`prec`/latitude).
**Reconciliation sketch:** extend `getSpatialPack` to also copy `grid.cells.temp`/`prec` (mapped through `pack.cells.g`), and at an entitled canonize band them into a typed per-settlement `climate` bucket (e.g. `harsh|standard|mild` modifying `SEASONS_TUNING` amplitude) stored under the existing opt-in sub-digest idiom (exactly like `biomeTexture`, `spatialDigest.js:245-265, 554-560`). Capture-side only ⇒ no same-seed world moves; dormant by default ⇒ byte-identical old canons; banding keeps finite semantics.

---

## F3. Lake hydrology — the water-budget typology

**WHAT THEY DO (CONFIRMED):** Lakes are full citizens of one budget. Height = min shoreline − 0.1 (`lakes.ts:12-16`); per-lake flux = Σ shoreline precipitation, temperature = shoreline mean, evaporation ≈ Penman (`lakes.ts:49-84`, formula :63-65); `detectCloseLakes` decides open-vs-closed by flooding from the lowest shore cell under an elevation limit (:87-126); rivers *create outlets* when `flux > evaporation` (`river-generator.ts:190-223`, chain lakes keep identity :199-210); and the **subtype is a derived consequence**: `frozen` (temp < −3), `lava`, `dry` (evaporation > 4×flux, no in/out), `sinkhole`, `salt` (no outlet ∧ evaporation > flux), else `freshwater` (`features.ts:334-346`). `openNearSeaLakes` breaches sub-22-height sills to the sea, with an Ancylus-Lake comment (`grid-generator.ts:226-262`).

**WHAT WE DO (CONFIRMED):** We do not model lakes at all engine-side. The dense cost field marks *all* water `IMPASSABLE` (`spatialCost.js:194-197`); the digest has no water-body concept; `seaLanes.js` knows ocean-coast and river-course only (header rule, :17-28). Lakes exist solely as pixels in the iframe.

**VERDICT: THEY-BETTER (comprehensiveness, and — notably — *their derivation style is our own finite-semantics idiom*: a closed subtype vocabulary derived from an arithmetic budget).**
**Reconciliation sketch:** no new simulation needed — at canonize, flood-fill the captured `h < 20` non-border components (we already hold `h` + `c`), optionally capture `features`' lake rows instead, and freeze a typed `lakes` sub-digest: `{ cells, shoreline settlementIds, subtype: freshwater|salt|dry|frozen }` using their budget rules. Consumers already exist: salt as a resource-strike ground (`steadingTopography.js` `desert_salt` lean :165), fishing/travel texture, sea-lane-style lake ferries later. Dormant opt-in slot; MIT attribution if the Penman line is copied verbatim.

---

## F4. River hydrology — flux, meandering, width, navigability

**WHAT THEY DO (CONFIRMED):** Precipitation-driven flux accumulation down a depression-resolved heightfield (`river-generator.ts:167-411`): `alterHeights` micro-gradient (:413-423), iterative lake-aware `resolveDepressions` with abort-on-bad-progress (:426-484), `drainWater` height-sorted accumulation with lake outlets and confluences (:179-269), rivers below `MIN_FLUX_TO_FORM_RIVER = 30` never form (:180), erosion downcut (:362-376). Each river gets `discharge` (m³/s), meandered length, and a mouth **width** from `(offset/1.5)^1.8` calibrated against a list of real rivers (comment :607-610, Fibonacci length progression :33), plus `isNavigable = flux ≥ 100` (:646-649) and lake drain-chain walkers (:652-699).

**WHAT WE DO (CONFIRMED):** We capture `r[]` — river id per cell — and use it as a **boolean**: `riverBias 0.3` on traversal cost (`spatialCost.js:148`) and the `river_lowland` cost band (`steadingTopography.js:88-105`). Settlement `riverAccess` is a config word (`mapProfile.js:131`). Port-eligibility geography counts *any* `r[cell] != 0` as river frontage (`seaLanes.js` header :20-22) — a mountain creek and a great navigable river are indistinguishable to the engine.

**VERDICT: THEY-BETTER (comprehensiveness).** This is the clearest "simulator consumes static/absent where a principled derivation exists": river *magnitude* exists in the iframe (`cells.fl`) and dies at the capture boundary, while our sea-lane and trade layers make decisions that historically hinged on it.
**Reconciliation sketch:** add `fl` (or the `pack.rivers` rows: `{i, discharge, width, cells}`) to `getSpatialPack`; at canonize, band per-settlement river frontage into a typed size (`stream | river | great_river`, cut at their own `MIN_NAVIGABLE_FLUX = 100`), and gate river-port eligibility in `buildSeaLanes` on `river ∧ navigable` instead of `r != 0`. Frozen at canonize under the re-canonize discipline; changes only newly-canonized worlds (flag it: an *existing* canon re-derived under the new law is a discrete owner-visible event, per our own §V.1 rule).

---

## F5. Climate model + its config surface — variability

**WHAT THEY DO (CONFIRMED):** Temperature is a 40-line pure function of latitude and altitude with a distinct tropics regime (`temperature-generator.ts:13-37`: equator/pole temps from `options`, tropics [16, −20] with its own 0.15°/° gradient, −6.5°C/km altitude drop through a user `heightExponent`). Precipitation is a wind-advection pass (`precipitation-generator.ts:27-96`): humidity picked up over water, dropped orographically (`(h/70)²` modifier :37), blocked above elevation 85, none below −5°C; driven by an 18-band Hadley-cell `LATITUDE_MODIFIER` (:21) and **six user-configurable 30°-tier wind angles** resolved into westerly/easterly/northerly/southerly entries (`getWinds` :103-123). Where the map sits on the globe is itself derived per template (`coordinates.ts:12-56`: real-world positions per precreated map, `WHOLE_WORLD_CHANCE` per template, gaussian `RANDOM_SIZE` per template) — so *a volcano is tropical-sized and a pangea can span the world*: world-shape and climate cohere. Note their own comment discipline on seed stability: "legacy quirk: a band starting at cell 0 is skipped, **fixing it changes every map**" (`precipitation-generator.ts:47`) — upstream independently practices our THE-PROMISE-style quirk preservation.

**WHAT WE DO (CONFIRMED):** No latitude, no winds, no globe. SEASONS-A is deliberately aspatial (`seasons.js:1-37` header: "the aspatial food year"), with authored annual shape (:110-118) and seeded inter-annual variance (:128-135); the seasonal *road* overlay is a season×terrain-class multiplier table (`spatialCost.js:96-101`). `mapKind` influences climate **nowhere** — a `volcano` realm and a `pangea` realm run identical seasons.

**VERDICT: mostly DIVERGENT-NOT-COMPARABLE** — sub-century scope + EUROPEAN_FANTASY_BASE morphology make a full latitude/wind model out-of-scope by constitution, and our inter-annual variance/hungry-gap machinery models something FMG doesn't (time). **One THEY-BETTER nugget (cohesion):** the template→climate coupling. Cheap emulation that fits finite semantics: an authored per-mapKind modifier on `SEASONS_TUNING` (an atoll realm's fisheries dampen winter; a pangea interior sharpens it) — one frozen table, no rasters, no new state; or fold it into F2's captured-temp banding, which subsumes this for map-placed realms.

---

## F6. Coast and ocean as derived drawings

**WHAT THEY DO (CONFIRMED):** The coastline is the land/water boundary of the heightfield, then *fractalized* with a seeded sum-of-cosine roughness profile (calm and rough stretches on one shore; `coastline-generator.ts:11-60+`, settings incl. `lakeSmoothThreshMult`); ocean depth rings are traced isolines of the distance-to-coast field `t` at −1…−9 (`ocean-generator.ts:21-88`); the pack re-graph doubles resolution exactly along coasts (`pack-generator.ts:38-49`).

**WHAT WE DO (CONFIRMED):** The headless realm plate's coast is a 24-ray star polygon around the site centroid with outward jitter and one smoothing pass (`realmPlateRenderer.js:177-194`), and its "sea rings" are the same polygon offset outward 3× (:223-237). Honest and deterministic, but it cannot express a peninsula, strait, or archipelago even when `mapKind` names one; relief is `mounts`-many authored carets (:241-259).

**VERDICT: THEY-BETTER (elegance + variability), headless surface only** (the iframe already renders theirs). **Reconciliation sketch:** this collapses into F1 — once a pure heightfield exists engine-side, coast = marching its land/water boundary into our own draw-op vocabulary (`townMapDraw.js` serialization stays the single writer); the ocean-ring idiom is a BFS distance field we already know how to build (features `markup` is ~30 lines). Purity caveat: our realm-plate idiom bans runtime trig (`realmPlateRenderer.js:33-39`) — their cosine roughness profile would need authored tables or our sanctioned ops.

## F7. Feature taxonomy (ocean/sea/gulf, continent/island/isle)

**CONFIRMED:** `features.ts:313-361` derives subtypes from cell-count thresholds relative to grid size. We have no landmass concept at all (`spatialDigest` knows `not_land` and nothing else). **THEY-BETTER (comprehensiveness), low priority** — would give travel/news prose "the Isle of…" vocabulary via a canonize-time flood-fill + typed subtype; same dormant-slot pattern as F3.

## F8. Pipeline-as-data

**CONFIRMED both sides:** their `generation-pipeline.ts` + `ErasePipeline` vs our `generateSettlementPipeline.js` / `pulseStageManifest.js`. **PARITY / OURS-BETTER** on lifecycle rigor (our version axes + dormancy oracles have no upstream equivalent). No action.

## F9. ⚠ Upgrade hazard: upstream *fixed* the bug our fork deliberately preserves

**CONFIRMED:** our fork keeps FMG's lake-shore bug untouched as an owner-gated same-seed guarantee — `public/map/main.js:862`: `c[i].forEach(n => !lakeCells.includes(n) && (cells.t[c] = 1))` (indexes the typed array with the whole adjacency array; shores never marked), documented in `docs/fmg-fork.md` §2 (~858 row: "fixing it would change same-seed generation output"). Upstream's rewrite **fixed it**: `grid-generator.ts:186-188` `for (const n of c[i]) { if (!lakeCells.includes(n)) cells.t[n] = 1; }`. Consequence: any re-vendor to this upstream era silently changes every same-seed world's coastline markup (and everything downstream of `t`). Not a recommendation — a tripwire for whoever runs the next `FMG_ORIGIN_RUNBOOK` upgrade: the fork doc's patch table covers *our* edits, but this is an *upstream* behavior shift that the runbook's diff step won't flag as a patch site. (PLAUSIBLE corollary: other quirk-fixes of the same kind exist in the rewrite; the one place upstream *documents* preserving a quirk is `precipitation-generator.ts:47`.)

---

## Coverage denominator

**Upstream read in full (14 files):** generation-pipeline, heightmap-templates, heightmap-generator, temperature-generator, precipitation-generator, biomes-generator, river-generator, lakes, features, grid-generator, coordinates, pack-generator, ocean-generator, heightUtils. **Partial:** resample.ts (:1-50), ice-generator.ts (:1-60), coastline-generator.ts (:1-60), relief-generator.ts (:1-80). **Not read:** voronoi.ts, zones/markers/cultures/burgs/routes/goods etc. (civ-lane territory), `src/renderers/**`, `src/controllers/**`.
**Ours read in full:** resolveTerrain, mapProfile, worldPulse/seasons, worldPulse/steadingTopography, spatial/spatialCost, spatial/spatialDigest, realmMap/realmPlateRenderer, instantWorld/worldPlan, generators/terrainHelpers. **Partial:** sf-bridge.js (:70-150, :860-905 + greps), spatial/seaLanes.js (:1-80), townMap/siteGenesis.js (:1-60), worldPulse/demographicsLand.js (:1-40), fork main.js (lake function region), fork heightmap-templates (full diff), `docs/fmg-fork.md` via git show. **Not read:** the 670KB fork bundle (grep-probed only), townMap layout stack, undercity, roadsKernel/routeNetwork\* (route derivation vs FMG `routes-generator.ts` left to the CIV lane).

**Priority order if the owner takes any of it:** F4 (river magnitude — smallest capture change, largest honesty gain for sea lanes/trade) → F2 (captured temp/prec → typed per-settlement climate band) → F3 (lake typology) → F1+F6 (headless heightfield, the big variability prize) → F5/F7 (cheap texture). F9 is a standing hazard regardless.

---

# APPENDIX FMG-ANTHRO (study lane report, verbatim)

All reading complete. Final report follows.

---

# LANE FMG-ANTHRO — anthropogenic layers: upstream FMG vs SettlementForge

**Coverage denominator.** Upstream (fresh clone, restructured to TypeScript under `src/`): read IN FULL `generators/states-generator.ts` (892 L), `cultures-generator.ts` (1353 L), `religions-generator.ts` (1346 L), `burgs-generator.ts` (884 L), `population-generator.ts` (78 L), `provinces-generator.ts` (342 L); read partially `military-generator.ts` (~240/587 L — alert + modifier tables). NOT read: zones/routes/markets/goods/production generators (other lanes), `pipeline.ts`, renderers, controllers. Ours (archive of 73f5dfc02): read full or substantial heads of `worldPulse/relationshipEdgeSeed.js`, `relationshipCompatibility.js` (120/260), `relationshipHierarchy.js` (~60/…), `warIntent.js` (130/420), `warTermination.js` (40/…), `religionState.js` (110/733), `religiousContest.js` (100/1029), `demographicsKernel.js` (60/432), `region/graph.js` (160/1000), `realm/autoplacement.js` (120/…), `realmMap/realmPlateRenderer.js` (90/377), `instantWorld/worldPlan.js` (~200/…), `generators/neighbourGenerator.js` (120/499), `capacityModel.js` (55/1139), `deityConstants.js`, `cultureProfiles.js`, plus `docs/fmg-fork.md` via `git show`. NOT read: the other ~200 worldPulse modules, `region/propagation.js` body, most of `src/generators`, the fork's bundled generator core (`public/map/index-Bp79q281.js`). All file:line cites below are CONFIRMED unless marked PLAUSIBLE.

**Structural context (CONFIRMED).** Our vendored fork (`public/map/`, rev sfdrop16) is the *pre-restructure* FMG (main.js + `modules/ui` + a Vite bundle) used as an iframe map surface; per `docs/fmg-fork.md` our patches are bridge/security/branding only — we adopted zero of FMG's anthropogenic *generation* logic into the engine. So every comparison below is engine-vs-engine convergent evolution, not fork drift.

---

## F1 — THE KEY COMPARISON: cost-distance expansion fields vs graph influence

**THEY:** One priority-flood mechanism (FlatQueue Dijkstra over Voronoi cell adjacency) reused **five** times with layered fields: cultures (`cultures-generator.ts:1245–1335`), states (`states-generator.ts:282–350`), religions (`religions-generator.ts:1021–1069`), heresies (`:1071–1109`), provinces (`provinces-generator.ts:157–186`, wild `:236–255`). Signature shape: per-entity `expansionism` divides cell cost — `const totalCost = p + 10 + cellCost / states[s].expansionism` (`states-generator.ts:332`); per-culture-type terrain cost tables (`getBiomeCost/getHeightCost/getRiverCost/getTypeCost`, `states-generator.ts:239–269`); a global budget (`totalCost > growthRate return`, `:334`). Layers compose: state expansion discounts own-culture cells `culture === cells.culture[e] ? -9 : 100` (`:325`); religion expansion is *mode*-constrained (`expansion === "culture"/"state"` early-returns, `religions-generator.ts:1047–48`) and route-aware (`getPassageCost` — road cells cost 1, `:1159–1166`); heresies pay 2000 to leave the parent faith's territory (`:1097`). Then both states and provinces run a **normalize** pass that dissolves one-cell enclaves by neighbor majority while never overwriting burgs or near-capital cells (`states-generator.ts:352–369`, `provinces-generator.ts:189–207`).

**WE:** No cell-level territory in the engine at all. Influence is a settlement-graph phenomenon: 13 typed channels (`region/graph.js:47–64`), 10 primary relationship labels (`relationshipCompatibility.js:41–52`), faith projected along carrier relationships with tier-mass asymmetry (`religiousContest.js:89–96`, `religionState.js:94–110`). The only engine-side realm geometry is the pure plate renderer, which draws coastline+MST roads+markers and **no territory** (`realmMap/realmPlateRenderer.js:17–31`).

**VERDICT: DIVERGENT-NOT-COMPARABLE for simulation (ours is a living graph, theirs a one-shot raster paint) — but THEY-BETTER on cohesion+elegance for the one thing we lack: a derived political/cultural *territory view*.** Reconciliation sketch: a pure, RNG-free domain module that derives a deterministic influence partition over the realm raster we already have (`realm/placementRaster.js` cells) using exactly their idiom — seed each settlement, tier as the expansionism analog, terrain-fit costs we already compute for autoplacement, a budget so wilderness stays unclaimed — consumed only as (a) realm-map territory shading and (b) an adjacency prior for genesis diplomacy (F3). Derived-view-only ⇒ no lived-history mutation (THE PROMISE safe), dormant until the realm map asks for it, headless, and their normalize pass is the exact hygiene our "marks in open country" and thin-ring census lessons demand. If code is copied rather than re-derived: MIT attribution per `public/map/LICENSE-FMG.txt` precedent.

## F2 — Suitability ranking / population

**THEY:** `population-generator.ts:19–59` — one pass: biome habitability base, normalized flux+confluence `*250` (`:34`), elevation penalty (`:35`), coast bonus table `COAST_SCORES` (`:5–15`), goods bonus (`:51–54`); `cells.pop = s × area/meanArea` (`:58`). Burg population = suitability/5 × capital 1.5 × route connectivity × gauss (`burgs-generator.ts:361–370`).
**WE:** `demographicsKernel.js:5–12` — `next = population + births - deaths` with integer terms, one keyed fork, named-souls exemption (`:23–28`); migration terms P2; plus 9-capacity supply/demand with named contributors (`capacityModel.js:11–19`).
**VERDICT: OURS-BETTER (comprehensiveness, explainability, lifecycle) — theirs is a static snapshot, ours a living model with receipts.** Their static scorer is still the right *placement prior* shape, which we already reinvented in `autoplacement.js` (FIT/REACH weights, `AUTOPLACEMENT_TUNING`, `autoplacement.js:83–114`) — arguably better than theirs (an explicit anti-star web objective vs their quadtree spacing). No action.

## F3 — Diplomacy matrix genesis

**THEY:** `states-generator.ts:488–559` — relations drawn from adjacency-class weighted tables (`neibs/neibsOfNeibs/far/navals`, `:504–507`); vassalization when neighbor, P(0.8), attacker area > mean and >2× target (`:554–555`); vassals *inherit their suzerain's whole relation row*, and third parties copy their suzerain-relation onto the vassal (`:518–533`) — an elegant transitive-closure rule. Then a war cascade (`:561–671`): a rival is attacked when power (area×expansionism) beats `gauss(1.6,0.8)` (`:575`), vassals/allies join or defect with reasons, everyone flips to Enemy, and the whole thing is logged as a readable chronicle (`war.push(...)` lines `:595–660`).
**WE:** 10 primary types + a secondary-status **compatibility matrix** ("rivals who trade OK; battlefield enemies' normal trade forbidden except covert/forced/mediated/temporary", `relationshipCompatibility.js:26–33, 102–118`); vassal war-cascades with fear/leverage/dependency scalars (`relationshipHierarchy.js:48–60, 145–150`); coalition ledger, treaty machinery, deliberative war opener (`warIntent.js:2–57`) — all evolved per tick.
**VERDICT: OURS-BETTER on the lifecycle by a wide margin (their matrix is minted once and only the military generator ever reads it: `military-generator.ts:206–221`). THEY-BETTER (variability + elegance) on the *instant-history bootstrap*: a fresh FMG world opens with a believable web of vassals, rivalries and 1–2 ongoing named wars; our fresh instant realm opens diplomatically cold (worldPlan seeds sites and per-settlement seeds only, `worldPlan.js:174–222`; no genesis edge-typing found — PLAUSIBLE, I did not read the composer).** Reconciliation: a deterministic genesis-diplomacy pass in the instantWorld composer — adjacency class from k-nearest (J-D2's k=3, already ratified in `autoplacement.js:88–89`), tier-ratio vassalization echoing their area rule, weighted tables drawn from the plan's forked PRNG, optionally one opening war under the `dramatic_campaign` tone. This writes only the *starting* world (generation, not lived history) so THE PROMISE holds; seeded-purity holds (plan PRNG fork); their suzerain-inheritance closure should come along.

## F4 — War naming

**THEY:** `${an}-${trimVowels(dn)}ian War` (`states-generator.ts:584`) and weighted campaign nouns (`generateCampaign`, `:457–478`: War 6, Conflict 2, Campaign 4, Invasion 2, Rebellion 2, Conquest 2, Intervention 1, Expedition 1, Crusade 1) with `getAdjective(name)`.
**WE:** wars have typed reasons, receipts, cost trajectories, peace terms (`warTermination.js:1–40`, `warReasons.js` 1102 L) — and **no proper noun anywhere** (grep for war-name patterns across worldPulse: zero hits, CONFIRMED).
**VERDICT: THEY-BETTER on this one small axis (flavor/variability); ours vastly better on causality.** Reconciliation: a pure display-side name deriver — deterministic function of (participants, warReason type, tick) mapping typed buckets to authored templates ("the Sacred Claim → *The <Deity> War*", trade reason → *The <Good> War*", fallback adjective-of-attacker + noun). Finite-semantics-clean (clerk formatting of typed buckets, no AI writer), zero engine state.

## F5 — Religion genesis + lineage

**THEY:** Four-layer taxonomy Folk/Organized/Cult/Heresy (`religions-generator.ts:33–38`); folk faiths blanket their culture's whole area *before* organized expansion (`spreadFolkReligions`, `:1169–1188`); organized faiths seeded at the biggest burgs with quadtree spacing (`:678–712`); **the name generator chooses the expansion mode** — "Place-ism" spreads by state, "Culture-ism" by culture, "Faith of X" globally (`:1289–1320`); folk faiths displaced by an organized same-culture faith get renamed "Old X" (`:842–854`); heresies are minted on the parent faith's *boundary cells* (`:903–941`) and expand cheaply only inside parent territory (`:1097`); every faith records an `origins` DAG with explicit cycle prevention (`wouldCreateOriginCycle`, `:1004–1018`) and radius-based origin discovery (`:966–1002`).
**WE:** per-settlement pantheon: shares summing to 100, niches, standing ladder cult→established→ascendant, patron contests weighted by *legitimacy over popularity* (`religionState.js:40–80`), unaffiliated sink with revival (`:67–79`), spread along typed carrier relationships/channels with mass asymmetry (`religiousContest.js:89–98`), patron-fall typing, obituaries.
**VERDICT: OURS-BETTER on dynamics/comprehensiveness — nothing in FMG evolves after genesis. THEY-BETTER on two genesis structures: (a) the origins DAG — an explicit faith-lineage tree with cycle guard; our schisms happen (patron contests, `classifyPatronFall`) but as read I found no persistent parent-lineage record a chronicle could walk (PLAUSIBLE — unread modules may hold one); a typed `origins` field on our deity/creed records is cheap, finite-semantics-clean provenance. (b) the two-layer genesis (folk substrate blanketing culture + organized overlays) as the instant-realm starting distribution — we have entry-as-cult for *arriving* faiths but the t=0 substrate story is thinner (PLAUSIBLE, composer unread).** ⚠ Constitutional flag: their deity/meaning name pools (`:74–403`) are a premade pool — DEITY DOCTRINE forbids adopting the *content*; the *structure* (weighted compositional approaches, `:49–72`) is adoptable over our own authored vocabulary.

## F6 — State forms, tiers, full names

**THEY:** prominence tier from area quantiles (`empireMin` via `count**0.4` rank, `states-generator.ts:683–691`); Monarchy ladder Duchy→Empire by tier with culture-base overrides (Khanate/Tsardom/Shogunate/Caliphate…, `:761–771`); Free City / City-state special-case for 1-burg republics (`:777–783`); adjective-vs-of full-name rule (`:826–851`); form-derived tax defaults (`:72–79`).
**WE:** settlement-tier government archetypes + antithesis map (`neighbourGenerator.js:17–27`); no realm-level state-form vocabulary (realm hierarchy is relational patron/vassal, not a polity object).
**VERDICT: DIVERGENT (their polity object vs our settlement seat) — with a THEY-BETTER nugget: the area-quantile prominence ladder is a clean, cheap "how grand is this realm actor" formula usable for realm-hierarchy labels. The culture-base overrides largely fall *outside* our EUROPEAN_FANTASY_BASE morphology scope — adopt only the European subset if ever adopted.**

## F7 — Provinces

**THEY:** provinces per state ∝ burg count (`provinces-generator.ts:122`), flood expansion, enclave-dissolving justify pass (`:189–207`), and the standout **wild provinces**: unassigned state cells become Island/Islands/Colony/Territory, with "Colony" decided by an actual land-connectivity BFS `isPassable` (`:304–319`) and colony names drawn "New X" from a pool of the state's own names (`:216–224`).
**WE:** no territorial subdivision (grep: only incidental 'province' mentions, e.g. `worldPulse/informationStatecraft.js`; districts are intra-settlement).
**VERDICT: DIVERGENT-NOT-COMPARABLE today; becomes THEY-BETTER (comprehensiveness) the day F1's partition lands — the wild-province sweep is precisely "every cell accounted for, remainders named honestly," and the isPassable-⇒-Colony rule is a lovely mechanically-derived flavor call.**

## F8 — Burg features, groups, ports

**THEY:** citadel/walls/shanty/temple from population thresholds + theocracy coupling (`burgs-generator.ts:388–398`); a *data-driven group taxonomy* — ordered predicate table (min/max population, feature booleans, biomes, percentile, first-match-wins) (`:400–522`); port assignment: candidates grouped **per water body**, capital/safe-harbor promotion, and the invariant "a sea route needs two endpoints; a lone port is useless" (`:283–291`); river burgs geometrically shifted to the bank perpendicular to the local river tangent (`:319–339`).
**WE:** settlement interiors are orders of magnitude richer (institutions, districts, economy); but the engine does no water-body-aware network sanity for sea trade (PLAUSIBLE — routes/trade lane's scope).
**VERDICT: OURS-BETTER on depth; THEY-BETTER on map-geometry coupling. The two-endpoint-per-water-body rule is worth stealing as a trade-route sanity invariant wherever our sea/port semantics live; the ordered predicate-table classification idiom is a nice pattern for realm-item classes (our tier ladder itself is constitutional — don't touch).**

## F9 — Culture types as a threading enum

**THEY:** 7-value `CultureType` (`cultures-generator.ts:33`) inferred from center geography (`defineCultureType`, `:1124–1138`), sets expansionism (`:1140–1149`), and then threads through state expansion costs (`states-generator.ts:239–269`), state forms, burg typing (`burgs-generator.ts:174–194`), emblems, and military unit modifiers (`military-generator.ts:69–150`). One enum, five systems — high cohesion.
**WE:** culture is a profile dial (`cultureProfiles.js:1–15` → data corpus), terrain posture is computed per consumer.
**VERDICT: THEY-BETTER on cohesion of the threading (a single geography-derived temperament reused everywhere); DIVERGENT in substance. Low-priority: if a settlement "geographic temperament" (naval/highland/river…) were derived once at generation and stamped, several of our generators could read one shared bucket instead of re-deriving terrain fitness independently.**

## F10 — Determinism hygiene (reverse finding)

**THEY:** monkey-patch global RNG — `Math.random = aleaPRNG(generateSeed())` (`states-generator.ts:103`), `Math.random = Alea(localSeed)` (`provinces-generator.ts:81`) — plus DOM reads (`ensureEl("statesNumber")`) inside generation.
**WE:** keyed PRNG forks, no ambient random, headless (`worldPlan.js:10–14`, `autoplacement.js:33–39` — a placer with *zero* draws).
**VERDICT: OURS-BETTER, categorically.** Any emulation of F1/F3/F5 must re-derive onto our fork idiom; never port their RNG or DOM plumbing.

**Parity note:** their locked-entity re-index machinery across regeneration (states `recreate` `states-generator.ts:102–204`; religions `combineReligions` with reserved origin ids `religions-generator.ts:755–855`) is their convergent answer to our preservation-on-regen problem (`regenerationPreservation.js`, `locksPreservation.js`) — comparable maturity, no adoption needed; their reserved-origin-id trick is a decent referential-integrity pattern if our lineage records (F5a) ever face regeneration.

**Top adoption candidates, ranked:** (1) F1 influence-partition as a derived territory view (unlocks F7's wild-remainder sweep and F3's adjacency priors); (2) F3 genesis-diplomacy pass with suzerain-closure; (3) F5a faith `origins` lineage; (4) F4 war-name deriver (small, high flavor-per-line); (5) F8 two-endpoint port invariant. All fit determinism/dormancy/headless constraints as sketched; MIT attribution applies only if code is copied verbatim (precedent: `public/map/LICENSE-FMG.txt`).

---

# APPENDIX FMG-NET (study lane report, verbatim)

All reads complete. Compiling the report.

# LANE FMG-NET REPORT — networks, names, variability surface

**Denominator.** Upstream (fresh clone, restructured to TS under `src/`): read in full — `routes-generator.ts` (915 l), `names-generator.ts` (295 l), `languageUtils.ts`, `generation-pipeline.ts`, `pipeline.ts`; read in structural depth — `emblems-generator.ts` (~330/503 l), `markers-generator.ts` (~250/1721 l), `zones-generator.ts` (~90/629 l), `resample.ts` (~300/473 l), `submap-tool.ts`, `heightmap-templates.ts`, `name-bases.ts` (structure + 2 bases of 44), `tools.ts` (regenerate list), plus greps of `options.js`, `style-presets.js`, `world-configurator.ts`, `transform-tool.ts`. NOT read: burgs/states/cultures/religions/rivers generators (other lanes), the new markets/goods/production economy layer, renderers, emblems data tables. Ours: read in full `src/lib/roadNetwork.js` (402 l), `sf-bridge.js` computeRoadNetwork handler; in part `roadsProse.js`, `seaRoads.js`, `namingData.js`, `worldPlan.js`, `npcGenerator.js` name helpers, `settlementLifecycleKernel.js` naming, `MarkersLayer.jsx`, `emblemPaths.js`, `docs/fmg-fork.md` (via git show). NOT read in depth: the ~30-file `routeNetwork*` worldPulse family (semantic trade-flow layer; skimmed), `userRoutes.js`, town-map ornament. All paths below are relative to the two archive roots given in my brief.

**Meta-observation (affects every fork-touching recommendation):** upstream has restructured from the JS layout our fork mirrors (`public/map/modules/**`, sfdrop16) into typed `src/generators|renderers|controllers/**` with unit tests and a declared `generation-pipeline.ts`. CONFIRMED both sides (`ours/public/map/modules/` listing vs upstream `src/` listing). The `docs/fmg-fork.md` upgrade runbook's "search the diff for patch tags" procedure will not survive this restructure — the next re-vendor is a port, not a diff. Flagged for the runbook owner; not a finding of this lane per se.

---

## 1. ROUTES — network topology

**WHAT THEY DO:** Per-landmass Urquhart graph (Delaunay minus each triangle's longest edge) over capitals → main roads, all burgs → trails, ports → sea routes. CONFIRMED `src/generators/routes-generator.ts:243-285` ("Urquhart graph is obtained by removing the longest edge from each triangle…"), 385-466.
**WHAT WE DO:** Prim MST over city+ placements → highways; explicit relationship/supply-chain links → trade roads; nearest-non-hostile → lanes. CONFIRMED `ours/src/lib/roadNetwork.js:240-284, 286-299, 374-399`.
**VERDICT: DIVERGENT-NOT-COMPARABLE at the semantic tier, THEY-BETTER (variability) at the geometric tier.** Our edge *selection* is semantically richer (hostile pairs suppress edges, reasons are typed strings — they have nothing like it). But an MST is a tree: zero cycles, so every pair of cities has exactly one road path and cutting one edge splits the network. Urquhart is a supergraph of the MST that keeps natural redundant loops — road networks that read organically and survive an interdiction event. Our own worldPulse interdiction/bypass consumers (`routeNetworkCharterBypass.js`, `routeNetworkConsumersInterdiction.js`) would gain real alternatives to reason over. **Reconciliation sketch:** keep the three-tier semantic pass exactly as is, but replace step 1's Prim MST with Urquhart edges over the same city+ nodes (Delaunator is already in the map stack; the ~40-line edge extraction at their 246-285 is MIT-copyable with attribution per `public/map/LICENSE-FMG.txt`). Determinism holds: Delaunay of fixed points is deterministic, and our existing sorted-pair-key tie-break covers the degenerate cases. Fits headless-engine (pure geometry, no DOM) and THE PROMISE if gated to genesis of new worlds (existing saved edge sets must not shift — dormancy flag or plan-version stamp).

## 2. ROUTES — cost function and trunk formation

**WHAT THEY DO:** Land cost = distance² × habitability[1,1.1] × height[1,3] × **connectionModifier 0.5 if the edge already carries a route** × **burgModifier 3 if the next cell has no burg**. CONFIRMED `routes-generator.ts:287-301`. Every accepted segment registers its cell-pairs in `connections` (409-418), so later paths are pulled onto existing roads — trunk highways emerge, and `getRouteSegments` (337-363) splits a path where it merges into an existing road so shared stretches are never double-drawn.
**WHAT WE DO:** Each edge A*-routed **independently**; cost = biome table × elevation + river penalty, no reuse discount, no burg attraction. CONFIRMED `ours/public/map/sf-bridge.js:626-628` ("Edges are routed independently"), 667-676.
**VERDICT: THEY-BETTER (elegance + cohesion).** Independent routing produces parallel near-duplicate polylines wherever two edges share a corridor; their two small modifiers produce convergent trunk networks and settlement-threading roads for ~15 lines of code. **Reconciliation sketch:** in the `settlementEngine:computeRoadNetwork` handler, route edges in a deterministic order (tier rank then the existing sorted pair key), accumulate a `Set` of traversed cell-pairs, and multiply `landCost` by 0.5 for already-traversed pairs and by ~3 for non-burg cells. Purely additive to the bridge; same inputs → same outputs so byte-determinism is preserved per fixed edge list; visual change gates behind the map-plan version like any same-seed shift (must be declared per non-negotiable #10).

## 3. SEA ROUTES — geometric water routing

**WHAT THEY DO:** Water cost tiers by distance-from-shore class (`ROUTE_TYPE_MODIFIERS` −1 coastline 1 → ocean 6 → far 8, `routes-generator.ts:16-22`), impassable below sea temp −4 (326), **ports must exit/enter via their haven cell** (315-325, 365-377: "coastal port cell: must leave through its haven… otherwise the rendered route cuts across the land"), and **rivers are navigable route segments** with direction-aware river-edge maps and geometry reuse so a sea route rides the actual meandered river course (188-201, 480-588, 689-706).
**WHAT WE DO:** Engine layer: rich sea *semantics* — per-hop land/sea modality, blockade/storm/piracy hazards behind `seaRoadsEnabled` dormancy (CONFIRMED `ours/src/domain/roads/seaRoads.js:29-46, 50-57`). Map layer: `seaCost` = 1.2 shallow / 0.9 deep, nothing else (CONFIRMED `sf-bridge.js:678-684`); `preferSea` only when both ends are ports (`roadNetwork.js:186, 235`).
**VERDICT: DIVERGENT at the hazard tier (OURS-BETTER — they have no consequences on routes at all); THEY-BETTER (comprehensiveness) at the drawing tier.** Their haven constraint alone fixes the classic artifact of sea lanes clipping across a port's own headland; coast-hugging tiers make short hops hug and long hauls go blue-water; navigable rivers give river-port trade a visible spine. **Reconciliation sketch:** extend the bridge's `seaCost` with FMG's own `t` (distance-from-coast) field, already present in `pack.cells`, and honor `pack.cells.haven` at port endpoints — both fields exist in our vendored pack today; no engine change, no new state, deterministic.

## 4. ROUTE NAMING

**WHAT THEY DO:** Every generated route gets a name from weighted grammar models (`burg_suffix` 3 / `prefix_suffix` 6 / `the_descriptor_*`), group-specific suffix pools (roads: road/route/way/highway; trails: trail/path/track/pass; searoutes: route/lane/passage), and — the cohesive part — the burg-anchored model turns the terminal burg's name into an adjective via `getAdjective` morphology rules ("…endings: -land→-ish, -stan→-i…"). CONFIRMED `routes-generator.ts:26-172, 852-874`; `src/utils/languageUtils.ts:32-169`.
**WHAT WE DO:** Generated network rows carry no names — `routeName` flows only from user-authored route refs (CONFIRMED grep: `routeNetworkGenesis.js` has zero name minting; `envoyErrandEvidence.js:58` forwards `routeRef.name` when present). Our herald prose says "the ${dest} road" (`ours/src/data/roadsProse.js` capture pool).
**VERDICT: THEY-BETTER (comprehensiveness + cohesion).** "Seized by brigands on the Tarnford Way" beats "on the road to Tarnford" for a product whose herald already names everything else (NEWS ADDRESS LAW). **Reconciliation sketch:** name routes at genesis in `routeNetworkGenesis.js` from a typed grammar (finite semantics: closed prefix/descriptor/suffix buckets keyed to our 9 `namingData.js` cultures, not FMG's freewheeling 100-prefix pool), drawing from `kernel/prng.js` with the route's stable pair key as the fork — never ambient random. Adjectivization of the anchor settlement name is a small pure function worth writing in our own morphology (their English-only rules conflict with per-culture cohesion — see finding 5). New worlds only, or a dormant `routeNamesEnabled` rule: adding names to an existing seed's ledger rows is a byte shift (THE PROMISE).

## 5. NAME GENERATION — the core algorithm

**WHAT THEY DO:** Syllable-segmenting Markov chain trained per name-base corpus (44 bases, ~200-300 real toponyms each, with per-base min/max length + allowed-duplicate letters), cached chains, culture→base indirection so burgs/states/provinces in one culture cohere; plus derived forms: `getBaseShort`, `getState` with per-base suffix morphology (-ia/-land/-maa/-orszag/-guk/" Guo"…), map-name generation. CONFIRMED `src/generators/names-generator.ts:18-151 (chain), 153-177, 196-272`; `src/data/name-bases.ts:1-44`.
**WHAT WE DO:** Flat prefix×suffix concatenation from 30×30 pools per culture (9 cultures). CONFIRMED `ours/src/data/namingData.js:5-70`; `ours/src/domain/worldPulse/settlementLifecycleKernel.js:358-377` (draws `p + s` via seeded `draw.random()`). Person names are curated-list picks (`npcGenerator.js:237-248`) — those are fine and out of scope.
**VERDICT: THEY-BETTER (variability + cohesion), their single strongest system in my lane.** Prefix+suffix yields ≤900 combinations per culture, all sharing one cadence ("Steinburg, Waldheim, Bergdorf…"); the Markov chain yields effectively unbounded names that carry the phonotactics of the corpus, at ~130 lines with no dependencies. **Reconciliation sketch:** port `calculateChain`/`getBase` into a pure `src/domain/naming/` module (MIT attribution applies — this is a copy), seeded by injecting our PRNG for its `ra` picks instead of ambient `Math.random` — the algorithm is otherwise pure string work. Train on curated per-culture corpora we author under our 9 culture keys (EUROPEAN_FANTASY_BASE morphology scope is *satisfied*, since we choose the corpora; FMG's non-European bases simply don't get imported). Deploy dormant: existing settlements keep their names forever (lived history immutable); only genesis-time naming of *new* worlds and lifecycle-kernel *foundings* under a rules flag consult it. The existing `settlementPrefixes` pools remain as the dormant-path fallback so absent-flag output is byte-identical.

## 6. EMBLEMS / HERALDRY

**WHAT THEY DO:** Full generative heraldry: tinctures with rule-of-tincture enforcement (`getTincture`… "follow RoT", `emblems-generator.ts:276-297`), divisions/ordinaries/charges with position grammars, and — the standout — **genealogical inheritance**: a burg's COA derives from its state's with a kinship weight (capital +0.1, port −0.1, foreign culture −0.25 — `src/generators/burgs-generator.ts:378-384`), provinces from their capital burg or state (`provinces-generator.ts:136-138, 284-287`), and dominions get the parent's charge in a canton (`emblems-generator.ts:222-252`). Charges are semantically typed via `typeMapping` (a Naval state pulls naval charges, line 108).
**WHAT WE DO:** The vendored fork bundle still runs old COArenderer + `public/map/charges/*.svg` for map-side burg/state emblems (CONFIRMED `index-Bp79q281.js` contains `COArenderer`; charges dir present). Our own engine has exactly 8 hand-authored house emblems for counterseals (`ours/src/design/organic/ornament/emblemPaths.js:1-30` — "The 8 house emblems in pools.js"). Factions/settlements have no generated heraldry and no inheritance.
**VERDICT: THEY-BETTER (comprehensiveness + cohesion) — but adoption is a product decision, not a patch.** The kinship/dominion device is a visual grammar for political genealogy — vassal banners visibly quartering their liege's charge is exactly the "world that explains itself" register the owner prizes. **Reconciliation sketch:** a `src/domain/heraldry/` clerk that mints a typed COA record (finite semantics: closed tincture/ordinary/charge enums — their data tables in `src/data/emblems/*` are importable as frozen buckets, MIT-attributed) per faction/settlement at genesis, seeded per entity id; kinship weights derive from our existing relationship graph (patron/vassal/client already exist in `roadNetwork.js`'s TRADE_RELATIONSHIPS vocabulary). Render through the fork's existing charge assets. Dormant flag; genesis-only; deterministic. Flag: this is "genuinely new capability versus repair" — owner-gated per the standing carve-outs.

## 7. MARKERS (points of interest)

**WHAT THEY DO:** ~28-type declarative config — each row = `{type, icon, min, each, multiplier, list(pack), add(id,cell)}` where `list` is a candidate-selector over geography and `add` writes a legend note; quantity = candidates/each with a min floor; user-tunable multipliers per type (`markers-settings.ts` controller); **locked markers survive `regenerate()`** (`markers-generator.ts:81-94`); even a linked one-page-dungeon seed per dungeon marker (`addDungeon`, seed = `${seed}${cell}`). CONFIRMED `markers-generator.ts:41-56, 75-94, 126-160`, generateTypes.
**WHAT WE DO:** Markers are user annotations only — pin/star/skull/flag with note, drag-to-move (CONFIRMED `ours/src/components/map/MarkersLayer.jsx:1-18`). We do not generate POIs on the realm map.
**VERDICT: THEY-BETTER (comprehensiveness), with an OURS-BETTER twist available.** Their battlefields/ruins are decorative fiction; our worldPulse mints *real* battles, razings, calamities with addresses. **Reconciliation sketch:** adopt their declarative-config *shape* (typed marker registry: selector + legend-writer per type — clean finite semantics) but feed it from our ledgers: battlefield markers from war-ledger engagements, ruin markers from razed/abandoned settlements (`believedRazings.js` exists), shrine markers from faith records. Geographic-only types (springs, waterfalls) can come later from pack data. This is a derived render layer — no new persisted state, regenerable from canon at any time, so it dodges our regen hazard class entirely.

## 8. ZONES (event footprints)

**WHAT THEY DO:** 11 zone types (invasion/rebels/proselytism/crusade/disease/disaster/eruption/avalanche/fault/flood/tsunami) as **cell-set footprints on the map**, quantity-weighted, some reading real state (invasion grows from an actual ongoing campaign's border cells — `zones-generator.ts:58-80`). Disease zones get generated names.
**WHAT WE DO:** Calamities/wars are first-class *semantic* events with settlement addressing (`calamityKernel.js`, scope `'regional'` at line 809) but no spatial cell footprint; nothing paints "the plague reached this far" on the realm map.
**VERDICT: DIVERGENT-NOT-COMPARABLE on mechanism (our events are causal, theirs cosmetic), THEY-BETTER (legibility) on the map-footprint idea.** **Reconciliation sketch:** a derived overlay that flood-fills N cells from affected settlements per active condition — render-side only, seeded from the event id, recomputable, no persistence. Pairs with finding 7's derived-marker layer as one "canon paints the map" feature.

## 9. OPTIONS / VARIABILITY SURFACE

**WHAT THEY DO:** Gaussian-randomized world knobs with **per-option locks** — `statesNumber gauss(18,5)`, `provincesRatio`, `religionsNumber`, `sizeVariety`, `growthRate`, 9 cultures-sets, era, 14 weighted heightmap templates + precreated heightmaps + world-configurator (latitude/temperature/precipitation with per-param `lock_${param}` icons). Randomize-unless-locked is the core idiom (`options.js:599-616`, `world-configurator.ts:48`). Plus style presets and a user namesbase editor.
**WHAT WE DO:** Instant world: 3 knobs (size/tone/map-kind, `worldPlan.js:37-95`) over 7 curated templates (`sf-bridge.js:83-113`); advanced wizard covers institutions/services/trade per settlement. Realm-level counts are fixed pyramids (REALM_SIZES tiers).
**VERDICT: OURS-BETTER for the product's front door (three legible knobs beat forty sliders for our audience — deliberate design, not a gap), but THEY-BETTER (variability) on one specific device: **randomize-unless-locked**. Our realm pyramids are three fixed arrays; there is no "reroll the world but keep the map" or "keep my tone, surprise me otherwise". **Reconciliation sketch:** (a) jitter the pyramid within bands from the seed (small = gauss around 5, etc.) — pure `worldPlan.js` change, deterministic per seed, new-plans-only; (b) expose per-knob "keep this" pins in the wizard so regenerate reshuffles only unpinned knobs — UI-state only, no engine change. Both fit sub-century scope and THE PROMISE (plans, not lived worlds).

## 10. SUBMAP / RESCALE / REGENERATION — their answer to our dormancy problem

**WHAT THEY DO:** Three coordinated mechanisms. (1) **Per-entity `lock` + per-layer `regenerate()`** across 18 layers (`tools.ts:88-107`): routes regenerate preserving locked routes (`routes-generator.ts:203-206`), markers preserve locked and clean up their notes (81-94), cultures/burgs/states clear `lock` when invalidated. (2) **A declared generation pipeline** — the canonical step order as data (`generation-pipeline.ts:6-47`), with a parallel ErasePipeline reusing the same step ids for partial re-runs. (3) **Resample** (`resample.ts`) — geometry transforms (submap zoom-in, scale/rotate/mirror) that rebuild the grid and then **walk every entity family** (rivers with pre-baked meander points, cultures re-centered by poles of inaccessibility, burgs re-celled with haven-aware port placement, states with military relocation and note cleanup, markets dropped when their burg left) marking off-map entities `removed, lock:false`.
**WHAT WE DO:** Feature dormancy flags with byte-identical-when-absent proofs (`seaRoads.js:29-38` — "ABSENT ⇒ … byte-identical") plus goldens; regeneration of a settlement re-runs generation from config; no geometric rescale exists (realm map is fixed per plan).
**VERDICT: DIVERGENT-NOT-COMPARABLE on philosophy (their lock model answers "let the user reroll pieces"; our dormancy answers "never change shipped bytes" — ours is the stricter and correct contract for THE PROMISE), but TWO of their pieces are worth taking. (a) **The pipeline-as-data idiom** (THEY-BETTER, elegance): our world composition is a hand-written call sequence inside `composeInstantWorld.js`; declaring it as an ordered step table with ids would give us the same partial-rerun and per-step timing hooks for free, and is exactly the shape our own §718 "replayable derivation" doctrine points at. (b) **The resample family-walk as a checklist** (THEY-BETTER, comprehensiveness): their Resampler is a literal enumeration of every state family that must survive a substrate change — the precise inventory-walk our most-bitten bug class (the write that survives one path and ghosts another) demands. If the realm map ever gains submap/zoom (plausible future given the town-map port), `resample.ts` is the reference implementation to study first.

## 11. DETERMINISM POSTURE (cross-cutting caveat on every adoption)

**WHAT THEY DO:** `Math.random = Alea(randomSeed ?? seed)` — global ambient-RNG replacement (`routes-generator.ts:209`); `regenerate()` reseeds from `Math.random()` (204-206); name/state morphology draws ambient `Math.random` throughout (`names-generator.ts:235`).
**WHAT WE DO:** Injected `kernel/prng.js` draws, forked per entity, with byte-determinism law (e.g. `worldPlan.js` determinism header; `roadNetwork.js:17-22` stable tie-break doctrine).
**VERDICT: OURS-BETTER, categorically.** Every recommendation above therefore imports *algorithms and data*, never their RNG plumbing: each port must thread an explicit seeded stream and a stable iteration order. Their reliance on object-key iteration (`Object.entries(capitalsByFeature)`) and ambient RNG is exactly what our constitution exists to forbid.

---

**Priority order if the owner takes only three:** (5) Markov name chains — largest quality-per-line win, cleanly dormant; (2) connection-reuse + burg-attraction cost modifiers — 15 lines in the bridge, transforms road-network readability; (7) ledger-fed marker registry — turns lived history into map furniture, no persistence risk. MIT attribution (per the `public/map/LICENSE-FMG.txt` precedent) applies to findings 1, 5, and 6 where code/data is copied rather than emulated.

---

# APPENDIX SF-REALM (study lane report, verbatim)

LANE SF-REALM REPORT — our realm stack, mapped for the comparison
=================================================================

Denominator: I read both fork docs in full (`git show 73f5dfc02:docs/fmg-fork.md`, `docs/azgaar-bridge.md`); ~700 of 1,275 lines of `public/map/sf-bridge.js` including every handler; `mapBridge.js` core; the full capture→canonize→digest→read chain heads (`spatialPackCapture.js`, `campaignSpatialCanonize.js`, `spatialDigest.js`, `spatialCost.js`, `distanceRead.js`, `seaLanes.js` headers); `roadNetwork.js`, `computeMapChains.js`, `RoadsLayer` seam lines, `realmPlateRenderer.js` (first 100/~450 lines), `autoplacement.js`/`placementRaster.js` headers, `resolveTerrain.js` + callers, `WorldMap.jsx` excerpts; upstream: `routes-generator.ts` (~620/915 lines), `pathUtils.ts#findPath`, `states-generator.ts` expansion outline, `versioning.ts`, `types/global.ts`, full module roster. NOT read: `sf-origin.js` internals, the 672KB `index-Bp79q281.js` bundle body (symbol-scanned only), upstream goods/markets/production internals (sizes and names only), upstream burgs/cultures/religions generator bodies, our Herald/LayersPanel internals, the town-map stack (another lane's surface). All paths below: ours under `/private/tmp/claude-502/.../fmg-study/ours/`, upstream under `.../fmg-study/fmg-upstream/`.

------------------------------------------------------------------
1. THE REALM DATAFLOW MAP (all CONFIRMED unless marked)
------------------------------------------------------------------

```
FMG FORK IFRAME  public/map/  (revision sfdrop16; FMG vintage MIXED:
  main.js?v=1.111.0-sfdrop16, general.js?v=1.113.1-sfdrop15, versioning.js VERSION="1.114.2"
  — public/map/index.html:8509–8534, public/map/versioning.js:19)
  generation core = hashed Vite bundle index-Bp79q281.js exposing window.HeightmapGenerator,
  Rivers, Biomes, Cultures, Features, Lakes, OceanLayers, States, Provinces, Religions,
  Military, Markers, Zones, Routes, Names, COA, Resample (symbol scan; fmg-fork.md §"index-*.js")
  sf-origin.js (parentOrigin contract) → main.js (globals) → sf-bridge.js (RPC)
       │  postMessage, exact-origin both ways, _rid request ids
       ▼
src/lib/mapBridge.js (parent RPC client; origin+source validated :95–97; queue drained on
  first fmg:ready :110–118; push events emitted with fmg: prefix stripped :133–135)
  ├─ src/hooks/useMapBridge.js:92–126 — listens: ready, burgSelected, settlementPlaced,
  │    placementRemoved, allPlacementsCleared
  ├─ src/components/MapOverlay.jsx:105 — listens: viewport (mirrors FMG's d3 zoom transform
  │    onto the React overlay <g>; child broadcasts via zoom hook + RAF poll, sf-bridge.js:394–449)
  ├─ React overlay layers (src/components/map/): PlacementsLayer, RoadsLayer, ChainEdges,
  │    RelationshipEdges, Forests/Labels/Markers/Travelers/Timelapse layers, WarFaithMapOverlay,
  │    RegionalCausalityLayer — SF draws ALL settlement/route/overlay marks; FMG draws geography only
  ├─ src/store/mapSlice.js — placements { burgId → settlementId,x,y,cellId }, seed, snapshot;
  │    updatePlacement REFUSES once worldState.canonizedAt (:446, :497)
  ├─ campaign persistence: mapState.fmgSnapshot (~1MB .map text via prepareMapData,
  │    sf-bridge.js:462–465) fingerprinted by campaignSync (azgaar-bridge.md §Snapshot flow)
  └─ src/lib/spatialCaptureRegistry.js ← WorldMap registers the live bridge on mount
        ▼ (entitled spatial canonize; dynamic import so first paint never loads it)
src/store/campaignSpatialCanonize.js:48–135
  → src/lib/spatialPackCapture.js:99–125 — READ-ONLY `getSpatialPack` RPC copies pack.cells
     h/biome/r/p/c out of the iframe (sf-bridge.js:875–901); captures TWICE as determinism
     evidence, freezes the FIRST (:114–120); placements rows carry stored cellId + institution
     roster + magicExists (:49–90)
  → src/domain/spatial/spatialDigest.js#buildSpatialDigest (:298) — PURE: quantized integer
     cost field (spatialCost.js), ONE multi-source Dijkstra → territory partition + gates,
     Floyd-Warshall over the N-settlement graph → distanceMatrix + tiers, route receipts,
     reserved slots lit: seasonalOverlay / seaLanes / teleportEdges (canonize call :76–102)
  → 400KB size guard (:35), deepFreeze (:113), persisted under worldState with a bumped
     spatialCanonVersion — FROZEN CANON, never recomputed
        ▼
READ-ONLY SIM CONSUMERS: src/domain/spatial/distanceRead.js + spatialLedgerAccess.js →
  117 files across src/domain/{worldPulse,spatial} reference the spatial read modules
  (worldPulse holds 396 files): armyTransitKernel, assizeKernel, tradeFlow, commodityFlow,
  calamity, migration, rumorNetwork, navalLayer, smuggle, pestilence, beliefMap, …
  Calibration: median primary hop ≡ 1 week, MAX_HOP_WEEKS 52, weight floor 0.35
  (distanceRead.js:60–77)

SIDE TRACKS (no FMG involvement):
  • src/domain/instantWorld/worldPlan.js → src/domain/realmMap/realmPlateRenderer.js — a PURE,
    byte-deterministic headless realm SVG (trig-free UNIT_DIRS table :76–83; MST roads;
    tier glyphs) for static landing plates. Its KIND_TERRAIN keys (:92–100) mirror the
    iframe's SF_TEMPLATES names (sf-bridge.js:83–90) — coupled BY NAME ONLY.
  • Autoplacement: src/domain/realm/placementRaster.js reads the LIVE pack via the same RPC
    (digest is unusable: no coordinates persisted, and the write is locked post-canonize —
    placementRaster.js header, verified against mapSlice) + autoplacement.js (RNG-free,
    tie-broken by seed hash) → AutoplacementConsent.jsx → pre-canonize placement writes only.
  • Roads drawn on screen: src/lib/roadNetwork.js#computeRoadEdges (:146; Prim MST over
    city+ placements + trade edges + lanes, deterministic tie-breaks :17–22) → iframe A*
    `settlementEngine:computeRoadNetwork` (sf-bridge.js:629–863) → polylines → RoadsLayer.jsx:48,73.
    Recomputed per session, never persisted.
  • Thumbs: settlementEngine:exportThumb → src/lib/mapThumb.js (gallery covers).
```

Bridge command surface: 21 `settlementEngine:*` commands (sf-bridge.js:19–47 comment block + handlers; enumerated independently by autoplacement.js:19–26, which also proved "there is NO programmatic terrain write" — activateTool only ARMS FMG's own editors: heightmap/rivers/coastline/lakes/biomes, sf-bridge.js:1060–1105).

Embedded generation is geography-only by DOM-poking FMG's option inputs: `randomizeOptions` override zeroes statesNumber, manors, religionsNumber, provincesRatio (sf-bridge.js:126–150) and locks templates to 7 curated single-landmass shapes incl. custom `sfArchipelago` (:83–113).

------------------------------------------------------------------
2. FMG SUBSYSTEMS: CONSUME vs IGNORE vs REIMPLEMENT
------------------------------------------------------------------

CONSUMED (CONFIRMED):
- Heightmap templates + full geography generation (terrain, features, lakes, rivers, biomes, temperature/precipitation) via the seeded `regenerateMap(options.seed → alea)` path (sf-bridge.js:488–499 — note the fixed bug: a bare string used to destructure to seed:undefined).
- pack.cells arrays h/biome/r/p/c + findCell (getSpatialPack :875–901; placeSettlement :531–535).
- The .map serialization for campaign persistence (prepareMapData/uploadMap, :462–478).
- FMG's terrain EDITORS as user tools (activateTool :1060–1105) and undo/redo.
- d3 zoom/viewport machinery (mirrored, :363–449); screen→map CTM (:308–324).
- Native layer DOM toggles: biomes, rivers (+ vestigial stateBorders/cultures/routes ids) via setFmgLayer (:1154–1192).
- Thumbnail rasterization (exportThumb :908).

IGNORED (generated-dormant or zeroed; CONFIRMED from the zeroing override): burgs/states/provinces/religions (zeroed), FMG's own Routes (never generated with 0 burgs), military, markers, zones, emblems/COA, FMG Names for settlements (SF names travel from the parent, :515–546), population, labels, diplomacy, 3D, submap, notes/AI (egress-disabled per fmg-fork.md §3), cultures (PLAUSIBLE: generated over cells but never read by any bridge handler I saw).

REIMPLEMENTED SF-SIDE (CONFIRMED):
- Road/route network: roadNetwork.js (edge selection) + bridge A* (pathfinding) + spatialDigest (the sim's route truth) — three cooperating pieces vs FMG's one Routes module.
- Territory partition: digest multi-source Dijkstra "Voronoi-of-settlements" (spatialDigest.js:13–24) — the structural analog of FMG's `expandStates` cost-spread (upstream states-generator.ts:282–349).
- Sea lanes (seaLanes.js — port = geography ∧ water-access institution) vs FMG sea routes; seasonal cost overlay + teleport edges (no FMG equivalent at all).
- Economy: supplyChains/tradeFlow/commodityFlow/entrepots vs upstream's NEW goods/markets/production layer (see drift).
- Settlement placement scoring: autoplacement.js/placementRaster.js vs upstream burgs-generator suitability (not read in depth — PLAUSIBLE analog).
- Realm rendering for static surfaces: realmPlateRenderer.js — deliberately NOT FMG (headless, byte-deterministic; its header records that sf-bridge mints ids with Date.now/Math.random and is browser-only).

------------------------------------------------------------------
3. THE DRIFT — what upstream 1.149.2 has that sfdrop16 predates
------------------------------------------------------------------

Baseline: fork is FMG ~1.111–1.114 (mixed vintage — CONFIRMED via index.html:8509–8534 cachebusters vs versioning.js:19). Upstream is 1.149.2 (package.json:4) — ~35 minor releases ahead, and .map minor versions are format-affecting by upstream's own convention (versioning.ts header).

STRUCTURAL DRIFT (the biggest finding): upstream is no longer the tree our runbook assumes. The old `public/modules/**` JS layout is GONE (only 3 UI stragglers remain); everything lives in a 302-file TypeScript `src/` (components/controllers/data/generators/renderers/services/types/utils) with vitest unit tests co-located and Playwright e2e, and `public/main.js` is a 523-line loader. Consequence, CONFIRMED by comparing trees against docs/fmg-fork.md's upgrade procedure: steps 2–4 ("diff -ru", "drop in the new main.js", "overwrite modules/ then reapply") no longer meet a corresponding tree, and the §"Why not a hard fork" cost model ("at most an hour of reconciliation per release") is invalidated — the next re-vendor is a REBUILD-AND-REAPPLY of every §2–§5 patch site against a rewritten codebase, or a decision to stay pinned. Concrete API break already visible: our bridge calls `regenerateMap({seed})` (sf-bridge.js:497–498) while upstream's global is now `regenerateMap(reason?: string)` (upstream src/types/global.ts:104) — the seed would be silently ignored again, the exact H10-class failure the fork fixed once (sf-bridge.js:326–339, :488–499). CONFIRMED.

NEW SUBSYSTEMS the fork predates (module roster diff, renames discounted; changelog corroboration versioning.ts:24–44):
- ECONOMY LAYER: goods-generator (1,127 ln), markets-generator (619), production-generator (869), plus production-chains, market-deals-overview, market-overview, compare-prices, trade-details, trade-animation(+editor), goods editors — "Economic simulation" + "Trade animation" in the public changelog. Not read internally (PLAUSIBLE on quality); its existence is CONFIRMED.
- NAVIGABLE RIVERS integrated into routing: Rivers.isNavigable + per-river edge maps + RiverRun extraction so a route rides the river's actual meander geometry, direction-aware, confluence-splitting (routes-generator.ts:187–195, 303–331, 480–588).
- ROUTE/RIVER NAMING + LABELS, labels-overview, and a label-spread solver (label-spread-solver, label-raycast, label-arc, fit-state-label) — a real label placement engine.
- Jagged coastlines (coastline-generator), erosion-bake, satellite texture, 3D eroded terrain, isoline-fills.
- Minimap, editors undo, paint-editor, burg-creator, river-auto-creator, markers-in-radius/settings, configurable table columns, dialogs state persistence, URL params for layers/presets, autosave service, Electron desktop app.
- Explicit `generation-pipeline.ts` / `pipeline.ts` stage list; typed GridGraph/PackedGraph.

DELIBERATE divergences NOT to "reconcile": sw.js/PWA (deleted for supply-chain reasons), charges pruned to 104 CC0 files, umami/openwidget/AI egress removals, the SS1 XSS escaping — all pinned by tests per fmg-fork.md §3/§5; an upstream refresh must re-apply, never revert. The licence law also means upstream's full charge set and new textures must NOT ride along.

SELECTED VERDICTS for the synthesis (routes is this lane's deepest read):
- Route connectivity: THEY-BETTER (elegance + variability). Urquhart graph — Delaunay minus each triangle's longest edge — per landmass feature (routes-generator.ts:243–285, applied per-feature :385–466) yields organic, cycle-bearing networks; our Prim MST (roadNetwork.js:5–22) is a tree — no redundancy, star-ish. Reconciles cleanly: Urquhart is deterministic given points; drop it into computeRoadEdges (render) and/or the digest's candidate edge set as a SPATIAL_GEOMETRY_VERSION/costLawVersion bump — §V.1's discrete re-canonize law (spatialDigest.js:95–97) exists precisely so this never silently drifts an existing canon. MIT attribution applies if code is copied (precedent: public/map/LICENSE-FMG.txt).
- Corridor reuse: THEY-BETTER (cohesion). Their cost function halves the cost of already-used edges and triples cost off-burg (`connectionModifier` 0.5, `burgModifier` 3 — routes-generator.ts:296–299), so later routes MERGE into trunk roads; our bridge A* routes each edge independently (sf-bridge.js:626 comment "Edges are routed independently") producing parallel near-duplicate polylines. Reconciles: thread a connections set through computeRoadNetwork's loop (render-only change, no canon impact) and, versioned, through the digest's receipts.
- Water routing: THEY-BETTER (comprehensiveness). Haven-constrained port approach (a sea route must enter through the burg's recorded haven cell — :315–331, 365–377), sea-temperature impassability (MIN_PASSABLE_SEA_TEMP :14, :326), graded open-sea cost rings (:16–22), navigable-river legs — vs our nearest-ocean BFS + "sea wins if 1.15× shorter" length proxy (sf-bridge.js:779–851). Our seaLanes port RULE (geography ∧ institution, seaLanes.js:14–28) is OURS-BETTER as product law; the geometric approach mechanics are theirs to emulate inside the M8 slot.
- Determinism discipline: OURS-BETTER, decisively. Their generator seeds by monkey-patching `Math.random = Alea(seed)` (routes-generator.ts:209) — ambient, order-fragile; ours is integer-quantized, tie-break-proven, frozen-canon (spatialDigest.js:11–32, spatialCost.js:15–21). Any emulation must be re-expressed in our seeded-pure idiom; never port their RNG pattern.
- Cost-law data: THEY-BETTER (variability). Their biome costs/habitability live on data-driven, editor-exposed `pack.biomes` (states-generator.ts:241–243, routes-generator.ts:290); our BIOME_COST is a frozen hardcoded array duplicated in two places (sf-bridge.js:651–665; spatialCost.js:35–49 — a deliberate verbatim port, which is the mitigation). A versioned data table would let cost laws vary per world without code edits — fits finite-semantics if the table is a typed, owner-signed tuning surface.
- Generation orchestration: THEY-BETTER (cohesion). An explicit typed pipeline (generation-pipeline.ts) vs our geography-only mode achieved by overriding `randomizeOptions` to poke hidden DOM inputs (sf-bridge.js:126–150) — functional but brittle against any upstream DOM change.

------------------------------------------------------------------
4. THE FIVE WEAKEST REALM↔SIMULATOR SEAMS
------------------------------------------------------------------

S1 — Terrain edits never reach the sim, and nothing listens to the event that announces them. CONFIRMED: sf-bridge.js:1099 emits `fmg:terrainChanged` on tool activation; grep across src/ finds ZERO listeners (only useMapBridge.js:92–126 + MapOverlay.jsx:105 subscribe, to other events). TerrainToolbar.jsx contains no `canonizedAt` gate (grep empty); only placement writes are canonize-locked (mapSlice.js:446,497). So a user can reshape the realm after a spatial canonize and the frozen digest keeps narrating the old geography — armies march over mountains that are now sea. The dormancy/PROMISE framing ("the canon freezes") is coherent, but the UI neither blocks nor warns nor offers the receipted re-canonize at the moment of divergence.

S2 — Placement `cellId` is minted once at drop time and never re-validated. CONFIRMED mechanism: placeSettlement resolves cellId via findCell at drop (sf-bridge.js:529–536), the store keeps it, and the canonize capture consumes the STORED value (`Number(pl.cellId)`, spatialPackCapture.js:79–80) against a pack captured LATER — nothing re-derives cell from the persisted x/y at capture time. Any pack rebuild between drop and canonize (terrain edit, snapshot loaded from a different fork vintage, a future FMG upgrade changing cell indexing) silently shifts indices under the stored ids; digest territory seeds then sit on the wrong cells. PLAUSIBLE (not executed): whether resolveSeeds' normalization would catch out-of-range ids — it drops non-integers, not wrong-but-valid indices. Cheap hardening: re-findCell from x/y during capture and diff against stored cellId as a receipt.

S3 — A settlement's genesis terrain and its realm ground are two truths with no reconciliation at manual placement. CONFIRMED: sim kernels read `config.terrainType` (canonical vocabulary plains|hills|…|coastal — resolveTerrain.js:1–30; e.g. foodBalance.js:613 gates 'port' on `resolveTerrain(config) === 'coastal'`), while the digest and sea-lane eligibility read captured FMG geography (seaLanes.js:19–24: coastal cell ∨ river course). Only the OPT-IN autoplacement flow compares them (placementRaster fit predicate; AutoplacementConsent.jsx:74). A manual drag-drop writes no terrain back and raises no mismatch flag, so "coastal" settlements sit mid-plain forever: the sim's food/port logic and the digest's port rule can permanently disagree about the same settlement. This is the exact cross-consumer-unit hazard class the program has already been bitten by (a shared field read differently at every consumer).

S4 — The drawn road web and the sim's route truth are different graphs derived at different times. CONFIRMED: RoadsLayer recomputes per session — MST+trade+lane edge set (roadNetwork.js:146) routed by iframe A* with a land/sea length-proxy choice (RoadsLayer.jsx:5–6,48,73; sf-bridge.js:834–851) — and is never persisted; the sim's travel model is the frozen digest's territory-adjacency graph + Floyd-Warshall + receipts (spatialDigest.js:21–32). The biome cost TABLE is deliberately shared (spatialCost.js:30–34 "verbatim from sf-bridge.js:639-653" — good), but edge SELECTION, sea law, and corridor structure differ, so the map can draw a road between two settlements the digest ranks tier-3 remote, and the Herald can narrate a route no drawn road shows. No test or receipt compares the two surfaces.

S5 — Re-canonize is iframe-hostage: spatial truth can only refresh while a live map view is mounted. CONFIRMED: captureSpatialPack returns null without a registered, ready bridge (spatialPackCapture.js:100–101) and the canonize then no-ops as `spatial_capture_unavailable` (campaignSpatialCanonize.js:66–68); yet M8/M9c doctrine says founding a harbour or a teleport circle "RE-DERIVES ports on founding events" via the receipted re-canonize (campaignSpatialCanonize.js:88–101). A campaign advanced repeatedly from a non-map surface accrues foundings the frozen digest cannot see — ports that never open, blocs that never link — with no queued "re-canonize owed" marker. The pack needed for a headless re-derive is not persisted anywhere except inside the ~1MB .map snapshot blob, which nothing parent-side can parse. (Persisting the captured `pack.cells` sidecar-style at first canonize would make re-canonize map-independent and deterministic — a schema decision, owner-gated.)

Honorable mentions (real, but narrower): protocol-doc drift — azgaar-bridge.md advertises `fmg:burgList`/`mapReset`/`snapshotLoaded` pushes and `requestBurgList`; the child still emits them (sf-bridge.js:301–303, 1035–1052) but no parent listener exists — dead surface left from the pre-React-placements era. And the seed/template split: the template is picked by `Math.random` in the child when unset (sfPickTemplate, sf-bridge.js:118–121) and is not derived from or stored with the seed, so a bare seed does NOT reproduce a realm (the snapshot is the real canon); every surface that presents the realm "seed" as a regeneration key overstates it.

---

# APPENDIX SF-SIM (study lane report, verbatim)

LANE SF-SIM REPORT — SettlementForge simulation core, mapped for the FMG comparison.

Path roots (abbreviated below):
- OURS = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/5a850cca-94f6-4828-bc6e-0936d5f66782/scratchpad/fmg-study/ours
- FMG = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/5a850cca-94f6-4828-bc6e-0936d5f66782/scratchpad/fmg-study/fmg-upstream

Note on the FMG tree: the restructure moved Azgaar's real modules to `FMG/src/generators/*.ts` (TypeScript classes; `FMG/src/generators/generation-pipeline.ts:6-46` is the canonical ordered pipeline). `FMG/public/modules/` holds only UI. All FMG line refs below are the new layout.

## 1. OUR SIM'S LAYER MAP (entry points, CONFIRMED unless marked)

**Layer G — one-shot settlement generation (seeded, aspatial).**
- Runner: `OURS/src/generators/pipeline.js:143` `runPipeline(initialContext, rng)` — registered steps topo-sorted by deps (`:95 getStepOrder`), each step gets `rng.fork(name)` (`:155`), with a strict mode that asserts declared reads/writes per step (`:55 _undeclaredWrites`, `:164` missing-reads check).
- Step roster (registration order): `OURS/src/generators/steps/index.js:8-29` — resolveConfig → buildGenerationContext → resolveResources → resolveStress → resolveNeighbour → assembleInstitutions → subsumption/cascade/isolation/stressConfirm passes → generateEconomy → generatePower → neighbourFactions → factionCorrelation → coherenceRepair → economyReconcile → powerEconomyReconcile → structuralValidation → generatePopulation → corruptionPass → generateNarratives → assembleSettlement.
- Public entry: `OURS/src/generators/generateSettlementPipeline.js:74` `generateSettlementPipeline(config, importedNeighbour, options)`; section reroll entries `:438 regenNPCsPipeline`, `:594 regenHistoryPipeline`.
- Inputs are config enums: tier/population (`steps/resolveConfig.js:89-96`, bands in `OURS/src/data/constants.js:7-14 POPULATION_RANGES`), terrain (`OURS/src/domain/resolveTerrain.js:40 resolveTerrain`, vocabulary plains|hills|forest|riverside|coastal|mountain|desert), tradeRouteAccess, culture dial (`OURS/src/data/cultureProfiles.js:50 CULTURE_PROFILES`).

**Layer D — derived read-only state (recomputed on every read, never stored).**
- `OURS/src/domain/causalState.js:1278` `deriveCausalState(settlement)` — 14 system variables with structured contributors ("why is food_security strained?" answerable from the delta chain, `:22-26`).
- `OURS/src/domain/capacityModel.js:953` `deriveCapacityProfile(name, settlement)` — supply-vs-demand for 9 capacities with contributor lists and trajectory (`:14-27`: plague raises healing *demand* without touching supply — direction-of-cause is first-class).
- `OURS/src/domain/activeConditions.js:680` `deriveAllActiveConditions` — persistent typed conditions (archetype catalog `:57 CONDITION_ARCHETYPE_TEMPLATES`) with severity/status/duration lifecycle.
- `OURS/src/domain/simulationSpine.js:762` `deriveSimulationSpine` — seven-frame causal summary composed from single-authored complements (`:96 SPINE_RUNGS`).
- `OURS/src/domain/regionalGraph.js` `deriveRegionalGraph` — typed neighbour graph, 13 relationship types (`:28-42`).
- `OURS/src/domain/resourceSites.js:195` `deriveResourceSites` — resource *locations* (bearing/distance band/terrain family) re-derived from stored facts, golden-inert by construction (`:15-19`).

**Layer T — the tick/epoch kernel (worldPulse; ~430 files, 159,723 lines total).**
- One-week kernel: `OURS/src/domain/worldPulse/pulseKernel.js:241` `simulateCampaignWorldPulse({campaign, saves, interval, commit, ...})` — bumps tick +1, re-seeds PRNG from world seed, composes the full advance.
- Ordered phase topology (declarative, execution stays in pulseKernel): `OURS/src/domain/worldPulse/pulseStageManifest.js:16-71` `PULSE_STAGE_TOPOLOGY` — bootstrap → actor_memory → condition_aging → settlement_clock → mover_planes (war/trade/religion/spatial/institution/lifecycle) → candidate_selection (tempo-budgeted) → permission_and_apply → consequence_fold → finalize_receipt. Substage contracts with per-port reads/writes: `:96-169 PULSE_SUBSTAGE_CONTRACTS`.
- Multi-tick orchestrator: `OURS/src/domain/worldPulse/advanceInterval.js:369` `simulateCampaignWorldInterval` — "N weeks is N kernel calls, always at one_week granularity" (catch-up equivalence).
- Public barrel: `OURS/src/domain/worldPulse/advanceCampaignWorld.js:32,37` `previewCampaignWorldPulse` / `advanceCampaignWorld` (preview = same kernel, commit:false).
- Apply pass: `OURS/src/domain/worldPulse/applyWorldPulse.js:281` `applyWorldPulseOutcomes`. Per-settlement time: `OURS/src/domain/timeProgression.js:346` `advanceTime`.
- Epoch re-rooting for "fresh future": `OURS/src/domain/advanceEpochLedger.js:1-50` `stampAdvanceEpochYear` (single-writer, walker-enforced; `latest` vs first-wins `byYear` — two ticks of one lived year read the same winter).
- Sub-kernels (each dormant behind a simulationRules flag, byte-identical when dark): demographics (`demographicsKernel.js:233 advanceDemographics` — `next = pop + births − deaths + arrivals − departures`, integer terms, named-NPC floor), migration (`migrationKernel.js`), legacy population dynamics (`populationDynamics.js:504`), religion (`pantheon.js`, `religiousContest.js`, `religionState.js`, `piety.js`), war (`warDeployment.js:evaluateWarLayer`, `mobilization.js`, `conquestFeasibility.js`, `warCoalition*.js`, `peaceTerms*.js`, `treaty*.js` — ~40 files), routes (`roadsKernel.js`, `routeNetwork*.js` — genesis/decay/flows/interdiction), economy-in-motion (`supplyKernel.js`, `entrepotKernel.js`, `tradeWar.js`, `mercenaryMarket.js`), hazards (`calamityKernel.js`, `pestilenceKernel.js`), NPCs (`npcLedger.js:388 npcLedgerOf`, `npcAgency.js`, `npcLadderKernel.js`), seasons (`seasons.js` — 4-4-5 calendar, seeded per-(year,settlement) variance), settlement lifecycle (`settlementLifecycleKernel.js`, `settlementLifecycleFirstClass.js`).

**Layer S — spatial substrate (derived from the captured FMG pack; read-only at tick time).**
- `OURS/src/domain/spatial/spatialCost.js:1-53` — the land cost field lifted out of the map iframe: verbatim port of the fork's `sf-bridge.js:634-672` BIOME_COST + elevation/river biasing, then integer-quantized so path cost can never flip on a float tie.
- `OURS/src/domain/spatial/seaLanes.js:16-28` — port eligibility = GEOGRAPHY ∧ INSTITUTIONS (coastal/river cell AND a dock-class institution), sea edges folded in at read time, land matrix never re-baked.
- `OURS/src/domain/spatial/spatialSubstrate.js:1-46` — town-level geometry projected from the SAME TownMapModel the renderer draws (engine never reads the render; flammability/density/adjacency/wall-segment strength synthesised).
- Realm placement: `OURS/src/domain/realm/autoplacement.js:1-30` — placement-first planner over the FMG map's RPC surface (no programmatic terrain write exists in the bridge — enumerated there).
- Campaign multigraph: `OURS/src/domain/region/graph.js:26` (schema v2; channels, queued impacts with retention caps).

## 2. CONVERGENT-AREA LIST (FMG mechanism ↔ our mechanism)

FMG's canonical order for all of these: `FMG/src/generators/generation-pipeline.ts:6-46`.

**a. Population distribution.** THEY: cell suitability from substrate — biome habitability + river flux + low elevation + coast/harbor scores + goods bonus → `cells.pop = s × area/meanArea` (`FMG/src/generators/population-generator.ts:19-60 rankCells`); burg features then follow population (`burgs-generator.ts:388-397`: `walls = capital || pop>30 || …`). WE: tier chosen by config, population drawn in static per-tier bands (`OURS/src/data/constants.js:7-14`; `steps/resolveConfig.js:89-96`); NPCs/factions generated per tier (`steps/generatePopulation.js:26-31`); at runtime the demographic engine owns the head count (`demographicsKernel.js` births/deaths/migration/valves). VERDICT: DIVERGENT at generation (they derive placement density, we derive social structure); THEY-BETTER (comprehensiveness) specifically on *siting-derived* population — see §4.1.

**b. State/territory.** THEY: capital placement by spaced score, then priority-queue cost-flood expansion weighted by per-state `expansionism` and terrain (`FMG/src/generators/states-generator.ts:288-334`, `totalCost = p + 10 + cellCost/expansionism`, capped by growthRate); vassal/suzerain inference by area ratio (`:555-557`); one-shot backstory wars (`:573-660 generateCampaigns`). WE: no cell-territory model; realm structure is the typed neighbour graph (`regionalGraph.js`), campaign channels (`region/graph.js`), hegemony/sovereignty ledgers (`worldPulse/hegemony.js`, `sovereigntyReach.js`, `satellitesLedger.js`), and conquest/occupation as *runtime* verbs (`conquestExecution.js`, `occupation.js`). VERDICT: DIVERGENT-NOT-COMPARABLE on substance (their territory is paint, ours is politics), but THEY-BETTER (elegance) on the *one* mechanism of expansionism-weighted cost-flood as a way to get organic-looking territory variance from few knobs — relevant if realm-map territory shading ever becomes a product surface; it would reconcile as a pure derived view over the captured pack + our realm graph (no engine state, MIT attribution if code is copied).

**c. Religion.** THEY: Folk/Organized/Cult/Heresy typology (`FMG/src/generators/religions-generator.ts:34`), deity-name grammar (`:718 getDeityName`), expansion by the same cost-flood with culture/state walls (`:1021-1062 expandReligions`, `cultureCost=10` across culture lines) — all one-shot. WE: runtime contest — `pantheon.js:1-40` per-deity ratcheted ledger (wins/losses/seats, lazy major/minor/cult tier with hysteresis + per-tick containment cap so "one cult cannot eat the map in a tick"), `religiousContest.js advanceReligionStates`, `piety.js realmPietyMult`, conditional materialization (absent key while dormant). Deity doctrine is constitutional: faith = culture, never theological, no premade pool. VERDICT: OURS-BETTER on dynamics; their Folk-vs-Organized *typology with expansion modes* ("culture"/"state"/"global", `:724`) is a genuinely nice finite-semantics vocabulary we don't have an equivalent of — a typed bucket compatible with our finite-semantics law.

**d. Routes.** THEY: Urquhart-graph trunk selection between same-feature capitals + Dijkstra over terrain cost, with port-approach rules (`FMG/src/generators/routes-generator.ts:365-395 findPathSegments`, `:386-395 generateMainRoads`) — one-shot, then frozen. WE: genesis derived pure from frozen config + frozen digest with a bounded candidate set (k-nearest ∪ port pairs ∪ user routes; NO entropy at all — `routeNetworkGenesis.js:1-30`), then a full lifecycle at tick time: decay, charter, danger, interdiction, flows (`routeNetworkDecay.js`, `routeNetworkCharter*.js`, `routeNetworkConsumers*.js`, `routeNetworkFlows*.js`), plus named-NPC travel on those roads (`roadsKernel.js:1-45`). Their land-cost function is already IN our engine (`spatialCost.js` verbatim port, integer-quantized). VERDICT: OURS-BETTER (lifecycle, determinism); their capital-trunk/Urquhart selection is a candidate refinement for our genesis candidate set (elegance) — it produces realm-shaped trunk hierarchies rather than uniform k-NN webs, and would slot into `genesisCandidatePairs` as another pure candidate source.

**e. Naming.** THEY: Markov-chain syllable generation over 40+ real-language name bases with per-base length/duplication rules (`FMG/src/generators/names-generator.ts:19-61 calculateChain`, `:73 getBase`; bases `FMG/src/data/name-bases.ts:14-…`, 406 lines). WE: static prefix×suffix concatenation lists per culture style (`OURS/src/data/namingData.js:4 NAMING_DATA`, 4,037 lines; consumers incl. `npcGenerator.js`, `settlementLifecycleKernel.js`, `satellitesLedger.js`). VERDICT: THEY-BETTER (variability + cohesion — one grammar per culture yields unbounded fresh-but-consistent names; our prefix×suffix space is bounded and seam-visible). Reconciliation: a seeded Markov chain is fully compatible with our determinism (chain building is pure; draws would come from a keyed fork, e.g. `naming:<cultureKey>:<entityId>`); build chains from our OWN authored bases (or MIT-attributed FMG bases) at module load, keep the existing lists as the corpus. Flag: any adoption on the generation path is a same-seed name shift → declared golden shift; landing it dormant-first (new-campaign flag) fits our feature-dormancy law.

**f. Climate/terrain effects.** THEY: latitude/altitude temperature bands (`FMG/src/generators/temperature-generator.ts:8-31`), directional wind-pass precipitation (`precipitation-generator.ts:1-60`), then a moisture×temperature matrix assigns biomes (`biomes-generator.ts:81-140 getId`) — substrate all the way down. WE: terrain is a config enum (`resolveTerrain.js`), and climate exists only as *runtime consequence*: `worldPulse/seasons.js:1-40` — seasonal food swing with terrain-keyed amplitude and one seeded draw per (year, settlement), granary buffer, emergent hungry gap. VERDICT: DIVERGENT (they derive geography; we simulate its yearly consequences) — but see §4.4 for the reconciliation candidate.

**g. Wars/diplomacy.** THEY: one-shot relation matrix with weighted-random statuses by adjacency tier, vassal copying suzerain relations, war declared when `area×expansionism` overpowers a rival by a gaussian margin, prose chronicle (`FMG/src/generators/states-generator.ts:491-660`). WE: a live political loop — belief-gated conquest (`conquestFeasibility.js:1-30`: "a court marches on what it BELIEVES it can take", zero imports enforced by test, K3 nobody-is-ever-current, K4 no merged estimates), envoy errands/negotiation/ransom (`envoy*.js` ~20 files), coalitions with sunk-cost pressure (`warCoalition*.js`), peace terms as drafted documents with appraisal/disclosure/sale (`peaceTerms*.js` 12 files), treaties with breach credibility and succession (`treaty*.js` 13 files), mobilization/attrition/home-costs. VERDICT: OURS-BETTER by an order of magnitude (their diplomacy is backstory paint). Nothing to emulate except possibly their *initial-relations prior* (adjacency-tiered weighted table, `:504-507`) as a seed for campaign-start relationship states where ours start neutral — PLAUSIBLE, I did not read our relationship-seed defaults (`relationshipEdgeSeed.js` unread).

**h. Economy (goods/production/markets/taxes) — the newest and strongest FMG convergence.** THEY (new since our fork): goods as typed records with biome-conditioned deposits, culture/state/religion multipliers, and demand categories food/utilities/construction/military/luxury (`FMG/src/generators/goods-generator.ts:6-40`); production with recipes/inputs/workers folding into state inventories + demand coverage (`production-generator.ts:36-246`); markets anchored at burgs holding per-good stock and price, expanding over a quadtree (`markets-generator.ts:21-86`); state treasuries collected from per-deal tax + poll tax (`states-generator.ts:853-883 collectTaxes`). WE: generation-time economy (`generators/economy/*` via `economicGenerator.js:9-14` — exports/imports/prosperity/viability from terrain+resource tables and `resourceChains.js`), then runtime commodity flow: `spatial/tradeFlow.js:1-43` (windowed decayed arrivals tally — display substrate only, generation stays sacred), `supplyKernel.js`, `commodityFlow.js`, `entrepots.js`, `inferSupplyChains.js` + `supplyChainState.js`. VERDICT: mostly OURS-BETTER (motion, causality, dormancy discipline), but THEY-BETTER (cohesion) on ONE point: their goods records unify deposit→recipe→demand-category→price in a single typed catalog, where ours splits across `resourceData.js`/`resourceChains.js`/`economicData.js`/`tradeCommodity.js`/`resourceSemantics.js` — a catalog-unification pass (pure refactor, no behavior change) could adopt that shape without touching semantics. Their price/stock market objects are also the closest existing model to a "regional price surface" we currently don't expose (see §4.5).

**i. One-shot hazard zones vs living conditions.** THEY: `FMG/src/generators/zones-generator.ts:29-39` — invasion/rebels/proselytism/crusade/disease/disaster/eruption/avalanche/fault/flood/tsunami painted as static map zones. WE: the same vocabulary as *lifecycled state* — `activeConditions.js` (severity/status/duration), `calamityKernel.js`, `pestilenceKernel.js`, `crisisLifecycle.js`, spatial `embattlement.js`. VERDICT: OURS-BETTER; their list is worth mining as an event-vocabulary completeness check (tsunami/avalanche/fault have no archetype in our catalog — PLAUSIBLE, from the archetype names I read at `activeConditions.js:57-…`; I did not enumerate the full catalog).

**j. Military.** THEY: state-level unit composition by expansion/diplomacy/neighbour alert rate, regiments placed on cells, naval only at havens (`FMG/src/generators/military-generator.ts:221-356,457`). WE: `militaryStrength.js`, `martialReadiness.js` (advanceMartialReadiness + threat index), `mobilization.js`/`mobilizationEffects.js`, `warDeployment.js`, `navalStrength.js`/`navalKernel.js`, army movement `armyTransitKernel.js` + `spatial/armyTransit.js`. VERDICT: OURS-BETTER on dynamics; their per-state *standing composition* (named regiments with unit types as a display object) is flavor we don't surface — low-priority adoption.

**k. Cultures.** THEY: culture types (Naval/Nomadic/Highland/River/Lake/Hunting) *derived from the center cell's geography* (`FMG/src/generators/cultures-generator.ts:1123-1147`), driving expansionism and goods multipliers. WE: authored culture profiles as a design grammar with institution-probability biases (`OURS/src/data/cultureProfiles.js:1-21`), deliberately setting-agnostic. VERDICT: DIVERGENT (theirs is geographic determinism; ours is authored identity under EUROPEAN_FANTASY_BASE scope) — do not regress ours; but the *geography→culture-type inference* is a candidate input for autoplacement scoring (suggest a coastal culture profile for a harbor placement), UI-side only.

**l. Provinces / emblems / markers.** THEY: `provinces-generator.ts` (state subdivisions), `emblems-generator.ts` (503 lines, COA grammar with kinship inheritance, `burgs-generator.ts:377-384`), `markers-generator.ts` (1,721 lines of POI flavor). WE: we do not model provinces or heraldry; nearest neighbours are `satellitesLedger.js` (satellite settlements) and `districtProfile.js` (intra-town). VERDICT: DIVERGENT; emblems-with-kinship is the one attractive flavor import (a realm's settlements inheriting COA elements from their state's), purely presentational, seeded-fork compatible.

## 3. OUR THREE DEEPEST STRENGTHS (FMG has nothing like them — the synthesis must not recommend regressions here)

1. **The living-world tick kernel with byte-exact determinism and feature dormancy.** FMG is one-shot generation; its entire "history" is backstory prose (`states-generator.ts:457-480 generateCampaign`), and its determinism is a *global mutable* `Math.random = Alea(seed)` reassigned per module — `states-generator.ts:103` even reseeds from `generateSeed()` (fresh entropy) on regenerate, so regeneration is deliberately non-reproducible. Ours: fail-closed per-step forks (`pipeline.js:155,178` setActiveRng save/restore), keyed sub-streams (`demographics:<settlementId>`, `season:<year>:<settlementId>`), tick-invariant world-seed cadences for catch-up equivalence (`roadsKernel.js:19-25`), and every subsystem dark-by-flag with object-IDENTITY dormancy goldens (`demographicsKernel.js:16-22`). CONFIRMED both sides.

2. **Causal explainability as substrate.** `causalState.js` (14 variables with contributor chains), `capacityModel.js` (supply vs demand contributors — "demand rose, not supply fell" is representable), `activeConditions.js` (typed lifecycled conditions), `simulationSpine.js` (seven-frame causal summary), plus the pulse's receipt/provenance envelope (`pulseStageManifest.js` finalize_receipt owns 'provenance', 'residue assertion'). FMG stores scores and paints layers; nothing in its tree can answer "why". CONFIRMED.

3. **The belief layer — no omniscient actors.** `conquestFeasibility.js:12-24`: feasibility reads only already-banded *beliefs*, pinned at zero imports by test; K4 forbids merged estimates (two parties, two pictures); `beliefMap.js`/`secondOrderBelief.js`/`fidelityNoise.js`/`disinformationPlant.js` make information itself simulated state with credibility and distance-priced news (`distancePricedNews.js`). FMG's diplomacy matrix is a single shared truth. CONFIRMED for the module contracts read; the full belief-file bodies are unread (PLAUSIBLE on breadth).

Runner-up worth protecting: generation-is-sacred / THE PROMISE enforcement patterns (`tradeFlow.js:14-20` — runtime effects are modifiers over frozen generation truth, never mutations of it; `routeNetworkGenesis.js:5-9` "genesis is sacred").

## 4. STATIC ASSUMPTION → SUBSTRATE-DERIVED (candidate upgrades; each fits constitution unless flagged)

1. **Tier/population vs siting.** Ours: config-chosen tier → static band draw (`constants.js:7-14`, `resolveConfig.js:89-96`). FMG: population from cell suitability (rivers/coast/harbor/goods, `population-generator.ts:19-60`). Upgrade: when a settlement is *placed* on the realm map (autoplacement already scores ground — `realm/autoplacement.js`), derive a suitability-informed suggested tier/population band from the captured pack cell (river flux, coast, harbor) and surface it as a wizard default — a pure read of the frozen digest, never a retro-mutation of an existing seed (THE PROMISE holds; new-generation-input only).
2. **tradeRouteAccess enum vs routed reality.** Ours: `config.tradeRouteAccess` is a config enum frozen at genesis (`routeNetworkGenesis.js:5-9`). FMG: routes are pathfinding facts (`routes-generator.ts:365-395`). Upgrade: for placed settlements, *suggest* the access enum from actual digest routing (cost-to-nearest-trunk over `spatialCost.js`'s field), keeping the enum as the frozen truth once chosen — derivation feeds the choice, the choice stays sacred.
3. **Resources vs deposits.** Ours: terrain-compatible random tables with tier-scaled depletion probability (`steps/resolveResources.js:41-46 DEPLETION_PROB`). FMG: goods deposits distributed over cells by biome with per-good `biomeOutput`/`distribution` (`goods-generator.ts:10-23`). Upgrade: bias `getCompatibleResources` by the placed cell's actual biome/river/coast from the captured pack instead of the terrain enum alone; `resourceSites.js` (which already invents bearings/bands deterministically) could anchor to real digest geometry under a v2 `sourceKind` — the file's own frozen-rules versioning (`resourceSites.js:21-24`) is built for exactly that shift.
4. **Seasonal amplitude vs climate field.** Ours: `seasons.js` keys amplitude off the terrain enum ("mountain/desert harsh, temperate standard"). FMG: temperature is latitude+altitude (`temperature-generator.ts:8-31`), precipitation is wind-passed (`precipitation-generator.ts:1-60`). Upgrade: read the settlement cell's temp/prec from the captured pack (already frozen in the digest path) to set the per-settlement seasonal amplitude and hungry-gap depth — same flag, same seeded variance draw, just a substrate-honest base value. Flag: changes seasonal outputs for mapped settlements → declared shift, dormant-first.
5. **Prices/markets.** Ours: trade flow is a throughput tally with drift bands (`tradeFlow.js`), no price surface. FMG: per-market per-good stock+price with deal records taxed into treasuries (`markets-generator.ts:21-32`, `states-generator.ts:853-883`). Upgrade candidate (owner-gated as new capability, not repair): a derived regional price read over our commodity flows — FMG's market-anchored-at-burg + quadtree-expansion shape is the elegant minimal model; ours would derive it per-tick from existing flow ledgers rather than storing it.

## COVERAGE DENOMINATOR

CONFIRMED (read): our pipeline runner + step registry whole; heads (30-90 lines) + export signatures of ~35 core domain files listed above; full file rosters of `src/domain`, `worldPulse` (~430 files), `spatial`, `roads`, `realm`, `region`, `generators`; FMG's generation-pipeline whole, population-generator whole first 60, and targeted bodies of states/cultures/religions/routes/burgs/zones/military/goods/markets/production/temperature/precipitation/biomes/names (~40-100 lines each). NOT read: ~95% of worldPulse file *bodies* (159,723 lines total — inventory is roster+heads-based; per-file mechanism claims beyond the quoted heads are PLAUSIBLE); our UI/components/foundry/dossier/townMap layers; the vendored fork bundle internals (`OURS/public/map/index-Bp79q281.js`, minified — fork-drift claims rest on `spatialCost.js`'s own sf-bridge citations, not a diff); FMG's markers/emblems/provinces/rivers/heightmap bodies, tests, and `public/modules/ui`; the fork docs (`docs/fmg-fork.md` etc. — not consulted). MIT note: any recommendation above that copies FMG code (name bases, cost tables, Markov chain) requires attribution per the `public/map/LICENSE-FMG.txt` precedent; recommendations to emulate mechanisms are unrestricted.