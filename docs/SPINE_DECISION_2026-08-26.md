# THE SPINE DECISION — re-founding the map builder on the partition-first base

**Chair-compiled for the owner, 2026-08-26 (§667). This is the release gate for every
held map-code fix: one decision, stated plainly, with its evidence, its plan, and its
costs. Nothing below builds until you say go.**

**Provenance (§685):** seat **RECOVERED as Fable 5** from the commit trailers of both
commits touching this file (the §685.5(ii) route) — recovered, not text-marked at the
time.

## 1 · The decision being asked

Rebuild the map builder's *skeleton* on the model you named (§656): the settlement as
**one partition** — wards/blocks as the pieces, streets as the gaps between pieces, the
wall as the wrap around them, crossings as their own typed edges — with everything
drawn being a *view* of that one structure. Our truth layer feeds the partition;
our proven dress vocabularies clothe it; the growth ledger gives it time.

The alternative — patching the current stroke-stack through the ~14 fix cars — repairs
eighteen symptoms while leaving their common cause in place, and the audit's history
says new symptoms will keep surfacing at the same rate we fix old ones.

## 2 · The evidence (every line measured this week)

**Our current builder violates its own laws structurally, not incidentally:**
237 building footprints cross wall lines; 42.4% of wall-adjacent buildings violate
tangential-or-clear; road wash crosses rivers on six leaves; 97.4% of drawn-river area
is scored as dry land by the ground law; the year leaves draw a false history
(parcel-identical at year 0 and 191); the elegant tell — *relict* rings are perfectly
obeyed while *standing* rings are ignored — proves the defect lives in generation
order, not in any painter.

**The reference base works the way we ruled before we ever read it:**
- MFCG's live model is `Topology` + wards + `Grower` classes on one side and literal
  `*View`/`*Painter` classes on the other — the §652 topology–paint contract as
  shipped architecture (§658).
- A whole city page is ~700 polygons and THREE style constants; 6,481 buildings at
  metropolis scale keep the *same* size band as 616 at town scale — scale changes
  count, never character (§663–664).
- Bridges are `planks`: two-point edges between banks — §651's owner-ruled crossing
  topology as literal data (§664).
- The village model exports `extendable` growth-frontier points; FTG's config tree
  models layout as sequential growth stages with `placeWallAfter` — both references
  strain toward the growth model only we can complete, because only we carry real
  history (§665–666).
- FTG generates fully client-side on 8 parallel workers and stores a *recipe*, not
  data — derivation-not-storage, THE PROMISE's own shape, at our closest competitor
  (§666).

## 3 · What the spine is, concretely, for our code

One new structure at the heart of the fabric: **the PARTITION** — a planar subdivision
of the settled ground into wards/blocks/plots whose edges *are* the street network,
whose boundary *is* the wall trace, and whose water edges *are* the banks, with
crossings (bridge/ford/ferry) as typed edges joining bank nodes. Built per growth-ledger
epoch (the ledger writes partition deltas; REG-GROW-A's stood-down kernel slots in
unchanged). The renderer becomes views of the partition — it *cannot* draw a road over
a river or a wall over a ward, because there is no such object to draw.

**The page becomes a disciplined projection** (§663's quantified lesson): page register
serves hundreds of shapes from the partition — building masses in a tight size band,
arterials only, the wrap, the crossings — with our full truth surfacing through the
zoom ladder, which is what the register architecture always intended.

## 4 · What survives untouched (most of the estate)

The truth layer and engine (all of it — the partition CONSUMES truth, replacing only
derived geometry) · every dress vocabulary that passed a judge (roof grammar, shape
families, V-B13, V-QUAY, rampart, fossils, detail-register bindings) · the growth
ledger architecture + its panel rulings (the ledger's plot-deltas become partition
deltas — a rename, not a redesign) · every instrument and census (they gain a simpler
target) · the film/Chronicle design · all signed constants · the catalog, DW, AD, and
web programs (untouched by any of this).

## 5 · The plan if you say go

1. **SPINE-ARCH** (chair, ~a day): the partition architecture doc in the
   DESIGN_REG_GROW pattern — five-skeptic panel before a line of build.
2. **SPINE-1** (Opus): the partition structure + street-as-edges + wall-as-wrap on the
   existing fabric inputs, dormant-flagged, with the i12/tangential + crossing censuses
   as its exits (they must go to ZERO with live controls).
3. **SPINE-2**: crossings as typed edges (planks), water banks as partition edges —
   kills the river/wash/quay defect family; WSEAM ratchet proves it.
4. **REG-GROW-A resumes** on the partition (its ledger was built for this shape).
5. **The held fix cars re-base**: most shrink to nothing (their defect class is
   unrepresentable); the survivors (scenario weight, port atlas, relief grammar,
   fabric ink) become dress cars on an honest skeleton — the REG-6 paint rebuild.
6. Registers/zoom, judging, decline, film — the existing arc, on the new spine.

## 6 · Costs and risks, honestly

- The fabric's geometry core (streets/parcels/blocks derivation) is REPLACED, not
  patched — the largest single change of the program. Mitigated by: dormant-flag
  discipline (the shipped painter never wavers), the sealed-wave ritual, and the
  instrument suite that now REDS on every defect class this exists to kill.
- Same-seed maps change substantially when the spine arms — a declared shift of the
  dormant core, nothing shipped moves. The cutover remains yours alone.
- REG-1..5's *geometry* work is partly superseded (their vocabularies and instruments
  all survive; some sandbox geometry code retires young). Sunk cost, honestly named:
  those waves also produced the censuses and laws that make the spine buildable.
- Timeline: the spine block is roughly the size of the six conformance cars it
  replaces. Estimate: SPINE-ARCH + panel + SPINE-1/2 ≈ the effort REG-3+REG-4 took;
  the re-based dress work after is smaller than the held plan was.

## 7 · What I need from you

One word on the direction — **go / hold / modify** — and two standing confirmations if
go: (a) the §654 stop converts into the spine plan above as the released arc; (b) the
cutover and every push remain yours, unchanged. Everything else is within the standing
delegation and will be recorded vetoably as always.

## 8 · Licensing note (added §668, before your decision)

TownGeneratorOS is **GPL-3.0** (verified from the repository). That changes nothing
about the plan's substance and everything about its discipline: we do **not** read or
port that repository's code — deriving from GPL source would encumber the product.
Everything in this package already comes from the clean route: **observed behavior and
exported data of the live applications** (class names, JSON models, censuses — facts,
not expression) plus our own prior laws, and the partition/Voronoi-ward/streets-as-edges
IDEAS are decades-old published procgen techniques, unencumbered. The spine will be an
independent implementation from an ideas-level spec. The residual question — formal
comfort that the boundary is adequate — joins your standing LEGAL docket; my
conservative ruling (observation-only, no code reading by anyone who writes spine code)
binds meanwhile.
