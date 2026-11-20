# BAR4-FIRSTPAINT hand-back (2026-11-16)

Branch `lane/bar4-firstpaint-2026-11-16`, from 7738e71be (the tip read 7738e71be as the brief stated). One defect: the round's first-paint regression (BAR4-SCENES-2's hand-back, item 1). I merged nothing.

## The figures (each tree built in its own scratch worktree with its own `npm ci`; `npm run build`, then `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js`)

| tree | first paint raw | gzip | Brotli | engine chunk | generation worker |
|---|---|---|---|---|---|
| f19c3b28b | 1,143,114 | 364,176 | 305,596 | 882,001 | 2,342,187 |
| 7738e71be | 1,291,683 | 409,511 | 340,927 | 882,000 | 2,355,901 |
| **this branch** | **1,138,376** | **362,463** | **304,277** | **881,999** | **2,355,901** |

The budgets are 1,132,308 raw, 360,756 gzip and 302,830 Brotli. f19c3b28b was already over them, by 10,806 raw on my build, so "within a few thousand bytes" was a little generous. This branch ends 4,738 B raw **under** f19c3b28b. That is outside the ±2,000 window, but on the low side, and the reason is plain: `houseInputAtHand.js` (5,514 B minified at f19c3b28b) and `timberAtHand.js` (326 B) rode first paint at f19c3b28b too, needlessly, and they now leave it with the rest. The first paint is still red against its budget, as it was at f19c3b28b. I raised and re-recorded no ceiling.

## What each import cost (built chunks, 7738e71be against f19c3b28b; minified size of each module alone in brackets)

| chunk | f19c3b28b | 7738e71be | delta | what |
|---|---|---|---|---|
| `data` (eager) | 152,530 | 296,244 | **+143,714** | `data/crisisDependence.js` (41,179) and the `data/institutionServices.js` it imports (108,235). Both moved from data-lazy to eager. The data-lazy chunk fell 135,564. |
| `engine-core` (eager) | 277,613 | 282,468 | +4,855 | `houseInputAtHand.js` grew (5,514 → 8,894), plus new `tradeAtWork.js` (1,050), new `sceneSupply.js` (413) and `timberAtHand.js` (326 → 668) |
| the institution catalogue (`catalogIdForName`) | | | **0** | already eager at f19c3b28b (`data/institutionalCatalog.js`: its own first-paint consumers) |
| the goods table (`data/goods/identity.js`), `resourceSemantics`, `tradeRouteSemantics`, `lib/entities`, `customContentSemanticAuthority`, `institutionRoster` | | | **0** | all already eager at f19c3b28b |

THE CARRIER IS NOT `factsOf.js`. `factsOf.js` rides **coherence-lazy** (FIRSTPAINT2_LAZY_DOMAIN). The carrier is `houseInputAtHand.js` itself.

- **Why it is eager.** The generators import it (`resourceGenerator.js`, `computeActiveChains.js`), so vite.config.js's derived engine-shared set put it in EAGER engine-core.
- **What HW1 changed.** It gave `houseInputAtHand.js` a static import of four small tables in `crisisDependence.js`, and that file imports the services table.
- **How the new homes joined.** The derivation walked through `factsOf.js` (generator-reached) into its new homes `tradeAtWork.js` and `sceneSupply.js`, and these joined engine-core too, as `ironAtHand.js` did in BAR2.
- **Nothing on the true first-paint graph needs any of the four.** Measured on vite.config.js's own `EAGER_FIRST_PAINT_MODULES`: the only eager importers were each other, as derived-set seeds.

## The reading sites, and where each runs

| site | reads | chunk |
|---|---|---|
| `facts/factsOf.js` getters `timberAtHand`, `timberReachesSawmill`, `tradeAtWork`, `enchanting`, `failedSource` | `timberAtHandOf`, `timberReachesSawmillOf`, `tradeAtWorkOf`, `sceneSupply.js` | coherence-lazy (the one door) |
| `facts/factVocabulary.js` dimensions `timber at hand`, `timber reaches the saws`, `trade at work: <trade>` (and `drawDeclared.js`, `stateProse/stateProseKernel.js`, which evaluate declarations) | `f.timberAtHand`, `f.timberReachesSawmill`, `f.tradeAtWork(key)` on a `factsOf(record)` HANDED IN; they import no home | engine-core (eager), but they read only an object `factsOf` made, so coherence-lazy has evaluated first |
| `data/arrivalProse.js` (`needs:` 46 lines), `data/institutionDescVariants.js` (3) | declarations, drawn through the vocabulary | data-lazy; drawn in the generation (`narrative/arrivalScene.js`, the houses' late re-read), so in the `engine` chunk and the worker |
| `display/crisisStoppedRow.js` (`housesOnSpentGround`), `display/validationOnPage.js` (`houseInputAtHand`) | the page's mark and gap line | unpinned lazy display leaves; both already import `crisisKind.js` / `factsOf.js` from coherence-lazy |
| `generators/resourceGenerator.js` (`houseInputAtHand`), `generators/computeActiveChains.js` (`sawnGoodFed`) | the record's gaps, the sawn-goods gate | `engine` (lazy; it already imports coherence-lazy) and the generation worker |
| `facts/timberAtHand.js`, `facts/tradeAtWork.js` | `houseInputAtHand`, `housesShortOf` | engine-core at 7738e71be, coherence-lazy now |

No site reads the atoms in the eager closure itself.

## The cure, and why

The repository's own convention, as `tests/architecture/engineCoreLazyEdge.test.js`'s header gives it: "excise the engine-core member that no true first-paint module reaches and pin it with the lazy module it imports, measured beside the pin (FIRSTPAINT2_LAZY_DOMAIN)".

- **What changed.** `vite.config.js` pins `facts/houseInputAtHand.js`, `facts/timberAtHand.js`, `facts/tradeAtWork.js` and `facts/sceneSupply.js` in FIRSTPAINT2_LAZY_DOMAIN, the chunk `factsOf.js` rides. The two tables follow them to data-lazy without being named. No `src/` file changes.
- **Why no runtime seam.** The brief's late-bound seam (a) is unneeded. Every getter of `factsOf` runs only after its own chunk has evaluated, and with this pin that chunk holds the four homes. No binding exists, so none can be unbound and no read can throw or fall silent.
- **Why no thinning.** Thinning (b), moving the four spent-ground tables into a light leaf, would have saved the `data` chunk's 143,714. It would have left `houseInputAtHand.js` and the new homes eager (+about 4,900, outside the window) and moved source lines the pin does not.
- **The new chunk edges.** coherence-lazy now imports data-lazy's two tables, and it imported data-lazy already. The engine chunk and the display leaves import coherence-lazy, and they did already. engine-core gains no lazy edge (`engineCoreLazyEdge.test.js` green), and the boot smoke's chunk-cycle stage passes.
- **NEW `tests/architecture/factHomesLazy.test.js`** reads vite.config.js's own derivations:
  - (a) the eager first-paint graph holds none of the four homes and neither table, with a positive control that the eager vocabulary is in it;
  - (b) manualChunks routes the four to `factsOf.js`'s chunk, a lazy one;
  - (b) every static importer of the four is one of them, `factsOf.js`, or a lazily routed module off the eager graph.

  Run against 7738e71be's tree it is RED on (a) (the six files listed) and on the first (b) (the four routed `engine-core`). Green here.

## The proof that nothing moved

No `src/` file changes, so no reading can move in Node. I measured it all the same, at 7738e71be and on this branch, each file alone, through `scripts/gate-tail.sh`.

- **THE MARKS, BYTE-IDENTICAL.** I wrote a fresh scratch instrument, because the previous seat's `books/marks.mjs` is gone. For every town it records `rowMarkText` on every house of `institutions` and every object row of `availableServices`, with `stoppingCrisesOf`.
  - The 1,020 towns are the census's 720 by its rule, plus a fresh 300: `bar0-<tier>-<calm|famine|under_siege|plague_onset|occupied>-rand-101..110`, born as `bar3ServicesRows.test.jsx` bears them.
  - That makes **92,622 rows**; 5,109 carry a mark. My fresh 300 is not the previous seat's, which is why its count was 91,338.
  - The two TSVs are byte-identical: `cmp` is equal, sha256 `56cbc40281428e4f…` both.
- **FACT = PAGE.** `housesShortOf` against the page's `housesShortOfInput`: the house sets agree in **1,020 of 1,020** at both trees. In 7 towns the noun of a three-input Smelter is joined differently ("iron ore or copper ore or gold or silver ore" against "iron ore, copper ore or gold or silver ore"). That is identical at both trees and is not mine.
- **THE GUARDS, each alone, as at 7738e71be:**
  - `bar4CorpusDefKinds` 15/15, `bar4CorpusEcoKinds` 12/12, `bar4MarkPromise` 24/24, `bar4PeopleKinds` 16/16 and `bar4SafetyKinds` 7/7;
  - `bar4HistoryOneTelling` 9/9, `bar4HousesPresumptions` 11/11, `bar4RecordHouseInput` 7/7 and `bar4ScenePresumption` 8/8;
  - `tests/domain/facts` 273/273; `tests/architecture` 344/344 at the tip, 347/347 here (my three);
  - the walkers: `negativeAssertionAnchor` 9/9, `seedLoopTotality` 9/9, `proseDrawnAnchors` 6/6.
- **RED AT 7738e71be, THE SAME HERE, NAMED NOT CHASED:** `tests/domain/stateProseKernel.test.js`, "is BYTE-IDENTICAL to the pre-cure reader on every pool with no demoted dimension", `expected [ …(36) ] to deeply equal []`. 1 failed, 37 passed, at both trees.
- **The other gates:** `npx eslint` on both changed files: 0 messages. `npm run typecheck:ratchet`: 167 errors, ceiling 167. `npm run typecheck:domain:strict`: 1113 errors, ceiling 1113.

## THE BOOKS MY CURE MOVES (for the close's doors)

- `tests/build/vendorPdfLazy.test.js` first-paint raw / gzip / Brotli: still red, at 1,138,376 / 362,463 / 304,277 (7738e71be 1,291,683 / 409,511 / 340,927; f19c3b28b 1,143,114 / 364,176 / 305,596). The cure moves the figures, not the ceilings.
- `tests/build/vendorPdfLazy.test.js` WEAVE ST-2, the goods roster: the owed row's derived eager flag changes, `R | E | identity | surface | src/domain/facts/houseInputAtHand.js` → `R | l | identity | surface | src/domain/facts/houseInputAtHand.js`. The file is now lazy, so the row the close writes takes `l`.
- `tests/build/vendorPdfLazy.test.js` engine chunk: 882,000 → 881,999 (still over `< 878,554`).
- Chunk sizes, for any book that keeps them: `data` 296,244 → 152,530; engine-core 282,468 → 272,875; coherence-lazy 182,232 → 191,805; data-lazy 1,570,113 → 1,713,836; the generation worker 2,355,901 (unchanged).
- `npm run verify:dist`: the same 13 failing build rows at 7738e71be and here, row for row. They are the stale edge bundles (`engineBundleReplay`, `engineServiceCore`, `engineServiceStoreParity`), the worker ceiling, the engine chunk, the three first-paint budgets and the goods roster. The boot smoke passes, every stage.

## FOR THE OWNER, IN PLAIN WORDS

The first screen of the app had grown by about 150 KB this round. The cause was a new check, "is this house short of what it works with?". It sat in the code that loads before the first screen, and it pulled two big tables with it, the service list and the crisis table. Nothing on the first screen uses that check: only making a town and reading its pages do. I moved those files to the part of the app that loads when you generate, beside the facts code that was already there. The first screen is now slightly smaller than it was before the round. No sentence, mark or fact changed, and the instruments above prove it on 1,020 towns.
