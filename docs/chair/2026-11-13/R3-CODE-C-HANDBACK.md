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
(Further rows are added as each item closes.)

## Noticed, not mine

- `priorityNote: "Military priority is 86. Defence institutions are expected."` — three records of the 720 carry it
  (viability's field, not structuralValidator.js); not traced to a page surface.

## Parked

(none yet)
