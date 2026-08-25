# Lane R-WATABOU-CODE — receipt (the honest trail)

**Lane:** R-WATABOU-CODE (Fable research seat), ODQ §673. **Date of all reads:
2026-08-25** (session began 2026-08-24 UTC-local rollover; every fetch below
executed 2026-08-25). **Product:** `research/draft-R-WATABOU-CODE.md`.

## Source read — github.com/watabou/TownGeneratorOS (GPL-3.0), branch master

Fetched via WebFetch against raw.githubusercontent.com/watabou/TownGeneratorOS/master/…
Tree enumerated first via the GitHub API (git/trees/master?recursive=1), 2026-08-25.

Read VERBATIM (full file transcribed into session context), 2026-08-25:

| file | study area |
|---|---|
| Source/com/watabou/towngenerator/building/Model.hx | seeding, relaxation, junction weld, wall order, streets, ward assignment, countryside |
| Source/com/watabou/towngenerator/building/Patch.hx | piece structure |
| Source/com/watabou/towngenerator/building/Topology.hx | street graph, blocked vertices, inner/outer sets |
| Source/com/watabou/towngenerator/building/CurtainWall.hx | circuit, smoothing, gates, decimation, gate-road split, towers |
| Source/com/watabou/towngenerator/building/Cutter.hx | bisect/radial/semi-radial/ring cuts |
| Source/com/watabou/towngenerator/wards/Ward.hx | block inset, recursive subdivision, ortho building, fringe filter, width constants |
| Source/com/watabou/towngenerator/wards/CommonWard.hx | parameterized ward geometry |
| Source/com/watabou/towngenerator/wards/CraftsmenWard.hx | parameters |
| Source/com/watabou/towngenerator/wards/MerchantWard.hx | parameters + scorer |
| Source/com/watabou/towngenerator/wards/PatriciateWard.hx | parameters + social scorer |
| Source/com/watabou/towngenerator/wards/Slum.hx | parameters + scorer |
| Source/com/watabou/towngenerator/wards/AdministrationWard.hx | parameters + scorer |
| Source/com/watabou/towngenerator/wards/MilitaryWard.hx | parameters + scorer |
| Source/com/watabou/towngenerator/wards/GateWard.hx | parameters |
| Source/com/watabou/towngenerator/wards/Market.hx | plaza furniture + scorer |
| Source/com/watabou/towngenerator/wards/Castle.hx | citadel wall + monumental recursion |
| Source/com/watabou/towngenerator/wards/Cathedral.hx | cloister/ortho alternative + scorer |
| Source/com/watabou/towngenerator/wards/Farm.hx | farmhouse cluster |
| Source/com/watabou/towngenerator/wards/Park.hx | radial groves |
| Source/com/watabou/geom/Voronoi.hx | Bowyer–Watson insertion, frame, partition, Lloyd relax |
| Source/com/watabou/geom/Graph.hx | shortest-path search (FIFO frontier, no heuristic) |
| Source/com/watabou/geom/GeomUtils.hx | intersection/interpolation/distance-to-line |
| Source/com/watabou/utils/Random.hx | LCG (48271 mod 2³¹−1), Bates-3 normal, fuzzy |
| Source/com/watabou/towngenerator/mapping/CityMap.hx | draw order, road/wall/gate/tower rendering |
| Source/com/watabou/towngenerator/mapping/Brush.hx | stroke constants (0.3 / 1.8 / 0.15) |

Read PARTIALLY (targeted verbatim extraction of named members; full-file
transcription was twice returned as summary by the fetch layer), 2026-08-25:

| file | members read verbatim |
|---|---|
| Source/com/watabou/geom/Polygon.hx | area/perimeter/compactness/center/centroid getters; vertex smoothing (single + uniform); inverse-distance interpolation; edge inset; shrink/shrinkEq; self-intersection-resolving buffer; peel; cut (with gap); split; vertex distance. Plus a whole-file summary listing the remaining members (bounds, borders, contains, simplify, short-edge filter, rect/regular/circle factories). |

NOT read (judged non-generative after the chain closed): Main.hx, TownScene.hx,
StateManager.hx, PatchView.hx, Palette.hx, ui/*, coogee/* (engine shell),
utils extenders (Array/Point/Graphics/Float/DisplayObject), MarkovChain, MathUtils,
NullUtils, ObjectPool, Observable, PerlinNoise, PixelCache, Stopwatch, StringUtils,
Updater, Spline.hx, Circle.hx, project.xml, README.md.

**Chain-closure argument:** the model's build sequence calls exactly six stages
(patches, junction optimization, walls, streets, wards, geometry); every function
those stages reach lives in the files read above. Therefore the "no coherent
noise in the generative chain" claim is CONFIRMED by coverage, not sampling —
the Perlin unit is never imported by any file in the chain.

## Our repo read (read-only), 2026-08-25

- /Users/cstokes/Desktop/settlement-engine/docs/DESIGN_SPINE.md (245 lines, body + A1)
- /Users/cstokes/Desktop/settlement-engine/docs/SPINE_DECISION_2026-08-26.md (120 lines)

## Dead ends and fetch-layer notes

- WebFetch's answering model twice returned prose summaries instead of
  transcription (CurtainWall.hx first attempt; Polygon.hx both whole-file
  attempts). Cure: re-prompt with an explicit transcribe-only instruction
  (worked for CurtainWall), or targeted member-list extraction (Polygon).
- The GitHub tree API listing was clean on the first call; no pagination needed
  (75 entries).
- The studied repo has **no water anywhere**: a water-body list is declared on the
  model and never assigned; no bank/quay/bridge code exists. The live web app's
  water machinery is NOT in this codebase — noted in the dossier scope note so
  nobody hunts here for §3e/§648 material.
- Minor transcription artifacts observed in fetched code (e.g. one obviously
  truncated variable update inside the vertex-distance function) were treated as
  fetch noise, not source truth; no dossier claim rests on them.
- The two spine documents are dated 2026-08-26 (tomorrow) — authored ahead under
  the §667/§669 collections; treated as the current spine of record.

## Firewall attestation (§673.2)

**No expression was copied.** The dossier contains: algorithms restated in our own
words and mathematics; one pseudocode block in generic notation
(SUBDIVIDE/A_min/chaosG/chaosS/p_empty — invented labels, none shared with the
source); parameter ROLES with observed magnitudes; ward-kind names as English
domain words (also visible as the app's on-map labels), not as code identifiers.
It contains none of: copied lines, source variable/function/class identifiers used
as ours, source comments, or structure-for-structure transliteration. Where a
passage could only be conveyed by quoting (the deck's literal 36-entry order), the
dossier gives counts and consequences instead of the sequence. Source code was
read into session context only, for understanding, per the owner's §673 ruling;
none of it is written to any repo or scratchpad file.
