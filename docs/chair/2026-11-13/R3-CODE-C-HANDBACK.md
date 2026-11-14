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

## THE THIRD SEAT (R3-CODE-C-3), kept current after every item

The seat R3-CODE-C-3 (session_01FE9mEuWNtxm4EQz18xGtYK), started from the lane's tip **6622bcdbf** (read back from
origin: code tip f51767e11, as the brief said). Its assignment is the chair's message of 2026-11-13 (copied in brief):
the second seat's successor list above, in its order, with these changes: (1) plotHooks.js is the lane's whole file;
#ww-868 "find why the exclude did not hold, then cure the line AND the reason"; ECHO_PREFIXES "the hook's own text is
the data lane's: cure only what the frame says falsely, name the rest"; (4) the income lines are ONE FAMILY on the
defence lane (its seat works in economicState.js and APPENDS twins to incomeLineSiblings.js): find each row's true
writer; where it is economicState.js or a condition there, NAME it with town and fact; cure here only a row whose
fault is the text of an existing row no condition could make true, and then by APPENDING a twin, changing no
existing row; (5) chainYield.js #ww-1362 is NOT this lane's now (another lane cures the note where it prints: leave
the writer alone and say so); (6) the four LOW findings and the five lines that never reach the page; (7) CENSUS-2's
r2s-plague_onset-town-0 ("courts"); (8) the command's rule (record 403), base aac79b808 and tip; (9) the two
mutation-manifest entries, the merge of the line, THE FINAL STATEMENT. THE METHOD (records 386, 387, 404): read
where it prints (three towns, a siege, a famine or an occupation, the smallest and largest tier); a twin carries
every condition of its siblings; a line naming a house, role, force or good reads the roster; a line that cannot
be made true is not written; every cure has its guard town; a seat that rewords a sentence owns it whole. The
powers lane holds #ww-371, #pf-813, #pf-89, #ww-1432 (passed). Never rewrite a commit at or below 6622bcdbf.

**How the measures are rebuilt (EXECUTED).** The 720 and the 240: REVIEW-R2-STAGES births.mjs (be53f933b), its
seeds and dials unchanged, with the fresh set's seed match widened to `r2r-<size>-fresh3c-<i>`
(r2s-<crisis>-<size>-70..71 as before); 0 errors at every tree. Field diff: its fielddiff.mjs. The readers' towns:
the increment's render.rww.jsx (seeds.ww.txt) and render.rw3.jsx (seeds.pf.txt), two workers each, at each commit,
line-diffed town by town (the lazy "Patron deity" panel's timing is noise in both trees). HAZARD seen: `npm ci` set
`core.hookspath=.husky/_` in the shared local config (it was unset before); kept, since it is what runs the lane's
pre-push gates; refs and config compared before and after every push since.

### Items (EXECUTED unless marked)

| item | writer (traced) | outcome | commit |
|---|---|---|---|
| #ww-868 (rww-thorp-plague_onset-1) | the hook: historyData.js (succession_crisis, `excludes: ['ruler: council']`, fd's); the frame: historyGenerator.js; the gate every hook passes: hookTruth.js | WHY THE EXCLUDE DID NOT HOLD: rulerKind.js reads "Elder Council" as `elder` (and church councils as `priest`); 87 of 146 ruler-hook towns are council-governed and none reads `ruler: council`. CURED at the gate (birth and page): "the ruler" refused where a council governs; "the physician" refused with no healer, monastic house or hospital. 85 of 720, 28 of 240, history only, the moved set = the predicted set. NAMED to fd: the row's declaration. PARKED: a council-presence atom (a new vocabulary word) | 6e658915a |
| CENSUS-2 ECHO_PREFIXES (19 towns) | plotHooks.js only MATCHES the prefixes (never printed); the frame is historyGenerator.js's; every hit's false word is in the hook's own text, historyData.js HISTORICAL_EVENTS_DATA.plotHooks (fd's) | READ, the frame says nothing false (each frames a past telling; "Families who lived through it" has its twin past sixty years). NAMED to fd, by text: "a merchant is funding both the reform movement and the suppression of it" (11 towns, e.g. r2r-hamlet-18, no merchant); "the affected district is slowly spreading its strangeness" (4: r2r-thorp-47, r2s-recently_betrayed-hamlet-1, r2s-infiltrated-thorp-2, r2s-infiltrated-village-2: a district in a thorp, hamlet or village); "a healer who profited enormously during the plague" (3: r2r-town-53, r2s-wartime-hamlet-3, r2s-wartime-village-0, no healer); "a guild master's records have gone missing" (r2s-wartime-hamlet-0, no guild) | — |
| CENSUS-2 TENSION_LABELS (2: r2r-hamlet-43, r2r-village-12) | the label names the tension the record holds: a guild_conflict ("Rival guilds fought over who may sell what") in places with no guild; the choice is historyGenerator.js's (fd's) | NAMED to fd; the label is true to its tension | — |
| THE MERGE OF THE LINE (item 9, taken early) | lane/integration-2026-11-07 at 9e57f5023 (read back; not past it) | MERGED before item 2: facts/magicSource.js and facts/officialsInPay.js exist only on the line (CENSUS-2 counted at 9e57f5023). Only the eight generated edge bundles conflicted; resolved by `npm run build:edge-shared` on the merged sources (49 of 49 edge tests green). Every later measure is based on the merge | 8e9046124 |
| CENSUS-2 hookThemes.js :: AUTHORED_HOOK_THEMES (7 kind a, 7 kind c) | hookThemes.js only maps a hook's text to its theme (never printed, never drawn from); the texts are src/data/npcData.js's person-hook pools (ra holds npcData.js) | NAMED to ra, by text: "A merchant they spoke against has started praising them in public" (6 towns, e.g. r2r-thorp-1, no merchant); "quietly buying up property in a district that hasn't been announced" (7: hamlets and villages, e.g. r2r-hamlet-20); "Their master craftsman is talking to a rival" (r2s-succession_void-thorp-1, no workshop) | — |
| CENSUS-2 servicesGenerator.js "Ask around at the right tavern" (10) | same (the fence row of three branches, 'Background crime' in villages) | CURED: the tavern only where facts/institutions.js :: hasInstitution(record, 'tavern') answers; else the twin "Ask around quietly. Someone moves goods without questions." 11 of 720 and 6 of 240, availableServices only; read in r2r-village-58 (famine, 78), r2r-village-55 (siege, 102), r2r-village-59 (303); guard r2r-village-55 | 33b473879 |
| CENSUS-2 facts/magicSource.js :: MAGIC_NOTE_TRADITION (11) | magicSource.js only classifies a magic note's tradition (never printed). The line "Bowyer & fletcher: Arcane fabrication provides processed goods…" is MagicTab.jsx's frozen-chains row (`chainPrintName(c).label: c.magicNote`); the label is the chain catalogue's (src/data/supplyChainData.js, the data lane's) and is also a catalogue house name | READ: in all 11 the chain's processor (Craft guilds) stands and the note's tradition has its houses on the roster (arcane: wizard's tower, scroll scribe…; druid: Elder Grove Council…); the only false-reading word is the chain's label, a trade name taken for a house. NAMED (the tab; the data lane's label); a catalogue name is not renamed (the lane's ruling) | — |
| CENSUS-2 facts/officialsInPay.js kind d (r2r-metropolis-7) | officialsInPay.js returns names and prints nothing. The row is WhoRunsThisTownPanel.jsx's agent row (`<Face face={a} />{a.title ? \`, ${a.title}\` : ''}`), whose EntityLink prints the entity index's current name, already "Tserenpuntsag Jalayir (the workhouse master)"; the row then adds ", the workhouse master". rb holds the panel (it changes it) | NAMED to rb with the cure: the row adds the title only when the link's label does not already carry it. EXECUTED: rendered at this tip, Systems/Power, the line prints as the census says | — |
| CENSUS-2 facts/officialsInPay.js kind f (20 towns) | the same panel's ` (${a.house})`, where patronage.js :: faceOf writes `house: String(rec(card.institution).key ?? '')`, the catalogue key ("Parish churches (2-5)") | FOR THE JOIN (below) | — |
| #ww-15, #pf-85, #pf-667, CENSUS-2 c36 (2 towns) | crisisSummaryVantage.js :: CRISIS_SUMMARY_POOLS (famine.defence.official, famine.tonight.watch, succession_void.tonight.trade, politically_fractured.defence.local); the call sites (tonightSheet.js rb, the PDF view model up/uc/wc, DefenseTab.jsx rt) pass only the entry and the name | CURED by rewording to what the kind guarantees (the file's own law): "Those who answer for {name} spend their days settling quarrels over food, and every week there are more of them."; "In {name} what food is left is watched day and night, and those watching it are as hungry as everyone else."; "…, and those waiting on one are losing patience."; "People in {name} keep away from where one power's ground meets another's, most of all after dark." Display only; read in 9 rendered towns (thorp of 5 to metropolis of 142,726); guards rww-thorp-calm-1, rpf-thorp-succession_void-13 | b6208d93a |
| #ww-702, #ww-1263 | crisisPage.js :: CRISIS_PAGE_COPY (noLevers, nobody), printed by the Crisis tab, the PDF chapter and the Foundry journal | CURED: "No house here holds what this crisis turns on." (the levers are institutions; the cast's lever role is a person's); "no one yet named" (an empty cast is an infiltration, its people the roster's secrets, or a war with no defender: 31 + 21 of 960). Display only; read in 6 rendered towns; guards the two readers' towns. NAMED to rb: crisisCast.js takes no cast role for an infiltration's infiltrator and recruits, whose secrets the roster holds (rww-metropolis-infiltrated-1: Caecilia Hispallus, Antonia Varus) | 2ce44a973 |
| THE CHAIR'S ROW of 23:40Z (servicesGenerator.js: a service under a house's name) | servicesGenerator.js's criminal fallback names its fence row FENCE_WORD_OF_MOUTH, "Fence (word of mouth)", a catalogue house (the only house name among its 23) | CURED: the house's name only where the roster holds it (6 rows), else "Fencing stolen goods" (139); 102 of 720, 37 of 240, availableServices only; read in ten towns, thorp to metropolis, two sieges. "Black market bazaar" (22 towns here with no such house) is a catalogue SERVICE of the Underground city house, src/data/institutionServices.js: NAMED to the data lane | 06fe8a86b |
| #ww-339 (rww-metropolis-famine-1), #ww-1357 (rww-city-recently_betrayed-1): GRAIN_OWN_FIELDS_LINE | the text is incomeLineSiblings.js's; the CHOICE is economicState.js :: generateEconomicState (`if (entry.desc === GRAIN_SURPLUS_LINE && !offersFoodSurplus(_foodRecord)) entry.desc = GRAIN_OWN_FIELDS_LINE`), which reads neither a failed grain harvest nor a flour export | NAMED to the defence lane (economicState.js; the ruling of this brief): EXECUTED at this tip, both towns print the line; #ww-339 beside foodRecord failedSource "grain" (and Milled flour exported), #ww-1357 beside primaryExports "Milled flour". The text is true where local fields bear and no grain good is sold on, so a condition makes it true: no twin appended here | — |
| CENSUS-2 LOCAL_COAL_LINE (r2s-under_siege-city-2), LOCAL_COAL_SOLD_LINE (3: r2r-thorp-45 and two more) | economicState.js :: generateEconomicState (the Iron & Metalwork branch picks the coal lines on coal_deposit and FORGE_HOUSE_WORDS alone; it reads no siege) | NAMED to the defence lane, as the first seat named #501/#1301: "leans on the trade route", "bought in", "sold to the forges of other towns" are true off a siege; a siege condition at the site makes them so. No twin appended | — |
| #ww-707 (rww-thorp-monster_pressure-1) | the flavour is src/data/cultureProfiles.js's (fd's, undeclared); the choice is foodways.js :: composeFoodwaysLine's filter | CURED: a culture line naming sellers (vendors, stalls, hawkers) stands only where the market home says a market does; 29 of 720 and 5 of 240 (every market-less thorp, hamlet and village that printed it), the foodways line and its culturalIdentity copy only. NAMED: "neighborhood" in 2 market hamlets (the composer is not told the tier: foodGenerator.js is up/uc's); fd's "Shared waterworks … urban food supply", "… dense populations" (CENSUS-2 a17/c: 40, 30, 21 towns) | c61b61434 |
| #ww-1362 (chainYield.js) | — | NOT THIS LANE'S NOW (the brief): another lane cures the note where it prints; the writer left alone | — |
| #pf-260 (rpf-city-succession_void+politically_fractured-13) | governanceAccount.js :: governanceAccountOf (read beside people/seatKeeper.js :: seatKeeperOf, not changed) | CURED: "governs without a head" only where no one keeps the empty seat; display only; 47 keeper towns of 960; read in a thorp under a famine and two metropolises; the chair's condition (b) pin re-keyed by identity (its planted cast holds a keeper) | 4ba5449e6 |
| CENSUS-2 r2s-plague_onset-town-0 ("Landed Gentry … keep enough rights of their own (land, courts, levies)") | factionDynamics.js :: computeFactionRelationships (the dependent noble row) | READ in its town (EXECUTED; no court house on the roster, Landed Gentry 23 under a Military Council 32): the parenthesis names RIGHTS a landed house keeps (its land, its own court, its levies), not houses or forces the town holds. Judged TRUE; not changed (the chair may overrule) | — |

### FOR THE JOIN (the 21:51Z ruling)

- **The house's label in "Who answers to whom" (CENSUS-2 kind f, 20 towns, e.g. r2r-town-14: "Maisa al-Andalusi, the dean
  (Parish churches (2-5)) · brings protection and decisions").** The value: src/domain/people/patronage.js :: faceOf,
  `house: String(rec(card.institution).key ?? '')` (the catalogue key, read by the panel and by the PDF's view model,
  the only two readers of `dmPowerViewOf`). The print sites: src/components/new/tabs/WhoRunsThisTownPanel.jsx (the
  handler row, the agent row, the fronts row) and src/pdf/sections/WhoRunsThisTown.jsx. **rb's lane already makes the
  one-line change at each print site** (lane/r2-code-b-2026-11-13 at e878a1367: `${a.house}` ->
  `${institutionHouseLabel(a.house)}`, from domain/display/institutionDisplayName.js). At the join nothing more is
  owed; if rb's print-site change does not land, the one-line change is in faceOf:
  `house: institutionHouseLabel(String(rec(card.institution).key ?? ''))`.

### The chair's messages to this seat (copied: the messages are not on the branch)

- 23:40Z: ONE ADDED ROW with item 2 (servicesGenerator.js): the data lane traced 119 towns to the criminal fallback, a SERVICE printed under the name of a catalogue house the town does not hold ("Fence (word of mouth)" 101, "Black market bazaar" 24, its text "Ask around at the right tavern…"; the measuring seat filed it under institutionServiceKeys.generated.js, which prints nothing). RULED: a service is never printed under the name of a house the roster does not hold: the fallback's service reads the roster's own criminal house (and takes its label) or carries a plain name that names no house (new wording, listed with five towns across tiers, a siege among them); "the right tavern" only where a tavern stands (one cure for the whole sentence). Measure first on the 720; read ten after; a declared move confined to the services.

### Found on the way (EXECUTED; NAMED, not changed: no adjacent repair)

- **The same presumption in other lines of CRISIS_SUMMARY_POOLS** (counted over the 960 at 8e9046124, where each prints;
  the call sites pass no roster, so a cure is a rewording): "Those who keep order in {name} …" (defence.official of
  indebted, insurgency, mass_migration arrivals, religious_conversion, slave_revolt; "everyone set to keep order" in
  slave_revolt's cover and defence.watch): 30 prints (a town and surface each) with no watch, militia, garrison or
  company, 38 with one (corrected: 1df088d31 said 33 and 37); "the merchants" (occupied cover.trade 6 towns with no market or merchant house of 12; succession_void
  cover.trade "Big business waits … the merchants hold back their coin", 2 of 14; insurgency cover.trade 2 of 9);
  "streets" in thorps and hamlets (indebted cover, plague_onset cover and tonight.watch, religious_conversion cover,
  succession_void cover.watch, insurgency defence.watch, occupied overview.local, religious_conversion defence.local):
  33 prints in thorps and hamlets (corrected: 1df088d31 said 31 small towns), the PDF cover and
  overview and the Tonight sheet mostly (CENSUS-2's render covers neither the PDF nor the Tonight sheet).
  Recommendation: one rewording pass of the table by its own law, the same shape as b6208d93a.
- **The Succession Crisis event under a council** (historyGenerator.js, fd's): its description "The ruler of the time was
  aging or ill, and potential heirs jockeyed for position" is drawn in council-governed towns too (e.g.
  rpf-hamlet-occupied-13, a Household Council). The ruler rows are refused now (6e658915a); the event's own selection
  is fd's.

### Item 6: the stage read's four LOW findings and the lines that never reach the page (REVIEW-R3-STAGES, 34c0d13f9)

Named, no cure asked: (4) the plural possessive leaf gives "Noble Houses's" (8 metropolises), AI grounding only
(powerSentenceName.js :: powerPossessive, read not changed by this lane); (6) #1074's declaration counted towns, not
goals: 126 goals re-dealt in the 9 census towns (595 in 30 of 1,536), 28 of 30 read true, 2 LOW; (7) the
"Competitive" heading over an obedience line in 15 of 76 occupier towns (the ruled bands kept above subordinate);
(10) C01's quarantine line in a thorp of 6 (a stretch). FIVE of the first stage's lines never reach the page: the
daily-life slots C02-C05 go only to the AI grounding payload and the regeneration-delta card, and the error-band
embattled reason C10 never printed in 1,626 births.

### STOP AT THE CONTEXT LIMIT — what the successor takes (not started; nothing changed for them)

The code tip is 4ba5449e6 (this file's commit is the one after it); the merge of the line is DONE (8e9046124, the line
at 9e57f5023; if the line has moved since, merge its new tip the same way). Still to do, in order:
1. **The command's rule (record 403)**: `sh <scratch>/c2/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree> <out> 4
   --files <the lane's files>` at aac79b808 and at the tip; every hit in the lane's files read against its town, cured
   or named; the count per kind at base and tip; its limits beside any zero. The lane's files: crisisHooks.js,
   resourceSemantics.js, goodsCatalog.js, characterEditView.js, treasury.js, foodWordsFindings.js, stressNarrative.js,
   structuralValidator.js, resourceGenerator.js, factionDynamics.js, chainMagicSubstitution.js, incomeLineSiblings.js,
   engineKeysInText.js, conditionWords.js, landingFixture.js, crisisSummaryVantage.js, dailyLife.js, threatProfile.js,
   outlookHookSiblings.js, hookTruth.js, heraldCausalGrammar.js, plotHooks.js, hookThemes.js, magicSource.js,
   servicesGenerator.js, officialsInPay.js, crisisPage.js, foodways.js, governanceAccount.js (the hand-back's tables
   name each; check against `git diff --name-only aac79b808 <tip> -- src` minus the merge's files).
2. **The two mutation-coverage manifest entries** the first seat owes (tests/generators/embattledReasonNoSlider.test.js,
   occupierRelationLine.test.js) through the manifest's own door (scripts/mutation-coverage-manifest.json). This seat's
   new test file tests/generators/fenceWordOfMouthTavern.test.js avoids the manifest's name pattern; it adds one file
   to the lighting census's count (the census's door, at the merge).
3. **THE FINAL STATEMENT** for the whole lane at its final tip, as the brief gives it: the whole suite once
   (`npx vitest run --maxWorkers=2`, to a file), every red classed (known so far, EXECUTED by governing runs: the
   generator golden master 139 configurations at 6622bcdbf and 199 from the merge 8e9046124 on, unchanged by this
   seat's later commits; espionageDormancyFence's driven golden; generationForkCensus A1, identical before and after
   this seat's commits; worldFactRederive A7 and pipelinePinnedChoosers A1 per the second seat; all the merge seat's
   doors); the first census's counter base aac79b808 against tip, its own exit read; the 720 field diff by family base
   against tip, each family declared (this seat's: history 85 towns, availableServices 11 then 102,
   economicState.foodSecurity.foodRecord.foodwaysLine and culturalIdentity.foodways 29; display-only commits 0; the
   merge brings the line's own families); ONE draft shift record naming every moved golden surface; the new words; the
   edge bundles re-emitted last and alone (`npm run build:edge-shared`: hookTruth.js, crisisSummaryVantage.js,
   crisisPage.js, foodways.js, governanceAccount.js and servicesGenerator.js are this seat's changed sources).

**New wording for the owner's veto, this seat** (each read where it prints, towns in its commit): "Ask around quietly.
Someone moves goods without questions." (33b473879); "Fencing stolen goods" (06fe8a86b, a catalogue service name
already); "Those who answer for {name} spend their days settling quarrels over food, and every week there are more of
them."; "In {name} what food is left is watched day and night, and those watching it are as hungry as everyone else.";
"…, and those waiting on one are losing patience."; "People in {name} keep away from where one power's ground meets
another's, most of all after dark." (b6208d93a); "No house here holds what this crisis turns on."; "no one yet named"
(2ce44a973).

## THE FOURTH SEAT (R3-CODE-C-4)

Seated 2026-11-14 00:20 UTC (session_01FE9mEu8voZvyXV6r9VQVue) for the lane's close; its session ended with the
account at about 00:55 UTC and it pushed NOTHING (the lane's tip stayed e2aa8e278). Its brief, BRIEF-R3-CODE-C-4.md on
the chair lane, passed whole to the fifth seat.

## THE FIFTH SEAT (R3-CODE-C-5), kept current after every item

The seat R3-CODE-C-5 (session_01ACmDYbEJ513ujr2NhacwG8), for the chair session_01ACmDYZrFEVXyZEUg1NDxxC (the program
moved to this account on 2026-11-14; the owner, in that chair's chat: "Continue with the pending work! ... I defer all
decisions to you and give you all permissions you may require"). Its assignment: BRIEF-R3-CODE-C-5.md (chair lane,
docs/chair/2026-11-14/briefs/), which makes BRIEF-R3-CODE-C-4.md its brief whole: the census, one rewording pass of
the vantage table, the two manifest entries, ONE message to the chair, then on the chair's word the merge of point
49's line and THE LANE'S ONE FINAL STATEMENT. The tip read back from origin at the start: e2aa8e278, as the brief
said. Never rewrite a commit at or below e2aa8e278. EXECUTED unless marked.

**How the measures were made.** CENSUS-2 (lane/census-2-2026-11-13 at 2686272b1, census2.sh, 4 workers, `--files` the
29 lane files of the third seat's list, each resolved to one path) at aac79b808 and at b45d9154b (src identical to
e2aa8e278), each from scratch, both EXIT 0 (every stage's own exit read by the script; 720 of 720 dumps each). The
960 for the vantage table: CENSUS-2's 720 born at the tip by its births.mjs, and the lane's 240 fresh
(REVIEW-R2-STAGES births.mjs with the first seat's fresh seeds r2r-<size>-fresh3c-0..9, r2s-<crisis>-<size>-70..71;
240 of 240, 0 errors). The surfaces: REVIEW-R2-STAGES surfaces.sh (the PDF in three variants, the Foundry journal,
the Tonight sheet). HAZARD seen: `npm ci` set `core.hookspath=.husky/_` (unset before); kept, as the third seat did;
refs and local config compared before and after every push since, only this seat's pushes and fetches differ.

### Items

| item | outcome | commit |
|---|---|---|
| 3: the manifest entries | tests/generators/embattledReasonNoSlider.test.js and occupierRelationLine.test.js (the first seat's OWED rows) AND tests/generators/fenceWordOfMouthTavern.test.js (the third seat's; CORRECTED OUT LOUD: its hand-back said the file "avoids the manifest's name pattern", but tests/generators is one of ENFORCER_DIRS, so it is enumerated by its directory and was the third red row of TOTALITY). Each the admitted-tree rationale (generators-tree-admitted-subject-coupled-2026-08-30), which the manifest test re-derives per member (imports src/, asserts). Red first 1 of 10 at e2aa8e278; 10 of 10 | b45d9154b |
| 2: one rewording pass of crisisSummaryVantage.js :: CRISIS_SUMMARY_POOLS | On the 960 at the tip, by the call sites' own picks: "keep order" 33 prints in 30 towns with no force -> 0 (eight lines; the occupation's "Keeping order in {name} is the occupiers' business" KEPT: its occupiers are the kind's force); "the merchants" 10 in 10 with no market or merchant house -> 0 (three lines; "Big business waits" owned whole); "street(s)" 33 in 33 thorps and hamlets -> 0 (ten lines, the two departures lines among them, which no birth prints: MIGRATION_DIRECTION_AT_BIRTH is 'arrivals'). 21 lines, each read in three rendered towns (63 of 63 found: thorps of 7 to 16, metropolises to 452,020); one draft ("Many houses") reworded before the commit. Display only (240 records byte-identical). Red first 6; guard towns r2s-slave_revolt-thorp-70, r2s-occupied-hamlet-70, r2s-plague_onset-thorp-70. New wording in the commit body | bbeb95b73 |
| 1: CENSUS-2, the lane's files | per kind, hits (towns) at aac79b808 -> tip: a 102 (92) -> 63 (61); b 7 -> 7; c 13 -> 11; d 0 -> 1; e 0 -> 0; f 6 -> 26; g 54 -> 0; h 0 -> 0. The rises are officialsInPay.js (d 1, f 20), a file that exists only on the line, brought by the merge 8e9046124, printed by rb's WhoRunsThisTownPanel: EXPOSURE, declared, not origin. Every one of the 108 tip hits READ (below). Its limits: the dossier's views only (not the PDF, the journal, the Tonight sheet); it cannot see two lines disagreeing. The tip census ran before bbeb95b73 (its Defense-tab lines); the final statement's census is at the final tip | — |

**The 108 tip hits, read (CENSUS-2 at b45d9154b; a hit is a candidate).**
- TRUE, not changed: outlookHookSiblings.js MODERATE_GAP_TWIN 11, STARVING_HOOK 6, PEACE_IRON_HOOKS 2 (19 towns, every one
  on a road, river or crossroads route and none besieged: a trader can come; the second seat's 0b3ce25a3 already took the
  hook off the isolated and besieged); factionDynamics.js "courts" 1 (r2s-plague_onset-town-0: rights, the third seat's
  reading, which the chair let stand).
- NAMED, as the earlier seats named them (same sentences, same towns): plotHooks.js ECHO_PREFIXES 18 and TENSION_LABELS 2
  (the hooks' texts and the tension's choice: historyData.js / historyGenerator.js, fd's); the district hook's fourth
  town (r2s-infiltrated-village-2) is credited by the trace to hookTruth.js :: VILLAGER_TIERS, a Set of tier names that
  prints nothing (a trace tie: the text is historyData.js's); hookThemes.js 14 (npcData.js's person hooks, ra's);
  magicSource.js 11 (the chain catalogue's label, the data lane's; MagicTab.jsx prints it); officialsInPay.js d 1 (rb's
  panel row, the cure named) and f 20 (FOR THE JOIN, above); incomeLineSiblings.js LOCAL_COAL_LINE 1 and
  LOCAL_COAL_SOLD_LINE 3 (economicState.js's choice, the defence lane's); resourceSemantics.js 3 (EconomicsTab.jsx's
  Trade Profile under a siege, wc's and up's, the first seat's #512 class).
- NAMED, new to this seat: **stressNarrative.js :: RENDERERS (wartime), 8 towns** (thorps, hamlets, villages, two of
  them isolated: r2r-thorp-11, -16, -32, -56, r2s-wartime-thorp-1, -hamlet-2, -hamlet-3, -village-2): the stored summary
  "… is in a kingdom at war and doing well out of it: army contracts pay, prices are high, and merchants with the right
  friends are getting rich." beside no merchant and, in two, an isolated route. The file is rb's (its own commits on it);
  the cure is rb's: the profitable roll's line names no merchant, and an isolated place is not said to do well on army
  contracts. **crisisHooks.js :: leverSentence, 6 towns** (r2r-town-8, -13, -36, r2s-mass_migration-town-0, -2, -3):
  "The migration turns on the inn (multiple), run by …": `houseInProse` strips "(2-5)" and "(district)" only, so a
  catalogue tag "(multiple)" prints. FOR THE JOIN: crisisHooks.js is held by up and rb; at the join houseInProse reads rb's
  `institutionHouseLabel` (domain/display/institutionDisplayName.js on rb's lane) in place of its own strip regex.

### Found on the way (NAMED, not changed: no adjacent repair)

- **"Those who keep {name} safe"** in the same table (recently_betrayed, monster_pressure, wartime and the departures
  defence.official): 35 prints on the 960, 19 in towns with no force. Softer than "keep order" (whoever keeps a place
  safe need not be a force), but the same presumption in places with nobody at all. Recommendation: the same pass,
  "Those who answer for {name}'s safety" (the siege's own wording), if the chair rules it a force.
- **slave_revolt's catalogue text** (src/data/stressTypes.js, the data lane's): its viabilityNote says "everyone who keeps
  order is busy containing the revolt", the presumption this pass took out of the table.

### The chair's message to this seat (copied: the messages are not on the branch)

- 02:06Z: the close accepted as pushed (8039f8f41). ONE RULING (vetoable by the owner): "Those who keep {name} safe"
  IS THE SAME PRESUMPTION where the town holds no force (no garrison, no militia or household levy, no watch, no
  contracted company): 19 of its 35 prints on the 960. ONE MORE PASS of the same table, the same form as bbeb95b73:
  where no force stands the line does not name people who keep the place safe; "Those who answer for {name}'s safety"
  where that is true of the town (its seat answers); each reworded line READ WHERE IT PRINTS in three towns, red first,
  a guard town, display only, its own commit; then CENSUS-2 at the new tip for the statement. ROUTED BY THE CHAIR, not
  this lane's: stressNarrative.js's wartime line (round two B), the slave revolt's viabilityNote in stressTypes.js (the
  data lane), crisisHooks.js's "inn (multiple)" (FOR THE JOIN, on the chair's list). Then wait for point 49.

### HAND BACK AT THE COUNT (02:0x UTC; used_tokens 370,537, read by get_session) — what the successor takes

The tip is this file's commit; the code tip bbeb95b73. NOT STARTED, nothing changed for them:
1. **The "keep {name} safe" pass**, as ruled above. The lines (kind.surface.vantage, prints / no-force prints on the
   960): recently_betrayed.defence.official 16 / 6 ("Those who keep {name} safe are questioning everyone…"),
   monster_pressure.defence.official 8 / 6 ("Those who keep {name} safe cannot cover every road…"),
   wartime.defence.official 11 / 7 ("Those who keep {name} safe have fewer hands than before…"), and
   mass_migration departures defence.official (0 born: no birth writes departures). The tools, all in this seat's
   scratchpad and rebuilt in a minute: probe/vantage-count.mjs (TREE=<tree> OUT=<json> node vantage-count.mjs
   <corpus.ndjson.gz>...: the call sites' own picks; family `safe`, `safe_noforce`), probe/where-prints.mjs with
   probe/changed-keys.txt (three towns per line, records written out), REVIEW-R2-STAGES surfaces.sh, probe/read-lines.mjs
   (each sentence where it printed, with the town's force, market and size); the 720 corpus is CENSUS-2's
   corpus.ndjson.gz of any tree (its births.mjs), the 240 the lane's fresh births (REVIEW-R2-STAGES births.mjs, seeds
   r2r-<size>-fresh3c-0..9, r2s-<crisis>-<size>-70..71). The red-first test extends the R3-CODE-C-5 describe of
   tests/domain/crisis/crisisSummaryVantage.test.js (its `born` helper takes r2s- seeds with the census's dials). Note:
   "Those who answer for {name}'s safety" is under_siege.defence.official's and infiltrated.defence.official's own
   words already: the test "no line is used twice" needs each new line distinct.
2. **CENSUS-2 at the new tip**, `--files` the 29 lane files (this seat's files.csv: the list in the third seat's
   successor list, each a path), for the statement's base -> tip per kind (base aac79b808 above).
3. **Wait for point 49**; on the chair's word: the merge of the line's named tip (a plain merge commit; the eight edge
   bundles resolved by `npm run build:edge-shared`), the instrument's findings on this lane's lines cured or declared,
   and THE LANE'S ONE FINAL STATEMENT (the whole suite once in six vitest shards, each to its own file outside the tree;
   everything BRIEF-R3-CODE-C-4 item 5 lists). Changed bundled sources since the third seat: crisisSummaryVantage.js
   (bbeb95b73) is in the edge bundles' sources (the third seat named it there): re-emit last and alone.

### After the hand-back: the chair's exception of 02:10Z (copied), and the two items it allowed (EXECUTED)

- 02:10Z, the chair: the count read and the hand-back at 530c7546c accepted; ONE EXCEPTION TO THE MARK: "GO ON for items
  (1) and (2) ONLY: the 'keep {name} safe' pass ... and CENSUS-2 at the new tip. Then bring the hand-back current, push,
  send ONE message (the tip, the counts) and END for good: do NOT take point 49's merge or the final statement: a fresh
  seat takes them from your file."
- **(1) DONE, b0be6de8d.** The four lines reworded to name no keepers (recently_betrayed, monster_pressure, wartime and
  departures defence.official; each distinct from the siege's and the infiltration's wording): on the 960, 35 prints of
  "keep {name} safe", 19 with no force, -> 0. Each read where it prints, 12 of 12 true (thorps of 7 to a metropolis of
  122,759). Display only (240 byte-identical); red first 2, guard town r2s-wartime-thorp-70; 548 of 548 governing; gates
  green. The new wording is in the commit body (for the owner's veto).
- **(2) DONE, CENSUS-2 at b0be6de8d** (from scratch, EXIT 0, 720 of 720): the lane's files per kind, hits (towns):
  a 63 (61), b 7 (7), c 11 (11), d 1 (1), e 0, f 26 (26), g 0, h 0. IDENTICAL to b45d9154b, hit for hit (kind, town,
  writer). So the statement's base -> tip is: a 102 -> 63; b 7 -> 7; c 13 -> 11; d 0 -> 1; e 0 -> 0; f 6 -> 26;
  g 54 -> 0; h 0 -> 0 (the d and f rises: officialsInPay.js via the merge, exposure). Limits: the dossier's views only
  (the PDF, the journal and the Tonight sheet, where the vantage table's cover, overview and Tonight lines print, are
  not rendered by it); it cannot see two lines disagreeing.

**WHAT THE FRESH SEAT TAKES (this seat ENDS here, as the chair ruled):** item 3 of the list above: on the chair's word,
point 49's merge (a plain merge commit of the named tip; the eight edge bundles by `npm run build:edge-shared`), the
instrument's findings on this lane's lines cured or declared, and THE LANE'S ONE FINAL STATEMENT (BRIEF-R3-CODE-C-4
item 5, whole suite in six shards). The census base and tip above serve the statement unless the merge changes the
lane's files' prints (re-run CENSUS-2 after the merge if it does). crisisSummaryVantage.js (bbeb95b73, b0be6de8d) is a
bundled source: the edge bundles re-emitted last and alone.

## THE SIXTH SEAT (R3-CODE-C-6), kept current after every item

The seat R3-CODE-C-6 (session_01ACmDYYocD6t8CuLFGeBduQ), for the chair session_01ACmDYZrFEVXyZEUg1NDxxC. Its
assignment: BRIEF-R3-CODE-C-6.md (chair lane, docs/chair/2026-11-14/briefs/): point 49's merge, the instrument's
findings on this lane's lines, the lane's ONE final statement. The tip read back from origin at the start: dbe379c13,
as the brief said. Never rewrite a commit at or below dbe379c13. EXECUTED unless marked.

### The chair's messages to this seat (copied: the messages are not on the branch)

- 03:15Z, A HAZARD: a shallow clone can give a WRONG merge base, not a missing one (31 false conflict hunks seen by the
  chair on another lane); with full history `git merge-base --all origin/lane/integration-2026-11-07 HEAD` is 9e57f5023.
  The chair's in-memory merge of dbe379c13 with 976db5b19: 9 conflicted files, no code. (This seat's shallow clone gave
  9e57f5023 and the same 9 files, no code: the base was right.)
- 03:18Z: section 2m of the merge book is pushed (lane/merge-15-point-49-wip-2026-11-14 at d893d9289).
- 03:35Z: the branch merged is the line (lane/integration-2026-11-07), never the chair lane. (It was: second parent
  976db5b19.)

### Items

| item | outcome | commit |
|---|---|---|
| 1: the merge | lane/integration-2026-11-07 at 976db5b19 (read back from origin), a plain merge, base 9e57f5023 (100 commits of the line, 44 of the lane). Conflicted 9 files, none in src/: the eight edge bundles (taken from the line's side; re-emitted by `npm run build:edge-shared`, last and alone, at the statement) and tests/lint/presumedThings.register.json (taken from the line's side; re-derived by its door, below) | e5350ec8d |
| 2a: presumed things, the starving set | `--check` at e5350ec8d: fresh 4, stale 9, first-register stale 1. outlookHookSiblings.js "The settlement is starving, and its hungriest are turning to banditry." was declared (`needs: ['food: ≤ deficit']`, drawn by resolveSibling) but its literal stood in a constant above the table; it moves into its member. Byte-identical | 92557fa6b |
| 2b: presumed things, the registers | `--shrink` (9 widened + 1 first-register arm-1 rows: the OLD texts of lines this lane reworded) and `--shrink-arm2` (the sealed-walls arm-2 row). The first register now differs from the line's by exactly the lane's two removals (19d4a8506, 6fc505ea6). Walker: "no stale row" green | acee99f3a |
| 2c: fact layers, the tavern test | `node scripts/fact-layers-door.mjs` at acee99f3a: 2 rises, both servicesGenerator.js (this lane's). The first, `hasInstitution({ institutions }, 'tavern')`, IS the home's reader; the arm strikes such a call only when its record is a name: now `const roster = { institutions }`. 720 births byte-identical | 67266734e |
| 2d: fact layers, the fence name | the second rise, the roster name test for 'Fence (word of mouth)' (the crime family, outside its homes). Cure under the chair's 23:40Z ruling's second form: the fallback row is "Fencing stolen goods" everywhere (no new wording). DECLARED MOVE: availableServices.criminal[].name, 5 of 720 towns, 715 identical, no reorder, no draw. Red first 1 of 4 (the anchor r2r-town-15). Door after: 0 rises, 0 falls. (The commit body says its three carried reds were "the same at 67266734e": they were measured on acee99f3a's servicesGenerator.js, which 67266734e matches byte for byte on the 720; corrected here) | 6eb0dcbda |
| 2e: the lighting census | red after the merge (files 3245 -> 3250: the lane's five test files meet the line's baseline); re-taken by its ritual on the clean committed tree, then plain green (34 of 34) | 5727f2d30 |
| 2f: the other doors at the merged tip | observed shapes (`check-observed-shape-readers.mjs`) EXIT 0; writer reach (`check-writer-reach.mjs`) EXIT 0; the tuning inventory walker green; the page census's grid (`page-census.mjs --grid`) EXIT 0, 0 falls. The page census's 720 and the suite: at the final tip | — |

### STOP (for the chair's ruling): three fresh presumed-things hits this lane cannot cure through a door

`node scripts/presumed-things-door.mjs --check` at 5727f2d30: fresh 3, stale 0; the walker's arm 1 red ("every source
literal that names a thing declares it, or has its row"), nothing else in it. Each is a line THIS LANE reworded after the
instrument's base, of a line the line itself had banked (its old text, now shrunk out in acee99f3a), naming the same
thing under the same print condition:
1. src/domain/crisis/crisisSummaryVantage.js, wartime.defence.official (war, 7e7367a3ed3f5004): "With men called away
   to the war, {name} has fewer hands than before to see to its own safety." (b0be6de8d; banked before as "Those who
   keep {name} safe have fewer hands than before, with men called away to the war.", reason root).
2. the same file, occupied.cover.trade (occupation, e77ca269515be2ef): "Everything sold in {name} pays the occupiers
   their due first, and those who sell keep their prices and their opinions to themselves." (bbeb95b73; banked before
   with "the merchants", reason word).
3. src/generators/structuralValidator.js, the plagued-threat below-25 reason (armedForce, d58d6c2b46cc28f7):
   "Embattled region. Infrastructure exists on paper, but the defences are so underfunded that they are barely
   maintained and the defenders are few. This settlement will fall." (cdf84d431; banked before as "…the garrison is
   skeletal", first register).
Each is TRUE wherever it prints: the vantage table is keyed by the crisis kind (only a wartime town prints the war
line, only an occupied one the occupiers'), and the validator's branch runs only where a fort AND a force stand. But no
draw door reads either condition: CRISIS_SUMMARY_POOLS is picked by `crisisSummaryForSurface(entry, name, surface)`
with no record and no door, and the validator's violation objects are handed to none. `--bank` refuses a line not at
the widening's base, and that refusal is final; rewording only to slip the word past the matcher ("called away to
fight") would route round the classifier. Routing the table through a door is a redesign of the four surfaces' call
sites, not a cure. RECOMMENDATION: the chair rules them banked BY HAND as point 49's seven were (a reason key
`after-base: r3-code-c`, "this lane's rewording of a banked line: the same thing, the same print condition; true by the
crisis kind or the branch, which no draw door reads"), each owed to whoever routes the vantage table and the
validator's reasons through a door. Until ruled: named reds of THIS lane, not banked.

### The chair's ruling on the STOP (04:05Z, copied whole; vetoable by the owner)

"THE CHAIR RULES ON YOUR STOP (vetoable by the owner; copy it whole into the hand-back). The three are RE-KEYED BY HAND,
by this ruling, by name, against the letter of 2m, as point 49's seven were: each is this lane's truer rewording of a
line the line had banked (same file, same slot; the old rows you shrank), true wherever it prints by a key or a branch
no draw door reads. FOUR CONDITIONS: (1) FIRST one guard test file, a collected arm over births: line 1 prints only in
a wartime town; line 2 only in an occupied town; line 3's reason only where a fort and a force stand; each arm shown
able to red by a plant you do not commit. If a line prints where its condition is false: STOP, it is cured, not
banked. (2) Then the three rows in tests/lint/presumedThings.widened.register.json in the seven's own shape, reason
`after-base: r3-code-c`, a commit of their own quoting this ruling; nothing else banked. (3) `--check` exit 0, the
walker green. (4) FOR THE JOIN: the vantage table and the validator's reasons go through a draw door (the seat after the
merges); the rows leave by --shrink then. Your statement says the register fell by ten rows and rose by three. Go on."

| item | outcome | commit |
|---|---|---|
| 2g: condition (1), the guard | tests/generators/r3cRekeyedLinesTrue.test.js, 108 births; the war line seen 11 times, each wartime; the occupiers line 11, each occupied; the validator's reason (no birth reaches it: resolveConfig.js floors a plagued town's military priority at 25; reached through the edit-time checks) over the born rosters whole / without force / without fort at slider 12, seen 66, each with fort and force. Each arm planted red (not committed). Enters the mutation-coverage manifest (TOTALITY red before, 10/10 after) | 4f060b173 |
| 2h: condition (2) and (3), the three rows | banked by the ruling, the seven's shape, reason `after-base: r3-code-c`; `--check` exit 0 (fresh 0, stale 0, banked 4714); the walker 43 of 43 | 6d4627205 |
| 2i: the lighting census again | for the guard file: files 3250 -> 3251, titles 29452 -> 29455 | a89e8ba89 |

**CORRECTED OUT LOUD.** 6d4627205's body says "10 rows fell … the first register's included". Exactly: 11 rows fell at
acee99f3a: 9 arm-1 rows of the widened register, 1 arm-1 row of the first register (both by `--shrink`) and 1 arm-2 row
of the first register (by `--shrink-arm2`); 10 of them arm-1 rows, the count the chair's ruling names. 3 rose here.

### THE LANE'S FINAL STATEMENT (R3-CODE-C-6; code tip 6eb0dcbda, bundles b87aaa4ea; EXECUTED unless marked)

**Census (CENSUS-2, `--files` the 29 lane files).** At dbe379c13 (the lane before the merge) and at the merged tip
ff824bc36 (src = 6eb0dcbda), each from scratch, EXIT 0, 720 of 720: IDENTICAL hit for hit (0 only at tip, 0 only at
base): a 63 (61), b 7, c 11, d 1, e 0, f 26, g 0, h 0. So the merge changed nothing the lane's files print as the
census sees them (step 3 not re-run further), and the fifth seat's base -> tip stands: a 102 -> 63; b 7 -> 7; c 13 -> 11;
d 0 -> 1; e 0 -> 0; f 6 -> 26; g 54 -> 0; h 0 -> 0 (d and f rises: officialsInPay.js via the earlier merge, exposure).
Every hit read: the fifth seat's 108, above, unchanged. Limits: the dossier's views only (not the PDF, the journal,
the Tonight sheet); it cannot see two lines disagreeing. The fresh-seed counts (the 960) are the fifth seat's, above.

**Field diff, the 720 births, the line's tip 976db5b19 -> the lane's tip** (what the lane moves on top of the line):
347 towns; every family declared by a lane commit: availableServices.criminal (name 107: 06fe8a86b 102 + 6eb0dcbda 5;
desc 16, institution 5: 33b473879 and the sort shifts it declared); powerStructure.factionRelationships (narrative 87,
type 24: f51767e11 59 + 476800e1d 28) and npcs.goal.* (24, the same towns' goal re-deal; one npcs[].stressNote follows
its NPC's goal in r2s-insurgency-city-1); history plot hooks (historicalEvents 73, currentTensions 21: 6e658915a,
a4897beb6); structuralViolations[].reason 54 (cdf84d431, 0804874b0); resourceAnalysis.exports (product 40, reason 14:
9a3239ae7); foodways line and its copy 29 (c61b61434); economicViability (plotHooks 23 + 14, summary 4, a category 1:
0b3ce25a3); generationCoherenceReceipt 6 (a4897beb6). Display-only commits: 0 records moved.

**Instruments of point 49 at the tip:** presumed things `--check` exit 0, walker 43/43 (3 rows re-keyed by the ruling;
the widened and first registers fell by 11 rows, 10 of them arm 1, and rose by 3); fact layers 0 rises 0 falls;
observed shapes, writer-reach door exit 0; page census (720) at or under its register, grid 0 falls; lighting census
re-taken twice by ritual, green; tuning inventory green.

**The whole suite, six vitest shards at ff824bc36** (refs and local config unchanged across it): 39,271 tests, 41 failed and 2 files that fail to run,
145 skipped. Classed (each red file re-run at 976db5b19 and at dbe379c13):
- 7 the bundles (engineBundleReplay 2, engineServiceCore, engineServiceStoreParity, aiGroundingBundle freshness,
  edgeSharedBundleReproducibility 2): CURED by b87aaa4ea, 59 of 59 bundle tests green at the committed tree.
- 12 failed tests and the 2 files red at the line's own tip too (the line's carried set): dossierProseManifest 3, proseFamilyContract.walker 5,
  landingFixtureFreshness 2, siteCoherenceRatchet C1, foundingWorldBones, newsHeadlineContract.walker and
  newsVoiceContract.walker (each fails to run).
- 18 golden pins moved by the lane's declared families (red at dbe379c13 as here, green at the line's tip):
  generatorGoldenMaster, espionageDormancyFence's driven golden, townCartographyCalibration W2/W8, and fourteen
  "the golden corpus is byte-identical" pins (the shift record names them). The golden door is the merge seat's.
- 4 WALKERS red at dbe379c13 and here, green at the line's tip: THE LANE'S, NOT CURED (below).

**Draft shift record:** docs/chair/2026-11-13/R3-CODE-C-shift-record.DRAFT.json (MOVED by measure:
generator-golden-master, espionage-dormancy-fence, cartography-calibration-corpus; UNMOVED: pdf golden, herald desk,
preset lighting witness; dossier-prose-manifest red at both trees, its movement UNMEASURED).

**New words of the whole lane** (for the owner's veto): the third seat's (above, "New wording"), the fifth seat's
(bbeb95b73 and b0be6de8d bodies), and this seat's: none (6eb0dcbda uses "Fencing stolen goods", already the row's name).

**FOR THE JOIN:** (1) the third seat's house label in "Who answers to whom" (above); (2) crisisHooks.js houseInProse
reads rb's institutionHouseLabel (the fifth seat's); (3) the chair's 04:05Z ruling, condition 4: the vantage table and
the validator's reasons go through a draw door; the three `after-base: r3-code-c` rows leave by --shrink then.

### HAND BACK AT THE COUNT — WHAT IS LEFT (not started; nothing changed for the successor)

1. **Four walkers red at the lane's tip AND at dbe379c13, green at the line's tip 976db5b19 — the lane's to cure
   through their doors or to name** (read none of them; the chair's books give each door): tests/lint/
   negativeAssertionAnchor.walker.test.js ("no NEW un-anchored negative assertion": a lane test file, likely one of
   the five new ones or r3cRekeyedLinesTrue's? the latter came after dbe379c13, so at least one predates it);
   tests/lint/poolDominance.walker.test.js ("no ceiling sits loose above its measure": a lane cure lowered a pool's
   count; its door lowers the ceiling); tests/lint/writerReach.walker.test.js 2 (the frozen shapesDigest; the lit
   arm): the lane's declared families change the walker corpus's shapes.
2. dossier-prose-manifest: compare its failure output at 976db5b19 and at the tip, for the shift record.
3. Then the one message to the chair with the statement.
Instruments, re-made in a minute: probe scripts in this seat's scratchpad are gone with it; the census command is in
the brief; field diff = births.mjs at two trees + a recursive JSON compare; reds = each shard's `--reporter=json`.

**CORRECTED OUT LOUD** (65086cea2 said 14 and 16): the classes are 7 + 12 (+2 files) + 18 + 4 = 41 failed tests and 2 files.

**HAZARD (the chair to every seat, 04:37Z, copied; it reached this seat at 06:44Z, after the hand-back):** a push
with NOTHING TO SEND falls into the pre-push hook's WHOLE suite, where tests/scripts/implementationPackets.test.js and
implementationSession.test.js run git against the REAL repository from the linked worktree (the local branch moved to
a fixture commit, core.bare=true, a fixture user in the shared config). Before every push: `test -n "$(git rev-list
origin/<branch>..<local>)"`, else do not push; never chain a push after a step that can fail. This seat: every push
carried commits; local config and local branch refs compared to the snapshots after the last push: unchanged.

### THE SEVENTH SEAT (R3-CODE-C-7, 2026-11-14; brief docs/chair/2026-11-14/briefs/BRIEF-R3-CODE-C-7.md on the chair's lane; EXECUTED unless marked)

**The tip.** On origin it read 0ccf3ff24, not b6bd3a3c1. The one commit between them is the sixth seat's, documents only.
The chair ruled at 06:53Z: start from 0ccf3ff24 (not a stop). Each walker was first run, JSON, at the tip, at the line's
tip 976db5b19 and at the lane's pre-merge tip dbe379c13 (frozen worktrees). All four were red at both lane trees and green at the line's.

**The four walkers.**
1. **negativeAssertionAnchor**: CURED, 5eba19f9b. Cause: four lane test files held 9 bare negatives, and none has a row at
   the line: crisisSummaryVantage 4 (b6208d93a), crisisPage 1 (2ce44a973), foodWordsGoodsList 2 (c61b61434),
   governanceAccount 2 (4ba5449e6). No other lane's own commit touches these files. The cure is in the four test files:
   each negative is anchored to its subject, either asserted a non-empty string of its pool or of the guard town
   (with a one-line `// anchored:` marker), or through `expectPresentThenAbsent` / `expectAbsentWithAnchor`. The guard
   town rww-thorp-monster_pressure-1's `String(undefined)` used to pass vacuously. Six plants, not committed, each red
   at its anchor. No baseline row.
2. **poolDominance** ("no ceiling sits loose above its measure"): NOT CURED, PARKED for the chair. The one loose row is
   `ledger:foodBalance:OUTLOOK_HOOK_SIBLINGS`: top1 ceiling 0.649, measure 0.5449, lines 2 -> 3. Cause: 0b3ce25a3
   (R3-CODE-C-2, the merchant-free outlook line). The door `node scripts/census/pool-dominance.mjs --tighten`, run to
   measure in the scratch tree with the register restored after and never committed, would move **57 rows of 909**
   (the loose row and 56 others lowered within noise) and re-take the register's `census` header. Its own header calls
   it "THE CHAIR'S DOOR ... a lane's tree is a re-dealt sample, so run lane by lane it walks every ceiling down the
   noise; used only on a ruling". The brief foresaw one ceiling lowered. A hand edit of the one row is barred
   (registers only through their doors). RECOMMENDATION: the chair rules whether `--tighten` runs on this lane (all 57
   rows, its own commit, the output in the body) or at the merge seat on the composed line; I would hold it for the
   merge seat, which tightens once on the composed tree. No ceiling would rise.
3. **writerReach**, two titles (the frozen shapesDigest; the lit arm): CURED, f242b80be. Cause, bisected on the corpus
   digest over the lane's 43 first-parent commits: 0b3ce25a3, the only digest move. `check-writer-reach.mjs`: exit 0,
   names nothing. Forecast before writing (the door's own run() with the writer captured in memory): cohort
   1378 -> 1378, 0 stale, 0 struck, 0 violations; population, corpusMeta, registerDigest, verdictDigest and
   detectorDigest unchanged; moving only frozenAtSha, shapesDigest and the scan's own counters. `--write` on the
   clean committed tree: exit 0, byte-equal to the forecast. Walker 52/52.
4. **The dossier prose manifest**: MEASURED, b934abc46 (draft shift record: `re-record`). Red at both trees, on the same
   three titles. At both trees the same 1038 of 1050 rows differ from the fixture, which is byte-identical at both
   (the line's set). The lane moves 752 of those 1038 further (764 cells: history.legacy|history.record 752,
   history.identity 12; none added or removed), all by ONE display-only family: a322b602f (#ww-470, TIME_BANDS "older
   than anyone living"). Bisected by the run's own cells, and its text equals the tip's on all 764 cells.

**Item 5.** No test title added or renamed (the diff 0ccf3ff24..HEAD under tests/ holds no it/test/describe line), so the
lighting census was not re-taken. sovereigntyLightingContract.walker and mutationCoverageManifest: 44/44 green.

**At the final code tip b934abc46** (this commit adds only this section):
- The three fast gates, each through `sh scripts/gate-tail.sh`: typecheck:domain:strict exit 0 (1113, ceiling 1113);
  typecheck:ratchet exit 0 (167, ceiling 167); eslint on the four touched test files exit 0.
- `node scripts/implementation-packets.mjs validate`: exit 0 (257 packets, 0 READY).
- The five instrument doors of section 2m: presumed things `--check` exit 0 (fresh 0, stale 0); fact layers exit 0
  (0 rises, 0 falls); observed shapes exit 0; writer reach exit 0 (pending-surface debt none); page census (720,
  `--workers=2`) exit 0 ("the banked corpus reads at or under the register"). All were clean at the sixth seat's tip, and are clean by this seat's own run.
- Re-run (the whole suite NOT re-run): the three walker files and the four touched test files, 128 of 129. The one red
  is poolDominance's loose ceiling, parked above.
- **no file under src/ changed after b6bd3a3c1** (`git diff --stat b6bd3a3c1..HEAD -- src/` prints nothing).
- Local git config and branch refs compared against snapshots after every push: unchanged but for this seat's own
  local branch, and `core.hooksPath` written once by `npm ci`.

**FOR THE JOIN (added by this seat):** (4) the poolDominance `--tighten`, above, at the chair's ruling; (5) the dossier
prose manifest's fixture re-record (the line's 1038 rows with the lane's 752 among them) and the golden pins of the
sixth seat's class of 18: the merge seat's signed acts.

## THE EIGHTH SEAT (R3-CODE-C-8, 2026-11-14; brief docs/chair/2026-11-14/briefs/BRIEF-R3-CODE-C-8.md on the chair's lane; EXECUTED unless marked)

**The tip.** On origin it read 70d92ed06, as the brief wrote. Scratch worktree /tmp/claude-0/wt8 (local branch c8); the
lane tip in a second worktree /tmp/claude-0/wtbase for the red-first runs. Births: the reader's 1,722
(REVIEW-R3-STAGES seeds720 + seeds-app + seeds-plagued + REVIEW-R3-CODE-C seeds-extra.txt, its births.mjs unchanged).

### The chair's rulings this seat works to (2026-11-14 08:06 UTC; vetoable by the owner; copied from the brief)
(a) L01: "OLDER THAN ANYONE LIVING" IS SAID ONLY OF AN EVENT OLDER THAN EVERY PERSON THE RECORD HOLDS, and never of one
under ninety years old. An event sixty to ninety years back takes words true of it (what only the oldest remember): NEW
WORDS, by the style law, listed for the owner's veto with the towns they were read in; or the band's other predicate
where one is true. A guard holds the band's floor against the ages printed on the same tab.
(b) L05, with the reader's carried row 5 (the #457 class): "COMPLETE PRODUCTION CHAIN IN PLACE" IS SAID ONLY WHERE EVERY
HOUSE THE CHAIN NEEDS STANDS ON THE ROSTER AND NO CRISIS IN FORCE HAS STOPPED ITS SOURCE (the herds that failed feed no
cheese and no preserved meat). Elsewhere the row says what is missing, in the words its siblings already use, or the
good is not listed. Count before and after on the reader's births: the 8 of 82 under a famine, the 21 with no butcher,
dairy or herding house, the 51 with no tanner.
(c) L14: the noble subordinate line ("still have their titles, but the hall's offices have taken most of their power")
is not drawn where the same record gives that body a say in the seat's decisions: it reads the relationship's own
standing, the fact the Power tab prints beside it.
(d) THE CARRIED TWIN ("street kitchens" in 63 towns with no market: src/data/cultureProfiles.js): if no other lane holds
that file (check BY CONTENT), the lane's seller gate takes it as it took vendors, stalls and hawkers; else FOR THE JOIN
with the count.
(e) THE GUARD THAT DOES NOT RED (tests/generators/r3cRekeyedLinesTrue.test.js, the war arm): its births must draw a famine
town in that column so that the war line planted in the famine pool REDS; prove it by that plant.

### Items
1. **L01, be7f5a208.** Cause: TIME_BANDS' sixth band starts at sixty years and its one predicate said "older than anyone
   living" of what is 61 years old; the record's people reach "seventies" (npcData.js elder ages). Cure in
   heraldCausalGrammar.js only (this lane's; no other lane's copy differs from the line's): `LIVING_FLOOR` (ninety years,
   "older than all but the oldest alive"); `timeBandOf` returns the sixth band, same id and null columns, with the floor's
   predicate under ninety. Display only (the 720 re-born at the cure: 0 records differ). Count (generalDeskLines over the
   1,722): before 743 towns, 288 naming 60-89 years; after, the old words 455 (all >= 90, oldest person <= 79), the new
   words 288 (all 60-89). Guard: tests/domain/r3c8ReaderLinesTrue.test.js (L01 arms), red at 70d92ed06 3/3, plant
   floorWeeks 52*60 red 3/3. Re-keyed by identity: heraldCausalVoice.test.js's own R3-CODE-C-2 pin of the false words at
   77 years.
2. **L05 (and the carried #457 class), 1b3e0fdfd.** Cause: a chain counted "fully exploited" at two houses of ANY of its
   tags (Subsistence farming and an external mill carry "food"), so the claim stood with none of the chain's houses and
   beside a famine that failed its source. Cure (resourceGenerator.js :: evaluateInstitutionDeps): the row is written
   only where every house in `processingInstitutions` (not an "Access to ..." road) stands by name or by kind (a house
   that processes the chain, same head word), and the food record's `failedSource` is not the chain's; else NOT LISTED
   (the ruling's arm). A chain naming no house (oasis dates) gives its goods without the claim. DECLARED MOVE:
   resourceAnalysis.exports only (720: 291 towns; 1,722: 627, all in resourceAnalysis). Counts: "cheese, preserved meat"
   claims 82 -> 0 (famine 8 -> 0; no butcher/dairy/herd 21 -> 0); leather with no tanner 50 -> 0 (reader 51); every
   claim 795 -> 121; export rows 1,137 -> 457; towns with an export row 827 -> 365. Guard: the L05 arms (ten towns, three
   named guard towns); red at 70d92ed06; plants (3), (4) and the no-house arm each red. Re-keyed by identity:
   resourceAnalysisCoupling.test.js's R3-CODE-C-2 #457 pin. **Recommendation for the chair:** the ruling's other arm (the
   row says what is missing in the partial sibling's words) would keep more rows; I took "not listed" because no product
   to house map may be built (the 2026-11-13 ruling) and a partial row's intermediates ("meat, hides, dairy") would newly
   print where their houses do not stand.
3. **L14, 77f0e6792.** Cause: the noble subordinate line was drawn of the indebted crisis's own creditor face ("Crown
   Creditors (Noble Coalition)", data/stressPowerFaces.js) beside the stability "Strained — the creditors have a say in
   every decision". Cure (factionDynamics.js): under the indebted crisis, where the noble power is that face, the
   subordinate relationship is not added. DECLARED MOVE: powerStructure.factionRelationships, 1 town of 1,722
   (r2r-metropolis-33), no draw moved. Count: subordinate lines 128 -> 127; of the creditor face 1 -> 0. Guard: the L14
   arm; red with the gate removed.
4. **(d) "street kitchens": FOR THE JOIN** (below). src/data/cultureProfiles.js is HELD by lane/w2-fix-data-2026-11-13
   (and w2-fix-data-history), which changes this file against the line (and gates its siblings with `needs: ['market']`).
   Count on the 1,722: the line prints in 164 towns, 63 of them with no market or fair house (e.g. r2r-thorp-2, r2r-thorp-33,
   r2r-thorp-57), the reader's 63.
5. **(e), 1654b0ad3.** The war arm of tests/generators/r3cRekeyedLinesTrue.test.js now draws a famine town in each column
   (36 more births) with an anchor that the famine defence official line prints; the plant (the war line as
   famine.defence.official) REDS the war arm. The lighting census re-taken for the new guard file: its own commit after.

### EVERY NEW OR CHANGED LINE, with the towns it was read in (the owner's veto list, and the next reader's)
- **"older than all but the oldest alive"** (NEW WORDS; heraldCausalGrammar.js :: LIVING_FLOOR, the History tab's
  timeband_age fill): r2r-city-44 (city of 2,408; the siege 61y), rr3-thorp-slave_revolt-rand-5 (thorp of 5, smallest;
  74y), rr3-thorp-under_siege+famine-rand-3 (siege and famine; 79y), r2s-wartime-thorp-2 (war and famine; 67y),
  r2r-thorp-0 (73y), r2s-mass_migration-metropolis-3 (metropolis of 248,369, largest; 78y). The sentences are in be7f5a208's body.

- **The export row** (resourceGenerator.js): no new words. Kept with the claim: rr3-metropolis-occupied-rand-3 (301,467,
  occupied, largest), rr3-town-under_siege+famine-rand-0, rr3-city-plague_onset-rand-2; given without the claim:
  r2s-infiltrated-thorp-3 (thorp of 6); now silent: r2r-thorp-36 (thorp of 5), r2s-famine-thorp-1, r2s-famine-city-3,
  rr3p-thorp-under_siege-rand-2, rr3-metropolis-religious_conversion-rand-3. The rows are in 1b3e0fdfd's body.

- **The noble subordinate line** (factionDynamics.js): no new words; not drawn in r2r-metropolis-33 (metropolis, indebted);
  kept, true, in r2r-village-27, r2r-town-13, r2r-city-21.

### FOR THE JOIN (this seat)
1. The lighting census re-take for the new test file (this seat's own commit, at the end of its items).
2. The dossier prose manifest's re-record (red at the lane tip already; seventh seat's item 4) now carries the L01 words.
3. NAMED, the corpus lane's file: DS-GEN-16 ANCHORED-OLD "Nobody now in {settlement} saw the {calamity}" is keyed on the
   sixth band's id and prints from sixty years (src/data/dossierStateProse/general.generated.js).
4. The golden re-derive manifest (tests/domain/worldFactRederive.test.js A7): red at the lane tip (3 misses); L05's
   declared move makes it 4: the signed regen, the merge seat's act.
5. NOT CURED, named: "beer" in the kept grain claims (71) where no brewery stands; the grain chain names no brewer.
6. (d) src/data/cultureProfiles.js :: CULTURE_PROFILES, the foodways line at 419 ("Irrigation, tanks, street kitchens,
   preservation, and ritual food rules shape supply and consumption."): the one-line change is
   `{ text: '...', needs: ['market'] }`, as the holder lane already gates "market vendors". 63 no-market towns of 1,722.
7. The golden-master pin census (tests/generators/powerEconomyFreshness.test.js A4): 18 rows at the lane tip, 31 after
   L05's declared move (L01, L14 and (e) add none): the signed regen.

### Step 2 (sent): one message to the chair at 09:39Z, tip 3dcf0c1c2, each finding's count before and after.

### Step 3, the bar's seven MEDIUM rows (BAR-0-ROWS-r3c.json), each read in its town (bar0 births: REVIEW-BAR-0 render.bar0.jsx :: cfgFor, the rr pattern)
- **n162, n163 (bar0-thorp-calm-rand-1, Tyrby, thorp of 28; "bread, beer, animal feed · Complete production chain in
  place" on an external mill)** and **n277 (bar0-village-famine-rand-1, Zelenoki, village of 187, the grain failed; the
  same row beside a Mill only)**: EXECUTED: both rows print at 70d92ed06 and NEITHER prints at this seat's tip: answered
  by L05 (1b3e0fdfd: no Bakers stand, and the famine failed the grain). Zelenoki's livestock claim is gone with them.
- **n80 (bar0-city-under_siege+famine-rand-1, Agiospolis)**: EXECUTED, still prints at the tip: the food record holds
  `failedSource: "fish"` and `foodSources: ["fish"]`, and `foodwaysLine` "The table rests on fish from the local
  waters." The writer is foodGenerator.js's call of domain/foodways.js :: composeFoodwaysLine (it hands every source,
  the failed one too, to the phrase libraries). NOT CURED (the count's mark).
- **n240 (bar0-town-calm-rand-1, Gortfell)** and **n299 (bar0-village-calm-rand-1, Tzulco)**: EXECUTED, both print at the
  tip, in powerStructure.factionRelationships (factionDynamics.js, the religious↔governing arm): "Its priests look after
  their flocks and have no say in the hall." (ratio 0.31, subordinate) and "... Each props up the other." (ratio 0.7)
  against the record's facts the row file gives. NOT CURED.
- **n15 (bar0-metropolis-calm-rand-1, Shankou)**: not in the record (governanceAccount.js composes it on display); NOT READ.

### HAND BACK AT THE COUNT (used_tokens 346,162 at 09:42Z, read by get_session; this turn would pass the mark)
**Tip** 3dcf0c1c2 plus this section. **Done:** L01 be7f5a208, L05 1b3e0fdfd, L14 77f0e6792, (d) FOR THE JOIN, (e)
1654b0ad3, the lighting census 47d16334c, the hand-back commits; step 2 sent.
**WHAT IS LEFT, line by line:**
1. n80: the foodways line under a famine that failed its only named source. Measure first on the 1,722 (foodRecord.
   failedSource in foodRecord.foodSources and the line naming it); the cure is a DECLARED MOVE (foodways draws:
   `FOODWAYS.SOURCE_PHRASES.*` through drawDeclared), first check by content who holds foodGenerator.js.
2. n240, n299: the religious subordinate/props-up lines against the town's own conflicts and the faith's civic voice;
   the arm is factionDynamics.js's religious↔governing block (this lane holds the file).
3. n15: read it on the Power tab in its town at the tip (governanceAccount.js, this lane's file), then cure or clear.
4. The full step-3 procedure for each: widest first, one cause a commit, red first, plants, the reading, gates.
5. FOR THE JOIN, above: the golden regens (powerEconomyFreshness A4 18 -> 31; worldFactRederive A7 3 -> 4), the dossier
   prose manifest re-record, cultureProfiles.js line 419 (63 towns), the corpus's ANCHORED-OLD line, the "beer" claims.
**What a fresh reader needs:** the range 70d92ed06..<this tip>; source changed only in heraldCausalGrammar.js,
resourceGenerator.js, factionDynamics.js; the reader's file's unfinished steps (its "WHAT IS LEFT", 1-6) stand untouched.
**How the instruments are re-made (all outside the tree):** worktrees /tmp/claude-0/wt8 (c8, `npm ci`) and
/tmp/claude-0/wtbase (70d92ed06, node_modules linked); births `TREE=<wt> OUT=<f.gz> SEEDS=seeds-all.txt node
REVIEW-R3-CODE-C/births.mjs` (seeds-all = REVIEW-R3-STAGES seeds720 + seeds-app + seeds-plagued + REVIEW-R3-CODE-C
seeds-extra); probes in /tmp/claude-0/tools: l01.mjs (History-desk sentences with the age named), l05*.mjs (export
claims by chain, houses, failed source), samerec.mjs (records and families moved), bar0*.mjs (the bar towns). Local
config and refs compared after every push: unchanged but for the local branch c8 and npm ci's core.hooksPath.

## THE NINTH SEAT (R3-CODE-C-9, 2026-11-14; brief docs/chair/2026-11-14/briefs/BRIEF-R3-CODE-C-9.md on the chair's lane; EXECUTED unless marked)

**The tip.** On origin it read bd21a34c1, as the brief wrote. Scratch worktree /tmp/claude-0/wt9 (local branch c9);
the lane tip in /tmp/claude-0/wtbase for the red-first runs. Births: the reader's 1,722 (REVIEW-R3-STAGES seeds720 +
seeds-app + seeds-plagued + REVIEW-R3-CODE-C seeds-extra.txt), and the bar's four towns (bar0-, the rr pattern).

### The chair's rulings this seat worked to (copied from the brief, 2026-11-14; vetoable by the owner)
1. n80: A LINE THAT NAMES WHERE THE FOOD COMES FROM READS THE FOOD RECORD: a source that failed or is cut off is not
   named as feeding the town; the line names what still feeds it, or says the source failed in words its siblings
   already use, or is not written. Count the class on the births.
2. n240 and n299: the faith's subordinate and "props up" lines (factionDynamics.js) against the town's own conflicts
   and the faith's civic voice: each line reads the relationship's own standing, the fact the Power tab prints beside
   it (77f0e6792 is the form): not drawn where the record contradicts it.
3. THE BEER CLAIM: the same ruling as L05: a good is claimed as made here only where every house its chain needs
   stands on the roster (the grain chain names no brewer: so the claim reads the roster for a brewer, or the good is
   not listed). Count before and after; a declared move of the resource analysis's exports.
4. n15: READ IT on the Power tab in its town (governanceAccount.js composes it at display): false -> cured at display,
   its own commit; true -> said so with what the record holds.
5. (The chair's message, 10:58 UTC) H2-22: tonight.official "Famine. {S} has lost a second harvest."
   (src/domain/crisis/crisisSummaryVantage.js) takes the Crisis tab's twin's condition and words ("{S} has gone short
   of food for a second season.") where the food record holds no grain; count -> 0; read in three towns, a fishing
   hamlet among them. STOPPED: FOR THE JOIN 7 (the condition cannot be read in this lane's file).

### Rows
1. **n80, 52d440373.** Cause: the line is composed at generation from every source, the failed one too
   (foodGenerator.js's call of composeFoodwaysLine), and its one reader handed it on unread. The call's block in
   foodGenerator.js is held by the unjoined upkeep lanes, so the cure is at the line's ONE READER (domain/foodways.js
   :: foodwaysLineOf: Economy tab, PDF, Foundry, culturalIdentity.foodways at assembly): the composer's sentence is
   read back (frame index, slot phrases; no draw), the failed source's phrase taken out (grain and the mill together),
   the rest kept in the smaller count's frame; the culture's sentence only where it names no failed source; with
   nothing left, the composer's own no-source answer. Counts: famine towns 99; failed source named 99 -> 0 (88
   single-source); culturalIdentity.foodways 99 -> 0. Declared move: culturalIdentity.foodways only (1,722: 99; 720:
   19). Guard: tests/domain/r3c9ReaderLinesTrue.test.js n80 arms, red at bd21a34c1; plants (the grain-mill pairing
   removed; the reader bypassed) red. "Cut off" read: the food record holds no cut-off source; the depleted fishery
   still a source by its fishing row (foodLand.js) is named below, not cured.
2. **n240, f03732b9e.** Cause: World/Faith (faithReading.js :: factionLine) gives the strongest religious power a voice
   wherever one stands, and its own card's desc gives civic reach in every band, so "have no say in the hall" is
   contradicted wherever drawn (149 of 149; desc "limited"/"little" in 17). Not drawn (factionDynamics.js). Counts:
   149 -> 0; dependent 327 unchanged. Declared move: powerStructure.factionRelationships only (1,722: 149; 720: 79).
   Guard: n240 arms (seven towns), red at bd21a34c1; plant red.
   **Recommendation for the owner's veto:** the first sentence alone ("{faith} answers to {hall}.") would keep the row
   in the web; I took the ruling's "not drawn" (no reword ruled).
3. **n299: FOR THE JOIN** (below). The dependent line prints beside a conflict between the same pair in 63 of 327
   (Tzulco: "a ruling one power refuses to obey"); the conflicts are drawn after the power step, in held files.
   "Elder Council keeps order" beside "Nobody here is paid to keep order. A quarrel goes to the heads of the oldest
   families": read, not false.
4. **Beer, 9fb62639d.** Cause: evaluateInstitutionDeps listed every final product of a full chain; the grain chain's
   houses (Mill, Bakers) make no beer. Cure (5): a good none of its chain's houses makes is listed only beside its maker,
   read by kind (houseHead: Brewery/Brewer; an Alehouse is not), one row: beer -> brewer. Counts: beer rows 73 -> 54;
   claims 71 -> 52 (the eighth seat's 71 were every beer claim; 19 stood with no brewer); beside no brewer 19 -> 0.
   Declared move: resourceAnalysis.exports only (1,722: 19; 720: 11). Guard: beer arms (five towns, three kept),
   red at f03732b9e; plant red.
5. **n15, 1db43b7eb. READ: FALSE.** Shankou: the Thieves' Guild row is the adversarial capture rung (the hall
   "hunting ... in earnest", the same tab: "... and Ducal Governorship is winning"), counted by estrangedPowersOf as a
   power broken with the hall. Cure at display (governanceAccount.js): that row is not estranged. Counts: accounts with
   the competitive consequence 136 -> 106; whose only competitive tie was that rung 30 -> 0; accounts changed 55.
   Guard: n15 arm (four towns), red at 9fb62639d; plant red. No record moves.

### EVERY NEW OR CHANGED LINE, with the towns it was read in (the owner's veto list, and the next reader's)
No new words anywhere. Changed lines (full sentences in each commit's body):
- **The foodways line** (domain/foodways.js; Economy tab, PDF, Foundry): Agiospolis (city, siege+famine) -> "Meals
  follow the season and what the household has put by."; rr3p-thorp-famine-rand-0 (thorp of 6, smallest) -> "Herding
  and mixed farming produce a strongly seasonal food calendar."; rr3-metropolis-famine-port-1 (97,340, largest) ->
  "Smoking, drying, fermenting, and winter storage are central household technologies."; rr3-village-under_siege+
  famine-rand-3 -> "The table rests on salted fish. Herding and mixed farming ..."; r2s-famine-metropolis-3 -> "Most
  meals start from salted fish."; rr3-thorp-under_siege+famine-rand-4 -> "Most meals start from the day's catch."
- **The faith's subordinate row** (Power tab web): silent in Gortfell (town), r2r-village-12 (village of 80; the web
  empties, self-gated), rr3-town-under_siege-rand-0 (siege), r2s-occupied-town-1 (occupied), r2r-metropolis-0.
- **The grain export row** (Resources tab): "bread, beer, animal feed" -> "bread, animal feed" in r2r-town-24 (423),
  r2s-occupied-town-1 (occupied), rr3-town-wartime-rand-5, rr3p-city-calm-rand-0 (8,231); kept in r2r-metropolis-3.
- **The governance account** (Power desk, PDF Power Structure): the criminal "no longer takes its orders" and the
  competitive consequence gone in Shankou, r2s-under_siege-town-0 (siege), r2s-slave_revolt-town-3 (1,271, smallest),
  rr3-metropolis-recently_betrayed-rand-4 (169,385, largest); newly printed there, the account's own fallback vignette
  (the record's recentConflict, already on the same town's Summary tab) in 32, e.g. r2r-town-58 "Several merchants have
  been found murdered this season, and people say the guard is doing nothing about it." (13 towns carry this vignette:
  the next reader should read it beside the hall's "hunting ... in earnest"), r2r-city-12 "A guild's private soldiers
  arrested a rival's factor. ..."; a second power's own sentence alone ("The Military/Guard no longer takes its
  orders.", 5); the next tie's consequence ("Nothing large is settled in the hall without bargaining with them
  first.", 4).

### Declared moves by family (the 1,722 / the census's 720)
culturalIdentity.foodways 99 / 19 (52d440373); powerStructure.factionRelationships 149 / 79 (f03732b9e);
resourceAnalysis.exports 19 / 11 (9fb62639d); 1db43b7eb display only. No draw added or moved.

### FOR THE JOIN (this seat)
1. n80 at its source: src/generators/foodGenerator.js :: generateFoodSecurity, the composeFoodwaysLine call (held by
   upkeep-monotone, upkeep-measure-2, coherence-upkeep): `sources: foodSources.filter((src) => !(src === failedSource
   || (['grain', 'mill'].includes(failedSource) && ['grain', 'mill'].includes(src))))` puts the true line in the raw
   record (foodRecord.foodwaysLine, read by the JSON export and generationCoherence.js); the reader cure stays harmless.
2. n299: src/generators/steps/assembleSettlement.js (held by the upkeep lanes and w2-fix-data), after
   `settlement.powerStructure = { ...settlement.powerStructure, conflicts: settlement.conflicts }`, and the regen in
   src/generators/generateSettlementPipeline.js after generateConflicts (held by powers-follow-up): drop the
   governing-religious `dependent` row whose pair is a conflict's parties (63 of 327 on the 1,722).
3. Goldens, the merge seat's signed regens: powerEconomyFreshness A4 31 (bd21a34c1) -> 35 (f03732b9e; items 1 and 2
   together, not split); espionageDormancyFence's driven hash, red at bd21a34c1, moved again by 52d440373;
   generatorGoldenMaster 412, worldFactRederive A7 5, generationForkCensus's control row: red at bd21a34c1, unmoved.
4. NAMED, not cured: a depleted fishery is still a food source by its fishing row (foodLand.js :: fishRowOnWater), so
   a foodways line names a catch beside "nothing left worth taking": 104 -> 98 on the 1,722.
5. NAMED, not cured: "herding" is not in foodways.js :: SOURCE_WORDS.livestock, so a culture sentence claiming herding
   stands where no herd is a source: 124 lines on the 1,722 (a composer change: foodRecord.foodwaysLine would move).
6. The lighting census re-take for the guard file tests/domain/r3c9ReaderLinesTrue.test.js (not taken by this seat).
7. **H2-22 (the chair's 10:58 ruling), STOPPED.** The Crisis tab's twin is r2-code-b's (src/generators/stressNarrative.js
   :: RENDERERS.famine, `atomHolds('grain', facts) === false`; on join-2026-11-14, not on this lane).
   crisisSummaryForSurface(entry, name, surface) (this lane's crisisSummaryVantage.js) is handed only the stress entry
   and the name, and its one Tonight caller, src/domain/summary/tonightSheet.js:341, is held by r2-code-b and
   r2-code-b-side (unjoined). So the condition cannot be read in this lane's file alone. Count on the 1,722 at
   1db43b7eb (h222.mjs): the Tonight "lost a second harvest" line 58, with no grain or mill source 54 (r2r-hamlet-16,
   a fishing hamlet; r2r-thorp-17, game; r2r-city-44, fish). The two-file change, for r2-code-b or the join: (a)
   crisisSummaryVantage.js: crisisSummaryForSurface takes an optional `facts` and, for famine's tonight.official,
   where `atomHolds('grain', facts) === false`, prints "{name} has gone short of food for a second season. Its leaders
   have begun rationing, while the families who can afford it hoard what they have."; (b) tonightSheet.js:341 passes
   the record's facts. Named beside it, not ruled: famine's overview.official ("The harvest in {name} has failed, ...")
   presumes grain the same way.

### WHAT IS LEFT, line by line
1. H2-22: FOR THE JOIN 7 (stopped; the chair to place it with r2-code-b or the join seat).
2. The eighth seat's other named rows, in its order (its FOR THE JOIN and WHAT IS LEFT), where this lane holds the file.
3. FOR THE JOIN 1-6 above.
**What a fresh reader needs:** the range 70d92ed06..<this tip> (the eighth seat's and this seat's); source changed by
this seat only in domain/foodways.js, generators/factionDynamics.js, generators/resourceGenerator.js,
domain/display/governanceAccount.js; the first reader's unfinished steps (its "WHAT IS LEFT", 1-6) stand untouched.
**How the instruments are re-made (all outside the tree, /tmp/claude-0/tools):** births.mjs (REVIEW-R3-CODE-C's, its
rr pattern widened to bar0-) `TREE=<wt> OUT=<f.gz> SEEDS=seeds-all.txt node births.mjs`; fw.mjs (foodways failed and
depleted sources named), fwdiff.mjs, rel.mjs (religious-governing lines, desc band, conflicts, faith voice), gov15.mjs
and gov15sent.mjs (the account's sentences, base against tip), samerec.mjs (records and families moved), holders.sh
(lanes that changed a file since their merge base with integration; a lane already in lane/join-2026-11-14 counted
as joined). Local config and refs compared after every push: unchanged but for the local branch c9 and npm ci's
core.hooksPath.
