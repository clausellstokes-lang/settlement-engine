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
