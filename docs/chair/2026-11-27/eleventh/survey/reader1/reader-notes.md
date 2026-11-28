# READER SURVEY-1 — running notes (independent reader of the survey's first half: S-A, S-B, S-B2, S-C and their merge)

Own cloud container. Scratch: the session scratchpad `readersurvey` (outside the repository; linked as /home/user/rs).
Every number below is from my own scripts (`tools/`, `scripts/` in the scratch) unless a line says otherwise. Hours from `date -u`.

## 0. Setup (2026-11-28, session start 08:39 UTC)
- `npm ci` exit 0; `git fetch --unshallow origin` done; `review-fixes-2026-07-08` fetched as a local ref.
- Chair's record: `lane/chair-2026-11-08` at 36f41ddc1ccdee143f3d876493169331dcf41a65 (worktree `/home/user/chair`, read-only).
  My push branch `lane/reader-survey-1-2026-11-28` is cut from that tip.
- BASE 777733a2a07e573e881fd6198ef329f1783b47f7 (`/home/user/rs-base`, detached).
- TABLE `lane/survey-table-wip-2026-11-28` at 2a474aaf9493482f1ed6806ad1756a84c6077b5b (`/home/user/rs-table`): 22 commits above the base;
  the branch tip on origin IS this commit. S-B alone = 6fee24b4e (the last commit before S-C's first, a5a7a720a).
- FINAL `lane/survey-final-wip-2026-11-28` at 35faf336109dd21c1a16dbf4842421905d32d1ae (`/home/user/rs-final`): 7 commits above the base;
  the branch tip on origin IS this commit.
- `package.json` / `package-lock.json` equal on the base and both tips (one `node_modules`, linked into each worktree).
- First line and plan sent to the chair 08:42 UTC.

## Method
- Corpora C and V (`rmeasure/tools/plan-C.json`, `plan-V.json`, 900 births each), re-born by me on every tree I judge.
- HARNESS A (`tools/hA.jsx`, `buildA.mjs`, `bootA.mjs`, `scripts/runA.sh`; my own, from the measuring seat's bundle method and the 122
  reader's notes): one esbuild bundle a tree, plain node under jsdom, 4 niced workers, a fresh process every 60 births, a warm-up dossier
  discarded in each. Per birth: the born record (sha256 of its JSON; the stamped JSON kept); THE OWNER's DOSSIER (the tree's real
  OutputContainer, every group, tab and disclosure, the tree's own walk); A FRESH SHARED PAGE (`projectShareVeil(toPublicSafe(stamped),
  writeShareVeil(null, []))`, readOnly + playerView, as PublicDossierView mounts it); A PAGE STAMPED ON THE BASE read on the tip (rendered
  where the base's stamped JSON differs from the tip's; equal input is the same page); and over the SAVED record (read back from JSON):
  THE PDF's CHAPTERS (the props `generateSettlementPDF` itself builds, captured before the worker; the document's own element tree walked,
  react-pdf mocked to string primitives, a <Text> a line), FOUNDRY's journal pages (as `SettlementDetail.jsx` calls the export: on a tree
  that holds `printRecord.js`, through it), the TABLE VIEW (the Tonight sheet) and SESSION MODE rendered as components.

## AT-ONCE NOTE 1 (sent 08:57 UTC) — (7), TABLE: `place debt` READS A HOOK NO PLAYER SHARE CARRIES — CONFIRMED at function level
`src/domain/display/solvencyShown.js :: owesDebtShown` (the one reader of `place debt`): leg 1 the `indebted` stress; leg 2 the
`outside_debt` tension; leg 3 a timeline event of templateType `outside_debt` WHOSE HOOK PRINTS (`collectPlotHooks`). A plot hook never
travels on a player share (`toPublicSafe`, `PRIVATE_KEY_RE`: the served record carries no `plotHooks` key).
`scripts/q2-legs.mjs` (TABLE's readers over the base's saved records; first 577 births of C at the time): place debt 51; leg 1 16; leg 2
32; leg 3 19, and ALL 19 stand on leg 3 ALONE (dp-thorp-8, -42, -105, -128, -135, -141; dp-hamlet-45, -79, -87, -116, -130, -149;
dp-village-6, -26, -79; dp-town-48, -52, -74, -92).
`scripts/q7-hookleg.mjs` (the stamp a save composes, `projectShareVeil(toPublicSafe(stamped), writeShareVeil(null, []))`; then the same
with the event's `plotHooks` taken off the record by hand): at TABLE's tip the served stamp differs in 18 of the 19 and prints a NEW
sentence that says the debt in 18:
- C dp-thorp-8 Farofundus: "Farofundus earns a middling living, and what is left at the year's end goes to pay what it owes." / hook
  off: "With a little left over each year, Farofundus gets by on a farm surplus, and every year people argue over how to spend it."
- C dp-town-48 Tumenbaliq: "The town is comfortable to look at, and it owes money all the same."; "Tumenbaliq has money in hand, but it
  is owed elsewhere: a hard season and the debt would have to be met from the same purse." / hook off: "Tumenbaliq's purse closes every
  year ahead. … there is money laid by behind it."; "Tumenbaliq's accounts have money in hand: …".
ON THE BASE 777733a2a (the same script, four of the towns): the served stamp ALREADY differs with the hidden hook (point 122's B2: C3 v2
"pays its way" gives way to a sibling; the Outlook row "gets through the year, buying in…" against "feeds itself and pays its way"); it
prints a sentence that says the debt in 0. So the dependency is point 122's; S-B2 makes the line that prints STATE the debt.
No veil state moves it (the stamp is composed owner-side): a tell between records, not between eyes. Rendered pages: below, when run.

## (6) THE MERGE, part 1 — the merge itself and the static closures (CONFIRMED by execution; the build and the census: below)
- `git worktree add --detach ../rs-merge 2a474aaf9` then `git merge --no-commit --no-ff 35faf3361`: "Automatic merge went well"; NO CONFLICT,
  no file touched by both branches (TABLE: facts/, the economy and defense corpora, solvencyShown, economyStateProse, vite.config, scripts/;
  FINAL: nine components, plotHooks.js, four new leaves, two utils). Nothing resolved by judgement. Left uncommitted in the scratch tree.
- THE STATIC CLOSURES (`scripts/closure.mjs`, `closure-cmp.mjs`: esbuild's metafile, import statements only, a dynamic import() not
  followed; source bytes of each module; a PROXY, the real build is apart), base -> merge, EVERY MODULE ANEW:
  * FIRST PAINT (`src/main.jsx`): 259 -> 259 files, none anew; `facts/factVocabulary.js` +1,236 B (TABLE). FINAL alone: 0 B.
  * THE GENERATION WORKER: 464 -> 465: ANEW `facts/nothingLaidBy.js` 1,200 B (TABLE); factVocabulary +1,236, factsOf +434. FINAL: 0.
  * THE PDF RENDER WORKER (`utils/pdfRender.worker.js`): 622 -> 623: ANEW `facts/nothingLaidBy.js` (TABLE; with the economy desk's own
    files moved: economyStateProse −2,254, economy.generated +1,939, factsAnswered +1,176, solvencyShown +208); FINAL: `dossier/plotHooks.js`
    +883 B and NOTHING ELSE: no table rides the worker (S-A-2 holds). Bundled alone, minified: 3,474,374 -> 3,475,403 (+1,029).
  * THE ADVANCE WORKER: 733 -> 734: ANEW `facts/nothingLaidBy.js` (TABLE). FINAL: 0.
  * FOUNDRY's EXPORT (`foundry/generateFoundryModule.js`): 543 -> 544: ANEW `facts/nothingLaidBy.js` (TABLE); plotHooks.js +883 (FINAL).
  BESIDE THE FIVE (not asked, said because the messages do not):
  * `utils/generateCampaignPDF.js`: 226 -> 228: ANEW `facts/nothingLaidBy.js` and `display/defenseScoreBands.js` (6,749 B) (TABLE).
  * `utils/generateSettlementPDF.js` (THE CALLER's THREAD, the lazy export chunk): 347 -> 358 files, +562,360 source bytes; bundled alone,
    minified 4,683,418 -> 5,026,956 (+343,538): TEN MODULES ANEW from FINAL: `display/printRecord.js`, `institutionDescShown.js`,
    `dossier/storedHookShown.js`, `facts/lineOnFinal.js`, `facts/pairPlace.js`, `data/institutionDescVariants.js` (206,152 B),
    `data/npcData.js` (184,975 B), `data/historyData.js` (114,251 B), `data/people/handlerTieLines.js` (17,875 B),
    `data/historyDescVariants.js` (8,814 B). The same three tables now sit behind the Institutions tab, the Plot Hooks tab, Session Mode,
    the Table View and BOTH search components (`DossierSearchBar.jsx`, `DossierSearchResults.jsx` import `printRecord.js`; the bar is
    mounted on every dossier, the public page's too). What that costs a page view is the real build's to say (below).

## (4) THE DECLARATIONS, part 1 — the money family read over the six desks (by reading; the page cross: below, when TABLE's pages are in)
THE READING (`scripts/q4-net.mjs`: a wide word net over all 3,189 variants of the six generated desks at TABLE's tip, 528 rows; every row
read by a reading helper of mine against the chair's rule (money in hand, a yearly surplus, a balance, freedom from debt, of THE PLACE),
then three more nets and the unread siblings of the money pools: 1,784 of 3,189 lines read; its list (`out/q4-money-claims.tsv`, 48
rows; `q4-money-borderline.tsv`, 99) RE-READ BY ME, row by row): 19 lines make such a claim and are guarded (`no place debt`, or the line
itself says the debt); 29 MAKE IT AND DECLARE NEITHER `no place debt` NOR `place debt`. The walker's `said` words catch 3 of the 29
(its three allowed DS-GEN rows) and its fourth allowance is the new debt line itself. The other 26 its words do not read, among them:
- IN THE FOUR POOLS' OWN DESKS: `DS-ECO-1::COMBINATION C1#2` "…ends each year with money to spare."; `DS-ECO-8::PROSPEROUS#1`
  "{settlement} has money to spend…", `#3` "There is money here…"; `DS-ECO-8::WEALTHY#1` "…has reserves deep enough to ride out most of
  what could happen to it."; `DS-ECO-8::MODERATE#4` "…accounts still balance…" (it gained `no crisis: indebted`, not `no place debt`);
  `DS-DEF-2::Economic Survival: ADEQUATE#1` to `#3` ("can fund a short crisis … the reserves are not deep enough…");
  `DS-DEF-6::Economic Backing: Well-funded#1` "…holds something in reserve…".
- THE GENERAL DESK (no line of it declares `no place debt`): `DS-GEN-3::scores.economic: STRONG#1`, `#3`, `ADEQUATE#1`, `#2`;
  `DS-GEN-3::prosperity: Struggling / Poor#2` "…ends most years barely even, and one bad month would put it in debt." (the one line that
  says the place is NOT in debt); `Moderate / Modest#2` "…pays for itself and does not accumulate."; `Comfortable / Prosperous#1`, `#2`
  ("The surplus at {settlement} is real…"); `Wealthy / Thriving#2`; `DS-GEN-7::… siege against trade income#1`, `#4` ("lives off its
  savings"); `… the recovery narrative#2`, `#4`; and the three allowed ("pays its way…").
- SIX of them carry `no crisis: indebted` as their only debt mark: a guard against one of the atom's three legs.
- A SOFT ONE INSIDE A FOUR-POOL: `DS-DEF-2::Economic Survival: STRONG#2` "The town could go through a bad season with its arrangements
  intact, and the people who would have to be paid through one know it." declares only `no crisis` (STRONG #2, #5, #6, #7 were not touched).

## (2) THE READERS AND THE TABLE — corpus C (V and the goldens: below)
- THE PROPERTY ON EVERY RECORD (`scripts/q2-rows.mjs`: all 900 saved records of C, not a sample; every specific row as written, the
  generic rows over every atom of their shape as the builder's test spells them: 194 presence pairs, 82 band pairs, 15 crisis pairs;
  each side by `atomHolds` on `deskFactsOf(record)`): BOTH SIDES TRUE: 0 on every one of the twelve rows. Sides held (C): place debt 88 /
  no place debt 812; nothing laid by 421 / 479; crisis: indebted 25; prosperity ≤ poor 65 / ≥ moderate 835; guild 484 / 416; plague 17;
  famine 11; siege 23; monster pressure 29.
- WHAT THE PROPERTY CAN SEE, BY CONSTRUCTION: eleven of the twelve rows set an atom against ITS OWN NEGATION (`X` / `no X`, a band against
  the rest of its own ladder), read by the test as `!reader`: they cannot fail whatever the reader says. ONE row is a statement about two
  readers: `the indebted crisis is a place debt` (crisis: indebted against no place debt; 25 hold a, 0 both).
- THE LEGS OF `place debt` (`scripts/q2-legs.mjs`, C's 900): true in 88; by the `indebted` stress 25; by the `outside_debt` tension 63;
  by a Debt Crisis event whose hook prints 25, AND ALL 25 STAND ON THAT LEG ALONE (the hidden hook: at-once note 1; C's first 577 gave
  19). 61 towns hold a Debt Crisis event with no hook and no other leg (not owing). The atom at the desks' door == `owesDebtShown` 900/900.
- `nothing laid by` == the Economic Survival band WEAK or CRITICAL 900/900 (421 true); no record without a defence profile.
- SECOND READERS LOOKED FOR (reading, then `scripts/q2-second.mjs` on C's 900):
  * the crisis: `owesDebtShown` reads `record.stress` and `type === 'indebted'` by hand; the atom `crisis: indebted` reads
    `crisisKind.js` (`stressors` -> `stress` -> `stresses`, pulse types folded). On C the two containers are byte-equal (900/900) and
    `crisis: indebted` == the stress leg 900/900. A SECOND SPELLING OF ONE FACT, no disagreement on a born record.
  * the guild: the commerce pool's KEY reads the stored booleans `economicState.compound.inst.hasGuild` (`generalStateProse.js ::
    commercePoolKey`), the atom reads `guild.js :: guildOf` (a guild house OR a guild power). Flag true and atom false 0; atom true and
    flag false 34 (a guild power, no guild house: the pool's vid 5 says so). The pool `COMMERCE: craft guilds, no merchant guild`
    declares no `guild` atom: it stands on the stored flag alone.
  * the Economic Survival band: the tab's row, its bar and the desk's key read `defenseProfile.scores.economic` through `scoreBand`
    (one ladder); the atom's home is the same function.
  * prosperity: `factsOf().prosperity` == the stored rung on 900/900. (What the page shows under a crisis, "Moderate before the
    migration; Poor while it lasts", is `prosperityInCrisisLine`: a second SAYING of the rung the atom does not read: (3) below.)

## (8) A DM's OWN WORDS — CONFIRMED on FINAL's tip (`tools/hD.jsx`, `bootD.mjs`; V dp-hamlet-12 Weichbach, a forest hamlet whose stored
## charcoal line is the twin the final record refuses; every surface of harness A and the search's card)
- NO EDIT (the stored twin "Turf-covered kilns … whenever wood can be had: the fuel that burns hottest."): re-answered to "Kiln crews in
  the surrounding woodland supply charcoal to the smelters, smiths, and bakers. Metalworking here burns through a forest a generation."
  on the owner's Institutions tab, the fresh shared page (a share-safe set), the PDF's Institutions chapter, Foundry's page, the search's
  card: the five agree.
- A DESCRIPTION TYPED BY HAND (`applyUserEdit(inst, 'desc', …)`): printed as typed on all five; RE-ANSWERED: none.
- AN EDIT EQUAL TO THE STORED TWIN VERBATIM, and AN EDIT EQUAL TO ANOTHER SET's TWIN VERBATIM: printed as typed on all five (S-A-3 holds
  through `normalizeSettlement` and through the public projection: `_userEdits` rides the served record, so the reader's page keeps the
  DM's words too).
- THE SAME TABLE LINE WITH NO LEDGER RECORD (the text set by hand, as an import or a custom house would carry it): re-answered (by text).
- A HOOK: a person's and an event's `plotHooks` are plain strings and NO path of `userEdits.js :: EDITABLE_FIELDS` reaches them (npc:
  goal.short, secret.what, personality, role; historicalEvent: description, summary); born records hold no root `hooks` / `plotHooks`
  entity. So a stored hook cannot be DM-edited through the ledger; `storedHookGate` knows a hook by its TEXT alone.
- EVERY OTHER READER THAT RE-WRITES A STORED, EDITABLE LINE AT PRINT (the `*Shown` leaves read, 46 of them): ONE,
  `display/tensionDescriptionShown.js :: tensionDescriptionShown` (point 122's A3; the same on the base and both tips): it knows the
  line by its text and DOES NOT ASK THE LEDGER. PLANT (C dp-city-22): the tension's description edited through the ledger to the same
  stored words ("A critical resource is running short, …"; ledger `currentTension:description`): printed "A critical resource, grapes,
  is running short, …". NOT OF THESE BRANCHES; the S-A-3 rule is not kept there.

## (9) THE TESTS AND THE REGISTERS, part 1 — by reading (`git diff 777733a2a <tip> -- tests` and every register, read whole by a reading
## helper of mine, `out/q9-tests-TABLE.md`, `out/q9-tests-FINAL.md`; the lines named below re-read by me; the runs and the mutants: below)
TABLE: 21 files under tests/ (13 existing test files, 3 helpers, 2 registers, 3 new test files); existing cases changed 17 (22 expects
re-pinned, each to a value the change explains); CASES DROPPED 0; skip / only / todo 0; `expect(` in the existing files 1,691 -> 1,713.
- `tests/domain/facts/factVocabulary.test.js`: "every dimension's home is a getter of factsOf" now EXEMPTS `placeDebt` (asserts it is
  NOT on `factsOf` and IS on `deskFactsOf`; the exemption pinned at one dimension). The ruling S-B-1 said, in a test.
- `tests/domain/stateProseKernel.test.js`: the sweep's REFERENCE (`excludesPresence`, new `needsTrouble`) now decides with
  `declarationAdmits(…, CALM_FACTS_ADMIT_ALL)`, the function under test, where it read the marks by a regex of its own: a fault in
  `declarationAdmits` on a presence atom would move the kernel and its reference alike. The measured histograms re-pinned (n=13 2 -> 1,
  n=14 0 -> 1; the chi-square table gains df 13).
- ALLOW-LISTS THAT GREW: `presumedThings.walker.test.js` (the vocabulary's data files: + `claimExclusions.js`);
  `presumptionClasses.walker.test.js` (`NOT_PAGE` 20 -> 21); the new walker's own list of four (three "pays its way" lines of DS-GEN left
  to S-D, and S-B2's own STRONG#14).
- `tests/lint/factLayers.poolTable.json`: four rows `layer` 4 | 3 | 3 | 3 -> 6, edited inside the feature commits 6cb01c881 and 4c0d73d1c
  (the file has no door of its own).
- `tests/domain/facts/economyDeclarations.test.js`: the planted record gains `economicState.foodSecurity` so "the pool still speaks".
- The wiring census, the observed-shape baseline and the lighting census: each moved in commits that touch that file alone.
- NEW: `tests/domain/facts/claimExclusions.test.js` (the property: (2) above says what it can see); `claimExclusions.walker.test.js`;
  `pageClashCensus.walker.test.js` (the fixed sample of eight births).
FINAL: 8 files, ALL NEW (7 test files, 38 cases, 83 expects; one fixture of seven birth configs, `tests/fixtures/surveyFinalTowns.json`);
no existing case touched; no register moved (the lighting baseline says 3,827 files against 3,834 in the tree; the wiring census's
`producerIndexFiles` 1,468 against 1,472: the join's doors). `tests/lint/finalLinesPrintGate.walker.test.js`: a caller "gates" when its
text holds the string `printRecordOf(`; its `'handed'` rows are checked by nothing.
GOLDENS, SNAPSHOTS: none touched on either branch. A CEILING RAISED: none. ON THE MERGE: TABLE's `pageClashCensus.walker.test.js` pins the
`guild` clash of C dp-hamlet-26 in its fixed sample ("not vacuous"), which FINAL's hook gate cures: it reds until the register is
re-taken by its door (to be executed: (6)).

## THE CHAIR's RULING ON AT-ONCE NOTE 1 (its message of 08:58 UTC, read 09:27): 122-B-4, THE HOOK LEG IS THE OWNER's EYE ONLY
What is composed for a reader (the shared page's stamp, the player view) answers `place debt` from the stress and the tension alone; the
owner's tabs and the DM's share keep the three legs; cured on the line first, TABLE's atom takes the rule when it merges. Finding 1 is
kept with its numbers on C and V and the rendered pages. THE ASK WIDENED: (i) the other two legs; (ii) `nothing laid by` and every atom
FINAL's re-answer reads; (iii) any other DM-only-by-class thing a stamped reader line leans on, either branch or the base, by site and
count.

## (7)(i) THE OTHER TWO LEGS OF `place debt` ON A READER's PAGE — CONFIRMED on the base's rendered fresh shared pages of C (`scripts/
## q7-legs-on-share.mjs`) and by a render under the veil (`tools/hV.jsx`, TABLE's tip)
- THE INDEBTED STRESS (25 towns of C): the reader's page names it in 25 of 25 ("Active crisis: Indebted to Outside Power"; "…owes an
  outside power more than it can ever repay…" on the Overview). `stress` / `stressors` are on the public allowlist; no address of the
  curate screen reaches them (the model offers none; the walk of (7) below moves `crisis` in 0 states).
- THE outside_debt TENSION (63 towns of C): the reader's page shows it in 63 of 63 (the Overview's line; History "External Debt · major"
  and its sentence). Its `type` is on the card's FLOOR (never hidden); its DESCRIPTION is an eye the curate screen offers
  (`class:tension:description`, `field:tension:<id>:description`). C dp-town-115 rendered with the class shut: the Overview's sentence
  goes, History keeps "External Debt · major" (and prints the raw token "outside_debt" where the sentence stood: seen in passing, the
  veil lane's). So a stamped debt line there leans on nothing the page does not still say. THE SHARE LANE's COUNT, APART: 63 towns of C
  where a DM may shut the description of the tension that a stamped debt line stands on.
- THE HOOKED EVENT (25 towns of C, each on that leg alone): the reader's page prints the hook in 0 of 25 (no share carries it); it shows
  the PAST event ("The Debt Crisis … A large debt to an outside power came due, and the creditor was moving to enforce it").
- (C dp-town-115, tension leg, Comfortable, Economic Survival Strong, at TABLE's tip: NO line of the four slots says the debt on the
  reader's page: the new lines compete with the pool's other admitted lines and are not always drawn. Counted in (5).)

## (10)/(1) FINAL: A PRINT SITE THE GATE DOES NOT REACH, THE DEFENSE TAB's FORCE CARD — CONFIRMED by a planted record (rendered)
`src/components/new/tabs/DefenseTab.jsx :: ForceCard` prints `i.desc` as stored (its two lines are untouched by FINAL); S-A's site 1 is
`InstitutionsTab.jsx :: InstitutionCard` and, for the whole-document surfaces, `printRecord.js`. THE SETS THAT BEAR ON A FORCE HOUSE: the
watch's three (`gate`: "…and hold the gates." / "…and keep the peace."), the mercenary companies' three (`tier`, `mercenary`).
`scripts/q10-forcecard.mjs` (C's 900): 120 towns hold a "Town watch [Defense]" whose printed line moves if the walls and gates leave the
roster. PLANT (`tools/hV.jsx`, FINAL's tip, C dp-town-0 Xiaxian; the walls and gates taken off the roster by hand, the stamp re-composed,
the owner's page rendered): Systems/Institutions prints "Part-time guards who walk the night and keep the peace." and Systems/Defense
prints "Part-time guards who walk the night and hold the gates." AS BORN the two tabs agree ("…hold the gates."). So after a record
moves under a force house, one page says both; the PDF is handed the gated record and says the first. On C and V as born: see (1).
