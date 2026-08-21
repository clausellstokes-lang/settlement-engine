# Historical Urbanism Evidence for SettlementForge

**Status:** Wave 1 research synthesis and evidence-governance foundation; **not a completed historical corpus**  
**Survey date:** 2026-08-20  
**Machine-readable companion:** `map-corpus/historical-evidence/`  
**Binding expansion protocol:** `map-corpus/docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md`  
**Runtime authority:** `map-corpus/docs/GENERATION-SPEC.md`, especially §§10.0, 10.14, 10.17–10.23

This document records what the official European historic-towns-atlas tradition can and cannot
license for SettlementForge. It is deliberately neither a catalogue of attractive medieval plans
nor a country-style lookup table. Its purpose is to preserve the evidential discipline of the
atlases while translating bounded observations into candidate causal mechanisms for a deterministic,
simulation-first settlement generator.

The governing conclusion is:

> A historically credible settlement is a dated, path-dependent result of changing substrate,
> access, institutions, jurisdictions, parcels, infrastructure, rupture and reuse. An atlas can
> witness or reconstruct parts of that history. It cannot turn one surviving plan into a universal
> medieval grammar, and it cannot supply a cause that the SettlementForge world does not possess.

---

## 1. Wave 1 scope, coverage and the exact meaning of “comprehensive”

This work has two different coverage claims. They must not be collapsed.

### 1.1 Program and architecture survey: comprehensive for the present decision

The review covered the official European Historic Towns Atlas method, the official international
working-group inventory, the relevant national-program structures, their declared map families,
source roles, legends, essays, digital/GIS approaches and rights boundaries. It also surveyed the
current SettlementForge map architecture, the historical-research reports supplied for background,
the 313-plate internal map corpus and its measurement/receipt machinery, and the machine-readable
historical-evidence registry introduced beside this document.

At that level this **Wave 1** survey is comprehensive for the architecture decision: the evidence classes and
failure modes needed to govern ingestion and runtime promotion have been followed through the
official programs and through the SettlementForge pipeline. It is not a claim that the empirical
European evidence program, atlas inventory or architectural evidence is complete, and it makes no
global-comparison claim because the owner-ratified map tradition is European-fantasy-centered.

### 1.2 Town-fascicle survey: representative, contrastive and deep—not exhaustive

The European program has produced roughly five hundred town atlases across many national programs;
the RIA's project history describes about 500 towns and cities in 18 countries. This review did **not**
inspect every fascicle, map or town. It inspected a deliberately contrastive set of actual town
materials: monastic-origin towns, planted and walled boroughs, castle/abbey and multi-jurisdictional
towns, river and port towns, market/burgage fabrics, planned controls, ridge towns, hydraulic towns
and settlements represented through different source technologies.

Accordingly:

- the program/method survey may define evidence law;
- an inspected town may prove that a mechanism is possible, provide a counterexample, or serve as a
  validation case;
- the inspected set does **not** establish European prevalence, national frequency, activation
  weights or a representative probability distribution;
- “not observed in this survey” is not “historically absent”; and
- no claim in this document should be paraphrased as “all medieval towns” or “towns in country X
  generally” unless a future preregistered comparative cohort actually supports it.

### 1.3 Inspection-depth vocabulary

The exemplar matrices use the following terms so a program index is not mistaken for a map reading:

| depth | meaning |
|---|---|
| **VISUAL SHEET** | The actual map or interactive layer and its legend were visually inspected. |
| **FULL TEXT** | The complete official essay, chapter, report or topographical account was read, but no claim is made that every associated map sheet was visually audited. |
| **DIGITAL ENTRY / DATASET** | The official digital entry, dataset metadata and relevant explanatory material were inspected; this is not equivalent to a printed-fascicle audit. |
| **OFFICIAL SUMMARY** | An official report or volume page and its published findings were inspected, without claiming a complete read or visual audit of the underlying report/maps. |
| **METHOD DEEP** | The official program's method, atlas structure, source hierarchy or GIS process was inspected. |
| **PROGRAM INVENTORY** | The official program and its scope were recorded, without using an individual town as evidence. |

When a row combines depths, each factual claim remains bounded by the source actually inspected.

### 1.4 Binding next wave

This document establishes the ingestion law and a contrastive European pilot. The larger evidence
program is governed by `map-corpus/docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md`, authored
separately. That protocol must expand beyond this wave to:

- a declared 80–120-town comparative set rather than opportunistic exemplars;
- 30–40 deep evidence packages with source, map, legend, essay/archaeology, transformations,
  uncertainty and rights audited together;
- a genuinely untouched holdout selected and sealed before rule fitting or tuning;
- rural hinterland, field systems, route catchments, extraction/production landscapes and the
  settlement–countryside seam;
- architectural and massing evidence capable of testing height, storeys, roofs, materials,
  composite buildings and vertical change, which town-plan atlases alone cannot calibrate; and
- an explicit `EUROPEAN_FANTASY_BASE` product boundary. Narrative culture options do not select
  map morphology; any future non-European map tradition would require its own owner-authorized
  primary/scholarly evidence program rather than an analogy from this corpus.

Until that protocol's cohorts and receipts exist, the present cases remain Wave 1 possibility,
counterexample and validation witnesses. They cannot satisfy the eventual European breadth,
deep-package, holdout, rural or massing claims.

---

## 2. What the European Historic Towns Atlas method actually does

The International Commission for the History of Towns established the historic-towns-atlas project
in 1955 to make pre-industrial urban topography comparable across Europe. National programs vary,
but the shared discipline is more important than identical graphic design:

1. anchor the work in a declared large-scale survey or cadastral base;
2. show the settlement in regional and local context;
3. distinguish historical source material from editorial reconstruction;
4. pair maps with a topographical essay and/or gazetteer;
5. expose chronological development, important buildings and jurisdictions; and
6. provide legends capable of distinguishing what is extant, known, excavated, inferred,
   hypothetical or otherwise qualified.

The Irish implementation states the classic comparative package particularly clearly: a principal
plan at approximately 1:2,500 representing the town around 1840, a situation map around 1:50,000, a
modern comparison around 1:5,000, facsimile historical maps and a topographical essay. The British
program similarly standardizes its principal map at 1:2,500 but commonly uses a late-nineteenth- or
early-twentieth-century Ordnance Survey base. German, Hungarian, Polish and other programs use the
most suitable first cadastral or survey source for the place and may add georeferenced comparisons,
archaeological plans, chronological reconstructions and interactive overlays.

Those similarities do **not** mean that “the EHTA map” is a single uniform source. The exact base
date, scale, survey quality, redrawing process, legend and represented period remain sheet-local.

### 2.1 The central interpretive warning

A nineteenth-century 1:2,500 base is not a medieval snapshot. It can depict buildings, streets,
plots, water and land use at its survey date. It may preserve older morphology, but persistence into
that base must be argued through archaeology, documentary evidence, historic maps, gazetteer entries
or an explicit scholarly reconstruction. A colored medieval phase polygon is the editor's historical
claim, not a direct survey of every building inside it.

SettlementForge therefore distinguishes at least three artifacts:

1. **Observed fabric at a stated source date**—what the survey or primary plan actually records.
2. **Scholarly reconstructed historical state**—a sourced interpretation with explicit component
   certainty and alternatives.
3. **Generated counterfactual settlement**—new geometry produced from SettlementForge world causes
   under a versioned law.

No rendering mode, import tool or corpus label may silently present one as another.

### 2.2 What atlas diagrams and legends taught us

Across the inspected programs, legends commonly distinguish some combination of:

- ordinary and public/important buildings;
- plot or property boundaries;
- gardens, orchards, woods, open ground and relief;
- rivers, channels, marsh, shoreline and reclamation;
- extant feature, known site, excavated feature and conjectural reconstruction;
- dated phases or first-settled areas; and
- primary-source marks versus editorial supplementation.

The distinction is semantic, not merely stylistic. A dashed wall may mean conjectural alignment on
one sheet and a different source condition on another. A phase tint may mean newly settled area, the
earliest documented occupation, or an interpreted extent; it does not automatically mean that all
surviving buildings in the polygon were built in that phase. The original legend and accompanying
text remain authoritative.

---

## 3. Binding evidence-role and uncertainty law

The machine-readable schema in `map-corpus/historical-evidence/historical-evidence.schema.json` is
the closed grammar for evidence records. This section explains its laws in human terms.

### 3.1 One claim, one source role

Each record has exactly one of the following `source.role` values:

| role | what it can directly support | what it cannot silently become |
|---|---|---|
| `BASE_CADASTRE` | Survey-date footprint, street, parcel, land-use or water geometry at declared scale and coverage | Medieval geometry merely because later lines look old |
| `HISTORIC_PRIMARY_PLAN` | Marks made by a dated historical plan, subject to its survey quality, purpose and legend | A modern metric survey or a complete inventory |
| `HISTORIC_VIEW` | Visible relationships in a dated perspective, panorama or pictorial source | Planimetric footprints, hidden features or uniform symbol scale |
| `ARCHAEOLOGY` | Excavated/observed deposits and the qualified interpretation published for them | Evidence about unexcavated ground or a whole-town plan by default |
| `WRITTEN_GAZETTEER` | A bounded textual assertion, date, function, documentary attestation or source discussion | Measured geometry unless the text supplies it and the record declares it |
| `INTERPRETIVE_RECONSTRUCTION` | A scholar's explicit synthesis of earlier state, phase or alignment | Primary observation or certainty greater than the author's evidence |
| `THEMATIC_ANALYSIS` | A declared analytical relationship such as phases, markets, fortification projects or land-use change | A surveyed footprint merely because it is drawn on a map |

If a base map, archaeology plan and essay corroborate one conclusion, they remain three records joined
by `corroboratingRecordIds`. They are never flattened into one role array or one polygon called
`historicalTruth`.

### 3.2 Four dates that must remain different

- **Source date:** when the primary source was made.
- **Base-map date:** when the survey underneath a redraw or reconstruction was made.
- **Represented period:** the historical interval claimed by the record.
- **Publication/access date:** when the scholarly edition was published and when it was consulted.

For example, a 2004 atlas can use an 1836 survey to reconstruct a thirteenth-century plan. Those are
three different dates and three different epistemic layers.

### 3.3 Scale and legend are conditional, but never implicit

Every record supplies a discriminated `source.scale` and `source.legend` object:

- `DECLARED` with a denominator or legend reference when the source has applicable mapped geometry;
- `NOT_APPLICABLE` with an explicit reason for prose, non-metric analysis or another source for which
  a cartographic scale/legend is genuinely inapplicable.

The schema does not require an invented scale for an essay. It does require the author to say why no
scale or legend applies. Conversely, a map record may not borrow the standard program scale without
checking that sheet.

### 3.4 Certainty is component-specific

Existence, alignment, extent, date, function and material are independent aspects. A wall may be
certain to have existed, likely in alignment, broad in date and unknown in material. One scalar
confidence would destroy that information. The allowed levels are:

- `OBSERVED_EXISTING`
- `CERTAIN`
- `LIKELY`
- `HYPOTHETICAL`
- `UNKNOWN`

The `basis` must identify why that level was assigned. “Looks plausible” is not a basis.

### 3.5 Coverage governs negative evidence

Absence is normally not evidence. A blank can result from:

- land outside the survey purpose;
- archaeological non-intervention;
- damaged or censored source areas;
- pictorial generalization;
- scale too coarse for the feature;
- editorial omission; or
- genuine absence.

`absenceIsEvidence: true` is legal only for `SPATIAL_MASK` coverage with exact mask,
eligible-search-area and containment-proof artifact hashes, a declared source scale, quantified
horizontal error, source purpose, likely omissions and a reason the feature would have been
recorded if present. `TEXTUAL_SCOPE` can never authorize absence. Dortmund's archaeology coverage
and Schwerin's censored blanks are explicit counterexamples to naïve blank-space reading.

### 3.6 Geometry lineage and transformation error survive ingestion

The record distinguishes original, redrawn and georeferenced sources from interpretive or
non-geometric evidence. When a georeference exists, its transform, control-point count, CRS and
published error belong to the record. A modern overlay can improve comparability; it cannot make a
historic survey more precise than it was. Relative parcel topology may be stronger than absolute
position.

### 3.7 A witness is not a frequency

The allowed uses are deliberately narrow:

- `POSSIBILITY_WITNESS`
- `MECHANISM_DESIGN`
- `COUNTEREXAMPLE`
- `VALIDATION_CASE`
- `COHORT_STATISTIC`, only inside a preregistered cohort

The current historical manifest declares no cohort. Therefore it licenses no historical activation
weight, national prior or feature frequency. All registered mechanisms remain `RESEARCH_ONLY` until
separately promoted.

---

## 4. Representative Irish town-fascicle inspection

For all nine towns below, the official town page, explanatory material, standard 1:2,500 town sheet
and legend were inspected. The listed analytical/historical maps were also visually inspected where
specified. The 1:2,500 dates are the survey-state baselines, not claimed medieval dates.

| town and official fascicle | inspected source/date/scale | bounded morphology observation | uncertainty and generator consequence |
|---|---|---|---|
| [Kells](https://www.ria.ie/irish-historic-towns-atlas/kells/), Anngret Simms, 1990 | **VISUAL SHEET + FULL TEXT**; principal plan c.1836, 1:2,500 | Curving streets, parcels and slope preserve evidence used to reconstruct an inherited monastic enclosure; the later borough reused earlier topographical structure. | Internal pre-Norman streets lack archaeological confirmation; parts of enclosure and later wall are inferred. A monastic predicate may permit enclosure reuse, never a perfect radial wheel. |
| [Fethard](https://www.ria.ie/irish-historic-towns-atlas/fethard/), Tadhg O'Keeffe, 2003 | **VISUAL SHEET + FULL TEXT**; principal plan c.1840, 1:2,500 | Funnel-shaped Main Street, market focus, long perpendicular burgage/backland plots and a wall fitted to river, escarpment, existing plots and route approaches. | The pre-1200 enclosure theory is tenuous; plot metrology does not prove uniform original burgages; murage grants do not date every surviving wall segment. The later wall tightly wrapped the burgages and left no continuous back lane—Fethard is **not** evidence for a broad, sparsely occupied walled interior. |
| [Trim](https://www.ria.ie/irish-historic-towns-atlas/trim/), Mark Hennessy, 2004 | **VISUAL SHEET + FULL TEXT**; principal plan c.1836, 1:2,500; Map 10 development | Ford/bridge, castle, southern borough, northern ecclesiastical fabric and abbey zones form what the author explicitly calls a composite of plan units. The southern H-plan and northern inherited/planned mixture retain different grains. | Exact early ford and enclosure positions remain disputed; northern chronology needs archaeology. A second planted borough, Newtown Trim, did not automatically displace the established market. |
| [Dublin, part I to 1610](https://www.ria.ie/irish-historic-towns-atlas/dublin-part-i-to-1610/), H. B. Clarke, 2002 | **VISUAL SHEET + FULL TEXT**; principal plan c.1846–47, 1:2,500; historical Map 4 and growth Map 5 | Ford/route/market at Áth Cliath and ecclesiastical Dubhlinn preceded and conditioned Viking, Hiberno-Norse and Anglo-Norman phases. Archaeology supports durable irregular plot/frontage relationships; river, bridgeheads, quays, reclamation and extra-mural institutions matter. | Early Gaelic topography and longphort locations are partly hypothetical; growth maps are editorial syntheses. Do not model Dublin as one culture founding an empty-site city or as isotropic rings. |
| [Limerick](https://www.ria.ie/irish-historic-towns-atlas/limerick/), Eamon O'Flaherty, 2010 | **VISUAL SHEET + FULL TEXT**; principal plan c.1840, 1:2,500; historical map and Map 27 development | King’s Island/Englishtown, Irishtown and later Newtown Pery are distinct plan systems connected through river branches, bridges, shore works and political phases. | The proposed pre-Norman axis and castle-related street realignment are expressly conjectural; evidence for a rectilinear overlay is incomplete. Hydrology and shoreline must be time-indexed. |
| [Kilkenny](https://www.ria.ie/irish-historic-towns-atlas/kilkenny/), John Bradley, 2000 | **VISUAL SHEET + FULL TEXT**; principal plan c.1842, 1:2,500; Map 6 development | Cathedral/Irishtown, castle/Hightown and St John's across the Nore form separate nuclei and jurisdictions joined by bridges and routes; deep backlands and approach ribbons survive. | It witnesses federated plan units and persistent seams, not a universal three-centre template. |
| [Downpatrick](https://www.ria.ie/irish-historic-towns-atlas/downpatrick/), Buchanan and Wilson, 1997 | **VISUAL SHEET + FULL TEXT**; principal plan c.1833, 1:2,500 | The observed core is Y/fan-shaped around market streets, with long plots, detached cathedral precinct and strong terrain/wetland constraints. | It is a counterexample to “monastic origin visibly equals circular/radial form”; it does not prove that no earlier enclosure ever existed. |
| [Carlingford](https://www.ria.ie/irish-historic-towns-atlas/carlingford/), O'Sullivan and Gillespie, 2011 | **VISUAL SHEET + FULL TEXT**; principal plan c.1835, 1:2,500 | A narrow buildable shelf between slope and Carlingford Lough produces a dominant linear corridor, cross-slope parcels, castle and quay relationships. | Topography may collapse a network into a ribbon. The medieval date of each surviving line still requires separate evidence. |
| [Galway](https://www.ria.ie/irish-historic-towns-atlas/galway/), Jacinta Prunty and Paul Walsh, 2016 | **VISUAL SHEET + FULL TEXT**; principal plan c.1839, 1:2,500; historical Map 5 and Map 28 development | Corrib, bay, islands, marsh/flood ground, docks, reclamation, approach roads and a dense port core jointly organize fabric; later engineering creates buildable land. | Growth tints are interpreted phases, not per-building dates. A single timeless `waterMask` or `buildableMask` is false for this class of town. |

Cross-case Irish result: monastic, planted, castle, ecclesiastical, market, river and port causes do not
map one-to-one to geometric templates. They interact through inherited alignments and phased works.

---

## 5. Representative German program and interactive-module inspection

The Deutscher Historischer Städteatlas method, its official interactive portal and the official
source-comparison/development modules were inspected. The national method explicitly keeps source
map, georeferenced/redrawn basis and scholarly reconstruction distinct. Interactive phase polygons
represent defined phases such as newly or first-settled area; they are not universal building-age
polygons. Historical buildings shown on one analytical map need not all have coexisted.

The module's own legend and source information remain authoritative. No unverified common scale has
been assigned to the seven modules below.

| town/module | inspection | bounded finding | required guardrail |
|---|---|---|---|
| [Braunschweig](https://www.uni-muenster.de/Staedtegeschichte/atlanten/deutscher_historischer_staedteatlas/Braunschweig.shtml), including [source-map comparison](https://www.uni-muenster.de/Staedtegeschichte/Interaktiv/Braunschweig/Grundkartenvergleich_Braunschweig_Split/index.html) and [development phases](https://www.uni-muenster.de/Staedtegeschichte/Interaktiv/Entwicklungsphase_interactiv/index.html) | **VISUAL SHEET / INTERACTIVE + METHOD DEEP** | Several settlement components accreted and merged while hydrology constrained routes and fabric; the comparison makes transformation from source to interpretation visible. | Multi-nuclear accretion is a mechanism conditional on several dated anchors, not an “organic city” noise preset. Keep base and phase reconstruction separate. |
| Magdeburg, via the [official interactive portal](https://www.uni-muenster.de/Staedtegeschichte/portal/staedteatlanten/) | **VISUAL SHEET / INTERACTIVE** | Group-city development, merger, retained seams and episodes of destruction/rebuilding are legible as different historical operations. | A rupture may rewrite only part of the fabric; it does not authorize whole-map reroll. Source map and interpretation remain separate records. |
| Quedlinburg, via the [official interactive portal](https://www.uni-muenster.de/Staedtegeschichte/portal/staedteatlanten/) | **VISUAL SHEET / INTERACTIVE** | Abbey/castle hill, Altstadt, Neustadt, Münzenberg, gardens and extra-mural zones retain institutional and jurisdictional distinctions. | Institutional precincts are first-class components/immunities, not large landmark dots inside a uniform ward field. |
| Mühlhausen, via the [official interactive portal](https://www.uni-muenster.de/Staedtegeschichte/portal/staedteatlanten/) | **VISUAL SHEET / INTERACTIVE** | Several fortification generations, component growth and gate-route suburbs show walls and access changing in sequence. | Do not create one final wall from the current settlement hull. Gates arise from dated routes and circuits; superseded circuits may persist. |
| Dortmund, via the [official interactive portal](https://www.uni-muenster.de/Staedtegeschichte/portal/staedteatlanten/) | **VISUAL SHEET / INTERACTIVE** | The archaeological layer makes coverage limitations explicit. | Archaeological absence outside sampled areas is not negative evidence. Coverage masks belong to the claim. |
| Schwerin, via the [official interactive portal](https://www.uni-muenster.de/Staedtegeschichte/portal/staedteatlanten/) | **VISUAL SHEET / INTERACTIVE** | Inherited core, castle island and planned Schelfstadt illustrate adjacent inherited/planned components. Source blank areas may result from censorship. | Blank primary-source space must carry source-purpose/censorship metadata; it cannot be read as empty urban land. |
| Herrnhut, via the [official interactive portal](https://www.uni-muenster.de/Staedtegeschichte/portal/staedteatlanten/) | **VISUAL SHEET / INTERACTIVE; planned-control case** | A deliberately planned settlement provides a useful control against accretive group-city cases. | A planned intent still needs a separate realization record, but this case prevents the engine from treating irregular multi-nuclear accretion as the only historically credible form. |

Related German program methods were also inspected at program depth: the [Historischer Atlas
westfälischer Städte](https://www.uni-muenster.de/Staedtegeschichte/atlanten/historischer_atlas_westfaelischer_staedte/index.html),
the [Rheinischer Städteatlas map structure](https://rheinische-landeskunde.lvr.de/de/geschichte/geschichte_rheinischer_staedteatlas/atlasstruktur_rheinischer_staedteatlas/aufbau_kartenteil_atlasstruktur/aufbau_kartenteil_rsta_info.html)
and the [Hessischer Städteatlas](https://www.lagis-hessen.de/de/orte/hessischer-staedteatlas).
No uninspected town from those inventories is used here as a morphology witness.

---

## 6. British and adjacent official evidence

| source | inspection and scale | bounded finding | limit |
|---|---|---|---|
| [British Historic Towns Atlas, London](https://www.historictownstrust.uk/towns/london), Volume III, 1989 | **FULL TEXT + MAP INVENTORY/KEY**; Roman and c.1270 maps 1:5,000; c.1520 four-sheet map 1:2,500; wards/parishes c.1520 1:5,000 | The “Central Middle Ages 800–1270” account describes retained Roman enclosure, breaches and river access, several earlier nuclei, markets, wharves, bridgeheads and extra-mural growth. Saturation of inherited enclosure need not produce concentric wall expansion. | Population and early topography include conjecture. The Trust warns that zoom cannot produce detail beyond compilation scale. No visual-detail claim here depends on an unaudited sheet. |
| [British Historic Towns Atlas, York, Volume V](https://www.historictownstrust.uk/atlas/volume-v), edited by Peter Addyman, 2015 | **PROGRAM/VOLUME PAGE**, not a full visual fascicle audit; principal map on c.1850 base at 1:2,500; c.25 development/context maps | The official description itself exposes the source stack: late base, historical sites, phased maps, essays and gazetteer. It is useful for source-limit, extra-mural and frontage hypotheses only through claim-sized records tied to the actual material. | The volume page is not evidence for the exact geometry of every symbolic historic feature. Do not treat site symbols as surveyed medieval footprints. |
| [Historic England, Newport late-medieval topography, Research Report 49/2021](https://historicengland.org.uk/research/results/reports/49-2021) | **OFFICIAL SUMMARY**; the study uses the 1563 terrier, Speed 1611 and town-plan analysis; no single common scale asserted here | The published findings describe an earlier estuary-head trading place and plots constraining a later grid, followed by contraction and long stagnation. This witnesses that occupation can shrink, empty and later reuse inherited structure. | The full report's individual diagrams were not audited in this survey. This is an official research report, not an EHTA fascicle or prevalence sample; use it only through claim-sized records tied to the report. |

The Historic Towns Trust program pages for Volumes I–III and later volumes were inspected as an
official program inventory. Their town lists are not silently counted as inspected fascicles.

---

## 7. Representative continental evidence beyond Germany

### 7.1 Actual town sheets and primary plans visually inspected

| town/source | inspected source/date/scale | bounded finding | uncertainty consequence |
|---|---|---|---|
| Kőszeg, Hungarian Historical Towns Atlas | **VISUAL SHEETS**: [1857 cadastral redraw A-1-1, 1:2,500](https://www.varosatlasz.hu/images/pdf/atlaszok/koszeg/A-1-1_Koszeg.pdf); [late-thirteenth-century reconstruction A-3-1, 1:2,500](https://www.varosatlasz.hu/images/pdf/atlaszok/koszeg/A-3-1_Koszeg.pdf); [early-fifteenth-century reconstruction A-3-2, 1:2,500](https://www.varosatlasz.hu/images/pdf/atlaszok/koszeg/A-3-2_Koszeg.pdf); [mills/inns B-2-1, 1:10,000](https://www.varosatlasz.hu/images/pdf/atlaszok/koszeg/B-2-1_Koszeg.pdf) | Narrow frontage with deep productive rear land, river branches and mills, wetland-constrained expansion, and palisade-to-stone/successive enclosure relationships. | Cadastre, reconstruction and thematic economy map are three roles. The 1857 parcel geometry does not become a medieval footprint without reconstruction support. |
| Stary Sącz, Polish Historical Towns Atlas | **VISUAL SHEETS**: [1847 cadastral/base](https://atlasmiast.umk.pl/pliki/stary_sacz/AHMP_Stary_Sacz_1_1C.pdf) and [development/reconstruction sheets](https://atlasmiast.umk.pl/pliki/stary_sacz/AHMP_Stary_Sacz_3_3.pdf), [3-5](https://atlasmiast.umk.pl/pliki/stary_sacz/AHMP_Stary_Sacz_3_5.pdf), [3-6](https://atlasmiast.umk.pl/pliki/stary_sacz/AHMP_Stary_Sacz_3_6.pdf), 1:2,500; represented phases 1257–80, 1357–58 and c.1400–1770 | An old street-market and later square-market regulation coexist; theoretical modules are drawn separately from realized streets and are deformed by inherited routes, water and monastery rights. | Charter/planning geometry is `PlanIntent`, not observed realization. Partial execution and inherited constraint are positive historical facts, not generator defects. |
| Biecz, Polish Historical Towns Atlas | **VISUAL SHEETS**: [1850 base](https://atlasmiast.umk.pl/pliki/biecz/AHMP_Biecz_1.1.pdf) and [charter-to-mid-fourteenth-century reconstruction](https://atlasmiast.umk.pl/pliki/biecz/AHMP_Biecz_3.3.pdf), 1:2,500 | Ridge alignment, constrained gate-route suburbs and fortification relationships show a topographic ribbon interacting with planned/legal structure. | The legend separates theoretical charter lines, actual demarcation and confirmed versus hypothetical wall. Never rasterize all of these into one confidence-free street graph. |
| [Lviv 1766 primary plan](https://uma.lvivcenter.org/en/maps/34535) | **VISUAL PRIMARY PLAN**; north is down; scale stated as one inch to 100 cubits | Compact fortified core and discontinuous radial suburbs are directly shown by a dated source. | Orientation, historical units, source purpose and symbol generalization must survive. A primary plan is not automatically cadastral or metrically modern. |
| [Halych 1795 manuscript plan](https://uma.lvivcenter.org/uk/maps/34424) | **VISUAL PRIMARY PLAN**; scale 300 Klafter | Castle on a steep triangular headland and lower linear terraces among Dniester/Lukva channels show strong topographic and hydraulic control. | A manuscript plan's depicted relationship can be useful while absolute placement and footprint precision remain uncertain. |

### 7.2 Complete official texts, digital entries and method-level sources

| case | inspection | evidence contribution | limit |
|---|---|---|---|
| [Buda, Part I to 1686, Hungarian Atlas no. 4, topography](https://www.varosatlasz.hu/images/pdf/atlaszok/budaI/03_Helyrajz_Topography_Buda1.pdf), András Végh, 2015 | **FULL TEXT** | Wall alignment adjusted to hilltop surface and preceded systematic plot division in the discussed area; two early weekly market places served later German and Hungarian quarters. | The origins of the two markets are partly unknown. This is a valuable countercase to walls fitted around mature plots, not a rule that walls always precede parcelization. |
| [Agen official synthesis](https://ausonius.u-bordeaux-montaigne.fr/images/pdf/EN3CLICS/Lavaud.pdf) | **FULL TEXT**, using the 1845 cadastre and reconstructed historical phases | Four successive enclosures joined episcopal and canonical components; water was both economic resource and threat. | The cadastre and successive-enclosure reconstruction are distinct evidence roles. |
| [Ribe medieval town-plan entry](https://historiskatlas.dk/Ribes_middelalderlige_byplan_%283020%29) and [official Danish medieval-town plans program](https://byhistorie.dk/en/committee/publications/medieval-towns-plans-in-denmark) | **DIGITAL ENTRY + DETAILED TEXT**, not a complete printed-fascicle audit | The center shifts across the river; a mill dam becomes a street; mills, channels and even bone-paved roads show hydraulic works acting as access and production infrastructure. | The exact location of St Jørgen is unknown. An uncertain institution may constrain alternatives but may not be pinned to invented coordinates. |
| [Luxatlas](https://www.luxatlas.lu/) and [data/method portal](https://data.luxatlas.lu/) | **DATASET/METHOD + FULL CITY-HISTORY TEXT**, not manual tracing of every UI layer | More than 10,000 control points and reverse vectorization from modern building/street scaffolds illustrate a sophisticated but transformed geometry lineage. Historical layers include 1564, 1820s, 1850–52, 1862 and 1867; castle, road-crossing market, gates and successive walls are described. | The 1850/52 layer includes accumulated corrections rather than a clean single-date observation. Georeferencing quality and historical-date purity are different questions. |
| [Dutch RCE dataset 89](https://kennis.cultureelerfgoed.nl/index.php/Dataset/89) and [“A new map of the Netherlands in 1575” method](https://www.cultureelerfgoed.nl/documenten/2016/01/01/een-nieuwe-kaart-van-nederland-in-1575) | **DATASET/METHOD**, not individual Van Deventer town-fascicle inspection | Van Deventer plans c.1550–75, roughly 1:8,000, strongly depict roads while buildings are pictorial/coarse; the GIS is explicitly a synthesis. The project distinguishes 136 places with urban character from 189 places with urban rights. | Legal status is not built-form maturity; pictorial buildings are not footprints. Dataset category counts are not SettlementForge morphology frequencies. |
| [Romanian-principalities spatial-distribution study](https://www.historiaurbium.org/wp-content/uploads/2017/12/Laurentiu-Radvan_Space-distribution_Romanian-principalities_1.pdf), Historia Urbium | **FULL COMPARATIVE TEXT**, citing atlas maps rather than a direct fascicle audit | The study discusses early planned parallel streets/rectangular plots, multi-nuclear growth, later broad multi-street bazaars, organic expansion and monastery land. | It is a comparative scholarly paper, not a primary map layer and not a controlled prevalence cohort. |
| [Cingoli historical atlas](https://eum.unimc.it/it/catalogo/atlante-storico-delle-citt-italiane-marche-cingoli/1022) and [open church/topography excerpt](https://u-pad.unimc.it/retrieve/handle/11393/334990/af0ecadc-dd06-4811-9c66-6f9f30c4c793/Bartolacci_S.-Girolamo_2024.pdf) | **METHOD/PUBLISHER + FULL EXCERPT** | The atlas uses the 1835 Gregorian cadastral base in GIS. The St Lucia case separates a 1244 tradition, first documentation in 1255 and only probable relocation. | Georeferenced cadastral precision does not raise a textual founding or relocation claim above its documentary certainty. |
| [Historical Atlas of Czech Towns](https://www.hiu.cas.cz/en/historical-atlas-of-czech-towns) | **METHOD DEEP** | Confirms the national program's comparative map/text and source-critical architecture. | No Czech town fascicle is used as a witness in this initial registry. |
| [Austrian Historic Towns Atlas](https://www.historiaurbium.org/activities/historic-towns-atlases/atlas-working-group/austrian-historic-towns-atlas/) | **METHOD DEEP** | Confirms a further national implementation of the international method. | No Austrian town is used here as an inspected exemplar. |

The official EHTA inventory was additionally checked for current or historical programs in Finland,
the Netherlands, Sweden, Iceland, Belgium, Switzerland, Romania, Croatia and Ukraine. Program
inventory is not town evidence. The Lviv and Halych rows above are dated primary-map inspections from
the Lviv Center for Urban History portal, not a claim that every Ukrainian EHTA fascicle was audited.

---

## 8. Cross-case mechanism matrix

The table below is a design index, not a frequency table. The identifiers match the research manifest.
All remain `RESEARCH_ONLY`; a listed witness means “historically possible under some conditions,” not
“activate by default.”

| mechanism id | positive witnesses | limiting case or uncertainty | bounded generator implication |
|---|---|---|---|
| `component.multi-nuclear-accretion` | Braunschweig, Magdeburg, Trim, Kilkenny, Dublin | Herrnhut is a planned control; not every town is polycentric | Permit several independently caused nuclei only when dated anchors and access relations exist. |
| `component.merger-persistent-seams` | Braunschweig, Magdeburg, Kilkenny | Later infill can weaken seams | Preserve jurisdictional/grain boundaries as lineage rather than smoothing all merged fabric. |
| `precinct.institutional-immunity` | Quedlinburg, Trim, Kilkenny | Precinct openness and jurisdiction differ by period | Institutions may own precinct geometry, access and exclusions rather than only landmark points. |
| `substrate.hydraulic-spine` | Braunschweig, Kőszeg, Ribe, Limerick, Galway | Watercourses and navigability move over time | Model dated channels, dams, banks and floodplain as causal substrate, not decorative blue paint. |
| `substrate.wetland-reclamation` | Kőszeg, Galway; also port evidence from Dublin/Limerick | Requires dated engineering capacity | Buildable land can be created later; do not reuse a single timeless land mask. |
| `access.crossing-hinge` | Trim, Kilkenny, Ribe | A crossing's exact location can be uncertain or change | A ford/bridge/dam may join components and focus routes only when a world crossing exists. |
| `access.route-gate-suburb` | Mühlhausen, Fethard, Biecz | Extra-mural growth need not occur at every gate | Derive gates from route/circuit intersections and suburbs from dated access plus an anchor or activity. |
| `fortification.dated-circuit-project` | Fethard, Biecz | Walls can exclude active suburbs; grants do not fully date fabric | A wall is a project with purpose, funding, terrain and access prerequisites—not a centroid hull. |
| `fortification.successive-enclosure` | Mühlhausen, Agen, Kőszeg | Some towns retain one inherited circuit | Preserve multiple wall generations, demotion/reuse and changing enclosed extent. |
| `parcel.frontage-backland` | Fethard, Stary Sącz; British atlas/York as a source-limited comparison | Deep rear land does not imply a continuous back lane; later parcels may not be medieval | Generate frontage ownership and parcel depth before buildings; preserve productive/open rear use. |
| `planning.intent-realization-deformation` | Stary Sącz, Herrnhut | Biecz shows legal/theoretical lines need not equal realized demarcation | Keep `PlanIntent` separate from `PlanRealization`; terrain, prior routes, water, rights and partial execution deform the latter. |
| `market.multiple-foci` | Buda, Kilkenny; also component evidence in Trim | Buda's market origins are partly unknown | Mint a second market only from a second function, quarter, authority or dated right—not a layout desire. |
| `rupture.discontinuous-rebuild` | Magdeburg, Mühlhausen; Newport supplies contraction evidence | Not every disaster replans the whole town | Apply dated event footprints selectively; support vacancy, reuse and partial replanning. |
| `shore.port-reclamation` | Galway, with related Dublin/Limerick evidence | Exact shoreline chronology may be broad | Quays, docks and reclamation are dated infrastructure that can change access and buildability. |
| `settlement.inherited-sacred-enclosure` | Kells | Downpatrick defeats a universal visible circle/radial outcome | Reuse an evidenced predecessor enclosure when present; never infer it from origin label alone. |
| `economy.hydraulic-production-chain` | Kőszeg, Ribe | Usable flow and demand are required | Attach mills/production to actual flow geometry and access, with consequences for channels and streets. |
| `substrate.topographic-ribbon` | Carlingford, Biecz, Halych | A narrow corridor may still contain local nodes | Let constrained buildable ground and through-route/shore dominate form instead of forcing radial hierarchy. |
| `evidence.coverage-aware-absence` | Dortmund archaeology, Schwerin censored source | Research-only; not a morphology activation rule | Preserve coverage and omission metadata; never convert blanks into generated emptiness automatically. |
| `cartography.source-interpretation-separation` | German source comparisons, Cingoli GIS, Luxatlas, British atlas source structure | Applies to all evidence handling | Keep source, reconstruction and generated geometry as separate artifacts and digests. |
| `fortification.wall-precedes-parcelization` | Buda | Fethard shows a later circuit fitted around established burgages | Support either temporal ordering under explicit dated causes; never encode one universal wall/parcel sequence. |

### 8.1 The historically common order is not a compiler-stage order

Many cases can be described as:

`substrate and long routes → nuclei/institutions → growth or merger → route/wall/water projects`
`→ frontage and parcels → infill, reclamation, rupture, abandonment and rebuilding`

This is a useful historical dependency language, not a claim that every town follows the sequence and
not a replacement for the S0–S23 executable compiler DAG. Some walls precede plots; others fit mature
fabric. Some extensions are planned; others inherit older routes. Runtime stage order is an engineering
dependency graph. Historical temporal order belongs to dated world state and operations.

---

## 9. Forbidden inferences

The evidence reviewed here explicitly forbids the following shortcuts:

1. **Monastic origin ⇒ circular enclosure and radial streets.** Kells supports one uncertain reuse
   case; Downpatrick is a visible-form counterexample.
2. **Charter or borough status ⇒ a fully occupied planned town.** Legal intent, demarcation and built
   realization are separate.
3. **Planned town ⇒ perfect grid, uniform plots or one construction episode.** Stary Sącz and Biecz
   expose deformation and theoretical-versus-realized lines.
4. **Long later parcels ⇒ unchanged medieval burgages.** Persistence needs corroboration.
5. **One wall reference or murage grant ⇒ exact circuit, exact date or surviving fabric.**
6. **Wall ⇒ military function only.** Defence, toll/custom, jurisdiction, prestige, water management
   and mixed purposes require explicit evidence.
7. **Settlement hull ⇒ wall.** Circuits are dated projects with selective inclusion, exclusion and
   route intersections.
8. **Gate ⇒ evenly spaced portal.** Gates are tied to access and successive circuits.
9. **Phase color ⇒ construction date of every surviving building.**
10. **All historical buildings on one analytical sheet coexisted.**
11. **Road bend ⇒ deliberate defence.** Terrain, property, water and inherited alignments are competing
    causes.
12. **Prominent castle, church or market ⇒ one-center street system.**
13. **Monument or institution ⇒ a point symbol with no precinct, jurisdiction or service access.**
14. **Waterfront ⇒ static shoreline, static channels or permanently buildable land.**
15. **Blank map or excavation area ⇒ historical emptiness.** Coverage and censorship govern absence.
16. **Historic view symbol ⇒ cadastral footprint.** Pictorial scale and hidden geometry remain unknown.
17. **Modern georeference ⇒ historic metric exactness.** Transformation lineage and error remain.
18. **Prosperity ⇒ taller/denser fabric or instant road change.** Prosperity-to-height and prosperity-to-
    morphology laws require separate evidence and dated construction operations.
19. **Medieval ⇒ one timeless style, material, density or roof grammar.** Region, period, function and
    construction phase remain required.
20. **One exemplar ⇒ national/cultural probability.** The initial registry has no prevalence cohort.
21. **Country name ⇒ urban morphology switch.** Mechanisms activate from world predicates, not flags
    such as `irish`, `german` or `medieval-organic`.
22. **Synthetic corpus feature count ⇒ historical incidence.** Internal generated art is not surveyed
    urban history.

---

## 10. Runtime integration contract

### 10.1 Authority order

1. SettlementForge domain state, simulation constitutions, dated events and core operations own
   causal truth.
2. The executable generation manifest and current settlement-map specification own realization
   order, schemas, randomness, invariants and invalidation.
3. Registered historical evidence owns only its bounded claims and permitted uses.
4. The synthetic corpus owns visual-register evidence and hypotheses.
5. Renderers own no world, historical or causal facts.

An atlas observation cannot override dossier/world state. A dossier label cannot turn a conjectural
atlas line into certainty. A renderer cannot invent either.

### 10.2 Evidence never feeds runtime directly

The legal path is:

```text
official source
  → claim-sized HistoricalUrbanEvidenceRecord
  → schema + cross-record integrity validation
  → reviewed HistoricalMechanismDefinition (still research-only)
  → owner-reviewed prerequisite predicates + temporal operation + realization stage
  → executable generation manifest entry with law version and counterexamples
  → canonical spatial artifact + receipt
  → projection and rendering
```

Runtime generation must not import or query evidence records. A citation added on Tuesday must not
silently change every existing or future seed on Wednesday. Promotion requires an explicit law
version and an assigned causal door.

### 10.3 Minimum requirements for promoting a mechanism

A `RESEARCH_ONLY` mechanism may become executable only when it has:

- one or more claim-sized possibility records and any known counterexamples;
- a geographic/temporal scope that is no broader than the evidence;
- SettlementForge prerequisite predicates using real canonical accessors;
- a dated operation describing what changes and what remains inert;
- a declared realization stage in the executable manifest;
- a versioned random namespace if stochastic choice remains;
- a counterfactual expected set `E`, forbidden collateral set `F`, and registered zero-denominator
  behavior;
- deterministic fixtures and validation cases; and
- an activation weight of `NONE` unless a preregistered cohort supplies a statistic.

If a required world fact is unavailable—historic crossing, economic flow, shore engineering,
foundation intent, dated wall project—the mechanism remains dormant or returns a typed refusal. It
must not borrow an unrelated proxy or invent a bearing.

### 10.4 Plan intent and realization

`PlanIntent` is the proposed module, axes, market/reserve and legal grant. `PlanRealization` is the
built street/frontage geometry after terrain, hydrology, predecessor routes, institutions,
immunities, ownership and partial execution deform it. These are useful design artifacts today, but
they are not runtime truth until represented in the executable manifest, typed operations, canonical
artifact schema and receipts.

### 10.5 Frontage, parcels, walls and changing land

The evidence supports these architectural directions, subject to promotion:

- `StreetGraph` continues to own semantic route/access truth.
- The DCEL candidate owns faces, holes, adjacency, frontage and parcel boundaries after its dual-run
  equivalence gates pass; it is topology, not a historical city theory.
- Frontage and parcel subdivision should precede final building placement for applicable fabrics.
- Walls should be generated as dated, typed projects after reading the relevant existing substrate,
  access, jurisdiction and parcel state—not as a centroid-derived ornament.
- Water, wetland, shore and buildability need dated states or operations.
- Growth must admit contraction, vacancy, parcel amalgamation/subdivision, reuse and selective
  rebuilding.
- Current prosperity may change occupation, maintenance, active use and material condition. It may
  not rewrite inherited streets without an explicit alternate-history rebase or later dated
  construction event.

### 10.6 What this atlas evidence does not calibrate

Town atlases are strong evidence for topographical relationships, plan units, source survival and
some building/parcel states. They do not by themselves establish quantitative laws for:

- building height or storey distributions;
- roof pitch, structural system or material by prosperity;
- 2.5D massing, vertical occlusion or receiver shadows;
- lighting intensity, solar exposure, glare, global illumination or media effects;
- population-to-body representation ratios; or
- fantasy species, magic or setting-specific cultural morphology.

Those questions require independent architectural/environmental evidence and the same source-role,
period, region, function, sample and uncertainty discipline. Atlas resemblance alone cannot promote
vertical or lighting values into canonical WORLD state.

---

## 11. The internal synthetic atlas is demoted, not discarded

`map-corpus/docs/laneMFS1-urbanism-atlas.md`, the morphology studies and the HF/MFS instruments remain
valuable, but their authority is narrower than several earlier passages implied.

### 11.1 What the corpus is

- 313 synthetic full plates with matching previews and calibration identifiers;
- AI-generated visual-reference art, including substantial pictorial/oblique content;
- a development set for visual-register study and measurement;
- a source of hypotheses about potentially useful generative mechanisms; and
- a benchmark for ink, paper, wash, line, tone, grain, legibility and composition under declared
  instruments.

### 11.2 What it is not

- surveyed historical evidence;
- a prevalence sample of medieval towns;
- an architectural-height or material dataset;
- evidence that a labelled feature exists or occurs at the depicted frequency;
- a causal account of why its geometry appears; or
- an untouched holdout.

The 53-image legacy pixel-evaluation roster was drawn from material already viewed and measured, and
aggregate prose had already reasoned from parts of it. It can be withheld from a fresh implementation
lane as a same-family pixel-evaluation subset, but it cannot be described as historically independent
or never studied.

### 11.3 Instrument limits that remain binding

- `built_share_frame` is an edge-density proxy; forest stipple, hatching and furrows can score as
  “built.”
- `cells_across` can estimate grain in a well-chosen uniform window but can count hedges, hatches or a
  mixture of districts; it is not universally a building count.
- eye-estimated `[E]` features are analyst readings of synthetic art, not empirical evidence.
- per-plate descriptions have required correction after visual re-audit; a metric-green plate can
  still have a false semantic description.
- apparent historical mechanisms in the corpus remain hypotheses until independently registered.

The permitted division of labor is:

| evidence partition | legitimate question |
|---|---|
| development visual corpus | Does the map achieve the intended visual register and restraint? |
| closed same-family legacy pixel subset | Did a new implementation preserve or improve declared visual metrics without using the images in that lane? |
| registered historical evidence | Is a structural mechanism historically possible, correctly bounded and source-honest? |
| registered counterfactual benchmark | Does a world cause change the expected entities precisely while forbidden collateral stays unchanged? |

No partition substitutes for another.

---

## 12. Rights and reuse boundary

Historical facts and abstract relationships may be researched; cartographic artwork, symbol systems,
pixels, coordinates and traced geometry remain protected unless an explicit compatible licence says
otherwise.

The initial registry therefore defaults to `CITATION_ONLY` or `FACT_METADATA_ONLY` and prohibits:

- `DIRECT_GEOMETRY_COPY`
- `PIXEL_STYLE_COPY`
- `UNIVERSAL_RULE`
- `UNREGISTERED_PREVALENCE_PRIOR`

The [Historic Towns Trust content-use terms](https://www.historictownstrust.uk/using-trust-content)
permit specified educational uses but require permission for commercial adaptation. Other programs
have their own rights statements. An accessible PDF is not an open-geometry licence. RIA, German,
Hungarian, Polish, French, Danish, Dutch, Italian, Ukrainian and other assets remain citation-only
unless the exact source supplies a compatible licence and owner review approves ingestion.

Any future geometry-bearing import must be a separate, auditable decision that records:

- licence and licence URL;
- permitted derivative use;
- source and represented dates;
- scale, legend and coverage;
- original/redrawn/georeferenced lineage;
- CRS, transform, control points and error where applicable; and
- a proof that the generated product is not distributing the source's protected cartographic
  expression.

SettlementForge should learn mechanisms, not trace towns.

---

## 13. Validation and future cohort protocol

The current manifest intentionally has no prevalence cohort. If future work needs activation rates or
comparative claims, it must follow the binding
`map-corpus/docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md` and preregister before counting:

1. research question and mechanism definition;
2. national programs and eligible publication range;
3. inclusion/exclusion rule and treatment of missing online material;
4. unit of analysis—town, phase, component, circuit or parcel frontage;
5. source roles acceptable for each variable;
6. coding rubric, certainty threshold and inter-rater procedure;
7. source-coverage requirements for negative observations;
8. handling of multiple phases and multiple atlas sheets;
9. held-out programs/towns for validation; and
10. statistical output permitted to tune runtime.

Until that exists, calibration should use case-wise structural predicates rather than pseudo-counts:

- component and jurisdiction relationships;
- route–crossing–gate consistency;
- frontage ownership and rear-land continuity;
- wall/project temporal order;
- shoreline/buildability compatibility at the represented period;
- preservation of uncertainty and alternatives;
- event-local rather than global change; and
- provenance from mechanism definition to generated entity and receipt.

Every historical comparison should report source role, period, scale/coverage, certainty components
and rights mode beside the result. A visually pleasing resemblance is never by itself a historical
pass.

---

## 14. Official-source bibliography

Accessed 2026-08-20 unless otherwise stated.

### International method and inventory

- [International Commission for the History of Towns: Historic Towns Atlases](https://www.historiaurbium.org/activities/historic-towns-atlases/)
- [Atlas Working Group and national-program inventory](https://www.historiaurbium.org/activities/historic-towns-atlases/atlas-working-group/)
- [RIA: the European Historic Towns Atlas project](https://www.ria.ie/research-programmes/irish-historic-towns-atlas/european-project/)
- [European towns atlas master list, 2019](https://www.ria.ie/assets/uploads/2024/06/european_towns_master_2019-sg-fc.pdf)
- [European town atlases list, updated April 2019](https://www.ria.ie/assets/uploads/2024/06/european_towns_atlases_updated_april_2019.pdf)
- [Michael Conzen, “Retrieving the pre-industrial built environments of Europe,” 2008](https://www.ria.ie/assets/uploads/2024/06/retrieving-the-pre-industrial-built-environments-of-europe-the-historic-towns-atlas-programme-and-comparative-morphological-study-michael-conzen-2008.pdf)

### Ireland

- [Irish Historic Towns Atlas](https://www.ria.ie/research-programmes/irish-historic-towns-atlas/)
- [Digital atlases and GIS](https://www.ria.ie/research-programmes/irish-historic-towns-atlas/digital-atlases-gis/)
- [Expert essays](https://www.ria.ie/research-programmes/irish-historic-towns-atlas/expert-essays/)
- [*Reading the Maps: A Guide to the Irish Historic Towns Atlas*](https://shop.ria.ie/products/reading-the-maps-a-guide-to-the-irish-historic-towns-atlas)
- [*Maps & Texts: Exploring the Irish Historic Towns Atlas*](https://shop.ria.ie/en-us/products/maps-texts-exploring-the-irish-historic-towns-atlas)
- [*Dublin c.840–c.1540: The Medieval Town in the Modern City*](https://shop.ria.ie/products/dublin-c-840-c-1540-the-medieval-town-in-the-modern-city)
- [Kells](https://www.ria.ie/irish-historic-towns-atlas/kells/)
- [Fethard](https://www.ria.ie/irish-historic-towns-atlas/fethard/)
- [Trim](https://www.ria.ie/irish-historic-towns-atlas/trim/)
- [Dublin, part I to 1610](https://www.ria.ie/irish-historic-towns-atlas/dublin-part-i-to-1610/)
- [Limerick](https://www.ria.ie/irish-historic-towns-atlas/limerick/)
- [Kilkenny](https://www.ria.ie/irish-historic-towns-atlas/kilkenny/)
- [Downpatrick](https://www.ria.ie/irish-historic-towns-atlas/downpatrick/)
- [Carlingford](https://www.ria.ie/irish-historic-towns-atlas/carlingford/)
- [Galway](https://www.ria.ie/irish-historic-towns-atlas/galway/)

### Germany

- [German historic-town-atlas hub](https://www.uni-muenster.de/Staedtegeschichte/atlanten/index.shtml)
- [“Was ist ein Städteatlas?” official method PDF](https://www.uni-muenster.de/imperia/md/content/staedtegeschichte/forschung/deutscher_historischer_staedteatlas/was_ist_ein_staedteatlas.pdf)
- [Deutscher Historischer Städteatlas](https://www.uni-muenster.de/Staedtegeschichte/atlanten/deutscher_historischer_staedteatlas/index.shtml)
- [Interactive atlas portal](https://www.uni-muenster.de/Staedtegeschichte/portal/staedteatlanten/)
- [Braunschweig atlas page](https://www.uni-muenster.de/Staedtegeschichte/atlanten/deutscher_historischer_staedteatlas/Braunschweig.shtml)
- [Braunschweig source-map comparison](https://www.uni-muenster.de/Staedtegeschichte/Interaktiv/Braunschweig/Grundkartenvergleich_Braunschweig_Split/index.html)
- [Braunschweig development-phase module](https://www.uni-muenster.de/Staedtegeschichte/Interaktiv/Entwicklungsphase_interactiv/index.html)
- [Historischer Atlas westfälischer Städte](https://www.uni-muenster.de/Staedtegeschichte/atlanten/historischer_atlas_westfaelischer_staedte/index.html)
- [Rheinischer Städteatlas map structure](https://rheinische-landeskunde.lvr.de/de/geschichte/geschichte_rheinischer_staedteatlas/atlasstruktur_rheinischer_staedteatlas/aufbau_kartenteil_atlasstruktur/aufbau_kartenteil_rsta_info.html)
- [Hessischer Städteatlas](https://www.lagis-hessen.de/de/orte/hessischer-staedteatlas)

### Britain

- [Historic Towns Trust atlas program](https://www.historictownstrust.uk/atlas)
- [About the British Historic Towns Atlas and map structure](https://www.historictownstrust.uk/atlas-about/about-the-atlas)
- [Town and article index](https://www.historictownstrust.uk/towns)
- [London](https://www.historictownstrust.uk/towns/london)
- [London c.1270 west sheet](https://2408442e-11d5-4e12-b5c9-2f7adde2bbd9.usrfiles.com/ugd/240844_f2a18f9282d84f75ae30e1e1eb9593f7.pdf)
- [London c.1270 east sheet](https://2408442e-11d5-4e12-b5c9-2f7adde2bbd9.usrfiles.com/ugd/240844_c4f5f89632e04638a961492192a9a582.pdf)
- [London map key](https://2408442e-11d5-4e12-b5c9-2f7adde2bbd9.usrfiles.com/ugd/240844_8b8156e1a0a0449aa2fdd3c82c99ee1e.pdf)
- [London, “Central Middle Ages 800–1270” chapter](https://2408442e-11d5-4e12-b5c9-2f7adde2bbd9.usrfiles.com/ugd/240844_22400460849149dd815de00a0df21824.pdf)
- [York, Volume V](https://www.historictownstrust.uk/atlas/volume-v)
- [Historic Towns Trust content-use terms](https://www.historictownstrust.uk/using-trust-content)
- [Historic England Research Report 49/2021: Newport](https://historicengland.org.uk/research/results/reports/49-2021)

### Continental programs, maps, texts and datasets

- [Hungarian Historical Towns Atlas catalogue](https://www.varosatlasz.hu/en/atlases)
- [Kőszeg A-1-1, 1857 cadastral redraw](https://www.varosatlasz.hu/images/pdf/atlaszok/koszeg/A-1-1_Koszeg.pdf)
- [Kőszeg A-3-1 reconstruction](https://www.varosatlasz.hu/images/pdf/atlaszok/koszeg/A-3-1_Koszeg.pdf)
- [Kőszeg A-3-2 reconstruction](https://www.varosatlasz.hu/images/pdf/atlaszok/koszeg/A-3-2_Koszeg.pdf)
- [Kőszeg B-2-1 mills and inns](https://www.varosatlasz.hu/images/pdf/atlaszok/koszeg/B-2-1_Koszeg.pdf)
- [Buda I, topography](https://www.varosatlasz.hu/images/pdf/atlaszok/budaI/03_Helyrajz_Topography_Buda1.pdf)
- [Polish Historical Towns Atlas](https://atlasmiast.umk.pl/)
- [Stary Sącz 1847 base](https://atlasmiast.umk.pl/pliki/stary_sacz/AHMP_Stary_Sacz_1_1C.pdf)
- [Stary Sącz development 3-3](https://atlasmiast.umk.pl/pliki/stary_sacz/AHMP_Stary_Sacz_3_3.pdf)
- [Stary Sącz development 3-5](https://atlasmiast.umk.pl/pliki/stary_sacz/AHMP_Stary_Sacz_3_5.pdf)
- [Stary Sącz development 3-6](https://atlasmiast.umk.pl/pliki/stary_sacz/AHMP_Stary_Sacz_3_6.pdf)
- [Biecz 1850 base](https://atlasmiast.umk.pl/pliki/biecz/AHMP_Biecz_1.1.pdf)
- [Biecz historical reconstruction](https://atlasmiast.umk.pl/pliki/biecz/AHMP_Biecz_3.3.pdf)
- [Atlas historique des villes de France program](https://www.historiaurbium.org/activities/historic-towns-atlases/atlas-working-group/atlas-historique-des-villes-de-france/)
- [Agen official synthesis](https://ausonius.u-bordeaux-montaigne.fr/images/pdf/EN3CLICS/Lavaud.pdf)
- [Luxatlas](https://www.luxatlas.lu/)
- [Luxatlas data and method portal](https://data.luxatlas.lu/)
- [Ribe medieval town-plan entry](https://historiskatlas.dk/Ribes_middelalderlige_byplan_%283020%29)
- [Danish medieval-town plans program](https://byhistorie.dk/en/committee/publications/medieval-towns-plans-in-denmark)
- [Dutch RCE historical-map dataset 89](https://kennis.cultureelerfgoed.nl/index.php/Dataset/89)
- [Dutch RCE method: a new map of the Netherlands in 1575](https://www.cultureelerfgoed.nl/documenten/2016/01/01/een-nieuwe-kaart-van-nederland-in-1575)
- [Romanian-principalities spatial-distribution study](https://www.historiaurbium.org/wp-content/uploads/2017/12/Laurentiu-Radvan_Space-distribution_Romanian-principalities_1.pdf)
- [Lviv 1766 primary plan](https://uma.lvivcenter.org/en/maps/34535)
- [Lviv interactive-atlas method paper](https://icaci.org/files/documents/ICC_proceedings/ICC2015/papers/19/157.html)
- [Halych 1795 manuscript plan](https://uma.lvivcenter.org/uk/maps/34424)
- [Ukrainian Historic Towns Atlas program](https://www.historiaurbium.org/activities/historic-towns-atlases/atlas-working-group/ukrainian-historic-towns-atlas/)
- [Historical Atlas of Czech Towns](https://www.hiu.cas.cz/en/historical-atlas-of-czech-towns)
- [Cingoli historical atlas](https://eum.unimc.it/it/catalogo/atlante-storico-delle-citt-italiane-marche-cingoli/1022)
- [Cingoli church/topography excerpt](https://u-pad.unimc.it/retrieve/handle/11393/334990/af0ecadc-dd06-4811-9c66-6f9f30c4c793/Bartolacci_S.-Girolamo_2024.pdf)
- [Austrian Historic Towns Atlas](https://www.historiaurbium.org/activities/historic-towns-atlases/atlas-working-group/austrian-historic-towns-atlas/)

---

## 15. Wave 1 architectural ruling

The atlas research does not require SettlementForge to become a reconstruction tool or to copy real
towns. It requires the generator to become more honest about causation and inherited form.

The strongest coherent architecture is therefore:

- one dated causal world;
- one canonical spatial artifact;
- several possible historical mechanisms with explicit prerequisites and counterexamples;
- typed temporal operations and receipts;
- persistent lineage through accretion, merger, wall projects, reclamation, rupture and reuse;
- strict separation of observation, reconstruction, generation and projection;
- no runtime read of research records;
- no country-style oracle;
- no prevalence without a preregistered cohort; and
- no renderer-authored facts.

That architecture can produce settlements that feel historically conditioned without pretending
that a fantasy settlement is an empirical reconstruction. It also keeps the larger SettlementForge
promise intact: the map is not a decorative afterthought, but one legible observation of the same
living settlement state that the dossier, campaign history and future world operations share.

This is the close of the Wave 1 survey, not the close of historical evidence work. Runtime promotion
and any product-level claim of historical breadth remain blocked on the separately governed
80–120-town expansion, 30–40 deep packages, sealed holdout, European rural/landscape evidence and
European architectural-massing evidence. Non-European map morphology is outside the present
owner-ratified product scope, not an unfinished gate hidden inside this wave.
