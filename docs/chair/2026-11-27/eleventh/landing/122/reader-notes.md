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

## (7) THE REGISTERS — by reading every one, leaf by leaf (`git show <rev>:<file>` parsed and walked; CONFIRMED as far as a diff can); the doors run: below
`git diff --stat aef8f9962 777733a2a`: eleven register-like files. EVERY REGISTER COMMIT TOUCHES ITS OWN FILE ONLY (fifteen commits read: 777733a2a,
07ad791a6, 59ec13a60, c1f2f9d6d at the join; e096d4a96, ad59993ce, 2d7929c69, 2916fa445, 6bbeb9bef, 319e0f039, daa2a9594, 0dc9341c9, 9c0efcc31,
5fbb7fd89 in the lanes; fab67b268 touches the wiring census AND the eight numeric pins of its walker test).
- `scripts/.observed-shape-readers-baseline.json` (565 lines of diff): the GOVERNED parts (`inventory`, `identities`, `total`, `minRows`,
  `originMinRows`, `rowTags`, `schema`) are byte-equal base and tip. What moved: `scanStats` (files 2,639 -> 2,642; reads 152,409 -> 152,569;
  resolved 13,332 -> 13,339; unresolved 139,077 -> 139,230), `sentinel.resolvedReads`, the `digests` and `manifests` (input hashes), the
  freeze date and sha. NO CEILING RAISED, no row added.
- `scripts/.writer-reach-baseline.json`: 34 leaves: `frozenAtSha`, `verdictDigest`, `closureSizes` (web-display 805 -> 807, web-transitive
  1,105 -> 1,106, dossier-pdf 659 -> 662, FOUNDRY 531 -> 540), seven `scanStats`, and 21 `surfaceReach` rows that GAIN a surface (20 gain
  `foundry`: the economy desk's reads; `templateType on historicalEvents` gains web-display: B2's reader). `population`, `minRows`,
  `pendingSurfaceCeiling`, `reviewableDarkCount`, `darkUnregistered`, `registerDigest`: unchanged. The shrink-only cohort did not grow.
  (The foundry rows are (8)'s fact seen by the register: the economy desk now rides behind `buildViewModel`.)
- `docs/content/wiring-census.json`: 24 leaves: the stamp; `totals.keyTables` 40 -> 41 (SOLVENT_LINES); `totals.absent.not-produced` 55 -> 54;
  `grains.function.zeroK` 169 -> 170; `holders…SOURCE-UNRESOLVED` and `no-mapping` 857 -> 856; `relations.join.deskRoots` 109 -> 108 (the
  contradiction pool's key no longer reads `readings.recordClean`). The walker's eight numeric pins moved with it in `tests/lint/
  proseWiringCensus.walker.test.js` (5 case bodies; each a measured count, `toBe` to `toBe`; none is a ceiling).
- `tests/lint/.tuning-inventory.json`: the stamp; two `dependents` lists gain `src/domain/display/tensionDescriptionShown.js`; two `line`
  numbers (78 -> 87, 103 -> 112). No value, leaf or `spanDigest` moved.
- `tests/lint/.lighting-census-baseline.json`: files 3,826 -> 3,827, credited 3,317 -> 3,318, titles 32,108 -> 32,138, suiteTitles
  8,929 -> 8,939; parked 509 -> 509.
- `tests/lint/samenessHideable.existingReds.json`: rows 96 -> 96, `hand` 155 -> 155, `watchBase` 10 -> 10. ONE row replaced: the same pool
  ("DS-POW-6::operation role unlicensed revenue"), the same vid (2), the same reason; `sha` 2e3806256277 -> df37236e7c07. sha256 of the OLD
  sentence begins 2e3806256277 and of the NEW sentence df37236e7c07 (computed by me). A RE-KEY OF ONE SENTENCE, NOT A WIDENING.
- The generated projection: `general.generated.js` (`readsCount` 2 -> 1 on DS-GEN-11's contradiction pool), `power.generated.js` (v2's text),
  `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (the same sentence), and the generator's `WORD_CORRECTIONS` row (the two full sha256).
- GOLDENS: none. `git diff --stat aef8f9962 777733a2a -- tests/fixtures '*.snap' '*golden*' '*.snapshot.json'` is empty.

## (6) THE TESTS — part 1, by reading (`scripts/test-cases.mjs`: every `it(`/`test(` of each changed file, base against tip, by title and body)
- 18 test files (17 changed, 1 new: `tests/domain/traditionNeedsHeld.test.js`): cases 386 -> 421, `expect(` 1,729 -> 1,841. TITLES GONE: 0. No
  skip, only or todo. 35 new cases. THIRTEEN case bodies changed, in 8 files:
  * `generalStateProseDesk` (1): `criticalIssuePoolKey(2)`, `(2, true)`, `(0, false)` were the contradiction pool and are `toBeNull()`; the pool
    is asked with the third argument. The cure's own re-key (R7 overturns that arm); the new R7 block pins it on three born towns.
  * `selfVouchReceipt` (1), 'soak1k-8 …': its last expect was `.toBe(true)` (the page prints a contradiction member) and is `.toBe(false)`. BOTH
    of the case's verdict expects are now negatives (no vouching line; no contradiction member), and the comment above the first still says
    "anchored: the next lines pin the live contradiction verdict". An empty verdict satisfies both.
  * `publicProseEquality` (2): the viability site reads thirteen towns (soak1k-24 added: "the first of the corpus that does"), the others twelve.
  * `traditionsTabFairAct` (1): the collected arm's births re-stamped 0.9.0; a new case pins the same births at 0.10.0.
  * `traditionFieldRite` (1 body; the file's `place` helper for all ten): the fixture's roster is [Tavern, Weekly market, Blacksmith] where it was
    [Tavern], "so only the field rule moves a row". The matchers are unchanged (JSON equality against the stampless draw).
  * `bar4HousesPresumptions` (1): the 720-seed arm asserted `culturalIdentity.foodways === foodwaysLineOf(s)`; it now asserts the stored line
    equals the reader's line READ WITHOUT THE CONFIG, and `foodwaysLineOf(s)` equals a `shown` the test computes with ITS OWN COPY of the cure's
    rule (the four woodland resources, the terrain pattern, the two replaces); plus `swapped.length > 0`.
  * `proseWiringCensus.walker` (5): the eight measured counts (above, (7)).
  * `traditionDescriptionSharedPage` (1): below.
  Fixtures changed at file level: `generalDeskTabFlow`'s UNVIABLE record gains two listed critical issues (the count it claimed was 2 with none).
- THE SECURITY FILE (`scripts/sec-cases.mjs`): cases 50 -> 58, expects 120 -> 148, titles gone 0. SEVEN cases now read a 0.9.0 record through
  their describe's setup (PLANT 2: three; UNIT 4b: three; THE SET's first). SIX of the seven bodies are BYTE-IDENTICAL to the base's; the seventh
  (THE SET, "the OWNER's set is as it was …") holds the same three expects, word for word, inside a loop over the two restamps (0.9.0 and no
  stamp). The four that pinned the old draw (PLANT 2's "the town holds a market rite" and its owner-side CONTROL; THE SET's owner's set; 4b's
  owner-side CONTROL) are among them. THE 0.10.0 TWINS: PLANT 2's keeps the reader's two byte-identity expects verbatim
  (`texts(t, veiled(t), 'reader')` and `byHand`) and adds the owner's; 4b's keeps `rows.filter(standsOnMarket) … toEqual([])` and
  `JSON.stringify(sharedTraditionRowsOf(hidden)) … toBe(JSON.stringify(rows))` verbatim, and its first expect (the rows are the owner's
  first-landing rite) becomes "the rows are the owner's whole set". Each twin has its own NOT VACUOUS and a CONTROL (a non-hideable catalogue
  market does draw a market rite). Mutants: below.
THE DOORS, RUN BY ME IN CHECK MODE on a clean tree of the tip (/home/user/doors at 777733a2a; `scripts/doors.sh`; no tracked file changed after):
- `node scripts/check-writer-reach.mjs` exit 0 ("WRWALKER HOLD … DARK 1406 … pending-surface debt: none"); `node scripts/check-observed-shape-
  readers.mjs` exit 0; `node scripts/wiring-census.mjs --check` exit 0 ("verified 861 pools / 3183 variants / 169 relation rows against 7 stamped
  files"); `node scripts/generate-dossier-state-prose.mjs --check` exit 0 ("verified 69 state blocks / 3183 variants"); `node scripts/stable-pick-
  ids-door.mjs` exit 0 ("the baseline matches the tree (160 scopes, 819 ids)").
- THE WALKERS, each file alone (vitest, json, exit code kept): tuningRegister 76/76; samenessHideable 31/31; proseWiringCensus 79/79; writerReach
  52/52; observedShapeBaseline 59/59; sovereigntyLightingContract (the lighting census) 34/34; stablePickIds 33/33: all green.
- `tests/data/dossierStateProseProjection.contract.test.js`: 2 RED of 79 on the tip: "SEAM car 4 — the SHIFT REGISTER … recomputes every pin from
  the leaves" (5 drifts) and its MUTANT row ("expected 3183 to be 3182"). THE SAME TWO, WITH THE SAME MESSAGES, ARE RED ON THE BASE aef8f9962 (run
  by me there): the owner-gated shift register's pins, older than point 122 and not moved by it (5 and 5; 3,183 on both).
So: every register the change touches was moved by its own door (each door re-run agrees with the committed file); no ceiling raised; no
shrink-only register widened; no golden re-recorded; the one hand-keyed row is a re-key.

## (2) and (4) OFF THE TABS, C and V, all 900 each — CONFIRMED (`tools/hS.jsx`, `scripts/run-site.sh`, `an-diff.mjs` with `SITEONLY=1`)
Each saved birth read on both trees: the PDF's chapters (the document's own element tree, react-pdf mocked), the lit Traditions chapter, the
Foundry journal's pages, the Tonight sheet, the table view, the session sheet, the search's rows (owner, player), the AI grounding text.
EVERY DIFFERING LINE SORTED BY THE ITEM THAT EXPLAINS IT; UNEXPLAINED LINES: C 0, V 0 (Foundry escapes the apostrophe: "the hunters&#39; game").
Towns by item, C | V:  A1 12 | 9;  A2 a person's second name 892 | 893 (3,392 | 3,304 headings);  A3 36 | 45;  A4 94 | 78;  B1 12 | 6;
B2 standing-of-living tile 148 | 59, treasury tile 15 | 15, header 20 | 8, the Outlook's verdict row 13 | 9;  DS-POW-6 v2 re-worded 8 | 11;
B3 0 | 19;  T 234 | 210 (the search's rows and the lit Traditions chapter).
TWO THINGS THE MESSAGES DO NOT SAY (both differ outside the cured sentence; neither reads wrong):
- A2 RE-CASES EVERY HEADING OF THE SESSION SHEET, not only a person's: 5,063 | 5,225 headings in 875 | 881 towns that are no person change case
  ("Economic event" -> "Economic Event", "Resource scarcity" -> "Resource Scarcity", "Faction conflict" -> "Faction Conflict"; 230 distinct on C).
- B1 MOVES A SECOND SLOT: in the 12 | 6 towns where the imminent line stands down, the Outsider Impressions sentence changes too (`dailyLife.js`:
  the slot yields to what the page has already stated). C dp-thorp-24: "A visitor soon learns that the country beyond is not to be walked
  carelessly." -> "There is sickness in the place, and visitors are kept at a polite distance."; V dp-hamlet-133: "Visitors are told to keep to
  the roads and not to wander off them." -> "People here are wary of fevers, and a visitor who coughs is watched." (and V dp-village-111,
  dp-city-10, dp-village-13: the slot printed NOTHING on the base and prints the fever line on the tip). True of each town (plague in force).
WHERE EACH CURE IS IN FORCE OFF THE TABS (towns that print the old line, base -> tip, C): A1 PDF 12 -> 0, Foundry 12 -> 0, table 8 -> 0, session
8 -> 0, Tonight 8 -> 0, search 8 -> 0; THE AI GROUNDING STILL CARRIES THE STORED REASON WITH THE BUILDER'S NOTE (10 -> 10: it reads the record).
A3: the PDF's History chapter and the Foundry Power page print the named twin 36/36; the rendered search rows print it (owner and shared:
dp-thorp-32, dp-thorp-94 rendered by `tools/hQ.jsx`); THE SEARCH's INDEX TEXT (36 of 36) AND THE AI GROUNDING (24 of 36) hold the stored,
unnamed sentence. A4 PDF 94 -> 0 (86 | 78 by the chapter). B3 (V): the PDF's Identity chapter and Foundry 19 -> 0.

## (1) B2 AT THE FUNCTION LEVEL — CONFIRMED (`scripts/an-b2site.mjs`: the economy desk's strings, base against tip, with the tip's own two facts)
C: standing of living (DS-ECO-8 COMFORTABLE, printed in 486 towns) moved in 148: v1/v2 -> v4 126, -> v3 20, -> NOTHING 2 (dp-village-5,
   dp-village-13); the treasury line (MODERATE, 218) moved in 15 (v3 -> v2 11, -> v1 4); the header (DS-ECO-1 C3, 704) moved in 20 (v2 -> v1 13, -> v3 7).
V: COMFORTABLE (192) moved in 59: -> v4 36, -> v3 5, -> NOTHING 18 (dp-hamlet-102, dp-village-36, dp-thorp-129, dp-hamlet-88, dp-hamlet-116,
   dp-village-27, dp-hamlet-91, dp-village-125, dp-village-90, dp-thorp-107, dp-hamlet-133, dp-city-65, dp-city-77, dp-metropolis-15, dp-city-2,
   dp-city-98, dp-city-47, dp-village-6); MODERATE (187) 15 (-> v2 11, -> v1 4); C3 (379) 8 (-> v1 5, -> v3 3).
THE SLOT GOES EMPTY in 2 + 18 = 20 towns: the tile keeps its label ("Comfortable") and has no sentence. Why: v1, v2 are refused by B2, and v3, v4
   both ask `food: ≥ secure` (the band the page prints); these towns print "falls a little short of the food it needs" (DS-ECO-9 PRESSURED).
SILENCED ON "NOTHING LAID BY" ALONE (the place owes nothing by the leaf): C 128 of 163 tile moves; V 57 of 74. No refusal with both facts false.
A WIDER TEST OF MY OWN (`scripts/an-sav.mjs`: any desk line that claims money in hand, in towns where the tip's own leaf says the place OWES:
C 88 towns, V 79), base -> tip:
- cured: "money laid by behind it" 13 -> 0 | 7 -> 0; "put things by, and can" 19 -> 0 | 6 -> 0; "pays its (own) way" 23 -> 0 | 10 -> 0; "a
  little in hand" 3 -> 0 | 4 -> 0.
- NOT CURED, THE DEFENSE DESK (`defenseStateProse`, DS-DEF-2 "Economic Survival: STRONG"; SOLVENT_LINES holds no row of it): "had money laid by
  before this trouble began" 1 -> 1 | 0 (C dp-town-133, beside the tension "owes a heavy debt to an outside power, and the power is preparing
  to collect"); "money in hand" 10 -> 10 | 9 -> 9 (V dp-city-104: "Campomagnum's accounts have money in hand: the town can buy what a bad
  season needs without going begging."); "enough in hand to see the town through" 11 -> 11 | 4 -> 4; "money it had put by" 0 | 1 -> 1 (V
  dp-city-98). 22 towns of C and 14 of V, the same on the base: the pool's marks read the indebted CRISIS, and a debt that stands as a tension or
  a hooked event is no crisis.
- GROWS AT THE TIP, THE CURE's OWN REPLACEMENT: "With a little left over each year, {S} gets by on a …, and every year people argue over how to
  spend it." (C3 v1, the sibling drawn where v2 is refused) 49 -> 62 | 25 -> 30: THIRTEEN towns of C and FIVE of V print it at the tip, where
  the base printed "pays its way", beside a place debt in force (C dp-town-83, dp-metropolis-138, dp-metropolis-79 …; V dp-city-0, dp-village-5,
  dp-city-102, dp-thorp-42, dp-village-79). "takes in a little more than it pays out each year" (MODERATE v1) 17 -> 17 | 7 -> 9 (V dp-city-0,
  dp-town-45 new). "accounts still balance, and that is the one thing about the town the crisis has not yet reached" 11 -> 11 | 8 -> 8.

## (3) THE COLD READ — the new and re-worded sentences in every fill, C and V (`scripts/an-fills.mjs`, `an-cold.mjs`, `an-a3food2.mjs`, `an-a3ctx.mjs`)
A3, the named twin (C 36 towns, V 45): "A critical resource, <good>, is running short, and some are hoarding it while others cannot pay the
prices asked" (C 34, V 43) and "A critical resource, <good>, became scarce, causing hoarding and price gouging" (C 2, V 2: the stored past form
on a CURRENT tension). Fills: C timber 15, grapes 11, stone 4, iron ore 4, fish 2; V grain 11, grapes 8, metals 7, luxury goods 5, clay 4,
gold/silver ore 3, iron ore 3, stone 2, timber 2.
- FINDING (sent to the chair at once, 04:31 UTC): WHERE THE GOOD IS GRAIN THE SAME DOCUMENT PRINTS A FULL GRANARY. All ELEVEN grain towns of V:
  dp-town-97 "Stores: a granary, about six months of grain"; dp-city-25, -49, -72 eight; dp-city-8, -21, -47, -63 nine; dp-metropolis-12, -25,
  -95 fifteen. The food band printed: Secure 8, Pressured 3. V dp-city-21 (Yurtkul), on the tip's PDF tree and Foundry pages: History "A critical
  resource, grain, is running short, and some are hoarding it while others cannot pay the prices asked"; Tonight "Secure. Stores: a granary,
  about nine months of grain."; Economics "Nothing on Yurtkul's tables suggests to a visitor that food is a worry here." (and, of the same grain,
  "A good part of the grain Yurtkul's work uses must come from elsewhere; when none comes, that work stands idle": the record's critical import
  is its trades' input). The base prints the unnamed sentence there. C: no grain fill; fish 2 (dp-village-106, dp-village-124), band Secure, no
  stores line.
- No town says it SENDS OUT the good its twin names (C 0 of 36, V 0 of 45; the PDF's Economics, Resources, Viability, Tonight, Overview chapters).
- The page's own lists and the named good: on "Needed, and not brought in" C 14, V 16; among the printed imports C 19, V 22; on neither C 3, V 7.
- "gold/silver ore" (V dp-town-16, dp-city-58, dp-city-90) prints the record's label with its slash inside a sentence.
A1, the reasons with the builder's note cut: "one of a power that loses by the crisis", "its people stand on the walls", "its people tend the
  sick", "its people stop trusting their neighbours": each reads whole (C 12 towns, V 9).
A4: nothing new is printed: in 94 towns of C (78 of V) the section "The verdict, in the town's own voice" and its one sentence go together.
B1: the imminent line goes; the slot keeps the in-force line ("Sickness has broken out in the place, and more people are falling ill."). No new words.
B2: the siblings are old sentences; the verdict row's new words: "VIABLE: {S} gets through the year, buying in some of what its own land and
  trades do not provide." (C 13, V 7) and "VIABLE BUT STRAINED: Some of what {S} eats is brought in by road; its own land does not produce
  enough." (V 2: dp-hamlet-61, dp-city-47). DS-POW-6 v2: "Debts run up in one house here are collected in another, and the two are the same
  concern." (C 8, V 11). Each reads whole.
B3 (V 19): "Each holding grows for its own table, and beyond that its food is the hunters' game." 11; "The table is fish from the local waters,
  with the hunters' game beside it." 3; "The table is salted fish, with the hunters' game beside it." 2; "Its own fields give it grain, and
  beyond that its food is the hunters' game." 2; "Bread from the home fields and the day's catch anchor the table; the hunters' game fills the
  winter." 1. Each reads whole.

## (1) and (2) ON THE RENDERED PAGES, CORPUS C, all 900 — CONFIRMED (`tools/h122.jsx`, `scripts/run-pages.sh`; `an-items.mjs`, `an-items-cmp.mjs`,
## `an-residue.mjs`, `an-diff.mjs`, `an-b2.mjs`). Owner's tabs, a FRESH shared page, and a page STAMPED ON THE BASE read on the tip ("stale").
RECORDS: record hash equal 900/900; the born JSON equal 900/900. THE STAMP (the prose a save composes) differs in 408 towns: traditions 234,
economy:economics 169, general:viability 94, viewModel:viability 13, power:desk 8.
EACH ITEM (the measuring seat's tests, ported; the base's counts reproduce R-TABLE: 12, 892, 12, 165, 12, 94), pages with the fault, base -> tip:
- A1 (R1): owner 12 -> 0; shared 8 -> 0; stale 0; PDF 12 -> 0; Foundry 12 -> 0; table / session / Tonight 8 -> 0; search 8 -> 0. AI grounding 10 -> 10.
- A2 (R3, the session sheet): 892 -> 0.
- B1 (R4): owner 12 -> 0; shared 12 -> 0; PDF 12 -> 0; AI 12 -> 0.
- B2 (R5/R10/R12, the hard pair): owner 165 -> 75; shared 109 -> 25; STALE 109 (the stamped page keeps every one); PDF 167 -> 75; Foundry 7 -> 3.
  THE 75 THAT STILL HOLD IT (a page may hold two): 58 where the other side is A PERSON's secret on the NPCs tab ("Deeply in debt to a creditor
  …": not the place's debt); 24 where it is a History line of a PAST debt whose hook does not print (RULING 122-B-1: "A large debt to an outside
  power came due, and the creditor was moving to enforce it" 16; "The settlement had borrowed heavily from a foreign power now ready to call the
  debt in" 8), beside "pays its way" (Outlook) 12, "puts things by" 7, "purse closes ahead … money laid by" 4, "had money laid by" 3; and ONE
  with a place debt in force: dp-town-133, Defense "Altfurt had money laid by before this trouble began, and the trouble is still being paid for
  from it." beside Overview "… owes a heavy debt to an outside power, and the power is preparing to collect" and its hook. The shared 25: the
  same 24 and dp-town-133. The soft pair (a savings line beside the Weak grade alone): owner 151 -> 157, shared 153 -> 158.
- A3 (R6a, "a critical resource" unnamed): owner 12 -> 6; shared 8 -> 5; PDF 12 -> 6. The six: dp-village-23, dp-village-61, dp-town-8, dp-town-68,
  dp-metropolis-26, dp-metropolis-85: each the History timeline's PAST event ("A critical resource became scarce, causing hoarding and price
  gouging": RULING 122-A-1 names a current tension only). The named twin prints on 36 pages (owner, shared, stale, PDF, Foundry).
- A4 (R7): owner 94 -> 0; shared 94 -> 0; STALE 94; PDF 94 -> 0.
- B3 (R8a): 0 -> 0 (C holds no woodless game town). R8b 120 -> 120 and R13 243 -> 243: untouched, as point 122 should leave them.
EVERY PRINTED LINE THAT DIFFERS, BY ITEM: owner 1,780 lines in 434 towns (Traditions 234 towns, Daily Life 173, Outlook 107, Overview 36,
History 36, Economics 20, Crisis 12, Plot Hooks 8, Power 8); shared 1,761 lines in 430 towns. LINES NO ITEM EXPLAINS: owner 0, shared 0, stale 0.
THE STALE PAGE (the base's stamp read on the tip, against the base's own shared page): 104 lines in 51 towns, all of them the cures that are
derived at view: A3 36 towns, B1 12 (and its Outsider Impressions knock-on), A1 8. THE STAMPED CURES DO NOT REACH IT: A4 (94 pages), B2 (109) and
T's rows stay as stamped until the owner saves again (`publicProse.js :: PUBLIC_PROSE_VERSION` is 'pp-1' on both trees, so the old stamp is read).
B2, THE OTHER DIRECTION, on the owner's pages: a savings or pays-its-way line of the base no longer prints on 172 pages. On the tip's page the
other side is: a place debt in force 73 lines' worth; "nothing laid by" / "would have to borrow" 49; AND ON 74 PAGES NEITHER: there the Defense
tab's Economic Survival line says it in other words: WEAK v4 "{S} pays nobody to defend it, and could not find the wages if it had to hire
someone in a hurry." 37; WEAK v3 "{S}'s defence has been short of money for years, and each lean season leaves less to spend on it when a real
crisis comes." 33; CRITICAL v1/v2 4 (dp-thorp-107, dp-thorp-112, dp-hamlet-52, dp-hamlet-83). No page was silenced with none of these.
(dp-thorp-9: gone "People here put things by, and can. That is the difference between this thorp and a poorer one."; Defense "Darhannuur's
defence has been short of money for years …".) WHAT PRINTS IN THE SLOT: COMFORTABLE -> v4 126, -> v3 20, -> NOTHING 2 (dp-village-5,
dp-village-13); MODERATE -> v2 11, -> v1 4; C3 -> v1 13, -> v3 7; the Outlook row -> "{S} gets through the year, buying in some of what its own
land and trades do not provide." 13.

## (6) THE TESTS — part 2, MUTANTS (`scripts/mutants.mjs` in a scratch tree of the tip, /home/user/mut; each mutant one edit of one cure; the named
## test files run by vitest, json reporter, exit code kept; baseline 0 red of 856 cases in 21 files). CONFIRMED.
RED (the cure is held), mutant: what it does -> the file that reds:
- A1 `castReasonShown` hands the reason back whole -> crisisHooks, crisisPage (3); the page alone -> crisisPage; the hook alone -> crisisHooks.
- A2 the heading back to `tokenCase` -> dossierLabelCase (1).
- A3 the helper never names the good -> historyTab (1); the History row prints the stored sentence -> historyTab (1).
- A4 the pool keyed by the count or the battery again -> selfVouchReceipt, generalStateProseDesk (5); a stress consequence counts as listed ->
  generalStateProseDesk (1); the battery alone opens the pool -> generalStateProseDesk, selfVouchReceipt (4); the pool never prints ->
  publicProseEquality, generalStateProseDesk, generalDeskTabFlow (5).
- B1 plague T0, T1; famine T0, T1; siege T0, T1; monster stressor T0, T1 each lose their exclusion -> dailyLife (1 or 2 each).
- B2 SOLVENT_LINES refuses nothing -> viabilityTruePage (4); the COMFORTABLE row gone (3); COMFORTABLE refuses v1 only (1); the C3 row gone (2);
  nothing-laid-by never read (1); the timeline event never owing (2); any Debt Crisis event owing, hook or none (1); the tension never read (2);
  the Outlook's reader never owes (4); DS-POW-6 v2 says the town owes again (1): all viabilityTruePage.
- B3 the line read as stored -> r3c10FoodLinesTrue, bar4HousesPresumptions (3); the terrain never read (2); managed_forest no woodland (1); the
  sentence-head form not capitalised (1).
- T the stamp floor removed (15 red); no record asks the needs (7); the founding retry removed (4); an addition's admission forgets the needs
  (6); the needs asked of the FULL record (4, traditionDescriptionSharedPage); the floor keeps the hideable houses (3, the same file); the floor
  keeps the function eye (8, the same file); the fair act's need removed (10); NEEDS_SINCE 0.11.0 (7); NEEDS_SINCE 0.9.0 (9).
NOT RED IN THE CURE's OWN TEST FILES (wider sets: below):
- A3: the OVERVIEW prints the stored description; the PDF's three slices do; the SEARCH row is handed no settlement; the PDF's dedupe reads
  the stored sentence: 0 red of 517 each (historyTab, restoredSubsections, fullPdf.render, publicProseEquality, stressorAftermath, tabSentencesOnce).
- B1: plague T2; monster overrun T0, T1; monster frontier T0, T1 each lose their exclusion: 0 red of 42 (dailyLife). FIVE OF THE THIRTEEN.
- B2: the MODERATE row gone: 0 of 17; a CRITICAL survival band no longer "nothing laid by": 0 of 17 (viabilityTruePage).
(`B1-frozen` was an equivalent mutant: the spread keeps `excludes`. Disregarded.)

## (5) THE TRADITIONS DRAW — corpus V, and the old towns RENDERED — CONFIRMED (`an-trad.mjs V`; `tools/hOld.jsx`, `an-old.mjs C`)
V (base | tip): rows drawn 2,767 | 2,767; shown 2,541 | 2,767; ROWS DROPPED AT VIEW 226 in 210 towns | 0 (owner and shared alike); SHORT OF BAND
123 | 0; SHOWING NONE 47 | 0; the founding row dropped 75 | 0. The drawn set moved in 210 towns, exactly the 210 droppers. A drawn row with a
need the full record does not hold: 0. HELD IN FULL AND REFUSED BY THE FLOOR, by need: coast 158 held / 158 at the floor; navigable 375 / 375;
river 217 / 217; smith 406 / 406; market 500 / 500; farmland 450 / 450: refused 0.
THE TWO CORPORA TOGETHER: 487 rows dropped in 444 towns -> 0; 277 short -> 0; 104 showing none -> 0; 158 founding rows dropped -> 0.
THE OLD TOWNS, V: re-stamped 0.9.0 and stampless: the drawn set, the shown set, the shared rows and the owner's text equal the base's on 900
of 900, both ways (with C: all 1,800 twice over).
THE OLD TOWNS RENDERED (C, 900; the Traditions tab as the owner sees it, in player view, on the shared page, and the stamp's rows): a re-stamped
0.9.0 town: 0 towns differ on each of the four; a stampless town: 0, 0, 0, 0. As born (0.10.0): 234 differ on each (the cure); the tab prints
"No traditions are recorded" on 57 base pages and 0 tip pages. The owner's player view != the shared page's rows: base 0, tip 0.
WHAT LEFT AND WHAT CAME in the towns whose set moved (names): gone, the fairs of towns that hold no market ("The Founding Fair" C 15 | V 9,
"The Fair of the Founding" 12 | 7, "The Old Fair" 7 | 9 …) and the forge rites of towns with no smith; come, feasts, processions and offerings
(182 | 165 distinct names). No town draws the same name twice (base 0, tip 0).

## A NOTE ON THE RUNS (04:58 UTC)
The container restarted at about 04:57 UTC (my own fault: the base renders of V, a mutant batch, an extra-surface sample and the push's hooks
were running together, against the brief's "one heavy run at a time"). Nothing on disk was lost; the scratch tree of the mutants was restored
(`git checkout -- .`), the renders resume from their written lines, and from here one heavy run goes at a time. The notes commit eae9d1721 was
not pushed by that attempt (the hooks were cut in lint); it is pushed again below.

## (6) part 2, the WIDER SETS for the cures no test of their own held (`mut/mutants-122b.json`; baseline 0 red of 337 cases in 25 files)
- B1, plague T2 loses its exclusion: 0 red of 90 (dailyLife, dailyLifePageEight, dailyLifeAutomatic, dailyLifeNewLines, dailyLifeNoPeople,
  dailyLifeOutsiderUnspokenRecent, dailyLifeNoRepeat, declaredLineShape, declarationRegisters). Monster overrun (T0 and T1 together): 0 of 90.
  Monster frontier (T0 and T1): 0 of 90. NO TEST HOLDS THESE FIVE EXCLUSIONS.
- A3, the Overview prints the stored description: 0 red of 210 (goldenViewModel, viewModelParity, pdfParityFixes, sections.smoke,
  screenParitySource, statePrintParity, parityContractExemptions, journalPrintsTheTabsLeaf, tensionSeverityOneWord, tabs.smoke, dossier.smoke,
  entityIndex, overviewIdentityRow). The PDF's three slices print the stored description: 0 of 210. The search row is handed no settlement:
  0 of 210. The PDF's dedupe reads the stored sentence: 0 of 210. NO TEST HOLDS A3 AT THOSE FOUR CALL SITES (only the helper and the History row).
- HELD: the vacuous row (A5), C7 no longer excludes the full-fields atom -> close7Mirror (2 of 21); K2 needs a fact no place holds ->
  close7Mirror (2). The field rule never refuses -> traditionFieldRite (3 of 16); farmland no longer admits the field rite -> traditionFieldRite (1).
IN ALL: 57 mutants of the cures (53 in batch 1, one equivalent besides; A5's two and the field rule's two in batch 2): 46 RED, 11 GREEN.
A CURE NO TEST HOLDS: A3's four call sites, B1's five exclusions, B2's MODERATE row and its CRITICAL band (the first nine re-run on wider sets
in seven mutants and stay green; B2's two re-run on a wider set of their own: 0 red of 215 each (viabilityTruePage, economyStateProseDesk,
bar6EconStateShown, bar6DefDeskGuards, bar2CorpusGuards, bar3CorpusGuards, dailyLife; that set's baseline 0 red of 215)).

## (1) CORPUS V, the base's own counts — CONFIRMED (the base's pages of V rendered by me, 900; `an-items.mjs V base`)
My ports reproduce R-TABLE's V column exactly: R1 9; R3 session 893; R4 6 (innocent 2); R5/R10/R12 89 (innocent 125), soft pair 62; R6 14
(innocent 82); R7 78 (innocent 40); R8 woods 19 (innocent 17); R8 commodity 37; R11 14 (innocent 7); R13 210 (innocent 529). (C's: 12, 892, 12,
165, 151, 12, 94, 0, 120, 0, 243: the same.) Other surfaces of the base on V: R1 shared 6, PDF 9, Foundry 9, table / session / Tonight 6, search
6, AI 6; R4 shared 6, PDF 6; R5 shared 57, PDF 87; R6a shared 12, PDF 14; R7 shared 78, PDF 78; R8a shared 19, PDF 19, Foundry 19.

## (1) and (2) ON THE RENDERED PAGES, CORPUS V, all 900 — CONFIRMED (the same harness and scripts as C; the stale walk on 313 sampled towns)
RECORDS: record hash equal 900/900; the born JSON equal 900/900 (and by births alone on both trees, `an-births.mjs`: RECORDS MOVED 0). THE STAMP
differs in 333 towns: traditions 210, general:viability 78, economy:economics 77, power:desk 11, viewModel:viability 9.
EACH ITEM, pages with the fault, base -> tip:
- A1 (R1): owner 9 -> 0; shared 6 -> 0; stale 0; PDF 9 -> 0; Foundry 9 -> 0; table / session / Tonight 6 -> 0; search 6 -> 0. AI grounding 6 -> 6.
- A2 (R3, the session sheet): 893 -> 0.
- B1 (R4): owner 6 -> 0; shared 6 -> 0; PDF 6 -> 0; AI 6 -> 0.
- B2 (R5/R10/R12): owner 89 -> 45; shared 57 -> 15; PDF 87 -> 43; Foundry 5 -> 1; the stale page keeps its own (18 of the 313 sampled).
  THE 45: 36 a person's secret on the NPCs tab; 14 a History line of a past debt whose hook does not print (beside "pays its way" 10, "puts
  things by" 2, "had money laid by" 2); and dp-town-118, where the measure's word test takes "whoever the merchants and the creditors decide to
  deal with" (a succession line) for a debt: no place debt is on that page. NO PAGE OF V HOLDS A PLACE DEBT IN FORCE BESIDE A LINE OF THE
  MEASURE's A CLASSES. The soft pair: 62 -> 63.
- A3 (R6a): owner 14 -> 5; shared 12 -> 4; PDF 14 -> 5. The five: dp-town-8, dp-town-68, dp-city-10, dp-city-130, dp-metropolis-92, each the
  History timeline's past event. The named twin on 45 pages (owner, shared, PDF, Foundry; 16 of the sampled stale pages).
- A4 (R7): owner 78 -> 0; shared 78 -> 0; PDF 78 -> 0; the stale page keeps it (29 of the sampled).
- B3 (R8a): owner 19 -> 0; shared 19 -> 0; PDF 19 -> 0; Foundry 19 -> 0; THE STALE PAGE IS CURED TOO (19 of its lines move: the foodways line
  is read at view). Pages printing "the hunters' game" with no woodland: 15 -> 34 (the 15 that said so before and the 19).
- R8b 37 -> 37, R11 14 -> 14, R13 210 -> 210: untouched (point 123's).
EVERY PRINTED LINE THAT DIFFERS, BY ITEM: owner 1,488 lines in 381 towns (Traditions 210, Outlook 86, Daily Life 79, Overview 45, History 45,
Economics 27, Power 11, Crisis 9, Plot Hooks 6); shared 1,468 lines in 370 towns. LINES NO ITEM EXPLAINS: 0 (my sorter left one hunk of two
lines at dp-hamlet-133, owner and shared, where two items meet: B2's emptied slot, "People here put things by, and can. …" gone, and B1's
Outsider Impressions sentence beside it; read by hand, both are the items' own). The stale page against the base's shared page: 54 lines in
37 of 313 towns: B3 19, A3 16, A1 1, B1 1.
B2, THE OTHER DIRECTION, on the owner's pages of V: a savings or pays-its-way line of the base no longer prints on 83 pages; ON 31 OF THEM THE
PAGE PRINTS NEITHER a place debt in force nor "nothing laid by" / "would have to borrow": the Defense tab says WEAK v3 "short of money for
years" 17, WEAK v4 "could not find the wages" 12, CRITICAL v1 2. THE SLOT GOES EMPTY ON 18 PAGES (the Daily Life tab's standing-of-living
line; the list is above, (1) at the function level: the same eighteen). The slot otherwise: COMFORTABLE -> v4 36, -> v3 5; MODERATE -> v2 11,
-> v1 4; C3 -> v1 5, -> v3 3; the Outlook row -> "gets through the year, buying in …" 7 and "Some of what {S} eats is brought in by road …" 2.
A3's GRAIN ON THE RENDERED TABS (the finding of (3)): V dp-city-21, owner and shared alike: Overview and History "A critical resource, grain,
is running short, and some are hoarding it while others cannot pay the prices asked"; Economics "Stores: a granary, about nine months of grain."
and "Nothing on Yurtkul's tables suggests to a visitor that food is a worry here."; Defense "the granary would carry the city for about nine
months at full rations". dp-metropolis-95: "about 15 months of grain"; "for more than a year at full rations".

## (4) THE OTHER SURFACES OF THE DOSSIER — a sample of 142 faulted towns of C (`tools/h122b.jsx`, `scripts/run-pages2.sh`; `an-items.mjs`) — CONFIRMED
The owner's PLAYER VIEW, a SAVED dossier (read-only, with a save id) and the DM's share (the full projection), base -> tip, pages with the fault:
A1 player 8 -> 0, saved 12 -> 0, DM share 8 -> 0; B1 12 -> 0 on each; A4 34 -> 0 on each; B2 player 56 -> 8, saved 56 -> 8, DM share 51 -> 5
(the eight are of the owner's residue: a person's own debt, a past debt's History line, dp-town-133); A3 player 12 -> 6, saved 12 -> 6, DM
share 8 -> 5 (the past events). So: EVERY SURFACE THAT PRINTED A FAULT IS CURED WHERE THE OWNER's TAB IS, save two: a shared page stamped
before the change (B2, A4, T as stamped), and the AI grounding text (A1's builder's note 10 | 6; A3's unnamed sentence).

## (5) THE WALK AND THE PLANTS ON CORPUS V, the tip — CONFIRMED (`scripts/run-trad.sh`, `an-plants.mjs out/trad-tip122-V`)
THE WALK: 240 births (40 a size), 115,814 addresses hidden one at a time (60 kinds of address) and all at once: the reader's rows moved 0; the
owner's drawn set moved 0; the served page's rows equal the composed rows 240/240. Over all 900: the owner's shown set == the shared rows
900/900; a row that names a hideable house 0 (363 towns hold one).
THE PLANTS (900 towns each): the DM-made market, the criminal house named like a catalogue market, the criminal smith: the reader's rows differ
from shown in 0 towns, every way; owner's shown != shared rows 0. The clandestine-by-facet smith (the function eye): rows differ in 127 of 900
(dp-village-16: ["The Feast of the First Landing","The Contest of the Hearth"] against [… ,"The Vigil of the Forge"]). The criminal
'Farmland': 49 of 900 (dp-hamlet-42: "The Furrow Offering" against "The Long Sun Contest"); with no grain among the food sources 117 of 900.
(C: 198, 55, 269. Both are the base's too: (5) on C.) So, C and V together, 480 births walked, 238,086 addresses, 1,800 towns planted six ways.

# POINT 123 — `lane/stack-123-wip-2026-11-28` at 003fd3b071b340c46b59650f22b63915cf58fd0e (found on origin at 05:54 UTC; it holds 777733a2a)
`git diff --stat 777733a2a 003fd3b07`: 20 files, +409 −61 (7 under src, 10 test files, 3 registers); 25 commits (2 merges: 97c9223a2 R-BIRTH,
6db89ad83 B4). WHAT IT IS, BY READING THE WHOLE DIFF (it is MORE than the three birth items the brief names):
- C1 `src/data/people/personMention.js :: mentionOf`: a later mention takes the card's role only where the role carries its article
  (/^the\s/); a name that is itself a description ("The Veteran Soldier") is printed whole; a bracket qualifier is set aside before the
  surname is read (`bareWords`). Called by `secondMentions` (the generators' `goals.js`, `npcData.js`): AT BIRTH.
- C2 `src/data/resourceData.js`: `date_palms` commodities ["dates"] (grain gone); its third trade good "Pressed dates" (was "Desert grain").
- C3 `src/domain/display/tradeListDisplay.js :: importsAsPrinted` (AT PRINT): a need the place's own commodities meet (`commoditiesShown`, not
  failed) leaves `needed`; `src/domain/facts/needNotBroughtIn.js` (the eager leaf, read AT BIRTH): the same rule in the record's words
  (`ownCommodities`, `FAILED_FOOD_COPY`), and `famineInForceOf` (FIX-123, ruling 123-J-1: the leaf's own reader of the famine in force, in
  place of an import of `crisisKind.js` that closed a chunk cycle); `factLayers.js` declares `stress` and `stressors` for the leaf.
- RULING 122-A-2 (the cure of my finding of 04:31) `display/tensionDescriptionShown.js :: storesHold`: the twin is not printed where the good
  is "grain" and the stores reader (`tonightSheet.js :: foodStoresWords`) reports a granary. AT PRINT.
- RULING 122-T-5 (the cure of my note of 03:46, the farmland half) `traditions/genesis.js :: fieldRiteRefused`: the farmland atom is asked of
  the floor. RULING 123-J-2: the needs memo typed. RULING 122-T-4: the needs-held test's seed loops collect every failing seed.
- Registers: writer-reach, the lighting census, the tuning inventory. One exemption row added to `tests/lint/chainPrintSites.walker.test.js`.

## (2) 123, THE BIRTHS OF C — CONFIRMED (`an-births.mjs`, `an-attr.mjs`, `an-c1.mjs`; the page harness's rec lines, all 900, both tips)
RECORDS MOVED: 261 of 900 (thorp 4, hamlet 30, village 36, town 75, city 57, metropolis 59). THE KEYS THAT MOVED, seven paths and no other:
relationships[].tension (182 values, 169 towns), relationships[].description (147, 136), prominentRelationship.phrasing (7), .tension (7),
.full (5), pressureSentence (4), institutions[].desc (25, 25). The stamp a save composes differs in 1 town (economy:economics).
BY ITEM, BY RE-BIRTH (the 261 moved towns re-born on the 123 tip with ONE item alone, the other two reverted in memory at bundle time, and
with NONE: `plants/onlyC1.json` …): with no item the birth equals point 122's in 261 of 261; C1 alone bears 352 of the moved values, in 243
towns (every relationships / prominentRelationship / pressureSentence value); C3 alone bears 25, in 25 towns (every institutions[].desc: the
Annual fair's line, "A yearly fair for regional merchants. The luxuries the town wants do not reach it." -> "Regional merchants. Luxury goods
available."); C2 none (C holds no date palms); a value more than one item bears 0; A VALUE NO ITEM BEARS: 0.
C1's FILLS (352 strings): what left: Lord Mayor 82, Elder 74, Mayor 56, First Magnate 48, Master of the Guilds 43, Headman 18, Alderman 11,
Speaker of the Assembly 9, First Councillor 6, Reeve 5. What came: the person's SURNAME 345, the GIVEN NAME 7 (where the two named share
the surname: dp-village-9 "Eudokia Chortasmenos taught Photeine Chortasmenos everything, including how to get the better of Eudokia.");
none of another kind. dp-thorp-132: "Giolla Sullivan has begun teaching Tadhg Kelly's methods as Elder's own." -> "… as Sullivan's own."
A patronymic keeps its last word only: dp-metropolis-122 "… what favour Huda ibn Abbas owes Rashida ibn Arabi, and now has a hold on Abbas too."

## 123, THE NEED LEAF (the chair's added question) — corpus C, CONFIRMED (`tools/hN.jsx`, `scripts/an-need.mjs`, `an-need-rendered.mjs`)
On the 900 births of the 123 tip: `needListOf(record)` == `importsAsPrinted(record).needed` (the page's reader), item by item, 900 of 900.
AGAINST THE RENDERED TAB: the Economics tab's line "Needed, and not brought in: …" (through the tab's own display pass, `neededNamesShown` over
`plainGoodName(resourceDisplayName(n))`) equals the leaf's list in 841 of the 841 towns that print one; the page prints none and the leaf
holds none in the other 59; a page with a list and no leaf answer, or the reverse: 0. The shared page: 841, 59, 0.
On the SAVED births of point 122 read at the 123 tip (C and V, 1,800): leaf == page reader 1,800 of 1,800.

## (2) 123, THE BIRTHS OF V — CONFIRMED (the same scripts; point 122's V births against the 123 tip's)
RECORDS MOVED: 226 of 900 (thorp 3, hamlet 32, village 45, town 46, city 52, metropolis 48). The stamp a save composes differs in 1 town.
BY ITEM, BY RE-BIRTH: with no item the birth equals point 122's in 226 of 226. C1 alone bears 285 values in 210 towns (relationships[]
.tension 143, .description 129, prominentRelationship.full / .phrasing / .tension 4 each, pressureSentence 1). C3 alone bears 4, in 4 towns
(institutions[].desc, the fair's line). C2 alone bears every other moved value, in the 17 palm towns whose record moved: A VALUE NO ITEM
BEARS: 0.
C2's KEYS (17 towns; `an-c2.mjs`): economicState.primaryExports ("Desert grain" -> "Pressed dates", 16 towns); economicState.localProduction
and resourceAnalysis.availableResources ("grain" gone, 15 towns each); AND THREE THE COMMIT's MESSAGE DOES NOT NAME:
- resourceAnalysis.imports.critical gains "Bulk grain and foodstuffs" in SIX towns (dp-town-118, dp-town-147, dp-city-54, dp-city-55,
  dp-city-77, dp-city-113; reason "Desert/Arid terrain cannot produce this locally"), and in dp-city-55 also "grain" ("Required by Mill but
  not available in Desert/Arid terrain") with a gap row for its Mill;
- economicState.incomeSources loses "Grain Sales" in THREE (dp-town-118, dp-city-55, dp-city-77), the other shares re-weighted (dp-city-55:
  26% -> 27%, 10% -> 11%, 3% -> 4%);
- resourceAnalysis.gaps gains one row (dp-city-55).
  On the page (dp-city-55): exports "Date harvest · Pressed dates …"; "grain" gone from what it makes and from the Resources chips; the
  critical-import line now names grain ("A good part of the grain Kitatang's work uses must come from elsewhere…", was iron ore). Each
  follows from the palms giving no grain. A palm town beside grain fields keeps its grain (dp-thorp-68: the chip moves from the palms to
  "Extensive Grain Fields").
C1's FILLS ON V (285 strings): surname 276, given name 9; none of another kind. What left: Elder 51, Master of the Guilds 50, First Magnate
24, Alderman 18, Lord Mayor 18, Elder Priest 13, Archmage of the Senate 13, Mayor 11, Lord Marshal 11, First Councillor 11, Household Elder
10, Speaker of the Assembly 10, Warden of the Council 8, Reeve 7, Headman 7, Lord Protector of the Faith 7, Burgomaster 4, Lord Warden 3,
Doge 3, Lord Burgomaster 3, Archmage of the Council 2, Captain-Mayor 1.

## (2) 123, EVERY PRINTED LINE THAT DIFFERS between the two tips' pages of their own births — CONFIRMED (`an-diff123.mjs`)
C, owner's tabs (the fresh shared page beside it): C1 680 lines in 243 towns (676 in 241): World/Relationships, and the Overview's
prominent-relationship and pressure lines; C3 at birth, the fair's line, 50 lines in 25 towns (Institutions); C3 at print, the need line, 200
lines in 100 towns (the line without "luxury goods") and 20 towns where the line goes whole (it stood alone); and ONE KNOCK-ON OF C3, 2 lines
in 1 town: dp-town-0, Daily Life, "Xiaxian feeds itself and has nothing to spare. Some of what its work needs does not reach it, and there is
no line for anything else." -> "Money is short in Xiaxian, and most households spend what they earn as soon as it comes in." (the standing-of
-living line whose mark reads the need list: the list is empty now). LINES NO ITEM EXPLAINS: 0.
V, owner's tabs (shared): C1 554 lines in 210 towns (544 in 208); C2 118 lines in 17 towns (Economics and Resources: the chip lists, three
income shares, the "Grain Sales" row gone in three); C3 at birth 8 lines in 4 towns; C3 at print 66 lines in 33 towns and 4 lines gone whole;
RULING 122-A-2, the grain twin back to the stored sentence, 44 lines in 11 towns (Overview and History). LINES NO ITEM EXPLAINS: 0.

## 123, THE NEED LEAF — corpus V, and its crisis reading — CONFIRMED
V, the 900 births of the 123 tip: `needListOf` == `importsAsPrinted(record).needed` 900 of 900; the rendered Economics line equals the leaf's
list in 725 of the 725 towns that print one; none and none in 175; a mismatch either way 0; the shared page 725, 175, 0. (C: 841, 59, 0.)
THE LEAF's CRISIS READING (`needNotBroughtIn.js :: famineInForceOf`) against its home (`crisisKind.js :: crisisOf(record).has('famine')`),
record by record (`tools/hF.jsx`): C 900 of 900 (11 with a famine in force); V 900 of 900 (34).
MUTANTS OF THE CRISIS READING against `tests/generators/faultsNeed.test.js` (12 cases; baseline green):
- the famine never in force -> 2 red: "its famine in force is `crisisOf`'s answer: each crisis kind and none, and every town of the sample"
  and "a constructed record: each branch of the page's reader, the leaf beside it";
- it reads the plague for the famine -> the same 2;
- `stress` read before `stressors` -> 1 red ("its famine in force is `crisisOf`'s answer …");
- any crisis fails the food -> 1 red (the same case);
- the leaf never leaves the failed food out -> 1 red (faultsNeed).

## (6) 123, THE TESTS — CONFIRMED (`test-cases.mjs 777733a2a 003fd3b07`; `mut/mutants-123.json` in a scratch tree of the 123 tip)
Ten test files: cases 137 -> 150, expects 453 -> 520, TITLES GONE 0, no skip / only / todo; 13 new cases; bodies changed 7 (traditionNeedsHeld
5: each seed loop wrapped in `collectSeedFailures` / `expectNoSeedFailures`, the same expects inside (RULING 122-T-4); faultsNeed 2: the
copies' equality and the constructed record gain C3's rows). At file level: `faultsRows.test.js` FR3's UNMET table: FIVE ROWS RE-POINTED to
other seeds (r2r-town-10 -> r2r-town-61, r2s-monster_pressure-town-3 -> -57, r2s-wartime-town-2 -> -7, bar0-town-occupied-rand-35 -> -78,
r2r-town-50 -> r2r-town-87: "the first seed of its own arm for which `luxuryUnmet` reads true and the fair prints the twin"), and one row's
good renamed ("Desert grain" -> "Pressed dates"); `bar6SeamEcon` the anchor's good renamed; `chainPrintSites.walker` ONE EXEMPTION ROW ADDED
BY HAND (`tradeListDisplay.js`: 1, "not a chain": ruling 123-J-1 STOP 2).
MUTANTS (baseline 0 red of 158 cases in 12 files): ALL 18 RED.
- C1: any role stands for its card again -> personMention (2); a description-name takes a "surname" -> personMention (1); the bracket
  qualifier not set aside -> personMention (1).
- C2: the palms give grain again -> tailDefeconCatalogueCommodities (2); the third trade good "Desert grain" again -> bar6SeamEcon,
  tailDefeconCatalogueCommodities (3).
- C3: the page's list forgets the place's own commodities -> faultsNeed, needMetUnderAnotherName (3); the page counts a FAILED commodity ->
  faultsNeed (1); the leaf forgets them -> faultsNeed (2); the leaf's luxury key never answers -> faultsNeed and faultsRows' UNMET case (2):
  SO THE RE-POINTED ROWS CAN FAIL.
- the leaf's crisis reading: four mutants, above (all red). The failed food never left out -> faultsNeed (1).
- 122-A-2: the grain named beside its granary again -> historyTab (1); any good unnamed beside a granary -> historyTab (1).
- 122-T-5: the field rite asks the full roster again -> traditionDescriptionSharedPage "THE PROPERTY" (1 of 81).
- 122-T-4: no record asks the needs -> traditionNeedsHeld 3 red of 6 (the loops as re-written still fail).
NOT HELD, AS AT 122: A3's call sites other than the History tab (the Overview, the PDF, the search row): the new 122-A-2 cases render HistoryTab only.

## (7) 123, THE REGISTERS, by reading (the doors' run: below)
`scripts/.writer-reach-baseline.json`: the freeze sha and digest; closureSizes campaign-pdf 228 -> 230, world-book 243 -> 245; five scan
counts; ONE surfaceReach row gains two surfaces (`availableResources on resourceAnalysis`: + campaign-pdf, world-book). No ceiling, no cohort.
FROZEN AT 6db89ad83 (the merge), BEFORE three later source commits (060177c71, 8396beb02, cdddc3b8b): its door's verdict at the tip is below.
`tests/lint/.lighting-census-baseline.json`: titles 32,138 -> 32,151 (+13: the thirteen new cases), suiteTitles 8,939 -> 8,943.
`tests/lint/.tuning-inventory.json`: one dependents list gains `tensionDescriptionShown.js`; two line numbers. No value moved.
GOLDENS / FIXTURES: none in the diff (`git diff --stat 777733a2a 003fd3b07 -- tests/fixtures '*.snap' '*golden*'` is empty), though births move.

## (8) 123, WHAT IS IMPORTED ANEW — CONFIRMED (esbuild's metafile and each entry bundled alone: a proxy, not the chair's five sizes)
FIRST PAINT (`src/main.jsx`): the same 259 files (+1,025 source bytes: `personMention.js`, `resourceData.js`). THE GENERATION WORKER: 464 ->
466 files: `display/resourceDisplayName.js` and `display/labelCase.js` anew (the eager need leaf imports the Resources tab's labels): +2,564
B minified. PDF render worker +1,933 B; advance worker +1,250 B; Foundry +1,928 B: no module anew (122-A-2's import of `tonightSheet.js`
was already reached). The message of 060177c71 says the labels' table "rides engine-core (eager): left as it is".

## (1) 123, EACH ITEM's OWN COUNT, the 122 tip's pages against the 123 tip's (each of its own births) — CONFIRMED (`an-items.mjs`, `an-r13rec.mjs`)
C1 (R13): owner's tabs C 243 -> 0, V 210 -> 0; shared 241 -> 0, 208 -> 0; table / session / Tonight 4 -> 0, 1 -> 0; AI grounding 135 -> 0, 124
  -> 0. AT THE RECORD (the tie strings every surface prints: relationships[].tension / .description, prominentRelationship, pressureSentence):
  towns holding a bare role where a name belongs C 243 -> 0 (352 strings), V 210 -> 0 (285). My page port still fires on the PDF (C 594 -> 465,
  V 509 -> 399), Foundry (737 -> 735, 673 -> 671) and the search text (776, 702, unmoved): there it meets OTHER constructions, the base's too
  (an apposition, "One person worth knowing: Moira MacDonald, the head shepherd, Elder, first of Elder Council."; the search's role field): no
  tie line among them.
C2 (R11): owner V 14 -> 0 (C holds no palms); shared 14 -> 0; Foundry 14 -> 0; PDF 19 -> 10 by my port, and the ten are the IMPORTS row
  "Grain" of palm towns that now buy the grain they do not grow (dp-town-118: "IMPORTS · Grain · Salt"): no page prints grain as made or sold.
C3 (R8b): owner C 120 -> 0, V 37 -> 0; shared the same.
THE ITEMS OF POINT 122 at the 123 tip: A1, A2, A4, B1, B2, B3 as at 122 (C: 0, 0, 0, 0, 75, 0; V: 0, 0, 0, 0, 45, 0). A3 (R6a) C 6 -> 6; V 5 -> 7
  owner (4 -> 6 shared, 5 -> 7 PDF): RULING 122-A-2 sends the eleven grain twins of V back to the stored unnamed sentence, and on two of
  those pages another line names the short good, so the measure's own test counts them again.

## 123, A SAVED TOWN READ AT THE 123 TIP — the off-tab surfaces, all 1,800 saved births of point 122 (`an-site123.mjs`, `an-need.mjs`) — CONFIRMED
POINT 123 IS NOT ONLY AT BIRTH. The same saved records, read on the 122 tip and on the 123 tip:
- C3 AT PRINT: the page's need list loses "luxury goods" in 120 saved towns of C and 37 of V (the PDF's Economics and Resources chapters lose
  the item; where it stood alone its heading goes: "IMPORT DEPENDENCIES" 6 + 1, "CRITICAL DEPENDENCIES" 1), and one line more: C dp-town-0's
  standing-of-living line (above), whose mark reads the list. (The leaf equals the page's reader on all 1,800 saved records.)
- RULING 122-A-2 AT PRINT: 11 saved towns of V print the stored scarcity sentence where the 122 tip named grain (PDF 22 lines, Foundry 22).
- C2 AT PRINT: 13 saved palm towns of V lose "Grain" from the PDF's "LOCAL PRODUCTION" list though their record still holds it (dp-hamlet-102,
  dp-town-118 …): a reader of the list asks the catalogue at view.
- C1: nothing (the tie strings are stored). Foundry, table, session, Tonight, AI, search, the lit Traditions chapter: no other line differs.
- THE TRADITIONS DRAW of the saved records (as born, re-stamped 0.9.0, stampless): unmoved on 900 of 900, C and V (the `site` block's
  traditions keys: 0 moved): RULING 122-T-5 moves no born town and no old town of the corpora.
The tabs of a sample of these saved towns: below.

## 123, A SAVED TOWN ON THE TABS — a sample of point 122's births and stamps (C 251, V 207: every sixth town and every town whose off-tab
## surfaces moved), rendered by ONE harness on the 122 tip and on the 123 tip (`tools/h123s.jsx`, `scripts/run-saved.sh`, `an-saved.mjs`) — CONFIRMED
C: 131 pages with no line differing. The need line: re-listed without "luxury goods" in 100 towns, gone whole in 20 (owner's tab and the
shared page alike: the line is read at view). ONE line more, on the owner's tab only: dp-town-0's standing-of-living line (the shared page
keeps the stamped "Some of what its work needs does not reach it …" above a need list that is now empty, until its owner saves).
V: 146 pages with no line differing. The need line 33 + 4 towns; RULING 122-A-2's grain twin back to the stored sentence in 11 (Overview
and History, owner and shared); AND C2 AT PRINT: 13 saved palm towns lose "grain" from the Economics tab's made-here list (dp-hamlet-102:
"grain · dates · medicinal herbs …" -> "dates · medicinal herbs …"), on the owner's tab and the shared page, while the saved record still
holds it and the stored export "Desert grain" still prints. Nothing else differs on any sampled page.
SO, OF A SAVED TOWN AT POINT 123: its record is not touched; its PAGE is, at print, by C3 (120 | 37 towns), by 122-A-2 (0 | 11) and by C2
(0 | 13). The brief's "a saved town is not touched" holds of the record and of C1 only.

## (5) 123, THE TRADITIONS DRAW AND THE VEIL at the 123 tip — the 900 births of C on that tip — CONFIRMED (`run-trad.sh`, `an-plants.mjs`)
THE WALK: 240 births, 122,272 addresses hidden one at a time and all at once: the reader's rows moved 0; the owner's drawn set moved 0; the
served rows equal the composed rows 240/240. All 900: the owner's shown set == the shared rows 900/900; a row naming a hideable house 0.
THE PLANTS: the DM-made market, the criminal market, the criminal smith: 0 towns differ, every way. THE CRIMINAL 'Farmland' (RULING 122-T-5):
the reader's rows differ between shown and hidden in 0 of 900 (55 at the 122 tip); with no grain among the food sources 0 of 900 (269). The
field rite refused with the house shown 226, with the house gone 226. THE CLANDESTINE-BY-FACET SMITH (the function eye): 198 of 900 still
(`galleryVeil.js` is not in point 123's diff): dp-thorp-20 ["The Sun Feast","The Feast of the Harvest"] against [… ,"The Offering of the Forge"].
THE OLD TOWNS at the 123 tip: the saved births re-stamped 0.9.0 and stampless draw, show and share as at the 122 tip on 1,800 of 1,800 (the
`site` block's traditions keys, C and V: 0 moved), and the 122 tip equals the base (above): so, as the base.

## 123, THE BUILT APP BOOTS (the chair's added question) — CONFIRMED (in the worktree of the 123 tip; no tracked file changed after)
`npm run build`: exit 0 ("built in 41.41s"; the prerender wrote 313 static route documents). `VERIFY_DIST=1 npx vitest run
tests/build/bootSmoke.test.js`: exit 0; 11 cases: 9 passed, 0 failed, 2 skipped (the two FLAGGED-bundle cases, which ask
VERIFY_ENGINE_REMOTE_DIST=1: the production artifact built with VITE_ENGINE_REMOTE=true was NOT built or booted by me). Passed among them:
"the built bundle boots: scripts/boot-smoke.mjs passes against dist/ (acyclic chunk graph · every chunk initialises · the shell mounts)" and
"boot smoke is not vacuously skipped". Vite's own sizes at this tip, for the record (the five sizes are the chair's): pdfRender.worker
3,150.64 kB; advanceInterval.worker 3,054.90 kB; generation.worker 2,744.09 kB; engine-core 323.11 kB; coherence-lazy 298.77 kB.

## (7) 123, THE DOORS, RUN BY ME IN CHECK MODE on a clean tree of the 123 tip (/home/user/doors123; `scripts/doors123.sh`; no tracked file changed after)
`check-writer-reach.mjs` exit 0 (the register, frozen at the merge 6db89ad83, still agrees with the tree at the tip); `check-observed-shape-
readers.mjs` exit 0; `wiring-census.mjs --check` exit 0; `generate-dossier-state-prose.mjs --check` exit 0; `stable-pick-ids-door.mjs` exit 0.
The walkers, each alone: chainPrintSites 6/6; tuningRegister 76/76; samenessHideable 31/31; proseWiringCensus 79/79; writerReach 52/52;
observedShapeBaseline 59/59; sovereigntyLightingContract 34/34; stablePickIds 33/33. `dossierStateProseProjection.contract`: the same two red
of 79 with the same messages as at the base and at the 122 tip (the owner-gated shift register: "expected 3183 to be 3182"): not this point's.
So at 123: no ceiling raised; no shrink-only register widened; no golden re-recorded (none is in the diff: the goldens of a lane branch are
signed at the merge point, and I ran none); ONE exemption row added by hand to `tests/lint/chainPrintSites.walker.test.js`.

## WHAT I DID NOT CHECK
The whole suite (not mine to run); any golden at the merge point; a real browser; the PDF's bytes (the document's element tree stood for
it); the hosted share and the edge function; the FLAGGED production bundle (VITE_ENGINE_REMOTE=true); `npm run build` at the 122 tip alone;
the old towns rendered on V (function level only there; rendered on C); the commit 13f06f00d's red boot (taken from the message of 060177c71).
