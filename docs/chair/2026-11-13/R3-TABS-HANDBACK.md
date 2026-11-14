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

## The census's 720 (SECOND-WAVE-CENSUS's own instrument, base aac79b808 against tip 46e5c1002) — EXECUTED
The census renders all 720 dossiers through each tree's own OutputContainer. The counter was re-run outside the
script's pipe on both trees (the chair's hazard notice of 19:28 UTC): exit 0 both, counts.txt 50 lines both, equal to
the script's own output. compare.mjs: 26 rows, all OLD, base = tip on every row (no rise, no fall).
This seat's patterns on the same dumps (`mycount.mjs`, one per view line):

| pattern | base lines / towns | tip lines / towns |
|---|---|---|
| Defense: "REQ" badge | 360 / 360 | 0 / 0 |
| Defense: "FORCED" badge | 246 / 246 | 0 / 0 |
| Defense: "Underworld: X · band" | 118 / 118 | 0 / 0 |
| History: "Exile & Return" | 622 / 311 | 0 / 0 |
| Foundations Food word ≠ the Overview's food word | 720 / 720 | 0 / 0 |
| Foundations trade band word in a forced-siege seed | 24 / 24 | 0 / 0 |
| History: two severity chips run together (b2, STOPPED) | 1,089 / 653 | 1,089 / 653 |
| History: "Origin:" row (named to ra, kept) | 720 / 720 | 720 / 720 |

Field diff: the births at tip are BYTE-IDENTICAL to base (sha256 of the decoded ndjson): census 720 a65d30b2…,
reader 20 2997a853…, fresh 144 666d7793…, so no field of any family moves (every change is a .jsx display read).

## The reader's twenty, base against tip (the reader's own render.sh, whole owner view) — EXECUTED
Every changed line of the twenty pages is one of this seat's: the 20 badges gone; "Exile & Return" → "Occupation
Legacy" (11) and "Occupation" → "Infiltration Fear" (9) on the event cards, the dots and the legend; Foundations Food
→ the Overview's word in all 20 (Adequate → Secure 10, Collapsed/Critical → "Deficit — active famine" 5, Strained →
Pressured or Deficit, Surplus → Secure in rr2s-village-monster_pressure-rand-1, whose Overview reads Secure);
Trade connectivity → "Under siege" in the three siege towns; the three Underworld lines lose their band. No other line
of any page moved.

## After point 48 (the line at 9e57f5023, merged by de0872aa5, a plain merge: no conflict)

The chair's rulings by message, 2026-11-13: 20:34 (three increment rows), 20:37 (point 48's hash, L0-L3), 19:35 (L0
first), 21:24 (crime rows; ServicesTab.jsx), 21:45 (#ww-569), 21:51 (census-2 before the final statement). Copied
in substance under each item below. Measured with `m5.mjs` (the desk's own output, on the defence reader's 1,440
rv2/rv3/rv4 seeds in the app's shape; classes by classes3.py's own patterns) and on the 884 census/reader/fresh births.

### 9. defenseStateProse.js L0 — "no force" reads every armed body — DONE (2ac3fa8c8)
- 77 walled and 41 unwalled watch-only towns of 884 change on the Invasion and Beasts rows. A watch reads the
  townspeople's pools, a contracted company the paid professionals'. Unwalled watch-only: the Invasion row is SILENT
  (the corpus wrote no true pool: `militia only` names a militia) — PARKED CELL for the corpus lane, three towns:
  r2r-village-25, r2r-village-45, r2r-town-2. Classes on the 1,440: A 151 -> 0, B 36 -> 0. Births byte-identical.
- New wording printed in a new place, for the owner's veto: "Every household at … would send someone to the walls"
  (the walls-with-militia pool) in walled towns whose only force is the watch (r2r-town-1, r2r-town-3).

### 10. L1 — the posture reads the readiness badge — DONE (aac97a657)
- 519 of 1,440 posture lines change, none lost: Vulnerable CRITICAL -> WEAK 307, Well-Defended ADEQUATE -> STRONG 142,
  Defensible WEAK -> ADEQUATE 17, 53 re-drawn in their pool. K 10 -> 0, E 56 -> 26.
- DECLARED (vetoable): the move alone raised class D (peace lines under a siege or war) by 21 and the empty-perimeter
  line beside a force by 9. Those four lines carry desk-level disqualifiers, struck at the draw, in a new leaf
  `postureLineDisqualifiers.js` (the crime desk's precedent): STRONG v2/v3/v4 "at war", WEAK v2 "a force stands". D
  35 -> 0, the empty perimeter 21 -> 0. For the corpus lane: carry the four declarations onto the variants.
- E's 26 left: the badge itself reads "Undefended" beside walls and a force (rv2-calm-hamlet-12, rv2-famine-hamlet-34,
  rv2-famine-hamlet-36): the badge is `defenseGenerator.js :: computeDefenseReadiness`'s (the defence lane's). NAMED.

### 11. L2 — the lines within the band the Invasion bar prints — DONE (f0adcd83a)
- A1 2 -> 0, F 55 -> 0; 74 lines removed (posture WEAK 67, CRITICAL 5, Invasion "walls with NO force" 2), none added.
  The two Invasion lines (rv2-wartime-hamlet-5, rv3-under_siege-village-1) were true by the roster (walls, no force)
  and false by the bar: a military score of Strong with no force on the roster is the defence generator's. NAMED.

### 12. L3 — every band has its line — DONE (e40e164ad)
- No key is missing: the six towns' names open on Á/Ö, and `properFill`'s `/^[A-Z]/` refused the {settlement} slot, so
  the whole defence desk was silent there. Now `/^\p{Lu}/u`. NAMED, not touched: the same test in
  economyStateProse.js, generalStateProse.js, powerStateProse.js, stressorsStateProse.js.
- Registers by their doors: the wiring census re-taken and the leaves projected (eaca79fcd: four posture pools gain
  readsCount); the lighting census re-frozen at a clean tip (66fd07e91: +9 files); pins re-keyed with causes (fc2e15afd).

### 13. DefenseTab — crime rows cut mid-sentence (#1274 #1389 HIGH; #718 #817 #1174 #1082) — DONE (87d361dae)
- 339 of 1,657 rows were cut by `truncateAtWord(desc, 200)`; each now ends on its last whole sentence within 200
  (all 339 have one). NAMED: #1082's "Territorial gangs" with no gang house is safetyProfile.js's flag.

### 14. ServicesTab.jsx (#163 #427 #497 #891 HIGH) — STOP (named; nothing changed)
- The "· covers …" chip and the run-together "Needs TimberSupply route severed." are both printed by
  `serviceComponents.jsx :: ServiceItem`, the file R2-CODE-B holds and has changed (its item 1 already removes the
  "· covers" tail and re-keys servicesImpactOnce.test.jsx, on lane/r2-code-b-2026-11-13). ServicesTab.jsx only feeds
  the chip its list (`impactPlan`); cutting it here would cure the chip twice and collide on the same test hunk at the
  join. The separation ("Needs X" and the sentence as two things, in text taken from the page too) is a one-element
  change in ServiceItem's `<p>`. Recommendation: R2-CODE-B's ServiceItem sets them apart; ServicesTab's
  `impactCovers` computation then goes (read by nothing after R2-CODE-B).

### 15. The increment's rows (fe6d5b741)
- #571 HIGH and #916 MED, "Founded by: a miller who built a mill and found customers before they found customers":
  the writer is `narrativeGenerator.js :: genArrivalDetail` (FOUNDERS_BY_TIER.hamlet[1]), held by r2-code-a,
  w2-b-declare, w2-fix-data and w2-write; generalStateProse.js only names it in a comment. STOP, NAMED.
- #867 MED, "FoodCritical" beside "Secure" (rww-thorp-plague_onset-1): CURED by item 7 (the row reads "Secure").
- The severity chips, H9 (#ww-466/467/530/531 HIGH, #ww-468, and #ww-569 by the data lane's trace): the same fault as
  item 5 and the same STOP (the record holds the template's range, no value). RECOMMENDATION for the chair: either the
  range leaves the page as a count range does (the border colour already carries the worst), or historyGenerator
  resolves a tension's severity at birth as it does an event's (a signed shift). These are HIGH lines this seat cannot
  cure under ruling b2 without a ruling.

## FOR THE JOIN — a house's name printed without a shared name leaf, in this seat's tabs
- DefenseTab.jsx :: ForceCard prints `defenseProfile.institutions[*].name` raw (e.g. "Palisade or earthworks"; a
  "Gates (if walled)" would print as stored).
- DefenseTab.jsx's "Active criminal operations" prints `safetyProfile.criminalInstitutions[]` raw.
- HistoryTab.jsx and SubstrateTab.jsx print no house name.
- P9 (the chair's ruling to R3-TABS-3, 2026-11-14 05:52 UTC: NOT this lane's): the Beasts & Monsters row's settled
  lines are the corpus's (the DS-DEF-2 Beasts pools, the corpus lane's main block, its #1509): 114 towns of the 720 where
  a settled line sits beside a Weak or Critical bar (the page census row P9 at 268b26d8c).

### 16. CENSUS-2 (2686272b1) in this seat's files, and one hit cured — DONE (317f1e19c)
- Run at the lane's base aac79b808 and at 87d361dae, `--files` DefenseTab, HistoryTab, SubstrateTab, ServicesTab,
  defenseStateProse, postureLineDisqualifiers; every stage's exit read (both 0). The census traces corpus lines to the
  corpus file, so the selector's hits print under `defense.generated.js`; read there:
  - kind e "no line and no force" beside a force: 2 lines / 14 towns -> 0 (L0).
  - kind d untraced: "FORCED" (15 lines / 378 towns at base) gone; what remains is the severity chips
    ("Legitimacy crisismajorcatastrophic", 14 lines / 219 towns): item 5's STOP.
  - kind b, DS-DEF-1 strong v1 "reads as a defended place from the road in" under a siege: 2 towns at base, 7 at
    87d361dae (L1's move). CURED: the line carries "under siege"; under a siege every strong line is struck and the
    posture says nothing. 24 lines leave on the defence reader's 1,440, each that line under a siege.
  - ServicesTab.jsx: kind d 1 line ("Needs Trade access + grainNo trade access: … · covers …") and kind f 25 lines /
    716 towns (catalogue ranges in house labels) at base and tip alike: named (item 14; the label leaf is R2-CODE-B's,
    for the join).
- Its limits, beside any zero: the dossier's views only; it cannot see two lines of a page disagreeing.

## STATUS, LINE BY LINE (at hand-back; the chair's context check of 22:10 UTC: this seat hands back here)

| row(s) | status | commit |
|---|---|---|
| #185 HIGH, #323 #378 #465 #719 #956 #1177 #1391 (REQ/FORCED, b1) | DONE | f19e75e41 |
| #816 (Underworld band) | DONE | 17637e1b2 |
| #1104 (event category word) | DONE | 18d7fa48e |
| #494 #1317, increment #867 (Foundations Food) | DONE | 712db076f |
| round two #329 #858 (trade row under a siege) | DONE | 46e5c1002 |
| #486 #487 #592 #593 #743 #744 #1422 #1423, H9 #ww-466/467/530/531, #ww-468, #ww-569 (severity chips, b2) | STOP: the record holds a range, no value (item 5); needs the chair's ruling | — |
| #488 #594 #845 (founding Origin) | STOP, named: narrativeData.js pool (lane ra) | — |
| #571 HIGH, #916 (founder "a miller who …") | STOP, named: narrativeGenerator.js (held by r2-code-a, w2-b-declare, w2-fix-data, w2-write) | — |
| #34 #75 #103 #137 #184 #226 #290 (food endurance), #575 (Legal Infrastructure) | STOP, named: defenseDisplay.js (wc) | — |
| L0 (classes A, B) | DONE | 2ac3fa8c8 |
| L1 (classes K, E; D and the empty perimeter held by line disqualifiers) | DONE | aac97a657, 317f1e19c |
| L2 (classes A1, F) | DONE | f0adcd83a |
| L3 (C-L5) | DONE | e40e164ad |
| the wiring census re-taken, leaves projected | DONE | eaca79fcd |
| pins re-keyed, new tests made total (chrome floor, readsCount, anchors, seed loops) | DONE | fc2e15afd |
| the lighting census re-frozen | DONE | 66fd07e91 (re-freeze again at the final tip: no test file was added after it) |
| #1274 #1389 HIGH, #718 #817 #1174 #1082 (crime rows cut) | DONE | 87d361dae |
| #163 #427 #497 #891 HIGH (Services "Needs X" run-together, "· covers") | STOP, named: serviceComponents.jsx (R2-CODE-B; it cures the chip) | — |
| CENSUS-2 in this seat's files, base and tip | DONE (read, one cure) | 317f1e19c |
| THE FINAL STATEMENT | NOT STARTED (see below) | — |

**The reader's own instrument (classes3.py over render4.mjs) at the line with point 48 (9e57f5023, EXECUTED):**
A 151, A1 45, B 36, D 35, E 56, F 50, K 10, equal to this seat's `m5.mjs` + `m5cls.mjs` reading of the desk's own
output on the same 1,440 seeds. At the tip by `m5`: A 0, A1 0, B 0, D 0, E 22 (the badge itself, named), F 0, K 0,
L3 0, the empty perimeter beside a force 0. The render4 run at the tip was IN HAND at hand-back (not finished): a
successor re-runs `render4.mjs` + `scan4.mjs` + `classes3.py` (lane/review-upkeep-2026-11-13) at the final tip for the
acceptance figures by the reader's own instrument.

**The final statement, NOT STARTED** (a successor does it at the final tip): the census counter base aac79b808 against
the final tip (done once at 46e5c1002: 26 rows all OLD, the counter re-run outside its pipe, exit 0, 50 lines); the
births at every tip measured so far are byte-identical to the base (no display change here moves a record); ONE draft
shift record naming the six golden surfaces (expected unmoved: every change is a read-time display or desk line; the
dossier-prose manifest's three reds were red at the base too, by the pre-run below); the whole suite once at the final
tip, reds classed; the lighting census re-frozen if a test file is added; the edge bundles (`npm run build:edge-shared`)
checked last.
- A PRE-RUN of the whole suite at 38f49e420 (before point 48; not the final statement): 13 files red. Red at the base
  too (aac79b808, by a targeted re-run): dossierProseManifest (3), proseFamilyContract.walker (5). This lane's own,
  since cured: sovereigntyLightingContract (re-frozen), phoneChromeFloor (re-recorded), negativeAssertionAnchor and
  seedLoopTotality (the new tests). NOT CLASSED (a successor re-runs them at base): siteCoherenceRatchet,
  undercitySewerDerivation, foundingWorldBones, stressSummaryName, landingFixtureFreshness (2).
- A push hazard seen here: one push of a lane branch (`git push origin lane/r3-tabs-2026-11-13`) ran the WHOLE
  `npm run check` in the pre-push hook instead of the three fast gates; the next push used the explicit refspec.

**Helpers** (copied to docs/chair/2026-11-13/probes/R3-TABS/): births.mjs (the census's 720, the reader's 20 and the
144 `r3t-` fresh seeds, app shape), m4.mjs (the threat/posture rows, tree A against tree B), m5.mjs + m5cls.mjs (the
desk's rows on the defence reader's 1,440 and classes3's patterns), mycount.mjs (this seat's page patterns on census
dumps), c2mine.mjs (census-2 hits by this seat's files).

---

# THE SECOND SEAT (R3-TABS-2, 2026-11-13)

Read the lane's tip back from origin at the start: **fdfd471d9**, unmoved. Worked in a scratch worktree on a local
branch at that tip (`npm ci` there); every measurement after the cure is of a COMMITTED sha in its own `git archive`
(the counts of a run whose tree I touched mid-run were checked against the first seat's own figures: equal).

## The rulings this seat works to (the chair's assignment, copied: the chair's messages are not on the branch)
- **The severity chips (item 5 and item 15's H9): A RANGE IS NOT A RATING.** Where the record holds more than one
  severity for a tension, NO severity word prints for it: on the History tab's row, in the PDF's text, in the Foundry
  journal and in any export that prints it (every surface counted before and after). One severity prints that one word
  as now. Nothing is chosen for the reader, not the worst, not the least. The row's border colour and the sort order
  are left exactly as they are, and NAMED here for the owner's veto. The generator's unresolved range is NAMED for the
  seat after the merges (resolve at birth as an event's severity is: a declared move, not this seat's). Display only:
  births byte-identical. Measured first on the 720 and the first seat's three towns, red first; a guard that reds on two
  severity words printed for one tension on any rendered surface; ten rows read across tiers, a siege among them. A line
  of the PDF or the journal in a file another lane holds is ONE condition there, named as shared.
- **The command's rule (record 403)** after item 1: CENSUS-2's `census2.sh` at the tip with `--files` the lane's files;
  every hit in them read against its town, cured or named; the count per kind at base and tip; its limits beside any zero.
- **The lane's ONE final statement** at the final tip, as the first seat's last section lists it.
- **Not this seat's** (passed on by the chair): the Services tab's "Needs X" and "covers" (serviceComponents.jsx,
  R2-CODE-B); the founding "Origin:" (#488 #594 #845) and the founder line (#571 #916) (round two's first code lane);
  the food endurance line and "Legal Infrastructure · Court only" (#575) (defenseDisplay.js); a house's name on these
  tabs (the label leaf; FOR THE JOIN stands as written).
- The method for every line written (records 386, 387, 404); the page shows the ratings, never the machinery; no new
  record key, no new vocabulary word; a claim of zero counted on every surface; a count falling is not a cure.

## Item 1 (the first seat's 5 and 15/H9) — the severity chips — DONE (b2682f748, d6b0526cb)
- **Lines:** the cut's #486 #487 #592 #593 #743 #744 #1422 #1423; the increment's HIGH #ww-466 #ww-467 #ww-530 #ww-531,
  #ww-468, #ww-569; CENSUS-2 kind d "Legitimacy crisismajorcatastrophic" / "Succession Crisisminormajor".
- **The surfaces that print a tension's severity** (traced by every reader of `history.currentTensions`): the History
  tab's `TensionRow` (also mounted by the dossier search, `DossierSearchResults.jsx`); the PDF's Overview
  ("Tensions & Conflicts" Pill, through `viewModel.js :: normSeverity`, joined "minor / major"); the PDF's History
  ("Live tensions" Pill, the raw list, run together). The Foundry journal prints none (its Power page drops it by
  design; the timeline packet writes no journal pages at all); the Tonight sheet composes none; the world export and
  the AI prompt carry the record's array as DATA (not a printed word; `supabase/functions/generate-narrative/prompts.ts`
  hands it to the model): NAMED, not touched.
- **The cure, display only:** `HistoryTab.jsx :: TensionRow` prints one chip for one severity, none for more than one;
  `HistoryFounding.jsx :: TensionRow` prints no Pill for a range (the condition `isSeverityRange` at the file's end, so
  no line above moves: the prose-numerics register keys this file by line, row 382); `viewModel.js :: normSeverity`
  returns null for a range (it joined "a / b"). **SHARED:** `src/pdf/lib/viewModel.js` is held by
  lane/coherence-upkeep-2026-11-12 and lane/upkeep-capacity-2026-11-13 (their hunks there do not touch normSeverity):
  ONE condition in it. `HistoryFounding.jsx` and `HistoryTab.jsx` are held by no other lane.
- **NAMED for the owner's veto, left exactly as they were:** the History row's border colour (the worst of the range:
  `maxSev` in `TensionRow`) and the PDF row's tone; the dossier search's sort (`dossierSearch.js :: severityRank`, the
  worst of the range).
- **NAMED for the seat after the merges:** the generator's unresolved range: `historyGenerator.js :: buildHistoricalEvent`
  copies the template's `severity` list onto a tension, where an event's is `pick(eventTemplate.severity)`. Resolving it
  at birth is a declared move of the births (a signed shift); the tab then prints that one word.
- **Red first:** `tests/components/tensionSeverityOneWord.test.jsx` on the first seat's three towns
  (rr2s-town-under_siege-rand-1, rr2s-city-calm-rand-1, rr2s-metropolis-plague_onset-port-1): reds on two severity
  words printed for one tension on the tab, each ranged row, the PDF (canon, draft, timeline) and the journal (canon,
  draft); a one-severity tension prints its one word. At fdfd471d9: 10 of 16 red (tab, row and PDF in all three towns;
  the view model's join); the journal green (it printed none). At b2682f748 and d6b0526cb: 16 of 16 green.
- **Counted on every surface, base fdfd471d9 against tip b2682f748** (`probes/R3-TABS/sevcount.mjs`; the census's 720
  plus the three towns; the PDF, journal and Tonight by REVIEW-R2-STAGES's own `surfaces.sh` on the same records; the
  page by CENSUS-2's render of the 720):

| surface | range lines at base | at tip | one-severity lines base → tip | any other line moved |
|---|---|---|---|---|
| History tab (page, the 720) | 1,089 lines / 653 towns | 0 | unchanged (no other line differs) | none |
| PDF canon dossier (723) | 2,190 / 656 towns | 0 | 5,106 → 5,106 | none |
| PDF draft brief (723) | 2,190 / 656 towns | 0 | 5,106 → 5,106 | none |
| PDF timeline packet (723) | 0 | 0 | — | none |
| Foundry journal canon, draft (723) | 0 | 0 | — | none |
| Tonight sheet (723) | 0 | 0 | — | none |
| CENSUS-2 kind d, run-together severity (720) | 146 hits / 144 towns | 0 | — | kind d 277 → 131 hits, exactly −146 |

  On the page, 1,060 of the 1,089 lines now read the tension's label alone; the other 29 fold into a label line the
  town already prints (the dump keeps each distinct line once a view: two ranged tensions of one type).
- **Read where they print** (the tip's page against the record), ten towns across every tier, three sieges, a famine and
  an occupation among them: r2r-thorp-5 "External threat" (record major/catastrophic); r2s-under_siege-hamlet-1
  "Resource Scarcity", "Occupation Legacy"; r2r-village-7 "Crime Wave" (minor/major) and "Trade collapse · major"
  (record ["major"]: the one word, as before); r2s-under_siege-town-2; r2r-town-14 "Guild Conflict"; r2s-famine-city-0;
  r2r-city-22 ("Wild magic", "Guild Conflict", "External threat"); r2s-occupied-metropolis-1 ("Occupation Legacy",
  "Plague years"); r2r-metropolis-9 (three); r2s-under_siege-metropolis-3. Every ranged row prints its label and its
  description and no severity word; every one-severity row prints its word. True in each town by its record.
- **The governing files** (85: every test file naming HistoryTab, HistoryFounding, the view model, SettlementPDF or the
  search results, plus the two chrome-floor censuses) at the tip: 83 green; `proseNumerics` red at b2682f748 (row 382
  moved to 386) and cured by d6b0526cb without moving the register; `dossierMountRegistry.walker` › "THE SHIPPED TABLE"
  red with byte-identical failure text at fdfd471d9: not this lane's.
- Births: no generator file is touched (three display files); the field diff is in the final statement.

## Item 2 — the command's rule (record 403): CENSUS-2 in the lane's files, base, line and tip — DONE (read; nothing to cure)
- **Run** (`census2.sh` from origin/lane/census-2-2026-11-13 at 2686272b1, unchanged, 4 workers; `--files` the first
  seat's six files, the corpus file the desk draws from, and this seat's `HistoryFounding.jsx`, `viewModel.js`), each
  stage's own exit read (census2 exit 0 every run; births 720 errors 0; 720 of 720 dumps): at the lane's base
  **aac79b808**, at the line **9e57f5023** (point 48, merged into the lane by de0872aa5) and at the tip's code
  **b2682f748** (d6b0526cb changes only `src/pdf/sections/HistoryFounding.jsx`, which no dossier view imports: the
  dossier's views are the same tree's). The first seat's base out-dir was gone: the base was re-run, not reused. Every
  run in a git worktree of its sha (the writer trace is `git grep`; an archive traces nothing).

| kind | base aac79b808 | line 9e57f5023 | tip | the lane's own commits |
|---|---|---|---|---|
| a | 3,693 hits / 712 towns / 612 lines | 3,692 / 712 / 611 | 3,692 / 712 / 610 | 0 (two untraced hits re-traced to HistoryTab) |
| b | 215 / 70 / 101 | 215 / 70 / 101 | 213 / 70 / 100 | −2 (DS-DEF-1 under a siege, 317f1e19c) |
| c | 764 / 291 / 298 | 817 / 301 / 298 | 817 / 301 / 298 | 0 (the rise is the line's: `power.generated.js` 77 → 130 hits, point 48) |
| d | 523 / 382 / 40 | 523 / 382 / 40 | 131 / 105 / 37 | −392 (FORCED, b1; the run-together severities, item 1: 146 → 0) |
| e | 61 / 60 / 20 | 61 / 60 / 20 | 47 / 46 / 18 | −14 (L0) |
| f | 12,832 / 720 / 344 | same | same | 0 |
| g | 3,373 / 720 / 14 | same | same | 0 |
| h | 64 / 20 / 63 | same | same | 0 |

- **The rising row, kind c (+10 towns, base → tip):** origin in the line (point 48: W2-A-LEAVES's DS-POW crime desk,
  `power.generated.js`), equal at the line and the tip by the census's own count; not this lane's: DECLARED exposure of
  the merge, no stop.
- **Every hit in the lane's files at the tip, read against its town:**
  - `HistoryTab.jsx :: TENSION_META` kind a, 2 towns, "Guild Conflict" (r2r-hamlet-43, r2r-village-12): untraced at
    the base as "Guild Conflictminormajor"; traced now the chips are gone. FALSE in both towns: a guild_conflict tension
    ("Rival guilds fought over who may sell what…", parties "Established guilds | Upstart guilds") drawn where the
    roster holds no guild. The label is the tension's own type; the draw is `historyGenerator.js` / `historyData.js`
    (held by fd). NAMED, not cured (the row is true wherever a guild stands).
  - `ServicesTab.jsx` kind f (716 towns / 25 lines) and kind d (1 town / 1 line, "Needs Trade access + grainNo trade
    access: … · covers …"): equal at base, line and tip. NAMED: the label leaf and `serviceComponents.jsx` (R2-CODE-B),
    the first seat's item 14.
  - `defense.generated.js` (the corpus, held by wc, fd, wr), every desk but DS-DEF-1, equal at base, line and tip:
    - kind a 45 towns / 41 lines: DS-DEF-5 "ARCANE: alchemists" v1/v2 (38 towns; "The magical help at Vishnumala comes
      from its alchemists", r2r-city-48, whose roster holds an apothecary district and a hedge wizard, no alchemist):
      the cell is keyed by the record's flags `economicState.compound.inst.hasAlchemist` /
      `defenseProfile.traditions.hasAlchemy` (`defenseStateProse.js :: arcaneFixturePoolKey` reads them as written):
      the flag is the generators' (the defence lane's); DS-DEF-2 "full legal chain" "the court's lists" with no court
      (5); DS-DEF-3 Safe v2 "enforcement keeps it down" with no force (1); DS-DEF-2 CHAIN v3 "workshops" (1).
    - kind b 7 towns / 3 lines: DS-DEF-2 "no legal infrastructure" "order is kept by whoever is armed" under an
      occupation (5); DS-DEF-2 CHAIN v2 "busy and well stocked" under a famine (2).
    - kind c 53 towns / 9 lines: "streets" in thorps and hamlets (DS-DEF-3 Moderate v3, 26; active siege v1; slave
      revolt v2; DS-DEF-4 semi-organized v3), "districts" (DS-DEF-3 insurgency v1/v3, political fracture v1/v3),
      "crowds" in a hamlet of 60 (DS-DEF-8 migration v1).
    All read true faults by the census's own fact; none is DS-DEF-1 (the posture this lane's rulings covered); the
    variants are the corpus lane's and the cells' keys the desk's. NAMED, not cured (no ruling reaches them; no adjacent
    repair).
- **The first census's counter**, run on the same dumps (its render is census-2's walk with the seed map moved; the 720
  seeds and configurations identical), outside any pipe, its own exit read (exit 0 at base, line and tip; stderr empty;
  counts.txt 50, 50, 47 rows: the three absent at the tip are rows at zero), `compare.mjs` base → tip: 26 rows, no WORSE,
  no NEW; BETTER row 9 "Critical over reassuring text" 148 → 114 (this lane's: equal base → line, 148 → 114 line → tip)
  and row 20 "siege text, no siege" 689 → 0 (the line's: 689 → 0 base → line); every other row OLD.
- **Its limits, beside every zero above:** the dossier's views only (no PDF, journal, export, Tonight); it cannot see two
  lines of a page disagreeing; a hit is a candidate until read.

---

# THE THIRD SEAT (R3-TABS-3, 2026-11-14)

The chair is now the Claude Code session session_01ACmDYZrFEVXyZEUg1NDxxC (the program moved accounts on 2026-11-14;
every earlier session is ended). The assignment is the chair's file `docs/chair/2026-11-14/briefs/BRIEF-R3-TABS-3.md`
on lane/chair-2026-11-08: BRIEF-R3-TABS-2 binds as written with that file's changes. Read the lane's tip back from
origin at the start: **a19a0ee1b**, as the brief has it. Worked in a scratch worktree on a local branch at that tip
(`npm ci` there); the base, the line and 2dc3fe61b measured in integrity-counted `git archive`s of their shas.

## The rulings this seat works to (the chair's file, copied: the chair's messages are not on the branch)
- The second seat's brief binds as written (its reading, work, method, hazards, authorities and prohibitions); point
  49 is not on the line: work that waits on it waits. NEVER: a push to any other branch, `--no-verify`, a force
  push, a push with nothing to send, a pull request, master, a golden's door in its writing mode, a deploy, a hosted
  database or production credentials. Never rewrite a commit at or below a19a0ee1b. No adjacent repair.
- The order: 0 this hand-back (the naval cure, by its four bodies and this seat's own run); 1 the final statement's
  parts that need no suite; 2 one message to the chair, then wait for point 49; on the chair's word the merge of the
  line's tip, the instrument's page census, the whole suite once in six vitest shards with every red classed against
  the base, the lighting census, the edge bundles, the lane's ONE final statement.
- **THE COUNT, changed by the chair's message (2026-11-14, read at 02:35 UTC):** the mark is 400,000, not 350,000, and
  the check is AFTER EVERY ITEM, never more than forty-five minutes apart. At a hand-back this file says WHAT IS LEFT line
  by line and how the instruments are re-made, so a successor opens only this part.
- The naval cure was made to record 422 (CHAIR-HANDOFF-FOURTH §4): "A line of the sea or a harbour's approaches is
  offered only where the route is the sea, on every surface (the defence desk's pool key too)."

## The first act: where the second seat stopped (EXECUTED: every commit after fdfd471d9 read against this file)
b2682f748, d6b0526cb (the severity chips; this file's item 1), 58a7b6484, 76641edaf, 2dc3fe61b (item 2), then the naval
line 9f95d404c and its three register commits 02a539072, 96c822457, a19a0ee1b, recorded only in their bodies until
now. No stop and no question to the old chair stands without its ruling copied in: the chips are ruled (407, item
1); the Services, Origin, founder, endurance and Court rows are passed on (BRIEF-R3-TABS-2, WHAT IS NOT YOURS); the
naval line is record 422. So no first message was sent.

## Item 0 — the naval line (9f95d404c and its registers), written up from its bodies and this seat's own run — DONE
- **What it changed:** `defenseStateProse.js :: defenseSupportingProse` keyed DS-DEF-6's naval rung
  (`navalDefensePoolKey`) by the roster's docks (`compound.hasPort`) and the navy flag, not by the route, so river
  towns drew lines of the sea. The port and navy flags now also need `seaRoute`: `tradeRouteAccess` 'port' and
  `waterAccessKind` maritime; a record with no config reads as before (A-11). `navalDefensePoolKey` is unchanged.
  Registers by their doors: the wiring census's stamp on the composer re-taken (02a539072: only the stamp moves; no
  pool, row or reading); the wiring-census walker's measured figures re-keyed by identity to the first seat's L1 and
  L2 with their causes (96c822457: the walker was 11 red at the lane's tip since eaca79fcd, green at the line; the
  naval cure moves none of its figures); the lighting census re-frozen for the guard file (a19a0ee1b: 3253 -> 3254).
- **Its measure on the 720, by this seat's own run** (`probes/R3-TABS/naval.mjs`: the desk's own output, tree
  2dc3fe61b against the tip, on the census's 720 and the 144 fresh births, born in the app's shape): the 720 lose 57
  naval lines, every one off a route that is not the sea (56 river, 1 crossroads), all `Naval Defense: Port only`;
  the 48 sea ports keep theirs WORD FOR WORD; no line gained or reworded; the logistics rung unmoved on every birth.
  The fresh 144: 6 lost (5 river, 1 crossroads), the 40 sea ports keep theirs. EQUAL to the commit body's figures.
  NAMED, not touched: the cure's own docblock says "61 river-route towns of the 720 and the 144 fresh births"; by
  the body and by this run it is 57 and 6 (63), 2 of them crossroads. A comment only; rewording it moves the
  wiring census's stamp on the composer, so it is left for the corpus lane's next pass over the file.
- **Its guard green:** tests/domain/defenseNavalLineReadsRoute.test.js 5 of 5 at the tip (with the lighting census,
  the wiring-census walker and the projection contract: 197 of 197).
- **The lane's governing suites at the tip** (every test file naming any src module the lane's own commits change:
  DefenseTab, HistoryTab, SubstrateTab, defense.generated.js, defenseStateProse, postureLineDisqualifiers, viewModel,
  HistoryFounding; 134 files): at a19a0ee1b **133 green, 1 red**: `dossierMountRegistry.walker` › "THE SHIPPED
  TABLE": "defense.publicOrder: the row declares visibility 'closed-section' and every host that encloses it is open
  on first paint — a stale exemption". CLASSED BY EXECUTION: green at the base aac79b808, the line 9e57f5023, the
  lane's merge de0872aa5 and 66fd07e91; red from **87d361dae** (the first seat's crime-rows cure) on. The second
  seat had classed it "not this lane's" against fdfd471d9, which is a lane commit: it is this lane's. CURED by
  **6ed610479**: `DefenseTab.jsx :: wholeSentencesWithin` spelled its closing quotes bare in a regex literal, which
  the walker's source scan reads as a string opening (so it lost the fold's `defaultOpen={…}` host); the literal now
  spells them `\x22` `\x27`, the same regex (old and new give the same matches on all 3,432,667 strings of the 884
  births' records: 0 differ; `probes/R3-TABS/crimeeq.mjs`). After: the 44 files naming DefenseTab or the mount
  registry 1,146 of 1,146 green; the registers' and the crime guard's 223 of 223; the gates at the ceiling (1113,
  167, eslint 0). NAMED, not touched: the walker's scan reading a quote inside a regex literal as a string.
- **The births at the tip byte-identical to the base** (sha256 of the decoded ndjson, `probes/R3-TABS/births.mjs` at
  aac79b808 and a19a0ee1b): census 720 a65d30b2…, reader 20 2997a853…, fresh 144 666d7793…, each equal at both and
  equal to the first seat's own figures. Every change of the lane is a read-time display or desk line.

## Item 1 — the final statement's parts that need no suite, at the tip e43bacae8 (the code of 6ed610479) — DONE
Every tree an integrity-counted `git archive` of its sha (aac79b808 9124 files, 9e57f5023 9175, e43bacae8 9200: tree
and files equal), `node_modules` linked from the worktree's `npm ci` (package.json and the lock are byte-identical
from the base to the tip). Helpers and outputs in `probes/R3-TABS/reader/`.
- **The first census's counter, base aac79b808 against the tip** (SECOND-WAVE-CENSUS `census.sh` from
  origin/lane/second-wave-census-2026-11-12, unchanged, 4 workers; then `count.mjs` RE-RUN OUTSIDE THE SCRIPT'S PIPE,
  its own exit read): census exit 0 and counter exit 0 at both; stderr empty at both; the direct output equal to the
  piped `counts.txt` at both (50 rows at the base, 47 at the tip: the three absent are rows at zero); every render
  shard 180 of 180, 720 of 720 dumps. `compare.mjs`: 26 rows, **no WORSE, no NEW**; BETTER row 9 "Critical over
  reassuring text" 148 → 114 (this lane's) and row 20 "siege text, no siege" 689 → 0 (the line's, point 48); every other
  row OLD (5a 288 → 285, 5b 2 → 0, 13 172 → 170 within OLD). Equal to the second seat's reading.
  Its limits beside the zeros: the dossier's views only; it cannot see two lines disagreeing; a hit is a candidate.
- **The naval line on the page, by the same dumps** (the 57 towns of item 0 and the sea ports, the desk's sentence
  looked up in each town's rendered page): the 57 off-sea lines print on the base page and on no tip page; 47 sea
  ports print theirs at both; one sea port, r2s-politically_fractured-town-1 ("Ásstrand"), prints its line at the tip
  and not at the base: L3's cure (e40e164ad, a name opening on Á), true of a sea port.
- **The births byte-identical to the base:** sha256 of the decoded ndjson (`probes/R3-TABS/births.mjs`, the census's
  720, the reader's 20, the 144 fresh, the app's shape) at aac79b808, a19a0ee1b and e43bacae8: census a65d30b2…,
  reader 2997a853…, fresh 666d7793… at all three; 884 of 884 births, 0 errors at each.
- **The reader's own instrument** (`render4.mjs` + `scan4.mjs` of REVIEW-UPKEEP-3 and `classes3.py` of
  REVIEW-UPKEEP-2, from origin/lane/review-upkeep-2026-11-13, unchanged; the 1,440 rv2/rv3/rv4 seeds, `seeds.all.txt` +
  `fresh.seeds` + `own.seeds`, the app's shape; render 4 shards, each exit 0; 1,440 of 1,440 dumps and scan rows):

| class | the line 9e57f5023 | the tip e43bacae8 |
|---|---|---|
| A nobody on the walls beside a force | 151 | **0** |
| A1 nobody on the walls beside a Strong invasion bar | 45 | **0** |
| B no line and no force beside a force | 36 | **0** |
| D an untroubled posture under a siege or war | 35 | **0** |
| E all but undefended beside walls and a force | 56 | **22** |
| F could not hold off a raid beside a Strong invasion bar | 50 | **0** |
| K Defensible beside a cannot-hold posture line | 10 | **0** |
| (B1, not an acceptance class) no line and no force beside Adequate/Strong | 3 | 1 |
| (C, C0, not this lane's: the pay lines) | 65, 65 | 65, 65 |

  (scan4's `parts` field reads `defencePartsOf is not a function` on every row at both trees: that export is not on
  the line; classes3 does not read the field.)
  **The 22 left in class E**, every one with the readiness badge "Undefended": the posture line now reads the badge (L1),
  and the BADGE itself reads Undefended beside walls and a force: rv2-famine-hamlet-34, rv2-famine-hamlet-36,
  rv2-famine-town-25, rv2-famine-village-30, rv2-succession_void-thorp-19, rv2-under_siege-hamlet-33,
  rv2-under_siege-thorp-13, -thorp-2, -thorp-32, -thorp-36, -thorp-38, rv2-under_siege-village-26, -village-34,
  -village-36, rv3-famine+wartime-town-1, rv3-occupied-village-0, rv3-under_siege+plague_onset-town-2,
  rv3-under_siege-village-0, -village-2, rv4-famine-hamlet-0, rv4-under_siege+famine-town-0, rv4-under_siege-thorp-0.
  **Their holder:** `src/generators/defenseGenerator.js :: computeDefenseReadiness` (the readiness score is the sum of
  the defence parts, COHERENCE-UPKEEP-5's 82c639b44), held by **lane/coherence-upkeep-2026-11-12** (the defence lane;
  21 of its own commits on the file, not on the line; lane/upkeep-capacity-2026-11-13 carries the same 21; no other
  lane read here has a commit on it). NAMED for the join (FOR THE JOIN: the badge's 22 "Undefended").
- **ONE draft shift record:** `docs/chair/2026-11-13/R3-TABS-SHIFT-RECORD-DRAFT.md`. The six surfaces, each suite run at
  the base, the line and the tip with no update flag: generator golden master, espionage fence, PDF golden, Herald
  desk golden and preset-lighting witness **UNMOVED** (green at all three); the **dossier prose manifest MOVED by this
  lane**: red with the same three titles at all three, the line's output equal to the base's, and at the tip the drift
  tally and list move (golden-master-v3 −250 cells: L0 −174, L2 −2, the naval cure −74; the gm seeds −8/−6/−6; the drift
  arm's moved rows 1,036 → 1,050, at L0), attributed by running the suite in an archive of each desk commit. This
  CORRECTS the first seat's expectation ("expected unmoved"): by measure it moves. The re-record is the merge seat's,
  through the manifest's door.

## STATUS (the third seat, after item 1)
| part | status | where |
|---|---|---|
| the first act (where the second seat stopped; no open question) | DONE | this section |
| item 0 the naval line written up, its measure, its guard, the governing suites, the births | DONE | 6ed610479 (the lane's mount-walker red cured), e43bacae8 |
| item 1 the census counter, the births, the reader's classes, the draft shift record | DONE | this commit |
| item 2 the merge of point 49, the page census, the whole suite in six shards, the lighting census, the edge bundles, THE FINAL STATEMENT | IN HAND (see Step 2 below) | — |

## How this seat's instruments are re-made (for a successor)
- Trees: `git archive <sha> | tar -x -C <dir>` outside the repository, `ln -s <a worktree after npm ci>/node_modules <dir>/node_modules`
  (the lock is byte-identical base to tip); count `git ls-tree -r <sha> | wc -l` against the files.
- The instrument lanes, extracted unchanged: `git archive origin/lane/second-wave-census-2026-11-12 docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS`,
  `origin/lane/review-upkeep-2026-11-13 docs/chair/2026-11-13/probes/REVIEW-UPKEEP-2 …/REVIEW-UPKEEP-3`, `origin/lane/review-r2-stages-2026-11-13
  docs/chair/2026-11-13/probes/REVIEW-R2-STAGES` (seeds20.txt) into one directory outside the repository.
- `probes/R3-TABS/reader/run-census1.sh` (census.sh per tree, then count.mjs outside its pipe), `run-reader.sh <tree>…` (render4 in four
  shards, scan4, classes3; the 1,440 seeds are REVIEW-UPKEEP-2 seeds.all.txt + fresh.seeds + REVIEW-UPKEEP-3 own.seeds); paths inside are
  this container's (/home/user/wt/<tree>, /home/user/inst, /home/user/runs): edit them to yours. `probes/R3-TABS/naval.mjs <pre> <tip> <out> <births.gz>…`;
  `births.mjs` (TREE, OUT, SET, SEEDS). Census ~17 min a tree, render4 ~12 min a tree, on 4 cores.

## The chair's word for step 2, and its hazards (copied: the chair's messages are not on the branch)
- 03:08 UTC: "POINT 49 IS ON THE LINE: lane/integration-2026-11-07 = 976db5b19 … merge the line's tip as you read it back
  (a plain merge; say which commit and what conflicted; a register that conflicts is taken from one side and re-derived
  through its own door)." Then the merge's own registers and the whole suite's six shards; then the page census on the
  lane's lines by section 2m's doors, the classing, the lane's ONE final statement. "Your draft record's note that the
  prose manifest MOVED on this lane stands: it is the merge seat's to re-record."
- 03:18 UTC: section 2m of the merge book is pushed (lane/merge-15-point-49-wip-2026-11-14 d893d9289,
  docs/INTEGRATION_STYLE_2_2026-11-09.md, "## 2m. FOR EVERY LANE THAT MERGES THE LINE AFTER POINT 49"): run every
  check it lists right after the merge; a lane NEVER banks a row by hand, raises a row a door refuses, widens an
  exemption, skips a test, loosens a pin or routes round a door's refusal.
- HAZARD (03:15 UTC): a shallow clone can give a WRONG merge base, not a missing one. Deepen
  (`git fetch --depth=2147483647 origin lane/integration-2026-11-07 lane/r3-tabs-2026-11-13`), then
  `git rev-parse --is-shallow-repository` false and the base of 7239ac754 with the line 9e57f5023.
- HAZARD (04:37 UTC): a push with NOTHING TO SEND falls into the pre-push hook's whole suite, whose
  implementationPackets/implementationSession tests run git against the real repository from a linked worktree (the
  branch moved to a fixture commit, core.bare=true, a fixture user in the shared config). Before every push:
  `test -n "$(git rev-list origin/<branch>..<local>)"`, else no push; never chain a push after a step that can fail.

## Step 2 — after point 49 (EXECUTED)
- **The merge:** 841945a26, a plain merge of the line's tip **976db5b19** (read back from origin at 03:08 UTC, 100
  commits past 9e57f5023) into the lane at 7239ac754. Two conflicts, both registers, NO CODE:
  `docs/content/wiring-census.json` (one figure) and `tests/lint/.lighting-census-baseline.json` (the tuple), each
  taken whole from the line's side and re-derived through its door: the wiring census by `node
  scripts/wiring-census.mjs` (cd63653bf; the composer's stamp and the lane's L1/L2 figures return; `--check` and the
  prose leaves' `--check` exit 0), the lighting census by LIGHTING_CENSUS_REFREEZE on the clean tip (2903e2143; files
  3245 -> 3257, the lane's 12 test files). lint-staged on the merge changed nothing (every path that differs from the
  line is a lane file equal to the lane's tip). Checked after the chair's hazard: the clone deepened to full history
  (not shallow), the base of 7239ac754 with 976db5b19 is 9e57f5023, and `git merge-tree` with full history names the
  same two files and nothing else.
- **Section 2m's checks right after the merge** (each command's own exit): presumed things `--check` exit 0 (fresh 0,
  stale 0; strips fresh 0, stale 0); fact layers 0 rises, 0 falls; writer reach exit 0; observed shapes exit 1, an
  execution INPUT changed (the lane's `defense.generated.js`): classed and re-frozen below. The tuning inventory walker
  is green in the suite (no dependent of a tuning table among the lane's files).
- **The whole suite ONCE at 2903e2143, in vitest's own six shards** (`--shard=<i>/6 --maxWorkers=3`, each through
  `scripts/gate-mutex.sh --run`, each to its own file outside the tree; refs and the local config snapshotted before and
  after: unmoved but for this seat's own fetch): 3,257 files (= the lighting census), 39,110 passed, **15 failed in 10
  files**, 145 skipped. Every red classed BY EXECUTION at the base aac79b808, at the line 976db5b19 and at the lane's
  pre-merge tip 7239ac754 (archives, or detached worktrees where the test reads git), failure text compared with paths
  and timings folded:

| red at 2903e2143 | base aac79b808 | line 976db5b19 | lane 7239ac754 | class | cure |
|---|---|---|---|---|---|
| observedShapeReaders.walker (1: the provenance drift classifier) | — | green (check exit 0) | red (check exit 1) | THE LANE'S (eaca79fcd's readsCount lines change an execution input) | b731c85e0: `--write` on the clean tip, provenance only; identities, inventory, totals unchanged |
| seedLoopTotality.walker (1: a bare seed loop, tensionSeverityOneWord.test.jsx line 93) | — | — | red (the lane's file) | THE LANE'S (b2682f748's test) | 3a497ef5e: the loop collects through `collectSeedFailures`; planted at 66fd07e91 it still reds 10 of 16 with true counts |
| proseCorpusBytes (1: defense.generated.js 234545 over 234445) | green | green | red | THE LANE'S (eaca79fcd: four `"readsCount": 1,`, 100 B) | f5622ab8f: one declared row by the register's own idiom (fromRaw 234453 → 234545, gzip 31738) |
| dossierProseManifest (3) | red, same titles | red, same titles | red | MOVED BY THE LANE (the draft shift record) | the merge seat's re-record (the chair's word) |
| siteCoherenceRatchet (1) | red, detail identical (added forest/plains mountain-flank iron) | red, identical | red, identical | NOT THE LANE'S (one of the first seat's five, classed) | — |
| landingFixtureFreshness (2) | red, identical | red, identical | red, identical | NOT THE LANE'S (one of the five) | — |
| foundingWorldBones (1) | red, identical | red, identical | red, identical | NOT THE LANE'S (one of the five) | — |
| proseFamilyContract.walker (5) | red, identical | red, identical | — | NOT THE LANE'S (red at the base, as the first seat found) | — |
| newsHeadlineContract.walker (file: "Wizard News introductions drifted: expected 395, got 411") | red, identical | red, identical | red, identical | NOT THE LANE'S | — |
| newsVoiceContract.walker (file: the same drift) | red, identical | red, identical | red, identical | NOT THE LANE'S | — |

  The first seat's other two unclassed files: `undercitySewerDerivation` red at the base (1: the HONEST FOUNDING arm),
  green at the line and the tip (the line's cure); `stressSummaryName` green at the base and the tip.
  After the three cures: the walker, the seed-loop walker, the byte ratchet and every reader of their registers green
  at b731c85e0 (the observed-shape readers' eight files, the byte register's three; the lighting census and the
  ranged-tension test 59 of 59).
- **The page census on this lane's lines, by section 2m's door** (at b731c85e0: `node scripts/census/page-census.mjs
  --workers=3 --out=<outside the tree>`, the 720 of prefix r2): exit 0, "the banked corpus reads at or under the
  register", **no row ROSE**; `--grid` exit 0, 0 falls. Two rows FELL and were lowered by `--from=<that run> --shrink`
  in their own commit (268b26d8c): P9 148 -> 114, P13 172 -> 170. Every row's hits read for the lane's own surfaces
  (the Defense, History and Substrate tabs, the defence desk); each is CURED or DECLARED:
  - **P9 "a weak beasts grade over settled-country text", 114 towns: THE LANE'S DESK, DECLARED (a ruling for the
    chair).** The Beasts & Monsters row prints a DS-DEF-2 line drawn from the `Beasts & Monsters: settled, nothing
    organized` pool (`defenseStateProse.js :: defenseThreatProse`, the beasts lens) beside a bar of Weak or Critical
    (r2r-hamlet-1 "Divoino": "Beasts & Monsters: Critical" over "Whoever walks out of Divoino … meets nothing that
    would justify a watch"). The pool keys on the town's monster threat; the bar prints its READINESS for beasts.
    Both can be true (no beasts, and nothing kept against them), so the line is a two-homes question, not a false
    word the record contradicts. The lane lowered the row 148 -> 114 (its posture and threat cures); L2's ruling ("a
    row's sentence is drawn within the band its bar prints") was applied by the first seat to the Invasion row only
    (classes A1, F). RECOMMENDATION: the chair rules whether L2 reaches the Beasts row; if it does, the settled pools
    are struck under a Weak/Critical bar (the row then silent there: the corpus wrote no true pool for that cell),
    a declared move of about 114 towns' lines on the 720, for a later seat on this desk; not built here (no ruling).
  - **P10 "hold the gates" with no walls, 17 towns: DECLARED, not this lane's writer.** The Defense tab's force card
    prints the Town watch's catalogue description ("Part-time guards who walk the night and hold the gates.",
    `src/data/institutionDescVariants.js`, `src/domain/display/institutionVocabulary.js`) beside the tab's own
    "Unfortified. No perimeter walls." The description is the data's (held by w2-fix-data, 7 commits off the line,
    and the defence lane, 1, read at ~01:55 UTC); the card prints it raw (FOR THE JOIN: the house-label leaf).
  - **P7a and P7b (two founders; "no wharf" beside a port origin), 125 and 27 towns, on the History tab:** the
    "Origin:" row, passed on by the chair (round two A's pool, #488 #594 #845; the first seat's item 4). DECLARED.
  - **NEW1 "governance vs Defense", 11 towns:** the readiness badge's label beside the governance line
    (`computeDefenseReadiness`, the defence lane's). DECLARED.
  - Every other row's hits are other lanes' surfaces (food, powers, economy, magic, faith, people).
  Its limits beside the zeros: the dossier's views only; it cannot see two lines disagreeing unless a row names them.
- **The edge bundles, checked last:** `npm run build:edge-shared` at 5df403a1c, exit 0: every bundle's bytes and hash
  unchanged; only the six `*.meta.json` stamps (`generatedAt`, `builtFromCommit`) moved, so the bundles do NOT differ
  and nothing was committed (the rebuild's stamps restored). No `dist/` in the tree.

# THE LANE'S ONE FINAL STATEMENT (R3-TABS-3, 2026-11-14; the final tip 4b5539e75 + this commit; code at 268b26d8c)
EXECUTED unless marked. Every tree a committed sha (an integrity-counted archive, or a detached worktree where a test
or door reads git). The lane's base aac79b808; the line merged in at 976db5b19 (point 49).

| measure | base aac79b808 | the line 976db5b19 | the final tip 5df403a1c |
|---|---|---|---|
| births (census 720, reader 20, fresh 144; sha256 of the decoded ndjson) | a65d30b2… / 2997a853… / 666d7793… | 71d1f68d… / 2997a853… / 0a7713fa… | **equal to the line** (the lane moves no record; the line's points 48 and 49 move the base's) |
| the first census's counter (census.sh, then count.mjs outside its pipe, its own exit) | exit 0, 50 rows | exit 0, 47 rows | exit 0, 47 rows; stderr empty at all three |
| compare.mjs against the final tip | 26 rows: no WORSE, no NEW; BETTER 9 (148 → 114, the lane's) and 20 (689 → 0, the line's) | no WORSE, no NEW; BETTER 9 only (148 → 114) | — |
| the reader's classes (render4 + scan4 + classes3, the 1,440) A / A1 / B / D / E / F / K | — | 151 / 45 / 36 / 35 / 56 / 50 / 10 | **0 / 0 / 0 / 0 / 22 / 0 / 0** |
| the page census (section 2m's door, the 720) | — | banked by the line | at or under every row; no RISE; P9 and P13 FELL and are lowered (268b26d8c); the grid 0 falls |
| section 2m's other doors | — | — | presumed things fresh 0 stale 0; fact layers 0 rises; writer reach exit 0; observed shapes re-frozen (b731c85e0), then exit 0 |
| the whole suite, six vitest shards at 2903e2143 | — | — | 3,257 files, 39,110 passed, 15 failed in 10 files, 145 skipped; the lane's own three reds CURED (3a497ef5e, f5622ab8f, b731c85e0); the manifest MOVED (the shift record); the other six files red at the base with identical text |
| the six golden surfaces | — | — | five UNMOVED (green); the dossier prose manifest MOVED by L0, L2 and the naval cure (−250 cells on golden-master-v3; the seeds −8/−6/−6): the merge seat's re-record (`R3-TABS-SHIFT-RECORD-DRAFT.md`) |
| the lighting census | — | 3245 files | re-frozen 3257 (2903e2143); no test file added after it but the ranged-tension test's rewrite (no new file, no new title) |
| the edge bundles | — | — | unchanged (stamps only; not committed) |

- **The 22 left in class E** (the same 22 towns before and after the merge): the readiness badge itself reads
  "Undefended" beside walls and a force; the posture line agrees with the badge (L1). The badge is
  `defenseGenerator.js :: computeDefenseReadiness`, held by **lane/coherence-upkeep-2026-11-12** (the defence lane).
- **What this lane cured, every row** (the first seat's STATUS table and the second seat's items stand): REQ/FORCED
  (360/246 → 0 on the 720), the Underworld band (118 → 0), "Exile & Return" (622 → 0), the Foundations Food word (720
  → 0), the trade row under a siege (24 → 0), L0–L3 and the siege posture (the reader's classes above), the crime rows
  cut mid-sentence (339 → 0), the severity range (History tab 1,089 → 0; the PDF 2,190 → 0 per variant), the naval
  line off the sea (57 → 0 on the 720, 6 → 0 on the fresh 144); and the lane's own register reds after the merge.
- **FOR THE JOIN / for the chair, added by this seat:** P9 (the Beasts row's settled lines beside a Weak/Critical bar,
  114 towns: does L2 reach the Beasts row? a ruling); P10 (the Town watch's catalogue description "hold the gates" in
  17 unwalled towns: w2-fix-data's data, printed raw by the force card); the cure's docblock in
  `defenseStateProse.js` says 61 river towns where the measure is 57 + 6 (a comment, for the corpus lane's next pass
  over the file); the mount walker's scan reading a quote inside a regex literal as a string (tests/lint).
- **CONFIRMED vs PLAUSIBLE:** every count, exit, hash and classing above was run and read. PLAUSIBLE only: which
  lines make the manifest's −250 cells (attributed by commit, not read cell by cell).
- **Left:** nothing of this lane's assignment. The PR's merge, the deploy and the manifest's re-record are not this
  lane's.

# THE FOURTH SEAT (R3-TABS-4, 2026-11-14): the fresh reader's findings cured
The seat's brief: `docs/chair/2026-11-14/briefs/BRIEF-R3-TABS-4.md` on lane/chair-2026-11-08. The reader:
`docs/chair/2026-11-14/REVIEW-R3-TABS-2026-11-14.md` on lane/review-r3-tabs-2026-11-14 (NOT CLEAR at bb2bf91c5).
First act: the lane's tip read back from origin, 5f8602371, as the brief named it. Range: **bb2bf91c5..<the tip below>**.
EXECUTED unless marked. Instrument: the reader's 1,536 births (`probes/REVIEW-R3-TABS/births.mjs`, seeds1536.txt;
sha256 of the stream 391ab147… at the tip and at the line's tip 976db5b19, equal), every desk sentence by the tab's
own caller (`defenseDeskRead`) at each commit, diffed cell by cell; pages by the reader's `render.sh` (the real
OutputContainer, every tab opened) for the towns read.

## The rulings this seat worked to (copied; vetoable by the owner)
- **(a) F1, HIGH:** the strong posture pool is struck under an occupation, as under a siege or a war; and the reverse
  guard: no strong posture line beside a Weak or Critical Invasion & War bar; beside such a bar the posture draws no
  higher than the pool the line's tip 976db5b19 drew for the town.
- **(b) F3, MEDIUM:** a posture variant that names works is struck where the record holds no walls; one that names a
  watch on the approaches where it holds neither watch nor garrison. A line that names a thing reads the roster.
- **(c) F2 MEDIUM and F7 LOW:** the chair's earlier note WITHDRAWN: a watch is not the townspeople in arms and not a
  force that holds a perimeter. `militia || watch` leaves the citizen-militia key and the beasts row's held-perimeter
  lines. The watch-only town hears no sentence saying it has no force and none naming townspeople in arms; where no
  pool the key can select is true of it, the row's sentence is silent (the bar and its word print). FOR THE JOIN: the
  corpus owes a pool for "walls and a watch only" and "a watch only".
- **(d) F6, MEDIUM:** measure what (c) does first; then the supply line that says the defenders are well supplied is
  not drawn under a siege or a famine in force (silence), with a guard town each.
- **(e) F8, LOW:** plotHooks.js :: EVENT_LABELS takes History's two names, read where Plot Hooks and the PDF print.
- **(f)** F4, F5, F9, F10 not this seat's: FOR THE JOIN below.
- **The chair's added ruling (07:32 UTC, on this seat's own measure at F1):** a strong posture line beside the Guard
  assessment "exists on paper. Chronically underpaid and poorly equipped" is two places on one page that disagree;
  the strong pool is not drawn at that tier, read from the same fact the assessment reads (its tier, never its
  sentence); count 31 -> 0 with the line's own 9 among them.

## Each finding: cause, cure, counts, guard, plant, towns read
| finding | cause (lane commit) | cure | counts on the 1,536 | guard · plant that reds it |
|---|---|---|---|---|
| F1 | L1 + the disqualifiers (posture reads the badge; strong struck only under siege/war) | 44dc0d5f9 | strong beside Weak/Critical bar 2 -> 0; strong under an occupation 14 -> 0 (10 at the line); 33 of the 34 newly-v2 towns keep it | `tests/domain/defensePostureAgainstItsFacts.test.js` (red first at 5f8602371, 4 of 6) · occupation strike off; reverse guard off (Ingili with its occupation lifted); L2 off |
| guard on paper | L1 (9 -> 32) | 9118466d3 | strong beside "exists on paper" 31 -> 0 (the line's 9 among them); the fact agrees with the sentence 1,536/1,536 | same file, third arm (red first at 853188dcf) · `guardOnPaper` off the strike |
| F3 | L1 | 0b38bfbde | the works line in an unwalled town 3 at bb2bf91c5 -> 2 after F1 -> 0; walled with no watch or garrison 0 | same file, F3 arm (red first at 44dc0d5f9) · 'no walls' off (Yunxian, Deirmandi); 'no watch or garrison' off (Al-kot with its watch and garrison taken off the roster) |
| F2 + F7 | L0 (`militia \|\| watch`; `force` in the beasts key) | 2b7f61994 | citizen-militia pool with no militia 139 -> 0; held-perimeter beside the watch's line 38 -> 0 (the reader's instrument 42); held-perimeter in any watch-only town 135 -> 0; no-force beside a watch 0 kept; 155 militia towns byte-identical | `tests/domain/defenseWatchIsNotTheLevy.test.js` (red first at fe7eaaf09, 4 of 4) · the old key restored; the held-perimeter filter off. L0's walled arm in `defenseNoForceReadsEveryBody.test.js` RE-KEYED to the ruling |
| F6 | carried (the supply key reads no crisis); +6 by L0 | 04853bde0 | supplied line under siege/famine 27 at the line, 33 at fe7eaaf09, 27 after F2 (the watch towns left) -> 0 | `tests/domain/defenseSupplyUnderACrisis.test.js` (red first at e24d244f2, 3 of 3) · the hold matched to no pool |
| F8 | carried twin of the History rename | c931076a5 | "Exile & Return Event" 209 -> 0, "Occupation Event" 307 -> 0 (collectPlotHooks, the tab's and the PDF's collector) | `tests/domain/plotHooksEventLabelsHistory.test.js` (red first at c75fa4f9e, 4 of 4) |
Each cure's commit body names the towns read on the rendered page and what printed (an occupation, a siege and a
famine wherever the cell reaches one; the smallest and largest size). Each new test file's titles re-took the
lighting census by its ritual, in its own commit (5efbfde7e, 853188dcf, fe7eaaf09, e24d244f2, c75fa4f9e, 6b74eb2aa).

## Every sentence that now prints in a new town or is newly silent (for the owner's veto)
- **Newly prints:** "People at {S} expect to hold against the usual trouble, and they claim no more than that."
  (adequate v3, the line's own pool) in Muulcoba and Ingili, both occupied, beside "Military status · Under
  occupation · … the arms in the town are theirs": the ruling's "no higher than the line's pool"; this seat reads it as
  in tension with the occupation and would accept silence instead. Yunxian (r2r-town-52, unwalled, garrison): "What
  Yunxian can field and what Yunxian has built are both in good order…"; Deirmandi (unwalled): "The town does not
  spend much time thinking about being attacked: its defences are in good order…".
- **Newly silent:** the posture line in 12 occupied strong-badge towns and in the 31 guard-on-paper towns (the
  badge and the assessment print); the Invasion row's sentence and its supply clause in every watch-only town (220:
  the bar and its word print); the beasts row in 135 walled watch-only frontier/plagued towns; the supply clause
  in 27 towns under a siege or a famine (the row's sentence stays).
- **Kept, for the veto:** the beasts row's "force without a perimeter" lines in 9 unwalled watch-only frontier
  villages ("{S} keeps armed people on an open frontier…", "You see spears at {S} and no wall…", "…before its
  fighters get there": L0's; "fighters" stretches a watch); "defenses beyond the need" in 4 walled settled
  watch-only towns (the line's own, force-blind).

## FOR THE JOIN (not this lane's files, or not ruled)
- **(c)** the corpus lane owes a pool for "walls and a watch only" and for "a watch only" (Invasion & War), and a
  held-perimeter-free beasts line for a walled watch-only town (135 towns silent now).
- **(f) F4** (the reader's count): 13 medium corpus lines newly voiced in the 14 towns whose names open with a
  non-ASCII capital (L3 right; the lines are the corpus's, false in any town). **F5:** the weak/critical posture
  against an Invasion row that sees raiders off, 82 towns (80 at the line): the one ladder, the defence lane's.
  **F9:** the naval line lost in 115 river towns, 22 on coastal terrain: after the join. **F10:** the Substrate food
  word "Import-dependent" under a siege, 18 towns: the food generator's label.
- ~~Found by this seat, not ruled~~ RULED AND CURED below (the short supply). The counts first written here (168 /
  240 / 232) were WRONG: the matcher took "will not go short", a line of the SUPPLIED pool.
- The readiness badge "Well-defended" still stands over "exists on paper" in the 31 guard-on-paper towns:
  `defenseGenerator.js :: computeDefenseReadiness`, the defence lane's.
- plotHooks.js's other copy: lane/rung2-shadow-2026-11-07 changed the file after its merge base (a rung-1 merge
  landing of 2026-11-07; its diff touches no label): named, not a holder of F8.

## What a fresh reader needs
The range bb2bf91c5..<the tip below>; the first reader's steps 3 to 7, which it did not run (the field diff by
family; plants for each guard; the remerge diffs; the gates and governing tests at tip and base; CENSUS-2). This
seat's instruments: `/home/user/wt/tools/measure.mjs` (per town: the facts and every desk sentence) and `diffm.mjs`
(cell diff between two measures), re-made from the reader's `desk.mjs` in a few lines; the plants are in each
commit body.

## The close (step 7), at 6b74eb2aa (code) — EXECUTED
- **Births:** the reader's births.mjs at the tip, 1,536 births, 0 errors: sha256 391ab147… EQUAL to the line's tip
  976db5b19 (and to 5f8602371): the lane moves no record.
- **Section 2m's doors**, at every commit that touched src/: the presumed-things door `--check` exit 0 (fresh 0,
  stale 0) at each; observed-shape readers, fact layers (0 rises), writer reach exit 0 from the guard-on-paper cure on
  (the first cure to add a read). **The page census of the 720** (`page-census.mjs --workers=2`) at the tip: exit 0,
  25 rows, none rose and none fell (no `--shrink` owed). The lighting census re-taken by its ritual after each new
  test file (six commits, listed above); the walker plain green each time.
- **The three fast gates** at every src commit: eslint on the touched files exit 0; typecheck:domain:strict 1113 at
  its ceiling; typecheck:ratchet 167 at its ceiling. The lane hook passed on six pushes.
- **The governing test files** of defenseStateProse.js, postureLineDisqualifiers.js and plotHooks.js
  (+ tests/components/defense*), JSON to files: at the tip 49 files, 598 passed, 0 failed; at bb2bf91c5 39 files
  (the guards this seat added are absent there), 565 passed, 0 failed. No red, new or carried, on these files.
- **The edge bundles**, last: `validate:edge` exit 0; nothing written.
- The whole suite was NOT run again, as the brief says.

## The final statement of the fourth seat
Tip <read back in the message to the chair>. Every finding the chair ruled is cured, with the counts above:
F1 2 -> 0 and 14 -> 0; the guard on paper 31 -> 0; F3 -> 0; F2 139 -> 0; F7 38 (reader 42) -> 0; F6 27 -> 0;
F8 209/307 -> 0. Left: nothing of this seat's assignment. For the chair: the strong posture beside a short
defence supply (FOR THE JOIN above). The PR's merge, the deploy and the manifest's re-record are not this lane's.

## The chair's ruling of 08:53 UTC and its cure (after the close)
- **The ruling (copied; vetoable):** a strong posture line beside the same tab's supply sentence saying the
  defenders go short is two places on one page that disagree, and the rise was this lane's own move: the strong pool
  is NOT DRAWN where the supply key reads short, by the same fact (never its sentence), in postureLineDisqualifiers.js.
- **CORRECTION:** this seat's earlier counts of the class (168 / 240 / 232: the F3 commit, this file, two messages
  to the chair) matched "will not go short", a SUPPLIED line. By the short pool's own lines: **141** at the line's tip,
  **203** at bb2bf91c5, 198 after F3, **173** at 08acc23d4 -> **0** at 5d0a2d5fd. 173 cells move, all posture, strong ->
  silent. Guard: the fourth arm of `tests/domain/defensePostureAgainstItsFacts.test.js` (red first at 08acc23d4) ·
  `supplyShort` off. Read: Frosthavn (famine), Ulaanobo (wartime), r2r-metropolis-13 (the largest): the badge and
  the assessment print, no posture line, no dangling label. F3's walled keeper moved to
  rr3-town-monster_pressure-rand-4 (Al-kot's supply is short: its strong line now struck, truly).
- **Close for this commit:** births untouched (display only; the same function, no generator file); eslint, both type
  ratchets, the presumed-things door, observed shapes, fact layers, writer reach exit 0; governing files 599/0; the
  lighting census re-taken (246a22eb7). The page census of the 720 was NOT re-run after this commit (it ran at
  6b74eb2aa: exit 0, no rise): a fresh reader's step.

# THE FIFTH SEAT (R3-TABS-5, 2026-11-14): the second reader's two findings, two raw catalogue names, the badges
The seat's brief: `docs/chair/2026-11-14/briefs/BRIEF-R3-TABS-5.md` on lane/chair-2026-11-08. The second reader:
`docs/chair/2026-11-14/REVIEW-R3-TABS-2-2026-11-14.md` on lane/review-r3-tabs-2-2026-11-14 (NOT CLEAR at 301572583);
the other lane's rows H3-T1, H3-T2, H3-T4 (`REVIEW-R2-CODE-B-LINES-READ.md` on lane/review-r2-code-b-2026-11-14).
First act: the lane's tip read back from origin, 301572583, as the brief named it. Range: **301572583..<the tip>**.
EXECUTED unless marked. Instrument: the second reader's 1,536 births (the first reader's `births.mjs`, seeds1536.txt,
0 errors), the desk by `desk.mjs` (defenseDeskRead) diffed cell by cell; pages by `render.sh` (the real
OutputContainer, every tab opened): the whole 1,536 at 301572583, and the towns read at each cure.

## The rulings this seat worked to (copied; vetoable by the owner)
- **(a) HIGH, carried (H3-T2):** DefenseTab.jsx prints a force's catalogue name raw ("Gates (if walled)", 14 towns).
  NO SURFACE PRINTS A CATALOGUE NAME'S BRACKET (a count range, an "(if …)"): the name goes through the house-label leaf
  the roster uses. Every bracketed catalogue name the tabs' files print is the same cure.
- **(b) HIGH, carried (H3-T4):** HistoryTab.jsx prints the stored tensions without the house-label pass the PDF's
  History uses ("…Taverns (5-20)…"). **RE-RULED by the chair (11:43 UTC, on this seat's stop):** FOR THE JOIN: this
  lane does NOT carry another lane's leaf; a new lane cut from the joined branch (SURFACES-1) passes the History tab's
  and the Overview's stored tensions through the house-label pass; HistoryTab.jsx's tension row is left alone.
- **(c) R1 + the carried C3, MEDIUM:** UNDER AN OCCUPATION THE POSTURE ROW IS SILENT, beside any bar: the occupation
  strike runs before the fallback; the guard that pinned the false line re-keyed by identity.
- **(d) R2, MEDIUM:** the wiring census rebuilt through its door at the tip (and after every later cure that moves
  it); the writer-reach walker's surface-reach title NAMED, not written (record 440: banked once, at the close).
- **(e) R3, LOW:** the guard's 'no walls' arm gains a town or a made record in which only the walls condition keeps
  the line off, the plant shown red.
- **(f) MEDIUM, carried (H3-T1):** the REQ / FORCED badge off the Defense tab, as off the roster.
- **(g) MEASURE ONLY** on the joined branch: the Foundations tab's food word against the Tonight sheet's, in the
  release bar's two towns.
- **(h) the chair, 11:43 UTC (after (c)):** A LINE CLAIMS NO VERDICT THAT A BAND ON ITS OWN PAGE CAN DENY: the
  Invasion row draws no line that claims the place holds, deters or sees off a raid where its own Invasion & War band
  reads Critical: the key reads the band; there the row is silent or draws only a pool whose every line is true
  beside Critical. Measured on this tree (the rebuild is absent here), cured, guarded with a made record.
- NOT THIS SEAT'S: C1, C2 (the corpus's pools); R4's true lines lost (named below).

## Each row: cause, cure and commit, counts, guard and plant, towns read
| row | cause | cure | counts on the 1,536 | guard · plant |
|---|---|---|---|---|
| (a) | `DefenseTab.jsx :: ForceCard` printed `i.name` raw | a193ba4fe: through `institutionDisplayName`, the seam this lane's roster prints a house with ("Town gates"); dedupe and matches keep the raw key | a bracketed catalogue name on a force card 14 towns -> 0 ("Gates (if walled)" the only one; all 14 walled, all towns) | `tests/components/defenseForceCardHouseLabel.test.jsx` (red first at 301572583, 2 of 3) · the raw name restored. The provenance file's by-name pin re-keyed by identity to the printed label |
| (b) | `HistoryTab.jsx :: TensionRow` prints the stored text raw | NOT CURED: the chair's re-ruling (FOR THE JOIN) | 1 town (r2r-town-9) at 301572583. On this lane the roster prints "Taverns (5-20)" too: the strip is r2-code-b's | — |
| (c) | the ADEQUATE fallback and every pool ran before any occupation strike | 1ad5ca6e7: `defenseStateProse.js :: silentUnderAnOccupation`, first in `defensePostureProse` | posture line under an occupation 64 -> 0 of 76 occupied towns (adequate 12, weak 32, critical 20); 64 cells move, all posture, line -> silent | `defensePostureAgainstItsFacts.test.js`, the occupation arm (red first at b5a335a46, 5 of 6); Ingili's ADEQUATE pin re-keyed to silence, its lifted record keeps the reverse guard · the old order restored |
| (a) sweep | — | the claim of zero's instrument: every rendered page of the 1,536 at 301572583 (`render.sh`), the Defense, History and Foundations sections, for a name ending in a digit-led, "(if walled)" or "(high magic)" bracket | Defense: "Gates (if walled)" 14 (cured above), "Major monasteries (5-10)" 12 (FOR THE JOIN); History: "Taverns (5-20)" 1 ((b)); Foundations: 0. The rest are the page's own tallies ("Vulnerabilities (1)", "Current Tensions (2)") | — |
| (h) | `defenseStateProse.js :: withinTheBar` read only the Strong band | 60b56d3cb: L2's table reads the Critical band too: walls AND garrison, walls with militia, force with NO walls not drawn there | 542 births read Critical; a hold claim beside Critical 6 -> 0 (5 thorps; all occupied); 7 cells move, all threat.invasion line -> silent: the 6 and Shivamandal (r2s-succession_void-town-0), whose "You see armed fighters … and no wall" was TRUE (the pool-level strike's one true line lost, declared) | `tests/domain/defenseInvasionWithinACriticalBand.test.js`: two real towns and made records set Critical (red first at 268c40013, 5 of 5); defenseWatchIsNotTheLevy's militia keeper (Makropyrgos, now false) re-keyed by identity to rr3-thorp-famine-rand-0 |
| (f) | — | already cured on this lane by f19e75e41 (R3-TABS 1, ruling b1): the reader read a tree without it | "REQ" / "FORCED" as a node on the rendered Defense tab: 0 of 1,536 pages at 301572583 (`render.sh`) | `tests/components/defenseForceCardNoProvenance.test.jsx` (existing) |

## Every new or changed line, with the towns it was read in
- **Newly prints (a):** "Town gates" over the town's own gate line ("Controlled entry points with gatekeepers." /
  "Entry controlled at fixed points, gatekeepers posted."), under "Town walls": r2r-town-11 Ardbridge (insurgency),
  r2s-famine-town-3 Shattkarez (famine, the smallest, 737), rr3-town-occupied-rand-4 (occupied, the largest, 2,465),
  rr2s-town-under_siege-rand-1 Nahrhaven (siege).
- **Newly silent (c):** the posture line in 64 occupied towns: the badge, the Guard assessment and the "Under
  occupation" banner print: r2s-occupied-thorp-0 Warmstadt (the smallest, 13), r2s-occupied-metropolis-1 Dionpetra
  (the largest, 105,466), rr3-town-occupied-rand-1 Muulcoba, rr3-metropolis-occupied-rand-2 Ingili.

- **Newly silent (h):** the Invasion row's sentence (and its supply clause) beside a Critical band in 7 towns: the bar and
  its band print: r2s-occupied-thorp-0 Warmstadt (the smallest, 13), rr3-town-occupied-rand-4 Dar-al-mandi (the largest,
  2,465), rr3-thorp-occupied-rand-1 Makropyrgos, r2s-succession_void-town-0 Shivamandal (not occupied).

## FOR THE JOIN
- **(h) at the join:** once the defence rating's rebuild lands, re-measure its Critical towns there (the reader's 12 of
  972): the key reads the band the chip prints, so it follows the rebuild without a change.
- **(b), by the chair's ruling:** `src/components/new/tabs/HistoryTab.jsx :: TensionRow`: its text through
  `houseLabelsInText(text, r.institutions)` (the leaf in r2-code-b's institutionDisplayName.js; the join's
  HistoryFounding.jsx:51 does the same); the tab hands the settlement's institutions to the row. The Overview's twin
  (`OverviewTab.jsx`, held by the upkeep lanes) likewise. For SURFACES-1.
- **(a)'s other bracket on the Defense tab (found by this seat's page sweep; another lane's file):** Supporting
  Capabilities · Medical Readiness prints "Major monasteries (5-10). Wounds and fevers treated one at a time…" in 12
  metropolises at 301572583 (r2r-metropolis-32, r2r-metropolis-51, r2s-indebted-metropolis-2 …). The writer is
  `src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities` (the note's `${facts.healerName}`), held by
  the upkeep lanes and w2-c-leaves: at the join, `${institutionHouseLabel(facts.healerName)}`. Not changed here.
- **(a)'s twin at the join:** where `institutionHouseLabel` exists, `ForceCard` may read it instead of
  `institutionDisplayName` (one word); today no force name carries a bracket the seam does not map.
- **(a) and (f) in the PDF:** `src/pdf/sections/DefenseSecurity.jsx` (held by the upkeep lanes) prints force.name raw
  and the REQ / FORCED chip (H3-T1's PDF half, H3-T2's Pc/Pd): the same two cures there.
- **R4 (the corpus owes pools; the second reader's counts):** S1 52 v1 "reads as a defended place from the road in…"
  beside short supply only; S2 59 "The walls and townsfolk of {S} would see off a raid…" in walled watch-only towns;
  S3 74 force-free beasts lines; the Invasion row silent in 220 watch-only towns, the beasts row in 207.
- **C1, C2:** the deterrence lines under a siege and an occupation are the corpus's pools (declared off both there).

## What is left (kept current)
(e), (d), (g); the close.
