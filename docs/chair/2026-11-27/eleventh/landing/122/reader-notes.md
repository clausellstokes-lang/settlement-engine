# READER 122-123 — running notes (independent reader of points 122 and 123, "THE WHOLE-TOWN CURES")

Own cloud container. Scratch: the session scratchpad `reader122` (outside the repository; linked as /home/user/r122).
Every number below is from my own scripts (`scripts/`, `tools/` in the scratch) unless a line says otherwise.

## 0. Setup (2026-11-28, session start about 02:30 UTC)
- `npm ci` (exit 0); `git fetch --unshallow origin` (exit 0); `review-fixes-2026-07-08` fetched as a local ref.
- Chair's record: `lane/chair-2026-11-08` at 45fa47c80 (worktree `/home/user/chair`, read-only). My push branch
  `lane/reader-122-2026-11-28` is cut from that tip.
- BASE: aef8f996224c94365b503c4375933700ac82061d (`/home/user/base`, detached; point 121).
- POINT 122's TIP: `lane/stack-122-wip-2026-11-28` at 777733a2a07e573e881fd6198ef329f1783b47f7 (`/home/user/tip122`, detached).
  40 commits above the base (3 merges: fe2cf8c3c cures A, d999f3143 cures B, a838e7079 the traditions draw; 4 register commits after).
  `git diff --stat aef8f9962 777733a2a`: 47 files, +1,345 −455: 21 under src, 21 under tests, 2 under scripts (+1 script source), 2 under docs/content.
- POINT 123's TIP: not on origin at the start (the chair's start message); looked for after point 122's questions.
- Read whole: the brief; RULING-R.md; RULING-122-T.txt; the handoff's V21, V24, V25 ONLY; R-REPORT.md, R-TABLE.tsv; rmeasure/tools (all);
  landing/121/reader-notes.md (the method); the diff under src (all).

## What point 122 is (by reading the diff; each claim below is then executed)
- A1 `crisis/crisisHooks.js :: castReasonShown` (new, exported): cuts the fixed suffix "; " + `CAST_REASONS.nextInLine` from a stored cast reason; read by
  `castSentenceOf` (the crisis hooks) and by `crisisPage.js :: composeCrisisPage` (the Crisis tab, the PDF's CrisisSections, Foundry's Crisis page).
- A2 `components/session/SessionMode.jsx`: the "Threads to pull" heading takes `nameOrTokenCase(hook.source)`.
- A3 `display/tensionDescriptionShown.js` (new): a CURRENT tension whose description is exactly one of the two stored scarcity sentences prints
  "A critical resource, <good>, …" where `economyStateProse.js :: criticalImportRow(resourceAnalysis.imports)` names a good. Callers: HistoryTab's
  `TensionRow` (and the search's row), OverviewTab's tension list, `pdf/lib/viewModel.js` (three slices), `pdf/sections/HistoryFounding.jsx` (the dedupe).
- A4 `stateProse/generalStateProse.js :: criticalIssuePoolKey(count, recordClean, listed)`: the contradiction pool only where `listed > 0` (the
  critical issues that are not a stress consequence and carry a title); the zero pool as before.
- B1 `data/dailyLife/recentChanges.js`: thirteen imminent lines gain `excludes: ['crisis: <kind>']` (plague 3, famine 2, siege 2, monster pressure 6).
- B2 `display/solvencyShown.js` (new: `owesDebtShown`, `nothingLaidByShown`); `economyStateProse.js :: SOLVENT_LINES` + `solventCorpus` (three rows:
  DS-ECO-8 COMFORTABLE v1 v2 and MODERATE v3 on owes or nothing-laid-by; DS-ECO-1 C3 v2 on owes); `dossierViewModel.js :: owesDebtShown` now the
  shared reader (it also reads a timeline `outside_debt` event whose hook prints); DS-POW-6 'operation role unlicensed revenue' v2 re-worded.
- B3 `foodways.js :: huntersGameOf`: "game from the woods" reads "the hunters' game" where the record handed carries a config with no woodland.
- T `traditions/traditionFloor.js` (new), `genesis.js` (NEEDS_SINCE '0.10.0'; `heldBy` over the floor; a founding retry of ten; the additions'
  `admits`), `shownTraditions.js` (ACT_NEEDS read from the corpus; `drawnSetOf` through the helper), `traditionCorpus.js` (the fair act declares `market`).

## Method
- Corpora C and V (`rmeasure/tools/plan-C.json`, `plan-V.json`: 900 births each), re-born by me on the base and on the tip.
- PAGES (`tools/h122.jsx`, `build122.mjs`, `boot122.mjs`, `scripts/run-pages.sh`): the tree's real OutputContainer under jsdom, every group, tab and
  disclosure walked by the tree's own `walkDossier`: the OWNER's dossier; a FRESH SHARED PAGE (the stamp this tree's save composes;
  `projectShareVeil(toPublicSafe(stamped), writeShareVeil(null, []))`, the default veil of a fresh export; readOnly + playerView); and on the tip the
  same page carrying THE BASE's STAMP (a page saved before the change, read after it). A warm-up dossier rendered and discarded in every process.
  The born record's JSON and the stamp are kept (`rec.*.jsonl`).
- SITES (`tools/hS.jsx`, `bootS.mjs`, `scripts/run-site.sh`), over the SAVED records (read back from JSON): the PDF document walked as an element
  tree (the props `generateSettlementPDF` builds; a <Text> a line; a chapter at a time), the Traditions chapter with the mirror lit by me, Foundry's
  journal pages, TonightSheet / TableView / SessionMode rendered as components, the AI grounding payload, the dossier search (owner, player), and
  each cure's own function (crisis page, hooks, tensions shown, verdict lines, daily life, the desks, the foodways line, the traditions draw at the
  born stamp, re-stamped 0.9.0 and with no stamp, the stamp).
- ITEMS (`scripts/an-items.mjs`): the measuring seat's own fault tests (`rmeasure/tools/analyze.mjs`), clause for clause, applied to every surface.
- NOTHING ELSE (`scripts/an-diff.mjs`): records by sha256 and by byte; the stamp block by block; every printed line of every surface, base against
  tip, a difference "explained" only where the item's own base text replaced by its own tip text turns the base's lines into the tip's.
- PLANTS (`tools/hT.jsx`): question (5). MUTANTS (`scripts/mutants.mjs`, a scratch worktree /home/user/mut): question (6).

## (8) WHAT IS IMPORTED ANEW — CONFIRMED (`scripts/closure.mjs`: the static import closure by esbuild's metafile; `scripts/worker-size.mjs`,
## `worker-gzip.mjs`: each entry bundled alone, tree-shaken and minified by esbuild: a PROXY, not the chair's five sizes)
- FIRST PAINT (`src/main.jsx`, static closure): 259 source files on base and tip, the same set, the same bytes: nothing imported anew.
- THE GENERATION WORKER: the same 464 files (+2,395 source bytes: the edited files); minified +557 B.
- THE PDF RENDER WORKER (`src/utils/pdfRender.worker.js`): 609 -> 622 files. THIRTEEN MODULES ANEW, among them the economy desk and its corpus:
  `data/dossierStateProse/economy.generated.js`, `stateProse/economyStateProse.js`, `economyStateProseCandidates.js`, `composeStateProse.js`,
  `legibilityRung.js`, `data/dossierConnectives.generated.js`, `crisis/crisisFacts.js`, `display/economyFreshness.js`, `display/solvencyShown.js`,
  `display/tensionDescriptionShown.js`, `events/registryRerunKeys.js`, `facts/factsAnswered.js`, `traditions/traditionFloor.js`.
  Bundled alone: 3,355,651 -> 3,480,347 B minified (+124,696; gzip +29,220), of it `economy.generated.js` 119,070 B.
  THE CAUSE, BY PLANT: `tensionDescriptionShown.js`'s `import { criticalImportRow } from './stateProse/economyStateProse.js'` replaced in memory by a
  stub: 3,357,982 B (+2,331 over the base; gzip +742). So A3's helper carries the whole economy corpus into the worker `generateSettlementPDF.js`
  says the corpus leaves "have no business in" (its header: "the corpus leaves behind this builder are ~300 kB … keeps the worker bundle exactly
  the size it was"). Ruling 122-A-1 took `historyData.js` out of the helper; the import that weighs is the other one.
- FOUNDRY's EXPORT (`src/foundry/generateFoundryModule.js`, through `buildViewModel`): 530 -> 543 files, the same thirteen less the floor plus
  `houseSentenceName.js`: +124,210 B minified (gzip +28,631).
- THE ADVANCE WORKER (`src/workers/advanceInterval.worker.js`): 689 -> 733 files, FORTY-FOUR MODULES ANEW (`display/galleryVeil.js`,
  `display/publicSafe.js`, `data/traditionDescriptionTable.js`, `display/governanceAccount.js`, `display/defenseDisplay.js`,
  `display/tradeListDisplay.js`, `data/faceHonorifics.js`, `data/fortuneMeritLines.js`, `fortuneLastingLines.js`, …): +86,577 B minified (gzip
  +26,488). THE CAUSE, BY PLANT: `traditionFloor.js`'s `import { withoutFunction } from './traditionDescription.js'` stubbed: +793 B over the base.
  So the draw's floor helper carries the description leaf (and the veil module it reads `CARD_KINDS` from) into the worker that runs the pulse.
- `OutputContainer.jsx` / `PublicDossierView.jsx` (static closure): the same files, +816 source bytes.

## (5) THE TRADITIONS DRAW AND THE VEIL — corpus C, CONFIRMED (`tools/hT.jsx`, `scripts/run-trad.sh`, `an-plants.mjs`, `an-trad.mjs`; C's 900 SAVED births; V below)
THE NUMBERS (the site harness over the saved records; base | tip):
- rows drawn 2,767 | 2,767; shown on the owner's tab 2,506 | 2,767; rows the shared page serves 2,506 | 2,767.
- ROWS DROPPED AT VIEW: owner 261 in 234 towns | 0; shared 261 in 234 | 0. TOWNS SHORT OF THEIR SIZE's BAND: 154 | 0. TOWNS SHOWING NO TRADITION: 57 | 0.
  The founding row dropped: 83 | 0 (every one a fair: "The Founding Fair" 15, "The Fair of the Founding" 12, …).
- The drawn set moved base -> tip in 234 towns: exactly the 234 that drop a row on the base (moved and not a dropper 0; a dropper not moved 0).
- THE OLD TOWNS (each saved birth re-stamped 0.9.0, and with the stamp stripped; tip against base): the drawn set (every rec's JSON), the shown set,
  the shared rows and the owner's descriptions EQUAL on 900 of 900, both ways; on the tip the 0.9.0 draw == the stampless draw 900/900.
- IS ANYTHING A TOWN HOLDS ON ITS FULL RECORD REFUSED BY THE FLOOR: market held in full 503, at the floor 503; smith 353 | 353; farmland 450 | 450;
  navigable, river, coast 0 | 0 (C's births hold no water): refused 0 on C. (No born hideable house of C carries a need: 1,558 hideable houses, all
  criminal by category; none named like a smith or farmland; "Black market" / "Whisper market" (325) are no market by the catalogue's tags.)
THE WALK (the tip; 240 births, 40 a size): 122,272 addresses hidden ONE AT A TIME (every address `curateModelFor` offers on the record and on its
  public projection: groupings, switches, whole-house cards, card eyes; every house's `card:` and each of its five eyes; every `class:<kind>:<field>`;
  the defaults), then ALL AT ONCE: the reader's rows (`sharedTraditionRowsOf`, count, names, text: one JSON) moved 0; the owner's drawn set moved 0;
  the rows on the page a reader is served (`publicProseOf(projectShareVeil(toPublicSafe(stamped), writeShareVeil(null, [])), 'traditions')`) equal
  the composed rows 240/240. Over all 900: the owner's shown names == the shared rows' names 900/900; a row that names a hideable house 0 (402 towns hold one).
  The same walk on the base: rows moved 0 too (the base's drawn rows were already floored); the served rows == the composed rows 230/240 there.
MY PLANTS (each house the town's ONLY house of its fact; read shown / hidden whole (`card:`) / function eye shut / `class:institution:function` /
  tags taken off by hand / the house removed by hand / the default veil; 900 towns each; "differ" = the reader's rows JSON != shown's):
- a DM-made house tagged market ('The Lantern Exchange', tags ['market']):      tip differ 0 in every way; owner's set != shared rows: base 575, tip 0.
- a criminal house named like a catalogue market ('Weekly market', Criminal):   tip differ 0; owner's set != shared rows: base 575, tip 0.
- a criminal house named like a smith ('Blacksmith', Criminal):                 tip differ 0; owner's set != shared rows: base 186, tip 0.
- A CLANDESTINE HOUSE DECLARED BY ITS OWN FACET, named like a smith ('The Hidden Forge', category Crafts, `facets: { clandestine: 'clandestine' }`):
  the reader's rows DIFFER between shown and the function eye shut (and `class:institution:function`, tags off by hand, THE DEFAULT VEIL) in 198 of
  900 towns on the tip (base 186); hidden whole and removed by hand: 0. dp-thorp-20: ["The Sun Feast","The Feast of the Harvest"] against
  ["The Sun Feast","The Offering of the Forge"]. THE ROOT IS THE VEIL's (`galleryVeil.js :: applyVeil`, the same on the base): the eye strips
  `facets` / `tags` BEFORE the card's hideable class is re-checked, so `card:` + `field:…:function` together (the default veil's own pair) LEAVE
  the house on the served page with its name and category (`tools/hV.jsx`: SERVED_HOLDS_THE_HOUSE true; `card:` alone removes it; the criminal
  control is removed). Born houses: 0 of 1,558 hideable houses of C are hideable only through the eye (`tools/hV2.jsx`): it needs a DM-made or
  custom house. NOT NEW AT 122.
- A CRIMINAL HOUSE NAMED LIKE THE CATALOGUE's FARMLAND ('Farmland', Criminal), the town's only farmland: the reader's rows DIFFER between shown
  and hidden whole, removed by hand and THE DEFAULT VEIL in 55 of 900 towns on the tip (base 49): `genesis.js :: fieldRiteRefused` reads
  `factsOf(settlement)` (the FULL roster), not the floor, so a rite of the fields stands on the hidden house. dp-town-2: shown ["The Lantern
  Feast","The Common Harvest Offering","The Old Furrow Vigil"], hidden [… ,"The Old Harvest Vigil"]. With the food record's sources also set to
  no grain: 269 of 900 (base 245). NOT NEW AT 122 (B1(ii)'s rule), but the draw's own comment ("no veil state can move the drawn set") is not true of it.
AN EARLY NOTE on the two plants above went to the chair at 03:46 UTC (both are the base's too).
