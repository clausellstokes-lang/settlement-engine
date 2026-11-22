# WORKLIST · BAR4-SAFETY

6 rows: 6 STANDS.

STANDS: a real contradiction by the strict second check (the page against its own town). WEAK: one loose word (cure where one word settles it; never rewrite a true line to chase a tone). LEFT-BY-BAR3: a row the round before left, with where its measure is. A FLAG IS STILL A CANDIDATE: verify each row by the record before you cure it. The read towns are NOT among the 720: bear one alone to see its record (`docs/chair/2026-11-14/probes/READ-ALL/packets10/seeds.bar4.txt`). The writers below were traced by the chair with `grep -F` of the fixed words under `src/` at 640266f64: check each.

## C7336 · STANDS · bar0-city-under_siege+famine-rand-23 · Systems/Defense

> The garrison and city watch are well paid and well equipped, but are held for the defence, and few patrols can be spared from it.

WHY: This is the other end of the C6022 contradiction. 'Well paid' sits against an unpaid-guard hook, a high quarrel over the guard's cost, a Struggling prosperity and a purse-limited line on the same tab. Nothing reconciles it.
- evidence: The garrison and city watch are well paid and well equipped — cal-03 C7336
- evidence: The guard has not been paid this month — cal-03 C6022
- evidence: Military/Guard vs Noble Governorship: high (The cost of keeping the guard); prosperity Struggling — header QUARRELS, STATE
- evidence: Hired swords back the garrison when the purse allows. — cal-03 C7339
- writer (the words "well paid and well equipped"): src/generators/safetyLineTruth.js

## C6022 · STANDS · bar0-city-under_siege+famine-rand-23 · Summary/Plot Hooks

> The guard has not been paid this month, and some of them have started taking payment in kind.

WHY: The hook and the Defense line flatly contradict each other on whether the guard is paid; nothing in the town reconciles them. The quarrel over the cost of the guard backs the hook, so the generic 'well paid' line (C7336) is the likelier false half. This is one contradiction, flagged at both ends.
- evidence: The guard has not been paid this month, and some of them have started taking payment in kind. — cal-03 C6022 (powerStructure.conflicts[0].plotHooks[0])
- evidence: The garrison and city watch are well paid and well equipped — cal-03 C7336 (economicState.safetyProfile.guardEffectivenessDesc)
- evidence: Military/Guard vs Noble Governorship: high (The cost of keeping the guard) — cal-03 header QUARRELS
- writer (the words "has not been paid this month"): src/generators/power/conflictIssues.js

## C44796 · STANDS · bar0-village-calm-rand-22 · Systems/Defense

> The local watch is disciplined but resource-constrained: motivated with inadequate equipment and irregular pay.

WHY: The guard assessment gives the watch 'irregular pay'. The same page twice says the Village watch is an unpaid rota of households. The paid veterans of the Veteran's lodge are a separate hire, not 'the local watch', so nothing reconciles the two.
- evidence: The local watch is disciplined but resource-constrained: motivated with inadequate equipment and irregular pay. — record s.defenseProfile...guardEffectivenessDesc; cal-18.txt C44796
- evidence: Nobody is paid, and the households hold the rota. — cal-18.txt C44415, C44829 (Village watch)
- evidence: watch: Village watch — cal-18.txt DEFENCE
- writer (the words "inadequate equipment and irregular pay"): src/generators/safetyLineTruth.js src/generators/safetyProfile.js

## C2020 · STANDS · bar0-city-under_siege+famine-rand-21 · Table/Tonight sheet

> The besiegers around Qingkou have not moved, and the lookouts wait for the night they do.

WHY: Two sentences of the same page say the besiegers advance weekly and have not moved; nothing in the town reconciles them.
- evidence: The besiegers draw closer to Qingkou each week, and the lookouts count more of them every morning. — cal-01.txt C0017 (Summary/Overview)
- evidence: The besiegers around Qingkou have not moved — cal-01.txt C2020 (Table/Tonight sheet)
- writer (the words "have not moved, and the lookouts wait"): src/domain/crisis/crisisSummaryVantage.js
- writer (the words "closer each week"): (untraced: trace it first)

## C20892 · STANDS · bar0-hamlet-under_siege-rand-23 · Table/Tonight sheet

> The besiegers around Darhankul have not moved, and the lookouts wait for the night they do.

WHY: The Tonight sheet says the besiegers have not moved, and the Overview says they draw closer each week. The two contradict each other within the same town, and nothing reconciles them.
- evidence: The besiegers around Darhankul have not moved, and the lookouts wait for the night they do. — cal-08 C20892
- evidence: The besiegers draw closer to Darhankul each week, and the lookouts count more of them every morning. — cal-08 C20387
- writer (the words "have not moved, and the lookouts wait"): src/domain/crisis/crisisSummaryVantage.js

## C46446 · STANDS · bar0-village-famine-rand-21 · Systems/Defense

> No criminal infrastructure: just too many people with too little, doing what they must to survive.

WHY: The village's own record gives it an 18% black-market income and a fencing service, and the page says organised crime has crowded out the church. 'No criminal infrastructure' is contradicted by both.
- evidence: No criminal infrastructure: just too many people with too little — cal-18 C46446
- evidence: Black Market Revenue 18% — header INCOME; CriminalBlack Market Revenue Untaxed trade, fencing and theft bring money in here — C46216
- evidence: Fencing stolen goods / Stolen goods move through back channels — cal-18 C46154-C46156
- evidence: organised crime has crowded out most formal moral influence. — cal-18 C46351
- writer (the words "No criminal infrastructure"): src/components/new/tabs/DefenseTab.jsx src/generators/historyGenerator.js src/generators/safetyProfile.js src/domain/facts/criminalStructureKey.js
