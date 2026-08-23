# DESIGN — THE DWELLINGS PROGRAM (DW): interior floor plans as a projection of the world

**STATUS: ARCHITECTED, NOT BUILT.** Owner-ordered at ODQ §435 (2026-08-23); origin
is the owner–chair design conversation of that sitting (the ledger row cites it).
Per the estate's architected-design discipline (the §287.16 precedent): this
document is design with NO implementation and may not be reported as built.
**SEQUENCE (integrated per ODQ §437): the ZERO-REPO-BYTE phases run early;
the repo-byte phases stay post-endgame.** Specifically: P1a-P1d (research,
corpus, instruments, benchmark pre-registration) are read-only and run IN
PARALLEL with the current arc as seats allow — the atlas-research precedent;
DW-0's band-signing rides an owner sitting once taste-samples exist (batched
with other owner sittings); the P2 SANDBOX (own worktree, zero repo bytes)
runs in the endgame's quiet windows and never contends with a landing gate
or the soak. P3-P8 (the spec volume, preamble, compile, dark port,
activation, tuning leg, style) remain STRICTLY POST-ENDGAME: no repo byte,
no car, no golden motion before D3b is live, the undercity and producer
trains are landed, and the endgame completes. Coordination carry-notes are
planted NOW (§16) so nothing built in the current arc precludes DW.

---

## §1 · THESIS

Every building the map shows becomes, on first click, a floor plan that can
EXPLAIN ITSELF: derived from facts the world already holds, contradicting no
other surface, inventing nothing. The product thesis (map AND context) applied
one level deeper. Immersion is defined structurally: the absence of
contradiction plus the presence of time.

## §2 · THE NINE FOUNDING LAWS

1. **FUNCTIONS, NOT ROOMS.** The requirement roster requires FUNCTIONS (forge,
   hearth, sleeping, storage…). Prosperity buys walls first, then duplication:
   at the floor, functions share one crammed space; rising wealth splits
   functions into rooms; the ceiling duplicates them (multiple forges, the
   armor annex). Room-assignment failure is structurally impossible because
   requirements GENERATE rooms, never chase them.
2. **THE THREE-CLAMP CEILING.** An interior is bounded by (a) its
   institution's own ceiling, (b) its parcel/massing footprint (no interior
   exceeds the exterior), (c) its settlement's economy (no building
   out-prospers its town — read from the dossier's economic bands).
3. **THE FLOOR IS EXISTENCE.** The bare-essential function set IS the license
   to exist (no forge, no smithy). Prosperity adds, never substitutes; decline
   sheds in a stated order, essentials never.
4. **DERIVE, DON'T STORE.** The plan is a pure function of
   (worldSeed, buildingId, circumstancesSnapshot). First click derives;
   nothing is persisted; identical forever at identical circumstances. Only
   DM EDITS persist — as DELTAS replayed over every fresh derivation (the
   settlement editor's settled cure; the estate's most-bitten class
   pre-answered).
5. **STABLE ANCHORS.** Re-derivation under changed circumstances reads as
   RENOVATION, not replacement: core functions anchor by stable keys
   (the stablePart idiom); small changes add/shed around fixed hearts; every
   re-derivation is DATED and narratable (fossils, renovation years — the
   undercity's dated-fossil pattern extended above ground).
6. **FRONTAGE FROM THE PARCEL.** Orientation is READ off the parcel's own
   street-frontage data, never guessed: commerce functions weight to the
   frontage edge with the street door; living behind; service to the rear or
   back lane. Corner lots pick a primary frontage from the street hierarchy.
   The market-stall poverty inversion is lawful (no storefront room — the
   dossier already says such trades sell at the market).
7. **BASEMENTS ARE THE UNDERCITY'S PROJECTION.** One canonical underground
   graph (the undercity train's connectivity graph). A below-grade room,
   hatch, or passage exists in a floor plan IFF the graph anchors it at that
   building. Attics are building-local; basements are graph-canonical.
   Criminal fronts, crypts, and sealed former connections render from the
   same rows the undercity map reads. Never a coin-flip basement.
8. **THE PARTI DRAW.** Generation's top-level draw is the organizing FORM —
   the double-height hall with galleried wings, the grand-stair spine, the
   courtyard ring, the many-roomed block — weighted by prosperity ×
   institution × culture, drawn from the measured historical parti catalog.
   Function-mapping happens WITHIN the drawn parti's discipline. Variety is a
   seeded weighted draw INSIDE owner-signed ranges: prosperity sets bounds,
   the dice pick within them — reflective, never uniform.
9. **VERTICAL HONESTY.** Storeys are a PARTITION of the massing's measured
   height envelope. Double-height cells (the great hall) lawfully spend
   vertical budget; storey heights vary by status (the piano nobile); the
   interior floor count always reconciles with the exterior silhouette. A
   parti with exterior consequences (tall hall windows) is eventually a named
   massing part both surfaces read (the D5-strata seam, designed-for now).

## §3 · CANONICAL INPUTS — what each existing system supplies (read-only)

| System | Supplies | Interior consequence |
|---|---|---|
| Institution catalog | category-tiered REQUIREMENT ROSTERS (+rare overrides) | lawful per-type interiors; ~dozens of category laws, not 311 hand rosters |
| Economy/chains | prosperity band; the chains feeding each craft; entrepôt/imports | split-vs-cram; the stalled chain's cold second forge; bought-in goods |
| Demography | household size/structure, age bands | who sleeps where; tenement subdivision; servants; roles never named fates |
| Simulation history | founding year (T2Q's stamp), dated events, calamities | building age styles it; scarred beams; dated renovations |
| High-water (T2R) | peak tier vs present | DECLINE MADE SPATIAL: overbuilt shabby grandeur, subdivided mansions |
| Faith | tenure/endowment/culture (never theology) | rooted temples accrete chapels; thin ones bare; symmetric temple partis |
| Defense/war | compound booleans, garrison state | stocked or empty armories; requisitioned rooms under martial law |
| Undercity graph | licensed anchored connections, fossils | law 7 wholesale |
| Map fabric | parcel polygon, frontage, massing volumes, party walls, support surfaces | laws 6 & 9; stairs anchored where geometry allows; no TARDIS rooms |
| News | the address law | events resolve INTO rooms; renovations emit news back |
| Custom content | the admission machinery | custom institutions inherit category rosters + overrides |
| Tiers/entitlements | the projection machinery | player-safe plan free; DM secrets premium |
| Foundry/PDF pipeline | scene/journal exports | floor plans as FOUNDRY SCENES WITH WALL DATA; multi-floor PDF |

## §4 · THE DERIVATION PIPELINE (pure, staged, per building)

S1 CIRCUMSTANCES SNAPSHOT — assemble the typed input record from §3's readers
   (a pure gather; the snapshot's shape is the program's first data contract).
S2 PARTI DRAW (law 8) — seeded weighted draw over the catalog, clamped by the
   three clamps.
S3 VERTICAL PARTITION (law 9) — storeys from the massing envelope; double
   cells per the parti; attic/basement slots (basement only if law 7 grants).
S4 FUNCTION ROSTER (laws 1–3) — the institution's floor set + prosperity
   additions + household functions from demography; shedding order attached.
S5 PLACEMENT — functions → rooms within the parti: frontage weighting (law 6),
   split-vs-cram budget, adjacency preferences (kitchen near hall, workshop
   at the frontage), party-wall and window/light constraints per function.
S6 CIRCULATION — doors, stairs (type per parti and prosperity: ladder →
   winder → spiral → grand), reachability to every room and inserted gallery;
   the street entrance on the frontage room. **CIRCULATION CLASSES (owner
   directive, ODQ §452, 2026-08-23): hallways, passages and LONG HALLWAY
   CHAMBERS are first-class room classes, not leftover space — licensed where
   the building's KIND and its INDICATIONS (parti, storeys, tier, prosperity,
   institution function, era grade) call for them, never minimized by
   default.** The closed class set the corpus program researches and the
   grammar draws from: `THROUGH_ROOM` (enfilade — the pre-corridor default;
   rooms open into rooms) · `CROSS_PASSAGE` / `SCREENS_PASSAGE` (the hall
   house's front-to-back passage behind the screens) · `CORRIDOR` (the
   dedicated hallway — historically LATE in domestic work: a 17th-century
   innovation in the English register, so its license is era-graded and
   institution-graded, while barracks, hospitals, colleges, monasteries,
   prisons and great houses license it earlier by their own program) ·
   `GALLERY` / `LONG_GALLERY` (the long hallway chamber — a room in its own
   right: the great house's long gallery, the cloister walk, the arcaded
   loggia, the jetty-side pentice, the inn's gallery over the yard, the
   barracks' stair-and-landing module) · `LOBBY` / `VESTIBULE` (the
   lobby-entry plan at the chimney threshold; the porch) · `STAIR_HALL`.
   Each carries its own fixtures, light requirement and width/length buckets
   (finite semantics), and each is a §311.9-style TYPED JOINT for the
   undercity projection where a stair or passage meets a cellar. The
   research tranches (§8) report the circulation typology PER ENTRY; the
   CT-0 taste sitting gates the rosters.
   **STORAGE AND SERVICE CELLS (owner directive, ODQ §453, 2026-08-22):
   closets and pantries — and their kin — are likewise first-class cells
   where the building's kind and indications license them, never folded
   into "the room" as invisible space.** The closed class set the corpus
   program researches: `CLOSET` (the garderobe-as-closet, the chamber
   closet, the study closet of the great house; the press/aumbry as a
   fixture when the space is too small to be a cell) · `PANTRY` (bread and
   dry stores; the medieval pantry paired with the buttery across the
   screens passage) · `BUTTERY` (drink stores; the pantry's pair) · `LARDER`
   (cold/meat store — north side, no hearth, slate shelves) · `STILL_ROOM`
   / `DAIRY` / `SCULLERY` (prosperity- and institution-graded service cells)
   · `STORE` (the warehouse bay, the shop's back store, the armory's racks
   as fixtures vs the arsenal's floor-per-weapon-class as cells) · `CELLAR`
   / `UNDERCROFT` (the below-ground store — a §311 component, licensed by
   the undercity train and drawn here only as its surface joint) · `ATTIC`
   / `GARRET_STORE`. Each carries light requirement (larders and pantries
   want NONE or north light), a size bucket, fixtures (shelves, hooks,
   bins, the press), and an adjacency law (pantry/buttery off the service
   end of the hall; larder away from the kitchen hearth; the closet off its
   chamber). Licensing is graded by era, tier and prosperity exactly as the
   circulation classes are — a thorp's cottage has a hanging shelf and a
   chest, not a pantry; a town merchant's house has the pantry and the
   cellar; the great house has the whole service range. The research
   tranches report the STORAGE TYPOLOGY per entry beside the circulation
   typology.
S7 FIXTURES & DRESSING — typed fixtures per function at the prosperity/wear
   grade (finite semantics: closed vocabularies, PRESENT/NONE-with-reason);
   supply-state variants (the stalled chain's cold forge); abstract-shape
   rendering at the player tier, named-and-stated at the DM tier.
S8 UNDERCITY PROJECTION (law 7) — render the building's slice of the graph:
   stairs down, hatches, sealed arches with dates.
S9 VALIDATION — the lawfulness walker certifies: floor satisfied, ceiling
   respected, every room licensed, every absence reasoned, circulation total,
   geometry legal (no overlaps/slivers; minimum dimensions and aspect ratios
   per function), vertical partition exact. A plan ships only certified.

## §5 · DATA CONTRACTS (all closed vocabularies; finite-semantics law)

- `RequirementRoster { institutionCategory, floorFunctions[], ladder[]
  (prosperity rung → additions/duplications), sheddingOrder[], ceiling }`
- `Function { kind, minDims, aspectBounds, lightReq, adjacency[], fixtures[] }`
  (window/light as first-class constraint — adopted from the Dwellings
  study's room-type vocabulary).
- `CirculationCell { class: THROUGH_ROOM | CROSS_PASSAGE | SCREENS_PASSAGE |
  CORRIDOR | GALLERY | LONG_GALLERY | LOBBY | VESTIBULE | STAIR_HALL, license
  (kind × indications × era grade), widthBucket, lengthBucket, lightReq,
  fixtures[], joints[] }` — circulation as a first-class cell class (ODQ
  §452); `FloorPlan.storeys[].cells[]` may be a Function cell or a
  CirculationCell; reachability (S6) is proven over both.
- `StorageCell { class: CLOSET | PANTRY | BUTTERY | LARDER | STILL_ROOM |
  DAIRY | SCULLERY | STORE | CELLAR | UNDERCROFT | ATTIC | GARRET_STORE,
  license (kind × indications × era grade), sizeBucket, lightReq (NONE |
  NORTH | ANY), fixtures[], adjacency[] }` — storage/service as a first-class
  cell class (ODQ §453); a space below the cell floor is a FIXTURE of its
  host cell (a press, an aumbry, a hanging shelf), never an invented room.
- `Parti { id, form, weights(prosperity×institution×culture), verticalGrammar,
  stairGrammar, exteriorConsequences[] }`
- `FloorPlan { buildingId, derivedAt{year,tick}, circumstancesDigest, storeys[]
  { cells[] { function(s), polygon, doors[], windows[], fixtures[] } },
  underLinks[], fossils[], certification }` — DERIVED, never persisted.
- `PlanDelta { buildingId, path, op, value, editedAt }` — the only stored
  artifact; replayed at S9-post.
- Secrecy: every cell/fixture/link carries the projection tier
  (player/DM) via the existing entitlement machinery — no second system.

## §6 · DETERMINISM & CHANGE

Seeded draws fork per (worldSeed, buildingId, axis) — the drawVariant idiom.
Re-derivation triggers: prosperity band change, institution status change,
household change, physical restructure (post-D3b massing edits), undercity
graph change. Each re-derivation is dated; diffs against the prior derivation
mint FOSSILS (a sealed arch, a bricked door) and MAY emit news (the address
law in reverse). Anchor stability (law 5) bounds churn: the validator's
continuity arm asserts core-function anchors persist across single-band
changes. THE PROMISE: plans are projections — lived history immutable, the
starting world untouched; nothing here writes generation-path bytes, ever.

## §7 · PROJECTIONS

On-click pane (lazy, the vendor-lazy contract); DM/player tiers; the PDF
chapter (multi-floor pages); FOUNDRY SCENES WITH WALLS (the VTT gap the
market measurably wants — repeatedly requested of Dwellings, never delivered);
SVG/PNG export via the existing export surfaces. The estate view: the parcel's
buildings top-down with the main plan opened — read straight from fabric data.

## §8 · THE CORPUS PROGRAM (DW-R — the long pole; EXPANDED per ODQ §438)

**The owner's §438 order: comprehensive and expansive, per-institution, cost
accepted — including FANTASY AND MAGICAL institutions derived from fiction
and lore.** The research covers the product's OWN catalog entry-by-entry
(category tranches with per-entry distinctions), each institution receiving:
its real-world/historical interior analogue (functions, fixtures, structural
imperatives) AND — for magical/fantasy institutions (mage towers, alchemical
laboratories, enchanters, magical academies, teleport-circle houses, and the
catalog's own magic entries) — the GENRE'S expectations derived from fiction
and lore. THREE DISCIPLINES BIND THE LORE LEG: (1) conventions, never
expression — genre tropes and functional expectations are research; any
specific protected text/names/creatures are not copied; (2) the deity
doctrine — temple interiors are cultural/liturgical-functional, never
theologically specific; (3) finite semantics — every lore finding lands as
typed closed vocabulary, the clerk composes. The tranche roster:
R-INST-1 civic/administrative + defense/military · R-INST-2 trade, commerce
and crafts (the largest) · R-INST-3 faith + learning · R-INST-4 hospitality,
entertainment, poverty and utility · R-INST-5 MAGICAL/fantasy institutions
(the fiction-and-lore leg) · R-INST-6 criminal/underground fronts (the
undercity seam). Each tranche reads the ACTUAL catalog entries from the
repo, researches per-entry, and delivers a taste-gated dossier. **Every
entry's dossier row reports its CIRCULATION TYPOLOGY (ODQ §452): which of
the closed circulation classes the building historically carries, at which
era grade and prosperity, with measured widths/lengths where a primary
source exists, and the indications that license each — hallways and long
hallway chambers are never omitted for being "empty" space; they are the
grammar's spine for multi-room buildings — and its STORAGE TYPOLOGY (ODQ
§453): closets, pantries, butteries, larders, stores and service cells,
with the size/light/adjacency laws that license each.** R-INST-1
(delivered before §452/§453) and DWR1A owe a CIRCULATION + STORAGE
ADDENDUM pass.

The atlas method applied to interiors: measure real historical plans into
grammars — hall houses, longhouses, burgage plots, tenements, courtyard
houses, temples (symmetric partis), inns/taverns/shops, workshops by trade.
Sources: measured-plan literature; Yoshida's *Houses with a Story* for
narrative-cutaway taste. Deliverables: the parti catalog with weights, the
function vocabulary with constraints, per-category requirement rosters,
the fixture vocabulary with prosperity/wear grades. Owner taste-samples
gate each corpus wave (the CT-0 pattern).

## §9 · IMPLEMENTATION WAVES (for the eventual charter compile; sizes rough)

| Wave | Content | Depends on |
|---|---|---|
| DW-0 | charter compile from THIS document; owner sits the bands | endgame complete |
| DW-R1..R3 | the corpus (partis; functions/rosters; fixtures) | DW-0 |
| DW-1 | vocabularies + rosters landed dark (engine leaves, golden-inert) | R-waves |
| DW-2 | the geometry core: vertical partition + parti placement + circulation over parcel polygons | D3b live; DW-1 |
| DW-3 | fixtures/dressing + supply-state variants | DW-1/2 |
| DW-4 | the undercity projection seam | undercity landed |
| DW-5 | the validator suite + continuity arms | DW-2..4 |
| DW-6 | projections: pane, tiers, PDF, Foundry-walls | DW-2..5 |
| DW-7 | deltas/editing + news hooks + the estate view | DW-6 |

Rough scale: one-third to one-half of the map program (its hardest substrate
— exact geometry, massing, determinism law — already exists).

## §10 · INSTRUMENTS

The lawfulness walker (S9) as a landed test family; plan goldens per fixture
settlement (derived plans are generation-golden-inert by construction —
the producer-train architecture law reused); the continuity arm; the
no-second-truth scans (no fixture vocabulary outside the roster; no
underground geometry outside the graph; the §423-style two-homes law for any
interior "operation" if one ever exists).

## §11 · OWNER-SIGNATURE SURFACES (named now, signed at DW-0)

The prosperity floor/ceiling bands per category; the parti weights; the
shedding/splitting orders; storey-height ranges; the fixture grade tables;
the corpus taste-samples. All world-shaping constants — the tuning class.

## §12 · MARKET POSTURE (from the Dwellings study, ODQ §435's research)

The competitor's own audience asked for: guaranteed room types, real building
types, VTT wall export, basement control, a "normality" slider, multi-floor
PDF — each is a natural consequence of facts-first here, several were
declined there as structurally hard. His deliberate strengths to respect:
instant generation feel, abstract-furniture legibility (our player tier),
exploration interest (ours arrives via secrets/fossils/undercity, never
incoherent mazes). Nobody has interiors WITH MEANING; this program is the
moat's second storey.

## §13 · ANTI-SCOPE (affirmative)

No named-character fates (roles only — the product-scope law). No CAD/manual
wall editing (deltas are intents, not geometry surgery). No real-world
architectural compliance. No generation-path writes. No theology in temples
(culture only). Not started, in any form, before the endgame completes.

## §14 · OPEN QUESTIONS (for DW-0)

Q1 the parti↔massing named-part seam's exact contract (law 9's exterior
consequences). Q2 whether the estate view is DW-6 or a fabric deliverable.
Q3 the news-emission threshold for renovations (what's newsworthy). Q4 the
free-tier depth (how much plan is free vs DM). Q5 fixture art direction
(abstract vs illustrated at the DM tier — owner taste).

---
*Architected 2026-08-23 from the owner–chair conversation at ODQ §435; the
conversation is this program's origin document. The ledger outranks this
summary where they ever disagree.*

---

## §15 · THE BUILD PATH — the map program's method, transposed counterpart-by-counterpart (owner-ordered, ODQ §436)

The map program's arc is the estate's proven method for building a
generation system that is TRUE rather than plausible. The DW program copies
that path exactly, each phase with its named counterpart and its gate.

| # | The map program did | The DW counterpart | Produces | Gate |
|---|---|---|---|---|
| P0 | The charter sitting (§150-§172): scope, delegation, prove-then-cut | **DW-0 the charter sitting** over THIS document | the signed bands (§11), the ruled open questions (§14) | owner sits it |
| P1a | — *(the map's research began at morphology; DW adds the deeper leg)* | **CONSTRUCTION-HISTORY RESEARCH: how dwellings, houses, and institutions were PHYSICALLY BUILT** — materials by region/prosperity (timber, cruck, masonry, wattle); the BAY SYSTEM (frame spans dictating room widths — the structural quantum under every historical plan); hearth-and-chimney evolution (the open hall → the stack → the parti consequences); load-bearing logic (which walls CAN move at renovation — law 5's physical basis); stairs' history (ladder→winder→spiral→grand as technology+status); urban customs (fire regs, party-wall law, burgage frontage taxes shaping narrow-deep plots); guild/institutional building practices (why a granary, temple, or bathhouse takes its form) | the CAUSAL substrate: grammars derived from WHY, not just measured WHAT — the mechanisms-travel law (the construction MECHANISM travels; the style doesn't) | owner taste-samples the dossier of findings (the CT-0 pattern) |
| P1b | The atlas corpus: ~400 plates, the HF corpus, owner-gated | **the measured-plan corpus**: hall houses, longhouses, burgage plots, tenements, courtyard houses, temples, inns, shops, workshops — scanned/measured historical floor plans per band and culture | the parti catalog, function vocabulary, roster drafts (§8) | owner taste-gates per tranche |
| P1c | The grain instruments (MFS1/HFM1: cell pitch, parcel density measured per band, windows re-set per analyst) | **the plan-measurement instruments**: room-size and aspect distributions, function-adjacency frequencies, storey-height ranges, bay widths — measured off the corpus per prosperity band and culture | the owner-signed bands get MEASURED priors, never invented ones | instrument receipts, re-runnable |
| P1d | G-43 the counterfactual benchmark; G-39 refuted by PRE-REGISTERED rules | **the DW benchmark**: the generator's output distributions tested against the corpus distributions (room sizes, adjacencies, parti frequencies) with refutation rules REGISTERED BEFORE generation; a blind real-vs-generated plan panel as the taste arm | the honesty instrument that keeps the grammar from drifting stylish-but-false | pre-registration precedes any tuning of weights |
| P2 | The sandbox: D0 kernel, D1 foundations at ZERO bytes (the ABI), W1-W3 mechanism waves, zoom findings, SW seals (5/5 worlds), the preserved ref | **the DW sandbox** (own worktree, no repo bytes): the partition/parti kernel proven over real fabric parcel polygons; **the DW ABI at zero bytes** (the plan-record and coordinate contracts frozen first); mechanism waves (partis firing, circulation totality, fixtures, undercity links); **the seal counterpart: N full settlements' ENTIRE building stock derived, forensically zoomed, sealed** | proven-in-isolation machinery + sealed evidence, preserved at a ref | SW-style gates; the seal precedes any port |
| P3 | GENERATION-SPEC as the build sheet (the volume; §10 corrections; architected≠built) | **DWELLING-SPEC.md as the DW build sheet** (its own volume beside the corpus): the laws of §2 elaborated to buildable contracts, ODQ rulings folded, architected-vs-built ALWAYS marked | the volume the compile prices against | chair-signed; live code outranks it |
| P4 | MF-PREAMBLE chair-signed (the stamp); the TC-D3A plan compile measuring everything (14,230 eff, per-member pricing, R-MF refutations) | **DW-PREAMBLE** (family law: the nine laws as binding refutation-style rules) + **the TC-DW plan compile**: sandbox measured, members priced, per-member census/manifest predictions | the member roster with honest prices | the compile's own executed figures |
| P5 | The port: member-by-member, TOTAL sealed equivalence, dormancy proofs, deferred rows, the landing cascade | **the DW port**: members land DARK with sealed-equivalence discipline against the DW sandbox; the click surface stays unwired | the landed program, inert | every member's own gate; the estate's full landing law |
| P6 | D3b — the activation wave; prove-then-cut vs legacy | **DW ACTIVATION**: the click surface lights; the exhibit gate is the owner's before/after sitting (no legacy to cut — the cut counterpart is the blind-panel benchmark passing + the owner's word) | interiors LIVE | owner exhibit + veto window |
| P7 | The tuning pass gains the MAP LEG (§341) | **the tuning pass gains the INTERIORS LEG**: plan-lawfulness and distribution drift read at tuning checkpoints | interiors inside the world's health metrics | owner-signed tuning, as ever |
| P8 | V5 visual counsel; the watercolor lens; style waves post-soak | **the DW style waves**: render lenses for plans (ink, parchment, cutaway — the Yoshida taste target) after mechanics prove | the charm layer, last, on proven bones | owner taste |

**The one law this table exists to carry:** the map program succeeded because
RESEARCH preceded GRAMMAR, the SANDBOX preceded the PORT, the SEAL preceded
the LANDING, and ACTIVATION came last behind an exhibit — truth first, charm
last. The DW program inherits that spine unchanged, and adds P1a because a
floor plan's honesty lives one level deeper than a town plan's: in HOW the
building could actually have been built.

---

## §16 · INTEGRATION CARRY-NOTES (planted into the current arc, ODQ §437)

1. **The undercity train** (draft-UNDERCITY-PLAN.md): the connectivity
   graph's record shape gains a stated FUTURE CONSUMER — DW law 7 projects
   the graph into floor plans; the graph's rows must remain per-building
   addressable (anchor → building id) so the projection needs no re-shape.
2. **The D3A/fabric plan**: law 9's exterior-consequences seam (a parti as a
   named massing part) is carried beside the tierGrammar note — the D5
   strata wave designs part-naming so DW can later bind interiors to named
   parts without a massing re-shape.
3. **The endgame tuning design**: the tuning pass's leg architecture (the
   §341 map leg) is built leg-EXTENSIBLE, so the DW interiors leg (P7)
   attaches later without re-architecture.
4. **The research lanes** (TC-DWR*) write ONLY to the scratchpad/ledger-doc
   surfaces; their dossiers are owner taste-gated before any grammar work.
