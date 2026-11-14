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
