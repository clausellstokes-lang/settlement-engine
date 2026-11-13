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
