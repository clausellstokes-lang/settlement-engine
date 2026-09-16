# Rural Settlement and Landscape Evidence — Wave 1

**Status:** `EUROPEAN_FANTASY_BASE` discovery survey; `RESEARCH_ONLY`; human-readable and
not yet registry-backed; not a calibrated rural corpus, a preregistered `RSLP-1` cohort, or
runtime authority<br>
**Survey date:** 2026-08-20<br>
**Binding expansion law:** `map-corpus/docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md`, especially
§9.1<br>
**Runtime authority:** `map-corpus/docs/GENERATION-SPEC.md`, especially §§10.0, 10.14,
10.17–10.21 and 10.23<br>
**Related Wave-1 urban survey:** `map-corpus/docs/HISTORICAL-URBANISM-EVIDENCE.md`

This document closes a specific evidential gap. A town atlas can show a town and some land around
it, but it does not thereby calibrate villages, hamlets, farmsteads, working yards, fields,
commons, woods, droveways, seasonal sites or abandoned rural settlements. Those are not the
unbuilt residue outside an urban polygon. They are a distinct historical system with their own
units, source traditions, preservation biases, causal relations and validation requirements.

The Wave-1 ruling is:

> A rural settlement is a changing settlement–landscape bundle: dwellings and working buildings,
> holdings and yards, fields and closes, common or several rights, paths and route catchments,
> water and production works, woods and extraction ground, seasonal nodes, and the traces of
> growth, contraction, relocation, abandonment and reuse. No one component, and no urban template,
> may stand in for that bundle.

The official European evidence surveyed here supports bounded candidate mechanisms and strong
counterexamples. It does **not** establish activation frequencies, universal forms, country-style
priors, hard-coded tenure weights, field-barn rates, tier-to-common counts, or a universal law of
nucleation. No value in the current sandbox becomes historical because this document discusses it.
The probability-bearing fields are `NOT_IDENTIFIED`/`NONE` under the boundary in §2.7.

---

## 1. Scope and completion boundary

### 1.1 What Wave 1 did

This pass inspected official archaeological reports and records, national heritage designations,
historic-landscape-characterisation guidance, protected-landscape documentation, official
excavation reports, cadastral/protection maps, and research-program descriptions from England,
Scotland, Ireland, the Netherlands, France, Germany, Norway, Sweden, Denmark, Spain and Slovakia.
The 30 case/source entries were selected for contrast, not to imitate a probability sample.

The cases include:

- planned, piecemeal, polyfocal, clustered, linear and dispersed settlements;
- farms, thorps, hamlets, villages, townships and distributed island/seasonal systems;
- tofts, crofts, yards, closes, strip systems, fossil fields, commons, heath, meadow and woodland;
- route, river, floodplain, slope, plateau, valley, fjord, stream and irrigation relations;
- mills, drains, wells, silos, mining, fishing, grazing and other functional landscapes; and
- contraction, property amalgamation, resettlement, improvement, desertion, burial, ploughing and
  modern restoration after earlier settlement.

The pass also read the rural hypotheses in the current designated sandbox versions of
`habitation.js`, `fields.js` and `commons.js`, then followed their direct assembly, compilation,
route, substrate and institution dependencies for the cohesion audit in §8. Those files were
inspected read-only; this work does not edit or silently endorse them. Earlier MFINT1 hashes that do
not identify the current sandbox are retained only as stale audit history in §8.1.

### 1.2 What Wave 1 did not do

This is not the rural child cohort required by `RSLP-1`. In particular, it did not:

- freeze a candidate universe, numeric sample size, deterministic selection seed or reserve list;
- seal the protocol-required 18% holdout before opening sources;
- double-code a preregistered variable set or calculate inter-coder reliability;
- estimate European, regional, chronological or settlement-type prevalence;
- derive probability weights, occurrence/count distributions or prevalence;
- derive conditional engineering dimensions, thresholds, relationships or tuning bands;
- acquire reusable source geometry or settle source-by-source rights for that purpose;
- promote a `HistoricalMechanismDefinition`, type a new runtime operation, or issue a receipt; or
- calibrate architecture, massing, materials, building heights or lighting.

This report is still a human-readable discovery log. Its 30 `RSL-W1-*` entries are not present in
the current historical-evidence JSON/schema/validator, so their count, source access, inspection
depth and claim links do not yet pass a machine integrity gate. That is consistent with
`RESEARCH_ONLY` status, but it is not a validated registry.

The urban expansion target of 80–120 towns is not inherited as a rural sample, and the urban
holdout is not a rural holdout. A future `RSLP-1` child manifest must declare its own comparative
unit, frame, sample, seed, strata, cohorts, 18% seal, stopping rules, rights gate and instruments
before outcomes are coded.

### 1.3 Why this is bound to `EUROPEAN_FANTASY_BASE`

The owner has bounded this program to the map tradition `EUROPEAN_FANTASY_BASE`. Every empirical
case in this Wave 1 is European. That boundary is a product and research-frame declaration, not a
claim that European rural forms are universal or interchangeable. Narrative `cultureId` values do
not activate geometry. A future non-European map tradition would need its own owner-authorised
primary and scholarly program; it may not inherit the mechanisms, probabilities or visual
vocabulary assembled here by analogy. The current sandbox cannot enforce this boundary until its
compile seam carries `mapTraditionId` and `historicalEvidenceScopeRef`, resolves the exact
`HistoricalEvidenceScopeBinding` and refuses an unsupported scope.

### 1.4 Inspection-depth vocabulary

| depth | claim made by this document |
|---|---|
| **VISUAL ARTIFACT** | The cited plan, map, figure, brochure or report page was actually rendered and visually inspected, including any scale bar or legend used below. |
| **FULL TEXT / DEEP** | The full relevant official report, guidance section or designation text was read; this does not claim that every associated figure was visually audited. |
| **OFFICIAL RECORD** | The authoritative scheduling, listing or monument-register entry and its stated evidence were inspected. |
| **OFFICIAL SUMMARY** | An official institutional synthesis or excavation summary was inspected, but not the complete primary archive. |
| **PROGRAM / METADATA** | The official program, dataset or publication metadata was inspected; this supports scope and source-method claims, not site geometry. |

An official summary is still a secondary synthesis. A designation boundary is still a legal
boundary. A cadastral plan is still evidence for its survey date. Those distinctions do not
disappear because the publisher is authoritative.

---

## 2. Evidence law for rural settlement and landscape

### 2.1 The comparative unit is a phase, not a place-name

The `RSLP-1` unit is a **versioned rural settlement/landscape phase**. “Wharram Percy,” “Rheeze” or
“Vlkolínec” is not one timeless observation. A site can contain earlier cultivation, later
settlement, replanning, shrinkage, reuse and a modern protected or restored landscape. Each phase
must retain its represented interval, source date, source role, coverage and component certainty.

### 2.2 Keep source roles separate

A future claim-sized evidence record must preserve the role of the source that supports it:

- excavation or earthwork survey can support observed deposits or visible relief within its
  coverage;
- a historic plan can support what its maker represented, at its date, purpose and resolution;
- a cadastral plan can support surveyed parcels and features at its date, not a medieval plan by
  visual resemblance;
- an official scholarly reconstruction can support the qualified reconstruction it actually
  makes, not primary observation;
- a designation or significance statement can support its bounded published synthesis, not every
  unsourced inference a generator might draw from it; and
- a present protection or visitor map supports present management and legal boundaries, not the
  historical extent of a settlement.

Corroborating roles may be linked, but never flattened into one source or one polygon called
historical truth.

### 2.3 Four dates remain different

At minimum, preserve:

1. the date the source or survey was made;
2. the date or interval the interpretation represents;
3. the date the scholarly edition, record or restoration was published; and
4. the date it was accessed or inspected.

The 1830 cadastral evidence at Rheeze, the c.1825 restoration target at Äskhult, and the 2011
protection map at Vlkolínec may preserve or interpret earlier relationships. None is a medieval
snapshot.

### 2.4 Certainty is component-specific

Existence, location, extent, date, function, occupancy, building count, parcel relation and causal
interpretation need separate certainty. Examples in this wave make the rule concrete:

- a deserted structure can be observed while its function remains uncertain;
- an abandoned settlement can be certain while the cause of abandonment is unknown;
- two historic names may refer to the same farm, or may not;
- a church may become a later focus without having founded the earlier settlement; and
- a legal scheduled area can be exact while the historical settlement extent remains unknown.

A single confidence score would erase these distinctions.

### 2.5 Coverage governs negative evidence

Absence is normally not evidence. It becomes a bounded negative only when the source could have
observed the feature at the relevant scale, period, material and location. This matters especially
where:

- a linear rescue trench samples only one edge of a settlement (Köckte);
- sand or bog selectively preserves what later cultivation would erase (Eldbotle; Céide Fields);
- currently occupied village cores have been much less excavated than development sites in open
  country (the Danish national strategy);
- an excavation did not open the whole site (Saint-Gilles; Les Tierces); or
- later boundaries, buildings, ploughing or restoration overwrite earlier phases.

A blank source area is a coverage state until demonstrated otherwise.

### 2.6 Historical time is not compiler order

“Wall before plots,” “field before settlement,” “church after route-side farms,” and “ploughing
after abandonment” are historical relative-order claims. They do not by themselves say that a
runtime compiler must execute wall, field, church or plough passes in that order. Compiler order is
licensed only when the canonical artifact dependency graph requires it and a typed operation plus
receipt proves the implementation.

Likewise, planned or intended layouts and realised morphology remain different.
`HistoricalPlanIntent` and `HistoricalPlanRealization` (`PLAN_INTENT`/`PLAN_REALIZATION`) are design
artifacts unless and until they are promoted through the manifest,
typed-operation and receipt machinery; a plan drawn by a historian must not be mistaken for either
runtime object.

### 2.7 Possibility is not prevalence

Each case below can establish that a mechanism or counterexample is possible under stated
conditions. Thirty deliberately contrastive entries cannot establish how often it occurs. Counts
inside this document are audit counts, not historical incidence. No ratio from these rows may be
used as an activation weight, country prior, tier distribution or tuning target.

That boundary also survives a successful `RSLP-1` cohort. After its gates, `RSLP-1` may support a
scoped conditional relationship—such as how an already-established pastoral regime constrains
access—or a conditional engineering range for an eligible mechanism, source scope, period and
terrain. It does not by itself identify how often that regime or mechanism occurs in the product
population. Unless a separately preregistered probability-sampling protocol identifies a declared
estimand, the nonauthorizing research-report disposition is:

```text
occurrenceFrequency = NOT_IDENTIFIED
countDistribution   = NOT_IDENTIFIED
prevalence           = NOT_IDENTIFIED
activationWeight     = NONE
```

These four labels are future child-study reporting fields, not a second runtime authority schema.
The executable mechanism contract remains the exact
`HistoricalMechanismDefinition.activationWeightSource: 'NONE'` until a registered
`ProbabilitySamplingProtocolRef` authorizes a declared population estimand. An explicit canonical
cause may license deterministic conditional execution for this settlement while all four
population fields remain unidentified. A sealed holdout can test transfer of a conditional
relationship; it does not turn a contrastive or balanced research cohort into a probability sample.

---

## 3. Actual visual and deep inspection log

This log prevents “linked” from being reported as “read,” and “read” from being reported as
“visually inspected.”

| artifact | inspection | dated/scale information actually used | limitation |
|---|---|---|---|
| Historic England, *Medieval Settlements: Introductions to Heritage Assets* (October 2018; first issued 2011) | **FULL TEXT / DEEP + VISUAL ARTIFACT**, pp. 5, 9 and 11 | Yarwell plan is a redraw of a 1778 plan; the guide's illustrated village, polyfocal and dispersed examples were inspected | Official national synthesis, not a case census; its plan typologies are interpretation and its own text warns that mid-19th-century forms can post-date medieval change. |
| Heritage Council, *Historic Landscape Characterisation Guidance* (2013) | **FULL TEXT / DEEP + VISUAL ARTIFACT**, pp. 85–86 | Classification matrices distinguish clachan/rundale, ladder farms, field forms and multiple rural-settlement forms | A characterisation vocabulary, not causal frequencies or measured case geometry. |
| Wharram Percy survey report, Historic England Research Report 94/2004 | **FULL TEXT / DEEP**; selected guide figures visually inspected, not every report sheet | Survey in 2002; reported plans at 1:500 and 1:1,000 | Do not imply a visual audit of all 111 report pages or copy survey geometry. |
| Rheeze protected-village explanation, Netherlands RCE (designation January 1988) | **FULL TEXT / DEEP** | Uses c.1830 cadastral evidence among later sources | Map screenshots were not successfully inspected in this pass; no map-scale or traced-geometry claim is made. |
| Sierra de los Filabres 1988 campaign report, Junta de Andalucía | **FULL TEXT / DEEP + VISUAL ARTIFACT**, report pp. 166–167 | Fig. 2 valley schematic has a 1 km scale bar; Fig. 4 excavated house has a 1 m scale bar | The valley figure is a research schematic, not cadastral parcel geometry. |
| Vlkolínec protection map (2011) | **VISUAL ARTIFACT** | A3 current cadastral/protection map; visible 0–60 m scale bar | Legal/current protection geometry, not a medieval settlement plan. |
| Äskhult official brochure (2010) | **FULL TEXT + VISUAL ARTIFACT**, both pages | Aerial/context image and a managed trail/land-use map with a 200 m scale bar | The landscape is actively restored toward a c.1825 target; it is not an untouched survival. |
| Vallgårda national-interest document | **FULL RELEVANT TEXT + VISUAL ARTIFACT**, p. 12 | Decision 1996; document updated 19 November 2011 | The inspected page is text, not a measured site plan. |

Other entries below are labelled `OFFICIAL RECORD`, `OFFICIAL SUMMARY` or `PROGRAM / METADATA`
and must not be upgraded to visual-plan evidence.

---

## 4. Official method and source-class controls

### 4.1 Historic England: settlement form is varied and mutable

Historic England's 2018 introduction treats medieval rural settlement as a range including farms,
hamlets, villages and seasonal places. It distinguishes strongly nucleated regions from landscapes
with much dispersed settlement, discusses regular toft/croft arrangements, planned and polyfocal
forms, shielings and granges, and stresses growth, shrinkage, shift and desertion. It also warns
against reading a settlement classification derived from mid-19th-century mapping as an unchanged
medieval form. This supports a phase model and a plural morphology vocabulary. It does not support
a universal nucleation selector or a tier table.

Source: [Historic England, *Medieval Settlements: Introductions to Heritage Assets*](https://historicengland.org.uk/images-books/publications/iha-medieval-settlements/heag210-medieval-settlements/).

### 4.2 Irish HLC: landscape classes are observations, not causes

The Heritage Council guidance separates grouped farmsteads with garden plots and shared
fields/strips, ladder farms, irregular and rectilinear fields, strip fields, mixed/boundary-loss
forms, water meadows, orchards and market gardening. Its rural settlement classes include green,
grid, estate, relocated, clachan, ladder, linear, crossroads, radiating, common-edge and amorphous
forms. This is useful as a coding vocabulary and a warning against one “organic village” primitive.
It does not tell SettlementForge how frequently each class occurs or which dossier predicate causes
it.

Source: [Heritage Council, *Historic Landscape Characterisation Guidance* (2013)](https://www.heritagecouncil.ie/content/files/historic_landscape_characterisation_guidance_2013_8mb.pdf).

### 4.3 Denmark: archaeological visibility is structurally biased

The Danish Agency for Culture and Palaces' national strategy states that development-led excavation
in open country overrepresents earlier farms and later-abandoned single farms or thorps, while
continuously occupied village cores remain under-investigated. The same strategy records variable
farm-building placement and toft form and says the sample is too limited to explain striking toft
size differences. This is an evidence-coverage rule, not a reason to fill unexcavated cores with the
average of excavated sites.

Source: [Slots- og Kulturstyrelsen, *Hus, gård og toft*](https://slks.dk/omraader/kulturarv/arkaeologi-fortidsminder-og-diger/arkaeologi-paa-land/arkaeologiske-strategier/middelalder-landbebyggelse-1050-1536-ekr/hus-gaard-og-toft).

### 4.4 Dutch landscape datasets: synthesis needs its own lineage

RCE landscape datasets and panorama descriptions integrate historic maps, soils, geomorphology,
archaeology and present landscape character. They are valuable for building a future frame and for
identifying field complexes such as `essen`, but a national synthesis layer is not the original
map, excavation or measured parcel. A future derived geometry must retain the dataset version,
input sources, transformation lineage and rights.

Sources: [RCE Essenkaart dataset](https://kennis.cultureelerfgoed.nl/index.php/Dataset/50) and
[RCE Drentsche Aa landscape panorama](https://kennis.cultureelerfgoed.nl/index.php/Panorama_Landschap_-_Drentsche_Aa).

---

## 5. Contrastive case/source matrix

All implications in this section are `RESEARCH_ONLY`. “Candidate” means eligible for later testing,
not adopted law.

### 5.1 England: planned, piecemeal, dispersed and non-monotonic cases

| id and source | inspected evidence and represented dates | bounded observation, uncertainty and candidate implication |
|---|---|---|
| **RSL-W1-ENG-01 — Wharram Percy**. [Research Report 94/2004](https://historicengland.org.uk/research/results/reports/94-2004), [full report endpoint](https://historicengland.org.uk/research/results/reports/6454/WharramPercyDesertedMedievalVillageNorthYorkshire_ArchaeologicalInvestigationandSurvey_SurveyReport), [scheduled record](https://historicengland.org.uk/listing/the-list/list-entry/1011377) | `FULL TEXT / DEEP` and `OFFICIAL RECORD`; survey 2002, report 2004; 1:500 and 1:1,000 plans reported. | Visible late earthworks are not automatically the earliest settlement. Survey interpretation places settlement over earlier arable and finds more than one planning episode; the southern West Row may be the earliest planned element over a less regimented predecessor. Later rows, tofts/crofts, hollow ways, manorial and mill/fishpond elements form a connected system. **Candidate:** retain field→settlement lineage and allow partial replanning. **Forbidden:** one “planned village” timestamp or tracing late earthworks as the initial plan. |
| **RSL-W1-ENG-02 — Gainsthorpe**. [Historic England list entry 1007509](https://historicengland.org.uk/listing/the-list/list-entry/1007509) | `OFFICIAL RECORD`; record amended 10 May 1994; cites a 1982 1:500 topographic survey. | Six to ten property groups, sunken tracks, yards/buildings, large enclosures, manorial courts, fishpond and dovecote traces are interpreted together. Property amalgamation accompanied piecemeal desertion; origins and final cause remain uncertain. **Candidate:** contraction can merge holdings and leave functional buildings/earthworks rather than uniformly thinning every parcel. |
| **RSL-W1-ENG-03 — Hound Tor**. [Historic England list entry 1016255](https://historicengland.org.uk/listing/the-list/list-entry/1016255), [measured-drawing catalogue entry](https://historicengland.org.uk/images-books/photos/item/MP/HTM0004) | `OFFICIAL RECORD`; record amended 16 January 1998; drawing catalogue located but no reusable geometry claimed. | Four longhouses, a conversion to barn, corn driers and barns sit within an irregular field system formed through multiple episodes of expansion and contraction; a nearby single farmstead and reused prehistoric ground complicate any village-only model. Settlement abandonment and later cultivation are different phase events. **Counterexample:** dispersed upland settlement is not “one farmstead on each regular holding,” and abandonment does not end land use. |
| **RSL-W1-ENG-04 — Stock**. [Historic England list entry 1020367](https://historicengland.org.uk/listing/the-list/list-entry/1020367) | `OFFICIAL RECORD`; earthwork, documentary and landscape synthesis; no scale claimed here. | The official record describes a piecemeal rather than clear two-row or green plan, with tofts, crofts, paddocks, hollow ways, wells and open-field ridge-and-furrow on undulating ground near Stock Beck. **Candidate:** a settlement can combine holding plots and open-field traces without a regular frontage comb. |
| **RSL-W1-ENG-05 — Sweetworthy**. [Historic England list entry 1008469](https://historicengland.org.uk/listing/the-list/list-entry/1008469) | `OFFICIAL RECORD`; no map scale claimed. | Roughly eleven dispersed buildings include only three or four houses; the rest are barns or ancillary structures. The open spread occupies a slope between stream gullies and connects valley and upland by a hollow track. **Counterexample:** building count is not household count, and a dispersed “settlement” can be a working complex rather than repeated house parcels. |
| **RSL-W1-ENG-06 — Greetwell**. [Historic England list entry 1017332](https://historicengland.org.uk/listing/the-list/list-entry/1017332) | `OFFICIAL RECORD`; documentary and earthwork phases. | The official synthesis records strong growth, fifteenth-century contraction, later recovery and another decline; expansion plots overlie earlier ridge-and-furrow, with hollow-way access toward open fields. **Candidate:** rural change is non-monotonic and can overwrite former cultivation. **Forbidden:** a single growth ladder or irreversible “village→town” sequence. |
| **RSL-W1-ENG-07 — Newbold**. [Historic England list entry 1019634](https://historicengland.org.uk/listing/the-list/list-entry/1019634) | `OFFICIAL RECORD`; listed 9 March 2001; aerial, earthwork and documentary evidence. | Linear planned tofts/crofts along Hall Lane, a possible back lane and surrounding furlongs/open fields provide a genuine planned contrast, while abandonment and incorporation remain uncertain. **Candidate:** regular frontage/backland is conditional on a planned/tenurial predicate and access system. **Forbidden:** applying it to all villages. |
| **RSL-W1-ENG-08 — Yarwell control**. [Historic England 2018 guide](https://historicengland.org.uk/images-books/publications/iha-medieval-settlements/heag210-medieval-settlements/) | `VISUAL ARTIFACT`, guide p. 5; redrawn from a plan of 1778. | A double row of tofts/crofts is a useful morphology control, but the guide explicitly notes the difficulty of dating regular plans and the source is late. **Candidate:** plan regularity can be coded. **Forbidden:** inferring medieval planning date from a regular 1778 arrangement alone. |

### 5.2 Scotland: township, relocation, improvement and source-identity uncertainty

| id and source | inspected evidence and represented dates | bounded observation, uncertainty and candidate implication |
|---|---|---|
| **RSL-W1-SCT-01 — Eldbotle**. [HES scheduled monument SM10352](https://portal.historicenvironment.scot/apex/f?p=1505%3A300%3A%3A%3A%3A%3AVIEWTYPE%2CVIEWREF%3Adesignation%2CSM10352) | `OFFICIAL RECORD`; scheduled 26 September 2002, updated 27 September 2017; deposits broadly twelfth–fifteenth century. | Domestic structures, drains, floors and middens survive under windblown sand; only part is exposed and the settlement later moved to Dirleton. The 168 × 113 m scheduled area is a legal protection polygon, not a measured settlement extent. **Candidate:** relocation and exceptional burial/preservation processes need explicit phase and coverage masks. |
| **RSL-W1-SCT-02 — Ruthven township**. [HES scheduled monument SM11901](https://portal.historicenvironment.scot/apex/f?p=1505%3A300%3A%3A%3A%3A%3AVIEWTYPE%2CVIEWREF%3Adesignation%2CSM11901) | `OFFICIAL RECORD`; post-medieval township landscape on a platform above the River Findhorn floodplain. | One linear area contains about fifteen structures, perhaps in three clusters. Outfields extend onto the floodplain; lazybeds occur within the settlement as “doorland”; a head dyke separates settlement land from wild common/summer grazing. **Candidate:** settlement, infield, outfield, common and seasonal use are typed connected zones. **Counterexample:** a common need not be a flat dry interior green. |
| **RSL-W1-SCT-03 — Little Eddieston**. [HES scheduled monument SM12549](https://portal.historicenvironment.scot/apex/f?p=1505%3A300%3A%3A%3A%3A%3AVIEWTYPE%2CVIEWREF%3Adesignation%2CSM12549) | `OFFICIAL RECORD`; scheduled 30 April 2009; abandoned by the later nineteenth century. | At least three structures and yards occupy a south-facing slope. The record places the site's interpretive potential within the Improvement-era context of communal-tenure replacement, common enclosure, displacement and farm amalgamation; map evidence shows abandonment by the late nineteenth century, but the record does not assign this farmstead one site-specific cause. Nearby place-names suggest a wider shifting settlement history. **Candidate:** tenure/reform can transform both settlement and rights landscape. **Forbidden:** a deterministic one-variable “lawfulness” score or a claimed abandonment cause that the record does not establish. |
| **RSL-W1-SCT-04 — Old Redhead**. [HES scheduled monument SM13722](https://portal.historicenvironment.scot/apex/f?p=1505%3A300%3A%3A%3A%3A%3AVIEWTYPE%2CVIEWREF%3Adesignation%2CSM13722) | `OFFICIAL RECORD`; scheduled 6 August 2020; compared with Roy 1752–55, a 1778 source, an 1821 name and an 1843 record. | At least five buildings, yards, a stock enclosure and field banks occupy a south slope above Caddon Water. Historical references may not all denote the same place. **Candidate:** source identity and name continuity require an explicit equivalence hypothesis; never merge records merely because names/locations are near. |

### 5.3 Ireland: relict systems, urban–rural seams and a preservation counterexample

| id and source | inspected evidence and represented dates | bounded observation, uncertainty and candidate implication |
|---|---|---|
| **RSL-W1-IRL-01 — Céide Fields**. [Heritage Ireland official site](https://heritageireland.ie/places-to-visit/ceide-fields-neolithic-site-visitor-centre/) | `OFFICIAL SUMMARY`; Neolithic, approximately six millennia old; hundreds of hectares preserved under blanket bog. | Stone-walled fields, dwellings and tombs demonstrate that survival can be controlled by later peat formation rather than normal medieval landscape continuity. **Control only:** this is not medieval-form calibration. It establishes a preservation and source-coverage counterexample. |
| **RSL-W1-IRL-02 — Carns/Tulsk, Medieval Rural Settlement Project**. [Discovery Programme MRSP](https://discoveryprogramme.ie/projects/past-projects/mrsp/), [project description](https://discoveryprogramme.ie/projects/past-projects/medieval-rural-settlement-project/) | `PROGRAM / METADATA + OFFICIAL SUMMARY`. | The program combines relict field boundaries, deserted settlements, ecclesiastical, elite, assembly and moated-site evidence; the Tulsk work distinguishes outer enclosure/approach features, infields and later divisions. **Candidate:** a deep package should join survey, excavation, documentary history and landscape context. **Forbidden:** treating the program description as complete mapped geometry for either locality. |
| **RSL-W1-IRL-03 — Dublin rural module**. [Discovery Programme Dublin module](https://discoveryprogramme.ie/projects/past-projects/medieval-rural-settlement-project-the-dublin-module/) | `PROGRAM / METADATA`. | The module makes urban–rural provisioning and settlement context an explicit research object. **Architectural implication:** the town edge cannot generate its countryside after the fact; supply, routes and rural production must be causally upstream or co-derived. No site-form frequency is licensed. |

### 5.4 Netherlands and France: ecotones, institutional recentering and incomplete excavation

| id and source | inspected evidence and represented dates | bounded observation, uncertainty and candidate implication |
|---|---|---|
| **RSL-W1-NLD-01 — Rheeze**. [RCE designation explanation](https://archisarchief.cultureelerfgoed.nl/Beschermde_Gezichten/BG1388/TOELICHTING_aanwijzing_1388.pdf) | `FULL TEXT / DEEP` at survey time; designation January 1988; c.1830 cadastral minute plan used as a later witness. The cited RCE endpoint returned HTTP 404 during the 2026-08-20 reproducibility recheck. The inspection claim therefore requires a dated access receipt/content hash or a stable official replacement before it is independently reproducible; no reusable geometry is claimed. | Farms and barns cluster around a brink and through-route at the transition between higher arable and lower stream-valley meadow/pasture, with heath commons beyond. Initial plots are irregular/rounded; later clearance produced strip-like field extensions, and later consolidation, lost routes and brink privatisation changed the system. **Candidate:** ecotone siting and shared-grazing functions can organise a settlement–landscape bundle. **Forbidden:** back-projecting every 1830 parcel or assuming common land is an urban void. |
| **RSL-W1-FRA-01 — Saint-Gilles de Missignac / Saint-Gilles le Vieux**. [Inrap site atlas](https://multimedia.inrap.fr/atlas/Nimes/sites/3258/Madame-Saint-Gilles-le-Vieux) | `OFFICIAL SUMMARY`; excavation 2013, nearly 2 ha; phases from late antiquity/early medieval occupation through abandonment by the early thirteenth century. | Loose farms near a former villa and route precede a tenth-century church. Houses and burials then concentrate around it; courts/gardens shrink and storage moves toward an external silo district. Abandonment is gradual, with lingering burial/storage before agriculture resumes. **Candidate:** an institution can recenter an existing settlement, and density can relocate functions. **Forbidden:** “church present” = “church founded settlement,” or treating the excavated 2 ha as the whole site. |
| **RSL-W1-FRA-02 — Les Tierces, Villarodin-Bourget**. [DRAC Auvergne-Rhône-Alpes / Inrap report](https://www.culture.gouv.fr/regions/drac-auvergne-rhone-alpes/actualites/un-village-deserte-du-bas-moyen-age-et-une-chapelle-d-epoque-moderne-a-villarodin-bourget-savoie) | `OFFICIAL SUMMARY`; excavation 4 July–23 September 2022; published 9 January 2023; settlement broadly fourteenth–sixteenth century. | Houses, enclosures, a medieval path, later chapel and hollow way occupy the eastern edge of a small plateau at roughly 1,130–1,148 m. Religious-war abandonment is only one possibility; sparse portable objects may reflect planned material recovery or discard downslope. **Candidate:** preserve competing abandonment/taphonomy explanations. **Forbidden:** converting low artefact density into sudden flight. |

### 5.5 Germany: extraction landscapes, trench bias and unknown abandonment cause

| id and source | inspected evidence and represented dates | bounded observation, uncertainty and candidate implication |
|---|---|---|
| **RSL-W1-DEU-01 — Dorf Anhalt**. [Landesamt für Denkmalpflege und Archäologie Sachsen-Anhalt, 31 August 2017](https://www.lda-lsa.de/presse-und-oeffentlichkeitsarbeit/presseinformationen/archiv-der-presseinformationen/2017/310817-archaeologische-untersuchungen-dorf-anhalt) | `OFFICIAL SUMMARY`; occupation from c. tenth/eleventh to fifteenth century, strongest in twelfth–fourteenth centuries. | Church and house sites, quarrying, pits, terraces and slag occupy a plateau near a castle above the Selke valley in a landscape of mining, timber, water and agriculture. The purpose of some terrain modification remains unsettled. **Candidate:** extraction settlements couple resource, processing, transport, water and food ground. **Forbidden:** reducing the site to one “mining village” cause. |
| **RSL-W1-DEU-02 — Köckte**. [LDA Sachsen-Anhalt, Fund des Monats, October 2016](https://www.lda-lsa.de/en/archaeologie/fund-des-monats/2016/oktober-2016) | `OFFICIAL SUMMARY`; 2015 linear dyke trench, about 550 m long and up to 34 m wide. | The trench sampled only the south-eastern edge of the settlement, revealing a chain of nineteen wells, possible peripheral metalworking and church/cemetery evidence while the main settlement lay outside the corridor. **Coverage control:** feature absence outside/inside a linear window cannot be interpreted as settlement-wide absence. |
| **RSL-W1-DEU-03 — Marsleben**. [LDA Sachsen-Anhalt, Fund des Monats, October 2005](https://www.lda-lsa.de/archaeologie/fund-des-monats/2005/oktober-2005) | `OFFICIAL SUMMARY`; medieval growth and abandonment around 1400. | More than sixty cellar features provide strong evidence for a substantial deserted place, but the abandonment cause remains unknown. **Candidate:** record the observed contraction state without inventing famine, plague, war or tenure as cause. |

### 5.6 Norway and Sweden: clustered farms, islands, restoration, fossil fields and seasonal sites

| id and source | inspected evidence and represented dates | bounded observation, uncertainty and candidate implication |
|---|---|---|
| **RSL-W1-NOR-01 — Havrå**. [Riksantikvaren, *Havratunet – norske akveduktar*](https://riksantikvaren.no/kulturhistorie/havratunet-norske-akveduktar/) | `OFFICIAL SUMMARY`; heritage interpretation, not a measured historical survey. | Eight holdings form a tightly clustered two-row farm settlement. Mills occupy the main stream; outbarns sit near an infield/outfield wall; buried dry-stone drains pass under the houses in steep fjord terrain. **Candidate:** a compact built cluster can serve spatially distributed holdings and hydraulic works. **Counterexample:** nucleated dwellings do not imply one undifferentiated open-field template. |
| **RSL-W1-NOR-02 — Vega Archipelago**. [Riksantikvaren World Heritage description](https://riksantikvaren.no/en/world-heritage/vegaoyan-the-vega-archipelago/) | `OFFICIAL SUMMARY`; page published 12 February 2020, amended 28 March 2025; protected property 107,294 ha, of which 6,881 ha is land. | Thousands of islands support a distributed fishermen-farmer system with fishing villages, quays, warehouses, eider houses, farms, grazing and haymaking; outer barren and inner more fertile islands have different jobs. **Candidate:** model seasonal/functional nodes and water routes across a landscape. **Forbidden:** forcing a single permanent village core or treating sea as empty separation. |
| **RSL-W1-SWE-01 — Äskhult**. [Halland County Board official page](https://www.lansstyrelsen.se/halland/besoksmal/kulturmiljoer/askhult.html), [official 2010 brochure](https://www.lansstyrelsen.se/download/18.68fbc90d193243b379e4940f/1732529018178/%C3%84skhult%20p%C3%A5%20svenska.pdf) | `FULL TEXT + VISUAL ARTIFACT`; four farms; present management restores a landscape target around 1825; trail map has 200 m scale bar. | Four farmsteads cluster around a village square and escaped the normal nineteenth-century relocation under land consolidation. The present field/wood/pasture scene is actively managed to a chosen historical target. **Candidate:** reform can relocate or preserve farm clusters. **Forbidden:** treating the current managed map as medieval or “naturally frozen.” |
| **RSL-W1-SWE-02 — Vallgårda**. [Riksantikvarieämbetet national-interest document](https://www.raa.se/publicerat/varia2012_12.pdf) | `FULL RELEVANT TEXT + VISUAL ARTIFACT` p. 12; decision 1996, document updated 19 November 2011. | The record identifies an abandoned village, settlement remains and roughly thirty-five long narrow fossil-field strips, many bounded by terrace edges or clearance cairns; a churchyard moved in the sixteenth century. **Candidate:** fossil field boundaries and settlement/institution relocation can have independent phase histories. No exact geometry is taken from prose. |
| **RSL-W1-SWE-03 — Leksand seasonal settlement L2000:529 / RAÄ Leksand 501:4**. [RAÄ Fornsök record](https://app.raa.se/open/fornsok/lamning/2ddfd569-710e-4db6-b8f6-5f3d5e469757) | `OFFICIAL RECORD`; published 1 October 2018; compared with maps of 1755 and 1819. | Four abandoned seasonal-settlement areas contain building foundations, wells/cellars, fossil or terraced fields and clearance cairns. The registry flags parts of the older description as not quality-assured. **Candidate:** seasonal occupancy, historical map correlation and record-quality status must be first-class. |

### 5.7 Denmark, Spain and Slovakia: toft transformation, irrigated valleys and legal-map limits

| id and source | inspected evidence and represented dates | bounded observation, uncertainty and candidate implication |
|---|---|---|
| **RSL-W1-DNK-01 — Østergård at Hyrup**. [Slots- og Kulturstyrelsen national strategy](https://slks.dk/omraader/kulturarv/arkaeologi-fortidsminder-og-diger/arkaeologi-paa-land/arkaeologiske-strategier/middelalder-landbebyggelse-1050-1536-ekr/hus-gaard-og-toft) | `FULL TEXT / DEEP` official research synthesis; late Viking elite single farm followed by a village phase around 1200. | The synthesis describes seven occupied and three empty tofts around 1200 after an earlier single elite farm. Subdivision through inheritance is possible, not certain; tofts shift from large cultivated areas toward garden plots. Reported toft areas differ sharply between this and Tårnby, but the strategy says the sample is too small to explain why. **Candidate:** subdivision and function change. **Forbidden:** converting these sizes into a distribution or inheritance into a fact. |
| **RSL-W1-ESP-01 — Senés and the Sierra de los Filabres**. [Junta de Andalucía 1988 campaign report](https://www.juntadeandalucia.es/cultura/tabula/bitstream/20.500.11947/10841/1/AAA_1988_093_creissier_filabres_almeria.pdf) | `FULL TEXT / DEEP + VISUAL ARTIFACT`, pp. 166–167; Fig. 2 has a 1 km bar, Fig. 4 a 1 m bar. | The valley schematic links fortress, deserted settlement, current village, aqueduct/acequia and mills; the wider research distinguishes several habitat nuclei and interstitial river settlement tied to irrigated farming, silk and mining. **Candidate:** hydraulic and production networks can organise multiple nuclei at valley scale. **Forbidden:** tracing the schematic as exact geometry or collapsing every livelihood to irrigation. |
| **RSL-W1-ESP-02 — Majada de las Vacas / Guadix-Baza program**. [Junta de Andalucía TABULA record](https://www.juntadeandalucia.es/cultura/tabula/handle/20.500.11947/16461) | `PROGRAM / METADATA`; fieldwork 1999, publication 2002. | Metadata reports surface-planned houses at an emirate-period hill settlement and thematic work on mining, irrigation and pastoralism. **Candidate:** future deep packages should test settlement with multiple production landscapes. **Forbidden:** treating the metadata abstract as a visually audited plan or reusing the reported geometry. |
| **RSL-W1-SVK-01 — Vlkolínec**. [Monuments Board overview](https://www.pamiatky.sk/ochrana-pamiatok/svetove-dedicstvo-unesco/rezervacia-ludovej-architektury-vlkolinec), [official OUV statement](https://www.pamiatky.sk/fileadmin/documents/unesco/vyhlasenie_Vlkolinec.pdf), [protection guidance](https://www.pamiatky.sk/ochrana-pamiatok/zasady-ochrany-pamiatkovej-rezervacie/zasady-ochrany-pr-vlkolinec), [2011 map](https://www.pamiatky.sk/fileadmin/documents/ZASADY-PR/Vlkolinec/mapa-2011-vlkolinec.pdf) | `OFFICIAL SUMMARY + VISUAL ARTIFACT`; 2011 A3 legal/cadastral map with 0–60 m scale bar; 4.9 ha protected mountain settlement. | Narrow parcels place houses toward the access line and barns/haylofts or ancillary structures behind; a canalised stream crosses the centre and strip fields/pastures belong to the setting. Claimed origins and first documentation differ, and most surviving buildings are nineteenth-century. **Candidate:** parcel, water and working-building relations can persist. **Forbidden:** reading the 2011 boundary or current footprints as a medieval plan. |

---

## 6. Cross-case candidate mechanisms and counterexamples

The following are candidate mechanism classes only. Every row is `RESEARCH_ONLY`; none carries a
frequency, count distribution, prevalence estimate, numeric parameter or runtime activation weight.
Later promotion of a scoped conditional relationship or engineering range does not change those
probability fields from `NOT_IDENTIFIED`/`NONE`.

| candidate | bounded witnesses | counterexample or required narrowing | lawful future generator implication |
|---|---|---|---|
| **RM-01 · Settlement–landscape bundle** | Wharram, Ruthven, Rheeze, Havrå, Senés | A source may expose only one component or one excavation window. | Derive core/steadings, holdings, production ground, routes, water and rights as linked artifacts; allow `UNKNOWN` components rather than filling them decoratively. |
| **RM-02 · Mixed dispersion and clustering** | Hound Tor, Sweetworthy, Ruthven, Havrå, Vega | “Nucleated” and “dispersed” are not exhaustive binary endpoints; polyfocal, seasonal and working complexes cross-cut them. | Use typed settlement graphs and phase-specific cluster topology, not one scalar tenure score. |
| **RM-03 · Conditional frontage/backland holdings** | Newbold, Yarwell, parts of Wharram and Vlkolínec | Stock, Hound Tor, Sweetworthy and Rheeze reject universal regularity. | Emit regular toft/croft or narrow-parcel series only from an evidenced planning/tenurial predicate; preserve actual access and backland function. |
| **RM-04 · Partial and repeated planning** | Wharram; Østergård subdivision | A regular surviving plan does not date or explain itself. | Represent planned intent by phase and allow realised deformation, inheritance subdivision and earlier seams; do not stamp the entire settlement in one pass. |
| **RM-05 · Working-yard and functional-building systems** | Gainsthorpe, Sweetworthy, Hound Tor, Havrå, Vlkolínec | Ancillary buildings are not households; functions and coexistence may be uncertain. | Type house, barn, outbarn, store, drier, silo, yard and enclosure separately; never derive population from all footprints. |
| **RM-06 · Ecotone siting** | Rheeze high arable/low meadow-heath transition; Ruthven platform/floodplain | Mountain, plateau, island and irrigated-valley cases use different relations. | Candidate site scoring may combine dry access, soil, meadow, water and risk only when a world predicate declares the relevant production regime; no universal “near water” bonus. |
| **RM-07 · Access couples settlement to work** | Newbold/Greetwell hollow ways and lanes; Senés acequia/mill links; Vega sea routes | Routes can persist, disappear, shift rank or be seasonal. | Build a typed route catchment linking dwellings to fields, commons, water and production; retain route phase/status instead of drawing generic spokes. |
| **RM-08 · Infield/outfield/common partitions** | Ruthven, Havrå, Äskhult | Rheeze and other systems combine meadow, heath, es and green differently; not every place has the same partition. | Support named/typed zones and rights boundaries as one possible regime, not mandatory concentric rings. |
| **RM-09 · Woodland clearance, assart and extraction** | Rheeze later clearance; Dorf Anhalt extraction landscape | Cleared strips, mines, charcoal, timber and farms need not share a cause or date. | Emit a phase-linked clearance/extraction operation only from resource, tenure and access predicates; retain pre-clearance boundary lineage. |
| **RM-10 · Hydraulics are function-specific** | Havrå drains/mills, Senés irrigation/mills, Köckte wells, Vlkolínec channel | A river-adjacent settlement may lack any one of these systems. | Type supply, drainage, irrigation, power, crossing and flood-risk networks separately; require flow/topology and function, not decorative water proximity. |
| **RM-11 · Seasonal and distributed landscapes** | Leksand fäbod, Vega archipelago, Ruthven summer grazing | Permanent villages cannot calibrate seasonal distance or occupancy. | Add occupancy interval/calendar, home–seasonal links, resource purpose and transport mode to future artifacts; do not count seasonal structures as year-round households. |
| **RM-12 · Institutional recentering** | Saint-Gilles church after earlier route-side farms | A church can predate, post-date, coexist with or fail to centralise settlement. | Institution predicates may attract later fabric only when historical phase and access support it; “church present” is not a founding cause. |
| **RM-13 · Functional displacement under density** | Saint-Gilles external silo district; possible peripheral work at Köckte | Excavation windows are incomplete and functions may be uncertain. | Test whether density/hazard/access causes storage or production relocation; never universalise “industry outside.” |
| **RM-14 · Typed contraction and abandonment** | Gainsthorpe amalgamation, Greetwell oscillation, Eldbotle relocation, Les Tierces alternatives, Marsleben unknown cause | Hound Tor fields and Saint-Gilles agriculture continue after dwelling abandonment. | Replace a universal ruin switch with phase operations: vacancy, amalgamation, relocation, removal/recovery, burial persistence and agricultural reuse; the actual operation kind carries `cause.status='UNKNOWN'` when the historical cause is unresolved. |
| **RM-15 · Settlement over earlier fields** | Wharram, Greetwell | Not every settlement expansion overlays cultivation, and dating can be uncertain. | Preserve substrate/field lineage under later plots and expose relationships as dated evidence, not visual palimpsest noise. |
| **RM-16 · Terrain/aspect/terracing constraints** | Little Eddieston, Dorf Anhalt, Senés, Vlkolínec, Vallgårda | Hound Tor irregularity and Rheeze ecotone show terrain is not one slope threshold. | Use substrate as a constraint on access, work and construction with regime-specific tolerances; no universal contour-following rule or hard-coded slope weight from this wave. |
| **RM-17 · Tenure/reform transforms geometry and rights** | Little Eddieston, Äskhult, Rheeze | Similar-looking changes can have different causes; “lawfulness” is not tenure. | Model named tenure/reform events and their permitted operations—relocation, enclosure, amalgamation, privatisation—rather than a civic-order scalar. |
| **RM-18 · Preservation and visibility are mechanisms** | Céide bog, Eldbotle sand, Danish development bias, Köckte trench | Survival and investigation intensity differ by material, land use and planning history. | Carry preservation, survey and excavation coverage masks into validation; sample absence only where detection was possible. |
| **RM-19 · Later maps are witnesses, not time machines** | Rheeze 1830, Äskhult c.1825 target, Vlkolínec 2011, Leksand 1755/1819 | Persistence can be real but must be demonstrated component by component. | Store source date, represented date and transformation lineage; prohibit wholesale back-projection. |
| **RM-20 · Intent and realised landscape diverge** | planned Newbold, multi-stage Wharram, Østergård subdivision, restored Äskhult | A schematic, regulation or restoration target is not realised historical geometry. | Keep proposed/regulated/restored and observed/reconstructed states distinct; promote runtime intent/realisation artifacts only through the canonical contract. |

---

## 7. Forbidden inferences

The following are prohibited unless a later preregistered rural study and reviewed mechanism
definition explicitly license a narrower claim.

1. **No burgage-to-toft substitution.** Rural frontage/backland holdings are not small burgages,
   and an urban plot-depth ratio cannot be reused for crofts, farmyards or ladder farms.
2. **No mandatory urban core.** Market, church, castle, wall, gate, square or civic nucleus is not
   a default rural settlement cause.
3. **No wall/gate/radial-road grammar.** Urban enclosure and gate-route mechanisms do not explain
   a village, township, dispersed farm landscape or seasonal archipelago.
4. **No universal nucleation law.** Relief, danger, order, tenure or tier may matter in specified
   historical systems, but Wave 1 licenses no scalar continuum, sign, coefficient or threshold.
5. **No “organic medieval” noise.** Irregularity is not random jitter; it can record terrain,
   inheritance, route persistence, property amalgamation, incomplete planning or phased change.
6. **No universal open-field parish.** Open field is one typed agrarian regime, not the historical
   truth of all European rural ground.
7. **No mandatory two- or three-field rotation.** The case set does not license a field count,
   fallow ratio or rotation frequency.
8. **No settlement-facing strip rule by default.** Strip and parcel bearing must be evidenced or
   derived from actual access, boundaries, drainage, terrain and regime, not oriented on a centre
   merely to make a legible fan.
9. **No one-house-per-holding or one-house-per-strip rule.** Holdings may be fragmented; buildings
   may cluster; functional structures outnumber dwellings; and seasonal nodes complicate residence.
10. **No universal field-barn rule.** Barn, outbarn, shelter, byre, drier, silo and grange are typed
    functions with dated regional regimes, not texture tokens. Absence in open-field examples is not
    universal proof that a barn can never occur there.
11. **No common-as-empty-hole rule.** Common rights may concern heath, upland, wood, meadow, shore
    or seasonally used ground and may overlap other use. A common is not defined by a hole in built
    fabric.
12. **No tier-to-common table.** Thorps, hamlets and townships can possess common rights; a village
    need not have one central green; count and radius do not follow product tier.
13. **No flat/dry common universal.** Ruthven's summer grazing and Rheeze's heath alone defeat that
    inference.
14. **No country-name style prior.** “English open field,” “Scottish township” or “Norwegian
    cluster” cannot select geometry without the relevant world and phase predicates.
15. **No landscape as urban leftovers.** Rural land is not what remains after town parcels, walls
    and roads consume the frame.
16. **No renderer-generated evidence.** Field hatching, vegetation, hedge trees, scattered barns,
    boundary jitter or generated corpus plates are visual hypotheses, never empirical facts.
17. **No source-symbol literalism.** A pictorial building, earthwork mark, legal polygon or
    schematic route is not measured geometry unless the source role, legend, scale, lineage and
    rights support that use.
18. **No protection-boundary historic extent.** Scheduled and World Heritage polygons answer a
    legal/management question.
19. **No negative inference without coverage.** A rescue trench, partial excavation, current
    village core or coarse plan cannot prove whole-site absence.
20. **No universal abandonment cause or LIFO decay.** Contraction, eviction, relocation, reform,
    material recovery, disaster and unknown causes remain distinct; land use can continue.
21. **No urban sample substitution.** The urban atlas cohort, town holdout and town-derived ranges
    cannot satisfy `RSLP-1`.
22. **No historical-to-compiler shortcut.** Historical relative order does not dictate stage
    numbers or module order without a canonical dependency and receipt.

---

## 8. Direct audit of current sandbox rural hypotheses

### 8.1 Audit identity and limits

The current implementation was rechecked read-only on 2026-08-20 in the non-Git build-out at:

`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/mf-proto/build-out`

Its audit identity is that exact sandbox path plus the following SHA-256 values:

| module | SHA-256 of current inspected file |
|---|---|
| `src/domain/townMap/fabric/habitation.js` | `73943cf274ec1afbed4bd33503c38a66f02fca01cae29d48d0fb28f462d9e2b8` |
| `src/domain/townMap/fabric/fields.js` | `b4a762cb70169da54578bcd563267e583e1dd4a57db212d5904f09967ba67148` |
| `src/domain/townMap/fabric/commons.js` | `acbfd9de8f6807fa8a1885bf4e620c82685dcf79e82e1781b555149ce089666d` |

An earlier draft called the reviewed implementation “the MFINT1 sandbox snapshot” and listed
`fields.js=55e3dcbd39f266d7dc3d17df3acd2d36ad21d414a8e03c647985a3b91c5a2dd2` and
`commons.js=89bae4b88ee0956fd9dda1874c7092d98cc6fbc7a8717857ee1f00808665c84a`. Those
hashes do not identify the current sandbox, and no immutable copies carrying them were available
for this reconciliation. They are stale/unavailable MFINT1 audit-history identifiers, not current
implementation evidence. The §8 dispositions below were rechecked against the current hashes.
`habitation.js` is byte-identical to the earlier table; `fields.js` and `commons.js` are not.

This is an epistemic audit, not a code change. A deterministic, well-tested implementation can
still encode an unsupported historical claim; conversely, a useful geometry operation can survive
if it is relabelled as a rendering/packing technique and stops asserting historical truth. The
temporary path is not durable custody: a promotion packet must preserve a content-addressed
snapshot or an equivalent immutable implementation receipt.

### 8.2 `habitation.js`

| current hypothesis | Wave-1 ruling | required architectural correction before promotion |
|---|---|---|
| `tenurePattern()` reduces relief, workable share, danger, lawfulness, tier and seed to one 0–1 nucleated/dispersed score with coefficients `0.95`, `0.30`, `-0.34`, `-0.16`, `+0.22` and threshold `0.5`. | **UNLICENSED AS HISTORY.** The survey supports varied relations among terrain, security, tenure and settlement, but no coefficient, sign in every context, binary continuum or threshold. “Lawfulness” is not a historical tenure regime; `thorp` is not inherently a dispersed hamlet; polyfocal, seasonal and mixed working systems fall outside the binary. | Replace the scalar cause with typed, phase-specific predicates such as agrarian regime, tenure/reform event, security action, seasonal use, terrain/access constraints and source-bounded mechanism eligibility. Keep seed only for variation inside an already licensed mechanism, never to choose historical regime. |
| `HABITATION` fixes `carryReach=0.62`, `farmsteadReach=0.86`, `shelterRate=0.34`, `farmsteadRate=0.30`, `dispersedRate=0.72`, footprint proportions and tier caps. | **UNLICENSED NUMBERS.** No Wave-1 source or cohort establishes these rates, reach fractions, dimensions or caps. The contrastive sample must not be used to tune them. | Mark all as sandbox-only visual parameters. After its gates, `RSLP-1` may promote only eligible, scoped conditional distance/dimension relationships or engineering ranges. Shelter/farmstead/dispersal occurrence rates and tier count distributions remain `NOT_IDENTIFIED`, with `activationWeight=NONE`, absent a separate probability protocol; an explicit occupancy/tenure world fact may instead cause deterministic execution. |
| One grouped `furlong` is treated as one holding, and dispersed mode emits a farmstead on 72% of those units. | **ONTOLOGY MISMATCH.** A furlong, strip, holding, household and farmstead are different objects. Holdings may be fragmented; buildings can cluster away from parcels; ancillary structures can outnumber houses. | Introduce explicit holding/tenure and residence/working-complex relations. Never infer ownership or household count from a generated field cell identifier. |
| Nucleated fields receive shelters/granges at distance thresholds; dispersed farmsteads receive barns; comments state true field barns belong only to the dispersed/enclosed side. | **PARTIAL CANDIDATE, OVERSTATED EXCLUSION.** Hound Tor, Havrå and other cases support functional outbuildings and distant/seasonal nodes, and it is prudent not to dot every open-field strip with barns. Wave 1 does not prove an exclusive Europe-wide barn rule or the distance/rate values. | Type barn, outbarn, shelter, byre, grange, store and seasonal structure, with function, phase and regional/source predicates. Treat absence as unknown unless coverage supports it. |
| Every recognised outlying mill, extraction site, kiln or waystation earns a resident keeper; a `port` creates a landing hamlet. | **POSSIBILITY, NOT UNIVERSAL RULE.** Sources show resident/working complexes and clustered fishing systems can occur, but not that every worksite has a resident or every shore activity clusters identically. | Require a dossier/world occupancy and labour predicate plus access/seasonality. A worksite can be staffed from elsewhere, temporary, abandoned or functionally mixed. |
| Faubourg logic shares the file with rural habitation. | **SEPARATE EVIDENCE DOMAINS.** Gate-concentrated extramural urban growth is an urban mechanism and cannot validate field settlement. | Preserve separate mechanism definitions, eligibility predicates, tests and receipts even if low-level geometry helpers are shared. |

### 8.3 `fields.js`

| current hypothesis | Wave-1 ruling | required architectural correction before promotion |
|---|---|---|
| File header declares “THE OPEN-FIELD SYSTEM … AS TRUTH,” and `buildFields()` is the general countryside derivation. | **REJECTED AS UNIVERSAL.** Open field is one regime among enclosed, irregular, infield/outfield, ladder, meadow/heath, woodland/extraction, irrigated, terraced, seasonal and mixed systems. | Select a typed land/rights regime from world and phase predicates. `buildFields()` may become an open-field implementation, not the default rural landscape. |
| `ACRES_PER_SOUL=1.2`, the fallback `METRES_PER_FRONTAGE=5`, `REFERENCE_RELIEF=.30`, a two-/three-field premise, `REACH_METRES=2400`, `wetBest=.30`, slope/wetness thresholds and food-economy shares `{tillage:1, trade:.74, fish:.46}` are presented with historical rationale. Further choices include `LATTICE_JITTER=.44`, a three-to-six-strip target, a low-normalized-height “lee” multiplier without a wind fact, and a `.42 * accentBand` hedgerow-tree rate. | **UNLICENSED CALIBRATION.** None was estimated by this survey; the sample cannot validate cross-period yield, fallow, diet, transport, terrain thresholds, strip counts, wind exposure or hedgerow-tree frequency. Some values may remain visual/engineering parameters, but that does not make their land-use semantics historical. | Keep experimental constants outside historical authority and classify each as historical/world, engineering, or presentation scope. `RSLP-1` may later support eligible conditional distance, dimension, terrain-response or access relationships within a declared regime; it cannot identify regime occurrence, strip-count distributions, hedgerow frequency or activation weights. Those remain `NOT_IDENTIFIED`/`NONE` unless a separate probability-sampling protocol identifies them. An explicit canonical cause may instantiate this settlement while those population quantities remain unidentified. |
| Current tillage admission now calls the shared `buildableAt`/`bodyRefusal` ground-refusal machinery before applying `TILLAGE`-specific limits. | **COHESIVE STRUCTURAL REPAIR, NOT AGRICULTURAL CALIBRATION.** Reusing one absolute rock/water/body refusal prevents the field layer from contradicting the built substrate. It does not validate `terraceMax=.66`, `wetMax=.74` or the claim that all other admitted ground belongs in one arable ranking. | Preserve the shared absolute-refusal dependency and its receipt. Keep regime-specific agricultural suitability, terraces and land-use allocation separately typed. `RSLP-1` may promote a scoped conditional suitability range after its gates, never an occurrence or activation probability. |
| `COUNTRYSIDE_SHARE` maps product tier from `0.90` at thorp to `0.15` at metropolis and budgets drawing operations accordingly. | **PRESENTATION PARAMETER ONLY.** A composition budget may be useful, but it is not evidence for historical land share, catchment size or settlement type. | Label and test as a folio/LOD decision. Do not expose it as derived rural extent, supply or historical density. |
| All working land is closed into a contiguous jittered lattice; a refused candidate surrounded on three sides is filled, and every emitted furlong receives a hedge polygon. | **GEOMETRIC TECHNIQUE WITH HISTORICAL RISKS.** Shared-vertex tiling is a sound way to avoid render cracks, and current shared ground refusal can preserve genuine rock/water exclusions. Historical “no gaps” is still not universal: commons, wet hollows, woods, paths, waste, orchards, extraction and unallocated rights can interrupt arable. Hedgerows are not equivalent to open-field baulks. | Separate topology closure from land-use truth. Never close across a typed refusal or non-arable right. Preserve typed non-arable islands and boundary kinds. Use hedge, bank, ditch, baulk, wall or no visible boundary only when the selected regime permits it. |
| Tillage always produces three “great fields”; fish/trade produce two, with a settlement-facing prevailing grain and per-furlong deformation. | **UNLICENSED COUNT AND ORIENTATION.** The cases support coherent field systems and terrain/access deformation as possibilities, not two/three counts, a count distribution or centre-facing grain. | Read a settlement's field count/rotation/bearing only from an explicit world/phase fact; otherwise retain `UNKNOWN`. `RSLP-1` may test a scoped conditional orientation relationship, but it does not supply a seeded count distribution. Never use a central bearing solely for visual legibility. |
| Field lanes branch from settlement roads and run along baulks. | **BOUNDED CANDIDATE.** Newbold, Greetwell and other cases support access between settlement and working land; route topology and rank vary and may include hollow ways, back lanes, droveways, water routes or paths predating the settlement. | Promote only a general access obligation: every active work unit needs a plausible typed access relation. Do not require one branching morphology. |
| Supply and arable share are reported from the visible leaf. | **VALID HONESTY PRINCIPLE, INCOMPLETE WORLD MODEL.** Separating source/ground quantities from render budget is sound. A map window still cannot close a settlement's food ledger without imports, distant holdings, common grazing, seasonality and yield uncertainty. | Keep render coverage, represented coverage and simulation supply as separate metrics. Never make a visual parcel sample the causal food ledger. |

### 8.4 `commons.js`

| current hypothesis | Wave-1 ruling | required architectural correction before promotion |
|---|---|---|
| The module treats common, green, paddock, churchyard glebe and burgage back-paddock as variants of a reserved unbuilt hole. | **ONTOLOGICALLY CONFLATED.** These have different owners/rights, functions, access, seasonality and relations to settlement. Common rights can overlay heath, woodland, meadow, shore or cultivated ground; they are not defined by vacancy. | Model land parcel, rights holders, rights types, seasons and exclusions separately. A visible green may be one realisation, not the common itself. |
| `COMMONS_TIER` assigns zero commons to thorp/hamlet, one to village, two to town and three to city/metropolis, with fixed radius shares. | **UNLICENSED AND COUNTEREXAMPLED.** Ruthven and clachan/township evidence show small settlements can have common or summer-grazing systems; villages need not have a central green. | Delete tier as a historical decider. Count/extent must come from an explicit regime/right/phase fact; otherwise remain `UNKNOWN`. `RSLP-1` cannot replace the table with a common-count or radius distribution: those remain `NOT_IDENTIFIED` absent the separate probability protocol. |
| `COMMONS_GROUND` retains a generic “flat and dry” eligibility law: the shared `refusalAt` predicate, `scarpCost <= .55` and `wet <= .55`. The earlier `maxSlope=.52` threshold is gone. | **REJECTED AS A COMMON-RIGHTS UNIVERSAL.** Sharing the absolute ground-refusal law is structurally coherent for a body, but upland summer grazing, heath, meadow and shore rights defeat one muster-green suitability predicate for every common. | Preserve shared physical refusal where a rendered body needs it. Terrain suitability belongs to the right's land use—muster green, meadow, peat, wood, heath, grazing—not to “common” as a class. |
| A common is placed on an unused compass bearing 24–52% of built extent, before district growth. | **VISUAL PACKING HEURISTIC, NOT HISTORICAL MECHANISM.** District-category gaps do not establish tenure, legal reservation or location. | If retained, name it as an artistic open-space allocator. Historical common geometry requires world rights and phase lineage; it must not be justified by this evidence. |
| Each reserved feature stores an irregular `polygon`, but `inCommons()` tests the feature's circular radius instead. Placement/collision and visible geometry therefore consult different boundaries. | **CANONICAL-GEOMETRY DEFECT.** Determinism does not cure two answers to “is this point in the reserved ground?”; later fabric can be excluded from invisible ground or admitted into the displayed polygon. | Use the stored canonical polygon, with one declared padding operation, for every reservation, collision, render and hit-test consumer. Do not promote the current circle/polygon pair as one artifact. |
| Moving/enclosing a common is treated as requiring an Act and as an urban inertia rule. | **TOO NARROW AND ANACHRONISTIC AS A EUROPE-WIDE LAW.** Formal and informal tenure changes vary by polity and period. | Represent a named legal/tenurial event where the world has one; otherwise preserve the right and uncertainty rather than inventing a generic Act. |

### 8.5 Related assembly, compiler, route, substrate and institution machinery

The three named rural files do not execute in isolation. The current hashes were therefore traced
through their direct causes and consumers. This is still a bounded cohesion audit, not a claim that
every sandbox module was historically calibrated.

| current machinery | Wave-1/specification ruling | bounded correction before promotion |
|---|---|---|
| `compile.js` has no `mapTraditionId` or `historicalEvidenceScopeRef` row resolving `HistoricalEvidenceScopeBinding`, and no typed agrarian/tenurial regime. `readFoodEconomy()` classifies commodity/industry prose by regex, maps livestock/wool/farm to `tillage`, derives fish from an otherwise unstated coast, and defaults an unstated landlocked case to `tillage`. `buildFabric.js` and `fields.js` retain a tillage fallback. | **INCOMPATIBLE WITH THE BINDING COMPILE SEAM.** `GENERATION-SPEC` §10.18 requires `EUROPEAN_FANTASY_BASE` scope binding and typed dormancy/refusal for a missing fact. A textual approximation may support UI explanation; it may not manufacture the runtime cause demanded by §10.1 below. | Add the exact evidence-scope ref and production/agrarian facts with an explicit `UNKNOWN` state. Missing or unsupported regime evidence yields a dormant/`STRUCTURAL_ONLY` artifact or typed refusal, never default open fields. |
| The same wool/livestock words have contradictory consequences: `forcedConstraints()` adds `tillage`; `RESOURCE_GROUND` assigns them `rough-pasture`; and `readFoodEconomy()` sends them to maximum tillage/open fields. | **ONE WORLD FACT, CONFLICTING RURAL REGIMES.** Pastoral, arable and mixed production are not aliases. The contradiction is architectural without—and cannot be cured by—an `RSLP-1` occurrence probability. | Compile one canonical typed production classification from the actual world accessor. Preserve pastoral, arable and mixed components separately; `UNKNOWN` remains unknown. Remove duplicated word readers from downstream geometry. |
| In `routes.js` an absent campaign route ledger still creates at least one seeded regional corridor; fixed route, ford and crossing weights then pull the canonical founding site. `compile.js` derives 1–3 arterials from `tradeRouteAccess` while `substrate.js` separately rereads that raw property into 1–6 roads and fixed grades. | **STRUCTURAL IDEA, UNLICENSED CAUSAL FALLBACK.** “Regional route before route-founded settlement” is a sound dependency when a route fact exists. A declared seed is still invented regional geography, and the duplicate raw read violates the promised one compilation seam. | With a canonical regional/route ledger, derive one typed route skeleton and connect approaches to it. Without one, publish route dormancy/refusal; a seeded presentation corridor must not pull the canonical site. Compile the fact-provided route class/count and a scoped engineering grade once. `RSLP-1` does not identify a route-count distribution or occurrence weight. |
| `substrate.js` hard-codes resource-ground relief/wet/rock contracts, a six-candidate resource pool, rank weights and coherence floors for ore, quarry, fish, timber, grain, wool and livestock. | **UNLICENSED AS HISTORICAL LANDSCAPE LAW.** Resource-to-ground coherence is a valid obligation, but this Wave 1 did not estimate these thresholds, and changing substrate to make an economic word plausible can hide a contradictory dossier/world state. | Preserve terrain and resource as separately typed facts. Treat current scoring as experimental solver engineering. After its gates, `RSLP-1` may promote a scoped conditional resource–ground relationship or engineering range, not a resource occurrence frequency, candidate-count distribution or activation weight. Record conflict/refusal instead of fitting substrate to prose. |
| `institutions.js` supplies fallback archetype rings/weights and name-regex classifications for mills, extraction, kilns, ports and waystations; `habitation.js` can then turn every recognised outlying worksite into a keeper dwelling or landing cluster. | **CLASSIFICATION DOES NOT LICENSE LOCATION OR OCCUPANCY.** A name may select a bounded drawing archetype, but it cannot prove that a worksite is outlying, resident-staffed, permanent or clustered. | Compile institution identity/function from canonical facts, then require separate spatial, labour, occupancy, access and seasonality predicates. Unknown fallback classification may stay presentational but cannot create a canonical rural household. |
| `buildFabric.js` Stage 6b creates fields only after the urban partition, umbrella, streets, parcels and institutions exist, using the completed urban umbrella as `inTown` exclusion. Stage 6d then derives habitation from those synthetic furlongs. | **DOWNSTREAM-LEFTOVERS ARCHITECTURE; INCOMPATIBLE WITH RM-01, §7 item 15 and §13.** It is precisely the model this report rejects: rural land is whatever the completed town did not consume. Earlier regional-route staging does not cure the missing land/holding/right/production causes. | Introduce an upstream or co-derived `RuralLandscapePhase` with typed land regime, holdings, rights, access, water/production and occupancy. Urban extent and rural artifacts must reconcile against one another through canonical dependencies and receipts. Until then, Stage 6b/6d output remains experimental/presentational and must not feed canonical supply or world state. |

### 8.6 Direct disposition

The most defensible parts of the sandbox are structural software ideas, not the historical values:

- distinguish residence from fields and work buildings;
- connect active work to plausible access;
- make geometry deterministic and keep draw-budget truth separate from derived-world truth;
- preserve substrate constraints and refuse impossible overlaps; and
- represent contraction, preservation and source coverage explicitly.

The hard-coded tenure coefficients, rates, distances, field counts, field-economy shares,
tier-to-common counts, common radii and universal nucleation/open-field claims remain experimental
hypotheses. Wave 1 expressly does **not** license them, and no tuning pass may cite these 30
contrastive entries as their statistical basis.

They are not all merely waiting for `RSLP-1` tuning. Conditional distances, dimensions, terrain
responses and access relationships may become scoped engineering ranges after the applicable gates.
Occurrence rates, count distributions, frequencies, prevalence, country/tier priors and activation
weights remain `NOT_IDENTIFIED`, with `activationWeight=NONE`, unless a separate
probability-sampling protocol identifies them. An explicit canonical world fact may activate a
mechanism directly, but does not convert that fact into a prevalence estimate.

The current sandbox is therefore not the target rural architecture described here. The defensible
low-level geometry and shared-refusal work may be carried forward, but its present compiler defaults,
resource/route weights, downstream field allocation, holding inference, common geometry and
occupancy synthesis must remain dormant or explicitly presentational at the canonical seam.

---

## 9. Future `RSLP-1` preregistered cohort

### 9.1 Unit, frame and strata

The child manifest must freeze one unit as a versioned settlement/landscape phase. It must define a
European candidate universe before outcome coding and balance, at minimum:

- macro-region and source/publisher tradition;
- represented period and phase resolution;
- agrarian/tenurial regime, including an explicit `UNKNOWN` class;
- topography, hydrology and transport context;
- settlement dispersion/cluster topology;
- permanent, seasonal and mixed occupancy;
- source type, survey/excavation coverage and preservation environment; and
- inhabited, shrinking, relocated, abandoned and reused conditions.

Strata improve contrast and coverage. They do not create prevalence estimates. Country labels are
sampling controls, never morphology causes.

Every selection stratum must be assignable from a frozen metadata-only rubric before any
outcome-bearing source is opened; otherwise its frame value is `UNKNOWN`. Audit-observed agrarian
regime, settlement topology, occupancy or inhabited/shrinking/relocated/abandoned/reused condition
may become mechanism-cohort variables, but may not retrospectively determine selection, reserve
order or holdout allocation.

### 9.2 Required freezes

Before any outcome-bearing artifact is opened or coded, freeze and hash:

1. protocol and child-manifest versions;
2. source-frame inclusion/exclusion rules and stable site/phase identifiers;
3. numeric sample size, deterministic seed, selected order and same-stratum reserves;
4. development, calibration, validation and **18% sealed holdout** identities;
5. the codebook, variable definitions, missingness and coverage rules;
6. rights policy and permitted custody for every source class;
7. instrument versions, transformation lineage and visual-inspection procedure;
8. double-coding sample and disagreement adjudication;
9. fixed batch schedule and stopping rules; and
10. declared candidate mechanisms and falsification tests.

The allocation/holdout unit is the highest leakage **site/source-package cluster**, not an individual
phase or record. One frozen `clusterId` must contain every alias, phase, edition, derivative summary
and materially overlapping source package capable of revealing the same site's outcomes. No
development/holdout/reserve split may cross a cluster. Let `C` be the number of eligible selected
clusters after metadata-only exclusions; the sealed count is
`H(C) = floor(0.18 * C + 0.5)`, with the final share required to remain within 15–20%. Selection and
replacement use deterministic same-stratum cluster queues. Holdout cluster identities, package
members and reserve identities remain opaque to the working team until the one-way evaluation; only
the public seal and aggregate frozen-stratum counts are released.

No source inspected in Wave 1 is eligible for the genuinely unseen holdout.

If the child manifest retains separate “calibration” or “validation” labels, they are declared
subroles inside the opened development allocation with their own access rules. They do not create
additional openings of the 18% sealed holdout, whose identities remain opaque until the one-way
evaluation authorised by `HEEP-1`.

### 9.3 Measurements that the cohort must distinguish

| family | minimum observables; each carries phase, coverage and uncertainty |
|---|---|
| **settlement topology** | occupied cluster count; dwelling versus working-building counts; nearest-neighbour and cluster-separation measures; linear/polyfocal/dispersed graph descriptors; occupied versus known-empty structures |
| **holding topology** | holding count where knowable; fragmented versus contiguous holdings; frontage/backland relation; toft/croft/yard dimensions only where scale and boundaries permit; subdivision/amalgamation lineage |
| **working complex** | house–barn–yard–store–enclosure adjacency and typed function; shared versus individual facilities; functional-building/household distinction |
| **field regime** | open/common field, closes, strips/furlongs, irregular/rectilinear, terraced, ladder, infield/outfield, meadow, orchard, woodland, waste and mixed/boundary-loss states; boundary type and visibility |
| **rights and commons** | right type, holders, season, resource, exclusions, access and overlap with other land uses; visible green geometry separately from legal/customary rights |
| **access network** | settlement-to-field/common/wood/production paths; hollow ways, back lanes, droveways, track hierarchy, water routes and crossings; persistence, abandonment and route centrality |
| **hydraulic network** | supply, drainage, irrigation, power/mill, flood management, wells, channels and crossings as separate functions; source/flow/sink topology and maintenance phase |
| **terrain relation** | elevation, slope, aspect, landform, floodplain/ecotone relation and terracing, with source resolution and regime-specific suitability |
| **production landscape** | woodland/assart, peat, quarry/mine, kilns, mills, fishing, storage, drying and other open work ground; resource–process–route–settlement linkage |
| **seasonality** | occupancy intervals, home/seasonal-site relationship, travel mode/distance, seasonal structures and resource calendar |
| **change** | expansion, subdivision, consolidation, amalgamation, relocation, abandonment, removal, burial persistence, agricultural reuse and restoration; cause may remain `UNKNOWN` |
| **evidence visibility** | surveyed/excavated area, source resolution, detection limits, standing/earthwork/buried survival, later truncation, map purpose and protected-area versus historical-extent distinction |

Absolute dimensions require a declared scale and permissible geometry. Otherwise use topological or
dimensionless measures and mark the value `NOT_OBSERVABLE`; do not estimate it from an illustration.

### 9.4 Probability-identification boundary

Passing `RSLP-1` can identify bounded **conditional engineering evidence**: mechanism possibility
and counterexamples, eligibility under already-declared world/phase predicates, directional
relationships, and stable distance/dimension/tolerance/ratio ranges within the exact eligible
period, region, regime, terrain, source and coverage scope. A range is conditional on the mechanism
already being active; it is not evidence for how often the mechanism activates.

`RSLP-1` alone cannot identify occurrence rates, count distributions, frequencies, prevalence,
country/tier priors or activation weights. Balanced strata, a numeric cohort, double coding,
saturation, range stability and an 18% sealed holdout do not create known inclusion probabilities.
Those probability-bearing outputs remain `NOT_IDENTIFIED` and `activationWeight=NONE`.

There are only two lawful activation routes:

1. an explicit canonical world/phase fact satisfies a promoted mechanism's typed predicate, causing
   deterministic conditional execution; or
2. a separately owner-authorised probability-sampling protocol freezes a target population,
   probability frame and inclusion design, estimand, design/nonresponse weights, clustering,
   missingness, diagnostics and held-out evaluation before outcome access.

The first route identifies a cause for one settlement, not historical prevalence. The second is
outside the completion claim of this `RSLP-1` contrastive/balanced cohort unless separately
declared and passed.

### 9.5 Candidate mechanism tests

Each test must state:

- eligible phases and exclusions before inspection;
- the observable consequence and a counterexample that would narrow or reject it;
- whether it tests possibility, topology, conditional engineering-range stability or implementation
  behaviour;
- source coverage required for a meaningful negative;
- the expected conditional effect direction without inventing an activation frequency;
- dependencies and alternative causes;
- the probability disposition—normally `occurrenceFrequency=NOT_IDENTIFIED`,
  `countDistribution=NOT_IDENTIFIED` and `activationWeight=NONE`;
- development/calibration/validation separation; and
- the untouched holdout metric and failure condition.

Site phases, aliases, editions, derivative summaries and materially overlapping packages stay inside
their frozen site/source-package cluster. Reporting must not count them as independent observations
without an explicit hierarchical treatment, and no later access may re-split the allocation unit.

### 9.6 Gates

No scoped conditional engineering range/relationship or runtime mechanism promotion is lawful until
all applicable gates pass:

- **frame gate:** frozen candidate universe, deterministic selection and reserve audit;
- **rights gate:** every stored artifact and derived measurement has authorised custody/use;
- **source gate:** source role, dates, scale/legend applicability and transformation lineage;
- **coverage gate:** observable area and detection limits support each claim or negative;
- **coding gate:** double coding, disagreement record and required reliability;
- **batch gate:** fixed additions meet the preregistered stability/stopping rule;
- **holdout gate:** 18% seal remained untouched until the declared evaluation;
- **mechanism gate:** alternatives and counterexamples do not exceed the frozen scope;
- **implementation gate:** typed operation, deterministic tests, receipts and canonical artifact
  integrity; and
- **product gate:** the mechanism binds `mapTraditionId: EUROPEAN_FANTASY_BASE` and does not
  activate geometry from narrative `cultureId` or inherit a non-European analogy.

A failed gate is a finding. It cannot be cured by widening a band, swapping a source after outcomes
are known or relabelling internal generated plates as observations.

Passing every gate above does not identify probability. Occurrence, count-distribution, frequency,
prevalence and activation-weight fields retain the `NOT_IDENTIFIED`/`NONE` disposition under
§9.4 route 1: an explicit canonical fact may activate this settlement but says nothing about a
target-population rate. Only route 2's separately authorised probability-sampling protocol may
populate those probability fields, and only for its declared estimand/scope after its own gates.

---

## 10. Runtime integration and authority

### 10.1 Runtime never reads evidence records directly

The lawful chain is:

```text
official source
  → claim-sized research record with role/date/coverage/uncertainty/rights
  → preregistered cohort test and counterexample audit
  → reviewed HistoricalMechanismDefinition
  → manifest-owned eligibility and dossier/world predicates
  → typed operation with deterministic implementation evidence
  → receipt-backed CanonicalSpatialArtifact
  → renderer/lens
```

Research records explain and constrain candidate mechanisms. They are not runtime inputs. A URL,
country, atlas tag or visual similarity never causes a field, common or farmstead. The runtime cause
must be a SettlementForge world fact—tenure, food system, access, resource, seasonal practice,
security event, hydrology, terrain, institutional change or another reviewed predicate.

A promoted conditional relationship may parameterise geometry only after that cause is present.
Where the canonical fact is absent or `UNKNOWN`, the mechanism is dormant/refused; `RSLP-1` does
not provide a random activation draw. Unless separately probability-authorised,
`occurrenceFrequency`, `countDistribution` and `prevalence` remain `NOT_IDENTIFIED` and
`activationWeight` remains `NONE`.

### 10.2 Canonical artifact requirements

If rural work is promoted later, the canonical artifact must preserve at least:

- phase/version and source/mechanism lineage;
- settlement, holding, work-building, field, rights, route, water and production identities;
- typed adjacency and dependency relations;
- intent versus realised geometry where that distinction is actually supported;
- unknown/alternative states rather than renderer-filled facts;
- representation and coverage metadata separate from world truth; and
- deterministic operation and validation receipts.

The renderer may simplify geometry by scale but may not invent missing holdings, hedges, barns,
commons or crops and report them back as causal state.

### 10.3 Internal synthetic-atlas demotion

The existing generated plate corpus, calibration notes and attractive countryside exemplars remain
a **visual register**. They can reveal legibility needs, renderer defects, deterministic failures
and useful candidate primitives. They cannot:

- prove that a morphology is historical;
- establish `ACRES_PER_SOUL`, tillage shares, tenure weights, building rates, occurrence
  frequencies or count distributions;
- supply a rural source date, excavation coverage or rights status;
- tune `RSLP-1` before its frame is frozen; or
- enter the rural holdout.

Statements in internal documents such as “hf3 teaches…” are hypotheses about a generated image,
not empirical accounts of a medieval landscape.

---

## 11. Rights and custody

This survey cites and paraphrases official sources. It does not place source binaries, scans,
traced polygons or copyrighted redraws in the repository.

| source family | Wave-1 handling and future requirement |
|---|---|
| Historic England list/report text | List text may carry Open Government Licence terms, while maps, Ordnance Survey material, photographs and Archive items can carry separate rights. Cite and paraphrase only here; audit every artifact before storage or measurement. |
| Historic Environment Scotland | Designation text and legal maps remain subject to HES terms. A scheduled polygon is not licensed historical geometry merely because it is public. |
| Heritage Council and Discovery Programme | Citation and bounded paraphrase only. A future deep package must record publication-specific terms before retaining PDFs, figures or derived geometry. |
| Netherlands RCE | Citation and method/context use only in this wave. Cadastral and designation illustrations need source-layer and rights review before extraction. |
| Inrap and French Ministry/DRAC | Images, plans and excavation media carry credited institutional/author rights. No reuse or tracing is authorised by this survey. |
| German LDA | Press and “Fund des Monats” images can have restrictive reuse terms. Findings are paraphrased; no image asset is copied. |
| Norway, Sweden, Denmark and Slovakia official sources | Public access is not a blanket licence. Preserve URL, publisher, date and rights statement; use citation-only until an explicit licence permits more. |
| Junta de Andalucía TABULA | Resource metadata may state public use with attribution while site/footer terms can reserve other content. The conservative rule is citation/paraphrase only unless the exact artifact licence is resolved. |

If later acquisition is lawful, the evidence store should retain source metadata, content hash,
acquisition/transform receipt and permitted use. Citation-only records retain metadata and
paraphrase, never restricted binaries or traced geometry.

---

## 12. Official-source bibliography

### Method and source-class controls

- Historic England. *Medieval Settlements: Introductions to Heritage Assets*. October 2018,
  first issued 2011. <https://historicengland.org.uk/images-books/publications/iha-medieval-settlements/heag210-medieval-settlements/>
- Heritage Council. *Historic Landscape Characterisation Guidance*. 2013.
  <https://www.heritagecouncil.ie/content/files/historic_landscape_characterisation_guidance_2013_8mb.pdf>
- Slots- og Kulturstyrelsen. *Hus, gård og toft*.
  <https://slks.dk/omraader/kulturarv/arkaeologi-fortidsminder-og-diger/arkaeologi-paa-land/arkaeologiske-strategier/middelalder-landbebyggelse-1050-1536-ekr/hus-gaard-og-toft>
- Institut national de recherches archéologiques préventives. Medieval habitation overview.
  <https://multimedia.inrap.fr/archeologie-preventive/periode/10/Moyen-Age/56/Occupations-habitats-logements>
- Rijksdienst voor het Cultureel Erfgoed. Essenkaart dataset.
  <https://kennis.cultureelerfgoed.nl/index.php/Dataset/50>
- Rijksdienst voor het Cultureel Erfgoed. Drentsche Aa landscape panorama.
  <https://kennis.cultureelerfgoed.nl/index.php/Panorama_Landschap_-_Drentsche_Aa>

### England and Scotland

- Historic England. Wharram Percy, Research Report 94/2004.
  <https://historicengland.org.uk/research/results/reports/94-2004>
- Historic England. Wharram Percy full survey-report endpoint.
  <https://historicengland.org.uk/research/results/reports/6454/WharramPercyDesertedMedievalVillageNorthYorkshire_ArchaeologicalInvestigationandSurvey_SurveyReport>
- Historic England. Wharram Percy scheduled record 1011377.
  <https://historicengland.org.uk/listing/the-list/list-entry/1011377>
- Historic England. Gainsthorpe list entry 1007509.
  <https://historicengland.org.uk/listing/the-list/list-entry/1007509>
- Historic England. Hound Tor list entry 1016255 and measured-drawing catalogue entry.
  <https://historicengland.org.uk/listing/the-list/list-entry/1016255>;
  <https://historicengland.org.uk/images-books/photos/item/MP/HTM0004>
- Historic England. Stock list entry 1020367.
  <https://historicengland.org.uk/listing/the-list/list-entry/1020367>
- Historic England. Sweetworthy list entry 1008469.
  <https://historicengland.org.uk/listing/the-list/list-entry/1008469>
- Historic England. Greetwell list entry 1017332.
  <https://historicengland.org.uk/listing/the-list/list-entry/1017332>
- Historic England. Newbold list entry 1019634.
  <https://historicengland.org.uk/listing/the-list/list-entry/1019634>
- Historic Environment Scotland. Eldbotle SM10352.
  <https://portal.historicenvironment.scot/apex/f?p=1505%3A300%3A%3A%3A%3A%3AVIEWTYPE%2CVIEWREF%3Adesignation%2CSM10352>
- Historic Environment Scotland. Ruthven SM11901.
  <https://portal.historicenvironment.scot/apex/f?p=1505%3A300%3A%3A%3A%3A%3AVIEWTYPE%2CVIEWREF%3Adesignation%2CSM11901>
- Historic Environment Scotland. Little Eddieston SM12549.
  <https://portal.historicenvironment.scot/apex/f?p=1505%3A300%3A%3A%3A%3A%3AVIEWTYPE%2CVIEWREF%3Adesignation%2CSM12549>
- Historic Environment Scotland. Old Redhead SM13722.
  <https://portal.historicenvironment.scot/apex/f?p=1505%3A300%3A%3A%3A%3A%3AVIEWTYPE%2CVIEWREF%3Adesignation%2CSM13722>

### Ireland and the Netherlands

- Heritage Ireland. Céide Fields.
  <https://heritageireland.ie/places-to-visit/ceide-fields-neolithic-site-visitor-centre/>
- Discovery Programme. Medieval Rural Settlement Project.
  <https://discoveryprogramme.ie/projects/past-projects/mrsp/>;
  <https://discoveryprogramme.ie/projects/past-projects/medieval-rural-settlement-project/>
- Discovery Programme. Medieval Rural Settlement Project, Dublin module.
  <https://discoveryprogramme.ie/projects/past-projects/medieval-rural-settlement-project-the-dublin-module/>
- Rijksdienst voor het Cultureel Erfgoed. Rheeze protected-village explanation, designation
  January 1988.
  <https://archisarchief.cultureelerfgoed.nl/Beschermde_Gezichten/BG1388/TOELICHTING_aanwijzing_1388.pdf>

### France and Germany

- Inrap. Saint-Gilles de Missignac / Saint-Gilles le Vieux site atlas.
  <https://multimedia.inrap.fr/atlas/Nimes/sites/3258/Madame-Saint-Gilles-le-Vieux>
- DRAC Auvergne-Rhône-Alpes / Inrap. Les Tierces, Villarodin-Bourget. 9 January 2023.
  <https://www.culture.gouv.fr/regions/drac-auvergne-rhone-alpes/actualites/un-village-deserte-du-bas-moyen-age-et-une-chapelle-d-epoque-moderne-a-villarodin-bourget-savoie>
- Landesamt für Denkmalpflege und Archäologie Sachsen-Anhalt. Dorf Anhalt. 31 August 2017.
  <https://www.lda-lsa.de/presse-und-oeffentlichkeitsarbeit/presseinformationen/archiv-der-presseinformationen/2017/310817-archaeologische-untersuchungen-dorf-anhalt>
- Landesamt für Denkmalpflege und Archäologie Sachsen-Anhalt. Köckte, *Fund des Monats*, October
  2016. <https://www.lda-lsa.de/en/archaeologie/fund-des-monats/2016/oktober-2016>
- Landesamt für Denkmalpflege und Archäologie Sachsen-Anhalt. Marsleben, *Fund des Monats*, October
  2005. <https://www.lda-lsa.de/archaeologie/fund-des-monats/2005/oktober-2005>

### Norway, Sweden and Denmark

- Riksantikvaren. Havrå.
  <https://riksantikvaren.no/kulturhistorie/havratunet-norske-akveduktar/>
- Riksantikvaren. Vega Archipelago World Heritage property.
  <https://riksantikvaren.no/en/world-heritage/vegaoyan-the-vega-archipelago/>
- Länsstyrelsen Halland. Äskhult official page.
  <https://www.lansstyrelsen.se/halland/besoksmal/kulturmiljoer/askhult.html>
- Länsstyrelsen Halland. Äskhult brochure. 2010.
  <https://www.lansstyrelsen.se/download/18.68fbc90d193243b379e4940f/1732529018178/%C3%84skhult%20p%C3%A5%20svenska.pdf>
- Riksantikvarieämbetet. Vallgårda national-interest document, updated 19 November 2011.
  <https://www.raa.se/publicerat/varia2012_12.pdf>
- Riksantikvarieämbetet. Leksand seasonal-settlement record L2000:529 / RAÄ Leksand 501:4.
  <https://app.raa.se/open/fornsok/lamning/2ddfd569-710e-4db6-b8f6-5f3d5e469757>
- Slots- og Kulturstyrelsen. Østergård/Hyrup discussion within *Hus, gård og toft*.
  <https://slks.dk/omraader/kulturarv/arkaeologi-fortidsminder-og-diger/arkaeologi-paa-land/arkaeologiske-strategier/middelalder-landbebyggelse-1050-1536-ekr/hus-gaard-og-toft>

### Spain and Slovakia

- Junta de Andalucía. Sierra de los Filabres 1988 campaign report.
  <https://www.juntadeandalucia.es/cultura/tabula/bitstream/20.500.11947/10841/1/AAA_1988_093_creissier_filabres_almeria.pdf>
- Junta de Andalucía. Majada de las Vacas / Guadix-Baza project metadata, fieldwork 1999,
  publication 2002. <https://www.juntadeandalucia.es/cultura/tabula/handle/20.500.11947/16461>
- Monuments Board of the Slovak Republic. Vlkolínec overview.
  <https://www.pamiatky.sk/ochrana-pamiatok/svetove-dedicstvo-unesco/rezervacia-ludovej-architektury-vlkolinec>
- Monuments Board of the Slovak Republic. Vlkolínec OUV statement.
  <https://www.pamiatky.sk/fileadmin/documents/unesco/vyhlasenie_Vlkolinec.pdf>
- Monuments Board of the Slovak Republic. Vlkolínec protection guidance and 2011 map.
  <https://www.pamiatky.sk/ochrana-pamiatok/zasady-ochrany-pamiatkovej-rezervacie/zasady-ochrany-pr-vlkolinec>;
  <https://www.pamiatky.sk/fileadmin/documents/ZASADY-PR/Vlkolinec/mapa-2011-vlkolinec.pdf>

---

## 13. Architectural ruling

Wave 1 is sufficient to reject an urban-fill model of the countryside and to identify a coherent
future architecture: typed settlement/holding/work/land/right/route/water/production artifacts,
phase lineage, source and visibility masks, and reviewed mechanism promotion from actual world
predicates. It is also sufficient to demote the current universal open-field, binary tenure and
tier-common hypotheses to experimental sandbox status. The exact current sandbox still constructs
Stage 6b fields and Stage 6d habitation downstream of completed urban fabric, so it demonstrably has
not yet implemented that future architecture.

Wave 1 is **not** sufficient to replace those hypotheses with new numeric ones. The objectively
stronger next step is the preregistered `EUROPEAN_FANTASY_BASE` `RSLP-1` child cohort described
in §9, followed by claim-sized registry implementation, mechanism-specific promotion and
implementation receipts. Until those gates exist, the system may use rural primitives for clearly
labelled visual experimentation, but it may not call their rates, weights or universal forms
historically conditioned or feed them back as canonical world facts.

Even after those gates, promotion is limited to scoped conditional engineering relationships/ranges
inside a mechanism activated by an explicit canonical world/phase fact. `RSLP-1` does not identify
occurrence rates, count distributions, frequencies, prevalence, country/tier priors or activation
weights. Those remain `NOT_IDENTIFIED` with `activationWeight=NONE` unless the separately
authorised probability-sampling route in §9.4 is completed.
