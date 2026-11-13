# R3-TABS hand-back (lane/r3-tabs-2026-11-13)

Cut from `lane/integration-2026-11-07` at **aac79b808** (read back from origin at the seat's start, 2026-11-13).
The seat's assignment is the chair's message of 2026-11-13 (session session_01FE9mEws7PXYRYdjQPbSX15); its
rulings are copied below because the chair's messages are not on the branch.

## The rulings this seat worked to (copied from the assignment)

- **(b1)** "REQ" and "FORCED" on the Defense tab's force cards are the generator's provenance and leave the page
  (11 and 9 on the twenty towns). The "YOU" badge stays where it is true.
- **(b2)** The slider ends on History's tensions ("Resource Scarcityminormajor", 25 on the twenty towns): a rating
  is shown as ITS WORD. The tension's severity prints as its own word beside the tension; the two end labels leave.
  Measure first what the bar encodes: if the value has named bands in the record or the display leaves, use them;
  if it has none, stop on this item with the measure and three towns, and invent no ladder.
- **(c)** A line that disagrees with another home on the same page: the home the record bears out is the truth;
  the tab's line reads it, or leaves.
- The page shows the ratings, never the machinery. No new key in the settlement record; no new word in the
  vocabulary file. New wording is listed with the town it was read in; the owner vetoes by exception.
- Not this seat's: tabs/CrisisTab.jsx, tabs/power/PowerStrata.jsx, tabs/WhoRunsThisTownPanel.jsx,
  tabs/ResourcesTab.jsx, tabs/EconomicsTab.jsx; the defence generator, its tuning table, src/pdf/sections/DefenseSecurity.jsx
  and the defence display leaf (`defenseDisplay.js`, wc's by the cut's own-commit holders).

## The measure (base aac79b808; births in the app's shape)

Births: the census's 720 (`births.mjs` of REVIEW-R2-STAGES), the reader's twenty (`seeds20.txt`) and 144 fresh
`r3t-<size>-<calm|under_siege|famine|plague_onset|occupied|under_siege+famine>-<rand|port>-<1..4>` seeds, every one
through `birthConfig({...DEFAULT_CONFIG, settType, selectedStressesRandom:false, selectedStresses})`.
The reader's twenty rendered with the reader's own `render.sh` (the whole owner view, every disclosure opened) and
their other surfaces with `surfaces.sh` (PDF canon/draft/timeline, Foundry journal, Tonight sheet).

## Items

### 1. DefenseTab :: ForceCard — REQ / FORCED (b1) — DONE
- Lines: #185 (HIGH), #323 #378 #465 #719 #956 #1177 #1391 (MED).
- Measure at base: the cards' sources on 164 towns (reader + fresh): generated 255, required 248 (REQ),
  coherence_repair 54, cascade 21, faction_boost 12, forced 1 (all FORCED). The one 'forced' source is the
  isolation generator's (r3t-city-calm-rand-1, Hedge wizard; `config.customInstitutions` []), so 'forced' is not
  the user's word either: no card source says the user added a force, and no YOU is printed on a card.
- Page at base, the twenty towns: REQ 11, FORCED 9 (one per view line). After: 0 and 0. What prints in the
  badge's place: nothing; the card keeps the force's name and line (read in rr2s-hamlet-under_siege-rand-1:
  "Palisade or earthworks / A plain wooden palisade, or a bank of earth…", true: the roster holds the palisade).
- Other surfaces at base: PDF canon and draft REQ 25 / FORCED 13 each (`src/pdf/sections/DefenseSecurity.jsx`,
  the defence lane's, NAMED, not touched; some REQ may be the PDF roster's); timeline packet, Foundry journal and
  Tonight sheet 0.
- Red first: tests/components/defenseForceCardNoProvenance.test.jsx (27 badges on twelve towns at the base).

### 2. DefenseTab — "Underworld: <faction> · <band>" (c) — DONE
- Line: #816 (MED), rr2s-city-famine-rand-1: "Underworld: Thieves' Guild · Minor" beside the Power tab's "Criminal 18".
- Measure at base: the line read the faction's stored `powerLabel`; the generators' own ladder (factionDynamics.js,
  economyReconciliation.js, neighbourFactions.js: ≥35 Dominant, ≥25 Strong, ≥18 Significant, ≥10 Minor) bands 18
  Significant. On 884 births (census + reader + fresh) 1,105 of 3,247 factions carry a label off their own figure
  (48 of 150 criminal factions). The stored label cannot be read; the strength is the Power tab's (T2-20).
- Cure: the line names the faction ("Underworld: Thieves' Guild"), true in its three towns of the twenty.
- NAMED, not touched: the stale `powerLabel` itself (the power generators); the PDF prints the same band
  (DefenseSecurity.jsx :: "Underworld:", 3 per variant on the twenty, the defence lane's).
- Red first: tests/components/defenseUnderworldLine.test.jsx.

## The chair's added rulings (arrived by message, 2026-11-13 18:51 and 18:56 UTC; copied here)
- **defenseStateProse.js (posture selector), after point 48 lands on the line** (the chair gives its hash): merge the
  line's tip into this lane (a merge, never a rebase), then do LAST: L1 one ladder for one number (the posture line
  reads the readiness BADGE: Fortress/Well-Defended → strong pool; Defensible → adequate; Lightly Defended/Vulnerable →
  weak; Undefended → critical; no new words, all four pools kept; read ten towns of each changed cell and declare);
  L2 a row's sentence is drawn within the band its bar prints (classes A1, F; do not touch the force reader; say which
  tree was measured); L3 every band has a pool (C-L5: measure the six births, say what key is missing). Corpus variants
  are the corpus lane's: a pool lacking a true variant for a cell is parked with the cell and three towns. Acceptance:
  the reader's classes E, K, A1, F at zero by its own instrument. Until point 48 lands the file is not opened for writing.
- **SubstrateTab, round two's #329 and #858**: "Trade connectivity: Adequate" under a siege that cuts every road. The
  reading (causalState.js) is the defence lane's: not changed. Measure what it takes from a siege in force and what the
  tab prints; the tab does not print a connectivity word the town's own crisis contradicts: under such a siege the row
  says so in the crisis's own words from the record, or does not print; if that cannot be done at the tab without a new
  reading, PARK with the measure and three towns.

### 3. HistoryTab :: ALL_EC — the event card's category word (c) — DONE
- Line: #1104 (MED), rr2s-city-occupied-rand-1: "The Occupation · Exile & Return".
- Trace: each of the two categories draws ONE template (historyPolicyData.js): `exile_return` → occupation_legacy
  ("The Occupation"), `occupation_infiltration` → infiltration_fear ("The Purge"). Measured on 884 births at base:
  385 and 443 events, every one so; the tab printed "Exile & Return" and "Occupation" on them (page, the timeline's
  dot titles and its legend).
- Cure: the words the same tab already gives those templates as tensions (TENSION_META): "Occupation Legacy",
  "Infiltration Fear". No new words. Read in rr2s-city-occupied-rand-1: "The Occupation / Occupation Legacy",
  "The Purge / Infiltration Fear", true by each event's own description.
- NAMED, not touched: `src/domain/dossier/plotHooks.js` carries the same two labels (the Plot Hooks tab); the PDF
  prints "Exile & Return" 6 times per variant on the twenty and the Foundry journal 4 (their category tables, not
  this tab's); the corpus row DS-GEN-9 "event type: exile_return" ("People {settlement} sent away came back") is the
  corpus lane's and sits under the same category.
- Red first: tests/components/historyEventCategoryLabel.test.jsx. The fifteen files that import HistoryTab: 752 green.

### 4. HistoryTab — the founding row "Origin:" (#488 #594 #845) — STOP for this seat (named)
- Trace: the row prints `history.founding.reason`, drawn by `narrativeGenerator.js :: genArrivalDetail` from
  `src/data/narrativeData.js :: TERRAIN_NARRATIVE_HOOKS` (and its commodity hooks) with no disqualifier read from the
  record. The cut's own `wordsHolders` gives narrativeData.js to lane **ra**. The fault is the pool's, not the tab's.
- Measure: at my base #845's town (rr2s-city-famine-rand-1) holds `ancient_grove`, so "developed around a sacred grove"
  is TRUE there; #488 ("the local soil produces something…", plains, no crop exported) and #594 (salt, none near)
  stand. A read of 29 fresh towns (one in five of the 144): 19 true, 10 false (coastal trading port / maritime hub /
  natural harbour / shipwright / naval base in places whose Overview says there is no wharf; a logging operation on
  plains with no timber; an agricultural market centre in a hamlet).
- Why not cured at the tab: the row is true in about two towns of three, so removing it is a count falling, not a cure,
  and "never delete a line that is true somewhere". Recommendation: the pool gains disqualifiers read from the record
  (the wharf/docks fact, the resource list, the tier) on lane ra or the data lane.

### 5. HistoryTab :: TensionRow — the severity chips "minormajor" (b2) — STOP (the measure, as ruled)
- Lines: #486 #487 #592 #593 #743 #744 #1422 #1423 (MED); 25 on the twenty towns' pages (33 chip lines by my dump).
- What the "bar" encodes: there is no bar. The row prints one chip per member of `history.currentTensions[].severity`,
  and that field is the TEMPLATE's severity list copied verbatim (`historyData.js :: HISTORICAL_EVENTS_DATA[].severity`;
  `historyGenerator.js :: buildHistoricalEvent` never resolves it for a tension, while an event's is resolved by
  `pick(eventTemplate.severity)`). On 164 towns (reader + fresh) at base: 290 tensions, all arrays: minor/major 176,
  major/catastrophic 100, major 10, minor 4. So 276 of 290 carry a RANGE, not a rating.
- Named bands exist (minor / major / catastrophic: `tabConstants.js :: SEV_COLORS`, `dossierSearch.js :: SEVERITY_RANK`),
  but the record holds no single value for a tension to read through them; the display leaves only re-shape the
  range (`dossierSearch.js :: severityRank` takes the worst for sorting; `pdf/lib/viewModel.js :: normSeverity` joins
  "minor / major", which the PDF prints 33 times per variant on the twenty). Printing the worst, or the least, would be
  this seat choosing the rating: invented. Nothing changed.
- Three towns (base aac79b808): rr2s-town-under_siege-rand-1 ("Resource Scarcity" [minor, major]; "Occupation Legacy"
  [major, catastrophic]); rr2s-city-calm-rand-1 ("Wild magic", "Heresy trial", both [minor, major]);
  rr2s-metropolis-plague_onset-port-1 ("Resource Scarcity", "Wild magic", both [minor, major]).
- Recommendation: the tension's severity is resolved at birth as an event's is (one draw in historyGenerator.js, the
  data lane's file; it moves births and needs its signed shift), and the tab then prints that one word. The 14
  single-word tensions already print one true word.

### 6. DefenseTab lines whose writer is the defence display leaf (wc's) — NAMED, not touched
- Food endurance (#34 #75 #103 #137 #184 #226 #290): the whole sentence is `defenseDisplay.js :: foodEnduranceLine`
  (the tab prints label/before/door/after). "A few weeks" at 0.1 months (`weeks <= 3`), "under siege … are lost" with
  no siege in force, half rations stretching 1.8 months to eight or nine.
- "Legal Infrastructure · Court only" with no courthouse and no prison (#575): `defenseDisplay.js ::
  deriveSupportingCapabilities` (status from `hasCourtSystem` / `hasPrison`).

### 7. SubstrateTab — the Foundations Food row (c) — DONE
- Lines: #494 ("FoodStrained" beside the Overview's "Food Security · Deficit", a siege at a 68% deficit), #1317
  ("FoodAdequate" beside "Pressured").
- Measure at base: on the reader's twenty the Foundations Food word equalled the Overview's food word in NONE (the
  causal score on the causal ladder: Secure/Adequate, Deficit/Strained, Deficit — Active Famine/Critical or Collapsed,
  Pressured/Adequate). The food record's band is the page's one food reading (Overview, Crisis, Economics).
- Cure: the row prints `economicState.foodSecurity.label`, cased as the Overview cases it (statusCase), in the
  record's colour; the causal band stays on `data-band` and orders the rows; a record without a label keeps the band
  word. Read: rr2s-town-under_siege-rand-1 "Food · Deficit" (deficit 68%, siege), rr2s-metropolis-plague_onset-port-1
  "Food · Pressured" (deficit 8%): true, and the same word as the Overview. No new words.
- Pin re-keyed by identity: tests/generators/foodSurplusResidue.test.jsx (soak1k-5 now reads its record's "Secure"
  where the capped "Adequate" stood; the pin's point, not Surplus, stands).
- Other surfaces: the PDF prints no Foundations Food band on the twenty (0); Foundry, Tonight 0.
- Red first: tests/components/substrateFoodOneHome.test.jsx (red at the base tree: eight of eight towns disagree).

### 8. SubstrateTab — "Trade connectivity" under a siege (round two's #329 #858, the chair's added ruling) — DONE
- Measure at base, 82 siege births (census, reader, fresh; app shape): the reading folds the siege in as the condition
  "wartime pressure" (−13/−14 from `causalState.js :: deriveTradeConnectivity`, the defence lane's, not changed), so
  the row read Strained 45, Adequate 29, Critical 6, Surplus 1, Collapsed 1, while every one of the 82 crises' own
  summary says "nothing comes in by road".
- Cure, at the tab, no new reading: under a siege in force the row prints the crisis's own label (`stress.label`,
  "Under Siege", cased "Under siege"); a siege with no label would print no word of its own (none in the 82). Read in
  rr2s-town-under_siege-rand-1: "Trade connectivity · Under siege", true. No new words.
- NAMED, not touched: the note under the rows says "This reading includes the current condition: wartime pressure."
  under a siege (`domain/display/conditionWords.js`, the condition's name for the siege).
- Red first: tests/components/substrateTradeUnderSiege.test.jsx (red at the base tree). The eleven SubstrateTab files green.
