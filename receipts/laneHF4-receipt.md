# LANE HF-4 RECEIPT — THE FINAL CORPUS SWEEP (2026-08-17, ODQ §231/§234, §236 continuity protocol)

Two lanes wrote this round. **HF-4b (Fable)** generated hf241–hf312 and was killed mid-lane by the Fable
limit. **HF-4c (Opus 5)** resumed under §236, rescued HF-4b's unfetched work, filed the 24 plates HF-4b
never got to write up, and generated hf313–hf390 to spend the balance down. **This was the last growth
round; the corpus is now frozen at 313 plates.**

---

## 1. SPEND — ledger-verified, and the THREE-NUMBER RECONCILIATION closes

| | |
|---|---|
| Balance at HF-4b start (per its own manifest) | **646** |
| Balance at HF-4c start (verified by `balance`) | **358** |
| HF-4b spend | 288 = 72 images × 4 (waves A–F) |
| Balance at HF-4c end (verified by `balance`) | **46** |
| HF-4c spend | **312 = 78 images × 4** (waves G–M) |
| Round total | **600 credits / 150 images** |

**Mandatory three-number reconciliation for HF-4c (hazard note 3 of the HF-3 receipt):**

1. Batches submitted: G 12 + H 12 + I 12 + J 12 + K 12 + L 12 + M 6 = **78**
2. Files on disk: 313 total − 235 (corpus after the Wave F rescue) = **78**
3. Ledger delta ÷ 4: (358 − 46) ÷ 4 = 312 ÷ 4 = **78**

**All three agree. Zero unfetched jobs, zero losses.** Every plate verified at 5056×3392 by PIL before
filing; `use_unlim:false` passed explicitly on every request, so no allowance was silently consumed.
Model honest-label `nano_banana_2` on all 78, as in every prior wave.

**Final state: 313 plates, 313 previews, 0 gaps in hf313–hf390, highest plate hf390.**
(HF-4c also back-filled the 36 missing HF-1-era previews, so the corpus is now uniformly previewed.)

---

## 2. THE RESCUE — free value recovered from the dead session

HF-4b submitted **Wave F (hf301–hf312) and was charged 48 credits for it, then was killed before fetching
a single plate.** All twelve were sitting completed on the CDN. HF-4c recovered them from
`show_generations` result URLs — **ids taken only from tool output, never retyped** (the UUID-retype
hazard that bit three times in HF-3 did not bite once this session). Each landed at 24–31 MB, 4K.

Among them are two of the round's best plates: **hf303 legend-masterplate**, a complete symbol dictionary
and the only plate in the entire corpus with zero lettering garbles; and **hf301 under-city-leaf**, the
two-layer ghost idiom at full city scale, which is the direct refutation of hf254's image-reference
failure. Losing Wave F would have cost the corpus its symbol table.

HF-4b had also written **no calibration rows for waves E or F** (hf289–hf312). HF-4c viewed and filed all
24. **Nothing from HF-4b's spend is now unrecorded.**

---

## 3. WHAT HF-4c BUILT — waves G through M (78 plates)

| Wave | n | Theme |
|---|---|---|
| **G** hf313–324 | 12 | The §214 named gaps (gatehouse, wall-walk, tower variety) + the counter-phrase battery |
| **H** hf325–336 | 12 | Morphology diversity (rank-belts, walled wards, mud-brick, causeway capital, hill town, citadel, dual lordship) and institution/drift holes |
| **I** hf337–348 | 12 | Folio-state lenses (worn sheet, unfinished survey, wet season) and plot-scale zooms (mill, inn, civic knot, tannery, churchyard, bailey) |
| **J** hf349–360 | 12 | Substrate-scale terrain holes (karst, volcanic, dune, moor, taiga, salt lake, lake basin, downs/vale, loess, mangrove, altiplano) + the commons |
| **K** hf361–372 | 12 | Aftermath states (boom collapse, great fire, market moved, resettlement, frontier decay) + city-scale systems (guilds, enclaves, water, refuse, fuel, grain) |
| **L** hf373–384 | 12 | Cures for hf329/hf347, four specimen dictionaries (relief, water, density, ruin stages), system plates, the dark register in plan |
| **M** hf385–390 | 6 | The capstones: three-circuit cure, projection comparison, mend/later-hand cure, glyph ladder, the metropolis flagship, the folio index |

### The methodological decision (Opus-authored, chair-vetoable)

Rather than run three one-off A/B pairs, I wrote **three untested counter-phrase candidates into the tail
of every plate from hf313 onward** — the anti-duplicate-name sentence, the no-numerals-except-scale
sentence, and the no-modern-signs sentence. The control is the existing 235-plate corpus, which lacked all
three. That buys a large-n incidence measurement instead of n=1. It also means these 78 plates are not
independent samples of the *old* prompt regime — relevant to the holdout question in §6.

---

## 4. FINDINGS — twelve new counter-phrases, and one that matters more than the rest

Full rows are in `laneHF-CALIBRATION.md` §HF-4c, numbered **#24–#35**. The headline:

### ⭐ #24 — THE POLYGON-CIRCUIT PRIOR IS CURABLE

This prior survived HF-1, HF-2 and HF-3. It is named in #15 as one of the residual priors *"no phrase
cured"*, and it deformed at least eleven plates (hf100, hf104, hf121, hf133, hf165, hf167, hf172, hf173,
hf271, hf277, hf279). #2's "patched, kinked trace" mitigated it and never killed it.

**What kills it is ENUMERATION WITH REASONS**: *"the wall is NOT a shape — draw it as a chain of N
straight-ish runs of visibly UNEQUAL length meeting at unequal angles"*, then give every run its own
narrative (one strides the ridge; one doubles back to notch in the abbey close; one STOPS at the river and
the water does the work; one wobbles plot by plot along the toft backs; one is ruler-straight, cut in a
single campaign; one closes badly at a visible seam).

**Confirmed at n=5, including on the two subjects where the prior was strongest:** hf318 (town), hf372
(siege town — the exact subject that defeated six earlier plates), hf373 (hill town), hf374 (metropolis),
hf385 (three circuits at once), hf389 (metropolis flagship). The price is three or four vocabulary leaks
per plate as the run descriptions become place labels. Worth paying.

### The other findings that change how a consumer reads the corpus

- **#25 the invented-names cure.** Naming a morphology imports a real culture wholesale — "hill town" gave
  an entirely Italian-labelled plate, and "burning mountain", "chalk down and clay vale" and "boom town"
  all gave Latin. Four strikes. *"All names are invented and belong to no country or language of the true
  world"* cures it (n=3). The clause *"no real river, county or town is named"* is needed **separately**:
  the two plates that lacked it both leaked "River Ouse".
- **#26 scope the anti-duplicate rule to PROPER NAMES only.** It cut proper-name duplicates to one in a
  plate loaded with 25 named features — but on hf331 and hf380 the doubled tolbooths, scales and gallows
  are the whole point of the plate. Never apply it to category labels.
- **#27 the no-numerals sentence is strong and nearly free.** Zero dates on a flood-mark town, the exact
  convention that produced five year-leaks on hf286; and on hf390 it held on a plate largely made of
  scale bars, which came back with their divisions drawn and unlettered.
- **#29 the eleven oblique failures now have a SHAPE**: dispersed structures at middle scale on strongly
  three-dimensional ground. Two new named triggers ("a basin ringed by peaks"; specimen sheets whose
  subject is a wall FACE with no interesting plan).
- **#30 a property the model resists must be the plate's SUBJECT, not a modifier.** hf337 refused to draw
  a misaligned mend and a later hand's wrong proportions as an overlay; hf387 delivered both in detail
  when the damage was the plate's whole purpose. This generalises to anything "drawn wrong on purpose".
- **#31 #17's flat-glyph law has its first two failures**, both on wash-driven register plates. Restate it
  a second time near the end of any lens prompt.
- **#35 the SCALE CONTRACT is now drawn in three plates** — hf319 (four zoom levels), hf378 (six
  densities), hf388 (twelve distant marks). This is the most directly implementable output of the lane.

---

## 5. PER-TARGET, BEFORE → AFTER

| Target | Before HF-4c | After | Note |
|---|---|---|---|
| **§214 gatehouse detail** | hf110's gatehouse only | **hf313** (6 gate types; 3 true plan, 3 elevation) | gap filled at half yield; the three failures are all wall-FACE subjects |
| **§214 wall-walk** | absent | **hf314** ★★ | the most technically correct plate of the wave |
| **§214 tower variety** | hf110's three types | **hf315** ★★ (ten distinct towers) | caption garble is the only fault |
| **Wall-shape prior** | uncured through three lanes | **CURED** — hf318, hf372, hf373, hf374, hf385, hf389 | the lane's principal finding |
| **Metropolis flagship** | hf103 (fine grain, but concentric) | **hf389** ★★★ | first top-tier plate that is fine-grained AND non-concentric AND leak-free |
| **LOD / density / distant-mark** | none | **hf319 + hf378 + hf388** | the three-part scale contract |
| **Symbol dictionaries** | hf208 roof ticks only | **hf303** (master key) + **hf320** streets + **hf321** boundaries + **hf322** water edges + **hf377** water textures + **hf323** church ladder + **hf304** house plans + **hf379** ruin stages | eight sheets, a working symbol table |
| **Projection classification** | eleven failures, no framework | **hf386** (four projections of one town) + **hf376** (four relief conventions) | a consumer can now classify any plate at a glance |
| **Terrain substrate families** | 19 named | **+12** (karst, volcanic, dune, moor, taiga, salt lake, lake basin, downs/vale, loess, mangrove, altiplano, commons) — 36 total | every family n≥2; three of the twelve are oblique/mixed, flagged |
| **Settlement SYSTEMS (new class)** | hf291 parish only | **+8** (commons, way network, grain catchment, fuel shed, water works, charity endowments, refuse, march line) | the unit of the map can be an institution's catchment, not a place |
| **Drift / aftermath states** | 6 | **+11** (boom collapse, great fire, market moved, resettlement, frontier decay, three circuits, town that moved, swallowed village, suppressed abbey, town in ruins, refugee influx) | hf379 is now the calibrator for all of them |
| **Lens shelf** | hf5, hf50, hf51, hf197, hf277, hf278 | **+4** (wet season hf339, worn folio hf337, unfinished survey hf338, dark register in plan hf384) | hf338 is the most novel plate of the lane |
| **Morphology diversity** | euro + 8 non-euro | **+8** (rank-belts, walled wards, mud-brick river, causeway capital, hill town, loess courts, altiplano, mangrove) | four carry culture-bake notes; hf373 is the cured exemplar |
| **Negative / oblique shelf** | 12 | **+4** (hf300 lens negative, hf308, hf357, hf359) | all labelled knowingly, none padded |

---

## 6. THE FINAL CORPUS — the frozen north star's table of contents

**313 plates, 313 previews, all 4K 5056×3392, in `scratchpad/map-refs/`.**

| Class | n | Range | The plates a consumer should reach for first |
|---|---|---|---|
| Town band | 65 | hf21–hf385 | hf318 (wall shape), hf316 (naming), hf331 (dual jurisdiction), hf364 (grain ≠ plan), hf366 (trade by geometry), hf324 (planted town) |
| Terrain substrate | 36 | hf140–hf359 | hf142 spring line, hf146 marsh levels, hf356 downs/vale, hf349 karst, hf352 moor, hf353 taiga two-networks |
| City band | 24 | hf4–hf382 | hf235 canals, hf274 twin bridge, hf327 mud-brick, hf273 confluence, hf346 head of navigation |
| Zoom / plot scale | 23 | hf110–hf375 | hf120 burgage, hf340 mill works, hf342 civic knot, hf343 tanners, hf344 churchyard, hf345 bailey, hf311 gate suburb, hf375 wealth gradient (⛔ title) |
| Specimen dictionaries | 19 | hf206–hf390 | hf303 master key, hf379 ruin stages, hf378 density, hf320 streets, hf321 boundaries, hf377 waters, hf386 projections |
| Village band | 18 | hf3–hf335 | hf125 oasis, hf232 kraals, hf284 polder, hf283 vineyard |
| Stressor / state | 15 | hf165–hf372 | hf167 plague, hf166 fire ladder, hf372 siege (cured circuit), hf279 earthquake, hf281 drought |
| Settlement systems | 13 | hf36–hf381 | hf291 parish, hf360 commons, hf381 way network, hf371 grain catchment, hf370 fuel shed, hf368 water |
| Fantastical | 13 | hf175–hf247 | hf182 moonquay, hf179 dragon roost, hf244 necropolis, hf245 warded gate |
| Underground | 12 | hf84–hf301 | hf196 nightways (T-26), hf301 city under-leaf, hf190 cloaca, hf195 mines |
| Metropolis band | 9 | hf34–hf389 | **hf389 (new flagship)**, hf103 rings, hf105 ribbon |
| Lens / register | 9 | hf50–hf387 | hf338 unfinished survey, hf384 dark plan, hf278 winter, hf337 worn folio, hf387 mended sheet |
| Thorp band | 8 | hf10–hf90 | hf90 (the ink exemplar — never hf10) |
| Hamlet band | 7 | hf11–hf96 | hf93 plot series, hf95 bankside |
| Chrome / lettering | 6 | hf61–hf258 | hf257 border ladder, hf201 compass/scale, hf390 folio index, hf258 DM key |
| Tier series | 6 | hf215–hf242 | hf241 (demotion), hf242 (parcel persistence) |
| Trade routes | 5 | hf20–hf158 | hf157 portage, hf158 mountain pass |
| Institutions | 3 | hf233–hf310 | hf233 monastery, hf293 lazaret, hf310 cliff monastery |
| Image-ref experiments | 2 | hf255, hf299 | both POSITIVE — cross-sheet continuation works |
| Port enclaves | 1 | hf367 | treaty compounds |

### ⛔ SCRUB LIST — plates that must not be shown until their labels are replaced

Ordered by severity. All are drawing-sound; the fault is text only.

1. **hf375** — title reads *"the Ward of St. Osyth's Limehouse, London, anno Domini MCCCXCII"* and the
   watercourse is *"Fleet Ditch"*. A real city, district, watercourse, saint and date in one title block.
   The corpus's worst contamination, on one of its best drawings.
2. **hf292** — five real Anglo-Scottish Border names (Gilnockie, Newcastleton, Longtown, Coldstream,
   Mosstrooper's).
3. **hf348** — *"HIGHWAY TO LONDON"* on the plate's main road.
4. **Real river names**: hf190 Thames, hf170 Severn, hf318 Wear, hf368/hf383 Avon, hf372/hf374 Ouse.
5. **Culture-bake (whole-plate relabel needed)**: hf329 Italian, hf350 Latin/Italian, hf356 Latin,
   hf361 Latin. Use **hf373** as the cured hill-town exemplar instead of hf329.
6. **hf351** St Piran; hf353 "versts"; hf328 "varas"; hf249 "Scottish miles"; hf284 Dutch scale.
7. **Date leaks** (treat all numerals outside scale bars as unusable, per #21/#27): hf296 ×6, hf287,
   hf341 title, hf314 "Master Elias MCCCXCV", hf253, hf299, hf357 "Scale 1895".
8. **Crop before use** (drawn figures / elevation blocks): hf171 surveyor, hf148 putti, hf268 wrestler,
   hf306 triumphal-gate elevation, hf309 three elevation glyphs, hf310 donkeys, hf295 horse, hf298 camels.

---

## 7. ⭐ HOLDOUT NOMINATION (ODQ §234) — nominated, NOT decided; the chair rules

**53 plates of 313 (16.9%).** Selection rules I applied, for the chair to accept or override:

- **Excluded every plate used to derive a calibration figure or prove a counter-phrase** — the measured
  palette/value set, both halves of every A/B pair (hf135/hf139, hf140/hf142/hf262, hf316, hf317, hf318,
  hf329/hf373, hf337/hf387, hf347/hf385, hf248/hf276, hf280/hf302, hf256/hf277, hf194/hf198, hf131/hf137,
  hf133/hf138, hf169/hf173, hf218/hf241), and hf90, hf10, hf24, hf57 (the ink-law derivation).
- **Excluded every plate on the scrub list**, so the holdout needs no editing before use.
- **Excluded the eight symbol dictionaries and the three scale-contract plates** — they are the
  specification, not samples of it.
- **Spread across every band and category**, roughly proportional to class size, and weighted toward
  plates that are strong keepers but were never load-bearing for a rule.

**THORP / HAMLET (4):** hf87, hf89, hf92, hf94
**VILLAGE (5):** hf126, hf127, hf231, hf237, hf285
**TOWN (10):** hf129, hf130, hf132, hf240, hf267, hf269, hf272, hf275, hf288, hf333
**CITY (6):** hf134, hf136, hf273, hf289, hf326, hf346
**METROPOLIS (2):** hf102, hf105
**TERRAIN (8):** hf143, hf145, hf147, hf221, hf223, hf230, hf349, hf354
**ZOOM (5):** hf122, hf259, hf265, hf266, hf311
**STRESSOR (4):** hf168, hf172, hf234, hf282
**FANTASTICAL (3):** hf176, hf180, hf183
**UNDERGROUND (3):** hf191, hf192, hf195
**SYSTEMS (2):** hf294, hf312
**LENS / CHROME (1):** hf200

**Verified: 53 distinct plates, all present on disk, none on the scrub list, none an A/B or
figure-derivation plate.** (hf149 and hf286 were dropped from the draft for a real-world unit leak and a
date leak respectively; hf221 and hf134 replaced them. hf263 was dropped for a circled-numeral key;
hf266 replaced it.)

**Chair questions I did not answer:** (a) whether the 78 HF-4c plates should be eligible for holdout at
all, given that they share a prompt tail the other 235 do not — I included **five** of them (hf326,
hf333, hf346, hf349, hf354) and would accept a ruling that they be excluded entirely, which drops the
holdout to 48 (15.3%); (b) whether the holdout should be sealed from the renderer's authors or only from
the tuning pass.

---

## 8. ⚠ WHICH GRADINGS ARE OPUS-AUTHORED AND WANT FABLE RE-VALIDATION (§236)

Every row for **hf289–hf390 (102 plates)** is mine. Under §236 I mark the judgment-dense ones. The rest —
presence/absence of a feature, projection class, duplicate counts, leak identification — is observation,
not taste, and does not need re-validation.

**Judgment-dense and Fable-unvalidated — re-validate these first:**

- **The star ratings themselves.** I awarded ★★★ to 41 of my 78. HF-3's rate was much lower. Either the
  prompts genuinely improved (the specimen-sheet format and the enumeration cure both landed hard) or my
  bar is softer than Fable's. **This is the single most likely place my grading is wrong**, and it is
  cheap to check: re-grade any ten ★★★ plates and see whether the rate survives.
- **"Best in corpus" claims.** I made nine: hf303 (most consumable), hf338 (most novel), hf389 (new
  flagship, superseding hf103/hf104), hf386 (classification capstone), hf379 (cleanest specimen sheet),
  hf327 (best material-drives-geometry), hf356 (best settlement-geography reasoning), hf360+hf291 (best
  institutional geography), hf348 (best dating device). Each is a comparative aesthetic judgment across
  313 plates made by one reader in one sitting.
- **The three supersessions.** hf389 over hf103/hf104, hf385 over hf347, hf373 over hf329. The first is
  the consequential one: it retires the corpus's flagship metropolis.
- **Register-edge calls.** I flagged hf289 as the highest chroma in the corpus, hf355 as the darkest
  non-night plate, and hf300 as off-register. Where a plate sits against the §2.3 bar is exactly the kind
  of call the atlas expects a trained eye to make, and mine is not the trained eye. **No plate in this
  wave was measured with PIL** — HF-2 measured its palette figures; I did not. That is a real gap.
- **The "pale register" notes.** I called roughly a dozen plates pale or near-washless by eye. Unmeasured.

**Observation, not taste — take these as filed:** the scrub list, the projection classifications, the
eleven-oblique-failure pattern, every duplicate and garble count, and the counter-phrase results in §4,
which rest on incidence across 78 plates rather than on judgment.

---

## 9. JUDGED NOT WORTH MINTING, WITH WHY

- **A second gatehouse sheet to fix hf313's three elevation specimens.** The finding (elevation drift
  happens where the plan view is uninformative) is more useful than a cured plate, and the cure would
  need a plan-plus-section format the corpus has never validated.
- **A fourth image-reference experiment.** #20 is settled at n=4: continuation works (hf255, hf299),
  register transforms do not (hf254, hf300). More would not move it.
- **A deliberate teaching negative.** As in HF-3, organic failures filled the shelf — hf300, hf308,
  hf357, hf359 arrived free.
- **PIL measurement of the 78 new plates.** Deferred, not skipped: it is free, needs no subscription, and
  can be run at any time. **Recorded here as the one piece of unfinished work this lane leaves.**
- **More morphology diversity.** Eight new morphologies landed but four carry culture-bake notes. Another
  wave would have produced more plates needing relabelling, not fewer.

---

## 10. STANDING NOTES FOR WHOEVER CONSUMES THIS

1. **Read `laneHF-CALIBRATION.md` §HF-4c counter-phrases #24–#35 before generating anything with any
   other model.** #24 and #25 are the two that change results most.
2. **Never trust a numeral on any plate.** #15's scale rule, #21's date rule and #27 together mean: the
   only numerals that survived scrutiny are those on scale bars that carried the no-numerals instruction.
3. **Classify before you copy.** hf386 and hf376 exist so a consumer can tell a plan from a half-raised
   view from a bird's view from a picture map, and hachure from rock hatch from splayed hill from level
   line. Eleven plates in this corpus are not plan; they are labelled, and the labels are load-bearing.
4. **hf388's round settlement marks are a symbol convention, not a morphology claim.** The corpus now
   proves at n=6 that town walls are not round. Do not let the region-scale glyph teach the fabric.
5. **No git writes and no memory writes were made by this lane**, per the brief.
