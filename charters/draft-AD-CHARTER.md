# AD-0 — THE ILLUSTRATED ART DIRECTION CHARTER

**Lane:** TC-AD-COMPILE `[OPUS-RUN · FABLE-VALIDATION OWED]`
**Chartered by:** ODQ §514.4 (owner band B15, signed 2026-08-23 21:32 CDT: *"abstract now
but illustrated before launch"*), dispatched deliberately early at ODQ §523.6.
**Slot:** `claude/composite-r4` = `5055990a38a281b5a5f63648c74e65c0837de7ef` (MF-CG1, the
48th landing). Verified by `git rev-parse` as this lane's first act; the SLOT-FACTS card at
`695a70c5/scratchpad/SLOT-FACTS.md` is therefore LIVE and every shared fact below cites it
rather than re-deriving it.
**Method:** read-only. No worktree was created; every measurement is a `git show` /
`git grep` / `git ls-tree` against the slot's committed blobs. Nothing is committed.

---

## THE FIRST PARAGRAPH OF THIS CHARTER

The brief that dispatched this lane assumed the honest answer might be commissioned
artwork with a lead time of months. **It is not.** The estate already owns, already
landed and already ships a complete procedural illustrated-art pipeline: a glyph library,
a genre-door registry, a ground-dress layer, a season portrait, an AI re-skin wall, and —
dormant, fully tested, wired to nothing — an architectural grammar with a baked material
library. **The long-lead branch that would have set the schedule does not need to be
started at all.**

What *is* urgent is smaller, cheaper and entirely unlike artwork: **the estate ships
about 176 MB of images, textures, heraldic charges, heightmaps and video from `public/`,
and its own authoritative provenance inventory covers none of it.** That is the launch
risk in this program. It is a document-and-decide problem measured in days, not an
artwork problem measured in months — **and its last responsible moment is before the ONE
trailing OSR mint (G1), because a finding that arrives after the one regeneration cannot
be acted on without a second one.** It is row zero of §7, and the recommendation is to
start it today: the audit is read-only and competes with no build seat.

---

## CONTENTS

- **§0** — The measured ground: every drawing surface at file:line, what it emits, and
  what an illustrated version has to replace or overlay. The MP-1 and DW-6 seams named.
- **§1** — ⭐ **LEAD TIME AND PROVENANCE**, first because it is the risk. The four honest
  options priced; the recommendation; the last responsible moment.
- **§2** — The art direction itself: what "illustrated" means here, in the owner's
  register, across the 2D pane, the PDF, the Foundry export and the 3D massing.
- **§3** — The asset architecture: how a motif is addressed by DW-1's closed
  vocabularies, the honest fallback, and the determinism rule.
- **§4** — The pipeline: authoring, review, storage, size budget, build-time versus
  run-time.
- **§5** — The waves and cars, in PACKET_STANDARD form, with dependencies, acceptance
  shapes and declared shifts — and which cars may start before the DW waves land.
- **§6** — Anti-scope, stated affirmatively.
- **§7** — The owner's decisions, as a sitting sheet. Each row marked measured / sourced
  / taste / deferred, with a recommendation. **Row zero is the provenance choice.**
- **§8** — Ledger: open questions, single-sourced claims, deferrals, judgments.

---

## §0 · THE MEASURED GROUND

Every claim in this section is a read at the slot. Where a figure came from the chair's
SLOT-FACTS card it is cited and not re-derived (ODQ §512).

### §0.1 · THE HEADLINE: AN ILLUSTRATED PROGRAM ALREADY EXISTS, IS LANDED, AND IS LIVE

`git grep -in 'illustrat' <slot> -- src` returns a whole shipped program, **THE
ILLUSTRATED TOWN (IT-1 … IT-5)**. It was not in the brief, it is not in the dwellings
charter's §0, and it changes what AD is for. Measured:

| Piece | Where | What it is |
|---|---|---|
| The lens | `src/design/townMapStyles.js:74` `ILLUSTRATED_STYLE_ID = 'illustrated'`; the definition at `:311-331` (the doc block) and the object at `:325` | A SIXTH lens, deliberately **outside** `TOWN_MAP_STYLE_IDS` because it re-shapes geometry rather than re-skinning it |
| Its reachability | `src/design/townMapStyles.js:78` `TOWN_MAP_LENS_IDS = [...five, illustrated]`, consumed at `src/components/townMap/SettlementMapPane.jsx:763` `styleIds={TOWN_MAP_LENS_IDS}` | **In the lens picker today.** A user can select it now |
| Its price | `src/config/entitlementLadder.js:37` `LENS_COUNT = TOWN_MAP_STYLE_IDS.length; // 5`, and the switcher renders **unconditionally** at `SettlementMapEditControls.jsx:79`, outside the `editing &&` block | **FREE, and the mechanism is §523.2's line exactly.** The paid "all five lenses" row counts the re-skins and illustrated is not in it; the switcher's own header states it is *"shown for EVERY viewer (switching is instant + free — a derived view); the choice PERSISTS only when the pane can edit"*. **Viewing the lens is free; persisting the choice is authoring and is gated.** ⚠ Minor doc drift found in passing: that header still says "the four named lenses" and there are six |
| The glyph registry | `src/design/townGlyphs/index.js:26` `GLYPH_SET_IDS = ['medieval']`, `:29` `FALLBACK_GLYPH_KIND = 'house-a'`, `:45` `registerGlyphSet(id, lib)` | A **GENRE DOOR**: a sci-fi / desert / gothic pack is a data module of the same shape plus a palette, zero engine change |
| The glyph library | `src/design/townGlyphs/medieval.js`, **15,837 B**, **27 glyph kinds** | Buildings as small OBLIQUE ELEVATIONS. `house-a/b/c · massing · spire · small-spire · wheelhouse · forge · signpost-house · towered-keep · stall-rows · gambrel-store · quay-shed · manor-hall · moot-hall · mage-tower · caravan-house · kiln-yard · barracks · watchtower · guildhall · archive-hall · farmstead · graveyard-chapel · encampment · ruin-shell · workshop` |
| The compiler | `src/design/townGlyphs/glyphCompiler.js` (8,547 B) — `compileGlyph`, `compileGlyphFacade`, `GLYPH_FOOTPRINT`, `SHADOW_DIR` | Places, scales, mirrors a local 0..1 box and emits primitive ops. Five stroke roles: `face · roof · ink · line · circle` |
| The assignment | `src/domain/townMap/glyphAssign.js:120-151` | A five-step deterministic waterfall: fill-mass LOD → an admitted authored glyph → 18 exact NAME regexes (`:90-109`) → the 12-category default (`:39-52`) → a seeded house variant. Mirror bit and variant seeded off the building's stable anchor through `createPRNG` |
| The ground dress | `src/domain/townMap/groundDress.js` (33,423 B, IT-2) | Farm furrows, woods stipple, water ripples, meadow, hedges, wall shadows. Gated on `style.opacity.dress` / `style.stroke.dress`, which **only** the illustrated lens names — every other lens emits ZERO dress ops and stays byte-identical |
| The season portrait | `src/domain/townMap/mapDress.js:132` `resolveMapDress(settlement, worldState, regionalGraph)` (IT-3) | A bounded `MapDress` from the live clock, severity, scars, rebirth and festival week; absent ⇒ byte-identical seasonless bytes (the dormancy law) |
| The AI re-skin wall | `src/design/townMapStyleWall.js` (13,530 B, IT-4) | `validateBespokeStyle`: a style may **SELECT** a hex, a numeric weight, a furniture kind, a glyph-set id, a season bias — **never** arbitrary SVG, code, geometry or substance. Every rejected field is listed honestly. "Worst case a style is ugly; never unsafe" |
| The skin registry | `src/components/townMap/useActiveSkin.js` (IT-4) | Saved bespoke skins resolved through the settlement's own edits |
| The underlay | `src/components/townMap/SettlementMapIllustratedUnderlay.jsx` (IT-1), mounted at `SettlementMapPane.jsx:474` | A static, pointer-events-off `<g data-town-illustrated>` UNDER the interactive layers, whose fills go transparent for hit-testing (`:617-619`). **The pane does not re-implement the art in JSX** |

**The single most consequential architectural fact in this charter:**
`buildTownMapDrawList` (`src/domain/townMap/townMapDraw.js`, 27,761 B; the glyph branch
imports at `:51-52`) is **the ONE geometry source**, and it feeds every 2D surface:

- the on-screen pane, through the underlay leaf;
- the SVG / PNG / JPEG / WebP file exports (`src/lib/townMapExport.js`);
- the single-map PDF (`src/pdf/TownMapDocument.jsx`, via the shared `renderTownMapOp`
  exported from `src/pdf/sections/TownMapPlate.jsx` — "one op-to-primitive mapping, no
  drift");
- the dossier's embedded 08C plate;
- the card thumbnail (`src/components/townMap/SettlementCardMapThumb.jsx`);
- the VTT token raster.

So **art authored once as glyph strokes reaches the screen, the file, the print page and
the thumbnail with no second implementation and no possibility of divergence.** That is
the property AD must not break, and it is the reason the recommended route in §1 is the
one the estate has already built.

### §0.2 · WHAT IS *NOT* ILLUSTRATED — the four surfaces AD is actually for

| Surface | Where | What it emits today | What "illustrated" must replace or overlay |
|---|---|---|---|
| **The interior plan** | `src/domain/interior/interiorDraw.js` | Rooms as tinted rects, walls as lines, doors as threshold marks — and, at **`:80-81`**, *"furnishings — **a small square per typed piece**, floor-tinted with an ink edge"* | This IS band B15's subject. 22 furnishing kinds, all drawn as one square. A typed MOTIF per fixture kind, in the glyph idiom, at plan scale |
| **The 3D diorama** | `src/components/townMap/scene3d/townSceneRuntimeMaterials.js` (live theme tokens) and `src/domain/townScene/sceneExportPalette.js` (frozen export skin) | Flat semantic albedo per material role — `terrain · road · wall · building · water · vegetation · living`. No texture, no weathering | Either leave it flat and honest, or wake the dormant material library in §0.3. It must not disagree with the plans (§2.5) |
| **The DW-6 cartography surface** | `src/domain/townCartography/cartographyPaint.js` | **Colour-free** ops: `ward{polygon, role, tonePermille}` · `street{polyline, classKind, widthPlan, weightPermille, role}` · `building{polygon, role, tonePermille, condition}` (typedefs at `:52-58`) | There is **no glyph path here at all.** This stack is a different, parallel painter from the live `townMapDraw` one |
| **The parcel / estate layer** | not yet emitted; MP-1 adds the first `parcel` op | `parcels[]` is READ but emits no op (`cartographyPaint.js:19-21`: *"a parcel is a placement SLOT, not a drawn thing"*) | The property line, the yard, the estate ring — MP-1 then DW-6d |

### §0.3 · THE DORMANT ASSET: A FULL ARCHITECTURAL GRAMMAR, BUILT AND WIRED TO NOTHING

`src/domain/townMap/arch/` is a **37-file, 331,627 B** architectural grammar — the K-tranche —
with **zero importers anywhere in `src/`.** Measured: `git grep` for every arch module
name across `src`, `tests` and `scripts` returns production hits only from
`scripts/generate-k0-spike.mjs`, `generate-k0b.mjs`, `generate-k1.mjs`, `generate-k2.mjs`
and the observed-shape-readers baseline. It carries **19** test files under
`tests/architecture/` and its own first-paint lazy pin (`tests/build/archKernelLazy.test.js`).

What is in it:

- **`arch/materials/materials.js`** — *"the ILLUSTRATED MATERIAL LIBRARY"*: eleven
  materials (`stoneAshlar`, `timberFrame`, `brick`, …) crossed with six weathering
  classes, each a deterministic recipe — a pinned linear-RGB palette plus a
  hash-procedural texture, **CPU-baked into a byte-deterministic tiling texture**. Its
  own header states the Promise binding: *"the baked bytes are the truth (THE PROMISE
  binds them), and the live viewer only samples them."*
- **`arch/materials/skins.js`** — maps the twelve K-1 material ROLES onto those
  materials, so any skin dresses any shape.
- **`arch/kit.js`** — an INSTANCED-ASSET registry: a kit asset is a pure function
  `(aabb, role) -> terminal specs`, so one authored piece draws many times.
- **`arch/rulesets/`** — `cathedral.js`, `roseWindow.js`, `vaultBay.js`,
  `buttressFragment.js`, `evilChapel.js`, `traceryFamilies.js`.
- **ONE NW KEY LIGHT** shared by the material bakes and the 2D glyph hatch
  (`rationalTables.LIGHT`; `groundDress.js:15` says the dress marks share it too), so the
  2D and 3D planes are already lit consistently.
- Purity: `{+,-,*,/}` plus `sqrt/floor/min/max/abs` and integer hashing, **zero
  transcendental sites**, bound by a ratchet. Same `(materialId, weathering, size)` gives
  byte-identical texture cross-engine.

`docs/KERNEL_K1_BUDGET_SHEET.md` carries the measured envelope on the owner's own M1:
the K-1 cathedral is 108 / 396 / 2,172 triangles at LOD 0 / 1 / 2, 42 draw calls at
signature against a ~200 ceiling, **and "eager bytes (first paint): +0 (dormant kernel)"**
against a 1,040,000 B hard budget.

The dormancy is deliberate and law-backed: `townMapStyles.js:97` declares an optional
`massingSet` field — *"a registered massing-set id (a dimensional view, TRANCHE M); absent
on every shipped lens implies glyph facades / flat rects (the dormancy law)."* **The
socket for a dimensional illustrated view is cut and no lens plugs into it.**

### §0.4 · THE SEAMS, NAMED

Three surfaces are shared with live or in-flight programs. Naming them here is what keeps
AD from discovering them later.

| Seam | Shared with | The rule |
|---|---|---|
| **The painter's length identity** | MP-1, then DW-6d | `cartographyPaint.js:15-17` asserts `ops.length === wards + arterials + lanes + buildings`. Charter §0 H25 corrected §495.4(a): a new op is **not** a free insertion, it is an IDENTITY edit, and every test pinning it moves. MP-1 pays that cost once for `parcel`; DW-6d pays it again for `estate`/`member`. **AD adds NO op to this painter** (§6) |
| **The property-line layer** | MP-1 (§495, dispatched §522.6) | MP-1 draws the parcel polygon, hover/pin halo and the yard as parcel-minus-footprint. §522.6 binds DW-6 to **re-point it by changing its INPUT, never rebuilding it**. AD inherits the same discipline: AD may change what a layer is *drawn like*, never where it comes from |
| **The DW-6 projection wave** | DW-6a..e | `DW-6a` the on-click plan pane · `6b` the PDF chapter · `6c` Foundry scenes with wall data · `6d` the parcel ring and compound members · `6e` the estate view. **AD lands at this seam** (§514.4). Every AD car that touches an interior surface therefore either precedes DW-6a as pure data, or follows it as a consumer |

### §0.5 · WHAT AN "ABSTRACT" MAP IS COMPOSED OF RIGHT NOW

For the record, so the before/after is a measurement and not an impression. Under the
five re-skin lenses the town map is: a background wash; water polygons; the landform mark
layer; roads and skeleton streets as stroked polylines; district polygons with a tint and
an accent; fortification wall rings and gate marks; **buildings as rectangles** with a
category colour; hazard and anchor marker glyphs from `HAZARD_GLYPHS` /
`ANCHOR_GLYPHS` (`townMapStyles.js:43,46`); an aged-paper cartouche and compass frame;
optional grid and scale bar.

Under the illustrated lens the water, landform, roads, skeleton streets, district fills
and fortifications are all **suppressed** (`SettlementMapPane.jsx:481, 502, 505, 514,
521, 550, 590`) because the underlay draws them; building rects go transparent with a
stroke-only hit target (`:617-619`); and the underlay supplies glyph elevations, ground
dress and the season portrait in their place.

The interior is: floor rects, room washes, wall lines, door thresholds, and one small
square per furnishing.

## §1 · LEAD TIME AND PROVENANCE — FIRST, BECAUSE IT IS THE RISK

### §1.0 · THE ANSWER, BEFORE THE REASONING

> **Recommendation: build AD entirely on the estate's own procedurally-composed primitives
> — the glyph library, the ground dress and the dormant material grammar — and buy nothing
> that ships in the product. No commissioned artwork and no licensed asset pack enters the
> render path at any tier.**
>
> **There is therefore no long-lead branch on the critical path.** The only item in this
> program whose clock is measured in weeks rather than days is the **provenance audit and
> remediation of the roughly 176 MB of images, textures, heraldic charges, heightmaps and
> video the estate already ships from `public/`** — none of which appears in
> `THIRD-PARTY-NOTICES.md`. That is not artwork to be made; it is paperwork to be closed,
> and it is a launch blocker whether or not AD exists.
>
> **The last responsible moment to start it is the moment the DW arc's last car lands** —
> concretely, before the ONE trailing OSR mint (G1 in §499.2), because the tail after that
> point is mint, parity, review keystroke, walk, one regen, a 300-year soak, the tuning
> pass and the owner's signature, and the V5 / cull / **IP scrub** step sits at the very
> end with no slack behind it. If the audit finds a single asset that must be replaced,
> the replacement has to be authored, reviewed and landed *before* the one regen, or it
> forces a second one — which the tail order does not have room for (charter §7's
> scheduling decision, ratified at §506).
>
> **Started sooner is strictly better and costs almost nothing:** the audit is read-only,
> needs no seat that a build car wants, and can run in a research seat today. **The
> recommendation is to start it now and treat the last-responsible-moment date as the
> deadline it must not reach, not the date to begin.**

### §1.1 · THE FOUR OPTIONS, PRICED

The four options the dispatch named, each measured against six columns. Cost shape and
lead time are the lane's estimates and are marked as such; every other column is a
measured or sourced fact with its citation.

#### (a) PROCEDURALLY COMPOSED FROM PRIMITIVES THE ESTATE AUTHORS — **the recommendation**

| | |
|---|---|
| **What it is** | A motif is a named list of primitive strokes in a local unit box, compiled at draw time into the same op vocabulary every surface already renders. This is exactly what `medieval.js` is |
| **Cost shape** | Author-time only, denominated in engineer-hours, and it amortises: the 27 shipped glyphs cost **15,837 B of source** — about 590 B and a handful of coordinate pairs each. Marginal cost per new motif is roughly constant and small |
| **Lead time** | Days per tranche, and **parallelisable across lanes**, because each motif is an independent frozen data literal in one file with no cross-motif coupling |
| **Licensing and provenance risk** | **ZERO.** The estate authors it; nothing enters `THIRD-PARTY-NOTICES.md`; nothing can be sub-licensed away from us and nothing needs sub-licensing to a user |
| **Survives SETTING-AGNOSTIC?** | **YES, and it is the only option that does structurally.** `registerGlyphSet(id, lib)` is the genre door: a desert, sci-fi, gothic or cloud-world pack is a new data module of the same shape plus a palette, **zero engine change** (`townGlyphs/index.js:6-9`). The shipped `medieval` set is a default, not a commitment |
| **Deterministically regenerable?** | **YES, by construction.** Pure functions of `(model, style, dress)`; the mirror bit and house variant seeded off the building's stable anchor through `createPRNG`; the domain purity scan bans `Math.random`. The 3D half is stronger still: `arch/materials/materials.js` bakes byte-deterministic tiling textures cross-engine, and its header states the Promise binds those bytes |
| **The property that decides it** | It preserves the ONE-GEOMETRY invariant of §0.1. Art authored as strokes reaches pane, SVG, PNG, PDF, thumbnail and token raster through `buildTownMapDrawList` with **no second implementation**. Every other option needs a parallel raster path and re-opens the divergence this architecture closed |

#### (b) COMMISSIONED ORIGINAL ART

| | |
|---|---|
| **What it is** | Hire an illustrator or cartographer to draw a style bible and a motif set |
| **Cost shape** | A four-figure-and-up cash outlay per genre, plus a revision cycle, plus a contract. *Lane estimate; the estate has no procurement record to measure against* |
| **Lead time** | **Months**, and serial: brief, sketches, revisions, delivery, integration. This is the branch the dispatch feared and it is the one we do not need |
| **Licensing and provenance risk** | **Moderate and manageable if and only if the contract assigns copyright outright rather than licensing it**, because the product's export lane hands the rendered artwork to the user as a file they may redistribute (§1.3). A work-for-hire assignment closes that; a licence usually does not |
| **Survives SETTING-AGNOSTIC?** | **NO, not as a single commission.** A commissioned style is one genre. Setting-agnosticism would need N commissions, multiplying both cost and lead time by N |
| **Deterministically regenerable?** | **NO, in the sense the Promise means.** A delivered PNG or SVG is a fixed artefact, not a function of the seed. It can be *stored* and replayed byte-identically, but it cannot be *re-derived*, so a lost or corrupted asset is unrecoverable and a new vocabulary member has no asset until someone is paid to draw one |
| **Where it still has a real role** | **As direction, not as assets.** A one-off paid review by a working cartographer — "here is our glyph set, tell us where it reads wrong" — buys most of the craft benefit at a fraction of the cost and lead time, delivers notes rather than files, and creates no licensing surface at all. Recommended as an OPTIONAL row in §7, not as the program |

#### (c) LICENSED ASSET PACKS

| | |
|---|---|
| **What it is** | Buy a commercial or free cartography/icon pack and render its images |
| **Cost shape** | Low cash (tens to low hundreds), which is exactly why it looks attractive |
| **Lead time** | Days |
| **Licensing and provenance risk** | ⛔ **THE HIGHEST OF THE FOUR, AND IT IS STRUCTURAL, NOT INCIDENTAL.** SettlementForge is precisely the product shape mainstream asset licences carve out. Sourced this session from the Unity Asset Store EULA FAQ (fetched 2026-08-24): a product is not "incorporated" for licence purposes if it is `"designed to allow your end users to extract or download assets separately"`, and a licensed product may **not** be designed to let its end users make their own games or digital products without separate permission from the publisher. **Our SVG / PNG / PDF / UVTT export lane is designed to do the first, and the product exists to do the second.** ⛔ **AND THE OWNER SHARPENED THIS WHILE THIS CHARTER WAS BEING WRITTEN.** ODQ **§524.1** (2026-08-23 22:45 CDT) rules that exporting the map is **PAID**, riding the existing `$2.99` single-dossier purchase, and **§524.4** makes the paywall line a trichotomy: **VIEW / INTERACT free, AUTHOR paid, TAKE AWAY paid**. So the export is not merely redistribution of a licensed asset — **it is the sale of a derivative work containing it, to an anonymous purchaser who needs no account** (`pricing.js:297-304`, `requiresAccount: false`). That moves this option from awkward to unbuyable The same shape recurs across stock-asset terms generally (search digest, 2026-08-24, several vendors): use in a finished end product is allowed; redistribution of the raw asset, and use in tools where end users generate their own designs, is not |
| **The honest steelman** | **CC0 / public-domain packs escape all of that** — a CC0 cartography pack (search digest 2026-08-24; Kenney's Cartography Pack, ~85 assets, is the best-known example) permits commercial use, modification and redistribution with no attribution. This branch is legally clean. It fails on the other four columns instead: it is raster or flat-vector art that breaks the one-geometry property, it costs payload bytes against a measured first-paint budget, it is one visual genre so it fails setting-agnosticism the same way a commission does, **and a generic 85-icon pack cannot render this product's actual vocabulary** — there is no `tenter strip`, no `bee bole`, no `quench pit`, no `stokehole as large as the oven` in any general-purpose pack, because those come out of DWR1A and R-INST-2 and exist nowhere else |
| **Deterministically regenerable?** | **NO.** Same as (b) |

#### (d) AI-GENERATED ASSETS

| | |
|---|---|
| **What it is** | Generate motifs, textures or plates with an image model |
| **Cost shape** | Very low cash, very low lead time |
| **Licensing and provenance risk** | **Unsettled in general, and the estate has already ruled on it in the one place it matters.** Owner ruling **C13** makes the slate token family *the single marker for AI-authored surfaces* (`cartographyColours.js:36-38`; the fenced families are named there and their values deliberately never spelled). **THE WALL** (`townMapStyleWall.js`) already governs the AI's relationship to map art and the answer it gives is unambiguous: an AI may **SELECT** a hex, a numeric weight, a furniture kind, a registered glyph-set id and a season bias; it may **never author geometry**, arbitrary SVG, code or substance, and every rejected field is listed honestly. `townGlyphs/index.js:8-9` records the corollary as a named deferral: *AI-authored glyph geometry is deferred to the trust ladder (design §5, S4+)* |
| **Survives SETTING-AGNOSTIC?** | Nominally yes — a model will draw any genre — but with a specific hazard this product cannot accept: **image models reproduce trademarked creatures and named-setting iconography on ordinary prompts**, and the SETTING-AGNOSTIC law (`product-scope-boundaries`, 6th boundary) plus the cloud-world test exist precisely to keep that out. Policing it is a per-asset human review with no test that can automate it |
| **Deterministically regenerable?** | **NO.** A hosted image model is not a pure function of a seed, is not available offline, and is not stable across provider versions. **This is the disqualifier under the Promise** for anything on the render path |
| **Where it already is, and what that means** | The estate **already ships** AI-generated media: `public/videos/realm-journey.mp4` (20,715,193 B) plus six `public/media/journey-legs/bg/leg-*.mp4` (42,106,547 B) and their seven paired still frames (2,494,909 B) are landing-page background media, and `public/landing-maps/**` holds 68,558,483 B of exhibit plates. **Those are marketing chrome, outside the render path, and the distinction is the rule AD should adopt:** an AI-generated asset may sit on a marketing surface where it is a fixed artefact nobody regenerates; it may not sit inside a deterministic derivation the Promise binds |

### §1.2 · THE PROVENANCE AUDIT — WHAT IS ACTUALLY MEASURED TODAY, AND WHAT IS NOT

This is the finding that makes provenance a first-class section rather than an appendix,
and it is a measurement, not a worry.

**`THIRD-PARTY-NOTICES.md` is a genuinely excellent document.** 521 lines, five sections,
and its own opening states that every licence identifier was read out of the artefact
rather than taken on trust. It covers:

1. **the vendored Fantasy Map Generator fork** under `public/map/` — rev `sfdrop16`, MIT
   with an added derivative-works clause, reproduced in full from
   `public/map/LICENSE-FMG.txt`, plus the libraries vendored inside it pinned by SHA-256
   in `public/map/libs/VENDOR-MANIFEST.json`;
2. **the fonts** under `public/fonts/` — Lora and Nunito, SIL Open Font Licence 1.1, with
   `public/fonts/OFL.txt` complete and the copyright strings read out of each file's own
   embedded name table;
3. **the complete production npm dependency tree** at locked versions.

It also already records its own known gaps honestly: **its own** §1.5 lists nine vendored libraries
shipped with no notice at all, its own §1.4 leaves TinyMCE's GPL-2.0-or-later posture open for
counsel (ODQ §254.5.5 and §295), and its own §1.6 records an upstream chat widget still served.

⛔ **AND IT CONTAINS NO ART.** Measured at the slot by grepping the document itself:

| Term | Hits in `THIRD-PARTY-NOTICES.md` |
|---|---|
| `texture` | **0** |
| `heightmap` | **0** |
| `heraldr` | **0** |
| `.png` / `.jpg` / `.svg` / `.mp4` | **0** |
| `artwork` / `illustration` | **0** |
| `charge` | 3 — **all three inside MIT licence boilerplate** ("free of charge") |
| `video` | 1 — inside the FMG derivative-works clause, not as an inventory row |

What that leaves un-inventoried, measured by `git ls-tree -r -l` at the slot:

| Payload | Bytes | Files | Note |
|---|---|---|---|
| `public/landing-maps/**` | 68,558,483 | 80 | The K-tranche exhibit plates. **Almost certainly estate-generated** by `scripts/generate-k*.mjs` — but that is an inference from the filenames and the generator scripts, not a recorded provenance |
| `public/media/**` | 44,601,456 | 13 | Six journey-leg background videos (42,106,547 B) and seven paired still frames |
| `public/map/**` | 24,738,225 | 636 | The FMG fork. Code and libs are covered; **the art inside it is not** — see below |
| `public/videos/realm-journey.mp4` | 20,715,193 | 1 | Landing background video |
| `public/backgrounds/**` | 15,427,767 | 55 | The per-page painted backgrounds |
| `public/fonts/**` | 1,401,748 | 17 | **Covered and clean** |
| **`public/` total** | **176,499,727** | — | — |

Inside `public/map/` specifically, three art populations sit under an MIT notice written
for software:

- **`public/map/images/textures/` — 11,646,263 B in 23 files** (`soiled-paper-vertical.png`
  alone is 3,174,114 B; `plaster.jpg`, `folded-paper-big.jpg`, `marble-big.jpg`,
  `pergamena-small.jpg`, and so on).
- **`public/map/charges/` — 3,094,160 B in 338 heraldic charge SVGs** (`peacockInPride.svg`,
  `oak.svg`, …).
- **`public/map/heightmaps/` — 1,224,885 B in 24 files, 23 of them PNGs of REAL-WORLD
  geography** (`world.png`, `europe.png`, `north-america.png`, `east-asia.png`,
  `iceland.png`, `greenland.png`, `middle-east.png`, `mediterranean-sea.png`, …).

**The mechanism of the risk, stated plainly.** The FMG licence is MIT over "the Software
and associated documentation files", widened by the upstream author to grant derivative
works including "created maps, map images, screenshots, videos, and other materials". That
is a strong grant *from Azgaar*. It is only as strong as Azgaar's own rights in the
bundled art. Upstream open-source map generators routinely bundle textures and heraldic
charge libraries sourced from elsewhere, and an MIT header at the repository root does not
retroactively acquire rights the packager never held. **We have not checked, and the
notices file does not claim to have checked.** *(This is a stated inference about
mechanism, not a finding that any specific asset is infringing — see §8.)*

And `public/BACKGROUND.md`, which documents the page paintings thoroughly on every other
axis, records their provenance as exactly one clause: *"Source paintings were ~3 MB PNGs."*
Who painted them is not written down anywhere in the tree.

**Why this is AD's problem and not somebody else's.** Because AD is the program that makes
art a first-class subject, and because ODQ §523.6 named it. The estate already carries
an IP-exposure item (`ip-exposure-measured-2026-08-07`) whose conclusion is that **the
corpus is the moat and the code is not** — 9,428 authored sentences are copyrightable
expression while mechanics and weights are not. Art is the same category as the corpus:
it is expression, it is the thing a competitor cannot cheaply clone, and it is therefore
also the thing on which *someone else's* claim would be strongest. A program that adds art
without closing the inventory on the art already shipped is building on an unmeasured
foundation.

### §1.3 · THE FIVE TESTS EVERY CANDIDATE ASSET MUST PASS

Stated once here so no later car re-derives them, and so §7's row zero has a rubric.

1. **THE PROMISE TEST.** *A seed is a starting world forever.* An asset on the render path
   must be either (i) a pure function of the seed and the model, or (ii) a byte-frozen
   artefact committed to the tree and pinned. Anything that must be *fetched* or
   *re-generated by a third party* fails, because a world that cannot be redrawn is a
   world that was not preserved.
2. **THE ONE-GEOMETRY TEST.** The asset must reach the pane, the file exports, the PDF and
   the thumbnail through `buildTownMapDrawList` (2D) or the manifest (3D) — never through
   a parallel path only one surface knows about. §0.1 is the invariant; a raster overlay
   that only the browser can composite breaks the PDF and the print page silently.
3. **THE SETTING-AGNOSTIC TEST (the cloud-world test).** Would this asset still be right
   in a world made entirely of clouds? If not, it must live behind the genre door as a
   *named set*, never in the engine. A shipped default is fine; a hard-coded assumption is
   not. And no named setting, no trademarked creature, ever.
4. **THE EXPORT-REDISTRIBUTION TEST.** Every drawn thing in this product ends up in a file
   the user owns and may hand to their table, publish, or sell inside their own campaign
   material — and since **ODQ §524** that file is something the estate **charges for**
   (the take-away arm of the trichotomy). **An asset whose licence does not permit that
   chain must not be drawn.** This is the test that eliminates ordinary licensed packs
   (option (c) of §1.1) and it is the one most easily forgotten, because the pane looks
   fine.
5. **THE NOTICES TEST.** Every third-party asset that ships has a row in
   `THIRD-PARTY-NOTICES.md` naming what it is, where it came from, under what terms, and
   with the licence text served alongside it where the licence asks for that. **No row,
   no ship.** This is the test that turns §1.2 from a finding into machinery (§4.4).

### §1.4 · THE RECOMMENDATION, WITH THE REASONING

**Build on (a). Buy nothing that ships. Keep (b) only as paid direction, never as paid
assets. Refuse (c) outright except for CC0, and refuse even CC0 on the render path.
Confine (d) to marketing chrome, exactly where it already is.**

The reasoning, in order of weight:

1. **The Promise decides it before anything else does.** Three of the four options produce
   artefacts that cannot be re-derived from a seed. The estate's constitutional
   commitment is that a seed is a starting world forever; the material library's own
   header already binds its baked bytes to that promise. Any option that puts an
   un-re-derivable artefact inside a deterministic derivation is not a cheaper route to
   the same product — it is a different product.
2. **The one-geometry property is worth more than the art.** It is the reason a
   SettlementForge map is identical on screen, in the PDF, in the thumbnail and in the
   VTT scene. Every purchased-asset route reintroduces a second render path. That is
   precisely the class of bug this estate spends its review budget preventing.
3. **The setting-agnostic law makes single-genre art a liability, not an asset.** The
   genre door already exists and costs nothing per pack. A commission or a pack buys one
   genre and forecloses the mechanism.
4. **The work is largely done.** 27 glyphs, a ground-dress layer, a season portrait, an AI
   re-skin wall, a material library with eleven materials and six weathering classes, an
   instanced-asset kit, and a measured budget sheet showing 69x triangle headroom and
   +0 first-paint bytes. AD's job is to *extend and wire* that, not to originate it.
5. **The cash saved is not the point; the schedule saved is.** Choosing (a) removes the
   only branch that could have put months between the dwellings arc and the push. That is
   the sentence the chair asked for.

**What the recommendation deliberately gives up, stated honestly.** Procedural glyph art
has a ceiling. It will never be a painted map. A working cartographer looking at
`medieval.js` would see a competent, legible, consistent hand — not a beautiful one. The
owner's positioning note (§454.4) asks for artwork that "should give it something to
compete against all aesthetically at a very reasonable price", and (a) is emphatically
the *reasonable price* half. The craft half is bought back by the optional paid-direction
row in §7 and by the density and hand-quality decisions in §2, not by buying files.

### §1.5 · THE LAST RESPONSIBLE MOMENT, DERIVED

There are two clocks, and only one of them is long.

**Clock 1 — the art itself. There is no long-lead branch.** Under the recommendation
every AD car is engineer-time on estate-authored data files. The binding constraint is not
lead time at all; it is the **single landing seat** and the **one-regen rule**. Every AD
car that changes what is drawn must land before the ONE REGEN, for the same reason the
ESTATE wave must (charter §7's scheduling decision, ratified §506): the endgame tail has
room for exactly one regeneration. **The last responsible moment for the last
shift-bearing AD car is therefore the last landing slot before G1, the trailing OSR mint.**

**Clock 2 — the provenance audit. This is the one with a real deadline.** Its terminal
consumer is the **V5 / cull / IP scrub** step, which sits at the very end of the endgame
tail with nothing behind it but the push:

```
… DW-S -> AD -> content train -> G1 the ONE trailing OSR mint -> G2 parity
   -> H /code-review ultra -> walk -> ONE REGEN -> the 300-year soak
   -> the tuning pass -> the owner's signature -> V5 / cull / IP SCRUB -> PUSH
```

If the audit runs at the IP-scrub step and finds a replaceable asset, the replacement is
cheap. **If it finds an asset that is drawn into settlement output — a texture composited
into a map, a charge rendered into a dossier — then replacing it changes what the engine
draws, and that is a same-seed shift arriving after the one regen.** The tail cannot
absorb it.

> **THE LAST RESPONSIBLE MOMENT TO START THE PROVENANCE AUDIT IS BEFORE THE ONE TRAILING
> OSR MINT (G1) — that is, while the DW arc still has landing slots ahead of it. Started
> after that, a single bad finding forces a second regeneration and re-opens the endgame
> tail.**
>
> **AD-1 (§5) is the car that does it, it depends on nothing, and it can dispatch into the
> next free research seat today.** The lane's recommendation is to run it now: it is
> read-only, it competes with no build car, and every week it runs early is a week of
> slack on the only clock in this program that has any.

## §2 · THE ART DIRECTION ITSELF

### §2.1 · THE THREE REGISTERS, AND WHY ONE OF THEM IS ALREADY CHOSEN

The dispatch named three candidate registers. They are not equally open, because the
estate has already committed to one of them on its largest surface and the commitment is
load-bearing.

| Register | What it means | Verdict |
|---|---|---|
| **HAND-DRAWN CARTOGRAPHIC** — the tradition of estate maps, city plans, bird's-flight views and enclosure awards: ink line, one light, oblique elevations, a lettered cartouche, restrained wash | Line is primary, colour is secondary, and the drawing is a *document* — a thing a clerk made to record what is there | ⭐ **ALREADY CHOSEN, AND CORRECTLY.** `medieval.js` is a bird's-flight vocabulary of oblique elevations lit from one fixed NW key; `ILLUSTRATED` inherits parchment's palette and its aged-paper cartouche and compass frame *"so the base map still reads as a hand-drawn chart"* (`townMapStyles.js:311-320`). **AD's job is to deepen this register, not to choose between three** |
| **PAINTERLY** — soft edges, tonal mass, atmosphere | Colour and value primary, line vestigial | ⛔ **REFUSED, on mechanism.** Painterly art is not composable from strokes; it is composited from rasters. It cannot survive the one-geometry test (§1.3.2) — the PDF plate and the token raster would need a second path — and it cannot express the DW vocabularies, because a mood cannot say *this cell is a `strongroom` and that fixture is a `tenter`* |
| **STYLISED GAME-MAP** — bold flat shapes, high-saturation category colour, chunky icons | Legibility at speed; the aesthetic of a strategy UI | **NOT AS THE DEFAULT, AND NOT REFUSED EITHER.** It is a legitimate *genre pack* (§3.4). The five re-skin lenses already reach partway there, and `vtt` is explicitly the functional one. Making it the default would discard the aged-paper identity the estate has built and would read as a different product |

**THE RULING (chair, vetoable):** **the register is HAND-DRAWN CARTOGRAPHIC — the clerk's
document, not the artist's picture.** Every AD decision below resolves toward that. Two
consequences follow immediately and they are worth stating because they save arguments
later:

- **Line before colour.** A motif must read at 100% grey. Colour carries *category*
  (which the district tint already does) and *condition* (which `tonePermille` already
  does); it never carries the thing itself. This is also what keeps the accessible lens
  and high-contrast mode honest without a parallel art set.
- **One light, everywhere.** The NW key is already shared by the glyph hatch, the ground
  dress and the 3D material bakes (`rationalTables.LIGHT`). Nothing AD adds may light
  itself. The reason is not consistency for its own sake: a second light source makes the
  2D plane and the 3D diorama disagree about which face of a building is in shadow, and a
  reader notices that instantly even when they cannot name it.

### §2.2 · WHAT "ILLUSTRATED" HAS TO BE ABLE TO EXPRESS

The register is only as good as the vocabulary it can articulate. The research corpus is
specific about what must be depictable, and this is the list an illustration is judged
against. **None of it is invented for AD; every row is a fact the engine already derives
or DW-1 will mint.**

**From DWR1A §2 — material as a wear-and-wealth skin over a stable plan.** The dossier's
own conclusion is the sentence AD should adopt verbatim: *material is a WEAR/WEALTH SKIN
over a stable plan grammar.* Concretely: cob (battered, over 600 mm, on a stone plinth) ·
timber frame with wattle-and-daub panels · brick nogging · rubble · coursed rubble ·
ashlar · thatch · tile · slate. And the status ladder is **date-dependent** — cob descends
from middling to poverty marker across the period; brick ascends. And material is **per
FACE, not per building**: ashlar *"often restricted to front walls, the back and even the
gables being of rubble."*

⭐ **This maps one-to-one onto machinery that already exists.** `arch/materials/materials.js`
is eleven materials crossed with six weathering classes, and `arch/materials/skins.js`
maps twelve material roles onto them. The research and the dormant code are describing the
same thing from two directions. That correspondence is the strongest single argument for
waking the material library rather than authoring a new one.

**From DWR1A §1, §5 and the charter §2 — the storey ladder.** Bay system as the structural
quantum; storey heights that **descend** by default (B7, signed: the Fortune contract of
8 January 1600 gives 12 ft, then 11 ft, then 9 ft); stairs as technology and status;
`TOWER_ONE_CELL_PER_STOREY`, `N_IDENTICAL_FLOORS`, `SHOPHOUSE_STACK`,
`STACKED_HALL_OVER_ARCADE`, `GREAT_HALL_OVER_CRYPT`. ⚠ **And the engine has none of it
today** — charter §0 H5: *"there are no storeys at all."* DW-2b mints `Storey[]`. **AD
cannot draw a storey before DW-2b lands, and every AD car that would must sit after it.**

**Roof forms.** The corpus carries roofs as consequences rather than as a closed enum —
gable, hipped, gambrel, spire, lean-to outshut, and the parti-driven exteriors B18 names
(the belfry, the stair turret, the tall hall window, the taking-in door column). The
glyph library already encodes several as silhouette (`gambrel-store`, `spire`,
`small-spire`, `towered-keep`, the cottage gable). ⚠ **There is no `ROOF_FORMS` enum
anywhere in `src` or in the charter's §2** — the closest are two incidental constants,
`ROOF_COURT_COMPOUND` and `ROOF_STORE`. **AD must not mint one.** A roof form is a
*consequence* of parti plus material plus tier, derived at draw time exactly as
`glyphKindFor` derives a glyph kind today, and storing it would create a second truth
against DW law 4 (derive-don't-store). Recorded as J-AD-3 (§8).

**Yard fixtures — DWELLINGS charter §2.7, the closed embellishment vocabulary.** These are the
motifs B13's density dial actually turns up and down, and every one has a dossier behind
it: tan pits · lime pits · **drying frames with hides** · bark store · water channel ·
**quench pit** · fuel store · anvil pit · scrap heap · brewhouse outshut · copper · tuns ·
cool-backs · malt floor · **kiln with a stokehole as large as the oven** · clamp · clay
quarry · fuel stack · **tenter strip** (131 x 1.8 m, measured) · dye vats · drying gallery ·
manger · trough · **midden** · **bee boles** · dovecote · hayrick · mounting block · horse
trough · carriage passage · dung heap · **the sign on its pole** · leat · pond · causeway ·
hurst · privy · well · woodpile · kitchen garden.

**The wear ladder — what decline sheds first (DWELLINGS charter §2.7, from R-INST-1).** This is the
single most valuable thing in the corpus for an art director, because it makes decay a
*sequence* rather than a filter:

1. the **perishable process stock** goes first — the hides on the frames, the tenter's
   cloth, the drying gallery's stock. *A ruined tannery has frames and no hides; an
   abandoned one has neither.*
2. then the **frames, racks and stacks** themselves;
3. then the **movable plant** — copper, vats, anvil;
4. the **excavated features never go** — pits, leats, stokeholes. They become the fossils
   the engine's law 5 reads.

⭐ **AD renders that ladder as a subtraction over one motif set, not as four motif sets.**
A `tenter` at `sound` draws frame plus cloth; at `worn`, frame plus torn cloth; at
`damaged`, bare frame; at `ruined`, the ground scar only. That is one authored motif with
four states, which is also exactly how B14's grid wants to be implemented.

### §2.3 · THE TWO DIALS AD RENDERS — B13 AND B14

These are the owner's signed bands and AD is the program that gives them a visual meaning.

**B13 — EMBELLISHMENT DENSITY, ruled `WORKING`.** The owner's ruling stands as *"enough to
read as lived-in, not cluttered"*, and the charter is honest that the vocabulary is sourced
while the density is the chair's taste. AD's translation:

| Band | Yard content | AD reading |
|---|---|---|
| `SPARSE` | one signature fixture per trade | one motif at the yard's centroid |
| **`WORKING`** (ruled) | the trade's actual kit | the fixtures the function *requires*, placed against the yard's own geometry — the drying frames along the long edge, the pits against the water channel, the midden at the far corner from the door |
| `BUSY` | kit plus stock plus waste | adds the perishable stock layer and the waste heaps |

⭐ **The density dial is therefore a LADDER RUNG ON THE WEAR SEQUENCE, not a second
mechanism.** `BUSY` is `WORKING` plus the layer that decline sheds first; `SPARSE` is
`WORKING` minus everything but the signature. **One ordered motif list per trade, three
cut points.** That is a real simplification and it is this lane's contribution to B13.

**B14 — THE 3 x 3 WEAR GRID, signed with its mapping written out.** Three grades
(`plain / good / fine`) crossed with three wear states (`sound / worn / broken`), and the
six-to-three engine mapping the owner signed: `ruined -> broken` · `burned -> broken` ·
`damaged -> worn` · `worn -> worn` · `pristine -> sound` · `sound -> sound`.

AD's translation, and this is where the register earns its keep:

- **GRADE is a line-weight and detail-count decision, not a colour decision.** `plain`
  draws the silhouette and the one functional detail; `good` adds the joinery line and a
  second detail; `fine` adds the ornament stroke. Three tiers of stroke count over one
  silhouette — the same technique `medieval.js` already uses to distinguish `house-a`
  from `house-c`.
- **WEAR is a subtraction and a perturbation, never a texture.** `sound` draws the motif
  as authored; `worn` drops the perishable stroke group and softens the roof line;
  `broken` drops everything above the wall line and leaves the excavated feature. This is
  the §2.2 ladder collapsed to three, and it means a fixture needs **one authored motif,
  not nine**.
- ⚠ **`burned -> broken` is the one judgment inside the mapping** and the owner signed it
  knowingly. AD adds one visual consequence and no new state: a burned fitting draws the
  broken silhouette **plus the char stroke** — an ink weight change on the surviving
  strokes, drawn from the condition the engine already carries. It costs no new enum
  member and it makes the distinction the owner was told he was collapsing partly visible
  anyway. Recorded as J-AD-4 (§8), vetoable.

### §2.4 · WHAT EACH SURFACE GETS

| Surface | Today | Under AD | The constraint that shapes it |
|---|---|---|---|
| **The 2D town pane** | Illustrated lens live: 27 glyphs, ground dress, season portrait | More glyph kinds as DW-1's parti vocabulary widens the useful set; the parcel/yard surface gains fixture motifs; the wear ladder becomes visible | The underlay is static and pointer-events-off; the interactive layers above keep the hit targets. **AD may not move a hit target** |
| **The interior plan pane** (DW-6a) | Does not exist. `interiorDraw.js` draws rooms, walls, doors and *one small square per furnishing* | A typed MOTIF per fixture kind at plan scale, in the same five-role stroke vocabulary; the room wash stays; walls stay on top so the plan reads as a plan | **DW-6a creates `project/planPane.js`.** AD's interior cars either precede it as pure data (the motif library) or follow it as its consumer. They may not fork it |
| **The PDF** | `TownMapDocument.jsx` and the 08C plate map the SAME draw list through the SHARED `renderTownMapOp`. Measured at ODQ §524.3: the plate ships in **2 of the 4 dossier variants** (`draft_brief` and `canon_dossier` yes; `timeline_packet` and `campaign_state` no) | Nothing new required. The illustrated lens already prints, because it is ops, not pixels | ⭐ **This is the payoff of the recommendation.** Every raster route would have needed a second PDF path. `renderTownMapOp` is a five-op mapping and AD adds no sixth op. ⚠ **AD inherits D-EXPORT-1** (§524.5): `hasDrawableMap` self-gates the plate, so a settlement whose map cannot be built sells a paid PDF with no map — the seam DW-6 lands on, and AD's DW-6-dependent cars must not widen it |
| **The Foundry / UVTT export** | `interiorExport.js`: `line_of_sight` is a 1:1 image of `model.walls`, `portals` 1:1 of the doors; fail-closed covert scrub. DW-6c extends it | ⛔ **AD CHANGES NOTHING HERE, DELIBERATELY.** A UVTT scene's `image` is a raster of the map and its wall data is geometry. Art affects the raster only, through the same draw list. **AD must never add a decorative segment to `line_of_sight`** — a drawn hedge that blocks vision is a lie about the world | The covert scrub is defense-in-depth and AD's motifs must be scrubbable by the same filter: **a motif attached to a covert cell is covert** |
| **The 3D massing** | Flat semantic albedo per role, live theme tokens on screen and a frozen export skin for PNG/GLB | Optionally: the dormant material library woken behind a `massingSet` id, giving eleven materials x six weathering as baked deterministic textures | §2.5 |
| **The card thumbnail** | Same draw list, downscaled | Free | The glyph LOD rule (`kind === 'fill'` collapses to `massing`) already prevents a metropolis from exploding at thumbnail scale |

### §2.5 · THE 3D MUST NOT DISAGREE WITH THE PLANS

This is the hardest constraint in AD and it deserves its own subsection, because it is
where an art program can quietly introduce a second truth.

**The three things that could disagree:**

1. **Storey count.** Charter open question **Q-B** is exactly this, and it is addressed to
   the chair with the D5 strata wave: *is `heightPermille` sufficient to carry a storey
   COUNT, or does the massing block need a storey field? DW-2b can partition a permille,
   but the 3D massing and the plan must then agree about how.* Measured today: the
   cartography block carries one `heightPermille` per building
   (`cartographyBuildings.js:74`) and `DWELLING_HEIGHT_PERMILLE` per tier `{100, 120, 140,
   180, 220, 260}` with `HEIGHT_PLAN_CEILING: 60` (`cartographyTuning.js:284-290`) — **and
   no storey count anywhere** (charter §0 H23).
   > **AD's position, and it is a refusal rather than a proposal: AD does not answer Q-B
   > and does not draw a storey line on any 3D surface until DW-2b has minted `Storey[]`
   > and the chair has ruled Q-B.** Drawing three window bands on a massing block that the
   > plan says has two floors is the exact failure this subsection exists to prevent. Until
   > then the 3D draws *mass and material*, never *floors*.
2. **Material.** If the 2D glyph says timber-frame and the 3D block is ashlar, the reader
   is looking at two buildings. **The cure is a single derivation with two consumers:** one
   pure leaf derives `(materialId, weathering)` from the facts the engine already holds —
   prosperity rung, condition, tier, region, date — and both the glyph's stroke treatment
   and the 3D material bake read it. Neither surface may derive it independently. This is
   the one-writer law applied to art.
3. **Footprint and roof ridge.** Already safe and worth recording as safe: the K-1 budget
   sheet measured **identical AABB at every LOD tier** — *"pops change detail, never
   shape"* — and the 2D glyph is placed inside `GLYPH_FOOTPRINT` derived from the same
   building rect. Neither plane invents outline.

### §2.6 · THE LEGIBILITY AND GAME-GRADE-UX OBLIGATIONS

Two standing laws bind every visual decision here and neither is negotiable.

- **The legibility law — glance, then sentence, then table.** At a glance the map must say
  *what kind of place is this and how is it doing*. AD's density and detail must never
  cost the glance. The concrete rule: **a motif that is not legible at thumbnail scale is
  drawn only above a tier threshold**, and the LOD collapse to `massing` is the existing
  precedent for exactly that.
- **The game-grade UX doctrine — translate the formula.** The wear grid, the density band
  and the material ladder must each be *readable off the drawing* without a legend. If a
  DM cannot tell a `worn` tannery from a `broken` one by looking, the grid is decoration
  and B14 was signed for nothing. **Acceptance shape (§5): a blind-panel read — show a
  reader three yards at three wear states with no labels and ask them to rank them.**
  That is the same instrument DW-7a's exhibit gate uses, and AD should reuse it rather
  than invent a metric.
- **Colour-blind and high-contrast survive by construction** if §2.1's "line before colour"
  rule holds, and MP-1 already set the precedent by drawing a **border as well as a tint**
  so its property line survives both modes (§495.4c). **Every AD motif inherits that rule:
  never a fill alone.**

## §3 · THE ASSET ARCHITECTURE

### §3.1 · WHAT AN "ASSET" IS IN THIS PROGRAM

**An AD asset is a frozen data literal describing strokes in a local unit box, compiled at
draw time into the primitive op vocabulary the surface already renders.** It is not a
file, not a bitmap, not a path string authored by hand, and not anything fetched.

The shipped precedent is exact. A `medieval.js` glyph is
`{ hr, strokes: [{ r, p: [[x,y], …], c? }] }` where `r` is one of five roles
(`face · roof · ink · line · circle`), `p` is a point list in a `0..1 x 0..1` box with the
ground line at `y = 1`, and `c` closes the stroke. The compiler places, scales and mirrors
it. **AD extends this same shape to three new families** — interior fixture motifs, yard
fixture motifs, and (optionally) 3D massing sets — and mints no new asset *kind*.

Three properties follow from the shape and they are the reason it was chosen:

1. **It diffs.** A motif change is a readable line diff in a code review, not an opaque
   binary blob. The estate's whole review discipline works on it.
2. **It is deterministic for free.** No encoder, no platform, no driver. Same input, same
   ops, same bytes, on every machine.
3. **It costs no payload.** It is source, it is tree-shaken, and it is lazy (§4.3).

### §3.2 · HOW A MOTIF IS ADDRESSED BY DW-1'S CLOSED VOCABULARIES

DW-1 mints, per the ratified charter §2 (⚠ **the fixture figure is 82, not 81** — the
charter amended it at §Σ AR-7 after a mechanical recount; the dispatch brief's 81 is the
pre-amendment number):

| Vocabulary | Count | Today |
|---|---|---|
| **PARTIS** | **48** — 8 families, 47 named members plus `GATED_COURT_RING`'s attribute space | none |
| **CELL (ROOM) KINDS** | **83** — `28 - 2 + 57` | **28** in `interiorTemplates.js:35` (2 retiring: `stall`, `dais`) |
| **FIXTURE KINDS** | **82** — `22 + 60` | **22** in `interiorTemplates.js:50` |
| Circulation classes | 9 top-level, ~55 sub-forms | — |
| Yard fixtures | the closed DWELLINGS-charter §2.7 table | none |
| INTERIOR KINDS | 8 | 8 in `interiorTemplates.js:29` |

**THE ADDRESSING RULE — a two-level resolution with an explicit registry, and it is
deliberately NOT a lookup table keyed on the enum.**

```
  motifFor(member, set) :=
      (1) the SET's own entry for `member`                 -- an authored motif
   -> (2) the SET's entry for member's FAMILY              -- the family default
   -> (3) the ABSTRACT primitive for member's SHAPE CLASS  -- the honest fallback
```

- **Level 1** is a direct keyed read out of the registered set, exactly as `getGlyphSet(id)`
  then `set[kind]` works today.
- **Level 2** is the level the current glyph layer already has in the form of
  `CATEGORY_GLYPH_DEFAULT` (`glyphAssign.js:39-52`), keyed on the 12-enum district
  category. AD generalises it: a fixture family (`process plant · storage · seating ·
  threshold · excavated · perishable stock`) carries a default motif so an unauthored
  member still draws as *the right kind of thing*.
- **Level 3** is the abstract primitive — for interior fixtures, precisely today's small
  square; for yard fixtures, the mark the ground dress already uses.

⛔ **AND THE SEAM THAT MUST BE CROSSED, NAMED.** Today's `glyphKindFor` resolves through
**18 case-insensitive regexes against the institution's NAME** (`glyphAssign.js:90-109`)
because — as the file says in its own header — *"priorityCategory/tags live on the source
institution, not the model building; threading richer identity would move the model
golden."* That is a prose-matching waterfall, and DW-1's vocabularies are **closed enums**.
**AD must not extend the regex list to 82 fixture kinds.** A prose match against a closed
enum is a category error that would silently mis-draw the moment a name changes, and the
estate has been bitten by prose-token pins before (the importer-pin hazard, ODQ §521-era).

> **THE RULE: a DW vocabulary member addresses its motif by its ENUM MEMBER, through the
> registry, with no string matching anywhere in the path.** The name-regex waterfall stays
> exactly where it is — resolving *institution buildings* on the town map, where there is
> no enum to key on — and never grows a second job. Recorded as **J-AD-1** (§8).

### §3.3 · THE HONEST FALLBACK — WHAT HAPPENS WHEN A MEMBER HAS NO MOTIF

**With 48 + 83 + 82 members and a yard vocabulary on top, partial coverage is the normal
state for most of this program's life, not an error condition.** The fallback is therefore
a designed behaviour with a test, not a safety net.

**The law, in three clauses:**

1. **NEVER A BLANK.** A vocabulary member with no motif draws its family default; a family
   with no default draws the abstract primitive. There is always a mark. The precedent is
   `FALLBACK_GLYPH_KIND = 'house-a'` (`townGlyphs/index.js:29`) and the fail-safe
   `getGlyphSet` contract at `:60-69`: *"an unknown/absent id returns null — the draw layer
   then keeps its legacy rect path; worst case is the old look, never a crash."*
2. **NEVER A WRONG MOTIF.** The family default must be *categorically* true, not
   *specifically* wrong. An unauthored `quench pit` may draw the generic *excavated
   feature* mark; it may **never** draw the `tan pit` motif because the two are both pits.
   A specifically-wrong motif asserts a fact the engine does not hold and breaks DW's law
   that an embellishment never asserts a fact the engine lacks.
3. **THE COVERAGE IS MEASURED AND ONLY GOES UP.** An inventory-ratchet test counts, per
   registered set, how many vocabulary members resolve at level 1 versus 2 versus 3. **The
   level-1 count may only rise; the level-3 count may only fall.** That converts partial
   coverage from a quiet debt into a visible, monotone burn-down, and it is the
   structural-prevention shape the estate already uses for rosters.
   ⚠ **The count is a CEILING-FREE ratchet in one direction only** — adding a vocabulary
   member legitimately raises the level-3 count, so the ratchet keys on *coverage by
   member*, not on a bare total, and a new member enters at its declared level with a
   named reason.

### §3.4 · THE DETERMINISM RULE

Stated as one sentence, then unpacked:

> **A drawn surface is a pure function of `(model, style, dress)` and nothing else, and
> every asset it reads is either a frozen literal in the tree or a value derived from
> those three.**

What that forbids, concretely:

- **No `Math.random`, no `Date`, no `localeCompare`** — already enforced by the domain
  purity scan and the town-map idiom; AD inherits it.
- **No network fetch, no CDN, no lazy remote asset.** An asset that is not in the tree at
  build time does not exist.
- **No platform-variant encode inside the deterministic boundary.** The estate already
  draws this line correctly and AD keeps it: the SVG string is byte-deterministic and
  pinned; the PNG/JPEG/WebP *encode* is a browser-native step whose exact bytes are
  platform-variant, so **the pin is on the SVG INPUT, never the raster output**
  (`townMapExport.js`). Same for the 3D: WebGL is the interactive presentation, and
  `scenePortraitExport.js` exists because *"driver, device, antialiasing and shader
  differences make GPU screenshots unsuitable as golden artifacts"* — the deterministic
  CPU axonometric renderer is the export truth.
- **Any per-instance variation is seeded off a STABLE anchor.** The precedent is exact:
  the glyph mirror bit and house-variant pick fork off the building's `anchorKey` through
  `createPRNG`, *"so the same building always wears the same glyph, and adding or removing
  one building never re-stamps the others."* **AD motifs vary the same way or not at all.**
  This is the loaded-dice law's art clause.

**And the corollary that decides §1:** an asset that cannot be reproduced from the tree
and the seed is a liability under the Promise, because the Promise's unit is not the file
— it is the world. A world that can only be redrawn if a particular vendor is still in
business was not preserved.

### §3.5 · THE GENRE DOOR AND THE SETTING-AGNOSTIC LAW

`registerGlyphSet(id, lib)` (`townGlyphs/index.js:45`) is a mutable `Map` seeded at module
eval with the shipped sets, and `GLYPH_SET_IDS` is *"an explicit frozen literal (not
derived) so the shipped wall vocabulary is a reviewed, byte-stable constant — a set can be
render-registered for tests without silently widening what the AI may select."*

**That two-part design is the setting-agnostic law implemented in code and AD must
preserve both halves:**

- the **register** is open, so a pack is a data drop with zero engine change;
- the **wall vocabulary** is a closed reviewed constant, so registering a set does not
  authorise the AI to select it.

AD's three new families each get the same treatment: an open register, a closed shipped
id list, a fail-safe resolver, and no widening of THE WALL without a reviewed constant
edit.

⚠ **The one setting-agnostic hazard AD introduces and must guard.** The *shipped* set is
called `medieval` and its motifs are drawn from European vernacular building. That is
fine as a default. It stops being fine the moment a motif encodes something a
cloud-world could not have — a motif that requires geology, a specific crop, or a
specific creature. **Acceptance rule: every shipped motif must be nameable in
function-first terms** (`process vessel`, `drying frame`, `excavated pit`, `threshold
mark`) **rather than in setting terms**, and the id is the function. A pack then supplies
a *different drawing of the same function*, which is what makes the door work. No named
setting, no trademarked creature, ever — in a motif, in an id, or in a comment.

## §4 · THE PIPELINE

### §4.1 · AUTHORING

**Who authors.** A build lane on Opus, working from the research corpus, exactly as
`medieval.js` was authored. There is no external author in the loop and no handoff
format to define — which is the second-largest schedule saving in this program after
§1's.

**What a motif author is given.** Each motif brief is one row assembled from documents
that already exist: the vocabulary member's name and family (charter §2), its licence
(*what must be true for it to be drawable* — charter §2's own framing), its dossier
citation (R-INST-1..6 or DWR1A), the wear-ladder rung at which each stroke group drops
(§2.2), and its legibility floor (the tier below which it collapses to its family
default). **No motif is authored from imagination; every one is authored from a row.**

**The stroke budget.** `medieval.js` records the shipped discipline as a taste note:
*"the mark vocabulary and per-building silhouettes are a cartographer's-eye choice, kept
compact (about 8 strokes each at most) for legibility and the op budget."* AD adopts the
same ceiling for town-scale motifs and a lower one for plan-scale fixtures, where the
drawn size is smaller: **at most 5 strokes for an interior fixture motif, at most 8 for a
yard fixture, at most 8 for a building glyph.** These are legibility budgets, not
performance ones — a fixture drawn at plan scale with twelve strokes is a smudge.

**What authoring produces.** One frozen data literal appended to one library file, plus
its row in that library's coverage manifest. Nothing else. No binary, no build step, no
tool.

### §4.2 · REVIEW

Four gates, in order, and the first two are the ones that catch real mistakes:

1. **THE FIVE TESTS (§1.3).** Applied to the motif as authored, not to the program. Any
   motif that needs a fetched byte, a second render path, a named setting, an unlicensed
   source or a missing notices row fails here.
2. **THE BLIND READ.** Render the motif at three wear states and two tiers with no labels
   and ask a reader to rank and name them. This is the game-grade-UX obligation made
   executable and it reuses DW-7a's exhibit-gate instrument rather than inventing a
   second one. ⚠ It is a *human* gate; it does not automate and the charter does not
   pretend it does.
3. **THE MACHINE GATES**, which the estate already owns and AD only has to not break:
   determinism (same input, byte-identical ops), the purity scan, the cross-lens pin (a
   re-skin changes no geometry), the one-light gate, the coverage ratchet (§3.3.3), and
   the op-count identity where it applies.
4. **THE OWNER'S EYE**, once per family rather than once per motif. §7 rows B13 and B14
   are already signed; what is not signed is whether the *hand* is right, and that is a
   single before/after sitting on a representative sheet, not a per-asset approval.

### §4.3 · STORAGE, SIZE BUDGET, AND WHY THIS PROGRAM IS AFFORDABLE

**Storage.** Motif libraries live in `src/design/` beside `townGlyphs/`, as source. Nothing
lands in `public/`. **⭐ That is a deliberate, load-bearing choice**: `public/` is copied
verbatim into the deployed origin, is not tree-shaken, is not lazy, and — as §1.2
measured — is exactly where the estate's un-inventoried payload already lives. AD adds
nothing to it.

**The measured budgets AD must live inside** (all at the slot):

| Budget | Value | Where | AD's cost |
|---|---|---|---|
| First-paint static JS closure | **1,040,000 B** — owner-signed, deliberately not re-pinned; one recorded measurement came in at **1,039,975 B, twenty-five bytes under** | `tests/build/vendorPdfLazy.test.js:468` | **+0**, and this is not an aspiration — it is enforced by an existing lazy contract (below) |
| Closure gzip / brotli | 337,000 / 283,000 B | same file | +0 |
| `index.html` | 8,600 B | `tests/build/firstPaintNonJs.test.js` | +0 |
| Render-blocking CSS | 19,800 B | same | +0 |
| Preloaded fonts | 90,000 B (Nunito-Regular 42,124 + Lora-Bold 46,036) | same | **+0 — and AD MINTS NO FONT.** A display face would cost most of the remaining margin and would add a licence row |
| Per-file max lines | 800 (600 for components and src-root JSX), frozen per file in `scripts/.size-baseline.json`, **shrink-only** | `tests/lint/sizeBaseline.test.js` | The binding constraint on AD: a motif library grows until it hits 800 effective lines and then **splits into a sibling module**, never grows an entry in the baseline |
| Test census | `files: 2517, parked: 366, credited: 2151, titles: 20882, suiteTitles: 5814` | SLOT-FACTS, `sovereigntyLightingContract.walker.test.js` | Each AD car walks its own delta from its arm's own failure messages |
| Test ratchet | 28,924 tests, ceiling 11 | SLOT-FACTS | AD's delta is attributed by execution, never estimated |

**Why the +0 is real and not a hope.** Four lazy contracts already fence this territory:
`tests/build/townMapLazy.test.js` (the pane and `src/domain/townMap/**` must stay out of
the entry's transitive static closure, asserted option-agnostically through a unique
minification-surviving fork-key literal `::town-map:v1`), `tests/build/interiorLazy.test.js`,
`tests/build/vendorPdfLazy.test.js`, and `tests/build/archKernelLazy.test.js`. And
`townGlyphs/index.js:11-13` states its own posture: *"consumed ONLY by the lazy town-map
draw surfaces plus tests, so it never reaches the first-paint static closure (the
townMapLazy pin)."*

> **THE RULE AD INHERITS: every motif library is reached only through an already-lazy
> surface, and each AD car that creates one adds its module to the relevant lazy
> contract's assertion in the same commit.** An AD library that becomes eagerly reachable
> is a red, not a regression to find later.

**The honest cost of the optional 3D branch.** Waking the material library is the one AD
decision with a non-trivial byte cost, and it is worth stating before the owner decides
it in §7. The baked textures are generated at runtime from a recipe rather than shipped
as image files, so the *payload* cost is the recipe module, not the pixels — but the bake
costs CPU time on first view and memory for the atlas. `docs/KERNEL_K1_BUDGET_SHEET.md`
measures the geometry side and finds enormous headroom (42 draw calls against ~200; 2,172
triangles against a 150,000 authored ceiling; **eager bytes +0 while dormant**), but it
does **not** measure texture bake time or atlas memory on the owner's M1, because the
kernel has never been wired to a live surface. ⚠ **That measurement does not exist and
must be taken before the branch is chosen** — it is AD-6a's whole job in §5, and it is
listed as a deferred row in §7 rather than a recommendation, precisely because the number
is missing.

### §4.4 · THE NOTICES MACHINERY — turning §1.2 from a finding into a gate

The provenance audit (AD-1) produces a finding. Without machinery, a finding decays. The
structural-prevention shape is a **manifest plus a walker**, which is the estate's own
established pattern:

- **`ASSET_MANIFEST.json`** — one row per shippable non-code artefact under `public/`:
  path, SHA-256, what it is, where it came from, under what licence, and whether its
  licence text is served alongside it. The vendored libs already have exactly this shape
  in `public/map/libs/VENDOR-MANIFEST.json`, pinned by SHA-256 with a build gate comparing
  the pins against the bytes on disk. **AD-2 generalises that file's pattern to art.**
- **The walker test** — enumerates every file under `public/` matching the shippable-asset
  extensions, and reds on any file with no manifest row and any manifest row with no file.
  ⚠ **The count is a ratchet in the honest direction: the number of UNATTRIBUTED files may
  only fall.** That is what makes the burn-down visible and prevents a new unattributed
  asset from arriving quietly.
- **The notices generator** — `THIRD-PARTY-NOTICES.md` gains a section 6 (art and media)
  rendered from the manifest, so the document cannot drift from the tree. Its §5 already
  says the file is meant to be kept current; this is how.

⛔ **This machinery is the deliverable that makes the launch blocker safe to close, and it
is cheap.** The audit is a day or two of reading; the manifest is mechanical; the walker
is one test file. It is also entirely independent of every other AD car and of the whole
DW arc — which is why §5 puts it first and §1.5 recommends starting it now.

### §4.5 · BUILD TIME VERSUS RUN TIME

| Stage | When | Why |
|---|---|---|
| Motif literals | **Source.** Frozen at module eval | Diffable, tree-shakeable, no build step |
| Motif compilation to ops | **Run time**, inside the already-lazy draw call | `compileGlyph` is a pure function; pre-compiling would freeze the placement, which depends on the building's own box |
| Coverage manifest | **Source**, checked by a walker at test time | A generated manifest that nothing checks is a comment |
| 3D texture bake | **Run time on first view**, from a source recipe | The bake is byte-deterministic, so caching it is an optimisation and never a correctness question. ⚠ The bake-time measurement is missing (§4.3) |
| Exhibit plates | **Offline**, by a `scripts/generate-*.mjs` script, output committed under `public/landing-maps/` | The existing K-tranche precedent. ⛔ **Every plate AD generates gets an `ASSET_MANIFEST.json` row naming the script and the commit that produced it** — which is the provenance gap of §1.2 closed at the source rather than audited later |
| Raster encode | **Run time, in the browser, outside the deterministic boundary** | Already the correct line; AD does not move it |

## §5 · THE WAVES AND CARS

### §5.0 · THE UNIT COST, MEASURED — so the car sizes are arithmetic, not guesses

`medieval.js` is **269 effective lines for 27 glyph kinds — about 10 effective lines per
motif** (measured at the slot under the eslint convention, blanks and comments skipped).
PACKET_STANDARD caps a new production leaf at **250 effective lines**, so:

> **A motif library leaf holds about 25 motifs. Larger families split into siblings, the
> way EST-1 split four ways in the dwellings charter, and for the same reason.**

Against the vocabularies: **82 fixture kinds -> 4 leaves · ~39 yard fixtures -> 2 leaves ·
the town glyph extension -> 1 leaf.** Those numbers set the car counts below and they are
derived, not asserted.

The other caps every AD car lives inside (PACKET_STANDARD): at most one user-facing
surface; at most two new logic-bearing leaves; at most three existing logic-bearing
production files modified; at most twelve handwritten files; at most 400 new or changed
effective production lines; each shared or hot-file delta at most 15 effective lines; at
most eight named acceptance cases.

### §5.1 · THE FIVE WAVES

```
WAVE A  PROVENANCE       AD-1 -> AD-2 -> AD-3*          INDEPENDENT OF EVERYTHING. STARTS NOW.
WAVE B  THE TOWN PLANE   AD-4a -> AD-4b,4c -> AD-4d     needs MP-1 landed for 4b; NOT DW.
WAVE C  THE PLAN PLANE   AD-5a..d (dark) -> AD-5e       needs DW-1b (enums) and DW-6a (pane).
WAVE D  THE 3D BRANCH    AD-6a -> [owner gate] -> 6b,6c OPTIONAL. AD-6a needs nothing.
WAVE E  ACTIVATION       AD-7                            LAST. After DW-7a.
```

**Which cars may start before the dwellings waves land, stated plainly because the
dispatch asked:**

| Car | May start before DW? | Why |
|---|---|---|
| **AD-1** provenance audit | ⭐ **YES — TODAY.** Depends on nothing. Read-only. Competes with no build seat | It reads `public/` and the notices file. Neither moves |
| **AD-2** manifest + walker + notices §6 | **YES**, the moment AD-1 reports | Touches no domain code |
| **AD-3** remediation | **YES**, and it must — see §1.5 | Scope unknown until AD-1 reports; count is `*` deliberately |
| **AD-4a** motif contract + registry | **YES.** Pure leaf, dark, imports nothing of DW's | It generalises `townGlyphs/index.js`'s registry shape to three families |
| **AD-4b** yard motif library | **NO — needs MP-1 landed** | There is no drawn yard until MP-1 emits the parcel op and tints parcel-minus-footprint (§495.4d). MP-1 is dispatched (§522.6) and is not a DW car |
| **AD-4c** wear ladder | **YES.** Pure derivation over the existing `conditionOf` chain | Charter §0 H24: the condition chain exists today |
| **AD-4d** coverage ratchet | **YES** | A test file over AD-4a's registry |
| **AD-5a** interior motif library | ⛔ **NO — needs DW-1b** | It keys on the 82-member fixture enum. Authoring it against the 22 that exist now would guarantee a rewrite |
| **AD-5b** plan-pane consumer | ⛔ **NO — needs DW-6a** | `project/planPane.js` does not exist until DW-6a creates it |
| **AD-5c** grade x wear | ⛔ **NO — needs AD-5a** | — |
| **AD-5d** PDF chapter motifs | ⛔ **NO — needs DW-6b** | — |
| **AD-5e** legacy interior migration | ⛔ **NO — LAST, and it carries the only unavoidable declared shift** | §5.4 |
| **AD-6a** the 3D measurement | ⭐ **YES — TODAY**, and it should, because the owner cannot decide row D in §7 without its number | It runs the dormant kernel offline; the kernel already has 19 tests and a lazy pin |
| **AD-6b/6c** the 3D branch | Owner-gated on AD-6a's number | — |
| **AD-7** activation | **NO — after DW-7a** | DW-7a is the only light car in the DW arc and it lands last by ruling |

### §5.2 · THE CARS

Each row is PACKET_STANDARD-shaped: files touched, the acceptance case set (at most
eight), the census delta, and the declared shift. Census deltas are **estimates to be
walked by the lane from its own arm's failure messages** (§417), never inherited.

#### WAVE A — PROVENANCE (the launch blocker)

| Car | Files | Acceptance | Titles | Shift |
|---|---|---|---|---|
| **AD-1** THE PROVENANCE AUDIT | ⭐ **NONE — a research car, no commit.** Deliverable is a dossier in the lane scratchpad plus an ODQ section | (1) every shippable non-code file under `public/` enumerated with bytes and SHA-256; (2) each classified ESTATE-GENERATED / VENDORED-COVERED / VENDORED-UNCOVERED / UNKNOWN, with the evidence for each classification named; (3) the FMG art populations (textures, charges, heightmaps) traced to upstream provenance or reported as untraceable — **a "could not determine" is a finding, not a failure**; (4) the page paintings and the journey videos traced to their author or generator; (5) a remediation list ordered by risk, each row marked REPLACE / ATTRIBUTE / REMOVE / KEEP; (6) explicit statement of what was NOT checked | 0 | none |
| **AD-2** THE ASSET MANIFEST + WALKER + NOTICES §6 | CREATE `public/ASSET_MANIFEST.json`; CREATE `tests/lint/assetManifestWalker.test.js`; MODIFY `THIRD-PARTY-NOTICES.md`; MODIFY `public/third-party-notices.html` | (1) every extension-matched file under `public/` has a manifest row; (2) every manifest row has a file; (3) SHA-256 pins match the bytes on disk; (4) the UNATTRIBUTED count ratchets **down only**; (5) a planted unattributed file reds the walker (**the failing control**); (6) a planted orphan row reds it too; (7) notices §6 renders from the manifest and is byte-reproducible; (8) the served HTML matches the markdown | +6..8 | none |
| **AD-3*** REMEDIATION | scope set by AD-1 | per finding | ? | ⚠ **possible, per finding** — a replaced texture that is composited into settlement output moves that output. **This is exactly why AD-1 must run before the ONE REGEN (§1.5)** |

#### WAVE B — THE TOWN PLANE

| Car | Files | Acceptance | Titles | Shift |
|---|---|---|---|---|
| **AD-4a** THE MOTIF CONTRACT | CREATE `src/design/motifs/index.js` (registry, three families, fail-safe resolver); CREATE `src/design/motifs/motifCompiler.js`; test | (1) the three-level resolution of §3.2 returns level 1 / 2 / 3 in order; (2) an unknown set id returns null and the caller keeps its prior path; (3) an unknown member returns the family default; (4) an unknown family returns the abstract primitive; (5) registration is a pure keyed insert — same registered packs, same draw; (6) `MOTIF_SET_IDS` is a frozen literal and registering a set does **not** widen it; (7) **no string matching anywhere in the resolution path** (J-AD-1, source-scanned); (8) zero first-paint bytes — the module is absent from the entry closure | +8 | none (dark; nothing calls it) |
| **AD-4b** THE YARD MOTIF LIBRARY | CREATE `src/design/motifs/yard/process.js` and `.../yard/ground.js` (~20 motifs each, under the 250-line leaf cap); MODIFY the yard draw path MP-1 landed; test | (1) every DWELLINGS-charter §2.7 yard fixture resolves at level 1 or names its family default; (2) each motif is within its stroke budget; (3) same seed, byte-identical ops; (4) a fixture on a covert cell is scrubbed by the existing covert filter; (5) the yard's own geometry places the motifs (long edge, water channel, far corner) rather than a grid; (6) below the tier floor the yard collapses to its signature motif alone; (7) the parcel-minus-footprint input is **read, never recomputed** (MP-1's interface unchanged, §522.6); (8) legibility floor honoured at thumbnail scale | +8 | ⚠ **DECLARED — illustrated lens only.** The five re-skin lenses name no `dress`/motif role and therefore emit zero motif ops, so `parchment === legacy` holds. The illustrated goldens move once, deliberately |
| **AD-4c** THE WEAR LADDER | CREATE `src/design/motifs/wear.js`; MODIFY `motifCompiler.js`; test | (1) the four-rung shed order of §2.2 is a pure function of `conditionOf` and `agePermille`; (2) excavated features never shed; (3) `burned` draws broken plus the char stroke (J-AD-4); (4) B14's six-to-three mapping is pinned exactly as signed; (5) one authored motif yields all states — **no state is separately authored** (source-scanned); (6) a blind-read fixture ranks three states correctly; (7) same seed, byte-identical; (8) B13's three density bands are three cut points on ONE ordered list | +7 | none (dark until 4b calls it) |
| **AD-4d** THE COVERAGE RATCHET | CREATE `tests/lint/motifCoverage.test.js`; CREATE the coverage manifest | (1) level-1 coverage per set counted; (2) level-1 may only rise; (3) level-3 may only fall; (4) a new vocabulary member enters at a declared level with a named reason; (5) a planted regression reds (**the failing control**); (6) the manifest and the registry agree | +5 | none |

#### WAVE C — THE PLAN PLANE

| Car | Files | Acceptance | Titles | Shift |
|---|---|---|---|---|
| **AD-5a..d** THE INTERIOR MOTIF LIBRARY | CREATE 4 leaves under `src/design/motifs/fixture/` (~21 motifs each across the 82 kinds); MODIFY DW-6a's `project/planPane.js` as its **consumer** | (1) all 82 fixture kinds resolve; (2) plan-scale stroke budget (5) honoured; (3) grade drives stroke count, never colour (§2.3); (4) walls draw over motifs so the plan still reads as a plan; (5) the covert scrub reaches motifs; (6) the UVTT `line_of_sight` is **unchanged** — a motif is never a wall (§6); (7) same seed, byte-identical; (8) coverage ratchet green | +8 per leaf | ⭐ **NONE.** The plan pane is **new at DW-6a**; motifs are its birth state. Landing art on a surface at birth is what makes this the cheapest possible shift — zero |
| **AD-5e** THE LEGACY INTERIOR MIGRATION | MODIFY `src/domain/interior/interiorDraw.js` (the `:80-81` square) | (1) each of the 22 existing furnishing kinds draws its motif; (2) the SVG lane stays fail-closed-asymmetric exactly as recorded (`interiorExport.js` scrubs unless `{audience:'dm'}`); (3) UVTT unchanged; (4) all lenses resolve; (5) the golden is re-recorded once, deliberately | +5 | ⛔ **DECLARED, AND THE ONLY UNAVOIDABLE ONE.** `interiorDraw.js` is lens-shared and `InteriorView.jsx:58` is ungated and live (charter §506.3), so this moves what a user sees under **every** lens. ⚠ **It must land BEFORE the ONE REGEN and it needs the owner's before/after eye** (§7 row F) |

#### WAVE D — THE 3D BRANCH (optional)

| Car | Files | Acceptance | Titles | Shift |
|---|---|---|---|---|
| **AD-6a** THE MEASUREMENT | ⭐ **NONE — a measurement car, no commit.** Runs the dormant kernel through `scripts/generate-k*.mjs` on the owner's machine class | (1) texture bake wall-clock per material x weathering; (2) atlas memory; (3) first-view cost for a metropolis; (4) the byte delta if `massingSet` is named by a lens; (5) whether the K-1 budget sheet's draw-call and triangle headroom survives a real settlement rather than one cathedral; (6) an explicit statement of what could not be measured | 0 | none |
| **AD-6b** WAKE THE MATERIAL LIBRARY | MODIFY `townMapStyles.js` (register a `massingSet` id); CREATE the massing-set registry; test | (1) absent `massingSet` ⇒ byte-identical to today (**the dormancy law, the failing control**); (2) the ONE NW light gate holds; (3) same input, byte-identical texture cross-engine; (4) the arch kernel stays out of first paint (`archKernelLazy` still green); (5) the export skin and the live theme resolve the same material | +6 | ⚠ **DECLARED** — only for a lens that names a `massingSet`; every shipped lens is unchanged |
| **AD-6c** THE ONE MATERIAL DERIVATION | CREATE one pure leaf deriving `(materialId, weathering)` from prosperity, condition, tier, region, date; MODIFY both consumers | (1) the 2D glyph treatment and the 3D bake read the SAME leaf; (2) **neither derives independently** (source-scanned — the one-writer law); (3) DWR1A's per-FACE rule expressible (front face may differ); (4) the date-dependent status ladder (cob descends, brick ascends) is a function of the world clock; (5) same seed, byte-identical | +6 | ⚠ **DECLARED** where the 2D treatment changes |

#### WAVE E — ACTIVATION

| Car | Files | Acceptance | Titles | Shift |
|---|---|---|---|---|
| **AD-7** THE EXHIBIT SITTING | docs + whatever registry publication the owner's answers require | (1) a before/after sheet at three tiers and three wear states; (2) the blind-read panel passes; (3) `LENS_COUNT` is **unchanged** — AD mints no paid lens (§6); (4) every §7 row is answered or explicitly deferred | +2 | none |

### §5.3 · DEPENDENCIES BY ID

```
AD-1 -> AD-2 -> AD-3*
AD-4a -> AD-4b (also needs MP-1 LANDED)
AD-4a -> AD-4c -> AD-4b
AD-4a -> AD-4d
DW-1b -> AD-5a..d ; DW-6a -> AD-5b ; DW-6b -> AD-5d
AD-5a -> AD-5e     (LAST of wave C; before the ONE REGEN)
AD-6a -> [owner gate, §7 row D] -> AD-6b -> AD-6c
DW-7a -> AD-7      (LAST)
```

**Three ordering rules that are not negotiable:**

1. ⛔ **AD-1 runs before the ONE TRAILING OSR MINT (G1).** §1.5 derives it. A provenance
   finding that arrives after the one regen cannot be acted on without a second one.
2. ⛔ **AD-5e lands before the ONE REGEN**, for the same reason the ESTATE wave does — it
   changes drawn output on a live surface.
3. **AD-7 lands after DW-7a**, because DW-7a is the click surface and there is nothing to
   exhibit before it lights.

### §5.4 · THE DECLARED SHIFTS, COUNTED

The dwellings charter's discipline is to name the shifts and their count up front. AD's:

| # | Car | What moves | Why it is the cheapest available |
|---|---|---|---|
| 1 | **AD-4b** | The illustrated lens's town-map goldens, once | The five re-skin lenses name no motif role and emit zero motif ops, so `parchment === legacy` is untouched. One lens, one re-record |
| 2 | **AD-5e** | Every lens's interior SVG output | ⛔ Unavoidable: `interiorDraw.js` is lens-shared and its surface is live and ungated. Deferring it would leave the square shipped at launch, which is the thing B15 rules out |
| 3 | **AD-6b/6c** | Only a lens that names a `massingSet` | The dormancy law makes the default path byte-identical; this shift exists only if the owner opens row D |
| 4* | **AD-3*** | Possible, per remediation finding | Unknown until AD-1 reports. **The reason AD-1 is first** |

⭐ **AD mints ZERO feature flags.** Every dark car is dark by *reachability* — nothing
calls it — which is the posture the DW charter argued for and the estate's one-flag rule
prefers. **AD inherits DW-7a's flag for anything that must light behind a switch, and
mints none of its own.** Recorded as **J-AD-2** (§8).

## §6 · ANTI-SCOPE, STATED AFFIRMATIVELY

**AD renders what the engine already decides. It decides nothing.** The list below is
written so that a builder who is tempted can see the refusal already made, with its
reason, and so that a reviewer can red a car that crosses one of these lines without
re-litigating why.

| AD does NOT | Because | Whose job it is |
|---|---|---|
| **Change the plan** — no cell added, moved, resized or removed; no wall, door or joint | The plan is a derived fact and art is a projection of it. A motif that changed a room would make the drawing the source of truth | DW-1, DW-2, the ESTATE wave |
| **Change the grammar** — no new parti, cell kind, fixture kind, circulation class or joint attribute | The vocabularies are closed and DW-1 mints them. **AD may find that a member is undrawable and must say so; it may not fix that by inventing a member** | DW-1 |
| **Mint a `ROOF_FORMS` enum** or any other derived-fact store | A roof form is a consequence of parti x material x tier, derivable at draw time exactly as `glyphKindFor` derives a glyph kind. Storing it creates a second truth against DW law 4 (**J-AD-3**) | nobody — it stays derived |
| **Assert a fact the engine lacks** | The DW law R5 constraint, inherited verbatim. An embellishment is read off `conditionOf`, `agePermille`, prosperity, function and season — all of which exist | — |
| **Add an op to `cartographyPaint.js`** | `ops.length` is an IDENTITY over the block's own record counts (`:15-17`) and every new op moves it plus every test that pins it. MP-1 pays that once for `parcel`; DW-6d pays it for `estate`/`member`. **A third payment for art would be a third identity edit for zero geometric content** | MP-1, then DW-6d |
| **Rebuild MP-1's property-line layer** | §522.6 binds DW-6 to re-point it by changing its INPUT. AD is bound the same way: it may change how a layer looks, never where its geometry comes from | MP-1, re-pointed at DW-6d |
| **Touch `line_of_sight` or `portals` in the UVTT export** | Those are 1:1 images of `model.walls` and the doors. **A drawn hedge that blocks vision is a lie about the world**, and a VTT consumer would act on it | DW-6c |
| **Draw a storey** before DW-2b mints `Storey[]` and the chair rules Q-B | The engine has no storeys (charter §0 H5; "storey" hits only three prose files in `src`). Drawing floors the plan does not have is the exact 2D/3D disagreement §2.5 exists to prevent | DW-2b, then the chair |
| **Mint a feature flag** | The DW arc mints exactly one (DW-7a) and AD inherits it. Dark-by-reachability is cheaper and has no six-surface bill (**J-AD-2**) | DW-7a |
| **Mint a paid surface, a lens, or a SKU** | `LENS_COUNT = TOWN_MAP_STYLE_IDS.length` is 5 and is a paid row; the illustrated lens is deliberately outside it. Adding a lens to that array would **silently bump a paid surface**, which the file's own header warns about. And §514.1 rules that the map is not a second paywall axis and no map-specific SKU may be minted | the owner, and nobody else |
| **Gate viewing** | The line, now a trichotomy at §524.4: **VIEW / INTERACT free · AUTHOR paid · TAKE AWAY paid.** **Looking at a prettier map is a read.** AD gates nothing and unlocks nothing — the take-away arm is already priced into the existing `$2.99` dossier and needs no map-specific row | — |
| **Author or fetch a font** | 90,000 B of preloaded-font budget with ~1,700 B of margin, and every face is a licence row. Motifs are strokes, not glyphs in a typeface | — |
| **Put anything in `public/`** except a generated exhibit plate with an `ASSET_MANIFEST.json` row naming its generator | `public/` is copied verbatim, not tree-shaken, not lazy, and is where the un-inventoried payload already lives (§1.2) | AD-2's machinery |
| **Let an AI author geometry** | THE WALL: select, never author. `townGlyphs/index.js:8-9` records AI-authored glyph geometry as a named deferral to the trust ladder (design §5, S4+). AD does not spend that deferral | the trust ladder, later, if ever |
| **Name a setting or draw a trademarked creature** | The 6th product-scope boundary and the cloud-world test. Every motif id is a FUNCTION, and a genre pack supplies a different drawing of the same function | — |
| **Re-open a signed band** | B13 and B14 are signed. AD renders them; it does not re-propose them. Where AD adds a visual consequence inside a signed band (the char stroke, J-AD-4) it is recorded as a judgment and is vetoable by one word | the owner |
| **Answer the tuning signature** | §515.2: the band-signing half is discharged; **the tuning signature is not** and belongs to the endgame's tuning pass. No AD car may read the band signature as covering it | the owner, at the tuning pass |

## §7 · THE OWNER'S DECISIONS — THE SITTING SHEET

Read it in one pass. Each row is a decision you can make in a sentence, with a
recommendation you can accept by saying nothing and reject by saying one word. Each is
marked **measured** (a number read out of the tree), **sourced** (a fact from the research
corpus or a primary document), **taste** (a judgment with no measurement under it — and
the charter says so), or **deferred** (not decidable yet, with what would make it
decidable).

No row asks you to read code.

---

### ⭐⭐ ROW ZERO — THE PROVENANCE CHOICE

#### **A0 · WHERE DOES THE ART COME FROM?** — **measured**

| | |
|---|---|
| **The question** | Does SettlementForge's illustrated art get **made by us in code**, **commissioned from an artist**, **licensed as an asset pack**, or **generated by an AI**? |
| **Recommend** | ⭐ **MADE BY US IN CODE, and nothing else ships.** No commissioned files, no licensed packs, no AI-generated art on any render path. AI-generated media stays exactly where it already is: marketing chrome |
| **Why, in one line** | **Three of the four options produce artwork that cannot be re-derived from a seed, and your Promise says a seed is a starting world forever.** A world that can only be redrawn if a particular vendor is still in business was not preserved |
| **Why, in three more** | (1) **You already own the machinery.** 27 building glyphs, a ground-dress layer, a season portrait, an AI re-skin wall, and a dormant material library of eleven materials crossed with six weathering classes, all landed, all tested. (2) **Buying art breaks the one thing that makes your map unusual** — the same drawing reaches the screen, the PDF, the thumbnail and the VTT scene from one source, and every purchased-asset route needs a second render path. (3) **Ordinary asset licences forbid exactly what this product does.** Sourced 2026-08-24 from the Unity Asset Store's own EULA FAQ: a product is not "incorporated" if it is `"designed to allow your end users to extract or download assets separately"` — which is precisely what our export menu is for — and a licensed product may not be built to let end users make their own digital products without the publisher's separate permission, which is precisely what this product is. ⛔ **And you sharpened this yourself an hour ago:** §524 rules the export **paid**, inside the `$2.99` dossier, buyable by an anonymous visitor with no account. So it would not be redistribution of someone else's art — **it would be selling it** |
| **The honest cost of saying yes** | **It will never be a painted map.** A working cartographer would call our hand competent and legible, not beautiful. If you want beautiful, row A2 is where you buy it — and it buys notes, not files |
| **What it does NOT decide** | It does not stop us buying a genre pack **later** as a separate product decision, and it does not touch the marketing video you already ship |
| **Overrule with** | one word, and the program in §5 changes shape but does not stop |

---

### GROUP A — THE THINGS WITH A CLOCK

#### **A1 · THE PROVENANCE AUDIT — DO WE RUN IT, AND WHEN?** — **measured**

| | |
|---|---|
| **What we found** | Your `THIRD-PARTY-NOTICES.md` is 521 lines and genuinely rigorous — every licence read out of the artefact rather than taken on trust. **It covers code, fonts and npm packages. It contains the word "texture" zero times, "heightmap" zero times, "heraldry" zero times, and no image, video or artwork row at all.** Meanwhile `public/` ships **176,499,727 bytes**, including 11.6 MB of textures in 23 files, 338 heraldic charge drawings, twenty-three heightmap images of real-world geography, 15.4 MB of page paintings whose painter is recorded nowhere, and 62.8 MB of video in seven files |
| **What that does and does not mean** | It does **not** mean anything is infringing. Most of it is probably fine — the map fork's MIT licence is broad and explicitly grants derivative works, and the exhibit plates were almost certainly generated by our own scripts. **It means nobody has checked, and the document that exists to record such checks does not cover them** |
| **Recommend** | ⭐ **Run it, and run it NOW.** It is read-only, it needs no build seat, and every week early is a week of slack |
| **The deadline it must not reach** | **Before the ONE trailing OSR mint.** After that point the tail is mint, parity, your review keystroke, the walk, the ONE regeneration, the soak, tuning and your signature — and the IP scrub sits at the very end with nothing behind it. If the audit finds an asset that is *drawn into settlement output*, replacing it changes what the engine draws, and that is a same-seed shift arriving after the one regeneration the tail has room for |
| **Cost if you say yes** | One research seat for a day or two, plus one small build car for the manifest and its walker |
| **Cost if you say no** | You find out at the IP scrub, when the only remaining move is to delay the push |

#### **A2 · A PAID CARTOGRAPHER'S REVIEW — YES OR NO?** — **taste**

| | |
|---|---|
| **The question** | Should we pay a working cartographer or illustrator once, for a critique of our glyph set and a written style note — **not for files** |
| **Recommend** | **Yes, one engagement, and only if you want the craft ceiling raised.** It is the one place outside money where a professional adds something we cannot generate |
| **Why it is safe** | A critique delivers *notes*. Notes have no licence, no lead time on the critical path, no provenance row, and no asset to regenerate. Everything they suggest, we then author ourselves |
| **⛔ This is a taste choice and there is no measurement under it** | We cannot tell you the craft delta is worth the cash, because there is no way to measure it before buying it |
| **If you say no** | Nothing in §5 changes. The program is complete without it |

---

### GROUP B — WHAT ILLUSTRATED MEANS

#### **A3 · THE REGISTER** — **measured** (the estate has already committed)

| | |
|---|---|
| **The question** | Hand-drawn cartographic, painterly, or stylised game-map? |
| **Recommend** | **HAND-DRAWN CARTOGRAPHIC — the clerk's document, not the artist's picture.** Ink line first, colour second, one light, oblique elevations, aged paper |
| **Why this is barely a choice** | Your illustrated lens already does it and is already in the picker. Painterly is refused on mechanism — it cannot be composed from strokes, so it cannot reach the PDF or the token raster through one source. Stylised game-map is not refused: it is a **genre pack**, and the door for it already exists |
| **The two rules that follow** | **A motif must read at 100% grey** (colour carries category and condition, never the thing itself), and **nothing lights itself** (one NW key, shared by the 2D hatch, the ground dress and the 3D bakes) |

#### **A4 · WHAT B13's "WORKING" LOOKS LIKE** — **taste** (the density; the vocabulary is **sourced**)

| | |
|---|---|
| **What you signed** | "Enough to read as lived-in, not cluttered." The fixture vocabulary is sourced — every drying frame, quench pit, bee bole, tenter strip and stokehole has a dossier behind it. The *density* is the chair's and was flagged as such |
| **What this lane adds** | ⭐ A simplification: **the three density bands are three cut points on ONE ordered list, not three lists.** `BUSY` is `WORKING` plus the layer that decline sheds first; `SPARSE` is `WORKING` minus everything but the signature fixture. One authored list per trade, three cuts |
| **Recommend** | Keep `WORKING`. The change above is an implementation simplification, not a re-opening of your band |

#### **A5 · THE CHAR STROKE** — **taste**, and it is small

| | |
|---|---|
| **What you signed** | B14's six-to-three wear mapping, including `burned -> broken`, knowingly — "a burnt fitting is not a used one" |
| **What we would add** | A burned fitting draws the broken silhouette **plus a heavier ink weight on the surviving strokes** — a char reading. **No new state, no new enum member, no new data**; it reads the condition the engine already carries |
| **Recommend** | **Yes.** It gives back a little of what the six-to-three collapse costs, for free |
| **Overrule with** | one word; the mapping you signed is unaffected either way |

---

### GROUP C — THE ONE THAT COSTS SOMETHING

#### **A6 · THE 3D BRANCH — WAKE THE MATERIAL LIBRARY?** — ⛔ **DEFERRED, and here is exactly what would decide it**

| | |
|---|---|
| **What exists** | A complete architectural grammar — 37 files, 331,627 bytes — with an instanced-asset kit, eleven materials crossed with six weathering classes baked into byte-deterministic textures, and rulesets for cathedrals, rose windows, vaults and buttresses. **It has 19 test files, a first-paint lazy pin, and ZERO importers anywhere in the running application.** It is reachable only from four offline generator scripts |
| **What it would give you** | The 3D diorama currently draws flat colour per material role. This would give it real stone, timber, brick and thatch, weathered by the same condition ladder the 2D uses |
| **⛔ Why we are not recommending it yet** | **The number that decides it does not exist.** The budget sheet measures triangles and draw calls and finds enormous headroom, but nobody has ever measured **how long the texture bake takes or how much memory the atlas costs on your machine**, because the kernel has never been wired to a live surface. Recommending a branch on an unmeasured cost is the thing this estate's charters exist not to do |
| **Recommend** | **Authorise the measurement (AD-6a) now — it needs no seat a build car wants and commits nothing — and decide this row when it reports.** If the bake is cheap, this is the single largest visual upgrade available for the least new authoring. If it is expensive, we leave the diorama flat and honest, and nothing is lost |

---

### GROUP D — THE TWO THAT ARE NOT DECISIONS BUT NEED YOUR EYE

#### **A7 · THE INTERIOR SQUARE** — **measured**, and it is the literal subject of B15

| | |
|---|---|
| **The measurement** | `interiorDraw.js` line 80: *"furnishings — **a small square per typed piece**, floor-tinted with an ink edge."* Twenty-two furnishing kinds, one square. That is what "abstract" means today, and that surface is **live and ungated** |
| **What changes** | The new dwellings plan pane (DW-6a) is born with motifs, so **that half costs no behaviour change at all**. Migrating the existing interior view is a separate car and it **does** change what a user sees, under every lens |
| **What we need from you** | Not a decision — **an eye.** One before/after sheet before the migration lands, exactly like the exhibit gate. It is on the sitting sheet only so it is not a surprise |

#### **A8 · WHAT AD WILL NOT DO** — **for information**

AD renders; it does not decide. It will not change a plan, invent a vocabulary member,
add an op to the cartography painter, touch VTT wall data, draw a storey the engine does
not have, mint a feature flag, mint a lens or a SKU, gate a viewing surface, author a
font, or let an AI author geometry. §6 carries the full list with the reason for each.

---

### THE SIGNING SHEET

| Row | What | Kind | Recommendation |
|---|---|---|---|
| **A0** | ⭐⭐ **Where the art comes from** | **measured** | **Made by us in code; nothing bought ships** |
| **A1** | ⭐ **The provenance audit and its deadline** | **measured** | **Run it now; it must not slip past the trailing OSR mint** |
| A2 | A paid cartographer's critique (notes, never files) | taste | Yes, one engagement — optional; the program is complete without it |
| A3 | The register | measured | Hand-drawn cartographic; line before colour; one light |
| A4 | B13 "working" density | taste (vocabulary sourced) | Keep WORKING; three cuts on one ordered list |
| A5 | The char stroke on `burned` | taste | Yes; no new state |
| A6 | The 3D material branch | ⛔ **deferred** | Authorise the measurement; decide on its number |
| A7 | The interior square | measured | No decision — your eye on one before/after sheet |
| A8 | Anti-scope | information | — |

**What a "yes to everything" unblocks immediately:** AD-1 (the audit) and AD-6a (the 3D
measurement) both dispatch into research seats today, neither commits anything, and
neither competes with a build car. AD-4a (the motif contract) dispatches into the next
free build seat. Everything else waits on MP-1, on DW, or on your answer to A6.

## §8 · THE LEDGER

### §8.1 · THE JUDGMENTS — each vetoable by one word

| # | Decided | Why | Rejected | Reversal |
|---|---|---|---|---|
| **J-AD-1** | A DW vocabulary member addresses its motif **by enum member through a registry**, never by string match. The 18 name regexes in `glyphAssign.js:90-109` keep their existing job on the town map and never grow a second one | A prose match against a closed enum is a category error that mis-draws silently the moment a name changes, and the estate has been bitten by prose-token pins before | Extending `EXACT_RULES` to 82 fixture kinds — cheaper to write, and wrong | Delete the registry indirection and add regexes. Nothing else depends on the choice |
| **J-AD-2** | **AD mints ZERO feature flags.** Dark cars are dark by reachability; anything needing a switch inherits DW-7a's | The DW charter argued the same posture and the estate's one-flag rule prefers it; a flag costs the six-surface bill | One AD flag for the illustrated interior — rejected because AD-5e must land before the one regen anyway, so a flag buys nothing but a bill | Mint one. It would be a new gate and therefore an owner-class act |
| **J-AD-3** | **No `ROOF_FORMS` enum.** A roof form is derived at draw time from parti x material x tier | DW law 4, derive-don't-store. There is no roof enum in `src` or in the charter's §2 today, and creating one would make the drawing a source of truth | A stored roof form per building — simpler to draw, but a second truth and a persistence-shape change | Mint the enum; it becomes an owner-gated persistence decision at that point |
| **J-AD-4** | `burned` draws the **broken silhouette plus a char stroke** (heavier ink on surviving strokes) | Gives back a little of what B14's signed six-to-three collapse costs, at zero data cost — it reads a condition the engine already carries | A fourth wear state — rejected: it re-opens a signed band | Drop the char stroke. §7 row A5 |
| **J-AD-5** | The **register is hand-drawn cartographic** and painterly is refused on mechanism, not taste | Painterly cannot be composed from strokes, so it cannot reach the PDF and the token raster through one geometry source | Painterly as the default; stylised game-map as the default | Refusing painterly is a mechanism claim — refute it by showing a raster path that keeps the PDF and thumbnail identical, and the refusal falls |
| **J-AD-6** | **B13's three density bands are three cut points on one ordered motif list per trade**, not three lists | One authored list, three cuts; and it makes `BUSY` exactly `WORKING` plus the layer the wear ladder sheds first, so density and decay share one mechanism | Three separately-authored densities — three times the authoring and three ways to disagree | Author them separately. §7 row A4 |
| **J-AD-7** | **Nothing AD authors goes in `public/`** except a generated exhibit plate carrying an `ASSET_MANIFEST.json` row that names its generator script and commit | `public/` is copied verbatim, is not tree-shaken and is not lazy, and it is where the un-inventoried payload of §1.2 already lives | Shipping motif data as JSON under `public/` — rejected: it leaves the tree-shaker and re-creates the provenance gap | Move a library to `public/`; the walker in AD-2 would then demand its manifest row, which is the intended friction |

### §8.2 · OPEN QUESTIONS

| # | Question | Who owns it | What would settle it |
|---|---|---|---|
| **Q-AD-1** | ⛔ **What is the actual provenance of the 176 MB under `public/`?** Specifically: the 23 FMG textures, the 338 heraldic charges, the 23 real-world heightmaps, the 55 page paintings, and the seven video files (62,821,740 B) | **AD-1**, then the owner and counsel for anything AD-1 cannot resolve | The audit. This is the launch blocker and everything else in this ledger is smaller |
| **Q-AD-2** | Did Azgaar hold the rights he granted over the *art* bundled in the FMG fork, as distinct from the code? | AD-1; escalates to counsel | Upstream repository history and the assets' own metadata. ⚠ A "cannot determine" is a legitimate finding and triggers a REPLACE-or-REMOVE decision, not a shrug |
| **Q-AD-3** | What does the 3D texture bake actually cost — wall clock and atlas memory — on the owner's machine class? | **AD-6a** | The measurement. §7 row A6 is deferred on precisely this |
| **Q-AD-4** | Q-B from the dwellings charter, inherited unchanged: **is `heightPermille` sufficient to carry a storey count, or does the massing block need a storey field?** | the chair, with the D5 strata wave | AD does not answer it and refuses to draw a storey until it is answered (§2.5, §6) |
| **Q-AD-5** | Should the illustrated lens eventually become the **default** lens rather than the sixth? | the owner | Not now, and deliberately not proposed here: `DEFAULT_STYLE_ID = 'parchment'` is pinned by the `parchment === legacy bytes` golden, and moving it is a shift across every surface at once |
| **Q-AD-6** | Does a genre pack become a **paid** surface? | ⛔ the owner alone — paid-surface class | Nothing in AD proposes it. Recorded so a later lane does not drift into it: `LENS_COUNT` is a paid row and §514.1 forbids a map-specific SKU |

### §8.3 · SINGLE-SOURCED AND INFERRED CLAIMS — stated affirmatively

Everything below is load-bearing somewhere above and is **not** independently corroborated.
A reader should treat these differently from the measured rows.

| Claim | Standing | What would confirm or refute it |
|---|---|---|
| **Ordinary commercial asset licences forbid this product's shape** | **Sourced, but from ONE primary document fetched this session (2026-08-24): the Unity Asset Store EULA FAQ.** A search digest of the same date showed the same pattern across several other vendors, but those were read as search summaries, **not fetched** | Fetch two or three more vendor EULAs directly. ⚠ **And this is a legal question the estate has counsel-gated elsewhere** (TinyMCE, ODQ §254.5.5/§295); the recommendation in §1 does not depend on the legal reading being right, because the Promise disqualifies the option independently |
| **CC0 packs exist and are legally clean for this use** | **Search digest only, 2026-08-24.** Named example: a widely-known free CC0 cartography pack of roughly 85 assets | Fetch the pack's licence page. Not load-bearing: the CC0 branch is rejected on the other four tests, not on licence |
| **The `public/landing-maps/**` plates were generated by our own `scripts/generate-k*.mjs`** | ⚠ **INFERENCE from filenames plus the existence of the generators.** No provenance record exists in the tree | AD-1. If true it is the easiest manifest section to write; if false it is a finding |
| **The FMG-bundled textures and charges may not be Azgaar's to relicense** | ⚠ **INFERENCE about a general mechanism** — an MIT header at a repository root does not retroactively acquire rights the packager never held. **It is NOT a finding that any specific asset is infringing** | AD-1 / Q-AD-2 |
| **Cost and lead-time figures for commissioned art and licensed packs** | ⚠ **Lane estimates.** The estate has no procurement record to measure against, and this lane made no enquiries | Only a real quote would settle it. Not load-bearing: the recommendation turns on determinism and the one-geometry property, both measured internally |
| **AI image models reproduce trademarked iconography on ordinary prompts** | **General knowledge, not verified this session** | Not load-bearing: the AI option is disqualified on determinism first |
| **The arch kernel has zero production importers** | **MEASURED**, by grepping every arch module name across `src`, `tests` and `scripts` at the slot — hits only from four generator scripts and the observed-shape-readers baseline. Recorded here because it is surprising, not because it is uncertain | Re-run the grep at the tip |

### §8.4 · DEFERRALS — deliberate, documented, not bugs to re-find

| # | Deferred | Why | Where it goes |
|---|---|---|---|
| **D-AD-1** | The 3D material branch (AD-6b, AD-6c) | Its cost is unmeasured. Deciding a branch on a missing number is the failure mode the charters exist to prevent | §7 row A6, gated on AD-6a |
| **D-AD-2** | AI-authored glyph geometry | THE WALL: select, never author. Already a named deferral to the trust ladder at `townGlyphs/index.js:8-9` (design §5, S4+). **AD does not spend that deferral** | the trust ladder |
| **D-AD-3** | Genre packs beyond `medieval` | The door is built and costs nothing per pack; which packs and when is a product decision, not an AD one | the owner, post-launch |
| **D-AD-4** | Making illustrated the default lens | Q-AD-5. The `parchment === legacy` golden pins the default and moving it shifts every surface at once | the owner |
| **D-AD-5** | The nine vendored libraries shipped with no notice, and the TinyMCE GPL posture | ⚠ **NOT AD's, and named here only so AD-2's walker does not appear to have covered them.** They are already recorded at `THIRD-PARTY-NOTICES.md`'s own §1.4 and §1.5 and open at ODQ §254.5.5/§295 | counsel, unchanged |
| **D-AD-6** | Retiring `public/parchment-bg.jpg`-class orphans and any other unreferenced payload | Out of AD's scope as a *decision*, but AD-1's enumeration will surface them and AD-2's walker will keep them surfaced | AD-1's remediation list |
| **D-AD-7** | Any answer to charter Q-B (the storey-count seam) | The chair's, with the D5 strata wave. AD refuses to draw a storey until it lands | the chair |
| **D-AD-8** | **D-EXPORT-1, inherited unchanged** (ODQ §524.5): `hasDrawableMap` self-gates the PDF map plate, so a settlement whose map cannot be built ships a paid dossier with no map. Not a defect today, because the plate reads the landed townMap model rather than the dark cartography stage | ⚠ **It becomes one the moment DW-6 re-points the plate at the cartography stage.** AD does not fix it and must not widen it; both WEB-8b's arm and DW-6's acceptance already carry the pin | WEB-8b and DW-6 |

### §8.5 · WHAT THIS LANE DID NOT DO — stated affirmatively

- **It ran no tests and no build.** Every claim about the code is a read at
  `5055990a38a281b5a5f63648c74e65c0837de7ef`, by `git show`, `git grep` and `git ls-tree`
  against committed blobs. No worktree was created; nothing was committed; the repository
  is untouched.
- **It measured nothing in a browser** and took no wall-clock measurement of anything.
  Every performance figure quoted comes from `docs/KERNEL_K1_BUDGET_SHEET.md` or from a
  budget constant in a test file, and is attributed as such.
- **It did not open the 176 MB of assets.** §1.2 is an inventory by path, byte count and
  the absence of notices rows — not an examination of the images themselves. **That
  examination is AD-1 and it is the whole point of AD-1.**
- **It did not verify the dwellings charter's own measured rows.** Where this charter cites
  charter §0 H5, H6, H23, H24 or H25, it is citing a **ratified** document (§506) that had
  its own skeptic panel; two rows (H23's `heightPermille` and H5's absence of storeys) were
  spot-re-verified at the slot by this lane and both held.
- **It contacted no vendor and obtained no quote.** The cost and lead-time columns for the
  commissioned and licensed options are estimates and are marked as estimates.
- **Its web research was three calls**: two searches and one page fetch, all on 2026-08-24,
  all recorded in §8.3 with their standing.

### §8.6 · METHOD DISCLOSURE

**Inputs read whole:** ODQ §454.4, §482, §495, §499.2, §502, §506, §514 (all), §515, §522.6,
§523, and — read at the close, after the ledger tip moved under this lane — §524; `SIGNED-BANDS-2026-08-23.md`; `695a70c5/scratchpad/SLOT-FACTS.md`;
`draft-DWELLINGS-CHARTER.md` (its own) §2, §5.8, §5.10, §7 and its §Σ amendment record;
`draft-DWELLINGS-ARCHITECTURE.md` arch-4's DW-6 rows; `draft-DWR1A-CONSTRUCTION-HISTORY.md`
§2; the DWELLINGS charter's §2.7 yard vocabulary and wear ladder; memory files
`ip-exposure-measured-2026-08-07`, `product-scope-boundaries`, `the-promise-ratified`,
`game-grade-ux-doctrine`, `legibility-law`.

**Code read at the slot:** `townMapStyles.js`, `townGlyphs/{index,medieval,glyphCompiler}.js`,
`glyphAssign.js`, `townMapDraw.js`, `groundDress.js`, `mapDress.js`, `townMapStyleWall.js`,
`SettlementMapIllustratedUnderlay.jsx`, `SettlementMapPane.jsx`, `cartographyPaint.js`,
`cartographyColours.js`, `interiorDraw.js`, `interiorExport.js`, `interiorTemplates.js`,
`townSceneRuntimeMaterials.js`, `sceneExportPalette.js`, `scenePortraitExport.js`,
`arch/kit.js`, `arch/materials/materials.js`, `entitlementLadder.js`, `TownMapDocument.jsx`,
`townMapExport.js`; plus `THIRD-PARTY-NOTICES.md`, `public/BACKGROUND.md`,
`public/map/LICENSE-FMG.txt`, `docs/KERNEL_K1_BUDGET_SHEET.md`,
`docs/implementation/PACKET_STANDARD.md`, `scripts/.size-baseline.json`,
`tests/build/{vendorPdfLazy,firstPaintNonJs,townMapLazy}.test.js`.

**Instruments checked against the SLOT-FACTS six throughput laws.** ⚠ Two of the four
silent-liar traps fired during this lane and were caught: an unbraced `$S:path` was eaten
by the zsh modifier and produced a `fatal: ambiguous argument` rather than a wrong answer
(braced thereafter), and a `git grep -E '\bIT-[0-9]'` returned **zero** hits against a
control that should have matched — the `\b` is not honoured, and re-running without it
returned the whole ILLUSTRATED TOWN program that this charter is built on. **A negative
grep with no positive control would have lost the headline finding of this document.**

**C0 scan:** 0 across every authored part, decoded as UTF-8. The non-ASCII inventory is
the same marker set the ratified dwellings charter uses and passed "emoji 0" against
(`§ — · → Σ ⛔ ⚠ ⭐` and the mathematical operators); no character above U+2B50 appears.

---

## §Σ · THE ONE PAGE THE CHAIR RULES FROM

1. **There is no long-lead artwork branch.** The estate already built the procedural
   illustrated pipeline — 27 glyphs, ground dress, season portrait, an AI re-skin wall,
   and a dormant 37-file material grammar — and the illustrated lens is live and free in
   the picker today.
2. **The schedule risk is provenance, not art.** `public/` ships 176,499,727 bytes of
   images, textures, heraldic charges, real-world heightmaps, page paintings and video,
   and `THIRD-PARTY-NOTICES.md` — a rigorous document — covers **code, fonts and npm
   packages only**. Zero art rows.
3. **The last responsible moment to start the audit is before the ONE trailing OSR mint.**
   After that, a single finding that touches drawn output forces a second regeneration and
   the tail has room for one. ⭐ **Start it now anyway: it is read-only and costs no build
   seat.**
4. **Buy nothing that ships.** Three of four options cannot be re-derived from a seed;
   the Promise disqualifies them before the licensing question is even reached. Ordinary
   asset licences then disqualify the purchased routes a second time, on the export lane —
   and §524's take-away ruling makes that export a **sale**, not merely a redistribution.
5. **The register is already chosen and is correct:** hand-drawn cartographic, line before
   colour, one NW light shared by 2D and 3D.
6. **Four cars can start with no dependency at all** — AD-1 (audit), AD-6a (the 3D
   measurement), AD-4a (the motif contract) and AD-4c (the wear ladder). Two of them
   commit nothing.
7. **Two declared shifts, one flag budget of zero.** AD-4b moves the illustrated lens's
   goldens once; AD-5e moves the live interior once and must land before the one regen.
   AD mints no flag, no lens, no SKU and no paid surface.
8. **Row zero is the owner's:** where the art comes from. Everything else in §7 follows
   from it.

