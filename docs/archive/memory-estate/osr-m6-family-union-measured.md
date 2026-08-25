---
name: osr-m6-family-union-measured
description: "⭐⭐ M6 SIBLING-SLICE POVERTY MEASURED AND SAFE (Opus schema-4 lane, 2026-08-10, computed over the 2,196 HEAD findings + the 1,321-shape corpus dump): a family-union binding erases ZERO of the 23 triaged TRUE POSITIVES at every threshold tested, and at 0.80 containment clears 122 findings (5.6%) of which 76 are triaged DETECTOR ARTIFACTS; only 4 of 58 bound shapes have a non-empty family, so it is surgical not blanket; ⚠⚠ it CANNOT be implemented inside the byte-frozen heuristic detector — post-filter or new governed detector only"
metadata:
  type: project
  date: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T23:54:41.565Z
---

## The question

The heuristic leg binds the THINNEST sibling slice of a record family (`outcome`
756 rows / 48 keys vs `candidates` 3,675 / 101), so reads of family-wide keys red.
The standing law for this instrument is UNION NEVER INTERSECTION. What does a
family-union binding do to the finding set?

## The definition measured

`family(S)` = every other observed shape `T` whose key set covers ≥ θ of `keys(S)`,
guarded by a minimum `|keys(S)|` so a 2-key shape is not trivially contained.
The union binding judges a read against `keys(S) ∪ keys(family(S))`.

Computed from the refusal lane's corpus dump (1,321 shapes) and the 2,196 findings
at HEAD `7699e367`, joined to the 171-row triage classification.

| variant | findings after | cleared | cleared class (c) | **class (a) ERASED** |
|---|---|---|---|---|
| θ=1.00, no size guard | 2,142 | 54 (2.5%) | 7 | **0** |
| θ=1.00, \|keys(S)\|≥8 | 2,160 | 36 (1.6%) | 7 | **0** |
| θ=0.90, \|keys(S)\|≥8 | 2,146 | 50 (2.3%) | 10 | **0** |
| **θ=0.80, \|keys(S)\|≥8** | **2,074** | **122 (5.6%)** | **76** | **0** |

Baseline finding population by triage: a=29 sites (the 23 identities), b=42, c=207,
untriaged=1,918 (pre-existing frozen rows).

## Where it bites — only four shapes have a family at all

| bound shape | rows/keys | family | findings | cleared |
|---|---|---|---|---|
| `outcome` | 756 / 48 | autoApplied[111], candidates[101], selected[121] → union 141 | 101 | 50 |
| `stressors` | 162 / 33 | autoApplied, candidates, resolvedStressors, selected, stressor → union 146 | 108 | **72 (66 class-c)** |
| `activeConditions` | 149 / 11 | condition[13] | 2 | 0 |
| `stress` | 78 / 8 | stressors[33] | 10 | 0 |

54 of the 58 bound shapes have an EMPTY family, so the union changes nothing for
them. This is a surgical correction of a named instrument mechanism, not a
weakening of the walker.

## ⚠⚠ The implementation constraint (executed)

`legacy-reader-shape-scan.mjs` is byte-frozen: `assertGovernedLegacyDetectorSource`
reconstructs git blob `0310fa9f…` and admits exactly one enrichment. Appending a
single comment line was REFUSED in a live run. So the union must be a POST-FILTER
over emitted findings (outside the frozen module) or a new governed detector
version with its own blob pin — never an edit to the detector.

## How to apply

Zero true positives lost at any threshold is the load-bearing number: the union is
safe in the direction that matters. The residual risk is the opposite one — a
FUTURE true positive whose key happens to live on a family sibling would be
suppressed. Mitigate by recording `family(S)` in the artifact so a suppressed row
is queryable rather than invisible.

Scripts: `scratchpad/osr4-m6-measure.cjs`, `osr4-m6-detail.cjs`; outputs
`osr4-m6-result.txt`, `osr4-m6-detail.txt`.

Related: [[osr-heuristic-leg-detector-mechanisms]] · [[osr-schema4-mint-sizing-and-blockers]] ·
[[osr-171-growth-rows-triaged]].
