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
  results are appended here when they land; a successor's final statement re-runs both at its own final tip.
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
