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
