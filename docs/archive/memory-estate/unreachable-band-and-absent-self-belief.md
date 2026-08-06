---
name: unreachable-band-and-absent-self-belief
description: "⚠️⚠️ THREE DEAD-LEG SHAPES that all read as correct code: a RATIO band on `theoreticalCapacity` can never open (max expressible ratio is 1.50 — use a POINTS GAP); `beliefRecord(x, x)` is NEVER written so any self-belief fallback IS the only path; and a band over `hopWeeks` must sit inside 2..8 because the spatial digest CALIBRATES weeks-per-cost per realm (a bigger map buys longer weeks, not more of them)"
metadata:
  node_type: memory
  type: project
  modified: 2026-08-03T23:52:08.610Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

Two defects from lane W8-C (@ `49e8fd23` + `ab71f940`). Both are **dead legs that
read as correct code** — one always-false, one always-constant — and neither is
visible to a test that only exercises the live side.

## ⚠️⚠️ 1. RATIO BANDS ON `theoreticalCapacity` ARE STRUCTURALLY UNREACHABLE

`deriveMilitaryCapacity(...).theoreticalCapacity` (`militaryStrength.js`) is a
deliberately **compressed 0..100 model with a very high floor**. Measured:

| settlement | theoreticalCapacity |
|---|---|
| hamlet, pop 10 | 42.0 |
| town, pop 40 | 50.2 |
| village, pop 400 | 48.1 |
| town, pop 12,000 | 54.1 |
| city, pop 30,000 | 58.3 |
| metropolis, pop 100,000 | 62.8 |

**THE LARGEST RATIO EXPRESSIBLE ANYWHERE IN THE MODEL IS 1.50** — a metropolis of
a million over a hamlet of one. Any band phrased as "N times the defender's
capacity" for N > 1.5 is a band **nothing can ever enter**, and it looks strict
while doing nothing.

The tree already contained this exact mistake and half-admits it:
`feasibilityGate.PLAUSIBLE_CEILING = 4.0` is the war layer's own "overwhelming"
ratio, carrying the comment *"(documentation only — the band is open-topped above
the floor)"*. The working feasibility bands are all **below 1** (`PLAUSIBLE_FLOOR`
0.78, `HARASSMENT_FLOOR` 0.55, `AUTO_FAIL_CEILING` 0.32) precisely because that is
where the reachable range lives.

**THE CURE: use a POINTS GAP, not a ratio.** The gap spans 0.19 (two peer towns)
to 20.8 (metropolis over hamlet) and orders pairs the way a reader would.
`conquestExecution.CONQUEST_EXECUTION_TUNING` uses `OVERWHELMING_GAP: 12` /
`CLEARLY_WINNING_GAP: 5`, calibrated off that spread.

**HOW TO APPLY.** Before writing ANY band over an engine scalar, print the
scalar's real spread across real fixtures first. Then pin the band's
**reachability** from real inputs through the real model — an executed assertion
that both open bands are actually entered, not just that the comparison works on
hand-picked numbers. `conquestExecutionWr8.test.js` has the pattern (`⭐⭐ THE
GATE IS REACHABLE`), including a guard that the widest expressible ratio is < 2.

**SIBLING TRAP IN THE SAME FUNCTION:** `Number(null) === 0`. A `Number(x)`
coercion collapses *not read* into *zero*, and where zero is the extreme reading
(a capacity of 0 is a ruin ⇒ overwhelmed) this hands the **strongest** verdict to
the case with the **least** evidence. Check number-ness on the RAW value before
any coercion.

## ⚠️⚠️ 2. `beliefRecord(observer, observer)` IS NEVER WRITTEN

`advanceBeliefMaps` (`beliefMap.js`) seeds cold-start and reconciles per
`relationshipNeighbourhood(snapshot, worldState)`, whose subject set is an
observer's **NEIGHBOURS** — it never contains the observer. So **no generated
world has ever held a self-record**, and any code shaped like

```js
const own = Number(asObject(beliefRecord(ws, me, me)).strengthBand);
const ownIndex = Number.isInteger(own) ? own : 2;   // ← this IS the only path
```

is a **constant**, in every world, forever. Test fixtures that hand-seed
`beliefMaps[me].seat[me]` hide it completely — that is exactly how it shipped.

**THE ESTABLISHED DOCTRINE (use it):** self-strength is a TRUTH read. K3 fences a
court from OTHERS' truth and has always taken a court's knowledge of ITSELF as
ground (the §IV.4 carve-out). `settlementStrategy.makeBeliefStrengthFor` already
routes SELF to truth, and `readBeliefStrength` returns `truthStrength` for
`source === 'self'`. The canonical pair is
`strengthBandOf(settlementStrength(item, buildPressureSummary(idx, id)))` — the
exact pair `groundTruthBelief` uses, so own band and rival band land on ONE
ladder measured by ONE instrument.

⚠️ Writing self-records INTO `beliefMaps` instead is **owner-gated**: it changes a
persisted ledger's shape on a writer no feature flag gates, so every fogged
world's belief goldens shift whether or not the consuming feature ever lights.

**HOW TO APPLY.** For any leg that has a fallback: delete the primary and see
whether any pin reds. If none does, the fallback is the path. Pin the repaired
leg **through the assembler** (the row the composite eats), never through the
reader alone — a mutant restoring the constant inside the assembler left a
direct-reader pin green here, which is the same producer-vs-consumer vacuity the
WF lane hit one wave earlier.

## ⚠️⚠️ 3. A BAND OVER `hopWeeks` IS BOUNDED BY CALIBRATION, NOT BY THE MAP (2026-08-04, WR-10)

Third instance of the same class, found in lane WR-10 (@ `03b8ecde`) BEFORE it
shipped, and only because the leg-2 fixture refused to fail.

`sovereigntyReach.js` bands "reinforcement reach within an army-transit leg band"
as `armyMarchWeeks(hopWeeks(digest, a, b, season), readiness01) <=
MAX_REINFORCEMENT_WEEKS`. The band was first set to **12**, reasoning down from
`ARMY_TRANSIT_TUNING.MAX_MARCH_WEEKS = 52` (`src/domain/spatial/armyTransit.js`).
**12 IS DEAD.** `hopWeeks` (`src/domain/spatial/distanceRead.js:708`) does not
return a distance — it returns `pathCost × weeksPerCost`, and `weeksPerCost` is
CALIBRATED PER DIGEST. Measured over every ordered pair of a 20-seat 48x36 realm,
the entire world spans five rungs at neutral readiness:

    2w: 54 pairs   3w: 58   5w: 47   6w: 26   8w: 5

So any band ≥ 9 admits every pair in every realm and refuses nothing, forever.
**Enlarging the map does not help** — that is what calibration is for: a bigger
world gets longer weeks, not more of them. Landed value is **5**.

⚠️ **THE FIXTURE TRAP THAT HID IT, and it inverts your intuition.** A digest's
calibration is derived from the placements it was BUILT with, so
`buildSpatialDigest` over THREE settlements normalizes those three to be
neighbours however far apart their cells sit. Moving a 3-placement fixture's ends
to opposite corners produces a **SHORTER** march, not a longer one. A far-pair
fixture must carry a realm-sized placement set (20 seats in
`tests/domain/sovereigntyMarketReadsWr10.test.js`, `realmDigest(chainSeats)`) and
vary only WHICH seats the subjects occupy.

**HOW TO APPLY.** Identical to section 1: measure the scalar's real spread first,
then pin REACHABILITY FROM BOTH SIDES. The pin is `THE BAND IS LIVE FROM BOTH
SIDES — the dead-band cure, measured on a real digest` in
`tests/domain/sovereigntyMarketReadsWr10.test.js`: it sweeps every pair of a real
20-seat digest and asserts BOTH `inside > 0` and `outside > 0`. Restoring the
band to 12 reds two tests — verified by executed mutant, restored md5-exact.

Related: [[wr10-sovereignty-market-dark]].
