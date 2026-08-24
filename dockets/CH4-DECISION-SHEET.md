# CH-4 — CHAIR'S DECISION SHEET

Synthesised from four lenses and their refutations, plus my own reads at the slot `510c51b766a4ef329a697d61f3006e23d4fb2325`. Everything marked CONFIRMED below I or a refuter executed; PLAUSIBLE is reasoned. No test, no worktree, no edit, no commit.

---

## 1 · BLOCKERS — ranked by consequence

### B1. The authorisation does not cover this change, and four surfaces in the blast radius are named in no declaration at all
**CONFIRMED.** §496.4 R7's subject is the **estate wave** (buildings re-drafted within plots, plot merges, embellishments, property lines); what it declares is a **drawn-map** shift; and by its own words — *"the sequencing constraint the owner must see in the band sitting"*, under a header reading *"Seven chair rulings sent with it (each vetoable)"* — it is an unratified chair ruling recording a **pending disclosure**, not a completed owner declaration. §517.2's *"rides §496.4 R7's existing one rather than minting a second"* inherits from it.

CH-4 moves more than a drawn map. Measured or read at the slot: **505 wealth bands**, **726 safety bands**, **736 district-card prose blocks** (`inferServices` :276 / `inferCurrentTension` :314 / `inferHook` :340), **736 dominant-faction attributions** on screen (`SettlementMapCards.jsx:86`) and in the AI grounding payload (`aiGrounding.js:440`), and — never named in the brief — the **printed category legend in the sold dossier** (`src/pdf/sections/TownMapPlate.jsx:121` `legendCategories`, rendered `:193 {cap(c)}`; `townMapPlate: true` in two of four `PDF_VARIANTS`). A customer re-exporting after CH-4 gets a legend reading "Criminal" where their printed copy reads "Merchant."

Also absent from §4.1 and §5: **`mapEdits.annotations`** — the DM's own free-text markers, persisted at fixed `x/y` in the 0..1000 view space (`mapEdits.js:41`, `:152-156`, cap 50/settlement, excluded from `PUBLIC_TOPLEVEL_KEYS`). They do not move when the districts do. This is the owner's own authored writing, the one item in the whole docket that is not derived state.

**Fix before dispatch:** a fresh declared-shift row put in the owner's sightline covering **bands, card prose, dominant-faction attribution, the printed PDF legend, and DM-annotation misalignment** — not a ride on R7. The chair already refused to take this on the lane's word at §550.6; this is the panel's answer, and it is *no*.

### B2. The urban-fabric layer is LIT, not dark — and CH-4 re-points a join between two independent classifiers on lit saves, in an unmeasured direction
**CONFIRMED at the slot.** `simulationRules.js:451` `const ONE_REGEN = Object.freeze({`, `:455 urbanFabricEnabled: true,`, spread at `:559` **dramatic_campaign**, `:600` **living_realm**, `:808` **full_simulation**. `preset()` (`:393`) applies overrides unfiltered, and the shipped compendium says so in the product's own data: `compendiumData.generated.js:450` `"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]`. The default preset, realistic_regional (`:531`), does **not** carry it. **Both the brief's §4.1 row (`dark behind ONE_REGEN`) and ODQ §517.3 are false at the slot.** `ONE_REGEN` is the name of the golden re-record batch (ODQ T5), not a runtime gate.

The mechanism, sharpened past the lens: **`districtProfile.inferCategory` and `urbanFabricKernel.districtClassOf` are two independent classifiers writing and reading the same 12-enum key space.** The kernel deposits by canonical archetype (`ARCHETYPE_TO_DISTRICT`, `:174-190`) and fabric-noun rules (`:196-202`) and never imports `districtProfile`. CH-4 changes only the read key. I found **more category-keyed read sites than the lens cited**: `townLayoutV2.js:571,616,632,633`, `siteGenesis.js:368`, and additionally **`ageOverlay.js:146` `portrait.growth[d.category]` and `:186` `reborn.has(d.category)`** — the visible "this town wears its history" thickening — plus `sceneLiving.js:171`.

Direction is genuinely mixed and nobody has measured it: Shadows District moving merchant→criminal plausibly *improves* the join (criminal archetype has 213 instances); Wealthy Residential moving merchant→**noble** reads a stock the kernel deposits in **1 of 504** settlements via the ruling route (16 of 504 including the name rule), so those districts lose their prominence term. No migration can fix it — the deposits were never keyed by this classifier.

**Fix:** correct both dormancy claims in the brief and in ODQ §517.3; then measure. The instrument exists and needs no save: `tests/property/townMapV2Golden.test.js` carries `fabricLitConfigs: 1` and asserts `toBeGreaterThanOrEqual(1)` at `:121` — the fabric branch is already golden-covered — and `tests/fixtures/age-overlay-golden.json` pins the overlay hash and `totalOps`. Require both deltas measured before the ruling prices this.

### B3. Five of the §4.1 downstream figures are wrong, and §9 labels them CONFIRMED
Two independent differentials agreed digit-for-digit against a Shape-D-patched slot tree:

| §4.1 row | brief | measured | status |
|---|---|---|---|
| wealth band moves | 544, four pairs | **505, thirteen transitions** | CONFIRMED wrong |
| safety band moves | 726, four pairs | 726 total, **every pair wrong** (`watched→orderly` 158 not 212, `watched→unsafe` 111 not 179, +3 unlisted) | CONFIRMED wrong |
| wall-embrace | "332 LOSE, **0 gain**" | **332 lose, 40 gain** (Mages' Quarter, craft/modest → arcane/wealthy) — and both are `worthWalling` *eligibility*, not embraces | CONFIRMED wrong in sign |
| map rings | "692 cells change ring" | 692 is a `CATEGORY_CENTRALITY` **value delta**; ring and compass sector are functions of the post-sort index (`:576/:587/:590`), so 692 is a **lower bound** | CONFIRMED mislabelled |
| category moves | 736 | **736** | CONFIRMED correct |

Diagnosis: the band rows were computed by mapping baseline table to baseline table and multiplying by instance count, with the prosperity nudge, criminal-opportunity drag, acute-threat drag and `clampIdx` omitted. The 39-cell wealth overcount is exactly the Wealthy Residential cells already at `opulent` (base 5 + lift clamps at 5). The wall row dropped the `|| d.wealth === 'wealthy' || d.wealth === 'opulent'` clause from the shipped predicate at `townLayoutV2.js:730`, which is why it reports zero gains.

**Fix:** replace §4.1 with the executed tables; relabel the wall and ring rows as predicate/value deltas; and require the build lane to run `buildTownMapModel` / `compileTownSceneManifest` for the true wall, ring, glyph and institution-landing figures before any of them reach the owner. Nobody on this panel could run them and neither could the lane.

### B4. The stated reason for `noble → government` is false, and the change silently *deletes* a card line on more quarters than it adds one to
**CONFIRMED, twice, independently.** `factionProfile.js:128-134` `CANONICAL_TO_PROFILE` folds NOBLE and CIVIC into `'government'`, and `inferDominantFaction` filters `deriveAllFactionProfiles` output, so it can never see `noble`. Measured canonically: **396 noble-archetype instances of 3,272, across 363 of 504 settlements**, every one carrying an authored `category:'noble'`. The fold is exact — 440 + 396 = 836, the brief's own government figure. So §7.3's *"0 of 504 settlements carry a noble-archetype faction at all"* and §550.7's *"mapping to a noble archetype instead is unavailable"* are `factionProfile`'s local vocabulary reported as a property of the world.

Consequence: the brief's recommendation prints the **Grand Council or City Council** on 83 of 168 noble cards and the **seated ruler** on 90 of 168. Routing through the canonical `factionArchetype()` resolves 168 of 168 to "Noble Families"/"Noble Houses" and the ruler on none.

**The lens's proposed one-token cure does not work** and I verified why: `CATEGORY_TO_ARCHETYPE.noble = 'noble'` yields `matching.length === 0` → `null` → **no dominant-faction row at all**. Three routes exist, and the chair must pick one explicitly:
- **(i)** keep `'government'` — ruler on 90/168, council on 83/168, worst world-model;
- **(ii)** `'noble'` — one token, no row on 168 cards, zero §519 exposure;
- **(iii)** route `inferDominantFaction` through the canonical detector — best world-model, a real (small) code change in a power-adjacent read.

**My own finding, unnamed by any lens.** `CATEGORY_TO_ARCHETYPE` at `:132-145` maps `residential → null`, `industrial → 'craft'`, `craft → 'craft'`, and the folded histogram has **no `craft` key** (0 instances). So after Shape D: Common Residential (168) → `null`, Noxious Trades (155) → craft → 0 matches → `null`, Artisan (10) → `null`. **Up to 333 district cards lose their dominant-faction row entirely**, while 44 (Mages' → arcane) gain one. The whole §7.3 debate is about *adding* a line to 168 cards; nobody counted the 333 removals. Mechanism CONFIRMED by reading; the count is arithmetic nobody executed.

**Fix:** correct the premise in the brief and in §550.7, pick a route on the record, and measure the deletions.

### B5. Nothing in the estate fails if the registry is declared and never read
**CONFIRMED by execution.** The proposed walker parses source text only. `districtProfile.test.js`'s three fixtures (`Religious Quarter` / `Merchant Quarter` / `Slums`) return `religious / merchant / criminal` identically under base, anchored and registry-consulted arms (mutation control: striking the criminal row moves 1 of 3). Across all 2,641 test files the **only** assertions pinning a district-category value are `districtProfile.test.js:78/85/92/161` — all on those three invariant fixtures; the "real settlement" arm at `:181-192` only asserts `DISTRICT_CATEGORIES.toContain(d.category)`. The cartography ratchets cannot help: `throws` is never-raise and `maxBuildings` is documented as a bound (`townCartographyCalibration.test.js:200-215`).

Related, distinct mechanism: the walker asserts key-set equality, so a future templated name (`` `${x} Quarter` ``) shrinks both sides equally and stays **green** while the runtime lookup misses. Today all 14 names are plain ASCII literals with no interpolation, so it does not bite yet.

**Fix, two lines:** (a) one positive differential arm — `inferCategory({ name: 'Common Residential', desc: '', landmarks: [] }) === 'residential'` — a value only the registry can produce; (b) the walker asserts `extractedNames.length === (source.match(/quarters\.push\(/g)||[]).length`, which is `14 === 14` at the slot and reds the moment a name stops being a literal.

### B6. The registry is forced to 14 rows; the brief measures 12 and declares a third judgment without flagging it
**CONFIRMED.** `spatialGenerator.js` has 14 `quarters.push(` sites and 14 literal names; the walker's key-set equality makes all 14 mandatory. `Roadside Shrine` and `Woodcutters' Ground` fire **0 times in 504 settlements** and on all three re-rolled corpora. `Roadside Shrine → religious` is riskless (the shipped table already returns `religious` on that literal). **`Woodcutters' Ground → industrial` is not** — the shipped table returns `other`, so it is a nearest-kind assertion of exactly the class the brief flags for `Fishing Landing` in §8.6 against the J-CH-1 precedent. The chair is shown two judgments where there are three.

**Fix:** name all 14 values in the ruling; label `Woodcutters' Ground → industrial` beside `Fishing Landing → industrial` as an unmeasured judgment with one-line reversal.

### B7. A fourth ratchet, unbudgeted — and the addresses in the ruling text are wrong
**CONFIRMED.** `tests/lint/.prose-numerics-baseline.json` is 413 rows and contains exactly one districtProfile row: `{"path":"src/domain/districtProfile.js","line":238,...}` — the live line. The assertion is exact array equality (`proseNumerics.test.js:366-372`), the header says debt is frozen by `path + line + snippet` and may only shrink, and `:63-69` records the HK-1 precedent for hand re-addressing. Inserting the registry after `:117` rots it. The word "prose" appears **zero times** in the brief; §6.2 budgets three ratchets. I verified no other affected file has a row (npcProfile, arcaneInstitutionVocabulary, institutionalCatalog, spatialGenerator, townLayoutV2: none), so there is no baseline contention with CH-5.

**Fix:** hand re-address the single row `238 → 238+N` with a stated reason in the HK-1 style. Say so explicitly to the lane — the failure message invites a regeneration, which would re-bank a sibling's drift.

Separately, **ODQ §550.4 is wrong on two addresses, under a heading reading "I VERIFIED IT MYSELF"**, and the panel prompt repeats it. At the slot: `112` is the **arcane** row, `113` is the criminal row carrying the bare `den`, `115` is industrial, `116` is residential. §550.4 and §550.9 contradict each other under that belief — §550.4 puts the `den` on the very line §550.9 pins as unmovable. The brief is correct throughout (§1 edits `:113`, §6.3 protects `:112`). Concrete cost is not census-key rot (an in-place token edit moves nothing) but that the record of decision carries a self-attested-verified address that does not exist, and any reasoning about the B2 fallback's reorder would be one row off. **Fix §550.4 in place before the ruling ships.** The npcProfile addresses `:332/:373` in the prompt are **correct**; the census keys `:333/:374` point at the arcane rows one line below, a different roster.

### B8. The scoreboard grades its own answer key, and the headline is two different numbers
**CONFIRMED.** `CH4-variants.mjs:51` is `const HONEST = DECL;` — the honest column *is* the Shape D registry, so D's 100% cannot fail. Re-scored independently: the D-over-B2 margin is 63 cells under the brief's column, **15 cells (0.83 pt)** if the two rows the brief itself concedes are judgments are flipped, 39 cells (2.4 pt) if they are dropped from the denominator. The brief states the circularity once in §4 and never propagates it to §2.3, §2.4 or the comparison table. Correcting one adjacent claim: V3/B2 **does** resolve all 159 Mages' cells to arcane on this corpus, so §4's *"cannot ever fix the Mages' Quarter split"* is wrong; B2's whole 63-cell residual is 39 Market + 24 Fishing Landing.

Also: §2.3 prints **712 (39.5%)** and **1,067 right** two sentences apart, whose complement is **736**. Both are correct measurements of different predicates — 712 excludes the row the brief concedes is a judgment; 736 is what Shape D moves. The number that travelled to §550.3 and the panel prompt is the one that silently drops the contested judgment while the shipped change includes it.

**Fix:** drop the "honest %" column; rank the shapes on the three facts that are not judgments (B2 regresses Market Quarter on 39, B2 rots the `path:line` census key, D is immune to landmark text by construction); state one headline — *"736 of 1,803 cells move, of which 24 and 168 rest on declared judgments."*

---

## 2 · THE CHAIR'S CALL ON SHAPE D

**Shape D STANDS AMENDED. Adopt the shape; do not dispatch the brief.**

The shape survived every attack the panel could mount, and in places is better supported than the brief claims. The mechanism argument is the load-bearing one and it is intact: a category that flickers 115/44 with the seeded institution draw is not a classification problem but a missing declaration, and no ordering or anchoring of a regex over `` `${name} ${desc} ${landmarks.join(' ')}` `` can reach it. Every variant claim in §4 reproduced exactly under two independent harnesses (V1 deletes `criminal`; V2 regresses Market Quarter 39/95 and sends Wealthy Residential to `criminal` via "gar·den·s"; V4 scores below base). The name-keying is **provably** complete — 14 `quarters.push` sites, 14 plain-string literals, no interpolation, byte-identical across the file's entire history back to 2026-04-13, so a declared registry covers legacy saves. `districtProfile.js:112` does not move, so the arcane census does not rot. The `den → \bdens?\b` anchor is a measured free win: the only word-boundary `den` strings in `src/data` are `Gambling den` and one prose fragment, and none can reach a quarter blob through any of the six landmark filters. And the placement below `:117` is not merely convenient — it is the reason D and not B2 keeps the census whole, which matters more now that CH-5 and CH-6 own that roster file.

What falls is the brief, not the shape: its scoreboard is circular, five of its downstream figures are wrong, its dormancy claim is false, its `noble → government` justification rests on an instrument error, and its authorisation is inherited from a ruling written for a different wave. None of those touch the shape's construction. Two amendments are substantive rather than editorial — **the dominant-faction routing (B4) is not settled by the brief's reasoning and the chair must pick a route explicitly**, and **the fabric join (B2) must be measured before the shift is priced**. Everything else is a correction to the packet.

Two design points I rule on so the lane is not left guessing. Keep the `declared ?? inferred` fallback rather than falling through to `'other'`: under Shape D the keyword table is unreachable in production, so the choice is about an unknown future quarter, and the count-parity walker arm (B5b) removes that habitat directly, which is better than picking a different wrong default. And keep `Wealthy Residential → noble`: the wealth argument is sound — `residential` base 1 renders the stone-townhouse quarter *poor* on 168 of 168 — and it is measurably confined to cities and metropolises (84/84), so signed band B1 is not engaged.

---

## 3 · OWNER-GATED

1. **The declared shift itself.** Bands, card prose, dominant-faction attribution and the printed dossier legend on 736 cells of already-saved worlds. R7 is a *vetoable chair ruling* about the *estate* wave declaring a *drawn-map* shift; three of those four words fail to reach CH-4. The chair cannot ratify its own pending disclosure — that is the "inherited authorisation" class §550.6 named.
2. **The paid surface.** `TownMapPlate` prints category **words** in the legend and colours districts by category; two of four PDF variants carry the plate. Paid-surface behaviour is owner-gated by nature (judgment-ledger §3), and a customer holding a printed dossier gets a different artefact on re-export.
3. **The DM's own writing.** `mapEdits.annotations` are the owner's authored markers at fixed coordinates, off the public gallery. Telling a DM their markers will no longer sit over the quarters they wrote them for is a disclosure, not a chair call.
4. **The urban-fabric behaviour change on lit saves.** Three shipped presets, a persisted mirror, six category-keyed read sites including the visible age overlay, and — if a stock re-key or migration is wanted — a persistence-shape change. Either the owner accepts the re-pointing as part of the declared shift or a migration is authored; neither is the chair's.
5. **`military` and `foreign` reachability.** The generator authors no such quarter; two shipped glyphs draw zero times. Authoring them is NEW CAPABILITY, and so is splitting Wealthy Residential into a noble ward and a wealthy-residential ward.
6. **A `category` key on the persisted quarter record.** Persistence shape. Shape D avoids it and must keep avoiding it — §5's three reasons all survived review.

Not owner-gated, contrary to §7.3's framing: naming a §519 POWER on a district card. It is already shipped behaviour on **931 of 1,803** cards, with the seated ruler already named on **294** (118 of them civic), driven by `CATEGORY_TO_ARCHETYPE.civic = 'government'` in production today. §519 rules on `Estate.ownerRef` **ownership** and deliberately opens `occupies` for non-power attachment. CH-4 adds 168 to a pattern already at 931 — it changes the volume, not the kind. The brief never called this a blocker and was right not to. If the chair *does* gate it, consistency forces the same gate onto the 294 cards already shipping.

---

## 4 · SEQUENCING

**Free, before anything:** correct ODQ §550.4's two addresses; correct the dormancy claim in ODQ §517.3 and brief §4.1. Both are record repairs, both cost minutes, both are currently mis-instructing whoever reads them next.

**Then, in order:**

1. **CH-5 + R3 land first.** They are already stacked through one gate (§554.9) with disjoint file sets, CH-5's mutation battery has passed, and R3 is dated to 2026-08-27. Do not disturb the stack.
2. **CH-4's remaining measurement** runs read-only, in parallel with that landing: the fabric-lit deltas through `townMapV2Golden` and `ageOverlayGolden`, the executed wall/ring/glyph/affinity figures through `compileTownSceneManifest`, the dominant-faction deletion count, and the `inferSafety` composition.
3. **CH-4's build lands after CH-5, before CH-6.** §549.1's rule that CH-4/CH-5/CH-6 can never run in parallel is **true of the fallback and not of the recommendation**: under Shape D, CH-4 touches `src/domain/districtProfile.js`, one new `tests/lint/` file and one row of `.prose-numerics-baseline.json` — disjoint at file level from CH-5 (`arcaneInstitutionVocabulary.js`, `institutionalCatalog.js`, `npcProfile.js`) and CH-6 (`arcaneInstitutionVocabulary.js`), and I verified no baseline contention. **Shape B2 would create the collision**, because a reorder must edit `arcaneClassifierCensus.walker.test.js`'s roster key — CH-5/CH-6 territory. That asymmetry is a second reason to prefer D.
4. **CH-4 must precede CH-6.** §541.3 states CH-5 moves "no capacity, economy, roster or rng number", so the institution draw is stable and CH-4's 736 survives CH-5 unchanged. CH-6 is different: §541.8's cure changes *what worlds contain*, so a magic-free world's institution roster moves, landmarks move, and CH-4's per-cell measurement would need re-deriving. Landing CH-4 first also severs the landmark coupling permanently, which makes CH-6's own golden delta cleaner.
5. **CH-7** (the npcProfile `den`) is downstream of both and must not race CH-5, which edits `npcProfile.js` for the hand-typed arcane duplicate (§541.7).

**The ONE REGEN constraint, corrected.** The brief calls it "the only hard constraint this inherits." It binds less than claimed, and for a different reason than stated. `districtProfile.js` is **absent from all 203 modules** in `generateSettlementPipeline.js`'s import closure (executed, with passing positive and negative controls), so the settlement-record digest and `generator-golden-master.json` **cannot move** — the estate's habitual same-seed instrument is structurally blind here, exactly as `facetInferenceHonesty.walker.test.js:17-19` already wrote for the sibling defect. What CH-4 *does* move is the **map golden family**: `town-map-v2-golden.json` (hash, `totalBuildings`, `minLynchScore`, `distinctMorphologies`, `fabricLitConfigs`), `age-overlay-golden.json` (hash, `totalOps`), and their siblings. So missing the ONE REGEN costs a **map-family re-record**, not a second full regen. The urgency that was being used to justify riding R7 is inflated — which removes the last practical argument against making the disclosure properly. **PLAUSIBLE** on the family boundary; the blindness itself is CONFIRMED.

**Instruction the packet must carry:** the shift must be proved against the derived artefact — the district-category tuples and `compileTownSceneManifest` output — **never a settlement-record hash**. A digest that cannot move proves nothing here, and a lane that measures one will either declare the shift covered or conclude the edit did nothing.

---

## 5 · RECORD-DON'T-FIX

| # | item | car |
|---|---|---|
| 1 | The census roster tracks `npcProfile.js:333/374` — the **arcane** rows. The criminal bare-`den` at `:332/:373` has **no roster entry anywhere**, and since the cure is a same-line edit it would not even rot the keys. §550.8's charter currently has nothing durable holding it. | **CH-7**, with its own written deferral |
| 2 | `inferDominantFaction`'s hand-rolled `matching.sort((a,b)=>(b.power||0)-(a.power||0))[0]` is a second power-selection rule in the display layer, over the folded vocabulary, never consulting `governingFactionOf`/`coupContenders`. `districtProfile` is the fifth un-migrated consumer of `factionArchetypes.js`. | **CH-8** (folds B4's route (iii) if the chair takes it) |
| 3 | `districtProfile.inferInstitutions` — first name-word over 4 chars, `includes()` against the same roster-polluted haystack. Same defect class, unmeasured (§8.5). | **CH-9** |
| 4 | A test keyed by `path:line` has now cost two design constraints on an unrelated repair and produced one off-by-one in the ledger. §550.9 asked whether the key is the defect; the panel's answer is yes-partly. | **structural-prevention car**, not CH-4's |
| 5 | `institutionAssignment.js:110-115` hard-codes `category: 'residential'` on `HAMLET_CLUSTER_ID` — live on 2 of 504 (proved against the frozen 504-row golden: 502 agree, the 2 disagreements are the zero-quarter thorps). After CH-4 `residential` means both the commoner ward and the quarter-less floor, and `Settlement Cluster` is a **15th** district name outside any walker. Also: `residential` sits in all eleven `CATEGORY_AFFINITY` rows and the fallback, so it becomes the new default sink for unplaced institutions. | **DW / estate car** |
| 6 | The real B8 blocker: noble fabric fires in **1 of 504** settlements via the ruling route, 16 with name rules; `ARCHETYPE_TO_DISTRICT` maps six archetypes the canonical detector produces zero of. CH-4 does not unblock B8 — the kernel never imports `districtProfile`. Strike "the B8 loop cannot fire until CH-4 lands" from the justification. | **B8 recon** |
| 7 | `mapEdits.pins` are `{anchor, dx, dy}` nudges that survive by anchor while the base position they nudged from moves. | fold into the disclosure |
| 8 | `Roadside Shrine` and `Woodcutters' Ground` fire zero times across four corpora; both reachable in principle (`Wayside shrine`, `Woodcutter's camp` are real catalog institutions). | generator-coverage car |
| 9 | The fog row needs one word changed, not a blocker: reveal **sets** survive (ids are `district.${snakeCase(name)}`), but `fogGeometry.js:198-199` re-derives shapes "over the CURRENT model geometry", so the revealed **area** follows the moved districts. | packet correction |

---

## 6 · WHAT THE PANEL COULD NOT CHECK

Named honestly, because a named gap is worth more than a silent one.

- **No test ran.** Nothing in this sheet is an executed gate result. Every CONFIRMED is a `git cat-file` read or a plain-`node` computation over a byte-verified `git archive` of the slot.
- **Nobody ran the layout.** Not the lane, not any lens. `townLayoutV2`, `buildTownMapModel` and `compileTownSceneManifest` were never executed, so the **true** wall, ring, sector, glyph and institution-landing figures are unmeasured by *anyone*. The brief presents §4.1 as measured while §6.5 concedes it is derived; treat every row I have not corrected above as PLAUSIBLE.
- **The exposure denominator is unknown.** Nobody inspected a real saved world. What fraction of live campaigns run a fabric-lit preset, how many carry `settlement.urbanFabric` at all, and how many carry `mapEdits.annotations` are the numbers that decide how much B1 and B2 actually cost — and no one has them. **The chair should require this count before ruling.**
- **`inferSafety`'s 726 was never reconstructed.** It reads `causal.scores.criminal_opportunity` and acute-threat severity, so it cannot be derived arithmetically. Two differentials reproduced the total; both contradict the brief's composition in every pair. Its sibling was wrong by 39 — treat 726 as needing execution.
- **Unverified by anyone on this panel:** the 303-of-504 `institutionAssignment` figure, §8.1's 276-name catalog sweep, §8.5, and the calibration maxima (reproduced by two lenses, not by all). The `Mages'` 115/44 split and the twelve-shape counts reproduced under two independent harnesses.
- **The corpus is extremal, not representative.** `calibrationRows()` confounds threat and seed with lattice position (`index % 4`, `index % 12`). Re-rolled corpora give 741/742/737 moved cells against 736 and 40.9–41.1%, and `noble`/`military`/`foreign` stay at zero on all of them — robust, but not a population estimate.
- **Two known soft spots in the noble measurement:** the routing probe sorted on raw `Number(f.power)` where the shipped picker sorts `FactionProfile.power` (insensitive at the headline — only two names ever resolve — but a tie could differ), and `unresolved` measured 0 only because the 141 settlements lacking a canonical-noble faction happen to carry no Wealthy Residential quarter. A non-golden seed could exercise that branch.
- **Signed band B8's own specification was not reached.** It is "under measurement (TC-B8-RECON)". If that recon is currently measuring against district wealth bands, its readings go stale by 505 cells when CH-4 lands, and no one could determine whether it is.
- **⚠ A foreign write during a read-only panel.** A refuter's `node -e` inherited the repo cwd and wrote `src/domain/districtProfileD.js` (19,170 B) into the shared working tree at 06:53; it was detected and removed in the same turn and `git status --porcelain` shows nothing of it. Two live build lanes were in the tree. Nothing of theirs was touched, but the chair should know a read-only lane put a file in a shared tree tonight.
- **My own limits.** I verified the shipped code, the ODQ rows, the ratchet baselines, the preset spreads, the fabric read sites, the golden fixture shapes and the arithmetic; I did not re-derive the corpus histogram, the 736, or the per-shape attribution, and I did not audit `military`/`foreign` against owner doctrine.