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
