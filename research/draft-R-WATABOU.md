# R-WATABOU — the reference-base study (observational route)

**Chair-compiled 2026-08-26 under §656/§668. Supersedes the died lane's partial. Owner
taste-gates. Labeling per R-INST: CONFIRMED = fetched/observed this study with source
inline; PLAUSIBLE consumes nothing.**

## §0 · THE LICENSE, AND THE DISCIPLINE IT SETS (the chartered first act, discharged)
watabou/TownGeneratorOS is **GPL-3.0** (CONFIRMED, github.com/watabou/TownGeneratorOS;
"lacks some of the latest features" vs the live app, per its own README). RULING (§668):
**the repository's code is NOT read and NOT ported** — this study proceeds entirely by
the observational route: live-app behavior, exported data formats, and bundle-visible
class names are facts, not protected expression. The spine implements independently
from an ideas-level spec. Formal comfort → the owner's legal docket. The §656.3
"line-by-line repo study" clause is STRUCK as unnecessary and unsafe: the observations
below already carry the architecture.

## §1 · THE OBSERVED ARCHITECTURE (all CONFIRMED, captures in scratchpad dissect/)
1. **Model/View split as shipped code**: the live MFCG bundle's class paths —
   model.{Blueprint,City,Cell,Topology,District,DistrictBuilder,CurtainWall,Canal,
   Building,Landmark,UnitSystem,Grower(Docks,Park,Forester),blocks.Block/TwistedBlock,
   wards.*} vs mapping.{PatchView,RiverView,RoadsView,WallsView,BuildingPainter,
   FarmPainter}. One model, named views. (§658)
2. **The page is ~700 polygons + 3 constants** (mfcg-everrise-census.json): 616
   buildings (68% quads, mean 4.6 verts, tight area band 172–296), 4 roads, 2 wall
   polys (25-vert circuit), 8 named districts, 41 fields, 1 square, 1 keep;
   values = {roadWidth 8, towerRadius 7.6, wallThickness 7.6}. Buildings carry ZERO
   per-building semantics. (§663)
3. **Scale changes count, never character** (mfcg-grimfall-census.json): 6,481
   buildings at size-40 hold the SAME area band (161/212/275). (§664)
4. **Crossings are typed edges**: `planks` = 2-point LineStrings with width joining
   banks — §651's owner-ruled topology as literal reference data. City-scale river is
   ONE constant-width polyline (our width profile = justified-by-truth divergence). (§664)
5. **Register-scaled projection** (vg-stald-census.json): the village model exports 73
   lane LineStrings where the city exported 4 arterials; trees are POINTS; the village
   river is an AREA; `extendable` = 8 growth-frontier points EXPORTED. Config = a
   closed TAG vocabulary. (§665)
6. **FTG** (ftg-one-shot-findings.json): generation FULLY CLIENT-SIDE (8 parallel
   buildingGeometryWorkers, Three.js; zero API calls); storage = a regenerating RECIPE
   (localStorage ID + params; no IndexedDB) — derivation-not-storage; config tree
   models layout as SEQUENTIAL GROWTH STAGES with `placeWallAfter` per stage; closed
   crop vocabulary; D&D lifestyle ladder. (§666)

## §2 · THE MAPPING — divergence table (condensed; ODQ sections carry the full record)
CONVICTED (our divergence caused a measured defect class): separate stroke-stack
systems vs one partition → walls-over-districts (i12: 237 crossings, 42.4%
violations), streets-as-strokes → road-over-water (§650), two water truths (WSEAM
2.63% agreement), unreadable page density (25–30k bodies vs ~700 shapes).
JUSTIFIED-BY-TRUTH (our divergence stands): the river width profile (fords/narrows
need it; references don't); per-building semantics AT ZOOM (their zero-semantics is a
one-shot's luxury; our compendium/interiors need identity — but NOT at page register);
year-indexed growth (their frontier points and stages gesture at what only our ledger
completes); institution truth (their districts are names; ours are rosters — the port
failure was OUR roster gap, not a model gap).

## §3 · THE QUALITATIVE SWEEP — PARTIAL, honestly
The devlog/Patreon sweep died with the first lane (session limit). What the captures
independently establish: restraint as a design system (3 constants; near-bare squares;
tags not knobs). The written-word sweep remains OPEN as a small follow-up; nothing in
the spine decision depends on it.

## §4 · THE FIT PLAN
docs/SPINE_DECISION_2026-08-26.md IS the fit plan (§667), §8 carries the license
discipline. This dossier is its evidence annex.
