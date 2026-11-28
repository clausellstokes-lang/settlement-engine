# DELTA READER 122-123 — running notes (the independent reader of the cure of points 122 and 123, a DELTA read)

Own cloud container (session of 2026-11-28, started 14:11 UTC by `date -u`). Every number below is from my own scripts in the
scratch (`/home/user/rd/s/tools`, outputs in `/home/user/rd/s/out`) unless a line says otherwise. Nothing is carried from the
first reader's notes (read for method only).

## 0. Setup
- `npm ci` exit 0; `git fetch --unshallow origin` exit 0; `review-fixes-2026-07-08` fetched as a local ref.
- Chair's record `lane/chair-2026-11-08` at ceffec463 (worktree /home/user/rd/chair, read only). My branch
  `lane/reader-122-delta-2026-11-28` is cut from that tip (worktree /home/user/rd/push).
- BASE 003fd3b07 (/home/user/rd/base); THE CHANGE a03ba9359 (/home/user/rd/tip; 39 commits, a fast-forward of the base; 23
  files, +826 −276); THE LINE aef8f9962 (/home/user/rd/line); point 122's tip 777733a2a (/home/user/rd/p122, for the palm
  births of (c)). node_modules linked; `npx husky` in each.
- Read whole: the brief; RULING-122-B-2.txt (body and three addenda); the first reader's report, notes and interim (method
  only); the delta (every src and test hunk, every register commit's message).

## The delta, by reading (each claim then executed below)
- B2 (122-B-2 unit 1): `economyStateProse.js :: SOLVENT_LINES` gains MODERATE v1 on `owes` and C3 v1 (with v2) on `owes`;
  `solventCorpus` refuses the union of the rows that hold.
- 122-B-5 (net of 122-B-4's plumbing in and out): `solvencyShown.js :: owesDebtShown` reads the indebted stress and the
  outside_debt tension ONLY (the hook leg and its `collectPlotHooks` import gone). No `audience` remains in src.
- 122-B-2 unit 3: `criticalImportRow`, `bareCommonFill`, `properFill`, `TERRAIN_ONLY_RE` moved word for word to the leaf
  `display/criticalImportRow.js` (imports only `data/houseSentenceName.js`); the desk imports them back.
- 122-B-3: `traditions/functionEye.js` (no import) holds FUNCTION_EYE_KEYS ['tags','facets','serviceKeys'] and its own
  `withoutFunction`; `traditionFloor.js` imports it.
- Unit 4 / 122-B-3 4(b): `slashInProse` ("a/b" -> "a or b") at the tension's named twin, DS-ECO-12's `{good}` and
  DS-ECO-11's `{resource}`.
- 122-A-3: `tensionDescriptionShown` returns the stored description where `userEdits.js :: isEdited(tension, 'description')`.
- 123-C2-1: `tradeListDisplay.js :: localProductionAsPrinted` joins the record's own grounds
  (`resourceAnalysis.availableResources`: a ground key, then the goods it added) to the catalogue's for each good.
  NB `madeHere` (the needs line) reads `localProductionAsPrinted`, so this can also move the need list (checked below).

## Method
- MY HARNESS (`tools/rdh.jsx`, `rbuild.mjs`, `rboot.mjs`, `rpar.sh`; from the chair's rmeasure harness): each plan row born
  exactly as the page battery births it (`birthConfig(row.config)`, `{ seed, customContent: {} }`), stamped as a save stamps
  it (`withPublicProse(town, composePublicProse(town))`), then: THE FUNCTION LEVEL (the debt legs, `owesDebtShown`,
  `nothingLaidByShown`, every slot of `economyDeskRead` for the owner and the player, the Outlook's verdict row
  (`deriveViability(s).summary`), the tensions as shown, the made-here and trade lists, a hash per stamp block and per
  `buildPrintProse` key); THE OWNER's tabs (the tree's OutputContainer, every group, tab and disclosure: the chair's walk);
  A FRESH SHARED PAGE (`projectShareVeil(toPublicSafe(stamped, { full: false, memberOverrides: null }), writeShareVeil(null,
  []))`, the default veil a fresh export writes, `gallery.js :: sanitizeDossier`; rendered readOnly + playerView as
  PublicDossierView does); THE PDF (props as `generateSettlementPDF` builds them; react-pdf's primitives rendered as DOM;
  one line per outermost <Text>, by <Page>). A measure's variant is built with `PATCH=` (an esbuild onLoad edit of one
  source string; never a tree edit).
- vids are read off the pool's own templates (`economy.generated.js`; the tier noun allowed for "the town"), as the delta's
  own test does: the desk's `provenance.vid` indexes the FILTERED pool, so it cannot be used.

## (a), (b) AT THE FUNCTION LEVEL — CONFIRMED (`tools/an-fn.mjs`, `an-empty.mjs`, `an-hook.mjs`; all 900 of C and of V)
- RECORDS MOVED: 0 | 0 (sha256 of the born record, 900/900 equal on each corpus). Births errors 0.
- WHO OWES on the tip: C 63 (indebted stress 25, outside_debt tension 63), V 61 (29, 60); `owesDebtShown` == stress||tension on
  1,800/1,800. OWED ON THE BASE BY THE HOOK LEG ALONE: C 25, V 18 (all now `owes` false). Nothing laid by alone: C 403, V 331.
- (a) BESIDE A PLACE DEBT IN FORCE on the tip: header C3 v1 or v2: 0 | 0; the tile MODERATE v1 or v3: 0 | 0; COMFORTABLE v1 or v2:
  0 | 0; the Outlook's verdict row with a pays-its-way / surplus / money word: 0 | 0. (Every desk slot scanned: the one word hit
  is DS-ECO-9's food line "what it keeps put by would not outlast a run of poor harvests": food, not money.)
  STILL PRINTED, AS RULED (the survey's): MODERATE v4 "accounts still balance, and that is the one thing about the town the
  crisis has not yet reached" beside a debt: C 23, V 9.
- MOVES base -> tip, by slot (C | V): owes: header C3 v1 -> v3 14 | 5, C3 v1 -> EMPTY 29 | 17; tile MODERATE v1 -> v2 1 | 4,
  v1 -> v4 15 | 4. Hook-only (122-B-5): header C3 v1 -> v2 7 | 3, C3 v3 -> v2 2 | 0; tile COMFORTABLE v3 -> v1 2 | 1, v3 -> v2 4 | 0,
  EMPTY -> v1 0 | 1 (V dp-city-47). Verdict row moved 13 | 9, all hook-only. Slash fills (V only): DS-ECO-12 critical import 41,
  DS-ECO-11 exploitation 5, the tension's twin 3. NOTHING ELSE MOVED at the function level: no other desk slot, no tension
  beyond the 3, no made-here or trade list, no stamp block but economy:economics and viewModel:viability, no print-prose key
  but economics, daily_life, resources. A refused line in a town with NEITHER fact: 0 | 0.
- THE EMPTY SLOTS (the no-refusal variant `PATCH` SOLVENT_LINES = [] against the tip; a slot the variant fills and the tip
  leaves empty): header (DS-ECO-1 C3, all `owes`) C 29, V 17; standing-of-living tile (DS-ECO-8 COMFORTABLE) C 2 (nothing laid
  by alone: dp-village-5, dp-village-13), V 17 (nothing laid by alone 12: dp-thorp-107, dp-thorp-129, dp-hamlet-88, -91, -102,
  -116, -133, dp-village-6, -27, -36, -90, -125; beside a debt 5: dp-city-2, -65, -77, -98, dp-metropolis-15); treasury tile 0 | 0.
  THE BUILDER's 29 | 17 and 2 | 17: CONFIRMED. Header C: dp-thorp-0, -29, -31, -34, -88, -99, -106, -108, -145, dp-village-2,
  -39, -45, -92, dp-town-13, -23, -60, -77, -84, -94, -122, dp-city-42, -64, -69, -86, -93, -113, dp-metropolis-0, -18, -75.
  Header V: dp-thorp-29, -31, -116, dp-village-5, -48, -92, dp-town-13, -23, -60, -65, -77, -103, dp-city-92, -98, -142,
  dp-metropolis-0, -75.
- THE HOOK-LEG TOWNS, PLANTED (`an-hook.mjs`: every town with an outside_debt event, C 89, V 79, the saved record and the same
  record with its event's `plotHooks` emptied, each re-stamped on its tree): on the tip the stamp is BYTE-EQUAL hook on and
  off in 89/89 | 79/79 (and the desk, the verdict row and the print prose likewise); on the base the hook moved the stamp in
  22 | 11 towns (all hook-only: the plant reaches). The tip's town == the base's town with its hook taken off (desk, verdict,
  stamp, print prose) in 88/89 | 68/79; every exception is a town that owes by stress or tension or holds the slash (U1's or
  U4's own move), none hook-only. So each hook-only town now prints what it printed with no debt hook: 25/25 | 18/18.

## (c) 123-C2-1, THE SAVED PALM TOWNS — CONFIRMED, RENDERED (`tools/an-palm.mjs`; palm-*-V.jsonl)
- The 21 palm towns of V (config.nearbyResources holds date_palms; C holds none) BORN ON 777733a2a (its catalogue: palms give
  grain and dates), the saved records (with their 777733a2a stamp) read on 777733a2a, 003fd3b07 and a03ba9359: owner tabs,
  a fresh shared page of the saved stamp, the PDF, and the function level.
- On a03ba9359 the made-here list == 777733a2a's in 21/21, and every trade list (exports, arriving, imports, NEEDED, local)
  == 777733a2a's in 21/21 (so the needs line, which reads the made-here list through `madeHere`, did not move either).
- 003fd3b07 -> a03ba9359: "grain" comes back to the made-here list in EXACTLY 13 towns (dp-hamlet-39, -93, -102, -116, -136,
  dp-village-55, -129, dp-town-118, -147, dp-city-54, -55, -77, -113): Economics tab (owner and shared) and the PDF's list
  ("Grain"). Grain stored 17, printed 777733a2a 15, base 2, tip 15 (the 2 that store it and print it on neither tree print
  it on neither: unchanged).
- EVERY RENDERED LINE THAT DIFFERS 777733a2a -> a03ba9359 on these 21 towns: 8 lines in 2 towns, each another unit's:
  dp-hamlet-93 (DS-ECO-11 "gold/silver ore" -> "gold or silver ore", Resources tab and PDF: U4) and dp-city-77 (owes: header
  C3 v1 -> v3, Economics and PDF: U1). Nothing else.
- A TOWN BORN ON TODAY's CATALOGUE: the made-here and trade lists of all 1,800 births of C and V are unmoved base -> tip (the
  function level, above); the 21 palm towns born today are in the render set (below).

## (h) THE TESTS, part 1 — every case of the delta's nine test files, base against tip (`tools/cases.mjs`; CONFIRMED by reading each hunk)
- Cases (by title) 151 -> 177 (+26 new); NO skip / only / todo; ONE TITLE GONE, by ruling: viabilityTruePage's 'C dp-thorp-42 (the
  outside_debt event alone): the Outlook says no "pays its way"' (it pinned the hook leg 122-B-5 withdrew), re-pointed in place as
  'C dp-thorp-42 …: not owing; the Outlook reads as with the event's hooks off' (keeps the event and /^VIABLE/ expects, adds
  `owesDebtShown` false and the hook-off equality). The NAMED table's dp-thorp-42 row drops its C3 v2 line by the same ruling.
- Case BODIES changed: one (selfVouchReceipt 'soak1k-8 …': the comment corrected, two expects added: no listed critical issue
  and `verdictLines` toEqual([])). (My parser also reported economyStateProseDesk's last case and viabilityTruePage's DS-POW-6
  case as changed: both are artifacts of an apostrophe inside a regex literal; the git hunks are appends after them.)
- Data changed outside case bodies: the phone floor's DESKTOP/MOBILE "Systems/Economics" rows (below, (i)).
- No matcher loosened in an existing case; no pin moved to another seed except dp-thorp-42's, by ruling.

## (e) 122-A-3, A DM-TYPED SCARCITY SENTENCE — CONFIRMED, RENDERED (`tools/an-dm.mjs`, `an-dm2.mjs`; dm-*.jsonl)
- Plants made BY THE LEDGER's OWN WRITER (`userEdits.js :: applyUserEdit(tension, 'description', <value>, { editedAt })`) on the
  saved records of every town whose scarcity tension prints the named twin on the tip (C 36, V 34): dm1, the DM types the
  engine's stored sentence over it (the same words); dm2, in the same town another tension's description typed as the
  engine's LIVE stored sentence (C 22, V 24). Each re-stamped on its tree; owner tabs, a fresh shared page, the PDF and the
  dossier search ("hoarding", owner and player) rendered on 003fd3b07 and a03ba9359.
- ON THE TIP the DM's words print AS TYPED on the Overview, the History row, the PDF, the search row (owner and player) and
  the shared page's Overview and History: dm1 36/36 | 34/34, dm2 22/22 | 24/24 (every surface). ON THE BASE every one was
  re-answered with the named twin. The unedited scarcity tension beside a dm2 plant still prints its named twin (the
  function level: one typed, one named, in every dm2 town).

## (d) 122-B-3, THE VEIL PLANTS — CONFIRMED (`tools/rplant.jsx`, `an-veil.mjs`; veil-*.jsonl), on a03ba9359 AND on 003fd3b07
- 180 births (C 120: 20 a size; V 60: 10 a size), all 0.10.0. Per birth five plants; for each, the reader's rows
  (`sharedTraditionRowsOf`: what a save stamps under publicProse.blocks.traditions) over the record as shown, over
  `applyVeil(record, {address})`, and with the address removed by hand; the rows a FRESH SHARED PAGE serves
  (`projectShareVeil(toPublicSafe(stamped), writeShareVeil(null, [{address, hidden: true}]))`, `publicProseOf(…, 'traditions')`);
  and the owner's drawn set (`shownTraditionsOf(record, []).recs` names).
  A  a house HIDDEN WHOLE (`card:institution:<id>`): the town's born hideable house (C 52 | V 24) or a planted criminal house
     (68 | 36);   B  a DM-made house tagged market, the town's only market, BY ITS FUNCTION EYE (`field:institution:<id>:function`);
  C  the same BY CLASS (`class:institution:function`);   D  a CRIMINAL HOUSE NAMED LIKE A CATALOGUE MARKET ('Weekly market',
     Criminal), the only market, hidden whole;   E  (the share lane's A20, not the brief's) a clandestine-by-facet house named
     like a smith, its function eye.
- A, B, C, D on the tip: rows shown == veiled == by hand 180/180 each (A 120 | 60 in all); served rows == stamped rows 180/180;
  owner's drawn set == the rows' names 180/180. THE SAME on 003fd3b07, count for count.
- E: rows differ shown vs veiled / by hand in 22 | 10 towns, ON BOTH TREES, the same towns and rows (C dp-town-1 ["The
  Procession of the Charter","The High Feast","The Golden Procession"] against [... "The Golden Contest"]): the veil's own
  order (`galleryVeil.js :: applyVeil`, not in the delta), the first reader's finding 7; unchanged by the delta.
- ALSO SEEN, NOT THE DELTA's (the same on 003fd3b07): a house hidden whole keeps its name in the served document at
  `economicState.activeChains[i].processingInstitutions[0]` (C dp-hamlet-10 "Fence (word of mouth)", dp-town-2 "Street gang";
  the default veil alone the same). Data the projection serves; whether a page prints it is the share lane's to read.

## (i) THE REGISTERS, part 1 — by reading every leaf (`git show <rev>:<file>` parsed and walked), 003fd3b07 -> a03ba9359
- GOLDENS: `git diff --name-only 003fd3b07 a03ba9359 -- tests/fixtures '*.snap' '*golden*' '*.snapshot.json'`: 0 files.
- `scripts/.writer-reach-baseline.json`: 33 leaves: frozenAtSha, verdictDigest, scanStats (6), closureSizes (web-display 807 ->
  808, web-transitive 1106 -> 1107, dossier-pdf 662 -> 664, foundry 540 -> 535) and 21 surfaceReach rows, EVERY ONE OF WHICH ONLY
  LOSES A SURFACE (20 lose foundry R or N, the desk leaving Foundry's export by unit 3; `templateType on historicalEvents` loses
  web-display, the hook leg gone). population, minRows, pendingSurfaceCeiling, reviewableDarkCount, darkUnregistered,
  registerDigest, cohort: UNCHANGED. Shrink-only honoured.
- `scripts/.observed-shape-readers-baseline.json`: 21 leaves: the governed `inventory` row "src/domain/userEdits.js _userEdits on
  settlement" 4 -> 2 and `total` 2208 -> 2206 (DOWN), sentinel.resolvedReads 13339 -> 13364, digests, manifests, scan stats,
  provenance. No row added, nothing raised.
- `docs/content/wiring-census.json`: the desk's stamp and producerIndexFiles 1468 -> 1470 (the two new leaves). Nothing else.
- `tests/lint/.tuning-inventory.json`: stamp; two `dependents` lists lose tensionDescriptionShown.js; two `line`s 453/454 ->
  407/408 (the tip's SOLE_EARNER_FROM = 50 at 407, LEADER_FROM = 20 at 408: true). No value, leaf or spanDigest moved.
- `tests/lint/.lighting-census-baseline.json`: files 3827 -> 3829, credited 3318 -> 3320, titles 32151 -> 32170, suiteTitles 8943
  -> 8949, parked 509 -> 509.
- `scripts/mutation-coverage-manifest.json`: ONE ENTRY ADDED BY HAND (a rationale for functionEyeCopy.test.js naming two by-hand
  mutants). Not a door's output: the manifest's own walker demands an entry for every invariant file (its TOTALITY case).
- THE PHONE FLOOR (5c8f2fa8b): DESKTOP "Systems/Economics" measured/sub14 44 -> 43, MOBILE prose 38 -> 37. Both baselines are
  EXACT pins (`toEqual(DESKTOP_BASELINE)`, `toEqual(MOBILE_BASELINE)`: a number that falls reds as a number that rises does), so
  lowering one row is a RE-KEY of an exact pin, not a widening. Its cause is checked below (the fixture city, on the tip).
- THE PHONE FLOOR's CAUSE, EXECUTED (`tools/pfprobe.jsx`): the fixture city ('phone-floor-all-views', Varaghat) holds the
  indebted stress AND the outside_debt tension (no Debt Crisis event), so it owes on both trees by the legs 122-B-5 keeps; its
  header prints C3 v1 "With a little left over each year, Varaghat gets by …" on 003fd3b07 and NOTHING on a03ba9359 (the rung is
  COMFORTABLE v3 on both). One header line fewer on Systems/Economics: the re-recorded 44 -> 43 and 38 -> 37 are exactly that
  line. A RE-KEY (the test's own instruction, the cause named), not a widening.

## FINDING (sent to the chair at 14:55 UTC by date -u; my message said "15:00", corrected in a second message): THE TABLE IS BLIND TO THE HIGH RUNGS — CONFIRMED (`tools/an-high.mjs`; rendered `high-tip-*.jsonl`)
`economyStateProse.js :: SOLVENT_LINES` names DS-ECO-1 C3 and DS-ECO-8 MODERATE / COMFORTABLE only. The high rungs gate on their
OWN marks, "no crisis: indebted" (C1 v2, v5, v6, v7; PROSPEROUS v1), which read the indebted CRISIS (the stress): beside the
outside_debt TENSION alone (a debt in force by `owesDebtShown`) they print. Tension-only towns that owe (C | V), the same on
003fd3b07 and a03ba9359:
- HEADER, DS-ECO-1 C1 v2 "{S} lives on a {complexity} and ends each year with money to spare.": C 4 (dp-thorp-113, dp-hamlet-8,
  dp-village-27, dp-village-94) | V 1 (dp-city-126). C1 v7 "… goes on doing well, and nobody there counts the margin closely.":
  2 (dp-thorp-17, dp-village-21) | 3 (dp-thorp-17, dp-village-133, dp-city-89). (C1 v5, v6 and C2 v1 also print: "does well".)
- TILE (Daily Life's standing-of-living tile), DS-ECO-8: WEALTHY v1 "{S} has reserves deep enough to ride out most of what could
  happen to it." 0 | 1 (dp-city-126); WEALTHY v3 "The town is rich …" 0 | 1 (dp-village-133); PROSPEROUS v3 "There is money here
  and it goes into the town. Nobody argues about whether a thing can be afforded …" 2 (dp-village-94, dp-town-16) | 1
  (dp-thorp-28); v5 "Nothing at {S} is left to fall into disrepair for want of money." 1 (dp-thorp-113) | 0; v7 "Money keeps
  going into what {S} has built …" 2 | 1; v6 "… spends freely on itself …" 1 | 3.
- RENDERED on the tip, owner AND fresh shared page: C dp-thorp-113 Overview and History "The settlement owes a heavy debt to an
  outside power, and the power is preparing to collect"; Economics "Darhanbash lives on a farm surplus and ends each year with
  money to spare."; Daily Life "Nothing at Darhanbash is left to fall into disrepair for want of money." C dp-hamlet-8 likewise
  ("Goranick lives on a farm surplus and ends each year with money to spare."). V dp-city-126: "Naglholm lives on a broad base
  of trades and ends each year with money to spare." and "Naglholm has reserves deep enough to ride out most of what could
  happen to it."
- So (a)'s "0 on the economy desk's header and tiles" holds for the vids the table names (0 | 0) and NOT for the rule the ruling
  states ("NO LINE CLAIMS MONEY IN HAND, A YEARLY SURPLUS"): C1 v2 is word for word a yearly surplus. Not new at the delta.
- THE CHAIR's ANSWER (message queued 14:55:59 UTC): RULED, not a stopper; point 122's claim narrowed in the landing record to the
  MIDDLE rungs (DS-ECO-1 C3, DS-ECO-8 MODERATE and COMFORTABLE) and the Outlook's verdict row; the high rungs beside a
  tension-only debt go to the survey's money family with this list.

## (h) THE TESTS, part 2 — MUTANTS (`mut/run-mutants.py`, `mut/mutants.json`; the scratch tree /home/user/rd/mut at a03ba9359; each
## mutant one edit of one cure, the named test files run by vitest (json reporter, files always named), the original bytes written
## back, `git status --short` empty after each) — CONFIRMED
Baseline (the light files: historyTab, dailyLife, selfVouchReceipt, helperCarriesNoDesk, tailDefeconCatalogueCommodities,
functionEyeCopy): 90 of 90 green.
- U2(a) A3 at its four other sites: the Overview prints the stored description (M09); the PDF view model's three slices do
  (M10); the search row is handed no settlement (M11); the PDF dedupe reads the stored sentence (M12): EACH reds historyTab
  (1 of 22, its own case).
- U2(b) B1's five exclusions, each removed (M13a overrun T0, M13b overrun T1, M13c frontier T0, M13d frontier T1, M13e plague T2):
  EACH reds dailyLife (1 of 47, its own case).
- U2(d) soak1k-8: the contradiction pool opened on the count (M14) is EQUIVALENT here (the town's count is 0, the case's own
  expect); the pool opened always (M14b) reds the case (at its old negative); WITH THE CASE's TWO OLD NEGATIVES TAKEN OUT (a
  scratch copy of the test), M14b still reds, now at the new anchor ("expected [ Array(1) ] to deeply equal []"): the anchor
  drags on its own. The vouch pool forced whenever nothing is listed (M14c): 0 red (the zero pool's own variants do not draw
  for this town: nothing prints; equivalent).
- U3 the leaf: the helper imports the desk again (M15) reds helperCarriesNoDesk's helper case; the floor imports
  traditionDescription.js again (M16) reds its floor case (1 of 2 each).
- U4 the slash: the tension's twin raw (M20) reds historyTab's slash case.
- 122-B-3: the veil's function eye gains a field ON DISK (M22): functionEyeCopy 2 of 2 red. AND IN MEMORY (the brief's plant):
  a vitest setup file (`mut/plant/veilGainsField.setup.mjs`, the tree's own config plus that one file) pushes 'priceList' into
  `CARD_KINDS.institution.fields.function` (the array is not frozen) before the test: functionEyeCopy 2 of 2 RED, both with
  its DRIFT message ("the veil's declaration … gained or lost a field, and the floor's copy … must follow it").
- 122-A-3: the ledger not asked (M23) reds historyTab's DM-typed case.
- 123-C2-1: the record's own grounds ignored (M24) reds tailDefecon's saved-palm case. The palms made to yield grain at view for
  any town (M25): 0 red, EQUIVALENT (the made-here list filters what the record stores: a town born today stores no palm grain,
  so no reader can print it).

## (i) THE REGISTERS, part 2 — THE DOORS RUN BY ME IN CHECK MODE on a clean tree of a03ba9359 (/home/user/rd/doors; `git status
## --short` empty before and after) — CONFIRMED
- `node scripts/wiring-census.mjs --check` EXIT 0 ("verified 861 pools / 3183 variants / 169 relation rows against 7 stamped files").
- `node scripts/generate-dossier-state-prose.mjs --check` EXIT 0 ("verified 69 state blocks / 3183 variants across 6 desks").
- `node scripts/stable-pick-ids-door.mjs` EXIT 0 ("the baseline matches the tree (160 scopes, 819 ids)").
- `node scripts/check-writer-reach.mjs` EXIT 0 ("WRWALKER HOLD — judged 12726 · LIT 705 · LIT-NAME 10615 · DARK 1406 (reviewable 396) ·
  pending-surface debt: none").
- `node scripts/check-observed-shape-readers.mjs` EXIT 0 ("2206 finding(s), exactly matching the frozen inventory").

## (b) EVERY PRINTED LINE THAT DIFFERS, C — CONFIRMED, RENDERED (`tools/an-lines.mjs`, `an-pages.mjs`, `an-slash.mjs`; r-*-C.jsonl)
- THE RENDER SET of C: 411 of 900 births (every town whose function level moved, 68; every town owing on either tree, 88; every
  town with an outside_debt event, 89; every town holding a slash label, 221; and EVERY SIXTH TOWN as a control, 150), each on
  003fd3b07 and a03ba9359: the owner's tabs (every group, tab and disclosure), a FRESH SHARED PAGE (default veil), the PDF.
  Render errors 0 | 0; record hash equal 411/411.
- 65 TOWNS DIFFER, 464 LINES, ON FOUR SURFACES ONLY: Systems/Economics (owner 75, shared 75), World/Daily Life (44, 44),
  Systems/Outlook (26, 26), the PDF (174). BY UNIT: U1 (the table, `owes`) 43 towns: 59 lines each on owner, shared and PDF;
  122-B-5 (the hook leg withdrawn) 22 towns: 28 lines each. NO OTHER TAB DIFFERS (Overview, History, Defense, Power, … : 0).
- LINES MY SORTER LEFT: 29, all the PDF heading "How the town is doing" GONE, one per town, in EXACTLY the 29 towns whose header
  slot the table empties (the list above): the PDF drops the heading of an empty paragraph. U1's own move. So LINES THAT DIFFER
  AND NO UNIT EXPLAINS: 0 on C.
- (a) ON THE RENDERED PAGES of C, tip, beside a debt in force (63 towns; owner, shared and PDF alike): C3 v1/v2 0, MODERATE v1/v3 0,
  COMFORTABLE v1/v2 0, a pays-its-way verdict row 0 (the base: C3 v1 43, MODERATE v1 16). "accounts still balance" (MOD v4) 23
  (base 8). THE DEFENSE DESK's money lines (DS-DEF-2 STRONG) beside a debt in force: 3 towns, the same on the base (dp-city-69
  v12 "went into this trouble with money in hand", dp-town-133 v3 "had money laid by before this trouble began", dp-town-83 v8
  "enough in hand to see the town through one"). EVERY owing page shows its debt (63/63, owner and shared: the tension's three
  wordings, among them "A large debt to an outside power came due, and the creditor was moving to enforce it").
- (f) SLASHES IN PROSE on C's tip pages (lines of six words or more): 40 kinds, IDENTICAL to the base's (none is a delta
  fill): stored sentences "Must travel to manor/village mill. Home grinding often illegal." (Institutions, PDF; 17 towns), a house
  name inside the Overview's sentence "… built around the Palace/government complex, on kin, oath and the assembly." (12), the
  Outlook's siege list "… Blacksmiths, Weavers/Textile workers, Butchers, Bakers." (3), the Power tab's "(Weavers/Textile workers)"
  and "(Colosseum/arena)" beside a person, and labels (faction "Military/Guard", "Flee/hide", "lbs/day"). C prints no
  "gold/silver ore" in prose on either tree (its critical-import row picks another good first).
