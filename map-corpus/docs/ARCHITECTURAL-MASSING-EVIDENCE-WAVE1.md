# Architectural Massing Evidence for SettlementForge - Wave 1

**Program:** `AMP-1` discovery wave

**Status:** `EUROPEAN_FANTASY_BASE` contrastive discovery survey; `RESEARCH_ONLY`;
human-readable and not yet registry-backed; **not a calibrated architectural corpus**

**Survey date:** 2026-08-20

**Binding parent protocol:** `map-corpus/docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md`, section 9.2

**Runtime authority:** `map-corpus/docs/GENERATION-SPEC.md`, especially §§6.4, 7.1.2 and 10.22

This document addresses the evidential gap that town-plan atlases cannot close. A footprint can show
where a building met a street or parcel. It cannot by itself establish storeys, clear height, attic
occupation, roof structure, roof pitch, materials, internal range divisions, party-wall ownership,
functional volume, construction phase, repair history, or the difference between a tall hall and a
stack of floors.

**Town-plan pixels do not supply height.**

The governing conclusion is:

> Historically credible massing is a phase-owned assembly of functional parts under a local
> structural and material grammar. Height is not a prosperity multiplier, one footprint is not
> necessarily one building volume, and a present roof or facade is not necessarily the date of the
> fabric behind it.

Wave 1 establishes candidate mechanisms, counterexamples, an observation instrument, and a future
sampling law. It deliberately establishes **no frequencies, probability distributions, cultural
defaults, numeric generation constants, or runtime activation weights**.

---

## 1. Scope and evidence law

### 1.1 What was surveyed

The survey uses official or institutionally maintained sources whose subject is the building rather
than the town plan:

- measured standing-building reports and drawings;
- national architectural inventories and statutory records;
- fabric and building-archaeology descriptions;
- dendrochronology and radiocarbon reports;
- excavation and conservation reports;
- official regional vernacular-building inventories; and
- official records of warehouses, barns, merchant houses, institutions and dwellings.

The inspected cases span England, Wales, Scotland, Ireland, France, Germany, the Netherlands,
Denmark, Norway, Poland, Czechia, Italy and Spain, with medieval through twentieth-century fabric.
Later material is included where it provides a controlled witness for repair, functional massing,
earth construction, rebuilding, or recording bias. It is not silently projected backward.

### 1.2 What “Wave 1” means

The cases below were found and opened during discovery. They are therefore `PRIOR_SEEN`. None can be
placed in the future sealed holdout, and the set is not a representative sample of European
buildings. It is intentionally contrastive and over-represents structures that survived, were
listed, were repaired, exposed unusual fabric, or merited specialist study.

Each entry can do one or more of the following:

- prove that a massing or transformation mechanism is possible;
- expose a counterexample to an over-broad rule;
- define a field that the future measurement instrument must carry; or
- provide a development validation case after its source and rights are re-audited.

It cannot establish how often that mechanism occurred.

### 1.3 Inspection-depth vocabulary

| depth | meaning |
|---|---|
| **MEASURED REPORT** | A building-specific report with declared dimensions and/or measured plans, sections or elevations was inspected. |
| **SCIENTIFIC DATING** | A technical dendrochronology, radiocarbon or related report identifies the sampled element and dating result. |
| **FABRIC DEEP** | A detailed official record describes internal structure, phases, roofs, floors and material junctions. |
| **DETAILED INVENTORY** | A national or regional inventory record describes the building in enough detail to code bounded massing attributes, but is not a complete measured survey. |
| **OFFICIAL COMPLEX SYNTHESIS** | An official heritage account describes a complex and its functional organisation; it is not treated as member-level measurement. |
| **OFFICIAL OUTREACH SYNTHESIS** | An official heritage body summarises a project or result for public communication; it is a frame lead, not the underlying technical roster or measurement package. |
| **TYPOLOGICAL INVENTORY** | An official field survey describes a declared group or type and sometimes a measured range; it is not a probability sample unless its sampling frame says so. |
| **SCHOLARLY TYPOLOGICAL STUDY** | A named scholarly study describes a declared building type or comparison set; institutional repository hosting does not turn it into an official inventory or a probability sample. |
| **CONSERVATION PLAN** | A statutory or official conservation document describes relevant fabric and rebuilding, but its primary purpose is planning or management. |

Depth is not a quality score. A precise scientific date can still apply only to one reused timber;
a detailed inventory can describe visible massing while leaving hidden party walls unknown.
These labels are human-reading shorthand for Wave 1, not the future machine schema. `AMP-1` must
store source role, package/inspection depth, observation or measurement basis, dating method and
sampled component, epistemic certainty/bounds, component scope, coverage/omissions, and rights/use
as independent fields rather than collapsing them into one label.

### 1.4 Rights boundary

This document stores citations, concise factual paraphrases and hand-authored mechanism statements.
It stores no source pixels, traced footprints, copied sections, roof meshes, facade textures or
decorative motifs. Even where a source exposes open metadata or an open licence, geometry and imagery
remain citation-only until a separate owner-reviewed rights and lineage record authorises ingestion.

The following uses are forbidden for every Wave 1 entry:

```text
DIRECT_GEOMETRY_COPY
PIXEL_STYLE_COPY
UNIVERSAL_RULE
UNREGISTERED_PREVALENCE_PRIOR
```

---

## 2. Contrastive source and case matrix

### Atlantic archipelago

#### `AM-GB-01` - Upton Cressett Hall, Shropshire, England

- **Source and depth:** Historic England, National Heritage List entry 1190045, **FABRIC DEEP** with
  reported dendrochronology: [official record](https://historicengland.org.uk/listing/the-list/list-entry/1190045).
- **Bounded observation:** The surviving house includes a timber-framed open aisled hall dated
  1428-31, a four-bay solar range, the surviving six-bay cross wing dated around 1498, and distinct
  crown-post, arch-braced/queen-post and queen-post roof systems. In 1580 the house was encased in
  brick, major stacks were added and the open hall was probably ceiled to create first-floor rooms.
  It now reads as two storeys and attics with basements in parts.
- **Uncertainty and counterexample:** Demolition of part of the hall means the original complete plan
  is not certain; an earlier/original additional cross-wing arrangement and the published H-plan
  suggestion remain reconstructions. High status did not produce one uniform construction campaign
  or one roof.
- **Candidate test:** `ACCRETIONAL_RANGE`, `OPEN_HALL_FLOOR_INSERTION`, `MATERIAL_ENCASEMENT`,
  `ROOF_BY_PART`, and `PHASE_VARIANCE_NOT_PATCHWORK`.

#### `AM-GB-02` - 31 High Street, Hastings, England

- **Source and depth:** Historic England, National Heritage List entry 1392918, **FABRIC DEEP**:
  [official record](https://historicengland.org.uk/listing/the-list/list-entry/1392918).
- **Bounded observation:** Two surviving bays belonged to a fifteenth-century Wealden hall house
  with an open central hall and two-storey jettied end bays. A hall floor was inserted in the late
  sixteenth century, ceilings followed in upper chambers, the building was subdivided, one bay was
  lost and rebuilt as its neighbour, and later cross and rear ranges were attached. Raised eaves and
  a dual-raked roof record adaptation to an added upper floor.
- **Uncertainty and counterexample:** Most roof fabric was replaced during repair, and the service
  arrangement of the lost bay is inferred. A current two-storey-and-attic silhouette is not a direct
  image of the original open hall.
- **Candidate test:** `SUBDIVIDE_SHARED_FABRIC`, `RAISE_EAVES_FOR_INSERTED_FLOOR`,
  `LATER_RANGE_BUTT_JOINT`, and explicit `SURVIVAL_MASK` by part.

#### `AM-GB-03` - Great Hall, Old Palace, Croydon, England

- **Source and depth:** Historic England, National Heritage List entry 1079296, revised 2025,
  **FABRIC DEEP**: [official record](https://historicengland.org.uk/listing/the-list/list-entry/1079296?section=official-list-entry).
- **Bounded observation:** The institutional hall is a broad four-bay volume beneath one elaborate
  mid-fifteenth-century single-span arch-braced roof. Pine tie beams reinforced it in 1748; the east
  wall collapsed and was rebuilt in 1830; the hall was also adapted for industrial use before later
  restoration. Flint, stone dressings, brick patching and timber belong to different elements and
  campaigns.
- **Uncertainty and counterexample:** Four bays do not mean four storeys or four domestic units. A
  tall institutional hall must be modelled as functional clear volume, not inferred floor stacking.
- **Candidate test:** `TALL_CLEAR_VOLUME`, `INSTITUTIONAL_CAPITAL_SEPARATION`,
  `STRUCTURAL_REINFORCEMENT_WITHOUT_REROOF`, and `COLLAPSE_REBUILD_PART`.

#### `AM-GB-04` - St Margaret's Chapel roof, St Nicholas' Church, Newcastle, England

- **Source and depth:** Historic England Research Report 77/2018, **SCIENTIFIC DATING**:
  [official report page](https://historicengland.org.uk/research/results/reports/77-2018).
- **Bounded observation:** A 302-year tree-ring sequence, resolved by radiocarbon wiggle matching,
  showed that roof timbers previously thought medieval were probably felled in the early nineteenth
  century.
- **Uncertainty and counterexample:** Apparent stylistic or building-age association cannot date a
  roof. Scientific dating applies to the sampled timbers, not automatically every connected member.
- **Candidate test:** `ROOF_DATE_INDEPENDENT_OF_WALL_DATE` and a hard refusal of
  `BUILDING_FOUNDATION_DATE -> ALL_PART_DATES`.

#### `AM-GB-05` - The Forge and house, Market Bosworth, England

- **Source and depth:** Historic England, National Heritage List entry 1482523, **FABRIC DEEP**:
  [official record](https://historicengland.org.uk/listing/the-list/list-entry/1482523).
- **Bounded observation:** The late-eighteenth-century street pair puts unlike vertical programmes
  in abutting brick fabric: the house has two square storeys, cellar and attic, while the forge is
  one storey beneath a pitched roof with attic storage. They meet at a straight joint but share a
  chimney stack. Two successively added rear workshops turn the working complex into an L and the
  combined property into a U: the earlier workshop is open to a mono-pitch roof; the broader later
  workshop has a shallow steel-truss roof and only a partial mezzanine. Yard, well, hearths and
  internal fittings make the work function independently observable rather than inferred from
  footprint shape.
- **Uncertainty and counterexample:** Maps bracket the first rear workshop between 1886 and 1903
  and the larger replacement/addition by 1958; the late-twentieth-century house wing is also rebuilt.
  The U is therefore a phased functional aggregate, not an original unitary design. Historic England
  notes that many blacksmith workshops were demolished or converted, making the survivor a warning
  against treating present inventory proportions as former frequency.
- **Candidate test:** `HOUSE_WORKSHOP_DIFFERENT_STOREY_PROGRAMME`,
  `SHARED_STACK_ACROSS_STRAIGHT_JOINT`, `ATTIC_STORAGE_OVER_FORGE`,
  `MONOPITCH_OPEN_WORKSHOP`, `PARTIAL_WORKSHOP_MEZZANINE`, and
  `FUNCTION_SPECIFIC_REAR_ADDITION`.

#### `AM-GB-WA-05` - Plas Pengwern, Ffestiniog, Wales

- **Source and depth:** Royal Commission on the Ancient and Historical Monuments of Wales, Coflein
  NPRN 28631, **FABRIC DEEP + SCIENTIFIC DATING**:
  [official record](https://coflein.gov.uk/en/sites/28631).
- **Bounded observation:** A roughly H-plan stone house preserves a smoke-blackened four-bay
  timber-framed cross wing. Primary felling dates cluster in 1478-79; repairs or alterations include
  1493 and later sixteenth-century ranges, while a kitchen phase is dated after 1483. The surviving
  roof contains tenoned ridge and purlins with two tiers of cusped wind braces.
- **Uncertainty and counterexample:** The visible stone envelope does not describe the building's
  original structural material. Reused purlins and multiple dated repairs prevent one timber date
  from becoming a whole-building date.
- **Candidate test:** `TIMBER_CORE_WITH_LATER_STONE_ENVELOPE`, `DATED_REPAIR_EVENT`,
  `REUSED_MEMBER`, and `PHASED_CROSS_WING`.

#### `AM-GB-WA-06` - Cwm Farm, Ffestiniog, Wales

- **Source and depth:** RCAHMW Coflein NPRN 28320 with linked dendrochronology and architectural
  records, **FABRIC DEEP**: [official record](https://coflein.gov.uk/en/sites/28320).
- **Bounded observation:** The house is described as a three-unit cruck-framed hall house with a
  two-bay central hall, later stone rubble walls, a slate gabled roof, a seventeenth-century inserted
  floor and a fireplace/chimney inserted around an earlier arch-braced truss.
- **Uncertainty and counterexample:** Chimney, floor, external wall and primary frame need not share
  one phase. The current roof covering is not evidence for the primary covering.
- **Candidate test:** `INSERT_HEARTH_AROUND_FRAME`, `INSERT_FLOOR_IN_OPEN_HALL`,
  `STRUCTURE_CLADDING_SEPARATION`, and `THREE_UNIT_HALL_GRAMMAR` as a bounded possibility only.

#### `AM-GB-SC-07` - Old Leckie, Stirling, Scotland

- **Source and depth:** Historic Environment Scotland Canmore site 45384, based on RCAHMS inventory,
  **DETAILED INVENTORY**: [official record](https://canmore.org.uk/site/45384/old-leckie).
- **Bounded observation:** The sixteenth-century main block is recorded as three storeys and attic,
  62 ft by 25 ft 2 in; a south wing is four storeys, 22 ft 2 in by 13 ft 11 in; an eighteenth-century
  east wing is two storeys, 29 ft by 25 ft 2 in. The complex uses local red sandstone rubble, harling,
  dressed margins, slated roofs and crow-stepped gables.
- **Uncertainty and counterexample:** One semantic house contains parts with different footprints,
  storey counts, ages and stair towers. A scalar `Building.height` would erase this evidence.
- **Candidate test:** `PART_LOCAL_STOREYS`, `STAIR_TOWER_CONNECTOR`, `LOCAL_STONE_SOURCE`, and
  `WING_HEIGHT_INDEPENDENCE`.

#### `AM-GB-SC-08` - Simprim Farm barn and house, Scottish Borders

- **Source and depth:** Historic Environment Scotland Canmore site 59560, **DETAILED INVENTORY**:
  [official record](https://canmore.org.uk/site/59560/simprim-farm).
- **Bounded observation:** The surviving barn is more than 64 m long and almost 8 m wide. It was
  originally four storeys, retains evidence of the removed upper level, has five entrance bays and a
  dated 1686 stair wing. The associated house is a separate three-storey L-plan volume.
- **Uncertainty and counterexample:** Agricultural storage can be longer and vertically organised in
  a way that has no domestic-storey analogue. Its present three-storey state is loss, not the original
  design.
- **Candidate test:** `FUNCTIONAL_STORAGE_VERTICALIZATION`, `LOST_UPPER_STOREY`,
  `EXTERNAL_STAIR_SERVICE`, and `BARN_NOT_HOUSE_GRAMMAR`.

#### `AM-IE-09` - Rothe House, Kilkenny, Ireland

- **Source and depth:** National Inventory of Architectural Heritage record 12000025,
  **DETAILED INVENTORY**: [official record](https://www.buildingsofireland.ie/buildings-search/building/12000025/rothe-house-15-16-parliament-street-gardens-st-johns-par-kilkenny-co-kilkenny).
- **Bounded observation:** The merchant complex was built in phases from 1594 to 1610. It combines a
  five-bay two-storey-over-basement street house with dormer attic, two- and three-storey linking and
  parallel ranges, an arcade, carriage passage, two cobbled courtyards and a one-storey lean-to
  outbuilding range.
- **Uncertainty and counterexample:** The record warns that the complex was continuously altered and
  later restored to an approximate representation of its original form. The present appearance is
  not an untouched 1610 observation.
- **Candidate test:** `MERCHANT_COURTYARD_SEQUENCE`, `RANGE_FUNCTION_DIFFERENTIATION`,
  `CARRIAGE_PASSAGE_THROUGH_FRONTAGE`, and `RESTORATION_STATE`.

### Western continental Europe

#### `AM-FR-10` - Zur Kannen complex, Strasbourg, France

- **Source and depth:** French Ministry of Culture POP/Mérimée notice IA67010817,
  **DETAILED INVENTORY**: [official record](https://pop.culture.gouv.fr/notice/merimee/IA67010817).
- **Bounded observation:** Four buildings are separated by three courtyards and joined by galleries.
  The quay building has a masonry ground floor and three jettied timber-framed storeys. Another
  range has two timber-framed storeys above masonry plus a large inhabited roof dormer; galleries
  and court-facing frames record later closure and alteration.
- **Uncertainty and counterexample:** A deep plot complex is not one extruded street-front block.
  Roof-level occupation must be recorded separately from a full square storey.
- **Candidate test:** `MULTI_COURT_DEEP_PLOT`, `GALLERY_CONNECTOR`, `MASONRY_BASE_TIMBER_UPPER`,
  and `OCCUPIED_ROOF_LEVEL`.

#### `AM-FR-11` - Timber-framed houses of Roquecourbe, Tarn, France

- **Source and depth:** French Ministry of Culture POP/Mérimée notice IA81012374,
  **TYPOLOGICAL INVENTORY**: [official record](https://pop.culture.gouv.fr/notice/merimee/IA81012374).
- **Bounded observation:** The inventory distinguishes a modular urban house whose recorded frontage
  varies from about 4.5 to 7.5 m and depth from about 6 to 7.5 m, commonly one room per level, from
  larger strategically placed houses. It records basements, up to two square storeys, overhangs,
  rear light gaps/courts, tile roofs and mixed brick, earth, timber, masonry and schist.
- **Uncertainty and counterexample:** These ranges come from an official local inventory, not a
  probability sample of France or even all Roquecourbe buildings. The row licenses fields and
  development tests, not default dimensions.
- **Candidate test:** `FRONTAGE_MODULE_WITH_LARGER_EXCEPTION`, `ONE_ROOM_PER_LEVEL`,
  `LIGHT_GAP_OR_SMALL_COURT`, and a future within-settlement size cohort.

#### `AM-FR-12` - Merchant house with pondalez, Morlaix, France

- **Source and depth:** French Ministry of Culture POP/Mérimée notice IA22132865,
  **DETAILED INVENTORY**: [official record](https://pop.culture.gouv.fr/notice/merimee/IA22132865).
- **Bounded observation:** The narrow, deep merchant house has two square storeys and an attic. The
  street facade alone is timber-framed and jettied; street and rear rooms were once connected by
  internal galleries or pondalez, later removed, and a secondary spiral stair was added at the rear.
  The plot widens irregularly toward the court.
- **Uncertainty and counterexample:** Removing an internal connector changes circulation without
  requiring a new footprint. A regular street facade does not imply a regular rear mass.
- **Candidate test:** `VERTICAL_GALLERY_CONNECTOR`, `NARROW_FRONT_DEEP_REAR`,
  `REAR_STAIR_INSERTION`, and `FACADE_MATERIAL_NOT_WHOLE_BODY_MATERIAL`.

#### `AM-DE-13` - Granary at Dedendorf 2, Lower Saxony, Germany

- **Source and depth:** Lower Saxony State Office for Heritage, Denkmalatlas object
  a8b55b3c-2a97-471e-966b-08ab03926dd9, **DETAILED INVENTORY + SCIENTIFIC DATING**:
  [official record](https://denkmalatlas.niedersachsen.de/viewer/metadata/a8b55b3c-2a97-471e-966b-08ab03926dd9/1/).
- **Bounded observation:** The small economic building is a one-and-a-half-storey timber frame under
  a gable roof, dendrochronologically dated to 1575. Original earth/stake infill was later replaced
  with brick.
- **Uncertainty and counterexample:** One-and-a-half storeys and an attic/storage level cannot be
  normalised to an ordinary two-storey dwelling. Current infill does not identify original material.
- **Candidate test:** `HALF_STOREY_STORAGE`, `INFILL_REPLACEMENT`, and
  `DENDRO_DATE_COMPONENT_SCOPED`.

#### `AM-DE-14` - Medieval house in Horb am Neckar, Baden-Württemberg, Germany

- **Source and depth:** Baden-Württemberg State Heritage Office, official historic-area value plan,
  **CONSERVATION PLAN**: [official Horb value plan PDF](https://www.denkmalpflege-bw.de/fileadmin/media/denkmalpflege-bw/denkmale/projekte/bau-und-kunstdenkmalpflege/02_praxisorient_vertiefung_denkmalwissen/denkmalpflegerische_wertplaene/denkmalpflegerischer__werteplan_horb.pdf).
- **Bounded observation:** The plan records a two-storey, eaves-facing timber-framed house on a steep
  slope with a substantial rubble-stone base and a dendrochronological date of 1366/67. Later
  modernisation changed its vertical arrangement.
- **Uncertainty and counterexample:** Slope can make a base or lower level visible on one side and
  buried on another. Apparent facade storeys must not be equated with interior levels without a
  section.
- **Candidate test:** `SLOPE_DEPENDENT_BASE`, `EAVES_FRONTED_TIMBER_VOLUME`, and
  `FACADE_STOREY_COUNT_REQUIRES_SECTION`.

#### `AM-NL-15` - Springweg 8, Utrecht, Netherlands

- **Source and depth:** Netherlands Cultural Heritage Agency, monument 450555,
  **FABRIC DEEP**: [official record](https://monumentenregister.cultureelerfgoed.nl/monumenten/450555).
- **Bounded observation:** Behind a later facade was a large medieval front house of two levels over
  a raised cellar, roofed parallel to the street between stepped gables, plus a substantial rear
  building under a tent roof. Around 1930 the roofs were removed and an extra floor with flat roof
  substituted.
- **Uncertainty and counterexample:** The present flat-roofed storey count is a transformation, not
  the medieval mass. One parcel contains front and rear bodies with independent roofs.
- **Candidate test:** `FRONT_HOUSE_REAR_HOUSE`, `ROOF_REMOVAL_ADD_STOREY`,
  `RAISED_CELLAR`, and `ROOF_ORIENTATION_BY_PART`.

#### `AM-NL-16` - Bakkerstraat 24, Arnhem, Netherlands

- **Source and depth:** Netherlands Cultural Heritage Agency, monument 8302,
  **FABRIC DEEP**: [official record](https://monumentenregister.cultureelerfgoed.nl/monumenten/8302).
- **Bounded observation:** Fifteenth-century brick side and rear walls survive behind an
  eighteenth-century street facade. The front roof is an eighteenth-century assembly of seven pine
  tie-beam trusses; the rear house is partly seventeenth century with a separate two-truss roof and
  older floor structure.
- **Uncertainty and counterexample:** Facade date, wall date, rear-house date and roof date differ.
  A visual style classifier would misdate the body and collapse several phases.
- **Candidate test:** `FACADE_REPLACEMENT_WITH_CORE_SURVIVAL`, `FRONT_REAR_ROOF_PHASES`, and
  `ASSEMBLY_DATE_VECTOR` rather than one construction year.

#### `AM-NL-17` - De Nederlanden distillery warehouses, Schiedam, Netherlands

- **Source and depth:** Netherlands Cultural Heritage Agency, monument 525391,
  **FABRIC DEEP**: [official record](https://monumentenregister.cultureelerfgoed.nl/monumenten/525391).
- **Bounded observation:** Coupled warehouses use heavy composite timber floor beams, brick at ground
  level and timber floors above. Each warehouse roof has three timber Belgian or V trusses tied by
  longitudinal beams and posts; sliding doors connect units, while a lower one-storey warehouse
  under a gable roof adjoins the group.
- **Uncertainty and counterexample:** Industrial floor loading and wide storage structure are not
  domestic massing proxies. Connectivity between nominal buildings can be internal and movable.
- **Candidate test:** `WAREHOUSE_HEAVY_FRAME`, `REPEATED_STRUCTURAL_BAY`,
  `INTERBUILDING_SLIDING_CONNECTION`, and `LOW_SERVICE_RANGE`.

### Nordic Europe

#### `AM-NO-18` - Panengstuen cottage, Østre Toten, Norway

- **Source and depth:** Riksantikvaren building documentation by Vegard Røhme (2014),
  **MEASURED REPORT**: [official PDF](https://riksantikvaren.no/content/uploads/2020/12/Panengstuen-Dokumentasjon.pdf).
- **Bounded observation:** The non-destructive survey records an external footprint about 5.9 by
  8.4 m, sill-to-eaves height about 2.1 m and gable rise about 2.5 m. The original plan drawing is
  1:50 and explicitly says distortions were not measured. A roughly 4.6 by 4.8 m reused log box is
  combined with timber framing infilled with split wood and brick; the steep rafter roof permits one
  attic chamber. Roof layers include wood under tiles.
- **Uncertainty and counterexample:** This is one carefully measured cottage, not a Norwegian
  cottage template. Reused timbers, replaced lower logs and mixed repairs prevent material mixture
  from serving as a simple prosperity label.
- **Pitch discipline:** The declared wall width and gable rise imply roughly 40 degrees only if the
  roof is symmetric and the external wall width approximates horizontal rafter run. Eave overhang,
  ridge offset and true bearing points are not declared, so this derived value is an assumption test,
  not an observed roof pitch and not a calibratable constant.
- **Candidate test:** a development-only metric fixture for `WALL_EAVE_RIDGE_SEPARATION`,
  `PARTIAL_OCCUPIED_ATTIC`, `MIXED_WALL_SYSTEM`, `REUSED_LOG_BOX`, and measurement-quality flags.

#### `AM-NO-19` - Bryggen, Bergen, Norway

- **Source and depth:** Riksantikvaren, **OFFICIAL COMPLEX SYNTHESIS**:
  [official account](https://www.riksantikvaren.no/arbeidsomrader/verdensarv/bryggen-i-bergen/),
  corroborated by the [UNESCO World Heritage record](https://whc.unesco.org/en/list/59/).
- **Bounded observation:** Long narrow commercial rows run gable-first from the harbour. Houses are
  commonly two or three storeys, with log-built rooms and post-and-beam galleries along shared
  passages; harbour sheds, upper dwellings, mid-row storage, rear assembly/kitchen buildings and
  one- or two-storey fire-resistant stone cellars have different functional masses. After the 1702
  fire, rebuilding followed earlier property structure and traditional methods.
- **Uncertainty and counterexample:** Today's wooden buildings post-date 1702 even though the row
  structure has medieval roots. Only about a quarter of the earlier complex survives after fires and
  clearance. The site is evidence for persistence through rebuild, not direct survival of every
  medieval superstructure.
- **Candidate test:** `FIRE_REBUILD_ON_PERSISTENT_PARCEL`, `GABLE_FIRST_COMMERCIAL_ROW`,
  `FUNCTION_ZONED_DEPTH`, `FIREPROOF_REAR_STORE`, and a mandatory `SURVIVAL_FRACTION_UNKNOWN`
  outside the site-specific account.

#### `AM-DK-20` - Mads Lerches Gård and merchant complexes, Nyborg, Denmark

- **Source and depth:** Nyborg Kommune, Local Plan 142, hosted by the Danish heritage agency,
  **CONSERVATION PLAN**: [official PDF](https://slks.dk/fileadmin/user_upload/kulturarv/fysisk_planlaegning/dokumenter/lp_142_Nyborg2.pdf).
- **Bounded observation:** Mads Lerches Gård is described as three seventeenth-century two-storey
  timber-framed wings with projecting upper storeys. The plan explains that merchant properties
  combined street house, courtyard and warehouses. It also records post-1797 rebuilding with more
  masonry and fire walls.
- **Uncertainty and counterexample:** This management document is not a measured survey of every
  wing. Fire regulation can change material and separation while a merchant-complex function
  persists.
- **Candidate test:** `THREE_WING_MERCHANT_YARD`, `POST_FIRE_MASONRY_SHIFT`,
  `FIREWALL_INSERTION`, and `HAZARD_REGULATION_AS_PHASE_CAUSE`.

### Central and eastern Europe

#### `AM-PL-21` - Skomlin granary, Łódź region, Poland

- **Source and depth:** National Heritage Board of Poland, Zabytek.pl,
  **DETAILED INVENTORY**: [official record](https://zabytek.pl/en/obiekty/skomlin-spichlerz).
- **Bounded observation:** The eighteenth-century wooden granary is two storeys on an elongated
  rectangle beneath a high gable roof. Mixed post-and-plank and log construction sits on brick
  foundations; two rows of posts and braces support single-space floors. A small porch has its own
  mono-pitch roof. Wood shingles were replaced by roofing felt.
- **Uncertainty and counterexample:** Roof covering and original structural form have different
  histories. Large undivided storage floors and ladder access are function-specific.
- **Candidate test:** `GRANARY_POST_GRID`, `HIGH_STORAGE_ROOF`, `PORCH_SHED_PART`, and
  `ROOF_COVERING_REPLACEMENT`.

#### `AM-PL-22` - Koło riverside granary, Greater Poland

- **Source and depth:** National Heritage Board of Poland, Zabytek.pl,
  **FABRIC DEEP**: [official record](https://zabytek.pl/en/obiekty/kolo-spichlerz).
- **Bounded observation:** The two-storey timber granary has structurally independent ground and
  upper storeys, a high gable roof, beamed ceilings on two rows of braced posts, former exterior
  upper access and tanks about 1.3 m deep below the ground floor. It is the sole survivor of a much
  larger riverside group lost through fire, demolition and redevelopment.
- **Uncertainty and counterexample:** A surviving singleton cannot provide a frequency or typical
  spacing for the vanished group. Independent storey frames challenge a single continuous-wall
  assumption.
- **Candidate test:** `INDEPENDENT_STOREY_FRAME`, `BELOW_FLOOR_STORAGE`,
  `EXTERNAL_UPPER_ACCESS`, and a strong `SURVIVOR_OF_LOST_POPULATION` flag.

#### `AM-PL-23` - Loitz family townhouse, Szczecin, Poland

- **Source and depth:** National Heritage Board of Poland, Zabytek.pl,
  **DETAILED INVENTORY**: [official record](https://zabytek.pl/en/obiekty/szczecin-4676757).
- **Bounded observation:** The brick and plaster merchant house has a four-storey main body under a
  tall gable roof, a stair tower, and a three-storey side building that reaches similar absolute
  height because it stands higher on a slope. A post-war two-storey body now occupies the former
  yard.
- **Uncertainty and counterexample:** Storey count does not determine skyline height across sloping
  ground. Current court infill is later than the historic merchant body.
- **Candidate test:** `ABSOLUTE_HEIGHT_FROM_ZBASE_PLUS_PART`, `SLOPE_STOREY_OFFSET`,
  `STAIR_TOWER`, and `COURTYARD_INFILL_EVENT`.

#### `AM-CZ-24` - Historic roof corpus, Cheb, Czechia

- **Source and depth:** Czech National Heritage Institute account of a systematic town-house roof
  survey, **OFFICIAL OUTREACH SYNTHESIS**:
  [official account](https://www.npu.cz/en/heritage-conservation/services/repairing-a-historical-building/get-inspired/34212-under-the-cheb-roofs-tour-a-trip-through-centuries).
- **Bounded observation:** Since 2015 the project has documented more than 130 roof structures in 90
  houses, including medieval, Renaissance, Baroque and modern structures; the oldest documented
  trusses date to the late fourteenth century. The account also identifies insensitive replacement
  of parts in at least one Gothic roof.
- **Uncertainty and counterexample:** The published counts describe the surveyed Cheb project, not
  European prevalence and not necessarily an outcome-blind frame. A roof can survive above a much
  altered house, or be damaged by later replacement.
- **Candidate test:** this program is a strong future `AMP-1` frame lead, with observations nested
  by house and roof campaign; the actual roster, selection method and technical reports must be
  obtained before cohort use, and the public count must not be treated as 130 independent sites.

#### `AM-CZ-25` - House no. 26, Holešov, Czechia

- **Source and depth:** Czech National Heritage Institute building-archaeology notice,
  **FABRIC DEEP + SCIENTIFIC DATING**: [official account](https://npu.cz/cs/pamatkova-pece/sluzby-pro-verejnost/opravujete-pamatku/inspirujte-se/23426-objev-pozdne-gotickeho-sklepa-s-tramovym-stropem-v-dome-cp-26-na-namesti-dr-e-benese-v-holesove).
- **Bounded observation:** A late Gothic cellar with timber ceiling was exposed during work. Oak
  ceiling beams dated to 1480-82, while other wooden construction dated to 1743/44.
- **Uncertainty and counterexample:** Hidden lower fabric can preserve a phase absent from the
  current facade. A sampled ceiling date does not date the roof or whole house.
- **Candidate test:** `HIDDEN_SUBSTRUCTURE_PHASE`, `DENDRO_SCOPE_ELEMENT`, and
  `MULTIPLE_TIMBER_CAMPAIGNS`.

### Southern and Mediterranean Europe

#### `AM-IT-26` - Casa Manca, Quartucciu, Sardinia, Italy

- **Source and depth:** Italian Ministry of Culture, national catalogue record 2000232862,
  **DETAILED INVENTORY**: [official record](https://catalogo.beniculturali.it/detail/SARDEGNA/ArchitecturalOrLandscapeHeritage/2000232862).
- **Bounded observation:** The main street range is recorded as about 17 by 5 m, two storeys and
  about 9 m high, with a timber-and-cane gable roof. Ground-floor walls use mixed fieldstone with
  lime and earth; the upper level uses regular courses of unfired earth brick, with fired brick at
  openings and corners.
- **Uncertainty and counterexample:** The catalogue chronology is broad (`XX`), so this entry cannot
  be assigned a precise historical period without another source. High-status or two-storey
  construction does not require an all-stone envelope.
- **Candidate test:** `MATERIAL_BY_VERTICAL_ZONE`, `EARTH_UPPER_STOREY`, `FIRED_BRICK_DETAIL`, and
  a direct counterexample to `WEALTH_OR_HEIGHT -> STONE`.

#### `AM-IT-27` - Rustico Casa Palladini, Trivignano Udinese, Italy

- **Source and depth:** Italian Ministry of Culture, national catalogue record 0600042138,
  **DETAILED INVENTORY**: [official record](https://catalogo.beniculturali.it/detail/ArchitecturalOrLandscapeHeritage/0600042138).
- **Bounded observation:** The rural complex forms a Z-shaped assembly of house, perpendicular
  two-storey service building, courts and gardens. The service range combines stone, brick and cut
  masonry under a timber roof with tiles; a court-side lean-to has a separate timber structure on
  stone columns.
- **Uncertainty and counterexample:** Broad eighteenth-century dating and a catalogue description do
  not resolve each wall campaign. Mixed masonry can be normal construction, not decay.
- **Candidate test:** `RURAL_SERVICE_RANGE`, `COURT_ORTHOGONAL_ATTACHMENT`,
  `LEAN_TO_ON_COLUMNS`, and `MIXED_MASONRY_NOT_CONDITION`.

#### `AM-ES-28` - Traditional courtyard houses of Ronda, Andalusia, Spain

- **Source and depth:** Andalusian Institute of Historical Heritage cultural-landscape record,
  **TYPOLOGICAL INVENTORY**: [official PDF](https://repositorio.iaph.es/bitstream/11532/325061/5/Ficha_tecnica_paisaje_interes_cultural_ronda_malaga.pdf).
- **Bounded observation:** The official landscape account identifies a two-storey, two-slope-roofed
  courtyard dwelling tradition derived through transformation of earlier courtyard houses, while
  noting uneven survival of agriculture-related traditional architecture.
- **Uncertainty and counterexample:** This is a landscape-level type statement, not a measured
  building cohort. It can seed candidate fields but no plan ratio, pitch or frequency.
- **Candidate test:** `COURTYARD_DWELLING_TRANSFORMATION` and an explicit requirement to sample both
  surviving and lost/altered rural-urban examples.

#### `AM-ES-29` - Popular houses of Seville province, Spain

- **Source and depth:** a 2019 named-researcher conference paper deposited in the Andalusian
  Institute of Historical Heritage repository, **SCHOLARLY TYPOLOGICAL STUDY**:
  [repository PDF](https://repositorio.iaph.es/bitstream/11532/328861/1/13_capitulo%20casa%20popular%20congreso%20granada.pdf)
  ([catalogue record](https://repositorio.iaph.es/handle/11532/328861)).
- **Bounded observation:** The documented modest-house grammar alternates built double-depth bodies
  with entrance passage, patio, intermediate body and rear corral. It is commonly ground-floor
  living space with upper storage over parts of the frontage, using load-bearing tapial, brick or
  occasional masonry walls reported around 45-75 cm thick, timber floors and pitched tile roofs.
- **Uncertainty and counterexample:** The source is an inventory synthesis, not a universal Andalusian
  house. Upper storage must not be counted as a full inhabited storey, and wall-thickness ranges may
  not become engine constants without a preregistered eligible cohort.
- **Candidate test:** `BUILT_VOID_SEQUENCE`, `PARTIAL_UPPER_STORAGE`, `EARTH_LOADBEARING_WALL`, and
  `PATIO_CORRAL_FUNCTION_DIFFERENCE`.

---

## 3. Cross-case findings and forbidden generalisations

### 3.1 Findings licensed as possibilities

| candidate mechanism | strongest witnesses | bounded implication |
|---|---|---|
| **One semantic building, many mass parts** | Upton Cressett, Old Leckie, Rothe House, Springweg 8 | `MassBody` needs phase-owned ranges, wings, halls, towers, lean-tos and rear bodies; a single extrusion is evidentially inadequate. |
| **Function controls vertical grammar** | Croydon hall, Simprim barn, De Nederlanden, Skomlin, Koło | Hall clear volume, storage floor, warehouse frame, attic and domestic storey are different states even when their exterior heights resemble one another. |
| **Roofs belong to parts and campaigns** | Upton Cressett, St Nicholas, Springweg, Bakkerstraat 24, Panengstuen | Roof form, covering, pitch evidence and construction date must be component-local; walls cannot donate their date to a replacement roof. |
| **Open volume can become stacked floors** | Upton Cressett, Hastings, Cwm Farm | Floor insertion is a dated transformation that changes capacity and eaves/roof relationships without requiring a new footprint. |
| **Courtyard complexes accrete ranges** | Rothe House, Strasbourg, Mads Lerches Gård, Casa Palladini, Seville synthesis | Court, passage, gallery and service range are topology, not decorative negative space. Each range may carry its own height, roof and function. |
| **Front and rear bodies can be independent** | Morlaix, Springweg, Bakkerstraat 24 | One parcel or facade may conceal multiple structural bodies, roofs and dates. |
| **Materials vary by component and vertical zone** | Plas Pengwern, Dedendorf, Casa Manca, Panengstuen | Structure, infill, cladding, base, upper wall and covering require separate material fields. Mixed material is not automatically poverty or decay. |
| **Repair, encasement and rebuilding preserve some inherited facts** | Upton Cressett, Bryggen, Nyborg, Springweg | A transformation may retain parcel/range organisation while replacing walls, roof or superstructure; provenance must say what persisted. |
| **Terrain changes apparent storeys and absolute height** | Horb, Loitz townhouse | Storey count is body-local; world height requires `zBase`, eaves and ridge, not facade floors alone. |
| **Reused timber breaks naive dating** | Plas Pengwern, Panengstuen; supported methodologically by the scientific-dating cases | A timber date is scoped to a sampled member; reuse and repair states must be first-class. |

### 3.2 Findings that Wave 1 does **not** license

The following would be overclaims:

- `height = base + prosperity * k`;
- a European, national or culture-name distribution of storey counts;
- one roof pitch for “medieval,” “northern,” “timber,” “stone,” or any other style label;
- a roof-form frequency table derived from these cases;
- “rich means stone,” “poor means earth,” or a universal material-grade ladder;
- a validated inverted-U relationship between prosperity and within-complex material variance;
- an annex count or courtyard count determined directly by prosperity;
- matched material proving planned expansion, or mismatched material proving pressure infill;
- treating an attic, loft, hall void, warehouse floor and domestic storey as equivalent;
- treating the current facade, roof or covering as the building's origin date;
- filling missing wings from a typological ideal such as an H-plan;
- treating a listed survivor as representative of buildings that were demolished, burned, encased,
  reroofed or never recorded; or
- using absence from an inventory description as evidence that a feature was absent.

### 3.3 Direct correction to the current prosperity/material theory

The present `GENERATION-SPEC.md` already correctly refuses a direct prosperity-to-height multiplier
and correctly requires a local material ladder. Wave 1 strengthens those refusals. It supports the
possibility that old, well-funded buildings accumulate high-quality but phase-different parts, and
that institutions draw on a capital layer unlike neighbouring households.

Wave 1 does **not** empirically validate the stronger owner-law claims that:

- the richest complex normally has many uniformly top-grade annexes;
- the poorest household normally has one uniformly cheapest part;
- material variance peaks at middle prosperity; or
- planned annexes normally match while pressure annexes normally do not.

Those remain testable hypotheses for `AMP-1`. They must be represented as dormant research
mechanisms, not encoded as historical constants. The cases show why: Panengstuen's mixed system
includes reuse and repair; Casa Manca deliberately mixes stone, unfired earth and fired brick by
structural zone; Upton Cressett's elite house differs by phase; Bryggen's material changes reflect
fire and rebuilding; and Dedendorf's brick infill replaces earth without proving a prosperity shift.

---

## 4. What plan evidence cannot establish

Even a geometrically accurate footprint cannot, without architectural evidence, determine:

1. **Floor structure:** open hall, stacked storeys, partial mezzanine, storage loft or occupied attic.
2. **Vertical measurements:** ground level, sill, floor, eaves, wall top, ridge, tower or chimney
   height.
3. **Roof geometry:** gable, hip, half-hip, shed, compound valley, pitch, span, truss system or
   orientation when the plan generalises the covering. External building width is not structural
   clear span unless bearing geometry and intermediate supports are established.
4. **Structural ownership:** whether neighbours share a party wall, abut independent walls, share a
   roof, or hide two older houses behind one facade.
5. **Material stratigraphy:** structural frame versus infill, skin, cladding, base, repair and roof
   covering.
6. **Chronology:** which wall, floor, truss, facade or annex belongs to which campaign.
7. **Function:** a tall rectangle may be a hall, barn, warehouse, nave, gatehouse or stacked house.
8. **Condition:** a missing roof, reduced storey or blank court can be loss, survey omission,
   deliberate void, or later clearance.
9. **Prosperity:** investment, status, institutional capital, repair and long chronological depth are
   not interchangeable wealth proxies.
10. **Interior connections:** stair, gallery, passage, sliding door, carriageway, upper bridge or
    blocked opening.

Accordingly, the plan corpus may propose a footprint and adjacency hypothesis for architectural
coding. It may not impute the vertical fields or supply a calibration denominator.

---

## 5. Candidate architecture contract for SettlementForge

This section records evidence-driven fields and invariants. It does not amend runtime law by itself.

### 5.1 Phase-owned mass parts

The existing `MassBody -> MassPartQ[] -> RoofDisposition` direction is sound: `PRESENT` owns a
`RoofForm`, `NONE` is explicit and `UNKNOWN` refuses dimensional publication. `AMP-1` should test the need
for the following evidence-facing distinctions before implementation names are frozen:

```text
MassPartObservation
  semanticBodyId
  partId
  bodyKind              BUILDING | DEFENCE | INSTITUTION | WORKS | OTHER
  morphologyRole        MAIN_RANGE | CROSS_WING | REAR_RANGE | ANNEX | STAIR_TOWER
                        GALLERY | PASSAGE | LEAN_TO | OTHER
  functionalProgram     DOMESTIC | HALL | SERVICE | WORKSHOP | BARN | WAREHOUSE
                        STORE | INSTITUTION | DEFENCE | MIXED | UNKNOWN
  functionalVolume      OPEN_CLEAR | DOMESTIC_STACK | STORAGE_STACK | PARTIAL_LOFT
                        OCCUPIED_ATTIC | UNINHABITED_ATTIC | UNKNOWN
  footprintSource       MEASURED | SOURCE_DESCRIBED | INTERPRETED | UNKNOWN
  sourceAbsoluteDatum?  only when a source supplies a declared vertical datum
  supportObservation    TERRAIN | FLOOR | ROOF | WALL_TOP | UNKNOWN
  eaveHeight
  wallTopHeight
  ridgeHeight
  storeysAboveBase
  basementState
  atticState
  roofForm
  roofPitch
  structuralSpan
  structuralSystem
  materialComponents[]  BASE | LOADBEARING | FRAME | INFILL | CLADDING | FLOOR
                        ROOF_STRUCTURE | ROOF_COVERING | REPAIR
  attachments[]         counterpartPartId + ABUTTING | SHARED_PARTY_WALL
                        RIDGE_CONTINUATION | ROOF_VALLEY | UNKNOWN
  roofCampaigns[]       roofId + owningPartId + construction/removal phase
  constructionPhase
  alterationEvents[]    ADD_PART | REMOVE_PART | INSERT_FLOOR | REMOVE_FLOOR
                        RAISE_EAVES | REPLACE_ROOF | REPLACE_FACADE | ENCASE_FRAME
                        REPAIR_MEMBER | REUSE_MEMBER | SUBDIVIDE | AMALGAMATE
  observationBasisByField
  datingMethodAndSampleByField
  certaintyAndBoundsByField
  componentScopeByField
  coverageAndOmissions
  sourceRoleAndRights
```

The registry observation is not the runtime object. Promotion should compile reviewed mechanisms
into canonical world facts; runtime must never import evidence records directly.

### 5.2 Required invariants

- One roof has one owning part and a declared construction/removal campaign; physical continuity
  between neighbouring roofs is represented by separate roof entities joined through
  `RIDGE_CONTINUATION` or another typed attachment, not ambiguous shared ownership. A future
  `RoofAssembly` would require its own explicit contract.
- An evidence observation may retain a source-supplied absolute datum. Runtime `MassPartQ` instead
  owns `SolidPartQ.support` plus offsets; absolute eave/ridge extrema are derived summaries.
- Storey count never substitutes for `eaveHeight`, `ridgeHeight` or functional clear volume.
- An occupied attic and a full square storey remain different.
- A wall or facade date never silently dates a roof, floor or rear range.
- Material is component-local; `mixed` is not a material and not a condition judgment.
- Reused members retain source uncertainty and cannot date their receiving phase without joint
  evidence.
- Party-wall state defaults to `UNKNOWN`, never inferred merely from touching polygons.
- A later lean-to, cross wing or service range keeps its own analytic roof instead of receiving one
  roof over the unioned footprint.
- Loss and restoration states remain explicit. A reconstructed “original form” is not observed
  surviving fabric.
- `UNKNOWN` is legal in evidence/import observations, but not a renderer instruction. A published
  dimensional scene must resolve geometry through canonical provenance or emit a typed
  massing-incomplete refusal/use the recorded planar compatibility law.
- Evidence-facing `bodyKind: OTHER` or `morphologyRole: OTHER` preserves an unresolved observation;
  it must resolve to the closed runtime vocabulary or take the same refusal/planar route before
  publication. It is never an escape hatch for an untyped generated body.
- Projection may derive visible roof planes, hard-edged shadows and occlusion from world geometry;
  it may not invent height, pitch or a decorative material style.

### 5.3 Mechanism disposition from Wave 1

| candidate | Wave 1 disposition | next evidence needed |
|---|---|---|
| composite mass parts | **strong possibility witness** | balanced building-phase cohort and part-recovery reliability test |
| function-specific vertical grammar | **strong possibility and counterexample support** | comparable measured halls, dwellings, barns, warehouses and institutions |
| open-hall floor insertion | **multiple possibility witnesses** | period/region cohort with direct fabric or archaeology and eligible negatives |
| roof replacement independent of walls | **strong possibility and dating counterexample** | component-dated roof/wall pairs |
| courtyard/range accretion | **multiple possibility witnesses** | source-complete complexes, not only street facades |
| local material ladder | **necessary scope rule, not calibrated order** | resource/geology-linked regional cohorts and material-grade coding agreement |
| prosperity to height | **refused** | no revival without a causal capacity model and preregistered status/resource cohort |
| prosperity/material inverted-U | **open hypothesis, not validated** | documentary status/resource context, age, repair and function held apart |
| party-wall mechanism and ownership | **uncalibrated conditional relationship** | AMP-eligible block-scale building archaeology with explicit wall ownership and counterexamples |
| party-wall prevalence | **`NOT_IDENTIFIED`** | a separate probability-sampling protocol with a defined target population and inclusion weights |
| function/system-conditioned pitch or span range | **uncalibrated conditional engineering range** | comparable measured sections/roof surveys under the sealed AMP frame |
| roof-form/pitch occurrence distributions | **`NOT_IDENTIFIED`** | a separate probability-sampling protocol; the balanced AMP frame supplies no occurrence denominator |

---

## 6. `AMP-1` measurement instrument

### 6.1 Primary and nested units

The primary observation is **one building or complex phase**. It is identified by stable site,
semantic body and phase IDs. Mass parts, roof campaigns and alterations are nested observations.
Several houses in one Cheb survey, several ranges in Rothe House, or several Bryggen buildings are
not independent settlements. Statistical analysis must use site/settlement clustering and must not
pseudo-replicate every truss or wing as an independent cultural observation.

### 6.2 Required frame strata

Before outcome-bearing sources are opened, the child manifest must freeze balance targets for:

- macro-region;
- period of the coded phase, with later alteration phases coded separately;
- settlement context: urban frontage, urban court/rear, small town, village, dispersed farmstead;
- function: dwelling, mixed work/dwelling, workshop, barn/stable, warehouse/granary, institution,
  defence/gate, and other declared classes;
- status/resource context using source-attested categories rather than appearance;
- construction system: timber frame, log, stone, fired brick, unfired earth, mixed and other;
- hazard/regulation context, including documented fire or rebuilding;
- evidence depth and measurement quality; and
- survival/recording state: substantially surviving, fragment, ruin, excavated, reconstructed,
  heavily restored, demolished but measured, or unknown.

Every balance stratum must come from an independent frozen catalog before any outcome-bearing
source is opened. If function, status/resource context, construction system, hazard, survival or
recording state is learned only during the building audit, the frame value is `UNKNOWN`; the value
may become a later cohort/covariate but never a selection or holdout input. This metadata-only rule
prevents mechanism presence and preservation outcome from selecting their own evidence.
Outcome-bearing drawings/images, descriptions, fabric/survival results and Wave 1 familiarity are
barred from frame, reserve, replacement and holdout allocation.

Country and famous-building quotas must prevent one well-digitised national inventory from
dominating the frame. Access convenience, spectacular roofs and obvious mechanism presence are
forbidden selection criteria.

### 6.3 Field-level measurement rules

| field | legal evidence | coding rule |
|---|---|---|
| footprint length/width/area | measured drawing, declared survey dimension, licensed dimensional data | retain source units and conversion; never measure a web image without scale/rights |
| storeys | section/floor survey or explicit fabric description | separate basement, square storeys, partial floor, loft and occupied attic |
| heights | measured section/elevation or explicit dimensions | record the declared source datum/support and sill/eaves/wall-top/ridge independently; facade estimate is a separate low-confidence field, and runtime support-relative geometry is not back-filled from an assumed scalar `zBase` |
| roof pitch | measured section, declared angle, or reconstructible rise/run with measurement error | store method and error; do not infer from regional label |
| span and bays | structural survey or explicit inventory count | distinguish structural bays from facade window axes |
| roof form | standing-fabric survey with phase | compound roofs decompose by owning part; covering and structure are separate |
| material | fabric investigation or explicit inventory | code base, wall, frame, infill, skin and covering separately; record replacement |
| party wall | exposed fabric, measured building archaeology or explicit survey | touching footprints remain `UNKNOWN` |
| function | source-attested historical use, archaeology or qualified interpretation | present use and historical use are separate; mixed functions allowed |
| prosperity/status | documentary or source-attested status/resource context | never back-infer from height or material being tested |
| alteration | fabric junction, dated report, documentary campaign or scientific dating | each event names affected part and before/after state |
| absence | complete survey designed to observe the feature | otherwise `UNKNOWN`; inventory silence is not absence |

### 6.4 Evidence axes and lineage

The child schema does not use one mixed “certainty” enum. Every coded field records independent
axes:

```text
observationBasis    MEASURED | SOURCE_DESCRIBED | SCIENTIFIC_SAMPLE
                    SCHOLARLY_INTERPRETATION | RECONSTRUCTION | UNKNOWN
epistemicCertainty  DECLARED_EXACT | BOUNDED | LIKELY | HYPOTHETICAL | UNKNOWN
datingMethod        DENDROCHRONOLOGY | RADIOCARBON | DOCUMENTARY | FABRIC_SEQUENCE
                    INSCRIPTION | TYPOLOGICAL | OTHER_DECLARED | NONE
componentScope      exact sampled/member/part IDs, or UNKNOWN
```

It separately records source role, package depth, inspected pages/figures, survey date, represented
phase, base/building state, editor/restorer intervention, precision or tolerance, coverage and
omissions, and rights mode. Scientific dates name the sampled element and whether sapwood permits a
felling date, range or terminus. Reused timber is never silently assigned to the receiving campaign.

### 6.5 Reliability and adjudication

- Two coders independently code at least 20% of development observations in each mechanism cohort.
- Numeric fields report absolute/relative disagreement against preregistered tolerances.
- Categorical fields report agreement separately for storey state, roof form, function, material
  component, alteration and certainty.
- Any proposed negative requires complete observability and independent adjudication.
- Disagreement that changes cohort eligibility is resolved before analysis and logged append-only.
- A source package missing section, interior inspection or alteration history remains usable for the
  fields it observes but cannot donate negatives for those it does not.

---

## 7. Cohorts, sealed holdout and stopping law

### 7.1 Separate mechanism cohorts

There is no all-purpose architectural denominator. Each tested mechanism must preregister its own
eligible cohort. Examples include:

| cohort | eligibility floor | legal outcome |
|---|---|---|
| open-hall floor insertion | interior fabric/archaeology observes primary volume and later floor state | insertion, eligible non-insertion, or unknown |
| roof replacement | wall/core phase and roof phase independently observable | same phase, replacement, reused/ambiguous |
| part accretion | complete-enough complex survey with phase relations | add/remove/rebuild relationships among parts |
| functional vertical grammar | measured height/storey/clear-volume plus source-attested function | function-conditioned dimensional ranges |
| party-wall relation | block-scale fabric survey explicitly observes wall ownership | shared, abutting-independent, uncertain |
| material/repair | component materials, alteration phase, age and condition all observable | within-part patch, cross-phase variance, replacement |
| status/resource context | independently attested status/resource context plus measured massing | bounded association, never appearance-derived status |

An observation may enter several cohorts, but it is not made independent by doing so.

### 7.2 Holdout

`AMP-1` must maintain its own **18% sealed holdout**, as required by `HEEP-1`. The holdout is selected
from metadata before development sources are opened, balanced across the frozen primary strata.
Wave 1 cases and materially equivalent reports are `PRIOR_SEEN` and ineligible.

Allocation occurs at the highest leakage cluster: a site/complex and every materially overlapping
survey-package family, including all of its buildings, phases, reports and derivative summaries,
must remain in one split. The child manifest defines the 18% denominator and deterministic rounding
over those clusters before identities are opened; it never splits reports or phases from the same
site across development and holdout.

The working team receives opaque holdout IDs and aggregate stratum counts, not names, URLs,
thumbnails or measurements. Holdout material opens once, only after these are content-hashed:

- frame and selection manifests;
- coding instrument and cohort rules;
- candidate mechanisms and parameter-free invariants;
- any proposed engineering ranges fitted on development data;
- renderer/world interfaces to be evaluated; and
- pass/fail thresholds and failure handling.

Holdout failure cannot be repaired by changing a rule against the opened cases. Any revised law
requires a new untouched holdout.

### 7.3 Batches and stopping

The child protocol must freeze a numeric minimum, target, maximum and batch schedule before source
opening. Wave 1 does not choose those values opportunistically. At minimum, stopping requires:

- all mandatory region/period/function/system/survival strata represented;
- every reported mechanism cohort meeting its preregistered sample floor;
- two successive fixed development batches with no new required field or unhandled counterexample
  class;
- stable engineering ranges under the preregistered comparison metric;
- coder-reliability gates passed;
- rights and coverage accounting complete; and
- sealed-holdout evaluation passed without scope rewriting.

Reaching a maximum with an unstable cohort yields `OPEN_AT_CAP`, not a guessed constant.

### 7.4 Development, calibration and validation separation

1. **Wave 1 discovery:** the current cases define questions and failure modes only.
2. **Frame construction:** metadata-only; no outcome coding.
3. **Development sample:** fit candidate categorical laws and any legal ranges.
4. **Internal validation:** fixed batches and clustered resampling by site/settlement.
5. **Sealed holdout:** one-way evaluation of the frozen law.
6. **Promotion review:** owner review of historical scope, world predicates, deterministic compiler
   stage, typed effects, counterexamples and version.

Passing the research holdout does not itself authorise runtime activation.

---

## 8. Survival, restoration and recording bias

The inspected sources make several biases unavoidable and measurable:

- National lists preferentially preserve durable, exceptional, high-status or legible structures.
- Timber, earth, thatch, low-status rear ranges and workshops are more likely to burn, rot, be
  replaced, be encased, or go unrecorded.
- Repair can expose fabric and trigger a study; unaltered ordinary buildings may receive less
  documentation.
- Dendrochronology samples surviving datable timber, not all original buildings.
- Urban catalogues often describe street facades more fully than party walls, rear courts or roofs.
- Restored sites can present an approximate earlier form while containing modern replacement.
- A survivor such as Koło's granary can be the sole remainder of a vanished class.
- Bryggen preserves a long-lived structural pattern through post-fire rebuilding, not an untouched
  medieval superstructure.
- Cheb's strong roof corpus is geographically and institutionally clustered; its raw counts are not
  an all-Europe denominator.

The future frame must therefore include demolished-but-measured buildings, excavation reports,
ruins, fragments, restored structures and ordinary inventories alongside celebrated intact
monuments. Survival state is a stratum and model covariate, not a footnote. No absence or prevalence
claim is legal until the target feature's recording opportunity is known.

---

## 9. Immediate generator implications

The evidence supports architecture work that is invariant to later frequencies:

- preserve `MassBody` as semantic identity and `MassPartQ[]` as canonical geometry;
- give every part its own support reference and offsets, derived eaves/ridge extrema, functional
  programme/volume, roof owner, material components and construction/removal phase;
- implement an explicit-input analytic roof compiler for rectangles, ranges, cross wings, lean-tos
  and courtyard graphs while keeping live form/pitch selection dormant;
- represent floor insertion, roof replacement, facade replacement, encasement, subdivision,
  amalgamation, part loss and repair as typed historical operations;
- preserve WORLD facts independently of lighting and projection;
- make `UNKNOWN` legal in evidence/import state: unresolved geometry-bearing shell/roof/support
  facts require a typed massing-incomplete refusal or recorded planar compatibility law, while
  internal storey or material unknowns follow their explicit no-inference/neutral dispositions and
  may never be defaulted into geometry, windows, capacity, transmission or palette;
- keep distinct typed `FunctionalProgram`/functional-volume states and dormant resolver seams for
  halls, dwellings, workshops, barns, warehouses, granaries and institutions; every
  function-conditioned geometry/range remains D3b/`AMP-1`-gated; and
- build validators and receipts before empirical defaults.

The following scoped, non-frequency work remains blocked on completed `AMP-1` calibration:

- function/structure/resource/period-conditioned height, pitch, span and material engineering ranges;
- prosperity-conditioned architectural relationships, including the proposed inverted-U, with
  age, function, resource, repair and survival separated;
- European region/period/resource evidence-pack values (narrative `cultureId` never selects them);
- empirically resolved/defaulted or cause-conditioned geometry/material facts that determine
  occluders and receivers; explicitly supplied canonical geometry plus deterministic D3a
  compilation/D4 occlusion remains legal before AMP promotion, and shadows remain a consequence of
  that canon and a projection-light profile, not a learned historical “shadow magnitude” prior;
- using a Wave 1 measurement as a default constant; and
- grading historical massing as empirically representative.

`AMP-1` cannot by itself identify storey/height/pitch/roof/material occurrence distributions,
annex/courtyard/party-wall frequencies, prevalence or runtime activation weights. Those remain
`NOT_IDENTIFIED`/`NONE` even after every AMP gate passes. Only a separately authorised
probability-sampling protocol with a defined target population, probability selection,
non-response treatment and inclusion weights may attempt those estimates.

The clean architecture boundary is:

```text
WORLD CAUSES
  function + capacity demand + land pressure + period + local resources
  + institutional/household capital layer + hazard/regulation + event history
        |  D3b ONLY: exact SUPPORTED AMP-1 domain/pack/protocol/law binding;
        |  scoped conditional mechanism/range, never occurrence distribution
        v
CANONICAL BUILDING HISTORY
  semantic body + phase-owned parts + floors/clear volumes + materials + roofs
  ^
  |  D3a may instead compile this history when supplied explicitly; it derives no grammar
        |
        v
CANONICAL DIMENSIONAL WORLD
  quantized masses + roof faces + occluders/receivers
        |
        v
PROJECTION
  projection-light profile (one fixed directional source by default)
  + per-light geometric visibility V_i and transmission T_i
  + additive contributions + per-face tone + depth order
```

Evidence records may challenge and promote laws at review time. They must never be runtime inputs,
and the renderer must never manufacture an architectural fact to make a plate look convincing.

---

## 10. Wave 1 disposition

This survey is sufficient to make the architectural boundary explicit and to reject several unsafe
shortcuts. It is not sufficient to calibrate the historical output.

**Established now:**

- building mass must be composite and phase-owned;
- function, floors, clear volume, roof, structure, material and alteration are distinct facts;
- plan evidence cannot supply vertical calibration;
- source and component dates must remain scoped;
- survival/restoration bias is first-class; and
- a formal `AMP-1` frame, cohorts and sealed holdout are required.

**Still unsupported, in two deliberately different states:**

- conditional height/storey/pitch/span/material engineering ranges and every
  prosperity-to-massing or prosperity-to-material relationship are `UNCALIBRATED` pending AMP;
- occurrence distributions, regional/period frequencies, party-wall/courtyard prevalence and
  activation weights are `NOT_IDENTIFIED`/`NONE` pending a separate probability-sampling protocol;
- empirically inferred/defaulted or cause-conditioned architectural facts that determine
  occluders/receivers remain unsupported pending AMP; explicitly supplied canonical geometry may
  already drive deterministic D3a compilation and D4 occlusion/shadow projection; and
- any transfer beyond `EUROPEAN_FANTASY_BASE`, which is out of scope unless a separate future
  owner-authorised evidence program is created.

Until the preregistered program passes its development, reliability, rights, coverage and untouched
holdout gates, every case in this document remains a possibility witness, counterexample or
validation candidate only. Passing those gates can promote scoped conditional mechanisms and
engineering ranges; it does not change any `NOT_IDENTIFIED` occurrence quantity into an estimate.
