# PRIOR ART — FANTASY TOWN GENERATOR (Thomas Allerton) and the `thomasjallerton/TownGeneratorOS` fork

**Lane MF-X3 · ODQ §260 · reconstruction form per ODQ §246 · precedence per §256 · doctrine per §258 · 2026-08-17**

Subject as supplied: `https://github.com/thomasjallerton/TownGeneratorOS`, reported by the owner to carry the same
licence as Watabou's. It does. It also turns out to carry the same *everything* as Watabou's — see §1, which is
the finding that reorganises this entire study.

Studied by reading only. **Never built, never executed, never run.** No Haxe/OpenFL toolchain was installed or
invoked. All working copies were deleted on completion (§12 receipt).

Companion document: `map-corpus/docs/PRIOR-ART-WATABOU.md` (lane MF-X2, ODQ §254). This study **cross-references
rather than repeats it**; sections there are cited as **WATABOU §n**.

---

# ⛔ 0. LICENCE VERDICT — READ THIS BEFORE ANYTHING ELSE

## **GPL-3.0. Copyleft. ADOPTION IS REFUSED OUTRIGHT.**

Verified first, before any source was read, exactly as ODQ §260 requires.

| Fact | Finding | How established |
|---|---|---|
| SPDX identifier (fork) | **`GPL-3.0`** | GitHub licence API, `license.spdx_id` on `thomasjallerton/TownGeneratorOS` |
| SPDX identifier (parent) | **`GPL-3.0`** | same call, `parent.license.spdx_id` — `watabou/TownGeneratorOS` |
| Licence file | present at repository root, 35,141 bytes | direct inspection of the checked-out tree |
| File digest | `sha256 589ed823e9a84c56feb95ac58e7cf384626b9cbf4fda2a907bc36e103de1bad2` | `shasum -a 256 LICENSE` |
| Text | Standard GPLv3, opening at the FSF header for Version 3, 29 June 2007, closing on the **unmodified** FSF "How to Apply" appendix | head and tail read directly |
| **Added exception / linking exception** | **NONE.** Every occurrence of "exception", "additional permission", "linking" or "proprietary" in the file is standard GPLv3 §7 boilerplate or appendix prose. The appendix closes, unaltered, by recommending the LGPL to anyone who wants proprietary linking — an option the author declined | targeted case-insensitive scan of the licence text, every hit read in place |
| Per-file headers | **NONE.** A case-insensitive scan for `copyright`, `licence`/`license`, `GPL`, `GNU`, `SPDX` across the whole `Source/` tree, `project.xml` and `README.md` returned **zero hits** | direct scan of the checked-out tree |
| Copyright holder | watabou / Oleg Dolya. **Not the forker** — the fork adds no copyrightable content whatsoever (§1) | commit authorship; project manifest |

The root licence governs the entire tree unqualified: no per-file carve-out, no dual-licence offer, no linking
exception. **The fork could not have relaxed this even if it had tried** — GPLv3 §7 permits a downstream party
to *remove* additional permissions, never to add them, and in any case the fork changed nothing.

## Consequences — binding, and identical to WATABOU §0

Because the fork's tree is byte-identical to upstream (§1), **every clause of WATABOU §0 applies here verbatim
and is not restated at length.** In summary, and binding on every downstream lane:

1. **No code is adopted. Ever.** Not a function, not a helper, not a constant table, not a "lightly adapted"
   fragment. Size is irrelevant to copyleft. There is no attribution path that makes GPL code safe in a
   commercial product with a paid surface.
2. **No transcription, no line-by-line translation, no pseudocode that is their code with the syntax filed off,
   no lifted identifiers, no lifted numeric constants.** Changing language does not launder a derivative work.
   **This document contains zero code quotations**, per the tightened protocol of ODQ §254.5.
3. **What is free is the layer of published technique** — Voronoi/Delaunay, Lloyd relaxation, polygon
   offsetting, recursive binary subdivision, graph shortest-path, spiral point sampling. Copyright protects
   expression, not ideas.
4. **Clean-room is the only lawful route.** Any downstream lane adopting a mechanism named here must derive it
   from our own dossier facts and our own geometry, and must be able to say so on the record.

## ⚠ A SECOND, DIFFERENT LICENCE PICTURE APPEARS IN §2 — AND IT IS THE USEFUL ONE

The GPL verdict above covers the *forked generator*. It does **not** cover the two repositories that turn out to
carry the actual Fantasy Town Generator evidence (§2): those are **MIT** and **Apache-2.0**, both verified. That
distinction is load-bearing and is handled at §2.0, but it changes nothing about the generator source: the
generator stays untouchable.

**Ledger line:** *The supplied repository is a pristine, zero-commit fork of Watabou's GPL-3.0 generator. It is
legally untouchable, and — separately and more importantly — it is informationally empty. The prize the mandate
anticipated is not in this repository. It is one directory over, under permissive licences, and it is a
different and better prize than a diff would have been.*

---

# ⭐⭐ 1. THE RELATIONSHIP — THE FORK IS EMPTY, AND THAT IS THE FIRST REAL FINDING

## 1.1 The receipt

**`thomasjallerton/TownGeneratorOS` contains no divergence from `watabou/TownGeneratorOS`. None. Zero commits,
zero changed files, zero branches beyond `master`.**

| Probe | Result |
|---|---|
| GitHub compare `watabou:master...thomasjallerton:master` | **`status: identical`**, `ahead_by: 0`, `behind_by: 0`, `total_commits: 0`, **`files changed: 0`** |
| Fork HEAD commit sha | `7fbc87a9398cc508af24de93f79cf2ad027f352b` |
| Upstream HEAD commit sha | `7fbc87a9398cc508af24de93f79cf2ad027f352b` — **the same object** |
| Fork HEAD tree sha | `4e9910423481a53d6d52e3c6b2ecb5c98621bff9` |
| Merge base | the same commit again |
| Refs on the fork (`git ls-remote`, all refs) | exactly two lines: `HEAD` and `refs/heads/master`, both at the sha above |
| Commit count on `master` | 7 — the identical 7 upstream carries |
| Commit authors | Watabou ×6 (2017-08-03 → 2017-08-06), Oleg Dolya ×1 (2019-04-07, the OpenFL/Lime toolchain bump). **Thomas Allerton authored none of them** |
| Files in tree | 64, identical set to upstream |
| API metadata | `fork: true`; `parent` and `source` both `watabou/TownGeneratorOS`; `created_at: 2020-05-07`; stars 0; forks 0; issues disabled |

A matching commit sha is a matching tree by construction — a git commit object hashes its tree — so the
`identical` status, the shared tree sha and the shared commit sha are three independent confirmations of the
same fact. **CONFIRMED** (executed probes, quoted above), and it is the one claim in this document that reaches
that bar without qualification.

## 1.2 Vintage — the fork adds no currency at all

Because the tree is identical, the vintage is identical to the one MF-X2 studied:

- substantive source dated **2017**, plus a single **2019** toolchain-compatibility commit;
- the README's own admission that the published source lacks waterbodies, the options UI and other later work;
- the live Watabou product has moved on by roughly nine years, closed.

The fork does not move us one day closer to the current product. Anyone hoping this repository would refresh the
2017 snapshot should stop hoping: it is the same snapshot, re-served.

## 1.2b ⛔ THE §261 PREMISE CORRECTION — AND IT VOIDS A RULE THIS DOCUMENT WOULD OTHERWISE HAVE INHERITED

**Received mid-lane from the owner and applied throughout. It is important enough to sit here, next to the
vintage discussion it invalidates.**

Our 313-plate corpus was **not** produced by imitating Watabou, FTG, or any procedural generator. It was
produced by an **image generator (nano-banana-pro)** drawing on its own training in historical and fantasy
cartography. The owner exemplified a style with screenshots at the outset; the plates themselves are not derived
from those screenshots' source programs.

**Three consequences, binding on every verdict below:**

1. **This code can never be evidence about what our corpus does.** Only the corpus is evidence about the corpus.
   The two are **independent sources**, not an original and a copy.
2. **Therefore WATABOU §0b's three-valued divergence rule — (A) we misread, (B) the product moved on, (C) the
   imitator invented it — does not apply in this document and is not used.** A disagreement between this code
   and something we measured in the plates means only that *a procedural generator and our aesthetic target
   differ*, which is unsurprising and frequently expected. **No finding here is tagged "we were wrong."** That
   phrase is reserved, in this lane, for cases where we misread **our own** measurements or **our own** code —
   and this lane found none, because it never touched either.
3. **⭐ Every ADOPT-AS-APPROACH verdict below therefore carries THREE legs, not two** (§256 as sharpened by
   §261):
   - **(a) CAUSE** — the dossier fact that drives the mechanism;
   - **(b) LOOK** — a corpus metric that **actually exists** in `laneHFM1-corpus-measured.csv` or the
     `MFS3a-planmetrics.json` / `MFS2-bands.json` artefacts, whose measured band gates the output;
   - **(c) ⭐ DIRECTION** — *why we should believe this mechanism moves us **toward** those measured values.*
     The mechanism was engineered for a different aesthetic; we have no prior entitling us to assume it lands
     where our target is. **A mechanism whose (c) cannot be argued is not ranked for adoption at all** — it is
     filed under **INTERESTING-BUT-UNGATED** (§10), a separate list that carries no implementation claim.

**What this code is good for, and it is plenty: engineering mechanisms** — ways to produce a result
deterministically, cheaply, and without free parameters. That is the lens applied from here on.

## 1.3 So what *is* the relationship? The fork is a bookmark, not a branch

The owner's premise — same repository name, therefore almost certainly a fork, therefore the diff is the prize —
was exactly right about the first two and produced an empty set on the third. The forker pressed GitHub's fork
button on 2020-05-07 and never pushed a byte.

**Thomas Allerton is the author of Fantasy Town Generator.** That is established from his own public
repositories, not inferred from the name collision:

| Repository | Licence | Language | Last push | Self-description |
|---|---|---|---|---|
| `towngenerator-foundrymodule` | **MIT** | JavaScript | **2026-02-21** | "Module for FoundryVTT to import settlements generated in Fantasy Town Generator" |
| `towngenerator-roll20-extension` | **Apache-2.0** | TypeScript | **2025-06-06** | "Chrome extension for Fantasy Town Generator integration in Roll20" |
| `TownGeneratorOS` | GPL-3.0 (inherited) | — | never | Watabou's description, inherited with the fork |

The account holds 14 public repositories; the rest are unrelated (a Kotlin serverless framework and its
satellites, plus student-era projects). The two `towngenerator-*` repositories are current, actively maintained,
**permissively licensed, and unambiguously about a shipping commercial product.**

**The inference, marked as inference:** the fork is what a practitioner does when he wants to *read* the prior
art before building — clone-by-bookmark. He read Watabou's generator in May 2020 and then built something
architecturally unrelated to it. He did not extend it, patch it, or ship it.

**The inference that would be unsafe, and which I explicitly decline to draw:** nothing here establishes whether
Fantasy Town Generator's internals do or do not derive from Watabou's code. The product is closed-source; the
fork is silent; and a fork button carries no legal or technical implication. Any claim in either direction would
be speculation, and this document makes none. *That question is also not ours to answer and has no bearing on
our verdicts, since we adopt nothing from either.*

## 1.4 ⭐ THE REFRAME — the divergence exists, it is just not in the repository

The mandate's reasoning for why a fork's diff is concentrated signal was correct, and it survives the empty
diff. Restated for what we actually have:

> **The divergence is between the generator Allerton read in 2020 and the product he shipped instead. It is not
> incremental — it is total.** He looked at the best-known open implementation of exactly this problem, and then
> built something with a different centre of gravity. That is a stronger signal than a patch series would have
> been, because a patch series says "here is what I would tweak" while a from-scratch product says
> "**here is what I judged the whole shape of the problem to be.**"

And unlike a private fork, that judgment is legible from public, permissively-licensed evidence: two shipping
integration clients whose data contracts enumerate, field by field, what Allerton decided a settlement *is*.
Those contracts are the subject of §2 onward, and they are where this study earns its keep.

**One consequence must be stated before going further, because it disciplines everything after it:** Fantasy
Town Generator's *map* is a minor organ of that product, and its *world model* is the major one. That is the
opposite weighting from Watabou's generator, and it is the single most important thing this lane learned.

---

# 2. EVIDENCE BASIS — AND THE SECOND, PERMISSIVE LICENCE PICTURE

## 2.0 ⛔ Two licence regimes, kept strictly apart

| Body of evidence | Licence | Verified how | What this document does with it |
|---|---|---|---|
| The forked Haxe generator (`Source/**`, 64 files) | **GPL-3.0** | §0 | **Nothing.** It is identical to upstream; every finding about it is WATABOU's and is cited, not repeated. No code read for adoption, no quotations, no identifiers. |
| `towngenerator-foundrymodule` | **MIT**, "Copyright (c) 2023 Thomas Allerton" (`sha256 111426b4…`) | direct inspection of `LICENSE.md` | Read for the **data contract** it publishes. Described functionally. |
| `towngenerator-roll20-extension` | **Apache-2.0**, standard text (`sha256 c71d239d…`) | direct inspection of `LICENSE` | Read for the **integration architecture** it publishes. Described functionally. |
| `docs.fantasytowngenerator.com` and the product's own screenshots | Published product documentation | fetched and read | **The primary source for mechanism.** Author's own prose — no copyleft hazard, and it states intent the code could not. |

**⚠ The protocol I actually applied, stated so it can be audited:** I extended the §254.5 zero-quotation
discipline **beyond what the licences require**, to the permissive repositories as well. This document contains
**no code quotations from any of the four bodies above**, no transcribed identifier lists, and no lifted
constants. Where an interface concept matters I name it in **ordinary English** ("a version token carried on
every update"), not in the project's own spelling. Nothing here would be improved by precision I am not entitled
to, and the discipline costs the study nothing.

**One deliberate exception, and it is narrow:** short phrases from the **public product documentation** are
quoted where the author's exact words carry the finding, always attributed inline to the docs. Documentation
prose is neither GPL-covered nor confidential, and §254.5 explicitly prefers author prose over source.

## 2.1 Epistemic status

**CONFIRMED** (executed probes in this lane, quoted in §1.1): the fork's emptiness, both licence identities,
the file digests, the repository metadata, the authorship of the integration repositories.

**PLAUSIBLE, not CONFIRMED** — everything about how Fantasy Town Generator *generates*. The product is
closed-source. My account of its algorithm rests on **the author's own published documentation** plus the
**observable structure of published screenshots** plus the **capabilities its two open integration clients must
support**. That is a good evidence base and I have reasonable confidence in it, but nothing here is backed by
executed program output, and execution was forbidden.

**Marked as inference throughout.** Every "why a practitioner would want this" is my reading of intent, and is
labelled. Where the evidence cannot settle a question I say so and name what would.

---

# 3. THE ARCHITECTURE — AND IT IS THE OPPOSITE OF WATABOU'S

## 3.1 The two ways to make a town plan, and each product picked a different one

This is the study's central structural finding, and it is only visible **because** the fork is empty: we are not
comparing a program with its patch, we are comparing two complete answers to one problem.

| | **Watabou** (WATABOU §1.1, §4.1) | **Fantasy Town Generator** (docs `/createSettlement/algorithm`) |
|---|---|---|
| First move | **Partition space.** Lay a spiral point field, take its Voronoi diagram | **Populate the world.** Generate buildings and people until a population target is met |
| Streets | **Selected**, never generated — a street *is* a cell boundary chosen by shortest-path search | **Grown**, never selected — roads are placed sequentially, branching outward from a centre |
| Blocks | Pre-exist as cells; the wards *are* the cells | **Detected**, as the enclosed faces that appear when a new road closes a loop against existing roads |
| Wall | Traced as the outline of the innermost *n* cells | **Optional, per generation stage** — a toggle that walls that stage's lots |
| Water | Absent (a declared, never-populated stub) | **Generated or hand-drawn first**, before any road |
| World | **None.** No names, no people, no time | **The whole product.** People, jobs, families, factions, friendships, rivalries, schedules |
| Order | plan → (no world) | **world → plan** |

**⭐ Stated as one line: Watabou divides space and reads streets out of the division; FTG grows streets and reads
blocks out of the growth.** These are the two classical families, and each product's other properties follow
from which family it joined.

## 3.2 ⭐⭐ THE FINDING THAT MATTERS MOST TO US: our own S7 already ruled for FTG's family

`GENERATION-SPEC.md` S7 states our street mechanism as **"ATTACHMENT, NOT INTERSECTION"** — a new segment is
seeded at a point *on an existing segment*, creating a T, and grown outward until it meets a hard edge; an
X may be minted only when two arterials of the same rank cross, "and that event is budgeted, not free."

**FTG's road engine is a shipping implementation of exactly that principle.** Per the layout documentation,
roads branch from a settlement centre; main roads form a backbone; normal roads branch off them; a road runs a
configured number of segments before *proposing* left and right branches; each branch is itself a road that
branches in turn. **A network built by branching off existing roads produces T-junctions as its default output,
because a branch event creates a degree-3 node by construction.**

This is worth pausing on, because it is a genuine triangulation across three independent sources:

- **our corpus measures** X:T ≤ 0.09, T/Y share 0.51–0.738, degree-≥5 share ≤ 0.01 (`MFS3a-planmetrics.json`;
  SPEC §2.4);
- **our spec independently reasoned** its way to attachment-growth as the mechanism that produces that;
- **Watabou reaches T-dominance by a completely different route** — Voronoi vertices are generically degree-3
  (WATABOU §4.2);
- **FTG reaches it by a third route** — branch-attachment growth.

**Three unrelated mechanisms, one signature.** That is much stronger evidence for the mechanism class than any
one of them alone, and it is the kind of evidence this lane was in a position to produce and MF-X2 was not.

⚠ **The honest qualification, and it cuts the other way.** Two documented FTG behaviours *manufacture* X-nodes:
road placement includes a **snap-to-intersection** optimisation, which pulls a road end onto an existing node
and raises its degree; and the **"curve around origin"** branch mode grows roads at constant distance from the
centre, producing ring roads that necessarily cross the radial backbone. **A ring-and-radial plan is an
X-generating plan.** So FTG's engine is attachment-based in its growth and intersection-based in its cleanup and
its ring mode. For us the branching half is directionally right and the ring mode is directionally wrong at the
corpus's measured X budget — unless it is confined to a **planned** epoch, which is precisely what SPEC §1.1.7a
already rules ("the X budget must be EPOCH-SCOPED", with hf239's castra carrying the corpus's highest X share at
0.088).

## 3.3 What their architecture costs them, and it shows in the pictures

*Inference, marked as such.* Growing roads and detecting lots has a failure mode Watabou's partition cannot
have: **the lots are whatever the roads happened to enclose.** The documentation carries the tell — a
**"Minimum District Area"** setting whose stated job is to merge undersized district lots into their neighbours
"to prevent fragmentation." A partition-first generator never needs that setting, because its cells are uniform
by construction. **A growth-first generator needs a repair pass, and FTG shipped one as a user-visible knob.**

Compare Watabou's stage-2 junction cleanup (WATABOU §4.2), which merges near-coincident corners. **Both products
ship a degenerate-small-piece merge pass; they need it for opposite reasons.** That convergence is itself the
lesson: *whichever family you join, you will need a merge pass, and it should be a construction step rather than
a setting.*

---

# 4. THE WORLD-FIRST INVERSION — AND THE DEPENDENCY GRAPH, WHICH IS THE BEST MECHANISM IN THIS STUDY

## 4.1 Phase 1 is not the map

Per the published algorithm page, generation runs in two phases and **the map is the second one**. Phase 1
creates buildings and the people who live and work in them; Phase 2 lays out a settlement to hold them. Phase 1
ends with three social post-passes: people are joined to factions by membership criteria, friendship groups are
formed from shared interests, and rivalries are generated.

**Design intent, my inference:** if the map is generated first, the world has to be retrofitted into whatever
shape the geometry produced, and the count of buildings becomes a consequence of how many lots happened to
appear. Generating the world first makes **population the independent variable** and the plan the dependent one.
For a product whose value is the *contents* of the town — which is FTG's whole proposition — that is the only
order that works.

**Against us:** our pipeline is `dossier → terrain → sites → districts → streets → plots → buildings → wall`
(SPEC §1.0), which is world-first in the same sense: S0 reads the dossier before anything geometric happens.
**We are already on FTG's side of this divide, and against Watabou's.** That is worth recording as
confirmation, not as a change.

## 4.2 ⭐⭐ The dependency graph — a derivable building roster with no free parameters

This is the mechanism I would most want if I could have one thing from this product.

**What it is** (docs `/createSettlement/dependency_graph`): a graph whose **nodes are resources and services** —
the documentation's own examples are hops, beer, haircuts — and whose **edges are frequency ratios**. A node's
requirement is expressed either **per head of population** ("one per two hundred people") or **relative to
another node** ("one per five providers of hops"). Internally every dependency is converted to a per-person
ratio. Generation then starts from an empty settlement, repeatedly asks the graph what is needed next, creates
that building, creates the residents to staff it, and continues until the population target is reached.

**Three details that make it good rather than merely tidy:**

1. **It cascades causally.** The documentation's own illustration is that breweries do not appear until enough
   hops production exists to support them. **The roster is not a weighted random draw; it is the fixed point of
   a supply chain.**
2. **Every node has a producer pool and an importer pool.** If the *producing* building cannot be built — the
   documentation's example is insufficient farmland for a farm — a **shop that imports and sells the resource
   substitutes for it.** Otherwise a shop appears instead of a producer with some probability. **A settlement
   that cannot make a thing acquires a trade in it instead.** That single rule is how a landlocked town and a
   fishing port end up with different rosters from one graph.
3. **Buildings carry a lifestyle tier**, with separate building pools per tier, so a wealthy tavern and a common
   tavern are drawn from different pools. (The tier vocabulary visible in the Foundry client runs from squalid
   through poor, modest, comfortable and wealthy to aristocratic, plus a separate industrial character —
   which is the standard tabletop lifestyle ladder rather than an FTG invention.)
4. **The default objective is full employment.** The generator prioritises minimising unemployment, and there is
   an explicit setting to turn that off so the output matches the specified ratios exactly instead. **They made
   the objective function a user-visible choice**, which is an unusually honest piece of design: it admits that
   "the right roster" and "everyone has a job" are different targets.

**Why a practitioner would want this** *(inference)*: the alternative — an authored list of what a town of size
N contains — is exactly Watabou's ward-priority list (WATABOU §3.2), and it has two defects a shipping product
feels immediately. It cannot answer *why* a town has three bakers, and it cannot respond to the settlement's
circumstances. A ratio graph answers both: the count is a division, and changing the inputs changes the roster
without touching the list.

**⭐ And it is the anti-decoration mechanism par excellence.** Under §246 a parameter with no derivation home is
decoration. **In a dependency graph every number is a ratio with a stated denominator** — per head, or per unit
of another node. There is no free scalar anywhere in it. That is a structural property, not a discipline
someone has to maintain.

**Verdict: ADOPT-AS-APPROACH — ranked #1 in this document.** Three legs, per §261:

- **(a) CAUSE.** This is the strongest derivation home in either prior-art study, because **we hold the facts
  FTG has to invent.** FTG's graph is configured by hand from defaults keyed to size and landscape; our dossier
  already carries population, trade role, resources, hinterland, institutions and faith. Our edges are *read*,
  not authored. Where FTG must guess that a town of 2,000 supports one brewer, we can derive it from what the
  settlement actually produces and trades.
- **(b) LOOK.** Gated on the **landmark budget** band (thorp 1 · hamlet 1–2 · village 2–5 · town 3–7 · city 4–9
  · metropolis 9+, SPEC §2.5) and on the **ordinary : notable** band (notable 2–5% of footprints at town, 1–2%
  at city, occupying 10–20% of built area). A roster driven by a ratio graph must land inside those, because the
  roster *is* what determines how many notable structures exist.
- **(c) DIRECTION — and this one is arguable rather than assumed.** SPEC §2.5 records that we currently draw
  **too many landmarks, too small** (measured landmark:house footprint ≈2:1 against a town band of 5–6:1). A
  roster produced by a supply chain is **sparse in monuments by construction** — most nodes resolve to ordinary
  workplaces and dwellings, and only the few institutional nodes resolve to landmarks. Replacing a per-tier
  landmark budget with a derived roster therefore **reduces** notable count and **raises** mean notable size,
  which is the direction the measured miss says we need to move. *That is the argument; it is a prediction, and
  the experiment that settles it is stated in §11.*

⚠ **What must NOT come across: their graph's contents.** The particular nodes, their particular ratios and their
particular pools are one designer's model of a fantasy economy. Under §256 those are decoration for us however
plausible they look, and under §246 they have no derivation home in *our* dossier. **We take the shape — nodes
are resources, edges are ratios with denominators, producers fall back to importers — and derive every node and
every ratio ourselves.**

## 4.3 The population target is the loop condition, and that is the quiet part

Both phases terminate on population: Phase 1 builds until the population target is met; Phase 2's outer stage
"estimates lot counts needed for remaining buildings" and subdivides until they fit.

**Design intent** *(inference)*: population is the one settlement quantity a user can state with confidence and
a GM actually cares about. Making it the loop condition rather than an output means the product never has to
explain why the town it produced is the size it is.

**Verdict: ALREADY-HAVE, and better founded.** SPEC S0 reads population from the dossier as a fact, not a
setting. ⚠ **But there is a real gap adjacent to it that this comparison sharpens**: SPEC §2.6 records that the
**population→grain fit is UNRESTORABLE from the corpus**, because every population in the corpus but one is an
eye estimate. FTG cannot help us there either — its populations are its own inputs, not measurements of
anything. **Two prior-art studies have now failed to supply that number, which strengthens SPEC §1.2c's ruling
that it must be fitted against our own leaves, whose populations are facts.**

---

# ⭐⭐ 5. STAGED GENERATION — §240's EPOCH LADDER, SHIPPED BY SOMEONE ELSE

## 5.1 What they built

This is the finding ODQ §260.3 was hoping for, and it arrives from an unexpected direction.

MF-X2's sharpest differentiation claim was that Watabou has **no epoch axis whatsoever** — "the city is
generated in one shot, at one instant… **§240 is a capability they do not have and, as a one-shot generator with
no world and no history, could not use**" (WATABOU §1.2).

**Fantasy Town Generator has it.** Per the published layout documentation, the road network is created in
**configured stages**. There are numbered **district stages** and a final **suburb stage**, and each district
stage carries its own settings:

- its own **default building material** (the docs name wood, red tile and slate), which specialised structures
  may override;
- its own **building placement mode** (dense / gapped / individually fitted);
- its own **road branch type** — either continue-outward, or **curve around the origin at constant radius**,
  which the documentation says produces **ringed settlement patterns**;
- its own **maximum road angle**, i.e. how much its roads wander from straight, with zero meaning dead straight;
- its own **segment count before branching**, which sets that stage's block dimensions;
- its own **minimum district area** merge threshold;
- its own main-road branching probability and cap; and
- ⭐ **a boolean, "place wall after", which builds a perimeter wall around the lots that stage produced.**

**Read that list as a sequence rather than as a settings panel and it is a concentric growth history:** an inner
stage with dense placement, straight roads and a wall; then an outer stage with different material, looser
placement, more wandering roads, and possibly a second wall; then suburbs.

**That is §240 — core → circuit → ring → circuit → ring — implemented as a product feature.**

## 5.2 What it means that they got there independently

*Inference, and I want to be careful with it.* FTG's stages are **a configuration surface, not a history model.**
Nothing in the documentation suggests the stages carry dates, that an inner stage is *older*, or that anything
is derived from a settlement's actual past. The user picks the number of stages and their settings; the
generator executes them in order. **The temporal reading is available to a user who wants it and invisible to
one who does not.**

So the convergence is structural rather than conceptual, and that is exactly why it is worth something:

> **Two independent practitioners, solving "make a town plan that does not look uniform", both arrived at
> concentric stages with per-stage road and building character and an optional wall at each stage boundary.**
> Watabou, working one-shot, produced the flattest output of the three and the author himself is on record
> being unhappy with parts of it. **The staged approach is not our idiosyncrasy; it is what the problem
> converges to.**

**And our version is the strongest of the three,** which should be said plainly rather than assumed. FTG's stage
count and stage settings are free parameters typed into a form. Ours are **derived**: SPEC S5 records the epoch
ladder as **BUILT**, driven by dossier history, and SPEC §2.4 carries a *measured* band for how many epochs may
be legible — thorp/hamlet 1 · village 1–2 · town 2–3 · city 2–4 · metropolis 3–4, **never more than 4** — which
the spec notes "corroborates §240.2's ring ceilings independently." **They have the mechanism with no
derivation home; we have the same mechanism with one, plus a measured ceiling they have no way to know about.**

**Verdict: ALREADY-HAVE — and this is a corroboration, not an adoption.** Nothing to take. What changes is our
confidence: §240 is no longer a bet, it is the architecture the only other serious settlement-first product in
this space also reached.

## 5.3 One thing inside their staging that we do NOT have, and should look at

⭐ **They vary the BUILDING MATERIAL per stage.** An inner stage's default might be one material and an outer
stage's another, with specialised structures overriding both.

This is a small idea with a large consequence, and it is the one piece of their staging that is not already
ours. **A material change is the cheapest possible way to make an epoch boundary legible without drawing
anything extra.** It costs one field, it needs no new geometry, and it reads instantly.

**Verdict: INTERESTING-BUT-UNGATED (§10).** *I cannot gate it and I am not ranking it.* The reason is
disciplinary rather than aesthetic: material would express in our output as a fill tone or hatch treatment, and
the corpus metric that would gate it — a per-epoch fill-tone or texture separation — **does not exist.** The
measured register has `fill_tone_iqr` and `wash_within_sigma` as whole-plate statistics
(`laneHFM1-corpus-measured.csv`), not as a between-region contrast. SPEC §2.4 gives an **epoch grain step**
(newer epoch 1.8×–2.9× coarser) but that is a *grain* band, not a *tone* band, and using it to gate a material
change would be gating one quantity with another's number. **Recorded as a candidate with its missing
instrument named, exactly as WATABOU §6.3 recorded the missing tower-spacing metric.**

## 5.4 ⚠ And one thing in their staging we must NOT take

Their per-stage wall toggle draws a perimeter around that stage's lots — which, on the evidence of the published
map screenshots, is a **closed ring**.

SPEC §2.5 measures our target: **full ring 55% · half-ring against water 17% · terrain-anchored 14% · water
gates 10% · two vintages in frame 10%**, with the flat warning that **"a generator drawing a full ring 100% of
the time is wrong by ~45 points."** SPEC §2.5 also records that towers are absent on a flank in **6 of 7** walled
plates, and that the bare flank is **always the terrain-defended one**.

**A stage-boundary wall toggle is a ring-drawer.** Adopting it as-is would put us on the wrong side of a measured
45-point band. **Our circuit must remain a traced consequence of terrain and district structure (SPEC S13,
§232), not a shape stamped around a stage.** Recorded as an explicit non-adoption so nobody re-finds it as an
opportunity.

---

# 6. THE ROAD ENGINE — FOUR MECHANISMS, TWO OF THEM WORTH REAL MONEY

Our S7 is the spec's self-declared **sharpest gap** ("the legality is proven and total; **the SHAPE of the graph
is unconstrained**"). FTG's road engine is the most directly relevant prior art this program has found for it,
more so than Watabou's — because Watabou does not have a road engine at all, only a path-selector over a
pre-existing mesh.

## 6.1 Priority-ordered growth from a centre

Roads grow from a settlement centre. Main roads form a backbone; ordinary roads branch from them. Growth is
**priority-ordered**, and the documentation exposes the ordering rule as a user setting: a "main road priority
increase" that is added to the current priority when queuing the next segment, with the stated effect that
**higher values widen the suburbs while lower values keep development hugging the main roads.**

*What it achieves:* processing order determines which frontier expands first, so a single scalar trades "spread
out" against "ribbon along the arterials" without any second mechanism.

*Design intent* (inference): they wanted one dial between a compact blob and a star, and priority order is the
cheapest place to put it because the growth loop already needs a queue.

**Verdict: ADOPT-AS-APPROACH — ranked #2.**
- **(a) CAUSE.** Which frontier grows first is a *fact we hold*: SPEC S7's inputs already include the region's
  approach roads and their **ranks** (S1), gates (S13), and institution anchors as origins and destinations.
  Priority becomes a read-out of route importance rather than a slider.
- **(b) LOOK.** Gated on **γ connectivity 0.39–0.52** and **mean degree 2.1–2.7** (SPEC §2.4) — the "half-mesh,
  neither tree nor mesh" signature — and on the **extramural growth** frequency band, which SPEC §2.5 measures as
  present in **≥60% of walled plates, concentrated at ONE or TWO gates, never even**.
- **(c) DIRECTION.** This is the strongest (c) in the document. **A priority queue seeded from ranked approach
  roads produces unequal ribbon extents by construction** — the high-rank gate's frontier is serviced first and
  runs further. Our measured target says extramural growth must be *concentrated at one or two gates and never
  even*; an even-growth mechanism cannot produce that and a priority-ordered one produces it as its default
  output. **The mechanism's characteristic failure and our measured target point the same way.**

## 6.2 Snap-and-lengthen cleanup

New roads are **lengthened and snapped to existing intersections** as they are placed.

*What it achieves:* it kills the two defects that make grown networks look wrong — a road that stops two metres
short of another, and a pair of junctions a hair apart that should be one.

**Verdict: ADOPT-AS-APPROACH, with a hard caveat — ranked #5.**
- **(a) CAUSE.** Not a dossier fact but a **construction requirement**: SPEC S7's §190a right-of-way law and
  §201.2 street attachment already demand that every segment attach and that the web be inviolable ground. A
  snap tolerance is the machinery that makes attachment true rather than approximately true.
- **(b) LOOK.** Gated on **degree-≥5 share ≤ 0.01** (SPEC §2.4; 22 of 35 corpus windows have *zero* nodes of
  degree ≥5) and on **X:T ≤ 0.09**.
- **(c) DIRECTION — and here the honest answer is that it can go either way, so the caveat is the finding.**
  Snapping *raises* node degree: snap a road end onto an existing T and you have made an X; snap two ends onto
  the same node and you may have made a star. **Our degree-≥5 ceiling of 0.01 is one of the tightest bands in
  the whole target sheet.** So the mechanism moves us toward the corpus on sliver-elimination and *away* from it
  on junction degree unless the snap is **degree-aware** — refusing a snap that would push a node past degree 4,
  and terminating at the frontage instead, which is what SPEC S7 already rules ("the meeting is resolved by
  terminating at the frontage, not by crossing it"). **Adopt the cleanup; make the degree ceiling a precondition
  of the snap rather than a hope.**

## 6.3 Incremental lot detection

Each road placement triggers **lot detection** where intersections occur, and lots carry metadata about whether
they have been used.

*What it achieves:* blocks exist the moment they are enclosed, so the generator can start filling early lots
while still growing roads elsewhere — and it never needs a global planar-face decomposition at the end.

**Verdict: ALREADY-HAVE, differently and better justified.** SPEC S8 defines a block as **the planar face of the
street graph**, and §239.1 rules that a block is **defined by its bounding rights-of-way, never grown-then-
clipped**. That is the same identity, stated as law rather than as an incremental optimisation. **The one thing
worth borrowing is the incrementality** — but it is an implementation concern, not a plan-craft finding, and it
buys us nothing we can measure. Recorded and not ranked.

## 6.4 The minimum-district-area merge

Undersized district lots are merged into their neighbours to prevent fragmentation.

**Verdict: ADOPT-AS-APPROACH — ranked #6.**
- **(a) CAUSE.** SPEC §2.4 carries a **district separation** band (≥1.4× in median block area **or** ≥1.3× in
  cells-across) and a **legible districts** band (thorp 0–1 · hamlet 1 · village 1–3 · town 3–6 · city 5–9 ·
  metropolis 8–14) with the note that **"legibility saturates well below enumeration."** A merge threshold is
  the mechanism that converts "we generated many districts" into "a reader can see this many", and the count is
  a dossier consequence.
- **(b) LOOK.** Gated on the legible-districts band directly, plus **block area p90/p10 ≥ 6** (SPEC §2.4) —
  because merging away the smallest districts must not flatten the block-size spread the corpus demands.
- **(c) DIRECTION.** Our measured band says legibility saturates: a city shows 5–9 districts, not one per
  organism. Any generator with per-district organisms will produce more districts than that. **A merge pass
  moves the count down toward the band, which is the direction the band requires**, and — because it merges the
  *smallest* — it removes exactly the pieces that were never going to be legible anyway. ⚠ The threshold must be
  derived from the tier's district band, **not typed in as their setting is.**

---

# 7. BLOCKS AND BUILDINGS — THE DIRECT ANSWER TO WATABOU'S TRIANGULAR REMNANTS

ODQ §260.3 asked specifically whether anything here touches **the triangular-remnant problem** WATABOU §5.2
identified as the original's worst geometric defect — the wedge-shaped leftovers that recursive cutting of an
irregular polygon inevitably produces, which the original's own author called a silly algorithm and intended to
replace.

**FTG's answer is architectural: they offer three placement modes and only one of them is subdivision.**

Per the published layout documentation, how non-specialised buildings fill a lot is a per-stage choice:

| Mode | What it does | What it cannot produce |
|---|---|---|
| **Dense** | wall-to-wall compact arrangement | — |
| **Gaps** | the same, then shrunk to open spacing between neighbours | — |
| ⭐ **Individually placed** | **fitted shapes — the docs name L-shaped and rectangular — matched to the plot's dimensions** | **wedges. A shape chosen from a rectilinear vocabulary and fitted to a plot cannot come out triangular.** |

**This is the real divergence between the two products at the building scale, and it is the one §260.3 was
looking for.** Watabou generates a footprint by *cutting until the piece is small enough*, so the footprint's
shape is whatever the cuts left — including wedges. FTG's third mode generates a footprint by *choosing a shape
and fitting it*, so the shape is drawn from a controlled vocabulary and the plot's leftover becomes yard rather
than becoming a bad building.

*Design intent* (inference): once buildings are things a user clicks on, inspects, and reads a description of —
which is FTG's entire product — **a wedge-shaped tavern is not a cosmetic flaw, it is a broken object.** The
world-first architecture forces the fix. Watabou's buildings are decoration and can afford to be wedges; FTG's
buildings are entities and cannot.

**Verdict: ADOPT-AS-APPROACH — ranked #3.**
- **(a) CAUSE.** SPEC S10's burgage comb and S11's footprints already derive plot geometry from district facts;
  the *vocabulary* a footprint is drawn from is a function of building kind and district lifestyle, both dossier
  facts. **The shape is chosen because of what the building is, not because of where the cuts fell.**
- **(b) LOOK.** Gated on **block solidity median 0.60–0.86** and **block elongation median 1.6–3.0** (SPEC §2.4),
  and on the **burgage plot geometry** band (depth:width 4–6:1, building 30–45% of plot depth, touching the
  street line, series widths ±20–40% and never exact, SPEC §2.5).
- **(c) DIRECTION.** ⭐ **This is the cleanest (c) available.** SPEC §2.5 already records where our output misses:
  the **alley/sliver floor** band is 0.02–0.08 plot-widths and our b8 run reads 0.16/0.09/0.09, with the spec's
  own comment that *"a HIGHER floor means UNIFORM SPACING, not tight packing — the town moved the wrong way."*
  A fitted-vocabulary placement mode addresses precisely that: it puts buildings **on the street line** at their
  own widths with the residue going to backland, rather than distributing residue evenly as inter-building gaps.
  **The known miss and the mechanism's known effect are the same quantity, pointing the same way.**

⚠ **The corollary is a warning, and it contradicts a natural reading of WATABOU §5.2.** MF-X2 recommended
adopting Watabou's subdivision modulations while adding a hard aspect-ratio filter to cure the wedges. **FTG's
evidence suggests a stronger option: for the buildings that matter, do not subdivide at all — fit.** These are
not exclusive. The synthesis I would recommend, and it is my judgment rather than either source's:
**subdivide to get PLOTS, then fit a shape into the plot to get the FOOTPRINT.** Subdivision is good at
producing a believable irregular plot series (that is what a burgage comb is); it is bad at producing a
believable building. **Use each for what it is good at, and the wedge problem disappears without needing a
filter to catch it.** Under §258.2 this is stated as a substitution: *§246's plot-series intent PRESERVED,
execution changed from "recurse until building-sized" to "recurse to plot, then fit footprint", measurable
signature — burgage depth:width 4–6:1 and building 30–45% of plot depth — unchanged and more directly
achievable.*

## 7.2 Density as an explicit percentage in the fringe

The suburb stage carries a **density** setting: a percentage probability that an available plot receives a
building at all.

Compare Watabou's outskirts thinning (WATABOU §5.4), which deletes buildings probabilistically by distance from
a populated edge and by a per-corner density value. **Watabou's is derived from position; FTG's is a flat
percentage.** Under §256 a flat percentage is a free parameter and therefore decoration.

**Verdict: DELIBERATELY-DIFFERENT.** Watabou's version of this mechanism is the better one and MF-X2 already
ranked it. FTG's is simpler and worse. **Recorded because a null result is a result:** where the newer product
is weaker than the older, saying so is part of the job.

## 7.3 The suburb stage's genuinely good idea: lots that need no roads

The suburb stage creates **small lots with invisible edges**, which the documentation says allows placement on
the settlement fringe **without surrounding roads.**

*What it achieves:* the fringe of a grown-road town has a structural problem — a building needs a lot, a lot
needs enclosing edges, and the fringe is where roads run out. Rather than growing pointless roads to manufacture
enclosure, they **relax the enclosure requirement and mark the resulting edges invisible.**

**Verdict: ADOPT-AS-APPROACH — ranked #4, and it lands on the weakest surface in our program.**
- **(a) CAUSE.** SPEC S15 (the edge and extramural ordering) and S18 (the countryside, flagged as **"the weakest
  surface in the whole program"**) both need fringe buildings that do not have a block around them. Which
  buildings sit outside is a dossier fact — noxious trades, farmsteads, the ribbon along the high-rank approach.
- **(b) LOOK.** Gated on **dead-end share 0.110–0.209–0.391** (SPEC §2.4) and on the **extramural growth** band
  (≥60% of walled plates, one or two gates, ribbon extents explicitly unequal, SPEC §2.5).
- **(c) DIRECTION.** ⭐ A fringe built from enclosure-free lots **terminates streets rather than looping them**,
  which raises dead-end share exactly where the corpus puts its highest values (SPEC §1.1.7d records canal and
  fringe morphologies at the top of the range, and rich/poor halves differing by 38%). Our alternative —
  growing roads to close every fringe lot — would *lower* dead-end share and push us toward the bottom of a band
  we should be spanning. **The mechanism moves the metric the way the corpus says it should move.**

---

# 8. WATER, TERRAIN AND THE HINTERLAND — WHERE FTG BEATS WATABOU OUTRIGHT

WATABOU §7's finding was blunt: the 2017 generator has **no terrain and no water**, a water field declared and
never populated, and "the city floats on a featureless infinite plane."

**FTG has a water system, and it is the first stage of map generation** — water is generated or read from a
hand-drawn state *before any road is placed*. That ordering is the whole point: water that arrives after the
roads can only be carved around; water that arrives first constrains everything downstream.

## 8.1 What their water system contains

From the published water documentation, in my own summary:

- **Coasts** generated in two arms extending from the map centre, from three presets (a long beach, a rocky
  coastline, a cliffed coastline), with an "extreme" exaggeration mode and per-side configuration.
- **A two-level shape model**: an overall shape (smooth / gentle curves / sharp curves) that governs bays and
  headlands at the large scale, and a *detail* shape (none / bays / deep bays / rough / jagged) that governs
  texture at the small scale. ⭐ **And an "ease into detail shape" option that reduces detail intensity near the
  settlement centre — stated in the docs as being where harbours locate.**
- **Rivers** with a path shape (straight / gentle / sharp), **branches that are either convergent (upstream
  confluences) or divergent (downstream distributaries)**, with the note that intersecting branches form
  **islands**, a **width in metres**, and a **minimum spacing between bridges**.
- **Manual drawing** of either an ocean/river polygon or a river centreline-plus-width.
- ⭐ **A stated interaction rule with roads: roads are EXTENDED to bridge a river, and TERMINATE if they meet an
  ocean.**

## 8.2 What is worth taking, and what is not

**⭐ The large-scale/small-scale split with a centre-attenuated detail term — ADOPT-AS-APPROACH, ranked #7.**
- **(a) CAUSE.** SPEC S4 (the water system) is **PARTIAL**, and SPEC §1.2b names **the bearing to water** as a
  real gap with a derivation home. Where the settlement meets the water is a dossier and siting fact; how ragged
  that meeting is at the large scale versus the small scale is a terrain fact.
- **(b) LOOK.** Gated on the **water relationship incidence** band (BANKSIDE 44% · NONE/WELL 29% · NEAR 15% ·
  THROUGH 12%) and its rider that **every THROUGH settlement must show bank asymmetry around 70/30** (SPEC
  §2.5).
- **(c) DIRECTION.** The attenuation term is the part that argues: **a shoreline that is jagged in the wild and
  smooth where the town touches it is exactly what a bank-asymmetric, quay-bearing settlement looks like.** A
  single-scale coastline generator produces uniform raggedness and cannot express the asymmetry our band
  requires. This moves the metric the right way for a structural reason, not an aesthetic one.

**⚠ Their preset coast styles and the arm count — DELIBERATELY-DIFFERENT.** "Two arms from the centre" and a
three-item style menu are free parameters with no derivation home. Ours must come from terrain.

**⭐ The road/water interaction rule — ADOPT, and it is nearly free.** *Bridge a river, terminate at an ocean.*
That is one sentence and it encodes a genuine truth: a river is a crossable obstacle and a sea is a boundary.
SPEC §4.1a records our **street-over-water** violations as a live census, with 72% currently unexemptable by
construction; a typed rule of this shape is exactly what makes the census exemptable — a street over a river at
a bridge is legal, a street over the sea never is. **(a) CAUSE:** river navigability and class are already owner
law (§205). **(b) LOOK:** gated on the existing street-over-water census rather than a band. **(c) DIRECTION:**
it converts violations into typed legal crossings, which is unambiguously toward compliance.

## 8.3 The hinterland — and it lands on the weakest surface we have

FTG's outer-settlement stage extends main roads to the map borders, **estimates how many lots it needs for the
remaining buildings plus landscape features**, subdivides until it has them, and places features **clustering
similar elements together**. District and suburb stages carry configurable **backgrounds** — the docs name
grass, lawn, dirt, road, rocks and fields — plus separate density controls for trees and rocks in the settlement
and in farmland.

The published screenshots corroborate this directly: cropland, pasture and ploughed-field polygons in different
tones, textured woodland, and roads leaving frame.

**SPEC S18 calls the countryside "the weakest surface in the whole program."** FTG's hinterland is not
sophisticated — it is land-use polygons with a clustering rule — **but it exists, it is driven by the same lot
machinery as the town, and it is the first prior art in this program that treats the countryside as generated
rather than as background.**

**Verdict: ADOPT-AS-APPROACH — ranked #8.**
- **(a) CAUSE.** Our dossier holds the hinterland facts FTG estimates: what the settlement farms, grazes,
  quarries and cuts. And §4.2's dependency graph makes the link *causal* — **a settlement with farms needs
  farmland, and the graph already knows whether it has farms.**
- **(b) LOOK.** Gated on **`hull_frac_of_frame`** and **`green_excess`** from `laneHFM1-corpus-measured.csv`,
  which measure how much of the plate is settlement versus surround and how green the surround reads.
- **(c) DIRECTION.** ⭐ Honestly stated: **weak.** Our corpus's surround is painterly and varied; a clustered
  land-use polygon fill is a coarser thing. What I can argue is narrow — that generating the surround from the
  same lot substrate as the town keeps `hull_frac_of_frame` derivable rather than arbitrary, where today it is
  effectively unconstrained. **I would rank this eighth precisely because (c) is thin, and I flag that it is the
  weakest (c) among the ranked adoptions.**

---

# 9. ⭐ THE EDGE NETWORK AS DURABLE SUBSTRATE — AND A SHIPPING PRODUCT'S ANSWER TO OUR INERTIA PROBLEM

This section exists because a shipping product publicly documents its answer to a problem we have written
several laws about, and its answer is **different from ours in a way that is instructive rather than better.**

## 9.1 What they do

FTG lets users edit essentially everything on the map — the docs' own words for the manual map editor are that
you can edit *"every aspect of the map, from buildings, to roads and backgrounds."*

It also offers **regenerate-area**: select lots, and their contents are replaced with newly generated content.
The documentation is precise about scope:

- it **destroys** every building, background element and decoration inside the selected lots, and optionally the
  roads too if road re-rolling is enabled;
- it **preserves** everything outside the selection; and
- ⭐ **it preserves the edge network that defines lot boundaries**, which the documentation says is required "to
  maintain the correctness" of the system.

And the documentation gives the reason edits outside the selection are left alone, which is the sentence worth
the whole section: **the generator "doesn't know which ones you are happy to have edited, and which ones should
be left alone."**

## 9.2 What that tells us

**They hit our exact problem and solved it with geometry instead of identity.** A user edits a building; a
regeneration would clobber it; the generator cannot distinguish an edited entity from a generated one; so the
product **scopes regeneration spatially** and makes the user draw the boundary of what may be destroyed. The
edge network is exempted from the whole mechanism because everything else is defined in terms of it.

Two things follow, and they point in opposite directions.

**⭐ The idea worth having: the plan's SKELETON is a different durability class from its CONTENTS.** Edges
persist; buildings, backgrounds and decorations are disposable. That is a clean and defensible layering, and it
is one we already half-hold — SPEC S7's §190a calls the derived street web **"INVIOLABLE GROUND"**. FTG makes
the same distinction operational at the *persistence* layer rather than only at the legality layer. **Worth
stating explicitly in our own model: the street web and the lot boundaries are the durable substrate; fabric
contents are regenerable.**

**⛔ And the approach we must NOT take, stated flatly because it is the tempting shortcut.** Spatial scoping is
a workaround for missing identity. Our determinism model (SPEC §3.3) is *far* ahead here and must stay that way:
draws go through `keyedRandom` over **stable lineage IDs, never a stream position**, which is what makes the
inertia law "arithmetically true rather than asserted"; epochs carry **per-epoch keyed streams** so that adding a
later circuit does not re-roll an earlier one; same-seed output is **byte-exact across 10 cross-process runs**;
and the inertia law names **the block as its unit**, with a measured pin (967 parcels byte-identical, 44 changed,
median centre movement 0.39 units).

**FTG cannot make any of those claims, and the reason is architectural rather than a matter of effort: if your
entities have no stable derivation identity, spatial selection is the only scoping tool available to you.**

**Verdict: DELIBERATELY-DIFFERENT on the mechanism; ALREADY-HAVE-AND-AHEAD on the problem.** The one
transferable piece is the **substrate/contents durability split**, recorded above.

⚠ **One genuine warning their design surfaces for us, and it is a lifecycle path worth checking.** FTG's
regenerate-area *optionally* re-rolls roads within the selection — which means the edge network, the thing
declared inviolable, is itself mutable under an opt-in. **Any regeneration path we build must answer the same
question explicitly: does it re-derive the street web, and if so, what happens to every fact defined in terms
of it?** SPEC §3.3's per-epoch keyed streams answer this for circuits; I did not find an equivalent statement
for a *partial* street-web re-derivation. **Recorded as a question for the map program, not as a finding** — I
did not read our code and cannot claim the gap is real.

---

# 10. PRODUCT-SHAPED FINDINGS — WHAT A REAL USER OF THESE TOOLS ACTUALLY NEEDS

ODQ §260 asks for product-shaped concerns **only where they reveal user need**. This section is filtered on that
test, and it is short by design. It matters more than it looks, because §247 records the owner's strategy that
**the map is the acquisition surface** — so evidence about what the competing map product's users are actually
given is evidence about the threshold §247 says is a threshold rather than a spectrum.

## 10.1 ⭐ The map is not exported. The product is embedded.

This is the most surprising product finding, and both integration repositories confirm it independently.

The Foundry "importer" **does not import a map.** It creates an empty scene, stores a single settlement
identifier on it, and — when the user opens that scene — injects an **iframe pointing at the live Fantasy Town
Generator web application**, choosing a GM path or a public path depending on the user's role. The Roll20
extension does the same thing into Roll20's page, and its README states plainly why a browser extension rather
than a platform mod: the platform's mod API forbids iframes and outbound requests, and requires a paid tier.

The two clients then speak a **bidirectional message protocol** with the embedded application. Inbound: a
building was clicked (with the people currently inside it), a district was clicked, a faction roster was opened,
a map pin was created, updated or deleted, the mouse moved. Outbound: set the party's current location, change
the settlement's time, favourite a building or person, save notes.

**What a user actually needs, read off this design** *(inference)*:

1. **They need the settlement to stay live, not to become a picture.** An exported PNG is a snapshot of a world
   that keeps moving. The entire integration exists to avoid the export.
2. **They need it inside the tool they are already using.** Nobody wants a second window during a session.
3. **They need per-entity notes with a public/private split** — the clients carry both a public notes field and
   a GM-only one per building, person and faction, plus a flag controlling whether players may write to the
   public one. **This is the most under-appreciated feature in the whole product**: it is where the user's own
   campaign attaches to the generated world.
4. **They need the generated entity to link to their own document** — the Foundry client maintains a persistent
   mapping from FTG people, buildings and factions to the user's own journal entries, with an option to open
   the journal automatically when the entity is clicked. **The generated world is a scaffold the user hangs
   their own material on.**

**⭐ The verdict for us is a product observation and it is owner-gated, so it is raised rather than decided:**
the fact that the market's substance leader **cannot** hand a user a static artefact and has instead built an
embed-and-sync architecture is evidence for §247's thesis from an unexpected side. **§247 says the map earns the
traffic because it is screenshot-able and shareable in under two seconds. FTG's own architecture concedes that
its map is not that** — it is a live application surface, and its integrations exist precisely because a
screenshot loses everything. *That is a competitive opening, and naming it is as far as this lane goes.*

## 10.2 Export formats — and one that is a real signal

The published export menu offers: **map as PNG** (configurable resolution and crop), **map as SVG** (with the
documented caveat that the vector renderer simplifies trees and loses texture detail), **building and population
details** as one JSON file or a set of CSVs, **map as GeoJSON**, and the two VTT integrations.

⭐ **The GeoJSON export is the signal.** The documentation describes it as carrying "all the backgrounds, edges,
buildings, and their outlines as coordinates", explicitly for developers who will write code against the raw
map data — **and it states that the coordinate system is metric, one unit to one metre.**

**Two findings from that.**

**(1) Their plan is metrically real, and that removes a class of free parameters.** River width is set in metres.
Bridge spacing is set in metres. A person's height is in centimetres. **When every dimension is a real-world
quantity, scale is derivable rather than tuned** — you can ask whether a street is wide enough for two carts
instead of whether it looks wide enough. Under §246 that is the difference between a derivation and a
decoration, applied at the level of the *unit system* rather than the individual parameter.

**Verdict: ADOPT-AS-APPROACH — ranked #9, and it is cheap.** **(a) CAUSE:** our plot and street bands are
already expressed in **plot-widths** (SPEC §2.4/§2.5), which is a normalised unit; anchoring the plot-width to a
metric frontage makes the whole ladder physical. **(b) LOOK:** the corpus bands are ratio-based and therefore
unit-invariant, so this is gated on **no band moving** — the metric anchor must be a re-expression, not a
change. **(c) DIRECTION:** ⚠ **neutral by construction, and I say so rather than claiming a gain.** A unit
anchor cannot move a ratio metric. Its value is that it makes future parameters derivable; it does not move us
toward the corpus today. *By the §261 rule that would file it under INTERESTING-BUT-UNGATED — I have ranked it
anyway, and flag the exception, because "no band moves" is a testable gate even though it is not a gain.*

**(2) A published, documented, machine-readable plan export is a product surface we should assume is expected.**
Not a mechanism finding; recorded once, in one line, because §247's strategy makes competitive table stakes
worth knowing.

## 10.3 The simulated hour — the one capability that is genuinely theirs

FTG runs a **schedule simulation**. The time of day and day of the week are settlement state; people have
schedules; a building's dialog lists who is inside it *right now*, broken down by sub-location within the
building; a person's dialog states what they are currently doing. The Foundry client synchronises this to the
table's own calendar module, mapping weekday names and falling back to weekday index, pushing an update on each
hour change. The map itself carries a day/night cycle with sun positioning and weather.

**Verdict: NOT-APPLICABLE, and deliberately so.** This is a world-simulation capability, not a plan-craft one,
and it sits outside the map program entirely. **It is recorded here for one reason: it is the clearest available
evidence of where the competing product spent its effort.** FTG's map is the *surface* of a world simulation;
the plan-craft is in service of it. That is the opposite weighting from Watabou and it is worth knowing when
judging why FTG's plan mechanisms are simpler than Watabou's in several places — **they are simpler because
they were not the point.**

⚠ **And it is adjacent to a §247 caution worth stating.** §247.3c names our differentiator as **the same town
across time (year 1 → year 100)**. FTG also sells "the same town across time" — **but its axis is hours and
days, not decades.** These are completely different products wearing a similar sentence. If we lead with
"across time" without saying "across generations", the claim will be heard as theirs. *A marketing observation,
raised not decided; the owner holds marketing doctrine.*

---

# 11. ⛔ THE LOOK — FTG'S RENDER IS NOT OUR TARGET EITHER, AND THE REASON IS MEASURABLE

§256.2 required MF-X2 to say flatly that Watabou's rendered output is not our aesthetic target. **The same must
be said about FTG, and the argument is different and in some ways stronger.**

## 11.1 What their renderer actually is

From the published map documentation, FTG's map is a **WebGL2 real-time 3D scene**, not a drawing. It offers
antialiasing modes traded against performance, **procedurally generated 3D roofs** (with flat, textured-flat and
flattened-3D alternatives for weaker hardware), ground shadows behind elevated objects, a sun-positioned
day/night cycle, an adjustable percentage of individually drawn trees and rocks, a **3D "street view" mode**, and
an SVG renderer as a compatibility fallback. Its default layer is called **"Satellite"**, with buildings coloured
by material; alternative layers colour buildings by type, highlight useful shops, show district boundaries or
show favourites; a separate text layer draws district names flat, rotated or arced.

The published screenshots match: a textured-ground overhead view with drop-shadowed buildings, saturated
vegetation, a blue river, a dark wall polyline with visible vertex dots, and district names set in serif small
caps across the fabric — **the visual language of a modern digital slippy map.**

## 11.2 The parchment mode is a filter, and that is the finding

FTG does offer a hand-drawn look. The documentation lists it among **effects**: greyscale, sepia and green
tints, pixelation, vignette, dot screen, scanline, and **crosshatch with noise and parchment options and a
customisable line colour.**

⭐ **These are post-process filters applied over the 3D render.** That is an architectural fact with a
measurable consequence, and it is the reason chasing this look would cost us:

> **A global post-process filter produces spatially UNIFORM texture statistics.** Our corpus is graded on
> `paper_grain_sigma`, `wash_within_sigma`, `wash_within_sigma_p90` and `fill_tone_iqr` — all of which measure
> **variation**, and `wash_within_sigma` measures variation *within* regions. The measured corpus bands are not
> small: `wash_within_sigma` and `paper_grain_sigma` both span roughly a factor of three across the strongest
> cohort (`MFS2-bands.json`; e.g. `paper_grain_sigma` STRONGEST p5 1.3 → p95 2.96, median 2.05). **A uniform
> shader cannot produce a distribution; it produces a constant.** A crosshatch filter over a 3D render will
> read as one grain everywhere, and it will miss on exactly the axes we grade hardest.

**This is a stronger version of the §256.2 argument than the Watabou one.** Watabou's flat vector fill is
*simpler* than our target. FTG's filtered 3D render is not simpler — it is *sophisticated in a different
direction*, which makes it more tempting and no less wrong. **[RENDER NOTE — nothing in §11 is a
recommendation.]**

## 11.3 What their renderer nevertheless proves

Two things, and both are about engineering rather than appearance.

1. **⭐ Real-time is achievable at this scale, and it is a design constraint they accepted.** They ship
   hardware-adaptive quality settings and auto-detect optimal settings per machine. **§247.3a promotes our §220
   performance gate to launch-blocking for the map surface, and §220 exists because a slow wow-moment is not a
   wow moment.** FTG's whole render architecture is organised around that constraint. *Recorded as corroboration
   of the §220/§247.3a prioritisation, not as a technique.*
2. **A vector fallback renderer exists alongside the primary one, with documented fidelity loss.** They chose to
   ship two renderers and to *tell users what the second one loses.* That honesty is a small product lesson and
   costs nothing to note.

## 11.4 One structural thing visible in their pictures that is NOT a look finding

Worth separating out, because it would be easy to mis-file. In the published map screenshots the town wall is
drawn as a polyline with **small dots at its vertices** — towers at wall corners.

That is **the same structural rule WATABOU §6.3 established** (towers are wall-polygon vertices, and the even
spacing is emergent from uniform cell size rather than enforced), now visible in a second, unrelated product.
§259.3 already ruled our position: **never place by spacing — place by structure, and let the spacing be
whatever the structure gives.** **This is independent corroboration of that ruling from a different codebase,
and it is the only thing in §11 that is evidence about mechanism rather than about paint.**

⚠ It remains **ungateable**, exactly as WATABOU §6.3 recorded: our plan-metric set still contains **no
tower-spacing metric of any kind**. Two prior-art products now agree on the mechanism and we still cannot check
an implementation against a number. **That strengthens the case for the wave-nine instrument item; it does not
substitute for it.**

---

# 12. THE VERDICT LEDGER

Every mechanism examined, with its verdict. **ADOPT-AS-APPROACH rows carry all three §261 legs or they are not
in this table** — they are in §13 instead.

| § | Mechanism | Verdict | Rank |
|---|---|---|---|
| 4.2 | **Building roster as a resource dependency graph** — nodes are resources/services, edges are ratios per head or per other node, producers fall back to importers when the land cannot support them | **ADOPT-AS-APPROACH** | **#1** |
| 6.1 | **Priority-ordered road growth** from a centre, priority seeded from ranked approach roads | **ADOPT-AS-APPROACH** | **#2** |
| 7.1 | **Fit a footprint from a rectilinear vocabulary into a plot**, instead of subdividing until building-sized | **ADOPT-AS-APPROACH** | **#3** |
| 7.3 | **Enclosure-free fringe lots** with invisible edges, so the fringe needs no manufactured roads | **ADOPT-AS-APPROACH** | **#4** |
| 6.2 | **Snap-and-lengthen road cleanup**, ⚠ made **degree-aware** so it cannot mint a star | **ADOPT-AS-APPROACH** | **#5** |
| 6.4 | **Minimum-district-area merge**, threshold derived from the tier's legible-districts band | **ADOPT-AS-APPROACH** | **#6** |
| 8.2 | **Two-scale coastline** (large shape + detail shape) with **detail attenuated near the settlement** | **ADOPT-AS-APPROACH** | **#7** |
| 8.3 | **Hinterland generated from the same lot substrate as the town**, clustered by kind | **ADOPT-AS-APPROACH** ⚠ weakest (c) | **#8** |
| 10.2 | **Metric unit anchor** — every dimension a real-world quantity | **ADOPT-AS-APPROACH** ⚠ (c) neutral, flagged | **#9** |
| 8.2 | **Road/water typed interaction** — bridge a river, terminate at an ocean | **ADOPT-AS-APPROACH** — smallest and most certain item in the study | **#10** |
| 9.2 | **Substrate/contents durability split** — the edge network persists, contents are regenerable | **ADOPT** as a stated model property (no new machinery) | — |
| 5.1 | **Staged concentric generation with per-stage road and building character** | **ALREADY-HAVE** — §240, and this is independent corroboration | — |
| 4.1 | **World generated before plan** | **ALREADY-HAVE** — SPEC S0 reads the dossier first | — |
| 4.3 | **Population as the loop condition** | **ALREADY-HAVE**, better founded (ours is a fact, theirs a setting) | — |
| 6.3 | **Incremental lot detection** as roads close loops | **ALREADY-HAVE** — SPEC S8/§239.1 states it as law | — |
| 11.4 | **Towers at wall vertices** | **ALREADY-RULED** (§259.3) — second independent corroboration; ⛔ still ungateable | — |
| 3.2 | **Attachment-grown streets** | **ALREADY-RULED** — SPEC S7; triangulated across three sources | — |
| 5.4 | **Per-stage "place wall after" toggle** | ⛔ **REFUSED** — it is a ring-drawer, and our band says full-ring 100% is wrong by ~45 points | — |
| 7.2 | **Flat percentage density in the fringe** | **DELIBERATELY-DIFFERENT** — free parameter; Watabou's positional thinning is the better mechanism | — |
| 8.2 | **Preset coast styles, "two arms from the centre"** | **DELIBERATELY-DIFFERENT** — free parameters, no derivation home | — |
| 9.2 | **Spatially-scoped regeneration** as the edit-survival strategy | **DELIBERATELY-DIFFERENT** — a workaround for missing identity; our keyed-lineage model is ahead | — |
| 4.2 | **Their particular dependency nodes, ratios and building pools** | ⛔ **REFUSED** — one designer's economy; decoration under §256, and the kind of authored selection §0 most firmly declines | — |
| 3.3 | **"Curve around origin" ring-road mode** | **DELIBERATELY-DIFFERENT** unless epoch-scoped — it manufactures X-nodes against a measured X:T ≤ 0.09 | — |
| 10.3 | **Hour-resolution schedule simulation** | **NOT-APPLICABLE** to the map program | — |
| 11.1–11.2 | **The WebGL2 render and its crosshatch/parchment post-filters** | ⛔ **NOT OUR TARGET** — a global filter yields uniform texture statistics against bands that measure variation | — |

## 12.1 ⭐ THE RANKED LIST — what genuinely accelerates us

Ranked by **leverage against our own gap ledger**, not by how clever the mechanism is.

1. **The dependency graph (§4.2).** The only mechanism in either prior-art study with **no free scalar anywhere
   in it**, and the one whose inputs we already hold in richer form than its author does. It lands on SPEC S16
   ("institution siting as a relational system — scale exists; RELATIONS do not") and supplies the roster half
   of it. **Biggest single win available here.**
2. **Priority-ordered road growth (§6.1).** Lands directly on **S7, the spec's self-declared sharpest gap**,
   and its characteristic output — unequal ribbon extents concentrated at the highest-ranked gates — is what our
   extramural band actually measures.
3. **Fit-the-footprint (§7.1).** Cures the defect MF-X2 flagged as the original's worst, addresses our own
   measured alley/sliver miss, and permits the subdivide-to-plot-then-fit synthesis in §7.1 which I think is the
   better architecture than either source's.
4. **Enclosure-free fringe lots (§7.3).** Cheap, and it lands on **S18, "the weakest surface in the whole
   program."**
5. **Everything else in the table**, in the order given. The tail is genuinely a tail: items 5–10 are single
   rules or thresholds, not architecture.

**And the honest headline about acceleration: three of the top four land on stages our own specification already
identifies as its weakest.** That is the strongest practical argument for having read this at all.

---

# 13. INTERESTING-BUT-UNGATED

Per §261: mechanisms I find genuinely good but **cannot argue leg (c)** for. **These carry no implementation
claim and are not ranked.** They are listed so they are not lost and not smuggled into the adoption set.

| § | Mechanism | Why it is ungated |
|---|---|---|
| 5.3 | **Building material varies per epoch** — the cheapest way to make an epoch boundary legible | **No corpus metric exists** for between-region tone or texture contrast. `fill_tone_iqr` and `wash_within_sigma` are whole-plate statistics; SPEC §2.4's epoch grain step is a *grain* band and using it here would gate one quantity with another's number. **Instrument named: a per-epoch fill-tone separation measure.** |
| 4.2 | **The full-employment objective exposed as a user choice** | A generator objective, not a geometric output. Nothing in the measured register responds to it. Recorded because making the objective function explicit is good design practice. |
| 10.1 | **Per-entity public/private notes with a player-write flag** | Product feature, not plan-craft. No metric, and correctly so. Noted in §10.1 as the place a user's campaign attaches to a generated world. |
| 10.1 | **Persistent entity→user-document linkage** (generated entity bound to the user's own journal page) | Same. **The sharpest product insight in the study and entirely outside the map program's gates.** |
| 11.3 | **Hardware-adaptive render quality with per-machine auto-detection** | Engineering practice. Corroborates the §220/§247.3a prioritisation; gates against a performance budget, not a corpus band. |
| 6.3 | **Incrementality of lot detection** | An implementation optimisation. Buys nothing measurable; the *identity* it implements we already hold as law. |

---

# 14. ⭐ WHAT THE DIVERGENCE TEACHES THAT THE ORIGINAL COULD NOT

The mandate asked for this, and the empty fork changes what "the divergence" means without removing it (§1.4).
The divergence here is **Watabou's generator versus the product Allerton built after reading it** — total rather
than incremental. Five things follow that MF-X2's study, by construction, could not have produced.

**1. ⭐⭐ The same problem has two architectures, and the choice of architecture explains almost everything else
about each product.** Watabou partitions space and selects streets from the partition; FTG grows streets and
detects blocks from the growth. Nearly every downstream difference — why one has uniform cells and the other
needs a fragmentation-merge setting, why one gets T-dominance from Voronoi degree-3 and the other from branch
attachment, why one derives its wall by tracing and the other stamps one per stage — follows from that single
fork. **Reading one generator teaches you a program; reading two teaches you which of its properties were
choices.**

**2. ⭐⭐ Our own S7 mechanism is triangulated, not merely reasoned.** Three unrelated routes — Voronoi
degree-3 vertices, branch-attachment growth, and our own spec's reasoning from measured corpus values — arrive
at a T-dominated half-mesh. MF-X2 could establish that *one* generator produces T-dominance mathematically.
**Two independent mechanisms producing the same signature is a much stronger warrant for the class**, and it
was only available with a second data point.

**3. ⭐⭐ §240 is not our idiosyncrasy — it is where the problem converges.** MF-X2's sharpest differentiation
claim was that the epoch ladder is a capability the prior art does not have and could not use. **The second
product has it**, as numbered stages with per-stage road character, building character and an optional wall.
That reframes §240 from "our distinctive bet" to "the architecture serious practitioners reach", **while leaving
our advantage intact and better defined**: theirs is a settings panel with free parameters, ours is derived from
dossier history and has a *measured ceiling* (never more than 4 legible epochs) that they have no way to know.
**A differentiator you thought was unique and turns out to be convergent is not a loss — it is a de-risking.**

**4. ⭐ The wedge problem has an architectural cure, not just a filter.** MF-X2 correctly identified the
triangular-remnant defect and recommended a hard aspect-ratio filter. The second practitioner's answer is
better: **don't produce the wedge.** Choose a footprint from a controlled vocabulary and fit it to the plot.
**You cannot learn "there was another way to do this" from a single implementation** — a single implementation
teaches you its own approach and its own defects, and makes both look necessary.

**5. ⭐ Where a product's value sits determines where its craft goes, and it is legible from the outside.**
Watabou's buildings are decoration, so wedges are tolerable. FTG's buildings are clickable entities with names,
occupants and opening hours, so wedges are broken objects and the placement architecture changed to prevent
them. **Ours are dossier-true, which is a third position again** — and this comparison is what makes the
consequence explicit: *the quality bar for a generated object is set by what the product asks a user to do with
it.* Our objects are asked to be **true**, which is a higher bar than either, and it is why §246's
derivation-home test exists.

**And one thing the empty fork itself taught, which is small but real:** a fork button is a bookmark. The
inference "same name, therefore a derivative work, therefore the diff is the story" was reasonable, well-formed,
and wrong — and it cost about four minutes to falsify with three API probes. **Establish the relationship with a
receipt before designing the study around it.**

---

# 15. HONEST LIMITS

Stated affirmatively, as §254.5 and the doctrine require.

1. **Nothing was executed.** No Haxe/OpenFL toolchain was installed; nothing was built, run, or rendered. **No
   finding about how either generator behaves is CONFIRMED.** The only CONFIRMED claims in this document are
   the repository, licence and digest facts in §0 and §1.1, which rest on probes I ran and quoted.
2. **FTG is closed-source, and my account of its algorithm is second-hand by necessity.** It rests on the
   author's published documentation, on published screenshots, and on the capabilities his two open integration
   clients must support. **That is inference from documentation, not from code**, and documentation both
   simplifies and lags. Where I describe a mechanism, I am describing what the docs describe.
3. **The forked generator's vintage is 2017** (plus a 2019 toolchain bump), unchanged from MF-X2's study. The
   fork adds no currency whatever.
4. **FTG's own vintage is current but unversioned to me.** The docs site is live and the integration clients
   were pushed in 2025 and 2026, so the product I describe is recent. I cannot pin which release the
   documentation describes, and a feature could have moved.
5. **⭐ Per §261, none of this is evidence about our corpus.** No finding here is tagged "we were wrong", and no
   corpus measurement is revised on this document's authority. Where this code and our plates disagree, that is
   two independent things differing.
6. **Every leg (c) is a prediction.** The direction arguments in §4.2, §6.1, §7.1, §7.3, §8.2 and §8.3 are
   reasoned from the mechanism's structural properties against our measured bands. **None has been tested.**
   The experiment that settles all of them is the same one: implement the mechanism clean-room, run the existing
   plan-metric harness over the output, and check the named band. **Until that is run, every ADOPT verdict here
   is a recommendation to try, not a claim about outcome.**
7. **I did not read our own code.** Every claim about what SettlementForge does comes from
   `map-corpus/docs/GENERATION-SPEC.md`, `PRIOR-ART-WATABOU.md`, the measured artefacts, and the ODQ. **Where I
   say a stage is PARTIAL or a gap exists, I am quoting the specification, not verifying the tree.** §9.2's
   question about partial street-web re-derivation is explicitly flagged as unverified for this reason.
8. **Two areas I deliberately did not pursue.** Whether FTG's internals derive from Watabou's code (§1.3 — not
   ours to answer, no bearing on our verdicts, and unanswerable from public evidence), and FTG's premium/free
   feature split (a paid-surface question, owner-gated, and it would not have changed a mechanism verdict).
9. **The corpus metrics I gated against are real and were checked.** Every metric named in a leg (b) was
   verified present in `map-corpus/docs/laneHFM1-corpus-measured.csv` (column header read),
   `MFS3a-planmetrics.json` (key list read, 49 records) or `MFS2-bands.json` (band structure read). **Where no
   metric exists I said so and named the missing instrument** — twice, at §5.3 and §11.4.
