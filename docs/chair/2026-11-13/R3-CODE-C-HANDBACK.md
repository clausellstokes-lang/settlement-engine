# R3-CODE-C — hand-back (kept current after every item)

The seat R3-CODE-C, for the chair (session_01FE9mEws7PXYRYdjQPbSX15). Lane `lane/r3-code-c-2026-11-13`, cut from
`lane/integration-2026-11-07` at **aac79b808** (read back from origin at the start). EXECUTED means I ran it and
read the output; PLAUSIBLE means read from code, not run.

## The brief's rulings and the chair's messages (copied: the messages are not on the branch)

- The brief (2026-11-13): the false lines of ROUND-3-CUT in the files no lane holds, by `writer.file`: crisisHooks.js,
  resourceSemantics.js, goodsCatalog.js, characterEditView.js, treasury.js, foodWordsFindings.js,
  settlementOriginProse.js, stressNarrative.js, structuralValidator.js, resourceGenerator.js, factionDynamics.js,
  chainMagicSubstitution.js, incomeLineSiblings.js, engineKeysInText.js, conditionWords.js, landingFixture.js. NOT
  mine: defenseFacts.js, viability.js, src/data/**, src/generators/power/**, the tabs. A line whose true writer another
  lane holds: name it and go on. Rulings: a sentence says only what the record holds; one home for "worked here" (the
  chain leaf, record 303; silence is "not known"); do not rename a catalogue name; the page shows the ratings, never the
  machinery; no new record key; no new vocabulary word (park the row); no user-hideable name in a stored composed
  sentence; a generator cure is a DECLARED MOVE measured on the 720; new wording listed with its town.
- Chair, 18:51Z: the cut's file was re-pushed (lane/round-3-cut-2026-11-13 at **892904c1d**, read: the brief named
  3bae61499); take the list by file from the latest JSON. Two additions: `crisisSummaryVantage.js` (one MED, #1386); and
  `src/domain/dailyLife.js` (deriveOutsiderImpressions, deriveRecentChanges) LOW grammar lines (the hand-formed
  possessive "Religious Authorities's mark", the doubled "Recent changes: Recent changes:", the doubled phrase), after
  the medium ones: the possessive through the one leaf that already forms a power's possessive if the tree holds it.
- Chair, 18:56Z: round two's #257 and #437 ("Wool & Textile Trade … bought from pastoral regions" under a siege or
  beside an impaired textile chain): find the true writer first. RULED: an income line says only what the record holds;
  under a siege nothing is bought in or sold out by road; an impaired or broken chain is not described as working.

## My list, counted from the JSON (892904c1d), by writer.file

28 lines name one of my files: **4 HIGH, 24 MED**. Two of them do not print at the line's tip (`status` "not at the
line tip", package null: #660 HIGH, #795 MED), so **3 HIGH and 23 MED** are in my packages, as the brief said; with the
chair's #1386 the list is 3 HIGH and 24 MED. All 26 that print were reproduced at aac79b808 in the reader's own towns
(the reader's render.sh, seeds20.txt; EXECUTED).

## Items

| # | sev | writer per the cut | true writer (traced) | outcome | commit |
|---|---|---|---|---|---|
| 1074 | HIGH | factionDynamics.js :: computeFactionRelationships | same | CURED | 476800e1d, de27f9fd6 |
| 13, 55 | HIGH | crisisHooks.js :: LINE_ROLE_CLAUSE | crisisCast.js :: bruntCandidates (CAST_REASONS.bruntLeast given to every member, the head and only member among them) | NAMED to rb (its own commit 90bafc4d1 on crisisCast.js); the same fault as rb's #11 and #53 | — |
| 270 | MED | crisisHooks.js | as #13 | NAMED to rb | — |
| 325, 468 | MED | structuralValidator.js | same | CURED | cdf84d431 |
| 437 (+ round two #257, #437) | MED | treasury.js :: INCOME_SOURCE_FORMS | economicState.js :: generateEconomicState (the Wool & Textile income branch) | NAMED to the upkeep lanes (coherence-upkeep, upkeep-capacity change economicState.js) | — |
| 7 | MED | settlementOriginProse.js :: ORIGIN_POOLS | narrativeGenerator.js :: generateSettlementReason (`supportChannels`, a fixed list not read from isolationSupport) | NAMED (ra, bd, fd, wr change narrativeGenerator.js) | — |
| 154 | MED | settlementOriginProse.js :: ORIGIN_POOLS.road[3] | the words are mine, but the facts the cure needs (the siege in force, the size, the houses that serve travellers) reach `selectOriginBody` only through its one caller, narrativeGenerator.js :: generateSettlementReason, which passes route, terrain, deficit, docks, resources and seed and nothing else | NAMED with the cure spelled: the caller passes the siege, the tier and a traveller-house flag; the pool refuses road[3] (and the present-traffic road[0], road[2]) under a siege, road[3] below an inn, a stable or a tavern and at city size; the refused pick resolves draw-free to the next admitted row | — |
| 237 | MED | characterEditView.js :: editChartRows | settlementOriginProse.js :: ORIGIN_POOLS.ground[2] ("ask for the docks and you are told there are none"), chosen by #10's ruled arm (a port route whose roster holds no docks founds on its ground) | PARKED: two homes, both ruled: the origin reads the roster's docks flag (STYLE-RULINGS §1 #10), the header, Economics' "Trade port" and spatialLayout "Coastal port (harbour and shipyards)" read the route. Which home the port fact lives in is the chair's | — |
| 9, 51 | MED | stressNarrative.js :: RENDERERS.famine | same | NAMED to rb: rb's own 111e8b152 (item 6a) gives the famine renderer a twin where `atomHolds('grain')` is false; at my tree the atom is false in both towns (EXECUTED), so rb's cure reaches them (PLAUSIBLE: not rendered at rb's tip) | — |
| 304 | MED | conditionWords.js :: conditionsSentence | conditionWords.js :: activeConditionWords | CURED (display only; 478 births' sentence names the crisis) | 9494a7bce |
| 367, 630 (795 not at the tip) | MED | engineKeysInText.js (file level) | computeActiveChains.js :: computeActiveChains (`upstreamNote`, "Needs imported X: no local source"); engineKeysInText.js only turns the chain ids into words | NAMED (wa, wc, wr, fd change computeActiveChains.js); the same fault as the cut's #793, #800 (wc's) and round two's #703 | — |
| 1153 | MED | chainMagicSubstitution.js :: applyMagicSubstitution | two writers: "40% recovery" is EconomicsTab.jsx's chip (`chain.magicRecovery`), and "divine provision" reads computeActiveChains.js's `traditions.divine` (a church on the roster with any magic above 0), where defenseProfile.traditions.hasDivine is false | NAMED (EconomicsTab: wc, up; computeActiveChains: wa, wc, wr, fd) | — |
| 1049 | MED | foodWordsFindings.js :: TABLE_WORDS | EconomicsTab.jsx (" · affects: …", `chain.dependency.affectedServices`); foodWordsFindings.js only reads the row | NAMED (wc, up); the cut's class 7(b) | — |
| 512, 1310, 1145, 1204 | MED | resourceSemantics.js, goodsCatalog.js | EconomicsTab.jsx's Trade Profile imports (`primaryImports` joined with `resourceAnalysis.imports.critical`, which holds the gaps' "missing" inputs, and printed under a siege); the two files only give the goods their labels | NAMED (wc, up); the same fault as the cut's #169 | — |
| 869 | MED | landingFixture.js (a copy) | causalState.js :: deriveTradeConnectivity (a siege's war_pressure condition takes 18 from 50 + the route: still "Adequate") | NAMED (coherence-upkeep, upkeep-capacity change causalState.js); a band of a reading is a ruled design | — |
| 501, 1301 | MED | incomeLineSiblings.js | economicState.js :: generateEconomicState (the Iron & Metalwork branch picks the coal lines on `coal_deposit` alone: it reads neither the siege nor whether iron is imported); the two texts are true where their site's facts hold | NAMED (coherence-upkeep, upkeep-capacity) | — |
| 457, 1163 | MED | resourceGenerator.js :: evaluateInstitutionDeps | same, but the fault is two models disagreeing: the resource analysis counts a chain complete at two processors (#457: the livestock chain lists leather goods with no tannery; #1163: herbs present by another resource while the chain model's herbalism input, foraging_areas, is depleted) | PARKED: record 303 homes "worked here" in the chain leaf (chainWorksResource), but no row maps a RESOURCE_CHAINS rawResource to the chain model's resourceInputKey, and record 303 says unifying the models is not owed before the release. Recommendation: the export row's reason reads the chain leaf once such a map is ruled | — |
| 1386 | MED | crisisSummaryVantage.js | same | CURED (display only) | 6c0db2bb6 |
| C-L4 (LOW, the chair's addition) | LOW | dailyLife.js | same (deriveOutsiderImpressions, deriveRecentChanges, deriveChildWarnings, deriveUnspokenTopics) | CURED: "Guilds's" 102 -> 0 through powerSentenceName.js :: powerPossessive (read, not changed: the estate's one possessive leaf); "Recent changes: Recent changes:" 684 -> 0; a doubled warning 45 -> 0 (720 births) | 0386ff35a |
| C-H1 (the chair's addition) | — | threatProfile.js :: collectThreatSources | same | CURED: "Magical instability" is no longer derived from the defence's magical score; the record's own fact of unstable magic is a magical crisis among the stressors (magical_instability, magic_deadzone, wild magic: worldPulse/stressorsCore.js, stressorPicker.js; conditionPromotion.js promotes it to the magical_instability condition), which step 5 already surfaces by its own name. 59 of 720 births carried it, all from the score; 0 now. Read time: 0 leaf diffs | d166e8261 |

## Measures at fb8b24fbe (EXECUTED; the final statement waits for the rows above)

- **720 census births, base aac79b808 against the tip, field diff:** 78 towns move, three families, all declared:
  structuralViolations (54, #325/#468), powerStructure (28, #1074: narrative 28, type 9), npcs (9, the same 9: goals.js
  reads the tense row). No other family moves. Every display cure (#304, #1386, C-L4, C-H1) is 0 leaf diffs.
- **240 fresh births** (seeds the cures were never tuned on, app shape; `births-fresh`: r2r-<size>-fresh3c-0..9 and
  r2s-<crisis>-<size>-70..71), base against tip: false occupier rows 12 -> 0 (the new row 12); "Military priority is
  N/100" 11 -> 0; a beast-threat town's "wartime pressure" 13 -> 0; "holds nowhere" 2 -> 0; the daily-life faults
  51 / 234 / 26 -> 0 / 0 / 0; "Magical instability" 16 -> 0. Field diff: 23 towns, the same three families.
- **The reader's twenty towns, rendered as the owner sees them, base against tip:** the four cured cut lines printing
  at base (#304, #325, #468, #1074) and #1386 are gone; 52 lines differ in all, every one read: each replacement
  reads true in its town (the Foundations line names the crisis the record holds; the occupier row; the embattled
  warning without the figure; the quarantine line; the occupied city's re-dealt goals). The other surfaces of the same
  twenty (the reader's surfaces.census.jsx: the PDF in three variants, the Foundry journal, the Tonight sheet): the
  cured words 10 at base (8 slider figures, 2 "holds nowhere"), 0 at the tip. A "Patron deity" panel prints in 16 base
  and 19 tip dumps: a lazy panel's render timing, both trees, no change of mine near it.
- **Running when this was written:** the whole suite at fb8b24fbe (`npx vitest run --maxWorkers=2`), and the census
  counter (lane/second-wave-census-2026-11-12, 6b262d4e0) base against tip, its counter's own exit checked. Their
  results are in the section "The first seat's last two runs" below.
- **The suite's reds seen so far, by the governing runs, classed:** red at base too (undercitySewerDerivation;
  siteCoherenceRatchet C1; dossierProseManifest's three drift arms); declared by this lane: the lighting census file
  count 3234 -> 3238 (+4 test files; the census's door), espionageDormancyFence's driven golden (the generator moves of
  476800e1d and cdf84d431; a golden surface, the merge seat's door). The edge freshness tests are green after fb8b24fbe.

## Corrections (said out loud)

- fb8b24fbe's message says the other bundles' meta files "restamp their source hash only": they restamp
  `generatedAt` only (the hash is unchanged).
- cdf84d431's message says "against 2c-prev tip": it means against de27f9fd6's births.

## Noticed, not mine

- `priorityNote: "Military priority is 86. Defence institutions are expected."` — three records of the 720 carry it
  (viability's field, not structuralValidator.js); not traced to a page surface.

## Parked

- #237 (two homes for the port fact, both ruled) and #457/#1163 (two models): see the table. The chair ruled #457/#1163
  at 20:4x (below); #237 went to ra with settlementOriginProse.js.

## STOP AT THE CONTEXT LIMIT — the chair's 20:4x rows, handed to a successor (not started)

The chair's message of 2026-11-13 20:4x UTC (copied): the hand-back at fb8b24fbe taken as filed; the named rows sent to
their holders (rb: #13, #55, #270, #9, #51, #1049; ra: #7, #154, #237 and settlementOriginProse.js itself, now ra's;
wc: #367, #630, #1153, #512, #1310, #1145, #1204; the defence lane's next seat: #437, round two's #257, #501, #1301,
#869). Then three new pieces of work for this lane, in this ORDER: the 5 HIGH, then #457 and #1163, then the medium
rows by file; the final statement waits for them. "If you are past 300k tokens of context, do not start: bring the
hand-back current with these rows listed line by line and tell me in one message; a successor takes the list."
**This seat is at that limit and did not start them.** Nothing below is cured; nothing was changed for them.

**RULED on #457 and #1163** (resourceGenerator.js :: evaluateInstitutionDeps; the chair's, vetoable): no map between
the two models is built (record 303 stands). By the resource analysis's OWN data: (1) a good whose processor the
analysis itself lists as missing is not named in the row at all (leather goods with no tannery); (2) "Complete
production chain in place" is said of a row only where no good it names has a processor missing AND no source the
analysis counts for the row's raw material is marked depleted in the town's own settings; otherwise the row gives its
goods and makes no claim of completeness. A declared move, measured on the 720, read in the two readers' towns
(rr2s-town-under_siege-rand-1, rr2s-metropolis-calm-rand-1) and a third. If (2) cannot be read from data the function
already has, say what is missing and take (1) alone with the claim removed where a depleted source is in the town's
settings at all. (My reading, PLAUSIBLE, for the successor: `generateResourceAnalysis` holds `gaps` (its
`evaluateInstitutionChain` output, with each chain's `missing` houses) and `config` (with `nearbyResourcesDepleted`
and `nativeResourceConditionRecords(config)`, already called there as `resourceConditions`), so both (1) and (2)
look readable in the function; the synonym bridge `terrainSynonymsFor` + `tokensReconcile` matches a raw material to
a resource key.)

**RULED for every new or reworded line (record 386):** a hook, a founding line or a spine sentence says only what the
record holds: one that names walls, a house or a role reads the roster; one that speaks of trade or travellers in the
present is not said under a siege. Every line written or reworded is read WHERE IT PRINTS before it is pushed (three
towns, a siege, a famine or an occupation among them where it can print under one, the smallest and the largest tier
it reaches; in the commit body); a twin carries every condition its siblings carry; a line that cannot be made true by
its conditions is not written; every disqualifier cure has its guard town.

**The rows** (`git fetch origin lane/round-3-cut-2026-11-13`, fe6d5b741: ROUND-3-CUT-INCREMENT-2026-11-13.md, packages
H5, H6, H8, M9, M12, M15, M18, and ROUND-3-CUT-INCREMENT.json, key `lines`, class NEW, `at.line` set). Counted by
script: **5 HIGH, 18 MED**, as the chair said. The writer is the increment's script trace, not yet traced by hand.
NOT the successor's: faithReading.js (rb), domain/dossier/powerStrata.js (powers), viability.js (defence).
factionDynamics.js note: this lane already changed its Governing <-> Military row (476800e1d, de27f9fd6; the import
sits on line 18 because the holder census keys the file by line: keep every line above a cure where it is).

| list-i | sev | town · tab | sentence | fact | writer (script's trace) |
|---|---|---|---|---|---|
| ww-4 | HIGH | rww-thorp-calm-1 · Summary/Plot Hooks | Something was sealed inside the walls during construction, deliberately | economicState.compound.inst hasWalls false (no wall institution); the same page: "Defence: No walls and no standing force." and "Unfortified. No perimeter walls." | domain/coherence/hookTruth.js :: settlementHookFacts |
| ww-470 | HIGH | rww-metropolis-wartime-1 · World/History | Jalaliin came through the siege, older than its bearers; its legacy is what the metropolis built in answer to it, and that still stands. | '{timeband_age}' filled with 'older than its bearers' (a phrase for a grudge); misreads for a siege 77 years ago | domain/display/heraldCausalGrammar.js :: CHAIN_END_BANNED |
| ww-1227 | HIGH | rww-village-under_siege-1 · Summary/Overview | Established along a road route. Trade flows in, goods flow out, people pass through. | stress "under_siege" ("nothing comes in by road"); economicState.primaryExports [] and Economics tab "Nothing leaves Qaryatsaray for trade"; Overview's own Coherence Note | domain/simulationSpine.js :: firstNonEmpty |
| pf-88 | HIGH | rpf-city-occupied-13 · Systems/Power | Royal Authority gives the orders and Occupation Authority carries them out; each needs the other to stay strong. | stress 'occupied': 'The forces of another power hold Glenglen, and its own officials take their orders.'; Occupation desc 'External administrative body; all significant d | generators/factionDynamics.js :: computeFactionRelationships |
| pf-514 | HIGH | rpf-metropolis-occupied-13 · Systems/Power | Royal Authority gives the orders and Occupation Authority carries them out; each needs the other to stay strong. | stress.type "occupied": the occupier rules the crown, not the reverse. Overview: "Royal Authority still meets, but nothing it decides stands until the occupiers agree"; O | generators/factionDynamics.js :: computeFactionRelationships |
| ww-1362 | MED | rww-city-recently_betrayed-1 · Systems/Economics | Upstream Food Processing chain is impaired | activeChains food_processing status 'vulnerable', not impaired; header 'Economic Flows (30 active)' counts no impaired chain. | domain/chainYield.js :: (file) |
| ww-702 | MED | rww-thorp-monster_pressure-1 · Summary/Crisis | Nobody here controls what this crisis turns on. | Same tab, 'Who it touches': 'holds the lever: Laelia Cato · nobody here could, so this one stepped in for the crisis' (npcs[] Laelia Cato, role Warden, temporaryKind ward | domain/crisis/crisisPage.js :: CRISIS_PAGE_COPY |
| ww-1263 | MED | rww-metropolis-infiltrated-1 · Summary/Crisis | nobody | 'Who it touches: nobody' (stress.cast.roles = []) while the NPC tab says Caecilia Hispallus 'Is the infiltrator' and Antonia Varus 'Was recruited by the infiltrating part | domain/crisis/crisisPage.js :: CRISIS_PAGE_COPY |
| ww-15 | MED | rww-thorp-calm-1 · Systems/Defense | Those who keep order in Cnocholme spend their days guarding the stores and breaking up fights in the queues. | same tab: "Nobody here is paid to keep order" and "With nobody at Cnocholme paid to keep order, the hunger is policed by neighbours"; no watch institution; foodRecord.sto | domain/crisis/crisisSummaryVantage.js :: CRISIS_SUMMARY_POOLS |
| pf-85 | MED | rpf-village-succession_void+famine-13 · Table/Tonight sheet | Succession Void and Famine. In Lykorema the food stores are under guard, and the guards are as hungry as everyone else. In the famine, Achilles Hyaleas takes the worst of | Defense tab: 'There is no watch here.', 'No organized force. Defense relies on individual armed citizens.'; Tonight 'Defence No walls and no standing force.' | domain/crisis/crisisSummaryVantage.js :: CRISIS_SUMMARY_POOLS |
| pf-667 | MED | rpf-thorp-succession_void-13 · Table/Tonight sheet | Succession Void. Until Wumen has a leader again, no large bargain can be struck there, and the merchants are losing patience. | Overview: 'No market or fair stands in Wumen: what trade the thorp does is done house to house'; no merchant institution or merchant NPC in institutions[]/npcs[] (30 peop | domain/crisis/crisisSummaryVantage.js :: CRISIS_SUMMARY_POOLS |
| pf-260 | MED | rpf-city-succession_void+politically_fractured-13 · Systems/Power | No one holds the seat at Portacastra. The Noble Governorship governs without a head. Prosperity and strong defences have earned the Noble Governorship the approval of Por | 'governs without a head' vs same tab 'Acting Governor Iulia Laenas keeps the seat meanwhile', 'Acting Governor · Iulia Laenas' at the head of the ruling three, and 'The h | domain/display/governanceAccount.js :: governanceAccountOf |
| ww-868 | MED | rww-thorp-plague_onset-1 · Summary/Plot Hooks | An old story from that time: someone is poisoning the ruler slowly, and the physician knows | powerStructure.government "Elder Council" (2 members, no ruler); no physician in institutions; the pool line itself carries excludes ['ruler: council'] and still printed | domain/dossier/plotHooks.js :: ECHO_PREFIXES |
| ww-707 | MED | rww-thorp-monster_pressure-1 · Systems/Economics | Most meals start from cheese and smoked meat from the grazing herds. Public ovens, neighborhood vendors, and shared dining customs make food distribution visibly civic. | compound.inst.hasMarket false; population 28; Overview: 'No market or fair stands in Monteium: what trade the thorp does is done house to house and on the road.' | domain/foodways.js :: FRAMES |
| ww-339 | MED | rww-metropolis-famine-1 · Systems/Economics | Grain Sales Grain from local fields sold within the settlement: it eats more than it grows, so none is left to sell to other settlements. | foodRecord.failedSource "grain"; stress famine "lost its harvest for a second season"; Economics "With the grain harvest gone" | generators/economy/incomeLineSiblings.js :: GRAIN_OWN_FIELDS_LINE |
| ww-1357 | MED | rww-city-recently_betrayed-1 · Systems/Economics | Grain Sales Grain from local fields sold within the settlement: it eats more than it grows, so none is left to sell to other settlements. | economicState.primaryExports includes 'Milled flour'; Resources Export Potential 'bread, beer, animal feed'. | generators/economy/incomeLineSiblings.js :: GRAIN_OWN_FIELDS_LINE |
| ww-371 | MED | rww-metropolis-famine-1 · Systems/Power | Grand Guild Consortium gives the orders and Military/Guard carries them out; each needs the other to stay strong. | Active Conflicts: "High tension Grand Guild Consortium vs Military/Guard"; Crisis stakes "Military/Guard gains · the military gains in a vacuum of governance"; Military/G | generators/factionDynamics.js :: computeFactionRelationships |
| ww-1432 | MED | rww-village-calm-1 · Systems/Power | Merchant Guilds works under the rules Headman's Authority sets, and pays for a hearing in the hall when it wants something. | compound.inst.hasGuild false, hasMerchantGuild false; Overview: 'no guild between seller and buyer' | generators/factionDynamics.js :: computeFactionRelationships |
| pf-89 | MED | rpf-city-occupied-13 · Systems/Power | Religious Authorities answers to Royal Authority. Its priests look after their flocks and have no say in the hall. | factions[Religious Authorities].desc 'Clergy and church institutions exercise meaningful civic influence ... they play Occupation Authority and Royal Authority against ea | generators/factionDynamics.js :: computeFactionRelationships |
| pf-90 | MED | rpf-city-occupied-13 · Systems/Power | Noble Families still have their titles, but merchant money and the hall's offices have taken most of their power. | factions[Noble Families].desc 'Still ahead of merchant interests in real influence, for now.'; Noble Families 10 vs Craft Guilds 7 | generators/factionDynamics.js :: computeFactionRelationships |
| pf-590 | MED | rpf-town-politically_fractured-13 · Systems/Power | Religious Authorities and Church Council are the same people in practice; the hall rules because the faith says it may. | no shared members: Religious Authorities has 1 member (Cesair O'Sullivan), Church Council 16 others; same tab marks Religious Authorities 'Contests the seat' and 'Holds t | generators/factionDynamics.js :: computeFactionRelationships |
| pf-591 | MED | rpf-town-politically_fractured-13 · Systems/Power | Military/Guard no longer takes orders from Church Council. Church Council keeps the title; Military/Guard makes the decisions that matter. | same tab: 'Holds the title; the decisions that matter are made by Religious Authorities.'; Military/Guard is 'Minor' 19 vs Religious Authorities 'Strong' 47 | generators/factionDynamics.js :: computeFactionRelationships |
| pf-813 | MED | rpf-metropolis-wartime-13 · Systems/Power | Grand Guild Consortium gives the orders and War Council carries them out; each needs the other to stay strong. | powerStructure.conflicts: Grand Guild Consortium vs War Council, intensity "high", issue "A ruling one power refuses to obey" (World/Relationships "High tension"); War Co | generators/factionDynamics.js :: computeFactionRelationships |

## The first seat's last two runs, at fb8b24fbe (EXECUTED; finished after the hand-back of 74366192c)

These read fb8b24fbe, the first seat's final code tip, not the second seat's later tip; the second seat re-runs both
at its own final tip.

- **The census counter** (lane/second-wave-census-2026-11-12 at 6b262d4e0, census.sh, 2 workers), base aac79b808
  against fb8b24fbe. The hazard was checked: census.sh pipes its counter, so count.mjs was re-run alone on each tree.
  Its own exit was **0 on both**, its output sorted matched counts.txt on both, and each holds its **50 rows**, with
  720 dumps each. compare.mjs: **every row is OLD, base = tip, no row rises or falls** (e.g. row 18 "count ranges as
  names" 360/360, row 20 "siege text, no siege" 689/689; GLANCE towns 710/710). None of the census's rows counts a
  sentence this seat cured, so a flat census is what the cures predict.
- **The whole suite** at fb8b24fbe (`npx vitest run --maxWorkers=2`, ledger branch fetched): **16 files failed, 22
  tests failed**; 38,941 passed, 146 skipped. Refs and local config were the same before and after the run, apart from
  this branch's own pushes. The 16 files were re-run at base aac79b808: 8 files and 13 tests are red there too.
  - **Red at base too (13 titles, the line's own set):** landingFixtureFreshness (2), foundingWorldBones,
    undercitySewerDerivation, newsHeadlineContract.walker, newsVoiceContract.walker, proseFamilyContract.walker (A1, A2,
    A3, A5, A6), siteCoherenceRatchet C1, dossierProseManifest (the drift arm, the four-seed drift corpus, the
    mixed-pool audience arm).
  - **Red only at the tip, this seat's 9 titles, each classed:**
    1. espionageDormancyFence, "THE DRIVEN GOLDEN: 360 settlements …": a GOLDEN SURFACE moved by the declared generator
       moves (476800e1d power relations, cdf84d431 structuralViolations). The merge seat's door.
    2. institutionBudgetPromise, "every one of sixty seeds is byte-identical with the density factor forced to 1.0", and
       3. x46NpcBand, "sixty seeds … byte-identically to the dark digests": byte-identity digests over generated towns.
       They move by the same declared generator moves; re-recorded through their own doors with that cause.
    4. townCartographyCalibration W2 and 5. W8, "every sampled row reproduces its manifest record exactly" and "each
       tier's argmax row re-measures …": cartography rows recorded over generated towns (9 rows). Their bytes move with
       the record. PLAUSIBLE that this is the same declared move (structuralViolations' reason length in the record);
       not traced row by row.
    6. sovereigntyLightingContract, "THE CENSUS IS AN ASSERTION …": the lighting census's file count, 3234 to 3238
       (this seat's four new test files). The census's own door, re-frozen at the merge.
    7. mutationCoverageManifest, "TOTALITY: every enumerated invariant file has a manifest entry": two of this seat's new
       test files, tests/generators/embattledReasonNoSlider.test.js and occupierRelationLine.test.js, need an entry in
       scripts/mutation-coverage-manifest.json. **OWED**, a test-hygiene row (the manifest's door).
    8. presumedThings.walker, "no stale row: a cured line leaves the register in its own commit": the row for the cured
       structuralValidator reason. **Done on the lane by the second seat** (19d4a8506).
    9. tuningRegister.walker, "no file carries more bare decimals than the inventory banked": factionDynamics.js went
       from 38 to 39 bare decimals, from 476800e1d's `ratio > 1.2` (the occupier row's band). **OWED**: name it, or give
       it a DECLARED_GROWTH entry. Cleanest: reuse the competitive band's own cut instead of a second literal.

## THE SECOND SEAT (R3-CODE-C-2), kept current after every item

The seat R3-CODE-C-2 (session_01FE9mEtaa8NvaX3ho5zd1nH), started from the lane's tip **74366192c** (read back
from origin). Its assignment is the chair's message of 2026-11-13 (copied in brief): the 20:4x rows above, in the
order 5 HIGH, #457 and #1163 as ruled, the 18 MED by file; then the merge of the line's tip
(lane/integration-2026-11-07, 9e57f5023 or later) and the final statement for the whole lane. Rulings it carries
beyond those above: "One that another lane holds is NAMED with its file in your hand-back and left"; NOT this
lane's: faithReading.js, crisisCast.js (rb), domain/dossier/powerStrata.js, src/generators/power/**,
src/data/people/** (powers), viability.js, economicState.js, causalState.js, defenseFacts.js (defence),
settlementOriginProse.js (ra), src/data/** (data and corpus lanes), the tabs. The census.sh hazard: read the
counter's own exit and that counts.txt is not empty. If CENSUS-2's command arrives, run it on this tree.

**How the measures are rebuilt (EXECUTED).** The 720: REVIEW-R2-STAGES births.mjs (lane/review-r2-stages-2026-11-13,
be53f933b) unchanged in its seeds and dials (r2r-<size>-0..59 with every dial random, r2s-<crisis>-<size>-0..3 with
`selectedStresses:[crisis]`, `selectedStressesRandom:false`). The 240 fresh: the same script with the first seat's
fresh seeds (r2r-<size>-fresh3c-0..9, r2s-<crisis>-<size>-70..71). Field diff: REVIEW-R2-STAGES fielddiff.mjs. The
readers' towns: the ROUND-3-CUT increment's render.rww.jsx and render.rw3.jsx with seeds.ww.txt and seeds.pf.txt
(the readers' render.sh, two workers each), rendered at each commit and line-diffed town by town.

### The 5 HIGH

| line | town | true writer (traced) | outcome | commit |
|---|---|---|---|---|
| pf-88, pf-514 | rpf-city-occupied-13, rpf-metropolis-occupied-13 | factionDynamics.js :: computeFactionRelationships (the occupier row) | ALREADY CURED by the first seat's 476800e1d (the cut's lines are at the line's tip aac79b808). EXECUTED at 74366192c: both towns now read "Royal Authority carries out what Occupation Authority decides." | 476800e1d |
| ww-470 | rww-metropolis-wartime-1 | heraldCausalGrammar.js :: TIME_BANDS, the sixth band's predicate ("older than its bearers", a grudge's phrase), filled by generalStateProse.js :: timebandAgeFill into the legacy molds | CURED: "older than anyone living". 25 broken prints in the 60 readers' towns -> 0, each replacement read; 0 leaf diffs on 960 births | a322b602f |
| ww-4 | rww-thorp-calm-1 | stored by historyGenerator.js (The Great Construction's hook; the data lane's file, w2-fix-data): NAMED there, cure: a wall-less twin. Gated by hookTruth.js :: WORDS.walls (mine) | CURED at the gate: "inside/within the walls" (no "of") is a claim of walls (record 386). Declared move: 9 of 960 births, history + the coherence receipt (which had flagged the same hook) | a4897beb6 |
| ww-1227 | rww-village-under_siege-1 | settlementOriginProse.js :: ORIGIN_POOLS.road[0] ("Trade flows in, goods flow out"), stored as settlementReason by narrativeGenerator.js :: generateSettlementReason (which passes no siege) and printed by OverviewTab.jsx's "Settlement Origin"; simulationSpine.js only reads the same stored sentence | NAMED to ra (settlementOriginProse.js is ra's; narrativeGenerator.js is held by ra, bd, fd, wr): the same fault and the same cure as the first seat's #154 (the caller passes the siege; the pool refuses its present-traffic rows road[0], road[2], road[3] under a siege; the refused pick resolves draw-free) | — |

### #457 and #1163 (as ruled)

CURED at 9a3239ae7 (resourceGenerator.js :: evaluateInstitutionDeps). Both rules read from the analysis's own data
(the gaps' missing houses and their own chains' goods; nativeResourceConditionRecords). Declared move: 54 of 720 and
22 of 240 towns, one export row each, resourceAnalysis only. GOLDEN SURFACES moved by this cause: the generator golden
master (91 configs) and worldFactRederive A7, pipelinePinnedChoosers A1 (green at eba8e5397): the merge seat's door.
Note: resourceGenerator.js is also changed by w2-c-leaves (STRENGTH_SUPPORT, townSupports, a disjoint hunk).

### The chair's messages to this seat (copied: the messages are not on the branch)

- 21:14Z: an independent reader (lane/review-r3-stages-2026-11-13, b3bbda3f5, REVIEW-R3-STAGES-LINES-READ.md, stage
  C1) read the first stage: 8 of 9 lines true. ONE FALSE AT MEDIUM, RULED, its own commit, red first: the reworded
  embattled-region warning (the first seat's cure of #325/#468, structuralValidator.js) keeps "A beleaguered outpost"
  and prints it in 36 cities and metropolises. "outpost" is a size word: said only of a place small enough to be one;
  a larger place gets a twin true of its size, or the clause is left out. Reproduce on the reader's towns; read the
  cure in three towns (the smallest and the largest size it reaches); a guard town. The reader also notes five of the
  stage's lines never reach the page (the daily-life slots go only to the AI grounding): to be said here; no cure asked.
- 21:27Z: the five high lines at eba8e5397 are taken. CENSUS-2's first count (lane/census-2-2026-11-13, a5cda3915,
  CENSUS-2-2026-11-13.md and CENSUS-2.json, key `hits`): three kinds of fault over the 720 at the line's tip; a hit is
  a CANDIDATE, read against the town's record before a cure. NOW THIS LANE'S FILES: outlookHookSiblings.js
  (STARVING_HOOK 26 towns, MODERATE_GAP_TWIN 19, PEACE_IRON_HOOKS 2), hookThemes.js (AUTHORED_HOOK_THEMES, 7 + 7),
  facts/magicSource.js (MAGIC_NOTE_TRADITION 11), dossier/plotHooks.js (TENSION_LABELS 2), servicesGenerator.js ("ask
  around at the right tavern", 10). Not the data tables. And for every writer this lane holds, its CENSUS-2 hits.
  ORDER: #457/#1163, the "outpost" ruling, then the medium rows and these together, the widest writer first. The
  measuring seat's command, when sent, is run on this tree before the final statement.
- 21:51Z: CENSUS-2's command is ready (lane/census-2-2026-11-13 at 2686272b1). Eight kinds: (a) a house, role or force
  the town lacks; (b) normal times under a crisis; (c) a size word in a small place; (d) broken text; (e) a denial of
  what the town has; (f) a house's name with a count range, gate or condition; (g) machinery on the page; (h) an empty
  seat's keeper named by the bare title. RUN: `git fetch origin lane/census-2-2026-11-13`; `mkdir -p <scratch>/c2 &&
  git archive origin/lane/census-2-2026-11-13 docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <scratch>/c2`; `sh
  <scratch>/c2/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree root> <out-dir outside the repo> 4 --files
  <this lane's files, comma-separated>` (about 12 minutes; writes hits.by-file.json and counts.txt; to a file or
  through gate-tail.sh, never a pipe; if it will not start, send the chair the error in one line). THE RULE: before
  the final statement, run it at the tip; read every hit in this lane's files against its town's record; cure it or
  name it here with the reason; the statement gives each kind's count in this lane's files at the lane's base and
  tip, with its limits beside any zero (the dossier's views only; it cannot see two lines of a page disagreeing).
  ONE MORE FILE IS THIS LANE'S: src/domain/facts/officialsInPay.js: a (d) hit (one town), cure it; an (f) hit (20
  towns): the display leaf that strips a house's range is on round two B's lane, so write the call site under a
  heading "FOR THE JOIN" here (file, function, the expression, the one-line change).
- 21:57Z: the independent reader's verdict on stage C1 (lane/review-r3-stages-2026-11-13, 34c0d13f9,
  REVIEW-R3-STAGES-2026-11-13.md): one medium, the outpost (cured at 0804874b0). RULED: A SEAT THAT REWORDS A SENTENCE
  OWNS THE WHOLE SENTENCE AS IT PRINTS; the stage stays not clear on that line until the cure is read. FOUR LOW
  findings for the stage are listed there: take each with the medium rows, cure it or name it here with the reason.

### Items since #457 (EXECUTED unless marked)

| item | writer | outcome | commit |
|---|---|---|---|
| C11 the "outpost" (the ruling of 21:14Z) | structuralValidator.js :: checkStructuralValidity | CURED: left out at city size and above; 19 of 720 and 6 of 240 towns, structuralViolations only; read in r2r-thorp-17 (kept), r2r-city-47 and r2s-politically_fractured-metropolis-2 (without it) | 0804874b0 |
| presumedThings stale rows | the first seat's #325/#468 arm-1 row; this seat's #ww-4 arm-2 row | removed through the register's door; the walker 19 of 19 | 19d4a8506, 6fc505ea6 |
| CENSUS-2 a27 / STARVING_HOOK, MODERATE_GAP_TWIN (45 towns) | outlookHookSiblings.js | READ all 45: false in 36 (an isolated route or a siege: no merchant can come), true in 9 road towns that import food. CURED by the set's declarations: famine there reads "The settlement is starving, and its hungriest are turning to banditry." (new wording); a moderate gap there drops its hook. 36 + 14 towns, economicViability only | 0b3ce25a3 |
| CENSUS-2 PEACE_IRON_HOOKS (2 towns) | outlookHookSiblings.js | READ TRUE (a crossroads hamlet and a river village buy iron from merchants on the route); not changed | — |
| #pf-591, #pf-90 (+ CENSUS-2 r2r-village-27), #pf-590; the first seat's OWED tuning-register row | factionDynamics.js :: computeFactionRelationships | CURED: "makes the decisions" only as the strongest power; "merchant money" only beside a stronger merchant power; a separate religious power is not "the same people"; the occupier's kind from the band chain (the tuning walker green). 59 + 15 towns, powerStructure and the goals that read the row | f51767e11 |
| #ww-371, #pf-813 | factionDynamics.js (the symbiotic row) vs src/generators/power/conflicts.js (a high-tension conflict between the same pair, written after this function runs) | NAMED to the powers lane: the row cannot read the conflict at its step; the cure is where both are known (the settling pass, power/rosterText.js, or the conflict writer) | — |
| #pf-89 | factionDynamics.js (subordinate church, "no say in the hall") vs the ruling few ("Contests the seat", read on the page from the people lane's roles) | NAMED to the powers lane, for the same reason | — |
| #ww-1432 | a "Merchant Guilds" power with no guild on the roster | NAMED to the powers lane (src/generators/power/**: the power's existence); the row only names it | — |
| CENSUS-2 r2s-plague_onset-town-0 ("Landed Gentry … keep enough rights of their own (land, courts, levies)", kind a, court) | factionDynamics.js, the dependent noble row | NOT READ (left for the successor) | — |

### Found on the way (EXECUTED)

- **A non-fast-forward push runs the WHOLE check.** git refuses a rejected ref before the pre-push hook, so the hook
  reads no lane ref and falls to `npm run check` (the full suite). Fetch and merge BEFORE every push, never after.
  It happened once here (the first seat's 765a94dd8 had landed); the run was stopped, the push merged and redone.
- **The goldens.** Green at 74366192c: the generator golden master, worldFactRederive A7, pipelinePinnedChoosers A1.
  Moved by this seat's causes: the golden master 91 configs at #457 (9a3239ae7), 139 after the merchant hook
  (0b3ce25a3), still 139 after f51767e11; A7 and A1 since #457. Red before this seat's work and still red:
  espionageDormancyFence's driven golden, generationForkCensus A1's control row, powerEconomyFreshness A4 (11).
  All are the merge seat's door; no door run here.
- **The first seat's runs at fb8b24fbe, owed items:** the mutation-coverage manifest entries for
  tests/generators/embattledReasonNoSlider.test.js and occupierRelationLine.test.js are STILL OWED (manifest's door);
  the tuning-register row is paid (f51767e11); the presumedThings row is paid (19d4a8506). The first seat's
  townCartographyCalibration W2/W8, institutionBudgetPromise and x46NpcBand reds: not re-read here.

### STOP AT THE CONTEXT LIMIT — what the successor takes (not started; nothing changed for them)

The code tip is f51767e11 (read back from origin); this file's own commit is the one after it. In the chair's ORDER (the medium rows and the new writers together, the
widest writer first), still to do:
1. **plotHooks.js** (now this lane's whole file): #ww-868 (rww-thorp-plague_onset-1, "An old story from that time:
   someone is poisoning the ruler slowly, and the physician knows" in an Elder Council of 2, no ruler, no physician;
   the pool line carries excludes ['ruler: council'] and still printed); CENSUS-2 ECHO_PREFIXES (19 towns: the
   echo-framed history hooks, whose texts are historyGenerator.js's, the data lane's) and TENSION_LABELS (2).
2. **hookThemes.js** :: AUTHORED_HOOK_THEMES (7 towns kind a, 7 kind c); **facts/magicSource.js** ::
   MAGIC_NOTE_TRADITION (11); **servicesGenerator.js** ("ask around at the right tavern", 10);
   **facts/officialsInPay.js** ((d) 1 town; (f) 20 towns: FOR THE JOIN, as the 21:51Z ruling says).
3. **crisisSummaryVantage.js** :: CRISIS_SUMMARY_POOLS (#ww-15 "Those who keep order … guarding the stores" with nobody
   paid to keep order; #pf-85 "the food stores are under guard" with no watch; #pf-667 "the merchants are losing
   patience" in a thorp with no market or merchant; CENSUS-2: 2 more); **crisisPage.js** :: CRISIS_PAGE_COPY (#ww-702
   "Nobody here controls what this crisis turns on" beside a named lever holder; #ww-1263 "Who it touches: nobody"
   beside the infiltrator's NPCs).
4. **incomeLineSiblings.js** (#ww-339, #ww-1357, GRAIN_OWN_FIELDS_LINE: "none is left to sell" beside a failed grain
   harvest and beside milled-flour exports; check, as the first seat did for its two coal rows, whether the true writer
   is economicState.js, the defence lane's); CENSUS-2 LOCAL_COAL_LINE / LOCAL_COAL_SOLD_LINE (4 towns: the first seat
   traced them to economicState.js).
5. **foodways.js** :: FRAMES (#ww-707: "Public ovens, neighborhood vendors, and shared dining customs" in a thorp of 28
   with no market); **chainYield.js** (#ww-1362: "Upstream Food Processing chain is impaired" where the chain is
   vulnerable); **governanceAccount.js** (#pf-260: "governs without a head" beside an acting governor).
6. The four LOW findings of REVIEW-R3-STAGES (34c0d13f9) for stage C1; the reader's note that five of the stage's
   lines never reach the page (the daily-life slots go only to the AI grounding): say so, no cure asked.
7. Then: the CENSUS-2 command on the tip (base aac79b808 against tip, every kind, this lane's files, the hazard read);
   the mutation-manifest entries owed; the merge of the line (lane/integration-2026-11-07, 9e57f5023 or later, a plain
   merge commit); THE FINAL STATEMENT for the whole lane at its final tip (the whole suite, the census counter of
   lane/second-wave-census-2026-11-12 with its own exit checked, the 720 field diff by family base aac79b808 against
   tip, the draft shift record naming every moved golden surface above, the new words, the edge bundles last and
   alone: this seat changed no bundled file it knows of; re-emit and diff to be sure).

**New wording for the owner's veto, this seat:** "older than anyone living" (a322b602f); "The settlement is starving,
and its hungriest are turning to banditry." (0b3ce25a3).
