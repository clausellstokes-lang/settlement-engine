# TAIL-CRISIS · hand-back

Seat TAIL-CRISIS (group CRISIS: the crisis summary, the quick guide, the faith reading, the outlook hooks). Branch
`lane/tail-crisis-2026-11-14`, cut from the joined line `lane/join-2026-11-14` at **bcad1a358** (read back from origin
at the start). Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-CRISIS.{md,json}` on the chair's lane (90 rows, read
at e5b421802). Instruments: READ-ALL `inventory.py` / `inventory_diff.py`, CENSUS-3 `census3.sh <tree> <out> 4`, each
`git archive`d to the session's scratch directory, outside every tree.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- **(K1)** "Stores: a granary, about five months of grain" beside a famine or a besieged deficit: the stores line
  reads the food record's own months and says what the crisis has done to them, ONE HOME with the Economics tab's
  stores sentence.
- **(K2)** The faith reading's observance lines under a siege, a quarantine or a plague, or where the only church is a
  neighbour's that the siege has cut off: a twin that is true in that state.
- **(K3)** A summary or a hook that names "a strong power", "iron carts", "the smiths" or "caravans" needs them in the
  town: a twin or a condition. (The crisis texts in `src/data/stressTypes.js` belong to the HISTORY seat: rows there are
  NAMED for it.)
- **(K4)** (23:08 UTC) `src/domain/summary/tonightSheet.js` is this seat's, whole: the Tonight sheet's own lines are
  crisis facts. K1 is to be cured at `foodStoresWords`, red first on its 16 towns, with the other 334 shown unmoved.
- **(K5)** (23:25 UTC) `src/domain/coherence/hookTruth.js` stays this seat's, but the TIES seat moves `ruledByCouncil`
  to `src/domain/facts/` and re-exports it. This seat does not change, move or rename it.

- **(K6)** (23:57 UTC) The insurgency summary: the reworded line ships as the pool's FALLBACK, true in all 37. The
  atom `rival power` is GRANTED: it is true where the record holds a power OTHER THAN THE GOVERNING ONE whose own
  standing is Significant or above (one leaf, the same reading that "pressing close behind" uses). It goes into the
  vocabulary in ITS OWN COMMIT with its test, apart from the end of the list, because TIES adds `ruling body` to the
  same file. The old line is then keyed `needs: ['rival power']`, and the new line has no needs. Expected: 27 towns
  keep "A strong power…" and 10 take the plain line. The family is now named: shared power, ruling body, rival power.
  **NOT DONE this session (handed back at budget). OWED, in this order:** (1) the atom, in its own commit, in
  `src/domain/facts/factVocabulary.js`, read from the standing leaf that "pressing close behind" reads (find it with
  `grep -rn "pressing close behind" src`), with a home in `factsOf.js` and a test over the 720 that counts 27 true and
  10 false among the insurgencies; (2) at `stressNarrative.js :: RENDERERS.insurgency`, `atomHolds('rival power', facts)
  === true` gives the old two sentences, and anything else gives the batch-1 line. The vantage lines that batch 1 reworded
  away from "power" (22983 21315 11471 and the cover/traveller line) can be keyed the same way. Veto list for the
  owner: the atom, "A strong power in X has stopped obeying the government. Its people stall, its taxes go unpaid, and
  it waits." (true with a rival power), and "Some in X have stopped obeying the government. They stall, their taxes go
  unpaid, and they wait." (the fallback).

## Batch 1: the crisis texts (faith K2, stress summaries K3, the vantage pools, the besieged famine hook)

Writers: `domain/dossier/faithReading.js` (observanceOf, faithLinesOf), `generators/stressNarrative.js` (RENDERERS,
WARTIME_VARIANTS), `domain/crisis/crisisSummaryVantage.js` (CRISIS_SUMMARY_POOLS), `generators/economy/outlookHookSiblings.js`
(OUTLOOK_HOOK_SIBLINGS, the starving set). Test: `tests/domain/tailCrisisBatch1.test.js` (16 FALSE pairs, red at
bcad1a358 by their "not to contain" assertion, 16 of 16, shown in its first, `it.each` form; 6 KEEP pairs, green at both.
The committed form loops over the same rows in two plain tests). Re-keyed by identity in the
same commit: `tests/generators/outlookHooksResolved.test.js` (the starving set's third and fourth members),
`tests/generators/stressNarrativeDeclared.test.js` (the isolated war's sacrifice sentence), `tests/components/faithTabChurch.test.jsx`
(the access line under a siege or a quarantine).

### Batch 1 · measured (census at bcad1a358 against the tree; inventory_diff over the batch's 27 rows)

29,874 distinct sentences before and 29,890 after: 14 gone, 30 new, 15 in fewer towns, 0 in more towns.
- **GONE, 14 rows:** 03091 12113 22640 22983 28783 B14649 B27943 07290 18222 15568 11471 15481 21315 20063.
- **FEWER, each by exactly its measure:** 06517 210→197 (plague 8, siege-cut access 5); 14027 157→150 (6+1); 06518
  81→78 (2+1); B19735 115→111 (plague 4); B21207 93→91 (2); 12078 34→17 (17 undefended); 18434 34→31 (3 import
  nothing); 28958 24→16 (8 thorps and hamlets); 20648 29→25 (4 isolated); 21965 24→17 (7 besieged famines).
- **UNCHANGED, as intended:** 18671 (parked, K1), B01051 (struck), 01034 (parked).
- **Other sentences now in fewer towns:** "Folk attend on the great feast days …" 159→150 and "Few folk keep the
  rites …" 91→88, both K2's same shape and false in the same states. Also "Patron deity" and its two premium lines,
  717→716, in r2r-thorp-1 only. That town's dump differs from before in those two lines and nothing else, and a
  re-render of r2r-thorp-1 at the tree prints them again, byte-identical to the before dump. It is a render flake,
  not this cure.
- **THE INHERITORS:** all 30 new sentences are this batch's own lines. Each was read in the towns that print it (the
  veto list below). The widest, "Some in X have stopped obeying the government. They stall, …", prints in all 37
  insurgencies. In the 27 that have a second power, the reworded line is weaker but true, and the chair was told before
  the push (more than twenty towns).
- **DECLARED MOVE** (field diff by family, before against after, over the 720 records): `stress` and `stressors`, 66 records each.
  In both, only `summary` changes: insurgency 37, monster_pressure 17 (the 3 that import nothing are among the 17 undefended),
  slave_revolt 8, wartime 4. `stressors` mirrors `stress`, since the summary is rendered at assembly. Also
  `economicViability`, 7 records: the plot hook of the 7 besieged famines. No other family moves, and no draw moves.

### Rows cured (id · towns printing before · false before, by the record)

| id | sentence (fold) | printing | false (record) | cure |
|---|---|---|---|---|
| 06517 | Devotion runs deep, and the rites set the rhythm of the week. | 210 | plague 8, plus a siege that cuts off a neighbour's church | twin |
| 14027 | Most folk attend the rites through the year. | 157 | plague 6, plus a siege that cuts off a neighbour's church | twin |
| 06518 | Devotion runs through every part of life here, and few miss a rite. | 81 | plague 2, plus a siege that cuts off a neighbour's church | twin |
| B19735 | The hamlet has no church of its own; its people walk to the next village's parish church … | 115 | plague 4 | twin |
| B21207 | The thorp has no church of its own; its people walk … | 93 | plague 2 | twin |
| 03091 | A strong power in X has stopped obeying the government. | 37 | 10 (every hamlet, 6 of 8 thorps: the government is the only power) | reworded (the vocabulary has no second-power atom) |
| 12113 | Its people stall, its taxes go unpaid, and it waits. | 37 | 10 (as 03091) | reworded |
| 18434 | … caravans go missing … | 34 | 3 (`imports` refused) | twin |
| 12078 | Its defences were built for quieter times. | 34 | 17 (no wall, palisade, watch, militia or garrison) | twin |
| 28958 | Whole work gangs have downed tools … | 24 | 8 (every thorp and hamlet revolt) | twin (`tier: ≥ village`) |
| 20648 | … while certain families are quietly thriving on contracts. | 29 | 4 (isolated) | twin |
| 21965 | The settlement is starving, and its hungriest are turning to banditry. | 24 | the besieged famines | new member (siege) |
| 22640 | There is no fighting in X; … officials who will not act … | 14 | thorps and hamlets with no officials | reworded |
| 22983 | … one of its strongest powers is defying them … | 14 | the 10 towns with one power | reworded |
| 28783 | … the lookouts count the days between attacks. | 12 | towns with no watch or militia | reworded (the defence surfaces hand no facts) |
| 20063 | … the lookouts are beginning to see it. | 5 | as 28783 | reworded |
| 07290 | Every cart that fails to reach X … | 9 | `imports` refused | reworded |
| B14649 | Passing through X, you would see nothing amiss … | 10 | where a famine stands beside the insurgency | reworded |
| B27943 | With no one in X's seat, nobody can give the order … | 10 | where an acting steward holds the seat | reworded |
| 11471 | … the government and the power that defies it … | 7 | one-power towns | reworded |
| 21315 | The power defying X's government grows quietly … | 6 | one-power towns | reworded |
| 18222 | Some of X's offices no longer send their revenue on … | 8 | towns with no offices | reworded |
| 15481 | … before you meet its own officials. | 6 | thorps with no officials | reworded |
| 15568 | People in X feel safe, and nothing they can see tells them otherwise. | 8 | beside "people watch each other … something has changed" | reworded |

The same shape, cured with these rows (each line is false where its row's line is false): the insurgency vantages
cover/traveller ("its offices are half empty … one of its strongest powers"), cover/trade and overview/trade ("some
offices … revenue"), overview/local ("the power that defies it"); the faith observance bands "Folk attend on the great
feast days …" (plague 6) and "Few folk keep the rites …" (plague 3).

### Rows struck (true by the record)

- **B01051** "X is split between rival powers, and a quarrel where their ground meets can turn into a brawl": every
  politically_fractured town of the 720 has two or more powers on its record (r2r-hamlet-35: the Independent Bloc 63
  against the Headman's Authority 37). The rivalry is the crisis itself. The reader's QUARRELS header showed only
  relations, so it saw none.

### Rows parked or named

- **18671** (K1, 350 printing, 16 false: 3 famine-band granaries at 4.7–4.9 months, 13 under a siege with a gap):
  granted to this seat under K4 but NOT CURED this session. The plan: `tonightSheet.js :: foodStoresWords` gives the
  famine form from the record alone (`record.band === 'famine'`: "Stores: a granary, about N months of grain, and the
  famine eats into them" or similar). The food record carries NO siege field, so the siege form needs the crisis handed
  in, at BOTH callers to keep ONE HOME: the Tonight sheet (`foodFact`, this seat's) and `src/components/new/tabs/EconomicsTab.jsx:304`
  (not this seat's: NAMED for its holder). It is either a second argument at both callers, or a declared move that puts
  the siege on the food record.
- **01034** "X is in a kingdom at war and doing well out of it …" (4 printing): it contradicts the war's state prose
  ("what remains is losing people and resources by attrition", every war town), which is another seat's writer. Its literal
  is banked in `tests/lint/presumedThings.register.json` (war, 294c5b817f35c257), so any reword is a fresh walker hit that
  cannot be banked: a stop. Parked for the chair. The proposed wording is "X is in a kingdom at war, and some here are
  doing well out of it: …".
- **20893 22079 22080 20908** (PEACE_IRON_HOOKS: "The iron carts are three weeks late", "The smiths are rationing", "The
  smiths blame", "The iron merchants … the smiths"): the printed originals are LITERALS in
  `src/generators/economy/foodBalance.js:854-856` (the DEFECON seat's), and this file holds only their declared keys
  and twins. The cure is a reword with no plural "smiths" and no "iron merchants" ("Iron has doubled in price …; at the
  forge they mend tools with scrap"; "What iron the forge has is rationed …"; "At the forge they blame whoever set
  it …"), changed in foodBalance.js and in the keys here in ONE commit. The iron carts row (20893, 39 printing, the
  town imports no iron) is foodBalance's condition: the hook prints wherever terrain `mustImport` names metal and an
  import processor stands. NAMED for DEFECON.
- **The stressTypes viability note** ("Taxes are disputed, some offices no longer send their revenue on …", the
  insurgency's `viabilityNote` in `src/data/stressTypes.js`): it has the same office presumption as 18222. NAMED for HISTORY.

## THE VETO LIST: every new or changed line (read in: the smallest and largest towns it reaches; a crisis town among them)

| new line (fold) | towns | smallest | largest | a crisis town |
|---|---|---|---|---|
| Some in <N> have stopped obeying the government. | 37 | r2r-thorp-22 | r2s-insurgency-metropolis-3 | r2s-insurgency-thorp-0 |
| They stall, their taxes go unpaid, and they wait. | 37 | r2r-thorp-22 | r2s-insurgency-metropolis-3 | r2s-insurgency-thorp-0 |
| It has nothing built or kept to hold such things off. | 17 | r2r-thorp-10 | r2s-monster_pressure-village-3 | r2s-monster_pressure-thorp-0 |
| There is no fighting in <N>; the danger is quieter, orders that go unheeded and dues that go unpaid. | 14 | r2r-thorp-25 | r2s-insurgency-metropolis-3 | r2s-insurgency-thorp-3 |
| Those in charge of <N> know some of its people are defying them, and cannot say so openly without making the defiance stronger. | 14 | r2r-thorp-25 | r2s-insurgency-metropolis-3 | r2s-insurgency-thorp-3 |
| Whatever is attacking around <N>, wolves, raiders or worse, is getting bolder, and people count the days between attacks. | 12 | r2r-thorp-5 | r2s-monster_pressure-metropolis-3 | r2s-monster_pressure-thorp-0 |
| Passing through <N>, you would not see the quarrel over who is really in charge unless you asked. | 10 | r2r-thorp-22 | r2s-insurgency-metropolis-2 | r2s-insurgency-thorp-0 |
| With <N>'s seat empty, no order to call everyone to its defence would be obeyed by all. | 10 | r2s-succession_void-hamlet-2 | r2s-succession_void-metropolis-2 | r2s-succession_void-hamlet-2 |
| Every week the attacks go on, <N> goes without more of what it needs, and the shortfall grows. | 9 | r2s-monster_pressure-thorp-2 | r2s-monster_pressure-metropolis-2 | r2s-monster_pressure-thorp-2 |
| Some of what <N> owes the government no longer reaches it, and the government runs on less each season. | 8 | r2r-thorp-22 | r2s-insurgency-metropolis-2 | r2s-insurgency-thorp-0 |
| People in <N> do not know that outsiders have reached its decisions, and nothing they can see tells them so. | 8 | r2s-infiltrated-hamlet-0 | r2s-infiltrated-city-3 | r2s-infiltrated-hamlet-0 |
| Devotion runs deep, but while the quarantine holds the rites are kept at home, not together. | 8 | r2s-plague_onset-hamlet-1 | r2s-plague_onset-metropolis-3 | r2s-plague_onset-hamlet-1 |
| Those set to work have downed tools and will not take them up again. | 8 | r2s-slave_revolt-thorp-0 | r2s-slave_revolt-hamlet-3 | r2s-slave_revolt-thorp-0 |
| The settlement is starving, and its hungriest steal what food they can find. | 7 | r2r-thorp-58 | r2s-under_siege-village-2 | r2s-under_siege-thorp-2 |
| In <N> people keep out of the quarrel between the government and those who defy it, and away from anyone asking questions. | 7 | r2s-insurgency-thorp-2 | r2s-insurgency-metropolis-1 | r2s-insurgency-thorp-2 |
| Passing through <N>, you meet the creditor's agents before you meet anyone who speaks for the place. | 6 | r2s-indebted-thorp-2 | r2s-indebted-metropolis-2 | r2s-indebted-thorp-2 |
| The defiance of <N>'s government grows quietly, and those watching it cannot act in the open. | 6 | r2s-insurgency-thorp-1 | r2r-metropolis-26 | r2s-insurgency-thorp-1 |
| In better times folk attend on the great feast days; while the quarantine holds they keep the rites at home. | 6 | r2s-plague_onset-hamlet-0 | r2s-plague_onset-metropolis-2 | r2s-plague_onset-hamlet-0 |
| In better times most folk attend the rites through the year; while the quarantine holds they keep them at home. | 6 | r2s-plague_onset-thorp-2 | r2s-plague_onset-metropolis-1 | r2s-plague_onset-thorp-2 |
| The attacks around <N> follow a pattern, and people are beginning to see it. | 5 | r2s-monster_pressure-thorp-1 | r2s-monster_pressure-metropolis-1 | r2s-monster_pressure-thorp-1 |
| Devotion runs deep, but while the road is barred the rites are kept at home, not together. | 5 | r2s-under_siege-thorp-0 | r2s-under_siege-hamlet-2 | r2s-under_siege-thorp-0 |
| In better times the hamlet’s people walk to the next village for the rites; while the quarantine holds, they do not. | 4 | r2s-plague_onset-hamlet-0 | r2s-plague_onset-hamlet-3 | r2s-plague_onset-hamlet-0 |
| The governing authority is demanding sacrifice, and not every household gives it in equal measure. | 4 | r2s-wartime-thorp-1 | r2s-wartime-hamlet-3 | r2s-wartime-thorp-1 |
| In better times folk attend on the great feast days; while the road is barred they keep the rites at home. | 3 | r2s-under_siege-thorp-3 | r2s-under_siege-hamlet-3 | r2s-under_siege-thorp-3 |
| Few folk keep the rites beyond weddings and burials, and while the quarantine holds even those are kept small. | 3 | r2s-plague_onset-village-3 | r2s-plague_onset-metropolis-0 | r2s-plague_onset-village-3 |
| Something in the country around <N> has grown bolder: beasts go missing from the fields, and a farmstead was lost to fire last week. | 3 | r2s-monster_pressure-thorp-0 | r2s-monster_pressure-thorp-3 | r2s-monster_pressure-thorp-0 |
| In better times the thorp’s people walk to the next village for the rites; while the quarantine holds, they do not. | 2 | r2r-thorp-41 | r2s-plague_onset-thorp-2 | r2s-plague_onset-thorp-2 |
| Devotion runs through every part of life here; while the quarantine holds the rites are kept at home, and few miss #. | 2 | r2r-thorp-41 | r2s-plague_onset-city-0 | r2s-plague_onset-city-0 |
| In better times most folk attend the rites through the year; while the road is barred they keep them at home. | 1 | r2r-thorp-58 | r2r-thorp-58 | — |
| Devotion runs through every part of life here; while the road is barred the rites are kept at home, and few miss #. | 1 | r2s-under_siege-thorp-2 | r2s-under_siege-thorp-2 | r2s-under_siege-thorp-2 |

## Gates (batch 1, at the tree against bcad1a358)

- eslint on the touched files: 0. typecheck:domain:strict: 0. typecheck:ratchet: OK (167, ceiling 167).
- The presumed-things walker `--check`: 147 fresh at both base and tree, the same rows (carried; none of them this
  seat's). Two first drafts rose it (a new "siege" clause and a new "no church" denial) and were reworded until they
  no longer did.
- The twelve-birth grid `page-census.mjs --grid`: 2 falls at both (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a),
  carried.
- The governing tests (58 files that name faithReading, stressNarrative, outlookHookSiblings, crisisSummaryVantage,
  faithPanelModel, FaithTab, OUTLOOK_HOOK_SIBLINGS): 18 failing assertions at bcad1a358 and the same 18 at the tree
  once the three pins were re-keyed (CARRIED, not this seat's; among them `tests/domain/npc/paradigmAxisCatalog.test.js`).

- `tests/lint/sovereigntyLightingContract.walker.test.js`: two reds CARRIED at bcad1a358. The each-park debt is 113
  against a ceiling of 108 at both base and tree (the batch test is written as plain loops, no `each`, so it adds
  nothing). The estate file count is 3499 at base and 3500 at the tree against a frozen 3448: +1, this seat's new test file.

## Registers named stale

- The sovereignty walker's estate file count (3448 frozen; +1 for `tests/domain/tailCrisisBatch1.test.js`). It is
  re-taken through its own door at the close, as the brief says, not here.

## Guards owed

- A census kind for a habit line under a quarantine ("attend", "gather", "walk to the next village" beside a plague):
  this seat cured the writer, and no walker guards the shape.
- A vocabulary atom for "a power other than the governing one". Without it the insurgency and fractured lines can only
  be reworded universally, never twinned. Asking the chair (a new word).

## What is left of the worklist

Not reached this session: the quick guide (`settlementQuickGuide.js`, 35 rows: SCOPE_PHRASE "run by its estates", "run
by patronage and law", "run by civic association", "held by clan and caravan", "built around the hall/harbour/agora",
"timber compounds" in desert); the crisis cast and hooks (`crisisCast.js` CAST_REASONS / STAKE_REASONS, 14;
`crisisHooks.js` LINE_ROLE_CLAUSE / leverSentence, 3: the subjectless "…: holds the seat" clause and a person put "of"
a power they are not first-rank in); `hookTruth.js` VILLAGER_TIERS (4: "the war party", "the reformist leader" in one-power
thorps); `activeConditions.js` CONDITION_ARCHETYPE_TEMPLATES (2: "Religious Tension" with no religious record); and
`faithReading.js :: factionLine` (03046: a Suppressed faction given "a small voice").

## The exports' rows (the chair's note X9, 00:00 UTC): NAMED as left

`docs/chair/2026-11-14/read-all-3/WORKLIST3-CRISIS.{md,json}` on the chair's lane lists 29 rows of this group's files
that only the PDF and the journal print (read at f663a2699). The journal's Tonight and Crisis pages print the sheet's
lines in their own cut. Not taken this session. Batch 1's writers (faithReading, stressNarrative, crisisSummaryVantage,
outlookHookSiblings) cure every surface they feed, so any WORKLIST3 row of those writers may already be fewer at
1409e3cbb. The next seat measures that with `SURFACES=PDF,Journal python3 inventory.py <out-dir> x.json` (re-fetch the
instrument for the switch) and checks each row against the record first: that read's header showed no seats and
lacked `history.currentTensions`.

# TAIL-CRISIS-2 · the successor's batches (2026-11-15)

Seat TAIL-CRISIS-2 succeeded TAIL-CRISIS on the same branch, at **9c07f7461** (origin's tip, read back at the start). It
handed back at its count: about 340,000 tokens when it read the count, against the brief's 250,000. It read the count
late, while batch 2's census was in flight. Pushed: **30daac9a7** (the atom, K6), **5e75be951** (batch 2), and this hand-back.

## The chair's rulings since (2026-11-14 23:57 to 2026-11-15 00:41 UTC; each vetoable by the owner)

- **(K5)** `hookTruth.js :: ruledByCouncil` is moved by the TIES seat only (it builds the atom `ruling body`), with its one
  re-export edit in hookTruth.js. This seat did not touch it.
- **(K6)** The third atom, `rival power`, is granted: true where the record holds a power other than the governing one whose
  own standing is Significant or above (the power's own strength: one leaf). It goes in its own commit with its test, apart
  from the end of the vocabulary's list. The family is named (shared power, ruling body, rival power): no fourth without the chair.
- **(K7)** 18671: no declared move. `foodStoresWords` takes an OPTIONAL second argument (the crisis), which the Tonight sheet
  passes. The Economics tab's call (`EconomicsTab.jsx`, another seat's) passes one argument and prints as before: NAMED below.
- **(K8)** 01034: the predecessor's wording is accepted ("…and some here are doing well out of it"). The banked row is to be
  re-keyed by identity through the walker's own door, in the same commit. If the door cannot re-key one row, stop and tell
  the chair its modes.
- **(K9)** The iron hooks (20893 22079 22080 20908): one commit, by exception: the three literals of PEACE_IRON_HOOKS in
  `foodBalance.js` (those only, to the proposed wordings), with their keys here. The iron carts row's condition stays the
  DEFECON seat's.
- **(X9)** The exports' rows (WORKLIST3-CRISIS, 29): take each with a batch of the same writer, measured with `SURFACES=PDF,Journal`.
- **(K10)** (00:19, on this seat's K6 stop) THE SUMMARY STAYS ON ITS TRUE FALLBACK: the strong line is not keyed. The atom
  stands, with its hazard written on it: it is true of the SETTLED record, so a line rendered before the powers settle must
  not be keyed by it.
- **(K11)** (00:28, named by TAIL-HISTORY) the trade and official vantages in `crisisSummaryVantage.js` that presume offices.
- **(K12)** (00:41, named by TAIL-DISPLAY-CIVIC) "{power} no stake yet" (B12521 89 towns, B13860 B18039 13199 06464 13370);
  B11070 B11113 B11121 ("of the house named"); 12547 (the quick guide).

## The atom (K6): 30daac9a7

`src/domain/facts/rivalPower.js :: rivalPowerOf` reads each power's own `powerLabel`, never a share recomputed. It is true
where a power with `isGoverning !== true` stands Significant, Strong or Dominant, false where powers are listed and none is,
and undefined where the record has no power list. In the vocabulary, `'rival power'` sits after `guild`; there is a getter
`factsOf().rivalPower` and a factLayers row (layer 3, powerStructure). Test: `tests/domain/facts/rivalPower.test.js`
(9 tests; a plant with the reader always true reds 3).

**Measured on the 720 final records: true in 21 of the 37 insurgencies, false in 16.** The chair expected 27/10, but 27 is
the count with ANY second power; 6 of those have only Minor or Suppressed rivals.

**THE STOP (K10):** the stress summaries are rendered at `assembleSettlement.js:219`, BEFORE `reconcilePowerStructure` and
`resizePoliticalRoster` (:248 on). On births of the 37, 31 hold a rival at render time, and 10 of those lose it when the
roster settles: r2s-insurgency-hamlet-0 printed "A strong power" with one power left. The keying was reverted. The summary
keeps "Some in X have stopped obeying the government…" in all 37.

**THE CLASS (K10's ask), named for a measuring seat; it is not this seat's to move.** Two of this group's writers run BEFORE
the powers settle:
- `generators/stressNarrative.js :: RENDERERS` (the summaries, assembly :219);
- `generators/economy/outlookHookSiblings.js` (the outlook hooks, born with the food record in the economy step, before
  assembly).

Their lines that name a power's standing, a council or a force read a roster that may still change. The group's
display-time writers (faithReading, crisisSummaryVantage, settlementQuickGuide, tonightSheet, and crisisCast/crisisHooks
where they are read at display) read the settled record.

## Batch 2: the quick guide (35 rows), K1/K7 (18671), K11 — 5e75be951

Writers:
- `settlementQuickGuide.js :: scopeAgainstRule`: new, called at the end of scopeAgainstRoster, display-time only.
- `tonightSheet.js :: foodStoresWords` (the optional crisis) and `foodFact`.
- `crisisSummaryVantage.js`: the succession void's trade and official vantages.

The test, `tests/domain/tailCrisisBatch2.test.js`, has 33 scope FALSE pairs and 7 NOW pairs. Every one was red at 9c07f7461
in an it.each form (40 of 40). The 9 KEEP pairs and 1 STILL pair are green at both. A plant (the desert read switched off)
reds it. Re-keyed by identity in the same commit: the hall pins in `tests/domain/settlementQuickGuide.test.js` and
`tests/domain/summary/inlandScopePhrases.test.js` (records with no seat and no hall).

### Measured (census at 9c07f7461 against 5e75be951's src; inventory_diff over the batch's 36 rows)

Tabs: 29,890 distinct sentences before and 29,922 after: 38 gone, 70 new, 24 in fewer towns, 2 in more. Exports (PDF,
Journal): 35,796 → 35,828. **The 720 records are byte-identical before and after: no declared move.**
- **GONE, 21 rows:** 18583 12545 15013 09626 03984 12542 03970 15016 10044 03987 15015 15026 10071 10045 10066 03969 10054
  10072 10049 10048 10046.
- **FEWER, 13 rows, each down to its true remainder.** The towns left print the line truly: a lord or a standing landed
  power; a council's or a mayor's rule; a guild that stands; a hall that is a seat; ground that is not desert. 18585 13→9,
  03971 10→9, 09631 10→1, 12540 9→1, 03978 8→2, 09628 8→2, 18124 8→7, 18128 8→6, 09633 7→1, 09630 7→1, B03858 7→1,
  18459 6→5, 09632 5→1.
- **Still in the town read, 2 rows:**
  - **03974, STRUCK.** In r2s-plague_onset-village-1 the Elder Council governs and the crossroads trades both ways. It went
    5→3; the other two towns are elder rule with no trade.
  - **18671, by its fold 350→350 on the TABS**, because the Economics tab (one argument, not this seat's) still prints it
    everywhere. On the Tonight sheet the twin prints in exactly the 16 towns the predecessor counted false (13 "…and the
    siege is eating into them", 3 "…and the famine is eating into them"). On the exports the old line went 350→334.
- **K11:** "…and each office does as it sees fit meanwhile" printed in 10 towns, false in 3 (r2s-succession_void-hamlet-2,
  -village-0, -village-3). "Each office in X now runs itself…" printed in 7, false in 2 (-thorp-0, -thorp-1). Both are now
  at 0, and their rewordings print in the same 10 and 7. Both lines print on the exports only.
- **Other sentences now in fewer towns:** every one is another frame (of the scope line's five) of the same cured clauses,
  false in the same states. **In more towns (2):** "Greek-inspired, built on desert ground." and "…built in forest
  country." went 1→2 each, where a town whose civic association was struck now prints its ground alone. Both are true.
- **THE INHERITORS:** 74 sentences, all of them this batch's own lines (the veto list below). The widest are
  "Germanic-inspired: built in timber and stone." (15) and "Steppe-inspired, and it shows: built on clan lines." (12).
- **THE SILENCE OVER TWENTY TOWNS (told to the chair with this hand-back).** These clauses leave many towns:
  - the Germanic estates clause: 57;
  - the Steppe "held by clan and caravan": about 50 (every non-elder rule; elder rule with no trade keeps "held by clan");
  - the Latin "patronage and law": 34;
  - the Greek "civic association": 29;
  - the Norse hall: 27.

  Each was judged FALSE where it leaves. An Elder Council, a headman or a household council does not rule by estates, by
  patronage and law, or by civic association. A Merchant Council city is not "held by clan". No hall stands. The clan and
  estate readings are the widest calls, and the owner may veto them.

### Rows struck (true by the record)

- **03974**: above.
- **B11090 B11061 B11043 B11046 B11037 B11041 B11151** ("X of <power>" in the cast hooks): every named person holds a
  membership in that power. The readers' PEOPLE line gave first titles only.
  - Akna Balam: rank 1 of the Elder Council.
  - Reiko Inoue: rank 1 of Merchant Guilds.
  - Wen Ma: a member of the Merchant oligarchy.
  - Güchlüg Jirgin: a member of the power named "Town Mayor".
  - Maisa al-Qadir: a member of the Arcane Council.
  - Christoph Fischbach: a member of the Guild Council.
  - Yan Kimura: rank 2 of Noble Houses.

  B11090's subjectless "…: holds the seat" is a real fault; the batch 3 patch cures it.
- **B11070 B11121 B11113** (K12 (2)): Jade Ek is rank 3 of the Elder Council; Anusaya Mishra is a member of Merchant
  Guilds; Sorcha Tobin holds the outbreak's lever house (the parish church).
- **B19085 B19857 B21139** ("the town/city hall, run by X"): each X is first rank of the governing power (the
  Captain-Mayor, the Archmage of the Council), and the seat's head runs the seat.
- **20852**: the loser stake is the cast's own reading, and nothing in the record makes it false.

## BATCH 3, BUILT AND NOT PUSHED (handed back at the count): TAIL-CRISIS-2-batch3.patch beside this file

The patch applies clean at 5e75be951: run git apply with the patch's path from the tree root.

In crisisHooks.js:
- The cast hook's reasons that are a verb's predicate (PREDICATE_REASONS: leverRuns, instigatorRival, instigatorBacked,
  targetSeat, targetSeatContested, scapegoatSeat, scapegoatLever, defenderMilitary, defenderOffice, treaterSeat, face) are
  said of the holder, as a relative clause, never after a colon:
  - "Eir Ragnarsson of Household Council, who holds the seat, is the one who would come to terms."
  - "it is aimed at X of Elder Council, who holds the seat, and the right to it is already in dispute."
- A power named in the hook (holderWords, loserClause) takes its prose form from powerSentenceName ("Military/Guard" →
  "The Guard").

It cures 11595 11549 11671 11569 11668 B11049 B11090 20875. A probe over the 720 records: 282 of the 722 hook lines change,
all of them these shapes. Its test, tests/domain/tailCrisisBatch3.test.js (in the patch), has 8 FALSE pairs, all red at
9c07f7461 (8 of 8, in an it.each form), and 2 KEEP pairs, green.

**OWED before it is pushed:**
- the gates: eslint, strict, the ratchet, the walker's check against 147, the grid;
- the governing tests of crisisHooks;
- its census before (= batch 2's after) and after.

The wording "In the betrayal, it is aimed at…" keeps "it": its antecedent is the crisis named in the same sentence.

## Rows parked or named (this seat)

- **K8, 01034: STOP. The door has no mode that re-keys one row.** The row is in the FIRST register
  (presumedThings.register.json: war, after-release, "…doing well out of it…", 294c5b817f35c257). The door's modes:
  - check;
  - bank with a reason and a base, with or without one thing: these bank only hits whose literal STOOD in its file at the
    base. A reworded literal never did, so the door exits 1 and names it;
  - bank-strip;
  - shrink and shrink-arm2: these only remove rows;
  - rekey-whole: this re-hashes rows that have no hash, and refuses a row that matches no hit.

  None of them re-keys one row to a new literal. For the chair.
- **K9 (the iron hooks): not reached.** The predecessor's wordings stand ready in batch 1's "parked" list above.
- **K12 (1) "{power} no stake yet": not taken.** The words are written at crisisPage.js:58, which is not this group's file.
  Their truth rests on the cast's stakes (crisisCast.js, rule 11), which are STORED on the record (stress[].cast), so a cure
  there is a declared move. The exports' "Merchant Guilds no stake yet" also lacks a verb; that belongs to crisisPage.js's
  holder.
- **NAMED for the Economics tab's seat (K7):** src/components/new/tabs/EconomicsTab.jsx:304 calls foodStoresWords(record)
  with one argument. Passing the crisis (factsOf(settlement).crisis) makes the tab say what the famine or the siege is doing,
  as the Tonight sheet now does. Until then the tab still prints "Stores: a granary, about five months of grain." beside a
  famine.
- **NAMED for HISTORY:** src/data/stressTypes.js:114 and its mirror stressTypesMeta.js:69 hold the succession void's
  viabilityNote "…in the meantime each office does as it sees fit.". It prints in 31 towns, 15 of which have no office on
  the roster (every succession_void thorp, hamlet and village).
- **Seen, not on the worklist:**
  - the Germanic "built in timber and stone" on desert ground (4 towns), the same shape as the Slavic timber cured here;
  - the Tonight sheet's food label "Import-Dependent" under a siege (r2s-under_siege-city-0, -metropolis-3), where nothing
    comes in.

## Gates (batch 2, at the tree against 9c07f7461)

- eslint (the touched files): 0.
- typecheck:domain:strict: 0. typecheck:ratchet: 0.
- The presumed-things walker's check: 147 fresh at base and tree. Two first drafts raised it to 149: "built around the
  harbour, " as a literal, and "held, for now, by an occupying power". Both were reworded: the strike is now a regex that
  prints nothing, and the twin says "another power".
- The grid: 2 falls at both (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a), carried.
- The governing tests (142 files naming the touched writers): 32 failing at the base, and the same 32 at the tree once the
  four hall pins were re-keyed. They are CARRIED; among them are factLayers.walker's two, coherenceAgreeCures' two and
  vocabularyPageFindings' one.

## Registers named stale

- The sovereignty walker's estate file count: 2 more test files (tests/domain/facts/rivalPower.test.js,
  tests/domain/tailCrisisBatch2.test.js) on top of batch 1's one. It is re-taken through its own door at the close.

## THE VETO LIST (batch 2): every new line, with its smallest and largest town and a crisis town

| new line (fold) | towns | smallest | largest | a crisis town |
|---|---|---|---|---|
| Germanic-inspired: built in timber and stone. | 15 | r2r-thorp-32 | r2s-under_siege-metropolis-0 | r2s-succession_void-thorp-1 |
| Stores: a granary, about # months of grain, and the siege is eating into them. | 13 | r2s-under_siege-town-0 | r2s-under_siege-metropolis-3 | r2s-under_siege-town-0 |
| Steppe-inspired, and it shows: built on clan lines. | 12 | r2r-town-13 | r2s-succession_void-metropolis-3 | r2s-infiltrated-metropolis-3 |
| Germanic-inspired, built in timber and stone. | 11 | r2r-thorp-18 | r2s-wartime-city-2 | r2s-infiltrated-thorp-3 |
| Ask about the place and you are told it is built on clan lines. | 10 | r2s-infiltrated-town-2 | r2r-metropolis-7 | r2s-infiltrated-town-2 |
| Ask about the place and you are told it is built in timber and stone. | 9 | r2r-thorp-7 | r2r-metropolis-12 | r2s-indebted-village-2 |
| Germanic-inspired; people here live in a place built in timber and stone. | 9 | r2r-thorp-30 | r2s-under_siege-city-3 | r2s-infiltrated-thorp-2 |
| Germanic-inspired, and it shows: built in timber and stone. | 8 | r2r-thorp-45 | r2r-metropolis-16 | r2s-insurgency-thorp-3 |
| Steppe-inspired, built on clan lines. | 8 | r2r-town-20 | r2s-politically_fractured-metropolis-1 | r2s-religious_conversion-city-3 |
| Steppe-inspired: built on clan lines. | 8 | r2r-town-53 | r2r-metropolis-47 | r2s-famine-town-2 |
| Latin-inspired, and it shows: run by custom more than by law. | 6 | r2r-thorp-35 | r2s-succession_void-hamlet-3 | r2s-politically_fractured-thorp-2 |
| Norse-inspired; people here live in a place built on kin, oath and the assembly. | 6 | r2r-thorp-52 | r2r-village-29 | r2s-occupied-thorp-3 |
| Latin-inspired: run by custom more than by law. | 6 | r2r-thorp-54 | r2s-under_siege-hamlet-0 | r2s-indebted-thorp-3 |
| Steppe-inspired; people here live in a place built on clan lines. | 6 | r2r-town-19 | r2s-plague_onset-metropolis-0 | r2s-religious_conversion-city-0 |
| Latin-inspired; people here live in a place run by custom more than by law. | 5 | r2r-thorp-6 | r2r-hamlet-32 | r2s-famine-thorp-3 |
| Norse-inspired, and it shows: built on kin, oath and the assembly. | 5 | r2r-thorp-20 | r2r-village-32 | r2s-indebted-thorp-1 |
| Norse-inspired: built on kin, oath and the assembly. | 5 | r2r-hamlet-20 | r2r-village-20 | r2s-politically_fractured-hamlet-2 |
| Latin-inspired, run by custom more than by law. | 4 | r2s-recently_betrayed-thorp-3 | r2r-hamlet-47 | r2s-recently_betrayed-thorp-3 |
| Ask about the place and you are told it is built on hillside ground. | 4 | r2s-under_siege-thorp-2 | r2s-recently_betrayed-village-2 | r2s-under_siege-thorp-2 |
| Norse-inspired, built on kin, oath and the assembly. | 3 | r2r-hamlet-59 | r2r-village-0 | r2s-infiltrated-hamlet-2 |
| Latin-inspired, built in masonry around a civic square, and run by custom more than by law. | 3 | r2r-village-26 | r2s-recently_betrayed-village-3 | r2s-recently_betrayed-village-3 |
| Stores: a granary, about # months of grain, and the famine is eating into them. | 3 | r2s-famine-town-0 | r2s-famine-town-3 | r2s-famine-town-0 |
| Ask about the place and you are told it is built in timber and stone, held, for now, by another power. | 3 | r2s-occupied-hamlet-2 | r2s-occupied-city-0 | r2s-occupied-hamlet-2 |
| Ask about the place and you are told it is built on kin, oath and the assembly. | 3 | r2s-insurgency-thorp-1 | r2s-infiltrated-hamlet-1 | r2s-insurgency-thorp-1 |
| Latin-inspired, and it shows: held, for now, by another power. | 2 | r2r-thorp-1 | r2r-thorp-24 | — |
| Steppe-inspired; people here live in a place built for a pastoral life #-settled and #-moving, held by clan. | 2 | r2r-thorp-38 | r2r-thorp-46 | — |
| Slavic-inspired: built in compounds on land held in common, kin by kin. | 2 | r2r-thorp-51 | r2s-succession_void-city-3 | r2s-succession_void-city-3 |
| Steppe-inspired; people here live in a place built for a pastoral life #-settled and #-moving. | 2 | r2r-hamlet-7 | r2r-village-59 | — |
| Ask about the place and you are told it is built for a pastoral life #-settled and #-moving. | 2 | r2s-slave_revolt-thorp-0 | r2r-hamlet-15 | r2s-slave_revolt-thorp-0 |
| Norse-inspired, built by the water, on kin, oath and the assembly. | 2 | r2r-hamlet-28 | r2r-village-10 | — |
| Steppe-inspired: built for a pastoral life #-settled and #-moving, held by clan. | 2 | r2r-hamlet-34 | r2r-village-8 | — |
| Ask about the place and you are told it is run by custom more than by law. | 2 | r2r-hamlet-39 | r2s-succession_void-hamlet-0 | r2s-succession_void-hamlet-0 |
| Ask about the place and you are told it is built on the open plain. | 2 | r2s-recently_betrayed-thorp-0 | r2r-village-9 | r2s-recently_betrayed-thorp-0 |
| Norse-inspired; people here live in a place built by the water, on kin, oath and the assembly. | 2 | r2s-mass_migration-hamlet-2 | r2r-village-14 | r2s-mass_migration-hamlet-2 |
| Latin-inspired: built in masonry around a civic square, and run by custom more than by law. | 2 | r2r-village-25 | r2s-insurgency-village-1 | r2s-insurgency-village-1 |
| Greek-inspired, and it shows: built on mountain ground. | 2 | r2s-religious_conversion-thorp-2 | r2s-under_siege-village-2 | r2s-religious_conversion-thorp-2 |
| Steppe-inspired, and it shows: built on clan lines, held, for now, by another power. | 2 | r2s-occupied-town-2 | r2s-occupied-city-1 | r2s-occupied-town-2 |
| Latin-inspired; people here live in a place built in masonry around a civic square, and run by custom more than by law. | 2 | r2s-insurgency-village-3 | r2s-politically_fractured-village-0 | r2s-insurgency-village-3 |
| Greek-inspired; people here live in a place built on the coast. | 2 | r2s-indebted-village-1 | r2s-indebted-village-3 | r2s-indebted-village-1 |
| South-Asian-inspired, built around the tank and the bazaar, in # by trade, under the temple. | 2 | r2s-plague_onset-metropolis-1 | r2s-plague_onset-metropolis-3 | r2s-plague_onset-metropolis-1 |
| Greek-inspired; people here live in a place built on riverside ground. | 2 | r2s-religious_conversion-village-3 | r2s-wartime-village-2 | r2s-religious_conversion-village-3 |
| Slavic-inspired, built in compounds on land held in common, kin by kin. | 1 | r2r-thorp-10 | r2r-thorp-10 | — |
| Steppe-inspired, and it shows: built for a pastoral life #-settled and #-moving, held by clan. | 1 | r2r-thorp-21 | r2r-thorp-21 | — |
| Greek-inspired: built on riverside ground, held, for now, by another power. | 1 | r2r-thorp-27 | r2r-thorp-27 | — |
| Ask about the place and you are told it is built on riverside ground. | 1 | r2r-hamlet-5 | r2r-hamlet-5 | — |
| Greek-inspired; people here live in a place built in forest country. | 1 | r2r-hamlet-12 | r2r-hamlet-12 | — |
| Ask about the place and you are told it is built in masonry around a civic square, and run by custom more than by law. | 1 | r2r-village-12 | r2r-village-12 | — |
| Steppe-inspired, and it shows: built for a pastoral life #-settled and #-moving. | 1 | r2r-village-45 | r2r-village-45 | — |
| Ask about the place and you are told it is built around the agora, on hillside ground. | 1 | r2r-village-55 | r2r-village-55 | — |
| Slavic-inspired; people here live in a place built in compounds on land held in common, kin by kin. | 1 | r2r-city-39 | r2r-city-39 | — |
| Ask about the place and you are told it is built around the tank and the bazaar, in # by trade, under the temple. | 1 | r2r-metropolis-14 | r2r-metropolis-14 | — |
| Greek-inspired, and it shows: built on riverside ground. | 1 | r2s-famine-thorp-0 | r2s-famine-thorp-0 | r2s-famine-thorp-0 |
| Germanic-inspired; people here live in a place built in timber and stone, held, for now, by another power. | 1 | r2s-occupied-thorp-0 | r2s-occupied-thorp-0 | r2s-occupied-thorp-0 |
| Steppe-inspired: built for a pastoral life #-settled and #-moving, held, for now, by another power. | 1 | r2s-occupied-hamlet-0 | r2s-occupied-hamlet-0 | r2s-occupied-hamlet-0 |
| Germanic-inspired, built in timber and stone, held, for now, by another power. | 1 | r2s-occupied-village-0 | r2s-occupied-village-0 | r2s-occupied-village-0 |
| Latin-inspired; people here live in a place built in masonry around a civic square, and held, for now, by another power. | 1 | r2s-occupied-town-0 | r2s-occupied-town-0 | r2s-occupied-town-0 |
| Greek-inspired, built around the agora, on riverside ground, held, for now, by another power. | 1 | r2s-occupied-town-3 | r2s-occupied-town-3 | r2s-occupied-town-3 |
| Greek-inspired, built around the agora, in forest country, held, for now, by another power. | 1 | r2s-occupied-metropolis-0 | r2s-occupied-metropolis-0 | r2s-occupied-metropolis-0 |
| Greek-inspired, built around the agora, on hillside ground, held, for now, by another power. | 1 | r2s-occupied-metropolis-1 | r2s-occupied-metropolis-1 | r2s-occupied-metropolis-1 |
| Steppe-inspired, built on clan lines, held, for now, by another power. | 1 | r2s-occupied-metropolis-2 | r2s-occupied-metropolis-2 | r2s-occupied-metropolis-2 |
| South-Asian-inspired: built around the tank and the bazaar, in # by trade, held, for now, by another power. | 1 | r2s-occupied-metropolis-3 | r2s-occupied-metropolis-3 | r2s-occupied-metropolis-3 |
| Greek-inspired, and it shows: built on the open plain. | 1 | r2s-politically_fractured-hamlet-3 | r2s-politically_fractured-hamlet-3 | r2s-politically_fractured-hamlet-3 |
| Ask about the place and you are told it is built on mountain ground. | 1 | r2s-recently_betrayed-hamlet-2 | r2s-recently_betrayed-hamlet-2 | r2s-recently_betrayed-hamlet-2 |
| Ask about the place and you are told it is built by the water, on kin, oath and the assembly. | 1 | r2s-succession_void-hamlet-1 | r2s-succession_void-hamlet-1 | r2s-succession_void-hamlet-1 |
| Greek-inspired, and it shows: built on the coast. | 1 | r2s-succession_void-village-1 | r2s-succession_void-village-1 | r2s-succession_void-village-1 |
| Greek-inspired, built on mountain ground. | 1 | r2s-insurgency-hamlet-0 | r2s-insurgency-hamlet-0 | r2s-insurgency-hamlet-0 |
| Ask about the place and you are told it is built in forest country. | 1 | r2s-insurgency-hamlet-3 | r2s-insurgency-hamlet-3 | r2s-insurgency-hamlet-3 |
| Greek-inspired, and it shows: built on hillside ground. | 1 | r2s-religious_conversion-hamlet-1 | r2s-religious_conversion-hamlet-1 | r2s-religious_conversion-hamlet-1 |
| Steppe-inspired: built for a pastoral life #-settled and #-moving. | 1 | r2s-mass_migration-thorp-0 | r2s-mass_migration-thorp-0 | r2s-mass_migration-thorp-0 |
| Greek-inspired, built on the coast. | 1 | r2s-mass_migration-hamlet-1 | r2s-mass_migration-hamlet-1 | r2s-mass_migration-hamlet-1 |
| Nothing large is decided in <N> until the seat is filled, and meanwhile everyone does as they see fit. | 10 | r2s-succession_void-hamlet-2 | r2s-succession_void-metropolis-2 | r2s-succession_void-hamlet-2 |
| With the seat empty, no # in <N> has the standing to make anyone answer. | 7 | r2s-succession_void-thorp-0 | r2s-succession_void-metropolis-3 | r2s-succession_void-thorp-0 |

## What is left of the worklist (after this seat)

- The cast and hooks: batch 3's patch (8 rows) still has to be gated, measured and pushed. The rest of that group is struck above.
- K8: stopped, for the chair.
- K9: not reached.
- hookTruth.js VILLAGER_TIERS (4 rows: "the war party", "the reformist leader" in one-power thorps): not reached.
- activeConditions.js CONDITION_ARCHETYPE_TEMPLATES (2 rows: "Religious Tension" with no religious record): not reached.
- faithReading.js :: factionLine (03046: a Suppressed faction given "a small voice"): not reached.
- The exports' 29 rows (X9): not taken as a batch. Batch 2 cured its own writers on every surface.
- K12 (1): named above.

## How this seat's instruments were made

As above, with one change: THREE scratch worktrees outside the main checkout, each with node_modules symlinked to wt's:
- wt: the work, on the branch;
- base: detached at the batch's base, which the before census renders from;
- after: detached at the batch commit, which the after census renders from.

A census renders from its tree's src, so rendering the before run from the tree being edited would mix the two. This seat's
first before run did exactly that; it was stopped and re-run from base. Probes over corpus.ndjson.gz that call the tree's
own writers (cultureScopeLine, composeTonightSheet, crisisHooksOf) gave each row's before and after per town in seconds,
ahead of the census.

## How the instruments are re-made

```
git fetch origin lane/chair-2026-11-08 lane/census-3-2026-11-14
git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL docs/chair/2026-11-14/read-all/WORKLIST-CRISIS.json | tar -x -C <scratch>/instr
git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3 | tar -x -C <scratch>/instr
sh <scratch>/instr/docs/chair/2026-11-14/probes/CENSUS-3/census3.sh <tree> <out> 4      # ~22 min
python3 <scratch>/instr/docs/chair/2026-11-14/probes/READ-ALL/inventory.py <out> <inv.json>
python3 <scratch>/instr/docs/chair/2026-11-14/probes/READ-ALL/inventory_diff.py before.json after.json batch.json
```
The base run used a second detached worktree at bcad1a358 whose `node_modules` is a symlink to the scratch tree's.

# TAIL-CRISIS-3 · the third seat's batches (2026-11-15)

Seat TAIL-CRISIS-3 succeeded TAIL-CRISIS-2 on the same branch, at **6a3d98d4c** (origin's tip, read back at the start).
Scratch worktrees: `wt` (the branch, as local branch `tc3-work`, pushed by explicit refspec), `base` (detached at
6a3d98d4c), `after3` (detached at batch 3), `after4` (detached at K9's commit), each with `node_modules` a symlink to wt's.

## The chair's rulings since (2026-11-15; each vetoable by the owner)

- **(K14)** BATCH 3 FIRST: apply the patch, MEASURE it (census before and after, the inventory diff, the inheritors read), and
  land it as the first commit, or tell the chair what the measure refuses.
- **(K8, CHANGED)** 01034: the door has no mode that re-keys one row, so THE ROW WAITS FOR THE CLOSE (the registers are re-derived
  once, on the final tree). The line stays as it stands (4 towns), parked with its proposed wording ("X is in a kingdom at war, and
  some here are doing well out of it: …"). The register is not re-taken.
- **(K9)** THE IRON HOOKS (20893, 22079, 22080, 20908): one commit, by exception: the three literals of the peacetime iron hook
  in `foodBalance.js` (those only) with their keys in `outlookHookSiblings.js`. The iron carts' CONDITION stays DEFECON's.
- **(K10)** `rival power` is true of the SETTLED record: no line rendered before the powers settle is keyed by it; the insurgency
  summary stays on its fallback.
- **(K12)** "{power} no stake yet" (B12521 89 towns; B13860 B18039 13199 06464 13370): a power that the record's quarrels or the
  crisis's own choice names is not said to have no stake. Cure it where the stakes are read, and give the line its verb ("has no
  stake yet"). B11070 B11113 B11121 (the person named is not of the house named).
- **(K13)** `faithReading.js :: seniorClericOf` is TAIL-TITLES's (not edited here); `factionLine` (03046) is this seat's.
- **(K15)** The quick guide's silences that TAIL-CRISIS-2 told (57, about 50, 34, 29, 27 towns): ACCEPTED as told. They stay on
  the veto list with what prints instead.
- **(X9)** The exports' read (WORKLIST3-CRISIS, 29 rows): each checked against the tip, measured with `SURFACES=PDF,Journal`.
- **(K16)** (named by the defence display's seat) 11705 and 14131, `crisisCast.js`: "In the war, the adventurers' charter hall
  leads the defence … with no one named to lead" where the roster names the charter master of that hall: the cast reads the
  people of the house it names.
- **(K17)** (on this seat's K9 stop) TAKE THE FORGE-LESS FORM: the hooks claim the price, the rationing and the mended tools and
  name no smith, forge or iron merchant. The six banked rows that go stale leave through the door's shrink, in the same commit.

## Batch 3 (K14): the cast hooks, TAIL-CRISIS-2's patch — b22761233, PUSHED; the inheritors' fix a99c01e78

Applied clean at 6a3d98d4c. Red at the base: the patch's test, 8 FALSE pairs (TAIL-CRISIS-2 showed 8 of 8 in an it.each
form); a plant (every reason through the old colon form) reds it. One pin re-keyed by identity: `tests/domain/crisisHooks.test.js`
(the lever's colon form). Gates: eslint 0; strict 0; ratchet 167/167; walker 147 at both; crisisHooks' governing tests (12 files):
1 red at the base (`tests/data/w2FixData6Rows.test.js`, CARRIED), the same 1 at the tree once the pin was re-keyed.

**Measured** (census at 6a3d98d4c, `runs/c0`, against b22761233, `runs/c1`; tabs): 29,922 → 29,922 distinct sentences, 121
gone, 121 new, 0 in fewer towns, 0 in more. **All 8 rows GONE**: 11595 5→0, 11549 4→0, 11671 3→0, 11569 2→0, 11668 2→0, B11049
1→0, B11090 6→0, 20875 1→0. No record moves (the hooks are derived at display).

**THE INHERITORS READ** (all 121 are the batch's own reshaped sentences, in the same towns): the predicate reasons now stand
beside the holder ("<N> of Household Council, who holds the seat, is the one who would come to terms."), and a slashed power takes
its prose form ("<N> of The Guard leads the defence.", 11 + 8 towns; the leaf's contract puts "The Guard" mid-sentence). ONE
FAULT FOUND, cured in a99c01e78: the rival instigator's reason "already carries more weight than whoever holds the seat, and
gains as the seat weakens" is the POWER's standing, and the relative clause said it of the person (19 towns for The Independent
Bloc alone). It now reads "<N> of The Independent Bloc, whose power already carries more weight than whoever holds the seat, and
gains as the seat weakens, is stirring it." Also seen in the inheritors, not this batch's: the brunt's garbled "…; next in line,
the first choice already holding a role that contradicts this one" (X9 13939 13943 13999 14045 14043, below).

## Batch 4 (K12; X9's stake rows; 03046) — d667b50e7

Writers:
- `domain/crisis/crisisPage.js :: stakeShown`, with the copy table `CRISIS_PAGE_COPY.stake`. These are DISPLAY only: the record's
  stakes (`stress[].cast.stakes`, crisisCast rule 11) are untouched, and the three surfaces (CrisisTab.jsx, pdf CrisisSections.jsx,
  foundry journalPages.js) read the copy table by key, so none of their files changed. The chair's K12 grants the one function
  "where the stakes are read". crisisPage.js is not on this group's list, and this seat changed nothing else in it.
- `domain/dossier/faithReading.js :: factionLine` and `religiousFactionOf` (the power's `powerLabel`). `seniorClericOf` is
  untouched (K13).

The rule: an untouched power (the record's `split` with the untouched reason) whose name the record's quarrels
(`powerStructure.conflicts`) carry is "already at odds · in its own quarrel with <the others>". The governing power, whose choice
the crisis's own text names ("By City-State Council, which can neither turn people away nor keep them fed"), "must answer for it
· it governs here". Any other untouched power "has no stake yet", or "have …" for a plural name (`pluralPowerName`); with a plural
name its reason reads "they could side with either camp". A religious power whose standing is Suppressed "is suppressed in the
<tier>", not "A small voice in the <tier>'s affairs belongs to …".

Verified by the record before the cure (`probes/stakes.mjs` over the 720, the tree's own writer): 755 untouched stake rows
in 268 towns. 76 towns hold an untouched GOVERNING power (monster_pressure 22, plague_onset 25, mass_migration 29). 137 towns hold
an untouched power the quarrels name. By row: B12521 89 printing, false in 60 (a quarrel); B13860 22, false in 8; B18039 7, false in
1; 13199 2/2, 06464 2/2, 13370 1/1 (the governing power); 03046 1/1, and its shape in 18 towns (17 Religious Authorities).
Test: `tests/domain/tailCrisisBatch4.test.js`, 10 FALSE pairs, red at the base (10 of 10 in an it.each form), and 3 KEEP pairs.
Re-keyed by identity: `tests/domain/crisisPage.test.js` (the label) and `tests/domain/r3c9ReaderLinesTrue.test.js` (n240's
anchor now reads the suppressed line). Governing tests (61 files): 4 failing at the base, the same 4 at the tree once the two pins
were re-keyed (CARRIED: houseLabelEverySurface, phoneChromeFloor.census, vocabularyPageFindings, r3c9ReaderLinesTrue n15).

THE SILENCE TOLD: this re-says the stake line of every untouched power, true ones included, in 268 towns, by the chair's K12
(the verb). No true line goes silent: each row keeps a line, and the true ones keep their meaning.

## Batch 5 (X9: the exports' vantage lines) — 94106a10b

Writer: `domain/crisis/crisisSummaryVantage.js :: CRISIS_SUMMARY_POOLS`. The PDF's cover and overview (`pdf/lib/viewModel.js`)
hand no facts, so each line is reworded to be true in every town that prints it; no twin and no condition. False before, by the
record (food band, institutions):
- 10399 / 16309: 12 printing, 11 false (Secure).
- 31407: 5 printing, 5 false.
- 13667: 11 printing, 8 false (no granary or no watch).
- 09896: 9 printing, 5 false (no market).
- 29529 / 08228: 8 printing, 2 false.
- 15776: 9 printing, 4 false (no watch, militia or garrison).

The war rows (01620 28443 30535) are parked (the door: above). Test: `tests/domain/tailCrisisBatch5.test.js`, 6 FALSE pairs, red at
the base (6 of 6), and 1 KEEP. Governing tests (11 files): the 2 reds of r3c10FoodLinesTrue, CARRIED at the base.

## K9/K17: the peacetime iron hooks — f20ce3151

As K17 ruled, the forge-less form, with the eight stale rows shrunk through the door in the same commit (six of the smith
family, the three old literals in both files; two of the market family, batch 5's). Nothing is banked. Test:
`tests/generators/tailCrisisIronHooks.test.js`, 4 FALSE pairs, red at the base (4 of 4), and 1 KEEP. Re-keyed:
`tests/generators/hookTablesDeclared.test.js`. Governing tests (79 files naming foodBalance or outlookHookSiblings): 9 failing at the base, and the
same 9 at the tree (CARRIED: famineStoresOneRounding, worldFactRederive, hookTruthAtBirth ×2, urbanBandInstitutions,
proseWiringCensus.walker ×3, generatorGoldenMaster). **DECLARED MOVE** (field diff by family, census before against after, over
the 720 records): `economicViability`, 88 records, only its `plotHooks` (the three hooks' towns: 30 + 36 + 22). No other family
moves, and no draw moves.

## Batches 4, 5 and K9 · measured together (census at b22761233, `runs/c1`, against f20ce3151, `runs/c2`)

One after-run measured four commits: batch 4, batch 5, batch 3's inheritors' fix (a99c01e78) and K9. They touch disjoint lines.
- **Tabs:** 29,922 → 30,042 distinct sentences; 94 gone, 214 new, 4 in fewer towns, 0 in more. The tab inventory splits a stake
  row at " · ", so its parts count apart.
- **Exports (PDF, Journal):** 35,828 → 36,090; 193 gone, 455 new, 4 in fewer towns, 0 in more.
- **GONE, every cured row:**
  - tabs: B12521 89→0, B13860 22→0, B18039 7→0, 13199 2→0, 06464 2→0, 13370 1→0, 03046 1→0, 22079 36→0, 22080 22→0, 20908 27→0.
    B11113 had already gone in batch 3.
  - exports: 16606 89→0, 20361 41→0, 20281 22→0, 22263 9→0, 25559 7→0, 26048 3→0, 10399 12→0, 16309 12→0, 13667 11→0, 09896
    9→0, 15776 9→0, 29529 8→0, 08228 8→0, 31407 5→0. Also 22718 8→0 by its fold: it now reads "Revolt Leadership has no stake yet",
    which is STILL FALSE in meaning (parked above).
- **Unchanged, as intended:** the struck rows (B03437 B03438 B03478 B03479 B15536 B15562 B11070 B11121), 20893 (DEFECON's
  condition), and X9's parked rows.
- **In fewer towns (4, the same on both):**
  - "it could side with either camp" 268→160: the plural names now say "they …";
  - "A small voice in the city's / metropolis's / town's affairs belongs to the Religious Authorities." 23→16, 33→27, 14→10:
    the 17 towns whose Religious Authorities stand Suppressed, false there.
- **THE INHERITORS READ:** all 214 (tabs) and 455 (exports) are this run's own lines, each read where it prints (the veto list).
  The widest are "they could side with either camp" (125), "it governs here" (76), "Arcane Orders have no stake yet" (72) and
  "Merchant Guilds are already at odds" (60). Every "already at odds" names the record's own quarrel partner.
- Gates at f20ce3151:
  - eslint on the touched files: 0;
  - typecheck:domain:strict: 0 and the ratchet 167/167, both at batch 4's tree;
  - the walker: 147 fresh, 0 stale;
  - the twelve-birth grid: 2 falls (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a), carried.

## THE VETO LIST (this seat): every new or changed line (smallest town, largest, a crisis town)

| new line (fold) | towns | smallest | largest | a crisis town |
|---|---|---|---|---|
| <N> of <P>, who <predicate reason>, … (the cast hook's reasons said of the holder; batch 3) | 121 folds | r2r-thorp-22 | r2r-metropolis-4 | r2s-indebted-thorp-1 |
| <N> of <P>, whose power already carries more weight than whoever holds the seat, and gains as the seat weakens, is stirring it. | 19 (The Independent Bloc) + others | r2r-hamlet-35 | — | — |
| <N> of The Guard … (a slashed power's prose form in a hook) | 11 + 8 + 6 … | — | r2r-metropolis-4 | r2s-monster_pressure-city-0 |
| <P> has no stake yet · it could side with either camp | 160 | r2r-hamlet-32 | r2s-wartime-metropolis-3 | r2s-infiltrated-hamlet-0 |
| <P> have no stake yet · they could side with either camp | 125 | r2r-village-57 | r2s-wartime-metropolis-3 | r2s-famine-village-2 |
| <P> are already at odds · in their own quarrel with <Q> | 106 | r2r-village-24 | r2s-wartime-metropolis-3 | r2s-famine-town-0 |
| <P> must answer for it · it governs here | 76 | r2r-thorp-10 | r2s-plague_onset-metropolis-3 | r2s-mass_migration-thorp-0 |
| <P> is already at odds · in its own quarrel with <Q> | 51 | r2s-mass_migration-hamlet-2 | r2s-slave_revolt-metropolis-3 | r2s-mass_migration-hamlet-2 |
| The <P> is/are suppressed in the <tier>. | 18 | r2r-town-21 | r2s-wartime-metropolis-2 | r2s-monster_pressure-town-2 |
| What iron there is goes out in rations, and work waits on mended tools. | 36 | r2r-city-27 | r2s-succession_void-metropolis-2 | r2s-succession_void-metropolis-2 |
| Iron has doubled in price this season, and tools are being mended with scrap. | 27 | r2r-city-11 | r2s-slave_revolt-city-0 | r2s-slave_revolt-city-0 |
| People blame whoever set it, and the tools still need mending. | 22 | r2r-city-10 | r2s-succession_void-city-1 | r2s-succession_void-city-1 |
| Iron has doubled in price this season, and metal for tools and repairs is hard to come by. | 3 | r2r-town-49 | r2s-recently_betrayed-town-2 | r2s-recently_betrayed-town-2 |
| <N> has many more mouths to feed than it had, and there is not work enough for the newcomers. | 12 | r2r-city-3 | r2s-mass_migration-village-2 | r2s-mass_migration-village-2 |
| In <N> whatever food is put by is watched day and night, and nobody carrying a sack goes unquestioned. | 11 | r2r-hamlet-28 | r2s-wartime-thorp-2 | r2s-wartime-thorp-2 |
| People in <N> keep an eye on the roads and the edges of the fields, and nobody lingers outside once the light goes. | 9 | r2r-village-41 | r2s-monster_pressure-town-3 | r2s-monster_pressure-town-3 |
| Fewer people come to <N> since the sickness began, and fewer goods come with them. | 9 | r2r-city-19 | r2s-plague_onset-village-2 | r2s-plague_onset-village-2 |
| Travel is discouraged in <N>, and fewer come and go than before the sickness. | 8 | r2s-plague_onset-city-2 | r2s-plague_onset-village-3 | r2s-plague_onset-city-2 |
| With so many new mouths in <N>, there is not work for everyone who wants it. | 5 | r2r-village-28 | r2s-mass_migration-town-3 | r2s-mass_migration-town-3 |

(The smallest and largest columns of the last ten rows are the first and last town by name in the inventory, not by size. The
stake rows' columns are by size.)

## Rows struck (true by the record; this seat)

- **B03437 B03438 B03478 B03479** ("An old story from that time: a diplomatic channel exists that the war party is
  suppressing" / "…the reformist leader is being blackmailed into silence"; the worklist traced them to VILLAGER_TIERS). These are
  the hooks of the town's own historical event (`history.historicalEvents[]`, data `historyData.js`), and the event's own
  description names the sides. Every one of the 79 war-party hooks on the 720 belongs to an `external_threat` event ("…split the
  settlement over whether to fight, treat, or flee", "…set the community against itself over the right response"). Every one of
  the 48 reformist hooks belongs to a `religious_tension` event ("Competing creeds vied for converts…", "Different faiths or
  interpretations competed…"). The war party and the reformists are that event's camps, not powers of today's roster. The
  readers' QUARRELS line showed only today's conflicts. `hookTruth.js` is not changed.
- **B15536 B15562** ("Religious Tension" / "Religious tension", 15 towns each; traced to CONDITION_ARCHETYPE_TEMPLATES). These are
  the label of the record's own `history.currentTensions[]` entry of type `religious_tension` (r2s-infiltrated-thorp-3: the
  orthodox clergy, Reformists, the Secular camp), which the readers' header lacked (X9's note). `activeConditions.js` is not
  changed. Seen, not cured: that tension names "the orthodox clergy" in a thorp with no religious house (HISTORY's writer).
- **B11070 B11121** (K12 (2)): re-verified on the record at 6a3d98d4c, and TAIL-CRISIS-2's strike stands. Jade Ek holds a membership in the
  Elder Council (rank 3). Anusaya Mishra holds a membership in Merchant Guilds (share 0.4, beside Military/Guard 0.6).
- **B11113**: its person claim is true (Sorcha Tobin holds the parish church, the outbreak's lever). Its subjectless colon form
  is cured by batch 3 ("…, who runs the office that decides how the crisis goes, holds the key to it.").
- **X9 27937, 01755**: gone at the base (27937 went 24 → 17 on the exports, and no longer prints in the town read; 01755 → 0):
  cured by batch 1's writers.

## Rows parked or named (this seat)

- **01034** (K8 as changed): parked for the close, 4 towns, as it stands; the proposed wording is in batch 1's parked list.
- **X9 01620 28443 30535** (the wartime vantages' "army carts pass through" and "the carts going by", 9 towns each, false in an
  isolated thorp): the literals are banked in the widened register's `war` family, so a reword is a fresh hit (149 against 147).
  This is the K8 wall. Ready and parked: "{name} is in a kingdom at war, and the war is all anyone talks about." / "The war is far
  from {name}, but it touches every household: the prices and the news."
- **X9 22718** ("Revolt Leadership has no stake yet · it could side with either camp", 8 towns): the revolt's own leadership has
  a stake in the revolt. The power is raised by the crisis itself (`generators/power/stressFactions.js`, which exports no table of
  the powers it raises), so the page cannot tell it apart from any other untouched power. The cure is in
  `crisisCast.js :: deriveStakes` (STORED: a declared move): a power the stress raised loses or gains by it. Not taken this session.
- **X9 20882** ("Occupation Authority gains: the military gains in a vacuum of governance", 3) and **07387** ("Craft Guilds gains:
  the merchants gain while the seat is endorsed", 2): `crisisCast.js :: deriveStakes`, stored. Not taken.
- **X9 13909** ("…of Merchant Guilds is the one who would come to terms: a member of the merchants' power, with the seat itself in
  dispute", 3): `crisisHooks.js` LINE_ROLE_CLAUSE. Not taken.
- **X9 13939 13943 13999 14045 14043** (the brunt's "…; next in line, the first choice already holding a role that contradicts this
  one", 1 town each): `CAST_REASONS.nextInLine` is machinery that leaks into the hook and the page. Not taken.
- **X9 27012** ("…if it gives way, Military/Guard loses most", 1): batch 3 now prints "The Guard". The reader also says a
  Suppressed power is not the one that loses most; that is `deriveStakes`. Not taken.
- **K16 11705 14131** (the charter hall "leads the defence … with no one named to lead" where the roster names its charter
  master): `crisisCast.js` (the defender rule, stored). Not taken this session.
- **NAMED for HISTORY:** `src/data/stressTypes.js:104` and `stressTypesMeta.js:64`, the plague's viabilityNote "Fewer people come
  to market, travel is discouraged, and some goods stop arriving.": the same market presumption as X9 09896.
- **NAMED (seen, same writer, not a worklist row):** the crisis page's "gains" and "loses" do not agree with a plural name
  ("Merchant Guilds gains", "Craft Guilds gains"). Batch 4 made only its own new labels agree (`untouchedMany`, `atOddsMany`);
  the same copy table takes `gainsMany`/`losesMany` the same way. The stake rows also print a power's raw label ("Military/Guard
  has no stake yet"): the three surfaces print `factionId`, not `powerSentenceName`.
- **The iron war hook** (WAR_IRON_HOOK, "…and the smiths have nothing to mend tools with"): the same plural "smiths". It is
  outside K9's three literals and stays as it is.

## Registers named stale

- The sovereignty walker's estate file count: four more test files from this seat (tailCrisisBatch3, tailCrisisBatch4,
  tailCrisisBatch5, generators/tailCrisisIronHooks), on top of the earlier seats' three. Re-taken through its own door at the close.
- The widened presumed-things register was SHRUNK through its door in f20ce3151 (eight rows, named in that commit). Nothing stale
  is left.

## What is left of the worklist (after this seat)

- K16 (11705 14131), X9 22718 20882 07387 27012: `crisisCast.js`, the stored cast and stakes (a declared move each).
- X9 13909 and the five `nextInLine` rows: `crisisHooks.js` and CAST_REASONS.
- X9 01620 28443 30535 and 01034: parked behind the walker's door.
- 20893: DEFECON's condition.
- `activeConditions.js` and `hookTruth.js`: nothing left (their rows are struck above).

## How this seat's instruments were made

As TAIL-CRISIS-2's, with one change: the census's count and writer-tracing stages were stopped once the 720 dumps were written.
The inventory reads only `dumps/`, and the corpus is written at births. The probes (`stakes.mjs`, `faith.mjs` in the scratch
directory) import the tree's writers and run them over `corpus.ndjson.gz`.

## THE CHAIR'S "FAULTS IN NEW LINES: FIRST" (01:56 UTC, READ-ALL-4 at landed tip 9eb084705): TAKE THESE BEFORE THE REST

TAIL-CRISIS-3 handed back at its count (about 65 minutes in, judged by time) when this note arrived. Each item was measured on
this seat's after-census (`runs/c2`, f20ce3151's src, tabs). NONE IS CURED; THE NEXT SEAT TAKES THEM FIRST:
1. `crisisSummaryVantage.js`: "Passing through <N>, you would not see the quarrel over who is really in charge unless you asked."
   10 towns, all of them insurgency (batch 1's reword of B14649). It is false where the page prints open confrontations beside it
   (r2s Kaanche: safety Dangerous). The cure is a reword true under an open insurgency, or a fact-keyed twin on the tonight surface,
   the one that hands facts.
2. `settlementQuickGuide.js`:
   - "built around the tank and the bazaar" (11 folds, 43 towns at f20ce3151): verify each town's houses for a tank, reservoir or
     bazaar, and strike the clause where none stands (`scopeAgainstRule`'s form, batch 2);
   - "built for a pastoral life half-settled and half-moving" (13 folds, 35 towns) in a coastal trading port with no herds: read
     the food record's herd (the culture lines' herding rule, r3c10).
3. `crisisCast.js` (CAST_REASONS.bruntOnly / bruntLeast) via `crisisHooks.js`: "…takes the worst of it: the only one in the house
   the crisis hits" (26 towns) and "…the one with the least say in the house the crisis hits" (13). In a famine the crisis hits the
   whole thorp, and "the house" reads as a household. Say the power ("the only one of <power> …") or cut the clause. The reasons
   are STORED on the cast, so a change is a declared move, unless the hook re-says it at display (batch 3's castSentenceOf form).
4. `crisisHooks.js` "<person> of Military/Guard takes…": ALREADY CURED at this branch's tip by batch 3 (holderWords reads
   `powerSentenceName`: "of The Guard"; 0 hook sentences with "of Military/Guard" in `runs/c2`). The landed tip 9eb084705 predates
   it. The remaining "first of Military/Guard" / "second of Military/Guard" (248 and 226 towns) are rank chips, not this group's
   writer.

# TAIL-CRISIS-4 · the fourth seat's batch (2026-11-15)

Seat TAIL-CRISIS-4 succeeded TAIL-CRISIS-3 on the same branch, at **572cd48e0** (origin's tip, read back at the start).
Scratch worktrees outside the main checkout: `wt` (the branch, as local `tc4-work`, pushed by explicit refspec), `base`
(detached at 572cd48e0), `after6` (detached at batch 6's second commit), each with `node_modules` a symlink to wt's.

## The chair's rulings since (2026-11-15 02:10 UTC; each vetoable by the owner)

- **(K18) THE VANTAGE THAT HIDES A QUARREL.** "Passing through <N>, you would not see the quarrel over who is really in
  charge unless you asked." printed in 10 insurgency towns whose safety reads Dangerous with open confrontations printed
  beside it. The line needs a quarrel that is NOT in the open (no insurgency, no open confrontation on the record); else
  its pool's other line.
- **(K19) A CULTURE PHRASE NAMES ONLY WHAT STANDS** (the layout line's law, J1, carried to the quick guide): "built around
  the tank and the bazaar" (11 folds, 43 towns) and "built for a pastoral life half-settled and half-moving" (13 folds, 35
  towns, a coastal trading port among them). Each physical thing a scope phrase names maps to houses or resources of the
  record (a bazaar: a market; a tank: a water work; a pastoral life: herds or pasture on the record), or the phrase takes a
  twin that names none of them, or is silent. `scopeAgainstRecord` is where it belongs. The silence is accepted in advance
  where the measure shows the phrase false.
- **(K20) THE CAST'S REASON.** "…takes the worst of it: the only one in the house the crisis hits" and "…the one with the
  least say in the house the crisis hits" (26 and 13 towns; stored cast reasons). A famine or a siege hits the whole town,
  and "the house" reads as a household. The reason says in plain words what the record holds (whose seat on which power;
  what the crisis does to that person's own trade), or the clause after the colon is cut. A DECLARED MOVE of stored text is
  GRANTED (39 towns' cast reasons), its own commit, measured by the field diff (no family but the cast's reason).
- **(U1)** The account's weekly usage warning is on: commit and push every batch the moment it holds, with WHAT IS LEFT
  current in the same push; hand back at 250,000 of the count (about seventy minutes if the meter reads 0).

## Batch 6 (K18 K19 K20): 34b8d9411 (K18, K19, display) and c97caccd9 (K20, the declared move)

### Verified by the record first (probes over `runs/c0/corpus.ndjson.gz` with the base's own writers)

- **K18.** All 37 insurgencies hold `crimeTypes` "political violence" (29 "Street-level confrontations between insurgent
  supporters and the watch", 8 "Targeted intimidation and occasional violence against officials") and "loyalty testing"
  (37 of 37: "Both the governing power and the insurgency pressure individuals to declare allegiance"). So every line of the
  insurgency pool that hides the quarrel is false wherever it prints. The ruling's line and FOUR SIBLINGS OF THE SAME SHAPE
  in the same pool: the defence watch "There is no fighting in <N>; the danger is quieter …" (14 towns, batch 1's 22640
  reword), the cover watch "Nobody in <N> fights in the open …" (10, exports), the cover traveller "<N> looks calm, but …"
  (14, exports), the tonight watch "… grows quietly, and those watching it cannot act in the open." (6). The defence and
  cover surfaces hand no facts (DefenseTab.jsx, pdf viewModel), so each line is reworded to be true in all 37.
- **K19, the tank.** Of the 43 towns, the market fact holds in all 43. A water work (`WATERWORKS_HOUSE`: aqueduct, cistern,
  water system, fountain, bathhouse; or a metropolis's "Advanced water infrastructure": "multiple aqueducts, cisterns") stands
  in 32. The 11 others hold only "Multiple water sources" ("Wells and springs throughout village"; the file's own rule: a
  well or a spring is not a water work): r2r-village-1 -village-28 -town-7 -town-18 -town-32 -town-42 -town-49,
  r2s-indebted-town-3, r2s-succession_void-town-0, r2s-monster_pressure-village-2, r2s-wartime-village-1. The temple the
  phrase also names stands in all 43.
- **K19, the pastoral life.** Of the 35 towns (every one a thorp, hamlet or village: the large tiers already take "built on
  clan lines"), 30 hold neither herds (the vocabulary's `livestock` on the food record's sources) nor pasture
  (`grazing_land`): among them the coastal ports r2r-hamlet-4, -hamlet-41, -village-45, -village-59, r2s-mass_migration-thorp-0
  (fed by their fish). Five keep the line (r2r-thorp-29 and r2s-plague_onset-village-1 by their pasture, three by their herds).
- **K20.** On the stored casts: 26 towns "only" (22 famine, 3 migration, 1 outbreak), 13 "least say", and 10 "one of the
  house" (`bruntMember`, the lever-holder's rewrite, with the parked nextInLine tail). Each "only" holder is the one member
  on the roster of exactly one power whose stake is a loss; each "least say" holder is the lowest-ranked member of exactly
  one such power (12 of 13 the hook's own "of <P>"; r2r-city-19's hook names Royal Authority, the power hit is the Religious
  Authorities). The claims hold; the fault is "the house" alone.

### The cures

- **K18** (`crisisSummaryVantage.js`, the insurgency pool; five lines reworded, no twin, no condition):
  defence traveller → "Travellers in <N> are pressed, sooner or later, to say which side they are on, and both sides take
  note of the answer." (the record's loyalty testing); defence watch → "In <N> the quarrel over who is in charge has turned to
  violence, and orders go unheeded and dues unpaid."; cover watch → "In <N> both the government and those who defy it press
  people to say which side they are on, and those watching count who has stopped obeying."; cover traveller → "In <N>
  orders go unanswered, and some of its people have turned against those in charge."; tonight watch → "The defiance of
  <N>'s government grows, and those watching it count who still obeys and who has stopped."
- **K19** (`settlementQuickGuide.js :: scopeAgainstRecord`, display only): the tank where no water work stands is struck
  ("built around the bazaar"); the bazaar where the market fact is false (none in the 720), and both (the phrase keeps "under
  …"). The pastoral life where the record holds neither herds nor pasture takes the large tiers' own twin "built on clan
  lines"; an unanswered record keeps it. `scopeAgainstRule` then says "built on clan lines, held by clan" once
  ("built on clan lines"). The twin was already on batch 2's veto list.
- **K20** (`crisisCast.js :: CAST_REASONS`, stored): bruntOnly "the only one named here of a power that loses by the crisis",
  bruntLeast "the one with the least say in a power that loses by the crisis", bruntMember "one of a power that loses by the
  crisis". The words name no power, so factionRename.js's law for this vocabulary (a fixed vocabulary that names nobody)
  holds, and a renamed power can never leave a stale name in a stored reason. The caster's prefix rewrite (least → member)
  keeps its shape. **bruntMember is beyond the 39 granted** (10 towns more, the same constant family and the same fault):
  told to the chair with this hand-back; its nextInLine tail stays as parked.

Test: `tests/domain/tailCrisisBatch6.test.js` (12 FALSE pairs, red at 572cd48e0 12 of 12 in an it.each form; 3 KEEP pairs,
green at both; a plant (the tank read switched off) reds it). Re-keyed by identity in the K18/K19 commit:
`tests/domain/tailCrisisBatch1.test.js` (r2r-thorp-52's defence watch twin) and `tests/domain/tailCrisisBatch2.test.js`
(r2s-occupied-hamlet-0's pastoral twin).

### Measured (census at 572cd48e0, `runs/c0`, against c97caccd9's src, `runs/c1`; inventory_diff over the batch's 50 folds)

- **Tabs:** 30,042 → 30,044 distinct sentences; 38 gone, 40 new, 9 in fewer towns, 4 in more, 0 moved. **Exports (PDF,
  Journal):** 36,090 → 36,092; 60 gone, 62 new, 9 fewer, 4 more.
- **By the measure before, every row to its true remainder:** "the house the crisis hits" 49 → 0 towns (26 + 13 + 10);
  "would not see the quarrel" 10 → 0; "There is no fighting" 14 → 0; "grows quietly" 6 → 0; "tank and the bazaar" 43 → 32
  (the 11); "pastoral life" 35 → 5 (the 30). On the exports also "looks calm" 14 → 0 and "fights in the open" 10 → 0.
- **Other sentences in fewer towns:** none but the batch's own folds (every one of the 9 is a tank or pastoral frame).
  **In more towns (4):** the Steppe frames of "built on clan lines" (6→10, 8→11, 12→14, 10→11): the twin, true where no
  herd or pasture stands.
- **THE INHERITORS READ** (44 tabs, 66 exports; all are this batch's own lines, each read where it prints): the brunt hooks
  ("In the famine, <N> of Elder Council takes the worst of it: the only one named here of a power that loses by the crisis.")
  and the crisis page's "bears the brunt: <N> · …"; the five insurgency lines in all their towns; the scope twins. No line
  outside the batch inherits.
- **DECLARED MOVE** (field diff by family, c0 against c1, the 720 records): `stress` and `stressors`, 49 records each, only
  `cast.roles[].reason` (40 + 9 array-form entries). No other family moves, and no draw moves.

### Gates (at the tree against 572cd48e0)

- eslint on the touched files: 0. typecheck:domain:strict: 0 (a first draft's `atomHolds` argument raised it by one and was
  cast as crisisSummaryVantage.js casts it). typecheck:ratchet: OK (167, ceiling 167).
- The presumed-things walker `--check`: 147 fresh at base and tree, the same 147 rows (diffed).
- The governing tests (57 files naming crisisCast, crisisSummaryVantage, settlementQuickGuide, CAST_REASONS,
  cultureScopeLine): 10 failing assertions at the base and the same 10 at the tree once the two pins were re-keyed
  (CARRIED, not this seat's).
- The twelve-birth grid `page-census.mjs --grid`: 2 falls at both (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a), carried.

## THE VETO LIST (batch 6): every new or changed line (smallest town, largest, a crisis town; tabs and exports)

| new line (fold) | towns | smallest | largest | a crisis town |
|---|---|---|---|---|
| the only one named here of a power that loses by the crisis (the cast's reason; the hook after "takes the worst of it:") | 26 | r2r-thorp-17 | r2s-plague_onset-town-2 | r2s-famine-thorp-0 |
| the one with the least say in a power that loses by the crisis | 13 | r2r-hamlet-16 | r2s-plague_onset-city-3 | r2s-famine-village-0 |
| one of a power that loses by the crisis; next in line, … (the tail parked) | 10 | r2r-hamlet-10 | r2s-monster_pressure-city-2 | r2s-famine-village-1 |
| In <N> orders go unanswered, and some of its people have turned against those in charge. (exports) | 14 | r2r-thorp-25 | r2s-insurgency-metropolis-3 | r2s-insurgency-thorp-3 |
| In <N> the quarrel over who is in charge has turned to violence, and orders go unheeded and dues unpaid. | 14 | r2r-thorp-25 | r2s-insurgency-metropolis-3 | r2s-insurgency-thorp-3 |
| In <N> both the government and those who defy it press people to say which side they are on, and those watching count who has stopped obeying. (exports) | 10 | r2r-thorp-22 | r2s-insurgency-metropolis-2 | r2s-insurgency-thorp-0 |
| Travellers in <N> are pressed, sooner or later, to say which side they are on, and both sides take note of the answer. | 10 | r2r-thorp-22 | r2s-insurgency-metropolis-2 | r2s-insurgency-thorp-0 |
| The defiance of <N>'s government grows, and those watching it count who still obeys and who has stopped. | 6 | r2s-insurgency-thorp-1 | r2r-metropolis-26 | r2s-insurgency-thorp-1 |
| Steppe-inspired…: built on clan lines, held by clan and caravan. (five frames) | 8+4+4+2+1 | r2r-thorp-3 | r2s-slave_revolt-village-2 | r2s-under_siege-thorp-0 |
| Steppe-inspired…: built on clan lines. (the twin, in more towns) | +4 +3 +2 +1 | r2r-thorp-21 | r2r-village-59 | r2s-mass_migration-thorp-0 |
| Steppe-inspired: built on clan lines, held, for now, by another power. | 1 | r2s-occupied-hamlet-0 | — | r2s-occupied-hamlet-0 |
| South-Asian-inspired…: built around the bazaar, in quarters by trade, under temple and guild. (four frames) | 2+2+1+1+1 | r2r-town-7 | r2s-succession_void-town-0 | r2s-indebted-town-3 |
| South-Asian-inspired…: built around the bazaar, under the temple. (three frames) | 2+1+1 | r2r-village-1 | r2r-village-28 | r2s-wartime-village-1 |

## Registers named stale (this seat)

- The sovereignty walker's estate file count: one more test file (tests/domain/tailCrisisBatch6.test.js), on top of the
  earlier seats' seven. Re-taken through its own door at the close.

## Rows parked or named (this seat)

- **bruntMember** (10 towns) went with K20, beyond the 39 granted: for the chair's veto.
- Seen in the inheritors, style only (true): "built on clan lines, held by clan and caravan" says the clan twice (19 towns).

## What is left of the worklist (after this seat)

**(DONE by TAIL-CRISIS-5: cd0b1ab7b; see its part below.)** **FIRST: K21, THE LATE RE-READ (the chair's ruling of 2026-11-15 02:29 UTC, vetoable by the owner; it reached this seat at
02:58, after batch 6 was pushed, and the count would not hold a packet of two censuses, so it is written here FIRST for the
successor).** The ruling, copied: the late re-read, the measuring seat's recommendation, is this seat's to build.
`git fetch origin lane/order-measure-2026-11-15`; read `docs/chair/2026-11-15/ORDER-MEASURE-1.md` sections "THE ANSWER,
FIRST", 5 and "RECOMMENDATION, AND WHAT IT LOSES" only. The patch is
`docs/chair/2026-11-15/probes/ORDER-MEASURE-1/cures/c1b.patch` (draw-free; BYTE-IDENTICAL on the 720 and 0 of 525 golden
keys moved by its own measure: SHOW BOTH AGAIN before a declaration is added). `src/generators/steps/assembleSettlement.js`
is LENT for its hunks. In the same packet, the two declarations it was made for, each with its twin:
- the insurgency summary keyed "a rival of standing" (this group's atom `rival power`, true of the SETTLED record; the late
  pass is what makes that so; 16 false towns to none, modelled: measure it; K10's hazard is what the late pass answers);
- "defences built for quieter times" (a defence that exists);
- and THE GUARD the report names: a sibling declaration whose needs read the powers resolves after the last roster write.
A patch from a measuring seat is a candidate: run the tests it did not, read the inheritors.

What this seat checked (02:59): `git apply --check` of c1b.patch at e040663dd is CLEAN (one file, +4 lines). It keeps each
entry's `summaryRoll` in a Map before the roll is deleted, and after `resolveFactionLabelsAtClose` re-renders `e.summary`
with the same roll and the final facts, and re-resolves `crisisHook` and `viabilityNote` through STRESS_TYPE_SIBLINGS. Two
things to read before building on it: (1) the second resolve runs on text the first resolve already resolved: a twin that is
not itself a key stays as the first pass left it, and a `viabilityNote` the first pass DROPPED (`dropRefused`) is gone and
cannot be re-admitted by the settled facts; (2) the stored summary then differs from a summary rendered at :219 wherever a
keyed line's needs change between the two passes, so every new `needs:` on the summary is a declared move (field diff:
`stress`/`stressors` `summary` only).

THEN, every row left is parked, another seat's, waits under five towns, or needs a stored move not granted:
- **X9 22718** ("Revolt Leadership has no stake yet", 8 towns): DONE by TAIL-CRISIS-5 (K22, 07ab77b03).
- **K16 11705 14131** (2 towns), **X9 20882** (3), **07387** (2), **27012** (1), **13909** (3): under five towns, they wait.
- **Parked as written:** 01034 and X9 01620 28443 30535 (the walker's K8 wall); the stored cast rows; the five nextInLine rows.
- **20893:** DEFECON's condition. The Germanic "built in timber and stone" on desert ground (4 towns): waits.

## How this seat's instruments were made

As TAIL-CRISIS-3's: the census with `--count-only`, its count stage stopped once the 720 dumps were written (the inventory
reads only `dumps/`; the corpus is written at births). The probes (`probes/k1920.mjs`, `k18.mjs`, `k20.mjs`, `scope.mjs`,
`fielddiff.py` in the scratch directory) import a tree's writers and run them over `corpus.ndjson.gz`; the field diff walks
the two corpora by family and path.

# TAIL-CRISIS-5 · the fifth seat's batches (2026-11-15)

Seat TAIL-CRISIS-5, successor of TAIL-CRISIS-4, on the same branch from its tip **3f45e6fa9** (read back from origin; nothing
later there). Work in scratch worktrees outside the main checkout: `wt` (pristine at the base, which the before census and the
base births render from), `dev` (the work, detached, pushed with an explicit refspec), `c1b` and `k22` (variants and plants).

## The chair's rulings since (2026-11-15; each vetoable by the owner)

- **(K21) THE LATE RE-READ**, the measuring seat's recommendation (ORDER-MEASURE-1, cure C1b), this seat's to build, with the
  two declarations it was made for, each with its twin: the insurgency summary keyed "a rival of standing" (the atom `rival
  power`, true of the SETTLED record: the late pass is what makes that so; 16 false towns to none, modelled: measure it), and
  "defences built for quieter times" (a defence that exists: measure the towns first); and THE GUARD the report names (a
  sibling declaration whose needs read the powers resolves after the last roster write). `assembleSettlement.js` LENT for
  its hunks. A patch from a measuring seat is a candidate: run the tests it did not; read the inheritors; read the two
  hazards before the first edit and say how each was met.
- **(K22) THE STORED STAKE ROW** (the exports' 22718, 8 towns, `deriveStakes`): a declared move of stored text is GRANTED,
  its own commit, measured by the field diff (no family but the stake's text).
- **(K23) NO VETO on K20's reach** (the same constant in `bruntMember`, 10 towns beyond the 39 granted): it stands, listed.
- THEN: what the hand-back leaves that prints in five towns or more, widest first. The parked rows stay parked as written
  (the banked `war` literal; the stored cast rows; nextInLine).
- **(U1)** carried: commit and push every part the moment it holds, with WHAT IS LEFT current in the same push.

## K21: the late re-read, with the insurgency's declaration and the guard

### The patch shown again at the tip, before any declaration (births-only over the 720; `bytecmp.mjs`; `goldencmp.mjs`)

- `c1b.patch` as received, applied at 3f45e6fa9: **byte-identical 720 of 720**; the golden corpus **0 of 525** keys moved
  against the base (both trees hashed the same way, `generatorGoldenMaster.test.js :: hashFor`'s births).
- This seat's form of it (below): **byte-identical 720 of 720**, golden **0 of 525**.

### The two hazards, and how each was met

1. **The second resolve ran on text the first resolve had already resolved** (a twin that is not itself a key stayed as the
   first pass left it; a `viabilityNote` the first pass dropped was gone and could not come back). MET: the late pass does
   not re-resolve the stored text. The first pass keeps, beside the roll, the CATALOGUE hook and note as `resolveStress`
   stored them (in a Map in the assembly's closure, never on the record), and the late pass resolves THOSE ORIGINALS
   against the settled record: a twin is re-decided from its key, and a note the first pass dropped is re-admitted where the
   settled record admits it. One function (`readStressEntry`) is both passes. Measured: byte-identical on the 720 (no hook or
   note decision differs between the two passes today), golden 0 of 525.
2. **The stored summary then differs from the summary rendered at the first pass wherever a keyed line's needs change
   between the passes, so every new `needs` on the summary is a declared move.** MET: the insurgency declaration is measured
   as a declared move by the field diff (below): `stress` and `stressors`, `summary` only, 21 records. The window between
   the passes (the arrival scene to the label close) is named at the late pass in the source: no writer there reads a stress
   entry's summary, hook or note (by grep: the only readers of `stress.summary` in `src/generators` are the receipt, after
   the late pass, and the quick guide at render); the plant measure below confirms it (keyed at the first pass, only
   `summary` moves: nothing in the window read it).

### The declarations, measured by the record first (probe `k21.mjs` over the base corpus, the tree's own `factsOf`/`atomHolds`)

- **Insurgency (37 towns).** At the base every one prints the plain fallback (K10). By the SETTLED record 21 hold a rival
  of standing and 16 do not. The plant (the strong line keyed at the first pass, no late pass) prints the strong line in
  31 towns, **10 of them false** (r2r-thorp-22 -thorp-29 -thorp-52, r2s-insurgency-thorp-0 -1 -2, -hamlet-0 -1 -2 -3: the
  rival lost in the resize): the K10 hazard reproduced. With the late pass: **strong in 21, every one with a rival of
  standing; plain in 16, every one without; 0 false.** The modelled 16 → 0 holds.
- **"Its defences were built for quieter times" (monster_pressure, 34 towns).** Declared since batch 1 in the renderer
  (`MONSTER_DEFENCES`, every one refused → "It has nothing built or kept to hold such things off."). By the settled record:
  17 print it, **all 17 keep a defence**; 17 take the twin, all 17 keep none; no atom unanswered. The towns were measured
  first: the line is true wherever it prints, at the base and after; the late pass now reads it against the settled record
  (no town moves: the defence atoms are final before the first pass).

### The cures

- `src/generators/steps/assembleSettlement.js` (LENT): `stressLateReads` (the roll and the catalogue hook and note, kept)
  and `readStressEntry` (one entry rendered and resolved against the record as it stands); the first pass calls it as
  before; THE LATE RE-READ calls it again after `resolveFactionLabelsAtClose`, before the trace copy and the receipt.
  Draw-free; nothing new persists.
- `src/generators/stressNarrative.js :: RENDERERS.insurgency`: a pool of two at its print site (the file's own form, as
  famine and monster_pressure): `atomHolds('rival power', facts) === true` gives K6's strong line; anything else (refused,
  unanswered, no facts) the plain line.

### THE GUARD (`tests/generators/stressLateReRead.test.js`)

(1) Source order: the late re-read stands after `reconcilePowerStructure(`, `resizePoliticalRoster({`,
`storeTrueHooksOnly(settlement` and `resolveFactionLabelsAtClose(settlement)`, and before
`buildGenerationCoherenceReceipt(`. (2) On births: every stored summary (not wartime, whose roll is not kept) equals its
renderer against the town's FINAL record: a declaration added later that reads a fact settled after the first pass reds on
any seed it moves. (3) Pairs: the strong line in 4 rival towns (red at the base: the plain line); the plain line in the 10
towns that lose their rival in the resize (green at the base; red under the plant); KEEP: 2 towns that never held a rival,
3 defended and 2 undefended monster towns. At the base: 5 red (the 4 strong pairs and the source order), 18 green. Under
the plant (the declaration without the late re-read): 12 red (the 10 lost-in-resize pairs and both guards). With the cure:
23 of 23 green. Re-keyed by identity: `tests/domain/facts/rivalPower.test.js` ("the insurgency summary … is not keyed by
it" → "is keyed by it: the strong line with a rival of standing, the plain line without").

### Declared move (field diff by family, base against the tree, the 720 records)

`stress` and `stressors`, **21 records each, only `summary`** (20 bare-object entries and 1 array entry, r2r-city-33). No
other family moves; no draw moves; golden 0 of 525.

## K22: the stored stake row (22718), its own commit, a declared move

- **By the record first.** The slave revolt's leadership is pushed onto the roster by the crisis
  (`generators/power/stressFactions.js`, `faction: 'Revolt Leadership'` under slave_revolt). In 10 slave revolts it is on
  the roster: 2 store `gains` ("already carries more weight than whoever holds the seat"), and **8 store `split` with the
  untouched reason "it could side with either camp"**, which the page and the exports print as "has no stake yet":
  r2s-slave_revolt-town-0 -town-2 -city-1 -city-3 -metropolis-0 -1 -2 -3. False in all 8: the revolt's own leadership is
  never untouched by the revolt.
- **The cure** (`crisisCast.js :: deriveStakes`, its last branch only): `RAISED_TO_LEAD` (one row: slave_revolt → the
  roster's own literal 'Revolt Leadership'); where no earlier rule gives that power a stake, it keeps the waverer's `split`
  and its reason is `STAKE_REASONS.leadsRevolt`, "it leads the revolt, and rises or falls with it". **The stake stays
  `split` on purpose:** the gainers (stake `gains`) feed the instigator and the collaborator rules, and the losers (`loses`,
  or `split` with the split reason) feed the brunt; a `split` with any other reason is in neither, and the waverer rule reads
  every `split` as before. So no cast role moves (none of the 8 casts a member of the leadership as waverer).
- **Declared move (field diff, base against the K22 tree, the 720):** `stress` and `stressors`, **8 records each, only
  `cast.stakes[].reason`**. No other family moves; no draw moves.
- **Test** `tests/domain/tailCrisisBatch7.test.js`: 8 FALSE pairs (the stored stake must be `{split, "it leads the revolt,
  and rises or falls with it"}`), red at the base 8 of 8; KEEP: the two `gains` towns keep `gainsRival`, metropolis-0's
  Arcane Orders keeps "it could side with either camp"; the table names the literal pushed in stressFactions.js (red at the
  base: no table). Base 9 red, 3 green; tree 12 of 12.
- **Seen, the same shape, NOT taken (beyond the grant; for the chair):** other powers the crisis itself raises, stored
  untouched ("has no stake yet") in their own crisis: **Grain Holders in the famine (10 towns), Quarantine Council in
  the plague (9), The Inquiry in the betrayal (8)**, the Abolitionist Network in the slave revolt (3), the two Noble
  Claimants in the succession void (1 each). Each needs a ruling on WHICH stake is true (the Grain Holders' "holds what the
  crisis makes scarce" was refused by ROUND THREE item 4 where no member faces a granary; the Quarantine Council may lose
  by the plague it fights): the table takes a row a kind once ruled.

## K23: K20's reach stands, listed

`CAST_REASONS.bruntMember` ("one of a power that loses by the crisis", 10 towns beyond the 39 granted): no veto; it stands
on batch 6's veto list as written.

## THE VETO LIST (this seat): every new or changed line (smallest town, largest, a crisis town)

| new line (fold) | towns | smallest | largest | a crisis town |
|---|---|---|---|---|
| A strong power in <N> has stopped obeying the government. Its people stall, its taxes go unpaid, and it waits. (the insurgency summary, K6's line, now keyed by `rival power` on the settled record) | 21 | r2r-thorp-25 | r2r-metropolis-26 | r2s-insurgency-village-1 |
| Some in <N> have stopped obeying the government. They stall, their taxes go unpaid, and they wait. (the fallback, unchanged; now in fewer towns) | 37 → 16 | r2r-thorp-22 | r2s-insurgency-metropolis-3 | r2s-insurgency-hamlet-0 |
| Revolt Leadership split · it leads the revolt, and rises or falls with it (the stored stake; the crisis page and the exports) | 8 | r2s-slave_revolt-town-0 | r2s-slave_revolt-metropolis-3 | r2s-slave_revolt-city-1 |

## Gates (at the tree against 3f45e6fa9)

- eslint on the touched files: 0. typecheck:domain:strict: 0 (1113, ceiling 1113). typecheck:ratchet: OK (exit 0).
- The presumed-things walker `--check`: the same output at the base, after K21 and after K22 (diffed: 149 lines each; the
  base's own exit 1, carried).
- THE TESTS THE PATCH DID NOT RUN: every test file that names stressNarrative, renderStressSummary, assembleSettlement or
  rivalPower, with the measuring seat's targeted set (49 files at the base, 50 with the guard): **20 failing assertions in 13
  files at the base; 19 in 12 at the tree, every one also failing at the base** (the base's: generatorGoldenMaster, the fork
  census A1/A3e/A4/A5, nameHeldThroughAssembly, pipelinePinnedMode, stressSummaryName, proseWiringCensus.walker ×3,
  r3c10FoodLinesTrue ×2, w2FixData6Rows, simulationSpine, worldFactRederive, espionageDormancyFence; CARRIED, not this
  seat's). The one the tree does not fail, `distribution.test.js` "cities average a higher population than towns", is a
  sampling test that failed at the base under load: no claim is made for it.
- K22: every test file naming crisisCast, STAKE_REASONS or deriveStakes (28): 8 failing assertions at the base and the same 8 at the tree (tonightOwnGoal 1, institutionBudgetPromise 1, observedShapeReaders.walker 6: CARRIED); the batch-7 test 12 of 12.

- The twelve-birth grid `page-census.mjs --grid`: 2 falls at both (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a), carried.

## Batch 7 measured on the page (census at 3f45e6fa9, `runs/cbase`, against 07ab77b03, `runs/cafter`; inventory_diff over the batch's rows)

- **Tabs:** 30,044 → 30,047 distinct sentences; gone 1, new 4, in fewer towns 3, in more 0, moved 0. **Exports (PDF,
  Journal):** 36,092 → 36,095; gone 2, new 5, fewer 3, more 0.
- **The rows, by the measure before:** "Some in <N> have stopped obeying the government." (and its second sentence) 37 → 16,
  exactly the 21 holding a rival of standing; "Revolt Leadership has no stake yet" 8 → 0 (tabs and exports, with ": it could
  side with either camp." on the exports).
- **Other sentences in fewer towns:** one, "it could side with either camp" 160 → 157: the three slave revolts where the
  leadership was the only untouched power (in the other five another power still prints it). Explained: false there too.
- **THE INHERITORS READ** (4 on the tabs, 5 on the exports, all this batch's own lines, each read in its dumps): "A strong
  power in <N> has stopped obeying the government. Its people stall, its taxes go unpaid, and it waits." (21 towns, each
  holding a rival of standing by the record) and "Revolt Leadership split · it leads the revolt, and rises or falls with
  it" (8; the exports' "Revolt Leadership split: it leads the revolt, and rises or falls with it."). No line outside the
  batch inherits.

## Registers named stale (this seat)

- The sovereignty walker's estate file count: two more test files (tests/generators/stressLateReRead.test.js,
  tests/domain/tailCrisisBatch7.test.js). Re-taken through its own door at the close.
- `src/domain/prose/holderTable.js` cites `assembleSettlement.js:120/139/140`: above every hunk, unaffected (re-read).

## What is left of the worklist (after this seat)

K21 and K22 are done. Of what the hand-back left, NOTHING of this group prints in five towns or more without a ruling it lacks:
- **FOR THE CHAIR (the widest, 27+ towns, K22's shape beyond its grant):** the other powers a crisis itself raises,
  stored untouched in their own crisis: Grain Holders in the famine (10), Quarantine Council in the plague (9), The Inquiry
  in the betrayal (8); under five: the Abolitionist Network (3), the two Noble Claimants (1 each). Each needs a ruling on
  WHICH stake is true before `RAISED_TO_LEAD`'s sibling table takes a row (a declared move of stored stakes, as K22).
- **Under five towns, they wait:** K16 11705 14131 (2), X9 20882 (3), 07387 (2), 27012 (1), 13909 (3); the Germanic
  "built in timber and stone" on desert ground (4); the Tonight sheet's "Import-Dependent" under a siege (2).
- **Parked as written:** 01034 and X9 01620 28443 30535 (the banked `war` literal, K8's wall); the stored cast rows; the five
  nextInLine rows. **20893:** DEFECON's condition.
- **Named for other seats (unchanged):** HISTORY's succession-void viabilityNote (31 towns, 15 with no office) and the
  plague's market note; the Economics tab's one-argument `foodStoresWords` call (K7).
- Style only, true (seen in batch 6's inheritors): "built on clan lines, held by clan and caravan" says the clan twice (19).

## How this seat's instruments were made

Births only (`RECORD-MEASURE-1/births-only.sh`, the census's own births.mjs over the 720, about a minute a tree) for every
record measure: `bytecmp.mjs` and `goldencmp.mjs` from `ORDER-MEASURE-1/cures` (git-archived from
`lane/order-measure-2026-11-15`); a field diff by family and path (`probes/fielddiff.mjs`: array indices folded to `[]`;
key-order-only moves counted apart); `probes/k21.mjs` (the insurgency and monster summaries against the tree's own
`factsOf`/`atomHolds` on each record). Variant trees for the plant (the declaration without the late pass) and for this
seat's late pass alone. The census as before (`census3.sh <tree> <out> 4 --count-only`), the before run from `wt` at the
base, the after run from a tree detached at the K22 commit.

# TAIL-CRISIS-6 · the sixth seat's batch (2026-11-15)

Seat TAIL-CRISIS-6, successor of TAIL-CRISIS-5, on the same branch from its tip **aa78d1ec9** (read back from origin; nothing
later there). Scratch worktrees outside the main checkout: `wt` (pristine at the base: the before census), `dev` (the work,
detached, pushed with an explicit refspec), `base` (the base again, for red-first runs), `tag` (a probe tree, never pushed:
`rulingStructure.js` tags every power `applyStressEventFactions` pushes or amends), `after` (detached at the tip: the after
census).

## The chair's rulings since (2026-11-15 04:08 UTC; each vetoable by the owner)

- **(K24) A POWER THE CRISIS ITSELF RAISED HAS THE STAKE ITS NAME SAYS.** The Grain Holders in a famine (10 towns), the
  Quarantine Council in a plague (9), The Inquiry in a betrayal (8): each takes its stake in K22's form (holds the grain; is
  charged with the sickness; leads the inquiry): a declared move of the stored stake only, its own commit, measured by the
  field diff (no family but the stake).
- **(K25) "<POWER> HAS NO STAKE YET"** (`crisisPage.js :: CRISIS_PAGE_COPY`, LENT): measure over the 720, of every power the
  line is printed for, (a) a party the crisis raised or names, (b) a power K12's reading gives a stake under another row,
  (c) truly untouched. THE CURE: (a) takes its stake at the source (K24's law carried to every crisis that raises a party:
  list them all); (b) is the page's fault: one power, one stake row; (c) THE ROW IS NOT PRINTED: silence is true (write the
  count: it is accepted in advance).
- **(K26)** A power named in a stake row takes its form from the one leaf where the row is a sentence ("Military/Guard has no
  stake yet", "…is already at odds", "…gains", "…split": 35, 26, 21 and 24 towns): `powerSentenceName.js` ("The Guard"); a
  bare chip keeps the roster's label.
- **(K27)** The iron hook under a grain famine (`outlookHookSiblings.js` PEACE_IRON_HOOKS, this seat's by K17): "What iron
  there is goes out in rations, and work waits on mended tools." (30 towns) with no iron shortage on the record: the hook needs
  an iron shortage (measure it).
- **(U1)** carried. THEN hand back: everything else is under five towns or parked.

## K25 measured first (probe `k25b.mjs`: the base's own `composeCrisisPage` over the base corpus, each row classed by the tag tree)

**470 printings of "has/have no stake yet" in 193 towns** (the tabs' inventory: 468 in 47 folds): **(a) 165** — 124 a party
the crisis raised, 41 a standing power the crisis wrote its own sentence into (its description, appended under that kind);
**(b) 0** (no power has two rows in one section, and none printed untouched in one crisis holds a stake in the town's other);
**(c) 305** (272, and 33 whose power the crisis moved silently by a multiplier, with no sentence: untouched by any text).
Standing of the (c) powers: Minor 154, Suppressed 116, Significant 32, Strong 3.

**Every crisis that raises a party** (by the tag tree over the 720; stored untouched / on the roster): politically_fractured
the claimant 23/44 and the neutrals 4/5 · indebted the creditor's agent 23/23 (+1 under the town's other crisis) and the
crown creditors 2/2 · infiltrated the infiltrator 12/13 · succession_void four claimants 12/14, 6/6, 2/2, 2/2 · plague_onset
the Quarantine Council 11/11 · famine the Grain Holders 10/10 · insurgency its two movements 8/11, 1/14 · recently_betrayed The
Inquiry 8/10 · mass_migration the newcomers 6/6 · slave_revolt the abolitionists 3/3 and the leadership (re-drawn as "The
Independent Bloc") 1/11. **Never stored untouched (another rule already gives a stake):** the Occupation Authority and the
Resistance (occupied), the War Council (wartime, under_siege), the Peace Movement, the conversion's four bodies, the Monster
Hunters, the Departure Committee. **The crisis's sentences on standing powers, stored untouched:** the migration's guild
sentence 39/42, the succession's noble sentence 9/12, wartime's three (pastoral 8/10, contracts 8/10, disruption 6/11), the
slave revolt's two (labour 7/12, the church 1/13), the debt's crown-debt 3/3, the occupation's accommodations 1/1.

## Batch 8: the commits (K24, K25 a, K25 c, the walker)

- **c6852f7e2 (K24)** `crisisCast.js :: RAISED_BY_CRISIS` (kind, the description the crisis gave the power, reason), read in
  `deriveStakes`' last branch only: the stake keeps the waverer's `split` (K22's form: no cast role moves). Read by the
  DESCRIPTION, not the name: the label close re-draws names (the Quarantine Council prints as "The Establishment" and "The
  Administrative Circle" in two metropolises). **Field diff: stress/stressors, 27 records, only `cast.stakes[].reason`.**
- **6716dfceb (K25 a)** the table to 26 rows: `opens` (the description opens with the crisis's literal) and `adds` (the crisis
  appended its sentence). An `adds` row skips a criminal power and the governing power (K12: it answers). **Field diff against
  K24: 108 records, only `cast.stakes[].reason` (173 stakes).** K22's name row stays; the re-drawn leadership takes its reason
  by description.
- **7a2b36543 (K25 c)** `crisisPage.js :: composeCrisisPage`: a stake shown untouched prints NO ROW (the tab, the PDF and the
  journal read this one composition). Display only. **The silence: 312 printings in 145 towns at 6716dfceb** (305 (c), and 7
  left of (a): 6 criminal powers the migration's guild sentence was written onto by name, 1 creditor's agent under the town's
  other crisis): ACCEPTED IN ADVANCE (K25).
- **b54be3eca (the walker)** the presumed-things walker rose by 11 at 7a2b36543 (five reasons named a war, a market, an
  occupation; six match keys quoted the descriptions' clergy, succession, war, market, occupation). New lines are never banked:
  the reasons say it in other words and each key is the shortest stretch that is the crisis's alone. `--check` is now
  identical to the base's (149 lines). **Against aa78d1ec9 the batch's record move is 135 records, only `cast.stakes[].reason`.**
- **Test** `tests/domain/tailCrisisBatch8.test.js` (58): 45 FALSE pairs (the stored stake), the table pinned to
  `stressFactions.js` segment by segment, 8 SILENT pairs (K25 c; the record keeps its split); KEEP 4 (a power the crisis did not
  raise; K22's row; a criminal power under the guild sentence; a section's other rows). **54 red at aa78d1ec9, 4 green; 58 of
  58 at the tree.** Re-keyed by identity: `crisisPage.test.js` (two assertions: the untouched row prints none; every other
  stake its row), `tailCrisisBatch4.test.js` r2r-hamlet-32 (the creditor's agent's stake) and r2r-village-57 (silent by design;
  the section's Merchant Guilds row prints).

## THE VETO LIST (batch 8): every new line, as the page prints it (`<P> split · <reason>`; towns by the record, `stress` entries)

| new line | towns | smallest | largest | a crisis town |
|---|---|---|---|---|
| <P> split · it holds what is left of the food stores (`holdsFood`; e.g. Grain Holders, famine) | 10 | r2r-village-58 | r2s-famine-metropolis-0 | r2s-famine-village-2 |
| <P> split · it holds the emergency powers against the sickness (`chargedWithSickness`; e.g. Quarantine Council, plague_onset) | 9 | r2r-town-37 | r2s-plague_onset-metropolis-3 | r2s-plague_onset-town-1 |
| <P> split · it leads the inquiry into the betrayal (`leadsInquiry`; e.g. The Inquiry, recently_betrayed) | 8 | r2s-recently_betrayed-village-0 | r2s-recently_betrayed-metropolis-1 | r2s-recently_betrayed-village-0 |
| <P> split · it claims the right to govern by other means (`claimsToGovern`; e.g. The Independent Bloc, politically_fractured) | 18 | r2r-village-25 | r2s-politically_fractured-metropolis-2 | r2s-politically_fractured-town-0 |
| <P> split · both sides are courting it, for a price (`courted`; e.g. Third Bloc (Neutrals), politically_fractured) | 4 | r2s-politically_fractured-town-3 | r2s-politically_fractured-metropolis-2 | r2s-politically_fractured-town-3 |
| <P> split · it speaks for the creditor the town owes (`creditorAgent`; e.g. Creditor's Representative, indebted) | 19 | r2r-hamlet-32 | r2r-metropolis-58 | r2s-indebted-village-3 |
| <P> split · its houses hold the crown's debt (`holdsDebt`; e.g. Crown Creditors (Noble Coalition), indebted) | 2 | r2r-metropolis-33 | r2s-indebted-metropolis-3 | r2s-indebted-metropolis-3 |
| <P> split · it is the outside interest with its own people placed here (`infiltrator`; e.g. The Independent Bloc, infiltrated) | 9 | r2s-infiltrated-village-0 | r2s-infiltrated-metropolis-0 | r2s-infiltrated-village-0 |
| <P> split · it presses its own claim to the succession (`claimsSuccession`; e.g. The Highborn Circle, succession_void) | 13 | r2s-succession_void-village-0 | r2r-metropolis-8 | r2s-succession_void-village-0 |
| <P> split · it leads the challenge to the government (`leadsChallenge`; e.g. Reform Movement, insurgency) | 9 | r2r-town-11 | r2r-metropolis-51 | r2s-insurgency-town-0 |
| <P> split · it speaks for the newcomers (`speaksForNewcomers`; e.g. Newcomers' Settlement, mass_migration) | 6 | r2s-mass_migration-hamlet-2 | r2s-mass_migration-metropolis-1 | r2s-mass_migration-hamlet-2 |
| <P> split · it has been aiding the revolt in secret (`aidsRevolt`; e.g. Abolitionist Network, slave_revolt) | 3 | r2s-slave_revolt-metropolis-0 | r2s-slave_revolt-metropolis-2 | r2s-slave_revolt-metropolis-0 |
| <P> split · newcomers working outside the guilds threaten its hold on the trades (`guildsThreatened`; e.g. Merchant Guilds, mass_migration) | 14 | r2r-town-36 | r2s-mass_migration-metropolis-3 | r2s-mass_migration-town-2 |
| <P> split · every claimant needs its backing (`claimantsNeedIt`; e.g. Landed Gentry, succession_void) | 8 | r2s-succession_void-town-3 | r2s-succession_void-metropolis-3 | r2s-succession_void-town-3 |
| <P> split · the call-up and the grieving have made it indispensable (`warNeedsIt`; e.g. Religious Authorities, wartime) | 5 | r2s-wartime-city-3 | r2s-wartime-metropolis-0 | r2s-wartime-city-3 |
| <P> split · contracts have made some of it rich while others have lost their trade routes (`warDivides`; e.g. Merchant Guilds, wartime) | 4 | r2s-wartime-city-1 | r2s-wartime-metropolis-0 | r2s-wartime-city-1 |
| <P> split · the revolt has cut into its labour and its trade (`revoltCutsLabour`; e.g. Merchant Guilds, slave_revolt) | 4 | r2s-slave_revolt-city-3 | r2s-slave_revolt-metropolis-2 | r2s-slave_revolt-city-3 |
| <P> split · trade disruption and requisitions are costing it (`warCostsIt`; e.g. Merchant Guilds, wartime) | 4 | r2s-wartime-village-0 | r2s-wartime-metropolis-2 | r2s-wartime-village-0 |
| <P> split · some of its houses hold the crown's debt (`someHoldDebt`; e.g. Noble Houses, indebted) | 2 | r2r-metropolis-33 | r2s-indebted-metropolis-3 | r2s-indebted-metropolis-3 |
| <P> split · some of its families have made private terms with the new authority (`termsWithOccupier`; e.g. Noble Houses, occupied) | 1 | r2s-occupied-metropolis-1 | r2s-occupied-metropolis-1 | r2s-occupied-metropolis-1 |
| <P> split · both sides press it to call the revolt just or sacrilegious (`pressedToJudge`; e.g. Religious Authorities, slave_revolt) | 1 | r2s-slave_revolt-metropolis-2 | r2s-slave_revolt-metropolis-2 | r2s-slave_revolt-metropolis-2 |
| (K25 c) the row "<P> has/have no stake yet · it/they could side with either camp": NOT PRINTED | 312 → 0 printings | | | |

Read for the hazard: "it holds what is left of the food stores" is the Grain Holders' own description ("whoever controls the
remaining food reserves"), the claim ROUND THREE item 4 refused for `gainsHolds` where the granary's face sits in another power:
the chair ruled it (K24, "holds the grain"); it stays on this list for the owner. "the town" in `creditorAgent` is spoken in
the place's noun on the page ("the hamlet owes").

## K26: NAMED, not cured here (the three surfaces are not this group's files)

The stake row's power is printed by its surface, not by the composition: the crisis tab through
`components/new/tabs/CrisisTab.jsx` (`<EntityLink id={k.doorId} fallback={k.factionId}>`, which prints the roster entry's
`currentName`), the PDF through `src/pdf/sections/CrisisSections.jsx:39` (`${k.factionId} …`) and the journal through
`src/foundry/journalPages.js:185` (`**${k.factionId}**`). None is this group's, and `crisisPage.js` (LENT) cannot reach the
printed word without them: the quarrel's names inside the reason already read the leaf (`quarrelsOf` → `powerSentenceName`).
**The cure, one token a surface:** the PDF and the journal print `powerSentenceName(k.factionId)`; the tab passes
`verbatim` with `fallback={powerSentenceName(k.factionId)}` (the door still opens the power; a bare chip elsewhere keeps the
label). At the base: "Military/Guard has no stake yet" 35 (now silent by K25 c), "…is already at odds" 26, "…gains" 21,
"…split" 24 towns (tabs; the same on the exports).

## K27: PARKED with its measure (a fact the vocabulary lacks: no new word without the chair)

By the record at aa78d1ec9: "What iron there is goes out in rations, and work waits on mended tools." prints in **36 towns**
(its first sentence, "The iron carts are # weeks late…", in 39: 3 take the smith-less twin). Of the 36: 4 are famines (2 with
grain the failed source, 1 fish, 1 livestock); iron or metals are a CRITICAL IMPORT in 35 (`resourceAnalysis.imports.critical`;
the hook prints only where a processor needs the import and an outside supply exists: `foodBalance.js`); the supply is cut in
**1** (an isolated route; no siege; no war: the peace hooks refuse war). **No atom of the vocabulary reads an iron shortage**
(`factVocabulary.js` has no iron or metal word). So the rationing claim stands on nothing in 35 of 36. The cure needs either
(i) an atom `iron short` (the chair's word: e.g. true where the iron import's channel is cut), keyed on the original, the
slot taking a twin with no rationing ("…The iron carts are three weeks late and the carters will not say why, and work waits
on mended tools." would be the twin's form), or (ii) the original's second sentence reworded by exception in `foodBalance.js`
(K9's form, not this group's file) with its key here. The other two peace hooks claim a price and a toll, not a shortage of
the metal in hand: not read as false.

## Named for other seats (this seat)

- **stressFactions.js's seat:** under a migration, a war and a slave revolt the crisis writes its MERCHANTS' sentence onto any
  power whose name holds "guild" or "merchant" ("Thieves' Guild", "The Shadow Compact": "The arrival of skilled workers outside
  guild structures is an existential concern…", 6 untouched printings on the 720 at the base): the stake table skips criminal
  powers for that reason; the description itself is that seat's.

## What is left (after this seat)

- K24 and K25 done (K25 (b) measured 0). K26 NAMED for the three surfaces; K27 PARKED for a word.
- **FOR THE CHAIR (told at the hand-back, the batch already pushed):** where a crisis's own party or written-into power was
  stored untouched but the page showed it "already at odds" (K12's true quarrel line), it now shows its crisis stake instead:
  **44 rows in 34 towns** (Merchant Guilds 19, Craft Guilds 9, Grain Holders 5, …). Both lines are true; the row keeps one
  stake, the crisis's own. If the quarrel should win, `stakeShown` takes it back in one condition.
- Unchanged from TAIL-CRISIS-5 (under five towns, or parked): K16 11705 14131 (2), X9 20882 (3), 07387 (2), 27012 (1), 13909
  (3); the Germanic "built in timber and stone" on desert ground (4); the Tonight sheet's "Import-Dependent" under a siege (2);
  01034 and X9 01620 28443 30535 (K8's wall); the stored cast rows; the five nextInLine rows; 20893 (DEFECON's condition);
  HISTORY's succession-void viabilityNote (31) and the plague's market note; the Economics tab's one-argument
  `foodStoresWords` call (K7).

## Batch 8 measured on the page (census at aa78d1ec9, `runs/c0`, against b54be3eca, `runs/c1`; the inventory diff)

- **Tabs:** 30,047 → 30,034 distinct sentences; gone 67, new 54, in fewer towns 24, in more 3, moved 0. **Exports (PDF,
  Journal):** 36,095 → 36,061; gone 142, new 108, fewer 34, more 3.
- **The rows:** every "<P> has/have no stake yet" fold, **468 printings in 47 folds → 0** on the tabs (**936 → 0** on the
  exports); "it could side with either camp" 157 → 0 and "they could side with either camp" 125 → 0 (the untouched reason,
  printed only on those rows). K24's three: Grain Holders 10, Quarantine Council 9 (+2 re-drawn), The Inquiry 8, each now
  "split · <its reason>".
- **Other sentences in fewer towns:** the "is/are already at odds" rows and their quarrel reasons, 44 rows in 34 towns
  (above, for the chair); nothing else.
- **THE INHERITORS READ** (57 on the tabs, every one this batch's own: "<P> split" and the 21 reasons of the veto list; read in
  r2r-city-3, r2r-village-24, r2r-city-51 and the r2s towns of the test): no line outside the batch inherits. "Religious
  Authorities split" 57 → 63 (the war's pastoral sentence); "Third Bloc (Neutrals) split" prints its bracket (K26's shape, the
  surfaces').

## Gates (at the tree against aa78d1ec9)

- eslint on the touched files: 0. typecheck:domain:strict: 0 (1113, ceiling 1113). typecheck:ratchet: OK (167, ceiling 167).
- The presumed-things walker `--check`: identical to the base's (149 lines; the base's own exit 1, carried) after b54be3eca.
- The twelve-birth grid `page-census.mjs --grid`: 2 falls at both (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a), carried.
- Every test file naming crisisCast, STAKE_REASONS, deriveStakes, crisisPage, composeCrisisPage, CrisisTab, CrisisSections or
  journalPages (75 files): **10 failing at the base, the same 10 at the tree** (observedShapeReaders.walker ×7,
  institutionBudgetPromise, tonightOwnGoal, and one more of the base's: CARRIED); the one new red, `crisisTab.test.jsx` (a row
  per stored stake), re-keyed by identity in ef2d0b07a; the batch-8 test 58 of 58.

## Registers named stale (this seat)

- The sovereignty walker's estate file count: one more test file (tests/domain/tailCrisisBatch8.test.js). Re-taken at the close.

## How this seat's instruments were made

As TAIL-CRISIS-5's (births-only, the census with `--count-only` stopped at the count, `inventory.py`/`inventory_diff.py`), with:
`probes/k25b.mjs` (every untouched printing classed by the tag tree), `probes/parties.mjs` (every power a crisis pushes or
amends, by kind, stored untouched / on the roster), `probes/fielddiff.mjs` (by family and path, array indices folded),
`probes/moved.mjs` (each stake whose reason moved), `probes/veto.mjs` (each new line's towns), `probes/iron2.mjs` (K27).
THE TAG TREE: a worktree at the base whose `rulingStructure.js` wraps `applyStressEventFactions` (each new power gets
`__raised`, each amended one `__amended`, `__powerMoved`): births-only over the 720 (about a minute); never committed.

## THE CHAIR'S RULINGS RECEIVED AT THE HAND-BACK (2026-11-15 04:49 to 05:12 UTC; each vetoable by the owner): NOT STARTED, FOR THE NEXT SEAT

These arrived after this seat's batch was pushed and its line sent (read at 05:12, about 64 minutes into the budget; the meter
read 0). None is begun; nothing was changed for them.

- **(K28, FIRST, PUSHED ALONE)** the temporal dead zone under plain node: `node scripts/wiring-census.mjs --dry` crashes with
  "Cannot access 'CAST_REASONS' before initialization" at `src/domain/crisis/crisisHooks.js:102`: `const CLAUSE_SAYS = new
  Set([CAST_REASONS.face, CAST_REASONS.defenderMilitary]);` reads `crisisCast.js`'s binding AT MODULE EVALUATION (line 35
  imports it), so wherever the cycle enters at `crisisCast.js`, `crisisHooks.js` evaluates first and the read throws. The cure the
  chair named: the read moves inside its function (build the set on first use), or the two reasons move to a pure leaf both
  import; nothing a town prints moves (the 720 births byte-identical, `bytecmp.mjs`), `wiring-census --dry` runs to its end,
  `tests/architecture/layerBoundaries.test.js` no worse. ONE LINE to the chair with the tip. The four "undefined.face"
  collection crashes (crisisCast ×3, dualHatReaders) are TAIL-TIES-5's (`defenseDisplay.js:895` → `tonightSheet.js`): LEAVE that
  function and its export in `tonightSheet.js` alone.
- **(U2) five red files in this area**, each run ALONE at the tip: `tests/domain/crisisBlindDossierProse.test.js` ("expected 21
  to be ≥ 29"), `crisisBlindWidened.test.js`, `facts/composeBareCrisis.test.js`, `tests/components/crisisStoppedRows.test.jsx`
  (the renamed rents row "Harvest" has no row in `src/data/crisisDependence.js`: that table and its leaf are LENT),
  `tests/foundry/journalMarksCrisisRows.test.js` ("- Grain Sales (scarce): 4%"). Each: a regression → cure it; a pin a declared
  move explains → re-key by identity, naming the move; a cause outside these files → one line here with file and commit (`git
  log -S`). Never skip, weaken or delete a test. NOTE: none of these files is in the 75 this seat ran (the 10 reds there are the
  base's); this batch's display cure (K25 c) changes only the stake rows, so `crisisBlindDossierProse`'s count is to be read
  against it first.
- **(styleLaw)** `tests/lint/styleLaw.walker.test.js`: the struck word "faction" in `src/data/crisisDependence.js:354`
  ("Faction information"): if it is a service's catalogue name used as a key, read it from the catalogue (no new literal); if
  prose, reword; the baseline is not raised.
- **For every new test:** negatives anchored (`tests/helpers/anchoredNegatives.js`), seed loops through the totality helper, no
  literal state-prose sentence as an anchor (`tests/helpers/drawnProse.js`); never edit `scripts/mutation-coverage-manifest.json`.
  This seat's `tailCrisisBatch8.test.js` predates that note: its `not.toContain`/`not.toBe` negatives each sit beside the
  positive they are anchored to, but are not routed through `anchoredNegatives.js`: the next seat should route them.

# TAIL-CRISIS-7 · the seventh seat (2026-11-15)

Seat TAIL-CRISIS-7, successor of TAIL-CRISIS-6, on the same branch from its tip **0f506cd93** (read back from origin;
fast-forward of a885da881). Scratch worktrees outside the main checkout: `tc` (the work, its own `npm ci`), `bis` (the
bisects and the base runs, `node_modules` linked). FIRST ACT: the joined line merged at **475506bf7** (9b6544c8).
Every red run ALONE through `gate-tail.sh` at the merged tree first. Bisects by the test file over the joined line's
first parents, then inside the landing lane. NOTE: f663a2699 is NOT green for reds 1-3: they were already red there;
their good point is 705577ac (11-09), and all three turned at **ba4cc210b** (JOIN-1 · 6, lane/w2-write at 6fdff4abd).

## The reds

| # | test | turned at | inside | verdict | commit |
|---|---|---|---|---|---|
| 1 | `crisisBlindDossierProse` (2) | ba4cc210b | 35acb779 (first of the lane's) | **NAMED, not this group's** (below) | none |
| 2 | `crisisBlindWidened` 5402 (1) | ba4cc210b | 5132da377 (DS-ECO-10 v1 re-said, #309) | RE-KEYED: the claim cured at the source, both halves asserted (the file's form for a cured row) | 375a5547 |
| 3 | `facts/composeBareCrisis` (1) | ba4cc210b | 9d0f258f3 (DS-DEF-2 STRONG v3 re-said, the 19:35 ruling) | RE-KEYED to v3's new text (same vid, `crisis` kept) | 39dd1840 |
| 4 | `crisisStoppedRows` (2) | (a) b75b08c37 (the S6 walker landed on D10's 'Harvest'); (b) d5ec9c7f3 | (a) df2fa5ca (TAIL-DEFECON-2 D10); b40f795b (TAIL-DEFECON-4, line 838); (b) ba3af420 (TAIL-HOUSES-4 H17) | (a) CURED: `"Harvest": [GRAIN, LIVESTOCK]`; the scrape bounded at `;` (3 false titles); (b) RE-KEYED to the house's hedged description | ab49049c |
| 5 | `journalMarksCrisisRows` (2) | d817736d (red at its own landing) | 5f67f382d (TAIL-DEFECON-2 D14, Pilgrim Trade) | RE-KEYED: Grain Sales 4 -> 5 %, Toll Revenue 14 -> 15 % (the same rows and mark) | fca2cf25 |
| 6 | `styleLaw.walker` (crisisDependence.js:354) | 73291c8e (born with the table) | | CURED: the key read from `institutionServices.js` (a computed key); the table's exports byte-identical | fdb23220 |

**Red 1, named.** Two causes, neither in a crisis file, the table or the leaf: (i) five pools MUTE under a siege on
their own record, all arriving at ba4cc210b (lane/w2-write's state-prose leaves): DS-POW-6 `operation role duty
evasion`, DS-GEN-13 `ENTREPOT`, DS-ECO-10 `POSTURE: vulnerable`, and two reading a compound fact the test says to set
aside by name (DS-ECO-12 `INCOME WEIGHT: the religious houses`, `sacredHouse`; DS-DEF-2 `Beasts & Monsters: settled,
nothing organized`, `no guardPresence`); the cure is a crisis-safe line in each leaf (the writing seat's) or the
set-aside by ruling; (ii) the non-vacuity floor 29 (measured at the cure) falls as the writing seats cure calm claims
at the source: 23 (by JOIN-4 · 6) -> 22 (9eb08470, corpus-def) -> 21 (38a21278, corpus-eco) -> 17 (31a6f72e,
corpus-def). The test's text gives the floor no door, so it is not re-measured here.

**THE VETO LIST (red 4, a declared move of display).** "Harvest (scarce): n%" / "Scarce in the famine." now prints in
**22 of the 329** census towns that hold the Harvest row (smallest r2r-thorp-38, largest r2s-famine-village-0, a crisis
town r2s-famine-thorp-1 with livestock failed): every one a famine of grain, of livestock or of no named source; no
siege or outbreak marks it (the land's own work, the table's rule for rents).

**Named for other seats.** `styleLaw.walker` stays red on three lines not this group's: historyData.js:1601 'the
record' and :1511 'a stranger' (7bef72cb, TAIL-HISTORY batch 2), narrativeData.js:431 'faction' (6a369299,
TAIL-NARRATIVE-3 batch 5). `displayEconCrisisMarks.test.jsx` (3, display-econ's) red at the base and the tree alike:
its pins read 'Agricultural Rents' (now 'Harvest', D10) and 'Pilgrim Trade' (D14) where the record no longer holds them.

## The proof (at the tree against the merged base 9b6544c8)

- Each red alone: red before, green after (2 -> 10/10, 3 -> 2/2, 4 -> 11/11, 5 -> 16/16; 6 leaves the rise list).
- The 37 test files naming crisisDependence, crisisStoppedRow or institutionServices: base 7 files red, tree 5, the
  same tests (none new). The walkers the edits could reach (negativeAssertionAnchor, presumedThings, proseDrawnAnchors,
  seedLoopTotality, styleLaw): 10 red at both, the same names.
- eslint on the touched files 0; typecheck:domain:strict 1113 (ceiling 1113); typecheck:ratchet 167 (ceiling 167).
- The twelve-birth grid `page-census.mjs --grid`: 2 falls at both (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a).
- K28: the chair's 05:45 word: the merge seat runs the door; closed without a change unless "THE DOOR STILL CRASHES".

## The chair's seventh and eighth (after the joined line merged at 74688857c, the chair's named tip: e5f66a5f)

- **Red 7, `tonightOwnGoal` (1): RE-KEYED BY IDENTITY, e4799144.** "toMatch() … got undefined" (line 67): Drusilla
  Pacuvius is off rpf-city-succession_void+politically_fractured-13's sheet. Bisected from the test's landing (9618e031,
  green): turned at **65dc92af9** (JOIN-4 · point 2, lane/upkeep-monotone at 0ca0bbe94, the defence rating's rebuild;
  its merge declares its moves shift pins and LISTS them). The town is re-cast: its instigator is now Publicola Maximus,
  who prints his card's own goal; the pin follows the role in the same town. Not goalFamilies.js. 1 failed of 7 -> 7/7.
- **The eighth, `tailCrisisIronHooks` on r2r-hamlet-35 and -30: A PREMISE THE TWO TOWNS NO LONGER MEET (for the test
  seat to re-key), not a hole in the cure.** Since **2ac50c55** (TAIL-DEFECON-3 D8, #20893, landed at 1b672cbe8, JOIN-7 ·
  25) the iron hooks print only where the record's import list holds iron (`foodBalance.js`, `importHeld`); both hamlets
  import only salt and incense (iron is a critical import by the roster, not an import held), so NO iron hook prints
  there, neither the false words nor the reworded line (their stored hooks are empty). The same bisect reads the
  branch's own weaker form red there since 1b672cbe8 (it stops at hamlet-35). No calm hamlet of the census prints
  either line now; the nearest of the same shape: "Iron has doubled in price … mended with scrap." r2r-town-20 (and
  r2r-town-48, then cities and metropolises, 18 in all); "What iron there is goes out in rations …" r2r-town-1 (and
  r2r-town-45, 12 in all). The test file is not committed here (its branch carries the stronger form).
- **K28:** closed without a change (the chair's 05:45: the merge seat runs the door).

## K26: DONE, c08dbb65 (a declared move of display; the three surfaces lent)

The PDF (`CrisisSections.jsx`) and the journal (`journalPages.js :: crisisJournalPage`) print
`powerSentenceName(k.factionId)`; the tab (`CrisisTab.jsx`) gives the link the leaf's form as its fallback and sets
`verbatim` only where the leaf re-forms the label (every other power keeps the link's live name; the door still opens the
power). THE VETO LIST, on the 720 at e4799144: **125 rows in 122 towns** now print the prose form: Military/Guard -> The
Guard 116 (loses 45, already at odds 26, split 24, gains 21; smallest r2r-hamlet-10, a crisis town r2s-occupied-city-2),
Third Bloc (Neutrals) -> The Neutrals 4, Crown Creditors (Noble Coalition) -> Crown Creditors 2, the two Noble Claimant
lines 1 each (r2r-metropolis-8), Monster Hunters / Adventurers -> Monster Hunters 1. Test `tailCrisisK26.test.jsx`
(seven census towns, each surface anchored; red 7 of 7 at e4799144, green). The 53 files naming the four touched files
and the four walkers: the same 10 red at base and tree. **Vetoable by the owner:** a DM rename of a re-formed power
(e.g. renaming "Military/Guard") would show the leaf's form on the stake row, not the new name (the other rows keep it).

## Registers named stale (this seat)

- The sovereignty walker (`sovereigntyLightingContract`, red at the base already, the same two tests at the tree): one more
  test file (`tests/components/tailCrisisK26.test.jsx`). Re-taken at the close.

## What is left (after this seat)

- **Red 1 under the chair's K30 (2026-11-15 05:48, vetoable by the owner).** (a) THE FLOOR, DONE (7eea6a515): 29 ->
  17, the measured count at this tip, the curing commits named in the test (23 by JOIN-4 · 6, 1c01bdda, the earlier fall
  not located; 22 at 9eb08470a; 21 at 38a21278; 17 at 31a6f72e). No planted case holds it: MORE CURES CAN TAKE IT TO
  ZERO, and the pin then needs a plant, not a floor. That arm is green; the file stays red on the mute arm only.
  (b) THE FIVE MUTE POOLS, READ, NOT CHANGED (the count ran out): four commits inside ba4cc210b DECLARE their pool's
  every line false under a siege, by the siege ruling (nothing comes in or goes out by road): DS-POW-6 `operation role
  duty evasion` f8e7326c (v1-v3), DS-GEN-13 `ENTREPOT` 32ab37da (v1 among the siege Overview's road lines), DS-ECO-10
  `POSTURE: vulnerable` c21abdd5 (v1-v3), DS-DEF-2 `Beasts & Monsters: settled, nothing organized` 35acb779 (v4-v6, `no
  crisis: under_siege · no crisis: occupied · no guardPresence`); DS-ECO-12 `INCOME WEIGHT: the religious houses` not
  located (58aaaed2 reworded its no-house case; it reads the compound `sacredHouse`, which the test says to set aside by
  name). So the silence is DECLARED; the re-key K30 (b) names is the next seat's, and it needs a mechanism the test does
  not have: `SET_ASIDE` is keyed by POOL and reds if the pool speaks under ANY family it denies, so a pool silent under
  a siege by design but speaking under a famine needs a set-aside keyed by pool AND family (`… :: threat`), each with its
  declaring commit, the arm still red if a listed cell speaks. That shape is the chair's to approve.
- The eighth: the test seat re-keys `tailCrisisIronHooks`' two hamlets (r2r-town-20, r2r-town-1 the nearest).
- The style walker's three lines (TAIL-HISTORY, TAIL-NARRATIVE); `displayEconCrisisMarks` (display-econ's, D10 and D14).
- K27 parked (the chair's word for an `iron short` atom); TAIL-CRISIS-6's under-five list unchanged.

# TAIL-CRISIS-8 · the eighth seat (2026-11-15)

Seat TAIL-CRISIS-8, successor of TAIL-CRISIS-7, on the same branch from its tip **325de5153** (read back from origin;
nothing later there). Scratch worktrees outside the main checkout: `wt` (the work, its own `npm ci`; package files
identical across the merge), `bis` (the bisects and the base runs, `node_modules` linked). FIRST ACT: the joined line
merged at **f714fb6a5** (one merge commit, 188e0dd3a, no conflict). Every run alone through `gate-tail.sh`, to a file.

## The one red that stopped the landing: `journalMarksCrisisRows` (3 failed of 16 -> 16/16)

Bisected by the town's printed shares over the joined line's first parents from 74688857c (this branch's last join),
then inside the landing lane: all three rows turned at **26c3dc45** (JOIN-9 · 14, lane/tail-defecon at ad5720386),
inside at **9cc8c6821** (TAIL-DEFECON-5 R2, "one shadow figure": the criminal income row held at the capture in both
normalisers; a DECLARED MOVE of `economicState.incomeSources` in 229 towns; good at e1577f2cd). Not a crisis file. Each
RE-KEYED BY IDENTITY (the same towns, rows and marks; the figure the merged tree prints, read by the test itself):

| town | row | was | now |
|---|---|---|---|
| r2s-famine-town-1 | RED "Grain Sales" / "Grain Sales (scarce)" | 5% | 4% |
| r2s-under_siege-town-3 | RED "Gate Tolls" / "Gate Tolls (stopped)" | 8% | 7% |
| r2s-under_siege-town-3 | KEEP "Property Rents" | 8% | 7% |

(r2s-under_siege-town-3's Shadow Economy row prints 39%; r2s-famine-town-1's KEEP "Toll Revenue: 15%" holds unmoved.)
The anchored negative (`expectAbsentWithAnchor`) holds with each: the unmarked line absent, the marked line present.

## The files TAIL-CRISIS-7 touched, each alone at the merged tree

`crisisBlindWidened` 10/10, `facts/composeBareCrisis` 2/2, `crisisStoppedRows` 11/11, `tonightOwnGoal` 7/7,
`tailCrisisK26` 1/1: green, nothing moved. `crisisBlindDossierProse` 1 failed of 5: the mute arm only, the same five
pools TAIL-CRISIS-7 named (arrived at ba4cc210b; DS-POW-6, DS-GEN-13, DS-ECO-10, DS-ECO-12, DS-DEF-2, each `:: threat`);
the blind arm (with its floor) green. The set-aside table left as it is (another close seat's).

## The proof

- eslint on the touched file 0. The twelve-birth grid `page-census.mjs --grid`: 2 falls at base (f714fb6a5) and tree
  alike (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a): no rise.
- PUSHED at 573c92b6d.

## The chair's one more (after the landing line): `coherence/crisisBlindProse` (1 failed of 9 -> 8/8), RETIRED BY NAME

The case 'soak1k-4800: "the succession question is not a live one" in a succession void is a finding' found nothing.
Bisected by the file over the joined line's first parents from d817736d8 (green): green at 31a6f72e^1, red at
**31a6f72e** (JOIN-7 · 29, lane/tail-corpus-def at cff6cd098), inside at **51217c0e** (TAIL-CORPUS-DEF-2 batch 3: DS-POW-4
`riskLabel: Stable (no challengers)` v1 v2 v3 v6 reworded, every line marked `succession settled`). Verdict (i), A CURE:
the fixture's v1 now reads "Nobody at Grudets is in a position to take the headman's place: … no contender stands ready
to try." and the finder's three succession phrases occur in the corpus 3 times at d817736d8 and 0 from 51217c0e on (`git
grep` over src/data). Not the finder gone blind. No corpus line can be blind that way now: the finder's other succession
rows read two npcStructure.js goals (government and other `stable`) tagged CALM_ONLY, so none prints under a crisis.
(A sweep of 72 births of succession_void and politically_fractured, the record's strings and the journal, found 0 at the
tree and 0 at d817736d8: it does not reach the state-prose desks, so it is no proof; the proof is the grep and the
CALM_ONLY tags.) So the case is RETIRED BY NAME in the file, the curing commit named. **Owner's veto list:** the case
retired. The succession family stays covered live by crisisBlindWidened's soak1k-3005. Named, not changed: the famine
case's `power: noRival` half (line 58) now holds a line that makes no claim, so that half asserts nothing. The finder's three
DS-POW-4 succession phrases are dead (51217c0e named them; the finder is lent, not cured here).

- eslint 0 on the file; negativeAssertionAnchor and proseDrawnAnchors red at base 573c92b6d and tree alike (the same
  three tests; the file named in neither).
- HANDED BACK after the push.
