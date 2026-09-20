# FIX-G1 — MEASUREMENT: a viability summary that counts six dependencies beside a list of five

**Lane:** RECON-G (Opus recon; read + plain `node` only; nothing edited, staged or committed anywhere).
**Tree read:** `$SP/read-tip-58fcfe614`, detached at `58fcfe614`, `git status --short` empty before and after.
**Holds at the build tip:** `git diff --stat 58fcfe614 fixes-2026-09-18-consist -- src tests/fixtures tests/helpers` is EMPTY — only six docs files moved between the two. Every fact below holds at `76be138a1`.
**Generation:** ONE run, 525 rows, 8.0 s wall, cached to `g-525.json`; every number below is read from that cache.

---

## OUTCOME

The defect is **REAL at this tip and reproduces exactly**. It is a **pre-existing generator inconsistency**, not a merge artefact, and it is **rarer than feared: exactly 1 of 525 golden-corpus rows** disagrees in *any* `V-SUMMARY-*` count. The cause is a single expression that counts a **different population** from the one it publishes. The smallest cure is one line at one site; it re-records **1 of 525** generator-golden hashes and **0 of 1050** dossier-prose-manifest rows.

In plain words a DM would recognise: the Viability page's headline sentence says the town has **six** things it depends on. The list underneath it has **five**. The sixth is real — it is sitting one collection over, filed as a *problem* rather than as a *dependency*, under the heading "Severe Food Import Dependency". Nothing is invented and nothing is lost; the sentence is counting two drawers and the list is showing one.

---

## 1. Reproduced at this tip — CONFIRMED

`node g-measure.mjs 525` then `node g-part2.mjs 525`:

```
1. THE CONVICTED ROW
   key   = town|germanic|mountain|mountain_pass|civilized|golden-master-v3
   name  = Schwarzwalde
   summary = "✓ VIABLE: Settlement can survive but has 6 operational dependencies that require active management. 2 plot hooks available."
   dependencies.length = 5   metrics.dependencyCount = 5
   warnings.length     = 1  metrics.warningCount    = 1
   issues.length       = 1 metrics.criticalIssueCount = 0
   plotHooks.length    = 2  suggestions.length = 0
   issue severities    = ["dependency"]
   DEPENDENCY-severity rows sitting in `issues` (counted by the sentence, absent from the list):
      • "Severe Food Import Dependency"  [Food Production]
```

The `V-SUMMARY-DEPS` check of `tools/rederive-prototype-3/invariants.mjs` fails on this row and this row alone.

## 2. The two producers, by symbol — CONFIRMED

Both live in `/…/read-tip-58fcfe614/src/generators/economy/viability.js`, twelve lines apart at the end of `generateEconomicViability`.

**The sentence's counter** — `buildViabilitySummary`, line 82:

```js
const dependencyCount = [...issues, ...warnings].filter((i) => i.severity === SEVERITY.DEPENDENCY).length;
```

**The list that is published** — line 561 and 568:

```js
const dependencyWarnings = warnings.filter((w) => w.severity === SEVERITY.DEPENDENCY);
…
dependencies: sortBySeverity(dependencyWarnings), // supply chain notes (informational)
```

So the sentence counts DEPENDENCY-severity rows across **`issues` ∪ `warnings`**; the list is DEPENDENCY-severity rows from **`warnings` alone**. Every DEPENDENCY-severity row that a deriver pushed into `issues` is counted by the sentence and never appears in the list.

**Which one is right:** the **list** is. It is the collection the reader can see, it is what the record's own second counter reports (`metrics.dependencyCount = dependencyWarnings.length`, line 586), and that second counter agrees with the list on **525/525** rows. The sentence's counter is the odd one out — it is the only one of the three that reads a population the record never publishes under that name.

Not a de-duplication and not a cap: no title is dropped and nothing is truncated. The `MAX_CHAIN_SUGGESTIONS = 3` cap (line 75) is on suggestion *text*, not on this list.

**Who pushes a DEPENDENCY into `issues`:** `src/generators/economy/foodBalance.js` lines 369 and 382 — "Heavy Food Import Dependency" (road route) and "Severe Food Import Dependency" (any other connected route), both on the `deficitPercent > 40` arm. Every other DEPENDENCY-severity producer in the tree pushes into `warnings` (`foodBalance.js` 415/603/615/626/694; `viability.js` 212/298/316/426), which is why the corpus turns up only one offender.

## 3. Frequency over the full 525-row corpus — CONFIRMED

```
2. THE V-SUMMARY-* FAMILY over 525 rows
   V-SUMMARY-DEPS  sentence says N operational dependencies vs dependencies.length
       rows whose summary states the count : 370
       rows where it DISAGREES             : 1   (0.2% of the corpus, 0.3% of the rows that state it)
   V-SUMMARY-HOOKS sentence says N plot hooks vs plotHooks.length
       states / disagrees                  : 370 / 0
   critical-issue count in the NOT VIABLE sentence vs metrics.criticalIssueCount
       states / disagrees                  : 60 / 0
   rows disagreeing in ANY summary count   : 1/525
   summaries naming "warning": 0   naming "suggestion": 0
```

- **Dependencies: 1 of 525.** **Plot hooks: 0 of 525.** **Critical issues: 0 of 525.**
- **Warnings and suggestions: not measurable as a summary count, because the sentence never states one.** All six `buildViabilitySummary` return arms were read and all 525 produced summaries were searched: none names a warning count or a suggestion count. There is no `V-SUMMARY-WARN` or `V-SUMMARY-SUGG` to fail.
- The overstatement is always exactly **+1**, and **every overstatement equals the DEPENDENCY-severity rows in `issues`** — the gap is fully explained, with no residue.
- By tier: town 1/105; thorp, hamlet, village, city, metropolis all 0.
- The record's other two counters are clean: `metrics.dependencyCount != dependencies.length` on **0/525**; `metrics.warningCount != warnings.length` on **0/525**.

**Why only one row.** The offending arm needs `deficitPercent > 40` on a route that is neither disconnected nor `road` — `mountain_pass` is one of exactly two such routes, and the corpus reaches `mountain_pass` on a single row. The narrowness is a property of the corpus, not of the bug: any real settlement on a river/port/crossroads/mountain_pass route with a >40 % uncovered deficit hits it.

## 4. The smallest cure, and what it MOVES

**The cure:** count from the published list at ONE site. In `viability.js`, pass the already-computed `dependencyWarnings` (or its length) into `buildViabilitySummary` instead of letting it re-derive from `[...issues, ...warnings]`. One argument, one expression. The ordering constraint is trivial — `dependencyWarnings` is computed at line 561, the summary is built at line 575.

⚠ **The line 571–574 comment is about a different thing and must not be read as a veto.** It says the summary must see dependency warnings *as well as* structural ones, so a food-import dependency is not contradicted by a "self-sufficient" headline. Counting from `dependencyWarnings` honours that exactly — it is the `...issues` term, not the `...warnings` term, that is wrong.

**What moves:**

| Surface | Moves? | Count | Evidence |
|---|---|---|---|
| `tests/fixtures/generator-golden-master.json` | **YES** | **1 of 525** | the golden is `sha256(JSON.stringify(generateSettlementPipeline(cfg)))` per key (`tests/property/generatorGoldenMaster.test.js:796-799`) — the whole record, so the summary string is inside every hash. Exactly one record's summary string changes. |
| `tests/fixtures/dossier-prose-manifest-golden.json` | **NO** | **0 of 1050** | DS-GEN-11 is the only block reading `economicViability.summary`, and its pool keys are `viabilityVerdictPoolKey(viable)`, `criticalIssuePoolKey(criticalIssueCount)` and `'THE FIRST-SURVEY QUALIFICATION'` (`generalStateProse.js:2017-2019`). The dependency count selects no cell. The manifest carries 525 `::dm` + 525 `::player` rows; none is keyed on it. |
| Printed prose on screen | **YES, one town** | one word | the sentence is rendered verbatim by `ViabilityTab.jsx:80-81` (prefix stripped) and by the PDF (`pdf/lib/viewModel.js:83`, `pdf/lib/headlines.js:169`, `pdf/sections/ViabilityAssessment.jsx:63`). |
| The AI narrative context | **YES, one town** | one word | `supabase/functions/generate-narrative/prompts.ts:230, 775, 791, 958` pass the summary to the model. |
| **A saved world** | **NO — the old sentence SURVIVES** | every existing save | `src/lib/saves.js:470` stores `data: settlement`, the whole record verbatim; load runs `migrateSettlementShape`, never a regeneration. A DM whose saved Schwarzwalde reads "6 operational dependencies" keeps reading "6" after the fix, forever, unless a migration rewrites it. |
| **A DM's own edit** | **untouched, by design** | — | `economicViability.summary` is a DM-editable prose path (`src/domain/userEdits.js:109`, `src/store/settlementPendingEdits.js:81`, labelled "Outlook summary" in `src/components/dossier/proseFieldLabels.js:43`). A DM who rewrote it keeps their text. |

## 5. The before/after sentence the owner is being asked to sign

Town: **Schwarzwalde**, `town|germanic|mountain|mountain_pass|civilized|golden-master-v3`.

> **BEFORE:** ✓ VIABLE: Settlement can survive but has **6** operational dependencies that require active management. 2 plot hooks available.
>
> **AFTER:** ✓ VIABLE: Settlement can survive but has **5** operational dependencies that require active management. 2 plot hooks available.

One digit, on one town, in one golden row. The list it now agrees with is unchanged; the sixth item stays exactly where it is, in the issues collection, under its own title.

**Golden rows that re-record: 1** (`town|germanic|mountain|mountain_pass|civilized|golden-master-v3`).
**Prose-manifest rows that re-record: 0.**

## What I could not measure, and what would settle it

- **Off-corpus frequency.** The 525-row corpus reaches `mountain_pass` once. I did not sweep beyond the corpus, so I cannot say how often a *player's* settlement hits the arm. A bounded sweep over river/port/crossroads/mountain_pass × high-deficit terrain would settle it, and is cheap (≈8 s per 525 rows on this machine).
- **Whether the owner wants the sixth item MOVED rather than un-counted.** An equally small cure is to route the two `foodBalance.js` DEPENDENCY pushes into `warnings` instead of `issues`, which would make the list read 6 and the sentence stay at 6. That moves the same 1 golden hash but also moves that row's `issues`/`dependencies` arrays, and the item changes which collection a DM finds it in. I measured the un-counting cure because the brief named it; the re-filing cure is the owner's alternative and I have not priced its display effects.

---
*Measured by RECON-G, 2026-09-19, at `58fcfe614`. Scripts and cached corpus in this directory: `g-measure.mjs`, `g-part2.mjs`, `g-525.json`.*
