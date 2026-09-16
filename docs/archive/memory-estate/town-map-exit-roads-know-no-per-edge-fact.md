---
name: town-map-exit-roads-know-no-per-edge-fact
description: "⛔ A town-map exit road is {id,from,to,weight} and NOTHING else — the compass bearing is a layout-planner RETRY COUNTER, so labelling a road \"north\" invents geography; two ruling cases were REFUSED on this"
metadata: 
  node_type: memory
  type: measurement + refusal
  created: 2026-08-11
  lane: exit-road labelling (Opus repair lane)
  measured_at: 73f00920
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T12:50:24.328Z
---

MEASURED 2026-08-11 while implementing an owner-approved ruling on how exit roads are
labelled when a settlement has no linked neighbour. **Two of the ruling's four cases were
REFUSED FORWARD on measurement and nothing was built for them.** Re-read this before any
future attempt to put a direction, a road type, or a relationship on a town-map exit.

## What a town-map road edge GENUINELY carries — the whole list

`TownMapRoad` is `{ id, from, to, weight }` (`src/domain/townMap/townMapModel.js:190-195`).
Executed probe over 8 configurations (layout law v1 and v2 × four settlement shapes) printed
`keys=[id,from,to,weight]` for **every** road and `DISTINCT weights across roads: 1` in **all
8**. So:

- `weight` is ONE settlement-wide value from `mapProfile.outputs.roadImportance`
  (`ROAD_WEIGHT`, `townMapModel.js:96`) — identical on every road of a map, therefore carries
  **zero** per-edge information.
- `id` is a positional index, `road.${i}`.
- `from`/`to` are geometry. **There is no direction field, no type, no name, no destination.**

⛔ **THE BEARING IS A RENDER ARTIFACT, NOT GEOGRAPHY.** Gates are an even compass fan whose
offset is the layout planner's **RETRY COUNTER** — `townLayoutV2.js:489`
(`(Math.round((i * 16) / roadCount) + attempt) % 16`), with the comment at `:484-485` saying
so outright. Measured consequence: the SAME settlement's `road.0` leaves `from=[500,0]` (due
north) under v2 and `from=[690,40]` (NNE) under v1. Printing "north" asserts a survey fact the
sim does not hold, and would REVERSE the honesty boundary already written at
`src/components/townMap/edgeAnnotations.js:29-35`.

⚠ `src/lib/roadNetwork.js` is a **disjoint second road system** (9 fields incl. `tier`
highway/trade/lane) that **never reaches the town map** — traced import-by-import; it feeds
only the world-map `RoadsLayer.jsx`. Do not raid it for exit-road facts.

## Why "relationship without a name" is UNREACHABLE, not merely empty

`config.neighborRelationship` is written **only** when a neighbour is bound, and it always
carries that neighbour's name (`src/generators/steps/resolveNeighbour.js:54-59`). The only
independent relationship input, `neighbourRelType`, is **WRITER-LESS BY DESIGN** since R-5b
retired its picker — `src/store/neighbourSlice.js:60-77` says so in prose and grep confirms
the sole assignment is the slice's own initial `'neutral'`. So no product state exists with a
relationship and no name; that branch would have been **a reader with no writer, built to
satisfy a rule against building readers with no writers.**

## What DOES have a live writer (so case 1 genuinely matters)

`neighbourNetwork` — the DM's manual link (`src/components/SettlementsPanel.jsx:406`) and
`applyWorldPulseRelationshipGraph.js:224`. That path works and must not be regressed.

## The one real bearing that exists anywhere

`mapState.placements[].x/y` (`src/store/mapSlice.js:361-366`) are genuine DM world-map
coordinates, so `atan2` between two is a real fact **about a canonized campaign map only** —
undefined for unplaced settlements, and meaningless for un-dragged instant worlds
(`worldPlan.js:126-130` calls those coordinates cosmetic). ⚠ Prior art already ruled here:
`src/domain/spatialSubstrateRead.js:215-217` records the war layer wanting a realm bearing,
finding the inputs absent, and shipping a **hash octant** instead. Any bearing feature
re-litigates that call.

## How to apply

If a brief asks for a direction or a road type per exit, **REFUSE FORWARD with this
measurement**. The honest degradation the ruling already accepts is case 4 — HIDE the section
— and that was **already correct** at 73f00920 (`SettlementMapNotes.jsx:74` and `:82`), so the
premise "the section renders empty" is false; it rendered nothing.

Related: [[rendered-surface-negative-has-a-second-vacuity]], [[typecheck-red-root-cause-and-reader-without-writer-class]].
