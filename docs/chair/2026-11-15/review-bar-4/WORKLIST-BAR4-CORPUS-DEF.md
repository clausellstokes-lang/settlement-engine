# WORKLIST · BAR4-CORPUS-DEF

8 rows: 6 STANDS, 1 WEAK, 1 LEFT-BY-BAR3.

STANDS: a real contradiction by the strict second check (the page against its own town). WEAK: one loose word (cure where one word settles it; never rewrite a true line to chase a tone). LEFT-BY-BAR3: a row the round before left, with where its measure is. A FLAG IS STILL A CANDIDATE: verify each row by the record before you cure it. The read towns are NOT among the 720: bear one alone to see its record (`docs/chair/2026-11-14/probes/READ-ALL/packets10/seeds.bar4.txt`). The writers below were traced by the chair with `grep -F` of the fixed words under `src/` at 640266f64: check each.

## C18744 · STANDS · bar0-hamlet-calm-rand-23 · Systems/Defense

> Ribatchowk has no wall, and nothing threatens it now that a wall would keep out.

WHY: The town's one live tension is an external threat, 'news of approaching danger', whose parties argue over preparing for war or fleeing. That is exactly the kind of thing a wall keeps out, so 'nothing threatens it now' is contradicted. The agent already inside (C18504) would not be kept out by a wall, but the approaching danger would.
- evidence: Ribatchowk has no wall, and nothing threatens it now that a wall would keep out. — cal-07.txt C18744
- evidence: external threat (parties: Prepare for war, Seek diplomacy, Flee/hide) — header TENSIONS
- evidence: News of approaching danger divides the community on how to respond — cal-07.txt C18459, C18853
- evidence: Organized aggression cannot be resisted here; what preserves the hamlet is distance, diplomacy — cal-07.txt C18729
- writer (the words "nothing threatens it now that a wall"): src/data/dossierStateProse/defense.generated.js

## C45642 · STANDS · bar0-village-calm-rand-23 · Systems/Defense

> Gankhuubulag has no wall, and nothing threatens it now that a wall would keep out.

WHY: The village's one live tension is an approaching danger serious enough that a faction wants to prepare for war, so 'nothing threatens it now that a wall would keep out' is false. Nothing in the record makes the threat non-physical or over.
- evidence: TENSIONS: external threat (parties: Prepare for war, Seek diplomacy, Flee/hide) — cal-18.txt header
- evidence: News of approaching danger divides the community on how to respond — cal-18.txt C45249
- evidence: The threat has an agent already inside the settlement — cal-18.txt C45301
- evidence: currentTensions[0]: type 'external_threat', severity ['major','catastrophic'] — record s.history.currentTensions
- writer (the words "nothing threatens it now that a wall"): src/data/dossierStateProse/defense.generated.js

## C36862 · STANDS · bar0-town-calm-rand-22 · Systems/Magic

> Whatever magic reaches Madinatserai, the town does not rest on it: nothing it lives by would stop without it.

WHY: An isolated town whose timber, iron and imported grain come by teleportation does rest on magic; the line says nothing would stop without it. C35962's other routes ('the tracks in a good season, or the favour of a patron') are partial and do not make 'nothing would stop' true.
- evidence: Construction, furniture and barrel making here depend on timber brought in by magic: no trade road reaches Madinatserai. — cal-14.txt C36506
- evidence: Law enforcement, patrol and gate control here depend on iron brought in by magic. — cal-14.txt C36523
- evidence: Meals, ale and lodging here depend on grain brought in by magic. — cal-14.txt C36536
- evidence: Town remains viable through local foodshed, reserves, seasonal access, patronage, magical transit. — cal-14.txt C36871; trade access isolated; HOUSES: Teleportation circle
- writer (the words "does not rest on it"): src/data/dossierStateProse/defense.generated.js

## C31074 · STANDS · bar0-metropolis-calm-rand-23 · Systems/Magic

> If the help beyond ordinary work failed at Tzulcoatl, the trade that makes its salted fish would yield less than it does now.

WHY: THE CHAIR: the same page says 'the fishery here is fished out; the fish sold now is salted and bought in' (C30411): the page contradicts itself, as for C30469 in the same town || the checker (EXPLAINED): The record says the depleted fishery's catch is propped up by temple fishing rites, and the page names houses of worship among the magic's suppliers, so the fish trade would yield less without it. The chain is vulnerable, not stopped, and still runs through the fish market and cooper, so a small salted-fish trade exists beside the imports.
- evidence: Fishing & Seafood chain: outputs ['Salted fish', ...], status 'vulnerable', magicNote 'Temple fishing rites improve depleted catch', magicRecovery 0.35 — record s.economicState.activeChains[0]
- evidence: supplied by Wizard's tower, Houses of worship, Great cathedral and Chan Nah — cal-11.txt C31069
- evidence: Fishing & Seafood / Vulnerable / Fishing grounds (depleted) / Via Cooper, Merchant guilds, Fish market / Normally yields Salted fish — cal-11.txt C30476-C30486
- writer (the words "If the help beyond ordinary work failed"): src/data/dossierStateProse/defense.generated.js

## C40032 · STANDS · bar0-town-occupied-rand-21 · Systems/Defense

> Anyone walking Divoburg late is watched, not stopped, and the watchmen make sure you know it.

WHY: Under an enforced curfew with checkpoints, people out late are stopped; 'watched, not stopped' contradicts the town's safety record and three lines of the same tab.
- evidence: Occupation authorities enforce the curfew at the checkpoints. — cal-16.txt C39990; record s.economicState.safetyProfile.safetyDesc
- evidence: There is a curfew at Divoburg now, and checkpoints — cal-16.txt C39992
- evidence: Travellers through Divoburg are stopped and asked their business by officials who are not from here. — cal-16.txt C39970
- evidence: safety Controlled — Occupation Curfew — header STATE
- writer (the words "is watched, not stopped"): src/data/dossierStateProse/defense.generated.js

## C34105 · STANDS · bar0-thorp-calm-rand-23 · Systems/Defense

> Sanctavilla's defence has been short of money for years, and each lean season leaves less to spend on it when a real crisis comes.

WHY: The page calls the thorp wealthy, with an economic surplus and the place doing well, and records no lean seasons, yet says its defence has been short of money for years. A low economic-readiness score may explain where the line comes from, but not the claim of years of want.
- evidence: STATE: prosperity Wealthy — cal-12.txt header; 'Economic capacitySurplus' — cal-12.txt C33901
- evidence: A farm surplus keeps everyone at Sanctavilla busy. — cal-12.txt C33975
- evidence: Fresh paint and well-kept roofs say the place is doing well. — cal-12.txt C33850
- evidence: FOOD surplus 7%; PAST: none recorded — header
- evidence: defenseProfile.scores.economic = 36 — record (the likely source of the line)
- writer (the words "has been short of money for years"): src/data/dossierStateProse/defense.generated.js

## C16539 · WEAK · bar0-city-wartime-rand-23 · Systems/Defense

> Langkirche's accounts show little spent on its city walls and gates now that it asks little of it, since built work needs little upkeep.

WHY: The war is fought elsewhere: it draws men, carts and supplies, and nothing attacks the walls, so low upkeep on built masonry is not flatly false. 'Asks little of it', said at war footing with soldiers on the walls, is still a loose, off-key phrase. There is also a small agreement slip ('walls and gates ... it').
- evidence: Langkirche's accounts show little spent on its city walls and gates now that it asks little of it — cal-06 C16539
- evidence: The war makes its demands on Langkirche, in men, carts and supplies — cal-06 C17342; More army carts pass through Langkirche — C15581
- evidence: War footing — C16496; the soldiers on the walls give them good reason to. — cal-06 C16508
- writer (the words "since built work needs little upkeep"): src/data/dossierStateProse/defense.generated.js

## C24893 · LEFT-BY-BAR3 · (4 of 64 printing towns of the 720: see the hand-back) · Systems/Defense

> X's books record no gang, guild or racket

WHY: LEFT by BAR3-CORPUS-3 (its hand-back, 'What is left', item 1): measured false in 4 towns that carry black-market income; its reword was withdrawn because three finders pin the words. The cure is the GATE (the line prints only where the record bears it), not the words.
- writer (the words "record no gang, guild or racket"): src/data/dossierStateProse/defense.generated.js src/domain/coherence/readerContradictionFindings.js src/domain/coherence/pageCensusFindings.js
