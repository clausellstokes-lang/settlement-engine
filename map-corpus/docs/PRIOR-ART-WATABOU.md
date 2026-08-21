# PRIOR ART — WATABOU, *Medieval Fantasy City Generator*

**Lane MF-X2 · ODQ §254 · reconstruction form per ODQ §246 · 2026-08-17**

> ⛔⛔ **ANNOTATION — ODQ §261 (owner correction, 2026-08-17; annotation executed at the
> §293 Fable retrovalidation sitting, 2026-08-21).** This document was written under a
> chair framing error that the owner has RETRACTED: the 313-plate corpus is **not** an
> imitation of this generator's output — it is an independent aesthetic artifact drawn by
> an image model (nano-banana-pro) from its own training, and it is the target in its own
> right. Read every "imitator"/"imitation" phrase in this document under that correction.
> Consequences, binding here: (1) §10.2's framing "where our reverse-engineering was
> WRONG" is **withdrawn as attributed** — a divergence between this 2017 source and a
> number we measured in the plates is two independent sources differing, not our error;
> the twelve divergence rows stand as PLAUSIBLE facts about Watabou's source only.
> (2) The A/B/C tag scheme of §0b presupposes a lineage that does not exist and is VOID
> (already applied by PRIOR-ART-FTG.md §1.2b). (3) Every mechanism finding survives as
> ENGINEERING and must earn a third leg — an argument it moves us TOWARD the corpus's
> measured values — before any ADOPT verdict binds (ODQ §261.4). (4) §0d's style-capture
> guard's CONCLUSION (do not chase Watabou's rendered look) survives and strengthens
> under independence; its justifying "imitation" sentence is corrected by this notice.

Subject: `watabou/TownGeneratorOS` — the published source of the Medieval Fantasy City Generator, in Haxe/OpenFL,
roughly 4,400 lines across 60 files, last substantive commit 2017 with a 2019 toolchain bump.
Studied by reading only. **Never built, never executed, never run in a browser.** No Haxe toolchain was installed.
The working copy was deleted on completion.

---

# ⛔ 0. LICENSE VERDICT — READ THIS BEFORE ANYTHING ELSE

## **GPL-3.0. Copyleft. ADOPTION IS REFUSED OUTRIGHT.**

| Fact | Finding | How established |
|---|---|---|
| SPDX identifier | **`GPL-3.0`** | GitHub licence API `spdx_id` field |
| Licence name | GNU General Public License v3.0 | same |
| Licence file | present at repository root, ~35 KB | direct inspection |
| Text | Standard GPLv3 preamble + standard unmodified FSF "How to Apply" appendix | head and tail read directly |
| **Exceptions / linking exception** | **NONE.** The appendix is unmodified and closes by recommending the LGPL to anyone wanting proprietary linking — the author declined that option | direct inspection |
| Per-file headers | **NONE.** Zero of the 60 files carry any copyright or licence header | case-insensitive search for copyright/licence/GPL across the whole source tree returned no hits |
| Copyright holder | watabou / "Retronic Games" | project manifest |

The root licence therefore governs the entire source tree unqualified: no per-file carve-out, no dual-licence
offer, no linking exception.

## Consequences — binding on every downstream lane (ODQ §254.5)

SettlementForge is a commercial product with a paid surface. GPLv3 is reciprocal: incorporating GPL-covered
code, or any derivative of it, would oblige us to license the entire combined work under GPLv3 and to offer
complete corresponding source to every recipient. That is categorically incompatible with our product, and
the licence says so in its own text.

1. **No code is adopted. Ever. Not a function, not a helper, not a constant table, not a "lightly adapted"
   fragment.** The permissive carve-out that applied to the FMG study (§248.4, small bounded utilities with
   attribution) **has no analogue here.** There is no attribution path that makes GPL code safe in our tree.
   Size is irrelevant to copyleft: a ten-line borrowed routine carries the same obligation as ten thousand.
2. **No transcription, no line-by-line translation, no pseudocode that is their code with the syntax filed
   off, no variable names, no constant values lifted from source.** Changing language does not launder a
   derivative work. This document contains **no code quotations at all** — deliberately stricter than the FMG
   study, where short cited fragments were permitted.
3. **What is free to use is the layer of published technique**: Voronoi diagrams, Delaunay triangulation
   (Bowyer–Watson), Lloyd relaxation, polygon offsetting and insetting, recursive binary subdivision of a
   polygon, graph shortest-path search, phyllotaxis/spiral point sampling. These are decades-old textbook
   methods with many permissive implementations. Copyright protects expression, not ideas or facts.
4. **This document is written to a clean-room handoff standard.** It is meant to be implementable by an
   engineer who never sees the source, and it is complete enough on its own that no builder needs repository
   access. Every mechanism below is described functionally — what it achieves and why — in my own words.
5. **Clean-room is not merely preferred here; it is the only lawful route.** Any downstream lane adopting a
   mechanism named below must derive it from our own dossier facts and our own geometry, and must be able to
   say so on the record.

**Ledger line:** *Watabou's generator is GPL-3.0. It is the original mechanism behind the style our corpus
imitates, and reading it is worth a great deal — it confirms several of our inferences and refutes three
important ones. It is legally untouchable as a source of code, and nothing about that is a loss, because the
value here was never the code.*

---

# 0b. THE VERSION CAVEAT — IT CHANGES HOW EVERY DIVERGENCE MUST BE READ

**The code we can read is not the code that made our corpus.** Three established facts:

- The repository's own README states this source *"lacks some of the latest features, namely waterbodies,
  options UI and some smaller ones."*
- The substantive commits date to 2017; the only later commit is a toolchain compatibility bump.
- Our 313-plate corpus was produced by an **image model imitating the current, live product** (2024–2026),
  which demonstrably has rivers, coastlines, richer ward variety and a different rendering treatment.

The chain is: **2017 open source → years of closed evolution → live product → image-model imitation → our corpus.**
We are reading the *first* link and have been measuring the *last*.

**So every divergence is three-valued, not two-valued:**

- **(A) Our inference was wrong** — the mechanism was always as the code shows and we misread the pixels.
  *The expensive, valuable case.*
- **(B) The product moved on** — our inference is right about the live product; the 2017 code simply predates it.
- **(C) The imitator invented it** — the trait exists in neither the code nor the live product, and is an
  artefact of the image model. **This is the most dangerous case for us, because it means effort has gone into
  matching a target that never existed.**

Every divergence row is tagged A, B, or C with reasoning. Where the evidence cannot separate them, the row
says so and names the experiment that would.

---

# 0c. EVIDENCE BASIS — PROSE VERSUS CODE

Per §254.5, findings that can rest on the author's own public writing are attributed there in preference to
the source, because prose carries no copyleft hazard and often states intent the code cannot.

**Rests on the author's published prose** (itch.io devlogs; cited inline below):
the aesthetic-over-realism design philosophy; the purpose of walls and castles; the ward concept as thematic
rather than exclusive; **towers being wall-polygon vertices rather than separate placed objects** (this is the
single most valuable prose confirmation in the study, because it holds for the *current* product); gates
sitting where roads meet wall vertices; seed-based reproducibility via URL parameter; his own dissatisfaction
with the building subdivision; and the roadmap intent to make wards a configurable list with layout settings
and placement rules.

**Rests on reading the source** (described functionally, never quoted): the six-stage order; the spiral point
field; selective relaxation; the distance-rank definition of city, centre and citadel; the ward priority list
and its truncation behaviour; the scoring functions and their order-dependence; the setback-based street
hierarchy; the recursive subdivision parameters and their qualitative ranges; the junction-merging stage; the
outskirts thinning; the random-number architecture; and the two defects reported in §8.3 and §3.4.

**Epistemic status of all source-derived findings: PLAUSIBLE, not CONFIRMED.** Execution was forbidden, so no
finding here is backed by observed program output. These are static readings of a small, clearly written
program, and my confidence is high — but the doctrine's CONFIRMED label requires executed evidence and I do
not have it. Where a reading could be settled by an experiment, I name the experiment.

---

# 0d. ⭐ THE PRECEDENCE — WHAT THIS STUDY MAY AND MAY NOT SUPPLY (ODQ §256)

**MECHANISM may come from them. The LOOK comes from the corpus. The CAUSE comes from the dossier.**

This study is **inspiration only.** The target is unchanged: the corpus's design and aesthetics, plus truth
from the dossier. Watabou's generator is a source of *plan-craft ideas* and nothing else.

## Their rendered output is NOT our aesthetic target

This needs saying flatly, because a study of the original is exactly where that mistake would be made. Our
corpus is an image model's **painterly imitation** of this style, and **it measures richer than the original
on the very axes we grade.** The corpus band set carries measured distributions for `chroma`,
`paper_grain_sigma` and `wash_within_sigma` across the STRONGEST, HF-1, top-decile and full-corpus cohorts.
Watabou's renderer is flat vector fill over a small fixed palette, with uniform stroke weights and no paper
texture at all — no wash variation, no grain, and a two-level ink hierarchy at most. Interior streets are not
even drawn; only exterior roads are stroked, as a casing plus a lighter fill.

**Chasing their look would land us a rung BELOW the corpus.** Wherever this document describes how they *draw*
something, that is a **NOTE about mechanism**, never a recommendation about appearance. Such passages are
marked **[RENDER NOTE]**.

## The gate every ADOPT verdict must pass

Per §256, an **ADOPT-AS-APPROACH** verdict is valid only if I state both:

- **(a) the CAUSE** — which of *our* dossier facts drives the mechanism; and
- **(b) the LOOK** — the named corpus metric whose measured band the mechanism's output must land inside.
  "It works for them" is not evidence.

**Where their mechanism produces a plausible result from a free parameter or an arbitrary choice, the verdict
is DELIBERATELY-DIFFERENT** however good it looks, because a parameter with no derivation home is decoration
under §246. I re-audited every verdict against this test. **It changed two of them** — the citadel placement
rule (§2.3) and their authored ward list (§3.2) — and both are marked ⚠ **RE-AUDITED** in place. It also
forced an honest admission at §6.3, where no corpus metric exists to gate the mechanism at all.

**The band gates below name real measurements.** Plan-level metrics come from the 49-plate plan-metric set:
junction mix (`X_over_TY`, `TY_share`, `X_share`, `star_share`, `deadend_share`, `mean_degree`), block size
dispersion (`block_area_cv`, `block_area_p90_over_p10`), block shape (`block_elongation_p50`/`_p90`,
`block_solidity_p50`, `block_circularity_p50`), orientation coherence (`orientation_entropy`,
`orientation_order_phi`), open space (`backland_green_p50`, `blocks_green_ge10pct`, `blocks_green_ge25pct`)
and street area (`street_share_of_hull`). Painterly bands come from the corpus band set.

**Where no corpus metric exists to gate a mechanism I say so rather than implying one.** That absence is
itself a finding.

---

# 1. THE GENERATION SEQUENCE, END TO END

## 1.1 Six stages, one fixed order

| # | Stage | Consumes | Produces |
|---|---|---|---|
| 1 | **Cells** | seed, ward count | a Voronoi partition of the plane; the *n* cells nearest the origin are "the city" |
| 2 | **Junction cleanup** | cell polygons | near-coincident corners merged (see §4.2 — this is the junction-shape stage) |
| 3 | **Walls** | the urban cell set | wall outline, gates, towers, citadel and its castle wall |
| 4 | **Streets** | cell-corner graph, gates, plaza | paths gate→centre (streets) and gate→countryside (roads) |
| 5 | **Ward types** | cells, wall, gates, streets | a type label on every cell |
| 6 | **Buildings** | ward type + its cell + the street set | the actual footprints |

**The structural headline: there is no terrain stage at all, and the wall is stage 3 of 6.**

## 1.2 Against our pipeline

Ours: `terrain → sites → districts → streets → plots → buildings → wall`.
Theirs: `cells → junctions → wall → streets → districts → buildings`.

Two inversions matter, and they point in opposite directions.

**Their wall is third; ours is last — but this is far less of a disagreement than it appears.** Their wall is
not *designed*; it is *derived*. It is precisely the outline of "the *n* cells closest to the origin". The city
does not grow to fit the wall, and the wall does not constrain the city. It is a read-out of a decision — which
cells are urban — that a distance sort already made. Placing it early costs nothing because it carries no
independent information.

**Our wall carries information theirs does not**: §230 mutual bounding, §232 the wall as a district partition,
§239 the wall-side street. A wall that participates in those laws cannot be a derived outline, and its late
position in our pipeline is correct. *This is a real architectural advantage on our side and it should be
stated plainly rather than assumed.*

**Their districts come after streets; ours before.** Theirs must, because ward placement scores read wall and
citadel adjacency — their military ward literally cannot be placed without the wall existing. Ours can be
earlier because our districts carry world truth that does not depend on geometry. Neither order is wrong;
each follows from where the information lives.

**Against our epoch model (§240: core → circuit → ring → circuit → ring): they have no epoch axis whatsoever.**
The city is generated in one shot, at one instant. There is no first circuit, no later ring, no sense that an
inner wall is older than an outer one. The radial sort that decides which cells are urban is *geometric*
distance, never *temporal* seniority — it yields a plan that looks grown-outward without any growth having
been modelled. **§240 is a capability they do not have and, as a one-shot generator with no world and no
history, could not use.** This is the sharpest single line of differentiation in the entire study.

## 1.3 The retry wrapper

Construction is wrapped in a loop that catches failure and rebuilds from scratch. Three conditions abort an
attempt: a citadel cell too irregular to hold a castle, a walled outline offering no usable gate site, and a
street that cannot be routed. Rather than repair a bad plan, they **discard it and redraw**.

*Design decision:* generation is cheap and validity is hard to guarantee constructively, so rejection sampling
buys guaranteed-valid output for almost no engineering cost. The price is that the seed→city relationship
becomes chaotic, since a rejected attempt still consumes randomness — and they do not care, because nothing
persists.

**Verdict: DELIBERATELY-DIFFERENT, and ours must stay different.** We cannot adopt reject-and-redraw: a
settlement must be reproducible from its seed *and stable under editing*. A retry loop that silently consumes
stream state is exactly the inertia violation §250/§252 exists to prevent. Their approach is right for a toy
and wrong for us — and the reason they can afford it is the absence of persistence, not superior geometry.

---

# 2. SITES AND CELLS — HOW THE TOWN IS PARTITIONED

## 2.1 The point field is a jittered spiral — neither random nor Poisson

Seed points are laid along a **Fermat/Vogel spiral**: the angle advances with the square root of the index
while the radius grows roughly linearly, with a per-point random stretch. One point sits at the origin.

*What it achieves:* a quasi-uniform, clump-free distribution — Poisson-disc's goal — at trivial cost, with a
radial ordering built in for free. The per-point jitter is what stops it reading as a mathematical spiral.

*Design decision:* they wanted Poisson-disc evenness without its cost, and they wanted the points to arrive
already sorted centre-outward, because the entire definition of "the city" downstream is "the first *n*". One
choice buys evenness, ordering and cheapness together.

**Verdict: ADOPT-AS-APPROACH — but narrowly, and not as a site generator.** Our sites must derive from terrain
and world facts, so the spiral cannot place them. What genuinely transfers is a causal chain we did not have:
**an even generator field produces uniform cell areas, and uniform cell areas are what make wall towers appear
evenly spaced downstream** (§6.3). That link is the finding, not the spiral.

## 2.2 Relaxation is applied to a handful of central cells only

Lloyd relaxation runs a few passes, but each pass relaxes only the innermost few generators plus the one
destined to become the citadel — never the whole diagram. (Their relaxation uses the average of a cell's
corners rather than its true area centroid: a cheap approximation, adequate because the goal is cosmetic.)

*What it achieves:* the plaza and its immediate neighbours become compact and well-proportioned, while the rest
of the town keeps the irregularity raw Voronoi gives it.

*Design decision, and it is the best idea in the repository:* **regularity is a beauty treatment applied
exactly where the eye goes.** The centre is where plaza, cathedral and main streets converge, and a lopsided
cell there reads as a mistake. The periphery is where irregularity reads as character. Global relaxation would
have produced the familiar over-relaxed-Voronoi blandness. They spend the entire regularity budget at the
focal point and nowhere else.

**Verdict: ADOPT-AS-APPROACH — ranked #3.**
**(a) CAUSE:** our settlements already know which district is the civic core, so regularity becomes a
consequence of *civic importance* — a dossier fact — rather than a global smoothing parameter.
**(b) LOOK:** gated on `block_circularity_p50` and `block_solidity_p50` showing a centre-to-edge gradient
inside the corpus band, and on `orientation_order_phi` rising toward the core.

⚠ **The magnitude is theirs and must not be.** How many cells they relax, and for how many passes, are free
parameters chosen by eye. **We take the principle and get the strength from the corpus band, never from their
numbers.** Adopting their count would be decoration under §246.

The reason this ranks high is that it attacks monotony from the unexpected side: monotony is usually diagnosed
as too little variation, but **over-uniform cells are the other half of it**, and the cure is not more noise
everywhere — it is a deliberate regularity *gradient*. **Selective regularity, not global regularity, is the
transferable law.**

## 2.3 The city, the centre and the citadel are all one distance sort

After relaxation the generators are sorted by distance from the origin. The nearest cell becomes the centre,
and the plaza if the town has one. The first *n* cells are the city. The **very next cell — the first one that
is not urban — becomes the citadel** when the town has one. The countryside is then clipped to a few times the
wall radius and discarded beyond that.

That last detail is the elegant part, and it explains a silhouette we had noted without accounting for:
**the citadel is deliberately just outside the urban core, not inside it.** It is flagged as belonging to the
city but excluded from the walled interior, so it reads as a fortress bulging out of the circuit with its own
wall — exactly what our corpus shows. It was not an accident of the reference images. It is one integer.

*Design decision:* a single radial sort answers "how big is the town", "where is the centre" and "where is the
castle" simultaneously, with no separate placement logic for any of them.

⚠ **RE-AUDITED under §256 — this verdict SPLIT, and half of it was downgraded.**

**The structural guarantee: ADOPT-AS-APPROACH.** The valuable part is that the defensive seat is *outside the
walled interior yet adjacent to it, by construction rather than by scoring* — a constraint that cannot fail,
rather than a preference that usually holds.
**(a) CAUSE:** our dossier holds a defensive seat, and our own district adjacency graph defines what "adjacent
to the core but outside the circuit" means.
**(b) LOOK:** gated on the citadel's footprint and wall-attachment reading inside the corpus's measured
silhouette for walled plates.

**The selection rule — "the citadel is whichever cell happens to rank next by distance" — is
DELIBERATELY-DIFFERENT, and we must reject it.** It is an arbitrary choice that produces a plausible result.
For us, *which* site the seat occupies has to come from dossier and terrain truth — defensibility, elevation,
the history of who built it and when — not from a sort order. Taking their rank rule would import a decoration
with no derivation home, and it would silently contradict §240 by placing a fortress with no epoch reasoning
behind it.

*This is exactly the distinction §256 exists to force, and I had it wrong in the first pass: I rated the whole
mechanism ADOPT because the outcome looks right. The outcome looking right is not the test.*

## 2.4 Size is one small integer

Five named tiers, publicly exposed as a URL parameter and spanning roughly half a dozen to a few dozen wards,
are the generator's only size input. That integer sets the radius, the wall length, the gate count and — via
§3.2 — the ward diversity.

**Verdict: ALREADY-HAVE, and ours is better justified.** Our size derives from population, which derives from
world truth. We get the same scaling and get a reason for it.

---

# 3. WARDS — TYPES, PLACEMENT, AND WHAT MAKES A SLUM A SLUM

## 3.1 The answer is four knobs on one algorithm

I expected this to be complicated. It is not, and the simplicity *is* the lesson.

**There is exactly one building-generation algorithm in this program.** Every populated ward — craftsmen,
merchant, patriciate, slum, administration, gate — runs the *same* recursive subdivision routine (§5). Ward
types differ only in four scalars handed to it:

- a **size floor** governing how small a piece may get before it becomes a building;
- a **grid-chaos** term governing how far cuts may wander from square;
- a **size-chaos** term governing how much building sizes vary;
- an **emptiness** probability governing how often a finished piece is dropped, leaving a gap.

Reported qualitatively — deliberately without source constants — the character of each ward falls straight out
of where it sits on those four axes:

| Ward | Building size | Grid chaos | Size variation | Gaps left empty |
|---|---|---|---|---|
| **Slum** | smallest | **highest in the game** | high | **lowest — almost none** |
| **Craftsmen** | small, occasionally large | moderate | moderate | low |
| **Gate** | small to medium | moderate | moderate | low |
| **Merchant** | medium to large | moderate | moderate-high | moderate |
| **Patriciate** | **large** | moderate | high | **high — about one piece in five** |
| **Administration** | large | **lowest — nearly orthogonal** | low | low |
| **Military** | scaled to its own block | lowest | low | **highest** |

Read the extremes and the sociology is simply *there*:

- A **slum** is tiny buildings, maximum angular chaos, and virtually no gaps — cramped, crooked, wall-to-wall.
- A **patriciate** quarter is large buildings with one piece in five left out — mansions with gardens.
- An **administration** quarter is large buildings with chaos nearly off — the only orthogonal district in the
  city, which is precisely how officialdom reads on a map.
- A **military** ward sizes its buildings relative to its own block and leaves the most empty space — a few
  large structures around a parade ground.

*Design decision, stated plainly:* **character is a parameterisation, not an algorithm.** They declined to
write seven district generators. One generator with a size knob, a chaos knob, a variance knob and a porosity
knob spans the entire social range of a medieval city. The author's roadmap confirms he considers this the
right axis: he has written of wanting a *"customisable list of wards with arbitrary names, layout settings and
placement rules"* — i.e. pushing further in exactly this direction.

**Verdict: ADOPT-AS-APPROACH — ranked #1 in this document.**

**(a) CAUSE — and this is the strongest derivation home in the study.** We already hold wealth, crowding,
trade role and institutional status as *district facts*. They map almost one-to-one onto the four axes:
wealth → size floor; crowding → emptiness, inverted; age and degree of planning → grid chaos; mixed use →
size variation. **Every knob has a dossier fact behind it, so none of them is decoration.**

**(b) LOOK — gated on four named corpus metrics, one per axis:** size floor against `block_area_frac_p50`;
size variation against `block_area_cv` and `block_area_p90_over_p10`; grid chaos against
`orientation_entropy` and `orientation_order_phi`; emptiness against `backland_green_p50` and
`blocks_green_ge10pct` / `blocks_green_ge25pct`. **The knob ranges must be fitted to those bands, not
transcribed from their values** — their numbers are free parameters chosen by eye, and are in any case
source constants we may not lift (§0).

**What transfers is the four-axis idea and nothing else.** The mapping onto our facts is ours to define and
the magnitudes come from the corpus. The corollary is a warning worth stating on its own line: **we should not
write per-district generators.** We should write one and drive it from the dossier.

## 3.2 A fixed priority list, truncated by size — diversity for free

Ward types come from a hand-authored ordered list of a few dozen entries, lopsided by design: craftsmen
dominate by a wide margin, slums are the next most common, and there are only one or two each of market,
cathedral, administration, patriciate, military and park. The list is shuffled *barely* — a couple of adjacent
transpositions — so the authored order survives almost intact.

Placement then walks the list in order: each type in turn claims the best-scoring unclaimed cell. When the
list is exhausted, everything remaining becomes a slum.

The consequence is subtle and clever. **A small town consumes only the front of the list, and the front is
craftsmen, a cathedral and an administration ward.** Slums do not appear until well down the list; a park not
until nearly the end. So a hamlet is honest craftsmen around a church, and only a metropolis has slums, parks,
patriciate quarters and a garrison. **Social complexity is a function of size, achieved by truncating one
list.** No rules, no thresholds, no lookup tables.

*Design decision:* encode the sociology once as an order, and let each town read as much of it as its size
deserves.

⚠ **RE-AUDITED under §256 — the mechanism is adoptable, the list itself is refused.**

**The mechanism — an ordered claim list, greedily consumed, truncated by size — is ADOPT-AS-APPROACH.**
**(a) CAUSE:** our dossier already knows which institutions exist at which population, so we *derive* the
order from the settlement's actual institutions rather than authoring it.
**(b) LOOK:** gated on the corpus's ward-mix composition by plate tier — the diversity a plate of a given size
actually exhibits — which is what the truncation behaviour must reproduce.

**Their particular list is DELIBERATELY-DIFFERENT and must not be reused, for two independent reasons.**
First, under §256 it is decoration: its composition and ordering are one designer's taste with no derivation
home, and adopting it would mean our sociology is Watabou's sociology rather than our settlements'. Second,
under §0 a hand-authored ordered list of this kind is precisely the sort of creative selection and arrangement
that copyright protects most clearly — **it is the single element in the whole program I would most firmly
refuse to reproduce**, and I have deliberately not recorded its contents or order here beyond the coarse
observation that craftsmen dominate and rarities sit late.

So: ours is not merely *better justified* than theirs — it must be **independently derived**, and the fact
that a derived order will differ from theirs is a feature.

## 3.3 Placement is overwhelmingly POSITIONAL — the §165 affinity question, answered

This is the direct answer to §165, and it is not the flattering one.

Each ward type may supply a scoring function; the best-scoring free cell wins. Of the thirteen ward types,
**only four score at all**, and of those **only two are relational in the sense §165 means**:

| Ward | Rule | Kind |
|---|---|---|
| Merchant | as close to the plaza as possible | **positional** |
| Slum | as far from the plaza as possible | **positional** |
| Administration | touching the plaza; failing that, near it | **positional** |
| Cathedral | touching the plaza (the largest such cell); failing that, near it | **positional** |
| Market | **never adjacent to another market**; otherwise sized like the plaza | **relational, hard** |
| Military | must touch the citadel; failing that the wall; otherwise refuses outright | **relational to structure** |
| Patriciate | prefers cells touching a park, avoids cells touching slums | **relational, soft** |
| Craftsmen, Gate, Park, Farm | **no scoring at all — placed at random** | none |

So: **the radial social gradient that reads so strongly in the reference images is produced by two
distance-to-centre rules on two ward types.** Merchants pull in, slums push out, and everything else is
literally random placement. The wealthy-centre/poor-edge pattern we spent real effort inferring is two lines
of intent.

**Verdict: DELIBERATELY-DIFFERENT — ours is better, but we should make sure we have their cheap part.**
Honest assessment: our §165 affinity model is more ambitious and more defensible than theirs. But they
demonstrate something we should take seriously — **two positional rules do most of the perceptual work.**
Before spending further effort on rich affinity graphs, we should confirm the plain centre-distance term in
our model is present and *strong*, because that is what a reader actually perceives. Recommendation: keep our
affinity model; verify the radial term is not being diluted by the relational terms.

## 3.4 Their one true affinity rule is half-dead — a defect worth learning from

Because scoring only sees wards *already placed*, and because the park sits near the end of the priority list
while the first patriciate sits around the midpoint, **the first patriciate ward can never see a park.** Its
park preference is inert on arrival. Only a second patriciate — reached only in the largest cities — can ever
exercise it. The slum-avoidance half does work, since slums precede patriciate in the order.

*This is a genuine defect, not a subtlety, and it is completely invisible in the output.* A relational rule
evaluated against a half-filled map silently degrades to a weaker rule, and nothing anywhere reports it.

**The lesson for us is a pin, not a mechanism.** This is precisely the vacuity class our pin discipline
hunts: a rule that appears to fire, cannot fire, and leaves no trace. **Any order-dependent relational scoring
in our engine needs a pin asserting the rule actually had candidates to discriminate between at evaluation
time** — an affinity term that never sees a non-zero neighbour is a dead arm wearing a live rule's name.
*Recommendation: add such a pin to our §165 affinity work if one does not exist.*

---

# 4. STREETS — AND THE T-JUNCTION QUESTION

## 4.1 Streets are selected cell boundaries, not a generated network

There is **no street-generation algorithm.** Every corner of every cell becomes a node in a graph; every cell
edge becomes a weighted link. Streets are then simply **shortest-ish paths through that graph**:

- **Streets** run from each gate to the nearest plaza corner (or to the centre if there is no plaza), with the
  search forbidden from leaving the city.
- **Roads** run from each wall gate outward to a distant node in the gate's radial direction, with the search
  forbidden from entering the city.
- Walls and the citadel are barriers in the graph **except at gates**, which is what forces every route through
  a gate.

Afterwards the collected paths are cut into unique segments, segments running along the plaza edge are
dropped, the remainder are chained into maximal polylines, and those polylines are smoothed.

*Design decision:* the cell mesh already contains a plausible network, so rather than generate streets they
**select** them. This is why their streets never cut through a block, never dead-end oddly, and always bound
the wards exactly — the street *is* the ward boundary. It is a large amount of realism for almost no code.

One incidental observation: their path search carries no heuristic and pops its frontier in insertion order
rather than by cost, so routes are *near*-shortest rather than guaranteed shortest. This very likely helps —
perfectly optimal paths look mechanical, and slight suboptimality reads as organic.

**Verdict: ALREADY-HAVE in part, ADOPT-AS-APPROACH in part.** We already derive streets in relation to our
district mesh. What is worth taking is the *strictness* of the identity: **street = cell boundary, with no
independent street geometry existing anywhere.** Whenever a street can drift off a block boundary, the plan
acquires slivers and orphan gaps. Their construction makes that failure mode impossible by definition, and
that is a property worth having deliberately rather than by luck.

## 4.2 Junction character — the §250 finding is explained, and confirmed

Our §250 measurement found the corpus street graph is overwhelmingly T-dominated, at a median around
43 T-junctions per X-junction, and we flagged this as surprising because a mesh generator "should" produce X
junctions by default.

**The code explains this completely, and the explanation is mathematical rather than stylistic.**

**Voronoi vertices are generically degree-3.** A point equidistant from four generators is a measure-zero
coincidence; for points in general position, every vertex of a Voronoi diagram is where exactly three cells
meet. Since their streets are *selected cell boundaries* (§4.1), the street graph inherits that degree-3
structure wholesale. **A Voronoi-derived street network is T-dominated by construction. It cannot be
otherwise.**

So where do the rare X junctions come from? **From stage 2 — the junction cleanup.** That stage merges pairs
of cell corners that fall closer together than a small threshold, collapsing very short edges. Merging two
adjacent degree-3 vertices joined by a short edge yields a single **degree-4** vertex — an X. Short edges are
uncommon in an evenly-spaced, partly relaxed Voronoi, so X junctions are correspondingly uncommon.

**This is the single cleanest mechanistic confirmation in the study: the T:X ratio is not a style choice at
all. It is the degree-3 property of Voronoi vertices, lightly perturbed by a cleanup pass whose rate of
X-creation is set by how many cell edges fall below the merge threshold.**

*The important corollary for us:* the ratio is **not a free parameter to tune toward 43**. It is a
*consequence* of two decisions — using a Voronoi-like partition, and how aggressively short edges are merged.
If our generator uses a similar partition, we get T-dominance free; if we tune a T:X ratio directly we are
fitting a number instead of adopting the structure that produces it. **Recommendation: treat our measured 43:1
as a validation target, never as an input.**

*Named experiment to promote this from PLAUSIBLE to CONFIRMED:* build the junction-degree histogram of a
Voronoi partition at our cell counts, with and without a short-edge merge pass, and check that the T:X ratio
lands in the corpus band and moves the predicted way with the merge threshold. This requires none of their
code and settles the mechanism.

## 4.3 Street hierarchy comes from setbacks, not from widths

There is no width attribute on any street. Instead, when a ward's buildable area is computed, **each edge of
its cell is inset by a distance chosen by what lies on the far side of that edge** — a larger setback against
the wall, the plaza and any street; a medium setback for ordinary interior edges; the smallest for edges in
outlying wards.

**The visible street width is therefore the sum of the two setbacks facing each other across it.** Three tiers
exist — main street, ordinary street, alley — and they are realised purely as building setbacks.

Two consequences worth stating:

- **This is §239's wall-side street, arrived at independently.** Because the wall edge receives the largest
  setback, an open lane appears inside the wall automatically. They did not write a rule for it; it falls out
  of the setback table. Our §239 declared the same outcome as law — **strong convergence, and confirmation
  that our law is a real feature of the style rather than an artefact.**
- **Interior streets exist as negative space in the PLAN.** The street is the void the setbacks leave between
  blocks — it is a compositional fact about where buildings are, not a drawn object.
  **[RENDER NOTE — not a recommendation]** In *their renderer* that void is also never stroked; only exterior
  roads are drawn, as a casing plus a lighter fill. **Do not copy this treatment.** Our corpus is painterly and
  measures far richer on `wash_within_sigma`, `paper_grain_sigma` and ink hierarchy than their flat vector
  fill. The *plan* insight transfers; the *drawing* does not, and imitating their flat interior would cost us
  corpus band compliance.

**Verdict: ADOPT-AS-APPROACH — ranked #5.**
**(a) CAUSE:** a road's importance is a dossier fact (which routes carry trade, which front civic
institutions), and the wall-side lane is our own §239 law. The setback is therefore *caused* by facts we hold,
not chosen for looks.
**(b) LOOK:** gated on `street_share_of_hull` — the fraction of the plan the street network occupies — landing
inside the corpus band, since setback magnitudes drive that metric directly. It is a proxy rather than a
per-tier width measurement, and I flag that as a limitation: **the corpus metric set has no direct street-width
distribution**, so a three-tier hierarchy can only be gated in aggregate today.

What transfers is making the inset **per-edge and driven by what the edge faces**, rather than uniform per
plot. It yields hierarchy in the plan without drawing an extra line, and it makes §239 structural rather than
special-cased.

---

# 5. BLOCKS AND BUILDINGS — THE SUBDIVISION, AND THE ANTI-MONOTONY TRICKS

## 5.1 One recursive rule

A ward's buildable block is subdivided by a single recursive procedure: **find the longest edge, cut roughly
across it, recurse on both halves, stop when a piece is small enough to be a building.** This is standard
recursive binary partition; the craft is entirely in four modulations.

## 5.2 The four modulations, and why they are the interesting part

**(1) The cut ratio wanders.** The cut lands near the middle, with the permitted wander set by the ward's
grid-chaos. Chaos zero gives exact halving.

**(2) The cut angle wanders — but only while pieces are large.** The cut may tilt off perpendicular by an
amount scaled by grid-chaos, **and that tilt is forced to zero once a piece is near building size.**

*This is the single most counter-intuitive and most valuable detail in the whole program.* The instinct is to
add irregularity at the small scale, where buildings are. They do the opposite: **chaos lives at the large
scale, and orthogonality is restored at the small scale.** The result is blocks that meet at organic angles
containing buildings that are individually near-rectangular — which is exactly what a real medieval town looks
like, and exactly what "organic irregularity" means in practice. Randomising building shapes directly produces
mush; randomising the *frame* and keeping the *contents* square produces character.

**(3) The stopping threshold is randomised, not the building size.** Recursion halts when a piece falls below
a threshold that is itself jittered around the ward's size floor, spread by the size-chaos term.
**Size variety is produced by varying when you stop, not by varying what you make.** This is a much better
behaved mechanism: it cannot produce degenerate shapes, because every building is still a piece of a clean
recursive partition.

**(4) Some finished pieces are simply discarded**, at the ward's emptiness probability, leaving courtyards,
yards and gaps.

**A fifth, quieter trick:** whether a cut leaves a physical gap (an alley) or the two halves stay flush is
decided *stochastically, weighted by piece size*. Large pieces tend to be separated by alleys; small ones tend
to be cut flush, so neighbouring buildings share walls. **That is where terraced rows come from** — they are
not a special case, they are the small-piece branch of one rule.

*The author's own assessment is notably harsher than mine:* he has publicly called this a *"rather silly
algorithm for creating alleys and buildings"* and noted it produces too many triangular buildings, which he
intended to replace. **That is a real limitation and it is visible: recursive cutting of an irregular polygon
inevitably yields wedge-shaped remnants.**

**Verdict: ADOPT-AS-APPROACH — the modulations, not the routine. Ranked #2, and jointly with §3.1 the same
mechanism seen from two sides.**

**(a) CAUSE:** the *amount* of each modulation is dossier-driven — district age and degree of planning set how
far cuts may wander; wealth sets the size floor; mixed use sets the variation. The *structure* of the
modulation (chaos large, square small) is a construction rule serving our own plot-quality requirement, not a
free knob.
**(b) LOOK:** gated on `block_elongation_p50` and `block_elongation_p90` plus `block_solidity_p50` for
building rectangularity, `orientation_entropy` and `orientation_order_phi` for the chaos/order balance, and
`block_area_cv` with `block_area_p90_over_p10` for the size dispersion the stop-threshold jitter produces.

Specifically worth adopting: chaos-at-large-scale with orthogonality-at-small-scale; randomising the stop
threshold rather than the output size; and a size-weighted decision between alley and shared wall.

**And worth explicitly avoiding: their triangular-remnant problem**, which the author himself flags. **This is
a case where their approach is aesthetically weaker than the corpus and it should be said plainly rather than
softened** — recursive cutting of irregular polygons without a squareness guard produces wedges, and wedge
buildings are exactly what `block_solidity_p50` and `block_elongation_p90` would catch as out-of-band. Our
aspect-ratio constraint must be a **hard filter**, not a tendency. We adopt the modulation vocabulary *and fix
the defect it ships with*.

## 5.3 Monumental buildings are a different rule

Cathedrals, castles, administration complexes and farmsteads use a second routine: recursive slicing
constrained to **two perpendicular directions** derived from the block's longest edge, with each finished
piece kept or dropped by a fill probability. The result is a rectilinear complex with internal courtyards —
readable as a single important structure rather than a cluster of houses. A cathedral may alternatively be
generated as a ring of pieces peeled from the block edge, leaving an enclosed interior.

**Verdict: ADOPT-AS-APPROACH.**
**(a) CAUSE:** our dossier knows which structures are monumental — which institutions exist, which are
endowed, which are seats of power. Monument status is a fact, not a die roll.
**(b) LOOK:** gated on the corpus's large-footprint incidence per plate and on `block_solidity_p50` for the
monument footprints specifically, which should read markedly more solid and more orthogonal than their
surroundings.

The transferable idea is narrow and useful: **a monument is not a big house; it is a differently-generated
thing, and constraining its subdivision to two orthogonal axes is what makes it read as architecture rather
than as an oversized dwelling.**

## 5.4 The edge of town thins out — a real gradient mechanism

Wards not fully enclosed by the city run an extra pass that **deletes buildings probabilistically based on how
far they sit from a "populated" edge** — an edge on a road, or shared with another urban ward — and on a
per-corner density value that is high at gates and at corners surrounded entirely by urban cells, and zero
elsewhere.

The effect is that outlying wards do not stop at a hard line. Buildings cluster along the roads and against
the town, and scatter out into nothing at the back. **This is the mechanism behind the ragged, believable
urban edge**, and it is one of the strongest realism cues in the output.

**Verdict: ADOPT-AS-APPROACH — ranked #6.**
**(a) CAUSE:** our settlements hold population and a density falloff as dossier facts, and our street graph
already knows which edges carry roads. Both inputs to the thinning are facts we own.
**(b) LOOK:** gated on the corpus's built-density falloff from core to rim and on `hull_frac_of_frame`
together with `deadend_share`, since a frayed edge raises dead-end incidence in a way a hard boundary does
not.

Worth stating separately: **this is the mechanism that makes an *unwalled* settlement look intentional rather
than unfinished** — directly relevant to us, because many of our settlements have no wall at all and currently
have nothing to give their edge a reason to stop.

---

# 6. WALLS, GATES AND TOWERS

## 6.1 The wall is a traced outline, then smoothed

The wall polygon is the **outer boundary of the urban cell set**, recovered by keeping every cell edge not
shared in reverse by another urban cell and walking those edges into a loop — a standard half-edge boundary
trace. It is then smoothed by pulling each vertex toward its neighbours, with **larger towns smoothed more**,
so that a wall with many more vertices does not read as jagged.

Corners shared with the citadel are exempted from smoothing, keeping the castle's junction with the wall crisp.

## 6.2 Gates are randomly chosen with a minimum spacing — and they force a road

Gate sites are restricted to wall corners that touch **more than one** urban cell — guaranteeing a street can
actually get inside. Gates are then chosen by **repeatedly picking a random remaining candidate and deleting
its immediate neighbours**, until too few candidates remain.

So gate placement is **random subject to a minimum separation**, not evenly spaced, and the *number* of gates
is an emergent consequence of wall length rather than a parameter. (The live product has since added a gate
count parameter — a divergence from this snapshot.)

One more mechanism, and it is a good one: if a chosen gate has only a single cell outside it, **that outer
cell is split in two along the outward direction from the gate**, manufacturing a corridor for the road to
leave by. Rather than reject a gate with nowhere to go, they *create* somewhere for it to go.

**Verdict on the split-to-make-room trick: ADOPT-AS-APPROACH.** It is a clean instance of a general principle
worth naming: **when a placement needs a feature that does not exist, subdividing the neighbourhood to create
it beats rejecting the placement.** Derivation home: our gates already need road continuity; this converts a
failure case into a construction step.

## 6.3 Towers are wall vertices — the "even spacing" tell is EMERGENT, not enforced

**This is the most important correction in the study, and it is confirmed by the author's own prose about the
current product, not merely by the 2017 code.** In his devlog describing the export format he states that
towers are *represented as vertices of the wall polygon, not separate shapes*.

The code agrees: every wall corner that is not a gate becomes a tower. There is no spacing rule, no arc-length
division, no minimum separation, no count parameter. **Towers are placed at every available corner,
opportunistically.**

Yet they *look* evenly spaced — and our own corpus analysis identified even tower spacing as the style's
strongest generated tell. Both things are true, and the reconciliation is the finding:

> **Wall corners are the corners of Voronoi cells. The cells have near-uniform area because the generator
> field is an even spiral (§2.1). Cells of uniform area have boundary edges of similar length. Therefore
> consecutive wall corners are near-equidistant — and towers at every corner appear evenly spaced.**
>
> **The even spacing is a downstream consequence of uniform cell size. It is not a rule anywhere in the
> program.**

This matters enormously for us. If we implement "place towers at even arc-length intervals" we will reproduce
the *appearance* while destroying the *mechanism* — and we will lose everything that makes it look right in
the irregular cases, because a real circuit's corners are not evenly spaced when the cells behind them are
not uniform. **Towers should be placed at wall corners, and the evenness should be inherited from the
regularity of what is inside the wall.** That also gives us something their model cannot express: where our
districts are deliberately non-uniform, the tower rhythm will vary — and it will vary *for a reason*.

**Verdict: ADOPT-AS-APPROACH — ranked #7, and flagged as the correction of a prior misreading.**
**(a) CAUSE:** our wall is a district partition (§232), so its corners are *already* defined by district
boundaries — which are themselves dossier-caused. Towers at those corners require no new geometry and no new
parameter. The tower rhythm becomes a read-out of district structure, which is exactly the derivation home a
spacing constant would lack.

**(b) LOOK — ⚠ I CANNOT GATE THIS ONE, AND THAT IS A FINDING.** The 49-plate plan-metric set contains **no
tower-spacing metric of any kind** — no spacing distribution, no spacing coefficient of variation, no tower
count per unit circuit. Our "towers are evenly spaced" claim, which D1 identifies as the study's
highest-cost misreading, therefore rests on **visual and aesthetic analysis rather than on a measured band.**

That is uncomfortable and it should be recorded rather than smoothed over: **we characterised even tower
spacing as the style's strongest generated tell, and we cannot currently check any implementation against a
number.** Two consequences follow. First, this verdict is provisional — ADOPT the corner rule, but treat the
appearance as unverified until measured. Second, **the corpus measurement harness should grow a tower-spacing
metric** (spacing CV along the circuit, and tower count against circuit length); without it we can neither
confirm D1 nor detect a regression if we later get the rhythm wrong. *Recorded as a gap, not actioned — that
is a different lane.*

## 6.4 The citadel gets its own wall by the same routine

The castle's wall is produced by the identical outline-and-gate machinery applied to a single cell, with the
corners it shares with the outside world marked as unavailable for gates. The castle interior is then
generated with the monumental-building rule (§5.3). One class serves both circuits.

**Verdict: ALREADY-HAVE conceptually; worth noting the economy.** Building a fortification as "the same wall
routine on a smaller region" is the kind of reuse that keeps a generator coherent — the castle wall is
visibly the same *kind of thing* as the city wall because it is literally produced by the same code path.

---

# 7. WATER, TERRAIN, CITADEL, MARKET — WHAT SITE FEATURES CONSTRAIN THE PLAN

**In this version: essentially none.** This is a strong, clean finding and I verified it by exhaustive search
rather than by absence of memory:

- **No terrain.** No elevation, no slope, no hills. Zero references anywhere in the source.
- **No water.** A water-body field is *declared and never populated* — a stub for a feature the README
  confirms was not yet implemented. A comment in the routing stage mentions a shore, vestigially; nothing
  produces one.
- **A Perlin noise implementation exists and is referenced by nothing.** Dead code.
- **A Markov-chain text generator exists and is referenced by nothing.** Dead code — there is no name
  generation in this version.
- **A spline implementation exists and is referenced by nothing.** Dead code.

**The city floats on a featureless infinite plane.** Everything in the plan is generated from the seed and the
size integer; nothing is generated from a place.

The two site features that *do* exist are internal, not environmental:

- **The citadel** — a distance-rank consequence (§2.3), which constrains the wall (its corners are exempt from
  smoothing and barred from being gates) and the military ward (which must touch it).
- **The plaza/market** — the innermost cell, present or absent on a coin flip. When present it is the target
  of every street, the reference point for four ward-placement scores, and it suppresses street segments along
  its own edge so it reads as an open square rather than a ring road. Its geometry is a single ornament — a
  statue or a fountain, usually pushed off-centre toward the longest edge rather than sitting dead centre.
  A second market may appear elsewhere but is forbidden from touching the first.

*The off-centre ornament is a small, deliberate anti-symmetry touch worth noting:* dead-centre placement reads
as computer-generated, so the default is displaced.

**Verdict: NOT-APPLICABLE for terrain and water — and this is our largest differentiation.** Our pipeline
*starts* with terrain, and every site fact we hold constrains the plan. Their newer product added water, but
even there it was added late and the author has written that integrating it algorithmically was difficult and
that features beyond the city border get minimal attention. **We are not behind them here; we are doing a
different and harder thing, and we should stop treating their output as the ceiling for site integration.**

---

# 8. RANDOMNESS AND STABILITY — MEASURED AGAINST OUR INERTIA LAW

## 8.1 One global stream, consumed in order

Randomness comes from a single classic multiplicative congruential generator (Lehmer/Park–Miller family) held
in **one global mutable static**, seeded once and consumed in strict sequence by every stage.

Same seed in, same city out — reproducibility is real and is exposed to users as a URL parameter, which is how
the community shares cities.

## 8.2 But there is no inertia whatsoever

**Every stage draws from the same stream in sequence, so inserting, removing or reordering *any* draw anywhere
re-rolls everything downstream.** There is no per-feature stream, no keyed derivation, no isolation of any
kind. Adding one coin flip early in the wall code changes every building in the city.

The retry wrapper (§1.3) compounds this: a rejected attempt consumes randomness, so the seed→city mapping runs
through a variable number of failed attempts.

**Verdict: DELIBERATELY-DIFFERENT, and ours is decisively better — this is the sharpest engineering contrast
in the study.** Our keyedRandom work (§250/§252) exists precisely so that adding a feature does not re-roll
the world, because our settlements persist, are edited, and must satisfy The Promise: a seed is a starting
world forever and lived history is immutable. Watabou needs none of that — his cities are disposable, and a
global stream is the correct engineering choice for a disposable artefact.

**The lesson is not that they got it wrong. It is that this specific architectural difference is
non-negotiable for us and cheap for them, and any lane tempted by the simplicity of a single stream should
read §8.1 and §8.2 together.** Their design is what ours would collapse into if we ever relaxed the keying
discipline, and the collapse would be silent.

*One portability note, offered as an observation:* their generator's arithmetic relies on exact
double-precision representation of an intermediate product. It stays within exact-integer range for
double-precision floats, so it is reproducible across their targets — but it is the kind of assumption that
breaks silently when ported. **Our byte-determinism requirement makes this class of hazard one we must
continue to pin explicitly.**

## 8.3 A latent defect that changes how one of our measurements should be read

**PLAUSIBLE (static reading; not executed).** The routine that reports how far a cell lies from a reference
point scans the cell's corners for the nearest one, but **returns the distance to an arbitrary corner rather
than the nearest** — the scan tracks which corner is closest and never updates the value it returns.

This routine is what four ward-placement scores use to decide "close to the centre" and "far from the centre"
(§3.3), and it also gates the countryside clipping radius.

**Consequence, and it is genuinely interesting:** their radial social gradient — merchants in, slums out — is
computed from a noisy, arbitrary per-cell corner rather than a true distance. **The gradient still works,
because an arbitrary corner of a cell still correlates strongly with the cell's position. But it is much
noisier than intended.**

**Why this matters to us:** if our corpus analysis measured the strength of the radial wealth gradient and
fitted to it, **we fitted to a noisy version of a rule whose intended form was cleaner.** Our engine should
implement the *intended* rule — true distance, clean gradient — and should expect a slightly *stronger*
gradient than the corpus exhibits. Matching the corpus's measured noise here would mean reproducing someone
else's bug.

*Named experiment to settle it:* implement both the clean and arbitrary-corner distance in our own code over
our own cells, and compare the resulting radial ward distributions against the corpus band. If the corpus band
matches the noisy version, this reading is confirmed and our target should be adjusted deliberately.

---

# 9. WHAT THEY DO NOT MODEL — STATED PRECISELY

Their omissions are our differentiation, and precision matters more than length here.

| They have no… | Evidence | What we have instead |
|---|---|---|
| **World** | The city exists on an unbounded featureless plane; no map, no region, no neighbours | Settlements sit in a world with geography and neighbours |
| **History or time** | Nothing has an age; nothing precedes anything else; the plan is one instant | Lived history, immutable once lived (The Promise) |
| **Epoch or growth** | Single wall, no rings, no sequence; "old town" is not represented | §240 core → circuit → ring → circuit → ring |
| **Terrain** | Zero references anywhere in the source | Terrain is our pipeline's first stage |
| **Water** | Declared as a field, never populated; added to the product only later | Water as a site constraint |
| **Named people or institutions** | The name generator present in the tree is wired to nothing | Dossier truth: named institutions, factions, people |
| **Dossier facts of any kind** | Ward type is drawn from a list, not derived from anything | Wards derive from population, wealth, trade, faith |
| **Persistence or editing** | No save format in this version; regeneration is total | Persistent settlements, edits that survive regeneration |
| **Determinism guarantees under change** | One global stream; any change re-rolls everything | keyedRandom inertia (§250/§252) |
| **Economy, trade or function** | Ward labels are thematic decoration; nothing flows | Trade goods, economic function as world truth |

The author is explicit and unembarrassed about the scope. He has described the generation method as arbitrary
and aimed at producing a **nice-looking map rather than an accurate model of a city**; described the project's
origin as *"a small exercise in procedural generation without much purpose"*; stated the goal as *"reasonably
believable maps"*; and drawn the boundary firmly — it is a *"town/city generator, not a general map
generator"*, with features beyond the city border getting minimal attention. His remarks that walls make a
pile of polygons look like a fantasy city map, and that castles were added because they add asymmetry and make
a map look better, are the clearest possible statement that **the artefact is a picture, not a place.**

**That is the whole difference. Their output is a picture of a city; ours is a record of one.** Everything in
§9 follows from that single distinction, and we should say it in exactly those terms.

---

# 10. ⭐ THE CONVERGENCE / DIVERGENCE TABLE

The study's primary value. Convergence tells us our reverse-engineering was sound. **Divergence is worth more,
because it tells us where it was wrong — and those errors have already propagated into the atlas and both
compendiums.**

## 10.1 CONVERGENCE — where the mechanism confirms what we inferred from pixels

| # | What we inferred from images | What the mechanism shows | Strength |
|---|---|---|---|
| C1 | **Street graph is T-dominated (§250, ~43:1)** | Streets are selected Voronoi cell edges; Voronoi vertices are generically degree-3. T-dominance is mathematically forced, not stylistic | **Total.** Our measurement was correct *and* we now know why |
| C2 | **§239 wall-side street** — an open lane runs inside the circuit | Cell edges facing the wall receive the largest building setback, so a lane appears automatically | **Strong.** Independently arrived at; our law is a real feature of the style |
| C3 | **Wards are the primary spatial unit**; buildings belong to wards | The cell/ward is the unit of everything: type, parameters, subdivision, rendering | **Total** |
| C4 | **Buildings are near-rectangular despite organic blocks** | Cut angles wander only while pieces are large; tilt is forced off near building size (§5.2) | **Strong**, and we had the *mechanism* backwards — see D3 |
| C5 | **Radial social gradient** — wealth in, poverty out | Two positional scores: merchants minimise distance to plaza, slums maximise it | **Confirmed**, though far cruder than we assumed — see D2 |
| C6 | **Citadel sits on the edge, bulging out of the circuit** | The citadel is the first *non-urban* cell by distance rank; it is outside the walled interior by construction | **Total.** A silhouette we had noted is one integer |
| C7 | **Blocks are bounded by streets exactly; no slivers** | Street *is* cell boundary; no independent street geometry exists | **Total** |
| C8 | **Gates are few, spaced apart, and roads radiate from them** | Gates chosen randomly with forced minimum separation; each spawns an outward road | **Strong** |
| C9 | **The urban edge frays rather than stopping** | Explicit outskirts thinning pass keyed to road proximity and enclosure (§5.4) | **Total** |
| C10 | **Plaza ornament is off-centre** | Ornament is deliberately displaced toward the longest edge in most cases | **Confirmed** — a small detail we read correctly |

## 10.2 DIVERGENCE — ⛔ header withdrawn by ODQ §261: these are NOT "our errors"

**⛔ §261 ANNOTATION (see the notice at the top of this document): the original header
"where our reverse-engineering was WRONG" and the A / B / C tags below are WITHDRAWN AS
ATTRIBUTED. The rows stand as PLAUSIBLE facts about Watabou's 2017 source; they are not
evidence about the corpus, and each mechanism needs ODQ §261.4's third leg before
adoption.** Original text follows unmodified.

| # | What we inferred | What the mechanism actually is | Tag | What it costs us |
|---|---|---|---|---|
| **D1** | **Tower spacing is EVEN — treated as the style's strongest generated tell, implying a spacing rule** | **There is no spacing rule.** Towers are placed at *every non-gate wall corner*, opportunistically. Evenness is an emergent consequence of uniform cell area (§6.3). Confirmed for the *current* product by the author's own prose | **A** | **Highest-cost error in the study.** If we implement even-arc-length tower placement we reproduce the appearance and destroy the mechanism — and lose correct behaviour wherever our districts are deliberately non-uniform. **Fix: towers at wall corners; let evenness be inherited** |
| **D2** | **Ward placement is richly relational** — the §165 affinity programme assumed a network of preferences | **Placement is overwhelmingly positional.** Nine of thirteen ward types have *no placement rule at all* and are placed at random. Only two are genuinely relational, and one of those is half-dead (§3.4) | **A** | Our affinity work is more ambitious than the source it was inferred from. Not wasted — but **we must confirm the cheap radial term is present and strong**, since that is what does the perceptual work |
| **D3** | **Organic irregularity comes from perturbing buildings** — irregularity applied at the small scale | **Exactly inverted.** Chaos is applied at the *large* scale (block cuts) and orthogonality is *restored* at the small scale near building size (§5.2) | **A** | **This is why our output reads as mush rather than as a town.** Randomising building shapes produces noise; randomising the frame and keeping contents square produces character. **Highest-value single correction for our #1 aesthetic gap** |
| **D4** | Building size variety implies **sampling a size distribution** | Sizes vary because the **recursion stop threshold** is jittered — never the output size (§5.2) | **A** | Ours can produce degenerate shapes; theirs structurally cannot, since every building is a clean piece of a recursive partition. **Adopt the mechanism, not the distribution** |
| **D5** | Interior streets are **drawn features with widths** | In the *plan*, interior streets are **negative space** left by per-edge setbacks; hierarchy is setback, not stroke width (§4.3) | **A** | Changes how our plan is *composed*. **[RENDER NOTE]** Their choice not to stroke the interior is a rendering decision we explicitly do **not** adopt — see D12 |
| **D12** | *(new — arises from the §256 precedence)* Implicitly, that the original's rendering is the style target | **Their rendering is flat vector fill: small fixed palette, uniform strokes, no paper texture, no wash, two-level ink at most.** The corpus measures **richer** on `chroma`, `paper_grain_sigma` and `wash_within_sigma` | **C-adjacent** — the painterly richness is the *imitator's* contribution, not the original's | **The corpus beats the original on every axis we grade.** Chasing the original's look would move us **down** a rung. Mechanism from them; look from the corpus. This is a finding, not a criticism to soften |
| **D6** | Terraced/shared-wall rows are a **distinct building type** | They are the small-piece branch of one rule: whether a cut leaves an alley is decided stochastically, weighted by piece size (§5.2) | **A** | We were preparing to special-case something that is one line of policy in a general rule |
| **D7** | Corpus shows **rivers, coastlines and water-adapted plans** | This version has **no water at all** — the field is a stub, and the author has written that integrating water was difficult | **B** | Correctly attributed to product evolution, not to our misreading. **No action** beyond not expecting this source to inform water |
| **D8** | Wall smoothness/regularity is a **styling choice** | It is a smoothing pass whose strength **scales with town size**, so larger circuits are smoothed more to avoid jaggedness | **A** | A size-dependent parameter we would have missed entirely, and would have set as a constant |
| **D9** | Ward diversity implies **a placement rules engine keyed to size** | Diversity is produced by **truncating one authored priority list** (§3.2). No thresholds, no rules | **A** | We would have built substantially more machinery than the effect requires |
| **D10** | **Gate count is chosen** | In this version it *emerges* from wall length and a minimum-separation rule. (The live product later added a gate parameter) | **A/B** | Minor, but it means gate count should be derived from circuit length, not set |
| **D11** | The radial gradient's **measured strength is the target** | Their gradient is computed through a **defective distance routine** (§8.3) and is noisier than intended | **A** | **If we fitted to the corpus's gradient noise, we fitted to a bug.** We should implement the clean rule and expect a slightly stronger gradient than the corpus shows |

## 10.3 The one thing I could not resolve

**Whether our corpus's traits are faithful to the live product at all.** Our corpus is an *image model's
imitation*, and this study can only compare against the 2017 code. Every row tagged **A** above assumes the
mechanism did not change in the intervening years; every row that might be **C** — an imitator artefact — is
invisible to this method.

**Named experiment, and I recommend it strongly:** the live product exports SVG/JSON/GeoJSON by public URL
parameter. **Generating a modest sample of real plans directly from the live generator and running our existing
measurement harness over them would separate A from B from C for every row in this table** — and would tell
us, for the first time, how faithful our 313-plate corpus actually is to the thing it imitates. That is a
different lane and an owner-gated call on scope, but it is the highest-value follow-up this study produces,
and it does not touch GPL code at all. *Recorded here rather than acted on.*

---

# 11. RANKED — WHAT GENUINELY ACCELERATES US

Ranked by value per unit of work, each with its derivation home in our dossier facts, because a mechanism with
no home is decoration.

Every row states **(a) the CAUSE** — the dossier fact that drives it — and **(b) the LOOK** — the named corpus
metric its output must land inside. A row that could not state both was downgraded rather than listed.

| Rank | Mechanism | (a) CAUSE — our dossier fact | (b) LOOK — corpus band gate | Why it ranks here |
|---|---|---|---|---|
| **1** | **Character as a four-axis parameterisation of ONE subdivision routine** (§3.1) | Wealth → size floor; crowding → emptiness (inverted); age/planning → grid chaos; mixed use → size variation | `block_area_frac_p50`, `block_area_cv`, `orientation_entropy`, `backland_green_p50`, `blocks_green_ge*` | Directly attacks our #1 aesthetic gap; replaces N district generators with one. **Every axis has a fact behind it** |
| **2** | **Chaos at the large scale, orthogonality restored at the small scale** (§5.2, D3) | District age and degree of planning set the amount; the structure serves our own plot-quality requirement | `block_elongation_p50/p90`, `block_solidity_p50`, `orientation_order_phi` | Corrects our most consequential misreading. Cheap, and changes the entire character of output |
| **3** | **Selective regularity — regularise the civic core, leave the edge raw** (§2.2) | Which district is the civic core | `block_circularity_p50` / `block_solidity_p50` gradient; `orientation_order_phi` toward core | Regularity becomes a consequence of civic importance. Cures the over-uniform half of monotony. ⚠ **Magnitude from the corpus, never their numbers** |
| **4** | **Randomise the stop threshold, not the output size** (§5.2, D4) | Wealth sets the threshold centre; mixed use sets its spread | `block_area_cv`, `block_area_p90_over_p10` | Structurally cannot produce degenerate plots — strictly better than sampling a size distribution |
| **5** | **Per-edge setbacks driven by what the edge faces** (§4.3) | Road importance (trade routes, civic frontage); §239 wall-side street | `street_share_of_hull` *(aggregate proxy — no per-tier width metric exists)* | Street hierarchy with no extra geometry; makes §239 structural rather than special-cased |
| **6** | **Outskirts thinning keyed to road proximity and enclosure** (§5.4) | Population and density falloff; our street graph's road edges | Built-density falloff; `hull_frac_of_frame`, `deadend_share` | Top realism cue, and the thing that makes *unwalled* settlements look intentional |
| **7** | **Towers at wall corners; evenness inherited, never enforced** (§6.3, D1) | Our wall is a district partition (§232), so its corners are dossier-caused | ⚠ **NONE EXISTS — cannot be gated today.** Needs a tower-spacing metric added to the harness | Corrects a misreading that would otherwise be baked in; zero new geometry. **Provisional until measurable** |
| **8** | **Ordered claim list, greedily consumed, truncated by size** (§3.2) | Which institutions exist at which population | Ward-mix composition by plate tier | Size-appropriate diversity without a rules engine. ⚠ **The mechanism only — their list is refused (§3.2)** |
| **9** | **Defensive seat guaranteed edge-adjacent and outside the circuit by construction** (§2.3) | The defensive seat, its terrain and its defensibility | Citadel silhouette / wall-attachment on walled plates | A structural guarantee beats a scoring preference. ⚠ **Their distance-rank *selection* is refused — site comes from terrain and dossier** |
| **10** | **Subdivide the neighbourhood to make room rather than rejecting a placement** (§6.2) | Our own gate road-continuity invariant | Gate/road connectivity; `gamma_connectivity` | Converts a failure case into a construction step — a general principle worth naming |
| — | **Pin: assert order-dependent relational rules actually had candidates** (§3.4) | Our §165 affinity work | n/a — this is prevention machinery, not a visual mechanism | Not their mechanism: a defect of theirs converted into a guard for us |

**Explicitly NOT adopted**, and each for a stated reason:

- **Reject-and-redraw on failure** (§1.3) — incompatible with seed stability and the inertia law.
- **A single global random stream** (§8.2) — the precise thing keyedRandom exists to prevent.
- **The subdivision routine itself** — the author calls it silly and it produces triangular remnants (§5.2);
  we take the modulations and supply our own squareness guard.
- **Their defective distance routine** (§8.3) — and we should confirm we did not fit to its noise (D11).
- ⚠ **Their authored ward list** (§3.2) — decoration under §256 *and* the most clearly protected expression in
  the program under §0. The mechanism is adoptable; the list is not.
- ⚠ **Their citadel selection rule** (§2.3) — an arbitrary distance rank with no derivation home. We keep the
  structural guarantee and take the site from terrain and dossier truth.
- ⚠ **Their relaxation magnitudes** (§2.2) — free parameters chosen by eye. Principle yes, numbers no.
- ⚠ **Their rendering, entirely** (§0d, D12) — flat vector fill, no wash, no grain, two-level ink. The corpus
  measures richer on every axis we grade; imitating the original would move us *down* a rung.
- **Any code at all** — GPL-3.0 (§0).

---

# 12. WHAT THEY SOLVED BETTER THAN WE HAVE — HONESTLY

The brief asks for this section to be honest, so it is.

**1. Character from parameters rather than from special cases.** One subdivision routine spans slum to palace
quarter on four axes. We have a documented tendency toward per-case machinery, and their result is more varied
than ours with a fraction of the surface area. *This is the one where the gap is largest and most fixable.*

**2. They understand where irregularity belongs and we did not.** Chaos at the block scale, squareness at the
building scale (D3). We inferred the opposite from images. Our output reads as mush partly for this reason,
and this is the single highest-value line in the document.

**3. Emergence over enforcement.** Towers evenly spaced without a spacing rule; gate count without a gate
parameter; social diversity without a diversity rule; the wall-side street without a wall-side-street rule.
Repeatedly, they get a feature by arranging for it to be a *consequence*. Our instinct — and our laws, which
are stated as laws — leans toward enforcing outcomes directly. **Enforcement is more legible and more
testable, which suits us; but it is worth asking, for each of our laws, whether a structural choice could make
it fall out for free.** §239 is instructive precisely because it is a law for us and a consequence for them,
and the outcome is identical.

**4. Ruthless economy of concept.** The same wall routine builds the city circuit and the castle circuit. The
same subdivision builds every populated ward. One distance sort defines the city, the centre and the citadel.
The whole generator is around four thousand lines including its own geometry library, its own Voronoi
implementation and its UI. *There is a discipline here that a large codebase with a long audit programme
should respect: every additional concept is a thing that can rot.*

**5. Aesthetic honesty about purpose.** The author says openly that the method is arbitrary and aimed at a
nice-looking map, and this clarity is itself a design advantage: he never pays for realism he does not need.
We are building something genuinely harder — a record rather than a picture — but **we should be equally clear
about which of our mechanisms serve truth and which serve the picture**, and not let the two silently trade
against each other.

## Where their approach is WEAKER than the corpus — stated plainly, not softened

Per §256 these are findings, not criticisms to soften, and they matter because the corpus — not the original —
is the target.

1. **Rendering, comprehensively.** Flat vector fill, a small fixed palette, uniform stroke weights, no paper
   texture, no wash variation, at most a two-level ink hierarchy, and interior streets not drawn at all. The
   corpus measures richer on `chroma`, `paper_grain_sigma` and `wash_within_sigma`. **The painterly quality we
   grade against is the imitator's contribution, not the original's.** This is the single largest gap between
   the source of the style and our target.
2. **Triangular and wedge-shaped buildings.** The author flags this himself. Recursive cutting of irregular
   polygons without a squareness guard produces remnants that would read as out-of-band on
   `block_solidity_p50` and `block_elongation_p90`. We adopt the modulation vocabulary *and fix the defect*.
3. **Incident density.** Their plan carries few small features — an ornament in the plaza, towers, gates, and
   otherwise undifferentiated building masses. The corpus is far busier at small scale, and that busyness is
   part of what we grade. Nothing in their approach supplies it.
4. **A noisy radial gradient produced by a defect** (§8.3, D11) — their social gradient is cruder than
   intended, and we should implement the clean rule rather than reproduce their noise.
5. **Half-inert relational placement** (§3.4) — their one true affinity rule cannot fire in most cities.

**Where we are straightforwardly ahead**, and it should be said so the comparison is not lopsided: world truth,
history and the epoch axis (§240), terrain and water as first-class constraints, persistence and editing,
seed stability under change (§250/§252), the wall as a load-bearing partition (§230/§232/§239), and the entire
dossier layer. **Their generator could not represent a single one of these, and no amount of reading it will
help us build them.** The study's value is concentrated almost entirely in the plan-craft layer — §11's ranked
list — and that is exactly where we needed it.

---

# 13. SUMMARY OF VERDICTS

| Mechanism | Verdict |
|---|---|
| Four-axis ward parameterisation (§3.1) | **ADOPT-AS-APPROACH** — rank 1 |
| Chaos large-scale / orthogonal small-scale (§5.2) | **ADOPT-AS-APPROACH** — rank 2; corrects D3 |
| Selective core-only regularisation (§2.2) | **ADOPT-AS-APPROACH** — rank 3; ⚠ magnitude from corpus, not theirs |
| Randomised stop threshold (§5.2) | **ADOPT-AS-APPROACH** — rank 4 |
| Per-edge setbacks as street hierarchy (§4.3) | **ADOPT-AS-APPROACH** — rank 5 |
| Outskirts thinning (§5.4) | **ADOPT-AS-APPROACH** — rank 6 |
| Towers at wall corners (§6.3) | **ADOPT-AS-APPROACH** — rank 7; corrects D1; ⚠ **provisional — no corpus metric exists to gate it** |
| Ordered, size-truncated claim list — *mechanism only* (§3.2) | **ADOPT-AS-APPROACH** — rank 8 |
| ⚠ **Their authored ward list** (§3.2) | **DELIBERATELY-DIFFERENT** — decoration under §256; protected expression under §0. **RE-AUDITED** |
| Defensive seat edge-adjacent by construction (§2.3) | **ADOPT-AS-APPROACH** — rank 9 |
| ⚠ **Citadel chosen by distance rank** (§2.3) | **DELIBERATELY-DIFFERENT** — arbitrary, no derivation home. **RE-AUDITED** |
| Split-to-make-room for gate roads (§6.2) | **ADOPT-AS-APPROACH** — rank 10 |
| Monumental buildings as a separate two-axis rule (§5.3) | **ADOPT-AS-APPROACH** |
| ⚠ **Their rendering treatment** (§0d, D12) | **DELIBERATELY-DIFFERENT** — corpus measures richer on every graded axis; imitating it costs us a rung |
| Street = cell boundary, strictly (§4.1) | **ALREADY-HAVE** in part; adopt the strictness |
| Wall-side street (§4.3) | **ALREADY-HAVE** — §239, independently confirmed |
| Wards as the primary spatial unit (§3) | **ALREADY-HAVE** |
| Size drives scale (§2.4) | **ALREADY-HAVE** — ours better justified |
| Castle wall reuses the wall routine (§6.4) | **ALREADY-HAVE** — note the economy |
| T-dominated junctions (§4.2) | **ALREADY-HAVE** — §250 confirmed and now explained |
| Wall derived as an outline, placed early (§1.2) | **DELIBERATELY-DIFFERENT** — ours is better (§230/§232/§239) |
| Positional-only ward placement (§3.3) | **DELIBERATELY-DIFFERENT** — ours is better; keep their radial term |
| Reject-and-redraw retry (§1.3) | **DELIBERATELY-DIFFERENT** — ours must stay different |
| Single global random stream (§8.2) | **DELIBERATELY-DIFFERENT** — ours decisively better |
| No epoch axis (§1.2) | **DELIBERATELY-DIFFERENT** — §240 is capability they lack |
| Spiral point field as a site generator (§2.1) | **NOT-APPLICABLE** — our sites derive from terrain |
| Terrain and water (§7) | **NOT-APPLICABLE** — they have none; our largest differentiation |
| World, history, dossier truth (§9) | **NOT-APPLICABLE** — the whole difference |
| **Any code adoption** | **⛔ REFUSED — GPL-3.0 (§0)** |

---

*Lane MF-X2. Read-only study; no execution; working copy deleted. No code adopted, none adoptable — GPL-3.0.
All source-derived findings are PLAUSIBLE (static reading), not CONFIRMED — execution was forbidden.
Written to a clean-room handoff standard: implementable by an engineer who never sees the source.
Verdicts audited under the §256 precedence — **mechanism from them, look from the corpus, cause from the
dossier** — which downgraded two verdicts and exposed one ungateable claim (§6.3).*
