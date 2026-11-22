# PLACE-1 MEASURE 4: `economicViability.dependencies[]` and `warnings[].description` (the viability card)

Measured by a PLACE-1 MEASURE builder, 2026-11-20, on `place-1/viability-measure` cut from 29991fe90. Briefs: `BRIEF-MEASURE-COMMON.md`, `BRIEF-MEASURE-viability.md`, and the chair's rule of 16:25 UTC (prove each sub-field prints before measuring it). No file under `src/` or `tests/` was changed.

**The finding: no sentence of this field that is above the bar prints on any page.** The dependency rows print nowhere. The warning that repeats is the 'Trade Dependencies' note, and the page routes it away by its title. The summary also prints nowhere. Under the chair's rule, every sub-field that carries the sameness is DROPPED. So this file proposes no composer, and sections A to F are not written. The figures behind that ruling are below.

## 0. WHERE EACH SUB-FIELD PRINTS

**Command** (from the repository root, `node_modules` linked; the render takes about four minutes for eight towns):

```
node docs/chair/2026-11-20/content/tools/confinement/run.mjs <repo> <out> render --seeds=r2r-city-0,r2r-city-1,r2r-town-0,r2r-town-1,r2r-town-2,r2r-town-3,r2r-town-9,r2r-town-33 --workers=2
cd docs/chair/2026-11-20/content/place/tools/viability
node printed.mjs <repo> <out> r2r-city-0,r2r-city-1,r2r-town-0,r2r-town-1,r2r-town-2,r2r-town-3,r2r-town-9,r2r-town-33 > printed.out.txt
node scan-r2.mjs <repo> 40 > scan-r2.out.txt
```

- `run.mjs` renders through the real `OutputContainer` and walks every group, sub-tab and disclosure (the page census's `walkDossier`). That is the owner's DM view.
- `printed.mjs` births the same census rows (`configOf`, the same seed), takes every stored string of the card, and looks for each one whole in every rendered view.
- `scan-r2.mjs` found the two towns (9 and 33) that hold a warning other than the note, so the printed kind of row could be tested too.

| sub-field | strings | printed | where | ruling |
|---|---|---|---|---|
| `dependencies[].title` | 8 | **0** | nowhere | **DROPPED** |
| `dependencies[].description` | 8 | **0** | nowhere | **DROPPED** |
| `dependencies[].impact` | 8 | **0** | nowhere | **DROPPED** |
| `dependencies[].suggestedFixes[]` | 8 | **0** | nowhere | **DROPPED** |
| `warnings[].description`, the 'Trade Dependencies' note | 6 | **0** | nowhere | **DROPPED** (the only warning on the 600 births) |
| `warnings[].description`, any other row | 3 | 3 | Systems › Outlook, the "Warnings" disclosure (DM). The player view was not rendered; `ViabilityTab.jsx :: ViabilityTab` does not gate that disclosure on `playerView`. | it prints, but it holds **0 of the 600** births of the bar, so there is nothing to cure |
| `summary` (whole, or with its verdict token stripped) | 8 | **0** | nowhere | **DROPPED: not this field's to cure** |

**Why each prints nowhere** (read in code, and confirmed by the render):
- **Dependencies.** No surface renders `economicViability.dependencies`. The Outlook tab (`ViabilityTab.jsx`) and the PDF (`pdf/lib/viewModel.js :: viabilitySlice`) print `warnings` only, through `viabilityFilter.js :: isViabilityItem`. That filter also drops anything of severity `dependency`, so a dependency row filed among the warnings cannot print either.
- **The note.** 'Trade Dependencies' (`viability.js :: generateEconomicViability`, severity `note`) is routed away by title (`VIABILITY_EXCLUDED_TITLES`, UX consolidation T2-10 and T2-16). `tests/domain/viabilityFilter.test.js` and `tests/components/viabilityTabAdjudication.test.jsx` pin that absence.
- **The summary.** The Outlook tab, the PDF and Foundry print `dossierViewModel.js :: deriveViability`'s own seeded verdict, behind `canonicalViewModel`, which is on by default (`flagRegistry.js`). Examples from the render: "Goraka's trades run on goods brought in from elsewhere; …" and "Llanthwaite grows less than it eats, …". The record's "✓ VIABLE: … has N operational dependencies …" is read only by:
  - the record invariants (V-DEPCOUNT, V-SUMMARY-DEPS, V-SUMMARY-HOOKS);
  - `hookTruthRecord.js :: withoutFalseHooks`, which re-derives it;
  - `consistency.js` and `generationCoherence.js` (the food-verdict arms);
  - the AI layer (`aiLayer.js`, and `supabase/functions/generate-narrative/prompts.ts`, which can rewrite it).

  Unmasked, it differs only by its counts: 8 to 26 distinct by size (`report.out.txt`).

**The one way a dependency reaches a page is through a composer.** `dossierViewModel.js :: dependencyGoods` reads the good out of a title of the form `^Imports (.+)$` that the import list also holds, and puts it into the Outlook verdict ("…only while grain keeps arriving…"). `warIronHook.js :: warHoldsIron` reads the same title shape, and through it so do `warReach.js`, `tradeAtWork.js` and `houseInputAtHand.js`. The `generationCoherence.js` resource arm reads it too. `foodBalance.js :: appendProvisioningAtScaleDeps`'s `hasGrainDep` matches `grain` or `food` in the title and category. So the titles are machine keys a page reads but does not print. A rewording would break these readers without moving any printed sentence.

## THE FIGURES (before; for the record)

From `tools/viability/report.out.txt`. It is born census-exact (`measure.mjs`: the birth lines and the mask copied verbatim from the chair's `census.mjs` at bca8c6fe3, by way of `tools/situationDesc/measure.mjs`). Every cell **agrees** with the chair's `census100-before.json`.

Each cell is the commonest masked sentence's places / the places holding the sub-field.

| sub-field | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| dependencies[].title | - | - | 10/19 | 10/19 | 100/100 | 100/100 |
| dependencies[].description | - | 3/7 | 35/60 | 31/64 | 100/100 | 100/100 |
| dependencies[].impact | - | 4/7 | 60/60 | 63/64 | 100/100 | 100/100 |
| dependencies[].suggestedFixes[] | - | 4/7 | 35/60 | 31/64 | 100/100 | 100/100 |
| warnings[].description | - | 1/1 | - | 62/87 | 29/99 | 52/96 |
| **the same, over the rows a page prints** | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |
| summary (masked, out of 100) | 73 | 60 | 48 | 52 | 99 | 96 |

**What the rows are, on the 600:**
- Dependency rows:
  - 374 "Imports <the terrain's mustImport resource>" (`foodBalance.js :: deriveSupplyRiskAnalysis`);
  - 200 bulk materials and fuel, 106 staple food and 100 finished goods (`appendProvisioningAtScaleDeps`);
  - 6 Food Import Requirement.
- Warning rows: 283, all of them the 'Trade Dependencies' note.

**After: unchanged.** No composer is proposed, so the top share by size stays as in the table.

**Facts at the writer, measured in case the chair rules otherwise.** The writer was wrapped in memory (`capture-hooks.mjs`), and the wrap moved nothing: 600 of 600 births are identical with and without it. The writer runs once a birth.
- `config._seed` at the writer: 0 of 600 (`ctx._seed` is in scope at its one caller, `steps/generateNarratives.js`).
- Imports at the writer that differ from the final record: **0 of 600**. Exports: 0 of 600.
- The writer runs after `resourceGenerator.js :: generateResourceAnalysis`, the last writer of the import list.

So a wording could read the final lists. It would need the seed threaded through one line in `generateNarratives.js`.

## G. OPEN QUESTIONS for the chair

1. The dependency rows and the note print on no page. Should the chair's census read `economicViability.dependencies[]` and `warnings[]` (the note) as dark, as it read `situationDesc`?
2. The note names raw chain labels to nobody ("Trade access + grain", "Capital + trade access"; `economicState.tradeDependencies[].resource`). Should it be retired from the record, or left for staff and AI context?
3. The titles `^Imports (.+)$` are machine keys read by `dependencyGoods`, `warHoldsIron`, `hasGrainDep` and the coherence arm. Should any future change to this card keep them byte-stable, and say so in a comment at the writer?
4. The record's summary is printed nowhere, but the AI narrative reads it and can rewrite it (`prompts.ts`). Is its sameness the AI lane's concern, or nobody's?
