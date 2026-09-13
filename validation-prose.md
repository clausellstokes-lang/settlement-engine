# VALIDATION — IS THE RE-CUT BETTER? DS-DEF-2, three versions, refuted face by face

*Fable judge, 2026-09-12. Read-only on the repo. Revisions: SHIPPED `f2da5a3ee` · LICENCE `471ce894a` · RE-CUT round 1 `a3e877e6e`. Dock for the engine: `scratchpad/dock-f2da5a3ee`. Instrument: `docs/rewrite-retro-2026-09-12/evidence/measure-prose.py` at budget 1900. Law: `evidence/CONTRADICTION-TABLE.md` (floors 1–4, §R). Every figure marked CONFIRMED was executed in this session; every judgment marked PLAUSIBLE is reasoning from the code and the table, not a rendered dossier.*

## 0. What the three annexes hold (CONFIRMED)

| version | pools | faces | shape |
|---|---|---|---|
| shipped `f2da5a3ee` | 26 | 78 | 3 stance lines per pool |
| licence `471ce894a` | 26 | 312 | 3 stance lines + 3 `[face]` each = 12 per pool |
| re-cut `a3e877e6e` | 26 | 294 | 24 pools × 12 re-cut faces = 288, plus TWO pools still carrying the shipped three-liners (`walls with NO force`, `Economic ADEQUATE`) |

The round-1 commit's own account: 24 pools applied, 2 refused, 10 of 26 in band, **owned verdicts FAIL 0 · WITHHELD 0 · PASS 294** — i.e. the Opus refuter found nothing. This ledger is the adversarial test of that claim.

## 1. MEASUREMENTS (CONFIRMED — measure-prose.py, budget 1900, plus opener variety computed here)

| version | units | sample to 1900 tok | DISTINCT words | content types | mean words/unit | `,and` joins | distinct 3-word openers |
|---|---|---|---|---|---|---|---|
| shipped `f2da5a3ee` | 78 | 78u / 1905 | **519** | 489 | 24.4 | 63% | 78/78 (100%) |
| licence `471ce894a` | 312 | 108u / 1902 | **168** | 143 | 17.4 | 74% | 300/312 (96%) |
| re-cut `a3e877e6e` | 294 | 61u / 1906 | **377** | 349 | 27.7 | **85%** | 293/294 (99.7%) |

Top content words at the budget — shipped: `{settlement}`×58, town×34, can×25, against×20 · licence: country×91, `{settlement}`×88, works×63, town×60, muster×38 · re-cut: `{settlement}`×53, country×40, town×35, garrison×24, works×24, out×21, muster×19, wall×17.

Three readings. (i) The re-cut recovers **73%** of the shipped distinct-word count at equal budget (377/519) where the licence text recovered 32%; content types 349 vs 143. (ii) The re-cut's two-clause `,and` join rate is the **highest of the three** (85% vs 63% shipped) — the exemplar pack names that rate as "our measured failure" and the round-1 drafts made it worse, not better; the joins are mostly earning their place (cost/contrast/withholding), but the construction tic is intact. (iii) First-three-word opener variety saturates in BOTH rewrites (96% / 99.7%), so opener variety does not discriminate — the licence text varied its openers and was still flat. Construction collapse lives in the content vocabulary, which §5 measures per pool.

Per-pool opener variety (distinct first-3-word openers / faces):

| pool | shipped | licence | re-cut |
|---|---|---|---|
| 1. Beasts & Monsters: `plagued`, perimeter AND organized force | 3/3 | 11/12 | 12/12 |
| 2. Beasts & Monsters: `plagued`, perimeter but NO force to hold it | 3/3 | 12/12 | 12/12 |
| 3. Beasts & Monsters: `plagued`, NO perimeter and NO force | 3/3 | 12/12 | 12/12 |
| 4. Beasts & Monsters: `frontier`, credible deterrence | 3/3 | 12/12 | 12/12 |
| 5. Beasts & Monsters: `frontier`, force without a perimeter | 3/3 | 12/12 | 12/12 |
| 6. Beasts & Monsters: `settled`, defenses beyond the need | 3/3 | 12/12 | 12/12 |
| 7. Beasts & Monsters: `settled`, nothing organized | 3/3 | 12/12 | 12/12 |
| 8. Invasion & War: walls AND professional garrison | 3/3 | 12/12 | 12/12 |
| 9. Invasion & War: walls with citizen militia | 3/3 | 12/12 | 12/12 |
| 10. Invasion & War: walls with NO force | 3/3 | 12/12 | 3/3 |
| 11. Invasion & War: force with NO walls | 3/3 | 11/12 | 12/12 |
| 12. Invasion & War: militia only | 3/3 | 12/12 | 12/12 |
| 13. Invasion & War: neither walls nor force | 3/3 | 12/12 | 12/12 |
| 14. Internal Security: full legal chain (court AND prison) | 3/3 | 11/12 | 12/12 |
| 15. Internal Security: court without detention | 3/3 | 12/12 | 12/12 |
| 16. Internal Security: detention without process | 3/3 | 11/12 | 12/12 |
| 17. Internal Security: no legal infrastructure | 3/3 | 12/12 | 12/12 |
| 18. Economic Survival: `STRONG` | 3/3 | 11/12 | 12/12 |
| 19. Economic Survival: `ADEQUATE` | 3/3 | 12/12 | 3/3 |
| 20. Economic Survival: `WEAK` | 3/3 | 10/12 | 12/12 |
| 21. Economic Survival: `CRITICAL` | 3/3 | 12/12 | 12/12 |
| 22. Disasters & Famine: granary AND hospital | 3/3 | 12/12 | 12/12 |
| 23. Disasters & Famine: granary AND parish care only | 3/3 | 11/12 | 12/12 |
| 24. Disasters & Famine: granary, NO medical provision | 3/3 | 12/12 | 12/12 |
| 25. Disasters & Famine: NO reserves, hospital present | 3/3 | 9/12 | 11/12 |
| 26. Disasters & Famine: NO reserves, NO medical provision | 3/3 | 11/12 | 12/12 |

## 2. REFUTATION LEDGERS (every face, every version)

Verdict vocabulary. **FAIL** — denied on every town the key matches, or a floor-2 grammar breach. **COND** — denied on a named subset of matching towns; **-H** the subset is essentially every generated town of the tier the key reaches (the roster row is `required`), **-L** a small subset, **-C** a table row exists but the same-page machine line agrees with the face, so the contradiction is table-visible and not page-visible. **PASS (note)** — passes with a remark. The pool keys are the corpus's (`defenseStateProse.js:393-597`): beasts `force = garrison || militia`; `settled country, perimeter` ignores the force; invasion: garrison outranks militia; disaster: the church is consulted only in the granary branch. Tier facts that drive the conditionals (institutionalCatalog.js, CONFIRMED): `Town granary` and `Parish churches (2-5)` and `Town hall` and `Town watch` are all `required: true` at town; `Garrison` and `Professional city watch` are city-only; `Barracks` is the only town-tier garrison row; `Citizen militia` rows stop at town; `Small hospital` (town, 0.3) is "Usually religious-run"; `Healer (divine, 1st level)` is a village row and a person; `Small prison/stocks` (town, 0.7) "Holding cells and public punishment"; `Multiple courthouses` is metropolis-only.

Consequences for the keys (PLAUSIBLE, from the catalog): the no-reserves pools (25, 26) fire only at village and below; `granary, NO medical` (24) and `detention without process` (16) cannot fire on a generated town at all (church and hall are required wherever a granary or a prison exists) — they are custom-roster pools; `court without detention` (15) fires on roughly a third of towns and its "court" is the Town hall.

### 2.1 RE-CUT a3e877e6e

**1. Beasts & Monsters: `plagued`, perimeter AND organized force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The country around {settlement} is thick with creatures. The wall's keeping and the patrols' provisioning fall under one heading, and an argument about either is an argument about both. | PASS |
| 2 | face | A wall, a muster and a bounty purse are what the accounts at {settlement} carry. The bounty is the entry people ask after, and what it is paid for is out in the country. | PASS |
| 3 | face | Creatures are a standing entry in the country around {settlement}, not a piece of news. The wall stands, the people are under arms, and the returns carry the cost of both. | PASS |
| 4 | face | The roll at {settlement} says who can be put out, and those who go into the country say what part of it they will not cross alone. Both entries stand in the record. | COND-H F1-24/F1-03 — 'The roll … says who can be put out' cites a muster roll; the only roll-keeper is `Citizen militia` (holderTable.js:279-288: 'a town with a Garrison and no militia has men under arms and no roll of them'). Garrison rows are Barracks (town) / Garrison (city); militia rows stop at town and are excluded by the required Town watch group — so on every generated town this pool draws for, the roll has no keeper. |
| 5 | street | Defense at {settlement} is not an emergency arrangement. The wall has people on it, the patrols go out, and what they go out into is full of creatures. | PASS |
| 6 | face | The gate at {settlement} takes the day's last traffic and then the bar goes across, and what is outside the bar stays outside until morning. | PASS |
| 7 | face | Money, not creatures, is what gets argued over at {settlement}. The bounty is the item, and the arguing is done where the muster can hear it. | PASS |
| 8 | face | A stretch of the road out of {settlement} is not taken alone. The town does not think that needs explaining, and it keeps a wall up and a guard on it all the same. | PASS |
| 9 | unfolding | What stands at {settlement} is a wall and a muster. What is left open is the country beyond them, and it is full of creatures. | PASS |
| 10 | face | The wall at {settlement} is older work than the purse that keeps it up, and the guard is paid out of that purse. Neither says anything about what is in the country tonight. | PASS |
| 11 | face | The people who walk the wall at {settlement} tell the country one way and the people who pay for the walking tell it another, and the town takes neither side. | PASS |
| 12 | face | A wall is up at {settlement} and a muster with it. Beyond both lies the country, and it keeps its creatures. | PASS |

**2. Beasts & Monsters: `plagued`, perimeter but NO force to hold it**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The defences at {settlement} are entered as standing, and under them the roster leaves a blank where a garrison or a militia would be named. The same entry has the country outside plagued with creatures. | PASS |
| 2 | face | No garrison is seated at {settlement} and no militia is raised, and the works stand without either. Their inner face is where the town keeps what it does not leave outside after dark, and the reason is the plagued country. | PASS |
| 3 | face | Creatures work the country around {settlement}, and the town answers with built work. Neither a garrison nor a militia is seated behind the built work. | PASS |
| 4 | face | Plagued country lies outside {settlement}, and the works that face it carry no garrison and no militia. Who goes out into that country, and how far out, is settled between the people who go. | PASS |
| 5 | visitor | A stranger walking in at {settlement} is told the hours before anything else, and the works on the way are good work with no garrison and no militia behind them. The country outside is plagued, and the hours are kept as carefully as the works. | PASS |
| 6 | face | The animals at {settlement} are brought inside the works before dusk, and a stranger arriving late enough to watch it done has the plagued country explained without asking. The town seats no garrison and raises no militia. | PASS |
| 7 | face | Coming up to {settlement} out of plagued country, a stranger meets works that are good and a town that has neither a garrison nor a militia. Nothing is left stacked against the outer face, and the reason is not explained to strangers. | PASS |
| 8 | face | Good work stands at {settlement} with no garrison in it and no militia, and the country outside is plagued. People going out on an errand carry more than the errand needs, and a stranger is not told why. | PASS |
| 9 | unfolding | The works at {settlement} stand to a plagued country, and the town's arrangements seat neither a garrison nor a militia in them. The ground outside is kept clear, and the keeping of it is somebody's work. | PASS |
| 10 | face | Stores lean against the inner face of the works at {settlement}, and the short way across the town runs along beside them. The roster shows no garrison and no militia, and the country outside is plagued. | PASS |
| 11 | face | The country at {settlement} is plagued and the works are sound, and the town seats neither a garrison nor a militia in them. Who decides when everything comes inside is not in the record. | PASS |
| 12 | face | Neither a garrison nor a militia stands to the works at {settlement}, and the works are good work. Water is fetched in company, and the plagued country is the reason. | PASS |

**3. Beasts & Monsters: `plagued`, NO perimeter and NO force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Under this heading the record gives {settlement} a country thick with creatures, no wall to the town and no garrison or muster of its own. It gives nothing after that. | PASS |
| 2 | face | Nothing is drawn round {settlement}, and no garrison or muster stands inside it. The beasts that work the open ground come up to the doors of the houses. | PASS |
| 3 | face | At {settlement} the stock comes in close at dark. The town has no wall for it to come in behind, no garrison, no muster, and a country outside full of things that feed on it. | PASS |
| 4 | face | The ground runs up to {settlement} on every side with nothing to stop at, no garrison or muster is kept here, and whose business it is to meet what walks in off a plagued country is not settled in the town. | COND-L F1-06 — 'whose business it is to meet what walks in … is not settled' — denied where an `Adventurers' charter hall` row stands (hamlet 0.12 / village 0.12: 'coordinates local defense'); the key does not exclude the charter bucket. |
| 5 | street | What {settlement} does about the beasts in the country is done door by door, with no wall to stand on and no garrison or muster to turn out. In the town it is spoken of as an arrangement. | PASS |
| 6 | face | The argument at {settlement} is whose stock is loose in the road once the light goes, and not what a loose animal draws in from the fields. With no wall to shut and no garrison or muster to call, the argument is what fills the evening. | PASS |
| 7 | face | Something heard in the fields at night is a household matter at {settlement}. No line runs round the town, no garrison sits in it, no muster comes out of it, and what is heard out there is not always stock. | PASS |
| 8 | face | That {settlement} has no wall, no garrison and no muster is not a thing the town discusses. What is in the country after dark, it discusses. | PASS |
| 9 | visitor | A stranger arriving at {settlement} crosses nothing to get in and cannot say afterwards where the town begins. No garrison quarters here and no muster is called, and beasts work the country on every side. | PASS |
| 10 | face | The wall a stranger looks for at {settlement} is not there, and the garrison and the muster asked after go the same way. What is out in the fields beyond the last houses is told at length by whoever is asked. | PASS |
| 11 | face | The way into {settlement} is not arranged as though anything were to be stopped on it: no wall crosses it, no garrison watches it, no muster forms on it. The creatures of the country use it as freely as anybody with business on it. | PASS |
| 12 | face | A house with room in it takes a stranger in at {settlement}, and the shutter is barred from the inside. The town keeps no wall, no garrison and no muster, and what moves in the country when the houses are shut is the shutter's business. | PASS |

**4. Beasts & Monsters: `frontier`, credible deterrence**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | An active frontier lies outside {settlement}, and what the town keeps against it is works with a force to stand on them. What the country holds is not entered at all. | PASS |
| 2 | face | The country outside {settlement} is entered as an active frontier, and beside that entry stands the town's own: works, and a force. | PASS |
| 3 | face | Works stand at {settlement}, a force goes up on them, and past both lies an active frontier. | PASS |
| 4 | face | Keeping the ground outside the works clear is a standing duty at {settlement}, shared out among the force, and the frontier is what the entry gives as its reason. | PASS |
| 5 | street | The frontier is spoken of in the town as a duty and not as a danger, and a night on the works is grumbled at like any other night's work. | PASS |
| 6 | face | Children play on the works. At dusk whoever is up there calls the children in, and the town finds neither half of that worth a remark. | PASS |
| 7 | face | Argument in the town runs on the rota rather than on the frontier itself: whose name comes round on the works, and who contrives to be elsewhere. | PASS |
| 8 | face | One corner of the works is left alone after dark, and nobody who stands the rest of them will say why, only that the country out there is frontier. | PASS |
| 9 | counterforce | Coming at {settlement} out of the country means coming at works, and at whoever is put on them, and the town would rather that were understood than tested. | PASS |
| 10 | face | No rule at {settlement} forbids sleeping outside the works, and nobody does. The country is frontier and the works are held, and a rule would be a formality. | PASS |
| 11 | face | A bounty stands at {settlement} for what is carried in out of the country, and the paying and the standing fall to the same hands. | PASS |
| 12 | face | Patrols go out of {settlement} into the country and come back. The works cannot go anywhere, and on a frontier that is the difference between them and the force. | PASS |

**5. Beasts & Monsters: `frontier`, force without a perimeter**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The frontier country around {settlement} is answered by armed people and by no wall at all. Whatever comes chooses the place, and the town arrives afterwards. | PASS |
| 2 | face | Nobody is stopped on the way into {settlement} and nobody is turned away. What the town has is a muster, and a muster is in one place at a time. | PASS |
| 3 | face | Nothing is kept out of {settlement}. What comes off the frontier is met by the town's own people, inside the town. | PASS |
| 4 | face | Wherever the people under arms at {settlement} stand, the houses furthest out are on the wrong side of nothing at all. | PASS |
| 5 | visitor | A stranger reaches {settlement} without being stopped, asked or turned aside. Whoever the town has under arms is met further in, and met by accident. | PASS |
| 6 | face | The last house on the way into {settlement} is simply the last house. A stranger is well inside the town before meeting anybody armed. | PASS |
| 7 | face | By whatever way a traveller comes to {settlement}, nothing on it says where the town begins. The people who would do the meeting stand somewhere within, and where they are wanted is not their choice. | PASS |
| 8 | face | Anyone arriving at {settlement} can see the arrangement whole before anybody explains it: frontier country, armed people, and no work standing between the country and the town. | PASS |
| 9 | street | The town can answer trouble and cannot prevent it, and whether the one is worth as much as the other is an argument that stands open. | PASS |
| 10 | face | Word comes in at night and the muster goes one way and not the other. The part of the town it leaves behind is a part of the town. | PASS |
| 11 | face | The town does not close at dark, and it does not pretend to. Trouble is answered where it happens to be, and answering is all the town claims. | PASS |
| 12 | face | The complaint in the town is not that it keeps armed people. It is that armed people go to a place, and the places they do not go to are also the town. | PASS |

**6. Beasts & Monsters: `settled`, defenses beyond the need**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | counterforce | Whatever the works at {settlement} are kept up for, it is more than the creatures of this country ask of them; what else they would answer is nobody's to say. | PASS |
| 2 | face | Children take the short way across the works at {settlement}, and the town leaves them to it. What comes out of this country asks less of the place than the works would answer. | PASS |
| 3 | face | The works at {settlement} stand beyond anything the creatures of this country press for, and the outer side of them is left to whatever grows there. | PASS |
| 4 | face | The keeping of the works at {settlement} is let out with the town's other contracts, and the country is not what hurries whoever takes it on. | PASS |
| 5 | ledger | Against beasts {settlement} is provided past its need, and the provision goes into the accounts as one line with no note against it. | COND F1 economicGates.military<1 — 'the provision goes into the accounts as one line with no note against it' — DefenseTab.jsx:343 prints `Upkeep underfunded: … at N%` under the row, and DS-DEF-11 draws WALLED-STRAINED on the same tab, whenever the gate < 1 (econOutput < 50). |
| 6 | face | Whoever makes the returns at {settlement} enters the works under a heading no one is asked to defend, and the works outrun the heading. | PASS |
| 7 | face | The books at {settlement} enter the works against creatures. The carters treat them as the edge of the town, and nothing in the record decides between the two. | PASS |
| 8 | face | The charge for the works at {settlement} falls in full against a country the record calls settled, and the entry goes in without comment. | COND F1 economicGates.military<1 — 'The charge for the works … falls in full … the entry goes in without comment' — same field; the fundingNote is the comment. |
| 9 | visitor | The first thing a stranger meets at {settlement} is the works. The road in suggests nothing they would be for. | PASS |
| 10 | face | Washing hangs along the works at {settlement} and a footpath crosses them, and a stranger who stops to look at it gets no explanation. | PASS |
| 11 | face | A stranger at {settlement} takes the works for the mark of a dangerous country and is put right by the town without much ceremony. | PASS |
| 12 | face | What stands at {settlement} is more work than this country asks of it, and a stranger sees as much from the road before anybody says so. | PASS |

**7. Beasts & Monsters: `settled`, nothing organized**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Quiet country lies round {settlement}, and the town keeps no work at its edge. Where the buildings stop, the town stops. | PASS |
| 2 | face | In heartland country the record at {settlement} runs empty in the places a defence would be entered: no bank, no barracks, no muster. | PASS |
| 3 | face | Walls and a standing muster belong to the frontier. The country around {settlement} is settled, and the town has neither. | PASS |
| 4 | face | Why nothing stands round {settlement} is entered nowhere. The quiet of the country is not the reason the record gives, because the record gives none. | FAIL F1-page (contestable under R-1) — 'Why nothing stands round {settlement} is entered nowhere … the record gives none' — DS-DEF-11 UNWALLED-SMALL ('too small to wall and knows it') / UNWALLED-LARGE ('spending its defense money on something else, and the books say what') prints a reason on the same tab for every unwalled town. Prose-vs-prose, so R-1 may file it WIRING rather than F1; either way the page contradicts itself. |
| 5 | street | No muster forms here, and the country is the quiet kind. | PASS |
| 6 | face | Nowhere here is kept clear for a turnout, and the space that would serve stands in use for something else. In settled country none is wanted. | PASS |
| 7 | face | People come in off the country with nothing at the way in set to meet them. The country out there is heartland, and the town leaves it at that. | PASS |
| 8 | face | Everything the town keeps up faces inward. The quiet country at its back is the one direction nothing is turned toward. | PASS |
| 9 | visitor | A stranger walking out of {settlement} has nothing to pass. No bank stands in his way and no bar lifts for him, and beyond the last building lies quiet country. | PASS |
| 10 | face | Nothing at {settlement} stops a stranger long enough to take his name, going out or coming back. The country he walks into is the settled kind. | PASS |
| 11 | face | Out beyond {settlement} a stranger finds tracks that go somewhere and nothing set against them. That is what a heartland looks like from a town that keeps no line. | PASS |
| 12 | face | Getting into {settlement} takes no leave and no answer: the town keeps no line to be let through, and settled country runs up to the doors. | PASS |

**8. Invasion & War: walls AND professional garrison**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The books at {settlement} carry the works and the men's wages under one head. The wage is entered; the names are not. | PASS |
| 2 | face | Keeping the defences and keeping men in pay are one duty in the reckoning at {settlement}, and no clerk here is asked to choose between them. | PASS |
| 3 | face | Against invasion the entry at {settlement} shows a work and a force, and the town is charged for both whether or not anything comes. | PASS |
| 4 | face | The men in pay at {settlement} are kept rather than called out, and what keeps them is the same charge that keeps the work up. | PASS |
| 5 | visitor | A stranger coming up to {settlement} sees the work before he learns that men are kept for it, and it is the keeping that makes an attempt dear. | PASS |
| 6 | face | The work at {settlement} is what a stranger sees from outside. That men are kept for it is what he is told before he asks. | PASS |
| 7 | face | An attempt on {settlement} would be charged for the work and charged again for the men kept for it. The charge for the men is the one nobody prices in advance. | PASS |
| 8 | face | Travellers in and out of {settlement} say the same of the place. The work is up, and the keeping of it is a paid trade. | PASS |
| 9 | street | The argument in this town is over what the works cost, never over whether they would serve. Men are kept for them, and the wage for the men is the same argument. | PASS |
| 10 | face | Children play at the foot of the works here and are not called off. The work stands, and men are kept at a wage to keep it standing. | PASS |
| 11 | face | A work standing and a wage that keeps men for it is what the town counts on. What is said about those men is another matter, and it is not said to them. | PASS |
| 12 | face | The town's position is that it could be held. That position rests on a work that stands and a wage that is paid. | PASS |

**9. Invasion & War: walls with citizen militia**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Entered against {settlement}: works, and the town's own people to stand in them. A raid is the sort of trouble that arrangement answers; a company arriving with engines is not. | PASS |
| 2 | face | The roll at {settlement} is kept by the muster it names, and the names on it belong to people with other work. Trouble that arrives in a hurry is what that answers; a siege train asks a different question. | PASS |
| 3 | face | Walls stand at {settlement}, and the duty of standing in them falls to people with a living to make besides. A raiding party would be met that way; an army would not. | PASS |
| 4 | face | Against raiders, the works at {settlement} and the people on them are an answer. Against a company that does this for its living, they are the same works and the same people. | PASS |
| 5 | street | The town would turn out, and what the turning out costs is somebody's living. | PASS |
| 6 | face | Whose turn it is to stand is a settled question in the town's own telling and an unsettled one door to door. | PASS |
| 7 | face | Whatever a household sends to the muster is work it is not getting done at home, and the arrangement runs on that. | PASS |
| 8 | face | In the town the word for it is turning out, never defense, and the difference is meant. | PASS |
| 9 | unfolding | What stands at {settlement} would meet a raid and hold. Past that the arrangement is a roll of names and whoever answers to it, and the town leaves open what that comes to. | PASS |
| 10 | face | A raid at {settlement} is the thing the muster is for. Anything that comes slower and in better order is the thing the town has no settled answer to, and the matter sits there. | PASS |
| 11 | face | The works at {settlement} are held by people with other work waiting on them. What the arrangement is good for past a raid is not a settled matter in the town. | PASS |
| 12 | face | Trouble that does not stay is what {settlement} is arranged for. Trouble that means to stay is a matter the record does not carry to its end. | PASS |

**10. Invasion & War: walls with NO force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} has walls and nobody to put on them. A determined attacker takes this town with ladders and patience, and requires nothing else. | FAIL F2-05 + COND-H F1-25 — 'nobody to put on them' — Town watch is required at town (gate duty); 'A determined attacker takes this town' is a flat prediction (the machine line predicts it too, but F2 is grammar-decidable). |
| 2 | visitor | A stranger at {settlement} sees a serious perimeter and a serious absence of anyone standing in it. | COND-H F1-25 — 'a serious absence of anyone standing in it' — the required Town watch stands gate duty. |
| 3 | street | The town has the thing that would save it and not the people who would use it, and says so when pressed. | COND-H F1-25 — 'not the people who would use it' — same. |

**11. Invasion & War: force with NO walls**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Against invasion {settlement} enters a paid force and no works. The force turns back a raid and cannot hold a siege, and the town's defense is paid out in wages rather than in stone. | PASS |
| 2 | face | The town's defense account at {settlement} carries a garrison and no work standing round the place. A garrison is good against a raid and not a thing that holds a siege. | PASS |
| 3 | face | No work at {settlement} stands to be held, so a siege is past the town's power. What answers a raid instead is a force on the town's wage. | PASS |
| 4 | face | A raid the force at {settlement} can meet, and a siege it cannot. The same purse answers for works and for wages, and with no works standing it answers for the men. | PASS |
| 5 | street | What holds {settlement} is men, with nothing built around the town. Stone would have to be broken; men would only have to be missed. | PASS |
| 6 | face | At {settlement} the defense is men and no works. The complaint in the town is that men have to be somewhere, and a wall does not. | PASS |
| 7 | face | Asked what {settlement} would do about an army, the town names men and no works. Asked what an army would do, it names the roads that go round the men. | PASS |
| 8 | face | Men rather than works defend {settlement}, and men can be walked around. The town says so and says no more. | PASS |
| 9 | visitor | A stranger meets no edge coming into {settlement}, only country giving way to houses with armed men somewhere among them. A fight here would be decided among the houses. | PASS |
| 10 | face | The garrison at {settlement} is quartered among houses, and a stranger goes by it without knowing. No work stands round the town to keep a fight off those streets. | COND-H F1 row desc — 'The garrison … is quartered among houses' — the garrison row a walled-less town can hold is `Barracks` (institutionalCatalog.js:1363, R-3: 'housing for guards or small garrison'); `Garrison` is city-only and city walls are required, so every generated town this pool draws for has a barracks the face denies. |
| 11 | face | What a stranger cannot find at {settlement} is a wall, a palisade or an earthwork for the men to be set behind. A fight would go where the men went, and men can go the wrong way. | PASS |
| 12 | face | Roads bring a stranger into {settlement} and stop at doors, with no wall or earthwork between. The men under arms are behind those doors, and a fight here would find them at home. | COND-H F1 row desc — 'The men under arms are behind those doors … a fight here would find them at home' — same Barracks row. |

**12. Invasion & War: militia only**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The muster at {settlement} can be called, and the town keeps no works to call it to. That is an answer to a raiding band and a list of names to an army in order. | PASS |
| 2 | face | A raiding party is the shape of trouble the arrangement at {settlement} answers, and the answer stops there. A force under orders would find no line standing at the edge of the town. | PASS |
| 3 | face | Calling the muster at {settlement} stops the work of those called, and that stopped work is the whole cost of it. The trade is a good one against a band with no plan and no trade at all against a campaign. | PASS |
| 4 | face | Against war the entry for {settlement} reads a body and no works, and nothing in the record reconciles the two. Raiders meet the body, and anything that arrives in order meets the gap. | PASS |
| 5 | street | The town can raise its muster and knows what the muster is for. An army under a commander is not what it is for, and that is understood here without being said. | PASS |
| 6 | face | On an ordinary day the muster is invisible and those on it are at their trades. It comes out of the houses when it is called, and a force that soldiers for a living is not stopped by a thing that lives in houses. | PASS |
| 7 | face | Where the muster forms is settled on the day it forms, because the town has no line and nothing to gather behind. A raiding band meets the town as it finds it, and a force with a plan does the choosing. | PASS |
| 8 | face | Planning here goes as far as a band on the road and no further, and the town does not call that a failing. What it plans with is a duty on its own people, and the duty comes with no place to put them. | PASS |
| 9 | visitor | A stranger comes into {settlement} without being stopped and meets armed townspeople well inside it. An army would not have to break anything to stand where he is standing. | PASS |
| 10 | face | Weapons at {settlement} turn up in the hands of people who have trades, and a stranger can see where those hands go the rest of the day. None of it looks like a company under orders. | PASS |
| 11 | face | Nothing bars the way into {settlement}, and a stranger is among the houses before the town has any account of him. An army coming up behind him would be stopped by exactly as much. | PASS |
| 12 | face | Directions to the defence of {settlement} end at people and never at a place, because the town keeps no works to point him at. Raiders are met by the people, and a campaign asks after the place. | PASS |

**13. Invasion & War: neither walls nor force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Against war the entry for {settlement} reads no wall, no soldiers of the town's own, and no roll. The houses stop, and nothing is set between them and the country. | PASS |
| 2 | face | The tools in the houses at {settlement} are the tools of the fields, and against war that is what the town has. Nothing stands at its edge, no barracks is built in it, and nothing in it is drilled. | COND-H(town) F1-25/F4-19 — 'nothing in it is drilled' / 'no barracks' — at town tier `Town watch` is required:true ('Part-time guards. Night patrol and gate duty.') and its wages arm the military purse (F4-19). PASS at village and below. |
| 3 | face | A defence against war is set down under the works and under the men, and at {settlement} neither head carries anything. Whatever comes up the approach is seen from the fields before it is seen from the houses. | COND-H(town) F1-25 — 'at {settlement} neither head carries anything' — the men's head carries watch wages at town tier (defenseGenerator.js:163 military += 7 for hasWatch; F4-19). |
| 4 | face | The cheapest work a town can put round itself is a ring of stakes, and {settlement} has not got that. No soldiering is done on the town's account, and no list is kept. | PASS |
| 5 | counterforce | A wall against an army wants timber or stone, a drilled body wants the town's own men, and soldiers want paying. None of it is done at {settlement}. | COND-H(town) F1-25 — 'soldiers want paying. None of it is done at {settlement}' — watch wages are paid at town tier; also a `Mercenary company` row where present. |
| 6 | face | Nothing at {settlement} is quartered or drilled at the town's own charge, and nothing stands round it that an army would meet. Where the town ends is a question for whoever holds the ground. | COND-H(town) F1-25 — 'Nothing at {settlement} is quartered or drilled at the town's own charge' — the required Town watch is at the town's charge. |
| 7 | face | The ground is worked right up to the houses at {settlement}, where another town would keep a bank and a ditch. Against an army it keeps neither soldiers nor drilled men. | COND-L F1-05 — 'keeps neither soldiers nor drilled men' — denied where a mercenary row stands (contracted soldiers). |
| 8 | face | Set against war, {settlement} has no work standing at its edge and no soldiers of its own. No roll is kept in the place. | PASS |
| 9 | street | Against an army the place keeps no soldiers of its own and no drill, and the building stops at the last house on the way out. | PASS |
| 10 | face | No evening in the place is given to a drill, no work in it goes to a wall, and no soldiering is done on its own account against an army. | PASS |
| 11 | face | What the place has not got is a wall, soldiers of its own, or a drill against an army. | PASS |
| 12 | face | With nothing to shut at the edge of the place, no roll in it and no soldiers that answer to it, what the people there have instead of a wall is the country. | PASS |

**14. Internal Security: full legal chain (court AND prison)**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | A matter at {settlement} is settled in one place and a person is kept in another. The second waits on the first. | COND-C F1-12 — 'a person is kept in another. The second waits on the first' — detention pending a hearing is criminal procedure; `hasCourtSystem` fires on the required `Town hall` ('Meeting place and administrative center'), and `Multiple courthouses` exists only at metropolis. The same-row machine line ('Full legal infrastructure provides enforcement capacity') agrees with the face, so a GM sees no contradiction on the page. |
| 2 | face | Before a magistrate at {settlement} a dispute is heard out. In the cells a person waits on the same hearing. | COND-C F1-12 — 'Before a magistrate … a dispute is heard out. In the cells a person waits on the same hearing' — same ground. |
| 3 | face | The court at {settlement} keeps the papers, the cells keep the people, and the papers settle who goes home. | COND-C F1-12 — 'the papers settle who goes home' — a verdict releasing prisoners; same ground. |
| 4 | face | The cells at {settlement} are older work than the court they answer to, and the order of it is not explained. | PASS |
| 5 | street | A wrong done at {settlement} has somewhere to be taken and somewhere to be kept, and neither place is whoever happens to be nearest. | PASS |
| 6 | face | One door takes a building permit, a levy and a quarrel over a boundary. At {settlement} the cells take the rest. | PASS |
| 7 | face | Two ways lead out of the cells at {settlement}, a decision or a payment. For a person who can reach neither, the record has no word. | COND-C F1-12 — 'Two ways lead out of the cells … a decision or a payment' — a sentence; same ground. |
| 8 | face | Court and cells at {settlement} come out of one purse, and a shortfall in it falls on both of them or on neither. | PASS |
| 9 | visitor | A stranger arriving at {settlement} with a complaint is pointed to one building; a stranger who is the complaint is held in the other. | PASS |
| 10 | face | At the court door at {settlement} the business is other people's: a deed witnessed, a tax paid, a name put on a register. The cells are what a stranger gets told about. | PASS |
| 11 | face | A newcomer can stand in front of the court at {settlement} without knowing it, and makes no such mistake about the cells. | PASS |
| 12 | face | What an outsider brings to the court at {settlement} is taken in and written down. Whether it ends in the cells or in a fee is settled out of sight. | COND-C F1-12 — 'Whether it ends in the cells or in a fee' — a sentence; same ground. |

**15. Internal Security: court without detention**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} enters a wrong in the same book as a licence and a levy, with nowhere to put the person while the entry is written. What answers it is a fine or a banishment. | COND-C F1-12 — 'What answers it is a fine or a banishment' — a criminal sentence on a hall-only court (Town hall required at town; prison row absent by key). Machine line 'Courts prosecute but limited detention' agrees with the face. |
| 2 | face | The line that pays for order at {settlement} carries a gaol in its name and no gaol under it. What is heard here is answered in coin or in distance, because keeping a person is beyond the town. | COND-C F1-12 — 'answered in coin or in distance' — same. |
| 3 | face | Coin and the road are what {settlement} sets against a wrong, and neither falls the same way on one house as on the next. Nothing is kept here but the entry. | COND-C F1-12 — 'Coin and the road are what {settlement} sets against a wrong' — same. |
| 4 | face | A grievance and a deed wait in the same line at {settlement} and are settled at the same table. What leaves that table is coin, or a person on the road, because there is nowhere to keep one. | COND-C F1-12 — 'What leaves that table is coin, or a person on the road' — same. |
| 5 | street | The town can put a name to a wrong and cannot put a hand on whoever did it, so it charges money or sends the person off. | COND-C F1-12 — 'charges money or sends the person off' — same. |
| 6 | face | A matter is heard, and the one it concerns leaves by the same door as the people who come to watch. Nothing is done with a person here, so the town takes coin or an empty house. | COND-C F1-12 — 'the town takes coin or an empty house' — same. |
| 7 | face | Some wrongs come to the law here and some are settled between houses. The ones that come in are named, and then paid for or walked away from, because nobody is kept. | COND-C F1-12 — 'paid for or walked away from' — same (weak). |
| 8 | face | A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here. Naming is what the law can do; keeping is not. | COND-C F1-12 — 'A fine is nothing to a house that can pay it, and the road is hardest …' — same. |
| 9 | unfolding | Whatever can be decided at {settlement} is decided, and the town holds no one past the deciding. The one who will neither pay nor go is where the arrangement runs out. | COND-C F1-12 — 'The one who will neither pay nor go' — same. |
| 10 | face | A permit at {settlement} is finished where it is asked for, and a wrong is finished as far as the naming and no further. The part that would need a person kept has no place to be done. | PASS |
| 11 | face | Nothing stands between a finding at {settlement} and the answer to it, because the town has no room to put a person in the meantime. A fine and a departure are near to hand, and neither needs a door that locks. | COND-C F1-12 — 'A fine and a departure are near to hand' — same. |
| 12 | face | A judgement at {settlement} is the whole of the town's part, because there is nowhere to keep the person it falls on. Paying or walking is that person's own choice, and the record says nothing about a refusal. | COND-C F1-12 — 'Paying or walking is that person's own choice' — same. |

**16. Internal Security: detention without process**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Law at {settlement} runs as far as the keeping of a person and stops there. What would decide the keeping is not entered anywhere. | PASS |
| 2 | face | A locked door at {settlement} is ordinary furniture, and the whole of what stands behind it is whoever turns the key. | PASS |
| 3 | face | The allowance for law at {settlement} has a head for keeping prisoners and a head for deciding. The town has nothing to spend the second on. | PASS |
| 4 | face | The cells at {settlement} do their work. Nothing above them answers for what they hold. | PASS |
| 5 | visitor | A stranger at {settlement} can be put somewhere. A stranger who wants something put right has nowhere to bring it. | PASS |
| 6 | face | Held at {settlement} means a door that locks. Punishment means something the neighbours can stand and watch, and a stranger will find nobody in the town who owes an account of either. | PASS |
| 7 | face | Strangers at {settlement} settle a quarrel where it starts and do not let it travel. A quarrel that travels reaches a cell, and a cell is where the town's law runs out. | PASS |
| 8 | face | In a town with courts a stranger would have somewhere to be wrong. At {settlement} the wrong itself is never established, and the person is held all the same. | PASS |
| 9 | street | Putting a person away at {settlement} is a thing the town can do and cannot account for. On whose word it is done is not a question anybody asks. | PASS |
| 10 | face | A knife is not the only thing that gets a person taken up at {settlement}. Owing money will do it, and nobody in the town is charged with telling the one case from the other. | PASS |
| 11 | face | A person can be held at {settlement} and nothing in the town's week makes an occasion for saying why. Among the people who live there the holding is a fact and the reason is not. | PASS |
| 12 | face | The people {settlement} holds get fed, and nothing in writing anywhere says what for. | PASS |

**17. Internal Security: no legal infrastructure**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | A matter at {settlement} is heard where the parties are standing, for want of a room to hear it in and anywhere to keep them apart. | PASS |
| 2 | face | Whoever is wronged at {settlement} is answered before the company breaks up. The town has no room to come back to and nowhere to keep the other party until morning. | PASS |
| 3 | face | Custody and a hearing room are what {settlement} does without; the hearing is whoever is within earshot. | PASS |
| 4 | face | Everything a hearing needs at {settlement} is borrowed: the room from one household, the bench from the next. The town keeps no cell. | PASS |
| 5 | street | The town settles its own quarrels where they begin. No room is set apart for the purpose, and nothing in the place can hold a man. | PASS |
| 6 | face | Quarrels are heard in the open. Nobody is kept overnight. | PASS |
| 7 | face | What passes for a hearing is whoever is standing about when the argument starts. What passes for a gaol is a promise, made in front of the same people. | PASS |
| 8 | face | Whatever is decided here is decided by people who go on living next to each other. No door shuts on it, and nothing keeps a man here but his own business. | PASS |
| 9 | visitor | A stranger wronged at {settlement} is pointed toward people rather than a door. No room here is appointed to the business, and at the end of it no cell. | PASS |
| 10 | face | A traveller through {settlement} passes no bench set apart for a hearing and no door the town could lock a man behind. | PASS |
| 11 | face | Whoever brings a complaint into {settlement} brings it to people and not to a place, and what he leaves behind when he goes is nothing the town can hold. | PASS |
| 12 | face | Asking at {settlement} where a wrong is answered gets a person and not an address, and what that person can do stops short of a room and a lock. | PASS |

**18. Economic Survival: `STRONG`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | A crisis that runs long is answered at {settlement} the same way a short one is, and the long one is the answer that costs. | PASS |
| 2 | face | No building at {settlement} holds what the town could spend on a bad stretch. | PASS |
| 3 | face | Carts hired at {settlement} when something goes wrong go on being hired, and the going on is the expensive part of any answer the town makes. | PASS |
| 4 | face | What would answer a long pressure at {settlement} sits idle while nothing is wrong, and the spending of it is settled nowhere. | PASS |
| 5 | street | When something goes wrong here, the work already let out goes on being done, and the trouble is one thing happening rather than the only thing happening. | PASS |
| 6 | face | The town can carry a long emergency, and what that is worth when nothing is wrong is a question that gets different answers here. | PASS |
| 7 | face | A bad season here would not change the shape of the week. | FAIL F2-05 — 'A bad season here would not change the shape of the week' — a modal-future course over a season (the table's own example shape: 'would not last a winter'); also denied outright on a STRONG town under `under_siege`/`famine` stress, whose banner prints 'Land-based economic activity is suspended'. |
| 8 | face | Whatever is put in hand here when trouble comes stays in hand while the trouble lasts. What it costs to keep it there is argued over and paid. | PASS |
| 9 | counterforce | Trouble at {settlement} stays one trouble, and paying for it does not open another somewhere else in the town. | PASS |
| 10 | face | Nothing at {settlement} is set aside to pay for what is going wrong, and the work that has nothing to do with the trouble is left alone. | COND-C F1-25 — 'Nothing at {settlement} is set aside to pay for what is going wrong' — STRONG is storage-driven (defenseGenerator.js:256-270) and `Town granary` is required at town+ ('Buffers harvests, prevents famine'); row 5 on the same box prints 'Granary provides food buffer'. Contestable: the face says coin, the row holds grain. |
| 11 | face | Something going wrong at {settlement} brings no collection round, and no list is drawn up of who must give what. The answer comes out of the ordinary running of the place. | PASS |
| 12 | face | A pressure at {settlement} does not breed another, and what holds it to the one is the spending the town can keep up rather than any run of luck. | PASS |

**19. Economic Survival: `ADEQUATE`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} can fund a short crisis. A long one begins eating reserves within a few months, and the reserves are not deep enough to hide that from anybody. | FAIL F2-02 — 'begins eating reserves within a few months' — a duration the read does not hand you (the machine line says 'within months' too). |
| 2 | unfolding | The town's capacity to pay for its own emergencies is real and finite, and every season of pressure moves the finite part closer. | FAIL F2-06/F2-08 — 'every season of pressure moves the finite part closer' — a rate and a trend. |
| 3 | threshold | {settlement} can pay for a crisis of the ordinary length; the edge of what it can fund lies a few months past the beginning of one, and the town has not been asked to find out where. | FAIL F2-02 + F2-04 — 'a few months past the beginning' and 'has not been asked to find out' — a duration and a history. |

**20. Economic Survival: `WEAK`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | What {settlement} could put behind a crisis is decided in advance of the crisis, and decided by what the town is doing when nothing is wrong. | PASS |
| 2 | face | Carriage, relief and the stopping of other work are what a trouble costs {settlement}, and the town is short of each before it begins. | PASS |
| 3 | face | Nothing at {settlement} stands ready against a trouble the town cannot name, and an answer to one comes out of work going elsewhere. | PASS |
| 4 | face | One answer at a time is what {settlement} manages, and the work that stops to give it is the price. | PASS |
| 5 | street | The account {settlement} gives of what it could do about something sudden is a list of the things that would have to stop. | PASS |
| 6 | face | Whoever would have to carry {settlement} through something is carrying a load of their own, and that load goes down when the town calls. | PASS |
| 7 | face | A sudden call at {settlement} falls on whatever the town is doing instead, and the argument that follows is about what the place can spare. | PASS |
| 8 | face | Somebody at {settlement} asked what the town would do about a thing gone wrong answers by naming the work they would have to put down. | PASS |
| 9 | unfolding | Trouble at {settlement} does not find a town with nothing. It finds a town with nothing free. | PASS |
| 10 | face | When more is asked of {settlement} than it can answer, something goes unanswered, and nothing in the place decides beforehand what gets left. | PASS |
| 11 | face | The shortage at {settlement} is not a thing a stranger could be walked to. The town is arranged around it all the same. | PASS |
| 12 | face | What a trouble at {settlement} would want and what the town can reach for in a hurry are not the same thing, and it is the reach that comes up short. | PASS |

**21. Economic Survival: `CRITICAL`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | A sustained pressure asks a town for hands taken off other work and somebody to send them. At {settlement} the asking finds nobody it belongs to. | COND-H(town) F1-25 — 'somebody to send them. At {settlement} the asking finds nobody it belongs to' — at town+ the roster carries a required Town watch and Town hall (and a Barracks / charter hall where rolled); the band is `scores.economic`, a money-and-storage measure, and says nothing about organisation. |
| 2 | face | Anything that runs long at {settlement} comes down to errands, and whose errands they are is a question the town leaves open. | COND-L F1-25 — 'whose errands they are is a question the town leaves open' — weak form of the same denial. |
| 3 | face | Should something press on {settlement} and not let up, it would be met by whoever could be got hold of, and none of that would be arranged beforehand. | COND-H(town) F1-25 — 'none of that would be arranged beforehand' — a charter hall 'coordinates local defense'; a watch and hall are standing bodies. |
| 4 | face | The town can spare what it can spare. Anything at {settlement} that runs past that goes unmet. | PASS |
| 5 | unfolding | A pressure that runs on stops asking the town what it holds and starts asking what it can set moving, and the moving is what the town cannot do. | PASS |
| 6 | face | Whatever the town holds is not the difficulty. Turning it into an answer is, and nothing in the town is set up to do it. | COND-H(town) F1-25 — 'nothing in the town is set up to do it' — same. |
| 7 | face | A weight that keeps on wants carrying at the start and arranging after that, and the town is good for the carrying and not the arranging. | PASS |
| 8 | face | When something serious begins, nothing in the town begins with it. | COND-H(town) F1-25 — 'When something serious begins, nothing in the town begins with it' — same; safetyProfile prints 'The citizen militia … reliable in a crisis' where a militia stands. |
| 9 | street | What gets said at {settlement} when something needs seeing to is that somebody ought to, and the sentence stops there. | COND-L F1-25 — 'somebody ought to, and the sentence stops there' — weak form. |
| 10 | face | An emergency at {settlement} would fall on people who have work of their own, and getting word to them is left to whoever thinks of it. | COND-H(town) F1-25 — 'would fall on people who have work of their own' — a Barracks garrison has no other work; a watch is the town's paid body. |
| 11 | face | A job at {settlement} that is no one's in particular waits; that is the kind of job a bad business is made of. | PASS |
| 12 | face | People at {settlement} can describe what would need doing if something went badly wrong, and nobody can say who would begin it. | COND-H(town) F1-25 — 'nobody can say who would begin it' — same. |

**22. Disasters & Famine: granary AND hospital**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Grain is kept at {settlement} against a harvest that fails, and the house that answers sickness is a religious foundation. | PASS |
| 2 | face | What {settlement} sets against hunger is grain under a keeper, and what it sets against sickness is a house that answers to its faith. Between them they are what a household with nothing falls back on. | PASS |
| 3 | face | The grain at {settlement} is nobody's own, and neither is the house that answers sickness. A household that wants either must ask. | PASS |
| 4 | face | At {settlement} the grain is a matter of storage and sickness a matter of religion. The town names them in one breath. | PASS |
| 5 | street | The town has grain and a religious house that answers sickness, and it takes having both for ordinary. A town with one and not the other takes it otherwise. | PASS |
| 6 | face | Because the grain belongs to nobody in particular, the one who keeps its door is worth being on good terms with. Nobody says the same about the house that meets sickness. | PASS |
| 7 | face | What the grain is for is clear; what the religious house can do when sickness comes is not. That question goes unsettled. | PASS |
| 8 | face | Hunger and sickness are both a house's business in the town, and neither house asks what a household can pay. | PASS |
| 9 | counterforce | Against a failed harvest {settlement} has grain, and against an outbreak a house of religion. Ground for the dead is kept regardless. | PASS |
| 10 | face | Neither a failed harvest nor an outbreak finds {settlement} with nothing standing against it: the grain is one answer and a religious house is the other. | PASS |
| 11 | face | Some towns keep grain and cannot answer sickness; others answer sickness and keep no grain. Both stand at {settlement}. | PASS |
| 12 | face | Hunger meets a locked door at {settlement}, and sickness meets a house kept by the faithful. The town does not say which of them it trusts. | PASS |

**23. Disasters & Famine: granary AND parish care only**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The granary at {settlement} is for grain and the parishes are for the faith. For sickness the town keeps no house at all. | PASS |
| 2 | face | Parish churches at {settlement} are in the town and so is the granary. No monastery is here, and no friary, and no hospital. | PASS |
| 3 | face | Against hunger {settlement} has a building; against sickness it has parishes, and a parish is no hospital. | PASS |
| 4 | face | Somebody at {settlement} holds the granary key and somebody else the parish doors, and no key in the town opens a house for the sick. | PASS |
| 5 | street | Here the granary is not thought about and neither are the parishes. Where a sick household is to go is thought about, and it is not settled. | PASS |
| 6 | face | Ask for the granary and it is pointed out, and the same for any of the parishes. Ask where the sick are taken and the pointing stops. | PASS |
| 7 | face | People here take the granary for granted and do not take the parishes for a hospital. When a sickness comes the town prays, and the sick keep to their own beds. | PASS |
| 8 | face | The town has somewhere for its grain, parishes for its faith, and no quarter anybody keeps clear of, because nothing here gathers the sick together. | PASS |
| 9 | visitor | A stranger at {settlement} finds the granary without asking and the parishes without looking. What is looked for next and not found is anywhere the sick are taken. | PASS |
| 10 | face | From the street at {settlement} the granary reads as one thing and the parishes as another. Neither reads as a place for the ill. | PASS |
| 11 | face | Whoever comes new into {settlement} is shown the granary and sees the parish churches on the way. Of a hospital there is nothing to show. | PASS |
| 12 | face | The parishes at {settlement} keep their own burial grounds, and a stranger bound for the granary passes them without remark. Nothing else in the town is set aside for what a sickness leaves. | PASS |

**24. Disasters & Famine: granary, NO medical provision**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} has a grain store against a failed harvest and nothing at all against disease. Hunger has an address in this town and sickness has none. | PASS |
| 2 | face | Grain at {settlement} is held in common and the weighing is somebody's charge. A fever belongs to the household it lands in, and no provision of the town's would lift it off them. | PASS |
| 3 | face | For its grain {settlement} has a store. For the sick it has neither house nor office, and what stands in their place is a neighbour. | PASS |
| 4 | face | Nothing on the roster at {settlement} answers a sickness. The grain does better, with a building of its own and somebody answerable for the key to it. | PASS |
| 5 | unfolding | The town's answer to hunger is a building. Its answer to a fever is the house the fever is in, and whoever else is under that roof. | PASS |
| 6 | face | A sickness that comes into this town finds no building meant for it, and no door to knock at but a private one. Grain that comes in finds a building. | PASS |
| 7 | face | The dead in this town have ground of their own, and the grain has a roof of its own. Between those provisions, the sick have the house they are in. | PASS |
| 8 | face | A sick person in this town is a household matter and goes on being one. The town keeps nothing that would come to the door. | PASS |
| 9 | street | At {settlement} grain is carried to a store. A sick person is carried nowhere, and stays in the room they are in. | PASS |
| 10 | face | A traveller who takes a fever at {settlement} becomes a householder's business. No office in the town would take that business off the householder. | PASS |
| 11 | face | Sacks go up into the store at {settlement}. A fever goes into a house and stays there, and the neighbours keep a distance that goes by no name. | PASS |
| 12 | face | An illness at {settlement} is tended with a family's own water, behind a door the family shuts. The town has no part in it. | PASS |

**25. Disasters & Famine: NO reserves, hospital present**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Against sickness {settlement} has somebody to send for. Against a bad harvest it has nothing put by at all. | PASS |
| 2 | face | The care for the sick at {settlement} is a door to knock on. The town keeps no food against a bad harvest, and hunger has no door at all. | PASS |
| 3 | face | No common store of grain stands at {settlement}, and a bad year is met house by house. A sickness is answered from outside the household; a bad year is not. | PASS |
| 4 | face | Help for the sick is on the record at {settlement} and stored grain is not, so a failed crop falls to private hands and nowhere else. | PASS |
| 5 | street | The town is better set against the sickness than against the hunger: a house with a fever knows where to go, and a house short of grain does not. | PASS |
| 6 | face | Sickness here is somebody's work. Hunger has no store to open, and what is done about it is done indoors. | PASS |
| 7 | face | A sickness here can be paid for. A bad year cannot, and what meets it is whatever the house has kept back. | PASS |
| 8 | face | A fever in this town gets attended to. A bad harvest is met out of what the houses hold, and what the houses hold is not counted anywhere. | PASS |
| 9 | unfolding | Everything {settlement} has against a sickness comes when it is called. Everything it has against a bad year sits in the houses, and none of it is held in common. | PASS |
| 10 | face | The town is arranged against the sickness and not against the hunger, and what {settlement} would open in a hungry year is a question the record leaves standing. | PASS |
| 11 | face | What {settlement} has against a sickness is skill that can be fetched. What it has against a bad harvest is not kept in any one place. | PASS |
| 12 | face | Provision at {settlement} runs toward the sick and no further. Grain is not laid in, and a failed crop finds the town exactly as it stands. | PASS |

**26. Disasters & Famine: NO reserves, NO medical provision**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} holds no store in common against a bad year and gives no room over to the sick. | PASS |
| 2 | face | The sum of what {settlement} has by it is nobody's to keep. No one is paid for sitting with the sick, and the sitting falls to the house. | PASS |
| 3 | face | A store and a sick-house are each an office as much as a building, and no one at {settlement} holds either office. | COND-L F1-25 — 'no one at {settlement} holds either office [sick-house]' — at village `Parish church` is required and the same row prints 'Parish clergy provide basic wound care'; the key does not consult the church (defenseStateProse.js: 'A CHURCH COUNTS AS MEDICAL PROVISION ONLY IN THE GRANARY BRANCH'). |
| 4 | face | Whatever is put by at {settlement} against a hard year is put by behind somebody's own door, and the sick are nursed in their own beds. | PASS |
| 5 | street | When the food runs short the asking starts at a neighbour's door, and when somebody falls ill the same door is knocked on. Neither has a door of its own. | COND-H(village) F1-25 — 'when somebody falls ill the same [neighbour's] door is knocked on. Neither has a door of its own' — the required village Parish church is a door for the sick on the engine's own line. |
| 6 | face | What stands in for a store here is knowing what a house would admit to holding, and what stands in for a sick-house is somebody's own room. | PASS |
| 7 | face | Food reaching a house that runs short comes out of another house's own, and what is done for its sick comes out of somebody's working day. Both go on the count. | PASS |
| 8 | face | Somebody who falls ill here stays in the room they sleep in, and the house goes on around them. Whatever that house puts by is in the same room. | PASS |
| 9 | visitor | The answer a stranger gets at {settlement}, whether he asks after the store or after the sick-house, is a name and a door. | PASS |
| 10 | face | A traveller taken ill at {settlement} becomes the business of whatever roof he is under. No room is set apart for him, and he has no claim on anybody's store. | PASS |
| 11 | face | Every room a stranger passes at {settlement} has something in it, and not one of them is kept back against want or against a sickness. | PASS |
| 12 | face | A stranger wanting food or a bed for somebody ill is sent to a household at {settlement}, and a household may ask what he brings, or may not want him under the roof. | PASS |

**RE-CUT a3e877e6e totals (CONFIRMED count of the verdicts above):** 294 faces · FAIL 6 · COND 40 · PASS 248. Floor tallies over the non-PASS verdicts: F1 ×4, F1-03 ×1, F1-05 ×1, F1-06 ×1, F1-12 ×16, F1-24 ×1, F1-25 ×18, F1-page ×1, F2-02 ×2, F2-04 ×1, F2-05 ×2, F2-06 ×1, F2-08 ×1, F4-19 ×1.

### 2.2 SHIPPED f2da5a3ee

**1. Beasts & Monsters: `plagued`, perimeter AND organized force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The country around {settlement} is thick with creatures and the town has answered it properly: there is a wall to hold and there are people to hold it, and both are in use constantly. | FAIL F2-06 — 'both are in use constantly' — a rate. |
| 2 | street | Defense at {settlement} is not an emergency arrangement, it is the week's work: the rotations run, the gates close on time, and nobody treats any of it as unusual. | PASS |
| 3 | unfolding | What {settlement} has built is holding against the pressure and is being spent doing it; the posture is survivable, and survivable is the most that can be said of it here. | PASS (note) — 'is being spent doing it' is durative but anchorless; the machine line itself is in the perfect ('have established'). |

**2. Beasts & Monsters: `plagued`, perimeter but NO force to hold it**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night. | FAIL F2-02/F2-05 + COND-H F1-25 — 'cannot supply for more than a night' — a duration; 'nobody to man it' — the required Town watch stands gate duty at town. |
| 2 | visitor | A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal. | COND-H F1-25 — 'long stretches of good work with nobody on them' — the required Town watch. |
| 3 | unfolding | The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed. | FAIL F2-08/F2-06 — 'doing less each season as the watch thins, and the thinning is not being reversed' — a trend and a rate (slow thinning alone is licensed by R-9; the seasonal clock is not). |

**3. Beasts & Monsters: `plagued`, NO perimeter and NO force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | An embattled country and nothing organized standing in it: {settlement} has no line, no force and no specialist recourse, and survival here rests on terrain, distance and the ability to leave. | COND-L F1-06 — 'no specialist recourse' — denied where a charter-hall row stands; the key does not exclude it. |
| 2 | street | The town does not defend itself. What it does is watch, and move, and hope the pressure goes around it, and that is understood by everyone in it. | PASS |
| 3 | visitor | A stranger arriving at {settlement} understands the danger before anybody explains it, because nothing about the place is arranged as though danger were expected to be met. | PASS |

**4. Beasts & Monsters: `frontier`, credible deterrence**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} sits on an active frontier with a line and a force behind it. Most of what comes out of the country will not press a defended perimeter, and most of what comes here does not. | FAIL F2-06/F2-05 — 'Most of what comes out of the country will not press … and most of what comes here does not' — a rate and a modal future. |
| 2 | street | The town takes the frontier seriously and has taken it seriously long enough that the arrangements are ordinary rather than anxious. | FAIL F2-05 — 'has taken it seriously long enough' — an elapsed course. |
| 3 | counterforce | Very little reaches {settlement} out of the wild country, and the reason is that the arrangements are visible from a long way off. | FAIL F2-06 — 'Very little reaches {settlement} out of the wild country' — a rate of incursion. |

**5. Beasts & Monsters: `frontier`, force without a perimeter**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} keeps armed people on an open frontier, which means the defense is reactive: whatever comes chooses where the fighting happens, and the town arrives afterwards. | PASS |
| 2 | visitor | A stranger finds soldiers at {settlement} and no wall for them to stand on, and can see how that would go against anything that arrived in more than one place. | COND F1-27/F1-03 — 'A stranger finds soldiers' — the key is garrison OR militia; a militia is 'Part-time service', not soldiers. |
| 3 | street | The town can answer trouble and cannot prevent it, and the difference costs it something every season. | FAIL F2-06 — 'costs it something every season' — a rate. |

**6. Beasts & Monsters: `settled`, defenses beyond the need**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | counterforce | There is very little in the country around {settlement} and there are substantial works facing it; whatever the walls here are for, it is not the creatures. | PASS |
| 2 | ledger | {settlement} is comfortably over-provided against beasts. The pressures that matter to this town are internal, and its defensive spending does not reflect that. | COND-C F1 — 'The pressures that matter to this town are internal' — denied where `safetyLabel` prints Very Safe/Safe beside it; contestable (the settled+any machine branch says the same). |
| 3 | visitor | A stranger notices the perimeter at {settlement} chiefly for how relaxed the people on it are. | PASS |

**7. Beasts & Monsters: `settled`, nothing organized**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} keeps no organized defense against the country, and in a heartland this quiet the arrangement is a reasonable one rather than a gap. | PASS |
| 2 | street | The town has never needed to think about what is outside it, and does not. | FAIL F2-05 — 'The town has never needed to think about what is outside it' — a history. |
| 3 | visitor | A stranger walks out of {settlement} in any direction at any hour and meets nothing that would justify a watch. | FAIL F1-34 + F2-06 — 'in any direction at any hour and meets nothing that would justify a watch' — a totality of safety on a `settled` town (settled only multiplies threat down) and a rate; and at town tier the required Town watch is the watch the face says nothing justifies. |

**8. Invasion & War: walls AND professional garrison**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} has a line and professionals to hold it, which is real deterrence against raiding and against a conventional assault; it is not a posture rated for a long siege without stores behind it. | PASS |
| 2 | visitor | A stranger sizing {settlement} up sees the two things that matter together (the wall and the men who belong to it) and revises what an attempt would cost. | PASS |
| 3 | street | The town believes it could be held, and the belief is founded on something rather than on hope. | PASS |

**9. Invasion & War: walls with citizen militia**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Walls at {settlement} with townspeople behind them: credible against raiders, and inadequate against anybody who arrives professionally and brought siege gear. | PASS |
| 2 | street | The town would turn out and does not pretend that turning out is the same as being defended. | PASS |
| 3 | unfolding | What {settlement} has would hold against the first thing and is unlikely to hold against the second, and nothing in hand changes that. | PASS |

**10. Invasion & War: walls with NO force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} has walls and nobody to put on them. A determined attacker takes this town with ladders and patience, and requires nothing else. | FAIL F2-05 + COND-H F1-25 — 'takes this town with ladders and patience' — flat prediction; 'nobody to put on them' — the required Town watch. |
| 2 | visitor | A stranger at {settlement} sees a serious perimeter and a serious absence of anyone standing in it. | COND-H F1-25 — 'a serious absence of anyone standing in it'. |
| 3 | street | The town has the thing that would save it and not the people who would use it, and says so when pressed. | COND-H F1-25 — 'not the people who would use it'. |

**11. Invasion & War: force with NO walls**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} keeps a professional force and no perimeter. It answers raiders well and cannot hold a siege, because there is nothing here to hold. | PASS |
| 2 | street | The town's defense is people rather than works, and people can be gone around. | PASS |
| 3 | visitor | A stranger sees soldiers at {settlement} and no line for them to stand behind, and can see how that decides where any fight would happen. | PASS |

**12. Invasion & War: militia only**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} can put armed citizens on their own ground, which counts for something against a disorganized raid and for nothing at all against a disciplined force. | PASS |
| 2 | street | The town knows its own country and knows that knowing it is not an answer to a professional army. | PASS |
| 3 | visitor | A stranger at {settlement} meets armed townspeople who are entirely competent on their own ground and have never stood in a line with anybody. | FAIL F2-05 + F1 row desc — 'have never stood in a line with anybody' — a history, and the `Citizen militia` row's own description is 'Able-bodied residents drill and muster'. |

**13. Invasion & War: neither walls nor force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} has no line and no force. Organized aggression cannot be resisted here; what preserves the town is distance, diplomacy, or being beneath notice. | PASS |
| 2 | counterforce | Nothing has come for {settlement} and nothing about the town would stop it. The safety here is entirely a matter of nobody having wanted to. | FAIL F2-04 — 'Nothing has come for {settlement}' — an event the record did not run (a negative history). |
| 3 | street | The town's plan for an army is to not be interesting to one, and everybody here can state the plan. | PASS |

**14. Internal Security: full legal chain (court AND prison)**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} can arrest, try and hold, and having all three means the town's law is a process rather than a threat. | COND-C F1-12 — 'can arrest, try and hold' — a trial on a hall-only court (Town hall required at town). |
| 2 | street | A thing done wrong at {settlement} goes somewhere and takes time, and the town has come to rely on that rather than on the watch's temper. | FAIL F2-05 — 'the town has come to rely on that' — an elapsed course. |
| 3 | visitor | A stranger who brings a complaint at {settlement} is given a procedure rather than a favour, and the procedure runs. | PASS |

**15. Internal Security: court without detention**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} tries offences it cannot hold anyone for; the sentences available here are money and exile, and both of them fall unevenly. | COND-C F1-12 — 'tries offences … the sentences available here are money and exile' — a trial and sentences on a hall-only court. |
| 2 | street | The town's law can name a wrong and cannot keep the person who did it, so it reaches for the purse or the road. | COND-C F1-12 — 'reaches for the purse or the road' — same. |
| 3 | unfolding | Each judgment {settlement} cannot enforce costs the next one a little of its weight, and the town's courts are spending down a reputation they cannot replace. | FAIL F2-08 — 'Each judgment … costs the next one a little of its weight … spending down a reputation' — a trend. |

**16. Internal Security: detention without process**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} can hold people and has no settled way of deciding whether it should, which makes enforcement here a matter of who is doing it. | PASS |
| 2 | visitor | A stranger at {settlement} is careful in a way he would not need to be in a town with courts, and cannot say precisely why. | PASS |
| 3 | street | The town can put a person away at {settlement} and cannot say on what grounds, and has learned not to ask on whose. | FAIL F2-05 (weak) — 'has learned not to ask' — a perfect. |

**17. Internal Security: no legal infrastructure**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | There is no legal machinery at {settlement}; order here rests on force alone, and force alone deters only while it is present. | PASS |
| 2 | street | The town settles things itself, quickly, and does not always settle them well. | FAIL F2-06 (weak) — 'does not always settle them well' — a rate over outcomes. |
| 3 | visitor | A stranger wronged at {settlement} discovers there is nowhere to take it, and that the discovery surprises nobody local. | PASS |

**18. Economic Survival: `STRONG`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} can absorb a sustained crisis out of its own revenue: emergency measures can be paid for and the garrison can be kept paid while they last. | COND-H F1-02 — 'the garrison can be kept paid' — STRONG towns at town tier have no garrison row (Garrison is city-only; a Barracks is optional); the face names a body the roster usually lacks. |
| 2 | street | The town could go through a bad season with its arrangements intact, and the people who would have to be paid through one know it. | PASS |
| 3 | counterforce | Trouble at {settlement} has not turned into a collapse, and the reason is money. A town that can pay through a crisis mostly does. | FAIL F2-04/F2-06 — 'has not turned into a collapse' — a history; 'mostly does' — a rate. |

**19. Economic Survival: `ADEQUATE`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} can fund a short crisis. A long one begins eating reserves within a few months, and the reserves are not deep enough to hide that from anybody. | FAIL F2-02 — 'within a few months'. |
| 2 | unfolding | The town's capacity to pay for its own emergencies is real and finite, and every season of pressure moves the finite part closer. | FAIL F2-06/F2-08 — 'every season of pressure moves the finite part closer'. |
| 3 | threshold | {settlement} can pay for a crisis of the ordinary length; the edge of what it can fund lies a few months past the beginning of one, and the town has not been asked to find out where. | FAIL F2-02 + F2-04 — 'a few months past' and 'has not been asked'. |

**20. Economic Survival: `WEAK`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Chronic shortfall at {settlement} limits what the town can do in an emergency before the emergency starts; the pay is irregular, and irregular pay shows up as morale exactly when it matters. | FAIL F2-05 (weak) — 'Chronic shortfall' — an elapsed course (the machine line says 'Chronic underfunding'; F2 is grammar-decidable). |
| 2 | street | The people who would have to hold {settlement} through something are already owed, and they have not forgotten it. | PASS (note) — 'already owed … have not forgotten' — arrears without a figure is the licensed extreme (F4-04: short, late, thin). |
| 3 | unfolding | The shortfall at {settlement} is chronic rather than sudden, and each season of it removes a little more of what the town could do about a crisis when one comes. | FAIL F2-08/F2-06 — 'chronic … each season of it removes a little more' — a trend and a rate. |

**21. Economic Survival: `CRITICAL`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} cannot fund a response to anything. Any sustained pressure exhausts the town's capacity almost immediately and then continues. | FAIL F2-05 (weak) — 'exhausts the town's capacity almost immediately and then continues' — a predicted course. |
| 2 | unfolding | The town is not spending its way out of trouble because there is nothing to spend, and each thing that goes wrong makes the next thing cheaper to happen. | FAIL F4-10 — 'each thing that goes wrong makes the next thing cheaper to happen' — crises compounding; the engine rolls stresses independently (stressGenerator.js:339-346). |
| 3 | street | The town could not pay for a bad month at {settlement}, and the people who would have to be paid know it. | PASS (note) — 'a bad month' is a unit of hardship, not a date. |

**22. Disasters & Famine: granary AND hospital**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} holds food against a bad year and has somewhere to put the sick; between them the town can take a failed harvest or an outbreak without either becoming a catastrophe. | PASS |
| 2 | street | The town has a place for grain and a place for the ill, and knows exactly what having both is worth. | PASS |
| 3 | counterforce | Neither a failed harvest nor an outbreak turns into a catastrophe at {settlement}, and the reason is in the two buildings rather than in the luck. | PASS |

**23. Disasters & Famine: granary AND parish care only**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | There is food stored at {settlement} and there are clergy who tend the sick: reserves against hunger, and against disease something better than nothing and well short of a hospital. | PASS |
| 2 | street | The town can eat through a bad year. What it does about a plague is pray and nurse, in that order. | PASS |
| 3 | visitor | A stranger finds a full store and a modest infirmary at {settlement}, and can see which of the two the town has spent its thinking on. | FAIL F1-14 + F2-01 — 'a modest infirmary' — the key is hasHospital FALSE; 'a full store' — a magnitude the read does not carry. |

**24. Disasters & Famine: granary, NO medical provision**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} can feed itself through a failed harvest and has nothing at all against disease; a sickness here spreads until it stops of its own accord. | PASS |
| 2 | unfolding | The stores will carry the town through hunger. Nothing here will carry it through a plague, and the town has not built anything that would. | FAIL F2-05 + F2-03 — 'The stores will carry … Nothing here will carry … the town has not built anything' — modal future twice and a building narrated. |
| 3 | street | The town can outlast a hungry year at {settlement} and has no answer at all to a sick one, and knows which of the two it fears. | PASS |

**25. Disasters & Famine: NO reserves, hospital present**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} can treat and contain an outbreak and keeps no food against a bad harvest; a crop failure here becomes hardship the same season it happens. | PASS (note) — 'treat and contain an outbreak' on a village Healer person — the machine says 'containment' only for hospital infrastructure, but the row does not deny it. |
| 2 | street | The town is better prepared for the sickness than for the hunger, which is an unusual way round and does not comfort anyone. | PASS |
| 3 | unfolding | {settlement} is arranged against the sickness it has seen and not against the hunger it has not, and nothing in hand is correcting the imbalance. | FAIL F2-04 — 'the sickness it has seen and … the hunger it has not' — a past outbreak the record did not run. |

**26. Disasters & Famine: NO reserves, NO medical provision**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} holds no food against a bad year and has nobody to treat the sick; a failed harvest is immediate hardship here and a plague runs until it burns out. | COND-H(village) F1-25 — 'has nobody to treat the sick' — the required village Parish church; the same row prints 'Parish clergy provide basic wound care'. |
| 2 | street | The town's answer to a bad season is the same as its answer to a sickness, which is to endure it and count afterwards. | PASS |
| 3 | visitor | A stranger looking for the granary or the sick-house at {settlement} is directed to neither, because there is neither. | PASS |

**SHIPPED f2da5a3ee totals (CONFIRMED count of the verdicts above):** 78 faces · FAIL 27 · COND 11 · PASS 40. Floor tallies over the non-PASS verdicts: F1 ×2, F1-02 ×1, F1-03 ×1, F1-06 ×1, F1-12 ×3, F1-14 ×1, F1-25 ×6, F1-27 ×1, F1-34 ×1, F2-01 ×1, F2-02 ×3, F2-03 ×1, F2-04 ×4, F2-05 ×11, F2-06 ×10, F2-08 ×4, F4-10 ×1.

### 2.3 LICENCE 471ce894a

**1. Beasts & Monsters: `plagued`, perimeter AND organized force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The country around {settlement} carries creatures. Entered to the town's name are a wall and a muster. | PASS |
| 2 | face | The works at {settlement} are carried standing, and the muster with them, in a country where the creatures are. | PASS |
| 3 | face | Creatures range the country around {settlement}, and the town's wall and its muster both stand. | PASS |
| 4 | face | A wall and a muster are entered as standing at {settlement}, and creature country lies around the town. | PASS |
| 5 | street | Defense at {settlement} is a wall and a muster, and creatures press the country outside. | PASS |
| 6 | face | The town has a wall at {settlement} and a muster of its own, and the creatures are out in the country. | PASS |
| 7 | face | A wall and a muster stand at {settlement}, and the country around the town carries creatures. | PASS |
| 8 | face | The creatures are in the country around {settlement}, and what the town has is a wall and a force. | PASS |
| 9 | unfolding | What {settlement} has built is in place and the muster with it, and the creature pressure out of the country stands unmet. | PASS |
| 10 | face | The wall at {settlement} stands and so does the muster, and what lies open is the pressure from the country's creatures. | PASS |
| 11 | face | At {settlement} the muster stands and the wall as well, and the pressure of creatures in the country stands open. | PASS |
| 12 | face | Both the works and the town's force at {settlement} are in place, and the pressure out of the country, where the creatures are, is unsettled. | PASS |

**2. Beasts & Monsters: `plagued`, perimeter but NO force to hold it**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The town of {settlement} has its works and no force to hold them. Beasts are abroad in the country about the town. | PASS |
| 2 | face | Neither garrison nor militia is entered at {settlement}, where the works stand in a country plagued with monsters. | PASS |
| 3 | face | Plagued country lies about {settlement}, and the works of the town stand in it with no force of the muster's kind at them. | PASS |
| 4 | face | What the town has built at {settlement} stands with no force of the muster's kind at it, in a country where beasts press. | PASS |
| 5 | visitor | A stranger at {settlement} finds the works standing and no garrison or militia at them, in a country where beasts are abroad. | PASS |
| 6 | face | In the country about {settlement} the monsters are abroad. A stranger there meets what the town has built, and at it nothing of the muster. | PASS |
| 7 | face | To a stranger at {settlement}, the works stand with neither garrison nor militia at them, in a country where creatures press. | PASS |
| 8 | face | What a stranger finds at {settlement}, in a country plagued with beasts, is the works standing and no force of the muster's kind. | PASS |
| 9 | unfolding | The works at {settlement} stand in a country plagued with beasts, and the force to hold them is wanting. | PASS |
| 10 | face | The country {settlement} sits in is plagued with monsters, and the works of the town stand in it. The holding of them stands open. | PASS |
| 11 | face | Creatures press on the country about {settlement}, and the works stand in it unheld. | PASS |
| 12 | face | Monsters plague the country round {settlement}. Inside it the works stand, and the holding of them wants a garrison or a militia. | PASS |

**3. Beasts & Monsters: `plagued`, NO perimeter and NO force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | An embattled country of monsters lies around {settlement}, and neither a wall nor a force stands in the place. | PASS |
| 2 | face | Creatures range the country around {settlement}. The place has neither muster nor works. | PASS |
| 3 | face | The country about {settlement} is plagued with monsters, and the place is entered as wanting works and muster. | PASS |
| 4 | face | Monsters are abroad in the country around {settlement}, and nothing of works or muster stands in the place. | PASS |
| 5 | street | In a country plagued with monsters, {settlement} stands open and unmustered. | PASS |
| 6 | face | Out in monster country {settlement} keeps neither works nor muster. | PASS |
| 7 | face | A country of monsters surrounds {settlement}, a place with no works and no muster. | PASS |
| 8 | face | At {settlement} the country is thick with monsters, and the place itself stands with neither a wall nor a force. | PASS |
| 9 | visitor | A stranger comes to {settlement} through a country plagued with monsters, and finds neither works nor muster in the place. | PASS |
| 10 | face | What a stranger sees at {settlement} is a country of monsters, and a place in it with no works and no muster. | PASS |
| 11 | face | The place a stranger finds at {settlement} stands open and unmustered, and around it lies an embattled country of beasts. | PASS |
| 12 | face | The first thing a stranger meets at {settlement} is monster country, and the next is a place open and unmustered. | PASS |

**4. Beasts & Monsters: `frontier`, credible deterrence**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Around {settlement} lies frontier country, and the town's works stand in it. A force stands behind the works. | PASS |
| 2 | face | The works at {settlement} sit on an active frontier. With the works stands the town's force. | PASS |
| 3 | face | At the town of {settlement} the works are carried as standing, and a force with them. The country that surrounds the town is frontier country. | PASS |
| 4 | face | A force is entered at {settlement}, and the country about it is frontier country. What the town has built stands with the force. | PASS |
| 5 | street | Frontier country lies outside the town, and inside it stand the works and a force. | PASS |
| 6 | face | What the town has built is up, and a force stands with it in frontier country. | PASS |
| 7 | face | In frontier country the town has a force, and that force stands behind the works. | PASS |
| 8 | face | The muster stands with the works, and the country beyond the town is frontier. | PASS |
| 9 | counterforce | Against frontier country the town of {settlement} has its works standing, and behind them a force. | PASS |
| 10 | face | At {settlement} the works are not without a force, and the country outside is frontier country. | PASS |
| 11 | face | Outside {settlement} the country is frontier country, and inside the town a force stands with the works. | PASS |
| 12 | face | In the frontier country around {settlement} the town's force stands with what the town has built. | PASS |

**5. Beasts & Monsters: `frontier`, force without a perimeter**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | At {settlement} the muster stands in an unwalled town, and the country outside is frontier. | PASS |
| 2 | face | The town at {settlement} is set down unwalled, and in frontier country it keeps people under arms. | PASS |
| 3 | face | Armed people are carried standing at {settlement} in a country entered as frontier, and no wall stands about the town. | PASS |
| 4 | face | Frontier country lies about {settlement}. The town in that country holds a force under arms, and no works stand. | PASS |
| 5 | visitor | A stranger passes no wall coming into {settlement}, and finds armed people in a town standing in frontier country. | PASS |
| 6 | face | A newcomer to {settlement} comes in out of frontier country, and meets people under arms in a town with no wall. | PASS |
| 7 | face | Out of frontier country a stranger comes into {settlement} past no wall, and stands among armed people. | PASS |
| 8 | face | Inside {settlement} a stranger comes upon armed people, and about the town finds nothing walled. Outside that town the country is frontier. | PASS |
| 9 | street | In frontier country the town stands unwalled, and keeps armed people. | PASS |
| 10 | face | The country here is frontier, and the town's force stands where no wall does. | PASS |
| 11 | face | People under arms stand here in frontier country, and the town has no wall. | PASS |
| 12 | face | Here the town goes without works and holds armed people. What lies outside the town is frontier country. | PASS |

**6. Beasts & Monsters: `settled`, defenses beyond the need**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | counterforce | There is very little of beast or monster in the country around {settlement}, and the works stand. | PASS |
| 2 | face | The country around {settlement} is a quiet one in the way of beasts, and what the town has built stands. | PASS |
| 3 | face | Works stand at {settlement}, and the country around the town is little troubled by creatures. | PASS |
| 4 | face | Monsters come to little in the country around {settlement}; the town's works stand. | PASS |
| 5 | ledger | {settlement} is entered as provided against beasts, and the country around the town as quiet. | PASS |
| 6 | face | The works at {settlement} are carried as standing, and the creatures of the country around the town come to little. | PASS |
| 7 | face | Little of beast or monster troubles the country around {settlement}, and what the town has built there is set down as standing. | PASS |
| 8 | face | Provision against beasts is entered at {settlement}, and the country around the town is a quiet one. | PASS |
| 9 | visitor | A stranger notices the perimeter at {settlement} first, and then how quiet the country around the town is of beasts. | PASS |
| 10 | face | What a stranger sees at {settlement} is the works standing, and few creatures in the country around the town. | PASS |
| 11 | face | To a stranger the country around {settlement} is quiet in the way of creatures, and the works stand at the town. | PASS |
| 12 | face | A stranger comes on works standing at {settlement}. Monsters are little seen in the country around the town. | PASS |

**7. Beasts & Monsters: `settled`, nothing organized**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} keeps no works and no muster against the country, and that country runs low in beasts. | PASS |
| 2 | face | The beasts about {settlement} are few, and neither works nor muster stands in the town. | PASS |
| 3 | face | The town of {settlement} is entered with no works and no muster, and the country beyond is entered as quiet. | PASS |
| 4 | face | Little comes out of the country about {settlement}. Against that country the town holds no muster, and no works stand. | PASS |
| 5 | street | The town stands without works or muster, and what is outside it is quiet. | PASS |
| 6 | face | The country outside carries few beasts, and the town facing that country keeps neither works nor muster. | PASS |
| 7 | face | Beasts are few out in the country. No works stand against that country, and the town keeps no muster. | PASS |
| 8 | face | What comes out of the country is little. The town holds no works and no muster against that country. | PASS |
| 9 | visitor | A stranger walks out of {settlement} past no works and no muster, and meets few creatures in the country. | PASS |
| 10 | face | Out of a country low in beasts a stranger comes on {settlement} and finds no works and no muster in the town. | PASS |
| 11 | face | Neither works nor muster meets a stranger at {settlement}, and beyond the town the country carries few beasts. | PASS |
| 12 | face | Few creatures meet a stranger in the country about {settlement}. The town in that country shows no works, and keeps no muster. | PASS |

**8. Invasion & War: walls AND professional garrison**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The works at {settlement} stand entered, and so do the soldiers. | PASS |
| 2 | face | Soldiers are carried standing at {settlement}, and what the town has built is carried standing. | PASS |
| 3 | face | Two things are entered together at {settlement}, the works and the town's muster. | PASS |
| 4 | face | Both the works and the town's force are set down at {settlement} as standing. | PASS |
| 5 | visitor | A stranger at {settlement} sees the works and the soldiers together. | PASS |
| 6 | face | What meets a stranger at {settlement} is the works, and the soldiers. | PASS |
| 7 | face | At {settlement} a stranger sees both the town's force and the works the town has built. | PASS |
| 8 | face | A stranger reaches {settlement} and finds the works standing. The stranger finds the town's force. | PASS |
| 9 | street | The town has the works, and the muster besides. | PASS |
| 10 | face | The works are up, and the soldiers are standing. | PASS |
| 11 | face | The town keeps its works. In the town stand the soldiers. | PASS |
| 12 | face | What the town holds is the works, and the town's force. | PASS |

**9. Invasion & War: walls with citizen militia**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Walls at {settlement} with townspeople behind them, a part-time force raised off its own work. | PASS |
| 2 | face | The town of {settlement} has walls, and the muster behind them is part-time, drawn from the townspeople. | PASS |
| 3 | face | A part-time muster of the townspeople is carried standing at {settlement}, and so are the walls the town has built. | PASS |
| 4 | face | The works at {settlement} are entered standing, and the force entered with them is the townspeople, part-time. | PASS |
| 5 | street | The force behind the walls is the townspeople themselves, a part-time muster that turns out off its own work. | PASS |
| 6 | face | The town's walls stand, and what turns out behind them is the townspeople, part-time. | PASS |
| 7 | face | The townspeople turn out part-time behind the town's walls. | PASS |
| 8 | face | Behind the walls the muster is part-time. The townspeople in it turn out and go back to their own work. | PASS |
| 9 | unfolding | What {settlement} has standing is walls, and the town's force with them is the townspeople, raised part-time off their own work. | PASS |
| 10 | face | Walls stand at {settlement}, and behind them is a force of the townspeople. It is part-time, raised off its own work. | PASS |
| 11 | face | The walls at {settlement} are up, and the townspeople behind them are the town's force, raised part-time. | PASS |
| 12 | face | At {settlement} the walls are in place, and the town's force stands with them. That force is a militia of the townspeople, part-time. | PASS |

**10. Invasion & War: walls with NO force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The works at {settlement} are entered as standing, and to hold them the town has neither garrison nor militia. | PASS |
| 2 | face | No force stands at {settlement}, and what stands is the works. | PASS |
| 3 | face | Set down at {settlement} are the works standing, and no garrison or militia in the town. | PASS |
| 4 | face | At {settlement} the town carries no force of its own, and its works stand entered. | PASS |
| 5 | visitor | A stranger at {settlement} sees the works standing and no force at them. | PASS |
| 6 | face | To a stranger at {settlement} the works stand, and with them stands neither garrison nor militia. | PASS |
| 7 | face | A stranger finds no force at {settlement}, and the works standing. | PASS |
| 8 | face | A stranger comes to the town of {settlement} and sees the works. No garrison and no militia stand in the town. | PASS |
| 9 | street | The town has the works and neither a garrison nor a militia to hold them. | PASS |
| 10 | face | What the town has built stands, and the town keeps no garrison and no militia. | PASS |
| 11 | face | The town is without a garrison and without a militia, and what it has is the works. | PASS |
| 12 | face | The works stand, and the town has no garrison and no militia. | PASS |

**11. Invasion & War: force with NO walls**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} carries a standing force and no perimeter. | PASS |
| 2 | face | People under arms are entered at {settlement}, and the town keeps no works. | PASS |
| 3 | face | A force is carried standing at {settlement}. Nothing about the town is walled. | PASS |
| 4 | face | The muster stands at {settlement}, a town with no wall. | PASS |
| 5 | street | The town's defense is people rather than works. | PASS |
| 6 | face | This place is defended by its own force and by no wall. | PASS |
| 7 | face | What the town has under arms is people, and nothing built stands about the place. | PASS |
| 8 | face | People under arms make up the defense here, and the place has no perimeter. | PASS |
| 9 | visitor | A stranger sees a force under arms at {settlement} and no line. | PASS |
| 10 | face | What a newcomer notices at {settlement} is a standing force and no works about the town. | PASS |
| 11 | face | A traveller comes upon people under arms at {settlement}. The town shows no wall. | PASS |
| 12 | face | The force a stranger meets at {settlement} stands in a place with no perimeter. | PASS |

**12. Invasion & War: militia only**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | A citizen militia at {settlement} answers a raid on its own ground, in place of a professional garrison, with nothing built around the town for it to stand behind. | PASS |
| 2 | face | At {settlement} the muster is the town's own citizens, not a professional garrison, and it answers a raid on its own ground with no wall around the town. | PASS |
| 3 | face | Against a raid the citizens of {settlement} turn out on their own ground, and no professional garrison is kept. Those citizens stand with nothing built around the town. | PASS |
| 4 | face | Citizens of {settlement} make the muster that answers a raid on their own ground, not a professional garrison, and no wall stands around the town. | PASS |
| 5 | street | The town's own people make the muster at {settlement}, part-time and not a professional garrison. It comes off their own work, and nothing is built around the town for them to hold. | PASS |
| 6 | face | Townspeople make the muster at {settlement}, part-time and in place of a professional garrison. What they give it comes off their own work, and the town has built nothing around itself for them to hold. | PASS |
| 7 | face | The muster at {settlement} is part-time and the town's own, not a professional garrison. Its people come off their own work, and nothing is built around the town for them to hold. | PASS |
| 8 | face | What turns out at {settlement} is townspeople, part-time and not a professional garrison, off their own work and with nothing built around the town for them to hold. | PASS |
| 9 | visitor | A stranger at {settlement} finds the town's own people at their work and no wall around the town. Those people are a part-time citizen militia in place of a professional garrison. | PASS |
| 10 | face | Townspeople at their ordinary work are what a stranger sees at {settlement}, and no wall stands around the town. The muster they make is part-time and not a professional garrison. | PASS |
| 11 | face | What a stranger comes upon at {settlement} is the town's own people at their work, and no wall around the town. That muster is part-time and not a professional garrison. | PASS |
| 12 | face | The people a stranger passes at {settlement} are at their own work behind no wall. Their muster is part-time, not a professional garrison. | PASS |

**13. Invasion & War: neither walls nor force**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} is entered with no wall and no force. | PASS |
| 2 | face | For war, the town of {settlement} has no force and no works. | PASS |
| 3 | face | Neither garrison nor militia is kept at {settlement}, and no wall stands. | PASS |
| 4 | face | The town of {settlement} stands unwalled. Against organized aggression, the town keeps no muster. | PASS |
| 5 | counterforce | Against an army, {settlement} has neither wall nor force. | PASS |
| 6 | face | What {settlement} has for war is no wall and no muster. | PASS |
| 7 | face | At {settlement} the town keeps no force and stands with no wall. | PASS |
| 8 | face | No muster is kept at {settlement} against a force in order. The town is unwalled. | PASS |
| 9 | street | The place has no wall about it and keeps no force. | PASS |
| 10 | face | Unwalled, the town keeps no force against an army. | PASS |
| 11 | face | Against war, the town is without a muster or a wall. | PASS |
| 12 | face | This town keeps no force, and no wall rings the town. | PASS |

**14. Internal Security: full legal chain (court AND prison)**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The town's law at {settlement} stands entered, and so does a place of confinement. | PASS |
| 2 | face | At {settlement} the town has its law entered, and a place where people can be held. | PASS |
| 3 | face | A place where a person can be held is entered at {settlement}. The law that town keeps is entered as standing. | PASS |
| 4 | face | People can be held at {settlement}; the town's law stands entered. | PASS |
| 5 | street | A thing done wrong at {settlement} goes to the town's law, and the town keeps a place of confinement. | PASS |
| 6 | face | The town of {settlement} can hold a person, and a wrong done there goes to the town's law. | PASS |
| 7 | face | At {settlement} the town has its law to hand for a wrong done there. A person can be held in that town. | PASS |
| 8 | face | A person can be held at {settlement}, and the town has law to hand for what is done wrong there. | PASS |
| 9 | visitor | A stranger who comes to {settlement} finds the town's law standing, and finds a place where a person can be held. | PASS |
| 10 | face | What a stranger finds standing at {settlement} is a place where a person can be held, and the town's law. | PASS |
| 11 | face | To a stranger at {settlement} the town's law stands, and a place of confinement stands. | PASS |
| 12 | face | On arrival at {settlement} a stranger finds a place of confinement. The law of that town stands. | PASS |

**15. Internal Security: court without detention**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Formal law stands entered at {settlement}, and the town holds no gaol. | PASS |
| 2 | face | The town of {settlement} is entered with formal law, and has no place of confinement. | PASS |
| 3 | face | At {settlement} the law is formal in its standing. The town carries nothing to hold under that law. | PASS |
| 4 | face | What {settlement} keeps is formal law, and no prison. | PASS |
| 5 | street | The town's law is formal; the town keeps no gaol. | PASS |
| 6 | face | Here the law is formal, and there is nowhere in the town to hold under that law. | PASS |
| 7 | face | This town's law is formal. Beneath that law the town has nowhere to hold. | PASS |
| 8 | face | Law here is formal, and under it stands no gaol. | PASS |
| 9 | unfolding | Law is formal at {settlement}, and its holding half stands open. | PASS |
| 10 | face | Under formal law at {settlement}, detention stands unmet. | PASS |
| 11 | face | Law stands formal at {settlement}. The holding under that law is not in place. | PASS |
| 12 | face | The law {settlement} keeps is formal, and a place of confinement is wanting. | PASS |

**16. Internal Security: detention without process**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | A person can be held at {settlement} and brought before no court. | PASS |
| 2 | face | The town at {settlement} can hold people, and no court sits to try a person held. | PASS |
| 3 | face | Cells at {settlement} are carried as standing, and the town keeps no court. | PASS |
| 4 | face | A gaol at {settlement} can take a person in, and no court names the ground for keeping that person. | PASS |
| 5 | visitor | A stranger at {settlement} finds cells to hold a person and no court to try that person. | PASS |
| 6 | face | A traveller at {settlement} sees cells, and sees no court. | PASS |
| 7 | face | At {settlement} a stranger comes upon cells, and finds this is not a town with a court. | PASS |
| 8 | face | To a stranger at {settlement} the cells are plain, and no court is to be found. | PASS |
| 9 | street | The town can put a person away at {settlement}, and no court says what for. | PASS |
| 10 | face | The cells at {settlement} can keep a person, and no court can try that person. | PASS |
| 11 | face | At {settlement} a person can be shut in the cells, and nothing goes before a court. | PASS |
| 12 | face | People can be locked up at {settlement}, and no court has a say. | PASS |

**17. Internal Security: no legal infrastructure**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Neither a court to try a charge nor a place of confinement to hold under one is entered as standing at {settlement}. | PASS |
| 2 | face | What stands at {settlement} against a wrong done inside the town is no court to try it, and no cell. | PASS |
| 3 | face | The town of {settlement} is entered with no gaol to hold under an offence and no court to try the offence. | PASS |
| 4 | face | A court for a charge and a cell for the one it names are what {settlement} does without. | PASS |
| 5 | street | A wrong done here comes before no court, and no cell is kept in the town. | PASS |
| 6 | face | Here the town keeps no court against a quarrel, and no gaol. | PASS |
| 7 | face | No cell here holds the one a charge names, and no court the charge. | PASS |
| 8 | face | Neither the court a charge would come before nor the cell that would hold under it stands in this town. | PASS |
| 9 | visitor | A stranger who comes to {settlement} with a complaint finds no cell for the one complained of, and no court to hear the complaint. | PASS |
| 10 | face | The court a stranger would look for at {settlement} does not stand, nor does the cell. | PASS |
| 11 | face | What a stranger notices first at {settlement} is that no cell holds the one a charge names and no court hears the charge. | PASS |
| 12 | face | A stranger's complaint at {settlement} finds no court, and the one it names no cell. | PASS |

**18. Economic Survival: `STRONG`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Through a crisis, holding is entered strong at {settlement}. | PASS |
| 2 | face | What {settlement} would bear in a crisis is entered as well covered. | PASS |
| 3 | face | Economic survival at {settlement} is set down as a pressure the town meets well. | PASS |
| 4 | face | That {settlement} can absorb a crisis well is carried as standing. | PASS |
| 5 | street | The town could go through a crisis well. | PASS |
| 6 | face | A crisis is a pressure the town is well covered for. | PASS |
| 7 | face | Strong is how the town carries a crisis. | PASS |
| 8 | face | Where a crisis would have to be borne, the town is strong. | PASS |
| 9 | counterforce | What stands at {settlement} against a crisis is the town's carrying. That carrying is strong. | PASS |
| 10 | face | A crisis is the pressure {settlement} is measured against. The town is well covered for that pressure. | PASS |
| 11 | face | The town of {settlement} can hold through a crisis. Against that pressure the holding is strong. | PASS |
| 12 | face | Well covered at {settlement} is the pressure of a crisis. The town's carrying is what stands under that pressure. | PASS |

**19. Economic Survival: `ADEQUATE`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The capacity {settlement} holds against a crisis measures adequate. That capacity is carried with little margin. | PASS |
| 2 | face | Against a crisis {settlement} is covered. The cover is thin at its edge. | PASS |
| 3 | face | Economic survival at {settlement} stands adequate. That standing sits on a narrow margin. | PASS |
| 4 | face | Adequate is the word entered for {settlement} against a crisis. Under that word the margin is not wide. | PASS |
| 5 | unfolding | The town's capacity to meet a crisis is real, and the margin left standing on it is little. | PASS |
| 6 | face | Set against a crisis the town's standing is adequate, and the little margin is what that standing leaves open. | PASS |
| 7 | face | This town holds through an emergency on a little margin, and that margin stands open. | PASS |
| 8 | face | What covers the town against a crisis holds, and the little margin on that cover is the matter left standing. | PASS |
| 9 | threshold | Cover against a crisis is adequate at {settlement}, and the margin under it would be little. | PASS |
| 10 | face | A crisis would be met at {settlement}, and met on a little margin. | PASS |
| 11 | face | The covering at {settlement} stands, and in a crisis its edge would be close. | PASS |
| 12 | face | In a crisis {settlement} is covered, and the margin of the cover would be little. | PASS |

**20. Economic Survival: `WEAK`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Against a crisis the town of {settlement} is entered thinly covered, and a real one would strain the cover. | PASS |
| 2 | face | The holding the town of {settlement} keeps against a crisis is entered thin. A real crisis would strain that holding. | PASS |
| 3 | face | The thin cover entered for {settlement} limits what the town can do in an emergency; a real crisis would strain that cover. | PASS |
| 4 | face | A real crisis would strain the cover the town of {settlement} keeps against one, and that cover is entered weak. | PASS |
| 5 | street | Thin cover is what the town of {settlement} would have to meet a crisis with, and a real one would strain that cover. | PASS |
| 6 | face | What cover the town of {settlement} has against a crisis is thin. A real one would strain that cover. | PASS |
| 7 | face | The capacity {settlement} has to hold through a crisis runs thin, and a real one would strain that capacity. | PASS |
| 8 | face | Against a crisis the town has thin cover at {settlement}. A real one would strain that cover. | PASS |
| 9 | unfolding | The cover {settlement} keeps against a crisis stands thin, and a real one would strain that cover as things stand. | PASS |
| 10 | face | What the town of {settlement} could do about a crisis is thin, and a real one would strain that capacity as it stands. | PASS |
| 11 | face | A real crisis would strain what {settlement} keeps against one, and what the town keeps now stands thin. | PASS |
| 12 | face | In a real crisis the cover kept at {settlement} would strain, and that cover now stands thin. | PASS |

**21. Economic Survival: `CRITICAL`**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Economic survival is entered critical at {settlement}. The capacity so entered would not hold through a crisis. | PASS |
| 2 | face | The town's capacity against a crisis is entered critical at {settlement}. Under that pressure the town stands effectively uncovered. | PASS |
| 3 | face | Critical is the standing entered at {settlement} on economic survival. The cover the town would have through a crisis is effectively none. | PASS |
| 4 | face | Measured against a crisis, the cover the town of {settlement} keeps would not hold. The town's economic survival is entered critical. | PASS |
| 5 | unfolding | The capacity the town has against a crisis reads critical, and the want of cover stands open. | PASS |
| 6 | face | For a crisis the town has no cover, and that want goes on standing. | PASS |
| 7 | face | What the town could set against a crisis would not hold, and the matter is open now. | PASS |
| 8 | face | The town's cover through a crisis stands at critical, and the want it leaves is open. | PASS |
| 9 | street | Whatever the town of {settlement} has against a crisis, that cover would not meet the pressure. | PASS |
| 10 | face | The town of {settlement} could not hold through a crisis. | PASS |
| 11 | face | A crisis would be more than the town of {settlement} could hold. | PASS |
| 12 | face | Set against a crisis, the town of {settlement} has effectively no cover. | PASS |

**22. Disasters & Famine: granary AND hospital**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The granary at {settlement} is entered as standing, a place for grain against hunger. Those tending the sick are entered beside it, against sickness. | PASS |
| 2 | face | Those tending the sick are set down at {settlement} as standing, against sickness. The granary where grain is stored is set down with them, against hunger. | PASS |
| 3 | face | A granary stands at {settlement} and grain is stored in it against hunger. Those tending the sick are entered with the granary, against sickness. | PASS |
| 4 | face | Entered as standing at {settlement} are those tending the sick against sickness and a granary where grain is stored. It stands against hunger. | PASS |
| 5 | street | The town has a place for grain against hunger, and those tending the sick against sickness. | PASS |
| 6 | face | Grain has its place in the town against hunger, and those who tend the sick are there against sickness. | PASS |
| 7 | face | What the town has against hunger is a place for grain, and against sickness those tending the sick. | PASS |
| 8 | face | A place for grain and those tending the sick, the town has these against hunger and sickness. | PASS |
| 9 | counterforce | Against hunger at {settlement} stands a granary where grain is stored, and against sickness those tending the sick. | PASS |
| 10 | face | Those who tend the sick stand at {settlement} against sickness, and against hunger the granary where grain is stored. | PASS |
| 11 | face | What stands against hunger at {settlement} is a granary where grain is stored, and those tending the sick stand against sickness. | PASS |
| 12 | face | Hunger at {settlement} has a place for grain standing against it, and sickness those tending the sick. | PASS |

**23. Disasters & Famine: granary AND parish care only**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | The granary at {settlement} holds grain against a failed harvest and a house of the faith stands in the town; no infirmary stands at all. | PASS |
| 2 | face | Grain is held in the granary at {settlement}, reserves against hunger, and the parish stands on the town's ground. No house that takes in the sick stands in the town. | PASS |
| 3 | face | What the town holds back is grain against a failed harvest, and a house of the faith stands at {settlement}; no ward for the sick is kept in the town. | PASS |
| 4 | face | Against a failed harvest the granary at {settlement} holds grain in store, and a house of the faith keeps its ground in the town. The town has no hospital. | PASS |
| 5 | street | The parish stands at {settlement} and the town has no infirmary. Grain sits in the town's granary, held against hunger. | PASS |
| 6 | face | The town has a house of the faith and no ward for the sick. At {settlement} the town's grain is in store against a failed harvest. | PASS |
| 7 | face | Grain is held back at {settlement} against a failed harvest, and no house that takes in the sick stands in the town. The town's house of the faith stands on its own ground. | PASS |
| 8 | face | A house of the faith is on the town's ground at {settlement}, and no infirmary is. The granary keeps the town's grain against a failed harvest. | PASS |
| 9 | visitor | A stranger finds a house of the faith at {settlement} and no infirmary in the town. The town's granary holds grain against a failed harvest. | PASS |
| 10 | face | A stranger comes to {settlement} and sees a house of the faith standing and no ward for the sick in the town. Grain is held in the town's granary against hunger. | PASS |
| 11 | face | To a stranger arriving at {settlement} a house of the faith stands in plain sight, and no house for the sick stands in the town. The town's granary holds back grain against a failed harvest. | PASS |
| 12 | face | The parish is what a stranger finds standing at {settlement}, with no hospital in the town. The granary holds the town's grain against a failed harvest. | PASS |

**24. Disasters & Famine: granary, NO medical provision**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | A granary is entered at {settlement}, and the town has neither a parish nor a house for the sick. | PASS |
| 2 | face | A store of grain is set down at {settlement}, and the town is without a house for the sick or a parish. | PASS |
| 3 | face | The town of {settlement} has grain in store. Beside the store no house for the sick or parish stands. | PASS |
| 4 | face | Carried as standing at {settlement} is a granary, and a house for the sick and a parish are not. | PASS |
| 5 | unfolding | Grain stays in store here, and the town stays without a parish or a house for the sick. | PASS |
| 6 | face | The store goes on holding grain, and the town goes on with neither a house for the sick nor a parish. | PASS |
| 7 | face | Stored grain stays stored, and no house for the sick or parish stands in the town. | PASS |
| 8 | face | Here the store keeps its grain, and a parish and a house for the sick stay absent. | PASS |
| 9 | street | The granary at {settlement} is where the grain is, and a parish and a house for the sick are not in the town. | PASS |
| 10 | face | Grain lies in the store at {settlement}, and no house for the sick or parish is part of the place. | PASS |
| 11 | face | Grain is in the granary at {settlement}, with neither a parish nor a house for the sick on the same ground. | PASS |
| 12 | face | Grain has a store at {settlement}, and no infirmary or parish stands in this town. | PASS |

**25. Disasters & Famine: NO reserves, hospital present**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | Those tending the sick are entered at {settlement}, and against hunger no granary. | PASS |
| 2 | face | Set down at {settlement} are those tending the sick. The town carries no granary against hunger. | PASS |
| 3 | face | The town of {settlement} has those tending the sick entered, and against hunger sets down no granary. | PASS |
| 4 | face | What is entered at {settlement} are those tending the sick, and no granary against hunger is carried. | PASS |
| 5 | street | The town has those tending the sick. Against hunger the town keeps no granary. | PASS |
| 6 | face | Those tending the sick are in the town, and against hunger the town is without a granary. | PASS |
| 7 | face | What the town has are those tending the sick, and against hunger no granary. | PASS |
| 8 | face | In the town are those tending the sick, and against hunger no granary is kept. | PASS |
| 9 | unfolding | Those tending the sick stand at {settlement}, and against hunger no granary stands. | PASS |
| 10 | face | Here at {settlement} stand those tending the sick. Against hunger no granary stands in the town. | PASS |
| 11 | face | What stands at {settlement} are those tending the sick, and what does not is a granary against hunger. | PASS |
| 12 | face | The town of {settlement} has those tending the sick standing, and against hunger no granary. | PASS |

**26. Disasters & Famine: NO reserves, NO medical provision**

| # | stance | face | verdict |
|---|---|---|---|
| 1 | ledger | {settlement} keeps no granary to hold grain back, and no infirmary stands to treat the sick. | PASS |
| 2 | face | No house that takes in the sick stands at {settlement}, nor any storehouse for grain. | PASS |
| 3 | face | The granary that would store grain is not built at {settlement}, and neither is a house for the sick. | PASS |
| 4 | face | No infirmary is carried standing at {settlement}, and no granary. | PASS |
| 5 | street | No granary stands in the place, and no infirmary. | PASS |
| 6 | face | The place is without a house for the sick and without a granary to hold grain back. | PASS |
| 7 | face | A granary is not among the buildings of the place, nor a house for the sick. | COND-H(village) F1-25 — 'without anywhere for the sick' — the required village Parish church (clergy tend the sick on the engine's own line). |
| 8 | face | The place is without a granary, and without anywhere for the sick. | PASS |
| 9 | visitor | A stranger looking for the granary at {settlement} finds no such building, and no house that takes in the sick. | PASS |
| 10 | face | A stranger crossing {settlement} passes no infirmary, and sees no storehouse for grain. | PASS |
| 11 | face | The infirmary a stranger looks for at {settlement} is not built, and no granary stands. | PASS |
| 12 | face | A stranger arrives at {settlement} and comes upon no granary, and no house for the sick. | PASS |

**LICENCE 471ce894a totals (CONFIRMED count of the verdicts above):** 312 faces · FAIL 0 · COND 1 · PASS 311. Floor tallies over the non-PASS verdicts: F1-25 ×1.

## 3. REFUTATION LEDGER SUMMARY

| version | faces | FAIL (every matching town / floor-2 grammar) | COND (named subset) | flagged total | flagged rate | floor-2 breaches | floor-1 findings | floor-4 |
|---|---|---|---|---|---|---|---|---|
| shipped | 78 | 27 | 11 | 38 | 49% | 26 faces carry an F2 breach | 16 | 1 |
| licence | 312 | 0 | 1 | 1 | 0.3% | 0 | 1 | 0 |
| re-cut (288 new faces) | 288 | 2 | 38 | 40 | 13.9% | 1 | 39 | 0 |
| re-cut annex as it stands (294 incl. 6 residual shipped) | 294 | 6 | 40 | 46 | 15.6% | | | |

Strip the contestable F1-12 class (16 re-cut faces where the page's own machine line "Courts prosecute" / "Full legal infrastructure" agrees with the face) and the re-cut's flagged rate on its 288 new faces is **24/288 = 8.3%**, of which 2 are unconditional. The shipped corpus's unconditional rate is 27/78 = 35%, nearly all floor 2. The licence text is lawful to the point of one conditional.

**The five worst re-cut failures, quoted with the denying field:**

1. `plagued, perimeter AND organized force` #4 — *"The roll at {settlement} says who can be put out … Both entries stand in the record."* Denied by the roll holder: `holderTable.js:279-288` — "ONE institution in the whole shipped roster keeps a muster: the Citizen militia. A town with a Garrison and no militia has men under arms and no roll of them." The pool is keyed on a garrison; no generated roster pairs one with a militia. F1-24.
2. `force with NO walls` #10 — *"The garrison at {settlement} is quartered among houses, and a stranger goes by it without knowing."* Denied by the only town-tier garrison row, `Barracks` (`institutionalCatalog.js:1363`, "housing for guards or small garrison", R-3). F1 on the row's own description.
3. `Economic CRITICAL` #8 — *"When something serious begins, nothing in the town begins with it."* Denied at town tier by the required `Town watch` and `Town hall` rows and by any `Barracks` or charter hall; the band is `scores.economic`, a coin-and-storage measure that carries no organisation fact. F1-25 — the pool reads a money band as an absence of bodies.
4. `settled, nothing organized` #4 — *"Why nothing stands round {settlement} is entered nowhere … because the record gives none."* On the same tab DS-DEF-11 prints UNWALLED-SMALL "too small to wall and knows it" or UNWALLED-LARGE "spending its defense money on something else, and the books say what." The page gives a reason in the next box. F1 at page grain (R-1 may file it as WIRING; the self-contradiction stands either way).
5. `Economic STRONG` #7 — *"A bad season here would not change the shape of the week."* F2-05: a modal-future course over a season, the table's own example shape ("would not last a winter"); and false outright on a STRONG town whose stress banner reads "Land-based economic activity is suspended".

Runner-up class: `neither walls nor force` #2/#3/#5/#6 — *"Nothing at {settlement} is quartered or drilled at the town's own charge"* — at town tier the required `Town watch` is paid from the military purse (F4-19). PASS at village.

**What I hunted for and did not find in the re-cut.** Floor-2 aspectual and rate claims: the lexical scan of all 288 faces surfaced only "older work than" ×2 (freed by F2-07, and the exemplar pack's own aimed move), "never" ×4 (all scoping, none a frequency over events), "again" ×1 (enumerative), "already" ×1 (stative), "will" ×4 (all habitual refusals — "nobody will say why"), and the one modal course above. No "still", "no longer", "lately", "these days", "most nights", "for years", "since", no count, no date. `plagued` is read as monsters in all 36 plagued faces; `settled` as the quiet tier in all 24; no purse is split against the two-purse model (both "one purse" faces agree with F4-02/F4-03); no wall decays on a clock; no named person, no god acts. The re-cut's predicted failure mode did not materialise. Its ACTUAL failure mode is floor 1 by inference — a face that fills the silence with a body-shaped claim (a roll, quarters, "nobody to send", "no note") that a required roster row or a same-tab sentence denies.

## 4. GM READING — five pools, three versions side by side (PLAUSIBLE: a reader's judgment)

### 3. plagued, NO perimeter and NO force — pick: **RE-CUT**

The re-cut is the only version that hands a Thursday-night GM something to run: loose stock in the road after dark, a stranger's shutter barred from the inside, "what is heard out there is not always stock." The shipped lines are good but generic (the stranger "understands the danger before anybody explains it"); the licence lines are a receipt. All three are true to the machine line beside them ("no organized defense and no perimeter").

- best shipped: *A stranger arriving at {settlement} understands the danger before anybody explains it, because nothing about the place is arranged as though danger were expected to be met.*
- best licence: *Out in monster country {settlement} keeps neither works nor muster.*
- best re-cut: *The argument at {settlement} is whose stock is loose in the road once the light goes, and not what a loose animal draws in from the fields.*

### 7. settled, nothing organized — pick: **RE-CUT (with #4 struck)**

The shipped pool's best line is its unlawful one ("at any hour … nothing that would justify a watch" — a totality on a merely down-multiplied threat, and at town tier a watch is required). The licence pool says "no works and no muster … few beasts" twelve ways. The re-cut's "Everything the town keeps up faces inward" is the sentence a GM remembers, and "tracks that go somewhere and nothing set against them" is a scene. Face #4 contradicts DS-DEF-11 on the same tab and must go.

- best shipped: *A stranger walks out of {settlement} in any direction at any hour and meets nothing that would justify a watch.*
- best licence: *Out of a country low in beasts a stranger comes on {settlement} and finds no works and no muster in the town.*
- best re-cut: *Everything the town keeps up faces inward. The quiet country at its back is the one direction nothing is turned toward.*

### 12. militia only — pick: **RE-CUT**

The shipped line "have never stood in a line with anybody" is a history AND is denied by the militia row's own description ("drill and muster"). The licence pool repeats "part-time … not a professional garrison" in every one of twelve faces (content-type ratio 0.23, the lowest in the block). The re-cut gives the GM a muster that "lives in houses" and a defence whose directions "end at people and never at a place" — and is lawful throughout.

- best shipped: *A stranger at {settlement} meets armed townspeople who are entirely competent on their own ground and have never stood in a line with anybody.*
- best licence: *The people a stranger passes at {settlement} are at their own work behind no wall. Their muster is part-time, not a professional garrison.*
- best re-cut: *On an ordinary day the muster is invisible and those on it are at their trades. It comes out of the houses when it is called, and a force that soldiers for a living is not stopped by a thing that lives in houses.*

### 15. court without detention — pick: **RE-CUT (same caveat as shipped)**

Shipped and re-cut share the F1-12 exposure (a "court" that is the Town hall handing down fines and banishment) and share the page's own agreement with them ("Courts prosecute but limited detention"). Given that, the re-cut's "A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here" is a faction seed; the shipped "reaches for the purse or the road" is the same thought unlanded; the licence "under it stands no gaol" is a field printed as a sentence.

- best shipped: *The town's law can name a wrong and cannot keep the person who did it, so it reaches for the purse or the road.*
- best licence: *Law here is formal, and under it stands no gaol.*
- best re-cut: *A fine is nothing to a house that can pay it, and the road is hardest on whoever has people here. Naming is what the law can do; keeping is not.*

### 26. NO reserves, NO medical provision — pick: **RE-CUT**

Only reachable at village and below, where a parish church is required — so every version that says "nobody / nowhere for the sick" brushes the clergy line on the same row; the re-cut does it once (#5), the shipped once (#1), the licence once (#7). Past that, the re-cut's "a name and a door" is the whole village in seven words and it is true; the shipped "directed to neither, because there is neither" is a good dry note; the licence is inventory.

- best shipped: *A stranger looking for the granary or the sick-house at {settlement} is directed to neither, because there is neither.*
- best licence: *A stranger crossing {settlement} passes no infirmary, and sees no storehouse for grain.*
- best re-cut: *The answer a stranger gets at {settlement}, whether he asks after the store or after the sick-house, is a name and a door.*

One pool where the re-cut is WORSE than shipped on truth-to-tab: `Economic CRITICAL`. The shipped lines are about money ("cannot fund a response … nothing to spend") and match the badge beside them; the re-cut moved the whole pool to organisation ("nobody it belongs to", "nothing in the town is set up to do it"), which the band does not carry and a town-tier roster denies. It reads beautifully and it is the wrong fact.

## 5. CRAFT — the pool-grain DULL test on the 24 re-cut pools (CONFIRMED metrics; PLAUSIBLE verdicts)

Metric: distinct content words / content tokens across the 12 faces (`{settlement}` and stop-words excluded), the words repeated most, the `,and` join count, and distinct openers. The licence pools ran 0.16–0.49 on the same ratio (median 0.34); the re-cut runs 0.51–0.72 (median 0.61). DULL is called where a single content skeleton (the same nouns in the same relation) appears in ≥10 of 12 faces.

| pool | types/content | ratio | most repeated | `,and`/12 | verdict | the collapse named |
|---|---|---|---|---|---|---|
| Beasts & Monsters: `plagued`, perimeter AND organized force | 109/179 | 0.61 | country×8, wall×8, creatures×6, out×6 | 12 | **PASS** |  |
| Beasts & Monsters: `plagued`, perimeter but NO force to hold it | 116/229 | 0.51 | country×13, garrison×12, militia×12, plagued×11 | 12 | **DULL** | "no garrison and no militia" + "plagued" + "the works" in 12/12; garrison×12, militia×12, plagued×11, works×11. The particulars (animals in before dusk, water in company, stores against the inner face) are good and are buried under the same three-noun receipt every time. |
| Beasts & Monsters: `plagued`, NO perimeter and NO force | 122/210 | 0.58 | garrison×12, muster×12, country×8, wall×8 | 8 | **DULL** | the negation triad "no wall, no garrison, no muster" in 12/12 (garrison×12, muster×12). The strongest particulars in the block (loose stock, the barred shutter) and still every face pays the same toll. |
| Beasts & Monsters: `frontier`, credible deterrence | 106/172 | 0.62 | works×12, frontier×9, country×7, town×5 | 12 | **PASS** |  |
| Beasts & Monsters: `frontier`, force without a perimeter | 108/180 | 0.60 | town×14, people×7, armed×5, comes×4 | 8 | **PASS** |  |
| Beasts & Monsters: `settled`, defenses beyond the need | 112/163 | 0.69 | works×12, country×7, them×5, against×4 | 9 | **PASS** |  |
| Beasts & Monsters: `settled`, nothing organized | 102/168 | 0.61 | country×12, town×7, nothing×6, quiet×5 | 7 | **PASS** |  |
| Invasion & War: walls AND professional garrison | 90/157 | 0.57 | men×11, work×9, kept×6, wage×5 | 8 | **PASS (borderline)** | "the work + the men + the wage" skeleton in 10/12 (men×11, work×9), but the moves differ (books, clerk, charge, children, travellers, argument). |
| Invasion & War: walls with citizen militia | 97/161 | 0.60 | people×6, town×5, works×4, them×4 | 8 | **PASS** |  |
| Invasion & War: force with NO walls | 103/199 | 0.52 | men×14, would×7, works×6, town×5 | 7 | **PASS (borderline)** | the raid/siege antithesis in 4/12 and "men can be gone around" in 3/12; ratio 0.52 is the second-lowest. |
| Invasion & War: militia only | 138/225 | 0.61 | town×8, muster×6, band×4, army×4 | 11 | **PASS** |  |
| Invasion & War: neither walls nor force | 94/178 | 0.53 | against×9, soldiers×7, own×7, nothing×6 | 8 | **DULL** | "no wall / no soldiers of its own / no drill / no roll" in 11/12; against×9, soldiers×7, own×7. |
| Internal Security: full legal chain (court AND prison) | 100/138 | 0.72 | cells×9, court×6, one×4, out×4 | 5 | **PASS** |  |
| Internal Security: court without detention | 127/210 | 0.60 | person×8, same×5, here×5, because×5 | 8 | **PASS (borderline)** | "coin or the road / nobody is kept" in 10/12 but through six different rooms (book, line, table, door, houses, permit). |
| Internal Security: detention without process | 118/166 | 0.71 | person×5, town×5, nothing×4, do×4 | 6 | **PASS** |  |
| Internal Security: no legal infrastructure | 107/166 | 0.65 | room×7, town×5, hearing×5, whoever×4 | 5 | **PASS** |  |
| Economic Survival: `STRONG` | 101/164 | 0.62 | wrong×6, trouble×6, one×5, town×5 | 9 | **PASS** |  |
| Economic Survival: `WEAK` | 96/150 | 0.64 | town×10, nothing×5, would×5, work×4 | 8 | **PASS** |  |
| Economic Survival: `CRITICAL` | 104/150 | 0.69 | town×9, would×5, can×5, something×4 | 8 | **PASS** |  |
| Disasters & Famine: granary AND hospital | 88/163 | 0.54 | grain×11, sickness×11, house×10, against×6 | 7 | **DULL** | "grain … house that answers sickness … religious" in 11/12; grain×11, sickness×11, house×10; ratio 0.54. |
| Disasters & Famine: granary AND parish care only | 92/156 | 0.59 | granary×10, parishes×9, town×6, sick×6 | 8 | **DULL** | "granary / the parishes / no hospital" in 12/12; granary×10, parishes×9. |
| Disasters & Famine: granary, NO medical provision | 98/158 | 0.62 | grain×7, town×7, fever×5, store×4 | 7 | **PASS** |  |
| Disasters & Famine: NO reserves, hospital present | 93/159 | 0.58 | against×11, sickness×8, bad×8, town×5 | 9 | **DULL** | one construction, the antithesis "X for the sick, nothing for hunger", in 12/12; against×11; 11/12 openers. |
| Disasters & Famine: NO reserves, NO medical provision | 103/173 | 0.59 | room×6, store×5, house×5, own×5 | 10 | **PASS** |  |

**CRAFT tally: 18 PASS · 6 DULL** of 24 re-cut pools. The DULL six are exactly the pools whose key is a conjunction of absences or a fixed pair (no-garrison-no-militia, no-wall-no-force, grain-and-sickness): the writers restated the key in every face and hung a particular on it. The PASS pools are the ones whose faces stand in different rooms (the books, the gate, the road, the argument) and let the key stay implicit.

## 6. VERDICT

**Is the re-cut better?** Yes on vividness, yes on lawfulness against the shipped corpus, no against the licence text, and the risk the owner is buying is a specific, nameable one. (a) Vividness, CONFIRMED: at an equal 1,900-token budget the re-cut carries 377 distinct words and 349 content types against the licence text's 168/143 and the shipped 519/489; its per-pool content-type ratio doubles the licence text's (median 0.61 vs 0.34); 18 of 24 pools pass the DULL test. Its `,and` join rate (85%) is the worst of the three and its mean unit is the longest (27.7 words) — the drafts are richer, not tighter. (b) Lawfulness, CONFIRMED counts / PLAUSIBLE grounds: on 288 new faces the re-cut has 2 unconditional failures (0.7%) and 38 conditional ones (13.2%), 16 of those contestable because the page's own machine line agrees with the face; the shipped corpus has 27 unconditional failures on 78 faces (35%, 25 of them floor 2) and 11 conditional; the licence text has 0 and 1. So the re-cut removes the floor-2 disease almost entirely (one modal course in 288 faces, where the shipped had one every three lines) and replaces it with a smaller floor-1 exposure of a different kind. (c) The risk, PLAUSIBLE from the keys and the catalog: the re-cut's floor-1 exposure is not random — it is concentrated where a face fills a key's silence with a BODY the roster can deny: a muster roll on a garrison town (no keeper exists), a garrison "among houses" (the only town garrison row is a barracks), "nobody is set up to respond" on a CRITICAL money band (every town has a required watch and hall), "no note against it" on an underfunded gate (the funding note prints under the row). By tier: on a generated town-tier settlement, roughly 24 of the 288 faces (8%) would print beside a roster row or a same-tab sentence that denies them, and about 16 more sit on the contestable Town-hall-as-court seam; on a village nearly all of those go quiet and the exposure falls under 3%. After the pulse moves the town the picture is the same for all three versions — DS-DEF-2 rows 3–5 read a generation-time snapshot (W-11) and rows 1–2 read live forces — except that the re-cut's richer faces carry more incidental claims (a gate, a barracks, a purse) for a ruin or a demotion to falsify. Net: the owner trades a corpus that was one-third unlawful by grammar for one that is ~8% unlawful by inference at the tier that matters, with the prose a GM would actually keep.

## 7. THE ONE THING

The re-cut's refuter is looking for the wrong crime: it hunted aspect and rate and found none, while every real finding here is a body inferred into a silence — a roll, a barracks, a responder, a note — that a `required: true` roster row denies. Put the tier's required rows (Town watch, Town hall, Town granary, Parish churches, village Parish church) in front of the writer and the refuter as the FIRST line of every DS-DEF-2 key card, and the round-2 exposure drops to the two unconditional failures.

---
*Method receipts: `scratchpad/extract.py` (parsing, opener variety, craft metrics, floor-2 lexical scan) and `scratchpad/render.py` (the verdict tables and this file). The engine reads: `threatAssessment.js:33-196`, `safetyProfile.js:255-400`, `priorityHelpers.js:45-77`, `defenseGenerator.js:159-290`, `defenseStateProse.js:393-597` (keys), `:1055-1067` (DEF-11 key), `defenseDisplay.js:319-320` (fundingNote), `DefenseTab.jsx:322-343`, `holderTable.js:279-288`, `institutionalCatalog.js` rows 335, 763, 845, 867, 925, 1260, 1275, 1332, 1340, 1348, 1363, 1550, 1564, 1814, 1910, 1918-1925, 2268, 2275, 2355.*
