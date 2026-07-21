# THE MAP SUITE CONSTITUTION — Tranche M (Fable, 2026-07-21)

Owner-ordered at the walk (ledger rows 1d1d5e0d → e1b419a4); this doc is the durable
spec the M lanes build from. One law above all: **one townMapModel → four projections
× style lenses** (the townPanorama law: a projection re-poses, a lens paints, both
emit the same primitive draw-op vocabulary). Everything below is deterministic,
pure-hash, lazy-only, closure Δ≤0, purity-banned (no Date/random/localeCompare/trig).

## M-0 · THE PROCEDURAL MASSING LAYER (3D structures, not glyphs)
Per-building VOLUMETRIC construction: footprint × height-class (the panorama's
pseudo-elevation tables: tier / institution kind / district / walls) × kind-keyed
roof form (spire, gable, hip, wheelhouse) with face shading under the ONE fixed NW
light (SHADOW_DIR — shared with groundDress), cast shadows, painter's-algorithm
depth sort. Trig-free cavalier/axonometric transforms only. REJECTED (vetoable):
WebGL/true perspective — GPU float variance breaks same-seed-same-image (THE
PROMISE) and the eager budget. Massing replaces glyph STAMPS in every dimensional
view; glyphs remain legitimate iconography in flat views.

**THE INSTITUTION SILHOUETTE LAW (owner, 2026-07-21): a cathedral must look
like a cathedral.** Massing is COMPOSITE, never single-extrusion, for every
named glyph kind: cathedral = nave + transept + tower + spire (cruciform read);
keep = mass + corner towers; mill = house + wheelhouse + wheel; smithy = block +
chimney; market hall = long open-sided mass. The glyph library's named-landmark
vocabulary IS the silhouette taxonomy, lifted from flat to 3D; category defaults
get generic house massing. Composite forms construct WITHIN the building's
allotted footprint. The silhouette totality walker: every named kind maps to a
composite form or the explicit generic default — unmapped REDS. Acceptance =
recognition unlabeled at a glance (the picturesque gate's first question).

**CUSTOM INSTITUTIONS (owner, 2026-07-21): the derivation ladder.** Shape and
placement for user-created institutions resolve through four deterministic
rungs, each falling through to the next: (1) explicit typed fields —
silhouetteClass + placementAffinity picked from the FINITE taxonomies; when AI
constructs a custom institution, its instructions include making these picks
FROM THE ENUMERATED VOCABULARIES (the bucketing-clerk law: AI classifies into
our determinism, validated on arrival, rejected out-of-vocabulary — never
geometry, never free text). ⚠ Rung 1's schema fields + the Surveyor prompt
update are OWNER-GATED (additive persistence shape + edge-function deploy);
(2) supply-chain derivation — economic role dictates urban logic: processors
near inputs, sellers on the market spine, storage by docks/gates; workshop
massing with the craft's signature element; (3) the name-match ladder — the
existing glyphAssign/institutionAssignment idiom extended: '…Cathedral…' earns
the cruciform composite with zero AI and zero schema; (4) the category floor —
category-default massing + the total assigner's guaranteed home. TOTALITY: no
custom institution ever renders unshaped or unplaced; the silhouette walker
proves the ladder resolves for every custom, or REDS. Customs carry stable
anchorKeys already — every drift/edit/cosmetic law applies to them unreduced.

## M-1..M-4 · THE FOUR VIEWS
- **M-1 VTT**: top-down plan, configurable grid overlay, high-contrast lens,
  token-legible walls/openings, export-ready. Cosmetics MUTED by design.
- **M-2 PANORAMA**: exists (townPanorama) — upgrade facades from glyphs to massing.
- **M-3 BIRD'S-EYE 3D**: new axonometric projection — tilted top-down, massing
  volumes, roofs readable.
- **M-4 PLANNER'S SKETCH**: flat bird's-eye at MAXIMAL dress — full groundDress,
  district annotation, sketch-linework lens (the engraver register).
Surface: view switcher in SettlementMapPane (WYSIWYG law — honors edits + active
lens; the pane is at 598/600, so the switcher lands as a lazy host, net-zero there).
Determinism golden per (model, projection, lens) pair.

## M-0b · THE COSMETIC FIELD  —  cosmetics = f(morphology × condition × history)
Finite motif vocabularies (roof tiling, facade treatment, signage emblems, murals)
keyed institution × culture × prosperity × age; assignment via pure-hash
(seedId, anchorKey). Typed buckets only; zero free text.

**SHAPE-COHESION LAW**: the field consumes the sources the layout drifts by —
lynchRubric paths/nodes/landmarks (signage density along spines, murals facing
squares, landmarks out-signal), ageOverlay (patina gradient), asymmetrySources
(street-benders bend decoration), fabricRead × prosperity (finish per quarter),
water/terrain adjacency (weathering; facing derived from road/plaza geometry).
Cohesion ≠ uniformity: the field must VARY along the shape.

**CONDITION-COHESION LAW** (ten dimensions, all from typed bands): war DURATION
bands (layered repairs for the long war) · occupation iconography · alignment/
culture upkeep character · pantheon emblems by piety · trade EXPORTS on signage ·
debt as civic deferred-maintenance · CORRUPTION: covert renders NOTHING unusual
(covert means invisible; prevents map-side leaks), only revealed dresses ·
legitimacy banners · magelight density · stress/threat wards. GUARDS: deterministic
SALIENCY BUDGET (strongest few conditions win; all-at-once is mud); no covert
state on any shareable lens; band keys only (the W6 ladders document the drivers).

**TEMPORAL-DRIFT COHERENCE**: cosmetic hashes key on stable anchorKeys — one shop
closing never re-dresses another building ("never re-homes" extends to "never
re-dresses"). Succession semantics: occupant change swaps the sign, structure +
patina persist; rebuild resets age; palimpsest motif where the record carries the
succession. Monotone weathering via ageOverlay. District drift stays local.
**THE LOCALITY GOLDEN**: same-seed tick-T vs T+N dress diff == exactly the
causally-changed sites; anything else flickering = RED. mapEdits keep WYSIWYG
priority. changeView/timelapse can render the dress aging.

## EDIT-ANCHORING LAW (addendum 6)
Two explicit edit classes. The existing 8-key vocabulary (layoutVariant, pins,
legendPrefs, styleLens, layoutLawVersion, annotations, bespokeStyles,
seasonOverride) stays COSMETIC — replayed, dormancy-proven, never generative. A
NEW GENERATIVE class (geometry verbs — menu drafted for the owner, never invented
silently) feeds the drift substrate: tick T+1 derives from the EDITED geometry.
Determinism: map(seed, tick, editHistory). PROVENANCE OPTION (flag at build):
generative edits mint receipts — the Keeper becomes a citable historical force.
New EDIT_KINDs bind to COMMITTABLE_EDIT_KINDS + the V-L edge-bundle-regen hazard +
denylist-safe keys + anchor-keyed-never-coordinates + no random ids. Cosmetic
never silently promotes to generative.

## TERRAIN EDITING (addendum 7 — terrain is the FIRST CAUSE)
- **Tier 1** cosmetic dress (trees, outcrops, texture): cosmetic class.
- **Tier 2** same-TYPE geometry reshaping (bend the coast, move the river, raise a
  hill): generative class under the anchoring law; permitted because the typed
  terrain profile is unchanged, so every dossier derivation stays true.
- **Tier 3** type-changing: NOT an edit. Offered as (3a) THE CONSTRAINT FORK — a
  deterministic sibling regeneration, surfaced honestly ("this town, had it been
  inland") — or (3b) THE RECORDED TERRAIN EVENT (owner-gated event vocabulary,
  new sim capability): the change enters the simulation as a typed event with
  receipts; the town adapts over subsequent drift; the murals eventually remember.
- **GUARD**: terrain–dossier PARITY WALKER — map terrain must always agree with
  the constraint record; contradiction = RED.

## AI-COMPAT GATE
E-D per-surface source-scan + aiFallbackTotality + the 9-surface census stay green
through every M lane. AI grounds on the model/dossier substrate, never pixels —
projections cannot desync it; no view-specific state forks. A lit AI-surface pass
at M's fold drives each censused surface with the suite active. aiGrounding.js is
FORBIDDEN to M lanes (edge-bundle desync hazard). OraclePanel + map AI mounts
survive the view switcher (per-view mount tests).

## THE PICTURESQUE GATE (standing law — the Cnocby plates lesson, 2026-07-21)
Green gates never certify beauty. Every (projection × lens) pair is validated by
the manager's eyes on rendered output from real seeds before its lane folds; the
owner's eyes outrank the manager's. Motif libraries build NARROW AND DEEP (few
motifs, high quality, variation via composition) — wide-and-thin reads repetitive.
SVG weight rides the op-budget idiom + LOD rules (signage/murals at panorama and
bird's-eye scale; tiling at bird's-eye; ground detail in the sketch; VTT muted).

## SEQUENCING
M-0 massing substrate first (everything consumes it) → owner taste checkpoint on
first massing render → M-0b cosmetic field (shape → condition → drift, in that
order) → M-1..M-4 in parallel → view switcher + exports → M fold with the full
gate + the lit AI pass + the picturesque sign-off. Generative edits + terrain
tiers ship as their own gated waves after the views stand. W7's realmPlateRenderer
is prior art for headless plate emission; its realm previews upgrade under M.
