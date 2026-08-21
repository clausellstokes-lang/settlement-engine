# Historical Evidence Expansion Protocol

**Protocol id:** `HEEP-1`  
**Protocol version:** `1.1.0`  
**Supersedes:** `1.0.0` (`ad2c1e027f0b3941d42c7959650ed1bf3c1e4916118ddb7234be85e32ec19c67`)  
**Status:** preregistered expansion law; `UCF-1.1.0` metadata frame validated; slate/reserves not frozen because hard metadata quotas are infeasible; observations not begun  
**Urban frame:** `UCF-1.1.0`  
**Authority:** `GENERATION-SPEC.md` §§10.0, 10.14, 10.17–10.23 and
`HISTORICAL-URBANISM-EVIDENCE.md`  
**Current survey:** metadata-only candidate frame validation complete with published shortfall; slate/holdout/cohorts/source audits unbuilt

This protocol governs the next historical-evidence wave for SettlementForge. It freezes the
questions, selection rules, exclusions, audit depths, holdout treatment, stopping rules and allowed
claims before the comparative sample is opened and coded. `MUST`, `MUST NOT`, `SHOULD` and `MAY`
are normative.

The protocol does not promote a historical mechanism, authorize source-geometry reuse, or make an
atlas record a runtime cause. Runtime continues to read reviewed, manifest-owned mechanism laws;
it never reads evidence records directly.

This document freezes rules. The `UCF-1.1.0` public selection tooling, metadata rubrics and aggregate
shortfall receipt are built, and the content-hashed candidate manifest remains in private custody.
After removing unsupported program-level scale inference and country-level `OTHER_INLAND` inference,
the metadata-only pool fails the hard scale and physical-context minima at every legal prefix. No
ordered slate or actionable reserve queue is frozen. Candidate identities remain quarantined; no
candidate source has been opened or coded. The holdout identity mapping, holdout seal/access
receipts, child cohort manifests, expansion records and audit outputs are **unbuilt**. No `HEEP-1`
holdout currently exists or is sealed. Those later claims become true only when their corresponding
hashed deliverables pass the gates in §11.

### Amendment record: `1.0.0` → `1.1.0`

**Rationale:** pre-source-opening audit found three ambiguities that could otherwise permit leakage
or cross-domain evidence reuse. No candidate content, mechanism outcome or holdout was opened; the
sample sizes, balance quotas, stopping rules, claim boundary and current strict metadata shortfall
are unchanged.

**Normative diff:** (1) aliases, shared packages, equivalent editions and derivatives now close into
one connected leakage cluster, and UCF-1.1 selects only singleton clusters until a separately frozen
cluster-aware law exists; (2) `KNOWN` scale/function and affirmative physical-context strata now
require exact item-level joins through pinned closed authority registries/rubrics, with unsupported
or ambiguous values remaining unknown/unassigned; and (3) UCF, AMP and RSLP must use their own
domain evidence-record contracts—`HistoricalUrbanEvidenceRecord` is not a generic container for
architectural-massing or rural-landscape claims. Sections 3.1–3.2, 4.1, 8 and 10 contain the
operative text.

---

## 1. The preregistered claim boundary

Wave 1 established an evidence-role contract and a contrastive set of possibility witnesses. It did
not establish a representative town sample, a complete atlas inventory, architectural calibration,
or an untouched evaluation set. Global coverage is outside the owner-ratified European-fantasy map
scope, not a hidden completion claim. Those limitations remain visible in every report.

`HEEP-1` may answer four bounded questions:

1. Across a deliberately balanced European comparative frame, which proposed mechanism classes
   remain possible, require narrower prerequisites, acquire counterexamples, or fail their declared
   evidence test?
2. For a mechanism-specific eligible cohort, what topological or dimensionless structural ranges
   remain stable as fixed batches are added?
3. Does a frozen mechanism rubric and any separately promoted implementation survive a genuinely
   unseen holdout without scope expansion or silent exceptions?
4. Which questions cannot be answered by town-plan atlases and therefore belong in the separate
   European rural/landscape or architectural-massing programs?

This balanced design is **not a probability sample of historical towns**. It MUST NOT be used for:

- European, national, regional or period prevalence claims;
- statements of the form “X percent of medieval towns”;
- country-name style priors or cultural activation weights;
- a universal chronological or morphological grammar;
- population, building-height, material, lighting or body-count calibration; or
- `HistoricalMechanismDefinition.activationWeightSource`.

All `UCF-1` cohort registrations therefore set `eligibleForPrevalence: false`. Selected, eligible,
unknown and excluded counts may be reported as audit-flow accounting, but occurrence proportions
MUST NOT be reported or used as frequency estimates. A later prevalence study would require a new
protocol with a defined target population, probability selection, non-response treatment and
weights; it cannot be created by relabelling this frame.

---

## 2. Frozen program constants

| item | preregistered rule |
|---|---|
| comparative unit | one stable town identity; phases and components remain nested observations |
| candidate universe | official or institutionally published European historic-town packages listed before `FRAME_FREEZE` |
| final urban frame | minimum 80, nominal target 100, hard maximum 120 towns |
| extension schedule | deterministic prefixes of 80, 90, 100, 110 and 120 towns |
| deep audits | minimum 30, planned 35, hard maximum 40 complete packages |
| deep-audit schedule | 30, then fixed batches of 5 to 35 and 40 when gates remain open |
| sealed holdout | `H(N) = floor(0.18 * N + 0.5)` towns, always between 15% and 20% of final `N` |
| Wave 1 exposure | flagged `PRIOR_SEEN`; never holdout; never automatically selected |
| urban batch | the next ten towns in the frozen balanced order; sealed towns remain unopened |
| stopping floor | no urban stop before 80 towns and no deep-audit stop before 30 packages |
| stopping ceiling | no opportunistic extension beyond 120 towns or 40 deep packages |

At the permitted frame sizes, the holdout counts are 14/80, 16/90, 18/100, 20/110 and 22/120.
Holdout towns count toward `N` but never toward development estimates or development deep-audit
quotas while sealed.

The following identifiers are immutable within a completed analysis:

```text
protocolVersion
frameVersion
selectionRuleVersion
instrumentVersion
cohortRuleVersion
rightsPolicyVersion
holdoutSealVersion
```

Every manifest and report MUST name all applicable versions and content hashes. A rule change after
any outcome-bearing material is opened forks a new version; old and new results MUST NOT be silently
pooled.

---

## 3. Candidate frame and selection

### 3.1 Metadata-only frame construction

Before `FRAME_FREEZE`, a frame steward may inspect catalogues, bibliographies and rights/access
metadata, but MUST NOT code mechanism outcomes. Each candidate receives a durable `stableTownId`
that deduplicates alternate language names, editions, atlas programs and digital/print versions.
Multiple publications about one town do not create multiple sampling units.

The allocation unit is the highest connected leakage cluster over stable-town aliases, shared
claim-bearing packages, equivalent editions and derivative summaries. No selection, reserve,
development or holdout partition may cut across a cluster. UCF-1.1's current town-count quota
algorithm is defined only for singleton clusters, so every non-singleton cluster is excluded from
selection eligibility (while remaining counted in the frame) until a separately versioned
cluster-aware apportionment law is frozen before content access.

A candidate is frame-eligible when all of the following can be declared from metadata:

- stable town identity and polity/region;
- official program or institutional publisher and publication identifier;
- represented period or a declared `UNKNOWN` period status;
- existence of at least one potentially claim-bearing map, text, archaeology record or analytical
  layer;
- a locatable rights statement or `RIGHTS_UNRESOLVED` status; and
- a feasible acquisition route through public access, a library, archive or authorized request.

Online convenience is not an inclusion rule. Print-only, paywalled, non-English and temporarily
offline records stay in the candidate frame while acquisition is attempted. A candidate can be
excluded only with a logged reason code and evidence of the required attempt. Rights unresolved at
frame construction does not authorize use; it triggers the rights gate before content is stored or
measured.

The frame manifest MUST record whether a town or any materially equivalent package was inspected in
Wave 1. `PRIOR_SEEN` towns may enter the development set only through the same frozen selection
algorithm and may comprise no more than 20% of the opened development set. They are ineligible for
the holdout.

### 3.2 Balance strata and quotas

Strata are sampling controls, not claims about how historical towns are distributed. Their labels,
country membership and coding rubric MUST be frozen in `frameVersion` before selection. No stratum
may be assigned from a mechanism outcome observed during the audit.

| axis | frozen balance rule |
|---|---|
| macro-region | five declared European sampling bands, target 20% each; every band 15–25% of every legal final prefix |
| country | no country exceeds `ceil(0.12 * N)` towns |
| publication program | no atlas/publication program exceeds `ceil(0.15 * N)` towns |
| index phase | five known, mutually exclusive period bands divide known units as evenly as possible; each remains 10–30% of final `N`, and `UNKNOWN` is at most 10% |
| settlement scale/function | small/local, intermediate/regional and major/metropolitan bands each contribute at least 20%; `KNOWN` requires an exact item-level authoritative P31 class resolved through the pinned versioned class-to-band allowlist; program-level synthesis, free-text basis and guessed classes are forbidden; unresolved/ambiguous items are `UNKNOWN`, at most 10% |
| physical context | coastal/estuarine, river/crossing, wetland/engineered water, upland/constrained and other inland contexts each have at least 10% coverage; each affirmative tag requires exact item-level authority joined through the pinned closed context rubric/source registry; tags may overlap, but country/landlocked/program inference and free text are forbidden; unresolved items remain untagged |

The five macro-region codes are `ATLANTIC_ARCHIPELAGO`, `NORDIC_BALTIC`,
`WESTERN_CONTINENTAL`, `CENTRAL_EASTERN_SOUTHEASTERN`, and `SOUTHERN_MEDITERRANEAN`. They are
working sampling labels, not historical culture types. Their exact country/polity membership is
published in the frame manifest and ambiguity is resolved before the selection seed is derived.

The five known index-phase bands are `PRE_1200`, `1200_1399`, `1400_1599`, `1600_1799`, and
`1800_PLUS`. `indexPhase` is the band containing the midpoint of the official catalogue's primary
represented interval; a boundary year uses the later band, and no identifiable primary interval is
`UNKNOWN`. This is a reproducible balance anchor, not a claim that a town has only one period.

If the frozen candidate pool cannot satisfy a hard quota, the team MUST publish the shortfall and
either amend the frame before any source opening or mark the affected gate failed. It may not relax
a quota after seeing results. Deliberate over-sampling for contrast improves mechanism testing but
never licenses an unweighted frequency statement.

### 3.3 Deterministic balanced order

The selection artifact contains the complete candidate roster and its SHA-256 hash. The selection
seed is derived as:

```text
SHA256("SettlementForge|HEEP-1|UCF-1|" + frameManifestSha256)
```

Within each frozen stratum, candidate tie order is
`SHA256(selectionSeed + "|" + stableTownId)`. A versioned selection script solves the complete
finite nested-prefix assignment: it enumerates candidate subsets in deterministic tie-hash order,
uses only sound necessary-bound pruning, has no heuristic node/time cutoff, and accepts the first
lexicographically ordered slate that satisfies every hard constraint at 80/90/100/110/120. If no
slate exists, it emits either a directly checkable violated pool bound or a deterministic complete-
enumeration certificate whose transcript is reproducible from the hashed inputs. A greedy or
search-limited failure is not an infeasibility claim.

For every selected slot, the script also pre-seals a tie-hash-ordered queue restricted to the exact
same macro-region, index-phase and scale/function stratum. Each queued swap must preserve every
quota, country/program/prior-exposure cap and leakage rule at every affected legal prefix against
the frozen slate. At execution time, prior substitutions are part of the state: the queue is scanned
in its sealed order, opened/used entries are skipped, the full current vector is revalidated, and the
replacement fails closed if no entry remains legal. A macro-only or exact-stratum-only fallback is
never actionable.

The full roster, slate and reserve identities are content-hashed and lodged with the frame steward
and holdout custodian at `FRAME_FREEZE`; they are not published to the research/implementation team.
The working repository receives the versioned script, input/output hashes, quota report and only the
development identities released for the active prefix. This preserves reproducibility without
revealing the holdout by subtraction.

Only the prefixes 80, 90, 100, 110 and 120 are legal final urban samples. Analysts may not choose
the next batch after seeing its towns or the preceding results. Candidate identity, fame, attractive
geometry, apparent mechanism presence and ease of download are forbidden ranking inputs.

### 3.4 Anti-convenience substitution and attrition

A selected town may be replaced only for one of these predeclared reasons:

```text
DUPLICATE_IDENTITY
NOT_A_SETTLEMENT_UNIT
SOURCE_UNOBTAINABLE_AFTER_TWO_DOCUMENTED_CHANNELS
RIGHTS_PROHIBIT_EVEN_FACTUAL_AUDIT
PACKAGE_CORRUPT_OR_UNREADABLE
MINIMUM_PERIOD_METADATA_FALSE
HOLDOUT_CONTAMINATED_BEFORE_OPENING
```

Replacement scans the affected slot's already sealed exact-primary-stratum queue and uses the first
unopened, unused entry that passes deterministic full-vector revalidation at every affected legal
prefix. If none passes, substitution fails closed. The event is recorded in an append-only selection
log. “Uninteresting,” “mechanism absent,” “hard to code,” “poor fit,” “wrong result,” language
inconvenience, or a desire to improve balance after outcome inspection are never legal substitution
reasons. Missing material becomes a coverage fact unless the candidate fails a predeclared minimum.

---

## 4. Genuine sealed holdout

The holdout tests a frozen research and implementation law; it is not a second source of design
ideas.

### 4.1 Selection and allocation

The custodian creates one nested holdout schedule for the full frozen slate: the first 80 positions
contain exactly 14 holdouts and each later ten-town extension contains exactly 2, yielding
16/90, 18/100, 20/110 and 22/120 without ever changing an earlier assignment. Allocation uses
largest-remainder apportionment across the primary macro-region strata, then minimizes index-phase
and scale imbalance using the frozen holdout hash
`SHA256(selectionSeed + "|HOLDOUT|" + stableTownId)`. Every legal prefix is validated. Wave 1
towns, towns viewed during frame construction beyond metadata, and materially equivalent editions
of viewed packages are excluded. Allocation runs only on the singleton leakage-cluster pool under
UCF-1.1; no connected shared-package/equivalent-edition cluster can cross development, holdout,
reserve or replacement.

The holdout assignment is made before development sources are opened. It cannot be redrawn because
the development results are disappointing.

### 4.2 Quarantine

Three roles remain separate:

1. the **frame steward** assembles metadata but does not code mechanisms;
2. the **holdout custodian** runs and seals the assignment but does not implement or tune laws; and
3. the **research/implementation team** sees only development identities and aggregate holdout
   stratum counts until unsealing.

The working repository receives only opaque holdout IDs, stratum counts, selection hashes and a
seal receipt. It receives no holdout town names, source URLs, thumbnails, excerpts, measurements,
OCR, geometry or search notes. Source assets and the identity mapping live in access-controlled
storage with an append-only access log. Search indexes, shared citation managers, model context,
issue trackers and generated caches are part of the quarantine boundary.

Any accidental view is recorded immediately as contamination. The town is removed from evaluation,
never described as blind, and replaced only by the next **already sealed** same-stratum reserve. If
no presealed reserve exists, the holdout-integrity gate fails; a post-result replacement is not a
valid repair.

### 4.3 One-way unsealing

The holdout may be opened only after all of the following are signed and content-hashed:

- development records and deep audits;
- cohort rules, coding instrument and uncertainty thresholds;
- mechanism scopes, prerequisites and counterexample expectations;
- any executable law version, fixtures and allowed tuning parameters;
- range/stopping decisions; and
- the holdout evaluation plan and pass/fail thresholds.

The frozen pipeline is run once. Holdout evaluation results are reported separately from
development results and are never folded back into the development estimates. A change made after
unsealing begins a new development law version; the opened towns cannot validate that revision. A
new confirmation claim requires a new untouched holdout.

The European rural/landscape and architectural-massing child programs maintain their own 18% sealed
holdout. A holdout from one program cannot compensate for no holdout in another.

---

## 5. Batch order and stopping rules

### 5.1 Urban batches

The frozen slate is activated in ten-town prefixes; the custodian releases only the development
identities in each prefix, while holdouts remain sealed. Interim cumulative snapshots at 60, 70 and
80 may be used to test the two-batch rules, but no final stop is legal before 80. At each legal final
prefix, only non-holdout towns contribute to development analysis.

If every gate below passes at 80, the urban frame may stop. Otherwise the next frozen ten-town batch
is added. The same decision is repeated at 90, 100 and 110. At 120 the sample closes regardless of
result; an unmet criterion is reported as `OPEN_AT_CAP`, never disguised by opportunistic additions.

### 5.2 Mechanism saturation

Saturation is assessed separately for every registered mechanism cohort and every macro-region
stratum declared mandatory by that cohort's geographic scope. A batch pair is saturated only when
both successive additions produce:

- zero new mechanism class;
- zero new prerequisite class;
- zero new counterexample class that narrows or falsifies the current scope;
- zero new source-role or coverage failure requiring an instrument change; and
- no material change to the written geographic, temporal or causal boundary.

Synonyms and an additional witness of an already coded relation are not new classes. An adjudicator
records that determination before the next batch is opened. Pooled quietness cannot hide an
unsaturated region or a mechanism cohort with inadequate eligible material.

### 5.3 Range stability

Only preregistered, source-supported topological or dimensionless metrics may be tested. A metric is
range-eligible after at least 30 independent eligible towns contribute, every mandatory reporting
stratum contributes at least 5, measurement uncertainty is recorded, and repeated parcels or
components are clustered under their town rather than treated as independent towns.

For cumulative batch `t`, record `Q10`, `Q50`, `Q90` and `IQR`. Let:

```text
S(t-1) = max(IQR(t-1), declaredMeasurementResolution, preregisteredEpsilon)
```

The metric is stable for one comparison only when:

```text
abs(Q50(t) - Q50(t-1)) / S(t-1) <= 0.10
abs(Q10(t) - Q10(t-1)) / S(t-1) <= 0.20
abs(Q90(t) - Q90(t-1)) / S(t-1) <= 0.20
abs(IQR(t) - IQR(t-1)) / S(t-1) <= 0.15
```

and no mandatory stratum's median shifts by more than `0.20 * S(t-1)`. Passing requires two
successive batch comparisons. Metric definitions, normalization, resolution and epsilon are frozen
before the first measurement. Failed or underpowered metrics remain `UNCALIBRATED`; thresholds are
not widened after inspection.

These are engineering range-stability tests within a deliberately balanced frame. They are not
confidence intervals for a historical population and do not authorize activation rates.

### 5.4 Deep-audit stopping

The first 30 complete development packages are coded as six frozen five-package batches. If the
package-audit coverage, mechanism saturation and all registered deep-audit range tests pass at the
last two successive checkpoints, the deep audit may close at 30. Otherwise five more are opened and
the decision is repeated at 35, then at the hard cap of 40. A question still unstable at 40 is
`OPEN_AT_CAP`; no easy extra package may be appended.

The urban and deep-audit stops are conjunctive. The overall expansion cannot close while either its
80-town minimum, its 30-package minimum, a required stratum, rights/coverage gate, holdout gate, or
registered stopping test remains unmet.

---

## 6. Complete-package deep audits

The 30–40 deep audits are nested inside the non-holdout urban development set. Eligibility is
determined from a metadata inventory before detailed review, then selection follows a frozen
balanced hash order. A famous or unusually attractive atlas cannot be hand-added.

A package is complete for deep audit only when it contains, or explicitly records the justified
absence/not-applicability of, all of the following:

- official bibliographic identity, publisher, dates and stable source location;
- a claim-bearing base/source map and its single source role;
- declared scale and legend for cartographic/depicted geometry, or explicit discriminated
  `NOT_APPLICABLE` reasons for genuinely non-cartographic evidence;
- explanatory essay, gazetteer or equivalent interpretive text;
- archaeology or other independent evidence when the package makes archaeological claims, with
  intervention/coverage limits;
- source date, base-map date and represented historical interval kept distinct;
- original/redrawn/georeferenced/interpretive lineage and any published CRS, transform, control
  points and error;
- component-specific certainty for existence, alignment, extent, date, function and material;
- observed area, omissions, source purpose and negative-evidence justification;
- an exact rights mode, licence/terms URL, access date and permitted/prohibited uses; and
- a cross-source agreement/conflict audit rather than a flattened “historical truth” layer.

One town contributes at most one deep-package unit even when it has several volumes or sheets. Each
claim remains a separate `HistoricalUrbanEvidenceRecord`; package completeness never permits source
roles to be merged.

---

## 7. Mechanism-specific eligibility cohorts

There is no all-purpose denominator. Before coding a mechanism, its cohort manifest MUST freeze:

- `cohortId`, `cohortRuleVersion` and exact `mechanismId`;
- unit of analysis: town, phase, component, circuit, route segment, shoreline phase or frontage;
- temporal and geographic scope;
- prerequisite facts that define eligibility without using the outcome itself;
- acceptable source roles and minimum certainty per claimed aspect;
- required scale, legend, coverage and source purpose;
- treatment of multiple phases, multiple sheets and nested units;
- positive, negative, indeterminate and conflict coding rules;
- inter-rater procedure and adjudication threshold;
- registered metrics and allowed engineering use; and
- forbidden inferences, always including population prevalence for `UCF-1`.

Each observation records `ELIGIBLE`, `INELIGIBLE` or `UNDETERMINED` separately from `PRESENT`,
`ABSENT`, `CONFLICTED` or `NOT_CODED`. `ABSENT` is legal only when the underlying record has adequate
observed area, scale, legend/source purpose, omissions and an explicit absence justification.
Otherwise the observation is `UNDETERMINED`, not a negative.

The current mechanism library implies at least these independent cohort families:

| cohort family | mechanisms requiring it | minimum observability |
|---|---|---|
| component and jurisdiction | multi-nuclear accretion, merger seams, institutional immunity, multiple markets | dated component/precinct evidence plus text or interpretation capable of distinguishing cause and boundary |
| water, shore and access | hydraulic spine, wetland reclamation, crossing hinge, port reclamation, hydraulic production chain | target-period water/access state, dated engineering where claimed, adequate map coverage and explanatory evidence |
| fortification chronology | dated circuit, successive enclosure, wall-before-parcelization, route-gate suburb | dated circuit/gate evidence and a separately evidenced street/parcel/suburb chronology |
| parcel and frontage | frontage-backland | sufficiently fine-scale cadastral or equivalent evidence, declared legend and identifiable frontage/tenure basis |
| planning | intent-realization deformation | independent evidence of intent/grant and later realized form; a regular plan alone is insufficient |
| rupture and rebuilding | discontinuous rebuild | dated destructive event plus pre/post or survival/rebuild evidence with coverage |
| predecessor and terrain | inherited sacred enclosure, topographic ribbon | predecessor or constrained-corridor evidence dated independently of the resulting fabric |
| evidence-method controls | coverage-aware absence, source/interpretation separation | source-role, legend, period, coverage and transformation metadata; never a runtime activation cohort |

The table groups observability requirements; it does not create a shared denominator. Every
mechanism still receives its own versioned cohort manifest. Cohorts may overlap, but a town is not
made independent by appearing in several cohorts. Audit-flow counts are allowed; observed
occurrence percentages and runtime weights are not.

---

## 8. Evidence, coverage and rights requirements

Every expansion claim uses its domain-specific record:
`HistoricalUrbanEvidenceRecord` for UCF/urban morphology,
`ArchitecturalMassingEvidenceRecord` for AMP building/complex/component phases, and
`RuralLandscapeEvidenceRecord` for RSLP site/landscape/holding/right/occupancy phases. They share
the following source/coverage/rights core; the urban type is not a generic container for the other
two domains:

- exactly one `source.role` per claim-sized record;
- discriminated `source.scale` and `source.legend` objects;
- declared scale and legend for cartographic or depicted geometry;
- explicit, non-empty `NOT_APPLICABLE.reason` only where the evidence role/lineage makes them truly
  inapplicable;
- represented period, source date and base-map date kept distinct;
- component-specific certainty with a stated basis;
- explicit observed area, omissions and negative-evidence law;
- corroboration by record ID after records exist, never by flattening roles;
- geometry lineage and georeference error preserved; and
- allowed and prohibited uses enforced from the exact source rights.

`CITATION_ONLY` and `FACT_METADATA_ONLY` sources may contribute concise paraphrased facts,
mechanism witnesses, counterexamples and coverage metadata. They may not contribute copied pixels,
symbols, source coordinates, traced boundaries or derivative geometry. `OPEN_DERIVED_DATA` is legal
only when the exact licence and owner review permit the proposed derivative use. Publicly reachable
does not mean openly licensed.

Coverage is evaluated per claim, not per town. A source unable to see a feature may still support a
different claim, but it cannot enter that feature's negative denominator. Censored, generalized,
unsurveyed, damaged, non-intervention and out-of-purpose areas remain explicit masks or omissions.

No raw restricted source is committed merely to make an audit reproducible. Reproducibility is
provided through citations, access receipts, cryptographic hashes where lawful, coding records and
rights-aware custody.

---

## 9. Separate scope programs

The two European empirical programs in §§9.1–9.2 are separate from the urban frame. Their
observations do not count toward the 80–120 urban towns or the 30–40 urban deep packages, and the
urban atlas sample cannot be used as a surrogate. Each publishes a child manifest with its own frame, numeric sample plan,
selection seed, strata, cohort rules, 18% sealed holdout, batches, stopping rules and rights gate
**before outcome-bearing sources are opened**.

### 9.1 Rural-settlement and landscape program (`RSLP-1`)

The unit is a versioned rural settlement/landscape phase, not “the empty area outside a town.” The
frame covers compact villages, hamlets, dispersed farmsteads, manorial/estate complexes and
settlement–hinterland seams. Its metadata-only frame balances region, period,
topography/hydrology and source tradition. Agrarian/tenurial regime and settlement dispersion may
be selection strata only when an independent frozen catalog assigns them before any outcome-bearing
source is opened; otherwise their frame value is `UNKNOWN` and they become later cohort variables,
never holdout or selection inputs. Outcome-bearing maps/images, descriptions, excavation results,
survival/fabric findings and Wave 1 familiarity may not fill an `UNKNOWN` frame value or influence
selection, ordering, replacement, reserve or holdout allocation.

Required questions include fields and closes, commons, route catchments, drove/track systems,
woodland and extraction, mills/production, drainage and water management, seasonal or abandoned
land, and the causal connection between settlement and countryside. Town-atlas margins and
synthetic vegetation textures are hypotheses only. Rural rules, vegetation allocation and
landscape seams remain uncalibrated until this program passes its own gates. Those gates may promote
scoped conditional engineering ranges and relationships; they cannot estimate occurrence rates,
regime/tenure prevalence, count distributions, frequencies or activation weights.

### 9.2 Architectural-massing program (`AMP-1`)

The primary unit is a building/complex phase clustered within a site and settlement; many buildings
from one survey are not independent towns. Acceptable evidence includes measured building surveys,
inventories, excavation reports, standing-fabric studies and licensed dimensional datasets.
Town-plan pixels do not supply height.

The child frame must balance region, period and independently catalogued source/recording context.
Function, status/resource context, construction system and survival/recording state may be balance
strata only when frozen independent metadata supplies them before source opening; otherwise each is
`UNKNOWN` in the frame and becomes a later cohort/covariate, never a selection or holdout input. It
records footprint, storeys, measured or bounded height, roof form,
materials, party-wall/adjacency, courtyard/outbuilding relations, use and later alteration with
component-specific uncertainty. Conditional building-height/pitch/span/material engineering ranges,
2.5D massing coherence, occlusion receivers and shadow-casting geometry remain uncalibrated until
`AMP-1` passes. Building/roof/material occurrence distributions, prevalence, frequencies and
activation weights remain `NOT_IDENTIFIED`/`NONE` even after AMP completion unless a separate
probability-sampling protocol supplies an eligible denominator. Lighting physics itself is an
implementation concern, but historical lighting values are outside this atlas program.

Outcome-bearing drawings/images, descriptions, fabric/survival results and Wave 1 familiarity are
explicitly barred from AMP frame, reserve, replacement and holdout decisions. They enter only after
the frozen selection is released for development coding.

### 9.3 Explicit product boundary (not a completion program)

The owner-ratified map tradition is `EUROPEAN_FANTASY_BASE`. Current broad culture choices remain
narrative/naming inputs and do not select settlement morphology. Therefore a non-European research
program is **not** a `HEEP-1` completion gate, quota or child deliverable. This protocol makes no
global-transfer claim.

If a future owner decision adds a non-European map tradition, it requires a new locally scoped child
protocol, regionally competent review, source-tradition inventory, local periodization, explicit
rights/community governance and a separate holdout. European evidence may suggest questions but can
never be relabelled as that future pack.

---

## 10. Required machine-readable artifacts

The expansion adds governance schemas beside, not inside, runtime generation. Schema names below
are requirements; their concrete file layout is chosen in an implementation packet.

| schema | required contents |
|---|---|
| `ExpansionProtocolManifest` | all version IDs; research questions; sample bounds; strata/quotas; batch and stop rules; allowed outputs; code and artifact hashes |
| `SamplingUnitRecord` | stable identity/aliases; program, country and frozen strata; metadata source; `PRIOR_SEEN`; selection rank; holdout-opaque status; disposition |
| `SelectionEvent` | append-only selection/substitution event; rule version; reason code; prior and reserve opaque IDs; actor; timestamp; hashes |
| `PackageInventoryRecord` | package components; source roles; date/period fields; scale/legend availability; transformation lineage; coverage; access and rights status |
| `ArchitecturalMassingEvidenceRecord` | claim-sized building/complex phase; component/part/function/support subject; height/storey/roof/pitch/material/phase/survival certainty; shared source/coverage/rights core |
| `RuralLandscapeEvidenceRecord` | claim-sized rural site/landscape phase; settlement-node/holding/right/occupancy/land/route/hydraulic subject; shared source/coverage/rights core |
| `DeepPackageAuditRecord` | completeness results, claim-record IDs, conflicts, omissions, rights review, coder/adjudicator and instrument version |
| `MechanismCohortManifest` | mechanism-specific unit, prerequisites, eligibility, observability, certainty and coverage rules; metrics; forbidden uses |
| `MechanismObservationRecord` | eligibility separate from observation; evidence IDs; phase/unit; uncertainty; coder; adjudication; exclusion/unknown reason |
| `RangeMeasurementRecord` | frozen metric definition and normalization; value/bounds; measurement resolution; clustered town ID; evidence provenance |
| `BatchDecisionRecord` | cumulative counts; saturation classes; quantiles/IQR; stratum checks; stop/extend decision and immutable inputs |
| `HoldoutSealReceipt` | opaque IDs only; allocation and selection hashes; stratum totals; seal time; custodian; contamination count; no source identity/content |
| `HoldoutAccessEvent` | append-only authorized/accidental access, scope, actor, timestamp, disposition and replacement seal reference |
| `CoderAgreementRecord` | independently coded fields, agreement result, disagreement classes, adjudication and instrument-change consequence |

`HistoricalUrbanEvidenceRecord` remains the UCF/urban claim schema. AMP/RSLP child registries may
not pass until their separate domain schemas and validators exist. In every registry,
corroborating IDs are validated only after the complete record-ID set is collected; none may weaken
the shared source-role, scale, legend, coverage, uncertainty or rights laws.

At least 20% of development observations in each mechanism cohort and every proposed negative are
double-coded independently. Disagreement on eligibility, absence, role, period, or a required
certainty threshold is adjudicated before batch statistics are calculated. Any instrument change
caused by disagreement forks `instrumentVersion` and triggers recoding of all affected prior batches.

---

## 11. Deliverables and gates

| gate | required deliverable and pass condition |
|---|---|
| `PROTOCOL_FREEZE` | this protocol plus content hash and named custodial/research roles |
| `FRAME_FREEZE` | custodial candidate manifest, explicit stratum membership, quota feasibility report, deterministic script/hash, sealed 120-town slate and reserve order; only non-secret hashes/script enter the working repository |
| `RIGHTS_AND_ACCESS` | source-by-source rights/access census; acquisition failures and legal uses recorded; no prohibited content stored |
| `HOLDOUT_SEAL` | correct 15–20% allocation, opaque seal receipt, presealed replacements and empty unauthorized-access log |
| `INSTRUMENT_FREEZE` | coding rubric, source-role mappings, certainty/coverage rules, metric definitions and coder training fixtures versioned |
| `URBAN_MINIMUM` | at least 80 selected towns with every hard balance quota satisfied |
| `DEEP_PACKAGE_MINIMUM` | at least 30 complete packages audited in frozen order; no completeness component silently omitted |
| `COHORT_ELIGIBILITY` | a manifest per tested mechanism, audit-flow accounting, lawful negatives and minimum independent-unit rules satisfied |
| `CODER_AGREEMENT` | required double coding/adjudication complete with no unresolved eligibility or negative-evidence disagreement |
| `SATURATION` | two successive batches pass every per-mechanism and per-stratum saturation test |
| `RANGE_STABILITY` | every claimed engineering range passes its sample floor and two successive frozen comparisons; others labelled `UNCALIBRATED` |
| `HOLDOUT_EVALUATION` | development law frozen before one-way opening; contamination accounted; results reported separately against predeclared thresholds |
| `PROMOTION_REVIEW` | owner review assigns bounded scope, real dossier/world predicates, temporal operation, compiler derivation stage, receipts, counterexamples and law version |

Required final outputs are:

- the versioned frame, selection and substitution artifacts;
- 80–120 town-level audit packages and 30–40 complete-package deep audits;
- claim-sized historical records with source, rights, coverage and uncertainty provenance;
- a cohort manifest and disposition for every tested mechanism;
- batch/saturation and range-stability reports, including failures and `OPEN_AT_CAP` results;
- holdout seal, access and evaluation receipts;
- counterexample and scope-revision register;
- an explicit list of uncalibrated questions routed to `RSLP-1` or `AMP-1`, plus any request that
  falls outside `EUROPEAN_FANTASY_BASE` and is therefore refused rather than added as a hidden debt; and
- a promotion packet, or a research-only refusal, for each mechanism considered.

Passing the research gates does not itself pass `PROMOTION_REVIEW`. A mechanism remains
`RESEARCH_ONLY` until the executable generation manifest, actual world predicates, dated operation,
canonical artifacts, law version, deterministic fixtures and typed effect receipts exist.
Historical `mustFollow`/`mustPrecede` edges express dated causal chronology; compiler
`derivationStages` express materialization order. Neither order may be inferred from the other.

---

## 12. Work that may proceed in parallel

Evidence-independent architecture need not wait for the expanded corpus, but it must not smuggle in
empirical conclusions the corpus is intended to test.

### Stable work that MAY proceed

- quantized coordinate ABI, canonical ordering, hash/PRNG namespaces and receipt infrastructure;
- schema/manifest validators, rights-aware evidence tooling and holdout access controls;
- canonical artifact plumbing and typed refusal paths for dormant historical operations;
- `HistoricalPlanIntent`/`HistoricalPlanRealization` (`PLAN_INTENT`/`PLAN_REALIZATION`) interfaces
  and validators while they remain manifest-gated and do
  not invent historical inputs;
- DCEL/topology dual-run and equivalence work as general geometry infrastructure, not a historical
  town theory;
- export, hit-region, occlusion and lighting pipelines when driven only by already canonical
  geometry and explicitly non-historical rendering constants; and
- fixtures proving determinism, invariants, invalidation and no evidence-record runtime imports.

### Work that MUST wait for the relevant evidence gate

- promotion or default activation of the current `RESEARCH_ONLY` mechanism library;
- mechanism probabilities, national/cultural priors or historical frequency tuning (these remain
  `NOT_IDENTIFIED`/`NONE` after HEEP/RSLP/AMP and require a separate probability protocol);
- numeric morphology thresholds proposed from Wave 1 exemplars until an eligible development
  cohort supports their scoped conditional engineering ranges;
- a universal substrate-to-town or “organic medieval” operation order;
- rural fabric, field, vegetation, extraction or settlement–landscape calibration before `RSLP-1`;
- height, storey, roof, material, massing, receiver-shadow or historical occlusion calibration before
  `AMP-1`;
- any non-European map grammar or global-transfer claim without a future owner-authorized regional
  protocol and measurement-equivalence gate; this work is out of current scope, not a `HEEP-1` debt;
- geometry or symbol ingestion without explicit compatible rights and owner review; and
- any threshold, range, tuning choice, exception or scope rewrite derived from sealed-holdout
  identities or outcomes. This is permanently forbidden, not work that becomes legal after a gate.

An implementation whose lawful behavior is invariant to every possible expansion result may
proceed. If the evidence could change a canonical cause-to-effect predicate, conditional range,
ordering, cultural scope or canonical output, it stays dormant or behind an explicitly future law
version until the relevant gate passes. Random/default activation never follows from these balanced
programs; it remains `NONE` absent a separately authorised probability protocol.

---

## 13. Amendments, failure and completion language

Before source opening, an amendment may clarify an ambiguity if it publishes a new protocol or rule
version, rationale, diff and hashes. After outcome-bearing material is opened, any amendment that
could affect selection, eligibility, coding, metrics or stopping creates a new analysis branch and
requires affected data to be recoded; it cannot preserve a “preregistered” label by assertion.

The following outcomes are legitimate and must remain visible:

- `SUPPORTED_AS_POSSIBLE`
- `SCOPE_NARROWED`
- `COUNTEREXAMPLE_ADDED`
- `NOT_OBSERVABLE_WITH_AVAILABLE_SOURCES`
- `UNCALIBRATED`
- `OPEN_AT_CAP`
- `HOLDOUT_FAILED`
- `RIGHTS_BLOCKED`
- `RESEARCH_ONLY`

Wave 1 is complete only as a discovery and evidence-governance wave. `HEEP-1` is complete only when
its frame, deep audits, mechanism cohorts, rights/coverage accounting, stopping decisions and sealed
evaluation are delivered or transparently failed at their caps. Even then, completion means a
bounded European evidence program has finished—not that historical urbanism, rural landscapes or
architectural massing have been exhaustively captured, and not that global settlement history was
within scope.
