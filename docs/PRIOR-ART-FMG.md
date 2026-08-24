# PRIOR ART — Azgaar's Fantasy Map Generator (FMG)

**Lane:** MF-X1b (Opus 5) · **Charter:** ODQ §248 · **Form:** reconstruction form (ODQ §246)
**Status:** COMPLETE — written incrementally, section by section, as the study proceeded.

**THE THREE HEADLINES, for a reader who stops here:**

1. ⭐⭐ **FMG contains no town-plan generator at all** (§2.1). A burg is an icon, a label
   and thirty scalar fields; plans are delegated by URL to Watabou's *closed* generators.
   The only open implementation has a world and no plans; the leading plan generator has
   plans and no world. **Nobody ships the join** — which is the artifact our whole map
   program builds, and it makes §247's strategy structurally sound rather than merely
   plausible.
2. ⭐ **The transferable gold is architectural, not cartographic** (§7): an
   identity-derived dither that consumes no PRNG state (§1.4), per-stage stream
   derivation (§3.2), and the road-network recipe whose **reuse discount makes hierarchy
   emerge** rather than be labelled (§2.3). The first two are the arithmetic that makes
   our inertia law true instead of merely asserted.
3. ⛔ **Adopt zero code** (§2.4, §9). The license is genuinely MIT for Azgaar's own work,
   but `public/libs/tinymce/` is **GPLv2-or-later**, and the one utility most worth
   copying is third-party code the project itself copied in and cannot license to us.

**Subject:** `github.com/Azgaar/Fantasy-Map-Generator`, shallow clone of `master` at
commit `992246f213b13146595d0eceb7cac7e2c7cf6586`, version **1.143.2**, dated 2026-08-15.
Read-only study. No code executed, no code copied.

**Verdict vocabulary** (ODQ §246): ADOPT-AS-APPROACH · ADOPT-CODE-WITH-ATTRIBUTION ·
ALREADY-HAVE · DELIBERATELY-DIFFERENT · NOT-APPLICABLE.

---

## 0. LICENSE ASSESSMENT

### 0.1 Top-level grant — CONFIRMED MIT, with an unusual extra paragraph

`repo/LICENSE` is byte-identical to the separately fetched `xref-fmg/LICENSE.fetched`
(both 1353 bytes). It is a standard MIT License, `Copyright 2017-2024 Max Haniyeu
(Azgaar)`, with one **non-standard added paragraph** inserted between the MIT
conditions and the warranty disclaimer:

> "You can produce, without restrictions, any derivative works from the original
> software and even reap commercial benefits from the sale of the secondary product.
> The derivates include created maps, map images, screenshots, videos, and other materials."

This paragraph is a grant, not a restriction — it broadens rather than narrows, and
explicitly clears the *output* question (maps, images, screenshots) that MIT alone
leaves ambiguous for some readers. `package.json` independently declares
`"license": "MIT"`.

**Obligation if we ever adopt code:** the MIT clause "The above copyright notice and
this permission notice shall be included in all copies or substantial portions of the
Software" is a **shipped-artifact obligation**, not a repo-only one. Adoption of even a
single function requires the notice to travel into anything we distribute — i.e. a
`THIRD-PARTY-NOTICES` file bundled with the shipped product, not merely a line in a
design doc.

### 0.2 Per-directory and vendored variance — THE TOP-LEVEL GRANT DOES NOT COVER THE TREE

The charter's suspicion was correct. There are exactly two license files in the whole
checkout (`find . -iname "*licen*"`, excluding `.git`): the top-level `LICENSE`, and
`public/libs/tinymce/license.md`. The second one is not MIT.

**⛔ `public/libs/tinymce/` is GPLv2-or-later.** `public/libs/tinymce/license.md` reads:

> "Copyright (c) 2024, Ephox Corporation DBA Tiny Technologies, Inc. Licensed under the
> terms of GNU General Public License Version 2 or later"

The vendored build is TinyMCE 7.1.0 (2024-05-08), 763 KB of `tinymce.min.js` plus 31
plugin directories. TinyMCE relicensed from LGPL to GPLv2+ at version 7, and this tree
carries the post-relicense build. **Consequence:** a wholesale copy of "the FMG repo"
under the assumption "it's MIT" would pull a copyleft component into our product. Our
clean-room default already forecloses this, but it must be stated: *the project's own
code is MIT; the tree as shipped is not uniformly MIT.*

**Other vendored components carry their own headers** (`public/libs/`, **20 files** beside
the `tinymce/` directory, none covered by the top-level grant):

| File | Stated license (from its own header) |
|---|---|
| `alea.min.js` | ©2010 Johannes Baagøe **MIT**; derivative ©2017-2020 W. Mac McMeans **BSD** |
| `d3.min.js` | d3 **v5.8.0**, ©2019 Mike Bostock (ISC/BSD-3 upstream) |
| `three.min.js` | `SPDX-License-Identifier: MIT`, ©2010-2022 Three.js Authors |
| `jszip.min.js` | v3.6.0 — **dual MIT or GPLv3**, bundles pako (MIT) |
| `jquery-3.1.1.min.js`, `jquery-ui.min.js`, `jquery-ui.css` | MIT (jQuery Foundation) |
| `jquery.ui.touch-punch.min.js` | **dual MIT or GPLv2**, ©2011-2014 Dave Furfero |
| `loopsubdivison.min.js` | MIT, ©2022 Stephens Nunnally (three-subdivide) |
| `rgbquant.min.js` | MIT, ©2015 Leon Sorokin |
| `simplify.js` | ©2017 Vladimir Agafonkin (Simplify.js, BSD-2 upstream) |
| `mapControls`, `orbitControls`, `objexporter` | three.js examples, MIT, headers stripped |
| `polylabel.min.js`, `delaunator.min.js`, `flatqueue.js` | headers stripped in the minified build (ISC/MIT upstream) |
| `dropbox-sdk.min.js` | header stripped (MIT upstream) |
| `openwidget.min.js` | **proprietary hosted widget** — ships a hardcoded `organizationId` |

Two incidental observations worth carrying:

1. **Several vendored files have had their license headers stripped by minification**
   (`polylabel`, `delaunator`, `flatqueue`, `dropbox-sdk`, the three.js example
   controls). This is the exact failure mode a `THIRD-PARTY-NOTICES` file exists to
   prevent, and it is a live example of why our own obligation would be a *shipped*
   notices file rather than an in-repo comment.
2. **`openwidget.min.js` embeds a live third-party support-widget organization id.**
   It appears unreferenced from `src/index.html`, but its presence in a vendored libs
   directory is a reminder to audit vendored trees for phone-home code, not only for
   licenses.

**Net license verdict.** The owner's report ("MIT") is accurate *for Azgaar's own
code*, which is the only part we would ever consider adopting, and the added paragraph
makes the output/derivative question unusually clear. The obligation on adoption is
attribution via a shipped notices file. The caveat is that `public/libs/tinymce/` is
GPLv2+, so "the repo is MIT" must never be restated without the directory carve-out.

---

## 1. THE WORLD→SETTLEMENT DERIVATION (charter priority 1)

This is where the charter expected the yield, and it is where the yield is. FMG derives
a settlement's every property from a **single scalar suitability field over Voronoi
cells**. Understanding that one design decision explains almost everything else.

### 1.0 The pipeline order (the thing images cannot show)

From `public/main.js` (the legacy monolith survives as the orchestrator even though the
generators are now TypeScript modules under `src/`), the generation sequence is:

```
setSeed → generateGrid → HeightmapGenerator.generate → Features.markupGrid
→ OceanLayers → temperatures → precipitation → reGraph → Features.markupPack
→ Rivers.generate → Biomes.generate → Ice → Goods.generate
→ rankCells()            ← the suitability field is computed HERE
→ Cultures.generate → Cultures.expand
→ Burgs.generate()       ← placement only (where, not what)
→ States.generate → Routes.generate → Religions.generate
→ Burgs.specify()        ← population, emblem, features, group
→ Provinces → Rivers.specify → Lakes.defineNames
→ Markets.generate() → Production.produce → States.collectTaxes
→ Military → Markers → Zones → AddedLabels
```

The load-bearing observation: **placement and specification are split across the
pipeline**, with states, routes and religions generated in between. That split is what
lets population depend on route connectivity and temple depend on state form — the
settlement is specified only once its context exists. This is a genuinely good idea and
it is the structural reason their burgs feel embedded in a world.

**VERDICT: ADOPT-AS-APPROACH.** Our pipeline should preserve the same split — anchor
placement early, specify late, after the facts a settlement's character depends on are
themselves settled. Derivation home in our dossier: the district-organism anchors
(§161d) are the placement stage; the fabric specification is the late stage.

### 1.1 `rankCells()` — the one scalar everything hangs on

**What it does.** Computes `cells.s` (suitability) and `cells.pop` (rural population)
for every land cell. Cited location: `public/main.js:1088`.

**How (my words).** Start from the cell's biome habitability; a zero-habitability biome
is skipped outright and never bears population. Add a large river term — flux plus
confluence, normalized against the median and maximum flux across the map, scaled by
250, which makes big rivers and confluences by far the strongest positive signal. Apply
a mild elevation penalty proportional to height above the mid-scale. If the cell is
coastal, add a bonus selected by what it borders: an estuary (river meeting coast)
scores 15, plain ocean coast 5, a *safe harbour* a further 20, and lakes score by their
group — freshwater 30, salt 10, frozen 1, dry −5, sinkhole −5, lava −30. Divide the
total by 5. Then add a resource term derived from the goods layer: the cell's own good
value plus 10, plus the mean good value of its neighbours. Finally, rural population is
that suitability **scaled by the cell's own area relative to mean cell area**, which
corrects for the irregular Voronoi tessellation.

Two details worth carrying:

- `cells.s` is an **`Int16Array`**, so suitability is truncated to an integer on store.
  Every downstream population figure inherits that quantization — and since burg
  population is `s / 5`, populations land on a 0.2-wide lattice before jitter. Their
  "unround" dither (§1.4) exists partly to hide this.
- The area-relative correction (`s * area / meanArea`) is the right instinct and matches
  our own **area-true predicate** non-negotiable: a quantity that means "per place" must
  be normalized by the irregular cell's real area, never counted per cell.

**VERDICT: ADOPT-AS-APPROACH, in the reverse direction.** We must not adopt "population
derives from terrain" — our population is a *dossier fact*, and inverting it would
violate the truth-to-dossier promise that §247 identifies as the entire differentiator.
What we should adopt is **the suitability field as a spatial input to siting**: a scalar
that ranks locations by habitability, river access, harbour quality and resource
proximity is precisely the missing ingredient in §161d's district anchoring
(`suitability × affinity × siting ring`) and §161c's outlying-institution placement
(the mill AT its water, the quarry AT its stone). Today our anchor term "suitability" is
named but thinly derived; FMG shows a cheap, legible, fully-derived construction for it.
**Derivation home:** the dossier's terrain/hydrology substrate (§161a) plus the economy's
goods surface — both of which we already have.

### 1.2 Capital and town placement — score-sorted greedy with quadtree spacing

**What it does.** Chooses which cells host settlements, and guarantees they are spread out.

**How (my words).** Both passes follow one shape: perturb the suitability score, sort all
populated cells descending by the perturbed score, then walk the sorted list greedily
accepting a cell only if a spatial index (a d3 quadtree of already-placed points) finds
no existing settlement within a minimum spacing. Capitals perturb by a mild uniform
factor (half to full score) and use a spacing of *(width+height)/2 divided by the number
of capitals* — i.e. spacing derived from the map's own dimensions and the target count.
Towns perturb far more aggressively, with a Gaussian of wide deviation, so that town
placement is not simply "the next best cells" — this is what stops towns from forming a
halo around every capital.

The interesting engineering is in the **failure handling**, and the two passes solve it
differently:

- *Capitals* — if the sorted list is exhausted before enough capitals are placed, the
  whole placement is **discarded and restarted** with spacing reduced by a factor of 1.2,
  including resetting the quadtree and the burg array (`burgs-generator.ts:86-92`).
- *Towns* — no restart; the outer loop simply **halves the spacing** and re-walks the
  list, adding to what is already placed, until the target count is met or spacing falls
  below 1 (`burgs-generator.ts:115-144`).

**Honest assessment.** The town approach (monotonic relaxation, keep what you have) is
clearly the better of the two; the capital approach throws away work and, because each
restart re-runs the same sorted walk, is quadratic in the pathological case. FMG
contains both patterns side by side, which reads as the town pass being the later,
wiser rewrite.

**VERDICT: ADOPT-AS-APPROACH** — specifically the **monotonic spacing-relaxation loop**:
*place greedily under a minimum-separation constraint; if the quota is unmet, relax the
constraint and continue rather than restart.* We need exactly this for district-organism
anchors (§161d, where the lobe count is derived and must actually be achieved) and for
institution siting (§161c). The property that matters is that the loop **always
terminates with the derived count satisfied**, which a naive rejection sampler does not
guarantee — and a derived count that silently comes up short would be a truth defect,
not a cosmetic one. Adopt the *town* variant; do not adopt the capital restart.

### 1.3 Population — and a genuine defect: the same fact derived two different ways

**What it does.** Assigns `burg.population` (in arbitrary units later multiplied by a
`populationRate` option for display).

**How (my words).** In `burgs-generator.ts:362-371` (`definePopulation`): take the cell's
suitability divided by 5; multiply by 1.5 if the burg is a capital; multiply by the
cell's **route connectivity rate**; multiply by a Gaussian jitter centred on 1; then add
the "unround" dither (§1.4) and clamp to a small positive floor.

**⚠ THE DEFECT.** `src/generators/population-generator.ts` — the module invoked when the
user regenerates populations without regenerating burgs — computes the *same quantity*
by a **different law**:

> `burg.population = rn(Math.max(pack.cells.s[cellId] / 8 + burg.i / 1000 + (cellId % 100) / 1000, 0.1), 3);`
> then `*= 1.3` if capital, `*= 1.3` if port, then `* gauss(2, 3, 0.6, 20, 3)`
> — `src/generators/population-generator.ts:10-13`

Divergences: suitability divided by **8** rather than 5; capital multiplier **1.3**
rather than 1.5; a **port** multiplier that the primary law does not have at all; **no
connectivity term** at all; and a Gaussian centred on **2** rather than 1, which roughly
doubles the whole distribution. Pressing "regenerate population" therefore does not
recompute the population — it computes a *different quantity with the same name*, on a
different scale, that has forgotten that roads matter.

**VERDICT for us: ALREADY-HAVE, and this is our law working.** This is precisely the bug
class our **single-writer** discipline and the **structural-prevention** ratchets exist
to forbid: one fact, one derivation site. The transferable lesson is a **guard we should
confirm we hold**: any quantity with more than one lifecycle path (generate / regenerate
/ edit / migrate) must be derived by exactly one function that all paths call. Note the
resonance with our own most-bitten class — the write that survives one path and ghosts
another. FMG has the map-generator version of it, sitting in production.

### 1.4 ⭐ THE "UNROUND" DITHER — the single most transferable idea in the codebase

**What it does.** Breaks ties and removes the artificial roundness of derived population
figures, without drawing a random number.

**How (my words).** After the population is computed, FMG adds a tiny deterministic
offset built purely from **stable integer identities** — the burg's own index and its
cell's index, each taken modulo 100, differenced, and scaled down by a thousand:

> `population += (((burg.i as number) % 100) - (cellId % 100)) / 1000; // unround`
> — `src/generators/burgs-generator.ts:369`

The effect is a sub-0.1 perturbation that is (a) fully determined by identity, (b)
different for every burg, (c) **consumes no PRNG state**, and (d) makes the population
values effectively unique — which is what allows the later percentile classification to
use a plain `indexOf` on the sorted population array and get a stable answer.

**Why this matters to us far more than it matters to them.** Our **inertia law**
(§161h/§11.0) requires that unchanged facts render byte-unchanged and changed facts
change *locally*. Any mechanism that perturbs a value by **drawing from a shared random
stream** violates that law structurally: consuming one extra draw shifts every
subsequent draw, so adding a single building in one district silently re-rolls the
entire rest of the settlement. An **identity-derived dither** has the same visual effect
— non-round, non-uniform, organic-looking numbers — with *zero* stream coupling. It is
locality-preserving by construction.

**VERDICT: ADOPT-AS-APPROACH, ranked #1 in this study.** Wherever our fabric wants
"jitter", "variance" or "unround this number", the mechanism should be a pure function
of stable entity keys (the exact keys §11.0 already requires for inertia), never a draw
from a sequential stream. This is a small idea with disproportionate architectural
consequence: it is the difference between an inertia law we assert and an inertia law
the arithmetic cannot break. **Derivation home:** the entity-key surface MF-ARCH's
lineage-id work is already building.

*Caveat worth stating:* their specific construction (`% 100` on two ids) is a weak hash —
it is periodic, and correlated ids produce correlated dither. We should use a real
integer hash of the entity key, not this expression. The *idea* is what transfers, which
is also the clean-room-correct outcome.

### 1.5 Port assignment — the best-argued mechanism in the codebase

**What it does.** Decides which burgs are ports, on which water body, and nudges their
coordinates onto the shoreline.

**How (my words).** Every unlocked burg is first tested as a *candidate*, in two flavours.
A **sea/lake candidate** requires the cell to have a `haven` (an adjacent water cell) and
a nonzero `harbor` count, requires the water feature to be larger than one cell, excludes
lake groups flagged non-navigable, and excludes frozen water by testing the grid
temperature. If the water is a lake with an outlet, the port is registered not against
the lake but against the **feature the lake drains into** — so lake ports join the river
trade network rather than forming an isolated puddle economy. A **river candidate**
requires the river at that cell to be navigable and resolves the drain feature similarly.

Candidates are then bucketed **by water body**, and within each bucket a selection runs:
burgs that are "preferred" (a safe harbour, a capital on a harbour, or any river port)
are promoted unconditionally; then, for each *landmass* present in the bucket that has
no port yet, the best-ranked candidate is promoted, where rank favours capitals heavily
and then harbour quality. Finally — and this is the clever part:

> `if (promoted.size < 2) return []; // a sea route needs two endpoints; a lone port is useless`
> — `src/generators/burgs-generator.ts:292`

**A water body that cannot support at least two ports gets none at all.** The rule is
relational: a port exists to trade *with* somewhere, so a single port on an isolated lake
is not a port, it is decoration. Promoted burgs then have their coordinates moved 95% of
the way toward the midpoint of the shared cell edge (`getCloseToEdgePoint`), so the icon
sits on the water's edge rather than in the middle of its cell; non-port river burgs are
instead shifted perpendicular to the local river tangent onto a bank, with the side
chosen by cell-index parity and the distance scaled by river flux.

**VERDICT: ADOPT-AS-APPROACH, ranked #2.** Two distinct ideas transfer:

1. **The two-endpoint rule as a general principle.** Our §205 (river navigability, river
   class follows function) and our institution siting (§161c/§161n) should carry the same
   relational test: *an economic feature whose counterparty does not exist is a
   contradiction, and the resolution is to remove the feature.* A quay on a water body
   with nowhere to sail is exactly the "trade-bearing settlement on a brook" contradiction
   §205.2 already names — FMG shows the general form of the cure.
2. **Draining-feature resolution.** Registering a lake port against the *drainage network*
   rather than the lake is a small idea with real consequence for trade-network
   connectivity, and it maps directly onto our river-class ladder.

The coordinate-nudging (95% toward the shared edge; perpendicular-to-tangent bank offset)
is **NOT-APPLICABLE** — it solves the problem of placing a *point icon* on a coarse
Voronoi cell. We place real fabric with real footprints against a real shoreline, so we
have no such proxy problem.

### 1.6 Feature flags — where their model is thinnest and ours is strongest

**What it does.** Sets `citadel`, `walls`, `shanty`, `temple` on each burg.

**How (my words).** Pure population thresholds interleaved with coin flips
(`burgs-generator.ts:389-399`). A citadel is certain for a capital, otherwise 75% likely
above population 50, 50% likely above 15, and 10% likely regardless. Walls are certain
for a capital or any burg above population 30, 75% above 20, 50% above 10, and 10%
otherwise. A shantytown appears above population 60, or 75% of the time above 40, or 40%
of the time above 20 *if the burg is walled* — the one genuine relational term here, and
a historically correct one, since shanties accrete against walls. A temple is likely for
large burgs, and gets an extra 50% chance if the cell has a religion and the owning
state's form is a Theocracy — the second relational term.

**VERDICT: DELIBERATELY-DIFFERENT, and ours is decisively better — this is our
differentiation in one function.** In §246's vocabulary, `|| P(0.1)` is **decoration**:
a fortified settlement that is fortified because a coin landed heads has no derivation
home, and no answer to "why is this town walled?". Our model derives fortification from
recorded events, high-water population (§161f) and the epoch ladder (§240), so our walls
carry a date, a cause and a vintage. Two honest observations, though:

- **Their thresholds are calibration data we can use for free.** The population
  break-points (walls ~30, citadel ~50, shanty ~60, temple ~50) encode a widely-played,
  much-tuned intuition about what size of settlement carries what institution. Our
  §161n institution-scale law needs exactly such a ladder, and while we will derive
  *whether* from facts, the *plausibility band* is a sanity check worth having.
- **The shanty-needs-walls coupling is worth copying as a relation** (not as code): it is
  the same insight as our §190d faubourg law — extramural growth is a consequence of the
  wall existing, not an independent roll.

### 1.7 `plaza` — a cross-layer derivation, and an ordering defect

**What it does.** `plaza` marks a market square. It appears in the `Burg` interface, in
group classification predicates, and in the external-generator parameters.

**How (my words).** Unlike the other feature flags, **`defineFeatures` never sets
`plaza`.** It is written exclusively by the *economy* layer: `markets-generator.ts:173`
sets it for any burg that is a trade centre, and `:277`/`:298` set it when a market
centre is assigned or moved. Conceptually this is good design — the market square is a
consequence of the settlement being a market, not an independent property of its size.

**⚠ THE DEFECT.** `Burgs.specify()` — which calls `defineGroup` and therefore evaluates
the group predicates — runs at pipeline position ~558, while `Markets.generate()` runs at
~578. `plaza` is therefore **undefined for every burg at the moment groups are
classified**, and nothing re-classifies afterwards (`grep` for `defineGroup|changeGroup`
in `markets-generator.ts` returns nothing; the pipeline tail after `Markets.generate()`
is Production → taxes → Military → Markers → Zones → AddedLabels, with no re-specify).

Consequence: the two default groups whose predicates *require* `plaza: true` —
**`caravanserai`** and **`trading_post`** — cannot match on a fresh generation. They are
reachable only after a later user-triggered regroup. Meanwhile `hamlet`, which requires
`plaza: false`, matches on a vacuous truth.

**VERDICT for us: ALREADY-HAVE (the law), but take the warning.** This is a
**stage-ordering hazard**: a predicate read one stage before its writer runs. Our
compile-stage discipline and totality censuses are the defence, and this is a concrete
argument for a specific ratchet: *a census that asserts every declared classification
branch is actually reachable at least once over a corpus run.* An unreachable branch that
silently degrades to a default is invisible in output — exactly the "shape the corpus
never produces looks CLEAN" hazard we have already banked. Worth confirming our
classification surfaces carry such a reachability pin.

### 1.8 Group classification — first-match-wins over ordered predicates

**What it does.** Assigns each burg a *group* (capital, city, town, village, hamlet, fort,
monastery, caravanserai, trading_post) which drives its icon, label style and external
preview generator.

**How (my words).** `defineGroup` (`burgs-generator.ts:474-523`) sets the burg to the
group flagged `isDefault`, then walks the group list in **array order** and takes the
first group all of whose declared predicates pass. Predicates are optional and
conjunctive: a minimum population, a maximum population, a set of boolean feature
requirements (`citadel: true, walls: false, …`), a biome whitelist, and a **percentile**
test evaluated by finding the burg's population in the ascending sorted array of all
populations and comparing its index against the percentile cut.

Two structural notes:

- The percentile test uses `populations.indexOf(...)`, which returns the *first* match —
  so it is only stable because §1.4's dither makes populations unique. The dither and the
  classifier are quietly coupled.
- The `order` field on each group is **not** classification precedence — it is render
  z-order only (`draw-burg-icons.ts:97` sorts by it; the editor labels it "Rendering
  order: higher values are rendered on top"). Classification precedence is the literal
  array order. The two orderings differ (`town` has order 7 but sits last in the array),
  and this is benign *only* because `town` is the catch-all default. It is a latent trap
  for anyone who reorders the list expecting classification to follow `order`.

**VERDICT: ADOPT-AS-APPROACH, with a caution.** A declarative, data-driven,
first-match-wins predicate table is a good shape for tier/kind classification — it is
inspectable, user-editable, and adding a kind is a data change rather than a code change.
Our tier legibility (§249.4b: grain alone does not separate town from city; tiers must
rest on a multi-channel read) would benefit from exactly this shape: a table of kinds,
each with its multi-channel predicate set. The caution is the one their code demonstrates:
**never let two different orderings (precedence and render) live on one list without
naming them separately.**

### 1.9 `getType` — settlement character from environment

**How (my words).** `getType` (`burgs-generator.ts:175-195`) returns a culture-type label
by first-match: any port is Naval; a burg whose haven is a lake is Lake; above an
elevation threshold it is Highland; on a river with sufficient flux it is River;
otherwise, for small or unsettled cells, desert-ish biomes give Nomadic and mid biomes
give Hunting; else a generic default. This label then feeds the coat-of-arms generator
and the naming system.

**VERDICT: ALREADY-HAVE / DELIBERATELY-DIFFERENT.** Our settlement character comes from
the dossier's culture, economy and history rather than being re-inferred from terrain at
render time. Their version is a *proxy* for facts they do not have. Worth noting only as
confirmation that the axes they reach for (water relation, elevation, river, biome) match
the axes our regional morphotypes already use.

### 1.10 ⭐ THE ANSWER TO THE CHARTER'S KEY QUESTION

> *"What do we currently ASSERT that they DERIVE?"*

Honest answer, and it is shorter than §248.3 anticipated: **very little, because the
direction of derivation is opposite.** They derive settlement facts *from terrain*
because terrain is all they have. We derive fabric *from dossier facts* because those
facts are the product. Where they derive and we assert, it is almost always because the
thing they derive is something we are *given*.

The genuine exceptions — things they derive that we currently assert or under-derive,
each a real acceleration:

| They derive | We currently | The fix, and its home |
|---|---|---|
| **A suitability field** over the terrain (biome + hydrology + coast + resources) | Name "suitability" in §161d anchoring without a fully derived construction | Build the scalar field from the §161a substrate; it feeds district anchors *and* §161c outlying siting |
| **Route connectivity** as a *multiplier on settlement weight* (`getConnectivityRate`, and `isCrossroad` as a boolean hub test) | Treat roads as an output of settlement importance | Make it bidirectional — connectivity should feed back into district weight, matching §161h's "roads follow the money" |
| **Port viability as a relational test** (≥2 endpoints on a water body, else none) | Assert port/quay presence from the dossier | Add the counterparty predicate as a contradiction census under §205 |
| **Built extent from population via an explicit power law** (§2.2 below) | Derive extent from high-water population (§161f) — but the *exponent* is not pinned by a measured law | Their exponent is a free calibration cross-check against our corpus-measured grain bands |
| **Arable/farm status** from biome ∧ river presence | Not systematically derived for the extramural ring | Feeds §190d faubourg / §161c extramural-near land use |

---

## 2. THE BURG PLAN GENERATOR (charter priority 2) — THE HEADLINE IS A NEGATIVE

### 2.1 ⭐⭐ THERE IS NO TOWN PLAN GENERATOR IN FMG. AT ALL.

This is the most important single finding in the study, and it reframes the competitive
picture the §247 strategy rests on.

**Evidence (CONFIRMED, by exhaustion).** A grep across all 248 files of `src/` for
`building`, `street`, `townplan`, `cityplan`, `blockShape` and neighbouring vocabulary
returns exactly three hits, all of them false positives: two comments about UI "building
blocks", and one comment in the routes generator describing the inter-settlement *road*
network. `src/renderers/` contains 28 renderers — biomes, borders, burg **icons**,
emblems, features, goods, heightmap, ice, legend, markers, markets, measurers, military,
relief icons, satellite texture, scalebar, temperature, trade animation, 3-D view — and
not one of them draws a street, a block, a plot or a building. `draw-burg-icons.ts` is
123 lines and does exactly what its name says: it appends an SVG `<g>` per burg group,
applies a stored style, and places a glyph plus an anchor.

**In FMG, a settlement is a point.** It has coordinates, a population number, four
boolean-ish flags, a group name, an icon, an anchor and a label. It has no interior.

**What they do instead — the delegation contract.** FMG derives a rich parameter set and
builds a **URL into Watabou's closed generators** (`burgs-generator.ts:548-709`): the
City Generator for capital/city/town groups, the Village Generator for village/hamlet,
and the Dwellings generator for the smallest. The user clicks through to a separate web
application to see a plan. The `preview` field on each burg group names which external
generator applies.

**VERDICT: DELIBERATELY-DIFFERENT — and this is the strategic finding of the study.**
Our entire map program (§150-§249) builds the artifact FMG chose not to build. The
market-leading open implementation terminates its settlement layer at the icon, and the
market-leading plan generator (Watabou) is closed and knows nothing about a world.
**Nobody currently ships the join.** §247's thesis — "pair the best substance generator
with a map generator contestable with the leaders, made unique by being true to the
dossier" — is not merely viable; the specific gap it targets is *structural and
unoccupied*. The two leaders are each half of the product, and neither can become the
other: FMG has a world and no plans, Watabou has plans and no world.

### 2.2 ⭐ The delegation contract IS their world→plan derivation, and it is worth having

Even though FMG generates no plan, the parameters it *derives* to request one are a
compact, road-tested statement of "what a world knows that a plan needs". This is the
most directly reusable artifact in the codebase, because it is a **specification**, not
an implementation — so learning from it raises no IP question at all.

**For a city** (`createWatabouCityLinks`, `burgs-generator.ts:548-608`) they derive and pass:

| Parameter | Derived how (my words) |
|---|---|
| `seed` | world seed concatenated with the burg's index, zero-padded to 4 digits (§4.2) |
| `size` | **a power law on population** — `2.13 × (population / urbanDensity) ^ 0.385`, clamped to 6..100 |
| `population` | burg population scaled by the global population rate and urbanization share |
| `river` | whether the cell carries a river |
| `coast` | whether the burg is a port |
| `sea` | **the bearing to open water**, as an angle normalized to a 0..2 scale (0 = east, 0.5 = north, 1 = west, 1.5 = south), computed from the vector to the haven cell |
| `farms` | whether the biome is arable — and the arable set is **widened when a river is present** |
| `citadel`, `walls`, `plaza`, `temple`, `shantytown` | the burg feature flags (§1.6, §1.7) |
| `urban_castle` | citadel **and** an every-other-id parity test — a deterministic thinning so not every citadel becomes an urban castle |
| `hub` | whether the cell is a route crossroad (>3 connections, or >2 road connections) |
| `greens` | mirrors plaza |

**For a village** (`createWatabouVillageLinks`, `:610-671`) they instead derive a **tag
list**, which is a different and in some ways better interface — a set of qualitative
descriptors rather than numbers. The tags are derived by a priority cascade: `estuary`
if the cell has both a river and a haven, else `island,district` if it is a one-cell
island, else `coast` if a port, else `confluence` if the cell is a river confluence,
else `river` if it has a river, else occasionally `pond`. Then exactly one connectivity
tag — `highway`, `dead end` or `isolated` — from the route connectivity rate. Then land
use — `uncultivated` if the biome is not arable, else occasionally `farmland`. Then
`no orchards` if the temperature is freezing or too hot. Then `no square` if there is no
plaza, `palisade` if walled, and `sparse` or `dense` from population. Canvas dimensions
come from population buckets at a fixed 2.05 aspect ratio, and a `style` of `sand`,
`snow` or `default` is chosen from biome and temperature.

**VERDICT: ADOPT-AS-APPROACH, ranked #3, with two specific liftings.**

1. **The bearing-to-water parameter.** They pass the *direction* of the sea, not merely
   its presence. Our fabric needs exactly this and it is easy to under-specify: a coastal
   town's whole plan orients to the water. Our derivation home is the terrain substrate
   (§161a) and it feeds district anchoring (§161d) and the wall-meets-water case (§205.3,
   circuits anchoring on water with water-gate towers).
2. **The size power law as a calibration cross-check.** `extent ∝ population^0.385` is an
   independent, heavily play-tested estimate of the population→built-extent relationship
   that our §161f high-water law needs. We should not adopt the constant, but we *should*
   check our own extent curve against this exponent — §249.4c records that our population
   fit is currently **UNRESTORABLE from the corpus**, so an external, independently-derived
   exponent is genuinely useful evidence where we currently have none. Flagging it as
   the one place a competitor's tuning constant is worth measuring ourselves against.

**Honest note on what the contract reveals about their model's ceiling.** Every parameter
is a scalar or a boolean about *the settlement as a whole*. There is no way to say "the
tannery quarter is downwind and downstream", "this wall ring is older than that one", or
"these three blocks burned in 1247". The interface itself is the proof that the world
model and the plan model never truly meet — the join is a query string.

### 2.3 What they *do* generate: the inter-settlement route network (their nearest analogue)

Since there is no street network, the closest thing to studied plan-generation is the
road network between burgs — and it is genuinely the best-engineered generator in the
repository. It maps onto our street problem more closely than its name suggests.

**What it does.** Produces roads, trails and sea routes as smoothed polylines connecting
burgs, with an emergent hierarchy.

**How (my words).** In three ordered passes sharing one mutable `connections` map:

1. **Which pairs should be linked** — for each landmass, take the relevant settlement
   points and compute an **Urquhart graph**: build the Delaunay triangulation, then
   delete the longest edge of every triangle. What survives is a proximity graph
   noticeably sparser than Delaunay but richer and more natural-looking than a minimum
   spanning tree. Main roads use only **capitals**; trails use **all burgs**; sea routes
   use **ports**, grouped by water body rather than landmass.
2. **Where each link actually runs** — a shortest-path search over the cell graph with a
   **cost field**, not a straight line. Land cost multiplies squared distance by: a mild
   habitability penalty, a substantial elevation penalty, and a **burg attraction term
   that makes any cell without a settlement three times as expensive** — so routes bend
   to pass through places. Water cost swaps in per-water-type modifiers that make
   coastline cheap and open ocean up to eight times dearer, refuses to cross freezing
   sea, and constrains river travel to the recorded river course and coastal departure
   to the port's own haven cell.
3. ⭐ **The reuse discount, which is where the hierarchy comes from** — every edge already
   used by a route costs **half** as much (`connectionModifier`). Because main roads are
   laid before trails, trails preferentially bundle onto existing roads instead of
   running parallel to them. Then `getRouteSegments` **splits each new path at cells that
   are already connected and emits only the novel segments**, so shared stretches are
   never drawn twice. Finally `mergeRoutes` chains segments whose endpoints meet into
   single long named polylines.

Two finishing passes: a **sharp-angle relaxation** that pulls any interior non-settlement
vertex toward the midpoint of its neighbours when the turn is sharper than 135° (harder
below 115°), writing the moved point back into a **shared** points array so every route
through that cell moves together and the network stays coherent; and rendering through
Catmull-Rom splines, at near-uniform tension for land routes and centripetal tension for
sea routes (the centripetal parameterization is the one that cannot produce cusps or
self-intersections, which matters more for long ocean arcs).

**VERDICT: ADOPT-AS-APPROACH, ranked #4 — and it is the closest thing in this repository
to a blueprint for our street network.** The mapping is direct:

| Their road problem | Our street problem |
|---|---|
| Burgs as nodes | District-organism anchors (§161d), gates, institutions (§161c), the plaza |
| Urquhart graph over burgs | Candidate street links between anchors — sparser than Delaunay, richer than a tree, which is exactly the character of a real street graph |
| Cost field (elevation, habitability, burg attraction) | Cost field over the parcel substrate: slope, water, existing fabric, wall lines, right-of-way reservations (§190a) |
| Reuse discount → road hierarchy emerges | **High street vs lane vs alley emerging from reuse rather than being labelled by fiat** — this is the mechanism our §201 alley register and §239 street-attachment laws currently have to assert |
| Segment splitting at existing connections | No duplicate geometry — directly serves our non-overlap law (§190) |
| Sharp-angle relaxation into a *shared* vertex array | Junction coherence: moving a junction moves every street meeting it, which is precisely how to keep a street graph consistent under smoothing |

The single most valuable idea here is the **reuse discount producing hierarchy as an
emergent property**. We currently derive street class from function; FMG shows that
class also emerges from *traffic bundling*, and the two together are far more convincing
than either alone. It also directly serves §161h's "roads follow the money" drift:
re-weight the cost field, re-run, and the hierarchy re-sorts itself.

**Two honest defects in their implementation, worth not inheriting:**

- `getConnectivityRate` and `isCrossroad` both do a **linear scan over the entire routes
  array inside a reduce** (`pack.routes.find(...)` per connection, `routes-generator.ts:843`
  and `:805`), and `getConnectivityRate` is called once per burg during population
  derivation. It is a quadratic pattern hiding in an innocuous-looking accessor.
- `getLength` measures a route by calling **`getTotalLength()` on the rendered SVG DOM
  node** (`:891-894`). A data property is therefore only computable *after* rendering, in
  a browser. This is exactly the coupling our headless byte-determinism requirement
  forbids, and it is a clean illustration of why we keep geometry measurable without a
  DOM.

### 2.4 Candidates for ADOPT-CODE-WITH-ATTRIBUTION — and an IP trap inside one of them

The charter reserves code adoption for "small, bounded, well-solved utilities". Scanning
for genuine candidates, the honest list is short:

| Candidate | Location | Saving | Obligation | Recommendation |
|---|---|---|---|---|
| Urquhart edge extraction | `routes-generator.ts:246-285` | ~40 lines; the half-edge bookkeeping is fiddly to get right | ⚠ **see trap below** | **Clean-room from the one-line definition** |
| Sharp-angle relaxation | `routes-generator.ts:596-633` | trivial | MIT attribution | Clean-room — it is ten lines of trigonometry |
| `meander` / curve smoothing | `utils/pathUtils.ts` | moderate | MIT attribution | Clean-room; ours must be byte-deterministic and theirs takes a `meandering` parameter driven by the global PRNG |

⚠ **THE IP TRAP, and it is the kind of thing this discipline exists to catch.** The
Urquhart implementation carries its own provenance comment:

> `// code from https://observablehq.com/@mbostock/urquhart-graph`
> — `src/generators/routes-generator.ts:245`

**That code is not Azgaar's to license.** It is third-party code carried inside an
MIT-licensed repository, and its actual terms are Mike Bostock's Observable notebook
terms, not FMG's LICENSE. Adopting it "under FMG's MIT" would be adopting it under a
grant the grantor did not hold. The general rule this instantiates, and which belongs in
our IP practice: **a permissive top-level license does not launder the provenance of code
the project itself copied in** — always read for provenance comments before adopting,
not just the LICENSE file.

The practical consequence is mild, because the Urquhart graph is a *published definition*
("remove the longest edge of each Delaunay triangle") and definitions are free. We
implement it clean-room from that sentence, over our own Delaunay, and owe nobody
anything. **Net recommendation for the whole repository: ZERO code adopted.** The
bounded utilities are all small enough that clean-room costs less than the attribution
bookkeeping, and the one that would have been worth copying is the one we may not copy.

---

## 3. SEEDING, DETERMINISM AND REGENERATION STABILITY

The charter asks specifically "HOW THEY SEED AND WHETHER REGENERATION IS STABLE". The
answer is more interesting than "they don't bother", and it contains one design idea
worth taking and one anti-pattern worth citing forever.

### 3.1 The mechanism: a globally monkey-patched `Math.random`

**How (my words).** The world seed is a string. `setSeed` (`public/main.js:618-633`)
resolves it — from an explicit argument, from a URL parameter, or freshly generated —
and then **replaces the standard library function**:

> `Math.random = aleaPRNG(seed);` — `public/main.js:632`

Every one of the 79 `Math.random` call sites in `src/`, plus everything in the legacy
monolith, plus any library code that reads `Math.random` at call time, thereafter draws
from the seeded Alea stream. There is no explicit RNG object threaded through the code
at all.

**⚠ The anti-pattern this creates, evidenced by their own workarounds.** Monkey-patching
a global only works if every consumer reads it *late*. d3 v7 does not — it captures
`Math.random` when the module is evaluated. FMG had to work around this in at least two
places, and the comments record the injury:

> `// Use .source() to get a version that uses the current Math.random (which may be seeded)`
> `return rn(minmax(randomNormal.source(() => Math.random())(expected, deviation)(), min, max), round);`
> — `src/utils/probabilityUtils.ts:50-51`

and the same pattern for shuffling in `src/utils/colorUtils.ts:44-45`. Any dependency
that captures the global early silently escapes the seed and generates unreproducibly —
a failure that is invisible until someone compares two runs of the same seed.

**VERDICT: DELIBERATELY-DIFFERENT, and ours is better — this is direct evidence for a
stance we already hold.** Our requirement to pass the random source explicitly rather
than patch a global is often argued on taste; FMG is the empirical case. A global patch
makes seeding *ambient*, so nothing can be checked locally: you cannot look at a function
and know whether it is reproducible, and a dependency upgrade can break determinism with
no code change on your side. Worth citing whenever the explicit-stream discipline is
questioned as ceremony.

### 3.2 ⭐ The good idea: per-generator stream isolation

This part surprised me and corrects an assumption worth flagging, since it would have
been easy to report FMG as naively non-deterministic.

**How (my words).** Most major generators **re-seed the global from the same world seed
at their own entry point** rather than inheriting the ambient stream. Confirmed sites
(all `Math.random = Alea(seed)` or equivalent): grid construction
(`utils/graphUtils.ts:137`), heightmap (`heightmap-generator.ts:552`), features
(`features.ts:100`), rivers (`river-generator.ts:169`), ice (`ice-generator.ts:38`),
routes (`routes-generator.ts:209`), goods (`goods-generator.ts:968`), provinces
(`provinces-generator.ts:80`, from a local seed), and markets
(`markets-generator.ts:45`).

The effect is real and valuable: each of those generators produces the same output for a
given world seed **regardless of how many random draws every preceding stage consumed**.
Editing the heightmap does not reshuffle the rivers by a draw-count side effect. One
comment states the intent outright:

> `Math.random = Alea(seed); // get the same result on heightmap edit in Erase mode`
> — `src/generators/features.ts:100`

**VERDICT: ADOPT-AS-APPROACH, ranked #5 — as a principle we should state explicitly.**
Per-stage stream derivation (each stage deriving its own stream from the world seed plus
a stage identifier, rather than sharing one advancing stream) is exactly the property our
**inertia law** needs at stage granularity: it makes a stage's output independent of
upstream draw counts, so a change in stage 3 cannot silently re-roll stage 7. Our
substrate should derive streams as `hash(worldSeed, stageId[, entityKey])`. FMG reaches
the right idea through a global patch; we should reach it through explicit derivation.
Combined with §1.4's identity-derived dither, this is the complete recipe for locality.

**But the isolation is incomplete, and the gaps are exactly where settlements live.**
`Burgs.generate()` does **not** re-seed. Neither do cultures, states (on the main path),
religions, military, markers or zones. Those stages inherit the ambient stream and are
therefore sensitive to upstream draw counts. Since burgs are the settlement layer, FMG's
settlement placement is the *least* insulated part of the pipeline — a good illustration
of how partial application of a correct principle leaves the risk exactly where it is
not obvious.

### 3.3 Regeneration is deliberately NOT stable

**How (my words).** Every "regenerate this layer" action is explicitly reseeded from a
*fresh random* value rather than the world seed:

- `States.recreate()` → `Math.random = aleaPRNG(generateSeed())` — `states-generator.ts:101`
- `Routes.regenerate()` → `this.generate(lockedRoutes, Math.random())` — `routes-generator.ts:205`
- `Markets` → `if (!regenerate) Math.random = Alea(seed)` — reseeds on first generation
  only, deliberately not on regeneration — `markets-generator.ts:45`
- `Burgs.regenerate()` scores cells with bare `Math.random()` off the ambient stream —
  `burgs-generator.ts:813`

This is a coherent product decision, not an oversight: "regenerate" means *give me a
different one*. Continuity across regeneration is instead provided by an explicit
**lock** mechanism — `burg.lock`, `route.lock` — where locked entities survive
regeneration verbatim while everything else is rebuilt. `Burgs.regenerate()` shows the
full pattern: locked burgs are carried into the new array first, **assigned new indices**,
and their attached notes are re-keyed to the new ids (`burgs-generator.ts:778-793`);
market-centre burgs get the same protection so the economy does not lose its anchors.

**VERDICT: DELIBERATELY-DIFFERENT, and ours must be better — but note what they got
right.** Their model has no stable entity identity: a locked burg's *index changes* on
regeneration and every reference to it must be hand-patched (notes are re-keyed by string
surgery; market centre ids are rewritten one by one). This is precisely the identity
problem §240.4 names as a hazard and MF-ARCH's lineage-id work exists to solve. Every
cross-reference in their model is an array index, so identity maintenance is manual and
each new referring feature is a new opportunity to forget — the note re-keying and the
market re-pointing are two hand-written instances of the same chore, which is the
signature of a missing abstraction.

What they got right and we should keep: **the lock is a first-class, user-visible concept
on every entity.** A user who likes one town can pin it and re-roll the rest. That is a
genuinely good product affordance, and it is the interactive counterpart of our epoch
inertia — worth carrying into our editing surface as an explicit "pin this" rather than
leaving regeneration all-or-nothing.

### 3.4 Byte-exact same-seed output is not achievable in their architecture

Stated plainly because §248.4 predicted it and it is now evidenced. Alea itself is
integer-based and reproducible, but reproducibility of the *output* additionally requires
that every downstream computation be platform-invariant, and theirs is not:

- Geometry runs through `Math.hypot`, `Math.atan2` and fractional powers (e.g. the
  `** 0.385` size law, the `** 0.7` spacing law, `scale ** 0.8` halo widths), none of
  which are bit-specified across JS engines.
- Route length is measured by `getTotalLength()` on a **rendered SVG DOM node**
  (`routes-generator.ts:891-894`) — a browser-implementation-defined value.
- Rendering depends on `shapeRendering` user options and on device pixel ratio at export.

So the honest characterization is: **FMG is seed-reproducible within one browser build,
and not byte-reproducible across environments.** This is the concrete basis for the
chair's §248.4 judgment that importing their code would import their architecture —
there is no small edit that makes this pipeline byte-exact, because the assumption is
absent at every level rather than violated at one.

---

## 4. RENDERING AND SCALE (charter priority 3)

Relevant to our open metropolis-grain performance question (§220, promoted by §247.3a to
launch-blocking). FMG's scale problem is different from ours — they render a *world* of
many small things; we render a *settlement* of many small things — but the machinery
transfers.

### 4.1 Structure: one SVG, one transform, a flat layer stack

**How (my words).** A single SVG document contains a `<g id="viewbox">` into which
**34 named layer groups** are appended at startup in fixed z-order (65 named groups in
total, counting nested ones) — ocean,
oceanLayers, oceanPattern, landmass, texture, terrs, lakes, biomes, cells, gridOverlay,
coordinates, compass, rivers, terrain, relig, cults, regions (with statesBody and
statesHalo nested), and so on (`public/main.js:38ff`). Each layer is held in a
module-global variable and toggled by display style. Pan and zoom are implemented as a
**single `transform` attribute on the viewbox group** — `translate(x y) scale(k)` — so
panning never touches element geometry. Zoom is limited to a 1×-20× range.

Repeated iconography (relief icons, burg icons, hatching, patterns, compass rose) lives
in `<defs>` as `<symbol>`s and is instanced with `<use>`, which keeps the DOM cost of a
thousand mountains near the cost of a thousand references rather than a thousand paths.

**VERDICT: ADOPT-AS-APPROACH for the `<use>`/`<symbol>` instancing; ALREADY-HAVE for the
layer stack.** The instancing point is the one worth stating for our metropolis case:
where our fabric has genuinely repeated marks (roof glyphs, tree stamps, hatching,
repeated building archetypes at far zoom), `<use>` of a `<symbol>` is dramatically
cheaper than emitting geometry per instance, both in DOM size and in serialized file
size. That directly serves §220's PDF-export-time row.

### 4.2 The performance machinery: a two-tier frame budget

This is the best-designed part of their rendering, and it is a pattern we should copy
outright.

**How (my words).** Zoom events are **coalesced into one paint per animation frame**: the
handler writes the latest transform into globals, OR-accumulates two dirty flags (scale
changed / position changed), and schedules a single `requestAnimationFrame` callback if
one is not already pending (`components/zoom.ts:24-47`). Work is then split by cost:

- **Per frame (kept deliberately cheap)** — write the transform, update the minimap,
  redraw the scale bar, and schedule a viewport reconcile.
- **On gesture end only (`handleZoomEnd` → `invokeActiveZooming`)** — the expensive
  rewrites: recomputing per-element sizes, showing/hiding emblems, resizing markers,
  adjusting halo stroke widths.

The comments state the discipline explicitly: `/** Per-frame view tracking. Keep this
cheap */` and `/** Rewrite map content once the gesture settles */`.

**VERDICT: ADOPT-AS-APPROACH, ranked #6 — directly applicable to §220.** The
"cheap-per-frame / expensive-on-settle" split is the single highest-leverage pattern for
an interactive map at grain, and it is the natural home for our LOD machinery: during a
gesture, only the transform moves; when the gesture settles, the detail level is
reconciled. §220 names "zoom-level LOD machinery as the pressure valve" — this is the
scheduling skeleton that valve should hang on.

### 4.3 Viewport virtualization — present, well-built, and only partially applied

**How (my words).** `src/renderers/viewport/viewport-renderer.ts` implements a real
virtualization layer:

- Layers **register** a render callback and are invoked with a bounds context.
- Bounds are computed in world coordinates from the current transform, **padded by an
  overscan margin** (80 px) so that a small pan does not immediately reveal unrendered
  space.
- A **guard band** (half the overscan) provides hysteresis: `shouldReconcile` returns
  true only when the visible bounds approach within the guard of the last materialized
  bounds, or when scale has increased materially. Small pans therefore cost nothing.
- `Scene<T>` is a keyed item map supporting `replaceWhere`, which **returns the set of
  changed ids** so a layer can patch only what moved rather than rebuilding its subtree.
- ⭐ `renderTo(root)` renders with **infinite bounds** into a detached clone — used by the
  export path (`services/io/export.ts:269`) so that a virtualized layer exports in full
  rather than exporting only what happened to be on screen.

**But only two layers use it**: relief icons and labels (`draw-relief-icons.ts:10`,
`labels/labels-renderer.ts:10`). Every other layer — biomes, borders, routes, rivers,
burg icons, emblems, markers — is still rendered wholesale. The virtualization is a
recent, targeted retrofit against the two highest-count element classes rather than a
general architecture.

**VERDICT: ADOPT-AS-APPROACH, ranked #7 — with the export detail as the load-bearing
part.** Three specific liftings:

1. **Overscan + guard-band hysteresis.** The naive version of viewport culling
   re-reconciles on every pan and performs worse than no culling. The
   overscan/guard pair is the fix, and the ratio (guard = half the overscan) is a
   sensible starting calibration.
2. ⭐⭐ **`renderTo` with infinite bounds for export.** This is the detail most likely to
   bite us and it is worth banking now: *the moment a renderer becomes viewport-aware,
   every non-interactive consumer of that renderer — export, PDF, thumbnail, golden-image
   test, determinism receipt — must have an explicit full-extent path.* A virtualized
   renderer whose golden test captures only the viewport is a test that silently stops
   measuring most of the artifact. Given that our same-seed goldens are a core ratchet,
   introducing viewport culling without a full-extent render path would quietly hollow
   out our determinism proofs.
3. **Keyed scene reconciliation returning changed ids** is the right shape for our
   drift/epoch updates (§161h inertia): recompute the scene, diff by key, patch only
   changed entities — the rendering counterpart of "unchanged facts render byte-unchanged".

### 4.4 Element-count handling: threshold visibility and lazy materialization

**How (my words).** Beyond virtualization, two cheaper tricks:

- **Apparent-size thresholds.** Emblems are hidden when their on-screen size falls below
  25 px or exceeds 300 px (`zoom.ts:106-115`) — culling both the illegibly small and the
  absurdly large.
- ⭐ **Lazy materialization of expensive content.** A coat of arms is only actually
  rendered when it first becomes visible and does not yet have an `href`
  (`zoom.ts:113`). Expensive per-entity artwork is thus generated on demand and cached on
  the element, not generated up front for every entity.
- A user-facing `shapeRendering` option (`optimizeSpeed`) that skips some rescaling work.

**VERDICT: ADOPT-AS-APPROACH for lazy materialization.** Our per-building and
per-institution detail has exactly this shape: it is expensive, and at far zoom most of
it is invisible. Generate-on-first-visibility with caching keyed by entity is the pattern.
The apparent-size threshold is **ALREADY-HAVE in spirit** — our atlas prior #4 bans hollow
blocks at far zoom, which is the same insight expressed as a quality rule rather than a
performance one, and §220 already pairs them.

### 4.5 Export

**How (my words).** SVG is serialized, loaded into an `Image`, drawn onto a canvas sized
by a **resolution multiplier**, and exported via `toBlob` to PNG or JPEG
(`services/io/export.ts:63-115`). The full-extent viewport render (§4.3) runs into a
detached clone first. There is no vector PDF path — raster export at a scale factor is
the whole story.

**VERDICT: NOT-APPLICABLE / we are ahead.** Our export requirements (vector PDF, the ×10
painted rasterize cost folded into §220's export row) are strictly beyond this. Noted
only to record that their export is simpler than ours because their artifact is.

---

## 5. WHAT THEY DO NOT ATTEMPT (charter priority 4)

The charter's framing is right: their omissions define our differentiation as sharply as
their solutions define our shortcuts. Each of these was verified as *absent*, not merely
unfound.

| Dimension | Status in FMG | Evidence | What it means for us |
|---|---|---|---|
| **Intra-settlement plan** — streets, blocks, plots, buildings | **Absent entirely** | §2.1: no generator, no renderer, no vocabulary across 248 files | The entire map program is in unoccupied ground |
| **Time / history of a place** | **Absent.** A map is a single timeless snapshot. No epochs, no dated events on fabric, no growth sequence, no ruin state | No epoch/vintage concept anywhere; burg features are current-state booleans | §240 epoch generation, §161g demotion grammar and §161h drift have **no counterpart in the only open implementation** |
| **Per-building truth** | **Absent.** The finest addressable unit is the burg | `Burg` interface (`burgs-generator.ts:12-41`) is 30 scalar fields | Our per-building and per-institution truth layer has no analogue |
| **District organisms** | **Absent.** No sub-settlement spatial structure of any kind | No district concept; `island,district` is a *string tag passed to Watabou* | §161d/§161e are wholly ours |
| **Undercity / vertical strata** | **Absent** | No tunnels, cellars, sewers, levels | §166/§168 wholly ours |
| **Walls as traced geometry** | **Absent.** `walls` is a boolean passed to an external generator | `defineFeatures` (`:392`) sets 0 or 1 | §232 (wall as district partition), §200 (wall clearance), §239 (wall-side street) have no counterpart |
| **Institution siting** | **Absent.** Temple/citadel are booleans, not placed objects | `:391-398` | §161c siting rings, §161n institution scale wholly ours |
| **Area-true predicates on fabric** | Partially present at *cell* level (`s * area / meanArea`), absent below it | `rankCells`, `public/main.js:1138` | They have the right instinct at the only scale they operate at |

**The synthesis, stated honestly.** FMG's settlement layer answers *where* and *how big*.
It never answers *what it looks like inside*, *how it got that way*, or *what is where*.
Our program answers all three. The competitive risk is therefore **not** that FMG will
extend downward into plans — the delegation to Watabou shows the author's settled
preference — but that a user comparing screenshots sees two mature products and one
immature one. That is a rendering-quality and register argument (§244's measured deltas),
not an architecture argument, and it is the right place to be worried.

---

## 6. THEIR KNOWN PROBLEMS (charter priority 5) — from in-repo evidence

**Method note.** The charter suggests skimming issues and discussions. Consistent with
the read-only, no-refetch discipline, I did **not** fetch their issue tracker; instead I
mined the failure-mode evidence *already inside the clone* — the authors' own TODO/FIXME
trail, their architecture docs, their stated rules versus their actual code, and the
defects the code itself reveals. This is weaker on user-reported symptoms and stronger on
root causes, which is the more useful half for us.

### 6.1 They state a layering rule and their settlement generator breaks it

`CONTEXT.md` declares: *"Generators MUST NOT directly manipulate SVG or DOM elements"* and
*"Renderers SHOULD be stateless and idempotent"*. The burg generator violates the first
repeatedly — it calls `window.drawBurgIcon(burg)`, `COArenderer.add(...)`, and reaches
into the DOM to remove emblem nodes (`burgs-generator.ts:735, 750, 874, 889-891`). The
renderer side documents the breach rather than fixing it:

> `// burgs-generator still draws icons directly; it cannot import upwards, so the bridge stays`
> — `src/renderers/draw-burg-icons.ts:120`

**The lesson for us, and it is a real one.** The stated architecture and the enforced
architecture diverged, and the divergence is *recorded in a comment* rather than caught by
a check. This is precisely the argument for our structural-prevention posture: a layering
rule that is not machine-enforced degrades to a comment describing its own violation. If
we assert a generator/renderer boundary, a source-scan test should hold it.

### 6.2 The defects this study found in the settlement layer

Collected for reference; each is evidenced above:

1. **Population derived by two different laws** (§1.3) — `/5` with connectivity vs `/8`
   with a port term and roughly double the scale. A "regenerate population" action
   produces a differently-scaled quantity.
2. **Two group classifications are unreachable on a fresh map** (§1.7) — `caravanserai`
   and `trading_post` require `plaza`, which the markets layer writes *after* group
   classification runs, with no re-classification afterwards.
3. **Classification precedence and render precedence are different orderings of one list**
   (§1.8) — benign only because the catch-all group happens to sit last.
4. **The capital placement restart discards all work** on spacing failure (§1.2) while the
   town pass, solving the same problem, relaxes monotonically.
5. **Quadratic accessors on a hot path** (§2.3) — `getConnectivityRate` scans the whole
   routes array per connection and is called once per burg during population derivation.
6. **A data property computed from the rendered DOM** (§2.3) — route length via
   `getTotalLength()`.
7. **`mergeRoutes` recurses only when more than one merge occurred**
   (`routes-generator.ts:655`), so a pass that performs exactly one merge stops without
   checking whether that merge enabled another. A latent under-merge.
8. **Determinism escapes through libraries that capture `Math.random` early** (§3.1),
   worked around case by case rather than structurally.

### 6.3 The failure-mode classes worth carrying into our own review

Generalizing from the above, three classes that our surfaces should be checked against:

- ⚠ **The second derivation site.** One fact, two formulas, reached by two lifecycle
  paths. Their population bug is the map-generator instance of our most-bitten class.
  *Check:* every derived quantity has exactly one writer that all paths call.
- ⚠ **The unreachable classification branch.** A predicate read one stage before its
  writer runs, degrading silently to a default. Invisible in output because the default
  is plausible. *Check:* a reachability census asserting every declared branch fires at
  least once across a corpus run.
- ⚠ **The renderer-coupled data property.** A value only computable after rendering,
  which quietly makes headless determinism impossible. *Check:* every geometric property
  used by generation is computable without a DOM.

---

## 7. RANKED — WHAT GENUINELY ACCELERATES US

Ranked by (value to the map program) × (immediacy). Every entry is
ADOPT-AS-APPROACH implemented clean-room; **nothing on this list requires or recommends
copying a line of their code** (see §2.4 for why the net code-adoption recommendation is
zero).

| # | What | Why it accelerates us | Where it lands |
|---|---|---|---|
| **1** | **Identity-derived dither instead of RNG draws** (§1.4) | Makes the inertia law arithmetically true instead of merely asserted. A stream draw couples every entity to every other; a hash of the entity key does not. Small change, large architectural consequence | Substrate / entity-key surface (MF-ARCH lineage ids); §161h §11.0 |
| **2** | **Per-stage stream derivation** (§3.2) | A stage's output stops depending on upstream draw counts, so editing stage 3 cannot silently re-roll stage 7. This is locality at stage granularity, the complement of #1 at entity granularity | Substrate; the epoch machinery of §240 |
| **3** | **The street-network recipe** (§2.3): proximity graph over anchors → cost-field pathfinding → **reuse discount** → segment splitting → junction-coherent smoothing | The largest single build accelerant. Street *hierarchy emerges from traffic bundling* rather than being labelled by fiat, and the same machinery re-sorts under §161h's "roads follow the money" | Street layer; §190a right-of-way, §201 alley register, §202 universal access, §239 street attachment |
| **4** | **A derived suitability field as a siting input** (§1.1) | §161d anchoring already names `suitability × affinity × siting ring`; the suitability term is currently the thin one. FMG shows a cheap, fully-derived construction from terrain, hydrology, coast and resources | District-organism anchoring §161d; outlying institution siting §161c |
| **5** | **The world→plan parameter contract as a checklist** (§2.2) | A free, play-tested specification of what a plan generator needs from a world. Two specific liftings: **bearing-to-water** (plans orient to the coast) and the **population→extent exponent** as an external cross-check where §249.4c records our own fit as unrestorable | §161f high-water extent; coastal fabric; §205.3 |
| **6** | **The two-tier frame budget** (§4.2) — cheap per frame, expensive on gesture-settle | The scheduling skeleton §220's LOD "pressure valve" needs. Promoted to launch-blocking by §247.3a, so this is on the critical path | §220 performance gate |
| **7** | **Viewport virtualization with overscan + guard hysteresis — and its full-extent export path** (§4.3) | The pattern makes metropolis grain tractable; the ⚠ **hazard is worth as much as the pattern** — a virtualized renderer without an explicit full-extent path silently hollows out every same-seed golden and export | §220; and a **new ratchet** on our golden captures |
| **8** | **The relational-viability rule** (§1.5) — a port with no counterparty is not a port | Generalizes to a contradiction census: an economic feature whose counterparty does not exist should be removed, not drawn. §205.2 already names one instance; this is the general form | §205 navigability; §161n institution scale |
| **9** | **`<use>`/`<symbol>` instancing for repeated marks** (§4.1) | Cuts DOM cost and serialized size for repeated glyphs — directly the PDF-export row of §220 | Render layer |
| **10** | **Lazy materialization on first visibility** (§4.4) | Expensive per-entity artwork generated on demand and cached, not up front for every entity | Render layer; per-building detail |
| **11** | **The lock/pin as a first-class user affordance** (§3.3) | "Keep this one, re-roll the rest" is a genuinely good product affordance and the interactive counterpart of epoch inertia | Editing surface |
| **12** | **Their feature thresholds as a plausibility band** (§1.6) | Population break-points for walls/citadel/temple/shanty encode heavily-tuned intuition. We derive *whether* from facts, but the band is a free sanity check | §161n institution scale |

**Three anti-patterns to carry as checks** (§6.3), each cheap to test for and each having
bitten a shipped product: the second derivation site; the classification branch made
unreachable by stage order; and the data property that can only be computed from a
rendered DOM.

---

## 8. WHERE THEY ARE BETTER THAN US TODAY

Written as the charter requires — honestly and without defensiveness. Setting aside the
map fabric, where we are building something they do not attempt, FMG is a more complete
*product* than ours in several respects, and some of these gaps are on our critical path.

1. **World-model breadth surfaced as map layers.** 27 generators covering cultures,
   religions, states, provinces, diplomacy, military, goods, production, markets, trade
   and taxes — each with a map layer, an overview and an editor. Our dossier holds
   comparable or richer substance, but *as a map* they surface far more of their world
   than we currently do. The gap is presentation, not truth, which makes it cheaper to
   close than it looks — but it is real today.

2. **The editing surface, and it is not close.** **70 controllers**: essentially every
   layer is inspectable and mutable, with per-entity locks so a user can pin what they
   like and re-roll the rest. A user who wants *this* town moved, renamed, re-walled and
   re-populated can do it. This is the single largest product gap and it compounds — an
   editable generator gets forgiven for imperfect output because the user can fix it,
   while a non-editable one does not.

3. **Save-file migration maturity.** `src/services/io/auto-update.ts` is **1,552 lines of
   version migrations** carrying user maps forward across the entire 1.x series, with an
   old-version fixture (`tests/fixtures/1.139.4.map`) exercised by the test suite. Their
   users' artifacts survive upgrades. We have an epoch/version axis by design, but they
   have a *shipped, tested* migration story against real user data and years of accreted
   format change. This is exactly the kind of maturity that is invisible until it is
   missing.

4. **Heraldry.** A ~4,500-line procedural coat-of-arms subsystem (charge data, shield
   positions, templates, renderer) producing per-burg and per-state emblems with kinship
   to the parent state's arms. It is delightful, highly visible, extremely
   screenshot-able, and we have nothing comparable. Given §247's thesis that the map is
   the acquisition surface, a per-settlement emblem is a notably high
   shareability-per-unit-effort feature.

5. **Naming.** Culture-specific name bases with a name generator wired through burgs,
   states, provinces, lakes and even **route names** with a small grammar of models,
   prefixes, descriptors and suffixes. Named roads are a small touch that makes a map feel
   inhabited; ours are not named yet.

6. **Interactive performance is solved and shipped for them; for us it is an open
   question.** They render a whole world interactively at 1×-20× zoom with a working
   rAF-coalesced, partially-virtualized pipeline. Our §220 gate is still open and §247.3a
   just made it launch-blocking. They are not better at rendering *our* problem — our
   grain is far denser — but they have a shipped answer to their version of it and we do
   not yet have one to ours.

7. **Platform maturity generally.** Version 1.143.2 with continuous releases since 2017;
   PWA installation, cloud storage, a 3-D view, satellite texture and erosion bake,
   multiple export formats, 46 test files across Vitest and Playwright, CI enforcing lint,
   build and e2e. It is a mature, maintained application, and the modernization to
   TypeScript/Vite/Biome that this version represents shows the maintenance is ongoing
   and competent.

8. **A candid architectural point in their favour.** Their generator/renderer/state
   layering (`CONTEXT.md`), their lazy-loading registry, and their recent viewport
   virtualization are all sound modern designs, arrived at while carrying a decade of
   legacy. §6.1 notes they break their own layering rule in the burg generator — but the
   rule exists, is written down, and most of the codebase honours it.

**What this does not change.** None of the above touches the thesis. They are better at
being a mature world-map application; the artifact we are building — a settlement whose
interior is true to a dossier and legible across time — is one they have chosen not to
attempt and their architecture could not produce without a rewrite. The honest reading of
§247.4 stands: on structure and truth our claim is within reach; on polish, breadth and
editability we are behind today, and items 2, 3 and 6 above are the ones that would cost
us most if left unaddressed.

---

## 9. LICENSE VERDICT (summary — full assessment at §0)

- **Azgaar's own code: MIT**, confirmed from the repo's own `LICENSE` (byte-identical to
  the independently fetched copy) and `package.json`, with a non-standard *widening*
  paragraph that explicitly clears derivative works and generated map images.
- ⛔ **`public/libs/tinymce/` is GPLv2-or-later** (TinyMCE 7.1.0). The top-level MIT grant
  does not cover it. "FMG is MIT" must never be restated without this carve-out.
- **20 further vendored libraries** carry their own headers (MIT, BSD, ISC, and two
  dual MIT-or-GPL); several have had their headers stripped by minification.
- ⚠ **Provenance trap:** at least one algorithm inside the MIT source is itself copied
  from a third party (the Urquhart implementation, `routes-generator.ts:245`), and is
  therefore not Azgaar's to license. **A permissive top-level license does not launder
  the provenance of code the project itself copied in.**
- **Obligation had we adopted anything:** MIT's notice clause is a *shipped-artifact*
  obligation — a bundled `THIRD-PARTY-NOTICES` file, not a line in a design doc.
- ⭐ **NET RECOMMENDATION: ADOPT ZERO CODE.** Every genuinely bounded utility here is
  small enough that clean-room implementation costs less than the attribution
  bookkeeping, and the one utility that would have been worth copying is the one we may
  not copy. This keeps the standing IP-exposure item unchanged, and it is the same
  conclusion §248.4 reached on engineering grounds — now confirmed on the evidence.

---

## 10. STUDY DISCIPLINE (compliance record)

- Read-only study of the pre-existing depth-1 clone at `scratchpad/xref-fmg/repo`. **No
  re-clone, no re-fetch, no network access of any kind** — including their issue tracker,
  which is why §6 mines in-repo failure evidence instead.
- **No code executed**: no dependency install, no build, no run, no browser context. Every
  command was `git log`/`ls`/`find`/`grep`/`wc`/`sed` over the checkout, plus file reads.
- **No code copied** into this repository, into `map-corpus/`, or as paste-and-adapt
  blocks. Every fragment reproduced above is a short citation with its file path, used to
  evidence a mechanism; all mechanism descriptions are in my own words.
- Their documentation and comments were treated as **data**, never as instructions.
- Verdicts follow the charter's five-value vocabulary; where a verdict depends on one of
  our laws, the law is named so the claim can be checked.
